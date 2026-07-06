import type {
  BuilderCanvasNode,
  ResponsiveConfig,
  ResponsiveOverride,
} from '@/lib/builder/canvas/types';
import { isContainerLikeKind } from '@/lib/builder/canvas/types';
import { isTopLevelFlowSection } from '@/lib/builder/canvas/flow';
import {
  autoFitMobileTree,
  type MobileAutoFitOverride,
  VIEWPORT_BREAKPOINTS,
} from '@/lib/builder/canvas/responsive';

type PublishedAutoFitViewport = 'tablet' | 'mobile';
type DefinedResponsiveOverride = NonNullable<ResponsiveOverride>;
type PublishedAutoFitRect = MobileAutoFitOverride['rect'];

type PublishedAutoFitConfig = {
  readonly viewport: PublishedAutoFitViewport;
  readonly width: number;
};

const PUBLISHED_AUTO_FIT_VIEWPORTS: readonly PublishedAutoFitConfig[] = [
  { viewport: 'tablet', width: VIEWPORT_BREAKPOINTS.tablet },
  { viewport: 'mobile', width: VIEWPORT_BREAKPOINTS.mobile },
];

function nodeForViewportAutoFit(
  node: BuilderCanvasNode,
  viewport: PublishedAutoFitViewport,
): BuilderCanvasNode {
  if (viewport === 'mobile') return node;
  const responsive = node.responsive;
  if (!responsive?.mobile) return node;
  // autoFitMobileTree skips mobile-authored nodes; tablet derivation must ignore that bucket.
  return {
    ...node,
    responsive: { tablet: responsive.tablet },
  };
}

function isTopLevelPageRoot(node: BuilderCanvasNode): boolean {
  if (node.parentId || !isContainerLikeKind(node.kind)) return false;
  const content = node.content as { as?: unknown };
  return content.as === 'main';
}

function isStandaloneTopLevelAbsoluteNode(node: BuilderCanvasNode): boolean {
  return !node.parentId && !isTopLevelFlowSection(node) && !isTopLevelPageRoot(node);
}

function scaleStandaloneRect(node: BuilderCanvasNode, viewportWidth: number): PublishedAutoFitRect {
  const positionScale = Math.min(1, viewportWidth / VIEWPORT_BREAKPOINTS.desktop);
  const sizeScale = node.rect.width > viewportWidth ? viewportWidth / node.rect.width : 1;
  const width = Math.max(1, Math.round(node.rect.width * sizeScale));
  const height = Math.max(1, Math.round(node.rect.height * sizeScale));
  const scaledX = Math.max(0, Math.round(node.rect.x * positionScale));
  const maxX = Math.max(0, viewportWidth - width);
  return {
    x: Math.min(scaledX, maxX),
    y: Math.max(0, Math.round(node.rect.y * positionScale)),
    width,
    height,
  };
}

function scaleStandaloneFontSize(node: BuilderCanvasNode, viewportWidth: number): number | undefined {
  const content = node.content as Record<string, unknown>;
  const baseFontSize = typeof content.fontSize === 'number' ? content.fontSize : undefined;
  if (baseFontSize === undefined) return undefined;
  const scale = node.rect.width > viewportWidth ? viewportWidth / node.rect.width : 1;
  return Math.max(8, Math.min(160, Math.round(baseFontSize * scale)));
}

function overrideForPublishedNode(
  node: BuilderCanvasNode,
  generated: MobileAutoFitOverride,
  viewportWidth: number,
): MobileAutoFitOverride {
  if (!isStandaloneTopLevelAbsoluteNode(node)) return generated;
  const fontSize = scaleStandaloneFontSize(node, viewportWidth);
  return {
    ...generated,
    rect: scaleStandaloneRect(node, viewportWidth),
    ...(fontSize !== undefined ? { fontSize } : {}),
  };
}

function buildViewportOverride(
  previous: ResponsiveOverride,
  generated: MobileAutoFitOverride,
): DefinedResponsiveOverride | null {
  const needsRectPatch = previous?.rect === undefined;
  const needsFontSizePatch = generated.fontSize !== undefined && previous?.fontSize === undefined;
  if (!needsRectPatch && !needsFontSizePatch) return null;

  return {
    ...(previous ?? {}),
    ...(needsRectPatch ? { rect: generated.rect } : {}),
    ...(needsFontSizePatch ? { fontSize: generated.fontSize } : {}),
  };
}

function mergeViewportOverride(
  responsive: ResponsiveConfig,
  viewport: PublishedAutoFitViewport,
  override: DefinedResponsiveOverride,
): ResponsiveConfig {
  if (viewport === 'tablet') {
    return {
      ...(responsive ?? {}),
      tablet: override,
    };
  }

  return {
    ...(responsive ?? {}),
    mobile: override,
  };
}

function viewportOverride(
  responsive: ResponsiveConfig,
  viewport: PublishedAutoFitViewport,
): ResponsiveOverride {
  return viewport === 'tablet' ? responsive?.tablet : responsive?.mobile;
}

function applyPublishedAutoFitForViewport(
  nodes: BuilderCanvasNode[],
  config: PublishedAutoFitConfig,
): BuilderCanvasNode[] {
  const fitSourceNodes = nodes.map((node) => nodeForViewportAutoFit(node, config.viewport));
  const overrides = autoFitMobileTree(fitSourceNodes, config.width);
  if (overrides.length === 0) return nodes;

  const overrideById = new Map(overrides.map((override) => [override.nodeId, override]));
  let changed = false;
  const nextNodes = nodes.map((node): BuilderCanvasNode => {
    const generated = overrideById.get(node.id);
    if (!generated) return node;
    const publishedOverride = overrideForPublishedNode(node, generated, config.width);

    const previousResponsive = node.responsive;
    const nextOverride = buildViewportOverride(
      viewportOverride(previousResponsive, config.viewport),
      publishedOverride,
    );
    if (!nextOverride) return node;

    changed = true;
    return {
      ...node,
      responsive: mergeViewportOverride(previousResponsive, config.viewport, nextOverride),
    };
  });

  return changed ? nextNodes : nodes;
}

export function applyPublishedResponsiveAutoFit(nodes: BuilderCanvasNode[]): BuilderCanvasNode[] {
  return PUBLISHED_AUTO_FIT_VIEWPORTS.reduce(
    (nextNodes, config) => applyPublishedAutoFitForViewport(nextNodes, config),
    nodes,
  );
}

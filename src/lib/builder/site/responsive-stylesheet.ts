import type {
  BuilderCanvasNode,
  ResponsiveConfig,
  ResponsiveOverride,
} from '@/lib/builder/canvas/types';
import { isContainerLikeKind } from '@/lib/builder/canvas/types';
import { computeTopLevelFlowSectionMetrics, isTopLevelFlowSection } from '@/lib/builder/canvas/flow';
import { parentUsesFlowLayout } from '@/lib/builder/canvas/tree';
import {
  resolveViewportHidden,
  resolveViewportRect,
  type Viewport,
  VIEWPORT_BREAKPOINTS,
} from '@/lib/builder/canvas/responsive';
import { applyPublishedResponsiveAutoFit } from '@/lib/builder/site/published-responsive-autofit';

const TABLET_MAX = VIEWPORT_BREAKPOINTS.tablet + 255;
const MOBILE_MAX = VIEWPORT_BREAKPOINTS.tablet - 1;

function escapeCssId(id: string): string {
  return id.replace(/\\/g, '\\\\').replace(/"/g, '\\"');
}

function nodeSelector(id: string): string {
  return `.builder-pub-node[data-node-id="${escapeCssId(id)}"]`;
}

function isTopLevelPageRoot(node: BuilderCanvasNode): boolean {
  if (node.parentId || !isContainerLikeKind(node.kind)) return false;
  const content = node.content as { as?: unknown };
  return content.as === 'main';
}

function buildResponsiveOverrideRule(
  node: BuilderCanvasNode,
  override: ResponsiveOverride,
  inFlowContext = false,
): string {
  if (!override) return '';
  const declarations: string[] = [];
  const isFlowSection = isTopLevelFlowSection(node);
  if (override.rect) {
    const r = override.rect;
    // M177: For nodes inside flex/grid containers, skip left/top entirely.
    // Their positioning is driven by flow (flex/grid + DOM order), not absolute rect coords.
    // Responsive overrides for x/y would incorrectly offset the element even when position:relative.
    // Width/height overrides remain valid and useful for sizing flex items.
    if (!inFlowContext && !isFlowSection) {
      if (isTopLevelPageRoot(node)) {
        declarations.push('position: relative');
      } else {
        declarations.push(`position: ${node.sticky ? 'sticky' : 'absolute'}`);
        if (r.x !== undefined) declarations.push(`left: ${r.x}px`);
        if (r.y !== undefined) declarations.push(`top: ${r.y}px`);
      }
    }
    if (r.width !== undefined) declarations.push(`width: ${r.width}px`);
    if (r.height !== undefined) {
      declarations.push(`${isFlowSection ? 'min-height' : 'height'}: ${r.height}px`);
    }
  }
  if (override.hidden) {
    declarations.push('display: none');
  }
  if (override.fontSize !== undefined) {
    declarations.push(`font-size: ${override.fontSize}px`);
  }
  if (declarations.length === 0) return '';
  return `${nodeSelector(node.id)} { ${declarations.map((d) => `${d} !important`).join('; ')}; }`;
}

/**
 * Builds margin-top gap rules for a group of flow siblings so that their
 * responsive y/height overrides produce correct vertical stacking in
 * published output (via !important margin-top in the viewport media query).
 *
 * Works for both:
 *  - Top-level composites (document flow)
 *  - Direct children of any flex/grid layout containers (inner flow)
 *
 * Uses the shared resolveViewportRect for consistent cascade (tablet/mobile).
 */
function buildFlowGapStylesheetForViewport(
  flowSiblings: BuilderCanvasNode[],
  viewport: 'tablet' | 'mobile',
): string[] {
  const v: Viewport = viewport;
  const visibleFlowSiblings = flowSiblings.filter((node) => !resolveViewportHidden(node, v));
  if (visibleFlowSiblings.length === 0) return [];

  const anyOverride = visibleFlowSiblings.some((node) => {
    const responsive = node.responsive as ResponsiveConfig | undefined;
    const bucket = viewport === 'mobile'
      ? (responsive?.mobile ?? responsive?.tablet)
      : responsive?.tablet;
    return bucket?.rect?.y !== undefined || bucket?.rect?.height !== undefined;
  });
  if (!anyOverride) return [];

  const resolved = visibleFlowSiblings.map((node) => {
    const r = resolveViewportRect(node, v);
    return { node, y: r.y, height: r.height };
  }).sort((left, right) =>
    left.y - right.y
    || left.node.zIndex - right.node.zIndex
    || left.node.id.localeCompare(right.node.id),
  );

  const rules: string[] = [];
  let previousBottom = 0;
  for (const entry of resolved) {
    const marginTop = Math.max(0, entry.y - previousBottom);
    rules.push(`${nodeSelector(entry.node.id)} { margin-top: ${marginTop}px !important; }`);
    previousBottom = Math.max(previousBottom + marginTop + entry.height, entry.y + entry.height);
  }
  return rules;
}

function buildTopLevelFlowSectionStylesheetForViewport(
  nodes: BuilderCanvasNode[],
  viewport: 'tablet' | 'mobile',
): string[] {
  const visibleNodes = nodes.filter((node) => node.visible !== false);
  const viewportVisibleNodes = visibleNodes.filter((node) => {
    if (!isTopLevelFlowSection(node)) return true;
    return !resolveViewportHidden(node, viewport);
  });
  const flowSections = viewportVisibleNodes.filter(isTopLevelFlowSection);
  const anyOverride = flowSections.some((node) => {
    const responsive = node.responsive as ResponsiveConfig | undefined;
    const bucket = viewport === 'mobile'
      ? (responsive?.mobile ?? responsive?.tablet)
      : responsive?.tablet;
    return bucket?.rect?.y !== undefined || bucket?.rect?.height !== undefined;
  });
  if (!anyOverride) return [];

  const metrics = computeTopLevelFlowSectionMetrics(viewportVisibleNodes, viewport);
  return [...flowSections]
    .sort((left, right) => {
      const leftRect = resolveViewportRect(left, viewport);
      const rightRect = resolveViewportRect(right, viewport);
      return leftRect.y - rightRect.y
        || left.zIndex - right.zIndex
        || left.id.localeCompare(right.id);
    })
    .flatMap((node) => {
      const metric = metrics.get(node.id);
      if (!metric) return [];
      return [
        `${nodeSelector(node.id)} { margin-top: ${metric.marginTop}px !important; min-height: ${metric.minHeight}px !important; }`,
      ];
    });
}

export function buildResponsiveStylesheet(nodes: BuilderCanvasNode[]): string {
  const tabletRules: string[] = [];
  const mobileRules: string[] = [];

  // Build lookup for efficient parent layout checks (M177 responsive-in-flow)
  const nodesById = new Map(nodes.map((n) => [n.id, n]));

  for (const node of nodes) {
    const responsive = node.responsive as ResponsiveConfig | undefined;
    if (!responsive) continue;

    const inFlowContext = parentUsesFlowLayout(node, nodesById);

    if (responsive.tablet) {
      const rule = buildResponsiveOverrideRule(node, responsive.tablet, inFlowContext);
      if (rule) tabletRules.push(rule);
    }

    if (responsive.mobile || responsive.tablet) {
      const merged: ResponsiveOverride = {
        ...(responsive.tablet ?? {}),
        ...(responsive.mobile ?? {}),
        rect: {
          ...(responsive.tablet?.rect ?? {}),
          ...(responsive.mobile?.rect ?? {}),
        },
      };
      if (merged.rect && Object.keys(merged.rect).length === 0) {
        merged.rect = undefined;
      }
      const rule = buildResponsiveOverrideRule(node, merged, inFlowContext);
      if (rule) mobileRules.push(rule);
    }
  }

  // Generalized flow gap rules (P0-03): top-level sections + direct children
  // of any flex/grid containers. This ensures responsive y/height overrides on
  // inner flow children also produce correct margin-top spacing in published pages.
  const tabletGapRules: string[] = [];
  const mobileGapRules: string[] = [];

  // Top-level flow sections.
  tabletGapRules.push(...buildTopLevelFlowSectionStylesheetForViewport(nodes, 'tablet'));
  mobileGapRules.push(...buildTopLevelFlowSectionStylesheetForViewport(nodes, 'mobile'));

  // Inner flow children: direct children of containers with layoutMode flex or grid
  for (const container of nodes) {
    if (!isContainerLikeKind(container.kind)) continue;
    const lm = (container.content as { layoutMode?: string } | undefined)?.layoutMode;
    if (lm !== 'flex' && lm !== 'grid') continue;
    const directChildren = nodes.filter((child) => child.parentId === container.id);
    if (directChildren.length > 0) {
      tabletGapRules.push(...buildFlowGapStylesheetForViewport(directChildren, 'tablet'));
      mobileGapRules.push(...buildFlowGapStylesheetForViewport(directChildren, 'mobile'));
    }
  }

  if (tabletGapRules.length > 0) tabletRules.push(...tabletGapRules);
  if (mobileGapRules.length > 0) mobileRules.push(...mobileGapRules);

  let css = '';
  if (tabletRules.length > 0) {
    css += `@media (min-width: ${VIEWPORT_BREAKPOINTS.tablet}px) and (max-width: ${TABLET_MAX}px) {\n  ${tabletRules.join('\n  ')}\n}\n`;
  }
  if (mobileRules.length > 0) {
    css += `@media (max-width: ${MOBILE_MAX}px) {\n  ${mobileRules.join('\n  ')}\n}\n`;
  }
  return css;
}

export function buildPublishedResponsiveStylesheet(nodes: BuilderCanvasNode[]): string {
  return buildResponsiveStylesheet(applyPublishedResponsiveAutoFit(nodes));
}

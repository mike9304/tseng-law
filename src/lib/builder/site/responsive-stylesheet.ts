import type {
  BuilderCanvasNode,
  ResponsiveConfig,
  ResponsiveOverride,
} from '@/lib/builder/canvas/types';
import { isContainerLikeKind } from '@/lib/builder/canvas/types';
import { parentUsesFlowLayout } from '@/lib/builder/canvas/tree';
import { resolveViewportRect, type Viewport, VIEWPORT_BREAKPOINTS } from '@/lib/builder/canvas/responsive';

const TABLET_MAX = VIEWPORT_BREAKPOINTS.tablet + 255;
const MOBILE_MAX = VIEWPORT_BREAKPOINTS.tablet - 1;

function escapeCssId(id: string): string {
  return id.replace(/\\/g, '\\\\').replace(/"/g, '\\"');
}

function buildResponsiveOverrideRule(
  node: BuilderCanvasNode,
  override: ResponsiveOverride,
  inFlowContext = false,
): string {
  if (!override) return '';
  const declarations: string[] = [];
  if (override.rect) {
    const r = override.rect;
    // M177: For nodes inside flex/grid containers, skip left/top entirely.
    // Their positioning is driven by flow (flex/grid + DOM order), not absolute rect coords.
    // Responsive overrides for x/y would incorrectly offset the element even when position:relative.
    // Width/height overrides remain valid and useful for sizing flex items.
    if (!inFlowContext) {
      if (r.x !== undefined) declarations.push(`left: ${r.x}px`);
      if (r.y !== undefined) declarations.push(`top: ${r.y}px`);
    }
    if (r.width !== undefined) declarations.push(`width: ${r.width}px`);
    if (r.height !== undefined) declarations.push(`height: ${r.height}px`);
  }
  if (override.hidden) {
    declarations.push('display: none');
  }
  if (override.fontSize !== undefined) {
    declarations.push(`font-size: ${override.fontSize}px`);
  }
  if (declarations.length === 0) return '';
  return `[data-node-id="${escapeCssId(node.id)}"] { ${declarations.map((d) => `${d} !important`).join('; ')}; }`;
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

  const anyOverride = flowSiblings.some((node) => {
    const responsive = node.responsive as ResponsiveConfig | undefined;
    const bucket = viewport === 'mobile'
      ? (responsive?.mobile ?? responsive?.tablet)
      : responsive?.tablet;
    return bucket?.rect?.y !== undefined || bucket?.rect?.height !== undefined;
  });
  if (!anyOverride) return [];

  const resolved = flowSiblings.map((node) => {
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
    rules.push(`[data-node-id="${escapeCssId(entry.node.id)}"] { margin-top: ${marginTop}px !important; }`);
    previousBottom = Math.max(previousBottom + marginTop + entry.height, entry.y + entry.height);
  }
  return rules;
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

  // Generalized flow gap rules (P0-03): top-level composites + direct children
  // of any flex/grid containers. This ensures responsive y/height overrides on
  // inner flow children also produce correct margin-top spacing in published pages.
  const tabletGapRules: string[] = [];
  const mobileGapRules: string[] = [];

  // Top-level flow sections (composites without parent)
  const topLevelComposites = nodes.filter((node) => !node.parentId && node.kind === 'composite');
  tabletGapRules.push(...buildFlowGapStylesheetForViewport(topLevelComposites, 'tablet'));
  mobileGapRules.push(...buildFlowGapStylesheetForViewport(topLevelComposites, 'mobile'));

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

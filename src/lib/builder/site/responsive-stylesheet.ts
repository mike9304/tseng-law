import type {
  BuilderCanvasNode,
  ResponsiveConfig,
  ResponsiveOverride,
} from '@/lib/builder/canvas/types';
import { VIEWPORT_BREAKPOINTS } from '@/lib/builder/canvas/responsive';

const TABLET_MAX = VIEWPORT_BREAKPOINTS.tablet + 255;
const MOBILE_MAX = VIEWPORT_BREAKPOINTS.tablet - 1;

function escapeCssId(id: string): string {
  return id.replace(/\\/g, '\\\\').replace(/"/g, '\\"');
}

function buildResponsiveOverrideRule(
  node: BuilderCanvasNode,
  override: ResponsiveOverride,
): string {
  if (!override) return '';
  const declarations: string[] = [];
  if (override.rect) {
    const r = override.rect;
    if (r.x !== undefined) declarations.push(`left: ${r.x}px`);
    if (r.y !== undefined) declarations.push(`top: ${r.y}px`);
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

function buildFlowGapStylesheetForViewport(
  composites: BuilderCanvasNode[],
  viewport: 'tablet' | 'mobile',
): string[] {
  const anyOverride = composites.some((node) => {
    const responsive = node.responsive as ResponsiveConfig | undefined;
    const bucket = viewport === 'mobile'
      ? (responsive?.mobile ?? responsive?.tablet)
      : responsive?.tablet;
    return bucket?.rect?.y !== undefined || bucket?.rect?.height !== undefined;
  });
  if (!anyOverride) return [];

  const resolved = composites.map((node) => {
    const responsive = node.responsive as ResponsiveConfig | undefined;
    const tablet = responsive?.tablet?.rect ?? {};
    const mobile = responsive?.mobile?.rect ?? {};
    const y = viewport === 'mobile'
      ? (mobile.y ?? tablet.y ?? node.rect.y)
      : (tablet.y ?? node.rect.y);
    const height = viewport === 'mobile'
      ? (mobile.height ?? tablet.height ?? node.rect.height)
      : (tablet.height ?? node.rect.height);
    return { node, y, height };
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

  for (const node of nodes) {
    const responsive = node.responsive as ResponsiveConfig | undefined;
    if (!responsive) continue;

    if (responsive.tablet) {
      const rule = buildResponsiveOverrideRule(node, responsive.tablet);
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
      const rule = buildResponsiveOverrideRule(node, merged);
      if (rule) mobileRules.push(rule);
    }
  }

  const composites = nodes.filter((node) => !node.parentId && node.kind === 'composite');
  const tabletGap = buildFlowGapStylesheetForViewport(composites, 'tablet');
  if (tabletGap.length > 0) tabletRules.push(...tabletGap);
  const mobileGap = buildFlowGapStylesheetForViewport(composites, 'mobile');
  if (mobileGap.length > 0) mobileRules.push(...mobileGap);

  let css = '';
  if (tabletRules.length > 0) {
    css += `@media (min-width: ${VIEWPORT_BREAKPOINTS.tablet}px) and (max-width: ${TABLET_MAX}px) {\n  ${tabletRules.join('\n  ')}\n}\n`;
  }
  if (mobileRules.length > 0) {
    css += `@media (max-width: ${MOBILE_MAX}px) {\n  ${mobileRules.join('\n  ')}\n}\n`;
  }
  return css;
}

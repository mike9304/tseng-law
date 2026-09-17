import { resolveViewportRect } from '@/lib/builder/canvas/responsive';
import type { BuilderCanvasNode } from '@/lib/builder/canvas/types';

export const LEGACY_CONTACT_SCAFFOLD_ROOT_ID = 'contact-page-root';
export const LEGACY_CONTACT_SCAFFOLD_COMPOSITE_ID = 'contact-page-root-composite';
export const LEGACY_CONTACT_COMPONENT_KEY = 'legacy-page-contact';

export type LegacyContactScaffoldIds = {
  rootId: typeof LEGACY_CONTACT_SCAFFOLD_ROOT_ID;
  compositeId: typeof LEGACY_CONTACT_SCAFFOLD_COMPOSITE_ID;
};

export type LegacyContactScaffoldRole = 'root' | 'composite';

type NodeContent = {
  as?: unknown;
  layoutMode?: unknown;
  componentKey?: unknown;
};

type RectPatch = {
  x?: number;
  y?: number;
  width?: number;
  height?: number;
};

type ResponsiveBucket = {
  rect?: RectPatch;
};

type NodeResponsive = {
  tablet?: ResponsiveBucket;
  mobile?: ResponsiveBucket;
};

function readContent(node: BuilderCanvasNode): NodeContent {
  return (node.content ?? {}) as NodeContent;
}

function isAbsentParent(node: BuilderCanvasNode): boolean {
  return node.parentId == null || node.parentId === '';
}

function isVisible(node: BuilderCanvasNode): boolean {
  return node.visible !== false;
}

function hasSticky(node: BuilderCanvasNode): boolean {
  const sticky = (node as { sticky?: unknown }).sticky;
  if (sticky != null && sticky !== false) return true;
  const contentSticky = (node.content as { sticky?: unknown } | undefined)?.sticky;
  return contentSticky != null && contentSticky !== false;
}

function isRotated(node: BuilderCanvasNode): boolean {
  return (node.rotation ?? 0) !== 0;
}

function isAbsoluteOrAbsentLayoutMode(layoutMode: unknown): boolean {
  return layoutMode == null || layoutMode === 'absolute';
}

function readResponsive(node: BuilderCanvasNode): NodeResponsive | undefined {
  return (node as { responsive?: NodeResponsive }).responsive;
}

/**
 * Native contact seeds may carry matching full-bleed width overrides (390/768).
 * Independent x/y/size on the child at a viewport is a custom layout and must
 * not be rewritten by the scaffold CSS path.
 */
function responsiveChildIndependentlyMovedOrResized(
  root: BuilderCanvasNode,
  child: BuilderCanvasNode,
): boolean {
  const rootResponsive = readResponsive(root);
  const childResponsive = readResponsive(child);
  if (!rootResponsive && !childResponsive) return false;

  for (const viewport of ['tablet', 'mobile'] as const) {
    const rootRect = resolveViewportRect(root, viewport);
    const childRect = resolveViewportRect(child, viewport);
    if (rootRect.x !== 0 || rootRect.y !== 0) return true;
    if (childRect.x !== 0 || childRect.y !== 0) return true;
    if (childRect.width !== rootRect.width || childRect.height !== rootRect.height) {
      return true;
    }
  }

  return false;
}

/**
 * Detects the unpublished-era 2-node contact page: a fixed-size main container
 * wrapping a single `legacy-page-contact` composite. Returns those ids or null.
 * Does not mutate `nodes`. Hidden nodes are included in the total count.
 */
export function matchLegacyContactScaffold(
  nodes: readonly BuilderCanvasNode[],
): LegacyContactScaffoldIds | null {
  if (nodes.length !== 2) return null;

  const root = nodes.find((node) => isAbsentParent(node));
  const child = nodes.find((node) => node !== root);
  if (!root || !child) return null;

  if (root.id !== LEGACY_CONTACT_SCAFFOLD_ROOT_ID) return null;
  if (child.id !== LEGACY_CONTACT_SCAFFOLD_COMPOSITE_ID) return null;
  if (!isVisible(root) || !isVisible(child)) return null;
  if (root.kind !== 'container') return null;
  if (child.kind !== 'composite') return null;
  if (child.parentId !== root.id) return null;
  if (hasSticky(root) || hasSticky(child)) return null;
  if (isRotated(root) || isRotated(child)) return null;

  const rootContent = readContent(root);
  if (rootContent.as !== 'main') return null;
  if (!isAbsoluteOrAbsentLayoutMode(rootContent.layoutMode)) return null;

  const childContent = readContent(child);
  if (childContent.componentKey !== LEGACY_CONTACT_COMPONENT_KEY) return null;

  if (root.rect.x !== 0 || root.rect.y !== 0 || root.rect.width !== 1280) return null;
  if (
    child.rect.x !== 0
    || child.rect.y !== 0
    || child.rect.width !== root.rect.width
    || child.rect.height !== root.rect.height
  ) {
    return null;
  }

  if (responsiveChildIndependentlyMovedOrResized(root, child)) return null;

  return {
    rootId: LEGACY_CONTACT_SCAFFOLD_ROOT_ID,
    compositeId: LEGACY_CONTACT_SCAFFOLD_COMPOSITE_ID,
  };
}

export function legacyContactScaffoldRole(
  match: LegacyContactScaffoldIds | null,
  nodeId: string,
): LegacyContactScaffoldRole | undefined {
  if (!match) return undefined;
  if (nodeId === match.rootId) return 'root';
  if (nodeId === match.compositeId) return 'composite';
  return undefined;
}

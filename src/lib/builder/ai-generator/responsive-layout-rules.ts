import type { BuilderCanvasNode } from '@/lib/builder/canvas/types';
import type {
  ResponsiveSuggestion,
  ResponsiveTargetViewport,
} from '@/lib/builder/ai-generator/responsive-rules';

interface RectLite {
  x: number;
  y: number;
  width: number;
  height: number;
}

const SIDE_BY_SIDE_OVERLAP_PX = 24;

export function clampWidth(width: number, safeWidth: number): number {
  if (!Number.isFinite(width) || width <= 0) return safeWidth;
  return Math.max(48, Math.min(width, safeWidth));
}

export function effectiveRect(node: BuilderCanvasNode, viewport: ResponsiveTargetViewport): RectLite {
  const base: RectLite = { ...node.rect };
  if (viewport === 'mobile') {
    const tabletRect = node.responsive?.tablet?.rect;
    if (tabletRect) Object.assign(base, tabletRect);
  }
  const targetRect = node.responsive?.[viewport]?.rect;
  if (targetRect) Object.assign(base, targetRect);
  return base;
}

function viewportGutter(viewport: ResponsiveTargetViewport): number {
  return viewport === 'mobile' ? 16 : 24;
}

function clampXToSafeArea(rect: RectLite, viewport: ResponsiveTargetViewport, safeWidth: number): number {
  const width = clampWidth(rect.width, safeWidth);
  const gutter = viewportGutter(viewport);
  const maxX = Math.max(gutter, safeWidth - width);
  return Math.min(Math.max(rect.x, gutter), maxX);
}

export function buildNodeOverflowSuggestion(
  node: BuilderCanvasNode,
  viewport: ResponsiveTargetViewport,
  safeWidth: number,
): ResponsiveSuggestion | null {
  const rect = effectiveRect(node, viewport);
  const clampedWidth = clampWidth(rect.width, safeWidth);
  const crossesSafeArea = rect.x < 0 || rect.x + rect.width > safeWidth || rect.width > safeWidth;
  if (!crossesSafeArea) return null;

  const nextX = clampXToSafeArea(rect, viewport, safeWidth);
  return {
    nodeId: node.id,
    reason: 'node-overflows-viewport',
    summary: `Move ${node.kind} inside ${viewport} safe area`,
    mobileOverride: {
      rect: {
        x: nextX,
        width: clampedWidth,
      },
    },
  };
}

function rectsAreSideBySide(a: RectLite, b: RectLite): boolean {
  const verticalOverlap = Math.min(a.y + a.height, b.y + b.height) - Math.max(a.y, b.y);
  if (verticalOverlap < SIDE_BY_SIDE_OVERLAP_PX) return false;
  const horizontallySeparate = a.x + a.width <= b.x + 1 || b.x + b.width <= a.x + 1;
  if (!horizontallySeparate) return false;
  return true;
}

export function buildStackSuggestions(
  nodes: BuilderCanvasNode[],
  viewport: ResponsiveTargetViewport,
  safeWidth: number,
  stackGap: number,
): ResponsiveSuggestion[] {
  const childrenByParent = new Map<string, BuilderCanvasNode[]>();
  for (const node of nodes) {
    if (!node.parentId) continue;
    const list = childrenByParent.get(node.parentId) ?? [];
    list.push(node);
    childrenByParent.set(node.parentId, list);
  }
  const suggestions: ResponsiveSuggestion[] = [];
  for (const [, siblings] of childrenByParent) {
    if (siblings.length < 2) continue;
    const containerSiblings = siblings.filter((node) => node.kind === 'container' || node.kind === 'form');
    if (containerSiblings.length < 2) continue;
    const sorted = [...containerSiblings].sort((left, right) => left.rect.x - right.rect.x);
    const hits: BuilderCanvasNode[] = [];
    for (let i = 0; i < sorted.length - 1; i += 1) {
      if (rectsAreSideBySide(sorted[i].rect, sorted[i + 1].rect)) {
        if (!hits.includes(sorted[i])) hits.push(sorted[i]);
        if (!hits.includes(sorted[i + 1])) hits.push(sorted[i + 1]);
      }
    }
    if (hits.length < 2) continue;
    let cursorY = Math.min(...hits.map((node) => node.rect.y));
    for (const node of hits) {
      const stackedX = viewport === 'mobile'
        ? Math.max(16, Math.floor((safeWidth - clampWidth(node.rect.width, safeWidth)) / 2))
        : 24;
      const stackedWidth = clampWidth(node.rect.width, safeWidth);
      suggestions.push({
        nodeId: node.id,
        reason: 'side-by-side-stack',
        summary: `Stack side-by-side container at y=${Math.round(cursorY)} for ${viewport}`,
        mobileOverride: {
          rect: {
            x: stackedX,
            y: Math.round(cursorY),
            width: stackedWidth,
          },
        },
      });
      cursorY += node.rect.height + stackGap;
    }
  }
  return suggestions;
}

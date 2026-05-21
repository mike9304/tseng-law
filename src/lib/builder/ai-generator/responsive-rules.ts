/**
 * F88 — Responsive AI heuristic rule engine.
 *
 * Pure, deterministic function that scans a canvas document and emits
 * suggestions to make the layout viewport-safe at mobile / tablet sizes.
 *
 * The output respects the persistable `responsiveOverride` schema
 * (rect + fontSize only). Higher-fidelity hints (fontWeight, padding)
 * are deliberately omitted from the persisted suggestion — they would
 * be rejected by `responsiveOverrideSchema` on apply.
 *
 * The engine is intentionally side-effect free so it can be reused by:
 *   - the POST /api/builder/ai-generator/responsive route, and
 *   - any client-side preview that wants the same recommendations
 *     without an HTTP round trip.
 */

import type {
  BuilderCanvasDocument,
  BuilderCanvasNode,
} from '@/lib/builder/canvas/types';
import {
  VIEWPORT_WIDTHS,
  type Viewport,
} from '@/lib/builder/canvas/responsive';

export type ResponsiveTargetViewport = Extract<Viewport, 'mobile' | 'tablet'>;

export const RESPONSIVE_TARGET_VIEWPORTS: readonly ResponsiveTargetViewport[] = [
  'mobile',
  'tablet',
];

export interface ResponsiveRectOverride {
  x?: number;
  y?: number;
  width?: number;
  height?: number;
}

export interface ResponsiveSuggestionOverride {
  rect?: ResponsiveRectOverride;
  fontSize?: number;
}

export type ResponsiveSuggestionReason =
  | 'text-overflows-viewport'
  | 'font-too-large'
  | 'side-by-side-stack';

export interface ResponsiveSuggestion {
  nodeId: string;
  reason: ResponsiveSuggestionReason;
  /** Short human label shown in the panel UI. */
  summary: string;
  /** What to write into `node.responsive.<viewport>`. */
  mobileOverride: ResponsiveSuggestionOverride;
}

interface ScanOptions {
  /** Safe area width for the target viewport (e.g. mobile ≈ 360). */
  safeWidth?: number;
  /** Vertical padding between stacked siblings when re-flowing. */
  stackGap?: number;
  /** Maximum font size before forcing a downscale. */
  maxFontSize?: number;
}

interface RectLite {
  x: number;
  y: number;
  width: number;
  height: number;
}

interface TextLikeContent {
  fontSize?: number;
  text?: string;
}

const DEFAULT_MOBILE_SAFE_WIDTH = 360;
const DEFAULT_TABLET_SAFE_WIDTH = 720;
const DEFAULT_STACK_GAP = 16;
const DEFAULT_MAX_FONT_SIZE = 32;
const MOBILE_FONT_SCALE = 0.65;
const TABLET_FONT_SCALE = 0.85;
const SIDE_BY_SIDE_OVERLAP_PX = 24;

function resolveSafeWidth(viewport: ResponsiveTargetViewport, override?: number): number {
  if (typeof override === 'number' && override > 0) return Math.floor(override);
  if (viewport === 'mobile') return DEFAULT_MOBILE_SAFE_WIDTH;
  return DEFAULT_TABLET_SAFE_WIDTH;
}

function isTextLikeKind(kind: string): boolean {
  return (
    kind === 'text'
    || kind === 'heading'
    || kind === 'button'
    || kind === 'address-block'
    || kind === 'business-hours'
  );
}

function readTextContent(node: BuilderCanvasNode): TextLikeContent | null {
  if (!isTextLikeKind(node.kind)) return null;
  const content = (node as { content?: TextLikeContent }).content;
  if (!content || typeof content !== 'object') return null;
  return content;
}

function clampWidth(width: number, safeWidth: number): number {
  if (!Number.isFinite(width) || width <= 0) return safeWidth;
  return Math.max(48, Math.min(width, safeWidth));
}

function scaleFontSize(
  base: number,
  viewport: ResponsiveTargetViewport,
  maxFontSize: number,
): number {
  const scale = viewport === 'mobile' ? MOBILE_FONT_SCALE : TABLET_FONT_SCALE;
  const scaled = Math.round(base * scale);
  const lowerBound = viewport === 'mobile' ? 14 : 16;
  const upperBound = Math.max(lowerBound, Math.floor(maxFontSize));
  return Math.max(lowerBound, Math.min(scaled, upperBound));
}

function effectiveRect(node: BuilderCanvasNode, viewport: ResponsiveTargetViewport): RectLite {
  const base: RectLite = { ...node.rect };
  if (viewport === 'mobile') {
    const tabletRect = node.responsive?.tablet?.rect;
    if (tabletRect) Object.assign(base, tabletRect);
  }
  const targetRect = node.responsive?.[viewport]?.rect;
  if (targetRect) Object.assign(base, targetRect);
  return base;
}

function effectiveFontSize(
  node: BuilderCanvasNode,
  viewport: ResponsiveTargetViewport,
): number | undefined {
  const tabletFs = viewport === 'mobile' ? node.responsive?.tablet?.fontSize : undefined;
  const targetFs = node.responsive?.[viewport]?.fontSize;
  if (typeof targetFs === 'number') return targetFs;
  if (typeof tabletFs === 'number') return tabletFs;
  const content = readTextContent(node);
  return content?.fontSize;
}

function buildTextWidthSuggestion(
  node: BuilderCanvasNode,
  viewport: ResponsiveTargetViewport,
  safeWidth: number,
): ResponsiveSuggestion | null {
  if (!isTextLikeKind(node.kind)) return null;
  const rect = effectiveRect(node, viewport);
  if (rect.width <= safeWidth) return null;
  const clamped = clampWidth(rect.width, safeWidth);
  if (clamped === rect.width) return null;
  return {
    nodeId: node.id,
    reason: 'text-overflows-viewport',
    summary: `Clamp width ${Math.round(rect.width)}px → ${clamped}px for ${viewport}`,
    mobileOverride: {
      rect: {
        x: viewport === 'mobile' ? Math.max(16, Math.floor((safeWidth - clamped) / 2)) : undefined,
        width: clamped,
      },
    },
  };
}

function buildFontSizeSuggestion(
  node: BuilderCanvasNode,
  viewport: ResponsiveTargetViewport,
  maxFontSize: number,
): ResponsiveSuggestion | null {
  const fontSize = effectiveFontSize(node, viewport);
  if (typeof fontSize !== 'number' || fontSize <= maxFontSize) return null;
  const scaled = scaleFontSize(fontSize, viewport, maxFontSize);
  if (scaled >= fontSize) return null;
  return {
    nodeId: node.id,
    reason: 'font-too-large',
    summary: `Scale font ${fontSize}px → ${scaled}px for ${viewport}`,
    mobileOverride: { fontSize: scaled },
  };
}

function rectsAreSideBySide(a: RectLite, b: RectLite): boolean {
  const verticalOverlap = Math.min(a.y + a.height, b.y + b.height) - Math.max(a.y, b.y);
  if (verticalOverlap < SIDE_BY_SIDE_OVERLAP_PX) return false;
  const horizontallySeparate = a.x + a.width <= b.x + 1 || b.x + b.width <= a.x + 1;
  if (!horizontallySeparate) return false;
  return true;
}

function buildStackSuggestions(
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
      const stackedX = viewport === 'mobile' ? Math.max(16, Math.floor((safeWidth - clampWidth(node.rect.width, safeWidth)) / 2)) : 24;
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

function mergeSuggestions(list: ResponsiveSuggestion[]): ResponsiveSuggestion[] {
  const byNode = new Map<string, ResponsiveSuggestion>();
  for (const item of list) {
    const existing = byNode.get(item.nodeId);
    if (!existing) {
      byNode.set(item.nodeId, { ...item, mobileOverride: { ...item.mobileOverride, rect: item.mobileOverride.rect ? { ...item.mobileOverride.rect } : undefined } });
      continue;
    }
    const merged: ResponsiveSuggestion = {
      ...existing,
      reason: existing.reason,
      summary: `${existing.summary}; ${item.summary}`,
      mobileOverride: {
        rect: {
          ...(existing.mobileOverride.rect ?? {}),
          ...(item.mobileOverride.rect ?? {}),
        },
        fontSize: item.mobileOverride.fontSize ?? existing.mobileOverride.fontSize,
      },
    };
    if (!merged.mobileOverride.rect || Object.keys(merged.mobileOverride.rect).length === 0) {
      delete merged.mobileOverride.rect;
    }
    byNode.set(item.nodeId, merged);
  }
  return Array.from(byNode.values());
}

export interface ResponsiveScanInput {
  canvas: Pick<BuilderCanvasDocument, 'nodes'>;
  viewport: ResponsiveTargetViewport;
  options?: ScanOptions;
}

export function scanResponsiveSuggestions(input: ResponsiveScanInput): ResponsiveSuggestion[] {
  const { canvas, viewport, options } = input;
  const safeWidth = resolveSafeWidth(viewport, options?.safeWidth);
  const stackGap = Math.max(0, options?.stackGap ?? DEFAULT_STACK_GAP);
  const maxFontSize = options?.maxFontSize ?? DEFAULT_MAX_FONT_SIZE;
  const nodes = canvas.nodes ?? [];

  const raw: ResponsiveSuggestion[] = [];
  for (const node of nodes) {
    if (node.locked) continue;
    if (node.visible === false) continue;
    const textWidth = buildTextWidthSuggestion(node, viewport, safeWidth);
    if (textWidth) raw.push(textWidth);
    const font = buildFontSizeSuggestion(node, viewport, maxFontSize);
    if (font) raw.push(font);
  }
  for (const stack of buildStackSuggestions(nodes, viewport, safeWidth, stackGap)) {
    raw.push(stack);
  }
  return mergeSuggestions(raw)
    .sort((a, b) => a.nodeId.localeCompare(b.nodeId))
    .slice(0, 80);
}

export function defaultSafeWidthFor(viewport: ResponsiveTargetViewport): number {
  return resolveSafeWidth(viewport);
}

export function viewportLabel(viewport: ResponsiveTargetViewport): string {
  if (viewport === 'mobile') return `Mobile (${VIEWPORT_WIDTHS.mobile}px)`;
  return `Tablet (${VIEWPORT_WIDTHS.tablet}px)`;
}
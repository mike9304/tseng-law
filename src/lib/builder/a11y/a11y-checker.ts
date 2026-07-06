/**
 * Phase 9 P9-06/P9-07 — Accessibility checker engine.
 *
 * Runs static checks on a canvas document and returns a list of
 * issues with severity levels. The A11y panel (Codex) renders these.
 */

import type { BuilderCanvasDocument, BuilderCanvasNode } from '@/lib/builder/canvas/types';
import { linkValueFromLegacy, type LinkValue } from '@/lib/builder/links';
import type { Locale } from '@/lib/locales';
import { getA11yCheckerCopy } from './a11y-checker-copy';

export type A11ySeverity = 'error' | 'warning' | 'info';

export interface A11yIssue {
  nodeId: string;
  nodeKind: string;
  severity: A11ySeverity;
  rule: string;
  message: string;
  suggestion?: string;
}

export function checkAccessibility(doc: BuilderCanvasDocument, locale: Locale = 'ko'): A11yIssue[] {
  const issues: A11yIssue[] = [];
  const copy = getA11yCheckerCopy(locale);
  const nodesById = new Map(doc.nodes.map((node) => [node.id, node]));
  const absoluteRectsById = buildAbsoluteRects(nodesById);

  for (const node of doc.nodes) {
    // Image alt text
    if (node.kind === 'image' && !node.content.alt) {
      issues.push({
        nodeId: node.id,
        nodeKind: node.kind,
        severity: 'error',
        rule: 'img-alt',
        message: copy.imageAltMessage,
        suggestion: copy.imageAltSuggestion,
      });
    }

    // Empty text
    if (
      node.kind === 'text' &&
      (!node.content.text || String(node.content.text).trim() === '') &&
      !isDecorativeTextNode(node, nodesById)
    ) {
      issues.push({
        nodeId: node.id,
        nodeKind: node.kind,
        severity: 'warning',
        rule: 'empty-text',
        message: copy.emptyTextMessage,
        suggestion: copy.emptyTextSuggestion,
      });
    }

    // Button without link
    if (node.kind === 'button' && !node.content.href) {
      issues.push({
        nodeId: node.id,
        nodeKind: node.kind,
        severity: 'warning',
        rule: 'button-no-link',
        message: copy.buttonNoLinkMessage,
        suggestion: copy.buttonNoLinkSuggestion,
      });
    }

    const link = getNodeLinkValue(node);
    if (link?.target === '_blank' && !hasNoopenerRel(link.rel)) {
      issues.push({
        nodeId: node.id,
        nodeKind: node.kind,
        severity: 'warning',
        rule: 'link-blank-rel',
        message: copy.linkBlankRelMessage,
        suggestion: copy.linkBlankRelSuggestion,
      });
    }

    if (node.kind === 'image' && link?.href && !link.ariaLabel && !node.content.alt) {
      issues.push({
        nodeId: node.id,
        nodeKind: node.kind,
        severity: 'warning',
        rule: 'image-link-label',
        message: copy.imageLinkLabelMessage,
        suggestion: copy.imageLinkLabelSuggestion,
      });
    }

    // Color contrast: compare text against the effective rendered background.
    if (node.kind === 'text' && node.content.color) {
      const contrast = estimateTextContrastRatio(node, nodesById, absoluteRectsById);
      if (contrast != null && contrast < 4.5) {
        issues.push({
          nodeId: node.id,
          nodeKind: node.kind,
          severity: 'error',
          rule: 'color-contrast',
          message: copy.colorContrastMessage(contrast.toFixed(1)),
          suggestion: copy.colorContrastSuggestion,
        });
      }
    }

    // Heading order (simplified — just checks if headings exist)
    if (node.kind === 'heading') {
      const level = typeof node.content.level === 'number' ? node.content.level : 2;
      if (level > 3) {
        issues.push({
          nodeId: node.id,
          nodeKind: node.kind,
          severity: 'info',
          rule: 'heading-level',
          message: copy.headingLevelMessage(level),
        });
      }
    }

    // Video without captions info (kind check via string for future-proofing)
    if ((node.kind as string) === 'video') {
      issues.push({
        nodeId: node.id,
        nodeKind: node.kind,
        severity: 'info',
        rule: 'video-captions',
        message: copy.videoCaptionsMessage,
        suggestion: copy.videoCaptionsSuggestion,
      });
    }
  }

  // Check page has at least one heading
  const hasHeading = doc.nodes.some(nodeCountsAsPageHeading);
  if (!hasHeading) {
    issues.push({
      nodeId: '',
      nodeKind: 'page',
      severity: 'warning',
      rule: 'page-heading',
      message: copy.pageHeadingMessage,
      suggestion: copy.pageHeadingSuggestion,
    });
  }

  return issues;
}

function getNodeLinkValue(node: BuilderCanvasDocument['nodes'][number]): LinkValue | null {
  if (node.kind === 'button') return linkValueFromLegacy(node.content);
  if (node.kind === 'image' || node.kind === 'container') {
    return (node.content.link ?? null) as LinkValue | null;
  }
  return null;
}

function hasNoopenerRel(rel: string | undefined): boolean {
  const tokens = new Set((rel ?? '').split(/\s+/).filter(Boolean));
  return tokens.has('noopener') && tokens.has('noreferrer');
}

type TextCanvasNode = Extract<BuilderCanvasNode, { kind: 'text' }>;

interface RgbaColor {
  r: number;
  g: number;
  b: number;
  a: number;
}

const DEFAULT_CANVAS_BACKGROUND: RgbaColor = { r: 255, g: 255, b: 255, a: 1 };

function estimateTextContrastRatio(
  node: TextCanvasNode,
  nodesById: ReadonlyMap<string, BuilderCanvasNode>,
  absoluteRectsById: ReadonlyMap<string, BuilderCanvasNode['rect']>,
): number | null {
  const bg = resolveEffectiveBackgroundColor(node, nodesById, absoluteRectsById);
  if (!bg) return null;

  const fg = parseCssColor(node.content.color);
  if (!fg || fg.a <= 0) return null;

  return contrastRatio(fg.a < 1 ? compositeColor(fg, bg) : fg, bg);
}

function resolveEffectiveBackgroundColor(
  node: BuilderCanvasNode,
  nodesById: ReadonlyMap<string, BuilderCanvasNode>,
  absoluteRectsById: ReadonlyMap<string, BuilderCanvasNode['rect']>,
): RgbaColor | null {
  const chain: BuilderCanvasNode[] = [];
  const seen = new Set<string>();
  let cursor: BuilderCanvasNode | undefined = node;
  let hasConcreteBackground = false;

  while (cursor && !seen.has(cursor.id)) {
    chain.unshift(cursor);
    seen.add(cursor.id);
    cursor = cursor.parentId ? nodesById.get(cursor.parentId) : undefined;
  }

  let background = DEFAULT_CANVAS_BACKGROUND;
  for (const chainNode of chain) {
    for (const candidate of getBackgroundColorCandidates(chainNode)) {
      const parsed = parseCssColor(candidate);
      if (parsed) {
        if (parsed.a > 0) {
          background = compositeColor(parsed, background);
          hasConcreteBackground = true;
        }
        continue;
      }

      if (!isTransparentLike(candidate)) {
        return null;
      }
    }
  }

  if (!hasConcreteBackground) {
    if (hasOverlappingMediaBackground(node, nodesById, absoluteRectsById)) {
      return null;
    }

    const toneBackground = resolveToneBackgroundColor(chain);
    if (toneBackground) {
      return toneBackground;
    }
  }

  return background;
}

function buildAbsoluteRects(
  nodesById: ReadonlyMap<string, BuilderCanvasNode>,
): Map<string, BuilderCanvasNode['rect']> {
  const rectsById = new Map<string, BuilderCanvasNode['rect']>();

  const resolveRect = (node: BuilderCanvasNode, seen = new Set<string>()): BuilderCanvasNode['rect'] => {
    const cached = rectsById.get(node.id);
    if (cached) return cached;
    if (seen.has(node.id)) return node.rect;

    seen.add(node.id);
    const parent = node.parentId ? nodesById.get(node.parentId) : undefined;
    const parentRect = parent ? resolveRect(parent, seen) : null;
    const rect = parentRect
      ? { ...node.rect, x: parentRect.x + node.rect.x, y: parentRect.y + node.rect.y }
      : node.rect;

    rectsById.set(node.id, rect);
    return rect;
  };

  for (const node of nodesById.values()) {
    resolveRect(node);
  }

  return rectsById;
}

function hasOverlappingMediaBackground(
  node: BuilderCanvasNode,
  nodesById: ReadonlyMap<string, BuilderCanvasNode>,
  absoluteRectsById: ReadonlyMap<string, BuilderCanvasNode['rect']>,
): boolean {
  const targetRect = absoluteRectsById.get(node.id);
  if (!targetRect) return false;

  for (const candidate of nodesById.values()) {
    if (candidate.id === node.id || candidate.visible === false || !isMediaBackgroundCandidate(candidate)) {
      continue;
    }

    const candidateRect = absoluteRectsById.get(candidate.id);
    if (candidateRect && rectsOverlap(targetRect, candidateRect)) {
      return true;
    }
  }

  return false;
}

function isMediaBackgroundCandidate(node: BuilderCanvasNode): boolean {
  return node.kind === 'image' || node.kind === 'video' || node.kind === 'video-embed' || node.kind === 'parallax-bg';
}

function rectsOverlap(left: BuilderCanvasNode['rect'], right: BuilderCanvasNode['rect']): boolean {
  return (
    left.x < right.x + right.width &&
    left.x + left.width > right.x &&
    left.y < right.y + right.height &&
    left.y + left.height > right.y
  );
}

function getBackgroundColorCandidates(node: BuilderCanvasNode): unknown[] {
  const candidates: unknown[] = [];

  if (node.style?.backgroundColor != null) {
    candidates.push(node.style.backgroundColor);
  }

  if (node.kind === 'text' && node.content.backgroundColor != null) {
    candidates.push(node.content.backgroundColor);
  } else if (
    (node.kind === 'container' || node.kind === 'section') &&
    node.content.background != null
  ) {
    candidates.push(node.content.background);
  }

  return candidates;
}

function resolveToneBackgroundColor(chain: readonly BuilderCanvasNode[]): RgbaColor | null {
  for (let index = chain.length - 1; index >= 0; index -= 1) {
    const node = chain[index];
    const tone = getNodeContentString(node, 'dataTone');
    const className = getNodeContentString(node, 'className');

    if (tone === 'dark' || /\bsection--dark\b/.test(className)) {
      return parseCssColor('#0f172a');
    }
    if (tone === 'light' || /\bsection--(?:light|gray)\b/.test(className)) {
      return parseCssColor('#f8fafc');
    }
  }

  return null;
}

function isDecorativeTextNode(
  node: TextCanvasNode,
  nodesById: ReadonlyMap<string, BuilderCanvasNode>,
): boolean {
  const parent = node.parentId ? nodesById.get(node.parentId) : null;
  const parentClassName = parent ? getNodeContentString(parent, 'className') : '';
  const ownClassName = getNodeContentString(node, 'className');
  const marker = `${node.id} ${ownClassName} ${parentClassName}`;

  return /\b(?:stat-)?progress(?:-bar)?\b/.test(marker);
}

function getNodeContentString(node: BuilderCanvasNode, key: string): string {
  const value = (node.content as Record<string, unknown>)[key];
  return typeof value === 'string' ? value : '';
}

function nodeCountsAsPageHeading(node: BuilderCanvasNode): boolean {
  if (node.kind === 'heading') return true;

  if (node.kind !== 'text') return false;

  const semanticTag = getNodeContentString(node, 'as').toLowerCase();
  if (/^h[1-6]$/.test(semanticTag)) return true;

  return getEffectiveTextFontSizes(node).some((fontSize) => fontSize >= 24);
}

function getEffectiveTextFontSizes(node: TextCanvasNode): number[] {
  const sizes: number[] = [];

  if (typeof node.content.fontSize === 'number') {
    sizes.push(node.content.fontSize);
  }

  const responsive = node.responsive;
  for (const viewport of ['tablet', 'mobile'] as const) {
    const fontSize = responsive?.[viewport]?.fontSize;
    if (typeof fontSize === 'number') {
      sizes.push(fontSize);
    }
  }

  return sizes;
}

function contrastRatio(fg: RgbaColor, bg: RgbaColor): number {
  const fgLum = relativeLuminance(fg);
  const bgLum = relativeLuminance(bg);
  const lighter = Math.max(fgLum, bgLum);
  const darker = Math.min(fgLum, bgLum);
  return (lighter + 0.05) / (darker + 0.05);
}

function relativeLuminance(color: RgbaColor): number {
  const toLinear = (channel: number) => {
    const normalized = channel / 255;
    return normalized <= 0.03928
      ? normalized / 12.92
      : Math.pow((normalized + 0.055) / 1.055, 2.4);
  };
  return 0.2126 * toLinear(color.r) + 0.7152 * toLinear(color.g) + 0.0722 * toLinear(color.b);
}

function compositeColor(fg: RgbaColor, bg: RgbaColor): RgbaColor {
  const a = fg.a + bg.a * (1 - fg.a);
  if (a <= 0) return { r: 0, g: 0, b: 0, a: 0 };

  return {
    r: Math.round((fg.r * fg.a + bg.r * bg.a * (1 - fg.a)) / a),
    g: Math.round((fg.g * fg.a + bg.g * bg.a * (1 - fg.a)) / a),
    b: Math.round((fg.b * fg.a + bg.b * bg.a * (1 - fg.a)) / a),
    a,
  };
}

function parseCssColor(value: unknown): RgbaColor | null {
  if (typeof value !== 'string') return null;

  const color = value.trim().toLowerCase();
  if (!color) return null;
  if (color === 'transparent') return { r: 0, g: 0, b: 0, a: 0 };
  if (color === 'black') return { r: 0, g: 0, b: 0, a: 1 };
  if (color === 'white') return { r: 255, g: 255, b: 255, a: 1 };

  const hex = parseHexColor(color);
  if (hex) return hex;

  return parseRgbColor(color);
}

function parseHexColor(value: string): RgbaColor | null {
  const short = value.match(/^#([0-9a-f]{3}|[0-9a-f]{4})$/i);
  if (short) {
    const chars = short[1]!.split('');
    const [r, g, b, a = 'f'] = chars.map((char) => char + char);
    return {
      r: Number.parseInt(r!, 16),
      g: Number.parseInt(g!, 16),
      b: Number.parseInt(b!, 16),
      a: Number.parseInt(a, 16) / 255,
    };
  }

  const long = value.match(/^#([0-9a-f]{6}|[0-9a-f]{8})$/i);
  if (!long) return null;

  const raw = long[1]!;
  return {
    r: Number.parseInt(raw.slice(0, 2), 16),
    g: Number.parseInt(raw.slice(2, 4), 16),
    b: Number.parseInt(raw.slice(4, 6), 16),
    a: raw.length === 8 ? Number.parseInt(raw.slice(6, 8), 16) / 255 : 1,
  };
}

function parseRgbColor(value: string): RgbaColor | null {
  const match = value.match(/^rgba?\((.+)\)$/i);
  if (!match) return null;

  const body = match[1]!.trim();
  const [rgbPart, slashAlpha] = body.split('/').map((part) => part.trim());
  const parts = rgbPart!.includes(',')
    ? rgbPart!.split(',').map((part) => part.trim())
    : rgbPart!.split(/\s+/).filter(Boolean);
  if (parts.length < 3) return null;

  const r = parseColorChannel(parts[0]!);
  const g = parseColorChannel(parts[1]!);
  const b = parseColorChannel(parts[2]!);
  const a = parseAlphaChannel(slashAlpha ?? (parts.length >= 4 ? parts[3] : undefined));
  if (r == null || g == null || b == null || a == null) return null;

  return { r, g, b, a };
}

function parseColorChannel(value: string): number | null {
  const trimmed = value.trim();
  const percent = trimmed.endsWith('%');
  const numeric = Number.parseFloat(percent ? trimmed.slice(0, -1) : trimmed);
  if (!Number.isFinite(numeric)) return null;
  const scaled = percent ? (numeric / 100) * 255 : numeric;
  return clamp(Math.round(scaled), 0, 255);
}

function parseAlphaChannel(value: string | undefined): number | null {
  if (value == null || value === '') return 1;
  const trimmed = value.trim();
  const percent = trimmed.endsWith('%');
  const numeric = Number.parseFloat(percent ? trimmed.slice(0, -1) : trimmed);
  if (!Number.isFinite(numeric)) return null;
  return clamp(percent ? numeric / 100 : numeric, 0, 1);
}

function isTransparentLike(value: unknown): boolean {
  if (typeof value !== 'string') return false;
  const color = value.trim().toLowerCase();
  if (!color || color === 'transparent' || color === 'none') return true;
  const parsed = parseCssColor(color);
  return Boolean(parsed && parsed.a <= 0);
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

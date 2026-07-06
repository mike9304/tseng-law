/**
 * responsivize.ts — generate mobile + tablet `responsive` overrides for absolute-positioned
 * canvas nodes, so builder-generated templates REFLOW on small screens instead of keeping the
 * 1280px desktop layout (the audit's "Responsive 2/5").
 *
 * Model B (breakpoint-override): each node keeps its desktop rect and gains
 * `responsive.mobile` / `responsive.tablet` rect (+ fontSize). The published
 * responsive-stylesheet derives vertical flow (margin-top) from these authored y values.
 *
 * Layout is COLUMN-MAJOR + N-column grid:
 *  - children are grouped into columns by horizontal overlap (keeps logical units together —
 *    a stat band's value-over-label stays paired; a card stays one cell).
 *  - mobile (375): 1 column → everything stacks vertically.
 *  - tablet (768): narrow grid columns pack 2-per-row; wide blocks (titles, hero copy, feature
 *    halves) take a full row. Full-cover backgrounds (hero image/scrim) stay full-cover.
 */
import type { BuilderCanvasNode, ResponsiveConfig } from '@/lib/builder/canvas/types';

interface Viewport { key: 'mobile' | 'tablet'; VW: number; PAD: number; GAP: number; cols: number; headScale: number }
const VIEWPORTS: Viewport[] = [
  { key: 'mobile', VW: 375, PAD: 20, GAP: 22, cols: 1, headScale: 0.66 },
  { key: 'tablet', VW: 768, PAD: 32, GAP: 28, cols: 2, headScale: 0.84 },
];
const SECTION_VPAD = 24;

const isWide = (ch: string) => {
  const c = ch.codePointAt(0) ?? 0;
  return (c >= 0x1100 && c <= 0x11ff) || (c >= 0x3130 && c <= 0x318f) || (c >= 0xac00 && c <= 0xd7a3)
    || (c >= 0x3000 && c <= 0x303f) || (c >= 0xff00 && c <= 0xffef) || (c >= 0x4e00 && c <= 0x9fff);
};

type ResponsiveViewport = 'mobile' | 'tablet';
type TextMetricsContent = {
  text?: string;
  fontSize?: number;
  level?: number;
  lineHeight?: number;
};

function readString(source: object, key: string): string | undefined {
  const value: unknown = Reflect.get(source, key);
  return typeof value === 'string' ? value : undefined;
}

function readNumber(source: object, key: string): number | undefined {
  const value: unknown = Reflect.get(source, key);
  return typeof value === 'number' && Number.isFinite(value) ? value : undefined;
}

function getTextMetricsContent(node: BuilderCanvasNode): TextMetricsContent {
  const source = node.content;
  if (!source || typeof source !== 'object') return {};
  const metrics: TextMetricsContent = {};
  const text = readString(source, 'text');
  const fontSize = readNumber(source, 'fontSize');
  const level = readNumber(source, 'level');
  const lineHeight = readNumber(source, 'lineHeight');
  if (text !== undefined) metrics.text = text;
  if (fontSize !== undefined) metrics.fontSize = fontSize;
  if (level !== undefined) metrics.level = level;
  if (lineHeight !== undefined) metrics.lineHeight = lineHeight;
  return metrics;
}

function estimateTextHeight(text: string, fontSize: number, boxW: number, lineHeight: number): number {
  let lines = 0;
  for (const seg of String(text).split('\n')) {
    let w = 0;
    for (const ch of seg) w += fontSize * (isWide(ch) ? 0.92 : ch === ' ' ? 0.3 : 0.52);
    lines += Math.max(1, Math.ceil(w / Math.max(1, boxW)));
  }
  return Math.ceil(lines * fontSize * lineHeight);
}

interface MobileRect { x: number; y: number; width: number; height: number }
function setOverride(node: BuilderCanvasNode, vp: ResponsiveViewport, rect: MobileRect, fontSize?: number): void {
  const fs = fontSize !== undefined ? Math.max(8, Math.min(160, Math.round(fontSize))) : undefined;
  const existing: ResponsiveConfig = node.responsive ?? {};
  const existingOverride = existing[vp] ?? {};
  const existingRect = existingOverride.rect ?? {};
  node.responsive = {
    ...existing,
    [vp]: {
      ...existingOverride,
      rect: {
        x: existingRect.x ?? rect.x,
        y: existingRect.y ?? rect.y,
        width: existingRect.width ?? rect.width,
        height: existingRect.height ?? rect.height,
      },
      ...(existingOverride.fontSize === undefined && fs !== undefined ? { fontSize: fs } : {}),
    },
  };
}

/**
 * The decomposed page-header breadcrumb — `<nav class="breadcrumb">` holding a
 * home link / slash / current label — is authored as ONE inline row on desktop
 * (all children at y≈0, height≈24). The generic column reflow would instead
 * stack those children vertically (the home <a> is a `button` kind, so it hits
 * the 46px tap-target floor, then slash, then current), inflating the container
 * to ~156px on mobile / ~119px on tablet. The live site renders the breadcrumb
 * as a single inline-flex row (~22px), so we detect this container by its seeded
 * `breadcrumb` className token and keep it on one horizontal row instead.
 */
function isBreadcrumbContainer(node: BuilderCanvasNode): boolean {
  if (node.kind !== 'container') return false;
  const content = node.content;
  if (!content || typeof content !== 'object') return false;
  const className = readString(content, 'className') ?? '';
  return className.split(/\s+/).includes('breadcrumb');
}

/** Group nodes into columns by horizontal overlap; return groups ordered left→right, each sorted top→bottom. */
function columnGroups(items: BuilderCanvasNode[]): BuilderCanvasNode[][] {
  const cols: { min: number; max: number; items: BuilderCanvasNode[] }[] = [];
  for (const n of [...items].sort((a, b) => a.rect.x - b.rect.x)) {
    const left = n.rect.x, right = n.rect.x + n.rect.width;
    const col = cols.find((c) => left < c.max - 4 && right > c.min + 4);
    if (col) { col.min = Math.min(col.min, left); col.max = Math.max(col.max, right); col.items.push(n); }
    else cols.push({ min: left, max: right, items: [n] });
  }
  return cols.sort((a, b) => a.min - b.min).map((c) => c.items.sort((a, b) => a.rect.y - b.rect.y || a.rect.x - b.rect.x));
}

export function responsivize(nodes: BuilderCanvasNode[]): void {
  const childrenOf = new Map<string, BuilderCanvasNode[]>();
  for (const n of nodes) {
    const key = n.parentId ?? '__root__';
    let children = childrenOf.get(key);
    if (!children) {
      children = [];
      childrenOf.set(key, children);
    }
    children.push(n);
  }

  for (const vp of VIEWPORTS) {
    // Keep a breadcrumb container's children on a single inline row (desktop
    // parity) instead of stacking them. Each child's authored rect already sits
    // left→right at y≈0, so we mirror it verbatim — this also bypasses the
    // `button` 46px tap-target floor the home link would otherwise get. Returns
    // the row height so the caller sizes the container to one line (~24px).
    function layoutBreadcrumbRow(containerId: string): number {
      const kids = childrenOf.get(containerId) ?? [];
      let rowH = 1;
      for (const kid of kids) {
        setOverride(kid, vp.key, {
          x: kid.rect.x,
          y: kid.rect.y,
          width: kid.rect.width,
          height: kid.rect.height,
        });
        rowH = Math.max(rowH, kid.rect.y + kid.rect.height);
      }
      return rowH;
    }

    // Lay out a single column-group's items vertically within a cell at (cellX, startY), width cellW.
    function layoutGroup(group: BuilderCanvasNode[], parentDeskW: number, cellX: number, startY: number, cellW: number): number {
      let y = startY;
      for (const kid of group) {
        const content = getTextMetricsContent(kid);
        const hasKids = (childrenOf.get(kid.id) ?? []).length > 0;
        let h: number;
        let mFont: number | undefined;
        if (hasKids) {
          h = isBreadcrumbContainer(kid)
            ? layoutBreadcrumbRow(kid.id)
            : reflow(kid.id, kid.rect.width, cellW, Math.min(24, cellW * 0.06));
        } else if (kid.kind === 'image') {
          h = Math.max(72, Math.round(kid.rect.height * (cellW / Math.max(1, kid.rect.width))));
        } else if (kid.kind === 'button') {
          h = Math.max(46, kid.rect.height);
        } else {
          const isHeading = kid.kind === 'heading';
          const baseFs = content.fontSize ?? (isHeading ? (content.level === 1 ? 52 : content.level === 2 ? 36 : content.level === 3 ? 24 : 19) : 16);
          mFont = isHeading && baseFs >= 30 ? Math.round(baseFs * vp.headScale) : undefined;
          h = estimateTextHeight(content.text ?? '', mFont ?? baseFs, cellW, content.lineHeight ?? 1.45);
        }
        setOverride(kid, vp.key, { x: cellX, y, width: cellW, height: h }, mFont);
        y += h + vp.GAP;
      }
      return y - startY - vp.GAP; // total stacked height (minus trailing gap)
    }

    // Reflow a container's children into an N-column grid; returns content height.
    function reflow(containerId: string, parentDeskW: number, availW: number, padX: number): number {
      const kids = childrenOf.get(containerId) ?? [];
      const covers = kids.filter((k) => (k.kind === 'image' || k.kind === 'container')
        && k.rect.x <= 1 && k.rect.y <= 1 && k.rect.width >= parentDeskW * 0.95);
      const flow = kids.filter((k) => !covers.includes(k));
      // Full-width items (section titles etc.) are standalone blocks; only the NARROW items form the
      // column grid — otherwise a full-width title would absorb the grid cells into one column and
      // break their pairing (e.g. process step number/title/desc). Order all blocks by their top y.
      const fw = flow.filter((k) => k.rect.width >= parentDeskW * 0.5);
      const narrow = flow.filter((k) => k.rect.width < parentDeskW * 0.5);
      const groups = [...fw.map((f) => [f]), ...columnGroups(narrow)]
        .sort((a, b) => Math.min(...a.map((n) => n.rect.y)) - Math.min(...b.map((n) => n.rect.y)));

      let cursorY = SECTION_VPAD / 2;
      let i = 0;
      while (i < groups.length) {
        const g = groups[i];
        const gW = Math.max(...g.map((n) => n.rect.width));
        const isWideBlock = gW >= parentDeskW * 0.5;
        if (vp.cols === 1 || isWideBlock) {
          // full-width row (single group)
          const fullBleed = gW >= parentDeskW * 0.92;
          const cellW = fullBleed ? availW : availW - 2 * padX;
          const cellX = fullBleed ? 0 : padX;
          const h = layoutGroup(g, parentDeskW, cellX, cursorY, cellW);
          cursorY += h + vp.GAP;
          i += 1;
        } else {
          // grid row: pack up to `cols` consecutive NARROW groups
          const rowGroups: BuilderCanvasNode[][] = [];
          while (rowGroups.length < vp.cols && i < groups.length
            && Math.max(...groups[i].map((n) => n.rect.width)) < parentDeskW * 0.5) {
            rowGroups.push(groups[i]); i += 1;
          }
          const cellW = (availW - 2 * padX - (rowGroups.length - 1) * vp.GAP) / rowGroups.length;
          let rowH = 0;
          rowGroups.forEach((rg, ci) => {
            const cellX = padX + ci * (cellW + vp.GAP);
            rowH = Math.max(rowH, layoutGroup(rg, parentDeskW, cellX, cursorY, cellW));
          });
          cursorY += rowH + vp.GAP;
        }
      }
      const innerH = Math.max(cursorY - vp.GAP + SECTION_VPAD / 2, 60);
      for (const cov of covers) setOverride(cov, vp.key, { x: 0, y: 0, width: availW, height: innerH });
      return innerH;
    }

    // Place one top-level section at (cellX, atY) with width cellW; returns its height.
    const placeSection = (section: BuilderCanvasNode, cellX: number, atY: number, cellW: number): number => {
      const hasKids = (childrenOf.get(section.id) ?? []).length > 0;
      let h: number;
      let mFont: number | undefined;
      if (hasKids) {
        h = reflow(section.id, section.rect.width, cellW, cellW >= vp.VW - 1 ? vp.PAD : 16);
      } else if (section.kind === 'image') {
        h = Math.max(72, Math.round(section.rect.height * (cellW / Math.max(1, section.rect.width))));
      } else if (section.kind === 'button') {
        h = Math.max(46, section.rect.height);
      } else {
        const content = getTextMetricsContent(section);
        const isHeading = section.kind === 'heading';
        const baseFs = content.fontSize ?? (isHeading ? (content.level === 2 ? 36 : content.level === 3 ? 24 : 19) : 16);
        mFont = isHeading && baseFs >= 30 ? Math.round(baseFs * vp.headScale) : undefined;
        h = estimateTextHeight(content.text ?? '', mFont ?? baseFs, cellW, content.lineHeight ?? 1.45);
      }
      setOverride(section, vp.key, { x: cellX, y: atY, width: cellW, height: h }, mFont);
      return h;
    };

    // Top level: a VERTICAL sequence of sections — group by row (y-overlap), stack rows top→bottom.
    // A multi-item row (e.g. 3 service cards at the same y) becomes an N-column grid on tablet.
    const roots = childrenOf.get('__root__') ?? [];
    const rows: BuilderCanvasNode[][] = [];
    for (const n of [...roots].sort((a, b) => a.rect.y - b.rect.y || a.rect.x - b.rect.x)) {
      const last = rows[rows.length - 1];
      if (last && n.rect.y < Math.max(...last.map((m) => m.rect.y + m.rect.height)) - 4) last.push(n);
      else rows.push([n]);
    }
    let y = 0;
    for (const row of rows) {
      const items = row.sort((a, b) => a.rect.x - b.rect.x);
      if (items.length === 1 || vp.cols === 1) {
        for (const section of items) {
          const fullBleed = section.rect.width >= 1280 * 0.92;
          const cellW = fullBleed ? vp.VW : vp.VW - 2 * vp.PAD;
          y += placeSection(section, fullBleed ? 0 : vp.PAD, y, cellW) + vp.GAP;
        }
      } else {
        // N-column grid for a multi-item row
        for (let i = 0; i < items.length; i += vp.cols) {
          const chunk = items.slice(i, i + vp.cols);
          const cellW = (vp.VW - 2 * vp.PAD - (chunk.length - 1) * vp.GAP) / chunk.length;
          let rowH = 0;
          chunk.forEach((section, ci) => {
            rowH = Math.max(rowH, placeSection(section, vp.PAD + ci * (cellW + vp.GAP), y, cellW));
          });
          y += rowH + vp.GAP;
        }
      }
    }
  }
}

/** @deprecated use `responsivize` (now also emits tablet). Kept for call-site compatibility. */
export const responsivizeMobile = responsivize;

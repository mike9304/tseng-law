import type { BuilderCanvasNode } from '@/lib/builder/canvas/types';
import type { GeneratedSiteDraft } from './orchestrator';
import type { Locale } from '@/lib/locales';

/**
 * PR #11 follow-up — Convert a GeneratedSiteDraft into a vertically stacked
 * BuilderCanvasNode tree the canvas can import.
 *
 * Layout: a single `section` per generated section, each containing a
 * heading + paragraph (+ optional button / bullet list). y-coordinates are
 * laid out sequentially so the rendered page reads top-to-bottom.
 *
 * Returned nodes use placeholder ids; the caller should re-id before
 * persisting to avoid collisions with existing pages.
 */

function makeId(prefix: string): string {
  return `${prefix}_${Math.random().toString(36).slice(2, 9)}`;
}

interface BuildArgs {
  draft: GeneratedSiteDraft;
  locale: Locale;
  pageId: string;
}

const SECTION_HEIGHT = 480;
const PAGE_WIDTH = 1200;

function makeSectionNode(y: number, accent: string): BuilderCanvasNode {
  return {
    id: makeId('section'),
    kind: 'section',
    rect: { x: 0, y, width: PAGE_WIDTH, height: SECTION_HEIGHT },
    style: {
      backgroundColor: '#ffffff',
      borderColor: 'transparent',
      borderStyle: 'solid',
      borderWidth: 0,
      borderRadius: 0,
      shadowX: 0,
      shadowY: 0,
      shadowBlur: 0,
      shadowSpread: 0,
      shadowColor: accent,
      opacity: 100,
    },
    content: { variant: 'plain', maxWidth: PAGE_WIDTH, paddingY: 64 },
  } as unknown as BuilderCanvasNode;
}

function makeHeadingNode(parentId: string, y: number, text: string): BuilderCanvasNode {
  return {
    id: makeId('heading'),
    parentId,
    kind: 'heading',
    rect: { x: 64, y, width: PAGE_WIDTH - 128, height: 80 },
    style: {
      backgroundColor: 'transparent',
      borderColor: 'transparent',
      borderStyle: 'solid',
      borderWidth: 0,
      borderRadius: 0,
      shadowX: 0,
      shadowY: 0,
      shadowBlur: 0,
      shadowSpread: 0,
      shadowColor: 'transparent',
      opacity: 100,
    },
    content: { text, level: 2, align: 'left', color: '#0f172a' },
  } as unknown as BuilderCanvasNode;
}

function makeTextNode(parentId: string, y: number, text: string): BuilderCanvasNode {
  return {
    id: makeId('text'),
    parentId,
    kind: 'text',
    rect: { x: 64, y, width: PAGE_WIDTH - 128, height: 160 },
    style: {
      backgroundColor: 'transparent',
      borderColor: 'transparent',
      borderStyle: 'solid',
      borderWidth: 0,
      borderRadius: 0,
      shadowX: 0,
      shadowY: 0,
      shadowBlur: 0,
      shadowSpread: 0,
      shadowColor: 'transparent',
      opacity: 100,
    },
    content: { text, align: 'left', color: '#334155', fontSize: 16, lineHeight: 1.6 },
  } as unknown as BuilderCanvasNode;
}

function makeButtonNode(parentId: string, y: number, label: string, color: string): BuilderCanvasNode {
  return {
    id: makeId('button'),
    parentId,
    kind: 'button',
    rect: { x: 64, y, width: 200, height: 48 },
    style: {
      backgroundColor: color,
      borderColor: color,
      borderStyle: 'solid',
      borderWidth: 0,
      borderRadius: 8,
      shadowX: 0,
      shadowY: 0,
      shadowBlur: 0,
      shadowSpread: 0,
      shadowColor: 'transparent',
      opacity: 100,
    },
    content: { label, href: '#', style: 'primary' },
  } as unknown as BuilderCanvasNode;
}

export function draftToCanvasNodes(args: BuildArgs): BuilderCanvasNode[] {
  const { draft } = args;
  const sectionsContent = [draft.content.hero, ...draft.content.sections];
  const nodes: BuilderCanvasNode[] = [];
  let y = 0;

  for (const section of sectionsContent) {
    const sectionNode = makeSectionNode(y, draft.palette.accent);
    nodes.push(sectionNode);
    let cursorY = y + 48;
    nodes.push(makeHeadingNode(sectionNode.id, cursorY, section.headline));
    cursorY += 96;
    nodes.push(makeTextNode(sectionNode.id, cursorY, section.body));
    cursorY += 180;
    if (section.bullets && section.bullets.length > 0) {
      const bulletText = section.bullets.map((b) => `· ${b}`).join('\n');
      nodes.push(makeTextNode(sectionNode.id, cursorY, bulletText));
      cursorY += 140;
    }
    if (section.ctaLabel) {
      nodes.push(makeButtonNode(sectionNode.id, cursorY, section.ctaLabel, draft.palette.accent));
    }
    y += SECTION_HEIGHT;
  }

  return nodes;
}

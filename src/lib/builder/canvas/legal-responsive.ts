import type { BuilderCanvasNode, ResponsiveConfig } from './types';

const LEGAL_PAGE_PREFIXES = ['page-privacy', 'page-disclaimer'] as const;

const MOBILE_WIDTH = 375;
const MOBILE_GUTTER = 16;
const GRID_WIDTH = MOBILE_WIDTH - MOBILE_GUTTER * 2;
const CARD_PADDING = 24;
const CARD_CONTENT_WIDTH = GRID_WIDTH - CARD_PADDING * 2;
const CARD_GAP = 16;
const SECTION_VERTICAL_INSET = 12;
const TITLE_COPY_GAP = 16;
const PARAGRAPH_GAP = 14;
const COPY_LIST_GAP = 20;
const LIST_ITEM_GAP = 10;
const LIST_TEXT_INDENT = 18;
const MIN_TEXT_HEIGHT = 32;

type CanvasRect = BuilderCanvasNode['rect'];
type LegalPagePrefix = (typeof LEGAL_PAGE_PREFIXES)[number];

function textContent(node: BuilderCanvasNode | undefined): string {
  const value = (node?.content as { text?: unknown } | undefined)?.text;
  return typeof value === 'string' ? value : '';
}

function textMetric(
  node: BuilderCanvasNode | undefined,
  fallbackFontSize: number,
  fallbackLineHeight: number,
): { fontSize: number; lineHeight: number } {
  const content = node?.content as { fontSize?: unknown; lineHeight?: unknown } | undefined;
  return {
    fontSize: typeof content?.fontSize === 'number' ? content.fontSize : fallbackFontSize,
    lineHeight: typeof content?.lineHeight === 'number' ? content.lineHeight : fallbackLineHeight,
  };
}

function estimateTextWidth(text: string, fontSize: number): number {
  let width = 0;
  for (const char of text) {
    const isCjk = /[\u3000-\u9fff\uac00-\ud7af\uff00-\uffef]/.test(char);
    width += isCjk ? fontSize : fontSize * 0.58;
  }
  return Math.max(width, fontSize * 0.5);
}

/** Conservative canvas estimate: reserve a little wrap slack and the persisted 32px text floor. */
function isDenseHanText(text: string): boolean {
  return /[\u3400-\u9fff]/.test(text) && !/\s/.test(text);
}

function estimateTextHeight(
  text: string,
  width: number,
  fontSize: number,
  lineHeight: number,
  preserveCjkClauses = false,
): number {
  const safeWidth = Math.max(1, width * 0.9);
  const lines = text.split('\n').reduce((total, paragraph) => {
    // `word-break: keep-all` treats punctuation-delimited Traditional Chinese
    // clauses more like separate wrap units than one continuous character run.
    // Measuring each clause prevents the short leading clause from donating its
    // unused width to the next one (the zh-Hant disclaimer card-2 collision).
    const wrapUnits = preserveCjkClauses && isDenseHanText(paragraph)
      ? (paragraph.match(/[^，。、；：！？]+[，。、；：！？]?/gu) ?? [paragraph])
      : [paragraph];
    return total + wrapUnits.reduce(
      (lineTotal, unit) => lineTotal + Math.max(1, Math.ceil(estimateTextWidth(unit, fontSize) / safeWidth)),
      0,
    );
  }, 0);
  return Math.max(MIN_TEXT_HEIGHT, Math.ceil(lines * fontSize * lineHeight));
}

function withMobileRect(node: BuilderCanvasNode, rect: CanvasRect): BuilderCanvasNode {
  const responsive = node.responsive as ResponsiveConfig | undefined;
  return {
    ...node,
    responsive: {
      ...(responsive ?? {}),
      mobile: {
        ...(responsive?.mobile ?? {}),
        // Replace the whole rect so malformed persisted mobile fields cannot leak through.
        rect,
      },
    },
  };
}

function childNodes(nodes: BuilderCanvasNode[], parentId: string): BuilderCanvasNode[] {
  return nodes
    .filter((node) => node.parentId === parentId)
    .sort((left, right) => left.rect.y - right.rect.y || left.zIndex - right.zIndex || left.id.localeCompare(right.id));
}

function resolvedMobileRect(node: BuilderCanvasNode): CanvasRect {
  const tabletRect = node.responsive?.tablet?.rect;
  const mobileRect = node.responsive?.mobile?.rect;
  return {
    x: mobileRect?.x ?? tabletRect?.x ?? node.rect.x,
    y: mobileRect?.y ?? tabletRect?.y ?? node.rect.y,
    width: mobileRect?.width ?? tabletRect?.width ?? node.rect.width,
    height: mobileRect?.height ?? tabletRect?.height ?? node.rect.height,
  };
}

function repairLegalTree(nodes: BuilderCanvasNode[], prefix: LegalPagePrefix): BuilderCanvasNode[] {
  const nodesById = new Map(nodes.map((node) => [node.id, node]));
  const rootId = `${prefix}-legal-root`;
  const containerId = `${prefix}-legal-container`;
  const gridId = `${prefix}-legal-grid`;
  const root = nodesById.get(rootId);
  const container = nodesById.get(containerId);
  const grid = nodesById.get(gridId);
  if (!root || !container || !grid) return nodes;

  const cards = childNodes(nodes, gridId).filter((node) => new RegExp(`^${prefix}-card-\\d+$`).test(node.id));
  if (cards.length === 0) return nodes;

  const rects = new Map<string, CanvasRect>();
  let cardY = 0;

  for (const card of cards) {
    const title = nodesById.get(`${card.id}-title`);
    const copy = nodesById.get(`${card.id}-copy`);
    if (!title || !copy) return nodes;

    const titleHeight = estimateTextHeight(textContent(title), CARD_CONTENT_WIDTH, 18, 1.36);
    rects.set(title.id, { x: CARD_PADDING, y: CARD_PADDING, width: CARD_CONTENT_WIDTH, height: titleHeight });

    let paragraphY = 0;
    let needsArticleBorderClearance = false;
    const paragraphs = childNodes(nodes, copy.id);
    for (const paragraph of paragraphs) {
      const metric = textMetric(paragraph, 16, 1.75);
      const paragraphText = textContent(paragraph);
      const preserveCjkClauses = prefix === 'page-disclaimer' && isDenseHanText(paragraphText);
      const height = estimateTextHeight(
        paragraphText,
        CARD_CONTENT_WIDTH,
        metric.fontSize,
        metric.lineHeight,
        preserveCjkClauses,
      );
      needsArticleBorderClearance ||= preserveCjkClauses;
      rects.set(paragraph.id, { x: 0, y: paragraphY, width: CARD_CONTENT_WIDTH, height });
      paragraphY += height + PARAGRAPH_GAP;
    }
    const copyHeight = Math.max(MIN_TEXT_HEIGHT, paragraphY - (paragraphs.length > 0 ? PARAGRAPH_GAP : 0));
    const copyY = CARD_PADDING + titleHeight + TITLE_COPY_GAP;
    rects.set(copy.id, { x: CARD_PADDING, y: copyY, width: CARD_CONTENT_WIDTH, height: copyHeight });

    const list = childNodes(nodes, card.id).find((node) => node.id.endsWith('-items-list'));
    let contentBottom = copyY + copyHeight;
    if (list) {
      let itemY = 0;
      const items = childNodes(nodes, list.id);
      for (const item of items) {
        const metric = textMetric(item, 15, 1.65);
        const height = estimateTextHeight(
          textContent(item),
          CARD_CONTENT_WIDTH - LIST_TEXT_INDENT,
          metric.fontSize,
          metric.lineHeight,
        );
        rects.set(item.id, { x: 0, y: itemY, width: CARD_CONTENT_WIDTH, height });
        itemY += height + LIST_ITEM_GAP;
      }
      const listHeight = Math.max(MIN_TEXT_HEIGHT, itemY - (items.length > 0 ? LIST_ITEM_GAP : 0));
      const listY = contentBottom + COPY_LIST_GAP;
      rects.set(list.id, { x: CARD_PADDING, y: listY, width: CARD_CONTENT_WIDTH, height: listHeight });
      contentBottom = listY + listHeight;
    }

    // The rendered <article class="card"> clips overflow and owns 24px padding.
    // Keep a real bottom inset after the deepest absolute child.
    const cardHeight = contentBottom + CARD_PADDING + (needsArticleBorderClearance ? 2 : 0);
    rects.set(card.id, { x: 0, y: cardY, width: GRID_WIDTH, height: cardHeight });
    cardY += cardHeight + CARD_GAP;
  }

  const gridHeight = cardY - CARD_GAP;
  const header = nodesById.get(`${prefix}-page-header-root`);
  const headerRect = header ? resolvedMobileRect(header) : null;
  const rootY = headerRect ? headerRect.y + headerRect.height : resolvedMobileRect(root).y;
  rects.set(grid.id, { x: MOBILE_GUTTER, y: 0, width: GRID_WIDTH, height: gridHeight });
  rects.set(container.id, { x: 0, y: SECTION_VERTICAL_INSET, width: MOBILE_WIDTH, height: gridHeight });
  rects.set(root.id, {
    x: 0,
    y: rootY,
    width: MOBILE_WIDTH,
    height: SECTION_VERTICAL_INSET + gridHeight + SECTION_VERTICAL_INSET,
  });

  return nodes.map((node) => {
    const rect = rects.get(node.id);
    return rect ? withMobileRect(node, rect) : node;
  });
}

/**
 * Repairs the known decomposed privacy/disclaimer legal-card tree for mobile.
 * The function is pure so published rendering can safely repair persisted legacy documents.
 */
export function repairLegalPageMobileLayout(nodes: readonly BuilderCanvasNode[]): BuilderCanvasNode[] {
  return LEGAL_PAGE_PREFIXES.reduce(
    (nextNodes, prefix) => repairLegalTree(nextNodes, prefix),
    [...nodes],
  );
}

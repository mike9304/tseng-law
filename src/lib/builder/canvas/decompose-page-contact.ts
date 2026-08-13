import type { BuilderCanvasNode } from './types';
import { locales, type Locale } from '@/lib/locales';
import { pageCopy } from '@/data/page-copy';
import { createOfficesDecomposedNodes } from './decompose-offices';
import {
  createConsultationGuideSectionNodes,
  createContactBlocksSectionNodes,
  createPageHeaderSectionNodes,
} from './decompose-page-shared';

const CONTACT_PAGE_HEADER_HEIGHT = 428;
const CONTACT_PAGE_GUIDE_HEIGHT = 843;
const CONTACT_PAGE_BLOCKS_HEIGHT = 867;
const CONTACT_PAGE_OFFICES_HEIGHT = 909;
const CONTACT_PAGE_TRAILING_SPACE = 10;
const CONTACT_PAGE_DESKTOP_HEIGHT =
  CONTACT_PAGE_HEADER_HEIGHT
  + CONTACT_PAGE_GUIDE_HEIGHT
  + CONTACT_PAGE_BLOCKS_HEIGHT
  + CONTACT_PAGE_OFFICES_HEIGHT
  + CONTACT_PAGE_TRAILING_SPACE;
const CONTACT_INQUIRIES_CARD_X = [0, 299, 597, 895] as const;
const CONTACT_INQUIRIES_CARD_WIDTH = 282;
const CONTACT_INQUIRIES_CARD_CONTENT_WIDTH = CONTACT_INQUIRIES_CARD_WIDTH - 48;

function setNodeRect(
  nodesById: Map<string, BuilderCanvasNode>,
  nodeId: string,
  rect: Partial<BuilderCanvasNode['rect']>,
): void {
  const node = nodesById.get(nodeId);
  if (!node) return;
  node.rect = { ...node.rect, ...rect };
}

function indexedNodeIndexes(
  nodesById: ReadonlyMap<string, BuilderCanvasNode>,
  pattern: RegExp,
): number[] {
  const indexes: number[] = [];
  for (const nodeId of nodesById.keys()) {
    const match = pattern.exec(nodeId);
    if (match?.[1]) indexes.push(Number(match[1]));
  }
  return [...new Set(indexes)].sort((left, right) => left - right);
}

function applyContactPageDesktopParity(nodes: BuilderCanvasNode[], originY: number): void {
  const nodesById = new Map(nodes.map((node) => [node.id, node]));

  setNodeRect(nodesById, 'page-contact-page-header-root', {
    y: originY,
    height: CONTACT_PAGE_HEADER_HEIGHT,
  });

  setNodeRect(nodesById, 'page-contact-guide-root', {
    y: originY + CONTACT_PAGE_HEADER_HEIGHT,
    height: CONTACT_PAGE_GUIDE_HEIGHT,
  });
  setNodeRect(nodesById, 'page-contact-guide-container', {
    x: 51,
    y: 141,
    width: 1178,
    height: 529,
  });
  setNodeRect(nodesById, 'page-contact-guide-label', { y: 9, height: 22 });
  setNodeRect(nodesById, 'page-contact-guide-title', { y: 48, width: 1178, height: 72 });
  setNodeRect(nodesById, 'page-contact-guide-description', { y: 140, width: 720, height: 30 });
  setNodeRect(nodesById, 'page-contact-guide-divider', { y: 202, height: 12 });
  setNodeRect(nodesById, 'page-contact-guide-divider-ornament', { x: 562, y: 0, width: 54, height: 12 });
  setNodeRect(nodesById, 'page-contact-guide-grid', { y: 246, height: 284 });
  [0, 1, 2].forEach((index) => {
    setNodeRect(nodesById, `page-contact-guide-card-${index}`, {
      x: index * 398,
      width: 382,
      height: 284,
    });
  });

  const blocksY = originY + CONTACT_PAGE_HEADER_HEIGHT + CONTACT_PAGE_GUIDE_HEIGHT;
  setNodeRect(nodesById, 'page-contact-contact-root', {
    y: blocksY,
    height: CONTACT_PAGE_BLOCKS_HEIGHT,
  });
  setNodeRect(nodesById, 'page-contact-contact-container', {
    x: 51,
    y: 141,
    width: 1178,
    height: 585,
  });
  setNodeRect(nodesById, 'page-contact-inquiries-label', { y: 9, height: 22 });
  setNodeRect(nodesById, 'page-contact-inquiries-grid', { y: 48, height: 192 });
  [0, 1, 2, 3].forEach((index) => {
    setNodeRect(nodesById, `page-contact-inquiries-card-${index}`, {
      x: CONTACT_INQUIRIES_CARD_X[index],
      y: 0,
      width: CONTACT_INQUIRIES_CARD_WIDTH,
      height: 192,
    });
    setNodeRect(nodesById, `page-contact-inquiries-card-${index}-title`, {
      width: CONTACT_INQUIRIES_CARD_CONTENT_WIDTH,
    });
    setNodeRect(nodesById, `page-contact-inquiries-block-${index}-list`, {
      width: CONTACT_INQUIRIES_CARD_CONTENT_WIDTH,
    });
    [0, 1, 2].forEach((itemIndex) => {
      setNodeRect(nodesById, `page-contact-inquiries-block-${index}-item-${itemIndex}`, {
        width: CONTACT_INQUIRIES_CARD_CONTENT_WIDTH,
      });
    });
  });
  setNodeRect(nodesById, 'page-contact-locations-label', { y: 304, height: 22 });
  setNodeRect(nodesById, 'page-contact-locations-grid', { y: 343, height: 163 });
  const locationIndexes = indexedNodeIndexes(
    nodesById,
    /^page-contact-locations-card-(\d+)$/,
  );
  const locationCardWidth = locationIndexes.length === 4 ? 282 : 382;
  const locationCardGap = locationIndexes.length === 4 ? 17 : 16;
  locationIndexes.forEach((index) => {
    setNodeRect(nodesById, `page-contact-locations-card-${index}`, {
      x: index * (locationCardWidth + locationCardGap),
      width: locationCardWidth,
      height: 163,
    });
    setNodeRect(nodesById, `page-contact-locations-card-${index}-title`, {
      width: locationCardWidth - 48,
    });
    setNodeRect(nodesById, `page-contact-locations-block-${index}-list`, {
      width: locationCardWidth - 48,
    });
  });
  setNodeRect(nodesById, 'page-contact-contact-cta', { y: 538, width: 115, height: 47 });

  const officesY = blocksY + CONTACT_PAGE_BLOCKS_HEIGHT;
  setNodeRect(nodesById, 'home-offices-root', {
    y: officesY,
    height: CONTACT_PAGE_OFFICES_HEIGHT,
  });
  setNodeRect(nodesById, 'home-offices-container', {
    x: 51,
    y: 141,
    width: 1178,
    height: 628,
  });
  setNodeRect(nodesById, 'home-offices-label', { y: 9, height: 22 });
  setNodeRect(nodesById, 'home-offices-title', { y: 48, width: 1178, height: 72 });
  setNodeRect(nodesById, 'home-offices-tabs', { y: 139, width: 1178, height: 47 });
  const officeIndexes = indexedNodeIndexes(nodesById, /^home-offices-tab-(\d+)$/);
  officeIndexes.forEach((index) => {
    setNodeRect(nodesById, `home-offices-tab-${index}`, {
      x: index * 118,
      width: 104,
      height: 47,
    });
    setNodeRect(nodesById, `home-offices-layout-${index}`, {
      y: 206,
      width: 1178,
      height: 422,
    });
    setNodeRect(nodesById, `home-offices-layout-${index}-map`, {
      width: 687,
      height: 422,
    });
    setNodeRect(nodesById, `home-offices-layout-${index}-card`, {
      x: 704,
      width: 474,
      height: 422,
    });
  });
}

function buildContactPage(y: number, locale: Locale, zBase: number): { nodes: BuilderCanvasNode[]; height: number } {
  const page = pageCopy[locale].contact;
  let cursor = y;
  const nodes: BuilderCanvasNode[] = [];

  const header = createPageHeaderSectionNodes({
    prefix: 'page-contact',
    y: cursor,
    locale,
    label: page.label,
    title: page.title,
    description: page.description,
    zBase,
  });
  nodes.push(...header.nodes);
  cursor += CONTACT_PAGE_HEADER_HEIGHT;

  const guide = createConsultationGuideSectionNodes('page-contact', cursor, locale, zBase + 100);
  nodes.push(...guide.nodes);
  cursor += CONTACT_PAGE_GUIDE_HEIGHT;

  const contact = createContactBlocksSectionNodes('page-contact', cursor, locale, zBase + 200, false);
  nodes.push(...contact.nodes);
  cursor += CONTACT_PAGE_BLOCKS_HEIGHT;

  nodes.push(...createOfficesDecomposedNodes(cursor, locale, zBase + 300));
  cursor += CONTACT_PAGE_OFFICES_HEIGHT + CONTACT_PAGE_TRAILING_SPACE;

  applyContactPageDesktopParity(nodes, y);
  return { nodes, height: CONTACT_PAGE_DESKTOP_HEIGHT };
}

export const CONTACT_PAGE_ROOT_HEIGHT = Math.max(...locales.map((locale) => buildContactPage(0, locale, 0).height));

export function createContactPageDecomposedNodes(y: number, locale: Locale, zBase: number): BuilderCanvasNode[] {
  return buildContactPage(y, locale, zBase).nodes;
}

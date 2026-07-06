import type { Locale } from '@/lib/locales';
import { responsivize } from '@/lib/builder/templates/_shared/responsivize';
import {
  type BuilderCompositeCanvasNode,
  type BuilderCanvasNode,
  type BuilderCanvasDocument,
  createDefaultCanvasNodeStyle,
} from '@/lib/builder/canvas/types';
import { isTopLevelFlowSection } from './flow';
import { legalPageContent } from '@/data/legal-pages';
import { pageCopy } from '@/data/page-copy';
import {
  createPage,
  ensureSiteDocument,
  publishPage,
  readPageCanvas,
  readSiteDocument,
  writePageCanvas,
  writeSiteDocument,
} from '@/lib/builder/site/persistence';
import { SEED_DRAFT_UPDATED_BY } from '@/lib/builder/canvas/home-draft-reseed';
import { normalizeBuilderSiteId } from '@/lib/builder/site/identity';
import { matchesStandardPageSlugForLocale } from '@/lib/builder/site/standard-pages';
import type { BuilderPageMeta, BuilderSiteDocument } from '@/lib/builder/site/types';
import { createHomePageCanvasDocument, createHomePageCanvasDocumentDecomposed } from './seed-home';
import {
  createAboutPageDecomposedNodes,
  getAboutPageRootHeight,
} from './decompose-page-about';
import {
  CONTACT_PAGE_ROOT_HEIGHT,
  createContactPageDecomposedNodes,
} from './decompose-page-contact';
import {
  createDisclaimerPageDecomposedNodes,
  getDisclaimerPageRootHeight,
} from './decompose-page-disclaimer';
import {
  createFaqPageDecomposedNodes,
  getFaqPageRootHeight,
} from './decompose-page-faq';
import {
  createLawyersPageDecomposedNodes,
  getLawyersPageRootHeight,
} from './decompose-page-lawyers';
import {
  createPricingPageDecomposedNodes,
  getPricingPageRootHeight,
} from './decompose-page-pricing';
import {
  createPrivacyPageDecomposedNodes,
  getPrivacyPageRootHeight,
} from './decompose-page-privacy';
import {
  REVIEWS_PAGE_ROOT_HEIGHT,
  createReviewsPageDecomposedNodes,
} from './decompose-page-reviews';
import {
  createServicesPageDecomposedNodes,
  getServicesPageRootHeight,
} from './decompose-page-services';
import {
  createHomeContainerNode,
} from './decompose-home-shared';
import { estimateTextHeight } from './decompose-page-shared';

const STAGE_WIDTH = 1280;
const SITE_PAGE_SEED_VERSION = 'site-page-seed-v22';
const COLUMNS_PAGE_ROOT_HEIGHT = 2660;
const ZH_HANT_CONTACT_PAGE_ROOT_HEIGHT = 3033;
const ZH_HANT_REVIEWS_PAGE_ROOT_HEIGHT = 1754;
const seedSitePagesInFlight = new Map<string, Promise<void>>();
const COLLAPSED_RESPONSIVE_RECT_SIZE = 1;
const LEGACY_PAGE_COMPOSITE_PREFIX = 'legacy-page-';
const LEGACY_REVIEW_LAYOUT_CLASSES = new Set([
  'section review-section',
  'review-form-wrap',
  'review-form',
  'review-form-row',
  'review-input',
  'review-input review-select',
  'review-input review-textarea',
  'button review-submit',
  'review-list-title',
  'review-empty',
]);

type PageSeedDefinition = {
  slug: string;
  expectsLegacyComposite?: boolean;
  isHomePage?: boolean;
  includeInNavigation?: boolean;
  titles: Record<Locale, string>;
  buildDocument: (locale: Locale) => BuilderCanvasDocument;
  buildDraftDocument?: (locale: Locale) => BuilderCanvasDocument;
  hasDraftDocumentShape?: (document: BuilderCanvasDocument | null) => boolean;
};

type LegacyCompositeKey =
  | 'legacy-page-about'
  | 'legacy-page-services'
  | 'legacy-page-contact'
  | 'legacy-page-lawyers'
  | 'legacy-page-faq'
  | 'legacy-page-pricing'
  | 'legacy-page-reviews'
  | 'legacy-page-columns'
  | 'legacy-page-videos'
  | 'legacy-page-privacy'
  | 'legacy-page-disclaimer';

const LEGACY_COMPOSITE_GEOMETRY: Partial<Record<LegacyCompositeKey, {
  desktop: number;
  mobile: number;
  rootId: string;
  tablet: number;
}>> = {
  'legacy-page-about': {
    rootId: 'about-page-root',
    desktop: 4943,
    mobile: 8205,
    tablet: 7498,
  },
  'legacy-page-services': {
    rootId: 'services-page-root',
    desktop: 1708,
    mobile: 1567,
    tablet: 1580,
  },
  'legacy-page-contact': {
    rootId: 'contact-page-root',
    desktop: 3057,
    mobile: 3850,
    tablet: 4053,
  },
  'legacy-page-lawyers': {
    rootId: 'lawyers-page-root',
    desktop: 2653,
    mobile: 4706,
    tablet: 4474,
  },
  'legacy-page-faq': {
    rootId: 'faq-page-root',
    desktop: 1750,
    mobile: 2010,
    tablet: 1763,
  },
  'legacy-page-pricing': {
    rootId: 'pricing-page-root',
    desktop: 1450,
    mobile: 2433,
    tablet: 1747,
  },
  'legacy-page-reviews': {
    rootId: 'reviews-page-root',
    desktop: 1711,
    mobile: 1458,
    tablet: 1599,
  },
  'legacy-page-videos': {
    rootId: 'videos-page-root',
    desktop: 2821,
    mobile: 3460,
    tablet: 3001,
  },
};

type ResponsiveViewport = 'mobile' | 'tablet';
type CanvasRect = BuilderCanvasNode['rect'];

function getResponsiveRect(node: BuilderCanvasNode | undefined, viewport: ResponsiveViewport): Partial<CanvasRect> | undefined {
  return node?.responsive?.[viewport]?.rect;
}

function setResponsiveRect(
  node: BuilderCanvasNode | undefined,
  viewport: ResponsiveViewport,
  rect: Partial<CanvasRect>,
): void {
  if (!node) return;

  const existing = node.responsive ?? {};
  const existingOverride = existing[viewport] ?? {};
  node.responsive = {
    ...existing,
    [viewport]: {
      ...existingOverride,
      rect: {
        ...(existingOverride.rect ?? {}),
        ...rect,
      },
    },
  };
}

function setResponsiveFontSize(
  node: BuilderCanvasNode | undefined,
  viewport: ResponsiveViewport,
  fontSize: number,
): void {
  if (!node) return;

  const existing = node.responsive ?? {};
  const existingOverride = existing[viewport] ?? {};
  node.responsive = {
    ...existing,
    [viewport]: {
      ...existingOverride,
      fontSize: Math.max(8, Math.min(160, Math.round(fontSize))),
    },
  };
}

function setDesktopRect(
  nodesById: Map<string, BuilderCanvasNode>,
  nodeId: string,
  rect: Partial<CanvasRect>,
): void {
  const node = nodesById.get(nodeId);
  if (!node) return;
  node.rect = { ...node.rect, ...rect };
}

function setDesktopContainerAbsoluteLayout(
  nodesById: Map<string, BuilderCanvasNode>,
  nodeId: string,
): void {
  const node = nodesById.get(nodeId);
  if (node?.kind !== 'container') return;
  node.content.layoutMode = 'absolute';
  delete node.content.flexConfig;
  delete node.content.gridConfig;
}

function getContentString(node: BuilderCanvasNode | undefined, key: 'label' | 'text'): string {
  if (!node) return '';
  const value = Reflect.get(node.content, key);
  return typeof value === 'string' ? value : '';
}

function getNodeText(node: BuilderCanvasNode | undefined): string {
  return getContentString(node, 'text') || getContentString(node, 'label');
}

function buildChildrenByParent(nodes: BuilderCanvasNode[]): Map<string, BuilderCanvasNode[]> {
  const childrenByParent = new Map<string, BuilderCanvasNode[]>();
  for (const node of nodes) {
    if (!node.parentId) continue;
    const children = childrenByParent.get(node.parentId) ?? [];
    children.push(node);
    childrenByParent.set(node.parentId, children);
  }
  for (const children of childrenByParent.values()) {
    children.sort((left, right) => left.rect.y - right.rect.y || left.rect.x - right.rect.x);
  }
  return childrenByParent;
}

function classNameIncludes(node: BuilderCanvasNode | undefined, token: string): boolean {
  return node ? getNodeClassName(node).includes(token) : false;
}

function mobileHeight(node: BuilderCanvasNode | undefined): number {
  const rect = getResponsiveRect(node, 'mobile');
  return Math.max(1, Math.round(rect?.height ?? node?.rect.height ?? 1));
}

function mobileY(node: BuilderCanvasNode | undefined): number {
  return Math.round(getResponsiveRect(node, 'mobile')?.y ?? node?.rect.y ?? 0);
}

function mobileWidth(node: BuilderCanvasNode | undefined): number {
  const rect = getResponsiveRect(node, 'mobile');
  return Math.max(1, Math.round(rect?.width ?? node?.rect.width ?? 1));
}

function setMobileRect(node: BuilderCanvasNode | undefined, rect: Partial<CanvasRect>): void {
  setResponsiveRect(node, 'mobile', rect);
}

function setMobileFontSize(node: BuilderCanvasNode | undefined, fontSize: number): void {
  setResponsiveFontSize(node, 'mobile', fontSize);
}

function tabletHeight(node: BuilderCanvasNode | undefined): number {
  const rect = getResponsiveRect(node, 'tablet');
  return Math.max(1, Math.round(rect?.height ?? node?.rect.height ?? 1));
}

function tabletY(node: BuilderCanvasNode | undefined): number {
  return Math.round(getResponsiveRect(node, 'tablet')?.y ?? node?.rect.y ?? 0);
}

function tabletWidth(node: BuilderCanvasNode | undefined): number {
  const rect = getResponsiveRect(node, 'tablet');
  return Math.max(1, Math.round(rect?.width ?? node?.rect.width ?? 1));
}

function setTabletRect(node: BuilderCanvasNode | undefined, rect: Partial<CanvasRect>): void {
  setResponsiveRect(node, 'tablet', rect);
}

function setTabletFontSize(node: BuilderCanvasNode | undefined, fontSize: number): void {
  setResponsiveFontSize(node, 'tablet', fontSize);
}

function layoutAttorneyListMobile({
  nodesById,
  childrenByParent,
  listId,
  width,
  fontSize,
  lineHeight,
}: {
  nodesById: Map<string, BuilderCanvasNode>;
  childrenByParent: Map<string, BuilderCanvasNode[]>;
  listId: string;
  width: number;
  fontSize: number;
  lineHeight: number;
}): number {
  const list = nodesById.get(listId);
  const items = childrenByParent.get(listId) ?? [];
  let cursor = 0;
  const gap = fontSize >= 16 ? 8 : 6;

  for (const item of items) {
    const itemHeight = estimateTextHeight(getNodeText(item), width, fontSize, lineHeight);
    setMobileRect(item, { x: 0, y: cursor, width, height: itemHeight });
    setMobileFontSize(item, fontSize);
    cursor += itemHeight + gap;
  }

  const height = Math.max(1, cursor - (items.length > 0 ? gap : 0));
  setMobileRect(list, { x: 0, y: 21, width, height });
  return height;
}

function repairAttorneyCardMobileLayout(
  card: BuilderCanvasNode,
  nodesById: Map<string, BuilderCanvasNode>,
  childrenByParent: Map<string, BuilderCanvasNode[]>,
): number {
  const isLead = classNameIncludes(card, 'attorney-card--lead');
  const width = mobileWidth(card);
  const contentPadX = isLead ? 24 : 16;
  const contentPadTop = isLead ? 18 : 14;
  const contentPadBottom = isLead ? 18 : 14;
  const contentWidth = Math.max(240, width - contentPadX * 2);
  const photoHeight = Math.round(width * 1.25);
  const nameFont = isLead ? 24 : 17;
  const roleFont = 15;
  const emailFont = 13;
  const labelFont = 11;
  const listFont = isLead ? 16 : 14;
  const listLineHeight = isLead ? 1.7 : 1.6;
  const sourceFont = 12;
  const photo = nodesById.get(`${card.id}-photo`);
  const image = nodesById.get(`${card.id}-photo-image`);
  const info = nodesById.get(`${card.id}-info`);

  setMobileRect(photo, { x: 0, y: 0, width, height: photoHeight });
  setMobileRect(image, { x: 0, y: 0, width, height: photoHeight });

  let cursor = contentPadTop;
  const name = nodesById.get(`${card.id}-name`);
  const nameLink = nodesById.get(`${card.id}-name-link`);
  const nameHeight = estimateTextHeight(getNodeText(nameLink) || getNodeText(name), contentWidth, nameFont, 1.15);
  setMobileRect(name, { x: contentPadX, y: cursor, width: contentWidth, height: nameHeight });
  setMobileRect(nameLink, { x: 0, y: 0, width: contentWidth, height: nameHeight });
  setMobileFontSize(name, nameFont);
  setMobileFontSize(nameLink, nameFont);
  cursor += nameHeight + 8;

  const role = nodesById.get(`${card.id}-role`);
  const roleHeight = estimateTextHeight(getNodeText(role), contentWidth, roleFont, 1.35);
  setMobileRect(role, { x: contentPadX, y: cursor, width: contentWidth, height: roleHeight });
  setMobileFontSize(role, roleFont);
  cursor += roleHeight + 7;

  const email = nodesById.get(`${card.id}-email`);
  const emailHeight = estimateTextHeight(getNodeText(email), contentWidth, emailFont, 1.4);
  setMobileRect(email, { x: contentPadX, y: cursor, width: contentWidth, height: emailHeight });
  setMobileFontSize(email, emailFont);
  cursor += emailHeight + (isLead ? 18 : 12);

  for (const key of ['intro', 'education', 'experience']) {
    const section = nodesById.get(`${card.id}-${key}-section`);
    const label = nodesById.get(`${card.id}-${key}-label`);
    const listId = `${card.id}-${key}-list`;
    const listHeight = layoutAttorneyListMobile({
      nodesById,
      childrenByParent,
      listId,
      width: contentWidth,
      fontSize: listFont,
      lineHeight: listLineHeight,
    });
    const sectionHeight = 21 + listHeight;
    setMobileRect(label, { x: 0, y: 0, width: contentWidth, height: 16 });
    setMobileFontSize(label, labelFont);
    setMobileRect(section, { x: contentPadX, y: cursor, width: contentWidth, height: sectionHeight });
    cursor += sectionHeight + (isLead ? 14 : 9);
  }

  const source = nodesById.get(`${card.id}-source`);
  const sourceHeight = estimateTextHeight(getNodeText(source), contentWidth, sourceFont, 1.6);
  setMobileRect(source, { x: contentPadX, y: cursor, width: contentWidth, height: sourceHeight });
  setMobileFontSize(source, sourceFont);
  cursor += sourceHeight + 11;

  const actions = nodesById.get(`${card.id}-actions`);
  const actionButtons = (childrenByParent.get(`${card.id}-actions`) ?? [])
    .filter((node) => node.kind === 'button')
    .sort((left, right) => left.rect.x - right.rect.x);
  const buttonGap = 12;
  const buttonHeight = 40;
  const buttonWidth = actionButtons.length > 1
    ? Math.floor((contentWidth - buttonGap) / 2)
    : Math.min(150, contentWidth);
  actionButtons.forEach((button, index) => {
    setMobileRect(button, { x: index * (buttonWidth + buttonGap), y: 0, width: buttonWidth, height: buttonHeight });
  });
  setMobileRect(actions, { x: contentPadX, y: cursor, width: contentWidth, height: buttonHeight });
  cursor += buttonHeight + contentPadBottom;

  const infoHeight = cursor;
  setMobileRect(info, { x: 0, y: photoHeight, width, height: infoHeight });
  setMobileRect(card, { width, height: photoHeight + infoHeight });
  return photoHeight + infoHeight;
}

function repairAttorneySectionMobileLayout(
  root: BuilderCanvasNode,
  nodesById: Map<string, BuilderCanvasNode>,
): void {
  const prefix = root.id.replace(/-attorney-root$/, '');
  const container = nodesById.get(`${prefix}-attorney-container`);
  const containerWidth = mobileWidth(container);
  const sectionGap = 40;
  const titleToCardGap = 42;
  const titleHeight = 28;
  const centeredCardX = Math.max(0, (containerWidth - 330) / 2);

  const label = nodesById.get(`${prefix}-attorney-label`);
  const title = nodesById.get(`${prefix}-attorney-title`);
  const description = nodesById.get(`${prefix}-attorney-description`);
  const headerBottom = Math.max(
    mobileY(label) + mobileHeight(label),
    mobileY(title) + mobileHeight(title),
    mobileY(description) + mobileHeight(description),
  );

  let cursor = headerBottom + 34;

  const leadWrap = nodesById.get(`${prefix}-lead-wrap`);
  const leadTitle = nodesById.get(`${prefix}-lead-wrap-title`);
  const leadBadge = nodesById.get(`${prefix}-lead-wrap-badge`);
  const leadCard = nodesById.get(`${prefix}-lead-card`);
  if (leadWrap && leadCard) {
    setMobileRect(leadTitle, { y: 0, height: titleHeight });
    setMobileRect(leadBadge, { y: 0, height: 26 });
    setMobileRect(leadCard, { x: 0, y: titleToCardGap });
    const leadHeight = titleToCardGap + mobileHeight(leadCard);
    setMobileRect(leadWrap, { x: 0, y: cursor, width: containerWidth, height: leadHeight });
    cursor += leadHeight + sectionGap;
  }

  const staffWrap = nodesById.get(`${prefix}-staff-wrap`);
  const staffTitle = nodesById.get(`${prefix}-staff-wrap-title`);
  const staffGrid = nodesById.get(`${prefix}-staff-grid`);
  const staffCards = [nodesById.get(`${prefix}-staff-card-0`), nodesById.get(`${prefix}-staff-card-1`)]
    .filter((node): node is BuilderCanvasNode => Boolean(node));
  if (staffWrap && staffGrid && staffCards.length > 0) {
    setMobileRect(staffTitle, { y: 0, height: titleHeight });
    let gridCursor = 0;
    for (const card of staffCards) {
      setMobileRect(card, { x: centeredCardX, y: gridCursor, width: 330 });
      gridCursor += mobileHeight(card) + 22;
    }
    const gridHeight = Math.max(1, gridCursor - 22);
    setMobileRect(staffGrid, { x: 0, y: titleToCardGap, width: containerWidth, height: gridHeight });
    const staffHeight = titleToCardGap + gridHeight;
    setMobileRect(staffWrap, { x: 0, y: cursor, width: containerWidth, height: staffHeight });
    cursor += staffHeight + sectionGap;
  }

  const partnerWrap = nodesById.get(`${prefix}-partner-wrap`);
  const partnerTitle = nodesById.get(`${prefix}-partner-wrap-title`);
  const partnerCard = nodesById.get(`${prefix}-partner-card`);
  if (partnerWrap && partnerCard) {
    setMobileRect(partnerTitle, { y: 0, height: titleHeight });
    setMobileRect(partnerCard, { x: centeredCardX, y: titleToCardGap, width: 330 });
    const partnerHeight = titleToCardGap + mobileHeight(partnerCard);
    setMobileRect(partnerWrap, { x: 0, y: cursor, width: containerWidth, height: partnerHeight });
    cursor += partnerHeight;
  }

  const containerHeight = cursor + 18;
  const containerY = mobileY(container);
  setMobileRect(container, { height: containerHeight });
  setMobileRect(root, { height: containerY + containerHeight + 34 });
}

function layoutAttorneyListTablet({
  nodesById,
  childrenByParent,
  listId,
  width,
  fontSize,
  lineHeight,
}: {
  nodesById: Map<string, BuilderCanvasNode>;
  childrenByParent: Map<string, BuilderCanvasNode[]>;
  listId: string;
  width: number;
  fontSize: number;
  lineHeight: number;
}): number {
  const list = nodesById.get(listId);
  const items = childrenByParent.get(listId) ?? [];
  let cursor = 0;
  const gap = fontSize >= 16 ? 8 : 6;

  for (const item of items) {
    const itemHeight = estimateTextHeight(getNodeText(item), width, fontSize, lineHeight);
    setTabletRect(item, { x: 0, y: cursor, width, height: itemHeight });
    setTabletFontSize(item, fontSize);
    cursor += itemHeight + gap;
  }

  const height = Math.max(1, cursor - (items.length > 0 ? gap : 0));
  setTabletRect(list, { x: 0, y: 22, width, height });
  return height;
}

function repairAttorneyCardTabletLayout(
  card: BuilderCanvasNode,
  nodesById: Map<string, BuilderCanvasNode>,
  childrenByParent: Map<string, BuilderCanvasNode[]>,
): number {
  const isLead = classNameIncludes(card, 'attorney-card--lead');
  const width = tabletWidth(card);
  const contentPadX = isLead ? 28 : 24;
  const contentPadTop = isLead ? 22 : 18;
  const contentPadBottom = isLead ? 22 : 18;
  const contentWidth = Math.max(280, width - contentPadX * 2);
  const photoHeight = Math.round(width * (isLead ? 0.62 : 0.56));
  const nameFont = isLead ? 30 : 22;
  const roleFont = 16;
  const emailFont = 14;
  const labelFont = 12;
  const listFont = 16;
  const listLineHeight = 1.65;
  const sourceFont = 13;
  const photo = nodesById.get(`${card.id}-photo`);
  const image = nodesById.get(`${card.id}-photo-image`);
  const info = nodesById.get(`${card.id}-info`);

  setTabletRect(photo, { x: 0, y: 0, width, height: photoHeight });
  setTabletRect(image, { x: 0, y: 0, width, height: photoHeight });

  let cursor = contentPadTop;
  const name = nodesById.get(`${card.id}-name`);
  const nameLink = nodesById.get(`${card.id}-name-link`);
  const nameHeight = estimateTextHeight(getNodeText(nameLink) || getNodeText(name), contentWidth, nameFont, 1.15);
  setTabletRect(name, { x: contentPadX, y: cursor, width: contentWidth, height: nameHeight });
  setTabletRect(nameLink, { x: 0, y: 0, width: contentWidth, height: nameHeight });
  setTabletFontSize(name, nameFont);
  setTabletFontSize(nameLink, nameFont);
  cursor += nameHeight + 10;

  const role = nodesById.get(`${card.id}-role`);
  const roleHeight = estimateTextHeight(getNodeText(role), contentWidth, roleFont, 1.35);
  setTabletRect(role, { x: contentPadX, y: cursor, width: contentWidth, height: roleHeight });
  setTabletFontSize(role, roleFont);
  cursor += roleHeight + 8;

  const email = nodesById.get(`${card.id}-email`);
  const emailHeight = estimateTextHeight(getNodeText(email), contentWidth, emailFont, 1.4);
  setTabletRect(email, { x: contentPadX, y: cursor, width: contentWidth, height: emailHeight });
  setTabletFontSize(email, emailFont);
  cursor += emailHeight + (isLead ? 20 : 14);

  for (const key of ['intro', 'education', 'experience']) {
    const section = nodesById.get(`${card.id}-${key}-section`);
    const label = nodesById.get(`${card.id}-${key}-label`);
    const listId = `${card.id}-${key}-list`;
    const listHeight = layoutAttorneyListTablet({
      nodesById,
      childrenByParent,
      listId,
      width: contentWidth,
      fontSize: listFont,
      lineHeight: listLineHeight,
    });
    const sectionHeight = 22 + listHeight;
    setTabletRect(label, { x: 0, y: 0, width: contentWidth, height: 17 });
    setTabletFontSize(label, labelFont);
    setTabletRect(section, { x: contentPadX, y: cursor, width: contentWidth, height: sectionHeight });
    cursor += sectionHeight + (isLead ? 16 : 11);
  }

  const source = nodesById.get(`${card.id}-source`);
  const sourceHeight = estimateTextHeight(getNodeText(source), contentWidth, sourceFont, 1.6);
  setTabletRect(source, { x: contentPadX, y: cursor, width: contentWidth, height: sourceHeight });
  setTabletFontSize(source, sourceFont);
  cursor += sourceHeight + 12;

  const actions = nodesById.get(`${card.id}-actions`);
  const actionButtons = (childrenByParent.get(`${card.id}-actions`) ?? [])
    .filter((node) => node.kind === 'button')
    .sort((left, right) => left.rect.x - right.rect.x);
  const buttonGap = 12;
  const buttonHeight = 42;
  const buttonWidth = actionButtons.length > 1
    ? Math.floor((contentWidth - buttonGap) / 2)
    : Math.min(180, contentWidth);
  actionButtons.forEach((button, index) => {
    setTabletRect(button, { x: index * (buttonWidth + buttonGap), y: 0, width: buttonWidth, height: buttonHeight });
    setTabletFontSize(button, 14);
  });
  setTabletRect(actions, { x: contentPadX, y: cursor, width: contentWidth, height: buttonHeight });
  cursor += buttonHeight + contentPadBottom;

  const infoHeight = cursor;
  setTabletRect(info, { x: 0, y: photoHeight, width, height: infoHeight });
  setTabletRect(card, { width, height: photoHeight + infoHeight });
  return photoHeight + infoHeight;
}

function repairAttorneySectionTabletLayout(
  root: BuilderCanvasNode,
  nodesById: Map<string, BuilderCanvasNode>,
): void {
  const prefix = root.id.replace(/-attorney-root$/, '');
  const container = nodesById.get(`${prefix}-attorney-container`);
  const containerWidth = tabletWidth(container);
  const cardWidth = Math.min(720, Math.max(320, containerWidth - 48));
  const centeredCardX = Math.max(0, Math.round((containerWidth - cardWidth) / 2));
  const sectionGap = 48;
  const titleToCardGap = 46;
  const titleHeight = 32;

  const label = nodesById.get(`${prefix}-attorney-label`);
  const title = nodesById.get(`${prefix}-attorney-title`);
  const description = nodesById.get(`${prefix}-attorney-description`);
  const headerBottom = Math.max(
    tabletY(label) + tabletHeight(label),
    tabletY(title) + tabletHeight(title),
    tabletY(description) + tabletHeight(description),
  );

  let cursor = headerBottom + 42;

  const leadWrap = nodesById.get(`${prefix}-lead-wrap`);
  const leadTitle = nodesById.get(`${prefix}-lead-wrap-title`);
  const leadBadge = nodesById.get(`${prefix}-lead-wrap-badge`);
  const leadCard = nodesById.get(`${prefix}-lead-card`);
  if (leadWrap && leadCard) {
    setTabletRect(leadTitle, { y: 0, height: titleHeight });
    setTabletRect(leadBadge, { y: 0, height: 28 });
    setTabletRect(leadCard, { x: centeredCardX, y: titleToCardGap, width: cardWidth });
    const leadHeight = titleToCardGap + tabletHeight(leadCard);
    setTabletRect(leadWrap, { x: 0, y: cursor, width: containerWidth, height: leadHeight });
    cursor += leadHeight + sectionGap;
  }

  const staffWrap = nodesById.get(`${prefix}-staff-wrap`);
  const staffTitle = nodesById.get(`${prefix}-staff-wrap-title`);
  const staffGrid = nodesById.get(`${prefix}-staff-grid`);
  const staffCards = [nodesById.get(`${prefix}-staff-card-0`), nodesById.get(`${prefix}-staff-card-1`)]
    .filter((node): node is BuilderCanvasNode => Boolean(node));
  if (staffWrap && staffGrid && staffCards.length > 0) {
    setTabletRect(staffTitle, { y: 0, height: titleHeight });
    let gridCursor = 0;
    for (const card of staffCards) {
      setTabletRect(card, { x: centeredCardX, y: gridCursor, width: cardWidth });
      gridCursor += tabletHeight(card) + 26;
    }
    const gridHeight = Math.max(1, gridCursor - 26);
    setTabletRect(staffGrid, { x: 0, y: titleToCardGap, width: containerWidth, height: gridHeight });
    const staffHeight = titleToCardGap + gridHeight;
    setTabletRect(staffWrap, { x: 0, y: cursor, width: containerWidth, height: staffHeight });
    cursor += staffHeight + sectionGap;
  }

  const partnerWrap = nodesById.get(`${prefix}-partner-wrap`);
  const partnerTitle = nodesById.get(`${prefix}-partner-wrap-title`);
  const partnerCard = nodesById.get(`${prefix}-partner-card`);
  if (partnerWrap && partnerCard) {
    setTabletRect(partnerTitle, { y: 0, height: titleHeight });
    setTabletRect(partnerCard, { x: centeredCardX, y: titleToCardGap, width: cardWidth });
    const partnerHeight = titleToCardGap + tabletHeight(partnerCard);
    setTabletRect(partnerWrap, { x: 0, y: cursor, width: containerWidth, height: partnerHeight });
    cursor += partnerHeight;
  }

  const containerHeight = cursor + 24;
  const containerY = tabletY(container);
  setTabletRect(container, { height: containerHeight });
  setTabletRect(root, { height: containerY + containerHeight + 40 });
}

function repairAttorneyTabletLayout(nodes: BuilderCanvasNode[]): void {
  const nodesById = new Map(nodes.map((node) => [node.id, node]));
  const childrenByParent = buildChildrenByParent(nodes);
  const roots = nodes.filter((node) => node.id.endsWith('-attorney-root'));
  if (roots.length === 0) return;

  for (const root of roots) {
    const prefix = root.id.replace(/-attorney-root$/, '');
    const containerWidth = tabletWidth(nodesById.get(`${prefix}-attorney-container`));
    const cardWidth = Math.min(720, Math.max(320, containerWidth - 48));
    const cards = [
      nodesById.get(`${prefix}-lead-card`),
      nodesById.get(`${prefix}-staff-card-0`),
      nodesById.get(`${prefix}-staff-card-1`),
      nodesById.get(`${prefix}-partner-card`),
    ].filter((node): node is BuilderCanvasNode => Boolean(node));

    for (const card of cards) {
      setTabletRect(card, { width: cardWidth });
      repairAttorneyCardTabletLayout(card, nodesById, childrenByParent);
    }

    repairAttorneySectionTabletLayout(root, nodesById);
  }
}

function repairAttorneyMobileLayout(nodes: BuilderCanvasNode[]): void {
  const nodesById = new Map(nodes.map((node) => [node.id, node]));
  const childrenByParent = buildChildrenByParent(nodes);
  const attorneyCards = nodes.filter((node) => (
    classNameIncludes(node, 'attorney-card--lead') || classNameIncludes(node, 'attorney-card--sub')
  ));
  if (attorneyCards.length === 0) return;

  for (const card of attorneyCards) {
    if (classNameIncludes(card, 'attorney-card--sub')) {
      setMobileRect(card, { width: 330 });
    }
    repairAttorneyCardMobileLayout(card, nodesById, childrenByParent);
  }

  for (const root of nodes.filter((node) => node.id.endsWith('-attorney-root'))) {
    repairAttorneySectionMobileLayout(root, nodesById);
  }
}

function getPricingCardIndex(node: BuilderCanvasNode): number {
  const match = /^page-pricing-card-(\d+)$/.exec(node.id);
  return match ? Number(match[1]) : Number.POSITIVE_INFINITY;
}

function repairPricingMobileLayout(nodesById: Map<string, BuilderCanvasNode>): void {
  const root = nodesById.get('page-pricing-section-root');
  const container = nodesById.get('page-pricing-section-container');
  const grid = nodesById.get('page-pricing-grid');
  const disclaimerWrap = nodesById.get('page-pricing-disclaimer-wrap');
  const ctaWrap = nodesById.get('page-pricing-cta-wrap');
  if (!root || !container || !grid || !disclaimerWrap || !ctaWrap) return;

  const cards = [...nodesById.values()]
    .filter((node) => /^page-pricing-card-\d+$/.test(node.id))
    .sort((left, right) => getPricingCardIndex(left) - getPricingCardIndex(right));
  if (cards.length === 0) return;

  const cardWidth = 340;
  const cardX = 1.5;
  const cardHeights = [404, 433, 457, 404];
  const gap = 24;
  const contentX = 25;
  const contentWidth = 290;
  const iconSize = 78;
  const iconX = Math.round((cardWidth - iconSize) / 2);
  const iconY = 33;
  let cursor = 0;

  for (const card of cards) {
    const index = getPricingCardIndex(card);
    const cardHeight = cardHeights[index] ?? 404;
    const priceHeight = index === 0 || index === 3 ? 72 : 48;
    const detailsHeight = index === 2 ? 120 : 96;

    setMobileRect(card, { x: cardX, y: cursor, width: cardWidth, height: cardHeight });
    setMobileRect(nodesById.get(`${card.id}-icon`), { x: iconX, y: iconY, width: iconSize, height: iconSize });
    setMobileRect(nodesById.get(`${card.id}-icon-svg`), { x: 19, y: 19, width: 40, height: 40 });
    setMobileRect(nodesById.get(`${card.id}-title`), { x: contentX, y: 123, width: contentWidth, height: 25 });
    setMobileFontSize(nodesById.get(`${card.id}-title`), 18);
    setMobileRect(nodesById.get(`${card.id}-price`), { x: contentX, y: 163, width: contentWidth, height: priceHeight });
    setMobileRect(nodesById.get(`${card.id}-amount`), { x: 0, y: 0, width: contentWidth, height: 48 });
    setMobileFontSize(nodesById.get(`${card.id}-amount`), 28);
    setMobileRect(nodesById.get(`${card.id}-unit`), { x: 0, y: 50, width: contentWidth, height: 23 });
    setMobileFontSize(nodesById.get(`${card.id}-unit`), 13);
    setMobileRect(nodesById.get(`${card.id}-details`), { x: contentX, y: index === 0 || index === 3 ? 260 : 235, width: contentWidth, height: detailsHeight });

    const detailItems = [...nodesById.values()]
      .filter((node) => node.id.startsWith(`${card.id}-detail-item-`))
      .sort((left, right) => left.zIndex - right.zIndex);
    let detailCursor = 0;
    for (const item of detailItems) {
      const itemHeight = index === 2 && item.zIndex === 2 ? 48 : 24;
      setMobileRect(item, { x: 0, y: detailCursor, width: contentWidth, height: itemHeight });
      setMobileFontSize(item, 14);
      detailCursor += itemHeight + (itemHeight > 24 ? 0 : 0);
    }

    const note = nodesById.get(`${card.id}-note`);
    if (note) {
      setMobileRect(note, { x: contentX, y: index === 2 ? 370 : 346, width: contentWidth, height: 54 });
      setMobileFontSize(note, 12);
    }

    cursor += cardHeight + gap;
  }

  const gridHeight = Math.max(1, cursor - gap);
  setMobileRect(grid, { x: 0, y: 115, width: mobileWidth(container), height: gridHeight });

  const disclaimerY = mobileY(grid) + gridHeight + 44;
  setMobileRect(disclaimerWrap, { x: 0, y: disclaimerY, width: mobileWidth(container), height: 67 });

  const ctaY = disclaimerY + 99;
  setMobileRect(ctaWrap, { x: 1.5, y: ctaY, width: 340, height: 47 });

  const containerHeight = ctaY + 47 + 48;
  setMobileRect(container, { x: 0, y: 0, height: containerHeight });
  setMobileRect(root, { height: mobileY(container) + containerHeight });
}

function repairPricingTabletLayout(nodesById: Map<string, BuilderCanvasNode>): void {
  const root = nodesById.get('page-pricing-section-root');
  const container = nodesById.get('page-pricing-section-container');
  const grid = nodesById.get('page-pricing-grid');
  const disclaimerWrap = nodesById.get('page-pricing-disclaimer-wrap');
  const ctaWrap = nodesById.get('page-pricing-cta-wrap');
  if (!root || !container || !grid || !disclaimerWrap || !ctaWrap) return;

  const cards = [...nodesById.values()]
    .filter((node) => /^page-pricing-card-\d+$/.test(node.id))
    .sort((left, right) => getPricingCardIndex(left) - getPricingCardIndex(right));
  if (cards.length === 0) return;

  const gapX = 28;
  const gapY = 28;
  const cardWidth = Math.floor((tabletWidth(container) - 48 - gapX) / 2);
  const rowStartY = 20;
  const firstRowHeight = Math.max(tabletHeight(cards[0]), tabletHeight(cards[1]));
  const secondRowY = rowStartY + firstRowHeight + gapY;

  cards.forEach((card, index) => {
    const column = index % 2;
    const row = Math.floor(index / 2);
    setTabletRect(card, {
      x: 24 + column * (cardWidth + gapX),
      y: row === 0 ? rowStartY : secondRowY,
      width: cardWidth,
    });
  });

  const secondRowHeight = Math.max(tabletHeight(cards[2]), tabletHeight(cards[3]));
  const gridHeight = secondRowY + secondRowHeight + 20;
  setTabletRect(grid, { y: 189, height: gridHeight });

  const disclaimerY = tabletY(grid) + gridHeight + 28;
  setTabletRect(disclaimerWrap, { x: 0, y: disclaimerY, width: tabletWidth(container) });

  const ctaY = disclaimerY + tabletHeight(disclaimerWrap) + 28;
  setTabletRect(ctaWrap, { x: 24, y: ctaY, width: Math.max(1, tabletWidth(container) - 48) });

  const containerHeight = ctaY + tabletHeight(ctaWrap) + 32;
  setTabletRect(container, { height: containerHeight });
  setTabletRect(root, { height: tabletY(container) + containerHeight + 40 });
}

function repairPricingResponsiveLayout(nodes: BuilderCanvasNode[]): void {
  const nodesById = new Map(nodes.map((node) => [node.id, node]));
  if (!nodesById.has('page-pricing-section-root')) return;

  repairPricingMobileLayout(nodesById);
  repairPricingTabletLayout(nodesById);
}

function repairPageHeaderMobileLayout(nodes: BuilderCanvasNode[]): void {
  const nodesById = new Map(nodes.map((node) => [node.id, node]));
  const roots = nodes.filter((node) => node.id.endsWith('-page-header-root'));

  for (const root of roots) {
    const prefix = root.id.slice(0, -'-page-header-root'.length);
    const container = nodesById.get(`${prefix}-page-header-container`);
    if (!container) continue;

    setMobileRect(root, { x: 0, y: mobileY(root), width: 375, height: 310 });
    setMobileRect(container, { x: 1.5, y: 51, width: 340, height: 230 });

    setMobileRect(nodesById.get(`${prefix}-breadcrumb`), { x: 0, y: 0, width: 122, height: 23 });
    setMobileRect(nodesById.get(`${prefix}-page-header-label`), { x: 121, y: 4, width: 129, height: 22 });

    const title = nodesById.get(`${prefix}-page-header-title`);
    setMobileRect(title, { x: 0, y: 43, width: 340, height: 36 });
    setMobileFontSize(title, 32);

    const description = nodesById.get(`${prefix}-page-header-description`);
    const hasDescription = Boolean(description);
    if (description) {
      setMobileRect(description, { x: 0, y: 107, width: 340, height: 27 });
      setMobileFontSize(description, 16);
    }

    const effective = nodesById.get(`${prefix}-page-header-effective`);
    const dividerY = effective ? 204 : hasDescription ? 166 : 118;
    if (effective) {
      setMobileRect(effective, { x: 0, y: 154, width: 340, height: 24 });
      setMobileFontSize(effective, 14);
      setMobileRect(root, { height: 350 });
      setMobileRect(container, { height: 278 });
    }

    setMobileRect(nodesById.get(`${prefix}-page-header-divider`), { x: 0, y: dividerY, width: 340, height: 12 });
    setMobileRect(nodesById.get(`${prefix}-page-header-divider-ornament`), { x: 110, y: 0, width: 120, height: 12 });
  }
}

function repairServicesMobileLayout(nodesById: Map<string, BuilderCanvasNode>): void {
  const root = nodesById.get('home-services-root');
  const container = nodesById.get('home-services-container');
  const list = nodesById.get('home-services-list');
  if (!root || !container || !list) return;

  setMobileRect(root, { height: 1285 });
  setMobileRect(container, { x: 34, y: 49, width: 308, height: 1187 });
  setMobileRect(nodesById.get('home-services-label'), { x: 0, y: 8, width: 132, height: 21 });
  setMobileRect(nodesById.get('home-services-title'), { x: 0, y: 47, width: 308, height: 96 });
  setMobileRect(nodesById.get('home-services-description'), { x: 0, y: 162, width: 308, height: 54 });
  setMobileRect(nodesById.get('home-services-divider'), { x: 0, y: 226, width: 308, height: 12 });
  setMobileRect(nodesById.get('home-services-divider-mark'), { x: 127, y: 0, width: 54, height: 12 });
  setMobileRect(list, { x: 0, y: 244, width: 308, height: 942 });

  for (const node of nodesById.values()) {
    const aliasMatch = /^home-services-card-(\d+)-alias-\d+$/.exec(node.id);
    if (aliasMatch) {
      const index = Number(aliasMatch[1]);
      setMobileRect(node, { x: 0, y: Math.max(0, index * 162 - 72), width: 4, height: 4 });
      continue;
    }

    const cardMatch = /^home-services-card-(\d+)$/.exec(node.id);
    if (cardMatch) {
      const index = Number(cardMatch[1]);
      setMobileRect(node, { x: 0, y: index * 162, width: 308, height: 130 });
      continue;
    }

    if (/^home-services-card-\d+-toggle$/.test(node.id)) {
      setMobileRect(node, { x: 0, y: 0, width: 308, height: 130 });
      continue;
    }

    if (/^home-services-card-\d+-header$/.test(node.id)) {
      setMobileRect(node, { x: 24, y: 20, width: 240, height: 90 });
      continue;
    }

    if (/^home-services-card-\d+-icon$/.test(node.id)) {
      setMobileRect(node, { x: 0, y: 0, width: 46, height: 46 });
      continue;
    }

    if (/^home-services-card-\d+-icon-svg$/.test(node.id)) {
      setMobileRect(node, { x: 11, y: 11, width: 24, height: 24 });
      continue;
    }

    if (/^home-services-card-\d+-title$/.test(node.id)) {
      setMobileRect(node, { x: 58, y: 4, width: 206, height: 52 });
      continue;
    }

    if (/^home-services-card-\d+-chevron$/.test(node.id)) {
      setMobileRect(node, { x: 272, y: 33, width: 20, height: 29 });
      continue;
    }

    if (/^home-services-card-\d+-body$/.test(node.id)) {
      setMobileRect(node, { x: 0, y: 97, width: 308, height: COLLAPSED_RESPONSIVE_RECT_SIZE });
      continue;
    }

    if (/^home-services-card-\d+-description$/.test(node.id)) {
      setMobileRect(node, { x: 24, y: 0, width: 260, height: 54 });
    }
  }
}

function repairServicesTabletLayout(nodesById: Map<string, BuilderCanvasNode>): void {
  const root = nodesById.get('home-services-root');
  const container = nodesById.get('home-services-container');
  const list = nodesById.get('home-services-list');
  if (!root || !container || !list) return;

  setTabletRect(root, { height: 1166 });
  setTabletRect(container, { x: 31, y: 92, width: 675, height: 980 });
  setTabletRect(nodesById.get('home-services-label'), { x: 0, y: 8, width: 132, height: 21 });
  setTabletRect(nodesById.get('home-services-title'), { x: 0, y: 47, width: 675, height: 60 });
  setTabletRect(nodesById.get('home-services-description'), { x: 0, y: 126, width: 675, height: 27 });
  setTabletRect(nodesById.get('home-services-divider'), { x: 0, y: 185, width: 675, height: 12 });
  setTabletRect(nodesById.get('home-services-divider-mark'), { x: 310, y: 0, width: 54, height: 12 });
  setTabletRect(list, { x: 0, y: 229, width: 675, height: 750 });

  for (const node of nodesById.values()) {
    const aliasMatch = /^home-services-card-(\d+)-alias-\d+$/.exec(node.id);
    if (aliasMatch) {
      const index = Number(aliasMatch[1]);
      setTabletRect(node, { x: 0, y: Math.max(0, index * 130 - 72), width: 4, height: 4 });
      continue;
    }

    const cardMatch = /^home-services-card-(\d+)$/.exec(node.id);
    if (cardMatch) {
      const index = Number(cardMatch[1]);
      setTabletRect(node, { x: 0, y: index * 130, width: 675, height: 98 });
      continue;
    }

    if (/^home-services-card-\d+-toggle$/.test(node.id)) {
      setTabletRect(node, { x: 0, y: 0, width: 675, height: 98 });
      continue;
    }

    if (/^home-services-card-\d+-header$/.test(node.id)) {
      setTabletRect(node, { x: 24, y: 20, width: 560, height: 56 });
      continue;
    }

    if (/^home-services-card-\d+-icon$/.test(node.id)) {
      setTabletRect(node, { x: 0, y: 0, width: 46, height: 46 });
      continue;
    }

    if (/^home-services-card-\d+-icon-svg$/.test(node.id)) {
      setTabletRect(node, { x: 11, y: 11, width: 24, height: 24 });
      continue;
    }

    if (/^home-services-card-\d+-title$/.test(node.id)) {
      setTabletRect(node, { x: 58, y: 16, width: 520, height: 25 });
      continue;
    }

    if (/^home-services-card-\d+-chevron$/.test(node.id)) {
      setTabletRect(node, { x: 629, y: 33, width: 20, height: 29 });
      continue;
    }

    if (/^home-services-card-\d+-body$/.test(node.id)) {
      setTabletRect(node, { x: 0, y: 97, width: 675, height: COLLAPSED_RESPONSIVE_RECT_SIZE });
      continue;
    }

    if (/^home-services-card-\d+-description$/.test(node.id)) {
      setTabletRect(node, { x: 24, y: 0, width: 625, height: 82 });
    }
  }
}

function repairServicesResponsiveLayout(nodesById: Map<string, BuilderCanvasNode>): void {
  if (!nodesById.has('home-services-root')) return;
  repairServicesMobileLayout(nodesById);
  repairServicesTabletLayout(nodesById);
}

function repairColumnsResponsiveLayout(nodesById: Map<string, BuilderCanvasNode>): void {
  const root = nodesById.get('columns-page-root');
  const hero = nodesById.get('columns-hero');
  const section = nodesById.get('columns-feed-section');
  const title = nodesById.get('columns-feed-title');
  const copy = nodesById.get('columns-feed-copy');
  const feed = nodesById.get('columns-feed');
  if (!root || !hero || !section || !title || !copy || !feed) return;

  // Mobile: 1-column archive cards need enough fixed builder stage space so footer never overlaps.
  const mobileHeroHeight = 355;
  const mobileSectionY = mobileHeroHeight + 22;
  const mobileFeedY = 183;
  const mobileFeedHeight = 5800;
  const mobileSectionHeight = mobileFeedY + mobileFeedHeight + 48;
  setMobileRect(root, { x: 0, y: 0, width: 375, height: mobileSectionY + mobileSectionHeight });
  setMobileRect(hero, { x: 0, y: 0, width: 375, height: mobileHeroHeight });
  setMobileRect(section, { x: 0, y: mobileSectionY, width: 375, height: mobileSectionHeight });
  setMobileRect(title, { x: 22.5, y: 40, width: 330, height: 51 });
  setMobileRect(copy, { x: 22.5, y: 113, width: 330, height: 48 });
  setMobileRect(feed, { x: 22.5, y: mobileFeedY, width: 330, height: mobileFeedHeight });

  // Tablet: 2-column archive grid still needs a real stage height, not responsivize's tiny 60px feed.
  const tabletHeroHeight = 355;
  const tabletSectionY = tabletHeroHeight + 28;
  const tabletFeedY = 171;
  const tabletFeedHeight = 3000;
  const tabletSectionHeight = tabletFeedY + tabletFeedHeight + 56;
  setTabletRect(root, { x: 0, y: 0, width: 768, height: tabletSectionY + tabletSectionHeight });
  setTabletRect(hero, { x: 0, y: 0, width: 768, height: tabletHeroHeight });
  setTabletRect(section, { x: 0, y: tabletSectionY, width: 768, height: tabletSectionHeight });
  setTabletRect(title, { x: 24, y: 40, width: 720, height: 51 });
  setTabletRect(copy, { x: 24, y: 113, width: 720, height: 48 });
  setTabletRect(feed, { x: 24, y: tabletFeedY, width: 720, height: tabletFeedHeight });
}

function repairReviewsMobileLayout(nodesById: Map<string, BuilderCanvasNode>): void {
  const headerRoot = nodesById.get('page-reviews-page-header-root');
  const headerContainer = nodesById.get('page-reviews-page-header-container');
  const breadcrumb = nodesById.get('page-reviews-breadcrumb');
  const breadcrumbHome = nodesById.get('page-reviews-breadcrumb-home');
  const breadcrumbSlash = nodesById.get('page-reviews-breadcrumb-slash');
  const breadcrumbCurrent = nodesById.get('page-reviews-breadcrumb-current');
  const headerLabel = nodesById.get('page-reviews-page-header-label');
  const headerTitle = nodesById.get('page-reviews-page-header-title');
  const headerDescription = nodesById.get('page-reviews-page-header-description');
  const headerDivider = nodesById.get('page-reviews-page-header-divider');
  const headerOrnament = nodesById.get('page-reviews-page-header-divider-ornament');

  if (headerRoot && headerContainer) {
    setMobileRect(headerRoot, { x: 0, y: 0, width: 375, height: 420 });
    setMobileRect(headerContainer, { x: 0, y: 20, width: 343, height: 380 });
    setMobileRect(breadcrumb, { x: 22.5, y: 46, width: 298, height: 24 });
    setMobileRect(breadcrumbHome, { x: 0, y: 0, width: 24, height: 24 });
    setMobileRect(breadcrumbSlash, { x: 36, y: 0, width: 10, height: 24 });
    setMobileRect(breadcrumbCurrent, { x: 58, y: 0, width: 110, height: 24 });
    setMobileRect(headerLabel, { x: 22.5, y: 112, width: 298, height: 24 });
    setMobileRect(headerTitle, { x: 22.5, y: 152, width: 298, height: 58 });
    setMobileFontSize(headerTitle, 40);
    setMobileRect(headerDescription, { x: 22.5, y: 232, width: 298, height: 60 });
    setMobileFontSize(headerDescription, 16);
    setMobileRect(headerDivider, { x: 22.5, y: 318, width: 298, height: 24 });
    setMobileRect(headerOrnament, { x: 0, y: 6, width: 120, height: 12 });
  }

  const sectionRoot = nodesById.get('page-reviews-section-root');
  const sectionContainer = nodesById.get('page-reviews-section-container');
  const formWrap = nodesById.get('page-reviews-form-wrap');
  const formTitle = nodesById.get('page-reviews-form-title');
  const note = nodesById.get('page-reviews-note');
  const form = nodesById.get('page-reviews-form');
  const listTitle = nodesById.get('page-reviews-list-title');
  const empty = nodesById.get('page-reviews-empty');
  if (!sectionRoot || !sectionContainer || !formWrap || !form) return;

  const formWidth = 330;
  const fieldWidth = 290;
  const noteHeight = estimateTextHeight(getNodeText(note), fieldWidth, 14, 1.55);
  const titleHeight = 32;
  const formY = 20 + titleHeight + 16 + noteHeight + 24;
  const rowGap = 16;
  const row0Y = 0;
  const row0Height = 82;
  const row1Y = row0Y + row0Height + rowGap;
  const row1Height = 70;
  const row2Y = row1Y + row1Height + rowGap;
  const row2Height = 82;
  const row3Y = row2Y + row2Height + rowGap;
  const row3Height = 132;
  const submitY = row3Y + row3Height + 18;
  const submitHeight = 44;
  const formHeight = submitY + submitHeight;
  const formWrapHeight = formY + formHeight + 24;
  const listTitleY = 20 + formWrapHeight + 48;
  const listTitleHeight = 36;
  const emptyHeight = estimateTextHeight(getNodeText(empty), fieldWidth, 15, 1.6);
  const containerHeight = listTitleY + listTitleHeight + 18 + emptyHeight + 32;
  const rootHeight = 40 + containerHeight + 40;

  setMobileRect(sectionRoot, { x: 0, y: 442, width: 375, height: rootHeight });
  setMobileRect(sectionContainer, { x: 0, y: 40, width: 343, height: containerHeight });
  setMobileRect(formWrap, { x: 22.5, y: 20, width: formWidth, height: formWrapHeight });
  setMobileRect(formTitle, { x: 20, y: 20, width: fieldWidth, height: titleHeight });
  setMobileFontSize(formTitle, 22);
  setMobileRect(note, { x: 20, y: 68, width: fieldWidth, height: noteHeight });
  setMobileFontSize(note, 14);
  setMobileRect(form, { x: 20, y: formY, width: fieldWidth, height: formHeight });

  setMobileReviewRow(nodesById, 0, row0Y, row0Height, fieldWidth, 48);
  setMobileReviewRow(nodesById, 1, row1Y, row1Height, fieldWidth, 36);
  setMobileReviewRow(nodesById, 2, row2Y, row2Height, fieldWidth, 48);
  setMobileReviewRow(nodesById, 3, row3Y, row3Height, fieldWidth, 96);

  const rating = nodesById.get('page-reviews-row-1-rating');
  setMobileRect(rating, { x: 0, y: 32, width: 170, height: 36 });
  for (let index = 0; index < 5; index += 1) {
    const star = nodesById.get(`page-reviews-row-1-rating-star-${index}`);
    setMobileRect(star, { x: index * 34, y: 0, width: 28, height: 28 });
    setMobileFontSize(star, 24);
  }

  setMobileRect(nodesById.get('page-reviews-submit'), { x: 0, y: submitY, width: 180, height: submitHeight });
  setMobileRect(listTitle, { x: 22.5, y: listTitleY, width: fieldWidth, height: listTitleHeight });
  setMobileFontSize(listTitle, 24);
  setMobileRect(empty, { x: 22.5, y: listTitleY + listTitleHeight + 18, width: fieldWidth, height: emptyHeight });
  setMobileFontSize(empty, 15);
}

function setMobileReviewRow(
  nodesById: Map<string, BuilderCanvasNode>,
  index: number,
  y: number,
  height: number,
  width: number,
  inputHeight: number,
): void {
  const rowId = `page-reviews-row-${index}`;
  setMobileRect(nodesById.get(rowId), { x: 0, y, width, height });
  setMobileRect(nodesById.get(`${rowId}-label`), { x: 0, y: 0, width, height: 22 });
  setMobileFontSize(nodesById.get(`${rowId}-label`), 14);

  if (index === 1) return;

  setMobileRect(nodesById.get(`${rowId}-input`), { x: 0, y: 32, width, height: inputHeight });
  setMobileRect(nodesById.get(`${rowId}-placeholder`), {
    x: 16,
    y: index === 3 ? 14 : 13,
    width: Math.max(1, width - 32),
    height: index === 3 ? Math.max(20, inputHeight - 20) : 22,
  });
  setMobileFontSize(nodesById.get(`${rowId}-placeholder`), 14);
}

function repairReviewsTabletLayout(nodesById: Map<string, BuilderCanvasNode>): void {
  const sectionRoot = nodesById.get('page-reviews-section-root');
  const sectionContainer = nodesById.get('page-reviews-section-container');
  const formWrap = nodesById.get('page-reviews-form-wrap');
  const form = nodesById.get('page-reviews-form');
  if (!sectionRoot || !sectionContainer || !formWrap || !form) return;

  const formWrapHeight = 620;
  const listTitleY = formWrapHeight + 64;
  const listTitleHeight = 42;
  const emptyHeight = estimateTextHeight(getNodeText(nodesById.get('page-reviews-empty')), 560, 16, 1.6);
  const containerHeight = listTitleY + listTitleHeight + 20 + emptyHeight + 40;

  setTabletRect(sectionRoot, { x: 0, width: 768, height: 72 + containerHeight + 72 });
  setTabletRect(sectionContainer, { x: 32, y: 72, width: 704, height: containerHeight });
  setTabletRect(formWrap, { x: 0, y: 0, width: 560, height: formWrapHeight });
  setTabletRect(form, { x: 0, y: 120, width: 560, height: 476 });
  setTabletRect(nodesById.get('page-reviews-row-0'), { x: 0, y: 0, width: 560, height: 82 });
  setTabletRect(nodesById.get('page-reviews-row-1'), { x: 0, y: 98, width: 560, height: 70 });
  setTabletRect(nodesById.get('page-reviews-row-1-rating'), { x: 0, y: 34, width: 180, height: 36 });
  for (let index = 0; index < 5; index += 1) {
    setTabletRect(nodesById.get(`page-reviews-row-1-rating-star-${index}`), { x: index * 34, y: 0, width: 28, height: 28 });
  }
  setTabletRect(nodesById.get('page-reviews-row-2'), { x: 0, y: 184, width: 560, height: 82 });
  setTabletRect(nodesById.get('page-reviews-row-3'), { x: 0, y: 282, width: 560, height: 132 });
  setTabletRect(nodesById.get('page-reviews-submit'), { x: 0, y: 432, width: 180, height: 44 });
  setTabletRect(nodesById.get('page-reviews-list-title'), { x: 0, y: listTitleY, width: 560, height: listTitleHeight });
  setTabletRect(nodesById.get('page-reviews-empty'), { x: 0, y: listTitleY + listTitleHeight + 20, width: 560, height: emptyHeight });
}

function repairReviewsDecomposedResponsiveLayout(nodesById: Map<string, BuilderCanvasNode>): void {
  if (!nodesById.has('page-reviews-form-wrap')) return;
  repairReviewsMobileLayout(nodesById);
  repairReviewsTabletLayout(nodesById);
}

function repairLegacyCompositeResponsiveLayout(nodesById: Map<string, BuilderCanvasNode>): void {
  const composite = [...nodesById.values()].find(isLegacyPageCompositeNode);
  if (!composite) return;
  const geometry = LEGACY_COMPOSITE_GEOMETRY[composite.content.componentKey as LegacyCompositeKey];
  if (!geometry) return;
  const root = composite.parentId ? nodesById.get(composite.parentId) : null;
  if (!root) return;

  setMobileRect(root, { x: 0, y: 0, width: 375, height: geometry.mobile });
  setMobileRect(composite, { x: 0, y: 0, width: 375, height: geometry.mobile });
  setTabletRect(root, { x: 0, y: 0, width: 768, height: geometry.tablet });
  setTabletRect(composite, { x: 0, y: 0, width: 768, height: geometry.tablet });
}

// Inter-section gap (px) between top-level flow sections on mobile / tablet.
// Matches the home convention: createHomePageCanvasDocumentDecomposed runs the
// same responsivize() and (being unrepaired) stacks its top-level sections with
// exactly this spacing — verified by measuring its mobile/tablet section gaps
// (22 / 28). These are also responsivize's own per-viewport VIEWPORTS GAP values.
const RESPONSIVE_SECTION_GAP: Record<ResponsiveViewport, number> = {
  mobile: 0,
  tablet: 28,
};

/**
 * Re-stack the top-level flow sections for mobile + tablet so each section sits
 * flush below the previous one (previous bottom + RESPONSIVE_SECTION_GAP).
 *
 * WHY: responsivize() authors each section's mobile/tablet `y` by accumulating a
 * FRESH per-section height ESTIMATE. The page-specific repair* passes above then
 * overwrite only the section HEIGHTS (e.g. repairAttorneyMobileLayout) — never
 * the following sections' `y`. That leaves responsivize's stale, over-estimated
 * `y` on later sections, so the published document-flow stack
 * (computeFlowSiblingMetrics: marginTop = max(0, rect.y - prevBottom)) renders a
 * phantom gap above them (e.g. ~1093px above the About page's contact section on
 * mobile, ~92px on tablet).
 *
 * FIX: after every repair* pass, walk the top-level flow sections in their
 * current per-viewport `y` order and rewrite each subsequent section's `y` to
 * prevSection.y + prevSection.height + gap. Only the responsive `y` is touched —
 * each section's height/x/width and the desktop rect are left unchanged, so
 * already-continuous pages (services, contact, lawyers, faq, pricing, reviews,
 * privacy, disclaimer, columns) are a no-op and only the drifted ones (About)
 * are pulled back flush.
 */
function restackTopLevelFlowSectionsResponsive(nodes: BuilderCanvasNode[]): void {
  const sections = nodes.filter(isTopLevelFlowSection);
  if (sections.length < 2) return;

  for (const viewport of ['mobile', 'tablet'] as const) {
    const ordered = sections
      .map((node) => {
        const rect = getResponsiveRect(node, viewport);
        return {
          node,
          y: rect?.y ?? node.rect.y,
          height: rect?.height ?? node.rect.height,
        };
      })
      .sort((left, right) => left.y - right.y);

    // First section keeps its authored y; every later section stacks flush below.
    let previousBottom = ordered[0].y + ordered[0].height;
    for (let index = 1; index < ordered.length; index += 1) {
      const entry = ordered[index];
      const y = previousBottom + RESPONSIVE_SECTION_GAP[viewport];
      setResponsiveRect(entry.node, viewport, { y });
      previousBottom = y + entry.height;
    }
  }
}

function createDecomposedPageCanvasDocument(
  locale: Locale,
  nodes: BuilderCanvasNode[],
  height: number,
): BuilderCanvasDocument {
  responsivize(nodes);
  repairPageHeaderMobileLayout(nodes);
  repairAttorneyMobileLayout(nodes);
  repairAttorneyTabletLayout(nodes);
  repairPricingResponsiveLayout(nodes);
  const nodesById = new Map(nodes.map((node) => [node.id, node]));
  repairServicesResponsiveLayout(nodesById);
  repairColumnsResponsiveLayout(nodesById);
  repairReviewsDecomposedResponsiveLayout(nodesById);
  repairLegacyCompositeResponsiveLayout(nodesById);
  restackTopLevelFlowSectionsResponsive(nodes);
  return {
    version: 1,
    locale,
    updatedAt: new Date().toISOString(),
    updatedBy: SITE_PAGE_SEED_VERSION,
    stageWidth: STAGE_WIDTH,
    stageHeight: height,
    nodes,
  };
}

function isLegacyPageCompositeNode(node: BuilderCanvasNode): node is BuilderCompositeCanvasNode {
  return node.kind === 'composite' && node.content.componentKey.startsWith(LEGACY_PAGE_COMPOSITE_PREFIX);
}

function hasLegacyPageComposite(document: BuilderCanvasDocument | null): boolean {
  return Boolean(document?.nodes.some(isLegacyPageCompositeNode));
}

function hasStandardServicesDecomposedDocument(document: BuilderCanvasDocument | null): boolean {
  return Boolean(document?.nodes.some((node) => node.id === 'page-services-page-header-root'))
    && Boolean(document?.nodes.some((node) => node.id === 'home-services-root'));
}

function hasStandardContactDecomposedDocument(document: BuilderCanvasDocument | null): boolean {
  return Boolean(document?.nodes.some((node) => node.id === 'page-contact-page-header-root'))
    && Boolean(document?.nodes.some((node) => node.id === 'page-contact-inquiries-grid'))
    && Boolean(document?.nodes.some((node) => node.id === 'home-offices-root'));
}

function getNodeClassName(node: BuilderCanvasNode): string {
  return 'className' in node.content && typeof node.content.className === 'string'
    ? node.content.className
    : '';
}

export function isLegacyReviewLayoutClassName(className: string): boolean {
  return LEGACY_REVIEW_LAYOUT_CLASSES.has(className);
}

function hasCurrentReviewsDecomposedGeometry(document: BuilderCanvasDocument | null): boolean {
  if (!document || document.stageHeight !== REVIEWS_PAGE_ROOT_HEIGHT) return false;

  const nodesById = new Map(document.nodes.map((node) => [node.id, node]));
  const sectionRoot = nodesById.get('page-reviews-section-root');
  const formWrap = nodesById.get('page-reviews-form-wrap');
  const listTitle = nodesById.get('page-reviews-list-title');
  const empty = nodesById.get('page-reviews-empty');

  return sectionRoot?.rect.y === 428
    && sectionRoot.rect.height === 1282
    && formWrap?.rect.x === 269
    && formWrap.rect.width === 640
    && formWrap.rect.height === 759
    && listTitle?.rect.y === 816
    && empty?.rect.y === 864;
}

function hasLegacyReviewClassCollision(document: BuilderCanvasDocument | null): boolean {
  if (hasCurrentReviewsDecomposedGeometry(document)) return false;

  return Boolean(document?.nodes.some((node) => (
    node.id.startsWith('page-reviews-') &&
    isLegacyReviewLayoutClassName(getNodeClassName(node))
  )));
}

function applyZhHantContactDesktopBaseline(document: BuilderCanvasDocument): BuilderCanvasDocument {
  const nodesById = new Map(document.nodes.map((node) => [node.id, node]));
  document.stageHeight = ZH_HANT_CONTACT_PAGE_ROOT_HEIGHT;

  setDesktopRect(nodesById, 'page-contact-guide-root', { y: 428, height: 602 });
  setDesktopRect(nodesById, 'page-contact-guide-container', { x: 51, y: 88, width: 1178, height: 426 });
  setDesktopRect(nodesById, 'page-contact-guide-label', { y: 0, height: 32 });
  setDesktopRect(nodesById, 'page-contact-guide-title', { y: 42, width: 760, height: 46 });
  setDesktopRect(nodesById, 'page-contact-guide-description', { y: 106, width: 760, height: 34 });
  setDesktopRect(nodesById, 'page-contact-guide-divider', { y: 158, height: 32 });
  setDesktopRect(nodesById, 'page-contact-guide-divider-ornament', { x: 529, y: 6, width: 120, height: 12 });
  setDesktopRect(nodesById, 'page-contact-guide-grid', { y: 214, height: 212 });
  setDesktopContainerAbsoluteLayout(nodesById, 'page-contact-guide-grid');
  for (let index = 0; index < 3; index += 1) {
    setDesktopRect(nodesById, `page-contact-guide-card-${index}`, {
      x: index * 400,
      y: 0,
      width: 376,
      height: 212,
    });
    setDesktopRect(nodesById, `page-contact-guide-card-${index}-title`, { width: 328 });
    setDesktopRect(nodesById, `page-contact-card-${index}-list`, { width: 328 });
  }

  setDesktopRect(nodesById, 'page-contact-contact-root', { y: 1030, height: 964 });
  setDesktopRect(nodesById, 'page-contact-contact-container', { x: 51, y: 88, width: 1178, height: 788 });
  setDesktopRect(nodesById, 'page-contact-inquiries-label', { y: 0, height: 32 });
  setDesktopRect(nodesById, 'page-contact-inquiries-grid', { y: 44, height: 366 });
  setDesktopContainerAbsoluteLayout(nodesById, 'page-contact-inquiries-grid');
  for (let index = 0; index < 4; index += 1) {
    const isSecondRow = index === 3;
    setDesktopRect(nodesById, `page-contact-inquiries-card-${index}`, {
      x: isSecondRow ? 0 : index * 400,
      y: isSecondRow ? 230 : 0,
      width: 376,
      height: isSecondRow ? 136 : 171,
    });
    setDesktopRect(nodesById, `page-contact-inquiries-card-${index}-title`, { width: 328 });
    setDesktopRect(nodesById, `page-contact-inquiries-block-${index}-list`, { width: 328 });
    for (let itemIndex = 0; itemIndex < 3; itemIndex += 1) {
      setDesktopRect(nodesById, `page-contact-inquiries-block-${index}-item-${itemIndex}`, { width: 328 });
    }
  }
  setDesktopRect(nodesById, 'page-contact-locations-label', { y: 454, height: 32 });
  setDesktopRect(nodesById, 'page-contact-locations-grid', { y: 498, height: 206 });
  setDesktopContainerAbsoluteLayout(nodesById, 'page-contact-locations-grid');
  for (let index = 0; index < 3; index += 1) {
    setDesktopRect(nodesById, `page-contact-locations-card-${index}`, {
      x: index * 400,
      y: 0,
      width: 376,
      height: 206,
    });
    setDesktopRect(nodesById, `page-contact-locations-card-${index}-title`, { width: 328 });
    setDesktopRect(nodesById, `page-contact-locations-block-${index}-list`, { width: 328 });
    for (let itemIndex = 0; itemIndex < 3; itemIndex += 1) {
      setDesktopRect(nodesById, `page-contact-locations-block-${index}-item-${itemIndex}`, { width: 328 });
    }
  }
  setDesktopRect(nodesById, 'page-contact-contact-cta', { y: 744, width: 180, height: 44 });

  setDesktopRect(nodesById, 'home-offices-root', { y: 1994, height: 760 });
  setDesktopRect(nodesById, 'home-offices-container', { x: 72, y: 88, width: 1136, height: 600 });
  setDesktopRect(nodesById, 'home-offices-label', { y: 0, height: 32 });
  setDesktopRect(nodesById, 'home-offices-title', { y: 40, width: 520, height: 56 });
  setDesktopRect(nodesById, 'home-offices-tabs', { y: 116, width: 560, height: 36 });
  for (let index = 0; index < 3; index += 1) {
    setDesktopRect(nodesById, `home-offices-tab-${index}`, {
      x: index * 120,
      y: 0,
      width: 104,
      height: 32,
    });
    setDesktopRect(nodesById, `home-offices-layout-${index}`, {
      y: 184,
      width: 1136,
      height: 420,
    });
    setDesktopRect(nodesById, `home-offices-layout-${index}-map`, {
      width: 660,
      height: 420,
    });
    setDesktopRect(nodesById, `home-offices-layout-${index}-card`, {
      x: 700,
      y: 0,
      width: 436,
      height: 420,
    });
  }

  return document;
}

function applyZhHantReviewsDesktopBaseline(document: BuilderCanvasDocument): BuilderCanvasDocument {
  const nodesById = new Map(document.nodes.map((node) => [node.id, node]));
  document.stageHeight = ZH_HANT_REVIEWS_PAGE_ROOT_HEIGHT;
  setDesktopRect(nodesById, 'page-reviews-section-root', { y: 472 });
  return document;
}

export function buildLegacyCompositePageCanvas(
  locale: Locale,
  componentKey: LegacyCompositeKey,
  height: number,
  rootId: string,
): BuilderCanvasDocument {
  const nodes: BuilderCanvasNode[] = [
    createHomeContainerNode({
      id: rootId,
      rect: { x: 0, y: 0, width: STAGE_WIDTH, height },
      zIndex: 0,
      label: `${componentKey} page root`,
      as: 'main',
      background: '#ffffff',
      borderColor: 'transparent',
    }),
    {
      id: `${rootId}-composite`,
      kind: 'composite',
      parentId: rootId,
      rect: { x: 0, y: 0, width: STAGE_WIDTH, height },
      style: createDefaultCanvasNodeStyle({ borderRadius: 0 }),
      zIndex: 1,
      rotation: 0,
      locked: false,
      visible: true,
      content: { componentKey, config: { locale } },
    } as BuilderCanvasNode,
  ];
  return createDecomposedPageCanvasDocument(locale, nodes, height);
}

function buildMeasuredLegacyCompositePageCanvas(
  locale: Locale,
  componentKey: LegacyCompositeKey,
): BuilderCanvasDocument {
  const geometry = LEGACY_COMPOSITE_GEOMETRY[componentKey];
  if (!geometry) {
    throw new Error(`Missing legacy composite geometry for ${componentKey}.`);
  }
  return buildLegacyCompositePageCanvas(locale, componentKey, geometry.desktop, geometry.rootId);
}

function buildAboutCompositePageCanvas(locale: Locale): BuilderCanvasDocument {
  return buildMeasuredLegacyCompositePageCanvas(locale, 'legacy-page-about');
}

function buildAboutPageCanvas(locale: Locale): BuilderCanvasDocument {
  return createDecomposedPageCanvasDocument(locale, createAboutPageDecomposedNodes(0, locale, 0), getAboutPageRootHeight(locale));
}

function buildServicesCompositePageCanvas(locale: Locale): BuilderCanvasDocument {
  return buildMeasuredLegacyCompositePageCanvas(locale, 'legacy-page-services');
}

function buildServicesPageCanvas(locale: Locale): BuilderCanvasDocument {
  return createDecomposedPageCanvasDocument(locale, createServicesPageDecomposedNodes(0, locale, 0), getServicesPageRootHeight(locale));
}

function buildContactCompositePageCanvas(locale: Locale): BuilderCanvasDocument {
  return buildMeasuredLegacyCompositePageCanvas(locale, 'legacy-page-contact');
}

function buildContactPageCanvas(locale: Locale): BuilderCanvasDocument {
  const document = createDecomposedPageCanvasDocument(
    locale,
    createContactPageDecomposedNodes(0, locale, 0),
    CONTACT_PAGE_ROOT_HEIGHT,
  );
  return locale === 'zh-hant' ? applyZhHantContactDesktopBaseline(document) : document;
}

function buildLawyersCompositePageCanvas(locale: Locale): BuilderCanvasDocument {
  return buildMeasuredLegacyCompositePageCanvas(locale, 'legacy-page-lawyers');
}

function buildLawyersPageCanvas(locale: Locale): BuilderCanvasDocument {
  return createDecomposedPageCanvasDocument(locale, createLawyersPageDecomposedNodes(0, locale, 0), getLawyersPageRootHeight(locale));
}

export function buildFaqCompositePageCanvas(locale: Locale): BuilderCanvasDocument {
  return buildMeasuredLegacyCompositePageCanvas(locale, 'legacy-page-faq');
}

function buildFaqPageCanvas(locale: Locale): BuilderCanvasDocument {
  return createDecomposedPageCanvasDocument(locale, createFaqPageDecomposedNodes(0, locale, 0), getFaqPageRootHeight(locale));
}

function buildPricingCompositePageCanvas(locale: Locale): BuilderCanvasDocument {
  return buildMeasuredLegacyCompositePageCanvas(locale, 'legacy-page-pricing');
}

function buildPricingPageCanvas(locale: Locale): BuilderCanvasDocument {
  return createDecomposedPageCanvasDocument(locale, createPricingPageDecomposedNodes(0, locale, 0), getPricingPageRootHeight(locale));
}

function buildReviewsPageCanvas(locale: Locale): BuilderCanvasDocument {
  const document = createDecomposedPageCanvasDocument(
    locale,
    createReviewsPageDecomposedNodes(0, locale, 0),
    REVIEWS_PAGE_ROOT_HEIGHT,
  );
  return locale === 'zh-hant' ? applyZhHantReviewsDesktopBaseline(document) : document;
}

export function buildReviewsCompositePageCanvas(locale: Locale): BuilderCanvasDocument {
  return buildMeasuredLegacyCompositePageCanvas(locale, 'legacy-page-reviews');
}

export function buildVideosCompositePageCanvas(locale: Locale): BuilderCanvasDocument {
  return buildMeasuredLegacyCompositePageCanvas(locale, 'legacy-page-videos');
}

function buildPrivacyPageCanvas(locale: Locale): BuilderCanvasDocument {
  return createDecomposedPageCanvasDocument(locale, createPrivacyPageDecomposedNodes(0, locale, 0), getPrivacyPageRootHeight(locale));
}

function buildDisclaimerPageCanvas(locale: Locale): BuilderCanvasDocument {
  return createDecomposedPageCanvasDocument(locale, createDisclaimerPageDecomposedNodes(0, locale, 0), getDisclaimerPageRootHeight(locale));
}

export function buildColumnsPageCanvas(locale: Locale): BuilderCanvasDocument {
  const doc = buildLegacyCompositePageCanvas(locale, 'legacy-page-columns', COLUMNS_PAGE_ROOT_HEIGHT, 'columns-page-root');
  for (const node of doc.nodes) {
    if (node.id === 'columns-page-root' || node.id === 'columns-page-root-composite') {
      delete node.responsive;
    }
  }
  return doc;
}

/**
 * Granular, editable decomposed builders for the standard pages. The
 * decompose-to-edit route resolves through this map; services also uses its
 * decomposed builder as the canonical draft while its published seed remains
 * the live legacy composite.
 */
export const STANDARD_PAGE_DECOMPOSERS: Record<string, (locale: Locale) => BuilderCanvasDocument> = {
  // Home (slug '') decomposes to its editable section layout; the others to
  // their legacy-content node trees.
  '': createHomePageCanvasDocumentDecomposed,
  about: buildAboutPageCanvas,
  services: buildServicesPageCanvas,
  contact: buildContactPageCanvas,
  lawyers: buildLawyersPageCanvas,
  faq: buildFaqPageCanvas,
  pricing: buildPricingPageCanvas,
  reviews: buildReviewsPageCanvas,
  privacy: buildPrivacyPageCanvas,
  disclaimer: buildDisclaimerPageCanvas,
};

const pageSeeds: PageSeedDefinition[] = [
  {
    slug: '',
    isHomePage: true,
    titles: { ko: '홈', 'zh-hant': '首頁', en: 'Home' },
    buildDocument: createHomePageCanvasDocument,
  },
  {
    slug: 'about',
    expectsLegacyComposite: true,
    titles: {
      ko: pageCopy.ko.about.title,
      'zh-hant': pageCopy['zh-hant'].about.title,
      en: pageCopy.en.about.title,
    },
    buildDocument: buildAboutCompositePageCanvas,
  },
  {
    slug: 'services',
    expectsLegacyComposite: true,
    titles: {
      ko: pageCopy.ko.services.title,
      'zh-hant': pageCopy['zh-hant'].services.title,
      en: pageCopy.en.services.title,
    },
    buildDocument: buildServicesCompositePageCanvas,
    buildDraftDocument: buildServicesPageCanvas,
    hasDraftDocumentShape: hasStandardServicesDecomposedDocument,
  },
  {
    slug: 'contact',
    expectsLegacyComposite: true,
    titles: {
      ko: pageCopy.ko.contact.title,
      'zh-hant': pageCopy['zh-hant'].contact.title,
      en: pageCopy.en.contact.title,
    },
    buildDocument: buildContactCompositePageCanvas,
    buildDraftDocument: buildContactPageCanvas,
    hasDraftDocumentShape: hasStandardContactDecomposedDocument,
  },
  {
    slug: 'lawyers',
    expectsLegacyComposite: true,
    titles: {
      ko: pageCopy.ko.lawyers.title,
      'zh-hant': pageCopy['zh-hant'].lawyers.title,
      en: pageCopy.en.lawyers.title,
    },
    buildDocument: buildLawyersCompositePageCanvas,
  },
  {
    slug: 'faq',
    expectsLegacyComposite: true,
    titles: {
      ko: pageCopy.ko.faq.title,
      'zh-hant': pageCopy['zh-hant'].faq.title,
      en: pageCopy.en.faq.title,
    },
    buildDocument: buildFaqCompositePageCanvas,
  },
  {
    slug: 'pricing',
    includeInNavigation: false,
    expectsLegacyComposite: true,
    titles: {
      ko: pageCopy.ko.pricing.title,
      'zh-hant': pageCopy['zh-hant'].pricing.title,
      en: pageCopy.en.pricing.title,
    },
    buildDocument: buildPricingCompositePageCanvas,
  },
  {
    slug: 'reviews',
    includeInNavigation: false,
    expectsLegacyComposite: true,
    titles: {
      ko: pageCopy.ko.reviews.title,
      'zh-hant': pageCopy['zh-hant'].reviews.title,
      en: pageCopy.en.reviews.title,
    },
    buildDocument: buildReviewsCompositePageCanvas,
  },
  {
    slug: 'columns',
    expectsLegacyComposite: true,
    titles: {
      ko: pageCopy.ko.insights.title,
      'zh-hant': pageCopy['zh-hant'].insights.title,
      en: pageCopy.en.insights.title,
    },
    buildDocument: buildColumnsPageCanvas,
  },
  {
    slug: 'videos',
    expectsLegacyComposite: true,
    titles: {
      ko: pageCopy.ko.videos.title,
      'zh-hant': pageCopy['zh-hant'].videos.title,
      en: pageCopy.en.videos.title,
    },
    buildDocument: buildVideosCompositePageCanvas,
  },
  {
    slug: 'privacy',
    includeInNavigation: false,
    titles: {
      ko: legalPageContent.ko.privacy.title,
      'zh-hant': legalPageContent['zh-hant'].privacy.title,
      en: legalPageContent.en.privacy.title,
    },
    buildDocument: buildPrivacyPageCanvas,
  },
  {
    slug: 'disclaimer',
    includeInNavigation: false,
    titles: {
      ko: legalPageContent.ko.disclaimer.title,
      'zh-hant': legalPageContent['zh-hant'].disclaimer.title,
      en: legalPageContent.en.disclaimer.title,
    },
    buildDocument: buildDisclaimerPageCanvas,
  },
];

export const STANDARD_PAGE_SEED_SLUGS = pageSeeds.map((seed) => seed.slug);

const extraNavigationItems: Array<{
  id: string;
  pageId: string;
  href: string;
  label: Record<Locale, string>;
}> = [];

function findSeedPage(site: BuilderSiteDocument, locale: Locale, seed: PageSeedDefinition): BuilderPageMeta | undefined {
  const candidates = site.pages.filter((page) => matchesStandardPageSlugForLocale(page, locale, seed.slug));

  return [...candidates].sort((left, right) => {
    const publishedDelta = Number(Boolean(right.publishedAt)) - Number(Boolean(left.publishedAt));
    if (publishedDelta !== 0) return publishedDelta;

    return (right.updatedAt || right.createdAt).localeCompare(left.updatedAt || left.createdAt);
  })[0];
}

async function removeDuplicateSeedPages(
  siteId: string,
  locale: Locale,
  seed: PageSeedDefinition,
  preferredPageId: string,
) {
  const site = await readSiteDocument(siteId, locale);
  const duplicateIds = site.pages
    .filter((page) => {
      if (page.pageId === preferredPageId) return false;
      return matchesStandardPageSlugForLocale(page, locale, seed.slug);
    })
    .map((page) => page.pageId);

  if (duplicateIds.length === 0) return;

  site.pages = site.pages.filter((page) => !duplicateIds.includes(page.pageId));
  site.navigation = site.navigation.filter((item) => !duplicateIds.includes(item.pageId));
  site.updatedAt = new Date().toISOString();
  await writeSiteDocument(site, { preserveMissingPages: false, preserveMissingNavigation: false });
}

async function persistSeededPage(
  siteId: string,
  locale: Locale,
  target: BuilderPageMeta,
  seed: PageSeedDefinition,
) {
  target.slug = seed.slug;
  target.isHomePage = seed.isHomePage || false;
  target.title = seed.titles;
  target.locale = locale;
  target.documentKind = 'canvas-scene-vnext';
  target.lifecycle = {
    activeDocumentFamily: 'canvas-sandbox-v1',
    publishBackend: 'builder-snapshot',
    sceneStatus: 'seeded',
  };
  target.updatedAt = new Date().toISOString();

  const site = await readSiteDocument(siteId, locale);
  const siteTarget = site.pages.find((page) => page.pageId === target.pageId);
  if (!siteTarget) return;

  siteTarget.slug = target.slug;
  siteTarget.isHomePage = target.isHomePage;
  siteTarget.title = target.title;
  siteTarget.locale = target.locale;
  siteTarget.documentKind = target.documentKind;
  siteTarget.lifecycle = target.lifecycle;
  siteTarget.updatedAt = target.updatedAt;
  site.updatedAt = new Date().toISOString();
  await writeSiteDocument(site);

  const document = seed.buildDocument(locale);
  await writePageCanvas(siteId, siteTarget.pageId, 'draft', document, {
    updatedBy: SEED_DRAFT_UPDATED_BY,
  });
  await publishPage(siteId, siteTarget.pageId, locale);

  const draftDocument = seed.buildDraftDocument?.(locale);
  if (draftDocument) {
    await writePageCanvas(siteId, siteTarget.pageId, 'draft', draftDocument, {
      updatedBy: SEED_DRAFT_UPDATED_BY,
    });
  }
}

async function seedExistingHomeIfNeeded(
  siteId: string,
  locale: Locale,
  page: BuilderPageMeta,
  seed: PageSeedDefinition,
) {
  const [draft, published] = await Promise.all([
    readPageCanvas(siteId, page.pageId, 'draft'),
    readPageCanvas(siteId, page.pageId, 'published'),
  ]);
  const hasContent = Boolean((draft?.nodes?.length ?? 0) > 0 || (published?.nodes?.length ?? 0) > 0 || page.publishedAt);
  if (hasContent) return;

  await persistSeededPage(siteId, locale, page, seed);
}

async function seedExistingPageIfNeeded(
  siteId: string,
  locale: Locale,
  page: BuilderPageMeta,
  seed: PageSeedDefinition,
) {
  const [draft, published] = await Promise.all([
    readPageCanvas(siteId, page.pageId, 'draft'),
    readPageCanvas(siteId, page.pageId, 'published'),
  ]);

  const draftVersion = draft?.updatedBy;
  const publishedVersion = published?.updatedBy;
  const expectsLegacyComposite = seed.expectsLegacyComposite === true;
  const hasExpectedDraftShape = seed.hasDraftDocumentShape
    ? seed.hasDraftDocumentShape(draft)
    : !expectsLegacyComposite || hasLegacyPageComposite(draft);
  const hasExpectedPublishedShape = !expectsLegacyComposite || hasLegacyPageComposite(published);
  const needsReseed =
    !page.publishedAt ||
    !draft ||
    !published ||
    (draft.nodes?.length ?? 0) === 0 ||
    (published.nodes?.length ?? 0) === 0 ||
    !hasExpectedDraftShape ||
    !hasExpectedPublishedShape ||
    hasLegacyReviewClassCollision(draft) ||
    hasLegacyReviewClassCollision(published) ||
    draftVersion !== SITE_PAGE_SEED_VERSION ||
    publishedVersion !== SITE_PAGE_SEED_VERSION;

  if (!needsReseed) return;
  await persistSeededPage(siteId, locale, page, seed);
}

async function createAndSeedPage(siteId: string, locale: Locale, seed: PageSeedDefinition) {
  const existing = findSeedPage(await readSiteDocument(siteId, locale), locale, seed);
  if (existing) {
    if (seed.isHomePage) {
      await seedExistingHomeIfNeeded(siteId, locale, existing, seed);
    } else {
      await seedExistingPageIfNeeded(siteId, locale, existing, seed);
    }
    return;
  }

  const created = await createPage(siteId, locale, seed.slug, seed.titles[locale]);
  const site = await readSiteDocument(siteId, locale);
  const target = site.pages.find((page) => page.pageId === created.pageId);
  if (!target) return;

  await persistSeededPage(siteId, locale, target, seed);
}

async function ensureStandardNavigation(siteId: string, locale: Locale) {
  const site = await readSiteDocument(siteId, locale);
  let changed = false;

  for (const seed of pageSeeds) {
    if (seed.includeInNavigation === false) continue;

    const page = findSeedPage(site, locale, seed);
    if (!page) continue;

    const href = seed.slug ? `/${seed.slug}` : '/';
    const existing = site.navigation.find((item) => item.pageId === page.pageId || item.href === href);
    if (existing) {
      if (existing.pageId !== page.pageId || existing.href !== href) {
        existing.pageId = page.pageId;
        existing.href = href;
        existing.label = seed.titles;
        changed = true;
      }
      continue;
    }

    site.navigation.push({
      id: `nav-${page.pageId}`,
      label: seed.titles,
      pageId: page.pageId,
      href,
    });
    changed = true;
  }

  for (const item of extraNavigationItems) {
    const existing = site.navigation.find((candidate) => (
      candidate.id === item.id ||
      candidate.pageId === item.pageId ||
      candidate.href === item.href
    ));
    if (existing) continue;
    site.navigation.push(item);
    changed = true;
  }

  if (!changed) return;
  site.updatedAt = new Date().toISOString();
  await writeSiteDocument(site);
}

async function seedSitePagesInternal(siteId: string, locale: Locale): Promise<void> {
  await ensureSiteDocument(siteId, locale);

  for (const seed of pageSeeds) {
    const site = await readSiteDocument(siteId, locale);
    const existing = findSeedPage(site, locale, seed);
    if (existing) {
      if (seed.isHomePage) {
        await seedExistingHomeIfNeeded(siteId, locale, existing, seed);
      } else {
        await seedExistingPageIfNeeded(siteId, locale, existing, seed);
      }
      await removeDuplicateSeedPages(siteId, locale, seed, existing.pageId);
      continue;
    }

    await createAndSeedPage(siteId, locale, seed);

    const refreshedSite = await readSiteDocument(siteId, locale);
    const created = findSeedPage(refreshedSite, locale, seed);
    if (created) {
      await removeDuplicateSeedPages(siteId, locale, seed, created.pageId);
    }
  }

  await ensureStandardNavigation(siteId, locale);
}

export async function seedSitePages(siteId: string, locale: Locale): Promise<void> {
  const normalizedSiteId = normalizeBuilderSiteId(siteId);
  const key = `${normalizedSiteId}:${locale}`;
  const existingTask = seedSitePagesInFlight.get(key);
  if (existingTask) {
    await existingTask;
    return;
  }

  const task = seedSitePagesInternal(normalizedSiteId, locale).finally(() => {
    seedSitePagesInFlight.delete(key);
  });
  seedSitePagesInFlight.set(key, task);
  await task;
}

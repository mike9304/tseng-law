import type { BuilderCanvasNode } from './types';
import { locales, type Locale } from '@/lib/locales';
import { pageCopy } from '@/data/page-copy';
import {
  createAttorneyProfileSectionNodes,
  createContactBlocksSectionNodes,
  createFirmIntroductionSectionNodes,
  createPageHeaderSectionNodes,
} from './decompose-page-shared';

const ZH_HANT_DESKTOP_BOTTOM_RESERVE = 175;
const KO_ATTORNEY_SOURCE_GAP = 32;

function findNode(nodes: BuilderCanvasNode[], id: string): BuilderCanvasNode | undefined {
  return nodes.find((node) => node.id === id);
}

function setRect(node: BuilderCanvasNode | undefined, rect: Partial<BuilderCanvasNode['rect']>): void {
  if (!node) return;
  node.rect = { ...node.rect, ...rect };
}

function growNodeHeight(node: BuilderCanvasNode | undefined, delta: number): void {
  if (!node || delta <= 0) return;
  setRect(node, { height: node.rect.height + delta });
}

function shiftNodeDown(node: BuilderCanvasNode | undefined, delta: number): void {
  if (!node || delta <= 0) return;
  setRect(node, { y: node.rect.y + delta });
}

function calibrateKoAttorneyCardSourceCaption(nodes: BuilderCanvasNode[], cardId: string): void {
  const source = findNode(nodes, `${cardId}-source`);
  if (!source) return;

  const sourceFloor = ['education', 'experience'].reduce((bottom, section) => {
    const node = findNode(nodes, `${cardId}-${section}-section`);
    return node ? Math.max(bottom, node.rect.y + node.rect.height) : bottom;
  }, 0);
  const nextSourceY = Math.max(source.rect.y, sourceFloor + KO_ATTORNEY_SOURCE_GAP);
  const delta = nextSourceY - source.rect.y;
  if (delta <= 0) return;

  shiftNodeDown(source, delta);
  shiftNodeDown(findNode(nodes, `${cardId}-actions`), delta);
  growNodeHeight(findNode(nodes, `${cardId}-info`), delta);
  growNodeHeight(findNode(nodes, cardId), delta);
  growNodeHeight(findNode(nodes, `${cardId}-photo`), delta);
  growNodeHeight(findNode(nodes, `${cardId}-photo-image`), delta);
}

function calibrateKoAboutAttorneySourceCaptions(nodes: BuilderCanvasNode[], locale: Locale): void {
  if (locale !== 'ko') return;

  [
    'page-about-lead-card',
    'page-about-staff-card-0',
    'page-about-staff-card-1',
    'page-about-partner-card',
  ].forEach((cardId) => calibrateKoAttorneyCardSourceCaption(nodes, cardId));
}

function buildAboutPage(y: number, locale: Locale, zBase: number): { nodes: BuilderCanvasNode[]; height: number } {
  const page = pageCopy[locale].about;
  let cursor = y;
  const nodes: BuilderCanvasNode[] = [];

  const header = createPageHeaderSectionNodes({
    prefix: 'page-about',
    y: cursor,
    locale,
    label: page.label,
    title: page.title,
    description: page.description,
    zBase,
  });
  nodes.push(...header.nodes);
  cursor += header.height;

  const firmIntro = createFirmIntroductionSectionNodes('page-about', cursor, locale, zBase + 100);
  nodes.push(...firmIntro.nodes);
  cursor += firmIntro.height;

  const attorney = createAttorneyProfileSectionNodes('page-about', cursor, locale, zBase + 200);
  calibrateKoAboutAttorneySourceCaptions(attorney.nodes, locale);
  nodes.push(...attorney.nodes);
  cursor += attorney.height;

  const contact = createContactBlocksSectionNodes(
    'page-about',
    cursor,
    locale,
    zBase + 300,
    true,
    locale === 'zh-hant' ? 63 : 0,
  );
  nodes.push(...contact.nodes);
  cursor += contact.height;

  return { nodes, height: cursor - y };
}

// Per-locale page height. The document's `stageHeight` is only a FLOOR — the
// published renderer resolves final height as max(stageHeight, deepest node
// bottom) (see src/lib/builder/site/public-page.tsx). Each locale's decomposed
// tree already ends tight (last section bottom = content bottom + the standard
// 88px SECTION_BOTTOM), so seeding a page with ITS OWN locale height avoids
// padding shorter locales (ko/zh-hant) up to the tallest (English) locale.
// Mirrors getLawyersPageRootHeight — seed-pages.ts should pass this per locale
// (like the lawyers page) instead of the cross-locale max constant.
export function getAboutPageRootHeight(locale: Locale): number {
  const pageHeight = buildAboutPage(0, locale, 0).height;
  return locale === 'zh-hant' ? pageHeight + ZH_HANT_DESKTOP_BOTTOM_RESERVE : pageHeight;
}

export const ABOUT_PAGE_ROOT_HEIGHT = Math.max(...locales.map((locale) => getAboutPageRootHeight(locale)));

export function createAboutPageDecomposedNodes(y: number, locale: Locale, zBase: number): BuilderCanvasNode[] {
  return buildAboutPage(y, locale, zBase).nodes;
}

import type { BuilderCanvasNode } from './types';
import { locales, type Locale } from '@/lib/locales';
import { pageCopy } from '@/data/page-copy';
import {
  createAttorneyProfileSectionNodes,
  createContactBlocksSectionNodes,
  createFirmIntroductionSectionNodes,
  createPageHeaderSectionNodes,
} from './decompose-page-shared';

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
  return buildAboutPage(0, locale, 0).height;
}

export const ABOUT_PAGE_ROOT_HEIGHT = Math.max(...locales.map((locale) => getAboutPageRootHeight(locale)));

export function createAboutPageDecomposedNodes(y: number, locale: Locale, zBase: number): BuilderCanvasNode[] {
  return buildAboutPage(y, locale, zBase).nodes;
}

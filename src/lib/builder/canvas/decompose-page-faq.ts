import type { BuilderCanvasNode } from './types';
import { locales, type Locale } from '@/lib/locales';
import { pageCopy } from '@/data/page-copy';
import { createFaqPageSectionNodes, createPageHeaderSectionNodes } from './decompose-page-shared';

function buildFaqPage(y: number, locale: Locale, zBase: number): { nodes: BuilderCanvasNode[]; height: number } {
  const page = pageCopy[locale].faq;
  let cursor = y;
  const nodes: BuilderCanvasNode[] = [];

  const header = createPageHeaderSectionNodes({
    prefix: 'page-faq',
    y: cursor,
    locale,
    label: page.label,
    title: page.title,
    description: page.description,
    zBase,
  });
  nodes.push(...header.nodes);
  cursor += header.height;

  const faq = createFaqPageSectionNodes('page-faq', cursor, locale, zBase + 100);
  nodes.push(...faq.nodes);
  cursor += faq.height;

  return { nodes, height: cursor - y };
}

// Per-locale page height. The document's `stageHeight` is only a FLOOR — the
// published renderer resolves final height as max(stageHeight, deepest node
// bottom) (see src/lib/builder/site/public-page.tsx). Each locale's decomposed
// tree already ends tight (deepest node bottom === this height), so seeding a
// page with ITS OWN locale height avoids padding shorter locales (ko/zh-hant)
// up to the tallest (English) locale. Mirrors getAboutPageRootHeight /
// getLawyersPageRootHeight — seed-pages.ts should pass this per locale instead
// of the cross-locale max constant.
export function getFaqPageRootHeight(locale: Locale): number {
  return buildFaqPage(0, locale, 0).height;
}

export const FAQ_PAGE_ROOT_HEIGHT = Math.max(...locales.map((locale) => getFaqPageRootHeight(locale)));

export function createFaqPageDecomposedNodes(y: number, locale: Locale, zBase: number): BuilderCanvasNode[] {
  return buildFaqPage(y, locale, zBase).nodes;
}

import type { BuilderCanvasNode } from './types';
import { locales, type Locale } from '@/lib/locales';
import { legalPageContent } from '@/data/legal-pages';
import { createLegalCardsSectionNodes, createPageHeaderSectionNodes } from './decompose-page-shared';

function buildDisclaimerPage(y: number, locale: Locale, zBase: number): { nodes: BuilderCanvasNode[]; height: number } {
  const page = legalPageContent[locale].disclaimer;
  let cursor = y;
  const nodes: BuilderCanvasNode[] = [];

  const header = createPageHeaderSectionNodes({
    prefix: 'page-disclaimer',
    y: cursor,
    locale,
    label: page.label,
    title: page.title,
    description: page.description,
    effectiveDateLabel: page.effectiveDateLabel,
    effectiveDate: page.effectiveDate,
    zBase,
  });
  nodes.push(...header.nodes);
  cursor += header.height;

  const legal = createLegalCardsSectionNodes('page-disclaimer', cursor, page, zBase + 100);
  nodes.push(...legal.nodes);
  cursor += legal.height;

  return { nodes, height: cursor - y };
}

// Per-locale page height. Seeding a page with ITS OWN locale height (instead of
// the cross-locale max) avoids padding shorter locales (ko/zh-hant) up to the
// tallest (en) locale. Mirrors getAboutPageRootHeight — seed-pages.ts should
// pass this per locale. DISCLAIMER_PAGE_ROOT_HEIGHT stays the max-over-locales
// floor and is value-identical to the previous definition.
export function getDisclaimerPageRootHeight(locale: Locale): number {
  return buildDisclaimerPage(0, locale, 0).height;
}

export const DISCLAIMER_PAGE_ROOT_HEIGHT = Math.max(...locales.map((locale) => getDisclaimerPageRootHeight(locale)));

export function createDisclaimerPageDecomposedNodes(y: number, locale: Locale, zBase: number): BuilderCanvasNode[] {
  return buildDisclaimerPage(y, locale, zBase).nodes;
}

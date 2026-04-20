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

export const DISCLAIMER_PAGE_ROOT_HEIGHT = Math.max(...locales.map((locale) => buildDisclaimerPage(0, locale, 0).height));

export function createDisclaimerPageDecomposedNodes(y: number, locale: Locale, zBase: number): BuilderCanvasNode[] {
  return buildDisclaimerPage(y, locale, zBase).nodes;
}

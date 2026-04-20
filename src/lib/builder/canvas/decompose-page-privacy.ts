import type { BuilderCanvasNode } from './types';
import { locales, type Locale } from '@/lib/locales';
import { legalPageContent } from '@/data/legal-pages';
import { createLegalCardsSectionNodes, createPageHeaderSectionNodes } from './decompose-page-shared';

function buildPrivacyPage(y: number, locale: Locale, zBase: number): { nodes: BuilderCanvasNode[]; height: number } {
  const page = legalPageContent[locale].privacy;
  let cursor = y;
  const nodes: BuilderCanvasNode[] = [];

  const header = createPageHeaderSectionNodes({
    prefix: 'page-privacy',
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

  const legal = createLegalCardsSectionNodes('page-privacy', cursor, page, zBase + 100);
  nodes.push(...legal.nodes);
  cursor += legal.height;

  return { nodes, height: cursor - y };
}

export const PRIVACY_PAGE_ROOT_HEIGHT = Math.max(...locales.map((locale) => buildPrivacyPage(0, locale, 0).height));

export function createPrivacyPageDecomposedNodes(y: number, locale: Locale, zBase: number): BuilderCanvasNode[] {
  return buildPrivacyPage(y, locale, zBase).nodes;
}

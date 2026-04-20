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

export const FAQ_PAGE_ROOT_HEIGHT = Math.max(...locales.map((locale) => buildFaqPage(0, locale, 0).height));

export function createFaqPageDecomposedNodes(y: number, locale: Locale, zBase: number): BuilderCanvasNode[] {
  return buildFaqPage(y, locale, zBase).nodes;
}

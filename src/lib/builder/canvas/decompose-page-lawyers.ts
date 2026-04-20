import type { BuilderCanvasNode } from './types';
import { locales, type Locale } from '@/lib/locales';
import { pageCopy } from '@/data/page-copy';
import { createAttorneyProfileSectionNodes, createPageHeaderSectionNodes } from './decompose-page-shared';

function buildLawyersPage(y: number, locale: Locale, zBase: number): { nodes: BuilderCanvasNode[]; height: number } {
  const page = pageCopy[locale].lawyers;
  let cursor = y;
  const nodes: BuilderCanvasNode[] = [];

  const header = createPageHeaderSectionNodes({
    prefix: 'page-lawyers',
    y: cursor,
    locale,
    label: page.label,
    title: page.title,
    description: page.description,
    zBase,
  });
  nodes.push(...header.nodes);
  cursor += header.height;

  const attorney = createAttorneyProfileSectionNodes('page-lawyers', cursor, locale, zBase + 100);
  nodes.push(...attorney.nodes);
  cursor += attorney.height;

  return { nodes, height: cursor - y };
}

export const LAWYERS_PAGE_ROOT_HEIGHT = Math.max(...locales.map((locale) => buildLawyersPage(0, locale, 0).height));

export function createLawyersPageDecomposedNodes(y: number, locale: Locale, zBase: number): BuilderCanvasNode[] {
  return buildLawyersPage(y, locale, zBase).nodes;
}

import type { BuilderCanvasNode } from './types';
import { locales, type Locale } from '@/lib/locales';
import { pageCopy } from '@/data/page-copy';
import { createServicesDecomposedNodes, SERVICES_SECTION_ROOT_HEIGHT } from './decompose-services';
import { createPageHeaderSectionNodes } from './decompose-page-shared';

function buildServicesPage(y: number, locale: Locale, zBase: number): { nodes: BuilderCanvasNode[]; height: number } {
  const page = pageCopy[locale].services;
  let cursor = y;
  const nodes: BuilderCanvasNode[] = [];

  const header = createPageHeaderSectionNodes({
    prefix: 'page-services',
    y: cursor,
    locale,
    label: page.label,
    title: page.title,
    description: page.description,
    zBase,
  });
  nodes.push(...header.nodes);
  cursor += header.height;

  nodes.push(...createServicesDecomposedNodes(cursor, locale, zBase + 100));
  cursor += SERVICES_SECTION_ROOT_HEIGHT;

  return { nodes, height: cursor - y };
}

export const SERVICES_PAGE_ROOT_HEIGHT = Math.max(...locales.map((locale) => buildServicesPage(0, locale, 0).height));

export function createServicesPageDecomposedNodes(y: number, locale: Locale, zBase: number): BuilderCanvasNode[] {
  return buildServicesPage(y, locale, zBase).nodes;
}

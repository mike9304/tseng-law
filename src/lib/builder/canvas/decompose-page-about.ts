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

  const contact = createContactBlocksSectionNodes('page-about', cursor, locale, zBase + 300);
  nodes.push(...contact.nodes);
  cursor += contact.height;

  return { nodes, height: cursor - y };
}

export const ABOUT_PAGE_ROOT_HEIGHT = Math.max(...locales.map((locale) => buildAboutPage(0, locale, 0).height));

export function createAboutPageDecomposedNodes(y: number, locale: Locale, zBase: number): BuilderCanvasNode[] {
  return buildAboutPage(y, locale, zBase).nodes;
}

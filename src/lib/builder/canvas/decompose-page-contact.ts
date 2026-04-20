import type { BuilderCanvasNode } from './types';
import { locales, type Locale } from '@/lib/locales';
import { pageCopy } from '@/data/page-copy';
import { createOfficesDecomposedNodes, OFFICES_SECTION_ROOT_HEIGHT } from './decompose-offices';
import {
  createConsultationGuideSectionNodes,
  createContactBlocksSectionNodes,
  createPageHeaderSectionNodes,
} from './decompose-page-shared';

function buildContactPage(y: number, locale: Locale, zBase: number): { nodes: BuilderCanvasNode[]; height: number } {
  const page = pageCopy[locale].contact;
  let cursor = y;
  const nodes: BuilderCanvasNode[] = [];

  const header = createPageHeaderSectionNodes({
    prefix: 'page-contact',
    y: cursor,
    locale,
    label: page.label,
    title: page.title,
    description: page.description,
    zBase,
  });
  nodes.push(...header.nodes);
  cursor += header.height;

  const guide = createConsultationGuideSectionNodes('page-contact', cursor, locale, zBase + 100);
  nodes.push(...guide.nodes);
  cursor += guide.height;

  const contact = createContactBlocksSectionNodes('page-contact', cursor, locale, zBase + 200, false);
  nodes.push(...contact.nodes);
  cursor += contact.height;

  nodes.push(...createOfficesDecomposedNodes(cursor, locale, zBase + 300));
  cursor += OFFICES_SECTION_ROOT_HEIGHT;

  return { nodes, height: cursor - y };
}

export const CONTACT_PAGE_ROOT_HEIGHT = Math.max(...locales.map((locale) => buildContactPage(0, locale, 0).height));

export function createContactPageDecomposedNodes(y: number, locale: Locale, zBase: number): BuilderCanvasNode[] {
  return buildContactPage(y, locale, zBase).nodes;
}

import type { BuilderCanvasNode } from './types';
import { locales, type Locale } from '@/lib/locales';
import { pageCopy } from '@/data/page-copy';
import { createAttorneyProfileSectionNodes, createPageHeaderSectionNodes } from './decompose-page-shared';

// Header parity (+44px): createPageHeaderSectionNodes now matches the live 428px
// header (was 384). The attorney body (createAttorneyProfileSectionNodes) is SHARED
// with the About page, so it cannot be shrunk without regressing About; the lawyers
// page instead absorbs the +44 by trimming its own bottom reserve (62 -> 18) so the
// page total stays aligned with tseng-law.com (ko 2653 / en 2758).
const LAWYERS_PAGE_BOTTOM_RESERVE = 18;
const ZH_HANT_LAWYERS_PAGE_BOTTOM_RESERVE = 0;

function getLawyersPageBottomReserve(locale: Locale): number {
  return locale === 'zh-hant' ? ZH_HANT_LAWYERS_PAGE_BOTTOM_RESERVE : LAWYERS_PAGE_BOTTOM_RESERVE;
}

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
  cursor += getLawyersPageBottomReserve(locale);

  return { nodes, height: cursor - y };
}

export function getLawyersPageRootHeight(locale: Locale): number {
  return buildLawyersPage(0, locale, 0).height;
}

export const LAWYERS_PAGE_ROOT_HEIGHT = Math.max(...locales.map((locale) => getLawyersPageRootHeight(locale)));

export function createLawyersPageDecomposedNodes(y: number, locale: Locale, zBase: number): BuilderCanvasNode[] {
  return buildLawyersPage(y, locale, zBase).nodes;
}

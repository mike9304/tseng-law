import {
  CORPORATE_ADVISORY_ANCHOR,
  CORPORATE_ADVISORY_PAGE_SLUG,
  getCorporateAdvisory,
  getCorporateAdvisoryHref,
} from '@/data/corporate-advisory';
import { getIntentPage, intentPageSlugs } from '@/data/intent-pages';
import type { SiteLocale } from '@/lib/locales';
import type { SearchDoc } from './types';

/**
 * Client-safe EN/JA file-backed public pages that source-collector does not
 * emit (builder pages + JA columns only). KO/ZH stay empty.
 */
function joinSearchBody(parts: Array<string | undefined>): string {
  return parts.filter((part): part is string => Boolean(part && part.trim())).join('\n');
}

function intentPageSearchDoc(locale: SiteLocale, slug: (typeof intentPageSlugs)[number]): SearchDoc | null {
  const page = getIntentPage(locale, slug);
  if (!page) return null;

  return {
    id: `page:${locale}:${slug}`,
    kind: 'page',
    locale,
    title: page.title,
    url: `/${locale}/${slug}`,
    summary: page.description,
    body: joinSearchBody([
      ...page.searchTerms,
      ...page.heroPoints,
      ...page.idealFor,
      ...page.reviewPoints,
      ...page.processFlow,
      ...page.prepareChecklist,
      ...page.cautionPoints,
      ...page.faq.flatMap((item) => [item.question, item.answer]),
    ]),
  };
}

function corporateAdvisorySearchDoc(locale: SiteLocale): SearchDoc | null {
  const content = getCorporateAdvisory(locale);
  const href = getCorporateAdvisoryHref(locale);
  if (!content || !href) return null;

  return {
    id: `page:${locale}:${CORPORATE_ADVISORY_PAGE_SLUG}#${CORPORATE_ADVISORY_ANCHOR}`,
    kind: 'page',
    locale,
    title: content.headline,
    url: href,
    summary: content.summary,
    body: joinSearchBody([
      content.headline,
      content.summary,
      content.intro,
      content.body,
      ...content.items.flatMap((item) => [item.title, item.body]),
      content.relatedHeading,
      ...content.relatedLinks.map((link) => link.label),
      content.initialEmail,
      content.languages,
      content.ctaLabel,
      content.sensitiveNote,
    ]),
  };
}

export function getPublicIntentSearchDocs(locale: SiteLocale): SearchDoc[] {
  if (locale !== 'en' && locale !== 'ja') {
    return [];
  }

  const docs: SearchDoc[] = [];
  for (const slug of intentPageSlugs) {
    const doc = intentPageSearchDoc(locale, slug);
    if (doc) docs.push(doc);
  }

  const corporate = corporateAdvisorySearchDoc(locale);
  if (corporate) docs.push(corporate);

  return docs;
}

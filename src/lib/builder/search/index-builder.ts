import type { Locale } from '@/lib/locales';
import { locales } from '@/lib/locales';
import type { SearchDoc, SearchIndex } from './types';
import { tokenize } from './tokenize';

/**
 * PR #5 — Build a search index from heterogeneous source docs.
 *
 * The inverted index entries are stored as strings (`${docIdx}:${tf}`) so the
 * serialized JSON stays compact and easy to inspect.
 */
export function buildSearchIndex(docs: SearchDoc[]): SearchIndex {
  const byLocale: Record<Locale, SearchDoc[]> = { ko: [], 'zh-hant': [], en: [] };
  for (const doc of docs) {
    if (!locales.includes(doc.locale)) continue;
    byLocale[doc.locale].push(doc);
  }

  const invertedByLocale: Record<Locale, Record<string, string[]>> = {
    ko: {},
    'zh-hant': {},
    en: {},
  };

  for (const locale of locales) {
    const localeDocs = byLocale[locale];
    const inverted = invertedByLocale[locale];
    localeDocs.forEach((doc, idx) => {
      const tokens = tokenize(`${doc.title}\n${doc.summary ?? ''}\n${doc.body}`);
      const freq = new Map<string, number>();
      for (const tok of tokens) {
        freq.set(tok, (freq.get(tok) ?? 0) + 1);
      }
      for (const [tok, count] of freq.entries()) {
        if (!inverted[tok]) inverted[tok] = [];
        inverted[tok].push(`${idx}:${count}`);
      }
    });
  }

  return {
    builtAt: new Date().toISOString(),
    byLocale,
    invertedByLocale,
  };
}

export interface BuildIndexInputs {
  pages: SearchDoc[];
  blog: SearchDoc[];
  faq: SearchDoc[];
}

export function combineSearchSources(inputs: BuildIndexInputs): SearchDoc[] {
  return [...inputs.pages, ...inputs.blog, ...inputs.faq];
}

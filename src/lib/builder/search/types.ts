import type { Locale } from '@/lib/locales';

export type SearchDocKind = 'page' | 'blog' | 'faq';

export interface SearchDoc {
  /** Stable id across rebuilds (e.g. `${kind}:${slug}`). */
  id: string;
  kind: SearchDocKind;
  locale: Locale;
  title: string;
  url: string;
  /** Optional short summary shown in the result card. */
  summary?: string;
  /** Full extracted text used for scoring. */
  body: string;
  publishedAt?: string;
  tags?: string[];
}

export interface SearchIndex {
  builtAt: string;
  /** Map of locale → docs. The query engine filters by locale up-front. */
  byLocale: Record<Locale, SearchDoc[]>;
  /**
   * Inverted index: locale → term → list of `${docIdx}:${tf}` entries.
   * docIdx is the position within byLocale[locale].
   */
  invertedByLocale: Record<Locale, Record<string, string[]>>;
}

export interface SearchHit {
  doc: SearchDoc;
  score: number;
  highlights: string[];
}

export interface SearchQueryLog {
  query: string;
  locale: Locale;
  hits: number;
  hitId?: string;
  at: string;
  userAgentDigest?: string;
}

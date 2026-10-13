import { beforeAll, describe, expect, it, vi } from 'vitest';
import pending from '@/content/column-embeddings-pending.json';
import { getAllColumnPosts } from '@/lib/columns';
import { collectAllSearchDocs } from '@/lib/builder/search/source-collector';
import { buildSearchIndex } from '@/lib/builder/search/index-builder';
import { runSearchQuery } from '@/lib/builder/search/query-engine';
import type { Locale } from '@/lib/locales';

vi.mock('@/lib/builder/site/persistence', () => ({ readExistingSiteDocument: vi.fn(async () => null) }));
vi.mock('@/lib/builder/faq/faq-engine', () => ({ listFaqSearchDocs: vi.fn(async () => []) }));
vi.mock('@/lib/builder/portfolio/portfolio-engine', () => ({ listPortfolioSearchDocs: vi.fn(async () => []) }));

describe('columns awaiting authorized embedding backfill', () => {
  let index: ReturnType<typeof buildSearchIndex>;
  const postsByLocale = new Map<string, ReturnType<typeof getAllColumnPosts>>();

  beforeAll(async () => {
    // Build the complete index once; every pending row still uses the real query engine.
    index = buildSearchIndex(await collectAllSearchDocs());
    for (const locale of new Set(pending.columns.map((column) => column.locale))) {
      postsByLocale.set(locale, getAllColumnPosts(locale as Locale));
    }
  }, 15000);

  it.each(pending.columns)('$locale/$slug is discoverable through the actual file-column collector and text engine without embedding calls', ({ locale, slug }) => {
    const post = postsByLocale.get(locale)?.find((column) => column.slug === slug);
    expect(post, `${locale}:${slug} must have a file-backed post`).toBeDefined();
    const hits = runSearchQuery({ index, query: post!.title, locale: locale as Locale, limit: 50, kinds: ['blog'] });
    expect(hits.some(hit => hit.doc.url === `/${locale}/columns/${slug}`), `${locale}:${slug}`).toBe(true);
  });
});

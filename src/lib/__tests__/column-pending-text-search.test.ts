import { describe, expect, it, vi } from 'vitest';
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
  it('are discoverable through the actual file-column collector and text engine without embedding calls', async () => {
    const index = buildSearchIndex(await collectAllSearchDocs());
    const postsByLocale = new Map<string, ReturnType<typeof getAllColumnPosts>>();
    for (const { locale, slug } of pending.columns) {
      let posts = postsByLocale.get(locale);
      if (!posts) {
        posts = getAllColumnPosts(locale as Locale);
        postsByLocale.set(locale, posts);
      }
      const post = posts.find(column => column.slug === slug)!;
      const hits = runSearchQuery({ index, query: post.title, locale: locale as Locale, limit: 50, kinds: ['blog'] });
      expect(hits.some(hit => hit.doc.url === `/${locale}/columns/${slug}`), `${locale}:${slug}`).toBe(true);
    }
  });
});

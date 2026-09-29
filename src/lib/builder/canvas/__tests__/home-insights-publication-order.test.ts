import { describe, expect, it } from 'vitest';
import type { BuilderCanvasNode } from '../types';
import { createInsightsDecomposedNodes } from '../decompose-insights';
import type { ColumnPost } from '@/lib/columns';
import type { Locale } from '@/lib/locales';

function createColumnPost(
  slug: string,
  title: string,
  date: string,
  dateDisplay: string,
): ColumnPost {
  return {
    slug,
    title,
    date,
    dateDisplay,
    readTime: '3분 분량',
    category: 'legal',
    categoryLabel: '법률정보',
    featuredImage: '/images/blog/placeholder.jpg',
    content: '',
    summary: '',
  };
}

function textNodeText(node: BuilderCanvasNode | undefined): string | undefined {
  return node?.kind === 'text' ? node.content.text : undefined;
}

function buttonHref(node: BuilderCanvasNode | undefined): string | undefined {
  return node?.kind === 'button' ? node.content.href : undefined;
}

describe('decomposed home insights publication order', () => {
  it.each([
    ['ko', '2026년 2월 4일', '2025년 9월 13일'],
    ['zh-hant', '2026年2月4日', '2025年9月13日'],
    ['en', 'February 4, 2026', 'September 13, 2025'],
  ] satisfies ReadonlyArray<readonly [Locale, string, string]>)(
    'sorts %s posts by publication display date without letting lastmod win',
    (locale, cosmeticsPublicationDate, trafficPublicationDate) => {
      const sourcePosts = [
        createColumnPost(
          'traffic',
          'Traffic publication',
          '2026-07-26',
          trafficPublicationDate,
        ),
        createColumnPost(
          'cosmetics',
          'Cosmetics publication',
          '2026-07-25',
          cosmeticsPublicationDate,
        ),
      ];
      const nodes = createInsightsDecomposedNodes(0, locale, 0, sourcePosts);
      const nodesById = new Map(nodes.map((node) => [node.id, node]));

      expect(textNodeText(nodesById.get('home-insights-featured-title'))).toBe('Cosmetics publication');
      expect(textNodeText(nodesById.get('home-insights-featured-date'))).toBe(cosmeticsPublicationDate);
      expect(textNodeText(nodesById.get('home-insights-item-0-title'))).toBe('Traffic publication');
    },
  );

  it.each([
    ['ko', 'taiwan-income-tax-residency'],
    ['zh-hant', 'taiwan-income-tax-residency'],
    // The English-only native columns (032-034) share the 2026-09-29 date and follow
    // the gap columns in source order, so the gap batch still leads.
    ['en', 'taiwan-income-tax-residency'],
  ] satisfies ReadonlyArray<readonly [Locale, string]>)(
    'keeps the newest gap-column article first for %s',
    (locale, newestSlug) => {
      const nodes = createInsightsDecomposedNodes(0, locale, 0);
      const nodesById = new Map(nodes.map((node) => [node.id, node]));

      // The September 29 batch (024-031) leads the feed by actual publication date;
      // the topic interleave starts from the newest post overall.
      expect(buttonHref(nodesById.get('home-insights-featured-link'))).toBe(
        `/${locale}/columns/${newestSlug}`,
      );
      expect(textNodeText(nodesById.get('home-insights-featured-date'))).not.toBe('');
    },
  );
});

import { describe, expect, it } from 'vitest';
import type { ColumnPost } from '@/lib/columns';
import {
  createInsightsDecomposedNodes,
  INSIGHTS_SECTION_ROOT_HEIGHT,
} from '../decompose-insights';

function column(
  slug: string,
  date: string,
  featuredImage = `/images/blog/${slug}/featured-01.jpg`,
  dateDisplay = date,
): ColumnPost {
  return {
    slug,
    title: `${slug} title`,
    date,
    dateDisplay,
    readTime: '4분',
    category: 'legal',
    categoryLabel: '법률정보',
    featuredImage,
    content: '',
    summary: `${slug} summary`,
  };
}

describe('compact decomposed insights archive', () => {
  it('uses a compact desktop section without the legacy reveal gate or 1260px reserve', () => {
    const nodes = createInsightsDecomposedNodes(0, 'ko', 0, [
      column('featured', '2026-03-01'),
      column('second', '2026-02-01'),
      column('third', '2026-01-01'),
      column('fourth', '2025-12-01'),
      column('fifth', '2025-11-01'),
    ]);
    const byId = new Map(nodes.map((node) => [node.id, node]));

    expect(INSIGHTS_SECTION_ROOT_HEIGHT).toBeGreaterThanOrEqual(700);
    expect(INSIGHTS_SECTION_ROOT_HEIGHT).toBeLessThanOrEqual(820);
    expect(byId.get('home-insights-root')?.rect.height).toBe(INSIGHTS_SECTION_ROOT_HEIGHT);
    expect(byId.get('home-insights-grid')?.content).toMatchObject({
      className: 'insights-grid',
    });
    expect(byId.get('home-insights-grid')?.content).not.toMatchObject({
      className: expect.stringContaining('reveal-stagger'),
    });

    const cta = byId.get('home-insights-view-all');
    expect(cta).toBeDefined();
    expect((cta?.rect.y ?? 0) + (cta?.rect.height ?? 0)).toBeLessThan(
      INSIGHTS_SECTION_ROOT_HEIGHT,
    );
  });

  it('sorts supplied posts newest-first and replaces placeholder imagery', () => {
    const nodes = createInsightsDecomposedNodes(0, 'ko', 0, [
      column('older', '2025-09-13'),
      column('newest', '2026-02-04', '/images/blog/placeholder.jpg'),
      column('middle', '2025-12-01'),
      column('last', ''),
    ]);
    const byId = new Map(nodes.map((node) => [node.id, node]));
    const featuredTitle = byId.get('home-insights-featured-title');
    const featuredImage = byId.get('home-insights-featured-image');

    expect(featuredTitle?.kind).toBe('text');
    if (featuredTitle?.kind === 'text') {
      expect(featuredTitle.content.text).toBe('newest title');
    }
    expect(featuredImage?.kind).toBe('image');
    if (featuredImage?.kind === 'image') {
      expect(featuredImage.content.src).toContain('featured-generic.webp');
      expect(featuredImage.content.src).not.toContain('placeholder');
    }
  });

  it('keeps source order for equal publication dates and undated posts', () => {
    const nodes = createInsightsDecomposedNodes(0, 'ko', 0, [
      column('undated-first', '', undefined, '날짜 확인 중'),
      column('equal-first', '2026-07-27', undefined, '2025년 9월 13일'),
      column('undated-second', '', undefined, ''),
      column('equal-second', '2026-07-25', undefined, '2025년 9월 13일'),
    ]);
    const byId = new Map(nodes.map((node) => [node.id, node]));
    const title = (id: string) => {
      const node = byId.get(id);
      return node?.kind === 'text' ? node.content.text : undefined;
    };

    expect([
      title('home-insights-featured-title'),
      title('home-insights-item-0-title'),
      title('home-insights-item-1-title'),
      title('home-insights-item-2-title'),
    ]).toEqual([
      'equal-first title',
      'equal-second title',
      'undated-first title',
      'undated-second title',
    ]);
  });
});

import { readFileSync } from 'node:fs';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import InsightsArchiveSection, {
  INSIGHTS_IMAGE_FALLBACK,
  resolveInsightsImageSrc,
  sortInsightsPostsNewestFirst,
} from '../InsightsArchiveSection';

const emptyImagePost = {
  slug: 'empty-image-column',
  title: 'Empty image column',
  date: '2026-07-10',
  dateDisplay: '2026. 7. 10.',
  readTime: '3 min',
  categoryLabel: 'Guide',
  featuredImage: '   ',
  summary: 'A column without an uploaded featured image.',
};

describe('InsightsArchiveSection image fallback', () => {
  it('normalizes empty and placeholder image values to the tracked Taiwan-law editorial image', () => {
    expect(resolveInsightsImageSrc('')).toBe(INSIGHTS_IMAGE_FALLBACK);
    expect(resolveInsightsImageSrc('   ')).toBe(INSIGHTS_IMAGE_FALLBACK);
    expect(resolveInsightsImageSrc(null)).toBe(INSIGHTS_IMAGE_FALLBACK);
    expect(resolveInsightsImageSrc(undefined)).toBe(INSIGHTS_IMAGE_FALLBACK);
    expect(resolveInsightsImageSrc('/images/blog/placeholder.jpg')).toBe(INSIGHTS_IMAGE_FALLBACK);
    expect(resolveInsightsImageSrc('/images/placeholder-article-hero.jpg')).toBe(INSIGHTS_IMAGE_FALLBACK);
    expect(resolveInsightsImageSrc('/images/real-column.jpg')).toBe('/images/real-column.jpg');
  });

  it('never renders an empty Next Image src for featured or list posts', () => {
    const html = renderToStaticMarkup(
      <InsightsArchiveSection
        locale="en"
        posts={[
          emptyImagePost,
          { ...emptyImagePost, slug: 'empty-image-column-2', title: 'Second empty image column' },
        ]}
      />,
    );

    expect(html).not.toContain('src=""');
    expect(html).toContain('featured-generic.webp');
    expect(html).not.toContain('placeholder-article-hero.jpg');
  });

  it('keeps the first archive cards visible in SSR markup and exposes carousel controls', () => {
    const posts = Array.from({ length: 5 }, (_, index) => ({
      ...emptyImagePost,
      slug: `column-${index + 1}`,
      title: `Column ${index + 1}`,
      date: `2026-07-${String(10 - index).padStart(2, '0')}`,
      dateDisplay: `2026. 7. ${10 - index}.`,
      featuredImage: '/images/real-column.jpg',
    }));

    const html = renderToStaticMarkup(<InsightsArchiveSection locale="ko" posts={posts} />);

    expect(html).toContain('class="insights-grid"');
    expect(html).not.toContain('reveal-stagger');
    expect(html).toContain('aria-roledescription="carousel"');
    expect(html).toContain('aria-controls=');
    expect(html).toContain('Column 1');
    expect(html).toContain('Column 4');
  });

  it('orders valid publication dates newest-first while preserving undated source order', () => {
    const posts = [
      { ...emptyImagePost, slug: 'undated-a', date: '', dateDisplay: '' },
      {
        ...emptyImagePost,
        slug: 'older',
        date: '2026-07-25',
        dateDisplay: '2025년 9월 13일',
      },
      {
        ...emptyImagePost,
        slug: 'newest',
        date: '2026-07-24',
        dateDisplay: '2026년 2월 4일',
      },
      { ...emptyImagePost, slug: 'undated-b', date: '', dateDisplay: '' },
    ];

    expect(sortInsightsPostsNewestFirst(posts).map((post) => post.slug)).toEqual([
      'newest',
      'older',
      'undated-a',
      'undated-b',
    ]);
  });
});

describe('column public author identity', () => {
  it.each([
    ['ja', '曾雋崴弁護士監修'],
    ['zh-hant', '曾雋崴律師審閱'],
  ] as const)('renders the official %s review byline', (locale, expectedByline) => {
    const html = renderToStaticMarkup(
      <InsightsArchiveSection locale={locale} posts={[emptyImagePost]} />,
    );

    expect(html).toContain(expectedByline);
  });

  it('does not retain the incorrect Chinese name in the four product sources', () => {
    const productSources = [
      new URL('../ColumnsGrid.tsx', import.meta.url),
      new URL('../InsightsArchiveSection.tsx', import.meta.url),
      new URL('../../app/[locale]/columns/page.tsx', import.meta.url),
      new URL('../../app/[locale]/columns/[slug]/page.tsx', import.meta.url),
    ];

    for (const source of productSources) {
      expect(readFileSync(source, 'utf8')).not.toContain('曾俊瑋');
    }
  });

  it('uses the canonical profile URL and official alternate name in Article JSON-LD source', () => {
    const detailSource = readFileSync(
      new URL('../../app/[locale]/columns/[slug]/page.tsx', import.meta.url),
      'utf8',
    );

    expect(detailSource).toContain('https://www.wei-wei-lawyer.com/lawyertseng');
    expect(detailSource).toContain("authorAlternateNames: ['증준외', '曾雋崴', 'Wei Tseng']");
  });
});

import { readFileSync } from 'node:fs';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import InsightsArchiveSection, {
  INSIGHTS_IMAGE_FALLBACK,
  resolveInsightsImageSrc,
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
  it('normalizes empty and whitespace-only image values to the tracked article placeholder', () => {
    expect(resolveInsightsImageSrc('')).toBe(INSIGHTS_IMAGE_FALLBACK);
    expect(resolveInsightsImageSrc('   ')).toBe(INSIGHTS_IMAGE_FALLBACK);
    expect(resolveInsightsImageSrc(null)).toBe(INSIGHTS_IMAGE_FALLBACK);
    expect(resolveInsightsImageSrc(undefined)).toBe(INSIGHTS_IMAGE_FALLBACK);
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
    expect(html).toContain('placeholder-article-hero.jpg');
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

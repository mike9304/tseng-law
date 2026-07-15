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

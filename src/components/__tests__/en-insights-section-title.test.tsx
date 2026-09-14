import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';

import InsightsArchiveSection from '@/components/InsightsArchiveSection';

const samplePost = {
  slug: 'sample-insight',
  title: 'Sample insight',
  date: '2026-07-10',
  dateDisplay: '2026. 7. 10.',
  readTime: '3 min',
  categoryLabel: 'Guide',
  featuredImage: '/images/real-column.jpg',
  summary: 'A sample insight card for the home section title.',
};

describe('English home insights section title', () => {
  it('uses Insights rather than Columns or Column Archive', () => {
    const html = renderToStaticMarkup(
      <InsightsArchiveSection locale="en" posts={[samplePost]} />,
    );

    expect(html).toContain('>Insights<');
    expect(html).not.toContain('>Columns<');
    expect(html).not.toContain('>Column Archive<');
  });
});

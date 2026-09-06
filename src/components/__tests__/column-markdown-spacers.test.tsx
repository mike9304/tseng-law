import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';

import ColumnContent from '@/components/ColumnContent';

describe('column Markdown imported spacer paragraphs', () => {
  it('omits plain paragraphs containing only whitespace and zero-width spaces', () => {
    const html = renderToStaticMarkup(
      <ColumnContent content={'First paragraph.\n\n\u200B\n\n \u200B \u200B \n\nLast paragraph.'} />,
    );

    expect(html).toContain('<p class="blog-paragraph">First paragraph.</p>');
    expect(html).toContain('<p class="blog-paragraph">Last paragraph.</p>');
    expect((html.match(/<p class="blog-paragraph">/g) ?? []).length).toBe(2);
    expect(html).not.toContain('\u200B');
  });

  it('preserves visible paragraphs, ranges, inline markup and image-only paragraphs', () => {
    const content = '4만~20만 / 60만~500만.\n\nText\u200Bwithin **bold** and [a link](/ko/columns).\n\n![Original caption](/images/original.webp)\n\n~~intentional~~';
    const html = renderToStaticMarkup(<ColumnContent locale="ko" content={content} />);

    expect(html).toContain('4만~20만 / 60만~500만.');
    expect(html).toContain('Text\u200Bwithin');
    expect(html).toContain('<strong style="font-weight:600">bold</strong>');
    expect(html).toContain('href="/ko/columns"');
    expect(html).toContain('src="/images/original.webp" alt="Original caption"');
    expect(html).toContain('<del>intentional</del>');
    expect((html.match(/<p class="blog-paragraph">/g) ?? []).length).toBe(4);
  });

  it('keeps joiners and inline elements even when they have no visible glyph', () => {
    const html = renderToStaticMarkup(
      <ColumnContent content={'\u200D\n\n**\u200B**\n\n👩\u200D⚖️'} />,
    );

    expect(html).toContain('<p class="blog-paragraph">\u200D</p>');
    expect(html).toContain('<strong style="font-weight:600">\u200B</strong>');
    expect(html).toContain('👩\u200D⚖️');
    expect((html.match(/<p class="blog-paragraph">/g) ?? []).length).toBe(3);
  });
});

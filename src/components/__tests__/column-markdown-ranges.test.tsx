import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';

import ColumnContent from '@/components/ColumnContent';

describe('column Markdown range punctuation', () => {
  it('preserves single-tilde ranges in the same paragraph', () => {
    const html = renderToStaticMarkup(
      <ColumnContent locale="ko" content="4만~20만 신타이완달러, 60만~500만 신타이완달러" />,
    );
    expect(html).toContain('4만~20만 신타이완달러, 60만~500만 신타이완달러');
    expect(html).not.toContain('<del>');
  });

  it('retains explicitly marked double-tilde strikethrough', () => {
    const html = renderToStaticMarkup(
      <ColumnContent locale="en" content="Keep ~~intentional~~ strikethrough and 10~20 / 30~40 ranges." />,
    );
    expect(html).toContain('<del>intentional</del>');
    expect(html).toContain('10~20 / 30~40 ranges.');
    expect((html.match(/<del>/g) ?? []).length).toBe(1);
  });
});

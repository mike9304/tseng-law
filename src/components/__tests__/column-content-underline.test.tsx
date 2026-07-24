import { describe, expect, it } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';
import ColumnContent from '@/components/ColumnContent';

describe('ColumnContent underline parity', () => {
  it('renders ++text++ as a real <u> element (public path)', () => {
    const html = renderToStaticMarkup(
      <ColumnContent content={'Intro ++underlined phrase++ end.'} />,
    );
    expect(html).toContain('data-column-content="markdown"');
    expect(html).toMatch(/<u[^>]*>underlined phrase<\/u>/);
    expect(html).not.toContain('++underlined phrase++');
  });
});

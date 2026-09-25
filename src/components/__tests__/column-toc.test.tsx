import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';

import ColumnContent from '@/components/ColumnContent';
import ColumnToc from '@/components/ColumnToc';
import { getAllColumnPosts } from '@/lib/columns';
import { extractColumnToc } from '@/lib/column-toc';
import { siteLocales } from '@/lib/locales';

function renderedSectionIds(html: string): string[] {
  return [...html.matchAll(/<h2 class="blog-heading" id="([^"]+)">/g)].map((match) => match[1]);
}

describe('column "In this article" navigation', () => {
  it('lists level-2 headings in order with sequential ids and plain text', () => {
    const markdown = [
      '# Title',
      '',
      '## 1. Choosing a [Taiwan](https://example.com) **presence**',
      'Body with `## not a heading` inline.',
      '',
      '```',
      '## inside a fence',
      '```',
      '',
      '### A level-3 heading',
      '',
      '## ++Underlined++ _section_ ##',
      '',
      '## 대만 회사 설립 절차',
    ].join('\n');

    expect(extractColumnToc(markdown)).toEqual([
      { id: 'sec-1', text: '1. Choosing a Taiwan presence' },
      { id: 'sec-2', text: 'Underlined section' },
      { id: 'sec-3', text: '대만 회사 설립 절차' },
    ]);
  });

  it('gives every rendered level-2 heading the matching sec-n id', () => {
    const markdown = '## First\n\ntext\n\n### Sub\n\n## Second';
    const html = renderToStaticMarkup(<ColumnContent locale="en" content={markdown} />);

    expect(renderedSectionIds(html)).toEqual(['sec-1', 'sec-2']);
    expect(html).toContain('<h3 class="blog-heading">Sub</h3>');
  });

  it('keeps anchors aligned for builder-serialized edge cases (quoted, empty, nested, setext headings)', () => {
    const markdown = [
      '## Alpha',
      '',
      '> ## Quoted heading',
      '> quote text',
      '',
      '##',
      '',
      '- item',
      '',
      '  ## Nested in a list',
      '',
      'Setext Heading',
      '---',
      '',
      '## Omega',
    ].join('\n');

    const toc = extractColumnToc(markdown);
    expect(toc).toEqual([
      { id: 'sec-1', text: 'Alpha' },
      { id: 'sec-3', text: 'Setext Heading' },
      { id: 'sec-4', text: 'Omega' },
    ]);

    const html = renderToStaticMarkup(<ColumnContent locale="en" content={markdown} />);
    expect(renderedSectionIds(html)).toEqual(['sec-1', 'sec-2', 'sec-3', 'sec-4']);
    for (const entry of toc) {
      expect(html).toContain(`<h2 class="blog-heading" id="${entry.id}">${entry.text}</h2>`);
    }
    // Headings inside quotes/lists render without a section id and are not listed.
    expect(html).toContain('<h2 class="blog-heading">Quoted heading</h2>');
    expect(html).toContain('<h2 class="blog-heading">Nested in a list</h2>');
  });

  it('renders anchors that point at those ids', () => {
    const html = renderToStaticMarkup(
      <ColumnToc
        label="In this article"
        entries={[
          { id: 'sec-1', text: 'First' },
          { id: 'sec-2', text: 'Second' },
        ]}
      />,
    );

    expect(html).toContain('<nav class="column-toc" aria-labelledby="column-toc-label">');
    expect(html).toContain('<p class="column-toc-label" id="column-toc-label">In this article</p>');
    expect(html).toContain('<a href="#sec-1" class="column-toc-link">First</a>');
    expect(html).toContain('<a href="#sec-2" class="column-toc-link">Second</a>');
    expect(html).not.toContain('column-toc-list--long');
  });

  it.each(siteLocales)('stays aligned with the rendered headings for every %s column', (locale) => {
    const posts = getAllColumnPosts(locale);
    expect(posts.length).toBeGreaterThan(0);

    for (const post of posts) {
      const toc = extractColumnToc(post.content);
      const html = renderToStaticMarkup(<ColumnContent locale={locale} content={post.content} />);
      const ids = renderedSectionIds(html);

      expect({ slug: post.slug, ids }).toEqual({ slug: post.slug, ids: toc.map((entry) => entry.id) });
      expect((html.match(/<h2\b/g) ?? []).length).toBe(ids.length);
      for (const entry of toc) expect(entry.text.length).toBeGreaterThan(0);
    }
  });
});

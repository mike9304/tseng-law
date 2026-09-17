import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';

import ScrollHighlightText from '@/components/ScrollHighlightText';

function renderHighlight(text: string, highlightWords: string[]) {
  const html = renderToStaticMarkup(createElement(ScrollHighlightText, { text, highlightWords }));
  return {
    text: html.replace(/<[^>]*>/g, ''),
    highlighted: [...html.matchAll(/<span[^>]*class="[^"]*\bis-keyword\b[^"]*"[^>]*>([^<]*)<\/span>/g)]
      .map((match) => match[1]),
  };
}

describe('ScrollHighlightText exact keyword ranges', () => {
  it.each([
    {
      text: 'Three languages—Chinese, Korean, and Japanese—seven areas.',
      words: ['Chinese', 'Korean', 'Japanese'],
      highlighted: ['Chinese', 'Korean', 'Japanese'],
    },
    {
      text: '中国語・韓国語・日本語でご相談に対応。 TOPIK 6級。',
      words: ['中国語', '韓国語', '日本語'],
      highlighted: ['中国語', '韓国語', '日本語'],
    },
    {
      text: '以中文、韓文及日文提供諮詢。',
      words: ['中文', '韓文', '日文'],
      highlighted: ['中文', '韓文', '日文'],
    },
  ])('highlights only the named ranges in $text', ({ text, words, highlighted }) => {
    const rendered = renderHighlight(text, words);

    expect(rendered.highlighted).toEqual(highlighted);
    expect(rendered.text).toBe(text);
  });

  it('preserves repeated whitespace and treats keyword punctuation literally', () => {
    const text = '  C++  (A+B)\n日本語と日本語。';
    const rendered = renderHighlight(text, ['', 'C++', '(A+B)', '日本', '日本語', '日本語']);

    expect(rendered.highlighted).toEqual(['C++', '(A+B)', '日本語', '日本語']);
    expect(rendered.text).toBe(text);
  });

  it('preserves the complete text when there are no matching keywords', () => {
    const text = '中文與日本語。  Korean\nEnglish';
    const rendered = renderHighlight(text, ['', 'absent']);

    expect(rendered.highlighted).toEqual([]);
    expect(rendered.text).toBe(text);
  });
});

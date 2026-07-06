import { describe, expect, it } from 'vitest';
import type { SafeTipTapNode } from '@/lib/builder/rich-text/sanitize';
import { replaceRichTextNodePlainText } from '../rich-text-node-replacements';

function linkedHyphenUnderlineDoc(): SafeTipTapNode {
  return {
    type: 'doc',
    content: [
      {
        type: 'paragraph',
        content: [
          {
            type: 'text',
            text: '방문',
            marks: [{ type: 'link', attrs: { href: 'https://example.com', target: '_blank' } }],
          },
          { type: 'text', text: '-' },
          { type: 'text', text: '하기', marks: [{ type: 'underline' }] },
        ],
      },
    ],
  };
}

function linkedUnderlineDoc(): SafeTipTapNode {
  return {
    type: 'doc',
    content: [
      {
        type: 'paragraph',
        content: [
          {
            type: 'text',
            text: '방문',
            marks: [{ type: 'link', attrs: { href: 'https://example.com', target: '_blank' } }],
          },
          { type: 'text', text: '하기', marks: [{ type: 'underline' }] },
        ],
      },
    ],
  };
}

describe('replaceRichTextNodePlainText unicode separators', () => {
  it('keeps translated en dash separators outside adjacent rich text marks', () => {
    const result = replaceRichTextNodePlainText(linkedHyphenUnderlineDoc(), 'Visit–Again');

    expect(result?.content?.[0]?.content).toEqual([
      {
        type: 'text',
        text: 'Visit',
        marks: [{ type: 'link', attrs: { href: 'https://example.com', target: '_blank' } }],
      },
      { type: 'text', text: '–' },
      { type: 'text', text: 'Again', marks: [{ type: 'underline' }] },
    ]);
  });

  it('keeps compact translated en dash separators outside adjacent marks without source separators', () => {
    const result = replaceRichTextNodePlainText(linkedUnderlineDoc(), 'Visit–Again');

    expect(result?.content?.[0]?.content).toEqual([
      {
        type: 'text',
        text: 'Visit',
        marks: [{ type: 'link', attrs: { href: 'https://example.com', target: '_blank' } }],
      },
      { type: 'text', text: '–' },
      { type: 'text', text: 'Again', marks: [{ type: 'underline' }] },
    ]);
  });
});

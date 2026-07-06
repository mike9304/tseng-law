import { describe, expect, it } from 'vitest';
import type { SafeTipTapNode } from '@/lib/builder/rich-text/sanitize';
import { replaceRichTextNodePlainText } from '../rich-text-node-replacements';

function adjacentMarkedDoc(): SafeTipTapNode {
  return {
    type: 'doc',
    content: [
      {
        type: 'paragraph',
        content: [
          { type: 'text', text: '방문', marks: [{ type: 'bold' }] },
          { type: 'text', text: '하기', marks: [{ type: 'italic' }] },
        ],
      },
    ],
  };
}

describe('replaceRichTextNodePlainText symbol separators', () => {
  it('keeps translated ampersand separators outside adjacent rich text marks', () => {
    const result = replaceRichTextNodePlainText(adjacentMarkedDoc(), 'Visit & Again');

    expect(result?.content?.[0]?.content).toEqual([
      { type: 'text', text: 'Visit', marks: [{ type: 'bold' }] },
      { type: 'text', text: ' & ' },
      { type: 'text', text: 'Again', marks: [{ type: 'italic' }] },
    ]);
  });

  it('does not treat compact single-letter ampersand abbreviations as separator boundaries', () => {
    const result = replaceRichTextNodePlainText(adjacentMarkedDoc(), 'R&D');

    expect(result?.content?.[0]?.content).not.toContainEqual({ type: 'text', text: '&' });
  });

  it('does not treat compact single-letter plus abbreviations as separator boundaries', () => {
    const result = replaceRichTextNodePlainText(adjacentMarkedDoc(), 'R+D');

    expect(result?.content?.[0]?.content).not.toContainEqual({ type: 'text', text: '+' });
  });

  it('keeps translated compact cross separators outside adjacent rich text marks', () => {
    const result = replaceRichTextNodePlainText(adjacentMarkedDoc(), 'Visit×Again');

    expect(result?.content?.[0]?.content).toEqual([
      { type: 'text', text: 'Visit', marks: [{ type: 'bold' }] },
      { type: 'text', text: '×' },
      { type: 'text', text: 'Again', marks: [{ type: 'italic' }] },
    ]);
  });

  it('does not treat compact single-letter cross abbreviations as separator boundaries', () => {
    const result = replaceRichTextNodePlainText(adjacentMarkedDoc(), 'R×D');

    expect(result?.content?.[0]?.content).not.toContainEqual({ type: 'text', text: '×' });
  });
});

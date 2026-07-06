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

describe('replaceRichTextNodePlainText smart quotes', () => {
  it('keeps translated curly quotes outside adjacent rich text marks', () => {
    const result = replaceRichTextNodePlainText(adjacentMarkedDoc(), '“Visit Again”');

    expect(result?.content?.[0]?.content).toEqual([
      { type: 'text', text: '“' },
      { type: 'text', text: 'Visit', marks: [{ type: 'bold' }] },
      { type: 'text', text: ' ' },
      { type: 'text', text: 'Again', marks: [{ type: 'italic' }] },
      { type: 'text', text: '”' },
    ]);
  });
});

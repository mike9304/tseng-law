import { describe, expect, it } from 'vitest';
import { BUILDER_RICH_TEXT_FORMAT, type BuilderRichText } from '@/lib/builder/rich-text/types';
import { summarizeRichTextReview } from '../TranslationEditorRichTextReview';

function nestedMixedRichText(): BuilderRichText {
  return {
    format: BUILDER_RICH_TEXT_FORMAT,
    plainText: '첫째\n둘째\n하위',
    doc: {
      type: 'doc',
      content: [
        {
          type: 'orderedList',
          attrs: { start: 3 },
          content: [
            {
              type: 'listItem',
              content: [
                {
                  type: 'paragraph',
                  content: [{ type: 'text', text: '첫째', marks: [{ type: 'bold' }] }],
                },
              ],
            },
            {
              type: 'listItem',
              content: [
                {
                  type: 'paragraph',
                  content: [
                    { type: 'text', text: '둘째', marks: [{ type: 'italic' }] },
                    {
                      type: 'text',
                      text: ' 링크',
                      marks: [{ type: 'link', attrs: { href: 'https://example.com' } }],
                    },
                  ],
                },
                {
                  type: 'bulletList',
                  content: [
                    {
                      type: 'listItem',
                      content: [
                        {
                          type: 'paragraph',
                          content: [{ type: 'text', text: '하위', marks: [{ type: 'underline' }] }],
                        },
                      ],
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
    },
  };
}

describe('summarizeRichTextReview', () => {
  it('counts mixed marks, links, and nested list depth for editor review', () => {
    const summary = summarizeRichTextReview(nestedMixedRichText());

    expect(summary).toEqual({
      blockCount: 8,
      hardBreakCount: 0,
      linkCount: 1,
      listCount: 2,
      markedRunCount: 4,
      maxListDepth: 2,
      signals: ['bold', 'italic', 'underline', 'link', 'orderedList', 'bulletList'],
      textRunCount: 4,
    });
  });
});

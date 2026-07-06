import { BUILDER_RICH_TEXT_FORMAT, type BuilderRichText } from '@/lib/builder/rich-text/types';

export function nestedMarkedRunListRichText(): BuilderRichText {
  return {
    format: BUILDER_RICH_TEXT_FORMAT,
    plainText: '첫째\n방문하기',
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
                  type: 'bulletList',
                  content: [
                    {
                      type: 'listItem',
                      content: [
                        {
                          type: 'paragraph',
                          content: [
                            {
                              type: 'text',
                              text: '방문',
                              marks: [
                                {
                                  type: 'link',
                                  attrs: { href: 'https://example.com', target: '_blank' },
                                },
                              ],
                            },
                            { type: 'text', text: '하기', marks: [{ type: 'underline' }] },
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
      ],
    },
  };
}

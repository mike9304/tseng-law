import { BUILDER_RICH_TEXT_FORMAT, type BuilderRichText } from '@/lib/builder/rich-text/types';

export function linkedHyphenUnderlineRichText(): BuilderRichText {
  return {
    format: BUILDER_RICH_TEXT_FORMAT,
    plainText: '방문-하기',
    doc: {
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
    },
  };
}

export function linkedSplitSlashUnderlineRichText(): BuilderRichText {
  return {
    format: BUILDER_RICH_TEXT_FORMAT,
    plainText: '방문 / 하기',
    doc: {
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
            { type: 'text', text: ' ' },
            { type: 'text', text: '/' },
            { type: 'text', text: ' ' },
            { type: 'text', text: '하기', marks: [{ type: 'underline' }] },
          ],
        },
      ],
    },
  };
}

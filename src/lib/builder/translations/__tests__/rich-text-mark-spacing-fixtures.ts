import type { SafeTipTapNode } from '@/lib/builder/rich-text/sanitize';
import { BUILDER_RICH_TEXT_FORMAT, type BuilderRichText } from '@/lib/builder/rich-text/types';

type VisitAgainRichTextContentOptions = {
  readonly before?: string;
  readonly between?: string;
  readonly after?: string;
};

export function linkedUnderlineRichTextFixture(): BuilderRichText {
  return {
    format: BUILDER_RICH_TEXT_FORMAT,
    plainText: '방문하기',
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
            { type: 'text', text: '하기', marks: [{ type: 'underline' }] },
          ],
        },
      ],
    },
  };
}

export function linkedSplitSeparatorUnderlineRichTextFixture(): BuilderRichText {
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

export function linkedCompactSeparatorUnderlineRichTextFixture(): BuilderRichText {
  return {
    format: BUILDER_RICH_TEXT_FORMAT,
    plainText: '방문/하기',
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
            { type: 'text', text: '/' },
            { type: 'text', text: '하기', marks: [{ type: 'underline' }] },
          ],
        },
      ],
    },
  };
}

export function visitAgainRichTextContent(
  options: VisitAgainRichTextContentOptions = {},
): readonly SafeTipTapNode[] {
  const content: SafeTipTapNode[] = [];
  const { before, between = ' ', after } = options;

  if (before) content.push({ type: 'text', text: before });
  content.push({
    type: 'text',
    text: 'Visit',
    marks: [{ type: 'link', attrs: { href: 'https://example.com', target: '_blank' } }],
  });
  content.push({ type: 'text', text: between });
  content.push({ type: 'text', text: 'Again', marks: [{ type: 'underline' }] });
  if (after) content.push({ type: 'text', text: after });

  return [{ type: 'paragraph', content }];
}

export function visitSplitSlashAgainRichTextContent(): readonly SafeTipTapNode[] {
  return [
    {
      type: 'paragraph',
      content: [
        {
          type: 'text',
          text: 'Visit',
          marks: [{ type: 'link', attrs: { href: 'https://example.com', target: '_blank' } }],
        },
        { type: 'text', text: ' ' },
        { type: 'text', text: '/' },
        { type: 'text', text: ' ' },
        { type: 'text', text: 'Again', marks: [{ type: 'underline' }] },
      ],
    },
  ];
}

export function visitCompactSlashAgainRichTextContent(): readonly SafeTipTapNode[] {
  return [
    {
      type: 'paragraph',
      content: [
        {
          type: 'text',
          text: 'Visit',
          marks: [{ type: 'link', attrs: { href: 'https://example.com', target: '_blank' } }],
        },
        { type: 'text', text: '/' },
        { type: 'text', text: 'Again', marks: [{ type: 'underline' }] },
      ],
    },
  ];
}

export function shortCompactSlashRichTextContent(): readonly SafeTipTapNode[] {
  return [
    {
      type: 'paragraph',
      content: [
        {
          type: 'text',
          text: 'A',
          marks: [{ type: 'link', attrs: { href: 'https://example.com', target: '_blank' } }],
        },
        { type: 'text', text: '/' },
        { type: 'text', text: 'B', marks: [{ type: 'underline' }] },
      ],
    },
  ];
}

import {
  createDefaultCanvasNodeStyle,
  type BuilderCanvasDocument,
  type BuilderTextCanvasNode,
} from '@/lib/builder/canvas/types';
import { BUILDER_RICH_TEXT_FORMAT, type BuilderRichText } from '@/lib/builder/rich-text/types';
import {
  createDefaultSiteDocument,
  type BuilderSiteDocument,
} from '@/lib/builder/site/types';

function markedParagraph(text: string, mark: 'bold' | 'italic' | 'underline') {
  return {
    type: 'paragraph',
    content: [{ type: 'text', text, marks: [{ type: mark }] }],
  };
}

export function seedBlockRichTextSite(): BuilderSiteDocument {
  const site = createDefaultSiteDocument('ko', 'rich-text-block-site');
  const now = '2026-06-20T00:00:00.000Z';
  site.pages = [
    {
      pageId: 'page-about-ko',
      slug: 'about',
      title: { ko: '소개', 'zh-hant': '關於', en: 'About' },
      locale: 'ko',
      createdAt: now,
      updatedAt: now,
    },
    {
      pageId: 'page-about-en',
      slug: 'about',
      title: { ko: '소개', 'zh-hant': '關於', en: 'About' },
      locale: 'en',
      createdAt: now,
      updatedAt: now,
    },
  ];
  return site;
}

export function blockRichTextFixture(firstBlock: string, secondBlock: string): BuilderRichText {
  return {
    format: BUILDER_RICH_TEXT_FORMAT,
    plainText: `${firstBlock}\n${secondBlock}`,
    doc: {
      type: 'doc',
      content: [
        {
          type: 'paragraph',
          content: [{ type: 'text', text: firstBlock, marks: [{ type: 'bold' }] }],
        },
        {
          type: 'paragraph',
          content: [{ type: 'text', text: secondBlock, marks: [{ type: 'italic' }] }],
        },
      ],
    },
  };
}

export function mixedBlockRichTextFixture(): BuilderRichText {
  return {
    format: BUILDER_RICH_TEXT_FORMAT,
    plainText: '안녕세계\n방문하기',
    doc: {
      type: 'doc',
      content: [
        {
          type: 'paragraph',
          content: [
            { type: 'text', text: '안녕', marks: [{ type: 'bold' }] },
            { type: 'text', text: '세계', marks: [{ type: 'italic' }] },
          ],
        },
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

export function emptyBlockRichTextFixture(): BuilderRichText {
  return {
    format: BUILDER_RICH_TEXT_FORMAT,
    plainText: '안녕\n\n세계',
    doc: {
      type: 'doc',
      content: [
        {
          type: 'paragraph',
          content: [{ type: 'text', text: '안녕', marks: [{ type: 'bold' }] }],
        },
        { type: 'paragraph' },
        {
          type: 'paragraph',
          content: [{ type: 'text', text: '세계', marks: [{ type: 'italic' }] }],
        },
      ],
    },
  };
}

export function mixedHardBreakBlockRichTextFixture(): BuilderRichText {
  return {
    format: BUILDER_RICH_TEXT_FORMAT,
    plainText: '안녕\n세계\n방문',
    doc: {
      type: 'doc',
      content: [
        {
          type: 'paragraph',
          content: [
            { type: 'text', text: '안녕', marks: [{ type: 'bold' }] },
            { type: 'hardBreak' },
            { type: 'text', text: '세계', marks: [{ type: 'italic' }] },
          ],
        },
        {
          type: 'paragraph',
          content: [{ type: 'text', text: '방문', marks: [{ type: 'underline' }] }],
        },
      ],
    },
  };
}

export function listRichTextFixture(): BuilderRichText {
  return {
    format: BUILDER_RICH_TEXT_FORMAT,
    plainText: '안녕\n세계',
    doc: {
      type: 'doc',
      content: [
        {
          type: 'bulletList',
          content: [
            {
              type: 'listItem',
              content: [markedParagraph('안녕', 'bold')],
            },
            {
              type: 'listItem',
              content: [markedParagraph('세계', 'italic')],
            },
          ],
        },
      ],
    },
  };
}

export function nestedOrderedListRichTextFixture(): BuilderRichText {
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
              content: [markedParagraph('첫째', 'bold')],
            },
            {
              type: 'listItem',
              content: [
                markedParagraph('둘째', 'italic'),
                {
                  type: 'bulletList',
                  content: [
                    {
                      type: 'listItem',
                      content: [markedParagraph('하위', 'underline')],
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

export function textNodeFixture(text: string, richText?: BuilderRichText): BuilderTextCanvasNode {
  return {
    id: 'headline-block',
    kind: 'text',
    rect: { x: 0, y: 0, width: 360, height: 140 },
    style: createDefaultCanvasNodeStyle(),
    zIndex: 0,
    rotation: 0,
    locked: false,
    visible: true,
    content: {
      text,
      ...(richText ? { richText } : {}),
      fontSize: 28,
      color: '#111827',
      fontWeight: 'bold',
      align: 'left',
      lineHeight: 1.25,
      letterSpacing: 0,
    },
  };
}

export function seedCanvas(locale: 'ko' | 'en', node: BuilderTextCanvasNode): BuilderCanvasDocument {
  return {
    version: 1,
    locale,
    updatedAt: '2026-06-20T00:00:00.000Z',
    updatedBy: 'builder-test',
    stageWidth: 1280,
    stageHeight: 880,
    nodes: [node],
  };
}

import {
  createDefaultCanvasNodeStyle,
  type BuilderCanvasDocument,
  type BuilderTextCanvasNode,
} from '@/lib/builder/canvas/types';
import { BUILDER_RICH_TEXT_FORMAT, type BuilderRichText } from '@/lib/builder/rich-text/types';

function markedParagraph(text: string, mark: 'bold' | 'italic' | 'underline') {
  return {
    type: 'paragraph',
    content: [{ type: 'text', text, marks: [{ type: mark }] }],
  };
}

export const SITE_ID = 'default';
export const SOURCE_LOCALE = 'ko';
export const TARGET_LOCALE = 'en';

export type TestLocale = typeof SOURCE_LOCALE | typeof TARGET_LOCALE;

export function inlineRichText(firstRun: string, secondRun: string): BuilderRichText {
  return {
    format: BUILDER_RICH_TEXT_FORMAT,
    plainText: `${firstRun}${secondRun}`,
    doc: {
      type: 'doc',
      content: [
        {
          type: 'paragraph',
          content: [
            { type: 'text', text: firstRun, marks: [{ type: 'bold' }] },
            { type: 'text', text: secondRun, marks: [{ type: 'italic' }] },
          ],
        },
      ],
    },
  };
}

export function blockRichText(firstBlock: string, secondBlock: string): BuilderRichText {
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

export function mixedBlockRichText(): BuilderRichText {
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

export function emptyBlockRichText(): BuilderRichText {
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

export function mixedHardBreakBlockRichText(): BuilderRichText {
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

export function listRichText(): BuilderRichText {
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

export function nestedOrderedListRichText(): BuilderRichText {
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

export function translationDocument(options: {
  readonly token: string;
  readonly locale: TestLocale;
  readonly nodeId: string;
  readonly text: string;
  readonly richText?: BuilderRichText;
}): BuilderCanvasDocument {
  const now = new Date().toISOString();
  const node: BuilderTextCanvasNode = {
    id: options.nodeId,
    kind: 'text',
    rect: { x: 96, y: 88, width: 560, height: 132 },
    style: createDefaultCanvasNodeStyle(),
    zIndex: 1,
    rotation: 0,
    locked: false,
    visible: true,
    content: {
      text: options.text,
      ...(options.richText ? { richText: options.richText } : {}),
      fontSize: 32,
      color: '#0f172a',
      fontWeight: 'bold',
      align: 'left',
      lineHeight: 1.2,
      letterSpacing: 0,
      fontFamily: 'system-ui',
      verticalAlign: 'top',
      textTransform: 'none',
      as: 'h2',
    },
  };

  return {
    version: 1,
    locale: options.locale,
    updatedAt: now,
    updatedBy: `translation-rich-text-${options.token}`,
    stageWidth: 1280,
    stageHeight: 760,
    nodes: [node],
  };
}

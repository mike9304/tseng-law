import { describe, expect, it } from 'vitest';
import {
  createDefaultCanvasNodeStyle,
  type BuilderCanvasDocument,
  type BuilderTextCanvasNode,
} from '@/lib/builder/canvas/types';
import { BUILDER_RICH_TEXT_FORMAT, type BuilderRichText } from '@/lib/builder/rich-text/types';
import { extractTranslatableNodes } from '@/lib/builder/translations/auto-translate';

function mixedRichText(): BuilderRichText {
  return {
    format: BUILDER_RICH_TEXT_FORMAT,
    plainText: '안녕세계\n방문',
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
          ],
        },
      ],
    },
  };
}

function richTextCanvas(richText: BuilderRichText): BuilderCanvasDocument {
  const node: BuilderTextCanvasNode = {
    id: 'rich-source',
    kind: 'text',
    rect: { x: 96, y: 80, width: 560, height: 132 },
    style: createDefaultCanvasNodeStyle(),
    zIndex: 1,
    rotation: 0,
    locked: false,
    visible: true,
    content: {
      text: richText.plainText,
      richText,
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
    locale: 'ko',
    updatedAt: '2026-06-20T00:00:00.000Z',
    updatedBy: 'translation-rich-text-review-test',
    stageWidth: 1280,
    stageHeight: 760,
    nodes: [node],
  };
}

describe('extractTranslatableNodes rich text metadata', () => {
  it('preserves source rich-text metadata for editor review when text nodes carry formatted content', () => {
    const richText = mixedRichText();
    const sources = extractTranslatableNodes(richTextCanvas(richText));

    expect(sources).toHaveLength(1);
    const source = sources[0];
    if (!source) throw new Error('Expected one translation source');
    expect(source.text).toBe(richText.plainText);
    expect(source.richText).toEqual(richText);
  });
});

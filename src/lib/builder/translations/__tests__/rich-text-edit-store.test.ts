import { beforeEach, describe, expect, it, vi } from 'vitest';
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
import { sanitizeTipTapDoc } from '@/lib/builder/rich-text/sanitize';
import {
  readPageCanvas,
  readSiteDocument,
  writePageCanvas,
  writeSiteDocument,
} from '@/lib/builder/site/persistence';
import { applyTranslationToLocaleDraft } from '@/lib/builder/translations/edit-store';

vi.mock('@/lib/builder/site/persistence', () => ({
  readSiteDocument: vi.fn(),
  writeSiteDocument: vi.fn(),
  readPageCanvas: vi.fn(),
  writePageCanvas: vi.fn(),
}));

const mockedReadSiteDocument = vi.mocked(readSiteDocument);
const mockedReadPageCanvas = vi.mocked(readPageCanvas);
const mockedWritePageCanvas = vi.mocked(writePageCanvas);
const mockedWriteSiteDocument = vi.mocked(writeSiteDocument);

function seedSite(): BuilderSiteDocument {
  const site = createDefaultSiteDocument('ko', 'rich-text-edit-site');
  const now = '2026-06-19T00:00:00.000Z';
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

function richTextFixture(firstLine: string, secondLine: string): BuilderRichText {
  const inlineContent = [
    ...(firstLine ? [{ type: 'text', text: firstLine, marks: [{ type: 'bold' }] }] : []),
    { type: 'hardBreak' },
    ...(secondLine ? [{ type: 'text', text: secondLine, marks: [{ type: 'italic' }] }] : []),
  ];

  return {
    format: BUILDER_RICH_TEXT_FORMAT,
    plainText: `${firstLine}\n${secondLine}`,
    doc: {
      type: 'doc',
      content: [
        {
          type: 'paragraph',
          content: inlineContent,
        },
      ],
    },
  };
}

function inlineRichTextFixture(firstRun: string, secondRun: string): BuilderRichText {
  return {
    format: BUILDER_RICH_TEXT_FORMAT,
    plainText: `${firstRun}${secondRun}`,
    doc: {
      type: 'doc',
      content: [
        {
          type: 'paragraph',
          content: [
            ...(firstRun ? [{ type: 'text', text: firstRun, marks: [{ type: 'bold' }] }] : []),
            ...(secondRun ? [{ type: 'text', text: secondRun, marks: [{ type: 'italic' }] }] : []),
          ],
        },
      ],
    },
  };
}

function textNodeFixture(firstLine: string, secondLine: string): BuilderTextCanvasNode {
  return {
    id: 'headline-rich',
    kind: 'text',
    rect: { x: 0, y: 0, width: 360, height: 120 },
    style: createDefaultCanvasNodeStyle(),
    zIndex: 0,
    rotation: 0,
    locked: false,
    visible: true,
    content: {
      text: `${firstLine}\n${secondLine}`,
      richText: richTextFixture(firstLine, secondLine),
      fontSize: 28,
      color: '#111827',
      fontWeight: 'bold',
      align: 'left',
      lineHeight: 1.25,
      letterSpacing: 0,
    },
  };
}

function inlineTextNodeFixture(firstRun: string, secondRun: string): BuilderTextCanvasNode {
  return {
    ...textNodeFixture('', ''),
    content: {
      ...textNodeFixture('', '').content,
      text: `${firstRun}${secondRun}`,
      richText: inlineRichTextFixture(firstRun, secondRun),
    },
  };
}

function seedCanvas(firstLine: string, secondLine: string): BuilderCanvasDocument {
  return {
    version: 1,
    locale: 'ko',
    updatedAt: '2026-06-19T00:00:00.000Z',
    updatedBy: 'builder-test',
    stageWidth: 1280,
    stageHeight: 880,
    nodes: [textNodeFixture(firstLine, secondLine)],
  };
}

function seedInlineCanvas(firstRun: string, secondRun: string): BuilderCanvasDocument {
  return {
    ...seedCanvas('', ''),
    nodes: [inlineTextNodeFixture(firstRun, secondRun)],
  };
}

describe('applyTranslationToLocaleDraft rich text patches', () => {
  let site: BuilderSiteDocument;
  let writtenCanvas: BuilderCanvasDocument | null;

  beforeEach(() => {
    site = seedSite();
    writtenCanvas = null;
    mockedReadSiteDocument.mockImplementation(async () => site);
    mockedReadPageCanvas.mockImplementation(async (_siteId, pageId) => {
      if (pageId === 'page-about-ko') return seedCanvas('안녕', '세계');
      if (pageId === 'page-about-en') return seedCanvas('', '');
      return null;
    });
    mockedWriteSiteDocument.mockImplementation(async (nextSite) => {
      site = nextSite;
    });
    mockedWritePageCanvas.mockImplementation(async (_siteId, _pageId, _variant, canvas) => {
      writtenCanvas = canvas;
    });
  });

  it('updates rich-text plain text and preserves inline marks when text translation changes', async () => {
    const result = await applyTranslationToLocaleDraft(
      'rich-text-edit-site',
      'ko',
      'en',
      'page-about-ko',
      { 'headline-rich': { text: 'Hello\nWorld' } },
    );

    expect(result.ok).toBe(true);
    const node = writtenCanvas?.nodes.find((candidate) => candidate.id === 'headline-rich');
    expect(node?.kind).toBe('text');
    if (node?.kind !== 'text') throw new Error('translated text node was not written');

    expect(node.content.text).toBe('Hello\nWorld');
    expect(node.content.richText?.plainText).toBe('Hello\nWorld');
    const richTextDoc = sanitizeTipTapDoc(node.content.richText?.doc);
    expect(richTextDoc?.content?.[0]?.content).toEqual([
      { type: 'text', text: 'Hello', marks: [{ type: 'bold' }] },
      { type: 'hardBreak' },
      { type: 'text', text: 'World', marks: [{ type: 'italic' }] },
    ]);
  });

  it('preserves adjacent inline marks when one-line translation changes text length', async () => {
    mockedReadPageCanvas.mockImplementation(async (_siteId, pageId) => {
      if (pageId === 'page-about-ko') return seedInlineCanvas('안녕', '세계');
      if (pageId === 'page-about-en') return seedInlineCanvas('', '');
      return null;
    });

    const result = await applyTranslationToLocaleDraft(
      'rich-text-edit-site',
      'ko',
      'en',
      'page-about-ko',
      { 'headline-rich': { text: 'HelloWorld' } },
    );

    expect(result.ok).toBe(true);
    const node = writtenCanvas?.nodes.find((candidate) => candidate.id === 'headline-rich');
    expect(node?.kind).toBe('text');
    if (node?.kind !== 'text') throw new Error('translated inline text node was not written');

    expect(node.content.text).toBe('HelloWorld');
    expect(node.content.richText?.plainText).toBe('HelloWorld');
    const richTextDoc = sanitizeTipTapDoc(node.content.richText?.doc);
    expect(richTextDoc?.content?.[0]?.content).toEqual([
      { type: 'text', text: 'Hello', marks: [{ type: 'bold' }] },
      { type: 'text', text: 'World', marks: [{ type: 'italic' }] },
    ]);
  });
});

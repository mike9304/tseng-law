import { beforeEach, describe, expect, it, vi } from 'vitest';
import { sanitizeTipTapDoc } from '@/lib/builder/rich-text/sanitize';
import type { BuilderCanvasDocument } from '@/lib/builder/canvas/types';
import {
  readPageCanvas,
  readSiteDocument,
  writePageCanvas,
  writeSiteDocument,
} from '@/lib/builder/site/persistence';
import type { BuilderSiteDocument } from '@/lib/builder/site/types';
import { applyTranslationToLocaleDraft } from '@/lib/builder/translations/edit-store';
import {
  blockRichTextFixture,
  emptyBlockRichTextFixture,
  mixedHardBreakBlockRichTextFixture,
  mixedBlockRichTextFixture,
  seedBlockRichTextSite,
  seedCanvas,
  textNodeFixture,
} from './rich-text-block-test-fixtures';

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

describe('applyTranslationToLocaleDraft block rich text patches', () => {
  let site: BuilderSiteDocument;
  let writtenCanvas: BuilderCanvasDocument | null;

  beforeEach(() => {
    site = seedBlockRichTextSite();
    writtenCanvas = null;
    mockedReadSiteDocument.mockImplementation(async () => site);
    mockedReadPageCanvas.mockImplementation(async (_siteId, pageId) => {
      if (pageId === 'page-about-ko') {
        return seedCanvas(
          'ko',
          textNodeFixture('안녕\n세계', blockRichTextFixture('안녕', '세계')),
        );
      }
      if (pageId === 'page-about-en') return seedCanvas('en', textNodeFixture(''));
      return null;
    });
    mockedWriteSiteDocument.mockImplementation(async (nextSite) => {
      site = nextSite;
    });
    mockedWritePageCanvas.mockImplementation(async (_siteId, _pageId, _variant, canvas) => {
      writtenCanvas = canvas;
    });
  });

  it('preserves separate marked paragraph blocks when translation changes text', async () => {
    const result = await applyTranslationToLocaleDraft(
      'rich-text-block-site',
      'ko',
      'en',
      'page-about-ko',
      { 'headline-block': { text: 'Hello\nWorld' } },
    );

    expect(result.ok).toBe(true);
    const node = writtenCanvas?.nodes.find((candidate) => candidate.id === 'headline-block');
    expect(node?.kind).toBe('text');
    if (node?.kind !== 'text') throw new Error('translated block text node was not written');

    expect(node.content.text).toBe('Hello\nWorld');
    expect(node.content.richText?.plainText).toBe('Hello\nWorld');
    const richTextDoc = sanitizeTipTapDoc(node.content.richText?.doc);
    expect(richTextDoc?.content).toEqual([
      {
        type: 'paragraph',
        content: [{ type: 'text', text: 'Hello', marks: [{ type: 'bold' }] }],
      },
      {
        type: 'paragraph',
        content: [{ type: 'text', text: 'World', marks: [{ type: 'italic' }] }],
      },
    ]);
  });

  it('preserves multiple marked text runs inside separate paragraph blocks', async () => {
    mockedReadPageCanvas.mockImplementation(async (_siteId, pageId) => {
      if (pageId === 'page-about-ko') {
        return seedCanvas(
          'ko',
          textNodeFixture('안녕세계\n방문하기', mixedBlockRichTextFixture()),
        );
      }
      if (pageId === 'page-about-en') return seedCanvas('en', textNodeFixture(''));
      return null;
    });

    const result = await applyTranslationToLocaleDraft(
      'rich-text-block-site',
      'ko',
      'en',
      'page-about-ko',
      { 'headline-block': { text: 'HelloWorld\nVisitAgain' } },
    );

    expect(result.ok).toBe(true);
    const node = writtenCanvas?.nodes.find((candidate) => candidate.id === 'headline-block');
    expect(node?.kind).toBe('text');
    if (node?.kind !== 'text') throw new Error('translated mixed block text node was not written');

    expect(node.content.text).toBe('HelloWorld\nVisitAgain');
    expect(node.content.richText?.plainText).toBe('HelloWorld\nVisitAgain');
    const richTextDoc = sanitizeTipTapDoc(node.content.richText?.doc);
    expect(richTextDoc?.content).toEqual([
      {
        type: 'paragraph',
        content: [
          { type: 'text', text: 'Hello', marks: [{ type: 'bold' }] },
          { type: 'text', text: 'World', marks: [{ type: 'italic' }] },
        ],
      },
      {
        type: 'paragraph',
        content: [
          {
            type: 'text',
            text: 'Visit',
            marks: [{ type: 'link', attrs: { href: 'https://example.com', target: '_blank' } }],
          },
          { type: 'text', text: 'Again', marks: [{ type: 'underline' }] },
        ],
      },
    ]);
  });

  it('preserves empty paragraph blocks between translated marked blocks', async () => {
    mockedReadPageCanvas.mockImplementation(async (_siteId, pageId) => {
      if (pageId === 'page-about-ko') {
        return seedCanvas('ko', textNodeFixture('안녕\n\n세계', emptyBlockRichTextFixture()));
      }
      if (pageId === 'page-about-en') return seedCanvas('en', textNodeFixture(''));
      return null;
    });

    const result = await applyTranslationToLocaleDraft(
      'rich-text-block-site',
      'ko',
      'en',
      'page-about-ko',
      { 'headline-block': { text: 'Hello\n\nWorld' } },
    );

    expect(result.ok).toBe(true);
    const node = writtenCanvas?.nodes.find((candidate) => candidate.id === 'headline-block');
    expect(node?.kind).toBe('text');
    if (node?.kind !== 'text') throw new Error('translated empty block text node was not written');

    expect(node.content.text).toBe('Hello\n\nWorld');
    expect(node.content.richText?.plainText).toBe('Hello\n\nWorld');
    const richTextDoc = sanitizeTipTapDoc(node.content.richText?.doc);
    expect(richTextDoc?.content).toEqual([
      {
        type: 'paragraph',
        content: [{ type: 'text', text: 'Hello', marks: [{ type: 'bold' }] }],
      },
      { type: 'paragraph' },
      {
        type: 'paragraph',
        content: [{ type: 'text', text: 'World', marks: [{ type: 'italic' }] }],
      },
    ]);
  });

  it('preserves hard breaks and following paragraph blocks together', async () => {
    mockedReadPageCanvas.mockImplementation(async (_siteId, pageId) => {
      if (pageId === 'page-about-ko') {
        return seedCanvas(
          'ko',
          textNodeFixture('안녕\n세계\n방문', mixedHardBreakBlockRichTextFixture()),
        );
      }
      if (pageId === 'page-about-en') return seedCanvas('en', textNodeFixture(''));
      return null;
    });

    const result = await applyTranslationToLocaleDraft(
      'rich-text-block-site',
      'ko',
      'en',
      'page-about-ko',
      { 'headline-block': { text: 'Hello\nWorld\nVisit' } },
    );

    expect(result.ok).toBe(true);
    const node = writtenCanvas?.nodes.find((candidate) => candidate.id === 'headline-block');
    expect(node?.kind).toBe('text');
    if (node?.kind !== 'text') throw new Error('translated hard-break block text node was not written');

    expect(node.content.text).toBe('Hello\nWorld\nVisit');
    expect(node.content.richText?.plainText).toBe('Hello\nWorld\nVisit');
    const richTextDoc = sanitizeTipTapDoc(node.content.richText?.doc);
    expect(richTextDoc?.content).toEqual([
      {
        type: 'paragraph',
        content: [
          { type: 'text', text: 'Hello', marks: [{ type: 'bold' }] },
          { type: 'hardBreak' },
          { type: 'text', text: 'World', marks: [{ type: 'italic' }] },
        ],
      },
      {
        type: 'paragraph',
        content: [{ type: 'text', text: 'Visit', marks: [{ type: 'underline' }] }],
      },
    ]);
  });

});

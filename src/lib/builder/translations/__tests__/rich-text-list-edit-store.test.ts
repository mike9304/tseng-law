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
  listRichTextFixture,
  nestedOrderedListRichTextFixture,
  seedBlockRichTextSite,
  seedCanvas,
  textNodeFixture,
} from './rich-text-block-test-fixtures';
import { nestedMarkedRunListRichTextFixture } from './rich-text-nested-marked-run-fixtures';

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

describe('applyTranslationToLocaleDraft list rich text patches', () => {
  let site: BuilderSiteDocument;
  let writtenCanvas: BuilderCanvasDocument | null;

  beforeEach(() => {
    site = seedBlockRichTextSite();
    writtenCanvas = null;
    mockedReadSiteDocument.mockImplementation(async () => site);
    mockedReadPageCanvas.mockImplementation(async (_siteId, pageId) => {
      if (pageId === 'page-about-ko') {
        return seedCanvas('ko', textNodeFixture('안녕\n세계', listRichTextFixture()));
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

  it('preserves marked bullet list item blocks', async () => {
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
    if (node?.kind !== 'text') throw new Error('translated list text node was not written');

    expect(node.content.text).toBe('Hello\nWorld');
    expect(node.content.richText?.plainText).toBe('Hello\nWorld');
    const richTextDoc = sanitizeTipTapDoc(node.content.richText?.doc);
    expect(richTextDoc?.content).toEqual([
      {
        type: 'bulletList',
        content: [
          {
            type: 'listItem',
            content: [
              {
                type: 'paragraph',
                content: [{ type: 'text', text: 'Hello', marks: [{ type: 'bold' }] }],
              },
            ],
          },
          {
            type: 'listItem',
            content: [
              {
                type: 'paragraph',
                content: [{ type: 'text', text: 'World', marks: [{ type: 'italic' }] }],
              },
            ],
          },
        ],
      },
    ]);
  });

  it('preserves ordered list attrs and nested list item blocks', async () => {
    mockedReadPageCanvas.mockImplementation(async (_siteId, pageId) => {
      if (pageId === 'page-about-ko') {
        return seedCanvas('ko', textNodeFixture('첫째\n둘째\n하위', nestedOrderedListRichTextFixture()));
      }
      if (pageId === 'page-about-en') return seedCanvas('en', textNodeFixture(''));
      return null;
    });

    const result = await applyTranslationToLocaleDraft(
      'rich-text-block-site',
      'ko',
      'en',
      'page-about-ko',
      { 'headline-block': { text: 'First\nSecond\nNested' } },
    );

    expect(result.ok).toBe(true);
    const node = writtenCanvas?.nodes.find((candidate) => candidate.id === 'headline-block');
    expect(node?.kind).toBe('text');
    if (node?.kind !== 'text') throw new Error('translated nested list text node was not written');

    expect(node.content.text).toBe('First\nSecond\nNested');
    expect(node.content.richText?.plainText).toBe('First\nSecond\nNested');
    const richTextDoc = sanitizeTipTapDoc(node.content.richText?.doc);
    expect(richTextDoc?.content).toEqual([
      {
        type: 'orderedList',
        attrs: { start: 3 },
        content: [
          {
            type: 'listItem',
            content: [
              {
                type: 'paragraph',
                content: [{ type: 'text', text: 'First', marks: [{ type: 'bold' }] }],
              },
            ],
          },
          {
            type: 'listItem',
            content: [
              {
                type: 'paragraph',
                content: [{ type: 'text', text: 'Second', marks: [{ type: 'italic' }] }],
              },
              {
                type: 'bulletList',
                content: [
                  {
                    type: 'listItem',
                    content: [
                      {
                        type: 'paragraph',
                        content: [{ type: 'text', text: 'Nested', marks: [{ type: 'underline' }] }],
                      },
                    ],
                  },
                ],
              },
            ],
          },
        ],
      },
    ]);
  });

  it('keeps compact slash separators outside adjacent marks inside nested list items', async () => {
    mockedReadPageCanvas.mockImplementation(async (_siteId, pageId) => {
      if (pageId === 'page-about-ko') {
        return seedCanvas(
          'ko',
          textNodeFixture('첫째\n방문하기', nestedMarkedRunListRichTextFixture()),
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
      { 'headline-block': { text: 'First\nVisit/Again' } },
    );

    expect(result.ok).toBe(true);
    const node = writtenCanvas?.nodes.find((candidate) => candidate.id === 'headline-block');
    expect(node?.kind).toBe('text');
    if (node?.kind !== 'text') throw new Error('translated nested marked list node was not written');

    expect(node.content.text).toBe('First\nVisit/Again');
    expect(node.content.richText?.plainText).toBe('First\nVisit/Again');
    const richTextDoc = sanitizeTipTapDoc(node.content.richText?.doc);
    expect(richTextDoc?.content).toEqual([
      {
        type: 'orderedList',
        attrs: { start: 3 },
        content: [
          {
            type: 'listItem',
            content: [
              {
                type: 'paragraph',
                content: [{ type: 'text', text: 'First', marks: [{ type: 'bold' }] }],
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
                            text: 'Visit',
                            marks: [
                              {
                                type: 'link',
                                attrs: { href: 'https://example.com', target: '_blank' },
                              },
                            ],
                          },
                          { type: 'text', text: '/' },
                          { type: 'text', text: 'Again', marks: [{ type: 'underline' }] },
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
    ]);
  });
});

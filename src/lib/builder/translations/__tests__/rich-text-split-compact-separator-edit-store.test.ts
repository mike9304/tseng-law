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
  seedBlockRichTextSite,
  seedCanvas,
  textNodeFixture,
} from './rich-text-block-test-fixtures';
import {
  linkedSplitSeparatorUnderlineRichTextFixture,
  shortCompactSlashRichTextContent,
  visitCompactSlashAgainRichTextContent,
} from './rich-text-mark-spacing-fixtures';

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

describe('applyTranslationToLocaleDraft split source compact separator rich text boundaries', () => {
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
          textNodeFixture('방문 / 하기', linkedSplitSeparatorUnderlineRichTextFixture()),
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

  it('collapses split source separator runs when the target uses compact separators', async () => {
    const result = await applyTranslationToLocaleDraft(
      'rich-text-block-site',
      'ko',
      'en',
      'page-about-ko',
      { 'headline-block': { text: 'Visit/Again' } },
    );

    expect(result.ok).toBe(true);
    const node = writtenCanvas?.nodes.find((candidate) => candidate.id === 'headline-block');
    expect(node?.kind).toBe('text');
    if (node?.kind !== 'text') throw new Error('translated compact split separator text node was not written');

    expect(node.content.text).toBe('Visit/Again');
    expect(node.content.richText?.plainText).toBe('Visit/Again');
    const richTextDoc = sanitizeTipTapDoc(node.content.richText?.doc);
    expect(richTextDoc?.content).toEqual(visitCompactSlashAgainRichTextContent());
  });

  it('collapses split source separators when the compact target is shorter than the source text nodes', async () => {
    const result = await applyTranslationToLocaleDraft(
      'rich-text-block-site',
      'ko',
      'en',
      'page-about-ko',
      { 'headline-block': { text: 'A/B' } },
    );

    expect(result.ok).toBe(true);
    const node = writtenCanvas?.nodes.find((candidate) => candidate.id === 'headline-block');
    expect(node?.kind).toBe('text');
    if (node?.kind !== 'text') throw new Error('translated short compact separator text node was not written');

    expect(node.content.text).toBe('A/B');
    expect(node.content.richText?.plainText).toBe('A/B');
    const richTextDoc = sanitizeTipTapDoc(node.content.richText?.doc);
    expect(richTextDoc?.content).toEqual(shortCompactSlashRichTextContent());
  });
});

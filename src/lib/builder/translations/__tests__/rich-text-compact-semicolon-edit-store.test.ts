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
  linkedUnderlineRichTextFixture,
  visitAgainRichTextContent,
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

describe('applyTranslationToLocaleDraft compact semicolon rich text mark boundaries', () => {
  let site: BuilderSiteDocument;
  let writtenCanvas: BuilderCanvasDocument | null;

  beforeEach(() => {
    site = seedBlockRichTextSite();
    writtenCanvas = null;
    mockedReadSiteDocument.mockImplementation(async () => site);
    mockedReadPageCanvas.mockImplementation(async (_siteId, pageId) => {
      if (pageId === 'page-about-ko') {
        return seedCanvas('ko', textNodeFixture('방문하기', linkedUnderlineRichTextFixture()));
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

  it('keeps compact semicolon separators outside adjacent link and underline marks', async () => {
    const result = await applyTranslationToLocaleDraft(
      'rich-text-block-site',
      'ko',
      'en',
      'page-about-ko',
      { 'headline-block': { text: 'Visit;Again' } },
    );

    expect(result.ok).toBe(true);
    const node = writtenCanvas?.nodes.find((candidate) => candidate.id === 'headline-block');
    expect(node?.kind).toBe('text');
    if (node?.kind !== 'text') throw new Error('translated compact semicolon text node was not written');

    expect(node.content.text).toBe('Visit;Again');
    expect(node.content.richText?.plainText).toBe('Visit;Again');
    const richTextDoc = sanitizeTipTapDoc(node.content.richText?.doc);
    expect(richTextDoc?.content).toEqual(visitAgainRichTextContent({ between: ';' }));
  });
});

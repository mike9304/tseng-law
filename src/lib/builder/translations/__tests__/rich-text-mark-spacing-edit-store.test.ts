import { beforeEach, describe, expect, it, vi } from 'vitest';
import { sanitizeTipTapDoc, type SafeTipTapNode } from '@/lib/builder/rich-text/sanitize';
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
  linkedCompactSeparatorUnderlineRichTextFixture,
  linkedSplitSeparatorUnderlineRichTextFixture,
  linkedUnderlineRichTextFixture,
  visitAgainRichTextContent,
  visitCompactSlashAgainRichTextContent,
  visitSplitSlashAgainRichTextContent,
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

function expectWrittenRichTextContent(
  writtenCanvas: BuilderCanvasDocument | null,
  expectedText: string,
  expectedContent: readonly SafeTipTapNode[],
  errorMessage: string,
): void {
  const node = writtenCanvas?.nodes.find((candidate) => candidate.id === 'headline-block');
  expect(node?.kind).toBe('text');
  if (node?.kind !== 'text') throw new Error(errorMessage);

  expect(node.content.text).toBe(expectedText);
  expect(node.content.richText?.plainText).toBe(expectedText);
  const richTextDoc = sanitizeTipTapDoc(node.content.richText?.doc);
  expect(richTextDoc?.content).toEqual(expectedContent);
}

describe('applyTranslationToLocaleDraft rich text mark spacing', () => {
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

  it('keeps inserted word spacing outside adjacent link and underline marks', async () => {
    const result = await applyTranslationToLocaleDraft(
      'rich-text-block-site',
      'ko',
      'en',
      'page-about-ko',
      { 'headline-block': { text: 'Visit Again' } },
    );

    expect(result.ok).toBe(true);
    expectWrittenRichTextContent(
      writtenCanvas,
      'Visit Again',
      visitAgainRichTextContent(),
      'translated mark spacing text node was not written',
    );
  });

  it('keeps inserted punctuation separators outside adjacent link and underline marks', async () => {
    const result = await applyTranslationToLocaleDraft(
      'rich-text-block-site',
      'ko',
      'en',
      'page-about-ko',
      { 'headline-block': { text: 'Visit, Again' } },
    );

    expect(result.ok).toBe(true);
    expectWrittenRichTextContent(
      writtenCanvas,
      'Visit, Again',
      visitAgainRichTextContent({ between: ', ' }),
      'translated punctuation spacing node was not written',
    );
  });

  it('keeps split source separator nodes outside adjacent rich text marks', async () => {
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

    const result = await applyTranslationToLocaleDraft(
      'rich-text-block-site',
      'ko',
      'en',
      'page-about-ko',
      { 'headline-block': { text: 'Visit / Again' } },
    );

    expect(result.ok).toBe(true);
    expectWrittenRichTextContent(
      writtenCanvas,
      'Visit / Again',
      visitSplitSlashAgainRichTextContent(),
      'translated split source separator nodes were not written',
    );
  });

  it('keeps compact source separator nodes outside adjacent rich text marks', async () => {
    mockedReadPageCanvas.mockImplementation(async (_siteId, pageId) => {
      if (pageId === 'page-about-ko') {
        return seedCanvas(
          'ko',
          textNodeFixture('방문/하기', linkedCompactSeparatorUnderlineRichTextFixture()),
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
      { 'headline-block': { text: 'Visit/Again' } },
    );

    expect(result.ok).toBe(true);
    expectWrittenRichTextContent(
      writtenCanvas,
      'Visit/Again',
      visitCompactSlashAgainRichTextContent(),
      'translated compact source separator node was not written',
    );
  });

  it('keeps trailing punctuation outside the final adjacent rich text mark', async () => {
    const result = await applyTranslationToLocaleDraft(
      'rich-text-block-site',
      'ko',
      'en',
      'page-about-ko',
      { 'headline-block': { text: 'Visit Again.' } },
    );

    expect(result.ok).toBe(true);
    expectWrittenRichTextContent(
      writtenCanvas,
      'Visit Again.',
      visitAgainRichTextContent({ after: '.' }),
      'translated trailing punctuation node was not written',
    );
  });

  it('keeps paired punctuation outside adjacent rich text marks', async () => {
    const result = await applyTranslationToLocaleDraft(
      'rich-text-block-site',
      'ko',
      'en',
      'page-about-ko',
      { 'headline-block': { text: '(Visit Again)' } },
    );

    expect(result.ok).toBe(true);
    expectWrittenRichTextContent(
      writtenCanvas,
      '(Visit Again)',
      visitAgainRichTextContent({ before: '(', after: ')' }),
      'translated paired punctuation node was not written',
    );
  });

  it('keeps square bracket punctuation outside adjacent rich text marks', async () => {
    const result = await applyTranslationToLocaleDraft(
      'rich-text-block-site',
      'ko',
      'en',
      'page-about-ko',
      { 'headline-block': { text: '[Visit Again]' } },
    );

    expect(result.ok).toBe(true);
    expectWrittenRichTextContent(
      writtenCanvas,
      '[Visit Again]',
      visitAgainRichTextContent({ before: '[', after: ']' }),
      'translated square bracket punctuation node was not written',
    );
  });

  it('keeps curly brace punctuation outside adjacent rich text marks', async () => {
    const result = await applyTranslationToLocaleDraft(
      'rich-text-block-site',
      'ko',
      'en',
      'page-about-ko',
      { 'headline-block': { text: '{Visit Again}' } },
    );

    expect(result.ok).toBe(true);
    expectWrittenRichTextContent(
      writtenCanvas,
      '{Visit Again}',
      visitAgainRichTextContent({ before: '{', after: '}' }),
      'translated curly brace punctuation node was not written',
    );
  });

  it('keeps double quote punctuation outside adjacent rich text marks', async () => {
    const result = await applyTranslationToLocaleDraft(
      'rich-text-block-site',
      'ko',
      'en',
      'page-about-ko',
      { 'headline-block': { text: '"Visit Again"' } },
    );

    expect(result.ok).toBe(true);
    expectWrittenRichTextContent(
      writtenCanvas,
      '"Visit Again"',
      visitAgainRichTextContent({ before: '"', after: '"' }),
      'translated quoted punctuation node was not written',
    );
  });
});

import { NextRequest } from 'next/server';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { sanitizeTipTapDoc, type SafeTipTapNode } from '@/lib/builder/rich-text/sanitize';
import type { BuilderCanvasDocument } from '@/lib/builder/canvas/types';
import { guardMutation } from '@/lib/builder/security/guard';
import {
  readPageCanvas,
  readSiteDocument,
  writePageCanvas,
  writeSiteDocument,
} from '@/lib/builder/site/persistence';
import type { BuilderSiteDocument } from '@/lib/builder/site/types';
import {
  seedBlockRichTextSite,
  seedCanvas,
  textNodeFixture,
} from '@/lib/builder/translations/__tests__/rich-text-block-test-fixtures';
import {
  linkedCompactSeparatorUnderlineRichTextFixture,
  linkedSplitSeparatorUnderlineRichTextFixture,
  linkedUnderlineRichTextFixture,
  visitAgainRichTextContent,
  visitCompactSlashAgainRichTextContent,
  visitSplitSlashAgainRichTextContent,
} from '@/lib/builder/translations/__tests__/rich-text-mark-spacing-fixtures';
import { POST } from '../route';

vi.mock('@/lib/builder/security/guard', () => ({
  guardMutation: vi.fn(async () => ({ username: 'translator@example.test' })),
}));

vi.mock('@/lib/builder/site/persistence', () => ({
  readSiteDocument: vi.fn(),
  writeSiteDocument: vi.fn(),
  readPageCanvas: vi.fn(),
  writePageCanvas: vi.fn(),
}));

const guardMutationMock = vi.mocked(guardMutation);
const mockedReadSiteDocument = vi.mocked(readSiteDocument);
const mockedReadPageCanvas = vi.mocked(readPageCanvas);
const mockedWritePageCanvas = vi.mocked(writePageCanvas);
const mockedWriteSiteDocument = vi.mocked(writeSiteDocument);

type EditRouteResult = {
  readonly status: number;
  readonly data: unknown;
};

function request(body: unknown): NextRequest {
  return new NextRequest('https://law.example.test/api/builder/translations/edit', {
    method: 'POST',
    body: JSON.stringify(body),
  });
}

function expectSuccessfulSingleNodeUpdate(data: unknown): void {
  expect(data).toEqual({
    ok: true,
    nodeUpdates: {
      appliedCount: 1,
      skipped: [],
      targetPageId: 'page-about-en',
    },
    seoApplied: false,
    imageOverrides: null,
  });
}

async function postHeadlineTranslation(text: string): Promise<EditRouteResult> {
  const response = await POST(request({
    siteId: 'rich-text-block-site',
    pageId: 'page-about-ko',
    sourceLocale: 'ko',
    targetLocale: 'en',
    nodeUpdates: {
      'headline-block': { text },
    },
  }));

  return { status: response.status, data: await response.json() };
}

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
  const richTextDoc = sanitizeTipTapDoc(node.content.richText?.doc);
  expect(richTextDoc?.content).toEqual(expectedContent);
}

describe('builder translations edit API rich text integration', () => {
  let site: BuilderSiteDocument;
  let writtenCanvas: BuilderCanvasDocument | null;

  beforeEach(() => {
    vi.clearAllMocks();
    site = seedBlockRichTextSite();
    writtenCanvas = null;
    guardMutationMock.mockResolvedValue({ username: 'translator@example.test' });
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

  it('saves translated spacing outside adjacent rich text marks through the edit endpoint', async () => {
    const result = await postHeadlineTranslation('Visit Again');

    expect(result.status).toBe(200);
    expectSuccessfulSingleNodeUpdate(result.data);
    expectWrittenRichTextContent(
      writtenCanvas,
      'Visit Again',
      visitAgainRichTextContent(),
      'translated route text node was not written',
    );
  });

  it('saves translated punctuation separators outside adjacent rich text marks through the edit endpoint', async () => {
    const result = await postHeadlineTranslation('Visit, Again');

    expect(result.status).toBe(200);
    expectSuccessfulSingleNodeUpdate(result.data);
    expectWrittenRichTextContent(
      writtenCanvas,
      'Visit, Again',
      visitAgainRichTextContent({ between: ', ' }),
      'translated route punctuation node was not written',
    );
  });

  it('saves split source separator nodes outside adjacent rich text marks', async () => {
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

    const result = await postHeadlineTranslation('Visit / Again');

    expect(result.status).toBe(200);
    expectSuccessfulSingleNodeUpdate(result.data);
    expectWrittenRichTextContent(
      writtenCanvas,
      'Visit / Again',
      visitSplitSlashAgainRichTextContent(),
      'translated route split source separator nodes were not written',
    );
  });

  it('saves compact source separator nodes outside adjacent rich text marks', async () => {
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

    const result = await postHeadlineTranslation('Visit/Again');

    expect(result.status).toBe(200);
    expectSuccessfulSingleNodeUpdate(result.data);
    expectWrittenRichTextContent(
      writtenCanvas,
      'Visit/Again',
      visitCompactSlashAgainRichTextContent(),
      'translated route compact source separator node was not written',
    );
  });

  it('saves translated trailing punctuation outside the final adjacent rich text mark', async () => {
    const result = await postHeadlineTranslation('Visit Again.');

    expect(result.status).toBe(200);
    expectSuccessfulSingleNodeUpdate(result.data);
    expectWrittenRichTextContent(
      writtenCanvas,
      'Visit Again.',
      visitAgainRichTextContent({ after: '.' }),
      'translated route trailing punctuation node was not written',
    );
  });

  it('saves translated paired punctuation outside adjacent rich text marks', async () => {
    const result = await postHeadlineTranslation('(Visit Again)');

    expect(result.status).toBe(200);
    expectSuccessfulSingleNodeUpdate(result.data);
    expectWrittenRichTextContent(
      writtenCanvas,
      '(Visit Again)',
      visitAgainRichTextContent({ before: '(', after: ')' }),
      'translated route paired punctuation node was not written',
    );
  });

  it('saves translated square bracket punctuation outside adjacent rich text marks', async () => {
    const result = await postHeadlineTranslation('[Visit Again]');

    expect(result.status).toBe(200);
    expectSuccessfulSingleNodeUpdate(result.data);
    expectWrittenRichTextContent(
      writtenCanvas,
      '[Visit Again]',
      visitAgainRichTextContent({ before: '[', after: ']' }),
      'translated route square bracket punctuation node was not written',
    );
  });

  it('saves translated curly brace punctuation outside adjacent rich text marks', async () => {
    const result = await postHeadlineTranslation('{Visit Again}');

    expect(result.status).toBe(200);
    expectSuccessfulSingleNodeUpdate(result.data);
    expectWrittenRichTextContent(
      writtenCanvas,
      '{Visit Again}',
      visitAgainRichTextContent({ before: '{', after: '}' }),
      'translated route curly brace punctuation node was not written',
    );
  });

  it('saves translated double quote punctuation outside adjacent rich text marks', async () => {
    const result = await postHeadlineTranslation('"Visit Again"');

    expect(result.status).toBe(200);
    expectSuccessfulSingleNodeUpdate(result.data);
    expectWrittenRichTextContent(
      writtenCanvas,
      '"Visit Again"',
      visitAgainRichTextContent({ before: '"', after: '"' }),
      'translated route quoted punctuation node was not written',
    );
  });
});

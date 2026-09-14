import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import type { Locale } from '@/lib/locales';
import { DEFAULT_BUILDER_SITE_ID } from '@/lib/builder/constants';
import type { BuilderCanvasDocument } from '@/lib/builder/canvas/types';
import type {
  BuilderLightbox,
  BuilderPageMeta,
  BuilderSiteDocument,
  BuilderTheme,
} from '@/lib/builder/site/types';
import { readBuilderPageSnapshot } from '@/lib/builder/persistence';
import {
  readFooterCanvas,
  readHeaderCanvas,
  readLightboxCanvas,
  readSiteDocument,
} from '@/lib/builder/site/persistence';
import { findPageMetaForLocaleWithDynamicContext } from '@/lib/builder/site/page-resolution';
import { readPublishedPageCanvas } from '@/lib/builder/site/published-canvas';
import { resolvePublishedSitePage } from '@/lib/builder/site/public-page';

vi.mock('next/navigation', () => ({
  usePathname: () => '/ko/contact',
  useRouter: () => ({ replace: vi.fn() }),
  useSearchParams: () => new URLSearchParams(),
}));

vi.mock('@/lib/builder/components/registry', () => ({
  getComponent: vi.fn(),
}));

vi.mock('@/lib/builder/site/persistence', () => ({
  readFooterCanvas: vi.fn(),
  readHeaderCanvas: vi.fn(),
  readLightboxCanvas: vi.fn(),
  readSiteDocument: vi.fn(),
}));

vi.mock('@/lib/builder/persistence', () => ({
  readBuilderPageSnapshot: vi.fn(),
}));

vi.mock('@/lib/builder/site/published-canvas', () => ({
  readPublishedPageCanvas: vi.fn(),
}));

vi.mock('@/lib/builder/site/page-resolution', () => ({
  findPageMetaForLocaleWithDynamicContext: vi.fn(),
}));

vi.mock('@/lib/builder/datasets', () => ({
  createDefaultBuilderPageDatasets: vi.fn(() => ({})),
  readBuilderPageDatasetOverviews: vi.fn(() => []),
}));

vi.mock('@/lib/consultation/columns-blob-reader', () => ({
  getAllColumnPostsIncludingBlob: vi.fn(async () => []),
}));

vi.mock('@/lib/columns', () => ({
  getAllColumnPosts: vi.fn(() => []),
}));

vi.mock('@/lib/builder/faq/faq-engine', () => ({
  listFaqCategories: vi.fn(() => []),
  listFaqItems: vi.fn(async () => []),
  faqItemsToSchemaItems: vi.fn(() => []),
}));

vi.mock('@/lib/builder/site/published-dynamic-item-seo', () => ({
  isPublishedDynamicItemRecordRoutable: vi.fn(() => true),
  resolvePublishedDynamicItemRecordJsonLd: vi.fn(),
  resolvePublishedDynamicItemRecordSeo: vi.fn(),
}));

const mockedReadSiteDocument = vi.mocked(readSiteDocument);
const mockedReadLightboxCanvas = vi.mocked(readLightboxCanvas);
const mockedReadHeaderCanvas = vi.mocked(readHeaderCanvas);
const mockedReadFooterCanvas = vi.mocked(readFooterCanvas);
const mockedReadPublishedPageCanvas = vi.mocked(readPublishedPageCanvas);
const mockedReadBuilderPageSnapshot = vi.mocked(readBuilderPageSnapshot);
const mockedFindPageMeta = vi.mocked(findPageMetaForLocaleWithDynamicContext);

const PAGE_TITLE = {
  ko: '홈',
  en: 'Home',
  ja: 'ホーム',
  'zh-hant': '首頁',
} as Record<Locale, string>;

const TEST_THEME = {
  colors: {
    primary: '#111827',
    secondary: '#334155',
    accent: '#2563eb',
    background: '#ffffff',
    text: '#0f172a',
    muted: '#64748b',
  },
  fonts: {
    heading: 'system-ui, sans-serif',
    body: 'system-ui, sans-serif',
  },
} as BuilderTheme;

interface Deferred<T> {
  promise: Promise<T>;
  resolve: (value: T) => void;
  reject: (reason?: unknown) => void;
  settled: boolean;
}

function createDeferred<T>(): Deferred<T> {
  let resolvePromise: (value: T) => void = () => undefined;
  let rejectPromise: (reason?: unknown) => void = () => undefined;
  const promise = new Promise<T>((resolve, reject) => {
    resolvePromise = resolve;
    rejectPromise = reject;
  });
  const deferred: Deferred<T> = {
    promise,
    settled: false,
    resolve: (value) => {
      if (deferred.settled) return;
      deferred.settled = true;
      resolvePromise(value);
    },
    reject: (reason) => {
      if (deferred.settled) return;
      deferred.settled = true;
      rejectPromise(reason);
    },
  };
  void promise.catch(() => undefined);
  return deferred;
}

const trackedDeferreds: Deferred<BuilderCanvasDocument | null>[] = [];

async function flushMicrotasks(): Promise<void> {
  for (let i = 0; i < 16; i += 1) {
    await Promise.resolve();
  }
}

function canvasNode(id: string): BuilderCanvasDocument['nodes'][number] {
  return { id } as BuilderCanvasDocument['nodes'][number];
}

function pageCanvas(): BuilderCanvasDocument {
  return {
    version: 1,
    locale: 'ko',
    updatedAt: '2026-07-01T00:00:00.000Z',
    updatedBy: 'page',
    stageWidth: 1280,
    stageHeight: 720,
    nodes: [canvasNode('root')],
  };
}

function lightboxCanvas(updatedBy: string): BuilderCanvasDocument {
  return {
    version: 1,
    locale: 'ko',
    updatedAt: '2026-07-01T00:00:00.000Z',
    updatedBy,
    stageWidth: 400,
    stageHeight: 300,
    nodes: [canvasNode(`${updatedBy}-node`)],
  };
}

function publishedPage(overrides: Partial<BuilderPageMeta> = {}): BuilderPageMeta {
  return {
    pageId: 'home',
    slug: '',
    title: PAGE_TITLE,
    locale: 'ko',
    createdAt: '2026-07-01T00:00:00.000Z',
    updatedAt: '2026-07-01T00:00:00.000Z',
    publishedAt: '2026-07-01T00:00:00.000Z',
    isHomePage: true,
    ...overrides,
  };
}

function lightboxMeta(id: string, locale: Locale = 'ko'): BuilderLightbox {
  return {
    id,
    name: id,
    slug: id,
    locale,
    sizeMode: 'auto',
    closeOnOutsideClick: true,
    closeOnEsc: true,
    dismissable: true,
    backdropOpacity: 60,
    createdAt: '2026-07-01T00:00:00.000Z',
    updatedAt: '2026-07-01T00:00:00.000Z',
  };
}

function siteDocument(overrides: Partial<BuilderSiteDocument> = {}): BuilderSiteDocument {
  return {
    version: 1,
    siteId: DEFAULT_BUILDER_SITE_ID,
    name: 'Test Site',
    locale: 'ko',
    navigation: [],
    theme: TEST_THEME,
    pages: [publishedPage()],
    createdAt: '2026-07-01T00:00:00.000Z',
    updatedAt: '2026-07-01T00:00:00.000Z',
    ...overrides,
  };
}

function stubPageMatch(page: BuilderPageMeta): void {
  mockedFindPageMeta.mockReturnValue({ page });
}

function lightboxCallIds(): string[] {
  return mockedReadLightboxCanvas.mock.calls.map((call) => String(call[1]));
}

function deferLightboxReads(ids: string[]): {
  deferreds: Deferred<BuilderCanvasDocument | null>[];
  inflight: { current: number; max: number };
} {
  const deferreds = ids.map(() => {
    const deferred = createDeferred<BuilderCanvasDocument | null>();
    trackedDeferreds.push(deferred);
    return deferred;
  });
  const inflight = { current: 0, max: 0 };
  mockedReadLightboxCanvas.mockImplementation((_siteId: string, lightboxId: string) => {
    const index = ids.indexOf(lightboxId);
    if (index < 0) {
      return Promise.reject(new Error(`unexpected lightbox id ${lightboxId}`));
    }
    inflight.current += 1;
    inflight.max = Math.max(inflight.max, inflight.current);
    return deferreds[index].promise.finally(() => {
      inflight.current -= 1;
    });
  });
  return { deferreds, inflight };
}

beforeEach(() => {
  mockedReadSiteDocument.mockReset();
  mockedReadLightboxCanvas.mockReset();
  mockedReadHeaderCanvas.mockReset();
  mockedReadFooterCanvas.mockReset();
  mockedReadPublishedPageCanvas.mockReset();
  mockedReadBuilderPageSnapshot.mockReset();
  mockedFindPageMeta.mockReset();

  stubPageMatch(publishedPage());
  mockedReadSiteDocument.mockResolvedValue(siteDocument());
  mockedReadPublishedPageCanvas.mockResolvedValue(pageCanvas());
  mockedReadHeaderCanvas.mockResolvedValue(null);
  mockedReadFooterCanvas.mockResolvedValue(null);
  mockedReadBuilderPageSnapshot.mockRejectedValue(new Error('fixture home snapshot unavailable'));
  mockedReadLightboxCanvas.mockResolvedValue(null);
});

afterEach(async () => {
  for (const deferred of trackedDeferreds) {
    deferred.resolve(null);
  }
  trackedDeferreds.length = 0;
  await flushMicrotasks();
});

describe('resolvePublishedSitePage lightbox concurrency', () => {
  it('reads the first four matching lightboxes together, keeps at most four in flight, and preserves input order when later reads finish first', async () => {
    const ids = ['lb-1', 'lb-2', 'lb-3', 'lb-4', 'lb-5', 'lb-6'];
    mockedReadSiteDocument.mockResolvedValue(siteDocument({
      lightboxes: ids.map((id) => lightboxMeta(id)),
    }));
    const { deferreds, inflight } = deferLightboxReads(ids);
    const pending = resolvePublishedSitePage('ko', '');

    await flushMicrotasks();
    expect(lightboxCallIds()).toEqual(['lb-1', 'lb-2', 'lb-3', 'lb-4']);
    expect(inflight.current).toBe(4);
    expect(inflight.max).toBe(4);

    deferreds[3].resolve(lightboxCanvas('c4'));
    deferreds[2].resolve(lightboxCanvas('c3'));
    deferreds[1].resolve(lightboxCanvas('c2'));
    deferreds[0].resolve(lightboxCanvas('c1'));
    await flushMicrotasks();

    expect(lightboxCallIds()).toEqual(['lb-1', 'lb-2', 'lb-3', 'lb-4', 'lb-5', 'lb-6']);
    expect(inflight.max).toBe(4);
    expect(mockedReadLightboxCanvas.mock.calls.every((call) => call[0] === DEFAULT_BUILDER_SITE_ID)).toBe(true);

    deferreds[5].resolve(null);
    deferreds[4].resolve(lightboxCanvas('c5'));
    const resolved = await pending;

    expect(resolved).not.toBeNull();
    expect(resolved?.lightboxes.map((entry) => entry.meta.id)).toEqual(['lb-1', 'lb-2', 'lb-3', 'lb-4', 'lb-5']);
    expect(resolved?.lightboxes.map((entry) => entry.canvas.updatedBy)).toEqual(['c1', 'c2', 'c3', 'c4', 'c5']);
    expect(inflight.max).toBe(4);
  });

  it('never reads lightboxes whose locale does not match the request', async () => {
    mockedReadSiteDocument.mockResolvedValue(siteDocument({
      lightboxes: [
        lightboxMeta('ko-1', 'ko'),
        lightboxMeta('en-1', 'en'),
        lightboxMeta('zh-1', 'zh-hant'),
        lightboxMeta('ko-2', 'ko'),
      ],
    }));
    mockedReadLightboxCanvas.mockImplementation(async (_siteId: string, lightboxId: string) => (
      lightboxCanvas(lightboxId)
    ));

    const resolved = await resolvePublishedSitePage('ko', '');

    expect(lightboxCallIds()).toEqual(['ko-1', 'ko-2']);
    expect(resolved?.lightboxes.map((entry) => entry.meta.id)).toEqual(['ko-1', 'ko-2']);
  });

  it('propagates a lightbox read rejection and does not start the next batch', async () => {
    const ids = ['lb-1', 'lb-2', 'lb-3', 'lb-4', 'lb-5'];
    mockedReadSiteDocument.mockResolvedValue(siteDocument({
      lightboxes: ids.map((id) => lightboxMeta(id)),
    }));
    const { deferreds } = deferLightboxReads(ids);
    const failure = new Error('lightbox-failed');
    const pending = resolvePublishedSitePage('ko', '');
    const rejected = expect(pending).rejects.toBe(failure);
    void rejected.catch(() => undefined);

    await flushMicrotasks();
    expect(lightboxCallIds()).toEqual(['lb-1', 'lb-2', 'lb-3', 'lb-4']);

    deferreds[1].reject(failure);
    await rejected;
    await flushMicrotasks();

    expect(lightboxCallIds()).toEqual(['lb-1', 'lb-2', 'lb-3', 'lb-4']);
    expect(mockedReadHeaderCanvas).not.toHaveBeenCalled();
    expect(mockedReadFooterCanvas).not.toHaveBeenCalled();
    expect(mockedReadBuilderPageSnapshot).not.toHaveBeenCalled();
  });

  it.each([
    { name: 'omits lightbox reads when the site has none', lightboxes: undefined },
    { name: 'omits lightbox reads when the lightbox list is empty', lightboxes: [] as BuilderLightbox[] },
  ])('$name', async ({ lightboxes }) => {
    mockedReadSiteDocument.mockResolvedValue(siteDocument({ lightboxes }));

    const resolved = await resolvePublishedSitePage('ko', '');

    expect(resolved).not.toBeNull();
    expect(resolved?.lightboxes).toEqual([]);
    expect(mockedReadLightboxCanvas).not.toHaveBeenCalled();
    expect(mockedReadHeaderCanvas).toHaveBeenCalledTimes(1);
    expect(mockedReadFooterCanvas).toHaveBeenCalledTimes(1);
  });

  it('reads a single matching lightbox once and does not pad the batch', async () => {
    mockedReadSiteDocument.mockResolvedValue(siteDocument({
      lightboxes: [lightboxMeta('lb-only')],
    }));
    mockedReadLightboxCanvas.mockResolvedValue(lightboxCanvas('only'));

    const resolved = await resolvePublishedSitePage('ko', '');

    expect(lightboxCallIds()).toEqual(['lb-only']);
    expect(mockedReadLightboxCanvas).toHaveBeenCalledTimes(1);
    expect(resolved?.lightboxes).toHaveLength(1);
    expect(resolved?.lightboxes[0]?.meta.id).toBe('lb-only');
  });

  it.each([
    {
      name: 'unpublished pages',
      locale: 'ko' as Locale,
      page: publishedPage({ publishedAt: undefined }),
    },
    {
      name: 'english fallback documents',
      locale: 'en' as Locale,
      page: publishedPage({ locale: 'ko' }),
    },
  ])('returns null for $name without canvas, lightbox, or global reads', async ({ locale, page }) => {
    stubPageMatch(page);
    mockedReadSiteDocument.mockResolvedValue(siteDocument({
      pages: [page],
      lightboxes: [lightboxMeta('lb-1')],
    }));

    await expect(resolvePublishedSitePage(locale, '')).resolves.toBeNull();

    expect(mockedReadSiteDocument).toHaveBeenCalledTimes(1);
    expect(mockedReadPublishedPageCanvas).not.toHaveBeenCalled();
    expect(mockedReadLightboxCanvas).not.toHaveBeenCalled();
    expect(mockedReadHeaderCanvas).not.toHaveBeenCalled();
    expect(mockedReadFooterCanvas).not.toHaveBeenCalled();
    expect(mockedReadBuilderPageSnapshot).not.toHaveBeenCalled();
  });

  it.each([
    { name: 'a null page canvas', canvas: null },
    { name: 'an empty page canvas', canvas: { ...pageCanvas(), nodes: [] } },
  ])('returns null for $name without lightbox or global reads', async ({ canvas }) => {
    mockedReadSiteDocument.mockResolvedValue(siteDocument({
      lightboxes: [lightboxMeta('lb-1')],
    }));
    mockedReadPublishedPageCanvas.mockResolvedValue(canvas);

    await expect(resolvePublishedSitePage('ko', '')).resolves.toBeNull();

    expect(mockedReadPublishedPageCanvas).toHaveBeenCalledTimes(1);
    expect(mockedReadLightboxCanvas).not.toHaveBeenCalled();
    expect(mockedReadHeaderCanvas).not.toHaveBeenCalled();
    expect(mockedReadFooterCanvas).not.toHaveBeenCalled();
    expect(mockedReadBuilderPageSnapshot).not.toHaveBeenCalled();
  });
});

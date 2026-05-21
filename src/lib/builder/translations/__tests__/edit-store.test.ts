import { beforeEach, describe, expect, it, vi } from 'vitest';
import {
  createDefaultSiteDocument,
  type BuilderSiteDocument,
} from '@/lib/builder/site/types';
import type { BuilderCanvasDocument } from '@/lib/builder/canvas/types';
import {
  readPageCanvas,
  readSiteDocument,
  writePageCanvas,
  writeSiteDocument,
} from '@/lib/builder/site/persistence';
import {
  applyTranslationToLocaleDraft,
  findTargetPageMeta,
  setNodeContentString,
  setPageLocaleSeoOverride,
} from '@/lib/builder/translations/edit-store';

vi.mock('@/lib/builder/site/persistence', () => ({
  readSiteDocument: vi.fn(),
  writeSiteDocument: vi.fn(),
  readPageCanvas: vi.fn(),
  writePageCanvas: vi.fn(),
}));

const mockedReadSiteDocument = vi.mocked(readSiteDocument);
const mockedWriteSiteDocument = vi.mocked(writeSiteDocument);
const mockedReadPageCanvas = vi.mocked(readPageCanvas);
const mockedWritePageCanvas = vi.mocked(writePageCanvas);

function seedSite(): BuilderSiteDocument {
  const site = createDefaultSiteDocument('ko', 'edit-store-site');
  const now = '2026-05-20T00:00:00.000Z';
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

function seedDraftCanvas(): BuilderCanvasDocument {
  return {
    version: 1,
    locale: 'ko',
    updatedAt: '2026-05-20T00:00:00.000Z',
    updatedBy: 'sandbox-builder',
    stageWidth: 1280,
    stageHeight: 880,
    nodes: [
      {
        id: 'headline-1',
        kind: 'text',
        rect: { x: 0, y: 0, width: 200, height: 60 },
        style: {} as never,
        zIndex: 0,
        rotation: 0,
        locked: false,
        visible: true,
        content: {
          text: '안녕하세요',
          fontSize: 24,
          color: '#000',
          fontWeight: 'bold',
          align: 'left',
          lineHeight: 1.25,
          letterSpacing: 0,
        } as never,
      },
      {
        id: 'cta-1',
        kind: 'button',
        rect: { x: 0, y: 0, width: 200, height: 40 },
        style: {} as never,
        zIndex: 1,
        rotation: 0,
        locked: false,
        visible: true,
        content: {
          label: '문의하기',
          href: '/contact',
          style: 'primary',
        } as never,
      },
    ] as never,
  };
}

describe('setNodeContentString', () => {
  it('sets a top-level content.* string', () => {
    const node = {
      id: 'n',
      kind: 'text',
      content: { text: 'old', link: { title: 'old-title' } },
    } as never;
    expect(setNodeContentString(node, 'content.text', 'new')).toBe(true);
    expect((node as { content: { text: string } }).content.text).toBe('new');
  });

  it('refuses paths outside content.*', () => {
    const node = { id: 'n', kind: 'text', content: { text: 'old' } } as never;
    expect(setNodeContentString(node, 'style.color', 'red')).toBe(false);
  });

  it('walks array indices', () => {
    const node = {
      id: 'n',
      kind: 'columnList',
      content: { items: [{ title: 'a' }, { title: 'b' }] },
    } as never;
    expect(setNodeContentString(node, 'content.items.1.title', 'c')).toBe(true);
    expect(
      (node as { content: { items: Array<{ title: string }> } }).content.items[1].title,
    ).toBe('c');
  });
});

describe('findTargetPageMeta', () => {
  it('resolves via slug+locale fallback', () => {
    const site = seedSite();
    const target = findTargetPageMeta(site, 'page-about-ko', 'en');
    expect(target?.pageId).toBe('page-about-en');
  });

  it('honours linkedPageIds over slug match', () => {
    const site = seedSite();
    site.pages.push({
      pageId: 'page-about-en-v2',
      slug: 'about-v2',
      title: { ko: '소개', 'zh-hant': '關於', en: 'About v2' },
      locale: 'en',
      createdAt: '2026-05-20T00:00:00.000Z',
      updatedAt: '2026-05-20T00:00:00.000Z',
    });
    const ko = site.pages.find((page) => page.pageId === 'page-about-ko');
    if (!ko) throw new Error('seed');
    ko.linkedPageIds = { en: 'page-about-en-v2' };
    const target = findTargetPageMeta(site, 'page-about-ko', 'en');
    expect(target?.pageId).toBe('page-about-en-v2');
  });

  it('returns null when no target exists', () => {
    const site = seedSite();
    const target = findTargetPageMeta(site, 'page-about-ko', 'zh-hant');
    expect(target).toBeNull();
  });
});

describe('applyTranslationToLocaleDraft', () => {
  let site: BuilderSiteDocument;
  let written: { canvas: BuilderCanvasDocument | null; site: BuilderSiteDocument | null };

  beforeEach(() => {
    site = seedSite();
    written = { canvas: null, site: null };
    mockedReadSiteDocument.mockImplementation(async () => site);
    mockedWriteSiteDocument.mockImplementation(async (next) => {
      written.site = next;
      site = next;
    });
    mockedReadPageCanvas.mockImplementation(async (_siteId, pageId) => {
      if (pageId === 'page-about-en' || pageId === 'page-about-ko') {
        return seedDraftCanvas();
      }
      return null;
    });
    mockedWritePageCanvas.mockImplementation(async (_siteId, _pageId, _variant, doc) => {
      written.canvas = doc;
    });
  });

  it('refuses same-locale updates', async () => {
    const result = await applyTranslationToLocaleDraft(
      'edit-store-site',
      'ko',
      'ko',
      'page-about-ko',
      { 'headline-1': { text: 'x' } },
    );
    expect(result.ok).toBe(false);
    expect(result.skipped[0].reason).toBe('sourceLocale_eq_targetLocale');
  });

  it('skips when target page does not exist', async () => {
    const result = await applyTranslationToLocaleDraft(
      'edit-store-site',
      'ko',
      'zh-hant',
      'page-about-ko',
      { 'headline-1': { text: 'x' } },
    );
    expect(result.ok).toBe(false);
    expect(result.skipped[0].reason).toBe('target_page_not_found');
  });

  it('writes patched canvas to the target draft', async () => {
    const result = await applyTranslationToLocaleDraft(
      'edit-store-site',
      'ko',
      'en',
      'page-about-ko',
      {
        'headline-1': { text: 'Hello' },
        'cta-1': { text: 'Contact us' },
      },
    );
    expect(result.ok).toBe(true);
    expect(result.appliedCount).toBe(2);
    expect(result.targetPageId).toBe('page-about-en');
    const node0 = written.canvas?.nodes[0] as { content: { text: string } };
    const node1 = written.canvas?.nodes[1] as { content: { label: string } };
    expect(node0.content.text).toBe('Hello');
    expect(node1.content.label).toBe('Contact us');
    expect(written.canvas?.locale).toBe('en');
    expect(written.canvas?.updatedBy).toBe('translation-manager');
    // Site write should have touched the target page's updatedAt.
    const updatedTarget = written.site?.pages.find(
      (page) => page.pageId === 'page-about-en',
    );
    expect(updatedTarget?.updatedAt).toBeTruthy();
    expect(Date.parse(updatedTarget?.updatedAt ?? '')).toBeGreaterThan(
      Date.parse('2026-05-20T00:00:00.000Z'),
    );
  });

  it('records skipped nodes when ids are unknown', async () => {
    const result = await applyTranslationToLocaleDraft(
      'edit-store-site',
      'ko',
      'en',
      'page-about-ko',
      {
        'headline-1': { text: 'Hi' },
        'missing-node': { text: 'will skip' },
      },
    );
    expect(result.appliedCount).toBe(1);
    expect(result.skipped.find((s) => s.nodeId === 'missing-node')?.reason).toBe(
      'node_not_found',
    );
  });
});

describe('setPageLocaleSeoOverride', () => {
  let site: BuilderSiteDocument;
  let written: BuilderSiteDocument | null;

  beforeEach(() => {
    site = seedSite();
    written = null;
    mockedReadSiteDocument.mockImplementation(async () => site);
    mockedWriteSiteDocument.mockImplementation(async (next) => {
      written = next;
      site = next;
    });
  });

  it('stores per-locale overrides on the source page', async () => {
    const ok = await setPageLocaleSeoOverride(
      'edit-store-site',
      'ko',
      'en',
      'page-about-ko',
      { title: 'About — English', description: 'desc' },
    );
    expect(ok).toBe(true);
    const sourcePage = written?.pages.find((page) => page.pageId === 'page-about-ko');
    const overrides = (sourcePage?.seo as
      | { localizedOverrides?: Record<string, { title?: string; description?: string }> }
      | undefined
    )?.localizedOverrides;
    expect(overrides?.en?.title).toBe('About — English');
    expect(overrides?.en?.description).toBe('desc');
  });

  it('refuses same-locale writes', async () => {
    const ok = await setPageLocaleSeoOverride(
      'edit-store-site',
      'ko',
      'ko',
      'page-about-ko',
      { title: 'x' },
    );
    expect(ok).toBe(false);
  });

  it('clears empty-string entries', async () => {
    await setPageLocaleSeoOverride(
      'edit-store-site',
      'ko',
      'en',
      'page-about-ko',
      { title: 'first' },
    );
    await setPageLocaleSeoOverride(
      'edit-store-site',
      'ko',
      'en',
      'page-about-ko',
      { title: '' },
    );
    const sourcePage = site.pages.find((page) => page.pageId === 'page-about-ko');
    const overrides = (sourcePage?.seo as
      | { localizedOverrides?: Record<string, { title?: string }> }
      | undefined
    )?.localizedOverrides;
    expect(overrides?.en?.title).toBeUndefined();
  });
});
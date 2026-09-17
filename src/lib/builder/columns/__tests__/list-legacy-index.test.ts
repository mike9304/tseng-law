import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import path from 'node:path';
import type { ColumnPost } from '@/lib/column-post';
import { columnDocumentSchema, type ColumnDocument } from '../types';
import { listColumnBundles, readColumnBundle, readColumnVariant } from '../storage';

const mocks = vi.hoisted(() => ({
  readdir: vi.fn(), readFile: vi.fn(), legacy: vi.fn(),
  blobGet: vi.fn(), blobList: vi.fn(),
}));
vi.mock('fs/promises', () => ({
  readdir: mocks.readdir, readFile: mocks.readFile,
  mkdir: vi.fn(), rm: vi.fn(), writeFile: vi.fn(),
}));
vi.mock('@vercel/blob', () => ({
  get: mocks.blobGet, list: mocks.blobList, put: vi.fn(), del: vi.fn(),
}));
vi.mock('@/lib/columns', () => ({ getAllColumnPosts: mocks.legacy }));
vi.mock('@/lib/builder/storage/blob-env-guard', () => ({ isBlobBlockedForDeployEnv: () => false }));

const ROOT = '/synthetic/perf04-columns';
const DATE = '2026-09-08T00:00:00.000Z';
let legacyByLocale: Record<string, ColumnPost[]>;
let stored: Map<string, string | Error>;
let entries: string[];
let order: string[];

function legacy(slug: string, title = slug): ColumnPost {
  return {
    slug, title, date: DATE, dateDisplay: '2026년 9월 8일', readTime: '1분',
    category: 'legal', categoryLabel: '법률', featuredImage: '', content: 'Synthetic body', summary: '',
  };
}
function document(slug: string, draft: boolean, title: string, updatedAt = DATE): ColumnDocument {
  return columnDocumentSchema.parse({
    version: 1, slug, locale: 'ko', title, summary: '', bodyMarkdown: 'Stored', bodyHtml: '<p>Stored</p>',
    frontmatter: { lastmod: updatedAt, attorneyReviewStatus: 'reviewed', freshness: 'fresh' },
    linkedSlugs: {}, draft, revision: 1, updatedAt, updatedBy: 'synthetic-test',
  });
}
function save(doc: ColumnDocument): void {
  const name = `${doc.slug}${doc.draft ? '.json' : '.published.json'}`;
  entries.push(name);
  stored.set(path.join(ROOT, doc.locale, name), JSON.stringify(doc));
}
function missing(): Error {
  return Object.assign(new Error('synthetic missing'), { code: 'ENOENT' });
}

beforeEach(() => {
  vi.clearAllMocks();
  vi.stubEnv('BLOB_READ_WRITE_TOKEN', '');
  // Backend choice belongs to this fixture, not the invoking process.
  vi.stubEnv('CONSULTATION_LOG_BACKEND', '');
  vi.stubEnv('BUILDER_USE_BLOB_IN_DEV', '0');
  vi.stubEnv('CONSULTATION_COLUMNS_DIR', ROOT);
  legacyByLocale = {}; stored = new Map(); entries = []; order = [];
  mocks.readdir.mockImplementation(async () => { order.push('stored'); return entries; });
  mocks.legacy.mockImplementation((locale: string) => { order.push('legacy'); return legacyByLocale[locale] ?? []; });
  mocks.readFile.mockImplementation(async (filename: string) => {
    const value = stored.get(String(filename));
    if (value === undefined) throw missing();
    if (value instanceof Error) throw value;
    return value;
  });
});
afterEach(() => { vi.unstubAllEnvs(); });

describe('one legacy index per column listing invocation', () => {
  it.each([0, 1, 17])('enumerates legacy once for %i legacy-only slugs and preserves storage reads', async (n) => {
    legacyByLocale.ko = Array.from({ length: n }, (_, i) => legacy(`article-${i}`));
    const result = await listColumnBundles('ko');
    expect(result.map((b) => b.slug)).toEqual(legacyByLocale.ko.map((p) => p.slug));
    expect(result.every((b) => b.draft === null && b.published === b.preferred)).toBe(true);
    expect(mocks.legacy).toHaveBeenCalledTimes(1);
    expect(mocks.readFile).toHaveBeenCalledTimes(2 * n);
    expect(order).toEqual(['stored', 'legacy']);
    expect(mocks.blobGet).not.toHaveBeenCalled();
  });

  it('keeps stored draft preferred while stored published wins over legacy', async () => {
    legacyByLocale.ko = [legacy('shared', 'Legacy')];
    save(document('shared', true, 'Draft'));
    save(document('shared', false, 'Published'));
    const [bundle] = await listColumnBundles('ko');
    expect(bundle.draft?.title).toBe('Draft');
    expect(bundle.published?.title).toBe('Published');
    expect(bundle.preferred).toBe(bundle.draft);
    expect(mocks.legacy).toHaveBeenCalledTimes(1);
    expect(mocks.readFile).toHaveBeenCalledTimes(2);
  });

  it('uses legacy only for missing published, never for missing draft', async () => {
    legacyByLocale.ko = [legacy('draft-only'), legacy('legacy-only')];
    save(document('draft-only', true, 'Draft'));
    save(document('published-only', false, 'Stored only'));
    const rows = await listColumnBundles('ko');
    const draft = rows.find((b) => b.slug === 'draft-only')!;
    const only = rows.find((b) => b.slug === 'legacy-only')!;
    expect(draft.preferred?.title).toBe('Draft');
    expect(draft.published?.title).toBe('draft-only');
    expect(only.draft).toBeNull();
    expect(only.published).toBe(only.preferred);
    expect(rows.find((b) => b.slug === 'published-only')?.published?.title).toBe('Stored only');
    expect(mocks.readFile).toHaveBeenCalledTimes(6);
    expect(mocks.legacy).toHaveBeenCalledTimes(1);
  });

  it('retains the first legacy duplicate and converts it only once', async () => {
    let bodyReads = 0;
    const first = legacy('duplicate', 'First');
    Object.defineProperty(first, 'content', { get: () => { bodyReads++; return 'First body'; } });
    legacyByLocale.ko = [first, legacy('duplicate', 'Second')];
    const [row] = await listColumnBundles('ko');
    expect(row.published?.title).toBe('First');
    expect(row.published?.bodyMarkdown).toBe('First body');
    expect(row.preferred).toBe(row.published);
    // A single conversion copies the source post once before producing both body formats.
    expect(bodyReads).toBe(1);
    expect(mocks.legacy).toHaveBeenCalledTimes(1);
    expect(mocks.readFile).toHaveBeenCalledTimes(2);
  });

  it('does not convert legacy content when stored published exists', async () => {
    const first = legacy('stored');
    Object.defineProperty(first, 'content', { get: () => { throw new Error('unnecessary conversion'); } });
    legacyByLocale.ko = [first];
    save(document('stored', false, 'Published'));
    expect((await listColumnBundles('ko'))[0].published?.title).toBe('Published');
  });

  it('drops an absent stored-only slug without repeated missing legacy scans', async () => {
    entries = ['gone.json', 'gone.published.json'];
    expect(await listColumnBundles('ko')).toEqual([]);
    expect(mocks.readFile).toHaveBeenCalledTimes(2);
    expect(mocks.legacy).toHaveBeenCalledTimes(1);
  });

  it.each(['schema', 'variant'])('preserves null normalization and published fallback for %s invalid data', async (kind) => {
    legacyByLocale.ko = [legacy('invalid')];
    const payload = kind === 'schema' ? {} : document('invalid', true, 'Wrong variant');
    stored.set(path.join(ROOT, 'ko/invalid.published.json'), JSON.stringify(payload));
    const [row] = await listColumnBundles('ko');
    expect(row.published?.title).toBe('invalid');
    expect(row.draft).toBeNull();
    expect(mocks.legacy).toHaveBeenCalledTimes(1);
  });

  it.each(['json', 'io'])('propagates %s failures instead of hiding them with fallback', async (kind) => {
    legacyByLocale.ko = [legacy('broken')];
    const value = kind === 'json' ? '{broken' : Object.assign(new Error('denied'), { code: 'EACCES' });
    stored.set(path.join(ROOT, 'ko/broken.published.json'), value);
    await expect(listColumnBundles('ko')).rejects.toThrow(kind === 'json' ? undefined : 'denied');
  });

  it('refreshes separate invocations and does not share indexes between locales', async () => {
    legacyByLocale.ko = [legacy('one', 'KO v1')];
    legacyByLocale['zh-hant'] = [legacy('one', 'ZH')];
    expect((await listColumnBundles('ko'))[0].published?.title).toBe('KO v1');
    legacyByLocale.ko = [legacy('one', 'KO v2')];
    expect((await listColumnBundles('ko'))[0].published?.title).toBe('KO v2');
    const [zh] = await listColumnBundles('zh-hant');
    expect(zh.published?.title).toBe('ZH');
    expect(zh.published?.locale).toBe('zh-hant');
    expect(mocks.legacy).toHaveBeenCalledTimes(3);
  });

  it('keeps stored enumeration before legacy and stable first-union order for equal timestamps', async () => {
    save(document('stored-first', false, 'Stored'));
    legacyByLocale.ko = [legacy('legacy-second'), legacy('stored-first')];
    expect((await listColumnBundles('ko')).map((b) => b.slug)).toEqual(['stored-first', 'legacy-second']);
    expect(order).toEqual(['stored', 'legacy']);
    stored.set(path.join(ROOT, 'ko/stored-first.published.json'), JSON.stringify(document('stored-first', false, 'Newer', '2026-09-09T00:00:00.000Z')));
    expect((await listColumnBundles('ko'))[0].slug).toBe('stored-first');
  });

  it('preserves direct read APIs and their refresh behavior outside listing', async () => {
    legacyByLocale.ko = [legacy('direct', 'Version one')];
    expect(await readColumnVariant('ko', 'direct', 'draft')).toBeNull();
    expect(mocks.legacy).not.toHaveBeenCalled();
    expect((await readColumnVariant('ko', 'direct', 'published'))?.title).toBe('Version one');
    legacyByLocale.ko = [legacy('direct', 'Version two')];
    const bundle = await readColumnBundle('ko', 'direct');
    expect(bundle.published?.title).toBe('Version two');
    expect(bundle.preferred).toBe(bundle.published);
    expect(mocks.legacy).toHaveBeenCalledTimes(2);
  });

  it('does not enumerate legacy after a stored-slug listing failure', async () => {
    mocks.readdir.mockRejectedValueOnce(new Error('listing failed'));
    await expect(listColumnBundles('ko')).rejects.toThrow('listing failed');
    expect(mocks.legacy).not.toHaveBeenCalled();
  });

  it('preserves Blob variant reads and stored precedence without using the local backend', async () => {
    vi.stubEnv('BLOB_READ_WRITE_TOKEN', 'synthetic-test-token');
    vi.stubEnv('BUILDER_USE_BLOB_IN_DEV', '1');
    legacyByLocale.ko = [legacy('remote', 'Legacy')];
    mocks.blobList.mockResolvedValue({ blobs: [{ pathname: 'consultation-columns/ko/remote.published.json' }] });
    mocks.blobGet.mockImplementation(async (pathname: string) => pathname.endsWith('.published.json')
      ? { statusCode: 200, stream: new Response(JSON.stringify(document('remote', false, 'Blob published'))).body }
      : null);
    const [row] = await listColumnBundles('ko');
    expect(row.backend).toBe('blob');
    expect(row.draft).toBeNull();
    expect(row.published?.title).toBe('Blob published');
    expect(mocks.blobList).toHaveBeenCalledTimes(1);
    expect(mocks.blobGet).toHaveBeenCalledTimes(2);
    expect(mocks.readFile).not.toHaveBeenCalled();
    expect(mocks.legacy).toHaveBeenCalledTimes(1);
  });
});

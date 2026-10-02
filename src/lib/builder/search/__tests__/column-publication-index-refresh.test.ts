import { mkdtemp, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { afterEach, expect, it, vi } from 'vitest';
import { buildSearchIndex } from '../index-builder';
import { searchCurrentPublication } from '../current-search';
import type { SearchIndex } from '../types';

const storage = vi.hoisted(() => ({ load: vi.fn(), save: vi.fn() }));
vi.mock('../index-storage', () => ({ loadSearchIndex: storage.load, saveSearchIndex: storage.save }));
vi.mock('@/lib/builder/site/persistence', () => ({ readExistingSiteDocument: vi.fn(async () => null) }));
vi.mock('@/lib/builder/faq/faq-engine', () => ({ listFaqSearchDocs: vi.fn(async () => []) }));
vi.mock('@/lib/builder/portfolio/portfolio-engine', () => ({ listPortfolioSearchDocs: vi.fn(async () => []) }));
let root: string;
afterEach(async () => {
  vi.useRealTimers();
  vi.unstubAllEnvs();
  await rm(root, { recursive: true, force: true });
});

it('rebuilds an old missing entry after the five-minute TTL while retaining fresh-cache behavior', async () => {
  root = await mkdtemp(path.join(tmpdir(), 'column-index-boundary-'));
  vi.stubEnv('CONSULTATION_COLUMNS_DIR', root);
  vi.stubEnv('BLOB_READ_WRITE_TOKEN', '');
  vi.stubEnv('BUILDER_COLUMNS_BACKEND', 'local');
  vi.useFakeTimers({ toFake: ['Date'] });
  const now = Date.parse('2026-10-02T22:48:22.000Z');
  vi.setSystemTime(now);
  let saved: SearchIndex = { ...buildSearchIndex([]), builtAt: new Date(now - 299_999).toISOString() };
  storage.load.mockImplementation(async () => saved);
  storage.save.mockImplementation(async (index: SearchIndex) => { saved = index; });
  const input = { query: '多個鏡頭還原大貨車攔擋', locale: 'zh-hant' as const, limit: 50, kinds: ['blog' as const] };
  const url = '/zh-hant/columns/taiwan-truck-blocking-multiple-dashcam-evidence';
  expect((await searchCurrentPublication(input)).hits.some(hit => hit.doc.url === url)).toBe(false);
  expect(storage.save).not.toHaveBeenCalled();
  vi.setSystemTime(now + 2);
  expect((await searchCurrentPublication(input)).hits.some(hit => hit.doc.url === url)).toBe(true);
  expect(storage.save).toHaveBeenCalledTimes(1);
  expect(saved.builtAt).toBe(new Date(now + 2).toISOString());
  expect((await searchCurrentPublication(input)).hits.some(hit => hit.doc.url === url)).toBe(true);
  expect(storage.save).toHaveBeenCalledTimes(1);
});

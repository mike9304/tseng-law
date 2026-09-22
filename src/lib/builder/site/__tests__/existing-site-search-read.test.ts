import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { mkdtemp, mkdir, rm, writeFile } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { get, put } from '@vercel/blob';
import * as persistence from '../persistence';
import { createDefaultSiteDocument } from '../types';
import { DEFAULT_BUILDER_SITE_ID as siteId } from '@/lib/builder/constants';
vi.mock('@vercel/blob', () => ({ get: vi.fn(), put: vi.fn(), list: vi.fn(), del: vi.fn() }));
let root: string;
beforeEach(async () => {
  vi.clearAllMocks(); root = await mkdtemp(path.join(os.tmpdir(), 'search-strict-reader-'));
  vi.stubEnv('BUILDER_SITE_ROOT', root); vi.stubEnv('BUILDER_SITE_BACKEND', 'local');
  vi.stubEnv('BLOB_READ_WRITE_TOKEN', ''); vi.stubEnv('CONSULTATION_LOG_BACKEND', 'local');
});
afterEach(async () => { vi.unstubAllEnvs(); await rm(root, { recursive: true, force: true }); });
function read() { return persistence.readExistingSiteDocument(siteId); }
async function fixture(bytes: string) { await mkdir(path.join(root, siteId), {recursive: true}); await writeFile(path.join(root,siteId,'site.json'), bytes); }
function valid() { return createDefaultSiteDocument('ko', siteId); }
const invalid = {
  wrongSite: () => JSON.stringify({...valid(), siteId:'unrelated-site'}),
  corrupt: () => '{bad',
  missingPages: () => JSON.stringify({siteId}),
  duplicateId: () => { const site=valid(); site.pages.push({...site.pages[0]}); return JSON.stringify(site); },
};
describe('existing-only strict site reads for public search', () => {
  it('local missing is null while ordinary reader retains its existing default contract', async () => {
    expect(await read()).toBeNull(); expect((await persistence.readSiteDocument(siteId,'ko')).pages.length).toBeGreaterThan(0); expect(put).not.toHaveBeenCalled();
  });
  it('local valid bytes are accepted', async () => { await fixture(JSON.stringify(valid())); expect(await read()).toMatchObject({siteId}); });
  it.each(Object.keys(invalid) as Array<keyof typeof invalid>)('local %s fails closed', async kind => { await fixture(invalid[kind]()); await expect(read()).rejects.toThrow(); });
  it('local IO failure is not absence', async () => { await mkdir(path.join(root,siteId,'site.json'), {recursive:true}); await expect(read()).rejects.toThrow(); });
  describe('mock Blob backend, no provider calls', () => {
    beforeEach(() => { vi.stubEnv('BUILDER_SITE_BACKEND','blob'); vi.stubEnv('CONSULTATION_LOG_BACKEND',''); vi.stubEnv('BLOB_READ_WRITE_TOKEN','synthetic-test-only'); vi.stubEnv('BUILDER_USE_BLOB_IN_DEV','1'); vi.stubEnv('VERCEL_ENV',''); });
    function stream(bytes: string) { vi.mocked(get).mockResolvedValue({statusCode:200,stream:new Response(bytes).body} as Awaited<ReturnType<typeof get>>); }
    it.each([null, {statusCode:404}])('missing %j is null, never put', async result => { vi.mocked(get).mockResolvedValue(result as Awaited<ReturnType<typeof get>>); expect(await read()).toBeNull(); expect(put).not.toHaveBeenCalled(); });
    it('valid requests explicitly uncached private read', async () => { stream(JSON.stringify(valid())); expect(await read()).toMatchObject({siteId}); expect(get).toHaveBeenCalledWith(expect.stringContaining(siteId),{access:'private',useCache:false}); expect(put).not.toHaveBeenCalled(); });
    it.each(Object.keys(invalid) as Array<keyof typeof invalid>)('%s fails closed', async kind => { stream(invalid[kind]()); await expect(read()).rejects.toThrow(); expect(put).not.toHaveBeenCalled(); });
    it('transport outage propagates', async () => { vi.mocked(get).mockRejectedValue(new Error('synthetic outage')); await expect(read()).rejects.toThrow('synthetic outage'); });
    it('non404 failure status is not absence', async () => { vi.mocked(get).mockResolvedValue({statusCode:503} as unknown as Awaited<ReturnType<typeof get>>); await expect(read()).rejects.toThrow(); });
  });
});

import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { mkdtempSync } from 'node:fs';
import path from 'node:path';
import { tmpdir } from 'node:os';
import { renderToStaticMarkup } from 'react-dom/server';
import { NextRequest } from 'next/server';
import { afterEach, beforeEach, expect, it, vi } from 'vitest';
import SearchPage from '@/app/[locale]/search/page';
import { GET as searchGET } from '@/app/api/search/route';
import { PATCH as pagePATCH, DELETE as pageDELETE } from '@/app/api/builder/site/pages/[pageId]/route';
import { PATCH as seoPATCH } from '@/app/api/builder/site/pages/[pageId]/seo/route';
import { DEFAULT_BUILDER_SITE_ID as siteId } from '@/lib/builder/constants';
import { createDefaultSiteDocument, type PageCanvasRecord } from '@/lib/builder/site/types';
import { createDefaultCanvasNodeStyle } from '@/lib/builder/canvas/types';
import * as persistence from '@/lib/builder/site/persistence';
import { collectAllSearchDocs } from '@/lib/builder/search/source-collector';
import { buildSearchIndex } from '@/lib/builder/search/index-builder';
import { loadSearchIndex, saveSearchIndex } from '@/lib/builder/search/index-storage';
import { __setUserRoleStorageRootForTests, __resetUserRoleStorageRootForTests } from '@/lib/builder/security/user-role-store';

// No component, source collector, index store, auth, mutation, or reader mock.
// All source modules remain real; the only global replacement traps external I/O.
const pageId = 'legacy-search-probe', slug = 'legacy-search-public-a';
const title = 'legacyneedle TITLE_PUBLIC_A', snippet = 'legacyneedle SNIPPET_PUBLIC_A';
const query = 'legacyneedle', start = Date.parse('2026-09-14T10:00:00.000Z');
const output = mkdtempSync(path.join(tmpdir(), 'legacy-mutation-suppression-'));
let caseRoot: string, label: string, external: ReturnType<typeof vi.fn>;
let counter = 0;
const canvas = (): PageCanvasRecord => ({ revision: 1, savedAt: new Date().toISOString(), updatedBy: 'legacy-fixture', document: {
  version: 1, locale: 'ko', updatedAt: new Date().toISOString(), updatedBy: 'legacy-fixture', stageWidth: 1280, stageHeight: 720,
  nodes: [{ id: 'image', kind: 'image', rect: { x: 0, y: 0, width: 100, height: 100 }, style: createDefaultCanvasNodeStyle(),
    zIndex: 0, rotation: 0, locked: false, visible: true, content: { src: '/synthetic-legacy.png', alt: snippet, fit: 'contain' } }],
} });
const json = async (file: string, value: unknown) => writeFile(path.join(caseRoot, file), JSON.stringify(value, null, 2) + '\n');
const context = () => ({ params: Promise.resolve({ pageId }) });
function mutationRequest(method: string, seo = false, body?: object) {
  return new NextRequest(`http://127.0.0.1:39993/api/builder/site/pages/${pageId}${seo ? '/seo' : ''}?siteId=default&locale=ko`, {
    method, headers: { authorization: 'Basic ' + Buffer.from('legacy-owner:synthetic-password').toString('base64'), origin: 'http://127.0.0.1:39993', 'content-type': 'application/json' },
    ...(body ? { body: JSON.stringify(body) } : {}),
  });
}
async function ssr(phase: string) {
  const element = await SearchPage({ params: Promise.resolve({ locale: 'ko' }), searchParams: Promise.resolve({ q: query, tab: 'page' }) });
  const html = renderToStaticMarkup(element);
  await writeFile(path.join(caseRoot, phase + '.html'), html);
  return { title: html.includes(title), snippet: html.includes(snippet), url: html.includes(`href="/ko/${slug}"`),
    count: html.match(/class="search-results-total">([^<]*)</)?.[1], rows: (html.match(/class="list-row"/g) ?? []).length };
}
async function api(phase: string) {
  const response = await searchGET(new NextRequest(`http://127.0.0.1:39993/api/search?q=${query}&locale=ko&kinds=page`));
  const body = await response.json(); await json(phase + '.json', { status: response.status, body });
  return { status: response.status, total: body.total, hits: body.hits };
}
beforeEach(async ctx => {
  label = ctx.task.name.includes('member') ? 'member' : ctx.task.name.includes('noIndex') ? 'noIndex' : 'delete';
  counter++; caseRoot = path.join(output, 'cases-final', label); await mkdir(caseRoot, { recursive: true });
  vi.useFakeTimers({ toFake: ['Date'] }); vi.setSystemTime(start + counter * 3_600_000);
  for (const [key, value] of Object.entries({
    NODE_ENV: 'test', BUILDER_SCHEDULED_OPERATION_MODE: 'legacy', BUILDER_SCHEDULED_OPERATION_TEST_CAPABILITY: '',
    BUILDER_PAGE_CANVAS_CAS_MODE: 'legacy', BUILDER_PAGE_CANVAS_CAS_MARKER: '',
    BUILDER_SITE_ROOT: path.join(caseRoot, 'site'), BUILDER_SITE_BACKEND: 'local', CONSULTATION_LOG_BACKEND: 'local',
    BUILDER_RUNTIME_DATA_ROOT: path.join(caseRoot, 'runtime'), BUILDER_REVISIONS_ROOT: path.join(caseRoot, 'revisions'),
    BLOB_READ_WRITE_TOKEN: '', UPSTASH_REDIS_REST_URL: '', UPSTASH_REDIS_REST_TOKEN: '', BUILDER_RATE_LIMIT_BACKEND: '',
    CMS_ADMIN_USERNAME: '', CMS_ADMIN_PASSWORD: '', BUILDER_USERNAME: 'legacy-owner',
    BUILDER_BASIC_AUTH_USERS: JSON.stringify([{ username: 'legacy-owner', password: 'synthetic-password' }]),
  })) vi.stubEnv(key, value);
  external = vi.fn(async () => { throw Error('external provider forbidden in local legacy confirmation'); }); vi.stubGlobal('fetch', external);
  __setUserRoleStorageRootForTests(path.join(caseRoot, 'roles'));
  await mkdir(path.join(caseRoot, 'roles')); await writeFile(path.join(caseRoot, 'roles/user-roles.json'), JSON.stringify({ users: [{ username: 'legacy-owner', role: 'owner', addedAt: new Date().toISOString(), addedBy: 'fixture' }] }));
  expect(process.env.BUILDER_SCHEDULED_OPERATION_MODE).toBe('legacy');
  const site = createDefaultSiteDocument('ko', siteId), home = { ...site.pages[0], pageId: 'home-ko' };
  site.pages = [home, { ...home, pageId: 'home-en', locale: 'en' }, { ...home, pageId: 'home-zh', locale: 'zh-hant' },
    { ...home, pageId, isHomePage: false, slug, title: { ko: title, en: title, 'zh-hant': title }, seo: { description: snippet } }];
  site.navigation = [];
  await persistence.writeSiteDocument(site);
  await persistence.writePageCanvasRecord(siteId, pageId, canvas());
  expect(await persistence.publishPage(siteId, pageId, 'ko')).toBe(true);
  expect((await persistence.readSiteDocument(siteId, 'ko')).pages.find(p => p.pageId === pageId)?.publishedAt).toBeTruthy();
  expect((await persistence.readPageCanvas(siteId, pageId, 'published'))?.nodes).toHaveLength(1);
  for (const dir of ['columns', 'columns-zh', 'columns-en', 'columns-ja']) await mkdir(path.join(output, 'src/content', dir), { recursive: true });
  const docs = await collectAllSearchDocs('default'); await json('fixture-collected-docs.json', docs);
  expect(docs.some(doc => doc.id === `page:ko:${pageId}` && doc.body.includes(snippet))).toBe(true);
  const index = buildSearchIndex(docs); await saveSearchIndex(index); await json('index-public-A.json', index);
  expect((await loadSearchIndex())?.builtAt).toBe(index.builtAt);
});
afterEach(async () => { vi.useRealTimers(); vi.unstubAllEnvs(); vi.unstubAllGlobals(); __resetUserRoleStorageRootForTests(); });

it.each(['member', 'noIndex', 'delete'])('legacy cached public A is suppressed after actual %s mutation', async change => {
  const before = { ssr: await ssr('before-ssr'), api: await api('before-api') };
  expect(before.ssr).toMatchObject({ title: true, snippet: true, url: true, count: '총 1건', rows: 1 });
  expect(before.api.total).toBe(1);
  let response: Response;
  if (change === 'member') response = await pagePATCH(mutationRequest('PATCH', false, { memberAccess: { requireLogin: true, allowedRoles: ['premium'] } }), context());
  else if (change === 'noIndex') response = await seoPATCH(mutationRequest('PATCH', true, { seo: { noIndex: true } }), context());
  else response = await pageDELETE(mutationRequest('DELETE'), context());
  const mutation = { status: response.status, body: await response.json() };
  await json('mutation.json', mutation); expect(mutation.status).toBe(200);
  const currentSite = await persistence.readSiteDocument(siteId, 'ko'); await json('site-after-mutation.json', currentSite);
  const current = currentSite.pages.find(page => page.pageId === pageId);
  if (change === 'member') expect(current?.memberAccess?.requireLogin).toBe(true);
  else if (change === 'noIndex') expect(current?.seo?.noIndex || current?.noIndex).toBe(true);
  else expect(current).toBeUndefined();
  const fresh = { ssr: await ssr('fresh-after-mutation-ssr'), api: await api('fresh-after-mutation-api') };
  const cacheBeforeExpiry = JSON.parse(await readFile(path.join(process.cwd(), 'runtime-data/search/site-index.json'), 'utf8'));
  vi.setSystemTime(Date.now() + 6 * 60_000);
  const expiredBeforeApi = await ssr('expired-before-api-ssr');
  const expiredApi = await api('expired-api-rebuild');
  const afterApiRebuild = await ssr('after-api-rebuild-ssr');
  const cacheAfterApi = await loadSearchIndex(); await json('index-after-api-rebuild.json', cacheAfterApi);
  const directCurrentDocs = (await collectAllSearchDocs('default')).filter(doc => doc.id === `page:ko:${pageId}`);
  await json('observation.json', { change, mode: 'legacy', before, mutation, fresh, expiredBeforeApi, expiredApi, afterApiRebuild,
    cacheBeforeExpiryBuiltAt: cacheBeforeExpiry.builtAt, cacheAfterApiBuiltAt: cacheAfterApi?.builtAt, directCurrentDocs, externalAttempts: external.mock.calls.length });
  expect(external).not.toHaveBeenCalled();
  // Expected public-eligibility contract, intentionally RED if current source exposes A.
  expect.soft(fresh.ssr.rows, 'SSR must suppress current ineligible builder result').toBe(0);
  expect.soft(fresh.api.total, 'API must suppress current ineligible builder result').toBe(0);
  expect.soft(expiredBeforeApi.rows, 'SSR must not keep an expired ineligible result indefinitely').toBe(0);
  expect.soft(expiredApi.total, 'rebuild must exclude current restricted/deleted/noIndex builder page').toBe(0);
});

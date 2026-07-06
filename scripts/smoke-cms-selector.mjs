#!/usr/bin/env node
/**
 * smoke-cms-selector.mjs — real-browser smoke test of the WIX-PERFECT #6 Slice 3
 * "CMS collection (your data)" dataset-binding selector (the one seam with no node-test oracle).
 *
 * SELF-SEEDING: creates a temporary `smoke-recipes` collection + 2 published records via the
 * real API before the run, and deletes it (and resets the home dataset binding) afterward — so
 * it passes standalone with no manual setup. Requires a dev server up (BASE_URL) + basic-auth creds.
 *
 * Drives the actual editor page, selects the collection, saves, and asserts:
 *   (a) the selector renders the seeded collection,
 *   (b) selecting it + saving persists a cmsCollectionId binding (PUT 200, ok),
 *   (c) the preview/repeater shows the collection's records.
 *
 * Usage: BASE_URL=http://localhost:3001 node scripts/smoke-cms-selector.mjs
 */
import { chromium } from '@playwright/test';

const BASE = process.env.BASE_URL ?? 'http://localhost:3001';
const USER = process.env.BUILDER_SMOKE_USERNAME ?? 'admin';
const PASS = process.env.BUILDER_SMOKE_PASSWORD ?? 'local-review-2026!';
const URL = `${BASE}/ko/builder/home/datasets`;

const results = [];
function check(name, pass, detail = '') {
  results.push({ name, pass, detail });
  console.log(`${pass ? 'PASS' : 'FAIL'}  ${name}${detail ? ' — ' + detail : ''}`);
}

const browser = await chromium.launch();
const ctx = await browser.newContext({ httpCredentials: { username: USER, password: PASS }, viewport: { width: 1440, height: 1000 } });
const page = await ctx.newPage();

// capture the save PUT request body (request event = reliable, no response-body race),
// and the latest preview POST result via response.
let savePutBody = null;
let savePutResp = null;
let previewPost = null;
page.on('console', (msg) => { if (msg.type() === 'error') console.log('  [console.error]', msg.text().slice(0, 200)); });
page.on('request', (req) => {
  if (req.url().includes('/datasets?') && req.method() === 'PUT') {
    try { savePutBody = JSON.parse(req.postData() ?? '{}'); } catch { savePutBody = {}; }
  }
});
page.on('response', async (resp) => {
  const u = resp.url();
  const method = resp.request().method();
  if (u.includes('/datasets?') && method === 'PUT') {
    savePutResp = { status: resp.status(), ok: (await resp.json().catch(() => ({}))).ok };
  }
  if (u.includes('/datasets/preview') && method === 'POST') {
    let reqBody = null;
    try { reqBody = JSON.parse(resp.request().postData() ?? '{}'); } catch { /* ignore */ }
    const json = await resp.json().catch(() => ({}));
    const entry = { status: resp.status(), reqBody, sampleCount: json?.sampleRecords?.length, ok: json?.ok, error: json?.error };
    // Prefer the CMS-keyed preview; don't let a later built-in run clobber it.
    if (reqBody?.cmsCollectionId || !previewPost?.reqBody?.cmsCollectionId) previewPost = entry;
  }
});

// Seed a temporary collection + records via the real API (page.request carries auth + origin).
const api = ctx.request;
const apiHeaders = { 'Content-Type': 'application/json', Origin: BASE };
async function seed() {
  const create = await api.post(`${BASE}/api/builder/sites/default/collections?locale=ko`, {
    headers: apiHeaders,
    data: { name: 'smoke recipes' },
  });
  if (!create.ok()) throw new Error(`seed collection failed: ${create.status()} ${await create.text()}`);
  const recBase = `${BASE}/api/builder/sites/default/collections/smoke-recipes/records?locale=ko`;
  for (const r of [{ title: '김치찌개', slug: 'kimchi' }, { title: '불고기', slug: 'bulgogi' }]) {
    const rec = await api.post(recBase, { headers: apiHeaders, data: { status: 'published', fields: r } });
    if (!rec.ok()) throw new Error(`seed record failed: ${rec.status()} ${await rec.text()}`);
  }
}
async function teardown() {
  // reset the home dataset binding back to the built-in source, then delete the collection
  await api.put(`${BASE}/api/builder/sites/default/pages/home/datasets?locale=ko`, {
    headers: apiHeaders,
    data: { targetId: 'home.insights.feed', collectionId: 'columns', mode: 'list', filters: [], sort: [] },
  }).catch(() => {});
  await api.delete(`${BASE}/api/builder/sites/default/collections/smoke-recipes?locale=ko`, { headers: apiHeaders }).catch(() => {});
}

try {
  await teardown(); // clear any leftover from a prior aborted run, then seed fresh
  await seed();
  check('seed: temp collection + 2 records created via API', true);

  await page.goto(URL, { waitUntil: 'networkidle', timeout: 45000 });
  await page.waitForTimeout(1000);

  // (a) selector present + renders the seeded collection
  const selector = page.locator('select').filter({ has: page.locator('option', { hasText: /Use built-in source/ }) });
  const selectorVisible = await selector.first().isVisible().catch(() => false);
  check('CMS-collection selector renders', selectorVisible);

  const optionText = await page.locator('option', { hasText: 'smoke recipes' }).first().textContent().catch(() => null);
  check('seeded collection appears as an option', Boolean(optionText), optionText ?? 'not found');

  if (selectorVisible && optionText) {
    // (b) select it (value = collectionId 'smoke-recipes') and confirm the value stuck
    await selector.first().selectOption('smoke-recipes');
    const selVal = await selector.first().inputValue().catch(() => '');
    check('selecting the collection sets the control value', selVal === 'smoke-recipes', `value=${selVal}`);
    await page.waitForTimeout(1500); // debounced preview fetch after selecting CMS collection
    check('preview POST re-ran with cmsCollectionId after select', previewPost?.reqBody?.cmsCollectionId === 'smoke-recipes',
      previewPost ? `cmsId=${previewPost.reqBody?.cmsCollectionId} samples=${previewPost.sampleCount} ok=${previewPost.ok} err=${previewPost.error ?? ''}` : 'no preview POST');

    const saveBtn = page.getByRole('button', { name: 'Save binding' });
    const btnVisible = await saveBtn.isVisible().catch(() => false);
    check('Save binding button visible', btnVisible);
    await saveBtn.scrollIntoViewIfNeeded().catch(() => {});
    // Await the save PUT response deterministically (no fixed-timeout race).
    const putRespP = page.waitForResponse(
      (r) => r.url().includes('/datasets?') && r.request().method() === 'PUT',
      { timeout: 8000 },
    ).catch(() => null);
    await saveBtn.click({ timeout: 5000 });
    const putResp = await putRespP;
    if (putResp) savePutResp = { status: putResp.status(), ok: (await putResp.json().catch(() => ({}))).ok };
    await page.waitForTimeout(800);

    check('save PUT fired', Boolean(savePutBody), savePutBody ? 'captured' : 'no PUT captured');
    check('save PUT carried cmsCollectionId', savePutBody?.cmsCollectionId === 'smoke-recipes', JSON.stringify(savePutBody ?? {}));
    check('save PUT succeeded (persisted)', savePutResp?.status === 200 && savePutResp?.ok === true, `status=${savePutResp?.status} ok=${savePutResp?.ok}`);

    // (c) preview shows the collection records (re-read after select; built-in 'Visual Load' should be gone)
    const bodyText = await page.locator('body').innerText().catch(() => '');
    const showsRecord = bodyText.includes('김치찌개') || bodyText.includes('불고기');
    check('preview/repeater shows collection records', showsRecord, `preview samples=${previewPost?.sampleCount} cmsId=${previewPost?.reqBody?.cmsCollectionId}`);
  }

  await page.screenshot({ path: '/tmp/smoke-selector.png', fullPage: true }).catch(() => {});
} catch (e) {
  check('smoke run completed without exception', false, String(e?.message ?? e));
} finally {
  await teardown().catch(() => {});
  await browser.close();
}

const failed = results.filter((r) => !r.pass);
console.log(`\n${results.length - failed.length}/${results.length} checks passed`);
process.exit(failed.length === 0 ? 0 : 1);

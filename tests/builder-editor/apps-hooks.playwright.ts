import { expect, test } from '@playwright/test';
import {
  createBuilderPage,
  createCmsRecord,
  createEditableCollection,
  deleteBuilderPage,
  deleteEditableCollection,
  expectArray,
  expectHookLog,
  expectRecord,
  isRecord,
  mutationHeaders,
  readDraftForSave,
  registerStoredHook,
  saveDraft,
} from './helpers/apps-hooks';

test('/api/builder/apps/hooks registers, invokes, and logs stored hook code', async ({ page }) => {
  test.setTimeout(60_000);

  const token = `hooks-${Date.now().toString(36)}`;
  const appId = `pw-app-${token}`.toLowerCase().slice(0, 60);
  const hookId = `${appId}-publish-1`.slice(0, 60);
  const marker = `stored-hook-${token}`;
  const pageId = `page-${token}`;
  const reference = `${appId}:${hookId}`;

  await page.setExtraHTTPHeaders(mutationHeaders(token));

  const postRes = await page.request.post('/api/builder/apps/hooks', {
    data: {
      appId,
      kind: 'publish.completed',
      hookId,
      priority: 5,
      code: `function handler(event, ctx, app) { ctx.log("${marker}:" + event.payload.pageId + ":" + app.hookId); return "stored-ok"; }`,
    },
    headers: { 'Content-Type': 'application/json', ...mutationHeaders(token) },
  });
  expect(postRes.status()).toBe(201);
  const created = expectRecord(await postRes.json(), 'hook create response');
  const createdHook = expectRecord(created.hook, 'created hook');
  expect(created.ok).toBe(true);
  expect(createdHook.hookId).toBe(hookId);
  expect(createdHook.appId).toBe(appId);
  expect(createdHook.kind).toBe('publish.completed');
  expect(createdHook.priority).toBe(5);
  expect(createdHook.hasHandler).toBe(false);
  expect(typeof createdHook.codeSecretId, 'stored hook code requires NEXTAUTH_SECRET or BUILDER_SECRET_KEK').toBe('string');

  const listRes = await page.request.get('/api/builder/apps/hooks');
  expect(listRes.status()).toBe(200);
  const list = expectRecord(await listRes.json(), 'hook list response');
  const hooks = expectArray(list.hooks, 'hook list');
  expect(list.ok).toBe(true);
  expect(hooks.some((hook) => isRecord(hook) && hook.hookId === hookId && hook.appId === appId)).toBe(true);

  const invokeRes = await page.request.post('/api/builder/apps/hooks/invoke?locale=en', {
    data: {
      kind: 'publish.completed',
      payload: {
        siteId: 'site-a',
        pageId,
        revision: 3,
        publishedAt: new Date().toISOString(),
      },
    },
    headers: { 'Content-Type': 'application/json', ...mutationHeaders(`${token}-invoke`) },
  });
  expect(invokeRes.status()).toBe(200);
  const invoked = expectRecord(await invokeRes.json(), 'hook invoke response');
  const summary = expectRecord(invoked.summary, 'hook invoke summary');
  const stored = expectRecord(summary.stored, 'stored hook invoke summary');
  const invokedHooks = expectArray(stored.hooks, 'stored hook invocation list');
  expect(invoked.ok).toBe(true);
  expect(summary.kind).toBe('publish.completed');
  expect(stored.invoked).toBeGreaterThanOrEqual(1);
  expect(invokedHooks.some((hook) => isRecord(hook) && hook.hookId === hookId && hook.ok === true)).toBe(true);

  const logsRes = await page.request.get(
    `/api/builder/dev/logs?source=app&reference=${encodeURIComponent(reference)}&limit=20`,
  );
  expect(logsRes.status()).toBe(200);
  const logs = expectRecord(await logsRes.json(), 'app logs response');
  const entries = expectArray(logs.entries, 'app log entries');
  expect(entries.some((entry) => (
    isRecord(entry)
      && entry.level === 'log'
      && typeof entry.message === 'string'
      && entry.message.includes(`${marker}:${pageId}:${hookId}`)
  ))).toBe(true);
});

test('/api/builder/apps/hooks rejects invalid kind', async ({ page }) => {
  await page.setExtraHTTPHeaders(mutationHeaders('hooks-invalid'));

  const res = await page.request.post('/api/builder/apps/hooks', {
    data: {
      appId: 'pw-invalid',
      kind: 'not-a-real-event',
    },
    headers: { 'Content-Type': 'application/json', ...mutationHeaders('hooks-invalid') },
  });
  expect(res.status()).toBe(400);
  const body = expectRecord(await res.json(), 'invalid hook response');
  expect(body.ok).toBe(false);
});

test('stored hooks run from automatic editor, public, and CMS lifecycle surfaces', async ({ page }) => {
  test.setTimeout(120_000);

  const token = `auto-${Date.now().toString(36)}`;
  const appId = `pw-auto-${token}`.toLowerCase().slice(0, 60);
  const collectionId = `pw-app-hooks-${token}`.toLowerCase().slice(0, 60);
  let pageId = '';

  await page.setExtraHTTPHeaders(mutationHeaders(token));

  const editorMarker = `editor-lifecycle-${token}`;
  const editorHookId = `${appId}-editor`.slice(0, 60);
  const editorReference = await registerStoredHook(page, {
    token,
    appId,
    hookId: editorHookId,
    kind: 'editor.page-save',
    marker: editorMarker,
  });

  const publicMarker = `public-lifecycle-${token}`;
  const publicHookId = `${appId}-public`.slice(0, 60);
  const publicReference = await registerStoredHook(page, {
    token,
    appId,
    hookId: publicHookId,
    kind: 'public.page-render',
    marker: publicMarker,
  });

  const cmsMarker = `cms-lifecycle-${token}`;
  const cmsHookId = `${appId}-cms`.slice(0, 60);
  const cmsReference = await registerStoredHook(page, {
    token,
    appId,
    hookId: cmsHookId,
    kind: 'cms.record-created',
    marker: cmsMarker,
  });

  try {
    pageId = await createBuilderPage(page.request, token);
    const draft = await readDraftForSave(page.request, pageId, token);
    await saveDraft(page.request, pageId, token, draft);
    await expectHookLog(page, editorReference, `${editorMarker}:editor.page-save:${editorHookId}`);

    const publicResponse = await page.request.get(`/ko?appsHookSmoke=${encodeURIComponent(token)}`, {
      failOnStatusCode: false,
    });
    expect(publicResponse.status()).toBe(200);
    await expectHookLog(page, publicReference, `${publicMarker}:public.page-render:${publicHookId}`);

    await createEditableCollection(page.request, collectionId, token);
    await createCmsRecord(page.request, collectionId, token);
    await expectHookLog(page, cmsReference, `${cmsMarker}:cms.record-created:${cmsHookId}`);
  } finally {
    if (pageId) {
      await deleteBuilderPage(page.request, pageId, token);
    }
    await deleteEditableCollection(page.request, collectionId, token);
  }
});

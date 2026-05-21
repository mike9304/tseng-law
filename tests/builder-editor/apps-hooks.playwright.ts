import { expect, test } from '@playwright/test';

function mutationHeaders(scope: string): Record<string, string> {
  const safeScope = scope.replace(/[^a-z0-9-]/gi, '-').slice(-48) || 'apps-hooks';
  return { 'x-forwarded-for': `pw-${safeScope}` };
}

test('/api/builder/apps/hooks lists registered hooks and accepts dormant metadata POST', async ({ page }) => {
  test.setTimeout(60_000);

  const token = `hooks-${Date.now().toString(36)}`;
  const appId = `pw-app-${token}`.toLowerCase().slice(0, 60);
  const hookId = `${appId}-publish-1`.slice(0, 60);

  await page.setExtraHTTPHeaders(mutationHeaders(token));

  // 1. POST a dormant metadata record
  const postRes = await page.request.post('/api/builder/apps/hooks', {
    data: {
      appId,
      kind: 'publish.completed',
      hookId,
      priority: 5,
      code: 'function handler(event, ctx) { ctx.log("test"); }',
    },
    headers: { 'Content-Type': 'application/json', ...mutationHeaders(token) },
  });
  expect(postRes.status()).toBe(201);
  const created = (await postRes.json()) as {
    ok: boolean;
    hook: { hookId: string; appId: string; kind: string; priority: number; hasHandler: boolean };
  };
  expect(created.ok).toBe(true);
  expect(created.hook.hookId).toBe(hookId);
  expect(created.hook.appId).toBe(appId);
  expect(created.hook.kind).toBe('publish.completed');
  expect(created.hook.priority).toBe(5);
  // Dormant — no handler bound
  expect(created.hook.hasHandler).toBe(false);

  // 2. GET should include the new record
  const listRes = await page.request.get('/api/builder/apps/hooks');
  expect(listRes.status()).toBe(200);
  const list = (await listRes.json()) as {
    ok: boolean;
    hooks: Array<{ hookId: string; appId: string; kind: string }>;
  };
  expect(list.ok).toBe(true);
  expect(list.hooks.some((h) => h.hookId === hookId && h.appId === appId)).toBe(true);
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
  const body = (await res.json()) as { ok: boolean; error?: string };
  expect(body.ok).toBe(false);
});

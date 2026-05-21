import { expect, test, type APIRequestContext } from '@playwright/test';

function mutationHeaders(scope: string): Record<string, string> {
  const safeScope = scope.replace(/[^a-z0-9-]/gi, '-').slice(-48) || 'collab-presence';
  return { 'x-forwarded-for': `pw-${safeScope}` };
}

async function heartbeat(
  request: APIRequestContext,
  scope: string,
  body: { siteId: string; pageId: string; sessionId: string; nodeId?: string },
) {
  const res = await request.post('/api/builder/collab/presence', {
    data: body,
    headers: mutationHeaders(scope),
  });
  expect(res.status(), `heartbeat ${scope} failed: ${res.status()}`).toBe(200);
  return res.json() as Promise<{ ok: boolean; active: Array<{ sessionId: string; username: string }> }>;
}

test.describe('collab presence smoke', () => {
  test('two sessions on same page appear in active list', async ({ playwright }) => {
    const token = Date.now().toString(36);
    const pageId = `presence-${token}`;
    const ctxA = await playwright.request.newContext();
    const ctxB = await playwright.request.newContext();

    try {
      const sessA = `sess-a-${token}`;
      const sessB = `sess-b-${token}`;

      await heartbeat(ctxA, `presence-${token}-a`, {
        siteId: 'default',
        pageId,
        sessionId: sessA,
      });
      const second = await heartbeat(ctxB, `presence-${token}-b`, {
        siteId: 'default',
        pageId,
        sessionId: sessB,
        nodeId: 'node-x',
      });

      expect(second.ok).toBe(true);
      const sessionIds = second.active.map((entry) => entry.sessionId);
      expect(sessionIds).toEqual(expect.arrayContaining([sessA, sessB]));

      const listRes = await ctxA.get(
        `/api/builder/collab/presence?siteId=default&pageId=${encodeURIComponent(pageId)}`,
      );
      expect(listRes.status()).toBe(200);
      const list = (await listRes.json()) as { active: Array<{ sessionId: string; nodeId?: string }> };
      const ids = list.active.map((entry) => entry.sessionId);
      expect(ids).toEqual(expect.arrayContaining([sessA, sessB]));
      const withNode = list.active.find((entry) => entry.sessionId === sessB);
      expect(withNode?.nodeId).toBe('node-x');
    } finally {
      await ctxA.dispose();
      await ctxB.dispose();
    }
  });
});
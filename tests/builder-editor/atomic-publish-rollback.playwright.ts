import { expect, test } from '@playwright/test';

function mutationHeaders(scope: string): Record<string, string> {
  const safeScope = scope.replace(/[^a-z0-9-]/gi, '-').slice(-48) || 'atomic-publish-rollback';
  return { 'x-forwarded-for': `pw-${safeScope}` };
}

function makeDocument(token: string) {
  const now = new Date().toISOString();
  return {
    version: 1,
    locale: 'ko',
    updatedAt: now,
    updatedBy: `atomic-rollback-${token}`,
    stageWidth: 1280,
    stageHeight: 720,
    nodes: [
      {
        id: `title-${token}`,
        kind: 'text',
        rect: { x: 80, y: 80, width: 720, height: 80 },
        style: {
          backgroundColor: 'transparent',
          borderColor: '#cbd5e1',
          borderStyle: 'solid',
          borderWidth: 0,
          borderRadius: 0,
          shadowX: 0,
          shadowY: 0,
          shadowBlur: 0,
          shadowSpread: 0,
          shadowColor: 'rgba(15, 23, 42, 0.16)',
          opacity: 100,
        },
        zIndex: 1,
        rotation: 0,
        locked: false,
        visible: true,
        content: { text: `Atomic rollback ${token}`, fontSize: 40, color: '#0f172a' },
      },
    ],
  };
}

test('failed atomic publish removes a first-time published page artifact', async ({ page }) => {
  const token = `atomic-rb-${Date.now().toString(36)}`;
  const headers = mutationHeaders(token);
  const slug = `atomic-rollback-${token}`;
  let pageId: string | null = null;

  try {
    const createResponse = await page.request.post('/api/builder/site/pages', {
      headers,
      data: {
        locale: 'ko',
        slug,
        title: `Atomic rollback ${token}`,
        document: makeDocument(token),
      },
    });
    expect(createResponse.status()).toBe(200);
    const created = (await createResponse.json()) as { success?: boolean; pageId?: string; error?: string };
    expect(created.success, created.error).toBe(true);
    pageId = created.pageId ?? null;
    expect(pageId).toBeTruthy();

    const atomicResponse = await page.request.post('/api/builder/publish/atomic', {
      headers,
      data: {
        pageIds: [pageId],
        cmsCollectionIds: ['missing-collection'],
        locale: 'ko',
      },
    });
    expect(atomicResponse.status()).toBe(207);
    const payload = (await atomicResponse.json()) as {
      ok?: boolean;
      status?: string;
      results?: Array<{ kind?: string; id?: string; status?: string; error?: string }>;
    };
    expect(payload.ok).toBe(false);
    expect(payload.status).toBe('rolled-back');
    expect(payload.results).toEqual(expect.arrayContaining([
      expect.objectContaining({ kind: 'page', id: pageId, status: 'succeeded' }),
      expect.objectContaining({ kind: 'cms', id: 'missing-collection', status: 'failed' }),
    ]));

    const publicResponse = await page.goto(`/ko/${slug}`, { waitUntil: 'domcontentloaded' });
    expect(publicResponse?.status()).toBe(404);
    await expect(page.locator(`[data-node-id="title-${token}"]`)).toHaveCount(0);
  } finally {
    if (pageId) {
      await page.request.delete(`/api/builder/site/pages/${pageId}?locale=ko`, {
        headers,
        failOnStatusCode: false,
      });
    }
  }
});

import { expect, test, type APIRequestContext } from '@playwright/test';
import { openBuilder } from './helpers/editor';

function mutationHeaders(scope: string): Record<string, string> {
  const safeScope = scope.replace(/[^a-z0-9-]/gi, '-').slice(-48) || 'collab-cursors-ui';
  return { 'x-forwarded-for': `pw-${safeScope}` };
}

async function createCursorPage(request: APIRequestContext, token: string): Promise<string> {
  const response = await request.post('/api/builder/site/pages', {
    data: {
      locale: 'ko',
      slug: `g-collab-cursor-${token}`,
      title: `Collab Cursor ${token}`,
      blank: true,
    },
    headers: mutationHeaders(token),
  });
  expect(response.status()).toBe(200);
  const payload = await response.json() as { success?: boolean; pageId?: string; error?: string };
  expect(payload.success, payload.error).toBe(true);
  expect(payload.pageId).toBeTruthy();
  return payload.pageId!;
}

async function seedCursor(request: APIRequestContext, token: string, pageId: string): Promise<void> {
  const response = await request.post('/api/builder/collab/cursors', {
    data: {
      siteId: 'default',
      pageId,
      x: 280,
      y: 180,
      label: 'Peer',
    },
    headers: {
      'content-type': 'application/json',
      ...mutationHeaders(`${token}-cursor`),
    },
  });
  expect(response.status()).toBe(200);
}

test.describe('/ko/admin-builder collaboration cursors', () => {
  test('shows remote cursor pins over the canvas', async ({ page }) => {
    test.setTimeout(60_000);
    const token = Date.now().toString(36);
    const slug = `g-collab-cursor-${token}`;
    let pageId: string | null = null;

    try {
      pageId = await createCursorPage(page.request, token);
      await seedCursor(page.request, token, pageId);
      await openBuilder(page, `/ko/admin-builder?pageId=${encodeURIComponent(pageId)}&collabCursor=${token}`);

      const cursor = page.locator('[data-builder-collab-cursor="true"]').first();
      await expect(cursor).toBeVisible();
      await expect(cursor).toContainText('Peer');
      await expect(cursor).toHaveAttribute('data-builder-collab-cursor-user', 'admin');
    } finally {
      if (pageId) {
        await page.request.delete(`/api/builder/site/pages/${pageId}?locale=ko`, {
          headers: mutationHeaders(slug),
          failOnStatusCode: false,
        });
      }
    }
  });
});

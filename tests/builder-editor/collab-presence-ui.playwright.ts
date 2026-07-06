import { expect, test, type APIRequestContext } from '@playwright/test';
import { openBuilder } from './helpers/editor';

function mutationHeaders(scope: string): Record<string, string> {
  const safeScope = scope.replace(/[^a-z0-9-]/gi, '-').slice(-48) || 'collab-presence-ui';
  return { 'x-forwarded-for': `pw-${safeScope}` };
}

async function createPresencePage(request: APIRequestContext, token: string): Promise<string> {
  const response = await request.post('/api/builder/site/pages', {
    data: {
      locale: 'ko',
      slug: `g-collab-presence-${token}`,
      title: `Collab Presence ${token}`,
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

async function seedPresence(request: APIRequestContext, token: string, pageId: string, sessionId: string): Promise<void> {
  const response = await request.post('/api/builder/collab/presence?locale=ko', {
    data: {
      siteId: 'default',
      pageId,
      sessionId,
    },
    headers: {
      'content-type': 'application/json',
      ...mutationHeaders(`${token}-${sessionId}`),
    },
  });
  expect(response.status()).toBe(200);
}

test.describe('/ko/admin-builder collaboration presence', () => {
  test('shows active editors in the editor top bar', async ({ page }) => {
    test.setTimeout(60_000);
    const token = Date.now().toString(36);
    const slug = `g-collab-presence-${token}`;
    let pageId: string | null = null;

    try {
      pageId = await createPresencePage(page.request, token);
      await seedPresence(page.request, token, pageId, `peer-${token}`);
      await openBuilder(page, `/ko/admin-builder?pageId=${encodeURIComponent(pageId)}&collabPresence=${token}`);

      const presenceChip = page.locator('[data-builder-topbar-presence="true"]');
      await expect(presenceChip).toBeVisible();
      await expect(presenceChip).toContainText('2명 접속 중');
      await expect(presenceChip).toHaveAttribute('title', /admin/);
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

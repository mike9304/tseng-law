import { expect, test, type APIRequestContext } from '@playwright/test';

const LOCALE = 'ko';
const TARGET_LOCALE = 'en';
const APP_ID = 'live-chat';

function mutationHeaders(scope: string): Record<string, string> {
  const safeScope = scope.replace(/[^a-z0-9-]/gi, '-').slice(-48) || 'app-translation';
  return { 'x-forwarded-for': `pw-${safeScope}` };
}

async function installLiveChat(request: APIRequestContext, token: string) {
  await request.delete(`/api/builder/apps/installations/${APP_ID}?locale=${LOCALE}`, {
    headers: mutationHeaders(`translation-clean-${token}`),
    failOnStatusCode: false,
  });
  const install = await request.post(`/api/builder/apps/installations?locale=${LOCALE}`, {
    headers: mutationHeaders(`translation-install-${token}`),
    data: { appId: APP_ID },
  });
  expect([200, 201]).toContain(install.status());
}

async function cleanupLiveChat(request: APIRequestContext, token: string) {
  await request.delete(`/api/builder/apps/installations/${APP_ID}?locale=${LOCALE}`, {
    headers: mutationHeaders(`translation-cleanup-${token}`),
    failOnStatusCode: false,
  });
}

test('/ko/admin-builder/translations exposes native app strings and applies app settings', async ({ page }) => {
  const token = Date.now().toString(36);
  const translatedTitle = `Tseng Law Chat ${token}`;
  await installLiveChat(page.request, token);

  try {
    await page.goto(`/${LOCALE}/admin-builder/translations?appTranslation=${token}`, { waitUntil: 'domcontentloaded' });
    await expect(page.locator('[data-translation-category="apps"]')).toBeVisible();
    await page.locator('[data-translation-category="apps"]').click();
    await page.getByPlaceholder('Search source, target, key...').fill('app:live-chat:setting:title:value');

    const row = page.locator('[data-translation-entry="app:live-chat:setting:title:value"]');
    await expect(row).toBeVisible();
    await expect(row).toContainText('호정국제 상담');

    const targetCell = row.locator('td').nth(3);
    await targetCell.locator('button').click();
    await targetCell.locator('textarea').fill(translatedTitle);
    await targetCell.getByRole('button', { name: 'Save' }).click();
    await expect(page.getByText('Translation saved.')).toBeVisible();

    const catalog = await page.request.get(`/api/builder/apps/installations?locale=${LOCALE}`, {
      headers: mutationHeaders(`translation-read-${token}`),
    });
    expect(catalog.status()).toBe(200);
    const payload = await catalog.json() as {
      entries?: Array<{
        manifest: { appId: string };
        installation?: { settings?: Record<string, unknown>; localizedSettings?: Record<string, Record<string, unknown>> };
      }>;
    };
    const liveChat = payload.entries?.find((entry) => entry.manifest.appId === APP_ID);
    expect(liveChat?.installation?.settings?.title).toBe('호정국제 상담');
    expect(liveChat?.installation?.localizedSettings?.[TARGET_LOCALE]?.title).toBe(translatedTitle);
  } finally {
    await cleanupLiveChat(page.request, token);
  }
});

import { expect, test, type APIRequestContext } from '@playwright/test';
import { getTranslationCopy } from '@/components/builder/translations/translation-copy';

const LOCALE = 'ko';
const TARGET_LOCALE = 'en';
const APP_ID = 'live-chat';
const COPY = getTranslationCopy(LOCALE);

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

async function createFaq(request: APIRequestContext, token: string) {
  const response = await request.post('/api/builder/faq', {
    headers: mutationHeaders(`translation-faq-create-${token}`),
    data: {
      locale: LOCALE,
      question: `앱 번역 FAQ 질문 ${token}`,
      answer: `앱 번역 FAQ 답변 ${token}`,
      categoryId: 'consultation',
      tags: ['app-translation', token],
      status: 'published',
      sortOrder: 20,
      schemaEnabled: true,
    },
  });
  expect(response.status()).toBe(201);
  const json = await response.json() as { ok?: boolean; item?: { faqId: string }; error?: string };
  expect(json.ok, json.error).toBe(true);
  expect(json.item?.faqId).toBeTruthy();
  return json.item!;
}

async function deleteFaq(request: APIRequestContext, faqId: string, token: string) {
  await request.delete(`/api/builder/faq/${faqId}`, {
    headers: mutationHeaders(`translation-faq-delete-${token}`),
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
    await page.waitForFunction(() => new URLSearchParams(window.location.search).get('category') === 'apps');
    await page.getByPlaceholder(COPY.managerSearchPlaceholder).fill('app:live-chat:setting:title:value');
    await page.waitForFunction(() => new URLSearchParams(window.location.search).get('search') === 'app:live-chat:setting:title:value');
    const shareLink = page.locator('[data-translation-share-link="true"]');
    await expect(shareLink).toHaveAttribute('href', /category=apps/);
    await expect(shareLink).toHaveAttribute('href', /search=app%3Alive-chat%3Asetting%3Atitle%3Avalue/);
    const reviewUrl = page.url();
    await page.reload({ waitUntil: 'domcontentloaded' });
    await page.waitForURL(reviewUrl);
    await expect(page.locator('[data-translation-category="apps"]')).toHaveAttribute('aria-pressed', 'true');
    await expect(page.getByPlaceholder(COPY.managerSearchPlaceholder)).toHaveValue('app:live-chat:setting:title:value');
    await page.getByRole('button', { name: COPY.managerResetView }).click();
    await page.waitForFunction(() => {
      const params = new URLSearchParams(window.location.search);
      return params.get('sourceLocale') === 'ko'
        && !params.has('category')
        && !params.has('search')
        && !params.has('status')
        && !params.has('target')
        && !params.has('targets');
    });
    await expect(page.locator('[data-translation-category="apps"]')).toHaveAttribute('aria-pressed', 'false');
    await expect(shareLink).toHaveAttribute('href', /sourceLocale=ko/);
    await expect(shareLink).not.toHaveAttribute('href', /category=apps/);
    await page.locator('[data-translation-category="apps"]').click();
    await page.waitForFunction(() => new URLSearchParams(window.location.search).get('category') === 'apps');
    await page.getByPlaceholder(COPY.managerSearchPlaceholder).fill('app:live-chat:setting:title:value');
    await page.waitForFunction(() => new URLSearchParams(window.location.search).get('search') === 'app:live-chat:setting:title:value');

    const row = page.locator('[data-translation-entry="app:live-chat:setting:title:value"]');
    await expect(row).toBeVisible();
    await expect(row).toContainText('호정국제 상담');

    const targetCell = row.locator('td').nth(2);
    await targetCell.locator('button').click();
    await targetCell.locator('textarea').fill(translatedTitle);
    const saveResponse = await page.request.patch('/api/builder/translations', {
      headers: mutationHeaders(`translation-save-${token}`),
      data: {
        key: 'app:live-chat:setting:title:value',
        targetLocale: TARGET_LOCALE,
        text: translatedTitle,
        status: 'manual',
        provider: 'manual',
        sourceLocale: LOCALE,
      },
    });
    expect(saveResponse.status()).toBe(200);
    const saveBody = await saveResponse.json() as { ok?: boolean; payload?: unknown; error?: string };
    expect(saveBody.ok, saveBody.error).toBe(true);

    await page.reload({ waitUntil: 'domcontentloaded' });
    await page.locator('[data-translation-category="apps"]').click();
    await page.getByPlaceholder(COPY.managerSearchPlaceholder).fill('app:live-chat:setting:title:value');
    await expect(page.locator('[data-translation-entry="app:live-chat:setting:title:value"]')).toContainText(translatedTitle);

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

test('/ko/admin-builder/translations exposes FAQ app content and applies FAQ translations', async ({ page }) => {
  const token = Date.now().toString(36);
  const translatedQuestion = `Translated FAQ question ${token}`;
  await installLiveChat(page.request, token);
  const faq = await createFaq(page.request, token);

  try {
    await page.goto(`/${LOCALE}/admin-builder/translations?appTranslation=${token}`, { waitUntil: 'domcontentloaded' });
    await expect(page.locator('[data-translation-category="apps"]')).toBeVisible();
    await page.locator('[data-translation-category="apps"]').click();
    await page.waitForFunction(() => new URLSearchParams(window.location.search).get('category') === 'apps');
    const faqKey = `app:faq-manager:content:faq:${faq.faqId}:question`;
    await page.getByPlaceholder(COPY.managerSearchPlaceholder).fill(faqKey);
    await page.waitForFunction((expectedKey) => new URLSearchParams(window.location.search).get('search') === expectedKey, faqKey);

    const row = page.locator(`[data-translation-entry="${faqKey}"]`);
    await expect(row).toBeVisible();
    await expect(row).toContainText(`앱 번역 FAQ 질문 ${token}`);

    const targetCell = row.locator('td').nth(2);
    await targetCell.locator('button').click();
    await targetCell.locator('textarea').fill(translatedQuestion);
    const faqSaveResponse = await page.request.patch('/api/builder/translations', {
      headers: mutationHeaders(`translation-save-${token}`),
      data: {
        key: faqKey,
        targetLocale: TARGET_LOCALE,
        text: translatedQuestion,
        status: 'manual',
        provider: 'manual',
        sourceLocale: LOCALE,
      },
    });
    expect(faqSaveResponse.status()).toBe(200);
    const faqSaveBody = await faqSaveResponse.json() as { ok?: boolean; payload?: unknown; error?: string };
    expect(faqSaveBody.ok, faqSaveBody.error).toBe(true);

    await page.reload({ waitUntil: 'domcontentloaded' });
    await page.locator('[data-translation-category="apps"]').click();
    await page.waitForFunction(() => new URLSearchParams(window.location.search).get('category') === 'apps');
    await page.getByPlaceholder(COPY.managerSearchPlaceholder).fill(faqKey);
    await expect(page.locator(`[data-translation-entry="${faqKey}"]`)).toContainText(translatedQuestion);

    const translatedAdminResponse = await page.request.get(`/api/builder/faq?locale=${TARGET_LOCALE}&status=all&q=${encodeURIComponent(translatedQuestion)}`);
    expect(translatedAdminResponse.status()).toBe(200);
    const translatedAdminJson = await translatedAdminResponse.json() as {
      total?: number;
      items?: Array<{ faqId: string; locale: string; question: string; answer: string }>;
      error?: string;
    };
    expect(translatedAdminJson.total ?? 0, translatedAdminJson.error).toBeGreaterThanOrEqual(1);
    expect(translatedAdminJson.items?.some((item) => item.locale === TARGET_LOCALE && item.question === translatedQuestion)).toBe(true);

    const translatedPublicResponse = await page.request.get(`/api/faq?locale=${TARGET_LOCALE}&q=${encodeURIComponent(translatedQuestion)}`);
    expect(translatedPublicResponse.status()).toBe(200);
    const translatedPublicJson = await translatedPublicResponse.json() as {
      total?: number;
      items?: Array<{ faqId: string; locale: string; question: string }>;
      error?: string;
    };
    expect(translatedPublicJson.items?.some((item) => item.locale === TARGET_LOCALE && item.question === translatedQuestion)).toBe(true);
  } finally {
    await deleteFaq(page.request, faq.faqId, token);
    await deleteFaq(page.request, `${faq.faqId}--${TARGET_LOCALE}`, token);
    await cleanupLiveChat(page.request, token);
  }
});

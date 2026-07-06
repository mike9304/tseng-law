import { expect, test, type APIRequestContext, type Page } from '@playwright/test';
import { openBuilder } from './helpers/editor';

type TranslationReleasePolicyMode =
  | 'acknowledge-other-page-warnings'
  | 'block-other-page-warnings';

type TestDocument = {
  readonly version: 1;
  readonly locale: 'ko';
  readonly updatedAt: string;
  readonly updatedBy: string;
  readonly stageWidth: number;
  readonly stageHeight: number;
  readonly nodes: readonly Record<string, unknown>[];
};

const baseStyle = {
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
};

function mutationHeaders(scope: string): Record<string, string> {
  const safeScope = scope.replace(/[^a-z0-9-]/gi, '-').slice(-48) || 'translation-release-policy';
  return { 'x-forwarded-for': `pw-${safeScope}` };
}

function makeDocument(token: string): TestDocument {
  const now = new Date().toISOString();
  return {
    version: 1,
    locale: 'ko',
    updatedAt: now,
    updatedBy: `translation-release-policy-${token}`,
    stageWidth: 1280,
    stageHeight: 720,
    nodes: [
      {
        id: `root-${token}`,
        kind: 'container',
        rect: { x: 0, y: 0, width: 1280, height: 720 },
        style: baseStyle,
        zIndex: 0,
        rotation: 0,
        locked: false,
        visible: true,
        content: {
          label: 'Translation release policy root',
          background: '#ffffff',
          borderColor: 'transparent',
          borderStyle: 'solid',
          borderWidth: 0,
          borderRadius: 0,
          padding: 0,
          layoutMode: 'absolute',
          as: 'main',
        },
      },
      {
        id: `title-${token}`,
        kind: 'text',
        parentId: `root-${token}`,
        rect: { x: 80, y: 72, width: 820, height: 110 },
        style: { ...baseStyle, borderRadius: 12 },
        zIndex: 1,
        rotation: 0,
        locked: false,
        visible: true,
        content: {
          text: `번역 릴리스 정책 ${token}`,
          fontSize: 44,
          color: '#0f172a',
          fontWeight: 'bold',
          align: 'left',
          lineHeight: 1.2,
          letterSpacing: 0,
          fontFamily: 'system-ui',
          verticalAlign: 'top',
          textTransform: 'none',
          as: 'h1',
        },
      },
    ],
  };
}

function isObjectRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

async function setTranslationReleasePolicy(
  request: APIRequestContext,
  mode: TranslationReleasePolicyMode,
  token: string,
): Promise<void> {
  const response = await request.put('/api/builder/site/translation-release-policy?locale=ko', {
    headers: mutationHeaders(`${token}-policy`),
    data: { mode },
  });
  expect(response.status()).toBe(200);
}

async function createSourceOnlyPage(request: APIRequestContext, token: string): Promise<string> {
  const response = await request.post('/api/builder/site/pages', {
    headers: mutationHeaders(token),
    data: {
      locale: 'ko',
      slug: `translation-release-policy-${token}`,
      title: `Translation Release Policy ${token}`,
      addToNavigation: false,
      document: makeDocument(token),
    },
  });
  expect(response.status()).toBe(200);
  const payload: unknown = await response.json();
  if (!isObjectRecord(payload) || payload.success !== true || typeof payload.pageId !== 'string') {
    throw new Error('Expected created page id.');
  }
  return payload.pageId;
}

async function deletePage(request: APIRequestContext, pageId: string | null, token: string): Promise<void> {
  if (!pageId) return;
  await request.delete(`/api/builder/site/pages/${pageId}?locale=ko`, {
    headers: mutationHeaders(`${token}-cleanup`),
    failOnStatusCode: false,
  });
}

function collectCriticalBrowserErrors(page: Page): string[] {
  const errors: string[] = [];
  page.on('console', (message) => {
    if (message.type() === 'error') errors.push(`console: ${message.text()}`);
  });
  page.on('pageerror', (error) => {
    errors.push(`pageerror: ${error.message}`);
  });
  return errors;
}

test('/ko/admin-builder blocks publish under organization translation release policy', async ({ page }) => {
  test.setTimeout(90_000);
  const token = Date.now().toString(36);
  const otherToken = `${token}-other`;
  const browserErrors = collectCriticalBrowserErrors(page);
  let pageId: string | null = null;
  let otherPageId: string | null = null;

  try {
    await setTranslationReleasePolicy(page.request, 'block-other-page-warnings', token);
    pageId = await createSourceOnlyPage(page.request, token);
    otherPageId = await createSourceOnlyPage(page.request, otherToken);

    await openBuilder(page, `/ko/admin-builder?pageId=${encodeURIComponent(pageId)}&translationReleasePolicy=${token}`);
    await page.getByRole('button', { name: /^Publish$|^게시$|^발행$/ }).click();

    const publishDialog = page.getByRole('dialog', { name: /페이지 발행|Publish Page/ });
    await expect(publishDialog).toBeVisible();

    const translationsItem = publishDialog.locator('[data-builder-publish-preflight-item="translations"]');
    await expect(translationsItem).toContainText('번역');
    await expect(translationsItem).toContainText('차단');

    const policyPanel = publishDialog.locator(
      '[data-builder-publish-translation-release-policy="block-other-page-warnings"]',
    );
    await expect(policyPanel).toBeVisible();
    await expect(policyPanel).toHaveAttribute('data-builder-publish-translation-release-policy-state', 'blocked');
    await expect(policyPanel).toContainText('조직 번역 릴리스 정책');
    await expect(policyPanel).toContainText('먼저 해결해야 발행을 허용합니다');
    await expect(policyPanel.locator('[data-builder-publish-translation-release-policy-action="true"]'))
      .toHaveAttribute('href', '/ko/admin-builder/translations?sourceLocale=ko&category=pages');

    const publishButton = publishDialog.getByRole('button', { name: /^발행$/ });
    const scheduleButton = publishDialog.locator('[data-builder-publish-schedule-action]').first();
    await expect(publishButton).toHaveAttribute('data-enabled', 'false');
    await expect(scheduleButton).toBeDisabled();
    await expect(publishDialog.getByRole('button', { name: '경고 무시하고 발행' })).toHaveCount(0);

    const siteReview = publishDialog.locator('[data-builder-publish-site-translation-review="true"]');
    const acknowledge = siteReview.locator('[data-builder-publish-site-translation-acknowledge="true"]');
    if (await acknowledge.count()) {
      await acknowledge.click();
      await expect(siteReview).toHaveAttribute('data-builder-publish-site-translation-review-state', 'acknowledged');
    }
    await expect(publishButton).toHaveAttribute('data-enabled', 'false');
    await expect(scheduleButton).toBeDisabled();
    await publishDialog.screenshot({ path: '/private/tmp/publish-translation-release-policy-blocked-ko.png' });
    expect(browserErrors).toEqual([]);
  } finally {
    await setTranslationReleasePolicy(page.request, 'acknowledge-other-page-warnings', `${token}-cleanup`)
      .catch(() => undefined);
    await deletePage(page.request, pageId, token);
    await deletePage(page.request, otherPageId, otherToken);
  }
});

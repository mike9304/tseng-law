import { expect, test, type APIRequestContext, type Page } from '@playwright/test';
import { openBuilder } from './helpers/editor';

type TestDocument = {
  readonly version: 1;
  readonly locale: 'ko';
  readonly updatedAt: string;
  readonly updatedBy: string;
  readonly stageWidth: number;
  readonly stageHeight: number;
  readonly nodes: readonly Record<string, unknown>[];
};

type CreatePagePayload = {
  readonly success?: boolean;
  readonly pageId?: string;
  readonly error?: string;
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
  const safeScope = scope.replace(/[^a-z0-9-]/gi, '-').slice(-48) || 'publish-preflight-translations';
  return { 'x-forwarded-for': `pw-${safeScope}` };
}

function makeDocument(token: string): TestDocument {
  const now = new Date().toISOString();
  return {
    version: 1,
    locale: 'ko',
    updatedAt: now,
    updatedBy: `publish-preflight-translations-${token}`,
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
          label: 'Publish translation preflight root',
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
          text: `번역 사전검사 ${token}`,
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

async function createSourceOnlyPage(
  request: APIRequestContext,
  token: string,
): Promise<string> {
  const response = await request.post('/api/builder/site/pages', {
    headers: mutationHeaders(token),
    data: {
      locale: 'ko',
      slug: `translation-preflight-${token}`,
      title: `Translation Preflight ${token}`,
      addToNavigation: false,
      document: makeDocument(token),
    },
  });
  expect(response.status()).toBe(200);
  const payload: CreatePagePayload = await response.json();
  expect(payload.success, payload.error).toBe(true);
  expect(payload.pageId).toBeTruthy();
  if (!payload.pageId) throw new Error('Expected created page id.');
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

test('/ko/admin-builder publish preflight surfaces missing translations', async ({ page }) => {
  test.setTimeout(90_000);
  const token = Date.now().toString(36);
  const otherToken = `${token}-other`;
  const browserErrors = collectCriticalBrowserErrors(page);
  let pageId: string | null = null;
  let otherPageId: string | null = null;

  try {
    pageId = await createSourceOnlyPage(page.request, token);
    otherPageId = await createSourceOnlyPage(page.request, otherToken);
    await openBuilder(page, `/ko/admin-builder?pageId=${encodeURIComponent(pageId)}&publishTranslations=${token}`);

    await page.getByRole('button', { name: /^Publish$|^게시$|^발행$/ }).click();
    const publishDialog = page.getByRole('dialog', { name: /페이지 발행|Publish Page/ });
    await expect(publishDialog).toBeVisible();

    const translationsItem = publishDialog.locator('[data-builder-publish-preflight-item="translations"]');
    await expect(translationsItem).toContainText('번역');
    await expect(translationsItem).toContainText('경고');
    await expect(publishDialog.getByText(/has no (en|zh-hant) translation/).first()).toBeVisible();

    const overrideReview = publishDialog.locator('[data-builder-publish-warning-override-review]');
    await expect(overrideReview).toHaveAttribute('data-builder-publish-warning-override-review', 'pending');
    await expect(overrideReview).toHaveAttribute('data-builder-publish-warning-override-count', '2');
    await expect(overrideReview).toContainText('경고 검토');
    await expect(overrideReview).toContainText('번역: 2개 경고');
    const siteReview = publishDialog.locator('[data-builder-publish-site-translation-review="true"]');
    await expect(siteReview).toBeVisible();
    await expect(siteReview).toHaveAttribute('data-builder-publish-site-translation-current', '2');
    await expect(siteReview).toHaveAttribute('data-builder-publish-site-translation-review-state', 'pending');
    await expect(siteReview).toContainText('사이트 번역 검토');
    await expect(siteReview).toContainText('현재 페이지: 2개');
    const totalWarnings = await siteReview.getAttribute('data-builder-publish-site-translation-total');
    const otherWarnings = await siteReview.getAttribute('data-builder-publish-site-translation-other');
    if (!totalWarnings || !otherWarnings) {
      throw new Error('Expected site translation review to include total and other-page counts.');
    }
    expect(Number(totalWarnings)).toBeGreaterThanOrEqual(2);
    expect(Number(otherWarnings)).toBe(Number(totalWarnings) - 2);
    expect(Number(otherWarnings)).toBeGreaterThanOrEqual(2);
    const siteReviewAction = siteReview.locator('[data-builder-publish-site-translation-action="true"]');
    await expect(siteReviewAction).toHaveText('전체 번역 검토');
    await expect(siteReviewAction).toHaveAttribute(
      'href',
      '/ko/admin-builder/translations?sourceLocale=ko&category=pages',
    );
    const siteAcknowledgeAction = siteReview.locator('[data-builder-publish-site-translation-acknowledge="true"]');
    await expect(siteAcknowledgeAction).toHaveText('다른 페이지 경고 확인');
    const publishButton = publishDialog.getByRole('button', { name: /^발행$/ });
    const scheduleButton = publishDialog.locator('[data-builder-publish-schedule-action]').first();
    await expect(publishButton).toHaveAttribute('data-enabled', 'false');
    await expect(scheduleButton).toBeDisabled();

    const reviewAction = publishDialog.locator('[data-builder-publish-issue-action^="translation-untranslated-"]').first();
    await expect(reviewAction).toBeVisible();
    await expect(reviewAction).toHaveText('검토');
    await reviewAction.scrollIntoViewIfNeeded();
    await publishDialog.screenshot({ path: '/private/tmp/publish-preflight-translations-ko.png' });

    await publishDialog.getByRole('button', { name: '경고 무시하고 발행' }).click();
    await expect(overrideReview).toHaveAttribute('data-builder-publish-warning-override-review', 'acknowledged');
    await expect(overrideReview).toContainText('경고 2개를 확인했습니다.');
    await expect(siteReview).toHaveAttribute('data-builder-publish-site-translation-review-state', 'pending');
    await expect(siteReview).toContainText(`다른 페이지 번역 경고 ${otherWarnings}개를 확인해야 발행 또는 예약을 계속할 수 있습니다.`);
    await expect(publishButton).toHaveAttribute('data-enabled', 'false');
    await expect(scheduleButton).toBeDisabled();
    await publishDialog.screenshot({ path: '/private/tmp/publish-preflight-site-translation-pending-ko.png' });

    await siteAcknowledgeAction.click();
    await expect(siteReview).toHaveAttribute('data-builder-publish-site-translation-review-state', 'acknowledged');
    await expect(siteReview).toContainText(`다른 페이지 번역 경고 ${otherWarnings}개를 확인했습니다.`);
    await expect(siteAcknowledgeAction).toHaveCount(0);
    await expect(publishButton).toHaveAttribute('data-enabled', 'true');
    await expect(scheduleButton).toBeEnabled();
    await publishDialog.screenshot({ path: '/private/tmp/publish-preflight-site-translation-ack-ko.png' });

    const href = await reviewAction.getAttribute('href');
    if (!href) throw new Error('Expected translation preflight issue action to include an href.');
    const expectedUrl = new URL(href, page.url());
    expect(expectedUrl.searchParams.get('sourceLocale')).toBe('ko');
    expect(expectedUrl.searchParams.get('category')).toBe('pages');
    expect(expectedUrl.searchParams.get('search')).toBe(pageId);
    expect(expectedUrl.searchParams.get('status')).toBe('missing');
    expect(expectedUrl.searchParams.get('target')).toMatch(/^(en|zh-hant)$/);

    await reviewAction.click();
    await page.waitForURL((url) => (
      url.searchParams.get('sourceLocale') === 'ko'
      && url.searchParams.get('category') === 'pages'
      && url.searchParams.get('search') === pageId
      && url.searchParams.get('status') === 'missing'
      && url.searchParams.get('target') === expectedUrl.searchParams.get('target')
    ));
    await expect(page.locator('[data-translation-search-input="true"]')).toHaveValue(pageId);
    await expect(page.locator('select').first()).toHaveValue('missing');
    await expect(page.locator('[data-translation-share-link="true"]')).toHaveAttribute('href', /target=/);
    expect(browserErrors).toEqual([]);
  } finally {
    await deletePage(page.request, pageId, token);
    await deletePage(page.request, otherPageId, otherToken);
  }
});

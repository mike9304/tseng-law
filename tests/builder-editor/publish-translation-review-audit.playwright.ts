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

type AuditPayload = {
  readonly ok: boolean;
  readonly events: readonly Record<string, unknown>[];
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
  const safeScope = scope.replace(/[^a-z0-9-]/gi, '-').slice(-48) || 'publish-review-audit';
  return { 'x-forwarded-for': `pw-${safeScope}` };
}

function makeDocument(token: string): TestDocument {
  const now = new Date().toISOString();
  return {
    version: 1,
    locale: 'ko',
    updatedAt: now,
    updatedBy: `publish-review-audit-${token}`,
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
          label: 'Publish review audit root',
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
          text: `번역 감사 검증 ${token}`,
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

function parseAuditPayload(value: unknown): AuditPayload | null {
  if (!isObjectRecord(value) || typeof value.ok !== 'boolean' || !Array.isArray(value.events)) {
    return null;
  }
  return { ok: value.ok, events: value.events.filter(isObjectRecord) };
}

async function createSourceOnlyPage(request: APIRequestContext, token: string): Promise<string> {
  const response = await request.post('/api/builder/site/pages', {
    headers: mutationHeaders(token),
    data: {
      locale: 'ko',
      slug: `translation-review-audit-${token}`,
      title: `Translation Review Audit ${token}`,
      addToNavigation: false,
      document: makeDocument(token),
    },
  });
  expect(response.status()).toBe(200);
  const payload = await response.json();
  if (!isObjectRecord(payload) || payload.success !== true || typeof payload.pageId !== 'string') {
    throw new Error('Expected created page id.');
  }
  return payload.pageId;
}

async function deletePage(
  request: APIRequestContext,
  pageId: string | null,
  token: string,
): Promise<void> {
  if (!pageId) return;
  await request.delete(`/api/builder/site/pages/${pageId}?locale=ko`, {
    headers: mutationHeaders(`${token}-cleanup`),
    failOnStatusCode: false,
  });
}

async function cancelScheduledPublish(
  request: APIRequestContext,
  pageId: string | null,
  token: string,
): Promise<void> {
  if (!pageId) return;
  await request.delete(`/api/builder/site/pages/${pageId}/scheduled-publish?locale=ko`, {
    headers: mutationHeaders(`${token}-schedule-cleanup`),
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

async function hasTranslationReviewAudit(
  request: APIRequestContext,
  pageId: string,
  otherPageCount: number,
): Promise<boolean> {
  const response = await request.get('/api/builder/site/audit?locale=ko&limit=100');
  if (!response.ok()) return false;
  const payload = parseAuditPayload(await response.json());
  if (!payload?.ok) return false;

  return payload.events.some((event) => (
    event.type === 'publish.translation_site_review'
    && event.action === 'schedule'
    && event.pageId === pageId
    && event.siteId === 'tseng-law-main-site'
    && event.sourceLocale === 'ko'
    && event.otherPageCount === otherPageCount
    && typeof event.jobId === 'string'
    && typeof event.scheduledAt === 'string'
  ));
}

test('/ko/admin-builder records translation site review audit when scheduled', async ({ page }) => {
  test.setTimeout(90_000);
  const token = Date.now().toString(36);
  const otherToken = `${token}-other`;
  const browserErrors = collectCriticalBrowserErrors(page);
  let pageId: string | null = null;
  let otherPageId: string | null = null;

  try {
    pageId = await createSourceOnlyPage(page.request, token);
    otherPageId = await createSourceOnlyPage(page.request, otherToken);
    await openBuilder(page, `/ko/admin-builder?pageId=${encodeURIComponent(pageId)}&publishReviewAudit=${token}`);

    await page.getByRole('button', { name: /^Publish$|^게시$|^발행$/ }).click();
    const publishDialog = page.getByRole('dialog', { name: /페이지 발행|Publish Page/ });
    await expect(publishDialog).toBeVisible();

    await publishDialog.getByRole('button', { name: '경고 무시하고 발행' }).click();
    const siteReview = publishDialog.locator('[data-builder-publish-site-translation-review="true"]');
    const otherWarnings = await siteReview.getAttribute('data-builder-publish-site-translation-other');
    if (!otherWarnings) throw new Error('Expected site translation review other-page count.');

    await siteReview.locator('[data-builder-publish-site-translation-acknowledge="true"]').click();
    await expect(siteReview).toHaveAttribute('data-builder-publish-site-translation-review-state', 'acknowledged');

    const scheduleButton = publishDialog.locator('[data-builder-publish-schedule-action]').first();
    await expect(scheduleButton).toBeEnabled();
    const scheduleResponse = page.waitForResponse((response) => (
      response.url().includes(`/api/builder/site/pages/${pageId}/scheduled-publish?locale=ko`)
      && response.request().method() === 'POST'
    ));
    await scheduleButton.click();
    expect((await scheduleResponse).status()).toBe(200);
    await publishDialog.screenshot({ path: '/private/tmp/publish-translation-review-audit-scheduled-ko.png' });

    await expect.poll(
      () => hasTranslationReviewAudit(page.request, pageId ?? '', Number(otherWarnings)),
      { timeout: 10_000 },
    ).toBe(true);
    expect(browserErrors).toEqual([]);
  } finally {
    await cancelScheduledPublish(page.request, pageId, token);
    await deletePage(page.request, pageId, token);
    await deletePage(page.request, otherPageId, otherToken);
  }
});

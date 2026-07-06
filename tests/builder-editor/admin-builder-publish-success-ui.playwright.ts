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
  const safeScope = scope.replace(/[^a-z0-9-]/gi, '-').slice(-48) || 'publish-success-ui';
  return { 'x-forwarded-for': `pw-${safeScope}` };
}

function makePublishableDocument(token: string, title: string): TestDocument {
  const now = new Date().toISOString();
  return {
    version: 1,
    locale: 'ko',
    updatedAt: now,
    updatedBy: `publish-success-ui-${token}`,
    stageWidth: 1280,
    stageHeight: 760,
    nodes: [
      {
        id: `root-${token}`,
        kind: 'container',
        rect: { x: 0, y: 0, width: 1280, height: 760 },
        style: { ...baseStyle, borderRadius: 0 },
        zIndex: 0,
        rotation: 0,
        locked: false,
        visible: true,
        content: {
          label: 'Publish success root',
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
        rect: { x: 80, y: 72, width: 760, height: 104 },
        style: { ...baseStyle, borderRadius: 14 },
        zIndex: 1,
        rotation: 0,
        locked: false,
        visible: true,
        content: {
          text: title,
          fontSize: 42,
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
      {
        id: `image-${token}`,
        kind: 'image',
        parentId: `root-${token}`,
        rect: { x: 80, y: 220, width: 420, height: 260 },
        style: { ...baseStyle, borderRadius: 18 },
        zIndex: 2,
        rotation: 0,
        locked: false,
        visible: true,
        content: {
          src: '/images/blog/001-taiwan-company-establishment-basics/featured-01.jpg',
          alt: `Publish success verification image ${token}`,
          fit: 'cover',
        },
      },
      {
        id: `button-${token}`,
        kind: 'button',
        parentId: `root-${token}`,
        rect: { x: 80, y: 526, width: 220, height: 56 },
        style: { ...baseStyle, borderRadius: 999 },
        zIndex: 3,
        rotation: 0,
        locked: false,
        visible: true,
        content: {
          label: '문의하기',
          href: '/ko/contact',
          style: 'primary-solid',
          as: 'a',
        },
      },
    ],
  };
}

async function createPublishablePage(
  request: APIRequestContext,
  token: string,
): Promise<{ readonly pageId: string; readonly slug: string; readonly title: string }> {
  const slug = `pub-success-ui-${token}`;
  const title = `UI publish title ${token}`;
  const response = await request.post('/api/builder/site/pages', {
    headers: mutationHeaders(token),
    data: {
      locale: 'ko',
      slug,
      title: `UI Publish ${token}`,
      addToNavigation: false,
      document: makePublishableDocument(token, title),
    },
  });
  expect(response.status()).toBe(200);
  const payload: CreatePagePayload = await response.json();
  expect(payload.success, payload.error).toBe(true);
  expect(payload.pageId).toBeTruthy();
  if (!payload.pageId) throw new Error('Expected created page id.');
  return { pageId: payload.pageId, slug, title };
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

test('/ko/admin-builder shows publish success and published page hydrates cleanly', async ({ page }) => {
  test.setTimeout(180_000);
  const token = Date.now().toString(36);
  const browserErrors = collectCriticalBrowserErrors(page);
  let pageId: string | null = null;

  try {
    const created = await createPublishablePage(page.request, token);
    pageId = created.pageId;
    await openBuilder(page, `/ko/admin-builder?pageId=${encodeURIComponent(created.pageId)}&publishSuccess=${token}`);

    await page.getByRole('button', { name: /^Publish$|^게시$|^발행$/ }).click();
    const publishDialog = page.getByRole('dialog', { name: /페이지 발행|Publish Page/ });
    await expect(publishDialog).toBeVisible();
    await expect(page.locator('[data-builder-publish-preflight-item]').first()).toBeVisible();

    const translationReview = publishDialog.locator('[data-builder-publish-site-translation-review="true"]');
    const translationAcknowledge = translationReview.locator('[data-builder-publish-site-translation-acknowledge="true"]');
    if (await translationAcknowledge.isVisible().catch(() => false)) {
      await translationAcknowledge.click();
      await expect(translationReview).toHaveAttribute('data-builder-publish-site-translation-acknowledged', 'true');
    }

    const warningOverride = publishDialog.getByRole('button', { name: /^경고 무시하고 발행$|^Publish anyway$/ });
    if (await warningOverride.isVisible().catch(() => false)) {
      await warningOverride.click();
    }

    const publishResponse = page.waitForResponse((response) => (
      response.request().method() === 'POST'
      && response.url().includes(`/api/builder/site/pages/${created.pageId}/publish`)
    ), { timeout: 60_000 });
    await publishDialog.getByRole('button', { name: /^발행$|^Publish$/ }).last().click();
    expect((await publishResponse).status()).toBe(200);

    await expect(publishDialog.getByText('발행 완료!')).toBeVisible();
    await expect(publishDialog.getByRole('link', { name: new RegExp(`/ko/${created.slug}`) })).toBeVisible();

    await page.goto(`/ko/${created.slug}?publishSuccess=${token}`, { waitUntil: 'domcontentloaded' });
    await expect(page.getByText(created.title)).toBeVisible();
    expect(browserErrors).toEqual([]);
  } finally {
    await deletePage(page.request, pageId, token);
  }
});

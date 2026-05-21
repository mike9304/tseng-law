import { expect, test, type APIRequestContext } from '@playwright/test';

const LOCALE = 'ko';
const APP_ID = 'site-search';

type TestDocument = {
  version: 1;
  locale: typeof LOCALE;
  updatedAt: string;
  updatedBy: string;
  stageWidth: number;
  stageHeight: number;
  nodes: Array<Record<string, unknown>>;
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
  const safeScope = scope.replace(/[^a-z0-9-]/gi, '-').slice(-48) || 'app-runtime';
  return { 'x-forwarded-for': `pw-${safeScope}` };
}

function siteSearchNode(
  id: string,
  y: number,
  appWidget?: { appId: string; widgetId: string },
): Record<string, unknown> {
  return {
    id,
    kind: 'site-search',
    rect: { x: 96, y, width: 620, height: 64 },
    style: baseStyle,
    zIndex: 1,
    rotation: 0,
    locked: false,
    visible: true,
    ...(appWidget ? { appWidget } : {}),
    content: {
      placeholder: '검색어를 입력하세요',
      submitLabel: '검색',
      showResultsInline: true,
      kinds: ['page'],
      locale: LOCALE,
      maxResults: 5,
    },
  };
}

function makeAppRuntimeDocument(): TestDocument {
  return {
    version: 1,
    locale: LOCALE,
    updatedAt: new Date().toISOString(),
    updatedBy: 'app-runtime-playwright',
    stageWidth: 1280,
    stageHeight: 320,
    nodes: [
      siteSearchNode('app-runtime-search', 64, {
        appId: APP_ID,
        widgetId: 'search-box',
      }),
      siteSearchNode('legacy-search', 168),
    ],
  };
}

async function installApp(request: APIRequestContext, scope: string) {
  const response = await request.post(`/api/builder/apps/installations?locale=${LOCALE}`, {
    headers: mutationHeaders(scope),
    data: { appId: APP_ID },
  });
  expect([200, 201]).toContain(response.status());
}

async function disableApp(request: APIRequestContext, scope: string) {
  const response = await request.patch(`/api/builder/apps/installations/${APP_ID}?locale=${LOCALE}`, {
    headers: mutationHeaders(scope),
    data: { status: 'disabled' },
  });
  expect(response.status()).toBe(200);
}

async function uninstallIfPresent(request: APIRequestContext, scope: string) {
  await request.delete(`/api/builder/apps/installations/${APP_ID}?locale=${LOCALE}`, {
    headers: mutationHeaders(scope),
    failOnStatusCode: false,
  });
}

async function createPublishedPage(request: APIRequestContext, slug: string, token: string): Promise<string> {
  const createResponse = await request.post('/api/builder/site/pages', {
    headers: mutationHeaders(`app-runtime-create-${token}`),
    data: {
      locale: LOCALE,
      slug,
      title: `App Runtime ${token}`,
      document: makeAppRuntimeDocument(),
    },
  });
  expect(createResponse.status()).toBe(200);
  const created = (await createResponse.json()) as { success?: boolean; pageId?: string; error?: string };
  expect(created.success, created.error).toBe(true);
  expect(created.pageId).toBeTruthy();

  const publishResponse = await request.post(`/api/builder/site/pages/${created.pageId}/publish?locale=${LOCALE}`, {
    headers: mutationHeaders(`app-runtime-publish-${token}`),
  });
  expect(publishResponse.status()).toBe(200);
  const published = (await publishResponse.json()) as { ok?: boolean; error?: string };
  expect(published.ok, published.error).toBe(true);

  return created.pageId!;
}

test('published app widget runtime renders only when the app is enabled', async ({ page }) => {
  const token = Date.now().toString(36);
  const slug = `app-runtime-${token}`;
  let pageId: string | null = null;

  await uninstallIfPresent(page.request, `app-runtime-clean-before-${token}`);

  try {
    await installApp(page.request, `app-runtime-install-${token}`);
    pageId = await createPublishedPage(page.request, slug, token);

    await page.goto(`/${LOCALE}/${slug}?enabled=${token}`, { waitUntil: 'domcontentloaded' });
    const appNode = page.locator('[data-node-id="app-runtime-search"]');
    await expect(appNode).toHaveAttribute('data-builder-app-widget', 'app:site-search:search-box');
    await expect(appNode).toHaveAttribute('data-builder-app-runtime', 'enabled');
    await expect(appNode).toHaveAttribute('data-builder-app-runtime-status', 'enabled');
    await expect(appNode).toHaveAttribute('data-builder-app-id', APP_ID);
    await expect(appNode).toHaveAttribute('data-builder-app-widget-id', 'search-box');
    await expect(appNode).toHaveAttribute('data-builder-app-instance-id', 'app-runtime-search');
    await expect(appNode).toHaveAttribute('data-builder-app-runtime-loaded', 'true');
    await expect(appNode.locator('[data-builder-site-search="true"]')).toBeVisible();
    await expect(appNode.locator('#builder-site-search-results-app-runtime-search')).toBeAttached();
    await expect(page.locator('[data-node-id="legacy-search"] [data-builder-site-search="true"]')).toBeVisible();
    await expect(page.locator('[data-builder-app-runtime-placeholder="true"]')).toHaveCount(0);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);

    await disableApp(page.request, `app-runtime-disable-${token}`);
    await page.goto(`/${LOCALE}/${slug}?disabled=${token}`, { waitUntil: 'domcontentloaded' });

    const disabledAppNode = page.locator('[data-node-id="app-runtime-search"]');
    await expect(disabledAppNode).toHaveAttribute('data-builder-app-runtime', 'disabled');
    await expect(disabledAppNode).toHaveAttribute('data-builder-app-runtime-status', 'disabled');
    await expect(disabledAppNode.locator('[data-builder-site-search="true"]')).toHaveCount(0);
    await expect(disabledAppNode.locator('[data-builder-app-runtime-placeholder="true"]'))
      .toContainText('이 기능은 일시적으로 사용할 수 없습니다.');
    await expect(page.locator('[data-node-id="legacy-search"] [data-builder-site-search="true"]')).toBeVisible();
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
  } finally {
    if (pageId) {
      await page.request.delete(`/api/builder/site/pages/${pageId}?locale=${LOCALE}`, {
        headers: mutationHeaders(`app-runtime-delete-${token}`),
        failOnStatusCode: false,
      });
    }
    await uninstallIfPresent(page.request, `app-runtime-clean-after-${token}`);
  }
});

import { expect, test, type APIRequestContext } from '@playwright/test';

const LOCALE = 'ko';
const APP_ID = 'faq-manager';

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
  const safeScope = scope.replace(/[^a-z0-9-]/gi, '-').slice(-48) || 'faq-app';
  return { 'x-forwarded-for': `pw-${safeScope}` };
}

async function installFaqApp(request: APIRequestContext, token: string) {
  const response = await request.post(`/api/builder/apps/installations?locale=${LOCALE}`, {
    headers: mutationHeaders(`f47-install-${token}`),
    data: { appId: APP_ID },
  });
  expect([200, 201]).toContain(response.status());
}

async function uninstallFaqApp(request: APIRequestContext, token: string) {
  await request.delete(`/api/builder/apps/installations/${APP_ID}?locale=${LOCALE}`, {
    headers: mutationHeaders(`f47-uninstall-${token}`),
    failOnStatusCode: false,
  });
}

async function createFaq(request: APIRequestContext, token: string, status: 'draft' | 'published' = 'published') {
  const response = await request.post('/api/builder/faq', {
    headers: mutationHeaders(`f47-faq-create-${token}-${status}`),
    data: {
      locale: LOCALE,
      question: `F47 FAQ 앱 검색 질문 ${token}`,
      answer: `F47 FAQ 앱 공개 답변 ${token} category search schema`,
      categoryId: 'consultation',
      tags: ['f47', token],
      status,
      sortOrder: 3,
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
    headers: mutationHeaders(`f47-faq-delete-${token}`),
    failOnStatusCode: false,
  });
}

function widgetNode(
  id: string,
  kind: string,
  y: number,
  height: number,
  appWidget: { appId: string; widgetId: string },
  content: Record<string, unknown>,
) {
  return {
    id,
    kind,
    rect: { x: 80, y, width: 1120, height },
    style: baseStyle,
    zIndex: 1,
    rotation: 0,
    locked: false,
    visible: true,
    appWidget,
    content,
  };
}

function makePublishedFaqWidgetDocument(token: string) {
  return {
    version: 1,
    locale: LOCALE,
    updatedAt: new Date().toISOString(),
    updatedBy: `f47-faq-widgets-${token}`,
    stageWidth: 1280,
    stageHeight: 780,
    nodes: [
      widgetNode('f47-faq-list', 'faqList', 40, 560, { appId: APP_ID, widgetId: 'faq-list' }, {
        source: 'app',
        categoryId: 'consultation',
        showSearch: true,
        showCategoryFilter: true,
        expandFirst: true,
        schemaEnabled: true,
        limit: 50,
      }),
      widgetNode('f47-faq-search', 'site-search', 640, 64, { appId: APP_ID, widgetId: 'faq-search' }, {
        placeholder: 'FAQ 검색',
        submitLabel: '검색',
        showResultsInline: true,
        kinds: ['faq'],
        locale: '',
        maxResults: 8,
      }),
    ],
  };
}

async function createPublishedPage(request: APIRequestContext, slug: string, token: string): Promise<string> {
  const createResponse = await request.post('/api/builder/site/pages', {
    headers: mutationHeaders(`f47-page-create-${token}`),
    data: {
      locale: LOCALE,
      slug,
      title: `F47 FAQ Widgets ${token}`,
      document: makePublishedFaqWidgetDocument(token),
    },
  });
  expect(createResponse.status()).toBe(200);
  const created = await createResponse.json() as { success?: boolean; pageId?: string; error?: string };
  expect(created.success, created.error).toBe(true);
  expect(created.pageId).toBeTruthy();

  const publishResponse = await request.post(`/api/builder/site/pages/${created.pageId}/publish?locale=${LOCALE}`, {
    headers: mutationHeaders(`f47-page-publish-${token}`),
  });
  expect(publishResponse.status()).toBe(200);
  const published = await publishResponse.json() as { ok?: boolean; error?: string };
  expect(published.ok, published.error).toBe(true);
  return created.pageId!;
}

async function rebuildSearch(request: APIRequestContext, token: string) {
  const response = await request.post('/api/builder/search/rebuild', {
    headers: mutationHeaders(`f47-search-rebuild-${token}`),
  });
  expect(response.status()).toBe(200);
}

test('native FAQ app backs public FAQ page, widgets, schema, and search index', async ({ page }) => {
  const token = Date.now().toString(36);
  const pageSlug = `f47-faq-widgets-${token}`;
  const createdFaqIds: string[] = [];
  let pageId: string | null = null;

  await uninstallFaqApp(page.request, token);

  try {
    await installFaqApp(page.request, token);
    const publishedFaq = await createFaq(page.request, token, 'published');
    createdFaqIds.push(publishedFaq.faqId);
    const draftFaq = await createFaq(page.request, `${token}-draft`, 'draft');
    createdFaqIds.push(draftFaq.faqId);

    const adminResponse = await page.request.get(`/api/builder/faq?locale=${LOCALE}&status=all&q=${token}`);
    expect(adminResponse.status()).toBe(200);
    const adminJson = await adminResponse.json() as { total?: number; items?: Array<{ status: string }>; error?: string };
    expect(adminJson.total ?? 0, adminJson.error).toBeGreaterThanOrEqual(2);
    expect(adminJson.items?.some((item) => item.status === 'draft')).toBe(true);

    const publicApiResponse = await page.request.get(`/api/faq?locale=${LOCALE}&category=consultation&q=${token}`);
    expect(publicApiResponse.status()).toBe(200);
    const publicApiJson = await publicApiResponse.json() as { total?: number; items?: Array<{ question: string }>; error?: string };
    expect(publicApiJson.items?.map((item) => item.question)).toContain(`F47 FAQ 앱 검색 질문 ${token}`);
    expect(publicApiJson.items?.map((item) => item.question)).not.toContain(`F47 FAQ 앱 검색 질문 ${token}-draft`);

    await page.goto(`/${LOCALE}/faq?category=consultation`, { waitUntil: 'domcontentloaded' });
    await expect(page.locator('[data-public-faq-explorer="true"]')).toContainText(`F47 FAQ 앱 검색 질문 ${token}`);
    await page.locator('[data-public-faq-explorer="true"] input[type="search"]').fill(token);
    await expect(page.locator('[data-public-faq-item]').filter({ hasText: token })).toHaveCount(1);
    await expect(page.locator('[data-public-faq-explorer="true"]')).not.toContainText(`F47 FAQ 앱 검색 질문 ${token}-draft`);
    const publicJsonLd = await page.locator('script[type="application/ld+json"]').evaluateAll((nodes) => nodes.map((node) => node.textContent ?? '').join('\n'));
    expect(publicJsonLd).toContain('"@type":"FAQPage"');
    expect(publicJsonLd).toContain(`F47 FAQ 앱 검색 질문 ${token}`);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);

    pageId = await createPublishedPage(page.request, pageSlug, token);
    await page.goto(`/${LOCALE}/${pageSlug}`, { waitUntil: 'networkidle' });
    await expect(page.locator('[data-node-id="f47-faq-list"]')).toHaveAttribute('data-builder-app-runtime-status', 'enabled');
    await expect(page.locator('[data-node-id="f47-faq-search"]')).toHaveAttribute('data-builder-app-runtime-status', 'enabled');
    await expect(page.locator('[data-builder-faq-widget="true"]')).toContainText(`F47 FAQ 앱 검색 질문 ${token}`);
    await expect(page.locator('[data-builder-site-search="true"]')).toHaveAttribute('data-builder-site-search-kinds', 'faq');
    await page.locator('[data-builder-faq-widget="true"] input[type="search"]').fill(token);
    await expect(page.locator('[data-builder-faq-item]').filter({ hasText: token })).toHaveCount(1);
    const widgetJsonLd = await page.locator('script[type="application/ld+json"]').evaluateAll((nodes) => nodes.map((node) => node.textContent ?? '').join('\n'));
    expect(widgetJsonLd).toContain(`F47 FAQ 앱 검색 질문 ${token}`);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);

    await rebuildSearch(page.request, token);
    const searchResponse = await page.request.get(`/api/search?locale=${LOCALE}&kinds=faq&q=${encodeURIComponent(token)}`);
    expect(searchResponse.status()).toBe(200);
    const searchJson = await searchResponse.json() as { hits?: Array<{ kind: string; title: string; url: string }> };
    expect(searchJson.hits?.some((hit) => hit.kind === 'faq' && hit.title.includes(token))).toBe(true);
  } finally {
    if (pageId) {
      await page.request.delete(`/api/builder/site/pages/${pageId}?locale=${LOCALE}`, {
        headers: mutationHeaders(`f47-page-delete-${token}`),
        failOnStatusCode: false,
      });
    }
    for (const faqId of createdFaqIds) {
      await deleteFaq(page.request, faqId, token);
    }
    await uninstallFaqApp(page.request, token);
  }
});

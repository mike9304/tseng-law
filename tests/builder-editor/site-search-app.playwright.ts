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
  const safeScope = scope.replace(/[^a-z0-9-]/gi, '-').slice(-48) || 'site-search-app';
  return { 'x-forwarded-for': `pw-${safeScope}` };
}

function makeSearchDocument(token: string): TestDocument {
  return {
    version: 1,
    locale: LOCALE,
    updatedAt: new Date().toISOString(),
    updatedBy: 'site-search-app-playwright',
    stageWidth: 1280,
    stageHeight: 320,
    nodes: [
      {
        id: `search-title-${token}`,
        kind: 'text',
        rect: { x: 96, y: 64, width: 780, height: 56 },
        style: baseStyle,
        zIndex: 1,
        rotation: 0,
        locked: false,
        visible: true,
        content: {
          text: `Site Search App ${token}`,
          tag: 'h1',
          fontSize: 36,
          fontFamily: 'system-ui',
          fontWeight: 'bold',
          color: '#0f172a',
          align: 'left',
          lineHeight: 1.15,
        },
      },
      {
        id: `search-widget-${token}`,
        kind: 'site-search',
        rect: { x: 96, y: 146, width: 620, height: 88 },
        style: baseStyle,
        zIndex: 2,
        rotation: 0,
        locked: false,
        visible: true,
        appWidget: {
          appId: APP_ID,
          widgetId: 'search-box',
        },
        content: {
          placeholder: '포트폴리오 검색',
          submitLabel: '검색',
          showResultsInline: true,
          kinds: ['portfolio'],
          locale: LOCALE,
          maxResults: 5,
        },
      },
    ],
  };
}

async function uninstallIfPresent(request: APIRequestContext, scope: string) {
  await request.delete(`/api/builder/apps/installations/${APP_ID}?locale=${LOCALE}`, {
    headers: mutationHeaders(scope),
    failOnStatusCode: false,
  });
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

async function createPortfolioProject(request: APIRequestContext, token: string): Promise<string> {
  const response = await request.post('/api/builder/portfolio', {
    headers: mutationHeaders(`search-portfolio-create-${token}`),
    data: {
      locale: LOCALE,
      title: `검색 포트폴리오 ${token}`,
      slug: `search-portfolio-${token}`,
      summary: `네이티브 검색 포트폴리오 요약 ${token}`,
      description: `검색 앱 공개 결과 검증 ${token}`,
      body: `포트폴리오 상세 본문 site search native index ${token}`,
      category: 'company-setup',
      completedAt: '2026-05-20',
      tags: ['site-search', token],
      status: 'published',
      featured: true,
      order: 0,
      coverImageUrl: '/images/001-taiwan-company-establishment-basics/featured-01.jpg',
      gallery: [],
    },
  });
  expect(response.status()).toBe(201);
  const payload = await response.json() as { ok?: boolean; project?: { projectId: string } };
  expect(payload.ok).toBe(true);
  expect(payload.project?.projectId).toBeTruthy();
  return payload.project!.projectId;
}

async function deletePortfolioProject(request: APIRequestContext, projectId: string | null, token: string) {
  if (!projectId) return;
  await request.delete(`/api/builder/portfolio/${encodeURIComponent(projectId)}`, {
    headers: mutationHeaders(`search-portfolio-delete-${token}`),
    failOnStatusCode: false,
  });
}

async function rebuildSearchIndex(request: APIRequestContext, token: string) {
  const response = await request.post('/api/builder/search/rebuild', {
    headers: mutationHeaders(`search-rebuild-${token}`),
  });
  expect(response.status()).toBe(200);
  const payload = await response.json() as { ok?: boolean; byLocale?: Record<string, number> };
  expect(payload.ok).toBe(true);
  expect(payload.byLocale?.[LOCALE]).toBeGreaterThan(0);
}

async function createPublishedPage(request: APIRequestContext, slug: string, token: string): Promise<string> {
  const createResponse = await request.post('/api/builder/site/pages', {
    headers: mutationHeaders(`search-page-create-${token}`),
    data: {
      locale: LOCALE,
      slug,
      title: `Site Search App ${token}`,
      document: makeSearchDocument(token),
    },
  });
  expect(createResponse.status()).toBe(200);
  const created = (await createResponse.json()) as { success?: boolean; pageId?: string; error?: string };
  expect(created.success, created.error).toBe(true);
  expect(created.pageId).toBeTruthy();

  const publishResponse = await request.post(`/api/builder/site/pages/${created.pageId}/publish?locale=${LOCALE}`, {
    headers: mutationHeaders(`search-page-publish-${token}`),
  });
  expect(publishResponse.status()).toBe(200);
  const published = (await publishResponse.json()) as { ok?: boolean; error?: string };
  expect(published.ok, published.error).toBe(true);

  return created.pageId!;
}

test('native site search app uses one index for inline results, fallback results page, and widget runtime gating', async ({ page }) => {
  const token = Date.now().toString(36);
  const slug = `site-search-app-${token}`;
  let pageId: string | null = null;
  let projectId: string | null = null;

  await uninstallIfPresent(page.request, `search-clean-before-${token}`);

  try {
    await installApp(page.request, `search-install-${token}`);
    projectId = await createPortfolioProject(page.request, token);
    await rebuildSearchIndex(page.request, token);
    pageId = await createPublishedPage(page.request, slug, token);

    await page.goto(`/${LOCALE}/${slug}?enabled=${token}`, { waitUntil: 'domcontentloaded' });
    const widgetNode = page.locator(`[data-node-id="search-widget-${token}"]`);
    await expect(widgetNode).toHaveAttribute('data-builder-app-widget', 'app:site-search:search-box');
    await expect(widgetNode).toHaveAttribute('data-builder-app-runtime-status', 'enabled');
    await expect(widgetNode.locator('[data-builder-site-search="true"]')).toHaveAttribute('data-builder-site-search-kinds', 'portfolio');

    const form = widgetNode.locator('[data-builder-site-search="true"]');
    const input = form.locator('[data-builder-site-search-input="true"]');
    await input.fill(token);
    await expect(form.locator('[data-builder-site-search-results="true"]')).toContainText(`검색 포트폴리오 ${token}`);
    await expect(form.locator('.builder-site-search-hit').first()).toHaveAttribute('href', `/${LOCALE}/portfolio/search-portfolio-${token}`);

    await input.press('Enter');
    await expect(page).toHaveURL(new RegExp(`/${LOCALE}/search\\?`));
    await expect(page.locator('.search-results-section')).toContainText(`검색 포트폴리오 ${token}`);
    await expect(page.locator('.search-results-section')).toContainText('포트폴리오');

    const apiResponse = await page.request.get(`/api/search?locale=${LOCALE}&kinds=portfolio&q=${encodeURIComponent(token)}`);
    expect(apiResponse.status()).toBe(200);
    const apiPayload = await apiResponse.json() as { hits?: Array<{ kind: string; title: string; url: string }> };
    expect(apiPayload.hits?.some((hit) => (
      hit.kind === 'portfolio' &&
      hit.title === `검색 포트폴리오 ${token}` &&
      hit.url === `/${LOCALE}/portfolio/search-portfolio-${token}`
    ))).toBe(true);

    await page.setViewportSize({ width: 375, height: 720 });
    await page.goto(`/${LOCALE}/${slug}?mobile=${token}`, { waitUntil: 'domcontentloaded' });
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);

    await disableApp(page.request, `search-disable-${token}`);
    await page.goto(`/${LOCALE}/${slug}?disabled=${token}`, { waitUntil: 'domcontentloaded' });
    const disabledNode = page.locator(`[data-node-id="search-widget-${token}"]`);
    await expect(disabledNode).toHaveAttribute('data-builder-app-runtime-status', 'disabled');
    await expect(disabledNode.locator('[data-builder-app-runtime-placeholder="true"]'))
      .toContainText('이 기능은 일시적으로 사용할 수 없습니다.');
  } finally {
    if (pageId) {
      await page.request.delete(`/api/builder/site/pages/${pageId}?locale=${LOCALE}`, {
        headers: mutationHeaders(`search-page-delete-${token}`),
        failOnStatusCode: false,
      });
    }
    await deletePortfolioProject(page.request, projectId, token);
    await rebuildSearchIndex(page.request, `cleanup-${token}`).catch(() => undefined);
    await uninstallIfPresent(page.request, `search-clean-after-${token}`);
  }
});

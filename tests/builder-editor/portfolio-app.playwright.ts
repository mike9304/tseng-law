import { expect, test, type APIRequestContext } from '@playwright/test';

const LOCALE = 'ko';
const APP_ID = 'native-portfolio';

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
  const safeScope = scope.replace(/[^a-z0-9-]/gi, '-').slice(-48) || 'portfolio-app';
  return { 'x-forwarded-for': `pw-${safeScope}` };
}

function makePortfolioDocument(token: string): TestDocument {
  return {
    version: 1,
    locale: LOCALE,
    updatedAt: new Date().toISOString(),
    updatedBy: 'portfolio-app-playwright',
    stageWidth: 1280,
    stageHeight: 760,
    nodes: [
      {
        id: `portfolio-title-${token}`,
        kind: 'text',
        rect: { x: 96, y: 70, width: 720, height: 76 },
        style: baseStyle,
        zIndex: 1,
        rotation: 0,
        locked: false,
        visible: true,
        content: {
          text: `Portfolio App ${token}`,
          tag: 'h1',
          fontSize: 42,
          fontFamily: 'system-ui',
          fontWeight: 'bold',
          color: '#0f172a',
          align: 'left',
          lineHeight: 1.15,
        },
      },
      {
        id: `portfolio-widget-${token}`,
        kind: 'portfolio-list',
        rect: { x: 96, y: 172, width: 1080, height: 520 },
        style: baseStyle,
        zIndex: 2,
        rotation: 0,
        locked: false,
        visible: true,
        appWidget: {
          appId: APP_ID,
          widgetId: 'portfolio-list',
        },
        content: {
          layout: 'cards',
          limit: 6,
          category: '',
          featuredOnly: false,
          showSummary: true,
          showDate: true,
          showCategoryFilter: true,
          columns: 3,
          sortBy: 'order-asc',
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

async function createProject(request: APIRequestContext, token: string): Promise<string> {
  const response = await request.post('/api/builder/portfolio', {
    headers: mutationHeaders(`portfolio-project-create-${token}`),
    data: {
      locale: LOCALE,
      title: `대만 포트폴리오 테스트 ${token}`,
      slug: `portfolio-test-${token}`,
      summary: `대만 법률 포트폴리오 요약 ${token}`,
      description: '회사 설립과 노동법 쟁점을 함께 정리한 테스트 사례입니다.',
      body: '공개 상세 페이지에서 갤러리와 본문이 함께 보여야 합니다.',
      category: 'company-setup',
      client: 'Playwright Client',
      completedAt: '2026-05-20',
      tags: ['포트폴리오', '테스트'],
      status: 'published',
      featured: true,
      order: 0,
      coverImageUrl: '/images/001-taiwan-company-establishment-basics/featured-01.jpg',
      gallery: [
        {
          imageId: `gallery-${token}`,
          url: '/images/001-taiwan-company-establishment-basics/img-01.jpg',
          alt: '대만 회사 설립 포트폴리오 이미지',
          caption: `갤러리 캡션 ${token}`,
        },
      ],
    },
  });
  expect(response.status()).toBe(201);
  const payload = await response.json() as { ok?: boolean; project?: { projectId: string } };
  expect(payload.ok).toBe(true);
  expect(payload.project?.projectId).toBeTruthy();
  return payload.project!.projectId;
}

async function deleteProject(request: APIRequestContext, projectId: string | null, token: string) {
  if (!projectId) return;
  await request.delete(`/api/builder/portfolio/${encodeURIComponent(projectId)}`, {
    headers: mutationHeaders(`portfolio-project-delete-${token}`),
    failOnStatusCode: false,
  });
}

async function createPublishedPage(request: APIRequestContext, slug: string, token: string): Promise<string> {
  const createResponse = await request.post('/api/builder/site/pages', {
    headers: mutationHeaders(`portfolio-page-create-${token}`),
    data: {
      locale: LOCALE,
      slug,
      title: `Portfolio App ${token}`,
      document: makePortfolioDocument(token),
    },
  });
  expect(createResponse.status()).toBe(200);
  const created = (await createResponse.json()) as { success?: boolean; pageId?: string; error?: string };
  expect(created.success, created.error).toBe(true);
  expect(created.pageId).toBeTruthy();

  const publishResponse = await request.post(`/api/builder/site/pages/${created.pageId}/publish?locale=${LOCALE}`, {
    headers: mutationHeaders(`portfolio-page-publish-${token}`),
  });
  expect(publishResponse.status()).toBe(200);
  const published = (await publishResponse.json()) as { ok?: boolean; error?: string };
  expect(published.ok, published.error).toBe(true);

  return created.pageId!;
}

test('native portfolio app renders projects, galleries, detail pages, and disabled widget fallback', async ({ page }) => {
  const token = Date.now().toString(36);
  const slug = `portfolio-app-${token}`;
  let pageId: string | null = null;
  let projectId: string | null = null;

  await uninstallIfPresent(page.request, `portfolio-clean-before-${token}`);

  try {
    await installApp(page.request, `portfolio-install-${token}`);
    projectId = await createProject(page.request, token);
    pageId = await createPublishedPage(page.request, slug, token);

    await page.goto(`/${LOCALE}/${slug}?enabled=${token}`, { waitUntil: 'domcontentloaded' });
    await page.waitForLoadState('networkidle');

    const widgetNode = page.locator(`[data-node-id="portfolio-widget-${token}"]`);
    await expect(widgetNode).toHaveAttribute('data-builder-app-widget', 'app:native-portfolio:portfolio-list');
    await expect(widgetNode).toHaveAttribute('data-builder-app-runtime-status', 'enabled');
    await expect(widgetNode.locator('[data-builder-portfolio-list="true"]')).toBeVisible();
    await expect(widgetNode).toContainText(`대만 포트폴리오 테스트 ${token}`);
    await expect(widgetNode.getByRole('button', { name: '회사 설립' })).toBeVisible();
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);

    await page.goto(`/${LOCALE}/portfolio?category=company-setup&portfolio=${token}`, { waitUntil: 'domcontentloaded' });
    await expect(page.locator('[data-public-portfolio-page="true"]')).toBeVisible();
    await expect(page.locator(`[data-public-portfolio-card="${projectId}"]`)).toContainText(`대만 포트폴리오 테스트 ${token}`);
    await page.locator(`[data-public-portfolio-card="${projectId}"]`).click();
    await expect(page.locator('[data-public-portfolio-detail="true"]')).toBeVisible();
    await expect(page).toHaveURL(new RegExp(`/${LOCALE}/portfolio/portfolio-test-${token}`));
    await expect(page.locator(`[data-public-portfolio-gallery-image="gallery-${token}"]`)).toContainText(`갤러리 캡션 ${token}`);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);

    await disableApp(page.request, `portfolio-disable-${token}`);
    await page.goto(`/${LOCALE}/${slug}?disabled=${token}`, { waitUntil: 'domcontentloaded' });
    const disabledNode = page.locator(`[data-node-id="portfolio-widget-${token}"]`);
    await expect(disabledNode).toHaveAttribute('data-builder-app-runtime-status', 'disabled');
    await expect(disabledNode.locator('[data-builder-app-runtime-placeholder="true"]'))
      .toContainText('이 기능은 일시적으로 사용할 수 없습니다.');
  } finally {
    if (pageId) {
      await page.request.delete(`/api/builder/site/pages/${pageId}?locale=${LOCALE}`, {
        headers: mutationHeaders(`portfolio-page-delete-${token}`),
        failOnStatusCode: false,
      });
    }
    await deleteProject(page.request, projectId, token);
    await uninstallIfPresent(page.request, `portfolio-clean-after-${token}`);
  }
});

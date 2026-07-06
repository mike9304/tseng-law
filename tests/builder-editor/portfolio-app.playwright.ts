import { expect, test, type APIRequestContext } from '@playwright/test';

const APP_ID = 'native-portfolio';

type TestDocument = {
  version: 1;
  locale: 'ko' | 'zh-hant';
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

function makePortfolioDocument(token: string, locale: 'ko' | 'zh-hant'): TestDocument {
  return {
    version: 1,
    locale,
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
          text: locale === 'ko' ? `포트폴리오 앱 ${token}` : `作品集 App ${token}`,
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

async function uninstallIfPresent(request: APIRequestContext, scope: string, locale: 'ko' | 'zh-hant') {
  await request.delete(`/api/builder/apps/installations/${APP_ID}?locale=${locale}`, {
    headers: mutationHeaders(scope),
    failOnStatusCode: false,
  });
}

async function installApp(request: APIRequestContext, scope: string, locale: 'ko' | 'zh-hant') {
  const response = await request.post(`/api/builder/apps/installations?locale=${locale}`, {
    headers: mutationHeaders(scope),
    data: { appId: APP_ID },
  });
  expect([200, 201]).toContain(response.status());
}

async function disableApp(request: APIRequestContext, scope: string, locale: 'ko' | 'zh-hant') {
  const response = await request.patch(`/api/builder/apps/installations/${APP_ID}?locale=${locale}`, {
    headers: mutationHeaders(scope),
    data: { status: 'disabled' },
  });
  expect(response.status()).toBe(200);
}

async function createProject(request: APIRequestContext, token: string, locale: 'ko' | 'zh-hant'): Promise<string> {
  const response = await request.post('/api/builder/portfolio', {
    headers: mutationHeaders(`portfolio-project-create-${token}`),
    data: {
      locale,
      title: locale === 'ko' ? `대만 포트폴리오 테스트 ${token}` : `台灣作品集測試 ${token}`,
      slug: `portfolio-test-${token}`,
      summary: locale === 'ko' ? `대만 법률 포트폴리오 요약 ${token}` : `台灣法律作品集摘要 ${token}`,
      description: locale === 'ko' ? '회사 설립과 노동법 쟁점을 함께 정리한 테스트 사례입니다.' : '此測試案例整合公司設立與勞動法議題。',
      body: locale === 'ko' ? '공개 상세 페이지에서 갤러리와 본문이 함께 보여야 합니다.' : '公開詳情頁面應同時顯示圖庫與內容。',
      category: 'company-setup',
      client: locale === 'ko' ? 'Playwright Client' : 'Playwright 客戶',
      completedAt: '2026-05-20',
      tags: locale === 'ko' ? ['포트폴리오', '테스트'] : ['作品集', '測試'],
      status: 'published',
      featured: true,
      order: 0,
      coverImageUrl: '/images/001-taiwan-company-establishment-basics/featured-01.jpg',
      gallery: [
        {
          imageId: `gallery-${token}`,
          url: '/images/001-taiwan-company-establishment-basics/img-01.jpg',
          alt: locale === 'ko' ? '대만 회사 설립 포트폴리오 이미지' : '台灣公司設立作品集圖片',
          caption: locale === 'ko' ? `갤러리 캡션 ${token}` : `圖庫說明 ${token}`,
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

async function createPublishedPage(request: APIRequestContext, slug: string, token: string, locale: 'ko' | 'zh-hant'): Promise<string> {
  const createResponse = await request.post('/api/builder/site/pages', {
    headers: mutationHeaders(`portfolio-page-create-${token}`),
    data: {
      locale,
      slug,
      title: locale === 'ko' ? `포트폴리오 앱 ${token}` : `作品集 App ${token}`,
      document: makePortfolioDocument(token, locale),
    },
  });
  expect(createResponse.status()).toBe(200);
  const created = (await createResponse.json()) as { success?: boolean; pageId?: string; error?: string };
  expect(created.success, created.error).toBe(true);
  expect(created.pageId).toBeTruthy();

  const publishResponse = await request.post(`/api/builder/site/pages/${created.pageId}/publish?locale=${locale}`, {
    headers: mutationHeaders(`portfolio-page-publish-${token}`),
  });
  expect(publishResponse.status()).toBe(200);
  const published = (await publishResponse.json()) as { ok?: boolean; error?: string };
  expect(published.ok, published.error).toBe(true);

  return created.pageId!;
}

test('native portfolio app renders projects, galleries, detail pages, and disabled widget fallback', async ({ page }) => {
  const token = Date.now().toString(36);
  const locales = ['ko', 'zh-hant'] as const;
  const pageIds: string[] = [];
  const projectIds: string[] = [];

  await Promise.all(locales.map((locale) => uninstallIfPresent(page.request, `portfolio-clean-before-${token}-${locale}`, locale)));

  try {
    await Promise.all(locales.map((locale) => installApp(page.request, `portfolio-install-${token}-${locale}`, locale)));
    for (const locale of locales) {
      projectIds.push(await createProject(page.request, token, locale));
      pageIds.push(await createPublishedPage(page.request, `portfolio-app-${token}-${locale}`, token, locale));
    }

    for (const locale of locales) {
      await page.goto(`/${locale}/admin-builder/portfolio`, { waitUntil: 'commit' });
      await page.waitForLoadState('networkidle');
      await expect(page.locator('[data-builder-portfolio-admin="true"]')).toBeVisible();
      await expect(page.locator('[data-builder-portfolio-admin="true"] h1')).toHaveText(locale === 'ko' ? '포트폴리오' : '作品集');
      await expect(page.locator('[data-builder-portfolio-admin="true"] [aria-label="포트폴리오 요약"], [data-builder-portfolio-admin="true"] [aria-label="作品集摘要"]')).toBeVisible();
      await expect(page.locator('[data-builder-portfolio-admin="true"] h2')).toHaveText(locale === 'ko' ? '새 프로젝트' : '新增專案');
      await expect(page.locator('[data-builder-portfolio-admin="true"]')).toContainText(locale === 'ko' ? '슬러그' : '網址代稱');
      await expect(page.locator('[data-portfolio-admin-new-draft="true"]')).toHaveText(locale === 'ko' ? '새로 작성' : '建立新項目');
      await expect(page.locator('[data-builder-portfolio-admin="true"] [aria-label="포트폴리오 프로젝트"], [data-builder-portfolio-admin="true"] [aria-label="作品集專案"]')).toBeVisible();
      await expect(page.locator(`[data-portfolio-admin-project="${projectIds[locales.indexOf(locale)]}"]`)).toContainText(locale === 'ko' ? '공개' : '公開');
    }

    await page.goto(`/ko/portfolio-app-${token}-ko?enabled=${token}`, { waitUntil: 'commit' });
    await page.waitForLoadState('networkidle');

    const widgetNode = page.locator(`[data-node-id="portfolio-widget-${token}"]`);
    await expect(widgetNode).toHaveAttribute('data-builder-app-widget', 'app:native-portfolio:portfolio-list');
    await expect(widgetNode).toHaveAttribute('data-builder-app-runtime-status', 'enabled');
    await expect(widgetNode.locator('[data-builder-portfolio-list="true"]')).toBeVisible();
    await expect(widgetNode).toContainText(`대만 포트폴리오 테스트 ${token}`);
    await expect(widgetNode.getByRole('button', { name: '회사 설립' })).toBeVisible();
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);

    for (const locale of locales) {
      const localeSlug = `portfolio-app-${token}-${locale}`;
      const detailBackLabel = locale === 'ko' ? '포트폴리오 목록으로' : '返回作品集列表';
      await page.goto(`/${locale}/portfolio?category=company-setup&portfolio=${token}`, { waitUntil: 'commit' });
      await expect(page.locator('[data-public-portfolio-page="true"]')).toBeVisible();
      await expect(page.locator('[data-public-portfolio-eyebrow="true"]')).toContainText(locale === 'ko' ? '포트폴리오' : '作品集');
      await expect(page.locator('[data-public-portfolio-filters="true"]')).toHaveAttribute('aria-label', locale === 'ko' ? '포트폴리오 카테고리' : '作品集分類');
      await expect(page.locator(`[data-public-portfolio-card="${projectIds[locales.indexOf(locale)]}"]`)).toContainText(locale === 'ko' ? `대만 포트폴리오 테스트 ${token}` : `台灣作品集測試 ${token}`);
      await page.locator(`[data-public-portfolio-card="${projectIds[locales.indexOf(locale)]}"]`).click();
      await expect(page.locator('[data-public-portfolio-detail="true"]')).toBeVisible();
      await expect(page).toHaveURL(new RegExp(`/${locale}/portfolio/portfolio-test-${token}`));
      await expect(page.getByRole('link', { name: detailBackLabel })).toHaveAttribute('href', `/${locale}/portfolio`);
      await expect(page.locator('[data-public-portfolio-detail="true"]')).toContainText(locale === 'ko' ? '포트폴리오' : '作品集');
      await expect(page.locator('[data-public-portfolio-detail="true"]')).toContainText(locale === 'ko' ? '카테고리' : '類別');
      await expect(page.locator('[data-public-portfolio-detail="true"]')).toContainText(locale === 'ko' ? '클라이언트' : '客戶');
      await expect(page.locator('[data-public-portfolio-detail="true"]')).toContainText(locale === 'ko' ? '완료일' : '完工日');
      await expect(page.locator(`[data-public-portfolio-gallery-image="gallery-${token}"]`)).toContainText(locale === 'ko' ? `갤러리 캡션 ${token}` : `圖庫說明 ${token}`);
      await expect(page.locator('[data-public-portfolio-detail="true"] [aria-label="Project gallery"], [data-public-portfolio-detail="true"] [aria-label="프로젝트 갤러리"], [data-public-portfolio-detail="true"] [aria-label="專案圖庫"]')).toBeVisible();
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
      await page.goto(`/${locale}/${localeSlug}?enabled=${token}`, { waitUntil: 'commit' });
      await page.waitForLoadState('networkidle');
    }

    await Promise.all(locales.map((locale) => disableApp(page.request, `portfolio-disable-${token}-${locale}`, locale)));
    await page.goto(`/ko/portfolio-app-${token}-ko?disabled=${token}`, { waitUntil: 'commit' });
    const disabledNode = page.locator(`[data-node-id="portfolio-widget-${token}"]`);
    await expect(disabledNode).toHaveAttribute('data-builder-app-runtime-status', 'disabled');
    await expect(disabledNode.locator('[data-builder-app-runtime-placeholder="true"]'))
      .toContainText('이 기능은 일시적으로 사용할 수 없습니다.');
  } finally {
    await Promise.all(pageIds.map((pageId, index) => page.request.delete(`/api/builder/site/pages/${pageId}?locale=${locales[index]}`, {
      headers: mutationHeaders(`portfolio-page-delete-${token}-${locales[index]}`),
      failOnStatusCode: false,
    })));
    await Promise.all(projectIds.map((projectId, index) => deleteProject(page.request, projectId, `${token}-${locales[index]}`)));
    await Promise.all(locales.map((locale) => uninstallIfPresent(page.request, `portfolio-clean-after-${token}-${locale}`, locale)));
  }
});

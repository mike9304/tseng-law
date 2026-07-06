import { expect, test, type Page } from '@playwright/test';

test.describe('/builder workspace localization', () => {
  test('renders localized page routes in ko and zh-hant', async ({ page }) => {
    test.setTimeout(180_000);

    await page.goto('/ko/builder/home', { waitUntil: 'commit' });
    await expect(page.getByRole('heading', { name: '캔버스 포커스' })).toBeVisible();
    await expect(page.getByRole('heading', { name: '모드 정책' })).toBeVisible();
    await expect(page.getByRole('heading', { name: '게시 준비도' })).toBeVisible();
    await page.locator('summary').getByText('페이지 진단', { exact: true }).click();
    await expect(page.getByRole('heading', { name: '데이터셋 seam' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Scene 진단' })).toBeVisible();

    await page.goto('/ko/builder/home?mode=preview', { waitUntil: 'commit' });
    await expect(page.locator('[data-builder-home-preview-runtime="true"] h1').first()).toContainText(
      '대만 법률을 한국어로 명확하게.'
    );
    await expect(page.getByRole('heading', { name: '홈 빌더 기반' })).toBeVisible();
    await expect(page.getByText('빌더 미리보기', { exact: true })).toBeVisible();
    await expectRuntimeBeforeDiagnostics(page, homePreviewSelectors);

    await page.goto('/ko/builder/about?mode=preview', { waitUntil: 'commit' });
    await expect(page).toHaveTitle(/빌더 소개 미리보기/);
    await expect(page.locator('[data-builder-page-preview-runtime="true"] h1').first()).toContainText('호정 소개');
    await expect(page.getByRole('heading', { name: '빌더 소개 미리보기' })).toBeVisible();
    await expect(page.getByText('빌더 미리보기', { exact: true })).toBeVisible();
    await expectRuntimeBeforeDiagnostics(page, pagePreviewSelectors);

    await page.goto('/zh-hant/builder/home', { waitUntil: 'commit' });
    await expect(page.getByRole('heading', { name: '畫布焦點' })).toBeVisible();
    await expect(page.getByRole('heading', { name: '模式政策' })).toBeVisible();
    await page.locator('summary').getByText('頁面診斷', { exact: true }).click();
    await expect(page.getByRole('heading', { name: '發佈就緒度' })).toBeVisible();
    await expect(page.getByRole('heading', { name: '資料集接縫' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Scene 診斷' })).toBeVisible();

    await page.goto('/zh-hant/builder/home?mode=preview', { waitUntil: 'commit' });
    await expect(page.locator('[data-builder-home-preview-runtime="true"] h1').first()).toContainText(
      '以韓語清楚說明台灣法律。'
    );
    await expect(page.getByRole('heading', { name: '首頁建構器基礎' })).toBeVisible();
    await expect(page.getByText('建構器預覽', { exact: true })).toBeVisible();
    await expectRuntimeBeforeDiagnostics(page, homePreviewSelectors);

    await page.goto('/zh-hant/builder/contact?mode=preview', { waitUntil: 'commit' });
    await expect(page).toHaveTitle(/建構器聯絡頁預覽/);
    await expect(page.locator('[data-builder-page-preview-runtime="true"] h1').first()).toContainText('聯絡與諮詢');
    await expect(page.getByRole('heading', { name: '建構器聯絡頁預覽' })).toBeVisible();
    await expect(page.getByText('建構器預覽', { exact: true })).toBeVisible();
    await expectRuntimeBeforeDiagnostics(page, pagePreviewSelectors);

    await page.goto('/ko/builder/collections/service-areas', { waitUntil: 'commit' });
    await expect(page).toHaveTitle(/빌더 컬렉션 세부 정보/);
    await page.goto('/zh-hant/builder/collections/service-areas', { waitUntil: 'commit' });
    await expect(page).toHaveTitle(/建構器集合詳細資料/);
  });

  test('renders localized starter template shell in ko and zh-hant', async ({ page }) => {
    test.setTimeout(180_000);

    await page.goto('/ko/builder/starter-templates/home-editorial', { waitUntil: 'commit' });
    await expect(page).toHaveURL(/\/ko\/builder\/starter-templates\/home-editorial$/);
    await expect(page).toHaveTitle(/빌더 스타터 템플릿 세부 정보/);
    await expect(page.getByRole('heading', { name: '스타터 요약' })).toBeVisible();
    await expect(page.getByRole('heading', { name: '이 스타터 사용' })).toBeVisible();
    await expect(page.getByText('현재 지원', { exact: true })).toBeVisible();

    await page.goto('/zh-hant/builder/starter-templates/home-editorial', { waitUntil: 'commit' });
    await expect(page).toHaveURL(/\/zh-hant\/builder\/starter-templates\/home-editorial$/);
    await expect(page).toHaveTitle(/建構器起始範本詳細資料/);
    await expect(page.getByRole('heading', { name: '起始範本摘要' })).toBeVisible();
    await expect(page.getByRole('heading', { name: '使用此起始範本' })).toBeVisible();
    await expect(page.getByText('目前支援', { exact: true })).toBeVisible();
  });

  test('keeps readonly page preview runtime near the top of common viewports', async ({ page }) => {
    for (const viewport of [
      { width: 1280, height: 1000, maxRuntimeY: 500 },
      { width: 768, height: 1000, maxRuntimeY: 700 },
      { width: 375, height: 900, maxRuntimeY: 520 },
    ] as const) {
      await page.setViewportSize({ width: viewport.width, height: viewport.height });
      await page.goto('/ko/builder/contact?mode=preview', { waitUntil: 'commit' });

      await expect(page.locator('[data-builder-page-preview-runtime="true"] h1').first()).toContainText('문의 및 연락처');
      await expectRuntimeBeforeDiagnostics(page, pagePreviewSelectors);
      await expectPreviewRuntimeNearTop(page, pagePreviewSelectors.runtime, viewport.maxRuntimeY);
    }
  });

  test('navigates builder preview pages and localizes no-draft publish readiness', async ({ page }) => {
    await page.goto('/ko/builder/home?mode=preview', { waitUntil: 'commit' });
    await expect(page).toHaveURL(/\/ko\/builder\/home\?mode=preview$/);
    await expect(page.getByText('미리보기 모드', { exact: true })).toHaveCount(1);
    await expect(page.getByRole('link', { name: '편집 모드' })).toBeVisible();

    await page.locator('a[href="/ko/builder/about?mode=preview"]').click();
    await expect(page).toHaveURL(/\/ko\/builder\/about\?mode=preview$/);
    await expect(page.locator('[data-builder-page-preview-runtime="true"] h1').first()).toContainText('호정 소개');
    await expect(page.getByText('미리보기 모드', { exact: true })).toHaveCount(1);
    await expect(page.getByRole('link', { name: '미리보기 모드' })).toHaveCount(0);
    const homePreviewCard = page.locator('a.builder-dashboard-nav-card[href="/ko/builder/home?mode=preview"]');
    await expect(homePreviewCard).toBeVisible();
    await expect(page.locator('a.builder-dashboard-nav-card[href="/ko/builder/home"]')).toHaveCount(0);

    await homePreviewCard.click();
    await expect(page).toHaveURL(/\/ko\/builder\/home\?mode=preview$/);
    await expect(page.getByText('미리보기 모드', { exact: true })).toHaveCount(1);
    await expect(page.getByRole('link', { name: '편집 모드' })).toBeVisible();

    await page.locator('a[href="/ko/builder/contact?mode=preview"]').click();
    await expect(page).toHaveURL(/\/ko\/builder\/contact\?mode=preview$/);
    await expect(page.locator('[data-builder-page-preview-runtime="true"] h1').first()).toContainText('문의 및 연락처');
    await expect(page.getByText('미리보기 모드', { exact: true })).toHaveCount(1);
    await expect(page.getByRole('link', { name: '미리보기 모드' })).toHaveCount(0);
    await expect(page.getByText('초안 저장 필요', { exact: true })).toBeVisible();
    await expect(
      page.getByText('게시 가능 여부는 저장된 초안이 있어야 확정할 수 있습니다.', { exact: true }),
    ).toBeVisible();
    await expect(page.getByRole('button', { name: '페이지 게시' })).toBeDisabled();
    await expect(page.getByRole('button', { name: '저장된 초안 필요' })).toBeDisabled();
    await expect(page.getByText('Publish ready')).toHaveCount(0);
  });

  test('keeps the active page card visible first on mobile builder previews', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 900 });
    await page.goto('/ko/builder/contact?mode=preview', { waitUntil: 'commit' });

    const activeCard = page.locator('a.builder-dashboard-nav-card.is-active[href="/ko/builder/contact?mode=preview"]');
    await expect(activeCard).toBeVisible();
    await expect
      .poll(async () => {
        const box = await activeCard.boundingBox();
        return box ? Math.round(box.x) : Number.POSITIVE_INFINITY;
      })
      .toBeLessThan(80);
    await expect(page.locator('.builder-canvas-stage-head--canvas-priority > .builder-canvas-stage-meta--canvas-priority').last()).toBeHidden();
  });

  test('keeps public contact office tabs interactive for builder parity', async ({ page }) => {
    await page.goto('/ko/contact#offices', { waitUntil: 'networkidle' });
    await expect(page.getByRole('heading', { name: '오시는길' }).first()).toBeVisible();

    await page.getByRole('tab', { name: '가오슝' }).click();
    await expect(page.getByRole('heading', { name: '가오슝', exact: true, level: 3 })).toBeVisible();

    await page.getByRole('tab', { name: '타이베이' }).click();
    await expect(page.getByRole('heading', { name: '타이베이', exact: true, level: 3 })).toBeVisible();

    await page.getByRole('tab', { name: '타이중' }).click();
    await expect(page.getByRole('heading', { name: '타이중', exact: true, level: 3 })).toBeVisible();
  });

  test('renders localized dynamic route and scene shells in ko and zh-hant', async ({ page }) => {
    test.setTimeout(180_000);

    await page.goto('/ko/builder/dynamic-routes/service-areas.item?previewRecordId=civil', {
      waitUntil: 'commit',
    });
    await expect(page).toHaveURL(/\/ko\/builder\/dynamic-routes\/service-areas\.item\?previewRecordId=civil$/);
    await expect(page).toHaveTitle(/빌더 동적 경로 세부 정보/);
    await expect(page.getByRole('heading', { name: '템플릿 소유권', exact: true })).toBeVisible();
    await expect(page.getByRole('heading', { name: '미리보기 컨텍스트', exact: true })).toBeVisible();
    await expect(page.getByRole('heading', { name: '동적 SEO 미리보기' })).toBeVisible();
    await expect(page.getByRole('heading', { name: '경로 요약' })).toBeVisible();
    await expect(page.getByRole('heading', { name: '미리보기 레코드 선택' })).toBeVisible();
    await expect(page.getByRole('heading', { name: '미리보기 컨텍스트 접합', exact: true })).toBeVisible();

    await page.goto('/zh-hant/builder/dynamic-routes/service-areas.item?previewRecordId=civil', {
      waitUntil: 'commit',
    });
    await expect(page).toHaveURL(
      /\/zh-hant\/builder\/dynamic-routes\/service-areas\.item\?previewRecordId=civil$/
    );
    await expect(page).toHaveTitle(/建構器動態路由詳細資料/);
    await expect(page.getByRole('heading', { name: '範本擁有權', exact: true })).toBeVisible();
    await expect(page.getByRole('heading', { name: '預覽情境', exact: true })).toBeVisible();
    await expect(page.getByRole('heading', { name: '動態 SEO 預覽' })).toBeVisible();
    await expect(page.getByRole('heading', { name: '路由摘要' })).toBeVisible();
    await expect(page.getByRole('heading', { name: '預覽記錄選項' })).toBeVisible();
    await expect(page.getByRole('heading', { name: '預覽情境接縫', exact: true })).toBeVisible();

    await page.goto('/ko/builder/home/scene', { waitUntil: 'commit' });
    await expect(page).toHaveTitle(/(장면 그래프|Scene Graph|場景圖)/);
    await expect(page.getByRole('heading', { name: '선택' })).toBeVisible();
    await expect(page.getByRole('heading', { name: '검사기 셸' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Scene 요약' })).toBeVisible();
    await expect(page.getByRole('heading', { name: '기초 범위' })).toBeVisible();
    await expect(page.getByRole('heading', { name: '드래그 세션' })).toBeVisible();
    await expect(page.getByText('장면 그래프', { exact: true })).toBeVisible();

    await page.goto('/zh-hant/builder/home/scene', { waitUntil: 'commit' });
    await expect(page).toHaveTitle(/(場景圖|Scene Graph)/);
    await expect(page.getByRole('heading', { name: '選取' })).toBeVisible();
    await expect(page.getByRole('heading', { name: '檢視面板殼層' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Scene 摘要' })).toBeVisible();
    await expect(page.getByRole('heading', { name: '基礎範圍' })).toBeVisible();
    await expect(page.getByRole('heading', { name: '拖曳工作階段' })).toBeVisible();
    await expect(page.getByText('場景圖', { exact: true })).toBeVisible();

    await page.goto('/ko/builder/home/datasets', { waitUntil: 'commit' });
    await expect(page).toHaveTitle(/빌더 데이터셋 바인딩/);
    await expect(page.getByRole('heading', { name: 'home 데이터셋 바인딩' })).toBeVisible();
    await page.goto('/zh-hant/builder/home/datasets', { waitUntil: 'commit' });
    await expect(page).toHaveTitle(/建構器資料集綁定/);
    await expect(page.getByRole('heading', { name: 'home 資料集綁定' })).toBeVisible();
  });
});

const homePreviewSelectors = {
  runtime: '[data-builder-home-preview-runtime="true"]',
  diagnostics: '[data-builder-home-preview-diagnostics="true"]',
} as const;

const pagePreviewSelectors = {
  runtime: '[data-builder-page-preview-runtime="true"]',
  diagnostics: '[data-builder-page-preview-diagnostics="true"]',
} as const;

type PreviewOrderSelectors = {
  readonly runtime: string;
  readonly diagnostics: string;
};

async function expectRuntimeBeforeDiagnostics(page: Page, selectors: PreviewOrderSelectors): Promise<void> {
  await expect.poll(async () => page.evaluate((previewSelectors) => {
    const runtime = document.querySelector(previewSelectors.runtime);
    const diagnostics = document.querySelector(previewSelectors.diagnostics);
    if (!runtime || !diagnostics) return false;
    return Boolean(runtime.compareDocumentPosition(diagnostics) & Node.DOCUMENT_POSITION_FOLLOWING);
  }, selectors)).toBe(true);
}

async function expectPreviewRuntimeNearTop(page: Page, selector: string, maxY: number): Promise<void> {
  await expect
    .poll(async () => {
      const box = await page.locator(selector).boundingBox();
      return box ? Math.round(box.y) : Number.POSITIVE_INFINITY;
    })
    .toBeLessThan(maxY);
}

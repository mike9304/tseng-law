import { expect, test, type Page } from '@playwright/test';
import { openBuilder, openCatalogDrawer } from './helpers/editor';

const LOCALE = 'ko';
const AI_GENERATE_TIMEOUT_MS = 30_000;
const authHeader = `Basic ${Buffer.from(
  `${process.env.BUILDER_SMOKE_USERNAME ?? process.env.CMS_ADMIN_USERNAME ?? 'admin'}:${process.env.BUILDER_SMOKE_PASSWORD ?? process.env.CMS_ADMIN_PASSWORD ?? 'local-review-2026!'}`,
).toString('base64')}`;

interface BuilderPageSummary {
  pageId: string;
  slug: string;
}

interface CreatedDraftLink {
  pageId: string;
  slug: string;
}

interface BuilderNavItemSummary {
  href?: string;
  pageId?: string;
  children?: BuilderNavItemSummary[];
}

async function listBuilderPages(page: Page) {
  const response = await page.request.get(`/api/builder/site/pages?locale=${LOCALE}`, {
    headers: { Authorization: authHeader },
  });
  const payload = (await response.json()) as { pages?: BuilderPageSummary[] };
  return payload.pages ?? [];
}

function flattenNavigation(items: BuilderNavItemSummary[]): BuilderNavItemSummary[] {
  return items.flatMap((item) => [item, ...flattenNavigation(item.children ?? [])]);
}

async function listNavigationItems(page: Page) {
  const response = await page.request.get(`/api/builder/site/navigation?locale=${LOCALE}`, {
    headers: { Authorization: authHeader },
  });
  const payload = (await response.json()) as { navigation?: BuilderNavItemSummary[] };
  return flattenNavigation(payload.navigation ?? []);
}

async function createBuilderPage(page: Page, slug: string, title: string): Promise<string> {
  const response = await page.request.post('/api/builder/site/pages', {
    headers: { Authorization: authHeader },
    data: { slug, title, locale: LOCALE, blank: true },
  });
  const payload = (await response.json()) as { pageId?: string; page?: { pageId?: string } };
  expect(response.status()).toBe(200);
  const pageId = payload.pageId ?? payload.page?.pageId ?? '';
  expect(pageId).toBeTruthy();
  return pageId;
}

async function deleteBuilderPage(page: Page, pageId: string) {
  await page.request.delete(`/api/builder/site/pages/${encodeURIComponent(pageId)}?locale=${LOCALE}`, {
    headers: { Authorization: authHeader },
  }).catch(() => undefined);
}

test('/ko/admin-builder/ai-generator generates sitemap and content plan from expanded prompt fields', async ({ page }) => {
  test.setTimeout(120_000);
  await page.setExtraHTTPHeaders({ Authorization: authHeader });
  await page.setViewportSize({ width: 390, height: 900 });
  await page.addInitScript((historyKey) => {
    window.localStorage.removeItem(historyKey);
  }, `builder-ai-generator-history:${LOCALE}`);
  let dialogSeen = false;
  page.on('dialog', async (dialog) => {
    dialogSeen = true;
    await dialog.dismiss();
  });
  await page.route('**/api/builder/ai-generator/image', async (route) => {
    const body = route.request().postDataJSON() as { prompt?: string; size?: string; quality?: string; outputFormat?: string };
    expect(body.prompt).toContain('타이베이 스카이라인');
    expect(body.size).toBe('1536x1024');
    expect(body.quality).toBe('medium');
    expect(body.outputFormat).toBe('webp');
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        ok: true,
        model: 'gpt-image-2',
        asset: {
          backend: 'file',
          locale: LOCALE,
          pathname: 'builder/assets/ko/generated-image-2-hero.webp',
          url: '/api/builder/assets/ko/generated-image-2-hero.webp',
          filename: 'generated-image-2-hero.webp',
          contentType: 'image/webp',
          size: 1200,
          uploadedAt: '2026-05-21T00:00:00.000Z',
        },
      }),
    });
  });
  await page.goto(`/${LOCALE}/admin-builder/ai-generator`, { waitUntil: 'domcontentloaded' });

  await expect(page.locator('[data-ai-generator]')).toBeVisible();
  await expect(page.locator('[data-ai-generator]')).toHaveAttribute('data-ai-generator-ready', 'true');

  await page.getByRole('button', { name: /목표·페이지/ }).click();
  await page.locator('[data-ai-generator-goals]').fill('상담 문의 증가\n칼럼 검색 유입 확보');
  await page.locator('[data-ai-generator-pages]').fill('홈\n업무분야\n칼럼\n문의');

  await page.getByRole('button', { name: /제약/ }).click();
  await page.locator('[data-ai-generator-brand-keywords]').fill('대만 법률\n한국어 상담');
  await page.locator('[data-ai-generator-constraints]').fill('모바일 CTA를 우선 노출');

  await page.getByRole('button', { name: /스타일/ }).click();
  await page.locator('[data-ai-generator-visual-direction]').fill('타이베이 스카이라인, 인물 없는 고급 법률 상담 이미지');
  await expect(page.locator('[data-ai-generator-prompt-selector]')).toContainText('Apply review baseline');
  await expect(page.locator('[data-ai-generator-prompt-option="ai-site-builder-2026-05-21-af"]')).toHaveAttribute(
    'data-ai-generator-prompt-selected',
    'true',
  );
  await page.locator('[data-ai-generator-prompt-option="ai-site-builder-2026-05-21-ae"]').click();
  await expect(page.locator('[data-ai-generator-prompt-option="ai-site-builder-2026-05-21-ae"]')).toHaveAttribute(
    'data-ai-generator-prompt-selected',
    'true',
  );
  await expect(page.locator('[data-ai-generator-prompt-comparison]')).toHaveAttribute(
    'data-ai-generator-prompt-comparison-mode',
    'rollback',
  );
  await expect(page.locator('[data-ai-generator-prompt-diff-current]')).toContainText('Desktop/Mobile');
  await page.locator('[data-ai-generator-compare-drafts]').click();
  await expect(page.locator('[data-ai-generator-draft-comparison]')).toBeVisible({ timeout: AI_GENERATE_TIMEOUT_MS });
  await expect(page.locator('[data-ai-generator-draft-comparison]')).toHaveAttribute(
    'data-ai-generator-draft-comparison-selected',
    'ai-site-builder-2026-05-21-ae',
  );
  await expect(page.locator('[data-ai-generator-draft-comparison]')).toHaveAttribute(
    'data-ai-generator-draft-comparison-current',
    'ai-site-builder-2026-05-21-af',
  );
  await expect(page.locator('[data-ai-generator-draft-comparison-selected-card]')).toContainText('Selected draft');
  await expect(page.locator('[data-ai-generator-draft-comparison-current-card]')).toContainText('Current draft');
  await expect(page.locator('[data-ai-generator-draft-visual-selected]')).toBeVisible();
  await expect(page.locator('[data-ai-generator-draft-visual-current]')).toBeVisible();
  const fullPageVisualDiff = page.locator('[data-ai-generator-page-visual-diff]');
  await expect(fullPageVisualDiff).toBeVisible();
  await expect(fullPageVisualDiff).toContainText('Full-page visual diff');
  await expect(fullPageVisualDiff).toContainText('Palette tokens');
  await expect(fullPageVisualDiff.locator('[data-ai-generator-page-visual-strip="selected"]')).toBeVisible();
  await expect(fullPageVisualDiff.locator('[data-ai-generator-page-visual-strip="current"]')).toBeVisible();
  await expect(fullPageVisualDiff).toHaveAttribute('data-ai-generator-page-visual-diff-guidance', '2');
  await expect(page.locator('[data-ai-generator-draft-comparison-delta]')).toBeVisible();
  await expect(page.locator('[data-ai-generator-draft-comparison-delta]')).toContainText('Visual treatment differs');
  await page.locator('[data-ai-generator-prompt-option="ai-site-builder-2026-05-21-af"]').click();
  await expect(page.locator('[data-ai-generator-prompt-comparison]')).toHaveAttribute(
    'data-ai-generator-prompt-comparison-mode',
    'current',
  );
  await page.locator('[data-ai-generator-generate]').click();

  const sitemap = page.locator('[data-ai-generator-sitemap]');
  await expect(sitemap).toBeVisible({ timeout: AI_GENERATE_TIMEOUT_MS });
  await expect(sitemap).toContainText('/columns');
  await expect(page.locator('[data-ai-generator-visual-brief]')).toContainText('professional split hero');
  await expect(page.locator('[data-ai-generator-image-prompt]')).toContainText('타이베이 스카이라인');
  await expect(page.locator('[data-ai-generator-prompt-version]')).toContainText('ai-site-builder-2026-05-21-af');
  await expect(page.locator('[data-ai-generator-prompt-changelog]')).toContainText('Responsive draft review');
  await expect(page.locator('[data-ai-generator-prompt-changelog]')).toContainText('Desktop/Mobile generated draft preview frame');
  const draftPreview = page.locator('[data-ai-generator-draft-preview-mode]');
  await expect(draftPreview).toHaveAttribute('data-ai-generator-draft-preview-mode', 'desktop');
  await page.locator('[data-ai-generator-draft-preview-mode-button="mobile"]').click();
  await expect(draftPreview).toHaveAttribute('data-ai-generator-draft-preview-mode', 'mobile');
  await expect(draftPreview.locator('h3')).toBeVisible();
  await page.locator('[data-ai-generator-apply-responsive-fix]').click();
  await expect(draftPreview).toHaveAttribute('data-ai-generator-draft-preview-mode', 'mobile');
  await expect(page.locator('[data-ai-generator-responsive-fix-status]')).toContainText('모바일 CTA');
  await expect(page.locator('[data-ai-generator-visual-brief]')).toContainText('mobile-safe CTA spacing');
  await page.locator('[data-ai-generator-undo-responsive-fix]').click();
  await expect(draftPreview).toHaveAttribute('data-ai-generator-draft-preview-mode', 'desktop');
  await expect(page.locator('[data-ai-generator-responsive-fix-status]')).toContainText('되돌렸습니다');
  await expect(page.locator('[data-ai-generator-designer-suggestions]')).toBeVisible();
  await page.locator('[data-ai-generator-designer-suggestion="editorial-trust"]').click();
  await expect(page.locator('[data-ai-generator-designer-suggestions]')).toHaveAttribute(
    'data-ai-generator-designer-suggestion-active',
    'editorial-trust',
  );
  await expect(page.locator('[data-ai-generator-designer-suggestion-status]')).toContainText('Editorial trust');
  await expect(page.locator('[data-ai-generator-design-treatment]')).toContainText('Designer polish');
  await page.locator('[data-ai-generator-undo-designer-suggestion]').click();
  await expect(page.locator('[data-ai-generator-designer-suggestions]')).toHaveAttribute(
    'data-ai-generator-designer-suggestion-active',
    'none',
  );
  await expect(page.locator('[data-ai-generator-designer-suggestion-status]')).toContainText('되돌렸습니다');
  await expect(page.locator('[data-ai-generator-design-treatment]')).not.toContainText('Designer polish');
  await page.locator('[data-ai-generator-draft-preview-mode-button="desktop"]').click();
  await expect(draftPreview).toHaveAttribute('data-ai-generator-draft-preview-mode', 'desktop');
  await page.locator('[data-ai-generator-generate-hero-image]').click();
  await expect(page.locator('[data-ai-generator-image-generation-status]')).toContainText('generated-image-2-hero.webp');
  await expect(page.locator('[data-ai-generator-selected-hero-asset]')).toContainText('generated-image-2-hero.webp');
  await expect(page.locator('[data-ai-generator-content-plan]')).toBeVisible();
  await expect(page.locator('[data-ai-generator-content-plan]')).toContainText('포지셔닝');
  await expect(page.locator('[data-ai-generator-apply-panel]')).toBeVisible();
  const singleApplyReview = page.locator('[data-ai-generator-apply-review]');
  await expect(singleApplyReview).toHaveAttribute('data-ai-generator-apply-review-scope', 'single');
  await expect(singleApplyReview).toHaveAttribute('data-ai-generator-apply-review-page-count', '1');
  await expect(singleApplyReview.locator('[data-ai-generator-apply-review-page]')).toHaveCount(1);
  await expect(singleApplyReview).toContainText('현재 사이트를 덮어쓰지 않고');
  await expect(page.locator('[data-ai-generator-history]')).toContainText('1 saved');
  await expect(page.locator('[data-ai-generator-history]')).toContainText('호정국제법률사무소');
  await expect(page.evaluate((historyKey) => {
    const parsed = JSON.parse(window.localStorage.getItem(historyKey) ?? '[]') as unknown[];
    return parsed.length;
  }, `builder-ai-generator-history:${LOCALE}`)).resolves.toBe(1);

  await page.locator('[data-ai-generator-history-restore]').first().click();
  await expect(page.locator('[data-ai-generator-history]')).toContainText('이전 생성안을 복원했습니다.');
  await expect(page.locator('[data-ai-generator-sitemap]')).toBeVisible();

  await page.locator('[data-ai-generator-slug]').fill('columns');
  await page.locator('[data-ai-generator-create-draft]').click();
  await expect(page.locator('[data-ai-generator-apply-panel]')).toContainText('already exists');

  const discardSlug = `ai-discard-${Date.now().toString(36)}`;
  await page.locator('[data-ai-generator-slug]').fill(discardSlug);
  await page.locator('[data-ai-generator-create-draft]').click();
  await expect(page.locator('[data-ai-generator-created-page]')).toBeVisible({ timeout: AI_GENERATE_TIMEOUT_MS });
  const discardPageId = await page.locator('[data-ai-generator-created-page]').getAttribute('data-ai-generator-created-page-id');
  expect(discardPageId).toBeTruthy();
  if (discardPageId) {
    await expect.poll(async () => {
      const pages = await listBuilderPages(page);
      return pages.some((entry) => entry.pageId === discardPageId && entry.slug === discardSlug);
    }).toBe(true);
  }

  await page.locator('[data-ai-generator-discard-draft]').click();
  await expect(page.locator('[data-ai-generator-discard-notice]')).toContainText('폐기했습니다.');
  await expect(page.locator('[data-ai-generator-created-page]')).toHaveCount(0);
  if (discardPageId) {
    await expect.poll(async () => {
      const pages = await listBuilderPages(page);
      return pages.some((entry) => entry.pageId === discardPageId || entry.slug === discardSlug);
    }).toBe(false);
  }

  const slug = `ai-site-${Date.now().toString(36)}`;
  await page.locator('[data-ai-generator-slug]').fill(slug);
  await page.locator('[data-ai-generator-create-draft]').click();
  await expect(page.locator('[data-ai-generator-apply-panel]')).not.toContainText('already exists');
  await expect(page.locator('[data-ai-generator-created-page]')).toBeVisible({ timeout: AI_GENERATE_TIMEOUT_MS });
  const pageId = await page.locator('[data-ai-generator-created-page]').getAttribute('data-ai-generator-created-page-id');
  expect(pageId).toBeTruthy();
  if (pageId) {
    await page.goto(`/${LOCALE}/admin-builder?pageId=${encodeURIComponent(pageId)}&aiGeneratedPage=${slug}`, {
      waitUntil: 'domcontentloaded',
    });
    await expect(page.locator('header[class*="topBar"] [title="페이지 선택"]')).toContainText(`/${slug}`, {
      timeout: 20_000,
    });
    await expect(page.locator(`[data-node-id="ai-${pageId}-0-section"]`).first()).toBeVisible();
    await expect(page.locator(`[data-node-id="ai-${pageId}-0-headline"]`).first()).toBeVisible();
    await expect(page.locator(`[data-node-id="ai-${pageId}-0-visual"]`).first()).toBeVisible();
    await expect(page.locator(`[data-node-id="ai-${pageId}-0-hero-media"]`).first()).toBeVisible();
    await expect(page.locator(`[data-node-id="ai-${pageId}-0-hero-media"] img`).first()).toHaveAttribute(
      'src',
      /generated-image-2-hero/,
    );
    const draftResponse = await page.request.get(`/api/builder/site/pages/${encodeURIComponent(pageId)}/draft?locale=${LOCALE}`, {
      headers: { Authorization: authHeader },
    });
    const draftPayload = (await draftResponse.json()) as {
      document?: {
        nodes?: Array<{
          id?: string;
          kind?: string;
          content?: {
            background?: string;
            text?: string;
            alt?: string;
            src?: string;
            generationPrompt?: string;
            visualDirection?: string;
            filters?: { contrast?: number };
          };
          responsive?: {
            mobile?: {
              rect?: { x?: number; y?: number; width?: number; height?: number };
            };
          };
        }>;
      };
    };
    const generatedNodes = draftPayload.document?.nodes ?? [];
    const heroMediaNode = generatedNodes.find((node) => node.id === `ai-${pageId}-0-hero-media`);
    const promptChipNode = generatedNodes.find((node) => node.id === `ai-${pageId}-0-prompt-chip`);
    const paletteSwatches = [0, 1, 2].map((index) =>
      generatedNodes.find((node) => node.id === `ai-${pageId}-0-palette-swatch-${index}`));
    const firstSectionAccentRail = generatedNodes.find((node) => node.id === `ai-${pageId}-1-accent-rail`);
    const firstSectionNumberText = generatedNodes.find((node) => node.id === `ai-${pageId}-1-section-number-text`);
    const ctaTrustStrip = generatedNodes.find((node) => node.kind === 'container'
      && node.id?.endsWith('-trust-strip'));
    const ctaTrustStripText = generatedNodes.find((node) => node.kind === 'text'
      && node.id?.endsWith('-trust-strip-text'));
    const proofMobileRects = [0, 1, 2].map((index) =>
      generatedNodes.find((node) => node.id === `ai-${pageId}-0-proof-card-${index}`)
        ?.responsive?.mobile?.rect);
    const visualMobileRect = generatedNodes.find((node) => node.id === `ai-${pageId}-0-visual`)
      ?.responsive?.mobile?.rect;
    expect(heroMediaNode?.kind).toBe('image');
    expect(heroMediaNode?.content?.src).toContain('/api/builder/assets/ko/generated-image-2-hero.webp');
    expect(heroMediaNode?.content?.alt).toContain('AI hero image');
    expect(heroMediaNode?.content?.generationPrompt).toContain('No readable text');
    expect(heroMediaNode?.content?.visualDirection).toContain('타이베이 스카이라인');
    expect(heroMediaNode?.content?.filters?.contrast ?? 0).toBeGreaterThanOrEqual(100);
    expect(promptChipNode?.responsive?.mobile?.rect).toMatchObject({ x: 240, y: 274, width: 150 });
    expect(paletteSwatches.every((node) => node?.kind === 'container' && node.content?.background)).toBe(true);
    expect(paletteSwatches.every((node) => node?.responsive?.mobile?.rect?.y === 332)).toBe(true);
    expect(firstSectionAccentRail?.responsive?.mobile?.rect).toMatchObject({ x: 48, y: 74, height: 6 });
    expect(firstSectionNumberText?.content?.text).toBe('S-01');
    expect(ctaTrustStrip?.responsive?.mobile?.rect).toMatchObject({ x: 48, y: 400, width: 1040 });
    expect(ctaTrustStripText?.content?.text).toContain('모바일 안전 CTA');
    expect(proofMobileRects.every((rect) => rect && rect.x === 48 && (rect.width ?? 0) >= 900)).toBe(true);
    expect((proofMobileRects[1]?.y ?? 0)).toBeGreaterThan(
      (proofMobileRects[0]?.y ?? 0) + (proofMobileRects[0]?.height ?? 0),
    );
    expect((proofMobileRects[2]?.y ?? 0)).toBeGreaterThan(
      (proofMobileRects[1]?.y ?? 0) + (proofMobileRects[1]?.height ?? 0),
    );
    expect(visualMobileRect?.y ?? 0).toBeGreaterThan(
      (proofMobileRects[2]?.y ?? 0) + (proofMobileRects[2]?.height ?? 0),
    );
    await expect(page.locator(`[data-node-id="ai-${pageId}-1-section"]`).first()).toHaveAttribute(
      'data-builder-section-template',
      'services',
    );
    await expect(page.locator(`[data-node-id="ai-${pageId}-1-section"]`).first()).toHaveAttribute(
      'data-section-variant',
      'split',
    );
    await expect(page.locator(`[data-node-id="ai-${pageId}-1-section"] [data-ai-section-template-kind="services"]`)).toHaveCount(1);
    await expect(page.locator(`[data-node-id="ai-${pageId}-1-section"] .services-detail-card`).first()).toBeAttached();
    await expect(page.locator(`[data-node-id^="ai-${pageId}-"][data-node-id*="-card-"]`).first()).toBeVisible();
    const seoResponse = await page.request.get(`/api/builder/site/pages/${encodeURIComponent(pageId)}/seo?locale=${LOCALE}`, {
      headers: { Authorization: authHeader },
    });
    const seoPayload = (await seoResponse.json()) as {
      seo?: {
        title?: string;
        description?: string;
        focusKeyword?: string;
        ogTitle?: string;
        twitterTitle?: string;
      };
    };
    expect(seoResponse.status()).toBe(200);
    expect(seoPayload.seo?.title).toContain('호정국제법률사무소');
    expect(seoPayload.seo?.description?.length ?? 0).toBeGreaterThan(20);
    expect(seoPayload.seo?.focusKeyword).toBe('대만 법률');
    expect(seoPayload.seo?.ogTitle).toBe(seoPayload.seo?.title);
    expect(seoPayload.seo?.twitterTitle).toBe(seoPayload.seo?.title);
    await page.request.delete(`/api/builder/site/pages/${encodeURIComponent(pageId)}?locale=${LOCALE}`, {
      headers: { Authorization: authHeader },
    });
  }
  expect(dialogSeen).toBe(false);
  await expect(page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth + 1)).resolves.toBe(true);
});

test('/ko/admin-builder/ai-generator selects an uploaded hero image asset', async ({ page }) => {
  await page.setExtraHTTPHeaders({ Authorization: authHeader });
  await page.setViewportSize({ width: 390, height: 900 });
  await page.addInitScript((historyKey) => {
    window.localStorage.removeItem(historyKey);
  }, `builder-ai-generator-history:${LOCALE}`);
  await page.route('**/api/builder/assets?locale=ko&limit=8', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        ok: true,
        library: { folders: [], tags: [], assetFolderByFilename: {}, assetTagsByFilename: {} },
        assets: [{
          backend: 'file',
          locale: LOCALE,
          pathname: 'builder/assets/ko/uploaded-office-hero.webp',
          url: '/api/builder/assets/ko/uploaded-office-hero.webp',
          filename: 'uploaded-office-hero.webp',
          contentType: 'image/webp',
          size: 2048,
          uploadedAt: '2026-05-21T00:00:00.000Z',
        }],
      }),
    });
  });

  await page.goto(`/${LOCALE}/admin-builder/ai-generator`, { waitUntil: 'domcontentloaded' });
  await expect(page.locator('[data-ai-generator]')).toHaveAttribute('data-ai-generator-ready', 'true');

  await page.getByRole('button', { name: /스타일/ }).click();
  await expect(page.locator('[data-ai-generator-asset-picker]')).toBeVisible();
  const assetOption = page.locator('[data-ai-generator-asset-option="uploaded-office-hero.webp"]');
  await expect(assetOption).toBeVisible();
  await assetOption.click();
  await expect(assetOption).toHaveAttribute('data-ai-generator-asset-selected', 'true');
  await page.locator('[data-ai-generator-visual-direction]').fill('업로드 이미지 중심의 전문 상담 장면');
  await page.locator('[data-ai-generator-generate]').click();

  await expect(page.locator('[data-ai-generator-selected-hero-asset]')).toContainText(
    'uploaded-office-hero.webp',
    { timeout: AI_GENERATE_TIMEOUT_MS },
  );
  await expect(page.evaluate((historyKey) => {
    const parsed = JSON.parse(window.localStorage.getItem(historyKey) ?? '[]') as Array<{
      spec?: { heroImageAsset?: { assetId?: string } };
    }>;
    return parsed[0]?.spec?.heroImageAsset?.assetId;
  }, `builder-ai-generator-history:${LOCALE}`)).resolves.toBe('builder/assets/ko/uploaded-office-hero.webp');
});

test('/ko/admin-builder/ai-generator creates selected sitemap draft pages with status chips', async ({ page }) => {
  await page.setExtraHTTPHeaders({ Authorization: authHeader });
  await page.setViewportSize({ width: 390, height: 900 });
  await page.addInitScript((historyKey) => {
    window.localStorage.removeItem(historyKey);
  }, `builder-ai-generator-history:${LOCALE}`);

  const token = Date.now().toString(36);
  const existingSlug = `ai-existing-${token}`;
  const expectedSlugs = [`roadmap-${token}`];
  let existingPageId = '';
  let createdPages: CreatedDraftLink[] = [];

  try {
    existingPageId = await createBuilderPage(page, existingSlug, 'Existing AI sitemap page');

    await page.goto(`/${LOCALE}/admin-builder/ai-generator`, { waitUntil: 'domcontentloaded' });
    await expect(page.locator('[data-ai-generator]')).toHaveAttribute('data-ai-generator-ready', 'true');

    await page.getByRole('button', { name: /목표·페이지/ }).click();
    await page.locator('[data-ai-generator-pages]').fill([
      '홈',
      `Roadmap ${token}`,
      `Guides ${token}`,
      existingSlug,
    ].join('\n'));

    await page.getByRole('button', { name: /스타일/ }).click();
    await page.locator('[data-ai-generator-generate]').click();
    await expect(page.locator('[data-ai-generator-sitemap]')).toContainText(`/roadmap-${token}`, { timeout: AI_GENERATE_TIMEOUT_MS });
    await page.locator('[data-ai-generator-page-option="sitemap"]').check();
    await expect(page.locator('[data-ai-generator-slug]')).toBeDisabled();
    await expect(page.locator('[data-ai-generator-sitemap-select-panel]')).toBeVisible();
    await expect(page.locator('[data-ai-generator-selected-count]')).toContainText('3/3');
	    const sitemapApplyReview = page.locator('[data-ai-generator-apply-review]');
	    await expect(sitemapApplyReview).toHaveAttribute('data-ai-generator-apply-review-scope', 'sitemap');
	    await expect(sitemapApplyReview).toHaveAttribute('data-ai-generator-apply-review-page-count', '3');
	    await expect(sitemapApplyReview.locator('[data-ai-generator-apply-review-page]')).toHaveCount(3);
    const sitemapTreeOrder = page.locator('[data-ai-generator-sitemap-tree-order]');
    await expect(sitemapTreeOrder).toBeVisible();
    await expect(sitemapTreeOrder).toHaveAttribute('data-ai-generator-sitemap-tree-order-count', '3');
    await expect(sitemapTreeOrder.locator(`[data-ai-generator-sitemap-order-row="roadmap-${token}"]`)).toHaveAttribute(
      'data-ai-generator-sitemap-order-index',
      '0',
    );
    await page.locator(`[data-ai-generator-sitemap-order-down="roadmap-${token}"]`).click();
    await expect(sitemapTreeOrder.locator(`[data-ai-generator-sitemap-order-row="roadmap-${token}"]`)).toHaveAttribute(
      'data-ai-generator-sitemap-order-index',
      '1',
    );
    await expect(sitemapApplyReview.locator('[data-ai-generator-apply-review-page]').first()).toHaveAttribute(
      'data-ai-generator-apply-review-page-slug',
      `guides-${token}`,
    );
	    await expect(page.locator('[data-ai-generator-page-status="planned"]')).toHaveCount(3);
	    await page.locator(`[data-ai-generator-sitemap-page-checkbox="guides-${token}"]`).uncheck();
	    await expect(page.locator('[data-ai-generator-selected-count]')).toContainText('2/3');
    await expect(sitemapTreeOrder).toHaveAttribute('data-ai-generator-sitemap-tree-order-count', '2');
    await expect(sitemapTreeOrder.locator(`[data-ai-generator-sitemap-order-row="roadmap-${token}"]`)).toHaveAttribute(
      'data-ai-generator-sitemap-order-index',
      '0',
    );
	    await expect(sitemapApplyReview).toHaveAttribute('data-ai-generator-apply-review-page-count', '2');
	    await expect(sitemapApplyReview.locator(`[data-ai-generator-apply-review-page-slug="guides-${token}"]`)).toHaveCount(0);
	    await expect(page.locator('[data-ai-generator-page-status="planned"]')).toHaveCount(2);
	    await expect(page.locator('[data-ai-generator-page-status="not_selected"]')).toHaveCount(1);
	    await page.locator('[data-ai-generator-include-navigation-toggle]').check();
	    await expect(page.locator('[data-ai-generator-include-navigation]')).toHaveAttribute(
	      'data-ai-generator-navigation-status',
	      'enabled',
	    );
	    await expect(sitemapApplyReview).toHaveAttribute('data-ai-generator-apply-review-navigation', 'enabled');
	    await expect(page.locator('[data-ai-generator-navigation-helper]')).toContainText('공개 header');

	    await page.locator('[data-ai-generator-create-selected-drafts]').click();
	    await expect(page.locator('[data-ai-generator-created-page]')).toBeVisible({ timeout: AI_GENERATE_TIMEOUT_MS });
	    await expect(page.locator('[data-ai-generator-created-page]')).toHaveAttribute('data-ai-generator-created-page-count', '1');
	    await expect(page.locator('[data-ai-generator-created-navigation-status]')).toContainText('Navigation updated');
	    await expect(page.locator('[data-ai-generator-created-page-link]')).toHaveCount(1);
	    await expect(page.locator('[data-ai-generator-skipped-pages]')).toContainText('duplicate_slug');
	    await expect(page.locator('[data-ai-generator-page-status="created"]')).toHaveCount(1);
	    await expect(page.locator('[data-ai-generator-page-status="duplicate_slug"]')).toHaveCount(1);
	    await expect(page.locator('[data-ai-generator-page-status="not_selected"]')).toHaveCount(1);
	    await expect(page.locator('[data-ai-generator-sitemap-navigation-status="added"]')).toHaveCount(1);

    createdPages = await page.locator('[data-ai-generator-created-page-link]').evaluateAll((links) =>
      links.map((link) => ({
        pageId: link.getAttribute('data-ai-generator-created-page-link-id') ?? '',
        slug: link.getAttribute('data-ai-generator-created-page-link-slug') ?? '',
      })),
    );
    expect(createdPages.map((entry) => entry.slug).sort()).toEqual(expectedSlugs);

	    await expect.poll(async () => {
	      const pages = await listBuilderPages(page);
	      return expectedSlugs.every((slug) => pages.some((entry) => entry.slug === slug));
	    }).toBe(true);
	    await expect.poll(async () => {
	      const navigation = await listNavigationItems(page);
	      return expectedSlugs.every((slug) => navigation.some((item) => item.href === `/${LOCALE}/${slug}`));
	    }).toBe(true);

	    const publicResponse = await page.request.get(`/${LOCALE}`, {
	      headers: { Authorization: authHeader },
	    });
	    const publicHtml = await publicResponse.text();
	    expect(publicHtml).not.toContain(`/${LOCALE}/${expectedSlugs[0]}`);

	    for (const created of createdPages) {
      const seoResponse = await page.request.get(`/api/builder/site/pages/${encodeURIComponent(created.pageId)}/seo?locale=${LOCALE}`, {
        headers: { Authorization: authHeader },
      });
      const seoPayload = (await seoResponse.json()) as {
        seo?: { title?: string; description?: string; focusKeyword?: string };
      };
      expect(seoResponse.status()).toBe(200);
      expect(seoPayload.seo?.title).toContain('호정국제법률사무소');
      expect(seoPayload.seo?.description?.length ?? 0).toBeGreaterThan(20);
      expect(seoPayload.seo?.focusKeyword).toBe('대만 법률');

      const draftResponse = await page.request.get(`/api/builder/site/pages/${encodeURIComponent(created.pageId)}/draft?locale=${LOCALE}`, {
        headers: { Authorization: authHeader },
      });
      const draftPayload = (await draftResponse.json()) as {
        document?: { nodes?: Array<{ content?: { className?: string; text?: string } }> };
      };
      expect(draftResponse.status()).toBe(200);
      expect(draftPayload.document?.nodes?.some((node) =>
        node.content?.className?.includes('sitemap-draft-card'),
      )).toBe(true);
      expect(draftPayload.document?.nodes?.some((node) =>
        node.content?.className?.includes('ai-generated-sitemap-page-frame'),
      )).toBe(true);
      expect(draftPayload.document?.nodes?.some((node) =>
        node.content?.className?.includes('ai-generated-sitemap-plan-strip'),
      )).toBe(true);
      expect(draftPayload.document?.nodes?.some((node) =>
        node.content?.className === 'ai-generated-sitemap-plan-strip-text'
        && node.content.text?.includes('섹션'),
      )).toBe(true);
    }
  } finally {
    await Promise.all(createdPages.map((created) => deleteBuilderPage(page, created.pageId)));
    if (existingPageId) await deleteBuilderPage(page, existingPageId);
  }
});

test('/ko/admin-builder dashboard links to AI site generator', async ({ page }) => {
  await page.setExtraHTTPHeaders({ Authorization: authHeader });
  await page.goto(`/${LOCALE}/admin-builder`, { waitUntil: 'domcontentloaded' });

  await expect(page.getByRole('link', { name: /AI Site Generator/ }).first()).toHaveAttribute(
    'href',
    `/${LOCALE}/admin-builder/ai-generator`,
  );
});

test('/ko/admin-builder/ai-generator saves generated sections for reuse', async ({ page }) => {
  await page.setExtraHTTPHeaders({ Authorization: authHeader });
  await page.setViewportSize({ width: 390, height: 900 });
  let savedSectionId = '';

  try {
    await page.goto(`/${LOCALE}/admin-builder/ai-generator`, { waitUntil: 'domcontentloaded' });
    await page.getByRole('button', { name: /스타일/ }).click();
    await page.locator('[data-ai-generator-generate]').click();

    const sectionLibrary = page.locator('[data-ai-generator-section-library]');
    await expect(sectionLibrary).toBeVisible({ timeout: AI_GENERATE_TIMEOUT_MS });
    const reusableSection = sectionLibrary.locator('[data-ai-generator-section-card]').nth(1);
    await expect(reusableSection).toContainText('features');
    await reusableSection.locator('[data-ai-generator-save-section]').click();
    await expect(reusableSection.locator('[data-ai-generator-save-section]')).toContainText('저장됨');
    await expect(page.locator('[data-ai-generator-section-save-notice]')).toContainText('Saved Sections에 추가됨');
    savedSectionId = await reusableSection.getAttribute('data-ai-generator-saved-section-id') ?? '';
    expect(savedSectionId).toBeTruthy();

    let savedSection: {
      sectionId?: string;
      nodes?: Array<{
        kind?: string;
        content?: {
          sectionTemplateId?: string;
          className?: string;
        };
      }>;
    } | undefined;
    await expect.poll(async () => {
      const libraryResponse = await page.request.get(`/api/builder/site/section-library?locale=${LOCALE}`, {
        headers: { Authorization: authHeader },
      });
      if (!libraryResponse.ok()) return false;
      const libraryPayload = (await libraryResponse.json()) as {
        sections?: Array<{
          sectionId?: string;
          nodes?: Array<{
            kind?: string;
            content?: {
              sectionTemplateId?: string;
              className?: string;
            };
          }>;
        }>;
      };
      savedSection = libraryPayload.sections?.find((section) => section.sectionId === savedSectionId);
      return Boolean(savedSection);
    }).toBe(true);
    expect(savedSection).toBeTruthy();
    expect(savedSection?.nodes?.[0]?.content?.sectionTemplateId).toBe('services');
    expect(savedSection?.nodes?.some((node) => node.content?.className?.includes('services-detail-card'))).toBe(true);

    await openBuilder(page, `/${LOCALE}/admin-builder?aiSavedSection=${encodeURIComponent(savedSectionId)}`);
    await page.keyboard.press('Escape');
    const catalogDrawer = await openCatalogDrawer(page);
    await expect(catalogDrawer.getByText('Saved sections')).toBeVisible();
    const savedSectionCard = catalogDrawer.locator(`[data-builder-saved-section-card="${savedSectionId}"]`);
    await expect(savedSectionCard).toBeVisible();
    await savedSectionCard.locator(`[data-builder-saved-section-insert="${savedSectionId}"]`).click();
    await expect(page.locator('[data-node-id^="container-"][data-builder-section-template="services"]').last()).toHaveAttribute(
      'data-builder-section-template',
      'services',
      { timeout: 10_000 },
    );
  } finally {
    if (savedSectionId) {
      await page.request.delete(
        `/api/builder/site/section-library/${encodeURIComponent(savedSectionId)}?locale=${LOCALE}`,
        { headers: { Authorization: authHeader } },
      ).catch(() => undefined);
    }
  }
});

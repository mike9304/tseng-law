import { expect, test, type Page } from '@playwright/test';
import { openBuilder, openCatalogDrawer } from './helpers/editor';

function mutationHeaders(scope: string): Record<string, string> {
  const safeScope = scope.replace(/[^a-z0-9-]/gi, '-').slice(-48) || 'section-template-click';
  return { 'x-forwarded-for': `pw-${safeScope}` };
}

async function findPageIdBySlug(page: Page, slug: string, locale = 'ko'): Promise<string | null> {
  const response = await page.request.get(`/api/builder/site/pages?locale=${encodeURIComponent(locale)}`, {
    headers: mutationHeaders(slug),
    failOnStatusCode: false,
  });
  if (response.status() !== 200) return null;
  const payload = (await response.json()) as {
    pages?: Array<{ pageId?: string; slug?: string }>;
  };
  return payload.pages?.find((entry) => entry.slug === slug)?.pageId ?? null;
}

function collectHrefValues(value: unknown, hrefs: string[] = []): string[] {
  if (!value || typeof value !== 'object') return hrefs;
  if (Array.isArray(value)) {
    value.forEach((entry) => collectHrefValues(entry, hrefs));
    return hrefs;
  }
  Object.entries(value as Record<string, unknown>).forEach(([key, child]) => {
    if (key === 'href' && typeof child === 'string') {
      hrefs.push(child);
      return;
    }
    collectHrefValues(child, hrefs);
  });
  return hrefs;
}

type TestNavigationItem = {
  id?: string;
  pageId?: string;
  href?: string;
  label?: string | Record<string, string>;
  children?: TestNavigationItem[];
};

function findNavigationItemByPageId(items: TestNavigationItem[], pageId: string): TestNavigationItem | undefined {
  for (const item of items) {
    if (item.pageId === pageId) return item;
    const childMatch = item.children ? findNavigationItemByPageId(item.children, pageId) : undefined;
    if (childMatch) return childMatch;
  }
  return undefined;
}

test.describe('/ko/admin-builder section design templates', () => {
  test('lets users click a section chip before applying a design template', async ({ page }) => {
    await openBuilder(page, `/ko/admin-builder?sectionTemplateClick=${Date.now().toString(36)}`);
    await page.keyboard.press('Escape');

    await page.getByRole('button', { name: 'Design', exact: true }).click();
    const designDrawer = page.locator('aside[aria-hidden="false"]').filter({ hasText: 'Section design' }).first();
    await expect(designDrawer).toBeVisible();
    const servicesTarget = designDrawer.locator('[data-builder-section-template-target="services"]');
    await expect(servicesTarget).toContainText('12개 디자인 템플릿');
    await expect(designDrawer.locator('[data-builder-design-open-page-template-market="true"]')).toContainText(/전체 페이지 템플릿 \d+개 보기/);
    await servicesTarget.click();
    await expect(designDrawer).toContainText('주요 서비스의 글, 주소, 링크 데이터는 그대로');
    await expect(designDrawer.locator('[data-builder-section-template-option^="services:"]')).toHaveCount(12);
    await expect(designDrawer.getByRole('button', { name: '← 섹션 목록' })).toBeVisible();
    await expect(designDrawer.getByRole('button', { name: '섹션 목록으로 돌아가기' })).toBeVisible();
    await designDrawer.getByRole('button', { name: '← 섹션 목록' }).click();
    await expect(designDrawer.getByRole('button', { name: '칼럼 아카이브' })).toBeVisible();
    await designDrawer.getByRole('button', { name: '주요 서비스' }).click();
    await designDrawer.getByRole('button', { name: /Bento service grid/ }).click();

    const servicesRoot = page.locator('[data-node-id="home-services-root"]').first();
    await expect(servicesRoot).toHaveAttribute('data-builder-section-template', 'services');
    await expect(servicesRoot).toHaveAttribute('data-section-variant', 'split');
    await expect(page.locator('[data-node-id="home-services-card-0-detail-0"]').first()).toBeVisible();

    await page.locator('[data-node-id="home-services-list"]').first().click({ position: { x: 8, y: 8 } });
    await expect(page.locator('[data-node-id="home-services-card-0-detail-0"]').first()).toBeVisible();
    await expect(servicesRoot).toContainText('투자·법인설립');

    await page.locator('[data-node-id="home-services-card-1-title"]').first().click({ position: { x: 12, y: 12 } });
    await expect(page.locator('[data-node-id="home-services-card-1-detail-0"]').first()).toBeVisible();
    await expect(page.locator('[data-node-id="home-services-card-0-detail-0"]').first()).toBeVisible();
    await page.locator('[data-node-id="home-services-description"]').first().click({ position: { x: 12, y: 12 } });
    await expect(page.locator('[data-node-id="home-services-card-1-detail-0"]').first()).toBeVisible();
    await expect(page.locator('[data-node-id="home-services-card-0-detail-0"]').first()).toBeVisible();
    await page.locator('[data-node-id="home-hero-title"]').first().click({ position: { x: 12, y: 12 } });
    await expect(page.locator('[data-node-id="home-services-card-1-detail-0"]').first()).toBeVisible();
    await expect(page.locator('[data-node-id="home-services-card-0-detail-0"]').first()).toBeVisible();
  });

  test('opens the full page template showroom from the Design panel', async ({ page }) => {
    await openBuilder(page, `/ko/admin-builder?designPageTemplateMarket=${Date.now().toString(36)}`);
    await page.keyboard.press('Escape');

    await page.getByRole('button', { name: 'Design', exact: true }).click();
    const designDrawer = page.locator('aside[aria-hidden="false"]').filter({ hasText: 'Section design' }).first();
    await expect(designDrawer).toBeVisible();
    await designDrawer.locator('[data-builder-design-open-page-template-market="true"]').click();

    const gallery = page.getByRole('dialog', { name: '프리미엄 템플릿 쇼룸' });
    await expect(gallery).toBeVisible();
    await expect(gallery.getByRole('searchbox')).toHaveValue('홈페이지');
    await gallery.getByRole('button', { name: 'Close' }).click();
    await expect(gallery).toBeHidden();
  });

  test('keeps inserted service template text visible while selecting nested nodes', async ({ page }) => {
    await openBuilder(page, `/ko/admin-builder?builtInServiceTemplate=${Date.now().toString(36)}`);
    await page.keyboard.press('Escape');

    const catalogDrawer = await openCatalogDrawer(page);
    await expect(catalogDrawer.getByText('Section templates')).toBeVisible();
    await expect(catalogDrawer.locator('[data-builder-built-in-section-library="true"]')).toBeVisible();
    await catalogDrawer.getByRole('searchbox', { name: 'Search add elements' }).fill('주요업무');
    await expect(catalogDrawer.locator('[data-builder-built-in-section-result-count="true"]')).toContainText('12/12');
    await expect(catalogDrawer.locator('[data-builder-built-in-section-category="services"]')).toHaveCount(12);
    await expect(catalogDrawer.getByText('Case Intake Flow')).toBeVisible();
    await catalogDrawer.getByRole('searchbox', { name: 'Search add elements' }).fill('');
    await expect(catalogDrawer.locator('[data-builder-built-in-section-category="services"]')).toHaveCount(12);
    await expect(catalogDrawer.getByText('Practice Bento Board')).toBeVisible();
    const serviceTemplateButton = catalogDrawer.getByTitle('Service Accordion 섹션 추가');
    await serviceTemplateButton.scrollIntoViewIfNeeded();
    await expect(serviceTemplateButton).toBeVisible();
    await serviceTemplateButton.click();

    const insertedTitle = page.locator('[data-node-id^="heading-"]').filter({ hasText: '서비스 상세를 단계별로 펼쳐 보게 합니다' }).last();
    const scopeTitle = page.locator('[data-node-id^="heading-"]').filter({ hasText: 'Scope' }).last();
    const processTitle = page.locator('[data-node-id^="heading-"]').filter({ hasText: 'Process' }).last();
    const deliverablesTitle = page.locator('[data-node-id^="heading-"]').filter({ hasText: 'Deliverables' }).last();
    const scopeBody = page.getByText('포함 범위와 제외 범위를 명확히 합니다.').last();
    const processBody = page.getByText('진행 단계와 담당 역할을 설명합니다.').last();
    const deliverablesBody = page.getByText('최종 산출물을 구체적으로 안내합니다.').last();

    await expect(insertedTitle).toBeVisible();
    await expect(scopeTitle).toBeVisible();
    await expect(processTitle).toBeVisible();
    await expect(deliverablesTitle).toBeVisible();

    await insertedTitle.click();
    await expect(scopeBody).toBeVisible();

    await scopeTitle.click();
    await expect(scopeBody).toBeVisible();

    await processTitle.click();
    await expect(processBody).toBeVisible();

    await page.locator('[data-node-id="home-hero-title"]').first().click({ position: { x: 12, y: 12 } });
    await expect(deliverablesBody).toBeVisible();
  });

  test('opens the full page template showroom from the Add panel', async ({ page }) => {
    await openBuilder(page, `/ko/admin-builder?pageTemplateMarket=${Date.now().toString(36)}`);
    await page.keyboard.press('Escape');

    const catalogDrawer = await openCatalogDrawer(page);
    const addSearch = catalogDrawer.getByRole('searchbox', { name: 'Search add elements' });
    await addSearch.fill('홈페이지');
    await expect(catalogDrawer.locator('[data-builder-open-page-template-market="true"]')).toBeVisible();
    const pageTemplateResults = catalogDrawer.locator('[data-builder-page-template-search-results="true"]');
    await expect(pageTemplateResults).toBeVisible();
    await expect(pageTemplateResults.locator('[data-builder-page-template-result-count="true"]')).toContainText('/261 page templates');
    await expect(pageTemplateResults.locator('[data-builder-page-template-result-id$="-home"]').first()).toBeVisible();

    await addSearch.fill('법률');
    const lawHomeResult = pageTemplateResults.locator('[data-builder-page-template-result-id="law-home"]');
    await expect(lawHomeResult).toContainText('법률사무소 홈');
    await expect(lawHomeResult.locator('[data-template-thumbnail-renderer="html-scaled-mock"]')).toBeVisible();
    await expect(lawHomeResult.locator('[data-builder-page-template-quality="true"]')).toContainText('Premium');
    await lawHomeResult.click();

    const gallery = page.getByRole('dialog', { name: '프리미엄 템플릿 쇼룸' });
    await expect(gallery).toBeVisible();
    await expect(gallery.getByRole('searchbox')).toHaveValue('법률사무소 홈');
    await expect(gallery.getByRole('button', { name: '법률사무소 홈 미리보기' })).toBeVisible();

    await gallery.getByRole('searchbox').fill('여행사 홈');
    await expect(gallery.getByRole('button', { name: '여행사 홈 미리보기' })).toBeVisible();

    await gallery.getByRole('button', { name: '여행사 홈 미리보기' }).click();
    const preview = page.getByRole('dialog', { name: '여행사 홈' });
    await expect(preview).toBeVisible();
    await preview.getByRole('button', { name: '이 템플릿 사용' }).click();
    await expect(page.getByText('선택한 템플릿으로 새 페이지를 생성합니다.')).toBeVisible();
    await page.getByRole('button', { name: '다른 템플릿 선택' }).click();
    await expect(gallery).toBeVisible();
    await expect(gallery.getByRole('searchbox')).toHaveValue('여행사 홈');

    await gallery.getByRole('button', { name: 'Close' }).click();
    await expect(gallery).toBeHidden();
  });

  test('creates and selects a real page from a page template', async ({ page }) => {
    test.setTimeout(90_000);

    const token = Date.now().toString(36);
    const slug = `g-editor-template-page-${token}`;
    let pageId: string | null = null;
    await page.setExtraHTTPHeaders(mutationHeaders(slug));

    try {
      await openBuilder(page, `/ko/admin-builder?templateCreate=${token}`);
      await page.keyboard.press('Escape');

      const catalogDrawer = await openCatalogDrawer(page);
      const addSearch = catalogDrawer.getByRole('searchbox', { name: 'Search add elements' });
      await addSearch.fill('법률');
      const pageTemplateResults = catalogDrawer.locator('[data-builder-page-template-search-results="true"]');
      const lawHomeResult = pageTemplateResults.locator('[data-builder-page-template-result-id="law-home"]');
      await expect(lawHomeResult).toContainText('법률사무소 홈');
      await lawHomeResult.click();

      const gallery = page.getByRole('dialog', { name: '프리미엄 템플릿 쇼룸' });
      await expect(gallery).toBeVisible();
      await gallery.getByRole('button', { name: '법률사무소 홈 미리보기' }).click();
      const preview = page.getByRole('dialog', { name: '법률사무소 홈' });
      await expect(preview).toBeVisible();
      await preview.getByRole('button', { name: '이 템플릿 사용' }).click();

      const slugPrompt = page.getByRole('dialog', { name: '페이지 slug 입력' });
      await expect(slugPrompt).toBeVisible();
      await expect(slugPrompt.getByLabel('메뉴에 추가')).toBeChecked();
      await slugPrompt.getByPlaceholder('예: about, services, contact').fill(slug);
      await slugPrompt.getByRole('button', { name: '생성' }).click();
      await expect(slugPrompt).toBeHidden({ timeout: 20_000 });
      await expect(page.getByRole('button', { name: `/${slug}`, exact: true })).toBeVisible({ timeout: 20_000 });

      const canvas = page.getByRole('application', { name: 'Canvas editor' });
      await expect(canvas.getByText('신뢰할 수 있는 법률 파트너')).toBeVisible({ timeout: 20_000 });
      await expect(canvas.getByText('주요 업무 분야')).toBeVisible();

      pageId = await findPageIdBySlug(page, slug);
      expect(pageId).toBeTruthy();

      const pagesResponse = await page.request.get('/api/builder/site/pages?locale=ko', {
        headers: mutationHeaders(slug),
      });
      expect(pagesResponse.status()).toBe(200);
      const pagesPayload = (await pagesResponse.json()) as {
        pages?: Array<{ pageId?: string; slug?: string; title?: Record<string, string> }>;
      };
      const createdPage = pagesPayload.pages?.find((entry) => entry.slug === slug);
      expect(createdPage?.pageId).toBe(pageId);
      expect(createdPage?.title?.ko).toBe('법률사무소 홈');

      const navigationResponse = await page.request.get('/api/builder/site/navigation?locale=ko', {
        headers: mutationHeaders(slug),
      });
      expect(navigationResponse.status()).toBe(200);
      const navigationPayload = (await navigationResponse.json()) as {
        navigation?: Array<{ pageId?: string; href?: string; label?: string | Record<string, string> }>;
      };
      const navItem = navigationPayload.navigation?.find((entry) => entry.pageId === pageId);
      expect(navItem?.href).toBe(`/ko/${slug}`);
      const navLabel = navItem?.label;
      expect(typeof navLabel === 'object' && navLabel ? navLabel.ko : navLabel).toBe('법률사무소 홈');

      const draftResponse = await page.request.get(`/api/builder/site/pages/${pageId}/draft?locale=ko`, {
        headers: mutationHeaders(slug),
      });
      expect(draftResponse.status()).toBe(200);
      const draftPayload = (await draftResponse.json()) as { document?: unknown };
      expect(JSON.stringify(draftPayload.document)).toContain('신뢰할 수 있는 법률 파트너');

      const publishResponse = await page.request.post(`/api/builder/site/pages/${pageId}/publish?locale=ko`, {
        headers: mutationHeaders(slug),
      });
      expect(publishResponse.status()).toBe(200);

      await page.goto(`/ko/${slug}`, { waitUntil: 'domcontentloaded' });
      const publicMainNav = page.getByRole('navigation', { name: 'Main' });
      await expect(publicMainNav.getByRole('link', { name: '법률사무소 홈' })).toHaveAttribute('href', `/ko/${slug}`);
    } finally {
      pageId ??= await findPageIdBySlug(page, slug);
      if (pageId) {
        await page.request.delete(`/api/builder/site/pages/${pageId}?locale=ko`, {
          headers: mutationHeaders(slug),
          failOnStatusCode: false,
        });
      }
      await page.request.get('/ko/admin-builder?reseed=1', { timeout: 60_000 }).catch(() => undefined);
    }
  });

  test('creates zh-hant template pages with localized menu and safe template links', async ({ page }) => {
    test.setTimeout(90_000);

    const locale = 'zh-hant';
    const token = Date.now().toString(36);
    const slug = `g-editor-template-zh-${token}`;
    let pageId: string | null = null;
    await page.setExtraHTTPHeaders(mutationHeaders(slug));

    try {
      await openBuilder(page, `/${locale}/admin-builder?templateLocale=${token}`);
      await page.keyboard.press('Escape');

      const catalogDrawer = await openCatalogDrawer(page);
      const addSearch = catalogDrawer.getByRole('searchbox', { name: 'Search add elements' });
      await addSearch.fill('법률');
      const pageTemplateResults = catalogDrawer.locator('[data-builder-page-template-search-results="true"]');
      const lawHomeResult = pageTemplateResults.locator('[data-builder-page-template-result-id="law-home"]');
      await expect(lawHomeResult).toContainText('법률사무소 홈');
      await lawHomeResult.click();

      const gallery = page.getByRole('dialog', { name: '프리미엄 템플릿 쇼룸' });
      await expect(gallery).toBeVisible();
      await gallery.getByRole('button', { name: '법률사무소 홈 미리보기' }).click();
      const preview = page.getByRole('dialog', { name: '법률사무소 홈' });
      await expect(preview).toBeVisible();
      await preview.getByRole('button', { name: '이 템플릿 사용' }).click();

      const slugPrompt = page.getByRole('dialog', { name: '페이지 slug 입력' });
      await expect(slugPrompt).toBeVisible();
      await expect(slugPrompt.getByLabel('메뉴에 추가')).toBeChecked();
      await slugPrompt.getByPlaceholder('예: about, services, contact').fill(slug);
      await slugPrompt.getByRole('button', { name: '생성' }).click();
      await expect(slugPrompt).toBeHidden({ timeout: 20_000 });
      await expect(page.getByRole('button', { name: `/${slug}`, exact: true })).toBeVisible({ timeout: 20_000 });

      const canvas = page.getByRole('application', { name: 'Canvas editor' });
      await expect(canvas.getByText('신뢰할 수 있는 법률 파트너')).toBeVisible({ timeout: 20_000 });

      pageId = await findPageIdBySlug(page, slug, locale);
      expect(pageId).toBeTruthy();

      const navigationResponse = await page.request.get(`/api/builder/site/navigation?locale=${locale}`, {
        headers: mutationHeaders(slug),
      });
      expect(navigationResponse.status()).toBe(200);
      const navigationPayload = (await navigationResponse.json()) as {
        navigation?: Array<{ pageId?: string; href?: string; label?: string | Record<string, string> }>;
      };
      const navItem = navigationPayload.navigation?.find((entry) => entry.pageId === pageId);
      expect(navItem?.href).toBe(`/${locale}/${slug}`);
      const navLabel = navItem?.label;
      expect(typeof navLabel === 'object' && navLabel ? navLabel.ko : navLabel).toBe('법률사무소 홈');

      const draftResponse = await page.request.get(`/api/builder/site/pages/${pageId}/draft?locale=${locale}`, {
        headers: mutationHeaders(slug),
      });
      expect(draftResponse.status()).toBe(200);
      const draftPayload = (await draftResponse.json()) as { document?: unknown };
      const hrefs = collectHrefValues(draftPayload.document);
      expect(hrefs.length).toBeGreaterThan(0);
      expect(hrefs.filter((href) => href === '/ko' || href.startsWith('/ko/'))).toEqual([]);

      const publishResponse = await page.request.post(`/api/builder/site/pages/${pageId}/publish?locale=${locale}`, {
        headers: mutationHeaders(slug),
      });
      expect(publishResponse.status()).toBe(200);

      await page.goto(`/${locale}/${slug}`, { waitUntil: 'domcontentloaded' });
      const publicMainNav = page.getByRole('navigation', { name: 'Main' });
      await expect(publicMainNav.getByRole('link', { name: '법률사무소 홈' })).toHaveAttribute('href', `/${locale}/${slug}`);
    } finally {
      pageId ??= await findPageIdBySlug(page, slug, locale);
      if (pageId) {
        await page.request.delete(`/api/builder/site/pages/${pageId}?locale=${locale}`, {
          headers: mutationHeaders(slug),
          failOnStatusCode: false,
        });
      }
      await page.request.get(`/${locale}/admin-builder?reseed=1`, { timeout: 60_000 }).catch(() => undefined);
    }
  });

  test('stores page template documents with localized internal hrefs through the pages api', async ({ page }) => {
    test.setTimeout(60_000);

    const token = Date.now().toString(36);
    const locales = ['zh-hant', 'en'] as const;

    for (const locale of locales) {
      const slug = `g-editor-link-normalize-${locale.replace(/[^a-z0-9]/gi, '-')}-${token}`;
      let pageId: string | null = null;

      await test.step(`normalizes template hrefs for ${locale}`, async () => {
        try {
          const createResponse = await page.request.post('/api/builder/site/pages', {
            data: {
              locale,
              slug,
              title: `Template link normalize ${locale}`,
              document: {
                version: 1,
                locale: 'ko',
                updatedAt: '2026-05-13T00:00:00.000Z',
                updatedBy: 'playwright-template-link-normalize',
                stageWidth: 1280,
                stageHeight: 880,
                nodes: [
                  {
                    id: 'button-ko-contact',
                    kind: 'button',
                    rect: { x: 100, y: 100, width: 180, height: 48 },
                    zIndex: 0,
                    content: {
                      label: '상담 요청',
                      href: '/ko/contact',
                      style: 'primary',
                      link: { href: '/ko?source=template', target: '_self' },
                    },
                  },
                  {
                    id: 'text-ko-services',
                    kind: 'text',
                    rect: { x: 100, y: 170, width: 360, height: 80 },
                    zIndex: 1,
                    content: {
                      text: '서비스 보기',
                      fontSize: 18,
                      color: '#111827',
                      fontWeight: 'regular',
                      align: 'left',
                      link: { href: '/ko/services?from=text', target: '_self' },
                    },
                  },
                  {
                    id: 'image-hotspot',
                    kind: 'image',
                    rect: { x: 100, y: 280, width: 320, height: 180 },
                    zIndex: 2,
                    content: {
                      src: '/images/header-skyline-buildings.webp',
                      alt: 'office',
                      fit: 'cover',
                      hotspots: [
                        { x: 50, y: 50, label: '문의', href: '/ko/about' },
                        { x: 65, y: 55, label: '외부', href: 'https://example.com/ko/about' },
                        { x: 70, y: 60, label: '홈 앵커', href: '/ko#top' },
                      ],
                      link: { href: '#contact', target: '_self' },
                    },
                  },
                ],
              },
            },
            headers: mutationHeaders(slug),
          });
          expect(createResponse.status()).toBe(200);
          const created = (await createResponse.json()) as { pageId?: string; success?: boolean; error?: string };
          expect(created.success, created.error).toBe(true);
          expect(created.pageId).toBeTruthy();
          pageId = created.pageId!;

          const draftResponse = await page.request.get(`/api/builder/site/pages/${pageId}/draft?locale=${locale}`, {
            headers: mutationHeaders(slug),
          });
          expect(draftResponse.status()).toBe(200);
          const draftPayload = (await draftResponse.json()) as {
            document?: {
              locale?: string;
              nodes?: Array<{ id?: string; content?: Record<string, unknown> }>;
            };
          };
          expect(draftPayload.document?.locale).toBe(locale);

          const nodes = draftPayload.document?.nodes ?? [];
          const button = nodes.find((node) => node.id === 'button-ko-contact')?.content as
            | { href?: string; link?: { href?: string } }
            | undefined;
          expect(button?.href).toBe(`/${locale}/contact`);
          expect(button?.link?.href).toBe(`/${locale}?source=template`);

          const text = nodes.find((node) => node.id === 'text-ko-services')?.content as
            | { link?: { href?: string } }
            | undefined;
          expect(text?.link?.href).toBe(`/${locale}/services?from=text`);

          const image = nodes.find((node) => node.id === 'image-hotspot')?.content as
            | { hotspots?: Array<{ href?: string }>; link?: { href?: string } }
            | undefined;
          expect(image?.hotspots?.[0]?.href).toBe(`/${locale}/about`);
          expect(image?.hotspots?.[1]?.href).toBe('https://example.com/ko/about');
          expect(image?.hotspots?.[2]?.href).toBe(`/${locale}#top`);
          expect(image?.link?.href).toBe('#contact');

          const internalKoHrefs = collectHrefValues(draftPayload.document)
            .filter((href) => href === '/ko' || href.startsWith('/ko/'));
          expect(internalKoHrefs).toEqual([]);
        } finally {
          pageId ??= await findPageIdBySlug(page, slug, locale);
          if (pageId) {
            await page.request.delete(`/api/builder/site/pages/${pageId}?locale=${locale}`, {
              headers: mutationHeaders(slug),
              failOnStatusCode: false,
            });
          }
        }
      });
    }
  });

  test('keeps auto-added page navigation label and href in sync after rename and delete', async ({ page }) => {
    test.setTimeout(90_000);

    const token = Date.now().toString(36);
    const slug = `g-editor-nav-sync-${token}`;
    const renamedSlug = `${slug}-renamed`;
    const title = `Auto nav sync ${token}`;
    const renamedTitle = `Auto nav sync renamed ${token}`;
    let pageId: string | null = null;
    await page.setExtraHTTPHeaders(mutationHeaders(slug));

    try {
      const createResponse = await page.request.post('/api/builder/site/pages', {
        data: {
          locale: 'ko',
          slug,
          title,
          document: {
            version: 1,
            locale: 'ko',
            updatedAt: '2026-05-13T00:00:00.000Z',
            updatedBy: 'playwright-nav-sync',
            stageWidth: 1280,
            stageHeight: 880,
            nodes: [
              {
                id: 'nav-sync-heading',
                kind: 'heading',
                rect: { x: 100, y: 100, width: 600, height: 80 },
                zIndex: 0,
                content: {
                  text: title,
                  level: 1,
                  color: '#111827',
                  align: 'left',
                },
              },
            ],
          },
          addToNavigation: true,
        },
        headers: mutationHeaders(slug),
      });
      expect(createResponse.status()).toBe(200);
      const created = (await createResponse.json()) as { pageId?: string; success?: boolean; error?: string };
      expect(created.success, created.error).toBe(true);
      expect(created.pageId).toBeTruthy();
      pageId = created.pageId!;

      const navigationResponse = await page.request.get('/api/builder/site/navigation?locale=ko', {
        headers: mutationHeaders(slug),
      });
      expect(navigationResponse.status()).toBe(200);
      const navigationPayload = (await navigationResponse.json()) as { navigation?: TestNavigationItem[] };
      const createdNavItem = findNavigationItemByPageId(navigationPayload.navigation ?? [], pageId);
      expect(createdNavItem?.id).toBe(`nav-${pageId}`);
      expect(createdNavItem?.href).toBe(`/ko/${slug}`);
      const createdLabel = createdNavItem?.label;
      expect(typeof createdLabel === 'object' && createdLabel ? createdLabel.ko : createdLabel).toBe(title);

      const publishResponse = await page.request.post(`/api/builder/site/pages/${pageId}/publish?locale=ko`, {
        headers: mutationHeaders(slug),
      });
      expect(publishResponse.status()).toBe(200);

      await page.goto(`/ko/${slug}`, { waitUntil: 'domcontentloaded' });
      const publicMainNav = page.getByRole('navigation', { name: 'Main' });
      await expect(publicMainNav.getByRole('link', { name: title })).toHaveAttribute('href', `/ko/${slug}`);

      const renameResponse = await page.request.patch(`/api/builder/site/pages/${pageId}?locale=ko`, {
        data: {
          title: renamedTitle,
          slug: renamedSlug,
        },
        headers: mutationHeaders(slug),
      });
      expect(renameResponse.status()).toBe(200);
      const renamePayload = (await renameResponse.json()) as { page?: { slug?: string; title?: Record<string, string> } };
      expect(renamePayload.page?.slug).toBe(renamedSlug);
      expect(renamePayload.page?.title?.ko).toBe(renamedTitle);

      const navAfterRenameResponse = await page.request.get('/api/builder/site/navigation?locale=ko', {
        headers: mutationHeaders(slug),
      });
      expect(navAfterRenameResponse.status()).toBe(200);
      const navAfterRenamePayload = (await navAfterRenameResponse.json()) as { navigation?: TestNavigationItem[] };
      const renamedNavItem = findNavigationItemByPageId(navAfterRenamePayload.navigation ?? [], pageId);
      expect(renamedNavItem?.href).toBe(`/ko/${renamedSlug}`);
      const renamedLabel = renamedNavItem?.label;
      expect(typeof renamedLabel === 'object' && renamedLabel ? renamedLabel.ko : renamedLabel).toBe(renamedTitle);

      await page.goto(`/ko/${renamedSlug}`, { waitUntil: 'domcontentloaded' });
      const renamedPublicMainNav = page.getByRole('navigation', { name: 'Main' });
      await expect(renamedPublicMainNav.getByRole('link', { name: renamedTitle })).toHaveAttribute('href', `/ko/${renamedSlug}`);
      await expect(renamedPublicMainNav.getByRole('link', { name: title })).toHaveCount(0);

      const deleteResponse = await page.request.delete(`/api/builder/site/pages/${pageId}?locale=ko`, {
        headers: mutationHeaders(slug),
      });
      expect(deleteResponse.status()).toBe(200);

      const navAfterDeleteResponse = await page.request.get('/api/builder/site/navigation?locale=ko', {
        headers: mutationHeaders(slug),
      });
      expect(navAfterDeleteResponse.status()).toBe(200);
      const navAfterDeletePayload = (await navAfterDeleteResponse.json()) as { navigation?: TestNavigationItem[] };
      expect(findNavigationItemByPageId(navAfterDeletePayload.navigation ?? [], pageId)).toBeUndefined();

      await page.goto('/ko', { waitUntil: 'domcontentloaded' });
      const homeMainNav = page.getByRole('navigation', { name: 'Main' });
      await expect(homeMainNav.getByRole('link', { name: renamedTitle })).toHaveCount(0);
      pageId = null;
    } finally {
      pageId ??= await findPageIdBySlug(page, slug);
      pageId ??= await findPageIdBySlug(page, renamedSlug);
      if (pageId) {
        await page.request.delete(`/api/builder/site/pages/${pageId}?locale=ko`, {
          headers: mutationHeaders(slug),
          failOnStatusCode: false,
        });
      }
      await page.request.get('/ko/admin-builder?reseed=1', { timeout: 60_000 }).catch(() => undefined);
    }
  });

  test('keeps the page template creation prompt usable after a duplicate slug error', async ({ page }) => {
    test.setTimeout(90_000);

    const token = Date.now().toString(36);
    const slug = `g-editor-template-retry-${token}`;
    let pageId: string | null = null;
    await page.setExtraHTTPHeaders(mutationHeaders(slug));

    try {
      const createResponse = await page.request.post('/api/builder/site/pages', {
        data: {
          locale: 'ko',
          slug,
          title: `Template retry source ${token}`,
          blank: true,
        },
        headers: mutationHeaders(slug),
      });
      expect(createResponse.status()).toBe(200);
      const created = (await createResponse.json()) as { pageId?: string; success?: boolean; error?: string };
      expect(created.success, created.error).toBe(true);
      expect(created.pageId).toBeTruthy();
      pageId = created.pageId!;

      await openBuilder(page, `/ko/admin-builder?templateRetry=${token}`);
      await page.keyboard.press('Escape');

      const catalogDrawer = await openCatalogDrawer(page);
      const addSearch = catalogDrawer.getByRole('searchbox', { name: 'Search add elements' });
      await addSearch.fill('법률');
      const pageTemplateResults = catalogDrawer.locator('[data-builder-page-template-search-results="true"]');
      const lawHomeResult = pageTemplateResults.locator('[data-builder-page-template-result-id="law-home"]');
      await expect(lawHomeResult).toContainText('법률사무소 홈');
      await lawHomeResult.click();

      const gallery = page.getByRole('dialog', { name: '프리미엄 템플릿 쇼룸' });
      await expect(gallery).toBeVisible();
      await gallery.getByRole('button', { name: '법률사무소 홈 미리보기' }).click();
      const preview = page.getByRole('dialog', { name: '법률사무소 홈' });
      await expect(preview).toBeVisible();
      await preview.getByRole('button', { name: '이 템플릿 사용' }).click();

      const slugPrompt = page.getByRole('dialog', { name: '페이지 slug 입력' });
      await expect(slugPrompt).toBeVisible();
      await expect(slugPrompt).toContainText('선택한 템플릿으로 새 페이지를 생성합니다.');
      const slugInput = slugPrompt.getByPlaceholder('예: about, services, contact');
      await slugInput.fill(slug);
      await slugPrompt.getByRole('button', { name: '생성' }).click();

      await expect(slugPrompt).toBeVisible();
      await expect(slugPrompt.getByRole('status')).toContainText('같은 locale 안에 동일한 slug');
      await expect(slugInput).toHaveValue(slug);
      await expect(slugPrompt.getByRole('button', { name: '다른 템플릿 선택' })).toBeVisible();

      await slugPrompt.getByRole('button', { name: '다른 템플릿 선택' }).click();
      await expect(gallery).toBeVisible();
      await expect(gallery.getByRole('searchbox')).toHaveValue('법률사무소 홈');
    } finally {
      pageId ??= await findPageIdBySlug(page, slug);
      if (pageId) {
        await page.request.delete(`/api/builder/site/pages/${pageId}?locale=ko`, {
          headers: mutationHeaders(slug),
          failOnStatusCode: false,
        });
      }
      await page.request.get('/ko/admin-builder?reseed=1', { timeout: 60_000 }).catch(() => undefined);
    }
  });
});

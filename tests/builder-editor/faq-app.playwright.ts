import { expect, test } from '@playwright/test';
import {
  createFaq,
  createFaqWithOverrides,
  createPublishedPage,
  deleteFaq,
  deletePublishedPage,
  expectPresent,
  installFaqApp,
  LOCALE,
  rebuildSearch,
  uninstallFaqApp,
} from './helpers/faq-app-fixture-api';

test('native FAQ app backs public FAQ page, widgets, schema, and search index', async ({ page }) => {
  const token = Date.now().toString(36);
  const pageSlug = `f47-faq-widgets-${token}`;
  const createdFaqIds: string[] = [];
  let pageId: string | null = null;

  await uninstallFaqApp(page.request, token);

  try {
    await installFaqApp(page.request, token);
    const publishedFaq = await createFaqWithOverrides(page.request, token, {
      question: `F47 FAQ 앱 검색 질문 ${token} A`,
      answer: `F47 FAQ 앱 공개 답변 ${token} A category search schema`,
      sortOrder: 1,
    }, 'published');
    createdFaqIds.push(publishedFaq.faqId);
    const hashTargetFaq = await createFaqWithOverrides(page.request, token, {
      question: `F47 FAQ 앱 검색 질문 ${token} B`,
      answer: `F47 FAQ 앱 공개 답변 ${token} B category search schema`,
      sortOrder: 2,
    }, 'published');
    createdFaqIds.push(hashTargetFaq.faqId);
    const companyFaq = await createFaqWithOverrides(page.request, token, {
      question: `F47 FAQ 앱 검색 질문 ${token} C`,
      answer: `F47 FAQ 앱 공개 답변 ${token} C category search schema`,
      categoryId: 'company-setup',
      sortOrder: 3,
    }, 'published');
    createdFaqIds.push(companyFaq.faqId);
    const draftFaq = await createFaq(page.request, `${token}-draft`, 'draft');
    createdFaqIds.push(draftFaq.faqId);

    const adminResponse = await page.request.get(`/api/builder/faq?locale=${LOCALE}&status=all&q=${token}`);
    expect(adminResponse.status()).toBe(200);
    const adminJson = await adminResponse.json() as { total?: number; items?: Array<{ status: string }>; error?: string };
    expect(adminJson.total ?? 0, adminJson.error).toBeGreaterThanOrEqual(2);
    expect(adminJson.items?.some((item) => item.status === 'draft')).toBe(true);

    const publicApiResponse = await page.request.get(`/api/faq?locale=${LOCALE}&category=consultation&q=${token}`);
    expect(publicApiResponse.status()).toBe(200);
    const publicApiJson = await publicApiResponse.json() as { total?: number; items?: Array<{ question: string; slug: string }>; error?: string };
    expect(publicApiJson.items?.map((item) => item.question)).toContain(`F47 FAQ 앱 검색 질문 ${token} A`);
    expect(publicApiJson.items?.map((item) => item.question)).toContain(`F47 FAQ 앱 검색 질문 ${token} B`);
    expect(publicApiJson.items?.map((item) => item.question)).not.toContain(`F47 FAQ 앱 검색 질문 ${token}-draft`);
    const hashTarget = publicApiJson.items?.find((item) => item.question === `F47 FAQ 앱 검색 질문 ${token} B`);
    expectPresent(hashTarget, `public API hash target for ${token}`);
    const hashTargetSlug = hashTarget.slug;
    expectPresent(hashTargetSlug, `public API hash target slug for ${token}`);

    await page.goto(`/${LOCALE}/faq?q=${encodeURIComponent(token)}#${encodeURIComponent(hashTargetSlug)}`, { waitUntil: 'domcontentloaded' });
    await expect(page).toHaveURL(`/${LOCALE}/faq?q=${encodeURIComponent(token)}#${encodeURIComponent(hashTargetSlug)}`);
    await expect(page.locator('[data-public-faq-explorer="true"]')).toContainText(`F47 FAQ 앱 검색 질문 ${token} A`);
    await expect(page.locator('[data-public-faq-explorer="true"]')).toContainText(`F47 FAQ 앱 검색 질문 ${token} B`);
    await expect(page.locator('[data-public-faq-explorer="true"] [aria-label="FAQ 분류"]')).toBeVisible();
    await expect(page.getByRole('link', { name: '전체' })).toHaveAttribute('href', /\/ko\/faq(?:#.*)?$/);
    await expect(page.getByRole('link', { name: '상담·비용' })).toHaveAttribute('href', /category=consultation/);
    await expect(page.getByRole('link', { name: '초기화' })).toHaveAttribute('href', /\/ko\/faq(?:#.*)?$/);
    const faqSearch = page.locator('[data-public-faq-explorer="true"] input[type="search"]');
    await expect(faqSearch).toHaveValue(token);
    await expect(page.locator('[data-public-faq-item]')).toHaveCount(3);
    await expect(page.locator(`[data-public-faq-item="${publishedFaq.faqId}"] > button`)).toHaveAttribute('aria-expanded', 'false');
    await expect(page.locator(`[data-public-faq-item="${hashTargetFaq.faqId}"] > button`)).toHaveAttribute('aria-expanded', 'true');
    await expect(page.locator('[data-public-faq-explorer="true"]')).not.toContainText(`F47 FAQ 앱 검색 질문 ${token}-draft`);
    await page.reload({ waitUntil: 'domcontentloaded' });
    await expect(page).toHaveURL(`/${LOCALE}/faq?q=${encodeURIComponent(token)}#${encodeURIComponent(hashTargetSlug)}`);
    await expect(page.locator('[data-public-faq-item]')).toHaveCount(3);
    await expect(page.locator(`[data-public-faq-item="${publishedFaq.faqId}"] > button`)).toHaveAttribute('aria-expanded', 'false');
    await expect(page.locator(`[data-public-faq-item="${hashTargetFaq.faqId}"] > button`)).toHaveAttribute('aria-expanded', 'true');
    await page.getByRole('link', { name: '초기화' }).click();
    await expect(page).toHaveURL(new RegExp(`^https?://[^/]+/${LOCALE}/faq(?:\\?.*)?(?:#.*)?$`));
    await expect(faqSearch).toHaveValue('');
    await expect(page.locator(`[data-public-faq-item="${publishedFaq.faqId}"] > button`)).toHaveAttribute('aria-expanded', 'false');
    await expect(page.locator(`[data-public-faq-item="${hashTargetFaq.faqId}"] > button`)).toHaveAttribute('aria-expanded', 'true');
    await page.locator(`[data-public-faq-item="${publishedFaq.faqId}"] > button`).click();
    await expect(page).toHaveURL(`/${LOCALE}/faq#${encodeURIComponent(publishedFaq.slug)}`);
    await expect(page.locator(`[data-public-faq-item="${publishedFaq.faqId}"] > button`)).toHaveAttribute('aria-expanded', 'true');
    await expect(page.getByRole('link', { name: '전체' })).toHaveAttribute('href', new RegExp(`#${encodeURIComponent(publishedFaq.slug)}$`));
    await page.getByRole('link', { name: '법인설립' }).click();
    await expect(page).toHaveURL(`/${LOCALE}/faq?category=company-setup`);
    await expect(page.locator('[data-public-faq-explorer="true"] input[type="search"]')).toHaveValue('');
    await expect(page.locator(`[data-public-faq-item="${companyFaq.faqId}"] > button`)).toHaveAttribute('aria-expanded', 'false');
    const publicJsonLd = await page.locator('script[type="application/ld+json"]').evaluateAll((nodes) => nodes.map((node) => node.textContent ?? '').join('\n'));
    expect(publicJsonLd).toContain('"@type":"FAQPage"');
    expect(publicJsonLd).toContain(`F47 FAQ 앱 검색 질문 ${token} C`);
    expect(publicJsonLd).toContain(`F47 FAQ 앱 검색 질문 ${token} A`);
    expect(publicJsonLd).toContain(`F47 FAQ 앱 검색 질문 ${token} B`);
    expect(publicJsonLd).not.toContain(`F47 FAQ 앱 검색 질문 ${token}-draft`);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);

    pageId = await createPublishedPage(page.request, pageSlug, token);
    await page.goto(`/${LOCALE}/${pageSlug}`, { waitUntil: 'networkidle' });
    await expect(page.locator('[data-node-id="f47-faq-list"]')).toHaveAttribute('data-builder-app-runtime-status', 'enabled');
    await expect(page.locator('[data-node-id="f47-faq-search"]')).toHaveAttribute('data-builder-app-runtime-status', 'enabled');
    await expect(page.locator('[data-builder-faq-widget="true"]')).toContainText(`F47 FAQ 앱 검색 질문 ${token}`);
    const widgetCategoryButtons = page.locator('[data-builder-faq-widget="true"] button[aria-pressed]');
    await expect(widgetCategoryButtons).toHaveCount(7);
    await expect(page.locator('[data-builder-site-search="true"]')).toHaveAttribute('data-builder-site-search-kinds', 'faq');
    await page.locator('[data-builder-faq-widget="true"] input[type="search"]').fill(token);
    await expect.poll(() => page.url()).toContain(`q=${token}`);
    await expect.poll(() => new URL(page.url()).searchParams.get('category')).toBe('consultation');
    await expect(page.locator('[data-builder-faq-item]').filter({ hasText: token })).toHaveCount(2);
    await widgetCategoryButtons.filter({ hasText: '법인설립' }).click();
    await expect.poll(() => new URL(page.url()).searchParams.get('category')).toBe('company-setup');
    await expect(page.locator('[data-builder-faq-item]').filter({ hasText: token })).toHaveCount(1);
    const widgetJsonLd = await page.locator('script[type="application/ld+json"]').evaluateAll((nodes) => nodes.map((node) => node.textContent ?? '').join('\n'));
    expect(widgetJsonLd).toContain(`F47 FAQ 앱 검색 질문 ${token} A`);
    expect(widgetJsonLd).toContain(`F47 FAQ 앱 검색 질문 ${token} B`);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);

    await rebuildSearch(page.request, token);
    const searchResponse = await page.request.get(`/api/search?locale=${LOCALE}&kinds=faq&q=${encodeURIComponent(token)}`);
    expect(searchResponse.status()).toBe(200);
    const searchJson = await searchResponse.json() as { hits?: Array<{ kind: string; title: string; url: string }> };
    expect(searchJson.hits?.some((hit) => hit.kind === 'faq' && hit.title.includes(token))).toBe(true);
  } finally {
    if (pageId) {
      await deletePublishedPage(page.request, pageId, token);
    }
    for (const faqId of createdFaqIds) {
      await deleteFaq(page.request, faqId, token);
    }
    await uninstallFaqApp(page.request, token);
  }
});

import { expect, test } from '@playwright/test';
import { openBuilder, openCatalogDrawer } from './helpers/editor';

test.describe('/ko/admin-builder section design templates', () => {
  test('lets users click a section chip before applying a design template', async ({ page }) => {
    await openBuilder(page, `/ko/admin-builder?sectionTemplateClick=${Date.now().toString(36)}`);
    await page.keyboard.press('Escape');

    await page.getByRole('button', { name: 'Design', exact: true }).click();
    const designDrawer = page.locator('aside[aria-hidden="false"]').filter({ hasText: 'Section design' }).first();
    await expect(designDrawer).toBeVisible();
    await designDrawer.getByRole('button', { name: '주요 서비스' }).click();
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
    await catalogDrawer.getByRole('searchbox', { name: 'Search add elements' }).fill('법률');
    await expect(catalogDrawer.locator('[data-builder-open-page-template-market="true"]')).toBeVisible();
    const pageTemplateResults = catalogDrawer.locator('[data-builder-page-template-search-results="true"]');
    await expect(pageTemplateResults).toBeVisible();
    await expect(pageTemplateResults.locator('[data-builder-page-template-result-count="true"]')).toContainText('/261 page templates');
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
});

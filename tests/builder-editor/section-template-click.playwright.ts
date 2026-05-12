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
    await page.locator('[data-node-id="home-services-description"]').first().click({ position: { x: 12, y: 12 } });
    await expect(page.locator('[data-node-id="home-services-card-1-detail-0"]').first()).toBeVisible();
    await page.locator('[data-node-id="home-hero-title"]').first().click({ position: { x: 12, y: 12 } });
    await expect(page.locator('[data-node-id="home-services-card-1-detail-0"]').first()).toBeVisible();
  });

  test('keeps inserted service template text visible while selecting nested nodes', async ({ page }) => {
    await openBuilder(page, `/ko/admin-builder?builtInServiceTemplate=${Date.now().toString(36)}`);
    await page.keyboard.press('Escape');

    const catalogDrawer = await openCatalogDrawer(page);
    await expect(catalogDrawer.getByText('Section templates')).toBeVisible();
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
});

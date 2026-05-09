import { expect, test } from '@playwright/test';
import { openBuilder } from './helpers/editor';

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

    await page.locator('[data-node-id="home-services-list"]').first().click({ position: { x: 8, y: 8 }, force: true });
    await expect(page.locator('[data-node-id="home-services-card-0-detail-0"]').first()).toBeVisible();
    await expect(servicesRoot).toContainText('투자·법인설립');

    await page.locator('[data-node-id="home-services-card-1-title"]').first().click({ position: { x: 12, y: 12 }, force: true });
    await expect(page.locator('[data-node-id="home-services-card-1-detail-0"]').first()).toBeVisible();
    await page.locator('[data-node-id="home-services-description"]').first().click({ position: { x: 12, y: 12 }, force: true });
    await expect(page.locator('[data-node-id="home-services-card-1-detail-0"]').first()).toBeVisible();
    await page.locator('[data-node-id="home-hero-title"]').first().click({ position: { x: 12, y: 12 }, force: true });
    await expect(page.locator('[data-node-id="home-services-card-1-detail-0"]').first()).toBeVisible();
  });
});

import { expect, test } from '@playwright/test';

test.describe('/ko/admin-builder public chrome click safety', () => {
  test('keeps header locale links and footer links inside the editor shell', async ({ page }) => {
    await page.goto('/ko/admin-builder', { waitUntil: 'domcontentloaded' });
    const editorUrl = page.url();
    const canvas = page.getByRole('application', { name: 'Canvas editor' });
    await expect(canvas).toBeVisible();

    const header = page.locator('.builder-site-header').first();
    await expect(header).toBeVisible();
    await header.locator('.utility-lang').getByRole('link', { name: 'EN' }).click();
    await expect.poll(() => page.url()).toBe(editorUrl);
    await expect(canvas).toBeVisible();

    const siteFooter = page.locator('footer:not([aria-label="Editor status"])').first();
    await expect(siteFooter).toBeVisible();
    await siteFooter.scrollIntoViewIfNeeded();
    const footerLink = siteFooter.locator('a[href^="/ko/"]').first();
    await expect(footerLink).toBeVisible();
    await footerLink.click({ force: true });
    await expect.poll(() => page.url()).toBe(editorUrl);
    await expect(canvas).toBeVisible();
    await expect(page.locator('aside[aria-hidden="false"]').filter({ hasText: 'Navigation' }).first()).toBeVisible();
  });
});

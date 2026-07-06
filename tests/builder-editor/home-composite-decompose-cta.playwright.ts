import { expect, test } from '@playwright/test';

test('/ko/admin-builder lets a selected home composite switch into element editing', async ({ page }) => {
  test.setTimeout(90_000);
  const token = Date.now().toString(36);

  await page.goto(`/ko/admin-builder?reseed=1&compositeDecomposeCta=${token}`, { waitUntil: 'domcontentloaded' });
  await expect(page.locator('[data-editor-shell]').first()).toHaveAttribute('data-editor-ready', 'true');

  const heroComposite = page.locator('[data-node-id="home-hero"]').first();
  await expect(heroComposite).toBeVisible();
  await expect(page.locator('[data-node-id="home-hero-root"]')).toHaveCount(0);

  await heroComposite.click({ position: { x: 96, y: 96 }, force: true });
  const cta = page.locator('[data-builder-composite-decompose-cta="true"]').first();
  await expect(cta).toBeVisible();
  await cta.locator('[data-builder-decompose-current-page="true"]').click();

  await expect(page.locator('[data-node-id="home-hero-root"]').first()).toBeVisible({ timeout: 30_000 });
  const heroTitle = page.locator('[data-node-id="home-hero-title"]').first();
  await expect(heroTitle).toBeVisible();
  await expect(cta).toBeHidden();

  await heroTitle.click({ position: { x: 24, y: 24 }, force: true });
  await expect(page.locator('[data-builder-inspector-panel="true"]').first()).toContainText(/제목|heading|텍스트/i);
});

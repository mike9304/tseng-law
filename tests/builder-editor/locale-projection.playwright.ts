import { expect, test } from '@playwright/test';
import { openBuilder } from './helpers/editor';

test.describe('/admin-builder locale projection', () => {
  test('does not let a Traditional Chinese editor view contaminate the Korean home draft', async ({ page }) => {
    test.setTimeout(90_000);

    await openBuilder(page, `/zh-hant/admin-builder?localeProjection=${Date.now().toString(36)}`);
    const zhHeroTitle = page
      .getByRole('application', { name: 'Canvas editor' })
      .locator('[data-node-id="home-hero-title"]:visible')
      .first();
    await expect(zhHeroTitle).toContainText('以韓語清楚說明台灣法律。');

    await openBuilder(page, `/ko/admin-builder?localeProjection=${Date.now().toString(36)}`);
    const koHeroTitle = page
      .getByRole('application', { name: 'Canvas editor' })
      .locator('[data-node-id="home-hero-title"]:visible')
      .first();
    await expect(koHeroTitle).toContainText('대만 법률을 한국어로 명확하게.');
    await expect(koHeroTitle).not.toContainText('以韓語清楚說明台灣法律。');
  });
});

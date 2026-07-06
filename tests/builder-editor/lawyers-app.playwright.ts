import { expect, test } from '@playwright/test';

test('localizes public lawyer profile shell labels for ko and zh-hant', async ({ page }) => {
  await page.goto('/ko/lawyers/wei-tseng', { waitUntil: 'domcontentloaded' });
  await expect(page.locator('section.page-header [data-builder-surface-key="section-label"]')).toContainText('변호사 프로필');
  await expect(page.locator('.profile-hero-cta')).toContainText('상담 문의');
  await expect(
    page.locator('.profile-info-card').filter({ hasText: '관련 서비스 및 콘텐츠' })
  ).toContainText('관련 서비스 및 콘텐츠');
  await expect(
    page.locator('.profile-info-card').filter({ hasText: '외부 프로필 및 채널' })
  ).toContainText('외부 프로필 및 채널');

  await page.goto('/zh-hant/lawyers/wei-tseng', { waitUntil: 'domcontentloaded' });
  await expect(page.locator('section.page-header [data-builder-surface-key="section-label"]')).toContainText('律師簡介');
  await expect(page.locator('.profile-hero-cta')).toContainText('聯絡諮詢');
  await expect(
    page.locator('.profile-info-card').filter({ hasText: '相關服務與內容' })
  ).toContainText('相關服務與內容');
  await expect(
    page.locator('.profile-info-card').filter({ hasText: '外部簡介與頻道' })
  ).toContainText('外部簡介與頻道');
});

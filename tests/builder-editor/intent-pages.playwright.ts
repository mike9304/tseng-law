import { expect, test } from '@playwright/test';

test('localizes public intent landing page shell labels for ko and zh-hant', async ({ page }) => {
  await page.goto('/ko/taiwan-lawyer', { waitUntil: 'domcontentloaded' });
  await expect(page.locator('section.page-header [data-builder-surface-key="section-label"]')).toContainText('검색 가이드');
  await expect(page.locator('.authority-card-eyebrow')).toContainText('담당 변호사');
  await expect(page.locator('.section-label').filter({ hasText: '진행 절차' })).toContainText('진행 절차');
  await expect(page.locator('.section-label').filter({ hasText: '관련 서비스' })).toContainText('관련 서비스');
  await expect(page.locator('.section-label').filter({ hasText: '관련 칼럼' })).toContainText('관련 칼럼');
  await expect(page.locator('.section-label').filter({ hasText: '다음 단계' })).toContainText('다음 단계');
  await expect(page.locator('.authority-card-actions .button').filter({ hasText: '상담 문의' })).toContainText('상담 문의');

  await page.goto('/zh-hant/taiwan-lawyer', { waitUntil: 'domcontentloaded' });
  await expect(page.locator('section.page-header [data-builder-surface-key="section-label"]')).toContainText('搜尋指南');
  await expect(page.locator('.authority-card-eyebrow')).toContainText('承辦律師');
  await expect(page.locator('.section-label').filter({ hasText: '流程' })).toContainText('流程');
  await expect(page.locator('.section-label').filter({ hasText: '相關服務' })).toContainText('相關服務');
  await expect(page.locator('.section-label').filter({ hasText: '相關專欄' })).toContainText('相關專欄');
  await expect(page.locator('.section-label').filter({ hasText: '下一步' })).toContainText('下一步');
  await expect(page.locator('.authority-card-actions .button').filter({ hasText: '聯絡諮詢' })).toContainText('聯絡諮詢');
});

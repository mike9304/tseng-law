import { expect, test } from '@playwright/test';

test.describe('/admin-builder/errors localization', () => {
  test('renders localized error monitoring shell in ko and zh-hant', async ({ page }) => {
    test.setTimeout(60_000);

    await page.goto('/ko/admin-builder/errors', { waitUntil: 'domcontentloaded' });
    await expect(page).toHaveTitle(/오류 모니터링/);
    await expect(page.getByRole('heading', { name: '오류 모니터링' })).toBeVisible();
    await expect(page.getByText('captureBuilderError()로 수집된 에러 로그. SENTRY_DSN 설정 시 자동 전송.')).toBeVisible();
    await expect(page.getByRole('button', { name: '새로고침' })).toBeVisible();
    await expect(page.getByRole('columnheader', { name: '시각' })).toBeVisible();
    await expect(page.getByRole('columnheader', { name: '출처' })).toBeVisible();
    await expect(page.getByRole('columnheader', { name: '심각도' })).toBeVisible();
    await expect(page.getByRole('columnheader', { name: '메시지' })).toBeVisible();
    await expect(page.getByRole('columnheader', { name: '태그' })).toBeVisible();
    await expect(page.getByRole('columnheader', { name: 'Sentry' })).toBeVisible();

    await page.goto('/zh-hant/admin-builder/errors', { waitUntil: 'domcontentloaded' });
    await expect(page).toHaveTitle(/錯誤監控/);
    await expect(page.getByRole('heading', { name: '錯誤監控' })).toBeVisible();
    await expect(page.getByText('由 captureBuilderError() 收集的錯誤記錄。設定 SENTRY_DSN 時會自動轉送。')).toBeVisible();
    await expect(page.getByRole('button', { name: '重新整理' })).toBeVisible();
    await expect(page.getByRole('columnheader', { name: '時間' })).toBeVisible();
    await expect(page.getByRole('columnheader', { name: '來源' })).toBeVisible();
    await expect(page.getByRole('columnheader', { name: '嚴重程度' })).toBeVisible();
    await expect(page.getByRole('columnheader', { name: '訊息' })).toBeVisible();
    await expect(page.getByRole('columnheader', { name: '標籤' })).toBeVisible();
    await expect(page.getByRole('columnheader', { name: 'Sentry' })).toBeVisible();
  });
});

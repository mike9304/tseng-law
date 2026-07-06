import { expect, test } from '@playwright/test';

test.describe('/admin-builder/experiments localization', () => {
  test('renders localized experiments admin shell in ko and zh-hant', async ({ page }) => {
    test.setTimeout(60_000);

    await page.goto('/ko/admin-builder/experiments', { waitUntil: 'domcontentloaded' });
    await expect(page).toHaveTitle(/실험 관리자/);
    await expect(page.getByRole('heading', { name: '실험' })).toBeVisible();
    await expect(page.getByText('페이지 단위 variant + sessionId hash 기반 sticky 할당. 전환은 /api/experiments/event로 보고. z-test 유의성 자동 계산.')).toBeVisible();
    await expect(page.getByRole('button', { name: '+ 새 실험' })).toBeVisible();
    await expect(page.getByText('실험이 없습니다.')).toBeVisible();
    await page.getByRole('button', { name: '+ 새 실험' }).click();
    await expect(page.getByPlaceholder('실험 이름')).toBeVisible();
    await expect(page.getByPlaceholder('대상 경로 (예: /ko/services, 비우면 site-wide)')).toBeVisible();
    await expect(page.getByPlaceholder('goal event (예: cta-click)')).toBeVisible();

    await page.goto('/zh-hant/admin-builder/experiments', { waitUntil: 'domcontentloaded' });
    await expect(page).toHaveTitle(/實驗管理員/);
    await expect(page.getByRole('heading', { name: '實驗' })).toBeVisible();
    await expect(page.getByText('按頁面 variant + sessionId hash 的 sticky 分配。轉換回報至 /api/experiments/event，並自動計算 z-test 顯著性。')).toBeVisible();
    await expect(page.getByRole('button', { name: '+ 新增實驗' })).toBeVisible();
    await expect(page.getByText('沒有實驗。')).toBeVisible();
    await page.getByRole('button', { name: '+ 新增實驗' }).click();
    await expect(page.getByPlaceholder('實驗名稱')).toBeVisible();
    await expect(page.getByPlaceholder('目標路徑（例如：/ko/services；留空則為 site-wide）')).toBeVisible();
    await expect(page.getByPlaceholder('目標事件（例如：cta-click）')).toBeVisible();
  });
});

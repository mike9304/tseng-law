import { expect, test } from '@playwright/test';

for (const locale of ['ko', 'zh-hant'] as const) {
  test(`/${locale}/admin-builder/marketing localizes the campaigns shell`, async ({ page }) => {
    const text = locale === 'ko'
      ? {
          create: '+ 새 캠페인',
          name: '캠페인 이름',
          subject: '제목',
          body: '본문 HTML (한국어 기준; 다국어는 편집 페이지에서 보강)',
          cancel: '취소',
          save: '저장 (draft)',
        }
      : {
          create: '+ 新活動',
          name: '活動名稱',
          subject: '主旨',
          body: 'HTML 內文（以韓文為主；多語請在編輯頁補強）',
          cancel: '取消',
          save: '儲存 (draft)',
        };

    await page.goto(`/${locale}/admin-builder/marketing`, { waitUntil: 'commit' });
    await expect.poll(async () => page.title()).toContain(locale === 'ko' ? '이메일 마케팅' : '電子郵件行銷');
    await expect(page.locator('main nav strong').first()).toHaveText(locale === 'ko' ? '마케팅' : '行銷');
    await expect(page.locator('main nav a').first()).toHaveText(locale === 'ko' ? '캠페인' : '活動');
    await expect(page.locator('main nav a').nth(1)).toHaveText(locale === 'ko' ? '구독자' : '訂閱者');
    await page.getByRole('button', { name: text.create }).click();
    await expect(page.getByPlaceholder(text.name)).toBeVisible();
    await expect(page.getByPlaceholder(text.subject)).toBeVisible();
    await expect(page.getByPlaceholder(text.body)).toBeVisible();
    await expect(page.getByRole('button', { name: text.cancel })).toBeVisible();
    await expect(page.getByRole('button', { name: text.save })).toBeVisible();
  });

  test(`/${locale}/admin-builder/marketing/subscribers localizes the subscribers shell`, async ({ page }) => {
    const text = locale === 'ko'
      ? {
          search: '이메일 검색',
          status: '전체 상태',
          refresh: '조회',
          add: '+ 구독자 추가',
          email: 'email@example.com',
          tags: '태그 (쉼표 구분)',
          save: '저장',
        }
      : {
          search: '搜尋電子郵件',
          status: '全部狀態',
          refresh: '查詢',
          add: '+ 新增訂閱者',
          email: 'email@example.com',
          tags: '標籤（以逗號分隔）',
          save: '儲存',
        };

    await page.goto(`/${locale}/admin-builder/marketing/subscribers`, { waitUntil: 'commit' });
    await expect.poll(async () => page.title()).toContain(locale === 'ko' ? '이메일 구독자' : '電子郵件訂閱者');
    await expect(page.locator('main nav strong').first()).toHaveText(locale === 'ko' ? '마케팅' : '行銷');
    await expect(page.locator('main nav a').first()).toHaveText(locale === 'ko' ? '캠페인' : '活動');
    await expect(page.locator('main nav a').nth(1)).toHaveText(locale === 'ko' ? '구독자' : '訂閱者');
    await expect(page.getByPlaceholder(text.search)).toBeVisible();
    await expect(page.getByRole('combobox')).toHaveValue('');
    await expect(page.getByRole('button', { name: text.refresh })).toBeVisible();
    await page.getByRole('button', { name: text.add }).click();
    await expect(page.getByPlaceholder(text.email)).toBeVisible();
    await expect(page.getByPlaceholder(text.tags)).toBeVisible();
    await expect(page.getByRole('button', { name: text.save })).toBeVisible();
  });
}

import { expect, test } from '@playwright/test';

const locales = [
  {
    locale: 'ko',
    dashboardTitle: '폼 제출',
    dashboardOpenBuilder: '폼 빌더 열기',
    dashboardRefresh: '새로고침',
    dashboardSearch: '이름, 이메일, 메시지 검색...',
    dashboardNoSubmissions: '아직 제출이 없습니다.',
    submissionsTitle: '폼 제출',
    submissionsExport: 'CSV 내보내기',
    submissionsSearch: '제출 검색',
    submissionsForms: '폼 목록',
    submissionsStatus: '상태',
    submissionsDate: '날짜',
    submissionsName: '이름',
    submissionsEmail: '이메일',
    submissionsSummary: '요약',
    builderTitle: '폼 빌더',
    builderBody: '드래그앤드롭으로 필드를 재정렬하고, step 분할 + 조건부 로직을 적용하세요.',
  },
  {
    locale: 'zh-hant',
    dashboardTitle: '表單提交',
    dashboardOpenBuilder: '開啟表單編輯器',
    dashboardRefresh: '重新整理',
    dashboardSearch: '搜尋姓名、電子郵件、訊息...',
    dashboardNoSubmissions: '目前尚無提交。',
    submissionsTitle: '表單提交',
    submissionsExport: '匯出 CSV',
    submissionsSearch: '搜尋提交',
    submissionsForms: '表單列表',
    submissionsStatus: '狀態',
    submissionsDate: '日期',
    submissionsName: '姓名',
    submissionsEmail: '電子郵件',
    submissionsSummary: '摘要',
    builderTitle: '表單編輯器',
    builderBody: '使用拖放重新排列欄位，並套用 step 分割與條件式邏輯。',
  },
] as const;

function titlePattern(expected: string): RegExp {
  return new RegExp(`.*${expected.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}.*`);
}

for (const copy of locales) {
  test(`localizes the forms admin shell for ${copy.locale}`, async ({ page }) => {
    const formId = `pw-forms-${copy.locale}-${Date.now().toString(36)}`;

    await page.goto(`/${copy.locale}/admin-builder/forms?formId=${formId}`, { waitUntil: 'domcontentloaded' });
    await expect(page).toHaveTitle(titlePattern(copy.dashboardTitle));
    await expect(page.getByRole('heading', { name: copy.dashboardTitle })).toBeVisible();
    await expect(page.getByRole('link', { name: copy.dashboardOpenBuilder })).toBeVisible();
    await expect(page.getByRole('link', { name: copy.dashboardOpenBuilder })).toHaveAttribute(
      'href',
      `/${copy.locale}/admin-builder/forms/builder/${formId}`,
    );
    await expect(page.getByRole('button', { name: copy.dashboardRefresh })).toBeVisible();
    await expect(page.getByPlaceholder(copy.dashboardSearch)).toBeVisible();
    await expect(page.getByText(copy.dashboardNoSubmissions)).toBeVisible();

    await page.goto(`/${copy.locale}/admin-builder/forms/submissions?formId=${formId}`, {
      waitUntil: 'domcontentloaded',
    });
    await expect(page).toHaveTitle(titlePattern(copy.submissionsTitle));
    await expect(page.getByRole('heading', { name: copy.submissionsTitle })).toBeVisible();
    await expect(page.getByRole('button', { name: copy.submissionsExport })).toBeVisible();
    await expect(page.getByPlaceholder(copy.submissionsSearch)).toBeVisible();
    await expect(page.getByText(copy.submissionsForms)).toBeVisible();
    await expect(page.getByRole('columnheader', { name: copy.submissionsStatus })).toBeVisible();
    await expect(page.getByRole('columnheader', { name: copy.submissionsDate })).toBeVisible();
    await expect(page.getByRole('columnheader', { name: copy.submissionsName })).toBeVisible();
    await expect(page.getByRole('columnheader', { name: copy.submissionsEmail })).toBeVisible();
    await expect(page.getByRole('columnheader', { name: copy.submissionsSummary })).toBeVisible();

    await page.goto(`/${copy.locale}/admin-builder/forms/builder/default-contact`, {
      waitUntil: 'domcontentloaded',
    });
    await expect(page).toHaveTitle(titlePattern(copy.builderTitle));
    await expect(page.getByRole('heading', { name: copy.builderTitle })).toBeVisible();
    await expect(page.getByText(copy.builderBody)).toBeVisible();
    await expect(page.locator('[data-form-schema-editor="default-contact"]')).toBeVisible();
  });
}

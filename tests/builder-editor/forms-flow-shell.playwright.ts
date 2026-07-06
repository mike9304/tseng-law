import { expect, test } from '@playwright/test';

const authHeader = `Basic ${Buffer.from(
  `${process.env.BUILDER_SMOKE_USERNAME ?? process.env.CMS_ADMIN_USERNAME ?? 'admin'}:${process.env.BUILDER_SMOKE_PASSWORD ?? process.env.CMS_ADMIN_PASSWORD ?? 'local-review-2026!'}`,
).toString('base64')}`;

const LOCALES = [
  {
    locale: 'ko',
    title: '폼 흐름',
    heading: '폼 흐름',
    body: '드래그 앤 드롭으로 필드를 재정렬하고 단계 분할과 조건부 로직을 적용합니다.',
    emptyState: '초안 페이지에서 폼 노드를 찾지 못했습니다.',
  },
  {
    locale: 'zh-hant',
    title: '表單流程',
    heading: '表單流程',
    body: '拖放重新排列欄位，並套用步驟分割與條件式邏輯。',
    emptyState: '在草稿頁面中找不到表單節點。',
  },
] as const;

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

for (const copy of LOCALES) {
  test(`/${copy.locale}/admin-builder/forms-flow localizes its shell`, async ({ page }) => {
    test.setTimeout(120_000);
    await page.setExtraHTTPHeaders({ Authorization: authHeader });
    await page.goto(`/${copy.locale}/admin-builder/forms-flow`, {
      waitUntil: 'commit',
      timeout: 120_000,
    });

    await expect(page).toHaveTitle(new RegExp(`^${escapeRegExp(copy.title)} \\| 법무법인 호정$`));
    await expect(page.getByRole('heading', { name: copy.heading, exact: true })).toBeVisible();
    await expect(page.getByText(copy.body, { exact: true })).toBeVisible();
    await expect(page.getByText(copy.emptyState, { exact: true })).toBeVisible();
  });
}

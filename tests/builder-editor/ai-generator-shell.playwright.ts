import { expect, test } from '@playwright/test';

const authHeader = `Basic ${Buffer.from(
  `${process.env.BUILDER_SMOKE_USERNAME ?? process.env.CMS_ADMIN_USERNAME ?? 'admin'}:${process.env.BUILDER_SMOKE_PASSWORD ?? process.env.CMS_ADMIN_PASSWORD ?? 'local-review-2026!'}`,
).toString('base64')}`;

const LOCALES = [
  { locale: 'ko', title: 'AI 사이트 생성기', heading: 'AI 사이트 생성기', badge: 'F85/F86 첫 번째 단계' },
  { locale: 'zh-hant', title: 'AI 網站生成器', heading: 'AI 網站生成器', badge: 'F85/F86 第一階段' },
] as const;

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

for (const copy of LOCALES) {
  test(`/${copy.locale}/admin-builder/ai-generator localizes its shell`, async ({ page }) => {
    await page.setExtraHTTPHeaders({ Authorization: authHeader });
    await page.goto(`/${copy.locale}/admin-builder/ai-generator`, { waitUntil: 'domcontentloaded' });

    await expect(page).toHaveTitle(new RegExp(`^${escapeRegExp(copy.title)} \\| 법무법인 호정$`));
    await expect(page.getByRole('heading', { name: copy.heading, exact: true })).toBeVisible();
    await expect(page.locator('[data-ai-generator-shell-badge]')).toContainText(copy.badge);
    await expect(page.locator('[data-ai-generator]')).toBeVisible();
  });
}

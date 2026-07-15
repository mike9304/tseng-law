import { expect, test, type Page } from '@playwright/test';

function mutationHeaders(scope: string): Record<string, string> {
  const safeScope = scope.replace(/[^a-z0-9-]/gi, '-').slice(-48) || 'crm-shell';
  const username = process.env.BUILDER_SMOKE_USERNAME ?? process.env.CMS_ADMIN_USERNAME ?? 'admin';
  const password = process.env.BUILDER_SMOKE_PASSWORD ?? process.env.CMS_ADMIN_PASSWORD ?? 'local-review-2026!';
  return {
    'x-forwarded-for': `pw-${safeScope}`,
    authorization: `Basic ${Buffer.from(`${username}:${password}`).toString('base64')}`,
  };
}

async function assertCrmShell(page: Page, locale: 'ko' | 'zh-hant') {
  const copy = locale === 'ko'
    ? {
        heading: 'CRM',
        summary: '연락처, 자동화, 외부 연동, 개발용 이메일 시뮬레이션을 관리합니다.',
        tablist: 'CRM 탭',
        contacts: '연락처',
        automations: '자동화',
        integrations: '외부 연동',
        outbox: '이메일 시뮬레이션',
      }
    : {
        heading: 'CRM',
        summary: '管理聯絡人、自動化、外部整合與開發用 Email 模擬。',
        tablist: 'CRM 分頁',
        contacts: '聯絡人',
        automations: '自動化',
        integrations: '外部整合',
        outbox: 'Email 模擬',
      };

  await page.goto(`/${locale}/admin-builder/crm`, { waitUntil: 'domcontentloaded' });
  await expect(page.getByTestId('crm-admin')).toBeVisible();
  await expect(page.getByRole('heading', { name: copy.heading })).toBeVisible();
  await expect(page.locator('header')).toContainText(copy.summary);
  await expect(page.getByRole('tablist', { name: copy.tablist })).toBeVisible();
  await expect(page.getByTestId('crm-tab-contacts')).toContainText(copy.contacts);
  await expect(page.getByTestId('crm-tab-automations')).toContainText(copy.automations);
  await expect(page.getByTestId('crm-tab-integrations')).toContainText(copy.integrations);
  await expect(page.getByTestId('crm-tab-outbox')).toContainText(copy.outbox);
}

test.describe('CRM shell localization', () => {
  test.setTimeout(120_000);

  test('/ko/admin-builder/crm localizes shell labels', async ({ page }) => {
    await page.setExtraHTTPHeaders(mutationHeaders('crm-shell-ko'));
    await assertCrmShell(page, 'ko');
  });

  test('/zh-hant/admin-builder/crm localizes shell labels', async ({ page }) => {
    await page.setExtraHTTPHeaders(mutationHeaders('crm-shell-zh'));
    await assertCrmShell(page, 'zh-hant');
  });
});

import { expect, test } from '@playwright/test';

const copy = {
  ko: {
    title: /커머스 알림 · Hojeong Builder/,
    heading: '커머스 알림',
    subtitle: '주문, 결제, 장바구니 복구 알림을 한곳에서 관리합니다.',
    nav: ['제품', '주문', '통화', '배송', '웹훅'],
    stats: '알림 통계',
    settings: '알림 설정',
    templates: '알림 템플릿',
    outbox: '발송함',
    recoveries: '복구된 장바구니',
    save: '저장',
    refresh: '새로고침',
    enabled: '사용',
    sender: '발신자',
    adminEmail: '관리자 이메일',
    recoveryDelay: '복구 지연',
    paymentRules: '결제 규칙',
    paymentReceivedEnabled: '결제 완료 이메일 발송',
  },
  'zh-hant': {
    title: /商務通知 · Hojeong Builder/,
    heading: '商務通知',
    subtitle: '在同一處管理訂單、付款與購物車挽回通知。',
    nav: ['產品', '訂單', '幣別', '運送', 'Webhook'],
    stats: '通知統計',
    settings: '通知設定',
    templates: '通知範本',
    outbox: '寄送佇列',
    recoveries: '挽回購物車',
    save: '儲存',
    refresh: '重新整理',
    enabled: '啟用',
    sender: '寄件者',
    adminEmail: '管理員電子郵件',
    recoveryDelay: '挽回延遲',
    paymentRules: '付款規則',
    paymentReceivedEnabled: '寄送付款完成郵件',
  },
} as const;

async function expectNotificationsShell(page: import('@playwright/test').Page, locale: 'ko' | 'zh-hant') {
  const t = copy[locale];
  await page.goto(`/${locale}/admin-builder/commerce/notifications`, { waitUntil: 'domcontentloaded' });
  await expect(page).toHaveTitle(t.title);
  await expect(page.locator('[data-commerce-notifications-admin]')).toBeVisible({ timeout: 30_000 });
  await expect(page.getByRole('heading', { name: t.heading })).toBeVisible();
  await expect(page.getByText(t.subtitle, { exact: true })).toBeVisible();
  const headerActions = page.locator('[data-commerce-notifications-header-actions]');
  for (const label of t.nav) {
    await expect(headerActions.getByRole('link', { name: label })).toBeVisible();
  }
  await expect(page.locator('[aria-label="' + t.stats + '"]')).toBeVisible();
  await expect(page.locator('[aria-label="' + t.settings + '"]')).toBeVisible();
  await expect(page.locator('[aria-label="' + t.templates + '"]')).toBeVisible();
  await expect(page.getByRole('heading', { name: t.outbox })).toBeVisible();
  await expect(page.getByRole('heading', { name: t.recoveries })).toBeVisible();
  await expect(page.getByRole('button', { name: t.save })).toBeVisible();
  await expect(page.getByRole('button', { name: t.refresh })).toBeVisible();
  await expect(page.getByLabel(t.enabled)).toBeVisible();
  await expect(page.getByLabel(t.sender)).toBeVisible();
  await expect(page.getByLabel(t.adminEmail)).toBeVisible();
  await expect(page.getByLabel(t.recoveryDelay)).toBeVisible();
  await expect(page.locator('summary')).toContainText(t.paymentRules);
  await expect(page.locator('[data-commerce-notifications-payment-rules]')).toContainText(t.paymentReceivedEnabled);
}

test.describe('/admin-builder/commerce/notifications localization', () => {
  test('renders localized commerce notifications shell in ko and zh-hant', async ({ page }) => {
    test.setTimeout(60_000);
    await expectNotificationsShell(page, 'ko');
    await expectNotificationsShell(page, 'zh-hant');
  });
});

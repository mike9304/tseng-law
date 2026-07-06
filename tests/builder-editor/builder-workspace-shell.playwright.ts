import { expect, test, type Page } from '@playwright/test';

const workspaceCopy = {
  ko: {
    title: /작업 공간 · Hojeong Builder/,
    eyebrow: '작업 공간',
    ownerLabel: '소유자',
    accountIdLabel: '계정 ID',
    sectionsLabel: '작업 공간 섹션',
    tabs: ['개요', '사이트', '구성원', '공유 에셋', '분석'],
    overview: ['사이트', '구성원', '공유 에셋', 'CMS 컬렉션', '주문', '예약', '총 수금액', '미수금', '계정'],
    overviewMeta: { createdPrefix: '생성', updatedPrefix: '업데이트' },
    sites: {
      siteIdLabel: '사이트 ID',
      siteNameLabel: '표시 이름',
      register: '사이트 등록',
    },
    members: {
      emailLabel: '구성원 이메일',
      roleLabel: '구성원 역할',
      invite: '구성원 초대',
    },
    assets: {
      upload: '공유 에셋 업로드',
      hint: 'JPG / PNG / WEBP / GIF / AVIF / SVG, 최대 10MB.',
    },
    analytics: {
      unavailable: '분석 집계는 현재 사용할 수 없습니다.',
      perSiteBreakdown: '사이트별 요약',
      cmsCollections: 'CMS 컬렉션 (읽기 전용)',
    },
  },
  'zh-hant': {
    title: /工作區 · Hojeong Builder/,
    eyebrow: '工作區',
    ownerLabel: '擁有者',
    accountIdLabel: '帳號 ID',
    sectionsLabel: '工作區區段',
    tabs: ['概覽', '網站', '成員', '共用素材', '分析'],
    overview: ['網站', '成員', '共用素材', 'CMS 清單', '訂單', '預約', '總收款', '未收款', '帳號'],
    overviewMeta: { createdPrefix: '建立', updatedPrefix: '更新' },
    sites: {
      siteIdLabel: '網站 ID',
      siteNameLabel: '顯示名稱',
      register: '註冊網站',
    },
    members: {
      emailLabel: '成員電子郵件',
      roleLabel: '成員角色',
      invite: '邀請成員',
    },
    assets: {
      upload: '上傳共用素材',
      hint: 'JPG / PNG / WEBP / GIF / AVIF / SVG，最多 10MB。',
    },
    analytics: {
      unavailable: '分析彙總目前無法使用。',
      perSiteBreakdown: '各站點摘要',
      cmsCollections: 'CMS 清單（唯讀）',
    },
  },
} as const;

async function expectWorkspaceShell(page: Page, locale: 'ko' | 'zh-hant') {
  const copy = workspaceCopy[locale];
  await page.goto(`/${locale}/admin-builder/workspace`, { waitUntil: 'domcontentloaded' });
  await expect(page).toHaveTitle(copy.title);
  const root = page.locator('[data-workspace-page]');
  const header = root.locator('header').first();
  await expect(root).toBeVisible({ timeout: 30_000 });
  await expect(header.getByText(copy.eyebrow, { exact: true })).toBeVisible();
  await expect(header.getByText(new RegExp(`${copy.ownerLabel} .*${copy.accountIdLabel}`))).toBeVisible();
  await expect(page.locator('[data-workspace-tabs]')).toHaveAttribute('aria-label', copy.sectionsLabel);
  for (const tabLabel of copy.tabs) {
    await expect(page.getByRole('link', { name: tabLabel })).toBeVisible();
  }

  const overview = page.locator('[data-workspace-overview]');
  await expect(overview).toBeVisible();
  for (const label of copy.overview) {
    await expect(overview.getByText(label, { exact: true })).toBeVisible();
  }
  await expect(
    overview.getByText(new RegExp(`${copy.overviewMeta.createdPrefix} .*${copy.overviewMeta.updatedPrefix}`)),
  ).toBeVisible();

  await page.getByRole('link', { name: copy.tabs[1] }).click();
  await expect(page.locator('[data-sites-panel]')).toBeVisible();
  await expect(page.getByLabel(copy.sites.siteIdLabel)).toBeVisible();
  await expect(page.getByLabel(copy.sites.siteNameLabel)).toBeVisible();
  await expect(page.getByRole('button', { name: copy.sites.register })).toBeVisible();

  await page.getByRole('link', { name: copy.tabs[2] }).click();
  await expect(page.locator('[data-members-panel]')).toBeVisible();
  await expect(page.getByLabel(copy.members.emailLabel)).toBeVisible();
  await expect(page.locator('[data-member-role-select]').first()).toHaveAttribute(
    'aria-label',
    new RegExp(`^${copy.members.roleLabel} `),
  );
  await expect(page.getByRole('button', { name: copy.members.invite })).toBeVisible();

  await page.getByRole('link', { name: copy.tabs[3] }).click();
  await expect(page.locator('[data-shared-assets-panel]')).toBeVisible();
  await expect(page.getByLabel(copy.assets.upload)).toBeVisible();
  await expect(page.getByText(copy.assets.hint, { exact: true })).toBeVisible();

  await page.getByRole('link', { name: copy.tabs[4] }).click();
  const analyticsEmpty = page.locator('[data-analytics-empty]');
  if (await analyticsEmpty.isVisible()) {
    await expect(analyticsEmpty).toContainText(copy.analytics.unavailable);
  } else {
    await expect(page.locator('[data-analytics-panel]')).toBeVisible();
    await expect(page.getByText(copy.analytics.perSiteBreakdown, { exact: true })).toBeVisible();
    await expect(page.getByText(copy.analytics.cmsCollections, { exact: true })).toBeVisible();
  }
}

test.describe('/admin-builder/workspace localization', () => {
  test('renders localized workspace shell and overview in ko and zh-hant', async ({ page }) => {
    test.setTimeout(60_000);

    await expectWorkspaceShell(page, 'ko');
    await expectWorkspaceShell(page, 'zh-hant');
  });
});

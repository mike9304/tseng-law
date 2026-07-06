import { expect, test, type Page } from '@playwright/test';

function mutationHeaders(scope: string): Record<string, string> {
  const safeScope = scope.replace(/[^a-z0-9-]/gi, '-').slice(-48) || 'users-shell';
  const username = process.env.BUILDER_SMOKE_USERNAME ?? process.env.CMS_ADMIN_USERNAME ?? 'admin';
  const password = process.env.BUILDER_SMOKE_PASSWORD ?? process.env.CMS_ADMIN_PASSWORD ?? 'local-review-2026!';
  return {
    'x-forwarded-for': `pw-${safeScope}`,
    authorization: `Basic ${Buffer.from(`${username}:${password}`).toString('base64')}`,
  };
}

async function assertUsersShell(page: Page, locale: 'ko' | 'zh-hant') {
  const copy = locale === 'ko'
    ? {
        title: '사용자 및 역할',
        description: '빌더 작업공간의 사용자별 RBAC를 관리합니다.',
        eyebrow: '사용자 관리',
        roleIntro: '기본 인증 위에 사용자별 RBAC를 겹쳐서 적용합니다. 현재 역할:',
        addTitle: '사용자 추가',
        username: '사용자명',
        role: '역할',
        add: '추가',
        members: '사용자',
        permissionMatrix: '권한 매트릭스',
        permission: '권한',
        owner: '소유자',
        admin: '관리자',
        designer: '디자이너',
        editor: '편집자',
        client: '클라이언트',
        publicAccount: '공개 계정 페이지 열기',
      }
    : {
        title: '使用者與角色',
        description: '管理建構器工作區的每位使用者 RBAC。',
        eyebrow: '使用者管理',
        roleIntro: '在基本驗證之上套用每位使用者的 RBAC。當前角色：',
        addTitle: '新增使用者',
        username: '使用者名稱',
        role: '角色',
        add: '新增',
        members: '使用者',
        permissionMatrix: '權限矩陣',
        permission: '權限',
        owner: '擁有者',
        admin: '管理員',
        designer: '設計師',
        editor: '編輯者',
        client: '客戶',
        publicAccount: '開啟公開帳號頁面',
      };

  await page.goto(`/${locale}/admin-builder/users`, { waitUntil: 'domcontentloaded' });
  await expect(page).toHaveTitle(new RegExp(copy.title));
  await expect(page.getByRole('heading', { name: copy.title })).toBeVisible();
  await expect(page.getByText(copy.eyebrow)).toBeVisible();
  await expect(page.getByText(copy.description)).toBeVisible();
  await expect(page.getByText(copy.roleIntro, { exact: false })).toBeVisible();
  await expect(page.getByRole('heading', { name: copy.addTitle })).toBeVisible();
  await expect(page.getByLabel(copy.username)).toBeVisible();
  await expect(page.getByLabel(copy.role)).toBeVisible();
  await expect(page.getByRole('button', { name: copy.add })).toBeVisible();
  await expect(page.getByRole('heading', { name: new RegExp(`${copy.members} \\(`) })).toBeVisible();
  await expect(page.getByRole('heading', { name: copy.permissionMatrix })).toBeVisible();
  await expect(page.getByRole('columnheader', { name: copy.permission })).toBeVisible();
  await expect(page.getByRole('columnheader', { name: copy.owner })).toBeVisible();
  await expect(page.getByRole('columnheader', { name: copy.admin })).toBeVisible();
  await expect(page.getByRole('columnheader', { name: copy.designer })).toBeVisible();
  await expect(page.getByRole('columnheader', { name: copy.editor })).toBeVisible();
  await expect(page.getByRole('columnheader', { name: copy.client })).toBeVisible();
}

test.describe('Users shell localization', () => {
  test.setTimeout(120_000);

  test('/ko/admin-builder/users localizes shell labels', async ({ page }) => {
    await page.setExtraHTTPHeaders(mutationHeaders('users-shell-ko'));
    await assertUsersShell(page, 'ko');
  });

  test('/zh-hant/admin-builder/users localizes shell labels', async ({ page }) => {
    await page.setExtraHTTPHeaders(mutationHeaders('users-shell-zh'));
    await assertUsersShell(page, 'zh-hant');
  });
});

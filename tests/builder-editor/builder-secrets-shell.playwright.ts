import { expect, test, type Page } from '@playwright/test';
import { createSecret } from '@/lib/builder/dev/secrets-store';

async function seedSecret(key: string, value: string): Promise<void> {
  const previousKek = process.env.NEXTAUTH_SECRET;
  if (!process.env.BUILDER_SECRET_KEK && !previousKek) {
    process.env.NEXTAUTH_SECRET = 'builder-secrets-shell-test-key';
  }
  await createSecret({
    key,
    value,
    scope: 'site',
    addedBy: 'playwright',
  });
  if (!process.env.BUILDER_SECRET_KEK && previousKek === undefined) {
    delete process.env.NEXTAUTH_SECRET;
  }
}

function mutationHeaders(scope: string): Record<string, string> {
  const safeScope = scope.replace(/[^a-z0-9-]/gi, '-').slice(-48) || 'secrets-shell';
  const username = process.env.BUILDER_SMOKE_USERNAME ?? process.env.CMS_ADMIN_USERNAME ?? 'admin';
  const password = process.env.BUILDER_SMOKE_PASSWORD ?? process.env.CMS_ADMIN_PASSWORD ?? 'local-review-2026!';
  return {
    'x-forwarded-for': `pw-${safeScope}`,
    authorization: `Basic ${Buffer.from(`${username}:${password}`).toString('base64')}`,
  };
}

async function assertSecretsShell(page: Page, locale: 'ko' | 'zh-hant', tokenSuffix: string) {
  const copy = locale === 'ko'
    ? {
        pageTitle: '시크릿 관리',
        adminTitle: '시크릿',
        adminDescription: '서버리스 함수에 안전하게 노출할 수 있는 암호화된 환경 변수입니다. 플레인텍스트는 생성·교체 시 단 1회만 표시됩니다.',
        refresh: '새로고침',
        listTitle: '저장된 시크릿',
        loading: '불러오는 중…',
        empty: '아직 등록된 시크릿이 없습니다.',
        createTitle: '새 시크릿 추가',
        key: '키',
        scope: '범위',
        value: '값',
        allowedFunctions: '허용 함수 slug (쉼표 구분)',
        create: '시크릿 추가',
        keyHeader: '키',
        scopeHeader: '범위',
        allowedHeader: '허용 함수',
        rotatedHeader: '최종 교체',
        actionsHeader: '작업',
        scopeSite: '사이트',
        scopeFunction: '함수',
        rotate: '교체',
        revoke: '취소',
        revealCreated: '시크릿이 생성되었습니다',
        revealRotated: '시크릿이 교체되었습니다',
        revealText: '아래 값을 안전한 곳에 즉시 복사하세요. 이 창을 닫으면 다시 볼 수 없습니다.',
        copy: '클립보드로 복사',
        close: '닫기',
      }
    : {
        pageTitle: '密鑰管理',
        adminTitle: '密鑰',
        adminDescription: '可安全暴露給無伺服器函式的加密環境變數。明文只會在建立或更換時顯示一次。',
        refresh: '重新整理',
        listTitle: '已儲存的密鑰',
        loading: '載入中…',
        empty: '尚未新增密鑰。',
        createTitle: '新增密鑰',
        key: '金鑰',
        scope: '範圍',
        value: '值',
        allowedFunctions: '允許的函式 slug（以逗號分隔）',
        create: '新增密鑰',
        keyHeader: '金鑰',
        scopeHeader: '範圍',
        allowedHeader: '允許函式',
        rotatedHeader: '最後更換',
        actionsHeader: '操作',
        scopeSite: '網站',
        scopeFunction: '函式',
        rotate: '更換',
        revoke: '撤銷',
        revealCreated: '密鑰已建立',
        revealRotated: '密鑰已更換',
        revealText: '請立即將下方內容複製到安全位置。關閉此視窗後將無法再次查看。',
        copy: '複製到剪貼簿',
        close: '關閉',
      };

  const key = `${locale.toUpperCase()}_SECRET_${tokenSuffix}`.replace(/-/g, '_').toUpperCase();
  const value = `value-${tokenSuffix}`;
  await seedSecret(key, value);

  await page.goto(`/${locale}/admin-builder/_dev/secrets`, { waitUntil: 'domcontentloaded' });
  await expect(page).toHaveTitle(new RegExp(copy.pageTitle));
  await expect(page.locator('main > header').getByRole('heading', { name: copy.adminTitle })).toBeVisible();
  await expect(page.locator('main > header')).toContainText(copy.adminDescription);
  await expect(page.getByRole('button', { name: copy.refresh })).toBeVisible();
  await expect(page.getByRole('heading', { name: new RegExp(copy.listTitle) })).toBeVisible();
  await expect(page.getByRole('heading', { name: copy.createTitle })).toBeVisible();
  await expect(page.getByLabel(copy.key)).toBeVisible();
  await expect(page.getByLabel(copy.scope)).toBeVisible();
  await expect(page.getByLabel(copy.value)).toBeVisible();
  await expect(page.getByRole('button', { name: copy.create })).toBeVisible();

  const row = page.locator(`[data-secret-id]`).filter({ hasText: key }).first();
  await expect(row).toBeVisible();
  await expect(page.getByRole('columnheader', { name: copy.keyHeader })).toBeVisible();
  await expect(page.getByRole('columnheader', { name: copy.scopeHeader })).toBeVisible();
  await expect(page.getByRole('columnheader', { name: copy.allowedHeader })).toBeVisible();
  await expect(page.getByRole('columnheader', { name: copy.rotatedHeader })).toBeVisible();
  await expect(page.getByRole('columnheader', { name: copy.actionsHeader })).toBeVisible();
  await expect(row.getByText(copy.scopeSite)).toBeVisible();
  await expect(row.getByRole('button', { name: copy.rotate })).toBeVisible();
  await expect(row.getByRole('button', { name: copy.revoke })).toBeVisible();

  await page.once('dialog', (dialog) => dialog.accept());
  await row.getByRole('button', { name: copy.revoke }).click();
  await expect(row).toHaveCount(0);
}

test.describe('Secrets shell localization', () => {
  test.setTimeout(120_000);

  test('/ko/admin-builder/_dev/secrets localizes shell labels', async ({ page }) => {
    await page.setExtraHTTPHeaders(mutationHeaders('secrets-shell-ko'));
    await assertSecretsShell(page, 'ko', Date.now().toString(36));
  });

  test('/zh-hant/admin-builder/_dev/secrets localizes shell labels', async ({ page }) => {
    await page.setExtraHTTPHeaders(mutationHeaders('secrets-shell-zh'));
    await assertSecretsShell(page, 'zh-hant', `${Date.now().toString(36)}-zh`);
  });
});

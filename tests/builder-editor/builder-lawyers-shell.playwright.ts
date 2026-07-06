import { expect, test } from '@playwright/test';

function mutationHeaders(scope: string): Record<string, string> {
  const safeScope = scope.replace(/[^a-z0-9-]/gi, '-').slice(-48) || 'lawyer-source-shell';
  return { 'x-forwarded-for': `pw-${safeScope}` };
}

test.describe('/admin-builder/lawyers localization', () => {
  test('renders localized lawyer source shell in ko and zh-hant', async ({ page }) => {
    test.setTimeout(60_000);

    await page.goto('/ko/admin-builder/lawyers', { waitUntil: 'domcontentloaded' });
    await expect(page).toHaveTitle(/변호사 소스 레코드/);
    await expect(page.locator('[data-builder-admin-nav-rail="true"]')).toHaveAttribute('aria-label', '빌더 관리 내비게이션');
    await expect(page.locator('[data-builder-admin-rail-back="true"]')).toContainText('편집기로 돌아가기');
    await expect(page.getByRole('heading', { name: '수명주기' })).toBeVisible();
    await expect(page.getByRole('heading', { name: '콘텐츠' })).toBeVisible();
    await expect(page.getByRole('link', { name: '서비스 소스' }).first()).toBeVisible();
    await expect(page.getByRole('link', { name: '변호사 소스' }).first()).toBeVisible();
    await expect(page.getByRole('link', { name: '칼럼 편집기' }).first()).toBeVisible();
    await expect(page.getByText('편집', { exact: true })).toBeVisible();

    await page.goto('/zh-hant/admin-builder/lawyers', { waitUntil: 'domcontentloaded' });
    await expect(page).toHaveTitle(/律師來源記錄/);
    await expect(page.locator('[data-builder-admin-nav-rail="true"]')).toHaveAttribute('aria-label', '建構器管理導覽');
    await expect(page.locator('[data-builder-admin-rail-back="true"]')).toContainText('返回編輯器');
    await expect(page.getByRole('heading', { name: '生命週期' })).toBeVisible();
    await expect(page.getByRole('heading', { name: '內容' })).toBeVisible();
    await expect(page.getByRole('link', { name: '服務來源' }).first()).toBeVisible();
    await expect(page.getByRole('link', { name: '律師來源' }).first()).toBeVisible();
    await expect(page.getByRole('link', { name: '專欄編輯器' }).first()).toBeVisible();
    await expect(page.getByText('編輯', { exact: true })).toBeVisible();
  });

  test('saves list and internal-link fields from the lawyer source editor', async ({ page }) => {
    const token = Date.now().toString(36);
    const scope = `lawyer-source-lists-${token}`;
    const languages = [`한국어 ${token}`, `영어 ${token}`];
    const practiceAreas = [`대만 투자 ${token}`, `상표 출원 ${token}`];
    const internalLinks = [
      { label: `상담 문의 ${token}`, href: '/ko/contact' },
      { label: `대만변호사 안내 ${token}`, href: '/ko/taiwan-lawyer' },
    ];

    try {
      await page.goto('/ko/admin-builder/lawyers', { waitUntil: 'domcontentloaded' });
      await expect(page.locator('[data-lawyer-source-manager]')).toBeVisible();
      await page.locator('[data-lawyer-source-row="wei-tseng"]').click();

      await page.locator('[data-lawyer-source-languages-input]').fill(languages.join('\n'));
      await page.locator('[data-lawyer-source-practice-areas-input]').fill(practiceAreas.join('\n'));
      await page.locator('[data-lawyer-source-internal-links-input]').fill(
        internalLinks.map((link) => `${link.label} | ${link.href}`).join('\n'),
      );

      await Promise.all([
        page.waitForResponse((response) => (
          response.request().method() === 'PATCH' &&
          response.url().includes('/api/builder/lawyers/wei-tseng')
        )),
        page.locator('[data-lawyer-source-save]').click(),
      ]);
      await expect(page.locator('[data-lawyer-source-status]')).toContainText('Saved.');

      const recordResponse = await page.request.get('/api/builder/lawyers/wei-tseng?locale=ko', {
        headers: mutationHeaders(`${scope}-read`),
      });
      expect(recordResponse.status()).toBe(200);
      const recordPayload = await recordResponse.json() as {
        ok?: boolean;
        record?: {
          languages?: string[];
          practiceAreas?: string[];
          internalLinks?: Array<{ label?: string; href?: string }>;
        };
        error?: string;
      };
      expect(recordPayload.ok, recordPayload.error).toBe(true);
      expect(recordPayload.record?.languages).toEqual(languages);
      expect(recordPayload.record?.practiceAreas).toEqual(practiceAreas);
      expect(recordPayload.record?.internalLinks).toEqual(internalLinks);
    } finally {
      await page.request.delete('/api/builder/lawyers/wei-tseng?locale=ko', {
        headers: mutationHeaders(`${scope}-reset`),
        failOnStatusCode: false,
      }).catch(() => undefined);
    }
  });
});

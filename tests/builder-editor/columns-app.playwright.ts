import { expect, test, type Page } from '@playwright/test';
import { getColumnsCopy } from '@/app/(builder)/[locale]/admin-builder/columns/columns-copy';
import { pageCopy } from '@/data/page-copy';

const KO_COLUMNS = getColumnsCopy('ko');
const ZH_COLUMNS = getColumnsCopy('zh-hant');

async function expectPublicColumnsLabel(page: Page, title: string, label: string): Promise<void> {
  // The Columns page is a non-decomposable composite whose public header is
  // rendered by PageHeader inside columns-page-root-composite. Validate the
  // semantic PageHeader surfaces directly rather than probing the removed
  // standalone columns-page-title node.
  const header = page.locator('section.page-header').first();
  await expect(header).toBeVisible();
  await expect(header.locator('[data-builder-surface-key="section-label"]')).toContainText(label);
  await expect(header.locator('[data-builder-surface-key="headline"]')).toContainText(title);
}

test('localizes public column detail shell labels for ko and zh-hant', async ({ page }) => {
  await page.goto('/ko/admin-builder/columns', { waitUntil: 'domcontentloaded' });
  await expect(page).toHaveTitle(new RegExp(`^${KO_COLUMNS.title.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')} \\| 법무법인 호정$`));
  await expect(page.getByRole('heading', { name: /칼럼 관리|欄目管理/ })).toBeVisible();
  await expect(page.locator('.column-manager-eyebrow')).toContainText(KO_COLUMNS.eyebrow);
  await expect(page.locator('.column-manager-toolbar .column-manager-search span')).toContainText(KO_COLUMNS.searchLabel);
  await expect(page.locator('.column-manager-toolbar .column-manager-status-filter span')).toContainText(
    KO_COLUMNS.statusLabel,
  );
  await expect(page.getByRole('button', { name: KO_COLUMNS.newButton })).toBeVisible();

  await page.goto('/ko/columns', { waitUntil: 'domcontentloaded' });
  await expect(page.locator('a.header-logo')).toHaveAttribute('aria-label', '홈');
  await expect(page.locator('nav.main-nav')).toHaveAttribute('aria-label', '주요 메뉴');
  await expect(page.locator('.footer-social .social-icon').first()).toHaveAttribute('aria-label', '블로그');
  await expectPublicColumnsLabel(page, pageCopy.ko.insights.title, '칼럼');

  await page.goto('/ko/columns/taiwan-company-establishment-basics', { waitUntil: 'domcontentloaded' });
  await expect(page.locator('.authority-card-eyebrow')).toContainText('담당 변호사');
  await expect(page.locator('.blog-back-link')).toContainText('칼럼 목록으로');
  await expect(page.locator('.blog-sidebar-title').filter({ hasText: '상담 예약' })).toContainText('상담 예약');
  await expect(page.locator('.blog-sidebar-btn')).toContainText('문의하기');
  await expect(page.locator('.authority-card-heading')).toContainText('이 글 검토 변호사');
  await expect(page.locator('.blog-sidebar-title').filter({ hasText: '함께 보는 주제' })).toContainText('함께 보는 주제');

  await page.goto('/zh-hant/admin-builder/columns', { waitUntil: 'domcontentloaded' });
  await expect(page).toHaveTitle(new RegExp(`^${ZH_COLUMNS.title.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')} \\| 법무법인 호정$`));
  await expect(page.getByRole('heading', { name: /칼럼 관리|欄目管理/ })).toBeVisible();
  await expect(page.locator('.column-manager-eyebrow')).toContainText(ZH_COLUMNS.eyebrow);
  await expect(page.locator('.column-manager-toolbar .column-manager-search span')).toContainText(ZH_COLUMNS.searchLabel);
  await expect(page.locator('.column-manager-toolbar .column-manager-status-filter span')).toContainText(
    ZH_COLUMNS.statusLabel,
  );
  await expect(page.getByRole('button', { name: ZH_COLUMNS.newButton })).toBeVisible();

  await page.goto('/zh-hant/columns', { waitUntil: 'domcontentloaded' });
  await expect(page.locator('a.header-logo')).toHaveAttribute('aria-label', '首頁');
  await expect(page.locator('nav.main-nav')).toHaveAttribute('aria-label', '主要選單');
  await expect(page.locator('.footer-social .social-icon').first()).toHaveAttribute('aria-label', '部落格');
  await expectPublicColumnsLabel(page, pageCopy['zh-hant'].insights.title, '專欄');

  await page.goto('/zh-hant/columns/taiwan-company-establishment-basics', { waitUntil: 'domcontentloaded' });
  await expect(page.locator('.authority-card-eyebrow')).toContainText('承辦律師');
  await expect(page.locator('.blog-back-link')).toContainText('返回專欄列表');
  await expect(page.locator('.blog-sidebar-title').filter({ hasText: '預約諮詢' })).toContainText('預約諮詢');
  await expect(page.locator('.blog-sidebar-btn')).toContainText('聯絡我們');
  await expect(page.locator('.authority-card-heading')).toContainText('審閱本文的律師');
  await expect(page.locator('.blog-sidebar-title').filter({ hasText: '延伸主題' })).toContainText('延伸主題');
});

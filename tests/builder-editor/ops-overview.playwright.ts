import { expect, test } from '@playwright/test';
import { writeAuditEvent } from '@/lib/builder/audit/store';

const authHeader = `Basic ${Buffer.from(
  `${process.env.BUILDER_SMOKE_USERNAME ?? process.env.CMS_ADMIN_USERNAME ?? 'admin'}:${process.env.BUILDER_SMOKE_PASSWORD ?? process.env.CMS_ADMIN_PASSWORD ?? 'local-review-2026!'}`,
).toString('base64')}`;

test('shows the localized shell and overview tab in ko and zh-hant', async ({ page }) => {
  const lifecycleCollectionId = `ops-overview-${Date.now().toString(36)}`;
  await writeAuditEvent({
    type: 'cms.records.bulk_lifecycle',
    at: new Date().toISOString(),
    actorRef: 'admin',
    siteId: 'tseng-law-main-site',
    collectionId: lifecycleCollectionId,
    action: 'status',
    recordIds: ['record-overview-a', 'record-overview-b'],
    requestedCount: 2,
    changedCount: 2,
    locale: 'ko',
    status: 'archived',
  });

  await page.setExtraHTTPHeaders({ Authorization: authHeader });
  await page.goto('/ko/admin-builder/ops', { waitUntil: 'domcontentloaded' });
  await expect(page).toHaveTitle(/Ops 대시보드/);
  await expect(page.locator('[data-ops-tabs="true"]')).toHaveAttribute('aria-label', 'Ops 섹션');
  await expect(page.getByRole('tab', { name: '개요' })).toBeVisible();
  await expect(page.getByRole('tab', { name: '캐시' })).toBeVisible();
  await expect(page.getByRole('tab', { name: '백업' })).toBeVisible();
  await expect(page.getByRole('tab', { name: '로그' })).toBeVisible();
  await expect(page.getByRole('tab', { name: '성능' })).toBeVisible();
  await expect(page.getByRole('tab', { name: '보안' })).toBeVisible();
  await expect(page.locator('[data-ops-overview="true"]')).toBeVisible();
  await expect(page.locator('[data-ops-kpi-card="Deploy"]')).toBeVisible();
  await expect(page.locator('[data-ops-deploy-identity="true"]')).toBeVisible();
  await expect(page.locator('[data-ops-deploy-field="source"]')).toBeVisible();
  await expect(page.locator('[data-ops-deploy-field="git-sha"]')).toBeVisible();
  await expect(page.locator('[data-ops-kpi-card="Cache keys"]')).toBeVisible();
  await expect(page.locator('[data-ops-kpi-card="Backups"]')).toBeVisible();
  await expect(page.locator('[data-ops-kpi-card="Logs 24h"]')).toBeVisible();
  await expect(page.locator('[data-ops-kpi-card="Security 24h"]')).toBeVisible();
  await expect(page.locator('[data-ops-cms-lifecycle-dashboard="true"]')).toBeVisible();
  await expect(page.locator(`[data-ops-cms-lifecycle-collection="${lifecycleCollectionId}"]`)).toBeVisible();
  await expect(page.locator('[data-ops-cms-lifecycle-metric="changed"]')).not.toHaveText('0');
  await expect(page.locator(`[data-ops-cms-lifecycle-log-link="${lifecycleCollectionId}"]`)).toHaveAttribute(
    'href',
    `/ko/admin-builder/ops?tab=logs&type=audit&q=${encodeURIComponent(lifecycleCollectionId)}`,
  );
  await expect(page.locator('[data-ops-alert-report="true"]')).toBeVisible();
  await expect(page.locator('[data-ops-alert-report="true"]')).toHaveAttribute('data-ops-alert-open-count', /\d+/);
  await expect(page.locator('[data-ops-alert-row], [data-ops-alert-empty]').first()).toBeVisible();

  await page.goto('/zh-hant/admin-builder/ops', { waitUntil: 'domcontentloaded' });
  await expect(page).toHaveTitle(/Ops 儀表板/);
  await expect(page.locator('[data-ops-tabs="true"]')).toHaveAttribute('aria-label', 'Ops 區段');
  await expect(page.getByRole('tab', { name: '總覽' })).toBeVisible();
  await expect(page.getByRole('tab', { name: '快取' })).toBeVisible();
  await expect(page.getByRole('tab', { name: '備份' })).toBeVisible();
  await expect(page.getByRole('tab', { name: '記錄' })).toBeVisible();
  await expect(page.getByRole('tab', { name: '效能' })).toBeVisible();
  await expect(page.getByRole('tab', { name: '安全' })).toBeVisible();
  await expect(page.locator('[data-ops-overview="true"]')).toBeVisible();
  await expect(page.locator('[data-ops-kpi-card="Deploy"]')).toBeVisible();
  await expect(page.locator('[data-ops-deploy-identity="true"]')).toBeVisible();
  await expect(page.locator('[data-ops-kpi-card="Cache keys"]')).toBeVisible();
  await expect(page.locator('[data-ops-kpi-card="Backups"]')).toBeVisible();
  await expect(page.locator('[data-ops-kpi-card="Logs 24h"]')).toBeVisible();
  await expect(page.locator('[data-ops-kpi-card="Security 24h"]')).toBeVisible();
  await expect(page.locator('[data-ops-alert-report="true"]')).toBeVisible();

  await page.locator('[data-ops-overview-refresh="true"]').click();
  await expect(page.locator('[data-ops-overview-refresh="true"]')).toBeEnabled({ timeout: 15_000 });

  await page.setViewportSize({ width: 390, height: 1200 });
  await page.goto('/ko/admin-builder/ops', { waitUntil: 'domcontentloaded' });
  await expect(page.locator('[data-ops-deploy-identity="true"]')).toBeVisible();
  await expect.poll(
    () => page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth),
  ).toBe(true);
});

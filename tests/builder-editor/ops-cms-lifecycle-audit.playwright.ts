import { expect, test } from '@playwright/test';
import { writeAuditEvent } from '@/lib/builder/audit/store';
import type { AuditEvent } from '@/lib/builder/audit/types';
import { DEFAULT_BUILDER_SITE_ID } from '@/lib/builder/constants';

const authHeader = `Basic ${Buffer.from(
  `${process.env.BUILDER_SMOKE_USERNAME ?? process.env.CMS_ADMIN_USERNAME ?? 'admin'}:${process.env.BUILDER_SMOKE_PASSWORD ?? process.env.CMS_ADMIN_PASSWORD ?? 'local-review-2026!'}`,
).toString('base64')}`;

test('ops logs deep-link to CMS lifecycle audit details', async ({ page }) => {
  const token = Date.now().toString(36);
  const collectionId = `pw-ops-cms-${token}`;
  const recordId = `record-${token}`;
  const event: AuditEvent = {
    type: 'cms.records.bulk_lifecycle',
    at: new Date().toISOString(),
    actorRef: 'admin',
    siteId: DEFAULT_BUILDER_SITE_ID,
    collectionId,
    action: 'status',
    recordIds: [recordId],
    requestedCount: 1,
    changedCount: 1,
    locale: 'ko',
    status: 'archived',
  };

  await writeAuditEvent(event);
  await page.setExtraHTTPHeaders({ Authorization: authHeader });
  await page.goto(`/ko/admin-builder/ops?tab=logs&type=audit&q=${collectionId}`, { waitUntil: 'domcontentloaded' });

  await expect(page.locator('[data-ops-panel="logs"] [data-ops-logs-panel="true"]')).toBeVisible();
  const row = page.locator('[data-ops-log-row="true"]').filter({ hasText: collectionId });
  await expect(row).toBeVisible();
  await expect(row.locator('[data-ops-log-summary="true"]')).toContainText('CMS lifecycle');
  await expect(row.locator('[data-ops-log-summary="true"]')).toContainText('1/1 changed');
  await expect(row.locator('[data-ops-log-detail="collection"]')).toContainText(collectionId);
  await expect(row.locator('[data-ops-log-detail="status"]')).toContainText('archived');
  await expect(row.locator('[data-ops-log-detail="records"]')).toContainText(recordId);

  await page.setViewportSize({ width: 390, height: 1000 });
  await page.goto(`/ko/admin-builder/ops?tab=logs&type=audit&q=${collectionId}`, { waitUntil: 'domcontentloaded' });
  await expect(page.locator('[data-ops-log-row="true"]').filter({ hasText: collectionId })).toBeVisible();
  await expect.poll(
    () => page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth),
  ).toBe(true);
});

import { expect, test } from '@playwright/test';
import { del } from '@vercel/blob';
import { saveConnection } from '@/lib/builder/bookings/calendar-sync/storage';
import type { CalendarConnection } from '@/lib/builder/bookings/calendar-sync/types';

function mutationHeaders(scope: string): Record<string, string> {
  const safeScope = scope.replace(/[^a-z0-9-]/gi, '-').slice(-48) || 'bookings-calendar-sync';
  const username = process.env.BUILDER_SMOKE_USERNAME ?? process.env.CMS_ADMIN_USERNAME ?? 'admin';
  const password = process.env.BUILDER_SMOKE_PASSWORD ?? process.env.CMS_ADMIN_PASSWORD ?? 'local-review-2026!';
  return {
    'x-forwarded-for': `pw-${safeScope}`,
    authorization: `Basic ${Buffer.from(`${username}:${password}`).toString('base64')}`,
  };
}

test.describe('Bookings calendar sync QA summary', () => {
  test.setTimeout(120_000);

  test('renders the persisted last sync result for a seeded connection', async ({ page }) => {
    const token = Date.now().toString(36);
    const headers = mutationHeaders(token);
    const connectionId = `cs_google_staff-${token}`;
    let staffId = '';

    // Keep the direct storage writes on the FILE backend: the QA server runs
    // with the Blob token blanked, so seeding into Blob would be invisible to
    // the UI under test (and would write test data into the production store).
    delete process.env.BLOB_READ_WRITE_TOKEN;

    await page.request.post('/api/builder/bookings/staff', {
      headers,
      data: {
        name: { ko: `캘린더 싱크 ${token}`, 'zh-hant': `行事曆同步 ${token}`, en: `Calendar Sync ${token}` },
        title: { ko: '연결 담당', 'zh-hant': '同步管理', en: 'Sync manager' },
        bio: { ko: '캘린더 동기화 QA', 'zh-hant': '行事曆同步 QA', en: 'Calendar sync QA' },
        email: '',
        photo: '',
        isActive: true,
      },
    }).then(async (response) => {
      expect(response.status()).toBe(201);
      const payload = await response.json() as { staff: { staffId: string } };
      staffId = payload.staff.staffId;
    });

    const connection: CalendarConnection = {
      connectionId,
      staffId,
      provider: 'google' as const,
      accountEmail: 'ops@example.com',
      refreshTokenEncrypted: 'encrypted',
      scope: 'https://www.googleapis.com/auth/calendar.events',
      status: 'error',
      lastError: 'Google token refresh failed',
      lastSyncedAt: '2026-05-31T01:02:03.000Z',
      lastSyncResult: {
        ok: false,
        pushed: 2,
        pulled: 1,
        bookingUpdates: 1,
        blockedUpdates: 2,
        reconciliationFeed: [
          {
            externalId: 'external-booking',
            summary: 'Booking update from Google',
            kind: 'booking',
            status: 'updated',
            bookingId: 'bk-1',
            note: 'booking start/end updated from provider',
          },
          {
            externalId: 'external-block',
            summary: 'Team offsite',
            kind: 'block',
            status: 'created',
            note: 'created external busy block from provider event',
          },
          {
            externalId: 'google-pull-cs_google_staff-sync',
            summary: 'google pull failed',
            kind: 'block',
            status: 'error',
            source: 'pull',
            note: 'Google calendarView 500',
          },
        ],
        errors: [{ kind: 'token', message: 'Google token refresh failed' }],
      },
      eventMappings: [{
        bookingId: 'bk-1',
        externalId: 'evt-1',
        lastPushedAt: '2026-05-31T01:02:03.000Z',
      }],
      createdAt: '2026-05-31T01:02:03.000Z',
      updatedAt: '2026-05-31T01:02:03.000Z',
    };
    await saveConnection(connection);

    try {
      await page.goto('/ko/admin-builder/bookings/calendar-sync', { waitUntil: 'domcontentloaded' });
      await expect(page.getByRole('heading', { name: '스태프별 연결' })).toBeVisible();
      const summary = page.locator(`[data-calendar-sync-summary="${connectionId}"]`);
      await expect(summary).toContainText('최근 동기화: 푸시 2 · 가져오기 1 · 예약 반영 1 · 블록 반영 2 · 오류 1건');
      await expect(page.locator(`[data-calendar-sync-last-error="${connectionId}"]`)).toContainText('Google token refresh failed');
      await expect(page.locator(`[data-calendar-sync-connection-id="${connectionId}"]`)).toContainText(`연결 ID ${connectionId}`);
      await expect(page.locator(`[data-calendar-sync-mapping-count="${connectionId}"]`)).toContainText('매핑 1');
      await expect(page.locator(`[data-calendar-sync-provider-scope="${connectionId}"]`)).toContainText('https://www.googleapis.com/auth/calendar.events');
      await expect(page.locator(`[data-calendar-sync-provider-scope-status="${connectionId}"]`)).toContainText('OAuth 범위 OK');
      await expect(page.locator(`[data-calendar-sync-provider-account="${connectionId}"]`)).toContainText('계정 ops@example.com');
      await expect(page.locator(`[data-calendar-sync-provider-reconciliation="${connectionId}"]`)).toContainText('예약 반영 1건, 블록 반영 2건');
      await expect(page.locator(`[data-calendar-sync-reconciliation-feed="${connectionId}"]`)).toContainText('Booking update from Google');
      await expect(page.locator(`[data-calendar-sync-reconciliation-feed="${connectionId}"]`)).toContainText('booking · 업데이트');
      await expect(page.locator(`[data-calendar-sync-reconciliation-feed="${connectionId}"]`)).toContainText('Team offsite');
      await expect(page.locator(`[data-calendar-sync-reconciliation-feed="${connectionId}"]`)).toContainText('block · 생성');
      await expect(page.locator(`[data-calendar-sync-reconciliation-feed="${connectionId}"]`)).toContainText('google pull failed');
      await expect(page.locator(`[data-calendar-sync-reconciliation-feed="${connectionId}"]`)).toContainText('pull block · 오류');

      await page.goto('/zh-hant/admin-builder/bookings/calendar-sync', { waitUntil: 'domcontentloaded' });
      await expect(page.getByRole('heading', { name: '按員工的連線' })).toBeVisible();
      const zhSummary = page.locator(`[data-calendar-sync-summary="${connectionId}"]`);
      await expect(zhSummary).toContainText('最近同步：推送 2 · 拉取 1 · 預約反映 1 · 區塊反映 2 · 錯誤 1 筆');
      await expect(page.locator(`[data-calendar-sync-last-error="${connectionId}"]`)).toContainText('Google token refresh failed');
      await expect(page.locator(`[data-calendar-sync-connection-id="${connectionId}"]`)).toContainText(`連線 ID ${connectionId}`);
      await expect(page.locator(`[data-calendar-sync-mapping-count="${connectionId}"]`)).toContainText('映射 1');
      await expect(page.locator(`[data-calendar-sync-provider-scope="${connectionId}"]`)).toContainText('OAuth 範圍');
      await expect(page.locator(`[data-calendar-sync-provider-scope-status="${connectionId}"]`)).toContainText('OAuth 範圍正常');
      await expect(page.locator(`[data-calendar-sync-provider-account="${connectionId}"]`)).toContainText('帳戶 ops@example.com');
      await expect(page.locator(`[data-calendar-sync-provider-reconciliation="${connectionId}"]`)).toContainText('預約反映 1件, 區塊反映 2件');
      await expect(page.locator(`[data-calendar-sync-reconciliation-feed="${connectionId}"]`)).toContainText('Booking update from Google');
      await expect(page.locator(`[data-calendar-sync-reconciliation-feed="${connectionId}"]`)).toContainText('booking · 更新');
      await expect(page.locator(`[data-calendar-sync-reconciliation-feed="${connectionId}"]`)).toContainText('Team offsite');
      await expect(page.locator(`[data-calendar-sync-reconciliation-feed="${connectionId}"]`)).toContainText('block · 建立');
      await expect(page.locator(`[data-calendar-sync-reconciliation-feed="${connectionId}"]`)).toContainText('google pull failed');
      await expect(page.locator(`[data-calendar-sync-reconciliation-feed="${connectionId}"]`)).toContainText('pull block · 錯誤');
    } finally {
      await del(`calendar-sync/${connectionId}.json`).catch(() => undefined);
      if (staffId) {
        await page.request.delete(`/api/builder/bookings/staff/${staffId}`, {
          headers,
          failOnStatusCode: false,
        });
      }
    }
  });
});

import { expect, type Locator } from '@playwright/test';

import type { CheckpointDefinition, CheckpointFinding } from '../types';
import { cleanupFiles } from './W200-booking-widget-cleanup';
import { bookingHeaders, saveAvailability } from './W200-booking-widget-helpers';
import {
  createDashboardBooking,
  createDashboardService,
  createDashboardStaff,
  dashboardWeekdayDate,
  fetchFirstDashboardSlot,
  type DashboardBookingRecord,
} from './W207-booking-dashboard-helpers';

type FixtureState = {
  staffId: string | null;
  serviceId: string | null;
  bookingId: string | null;
};

function blocker(summary: string, detail?: string): CheckpointFinding {
  return detail ? { severity: 'blocker', summary, detail } : { severity: 'blocker', summary };
}

async function clearFilters(filters: Locator): Promise<void> {
  await filters.locator('[data-booking-dashboard-search="true"]').fill('');
  await filters.getByLabel('상태').selectOption('');
  await filters.getByLabel('담당자').selectOption('');
  await filters.getByLabel('서비스').selectOption('');
  await filters.getByLabel('시작일').fill('');
  await filters.getByLabel('종료일').fill('');
}

async function expectTargetOnly(rows: Locator, target: DashboardBookingRecord, decoy: DashboardBookingRecord): Promise<void> {
  await expect(rows.locator(`[data-booking-row="${target.bookingId}"]`)).toBeVisible();
  await expect(rows.locator(`[data-booking-row="${decoy.bookingId}"]`)).toBeHidden();
}

export const checkpoint: CheckpointDefinition = {
  id: 'W207',
  title: 'Booking admin dashboard list, filters, and detail modal',
  verification: '관리자 booking 대시보드에서 검색/status/staff/service/date 필터와 예약 상세 모달을 실제 예약 row로 검증',
  async run({ page, baseUrl, recordEvidence }) {
    const findings: CheckpointFinding[] = [];
    const token = Date.now().toString(36);
    const headers = bookingHeaders(`w207-${token}`);
    const targetDate = dashboardWeekdayDate(10);
    const decoyDate = dashboardWeekdayDate(14);
    const target: FixtureState = { staffId: null, serviceId: null, bookingId: null };
    const decoy: FixtureState = { staffId: null, serviceId: null, bookingId: null };

    try {
      await page.setExtraHTTPHeaders(headers);

      target.staffId = await createDashboardStaff({ page, headers, token, label: 'target' });
      decoy.staffId = await createDashboardStaff({ page, headers, token, label: 'decoy' });
      if (!target.staffId || !decoy.staffId) {
        findings.push(blocker('W207 담당자 fixture를 생성하지 못했습니다.'));
        return { findings };
      }

      target.serviceId = await createDashboardService({ page, headers, token, label: 'target', staffId: target.staffId });
      decoy.serviceId = await createDashboardService({ page, headers, token, label: 'decoy', staffId: decoy.staffId });
      if (!target.serviceId || !decoy.serviceId) {
        findings.push(blocker('W207 서비스 fixture를 생성하지 못했습니다.'));
        return { findings };
      }

      if (
        !(await saveAvailability({ page, headers, token: `${token}-target`, staffId: target.staffId })) ||
        !(await saveAvailability({ page, headers, token: `${token}-decoy`, staffId: decoy.staffId }))
      ) {
        findings.push(blocker('W207 담당자 availability fixture를 저장하지 못했습니다.'));
        return { findings };
      }

      const targetStartAt = await fetchFirstDashboardSlot(page, headers, target.serviceId, target.staffId, targetDate);
      const decoyStartAt = await fetchFirstDashboardSlot(page, headers, decoy.serviceId, decoy.staffId, decoyDate);
      if (!targetStartAt || !decoyStartAt) {
        findings.push(blocker('W207 예약 생성에 필요한 공개 슬롯을 찾지 못했습니다.'));
        return { findings };
      }

      const targetBooking = await createDashboardBooking({
        page,
        headers,
        token,
        label: 'target',
        staffId: target.staffId,
        serviceId: target.serviceId,
        startAt: targetStartAt,
        status: 'confirmed',
      });
      const decoyBooking = await createDashboardBooking({
        page,
        headers,
        token,
        label: 'decoy',
        staffId: decoy.staffId,
        serviceId: decoy.serviceId,
        startAt: decoyStartAt,
        status: 'pending',
      });
      if (!targetBooking || !decoyBooking) {
        findings.push(blocker('W207 관리자 예약 fixture를 생성하지 못했습니다.'));
        return { findings };
      }
      target.bookingId = targetBooking.bookingId;
      decoy.bookingId = decoyBooking.bookingId;

      await page.goto(new URL(`/ko/admin-builder/bookings/dashboard?w207=${token}`, baseUrl).toString(), { waitUntil: 'domcontentloaded' });
      await expect(page.locator('[data-booking-dashboard="true"]').first()).toBeVisible({ timeout: 15_000 });
      const filters = page.locator('[data-booking-dashboard-search="true"]').locator('xpath=ancestor::section[1]');
      const rows = page.locator('body');
      await expect(rows.locator(`[data-booking-row="${targetBooking.bookingId}"]`)).toBeVisible();
      await expect(rows.locator(`[data-booking-row="${decoyBooking.bookingId}"]`)).toBeVisible();

      await filters.locator('[data-booking-dashboard-search="true"]').fill(targetBooking.customerEmail);
      await expectTargetOnly(rows, targetBooking, decoyBooking);
      await clearFilters(filters);

      await filters.getByLabel('상태').selectOption('confirmed');
      await expectTargetOnly(rows, targetBooking, decoyBooking);
      await clearFilters(filters);

      await filters.getByLabel('담당자').selectOption(targetBooking.staffId);
      await expectTargetOnly(rows, targetBooking, decoyBooking);
      await clearFilters(filters);

      await filters.getByLabel('서비스').selectOption(targetBooking.serviceId);
      await expectTargetOnly(rows, targetBooking, decoyBooking);
      await clearFilters(filters);

      await filters.getByLabel('시작일').fill(targetDate);
      await filters.getByLabel('종료일').fill(targetDate);
      await expectTargetOnly(rows, targetBooking, decoyBooking);
      await recordEvidence('W207 dashboard filters isolate the target booking', page);

      await rows.locator(`[data-booking-row="${targetBooking.bookingId}"]`).click();
      const closeButton = page.locator(`[data-booking-detail-close="${targetBooking.bookingId}"]`);
      await expect(closeButton).toBeVisible();
      const modal = closeButton.locator('xpath=../..');
      await expect(modal.getByRole('heading', { name: targetBooking.customerName, exact: true })).toBeVisible();
      await expect(modal).toContainText(targetBooking.customerEmail);
      await expect(modal).toContainText(targetBooking.serviceNameKo);
      await expect(modal).toContainText(targetBooking.staffNameKo);
      await expect(modal.locator('[data-booking-status="confirmed"]')).toBeVisible();
      await expect(modal.locator('[data-booking-office-timezone="true"]')).toBeVisible();
      await expect(modal).toContainText('Asia/Seoul');
      await expect(modal.locator('[data-customer-profile="true"]')).toContainText('총 방문');
      await recordEvidence('W207 dashboard opens the booking detail modal', page);
      await closeButton.click();
      await expect(closeButton).toBeHidden();
    } catch (error) {
      const detail = error instanceof Error ? error.message : String(error);
      findings.push(blocker('W207 예약 대시보드 검증 중 예외가 발생했습니다.', detail));
    } finally {
      await cleanupFiles({ staffId: target.staffId, serviceId: target.serviceId, bookingId: target.bookingId, pageId: null });
      await cleanupFiles({ staffId: decoy.staffId, serviceId: decoy.serviceId, bookingId: decoy.bookingId, pageId: null });
    }

    return { findings };
  },
};

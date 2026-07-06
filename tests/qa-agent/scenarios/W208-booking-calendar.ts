import { expect, type Locator } from '@playwright/test';

import type { CheckpointDefinition, CheckpointFinding } from '../types';
import { cleanupFiles } from './W200-booking-widget-cleanup';
import { bookingHeaders, saveAvailability } from './W200-booking-widget-helpers';
import {
  createCalendarBooking,
  createCalendarService,
  createCalendarStaff,
  fetchFirstCalendarSlot,
  nextCalendarMonthDate,
  type CalendarBookingRecord,
} from './W208-booking-calendar-helpers';

type FixtureState = {
  staffId: string | null;
  serviceId: string | null;
  bookingId: string | null;
};

function blocker(summary: string, detail?: string): CheckpointFinding {
  return detail ? { severity: 'blocker', summary, detail } : { severity: 'blocker', summary };
}

async function expectEntryVisible(scope: Locator, booking: CalendarBookingRecord): Promise<void> {
  const entry = scope.locator(`[data-calendar-entry-id="${booking.bookingId}"]`);
  await expect(entry).toBeVisible();
  await expect(entry).toContainText(booking.customerName);
}

async function expectTargetOnly(scope: Locator, target: CalendarBookingRecord, decoy: CalendarBookingRecord): Promise<void> {
  await expectEntryVisible(scope, target);
  await expect(scope.locator(`[data-calendar-entry-id="${decoy.bookingId}"]`)).toBeHidden();
}

export const checkpoint: CheckpointDefinition = {
  id: 'W208',
  title: 'Booking calendar month, week, and list views',
  verification: '관리자 booking 캘린더에서 URL 상태 복원, staff filter, 월간/주간/목록 view 전환과 예약 entry 렌더링 검증',
  async run({ page, baseUrl, recordEvidence }) {
    const findings: CheckpointFinding[] = [];
    const token = Date.now().toString(36);
    const headers = bookingHeaders(`w208-${token}`);
    const target: FixtureState = { staffId: null, serviceId: null, bookingId: null };
    const decoy: FixtureState = { staffId: null, serviceId: null, bookingId: null };
    const calendarDate = nextCalendarMonthDate();

    try {
      await page.setExtraHTTPHeaders(headers);

      target.staffId = await createCalendarStaff({ page, headers, token, label: 'target' });
      decoy.staffId = await createCalendarStaff({ page, headers, token, label: 'decoy' });
      if (!target.staffId || !decoy.staffId) {
        findings.push(blocker('W208 담당자 fixture를 생성하지 못했습니다.'));
        return { findings };
      }

      target.serviceId = await createCalendarService({ page, headers, token, label: 'target', staffId: target.staffId });
      decoy.serviceId = await createCalendarService({ page, headers, token, label: 'decoy', staffId: decoy.staffId });
      if (!target.serviceId || !decoy.serviceId) {
        findings.push(blocker('W208 서비스 fixture를 생성하지 못했습니다.'));
        return { findings };
      }

      if (
        !(await saveAvailability({ page, headers, token: `${token}-target`, staffId: target.staffId })) ||
        !(await saveAvailability({ page, headers, token: `${token}-decoy`, staffId: decoy.staffId }))
      ) {
        findings.push(blocker('W208 담당자 availability fixture를 저장하지 못했습니다.'));
        return { findings };
      }

      const targetStartAt = await fetchFirstCalendarSlot(page, headers, target.serviceId, target.staffId, calendarDate.date);
      const decoyStartAt = await fetchFirstCalendarSlot(page, headers, decoy.serviceId, decoy.staffId, calendarDate.date);
      if (!targetStartAt || !decoyStartAt) {
        findings.push(blocker('W208 예약 생성에 필요한 공개 슬롯을 찾지 못했습니다.'));
        return { findings };
      }

      const targetBooking = await createCalendarBooking({
        page,
        headers,
        token,
        label: 'target',
        staffId: target.staffId,
        serviceId: target.serviceId,
        startAt: targetStartAt,
        status: 'confirmed',
      });
      const decoyBooking = await createCalendarBooking({
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
        findings.push(blocker('W208 관리자 예약 fixture를 생성하지 못했습니다.'));
        return { findings };
      }
      target.bookingId = targetBooking.bookingId;
      decoy.bookingId = decoyBooking.bookingId;

      const unfilteredUrl = new URL(`/ko/admin-builder/bookings/calendar?month=${calendarDate.month}&view=list&w208=${token}`, baseUrl);
      await page.goto(unfilteredUrl.toString(), { waitUntil: 'domcontentloaded' });
      await expect(page.locator('[data-bookings-calendar-month="true"]')).toContainText(calendarDate.month);
      await expect(page.locator('[data-calendar-view="list"]')).toBeVisible();
      await expectEntryVisible(page.locator('[data-calendar-view="list"]'), targetBooking);
      await expectEntryVisible(page.locator('[data-calendar-view="list"]'), decoyBooking);

      const staffFilter = page.locator('[data-bookings-calendar-staff-filter="true"]');
      await staffFilter.selectOption(targetBooking.staffId);
      await expect(staffFilter).toHaveValue(targetBooking.staffId);
      await expect(page).toHaveURL(new RegExp(`staffId=${targetBooking.staffId}`));
      await expectTargetOnly(page.locator('[data-calendar-view="list"]'), targetBooking, decoyBooking);
      await recordEvidence('W208 calendar list view filters to target staff', page);

      await page.getByRole('button', { name: '월간' }).click();
      await expect(page.locator('[data-calendar-view="month"]')).toBeVisible();
      await expect(page).toHaveURL(/view=month/);
      await expectTargetOnly(page.locator('[data-calendar-view="month"]'), targetBooking, decoyBooking);

      await page.getByRole('button', { name: '주간' }).click();
      await expect(page.locator('[data-calendar-view="week"]')).toBeVisible();
      await expect(page).toHaveURL(/view=week/);
      await expectTargetOnly(page.locator('[data-calendar-view="week"]'), targetBooking, decoyBooking);
      await recordEvidence('W208 calendar month and week views render filtered booking', page);

      await page.getByRole('button', { name: '목록' }).click();
      await expect(page.locator('[data-calendar-view="list"]')).toBeVisible();
      await expect(page).toHaveURL(/view=list/);
      await page.reload({ waitUntil: 'domcontentloaded' });
      await expect(page.locator('[data-calendar-view="list"]')).toBeVisible();
      await expect(staffFilter).toHaveValue(targetBooking.staffId);
      await expect(page.locator('[data-bookings-calendar-month="true"]')).toContainText(calendarDate.month);
      await expectTargetOnly(page.locator('[data-calendar-view="list"]'), targetBooking, decoyBooking);
      await recordEvidence('W208 calendar URL restores list view month and staff filter', page);
    } catch (error) {
      const detail = error instanceof Error ? error.message : String(error);
      findings.push(blocker('W208 booking 캘린더 검증 중 예외가 발생했습니다.', detail));
    } finally {
      await cleanupFiles({ staffId: target.staffId, serviceId: target.serviceId, bookingId: target.bookingId, pageId: null });
      await cleanupFiles({ staffId: decoy.staffId, serviceId: decoy.serviceId, bookingId: decoy.bookingId, pageId: null });
    }

    return { findings };
  },
};

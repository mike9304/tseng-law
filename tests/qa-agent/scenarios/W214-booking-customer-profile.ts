import { expect } from '@playwright/test';

import type { CheckpointDefinition, CheckpointFinding } from '../types';
import {
  bookingHeaders,
  cleanupInsightFixture,
  createInsightBooking,
  createInsightService,
  createInsightStaff,
  fetchInsightSlots,
  insightWeekdayDate,
  saveInsightAvailability,
  type InsightBookingRecord,
  type InsightFixtureState,
} from './W213-W214-booking-insights-helpers';

function blocker(summary: string, detail?: string): CheckpointFinding {
  return detail ? { severity: 'blocker', summary, detail } : { severity: 'blocker', summary };
}

export const checkpoint: CheckpointDefinition = {
  id: 'W214',
  title: 'Booking customer profile grouped by email',
  verification: '같은 이메일의 여러 예약이 row 방문 chip, 상세 profile, 고객 이력 timeline으로 묶이는지 검증',
  async run({ page, baseUrl, recordEvidence }) {
    const findings: CheckpointFinding[] = [];
    const token = Date.now().toString(36);
    const headers = bookingHeaders(`w214-${token}`);
    const state: InsightFixtureState = { staffId: null, serviceId: null, bookingIds: [] };

    try {
      await page.setExtraHTTPHeaders(headers);
      const staff = await createInsightStaff({ page, headers, token, checkpoint: 'W214' });
      if (!staff) {
        findings.push(blocker('W214 담당자 fixture를 생성하지 못했습니다.'));
        return { findings };
      }
      state.staffId = staff.id;

      const service = await createInsightService({ page, headers, token, checkpoint: 'W214', staffId: staff.id, paid: false, priceAmount: 0 });
      if (!service) {
        findings.push(blocker('W214 서비스 fixture를 생성하지 못했습니다.'));
        return { findings };
      }
      state.serviceId = service.id;

      if (!(await saveInsightAvailability({ page, headers, token, checkpoint: 'W214', staffId: staff.id }))) {
        findings.push(blocker('W214 담당자 availability fixture를 저장하지 못했습니다.'));
        return { findings };
      }

      const slots = await fetchInsightSlots(page, headers, service.id, staff.id, insightWeekdayDate(12), 4);
      if (slots.length < 4) {
        findings.push(blocker('W214 customer profile fixture용 슬롯 4개를 찾지 못했습니다.'));
        return { findings };
      }

      const sharedEmail = `w214-profile-${token}@example.com`;
      const sharedName = `W214 반복 고객 ${token}`;
      const records: InsightBookingRecord[] = [];
      const bookingInputs = [
        { label: '완료 이력', status: 'completed', email: sharedEmail, name: sharedName },
        { label: '예정 이력', status: 'confirmed', email: sharedEmail, name: sharedName },
        { label: '취소 이력', status: 'cancelled', email: sharedEmail, name: sharedName },
        { label: '다른 고객', status: 'confirmed', email: `w214-decoy-${token}@example.com`, name: `W214 다른 고객 ${token}` },
      ] as const;

      for (const [index, input] of bookingInputs.entries()) {
        const booking = await createInsightBooking({
          page,
          headers,
          token,
          checkpoint: 'W214',
          staffId: staff.id,
          serviceId: service.id,
          startAt: slots[index].startAt,
          status: input.status,
          label: input.label,
          customerEmail: input.email,
          customerName: input.name,
          paid: false,
          priceAmount: 0,
        });
        if (!booking) {
          findings.push(blocker(`W214 ${input.label} 예약 fixture를 생성하지 못했습니다.`));
          return { findings };
        }
        records.push(booking);
        state.bookingIds.push(booking.bookingId);
      }

      const target = records[1];
      const decoy = records[3];
      await page.setExtraHTTPHeaders({});
      await page.goto(new URL(`/ko/admin-builder/bookings/dashboard?w214=${token}`, baseUrl).toString(), { waitUntil: 'domcontentloaded' });
      await expect(page.locator('[data-booking-dashboard="true"]').first()).toBeVisible({ timeout: 15_000 });
      const targetRow = page.locator(`[data-booking-row="${target.bookingId}"]`);
      await expect(targetRow).toBeVisible();
      await expect(targetRow).toContainText(sharedEmail);
      await expect(targetRow).toContainText('3 회 방문');
      await expect(page.locator(`[data-booking-row="${decoy.bookingId}"]`)).toContainText('1 회 방문');
      await recordEvidence('W214 dashboard row groups repeat customer visits by email', page);

      await targetRow.click();
      const closeButton = page.locator(`[data-booking-detail-close="${target.bookingId}"]`);
      await expect(closeButton).toBeVisible();
      const modal = closeButton.locator('xpath=../..');
      const profile = modal.locator('[data-customer-profile="true"]');
      await expect(profile).toContainText('총 방문: 3');
      await expect(profile).toContainText('완료: 1');
      await expect(profile).toContainText('취소됨: 1');
      for (const record of records.slice(0, 3)) {
        await expect(modal.locator(`[data-customer-history-item="${record.bookingId}"]`)).toBeVisible();
      }
      await expect(modal.locator(`[data-customer-history-item="${decoy.bookingId}"]`)).toBeHidden();
      await recordEvidence('W214 detail modal shows customer profile and same-email history timeline', page);
      await closeButton.click();
      await expect(closeButton).toBeHidden();
    } catch (error) {
      const detail = error instanceof Error ? error.message : String(error);
      findings.push(blocker('W214 customer profile 검증 중 예외가 발생했습니다.', detail));
    } finally {
      await cleanupInsightFixture(state);
    }

    return { findings };
  },
};

import { expect, type Locator } from '@playwright/test';

import type { CheckpointDefinition, CheckpointFinding } from '../types';
import {
  bookingHeaders,
  cleanupInsightFixture,
  createInsightBooking,
  createInsightService,
  createInsightStaff,
  fetchInsightSlots,
  insightWeekdayDate,
  markInsightBookingPaid,
  saveInsightAvailability,
  type InsightFixtureState,
} from './W213-W214-booking-insights-helpers';

function blocker(summary: string, detail?: string): CheckpointFinding {
  return detail ? { severity: 'blocker', summary, detail } : { severity: 'blocker', summary };
}

function metricCard(analytics: Locator, label: string): Locator {
  return analytics.getByText(label, { exact: true }).locator('xpath=..');
}

export const checkpoint: CheckpointDefinition = {
  id: 'W213',
  title: 'Booking analytics cards and breakdowns',
  verification: '격리된 예약 fixture로 completion/cancellation/no-show/revenue 카드와 service/staff/customer breakdown을 검증',
  async run({ page, baseUrl, recordEvidence }) {
    const findings: CheckpointFinding[] = [];
    const token = Date.now().toString(36);
    const headers = bookingHeaders(`w213-${token}`);
    const state: InsightFixtureState = { staffId: null, serviceId: null, bookingIds: [] };
    const priceAmount = 7000;

    try {
      await page.setExtraHTTPHeaders(headers);
      const staff = await createInsightStaff({ page, headers, token, checkpoint: 'W213' });
      if (!staff) {
        findings.push(blocker('W213 담당자 fixture를 생성하지 못했습니다.'));
        return { findings };
      }
      state.staffId = staff.id;

      const service = await createInsightService({ page, headers, token, checkpoint: 'W213', staffId: staff.id, paid: true, priceAmount });
      if (!service) {
        findings.push(blocker('W213 유료 서비스 fixture를 생성하지 못했습니다.'));
        return { findings };
      }
      state.serviceId = service.id;

      if (!(await saveInsightAvailability({ page, headers, token, checkpoint: 'W213', staffId: staff.id }))) {
        findings.push(blocker('W213 담당자 availability fixture를 저장하지 못했습니다.'));
        return { findings };
      }

      const slots = await fetchInsightSlots(page, headers, service.id, staff.id, insightWeekdayDate(10), 4);
      if (slots.length < 4) {
        findings.push(blocker('W213 analytics fixture용 슬롯 4개를 찾지 못했습니다.'));
        return { findings };
      }

      const sharedEmail = `w213-shared-${token}@example.com`;
      const paidIntentId = `pi_w213_${token}`;
      const bookingInputs = [
        { label: '완료', status: 'completed', email: sharedEmail, name: `W213 공유 고객 ${token}`, intent: paidIntentId },
        { label: '취소', status: 'cancelled', email: `w213-cancel-${token}@example.com`, name: `W213 취소 고객 ${token}` },
        { label: '노쇼', status: 'no-show', email: sharedEmail, name: `W213 공유 고객 ${token}` },
        { label: '대기', status: 'pending', email: `w213-pending-${token}@example.com`, name: `W213 대기 고객 ${token}` },
      ] as const;

      for (const [index, input] of bookingInputs.entries()) {
        const booking = await createInsightBooking({
          page,
          headers,
          token,
          checkpoint: 'W213',
          staffId: staff.id,
          serviceId: service.id,
          startAt: slots[index].startAt,
          status: input.status,
          label: input.label,
          customerEmail: input.email,
          customerName: input.name,
          paymentIntentId: 'intent' in input ? input.intent : undefined,
          paid: true,
          priceAmount,
        });
        if (!booking) {
          findings.push(blocker(`W213 ${input.label} 예약 fixture를 생성하지 못했습니다.`));
          return { findings };
        }
        state.bookingIds.push(booking.bookingId);
      }

      if (!(await markInsightBookingPaid(page, headers, `w213-${token}`, paidIntentId, priceAmount))) {
        findings.push(blocker('W213 유료 예약을 Stripe webhook으로 paid 상태로 전환하지 못했습니다.'));
        return { findings };
      }

      await page.setExtraHTTPHeaders({});
      await page.goto(new URL(`/ko/admin-builder/bookings/dashboard?w213=${token}`, baseUrl).toString(), { waitUntil: 'domcontentloaded' });
      const analytics = page.locator('[data-booking-analytics="true"]');
      await expect(analytics).toBeVisible({ timeout: 15_000 });
      await expect(metricCard(analytics, '완료율')).toContainText('25%');
      await expect(metricCard(analytics, '완료율')).toContainText('1 완료');
      await expect(metricCard(analytics, '취소율')).toContainText('25%');
      await expect(metricCard(analytics, '취소율')).toContainText('1 취소됨');
      await expect(metricCard(analytics, '노쇼율')).toContainText('25%');
      await expect(metricCard(analytics, '노쇼율')).toContainText('1 노쇼');
      await expect(metricCard(analytics, '유료 수익')).toContainText('7,000');
      await expect(analytics.getByText(service.nameKo, { exact: true }).locator('xpath=..')).toContainText('4');
      await expect(analytics.getByText(`W213 공유 고객 ${token}`, { exact: true }).locator('xpath=..')).toContainText('2');

      const utilization = page.locator('[data-booking-utilization="true"]');
      await expect(utilization.locator(`[data-booking-service-utilization-row="${service.id}"]`)).toContainText(service.nameKo);
      await expect(utilization.locator(`[data-booking-staff-utilization-row="${staff.id}"]`)).toContainText(staff.nameKo);
      await recordEvidence('W213 analytics cards and breakdowns show deterministic booking metrics', page);
    } catch (error) {
      const detail = error instanceof Error ? error.message : String(error);
      findings.push(blocker('W213 예약 analytics 검증 중 예외가 발생했습니다.', detail));
    } finally {
      await cleanupInsightFixture(state);
    }

    return { findings };
  },
};

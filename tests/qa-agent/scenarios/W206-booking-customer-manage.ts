import { expect, type Response } from '@playwright/test';
import { createBookingManageToken } from '@/lib/builder/bookings/manage-token';
import type { CheckpointDefinition, CheckpointFinding } from '../types';
import { cleanupFiles } from './W200-booking-widget-cleanup';
import { bookingHeaders } from './W200-booking-widget-helpers';
import {
  createManageBooking,
  createManageService,
  createManageStaff,
  fetchManageSlots,
  manageFutureWeekdayDate,
  parseManagePatchResponse,
  saveManageAvailability,
  toLocalInputValue,
} from './W206-booking-customer-manage-helpers';

type FixtureState = {
  staffId: string | null;
  serviceId: string | null;
  bookingId: string | null;
};

function blocker(summary: string, detail?: string): CheckpointFinding {
  return detail ? { severity: 'blocker', summary, detail } : { severity: 'blocker', summary };
}

function firstUpcomingSlotWithinHours(slots: readonly { readonly startAt: string }[], maxHours: number): string | null {
  const now = Date.now();
  const slot = slots.find((item) => {
    const hours = (Date.parse(item.startAt) - now) / (1000 * 60 * 60);
    return hours > 0.1 && hours < maxHours;
  });
  return slot?.startAt ?? null;
}

function seoulDateOffset(days: number): string {
  const date = new Date(Date.now() + days * 24 * 60 * 60 * 1000);
  return new Intl.DateTimeFormat('sv-SE', {
    timeZone: 'Asia/Seoul',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(date);
}

async function expectPatchBooking(responsePromise: Promise<Response>) {
  const response = await responsePromise;
  expect(response.status()).toBe(200);
  const booking = await parseManagePatchResponse(response);
  expect(booking).not.toBeNull();
  return booking;
}

export const checkpoint: CheckpointDefinition = {
  id: 'W206',
  title: 'Customer booking manage link reschedule and cancellation',
  verification: 'Signed customer manage link에서 정책 표시, 일정 변경, 취소, 정책 차단, token 없는 direct cancel 거부를 검증',
  async run({ page, baseUrl, recordEvidence }) {
    const findings: CheckpointFinding[] = [];
    const token = Date.now().toString(36);
    const headers = bookingHeaders(`w206-${token}`);
    const standard: FixtureState = { staffId: null, serviceId: null, bookingId: null };
    const strict: FixtureState = { staffId: null, serviceId: null, bookingId: null };

    try {
      await page.setExtraHTTPHeaders(headers);

      const staffId = await createManageStaff({ page, headers, token });
      if (!staffId) {
        findings.push(blocker('W206 담당자 fixture를 생성하지 못했습니다.'));
        return { findings };
      }
      standard.staffId = staffId;

      const standardServiceId = await createManageService({ page, headers, token, staffId, label: 'standard', policyId: 'standard-24h' });
      if (!standardServiceId) {
        findings.push(blocker('W206 standard 서비스 fixture를 생성하지 못했습니다.'));
        return { findings };
      }
      standard.serviceId = standardServiceId;

      if (!(await saveManageAvailability({ page, headers, token, staffId, start: '09:00', end: '16:00' }))) {
        findings.push(blocker('W206 담당자 availability fixture를 저장하지 못했습니다.'));
        return { findings };
      }

      const date = manageFutureWeekdayDate(10);
      const slots = await fetchManageSlots(page, headers, standardServiceId, staffId, date);
      if (slots.length < 4) {
        findings.push(blocker('W206 일정 변경 검증에 필요한 공개 슬롯을 충분히 찾지 못했습니다.'));
        return { findings };
      }

      const booking = await createManageBooking({ page, headers, token, staffId, serviceId: standardServiceId, startAt: slots[0].startAt, label: 'standard', policyId: 'standard-24h' });
      if (!booking) {
        findings.push(blocker('W206 standard 예약 fixture를 생성하지 못했습니다.'));
        return { findings };
      }
      standard.bookingId = booking.bookingId;
      const manageToken = createBookingManageToken(booking);

      await page.goto(new URL(`/ko/bookings/manage/${encodeURIComponent(manageToken)}?w206=${token}`, baseUrl).toString(), { waitUntil: 'domcontentloaded' });
      await expect(page.locator('[data-booking-manage="true"]')).toBeVisible({ timeout: 15_000 });
      await expect(page.getByText(`W206 standard 상담 ${token}`)).toBeVisible();
      await expect(page.getByText(`W206 standard 고객 ${token}`)).toBeVisible();
      await expect(page.locator('[data-booking-status="confirmed"]')).toBeVisible();
      await expect(page.locator('[data-booking-policy-reschedule="allowed"]')).toBeVisible();
      await expect(page.locator('[data-booking-policy-cancel="allowed"]')).toBeVisible();
      await recordEvidence('W206 signed manage link opens active booking with policy controls', page);

      const rescheduleResponse = page.waitForResponse((response) =>
        response.url().includes('/api/booking/manage/') && response.request().method() === 'PATCH',
      );
      await page.getByLabel('새 시작 시간').fill(toLocalInputValue(slots[3].startAt));
      await page.getByRole('button', { name: '새 시간 저장', exact: true }).click();
      const rescheduled = await expectPatchBooking(rescheduleResponse);
      expect(rescheduled?.startAt).toBe(slots[3].startAt);
      expect(rescheduled?.staffId).toBe(staffId);
      await expect(page.getByText('예약 시간이 변경되었습니다.')).toBeVisible();

      const cancelResponse = page.waitForResponse((response) =>
        response.url().includes('/api/booking/manage/') && response.request().method() === 'PATCH',
      );
      await page.getByLabel('사유').fill(`W206 고객 링크 취소 ${token}`);
      await page.getByRole('button', { name: '예약 취소', exact: true }).click();
      const cancelled = await expectPatchBooking(cancelResponse);
      expect(cancelled?.status).toBe('cancelled');
      expect(cancelled?.cancellationReason).toContain('W206 고객 링크 취소');
      await expect(page.locator('[data-booking-status="cancelled"]')).toBeVisible();
      await recordEvidence('W206 customer link reschedules and cancels booking', page);

      const strictServiceId = await createManageService({ page, headers, token, staffId, label: 'strict', policyId: 'strict-48h' });
      if (!strictServiceId) {
        findings.push(blocker('W206 strict 서비스 fixture를 생성하지 못했습니다.'));
        return { findings };
      }
      strict.staffId = staffId;
      strict.serviceId = strictServiceId;

      if (!(await saveManageAvailability({ page, headers, token, staffId, start: '00:00', end: '23:30' }))) {
        findings.push(blocker('W206 strict availability fixture를 저장하지 못했습니다.'));
        return { findings };
      }
      let blockedStartAt: string | null = null;
      for (const offset of [0, 1]) {
        const strictSlots = await fetchManageSlots(page, headers, strictServiceId, staffId, seoulDateOffset(offset));
        blockedStartAt = firstUpcomingSlotWithinHours(strictSlots, 6);
        if (blockedStartAt) break;
      }
      if (!blockedStartAt) {
        findings.push(blocker('W206 strict policy 차단 검증에 필요한 6시간 이내 슬롯을 찾지 못했습니다.'));
        return { findings };
      }
      const blockedBooking = await createManageBooking({ page, headers, token, staffId, serviceId: strictServiceId, startAt: blockedStartAt, label: 'strict', policyId: 'strict-48h' });
      if (!blockedBooking) {
        findings.push(blocker('W206 strict 예약 fixture를 생성하지 못했습니다.'));
        return { findings };
      }
      strict.bookingId = blockedBooking.bookingId;
      const blockedToken = createBookingManageToken(blockedBooking);

      await page.goto(new URL(`/ko/bookings/manage/${encodeURIComponent(blockedToken)}?w206=${token}-strict`, baseUrl).toString(), { waitUntil: 'domcontentloaded' });
      await expect(page.locator('[data-booking-policy-reschedule="blocked"]')).toBeVisible();
      await expect(page.locator('[data-booking-policy-cancel="blocked"]')).toBeVisible();
      await expect(page.locator('[data-booking-manage-reschedule="disabled"]')).toBeDisabled();
      await expect(page.locator('[data-booking-manage-cancel="disabled"]')).toBeDisabled();

      const blockedResponse = await page.request.patch(`/api/booking/manage/${encodeURIComponent(blockedToken)}`, {
        headers,
        data: { action: 'reschedule', startAt: new Date(Date.now() + 3 * 60 * 60 * 1000).toISOString() },
        failOnStatusCode: false,
      });
      expect(blockedResponse.status()).toBe(409);

      const unauthedCancelResponse = await page.request.post('/api/booking/cancel', {
        headers,
        data: { bookingId: blockedBooking.bookingId, reason: 'missing manage token' },
        failOnStatusCode: false,
      });
      expect(unauthedCancelResponse.status()).toBe(401);
      await recordEvidence('W206 strict policy blocks customer self-service changes', page);
    } catch (error) {
      const detail = error instanceof Error ? error.message : String(error);
      findings.push(blocker('W206 customer manage link 검증 중 예외가 발생했습니다.', detail));
    } finally {
      await cleanupFiles({ staffId: null, serviceId: strict.serviceId, bookingId: strict.bookingId, pageId: null });
      await cleanupFiles({ staffId: standard.staffId, serviceId: standard.serviceId, bookingId: standard.bookingId, pageId: null });
      await page.setExtraHTTPHeaders({});
    }

    return { findings };
  },
};

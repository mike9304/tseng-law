import { expect, type Locator, type Page } from '@playwright/test';

import type { CheckpointDefinition, CheckpointFinding } from '../types';
import { cleanupFiles } from './W200-booking-widget-cleanup';
import { bookingHeaders, saveAvailability } from './W200-booking-widget-helpers';
import {
  createStatusBooking,
  createStatusService,
  createStatusStaff,
  fetchFirstStatusSlot,
  readPatchedStatus,
  statusWeekdayDate,
  type StatusBookingRecord,
  type StatusTransition,
} from './W209-booking-status-helpers';

type FixtureState = {
  staffId: string | null;
  serviceId: string | null;
  bookingId: string | null;
};

type TransitionRequest = {
  readonly page: Page;
  readonly modal: Locator;
  readonly bookingId: string;
  readonly status: StatusTransition;
  readonly label: string;
};

const statusLabels: Record<StatusTransition, string> = {
  confirmed: '확정',
  completed: '완료',
  'no-show': '노쇼',
  cancelled: '취소됨',
};

function blocker(summary: string, detail?: string): CheckpointFinding {
  return detail ? { severity: 'blocker', summary, detail } : { severity: 'blocker', summary };
}

async function expectStatus(page: Page, modal: Locator, bookingId: string, status: StatusTransition | 'pending'): Promise<void> {
  await expect(modal.locator(`[data-booking-status="${status}"]`)).toBeVisible();
  await expect(page.locator(`[data-booking-row="${bookingId}"] [data-booking-status="${status}"]`)).toBeVisible();
}

async function applyTransition(request: TransitionRequest): Promise<void> {
  const responsePromise = request.page.waitForResponse((response) =>
    response.url().includes(`/api/builder/bookings/${request.bookingId}`) && response.request().method() === 'PATCH',
    { timeout: 45_000 },
  );
  await request.modal.getByRole('button', { name: request.label, exact: true }).click();
  const patchedStatus = await readPatchedStatus(await responsePromise);
  expect(patchedStatus).toBe(request.status);
  await expectStatus(request.page, request.modal, request.bookingId, request.status);
  const timeline = request.modal.locator('[data-booking-timeline="true"]');
  await expect(timeline).toContainText('현재 상태');
  await expect(timeline).toContainText(request.label);
}

async function openStatusModal(page: Page, booking: StatusBookingRecord): Promise<Locator> {
  await page.locator(`[data-booking-row="${booking.bookingId}"]`).click();
  const closeButton = page.locator(`[data-booking-detail-close="${booking.bookingId}"]`);
  await expect(closeButton).toBeVisible();
  return closeButton.locator('xpath=../..');
}

export const checkpoint: CheckpointDefinition = {
  id: 'W209',
  title: 'Booking status transitions and timeline',
  verification: '관리자 booking dashboard 상세 모달에서 확정/완료/노쇼/취소 상태 전이와 타임라인 current status/cancelled marker를 검증',
  async run({ page, baseUrl, recordEvidence }) {
    const findings: CheckpointFinding[] = [];
    const token = Date.now().toString(36);
    const headers = bookingHeaders(`w209-${token}`);
    const target: FixtureState = { staffId: null, serviceId: null, bookingId: null };

    try {
      await page.setExtraHTTPHeaders(headers);

      const staffId = await createStatusStaff({ page, headers, token });
      if (!staffId) {
        findings.push(blocker('W209 담당자 fixture를 생성하지 못했습니다.'));
        return { findings };
      }
      target.staffId = staffId;

      const serviceId = await createStatusService({ page, headers, token, staffId });
      if (!serviceId) {
        findings.push(blocker('W209 서비스 fixture를 생성하지 못했습니다.'));
        return { findings };
      }
      target.serviceId = serviceId;

      if (!(await saveAvailability({ page, headers, token, staffId }))) {
        findings.push(blocker('W209 담당자 availability fixture를 저장하지 못했습니다.'));
        return { findings };
      }

      const targetDate = statusWeekdayDate(12);
      const startAt = await fetchFirstStatusSlot({ page, headers, serviceId, staffId, date: targetDate });
      if (!startAt) {
        findings.push(blocker('W209 예약 생성에 필요한 공개 슬롯을 찾지 못했습니다.'));
        return { findings };
      }

      const booking = await createStatusBooking({ page, headers, token, staffId, serviceId, startAt });
      if (!booking) {
        findings.push(blocker('W209 관리자 예약 fixture를 생성하지 못했습니다.'));
        return { findings };
      }
      target.bookingId = booking.bookingId;

      await page.goto(new URL(`/ko/admin-builder/bookings/dashboard?w209=${token}`, baseUrl).toString(), { waitUntil: 'domcontentloaded' });
      await expect(page.locator('[data-booking-dashboard="true"]').first()).toBeVisible({ timeout: 15_000 });
      await expectStatus(page, page.locator('body'), booking.bookingId, 'pending');

      const modal = await openStatusModal(page, booking);
      await expect(modal.getByRole('heading', { name: booking.customerName, exact: true })).toBeVisible();
      await expect(modal.locator('[data-booking-timeline="true"]')).toBeVisible();
      await expect(modal.locator(`[data-customer-history-item="${booking.bookingId}"]`)).toBeVisible();
      await expect(modal.locator('[data-booking-timeline="true"]')).toContainText('현재 상태');
      await expect(modal.locator('[data-booking-timeline="true"]')).toContainText('대기');
      await recordEvidence('W209 booking detail opens pending status timeline', page);

      for (const status of ['confirmed', 'completed', 'no-show', 'cancelled'] as const) {
        await applyTransition({ page, modal, bookingId: booking.bookingId, status, label: statusLabels[status] });
      }

      await expect(modal.locator('[data-booking-timeline="true"]')).toContainText('취소됨');
      await expect(modal.locator('[data-booking-timeline="true"]')).toContainText('취소');
      await recordEvidence('W209 dashboard status actions update current status and cancellation timeline', page);
    } catch (error) {
      const detail = error instanceof Error ? error.message : String(error);
      findings.push(blocker('W209 booking 상태 전이 검증 중 예외가 발생했습니다.', detail));
    } finally {
      await cleanupFiles({ staffId: target.staffId, serviceId: target.serviceId, bookingId: target.bookingId, pageId: null });
    }

    return { findings };
  },
};

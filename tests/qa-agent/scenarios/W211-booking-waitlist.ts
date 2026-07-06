import { expect } from '@playwright/test';

import { getBookingFlowCopy } from '@/lib/builder/bookings/bookings-copy';
import type { CheckpointDefinition, CheckpointFinding } from '../types';
import { cleanupFiles } from './W200-booking-widget-cleanup';
import {
  bookingHeaders,
  createBuilderPage,
  deleteBuilderPage,
  publishBookingPage,
  saveAvailability,
} from './W200-booking-widget-helpers';
import {
  cleanupWaitlistEntry,
  createWaitlistService,
  createWaitlistStaff,
  nextWaitlistDate,
  parseWaitlistJoinResponse,
  parseWaitlistPromoteResponse,
  saveClosedDateAvailability,
  waitlistWidgetDocument,
} from './W211-booking-waitlist-helpers';

type FixtureState = {
  staffId: string | null;
  serviceId: string | null;
  pageId: string | null;
  waitlistId: string | null;
  bookingId: string | null;
};

function blocker(summary: string, detail?: string): CheckpointFinding {
  return detail ? { severity: 'blocker', summary, detail } : { severity: 'blocker', summary };
}

export const checkpoint: CheckpointDefinition = {
  id: 'W211',
  title: 'Booking waitlist join and promote flow',
  verification: '공개 booking-widget에서 slot 없음 대기 등록 후 관리자 dashboard에서 waitlist row를 예약으로 승격하는 흐름 검증',
  async run({ page, baseUrl, recordEvidence }) {
    const findings: CheckpointFinding[] = [];
    const token = Date.now().toString(36);
    const slug = `w211-booking-waitlist-${token}`;
    const headers = bookingHeaders(`w211-${token}`);
    const copy = getBookingFlowCopy('ko');
    const targetDate = nextWaitlistDate();
    const state: FixtureState = { staffId: null, serviceId: null, pageId: null, waitlistId: null, bookingId: null };

    try {
      await page.setExtraHTTPHeaders(headers);

      state.staffId = await createWaitlistStaff({ page, headers, token });
      if (!state.staffId) {
        findings.push(blocker('W211 담당자 fixture를 생성하지 못했습니다.'));
        return { findings };
      }

      state.serviceId = await createWaitlistService({ page, headers, token, staffId: state.staffId });
      if (!state.serviceId) {
        findings.push(blocker('W211 서비스 fixture를 생성하지 못했습니다.'));
        return { findings };
      }

      if (!(await saveClosedDateAvailability({ page, headers, token, staffId: state.staffId, date: targetDate }))) {
        findings.push(blocker('W211 날짜 예외 availability fixture를 저장하지 못했습니다.'));
        return { findings };
      }

      state.pageId = await createBuilderPage({ page, headers, token }, slug);
      if (!state.pageId) {
        findings.push(blocker('W211 disposable 공개 페이지를 생성하지 못했습니다.'));
        return { findings };
      }

      const document = waitlistWidgetDocument(token, state.serviceId, state.staffId);
      if (!(await publishBookingPage({ page, headers, pageId: state.pageId, document }))) {
        findings.push(blocker('W211 booking-widget 페이지 초안 저장 또는 발행에 실패했습니다.'));
        return { findings };
      }

      await page.goto(new URL(`/ko/${slug}?w211=${token}`, baseUrl).toString(), { waitUntil: 'domcontentloaded' });
      const flow = page.locator('[data-booking-flow="true"]').first();
      await expect(flow).toBeVisible({ timeout: 15_000 });
      await expect(flow.locator(`[data-booking-service-id="${state.serviceId}"]`)).toHaveAttribute('data-active', 'true');
      await flow.getByRole('button', { name: copy.labels.continue }).click();
      await expect(flow.locator(`[data-booking-staff-id="${state.staffId}"]`)).toHaveAttribute('data-active', 'true');
      await flow.getByRole('button', { name: copy.labels.continue }).click();
      const availabilityResponsePromise = page.waitForResponse((response) =>
        response.url().includes('/api/booking/availability') &&
        response.url().includes(`serviceId=${state.serviceId}`) &&
        response.url().includes(`staffId=${state.staffId}`) &&
        response.url().includes(`date=${targetDate}`),
        { timeout: 30_000 },
      );
      await flow.getByLabel(copy.labels.date).fill(targetDate);
      expect((await availabilityResponsePromise).ok()).toBe(true);
      await expect(flow.locator('[data-booking-slot-start]')).toHaveCount(0);
      await expect(flow.locator('[data-booking-waitlist="true"]')).toBeVisible();

      await flow.getByLabel(copy.labels.name, { exact: true }).fill(`W211 대기 고객 ${token}`);
      await flow.getByLabel(copy.labels.email).fill(`w211-waitlist-${token}@example.com`);
      await flow.getByLabel(copy.labels.phone).fill('+82-10-2111-0000');
      await flow.getByLabel(copy.labels.notes).fill('W211 slot 없음 대기 등록 검증');
      await flow.locator('[data-booking-waitlist="true"] input[type="checkbox"]').check();

      const waitlistResponsePromise = page.waitForResponse((response) =>
        response.url().includes('/api/booking/waitlist') && response.request().method() === 'POST',
        { timeout: 30_000 },
      );
      await flow.getByRole('button', { name: copy.labels.joinWaitlist }).click();
      const waitlist = await parseWaitlistJoinResponse(await waitlistResponsePromise);
      if (!waitlist) {
        findings.push(blocker('W211 waitlist 등록 응답을 파싱하지 못했습니다.'));
        return { findings };
      }
      state.waitlistId = waitlist.waitlistId;
      await expect(flow.locator('[data-booking-waitlist-confirmed="true"]')).toBeVisible();
      await recordEvidence('W211 public widget joins waitlist when no slots exist', page);

      if (!(await saveAvailability({ page, headers, token, staffId: state.staffId }))) {
        findings.push(blocker('W211 승격용 availability fixture를 열지 못했습니다.'));
        return { findings };
      }

      await page.goto(new URL(`/ko/admin-builder/bookings/dashboard?w211=${token}`, baseUrl).toString(), { waitUntil: 'domcontentloaded' });
      await expect(page.locator('[data-booking-waitlist-admin="true"]')).toBeVisible({ timeout: 15_000 });
      const row = page.locator(`[data-waitlist-row="${state.waitlistId}"]`);
      await expect(row).toBeVisible();
      await expect(row).toContainText(`w211-waitlist-${token}@example.com`);

      const promoteResponsePromise = page.waitForResponse((response) =>
        response.url().includes(`/api/builder/bookings/waitlist/${state.waitlistId}/promote`) && response.request().method() === 'POST',
        { timeout: 45_000 },
      );
      await row.getByRole('button', { name: '승격' }).click();
      const promoted = await parseWaitlistPromoteResponse(await promoteResponsePromise);
      if (!promoted) {
        findings.push(blocker('W211 waitlist 승격 응답을 파싱하지 못했습니다.'));
        return { findings };
      }
      state.bookingId = promoted.bookingId;
      if (promoted.waitlistStatus !== 'promoted' || promoted.promotedBookingId !== promoted.bookingId) {
        findings.push(blocker('W211 waitlist 승격 응답이 promoted booking과 일치하지 않습니다.'));
        return { findings };
      }
      await expect(row).toContainText('승격됨');
      await expect(page.locator(`[data-booking-row="${promoted.bookingId}"]`)).toBeVisible();
      await recordEvidence('W211 admin dashboard promotes waitlist to booking', page);
    } catch (error) {
      const detail = error instanceof Error ? error.message : String(error);
      findings.push(blocker('W211 booking waitlist 검증 중 예외가 발생했습니다.', detail));
    } finally {
      if (state.pageId) {
        await deleteBuilderPage({ page, headers, pageId: state.pageId });
      }
      await cleanupFiles({ staffId: state.staffId, serviceId: state.serviceId, bookingId: state.bookingId, pageId: state.pageId });
      await cleanupWaitlistEntry(state.waitlistId);
    }

    return { findings };
  },
};

import { expect } from '@playwright/test';

import type { CheckpointDefinition, CheckpointFinding } from '../types';
import { cleanupFiles } from './W200-booking-widget-cleanup';
import {
  bookingHeaders,
  createBuilderPage,
  deleteBuilderPage,
  publishBookingPage,
} from './W200-booking-widget-helpers';
import { bookingTimezoneDocument } from './W201-booking-timezone-document';
import {
  createTimezoneService,
  createTimezoneStaff,
  customerTimezone,
  expectedOfficeStartAt,
  officeTimezone,
  parseTimezoneBookingResponse,
  readStoredBooking,
  saveTaipeiAvailability,
} from './W201-booking-timezone-helpers';

const forceCustomerTimezoneScript = `
(() => {
  const originalResolvedOptions = Intl.DateTimeFormat.prototype.resolvedOptions;
  Intl.DateTimeFormat.prototype.resolvedOptions = function resolvedOptions() {
    return { ...originalResolvedOptions.call(this), timeZone: 'Asia/Seoul' };
  };
})();
`;

function blocker(summary: string, detail?: string): CheckpointFinding {
  return detail ? { severity: 'blocker', summary, detail } : { severity: 'blocker', summary };
}

export const checkpoint: CheckpointDefinition = {
  id: 'W201',
  title: 'Public booking widget customer and office timezone handling',
  verification: '공개 예약 위젯에서 고객 Asia/Seoul 시간과 오피스 Asia/Taipei 시간이 함께 표시되고 UTC startAt/customerTimezone 저장까지 확인',
  async run({ page, recordEvidence }) {
    const findings: CheckpointFinding[] = [];
    const token = Date.now().toString(36);
    const slug = `w201-booking-timezone-${token}`;
    const headers = bookingHeaders(`w201-${token}`);
    let staffId: string | null = null;
    let serviceId: string | null = null;
    let pageId: string | null = null;
    let bookingId: string | null = null;

    try {
      await page.setExtraHTTPHeaders(headers);
      await page.addInitScript(forceCustomerTimezoneScript);

      staffId = await createTimezoneStaff({ page, headers, token });
      if (!staffId) {
        findings.push(blocker('W201 담당자 fixture를 생성하지 못했습니다.'));
        return { findings };
      }
      serviceId = await createTimezoneService({ page, headers, token, staffId });
      if (!serviceId) {
        findings.push(blocker('W201 무료 서비스 fixture를 생성하지 못했습니다.'));
        return { findings };
      }
      if (!(await saveTaipeiAvailability({ page, headers, token, staffId }))) {
        findings.push(blocker('W201 담당자 availability를 Asia/Taipei로 저장하지 못했습니다.'));
        return { findings };
      }
      pageId = await createBuilderPage({ page, headers, token }, slug);
      if (!pageId) {
        findings.push(blocker('W201 disposable 공개 페이지를 생성하지 못했습니다.'));
        return { findings };
      }
      if (!(await publishBookingPage({ page, headers, pageId, document: bookingTimezoneDocument(token, serviceId, staffId) }))) {
        findings.push(blocker('W201 booking-widget 페이지 초안 저장 또는 발행에 실패했습니다.'));
        return { findings };
      }

      await page.goto(`/ko/${slug}?w201=${token}`, { waitUntil: 'domcontentloaded' });
      const flow = page.locator('[data-booking-flow="true"]').first();
      await expect(flow).toBeVisible({ timeout: 15_000 });
      await expect(flow.locator(`[data-booking-service-id="${serviceId}"]`)).toHaveAttribute('data-active', 'true');
      await flow.getByRole('button', { name: '계속' }).click();

      await expect(flow.locator(`[data-booking-staff-id="${staffId}"]`)).toHaveAttribute('data-active', 'true');
      await flow.getByRole('button', { name: '계속' }).click();

      const timezoneLabel = flow.locator('[data-booking-customer-timezone="true"]');
      await expect(timezoneLabel).toContainText(customerTimezone);
      const bookingDate = await flow.locator('input[type="date"]').inputValue();
      const expectedStartAt = expectedOfficeStartAt(bookingDate);
      const slotButton = flow.locator(`[data-booking-slot-start="${expectedStartAt}"]`);
      await expect(slotButton).toBeVisible({ timeout: 15_000 });
      const customerTime = await slotButton.locator('[data-booking-slot-customer-time="true"]').innerText();
      const officeTime = await slotButton.locator('[data-booking-slot-office-time="true"]').innerText();
      if (!customerTime.trim() || !officeTime.includes(officeTimezone) || customerTime === officeTime) {
        findings.push(blocker('공개 widget 슬롯에서 고객 시간과 오피스 시간이 분리 표시되지 않았습니다.'));
        return { findings };
      }
      await slotButton.click();
      await flow.getByRole('button', { name: '계속' }).click();
      await recordEvidence('W201 public widget shows Seoul customer time and Taipei office time', page);

      await flow.getByLabel('이름', { exact: true }).fill(`W201 고객 ${token}`);
      await flow.getByLabel('이메일').fill(`w201-customer-${token}@example.com`);
      await flow.getByLabel('전화').fill('+82-10-2010-0000');
      await flow.getByLabel('메모').fill('W201 타임존 검증 메모');
      await flow.locator('input[type="checkbox"]').check();
      const bookResponsePromise = page.waitForResponse((response) =>
        response.url().includes('/api/booking/book') && response.request().method() === 'POST',
        { timeout: 30_000 },
      );
      await flow.getByRole('button', { name: '예약 확정' }).click();
      const booking = await parseTimezoneBookingResponse(await bookResponsePromise);
      if (!booking) {
        findings.push(blocker('W201 공개 예약 생성 응답을 파싱하지 못했습니다.'));
        return { findings };
      }
      bookingId = booking.bookingId;
      if (
        booking.serviceId !== serviceId ||
        booking.staffId !== staffId ||
        booking.startAt !== expectedStartAt ||
        booking.customerTimezone !== customerTimezone
      ) {
        findings.push(blocker('W201 예약 응답이 service/staff/UTC startAt/customerTimezone과 일치하지 않습니다.'));
        return { findings };
      }
      const stored = await readStoredBooking(bookingId);
      if (!stored || stored.startAt !== expectedStartAt || stored.customerTimezone !== customerTimezone) {
        findings.push(blocker('W201 booking storage가 UTC startAt/customerTimezone을 보존하지 않았습니다.'));
        return { findings };
      }
      await expect(flow.getByText(`W201 예약 완료 ${token}`)).toBeVisible();
      await expect(flow.locator('[data-booking-confirmed-timezone="true"]')).toContainText(customerTimezone);
      await recordEvidence('W201 booking stores UTC slot and customer timezone after confirmation', page);
    } catch (error) {
      const detail = error instanceof Error ? error.message : String(error);
      findings.push(blocker(`W201 타임존 검증 중 예외가 발생했습니다: ${detail}`));
    } finally {
      if (pageId) {
        await deleteBuilderPage({ page, headers, pageId });
      }
      await cleanupFiles({ staffId, serviceId, bookingId, pageId });
    }

    return { findings };
  },
};

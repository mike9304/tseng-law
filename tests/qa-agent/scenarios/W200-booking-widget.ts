import { expect } from '@playwright/test';

import type { CheckpointDefinition, CheckpointFinding } from '../types';
import { cleanupFiles } from './W200-booking-widget-cleanup';
import { bookingWidgetDocument } from './W200-booking-widget-document';
import {
  bookingHeaders,
  createBuilderPage,
  createService,
  createStaff,
  deleteBuilderPage,
  parsePublicBookingResponse,
  publishBookingPage,
  saveAvailability,
} from './W200-booking-widget-helpers';

function blocker(summary: string, detail?: string): CheckpointFinding {
  return detail ? { severity: 'blocker', summary, detail } : { severity: 'blocker', summary };
}

export const checkpoint: CheckpointDefinition = {
  id: 'W200',
  title: 'Public booking widget service staff slot flow',
  verification: '공개 booking-widget에서 Service → Staff → 날짜/시간 → 고객 정보 입력 → 실제 예약 생성까지 완주',
  async run({ page, recordEvidence }) {
    const findings: CheckpointFinding[] = [];
    const token = Date.now().toString(36);
    const slug = `w200-booking-widget-${token}`;
    const headers = bookingHeaders(`w200-${token}`);
    let staffId: string | null = null;
    let serviceId: string | null = null;
    let pageId: string | null = null;
    let bookingId: string | null = null;

    try {
      await page.setExtraHTTPHeaders(headers);

      staffId = await createStaff({ page, headers, token });
      if (!staffId) {
        findings.push(blocker('W200 담당자 fixture를 생성하지 못했습니다.'));
        return { findings };
      }
      serviceId = await createService({ page, headers, token, staffId });
      if (!serviceId) {
        findings.push(blocker('W200 무료 서비스 fixture를 생성하지 못했습니다.'));
        return { findings };
      }
      if (!(await saveAvailability({ page, headers, token, staffId }))) {
        findings.push(blocker('W200 담당자 availability fixture를 저장하지 못했습니다.'));
        return { findings };
      }
      pageId = await createBuilderPage({ page, headers, token }, slug);
      if (!pageId) {
        findings.push(blocker('W200 disposable 공개 페이지를 생성하지 못했습니다.'));
        return { findings };
      }
      const document = bookingWidgetDocument(token, serviceId, staffId);
      if (!(await publishBookingPage({ page, headers, pageId, document }))) {
        findings.push(blocker('W200 booking-widget 페이지 초안 저장 또는 발행에 실패했습니다.'));
        return { findings };
      }

      await page.goto(`/ko/${slug}?w200=${token}`, { waitUntil: 'domcontentloaded' });
      const flow = page.locator('[data-booking-flow="true"]').first();
      await expect(flow).toBeVisible({ timeout: 15_000 });
      await expect(flow.locator(`[data-booking-service-id="${serviceId}"]`)).toHaveAttribute('data-active', 'true');
      await flow.getByRole('button', { name: '계속' }).click();

      await expect(flow.locator(`[data-booking-staff-id="${staffId}"]`)).toHaveAttribute('data-active', 'true');
      await flow.getByRole('button', { name: '계속' }).click();

      const slotButton = flow.locator('[data-booking-slot-start]').first();
      await expect(slotButton).toBeVisible({ timeout: 15_000 });
      const selectedSlot = await slotButton.getAttribute('data-booking-slot-start');
      if (!selectedSlot) {
        findings.push(blocker('공개 widget에서 선택 가능한 슬롯의 startAt 속성을 찾지 못했습니다.'));
        return { findings };
      }
      await slotButton.click();
      await flow.getByRole('button', { name: '계속' }).click();
      await recordEvidence('W200 public widget reached customer info step after service staff slot selection', page);

      await flow.getByLabel('이름', { exact: true }).fill(`W200 고객 ${token}`);
      await flow.getByLabel('이메일').fill(`w200-customer-${token}@example.com`);
      await flow.getByLabel('전화').fill('+82-10-2000-0000');
      await flow.getByLabel('메모').fill('공개 예약 위젯 W200 검증 메모');
      await flow.locator('input[type="checkbox"]').check();
      const bookResponsePromise = page.waitForResponse((response) =>
        response.url().includes('/api/booking/book') && response.request().method() === 'POST',
        { timeout: 30_000 },
      );
      await flow.getByRole('button', { name: '예약 확정' }).click();
      const booking = await parsePublicBookingResponse(await bookResponsePromise);
      if (!booking) {
        findings.push(blocker('공개 widget 예약 생성 응답을 파싱하지 못했습니다.'));
        return { findings };
      }
      bookingId = booking.bookingId;
      if (
        booking.serviceId !== serviceId ||
        booking.staffId !== staffId ||
        booking.startAt !== selectedSlot ||
        booking.customerLocale !== 'ko' ||
        booking.customerPhone !== '+82-10-2000-0000' ||
        booking.customerNotes !== '공개 예약 위젯 W200 검증 메모'
      ) {
        findings.push(blocker('공개 widget 예약 생성 payload가 선택한 service/staff/slot/customer 정보와 일치하지 않습니다.'));
        return { findings };
      }
      await expect(flow.getByText(`W200 예약 완료 ${token}`)).toBeVisible();
      await recordEvidence('W200 public booking widget created a real booking and showed success', page);
    } catch (error) {
      const detail = error instanceof Error ? error.message : String(error);
      findings.push(blocker(`공개 예약 widget 검증 중 예외가 발생했습니다: ${detail}`));
    } finally {
      if (pageId) {
        await deleteBuilderPage({ page, headers, pageId });
      }
      await cleanupFiles({ staffId, serviceId, bookingId, pageId });
    }

    return { findings };
  },
};

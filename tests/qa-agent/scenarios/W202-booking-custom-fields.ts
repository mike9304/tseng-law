import { expect } from '@playwright/test';

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
  attachmentLinksLabel,
  bookingCustomFieldsDocument,
  caseSummaryLabel,
  customFieldOneLabel,
  customFieldTwoLabel,
} from './W202-booking-custom-fields-document';
import {
  createCustomFieldsService,
  createCustomFieldsStaff,
  parseCustomBookingResponse,
  readStoredCustomBooking,
} from './W202-booking-custom-fields-helpers';

const caseSummaryValue = '계약 분쟁 초기 검토와 증거 정리가 필요합니다.';
const attachmentUrl = 'https://example.com/w202-evidence.pdf';
const customFieldOneValue = '한국어';
const customFieldTwoValue = '테스트 상대방';

function blocker(summary: string, detail?: string): CheckpointFinding {
  return detail ? { severity: 'blocker', summary, detail } : { severity: 'blocker', summary };
}

export const checkpoint: CheckpointDefinition = {
  id: 'W202',
  title: 'Public booking widget custom form fields',
  verification: 'booking-widget 폼에서 사건 개요, 첨부 링크, 커스텀 필드를 구성하고 실제 예약 row에 저장',
  async run({ page, recordEvidence }) {
    const findings: CheckpointFinding[] = [];
    const token = Date.now().toString(36);
    const slug = `w202-booking-custom-fields-${token}`;
    const headers = bookingHeaders(`w202-${token}`);
    let staffId: string | null = null;
    let serviceId: string | null = null;
    let pageId: string | null = null;
    let bookingId: string | null = null;

    try {
      await page.setExtraHTTPHeaders(headers);

      staffId = await createCustomFieldsStaff({ page, headers, token });
      if (!staffId) {
        findings.push(blocker('W202 담당자 fixture를 생성하지 못했습니다.'));
        return { findings };
      }
      serviceId = await createCustomFieldsService({ page, headers, token, staffId });
      if (!serviceId) {
        findings.push(blocker('W202 무료 서비스 fixture를 생성하지 못했습니다.'));
        return { findings };
      }
      if (!(await saveAvailability({ page, headers, token, staffId }))) {
        findings.push(blocker('W202 담당자 availability fixture를 저장하지 못했습니다.'));
        return { findings };
      }
      pageId = await createBuilderPage({ page, headers, token }, slug);
      if (!pageId) {
        findings.push(blocker('W202 disposable 공개 페이지를 생성하지 못했습니다.'));
        return { findings };
      }
      const document = bookingCustomFieldsDocument(token, serviceId, staffId);
      if (!(await publishBookingPage({ page, headers, pageId, document }))) {
        findings.push(blocker('W202 booking-widget 페이지 초안 저장 또는 발행에 실패했습니다.'));
        return { findings };
      }

      await page.goto(`/ko/${slug}?w202=${token}`, { waitUntil: 'domcontentloaded' });
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
        findings.push(blocker('W202 공개 widget에서 선택 가능한 슬롯의 startAt 속성을 찾지 못했습니다.'));
        return { findings };
      }
      await slotButton.click();
      await flow.getByRole('button', { name: '계속' }).click();
      await recordEvidence('W202 custom booking form labels are ready on public widget', page);

      await flow.getByLabel('이름', { exact: true }).fill(`W202 고객 ${token}`);
      await flow.getByLabel('이메일').fill(`w202-customer-${token}@example.com`);
      await flow.getByLabel('전화').fill('+82-10-2020-0000');
      await flow.getByLabel('메모').fill('공개 예약 위젯 W202 커스텀 필드 검증 메모');
      await flow.getByLabel(caseSummaryLabel).fill(caseSummaryValue);
      await flow.getByLabel(attachmentLinksLabel).fill(attachmentUrl);
      await flow.getByLabel(customFieldOneLabel).fill(customFieldOneValue);
      await flow.getByLabel(customFieldTwoLabel).fill(customFieldTwoValue);
      await flow.locator('input[type="checkbox"]').check();

      const bookResponsePromise = page.waitForResponse((response) =>
        response.url().includes('/api/booking/book') && response.request().method() === 'POST',
        { timeout: 30_000 },
      );
      await flow.getByRole('button', { name: '예약 확정' }).click();
      const booking = await parseCustomBookingResponse(await bookResponsePromise);
      if (!booking) {
        findings.push(blocker('W202 예약 생성 응답을 파싱하지 못했습니다.'));
        return { findings };
      }
      bookingId = booking.bookingId;
      const stored = await readStoredCustomBooking(bookingId);
      if (!stored) {
        findings.push(blocker('W202 저장된 예약 row를 읽지 못했습니다.'));
        return { findings };
      }

      const expectedCustomFields = [
        { label: customFieldOneLabel, value: customFieldOneValue },
        { label: customFieldTwoLabel, value: customFieldTwoValue },
      ];
      for (const record of [booking, stored]) {
        if (
          record.serviceId !== serviceId ||
          record.staffId !== staffId ||
          record.startAt !== selectedSlot ||
          record.caseSummary !== caseSummaryValue ||
          record.attachmentUrls?.[0] !== attachmentUrl ||
          JSON.stringify(record.customFields) !== JSON.stringify(expectedCustomFields)
        ) {
          findings.push(blocker('W202 예약 응답 또는 저장 row가 커스텀 폼 입력값과 일치하지 않습니다.'));
          return { findings };
        }
      }
      await expect(flow.getByText(`W202 예약 완료 ${token}`)).toBeVisible();
      await recordEvidence('W202 public booking stored case summary attachments and custom fields', page);
    } catch (error) {
      const detail = error instanceof Error ? error.message : String(error);
      findings.push(blocker(`W202 예약 커스텀 필드 검증 중 예외가 발생했습니다: ${detail}`));
    } finally {
      if (pageId) {
        await deleteBuilderPage({ page, headers, pageId });
      }
      await cleanupFiles({ staffId, serviceId, bookingId, pageId });
    }

    return { findings };
  },
};

import { expect } from '@playwright/test';

import type { CheckpointDefinition, CheckpointFinding } from '../types';
import { cleanupFiles } from './W199-booking-buffer-cleanup';
import {
  bookingHeaders,
  createBooking,
  createService,
  createStaff,
  fetchService,
  fetchSlots,
  firstStepMismatch,
  nextWeekdayDate,
  saveAvailability,
  type SlotRecord,
} from './W199-booking-buffer-helpers';

type ServiceUiTimingRequest = {
  readonly baseUrl: string;
  readonly page: Parameters<CheckpointDefinition['run']>[0]['page'];
  readonly token: string;
  readonly serviceId: string;
};

type BufferProofSlots = {
  readonly farBefore: SlotRecord;
  readonly removedBefore: SlotRecord;
  readonly booked: SlotRecord;
  readonly removedAfter: SlotRecord;
  readonly farAfter: SlotRecord;
};

const serviceEditorSelector = '[data-booking-service-editor="true"]';

function blocker(summary: string, detail?: string): CheckpointFinding {
  return detail ? { severity: 'blocker', summary, detail } : { severity: 'blocker', summary };
}

async function fillByLabel(request: ServiceUiTimingRequest, label: string, value: string): Promise<void> {
  await request.page.locator('label').filter({ hasText: label }).first().locator('input').first().fill(value);
}

async function setServiceTimingThroughUi(request: ServiceUiTimingRequest): Promise<boolean> {
  const url = new URL('/ko/admin-builder/bookings/services', request.baseUrl);
  url.searchParams.set('w199', request.token);
  url.searchParams.set('edit', request.serviceId);
  await request.page.goto(url.toString(), { waitUntil: 'networkidle' });
  const editor = request.page.locator(serviceEditorSelector).first();
  await editor.waitFor({ state: 'visible', timeout: 15_000 });
  await fillByLabel(request, '버퍼 시작 전', '10');
  await fillByLabel(request, '버퍼 종료 후', '20');
  await fillByLabel(request, '예약 간격', '15');
  const saveResponse = request.page.waitForResponse((response) =>
    response.url().includes(`/api/builder/bookings/services/${request.serviceId}`) &&
    response.request().method() === 'PATCH',
  );
  await request.page.getByRole('button', { name: '서비스 저장' }).click();
  expect((await saveResponse).status()).toBe(200);
  return editor.waitFor({ state: 'detached', timeout: 12_000 }).then(
    () => true,
    () => false,
  );
}

function proofSlots(slots: readonly SlotRecord[]): BufferProofSlots | null {
  const farBefore = slots[0];
  const removedBefore = slots[2];
  const booked = slots[4];
  const removedAfter = slots[6];
  const farAfter = slots[7];
  if (!farBefore || !removedBefore || !booked || !removedAfter || !farAfter) {
    return null;
  }
  return { farBefore, removedBefore, booked, removedAfter, farAfter };
}

function verifyBufferResult(slots: BufferProofSlots, afterBookingSlots: readonly SlotRecord[]): CheckpointFinding | null {
  const remainingStarts = new Set(afterBookingSlots.map((slot) => slot.startAt));
  const removed = [slots.removedBefore.startAt, slots.booked.startAt, slots.removedAfter.startAt];
  const available = [slots.farBefore.startAt, slots.farAfter.startAt];
  const stillVisibleRemoved = removed.filter((startAt) => remainingStarts.has(startAt));
  if (stillVisibleRemoved.length > 0) {
    return blocker('예약 또는 버퍼 안쪽 슬롯이 공개 가용성에서 제거되지 않았습니다.', stillVisibleRemoved.join(', '));
  }
  const missingAvailable = available.filter((startAt) => !remainingStarts.has(startAt));
  if (missingAvailable.length > 0) {
    return blocker('버퍼 밖 슬롯까지 공개 가용성에서 사라졌습니다.', missingAvailable.join(', '));
  }
  return null;
}

export const checkpoint: CheckpointDefinition = {
  id: 'W199',
  title: 'Buffer time and minimum booking interval',
  verification: 'Admin Bookings 서비스 UI에서 예약 전/후 버퍼와 최소 예약 간격을 저장하고 공개 슬롯 계산 및 실제 예약 후 버퍼 차단까지 확인',
  async run({ page, baseUrl, recordEvidence }) {
    const findings: CheckpointFinding[] = [];
    const token = Date.now().toString(36);
    const headers = bookingHeaders(`w199-${token}`);
    const targetDate = nextWeekdayDate();
    let staffId: string | null = null;
    let serviceId: string | null = null;
    let bookingId: string | null = null;

    try {
      await page.setExtraHTTPHeaders(headers);
      staffId = await createStaff({ page, headers, token });
      if (!staffId) {
        findings.push(blocker('W199 담당자 fixture를 생성하지 못했습니다.'));
        return { findings };
      }
      serviceId = await createService({ page, headers, token, staffId });
      if (!serviceId) {
        findings.push(blocker('W199 서비스 fixture를 생성하지 못했습니다.'));
        return { findings };
      }
      if (!(await saveAvailability({ page, headers, token, staffId }))) {
        findings.push(blocker('W199 담당자 주간 가용성 fixture를 저장하지 못했습니다.'));
        return { findings };
      }

      if (!(await setServiceTimingThroughUi({ baseUrl, page, token, serviceId }))) {
        findings.push(blocker('서비스 UI에서 버퍼/예약 간격 저장 후 편집 모달이 닫히지 않았습니다.'));
        return { findings };
      }
      const service = await fetchService(page, serviceId, headers);
      if (
        service?.bufferBeforeMinutes !== 10 ||
        service.bufferAfterMinutes !== 20 ||
        service.slotStepMinutes !== 15 ||
        !service.staffIds.includes(staffId)
      ) {
        findings.push(blocker('서비스 UI 저장 후 버퍼/예약 간격/staffIds API 저장값을 확인하지 못했습니다.'));
        return { findings };
      }
      await recordEvidence('W199 service buffer and interval saved through Korean admin UI', page);

      const initialSlots = await fetchSlots({ page, headers, serviceId, staffId, date: targetDate });
      if (initialSlots.length < 8) {
        findings.push(blocker('버퍼 검증에 필요한 공개 예약 슬롯 수가 부족합니다.', `slots=${initialSlots.length}`));
        return { findings };
      }
      const stepMismatch = firstStepMismatch(initialSlots, 15);
      if (stepMismatch) {
        findings.push(blocker('공개 예약 슬롯이 서비스의 15분 예약 간격을 따르지 않았습니다.', stepMismatch));
        return { findings };
      }
      const slotsForProof = proofSlots(initialSlots);
      if (!slotsForProof) {
        findings.push(blocker('버퍼 전후 슬롯 비교 대상을 구성하지 못했습니다.'));
        return { findings };
      }

      bookingId = await createBooking({
        page,
        headers,
        serviceId,
        staffId,
        date: targetDate,
        startAt: slotsForProof.booked.startAt,
        token,
      });
      if (!bookingId) {
        findings.push(blocker('실제 admin 예약 생성 API/storage 경로로 예약을 만들지 못했습니다.'));
        return { findings };
      }

      const afterBookingSlots = await fetchSlots({ page, headers, serviceId, staffId, date: targetDate });
      const bufferFinding = verifyBufferResult(slotsForProof, afterBookingSlots);
      if (bufferFinding) {
        findings.push(bufferFinding);
        return { findings };
      }
      await recordEvidence('W199 public availability respects service buffers after real booking creation', page);
    } catch (error) {
      const detail = error instanceof Error ? error.message : String(error);
      findings.push(blocker(`버퍼/예약 간격 검증 중 예외가 발생했습니다: ${detail}`));
    } finally {
      await cleanupFiles({ staffId, serviceId, bookingId });
    }

    return { findings };
  },
};

import { expect } from '@playwright/test';

import type { CheckpointDefinition, CheckpointFinding } from '../types';
import {
  cleanupFiles,
  createService,
  createStaff,
  dayForDate,
  dayLabel,
  fetchAvailability,
  fetchSlots,
  headersFor,
  nextWeekdayDate,
  targetEnd,
  targetStart,
} from './W198-booking-staff-availability-helpers';

function blocker(summary: string): CheckpointFinding {
  return { severity: 'blocker', summary };
}

export const checkpoint: CheckpointDefinition = {
  id: 'W198',
  title: 'Staff availability weekly hours and date override',
  verification: 'Admin Bookings Staff availability UI에서 주간 근무시간과 시간대를 저장하고 날짜 예외로 공개 예약 슬롯 차단까지 확인',
  async run({ page, baseUrl, recordEvidence }) {
    const findings: CheckpointFinding[] = [];
    const token = Date.now().toString(36);
    const headers = headersFor(token);
    const targetDate = nextWeekdayDate();
    const targetDay = dayForDate(targetDate);
    const label = dayLabel(targetDay);
    let staffId: string | null = null;
    let serviceId: string | null = null;

    try {
      staffId = await createStaff(page, token, headers);
      if (!staffId) {
        findings.push(blocker('담당자 fixture를 생성하지 못했습니다.'));
        return { findings };
      }
      serviceId = await createService(page, token, headers, staffId);
      if (!serviceId) {
        findings.push(blocker('서비스 fixture를 생성하지 못했습니다.'));
        return { findings };
      }

      const url = new URL(`/ko/admin-builder/bookings/staff/${staffId}/availability`, baseUrl);
      url.searchParams.set('w198', token);
      await page.goto(url.toString(), { waitUntil: 'networkidle' });
      await page.getByRole('button', { name: '가능 시간 저장' }).waitFor({ state: 'visible', timeout: 15_000 });
      await page.locator('[data-availability-template="true"]').selectOption('weekdays-10-18');
      await page.getByRole('button', { name: '템플릿 적용' }).click();
      await page.getByLabel('시간대').selectOption('Asia/Seoul');
      await page.getByLabel(`${label} 시작 1`).fill(targetStart);
      await page.getByLabel(`${label} 끝 1`).fill(targetEnd);
      const saveWeekly = page.waitForResponse((response) =>
        response.url().includes(`/api/builder/bookings/staff/${staffId}/availability`) && response.request().method() === 'PATCH',
      );
      await page.getByRole('button', { name: '가능 시간 저장' }).click();
      expect((await saveWeekly).status()).toBe(200);
      await expect(page.getByText('가능 시간을 저장했습니다.')).toBeVisible();

      const availability = await fetchAvailability(page, staffId, headers);
      const targetBlock = availability?.weekly[targetDay][0];
      if (
        availability?.timezone !== 'Asia/Seoul' ||
        availability.recurringTemplateId !== 'weekdays-10-18' ||
        targetBlock?.start !== targetStart ||
        targetBlock.end !== targetEnd
      ) {
        findings.push(blocker('주간 근무시간/시간대 저장값을 API에서 확인하지 못했습니다.'));
        return { findings };
      }
      const openSlots = await fetchSlots(page, serviceId, staffId, targetDate, headers);
      if (openSlots.length === 0) {
        findings.push(blocker('저장된 근무시간이 공개 예약 가능 슬롯으로 노출되지 않았습니다.'));
        return { findings };
      }
      await recordEvidence('W198 weekly availability saved through admin UI and public slots are available', page);

      await page.getByRole('button', { name: '날짜 예외 추가' }).click();
      await page.locator('[data-booking-availability-override-date="true"]').last().fill(targetDate);
      await page.locator('[data-booking-availability-override-note="true"]').last().fill(`W198 closed ${token}`);
      await expect(page.locator('[data-booking-availability-override-preview="true"]').last()).toContainText('닫힘');
      const saveOverride = page.waitForResponse((response) =>
        response.url().includes(`/api/builder/bookings/staff/${staffId}/availability`) && response.request().method() === 'PATCH',
      );
      await page.getByRole('button', { name: '가능 시간 저장' }).click();
      expect((await saveOverride).status()).toBe(200);

      const blockedAvailability = await fetchAvailability(page, staffId, headers);
      const override = blockedAvailability?.dateOverrides.find((item) => item.date === targetDate);
      if (!override || override.blocks.length !== 0) {
        findings.push(blocker('날짜 예외 차단 저장값을 API에서 확인하지 못했습니다.'));
        return { findings };
      }
      const blockedSlots = await fetchSlots(page, serviceId, staffId, targetDate, headers);
      if (blockedSlots.length !== 0) {
        findings.push(blocker('날짜 예외로 닫은 시간이 공개 예약 가능 슬롯에서 제거되지 않았습니다.'));
        return { findings };
      }
      await recordEvidence('W198 date override closes public availability slots', page);
    } catch (error) {
      const detail = error instanceof Error ? error.message : String(error);
      findings.push(blocker(`담당자 가용성 검증 중 예외가 발생했습니다: ${detail}`));
    } finally {
      await cleanupFiles({ staffId, serviceId });
    }

    return { findings };
  },
};

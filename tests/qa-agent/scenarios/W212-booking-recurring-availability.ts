import { expect } from '@playwright/test';

import type { CheckpointDefinition, CheckpointFinding } from '../types';
import {
  cleanupBookingFiles,
  createRecurringService,
  createRecurringStaff,
  fetchAvailability,
  fetchSlots,
  headersFor,
  nextHolidayWorkingDate,
  nextWorkingDate,
  type Day,
} from './W212-booking-recurring-availability-helpers';

const weekdayDays: readonly Day[] = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'];
const weekendDays: readonly Day[] = ['saturday', 'sunday'];

function blocker(summary: string, detail?: string): CheckpointFinding {
  return detail ? { severity: 'blocker', summary, detail } : { severity: 'blocker', summary };
}

function hasWeekdayTenToEighteen(availability: Awaited<ReturnType<typeof fetchAvailability>>): boolean {
  if (!availability) {
    return false;
  }
  const weekdaysOpen = weekdayDays.every((day) => {
    const block = availability.weekly[day][0];
    return availability.weekly[day].length === 1 && block?.start === '10:00' && block.end === '18:00';
  });
  const weekendsClosed = weekendDays.every((day) => availability.weekly[day].length === 0);
  return weekdaysOpen && weekendsClosed;
}

export const checkpoint: CheckpointDefinition = {
  id: 'W212',
  title: 'Booking recurring availability templates and holiday exclusion',
  verification: 'Staff availability admin에서 반복 템플릿과 KR/TW 휴일 캘린더를 저장하고 공개 slot/공휴일 제외/date override 재오픈을 검증',
  async run({ page, baseUrl, recordEvidence }) {
    const findings: CheckpointFinding[] = [];
    const token = Date.now().toString(36);
    const headers = headersFor(token);
    const workDate = nextWorkingDate();
    const holidayDate = nextHolidayWorkingDate();
    let staffId: string | null = null;
    let serviceId: string | null = null;

    try {
      await page.setExtraHTTPHeaders(headers);

      staffId = await createRecurringStaff({ page, headers, token });
      if (!staffId) {
        findings.push(blocker('W212 담당자 fixture를 생성하지 못했습니다.'));
        return { findings };
      }
      serviceId = await createRecurringService({ page, headers, token, staffId });
      if (!serviceId) {
        findings.push(blocker('W212 서비스 fixture를 생성하지 못했습니다.'));
        return { findings };
      }

      const url = new URL(`/ko/admin-builder/bookings/staff/${staffId}/availability`, baseUrl);
      url.searchParams.set('w212', token);
      await page.goto(url.toString(), { waitUntil: 'domcontentloaded' });
      await page.getByRole('button', { name: '가능 시간 저장' }).waitFor({ state: 'visible', timeout: 15_000 });
      await page.locator('[data-availability-template="true"]').selectOption('weekdays-10-18');
      await page.getByRole('button', { name: '템플릿 적용' }).click();
      await page.getByLabel('시간대').selectOption('Asia/Seoul');
      await page.getByLabel('휴일 캘린더').selectOption('kr-tw');

      const saveTemplate = page.waitForResponse((response) =>
        response.url().includes(`/api/builder/bookings/staff/${staffId}/availability`) && response.request().method() === 'PATCH',
        { timeout: 30_000 },
      );
      await page.getByRole('button', { name: '가능 시간 저장' }).click();
      expect((await saveTemplate).status()).toBe(200);
      await expect(page.getByText('가능 시간을 저장했습니다.')).toBeVisible();

      const availability = await fetchAvailability(page, staffId, headers);
      if (
        !availability ||
        availability.timezone !== 'Asia/Seoul' ||
        availability.recurringTemplateId !== 'weekdays-10-18' ||
        availability.holidayCalendar !== 'kr-tw' ||
        !hasWeekdayTenToEighteen(availability)
      ) {
        findings.push(blocker('W212 반복 템플릿/휴일 캘린더 저장값을 API에서 확인하지 못했습니다.'));
        return { findings };
      }

      const workSlots = await fetchSlots(page, serviceId, staffId, workDate, headers);
      if (workSlots.length === 0) {
        findings.push(blocker(`W212 일반 평일(${workDate}) 공개 예약 slot이 생성되지 않았습니다.`));
        return { findings };
      }

      const holidaySlots = await fetchSlots(page, serviceId, staffId, holidayDate, headers);
      if (holidaySlots.length !== 0) {
        findings.push(blocker(`W212 KR/TW 공휴일(${holidayDate})에도 공개 예약 slot이 남아 있습니다.`));
        return { findings };
      }
      await recordEvidence('W212 recurring template saves weekdays and excludes KR/TW holidays', page);

      await page.getByRole('button', { name: '날짜 예외 추가' }).click();
      await page.locator('[data-booking-availability-override-date="true"]').last().fill(holidayDate);
      await page.locator('[data-booking-availability-override-start="true"]').last().fill('10:00');
      await page.locator('[data-booking-availability-override-end="true"]').last().fill('18:00');
      await page.locator('[data-booking-availability-override-note="true"]').last().fill(`W212 holiday reopen ${token}`);
      await expect(page.locator('[data-booking-availability-override-preview="true"]').last()).toContainText('열림');

      const saveOverride = page.waitForResponse((response) =>
        response.url().includes(`/api/builder/bookings/staff/${staffId}/availability`) && response.request().method() === 'PATCH',
        { timeout: 30_000 },
      );
      await page.getByRole('button', { name: '가능 시간 저장' }).click();
      expect((await saveOverride).status()).toBe(200);

      const overrideAvailability = await fetchAvailability(page, staffId, headers);
      const override = overrideAvailability?.dateOverrides.find((item) => item.date === holidayDate);
      const overrideBlock = override?.blocks[0];
      if (!override || overrideBlock?.start !== '10:00' || overrideBlock.end !== '18:00') {
        findings.push(blocker('W212 공휴일 date override 재오픈 저장값을 API에서 확인하지 못했습니다.'));
        return { findings };
      }

      const reopenedHolidaySlots = await fetchSlots(page, serviceId, staffId, holidayDate, headers);
      if (reopenedHolidaySlots.length === 0) {
        findings.push(blocker(`W212 공휴일 override(${holidayDate}) 이후에도 공개 예약 slot이 열리지 않았습니다.`));
        return { findings };
      }
      await recordEvidence('W212 date override reopens holiday public slots', page);
    } catch (error) {
      const detail = error instanceof Error ? error.message : String(error);
      findings.push(blocker('W212 반복 가용성 검증 중 예외가 발생했습니다.', detail));
    } finally {
      await cleanupBookingFiles({ staffId, serviceId });
    }

    return { findings };
  },
};

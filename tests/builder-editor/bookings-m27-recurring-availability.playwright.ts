import { expect, test } from '@playwright/test';
import { dayOfWeeks } from '@/lib/builder/bookings/types';

function mutationHeaders(scope: string): Record<string, string> {
  const safeScope = scope.replace(/[^a-z0-9-]/gi, '-').slice(-48) || 'bookings-m27-w212';
  const username = process.env.BUILDER_SMOKE_USERNAME ?? process.env.CMS_ADMIN_USERNAME ?? 'admin';
  const password = process.env.BUILDER_SMOKE_PASSWORD ?? process.env.CMS_ADMIN_PASSWORD ?? 'local-review-2026!';
  return {
    'x-forwarded-for': `pw-${safeScope}`,
    authorization: `Basic ${Buffer.from(`${username}:${password}`).toString('base64')}`,
  };
}

function dateString(date: Date): string {
  return date.toISOString().slice(0, 10);
}

function weekdayIndex(date: Date): number {
  const day = date.getUTCDay();
  return day === 0 ? 7 : day;
}

function nextWorkingDate(): string {
  const holidays = new Set(['01-01', '02-28', '03-01', '04-04', '05-01', '05-05', '06-06', '08-15', '10-03', '10-09', '10-10', '12-25']);
  const today = new Date();
  for (let offset = 2; offset < 365; offset += 1) {
    const candidate = new Date(Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate() + offset, 12));
    const date = dateString(candidate);
    if (weekdayIndex(candidate) <= 5 && !holidays.has(date.slice(5))) return date;
  }
  throw new Error('No future working date found');
}

function nextHolidayWorkingDate(): string {
  const today = new Date();
  const fixedHolidays = ['01-01', '05-05', '10-09', '10-10', '12-25'];
  for (let year = today.getUTCFullYear(); year < today.getUTCFullYear() + 20; year += 1) {
    for (const mmdd of fixedHolidays) {
      const date = `${year}-${mmdd}`;
      const candidate = new Date(`${date}T12:00:00.000Z`);
      if (candidate > today && weekdayIndex(candidate) <= 5) return date;
    }
  }
  throw new Error('No future holiday weekday found');
}

function noWeek() {
  return Object.fromEntries(dayOfWeeks.map((day) => [day, []]));
}

test.describe('M27 recurring availability templates', () => {
  test.setTimeout(120_000);

  test('applies recurring template and automatic holiday exclusion from admin UI', async ({ page }) => {
    const token = Date.now().toString(36);
    const headers = mutationHeaders(token);
    let serviceId: string | null = null;
    let staffId: string | null = null;

    await page.setExtraHTTPHeaders(headers);

    try {
      const staffResponse = await page.request.post('/api/builder/bookings/staff', {
        headers,
        data: {
          name: { ko: `M27 반복 변호사 ${token}`, 'zh-hant': `M27 循環律師 ${token}`, en: `M27 Recurring Attorney ${token}` },
          title: { ko: '반복 검증', 'zh-hant': '循環測試', en: 'Recurring test' },
          bio: { ko: '반복 가용성 검증 담당자', 'zh-hant': '循環可預約測試', en: 'Recurring availability test counsel' },
          email: '',
          photo: '',
          isActive: true,
        },
      });
      expect(staffResponse.status()).toBe(201);
      staffId = ((await staffResponse.json()) as { staff: { staffId: string } }).staff.staffId;

      const serviceResponse = await page.request.post('/api/builder/bookings/services', {
        headers,
        data: {
          name: { ko: `M27 반복 상담 ${token}`, 'zh-hant': `M27 循環諮詢 ${token}`, en: `M27 Recurring Consultation ${token}` },
          description: { ko: 'W212 반복 가용성 검증', 'zh-hant': 'W212 循環測試', en: 'W212 recurring verification' },
          durationMinutes: 30,
          priceTwd: 0,
          image: '',
          category: 'consultation',
          staffIds: [staffId],
          bufferBeforeMinutes: 0,
          bufferAfterMinutes: 0,
          slotStepMinutes: 30,
          isActive: true,
          paymentMode: 'free',
          priceAmount: 0,
          priceCurrency: 'TWD',
        },
      });
      expect(serviceResponse.status()).toBe(201);
      serviceId = ((await serviceResponse.json()) as { service: { serviceId: string } }).service.serviceId;

      const emptyAvailability = await page.request.patch(`/api/builder/bookings/staff/${staffId}/availability`, {
        headers,
        data: {
          weekly: noWeek(),
          blockedDates: [],
          timezone: 'Asia/Seoul',
          holidayCalendar: 'none',
        },
      });
      expect(emptyAvailability.status()).toBe(200);

      await page.goto(`/ko/admin-builder/bookings/staff/${staffId}/availability`, { waitUntil: 'domcontentloaded' });
      await page.getByLabel('Recurring template').selectOption('weekdays-10-18');
      await page.getByRole('button', { name: 'Apply template' }).click();
      await page.getByLabel('Timezone').selectOption('Asia/Seoul');
      await page.getByLabel('Holiday calendar').selectOption('kr-tw');

      const saveResponsePromise = page.waitForResponse((response) =>
        response.url().includes(`/api/builder/bookings/staff/${staffId}/availability`) && response.request().method() === 'PATCH',
        { timeout: 30_000 },
      );
      await page.getByRole('button', { name: 'Save availability' }).click();
      expect((await saveResponsePromise).status()).toBe(200);
      await expect(page.getByText('Availability saved.')).toBeVisible();

      const workDate = nextWorkingDate();
      const workSlotsResponse = await page.request.get(`/api/booking/availability?serviceId=${serviceId}&staffId=${staffId}&date=${workDate}`, {
        headers,
      });
      expect(workSlotsResponse.status()).toBe(200);
      const workSlots = ((await workSlotsResponse.json()) as { slots: Array<{ startAt: string }> }).slots;
      expect(workSlots.length).toBeGreaterThan(0);
      expect(workSlots[0].startAt).toContain('T01:00:00.000Z');

      const holidayDate = nextHolidayWorkingDate();
      const holidaySlotsResponse = await page.request.get(`/api/booking/availability?serviceId=${serviceId}&staffId=${staffId}&date=${holidayDate}`, {
        headers,
      });
      expect(holidaySlotsResponse.status()).toBe(200);
      expect(((await holidaySlotsResponse.json()) as { slots: unknown[] }).slots).toEqual([]);
    } finally {
      if (serviceId) {
        await page.request.delete(`/api/builder/bookings/services/${serviceId}`, {
          headers,
          failOnStatusCode: false,
        });
      }
      if (staffId) {
        await page.request.delete(`/api/builder/bookings/staff/${staffId}`, {
          headers,
          failOnStatusCode: false,
        });
      }
    }
  });
});

import { expect, test } from '@playwright/test';
import { dayOfWeeks } from '@/lib/builder/bookings/types';

function mutationHeaders(scope: string): Record<string, string> {
  const safeScope = scope.replace(/[^a-z0-9-]/gi, '-').slice(-48) || 'bookings-m26';
  return { 'x-forwarded-for': `pw-${safeScope}` };
}

function allWeek(start: string, end: string) {
  return Object.fromEntries(dayOfWeeks.map((day) => [day, [{ start, end }]]));
}

function todayPlus(days: number): string {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return date.toISOString().slice(0, 10);
}

function toLocalInputValue(iso: string): string {
  const date = new Date(iso);
  const local = new Date(date.getTime() - date.getTimezoneOffset() * 60_000);
  return local.toISOString().slice(0, 16);
}

test.describe('M26 Bookings dashboard and service operations', () => {
  test.setTimeout(120_000);

  test('covers dashboard filters, reschedule, no-show, and meeting/cancel policy settings', async ({ page }) => {
    const token = Date.now().toString(36);
    const headers = mutationHeaders(token);
    let staffId: string | null = null;
    let serviceId: string | null = null;
    let bookingId: string | null = null;

    await page.setExtraHTTPHeaders(headers);

    try {
      const staffResponse = await page.request.post('/api/builder/bookings/staff', {
        headers,
        data: {
          name: { ko: `M26 변호사 ${token}`, 'zh-hant': `M26 律師 ${token}`, en: `M26 Attorney ${token}` },
          title: { ko: '예약 운영 담당', 'zh-hant': '預約管理', en: 'Booking Operator' },
          bio: { ko: 'M26 예약 운영 검증 담당자', 'zh-hant': 'M26 預約管理測試', en: 'M26 dashboard test counsel' },
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
          name: { ko: `M26 줌 상담 ${token}`, 'zh-hant': `M26 Zoom 諮詢 ${token}`, en: `M26 Zoom Consultation ${token}` },
          description: { ko: 'M26 관리자 대시보드 검증', 'zh-hant': 'M26 管理測試', en: 'M26 dashboard check' },
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
          priceCurrency: 'TWD',
          meetingMode: 'zoom',
          cancellationPolicyId: 'standard-24h',
        },
      });
      expect(serviceResponse.status()).toBe(201);
      const servicePayload = (await serviceResponse.json()) as { service: { serviceId: string; meetingMode?: string; cancellationPolicyId?: string } };
      serviceId = servicePayload.service.serviceId;
      expect(servicePayload.service).toMatchObject({ meetingMode: 'zoom', cancellationPolicyId: 'standard-24h' });

      const availabilityResponse = await page.request.patch(`/api/builder/bookings/staff/${staffId}/availability`, {
        headers,
        data: {
          weekly: allWeek('09:00', '17:00'),
          blockedDates: [],
          timezone: 'Asia/Seoul',
        },
      });
      expect(availabilityResponse.status()).toBe(200);

      const bookingDate = todayPlus(2);
      const slotResponse = await page.request.get(`/api/booking/availability?serviceId=${serviceId}&staffId=${staffId}&date=${bookingDate}`, { headers });
      expect(slotResponse.status()).toBe(200);
      const slots = ((await slotResponse.json()) as { slots: Array<{ startAt: string }> }).slots;
      expect(slots.length).toBeGreaterThan(2);
      const startAt = slots[0].startAt;
      const rescheduledStartAt = slots[2].startAt;

      const bookingResponse = await page.request.post('/api/builder/bookings/admin-create', {
        headers,
        data: {
          serviceId,
          staffId,
          startAt,
          status: 'pending',
          customerTimezone: 'Asia/Seoul',
          customer: {
            name: `M26 고객 ${token}`,
            email: `m26-${token}@example.com`,
            phone: '+82105550000',
            notes: 'M26 dashboard row',
            caseSummary: '대시보드에서 상태와 시간을 조정합니다.',
            locale: 'ko',
          },
        },
      });
      expect(bookingResponse.status()).toBe(201);
      bookingId = ((await bookingResponse.json()) as { booking: { bookingId: string } }).booking.bookingId;

      await page.goto('/ko/admin-builder/bookings/dashboard', { waitUntil: 'domcontentloaded' });
      await expect(page.locator('[data-booking-dashboard="true"]')).toBeVisible();
      await expect(page.getByRole('link', { name: 'Dashboard' })).toHaveAttribute('data-active', 'true');
      await page.getByPlaceholder('Name, email, notes, service').fill(token);
      await page.getByLabel('Status').selectOption('pending');
      const row = page.locator(`[data-booking-row="${bookingId}"]`);
      await expect(row).toBeVisible();
      await row.click();
      await expect(page.locator('[data-booking-timeline="true"]')).toBeVisible();

      const noShowResponse = page.waitForResponse((response) =>
        response.url().includes(`/api/builder/bookings/${bookingId}`) && response.request().method() === 'PATCH',
      );
      await page.getByRole('button', { name: 'Mark no-show' }).click();
      const noShowPayload = (await (await noShowResponse).json()) as { booking: { status: string } };
      expect(noShowPayload.booking.status).toBe('no-show');
      await expect(page.locator('[data-booking-status="no-show"]').first()).toBeVisible();

      const rescheduleResponse = page.waitForResponse((response) =>
        response.url().includes(`/api/builder/bookings/${bookingId}`) && response.request().method() === 'PATCH',
      );
      await page.getByLabel('Start time').fill(toLocalInputValue(rescheduledStartAt));
      await page.getByRole('button', { name: 'Save reschedule' }).click();
      const reschedulePayload = (await (await rescheduleResponse).json()) as { booking: { startAt: string; staffId: string } };
      expect(reschedulePayload.booking.startAt).toBe(rescheduledStartAt);
      expect(reschedulePayload.booking.staffId).toBe(staffId);

      const confirmResponse = page.waitForResponse((response) =>
        response.url().includes(`/api/builder/bookings/${bookingId}`) && response.request().method() === 'PATCH',
      );
      await page.getByRole('button', { name: 'Confirm' }).click();
      const confirmPayload = (await (await confirmResponse).json()) as { booking: { status: string } };
      expect(confirmPayload.booking.status).toBe('confirmed');

      await page.goto('/ko/admin-builder/bookings/services', { waitUntil: 'domcontentloaded' });
      await page.getByText(`M26 줌 상담 ${token}`).scrollIntoViewIfNeeded();
      await expect(page.getByText('zoom').first()).toBeVisible();
      await expect(page.getByText('Policy standard-24h').first()).toBeVisible();

      await page.goto('/ko/admin-builder/bookings/calendar', { waitUntil: 'domcontentloaded' });
      await expect(page.locator('[data-calendar-view="month"]')).toBeVisible();
      await page.getByRole('button', { name: 'Week' }).click();
      await expect(page.locator('[data-calendar-view="week"]')).toBeVisible();
      await page.getByRole('button', { name: 'List' }).click();
      await expect(page.locator('[data-calendar-view="list"]')).toBeVisible();
    } finally {
      if (bookingId) {
        await page.request.patch(`/api/builder/bookings/${bookingId}`, {
          headers,
          data: { status: 'cancelled' },
          failOnStatusCode: false,
        });
      }
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

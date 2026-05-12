import { expect, test } from '@playwright/test';
import { createBookingManageToken } from '@/lib/builder/bookings/manage-token';
import { dayOfWeeks } from '@/lib/builder/bookings/types';
import type { Booking } from '@/lib/builder/bookings/types';

function mutationHeaders(scope: string): Record<string, string> {
  const safeScope = scope.replace(/[^a-z0-9-]/gi, '-').slice(-48) || 'bookings-m26-manage';
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

test.describe('M26 customer booking management links', () => {
  test.setTimeout(120_000);

  test('lets a customer open a signed link, reschedule, and cancel', async ({ page }) => {
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
          name: { ko: `M26 링크 변호사 ${token}`, 'zh-hant': `M26 連結律師 ${token}`, en: `M26 Link Attorney ${token}` },
          title: { ko: '고객 링크 담당', 'zh-hant': '客戶連結', en: 'Customer Link Counsel' },
          bio: { ko: '고객 예약 관리 링크 검증 담당자', 'zh-hant': '客戶連結測試', en: 'Customer manage link test counsel' },
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
          name: { ko: `M26 고객 링크 상담 ${token}`, 'zh-hant': `M26 客戶連結諮詢 ${token}`, en: `M26 Customer Link Consultation ${token}` },
          description: { ko: '예약 링크 변경/취소 검증', 'zh-hant': '預約連結測試', en: 'Manage link check' },
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
          meetingMode: 'in-person',
          cancellationPolicyId: 'standard-24h',
        },
      });
      expect(serviceResponse.status()).toBe(201);
      serviceId = ((await serviceResponse.json()) as { service: { serviceId: string } }).service.serviceId;

      const availabilityResponse = await page.request.patch(`/api/builder/bookings/staff/${staffId}/availability`, {
        headers,
        data: {
          weekly: allWeek('09:00', '16:00'),
          blockedDates: [],
          timezone: 'Asia/Seoul',
        },
      });
      expect(availabilityResponse.status()).toBe(200);

      const bookingDate = todayPlus(3);
      const slotResponse = await page.request.get(`/api/booking/availability?serviceId=${serviceId}&staffId=${staffId}&date=${bookingDate}`, { headers });
      expect(slotResponse.status()).toBe(200);
      const slots = ((await slotResponse.json()) as { slots: Array<{ startAt: string }> }).slots;
      expect(slots.length).toBeGreaterThan(3);
      const startAt = slots[0].startAt;
      const rescheduledStartAt = slots[3].startAt;

      const bookingResponse = await page.request.post('/api/builder/bookings/admin-create', {
        headers,
        data: {
          serviceId,
          staffId,
          startAt,
          status: 'confirmed',
          customerTimezone: 'Asia/Seoul',
          customer: {
            name: `M26 링크 고객 ${token}`,
            email: `m26-manage-${token}@example.com`,
            phone: '+82107770000',
            notes: '고객 링크에서 직접 변경합니다.',
            caseSummary: '일정을 조정하고 취소합니다.',
            locale: 'ko',
          },
        },
      });
      expect(bookingResponse.status()).toBe(201);
      const booking = ((await bookingResponse.json()) as { booking: Booking }).booking;
      bookingId = booking.bookingId;
      const manageToken = createBookingManageToken(booking);

      await page.goto(`/ko/bookings/manage/${encodeURIComponent(manageToken)}`, { waitUntil: 'domcontentloaded' });
      await expect(page.locator('[data-booking-manage="true"]')).toBeVisible();
      await expect(page.getByText(`M26 고객 링크 상담 ${token}`)).toBeVisible();
      await expect(page.getByText(`M26 링크 고객 ${token}`)).toBeVisible();
      await expect(page.locator('[data-booking-status="confirmed"]')).toBeVisible();

      const rescheduleResponse = page.waitForResponse((response) =>
        response.url().includes('/api/booking/manage/') && response.request().method() === 'PATCH',
      );
      await page.getByLabel('New start time').fill(toLocalInputValue(rescheduledStartAt));
      await page.getByRole('button', { name: 'Save new time' }).click();
      const reschedulePayload = (await (await rescheduleResponse).json()) as { booking: { startAt: string; staffId: string } };
      expect(reschedulePayload.booking.startAt).toBe(rescheduledStartAt);
      expect(reschedulePayload.booking.staffId).toBe(staffId);
      await expect(page.getByText('Booking rescheduled.')).toBeVisible();

      const cancelResponse = page.waitForResponse((response) =>
        response.url().includes('/api/booking/manage/') && response.request().method() === 'PATCH',
      );
      await page.getByLabel('Reason').fill('고객 링크 취소 검증');
      await page.getByRole('button', { name: 'Cancel booking' }).click();
      const cancelPayload = (await (await cancelResponse).json()) as { booking: { status: string; cancellationReason?: string } };
      expect(cancelPayload.booking.status).toBe('cancelled');
      expect(cancelPayload.booking.cancellationReason).toContain('고객 링크 취소');
      await expect(page.locator('[data-booking-status="cancelled"]')).toBeVisible();
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

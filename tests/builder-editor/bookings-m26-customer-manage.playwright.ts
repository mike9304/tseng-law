import { expect, test, type APIRequestContext } from '@playwright/test';
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

async function firstSlotWithinHours(
  request: APIRequestContext,
  serviceId: string,
  staffId: string,
  token: string,
  maxHours: number,
): Promise<string> {
  const now = Date.now();
  for (let offset = 0; offset <= 2; offset += 1) {
    const date = todayPlus(offset);
    const response = await request.get(`/api/booking/availability?serviceId=${serviceId}&staffId=${staffId}&date=${date}`, {
      headers: mutationHeaders(`m26-policy-slot-${token}-${date}`),
    });
    expect(response.status()).toBe(200);
    const slots = ((await response.json()) as { slots: Array<{ startAt: string }> }).slots;
    const slot = slots.find((item) => {
      const hours = (Date.parse(item.startAt) - now) / (1000 * 60 * 60);
      return hours > 0.1 && hours < maxHours;
    });
    if (slot) return slot.startAt;
  }
  throw new Error(`No slot found within ${maxHours} hours.`);
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
      await expect(page.locator('[data-booking-manage-policy="true"]')).toContainText('Standard policy');
      await expect(page.locator('[data-booking-policy-reschedule="allowed"]')).toBeVisible();
      await expect(page.locator('[data-booking-policy-cancel="allowed"]')).toBeVisible();

      const rescheduleResponse = page.waitForResponse((response) =>
        response.url().includes('/api/booking/manage/') && response.request().method() === 'PATCH',
      );
      await page.getByLabel(/New start time|새 시작 시간/).fill(toLocalInputValue(rescheduledStartAt));
      await page.getByRole('button', { name: /^Save new time$|^새 시간 저장$/ }).click();
      const reschedulePayload = (await (await rescheduleResponse).json()) as { booking: { startAt: string; staffId: string } };
      expect(reschedulePayload.booking.startAt).toBe(rescheduledStartAt);
      expect(reschedulePayload.booking.staffId).toBe(staffId);
      await expect(page.getByText(/Booking rescheduled\.|예약 시간이 변경되었습니다\./)).toBeVisible();

      const cancelResponse = page.waitForResponse((response) =>
        response.url().includes('/api/booking/manage/') && response.request().method() === 'PATCH',
      );
      await page.getByLabel(/Reason|사유/).fill('고객 링크 취소 검증');
      await page.getByRole('button', { name: /^Cancel booking$|^예약 취소$/ }).click();
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

  test('blocks customer reschedule when the policy window has passed', async ({ page }) => {
    const token = `policy-${Date.now().toString(36)}`;
    const headers = mutationHeaders(token);
    let staffId: string | null = null;
    let serviceId: string | null = null;
    let bookingId: string | null = null;

    await page.setExtraHTTPHeaders(headers);

    try {
      const staffResponse = await page.request.post('/api/builder/bookings/staff', {
        headers,
        data: {
          name: { ko: `F80 정책 변호사 ${token}`, 'zh-hant': `F80 政策律師 ${token}`, en: `F80 Policy Attorney ${token}` },
          title: { ko: '정책 담당', 'zh-hant': '政策', en: 'Policy Counsel' },
          bio: { ko: '정책 창구 검증 담당자', 'zh-hant': '政策測試', en: 'Policy test counsel' },
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
          name: { ko: `F80 엄격 정책 상담 ${token}`, 'zh-hant': `F80 嚴格政策諮詢 ${token}`, en: `F80 Strict Policy Consultation ${token}` },
          description: { ko: '정책 창구 검증', 'zh-hant': '政策測試', en: 'Policy gate check' },
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
          cancellationPolicyId: 'strict-48h',
        },
      });
      expect(serviceResponse.status()).toBe(201);
      serviceId = ((await serviceResponse.json()) as { service: { serviceId: string } }).service.serviceId;

      const availabilityResponse = await page.request.patch(`/api/builder/bookings/staff/${staffId}/availability`, {
        headers,
        data: {
          weekly: allWeek('00:00', '23:30'),
          blockedDates: [],
          timezone: 'Asia/Seoul',
        },
      });
      expect(availabilityResponse.status()).toBe(200);

      const startAt = await firstSlotWithinHours(page.request, serviceId, staffId, token, 6);
      const bookingResponse = await page.request.post('/api/builder/bookings/admin-create', {
        headers,
        data: {
          serviceId,
          staffId,
          startAt,
          status: 'confirmed',
          customerTimezone: 'Asia/Seoul',
          customer: {
            name: `F80 정책 고객 ${token}`,
            email: `f80-policy-${token}@example.com`,
            phone: '+82107770000',
            locale: 'ko',
          },
        },
      });
      expect(bookingResponse.status()).toBe(201);
      const booking = ((await bookingResponse.json()) as { booking: Booking }).booking;
      bookingId = booking.bookingId;
      const manageToken = createBookingManageToken(booking);

      await page.goto(`/ko/bookings/manage/${encodeURIComponent(manageToken)}`, { waitUntil: 'domcontentloaded' });
      await expect(page.locator('[data-booking-manage-policy="true"]')).toContainText('Strict policy');
      await expect(page.locator('[data-booking-policy-reschedule="blocked"]')).toBeVisible();
      await expect(page.locator('[data-booking-policy-cancel="blocked"]')).toBeVisible();
      await expect(page.locator('[data-booking-manage-reschedule="disabled"]')).toBeDisabled();
      await expect(page.locator('[data-booking-manage-cancel="disabled"]')).toBeDisabled();

      const newStartAt = new Date(Date.parse(startAt) + 30 * 60_000).toISOString();
      const blockedResponse = await page.request.patch(`/api/booking/manage/${encodeURIComponent(manageToken)}`, {
        headers,
        data: { action: 'reschedule', startAt: newStartAt },
        failOnStatusCode: false,
      });
      expect(blockedResponse.status()).toBe(409);
      const blockedJson = await blockedResponse.json() as { error?: string; errorCode?: string; policy?: { rescheduleBlockedReason?: string } };
      expect(blockedJson).toMatchObject({
        error: '이 예약은 일정을 변경할 수 없습니다.',
        errorCode: 'reschedule_unavailable',
      });
      expect(blockedJson.policy?.rescheduleBlockedReason).toBe('이 예약은 일정을 변경할 수 없습니다.');

      // /api/booking/cancel now requires the signed manage token (ownership
      // proof). With a valid token the request still reaches — and is blocked
      // by — the cancellation policy guard.
      const directCancelResponse = await page.request.post('/api/booking/cancel', {
        headers,
        data: { bookingId, token: manageToken, reason: 'direct cancel policy guard check' },
        failOnStatusCode: false,
      });
      expect(directCancelResponse.status()).toBe(409);
      const directCancelJson = await directCancelResponse.json() as { error?: string };
      expect(directCancelJson.error).toContain('Cancellation requires');

      // Without the manage token the endpoint must reject (no anonymous cancel).
      const unauthedCancelResponse = await page.request.post('/api/booking/cancel', {
        headers,
        data: { bookingId, reason: 'missing manage token' },
        failOnStatusCode: false,
      });
      expect(unauthedCancelResponse.status()).toBe(401);
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

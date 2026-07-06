import { expect, test, type APIRequestContext } from '@playwright/test';
import { z } from 'zod';
import { dayOfWeeks } from '@/lib/builder/bookings/types';

const staffPayloadSchema = z.object({ staff: z.object({ staffId: z.string() }) });
const servicePayloadSchema = z.object({
  service: z.object({
    serviceId: z.string(),
    priceAmount: z.number().optional(),
    staffPriceOverrides: z.record(z.string(), z.number()).optional(),
  }),
});
const slotsPayloadSchema = z.object({ slots: z.array(z.object({ startAt: z.string() })) });
const paymentPayloadSchema = z.object({
  ok: z.literal(true),
  amount: z.number(),
  totalAmount: z.number(),
  currency: z.string(),
});
const bookingPayloadSchema = z.object({
  bookingId: z.string().optional(),
  booking: z.object({
    bookingId: z.string().optional(),
    staffId: z.string(),
    paymentAmount: z.number().optional(),
    paymentDueNow: z.number().optional(),
  }),
});

function mutationHeaders(scope: string): Record<string, string> {
  const safeScope = scope.replace(/[^a-z0-9-]/gi, '-').slice(-48) || 'bookings-staff-pricing';
  const username = process.env.BUILDER_SMOKE_USERNAME ?? process.env.CMS_ADMIN_USERNAME ?? 'admin';
  const password = process.env.BUILDER_SMOKE_PASSWORD ?? process.env.CMS_ADMIN_PASSWORD ?? 'local-review-2026!';
  return {
    'x-forwarded-for': `pw-${safeScope}`,
    authorization: `Basic ${Buffer.from(`${username}:${password}`).toString('base64')}`,
  };
}

function allWeek(start: string, end: string): Record<string, Array<{ start: string; end: string }>> {
  const weekly: Record<string, Array<{ start: string; end: string }>> = {};
  for (const day of dayOfWeeks) weekly[day] = [{ start, end }];
  return weekly;
}

function todayPlus(days: number): string {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return date.toISOString().slice(0, 10);
}

async function createStaff(request: APIRequestContext, headers: Record<string, string>, token: string, label: string): Promise<string> {
  const response = await request.post('/api/builder/bookings/staff', {
    headers,
    data: {
      name: { ko: `${label} 담당 ${token}`, 'zh-hant': `${label} 律師 ${token}`, en: `${label} Attorney ${token}` },
      title: { ko: `${label} 상담`, 'zh-hant': `${label} 諮詢`, en: `${label} counsel` },
      bio: { ko: '스태프별 가격 검증', 'zh-hant': '員工價格測試', en: 'Staff-specific pricing check' },
      email: '',
      photo: '',
      isActive: true,
    },
  });
  expect(response.status()).toBe(201);
  return staffPayloadSchema.parse(await response.json()).staff.staffId;
}

async function openAvailability(request: APIRequestContext, headers: Record<string, string>, staffId: string): Promise<void> {
  const response = await request.patch(`/api/builder/bookings/staff/${staffId}/availability`, {
    headers,
    data: { weekly: allWeek('09:00', '17:00'), blockedDates: [], timezone: 'Asia/Seoul' },
  });
  expect(response.status()).toBe(200);
}

async function availableStarts(request: APIRequestContext, headers: Record<string, string>, serviceId: string, staffId: string): Promise<string[]> {
  const response = await request.get(`/api/booking/availability?serviceId=${serviceId}&staffId=${staffId}&date=${todayPlus(3)}`, { headers });
  expect(response.status()).toBe(200);
  return slotsPayloadSchema.parse(await response.json()).slots.map((slot) => slot.startAt);
}

test.describe('Bookings staff-specific pricing', () => {
  test('uses the selected staff price override across payment intent and booking APIs', async ({ page }) => {
    const token = Date.now().toString(36);
    const headers = mutationHeaders(token);
    const staffIds: string[] = [];
    const bookingIds: string[] = [];
    let serviceId: string | null = null;

    await page.setExtraHTTPHeaders(headers);

    try {
      const baseStaffId = await createStaff(page.request, headers, token, '기본');
      const premiumStaffId = await createStaff(page.request, headers, token, '프리미엄');
      staffIds.push(baseStaffId, premiumStaffId);
      await openAvailability(page.request, headers, baseStaffId);
      await openAvailability(page.request, headers, premiumStaffId);

      const serviceResponse = await page.request.post('/api/builder/bookings/services', {
        headers,
        data: {
          name: { ko: `스태프 가격 상담 ${token}`, 'zh-hant': `員工價格諮詢 ${token}`, en: `Staff Pricing Consultation ${token}` },
          description: { ko: '스태프별 가격 검증', 'zh-hant': '員工價格測試', en: 'Staff-specific pricing check' },
          durationMinutes: 30,
          priceTwd: 5000,
          image: '',
          category: 'consultation',
          staffIds,
          bufferBeforeMinutes: 0,
          bufferAfterMinutes: 0,
          slotStepMinutes: 30,
          isActive: true,
          paymentMode: 'paid',
          priceAmount: 5000,
          priceCurrency: 'TWD',
          staffPriceOverrides: { [premiumStaffId]: 8000 },
        },
      });
      expect(serviceResponse.status()).toBe(201);
      const servicePayload = servicePayloadSchema.parse(await serviceResponse.json());
      serviceId = servicePayload.service.serviceId;
      expect(servicePayload.service.staffPriceOverrides).toEqual({ [premiumStaffId]: 8000 });

      const basePaymentResponse = await page.request.post('/api/booking/payment-intent', {
        headers,
        data: { serviceId, staffId: baseStaffId, customer: { name: `기본 고객 ${token}`, email: `staff-base-${token}@example.com` } },
      });
      expect(basePaymentResponse.status()).toBe(200);
      expect(paymentPayloadSchema.parse(await basePaymentResponse.json())).toMatchObject({ amount: 5000, totalAmount: 5000, currency: 'twd' });

      const premiumPaymentResponse = await page.request.post('/api/booking/payment-intent', {
        headers,
        data: { serviceId, staffId: premiumStaffId, customer: { name: `프리미엄 고객 ${token}`, email: `staff-premium-${token}@example.com` } },
      });
      expect(premiumPaymentResponse.status()).toBe(200);
      expect(paymentPayloadSchema.parse(await premiumPaymentResponse.json())).toMatchObject({ amount: 8000, totalAmount: 8000, currency: 'twd' });

      const starts = await availableStarts(page.request, headers, serviceId, premiumStaffId);
      const adminStart = starts[0];
      const publicStart = starts[1];
      if (!adminStart || !publicStart) throw new Error('Need two staff-pricing slots.');

      const adminBookingResponse = await page.request.post('/api/builder/bookings/admin-create', {
        headers,
        data: {
          serviceId,
          staffId: premiumStaffId,
          startAt: adminStart,
          status: 'confirmed',
          customerTimezone: 'Asia/Seoul',
          customer: { name: `관리자 고객 ${token}`, email: `staff-admin-${token}@example.com`, locale: 'ko' },
        },
      });
      expect(adminBookingResponse.status()).toBe(201);
      const adminBooking = bookingPayloadSchema.parse(await adminBookingResponse.json());
      bookingIds.push(adminBooking.booking.bookingId ?? adminBooking.bookingId ?? '');
      expect(adminBooking.booking).toMatchObject({ staffId: premiumStaffId, paymentAmount: 8000, paymentDueNow: 8000 });

      const publicBookingResponse = await page.request.post('/api/booking/book', {
        headers,
        data: {
          serviceId,
          staffId: premiumStaffId,
          startAt: publicStart,
          paymentIntentId: `pi_staff_price_${token}`,
          customerTimezone: 'Asia/Seoul',
          customer: { name: `공개 고객 ${token}`, email: `staff-public-${token}@example.com`, locale: 'ko' },
        },
      });
      expect(publicBookingResponse.status()).toBe(201);
      const publicBooking = bookingPayloadSchema.parse(await publicBookingResponse.json());
      bookingIds.push(publicBooking.booking.bookingId ?? publicBooking.bookingId ?? '');
      expect(publicBooking.booking).toMatchObject({ staffId: premiumStaffId, paymentAmount: 8000, paymentDueNow: 8000 });
    } finally {
      for (const bookingId of bookingIds.filter(Boolean)) {
        await page.request.patch(`/api/builder/bookings/${bookingId}`, { headers, data: { status: 'cancelled' }, failOnStatusCode: false });
      }
      if (serviceId) {
        await page.request.delete(`/api/builder/bookings/services/${serviceId}`, { headers, failOnStatusCode: false });
      }
      for (const staffId of staffIds) {
        await page.request.delete(`/api/builder/bookings/staff/${staffId}`, { headers, failOnStatusCode: false });
      }
    }
  });
});

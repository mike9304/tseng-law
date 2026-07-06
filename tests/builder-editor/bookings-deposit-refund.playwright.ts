import { expect, test, type APIRequestContext } from '@playwright/test';
import { z } from 'zod';
import { createBookingManageToken } from '@/lib/builder/bookings/manage-token';
import { dayOfWeeks } from '@/lib/builder/bookings/types';
import { locales } from '@/lib/locales';

const bookingTokenInputSchema = z.object({
  bookingId: z.string(),
  customer: z.object({
    name: z.string(),
    email: z.string().email(),
    locale: z.enum(locales),
  }),
});

const staffPayloadSchema = z.object({ staff: z.object({ staffId: z.string() }) });
const servicePayloadSchema = z.object({
  service: z.object({
    serviceId: z.string(),
    depositAmount: z.number().optional(),
    paymentMode: z.string().optional(),
  }),
});
const slotsPayloadSchema = z.object({ slots: z.array(z.object({ startAt: z.string() })) });
const bookingPayloadSchema = z.object({
  booking: bookingTokenInputSchema.extend({
    paymentStatus: z.string().optional(),
    paymentDueNow: z.number().optional(),
    onlinePaidAmount: z.number().optional(),
    depositAmount: z.number().optional(),
  }),
});
const cancelPayloadSchema = z.object({
  ok: z.literal(true),
  booking: z.object({
    status: z.literal('cancelled'),
    paymentStatus: z.string().optional(),
  }),
  refundDecision: z.literal('full'),
  refundAmountCents: z.number(),
  refundResult: z.object({
    ok: z.boolean(),
    refundId: z.string().optional(),
    error: z.string().optional(),
  }).nullable(),
});

function mutationHeaders(scope: string): Record<string, string> {
  const safeScope = scope.replace(/[^a-z0-9-]/gi, '-').slice(-48) || 'bookings-deposit-refund';
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

async function firstAvailableSlot(request: APIRequestContext, serviceId: string, staffId: string, headers: Record<string, string>): Promise<string> {
  const response = await request.get(`/api/booking/availability?serviceId=${serviceId}&staffId=${staffId}&date=${todayPlus(3)}`, { headers });
  expect(response.status()).toBe(200);
  const payload = slotsPayloadSchema.parse(await response.json());
  const slot = payload.slots[0];
  if (!slot) throw new Error('No deposit refund slot was available.');
  return slot.startAt;
}

test.describe('Bookings deposit refunds', () => {
  test('caps customer cancel refunds at the online-paid deposit amount', async ({ page }) => {
    const token = Date.now().toString(36);
    const headers = mutationHeaders(token);
    const paymentIntentId = `pi_deposit_${token}`;
    let staffId: string | null = null;
    let serviceId: string | null = null;
    let bookingId: string | null = null;

    await page.setExtraHTTPHeaders(headers);

    try {
      const staffResponse = await page.request.post('/api/builder/bookings/staff', {
        headers,
        data: {
          name: { ko: `보증금 담당 ${token}`, 'zh-hant': `訂金律師 ${token}`, en: `Deposit Attorney ${token}` },
          title: { ko: '보증금 상담 담당', 'zh-hant': '訂金諮詢', en: 'Deposit counsel' },
          bio: { ko: '보증금 환불 검증 담당자', 'zh-hant': '訂金退款測試', en: 'Deposit refund test counsel' },
          email: '',
          photo: '',
          isActive: true,
        },
      });
      expect(staffResponse.status()).toBe(201);
      staffId = staffPayloadSchema.parse(await staffResponse.json()).staff.staffId;

      const serviceResponse = await page.request.post('/api/builder/bookings/services', {
        headers,
        data: {
          name: { ko: `보증금 유료 상담 ${token}`, 'zh-hant': `訂金諮詢 ${token}`, en: `Deposit Consultation ${token}` },
          description: { ko: '보증금 결제 후 취소 환불 검증', 'zh-hant': '訂金退款測試', en: 'Deposit refund check' },
          durationMinutes: 30,
          priceTwd: 5000,
          image: '',
          category: 'consultation',
          staffIds: [staffId],
          bufferBeforeMinutes: 0,
          bufferAfterMinutes: 0,
          slotStepMinutes: 30,
          isActive: true,
          paymentMode: 'paid',
          priceAmount: 5000,
          priceCurrency: 'TWD',
          depositAmount: 1500,
          cancellationPolicyId: 'standard-24h',
        },
      });
      expect(serviceResponse.status()).toBe(201);
      const servicePayload = servicePayloadSchema.parse(await serviceResponse.json());
      serviceId = servicePayload.service.serviceId;
      expect(servicePayload.service).toMatchObject({ paymentMode: 'paid', depositAmount: 1500 });

      const availabilityResponse = await page.request.patch(`/api/builder/bookings/staff/${staffId}/availability`, {
        headers,
        data: { weekly: allWeek('09:00', '17:00'), blockedDates: [], timezone: 'Asia/Seoul' },
      });
      expect(availabilityResponse.status()).toBe(200);

      const startAt = await firstAvailableSlot(page.request, serviceId, staffId, headers);
      const bookingResponse = await page.request.post('/api/builder/bookings/admin-create', {
        headers,
        data: {
          serviceId,
          staffId,
          startAt,
          status: 'confirmed',
          paymentIntentId,
          customerTimezone: 'Asia/Seoul',
          customer: {
            name: `보증금 고객 ${token}`,
            email: `deposit-refund-${token}@example.com`,
            phone: '+82-10-2222-3333',
            locale: 'ko',
          },
        },
      });
      expect(bookingResponse.status()).toBe(201);
      const bookingPayload = bookingPayloadSchema.parse(await bookingResponse.json());
      bookingId = bookingPayload.booking.bookingId;
      expect(bookingPayload.booking).toMatchObject({ paymentStatus: 'unpaid', paymentDueNow: 1500, depositAmount: 1500 });

      const webhookResponse = await page.request.post('/api/booking/stripe-webhook', {
        headers,
        data: {
          id: `evt_deposit_${token}`,
          type: 'payment_intent.succeeded',
          data: { object: { id: paymentIntentId, amount: 1500, currency: 'twd' } },
        },
      });
      expect(webhookResponse.status()).toBe(200);

      const manageToken = createBookingManageToken(bookingPayload.booking);
      const manageResponse = await page.request.get(`/api/booking/manage/${encodeURIComponent(manageToken)}`, { headers });
      expect(manageResponse.status()).toBe(200);
      const paidPayload = bookingPayloadSchema.parse(await manageResponse.json());
      expect(paidPayload.booking).toMatchObject({ paymentStatus: 'partially_paid', onlinePaidAmount: 1500 });

      const cancelResponse = await page.request.post('/api/booking/cancel', {
        headers,
        data: { bookingId, token: manageToken, reason: 'deposit refund cap check' },
      });
      expect(cancelResponse.status()).toBe(200);
      const cancelPayload = cancelPayloadSchema.parse(await cancelResponse.json());
      expect(cancelPayload.refundAmountCents).toBe(1500);
      expect(['partially_paid', 'refunded']).toContain(cancelPayload.booking.paymentStatus);
    } finally {
      if (bookingId) {
        await page.request.patch(`/api/builder/bookings/${bookingId}`, { headers, data: { status: 'cancelled' }, failOnStatusCode: false });
      }
      if (serviceId) {
        await page.request.delete(`/api/builder/bookings/services/${serviceId}`, { headers, failOnStatusCode: false });
      }
      if (staffId) {
        await page.request.delete(`/api/builder/bookings/staff/${staffId}`, { headers, failOnStatusCode: false });
      }
    }
  });
});

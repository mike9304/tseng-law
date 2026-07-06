import type { APIResponse, Page } from '@playwright/test';

import { cleanupFiles } from './W200-booking-widget-cleanup';

type BookingStatus = 'pending' | 'confirmed' | 'cancelled' | 'completed' | 'no-show';

type FixtureRequest = {
  readonly page: Page;
  readonly headers: Record<string, string>;
  readonly token: string;
  readonly checkpoint: 'W213' | 'W214';
};

type ServiceFixtureRequest = FixtureRequest & {
  readonly staffId: string;
  readonly paid: boolean;
  readonly priceAmount: number;
};

type BookingFixtureRequest = ServiceFixtureRequest & {
  readonly serviceId: string;
  readonly startAt: string;
  readonly status: BookingStatus;
  readonly label: string;
  readonly customerEmail: string;
  readonly customerName: string;
  readonly paymentIntentId?: string;
};

type SlotRecord = {
  readonly startAt: string;
};

export type InsightEntity = {
  readonly id: string;
  readonly nameKo: string;
};

export type InsightBookingRecord = {
  readonly bookingId: string;
  readonly customerEmail: string;
  readonly customerName: string;
};

export type InsightFixtureState = {
  staffId: string | null;
  serviceId: string | null;
  bookingIds: string[];
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function stringValue(value: unknown): string | undefined {
  return typeof value === 'string' ? value : undefined;
}

async function readJson(response: APIResponse): Promise<unknown> {
  try {
    return await response.json();
  } catch (error) {
    if (error instanceof Error) return null;
    throw error;
  }
}

function parseEntity(payload: unknown, key: 'staff' | 'service', idKey: 'staffId' | 'serviceId'): string | null {
  if (!isRecord(payload) || !isRecord(payload[key])) return null;
  return stringValue(payload[key][idKey]) ?? null;
}

function parseSlots(payload: unknown): readonly SlotRecord[] {
  if (!isRecord(payload) || !Array.isArray(payload.slots)) return [];
  return payload.slots.flatMap((item) => {
    if (!isRecord(item)) return [];
    const startAt = stringValue(item.startAt);
    return startAt ? [{ startAt }] : [];
  });
}

function parseBooking(payload: unknown): InsightBookingRecord | null {
  const booking = isRecord(payload) && isRecord(payload.booking) ? payload.booking : null;
  const customer = isRecord(booking?.customer) ? booking.customer : null;
  const bookingId = stringValue(booking?.bookingId);
  const customerEmail = stringValue(customer?.email);
  const customerName = stringValue(customer?.name);
  if (!bookingId || !customerEmail || !customerName) return null;
  return { bookingId, customerEmail, customerName };
}

function allWeek(start: string, end: string) {
  return {
    monday: [{ start, end }],
    tuesday: [{ start, end }],
    wednesday: [{ start, end }],
    thursday: [{ start, end }],
    friday: [{ start, end }],
    saturday: [{ start, end }],
    sunday: [{ start, end }],
  };
}

export function insightWeekdayDate(minDaysFromToday: number): string {
  const today = new Date();
  for (let offset = minDaysFromToday; offset < minDaysFromToday + 30; offset += 1) {
    const candidate = new Date(Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate() + offset, 12));
    const day = candidate.getUTCDay();
    if (day >= 1 && day <= 5) return candidate.toISOString().slice(0, 10);
  }
  throw new Error('future weekday not found for booking insights QA');
}

export function bookingHeaders(scope: string): Record<string, string> {
  const username = process.env.BUILDER_SMOKE_USERNAME ?? process.env.CMS_ADMIN_USERNAME ?? 'admin';
  const password = process.env.BUILDER_SMOKE_PASSWORD ?? process.env.CMS_ADMIN_PASSWORD ?? 'local-review-2026!';
  const safeScope = scope.replace(/[^a-z0-9-]/gi, '-').slice(-48) || 'booking-insights';
  return {
    authorization: `Basic ${Buffer.from(`${username}:${password}`).toString('base64')}`,
    'x-forwarded-for': `qa-${safeScope}`,
  };
}

export async function createInsightStaff(request: FixtureRequest): Promise<InsightEntity | null> {
  const nameKo = `${request.checkpoint} 담당자 ${request.token}`;
  const response = await request.page.request.post('/api/builder/bookings/staff?locale=ko', {
    headers: request.headers,
    data: {
      name: { ko: nameKo, en: `${nameKo} EN`, 'zh-hant': `${nameKo} ZH` },
      title: { ko: '예약 인사이트 담당', en: 'Booking insights attorney', 'zh-hant': '預約分析律師' },
      bio: { ko: `${request.checkpoint} 예약 인사이트 검증`, en: '', 'zh-hant': '' },
      email: `${request.checkpoint.toLowerCase()}-${request.token}@example.com`,
      photo: '',
      isActive: true,
    },
  });
  const id = response.ok() ? parseEntity(await readJson(response), 'staff', 'staffId') : null;
  return id ? { id, nameKo } : null;
}

export async function createInsightService(request: ServiceFixtureRequest): Promise<InsightEntity | null> {
  const nameKo = `${request.checkpoint} ${request.paid ? '유료' : '고객'} 상담 ${request.token}`;
  const response = await request.page.request.post('/api/builder/bookings/services?locale=ko', {
    headers: request.headers,
    data: {
      name: { ko: nameKo, en: `${nameKo} EN`, 'zh-hant': `${nameKo} ZH` },
      description: { ko: `${request.checkpoint} 예약 인사이트 검증`, en: '', 'zh-hant': '' },
      durationMinutes: 30,
      priceTwd: request.priceAmount,
      image: '',
      category: `${request.checkpoint.toLowerCase()}-${request.token}`,
      staffIds: [request.staffId],
      requiredResourceIds: [],
      bufferBeforeMinutes: 0,
      bufferAfterMinutes: 0,
      slotStepMinutes: 30,
      maxParticipants: 1,
      isActive: true,
      paymentMode: request.paid ? 'paid' : 'free',
      priceAmount: request.priceAmount,
      priceCurrency: 'TWD',
      meetingMode: 'in-person',
    },
  });
  const id = response.ok() ? parseEntity(await readJson(response), 'service', 'serviceId') : null;
  return id ? { id, nameKo } : null;
}

export async function saveInsightAvailability(request: FixtureRequest & { readonly staffId: string }): Promise<boolean> {
  const response = await request.page.request.patch(`/api/builder/bookings/staff/${request.staffId}/availability?locale=ko`, {
    headers: request.headers,
    data: {
      weekly: allWeek('09:00', '13:00'),
      blockedDates: [],
      dateOverrides: [],
      timezone: 'Asia/Seoul',
      holidayCalendar: 'none',
    },
  });
  return response.ok();
}

export async function fetchInsightSlots(
  page: Page,
  headers: Record<string, string>,
  serviceId: string,
  staffId: string,
  date: string,
  minimum: number,
): Promise<readonly SlotRecord[]> {
  const response = await page.request.get(
    `/api/booking/availability?serviceId=${encodeURIComponent(serviceId)}&staffId=${encodeURIComponent(staffId)}&date=${encodeURIComponent(date)}`,
    { headers, timeout: 45_000 },
  );
  if (!response.ok()) return [];
  return parseSlots(await readJson(response)).slice(0, minimum);
}

export async function createInsightBooking(request: BookingFixtureRequest): Promise<InsightBookingRecord | null> {
  const response = await request.page.request.post('/api/builder/bookings/admin-create?locale=ko', {
    headers: request.headers,
    timeout: 45_000,
    data: {
      serviceId: request.serviceId,
      staffId: request.staffId,
      startAt: request.startAt,
      status: request.status,
      ...(request.paymentIntentId ? { paymentIntentId: request.paymentIntentId } : {}),
      customerTimezone: 'Asia/Seoul',
      customer: {
        name: request.customerName,
        email: request.customerEmail,
        phone: '+82-10-2130-0000',
        notes: `${request.checkpoint} ${request.label} booking insights row`,
        caseSummary: `${request.checkpoint} ${request.label} profile and analytics fixture`,
        locale: 'ko',
      },
    },
  });
  return response.ok() ? parseBooking(await readJson(response)) : null;
}

export async function markInsightBookingPaid(
  page: Page,
  headers: Record<string, string>,
  token: string,
  paymentIntentId: string,
  amount: number,
): Promise<boolean> {
  const response = await page.request.post('/api/booking/stripe-webhook', {
    headers,
    data: {
      id: `evt-${token}`,
      type: 'payment_intent.succeeded',
      data: { object: { id: paymentIntentId, amount, currency: 'twd' } },
    },
  });
  return response.ok();
}

export async function cleanupInsightFixture(state: InsightFixtureState): Promise<void> {
  for (const bookingId of state.bookingIds) {
    await cleanupFiles({ staffId: null, serviceId: null, bookingId, pageId: null });
  }
  await cleanupFiles({ staffId: state.staffId, serviceId: state.serviceId, bookingId: null, pageId: null });
}

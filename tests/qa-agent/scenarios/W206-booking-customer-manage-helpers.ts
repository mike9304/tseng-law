import type { Page } from '@playwright/test';
import type { Booking, DayOfWeek } from '@/lib/builder/bookings/types';
import { normalizeLocale } from '@/lib/locales';

type FixtureRequest = {
  readonly page: Page;
  readonly headers: Record<string, string>;
  readonly token: string;
};

type ServiceRequest = FixtureRequest & {
  readonly staffId: string;
  readonly label: string;
  readonly policyId: 'standard-24h' | 'strict-48h';
};

type AvailabilityRequest = FixtureRequest & {
  readonly staffId: string;
  readonly start: string;
  readonly end: string;
};

type BookingRequest = ServiceRequest & {
  readonly serviceId: string;
  readonly startAt: string;
};

type JsonResponseLike = {
  readonly ok: () => boolean;
  readonly json: () => Promise<unknown>;
};

type AvailabilityBlock = {
  readonly start: string;
  readonly end: string;
};

type SlotRecord = {
  readonly startAt: string;
};

export type ManageBookingRecord = Pick<Booking, 'bookingId' | 'customer'> & {
  readonly serviceId: string;
  readonly staffId: string;
  readonly startAt: string;
  readonly status: string;
};

export type ManagePatchRecord = {
  readonly startAt: string;
  readonly staffId: string;
  readonly status: string;
  readonly cancellationReason: string | undefined;
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function stringValue(value: unknown): string | undefined {
  return typeof value === 'string' ? value : undefined;
}

async function readJson(response: JsonResponseLike): Promise<unknown> {
  try {
    return await response.json();
  } catch (error) {
    if (error instanceof Error) {
      return null;
    }
    throw error;
  }
}

function parseEntityId(payload: unknown, key: 'staff' | 'service', idKey: 'staffId' | 'serviceId'): string | null {
  if (!isRecord(payload) || !isRecord(payload[key])) {
    return null;
  }
  return stringValue(payload[key][idKey]) ?? null;
}

function allWeek(start: string, end: string): Record<DayOfWeek, readonly AvailabilityBlock[]> {
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

function parseSlots(payload: unknown): readonly SlotRecord[] {
  if (!isRecord(payload) || !Array.isArray(payload.slots)) {
    return [];
  }
  return payload.slots.flatMap((item) => {
    if (!isRecord(item)) {
      return [];
    }
    const startAt = stringValue(item.startAt);
    return startAt ? [{ startAt }] : [];
  });
}

function parseBooking(payload: unknown): ManageBookingRecord | null {
  const booking = isRecord(payload) && isRecord(payload.booking) ? payload.booking : null;
  const customer = isRecord(booking?.customer) ? booking.customer : null;
  const bookingId = stringValue(booking?.bookingId);
  const serviceId = stringValue(booking?.serviceId);
  const staffId = stringValue(booking?.staffId);
  const startAt = stringValue(booking?.startAt);
  const status = stringValue(booking?.status);
  const name = stringValue(customer?.name);
  const email = stringValue(customer?.email);
  if (!bookingId || !serviceId || !staffId || !startAt || !status || !name || !email) {
    return null;
  }
  return {
    bookingId,
    serviceId,
    staffId,
    startAt,
    status,
    customer: {
      name,
      email,
      phone: stringValue(customer?.phone),
      notes: stringValue(customer?.notes),
      caseSummary: stringValue(customer?.caseSummary),
      locale: normalizeLocale(stringValue(customer?.locale)),
    },
  };
}

export function manageFutureWeekdayDate(minDaysFromToday: number): string {
  const today = new Date();
  for (let offset = minDaysFromToday; offset < minDaysFromToday + 30; offset += 1) {
    const candidate = new Date(Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate() + offset, 12));
    const day = candidate.getUTCDay();
    if (day >= 1 && day <= 5) {
      return candidate.toISOString().slice(0, 10);
    }
  }
  throw new Error('W206 future weekday not found');
}

export function toLocalInputValue(iso: string): string {
  const date = new Date(iso);
  const local = new Date(date.getTime() - date.getTimezoneOffset() * 60_000);
  return local.toISOString().slice(0, 16);
}

export async function createManageStaff(request: FixtureRequest): Promise<string | null> {
  const response = await request.page.request.post('/api/builder/bookings/staff?locale=ko', {
    headers: request.headers,
    data: {
      name: { ko: `W206 고객 링크 담당자 ${request.token}`, en: `W206 Manage Staff ${request.token}`, 'zh-hant': `W206 管理人員 ${request.token}` },
      title: { ko: '고객 링크 담당', en: 'Customer manage attorney', 'zh-hant': '客戶管理律師' },
      bio: { ko: `W206 고객 링크 검증 ${request.token}`, en: '', 'zh-hant': '' },
      email: `w206-manage-${request.token}@example.com`,
      photo: '',
      isActive: true,
    },
  });
  return response.ok() ? parseEntityId(await readJson(response), 'staff', 'staffId') : null;
}

export async function createManageService(request: ServiceRequest): Promise<string | null> {
  const response = await request.page.request.post('/api/builder/bookings/services?locale=ko', {
    headers: request.headers,
    data: {
      name: { ko: `W206 ${request.label} 상담 ${request.token}`, en: `W206 ${request.label} Consultation ${request.token}`, 'zh-hant': `W206 ${request.label} 諮詢 ${request.token}` },
      description: { ko: `W206 ${request.label} 고객 링크 검증`, en: '', 'zh-hant': '' },
      durationMinutes: 30,
      priceTwd: 0,
      image: '',
      category: `w206-${request.token}`,
      staffIds: [request.staffId],
      requiredResourceIds: [],
      bufferBeforeMinutes: 0,
      bufferAfterMinutes: 0,
      slotStepMinutes: 30,
      maxParticipants: 1,
      isActive: true,
      paymentMode: 'free',
      priceAmount: 0,
      priceCurrency: 'TWD',
      meetingMode: 'in-person',
      cancellationPolicyId: request.policyId,
    },
  });
  return response.ok() ? parseEntityId(await readJson(response), 'service', 'serviceId') : null;
}

export async function saveManageAvailability(request: AvailabilityRequest): Promise<boolean> {
  const response = await request.page.request.patch(`/api/builder/bookings/staff/${request.staffId}/availability?locale=ko`, {
    headers: request.headers,
    data: {
      weekly: allWeek(request.start, request.end),
      blockedDates: [],
      dateOverrides: [],
      timezone: 'Asia/Seoul',
      holidayCalendar: 'none',
    },
  });
  return response.ok();
}

export async function fetchManageSlots(
  page: Page,
  headers: Record<string, string>,
  serviceId: string,
  staffId: string,
  date: string,
): Promise<readonly SlotRecord[]> {
  const response = await page.request.get(
    `/api/booking/availability?serviceId=${encodeURIComponent(serviceId)}&staffId=${encodeURIComponent(staffId)}&date=${encodeURIComponent(date)}`,
    { headers, timeout: 45_000 },
  );
  return response.ok() ? parseSlots(await readJson(response)) : [];
}

export async function createManageBooking(request: BookingRequest): Promise<ManageBookingRecord | null> {
  const response = await request.page.request.post('/api/builder/bookings/admin-create?locale=ko', {
    headers: request.headers,
    timeout: 45_000,
    data: {
      serviceId: request.serviceId,
      staffId: request.staffId,
      startAt: request.startAt,
      status: 'confirmed',
      customerTimezone: 'Asia/Seoul',
      customer: {
        name: `W206 ${request.label} 고객 ${request.token}`,
        email: `w206-${request.label}-${request.token}@example.com`,
        phone: '+82-10-2060-0000',
        notes: `W206 ${request.label} customer manage link`,
        caseSummary: '고객 링크로 일정 변경 후 취소합니다.',
        locale: 'ko',
      },
    },
  });
  return response.ok() ? parseBooking(await readJson(response)) : null;
}

export async function parseManagePatchResponse(response: JsonResponseLike): Promise<ManagePatchRecord | null> {
  if (!response.ok()) {
    return null;
  }
  const payload = await readJson(response);
  const booking = isRecord(payload) && isRecord(payload.booking) ? payload.booking : null;
  const startAt = stringValue(booking?.startAt);
  const staffId = stringValue(booking?.staffId);
  const status = stringValue(booking?.status);
  if (!startAt || !staffId || !status) {
    return null;
  }
  return { startAt, staffId, status, cancellationReason: stringValue(booking?.cancellationReason) };
}

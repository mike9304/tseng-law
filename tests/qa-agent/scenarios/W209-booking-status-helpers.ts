import type { Page } from '@playwright/test';

type FixtureRequest = {
  readonly page: Page;
  readonly headers: Record<string, string>;
  readonly token: string;
};

type ServiceFixtureRequest = FixtureRequest & {
  readonly staffId: string;
};

type SlotRequest = {
  readonly page: Page;
  readonly headers: Record<string, string>;
  readonly serviceId: string;
  readonly staffId: string;
  readonly date: string;
};

type BookingFixtureRequest = ServiceFixtureRequest & {
  readonly serviceId: string;
  readonly startAt: string;
};

type SlotRecord = {
  readonly startAt: string;
};

type JsonResponseLike = {
  readonly ok: () => boolean;
  readonly json: () => Promise<unknown>;
};

export type StatusTransition = 'confirmed' | 'completed' | 'no-show' | 'cancelled';

type StatusBookingStatus = 'pending' | StatusTransition;

export type StatusBookingRecord = {
  readonly bookingId: string;
  readonly serviceId: string;
  readonly staffId: string;
  readonly startAt: string;
  readonly status: StatusBookingStatus;
  readonly customerName: string;
  readonly customerEmail: string;
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

function parseStatus(value: unknown): StatusBookingStatus | null {
  switch (stringValue(value)) {
    case 'pending':
      return 'pending';
    case 'confirmed':
      return 'confirmed';
    case 'completed':
      return 'completed';
    case 'no-show':
      return 'no-show';
    case 'cancelled':
      return 'cancelled';
    default:
      return null;
  }
}

function parseBooking(payload: unknown): StatusBookingRecord | null {
  const envelope = isRecord(payload) ? payload : null;
  const booking = isRecord(envelope?.booking) ? envelope.booking : null;
  const customer = isRecord(booking?.customer) ? booking.customer : null;
  const bookingId = stringValue(booking?.bookingId);
  const serviceId = stringValue(booking?.serviceId);
  const staffId = stringValue(booking?.staffId);
  const startAt = stringValue(booking?.startAt);
  const status = parseStatus(booking?.status);
  const customerName = stringValue(customer?.name);
  const customerEmail = stringValue(customer?.email);
  if (!bookingId || !serviceId || !staffId || !startAt || !status || !customerName || !customerEmail) {
    return null;
  }
  return { bookingId, serviceId, staffId, startAt, status, customerName, customerEmail };
}

export function statusWeekdayDate(minDaysFromToday: number): string {
  const today = new Date();
  for (let offset = minDaysFromToday; offset < minDaysFromToday + 30; offset += 1) {
    const candidate = new Date(Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate() + offset, 12));
    const day = candidate.getUTCDay();
    if (day >= 1 && day <= 5) {
      return candidate.toISOString().slice(0, 10);
    }
  }
  throw new Error('W209 future weekday not found');
}

export async function createStatusStaff(request: FixtureRequest): Promise<string | null> {
  const response = await request.page.request.post('/api/builder/bookings/staff?locale=ko', {
    headers: request.headers,
    data: {
      name: { ko: `W209 상태 담당자 ${request.token}`, en: `W209 Status Staff ${request.token}`, 'zh-hant': `W209 狀態人員 ${request.token}` },
      title: { ko: '상태 전이 검증 변호사', en: 'Status transition attorney', 'zh-hant': '狀態驗證律師' },
      bio: { ko: `W209 상태 전이 검증 ${request.token}`, en: '', 'zh-hant': '' },
      email: `w209-status-${request.token}@example.com`,
      photo: '',
      isActive: true,
    },
  });
  return response.ok() ? parseEntityId(await readJson(response), 'staff', 'staffId') : null;
}

export async function createStatusService(request: ServiceFixtureRequest): Promise<string | null> {
  const response = await request.page.request.post('/api/builder/bookings/services?locale=ko', {
    headers: request.headers,
    data: {
      name: { ko: `W209 상태 상담 ${request.token}`, en: `W209 Status Consultation ${request.token}`, 'zh-hant': `W209 狀態諮詢 ${request.token}` },
      description: { ko: `W209 booking status transition ${request.token}`, en: '', 'zh-hant': '' },
      durationMinutes: 30,
      priceTwd: 0,
      image: '',
      category: `w209-${request.token}`,
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
    },
  });
  return response.ok() ? parseEntityId(await readJson(response), 'service', 'serviceId') : null;
}

export async function fetchFirstStatusSlot(request: SlotRequest): Promise<string | null> {
  const response = await request.page.request.get(
    `/api/booking/availability?serviceId=${encodeURIComponent(request.serviceId)}&staffId=${encodeURIComponent(request.staffId)}&date=${encodeURIComponent(request.date)}`,
    { headers: request.headers, timeout: 45_000 },
  );
  return response.ok() ? parseSlots(await readJson(response))[0]?.startAt ?? null : null;
}

export async function createStatusBooking(request: BookingFixtureRequest): Promise<StatusBookingRecord | null> {
  const response = await request.page.request.post('/api/builder/bookings/admin-create?locale=ko', {
    headers: request.headers,
    timeout: 45_000,
    data: {
      serviceId: request.serviceId,
      staffId: request.staffId,
      startAt: request.startAt,
      status: 'pending',
      customerTimezone: 'Asia/Seoul',
      customer: {
        name: `W209 상태 고객 ${request.token}`,
        email: `w209-status-customer-${request.token}@example.com`,
        phone: '+82-10-2090-0000',
        notes: `W209 status transition row ${request.token}`,
        caseSummary: `W209 상태 전이와 타임라인 확인 ${request.token}`,
        locale: 'ko',
      },
    },
  });
  return response.ok() ? parseBooking(await readJson(response)) : null;
}

export async function readPatchedStatus(response: JsonResponseLike): Promise<StatusTransition | null> {
  if (!response.ok()) {
    return null;
  }
  const parsed = parseBooking(await readJson(response));
  if (!parsed || parsed.status === 'pending') {
    return null;
  }
  return parsed.status;
}

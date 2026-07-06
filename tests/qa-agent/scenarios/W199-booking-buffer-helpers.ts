import type { APIResponse, Page } from '@playwright/test';

export type SlotRecord = {
  readonly startAt: string;
  readonly endAt: string;
};

export type ServiceRecord = {
  readonly serviceId: string;
  readonly nameKo: string | undefined;
  readonly staffIds: readonly string[];
  readonly bufferBeforeMinutes: number | undefined;
  readonly bufferAfterMinutes: number | undefined;
  readonly slotStepMinutes: number | undefined;
};

type AvailabilityBlock = {
  readonly start: string;
  readonly end: string;
};

type FixtureRequest = {
  readonly page: Page;
  readonly headers: Record<string, string>;
  readonly token: string;
};

type ServiceFixtureRequest = FixtureRequest & {
  readonly staffId: string;
};

type SlotsRequest = {
  readonly page: Page;
  readonly headers: Record<string, string>;
  readonly serviceId: string;
  readonly staffId: string;
  readonly date: string;
};

type BookingRequest = SlotsRequest & {
  readonly startAt: string;
  readonly token: string;
};

type Day =
  | 'monday'
  | 'tuesday'
  | 'wednesday'
  | 'thursday'
  | 'friday'
  | 'saturday'
  | 'sunday';

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function stringValue(value: unknown): string | undefined {
  return typeof value === 'string' ? value : undefined;
}

function numberValue(value: unknown): number | undefined {
  return typeof value === 'number' && Number.isFinite(value) ? value : undefined;
}

function stringArray(value: unknown): readonly string[] {
  if (!Array.isArray(value)) {
    return [];
  }
  return value.filter((item): item is string => typeof item === 'string');
}

async function readJson(response: APIResponse): Promise<unknown> {
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

function parseBookingId(payload: unknown): string | null {
  const booking = isRecord(payload) ? payload.booking : null;
  return isRecord(booking) ? stringValue(booking.bookingId) ?? null : null;
}

function parseService(value: unknown): ServiceRecord | null {
  if (!isRecord(value)) {
    return null;
  }
  const serviceId = stringValue(value.serviceId);
  if (!serviceId) {
    return null;
  }
  const name = isRecord(value.name) ? value.name : {};
  return {
    serviceId,
    nameKo: stringValue(name.ko),
    staffIds: stringArray(value.staffIds),
    bufferBeforeMinutes: numberValue(value.bufferBeforeMinutes),
    bufferAfterMinutes: numberValue(value.bufferAfterMinutes),
    slotStepMinutes: numberValue(value.slotStepMinutes),
  };
}

function parseServices(payload: unknown): readonly ServiceRecord[] {
  if (!isRecord(payload) || !Array.isArray(payload.services)) {
    return [];
  }
  return payload.services.map(parseService).filter((service): service is ServiceRecord => service !== null);
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
    const endAt = stringValue(item.endAt);
    return startAt && endAt ? [{ startAt, endAt }] : [];
  });
}

function allWeek(start: string, end: string): Record<Day, readonly AvailabilityBlock[]> {
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

export function bookingHeaders(scope: string): Record<string, string> {
  const username = process.env.BUILDER_SMOKE_USERNAME ?? process.env.CMS_ADMIN_USERNAME ?? 'admin';
  const password = process.env.BUILDER_SMOKE_PASSWORD ?? process.env.CMS_ADMIN_PASSWORD ?? 'local-review-2026!';
  const safeScope = scope.replace(/[^a-z0-9-]/gi, '-').slice(-48) || 'w199-buffer';
  return {
    authorization: `Basic ${Buffer.from(`${username}:${password}`).toString('base64')}`,
    'x-forwarded-for': `qa-${safeScope}`,
  };
}

export function nextWeekdayDate(): string {
  const now = new Date();
  for (let offset = 10; offset < 40; offset += 1) {
    const candidate = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() + offset, 12));
    const day = candidate.getUTCDay();
    if (day >= 1 && day <= 5) {
      return candidate.toISOString().slice(0, 10);
    }
  }
  throw new Error('future weekday not found');
}

export function minutesBetween(startAt: string, endAt: string): number {
  return Math.round((Date.parse(endAt) - Date.parse(startAt)) / 60_000);
}

export function firstStepMismatch(slots: readonly SlotRecord[], expectedMinutes: number): string | null {
  const sample = slots.slice(0, Math.min(slots.length, 8));
  for (let index = 1; index < sample.length; index += 1) {
    const previous = sample[index - 1];
    const current = sample[index];
    if (!previous || !current) {
      return `slot sample ${index} missing`;
    }
    const actual = minutesBetween(previous.startAt, current.startAt);
    if (actual !== expectedMinutes) {
      return `${previous.startAt} -> ${current.startAt} was ${actual} minutes`;
    }
  }
  return null;
}

export async function createStaff(request: FixtureRequest): Promise<string | null> {
  const response = await request.page.request.post('/api/builder/bookings/staff?locale=ko', {
    headers: request.headers,
    data: {
      name: { ko: `W199 버퍼 담당자 ${request.token}`, en: `W199 Buffer Staff ${request.token}`, 'zh-hant': `W199 緩衝人員 ${request.token}` },
      title: { ko: '버퍼 검증 변호사', en: 'Buffer verification attorney', 'zh-hant': '緩衝驗證律師' },
      bio: { ko: `W199 버퍼 검증 ${request.token}`, en: `W199 buffer check ${request.token}`, 'zh-hant': `W199 緩衝驗證 ${request.token}` },
      email: `w199-${request.token}@example.com`,
      photo: '',
      isActive: true,
    },
  });
  return response.ok() ? parseEntityId(await readJson(response), 'staff', 'staffId') : null;
}

export async function createService(request: ServiceFixtureRequest): Promise<string | null> {
  const response = await request.page.request.post('/api/builder/bookings/services?locale=ko', {
    headers: request.headers,
    data: {
      name: { ko: `W199 버퍼 상담 ${request.token}`, en: `W199 Buffer Service ${request.token}`, 'zh-hant': `W199 緩衝諮詢 ${request.token}` },
      description: { ko: `W199 버퍼/간격 검증 ${request.token}`, en: '', 'zh-hant': '' },
      durationMinutes: 30,
      priceTwd: 0,
      image: '',
      category: `w199-${request.token}`,
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

export async function saveAvailability(request: ServiceFixtureRequest): Promise<boolean> {
  const response = await request.page.request.patch(`/api/builder/bookings/staff/${request.staffId}/availability?locale=ko`, {
    headers: request.headers,
    data: {
      weekly: allWeek('09:00', '12:00'),
      blockedDates: [],
      dateOverrides: [],
      timezone: 'Asia/Seoul',
      holidayCalendar: 'none',
    },
  });
  return response.ok();
}

export async function fetchService(page: Page, serviceId: string, headers: Record<string, string>): Promise<ServiceRecord | null> {
  const response = await page.request.get('/api/builder/bookings/services?includeInactive=1', { headers });
  if (!response.ok()) {
    return null;
  }
  return parseServices(await readJson(response)).find((service) => service.serviceId === serviceId) ?? null;
}

export async function fetchSlots(request: SlotsRequest): Promise<readonly SlotRecord[]> {
  const response = await request.page.request.get(`/api/booking/availability?serviceId=${request.serviceId}&staffId=${request.staffId}&date=${request.date}&locale=ko`, {
    headers: request.headers,
  });
  return response.ok() ? parseSlots(await readJson(response)) : [];
}

export async function createBooking(request: BookingRequest): Promise<string | null> {
  const response = await request.page.request.post('/api/builder/bookings/admin-create?locale=ko', {
    headers: request.headers,
    data: {
      serviceId: request.serviceId,
      staffId: request.staffId,
      startAt: request.startAt,
      status: 'confirmed',
      customerTimezone: 'Asia/Seoul',
      customer: {
        name: `W199 버퍼 고객 ${request.token}`,
        email: `w199-booking-${request.token}@example.com`,
        phone: '+82109990000',
        locale: 'ko',
      },
    },
  });
  return response.ok() ? parseBookingId(await readJson(response)) : null;
}

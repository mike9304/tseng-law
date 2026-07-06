import type { APIResponse, Page } from '@playwright/test';

type FixtureRequest = {
  readonly page: Page;
  readonly headers: Record<string, string>;
  readonly token: string;
  readonly label: string;
};

type ServiceFixtureRequest = FixtureRequest & {
  readonly staffId: string;
};

type BookingFixtureRequest = ServiceFixtureRequest & {
  readonly serviceId: string;
  readonly startAt: string;
  readonly status: CalendarBookingStatus;
};

type SlotRecord = {
  readonly startAt: string;
};

type CalendarBookingStatus = 'pending' | 'confirmed';

export type CalendarBookingRecord = {
  readonly bookingId: string;
  readonly serviceId: string;
  readonly staffId: string;
  readonly startAt: string;
  readonly customerName: string;
  readonly serviceNameKo: string;
  readonly staffNameKo: string;
};

export type CalendarMonthDate = {
  readonly month: string;
  readonly date: string;
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

function parseBooking(payload: unknown): CalendarBookingRecord | null {
  const envelope = isRecord(payload) ? payload : null;
  const booking = isRecord(envelope?.booking) ? envelope.booking : null;
  const customer = isRecord(booking?.customer) ? booking.customer : null;
  const bookingId = stringValue(booking?.bookingId);
  const serviceId = stringValue(booking?.serviceId);
  const staffId = stringValue(booking?.staffId);
  const startAt = stringValue(booking?.startAt);
  const customerName = stringValue(customer?.name);
  if (!bookingId || !serviceId || !staffId || !startAt || !customerName) {
    return null;
  }
  return {
    bookingId,
    serviceId,
    staffId,
    startAt,
    customerName,
    serviceNameKo: '',
    staffNameKo: '',
  };
}

export function nextCalendarMonthDate(): CalendarMonthDate {
  const today = new Date();
  for (let monthOffset = 1; monthOffset <= 18; monthOffset += 1) {
    const first = new Date(Date.UTC(today.getUTCFullYear(), today.getUTCMonth() + monthOffset, 1, 12));
    const day = first.getUTCDay();
    if (day >= 1 && day <= 5) {
      const month = `${first.getUTCFullYear()}-${String(first.getUTCMonth() + 1).padStart(2, '0')}`;
      return { month, date: `${month}-01` };
    }
  }
  throw new Error('W208 future weekday month not found');
}

export async function createCalendarStaff(request: FixtureRequest): Promise<string | null> {
  const staffName = `W208 ${request.label} 담당자 ${request.token}`;
  const response = await request.page.request.post('/api/builder/bookings/staff?locale=ko', {
    headers: request.headers,
    data: {
      name: { ko: staffName, en: `${staffName} EN`, 'zh-hant': `${staffName} ZH` },
      title: { ko: '캘린더 검증 변호사', en: 'Calendar verification attorney', 'zh-hant': '行事曆驗證律師' },
      bio: { ko: `W208 ${request.label} 캘린더 검증`, en: '', 'zh-hant': '' },
      email: `w208-${request.label}-${request.token}@example.com`,
      photo: '',
      isActive: true,
    },
  });
  return response.ok() ? parseEntityId(await readJson(response), 'staff', 'staffId') : null;
}

export async function createCalendarService(request: ServiceFixtureRequest): Promise<string | null> {
  const serviceName = `W208 ${request.label} 상담 ${request.token}`;
  const response = await request.page.request.post('/api/builder/bookings/services?locale=ko', {
    headers: request.headers,
    data: {
      name: { ko: serviceName, en: `${serviceName} EN`, 'zh-hant': `${serviceName} ZH` },
      description: { ko: `W208 ${request.label} 캘린더 view 검증`, en: '', 'zh-hant': '' },
      durationMinutes: 30,
      priceTwd: 0,
      image: '',
      category: `w208-${request.token}`,
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

export async function fetchFirstCalendarSlot(
  page: Page,
  headers: Record<string, string>,
  serviceId: string,
  staffId: string,
  date: string,
): Promise<string | null> {
  const response = await page.request.get(
    `/api/booking/availability?serviceId=${encodeURIComponent(serviceId)}&staffId=${encodeURIComponent(staffId)}&date=${encodeURIComponent(date)}`,
    { headers, timeout: 45_000 },
  );
  return response.ok() ? parseSlots(await readJson(response))[0]?.startAt ?? null : null;
}

export async function createCalendarBooking(request: BookingFixtureRequest): Promise<CalendarBookingRecord | null> {
  const staffNameKo = `W208 ${request.label} 담당자 ${request.token}`;
  const serviceNameKo = `W208 ${request.label} 상담 ${request.token}`;
  const response = await request.page.request.post('/api/builder/bookings/admin-create?locale=ko', {
    headers: request.headers,
    timeout: 45_000,
    data: {
      serviceId: request.serviceId,
      staffId: request.staffId,
      startAt: request.startAt,
      status: request.status,
      customerTimezone: 'Asia/Seoul',
      customer: {
        name: `W208 ${request.label} 고객 ${request.token}`,
        email: `w208-${request.label}-customer-${request.token}@example.com`,
        phone: '+82-10-2080-0000',
        notes: `W208 ${request.label} calendar row`,
        caseSummary: `W208 ${request.label} 캘린더 view 확인`,
        locale: 'ko',
      },
    },
  });
  const booking = response.ok() ? parseBooking(await readJson(response)) : null;
  return booking ? { ...booking, serviceNameKo, staffNameKo } : null;
}

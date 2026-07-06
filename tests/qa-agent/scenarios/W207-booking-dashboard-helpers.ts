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
  readonly status: DashboardBookingStatus;
};

type SlotRecord = {
  readonly startAt: string;
};

type DashboardBookingStatus = 'pending' | 'confirmed';

export type DashboardBookingRecord = {
  readonly bookingId: string;
  readonly serviceId: string;
  readonly staffId: string;
  readonly startAt: string;
  readonly status: string;
  readonly customerName: string;
  readonly customerEmail: string;
  readonly serviceNameKo: string;
  readonly staffNameKo: string;
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

function parseBooking(payload: unknown): DashboardBookingRecord | null {
  const envelope = isRecord(payload) ? payload : null;
  const booking = isRecord(envelope?.booking) ? envelope.booking : null;
  const customer = isRecord(booking?.customer) ? booking.customer : null;
  const bookingId = stringValue(booking?.bookingId);
  const serviceId = stringValue(booking?.serviceId);
  const staffId = stringValue(booking?.staffId);
  const startAt = stringValue(booking?.startAt);
  const status = stringValue(booking?.status);
  const customerName = stringValue(customer?.name);
  const customerEmail = stringValue(customer?.email);
  if (!bookingId || !serviceId || !staffId || !startAt || !status || !customerName || !customerEmail) {
    return null;
  }
  return {
    bookingId,
    serviceId,
    staffId,
    startAt,
    status,
    customerName,
    customerEmail,
    serviceNameKo: '',
    staffNameKo: '',
  };
}

export function dashboardWeekdayDate(minDaysFromToday: number): string {
  const today = new Date();
  for (let offset = minDaysFromToday; offset < minDaysFromToday + 30; offset += 1) {
    const candidate = new Date(Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate() + offset, 12));
    const day = candidate.getUTCDay();
    if (day >= 1 && day <= 5) {
      return candidate.toISOString().slice(0, 10);
    }
  }
  throw new Error('W207 future weekday not found');
}

export async function createDashboardStaff(request: FixtureRequest): Promise<string | null> {
  const staffName = `W207 ${request.label} 담당자 ${request.token}`;
  const response = await request.page.request.post('/api/builder/bookings/staff?locale=ko', {
    headers: request.headers,
    data: {
      name: { ko: staffName, en: `${staffName} EN`, 'zh-hant': `${staffName} ZH` },
      title: { ko: '대시보드 검증 변호사', en: 'Dashboard verification attorney', 'zh-hant': '儀表板驗證律師' },
      bio: { ko: `W207 ${request.label} 대시보드 검증`, en: '', 'zh-hant': '' },
      email: `w207-${request.label}-${request.token}@example.com`,
      photo: '',
      isActive: true,
    },
  });
  return response.ok() ? parseEntityId(await readJson(response), 'staff', 'staffId') : null;
}

export async function createDashboardService(request: ServiceFixtureRequest): Promise<string | null> {
  const serviceName = `W207 ${request.label} 상담 ${request.token}`;
  const response = await request.page.request.post('/api/builder/bookings/services?locale=ko', {
    headers: request.headers,
    data: {
      name: { ko: serviceName, en: `${serviceName} EN`, 'zh-hant': `${serviceName} ZH` },
      description: { ko: `W207 ${request.label} 대시보드 필터 검증`, en: '', 'zh-hant': '' },
      durationMinutes: 30,
      priceTwd: 0,
      image: '',
      category: `w207-${request.token}`,
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

export async function fetchFirstDashboardSlot(
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
  if (!response.ok()) {
    return null;
  }
  return parseSlots(await readJson(response))[0]?.startAt ?? null;
}

export async function createDashboardBooking(request: BookingFixtureRequest): Promise<DashboardBookingRecord | null> {
  const staffNameKo = `W207 ${request.label} 담당자 ${request.token}`;
  const serviceNameKo = `W207 ${request.label} 상담 ${request.token}`;
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
        name: `W207 ${request.label} 고객 ${request.token}`,
        email: `w207-${request.label}-customer-${request.token}@example.com`,
        phone: '+82-10-2070-0000',
        notes: `W207 ${request.label} dashboard filter row`,
        caseSummary: `W207 ${request.label} 상세 모달 확인`,
        locale: 'ko',
      },
    },
  });
  const booking = response.ok() ? parseBooking(await readJson(response)) : null;
  return booking ? { ...booking, serviceNameKo, staffNameKo } : null;
}

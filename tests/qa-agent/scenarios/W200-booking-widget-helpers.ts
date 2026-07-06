import type { Page } from '@playwright/test';

type FixtureRequest = {
  readonly page: Page;
  readonly headers: Record<string, string>;
  readonly token: string;
};

type ServiceFixtureRequest = FixtureRequest & {
  readonly staffId: string;
};

type DraftRequest = {
  readonly page: Page;
  readonly headers: Record<string, string>;
  readonly pageId: string;
};

type PublishPageRequest = DraftRequest & {
  readonly document: Record<string, unknown>;
};

export type PublicBookingRecord = {
  readonly bookingId: string;
  readonly serviceId: string;
  readonly staffId: string;
  readonly startAt: string;
  readonly customerLocale: string | undefined;
  readonly customerPhone: string | undefined;
  readonly customerNotes: string | undefined;
};

type AvailabilityBlock = {
  readonly start: string;
  readonly end: string;
};

type Day =
  | 'monday'
  | 'tuesday'
  | 'wednesday'
  | 'thursday'
  | 'friday'
  | 'saturday'
  | 'sunday';

type JsonResponseLike = {
  readonly ok: () => boolean;
  readonly json: () => Promise<unknown>;
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function stringValue(value: unknown): string | undefined {
  return typeof value === 'string' ? value : undefined;
}

function numberValue(value: unknown): number | undefined {
  return typeof value === 'number' && Number.isFinite(value) ? value : undefined;
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
  const safeScope = scope.replace(/[^a-z0-9-]/gi, '-').slice(-48) || 'w200-widget';
  return {
    authorization: `Basic ${Buffer.from(`${username}:${password}`).toString('base64')}`,
    'x-forwarded-for': `qa-${safeScope}`,
  };
}

export async function createStaff(request: FixtureRequest): Promise<string | null> {
  const response = await request.page.request.post('/api/builder/bookings/staff?locale=ko', {
    headers: request.headers,
    data: {
      name: { ko: `W200 예약 담당자 ${request.token}`, en: `W200 Booking Staff ${request.token}`, 'zh-hant': `W200 預約人員 ${request.token}` },
      title: { ko: '공개 예약 담당', en: 'Public booking attorney', 'zh-hant': '公開預約律師' },
      bio: { ko: `W200 공개 예약 검증 ${request.token}`, en: `W200 public booking check ${request.token}`, 'zh-hant': `W200 公開預約驗證 ${request.token}` },
      email: `w200-${request.token}@example.com`,
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
      name: { ko: `W200 무료 상담 ${request.token}`, en: `W200 Free Consultation ${request.token}`, 'zh-hant': `W200 免費諮詢 ${request.token}` },
      description: { ko: `W200 공개 위젯 검증 ${request.token}`, en: '', 'zh-hant': '' },
      durationMinutes: 30,
      priceTwd: 0,
      image: '',
      category: `w200-${request.token}`,
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

export async function createBuilderPage(request: FixtureRequest, slug: string): Promise<string | null> {
  const response = await request.page.request.post('/api/builder/site/pages', {
    headers: request.headers,
    data: { locale: 'ko', slug, title: `W200 공개 예약 ${request.token}`, blank: true },
  });
  if (!response.ok()) {
    return null;
  }
  const payload = await readJson(response);
  return isRecord(payload) ? stringValue(payload.pageId) ?? null : null;
}

export async function publishBookingPage(request: PublishPageRequest): Promise<boolean> {
  const draftResponse = await request.page.request.get(`/api/builder/site/pages/${request.pageId}/draft?locale=ko`, {
    headers: request.headers,
  });
  if (!draftResponse.ok()) {
    return false;
  }
  const draftPayload = await readJson(draftResponse);
  const draft = isRecord(draftPayload) && isRecord(draftPayload.draft) ? draftPayload.draft : {};
  const revision = numberValue(draft.revision);
  if (revision === undefined) {
    return false;
  }
  const putResponse = await request.page.request.put(`/api/builder/site/pages/${request.pageId}/draft?locale=ko`, {
    headers: request.headers,
    data: { expectedRevision: revision, document: request.document },
  });
  if (!putResponse.ok()) {
    return false;
  }
  const publishResponse = await request.page.request.post(`/api/builder/site/pages/${request.pageId}/publish?locale=ko`, {
    headers: request.headers,
    data: {},
  });
  return publishResponse.ok();
}

export async function deleteBuilderPage(request: DraftRequest): Promise<void> {
  await request.page.request.delete(`/api/builder/site/pages/${request.pageId}?locale=ko`, {
    headers: request.headers,
    failOnStatusCode: false,
  });
}

export async function parsePublicBookingResponse(response: JsonResponseLike): Promise<PublicBookingRecord | null> {
  if (!response.ok()) {
    return null;
  }
  const payload = await readJson(response);
  const booking = isRecord(payload) ? payload.booking : null;
  const customer = isRecord(booking) && isRecord(booking.customer) ? booking.customer : null;
  const bookingId = isRecord(payload) ? stringValue(payload.bookingId) : undefined;
  const serviceId = isRecord(booking) ? stringValue(booking.serviceId) : undefined;
  const staffId = isRecord(booking) ? stringValue(booking.staffId) : undefined;
  const startAt = isRecord(booking) ? stringValue(booking.startAt) : undefined;
  if (!bookingId || !serviceId || !staffId || !startAt) {
    return null;
  }
  return {
    bookingId,
    serviceId,
    staffId,
    startAt,
    customerLocale: isRecord(customer) ? stringValue(customer.locale) : undefined,
    customerPhone: isRecord(customer) ? stringValue(customer.phone) : undefined,
    customerNotes: isRecord(customer) ? stringValue(customer.notes) : undefined,
  };
}

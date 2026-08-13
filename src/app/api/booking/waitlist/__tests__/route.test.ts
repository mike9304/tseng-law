import { NextRequest } from 'next/server';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { computeAvailableSlots } from '@/lib/builder/bookings/availability';
import {
  getService,
  getStaff,
  listWaitlistEntries,
  saveWaitlistEntry,
} from '@/lib/builder/bookings/storage';
import { checkRateLimit } from '@/lib/builder/security/rate-limit';
import { emitEvent } from '@/lib/builder/webhooks/dispatcher';
import type {
  BookingService,
  BookingWaitlistEntry,
  Staff,
} from '@/lib/builder/bookings/types';
import { POST } from '../route';

vi.mock('@/lib/builder/security/rate-limit', () => ({
  checkRateLimit: vi.fn(),
}));

vi.mock('@/lib/builder/bookings/availability', () => ({
  computeAvailableSlots: vi.fn(),
}));

vi.mock('@/lib/builder/bookings/storage', () => ({
  getService: vi.fn(),
  getStaff: vi.fn(),
  listWaitlistEntries: vi.fn(),
  makeWaitlistId: vi.fn(() => 'waitlist-new'),
  saveWaitlistEntry: vi.fn(),
  timestamped: vi.fn((entry) => ({
    ...entry,
    createdAt: '2026-07-30T00:00:00.000Z',
    updatedAt: '2026-07-30T00:00:00.000Z',
  })),
}));

vi.mock('@/lib/builder/webhooks/dispatcher', () => ({
  emitEvent: vi.fn(),
}));

const service: BookingService = {
  serviceId: 'service-1',
  slug: 'consultation',
  name: { ko: '상담', 'zh-hant': '諮詢', en: 'Consultation' },
  description: { ko: '상담', 'zh-hant': '諮詢', en: 'Consultation' },
  durationMinutes: 60,
  staffIds: ['staff-1'],
  bufferBeforeMinutes: 0,
  bufferAfterMinutes: 0,
  isActive: true,
  createdAt: '2026-07-01T00:00:00.000Z',
  updatedAt: '2026-07-01T00:00:00.000Z',
};

const staff: Staff = {
  staffId: 'staff-1',
  name: { ko: '증준외', 'zh-hant': '曾雋崴', en: 'Attorney Tseng' },
  title: { ko: '변호사', 'zh-hant': '律師', en: 'Attorney' },
  isActive: true,
  createdAt: '2026-07-01T00:00:00.000Z',
  updatedAt: '2026-07-01T00:00:00.000Z',
};

const storedEntry: BookingWaitlistEntry = {
  waitlistId: 'waitlist-secret-id',
  serviceId: service.serviceId,
  staffId: staff.staffId,
  requestedDate: '2026-08-15',
  customer: {
    name: 'Stored Client',
    email: 'stored@example.com',
    phone: '+886-2-5555-0000',
    notes: 'Confidential legal notes',
    caseSummary: 'Confidential case summary',
    attachmentUrls: ['https://private.example.test/document.pdf'],
    locale: 'ko',
  },
  customerTimezone: 'Asia/Taipei',
  status: 'active',
  source: 'web',
  createdAt: '2026-07-20T01:02:03.000Z',
  updatedAt: '2026-07-20T04:05:06.000Z',
};

const checkRateLimitMock = vi.mocked(checkRateLimit);
const computeAvailableSlotsMock = vi.mocked(computeAvailableSlots);
const getServiceMock = vi.mocked(getService);
const getStaffMock = vi.mocked(getStaff);
const listWaitlistEntriesMock = vi.mocked(listWaitlistEntries);
const saveWaitlistEntryMock = vi.mocked(saveWaitlistEntry);

function request(origin: string | null = 'https://tseng-law.com'): NextRequest {
  return new NextRequest('https://tseng-law.com/api/booking/waitlist', {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      'x-forwarded-for': '203.0.113.9',
      ...(origin ? { origin } : {}),
    },
    body: JSON.stringify({
      serviceId: service.serviceId,
      staffId: staff.staffId,
      requestedDate: storedEntry.requestedDate,
      customer: {
        name: 'Duplicate Client',
        email: 'STORED@example.com',
        locale: 'ko',
      },
    }),
  });
}

describe('/api/booking/waitlist', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    checkRateLimitMock.mockResolvedValue({ allowed: true, retryAfterMs: 0 } as never);
    computeAvailableSlotsMock.mockResolvedValue([]);
    getServiceMock.mockResolvedValue(service);
    getStaffMock.mockResolvedValue(staff);
    listWaitlistEntriesMock.mockResolvedValue([storedEntry]);
    saveWaitlistEntryMock.mockResolvedValue(undefined as never);
  });

  it('returns only a generic acknowledgement for duplicate entries', async () => {
    const response = await POST(request());
    const payload = await response.json();
    const serialized = JSON.stringify(payload);

    expect(response.status).toBe(200);
    expect(payload).toEqual({ ok: true, duplicate: true });
    expect(serialized).not.toContain(storedEntry.waitlistId);
    expect(serialized).not.toContain(storedEntry.customer.name);
    expect(serialized).not.toContain(storedEntry.customer.email);
    expect(serialized).not.toContain(storedEntry.customer.phone);
    expect(serialized).not.toContain(storedEntry.customer.notes);
    expect(serialized).not.toContain(storedEntry.customer.caseSummary);
    expect(serialized).not.toContain(storedEntry.createdAt);
    expect(serialized).not.toContain(storedEntry.updatedAt);
    expect(saveWaitlistEntryMock).not.toHaveBeenCalled();
  });

  it('rejects cross-origin requests before rate limiting, storage, or events', async () => {
    const response = await POST(request('https://attacker.example'));
    const payload = await response.json();

    expect(response.status).toBe(403);
    expect(payload).toEqual({ ok: false, error: 'csrf_origin_mismatch', code: 'csrf_origin_mismatch' });
    expect(checkRateLimitMock).not.toHaveBeenCalled();
    expect(getServiceMock).not.toHaveBeenCalled();
    expect(getStaffMock).not.toHaveBeenCalled();
    expect(computeAvailableSlotsMock).not.toHaveBeenCalled();
    expect(listWaitlistEntriesMock).not.toHaveBeenCalled();
    expect(saveWaitlistEntryMock).not.toHaveBeenCalled();
    expect(emitEvent).not.toHaveBeenCalled();
  });
});

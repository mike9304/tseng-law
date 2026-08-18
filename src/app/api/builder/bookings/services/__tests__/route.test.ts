import { NextRequest } from 'next/server';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { guardBuilderReadWithPermission, guardMutation } from '@/lib/builder/security/guard';
import {
  listServices,
  makeServiceId,
  saveService,
  slugify,
  timestamped,
} from '@/lib/builder/bookings/storage';

vi.mock('@/lib/builder/security/guard', () => ({
  guardBuilderReadWithPermission: vi.fn(async () => ({ username: 'admin' })),
  guardMutation: vi.fn(async () => ({ user: { id: 'admin-1' } })),
}));

vi.mock('@/lib/builder/bookings/storage', () => ({
  listServices: vi.fn(async () => []),
  makeServiceId: vi.fn(() => 'svc-route-test'),
  saveService: vi.fn(async () => undefined),
  slugify: vi.fn((value: string) => value.toLowerCase().replace(/\s+/g, '-')),
  timestamped: vi.fn((value: object, createdAt?: string) => ({
    ...value,
    createdAt: createdAt ?? '2026-05-01T00:00:00.000Z',
    updatedAt: '2026-05-02T00:00:00.000Z',
  })),
}));

function validServicePayload() {
  return {
    name: { ko: '초기 상담', 'zh-hant': '初步諮詢', en: 'Initial consultation' },
    description: { ko: '상담', 'zh-hant': '諮詢', en: 'Consultation' },
    durationMinutes: 30,
    priceTwd: 0,
    staffIds: [],
    requiredResourceIds: [],
    bufferBeforeMinutes: 0,
    bufferAfterMinutes: 15,
    maxParticipants: 1,
    slotStepMinutes: 30,
    isActive: true,
    paymentMode: 'free',
    priceCurrency: 'TWD',
    meetingMode: 'in-person',
    reminderOffsetsHours: [24],
  };
}

function postRequest(body: unknown, locale = 'ko'): NextRequest {
  return new NextRequest(`https://law.example.test/api/builder/bookings/services?locale=${locale}`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(body),
  });
}

describe('/api/builder/bookings/services', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(guardBuilderReadWithPermission).mockResolvedValue({ username: 'admin' });
    vi.mocked(guardMutation).mockResolvedValue({ user: { id: 'admin-1' } } as never);
  });

  it('lists services for authenticated builder admins', async () => {
    const route = await import('../route');
    const response = await route.GET(
      new NextRequest('https://law.example.test/api/builder/bookings/services?includeInactive=1'),
    );
    const payload = await response.json();

    expect(response.status).toBe(200);
    expect(guardBuilderReadWithPermission).toHaveBeenCalledWith(
      expect.any(NextRequest),
      'view-bookings',
    );
    expect(payload).toEqual({ services: [] });
    expect(listServices).toHaveBeenCalledWith(true);
  });

  it('returns localized errors for invalid create payloads', async () => {
    const route = await import('../route');
    const response = await route.POST(postRequest({ name: { ko: '' } }, 'zh-hant'));
    const payload = await response.json();

    expect(response.status).toBe(400);
    expect(payload.error).toBe('請確認服務內容。');
    expect(payload.errorCode).toBe('invalid_service_payload');
    expect(payload.details).toHaveLength(3);
    expect(saveService).not.toHaveBeenCalled();
  });

  it('creates services with valid payloads', async () => {
    const route = await import('../route');
    const response = await route.POST(postRequest(validServicePayload(), 'en'));
    const payload = await response.json();

    expect(response.status).toBe(201);
    expect(payload.service).toEqual(expect.objectContaining({
      serviceId: 'svc-route-test',
      slug: 'initial-consultation',
      category: 'consultation',
      createdAt: '2026-05-01T00:00:00.000Z',
      updatedAt: '2026-05-02T00:00:00.000Z',
    }));
    expect(makeServiceId).toHaveBeenCalled();
    expect(slugify).toHaveBeenCalledWith('Initial consultation');
    expect(saveService).toHaveBeenCalledWith(payload.service);
    expect(timestamped).toHaveBeenCalled();
  });
});

import { NextRequest } from 'next/server';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { guardBuilderReadWithPermission, guardMutation } from '@/lib/builder/security/guard';
import {
  listResources,
  makeResourceId,
  saveResource,
  timestamped,
} from '@/lib/builder/bookings/storage';

vi.mock('@/lib/builder/security/guard', () => ({
  guardBuilderReadWithPermission: vi.fn(async () => ({ username: 'admin' })),
  guardMutation: vi.fn(async () => ({ user: { id: 'admin-1' } })),
}));

vi.mock('@/lib/builder/bookings/storage', () => ({
  listResources: vi.fn(async () => []),
  makeResourceId: vi.fn(() => 'res-route-test'),
  saveResource: vi.fn(async () => undefined),
  timestamped: vi.fn((value: object, createdAt?: string) => ({
    ...value,
    createdAt: createdAt ?? '2026-05-01T00:00:00.000Z',
    updatedAt: '2026-05-02T00:00:00.000Z',
  })),
}));

function validResourcePayload() {
  return {
    name: { ko: '회의실 A', 'zh-hant': '會議室 A', en: 'Room A' },
    description: { ko: '상담실', 'zh-hant': '諮詢室', en: 'Consultation room' },
    location: 'Taipei',
    capacity: 2,
    bufferBeforeMinutes: 0,
    bufferAfterMinutes: 15,
    timezone: 'Asia/Taipei',
    weekly: {
      monday: [],
      tuesday: [],
      wednesday: [],
      thursday: [],
      friday: [],
      saturday: [],
      sunday: [],
    },
    blockedDates: [],
    isActive: true,
  };
}

function postRequest(body: unknown, locale = 'ko'): NextRequest {
  return new NextRequest(`https://law.example.test/api/builder/bookings/resources?locale=${locale}`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(body),
  });
}

describe('/api/builder/bookings/resources', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(guardBuilderReadWithPermission).mockResolvedValue({ username: 'admin' });
    vi.mocked(guardMutation).mockResolvedValue({ user: { id: 'admin-1' } } as never);
  });

  it('lists resources for authenticated builder admins', async () => {
    const route = await import('../route');
    const response = await route.GET(
      new NextRequest('https://law.example.test/api/builder/bookings/resources?includeInactive=1'),
    );
    const payload = await response.json();

    expect(response.status).toBe(200);
    expect(guardBuilderReadWithPermission).toHaveBeenCalledWith(
      expect.any(NextRequest),
      'view-bookings',
    );
    expect(payload).toEqual({ resources: [] });
    expect(listResources).toHaveBeenCalledWith(true);
  });

  it('returns localized errors for invalid create payloads', async () => {
    const route = await import('../route');
    const response = await route.POST(postRequest({ name: { ko: '' } }, 'zh-hant'));
    const payload = await response.json();

    expect(response.status).toBe(400);
    expect(payload.error).toBe('請確認資源資料。');
    expect(payload.errorCode).toBe('invalid_resource_payload');
    expect(payload.details).toHaveLength(3);
    expect(saveResource).not.toHaveBeenCalled();
  });

  it('creates resources with valid payloads', async () => {
    const route = await import('../route');
    const response = await route.POST(postRequest(validResourcePayload(), 'en'));
    const payload = await response.json();

    expect(response.status).toBe(201);
    expect(payload.resource).toEqual(expect.objectContaining({
      resourceId: 'res-route-test',
      location: 'Taipei',
      createdAt: '2026-05-01T00:00:00.000Z',
      updatedAt: '2026-05-02T00:00:00.000Z',
    }));
    expect(makeResourceId).toHaveBeenCalled();
    expect(timestamped).toHaveBeenCalled();
    expect(saveResource).toHaveBeenCalledWith(payload.resource);
  });
});

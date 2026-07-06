import { NextRequest } from 'next/server';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { requireBuilderAdminAuth } from '@/lib/builder/columns/auth';
import { guardMutation } from '@/lib/builder/security/guard';
import {
  listPackages,
  makePackageId,
  savePackage,
  timestamped,
} from '@/lib/builder/bookings/storage';

vi.mock('@/lib/builder/columns/auth', () => ({
  requireBuilderAdminAuth: vi.fn(() => ({ username: 'admin' })),
}));

vi.mock('@/lib/builder/security/guard', () => ({
  guardMutation: vi.fn(async () => ({ user: { id: 'admin-1' } })),
}));

vi.mock('@/lib/builder/bookings/storage', () => ({
  listPackages: vi.fn(async () => []),
  makePackageId: vi.fn(() => 'pkg-route-test'),
  savePackage: vi.fn(async () => undefined),
  timestamped: vi.fn((value: object, createdAt?: string) => ({
    ...value,
    createdAt: createdAt ?? '2026-05-01T00:00:00.000Z',
    updatedAt: '2026-05-02T00:00:00.000Z',
  })),
}));

function validPackagePayload() {
  return {
    name: { ko: '상담 패키지', 'zh-hant': '諮詢方案', en: 'Consultation package' },
    description: { ko: '패키지', 'zh-hant': '方案', en: 'Package' },
    eligibleServiceIds: ['svc-1'],
    credits: 3,
    validityDays: 90,
    priceAmount: 300000,
    priceCurrency: 'TWD',
    isActive: true,
  };
}

function postRequest(body: unknown, locale = 'ko'): NextRequest {
  return new NextRequest(`https://law.example.test/api/builder/bookings/packages?locale=${locale}`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(body),
  });
}

describe('/api/builder/bookings/packages', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(requireBuilderAdminAuth).mockReturnValue({ username: 'admin' });
    vi.mocked(guardMutation).mockResolvedValue({ user: { id: 'admin-1' } } as never);
  });

  it('lists packages for authenticated builder admins', async () => {
    const route = await import('../route');
    const response = await route.GET(
      new NextRequest('https://law.example.test/api/builder/bookings/packages?includeInactive=1'),
    );
    const payload = await response.json();

    expect(response.status).toBe(200);
    expect(payload).toEqual({ packages: [] });
    expect(listPackages).toHaveBeenCalledWith(true);
  });

  it('returns localized errors for invalid create payloads', async () => {
    const route = await import('../route');
    const response = await route.POST(postRequest({ name: { ko: '' } }, 'zh-hant'));
    const payload = await response.json();

    expect(response.status).toBe(400);
    expect(payload.error).toBe('請確認方案資料。');
    expect(payload.errorCode).toBe('invalid_package_payload');
    expect(payload.details).toHaveLength(3);
    expect(savePackage).not.toHaveBeenCalled();
  });

  it('creates packages with valid payloads', async () => {
    const route = await import('../route');
    const response = await route.POST(postRequest(validPackagePayload(), 'en'));
    const payload = await response.json();

    expect(response.status).toBe(201);
    expect(payload.package).toEqual(expect.objectContaining({
      packageId: 'pkg-route-test',
      eligibleServiceIds: ['svc-1'],
      credits: 3,
      validityDays: 90,
      priceAmount: 300000,
      priceCurrency: 'TWD',
      createdAt: '2026-05-01T00:00:00.000Z',
      updatedAt: '2026-05-02T00:00:00.000Z',
    }));
    expect(makePackageId).toHaveBeenCalled();
    expect(timestamped).toHaveBeenCalled();
    expect(savePackage).toHaveBeenCalledWith(payload.package);
  });
});

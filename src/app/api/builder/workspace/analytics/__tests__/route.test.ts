import { NextRequest } from 'next/server';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { guardBuilderReadWithPermission } from '@/lib/builder/security/guard';
import { buildWorkspaceAnalyticsRollup } from '@/lib/builder/workspace/analytics-aggregate';
import { ensureDefaultAccount } from '@/lib/builder/workspace/workspace-store';
import { GET } from '../route';

vi.mock('@/lib/builder/security/guard', () => ({
  guardBuilderReadWithPermission: vi.fn(async () => ({ username: 'admin' })),
}));

vi.mock('@/lib/builder/workspace/workspace-store', () => ({
  ensureDefaultAccount: vi.fn(),
}));

vi.mock('@/lib/builder/workspace/analytics-aggregate', () => ({
  buildWorkspaceAnalyticsRollup: vi.fn(),
}));

const rollup = {
  generatedAt: '2026-06-03T00:00:00.000Z',
  totalOrders: 1,
  totalBookings: 2,
  totalGrossCollectedCents: 3000,
  totalOutstandingCents: 400,
  primaryCurrency: 'TWD',
  operations: {
    siteCount: 1,
    memberCount: 1,
    sharedAssetCount: 2,
    sharedAssetBytes: 350,
    cmsCollectionCount: 3,
    cmsRecordCount: 4,
    latestCmsUpdatedAt: '2026-06-03T00:00:00.000Z',
    latestSharedAssetUploadedAt: '2026-06-03T00:01:00.000Z',
  },
  sites: [],
};

const guardBuilderReadWithPermissionMock = vi.mocked(guardBuilderReadWithPermission);
const ensureDefaultAccountMock = vi.mocked(ensureDefaultAccount);
const buildWorkspaceAnalyticsRollupMock = vi.mocked(buildWorkspaceAnalyticsRollup);

function request(query = ''): NextRequest {
  return new NextRequest(`https://law.example.test/api/builder/workspace/analytics${query ? `?${query}` : ''}`);
}

describe('builder workspace analytics API', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    guardBuilderReadWithPermissionMock.mockResolvedValue({ username: 'admin' });
    ensureDefaultAccountMock.mockResolvedValue({ id: 'workspace-1' } as never);
    buildWorkspaceAnalyticsRollupMock.mockResolvedValue(rollup as never);
  });

  it('returns analytics rollup while preserving success response shape', async () => {
    const response = await GET(request('locale=en'));
    const payload = await response.json();

    expect(response.status).toBe(200);
    expect(guardBuilderReadWithPermissionMock).toHaveBeenCalledWith(expect.any(NextRequest), 'settings');
    expect(payload).toEqual({ ok: true, rollup });
  });

  it('returns localized analytics failures without leaking exception details', async () => {
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => undefined);
    buildWorkspaceAnalyticsRollupMock.mockRejectedValueOnce(new Error('analytics secret leaked'));

    const response = await GET(request('locale=zh-hant'));
    const payload = await response.json();

    expect(response.status).toBe(500);
    expect(payload).toEqual({
      ok: false,
      error: '無法載入工作區分析。',
      errorCode: 'analytics_load_failed',
    });
    expect(JSON.stringify(payload)).not.toContain('analytics secret leaked');
    expect(consoleError).toHaveBeenCalledWith('[builder/workspace/analytics] GET failed:', expect.any(Error));
    consoleError.mockRestore();
  });
});

import { NextRequest } from 'next/server';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { guardMutation } from '@/lib/builder/security/guard';
import { listBuilderAppCatalogEntries } from '@/lib/builder/apps/installed';
import { GET } from '../route';

vi.mock('@/lib/builder/security/guard', () => ({
  guardMutation: vi.fn(async () => ({ username: 'apps-admin@example.test' })),
}));

vi.mock('@/lib/builder/apps/installed', () => ({
  listBuilderAppCatalogEntries: vi.fn(),
  normalizeBuilderAppCategory: vi.fn((value: string | null) => value ?? undefined),
  normalizeBuilderAppStatus: vi.fn((value: string | null) => value ?? undefined),
}));

const guardMutationMock = vi.mocked(guardMutation);
const listBuilderAppCatalogEntriesMock = vi.mocked(listBuilderAppCatalogEntries);

function request(query = ''): NextRequest {
  return new NextRequest(`https://law.example.test/api/builder/apps/catalog${query ? `?${query}` : ''}`);
}

describe('builder app catalog API', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    guardMutationMock.mockResolvedValue({ username: 'apps-admin@example.test' } as never);
    listBuilderAppCatalogEntriesMock.mockResolvedValue([{ manifest: { appId: 'site-search' } }] as never);
  });

  it('lists catalog apps while preserving GET success response shape', async () => {
    const response = await GET(request('locale=en&search=site&category=utility&status=enabled'));
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(listBuilderAppCatalogEntriesMock).toHaveBeenCalledWith('tseng-law-main-site', 'en', {
      search: 'site',
      category: 'utility',
      status: 'enabled',
    });
    expect(data).toEqual({
      ok: true,
      entries: [{ manifest: { appId: 'site-search' } }],
    });
  });

  it('returns localized catalog failures without leaking exception details', async () => {
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => undefined);
    listBuilderAppCatalogEntriesMock.mockRejectedValueOnce(new Error('catalog secret leaked'));

    const response = await GET(request('locale=zh-hant'));
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data).toEqual({
      ok: false,
      error: '無法載入應用目錄。',
      errorCode: 'app_catalog_failed',
    });
    expect(JSON.stringify(data)).not.toContain('catalog secret leaked');
    expect(consoleError).toHaveBeenCalledWith('[builder/apps/catalog] list failed:', expect.any(Error));
    consoleError.mockRestore();
  });
});

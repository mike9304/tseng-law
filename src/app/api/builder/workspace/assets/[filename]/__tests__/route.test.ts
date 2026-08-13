import { NextRequest } from 'next/server';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { recordAssetDelete } from '@/lib/builder/audit/record';
import { guardBuilderReadWithPermission, guardMutation } from '@/lib/builder/security/guard';
import {
  deleteSharedAsset,
  readSharedAsset,
} from '@/lib/builder/workspace/shared-assets';
import {
  findSharedAssetUsage,
  type SharedAssetUsageSummary,
} from '@/lib/builder/workspace/shared-asset-usage';
import { DELETE, GET } from '../route';

vi.mock('@/lib/builder/security/guard', () => ({
  guardBuilderReadWithPermission: vi.fn(async () => ({ username: 'admin' })),
  guardMutation: vi.fn(async () => ({ user: { id: 'admin-1' } })),
}));

vi.mock('@/lib/builder/workspace/shared-assets', () => ({
  deleteSharedAsset: vi.fn(),
  readSharedAsset: vi.fn(),
}));

vi.mock('@/lib/builder/workspace/shared-asset-usage', () => ({
  findSharedAssetUsage: vi.fn(),
}));

vi.mock('@/lib/builder/audit/record', () => ({
  recordAssetDelete: vi.fn(async () => undefined),
}));

const guardBuilderReadWithPermissionMock = vi.mocked(guardBuilderReadWithPermission);
const guardMutationMock = vi.mocked(guardMutation);
const deleteSharedAssetMock = vi.mocked(deleteSharedAsset);
const readSharedAssetMock = vi.mocked(readSharedAsset);
const findSharedAssetUsageMock = vi.mocked(findSharedAssetUsage);
const recordAssetDeleteMock = vi.mocked(recordAssetDelete);

const emptyUsage = {
  total: 0,
  references: [],
  truncated: false,
} satisfies SharedAssetUsageSummary;

function request(method: 'GET' | 'DELETE', query = ''): NextRequest {
  return new NextRequest(`https://law.example.test/api/builder/workspace/assets/asset.png${query ? `?${query}` : ''}`, {
    method,
  });
}

const params = { params: Promise.resolve({ filename: 'asset.png' }) };

describe('builder workspace shared asset detail API', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    guardBuilderReadWithPermissionMock.mockResolvedValue({ username: 'admin' });
    guardMutationMock.mockResolvedValue({ user: { id: 'admin-1' } } as never);
    deleteSharedAssetMock.mockResolvedValue(true as never);
    findSharedAssetUsageMock.mockResolvedValue(emptyUsage);
    readSharedAssetMock.mockResolvedValue({
      content: Buffer.from([137, 80, 78, 71]),
      contentType: 'image/png',
    } as never);
    recordAssetDeleteMock.mockResolvedValue(undefined as never);
  });

  it('returns asset bytes while preserving binary success response shape', async () => {
    const response = await GET(request('GET', 'locale=en'), params);

    expect(response.status).toBe(200);
    expect(guardBuilderReadWithPermissionMock).toHaveBeenCalledWith(expect.any(NextRequest), 'edit-pages');
    expect(response.headers.get('Content-Type')).toBe('image/png');
    expect(new Uint8Array(await response.arrayBuffer())).toEqual(new Uint8Array([137, 80, 78, 71]));
  });

  it('returns localized invalid filename errors', async () => {
    const response = await GET(request('GET', 'locale=zh-hant'), {
      params: Promise.resolve({ filename: '../secret.png' }),
    });
    const payload = await response.json();

    expect(response.status).toBe(400);
    expect(payload).toEqual({
      ok: false,
      error: '請確認共用素材檔名。',
      errorCode: 'asset_invalid_filename',
    });
    expect(readSharedAssetMock).not.toHaveBeenCalled();
  });

  it('returns localized missing asset errors', async () => {
    readSharedAssetMock.mockResolvedValueOnce(null as never);

    const response = await GET(request('GET', 'locale=en'), params);
    const payload = await response.json();

    expect(response.status).toBe(404);
    expect(payload).toEqual({
      ok: false,
      error: 'Shared asset not found.',
      errorCode: 'asset_not_found',
    });
  });

  it('returns localized load failures without leaking exception details', async () => {
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => undefined);
    readSharedAssetMock.mockRejectedValueOnce(new Error('asset read secret leaked'));

    const response = await GET(request('GET', 'locale=ko'), params);
    const payload = await response.json();

    expect(response.status).toBe(500);
    expect(payload).toEqual({
      ok: false,
      error: '공유 에셋을 불러오지 못했습니다.',
      errorCode: 'asset_load_failed',
    });
    expect(JSON.stringify(payload)).not.toContain('asset read secret leaked');
    expect(consoleError).toHaveBeenCalledWith('[builder/workspace/assets/:filename] GET failed:', expect.any(Error));
    consoleError.mockRestore();
  });

  it('deletes assets while preserving success response shape', async () => {
    const response = await DELETE(request('DELETE', 'locale=ko'), params);
    const payload = await response.json();

    expect(response.status).toBe(200);
    expect(guardMutationMock).toHaveBeenCalledWith(expect.any(NextRequest), {
      bucket: 'asset',
      permission: 'edit-pages',
    });
    expect(findSharedAssetUsageMock).toHaveBeenCalledWith('asset.png');
    expect(deleteSharedAssetMock).toHaveBeenCalledWith('asset.png');
    expect(recordAssetDeleteMock).toHaveBeenCalled();
    expect(payload).toEqual({ ok: true });
  });

  it('blocks deleting assets that are still referenced by builder documents', async () => {
    const inUseUsage = {
      total: 1,
      truncated: false,
      references: [
        {
          siteId: 'site-a',
          source: 'page-canvas',
          label: 'Home draft canvas',
          pageId: 'home',
          variant: 'draft',
          path: '$.nodes[0].content.src',
        },
      ],
    } satisfies SharedAssetUsageSummary;

    findSharedAssetUsageMock.mockResolvedValueOnce(inUseUsage);

    const response = await DELETE(request('DELETE', 'locale=en'), params);
    const payload = await response.json();

    expect(response.status).toBe(409);
    expect(deleteSharedAssetMock).not.toHaveBeenCalled();
    expect(recordAssetDeleteMock).not.toHaveBeenCalled();
    expect(payload).toEqual({
      ok: false,
      error: 'This shared asset is still used in builder documents.',
      errorCode: 'asset_in_use',
      usage: {
        total: 1,
        truncated: false,
        references: [
          {
            siteId: 'site-a',
            source: 'page-canvas',
            label: 'Home draft canvas',
            pageId: 'home',
            variant: 'draft',
            path: '$.nodes[0].content.src',
          },
        ],
      },
    });
  });

  it('returns localized missing asset errors on delete', async () => {
    deleteSharedAssetMock.mockResolvedValueOnce(false as never);

    const response = await DELETE(request('DELETE', 'locale=zh-hant'), params);
    const payload = await response.json();

    expect(response.status).toBe(404);
    expect(payload).toEqual({
      ok: false,
      error: '找不到共用素材。',
      errorCode: 'asset_not_found',
    });
  });

  it('returns localized delete failures without leaking exception details', async () => {
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => undefined);
    deleteSharedAssetMock.mockRejectedValueOnce(new Error('asset delete secret leaked'));

    const response = await DELETE(request('DELETE', 'locale=en'), params);
    const payload = await response.json();

    expect(response.status).toBe(500);
    expect(payload).toEqual({
      ok: false,
      error: 'Unable to delete the shared asset.',
      errorCode: 'asset_delete_failed',
    });
    expect(JSON.stringify(payload)).not.toContain('asset delete secret leaked');
    expect(consoleError).toHaveBeenCalledWith('[builder/workspace/assets/:filename] DELETE failed:', expect.any(Error));
    consoleError.mockRestore();
  });
});

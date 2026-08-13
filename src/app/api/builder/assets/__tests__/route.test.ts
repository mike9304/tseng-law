import { NextRequest, NextResponse } from 'next/server';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import {
  listBuilderImageAssets,
  readBuilderAssetLibraryState,
} from '@/lib/builder/assets';
import { guardBuilderReadWithPermission } from '@/lib/builder/security/guard';
import { GET } from '../route';

vi.mock('@/lib/builder/security/guard', () => ({
  guardBuilderReadWithPermission: vi.fn(async () => ({
    username: 'editor@example.test',
    permission: 'edit-pages',
  })),
  guardMutation: vi.fn(),
}));

vi.mock('@/lib/builder/assets', () => ({
  deleteBuilderImageAsset: vi.fn(),
  listBuilderImageAssets: vi.fn(),
  readBuilderAssetLibraryState: vi.fn(),
  uploadBuilderImageAsset: vi.fn(),
  writeBuilderAssetLibraryState: vi.fn(),
}));

vi.mock('@/lib/builder/audit/record', () => ({
  recordAssetDelete: vi.fn(),
  recordAssetUpload: vi.fn(),
}));

vi.mock('@/lib/builder/canvas/upload-validation', () => ({
  validateImageBytes: vi.fn(),
  validateUploadFile: vi.fn(),
}));

const guardBuilderReadWithPermissionMock = vi.mocked(guardBuilderReadWithPermission);
const listBuilderImageAssetsMock = vi.mocked(listBuilderImageAssets);
const readBuilderAssetLibraryStateMock = vi.mocked(readBuilderAssetLibraryState);

function request(query = ''): NextRequest {
  return new NextRequest(
    `https://law.example.test/api/builder/assets${query ? `?${query}` : ''}`,
  );
}

describe('builder assets GET', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    guardBuilderReadWithPermissionMock.mockResolvedValue({
      username: 'editor@example.test',
      permission: 'edit-pages',
    });
    listBuilderImageAssetsMock.mockResolvedValue([]);
    readBuilderAssetLibraryStateMock.mockResolvedValue({} as never);
  });

  it('requires edit-pages before listing private asset metadata', async () => {
    const req = request('locale=ko&limit=12');
    const response = await GET(req);

    expect(response.status).toBe(200);
    expect(guardBuilderReadWithPermissionMock).toHaveBeenCalledWith(req, 'edit-pages');
    expect(listBuilderImageAssetsMock).toHaveBeenCalledWith({
      locale: 'ko',
      limit: 12,
    });
    expect(readBuilderAssetLibraryStateMock).toHaveBeenCalledWith({ locale: 'ko' });
  });

  it('short-circuits missing edit-pages permission before reading asset storage', async () => {
    guardBuilderReadWithPermissionMock.mockResolvedValueOnce(
      NextResponse.json({ error: 'Missing permission: edit-pages' }, { status: 403 }),
    );

    const req = request('locale=ko');
    const response = await GET(req);

    expect(response.status).toBe(403);
    await expect(response.json()).resolves.toEqual({
      error: 'Missing permission: edit-pages',
    });
    expect(guardBuilderReadWithPermissionMock).toHaveBeenCalledWith(req, 'edit-pages');
    expect(listBuilderImageAssetsMock).not.toHaveBeenCalled();
    expect(readBuilderAssetLibraryStateMock).not.toHaveBeenCalled();
  });
});

import { NextRequest } from 'next/server';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { recordAssetUpload } from '@/lib/builder/audit/record';
import {
  validateImageBytes,
  validateUploadFile,
} from '@/lib/builder/canvas/upload-validation';
import { guardBuilderReadWithPermission, guardMutation } from '@/lib/builder/security/guard';
import {
  listSharedAssets,
  uploadSharedAsset,
} from '@/lib/builder/workspace/shared-assets';
import { GET, POST } from '../route';

vi.mock('@/lib/builder/security/guard', () => ({
  guardBuilderReadWithPermission: vi.fn(async () => ({ username: 'admin' })),
  guardMutation: vi.fn(async () => ({ user: { id: 'admin-1' } })),
}));

vi.mock('@/lib/builder/workspace/shared-assets', () => ({
  listSharedAssets: vi.fn(),
  uploadSharedAsset: vi.fn(),
}));

vi.mock('@/lib/builder/audit/record', () => ({
  recordAssetUpload: vi.fn(async () => undefined),
}));

vi.mock('@/lib/builder/canvas/upload-validation', () => ({
  validateImageBytes: vi.fn(async () => ({ valid: true })),
  validateUploadFile: vi.fn(() => ({ valid: true })),
}));

const asset = {
  filename: 'asset.png',
  contentType: 'image/png',
  size: 128,
  uploadedAt: '2026-06-03T00:00:00.000Z',
  url: '/api/builder/workspace/assets/asset.png',
  pathname: 'workspace/assets/asset.png',
};

const guardBuilderReadWithPermissionMock = vi.mocked(guardBuilderReadWithPermission);
const guardMutationMock = vi.mocked(guardMutation);
const listSharedAssetsMock = vi.mocked(listSharedAssets);
const uploadSharedAssetMock = vi.mocked(uploadSharedAsset);
const recordAssetUploadMock = vi.mocked(recordAssetUpload);
const validateImageBytesMock = vi.mocked(validateImageBytes);
const validateUploadFileMock = vi.mocked(validateUploadFile);

function getRequest(query = ''): NextRequest {
  return new NextRequest(`https://law.example.test/api/builder/workspace/assets${query ? `?${query}` : ''}`);
}

function uploadRequest(query = '', formData?: FormData): NextRequest {
  const body = formData ?? new FormData();
  return new NextRequest(`https://law.example.test/api/builder/workspace/assets${query ? `?${query}` : ''}`, {
    method: 'POST',
    body,
  });
}

function validFormData(locale = 'ko'): FormData {
  const formData = new FormData();
  formData.set('locale', locale);
  formData.set('file', new File([new Uint8Array([137, 80, 78, 71])], 'asset.png', { type: 'image/png' }));
  return formData;
}

describe('builder workspace shared assets API', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    guardBuilderReadWithPermissionMock.mockResolvedValue({ username: 'admin' });
    guardMutationMock.mockResolvedValue({ user: { id: 'admin-1' } } as never);
    listSharedAssetsMock.mockResolvedValue([asset] as never);
    uploadSharedAssetMock.mockResolvedValue(asset as never);
    recordAssetUploadMock.mockResolvedValue(undefined as never);
    validateImageBytesMock.mockResolvedValue({ valid: true } as never);
    validateUploadFileMock.mockReturnValue({ valid: true } as never);
  });

  it('returns shared assets while preserving success response shape', async () => {
    const response = await GET(getRequest('locale=en&limit=12'));
    const payload = await response.json();

    expect(response.status).toBe(200);
    expect(guardBuilderReadWithPermissionMock).toHaveBeenCalledWith(expect.any(NextRequest), 'edit-pages');
    expect(listSharedAssetsMock).toHaveBeenCalledWith(12);
    expect(payload).toEqual({ ok: true, total: 1, assets: [asset] });
  });

  it('returns localized list failures without leaking exception details', async () => {
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => undefined);
    listSharedAssetsMock.mockRejectedValueOnce(new Error('workspace assets secret leaked'));

    const response = await GET(getRequest('locale=zh-hant'));
    const payload = await response.json();

    expect(response.status).toBe(500);
    expect(payload).toEqual({
      ok: false,
      error: '無法載入共用素材清單。',
      errorCode: 'assets_list_failed',
    });
    expect(JSON.stringify(payload)).not.toContain('workspace assets secret leaked');
    expect(consoleError).toHaveBeenCalledWith('[builder/workspace/assets] GET failed:', expect.any(Error));
    consoleError.mockRestore();
  });

  it('returns localized invalid upload payload errors using the query locale', async () => {
    const response = await POST(new NextRequest('https://law.example.test/api/builder/workspace/assets?locale=en', {
      method: 'POST',
      body: '{',
    }));
    const payload = await response.json();

    expect(response.status).toBe(400);
    expect(payload).toEqual({
      ok: false,
      error: 'Check the shared asset upload request.',
      errorCode: 'asset_invalid_upload',
    });
  });

  it('returns localized missing-file errors using the form locale', async () => {
    const formData = new FormData();
    formData.set('locale', 'zh-hant');

    const response = await POST(uploadRequest('', formData));
    const payload = await response.json();

    expect(response.status).toBe(400);
    expect(payload).toEqual({
      ok: false,
      error: '請選擇要上傳的圖片檔案。',
      errorCode: 'asset_file_required',
    });
    expect(uploadSharedAssetMock).not.toHaveBeenCalled();
  });

  it('returns localized validation errors without leaking raw validator copy', async () => {
    validateUploadFileMock.mockReturnValueOnce({
      valid: false,
      error: '허용되지 않는 파일 형식입니다: text/plain.',
      code: 'unsupported_media',
    } as never);

    const response = await POST(uploadRequest('locale=en', validFormData('en')));
    const payload = await response.json();

    expect(response.status).toBe(415);
    expect(payload).toEqual({
      ok: false,
      error: 'Only supported image files can be uploaded.',
      errorCode: 'asset_unsupported_media',
      code: 'unsupported_media',
    });
    expect(JSON.stringify(payload)).not.toContain('허용되지 않는 파일 형식입니다');
  });

  it('returns localized byte validation errors without leaking raw validator copy', async () => {
    validateImageBytesMock.mockResolvedValueOnce({
      valid: false,
      error: '파일 시그니처가 인식되지 않습니다.',
      code: 'unsupported_media',
      sniffed: 'unknown',
    } as never);

    const response = await POST(uploadRequest('locale=zh-hant', validFormData('zh-hant')));
    const payload = await response.json();

    expect(response.status).toBe(415);
    expect(payload).toEqual({
      ok: false,
      error: '只能上傳支援的圖片檔案。',
      errorCode: 'asset_unsupported_media',
      code: 'unsupported_media',
      sniffed: 'unknown',
    });
    expect(JSON.stringify(payload)).not.toContain('파일 시그니처');
  });

  it('returns localized upload failures without leaking exception details', async () => {
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => undefined);
    uploadSharedAssetMock.mockRejectedValueOnce(new Error('workspace upload secret leaked'));

    const response = await POST(uploadRequest('locale=en', validFormData('en')));
    const payload = await response.json();

    expect(response.status).toBe(500);
    expect(payload).toEqual({
      ok: false,
      error: 'Unable to upload the shared asset.',
      errorCode: 'asset_upload_failed',
    });
    expect(JSON.stringify(payload)).not.toContain('workspace upload secret leaked');
    expect(consoleError).toHaveBeenCalledWith('[builder/workspace/assets] POST failed:', expect.any(Error));
    consoleError.mockRestore();
  });

  it('uploads shared assets while preserving success response shape', async () => {
    const response = await POST(uploadRequest('locale=ko', validFormData('ko')));
    const payload = await response.json();

    expect(response.status).toBe(201);
    expect(guardMutationMock).toHaveBeenCalledWith(expect.any(NextRequest), {
      bucket: 'asset',
      permission: 'edit-pages',
    });
    expect(uploadSharedAssetMock).toHaveBeenCalledWith({
      file: expect.any(File),
      locale: 'ko',
    });
    expect(payload).toEqual({ ok: true, asset });
  });
});

import { NextRequest, NextResponse } from 'next/server';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import {
  buildFormUploadUrl,
  readFormUpload,
} from '@/lib/builder/forms/uploads';
import { guardBuilderReadWithPermission } from '@/lib/builder/security/guard';

vi.mock('@/lib/builder/forms/uploads', async () => {
  const actual = await vi.importActual<typeof import('@/lib/builder/forms/uploads')>(
    '@/lib/builder/forms/uploads',
  );
  return {
    ...actual,
    readFormUpload: vi.fn(),
  };
});

vi.mock('@/lib/builder/security/guard', () => ({
  guardBuilderReadWithPermission: vi.fn(),
}));

const locale = 'ko';
const filename = 'case-file-1234.pdf';

function request(url: string): NextRequest {
  return new NextRequest(new URL(url, 'https://tseng-law.com'));
}

function params(overrides: Partial<{ locale: string; filename: string }> = {}) {
  return {
    params: Promise.resolve({
      locale,
      filename,
      ...overrides,
    }),
  };
}

describe('/api/forms/uploads/[locale]/[filename] GET', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.stubEnv('FORM_UPLOAD_SIGNING_SECRET', 'form-upload-route-test-secret');
    vi.mocked(readFormUpload).mockResolvedValue({
      content: Buffer.from('%PDF-test'),
      contentType: 'application/pdf',
    });
    vi.mocked(guardBuilderReadWithPermission).mockResolvedValue(
      NextResponse.json({ error: 'unauthorized' }, { status: 401 }),
    );
  });

  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it('serves a valid signed URL with private attachment-safe headers', async () => {
    const route = await import('../route');
    const url = buildFormUploadUrl(locale, filename);
    const response = await route.GET(request(url), params());

    expect(response.status).toBe(200);
    expect(response.headers.get('cache-control')).toBe('private, no-store, max-age=0');
    expect(response.headers.get('content-disposition')).toContain(`filename="${filename}"`);
    expect(response.headers.get('x-content-type-options')).toBe('nosniff');
    expect(readFormUpload).toHaveBeenCalledWith({ locale, filename });
    expect(guardBuilderReadWithPermission).not.toHaveBeenCalled();
  });

  it('rejects an invalid signature before reading private storage', async () => {
    const route = await import('../route');
    const signed = new URL(buildFormUploadUrl(locale, filename), 'https://tseng-law.com');
    signed.searchParams.set('signature', 'invalid-signature');
    const response = await route.GET(request(signed.toString()), params());

    expect(response.status).toBe(403);
    expect(readFormUpload).not.toHaveBeenCalled();
    expect(guardBuilderReadWithPermission).toHaveBeenCalledWith(
      expect.any(NextRequest),
      'manage-forms',
    );
  });

  it('rejects a signature when the filename path is tampered', async () => {
    const route = await import('../route');
    const signed = new URL(buildFormUploadUrl(locale, filename), 'https://tseng-law.com');
    const tamperedFilename = 'other-file-1234.pdf';
    signed.pathname = `/api/forms/uploads/${locale}/${tamperedFilename}`;
    const response = await route.GET(
      request(signed.toString()),
      params({ filename: tamperedFilename }),
    );

    expect(response.status).toBe(403);
    expect(readFormUpload).not.toHaveBeenCalled();
  });

  it('rejects an expired signature before reading private storage', async () => {
    const route = await import('../route');
    const expiredUrl = buildFormUploadUrl(locale, filename, { expiresAtSeconds: 1 });
    const response = await route.GET(request(expiredUrl), params());

    expect(response.status).toBe(403);
    expect(readFormUpload).not.toHaveBeenCalled();
  });

  it('lets an authenticated builder admin read a retained upload after expiry', async () => {
    const route = await import('../route');
    vi.mocked(guardBuilderReadWithPermission).mockResolvedValue({
      username: 'admin',
      permission: 'manage-forms',
    });
    const expiredUrl = buildFormUploadUrl(locale, filename, { expiresAtSeconds: 1 });
    const response = await route.GET(request(expiredUrl), params());

    expect(response.status).toBe(200);
    expect(guardBuilderReadWithPermission).toHaveBeenCalledWith(
      expect.any(NextRequest),
      'manage-forms',
    );
    expect(readFormUpload).toHaveBeenCalledWith({ locale, filename });
  });

  it('rejects traversal-like paths without auth or storage access', async () => {
    const route = await import('../route');
    const response = await route.GET(
      request('/api/forms/uploads/ko/%2E%2E'),
      params({ filename: '..' }),
    );

    expect(response.status).toBe(400);
    expect(guardBuilderReadWithPermission).not.toHaveBeenCalled();
    expect(readFormUpload).not.toHaveBeenCalled();
  });
});

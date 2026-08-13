import { NextRequest } from 'next/server';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { saveFormUpload } from '@/lib/builder/forms/uploads';
import { loadFormSchema } from '@/lib/builder/forms/form-engine';
import { checkRateLimit } from '@/lib/builder/security/rate-limit';

vi.mock('@/lib/builder/forms/uploads', () => ({
  saveFormUpload: vi.fn(async ({ fieldId, file }: { fieldId: string; file: File }) => ({
    fieldId,
    name: file.name,
    size: file.size,
    type: file.type,
    pathname: `builder-forms/uploads/ko/${file.name}`,
    url: `/api/forms/uploads/ko/${file.name}?expires=1&signature=test`,
    uploadedAt: '2026-07-30T00:00:00.000Z',
    scan: {
      status: 'passed',
      provider: 'test',
      scannedAt: '2026-07-30T00:00:00.000Z',
      issues: [],
    },
  })),
}));

vi.mock('@/lib/builder/security/rate-limit', () => ({
  checkRateLimit: vi.fn(async () => ({
    allowed: true,
    remaining: 11,
    retryAfterMs: 0,
  })),
}));

vi.mock('@/lib/builder/forms/form-engine', async () => {
  const actual = await vi.importActual<typeof import('@/lib/builder/forms/form-engine')>(
    '@/lib/builder/forms/form-engine',
  );
  return {
    ...actual,
    loadFormSchema: vi.fn(),
  };
});

function uploadRequest(headers: Record<string, string>): NextRequest {
  const body = new FormData();
  body.set('formId', 'contact-form');
  body.set('fieldId', 'evidence');
  body.set('locale', 'ko');
  body.set('file', new File(['safe text'], 'evidence.txt', { type: 'text/plain' }));
  return new NextRequest('https://tseng-law.com/api/forms/uploads', {
    method: 'POST',
    headers,
    body,
  });
}

describe('/api/forms/uploads POST', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(checkRateLimit).mockResolvedValue({
      allowed: true,
      remaining: 11,
      retryAfterMs: 0,
    });
    vi.mocked(loadFormSchema).mockResolvedValue({
      formId: 'contact-form',
      name: 'Contact form',
      fields: [{
        id: 'evidence',
        type: 'file',
        label: 'Evidence',
        required: false,
        validation: { accept: '.txt,text/plain', maxFileSize: 1024 },
      }],
      submitLabel: 'Submit',
      successMessage: 'ok',
      errorMessage: 'error',
      createdAt: '2026-07-30T00:00:00.000Z',
      updatedAt: '2026-07-30T00:00:00.000Z',
    });
  });

  it('accepts a same-origin upload and stores it after rate limiting', async () => {
    const route = await import('../route');
    const response = await route.POST(uploadRequest({
      origin: 'https://tseng-law.com',
      'x-forwarded-for': '203.0.113.10',
    }));

    expect(response.status).toBe(201);
    expect(checkRateLimit).toHaveBeenCalledWith('forms-uploads:203.0.113.10', 12, 60_000);
    expect(saveFormUpload).toHaveBeenCalledOnce();
    expect(vi.mocked(checkRateLimit).mock.invocationCallOrder[0])
      .toBeLessThan(vi.mocked(saveFormUpload).mock.invocationCallOrder[0]!);
  });

  it('accepts a same-origin Referer when Origin is absent', async () => {
    const route = await import('../route');
    const response = await route.POST(uploadRequest({
      referer: 'https://tseng-law.com/ko/contact',
    }));

    expect(response.status).toBe(201);
    expect(saveFormUpload).toHaveBeenCalledOnce();
  });

  it('rejects a cross-origin upload before rate limiting or storage', async () => {
    const route = await import('../route');
    const response = await route.POST(uploadRequest({
      origin: 'https://evil.example',
      'x-forwarded-for': '203.0.113.11',
    }));

    expect(response.status).toBe(403);
    await expect(response.json()).resolves.toMatchObject({
      error: 'csrf_origin_mismatch',
    });
    expect(checkRateLimit).not.toHaveBeenCalled();
    expect(saveFormUpload).not.toHaveBeenCalled();
  });

  it('rejects uploads for an unknown form before storage', async () => {
    vi.mocked(loadFormSchema).mockResolvedValue(null);
    const route = await import('../route');
    const response = await route.POST(uploadRequest({
      origin: 'https://tseng-law.com',
    }));

    expect(response.status).toBe(404);
    expect(loadFormSchema).toHaveBeenCalledWith('contact-form');
    expect(saveFormUpload).not.toHaveBeenCalled();
  });

  it('rejects uploads that are not bound to a file field in the stored schema', async () => {
    vi.mocked(loadFormSchema).mockResolvedValue({
      formId: 'contact-form',
      name: 'Contact form',
      fields: [{ id: 'evidence', type: 'text', label: 'Evidence', required: false }],
      submitLabel: 'Submit',
      successMessage: 'ok',
      errorMessage: 'error',
      createdAt: '2026-07-30T00:00:00.000Z',
      updatedAt: '2026-07-30T00:00:00.000Z',
    });
    const route = await import('../route');
    const response = await route.POST(uploadRequest({
      origin: 'https://tseng-law.com',
    }));

    expect(response.status).toBe(400);
    expect(saveFormUpload).not.toHaveBeenCalled();
  });

  it('enforces the stored file field accept policy', async () => {
    vi.mocked(loadFormSchema).mockResolvedValue({
      formId: 'contact-form',
      name: 'Contact form',
      fields: [{
        id: 'evidence',
        type: 'file',
        label: 'Evidence',
        required: false,
        validation: { accept: 'application/pdf,.pdf', maxFileSize: 1024 },
      }],
      submitLabel: 'Submit',
      successMessage: 'ok',
      errorMessage: 'error',
      createdAt: '2026-07-30T00:00:00.000Z',
      updatedAt: '2026-07-30T00:00:00.000Z',
    });
    const route = await import('../route');
    const response = await route.POST(uploadRequest({
      origin: 'https://tseng-law.com',
    }));

    expect(response.status).toBe(400);
    expect(saveFormUpload).not.toHaveBeenCalled();
  });

  it('enforces the stored file field maximum size', async () => {
    vi.mocked(loadFormSchema).mockResolvedValue({
      formId: 'contact-form',
      name: 'Contact form',
      fields: [{
        id: 'evidence',
        type: 'file',
        label: 'Evidence',
        required: false,
        validation: { accept: 'text/plain', maxFileSize: 4 },
      }],
      submitLabel: 'Submit',
      successMessage: 'ok',
      errorMessage: 'error',
      createdAt: '2026-07-30T00:00:00.000Z',
      updatedAt: '2026-07-30T00:00:00.000Z',
    });
    const route = await import('../route');
    const response = await route.POST(uploadRequest({
      origin: 'https://tseng-law.com',
    }));

    expect(response.status).toBe(400);
    expect(saveFormUpload).not.toHaveBeenCalled();
  });

  it('redacts unexpected save failures from the client response and logs', async () => {
    const sensitiveMarker = 'SENSITIVE_UPLOAD_filename=client-evidence.pdf';
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => undefined);
    vi.mocked(saveFormUpload).mockRejectedValueOnce(new Error(sensitiveMarker));
    const route = await import('../route');
    const response = await route.POST(uploadRequest({
      origin: 'https://tseng-law.com',
    }));
    const payload = await response.json();

    expect(response.status).toBe(500);
    expect(payload).toEqual({
      ok: false,
      error: 'form_upload_save_failed',
      code: 'form_upload_save_failed',
      message: 'Unable to save this file right now. Please try again later.',
    });
    expect(JSON.stringify(payload)).not.toContain(sensitiveMarker);
    expect(consoleSpy).toHaveBeenCalledWith(
      '[forms] operation failed',
      'form_upload_save_failed',
      'Error',
    );
    expect(consoleSpy.mock.calls.flat().join(' ')).not.toContain(sensitiveMarker);
  });
});

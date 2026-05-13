import { NextRequest } from 'next/server';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { recordFailedWebhook } from '@/lib/builder/forms/webhook-retry';
import { checkRateLimit } from '@/lib/builder/security/rate-limit';

vi.mock('@/lib/builder/forms/form-engine', async () => {
  const actual = await vi.importActual<typeof import('@/lib/builder/forms/form-engine')>(
    '@/lib/builder/forms/form-engine',
  );
  return {
    ...actual,
    loadFormSchema: vi.fn(),
    saveSubmission: vi.fn(),
  };
});

vi.mock('@/lib/builder/forms/uploads', () => ({
  saveFormUpload: vi.fn(async ({ fieldId, file }: { fieldId: string; file: File }) => ({
    fieldId,
    name: file.name,
    size: file.size,
    type: file.type,
    pathname: `builder-forms/uploads/ko/${file.name}`,
    url: `/api/forms/uploads/ko/${file.name}`,
    uploadedAt: '2026-05-11T00:00:00.000Z',
  })),
}));

vi.mock('@/lib/builder/webhooks/dispatcher', () => ({
  emitEvent: vi.fn(),
}));

vi.mock('@/lib/builder/forms/webhook-retry', () => ({
  recordFailedWebhook: vi.fn(async () => undefined),
}));

vi.mock('@/lib/builder/security/rate-limit', () => ({
  checkRateLimit: vi.fn(async () => ({ allowed: true, remaining: 4, retryAfterMs: 0 })),
}));

describe('/api/forms/submit', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(checkRateLimit).mockResolvedValue({ allowed: true, remaining: 4, retryAfterMs: 0 });
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  it('validates against stored form schema and rejects invalid fields', async () => {
    const engine = await import('@/lib/builder/forms/form-engine');
    vi.mocked(engine.loadFormSchema).mockResolvedValue({
      formId: 'lead-form',
      name: 'Lead form',
      fields: [
        {
          id: 'amount',
          type: 'number',
          label: 'Amount',
          required: true,
          validation: { min: 10, max: 20 },
        },
      ],
      submitLabel: 'Submit',
      successMessage: 'ok',
      errorMessage: 'err',
      createdAt: '2026-05-11T00:00:00Z',
      updatedAt: '2026-05-11T00:00:00Z',
    });
    const route = await import('../submit/route');
    const request = makeRequest({
      formId: 'lead-form',
      formName: 'Lead form',
      submitTo: 'storage',
      fields: { amount: '50' },
      loadedAt: 0,
      submittedAt: 4000,
    });

    const response = await route.POST(request);
    const payload = await response.json();

    expect(response.status).toBe(400);
    expect(payload.validationErrors).toEqual(
      expect.arrayContaining([expect.objectContaining({ fieldId: 'amount' })]),
    );
    expect(engine.saveSubmission).not.toHaveBeenCalled();
  });

  it('materializes signature data URLs and stores submission files', async () => {
    const engine = await import('@/lib/builder/forms/form-engine');
    vi.mocked(engine.loadFormSchema).mockResolvedValue(null);
    const route = await import('../submit/route');
    const request = makeRequest({
      formId: 'signature-form',
      formName: 'Signature form',
      submitTo: 'storage',
      fields: { signature: 'data:image/png;base64,aGVsbG8=' },
      locale: 'ko',
      loadedAt: 0,
      submittedAt: 4000,
    });

    const response = await route.POST(request);
    const payload = await response.json();

    expect(response.status).toBe(200);
    expect(payload.ok).toBe(true);
    expect(engine.saveSubmission).toHaveBeenCalledWith(
      expect.objectContaining({
        formId: 'signature-form',
        data: expect.objectContaining({ signature: '/api/forms/uploads/ko/signature-signature.png' }),
        files: expect.arrayContaining([expect.objectContaining({ fieldId: 'signature' })]),
      }),
    );
  });

  it('returns Retry-After when the submit rate limit is exceeded', async () => {
    vi.mocked(checkRateLimit).mockResolvedValueOnce({ allowed: false, remaining: 0, retryAfterMs: 2500 });
    const engine = await import('@/lib/builder/forms/form-engine');
    const route = await import('../submit/route');
    const response = await route.POST(makeRequest({}));
    const payload = await response.json();

    expect(response.status).toBe(429);
    expect(response.headers.get('retry-after')).toBe('3');
    expect(payload.error).toContain('요청이 너무 많습니다');
    expect(engine.saveSubmission).not.toHaveBeenCalled();
  });

  it('records failed webhook deliveries without failing the form response', async () => {
    const engine = await import('@/lib/builder/forms/form-engine');
    vi.mocked(engine.loadFormSchema).mockResolvedValue(null);
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => undefined);
    const fetchMock = vi.fn(async () => new Response('downstream unavailable', { status: 503 }));
    vi.stubGlobal('fetch', fetchMock);
    const route = await import('../submit/route');
    const request = makeRequest({
      formId: 'webhook-form',
      formName: 'Webhook form',
      submitTo: 'webhook',
      webhookUrl: 'https://hooks.example.test/form',
      fields: { email: 'client@example.test' },
      loadedAt: 0,
      submittedAt: 4000,
    });

    const response = await route.POST(request);
    const payload = await response.json();

    expect(response.status).toBe(200);
    expect(payload.ok).toBe(true);
    expect(fetchMock).toHaveBeenCalledWith(
      'https://hooks.example.test/form',
      expect.objectContaining({ method: 'POST' }),
    );
    expect(recordFailedWebhook).toHaveBeenCalledWith(
      'https://hooks.example.test/form',
      expect.objectContaining({
        formName: 'Webhook form',
        fields: { email: 'client@example.test' },
      }),
      expect.any(Error),
    );
    consoleError.mockRestore();
  });
});

function makeRequest(body: unknown): NextRequest {
  return new NextRequest('http://localhost/api/forms/submit', {
    method: 'POST',
    headers: { 'content-type': 'application/json', 'x-forwarded-for': randomIp() },
    body: JSON.stringify(body),
  });
}

function randomIp(): string {
  return `127.0.0.${Math.floor(Math.random() * 200) + 1}`;
}

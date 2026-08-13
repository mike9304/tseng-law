import { NextRequest } from 'next/server';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { checkRateLimit } from '@/lib/builder/security/rate-limit';
import { sendConsultationEmail } from '@/lib/email/send-consultation-email';

vi.mock('@/lib/builder/security/rate-limit', () => ({
  checkRateLimit: vi.fn(async () => ({ allowed: true, remaining: 2, retryAfterMs: 0 })),
}));

vi.mock('@/lib/consultation/rate-limit', () => ({
  checkSubmitRateLimit: vi.fn(() => ({ allowed: true, retryAfterMs: 0 })),
}));

vi.mock('@/lib/consultation/idempotency', () => ({
  hasAlreadySubmitted: vi.fn(() => null),
  markSubmitted: vi.fn(),
}));

vi.mock('@/lib/consultation/db', () => ({
  saveConsultationLead: vi.fn(async () => undefined),
}));

vi.mock('@/lib/consultation/log-store', () => ({
  logConsultationFunnelEvent: vi.fn(async () => undefined),
  logConsultationSubmitEvent: vi.fn(async () => undefined),
}));

vi.mock('@/lib/email/send-consultation-email', () => ({
  sendConsultationEmail: vi.fn(async () => ({ intakeId: 'HC-TEST1234' })),
}));

describe('/api/consultation/submit', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(checkRateLimit).mockResolvedValue({
      allowed: true,
      remaining: 2,
      retryAfterMs: 0,
    });
  });

  it('rejects a cross-origin request before parsing or rate limiting', async () => {
    const route = await import('../route');
    const response = await route.POST(makeRequest(validBody(), {
      url: 'https://tseng-law.com/api/consultation/submit',
      origin: 'https://attacker.example',
    }));

    expect(response.status).toBe(403);
    expect(checkRateLimit).not.toHaveBeenCalled();
    expect(sendConsultationEmail).not.toHaveBeenCalled();
  });

  it('rejects a production request with no Origin or Referer', async () => {
    const route = await import('../route');
    const response = await route.POST(makeRequest(validBody(), {
      url: 'https://tseng-law.com/api/consultation/submit',
    }));

    expect(response.status).toBe(403);
    expect(checkRateLimit).not.toHaveBeenCalled();
  });

  it('rejects overlong collected fields and transcript entries', async () => {
    const route = await import('../route');
    const response = await route.POST(makeRequest({
      ...validBody(),
      collectedFields: {
        ...validBody().collectedFields,
        summary: 'x'.repeat(10_001),
      },
      transcript: [{ role: 'user', text: 'x'.repeat(4_001) }],
    }));

    expect(response.status).toBe(400);
    expect(checkRateLimit).not.toHaveBeenCalled();
    expect(sendConsultationEmail).not.toHaveBeenCalled();
  });

  it('requires a valid email and rejects header injection', async () => {
    const route = await import('../route');
    const response = await route.POST(makeRequest({
      ...validBody(),
      collectedFields: {
        ...validBody().collectedFields,
        email: 'victim@example.com\r\nBcc: attacker@example.com',
      },
    }));

    expect(response.status).toBe(400);
    expect(sendConsultationEmail).not.toHaveBeenCalled();
  });

  it('rejects attachment-like properties rather than accepting file content', async () => {
    const route = await import('../route');
    const response = await route.POST(makeRequest({
      ...validBody(),
      attachments: [{ name: 'case.pdf', content: 'base64-data' }],
    }));

    expect(response.status).toBe(400);
    expect(sendConsultationEmail).not.toHaveBeenCalled();
  });

  it('applies durable IP and session rate limits before the existing limiter', async () => {
    vi.mocked(checkRateLimit)
      .mockResolvedValueOnce({ allowed: true, remaining: 9, retryAfterMs: 0 })
      .mockResolvedValueOnce({ allowed: false, remaining: 0, retryAfterMs: 4_500 });
    const route = await import('../route');
    const response = await route.POST(makeRequest(validBody()));

    expect(response.status).toBe(429);
    expect(response.headers.get('retry-after')).toBe('5');
    expect(checkRateLimit).toHaveBeenCalledTimes(2);
    expect(checkRateLimit).toHaveBeenCalledWith(
      'consultation-submit:ip:127.0.0.42',
      10,
      300_000,
    );
    expect(checkRateLimit).toHaveBeenCalledWith(
      'consultation-submit:session:session-123',
      3,
      300_000,
    );
    expect(sendConsultationEmail).not.toHaveBeenCalled();
  });
});

function validBody() {
  return {
    locale: 'ko',
    sessionId: 'session-123',
    collectedFields: {
      name: 'Client',
      email: 'client@example.test',
      phoneOrMessenger: '',
      summary: 'Need legal advice.',
      consent: true,
    },
    transcript: [{ role: 'user', text: 'Hello' }],
    classification: 'general',
    riskLevel: 'L2',
    referencedColumns: ['column-1'],
  };
}

function makeRequest(
  body: unknown,
  options: { url?: string; origin?: string } = {},
): NextRequest {
  const headers = new Headers({
    'content-type': 'application/json',
    'x-forwarded-for': '127.0.0.42',
  });
  if (options.origin) headers.set('origin', options.origin);
  return new NextRequest(
    options.url ?? 'http://localhost/api/consultation/submit',
    {
      method: 'POST',
      headers,
      body: JSON.stringify(body),
    },
  );
}

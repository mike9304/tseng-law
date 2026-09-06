import { NextRequest } from 'next/server';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { checkRateLimit } from '@/lib/builder/security/rate-limit';
import { appendConsultationLogLine } from '@/lib/consultation/log-storage';
import {
  authHeaders,
  stubAiIntakeTestEnv,
  TEST_AI_INTAKE_CLIENT_KEY,
} from '@/lib/ai-intake/__tests__/helpers';
import { resetAiIntakeAuthCacheForTests } from '@/lib/ai-intake/auth';

vi.mock('@/lib/builder/security/rate-limit', () => ({
  checkRateLimit: vi.fn(async () => ({ allowed: true, remaining: 10, retryAfterMs: 0 })),
}));

vi.mock('@/lib/consultation/log-storage', () => ({
  appendConsultationLogLine: vi.fn(async () => undefined),
}));

describe('GET /api/ai/intake/requirements', () => {
  beforeEach(() => {
    stubAiIntakeTestEnv();
    vi.mocked(checkRateLimit).mockResolvedValue({ allowed: true, remaining: 10, retryAfterMs: 0 });
    vi.mocked(appendConsultationLogLine).mockClear();
  });

  afterEach(() => {
    vi.unstubAllEnvs();
    resetAiIntakeAuthCacheForTests();
  });

  it('requires bearer auth and returns Japanese copy without Korean fallback', async () => {
    const { GET } = await import('../route');
    const unauth = await GET(new NextRequest('http://localhost/api/ai/intake/requirements?locale=ja'));
    expect(unauth.status).toBe(401);
    const body = await unauth.json();
    expect(body.error.code).toBe('UNAUTHENTICATED');
    expect(JSON.stringify(body)).not.toContain(TEST_AI_INTAKE_CLIENT_KEY);
    expect(appendConsultationLogLine).not.toHaveBeenCalled();

    const response = await GET(new NextRequest('http://localhost/api/ai/intake/requirements?locale=ja&category=labor', {
      headers: authHeaders(),
    }));
    expect(response.status).toBe(200);
    const payload = await response.json();
    expect(payload.ok).toBe(true);
    expect(payload.locale).toBe('ja');
    expect(payload.questions.join('\n')).toContain('お名前');
    expect(payload.questions.join('\n')).not.toContain('성함');
    expect(payload.notices.emergency).not.toMatch(/\d{3}/);
    expect(appendConsultationLogLine).not.toHaveBeenCalled();
  });

  it('rejects unknown, duplicate, and empty category query keys without reflecting them', async () => {
    const { GET } = await import('../route');
    const unknown = await GET(new NextRequest('http://localhost/api/ai/intake/requirements?locale=en&x4111111111111111=1', {
      headers: authHeaders(),
    }));
    expect(unknown.status).toBe(400);
    const unknownBody = await unknown.json();
    expect(unknownBody.error.code).toBe('INVALID_REQUEST');
    expect(JSON.stringify(unknownBody)).not.toContain('x4111111111111111');

    const duplicate = await GET(new NextRequest('http://localhost/api/ai/intake/requirements?locale=en&locale=ko', {
      headers: authHeaders(),
    }));
    expect(duplicate.status).toBe(400);

    const emptyCategory = await GET(new NextRequest('http://localhost/api/ai/intake/requirements?locale=en&category=', {
      headers: authHeaders(),
    }));
    expect(emptyCategory.status).toBe(400);
    expect(appendConsultationLogLine).not.toHaveBeenCalled();
  });

  it('maps limiter backend failure to 503 and throttling to 429 without business storage', async () => {
    const { GET } = await import('../route');
    vi.mocked(checkRateLimit).mockResolvedValueOnce({
      allowed: false,
      remaining: 0,
      retryAfterMs: 0,
      reason: 'backend_unavailable',
    });
    const unavailable = await GET(new NextRequest('http://localhost/api/ai/intake/requirements?locale=en', {
      headers: authHeaders(),
    }));
    expect(unavailable.status).toBe(503);
    expect((await unavailable.json()).error.code).toBe('BACKEND_UNAVAILABLE');

    vi.mocked(checkRateLimit).mockResolvedValue({
      allowed: false,
      remaining: 0,
      retryAfterMs: 4000,
    });
    const throttled = await GET(new NextRequest('http://localhost/api/ai/intake/requirements?locale=en', {
      headers: authHeaders(),
    }));
    expect(throttled.status).toBe(429);
    expect(throttled.headers.get('retry-after')).toBe('4');
    expect(appendConsultationLogLine).not.toHaveBeenCalled();
  });

  it('contains a thrown limiter failure as structured JSON', async () => {
    const { GET } = await import('../route');
    vi.mocked(checkRateLimit).mockRejectedValueOnce(new Error('limiter stack TRACE'));
    const response = await GET(new NextRequest('http://localhost/api/ai/intake/requirements?locale=en', {
      headers: authHeaders(),
    }));
    expect(response.status).toBe(503);
    const body = await response.json();
    expect(body.error.code).toBe('BACKEND_UNAVAILABLE');
    expect(JSON.stringify(body)).not.toContain('TRACE');
  });

  it('uses the canonical privacy origin and never reflects URL credentials', async () => {
    const { GET } = await import('../route');
    for (const raw of [
      'https://evil-user:leak-pass@hostile.example/secret?q=1#frag',
      'https://@hostile.example',
      'https://:@hostile.example',
      'https://2130706433',
      'https:/example.test',
      '//hostile.example',
      'http:\\\\hostile.example',
    ]) {
      vi.stubEnv('NEXT_PUBLIC_SITE_URL', raw);
      vi.stubEnv('SITE_URL', raw);
      const response = await GET(new NextRequest('http://localhost/api/ai/intake/requirements?locale=en', {
        headers: authHeaders(),
      }));
      expect(response.status).toBe(200);
      const payload = await response.json();
      expect(payload.privacyUrl).toBe('https://tseng-law.com/en/privacy');
      const serialized = JSON.stringify(payload);
      expect(serialized).not.toContain('evil-user');
      expect(serialized).not.toContain('leak-pass');
      expect(serialized).not.toContain('hostile.example');
      expect(serialized).not.toContain('2130706433');
      expect(serialized).not.toContain(raw);
    }
  });
});

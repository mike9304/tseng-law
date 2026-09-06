import { NextRequest } from 'next/server';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { checkRateLimit } from '@/lib/builder/security/rate-limit';
import { sendPreparedAiIntakeEmail } from '@/lib/email/send-consultation-email';
import { appendConsultationLogLine } from '@/lib/consultation/log-storage';
import {
  authHeaders,
  stubAiIntakeTestEnv,
  validPreviewBody,
} from '@/lib/ai-intake/__tests__/helpers';
import { resetAiIntakeAuthCacheForTests } from '@/lib/ai-intake/auth';
import { resetAiIntakeClaimStoreForTests } from '@/lib/ai-intake/store';

vi.mock('@/lib/builder/security/rate-limit', () => ({
  checkRateLimit: vi.fn(async () => ({ allowed: true, remaining: 10, retryAfterMs: 0 })),
}));

vi.mock('@/lib/consultation/log-storage', () => ({
  appendConsultationLogLine: vi.fn(async () => undefined),
}));

vi.mock('@/lib/email/send-consultation-email', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@/lib/email/send-consultation-email')>();
  return {
    ...actual,
    sendPreparedAiIntakeEmail: vi.fn(async () => ({ intakeId: 'HC-SHOULDNOT' })),
  };
});

describe('POST /api/ai/intake/preview', () => {
  beforeEach(() => {
    stubAiIntakeTestEnv();
    vi.mocked(checkRateLimit).mockResolvedValue({ allowed: true, remaining: 10, retryAfterMs: 0 });
    vi.mocked(sendPreparedAiIntakeEmail).mockClear();
    vi.mocked(appendConsultationLogLine).mockClear();
    resetAiIntakeClaimStoreForTests();
  });

  afterEach(() => {
    vi.unstubAllEnvs();
    resetAiIntakeAuthCacheForTests();
    resetAiIntakeClaimStoreForTests();
  });

  it('returns a canonical preview and never sends mail or writes business storage', async () => {
    const { POST } = await import('../route');
    const response = await POST(new NextRequest('http://localhost/api/ai/intake/preview', {
      method: 'POST',
      headers: authHeaders(),
      body: JSON.stringify(validPreviewBody()),
    }));
    expect(response.status).toBe(200);
    const payload = await response.json();
    expect(payload.ok).toBe(true);
    expect(payload.subject).toContain(payload.intakeId);
    expect(payload.body).toContain('Jane Doe');
    expect(sendPreparedAiIntakeEmail).not.toHaveBeenCalled();
    expect(appendConsultationLogLine).not.toHaveBeenCalled();
  });

  it('rejects extra fields and sensitive values without echoing them', async () => {
    const { POST } = await import('../route');
    const extra = await POST(new NextRequest('http://localhost/api/ai/intake/preview', {
      method: 'POST',
      headers: authHeaders(),
      body: JSON.stringify({
        ...validPreviewBody(),
        transcript: [{ role: 'user', text: 'hi' }],
        x4111111111111111: '4111111111111111',
      }),
    }));
    expect(extra.status).toBe(400);
    const extraBody = await extra.json();
    expect(JSON.stringify(extraBody)).not.toContain('x4111111111111111');
    expect(JSON.stringify(extraBody)).not.toContain('4111111111111111');

    const sensitive = await POST(new NextRequest('http://localhost/api/ai/intake/preview', {
      method: 'POST',
      headers: authHeaders(),
      body: JSON.stringify(validPreviewBody({
        summary: 'Need review',
        phoneOrMessenger: 'GB82 WEST 1234 5698 7654 32',
      })),
    }));
    expect(sensitive.status).toBe(422);
    const body = await sensitive.json();
    expect(body.error.code).toBe('SENSITIVE_DATA_REJECTED');
    expect(JSON.stringify(body)).not.toContain('GB82');
    expect(sendPreparedAiIntakeEmail).not.toHaveBeenCalled();
    expect(appendConsultationLogLine).not.toHaveBeenCalled();
  });
});

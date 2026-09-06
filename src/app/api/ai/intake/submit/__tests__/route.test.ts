import { NextRequest } from 'next/server';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { appendConsultationLogLine } from '@/lib/consultation/log-storage';
import {
  authHeaders,
  stubAiIntakeTestEnv,
  TEST_AI_INTAKE_CLIENT_KEY,
  validPreviewBody,
} from '@/lib/ai-intake/__tests__/helpers';
import { resetAiIntakeAuthCacheForTests } from '@/lib/ai-intake/auth';
import {
  resetAiIntakeClaimStoreForTests,
  setAiIntakeClaimStoreForTests,
} from '@/lib/ai-intake/store';
import { submitAiIntake } from '@/lib/ai-intake/submit';
import {
  resetAiIntakeSubmitRateLimiterForTests,
  setAiIntakeSubmitRateLimiterForTests,
} from '@/lib/ai-intake/submit-rate-limit';

const sendMail = vi.fn(async () => ({ messageId: 'test-message-id' }));

vi.mock('nodemailer', () => ({
  default: {
    createTransport: vi.fn(() => ({ sendMail })),
  },
}));

vi.mock('@/lib/consultation/log-storage', () => ({
  appendConsultationLogLine: vi.fn(async () => undefined),
}));

vi.mock('@/lib/ai-intake/submit', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@/lib/ai-intake/submit')>();
  return {
    ...actual,
    submitAiIntake: vi.fn(actual.submitAiIntake),
  };
});

function submitBody(overrides: Record<string, unknown> = {}) {
  return {
    ...validPreviewBody(),
    confirmationToken: 'a'.repeat(40),
    privacyConsent: true,
    userApprovedExactPreview: true,
    ...overrides,
  };
}

async function previewToken(body: Record<string, unknown> = validPreviewBody()) {
  const { POST } = await import('../../preview/route');
  const response = await POST(new NextRequest('http://localhost/api/ai/intake/preview', {
    method: 'POST',
    headers: authHeaders(),
    body: JSON.stringify(body),
  }));
  return response.json() as Promise<{
    ok: boolean;
    confirmationToken: string;
    subject: string;
    body: string;
    intakeId: string;
    digest: string;
  }>;
}

describe('POST /api/ai/intake/submit', () => {
  beforeEach(() => {
    stubAiIntakeTestEnv();
    sendMail.mockReset();
    sendMail.mockResolvedValue({ messageId: 'test-message-id' });
    vi.mocked(appendConsultationLogLine).mockClear();
    vi.mocked(submitAiIntake).mockClear();
    resetAiIntakeClaimStoreForTests();
    resetAiIntakeSubmitRateLimiterForTests();
  });

  afterEach(() => {
    vi.unstubAllEnvs();
    resetAiIntakeAuthCacheForTests();
    resetAiIntakeClaimStoreForTests();
    resetAiIntakeSubmitRateLimiterForTests();
  });

  it('refuses submit without consent or token and never sends', async () => {
    const { POST } = await import('../route');
    const noConsent = await POST(new NextRequest('http://localhost/api/ai/intake/submit', {
      method: 'POST',
      headers: authHeaders(),
      body: JSON.stringify({ ...validPreviewBody(), confirmationToken: 'a'.repeat(40) }),
    }));
    expect(noConsent.status).toBe(400);
    expect((await noConsent.json()).error.code).toBe('CONSENT_REQUIRED');
    const invalidToken = await POST(new NextRequest('http://localhost/api/ai/intake/submit', {
      method: 'POST',
      headers: authHeaders(),
      body: JSON.stringify(submitBody({ confirmationToken: 'a'.repeat(40) })),
    }));
    expect(invalidToken.status).toBe(400);
    expect((await invalidToken.json()).error.code).toBe('TOKEN_INVALID');
    expect(sendMail).not.toHaveBeenCalled();
  });

  it('returns CONSENT_REQUIRED for consent true-like values that are not literal true', async () => {
    const { POST } = await import('../route');
    const response = await POST(new NextRequest('http://localhost/api/ai/intake/submit', {
      method: 'POST',
      headers: authHeaders(),
      body: JSON.stringify(submitBody({ privacyConsent: 'true' })),
    }));
    expect(response.status).toBe(400);
    expect((await response.json()).error.code).toBe('CONSENT_REQUIRED');
    expect(submitAiIntake).not.toHaveBeenCalled();
    expect(sendMail).not.toHaveBeenCalled();
  });

  it('returns APPROVAL_REQUIRED for absent, false, string, number, and null userApprovedExactPreview', async () => {
    const { POST } = await import('../route');
    for (const userApprovedExactPreview of [undefined, false, 'true', 1, null] as const) {
      const body = submitBody() as Record<string, unknown>;
      if (userApprovedExactPreview === undefined) delete body.userApprovedExactPreview;
      else body.userApprovedExactPreview = userApprovedExactPreview;
      vi.mocked(submitAiIntake).mockClear();
      const response = await POST(new NextRequest('http://localhost/api/ai/intake/submit', {
        method: 'POST',
        headers: authHeaders(),
        body: JSON.stringify(body),
      }));
      expect(response.status).toBe(400);
      expect((await response.json()).error.code).toBe('APPROVAL_REQUIRED');
      expect(submitAiIntake).not.toHaveBeenCalled();
      expect(sendMail).not.toHaveBeenCalled();
    }
  });

  it('maps consent before approval and strips the attestation before core submit', async () => {
    const { POST } = await import('../route');
    const post = (body: Record<string, unknown>) => POST(new NextRequest('http://localhost/api/ai/intake/submit', {
      method: 'POST',
      headers: authHeaders(),
      body: JSON.stringify(body),
    }));

    const consentInvalid = await post(submitBody({ privacyConsent: false }));
    expect(consentInvalid.status).toBe(400);
    expect((await consentInvalid.json()).error.code).toBe('CONSENT_REQUIRED');

    const approvalInvalid = await post(submitBody({ userApprovedExactPreview: 'true' }));
    expect(approvalInvalid.status).toBe(400);
    expect((await approvalInvalid.json()).error.code).toBe('APPROVAL_REQUIRED');

    const bothInvalid = await post({
      ...validPreviewBody(),
      confirmationToken: 'a'.repeat(40),
    });
    expect(bothInvalid.status).toBe(400);
    expect((await bothInvalid.json()).error.code).toBe('CONSENT_REQUIRED');
    expect(submitAiIntake).not.toHaveBeenCalled();
    expect(sendMail).not.toHaveBeenCalled();

    const bothTrue = await post(submitBody());
    expect(bothTrue.status).toBe(400);
    expect((await bothTrue.json()).error.code).toBe('TOKEN_INVALID');
    expect(submitAiIntake).toHaveBeenCalledTimes(1);
    const coreRequest = vi.mocked(submitAiIntake).mock.calls[0]?.[0]?.request;
    expect(coreRequest).toBeDefined();
    expect(coreRequest).not.toHaveProperty('userApprovedExactPreview');
    expect(coreRequest?.privacyConsent).toBe(true);
    expect(sendMail).not.toHaveBeenCalled();
  });

  it('sends the previewed subject/text and rejects mutation after preview', async () => {
    const preview = await previewToken();
    const { POST } = await import('../route');
    const sent = await POST(new NextRequest('http://localhost/api/ai/intake/submit', {
      method: 'POST',
      headers: authHeaders(),
      body: JSON.stringify(submitBody({ confirmationToken: preview.confirmationToken })),
    }));
    expect(sent.status).toBe(201);
    expect(sendMail).toHaveBeenCalledWith(expect.objectContaining({
      subject: preview.subject,
      text: preview.body,
    }));

    const mutated = await POST(new NextRequest('http://localhost/api/ai/intake/submit', {
      method: 'POST',
      headers: authHeaders(),
      body: JSON.stringify(submitBody({
        summary: 'Changed after preview',
        confirmationToken: preview.confirmationToken,
      })),
    }));
    expect(mutated.status).toBe(409);
    expect((await mutated.json()).error.code).toBe('PREVIEW_MISMATCH');
  });

  it('maps limiter rejection, claim rejection, 409, 502, and 503 without leaking internals', async () => {
    const { POST } = await import('../route');
    setAiIntakeSubmitRateLimiterForTests({
      async consume() {
        return { allowed: false, retryAfterMs: 5000 };
      },
    });
    const throttled = await POST(new NextRequest('http://localhost/api/ai/intake/submit', {
      method: 'POST',
      headers: authHeaders(),
      body: JSON.stringify(submitBody()),
    }));
    expect(throttled.status).toBe(429);
    expect((await throttled.json()).error.code).toBe('RATE_LIMITED');
    resetAiIntakeSubmitRateLimiterForTests();

    setAiIntakeSubmitRateLimiterForTests({
      async consume() {
        throw new Error('rate TRACE');
      },
    });
    const limiterThrow = await POST(new NextRequest('http://localhost/api/ai/intake/submit', {
      method: 'POST',
      headers: authHeaders(),
      body: JSON.stringify(submitBody()),
    }));
    expect(limiterThrow.status).toBe(503);
    expect(JSON.stringify(await limiterThrow.json())).not.toContain('TRACE');
    resetAiIntakeSubmitRateLimiterForTests();

    const preview = await previewToken(validPreviewBody({
      idempotencyKey: 'aaaaaaaa-eeee-4ccc-8ddd-eeeeeeeeeeee',
    }));
    setAiIntakeClaimStoreForTests({
      async lookup() {
        return { type: 'absent' };
      },
      async claim() {
        throw new Error('claim TRACE secret');
      },
      async update() {
        return 'updated';
      },
    });
    const claimThrow = await POST(new NextRequest('http://localhost/api/ai/intake/submit', {
      method: 'POST',
      headers: authHeaders(),
      body: JSON.stringify(submitBody({
        idempotencyKey: 'aaaaaaaa-eeee-4ccc-8ddd-eeeeeeeeeeee',
        confirmationToken: preview.confirmationToken,
      })),
    }));
    expect(claimThrow.status).toBe(503);
    const claimBody = await claimThrow.json();
    expect(claimBody.error.code).toBe('BACKEND_UNAVAILABLE');
    expect(JSON.stringify(claimBody)).not.toContain('TRACE');
    expect(JSON.stringify(claimBody)).not.toContain(TEST_AI_INTAKE_CLIENT_KEY);
    expect(sendMail).not.toHaveBeenCalled();

    resetAiIntakeClaimStoreForTests();
    const first = await POST(new NextRequest('http://localhost/api/ai/intake/submit', {
      method: 'POST',
      headers: authHeaders(),
      body: JSON.stringify(submitBody({
        idempotencyKey: 'aaaaaaaa-eeee-4ccc-8ddd-eeeeeeeeeeee',
        confirmationToken: preview.confirmationToken,
      })),
    }));
    expect(first.status).toBe(201);

    const otherPreview = await previewToken(validPreviewBody({
      idempotencyKey: 'aaaaaaaa-eeee-4ccc-8ddd-eeeeeeeeeeee',
      summary: 'A different summary after a new preview.',
    }));
    const conflict = await POST(new NextRequest('http://localhost/api/ai/intake/submit', {
      method: 'POST',
      headers: authHeaders(),
      body: JSON.stringify(submitBody({
        idempotencyKey: 'aaaaaaaa-eeee-4ccc-8ddd-eeeeeeeeeeee',
        summary: 'A different summary after a new preview.',
        confirmationToken: otherPreview.confirmationToken,
      })),
    }));
    expect(conflict.status).toBe(409);
    expect((await conflict.json()).error.code).toBe('IDEMPOTENCY_CONFLICT');

    sendMail.mockRejectedValueOnce(new Error('smtp TRACE'));
    const unknownPreview = await previewToken(validPreviewBody({
      idempotencyKey: 'aaaaaaaa-ffff-4ccc-8ddd-eeeeeeeeeeee',
    }));
    const unknown = await POST(new NextRequest('http://localhost/api/ai/intake/submit', {
      method: 'POST',
      headers: authHeaders(),
      body: JSON.stringify(submitBody({
        idempotencyKey: 'aaaaaaaa-ffff-4ccc-8ddd-eeeeeeeeeeee',
        confirmationToken: unknownPreview.confirmationToken,
      })),
    }));
    expect(unknown.status).toBe(502);
    const unknownBody = await unknown.json();
    expect(unknownBody.error.code).toBe('DELIVERY_UNKNOWN');
    expect(JSON.stringify(unknownBody)).not.toContain('TRACE');
  });
});

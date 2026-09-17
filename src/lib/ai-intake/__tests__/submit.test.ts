import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import nodemailer from 'nodemailer';
import { BlobPreconditionFailedError } from '@vercel/blob';
import {
  AI_INTAKE_AUDIT_TIMEOUT_MS,
  AI_INTAKE_BACKEND_TIMEOUT_MS,
  AI_INTAKE_CLAIM_TTL_MS,
  AI_INTAKE_SENDING_LEASE_MS,
} from '@/lib/ai-intake/constants';
import { setAiIntakeNowMsForTests } from '@/lib/ai-intake/clock';
import { buildCanonicalAiIntakeEmail } from '@/lib/ai-intake/canonical';
import { previewAiIntake } from '@/lib/ai-intake/preview';
import {
  aiIntakeMemoryClaimCountForTests,
  resetAiIntakeClaimStoreForTests,
  setAiIntakeClaimStoreForTests,
  type AiIntakeClaimRecord,
  type AiIntakeClaimStore,
} from '@/lib/ai-intake/store';
import { submitAiIntake } from '@/lib/ai-intake/submit';
import { hashAiIntakeIdempotencyKey, mintAiIntakeConfirmationToken } from '@/lib/ai-intake/token';
import { aiIntakePreviewRequestSchema } from '@/lib/ai-intake/schemas';
import {
  stubAiIntakeTestEnv,
  TEST_AI_INTAKE_CLIENT_ID,
  validPreviewBody,
} from '@/lib/ai-intake/__tests__/helpers';
import { appendConsultationLogLine } from '@/lib/consultation/log-storage';

const sendMail = vi.fn(async () => ({ messageId: 'test-message-id' }));
const createTransport = vi.mocked(nodemailer.createTransport);

vi.mock('nodemailer', () => ({
  default: {
    createTransport: vi.fn(() => ({ sendMail })),
  },
}));

vi.mock('@/lib/consultation/log-storage', () => ({
  appendConsultationLogLine: vi.fn(async () => undefined),
}));

vi.mock('@vercel/blob', async () => {
  const actual = await vi.importActual<typeof import('@vercel/blob')>('@vercel/blob');
  return {
    ...actual,
    put: vi.fn(),
    get: vi.fn(),
    del: vi.fn(),
  };
});

import { del as blobDel, get as blobGet, put as blobPut } from '@vercel/blob';

const putMock = vi.mocked(blobPut);
const getMock = vi.mocked(blobGet);
const delMock = vi.mocked(blobDel);

function blobGetResult(record: object, etag = 'etag-1') {
  const existingBody = JSON.stringify(record);
  return {
    statusCode: 200,
    stream: new ReadableStream({
      start(controller) {
        controller.enqueue(new TextEncoder().encode(existingBody));
        controller.close();
      },
    }),
    headers: new Headers(),
    blob: {
      etag,
      url: '',
      downloadUrl: '',
      pathname: '',
      contentDisposition: '',
      cacheControl: '',
      uploadedAt: new Date(),
      contentType: 'application/json',
      size: existingBody.length,
    },
  } as never;
}

const logMock = vi.mocked(appendConsultationLogLine);

function parsedAuditLines(): Array<Record<string, unknown>> {
  return logMock.mock.calls.map((call) => {
    const serialized = call[2];
    expect(typeof serialized).toBe('string');
    return JSON.parse(String(serialized)) as Record<string, unknown>;
  });
}

function expectAuditOmitsCategory(record: Record<string, unknown>, hostile?: string): void {
  expect(Object.prototype.hasOwnProperty.call(record, 'aiIntakeCategory')).toBe(false);
  const serialized = JSON.stringify(record);
  expect(serialized).not.toContain('"aiIntakeCategory"');
  if (hostile !== undefined) {
    expect(serialized).not.toContain(hostile);
  }
  expect(String(record.metadataRedacted ?? '')).not.toMatch(/category/i);
}

function expectTrustedAuditCategory(record: Record<string, unknown>, category: string): void {
  expect(record.aiIntakeCategory).toBe(category);
  const metadata = String(record.metadataRedacted ?? '');
  expect(metadata).not.toMatch(/category/i);
  expect(metadata).not.toContain(category);
}

function previewRequest(overrides: Record<string, unknown> = {}) {
  return aiIntakePreviewRequestSchema.parse(validPreviewBody(overrides));
}

function injectedStore(store: {
  lookup?: AiIntakeClaimStore['lookup'];
  claim: AiIntakeClaimStore['claim'];
  update: AiIntakeClaimStore['update'];
}): AiIntakeClaimStore {
  return {
    lookup: store.lookup ?? (async () => ({ type: 'absent' as const })),
    claim: store.claim,
    update: store.update,
  };
}

function claimRecord(input: {
  intakeId: string;
  digest: string;
  status: AiIntakeClaimRecord['status'];
  updatedAt?: string;
  createdAt?: string;
}): AiIntakeClaimRecord {
  const timestamp = input.createdAt ?? new Date().toISOString();
  return {
    v: 1,
    intakeId: input.intakeId,
    digest: input.digest,
    status: input.status,
    createdAt: timestamp,
    updatedAt: input.updatedAt ?? timestamp,
  };
}

describe('submitAiIntake', () => {
  beforeEach(() => {
    stubAiIntakeTestEnv();
    sendMail.mockReset();
    sendMail.mockResolvedValue({ messageId: 'test-message-id' });
    createTransport.mockClear();
    logMock.mockReset();
    logMock.mockResolvedValue(undefined);
    resetAiIntakeClaimStoreForTests();
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.unstubAllEnvs();
    resetAiIntakeClaimStoreForTests();
  });

  it('sends the exact preview subject and text once, and replays without a second send', async () => {
    const request = previewRequest();
    const preview = previewAiIntake({ request, clientId: TEST_AI_INTAKE_CLIENT_ID });
    expect(preview.ok).toBe(true);
    if (!preview.ok) return;

    const first = await submitAiIntake({
      request: {
        ...request,
        confirmationToken: preview.response.confirmationToken,
        privacyConsent: true,
      },
      clientId: TEST_AI_INTAKE_CLIENT_ID,
    });
    expect(first.ok).toBe(true);
    if (!first.ok) return;
    expect(first.statusCode).toBe(201);
    expect(sendMail).toHaveBeenCalledTimes(1);
    expect(sendMail).toHaveBeenCalledWith(expect.objectContaining({
      subject: preview.response.subject,
      text: preview.response.body,
      to: 'lawyer@example.test',
      from: '"호정 AI Intake" <smtp-account@example.test>',
    }));
    expect(logMock).toHaveBeenCalled();

    const replay = await submitAiIntake({
      request: {
        ...request,
        confirmationToken: preview.response.confirmationToken,
        privacyConsent: true,
      },
      clientId: TEST_AI_INTAKE_CLIENT_ID,
    });
    expect(replay.ok).toBe(true);
    if (!replay.ok) return;
    expect(replay.statusCode).toBe(200);
    expect(replay.response.duplicate).toBe(true);
    expect(replay.response.intakeId).toBe(first.response.intakeId);
    expect(sendMail).toHaveBeenCalledTimes(1);
  });

  it('returns CONSENT_REQUIRED before token or delivery work for non-literal true consent', async () => {
    const result = await submitAiIntake({
      request: {
        ...previewRequest(),
        confirmationToken: 'not-even-a-token',
        privacyConsent: 'true',
      },
      clientId: TEST_AI_INTAKE_CLIENT_ID,
    });
    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.code).toBe('CONSENT_REQUIRED');
    expect(sendMail).not.toHaveBeenCalled();
  });

  it('does not send without consent or when fields change after preview', async () => {
    const request = previewRequest();
    const preview = previewAiIntake({ request, clientId: TEST_AI_INTAKE_CLIENT_ID });
    expect(preview.ok).toBe(true);
    if (!preview.ok) return;

    const mutated = await submitAiIntake({
      request: {
        ...request,
        summary: 'This summary was changed after preview.',
        confirmationToken: preview.response.confirmationToken,
        privacyConsent: true,
      },
      clientId: TEST_AI_INTAKE_CLIENT_ID,
    });
    expect(mutated.ok).toBe(false);
    if (mutated.ok) return;
    expect(mutated.code).toBe('PREVIEW_MISMATCH');
    expect(sendMail).not.toHaveBeenCalled();

    const wrongKey = await submitAiIntake({
      request: {
        ...request,
        idempotencyKey: '00000000-bbbb-4ccc-8ddd-eeeeeeeeeeee',
        confirmationToken: preview.response.confirmationToken,
        privacyConsent: true,
      },
      clientId: TEST_AI_INTAKE_CLIENT_ID,
    });
    expect(wrongKey.ok).toBe(false);
    if (!wrongKey.ok) expect(wrongKey.code).toBe('TOKEN_INVALID');
    expect(sendMail).not.toHaveBeenCalled();
  });

  it('rejects a card or spaced IBAN in the phone field before SMTP', async () => {
    for (const phoneOrMessenger of ['4111111111111111', 'GB82 WEST 1234 5698 7654 32', 'bank account number 123456789012']) {
      const request = previewRequest({
        phoneOrMessenger,
        idempotencyKey: crypto.randomUUID(),
      });
      const preview = previewAiIntake({ request, clientId: TEST_AI_INTAKE_CLIENT_ID });
      expect(preview.ok).toBe(false);
      if (preview.ok) return;
      expect(preview.code).toBe('SENSITIVE_DATA_REJECTED');

      const canonical = buildCanonicalAiIntakeEmail(request, 'HC-AABBCC01');
      const minted = mintAiIntakeConfirmationToken({
        digest: canonical.digest,
        intakeId: canonical.intakeId,
        clientId: TEST_AI_INTAKE_CLIENT_ID,
        idempotencyKeyHash: hashAiIntakeIdempotencyKey(request.idempotencyKey),
      });
      const submitted = await submitAiIntake({
        request: {
          ...request,
          confirmationToken: minted.token,
          privacyConsent: true,
        },
        clientId: TEST_AI_INTAKE_CLIENT_ID,
      });
      expect(submitted.ok).toBe(false);
      if (!submitted.ok) expect(submitted.code).toBe('SENSITIVE_DATA_REJECTED');
      expect(sendMail).not.toHaveBeenCalled();
    }
  });

  it('concurrent submits send once; fresh sending is 202; failed_unknown replay is 502 and never resends', async () => {
    const request = previewRequest({
      idempotencyKey: 'ffffffff-bbbb-4ccc-8ddd-eeeeeeeeeeee',
    });
    const preview = previewAiIntake({ request, clientId: TEST_AI_INTAKE_CLIENT_ID });
    expect(preview.ok).toBe(true);
    if (!preview.ok) return;

    let release!: (value: { messageId: string }) => void;
    sendMail.mockImplementationOnce(() => new Promise((resolve) => {
      release = resolve;
    }));

    const submitBody = {
      request: {
        ...request,
        confirmationToken: preview.response.confirmationToken,
        privacyConsent: true as const,
      },
      clientId: TEST_AI_INTAKE_CLIENT_ID,
    };
    const firstPromise = submitAiIntake(submitBody);
    await vi.waitFor(() => expect(sendMail).toHaveBeenCalledTimes(1));
    const second = await submitAiIntake(submitBody);
    expect(second.ok).toBe(true);
    if (second.ok) {
      expect(second.statusCode).toBe(202);
      expect(second.response.status).toBe('sending');
      expect(second.response.duplicate).toBe(true);
    }
    release({ messageId: 'test-message-id' });
    const first = await firstPromise;
    expect(first.ok).toBe(true);
    if (first.ok) expect(first.statusCode).toBe(201);
    expect(sendMail).toHaveBeenCalledTimes(1);

    sendMail.mockRejectedValue(new Error('smtp timeout'));
    const ambiguousPreview = previewAiIntake({
      request: previewRequest({
        idempotencyKey: '12345678-bbbb-4ccc-8ddd-eeeeeeeeeeee',
      }),
      clientId: TEST_AI_INTAKE_CLIENT_ID,
    });
    expect(ambiguousPreview.ok).toBe(true);
    if (!ambiguousPreview.ok) return;
    const failed = await submitAiIntake({
      request: {
        ...previewRequest({
          idempotencyKey: '12345678-bbbb-4ccc-8ddd-eeeeeeeeeeee',
        }),
        confirmationToken: ambiguousPreview.response.confirmationToken,
        privacyConsent: true,
      },
      clientId: TEST_AI_INTAKE_CLIENT_ID,
    });
    expect(failed.ok).toBe(false);
    if (failed.ok) return;
    expect(failed.code).toBe('DELIVERY_UNKNOWN');
    const callsAfterFailure = sendMail.mock.calls.length;
    expect(callsAfterFailure).toBeGreaterThan(1);
    const replay = await submitAiIntake({
      request: {
        ...previewRequest({
          idempotencyKey: '12345678-bbbb-4ccc-8ddd-eeeeeeeeeeee',
        }),
        confirmationToken: ambiguousPreview.response.confirmationToken,
        privacyConsent: true,
      },
      clientId: TEST_AI_INTAKE_CLIENT_ID,
    });
    expect(replay.ok).toBe(false);
    if (replay.ok) return;
    expect(replay.code).toBe('DELIVERY_UNKNOWN');
    expect(replay.duplicate).toBe(true);
    expect(sendMail).toHaveBeenCalledTimes(callsAfterFailure);
  });

  it('treats a stale sending duplicate as delivery-unknown without resending', async () => {
    let now = 2_000_000;
    setAiIntakeNowMsForTests(() => now);
    const request = previewRequest({
      idempotencyKey: '99999999-bbbb-4ccc-8ddd-eeeeeeeeeeee',
    });
    const preview = previewAiIntake({ request, clientId: TEST_AI_INTAKE_CLIENT_ID });
    expect(preview.ok).toBe(true);
    if (!preview.ok) return;

    let release!: (value: { messageId: string }) => void;
    sendMail.mockImplementationOnce(() => new Promise((resolve) => {
      release = resolve;
    }));
    const body = {
      request: {
        ...request,
        confirmationToken: preview.response.confirmationToken,
        privacyConsent: true as const,
      },
      clientId: TEST_AI_INTAKE_CLIENT_ID,
    };
    const firstPromise = submitAiIntake(body);
    await vi.waitFor(() => expect(sendMail).toHaveBeenCalledTimes(1));
    now += AI_INTAKE_SENDING_LEASE_MS + 1;
    const stale = await submitAiIntake(body);
    expect(stale.ok).toBe(false);
    if (!stale.ok) {
      expect(stale.code).toBe('DELIVERY_UNKNOWN');
      expect(stale.duplicate).toBe(true);
    }
    expect(sendMail).toHaveBeenCalledTimes(1);
    release({ messageId: 'late' });
    await firstPromise;
  });

  it('maps claim throw before send to 503 and sends nothing', async () => {
    setAiIntakeClaimStoreForTests(injectedStore({
      async claim() {
        throw new Error('secret boom stack');
      },
      async update() {
        return 'updated';
      },
    }));
    const request = previewRequest();
    const preview = previewAiIntake({ request, clientId: TEST_AI_INTAKE_CLIENT_ID });
    expect(preview.ok).toBe(true);
    if (!preview.ok) return;
    const result = await submitAiIntake({
      request: {
        ...request,
        confirmationToken: preview.response.confirmationToken,
        privacyConsent: true,
      },
      clientId: TEST_AI_INTAKE_CLIENT_ID,
    });
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.statusCode).toBe(503);
      expect(result.code).toBe('BACKEND_UNAVAILABLE');
      expect(JSON.stringify(result)).not.toContain('secret boom');
    }
    expect(sendMail).not.toHaveBeenCalled();
  });

  it('maps SMTP failure and post-send update outcomes without leaking errors', async () => {
    const request = previewRequest({
      idempotencyKey: 'aaaaaaaa-cccc-4ccc-8ddd-eeeeeeeeeeee',
    });
    const preview = previewAiIntake({ request, clientId: TEST_AI_INTAKE_CLIENT_ID });
    expect(preview.ok).toBe(true);
    if (!preview.ok) return;

    const outcomes: Array<'missing' | 'conflict' | 'unavailable'> = ['missing', 'conflict', 'unavailable'];
    for (const outcome of outcomes) {
      sendMail.mockReset();
      sendMail.mockRejectedValueOnce(new Error('smtp exploded TRACE'));
      setAiIntakeClaimStoreForTests(injectedStore({
        async claim() {
          return {
            type: 'acquired',
            record: claimRecord({
              intakeId: preview.response.intakeId,
              digest: preview.response.digest,
              status: 'sending',
            }),
          };
        },
        async update() {
          return outcome;
        },
      }));
      const failed = await submitAiIntake({
        request: {
          ...request,
          confirmationToken: preview.response.confirmationToken,
          privacyConsent: true,
        },
        clientId: TEST_AI_INTAKE_CLIENT_ID,
      });
      expect(failed.ok).toBe(false);
      if (!failed.ok) {
        expect(failed.code).toBe('DELIVERY_UNKNOWN');
        expect(JSON.stringify(failed)).not.toContain('smtp exploded');
      }
    }

    sendMail.mockReset();
    sendMail.mockResolvedValue({ messageId: 'ok' });
    for (const outcome of [...outcomes, 'throw'] as const) {
      setAiIntakeClaimStoreForTests(injectedStore({
        async claim() {
          return {
            type: 'acquired',
            record: claimRecord({
              intakeId: preview.response.intakeId,
              digest: preview.response.digest,
              status: 'sending',
            }),
          };
        },
        async update() {
          if (outcome === 'throw') throw new Error('update TRACE');
          return outcome;
        },
      }));
      const result = await submitAiIntake({
        request: {
          ...request,
          confirmationToken: preview.response.confirmationToken,
          privacyConsent: true,
        },
        clientId: TEST_AI_INTAKE_CLIENT_ID,
      });
      expect(result.ok).toBe(false);
      if (!result.ok) {
        expect(result.code).toBe('DELIVERY_UNKNOWN');
        expect(JSON.stringify(result)).not.toContain('update TRACE');
      }
    }
  });

  it('contains a delayed failing audit sink and still returns the delivery result', async () => {
    let resolveLog!: () => void;
    logMock.mockImplementationOnce(() => new Promise((resolve, reject) => {
      resolveLog = () => reject(new Error('audit sink down'));
    }));
    const request = previewRequest({
      idempotencyKey: 'aaaaaaaa-dddd-4ccc-8ddd-eeeeeeeeeeee',
    });
    const preview = previewAiIntake({ request, clientId: TEST_AI_INTAKE_CLIENT_ID });
    expect(preview.ok).toBe(true);
    if (!preview.ok) return;
    const pending = submitAiIntake({
      request: {
        ...request,
        confirmationToken: preview.response.confirmationToken,
        privacyConsent: true,
      },
      clientId: TEST_AI_INTAKE_CLIENT_ID,
    });
    await vi.waitFor(() => expect(sendMail).toHaveBeenCalledTimes(1));
    resolveLog();
    const result = await pending;
    expect(result.ok).toBe(true);
    if (result.ok) expect(result.statusCode).toBe(201);
    expect(sendMail).toHaveBeenCalledTimes(1);
    const [record] = parsedAuditLines();
    expect(record).toBeDefined();
    expectTrustedAuditCategory(record!, 'company_setup');
  });

  it('returns 201 after the audit bound when the log sink never resolves, without unhandled rejection', async () => {
    vi.useFakeTimers({ toFake: ['setTimeout', 'clearTimeout'] });
    const rejections: unknown[] = [];
    const onUnhandled = (reason: unknown) => {
      rejections.push(reason);
    };
    process.on('unhandledRejection', onUnhandled);
    logMock.mockImplementation(() => new Promise(() => {}));
    const request = previewRequest({
      idempotencyKey: 'aaaaaaaa-aa01-4ccc-8ddd-eeeeeeeeeeee',
    });
    const preview = previewAiIntake({ request, clientId: TEST_AI_INTAKE_CLIENT_ID });
    expect(preview.ok).toBe(true);
    if (!preview.ok) return;
    try {
      const pending = submitAiIntake({
        request: {
          ...request,
          confirmationToken: preview.response.confirmationToken,
          privacyConsent: true,
        },
        clientId: TEST_AI_INTAKE_CLIENT_ID,
      });
      await vi.advanceTimersByTimeAsync(AI_INTAKE_AUDIT_TIMEOUT_MS);
      const result = await pending;
      expect(result.ok).toBe(true);
      if (result.ok) expect(result.statusCode).toBe(201);
      expect(sendMail).toHaveBeenCalledTimes(1);
      await Promise.resolve();
      expect(rejections).toEqual([]);
    } finally {
      process.off('unhandledRejection', onUnhandled);
      vi.useRealTimers();
    }
  });

  it('contains a late audit rejection after the bound without changing the 201', async () => {
    vi.useFakeTimers({ toFake: ['setTimeout', 'clearTimeout'] });
    let rejectLog!: (error: Error) => void;
    logMock.mockImplementation(() => new Promise((_resolve, reject) => {
      rejectLog = reject;
    }));
    const request = previewRequest({
      idempotencyKey: 'aaaaaaaa-aa02-4ccc-8ddd-eeeeeeeeeeee',
    });
    const preview = previewAiIntake({ request, clientId: TEST_AI_INTAKE_CLIENT_ID });
    expect(preview.ok).toBe(true);
    if (!preview.ok) return;
    try {
      const pending = submitAiIntake({
        request: {
          ...request,
          confirmationToken: preview.response.confirmationToken,
          privacyConsent: true,
        },
        clientId: TEST_AI_INTAKE_CLIENT_ID,
      });
      await vi.advanceTimersByTimeAsync(AI_INTAKE_AUDIT_TIMEOUT_MS);
      const result = await pending;
      expect(result.ok).toBe(true);
      if (result.ok) expect(result.statusCode).toBe(201);
      rejectLog(new Error('late audit TRACE'));
      await Promise.resolve();
      expect(sendMail).toHaveBeenCalledTimes(1);
    } finally {
      vi.useRealTimers();
    }
  });

  it('retries a lost sent CAS once after SMTP success and never sends a second mail', async () => {
    const request = previewRequest({
      idempotencyKey: 'aaaaaaaa-aa03-4ccc-8ddd-eeeeeeeeeeee',
    });
    const preview = previewAiIntake({ request, clientId: TEST_AI_INTAKE_CLIENT_ID });
    expect(preview.ok).toBe(true);
    if (!preview.ok) return;
    const submitBody = {
      request: {
        ...request,
        confirmationToken: preview.response.confirmationToken,
        privacyConsent: true as const,
      },
      clientId: TEST_AI_INTAKE_CLIENT_ID,
    };

    const run = async (
      sequence: Array<'updated' | 'missing' | 'conflict' | 'unavailable' | 'throw'>,
      expected: { ok: boolean; statusCode?: number; code?: string; updateCalls: number },
    ) => {
      sendMail.mockClear();
      sendMail.mockResolvedValue({ messageId: 'ok' });
      let calls = 0;
      setAiIntakeClaimStoreForTests(injectedStore({
        async claim() {
          return {
            type: 'acquired',
            record: claimRecord({
              intakeId: preview.response.intakeId,
              digest: preview.response.digest,
              status: 'sending',
            }),
          };
        },
        async update() {
          const next = sequence[calls] ?? 'unavailable';
          calls += 1;
          if (next === 'throw') throw new Error('update TRACE');
          return next;
        },
      }));
      const result = await submitAiIntake(submitBody);
      expect(sendMail).toHaveBeenCalledTimes(1);
      expect(calls).toBe(expected.updateCalls);
      if (expected.ok) {
        expect(result.ok).toBe(true);
        if (result.ok) expect(result.statusCode).toBe(expected.statusCode);
      } else {
        expect(result.ok).toBe(false);
        if (!result.ok) expect(result.code).toBe(expected.code);
      }
    };

    await run(['updated'], { ok: true, statusCode: 201, updateCalls: 1 });
    await run(['unavailable', 'updated'], { ok: true, statusCode: 201, updateCalls: 2 });
    await run(['throw', 'updated'], { ok: true, statusCode: 201, updateCalls: 2 });
    await run(['unavailable', 'unavailable'], { ok: false, code: 'DELIVERY_UNKNOWN', updateCalls: 3 });
    await run(['throw', 'throw'], { ok: false, code: 'DELIVERY_UNKNOWN', updateCalls: 3 });
    await run(['conflict'], { ok: false, code: 'DELIVERY_UNKNOWN', updateCalls: 1 });
    await run(['missing'], { ok: false, code: 'DELIVERY_UNKNOWN', updateCalls: 1 });
  });

  it('does not claim or send when mail config fails before I/O', async () => {
    const request = previewRequest({
      idempotencyKey: 'aaaaaaaa-aa04-4ccc-8ddd-eeeeeeeeeeee',
    });
    const preview = previewAiIntake({ request, clientId: TEST_AI_INTAKE_CLIENT_ID });
    expect(preview.ok).toBe(true);
    if (!preview.ok) return;
    const claim = vi.fn();
    const update = vi.fn();
    setAiIntakeClaimStoreForTests(injectedStore({
      claim,
      update,
    }));
    vi.stubEnv('SMTP_PASS', '');
    const result = await submitAiIntake({
      request: {
        ...request,
        confirmationToken: preview.response.confirmationToken,
        privacyConsent: true,
      },
      clientId: TEST_AI_INTAKE_CLIENT_ID,
    });
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.statusCode).toBe(503);
      expect(result.code).toBe('BACKEND_UNAVAILABLE');
      expect(result.deliveryStatus).toBeUndefined();
    }
    expect(claim).not.toHaveBeenCalled();
    expect(update).not.toHaveBeenCalled();
    expect(createTransport).not.toHaveBeenCalled();
    expect(sendMail).not.toHaveBeenCalled();
  });

  it('resolves durable duplicates and conflicts before SMTP preparation', async () => {
    const request = previewRequest({
      idempotencyKey: 'aaaaaaaa-aa20-4ccc-8ddd-eeeeeeeeeeee',
    });
    const preview = previewAiIntake({ request, clientId: TEST_AI_INTAKE_CLIENT_ID });
    expect(preview.ok).toBe(true);
    if (!preview.ok) return;
    const submitBody = {
      request: {
        ...request,
        confirmationToken: preview.response.confirmationToken,
        privacyConsent: true as const,
      },
      clientId: TEST_AI_INTAKE_CLIENT_ID,
    };
    const now = Date.now();
    setAiIntakeNowMsForTests(() => now);
    const update = vi.fn(async () => 'updated' as const);
    const claim = vi.fn();
    const cases: Array<{
      status: AiIntakeClaimRecord['status'];
      digest?: string;
      updatedAt?: string;
      ok: boolean;
      statusCode?: number;
      code?: string;
      updates?: number;
    }> = [
      { status: 'sent', ok: true, statusCode: 200 },
      { status: 'sending', ok: true, statusCode: 202 },
      {
        status: 'sending',
        updatedAt: new Date(now - AI_INTAKE_SENDING_LEASE_MS - 1).toISOString(),
        ok: false,
        code: 'DELIVERY_UNKNOWN',
        updates: 1,
      },
      { status: 'failed_unknown', ok: false, code: 'DELIVERY_UNKNOWN' },
      { status: 'sent', digest: 'b'.repeat(64), ok: false, code: 'IDEMPOTENCY_CONFLICT' },
    ];

    for (const testCase of cases) {
      createTransport.mockClear();
      sendMail.mockClear();
      update.mockClear();
      claim.mockClear();
      setAiIntakeClaimStoreForTests(injectedStore({
        async lookup() {
          return {
            type: 'found',
            record: claimRecord({
              intakeId: preview.response.intakeId,
              digest: testCase.digest ?? preview.response.digest,
              status: testCase.status,
              updatedAt: testCase.updatedAt,
              createdAt: new Date(now).toISOString(),
            }),
          };
        },
        claim,
        update,
      }));
      vi.stubEnv('SMTP_PASS', '');
      const result = await submitAiIntake(submitBody);
      if (testCase.ok) {
        expect(result.ok, JSON.stringify(result)).toBe(true);
        if (result.ok) {
          expect(result.statusCode).toBe(testCase.statusCode);
          expect(result.response.duplicate).toBe(true);
        }
      } else {
        expect(result.ok).toBe(false);
        if (!result.ok) expect(result.code).toBe(testCase.code);
      }
      expect(createTransport).not.toHaveBeenCalled();
      expect(sendMail).not.toHaveBeenCalled();
      expect(claim).not.toHaveBeenCalled();
      expect(update).toHaveBeenCalledTimes(testCase.updates ?? 0);
    }
  });

  it('does not record a claim when SMTP is broken for a missing key, then sends after restore', async () => {
    const request = previewRequest({
      idempotencyKey: 'aaaaaaaa-aa21-4ccc-8ddd-eeeeeeeeeeee',
    });
    const preview = previewAiIntake({ request, clientId: TEST_AI_INTAKE_CLIENT_ID });
    expect(preview.ok).toBe(true);
    if (!preview.ok) return;
    const submitBody = {
      request: {
        ...request,
        confirmationToken: preview.response.confirmationToken,
        privacyConsent: true as const,
      },
      clientId: TEST_AI_INTAKE_CLIENT_ID,
    };

    vi.stubEnv('SMTP_PASS', '');
    const failed = await submitAiIntake(submitBody);
    expect(failed.ok).toBe(false);
    if (!failed.ok) {
      expect(failed.statusCode).toBe(503);
      expect(failed.code).toBe('BACKEND_UNAVAILABLE');
    }
    expect(aiIntakeMemoryClaimCountForTests()).toBe(0);
    expect(createTransport).not.toHaveBeenCalled();
    expect(sendMail).not.toHaveBeenCalled();

    vi.stubEnv('SMTP_PASS', 'test-only-password');
    const sent = await submitAiIntake(submitBody);
    expect(sent.ok).toBe(true);
    if (sent.ok) expect(sent.statusCode).toBe(201);
    expect(sendMail).toHaveBeenCalledTimes(1);
    expect(aiIntakeMemoryClaimCountForTests()).toBe(1);
  });

  it('maps lookup unavailable and throw to 503 without preparing mail or claiming', async () => {
    const request = previewRequest({
      idempotencyKey: 'aaaaaaaa-aa22-4ccc-8ddd-eeeeeeeeeeee',
    });
    const preview = previewAiIntake({ request, clientId: TEST_AI_INTAKE_CLIENT_ID });
    expect(preview.ok).toBe(true);
    if (!preview.ok) return;
    const submitBody = {
      request: {
        ...request,
        confirmationToken: preview.response.confirmationToken,
        privacyConsent: true as const,
      },
      clientId: TEST_AI_INTAKE_CLIENT_ID,
    };

    for (const lookup of [
      async () => ({ type: 'unavailable' as const }),
      async () => {
        throw new Error('redis TRACE upstash-test-token');
      },
    ]) {
      const claim = vi.fn();
      const update = vi.fn();
      createTransport.mockClear();
      sendMail.mockClear();
      setAiIntakeClaimStoreForTests(injectedStore({ lookup, claim, update }));
      const lines: string[] = [];
      const errorSpy = vi.spyOn(console, 'error').mockImplementation((...args) => {
        lines.push(args.map(String).join(' '));
      });
      const result = await submitAiIntake(submitBody);
      errorSpy.mockRestore();
      expect(result.ok).toBe(false);
      if (!result.ok) {
        expect(result.statusCode).toBe(503);
        expect(result.code).toBe('BACKEND_UNAVAILABLE');
        expect(JSON.stringify(result)).not.toContain('TRACE');
        expect(JSON.stringify(result)).not.toContain('upstash-test-token');
      }
      expect(claim).not.toHaveBeenCalled();
      expect(update).not.toHaveBeenCalled();
      expect(createTransport).not.toHaveBeenCalled();
      expect(sendMail).not.toHaveBeenCalled();
      expect(lines.join('\n')).not.toContain('upstash-test-token');
    }
  });

  it('leaves a prepared send unused when lookup is absent and claim returns a duplicate', async () => {
    const request = previewRequest({
      idempotencyKey: 'aaaaaaaa-aa23-4ccc-8ddd-eeeeeeeeeeee',
    });
    const preview = previewAiIntake({ request, clientId: TEST_AI_INTAKE_CLIENT_ID });
    expect(preview.ok).toBe(true);
    if (!preview.ok) return;
    const claim = vi.fn(async () => ({
      type: 'duplicate' as const,
      record: claimRecord({
        intakeId: preview.response.intakeId,
        digest: preview.response.digest,
        status: 'sent' as const,
      }),
    }));
    setAiIntakeClaimStoreForTests(injectedStore({
      claim,
      async update() {
        return 'updated';
      },
    }));
    const result = await submitAiIntake({
      request: {
        ...request,
        confirmationToken: preview.response.confirmationToken,
        privacyConsent: true,
      },
      clientId: TEST_AI_INTAKE_CLIENT_ID,
    });
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.statusCode).toBe(200);
      expect(result.response.duplicate).toBe(true);
    }
    expect(createTransport).toHaveBeenCalledTimes(1);
    expect(claim).toHaveBeenCalledTimes(1);
    expect(sendMail).not.toHaveBeenCalled();
  });

  it('never looks up, prepares, claims, or sends for invalid consent, token, client, key, sensitive data, or digest', async () => {
    const lookup = vi.fn(async () => ({ type: 'absent' as const }));
    const claim = vi.fn();
    const update = vi.fn();
    const hostileCategory = 'company_setup<script>alert(1)</script>';
    setAiIntakeClaimStoreForTests(injectedStore({ lookup, claim, update }));

    const consent = await submitAiIntake({
      request: {
        ...previewRequest({ category: 'company_setup' }),
        category: hostileCategory as never,
        confirmationToken: 'not-even-a-token',
        privacyConsent: 'true',
      },
      clientId: TEST_AI_INTAKE_CLIENT_ID,
    });
    expect(consent.ok).toBe(false);
    if (!consent.ok) expect(consent.code).toBe('CONSENT_REQUIRED');

    const token = await submitAiIntake({
      request: {
        ...previewRequest({ category: 'company_setup' }),
        confirmationToken: 'a'.repeat(40),
        privacyConsent: true,
      },
      clientId: TEST_AI_INTAKE_CLIENT_ID,
    });
    expect(token.ok).toBe(false);
    if (!token.ok) expect(token.code).toBe('TOKEN_INVALID');

    const request = previewRequest({
      category: 'company_setup',
      idempotencyKey: 'aaaaaaaa-aa24-4ccc-8ddd-eeeeeeeeeeee',
    });
    const preview = previewAiIntake({ request, clientId: TEST_AI_INTAKE_CLIENT_ID });
    expect(preview.ok).toBe(true);
    if (!preview.ok) return;

    const wrongClient = await submitAiIntake({
      request: {
        ...request,
        category: 'company_setup',
        confirmationToken: preview.response.confirmationToken,
        privacyConsent: true,
      },
      clientId: 'other-client',
    });
    expect(wrongClient.ok).toBe(false);
    if (!wrongClient.ok) expect(wrongClient.code).toBe('TOKEN_INVALID');

    const wrongKey = await submitAiIntake({
      request: {
        ...request,
        category: 'company_setup',
        idempotencyKey: '00000000-bbbb-4ccc-8ddd-eeeeeeeeeeee',
        confirmationToken: preview.response.confirmationToken,
        privacyConsent: true,
      },
      clientId: TEST_AI_INTAKE_CLIENT_ID,
    });
    expect(wrongKey.ok).toBe(false);
    if (!wrongKey.ok) expect(wrongKey.code).toBe('TOKEN_INVALID');

    const mutated = await submitAiIntake({
      request: {
        ...request,
        category: 'company_setup',
        summary: 'Changed after preview',
        confirmationToken: preview.response.confirmationToken,
        privacyConsent: true,
      },
      clientId: TEST_AI_INTAKE_CLIENT_ID,
    });
    expect(mutated.ok).toBe(false);
    if (!mutated.ok) expect(mutated.code).toBe('PREVIEW_MISMATCH');

    const sensitiveRequest = previewRequest({
      category: 'company_setup',
      phoneOrMessenger: '4111111111111111',
      idempotencyKey: 'aaaaaaaa-aa25-4ccc-8ddd-eeeeeeeeeeee',
    });
    const canonical = buildCanonicalAiIntakeEmail(sensitiveRequest, 'HC-AABBCC01');
    const minted = mintAiIntakeConfirmationToken({
      digest: canonical.digest,
      intakeId: canonical.intakeId,
      clientId: TEST_AI_INTAKE_CLIENT_ID,
      idempotencyKeyHash: hashAiIntakeIdempotencyKey(sensitiveRequest.idempotencyKey),
    });
    const sensitive = await submitAiIntake({
      request: {
        ...sensitiveRequest,
        category: 'company_setup',
        confirmationToken: minted.token,
        privacyConsent: true,
      },
      clientId: TEST_AI_INTAKE_CLIENT_ID,
    });
    expect(sensitive.ok).toBe(false);
    if (!sensitive.ok) expect(sensitive.code).toBe('SENSITIVE_DATA_REJECTED');

    expect(lookup).not.toHaveBeenCalled();
    expect(claim).not.toHaveBeenCalled();
    expect(update).not.toHaveBeenCalled();
    expect(createTransport).not.toHaveBeenCalled();
    expect(sendMail).not.toHaveBeenCalled();

    const lines = parsedAuditLines();
    expect(lines.length).toBeGreaterThan(0);
    for (const line of lines) {
      expectAuditOmitsCategory(line, hostileCategory);
    }
  });

  it('records allowlisted category on fresh sent and duplicate replay after digest match', async () => {
    const request = previewRequest({ category: 'company_setup' });
    const preview = previewAiIntake({ request, clientId: TEST_AI_INTAKE_CLIENT_ID });
    expect(preview.ok).toBe(true);
    if (!preview.ok) return;

    const submitBody = {
      request: {
        ...request,
        category: 'company_setup' as const,
        confirmationToken: preview.response.confirmationToken,
        privacyConsent: true as const,
      },
      clientId: TEST_AI_INTAKE_CLIENT_ID,
    };
    const first = await submitAiIntake(submitBody);
    expect(first.ok).toBe(true);
    if (!first.ok) return;
    expect(first.statusCode).toBe(201);
    expect(sendMail).toHaveBeenCalledTimes(1);

    const replay = await submitAiIntake(submitBody);
    expect(replay.ok).toBe(true);
    if (!replay.ok) return;
    expect(replay.response.duplicate).toBe(true);
    expect(sendMail).toHaveBeenCalledTimes(1);

    const lines = parsedAuditLines();
    expect(lines).toHaveLength(2);
    expectTrustedAuditCategory(lines[0]!, 'company_setup');
    expectTrustedAuditCategory(lines[1]!, 'company_setup');
    expect(lines[0]!.funnelStage).toBe('ai_intake_submit_sent');
    expect(lines[1]!.funnelStage).toBe('ai_intake_submit_duplicate');
  });

  it('records general after digest match when the preview omitted category', async () => {
    const request = previewRequest({ category: undefined });
    expect(request.category).toBeUndefined();
    const preview = previewAiIntake({ request, clientId: TEST_AI_INTAKE_CLIENT_ID });
    expect(preview.ok).toBe(true);
    if (!preview.ok) return;

    const result = await submitAiIntake({
      request: {
        ...request,
        confirmationToken: preview.response.confirmationToken,
        privacyConsent: true,
      },
      clientId: TEST_AI_INTAKE_CLIENT_ID,
    });
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.statusCode).toBe(201);

    const [record] = parsedAuditLines();
    expect(record).toBeDefined();
    expectTrustedAuditCategory(record!, 'general');
  });

  it('rejects a labor submit against a company_setup preview without sending or recording category', async () => {
    const request = previewRequest({ category: 'company_setup' });
    const preview = previewAiIntake({ request, clientId: TEST_AI_INTAKE_CLIENT_ID });
    expect(preview.ok).toBe(true);
    if (!preview.ok) return;

    const result = await submitAiIntake({
      request: {
        ...request,
        category: 'labor',
        confirmationToken: preview.response.confirmationToken,
        privacyConsent: true,
      },
      clientId: TEST_AI_INTAKE_CLIENT_ID,
    });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.code).toBe('PREVIEW_MISMATCH');
    expect(sendMail).not.toHaveBeenCalled();

    const lines = parsedAuditLines();
    expect(lines.length).toBeGreaterThan(0);
    for (const line of lines) {
      expectAuditOmitsCategory(line);
    }
  });
});

describe('submitAiIntake Upstash duplicate replay', () => {
  beforeEach(() => {
    stubAiIntakeTestEnv();
    sendMail.mockReset();
    sendMail.mockResolvedValue({ messageId: 'test-message-id' });
    createTransport.mockClear();
    logMock.mockReset();
    logMock.mockResolvedValue(undefined);
    vi.stubEnv('UPSTASH_REDIS_REST_URL', 'https://redis.example.test');
    vi.stubEnv('UPSTASH_REDIS_REST_TOKEN', 'upstash-test-token');
    resetAiIntakeClaimStoreForTests();
  });

  afterEach(() => {
    vi.unstubAllEnvs();
    vi.unstubAllGlobals();
    resetAiIntakeClaimStoreForTests();
  });

  function fetchCommand(init?: RequestInit): unknown[] {
    return JSON.parse(String(init?.body ?? '[]')) as unknown[];
  }

  function claimJson(status: 'sending' | 'sent' | 'failed_unknown', intakeId: string, digest: string) {
    const now = new Date().toISOString();
    return JSON.stringify({
      v: 1,
      intakeId,
      digest,
      status,
      createdAt: now,
      updatedAt: now,
    });
  }

  async function previewed() {
    const request = previewRequest({
      idempotencyKey: 'aaaaaaaa-aa10-4ccc-8ddd-eeeeeeeeeeee',
    });
    const preview = previewAiIntake({ request, clientId: TEST_AI_INTAKE_CLIENT_ID });
    expect(preview.ok).toBe(true);
    if (!preview.ok) throw new Error('preview failed');
    return { request, preview };
  }

  async function submitWith(previewedRequest: Awaited<ReturnType<typeof previewed>>) {
    return submitAiIntake({
      request: {
        ...previewedRequest.request,
        confirmationToken: previewedRequest.preview.response.confirmationToken,
        privacyConsent: true,
      },
      clientId: TEST_AI_INTAKE_CLIENT_ID,
    });
  }

  it('replays Upstash duplicate sent/failed/sending and digest conflict without sending', async () => {
    const lines: string[] = [];
    const errorSpy = vi.spyOn(console, 'error').mockImplementation((...args) => {
      lines.push(args.map(String).join(' '));
    });
    const logSpy = vi.spyOn(console, 'log').mockImplementation((...args) => {
      lines.push(args.map(String).join(' '));
    });

    const cases: Array<{
      status: 'sent' | 'failed_unknown' | 'sending';
      digest?: 'same' | 'other';
      ok: boolean;
      statusCode?: number;
      code?: string;
    }> = [
      { status: 'sent', ok: true, statusCode: 200 },
      { status: 'failed_unknown', ok: false, code: 'DELIVERY_UNKNOWN' },
      { status: 'sending', ok: true, statusCode: 202 },
      { status: 'sent', digest: 'other', ok: false, code: 'IDEMPOTENCY_CONFLICT' },
    ];

    try {
      for (const testCase of cases) {
        sendMail.mockClear();
        const previewedRequest = await previewed();
        const digest = testCase.digest === 'other'
          ? 'b'.repeat(64)
          : previewedRequest.preview.response.digest;
        const fetchMock = vi.fn(async (_url: string, init?: RequestInit) => {
          const cmd = fetchCommand(init);
          if (cmd[0] === 'SET') return new Response(JSON.stringify({ result: null }), { status: 200 });
          if (cmd[0] === 'GET') {
            return new Response(JSON.stringify({
              result: claimJson(testCase.status, previewedRequest.preview.response.intakeId, digest),
            }), { status: 200 });
          }
          return new Response(JSON.stringify({ result: null }), { status: 200 });
        });
        vi.stubGlobal('fetch', fetchMock);
        createTransport.mockClear();
        const result = await submitWith(previewedRequest);
        expect(sendMail).not.toHaveBeenCalled();
        expect(createTransport).not.toHaveBeenCalled();
        expect(fetchMock.mock.calls.some((call) => String(call[1]?.body).includes('"SET"'))).toBe(false);
        if (testCase.ok) {
          expect(result.ok).toBe(true);
          if (result.ok) {
            expect(result.statusCode).toBe(testCase.statusCode);
            expect(result.response.duplicate).toBe(true);
          }
        } else {
          expect(result.ok).toBe(false);
          if (!result.ok) {
            expect(result.code).toBe(testCase.code);
            if (testCase.code === 'DELIVERY_UNKNOWN') expect(result.duplicate).toBe(true);
          }
        }
      }
      expect(lines.join('\n')).not.toContain('upstash-test-token');
      expect(lines.join('\n')).not.toContain('"result"');
    } finally {
      errorSpy.mockRestore();
      logSpy.mockRestore();
    }
  });
});

describe('submitAiIntake Blob expiry', () => {
  beforeEach(() => {
    stubAiIntakeTestEnv();
    sendMail.mockReset();
    sendMail.mockResolvedValue({ messageId: 'test-message-id' });
    createTransport.mockClear();
    logMock.mockReset();
    logMock.mockResolvedValue(undefined);
    vi.stubEnv('UPSTASH_REDIS_REST_URL', '');
    vi.stubEnv('UPSTASH_REDIS_REST_TOKEN', '');
    vi.stubEnv('BLOB_READ_WRITE_TOKEN', 'blob-test-token');
    putMock.mockReset();
    getMock.mockReset();
    delMock.mockReset();
    resetAiIntakeClaimStoreForTests();
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.unstubAllEnvs();
    resetAiIntakeClaimStoreForTests();
  });

  it('replays a live Blob sent claim without SMTP preparation, and sends once after expiry', async () => {
    const now = 5_000_000;
    setAiIntakeNowMsForTests(() => now);
    const request = previewRequest({
      idempotencyKey: 'aaaaaaaa-aa30-4ccc-8ddd-eeeeeeeeeeee',
    });
    const preview = previewAiIntake({ request, clientId: TEST_AI_INTAKE_CLIENT_ID });
    expect(preview.ok).toBe(true);
    if (!preview.ok) return;
    const submitBody = {
      request: {
        ...request,
        confirmationToken: preview.response.confirmationToken,
        privacyConsent: true as const,
      },
      clientId: TEST_AI_INTAKE_CLIENT_ID,
    };

    const liveIso = new Date(now).toISOString();
    getMock.mockImplementation(async () => blobGetResult({
      v: 1,
      intakeId: preview.response.intakeId,
      digest: preview.response.digest,
      status: 'sent',
      createdAt: liveIso,
      updatedAt: liveIso,
    }, 'etag-live'));
    const live = await submitAiIntake(submitBody);
    expect(live.ok).toBe(true);
    if (live.ok) {
      expect(live.statusCode).toBe(200);
      expect(live.response.duplicate).toBe(true);
    }
    expect(createTransport).not.toHaveBeenCalled();
    expect(sendMail).not.toHaveBeenCalled();
    expect(putMock).not.toHaveBeenCalled();

    const expiredIso = new Date(now - AI_INTAKE_CLAIM_TTL_MS - 1).toISOString();
    let replaced = false;
    getMock.mockReset();
    getMock.mockImplementation(async () => blobGetResult({
      v: 1,
      intakeId: preview.response.intakeId,
      digest: preview.response.digest,
      status: replaced ? 'sending' : 'sent',
      createdAt: replaced ? liveIso : expiredIso,
      updatedAt: replaced ? liveIso : expiredIso,
    }, replaced ? 'etag-new' : 'etag-old'));
    delMock.mockResolvedValue(undefined as never);
    putMock.mockImplementation(async (...args: unknown[]) => {
      const options = args[2] as { allowOverwrite?: boolean; ifMatch?: string } | undefined;
      if (!options || options.allowOverwrite !== true) {
        throw new BlobPreconditionFailedError();
      }
      replaced = true;
      return {
        url: 'https://blob.example/ai-intake/claims/x.json',
        downloadUrl: 'https://blob.example/ai-intake/claims/x.json',
        pathname: 'ai-intake/claims/x.json',
        contentType: 'application/json',
        contentDisposition: '',
        size: 2,
        uploadedAt: new Date(),
        etag: 'etag-new',
      } as never;
    });
    createTransport.mockClear();
    const acquired = await submitAiIntake(submitBody);
    expect(acquired.ok, JSON.stringify(acquired)).toBe(true);
    if (acquired.ok) expect(acquired.statusCode).toBe(201);
    expect(sendMail).toHaveBeenCalledTimes(1);
  });

  it('fails closed before SMTP preparation when Blob returns an unusable ETag', async () => {
    const now = 6_000_000;
    setAiIntakeNowMsForTests(() => now);
    const request = previewRequest({
      idempotencyKey: 'aaaaaaaa-aa31-4ccc-8ddd-eeeeeeeeeeee',
    });
    const preview = previewAiIntake({ request, clientId: TEST_AI_INTAKE_CLIENT_ID });
    expect(preview.ok).toBe(true);
    if (!preview.ok) return;
    const nowIso = new Date(now).toISOString();
    getMock.mockResolvedValueOnce(blobGetResult({
      v: 1,
      intakeId: preview.response.intakeId,
      digest: preview.response.digest,
      status: 'sent',
      createdAt: nowIso,
      updatedAt: nowIso,
    }, ''));

    const result = await submitAiIntake({
      request: {
        ...request,
        confirmationToken: preview.response.confirmationToken,
        privacyConsent: true,
      },
      clientId: TEST_AI_INTAKE_CLIENT_ID,
    });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.code).toBe('BACKEND_UNAVAILABLE');
    expect(createTransport).not.toHaveBeenCalled();
    expect(sendMail).not.toHaveBeenCalled();
    expect(putMock).not.toHaveBeenCalled();
    expect(delMock).not.toHaveBeenCalled();
  });

  it('times out stuck expired cleanup, then atomically claims before one SMTP send', async () => {
    vi.useFakeTimers();
    const now = 7_000_000;
    setAiIntakeNowMsForTests(() => now);
    const request = previewRequest({
      idempotencyKey: 'aaaaaaaa-aa32-4ccc-8ddd-eeeeeeeeeeee',
    });
    const preview = previewAiIntake({ request, clientId: TEST_AI_INTAKE_CLIENT_ID });
    expect(preview.ok).toBe(true);
    if (!preview.ok) return;
    const expiredIso = new Date(now - AI_INTAKE_CLAIM_TTL_MS - 1).toISOString();
    let current = {
      record: {
        v: 1,
        intakeId: preview.response.intakeId,
        digest: preview.response.digest,
        status: 'sent',
        createdAt: expiredIso,
        updatedAt: expiredIso,
      },
      etag: 'etag-old',
    };
    let etagSequence = 0;
    getMock.mockImplementation(async () => blobGetResult(current.record, current.etag));
    putMock.mockImplementation(async (...args: unknown[]) => {
      const body = args[1] as string;
      const options = args[2] as { allowOverwrite?: boolean; ifMatch?: string } | undefined;
      if (!options?.allowOverwrite) throw new BlobPreconditionFailedError();
      if (!options.ifMatch || options.ifMatch !== current.etag) {
        throw new BlobPreconditionFailedError();
      }
      etagSequence += 1;
      current = {
        record: JSON.parse(body) as typeof current.record,
        etag: `etag-new-${etagSequence}`,
      };
      return {} as never;
    });
    let cleanupSignal: AbortSignal | undefined;
    let markCleanupStarted!: () => void;
    const cleanupStarted = new Promise<void>((resolve) => {
      markCleanupStarted = resolve;
    });
    delMock.mockImplementation(async (_pathname, options) => {
      cleanupSignal = options?.abortSignal;
      markCleanupStarted();
      await new Promise<void>(() => undefined);
    });

    const pending = submitAiIntake({
      request: {
        ...request,
        confirmationToken: preview.response.confirmationToken,
        privacyConsent: true,
      },
      clientId: TEST_AI_INTAKE_CLIENT_ID,
    });
    await vi.advanceTimersByTimeAsync(0);
    await cleanupStarted;
    expect(cleanupSignal?.aborted).toBe(false);
    expect(createTransport).not.toHaveBeenCalled();
    expect(sendMail).not.toHaveBeenCalled();
    expect(putMock).not.toHaveBeenCalled();

    await vi.advanceTimersByTimeAsync(AI_INTAKE_BACKEND_TIMEOUT_MS + 1);
    const result = await pending;
    expect(result.ok, JSON.stringify(result)).toBe(true);
    if (result.ok) expect(result.statusCode).toBe(201);
    expect(cleanupSignal?.aborted).toBe(true);
    expect(createTransport).toHaveBeenCalledTimes(1);
    expect(sendMail).toHaveBeenCalledTimes(1);
    expect(putMock.mock.calls.some((call) => call[2]?.allowOverwrite === true
      && call[2]?.ifMatch === 'etag-old')).toBe(true);
  });
});

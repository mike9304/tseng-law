import { createHash, randomUUID } from 'node:crypto';
import { mkdtemp, readFile, readdir, rm } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { NextRequest } from 'next/server';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { checkRateLimit } from '@/lib/builder/security/rate-limit';
import { PUBLIC_INQUIRY_LOCALES } from '@/lib/consultation/intake-language-contract';
import {
  markInternationalInquiryNotified,
  type InternationalInquiryRecord,
} from '@/lib/consultation/international-inquiry-store';
import { sendInternationalInquiryNotification } from '@/lib/email/send-consultation-email';

const mocks = vi.hoisted(() => ({
  send: vi.fn(async () => undefined),
  checkRateLimit: vi.fn(async () => ({ allowed: true, remaining: 9, retryAfterMs: 0 })),
}));

vi.mock('@/lib/email/send-consultation-email', () => ({
  sendInternationalInquiryNotification: mocks.send,
}));

vi.mock('@/lib/builder/security/rate-limit', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@/lib/builder/security/rate-limit')>();
  return {
    ...actual,
    checkRateLimit: mocks.checkRateLimit,
  };
});

vi.mock('@/lib/consultation/international-inquiry-store', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@/lib/consultation/international-inquiry-store')>();
  return {
    ...actual,
    markInternationalInquiryNotified: vi.fn(actual.markInternationalInquiryNotified),
  };
});

const RAW_TEXT = '  Keep leading spaces.\nLine 2\n<script>alert(1)</script>\n';

let tempRoot = '';

function hashedRateKey(kind: 'ip' | 'request', value: string): string {
  return `consultation-international:${kind}:${createHash('sha256').update(value, 'utf8').digest('hex')}`;
}

function objectKey(requestId: string): string {
  return createHash('sha256').update(requestId.toLowerCase(), 'utf8').digest('hex');
}

function rawPath(requestId: string): string {
  return path.join(tempRoot, 'raw', `${objectKey(requestId)}.json`);
}

function notifyPath(requestId: string): string {
  return path.join(tempRoot, 'notify', `${objectKey(requestId)}.json`);
}

function validBody(overrides: Record<string, unknown> = {}) {
  return {
    requestId: randomUUID(),
    name: 'Ada Lovelace',
    email: 'ada@example.test',
    uiLocale: 'en',
    originalLanguage: 'English',
    preferredConsultationLanguage: 'en',
    originalText: 'Need help with a Taiwan company setup.',
    consent: true,
    ...overrides,
  };
}

function preferredFor(uiLocale: (typeof PUBLIC_INQUIRY_LOCALES)[number]) {
  if (uiLocale === 'en' || uiLocale === 'zh-hant' || uiLocale === 'ja' || uiLocale === 'ko') {
    return uiLocale;
  }
  return 'needs-method-confirmation' as const;
}

function makeRequest(
  body: unknown,
  options: {
    url?: string;
    origin?: string | null;
    contentType?: string | null;
    raw?: string;
    contentLength?: string;
    forwardedFor?: string;
  } = {},
): NextRequest {
  const raw = options.raw ?? JSON.stringify(body);
  const headers = new Headers({
    'x-forwarded-for': options.forwardedFor ?? '127.0.0.42',
  });
  if (options.contentType !== null) {
    headers.set('content-type', options.contentType ?? 'application/json; charset=utf-8');
  }
  if (options.origin) headers.set('origin', options.origin);
  if (options.contentLength !== undefined) headers.set('content-length', options.contentLength);
  return new NextRequest(options.url ?? 'http://localhost/api/consultation/international', {
    method: 'POST',
    headers,
    body: raw,
  });
}

describe('/api/consultation/international', () => {
  beforeEach(async () => {
    mocks.send.mockReset();
    mocks.send.mockResolvedValue(undefined);
    mocks.checkRateLimit.mockReset();
    mocks.checkRateLimit.mockResolvedValue({
      allowed: true,
      remaining: 9,
      retryAfterMs: 0,
    });
    vi.mocked(markInternationalInquiryNotified).mockClear();
    tempRoot = await mkdtemp(path.join(os.tmpdir(), 'tseng-intl-inquiry-'));
    vi.stubEnv('INTERNATIONAL_INQUIRY_DIR', tempRoot);
    delete process.env.VERCEL;
    delete process.env.VERCEL_URL;
    delete process.env.BLOB_READ_WRITE_TOKEN;
  });

  afterEach(async () => {
    vi.unstubAllEnvs();
    if (tempRoot) {
      await rm(tempRoot, { recursive: true, force: true });
      tempRoot = '';
    }
  });

  it('does not export a public GET or raw lookup', async () => {
    const route = await import('../route');
    expect(route).not.toHaveProperty('GET');
    expect(typeof route.POST).toBe('function');
  });

  it('rejects a hostile origin before any IO', async () => {
    const route = await import('../route');
    const body = validBody({ originalText: RAW_TEXT });
    const response = await route.POST(makeRequest(body, {
      url: 'https://tseng-law.com/api/consultation/international',
      origin: 'https://attacker.example',
    }));

    expect(response.status).toBe(403);
    expect(checkRateLimit).not.toHaveBeenCalled();
    expect(sendInternationalInquiryNotification).not.toHaveBeenCalled();
    expect(markInternationalInquiryNotified).not.toHaveBeenCalled();
    expect(await readdir(tempRoot)).toEqual([]);
  });

  it.each([...PUBLIC_INQUIRY_LOCALES])('persists uiLocale %s and returns 201 after notification', async (uiLocale) => {
    const route = await import('../route');
    const originalText = `Raw ${uiLocale} line1\n  indented\n`;
    const body = validBody({
      uiLocale,
      originalLanguage: `visitor-declared:${uiLocale}`,
      preferredConsultationLanguage: preferredFor(uiLocale),
      originalText,
    });
    const response = await route.POST(makeRequest(body));
    const payload = await response.json() as {
      success: boolean;
      intakeId: string;
      notification: string;
    };

    expect(response.status).toBe(201);
    expect(payload).toEqual({
      success: true,
      intakeId: payload.intakeId,
      notification: 'sent',
    });
    expect(payload.intakeId).toMatch(
      /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i,
    );
    expect(JSON.stringify(payload)).not.toContain(originalText);
    expect(sendInternationalInquiryNotification).toHaveBeenCalledTimes(1);
    const record = vi.mocked(sendInternationalInquiryNotification).mock.calls[0]?.[0] as InternationalInquiryRecord;
    expect(record.payload.uiLocale).toBe(uiLocale);
    expect(record.payload.originalLanguage).toBe(`visitor-declared:${uiLocale}`);
    expect(record.payload.preferredConsultationLanguage).toBe(preferredFor(uiLocale));
    expect(record.payload.originalText).toBe(originalText);
    const stored = JSON.parse(await readFile(rawPath(String(body.requestId)), 'utf8')) as {
      payload: { originalText: string; uiLocale: string };
    };
    expect(stored.payload.originalText).toBe(originalText);
    expect(stored.payload.uiLocale).toBe(uiLocale);
  });

  it('reloads exact raw text, captures all three language axes, and persists before mail', async () => {
    const route = await import('../route');
    const body = validBody({
      uiLocale: 'fil',
      originalLanguage: 'Cebuano (visitor-declared)',
      preferredConsultationLanguage: 'needs-method-confirmation',
      originalText: RAW_TEXT,
    });
    vi.mocked(sendInternationalInquiryNotification).mockImplementation(async (record: InternationalInquiryRecord) => {
      const stored = JSON.parse(await readFile(rawPath(record.payload.requestId), 'utf8')) as {
        payload: {
          originalText: string;
          uiLocale: string;
          originalLanguage: string;
          preferredConsultationLanguage: string;
        };
      };
      expect(stored.payload.originalText).toBe(RAW_TEXT);
      expect(stored.payload.uiLocale).toBe('fil');
      expect(stored.payload.originalLanguage).toBe('Cebuano (visitor-declared)');
      expect(stored.payload.preferredConsultationLanguage).toBe('needs-method-confirmation');
      await expect(readFile(notifyPath(record.payload.requestId), 'utf8')).rejects.toMatchObject({
        code: 'ENOENT',
      });
    });

    const response = await route.POST(makeRequest(body));
    const payload = await response.json() as { success: boolean; intakeId: string; notification: string };

    expect(response.status).toBe(201);
    expect(payload.notification).toBe('sent');
    expect(JSON.stringify(payload)).not.toContain(RAW_TEXT);
    expect(checkRateLimit).toHaveBeenCalledWith(hashedRateKey('ip', '127.0.0.42'), 10, 300_000);
    expect(checkRateLimit).toHaveBeenCalledWith(
      hashedRateKey('request', String(body.requestId).toLowerCase()),
      3,
      300_000,
    );
    expect(JSON.stringify(vi.mocked(checkRateLimit).mock.calls)).not.toContain('127.0.0.42');
    expect(JSON.stringify(vi.mocked(checkRateLimit).mock.calls)).not.toContain(String(body.requestId));
    const stored = JSON.parse(await readFile(rawPath(String(body.requestId)), 'utf8')) as {
      payload: {
        originalText: string;
        uiLocale: string;
        originalLanguage: string;
        preferredConsultationLanguage: string;
      };
    };
    expect(stored.payload.originalText).toBe(RAW_TEXT);
    expect(stored.payload.uiLocale).toBe('fil');
    expect(stored.payload.originalLanguage).toBe('Cebuano (visitor-declared)');
    expect(stored.payload.preferredConsultationLanguage).toBe('needs-method-confirmation');
    await expect(readFile(notifyPath(String(body.requestId)), 'utf8')).resolves.toContain('notified');
    expect(sendInternationalInquiryNotification).toHaveBeenCalledTimes(1);
  });

  it.each([
    ['uiLocale', { uiLocale: 'fr' }],
    ['preferredConsultationLanguage', { preferredConsultationLanguage: 'de' }],
    ['originalLanguage', { originalLanguage: '   ' }],
  ])('rejects invalid %s without persist or mail', async (_label, override) => {
    const route = await import('../route');
    const response = await route.POST(makeRequest(validBody(override)));
    expect(response.status).toBe(400);
    expect(sendInternationalInquiryNotification).not.toHaveBeenCalled();
    expect(await readdir(tempRoot)).toEqual([]);
  });

  it.each([
    ['false', { consent: false }],
    ['missing', { consent: undefined }],
  ])('rejects %s consent without persist or mail', async (_label, override) => {
    const route = await import('../route');
    const body = validBody();
    if (override.consent === undefined) {
      delete (body as { consent?: unknown }).consent;
    } else {
      Object.assign(body, override);
    }
    const response = await route.POST(makeRequest(body));
    expect(response.status).toBe(400);
    expect(sendInternationalInquiryNotification).not.toHaveBeenCalled();
    expect(await readdir(tempRoot)).toEqual([]);
  });

  it('rejects unknown properties without persist or mail', async () => {
    const route = await import('../route');
    const response = await route.POST(makeRequest({
      ...validBody(),
      extra: true,
    }));
    expect(response.status).toBe(400);
    expect(sendInternationalInquiryNotification).not.toHaveBeenCalled();
    expect(await readdir(tempRoot)).toEqual([]);
  });

  it('rejects an oversize streamed body even when Content-Length is understated', async () => {
    const route = await import('../route');
    const raw = `{"pad":"${'x'.repeat(80_000)}"}`;
    expect(Buffer.byteLength(raw, 'utf8')).toBeGreaterThan(80_000);
    const response = await route.POST(makeRequest(null, {
      raw,
      contentLength: '12',
    }));
    expect(response.status).toBe(413);
    expect(checkRateLimit).not.toHaveBeenCalled();
    expect(sendInternationalInquiryNotification).not.toHaveBeenCalled();
    expect(await readdir(tempRoot)).toEqual([]);
  });

  it('rejects unsupported media type and malformed JSON before persist or mail', async () => {
    const route = await import('../route');
    const unsupported = await route.POST(makeRequest(validBody(), { contentType: 'text/plain' }));
    expect(unsupported.status).toBe(415);
    const malformed = await route.POST(makeRequest(null, { raw: '{"requestId":' }));
    expect(malformed.status).toBe(400);
    expect(checkRateLimit).not.toHaveBeenCalled();
    expect(sendInternationalInquiryNotification).not.toHaveBeenCalled();
    expect(await readdir(tempRoot)).toEqual([]);
  });

  it('returns 429 with Retry-After and does not persist or send', async () => {
    vi.mocked(checkRateLimit)
      .mockResolvedValueOnce({ allowed: true, remaining: 9, retryAfterMs: 0 })
      .mockResolvedValueOnce({ allowed: false, remaining: 0, retryAfterMs: 4_500 });
    const route = await import('../route');
    const response = await route.POST(makeRequest(validBody({ originalText: RAW_TEXT })));
    expect(response.status).toBe(429);
    expect(response.headers.get('retry-after')).toBe('5');
    expect(sendInternationalInquiryNotification).not.toHaveBeenCalled();
    expect(await readdir(tempRoot)).toEqual([]);
  });

  it('does not send mail when persist is unavailable', async () => {
    vi.stubEnv('INTERNATIONAL_INQUIRY_DIR', '   ');
    const route = await import('../route');
    const response = await route.POST(makeRequest(validBody({ originalText: RAW_TEXT })));
    expect(response.status).toBe(503);
    const payload = await response.json() as { success: boolean; error: string };
    expect(payload.success).toBe(false);
    expect(JSON.stringify(payload)).not.toContain(RAW_TEXT);
    expect(sendInternationalInquiryNotification).not.toHaveBeenCalled();
    expect(markInternationalInquiryNotified).not.toHaveBeenCalled();
  });

  it('does not send a second mail for an identical duplicate', async () => {
    const route = await import('../route');
    const body = validBody({ originalText: RAW_TEXT, uiLocale: 'ja' });
    const first = await route.POST(makeRequest(body));
    const firstJson = await first.json() as { intakeId: string; notification: string };
    expect(first.status).toBe(201);
    expect(firstJson.notification).toBe('sent');

    const second = await route.POST(makeRequest(body));
    const secondJson = await second.json() as { intakeId: string; notification: string };
    expect(second.status).toBe(200);
    expect(secondJson).toEqual({
      success: true,
      intakeId: firstJson.intakeId,
      notification: 'sent',
    });
    expect(JSON.stringify(secondJson)).not.toContain(RAW_TEXT);
    expect(sendInternationalInquiryNotification).toHaveBeenCalledTimes(1);
  });

  it('returns a generic 409 when the same requestId has a changed payload', async () => {
    const route = await import('../route');
    const requestId = randomUUID();
    const first = await route.POST(makeRequest(validBody({
      requestId,
      originalText: RAW_TEXT,
    })));
    expect(first.status).toBe(201);

    const second = await route.POST(makeRequest(validBody({
      requestId,
      originalText: `${RAW_TEXT}changed`,
    })));
    const payload = await second.json() as { success: boolean; error: string };
    expect(second.status).toBe(409);
    expect(payload.success).toBe(false);
    expect(JSON.stringify(payload)).not.toContain(RAW_TEXT);
    expect(sendInternationalInquiryNotification).toHaveBeenCalledTimes(1);
  });

  it('keeps a saved inquiry pending when SMTP fails', async () => {
    mocks.send.mockRejectedValueOnce(new Error('timeout after DATA'));
    const route = await import('../route');
    const body = validBody({
      uiLocale: 'th',
      originalLanguage: 'Thai (visitor-declared)',
      preferredConsultationLanguage: 'needs-method-confirmation',
      originalText: RAW_TEXT,
    });
    const response = await route.POST(makeRequest(body));
    const payload = await response.json() as {
      success: boolean;
      intakeId: string;
      notification: string;
    };
    expect(response.status).toBe(202);
    expect(payload).toEqual({
      success: true,
      intakeId: payload.intakeId,
      notification: 'pending',
    });
    expect(JSON.stringify(payload)).not.toContain(RAW_TEXT);
    const stored = JSON.parse(await readFile(rawPath(String(body.requestId)), 'utf8')) as {
      payload: { originalText: string };
    };
    expect(stored.payload.originalText).toBe(RAW_TEXT);
    await expect(readFile(notifyPath(String(body.requestId)), 'utf8')).rejects.toMatchObject({
      code: 'ENOENT',
    });
    expect(sendInternationalInquiryNotification).toHaveBeenCalledTimes(1);
    expect(markInternationalInquiryNotified).not.toHaveBeenCalled();
  });

  it('keeps a saved inquiry pending when notification receipt persistence fails', async () => {
    vi.mocked(markInternationalInquiryNotified).mockRejectedValueOnce(new Error('receipt write failed'));
    const route = await import('../route');
    const body = validBody({
      uiLocale: 'vi',
      originalLanguage: 'Vietnamese (visitor-declared)',
      preferredConsultationLanguage: 'ko',
      originalText: RAW_TEXT,
    });
    const response = await route.POST(makeRequest(body));
    const payload = await response.json() as {
      success: boolean;
      intakeId: string;
      notification: string;
    };
    expect(response.status).toBe(202);
    expect(payload.notification).toBe('pending');
    expect(JSON.stringify(payload)).not.toContain(RAW_TEXT);
    const stored = JSON.parse(await readFile(rawPath(String(body.requestId)), 'utf8')) as {
      payload: { originalText: string };
    };
    expect(stored.payload.originalText).toBe(RAW_TEXT);
    expect(sendInternationalInquiryNotification).toHaveBeenCalledTimes(1);
    expect(markInternationalInquiryNotified).toHaveBeenCalledTimes(1);
  });
});

import { createHash } from 'node:crypto';
import { vi } from 'vitest';
import { resetAiIntakeAuthCacheForTests } from '@/lib/ai-intake/auth';
import { resetAiIntakeClockForTests } from '@/lib/ai-intake/clock';
import { resetAiIntakeClaimStoreForTests } from '@/lib/ai-intake/store';
import { resetAiIntakeSubmitRateLimiterForTests } from '@/lib/ai-intake/submit-rate-limit';

export const TEST_AI_INTAKE_CLIENT_ID = 'test-client';
export const TEST_AI_INTAKE_CLIENT_KEY = 'test-ai-intake-client-key-do-not-use-live';
export const TEST_AI_INTAKE_HMAC_SECRET = 'test-ai-intake-hmac-secret-do-not-use-live-xx';

export function testClientKeySha256(): string {
  return createHash('sha256').update(TEST_AI_INTAKE_CLIENT_KEY, 'utf8').digest('hex');
}

export function stubAiIntakeTestEnv(): void {
  vi.stubEnv('NODE_ENV', 'test');
  vi.stubEnv(
    'AI_INTAKE_CLIENTS',
    JSON.stringify([{ clientId: TEST_AI_INTAKE_CLIENT_ID, keySha256: testClientKeySha256() }]),
  );
  vi.stubEnv('AI_INTAKE_HMAC_SECRET', TEST_AI_INTAKE_HMAC_SECRET);
  vi.stubEnv('SMTP_HOST', 'smtp.example.test');
  vi.stubEnv('SMTP_PORT', '587');
  vi.stubEnv('SMTP_USER', 'smtp-account@example.test');
  vi.stubEnv('SMTP_PASS', 'test-only-password');
  vi.stubEnv('CONSULTATION_NOTIFY_EMAIL', 'lawyer@example.test');
  vi.stubEnv('CONSULTATION_LOG_BACKEND', 'local');
  vi.stubEnv('UPSTASH_REDIS_REST_URL', '');
  vi.stubEnv('UPSTASH_REDIS_REST_TOKEN', '');
  vi.stubEnv('KV_REST_API_URL', '');
  vi.stubEnv('KV_REST_API_TOKEN', '');
  vi.stubEnv('BLOB_READ_WRITE_TOKEN', '');
  resetAiIntakeAuthCacheForTests();
  resetAiIntakeClaimStoreForTests();
  resetAiIntakeSubmitRateLimiterForTests();
  resetAiIntakeClockForTests();
}

export function fullCanonicalFields(locale: 'ko' | 'zh-hant' | 'en' | 'ja' = 'en') {
  return {
    name: 'Jane Doe',
    email: 'jane@example.test',
    summary: 'Short company-setup facts and a 2024 timeline. Related party names only: Acme Ltd.',
    locale,
    category: 'company_setup' as const,
    phoneOrMessenger: '+886 912 345 678',
    urgency: 'this month',
    preferredContact: 'email',
    companyOrOrganization: 'Example Co',
    countryOrResidence: 'Japan',
    preferredTime: 'morning Taipei time',
    documentsAvailable: 'contract types only',
  };
}

export function validPreviewBody(overrides: Record<string, unknown> = {}) {
  return {
    locale: 'en',
    name: 'Jane Doe',
    email: 'jane@example.test',
    summary: 'Need a short review of a Taiwan company-setup timeline.',
    category: 'company_setup',
    idempotencyKey: 'aaaaaaaa-bbbb-4ccc-8ddd-eeeeeeeeeeee',
    ...overrides,
  };
}

export function authHeaders(extra?: Record<string, string>): Headers {
  const headers = new Headers({
    authorization: `Bearer ${TEST_AI_INTAKE_CLIENT_KEY}`,
    'content-type': 'application/json',
    'x-forwarded-for': '203.0.113.10',
    ...extra,
  });
  return headers;
}

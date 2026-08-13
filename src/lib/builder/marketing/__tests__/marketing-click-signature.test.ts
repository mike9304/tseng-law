import { afterAll, beforeEach, describe, expect, it } from 'vitest';
import {
  createMarketingClickSignature,
  resolveMarketingTrackingSecret,
  verifyMarketingClickSignature,
} from '@/lib/builder/marketing/marketing-click-signature';

const SECRET_ENV_KEYS = [
  'MARKETING_TRACKING_SECRET',
  'CRM_TRACKING_SECRET',
  'CRM_WEBHOOK_SECRET',
  'NEXTAUTH_SECRET',
  'BUILDER_WEBHOOK_SECRET',
] as const;
const ORIGINAL_SECRET_ENV = Object.fromEntries(
  SECRET_ENV_KEYS.map((key) => [key, process.env[key]]),
) as Record<(typeof SECRET_ENV_KEYS)[number], string | undefined>;

describe('marketing click signatures', () => {
  beforeEach(() => {
    for (const key of SECRET_ENV_KEYS) delete process.env[key];
  });

  afterAll(() => {
    for (const key of SECRET_ENV_KEYS) {
      const original = ORIGINAL_SECRET_ENV[key];
      if (original === undefined) delete process.env[key];
      else process.env[key] = original;
    }
  });

  it('binds the exact tracking token and destination URL', () => {
    const secret = 'secret';
    const token = 'recipient-token';
    const target = 'https://client.example/path?x=1#section';
    const signature = createMarketingClickSignature(token, target, secret);

    expect(verifyMarketingClickSignature(token, target, signature, secret)).toBe(true);
    expect(verifyMarketingClickSignature(`${token}-tampered`, target, signature, secret)).toBe(false);
    expect(verifyMarketingClickSignature(token, `${target}-tampered`, signature, secret)).toBe(false);
  });

  it('uses unambiguous length-delimited fields rather than concatenation', () => {
    const secret = 'secret';

    expect(createMarketingClickSignature('ab', 'c', secret)).not.toBe(
      createMarketingClickSignature('a', 'bc', secret),
    );
  });

  it('prefers the dedicated secret, follows the existing CRM fallback order, and returns null without one', () => {
    expect(resolveMarketingTrackingSecret()).toBeNull();

    process.env.BUILDER_WEBHOOK_SECRET = ' builder ';
    process.env.NEXTAUTH_SECRET = ' next-auth ';
    process.env.CRM_WEBHOOK_SECRET = ' crm-webhook ';
    process.env.CRM_TRACKING_SECRET = ' crm-tracking ';
    expect(resolveMarketingTrackingSecret()).toBe('crm-tracking');

    process.env.MARKETING_TRACKING_SECRET = ' marketing ';
    expect(resolveMarketingTrackingSecret()).toBe('marketing');
  });
});

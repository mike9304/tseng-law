import { describe, expect, it } from 'vitest';
import { buildMarketingDeliverabilityReport } from '../deliverability';

describe('buildMarketingDeliverabilityReport', () => {
  it('fails production readiness when no real provider is configured', () => {
    const report = buildMarketingDeliverabilityReport({
      env: {
        NODE_ENV: 'production',
        NEXT_PUBLIC_SITE_URL: 'https://tseng-law.com',
      },
      fromAddress: 'bookings@tseng-law.com',
    });

    expect(report.ok).toBe(false);
    expect(report.provider).toBe('stub');
    expect(report.checks).toContainEqual(
      expect.objectContaining({
        id: 'production_provider',
        status: 'fail',
      }),
    );
  });

  it('passes required checks when Resend and an HTTPS site URL are configured', () => {
    const report = buildMarketingDeliverabilityReport({
      env: {
        NODE_ENV: 'production',
        MARKETING_EMAIL_PROVIDER: 'resend',
        RESEND_API_KEY: 'rs-secret',
        NEXT_PUBLIC_SITE_URL: 'https://tseng-law.com',
      },
      fromAddress: 'newsletter@tseng-law.com',
    });

    expect(report.ok).toBe(true);
    expect(report.provider).toBe('resend');
    expect(report.siteDomain).toBe('tseng-law.com');
    expect(report.fromDomain).toBe('tseng-law.com');
    expect(report.checks.filter((check) => check.status === 'fail')).toEqual([]);
  });

  it('warns when the sender domain differs from the configured site domain', () => {
    const report = buildMarketingDeliverabilityReport({
      env: {
        NODE_ENV: 'production',
        MARKETING_EMAIL_PROVIDER: 'mailchimp-transactional',
        MAILCHIMP_TRANSACTIONAL_API_KEY: 'mc-secret',
        SITE_URL: 'https://tseng-law.com',
      },
      fromAddress: 'bookings@hoveringlaw.com.tw',
    });

    expect(report.ok).toBe(true);
    expect(report.provider).toBe('mailchimp-transactional');
    expect(report.checks).toContainEqual(
      expect.objectContaining({
        id: 'sender_domain_alignment',
        status: 'warn',
      }),
    );
  });
});

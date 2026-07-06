import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import DeliverabilityPanel from '../DeliverabilityPanel';
import type { MarketingDeliverabilityReport } from '@/lib/builder/marketing/deliverability';

function reportFixture(): MarketingDeliverabilityReport {
  return {
    ok: true,
    provider: 'resend',
    production: true,
    siteUrl: 'https://tseng-law.com',
    siteDomain: 'tseng-law.com',
    fromAddress: 'bookings@tseng-law.com',
    fromDomain: 'tseng-law.com',
    checks: [
      {
        id: 'production_provider',
        status: 'pass',
        label: 'Production provider',
        detail: 'Resend is configured for production delivery.',
      },
      {
        id: 'sender_domain_alignment',
        status: 'pass',
        label: 'Sender domain',
        detail: 'Sender domain matches tseng-law.com.',
      },
    ],
  };
}

describe('DeliverabilityPanel', () => {
  it('renders provider readiness checks and test-send controls', () => {
    const html = renderToStaticMarkup(
      <DeliverabilityPanel locale="en" initialReport={reportFixture()} />,
    );

    expect(html).toContain('Deliverability QA');
    expect(html).toContain('resend');
    expect(html).toContain('Production provider');
    expect(html).toContain('Sender domain');
    expect(html).toContain('Test recipient');
  });
});

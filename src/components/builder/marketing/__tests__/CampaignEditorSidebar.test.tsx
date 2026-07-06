import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { CampaignEditorSidebar } from '../CampaignEditorSidebar';
import { CAMPAIGN_EDITOR_COPY } from '../campaign-editor-copy';
import type { Campaign } from '@/lib/builder/marketing/campaign-types';
import type { CampaignAnalyticsStatsPayload } from '../campaign-analytics-payload';

function campaignFixture(): Campaign {
  return {
    campaignId: 'cmp-sidebar',
    name: 'Campaign analytics',
    subject: { ko: '안녕', 'zh-hant': '您好', en: 'Hello' },
    bodyHtml: { ko: '<p>안녕</p>', 'zh-hant': '<p>您好</p>', en: '<p>Hello</p>' },
    bodyText: { ko: '안녕', 'zh-hant': '您好', en: 'Hello' },
    segmentTags: ['lead'],
    fromName: 'Tseng Law',
    fromAddress: 'hello@example.test',
    status: 'sent',
    sentAt: '2026-06-18T00:00:00.000Z',
    stats: { recipients: 4, opens: 2, clicks: 1, unsubscribes: 1, bounces: 0 },
    createdAt: '2026-06-18T00:00:00.000Z',
    updatedAt: '2026-06-18T00:00:00.000Z',
  };
}

function analyticsFixture(): CampaignAnalyticsStatsPayload {
  return {
    ok: true,
    campaign: {
      campaignId: 'cmp-sidebar',
      name: 'Campaign analytics',
      status: 'sent',
      sentAt: '2026-06-18T00:00:00.000Z',
    },
    stats: { recipients: 4, opens: 2, clicks: 1, unsubscribes: 1, bounces: 0 },
    rates: { open: 0.5, click: 0.25, unsubscribe: 0.25 },
    pending: 0,
    recipientBreakdown: {
      pending: 0,
      sent: 1,
      failed: 0,
      bounced: 0,
      opened: 1,
      clicked: 1,
      unsubscribed: 1,
    },
    recentEvents: [
      {
        kind: 'clicked',
        occurredAt: '2026-06-18T02:00:00.000Z',
        subscriberId: 'sub-clicked',
        email: 'clicked@example.test',
      },
    ],
    funnel: [
      { key: 'recipients', count: 4, rate: 1 },
      { key: 'opens', count: 2, rate: 0.5 },
      { key: 'clicks', count: 1, rate: 0.25 },
      { key: 'unsubscribes', count: 1, rate: 0.25 },
      { key: 'bounces', count: 0, rate: 0 },
    ],
  };
}

describe('CampaignEditorSidebar', () => {
  it('renders campaign analytics metrics and recent attribution activity', () => {
    const campaign = campaignFixture();
    const html = renderToStaticMarkup(
      <CampaignEditorSidebar
        campaign={campaign}
        locale="en"
        text={CAMPAIGN_EDITOR_COPY.en}
        form={{
          name: campaign.name,
          fromName: campaign.fromName,
          fromAddress: campaign.fromAddress,
          segmentTags: campaign.segmentTags.join(', '),
          subject: campaign.subject,
          bodyHtml: campaign.bodyHtml,
          bodyText: campaign.bodyText,
          scheduledAt: '',
        }}
        saving={false}
        message={null}
        templates={[]}
        applyingTemplateId=""
        initialAnalyticsPayload={analyticsFixture()}
        onFormPatch={() => undefined}
        onSave={() => undefined}
        onApplyTemplate={() => undefined}
      />,
    );

    expect(html).toContain('Performance');
    expect(html).toContain('Open rate');
    expect(html).toContain('50%');
    expect(html).toContain('25%');
    expect(html).toContain('clicked@example.test');
    expect(html).toContain('Funnel');
  });
});

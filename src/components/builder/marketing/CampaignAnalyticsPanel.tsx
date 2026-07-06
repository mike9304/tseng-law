'use client';

import { useEffect, useState } from 'react';
import type { Campaign } from '@/lib/builder/marketing/campaign-types';
import type {
  CampaignActivityEventKind,
  CampaignFunnelKey,
} from '@/lib/builder/marketing/campaign-analytics';
import type { Locale } from '@/lib/locales';
import {
  CAMPAIGN_ANALYTICS_PANEL_COPY,
  type CampaignAnalyticsPanelCopy,
} from './campaign-analytics-panel-copy';
import {
  campaignAnalyticsStatsPayloadSchema,
  type CampaignAnalyticsStatsPayload,
} from './campaign-analytics-payload';
import { localizedMarketingApiPath } from './marketing-api-path';

type Props = {
  readonly campaign: Campaign;
  readonly locale: Locale;
  readonly initialPayload?: CampaignAnalyticsStatsPayload;
};

type PanelState =
  | { readonly kind: 'loading' }
  | { readonly kind: 'ready'; readonly payload: CampaignAnalyticsStatsPayload }
  | { readonly kind: 'error' };


function localeTag(locale: Locale): string {
  switch (locale) {
    case 'ko':
      return 'ko-KR';
    case 'zh-hant':
      return 'zh-TW';
    case 'en':
      return 'en-US';
    default:
      return assertNever(locale);
  }
}

function assertNever(value: never): never {
  throw new Error(`Unhandled campaign analytics variant: ${value}`);
}

function formatNumber(locale: Locale, value: number): string {
  return new Intl.NumberFormat(localeTag(locale)).format(value);
}

function formatRate(locale: Locale, value: number): string {
  const percentage = Math.round(value * 1000) / 10;
  return `${new Intl.NumberFormat(localeTag(locale), { maximumFractionDigits: 1 }).format(percentage)}%`;
}

function formatTimestamp(locale: Locale, value: string): string {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat(localeTag(locale), {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
}

function eventLabel(copy: CampaignAnalyticsPanelCopy, kind: CampaignActivityEventKind): string {
  switch (kind) {
    case 'sent':
      return copy.sent;
    case 'opened':
      return copy.opened;
    case 'clicked':
      return copy.clicked;
    case 'unsubscribed':
      return copy.unsubscribed;
    default:
      return assertNever(kind);
  }
}

function funnelLabel(copy: CampaignAnalyticsPanelCopy, key: CampaignFunnelKey): string {
  switch (key) {
    case 'recipients':
      return copy.recipients;
    case 'opens':
      return copy.opens;
    case 'clicks':
      return copy.clicks;
    case 'unsubscribes':
      return copy.unsubscribes;
    case 'bounces':
      return copy.bounces;
    default:
      return assertNever(key);
  }
}

export function CampaignAnalyticsPanel({ campaign, locale, initialPayload }: Props) {
  const copy = CAMPAIGN_ANALYTICS_PANEL_COPY[locale];
  const [state, setState] = useState<PanelState>(
    initialPayload ? { kind: 'ready', payload: initialPayload } : { kind: 'loading' },
  );

  useEffect(() => {
    if (initialPayload) return;
    let cancelled = false;

    async function loadStats(): Promise<void> {
      try {
        const response = await fetch(
          localizedMarketingApiPath(
            locale,
            `/api/builder/marketing/campaigns/${campaign.campaignId}/stats`,
          ),
          { credentials: 'same-origin' },
        );
        if (!response.ok) {
          if (!cancelled) setState({ kind: 'error' });
          return;
        }
        const raw: unknown = await response.json();
        const parsed = campaignAnalyticsStatsPayloadSchema.safeParse(raw);
        if (!parsed.success) {
          if (!cancelled) setState({ kind: 'error' });
          return;
        }
        if (!cancelled) setState({ kind: 'ready', payload: parsed.data });
      } catch (error) {
        if (error instanceof Error) {
          if (!cancelled) setState({ kind: 'error' });
          return;
        }
        throw error;
      }
    }

    void loadStats();
    return () => {
      cancelled = true;
    };
  }, [campaign.campaignId, initialPayload, locale]);

  if (state.kind === 'loading') {
    return (
      <section style={{ display: 'flex', flexDirection: 'column', gap: 8, fontSize: 12 }}>
        <strong style={{ fontSize: 11, color: '#64748b', textTransform: 'uppercase' }}>{copy.title}</strong>
        <span style={{ color: '#64748b' }}>{copy.loading}</span>
      </section>
    );
  }

  if (state.kind === 'error') {
    return (
      <section style={{ display: 'flex', flexDirection: 'column', gap: 8, fontSize: 12 }}>
        <strong style={{ fontSize: 11, color: '#64748b', textTransform: 'uppercase' }}>{copy.title}</strong>
        <span style={{ color: '#dc2626' }}>{copy.unavailable}</span>
      </section>
    );
  }

  const payload = state.payload;
  return (
    <section style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <strong style={{ fontSize: 11, color: '#64748b', textTransform: 'uppercase' }}>{copy.title}</strong>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
        <Metric label={copy.recipients} value={formatNumber(locale, payload.stats.recipients)} />
        <Metric label={copy.openRate} value={formatRate(locale, payload.rates.open)} />
        <Metric label={copy.clickRate} value={formatRate(locale, payload.rates.click)} />
        <Metric label={copy.unsubscribeRate} value={formatRate(locale, payload.rates.unsubscribe)} />
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        <span style={{ fontSize: 11, fontWeight: 700, color: '#475569' }}>{copy.funnel}</span>
        {payload.funnel.map((step) => (
          <div key={step.key} style={{ display: 'grid', gridTemplateColumns: '88px 1fr 42px', gap: 6, alignItems: 'center', fontSize: 11, color: '#475569' }}>
            <span>{funnelLabel(copy, step.key)}</span>
            <span style={{ height: 6, borderRadius: 999, background: '#e2e8f0', overflow: 'hidden' }}>
              <span
                style={{
                  display: 'block',
                  width: `${Math.min(100, Math.max(0, step.rate * 100))}%`,
                  height: '100%',
                  background: '#0f766e',
                }}
              />
            </span>
            <span style={{ textAlign: 'right' }}>{formatNumber(locale, step.count)}</span>
          </div>
        ))}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        <span style={{ fontSize: 11, fontWeight: 700, color: '#475569' }}>{copy.recentActivity}</span>
        {payload.recentEvents.length > 0 ? (
          payload.recentEvents.slice(0, 5).map((event) => (
            <div key={`${event.subscriberId}-${event.kind}-${event.occurredAt}`} style={{ display: 'flex', flexDirection: 'column', gap: 2, fontSize: 11, color: '#475569' }}>
              <span>
                <strong>{eventLabel(copy, event.kind)}</strong> · {event.email}
              </span>
              <span style={{ color: '#94a3b8' }}>{formatTimestamp(locale, event.occurredAt)}</span>
            </div>
          ))
        ) : (
          <span style={{ fontSize: 11, color: '#94a3b8' }}>{copy.noActivity}</span>
        )}
      </div>
    </section>
  );
}

function Metric({ label, value }: { readonly label: string; readonly value: string }) {
  return (
    <div style={{ minHeight: 54, border: '1px solid #e2e8f0', borderRadius: 8, padding: '8px 10px', background: '#fff' }}>
      <div style={{ fontSize: 10, color: '#64748b', textTransform: 'uppercase' }}>{label}</div>
      <div style={{ marginTop: 4, fontSize: 16, fontWeight: 800, color: '#0f172a' }}>{value}</div>
    </div>
  );
}

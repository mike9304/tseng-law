'use client';

import { useState } from 'react';
import { z } from 'zod';
import type {
  MarketingDeliverabilityCheckStatus,
  MarketingDeliverabilityReport,
} from '@/lib/builder/marketing/deliverability';
import type { Locale } from '@/lib/locales';
import { localizedMarketingApiPath } from './marketing-api-path';

interface Props {
  readonly locale: Locale;
  readonly initialReport: MarketingDeliverabilityReport;
}

const copy = {
  ko: {
    title: '발송 품질 QA',
    summaryReady: '운영 발송 준비 완료',
    summaryBlocked: '운영 발송 준비 필요',
    provider: 'Provider',
    from: '발신자',
    site: '사이트 URL',
    testRecipient: '테스트 수신자',
    testPlaceholder: 'owner@example.com',
    sendTest: '테스트 발송',
    refresh: '새로고침',
    pass: '통과',
    warn: '주의',
    fail: '실패',
    testSuccess: 'Deliverability 테스트 메일을 발송했습니다.',
    testFailure: 'Deliverability 테스트를 완료하지 못했습니다.',
  },
  'zh-hant': {
    title: '發送品質 QA',
    summaryReady: '正式發送準備完成',
    summaryBlocked: '正式發送尚需處理',
    provider: 'Provider',
    from: '寄件者',
    site: '網站 URL',
    testRecipient: '測試收件者',
    testPlaceholder: 'owner@example.com',
    sendTest: '發送測試',
    refresh: '重新整理',
    pass: '通過',
    warn: '注意',
    fail: '失敗',
    testSuccess: 'Deliverability 測試郵件已發送。',
    testFailure: '無法完成 Deliverability 測試。',
  },
  en: {
    title: 'Deliverability QA',
    summaryReady: 'Production delivery ready',
    summaryBlocked: 'Production delivery needs attention',
    provider: 'Provider',
    from: 'From',
    site: 'Site URL',
    testRecipient: 'Test recipient',
    testPlaceholder: 'owner@example.com',
    sendTest: 'Send test',
    refresh: 'Refresh',
    pass: 'Pass',
    warn: 'Warn',
    fail: 'Fail',
    testSuccess: 'Deliverability test email sent.',
    testFailure: 'Unable to complete the deliverability test.',
  },
} as const;

const statusColor: Record<MarketingDeliverabilityCheckStatus, string> = {
  pass: '#15803d',
  warn: '#b45309',
  fail: '#b91c1c',
};

const deliverabilityCheckSchema = z.object({
  id: z.enum([
    'production_provider',
    'provider_secret',
    'site_url',
    'https_site_url',
    'sender_domain_alignment',
  ]),
  status: z.enum(['pass', 'warn', 'fail']),
  label: z.string(),
  detail: z.string(),
});

const deliverabilityReportSchema = z.object({
  ok: z.boolean(),
  provider: z.enum(['resend', 'mailchimp-transactional', 'stub']),
  production: z.boolean(),
  siteUrl: z.string().optional(),
  siteDomain: z.string().optional(),
  fromAddress: z.string(),
  fromDomain: z.string(),
  checks: z.array(deliverabilityCheckSchema),
});

const deliverabilityPayloadSchema = z.union([
  z.object({ ok: z.literal(true), report: deliverabilityReportSchema }),
  z.object({ ok: z.literal(false), error: z.string().optional(), report: deliverabilityReportSchema.optional() }),
]);

type DeliverabilityPayload = z.infer<typeof deliverabilityPayloadSchema>;

function statusLabel(locale: Locale, status: MarketingDeliverabilityCheckStatus): string {
  return copy[locale][status];
}

function parseDeliverabilityPayload(value: unknown): DeliverabilityPayload {
  const parsed = deliverabilityPayloadSchema.safeParse(value);
  return parsed.success ? parsed.data : { ok: false };
}

export default function DeliverabilityPanel({ locale, initialReport }: Props) {
  const text = copy[locale];
  const [report, setReport] = useState(initialReport);
  const [testEmail, setTestEmail] = useState('');
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState('');

  async function refreshReport() {
    setBusy(true);
    setMessage('');
    try {
      const res = await fetch(localizedMarketingApiPath(locale, '/api/builder/marketing/deliverability'), {
        credentials: 'same-origin',
      });
      const payload = parseDeliverabilityPayload(await res.json().catch(() => null));
      if (payload.ok) {
        setReport(payload.report);
      } else {
        setMessage(payload.error ?? text.testFailure);
      }
    } finally {
      setBusy(false);
    }
  }

  async function sendTest() {
    if (!testEmail.trim()) return;
    setBusy(true);
    setMessage('');
    try {
      const res = await fetch(localizedMarketingApiPath(locale, '/api/builder/marketing/deliverability'), {
        method: 'POST',
        credentials: 'same-origin',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          testEmail: testEmail.trim(),
          fromAddress: report.fromAddress,
        }),
      });
      const payload = parseDeliverabilityPayload(await res.json().catch(() => null));
      if (payload.report) setReport(payload.report);
      if (res.ok && payload.ok) {
        setMessage(text.testSuccess);
      } else {
        setMessage(payload.ok ? text.testFailure : payload.error ?? text.testFailure);
      }
    } finally {
      setBusy(false);
    }
  }

  return (
    <section style={{ border: '1px solid #e2e8f0', borderRadius: 8, background: '#fff', padding: 16, display: 'grid', gap: 12 }}>
      <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap' }}>
        <div>
          <h2 style={{ margin: 0, fontSize: 16, color: '#0f172a' }}>{text.title}</h2>
          <p style={{ margin: '4px 0 0', fontSize: 12, color: report.ok ? '#15803d' : '#b91c1c', fontWeight: 700 }}>
            {report.ok ? text.summaryReady : text.summaryBlocked}
          </p>
        </div>
        <button type="button" disabled={busy} onClick={refreshReport} style={{ padding: '6px 10px', border: '1px solid #cbd5e1', background: '#fff', borderRadius: 6, cursor: busy ? 'not-allowed' : 'pointer', fontSize: 12, fontWeight: 700 }}>
          {text.refresh}
        </button>
      </div>
      <div style={{ display: 'grid', gap: 8, gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', fontSize: 12 }}>
        <div><strong>{text.provider}</strong><br />{report.provider}</div>
        <div><strong>{text.from}</strong><br />{report.fromAddress}</div>
      </div>
      <div style={{ display: 'grid', gap: 8, marginTop: 24 }}>
        {report.checks.map((check) => (
          <div key={check.id} style={{ display: 'grid', gap: 4, padding: 10, border: '1px solid #e2e8f0', borderRadius: 6, background: '#f8fafc' }}>
            <div style={{ display: 'flex', gap: 8, alignItems: 'center', justifyContent: 'space-between' }}>
              <strong style={{ fontSize: 13, color: '#0f172a' }}>{check.label}</strong>
              <span style={{ fontSize: 11, color: statusColor[check.status], fontWeight: 800 }}>{statusLabel(locale, check.status)}</span>
            </div>
            <span style={{ fontSize: 12, color: '#475569' }}>{check.detail}</span>
          </div>
        ))}
      </div>
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'flex-end' }}>
        <label style={{ display: 'grid', gap: 4, fontSize: 12, color: '#475569', minWidth: 240, flex: '1 1 260px' }}>
          {text.testRecipient}
          <input type="email" value={testEmail} placeholder={text.testPlaceholder} onChange={(event) => setTestEmail(event.target.value)} style={{ padding: '7px 10px', border: '1px solid #cbd5e1', borderRadius: 6, fontSize: 13 }} />
        </label>
        <button type="button" disabled={busy || !testEmail.trim()} onClick={sendTest} style={{ padding: '8px 12px', border: 0, borderRadius: 6, background: busy || !testEmail.trim() ? '#94a3b8' : '#0f172a', color: '#fff', cursor: busy || !testEmail.trim() ? 'not-allowed' : 'pointer', fontSize: 13, fontWeight: 700 }}>
          {text.sendTest}
        </button>
      </div>
      {message ? <div style={{ fontSize: 12, color: message === text.testSuccess ? '#15803d' : '#b91c1c', fontWeight: 700 }}>{message}</div> : null}
    </section>
  );
}

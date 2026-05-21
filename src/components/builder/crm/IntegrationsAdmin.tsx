'use client';

import { useState } from 'react';
import type { CrmIntegration, CrmIntegrationKind } from '@/lib/builder/crm/integrations-model';

interface Props {
  initialIntegrations: CrmIntegration[];
}

const KIND_LABEL: Record<CrmIntegrationKind, string> = {
  'slack-webhook': 'Slack',
  'generic-webhook': 'Generic webhook',
  'mailchimp-stub': 'Mailchimp (stub)',
};

const KIND_COLOR: Record<CrmIntegrationKind, string> = {
  'slack-webhook': '#4a154b',
  'generic-webhook': '#0f172a',
  'mailchimp-stub': '#ffd43b',
};

interface DraftState {
  kind: CrmIntegrationKind;
  webhookUrl: string;
}

const EMPTY: DraftState = { kind: 'slack-webhook', webhookUrl: '' };

export default function IntegrationsAdmin({ initialIntegrations }: Props) {
  const [integrations, setIntegrations] = useState(initialIntegrations);
  const [creating, setCreating] = useState(false);
  const [draft, setDraft] = useState<DraftState>(EMPTY);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  async function createOne() {
    if (draft.kind !== 'mailchimp-stub' && !draft.webhookUrl.trim()) {
      setError('Webhook URL을 입력해 주세요.');
      return;
    }
    setBusy(true);
    setError('');
    try {
      const res = await fetch('/api/builder/crm/integrations', {
        method: 'POST',
        credentials: 'same-origin',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          kind: draft.kind,
          webhookUrl: draft.webhookUrl.trim() || undefined,
          enabled: true,
        }),
      });
      if (!res.ok) {
        const payload = (await res.json().catch(() => ({}))) as { error?: string };
        setError(payload.error || 'Failed to create integration');
        return;
      }
      const data = (await res.json()) as { integration: CrmIntegration };
      setIntegrations((prev) => [data.integration, ...prev]);
      setDraft(EMPTY);
      setCreating(false);
    } finally {
      setBusy(false);
    }
  }

  return (
    <section
      data-testid="crm-integrations-admin"
      style={{ padding: 16, display: 'flex', flexDirection: 'column', gap: 12 }}
    >
      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <button
          type="button"
          onClick={() => {
            setCreating((v) => !v);
            setDraft(EMPTY);
          }}
          data-testid="crm-integration-create-toggle"
          style={primaryButton}
        >
          + 연동 추가
        </button>
      </div>

      {creating ? (
        <div style={cardStyle} data-testid="crm-integration-create-form">
          <select
            value={draft.kind}
            onChange={(e) =>
              setDraft((p) => ({ ...p, kind: e.target.value as CrmIntegrationKind }))
            }
            style={inputStyle}
          >
            {(Object.keys(KIND_LABEL) as CrmIntegrationKind[]).map((k) => (
              <option key={k} value={k}>
                {KIND_LABEL[k]}
              </option>
            ))}
          </select>
          {draft.kind !== 'mailchimp-stub' ? (
            <input
              type="url"
              placeholder="https://hooks.slack.com/services/..."
              value={draft.webhookUrl}
              onChange={(e) => setDraft((p) => ({ ...p, webhookUrl: e.target.value }))}
              style={{ ...inputStyle, flexBasis: 360 }}
            />
          ) : null}
          <button
            type="button"
            disabled={busy}
            onClick={createOne}
            data-testid="crm-integration-create-submit"
            style={primaryButton}
          >
            저장
          </button>
        </div>
      ) : null}

      {error ? (
        <div role="alert" style={{ color: '#dc2626', fontSize: 12 }}>
          {error}
        </div>
      ) : null}

      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13, minWidth: 640 }}>
          <thead>
            <tr style={{ background: '#f1f5f9', textAlign: 'left' }}>
              <th style={th}>채널</th>
              <th style={th}>대상</th>
              <th style={th}>활성</th>
              <th style={th}>생성</th>
            </tr>
          </thead>
          <tbody>
            {integrations.length === 0 ? (
              <tr>
                <td colSpan={4} style={{ padding: 24, textAlign: 'center', color: '#94a3b8' }}>
                  연결된 외부 채널이 없습니다.
                </td>
              </tr>
            ) : (
              integrations.map((integ) => (
                <tr key={integ.id} style={{ borderBottom: '1px solid #e2e8f0' }}>
                  <td style={td}>
                    <span
                      style={{
                        display: 'inline-block',
                        padding: '2px 8px',
                        borderRadius: 999,
                        background: `${KIND_COLOR[integ.kind]}22`,
                        color: KIND_COLOR[integ.kind],
                        fontWeight: 700,
                        fontSize: 11,
                      }}
                    >
                      {KIND_LABEL[integ.kind]}
                    </span>
                  </td>
                  <td style={{ ...td, wordBreak: 'break-all' }}>{integ.webhookUrl ?? '—'}</td>
                  <td style={td}>{integ.enabled ? 'ON' : 'OFF'}</td>
                  <td style={td}>{new Date(integ.createdAt).toLocaleDateString('ko-KR')}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}

const inputStyle: React.CSSProperties = {
  padding: '6px 10px',
  border: '1px solid #cbd5e1',
  borderRadius: 6,
  fontSize: 13,
};

const primaryButton: React.CSSProperties = {
  padding: '6px 12px',
  border: 0,
  background: '#0f172a',
  color: '#fff',
  borderRadius: 6,
  fontSize: 13,
  cursor: 'pointer',
  fontWeight: 700,
};

const cardStyle: React.CSSProperties = {
  display: 'flex',
  gap: 8,
  flexWrap: 'wrap',
  padding: 12,
  border: '1px solid #e2e8f0',
  borderRadius: 8,
  background: '#f8fafc',
  alignItems: 'center',
};

const th: React.CSSProperties = { padding: '8px 12px', whiteSpace: 'nowrap' };
const td: React.CSSProperties = { padding: '8px 12px' };
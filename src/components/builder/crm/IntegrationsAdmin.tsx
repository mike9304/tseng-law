'use client';

import { useState } from 'react';
import type { CrmIntegration, CrmIntegrationKind } from '@/lib/builder/crm/integrations-model';
import type { Locale } from '@/lib/locales';
import { formatDate } from '@/lib/builder/format/datetime';

interface Props {
  initialIntegrations: CrmIntegration[];
  locale: Locale;
}

const KIND_COLOR: Record<CrmIntegrationKind, string> = {
  'slack-webhook': '#4a154b',
  'generic-webhook': '#0f172a',
  mailchimp: '#ffd43b',
};

interface DraftState {
  kind: CrmIntegrationKind;
  webhookUrl: string;
}

const EMPTY: DraftState = { kind: 'slack-webhook', webhookUrl: '' };

const INTEGRATIONS_COPY = {
  ko: {
    kindLabel: {
      'slack-webhook': 'Slack',
      'generic-webhook': '일반 Webhook',
      mailchimp: 'Mailchimp',
    },
    addIntegration: '+ 연동 추가',
    save: '저장',
    webhookRequired: 'Webhook URL을 입력해 주세요.',
    createFailed: '외부 연동을 만들지 못했습니다.',
    updateFailed: '연동 수정에 실패했습니다.',
    deleteFailed: '연동 삭제에 실패했습니다.',
    deleteConfirm: '이 연동을 삭제할까요?',
    deleteLabel: '삭제',
    headers: {
      channel: '채널',
      target: '대상',
      enabled: '활성',
      created: '생성',
      actions: '관리',
    },
    empty: '연결된 외부 채널이 없습니다.',
    dateLocale: 'ko-KR',
  },
  'zh-hant': {
    kindLabel: {
      'slack-webhook': 'Slack',
      'generic-webhook': '一般 Webhook',
      mailchimp: 'Mailchimp',
    },
    addIntegration: '+ 新增整合',
    save: '儲存',
    webhookRequired: '請輸入 Webhook URL。',
    createFailed: '無法建立外部整合。',
    updateFailed: '無法更新整合。',
    deleteFailed: '無法刪除整合。',
    deleteConfirm: '確定刪除此整合？',
    deleteLabel: '刪除',
    headers: {
      channel: '渠道',
      target: '目標',
      enabled: '啟用',
      created: '建立時間',
      actions: '操作',
    },
    empty: '尚未連接外部渠道。',
    dateLocale: 'zh-TW',
  },
  en: {
    kindLabel: {
      'slack-webhook': 'Slack',
      'generic-webhook': 'Generic webhook',
      mailchimp: 'Mailchimp',
    },
    addIntegration: '+ Add integration',
    save: 'Save',
    webhookRequired: 'Enter a webhook URL.',
    createFailed: 'Unable to create the external integration.',
    updateFailed: 'Failed to update the integration.',
    deleteFailed: 'Failed to delete the integration.',
    deleteConfirm: 'Delete this integration?',
    deleteLabel: 'Delete',
    headers: {
      channel: 'Channel',
      target: 'Target',
      enabled: 'Enabled',
      created: 'Created',
      actions: 'Actions',
    },
    empty: 'No external channels connected.',
    dateLocale: 'en-US',
  },
} as const satisfies Record<Locale, {
  kindLabel: Record<CrmIntegrationKind, string>;
  addIntegration: string;
  save: string;
  webhookRequired: string;
  createFailed: string;
  updateFailed: string;
  deleteFailed: string;
  deleteConfirm: string;
  deleteLabel: string;
  headers: Record<'channel' | 'target' | 'enabled' | 'created' | 'actions', string>;
  empty: string;
  dateLocale: string;
}>;

export default function IntegrationsAdmin({ initialIntegrations, locale }: Props) {
  const copy = INTEGRATIONS_COPY[locale];
  const [integrations, setIntegrations] = useState(initialIntegrations);
  const [creating, setCreating] = useState(false);
  const [draft, setDraft] = useState<DraftState>(EMPTY);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  async function createOne() {
    if (draft.kind !== 'mailchimp' && !draft.webhookUrl.trim()) {
      setError(copy.webhookRequired);
      return;
    }
    setBusy(true);
    setError('');
    try {
      const res = await fetch(localizedCrmApiPath(locale, '/api/builder/crm/integrations'), {
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
        setError(payload.error || copy.createFailed);
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

  async function toggleEnabled(integ: CrmIntegration) {
    setBusy(true);
    setError('');
    try {
      const res = await fetch(localizedCrmApiPath(locale, `/api/builder/crm/integrations/${integ.id}`), {
        method: 'PATCH',
        credentials: 'same-origin',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ enabled: !integ.enabled }),
      });
      if (!res.ok) {
        const payload = (await res.json().catch(() => ({}))) as { error?: string };
        setError(payload.error || copy.updateFailed);
        return;
      }
      const data = (await res.json()) as { integration: CrmIntegration };
      setIntegrations((prev) => prev.map((i) => (i.id === data.integration.id ? data.integration : i)));
    } finally {
      setBusy(false);
    }
  }

  async function removeOne(id: string) {
    if (busy) return;
    if (typeof window !== 'undefined' && !window.confirm(copy.deleteConfirm)) return;
    setBusy(true);
    setError('');
    try {
      const res = await fetch(localizedCrmApiPath(locale, `/api/builder/crm/integrations/${id}`), {
        method: 'DELETE',
        credentials: 'same-origin',
      });
      if (!res.ok) {
        const payload = (await res.json().catch(() => ({}))) as { error?: string };
        setError(payload.error || copy.deleteFailed);
        return;
      }
      setIntegrations((prev) => prev.filter((i) => i.id !== id));
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
          {copy.addIntegration}
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
            {(Object.keys(copy.kindLabel) as CrmIntegrationKind[]).map((k) => (
              <option key={k} value={k}>
                {copy.kindLabel[k]}
              </option>
            ))}
          </select>
          {draft.kind !== 'mailchimp' ? (
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
            {copy.save}
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
              <th style={th}>{copy.headers.channel}</th>
              <th style={th}>{copy.headers.target}</th>
              <th style={th}>{copy.headers.enabled}</th>
              <th style={th}>{copy.headers.created}</th>
              <th style={th}>{copy.headers.actions}</th>
            </tr>
          </thead>
          <tbody>
            {integrations.length === 0 ? (
              <tr>
                <td colSpan={5} style={{ padding: 24, textAlign: 'center', color: '#94a3b8' }}>
                  {copy.empty}
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
                      {copy.kindLabel[integ.kind]}
                    </span>
                  </td>
                  <td style={{ ...td, wordBreak: 'break-all' }}>{integ.webhookUrl ?? '—'}</td>
                  <td style={td}>{integ.enabled ? 'ON' : 'OFF'}</td>
                  <td style={td}>{formatDate(integ.createdAt, locale)}</td>
                  <td style={td}>
                    <div style={{ display: 'flex', gap: 8 }}>
                      <button
                        type="button"
                        disabled={busy}
                        onClick={() => void toggleEnabled(integ)}
                        data-testid={`crm-integration-toggle-${integ.id}`}
                        style={{ padding: '4px 10px', borderRadius: 6, border: 'none', cursor: busy ? 'default' : 'pointer', color: '#fff', background: integ.enabled ? '#16a34a' : '#94a3b8' }}
                      >
                        {integ.enabled ? 'ON' : 'OFF'}
                      </button>
                      <button
                        type="button"
                        disabled={busy}
                        onClick={() => void removeOne(integ.id)}
                        data-testid={`crm-integration-delete-${integ.id}`}
                        style={{ padding: '4px 10px', borderRadius: 6, border: '1px solid #fecaca', background: '#fff', color: '#dc2626', cursor: busy ? 'default' : 'pointer' }}
                      >
                        {copy.deleteLabel}
                      </button>
                    </div>
                  </td>
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

function localizedCrmApiPath(locale: Locale, path: string): string {
  if (locale === 'ko') return path;
  return `${path}?locale=${encodeURIComponent(locale)}`;
}

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

'use client';

import { useState } from 'react';
import type {
  CrmAutomation,
  CrmAutomationActionKind,
  CrmAutomationTriggerKind,
} from '@/lib/builder/crm/automation-model';

interface Props {
  initialAutomations: CrmAutomation[];
}

const TRIGGER_LABEL: Record<CrmAutomationTriggerKind, string> = {
  'contact-created': '연락처 생성',
  'tag-added': '태그 추가',
  'form-submitted': '폼 제출',
};

const ACTION_LABEL: Record<CrmAutomationActionKind, string> = {
  'send-email-stub': '이메일 발송 (스텁)',
  'add-tag': '태그 추가',
  webhook: '웹훅 호출',
};

interface DraftState {
  name: string;
  triggerKind: CrmAutomationTriggerKind;
  matchTag: string;
  matchFormName: string;
  actionKind: CrmAutomationActionKind;
  templateId: string;
  webhookUrl: string;
  addTag: string;
}

const EMPTY: DraftState = {
  name: '',
  triggerKind: 'contact-created',
  matchTag: '',
  matchFormName: '',
  actionKind: 'send-email-stub',
  templateId: '',
  webhookUrl: '',
  addTag: '',
};

export default function AutomationsAdmin({ initialAutomations }: Props) {
  const [automations, setAutomations] = useState(initialAutomations);
  const [creating, setCreating] = useState(false);
  const [draft, setDraft] = useState<DraftState>(EMPTY);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  async function createOne() {
    if (!draft.name.trim()) {
      setError('자동화 이름을 입력해 주세요.');
      return;
    }
    setBusy(true);
    setError('');
    try {
      const res = await fetch('/api/builder/crm/automations', {
        method: 'POST',
        credentials: 'same-origin',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: draft.name.trim(),
          trigger: {
            kind: draft.triggerKind,
            matchTag: draft.matchTag.trim() || undefined,
            matchFormName: draft.matchFormName.trim() || undefined,
          },
          action: {
            kind: draft.actionKind,
            templateId: draft.templateId.trim() || undefined,
            webhookUrl: draft.webhookUrl.trim() || undefined,
            addTag: draft.addTag.trim() || undefined,
          },
          enabled: true,
        }),
      });
      if (!res.ok) {
        const payload = (await res.json().catch(() => ({}))) as { error?: string };
        setError(payload.error || 'Failed to create automation');
        return;
      }
      const data = (await res.json()) as { automation: CrmAutomation };
      setAutomations((prev) => [data.automation, ...prev]);
      setDraft(EMPTY);
      setCreating(false);
    } finally {
      setBusy(false);
    }
  }

  async function toggleEnabled(automation: CrmAutomation) {
    setBusy(true);
    setError('');
    try {
      const res = await fetch(`/api/builder/crm/automations/${automation.id}`, {
        method: 'PATCH',
        credentials: 'same-origin',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ enabled: !automation.enabled }),
      });
      if (!res.ok) {
        setError('업데이트에 실패했습니다.');
        return;
      }
      const data = (await res.json()) as { automation: CrmAutomation };
      setAutomations((prev) => prev.map((a) => (a.id === data.automation.id ? data.automation : a)));
    } finally {
      setBusy(false);
    }
  }

  async function removeOne(id: string) {
    if (typeof window !== 'undefined' && !window.confirm('이 자동화를 삭제하시겠습니까?')) return;
    setBusy(true);
    setError('');
    try {
      const res = await fetch(`/api/builder/crm/automations/${id}`, {
        method: 'DELETE',
        credentials: 'same-origin',
      });
      if (!res.ok) {
        setError('삭제에 실패했습니다.');
        return;
      }
      setAutomations((prev) => prev.filter((a) => a.id !== id));
    } finally {
      setBusy(false);
    }
  }

  return (
    <section
      data-testid="crm-automations-admin"
      style={{ padding: 16, display: 'flex', flexDirection: 'column', gap: 12 }}
    >
      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <button
          type="button"
          onClick={() => {
            setCreating((v) => !v);
            setDraft(EMPTY);
          }}
          data-testid="crm-automation-create-toggle"
          style={primaryButton}
        >
          + 자동화 추가
        </button>
      </div>

      {creating ? (
        <div style={cardStyle} data-testid="crm-automation-create-form">
          <input
            type="text"
            placeholder="이름 (예: 새 리드 환영)"
            value={draft.name}
            onChange={(e) => setDraft((p) => ({ ...p, name: e.target.value }))}
            data-testid="crm-automation-create-name"
            style={{ ...inputStyle, flexBasis: 240 }}
          />
          <select
            value={draft.triggerKind}
            onChange={(e) =>
              setDraft((p) => ({
                ...p,
                triggerKind: e.target.value as CrmAutomationTriggerKind,
              }))
            }
            data-testid="crm-automation-trigger-kind"
            style={inputStyle}
          >
            {(Object.keys(TRIGGER_LABEL) as CrmAutomationTriggerKind[]).map((k) => (
              <option key={k} value={k}>
                {TRIGGER_LABEL[k]}
              </option>
            ))}
          </select>
          <input
            type="text"
            placeholder="match tag"
            value={draft.matchTag}
            onChange={(e) => setDraft((p) => ({ ...p, matchTag: e.target.value }))}
            style={{ ...inputStyle, width: 140 }}
          />
          <input
            type="text"
            placeholder="match form name"
            value={draft.matchFormName}
            onChange={(e) => setDraft((p) => ({ ...p, matchFormName: e.target.value }))}
            style={{ ...inputStyle, width: 160 }}
          />
          <select
            value={draft.actionKind}
            onChange={(e) =>
              setDraft((p) => ({
                ...p,
                actionKind: e.target.value as CrmAutomationActionKind,
              }))
            }
            data-testid="crm-automation-action-kind"
            style={inputStyle}
          >
            {(Object.keys(ACTION_LABEL) as CrmAutomationActionKind[]).map((k) => (
              <option key={k} value={k}>
                {ACTION_LABEL[k]}
              </option>
            ))}
          </select>
          {draft.actionKind === 'send-email-stub' ? (
            <input
              type="text"
              placeholder="template id"
              value={draft.templateId}
              onChange={(e) => setDraft((p) => ({ ...p, templateId: e.target.value }))}
              style={inputStyle}
            />
          ) : null}
          {draft.actionKind === 'webhook' ? (
            <input
              type="url"
              placeholder="https://hook.example.com/..."
              value={draft.webhookUrl}
              onChange={(e) => setDraft((p) => ({ ...p, webhookUrl: e.target.value }))}
              style={{ ...inputStyle, flexBasis: 260 }}
            />
          ) : null}
          {draft.actionKind === 'add-tag' ? (
            <input
              type="text"
              placeholder="add tag"
              value={draft.addTag}
              onChange={(e) => setDraft((p) => ({ ...p, addTag: e.target.value }))}
              data-testid="crm-automation-add-tag"
              style={inputStyle}
            />
          ) : null}
          <button
            type="button"
            disabled={busy}
            onClick={createOne}
            data-testid="crm-automation-create-submit"
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
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13, minWidth: 720 }}>
          <thead>
            <tr style={{ background: '#f1f5f9', textAlign: 'left' }}>
              <th style={th}>이름</th>
              <th style={th}>트리거</th>
              <th style={th}>액션</th>
              <th style={th}>활성</th>
              <th style={th}>생성</th>
              <th style={th}>액션</th>
            </tr>
          </thead>
          <tbody>
            {automations.length === 0 ? (
              <tr>
                <td colSpan={6} style={{ padding: 24, textAlign: 'center', color: '#94a3b8' }}>
                  자동화가 없습니다.
                </td>
              </tr>
            ) : (
              automations.map((a) => (
                <tr key={a.id} data-testid={`crm-automation-row-${a.id}`} style={{ borderBottom: '1px solid #e2e8f0' }}>
                  <td style={td}>{a.name}</td>
                  <td style={td}>
                    {TRIGGER_LABEL[a.trigger.kind]}
                    {a.trigger.matchTag ? ` · tag=${a.trigger.matchTag}` : ''}
                    {a.trigger.matchFormName ? ` · form=${a.trigger.matchFormName}` : ''}
                  </td>
                  <td style={td}>
                    {ACTION_LABEL[a.action.kind]}
                    {a.action.templateId ? ` · ${a.action.templateId}` : ''}
                    {a.action.addTag ? ` · ${a.action.addTag}` : ''}
                  </td>
                  <td style={td}>
                    <button
                      type="button"
                      disabled={busy}
                      onClick={() => void toggleEnabled(a)}
                      data-testid={`crm-automation-toggle-${a.id}`}
                      style={{
                        ...ghostButton,
                        background: a.enabled ? '#16a34a' : '#94a3b8',
                        color: '#fff',
                        border: 0,
                      }}
                    >
                      {a.enabled ? 'ON' : 'OFF'}
                    </button>
                  </td>
                  <td style={td}>{new Date(a.createdAt).toLocaleDateString('ko-KR')}</td>
                  <td style={td}>
                    <button
                      type="button"
                      onClick={() => void removeOne(a.id)}
                      data-testid={`crm-automation-delete-${a.id}`}
                      style={{ ...ghostButton, color: '#dc2626' }}
                    >
                      삭제
                    </button>
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

const ghostButton: React.CSSProperties = {
  padding: '6px 10px',
  border: '1px solid #cbd5e1',
  background: '#fff',
  borderRadius: 6,
  fontSize: 12,
  cursor: 'pointer',
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
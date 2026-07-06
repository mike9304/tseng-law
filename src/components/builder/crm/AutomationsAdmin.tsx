'use client';

import { useState } from 'react';
import type {
  CrmAutomation,
  CrmAutomationActionKind,
  CrmAutomationTriggerKind,
} from '@/lib/builder/crm/automation-model';
import type { Locale } from '@/lib/locales';
import { formatDate } from '@/lib/builder/format/datetime';

interface Props {
  initialAutomations: CrmAutomation[];
  locale: Locale;
}

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

const AUTOMATIONS_COPY = {
  ko: {
    triggerLabel: {
      'contact-created': '연락처 생성',
      'tag-added': '태그 추가',
      'form-submitted': '폼 제출',
    },
    actionLabel: {
      'send-email-stub': '이메일 발송 (스텁)',
      'add-tag': '태그 추가',
      webhook: '웹훅 호출',
    },
    addAutomation: '+ 자동화 추가',
    namePlaceholder: '이름 (예: 새 리드 환영)',
    matchTagPlaceholder: '매칭 태그',
    matchFormNamePlaceholder: '매칭 폼 이름',
    templateIdPlaceholder: '템플릿 ID',
    addTagPlaceholder: '추가할 태그',
    save: '저장',
    delete: '삭제',
    nameRequired: '자동화 이름을 입력해 주세요.',
    createFailed: '자동화를 만들지 못했습니다.',
    updateFailed: '자동화를 업데이트하지 못했습니다.',
    deleteFailed: '자동화를 삭제하지 못했습니다.',
    deleteConfirm: '이 자동화를 삭제하시겠습니까?',
    headers: {
      name: '이름',
      trigger: '트리거',
      action: '액션',
      enabled: '활성',
      created: '생성',
      actions: '액션',
    },
    empty: '자동화가 없습니다.',
    tagDetail: (tag: string) => `태그=${tag}`,
    formDetail: (formName: string) => `폼=${formName}`,
    dateLocale: 'ko-KR',
  },
  'zh-hant': {
    triggerLabel: {
      'contact-created': '聯絡人建立',
      'tag-added': '標籤新增',
      'form-submitted': '表單送出',
    },
    actionLabel: {
      'send-email-stub': '寄送 Email（stub）',
      'add-tag': '新增標籤',
      webhook: '呼叫 Webhook',
    },
    addAutomation: '+ 新增自動化',
    namePlaceholder: '名稱（例如：歡迎新名單）',
    matchTagPlaceholder: '比對標籤',
    matchFormNamePlaceholder: '比對表單名稱',
    templateIdPlaceholder: '範本 ID',
    addTagPlaceholder: '新增標籤',
    save: '儲存',
    delete: '刪除',
    nameRequired: '請輸入自動化名稱。',
    createFailed: '無法建立自動化。',
    updateFailed: '無法更新自動化。',
    deleteFailed: '無法刪除自動化。',
    deleteConfirm: '要刪除此自動化嗎？',
    headers: {
      name: '名稱',
      trigger: '觸發條件',
      action: '動作',
      enabled: '啟用',
      created: '建立時間',
      actions: '操作',
    },
    empty: '沒有自動化。',
    tagDetail: (tag: string) => `標籤=${tag}`,
    formDetail: (formName: string) => `表單=${formName}`,
    dateLocale: 'zh-TW',
  },
  en: {
    triggerLabel: {
      'contact-created': 'Contact created',
      'tag-added': 'Tag added',
      'form-submitted': 'Form submitted',
    },
    actionLabel: {
      'send-email-stub': 'Send email (stub)',
      'add-tag': 'Add tag',
      webhook: 'Call webhook',
    },
    addAutomation: '+ Add automation',
    namePlaceholder: 'Name (example: Welcome new lead)',
    matchTagPlaceholder: 'Match tag',
    matchFormNamePlaceholder: 'Match form name',
    templateIdPlaceholder: 'Template ID',
    addTagPlaceholder: 'Add tag',
    save: 'Save',
    delete: 'Delete',
    nameRequired: 'Enter an automation name.',
    createFailed: 'Unable to create the automation.',
    updateFailed: 'Unable to update the automation.',
    deleteFailed: 'Unable to delete the automation.',
    deleteConfirm: 'Delete this automation?',
    headers: {
      name: 'Name',
      trigger: 'Trigger',
      action: 'Action',
      enabled: 'Enabled',
      created: 'Created',
      actions: 'Actions',
    },
    empty: 'No automations.',
    tagDetail: (tag: string) => `tag=${tag}`,
    formDetail: (formName: string) => `form=${formName}`,
    dateLocale: 'en-US',
  },
} as const satisfies Record<Locale, {
  triggerLabel: Record<CrmAutomationTriggerKind, string>;
  actionLabel: Record<CrmAutomationActionKind, string>;
  addAutomation: string;
  namePlaceholder: string;
  matchTagPlaceholder: string;
  matchFormNamePlaceholder: string;
  templateIdPlaceholder: string;
  addTagPlaceholder: string;
  save: string;
  delete: string;
  nameRequired: string;
  createFailed: string;
  updateFailed: string;
  deleteFailed: string;
  deleteConfirm: string;
  headers: Record<'name' | 'trigger' | 'action' | 'enabled' | 'created' | 'actions', string>;
  empty: string;
  tagDetail: (tag: string) => string;
  formDetail: (formName: string) => string;
  dateLocale: string;
}>;

export default function AutomationsAdmin({ initialAutomations, locale }: Props) {
  const copy = AUTOMATIONS_COPY[locale];
  const [automations, setAutomations] = useState(initialAutomations);
  const [creating, setCreating] = useState(false);
  const [draft, setDraft] = useState<DraftState>(EMPTY);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  async function createOne() {
    if (!draft.name.trim()) {
      setError(copy.nameRequired);
      return;
    }
    setBusy(true);
    setError('');
    try {
      const res = await fetch(localizedCrmApiPath(locale, '/api/builder/crm/automations'), {
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
        setError(payload.error || copy.createFailed);
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
      const res = await fetch(localizedCrmApiPath(locale, `/api/builder/crm/automations/${automation.id}`), {
        method: 'PATCH',
        credentials: 'same-origin',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ enabled: !automation.enabled }),
      });
      if (!res.ok) {
        const payload = (await res.json().catch(() => ({}))) as { error?: string };
        setError(payload.error || copy.updateFailed);
        return;
      }
      const data = (await res.json()) as { automation: CrmAutomation };
      setAutomations((prev) => prev.map((a) => (a.id === data.automation.id ? data.automation : a)));
    } finally {
      setBusy(false);
    }
  }

  async function removeOne(id: string) {
    if (typeof window !== 'undefined' && !window.confirm(copy.deleteConfirm)) return;
    setBusy(true);
    setError('');
    try {
      const res = await fetch(localizedCrmApiPath(locale, `/api/builder/crm/automations/${id}`), {
        method: 'DELETE',
        credentials: 'same-origin',
      });
      if (!res.ok) {
        const payload = (await res.json().catch(() => ({}))) as { error?: string };
        setError(payload.error || copy.deleteFailed);
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
          {copy.addAutomation}
        </button>
      </div>

      {creating ? (
        <div style={cardStyle} data-testid="crm-automation-create-form">
          <input
            type="text"
            placeholder={copy.namePlaceholder}
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
            {(Object.keys(copy.triggerLabel) as CrmAutomationTriggerKind[]).map((k) => (
              <option key={k} value={k}>
                {copy.triggerLabel[k]}
              </option>
            ))}
          </select>
          <input
            type="text"
            placeholder={copy.matchTagPlaceholder}
            value={draft.matchTag}
            onChange={(e) => setDraft((p) => ({ ...p, matchTag: e.target.value }))}
            style={{ ...inputStyle, width: 140 }}
          />
          <input
            type="text"
            placeholder={copy.matchFormNamePlaceholder}
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
            {(Object.keys(copy.actionLabel) as CrmAutomationActionKind[]).map((k) => (
              <option key={k} value={k}>
                {copy.actionLabel[k]}
              </option>
            ))}
          </select>
          {draft.actionKind === 'send-email-stub' ? (
            <input
              type="text"
              placeholder={copy.templateIdPlaceholder}
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
              placeholder={copy.addTagPlaceholder}
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
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13, minWidth: 720 }}>
          <thead>
            <tr style={{ background: '#f1f5f9', textAlign: 'left' }}>
              <th style={th}>{copy.headers.name}</th>
              <th style={th}>{copy.headers.trigger}</th>
              <th style={th}>{copy.headers.action}</th>
              <th style={th}>{copy.headers.enabled}</th>
              <th style={th}>{copy.headers.created}</th>
              <th style={th}>{copy.headers.actions}</th>
            </tr>
          </thead>
          <tbody>
            {automations.length === 0 ? (
              <tr>
                <td colSpan={6} style={{ padding: 24, textAlign: 'center', color: '#94a3b8' }}>
                  {copy.empty}
                </td>
              </tr>
            ) : (
              automations.map((a) => (
                <tr key={a.id} data-testid={`crm-automation-row-${a.id}`} style={{ borderBottom: '1px solid #e2e8f0' }}>
                  <td style={td}>{a.name}</td>
                  <td style={td}>
                    {copy.triggerLabel[a.trigger.kind]}
                    {a.trigger.matchTag ? ` · ${copy.tagDetail(a.trigger.matchTag)}` : ''}
                    {a.trigger.matchFormName ? ` · ${copy.formDetail(a.trigger.matchFormName)}` : ''}
                  </td>
                  <td style={td}>
                    {copy.actionLabel[a.action.kind]}
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
                  <td style={td}>{formatDate(a.createdAt, locale)}</td>
                  <td style={td}>
                    <button
                      type="button"
                      onClick={() => void removeOne(a.id)}
                      data-testid={`crm-automation-delete-${a.id}`}
                      style={{ ...ghostButton, color: '#dc2626' }}
                    >
                      {copy.delete}
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

'use client';

import { useCallback, useMemo, useState } from 'react';
import type { CrmContact, CrmContactSource } from '@/lib/builder/crm/contact-model';
import type { Locale } from '@/lib/locales';
import { normalizeLocale } from '@/lib/locales';
import { formatDateTime } from '@/lib/builder/format/datetime';

interface Props {
  initialContacts: CrmContact[];
  locale: Locale;
}

const SOURCE_COLOR: Record<CrmContactSource, string> = {
  form: '#0ea5e9',
  manual: '#0f172a',
  booking: '#10b981',
};

interface DraftState {
  email: string;
  name: string;
  phone: string;
  tags: string;
  notes: string;
}

const EMPTY_DRAFT: DraftState = { email: '', name: '', phone: '', tags: '', notes: '' };

const CONTACTS_COPY = {
  ko: {
    sourceLabel: { form: '폼', manual: '수동', booking: '예약' },
    searchPlaceholder: '이메일·이름·전화 검색',
    allTags: '전체 태그',
    allSources: '전체 출처',
    refresh: '조회',
    addContact: '+ 연락처 추가',
    namePlaceholder: '이름',
    phonePlaceholder: '전화',
    tagsPlaceholder: '태그 (쉼표 구분)',
    save: '저장',
    cancel: '취소',
    edit: '편집',
    delete: '삭제',
    emailRequired: '이메일을 입력해 주세요.',
    createFailed: '연락처를 만들지 못했습니다.',
    updateFailed: '연락처를 업데이트하지 못했습니다.',
    deleteFailed: '연락처를 삭제하지 못했습니다.',
    deleteConfirm: '이 연락처를 삭제하시겠습니까?',
    headers: {
      email: '이메일',
      name: '이름',
      phone: '전화',
      source: '출처',
      tags: '태그',
      lastActivity: '최근 활동',
      actions: '액션',
    },
    empty: '연락처가 없습니다.',
    dateLocale: 'ko-KR',
  },
  'zh-hant': {
    sourceLabel: { form: '表單', manual: '手動', booking: '預約' },
    searchPlaceholder: '搜尋 Email、姓名、電話',
    allTags: '所有標籤',
    allSources: '所有來源',
    refresh: '查詢',
    addContact: '+ 新增聯絡人',
    namePlaceholder: '姓名',
    phonePlaceholder: '電話',
    tagsPlaceholder: '標籤（以逗號分隔）',
    save: '儲存',
    cancel: '取消',
    edit: '編輯',
    delete: '刪除',
    emailRequired: '請輸入 Email。',
    createFailed: '無法建立聯絡人。',
    updateFailed: '無法更新聯絡人。',
    deleteFailed: '無法刪除聯絡人。',
    deleteConfirm: '要刪除此聯絡人嗎？',
    headers: {
      email: 'Email',
      name: '姓名',
      phone: '電話',
      source: '來源',
      tags: '標籤',
      lastActivity: '最近活動',
      actions: '操作',
    },
    empty: '沒有聯絡人。',
    dateLocale: 'zh-TW',
  },
  en: {
    sourceLabel: { form: 'Form', manual: 'Manual', booking: 'Booking' },
    searchPlaceholder: 'Search email, name, phone',
    allTags: 'All tags',
    allSources: 'All sources',
    refresh: 'Refresh',
    addContact: '+ Add contact',
    namePlaceholder: 'Name',
    phonePlaceholder: 'Phone',
    tagsPlaceholder: 'Tags (comma separated)',
    save: 'Save',
    cancel: 'Cancel',
    edit: 'Edit',
    delete: 'Delete',
    emailRequired: 'Enter an email address.',
    createFailed: 'Unable to create the contact.',
    updateFailed: 'Unable to update the contact.',
    deleteFailed: 'Unable to delete the contact.',
    deleteConfirm: 'Delete this contact?',
    headers: {
      email: 'Email',
      name: 'Name',
      phone: 'Phone',
      source: 'Source',
      tags: 'Tags',
      lastActivity: 'Last activity',
      actions: 'Actions',
    },
    empty: 'No contacts.',
    dateLocale: 'en-US',
  },
} as const satisfies Record<Locale, {
  sourceLabel: Record<CrmContactSource, string>;
  searchPlaceholder: string;
  allTags: string;
  allSources: string;
  refresh: string;
  addContact: string;
  namePlaceholder: string;
  phonePlaceholder: string;
  tagsPlaceholder: string;
  save: string;
  cancel: string;
  edit: string;
  delete: string;
  emailRequired: string;
  createFailed: string;
  updateFailed: string;
  deleteFailed: string;
  deleteConfirm: string;
  headers: Record<'email' | 'name' | 'phone' | 'source' | 'tags' | 'lastActivity' | 'actions', string>;
  empty: string;
  dateLocale: string;
}>;

export default function ContactsAdmin({ initialContacts, locale }: Props) {
  const copy = CONTACTS_COPY[locale];
  const [contacts, setContacts] = useState(initialContacts);
  const [search, setSearch] = useState('');
  const [tagFilter, setTagFilter] = useState('');
  const [sourceFilter, setSourceFilter] = useState<CrmContactSource | ''>('');
  const [creating, setCreating] = useState(false);
  const [draft, setDraft] = useState<DraftState>(EMPTY_DRAFT);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editDraft, setEditDraft] = useState<DraftState>(EMPTY_DRAFT);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  const visible = useMemo(
    () =>
      contacts.filter((c) => {
        if (tagFilter && !c.tags.includes(tagFilter)) return false;
        if (sourceFilter && c.source !== sourceFilter) return false;
        if (search.trim()) {
          const needle = search.trim().toLowerCase();
          const haystack = [c.email, c.name ?? '', c.phone ?? ''].join(' ').toLowerCase();
          if (!haystack.includes(needle)) return false;
        }
        return true;
      }),
    [contacts, tagFilter, sourceFilter, search],
  );

  const allTags = useMemo(() => {
    const set = new Set<string>();
    contacts.forEach((c) => c.tags.forEach((t) => set.add(t)));
    return Array.from(set).sort();
  }, [contacts]);

  const refresh = useCallback(async () => {
    const params = new URLSearchParams();
    if (locale !== 'ko') params.set('locale', locale);
    if (tagFilter) params.set('tag', tagFilter);
    if (sourceFilter) params.set('source', sourceFilter);
    if (search.trim()) params.set('q', search.trim());
    const res = await fetch(`/api/builder/crm/contacts?${params.toString()}`, {
      credentials: 'same-origin',
    });
    if (res.ok) {
      const payload = (await res.json()) as { contacts: CrmContact[] };
      setContacts(payload.contacts);
    }
  }, [locale, tagFilter, sourceFilter, search]);

  async function createOne() {
    if (!draft.email.trim()) {
      setError(copy.emailRequired);
      return;
    }
    setBusy(true);
    setError('');
    try {
      const res = await fetch(localizedCrmApiPath(locale, '/api/builder/crm/contacts'), {
        method: 'POST',
        credentials: 'same-origin',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: draft.email.trim(),
          name: draft.name.trim() || undefined,
          phone: draft.phone.trim() || undefined,
          tags: draft.tags
            .split(',')
            .map((t) => t.trim())
            .filter(Boolean),
          notes: draft.notes.trim() || undefined,
          source: 'manual',
        }),
      });
      if (!res.ok) {
        const payload = (await res.json().catch(() => ({}))) as { error?: string };
        setError(payload.error || copy.createFailed);
        return;
      }
      const data = (await res.json()) as { contact: CrmContact };
      setContacts((prev) => {
        const without = prev.filter((c) => c.id !== data.contact.id);
        return [data.contact, ...without];
      });
      setDraft(EMPTY_DRAFT);
      setCreating(false);
    } finally {
      setBusy(false);
    }
  }

  function beginEdit(contact: CrmContact) {
    setEditingId(contact.id);
    setEditDraft({
      email: contact.email,
      name: contact.name ?? '',
      phone: contact.phone ?? '',
      tags: contact.tags.join(', '),
      notes: contact.notes ?? '',
    });
  }

  async function saveEdit() {
    if (!editingId) return;
    setBusy(true);
    setError('');
    try {
      const res = await fetch(localizedCrmApiPath(locale, `/api/builder/crm/contacts/${editingId}`), {
        method: 'PATCH',
        credentials: 'same-origin',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: editDraft.email.trim(),
          name: editDraft.name.trim() || undefined,
          phone: editDraft.phone.trim() || undefined,
          tags: editDraft.tags
            .split(',')
            .map((t) => t.trim())
            .filter(Boolean),
          notes: editDraft.notes.trim() || undefined,
        }),
      });
      if (!res.ok) {
        const payload = (await res.json().catch(() => ({}))) as { error?: string };
        setError(payload.error || copy.updateFailed);
        return;
      }
      const data = (await res.json()) as { contact: CrmContact };
      setContacts((prev) => prev.map((c) => (c.id === data.contact.id ? data.contact : c)));
      setEditingId(null);
    } finally {
      setBusy(false);
    }
  }

  async function removeContact(id: string) {
    if (typeof window !== 'undefined' && !window.confirm(copy.deleteConfirm)) return;
    setBusy(true);
    setError('');
    try {
      const res = await fetch(localizedCrmApiPath(locale, `/api/builder/crm/contacts/${id}`), {
        method: 'DELETE',
        credentials: 'same-origin',
      });
      if (!res.ok) {
        const payload = (await res.json().catch(() => ({}))) as { error?: string };
        setError(payload.error || copy.deleteFailed);
        return;
      }
      setContacts((prev) => prev.filter((c) => c.id !== id));
    } finally {
      setBusy(false);
    }
  }

  return (
    <section
      data-testid="crm-contacts-admin"
      style={{ padding: 16, display: 'flex', flexDirection: 'column', gap: 12 }}
    >
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>
        <input
          type="search"
          placeholder={copy.searchPlaceholder}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          data-testid="crm-contacts-search"
          style={inputStyle}
        />
        <select
          value={tagFilter}
          onChange={(e) => setTagFilter(e.target.value)}
          data-testid="crm-contacts-tag-filter"
          style={inputStyle}
        >
          <option value="">{copy.allTags}</option>
          {allTags.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>
        <select
          value={sourceFilter}
          onChange={(e) => setSourceFilter(e.target.value as CrmContactSource | '')}
          style={inputStyle}
        >
          <option value="">{copy.allSources}</option>
          {(Object.keys(copy.sourceLabel) as CrmContactSource[]).map((s) => (
            <option key={s} value={s}>
              {copy.sourceLabel[s]}
            </option>
          ))}
        </select>
        <button type="button" onClick={() => void refresh()} style={ghostButton} disabled={busy}>
          {copy.refresh}
        </button>
        <button
          type="button"
          onClick={() => {
            setCreating((v) => !v);
            setDraft(EMPTY_DRAFT);
          }}
          data-testid="crm-contact-create-toggle"
          style={{ ...primaryButton, marginLeft: 'auto' }}
        >
          {copy.addContact}
        </button>
      </div>

      {creating ? (
        <div style={cardStyle} data-testid="crm-contact-create-form">
          <input
            type="email"
            placeholder="email@example.com"
            value={draft.email}
            onChange={(e) => setDraft((p) => ({ ...p, email: e.target.value }))}
            data-testid="crm-contact-create-email"
            style={inputStyle}
          />
          <input
            type="text"
            placeholder={copy.namePlaceholder}
            value={draft.name}
            onChange={(e) => setDraft((p) => ({ ...p, name: e.target.value }))}
            data-testid="crm-contact-create-name"
            style={inputStyle}
          />
          <input
            type="tel"
            placeholder={copy.phonePlaceholder}
            value={draft.phone}
            onChange={(e) => setDraft((p) => ({ ...p, phone: e.target.value }))}
            style={inputStyle}
          />
          <input
            type="text"
            placeholder={copy.tagsPlaceholder}
            value={draft.tags}
            onChange={(e) => setDraft((p) => ({ ...p, tags: e.target.value }))}
            data-testid="crm-contact-create-tags"
            style={inputStyle}
          />
          <button
            type="button"
            disabled={busy}
            onClick={createOne}
            data-testid="crm-contact-create-submit"
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
              <th style={th}>{copy.headers.email}</th>
              <th style={th}>{copy.headers.name}</th>
              <th style={th}>{copy.headers.phone}</th>
              <th style={th}>{copy.headers.source}</th>
              <th style={th}>{copy.headers.tags}</th>
              <th style={th}>{copy.headers.lastActivity}</th>
              <th style={th}>{copy.headers.actions}</th>
            </tr>
          </thead>
          <tbody>
            {visible.length === 0 ? (
              <tr>
                <td colSpan={7} style={{ padding: 24, textAlign: 'center', color: '#94a3b8' }}>
                  {copy.empty}
                </td>
              </tr>
            ) : (
              visible.map((c) => {
                const isEditing = editingId === c.id;
                return (
                  <tr
                    key={c.id}
                    data-testid={`crm-contact-row-${c.email}`}
                    style={{ borderBottom: '1px solid #e2e8f0', verticalAlign: 'top' }}
                  >
                    {isEditing ? (
                      <>
                        <td style={td}>
                          <input
                            type="email"
                            value={editDraft.email}
                            onChange={(e) => setEditDraft((p) => ({ ...p, email: e.target.value }))}
                            style={inputStyle}
                          />
                        </td>
                        <td style={td}>
                          <input
                            type="text"
                            value={editDraft.name}
                            onChange={(e) => setEditDraft((p) => ({ ...p, name: e.target.value }))}
                            style={inputStyle}
                          />
                        </td>
                        <td style={td}>
                          <input
                            type="tel"
                            value={editDraft.phone}
                            onChange={(e) => setEditDraft((p) => ({ ...p, phone: e.target.value }))}
                            style={inputStyle}
                          />
                        </td>
                        <td style={td}>
                          <SourceChip source={c.source} label={copy.sourceLabel[c.source]} />
                        </td>
                        <td style={td}>
                          <input
                            type="text"
                            value={editDraft.tags}
                            onChange={(e) => setEditDraft((p) => ({ ...p, tags: e.target.value }))}
                            data-testid={`crm-contact-edit-tags-${c.email}`}
                            style={inputStyle}
                          />
                        </td>
                        <td style={td}>{formatRelative(c.lastActivityAt, locale)}</td>
                        <td style={td}>
                          <button
                            type="button"
                            onClick={saveEdit}
                            disabled={busy}
                            data-testid={`crm-contact-save-${c.email}`}
                            style={primaryButton}
                          >
                            {copy.save}
                          </button>
                          <button
                            type="button"
                            onClick={() => setEditingId(null)}
                            style={{ ...ghostButton, marginLeft: 4 }}
                          >
                            {copy.cancel}
                          </button>
                        </td>
                      </>
                    ) : (
                      <>
                        <td style={td}>{c.email}</td>
                        <td style={td}>{c.name ?? '—'}</td>
                        <td style={td}>{c.phone ?? '—'}</td>
                        <td style={td}>
                          <SourceChip source={c.source} label={copy.sourceLabel[c.source]} />
                        </td>
                        <td style={td}>{c.tags.join(', ') || '—'}</td>
                        <td style={td}>{formatRelative(c.lastActivityAt, locale)}</td>
                        <td style={td}>
                          <button
                            type="button"
                            onClick={() => beginEdit(c)}
                            data-testid={`crm-contact-edit-${c.email}`}
                            style={ghostButton}
                          >
                            {copy.edit}
                          </button>
                          <button
                            type="button"
                            onClick={() => void removeContact(c.id)}
                            data-testid={`crm-contact-delete-${c.email}`}
                            style={{ ...ghostButton, color: '#dc2626', marginLeft: 4 }}
                          >
                            {copy.delete}
                          </button>
                        </td>
                      </>
                    )}
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}

function SourceChip({ source, label }: { source: CrmContactSource; label: string }) {
  return (
    <span
      style={{
        display: 'inline-block',
        padding: '2px 8px',
        borderRadius: 999,
        background: `${SOURCE_COLOR[source]}22`,
        color: SOURCE_COLOR[source],
        fontWeight: 700,
        fontSize: 11,
      }}
    >
      {label}
    </span>
  );
}

function formatRelative(iso: string, locale: string): string {
  return formatDateTime(iso, normalizeLocale(locale));
}

function localizedCrmApiPath(locale: Locale, path: string): string {
  if (locale === 'ko') return path;
  return `${path}?locale=${encodeURIComponent(locale)}`;
}

const inputStyle: React.CSSProperties = {
  padding: '6px 10px',
  border: '1px solid #cbd5e1',
  borderRadius: 6,
  fontSize: 13,
  minWidth: 0,
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
  padding: '6px 12px',
  border: '1px solid #cbd5e1',
  background: '#fff',
  borderRadius: 6,
  fontSize: 13,
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
};

const th: React.CSSProperties = { padding: '8px 12px', whiteSpace: 'nowrap' };
const td: React.CSSProperties = { padding: '8px 12px' };

'use client';

import { useCallback, useMemo, useState } from 'react';
import type { CrmContact, CrmContactSource } from '@/lib/builder/crm/contact-model';

interface Props {
  initialContacts: CrmContact[];
}

const SOURCE_LABEL: Record<CrmContactSource, string> = {
  form: '폼',
  manual: '수동',
  booking: '예약',
};

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

export default function ContactsAdmin({ initialContacts }: Props) {
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
  }, [tagFilter, sourceFilter, search]);

  async function createOne() {
    if (!draft.email.trim()) {
      setError('이메일을 입력해 주세요.');
      return;
    }
    setBusy(true);
    setError('');
    try {
      const res = await fetch('/api/builder/crm/contacts', {
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
        setError(payload.error || 'Failed to create contact');
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
      const res = await fetch(`/api/builder/crm/contacts/${editingId}`, {
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
        setError(payload.error || 'Failed to update contact');
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
    if (typeof window !== 'undefined' && !window.confirm('이 연락처를 삭제하시겠습니까?')) return;
    setBusy(true);
    setError('');
    try {
      const res = await fetch(`/api/builder/crm/contacts/${id}`, {
        method: 'DELETE',
        credentials: 'same-origin',
      });
      if (!res.ok) {
        setError('삭제에 실패했습니다.');
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
          placeholder="이메일·이름·전화 검색"
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
          <option value="">전체 태그</option>
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
          <option value="">전체 출처</option>
          {(Object.keys(SOURCE_LABEL) as CrmContactSource[]).map((s) => (
            <option key={s} value={s}>
              {SOURCE_LABEL[s]}
            </option>
          ))}
        </select>
        <button type="button" onClick={() => void refresh()} style={ghostButton} disabled={busy}>
          조회
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
          + 연락처 추가
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
            placeholder="이름"
            value={draft.name}
            onChange={(e) => setDraft((p) => ({ ...p, name: e.target.value }))}
            data-testid="crm-contact-create-name"
            style={inputStyle}
          />
          <input
            type="tel"
            placeholder="전화"
            value={draft.phone}
            onChange={(e) => setDraft((p) => ({ ...p, phone: e.target.value }))}
            style={inputStyle}
          />
          <input
            type="text"
            placeholder="태그 (쉼표 구분)"
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
              <th style={th}>이메일</th>
              <th style={th}>이름</th>
              <th style={th}>전화</th>
              <th style={th}>출처</th>
              <th style={th}>태그</th>
              <th style={th}>최근 활동</th>
              <th style={th}>액션</th>
            </tr>
          </thead>
          <tbody>
            {visible.length === 0 ? (
              <tr>
                <td colSpan={7} style={{ padding: 24, textAlign: 'center', color: '#94a3b8' }}>
                  연락처가 없습니다.
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
                          <SourceChip source={c.source} />
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
                        <td style={td}>{formatRelative(c.lastActivityAt)}</td>
                        <td style={td}>
                          <button
                            type="button"
                            onClick={saveEdit}
                            disabled={busy}
                            data-testid={`crm-contact-save-${c.email}`}
                            style={primaryButton}
                          >
                            저장
                          </button>
                          <button
                            type="button"
                            onClick={() => setEditingId(null)}
                            style={{ ...ghostButton, marginLeft: 4 }}
                          >
                            취소
                          </button>
                        </td>
                      </>
                    ) : (
                      <>
                        <td style={td}>{c.email}</td>
                        <td style={td}>{c.name ?? '—'}</td>
                        <td style={td}>{c.phone ?? '—'}</td>
                        <td style={td}>
                          <SourceChip source={c.source} />
                        </td>
                        <td style={td}>{c.tags.join(', ') || '—'}</td>
                        <td style={td}>{formatRelative(c.lastActivityAt)}</td>
                        <td style={td}>
                          <button
                            type="button"
                            onClick={() => beginEdit(c)}
                            data-testid={`crm-contact-edit-${c.email}`}
                            style={ghostButton}
                          >
                            편집
                          </button>
                          <button
                            type="button"
                            onClick={() => void removeContact(c.id)}
                            data-testid={`crm-contact-delete-${c.email}`}
                            style={{ ...ghostButton, color: '#dc2626', marginLeft: 4 }}
                          >
                            삭제
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

function SourceChip({ source }: { source: CrmContactSource }) {
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
      {SOURCE_LABEL[source]}
    </span>
  );
}

function formatRelative(iso: string): string {
  try {
    return new Date(iso).toLocaleString('ko-KR');
  } catch {
    return iso;
  }
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
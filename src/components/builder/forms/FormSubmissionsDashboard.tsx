'use client';

import Link from 'next/link';
import { useState, useMemo } from 'react';
import type { Locale } from '@/lib/locales';
import type { FormSubmission } from '@/lib/builder/forms/form-engine';
import { safeHref } from '@/lib/builder/links';
import { getFormsCopy } from './forms-copy';

type DateRange = 'all' | '7d' | '30d';
type ReadFilter = 'all' | 'read' | 'unread';

interface Props {
  initialSubmissions: FormSubmission[];
  formId: string;
  locale: Locale;
}

export default function FormSubmissionsDashboard({ initialSubmissions, formId, locale }: Props) {
  const copy = getFormsCopy(locale);
  const [submissions, setSubmissions] = useState<FormSubmission[]>(initialSubmissions);
  const [selected, setSelected] = useState<FormSubmission | null>(null);
  const [loading, setLoading] = useState(false);

  // Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [dateRange, setDateRange] = useState<DateRange>('all');
  const [readFilter, setReadFilter] = useState<ReadFilter>('all');

  // Unique categories from all submissions
  const categories = useMemo(() => {
    const cats = new Set<string>();
    for (const sub of submissions) {
      const cat = String(sub.data?.category || '');
      if (cat && cat !== '-') cats.add(cat);
    }
    return Array.from(cats).sort();
  }, [submissions]);

  // Filtered submissions
  const filteredSubmissions = useMemo(() => {
    const now = Date.now();
    const query = searchQuery.toLowerCase().trim();

    return submissions.filter((sub) => {
      // Search filter: name, email, message
      if (query) {
        const name = String(sub.data?.name || '').toLowerCase();
        const email = String(sub.data?.email || '').toLowerCase();
        const message = String(sub.data?.message || '').toLowerCase();
        if (!name.includes(query) && !email.includes(query) && !message.includes(query)) {
          return false;
        }
      }

      // Category filter
      if (categoryFilter !== 'all') {
        if (String(sub.data?.category || '') !== categoryFilter) return false;
      }

      // Date range filter
      if (dateRange !== 'all') {
        const submittedAt = new Date(sub.submittedAt).getTime();
        const days = dateRange === '7d' ? 7 : 30;
        if (now - submittedAt > days * 24 * 60 * 60 * 1000) return false;
      }

      // Read/unread filter
      if (readFilter === 'read' && !sub.read) return false;
      if (readFilter === 'unread' && sub.read) return false;

      return true;
    });
  }, [submissions, searchQuery, categoryFilter, dateRange, readFilter]);

  const unreadCount = submissions.filter((s) => !s.read).length;

  async function markAsRead(submission: FormSubmission) {
    setLoading(true);
    try {
      const res = await fetch('/api/builder/forms/submissions', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(submission),
      });
      if (res.ok) {
        setSubmissions((prev) =>
          prev.map((s) => (s.submissionId === submission.submissionId ? { ...s, read: true } : s))
        );
        setSelected((prev) => (prev?.submissionId === submission.submissionId ? { ...prev, read: true } : prev));
      }
    } catch {
      /* swallow */
    } finally {
      setLoading(false);
    }
  }

  async function refreshList() {
    setLoading(true);
    try {
      const res = await fetch(`/api/builder/forms/submissions?formId=${encodeURIComponent(formId)}`);
      if (res.ok) {
        const data = await res.json();
        setSubmissions(data.submissions || []);
      }
    } catch {
      /* swallow */
    } finally {
      setLoading(false);
    }
  }

  function truncate(text: string, maxLen: number): string {
    if (!text) return '';
    return text.length > maxLen ? text.slice(0, maxLen) + '...' : text;
  }

  function formatDate(iso: string): string {
    try {
      return new Date(iso).toLocaleString('ko-KR', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return iso;
    }
  }

  return (
    <div style={{ padding: '2rem', fontFamily: 'system-ui, sans-serif', color: '#1f2937' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
        <div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 700, margin: 0 }}>
            {copy.dashboard.title}
          </h1>
          <p style={{ fontSize: '0.875rem', color: '#6b7280', margin: '0.25rem 0 0' }}>
            {copy.dashboard.summary(formId, submissions.length, unreadCount)}
          </p>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <Link
            href={`/${locale}/admin-builder/forms/builder/${encodeURIComponent(formId)}`}
            style={{
              padding: '0.5rem 1rem',
              fontSize: '0.85rem',
              background: '#fff',
              color: '#0f172a',
              border: '1px solid #cbd5e1',
              borderRadius: 6,
              textDecoration: 'none',
              fontWeight: 600,
            }}
          >
            {copy.dashboard.openBuilder}
          </Link>
          <button
            onClick={refreshList}
            disabled={loading}
            style={{
              padding: '0.5rem 1rem',
              fontSize: '0.85rem',
              background: '#123b63',
              color: '#fff',
              border: 'none',
              borderRadius: 6,
              cursor: loading ? 'wait' : 'pointer',
              opacity: loading ? 0.6 : 1,
            }}
          >
            {copy.dashboard.refresh}
          </button>
        </div>
      </div>

      {/* Filter Bar */}
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: '0.75rem',
        alignItems: 'center',
        marginBottom: '1rem',
        padding: '0.75rem 1rem',
        background: '#f9fafb',
        borderRadius: 8,
        border: '1px solid #e5e7eb',
      }}>
        <input
          type="text"
          placeholder={copy.dashboard.searchPlaceholder}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{
            flex: '1 1 200px',
            padding: '0.5rem 0.75rem',
            fontSize: '0.85rem',
            border: '1px solid #d1d5db',
            borderRadius: 6,
            outline: 'none',
            minWidth: 160,
          }}
        />
        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          style={{
            padding: '0.5rem 0.75rem',
            fontSize: '0.85rem',
            border: '1px solid #d1d5db',
            borderRadius: 6,
            background: '#fff',
            cursor: 'pointer',
          }}
        >
          <option value="all">{copy.dashboard.categoryAll}</option>
          {categories.map((cat) => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
        <select
          value={dateRange}
          onChange={(e) => setDateRange(e.target.value as DateRange)}
          style={{
            padding: '0.5rem 0.75rem',
            fontSize: '0.85rem',
            border: '1px solid #d1d5db',
            borderRadius: 6,
            background: '#fff',
            cursor: 'pointer',
          }}
        >
          <option value="all">{copy.dashboard.dateAll}</option>
          <option value="7d">{copy.dashboard.date7d}</option>
          <option value="30d">{copy.dashboard.date30d}</option>
        </select>
        <select
          value={readFilter}
          onChange={(e) => setReadFilter(e.target.value as ReadFilter)}
          style={{
            padding: '0.5rem 0.75rem',
            fontSize: '0.85rem',
            border: '1px solid #d1d5db',
            borderRadius: 6,
            background: '#fff',
            cursor: 'pointer',
          }}
        >
          <option value="all">{copy.dashboard.statusAll}</option>
          <option value="unread">{copy.dashboard.unreadOnly}</option>
          <option value="read">{copy.dashboard.readOnly}</option>
        </select>
        {(searchQuery || categoryFilter !== 'all' || dateRange !== 'all' || readFilter !== 'all') && (
          <span style={{ fontSize: '0.8rem', color: '#6b7280' }}>
            {copy.dashboard.shown(filteredSubmissions.length, submissions.length)}
          </span>
        )}
      </div>

      {/* Table */}
      {filteredSubmissions.length === 0 ? (
        <div style={{
          textAlign: 'center',
          padding: '3rem 1rem',
          background: '#f9fafb',
          borderRadius: 8,
          color: '#9ca3af',
          }}>
          {submissions.length === 0 ? copy.dashboard.noSubmissionsYet : copy.dashboard.noMatchingSubmissions}
        </div>
      ) : (
        <div style={{ overflowX: 'auto' }}>
          <table style={{
            width: '100%',
            borderCollapse: 'collapse',
            fontSize: '0.875rem',
            background: '#fff',
            borderRadius: 8,
            overflow: 'hidden',
            boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
          }}>
            <thead>
              <tr style={{ background: '#f3f4f6', textAlign: 'left' }}>
                <th style={thStyle}>{copy.dashboard.table.status}</th>
                <th style={thStyle}>{copy.dashboard.table.date}</th>
                <th style={thStyle}>{copy.dashboard.table.name}</th>
                <th style={thStyle}>{copy.dashboard.table.email}</th>
                <th style={thStyle}>{copy.dashboard.table.category}</th>
                <th style={thStyle}>{copy.dashboard.table.message}</th>
              </tr>
            </thead>
            <tbody>
              {filteredSubmissions.map((sub) => (
                <tr
                  key={sub.submissionId}
                  onClick={() => setSelected(sub)}
                  style={{
                    cursor: 'pointer',
                    background: sub.read ? '#fff' : '#eff6ff',
                    borderBottom: '1px solid #f3f4f6',
                    fontWeight: sub.read ? 400 : 600,
                  }}
                >
                  <td style={tdStyle}>
                    <span style={{
                      display: 'inline-block',
                      width: 8,
                      height: 8,
                      borderRadius: '50%',
                      background: sub.read ? '#d1d5db' : '#3b82f6',
                    }} />
                  </td>
                  <td style={tdStyle}>{formatDate(sub.submittedAt)}</td>
                  <td style={tdStyle}>{String(sub.data?.name || '-')}</td>
                  <td style={tdStyle}>{String(sub.data?.email || '-')}</td>
                  <td style={tdStyle}>
                    <span style={{
                      display: 'inline-block',
                      padding: '2px 8px',
                      borderRadius: 4,
                      background: '#e5e7eb',
                      fontSize: '0.75rem',
                    }}>
                      {String(sub.data?.category || '-')}
                    </span>
                  </td>
                  <td style={tdStyle}>{truncate(String(sub.data?.message || ''), 50)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Detail Modal */}
      {selected && (
        <div
          onClick={() => setSelected(null)}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.4)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999,
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              background: '#fff',
              borderRadius: 12,
              padding: '2rem',
              maxWidth: 600,
              width: '90vw',
              maxHeight: '80vh',
              overflowY: 'auto',
              boxShadow: '0 20px 60px rgba(0,0,0,0.2)',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h2 style={{ fontSize: '1.2rem', fontWeight: 700, margin: 0 }}>{copy.dashboard.detail.title}</h2>
              <button
                onClick={() => setSelected(null)}
                aria-label={copy.dashboard.detail.closeLabel}
                style={{
                  background: 'none',
                  border: 'none',
                  fontSize: '1.5rem',
                  cursor: 'pointer',
                  color: '#6b7280',
                  lineHeight: 1,
                }}
              >
                &times;
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.9rem' }}>
              <DetailRow label={copy.dashboard.detail.submissionId} value={selected.submissionId} />
              <DetailRow label={copy.dashboard.detail.form} value={selected.formId} />
              <DetailRow label={copy.dashboard.detail.submitted} value={formatDate(selected.submittedAt)} />
              <DetailRow
                label={copy.dashboard.detail.status}
                value={selected.read ? copy.dashboard.detail.read : copy.dashboard.detail.unread}
              />
              {Object.entries(selected.data).map(([key, value]) => (
                <DetailRow key={key} label={key} value={String(value ?? '')} />
              ))}
              {selected.ip && <DetailRow label={copy.dashboard.detail.ip} value={selected.ip} />}
              {selected.userAgent && <DetailRow label={copy.dashboard.detail.userAgent} value={selected.userAgent} />}
              {selected.files && selected.files.length > 0 && (
                <div>
                  <strong style={{ color: '#374151' }}>{locale === 'ko' ? '파일' : locale === 'zh-hant' ? '檔案' : 'Files'}:</strong>
                  <ul style={{ margin: '0.25rem 0 0', paddingLeft: '1.25rem' }}>
                    {selected.files.map((f) => {
                      const fileHref = safeHref(f.url);
                      return (
                        <li key={f.url ?? `${f.name}-${f.size}`}>
                          {fileHref ? (
                            <a href={fileHref} target="_blank" rel="noopener noreferrer" style={{ color: '#2563eb' }}>
                              {f.name} ({Math.round(f.size / 1024)}KB)
                            </a>
                          ) : (
                            <span style={{ color: '#475569' }}>
                              {f.name} ({Math.round(f.size / 1024)}KB)
                            </span>
                          )}
                        </li>
                      );
                    })}
                  </ul>
                </div>
              )}
            </div>

            {!selected.read && (
              <button
                onClick={() => markAsRead(selected)}
                disabled={loading}
                style={{
                  marginTop: '1.5rem',
                  padding: '0.6rem 1.5rem',
                  background: '#123b63',
                  color: '#fff',
                  border: 'none',
                  borderRadius: 6,
                  cursor: loading ? 'wait' : 'pointer',
                  fontSize: '0.9rem',
                  fontWeight: 600,
                  opacity: loading ? 0.6 : 1,
                }}
              >
                {copy.dashboard.detail.markAsRead}
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div style={{ borderBottom: '1px solid #f3f4f6', paddingBottom: '0.5rem' }}>
      <span style={{ fontWeight: 600, color: '#374151', display: 'block', marginBottom: '0.15rem', fontSize: '0.8rem', textTransform: 'uppercase' }}>
        {label}
      </span>
      <span style={{ color: '#1f2937', whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>{value}</span>
    </div>
  );
}

const thStyle: React.CSSProperties = {
  padding: '0.75rem 1rem',
  fontWeight: 600,
  fontSize: '0.8rem',
  textTransform: 'uppercase',
  color: '#374151',
  letterSpacing: '0.02em',
};

const tdStyle: React.CSSProperties = {
  padding: '0.75rem 1rem',
  verticalAlign: 'middle',
};

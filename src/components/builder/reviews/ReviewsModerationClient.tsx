'use client';

import { useMemo, useState, type CSSProperties } from 'react';
import type { Locale } from '@/lib/locales';
import type { Review } from '@/lib/reviews/storage';
import {
  reviewsModerationCopy,
  type ReviewStatusFilter,
} from './reviews-moderation-copy';

export default function ReviewsModerationClient({
  initialReviews,
  locale,
}: {
  initialReviews: Review[];
  locale: Locale;
}) {
  const copy = reviewsModerationCopy[locale];
  const [reviews, setReviews] = useState(initialReviews);
  const [filter, setFilter] = useState<ReviewStatusFilter>('all');
  const [query, setQuery] = useState('');
  const [busyId, setBusyId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const counts = useMemo(() => ({
    all: reviews.length,
    pending: reviews.filter((review) => review.status === 'pending').length,
    approved: reviews.filter((review) => review.status === 'approved').length,
  }), [reviews]);

  const filteredReviews = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return reviews.filter((review) => {
      if (filter !== 'all' && review.status !== filter) return false;
      if (!needle) return true;
      return [review.nickname, review.service, review.content]
        .join(' ')
        .toLowerCase()
        .includes(needle);
    });
  }, [filter, query, reviews]);

  async function updateStatus(id: string, status: Review['status']) {
    setBusyId(id);
    setError(null);
    try {
      const response = await fetch('/api/builder/reviews', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'same-origin',
        body: JSON.stringify({ id, status }),
      });
      const payload = (await response.json().catch(() => null)) as { review?: Review; error?: string } | null;
      if (!response.ok || !payload?.review) throw new Error(payload?.error ?? copy.error);
      const updatedReview = payload.review;
      setReviews((current) => current.map((review) => (review.id === id ? updatedReview : review)));
    } catch {
      setError(copy.error);
    } finally {
      setBusyId(null);
    }
  }

  async function deleteReview(id: string) {
    if (!window.confirm(copy.deleteConfirm)) return;
    setBusyId(id);
    setError(null);
    try {
      const response = await fetch('/api/builder/reviews', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'same-origin',
        body: JSON.stringify({ id }),
      });
      if (!response.ok) throw new Error(copy.error);
      setReviews((current) => current.filter((review) => review.id !== id));
    } catch {
      setError(copy.error);
    } finally {
      setBusyId(null);
    }
  }

  return (
    <main style={pageStyle}>
      <header style={headerStyle}>
        <div>
          <h1 style={titleStyle}>{copy.title}</h1>
          <p style={subtitleStyle}>{copy.subtitle}</p>
        </div>
        <div style={statRowStyle} aria-label="review counts">
          {(['all', 'pending', 'approved'] as const).map((status) => (
            <button
              key={status}
              type="button"
              onClick={() => setFilter(status)}
              style={filter === status ? activeFilterStyle : filterStyle}
            >
              {copy[status]} <strong>{counts[status]}</strong>
            </button>
          ))}
        </div>
      </header>

      <section style={panelStyle}>
        <div style={toolbarStyle}>
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder={copy.search}
            style={searchStyle}
          />
          {error ? <span style={errorStyle}>{error}</span> : null}
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={tableStyle}>
            <thead>
              <tr>
                <th style={thStyle}>{copy.columns.customer}</th>
                <th style={thStyle}>{copy.columns.rating}</th>
                <th style={thStyle}>{copy.columns.service}</th>
                <th style={thStyle}>{copy.columns.content}</th>
                <th style={thStyle}>{copy.columns.date}</th>
                <th style={thStyle}>{copy.columns.status}</th>
                <th style={thStyle}>{copy.columns.actions}</th>
              </tr>
            </thead>
            <tbody>
              {filteredReviews.map((review) => (
                <tr key={review.id} style={rowStyle}>
                  <td style={tdStyle}>{review.nickname}</td>
                  <td style={tdStyle}>{review.rating.toFixed(1)}</td>
                  <td style={tdStyle}>{review.service || '-'}</td>
                  <td style={{ ...tdStyle, maxWidth: 420 }}>{review.content}</td>
                  <td style={tdStyle}>{formatDate(review.createdAt)}</td>
                  <td style={tdStyle}><span style={badgeStyle(review.status)}>{copy[review.status]}</span></td>
                  <td style={tdStyle}>
                    <div style={actionRowStyle}>
                      {review.status === 'pending' ? (
                        <button type="button" style={primaryButtonStyle} disabled={busyId === review.id} onClick={() => updateStatus(review.id, 'approved')}>
                          {copy.approve}
                        </button>
                      ) : (
                        <button type="button" style={secondaryButtonStyle} disabled={busyId === review.id} onClick={() => updateStatus(review.id, 'pending')}>
                          {copy.moveToPending}
                        </button>
                      )}
                      <button type="button" style={dangerButtonStyle} disabled={busyId === review.id} onClick={() => deleteReview(review.id)}>
                        {copy.delete}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredReviews.length === 0 ? <div style={emptyStyle}>{copy.empty}</div> : null}
      </section>
    </main>
  );
}

function formatDate(value: string): string {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toISOString().slice(0, 10);
}

function badgeStyle(status: Review['status']): CSSProperties {
  return {
    border: `1px solid ${status === 'approved' ? '#9cc5a1' : '#d8b45d'}`,
    borderRadius: 999,
    color: status === 'approved' ? '#22543d' : '#7c4a03',
    display: 'inline-flex',
    fontSize: 12,
    fontWeight: 700,
    padding: '4px 8px',
  };
}

const pageStyle: CSSProperties = { minHeight: '100vh', padding: 24 };
const headerStyle: CSSProperties = { display: 'flex', gap: 16, justifyContent: 'space-between', marginBottom: 18, flexWrap: 'wrap' };
const titleStyle: CSSProperties = { fontSize: 24, margin: 0 };
const subtitleStyle: CSSProperties = { color: '#64748b', fontSize: 14, margin: '6px 0 0' };
const statRowStyle: CSSProperties = { display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' };
const filterStyle: CSSProperties = { border: '1px solid #d7dee8', borderRadius: 8, background: '#fff', color: '#334155', cursor: 'pointer', padding: '9px 12px' };
const activeFilterStyle: CSSProperties = { ...filterStyle, borderColor: '#123b63', color: '#123b63', boxShadow: '0 0 0 2px rgba(18, 59, 99, 0.08)' };
const panelStyle: CSSProperties = { background: '#fff', border: '1px solid #e2e8f0', borderRadius: 8, padding: 16 };
const toolbarStyle: CSSProperties = { display: 'flex', gap: 12, justifyContent: 'space-between', marginBottom: 14, flexWrap: 'wrap' };
const searchStyle: CSSProperties = { border: '1px solid #cbd5e1', borderRadius: 8, minWidth: 260, padding: '9px 11px' };
const errorStyle: CSSProperties = { color: '#b42318', fontSize: 13, fontWeight: 700 };
const tableStyle: CSSProperties = { width: '100%', borderCollapse: 'collapse' };
const thStyle: CSSProperties = { borderBottom: '1px solid #e2e8f0', color: '#64748b', fontSize: 12, padding: '10px 12px', textAlign: 'left', textTransform: 'uppercase' };
const tdStyle: CSSProperties = { borderBottom: '1px solid #f1f5f9', color: '#334155', fontSize: 14, padding: '12px', verticalAlign: 'top' };
const rowStyle: CSSProperties = { background: '#fff' };
const actionRowStyle: CSSProperties = { display: 'flex', gap: 8, flexWrap: 'wrap' };
const primaryButtonStyle: CSSProperties = { border: '1px solid #123b63', borderRadius: 8, background: '#123b63', color: '#fff', cursor: 'pointer', fontWeight: 700, padding: '8px 10px' };
const secondaryButtonStyle: CSSProperties = { ...primaryButtonStyle, background: '#fff', color: '#123b63' };
const dangerButtonStyle: CSSProperties = { ...primaryButtonStyle, borderColor: '#b42318', background: '#fff', color: '#b42318' };
const emptyStyle: CSSProperties = { color: '#94a3b8', padding: 36, textAlign: 'center' };

'use client';

import type { Locale } from '@/lib/locales';
import type { FormSubmission } from '@/lib/builder/forms/form-engine';
import { getFormsCopy } from './forms-copy';

export default function SubmissionDetailModal({
  submission,
  onClose,
  locale,
}: {
  submission: FormSubmission;
  onClose: () => void;
  locale: Locale;
}) {
  const copy = getFormsCopy(locale);
  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 10000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'rgba(15, 23, 42, 0.42)',
      }}
    >
      <section
        onClick={(event) => event.stopPropagation()}
        style={{
          width: 'min(720px, 92vw)',
          maxHeight: '82vh',
          overflow: 'auto',
          borderRadius: 12,
          background: '#fff',
          boxShadow: '0 24px 80px rgba(15, 23, 42, 0.28)',
          padding: 24,
        }}
      >
        <header style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16, marginBottom: 18 }}>
          <div>
            <h2 style={{ margin: 0, fontSize: 20 }}>{copy.list.detail.title}</h2>
            <p style={{ margin: '4px 0 0', color: '#64748b', fontSize: 13 }}>{submission.submissionId}</p>
          </div>
          <button type="button" onClick={onClose} style={closeButtonStyle} aria-label={copy.list.detail.closeLabel}>
            x
          </button>
        </header>

        <div style={{ display: 'grid', gap: 10 }}>
          <DetailRow label={copy.list.detail.submissionId} value={submission.submissionId} />
          <DetailRow label={copy.list.detail.date} value={formatDate(submission.submittedAt)} />
          <DetailRow label={copy.list.detail.status} value={submission.read ? copy.list.detail.read : copy.list.detail.unread} />
          {Object.entries(submission.data).map(([key, value]) => (
            <DetailRow key={key} label={key} value={String(value ?? '')} />
          ))}
          {submission.ip ? <DetailRow label={copy.list.detail.ip} value={submission.ip} /> : null}
          {submission.userAgent ? <DetailRow label={copy.list.detail.userAgent} value={submission.userAgent} /> : null}
        </div>
      </section>
    </div>
  );
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div style={{ paddingBottom: 10, borderBottom: '1px solid #e2e8f0' }}>
      <strong style={{ display: 'block', marginBottom: 3, color: '#334155', fontSize: 12, textTransform: 'uppercase' }}>{label}</strong>
      <span style={{ color: '#0f172a', whiteSpace: 'pre-wrap', overflowWrap: 'anywhere' }}>{value || '-'}</span>
    </div>
  );
}

function formatDate(value: string): string {
  // See SubmissionsListView#formatDate — deterministic UTC YYYY-MM-DD
  // HH:mm:ss to avoid AM/오전 hydration mismatch.
  try {
    const d = new Date(value);
    if (Number.isNaN(d.getTime())) return value;
    const yyyy = d.getUTCFullYear();
    const mm = String(d.getUTCMonth() + 1).padStart(2, '0');
    const dd = String(d.getUTCDate()).padStart(2, '0');
    const hh = String(d.getUTCHours()).padStart(2, '0');
    const mi = String(d.getUTCMinutes()).padStart(2, '0');
    const ss = String(d.getUTCSeconds()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd} ${hh}:${mi}:${ss}`;
  } catch {
    return value;
  }
}

const closeButtonStyle: React.CSSProperties = {
  width: 32,
  height: 32,
  borderRadius: 8,
  border: '1px solid #cbd5e1',
  background: '#fff',
  color: '#334155',
  cursor: 'pointer',
};

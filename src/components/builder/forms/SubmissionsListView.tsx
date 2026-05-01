'use client';

import { useMemo, useState } from 'react';
import type { FormSubmission } from '@/lib/builder/forms/form-engine';
import SubmissionDetailModal from './SubmissionDetailModal';

export default function SubmissionsListView({
  formIds,
  initialFormId,
  initialSubmissions,
}: {
  formIds: string[];
  initialFormId: string;
  initialSubmissions: FormSubmission[];
}) {
  const [activeFormId, setActiveFormId] = useState(initialFormId);
  const [submissions, setSubmissions] = useState(initialSubmissions);
  const [selected, setSelected] = useState<FormSubmission | null>(null);
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase();
    if (!needle) return submissions;
    return submissions.filter((submission) =>
      JSON.stringify(submission.data).toLowerCase().includes(needle)
        || submission.submissionId.toLowerCase().includes(needle),
    );
  }, [query, submissions]);

  async function loadForm(formId: string) {
    setActiveFormId(formId);
    setLoading(true);
    try {
      const response = await fetch(`/api/builder/forms/submissions?formId=${encodeURIComponent(formId)}&limit=100`);
      if (response.ok) {
        const data = (await response.json()) as { submissions?: FormSubmission[] };
        setSubmissions(data.submissions ?? []);
      }
    } finally {
      setLoading(false);
    }
  }

  function exportCsv() {
    const keys = Array.from(new Set(filtered.flatMap((submission) => Object.keys(submission.data))));
    const rows = [
      ['submissionId', 'formId', 'submittedAt', 'read', ...keys],
      ...filtered.map((submission) => [
        submission.submissionId,
        submission.formId,
        submission.submittedAt,
        submission.read ? 'read' : 'unread',
        ...keys.map((key) => String(submission.data[key] ?? '')),
      ]),
    ];
    const csv = rows.map((row) => row.map(csvCell).join(',')).join('\n');
    const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8' }));
    const link = document.createElement('a');
    link.href = url;
    link.download = `${activeFormId}-submissions.csv`;
    link.click();
    URL.revokeObjectURL(url);
  }

  return (
    <main style={{ minHeight: '100vh', background: '#f8fafc', color: '#0f172a', fontFamily: 'system-ui, sans-serif', padding: 24 }}>
      <header style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16, marginBottom: 20 }}>
        <div>
          <h1 style={{ margin: 0, fontSize: 24 }}>Form submissions</h1>
          <p style={{ margin: '4px 0 0', color: '#64748b', fontSize: 14 }}>{activeFormId} · {filtered.length} shown</p>
        </div>
        <button type="button" onClick={exportCsv} disabled={filtered.length === 0} style={primaryButtonStyle}>
          Export CSV
        </button>
      </header>

      <section style={{ display: 'grid', gridTemplateColumns: '240px minmax(0, 1fr)', gap: 18 }}>
        <aside style={panelStyle}>
          <strong style={panelTitleStyle}>Forms</strong>
          <div style={{ display: 'grid', gap: 8, marginTop: 12 }}>
            {(formIds.length > 0 ? formIds : [activeFormId]).map((formId) => (
              <button
                key={formId}
                type="button"
                onClick={() => loadForm(formId)}
                style={{
                  ...formButtonStyle,
                  background: formId === activeFormId ? '#e0f2fe' : '#fff',
                  borderColor: formId === activeFormId ? '#38bdf8' : '#e2e8f0',
                }}
              >
                {formId}
              </button>
            ))}
          </div>
        </aside>

        <section style={panelStyle}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, marginBottom: 12 }}>
            <input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search submissions"
              style={searchStyle}
            />
            {loading ? <span style={{ color: '#64748b', fontSize: 13 }}>Loading...</span> : null}
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', background: '#fff' }}>
              <thead>
                <tr style={{ textAlign: 'left', borderBottom: '1px solid #e2e8f0' }}>
                  <th style={thStyle}>Status</th>
                  <th style={thStyle}>Submitted</th>
                  <th style={thStyle}>Email</th>
                  <th style={thStyle}>Name</th>
                  <th style={thStyle}>Summary</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((submission) => (
                  <tr key={submission.submissionId} onClick={() => setSelected(submission)} style={{ cursor: 'pointer', borderBottom: '1px solid #f1f5f9', background: submission.read ? '#fff' : '#eff6ff' }}>
                    <td style={tdStyle}><span style={{ ...dotStyle, background: submission.read ? '#cbd5e1' : '#2563eb' }} /></td>
                    <td style={tdStyle}>{formatDate(submission.submittedAt)}</td>
                    <td style={tdStyle}>{findField(submission, 'email')}</td>
                    <td style={tdStyle}>{findField(submission, 'name') || findField(submission, '이름')}</td>
                    <td style={tdStyle}>{summarize(submission)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {filtered.length === 0 ? (
            <div style={{ padding: 36, textAlign: 'center', color: '#94a3b8' }}>No submissions found.</div>
          ) : null}
        </section>
      </section>

      {selected ? <SubmissionDetailModal submission={selected} onClose={() => setSelected(null)} /> : null}
    </main>
  );
}

function findField(submission: FormSubmission, keyPart: string): string {
  const entry = Object.entries(submission.data).find(([key]) => key.toLowerCase().includes(keyPart.toLowerCase()));
  return entry ? String(entry[1] ?? '') : '';
}

function summarize(submission: FormSubmission): string {
  const value = Object.entries(submission.data).find(([key]) => !key.startsWith('_'))?.[1];
  const text = String(value ?? '');
  return text.length > 80 ? `${text.slice(0, 80)}...` : text;
}

function formatDate(value: string): string {
  try {
    return new Date(value).toLocaleString('ko-KR');
  } catch {
    return value;
  }
}

function csvCell(value: string): string {
  return `"${value.replace(/"/g, '""')}"`;
}

const panelStyle: React.CSSProperties = {
  background: '#fff',
  border: '1px solid #e2e8f0',
  borderRadius: 10,
  padding: 14,
  boxShadow: '0 12px 30px rgba(15, 23, 42, 0.05)',
};

const panelTitleStyle: React.CSSProperties = {
  fontSize: 12,
  textTransform: 'uppercase',
  letterSpacing: '0.05em',
  color: '#64748b',
};

const formButtonStyle: React.CSSProperties = {
  width: '100%',
  padding: '9px 10px',
  border: '1px solid #e2e8f0',
  borderRadius: 8,
  textAlign: 'left',
  color: '#0f172a',
  cursor: 'pointer',
};

const primaryButtonStyle: React.CSSProperties = {
  padding: '9px 13px',
  border: '1px solid #123b63',
  borderRadius: 8,
  background: '#123b63',
  color: '#fff',
  fontWeight: 700,
  cursor: 'pointer',
};

const searchStyle: React.CSSProperties = {
  width: 'min(420px, 100%)',
  padding: '9px 11px',
  border: '1px solid #cbd5e1',
  borderRadius: 8,
  outline: 'none',
};

const thStyle: React.CSSProperties = {
  padding: '10px 12px',
  color: '#475569',
  fontSize: 12,
  textTransform: 'uppercase',
};

const tdStyle: React.CSSProperties = {
  padding: '12px',
  fontSize: 14,
  color: '#334155',
};

const dotStyle: React.CSSProperties = {
  display: 'inline-block',
  width: 8,
  height: 8,
  borderRadius: '50%',
};

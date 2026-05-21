'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';
import type { Locale } from '@/lib/locales';
import type {
  TranslationDashboardPayload,
  TranslationRowStatus,
} from '@/lib/builder/translations/dashboard-model';

type StatusFilter = 'all' | TranslationRowStatus;

const STATUS_COLORS: Record<TranslationRowStatus, { bg: string; fg: string }> = {
  untranslated: { bg: '#fee2e2', fg: '#991b1b' },
  draft: { bg: '#fef3c7', fg: '#92400e' },
  published: { bg: '#dcfce7', fg: '#166534' },
  outdated: { bg: '#fed7aa', fg: '#9a3412' },
};

const STATUS_LABELS: Record<TranslationRowStatus, string> = {
  untranslated: 'Untranslated',
  draft: 'Draft',
  published: 'Published',
  outdated: 'Outdated',
};

const STATUS_FILTERS: StatusFilter[] = [
  'all',
  'untranslated',
  'draft',
  'outdated',
  'published',
];

export default function TranslationDashboardClient({
  initialPayload,
  routeLocale,
}: {
  initialPayload: TranslationDashboardPayload;
  routeLocale: Locale;
}) {
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');

  const filteredRows = useMemo(() => {
    if (statusFilter === 'all') return initialPayload.rows;
    return initialPayload.rows.filter((row) =>
      row.entries.some((entry) => entry.status === statusFilter),
    );
  }, [initialPayload.rows, statusFilter]);

  return (
    <div>
      <div
        style={{
          display: 'flex',
          gap: 8,
          marginBottom: 12,
          flexWrap: 'wrap',
          alignItems: 'center',
        }}
      >
        <span style={{ fontSize: 12, color: '#64748b' }}>Filter:</span>
        {STATUS_FILTERS.map((status) => {
          const active = status === statusFilter;
          return (
            <button
              key={status}
              type="button"
              onClick={() => setStatusFilter(status)}
              style={{
                fontSize: 12,
                padding: '4px 10px',
                borderRadius: 999,
                border: active ? '1px solid #1e5a96' : '1px solid #cbd5e1',
                background: active ? '#1e5a96' : '#fff',
                color: active ? '#fff' : '#1f2937',
                cursor: 'pointer',
              }}
            >
              {status === 'all' ? 'All' : STATUS_LABELS[status]}
            </button>
          );
        })}
        <span
          style={{ marginLeft: 'auto', fontSize: 12, color: '#64748b' }}
        >
          {filteredRows.length} / {initialPayload.rows.length} pages
        </span>
      </div>

      <div
        style={{
          border: '1px solid #e2e8f0',
          borderRadius: 8,
          overflow: 'hidden',
        }}
      >
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: '#f8fafc' }}>
              <th style={th}>Page</th>
              <th style={th}>Slug</th>
              {initialPayload.targetLocales.map((locale) => (
                <th key={locale} style={th}>
                  {locale}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filteredRows.map((row) => (
              <tr key={row.pageId} style={{ borderTop: '1px solid #e2e8f0' }}>
                <td style={td}>
                  <div style={{ fontWeight: 600, fontSize: 13 }}>
                    {row.sourceTitle}
                  </div>
                  <div style={{ fontSize: 11, color: '#64748b' }}>
                    {row.pageId}
                  </div>
                </td>
                <td style={td}>
                  <code style={{ fontSize: 12, color: '#475569' }}>
                    /{row.slug || ''}
                  </code>
                </td>
                {row.entries.map((entry) => {
                  const palette = STATUS_COLORS[entry.status];
                  return (
                    <td key={entry.locale} style={td}>
                      <div
                        style={{
                          display: 'flex',
                          flexDirection: 'column',
                          gap: 6,
                        }}
                      >
                        <span
                          style={{
                            display: 'inline-block',
                            alignSelf: 'flex-start',
                            background: palette.bg,
                            color: palette.fg,
                            padding: '2px 8px',
                            borderRadius: 999,
                            fontSize: 11,
                            fontWeight: 600,
                          }}
                        >
                          {STATUS_LABELS[entry.status]}
                        </span>
                        <Link
                          href={`/${routeLocale}/admin-builder/translations/${row.pageId}?target=${entry.locale}&source=${initialPayload.sourceLocale}`}
                          style={{
                            fontSize: 11,
                            color: '#1e5a96',
                            textDecoration: 'none',
                          }}
                        >
                          Edit translation →
                        </Link>
                      </div>
                    </td>
                  );
                })}
              </tr>
            ))}
            {filteredRows.length === 0 && (
              <tr>
                <td
                  colSpan={2 + initialPayload.targetLocales.length}
                  style={{
                    ...td,
                    textAlign: 'center',
                    color: '#94a3b8',
                    fontSize: 13,
                    padding: 32,
                  }}
                >
                  No pages match this filter.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

const th: React.CSSProperties = {
  textAlign: 'left',
  fontSize: 12,
  fontWeight: 600,
  color: '#475569',
  padding: '10px 12px',
  textTransform: 'uppercase',
  letterSpacing: 0.4,
};

const td: React.CSSProperties = {
  padding: '12px',
  fontSize: 13,
  color: '#1f2937',
  verticalAlign: 'top',
};
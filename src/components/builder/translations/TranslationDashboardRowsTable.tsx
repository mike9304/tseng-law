import Link from 'next/link';
import type { CSSProperties } from 'react';
import type { Locale } from '@/lib/locales';
import type {
  TranslationDashboardPayload,
  TranslationDashboardRow,
  TranslationRowStatus,
} from '@/lib/builder/translations/dashboard-model';
import { buildTranslationManagerReviewQuery } from '@/lib/builder/translations/query';
import { getTranslationCopy } from './translation-copy';

const STATUS_COLORS: Record<TranslationRowStatus, { bg: string; fg: string }> = {
  untranslated: { bg: '#fee2e2', fg: '#991b1b' },
  draft: { bg: '#fef3c7', fg: '#92400e' },
  published: { bg: '#dcfce7', fg: '#166534' },
  outdated: { bg: '#fed7aa', fg: '#9a3412' },
};

export default function TranslationDashboardRowsTable({
  rows,
  payload,
  routeLocale,
  statusLabels,
}: {
  rows: readonly TranslationDashboardRow[];
  payload: TranslationDashboardPayload;
  routeLocale: Locale;
  statusLabels: Record<TranslationRowStatus, string>;
}) {
  const copy = getTranslationCopy(routeLocale);
  return (
    <div style={{ border: '1px solid #e2e8f0', borderRadius: 8, overflow: 'hidden' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ background: '#f8fafc' }}>
            <th style={th}>{copy.dashboardContent}</th>
            <th style={th}>{copy.dashboardSource}</th>
            {payload.targetLocales.map((locale) => (
              <th key={locale} style={th}>
                {copy.dashboardTarget} - {locale}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.pageId} style={{ borderTop: '1px solid #e2e8f0' }}>
              <td style={td}>
                <div style={{ fontWeight: 600, fontSize: 13 }}>{row.sourceTitle}</div>
                <div style={{ fontSize: 11, color: '#64748b' }}>{row.pageId}</div>
              </td>
              <td style={td}>
                <code style={{ fontSize: 12, color: '#475569' }}>
                  /{row.slug || ''}
                </code>
              </td>
              {row.entries.map((entry) => {
                const palette = STATUS_COLORS[entry.status];
                const reviewQuery = entry.status === 'untranslated'
                  ? buildTranslationManagerReviewQuery({
                      sourceLocale: payload.sourceLocale,
                      targetLocale: entry.locale,
                      statusFilter: 'missing',
                    })
                  : entry.status === 'outdated'
                    ? buildTranslationManagerReviewQuery({
                        sourceLocale: payload.sourceLocale,
                        targetLocale: entry.locale,
                        statusFilter: 'outdated',
                      })
                    : '';
                const reviewHref = reviewQuery
                  ? `/${routeLocale}/admin-builder/translations?${reviewQuery}`
                  : '';
                return (
                  <td key={entry.locale} style={td}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                      {reviewHref ? (
                        <Link href={reviewHref} style={{ ...statusBadge, background: palette.bg, color: palette.fg }}>
                          {statusLabels[entry.status]}
                        </Link>
                      ) : (
                        <span style={{ ...statusBadge, background: palette.bg, color: palette.fg }}>
                          {statusLabels[entry.status]}
                        </span>
                      )}
                      <Link
                        href={`/${routeLocale}/admin-builder/translations/${row.pageId}?target=${entry.locale}&source=${payload.sourceLocale}`}
                        style={{ fontSize: 11, color: '#1e5a96', textDecoration: 'none' }}
                      >
                        {copy.dashboardReviewLink}
                      </Link>
                    </div>
                  </td>
                );
              })}
            </tr>
          ))}
          {rows.length === 0 && (
            <tr>
              <td
                colSpan={2 + payload.targetLocales.length}
                style={{ ...td, textAlign: 'center', color: '#94a3b8', fontSize: 13, padding: 32 }}
              >
                {copy.managerNoTranslations}
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

const th: CSSProperties = {
  textAlign: 'left',
  fontSize: 12,
  fontWeight: 600,
  color: '#475569',
  padding: '10px 12px',
  textTransform: 'uppercase',
  letterSpacing: 0.4,
};

const td: CSSProperties = {
  padding: '12px',
  fontSize: 13,
  color: '#1f2937',
  verticalAlign: 'top',
};

const statusBadge: CSSProperties = {
  display: 'inline-block',
  alignSelf: 'flex-start',
  padding: '2px 8px',
  borderRadius: 999,
  fontSize: 11,
  fontWeight: 600,
  textDecoration: 'none',
};

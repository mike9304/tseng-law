import Link from 'next/link';
import type { CSSProperties } from 'react';
import type { Locale } from '@/lib/locales';
import type {
  TranslationDashboardLocaleSummary,
  TranslationDashboardPayload,
  TranslationDashboardSummary,
} from '@/lib/builder/translations/dashboard-model';
import { buildTranslationManagerReviewQuery } from '@/lib/builder/translations/query';
import { getTranslationCopy } from './translation-copy';

export default function TranslationDashboardOverview({
  payload,
  routeLocale,
  summary,
}: {
  payload: TranslationDashboardPayload;
  routeLocale: Locale;
  summary: TranslationDashboardSummary;
}) {
  const copy = getTranslationCopy(routeLocale);
  return (
    <>
      <div style={summaryGrid}>
        <MetricCard
          label={copy.dashboardSourcePages}
          value={summary.totalPages}
          hint={`${payload.sourceLocale} ${copy.dashboardPages}`}
        />
        <MetricCard
          label={copy.dashboardTranslationCells}
          value={summary.totalCells}
          hint={copy.dashboardAllLocaleCombinations}
        />
        <MetricCard
          label={copy.dashboardPublished}
          value={summary.published}
          hint={copy.dashboardUpToDateCells}
          tone="green"
        />
        <MetricCard
          label={copy.dashboardNeedsAttention}
          value={summary.needsAttention}
          hint={copy.dashboardDraftOutdatedUntranslated}
          tone="amber"
        />
      </div>

      <div style={localeSummaryWrap}>
        {summary.locales.map((localeSummary) => (
          <LocaleSummaryCard
            key={localeSummary.locale}
            summary={localeSummary}
            sourceLocale={payload.sourceLocale}
            routeLocale={routeLocale}
          />
        ))}
      </div>
    </>
  );
}

function MetricCard({
  label,
  value,
  hint,
  tone = 'slate',
}: {
  label: string;
  value: number;
  hint: string;
  tone?: 'slate' | 'green' | 'amber';
}) {
  const toneStyles = {
    slate: { border: '#e2e8f0', value: '#0f172a', accent: '#475569' },
    green: { border: '#bbf7d0', value: '#166534', accent: '#15803d' },
    amber: { border: '#fed7aa', value: '#9a3412', accent: '#c2410c' },
  }[tone];
  return (
    <div style={{ ...metricCard, borderColor: toneStyles.border }}>
      <div style={{ fontSize: 11, color: toneStyles.accent, textTransform: 'uppercase', letterSpacing: 0.4 }}>
        {label}
      </div>
      <div style={{ fontSize: 28, fontWeight: 700, color: toneStyles.value, lineHeight: 1.1 }}>
        {value}
      </div>
      <div style={{ fontSize: 12, color: '#64748b' }}>{hint}</div>
    </div>
  );
}

function LocaleSummaryCard({
  summary,
  sourceLocale,
  routeLocale,
}: {
  summary: TranslationDashboardLocaleSummary;
  sourceLocale: Locale;
  routeLocale: Locale;
}) {
  const copy = getTranslationCopy(routeLocale);
  const ratio = summary.completionRate;
  const gradient = ratio >= 80
    ? 'linear-gradient(90deg, #16a34a 0%, #22c55e 100%)'
    : ratio >= 50
      ? 'linear-gradient(90deg, #d97706 0%, #f59e0b 100%)'
      : 'linear-gradient(90deg, #dc2626 0%, #f97316 100%)';
  const managerBase = `/${routeLocale}/admin-builder/translations`;
  const missingHref = buildTranslationManagerReviewQuery({
    sourceLocale,
    statusFilter: 'missing',
    targetLocale: summary.locale,
  });
  const outdatedHref = buildTranslationManagerReviewQuery({
    sourceLocale,
    statusFilter: 'outdated',
    targetLocale: summary.locale,
  });
  return (
    <div style={localeSummaryCard}>
      <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: 8 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: '#0f172a' }}>{summary.locale}</div>
        <div style={{ fontSize: 12, color: '#475569' }}>{summary.completionRate}% {copy.dashboardPublished}</div>
      </div>
      <div style={progressRail} aria-hidden="true">
        <div style={{ ...progressFill, width: `${ratio}%`, background: gradient }} />
      </div>
      <div style={localeStatsRow}>
        <span>{summary.published} {copy.dashboardPublished}</span>
        <span>{summary.needsAttention} {copy.dashboardNeedsAttention}</span>
        <span>{summary.untranslated} {copy.dashboardMissing}</span>
      </div>
      <div style={localeActionRow}>
        {summary.untranslated > 0 && (
          <Link href={`${managerBase}?${missingHref}`} style={localeActionLink}>
            {copy.dashboardReviewMissing}
          </Link>
        )}
        {summary.outdated > 0 && (
          <Link href={`${managerBase}?${outdatedHref}`} style={localeActionLink}>
            {copy.dashboardReviewOutdated}
          </Link>
        )}
      </div>
    </div>
  );
}

const summaryGrid: CSSProperties = {
  display: 'grid',
  gridTemplateColumns: 'repeat(4, minmax(0, 1fr))',
  gap: 12,
  marginBottom: 12,
};

const metricCard: CSSProperties = {
  border: '1px solid #e2e8f0',
  borderRadius: 10,
  background: '#fff',
  padding: '12px 14px',
  minHeight: 90,
};

const localeSummaryWrap: CSSProperties = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
  gap: 10,
  marginBottom: 12,
};

const localeSummaryCard: CSSProperties = {
  border: '1px solid #e2e8f0',
  borderRadius: 10,
  background: '#fff',
  padding: '10px 12px',
};

const progressRail: CSSProperties = {
  marginTop: 8,
  height: 8,
  background: '#e2e8f0',
  borderRadius: 999,
  overflow: 'hidden',
};

const progressFill: CSSProperties = {
  height: '100%',
  borderRadius: 999,
};

const localeStatsRow: CSSProperties = {
  display: 'flex',
  gap: 10,
  flexWrap: 'wrap',
  marginTop: 8,
  fontSize: 12,
  color: '#475569',
};

const localeActionRow: CSSProperties = {
  display: 'flex',
  gap: 8,
  flexWrap: 'wrap',
  marginTop: 10,
};

const localeActionLink: CSSProperties = {
  fontSize: 12,
  color: '#1e5a96',
  textDecoration: 'none',
  border: '1px solid #cbd5e1',
  borderRadius: 999,
  padding: '4px 10px',
  background: '#fff',
};

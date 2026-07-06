import Link from 'next/link';
import type { Locale } from '@/lib/locales';
import type {
  TranslationDashboardCoverageKind,
  TranslationDashboardCoverageLocaleSummary,
  TranslationDashboardCoverageSummary,
} from '@/lib/builder/translations/dashboard-coverage';
import { buildTranslationManagerReviewQuery } from '@/lib/builder/translations/query';
import {
  coverageCard,
  coverageCardHeader,
  coverageCardLabel,
  coverageCardMeta,
  coverageDrillDownHeader,
  coverageDrillDownItem,
  coverageDrillDownList,
  coverageFill,
  coverageLocaleChip,
  coverageLocaleGrid,
  coverageMetric,
  coverageMetricRow,
  coverageRail,
  coverageRate,
  coverageReviewLink,
  coverageStatusRow,
} from './TranslationDashboardCoverage.styles';
import { getTranslationCopy } from './translation-copy';

type ReviewStatus = 'missing' | 'outdated';

export function TranslationDashboardCoverageCard({
  label,
  routeLocale,
  sourceLocale,
  summary,
}: {
  label: string;
  routeLocale: Locale;
  sourceLocale: Locale;
  summary: TranslationDashboardCoverageSummary;
}) {
  const copy = getTranslationCopy(routeLocale);
  return (
    <article
      style={coverageCard}
      data-translation-dashboard-coverage-kind={summary.key}
    >
      <div style={coverageCardHeader}>
        <div>
          <div style={coverageCardLabel}>{label}</div>
          <div style={coverageCardMeta}>
            {summary.totalStrings} {copy.dashboardCoverageTotal} / {summary.totalCells} {copy.dashboardTranslations}
          </div>
        </div>
        <div style={coverageRate}>{summary.completionRate}%</div>
      </div>
      <div style={coverageRail} aria-hidden="true">
        <div style={{ ...coverageFill, width: `${summary.completionRate}%` }} />
      </div>
      <div style={coverageStatusRow}>
        <span>{summary.translated + summary.manual} {copy.dashboardCoverageReady}</span>
        <span>{summary.needsAttention} {copy.dashboardNeedsAttention}</span>
      </div>
      <div style={coverageLocaleGrid}>
        {summary.locales.map((localeSummary) => (
          <span key={localeSummary.locale} style={coverageLocaleChip}>
            <strong>{localeSummary.locale}</strong>
            {copy.dashboardCoverageLocaleRate(localeSummary.completionRate)}
          </span>
        ))}
      </div>
      <div style={coverageDrillDownList}>
        {summary.locales.map((localeSummary) => (
          <CoverageLocaleDetail
            key={localeSummary.locale}
            routeLocale={routeLocale}
            sourceLocale={sourceLocale}
            summaryKey={summary.key}
            localeSummary={localeSummary}
          />
        ))}
      </div>
    </article>
  );
}

function CoverageLocaleDetail({
  routeLocale,
  sourceLocale,
  summaryKey,
  localeSummary,
}: {
  routeLocale: Locale;
  sourceLocale: Locale;
  summaryKey: TranslationDashboardCoverageKind;
  localeSummary: TranslationDashboardCoverageLocaleSummary;
}) {
  const copy = getTranslationCopy(routeLocale);
  const readyCount = localeSummary.translated + localeSummary.manual;
  return (
    <div
      style={coverageDrillDownItem}
      data-translation-dashboard-coverage-detail={`${summaryKey}-${localeSummary.locale}`}
    >
      <div style={coverageDrillDownHeader}>
        <strong>{localeSummary.locale}</strong>
        <span>{copy.dashboardCoverageLocaleRate(localeSummary.completionRate)}</span>
      </div>
      <div style={coverageMetricRow}>
        <span style={coverageMetric}>{readyCount} {copy.dashboardCoverageReady}</span>
        <ReviewMetric
          count={localeSummary.missing}
          label={copy.dashboardMissing}
          linkLabel={copy.dashboardReviewMissing}
          routeLocale={routeLocale}
          sourceLocale={sourceLocale}
          status="missing"
          summaryKey={summaryKey}
          targetLocale={localeSummary.locale}
        />
        <ReviewMetric
          count={localeSummary.outdated}
          label={copy.dashboardOutdated}
          linkLabel={copy.dashboardReviewOutdated}
          routeLocale={routeLocale}
          sourceLocale={sourceLocale}
          status="outdated"
          summaryKey={summaryKey}
          targetLocale={localeSummary.locale}
        />
      </div>
    </div>
  );
}

function ReviewMetric({
  count,
  label,
  linkLabel,
  routeLocale,
  sourceLocale,
  status,
  summaryKey,
  targetLocale,
}: {
  count: number;
  label: string;
  linkLabel: string;
  routeLocale: Locale;
  sourceLocale: Locale;
  status: ReviewStatus;
  summaryKey: TranslationDashboardCoverageKind;
  targetLocale: Locale;
}) {
  if (count <= 0) {
    return <span style={coverageMetric}>0 {label}</span>;
  }
  return (
    <Link
      href={buildCoverageReviewHref({
        routeLocale,
        sourceLocale,
        status,
        summaryKey,
        targetLocale,
      })}
      style={{ ...coverageMetric, ...coverageReviewLink }}
    >
      {count} {label}: {linkLabel}
    </Link>
  );
}

function buildCoverageReviewHref({
  routeLocale,
  sourceLocale,
  status,
  summaryKey,
  targetLocale,
}: {
  routeLocale: Locale;
  sourceLocale: Locale;
  status: ReviewStatus;
  summaryKey: TranslationDashboardCoverageKind;
  targetLocale: Locale;
}): string {
  const query = buildTranslationManagerReviewQuery({
    sourceLocale,
    targetLocale,
    statusFilter: status,
    selectedCategory: categoryForCoverageKind(summaryKey),
    search: searchForCoverageKind(summaryKey),
  });
  return `/${routeLocale}/admin-builder/translations?${query}`;
}

function categoryForCoverageKind(
  kind: TranslationDashboardCoverageKind,
): 'columns' | 'pages' | 'apps' {
  switch (kind) {
    case 'cms':
      return 'columns';
    case 'media':
      return 'pages';
    case 'apps':
      return 'apps';
    default:
      return assertNever(kind);
  }
}

function searchForCoverageKind(kind: TranslationDashboardCoverageKind): string {
  switch (kind) {
    case 'media':
      return 'Alt';
    case 'cms':
    case 'apps':
      return '';
    default:
      return assertNever(kind);
  }
}

function assertNever(value: never): never {
  throw new Error(`Unhandled coverage kind: ${value}`);
}

import type { Locale } from '@/lib/locales';
import type {
  TranslationDashboardCoverageKind,
  TranslationDashboardCoverageSummary,
} from '@/lib/builder/translations/dashboard-coverage';
import {
  coverageCardGrid,
  coverageDescription,
  coverageHeading,
  coverageSection,
  coverageSectionHeader,
} from './TranslationDashboardCoverage.styles';
import { TranslationDashboardCoverageCard } from './TranslationDashboardCoverageCard';
import { getTranslationCopy } from './translation-copy';

export default function TranslationDashboardCoverageSection({
  routeLocale,
  sourceLocale,
  summaries,
}: {
  routeLocale: Locale;
  sourceLocale: Locale;
  summaries: readonly TranslationDashboardCoverageSummary[];
}) {
  const copy = getTranslationCopy(routeLocale);
  const labels: Record<TranslationDashboardCoverageKind, string> = {
    cms: copy.dashboardCoverageCms,
    media: copy.dashboardCoverageMedia,
    apps: copy.dashboardCoverageApps,
  };
  return (
    <section style={coverageSection} data-translation-dashboard-coverage="true">
      <div style={coverageSectionHeader}>
        <div>
          <h2 style={coverageHeading}>{copy.dashboardCoverageTitle}</h2>
          <p style={coverageDescription}>{copy.dashboardCoverageDescription}</p>
        </div>
      </div>
      <div style={coverageCardGrid}>
        {summaries.map((summary) => (
          <TranslationDashboardCoverageCard
            key={summary.key}
            label={labels[summary.key]}
            routeLocale={routeLocale}
            sourceLocale={sourceLocale}
            summary={summary}
          />
        ))}
      </div>
    </section>
  );
}

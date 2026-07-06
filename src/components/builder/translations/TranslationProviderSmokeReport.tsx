import type { TranslationCopy } from './translation-copy';
import type { ProviderReport } from './translation-provider-readiness-schemas';
import styles from './TranslationManager.module.css';

type SmokeHistoryEntry = ProviderReport['smokeHistory'][number];
type SmokeSummary = ProviderReport['smokeSummary'];
type SmokeSummaryProvider = SmokeSummary['providers'][number];

interface TranslationProviderSmokeReportProps {
  readonly copy: TranslationCopy;
  readonly smokeHistory: readonly SmokeHistoryEntry[];
  readonly smokeSummary: SmokeSummary | null;
}

function summaryProviderState(provider: SmokeSummaryProvider): string {
  return provider.status === 'missing' ? 'neutral' : provider.status;
}

function summaryProviderText(copy: TranslationCopy, provider: SmokeSummaryProvider): string {
  if (provider.status === 'missing' || provider.durationMs === undefined) {
    return copy.managerProviderSmokeSummaryMissing(provider.provider);
  }
  return copy.managerProviderSmokeSummaryProvider(provider.provider, provider.status, provider.durationMs);
}

export default function TranslationProviderSmokeReport({
  copy,
  smokeHistory,
  smokeSummary,
}: TranslationProviderSmokeReportProps) {
  return (
    <>
      {smokeSummary ? (
        <div className={styles.providerSmokeSummary} data-translation-provider-smoke-summary="true">
          <strong>{copy.managerProviderSmokeSummaryTitle}</strong>
          <p>
            {copy.managerProviderSmokeSummaryTotals(
              smokeSummary.passed,
              smokeSummary.failed,
              smokeSummary.unconfigured,
              smokeSummary.total,
            )}
          </p>
          <p>{copy.managerProviderSmokeSummaryFreshness(smokeSummary.freshness, smokeSummary.ageMinutes)}</p>
          <p>{copy.managerProviderSmokeReviewStatus(smokeSummary.reviewerStatus)}</p>
          <p>{copy.managerProviderSmokeReviewActions(smokeSummary.actionItems)}</p>
          <div className={styles.providerSmokeHistoryList}>
            {smokeSummary.providers.map((provider) => (
              <span data-state={summaryProviderState(provider)} key={provider.provider}>
                {summaryProviderText(copy, provider)}
              </span>
            ))}
          </div>
        </div>
      ) : null}

      <div className={styles.providerSmokeHistory} data-translation-provider-smoke-history="true">
        <strong>{copy.managerProviderSmokeHistoryTitle}</strong>
        {smokeHistory.length > 0 ? (
          <div className={styles.providerSmokeHistoryList}>
            {smokeHistory.map((smoke) => (
              <span data-state={smoke.status} key={`${smoke.checkedAt}-${smoke.provider}`}>
                {copy.managerProviderSmokeHistoryEntry(
                  smoke.provider,
                  smoke.status,
                  smoke.sourceLocale,
                  smoke.targetLocale,
                  smoke.durationMs,
                )}
              </span>
            ))}
          </div>
        ) : (
          <p>{copy.managerProviderSmokeHistoryEmpty}</p>
        )}
      </div>
    </>
  );
}

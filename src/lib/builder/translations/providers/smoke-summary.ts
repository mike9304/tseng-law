import type {
  TranslationProviderDiagnosticId,
  TranslationProviderSmokeHistoryEntry,
  TranslationProviderSmokeResult,
} from './diagnostics';

type TranslationProviderSmokeStatus = TranslationProviderSmokeResult['status'];
export const TRANSLATION_PROVIDER_SMOKE_STALE_AFTER_MINUTES = 26 * 60;

export type TranslationProviderSmokeFreshness = 'missing' | 'fresh' | 'stale';
export type TranslationProviderSmokeReviewerStatus = 'no_history' | 'healthy' | 'needs_attention' | 'stale';
export type TranslationProviderSmokeActionItem =
  | 'run_provider_smoke'
  | 'check_scheduled_smoke'
  | 'inspect_failures'
  | 'configure_provider';

export type TranslationProviderSmokeProviderSummary =
  | {
    readonly provider: TranslationProviderDiagnosticId;
    readonly status: TranslationProviderSmokeStatus;
    readonly checkedAt: string;
    readonly durationMs: number;
  }
  | {
    readonly provider: TranslationProviderDiagnosticId;
    readonly status: 'missing';
  };

export interface TranslationProviderSmokeSummary {
  readonly total: number;
  readonly passed: number;
  readonly failed: number;
  readonly unconfigured: number;
  readonly lastCheckedAt?: string;
  readonly freshness: TranslationProviderSmokeFreshness;
  readonly ageMinutes?: number;
  readonly reviewerStatus: TranslationProviderSmokeReviewerStatus;
  readonly actionItems: readonly TranslationProviderSmokeActionItem[];
  readonly providers: readonly TranslationProviderSmokeProviderSummary[];
}

function assertNever(value: never): never {
  throw new Error(`Unexpected provider smoke status: ${value}`);
}

function countStatus(
  status: TranslationProviderSmokeStatus,
  counts: { passed: number; failed: number; unconfigured: number },
): void {
  switch (status) {
    case 'pass':
      counts.passed += 1;
      return;
    case 'fail':
      counts.failed += 1;
      return;
    case 'unconfigured':
      counts.unconfigured += 1;
      return;
    default:
      assertNever(status);
  }
}

function latestEntry(
  current: TranslationProviderSmokeHistoryEntry | undefined,
  candidate: TranslationProviderSmokeHistoryEntry,
): TranslationProviderSmokeHistoryEntry {
  if (current === undefined) return candidate;
  return candidate.checkedAt > current.checkedAt ? candidate : current;
}

function hasMissingProvider(providers: readonly TranslationProviderSmokeProviderSummary[]): boolean {
  return providers.some((provider) => provider.status === 'missing');
}

function summarizeReviewerActions(
  freshness: TranslationProviderSmokeFreshness,
  counts: { passed: number; failed: number; unconfigured: number },
  providers: readonly TranslationProviderSmokeProviderSummary[],
): Pick<TranslationProviderSmokeSummary, 'reviewerStatus' | 'actionItems'> {
  switch (freshness) {
    case 'missing':
      return { reviewerStatus: 'no_history', actionItems: ['run_provider_smoke'] };
    case 'stale':
      return { reviewerStatus: 'stale', actionItems: ['check_scheduled_smoke', 'run_provider_smoke'] };
    case 'fresh':
      break;
    default:
      assertNever(freshness);
  }

  const actionItems: TranslationProviderSmokeActionItem[] = [];
  if (hasMissingProvider(providers)) actionItems.push('run_provider_smoke');
  if (counts.failed > 0) actionItems.push('inspect_failures');
  if (counts.unconfigured > 0) actionItems.push('configure_provider');

  return {
    reviewerStatus: actionItems.length > 0 ? 'needs_attention' : 'healthy',
    actionItems,
  };
}

export function summarizeTranslationProviderSmokeHistory(
  history: readonly TranslationProviderSmokeHistoryEntry[],
  providerIds: readonly TranslationProviderDiagnosticId[],
  now: Date = new Date(),
  staleAfterMinutes: number = TRANSLATION_PROVIDER_SMOKE_STALE_AFTER_MINUTES,
): TranslationProviderSmokeSummary {
  const counts = { passed: 0, failed: 0, unconfigured: 0 };
  const latestByProvider: Partial<Record<TranslationProviderDiagnosticId, TranslationProviderSmokeHistoryEntry>> = {};
  let lastCheckedAt: string | undefined;

  for (const entry of history) {
    countStatus(entry.status, counts);
    latestByProvider[entry.provider] = latestEntry(latestByProvider[entry.provider], entry);
    lastCheckedAt = lastCheckedAt === undefined || entry.checkedAt > lastCheckedAt ? entry.checkedAt : lastCheckedAt;
  }

  const providers = providerIds.map((provider): TranslationProviderSmokeProviderSummary => {
    const latest = latestByProvider[provider];
    if (latest === undefined) return { provider, status: 'missing' };
    return {
      provider,
      status: latest.status,
      checkedAt: latest.checkedAt,
      durationMs: latest.durationMs,
    };
  });
  let freshness: TranslationProviderSmokeFreshness = 'missing';
  let ageMinutes: number | undefined;
  if (lastCheckedAt !== undefined) {
    const parsedCheckedAt = Date.parse(lastCheckedAt);
    const rawAgeMinutes = Number.isFinite(parsedCheckedAt)
      ? Math.floor((now.getTime() - parsedCheckedAt) / 60_000)
      : staleAfterMinutes + 1;
    ageMinutes = Math.max(0, rawAgeMinutes);
    freshness = ageMinutes <= staleAfterMinutes ? 'fresh' : 'stale';
  }
  const reviewer = summarizeReviewerActions(freshness, counts, providers);

  return {
    total: history.length,
    passed: counts.passed,
    failed: counts.failed,
    unconfigured: counts.unconfigured,
    ...(lastCheckedAt === undefined ? {} : { lastCheckedAt }),
    freshness,
    ...(ageMinutes === undefined ? {} : { ageMinutes }),
    reviewerStatus: reviewer.reviewerStatus,
    actionItems: reviewer.actionItems,
    providers,
  };
}

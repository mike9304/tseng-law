import type { Dispatch, SetStateAction } from 'react';
import type { Locale } from '@/lib/locales';
import type { TranslationManagerPayload, TranslationStatus } from '@/lib/builder/translations/types';
import type { TranslationReviewSummary } from '@/lib/builder/translations/review-summary';
import { translationStatuses } from '@/lib/builder/translations/types';
import TranslationProgress from './TranslationProgress';
import TranslationBatchProgress from './TranslationBatchProgress';
import TranslationProviderReadiness from './TranslationProviderReadiness';
import type { TranslationCopy } from './translation-copy';
import type { StatusFilter, TranslationBatchProgressState } from './TranslationManagerView.types';
import styles from './TranslationManager.module.css';

const reviewStatuses = ['missing', 'outdated', 'manual', 'translated'] as const;

function isTranslationStatus(value: string): value is TranslationStatus {
  return translationStatuses.some((status) => status === value);
}

function parseStatusFilter(value: string): StatusFilter {
  if (value === 'all') return 'all';
  if (isTranslationStatus(value)) return value;
  return 'all';
}

function statusLabel(status: TranslationStatus, copy: TranslationCopy): string {
  switch (status) {
    case 'missing':
      return copy.managerMissing;
    case 'outdated':
      return copy.managerOutdated;
    case 'manual':
      return copy.managerManual;
    case 'translated':
      return copy.managerTranslated;
  }
}

export default function TranslationManagerToolbar({
  copy,
  error,
  notice,
  filteredEntryCount,
  payload,
  routeLocale,
  search,
  setSearch,
  statusFilter,
  setStatusFilter,
  refreshSync,
  resetReviewState,
  reviewHref,
  reviewSummary,
  shownTargetLocales,
  visibleTargets,
  setVisibleTargets,
  translateBatch,
  batchProgress,
}: {
  readonly copy: TranslationCopy;
  readonly error: string;
  readonly notice: string;
  readonly filteredEntryCount: number;
  readonly payload: TranslationManagerPayload;
  readonly routeLocale: Locale;
  readonly search: string;
  readonly setSearch: Dispatch<SetStateAction<string>>;
  readonly statusFilter: StatusFilter;
  readonly setStatusFilter: Dispatch<SetStateAction<StatusFilter>>;
  readonly refreshSync: () => Promise<void>;
  readonly resetReviewState: () => void;
  readonly reviewHref: string;
  readonly reviewSummary: TranslationReviewSummary;
  readonly shownTargetLocales: readonly Locale[];
  readonly visibleTargets: ReadonlySet<Locale>;
  readonly setVisibleTargets: Dispatch<SetStateAction<Set<Locale>>>;
  readonly translateBatch: (targetLocale: Locale) => Promise<void>;
  readonly batchProgress: TranslationBatchProgressState | null;
}) {
  return (
    <section className={styles.toolbar}>
      <div className={styles.toolbarRow}>
        <div>
          <h2 className={styles.toolbarTitle}>{filteredEntryCount} {copy.managerStrings}</h2>
          <p className={styles.meta}>{copy.managerLastSync} {new Date(payload.syncedAt).toLocaleString()}</p>
        </div>
        <div className={styles.toolbarActions}>
          <input
            className={styles.input}
            data-translation-search-input="true"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder={copy.managerSearchPlaceholder}
            type="search"
          />
          <select
            className={styles.select}
            value={statusFilter}
            onChange={(event) => setStatusFilter(parseStatusFilter(event.target.value))}
          >
            <option value="all">{copy.managerAllStatuses}</option>
            <option value="missing">{copy.managerMissing}</option>
            <option value="outdated">{copy.managerOutdated}</option>
            <option value="translated">{copy.managerTranslated}</option>
            <option value="manual">{copy.managerManual}</option>
          </select>
          <button className={styles.button} type="button" onClick={() => void refreshSync()}>
            {copy.managerSyncSources}
          </button>
          <button className={styles.button} type="button" onClick={resetReviewState}>
            {copy.managerResetView}
          </button>
          <a
            className={styles.button}
            data-translation-share-link="true"
            href={reviewHref}
            rel="noreferrer"
            target="_blank"
            aria-label={copy.managerShareReview}
            style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', textDecoration: 'none' }}
          >
            {copy.managerShareReview}
          </a>
        </div>
      </div>

      <TranslationProgress
        progress={payload.progress}
        routeLocale={routeLocale}
        sourceLocale={payload.sourceLocale}
      />

      <TranslationProviderReadiness
        copy={copy}
        routeLocale={routeLocale}
        sourceLocale={payload.sourceLocale}
      />

      <div className={styles.reviewStrip} aria-label={copy.managerReviewSummary}>
        <span className={styles.reviewChipStrong}>{filteredEntryCount} {copy.managerVisibleStrings}</span>
        {reviewStatuses.map((status) => {
          const active = statusFilter === status;
          return (
            <button
              key={status}
              type="button"
              aria-pressed={active}
              className={active ? styles.reviewChipActive : styles.reviewChipButton}
              onClick={() => setStatusFilter((current) => (current === status ? 'all' : status))}
            >
              {statusLabel(status, copy)} {reviewSummary.statusCounts[status]}
            </button>
          );
        })}
        {reviewSummary.locales.map((summary) => (
          <span key={summary.locale} className={styles.reviewLocaleGroup}>
            <span className={styles.reviewChipStrong}>{summary.locale}</span>
            <button
              type="button"
              className={summary.missing > 0 ? styles.reviewChipButton : styles.reviewChipMuted}
              disabled={summary.missing === 0}
              onClick={() => {
                setVisibleTargets(new Set([summary.locale]));
                setStatusFilter('missing');
              }}
            >
              {copy.managerMissing} {summary.missing}
            </button>
            <button
              type="button"
              className={summary.outdated > 0 ? styles.reviewChipButton : styles.reviewChipMuted}
              disabled={summary.outdated === 0}
              onClick={() => {
                setVisibleTargets(new Set([summary.locale]));
                setStatusFilter('outdated');
              }}
            >
              {copy.managerOutdated} {summary.outdated}
            </button>
            <span className={styles.reviewChipMuted}>
              {copy.managerBatchCandidates(summary.batchCandidates)}
            </span>
          </span>
        ))}
      </div>

      <div className={styles.toolbarRow}>
        <div className={styles.localeToggles}>
          {payload.targetLocales.map((locale) => (
            <button
              className={[styles.toggle, visibleTargets.has(locale) ? styles.toggleActive : ''].join(' ')}
              key={locale}
              type="button"
              aria-pressed={visibleTargets.has(locale)}
              data-translation-target-toggle={locale}
              onClick={() => {
                setVisibleTargets((previous) => {
                  const next = new Set(previous);
                  if (next.has(locale) && next.size > 1) next.delete(locale);
                  else next.add(locale);
                  return next;
                });
              }}
            >
              {locale}
            </button>
          ))}
        </div>
        <div className={styles.toolbarActions}>
          {shownTargetLocales.map((locale) => (
            <button
              className={[styles.button, styles.primaryButton].join(' ')}
              disabled={batchProgress !== null}
              key={locale}
              type="button"
              onClick={() => void translateBatch(locale)}
            >
              {copy.managerAiTranslateMissing(locale, reviewSummary.locales.find((item) => item.locale === locale)?.batchCandidates ?? 0)}
            </button>
          ))}
        </div>
      </div>

      <TranslationBatchProgress progress={batchProgress} copy={copy} />

      <div className={[styles.notice, error ? styles.noticeError : ''].join(' ')}>
        {error || notice || copy.managerNotice}
      </div>
    </section>
  );
}

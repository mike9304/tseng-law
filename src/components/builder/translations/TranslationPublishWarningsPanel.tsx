'use client';

/**
 * F119 — Translation publish warnings banner.
 *
 * Polls `/api/builder/translations/publish-warnings` every 30 seconds and
 * renders a severity-coded chip list above the translations dashboard.
 * Errors (broken-link) appear first so they can't be missed.
 */

import { useCallback, useEffect, useMemo, useState } from 'react';
import type {
  TranslationPublishWarning,
  TranslationPublishWarningsPayload,
} from '@/lib/builder/translations/publish-warning-types';
import { buildTranslationPublishWarningReviewQuery } from '@/lib/builder/translations/query';
import type { Locale } from '@/lib/locales';
import TranslationPublishWarningRow from './TranslationPublishWarningRow';
import { getTranslationCopy } from './translation-copy';

const POLL_MS = 30_000;

const BANNER_PALETTE: Record<
  TranslationPublishWarning['severity'],
  { bg: string; border: string }
> = {
  error: { bg: '#fef2f2', border: '#fecaca' },
  warning: { bg: '#fffbeb', border: '#fde68a' },
};

function errorName(error: unknown): string | undefined {
  if (typeof error !== 'object' || error === null || !('name' in error)) return undefined;
  return typeof error.name === 'string' ? error.name : undefined;
}

interface PanelProps {
  sourceLocale: Locale;
  routeLocale: Locale;
  /** Optional seed payload from SSR to avoid a flash before the first poll. */
  initialPayload?: TranslationPublishWarningsPayload;
}

export default function TranslationPublishWarningsPanel({
  sourceLocale,
  routeLocale,
  initialPayload,
}: PanelProps) {
  const copy = getTranslationCopy(routeLocale);
  const [warnings, setWarnings] = useState<TranslationPublishWarning[]>(
    initialPayload?.warnings ?? [],
  );
  const [lastSyncedAt, setLastSyncedAt] = useState<string | undefined>(
    initialPayload?.syncedAt,
  );
  const [error, setError] = useState<string | null>(null);
  const KIND_LABELS: Record<TranslationPublishWarning['kind'], string> = {
    untranslated: copy.publishMissing,
    outdated: copy.publishOutdated,
    'broken-link': copy.publishBrokenLink,
  };

  const fetchWarnings = useCallback(
    async (signal: AbortSignal): Promise<void> => {
      try {
        const response = await fetch(
          `/api/builder/translations/publish-warnings?sourceLocale=${encodeURIComponent(sourceLocale)}&locale=${encodeURIComponent(routeLocale)}`,
          { signal, cache: 'no-store' },
        );
        if (!response.ok) {
          setError(`HTTP ${response.status}`);
          return;
        }
        const data = (await response.json()) as TranslationPublishWarningsPayload;
        if (signal.aborted) return;
        setWarnings(data.warnings ?? []);
        setLastSyncedAt(data.syncedAt);
        setError(null);
      } catch (err) {
        if (errorName(err) === 'AbortError') return;
        setError(err instanceof Error ? err.message : copy.publishError);
      }
    },
    [copy.publishError, routeLocale, sourceLocale],
  );

  useEffect(() => {
    const controller = new AbortController();
    void fetchWarnings(controller.signal);
    const interval = setInterval(() => {
      void fetchWarnings(controller.signal);
    }, POLL_MS);
    return () => {
      controller.abort();
      clearInterval(interval);
    };
  }, [fetchWarnings]);

  const sorted = useMemo<TranslationPublishWarning[]>(() => {
    return [...warnings].sort((a, b) => {
      if (a.severity === b.severity) return a.pageId.localeCompare(b.pageId);
      return a.severity === 'error' ? -1 : 1;
    });
  }, [warnings]);

  if (sorted.length === 0 && !error) {
    return (
      <div
        role="status"
        style={{
          background: '#f0fdf4',
          border: '1px solid #bbf7d0',
          borderRadius: 8,
          padding: '10px 14px',
          marginBottom: 12,
          fontSize: 13,
          color: '#166534',
        }}
      >
        {copy.publishReady}
        {lastSyncedAt ? (
          <span style={{ marginLeft: 8, color: '#65a30d', fontSize: 11 }}>
            {copy.publishUpdated} {new Date(lastSyncedAt).toLocaleTimeString()}
          </span>
        ) : null}
      </div>
    );
  }

  const errorCount = sorted.filter((w) => w.severity === 'error').length;
  const warningCount = sorted.length - errorCount;
  const banner = errorCount > 0 ? BANNER_PALETTE.error : BANNER_PALETTE.warning;

  return (
    <div
      role="alert"
      style={{
        background: banner.bg,
        border: `1px solid ${banner.border}`,
        borderRadius: 8,
        padding: '12px 14px',
        marginBottom: 12,
        fontSize: 13,
        color: '#7f1d1d',
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 12,
        }}
      >
        <strong style={{ fontSize: 13 }}>
          {copy.publishBeforePublish(errorCount, warningCount)}
        </strong>
        <span style={{ fontSize: 11, color: '#7c2d12' }}>
          {error
            ? copy.dashboardSyncFailed(error)
            : lastSyncedAt
              ? `${copy.publishUpdated} ${new Date(lastSyncedAt).toLocaleTimeString()}`
              : copy.publishSyncing}
        </span>
      </div>
      <ul
        style={{
          listStyle: 'none',
          margin: '8px 0 0',
          padding: 0,
          display: 'flex',
          flexDirection: 'column',
          gap: 6,
        }}
      >
        {sorted.slice(0, 40).map((w, idx) => {
          const reviewQuery = buildTranslationPublishWarningReviewQuery(w, sourceLocale);
          return (
            <TranslationPublishWarningRow
              key={`${w.pageId}:${w.locale}:${w.kind}:${idx}`}
              warning={w}
              kindLabel={KIND_LABELS[w.kind]}
              reviewHref={`/${routeLocale}/admin-builder/translations?${reviewQuery}`}
              reviewLabel={copy.publishReviewAction}
            />
          );
        })}
      </ul>
      {sorted.length > 40 ? (
        <div style={{ marginTop: 6, fontSize: 11, color: '#7c2d12' }}>
          {copy.publishMore(sorted.length - 40)}
        </div>
      ) : null}
    </div>
  );
}

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
} from '@/lib/builder/translations/publish-warnings';
import type { Locale } from '@/lib/locales';

const POLL_MS = 30_000;

const KIND_LABELS: Record<TranslationPublishWarning['kind'], string> = {
  untranslated: 'Missing',
  outdated: 'Outdated',
  'broken-link': 'Broken link',
};

const SEVERITY_PALETTE: Record<
  TranslationPublishWarning['severity'],
  { bg: string; border: string; chipBg: string; chipFg: string }
> = {
  error: { bg: '#fef2f2', border: '#fecaca', chipBg: '#dc2626', chipFg: '#fff' },
  warning: { bg: '#fffbeb', border: '#fde68a', chipBg: '#b45309', chipFg: '#fff' },
};

interface PanelProps {
  sourceLocale: Locale;
  /** Optional seed payload from SSR to avoid a flash before the first poll. */
  initialPayload?: TranslationPublishWarningsPayload;
}

export default function TranslationPublishWarningsPanel({
  sourceLocale,
  initialPayload,
}: PanelProps) {
  const [warnings, setWarnings] = useState<TranslationPublishWarning[]>(
    initialPayload?.warnings ?? [],
  );
  const [lastSyncedAt, setLastSyncedAt] = useState<string | undefined>(
    initialPayload?.syncedAt,
  );
  const [error, setError] = useState<string | null>(null);

  const fetchWarnings = useCallback(
    async (signal: AbortSignal): Promise<void> => {
      try {
        const response = await fetch(
          `/api/builder/translations/publish-warnings?sourceLocale=${encodeURIComponent(sourceLocale)}`,
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
        if ((err as { name?: string })?.name === 'AbortError') return;
        setError(err instanceof Error ? err.message : 'unknown error');
      }
    },
    [sourceLocale],
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
        All translations look ready to publish.
        {lastSyncedAt ? (
          <span style={{ marginLeft: 8, color: '#65a30d', fontSize: 11 }}>
            Last checked {new Date(lastSyncedAt).toLocaleTimeString()}
          </span>
        ) : null}
      </div>
    );
  }

  const errorCount = sorted.filter((w) => w.severity === 'error').length;
  const warningCount = sorted.length - errorCount;
  const banner = errorCount > 0 ? SEVERITY_PALETTE.error : SEVERITY_PALETTE.warning;

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
          {errorCount > 0
            ? `${errorCount} blocker${errorCount > 1 ? 's' : ''}`
            : `${warningCount} warning${warningCount > 1 ? 's' : ''}`}
          {errorCount > 0 && warningCount > 0
            ? ` and ${warningCount} warning${warningCount > 1 ? 's' : ''}`
            : ''}
          {' '}before publish
        </strong>
        <span style={{ fontSize: 11, color: '#7c2d12' }}>
          {error
            ? `sync failed: ${error}`
            : lastSyncedAt
              ? `Updated ${new Date(lastSyncedAt).toLocaleTimeString()}`
              : 'syncing...'}
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
          const palette = SEVERITY_PALETTE[w.severity];
          return (
            <li
              key={`${w.pageId}:${w.locale}:${w.kind}:${idx}`}
              style={{
                display: 'flex',
                alignItems: 'baseline',
                gap: 8,
                fontSize: 12,
                color: '#1f2937',
              }}
            >
              <span
                style={{
                  display: 'inline-block',
                  background: palette.chipBg,
                  color: palette.chipFg,
                  borderRadius: 999,
                  fontSize: 10,
                  fontWeight: 600,
                  padding: '2px 8px',
                  textTransform: 'uppercase',
                  letterSpacing: 0.4,
                }}
              >
                {KIND_LABELS[w.kind]}
              </span>
              <span style={{ flex: 1 }}>{w.message}</span>
              <span style={{ color: '#64748b', fontSize: 11 }}>
                {w.locale}
              </span>
            </li>
          );
        })}
      </ul>
      {sorted.length > 40 ? (
        <div style={{ marginTop: 6, fontSize: 11, color: '#7c2d12' }}>
          +{sorted.length - 40} more...
        </div>
      ) : null}
    </div>
  );
}
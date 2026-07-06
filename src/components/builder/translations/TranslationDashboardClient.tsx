'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { usePathname } from 'next/navigation';
import type { Locale } from '@/lib/locales';
import type {
  TranslationDashboardPayload,
  TranslationRowStatus,
} from '@/lib/builder/translations/dashboard-model';
import {
  buildTranslationDashboardQuery,
  parseTranslationDashboardStatusFilter,
  type TranslationDashboardStatusFilter,
} from '@/lib/builder/translations/dashboard-query';
import { buildTranslationDashboardSummary } from '@/lib/builder/translations/dashboard-summary';
import { refreshTranslationDashboardPayload } from './dashboard-client-refresh';
import { getTranslationCopy } from './translation-copy';
import TranslationDashboardCoverageSection from './TranslationDashboardCoverageSection';
import TranslationDashboardOverview from './TranslationDashboardOverview';
import TranslationDashboardRowsTable from './TranslationDashboardRowsTable';

type StatusFilter = TranslationDashboardStatusFilter;
type RefreshStatus =
  | { readonly kind: 'idle' }
  | { readonly kind: 'loading' }
  | { readonly kind: 'error'; readonly message: string };

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
  initialStatus = 'all',
}: {
  initialPayload: TranslationDashboardPayload;
  routeLocale: Locale;
  initialStatus?: string;
}) {
  const pathname = usePathname();
  const copy = getTranslationCopy(routeLocale);
  const statusLabels: Record<TranslationRowStatus, string> = {
    untranslated: copy.dashboardMissing,
    draft: copy.dashboardDraft,
    published: copy.dashboardPublished,
    outdated: copy.dashboardOutdated,
  };
  const [payload, setPayload] = useState(initialPayload);
  const [refreshStatus, setRefreshStatus] = useState<RefreshStatus>({ kind: 'idle' });
  const [statusFilter, setStatusFilter] = useState<TranslationDashboardStatusFilter>(
    () => parseTranslationDashboardStatusFilter(initialStatus),
  );
  const dashboardSummary = useMemo(
    () => buildTranslationDashboardSummary(payload.rows, payload.targetLocales),
    [payload.rows, payload.targetLocales],
  );

  const filteredRows = useMemo(() => {
    if (statusFilter === 'all') return payload.rows;
    return payload.rows.filter((row) =>
      row.entries.some((entry) => entry.status === statusFilter),
    );
  }, [payload.rows, statusFilter]);

  const dashboardHref = useMemo(() => {
    if (!pathname) return '';
    const query = buildTranslationDashboardQuery({
      sourceLocale: payload.sourceLocale,
      statusFilter,
    });
    return `${pathname}?${query}`;
  }, [payload.sourceLocale, pathname, statusFilter]);

  useEffect(() => {
    if (typeof window === 'undefined' || !pathname) return;
    const nextQuery = buildTranslationDashboardQuery({
      sourceLocale: payload.sourceLocale,
      statusFilter,
    });
    const nextUrl = `${pathname}?${nextQuery}`;
    const currentUrl = `${window.location.pathname}${window.location.search}`;
    if (currentUrl !== nextUrl) {
      window.history.replaceState(null, '', nextUrl);
    }
  }, [payload.sourceLocale, pathname, statusFilter]);

  const resetDashboard = useCallback(() => {
    setStatusFilter('all');
  }, []);

  const refreshDashboard = useCallback(async () => {
    setRefreshStatus({ kind: 'loading' });
    try {
      const result = await refreshTranslationDashboardPayload(payload.sourceLocale);
      if (!result.ok) {
        setRefreshStatus({ kind: 'error', message: copy.dashboardSyncFailed(result.message) });
        return;
      }
      setPayload(result.payload);
      setRefreshStatus({ kind: 'idle' });
    } catch (refreshError) {
      const message = refreshError instanceof Error
        ? copy.dashboardSyncFailed(refreshError.message)
        : copy.managerTranslationUnavailable;
      setRefreshStatus({ kind: 'error', message });
    }
  }, [copy, payload.sourceLocale]);

  const isRefreshing = refreshStatus.kind === 'loading';
  const refreshErrorMessage = refreshStatus.kind === 'error' ? refreshStatus.message : '';

  return (
    <div>
      <TranslationDashboardOverview
        payload={payload}
        routeLocale={routeLocale}
        summary={dashboardSummary}
      />

      <TranslationDashboardCoverageSection
        routeLocale={routeLocale}
        sourceLocale={payload.sourceLocale}
        summaries={payload.coverageSummaries}
      />

      <div
        style={{
          display: 'flex',
          gap: 8,
          marginBottom: 12,
          flexWrap: 'wrap',
          alignItems: 'center',
        }}
      >
        <span style={{ fontSize: 12, color: '#64748b' }}>{copy.dashboardFilter}</span>
        {STATUS_FILTERS.map((status) => {
          const active = status === statusFilter;
          return (
            <button
              key={status}
              type="button"
              aria-pressed={active}
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
              {status === 'all' ? copy.dashboardAll : statusLabels[status]}
            </button>
          );
        })}
        <button
          type="button"
          onClick={resetDashboard}
          style={{
            fontSize: 12,
            padding: '4px 10px',
            borderRadius: 999,
            border: '1px solid #cbd5e1',
            background: '#fff',
            color: '#1f2937',
            cursor: 'pointer',
          }}
        >
          {copy.dashboardReset}
        </button>
        <a
          href={dashboardHref}
          rel="noreferrer"
          target="_blank"
          data-translation-dashboard-share-link="true"
          style={{
            fontSize: 12,
            padding: '4px 10px',
            borderRadius: 999,
            border: '1px solid #cbd5e1',
            background: '#fff',
            color: '#1e5a96',
            textDecoration: 'none',
            cursor: 'pointer',
          }}
        >
          {copy.dashboardShare}
        </a>
        <button
          type="button"
          onClick={() => void refreshDashboard()}
          disabled={isRefreshing}
          data-translation-dashboard-refresh="true"
          style={{
            fontSize: 12,
            padding: '4px 10px',
            borderRadius: 999,
            border: '1px solid #1e5a96',
            background: isRefreshing ? '#dbeafe' : '#1e5a96',
            color: isRefreshing ? '#1e5a96' : '#fff',
            cursor: isRefreshing ? 'wait' : 'pointer',
          }}
        >
          {isRefreshing ? copy.dashboardSyncing : copy.dashboardRefresh}
        </button>
        <span
          style={{ marginLeft: 'auto', fontSize: 12, color: '#64748b' }}
        >
          {copy.dashboardPageCount(filteredRows.length, payload.rows.length)}
        </span>
      </div>
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: 8,
          alignItems: 'center',
          margin: '-4px 0 12px',
          fontSize: 12,
          color: '#64748b',
        }}
      >
        <span data-translation-dashboard-last-sync="true">
          {copy.dashboardUpdated} {new Date(payload.syncedAt).toLocaleString()}
        </span>
        {refreshErrorMessage && (
          <span role="alert" style={{ color: '#b91c1c' }}>
            {refreshErrorMessage}
          </span>
        )}
      </div>

      <TranslationDashboardRowsTable
        rows={filteredRows}
        payload={payload}
        routeLocale={routeLocale}
        statusLabels={statusLabels}
      />
    </div>
  );
}

'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  buildOpsDashboardExportFile,
  buildOpsDashboardExportFilename,
  serializeOpsDashboardExportFile,
} from '@/lib/builder/ops/dashboard-export';
import type { OpsDashboardAlert, OpsDashboardSnapshot, OpsDashboardTrendPoint } from '@/lib/builder/ops/dashboard';
import type { UnifiedLogType } from '@/lib/builder/ops/logs-aggregator';
import type { OpsAlertReport } from '@/lib/builder/ops/alert-report-model';
import type { Locale } from '@/lib/locales';
import { OpsOverviewDetails } from './OpsOverviewDetails';
import { formatOpsDateTime, OpsOverviewMetrics } from './OpsOverviewMetrics';
import { OpsAlertReportView } from './OpsAlertReportView';
import { parseDashboardPayload, parseUnifiedLogTypeFilter, readResponsePayload } from './dashboardPayloads';

export default function OpsOverview({ locale }: { readonly locale: Locale }) {
  const [snapshot, setSnapshot] = useState<OpsDashboardSnapshot | null>(null);
  const [history, setHistory] = useState<readonly OpsDashboardTrendPoint[]>([]);
  const [alerts, setAlerts] = useState<readonly OpsDashboardAlert[]>([]);
  const [alertReport, setAlertReport] = useState<OpsAlertReport | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [error, setError] = useState('');
  const [typeFilter, setTypeFilter] = useState<'' | UnifiedLogType>('');

  const refreshSnapshot = useCallback(async () => {
    setRefreshing(true);
    setError('');
    try {
      const qs = typeFilter ? `?type=${encodeURIComponent(typeFilter)}` : '';
      const res = await fetch(`/api/builder/ops/dashboard${qs}`, { credentials: 'same-origin' });
      if (!res.ok) throw new Error(res.statusText);
      const payload = parseDashboardPayload(await readResponsePayload(res));
      setSnapshot(payload.snapshot);
      setHistory(payload.history);
      setAlerts(payload.alerts);
      setAlertReport(payload.alertReport);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'failed to load');
    } finally {
      setRefreshing(false);
    }
  }, [typeFilter]);

  useEffect(() => {
    void refreshSnapshot();
  }, [refreshSnapshot]);

  const exportPayload = useMemo(() => {
    if (!snapshot) return null;
    const limit = snapshot.logs.entries.length || 10;
    return buildOpsDashboardExportFile({
      snapshot,
      type: typeFilter,
      limit,
    });
  }, [snapshot, typeFilter]);

  const handleExport = useCallback(() => {
    if (!exportPayload || exporting) return;
    setExporting(true);
    try {
      const blob = new Blob([serializeOpsDashboardExportFile(exportPayload)], { type: 'application/json;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = buildOpsDashboardExportFilename(typeFilter);
      link.click();
      URL.revokeObjectURL(url);
    } finally {
      setExporting(false);
    }
  }, [exportPayload, exporting, typeFilter]);

  return (
    <div data-ops-overview="true" style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
        <label style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 12, color: '#64748b' }}>
          log scope
          <select
            value={typeFilter}
            onChange={(event) => setTypeFilter(parseUnifiedLogTypeFilter(event.currentTarget.value))}
            style={{ padding: '4px 8px', border: '1px solid #cbd5e1', borderRadius: 6, fontSize: 12 }}
          >
            <option value="">all</option>
            <option value="audit">audit</option>
            <option value="dev">dev</option>
            <option value="security">security</option>
            <option value="error">error</option>
          </select>
        </label>
        <button
          type="button"
          disabled={refreshing}
          onClick={() => void refreshSnapshot()}
          data-ops-overview-refresh="true"
          style={{
            padding: '6px 12px',
            border: 0,
            borderRadius: 6,
            fontSize: 12,
            fontWeight: 700,
            background: refreshing ? '#94a3b8' : '#0f172a',
            color: '#fff',
            cursor: refreshing ? 'not-allowed' : 'pointer',
          }}
        >
          {refreshing ? '수집 중...' : '지금 수집'}
        </button>
        <button
          type="button"
          disabled={!exportPayload || exporting}
          onClick={handleExport}
          style={{
            padding: '6px 12px',
            border: '1px solid #cbd5e1',
            background: '#fff',
            borderRadius: 6,
            fontSize: 12,
            cursor: !exportPayload || exporting ? 'not-allowed' : 'pointer',
          }}
        >
          {exporting ? '내보내는 중...' : '대시보드 JSON'}
        </button>
        <span style={{ fontSize: 12, color: '#64748b' }}>
          마지막 수집: {formatOpsDateTime(snapshot?.generatedAt ?? snapshot?.health.gatheredAt)}
        </span>
        {error ? <span style={{ marginLeft: 'auto', fontSize: 12, color: '#dc2626' }}>{error}</span> : null}
      </div>

      <OpsOverviewMetrics snapshot={snapshot} />

      <OpsAlertReportView report={alertReport} fallbackAlerts={alerts} />

      <OpsOverviewDetails locale={locale} snapshot={snapshot} history={history} />
    </div>
  );
}

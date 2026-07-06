'use client';

import { useMemo, useState } from 'react';
import {
  buildDevLogsExportFile,
  buildDevLogsExportFilename,
  serializeDevLogsExportFile,
} from '@/lib/builder/dev/logs-export';
import type { FunctionsCopy } from './functions-copy';
import type { BuilderDevLogEntry } from './functions-admin-types';
import { BUTTON_STYLE, CODE_STYLE, INPUT_STYLE } from './functions-admin-styles';

const DEV_LOG_LEVEL_FILTERS = ['all', 'log', 'info', 'warn', 'error'] as const;
type DevLogLevelFilter = (typeof DEV_LOG_LEVEL_FILTERS)[number];

interface FunctionRunLogsPanelProps {
  copy: FunctionsCopy;
  invokeResult: string;
  logs: BuilderDevLogEntry[];
}

function parseLevelFilter(value: string): DevLogLevelFilter {
  switch (value) {
    case 'log':
    case 'info':
    case 'warn':
    case 'error':
      return value;
    case 'all':
    default:
      return 'all';
  }
}

function matchesLevel(entry: BuilderDevLogEntry, level: DevLogLevelFilter): boolean {
  return level === 'all' || entry.level === level;
}

function matchesQuery(entry: BuilderDevLogEntry, query: string): boolean {
  const normalized = query.trim().toLowerCase();
  if (!normalized) return true;
  return [
    entry.level,
    entry.message,
    entry.reference ?? '',
    entry.timestamp,
  ].some((value) => value.toLowerCase().includes(normalized));
}

export function FunctionRunLogsPanel({ copy, invokeResult, logs }: FunctionRunLogsPanelProps) {
  const [level, setLevel] = useState<DevLogLevelFilter>('all');
  const [query, setQuery] = useState('');
  const [exportStatus, setExportStatus] = useState('');

  const filteredLogs = useMemo(
    () => logs.filter((entry) => matchesLevel(entry, level) && matchesQuery(entry, query)),
    [level, logs, query],
  );

  const exportLogs = () => {
    const exportFile = buildDevLogsExportFile({
      source: 'function',
      entries: filteredLogs,
      level,
      query,
    });
    const blob = new Blob([serializeDevLogsExportFile(exportFile)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = buildDevLogsExportFilename({
      source: 'function',
      entries: filteredLogs,
      level,
      query,
    });
    anchor.click();
    URL.revokeObjectURL(url);
    setExportStatus(copy.exportLogsStatus(filteredLogs.length));
  };

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, padding: 16, borderTop: '1px solid #e2e8f0' }}>
      <section>
        <h2 style={{ margin: '0 0 8px', fontSize: 14 }}>{copy.resultHeading}</h2>
        <pre style={{ ...CODE_STYLE, minHeight: 120, margin: 0 }} data-builder-dev-function-result="true">
          {invokeResult || copy.runPlaceholder}
        </pre>
      </section>
      <section>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, alignItems: 'center', marginBottom: 8 }}>
          <h2 style={{ margin: 0, fontSize: 14 }}>{copy.logsHeading}</h2>
          <select
            aria-label={copy.logLevelFilter}
            value={level}
            onChange={(event) => setLevel(parseLevelFilter(event.target.value))}
            style={{ ...INPUT_STYLE, padding: '7px 9px', marginLeft: 'auto' }}
            data-builder-dev-log-level-filter="true"
          >
            {DEV_LOG_LEVEL_FILTERS.map((option) => (
              <option key={option} value={option}>{copy.logLevelLabels[option]}</option>
            ))}
          </select>
          <input
            aria-label={copy.logSearch}
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder={copy.logSearch}
            style={{ ...INPUT_STYLE, padding: '7px 9px', minWidth: 150 }}
            data-builder-dev-log-search="true"
          />
          <button
            type="button"
            style={BUTTON_STYLE}
            onClick={exportLogs}
            disabled={filteredLogs.length === 0}
            data-builder-dev-log-export="true"
          >
            {copy.exportLogs}
          </button>
        </div>
        {exportStatus ? (
          <p style={{ margin: '0 0 8px', color: '#047857', fontSize: 12 }} data-builder-dev-log-export-status="true">
            {exportStatus}
          </p>
        ) : null}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }} data-builder-dev-function-logs="true">
          {filteredLogs.length === 0 ? (
            <p style={{ margin: 0, color: '#64748b', fontSize: 13 }}>{copy.noLogs}</p>
          ) : filteredLogs.map((entry) => (
            <div key={entry.id} style={{ border: '1px solid #e2e8f0', borderRadius: 8, padding: 8, fontSize: 12 }} data-builder-dev-log-entry="true">
              <strong>{entry.level.toUpperCase()}</strong>
              <span style={{ color: '#64748b' }}> {entry.reference ? `${entry.reference} · ` : ''}{new Date(entry.timestamp).toLocaleTimeString()}</span>
              <div style={{ color: '#334155', marginTop: 4 }}>{entry.message}</div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

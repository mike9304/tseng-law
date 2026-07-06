'use client';

import { useCallback, useEffect, useState } from 'react';
import type { BuilderCodeBlockCanvasNode } from '@/lib/builder/canvas/types';
import { isCanvasCodeSlotExecutableLanguage } from '@/lib/builder/dev/code-slot-languages';
import { buildCanvasCodeSlotLogReference } from '@/lib/builder/dev/code-slot-reference';
import type { UtilityAdvancedWidgetsCopy } from '../utility-advanced-widgets-copy';
import {
  functionOptionLabel,
  functionsFromResponse,
  historyLogsFromResponse,
  isCodeSlotRunResponse,
  logsFromRunResponse,
  stringifyCodeSlotResult,
  type CodeSlotRunStatus,
  type CodeSlotHistoryLogEntry,
  type FunctionsState,
} from './codeBlockRunModel';
import { CodeBlockStoredLogs } from './CodeBlockStoredLogs';
import styles from './CodeBlockInspector.module.css';

type CodeBlockInspectorCopy = UtilityAdvancedWidgetsCopy['codeBlock']['inspector'];

interface CodeBlockRunPanelProps {
  readonly codeNode: BuilderCodeBlockCanvasNode;
  readonly titleValue: string;
  readonly disabled: boolean;
  readonly copy: CodeBlockInspectorCopy;
  readonly onUpdate: (props: Record<string, unknown>) => void;
}

export default function CodeBlockRunPanel({
  codeNode,
  titleValue,
  disabled,
  copy,
  onUpdate,
}: CodeBlockRunPanelProps) {
  const [runStatus, setRunStatus] = useState<CodeSlotRunStatus>({ state: 'idle' });
  const [functionsState, setFunctionsState] = useState<FunctionsState>({ state: 'loading' });
  const [historyLogs, setHistoryLogs] = useState<readonly CodeSlotHistoryLogEntry[]>([]);
  const [historyLoadFailed, setHistoryLoadFailed] = useState(false);
  const runMode = codeNode.content.runMode ?? 'inline';
  const functionSlug = codeNode.content.functionSlug ?? '';
  const logReference = buildCanvasCodeSlotLogReference(
    titleValue,
    runMode === 'function' ? functionSlug : undefined,
  );
  const executableLanguage = isCanvasCodeSlotExecutableLanguage(codeNode.content.language);
  const inlineRunnable = executableLanguage && codeNode.content.code.trim().length > 0;
  const functionRunnable = functionSlug.trim().length > 0;
  const runnable = !disabled && (runMode === 'function' ? functionRunnable : inlineRunnable);
  const functions = functionsState.state === 'loaded' ? functionsState.functions : [];
  const selectedFunctionExists = functions.some((fn) => fn.slug === functionSlug);
  const disabledReason = runMode === 'function'
    ? copy.runCodeSlotFunctionEmpty
    : executableLanguage
      ? copy.runCodeSlotEmpty
      : copy.runCodeSlotUnsupported;

  useEffect(() => {
    let cancelled = false;
    async function loadFunctions(): Promise<void> {
      try {
        const response = await fetch('/api/builder/dev/functions', { cache: 'no-store' });
        const payload: unknown = await response.json();
        const list = functionsFromResponse(payload);
        if (!response.ok || !list) {
          if (!cancelled) setFunctionsState({ state: 'error' });
          return;
        }
        if (!cancelled) setFunctionsState({ state: 'loaded', functions: list });
      } catch {
        if (!cancelled) setFunctionsState({ state: 'error' });
      }
    }

    void loadFunctions();
    return () => {
      cancelled = true;
    };
  }, []);

  const loadHistoryLogs = useCallback(async (reference: string): Promise<void> => {
    try {
      const url = `/api/builder/dev/logs?source=function&limit=8&reference=${encodeURIComponent(reference)}`;
      const response = await fetch(url, { cache: 'no-store' });
      const payload: unknown = await response.json();
      const entries = historyLogsFromResponse(payload);
      if (!response.ok || !entries) {
        setHistoryLoadFailed(true);
        return;
      }
      setHistoryLogs(entries);
      setHistoryLoadFailed(false);
    } catch (error) {
      if (error instanceof Error) {
        setHistoryLoadFailed(true);
        return;
      }
      throw error;
    }
  }, []);

  useEffect(() => {
    void loadHistoryLogs(logReference);
  }, [loadHistoryLogs, logReference]);

  async function runCodeSlot(): Promise<void> {
    if (!runnable) return;
    setRunStatus({ state: 'running' });
    try {
      const requestBody = runMode === 'function'
        ? { mode: 'function', title: titleValue, functionSlug }
        : {
          mode: 'inline',
          title: titleValue,
          language: codeNode.content.language,
          code: codeNode.content.code,
        };
      const response = await fetch('/api/builder/dev/code-slots/run', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody),
      });
      const payload: unknown = await response.json();
      if (!isCodeSlotRunResponse(payload)) {
        setRunStatus({ state: 'error', error: copy.runCodeSlotInvalidResponse, logs: [] });
        return;
      }
      const logs = logsFromRunResponse(payload);
      if (!response.ok || !payload.ok) {
        setRunStatus({
          state: 'error',
          error: payload.error ?? copy.runCodeSlotFailed,
          logs,
        });
        return;
      }
      setRunStatus({
        state: 'success',
        result: stringifyCodeSlotResult(payload.result),
        logs,
      });
      await loadHistoryLogs(logReference);
    } catch (error) {
      setRunStatus({
        state: 'error',
        error: error instanceof Error ? error.message : copy.runCodeSlotFailed,
        logs: [],
      });
      await loadHistoryLogs(logReference);
    }
  }

  return (
    <section className={styles.runPanel} data-builder-code-slot-panel="true">
      <label className={styles.field}>
        <span className={styles.label}>{copy.runMode}</span>
        <select
          className={styles.control}
          value={runMode}
          disabled={disabled}
          data-builder-code-slot-mode="true"
          onChange={(event) => {
            onUpdate({ runMode: event.target.value === 'function' ? 'function' : 'inline' });
          }}
        >
          <option value="inline">{copy.runModeInline}</option>
          <option value="function">{copy.runModeFunction}</option>
        </select>
      </label>
      {runMode === 'function' ? (
        <label className={styles.field}>
          <span className={styles.label}>{copy.functionBinding}</span>
          <select
            className={styles.control}
            value={functionSlug}
            disabled={disabled || functionsState.state === 'loading'}
            data-builder-code-slot-function="true"
            onChange={(event) => onUpdate({ functionSlug: event.target.value })}
          >
            <option value="">{copy.functionBindingPlaceholder}</option>
            {functionSlug && !selectedFunctionExists ? (
              <option value={functionSlug}>{functionSlug}</option>
            ) : null}
            {functions.map((fn) => (
              <option key={fn.id} value={fn.slug}>
                {functionOptionLabel(fn, copy.functionDisabledSuffix)}
              </option>
            ))}
          </select>
        </label>
      ) : null}
      {functionsState.state === 'loading' && runMode === 'function' ? (
        <p className={styles.caption}>{copy.runCodeSlotFunctionLoading}</p>
      ) : null}
      {functionsState.state === 'error' && runMode === 'function' ? (
        <p className={styles.caption}>{copy.runCodeSlotFunctionLoadFailed}</p>
      ) : null}
      <button
        className={styles.runButton}
        type="button"
        disabled={!runnable || runStatus.state === 'running'}
        data-builder-code-slot-run="true"
        onClick={() => {
          void runCodeSlot();
        }}
      >
        {runStatus.state === 'running' ? copy.runningCodeSlot : copy.runCodeSlot}
      </button>
      {!runnable ? (
        <p className={styles.caption}>{disabledReason}</p>
      ) : null}
      {runStatus.state === 'success' ? (
        <div className={styles.runOutput} data-builder-code-slot-result="true">
          <span className={styles.runStatus}>{copy.runCodeSlotResult}</span>
          <pre>{runStatus.result}</pre>
        </div>
      ) : null}
      {runStatus.state === 'error' ? (
        <div className={styles.runOutput} data-error="true" data-builder-code-slot-result="true">
          <span className={styles.runStatus}>{copy.runCodeSlotError}</span>
          <pre>{runStatus.error}</pre>
        </div>
      ) : null}
      {runStatus.state === 'success' || runStatus.state === 'error' ? (
        <div className={styles.runLogs} data-builder-code-slot-logs="true">
          <span className={styles.runStatus}>{copy.runCodeSlotLogs}</span>
          {runStatus.logs.length > 0 ? (
            <ul>
              {runStatus.logs.map((message) => (
                <li key={message}>{message}</li>
              ))}
            </ul>
          ) : (
            <p className={styles.caption}>{copy.runCodeSlotNoLogs}</p>
          )}
        </div>
      ) : null}
      <CodeBlockStoredLogs
        emptyLabel={copy.runCodeSlotNoLogs}
        failed={historyLoadFailed}
        failedLabel={copy.runCodeSlotHistoryLoadFailed}
        label={copy.runCodeSlotHistory}
        logs={historyLogs}
      />
    </section>
  );
}

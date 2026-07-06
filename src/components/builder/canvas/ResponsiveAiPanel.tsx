'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import styles from './SandboxPage.module.css';
import type {
  ResponsiveSuggestion,
  ResponsiveTargetViewport,
} from '@/lib/builder/ai-generator/responsive-rules';
import type { BuilderCanvasDocument } from '@/lib/builder/canvas/types';
import type { Locale } from '@/lib/locales';
import { getResponsiveAiCopy } from './responsive-ai-copy';

interface ResponsiveAiPanelProps {
  pageId: string;
  locale: Locale;
  targetViewport: ResponsiveTargetViewport;
  getAnalysisCanvas: () => BuilderCanvasDocument;
  canUndoLast: boolean;
  onPreview: (suggestions: ResponsiveSuggestion[]) => void;
  onCancelPreview: () => void;
  onCommitPreview: () => void;
  onApply: (suggestions: ResponsiveSuggestion[]) => void;
  onUndoLast: () => void;
  onClose: () => void;
}

type SuggestionState = 'pending' | 'applied' | 'discarded';

interface PanelRow {
  suggestion: ResponsiveSuggestion;
  state: SuggestionState;
}

type ResponsiveScanResponse =
  | { ok: true; suggestions: ResponsiveSuggestion[] }
  | { ok: false; error?: string; message?: string };

function suggestionKey(suggestion: ResponsiveSuggestion): string {
  return `${suggestion.nodeId}:${suggestion.reason}`;
}

export default function ResponsiveAiPanel({
  pageId,
  locale,
  targetViewport,
  getAnalysisCanvas,
  canUndoLast,
  onPreview,
  onCancelPreview,
  onCommitPreview,
  onApply,
  onUndoLast,
  onClose,
}: ResponsiveAiPanelProps) {
  const [rows, setRows] = useState<PanelRow[]>([]);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasFetched, setHasFetched] = useState(false);
  const [previewKeys, setPreviewKeys] = useState<readonly string[]>([]);
  const [lastAppliedKeys, setLastAppliedKeys] = useState<readonly string[]>([]);
  const previewKeysRef = useRef<readonly string[]>([]);
  const requestIdRef = useRef(0);
  const copy = useMemo(() => getResponsiveAiCopy(locale), [locale]);

  const pendingRows = useMemo(() => rows.filter((row) => row.state === 'pending'), [rows]);
  const appliedCount = useMemo(() => rows.filter((row) => row.state === 'applied').length, [rows]);
  const hasPreview = previewKeys.length > 0;

  const setPreviewKeyList = useCallback((keys: readonly string[]) => {
    previewKeysRef.current = keys;
    setPreviewKeys(keys);
  }, []);

  useEffect(() => {
    requestIdRef.current += 1;
    if (previewKeysRef.current.length > 0) {
      onCancelPreview();
      setPreviewKeyList([]);
    }
    setRows([]);
    setPending(false);
    setError(null);
    setHasFetched(false);
    setLastAppliedKeys([]);
  }, [onCancelPreview, pageId, setPreviewKeyList, targetViewport]);

  useEffect(() => () => {
    requestIdRef.current += 1;
    if (previewKeysRef.current.length > 0) {
      onCancelPreview();
      previewKeysRef.current = [];
    }
  }, [onCancelPreview]);

  const fetchSuggestions = useCallback(async () => {
    if (hasPreview) {
      onCancelPreview();
      setPreviewKeyList([]);
    }
    const requestId = requestIdRef.current + 1;
    requestIdRef.current = requestId;
    setPending(true);
    setError(null);
    try {
      const response = await fetch('/api/builder/ai-generator/responsive', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pageId, locale, targetViewport, canvas: getAnalysisCanvas() }),
      });
      const body: ResponsiveScanResponse | null = await response.json().catch(() => null);
      if (requestIdRef.current !== requestId) return;
      if (!response.ok || !body || body.ok !== true) {
        const message = body && body.ok === false
          ? body.message ?? body.error ?? copy.requestFailedError
          : copy.requestFailedError;
        setError(message);
        return;
      }
      setRows(body.suggestions.map((suggestion) => ({ suggestion, state: 'pending' as SuggestionState })));
      setLastAppliedKeys([]);
      setHasFetched(true);
    } catch (err) {
      if (requestIdRef.current !== requestId) return;
      setError(err instanceof Error ? err.message : copy.callFailedError);
    } finally {
      if (requestIdRef.current === requestId) setPending(false);
    }
  }, [copy, getAnalysisCanvas, hasPreview, locale, onCancelPreview, pageId, setPreviewKeyList, targetViewport]);

  const previewRows = useCallback((targetRows: readonly PanelRow[]) => {
    if (targetRows.length === 0) return;
    if (previewKeys.length > 0) onCancelPreview();
    onPreview(targetRows.map((row) => row.suggestion));
    setPreviewKeyList(targetRows.map((row) => suggestionKey(row.suggestion)));
  }, [onCancelPreview, onPreview, previewKeys.length, setPreviewKeyList]);

  const cancelPreview = useCallback(() => {
    if (previewKeys.length === 0) return;
    onCancelPreview();
    setPreviewKeyList([]);
  }, [onCancelPreview, previewKeys.length, setPreviewKeyList]);

  const markRowsApplied = useCallback((keys: readonly string[]) => {
    setRows((prev) =>
      prev.map((entry) =>
        keys.includes(suggestionKey(entry.suggestion)) ? { ...entry, state: 'applied' } : entry,
      ),
    );
    setLastAppliedKeys(keys);
    setPreviewKeyList([]);
  }, [setPreviewKeyList]);

  const applyRows = useCallback((targetRows: readonly PanelRow[]) => {
    if (targetRows.length === 0) return;
    const keys = targetRows.map((row) => suggestionKey(row.suggestion));
    const previewMatchesTarget =
      previewKeys.length === keys.length
      && keys.every((key) => previewKeys.includes(key));

    if (previewKeys.length > 0) {
      if (previewMatchesTarget) {
        onCommitPreview();
      } else {
        onCancelPreview();
        onApply(targetRows.map((row) => row.suggestion));
      }
    } else {
      onApply(targetRows.map((row) => row.suggestion));
    }

    markRowsApplied(keys);
  }, [markRowsApplied, onApply, onCancelPreview, onCommitPreview, previewKeys]);

  const applyOne = useCallback(
    (nodeId: string) => {
      const row = rows.find((entry) => entry.suggestion.nodeId === nodeId && entry.state === 'pending');
      if (!row) return;
      applyRows([row]);
    },
    [applyRows, rows],
  );

  const previewOne = useCallback(
    (nodeId: string) => {
      const row = rows.find((entry) => entry.suggestion.nodeId === nodeId && entry.state === 'pending');
      if (!row) return;
      previewRows([row]);
    },
    [previewRows, rows],
  );

  const discardOne = useCallback((nodeId: string) => {
    const row = rows.find((entry) => entry.suggestion.nodeId === nodeId);
    if (row && previewKeys.includes(suggestionKey(row.suggestion))) cancelPreview();
    setRows((prev) =>
      prev.map((entry) =>
        entry.suggestion.nodeId === nodeId ? { ...entry, state: 'discarded' } : entry,
      ),
    );
  }, [cancelPreview, previewKeys, rows]);

  const applyAll = useCallback(() => {
    applyRows(pendingRows);
  }, [applyRows, pendingRows]);

  const previewAll = useCallback(() => {
    previewRows(pendingRows);
  }, [pendingRows, previewRows]);

  const undoLast = useCallback(() => {
    if (!canUndoLast || lastAppliedKeys.length === 0) return;
    if (previewKeys.length > 0) cancelPreview();
    onUndoLast();
    setRows((prev) =>
      prev.map((entry) =>
        lastAppliedKeys.includes(suggestionKey(entry.suggestion))
          ? { ...entry, state: 'pending' }
          : entry,
      ),
    );
    setLastAppliedKeys([]);
  }, [canUndoLast, cancelPreview, lastAppliedKeys, onUndoLast, previewKeys.length]);

  const closePanel = useCallback(() => {
    if (previewKeys.length > 0) onCancelPreview();
    setPreviewKeyList([]);
    onClose();
  }, [onCancelPreview, onClose, previewKeys.length, setPreviewKeyList]);

  return (
    <div
      role="dialog"
      aria-label={copy.dialogLabel}
      data-builder-responsive-ai-panel="true"
      data-surface="topbar"
      className={styles.inlineTextAiPanel}
      onMouseDown={(event) => event.stopPropagation()}
      onPointerDown={(event) => event.stopPropagation()}
    >
      <header className={styles.inlineTextAiPanelHeader}>
        <strong>{copy.title(targetViewport)}</strong>
        <button
          type="button"
          className={styles.inlineTextAiPanelClose}
          aria-label={copy.closeLabel}
          onClick={closePanel}
        >
          ×
        </button>
      </header>

      <p className={styles.inlineTextAiPreviewText}>
        {copy.intro(targetViewport)}
      </p>

      {error ? (
        <p role="alert" className={styles.inlineTextAiError}>
          {error}
        </p>
      ) : null}

      <div className={styles.inlineTextAiActionsRow}>
        <button
          type="button"
          className={styles.inlineTextAiPrimaryButton}
          onClick={fetchSuggestions}
          disabled={pending}
          data-builder-responsive-analyze="true"
        >
          {pending ? copy.analyzingLabel : hasFetched ? copy.reanalyzeLabel : copy.analyzeLabel}
        </button>
        <button
          type="button"
          className={styles.inlineTextAiPrimaryButton}
          onClick={applyAll}
          disabled={pendingRows.length === 0 || pending}
          data-builder-responsive-apply-all="true"
        >
          {copy.applyAllLabel(pendingRows.length)}
        </button>
        <button
          type="button"
          className={styles.inlineTextAiGhostButton}
          onClick={previewAll}
          disabled={pendingRows.length === 0 || pending}
          data-builder-responsive-preview-all="true"
        >
          {copy.previewAllLabel(pendingRows.length)}
        </button>
        <button
          type="button"
          className={styles.inlineTextAiGhostButton}
          onClick={cancelPreview}
          disabled={!hasPreview || pending}
          data-builder-responsive-cancel-preview="true"
        >
          {copy.cancelPreviewLabel}
        </button>
        <button
          type="button"
          className={styles.inlineTextAiGhostButton}
          onClick={undoLast}
          disabled={!canUndoLast || lastAppliedKeys.length === 0 || pending}
          data-builder-responsive-undo-last="true"
          title={canUndoLast ? copy.undoLastLabel : copy.undoLastDisabledLabel}
        >
          {copy.undoLastLabel}
        </button>
        {appliedCount > 0 ? (
          <span className={styles.inlineTextAiHistoryLabel}>{copy.appliedCountLabel(appliedCount)}</span>
        ) : null}
      </div>

      <ul className={styles.inlineTextAiPreview} aria-live="polite">
        {rows.length === 0 && hasFetched && !pending ? (
          <li className={styles.inlineTextAiPreviewText}>{copy.emptySuggestionsLabel}</li>
        ) : null}
        {rows.map(({ suggestion, state }) => (
          <li
            key={`${suggestion.nodeId}-${suggestion.reason}`}
            data-builder-responsive-suggestion-row="true"
            data-state={state}
            data-preview={previewKeys.includes(suggestionKey(suggestion)) ? 'true' : 'false'}
            className={styles.responsiveAiSuggestionRow}
          >
            <strong>{copy.reasonLabels[suggestion.reason]}</strong>
            <span className={styles.responsiveAiSuggestionSummary}>{suggestion.summary}</span>
            <code className={styles.responsiveAiSuggestionNode}>{copy.nodePrefix}: {suggestion.nodeId}</code>
            {state === 'pending' ? (
              <div className={styles.responsiveAiSuggestionActions}>
                <button
                  type="button"
                  className={styles.inlineTextAiGhostButton}
                  onClick={() => previewOne(suggestion.nodeId)}
                  disabled={pending}
                  data-builder-responsive-preview-one="true"
                >
                  {copy.previewLabel}
                </button>
                <button
                  type="button"
                  className={styles.inlineTextAiPrimaryButton}
                  onClick={() => applyOne(suggestion.nodeId)}
                  data-builder-responsive-apply-one="true"
                >
                  {copy.applyLabel}
                </button>
                <button
                  type="button"
                  className={styles.inlineTextAiGhostButton}
                  onClick={() => discardOne(suggestion.nodeId)}
                >
                  {copy.discardLabel}
                </button>
              </div>
            ) : (
              <span className={styles.responsiveAiSuggestionState}>{copy.stateLabels[state]}</span>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

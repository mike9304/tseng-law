'use client';

import { useCallback, useMemo, useState } from 'react';
import type { Locale } from '@/lib/locales';
import styles from '@/components/builder/canvas/SandboxPage.module.css';
import {
  CODE_ASSISTANT_ACTIONS,
  applySelectedDiffHunks,
  type CodeAssistantAction,
  type CodeAssistantLanguage,
  type UnifiedDiffHunk,
} from '@/lib/builder/ai-generator/code-assistant';
import { getCodeAssistantCopy } from './code-assistant-copy';

interface CodeAssistantPanelProps {
  locale: Locale;
  code: string;
  language?: CodeAssistantLanguage;
  contextHint?: string;
  onApplyFix: (nextCode: string) => void;
  onClose: () => void;
}

interface CodeAssistantResponse {
  ok: true;
  model: string;
  action: CodeAssistantAction;
  language: CodeAssistantLanguage;
  result: string;
  fixedCode?: string;
  diff?: string;
  diffHunks?: UnifiedDiffHunk[];
}

type ServerError = { ok: false; error?: string; message?: string };
type ReviewMode = 'current' | 'suggested' | 'diff';

function countLines(value: string): number {
  if (!value) return 0;
  return value.split('\n').length;
}

function summarizeDiff(
  diff: string | undefined,
  emptyLabel: string,
  diffSummary: (additions: number, removals: number) => string,
): string {
  if (!diff) return emptyLabel;
  let additions = 0;
  let removals = 0;
  for (const line of diff.split('\n')) {
    if (line.startsWith('+++') || line.startsWith('---')) continue;
    if (line.startsWith('+')) additions += 1;
    if (line.startsWith('-')) removals += 1;
  }
  return diffSummary(additions, removals);
}

export default function CodeAssistantPanel({
  locale,
  code,
  language = 'ts',
  contextHint,
  onApplyFix,
  onClose,
}: CodeAssistantPanelProps) {
  const copy = getCodeAssistantCopy(locale);
  const [action, setAction] = useState<CodeAssistantAction>('explain');
  const [context, setContext] = useState(contextHint ?? '');
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<CodeAssistantResponse | null>(null);
  const [reviewMode, setReviewMode] = useState<ReviewMode>('suggested');
  const [selectedHunkIds, setSelectedHunkIds] = useState<string[]>([]);

  const runRequest = useCallback(async () => {
    if (!code.trim()) {
      setError(copy.errorNoCode);
      return;
    }
    setPending(true);
    setError(null);
    try {
      const response = await fetch('/api/builder/ai-generator/code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code,
          action,
          language,
          ...(context.trim() ? { context: context.trim() } : null),
        }),
      });
      const body = (await response.json().catch(() => null)) as CodeAssistantResponse | ServerError | null;
      if (!response.ok || !body || body.ok !== true) {
        const message = body && body.ok === false
          ? body.message ?? body.error ?? copy.errorRequestFailed
          : copy.errorRequestFailed;
        setError(message);
        return;
      }
      setResult(body);
      setReviewMode(body.fixedCode ? 'suggested' : 'current');
      setSelectedHunkIds((body.diffHunks ?? []).map((hunk) => hunk.id));
    } catch (err) {
      setError(err instanceof Error ? err.message : copy.errorRequestFailed);
    } finally {
      setPending(false);
    }
  }, [action, code, context, copy.errorNoCode, copy.errorRequestFailed, language]);

  const handleApplyFix = useCallback(() => {
    if (!result?.fixedCode) return;
    const diffHunks = result.diffHunks ?? [];
    const selectedCode = diffHunks.length > 0
      ? applySelectedDiffHunks(code, diffHunks, selectedHunkIds)
      : result.fixedCode;
    if (!selectedCode) {
      setError(copy.errorNoHunks);
      return;
    }
    onApplyFix(selectedCode);
    onClose();
  }, [code, copy.errorNoHunks, onApplyFix, onClose, result, selectedHunkIds]);

  const toggleHunk = useCallback((hunkId: string) => {
    setSelectedHunkIds((current) => (
      current.includes(hunkId)
        ? current.filter((id) => id !== hunkId)
        : [...current, hunkId]
    ));
  }, []);

  const canApply = !!result?.fixedCode && result.fixedCode !== code;
  const reviewText = useMemo(() => {
    if (!result) return code;
    if (reviewMode === 'current') return code;
    if (reviewMode === 'diff') return result.diff ?? copy.noDiffAvailable;
    return result.fixedCode ?? code;
  }, [code, result, reviewMode]);
  const reviewLabel = reviewMode === 'current' ? copy.current : reviewMode === 'diff' ? copy.selectedDiffLabel : copy.suggested;
  const diffHunks = result?.diffHunks ?? [];
  const canSelectHunks = diffHunks.length > 1;
  const selectedHunkCount = diffHunks.filter((hunk) => selectedHunkIds.includes(hunk.id)).length;

  return (
    <div
      role="dialog"
      aria-label={copy.title}
      data-builder-ai-code-panel="true"
      className={styles.inlineTextAiPanel}
      onMouseDown={(event) => event.stopPropagation()}
      onPointerDown={(event) => event.stopPropagation()}
    >
      <header className={styles.inlineTextAiPanelHeader}>
        <strong>{copy.title}</strong>
        <button
          type="button"
          className={styles.inlineTextAiPanelClose}
          aria-label={copy.closeLabel}
          onClick={onClose}
        >
          ×
        </button>
      </header>

      <div role="radiogroup" aria-label={copy.actionGroupLabel} className={styles.inlineTextAiActions}>
        {CODE_ASSISTANT_ACTIONS.map((value) => (
          <button
            key={value}
            type="button"
            role="radio"
            aria-checked={action === value}
            data-active={action === value ? 'true' : 'false'}
            className={styles.inlineTextAiActionChip}
            onClick={() => setAction(value)}
          >
            {copy.actionLabels[value]}
          </button>
        ))}
      </div>

      <label className={styles.inlineTextAiField}>
        <span>{copy.contextLabel}</span>
        <textarea
          value={context}
          onChange={(event) => setContext(event.target.value)}
          rows={2}
          maxLength={2000}
          placeholder={copy.contextPlaceholder}
        />
      </label>

      {error ? (
        <p role="alert" className={styles.inlineTextAiError}>
          {error}
        </p>
      ) : null}

      <div className={styles.inlineTextAiActionsRow}>
        <button
          type="button"
          className={styles.inlineTextAiPrimaryButton}
          onClick={runRequest}
          disabled={pending}
        >
          {pending ? copy.running : result ? copy.rerun : copy.run}
        </button>
      </div>

      {result ? (
        <div className={styles.inlineTextAiPreview} aria-live="polite">
          <header className={styles.inlineTextAiPreviewHeader}>
            <span>{copy.resultLabels[result.action]}</span>
            <span>{result.language.toUpperCase()}</span>
          </header>
          <p className={styles.inlineTextAiPreviewText} style={{ whiteSpace: 'pre-wrap' }}>
            {result.result}
          </p>
          {result.fixedCode ? (
            <div style={{ marginTop: 10 }} data-builder-ai-code-review="true">
              <div className={styles.inlineTextAiActionsRow} style={{ marginBottom: 8 }}>
                {(['current', 'suggested', 'diff'] as const).map((mode) => (
                  <button
                    key={mode}
                    type="button"
                    className={reviewMode === mode ? styles.inlineTextAiPrimaryButton : styles.inlineTextAiGhostButton}
                    aria-pressed={reviewMode === mode}
                    data-builder-ai-code-review-mode={mode}
                    onClick={() => setReviewMode(mode)}
                  >
                    {mode === 'current' ? copy.current : mode === 'suggested' ? copy.suggested : copy.diff}
                  </button>
                ))}
                <span className={styles.inlineTextAiHistoryLabel} data-builder-ai-code-diff-summary="true">
                  {summarizeDiff(result.diff, copy.diffSummaryNone, copy.diffSummary)}
                </span>
              </div>
              <header className={styles.inlineTextAiPreviewHeader}>
                <span>{reviewLabel}</span>
                <span>{copy.linesLabel(countLines(reviewText))}</span>
              </header>
              <pre
                className={styles.inlineTextAiPreviewText}
                style={{
                  fontFamily: 'ui-monospace, Menlo, monospace',
                  fontSize: 12,
                  background: 'rgba(15, 23, 42, 0.04)',
                  padding: 12,
                  borderRadius: 8,
                  overflowX: 'auto',
                  whiteSpace: 'pre',
                  maxHeight: 240,
                }}
                data-builder-ai-code-review-text="true"
              >
                {reviewText}
              </pre>
              {canSelectHunks ? (
                <div
                  className={styles.inlineTextAiPreviewText}
                  style={{ display: 'grid', gap: 8, marginTop: 10 }}
                  data-builder-ai-code-hunks="true"
                >
                  <strong>{copy.selectedDiffLabel}</strong>
                  {diffHunks.map((hunk, index) => {
                    const added = hunk.lines.filter((line) => line.type === 'insert').length;
                    const removed = hunk.lines.filter((line) => line.type === 'delete').length;
                    const checked = selectedHunkIds.includes(hunk.id);
                    return (
                      <label
                        key={hunk.id}
                        style={{
                          alignItems: 'center',
                          border: '1px solid rgba(148, 163, 184, 0.45)',
                          borderRadius: 8,
                          display: 'flex',
                          gap: 8,
                          padding: '8px 10px',
                        }}
                      >
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={() => toggleHunk(hunk.id)}
                          data-builder-ai-code-hunk-toggle={hunk.id}
                        />
                        <span>
                          {copy.hunkLabel(index + 1, hunk.oldStart, added, removed)}
                        </span>
                      </label>
                    );
                  })}
                  <span data-builder-ai-code-hunk-summary="true">
                    {copy.hunksSummary(selectedHunkCount, diffHunks.length)}
                  </span>
                </div>
              ) : null}
              {canApply ? (
                <div className={styles.inlineTextAiFooter}>
                  <button
                    type="button"
                    className={styles.inlineTextAiPrimaryButton}
                    onClick={handleApplyFix}
                    disabled={canSelectHunks && selectedHunkCount === 0}
                    data-builder-ai-code-apply="true"
                  >
                    {canSelectHunks && selectedHunkCount < diffHunks.length ? copy.applySelected : copy.applySuggested}
                  </button>
                </div>
              ) : (
                <p className={styles.inlineTextAiPreviewText}>{copy.noChanges}</p>
              )}
            </div>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}

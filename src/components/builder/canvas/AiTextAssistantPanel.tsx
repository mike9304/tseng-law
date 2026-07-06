'use client';

import { useCallback, useMemo, useRef, useState } from 'react';
import {
  TEXT_ASSISTANT_ACTIONS,
  TEXT_ASSISTANT_TONES,
  TEXT_ASSISTANT_TARGET_LOCALES,
  type TextAssistantAction,
  type TextAssistantTone,
  type TextAssistantTargetLocale,
} from '@/lib/builder/ai-generator/text-assistant';
import styles from './SandboxPage.module.css';
import { getAiTextAssistantCopy } from './ai-text-assistant-copy';

interface AiTextAssistantPanelProps {
  sourceText: string;
  sourceLocale: TextAssistantTargetLocale;
  siteName?: string;
  brandTone?: string;
  elementHint?: string;
  placement?: 'above' | 'below';
  onApply: (text: string) => void;
  onClose: () => void;
}

interface HistoryEntry {
  id: string;
  text: string;
  action: TextAssistantAction;
  tone?: TextAssistantTone;
  targetLocale?: TextAssistantTargetLocale;
  customPrompt?: string;
  model: string;
}

interface RunPayload {
  text: string;
  action: TextAssistantAction;
  sourceLocale: TextAssistantTargetLocale;
  targetLocale?: TextAssistantTargetLocale;
  tone?: TextAssistantTone;
  customPrompt?: string;
  siteName?: string;
  brandTone?: string;
  elementHint?: string;
}

function newHistoryId(): string {
  return `ai-text-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`;
}

export default function AiTextAssistantPanel({
  sourceText,
  sourceLocale,
  siteName,
  brandTone,
  elementHint,
  placement = 'below',
  onApply,
  onClose,
}: AiTextAssistantPanelProps) {
  const [action, setAction] = useState<TextAssistantAction>('rewrite');
  const [tone, setTone] = useState<TextAssistantTone>('formal');
  const [targetLocale, setTargetLocale] = useState<TextAssistantTargetLocale>(
    sourceLocale === 'ko' ? 'en' : 'ko',
  );
  const [customPrompt, setCustomPrompt] = useState('');
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [showOriginal, setShowOriginal] = useState(false);
  const abortRef = useRef<AbortController | null>(null);
  const copy = useMemo(() => getAiTextAssistantCopy(sourceLocale), [sourceLocale]);

  const currentEntry = historyIndex >= 0 ? history[historyIndex] ?? null : null;
  const canApply = !!currentEntry && currentEntry.text !== sourceText && !pending;
  const previewText = showOriginal || !currentEntry ? sourceText : currentEntry.text;

  const sourceLengthLabel = useMemo(() => copy.characterCountLabel(sourceText.length), [copy, sourceText.length]);
  const previewLengthLabel = useMemo(() => copy.characterCountLabel(previewText.length), [copy, previewText.length]);

  const runRequest = useCallback(async () => {
    if (!sourceText.trim()) {
      setError(copy.emptySourceError);
      return;
    }
    setError(null);
    setPending(true);
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    const payload: RunPayload = {
      text: sourceText,
      action,
      sourceLocale,
      ...(action === 'translate' ? { targetLocale } : null),
      ...(action === 'tone' ? { tone } : null),
      ...(customPrompt.trim() ? { customPrompt: customPrompt.trim() } : null),
      ...(siteName ? { siteName } : null),
      ...(brandTone ? { brandTone } : null),
      ...(elementHint ? { elementHint } : null),
    };

    try {
      const response = await fetch('/api/builder/ai-generator/text', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
        signal: controller.signal,
      });
      const body = (await response.json().catch(() => null)) as
        | { ok: true; text: string; model: string; action: TextAssistantAction; tone?: TextAssistantTone; targetLocale?: TextAssistantTargetLocale }
        | { ok: false; error?: string; message?: string }
        | null;
      if (!response.ok || !body || body.ok !== true) {
        const message = body && body.ok === false ? body.message ?? body.error ?? copy.requestFailedError : copy.requestFailedError;
        setError(typeof message === 'string' ? message : copy.callFailedError);
        return;
      }
      const entry: HistoryEntry = {
        id: newHistoryId(),
        text: body.text,
        action,
        tone: action === 'tone' ? tone : undefined,
        targetLocale: action === 'translate' ? targetLocale : undefined,
        customPrompt: customPrompt.trim() || undefined,
        model: body.model,
      };
      setHistory((prev) => {
        const truncated = prev.slice(0, historyIndex + 1);
        return [...truncated, entry];
      });
      setHistoryIndex((prev) => prev + 1);
      setShowOriginal(false);
    } catch (err) {
      if ((err as Error)?.name === 'AbortError') return;
      setError((err as Error)?.message ?? copy.callExceptionError);
    } finally {
      setPending(false);
    }
  }, [action, brandTone, copy, customPrompt, elementHint, historyIndex, siteName, sourceLocale, sourceText, targetLocale, tone]);

  const handleApply = useCallback(() => {
    if (!currentEntry) return;
    onApply(currentEntry.text);
    onClose();
  }, [currentEntry, onApply, onClose]);

  const handleUndo = useCallback(() => {
    setHistoryIndex((prev) => (prev <= 0 ? -1 : prev - 1));
    setShowOriginal(false);
  }, []);

  const handleRedo = useCallback(() => {
    setHistoryIndex((prev) => (prev >= history.length - 1 ? prev : prev + 1));
    setShowOriginal(false);
  }, [history.length]);

  const handleDiscard = useCallback(() => {
    abortRef.current?.abort();
    setHistory([]);
    setHistoryIndex(-1);
    setShowOriginal(false);
    setError(null);
  }, []);

  return (
    <div
      role="dialog"
      aria-label={copy.dialogLabel}
      data-builder-ai-text-panel="true"
      className={styles.inlineTextAiPanel}
      data-placement={placement}
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
        {TEXT_ASSISTANT_ACTIONS.map((value) => (
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

      {action === 'translate' ? (
        <label className={styles.inlineTextAiField}>
          <span>{copy.targetLocaleLabel}</span>
          <select
            value={targetLocale}
            onChange={(event) => setTargetLocale(event.target.value as TextAssistantTargetLocale)}
            aria-label={copy.targetLocaleLabel}
          >
            {TEXT_ASSISTANT_TARGET_LOCALES.filter((loc) => loc !== sourceLocale).map((loc) => (
              <option key={loc} value={loc}>
                {copy.localeLabels[loc]}
              </option>
            ))}
          </select>
        </label>
      ) : null}

      {action === 'tone' ? (
        <label className={styles.inlineTextAiField}>
          <span>{copy.toneLabel}</span>
          <select
            value={tone}
            onChange={(event) => setTone(event.target.value as TextAssistantTone)}
            aria-label={copy.toneSelectLabel}
          >
            {TEXT_ASSISTANT_TONES.map((value) => (
              <option key={value} value={value}>
                {copy.toneLabels[value]}
              </option>
            ))}
          </select>
        </label>
      ) : null}

      <label className={styles.inlineTextAiField}>
        <span>{copy.customPromptLabel}</span>
        <textarea
          value={customPrompt}
          onChange={(event) => setCustomPrompt(event.target.value)}
          rows={2}
          maxLength={600}
          placeholder={copy.customPromptPlaceholder}
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
          {pending ? copy.generatingLabel : currentEntry ? copy.regenerateLabel : copy.generateLabel}
        </button>
        {currentEntry ? (
          <>
            <button
              type="button"
              className={styles.inlineTextAiGhostButton}
              onClick={handleUndo}
              disabled={pending || historyIndex < 0}
              aria-label={copy.previousResultLabel}
            >
              ←
            </button>
            <span className={styles.inlineTextAiHistoryLabel}>
              {history.length === 0
                ? copy.noResultsLabel
                : `${historyIndex + 1} / ${history.length}`}
            </span>
            <button
              type="button"
              className={styles.inlineTextAiGhostButton}
              onClick={handleRedo}
              disabled={pending || historyIndex >= history.length - 1}
              aria-label={copy.nextResultLabel}
            >
              →
            </button>
            <button
              type="button"
              className={styles.inlineTextAiGhostButton}
              onClick={() => setShowOriginal((value) => !value)}
              aria-pressed={showOriginal}
            >
              {showOriginal ? copy.showResultLabel : copy.showOriginalLabel}
            </button>
          </>
        ) : null}
      </div>

      <div className={styles.inlineTextAiPreview} aria-live="polite">
        <header className={styles.inlineTextAiPreviewHeader}>
          <span>
            {showOriginal || !currentEntry ? copy.originalLabel : copy.describeAction(currentEntry)}
          </span>
          <span>{showOriginal || !currentEntry ? sourceLengthLabel : previewLengthLabel}</span>
        </header>
        <p className={styles.inlineTextAiPreviewText}>{previewText}</p>
      </div>

      <div className={styles.inlineTextAiFooter}>
        <button
          type="button"
          className={styles.inlineTextAiGhostButton}
          onClick={handleDiscard}
          disabled={pending}
        >
          {copy.resetLabel}
        </button>
        <button
          type="button"
          className={styles.inlineTextAiPrimaryButton}
          onClick={handleApply}
          disabled={!canApply}
          data-builder-ai-text-apply="true"
        >
          {copy.applyLabel}
        </button>
      </div>
    </div>
  );
}

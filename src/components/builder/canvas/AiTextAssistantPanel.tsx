'use client';

import { useCallback, useMemo, useRef, useState } from 'react';
import {
  TEXT_ASSISTANT_ACTIONS,
  TEXT_ASSISTANT_TONES,
  TEXT_ASSISTANT_TARGET_LOCALES,
  describeTextAssistantAction,
  type TextAssistantAction,
  type TextAssistantTone,
  type TextAssistantTargetLocale,
} from '@/lib/builder/ai-generator/text-assistant';
import styles from './SandboxPage.module.css';

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

const ACTION_LABEL: Record<TextAssistantAction, string> = {
  rewrite: 'Rewrite',
  expand: 'Expand',
  shorten: 'Shorten',
  translate: 'Translate',
  tone: 'Tone',
};

const TONE_LABEL: Record<TextAssistantTone, string> = {
  formal: 'Formal',
  casual: 'Casual',
  persuasive: 'Persuasive',
  concise: 'Concise',
  warm: 'Warm',
  authoritative: 'Authoritative',
};

const LOCALE_LABEL: Record<TextAssistantTargetLocale, string> = {
  ko: '한국어',
  'zh-hant': '繁體中文',
  en: 'English',
};

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

  const currentEntry = historyIndex >= 0 ? history[historyIndex] ?? null : null;
  const canApply = !!currentEntry && currentEntry.text !== sourceText && !pending;
  const previewText = showOriginal || !currentEntry ? sourceText : currentEntry.text;

  const sourceLengthLabel = useMemo(() => `${sourceText.length}자`, [sourceText.length]);
  const previewLengthLabel = useMemo(() => `${previewText.length}자`, [previewText.length]);

  const runRequest = useCallback(async () => {
    if (!sourceText.trim()) {
      setError('AI 어시스턴트는 빈 텍스트에서 실행할 수 없습니다.');
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
        const message = body && body.ok === false ? body.message ?? body.error ?? '요청에 실패했습니다.' : '요청에 실패했습니다.';
        setError(typeof message === 'string' ? message : 'AI 텍스트 어시스턴트 호출에 실패했습니다.');
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
      setError((err as Error)?.message ?? 'AI 텍스트 어시스턴트 호출 중 오류가 발생했습니다.');
    } finally {
      setPending(false);
    }
  }, [action, brandTone, customPrompt, elementHint, historyIndex, siteName, sourceLocale, sourceText, targetLocale, tone]);

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
      aria-label="AI 텍스트 어시스턴트"
      data-builder-ai-text-panel="true"
      className={styles.inlineTextAiPanel}
      data-placement={placement}
      onMouseDown={(event) => event.stopPropagation()}
      onPointerDown={(event) => event.stopPropagation()}
    >
      <header className={styles.inlineTextAiPanelHeader}>
        <strong>AI 텍스트 어시스턴트</strong>
        <button
          type="button"
          className={styles.inlineTextAiPanelClose}
          aria-label="AI 어시스턴트 닫기"
          onClick={onClose}
        >
          ×
        </button>
      </header>

      <div role="radiogroup" aria-label="AI 액션" className={styles.inlineTextAiActions}>
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
            {ACTION_LABEL[value]}
          </button>
        ))}
      </div>

      {action === 'translate' ? (
        <label className={styles.inlineTextAiField}>
          <span>번역 대상 언어</span>
          <select
            value={targetLocale}
            onChange={(event) => setTargetLocale(event.target.value as TextAssistantTargetLocale)}
            aria-label="번역 대상 언어"
          >
            {TEXT_ASSISTANT_TARGET_LOCALES.filter((loc) => loc !== sourceLocale).map((loc) => (
              <option key={loc} value={loc}>
                {LOCALE_LABEL[loc]}
              </option>
            ))}
          </select>
        </label>
      ) : null}

      {action === 'tone' ? (
        <label className={styles.inlineTextAiField}>
          <span>톤</span>
          <select
            value={tone}
            onChange={(event) => setTone(event.target.value as TextAssistantTone)}
            aria-label="톤 선택"
          >
            {TEXT_ASSISTANT_TONES.map((value) => (
              <option key={value} value={value}>
                {TONE_LABEL[value]}
              </option>
            ))}
          </select>
        </label>
      ) : null}

      <label className={styles.inlineTextAiField}>
        <span>추가 지시 (선택)</span>
        <textarea
          value={customPrompt}
          onChange={(event) => setCustomPrompt(event.target.value)}
          rows={2}
          maxLength={600}
          placeholder="예: 변호사 사무실 톤, 5문장 이내, 클릭 유도 표현 포함"
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
          {pending ? '생성 중...' : currentEntry ? '다시 생성' : '생성'}
        </button>
        {currentEntry ? (
          <>
            <button
              type="button"
              className={styles.inlineTextAiGhostButton}
              onClick={handleUndo}
              disabled={pending || historyIndex < 0}
              aria-label="이전 결과"
            >
              ←
            </button>
            <span className={styles.inlineTextAiHistoryLabel}>
              {history.length === 0
                ? '결과 없음'
                : `${historyIndex + 1} / ${history.length}`}
            </span>
            <button
              type="button"
              className={styles.inlineTextAiGhostButton}
              onClick={handleRedo}
              disabled={pending || historyIndex >= history.length - 1}
              aria-label="다음 결과"
            >
              →
            </button>
            <button
              type="button"
              className={styles.inlineTextAiGhostButton}
              onClick={() => setShowOriginal((value) => !value)}
              aria-pressed={showOriginal}
            >
              {showOriginal ? '결과 보기' : '원본 보기'}
            </button>
          </>
        ) : null}
      </div>

      <div className={styles.inlineTextAiPreview} aria-live="polite">
        <header className={styles.inlineTextAiPreviewHeader}>
          <span>
            {showOriginal || !currentEntry ? '원본' : describeTextAssistantAction(currentEntry)}
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
          초기화
        </button>
        <button
          type="button"
          className={styles.inlineTextAiPrimaryButton}
          onClick={handleApply}
          disabled={!canApply}
          data-builder-ai-text-apply="true"
        >
          적용
        </button>
      </div>
    </div>
  );
}

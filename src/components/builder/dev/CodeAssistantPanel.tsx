'use client';

import { useCallback, useState } from 'react';
import styles from '@/components/builder/canvas/SandboxPage.module.css';
import {
  CODE_ASSISTANT_ACTIONS,
  describeCodeAction,
  type CodeAssistantAction,
  type CodeAssistantLanguage,
} from '@/lib/builder/ai-generator/code-assistant';

interface CodeAssistantPanelProps {
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
}

type ServerError = { ok: false; error?: string; message?: string };

const ACTION_LABEL: Record<CodeAssistantAction, string> = {
  explain: 'Explain',
  fix: 'Fix bugs',
  optimize: 'Optimize',
  comment: 'Add comments',
};

export default function CodeAssistantPanel({
  code,
  language = 'ts',
  contextHint,
  onApplyFix,
  onClose,
}: CodeAssistantPanelProps) {
  const [action, setAction] = useState<CodeAssistantAction>('explain');
  const [context, setContext] = useState(contextHint ?? '');
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<CodeAssistantResponse | null>(null);

  const runRequest = useCallback(async () => {
    if (!code.trim()) {
      setError('함수 본문이 비어 있습니다.');
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
          ? body.message ?? body.error ?? '요청에 실패했습니다.'
          : '요청에 실패했습니다.';
        setError(message);
        return;
      }
      setResult(body);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'AI 코드 어시스턴트 호출에 실패했습니다.');
    } finally {
      setPending(false);
    }
  }, [action, code, context, language]);

  const handleApplyFix = useCallback(() => {
    if (!result?.fixedCode) return;
    onApplyFix(result.fixedCode);
    onClose();
  }, [onApplyFix, onClose, result]);

  const canApply = !!result?.fixedCode && result.fixedCode !== code;

  return (
    <div
      role="dialog"
      aria-label="AI 코드 어시스턴트"
      data-builder-ai-code-panel="true"
      className={styles.inlineTextAiPanel}
      onMouseDown={(event) => event.stopPropagation()}
      onPointerDown={(event) => event.stopPropagation()}
    >
      <header className={styles.inlineTextAiPanelHeader}>
        <strong>AI 코드 어시스턴트</strong>
        <button
          type="button"
          className={styles.inlineTextAiPanelClose}
          aria-label="AI 코드 어시스턴트 닫기"
          onClick={onClose}
        >
          ×
        </button>
      </header>

      <div role="radiogroup" aria-label="AI 코드 액션" className={styles.inlineTextAiActions}>
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
            {ACTION_LABEL[value]}
          </button>
        ))}
      </div>

      <label className={styles.inlineTextAiField}>
        <span>추가 컨텍스트 (선택)</span>
        <textarea
          value={context}
          onChange={(event) => setContext(event.target.value)}
          rows={2}
          maxLength={2000}
          placeholder="예: 이 함수는 /api/builder/dev/functions/now/invoke 에서 호출됩니다."
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
          {pending ? '분석 중...' : result ? '다시 실행' : '실행'}
        </button>
        {canApply ? (
          <button
            type="button"
            className={styles.inlineTextAiPrimaryButton}
            onClick={handleApplyFix}
            data-builder-ai-code-apply="true"
          >
            제안 코드 적용
          </button>
        ) : null}
      </div>

      {result ? (
        <div className={styles.inlineTextAiPreview} aria-live="polite">
          <header className={styles.inlineTextAiPreviewHeader}>
            <span>{describeCodeAction(result.action)}</span>
            <span>{result.language.toUpperCase()}</span>
          </header>
          <p className={styles.inlineTextAiPreviewText} style={{ whiteSpace: 'pre-wrap' }}>
            {result.result}
          </p>
          {result.fixedCode ? (
            <details style={{ marginTop: 8 }}>
              <summary style={{ cursor: 'pointer', fontSize: 12 }}>제안 코드 보기</summary>
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
                }}
              >
                {result.fixedCode}
              </pre>
            </details>
          ) : null}
          {result.diff ? (
            <details style={{ marginTop: 6 }}>
              <summary style={{ cursor: 'pointer', fontSize: 12 }}>Unified diff</summary>
              <pre
                className={styles.inlineTextAiPreviewText}
                style={{
                  fontFamily: 'ui-monospace, Menlo, monospace',
                  fontSize: 11,
                  background: 'rgba(15, 23, 42, 0.04)',
                  padding: 12,
                  borderRadius: 8,
                  overflowX: 'auto',
                  whiteSpace: 'pre',
                }}
              >
                {result.diff}
              </pre>
            </details>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
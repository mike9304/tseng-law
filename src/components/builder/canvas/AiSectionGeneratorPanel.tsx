'use client';

import { useCallback, useMemo, useState } from 'react';
import styles from './SandboxPage.module.css';
import {
  AI_SECTION_KINDS,
  type AiSectionKind,
  type AiSectionSpec,
} from '@/lib/builder/ai-generator/section-builder';
import type { BuilderCanvasNode } from '@/lib/builder/canvas/types';
import type { Locale } from '@/lib/locales';
import { getAiSectionGeneratorCopy } from './ai-section-generator-copy';

interface AiSectionGeneratorPanelProps {
  locale: Locale;
  siteName?: string;
  brandTone?: string;
  onApply: (nodes: BuilderCanvasNode[], rootId: string, spec: AiSectionSpec) => void;
  onClose: () => void;
}

interface GeneratedSectionResponse {
  ok: true;
  model: string;
  usedFallback: boolean;
  sectionKind: AiSectionKind;
  spec: AiSectionSpec;
  rootId: string;
  nodes: BuilderCanvasNode[];
}

type ServerError = { ok: false; error?: string; message?: string };

export default function AiSectionGeneratorPanel({
  locale,
  siteName,
  brandTone,
  onApply,
  onClose,
}: AiSectionGeneratorPanelProps) {
  const [prompt, setPrompt] = useState('');
  const [sectionKind, setSectionKind] = useState<AiSectionKind | 'auto'>('auto');
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [preview, setPreview] = useState<GeneratedSectionResponse | null>(null);
  const copy = useMemo(() => getAiSectionGeneratorCopy(locale), [locale]);

  const runRequest = useCallback(async () => {
    if (!prompt.trim()) {
      setError(copy.emptyPromptError);
      return;
    }
    setPending(true);
    setError(null);
    try {
      const response = await fetch('/api/builder/ai-generator/section', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: prompt.trim(),
          locale,
          sectionKind: sectionKind === 'auto' ? undefined : sectionKind,
          ...(siteName ? { siteName } : null),
          ...(brandTone ? { brandTone } : null),
        }),
      });
      const body = (await response.json().catch(() => null)) as GeneratedSectionResponse | ServerError | null;
      if (!response.ok || !body || body.ok !== true) {
        const message = body && body.ok === false
          ? body.message ?? body.error ?? copy.requestFailedError
          : copy.requestFailedError;
        setError(message);
        return;
      }
      setPreview(body);
    } catch (err) {
      setError(err instanceof Error ? err.message : copy.callFailedError);
    } finally {
      setPending(false);
    }
  }, [brandTone, copy, locale, prompt, sectionKind, siteName]);

  const handleApply = useCallback(() => {
    if (!preview) return;
    onApply(preview.nodes, preview.rootId, preview.spec);
    onClose();
  }, [onApply, onClose, preview]);

  return (
    <div
      role="dialog"
      aria-label={copy.dialogLabel}
      data-builder-ai-section-panel="true"
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

      <label className={styles.inlineTextAiField}>
        <span>{copy.sectionKindLabel}</span>
        <select
          value={sectionKind}
          onChange={(event) => setSectionKind(event.target.value as AiSectionKind | 'auto')}
          aria-label={copy.sectionKindLabel}
        >
          <option value="auto">{copy.autoKindLabel}</option>
          {AI_SECTION_KINDS.map((value) => (
            <option key={value} value={value}>
              {copy.kindLabels[value]}
            </option>
          ))}
        </select>
      </label>

      <label className={styles.inlineTextAiField}>
        <span>{copy.sectionDescriptionLabel}</span>
        <textarea
          value={prompt}
          onChange={(event) => setPrompt(event.target.value)}
          rows={4}
          maxLength={2000}
          placeholder={copy.promptPlaceholder}
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
          {pending ? copy.generatingLabel : preview ? copy.regenerateLabel : copy.generateLabel}
        </button>
        {preview ? (
          <button
            type="button"
            className={styles.inlineTextAiPrimaryButton}
            onClick={handleApply}
            data-builder-ai-section-apply="true"
          >
            {copy.applyToCanvasLabel}
          </button>
        ) : null}
      </div>

      {preview ? (
        <div className={styles.inlineTextAiPreview} aria-live="polite">
          <header className={styles.inlineTextAiPreviewHeader}>
            <span>{copy.kindLabels[preview.sectionKind]}</span>
            <span>{copy.nodeCountLabel(preview.nodes.length)}</span>
          </header>
          <p className={styles.inlineTextAiPreviewText}>
            <strong>{preview.spec.headline}</strong>
          </p>
          {preview.spec.subhead ? (
            <p className={styles.inlineTextAiPreviewText}>{preview.spec.subhead}</p>
          ) : null}
          {preview.spec.items && preview.spec.items.length > 0 ? (
            <ul style={{ paddingLeft: 18, marginTop: 6 }}>
              {preview.spec.items.map((item, index) => (
                <li
                  key={`${item.title}-${index}`}
                  className={styles.inlineTextAiPreviewText}
                  style={{ fontSize: 12 }}
                >
                  <strong>{item.title}</strong> — {item.body}
                </li>
              ))}
            </ul>
          ) : null}
          {preview.spec.ctaLabel ? (
            <p className={styles.inlineTextAiPreviewText} style={{ fontSize: 12, opacity: 0.8 }}>
              {copy.ctaPreviewLabel}: {preview.spec.ctaLabel}
            </p>
          ) : null}
          {preview.usedFallback ? (
            <p className={styles.inlineTextAiPreviewText} style={{ fontSize: 11, opacity: 0.7 }}>
              {copy.fallbackNotice}
            </p>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}

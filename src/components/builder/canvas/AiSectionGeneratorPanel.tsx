'use client';

import { useCallback, useState } from 'react';
import styles from './SandboxPage.module.css';
import {
  AI_SECTION_KINDS,
  describeAiSection,
  type AiSectionKind,
  type AiSectionSpec,
} from '@/lib/builder/ai-generator/section-builder';
import type { BuilderCanvasNode } from '@/lib/builder/canvas/types';
import type { Locale } from '@/lib/locales';

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

const KIND_LABEL: Record<AiSectionKind, string> = {
  hero: 'Hero',
  features: 'Features',
  testimonials: 'Testimonials',
  cta: 'Call to action',
  faq: 'FAQ',
};

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

  const runRequest = useCallback(async () => {
    if (!prompt.trim()) {
      setError('섹션 설명을 입력하세요.');
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
          ? body.message ?? body.error ?? '요청에 실패했습니다.'
          : '요청에 실패했습니다.';
        setError(message);
        return;
      }
      setPreview(body);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'AI 섹션 생성기 호출에 실패했습니다.');
    } finally {
      setPending(false);
    }
  }, [brandTone, locale, prompt, sectionKind, siteName]);

  const handleApply = useCallback(() => {
    if (!preview) return;
    onApply(preview.nodes, preview.rootId, preview.spec);
    onClose();
  }, [onApply, onClose, preview]);

  return (
    <div
      role="dialog"
      aria-label="AI 섹션 생성기"
      data-builder-ai-section-panel="true"
      className={styles.inlineTextAiPanel}
      onMouseDown={(event) => event.stopPropagation()}
      onPointerDown={(event) => event.stopPropagation()}
    >
      <header className={styles.inlineTextAiPanelHeader}>
        <strong>AI 섹션 생성</strong>
        <button
          type="button"
          className={styles.inlineTextAiPanelClose}
          aria-label="AI 섹션 생성기 닫기"
          onClick={onClose}
        >
          ×
        </button>
      </header>

      <label className={styles.inlineTextAiField}>
        <span>섹션 종류</span>
        <select
          value={sectionKind}
          onChange={(event) => setSectionKind(event.target.value as AiSectionKind | 'auto')}
          aria-label="섹션 종류"
        >
          <option value="auto">자동 선택</option>
          {AI_SECTION_KINDS.map((value) => (
            <option key={value} value={value}>
              {KIND_LABEL[value]}
            </option>
          ))}
        </select>
      </label>

      <label className={styles.inlineTextAiField}>
        <span>섹션 설명</span>
        <textarea
          value={prompt}
          onChange={(event) => setPrompt(event.target.value)}
          rows={4}
          maxLength={2000}
          placeholder="예: 대만 진출 한국 기업을 위한 법률 자문 사무소의 히어로 섹션. 한국어 상담, 5영업일 이내 답변, 전문성을 강조."
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
          {pending ? '생성 중...' : preview ? '다시 생성' : '생성'}
        </button>
        {preview ? (
          <button
            type="button"
            className={styles.inlineTextAiPrimaryButton}
            onClick={handleApply}
            data-builder-ai-section-apply="true"
          >
            캔버스에 삽입
          </button>
        ) : null}
      </div>

      {preview ? (
        <div className={styles.inlineTextAiPreview} aria-live="polite">
          <header className={styles.inlineTextAiPreviewHeader}>
            <span>{describeAiSection(preview.sectionKind)}</span>
            <span>{preview.nodes.length}개 노드</span>
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
              CTA: {preview.spec.ctaLabel}
            </p>
          ) : null}
          {preview.usedFallback ? (
            <p className={styles.inlineTextAiPreviewText} style={{ fontSize: 11, opacity: 0.7 }}>
              ⚠ OPENAI_API_KEY가 없어 결정적 스텁 내용을 사용했습니다.
            </p>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
'use client';

import { useEffect, useLayoutEffect, useMemo, useRef, useState, type PointerEvent } from 'react';
import { ASPECT_RATIOS } from '@/lib/builder/canvas/crop';
import {
  DEFAULT_FILTERS,
  FILTER_PRESETS,
  filtersToCSS,
  isDefaultFilters,
  type ImageFilters,
} from '@/lib/builder/canvas/filters';
import styles from './SandboxPage.module.css';

const FILTER_SLIDERS: Array<{ key: keyof ImageFilters; label: string; min: number; max: number; step?: number; unit: string }> = [
  { key: 'brightness', label: 'Brightness', min: 0, max: 200, unit: '%' },
  { key: 'contrast', label: 'Contrast', min: 0, max: 200, unit: '%' },
  { key: 'saturation', label: 'Saturation', min: 0, max: 200, unit: '%' },
  { key: 'blur', label: 'Blur', min: 0, max: 20, step: 0.5, unit: 'px' },
  { key: 'grayscale', label: 'B&W', min: 0, max: 100, unit: '%' },
  { key: 'sepia', label: 'Sepia', min: 0, max: 100, unit: '%' },
];

const FOCUSABLE_SELECTOR = [
  'a[href]:not([tabindex="-1"])',
  'button:not([disabled]):not([tabindex="-1"])',
  'input:not([disabled]):not([tabindex="-1"]):not([type="hidden"])',
  'select:not([disabled]):not([tabindex="-1"])',
  'textarea:not([disabled]):not([tabindex="-1"])',
  '[tabindex]:not([tabindex="-1"])',
  '[contenteditable="true"]:not([tabindex="-1"])',
].join(',');

export type ImageEditTab = 'crop' | 'filter' | 'alt' | 'ai';
type ImageFocalPoint = { x: number; y: number };
type EditedImageAsset = {
  filename: string;
  url: string;
};
type AiReviewHistoryState = {
  entries: Array<EditedImageAsset | null>;
  index: number;
};

type AiMaskRect = {
  label: string;
  x: number;
  y: number;
  width: number;
  height: number;
};
type AiBrushPoint = { x: number; y: number };
type AiBrushMode = 'paint' | 'erase';
type AiPreviewFrame = 'desktop' | 'mobile';
type AiBrushStroke = {
  id: string;
  points: AiBrushPoint[];
  size: number;
  mode: AiBrushMode;
};

const DEFAULT_AI_BRUSH_SIZE = 8;
const DEFAULT_AI_MASK_FEATHER = 0;
const DEFAULT_AI_MASK_EDGE = 0;
const EMPTY_AI_REVIEW_HISTORY: AiReviewHistoryState = { entries: [], index: -1 };

const AI_VARIATION_PRESETS = [
  {
    label: 'Premium bright',
    prompt: 'Make this a brighter premium legal website hero image with realistic office lighting and no text.',
  },
  {
    label: 'Editorial calm',
    prompt: 'Create a calm editorial version with refined contrast, warm professional lighting, and no text.',
  },
  {
    label: 'Modern contrast',
    prompt: 'Create a modern high-contrast website image with polished legal brand atmosphere and no text.',
  },
];

const AI_MASK_PRESETS: AiMaskRect[] = [
  { label: 'Center focus', x: 28, y: 24, width: 44, height: 44 },
  { label: 'Top band', x: 12, y: 8, width: 76, height: 28 },
  { label: 'Bottom band', x: 12, y: 62, width: 76, height: 26 },
  { label: 'Left detail', x: 8, y: 22, width: 34, height: 52 },
  { label: 'Right detail', x: 58, y: 22, width: 34, height: 52 },
];

function clampFocal(value: number): number {
  if (!Number.isFinite(value)) return 50;
  return Math.max(0, Math.min(100, Math.round(value)));
}

function normalizeFocalPoint(focalPoint: ImageFocalPoint | undefined): ImageFocalPoint {
  return {
    x: clampFocal(focalPoint?.x ?? 50),
    y: clampFocal(focalPoint?.y ?? 50),
  };
}

export default function ImageEditDialog({
  open,
  locale,
  imageSrc,
  alt,
  cropAspect,
  focalPoint,
  filters,
  initialTab = 'crop',
  onApply,
  onClose,
}: {
  open: boolean;
  locale: string;
  imageSrc: string;
  alt: string;
  cropAspect?: string;
  focalPoint?: ImageFocalPoint;
  filters?: ImageFilters;
  initialTab?: ImageEditTab;
  onApply: (content: { src?: string; alt: string; cropAspect: string; focalPoint: ImageFocalPoint; filters: ImageFilters }) => void;
  onClose: () => void;
}) {
  const dialogRef = useRef<HTMLDivElement | null>(null);
  const restoreFocusRef = useRef<HTMLElement | null>(null);
  const closingRef = useRef(false);
  const [activeTab, setActiveTab] = useState<ImageEditTab>('crop');
  const [dialogImageSrc, setDialogImageSrc] = useState(imageSrc);
  const [draftAlt, setDraftAlt] = useState(alt);
  const [draftAspect, setDraftAspect] = useState(cropAspect || 'Free');
  const [draftFocalPoint, setDraftFocalPoint] = useState<ImageFocalPoint>(() => normalizeFocalPoint(focalPoint));
  const [draftFilters, setDraftFilters] = useState<ImageFilters>(filters ?? DEFAULT_FILTERS);
  const [aiPrompt, setAiPrompt] = useState('');
  const [aiGenerating, setAiGenerating] = useState(false);
  const [aiNotice, setAiNotice] = useState<string | null>(null);
  const [aiNoticeTone, setAiNoticeTone] = useState<'success' | 'error' | 'warning' | 'info'>('info');
  const [aiEditedAsset, setAiEditedAsset] = useState<EditedImageAsset | null>(null);
  const [aiEditedAssets, setAiEditedAssets] = useState<EditedImageAsset[]>([]);
  const [aiMaskRect, setAiMaskRect] = useState<AiMaskRect | null>(null);
  const [aiBrushEnabled, setAiBrushEnabled] = useState(false);
  const [aiBrushStrokes, setAiBrushStrokes] = useState<AiBrushStroke[]>([]);
  const [aiBrushSize, setAiBrushSize] = useState(DEFAULT_AI_BRUSH_SIZE);
  const [aiBrushMode, setAiBrushMode] = useState<AiBrushMode>('paint');
  const [aiMaskFeather, setAiMaskFeather] = useState(DEFAULT_AI_MASK_FEATHER);
  const [aiMaskEdge, setAiMaskEdge] = useState(DEFAULT_AI_MASK_EDGE);
  const [aiReviewOriginal, setAiReviewOriginal] = useState(false);
  const [aiReviewHistory, setAiReviewHistory] = useState<AiReviewHistoryState>(EMPTY_AI_REVIEW_HISTORY);
  const [aiPreviewFrame, setAiPreviewFrame] = useState<AiPreviewFrame>('desktop');
  const previewImageRef = useRef<HTMLImageElement | null>(null);
  const aiBrushIdRef = useRef(0);
  const activeBrushStrokeIdRef = useRef<string | null>(null);
  const dialogOpenSnapshotRef = useRef(false);

  useEffect(() => {
    if (!open) {
      dialogOpenSnapshotRef.current = false;
      return;
    }
    if (dialogOpenSnapshotRef.current) return;
    dialogOpenSnapshotRef.current = true;
    setDialogImageSrc(imageSrc);
  }, [imageSrc, open]);

  useEffect(() => {
    if (!open) return;
    setActiveTab(initialTab);
    setDraftAlt(alt);
    setDraftAspect(cropAspect || 'Free');
    setDraftFocalPoint(normalizeFocalPoint(focalPoint));
    setDraftFilters(filters ?? DEFAULT_FILTERS);
    setAiPrompt('');
    setAiGenerating(false);
    setAiNotice(null);
    setAiNoticeTone('info');
    setAiEditedAsset(null);
    setAiEditedAssets([]);
    setAiMaskRect(null);
    setAiBrushEnabled(false);
    setAiBrushStrokes([]);
    setAiBrushSize(DEFAULT_AI_BRUSH_SIZE);
    setAiBrushMode('paint');
    setAiMaskFeather(DEFAULT_AI_MASK_FEATHER);
    setAiMaskEdge(DEFAULT_AI_MASK_EDGE);
    setAiReviewOriginal(false);
    setAiReviewHistory(EMPTY_AI_REVIEW_HISTORY);
    setAiPreviewFrame('desktop');
    activeBrushStrokeIdRef.current = null;
  }, [alt, cropAspect, filters, focalPoint, initialTab, open]);

  useLayoutEffect(() => {
    if (!open) return undefined;
    closingRef.current = false;
    restoreFocusRef.current = (document.activeElement as HTMLElement | null) ?? null;
    const dialog = dialogRef.current;
    if (dialog) {
      const focusables = dialog.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR);
      (focusables[0] ?? dialog).focus({ preventScroll: true });
    }
    return () => {
      closingRef.current = true;
      const previous = restoreFocusRef.current;
      if (!previous || typeof previous.focus !== 'function') return;
      try {
        previous.focus({ preventScroll: true });
      } catch {
        // Ignore detached focus targets.
      }
    };
  }, [open]);

  useEffect(() => {
    if (!open) return undefined;
    const handler = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        event.stopPropagation();
        event.stopImmediatePropagation();
        onClose();
        return;
      }

      if (event.key !== 'Tab') return;
      const dialog = dialogRef.current;
      if (!dialog) return;
      const focusables = Array.from(dialog.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR))
        .filter((node) => !node.hasAttribute('disabled') && node.tabIndex !== -1);
      if (focusables.length === 0) {
        event.preventDefault();
        dialog.focus({ preventScroll: true });
        return;
      }
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      const active = document.activeElement as HTMLElement | null;
      if (event.shiftKey) {
        if (active === first || active === dialog) {
          event.preventDefault();
          last.focus({ preventScroll: true });
        }
        return;
      }
      if (active === last) {
        event.preventDefault();
        first.focus({ preventScroll: true });
      }
    };
    window.addEventListener('keydown', handler, true);
    return () => window.removeEventListener('keydown', handler, true);
  }, [onClose, open]);

  useEffect(() => {
    if (!open) return undefined;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [open]);

  useEffect(() => {
    if (!open) return undefined;
    function handleFocusIn(event: FocusEvent) {
      if (closingRef.current) return;
      const dialog = dialogRef.current;
      if (!dialog || !event.target || dialog.contains(event.target as Node)) return;
      event.preventDefault();
      event.stopPropagation();
      const focusables = dialog.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR);
      (focusables[0] ?? dialog).focus({ preventScroll: true });
    }
    document.addEventListener('focusin', handleFocusIn);
    return () => document.removeEventListener('focusin', handleFocusIn);
  }, [open]);

  const selectedRatio = useMemo(
    () => ASPECT_RATIOS.find((ratio) => ratio.label === draftAspect)?.value ?? null,
    [draftAspect],
  );
  const canUndoAiReview = aiReviewHistory.index > 0;
  const canRedoAiReview = aiReviewHistory.index >= 0 && aiReviewHistory.index < aiReviewHistory.entries.length - 1;
  const previewSrc = activeTab === 'ai' && aiReviewOriginal && aiEditedAsset?.url
    ? dialogImageSrc
    : aiEditedAsset?.url ?? dialogImageSrc;
  const previewFilter = !isDefaultFilters(draftFilters) ? filtersToCSS(draftFilters) : undefined;
  const builderAssetUrl = useMemo(() => {
    const trimmed = dialogImageSrc.trim();
    if (trimmed.startsWith('/api/builder/assets/')) return trimmed;
    if (typeof window === 'undefined') return null;
    try {
      const parsed = new URL(trimmed, window.location.origin);
      if (parsed.origin !== window.location.origin || parsed.search || parsed.hash) return null;
      return parsed.pathname.startsWith('/api/builder/assets/') ? parsed.pathname : null;
    } catch {
      return null;
    }
  }, [dialogImageSrc]);
  const updateFocalPoint = (partial: Partial<ImageFocalPoint>) => {
    setDraftFocalPoint((current) => ({
      x: clampFocal(partial.x ?? current.x),
      y: clampFocal(partial.y ?? current.y),
    }));
  };
  const readBrushPoint = (event: PointerEvent<HTMLDivElement>): AiBrushPoint => {
    const rect = event.currentTarget.getBoundingClientRect();
    return {
      x: clampFocal(((event.clientX - rect.left) / rect.width) * 100),
      y: clampFocal(((event.clientY - rect.top) / rect.height) * 100),
    };
  };
  const beginAiBrushStroke = (event: PointerEvent<HTMLDivElement>) => {
    if (!aiBrushEnabled) return;
    event.preventDefault();
    event.stopPropagation();
    const point = readBrushPoint(event);
    const id = `brush-${aiBrushIdRef.current++}`;
    activeBrushStrokeIdRef.current = id;
    setAiMaskRect(null);
    setAiBrushStrokes((current) => [...current, { id, points: [point], size: aiBrushSize, mode: aiBrushMode }]);
    event.currentTarget.setPointerCapture?.(event.pointerId);
  };
  const extendAiBrushStroke = (event: PointerEvent<HTMLDivElement>) => {
    const activeId = activeBrushStrokeIdRef.current;
    if (!aiBrushEnabled || !activeId) return;
    event.preventDefault();
    event.stopPropagation();
    const point = readBrushPoint(event);
    setAiBrushStrokes((current) => current.map((stroke) => (
      stroke.id === activeId
        ? { ...stroke, points: [...stroke.points, point] }
        : stroke
    )));
  };
  const endAiBrushStroke = (event: PointerEvent<HTMLDivElement>) => {
    if (!activeBrushStrokeIdRef.current) return;
    event.preventDefault();
    event.stopPropagation();
    activeBrushStrokeIdRef.current = null;
    event.currentTarget.releasePointerCapture?.(event.pointerId);
  };
  const undoLastAiBrushStroke = () => {
    activeBrushStrokeIdRef.current = null;
    setAiBrushStrokes((current) => current.slice(0, -1));
  };
  const sameAiReviewSelection = (left: EditedImageAsset | null, right: EditedImageAsset | null): boolean => {
    return (left?.url ?? null) === (right?.url ?? null);
  };
  const pushAiReviewSelection = (asset: EditedImageAsset | null) => {
    const baseEntries = aiReviewHistory.entries.slice(0, aiReviewHistory.index + 1);
    const lastEntry = baseEntries[baseEntries.length - 1] ?? null;
    setAiEditedAsset(asset);
    setAiReviewOriginal(false);
    if (sameAiReviewSelection(lastEntry, asset)) return;
    const entries = [...baseEntries, asset].slice(-8);
    setAiReviewHistory({ entries, index: entries.length - 1 });
  };
  const restoreAiReviewSelection = (direction: -1 | 1) => {
    const nextIndex = aiReviewHistory.index + direction;
    if (nextIndex < 0 || nextIndex >= aiReviewHistory.entries.length) return;
    const asset = aiReviewHistory.entries[nextIndex] ?? null;
    setAiReviewHistory({ ...aiReviewHistory, index: nextIndex });
    setAiEditedAsset(asset);
    setAiReviewOriginal(false);
    setAiNoticeTone('info');
    setAiNotice(asset ? `Review restored: ${asset.filename}` : 'Review restored to the current image.');
  };
  const createAiMaskPayload = (): { dataUrl: string; description: string } | null => {
    const image = previewImageRef.current;
    const width = Math.max(1, image?.naturalWidth || 1024);
    const height = Math.max(1, image?.naturalHeight || 1024);
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const context = canvas.getContext('2d');
    if (!context) return null;
    const featherPx = Math.max(0, (aiMaskFeather / 100) * Math.min(width, height));
    const edgePx = (aiMaskEdge / 100) * Math.min(width, height);
    context.clearRect(0, 0, width, height);
    context.fillStyle = 'rgba(0, 0, 0, 1)';
    context.fillRect(0, 0, width, height);
    if (aiMaskRect) {
      const rectX = (aiMaskRect.x / 100) * width - edgePx;
      const rectY = (aiMaskRect.y / 100) * height - edgePx;
      const rectWidth = (aiMaskRect.width / 100) * width + edgePx * 2;
      const rectHeight = (aiMaskRect.height / 100) * height + edgePx * 2;
      if (featherPx > 0) {
        context.save();
        context.filter = `blur(${featherPx}px)`;
        context.globalCompositeOperation = 'destination-out';
        context.fillRect(rectX, rectY, rectWidth, rectHeight);
        context.restore();
      } else {
        context.clearRect(rectX, rectY, rectWidth, rectHeight);
      }
      return { dataUrl: canvas.toDataURL('image/png'), description: aiMaskRect.label };
    }
    const usableBrushStrokes = aiBrushEnabled
      ? aiBrushStrokes.filter((stroke) => stroke.points.length > 0)
      : [];
    if (usableBrushStrokes.length === 0) return null;
    context.strokeStyle = 'rgba(0, 0, 0, 1)';
    context.fillStyle = 'rgba(0, 0, 0, 1)';
    context.lineCap = 'round';
    context.lineJoin = 'round';
    usableBrushStrokes.forEach((stroke) => {
      context.save();
      context.globalCompositeOperation = stroke.mode === 'erase' ? 'source-over' : 'destination-out';
      if (featherPx > 0) context.filter = `blur(${featherPx}px)`;
      const lineWidth = Math.max(8, (stroke.size / 100) * Math.min(width, height) + edgePx * 2);
      context.lineWidth = lineWidth;
      if (stroke.points.length === 1) {
        const point = stroke.points[0];
        context.beginPath();
        context.arc((point.x / 100) * width, (point.y / 100) * height, lineWidth / 2, 0, Math.PI * 2);
        context.fill();
        context.restore();
        return;
      }
      context.beginPath();
      stroke.points.forEach((point, index) => {
        const x = (point.x / 100) * width;
        const y = (point.y / 100) * height;
        if (index === 0) context.moveTo(x, y);
        else context.lineTo(x, y);
      });
      context.stroke();
      context.restore();
    });
    return { dataUrl: canvas.toDataURL('image/png'), description: 'Brush mask' };
  };
  const handleGenerateAiEdit = async () => {
    const prompt = aiPrompt.trim();
    if (!builderAssetUrl || prompt.length < 20 || aiGenerating) return;
    const maskPayload = createAiMaskPayload();
    setAiGenerating(true);
    setAiNotice(null);
    try {
      const response = await fetch('/api/builder/ai-generator/image/edit', {
        method: 'POST',
        credentials: 'same-origin',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          locale,
          assetUrl: builderAssetUrl,
          prompt,
          mask: maskPayload ?? undefined,
          size: '1536x1024',
          quality: 'medium',
          outputFormat: 'webp',
          outputCompression: 82,
        }),
      });
      const payload = (await response.json().catch(() => ({}))) as {
        ok?: boolean;
        error?: string;
        message?: string;
        asset?: EditedImageAsset;
      };
      if (!response.ok || !payload.ok || !payload.asset?.url) {
        throw new Error(payload.message || payload.error || 'Image edit failed.');
      }
      pushAiReviewSelection(payload.asset);
      setAiEditedAssets((current) => [
        payload.asset!,
        ...current.filter((asset) => asset.url !== payload.asset!.url),
      ].slice(0, 4));
      setAiNoticeTone('success');
      setAiNotice(`Edited image ready: ${payload.asset.filename}`);
    } catch (error) {
      setAiNoticeTone('error');
      setAiNotice(error instanceof Error ? error.message : 'Image edit failed.');
    } finally {
      setAiGenerating(false);
    }
  };

  if (!open) return null;

  return (
    <div className={styles.modalOverlay} role="presentation" onClick={onClose}>
      <div
        ref={dialogRef}
        className={`${styles.modalCard} ${styles.imageEditDialog}`}
        role="dialog"
        aria-modal="true"
        aria-label="Crop, filter, and alt text"
        tabIndex={-1}
        data-builder-image-edit-dialog="true"
        onClick={(event) => event.stopPropagation()}
      >
        <header className={styles.modalHeader}>
          <div>
            <span className={styles.modalEyebrow}>Image settings</span>
            <strong>Crop / Filter / Alt edit</strong>
          </div>
          <button type="button" className={styles.modalCloseButton} onClick={onClose}>
            Close
          </button>
        </header>

        <div className={styles.imageEditLayout}>
          <div className={styles.imageEditPreview}>
            {previewSrc ? (
              <div
                className={`${styles.imageEditPreviewFrame} ${activeTab === 'ai' && aiPreviewFrame === 'mobile' ? styles.imageEditPreviewFrameMobile : ''}`}
                data-builder-ai-image-preview-mode={activeTab === 'ai' ? aiPreviewFrame : undefined}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  ref={previewImageRef}
                  src={previewSrc}
                  alt={draftAlt || 'Image preview'}
                  style={{
                    filter: previewFilter,
                    objectPosition: `${draftFocalPoint.x}% ${draftFocalPoint.y}%`,
                  }}
                  onClick={(event) => {
                    const rect = event.currentTarget.getBoundingClientRect();
                    updateFocalPoint({
                      x: ((event.clientX - rect.left) / rect.width) * 100,
                      y: ((event.clientY - rect.top) / rect.height) * 100,
                    });
                  }}
                />
                <span
                  className={styles.imageEditFocalPoint}
                  style={{
                    left: `${draftFocalPoint.x}%`,
                    top: `${draftFocalPoint.y}%`,
                  }}
                  aria-hidden="true"
                />
                {selectedRatio ? (
                  <span
                    className={styles.imageEditCropOverlay}
                    style={{ aspectRatio: `${selectedRatio}` }}
                    aria-hidden="true"
                  />
                ) : null}
                {activeTab === 'ai' && aiMaskRect ? (
                  <span
                    className={styles.imageEditAiMaskOverlay}
                    style={{
                      left: `${aiMaskRect.x}%`,
                      top: `${aiMaskRect.y}%`,
                      width: `${aiMaskRect.width}%`,
                      height: `${aiMaskRect.height}%`,
                    }}
                    aria-hidden="true"
                  />
                ) : null}
                {activeTab === 'ai' && aiBrushEnabled ? (
                  <>
                    <svg className={styles.imageEditAiBrushSvg} viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
                      {aiBrushStrokes.map((stroke) => (
                            stroke.points.length === 1 ? (
                              <circle
                                key={stroke.id}
                                cx={stroke.points[0].x}
                                cy={stroke.points[0].y}
                                r={stroke.size / 2}
                                data-builder-ai-image-edit-brush-stroke={stroke.id}
                                data-builder-ai-image-edit-brush-stroke-mode={stroke.mode}
                              />
                            ) : (
                              <polyline
                                key={stroke.id}
                                points={stroke.points.map((point) => `${point.x},${point.y}`).join(' ')}
                                strokeWidth={stroke.size}
                                data-builder-ai-image-edit-brush-stroke={stroke.id}
                                data-builder-ai-image-edit-brush-stroke-mode={stroke.mode}
                              />
                            )
                      ))}
                    </svg>
                    <div
                      className={styles.imageEditAiBrushSurface}
                      data-builder-ai-image-edit-brush-surface="true"
                      role="presentation"
                      onPointerDown={beginAiBrushStroke}
                      onPointerMove={extendAiBrushStroke}
                      onPointerUp={endAiBrushStroke}
                      onPointerCancel={endAiBrushStroke}
                    />
                  </>
                ) : null}
              </div>
            ) : (
              <span className={styles.modalHint}>No image source.</span>
            )}
          </div>

          <section className={styles.imageEditControls}>
            <div className={styles.imageEditTabs}>
              {(['crop', 'filter', 'alt', 'ai'] as ImageEditTab[]).map((tab) => (
                <button
                  key={tab}
                  type="button"
                  className={`${styles.imageEditTab} ${activeTab === tab ? styles.imageEditTabActive : ''}`}
                  onClick={() => setActiveTab(tab)}
                >
                  {tab}
                </button>
              ))}
            </div>

            {activeTab === 'crop' ? (
              <div className={styles.imageEditPanel}>
                <span className={styles.inspectorFieldLabel}>Aspect ratio</span>
                <div className={styles.imageEditRatioGrid}>
                  {ASPECT_RATIOS.map((ratio) => (
                    <button
                      key={ratio.label}
                      type="button"
                      className={`${styles.imageEditOptionButton} ${draftAspect === ratio.label ? styles.imageEditOptionButtonActive : ''}`}
                      onClick={() => setDraftAspect(ratio.label)}
                    >
                      {ratio.label}
                    </button>
                  ))}
                </div>
                <div className={styles.imageEditFocalControls}>
                  <span className={styles.inspectorFieldLabel}>Focal point</span>
                  <div className={styles.imageEditFocalGrid} aria-label="Focal point presets">
                    {[
                      ['top-left', 20, 20],
                      ['top', 50, 20],
                      ['top-right', 80, 20],
                      ['left', 20, 50],
                      ['center', 50, 50],
                      ['right', 80, 50],
                      ['bottom-left', 20, 80],
                      ['bottom', 50, 80],
                      ['bottom-right', 80, 80],
                    ].map(([label, x, y]) => (
                      <button
                        key={label}
                        type="button"
                        aria-label={`Focal ${label}`}
                        className={styles.imageEditFocalPreset}
                        onClick={() => updateFocalPoint({ x: Number(x), y: Number(y) })}
                      />
                    ))}
                  </div>
                  <label className={styles.imageEditSlider}>
                    <span>X</span>
                    <input
                      type="range"
                      min={0}
                      max={100}
                      value={draftFocalPoint.x}
                      aria-label="Focal point X"
                      onChange={(event) => updateFocalPoint({ x: Number(event.target.value) })}
                    />
                    <strong>{draftFocalPoint.x}%</strong>
                  </label>
                  <label className={styles.imageEditSlider}>
                    <span>Y</span>
                    <input
                      type="range"
                      min={0}
                      max={100}
                      value={draftFocalPoint.y}
                      aria-label="Focal point Y"
                      onChange={(event) => updateFocalPoint({ y: Number(event.target.value) })}
                    />
                    <strong>{draftFocalPoint.y}%</strong>
                  </label>
                </div>
              </div>
            ) : null}

            {activeTab === 'filter' ? (
              <div className={styles.imageEditPanel}>
                <div className={styles.imageEditPresetRow}>
                  {FILTER_PRESETS.map((preset) => (
                    <button
                      key={preset.label}
                      type="button"
                      className={styles.imageEditOptionButton}
                      onClick={() => setDraftFilters({ ...DEFAULT_FILTERS, ...preset.filters })}
                    >
                      {preset.label}
                    </button>
                  ))}
                </div>
                {FILTER_SLIDERS.map((slider) => (
                  <label key={slider.key} className={styles.imageEditSlider}>
                    <span>{slider.label}</span>
                    <input
                      type="range"
                      min={slider.min}
                      max={slider.max}
                      step={slider.step ?? 1}
                      value={draftFilters[slider.key]}
                      onChange={(event) => {
                        setDraftFilters((current) => ({
                          ...current,
                          [slider.key]: Number(event.target.value),
                        }));
                      }}
                    />
                    <strong>{draftFilters[slider.key]}{slider.unit}</strong>
                  </label>
                ))}
              </div>
            ) : null}

            {activeTab === 'alt' ? (
              <div className={styles.imageEditPanel}>
                <label className={styles.inspectorField}>
                  <span className={styles.inspectorFieldLabel}>Alt text</span>
                  <textarea
                    className={styles.inspectorTextarea}
                    value={draftAlt}
                    rows={5}
                    placeholder="Describe the image for accessibility and SEO"
                    onChange={(event) => setDraftAlt(event.target.value)}
                  />
                </label>
              </div>
            ) : null}

            {activeTab === 'ai' ? (
              <div className={styles.imageEditPanel} data-builder-ai-image-edit-panel="true">
                <div className={styles.imageEditAiIntro}>
                  <span className={styles.inspectorFieldLabel}>Image 2.0 edit</span>
                  <strong>프롬프트로 새 버전 만들기</strong>
                  <p>
                    현재 빌더 자산을 기반으로 새 이미지를 만들고, Apply를 누르면 이 이미지로 교체됩니다.
                  </p>
                </div>
                <div className={styles.imageEditAiViewportControls} data-builder-ai-image-preview-controls="true">
                  <span className={styles.inspectorFieldLabel}>Preview frame</span>
                  <div className={styles.imageEditAiViewportButtons} aria-label="AI image preview frame">
                    {(['desktop', 'mobile'] as AiPreviewFrame[]).map((frame) => (
                      <button
                        key={frame}
                        type="button"
                        className={`${styles.imageEditOptionButton} ${aiPreviewFrame === frame ? styles.imageEditOptionButtonActive : ''}`}
                        data-builder-ai-image-preview-mode-button={frame}
                        onClick={() => setAiPreviewFrame(frame)}
                      >
                        {frame === 'desktop' ? 'Desktop' : 'Mobile'}
                      </button>
                    ))}
                  </div>
                </div>
                <label className={styles.inspectorField}>
                  <span className={styles.inspectorFieldLabel}>Edit prompt</span>
                  <textarea
                    className={styles.inspectorTextarea}
                    value={aiPrompt}
                    rows={5}
                    placeholder="예: 더 밝고 고급스러운 법률사무소 히어로 이미지로 바꾸고, 텍스트는 넣지 마세요."
                    data-builder-ai-image-edit-prompt="true"
                    onChange={(event) => setAiPrompt(event.target.value)}
                  />
                </label>
                <div className={styles.imageEditAiPresets} aria-label="AI edit prompt presets">
                  {AI_VARIATION_PRESETS.map((preset) => (
                    <button
                      key={preset.label}
                      type="button"
                      className={styles.imageEditOptionButton}
                      onClick={() => setAiPrompt(preset.prompt)}
                    >
                      {preset.label}
                    </button>
                  ))}
                </div>
                <div className={styles.imageEditAiMaskControls}>
                  <span className={styles.inspectorFieldLabel}>Mask area</span>
                  <div className={styles.imageEditAiPresets} aria-label="AI edit mask presets">
                    <button
                      type="button"
                      className={`${styles.imageEditOptionButton} ${!aiMaskRect && !aiBrushEnabled ? styles.imageEditOptionButtonActive : ''}`}
                      data-builder-ai-image-edit-mask="none"
                      onClick={() => {
                        setAiMaskRect(null);
                        setAiBrushEnabled(false);
                        setAiBrushStrokes([]);
                      }}
                    >
                      Full image
                    </button>
                    <button
                      type="button"
                      className={`${styles.imageEditOptionButton} ${aiBrushEnabled ? styles.imageEditOptionButtonActive : ''}`}
                      data-builder-ai-image-edit-mask="brush"
                      onClick={() => {
                        setAiMaskRect(null);
                        setAiBrushEnabled(true);
                      }}
                    >
                      Brush area
                    </button>
                    {AI_MASK_PRESETS.map((preset) => (
                      <button
                        key={preset.label}
                        type="button"
                        className={`${styles.imageEditOptionButton} ${aiMaskRect?.label === preset.label ? styles.imageEditOptionButtonActive : ''}`}
                        data-builder-ai-image-edit-mask={preset.label}
                        onClick={() => {
                          setAiMaskRect(preset);
                          setAiBrushEnabled(false);
                        }}
                      >
                        {preset.label}
                      </button>
                    ))}
                    <label className={styles.imageEditAiFeather}>
                      <span>Feather</span>
                      <input
                        type="range"
                        min={0}
                        max={12}
                        value={aiMaskFeather}
                        data-builder-ai-image-edit-feather="true"
                        onChange={(event) => setAiMaskFeather(Number(event.target.value))}
                      />
                      <strong>{aiMaskFeather}%</strong>
                    </label>
                    <label className={styles.imageEditAiFeather}>
                      <span>Edge</span>
                      <input
                        type="range"
                        min={-8}
                        max={8}
                        value={aiMaskEdge}
                        data-builder-ai-image-edit-edge="true"
                        onChange={(event) => setAiMaskEdge(Number(event.target.value))}
                      />
                      <strong>{aiMaskEdge > 0 ? `+${aiMaskEdge}` : aiMaskEdge}%</strong>
                    </label>
                    {aiBrushEnabled ? (
                      <div className={styles.imageEditAiBrushTools}>
                        <button
                          type="button"
                          className={`${styles.imageEditOptionButton} ${aiBrushMode === 'paint' ? styles.imageEditOptionButtonActive : ''}`}
                          data-builder-ai-image-edit-brush-mode="paint"
                          onClick={() => setAiBrushMode('paint')}
                        >
                          Add
                        </button>
                        <button
                          type="button"
                          className={`${styles.imageEditOptionButton} ${aiBrushMode === 'erase' ? styles.imageEditOptionButtonActive : ''}`}
                          data-builder-ai-image-edit-brush-mode="erase"
                          onClick={() => setAiBrushMode('erase')}
                        >
                          Erase
                        </button>
                        <label className={styles.imageEditAiBrushSize}>
                          <span>Brush size</span>
                          <input
                            type="range"
                            min={4}
                            max={18}
                            value={aiBrushSize}
                            data-builder-ai-image-edit-brush-size="true"
                            onChange={(event) => setAiBrushSize(Number(event.target.value))}
                          />
                          <strong>{aiBrushSize}</strong>
                        </label>
                        <button
                          type="button"
                          className={styles.imageEditAiUndoButton}
                          data-builder-ai-image-edit-undo-brush="true"
                          disabled={aiBrushStrokes.length === 0}
                          onClick={undoLastAiBrushStroke}
                        >
                          Undo stroke
                        </button>
                        <button
                          type="button"
                          className={styles.imageEditAiUndoButton}
                          data-builder-ai-image-edit-clear-brush="true"
                          disabled={aiBrushStrokes.length === 0}
                          onClick={() => setAiBrushStrokes([])}
                        >
                          Clear brush
                        </button>
                      </div>
                    ) : null}
                  </div>
                </div>
                {!builderAssetUrl ? (
                  <p className={styles.imageEditAiNotice} data-tone="warning">
                    AI edit requires an image from the builder asset library. Replace this image with an uploaded asset first.
                  </p>
                ) : null}
                {aiNotice ? (
                  <p
                    className={styles.imageEditAiNotice}
                    data-tone={aiNoticeTone}
                    data-builder-ai-image-edit-status="true"
                  >
                    {aiNotice}
                  </p>
                ) : null}
                <button
                  type="button"
                  className={styles.publishButton}
                  data-builder-ai-image-edit-generate="true"
                  disabled={!builderAssetUrl || aiPrompt.trim().length < 20 || aiGenerating}
                  onClick={handleGenerateAiEdit}
                >
                  {aiGenerating ? 'Generating...' : 'Generate edit'}
                </button>
                {aiEditedAssets.length > 0 ? (
                  <div className={styles.imageEditAiReviewControls} data-builder-ai-image-edit-review-controls="true">
                    <button
                      type="button"
                      className={`${styles.imageEditOptionButton} ${!aiReviewOriginal && aiEditedAsset ? styles.imageEditOptionButtonActive : ''}`}
                      data-builder-ai-image-edit-review="edited"
                      disabled={!aiEditedAsset}
                      onClick={() => setAiReviewOriginal(false)}
                    >
                      Selected edit
                    </button>
                    <button
                      type="button"
                      className={`${styles.imageEditOptionButton} ${aiReviewOriginal ? styles.imageEditOptionButtonActive : ''}`}
                      data-builder-ai-image-edit-review="original"
                      disabled={!aiEditedAsset}
                      onClick={() => setAiReviewOriginal(true)}
                    >
                      Original
                    </button>
                    <button
                      type="button"
                      className={styles.imageEditAiUndoButton}
                      data-builder-ai-image-edit-review-undo="true"
                      disabled={!canUndoAiReview}
                      onClick={() => restoreAiReviewSelection(-1)}
                    >
                      Undo review
                    </button>
                    <button
                      type="button"
                      className={styles.imageEditAiUndoButton}
                      data-builder-ai-image-edit-review-redo="true"
                      disabled={!canRedoAiReview}
                      onClick={() => restoreAiReviewSelection(1)}
                    >
                      Redo review
                    </button>
                    <button
                      type="button"
                      className={styles.imageEditAiUndoButton}
                      data-builder-ai-image-edit-clear="true"
                      disabled={!aiEditedAsset}
                      onClick={() => {
                        pushAiReviewSelection(null);
                        setAiNoticeTone('info');
                        setAiNotice('AI edit selection cleared. Apply will keep the current image.');
                      }}
                    >
                      Clear AI edit
                    </button>
                  </div>
                ) : null}
                {aiEditedAsset ? (
                  <div className={styles.imageEditAiTransactionReview} data-builder-ai-image-edit-transaction="true">
                    <div className={styles.imageEditAiTransactionFrame}>
                      <span>Current</span>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={dialogImageSrc} alt="" />
                    </div>
                    <div className={styles.imageEditAiTransactionFrame}>
                      <span>Selected edit</span>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={aiEditedAsset.url} alt="" />
                    </div>
                    <p>
                      Apply will replace the image source with <strong>{aiEditedAsset.filename}</strong>.
                    </p>
                  </div>
                ) : null}
                {aiEditedAssets.length > 0 ? (
                  <div className={styles.imageEditAiVariants} data-builder-ai-image-edit-variants="true">
                    {aiEditedAssets.map((asset) => (
                      <button
                        key={asset.url}
                        type="button"
                        className={`${styles.imageEditAiVariant} ${aiEditedAsset?.url === asset.url ? styles.imageEditAiVariantActive : ''}`}
                        data-builder-ai-image-edit-variant={asset.filename}
                        onClick={() => {
                          pushAiReviewSelection(asset);
                        }}
                      >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={asset.url} alt="" />
                        <span>{asset.filename}</span>
                      </button>
                    ))}
                  </div>
                ) : null}
              </div>
            ) : null}
          </section>
        </div>

        <footer className={styles.imageEditFooter}>
          <button type="button" className={styles.actionButton} onClick={onClose}>
            Cancel
          </button>
          <button
            type="button"
            className={styles.publishButton}
            onClick={() => {
              const nextContent: { src?: string; alt: string; cropAspect: string; focalPoint: ImageFocalPoint; filters: ImageFilters } = {
                alt: draftAlt,
                cropAspect: draftAspect,
                focalPoint: draftFocalPoint,
                filters: draftFilters,
              };
              if (aiEditedAsset?.url) nextContent.src = aiEditedAsset.url;
              onApply(nextContent);
            }}
          >
            Apply
          </button>
        </footer>
      </div>
    </div>
  );
}

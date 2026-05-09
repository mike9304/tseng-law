'use client';

import { useEffect, useMemo, useState } from 'react';
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

export type ImageEditTab = 'crop' | 'filter' | 'alt';
type ImageFocalPoint = { x: number; y: number };

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
  imageSrc: string;
  alt: string;
  cropAspect?: string;
  focalPoint?: ImageFocalPoint;
  filters?: ImageFilters;
  initialTab?: ImageEditTab;
  onApply: (content: { alt: string; cropAspect: string; focalPoint: ImageFocalPoint; filters: ImageFilters }) => void;
  onClose: () => void;
}) {
  const [activeTab, setActiveTab] = useState<ImageEditTab>('crop');
  const [draftAlt, setDraftAlt] = useState(alt);
  const [draftAspect, setDraftAspect] = useState(cropAspect || 'Free');
  const [draftFocalPoint, setDraftFocalPoint] = useState<ImageFocalPoint>(() => normalizeFocalPoint(focalPoint));
  const [draftFilters, setDraftFilters] = useState<ImageFilters>(filters ?? DEFAULT_FILTERS);

  useEffect(() => {
    if (!open) return;
    setActiveTab(initialTab);
    setDraftAlt(alt);
    setDraftAspect(cropAspect || 'Free');
    setDraftFocalPoint(normalizeFocalPoint(focalPoint));
    setDraftFilters(filters ?? DEFAULT_FILTERS);
  }, [alt, cropAspect, filters, focalPoint, initialTab, open]);

  useEffect(() => {
    if (!open) return undefined;
    const handler = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose, open]);

  const selectedRatio = useMemo(
    () => ASPECT_RATIOS.find((ratio) => ratio.label === draftAspect)?.value ?? null,
    [draftAspect],
  );
  const previewFilter = !isDefaultFilters(draftFilters) ? filtersToCSS(draftFilters) : undefined;
  const updateFocalPoint = (partial: Partial<ImageFocalPoint>) => {
    setDraftFocalPoint((current) => ({
      x: clampFocal(partial.x ?? current.x),
      y: clampFocal(partial.y ?? current.y),
    }));
  };

  if (!open) return null;

  return (
    <div className={styles.modalOverlay} role="presentation" onClick={onClose}>
      <div
        className={`${styles.modalCard} ${styles.imageEditDialog}`}
        role="dialog"
        aria-modal="true"
        aria-label="Crop, filter, and alt text"
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
            {imageSrc ? (
              <div className={styles.imageEditPreviewFrame}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={imageSrc}
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
              </div>
            ) : (
              <span className={styles.modalHint}>No image source.</span>
            )}
          </div>

          <section className={styles.imageEditControls}>
            <div className={styles.imageEditTabs}>
              {(['crop', 'filter', 'alt'] as ImageEditTab[]).map((tab) => (
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
          </section>
        </div>

        <footer className={styles.imageEditFooter}>
          <button type="button" className={styles.actionButton} onClick={onClose}>
            Cancel
          </button>
          <button
            type="button"
            className={styles.publishButton}
            onClick={() => onApply({
              alt: draftAlt,
              cropAspect: draftAspect,
              focalPoint: draftFocalPoint,
              filters: draftFilters,
            })}
          >
            Apply
          </button>
        </footer>
      </div>
    </div>
  );
}

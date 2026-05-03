'use client';

import { useEffect, useMemo, useState } from 'react';
import { ASPECT_RATIOS } from '@/lib/builder/canvas/crop';
import {
  DEFAULT_FILTERS,
  FILTER_PRESETS,
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

type ImageEditTab = 'crop' | 'filter' | 'alt';

export default function ImageEditDialog({
  open,
  imageSrc,
  alt,
  cropAspect,
  filters,
  onApply,
  onClose,
}: {
  open: boolean;
  imageSrc: string;
  alt: string;
  cropAspect?: string;
  filters?: ImageFilters;
  onApply: (content: { alt: string; cropAspect: string; filters: ImageFilters }) => void;
  onClose: () => void;
}) {
  const [activeTab, setActiveTab] = useState<ImageEditTab>('crop');
  const [draftAlt, setDraftAlt] = useState(alt);
  const [draftAspect, setDraftAspect] = useState(cropAspect || 'Free');
  const [draftFilters, setDraftFilters] = useState<ImageFilters>(filters ?? DEFAULT_FILTERS);

  useEffect(() => {
    if (!open) return;
    setActiveTab('crop');
    setDraftAlt(alt);
    setDraftAspect(cropAspect || 'Free');
    setDraftFilters(filters ?? DEFAULT_FILTERS);
  }, [alt, cropAspect, filters, open]);

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
                <img src={imageSrc} alt={draftAlt || 'Image preview'} />
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
            onClick={() => onApply({ alt: draftAlt, cropAspect: draftAspect, filters: draftFilters })}
          >
            Apply
          </button>
        </footer>
      </div>
    </div>
  );
}

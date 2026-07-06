'use client';

import { useCallback, useId, useLayoutEffect, useMemo, useRef, useState } from 'react';
import type { Locale } from '@/lib/locales';
import type { BuilderCanvasNode } from '@/lib/builder/canvas/types';
import {
  SAVED_SECTION_CATEGORIES,
  type SavedSection,
  type SavedSectionCategory,
} from '@/lib/builder/site/types';
import { normalizeSavedSectionSnapshot } from '@/lib/builder/sections/normalize';
import { buildSavedSectionThumbnailSvg } from '@/lib/builder/sections/thumbnail';
import EditorChromeIcon from '@/components/builder/canvas/EditorChromeIcon';
import { getSaveSectionModalCopy } from './section-panel-copy';
import styles from './SaveSectionModal.module.css';

export { buildSavedSectionThumbnailSvg as buildThumbnailSvg } from '@/lib/builder/sections/thumbnail';

const FOCUSABLE_SELECTOR = [
  'a[href]',
  'button:not([disabled])',
  'input:not([disabled])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  '[tabindex]:not([tabindex="-1"])',
].join(',');

export interface SaveSectionPayload {
  rootNodeId: string;
  /** Snapshot — root + descendants. The modal/server normalize before storage. */
  nodes: BuilderCanvasNode[];
}

function getFocusableElements(container: HTMLElement): HTMLElement[] {
  return Array.from(container.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR)).filter((element) => (
    !element.hidden &&
    !element.closest('[hidden]') &&
    element.getAttribute('aria-hidden') !== 'true' &&
    element.getClientRects().length > 0
  ));
}

export default function SaveSectionModal({
  payload,
  locale,
  onSaved,
  onClose,
}: {
  payload: SaveSectionPayload;
  locale: Locale;
  onSaved: (section: SavedSection) => void;
  onClose: () => void;
}) {
  const copy = getSaveSectionModalCopy(locale);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<SavedSectionCategory>('custom');
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const panelRef = useRef<HTMLDivElement | null>(null);
  const nameInputRef = useRef<HTMLInputElement | null>(null);
  const restoreFocusRef = useRef<HTMLElement | null>(null);
  const closingRef = useRef(false);
  const titleId = useId();
  const introId = useId();
  const errorId = useId();

  const closeModal = useCallback(() => {
    closingRef.current = true;
    onClose();
  }, [onClose]);

  useLayoutEffect(() => {
    restoreFocusRef.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    closingRef.current = false;
    const panel = panelRef.current;
    if (!panel) return undefined;

    const previousBodyOverflow = document.body.style.overflow;
    const focusFrame = window.requestAnimationFrame(() => {
      (nameInputRef.current ?? getFocusableElements(panel)[0] ?? panel).focus({ preventScroll: true });
    });
    const handleFocusIn = (event: FocusEvent) => {
      if (panel.contains(event.target as Node | null)) return;
      (nameInputRef.current ?? getFocusableElements(panel)[0] ?? panel).focus({ preventScroll: true });
    };

    document.body.style.overflow = 'hidden';
    document.addEventListener('focusin', handleFocusIn);
    return () => {
      window.cancelAnimationFrame(focusFrame);
      document.body.style.overflow = previousBodyOverflow;
      document.removeEventListener('focusin', handleFocusIn);
      if (!closingRef.current) return;
      const restoreTarget = restoreFocusRef.current;
      window.setTimeout(() => {
        if (restoreTarget?.isConnected) restoreTarget.focus({ preventScroll: true });
        restoreFocusRef.current = null;
        closingRef.current = false;
      }, 0);
    };
  }, []);

  const handleDialogKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'Escape') {
      event.preventDefault();
      event.stopPropagation();
      closeModal();
      return;
    }
    if (event.key !== 'Tab') return;

    const panel = panelRef.current;
    if (!panel) return;
    const focusable = getFocusableElements(panel);
    if (focusable.length === 0) {
      event.preventDefault();
      panel.focus({ preventScroll: true });
      return;
    }

    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus({ preventScroll: true });
      return;
    }
    if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus({ preventScroll: true });
    }
  };

  const normalizedPayload = useMemo(
    () => ({
      rootNodeId: payload.rootNodeId,
      nodes: normalizeSavedSectionSnapshot(payload.nodes, payload.rootNodeId),
    }),
    [payload.nodes, payload.rootNodeId],
  );
  const thumbnailSvg = useMemo(
    () => buildSavedSectionThumbnailSvg(normalizedPayload.nodes, normalizedPayload.rootNodeId),
    [normalizedPayload],
  );
  const canSave = name.trim().length > 0 && !submitting;

  async function handleSave() {
    if (submitting) return;
    if (!name.trim()) {
      setErrorMessage(copy.nameRequired);
      return;
    }
    if (normalizedPayload.nodes.length === 0) {
      setErrorMessage(copy.invalidSectionData);
      return;
    }
    setSubmitting(true);
    setErrorMessage(null);

    try {
      const response = await fetch(
        `/api/builder/site/section-library?locale=${encodeURIComponent(locale)}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'same-origin',
          body: JSON.stringify({
            name: name.trim(),
            description: description.trim() || undefined,
            category,
            rootNodeId: normalizedPayload.rootNodeId,
            nodes: normalizedPayload.nodes,
            locale,
          }),
        },
      );
      const data = (await response.json()) as { ok: boolean; section?: SavedSection; error?: string };
      if (!response.ok || !data.ok || !data.section) {
        setErrorMessage(data.error ?? copy.saveFailed);
        return;
      }
      closingRef.current = true;
      onSaved(data.section);
    } catch (error) {
      const message = error instanceof Error ? error.message : copy.saveFailed;
      setErrorMessage(message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div
      role="presentation"
      className={styles.backdrop}
      onClick={(event) => {
        if (event.target === event.currentTarget) closeModal();
      }}
    >
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label={copy.ariaLabel}
        aria-labelledby={titleId}
        aria-describedby={errorMessage ? `${introId} ${errorId}` : introId}
        tabIndex={-1}
        data-builder-save-section-dialog="true"
        onKeyDownCapture={handleDialogKeyDown}
        className={styles.panel}
      >
        <div className={styles.header}>
          <div className={styles.titleBlock}>
            <h2 id={titleId} className={styles.title}>
              {copy.title}
            </h2>
            <p id={introId} className={styles.intro}>
              {copy.intro}
            </p>
          </div>
          <button
            type="button"
            onClick={closeModal}
            aria-label={copy.closeAriaLabel}
            className={styles.closeButton}
          >
            <EditorChromeIcon name="close" />
          </button>
        </div>

        <form
          className={styles.formShell}
          onSubmit={(event) => {
            event.preventDefault();
            void handleSave();
          }}
        >
          <div className={styles.body}>
            <div className={styles.previewPane}>
              <div
                className={styles.previewFrame}
                dangerouslySetInnerHTML={{ __html: thumbnailSvg }}
              />
            </div>

            <div className={styles.formPane}>
              <label className={styles.field}>
                <span className={styles.fieldLabel}>{copy.nameLabel}</span>
                <input
                  ref={nameInputRef}
                  type="text"
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  maxLength={200}
                  autoFocus
                  placeholder={copy.namePlaceholder}
                  className={styles.input}
                />
              </label>

              <label className={styles.field}>
                <span className={styles.fieldLabel}>{copy.descriptionLabel}</span>
                <textarea
                  value={description}
                  onChange={(event) => setDescription(event.target.value)}
                  maxLength={1000}
                  rows={3}
                  placeholder={copy.descriptionPlaceholder}
                  className={`${styles.input} ${styles.textarea}`}
                />
              </label>

              <label className={styles.field}>
                <span className={styles.fieldLabel}>{copy.categoryLabel}</span>
                <select
                  value={category}
                  onChange={(event) => setCategory(event.target.value as SavedSectionCategory)}
                  className={`${styles.input} ${styles.select}`}
                >
                  {SAVED_SECTION_CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {copy.categoryLabels[cat]}
                    </option>
                  ))}
                </select>
              </label>

              {errorMessage ? (
                <div id={errorId} className={styles.errorMessage} role="alert">
                  {errorMessage}
                </div>
              ) : null}
            </div>
          </div>

          <div className={styles.footer}>
            <button
              type="button"
              onClick={closeModal}
              disabled={submitting}
              className={styles.secondaryButton}
            >
              {copy.cancel}
            </button>
            <button
              type="submit"
              disabled={!canSave}
              className={styles.primaryButton}
            >
              {submitting ? copy.saving : copy.save}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

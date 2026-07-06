'use client';

import type { ActivityChip, SandboxToast } from '@/components/builder/canvas/SandboxPageChrome';
import type { Locale } from '@/lib/locales';
import { getSandboxFeedbackOverlayCopy } from './sandbox-feedback-copy';
import styles from './SandboxPage.module.css';

type DraftSaveState = 'idle' | 'saving' | 'saved' | 'error';

interface SandboxFeedbackOverlayProps {
  locale: Locale;
  draftSaveState: DraftSaveState;
  activityChips: ActivityChip[];
  toasts: SandboxToast[];
  onDismissToast: (toastId: string) => void;
}

function getSaveStatusClassName(draftSaveState: Exclude<DraftSaveState, 'idle'>) {
  const statusSuffix = `${draftSaveState[0].toUpperCase()}${draftSaveState.slice(1)}`;
  return `${styles.saveStatusChip} ${styles[`saveStatusChip${statusSuffix}` as keyof typeof styles]}`;
}

export default function SandboxFeedbackOverlay({
  locale,
  draftSaveState,
  activityChips,
  toasts,
  onDismissToast,
}: SandboxFeedbackOverlayProps) {
  const copy = getSandboxFeedbackOverlayCopy(locale);

  return (
    <>
      <div className={styles.lowerLeftChipStack} aria-live="polite" aria-atomic="false">
        {draftSaveState !== 'idle' ? (
          <div
            className={getSaveStatusClassName(draftSaveState)}
            data-save-status-chip={draftSaveState}
            data-builder-save-status={draftSaveState}
          >
            <span className={styles.saveStatusGlyph} data-save-status-glyph aria-hidden="true" />
            <strong>{copy.saveStatusLabels[draftSaveState]}</strong>
          </div>
        ) : null}
        {activityChips.map((chip) => (
          <div key={chip.id} className={styles.activityChip} data-builder-activity-chip="true">
            {chip.message}
          </div>
        ))}
      </div>

      <div className={styles.toastStack} aria-live="polite" aria-atomic="true">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`${styles.toast} ${toast.tone === 'error' ? styles.toastError : styles.toastSuccess}`}
          >
            <span className={styles.toastMessage}>{toast.message}</span>
            {toast.actionLabel && toast.onAction ? (
              <button
                type="button"
                className={styles.toastAction}
                onClick={() => {
                  toast.onAction?.();
                  onDismissToast(toast.id);
                }}
              >
                {toast.actionLabel}
              </button>
            ) : null}
          </div>
        ))}
      </div>
    </>
  );
}

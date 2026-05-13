'use client';

import type { ActivityChip, SandboxToast } from '@/components/builder/canvas/SandboxPageChrome';
import styles from './SandboxPage.module.css';

type DraftSaveState = 'idle' | 'saving' | 'saved' | 'error';

interface SandboxFeedbackOverlayProps {
  draftSaveState: DraftSaveState;
  activityChips: ActivityChip[];
  toasts: SandboxToast[];
  onDismissToast: (toastId: string) => void;
}

function getSaveStatusClassName(draftSaveState: Exclude<DraftSaveState, 'idle'>) {
  const statusSuffix = `${draftSaveState[0].toUpperCase()}${draftSaveState.slice(1)}`;
  return `${styles.saveStatusChip} ${styles[`saveStatusChip${statusSuffix}` as keyof typeof styles]}`;
}

function getSaveStatusLabel(draftSaveState: Exclude<DraftSaveState, 'idle'>) {
  if (draftSaveState === 'saving') return 'Saving…';
  if (draftSaveState === 'saved') return 'Saved';
  return 'Save failed';
}

export default function SandboxFeedbackOverlay({
  draftSaveState,
  activityChips,
  toasts,
  onDismissToast,
}: SandboxFeedbackOverlayProps) {
  return (
    <>
      <div className={styles.lowerLeftChipStack} aria-live="polite" aria-atomic="false">
        {draftSaveState !== 'idle' ? (
          <div
            className={getSaveStatusClassName(draftSaveState)}
            data-save-status-chip={draftSaveState}
          >
            <span className={styles.saveStatusGlyph} data-save-status-glyph aria-hidden="true" />
            <strong>{getSaveStatusLabel(draftSaveState)}</strong>
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

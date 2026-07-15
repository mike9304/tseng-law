'use client';

import type { ActivityChip, SandboxToast } from '@/components/builder/canvas/SandboxPageChrome';
import type { Locale } from '@/lib/locales';
import { getSandboxFeedbackOverlayCopy } from './sandbox-feedback-copy';
import styles from './SandboxPage.module.css';
import chromeStyles from './SandboxChrome.module.css';

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
            data-builder-topbar-status="true"
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

      <div className={`${styles.toastStack} ${chromeStyles.toastStack}`}>
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`${styles.toast} ${chromeStyles.toast} ${toast.tone === 'error' ? styles.toastError : styles.toastSuccess}`}
            role={toast.tone === 'error' ? 'alert' : 'status'}
            aria-live={toast.tone === 'error' ? 'assertive' : 'polite'}
            aria-atomic="true"
            data-builder-toast={toast.tone}
          >
            <span className={`${styles.toastMessage} ${chromeStyles.toastMessage}`}>{toast.message}</span>
            <div className={chromeStyles.toastActions}>
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
              <button
                type="button"
                className={chromeStyles.toastDismiss}
                aria-label={copy.dismissToastLabel}
                title={copy.dismissToastLabel}
                data-builder-toast-dismiss="true"
                onClick={() => onDismissToast(toast.id)}
              >
                <span aria-hidden="true">×</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

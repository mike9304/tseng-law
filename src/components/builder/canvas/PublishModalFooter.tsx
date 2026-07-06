import type { PublishModalCopy } from './publish-copy';
import type { PublishState } from './PublishModalTypes';
import styles from './PublishModal.module.css';

interface PublishModalFooterProps {
  readonly canSubmitPublish: boolean;
  readonly copy: PublishModalCopy;
  readonly hasWarningsOnly: boolean;
  readonly handlePublish: () => void;
  readonly onClose: () => void;
  readonly overrideWarnings: boolean;
  readonly publishState: PublishState;
  readonly setOverrideWarnings: (overrideWarnings: boolean) => void;
  readonly warningCount: number;
}

export function PublishModalFooter({
  canSubmitPublish,
  copy,
  hasWarningsOnly,
  handlePublish,
  onClose,
  overrideWarnings,
  publishState,
  setOverrideWarnings,
  warningCount,
}: PublishModalFooterProps): JSX.Element {
  return (
    <div className={styles.buttonRow}>
      <button type="button" className={styles.cancelButton} onClick={onClose}>
        {publishState === 'success' ? copy.closeButton : copy.cancelButton}
      </button>

      {publishState !== 'success' && hasWarningsOnly && !overrideWarnings ? (
        <button
          type="button"
          className={styles.publishWarnButton}
          onClick={() => setOverrideWarnings(true)}
        >
          {copy.overrideWarningsButton}
        </button>
      ) : null}

      {publishState !== 'success' ? (
        <button
          type="button"
          className={styles.publishButton}
          data-enabled={canSubmitPublish ? 'true' : 'false'}
          disabled={
            !canSubmitPublish ||
            publishState !== 'ready' ||
            (warningCount > 0 && !overrideWarnings)
          }
          onClick={handlePublish}
        >
          {publishState === 'publishing' ? copy.publishingButton : copy.publishButton}
        </button>
      ) : null}
    </div>
  );
}

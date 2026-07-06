import type { Locale } from '@/lib/locales';
import { formatScheduledAt } from './PublishModalPreflight';
import type { PublishModalCopy } from './publish-copy';
import type { ScheduledPublishJob } from './PublishModalTypes';
import styles from './PublishModal.module.css';

interface PublishModalSchedulePanelProps {
  readonly canSubmitPublish: boolean;
  readonly copy: PublishModalCopy;
  readonly handleCancelScheduledPublish: () => void;
  readonly handleSchedulePublish: () => void;
  readonly locale: Locale;
  readonly scheduleCancelPending: boolean;
  readonly schedulePending: boolean;
  readonly scheduledAtInput: string;
  readonly scheduledJob: ScheduledPublishJob | null;
  readonly setScheduledAtInput: (value: string) => void;
}

export function PublishModalSchedulePanel({
  canSubmitPublish,
  copy,
  handleCancelScheduledPublish,
  handleSchedulePublish,
  locale,
  scheduleCancelPending,
  schedulePending,
  scheduledAtInput,
  scheduledJob,
  setScheduledAtInput,
}: PublishModalSchedulePanelProps): JSX.Element {
  const isCancellingScheduledJob = scheduledJob?.status === 'scheduled';

  return (
    <div className={styles.schedulePanel}>
      <div className={styles.scheduleHeader}>
        <span>{copy.scheduleTitle}</span>
        {scheduledJob ? (
          <span className={styles.checklistStatus} data-builder-publish-schedule-status={scheduledJob.status}>
            {copy.scheduledJobStatus(scheduledJob.status)}
          </span>
        ) : null}
      </div>
      <div className={styles.scheduleRow}>
        <input
          type="datetime-local"
          value={scheduledAtInput}
          onChange={(event) => setScheduledAtInput(event.target.value)}
          className={styles.scheduleInput}
          aria-label={copy.scheduleInputAria}
        />
        <button
          type="button"
          className={styles.scheduleButton}
          disabled={!canSubmitPublish || schedulePending || scheduleCancelPending}
          data-builder-publish-schedule-action={isCancellingScheduledJob ? 'cancel' : 'schedule'}
          onClick={() => {
            if (isCancellingScheduledJob) {
              handleCancelScheduledPublish();
            } else {
              handleSchedulePublish();
            }
          }}
        >
          {schedulePending
            ? copy.schedulePending
            : scheduleCancelPending
              ? copy.scheduleCancelPending
              : isCancellingScheduledJob
                ? copy.scheduleActionCancel
                : copy.scheduleActionSchedule}
        </button>
      </div>
      {scheduledJob ? (
        <div className={styles.scheduleHelp}>
          {formatScheduledAt(scheduledJob.scheduledAt, locale)} · {copy.scheduleTitle}
          {scheduledJob.expectedDraftRevision ? ` · ${copy.scheduleDraftRevisionLabel}${scheduledJob.expectedDraftRevision}` : ''}
        </div>
      ) : (
        <div className={styles.scheduleHelp}>
          {copy.scheduleHelp}
        </div>
      )}
    </div>
  );
}

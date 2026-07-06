import type { TranslationCopy } from './translation-copy';
import type { TranslationBatchProgressState } from './TranslationManagerView.types';
import styles from './TranslationManager.module.css';

export default function TranslationBatchProgress({
  progress,
  copy,
}: {
  readonly progress: TranslationBatchProgressState | null;
  readonly copy: TranslationCopy;
}) {
  if (!progress) return null;

  const completed = progress.stage === 'translating' ? 0 : progress.saved + progress.failed;
  const percent = progress.total > 0 ? Math.round((completed / progress.total) * 100) : 0;
  const message = progress.stage === 'translating'
    ? copy.managerBatchProgressTranslating(progress.locale, progress.total)
    : copy.managerBatchProgressSaving(progress.saved, progress.failed, progress.total, progress.locale);

  return (
    <div
      aria-label={copy.managerBatchProgressTitle}
      aria-live="polite"
      className={styles.batchProgressCard}
      data-translation-batch-progress="true"
      role="status"
    >
      <div className={styles.batchProgressHeader}>
        <span>{copy.managerBatchProgressTitle}</span>
        <span>{percent}%</span>
      </div>
      <div className={styles.batchProgressTrack} aria-hidden="true">
        <div className={styles.batchProgressFill} style={{ width: `${percent}%` }} />
      </div>
      <p className={styles.batchProgressMeta}>{message}</p>
      {progress.summary ? (
        <>
          <p className={styles.batchProgressMeta} data-translation-batch-provider-telemetry="true">
            {copy.managerBatchProviderTelemetry(
              progress.summary.provider,
              progress.summary.mode,
              progress.summary.succeeded,
              progress.summary.requested,
              progress.summary.failed,
            )}
          </p>
          {progress.summary.step ? (
            <p className={styles.batchProgressMeta} data-translation-batch-provider-step="true">
              {copy.managerBatchProviderStepTelemetry(
                progress.summary.step.name,
                progress.summary.step.cached,
                progress.summary.step.sent,
                progress.summary.step.succeeded,
                progress.summary.step.failed,
                progress.summary.step.durationMs,
                progress.summary.step.partialCharacters,
                progress.summary.step.chunkCount,
                progress.summary.step.totalTokens,
                progress.summary.step.estimatedCostUsd,
              )}
            </p>
          ) : null}
        </>
      ) : null}
    </div>
  );
}

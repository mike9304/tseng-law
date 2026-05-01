'use client';

import type { TranslationProgress as TranslationProgressValue } from '@/lib/builder/translations/types';
import styles from './TranslationManager.module.css';

export default function TranslationProgress({
  progress,
}: {
  progress: TranslationProgressValue[];
}) {
  if (progress.length === 0) return null;

  return (
    <div className={styles.progressGrid}>
      {progress.map((item) => (
        <div className={styles.progressCard} key={item.locale}>
          <div className={styles.progressHeader}>
            <span>{item.locale}</span>
            <span>{item.percent}%</span>
          </div>
          <div className={styles.progressTrack} aria-hidden="true">
            <div className={styles.progressFill} style={{ width: `${item.percent}%` }} />
          </div>
          <div className={styles.progressStats}>
            {item.translated + item.manual}/{item.total} complete - {item.missing} missing - {item.outdated} outdated
          </div>
        </div>
      ))}
    </div>
  );
}

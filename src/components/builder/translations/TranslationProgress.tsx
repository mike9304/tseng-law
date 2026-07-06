'use client';

import Link from 'next/link';
import type { Locale } from '@/lib/locales';
import type { TranslationProgress as TranslationProgressValue } from '@/lib/builder/translations/types';
import { buildTranslationManagerReviewQuery } from '@/lib/builder/translations/query';
import { getTranslationCopy } from './translation-copy';
import styles from './TranslationManager.module.css';

export default function TranslationProgress({
  progress,
  routeLocale,
  sourceLocale,
}: {
  progress: TranslationProgressValue[];
  routeLocale: Locale;
  sourceLocale: Locale;
}) {
  const copy = getTranslationCopy(routeLocale);
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
            {copy.progressComplete(item.translated + item.manual, item.total)} - {copy.progressMissing(item.missing)} - {copy.progressOutdated(item.outdated)}
          </div>
          <div className={styles.progressActions}>
            {item.missing > 0 ? (
              <Link
                className={styles.progressActionLink}
                href={`/${routeLocale}/admin-builder/translations?${buildTranslationManagerReviewQuery({
                  sourceLocale,
                  targetLocale: item.locale,
                  statusFilter: 'missing',
                })}`}
              >
                {copy.progressReviewMissing}
              </Link>
            ) : (
              <span className={styles.progressActionMuted}>{copy.progressNoMissing}</span>
            )}
            {item.outdated > 0 ? (
              <Link
                className={styles.progressActionLink}
                href={`/${routeLocale}/admin-builder/translations?${buildTranslationManagerReviewQuery({
                  sourceLocale,
                  targetLocale: item.locale,
                  statusFilter: 'outdated',
                })}`}
              >
                {copy.progressReviewOutdated}
              </Link>
            ) : (
              <span className={styles.progressActionMuted}>{copy.progressNoOutdated}</span>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

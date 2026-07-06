'use client';

import type { Locale } from '@/lib/locales';
import styles from './SeoPanelHreflangTab.module.css';
import { getSeoPanelHreflangCopy } from './seo-panel-hreflang-copy';

export interface HreflangAlternateResponse {
  hreflang: string;
  locale: string;
  href: string;
}

export interface SiblingPageResponse {
  locale: string;
  pageId: string;
  slug: string;
  hreflang: string;
  noIndex: boolean;
}

interface SeoPanelHreflangTabProps {
  active: boolean;
  locale: Locale;
  hreflangAlternates: HreflangAlternateResponse[];
  siblings: SiblingPageResponse[];
  missingLocales: string[];
  sitemapIncluded: boolean;
}

export function SeoPanelHreflangTab({
  active,
  locale,
  hreflangAlternates,
  siblings,
  missingLocales,
  sitemapIncluded,
}: SeoPanelHreflangTabProps) {
  const copy = getSeoPanelHreflangCopy(locale);

  return (
    <section className={styles.section} data-active={active ? 'true' : 'false'}>
      <div className={styles.titleBlock}>
        <h3 className={styles.sectionTitle}>{copy.title}</h3>
        <span className={styles.helpText}>{copy.description}</span>
      </div>
      {hreflangAlternates.length === 0 ? (
        <div className={`${styles.previewCard} ${styles.emptyCard}`}>
          {copy.empty}
        </div>
      ) : (
        <div className={styles.list}>
          {hreflangAlternates.map((alt) => (
            <div
              key={`${alt.hreflang}:${alt.href}`}
              className={`${styles.previewCard} ${styles.alternateRow}`}
            >
              <strong
                className={styles.hreflangCode}
                data-default={alt.hreflang === 'x-default' ? 'true' : undefined}
              >
                {alt.hreflang}
              </strong>
              <span className={styles.rowUrl}>{alt.href}</span>
            </div>
          ))}
        </div>
      )}

      <div className={styles.titleBlock}>
        <h3 className={styles.sectionTitle}>{copy.siblingsTitle}</h3>
        <span className={styles.helpText}>{copy.siblingsDescription}</span>
      </div>
      {siblings.length === 0 ? (
        <div className={`${styles.previewCard} ${styles.emptyCard}`}>
          {copy.siblingsEmpty}
        </div>
      ) : (
        <div className={styles.list}>
          {siblings.map((sibling) => (
            <div
              key={sibling.pageId}
              className={`${styles.previewCard} ${styles.siblingRow}`}
            >
              <strong className={styles.hreflangCode}>{sibling.hreflang}</strong>
              <span className={styles.siblingUrl}>/{sibling.locale}/{sibling.slug || ''}</span>
              <span
                className={styles.indexStatus}
                data-tone={sibling.noIndex ? 'warning' : 'success'}
              >
                {sibling.noIndex ? copy.noIndex : copy.indexed}
              </span>
            </div>
          ))}
        </div>
      )}

      {missingLocales.length > 0 ? (
        <div className={`${styles.previewCard} ${styles.warningCard}`}>
          <strong>{copy.missing}</strong>
          {missingLocales.join(', ')} — {copy.missingHint}
        </div>
      ) : null}

      <div className={styles.titleBlock}>
        <h3 className={styles.sectionTitle}>{copy.sitemapTitle}</h3>
        <span className={styles.helpText}>{copy.sitemapDescription}</span>
      </div>
      <div
        className={`${styles.previewCard} ${styles.statusCard}`}
        data-included={sitemapIncluded ? 'true' : 'false'}
      >
        <strong className={styles.statusLabel}>{sitemapIncluded ? copy.included : copy.excluded}</strong>
        <span className={styles.statusHelp}>
          {sitemapIncluded ? copy.crawlable : copy.blocked}
        </span>
      </div>
    </section>
  );
}

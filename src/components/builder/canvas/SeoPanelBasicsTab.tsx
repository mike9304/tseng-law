'use client';

import {
  SEO_DESCRIPTION_MAX,
  SEO_DESCRIPTION_MIN,
  SEO_TITLE_MAX,
  SEO_TITLE_MIN,
} from '@/lib/builder/seo/validation';
import type { Locale } from '@/lib/locales';
import styles from './SeoPanelBasicsTab.module.css';
import { getSeoPanelBasicsCopy } from './seo-panel-basics-copy';

export type SeoBasicsTextField = 'slug' | 'canonical' | 'title' | 'description';
export type SeoBasicsBooleanField = 'noIndex' | 'noFollow';

interface SeoBasicsPage {
  slug: string;
  isHomePage?: boolean;
}

interface SeoPanelBasicsTabProps {
  active: boolean;
  locale: Locale;
  page?: SeoBasicsPage | null;
  defaults?: {
    canonical?: string;
  };
  slug: string;
  canonical: string;
  title: string;
  description: string;
  noIndex: boolean;
  noFollow: boolean;
  createRedirect: boolean;
  canonicalPreview: string;
  searchTitle: string;
  searchDescription: string;
  onChangeTextField: (key: SeoBasicsTextField, value: string) => void;
  onChangeBooleanField: (key: SeoBasicsBooleanField, value: boolean) => void;
  onChangeCreateRedirect: (value: boolean) => void;
}

function counterTone(length: number, min: number, max: number): 'muted' | 'warning' | 'success' {
  if (length === 0) return 'muted';
  if (length < min || length > max) return 'warning';
  return 'success';
}

function fieldCounter(value: string, min: number, max: number, label: string) {
  const length = value.trim().length;
  return (
    <div className={styles.counterRow}>
      <span className={styles.helpText}>{label}</span>
      <strong className={styles.counterValue} data-tone={counterTone(length, min, max)}>
        {length}/{max}
      </strong>
    </div>
  );
}

export function SeoPanelBasicsTab({
  active,
  locale,
  page,
  defaults,
  slug,
  canonical,
  title,
  description,
  noIndex,
  noFollow,
  createRedirect,
  canonicalPreview,
  searchTitle,
  searchDescription,
  onChangeTextField,
  onChangeBooleanField,
  onChangeCreateRedirect,
}: SeoPanelBasicsTabProps) {
  const t = getSeoPanelBasicsCopy(locale);
  return (
    <>
      <section className={styles.section} data-active={active ? 'true' : 'false'}>
        <h3 className={styles.sectionTitle}>{t.basicsTitle}</h3>
        <div className={styles.twoColumn}>
          <div className={styles.field}>
            <label className={styles.label} htmlFor="builder-seo-slug">{t.slug}</label>
            <input
              id="builder-seo-slug"
              type="text"
              value={slug}
              disabled={Boolean(page?.isHomePage)}
              placeholder={t.slugPlaceholder}
              className={styles.input}
              onChange={(event) => onChangeTextField('slug', event.target.value)}
            />
            <span className={styles.helpText}>{t.slugHelp(locale, slug)}</span>
          </div>
          <div className={styles.field}>
            <label className={styles.label} htmlFor="builder-seo-canonical">{t.canonical}</label>
            <input
              id="builder-seo-canonical"
              type="url"
              value={canonical}
              placeholder={defaults?.canonical || t.canonicalPlaceholder}
              className={styles.input}
              onChange={(event) => onChangeTextField('canonical', event.target.value)}
            />
            <span className={styles.helpText}>{t.canonicalHelp}</span>
          </div>
        </div>
        {!page?.isHomePage && page && page.slug !== slug ? (
          <label className={styles.checkboxRow}>
            <input
              type="checkbox"
              checked={createRedirect}
              onChange={(event) => onChangeCreateRedirect(event.target.checked)}
            />
            <span>
              <strong>{t.createRedirect}</strong><br />
              {t.createRedirectBody1(locale, page.slug)}
              <br />
              {t.createRedirectBody2}
            </span>
          </label>
        ) : null}

        <div className={styles.field}>
          <label className={styles.label} htmlFor="builder-seo-title">{t.title}</label>
          <input
            id="builder-seo-title"
            type="text"
            value={title}
            placeholder={t.titlePlaceholder}
            className={styles.input}
            onChange={(event) => onChangeTextField('title', event.target.value)}
          />
          {fieldCounter(
            title,
            SEO_TITLE_MIN,
            SEO_TITLE_MAX,
            t.recommendedCounter(SEO_TITLE_MIN, SEO_TITLE_MAX),
          )}
        </div>

        <div className={styles.field}>
          <label className={styles.label} htmlFor="builder-seo-description">{t.description}</label>
          <textarea
            id="builder-seo-description"
            value={description}
            placeholder={t.descriptionPlaceholder}
            className={`${styles.input} ${styles.textarea}`}
            onChange={(event) => onChangeTextField('description', event.target.value)}
          />
          {fieldCounter(
            description,
            SEO_DESCRIPTION_MIN,
            SEO_DESCRIPTION_MAX,
            t.recommendedCounter(SEO_DESCRIPTION_MIN, SEO_DESCRIPTION_MAX),
          )}
        </div>

        <div className={styles.checkboxGrid}>
          <label className={styles.checkboxRow}>
            <input
              type="checkbox"
              checked={noIndex}
              onChange={(event) => onChangeBooleanField('noIndex', event.target.checked)}
            />
            <span><strong>{t.noIndex}</strong><br />{t.noIndexBody}</span>
          </label>
          <label className={styles.checkboxRow}>
            <input
              type="checkbox"
              checked={noFollow}
              onChange={(event) => onChangeBooleanField('noFollow', event.target.checked)}
            />
            <span><strong>{t.noFollow}</strong><br />{t.noFollowBody}</span>
          </label>
        </div>
      </section>

      <section className={styles.section} data-active={active ? 'true' : 'false'}>
        <h3 className={styles.sectionTitle}>{t.preview}</h3>
        <div className={styles.previewCard}>
          <div className={styles.previewUrl}>{canonicalPreview}</div>
          <div className={styles.previewTitle}>{searchTitle}</div>
          <div className={styles.previewDescription}>{searchDescription}</div>
        </div>
      </section>
    </>
  );
}

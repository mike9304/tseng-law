'use client';

import type { Locale } from '@/lib/locales';
import styles from './SeoPanelSocialTab.module.css';
import { getSeoPanelSocialCopy } from './seo-panel-social-copy';

type TwitterCard = 'summary' | 'summary_large_image';

export type SeoSocialTextField =
  | 'ogTitle'
  | 'ogImage'
  | 'ogDescription'
  | 'twitterImage'
  | 'twitterTitle'
  | 'twitterDescription';

interface SeoPanelSocialTabProps {
  active: boolean;
  locale: Locale;
  ogTitle: string;
  ogImage: string;
  ogDescription: string;
  twitterCard: TwitterCard;
  twitterImage: string;
  twitterTitle: string;
  twitterDescription: string;
  socialImage: string;
  socialTitle: string;
  socialDescription: string;
  onChangeTextField: (key: SeoSocialTextField, value: string) => void;
  onChangeTwitterCard: (value: TwitterCard) => void;
}

export function SeoPanelSocialTab({
  active,
  locale,
  ogTitle,
  ogImage,
  ogDescription,
  twitterCard,
  twitterImage,
  twitterTitle,
  twitterDescription,
  socialImage,
  socialTitle,
  socialDescription,
  onChangeTextField,
  onChangeTwitterCard,
}: SeoPanelSocialTabProps) {
  const copy = getSeoPanelSocialCopy(locale);
  return (
    <section className={styles.section} data-active={active ? 'true' : 'false'}>
      <h3 className={styles.sectionTitle}>{copy.title}</h3>
      <div className={styles.twoColumn}>
        <div className={styles.field}>
          <label className={styles.label} htmlFor="builder-seo-og-title">{copy.ogTitle}</label>
          <input
            id="builder-seo-og-title"
            type="text"
            value={ogTitle}
            placeholder={copy.useSeoTitle}
            className={styles.input}
            onChange={(event) => onChangeTextField('ogTitle', event.target.value)}
          />
        </div>
        <div className={styles.field}>
          <label className={styles.label} htmlFor="builder-seo-og-image">{copy.ogImage}</label>
          <input
            id="builder-seo-og-image"
            type="url"
            value={ogImage}
            placeholder={copy.ogImagePlaceholder}
            className={styles.input}
            onChange={(event) => onChangeTextField('ogImage', event.target.value)}
          />
        </div>
      </div>
      <div className={styles.field}>
        <label className={styles.label} htmlFor="builder-seo-og-description">{copy.ogDescription}</label>
        <textarea
          id="builder-seo-og-description"
          value={ogDescription}
          placeholder={copy.useMetaDescription}
          className={`${styles.input} ${styles.textarea}`}
          onChange={(event) => onChangeTextField('ogDescription', event.target.value)}
        />
      </div>

      <div className={styles.twoColumn}>
        <div className={styles.field}>
          <label className={styles.label} htmlFor="builder-seo-twitter-card">{copy.twitterCard}</label>
          <select
            id="builder-seo-twitter-card"
            value={twitterCard}
            className={styles.input}
            onChange={(event) => onChangeTwitterCard(event.target.value as TwitterCard)}
          >
            <option value="summary_large_image">summary_large_image</option>
            <option value="summary">summary</option>
          </select>
        </div>
        <div className={styles.field}>
          <label className={styles.label} htmlFor="builder-seo-twitter-image">{copy.twitterImage}</label>
          <input
            id="builder-seo-twitter-image"
            type="url"
            value={twitterImage}
            placeholder={copy.useOgImage}
            className={styles.input}
            onChange={(event) => onChangeTextField('twitterImage', event.target.value)}
          />
        </div>
      </div>
      <div className={styles.twoColumn}>
        <div className={styles.field}>
          <label className={styles.label} htmlFor="builder-seo-twitter-title">{copy.twitterTitle}</label>
          <input
            id="builder-seo-twitter-title"
            type="text"
            value={twitterTitle}
            placeholder={copy.useOgSeoTitle}
            className={styles.input}
            onChange={(event) => onChangeTextField('twitterTitle', event.target.value)}
          />
        </div>
        <div className={styles.field}>
          <label className={styles.label} htmlFor="builder-seo-twitter-description">{copy.twitterDescription}</label>
          <input
            id="builder-seo-twitter-description"
            type="text"
            value={twitterDescription}
            placeholder={copy.useOgMetaDescription}
            className={styles.input}
            onChange={(event) => onChangeTextField('twitterDescription', event.target.value)}
          />
        </div>
      </div>

      <h4 className={styles.previewHeading}>{copy.preview}</h4>
      <div className={styles.previewCard}>
        <div className={styles.socialPreviewGrid}>
          <div className={styles.socialImageFrame}>
            {socialImage ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={socialImage} alt="" className={styles.socialImage} />
            ) : (
              copy.noImage
            )}
          </div>
          <div className={styles.socialPreviewCopy}>
            <div className={styles.socialPreviewTitle}>{socialTitle}</div>
            <div className={styles.helpText}>{socialDescription}</div>
          </div>
        </div>
      </div>
    </section>
  );
}

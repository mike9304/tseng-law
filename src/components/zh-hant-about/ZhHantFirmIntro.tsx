import Image from 'next/image';
import { firmIntroductionContent } from '@/data/firm-introduction';
import styles from './ZhHantAbout.module.css';

/**
 * zh-hant about: the firm introduction as a short history. Same text, logo, source link and
 * builder surface keys as FirmIntroductionSection; the year beside a paragraph is read from
 * that paragraph's own text (e.g. 「於2017年」), never added.
 */
export default function ZhHantFirmIntro() {
  const content = firmIntroductionContent['zh-hant'];
  return (
    <section id="firm" className={`section firm-intro-section ${styles.firm}`} data-tone="light">
      <div className={`container ${styles.firmGrid}`}>
        <div className={styles.firmAside}>
          <div className={styles.firmLogo}>
            <Image src={content.logo} alt={content.logoAlt} width={508} height={80} data-builder-surface-key="logo" />
          </div>
          <h2 className={styles.firmTitle} data-builder-surface-key="headline">{content.title}</h2>
          <p className={styles.firmSubtitle} data-builder-surface-key="subtitle">{content.subtitle}</p>
          <p className={styles.firmSource}>
            <a href={content.sourceUrl} target="_blank" rel="noopener noreferrer" data-builder-surface-key="source-link">
              {content.sourceLabel}
            </a>
          </p>
        </div>
        <ol className={styles.timeline}>
          {content.paragraphs.map((paragraph, index) => {
            const year = paragraph.match(/(\d{4})年/)?.[1];
            return (
              <li key={paragraph} className={`${styles.entry} ${index === 0 ? styles.entryLead : ''}`}>
                <span className={styles.entryYear} aria-hidden={year ? undefined : true}>{year ?? ''}</span>
                <p>{paragraph}</p>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}

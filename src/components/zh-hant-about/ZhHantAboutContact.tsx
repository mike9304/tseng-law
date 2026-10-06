import Link from 'next/link';
import { siteContent } from '@/data/site-content';
import ZhHantMonoIcon from '@/components/zh-hant-icons/ZhHantMonoIcon';
import {
  getConsultationCtaLabel,
  getConsultationPublicEmail,
  getConsultationPublicMailto,
} from '@/lib/consultation/public-contact';
import type { AppleDesignLocale } from '@/lib/apple-design-locales';
import styles from './ZhHantAbout.module.css';

/**
 * zh-hant about: a compact contact band (email and office addresses) in place of the full
 * contact blocks, which live on /zh-hant/contact with inquiry types and office details.
 * Laid out as the home's closing call: centered title, white pill + outlined email pill, offices below.
 * ko shares it since 2026-10-06; its contact-page link reads 연락처 (the header utility label).
 */
export default function ZhHantAboutContact({ locale = 'zh-hant' }: { locale?: AppleDesignLocale } = {}) {
  const { contact } = siteContent[locale];
  const mailto = getConsultationPublicMailto(locale);
  return (
    <section id="about-contact" className={styles.contact} aria-labelledby="about-contact-title">
      <div className={`container ${styles.contactGrid}`}>
        <div className={styles.contactCopy}>
          <p className={styles.contactLabel}>{contact.label}</p>
          <h2 id="about-contact-title" className={styles.contactTitle}>{contact.title}</h2>
          <p className={styles.contactLede}>{contact.description}</p>
          <div className={styles.contactActions}>
            <a href={mailto} className="button" aria-label={`${contact.cta.label} — ${getConsultationCtaLabel(locale)}`}>{contact.cta.label}</a>
            <a href={mailto} className={styles.contactEmail}>{getConsultationPublicEmail()}</a>
          </div>
          <p className={styles.contactMoreWrap}>
            <Link href={`/${locale}/contact`} className={styles.contactMore}>{locale === 'ko' ? '연락처' : '聯絡方式'}<ZhHantMonoIcon name="chevron-right" size={14} strokePx={1.75} /></Link>
          </p>
        </div>
        <div className={styles.offices}>
          <p className={styles.officesLabel}>{contact.locationsLabel}</p>
          <ul className={styles.officeList}>
            {contact.locations.map((office) => (
              <li key={office.title}>
                <span className={styles.officeName}>{office.title}</span>
                <span className={styles.officeAddress}>{office.details[0]}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

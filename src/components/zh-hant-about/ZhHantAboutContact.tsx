import Link from 'next/link';
import { siteContent } from '@/data/site-content';
import ZhHantMonoIcon from '@/components/zh-hant-icons/ZhHantMonoIcon';
import {
  getConsultationCtaLabel,
  getConsultationPublicEmail,
  getConsultationPublicMailto,
} from '@/lib/consultation/public-contact';
import styles from './ZhHantAbout.module.css';

/**
 * zh-hant about: a compact contact band (email and office addresses) in place of the full
 * contact blocks, which live on /zh-hant/contact with inquiry types and office details.
 * Laid out as the home's closing call: centered title, white pill + outlined email pill, offices below.
 */
export default function ZhHantAboutContact() {
  const { contact } = siteContent['zh-hant'];
  const mailto = getConsultationPublicMailto('zh-hant');
  return (
    <section id="about-contact" className={styles.contact} aria-labelledby="about-contact-title">
      <div className={`container ${styles.contactGrid}`}>
        <div className={styles.contactCopy}>
          <p className={styles.contactLabel}>{contact.label}</p>
          <h2 id="about-contact-title" className={styles.contactTitle}>{contact.title}</h2>
          <p className={styles.contactLede}>{contact.description}</p>
          <div className={styles.contactActions}>
            <a href={mailto} className="button" aria-label={`${contact.cta.label} — ${getConsultationCtaLabel('zh-hant')}`}>{contact.cta.label}</a>
            <a href={mailto} className={styles.contactEmail}>{getConsultationPublicEmail()}</a>
          </div>
          <p className={styles.contactMoreWrap}>
            <Link href="/zh-hant/contact" className={styles.contactMore}>聯絡方式<ZhHantMonoIcon name="chevron-right" size={14} strokePx={1.75} /></Link>
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

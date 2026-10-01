import type { ReactNode } from 'react';
import { siteContent } from '@/data/site-content';
import {
  getConsultationCtaLabel,
  getConsultationPublicEmail,
  getConsultationPublicMailto,
} from '@/lib/consultation/public-contact';
import styles from './ZhHantFaq.module.css';

/**
 * zh-hant FAQ page shell (son7-87 lane / Opus 5.5, Apple pass 2026-10-01): scopes the light header and
 * the explorer (search + categories beside the questions, on a gray band), and closes the page like the
 * home's last call — the homeContactCta copy, the email action and the public address.
 */
export default function ZhHantFaqShell({ children }: { children: ReactNode }) {
  const { homeContactCta, contact } = siteContent['zh-hant'];
  const mailto = getConsultationPublicMailto('zh-hant');
  return (
    <div className={styles.root} id="zh-hant-faq" data-zh-hant-design="faq">
      {children}
      <section className={styles.band} aria-labelledby="zh-hant-faq-contact">
        <div className={`container ${styles.bandInner}`}>
          <h2 id="zh-hant-faq-contact" className={styles.bandTitle}>{homeContactCta.title}</h2>
          <p className={styles.bandText}>{homeContactCta.description}</p>
          <div className={styles.bandActions}>
            <a href={mailto} className={`button ${styles.bandButton}`} aria-label={`${contact.cta.label} — ${getConsultationCtaLabel('zh-hant')}`}>
              {contact.cta.label}
            </a>
            <p className={styles.bandEmail}><a href={mailto}>{getConsultationPublicEmail()}</a></p>
          </div>
        </div>
      </section>
    </div>
  );
}

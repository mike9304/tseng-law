import type { ReactNode } from 'react';
import { siteContent } from '@/data/site-content';
import {
  getConsultationCtaLabel,
  getConsultationPublicEmail,
  getConsultationPublicMailto,
} from '@/lib/consultation/public-contact';
import styles from './ZhHantFaq.module.css';

/**
 * zh-hant FAQ page shell, second pass (son7-87 / Opus 5.5, 2026-10-01): scopes the green header
 * and the two-column explorer layout, and closes the page with the home contact band copy
 * (homeContactCta) and the public email.
 */
export default function ZhHantFaqShell({ children }: { children: ReactNode }) {
  const { homeContactCta, contact } = siteContent['zh-hant'];
  const mailto = getConsultationPublicMailto('zh-hant');
  return (
    <div className={styles.root} id="zh-hant-faq" data-zh-hant-design="faq">
      {children}
      <section className={styles.band} aria-labelledby="zh-hant-faq-contact">
        <div className={`container ${styles.bandInner}`}>
          <div>
            <h2 id="zh-hant-faq-contact" className={styles.bandTitle}>{homeContactCta.title}</h2>
            <p className={styles.bandText}>{homeContactCta.description}</p>
            <p className={styles.bandEmail}><a href={mailto}>{getConsultationPublicEmail()}</a></p>
          </div>
          <a href={mailto} className="button" aria-label={`${contact.cta.label} — ${getConsultationCtaLabel('zh-hant')}`}>
            {contact.cta.label}
          </a>
        </div>
      </section>
    </div>
  );
}

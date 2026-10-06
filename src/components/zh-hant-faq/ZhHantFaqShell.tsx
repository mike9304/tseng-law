import type { ReactNode } from 'react';
import { siteContent } from '@/data/site-content';
import {
  getConsultationCtaLabel,
  getConsultationPublicEmail,
  getConsultationPublicMailto,
} from '@/lib/consultation/public-contact';
import ZhHantSnapRowFocus from '@/components/zh-hant-home/ZhHantSnapRowFocus';
import { appleDesignRootProps, type AppleDesignLocale } from '@/lib/apple-design-locales';
import styles from './ZhHantFaq.module.css';

/**
 * zh-hant FAQ page shell (son7-87 lane / Opus 5.5, Apple pass 2026-10-01): scopes the light header and
 * the explorer (search + categories beside the questions, on a gray band), and closes the page like the
 * home's last call — the homeContactCta copy, the email action and the public address.
 * ko shares it since 2026-10-06 (`locale="ko"`: the ko homeContactCta copy and CTA label).
 */
export default function ZhHantFaqShell({ children, locale = 'zh-hant' }: { children: ReactNode; locale?: AppleDesignLocale }) {
  const { homeContactCta, contact } = siteContent[locale];
  const mailto = getConsultationPublicMailto(locale);
  const root = appleDesignRootProps(locale, 'faq');
  return (
    <div className={styles.root} {...root}>
      {children}
      <ZhHantSnapRowFocus rootSelector={`#${root.id}`} />
      <section className={styles.band} aria-labelledby={`${root.id}-contact`}>
        <div className={`container ${styles.bandInner}`}>
          <h2 id={`${root.id}-contact`} className={styles.bandTitle}>{homeContactCta.title}</h2>
          <p className={styles.bandText}>{homeContactCta.description}</p>
          <div className={styles.bandActions}>
            <a href={mailto} className={`button ${styles.bandButton}`} aria-label={`${contact.cta.label} — ${getConsultationCtaLabel(locale)}`}>
              {contact.cta.label}
            </a>
            <p className={styles.bandEmail}><a href={mailto}>{getConsultationPublicEmail()}</a></p>
          </div>
        </div>
      </section>
    </div>
  );
}

import type { ReactNode } from 'react';
import { siteContent } from '@/data/site-content';
import {
  getConsultationCtaLabel,
  getConsultationPublicEmail,
  getConsultationPublicMailto,
} from '@/lib/consultation/public-contact';
import styles from './EnPage.module.css';

/**
 * en design wrapper (Opus 5.5 en lane, 2026-10-01). Every English page in the redesign renders
 * inside this root: `id="en-<page>"` scopes the CSS module, `data-en-design` lets the shared
 * builder sizing rule recognise the page. Other locales never render it.
 */
export default function EnPageShell({ page, children }: { page: string; children: ReactNode }) {
  return (
    <div className={styles.root} id={`en-${page}`} data-en-design={page}>
      {children}
    </div>
  );
}

export type EnGlanceItem = { term: string; value: ReactNode; note?: string };

/** "At a glance" fact sheet for the page header slot. Values restate the page's own data. */
export function EnGlance({
  title = 'At a glance',
  items,
  actions,
}: {
  title?: string;
  items: readonly EnGlanceItem[];
  actions?: ReactNode;
}) {
  return (
    <aside className={styles.glance} aria-label={title}>
      <p className={styles.glanceTitle}>{title}</p>
      <dl className={styles.glanceList}>
        {items.map((item) => (
          <div key={item.term} className={styles.glanceRow}>
            <dt>{item.term}</dt>
            <dd>
              {item.value}
              {item.note ? <small>{item.note}</small> : null}
            </dd>
          </div>
        ))}
      </dl>
      {actions ? <div className={styles.glanceActions}>{actions}</div> : null}
    </aside>
  );
}

/** In-page jump links. */
export function EnJumpNav({ label = 'On this page', items }: { label?: string; items: readonly { href: string; label: string }[] }) {
  return (
    <nav aria-label={label}>
      <ul className={styles.jumps}>
        {items.map((item) => (
          <li key={item.href}><a href={item.href}>{item.label} <span aria-hidden>↓</span></a></li>
        ))}
      </ul>
    </nav>
  );
}

/** Primary email CTA in the en look (same mailto and accessible name pattern as the rest of the site). */
export function EnEmailButton({ label, variant = 'primary' }: { label: string; variant?: 'primary' | 'secondary' }) {
  return (
    <a
      href={getConsultationPublicMailto('en')}
      className={variant === 'primary' ? styles.primary : styles.secondary}
      aria-label={`${label} — ${getConsultationCtaLabel('en')}`}
    >
      {label} <span aria-hidden>→</span>
    </a>
  );
}

export function EnLinkButton({ href, label, variant = 'secondary' }: { href: string; label: string; variant?: 'primary' | 'secondary' }) {
  return (
    <a href={href} className={variant === 'primary' ? styles.primary : styles.secondary}>
      {label} <span aria-hidden>→</span>
    </a>
  );
}

/**
 * Closing band used at the end of en pages. Title and text are the home contact band copy
 * (siteContent.en.homeContactCta); the button label is the site's contact CTA.
 */
export function EnClosingBand({ id = 'en-closing', secondary }: { id?: string; secondary?: ReactNode }) {
  const { homeContactCta, contact } = siteContent.en;
  const headingId = `${id}-title`;
  return (
    <section className={styles.band} aria-labelledby={headingId} data-en-closing>
      <div className={`container ${styles.bandInner}`}>
        <div>
          <h2 id={headingId} className={styles.bandTitle}>{homeContactCta.title}</h2>
          <p className={styles.bandText}>{homeContactCta.description}</p>
          <p className={styles.bandEmail}><a href={getConsultationPublicMailto('en')}>{getConsultationPublicEmail()}</a></p>
        </div>
        <div className={styles.bandActions}>
          <EnEmailButton label={contact.cta.label} />
          {secondary}
        </div>
      </div>
    </section>
  );
}

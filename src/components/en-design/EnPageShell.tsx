import type { ReactNode } from 'react';
import { siteContent } from '@/data/site-content';
import {
  getConsultationCtaLabel,
  getConsultationPublicEmail,
  getConsultationPublicMailto,
} from '@/lib/consultation/public-contact';
import { EnChevron } from './EnChevron';
import styles from './EnPage.module.css';
import v2 from './EnPagesV2.module.css';

/**
 * en design wrapper (Opus 5.5 en lane, 2026-10-01; Clear Night inner pages 2026-10-03). Every English inner
 * page renders inside this root: `id="en-<page>"` scopes the CSS modules, `data-en-design` lets the shared
 * builder sizing rule recognise the page. Other locales never render it.
 */
export default function EnPageShell({ page, children }: { page: string; children: ReactNode }) {
  return (
    <div className={`${styles.root} ${v2.v2}`} id={`en-${page}`} data-en-design={page}>
      {children}
    </div>
  );
}

/** Paper (reading) tone for a part of an en page: ink on white, shared tokens back on light values. */
export function EnPaper({ children, className, id }: { children: ReactNode; className?: string; id?: string }) {
  return (
    <div className={`${v2.paper}${className ? ` ${className}` : ''}`} id={id} data-en-tone="paper">
      {children}
    </div>
  );
}

export type EnGlanceItem = { term: string; value: ReactNode; note?: string };

/** Credits row (component 14) for the title card: the page's own terms and values, no box, no rules. */
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

/** In-page jump links (title card). The down arrow is Inter's own U+2193. */
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

/** Primary email CTA (component 1): blue pill, same mailto and accessible name pattern as the rest of the site. */
export function EnEmailButton({ label, variant = 'primary' }: { label: string; variant?: 'primary' | 'secondary' }) {
  return (
    <a
      href={getConsultationPublicMailto('en')}
      className={variant === 'primary' ? v2.pill : v2.textLink}
      aria-label={`${label} — ${getConsultationCtaLabel('en')}`}
    >
      {label}
      <EnChevron />
    </a>
  );
}

/** Link in the en look: blue pill (primary) or white text link with a chevron (secondary). */
export function EnLinkButton({ href, label, variant = 'secondary' }: { href: string; label: string; variant?: 'primary' | 'secondary' }) {
  return (
    <a href={href} className={variant === 'primary' ? v2.pill : v2.textLink}>
      {label}
      <EnChevron />
    </a>
  );
}

/** Text link (component 2) with a chevron, for en-owned markup. */
export function EnTextLink({ href, children, className }: { href: string; children: ReactNode; className?: string }) {
  return (
    <a href={href} className={`${v2.textLink}${className ? ` ${className}` : ''}`}>
      {children}
      <EnChevron />
    </a>
  );
}

const BANDS = {
  drops: { desktop: '/images/editorial/en-band-drops.webp', mobile: '/images/editorial/en-band-drops-mobile.webp' },
  rooftops: { desktop: '/images/editorial/en-band-rooftops.webp', mobile: '/images/editorial/en-band-rooftops-mobile.webp' },
  clear: { desktop: '/images/editorial/en-band-clear.webp', mobile: '/images/editorial/en-band-clear-mobile.webp' },
} as const;

/**
 * Inner band (component 8g, overview pages only): B1 drops, B2 rooftops or B3 the clear street, full bleed
 * under the title card. Decorative; each band appears once per page.
 */
export function EnBand({ name }: { name: keyof typeof BANDS }) {
  const band = BANDS[name];
  return (
    <div className={v2.band} data-en-band={name}>
      <picture className={v2.bandPicture}>
        <source media="(max-width: 767px)" srcSet={band.mobile} type="image/webp" width={900} height={520} />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={band.desktop} width={1920} height={640} alt="" decoding="async" className={v2.bandImg} />
      </picture>
    </div>
  );
}

/**
 * Closing card (12.1) at the end of en pages: night, no image. Title and text are the home contact band copy
 * (siteContent.en.homeContactCta); the button label is the site's contact CTA.
 */
export function EnClosingBand({ id = 'en-closing', secondary }: { id?: string; secondary?: ReactNode }) {
  const { homeContactCta, contact } = siteContent.en;
  const headingId = `${id}-title`;
  return (
    <section className={v2.closing} aria-labelledby={headingId} data-en-closing>
      <div className={`container ${v2.closingInner}`}>
        <h2 id={headingId} className={v2.closingTitle} data-en-rise>{homeContactCta.title}</h2>
        <p className={v2.closingText}>{homeContactCta.description}</p>
        <p className={v2.closingEmail}><a href={getConsultationPublicMailto('en')}>{getConsultationPublicEmail()}</a></p>
        <div className={v2.closingActions}>
          <EnEmailButton label={contact.cta.label} />
          {secondary}
        </div>
      </div>
    </section>
  );
}

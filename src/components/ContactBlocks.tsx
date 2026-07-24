import Link from 'next/link';
import type { Locale } from '@/lib/locales';
import { siteContent } from '@/data/site-content';
import { contactPageContent } from '@/data/contact-page-content';
import SectionLabel from '@/components/SectionLabel';
import OrnamentDivider from '@/components/OrnamentDivider';
import Reveal from '@/components/Reveal';

export default function ContactBlocks({
  locale,
  showMainHeader = true
}: {
  locale: Locale;
  showMainHeader?: boolean;
}) {
  const { contact } = siteContent[locale];
  const channels = contactPageContent[locale];
  // `.reveal-stagger` children stay at opacity 0 until a `.reveal.is-visible`
  // ancestor exists, so the section must reveal itself — callers (legacy
  // contact/about bodies) don't wrap it the way home-legacy does.
  return (
    <Reveal>
    <section className="section">
      <div className="container">
        {showMainHeader ? (
          <>
            <SectionLabel data-builder-surface-key="section-label">{contact.label}</SectionLabel>
            <h2 className="section-title" data-builder-surface-key="headline">
              {contact.title}
            </h2>
            <p className="section-lede" data-builder-surface-key="description">
              {contact.description}
            </p>
            <OrnamentDivider />
          </>
        ) : null}
        <div className="section-label" data-builder-surface-key="inquiries-label">
          {contact.inquiriesLabel}
        </div>
        <div className="grid-bento contact-grid reveal-stagger" style={{ marginBottom: '1.5rem' }}>
          <div className="card">
            <h3 className="card-title">{channels.direct.email.label}</h3>
            <p className="card-copy">
              <a className="link-underline" href={channels.direct.email.href}>
                {channels.direct.email.value}
              </a>
            </p>
          </div>
          <div className="card">
            <h3 className="card-title">{channels.direct.phone.label}</h3>
            <p className="card-copy">
              <a className="link-underline phone-number" href={channels.direct.phone.href}>
                {channels.direct.phone.value}
              </a>
            </p>
          </div>
        </div>
        <div className="grid-bento contact-grid reveal-stagger">
          {contact.inquiries.map((block) => (
            <div key={block.title} className="card">
              <h3 className="card-title">{block.title}</h3>
              <ul className="contact-list">
                {block.details.map((detail) => (
                  <li key={detail}>{detail}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="section-label contact-label-spaced" data-builder-surface-key="locations-label">
          {contact.locationsLabel}
        </div>
        <div className="grid-bento contact-grid reveal-stagger">
          {contact.locations.map((block) => (
            <div key={block.title} className="card">
              <h3 className="card-title">{block.title}</h3>
              <ul className="contact-list">
                {block.details.map((detail) => (
                  <li key={detail}>{detail}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <Link className="button secondary" href={contact.cta.href} data-builder-surface-key="cta-link">
          {contact.cta.label}
        </Link>
      </div>
    </section>
    </Reveal>
  );
}

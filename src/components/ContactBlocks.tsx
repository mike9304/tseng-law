import Link from 'next/link';
import type { Locale } from '@/lib/locales';
import { siteContent } from '@/data/site-content';
import SectionLabel from '@/components/SectionLabel';
import OrnamentDivider from '@/components/OrnamentDivider';

export default function ContactBlocks({
  locale,
  showMainHeader = true
}: {
  locale: Locale;
  showMainHeader?: boolean;
}) {
  const { contact } = siteContent[locale];
  return (
    <section className="section">
      <div className="container">
        {showMainHeader ? (
          <>
            <SectionLabel>{contact.label}</SectionLabel>
            <h2 className="section-title">{contact.title}</h2>
            <p className="section-lede">{contact.description}</p>
            <OrnamentDivider />
          </>
        ) : null}
        <div className="section-label">{contact.inquiriesLabel}</div>
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
        <div className="section-label contact-label-spaced">
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
        <Link className="button secondary" href={contact.cta.href}>
          {contact.cta.label}
        </Link>
      </div>
    </section>
  );
}

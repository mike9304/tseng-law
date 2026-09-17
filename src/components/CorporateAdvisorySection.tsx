import Link from 'next/link';
import type { SiteLocale } from '@/lib/locales';
import {
  CORPORATE_ADVISORY_ANCHOR,
  getCorporateAdvisory,
} from '@/data/corporate-advisory';
import { getConsultationPublicMailto } from '@/lib/consultation/public-contact';

export default function CorporateAdvisorySection({ locale }: { locale: SiteLocale }) {
  const content = getCorporateAdvisory(locale);
  if (!content) {
    return null;
  }

  return (
    <section
      className="section section--light"
      id={CORPORATE_ADVISORY_ANCHOR}
      style={{ scrollMarginTop: '6rem' }}
    >
      <div className="container">
        <article className="intent-panel">
          <h2 className="profile-card-title">{content.headline}</h2>
          <p>{content.intro}</p>
          <p>{content.body}</p>
          <ul className="intent-article-list">
            {content.items.map((item) => (
              <li key={item.title}>
                <strong>{item.title}</strong>
                {' — '}
                {item.body}
              </li>
            ))}
          </ul>
          <p>{content.relatedHeading}</p>
          <ul className="intent-article-list">
            {content.relatedLinks.map((item) => (
              <li key={item.path}>
                <Link href={`/${locale}/${item.path}`} className="link-underline">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
          <p>{content.initialEmail}</p>
          <p>{content.languages}</p>
          <div className="contact-email-actions">
            <div className="contact-email-actions__row">
              <a href={getConsultationPublicMailto(locale)} className="button">
                {content.ctaLabel}
              </a>
            </div>
            <p className="contact-email-actions__note">{content.sensitiveNote}</p>
          </div>
        </article>
      </div>
    </section>
  );
}

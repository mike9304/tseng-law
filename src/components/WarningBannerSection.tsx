import Link from 'next/link';
import type { Locale } from '@/lib/locales';
import { siteContent } from '@/data/site-content';

export default function WarningBannerSection({ locale }: { locale: Locale }) {
  const { warning } = siteContent[locale];

  return (
    <section className="section" id="contact" data-tone="light">
      <div className="container">
        <div className="warning-banner" role="note" aria-label={warning.title}>
          <div>
            <div className="warning-label">{warning.label}</div>
            <h2 className="warning-title">{warning.title}</h2>
            <p className="warning-message">{warning.message}</p>
          </div>
          <Link className="button ghost" href={warning.cta.href}>
            {warning.cta.label}
          </Link>
        </div>
      </div>
    </section>
  );
}

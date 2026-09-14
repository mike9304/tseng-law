import Link from 'next/link';
import type { SiteLocale } from '@/lib/locales';

export const EN_ACQUISITION_GUIDE_HEADING = 'Guides for overseas clients';

export const EN_ACQUISITION_GUIDE_LINKS = [
  { href: '/en/taiwan-lawyer', label: 'Taiwan lawyer' },
  { href: '/en/taiwan-company-setup-lawyer', label: 'Taiwan company setup lawyer' },
  { href: '/en/taiwan-litigation-lawyer', label: 'Taiwan litigation lawyer' },
] as const;

export default function EnAcquisitionGuideLinks({ locale }: { locale: SiteLocale }) {
  if (locale !== 'en') {
    return null;
  }

  return (
    <section className="section section--light" aria-label={EN_ACQUISITION_GUIDE_HEADING}>
      <div className="container">
        <div className="list-panel">
          <h2 className="panel-title">{EN_ACQUISITION_GUIDE_HEADING}</h2>
          <ul className="blog-related-list">
            {EN_ACQUISITION_GUIDE_LINKS.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="blog-related-link">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

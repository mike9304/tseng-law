import Link from 'next/link';
import { seaBusinessContent } from '@/data/sea-business-guidance';
import { isSeaBusinessLocale, SEA_BUSINESS_PAGES } from '@/lib/sea-business-routes';

export default function SeaBusinessLinks({ locale }: { locale: string }) {
  if (!isSeaBusinessLocale(locale)) return null;
  const copy = seaBusinessContent[locale];
  return <section className="section" data-sea-business-links={locale}>
    <div className="container">
      <h2>{copy.heading}</h2>
      <nav aria-label={copy.heading}><ul className="contact-list">
        {SEA_BUSINESS_PAGES.map(key => <li key={key}><Link href={`/${locale}/${key}`}>{copy[key].title}</Link></li>)}
      </ul></nav>
    </div>
  </section>;
}

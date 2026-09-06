import Link from 'next/link';
import type { SiteLocale } from '@/lib/locales';
import { getCorporateAdvisory, getCorporateAdvisoryHref } from '@/data/corporate-advisory';

export default function CorporateAdvisoryLink({ locale }: { locale: SiteLocale }) {
  const content = getCorporateAdvisory(locale);
  const href = getCorporateAdvisoryHref(locale);
  if (!content || !href) {
    return null;
  }

  return (
    <p>
      <Link href={href} className="link-underline">
        {content.headline}
      </Link>
      {' — '}
      {content.summary}
    </p>
  );
}

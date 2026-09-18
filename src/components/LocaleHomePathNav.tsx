'use client';

import Link from 'next/link';
import {
  CORE_HOME_PATHS,
  GUIDANCE_HOME_PATHS,
  ML_INTERNATIONAL_REVIEW,
} from '@/data/multilingual-international-v2';
import { isGuidanceLocale4, type PublicLocale8 } from '@/lib/public-guidance';
import { isSiteLocale } from '@/lib/locales';

export default function LocaleHomePathNav({
  locale,
  tone,
}: {
  locale: PublicLocale8;
  tone: 'dark' | 'light';
}) {
  if (isGuidanceLocale4(locale)) {
    const paths = GUIDANCE_HOME_PATHS[locale];
    return (
      <nav
        className={`en-home-paths locale-home-paths en-home-paths--${tone}`}
        aria-label={paths.ariaLabel}
        data-ml-international-review={ML_INTERNATIONAL_REVIEW.review_status}
      >
        <Link
          href={paths.setup.href}
          className="en-home-path-button"
          data-ml-path="setup-info"
        >
          {paths.setup.label}
        </Link>
        <Link
          href={paths.legal.href}
          className="en-home-path-button"
          data-ml-path="legal-info"
        >
          {paths.legal.label}
        </Link>
      </nav>
    );
  }

  if (!isSiteLocale(locale)) return null;

  const paths = CORE_HOME_PATHS[locale];
  return (
    <nav
      className={`en-home-paths locale-home-paths en-home-paths--${tone}`}
      aria-label={paths.ariaLabel}
      data-ml-international-review={ML_INTERNATIONAL_REVIEW.review_status}
    >
      <Link
        href={paths.companySetup.href}
        className="en-home-path-button"
        data-en-path={locale === 'en' ? 'company-setup' : undefined}
        data-ml-path="company-setup"
      >
        {paths.companySetup.label}
      </Link>
      <Link
        href={paths.dispute.href}
        className="en-home-path-button"
        data-en-path={locale === 'en' ? 'dispute' : undefined}
        data-ml-path="dispute"
      >
        {paths.dispute.label}
      </Link>
      <Link
        href={paths.guide.href}
        className="en-home-path-guide"
        data-en-path={locale === 'en' ? 'company-guide' : undefined}
        data-ml-path="company-guide"
      >
        {paths.guide.label}
      </Link>
    </nav>
  );
}

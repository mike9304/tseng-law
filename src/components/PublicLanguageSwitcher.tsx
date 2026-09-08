'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { internationalInquiryCopy } from '@/data/international-inquiry-copy';
import {
  PUBLIC_LANGUAGE_AUTONYMS,
  PUBLIC_LOCALES_8,
  resolvePublicLanguageSwitchTarget,
  visiblePublicPathname,
  type PublicLocale8,
} from '@/lib/public-guidance';

export default function PublicLanguageSwitcher({
  locale,
  className,
}: {
  locale: PublicLocale8;
  className?: string;
}) {
  const pathname = visiblePublicPathname(usePathname() ?? `/${locale}`);
  const rootClassName = ['public-language-switcher', className].filter(Boolean).join(' ');

  return (
    <div className={rootClassName}>
      {PUBLIC_LOCALES_8.map((target) => {
        const result = resolvePublicLanguageSwitchTarget(pathname, target);
        const autonym = PUBLIC_LANGUAGE_AUTONYMS[target];
        const isCurrent = target === locale;

        if (result.status === 'unavailable') {
          const notice = (
            internationalInquiryCopy[locale] as typeof internationalInquiryCopy[PublicLocale8] & {
              unavailableLanguageNotice: string;
            }
          ).unavailableLanguageNotice.split('{language}').join(autonym);
          return (
            <span
              key={target}
              aria-disabled="true"
              title={notice}
              aria-description={notice}
              aria-label={`${autonym}. ${notice}`}
            >
              {autonym}
            </span>
          );
        }

        return (
          <Link
            key={target}
            href={result.href}
            aria-current={isCurrent ? 'page' : undefined}
            aria-label={autonym}
            title={autonym}
          >
            {autonym}
          </Link>
        );
      })}
    </div>
  );
}

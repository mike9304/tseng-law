'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { internationalInquiryCopy } from '@/data/international-inquiry-copy';
import {
  PUBLIC_LANGUAGE_AUTONYMS,
  PUBLIC_LOCALES_8,
  isPublicLanguageSwitchTargetListed,
  resolvePublicLanguageSwitchTarget,
  visiblePublicPathname,
  type PublicLanguageSwitchOptions,
  type PublicLocale8,
} from '@/lib/public-guidance';
import { usePublicColumnLanguageLinks } from '@/components/PublicColumnLanguageLinksContext';

export default function PublicLanguageSwitcher({
  locale,
  className,
}: {
  locale: PublicLocale8;
  className?: string;
}) {
  const pathname = visiblePublicPathname(usePathname() ?? `/${locale}`);
  const columnLinksByLocale = usePublicColumnLanguageLinks(pathname);
  const switchOptions: PublicLanguageSwitchOptions | undefined = columnLinksByLocale
    ? { columnLinksByLocale }
    : undefined;
  const rootClassName = ['public-language-switcher', className].filter(Boolean).join(' ');

  return (
    <div className={rootClassName}>
      {PUBLIC_LOCALES_8.filter((target) =>
        isPublicLanguageSwitchTargetListed(pathname, target, switchOptions),
      ).map((target) => {
        const result = resolvePublicLanguageSwitchTarget(pathname, target, switchOptions);
        const autonym = PUBLIC_LANGUAGE_AUTONYMS[target];
        const isCurrent = target === locale;
        // WO-O22 A: no language is disabled. A page missing in the target
        // language links to the nearest existing page instead, and the
        // accessible label says so in this page's language. Column articles
        // list only the languages they are published in.
        const notice = result.fallback === 'exact'
          ? null
          : (
              internationalInquiryCopy[locale] as typeof internationalInquiryCopy[PublicLocale8] & {
                unavailableLanguageNotice: string;
              }
            ).unavailableLanguageNotice.split('{language}').join(autonym);

        return (
          <Link
            key={target}
            href={result.href}
            data-locale-switch-fallback={notice ? result.fallback : undefined}
            aria-current={isCurrent ? 'page' : undefined}
            aria-label={notice ? `${autonym}. ${notice}` : autonym}
            title={notice ?? autonym}
          >
            {autonym}
          </Link>
        );
      })}
    </div>
  );
}

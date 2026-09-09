'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { internationalInquiryCopy } from '@/data/international-inquiry-copy';
import {
  PUBLIC_LANGUAGE_AUTONYMS,
  PUBLIC_LOCALES_8,
  resolvePublicLanguageSwitchTarget,
  visiblePublicPathname,
  type PublicLanguageSwitchOptions,
  type PublicLocale8,
} from '@/lib/public-guidance';
import { usePublicColumnSlugs } from '@/components/PublicColumnSlugsContext';

export default function PublicLanguageSwitcher({
  locale,
  className,
}: {
  locale: PublicLocale8;
  className?: string;
}) {
  const pathname = visiblePublicPathname(usePathname() ?? `/${locale}`);
  const columnSlugsByLocale = usePublicColumnSlugs();
  const switchOptions: PublicLanguageSwitchOptions | undefined = columnSlugsByLocale
    ? { columnSlugsByLocale }
    : undefined;
  const rootClassName = ['public-language-switcher', className].filter(Boolean).join(' ');

  return (
    <div className={rootClassName}>
      {PUBLIC_LOCALES_8.map((target) => {
        const result = resolvePublicLanguageSwitchTarget(pathname, target, switchOptions);
        const autonym = PUBLIC_LANGUAGE_AUTONYMS[target];
        const isCurrent = target === locale;
        // WO-O22 A: no language is ever dropped or disabled. A page missing in
        // the target language links to the nearest existing page instead, and
        // the accessible label says so in this page's language.
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

'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import type { InquiryCopyLocale } from '@/data/international-inquiry-copy';
import { internationalInquiryCopy } from '@/data/international-inquiry-copy';
import { guidanceContent } from '@/data/international-guidance-content';
import { isSiteLocale, type SiteLocale } from '@/lib/locales';
import { buildLocalePath, stripLocaleFromPath } from '@/lib/path-utils';
import {
  PUBLIC_LANGUAGE_AUTONYMS,
  PUBLIC_LOCALES_8,
  isGuidanceLocale4,
  parsePublicLocaleFromPathname,
  resolvePublicLanguageSwitchTarget,
  type PublicLanguageSwitchOptions,
  type PublicLocale8,
} from '@/lib/public-guidance';
import {
  usePublicColumnSlugs,
  type PublicColumnSlugsByLocale,
} from '@/components/PublicColumnSlugsContext';
import { jaLanguageSwitchTarget, restrictedPublicFamilyListPath } from '@/lib/public-route-policy';
import styles from './LocaleFlagSwitcher.module.css';

export const LOCALE_FLAG_OPTIONS: ReadonlyArray<{
  readonly locale: PublicLocale8;
  readonly label: string;
}> = PUBLIC_LOCALES_8.map((locale) => ({
  locale,
  label: PUBLIC_LANGUAGE_AUTONYMS[locale],
}));

const switcherLabels: Record<SiteLocale, string> = {
  ko: '언어 선택',
  ja: '言語選択',
  'zh-hant': '語言選擇',
  en: 'Language selector',
};

function siteLocaleFromPathname(pathname: string): SiteLocale | null {
  const first = pathname.replace(/^\//, '').split('/')[0] ?? '';
  return isSiteLocale(first) ? first : null;
}

function switcherGroupLabel(locale: PublicLocale8): string {
  if (isGuidanceLocale4(locale)) {
    return guidanceContent[locale].languageLabel;
  }
  return switcherLabels[locale];
}

/**
 * WO-O22 A: shown when the selected language does not publish this exact page,
 * so the link lands on the nearest page that does exist. Written in the page's
 * own language and naming the target language, reusing the copy that already
 * ships for all eight locales — no new sentence is invented here.
 */
export function fallbackLanguageNotice(
  locale: PublicLocale8,
  targetLocale: PublicLocale8,
): string {
  const template = internationalInquiryCopy[locale as InquiryCopyLocale].unavailableLanguageNotice;
  return template.split('{language}').join(PUBLIC_LANGUAGE_AUTONYMS[targetLocale]);
}

export function localeFlagHref(
  pathname: string,
  targetLocale: PublicLocale8,
  options?: PublicLanguageSwitchOptions,
): string {
  const switchTarget = resolvePublicLanguageSwitchTarget(pathname, targetLocale, options);

  const currentLocale = parsePublicLocaleFromPathname(pathname);
  if (isGuidanceLocale4(targetLocale)) {
    return switchTarget.href;
  }
  if (isGuidanceLocale4(currentLocale)) {
    return switchTarget.href;
  }

  if ((currentLocale ?? siteLocaleFromPathname(pathname)) === targetLocale) {
    return pathname || `/${targetLocale}`;
  }

  const pathWithoutLocale = stripLocaleFromPath(pathname);
  const familyList = restrictedPublicFamilyListPath(pathWithoutLocale);
  if (familyList) {
    return `/${targetLocale}${familyList}`;
  }

  if (targetLocale === 'ja') {
    return jaLanguageSwitchTarget(pathWithoutLocale);
  }
  return buildLocalePath(pathname, targetLocale);
}

export type LocaleFlagSwitcherProps = {
  locale: PublicLocale8;
  className?: string;
  linkClassName?: string;
  onLocaleSelect?: (targetLocale: PublicLocale8) => void;
};

/**
 * Pure view: takes the resolved pathname and column availability instead of
 * reading them from hooks, so the markup can be exercised directly in unit
 * tests. `LocaleFlagSwitcher` is the hook-reading wrapper the app renders.
 */
export function LocaleFlagSwitcherView({
  locale,
  pathname,
  columnSlugsByLocale,
  className,
  linkClassName,
  onLocaleSelect,
}: LocaleFlagSwitcherProps & {
  pathname: string;
  columnSlugsByLocale?: PublicColumnSlugsByLocale | null;
}) {
  const switchOptions: PublicLanguageSwitchOptions | undefined = columnSlugsByLocale
    ? { columnSlugsByLocale }
    : undefined;
  const rootClassName = ['locale-flag-switcher', styles.root, className].filter(Boolean).join(' ');
  const itemClassName = ['locale-flag-switcher-link', styles.option, linkClassName]
    .filter(Boolean)
    .join(' ');
  const currentAutonym = PUBLIC_LANGUAGE_AUTONYMS[locale] ?? locale;

  return (
    <div className={rootClassName} role="group" aria-label={switcherGroupLabel(locale)}>
      <details className={styles.dropdown}>
        <summary className={styles.summary}>
          <span>{currentAutonym}</span>
        </summary>
        <ul className={styles.menu}>
          {LOCALE_FLAG_OPTIONS.map((option) => {
            const switchTarget = resolvePublicLanguageSwitchTarget(
              pathname,
              option.locale,
              switchOptions,
            );
            const isCurrent = locale === option.locale;
            // WO-O22 A: every locale is always a real link. When the exact page
            // is missing in that language the href degrades to the nearest
            // existing page and the label says so — never a 404, never a
            // dropped option.
            const isFallback = switchTarget.fallback !== 'exact';
            const notice = isFallback ? fallbackLanguageNotice(locale, option.locale) : undefined;

            return (
              <li key={option.locale}>
                <Link
                  href={localeFlagHref(pathname, option.locale, switchOptions)}
                  className={itemClassName}
                  data-locale-switch-fallback={isFallback ? switchTarget.fallback : undefined}
                  aria-current={isCurrent ? 'page' : undefined}
                  aria-label={notice ? `${option.label}. ${notice}` : undefined}
                  title={notice}
                  onClick={() => onLocaleSelect?.(option.locale)}
                >
                  {option.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </details>
    </div>
  );
}

export default function LocaleFlagSwitcher(props: LocaleFlagSwitcherProps) {
  const pathname = usePathname() ?? `/${props.locale}`;
  const columnSlugsByLocale = usePublicColumnSlugs();
  return (
    <LocaleFlagSwitcherView
      {...props}
      pathname={pathname}
      columnSlugsByLocale={columnSlugsByLocale}
    />
  );
}

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
  type PublicLocale8,
} from '@/lib/public-guidance';
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

function unavailableLanguageNotice(locale: PublicLocale8, targetLocale: PublicLocale8): string {
  const template = internationalInquiryCopy[locale as InquiryCopyLocale].unavailableLanguageNotice;
  return template.split('{language}').join(PUBLIC_LANGUAGE_AUTONYMS[targetLocale]);
}

export function localeFlagHref(pathname: string, targetLocale: PublicLocale8): string {
  const switchTarget = resolvePublicLanguageSwitchTarget(pathname, targetLocale);
  if (switchTarget.status === 'unavailable') {
    return '';
  }

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

export default function LocaleFlagSwitcher({
  locale,
  className,
  linkClassName,
  onLocaleSelect,
}: {
  locale: PublicLocale8;
  className?: string;
  linkClassName?: string;
  onLocaleSelect?: (targetLocale: PublicLocale8) => void;
}) {
  const pathname = usePathname() ?? `/${locale}`;
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
            const switchTarget = resolvePublicLanguageSwitchTarget(pathname, option.locale);
            const isCurrent = locale === option.locale;
            if (switchTarget.status === 'unavailable') {
              const notice = unavailableLanguageNotice(locale, option.locale);
              return (
                <li key={option.locale}>
                  <span
                    className={`${itemClassName} ${styles.disabled}`}
                    aria-disabled="true"
                    aria-label={option.label}
                    aria-description={notice}
                  >
                    <span className={styles.optionLabel}>{option.label}</span>
                    <span className={styles.unavailableNotice}>{notice}</span>
                  </span>
                </li>
              );
            }

            return (
              <li key={option.locale}>
                <Link
                  href={localeFlagHref(pathname, option.locale)}
                  className={itemClassName}
                  aria-current={isCurrent ? 'page' : undefined}
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

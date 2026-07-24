'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import type { SiteLocale } from '@/lib/locales';
import { buildLocalePath, stripLocaleFromPath } from '@/lib/path-utils';
import { jaLanguageSwitchTarget } from '@/lib/public-route-policy';

export const LOCALE_FLAG_OPTIONS = [
  {
    locale: 'ko',
    code: 'KR',
    flag: '🇰🇷',
    label: '한국어 (대한민국)',
  },
  {
    locale: 'ja',
    code: 'JP',
    flag: '🇯🇵',
    label: '日本語 (日本)',
  },
  {
    locale: 'zh-hant',
    code: 'TW',
    flag: '🇹🇼',
    label: '繁體中文 (台灣)',
  },
  {
    locale: 'en',
    code: 'EN',
    flag: '🇺🇸',
    label: 'English (United States)',
  },
] as const satisfies readonly {
  locale: SiteLocale;
  code: string;
  flag: string;
  label: string;
}[];

const switcherLabels: Record<SiteLocale, string> = {
  ko: '언어 선택',
  ja: '言語選択',
  'zh-hant': '語言選擇',
  en: 'Language selector',
};

export function localeFlagHref(pathname: string, targetLocale: SiteLocale): string {
  if (targetLocale === 'ja') {
    return jaLanguageSwitchTarget(stripLocaleFromPath(pathname));
  }
  return buildLocalePath(pathname, targetLocale);
}

export default function LocaleFlagSwitcher({
  locale,
  className,
  linkClassName,
  onLocaleSelect,
}: {
  locale: SiteLocale;
  className?: string;
  linkClassName?: string;
  onLocaleSelect?: (targetLocale: SiteLocale) => void;
}) {
  const pathname = usePathname() ?? `/${locale}`;
  const rootClassName = ['locale-flag-switcher', className].filter(Boolean).join(' ');
  const itemClassName = ['locale-flag-switcher-link', linkClassName].filter(Boolean).join(' ');

  return (
    <div className={rootClassName} role="group" aria-label={switcherLabels[locale]}>
      {LOCALE_FLAG_OPTIONS.map((option) => (
        <Link
          key={option.locale}
          href={localeFlagHref(pathname, option.locale)}
          className={itemClassName}
          aria-label={option.label}
          aria-current={locale === option.locale ? 'page' : undefined}
          onClick={() => onLocaleSelect?.(option.locale)}
        >
          <span className="locale-flag-switcher-flag" aria-hidden="true">
            {option.flag}
          </span>
          <span className="locale-flag-switcher-code" aria-hidden="true">
            {option.code}
          </span>
        </Link>
      ))}
    </div>
  );
}

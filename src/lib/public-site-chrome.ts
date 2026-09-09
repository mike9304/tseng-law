import type { SiteContent } from '@/data/site-content';
import { siteContent } from '@/data/site-content';
import { guidanceFooterCopy } from '@/data/international-guidance-offices';
import { guidanceContent } from '@/data/international-guidance-content';
import type { SiteLocale } from '@/lib/locales';
import {
  GUIDANCE_PAGE_KEYS,
  guidancePublicPath,
  isGuidanceLocale4,
  type GuidancePageKey,
  type PublicLocale8,
} from '@/lib/public-guidance';

/**
 * Chrome adapter for the four guidance locales (vi/id/th/fil).
 *
 * The public header, mobile drawer and footer are shared with ko/zh-hant/en/ja
 * and read their labels out of `siteContent`, which is intentionally still a
 * four-locale record. Rather than widening `SiteLocale` (which would drag the
 * whole builder/admin i18n surface with it), the guidance locales borrow the
 * English chrome structure and override every visible string that guidance
 * content already provides, so the markup — and therefore the design — is
 * identical while the copy stays in the page language.
 *
 * No new sentences are invented here: every guidance string comes from
 * `international-guidance-content.ts`.
 */

/** Site locale whose non-copy chrome assets (offices, mailto template) are reused. */
export function chromeSiteLocale(locale: PublicLocale8): SiteLocale {
  return isGuidanceLocale4(locale) ? 'en' : locale;
}

const GUIDANCE_HEADER_NAV_KEYS: readonly GuidancePageKey[] = [
  'services',
  'lawyers',
  'pricing',
  'columns',
  'faq',
  'contact',
];

/** Four columns, matching the four the other languages publish. */
const GUIDANCE_FOOTER_COLUMN_KEYS: ReadonlyArray<readonly [GuidancePageKey, readonly GuidancePageKey[]]> = [
  ['services', ['services', 'pricing', 'faq']],
  ['about', ['about', 'lawyers']],
  ['columns', ['columns', 'home']],
  ['contact', ['contact', 'privacy', 'disclaimer']],
];

/**
 * `siteContent` for any public locale. Guidance locales get the English
 * structure with guidance-language labels and guidance-only hrefs.
 */
export function publicSiteContent(locale: PublicLocale8): SiteContent {
  if (!isGuidanceLocale4(locale)) return siteContent[locale];

  const pack = guidanceContent[locale];
  const base = siteContent.en;
  const link = (key: GuidancePageKey) => ({
    label: pack.nav[key],
    href: guidancePublicPath(locale, key),
  });

  return {
    ...base,
    meta: {
      title: pack.pages.home.title,
      description: pack.pages.home.description,
    },
    nav: {
      ...base.nav,
      primary: GUIDANCE_PAGE_KEYS.filter((key) => key !== 'home').map(link),
      cta: { label: pack.contactCta, href: guidancePublicPath(locale, 'contact') },
      languageLabel: pack.languageLabel,
    },
    footer: {
      ...base.footer,
      note: pack.footerNotice,
      columns: GUIDANCE_FOOTER_COLUMN_KEYS.map(([titleKey, keys]) => ({
        title: pack.nav[titleKey],
        links: keys.map(link),
      })),
    },
  };
}

/** Header main-nav items for a guidance locale (same shape as the old four). */
export function guidanceHeaderNavItems(
  locale: PublicLocale8,
): Array<{ key: string; label: string; href: string }> {
  if (!isGuidanceLocale4(locale)) return [];
  const pack = guidanceContent[locale];
  return GUIDANCE_HEADER_NAV_KEYS.map((key) => ({
    key,
    label: pack.nav[key],
    href: guidancePublicPath(locale, key),
  }));
}

/** Header utility links for a guidance locale (same count as the old four). */
export function guidanceUtilityLinks(
  locale: PublicLocale8,
): Array<{ label: string; href: string }> {
  if (!isGuidanceLocale4(locale)) return [];
  const pack = guidanceContent[locale];
  return [
    { label: pack.nav.contact, href: guidancePublicPath(locale, 'contact') },
    { label: pack.nav.about, href: guidancePublicPath(locale, 'about') },
  ];
}

/**
 * Guidance locales have no search index, so the header's search affordance
 * points at the FAQ page instead of dropping the control (which would change
 * the header layout against the other four languages).
 */
export function guidanceSearchLink(locale: PublicLocale8): { href: string; label: string } | null {
  if (!isGuidanceLocale4(locale)) return null;
  return {
    href: guidancePublicPath(locale, 'faq'),
    label: guidanceContent[locale].nav.faq,
  };
}

/** Footer legal links for a guidance locale (same count as the old four). */
export function guidanceLegalLinks(
  locale: PublicLocale8,
): Array<{ label: string; href: string }> {
  if (!isGuidanceLocale4(locale)) return [];
  const pack = guidanceContent[locale];
  return [
    { label: pack.nav.privacy, href: guidancePublicPath(locale, 'privacy') },
    { label: pack.nav.disclaimer, href: guidancePublicPath(locale, 'disclaimer') },
    { label: pack.nav.faq, href: guidancePublicPath(locale, 'faq') },
    { label: guidanceFooterCopy[locale].sitemapLabel, href: '/sitemap.xml' },
  ];
}

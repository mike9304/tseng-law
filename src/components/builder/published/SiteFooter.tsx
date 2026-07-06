import Footer, { type FooterLink } from '@/components/Footer';
import { filterNavigationForLocale } from '@/lib/builder/site/navigation';
import type { BuilderNavItem, BuilderSiteSettings, BuilderTheme } from '@/lib/builder/site/types';
import type { Locale } from '@/lib/locales';

type SiteFooterProps = {
  readonly siteName: string;
  readonly settings?: BuilderSiteSettings;
  readonly theme?: BuilderTheme;
  readonly navItems: readonly BuilderNavItem[];
  readonly locale: Locale;
};

const customLinksTitleByLocale: Record<Locale, string> = {
  ko: '추가 링크',
  'zh-hant': '其他連結',
  en: 'Additional links',
};

function labelForLocale(label: BuilderNavItem['label'], locale: Locale): string {
  if (typeof label === 'string') return label;
  return label[locale] ?? label.ko ?? label.en ?? label['zh-hant'] ?? '';
}

function shouldRenderFooterNavigationLink(href: string): boolean {
  return href.startsWith('#') || href.startsWith('https://') || href.startsWith('http://');
}

function collectFooterNavigationLinks(items: readonly BuilderNavItem[], locale: Locale): FooterLink[] {
  return items.flatMap((item) => {
    const href = item.href.trim();
    const ownLink = shouldRenderFooterNavigationLink(href)
      ? [{ href, label: labelForLocale(item.label, locale) }]
      : [];
    const childLinks = item.children ? collectFooterNavigationLinks(item.children, locale) : [];
    return [...ownLink, ...childLinks];
  });
}

export default function SiteFooter({ navItems, locale }: SiteFooterProps) {
  const visibleNavItems = filterNavigationForLocale([...navItems], locale);
  const footerNavigationLinks = collectFooterNavigationLinks(visibleNavItems, locale);
  return (
    <Footer
      locale={locale}
      extraColumns={footerNavigationLinks.length > 0
        ? [{ title: customLinksTitleByLocale[locale], links: footerNavigationLinks }]
        : []}
    />
  );
}

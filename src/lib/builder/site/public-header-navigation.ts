import type { Locale } from '@/lib/locales';
import { mergeHeaderMegaChildren, type HeaderMegaKey } from '@/lib/builder/site/header-mega';
import type { BuilderNavItem, BuilderSiteDocument } from '@/lib/builder/site/types';

const PUBLIC_HEADER_NAV_ITEMS: Array<{
  key: string;
  slug: string;
  labels: Record<Locale, string>;
  megaKey?: HeaderMegaKey;
}> = [
  { key: 'services', slug: 'services', labels: { ko: '업무분야', 'zh-hant': '服務領域', en: 'Services' }, megaKey: 'services' },
  { key: 'lawyers', slug: 'lawyers', labels: { ko: '변호사소개', 'zh-hant': '律師介紹', en: 'Lawyers' } },
  { key: 'pricing', slug: 'pricing', labels: { ko: '비용안내', 'zh-hant': '收費標準', en: 'Pricing' } },
  { key: 'columns', slug: 'columns', labels: { ko: '호정칼럼', 'zh-hant': '昊鼎專欄', en: 'Columns' } },
  { key: 'videos', slug: 'videos', labels: { ko: '미디어센터', 'zh-hant': '媒體中心', en: 'Media Center' }, megaKey: 'videos' },
  { key: 'reviews', slug: 'reviews', labels: { ko: '고객후기', 'zh-hant': '客戶評價', en: 'Reviews' } },
];

function navHrefForSlug(slug: string): string {
  return slug ? `/${slug}` : '/';
}

function mergeNavigationLabelDefaults(
  label: BuilderNavItem['label'],
  defaults: Record<Locale, string>,
): { label: BuilderNavItem['label']; changed: boolean } {
  if (typeof label === 'string') return { label, changed: false };
  const nextLabel = {
    ko: label.ko || defaults.ko,
    'zh-hant': label['zh-hant'] || defaults['zh-hant'],
    en: label.en || defaults.en,
  };
  return {
    label: nextLabel,
    changed: JSON.stringify(nextLabel) !== JSON.stringify(label),
  };
}

export function upgradePublicHeaderNavigation(site: BuilderSiteDocument): BuilderSiteDocument {
  let changed = false;
  const nextNavigation: BuilderNavItem[] = [...site.navigation];

  for (const item of PUBLIC_HEADER_NAV_ITEMS) {
    const href = navHrefForSlug(item.slug);
    const existing = nextNavigation.find((candidate) => candidate.href === href || candidate.id === `nav-${item.key}`);
    const page = site.pages.find((candidate) => candidate.slug === item.slug);
    if (existing) {
      const nextPageId = page?.pageId ?? existing.pageId;
      const megaResult = item.megaKey ? mergeHeaderMegaChildren(existing, item.megaKey) : { item: existing, changed: false };
      const labelResult = mergeNavigationLabelDefaults(existing.label, item.labels);
      if (labelResult.changed) {
        existing.label = labelResult.label;
        changed = true;
      }
      if (existing.href !== href || existing.pageId !== nextPageId) {
        existing.href = href;
        existing.pageId = nextPageId;
        changed = true;
      }
      if (megaResult.changed) {
        existing.children = megaResult.item.children;
        changed = true;
      }
      continue;
    }

    const nextItem: BuilderNavItem = {
      id: `nav-${item.key}`,
      pageId: page?.pageId ?? `external-${item.key}`,
      href,
      label: item.labels,
    };
    nextNavigation.push(item.megaKey ? mergeHeaderMegaChildren(nextItem, item.megaKey).item : nextItem);
    changed = true;
  }

  if (!changed) return site;
  return {
    ...site,
    updatedAt: new Date().toISOString(),
    navigation: nextNavigation,
  };
}

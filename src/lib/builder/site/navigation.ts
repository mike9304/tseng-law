import type { Locale } from '@/lib/locales';
import { isForeignLocaleHref } from '@/lib/builder/site/paths';
import type { BuilderNavItem, BuilderPageMeta } from '@/lib/builder/site/types';

interface NavigationFilterOptions {
  pages?: BuilderPageMeta[];
  publishedOnly?: boolean;
}

function shouldHideForPublishState(item: BuilderNavItem, options?: NavigationFilterOptions): boolean {
  if (!options?.publishedOnly || !options.pages || !item.pageId) return false;
  const page = options.pages.find((entry) => entry.pageId === item.pageId);
  return Boolean(page && !page.publishedAt);
}

export function filterNavigationForLocale(
  items: BuilderNavItem[],
  locale: Locale,
  options?: NavigationFilterOptions,
): BuilderNavItem[] {
  return items.flatMap((item) => {
    if (isForeignLocaleHref(item.href, locale)) return [];
    if (shouldHideForPublishState(item, options)) return [];
    const children = item.children ? filterNavigationForLocale(item.children, locale, options) : undefined;
    if (!children) return [item];
    if (children.length === item.children?.length) return [item];

    const nextItem = { ...item };
    if (children.length > 0) {
      nextItem.children = children;
    } else {
      delete nextItem.children;
    }
    return [nextItem];
  });
}

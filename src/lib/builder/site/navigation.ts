import type { Locale } from '@/lib/locales';
import { isForeignLocaleHref } from '@/lib/builder/site/paths';
import type { BuilderNavItem } from '@/lib/builder/site/types';

export function filterNavigationForLocale(items: BuilderNavItem[], locale: Locale): BuilderNavItem[] {
  return items.flatMap((item) => {
    if (isForeignLocaleHref(item.href, locale)) return [];
    const children = item.children ? filterNavigationForLocale(item.children, locale) : undefined;
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

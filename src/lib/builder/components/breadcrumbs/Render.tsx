import type { BuilderBreadcrumbsCanvasNode } from '@/lib/builder/canvas/types';
import { safeHref } from '@/lib/builder/links';
import type { Locale } from '@/lib/locales';
import { getNavigationDecorativeCopy, localizedBreadcrumbsDefaults } from '../navigation-decorative-copy';

const SEPARATOR_GLYPH: Record<BuilderBreadcrumbsCanvasNode['content']['separator'], string> = {
  slash: '/',
  chevron: '›',
  dot: '·',
};

function BreadcrumbsRender({
  node,
  locale = 'ko',
}: {
  node: BuilderBreadcrumbsCanvasNode;
  locale?: Locale;
  mode?: 'edit' | 'preview' | 'published';
}) {
  const c = node.content;
  const copy = getNavigationDecorativeCopy(locale);
  const defaults = localizedBreadcrumbsDefaults(c.items, c.homeLabel, c.homeHref, copy.breadcrumbs);
  const items: Array<{ label: string; href?: string }> = [];
  if (c.showHome) items.push({ label: defaults.homeLabel, href: defaults.homeHref });
  items.push(...defaults.items);

  return (
    <nav
      className="builder-nav-breadcrumbs"
      data-builder-nav-widget="breadcrumbs"
      data-builder-breadcrumbs-separator={c.separator}
      aria-label={copy.breadcrumbs.navLabel}
    >
      <ol>
        {items.map((item, idx) => {
          const isLast = idx === items.length - 1;
          const itemHref = safeHref(item.href);
          return (
            <li key={`${item.label}-${idx}`} data-active={isLast ? 'true' : 'false'}>
              {itemHref && !isLast ? <a href={itemHref}>{item.label}</a> : <span>{item.label}</span>}
              {!isLast ? (
                <em aria-hidden="true" className="builder-nav-breadcrumbs-sep">
                  {SEPARATOR_GLYPH[c.separator]}
                </em>
              ) : null}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

export default BreadcrumbsRender;

import { defineComponent, type BuilderComponentInspectorProps } from '../define';
import type { BuilderBreadcrumbsCanvasNode } from '@/lib/builder/canvas/types';
import { safeHref } from '@/lib/builder/links';
import type { Locale } from '@/lib/locales';
import {
  BREADCRUMBS_LEGACY_DEFAULTS,
  getNavigationDecorativeCopy,
  localizedBreadcrumbsDefaults,
} from '../navigation-decorative-copy';
import styles from './BreadcrumbsInspector.module.css';

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

function itemsToText(items: BuilderBreadcrumbsCanvasNode['content']['items']): string {
  return items.map((it) => `${it.label} | ${it.href ?? ''}`).join('\n');
}

function parseItems(value: string): BuilderBreadcrumbsCanvasNode['content']['items'] {
  const out: BuilderBreadcrumbsCanvasNode['content']['items'] = [];
  for (const rawLine of value.split('\n')) {
    const line = rawLine.trim();
    if (!line) continue;
    const [label, href] = line.split('|').map((part) => part.trim());
    if (!label) continue;
    const item: { label: string; href?: string } = { label: label.slice(0, 80) };
    if (href) item.href = href.slice(0, 2000);
    out.push(item);
  }
  return out.slice(0, 10);
}

function BreadcrumbsInspector({
  node,
  locale = 'ko',
  onUpdate,
  disabled = false,
}: BuilderComponentInspectorProps) {
  const bcNode = node as BuilderBreadcrumbsCanvasNode;
  const c = bcNode.content;
  const copy = getNavigationDecorativeCopy(locale);
  const defaults = localizedBreadcrumbsDefaults(c.items, c.homeLabel, c.homeHref, copy.breadcrumbs);
  return (
    <div className={styles.root} data-builder-breadcrumbs-inspector="true">
      <label className={styles.field}>
        <span className={styles.label}>{copy.breadcrumbs.inspector.items}</span>
        <textarea
          rows={4}
          className={`${styles.control} ${styles.textarea}`}
          value={itemsToText(defaults.items)}
          disabled={disabled}
          onChange={(event) => onUpdate({ items: parseItems(event.target.value) })}
        />
      </label>
      <label className={styles.field}>
        <span className={styles.label}>{copy.breadcrumbs.inspector.separator}</span>
        <select
          value={c.separator}
          disabled={disabled}
          className={styles.control}
          onChange={(event) => onUpdate({ separator: event.target.value as BuilderBreadcrumbsCanvasNode['content']['separator'] })}
        >
          <option value="chevron">{copy.breadcrumbs.inspector.separators.chevron}</option>
          <option value="slash">{copy.breadcrumbs.inspector.separators.slash}</option>
          <option value="dot">{copy.breadcrumbs.inspector.separators.dot}</option>
        </select>
      </label>
      <label className={styles.checkboxRow}>
        <input
          type="checkbox"
          checked={c.showHome}
          disabled={disabled}
          onChange={(event) => onUpdate({ showHome: event.target.checked })}
        />
        <span>{copy.breadcrumbs.inspector.showHome}</span>
      </label>
      <label className={styles.field}>
        <span className={styles.label}>{copy.breadcrumbs.inspector.homeLabel}</span>
        <input
          type="text"
          value={defaults.homeLabel}
          disabled={disabled}
          className={styles.control}
          onChange={(event) => onUpdate({ homeLabel: event.target.value })}
        />
      </label>
      <label className={styles.field}>
        <span className={styles.label}>{copy.breadcrumbs.inspector.homeHref}</span>
        <input
          type="text"
          value={defaults.homeHref}
          disabled={disabled}
          className={styles.control}
          onChange={(event) => onUpdate({ homeHref: event.target.value })}
        />
      </label>
    </div>
  );
}

export default defineComponent({
  kind: 'breadcrumbs',
  displayName: '브레드크럼',
  category: 'advanced',
  icon: '›',
  defaultContent: {
    items: [...BREADCRUMBS_LEGACY_DEFAULTS.items],
    separator: 'chevron' as const,
    showHome: true,
    homeLabel: BREADCRUMBS_LEGACY_DEFAULTS.homeLabel,
    homeHref: BREADCRUMBS_LEGACY_DEFAULTS.homeHref,
  },
  defaultStyle: {},
  defaultRect: { width: 480, height: 32 },
  Render: BreadcrumbsRender,
  Inspector: BreadcrumbsInspector,
});

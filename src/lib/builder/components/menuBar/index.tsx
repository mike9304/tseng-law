import { defineComponent, type BuilderComponentInspectorProps } from '../define';
import type { BuilderMenuBarCanvasNode } from '@/lib/builder/canvas/types';
import { normalizeLocale } from '@/lib/locales';
import {
  getLayoutNavigationWidgetsCopy,
  localizedMenuItems,
  MENU_BAR_LEGACY_DEFAULT_ITEMS,
} from '../layout-navigation-widgets-copy';
import MenuBarRender from './MenuBarRender';
import styles from './MenuBarInspector.module.css';

function itemsToText(items: BuilderMenuBarCanvasNode['content']['items']): string {
  return items.map((it) => `${it.label} | ${it.href}`).join('\n');
}

function parseItems(value: string): BuilderMenuBarCanvasNode['content']['items'] {
  const items: BuilderMenuBarCanvasNode['content']['items'] = [];
  for (const rawLine of value.split('\n')) {
    const line = rawLine.trim();
    if (!line) continue;
    const [label, href] = line.split('|').map((part) => part.trim());
    if (!label) continue;
    items.push({ label: label.slice(0, 60), href: (href ?? '#').slice(0, 2000) });
  }
  return items.slice(0, 20);
}

function MenuBarInspector({
  node,
  locale = 'ko',
  onUpdate,
  disabled = false,
}: BuilderComponentInspectorProps) {
  const menuNode = node as BuilderMenuBarCanvasNode;
  const c = menuNode.content;
  const copy = getLayoutNavigationWidgetsCopy(normalizeLocale(locale)).menuBar;
  const displayItems = localizedMenuItems(c.items, copy.defaultItems);
  return (
    <div className={styles.root} data-builder-menu-bar-inspector="true">
      <label className={styles.field}>
        <span className={styles.label}>{copy.inspector.orientation}</span>
        <select
          className={styles.control}
          value={c.orientation}
          disabled={disabled}
          onChange={(event) => onUpdate({ orientation: event.target.value as BuilderMenuBarCanvasNode['content']['orientation'] })}
        >
          <option value="horizontal">{copy.inspector.orientationOptions.horizontal}</option>
          <option value="vertical">{copy.inspector.orientationOptions.vertical}</option>
        </select>
      </label>
      <label className={styles.field}>
        <span className={styles.label}>{copy.inspector.style}</span>
        <select
          className={styles.control}
          value={c.variant}
          disabled={disabled}
          onChange={(event) => onUpdate({ variant: event.target.value as BuilderMenuBarCanvasNode['content']['variant'] })}
        >
          <option value="plain">{copy.inspector.variantOptions.plain}</option>
          <option value="pill">{copy.inspector.variantOptions.pill}</option>
          <option value="dropdown">{copy.inspector.variantOptions.dropdown}</option>
          <option value="mega">{copy.inspector.variantOptions.mega}</option>
        </select>
      </label>
      <label className={styles.field}>
        <span className={styles.label}>{copy.inspector.activeHref}</span>
        <input
          className={styles.control}
          type="text"
          value={c.activeHref}
          disabled={disabled}
          onChange={(event) => onUpdate({ activeHref: event.target.value })}
        />
      </label>
      <label className={styles.field}>
        <span className={styles.label}>{copy.inspector.items}</span>
        <textarea
          className={`${styles.control} ${styles.textarea}`}
          rows={5}
          value={itemsToText(displayItems)}
          disabled={disabled}
          onChange={(event) => onUpdate({ items: parseItems(event.target.value) })}
        />
      </label>
      <label className={styles.checkboxRow}>
        <input
          type="checkbox"
          checked={c.showMobileHamburger}
          disabled={disabled}
          onChange={(event) => onUpdate({ showMobileHamburger: event.target.checked })}
        />
        <span>{copy.inspector.mobileHamburger}</span>
      </label>
    </div>
  );
}

export default defineComponent({
  kind: 'menu-bar',
  displayName: '메뉴 바',
  category: 'advanced',
  icon: '☰',
  defaultContent: {
    items: MENU_BAR_LEGACY_DEFAULT_ITEMS.map((item) => ({ ...item })),
    orientation: 'horizontal' as const,
    variant: 'plain' as const,
    activeHref: '',
    showMobileHamburger: true,
  },
  defaultStyle: {},
  defaultRect: { width: 520, height: 56 },
  Render: MenuBarRender,
  Inspector: MenuBarInspector,
});

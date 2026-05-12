import { defineComponent, type BuilderComponentInspectorProps } from '../define';
import type { BuilderMenuBarCanvasNode } from '@/lib/builder/canvas/types';
import MenuBarRender from './MenuBarRender';

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
  onUpdate,
  disabled = false,
}: BuilderComponentInspectorProps) {
  const menuNode = node as BuilderMenuBarCanvasNode;
  const c = menuNode.content;
  return (
    <>
      <label>
        <span>방향</span>
        <select
          value={c.orientation}
          disabled={disabled}
          onChange={(event) => onUpdate({ orientation: event.target.value as BuilderMenuBarCanvasNode['content']['orientation'] })}
        >
          <option value="horizontal">Horizontal</option>
          <option value="vertical">Vertical</option>
        </select>
      </label>
      <label>
        <span>스타일</span>
        <select
          value={c.variant}
          disabled={disabled}
          onChange={(event) => onUpdate({ variant: event.target.value as BuilderMenuBarCanvasNode['content']['variant'] })}
        >
          <option value="plain">Plain</option>
          <option value="pill">Pill</option>
          <option value="dropdown">Dropdown</option>
          <option value="mega">Mega menu</option>
        </select>
      </label>
      <label>
        <span>활성 href</span>
        <input
          type="text"
          value={c.activeHref}
          disabled={disabled}
          onChange={(event) => onUpdate({ activeHref: event.target.value })}
        />
      </label>
      <label>
        <span>메뉴 항목 (label | href)</span>
        <textarea
          rows={5}
          style={{ fontFamily: 'inherit', resize: 'vertical' }}
          value={itemsToText(c.items)}
          disabled={disabled}
          onChange={(event) => onUpdate({ items: parseItems(event.target.value) })}
        />
      </label>
      <label style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
        <input
          type="checkbox"
          checked={c.showMobileHamburger}
          disabled={disabled}
          onChange={(event) => onUpdate({ showMobileHamburger: event.target.checked })}
        />
        <span>모바일 햄버거</span>
      </label>
    </>
  );
}

export default defineComponent({
  kind: 'menu-bar',
  displayName: '메뉴 바',
  category: 'advanced',
  icon: '☰',
  defaultContent: {
    items: [
      { label: '서비스', href: '/ko/services' },
      { label: '변호사', href: '/ko/lawyers' },
      { label: '소식', href: '/ko/insights' },
      { label: '문의', href: '/ko/contact' },
    ],
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

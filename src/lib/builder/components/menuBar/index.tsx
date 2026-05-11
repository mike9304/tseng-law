'use client';

import { useState } from 'react';
import { defineComponent, type BuilderComponentInspectorProps } from '../define';
import type { BuilderMenuBarCanvasNode } from '@/lib/builder/canvas/types';

function MenuBarRender({
  node,
  mode = 'edit',
}: {
  node: BuilderMenuBarCanvasNode;
  mode?: 'edit' | 'preview' | 'published';
}) {
  const c = node.content;
  const [openIdx, setOpenIdx] = useState<number | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);

  function renderItem(item: BuilderMenuBarCanvasNode['content']['items'][number], idx: number) {
    const isActive = c.activeHref && item.href === c.activeHref;
    const hasChildren = (item.children?.length ?? 0) > 0;
    return (
      <li
        key={`${item.label}-${idx}`}
        data-builder-menu-item={item.label}
        data-active={isActive ? 'true' : 'false'}
        onMouseEnter={() => hasChildren && setOpenIdx(idx)}
        onMouseLeave={() => openIdx === idx && setOpenIdx(null)}
      >
        <a href={item.href}>{item.label}</a>
        {hasChildren && (c.variant === 'dropdown' || c.variant === 'mega') && openIdx === idx ? (
          <div
            className="builder-nav-menu-dropdown"
            data-builder-menu-variant={c.variant}
          >
            {(item.children ?? []).map((child, childIdx) => (
              <a key={`${child.label}-${childIdx}`} href={child.href}>
                <strong>{child.label}</strong>
                {child.description ? <small>{child.description}</small> : null}
              </a>
            ))}
          </div>
        ) : null}
      </li>
    );
  }

  const showMobileToggle = c.orientation === 'horizontal' && c.showMobileHamburger;

  return (
    <nav
      className="builder-nav-menu-bar"
      data-builder-nav-widget="menu-bar"
      data-builder-menu-orientation={c.orientation}
      data-builder-menu-variant={c.variant}
      aria-label="primary navigation"
    >
      {showMobileToggle ? (
        <button
          type="button"
          className="builder-nav-menu-hamburger"
          aria-label="open menu"
          onClick={() => mode !== 'edit' && setMobileOpen((v) => !v)}
          data-builder-menu-mobile-open={mobileOpen ? 'true' : 'false'}
        >
          <span /><span /><span />
        </button>
      ) : null}
      <ul data-builder-menu-mobile-open={mobileOpen ? 'true' : 'false'}>
        {c.items.length === 0 && mode === 'edit'
          ? (
            <li className="builder-nav-menu-empty">
              <em>메뉴 항목을 인스펙터에서 추가하세요</em>
            </li>
          )
          : c.items.map(renderItem)}
      </ul>
    </nav>
  );
}

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

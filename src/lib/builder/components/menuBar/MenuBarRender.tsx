'use client';

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type FocusEvent as ReactFocusEvent,
  type KeyboardEvent as ReactKeyboardEvent,
} from 'react';
import type { BuilderMenuBarCanvasNode } from '@/lib/builder/canvas/types';

export default function MenuBarRender({
  node,
  mode = 'edit',
}: {
  node: BuilderMenuBarCanvasNode;
  mode?: 'edit' | 'preview' | 'published';
}) {
  const c = node.content;
  const [openIdx, setOpenIdx] = useState<number | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const navRef = useRef<HTMLElement | null>(null);
  const hamburgerRef = useRef<HTMLButtonElement | null>(null);
  const menuListRef = useRef<HTMLUListElement | null>(null);
  const itemLinkRefs = useRef<Record<number, HTMLAnchorElement | null>>({});
  const dropdownRefs = useRef<Record<number, HTMLDivElement | null>>({});
  const suppressFocusOpenRef = useRef<number | null>(null);
  const mobileMenuId = `${node.id}-menu-items`;
  const interactive = mode !== 'edit';

  const closeDropdown = useCallback((restoreIndex?: number) => {
    setOpenIdx(null);
    if (typeof restoreIndex === 'number') {
      suppressFocusOpenRef.current = restoreIndex;
      window.requestAnimationFrame(() => {
        itemLinkRefs.current[restoreIndex]?.focus({ preventScroll: true });
      });
    }
  }, []);

  const closeMobileMenu = useCallback((restoreFocus = false) => {
    setMobileOpen(false);
    if (restoreFocus) {
      window.requestAnimationFrame(() => {
        hamburgerRef.current?.focus({ preventScroll: true });
      });
    }
  }, []);

  useEffect(() => {
    if (!interactive || !mobileOpen) return undefined;
    const frame = window.requestAnimationFrame(() => {
      menuListRef.current?.querySelector<HTMLAnchorElement>('a[href]')?.focus({ preventScroll: true });
    });
    return () => window.cancelAnimationFrame(frame);
  }, [interactive, mobileOpen]);

  const openDropdown = useCallback((idx: number) => {
    if (!interactive) return;
    setOpenIdx(idx);
  }, [interactive]);

  useEffect(() => {
    if (!interactive || (!mobileOpen && openIdx === null)) return undefined;
    function handleDocumentKeyDown(event: KeyboardEvent) {
      if (event.key !== 'Escape') return;
      if (openIdx !== null) {
        event.preventDefault();
        closeDropdown(openIdx);
        return;
      }
      if (mobileOpen) {
        event.preventDefault();
        closeMobileMenu(true);
      }
    }
    document.addEventListener('keydown', handleDocumentKeyDown);
    return () => document.removeEventListener('keydown', handleDocumentKeyDown);
  }, [closeDropdown, closeMobileMenu, interactive, mobileOpen, openIdx]);

  function handleMenuKeyDown(event: ReactKeyboardEvent<HTMLElement>) {
    if (!interactive || event.key !== 'Escape') return;
    if (openIdx !== null) {
      event.preventDefault();
      event.stopPropagation();
      closeDropdown(openIdx);
      return;
    }
    if (mobileOpen) {
      event.preventDefault();
      event.stopPropagation();
      closeMobileMenu(true);
    }
  }

  function handleItemBlur(event: ReactFocusEvent<HTMLLIElement>, idx: number) {
    if (!interactive || openIdx !== idx) return;
    if (event.currentTarget.contains(event.relatedTarget as Node | null)) return;
    setOpenIdx(null);
  }

  function handleItemFocus(idx: number, hasChildren: boolean) {
    if (!hasChildren || mobileOpen) return;
    if (suppressFocusOpenRef.current === idx) {
      suppressFocusOpenRef.current = null;
      return;
    }
    openDropdown(idx);
  }

  function handleItemKeyDown(
    event: ReactKeyboardEvent<HTMLAnchorElement>,
    idx: number,
    hasChildren: boolean,
  ) {
    if (!interactive) return;
    if (event.key === 'Escape') {
      event.preventDefault();
      event.stopPropagation();
      closeDropdown(idx);
      return;
    }
    if (!hasChildren || (c.variant !== 'dropdown' && c.variant !== 'mega')) return;
    if (event.key === 'ArrowDown' || event.key === ' ') {
      event.preventDefault();
      event.stopPropagation();
      setOpenIdx(idx);
      window.requestAnimationFrame(() => {
        dropdownRefs.current[idx]?.querySelector<HTMLAnchorElement>('a[href]')?.focus({ preventScroll: true });
      });
    }
  }

  function handleChildKeyDown(event: ReactKeyboardEvent<HTMLAnchorElement>, idx: number) {
    if (!interactive || event.key !== 'Escape') return;
    event.preventDefault();
    event.stopPropagation();
    closeDropdown(idx);
  }

  function renderItem(item: BuilderMenuBarCanvasNode['content']['items'][number], idx: number) {
    const isActive = c.activeHref && item.href === c.activeHref;
    const hasChildren = (item.children?.length ?? 0) > 0;
    const dropdownId = `${node.id}-dropdown-${idx}`;
    return (
      <li
        key={`${item.label}-${idx}`}
        data-builder-menu-item={item.label}
        data-active={isActive ? 'true' : 'false'}
        onBlur={(event) => handleItemBlur(event, idx)}
        onMouseEnter={() => hasChildren && setOpenIdx(idx)}
        onMouseLeave={() => openIdx === idx && setOpenIdx(null)}
      >
        <a
          ref={(element) => {
            itemLinkRefs.current[idx] = element;
          }}
          href={item.href}
          aria-haspopup={hasChildren && (c.variant === 'dropdown' || c.variant === 'mega') ? 'true' : undefined}
          aria-expanded={hasChildren && (c.variant === 'dropdown' || c.variant === 'mega') ? openIdx === idx : undefined}
          aria-controls={hasChildren && (c.variant === 'dropdown' || c.variant === 'mega') ? dropdownId : undefined}
          onFocus={() => handleItemFocus(idx, hasChildren)}
          onKeyDown={(event) => handleItemKeyDown(event, idx, hasChildren)}
          onClick={() => interactive && closeMobileMenu(false)}
        >
          {item.label}
        </a>
        {hasChildren && (c.variant === 'dropdown' || c.variant === 'mega') && openIdx === idx ? (
          <div
            id={dropdownId}
            ref={(element) => {
              dropdownRefs.current[idx] = element;
            }}
            className="builder-nav-menu-dropdown"
            data-builder-menu-variant={c.variant}
          >
            {(item.children ?? []).map((child, childIdx) => (
              <a
                key={`${child.label}-${childIdx}`}
                href={child.href}
                onKeyDown={(event) => handleChildKeyDown(event, idx)}
                onClick={() => interactive && closeMobileMenu(false)}
              >
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
      ref={navRef}
      className="builder-nav-menu-bar"
      data-builder-nav-widget="menu-bar"
      data-builder-menu-orientation={c.orientation}
      data-builder-menu-variant={c.variant}
      aria-label="primary navigation"
      onKeyDown={handleMenuKeyDown}
    >
      {showMobileToggle ? (
        <button
          ref={hamburgerRef}
          type="button"
          className="builder-nav-menu-hamburger"
          aria-label={mobileOpen ? 'close menu' : 'open menu'}
          aria-expanded={mobileOpen}
          aria-controls={mobileMenuId}
          onClick={() => {
            if (!interactive) return;
            setMobileOpen((value) => !value);
          }}
          data-builder-menu-mobile-open={mobileOpen ? 'true' : 'false'}
        >
          <span /><span /><span />
        </button>
      ) : null}
      <ul
        ref={menuListRef}
        id={mobileMenuId}
        data-builder-menu-mobile-panel="true"
        data-builder-menu-mobile-open={mobileOpen ? 'true' : 'false'}
      >
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

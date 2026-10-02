'use client';

import { useEffect, useState, type MouseEvent } from 'react';
import type { BuilderAnchorMenuCanvasNode } from '@/lib/builder/canvas/types';
import type { Locale } from '@/lib/locales';
import { getUtilityAdvancedWidgetsCopy } from '../utility-advanced-widgets-copy';
import { anchorLabel } from './anchor-menu-items';

function AnchorMenuRender({
  node,
  mode = 'edit',
  locale = 'ko',
}: {
  node: BuilderAnchorMenuCanvasNode;
  mode?: 'edit' | 'preview' | 'published';
  locale?: Locale;
}) {
  const c = node.content;
  const copy = getUtilityAdvancedWidgetsCopy(locale).anchorMenu;
  const [activeId, setActiveId] = useState<string>(c.items[0]?.anchorId ?? '');

  useEffect(() => {
    if (mode === 'edit' || c.items.length === 0) return undefined;
    function onScroll() {
      const top = window.scrollY + c.offsetTopPx + 8;
      let candidate = c.items[0]?.anchorId ?? '';
      for (const item of c.items) {
        const target = document.getElementById(item.anchorId);
        if (!target) continue;
        const rect = target.getBoundingClientRect();
        const absoluteTop = window.scrollY + rect.top;
        if (absoluteTop <= top) candidate = item.anchorId;
      }
      setActiveId(candidate);
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, [c.items, c.offsetTopPx, mode]);

  function handleClick(event: MouseEvent<HTMLAnchorElement>, anchorId: string) {
    if (mode === 'edit') {
      event.preventDefault();
      return;
    }
    const target = document.getElementById(anchorId);
    if (!target) return;
    event.preventDefault();
    const top = target.getBoundingClientRect().top + window.scrollY - c.offsetTopPx;
    window.scrollTo({ top, behavior: 'smooth' });
    window.history.pushState(null, '', `#${encodeURIComponent(anchorId)}`);
  }

  return (
    <nav
      className="builder-nav-anchor-menu"
      data-builder-nav-widget="anchor-menu"
      data-builder-anchor-sticky={c.sticky ? 'true' : 'false'}
      aria-label={copy.navLabel}
    >
      <ul>
        {c.items.length === 0 && mode === 'edit' ? (
          <li className="builder-nav-anchor-empty">
            <em>{copy.empty}</em>
          </li>
        ) : (
          c.items.map((item, idx) => (
            <li
              key={`${item.anchorId}-${idx}`}
              data-builder-anchor-active={activeId === item.anchorId ? 'true' : 'false'}
              style={activeId === item.anchorId ? { color: c.activeColor } : undefined}
            >
              <a href={`#${encodeURIComponent(item.anchorId)}`} onClick={(event) => handleClick(event, item.anchorId)}>
                {anchorLabel(item.label, item.anchorId, copy)}
              </a>
            </li>
          ))
        )}
      </ul>
    </nav>
  );
}

export default AnchorMenuRender;

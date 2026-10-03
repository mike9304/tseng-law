'use client';

import { useEffect, useRef, useState } from 'react';
import v2 from './EnPagesV2.module.css';

export type EnLocalNavItem = { href: `#${string}`; label: string };

/**
 * Local nav for long en inner pages (CONCEPT-V2 12.2, Option B): sticky under the site header, the page title on
 * the left from 1024 px, anchors on the right; the anchor whose section crosses the middle of the viewport gets
 * `aria-current="true"`. No CTA (the header has it). Hidden below 500 px of viewport height (CSS).
 */
export default function EnLocalNav({
  title,
  items,
  label = 'On this page',
}: {
  title: string;
  items: readonly EnLocalNavItem[];
  label?: string;
}) {
  const [active, setActive] = useState<string | null>(null);
  const listRef = useRef<HTMLUListElement>(null);

  useEffect(() => {
    if (typeof IntersectionObserver === 'undefined') return undefined;
    const targets = items
      .map((item) => document.getElementById(item.href.slice(1)))
      .filter((node): node is HTMLElement => node !== null);
    if (targets.length === 0) return undefined;
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActive(`#${entry.target.id}`);
        }
      },
      { rootMargin: '-50% 0px -50% 0px' },
    );
    targets.forEach((node) => observer.observe(node));
    return () => observer.disconnect();
  }, [items]);

  // Keep the active anchor in view inside the sideways-scrolling list on phones.
  useEffect(() => {
    if (!active || !listRef.current) return;
    const link = listRef.current.querySelector<HTMLAnchorElement>(`a[href="${active}"]`);
    const list = listRef.current;
    if (!link || list.scrollWidth <= list.clientWidth) return;
    const left = link.offsetLeft - list.offsetLeft - 20;
    list.scrollTo({ left, behavior: 'auto' });
  }, [active]);

  return (
    <nav className={v2.localNav} aria-label={label} data-en-local-nav>
      <div className={`container ${v2.localNavInner}`}>
        <p className={v2.localNavTitle}>{title}</p>
        <ul className={v2.localNavList} ref={listRef}>
          {items.map((item) => (
            <li key={item.href}>
              <a href={item.href} className={v2.localNavLink} aria-current={active === item.href ? 'true' : undefined}>
                {item.label}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}

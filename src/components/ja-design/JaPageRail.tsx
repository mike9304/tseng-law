'use client';

import { useEffect, useRef, useState } from 'react';
import styles from './JaPagesV2.module.css';

export type JaRailItem = { id: string; label: string };

/**
 * 昊 V2 inner pages (2026-10-02): the page's own 目次 (CONCEPT-V2 §7.10). From 1200 px it is a sticky
 * vertical (tategaki) rail read right to left; below, a 52 px sticky tab row under the site header that
 * scrolls sideways. `aria-current` follows the block crossing the middle of the viewport (one
 * IntersectionObserver, no scroll listener); without IO the links still jump to their anchors.
 *
 * Merge note: the home lane builds `kou/JaLocalIndex` + `kou/JaIndexSync` for the same role; when they land,
 * they replace this component on /ja/services, the service details, the lawyer profile and column details.
 */
export default function JaPageRail({ items, label, className }: { items: JaRailItem[]; label: string; className?: string }) {
  const [current, setCurrent] = useState<string | null>(null);
  const listRef = useRef<HTMLOListElement>(null);
  const ids = items.map((item) => item.id).join('|');

  useEffect(() => {
    if (!('IntersectionObserver' in window)) return undefined;
    const targets = ids.split('|').map((id) => document.getElementById(id)).filter((el): el is HTMLElement => el !== null);
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) if (entry.isIntersecting) setCurrent(entry.target.id);
      },
      { rootMargin: '-50% 0px -50% 0px' },
    );
    targets.forEach((target) => io.observe(target));
    return () => io.disconnect();
  }, [ids]);

  useEffect(() => {
    const list = listRef.current;
    if (!list || !current || list.scrollWidth <= list.clientWidth + 1) return;
    const link = list.querySelector<HTMLElement>(`a[href="#${CSS.escape(current)}"]`);
    if (!link) return;
    const left = link.offsetLeft - (list.clientWidth - link.offsetWidth) / 2;
    const instant = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    list.scrollTo({ left: Math.max(0, left), behavior: instant ? 'auto' : 'smooth' });
  }, [current]);

  return (
    <nav className={className ? `${styles.rail} ${className}` : styles.rail} aria-label={label}>
      <ol ref={listRef} className={styles.railList}>
        {items.map((item) => (
          <li key={item.id}>
            <a href={`#${item.id}`} className={styles.railLink} aria-current={current === item.id ? 'true' : undefined}>
              {item.label}
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
}

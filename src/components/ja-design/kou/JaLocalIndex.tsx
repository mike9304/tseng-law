'use client';

import { useEffect, useRef } from 'react';
import { JA_KOU_REUSED } from './ja-copy';
import p from './JaPractice.module.css';

/**
 * The C4 vertical 目次 as a reusable rail for long inner pages (CONCEPT-V2 §7.10): from 1200 px a sticky vertical-rl
 * rail, below a 52 px sticky tab row that scrolls sideways. `aria-current` follows the section crossing the viewport
 * centre. Built in the home lane for the lead to mount on inner routes (not mounted by this lane).
 */
export default function JaLocalIndex({
  items,
  label = JA_KOU_REUSED.localIndexLabel.text,
  labelledBy,
}: {
  items: ReadonlyArray<{ id: string; label: string }>;
  label?: string;
  labelledBy?: string;
}) {
  const navRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const nav = navRef.current;
    if (!nav || typeof IntersectionObserver === 'undefined') return;
    const row = nav.querySelector<HTMLElement>('ul');
    const links = Array.from(nav.querySelectorAll<HTMLAnchorElement>('a'));
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          for (const link of links) {
            const active = link.getAttribute('href') === `#${entry.target.id}`;
            if (active) {
              link.setAttribute('aria-current', 'true');
              if (row && row.scrollWidth > row.clientWidth) row.scrollTo({ left: Math.max(0, link.offsetLeft - (row.clientWidth - link.offsetWidth) / 2) });
            } else link.removeAttribute('aria-current');
          }
        }
      },
      { rootMargin: '-50% 0px -50% 0px' },
    );
    for (const item of items) {
      const target = document.getElementById(item.id);
      if (target) io.observe(target);
    }
    return () => io.disconnect();
  }, [items]);

  return (
    <nav ref={navRef} className={p.index} aria-label={labelledBy ? undefined : label} aria-labelledby={labelledBy}>
      <ul className={p.indexList}>
        {items.map((item) => (
          <li key={item.id}>
            <a className={p.indexLink} href={`#${item.id}`}>
              {item.label}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}

'use client';

import { useEffect, useRef, useState } from 'react';
import c from './JaChapters.module.css';

/**
 * Phone capsule 「メールで相談」 (CONCEPT-V2 §7.9): a fixed link below 900 px, shown only while neither the hero, the
 * closing (#contact) nor the footer is in view. `inert` and aria-hidden while hidden, so it never takes focus unseen.
 */
export default function JaCapsule({ href, label, ariaLabel }: { href: string; label: string; ariaLabel: string }) {
  const ref = useRef<HTMLAnchorElement>(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    if (typeof IntersectionObserver === 'undefined') return;
    const targets = [
      document.getElementById('hero'),
      document.getElementById('contact'),
      document.querySelector('footer'),
    ].filter((el): el is HTMLElement => Boolean(el));
    const visible = new Set<Element>();
    const io = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) visible.add(entry.target);
        else visible.delete(entry.target);
      }
      setShown(visible.size === 0);
    });
    targets.forEach((target) => io.observe(target));
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    const link = ref.current;
    if (!link) return;
    if (shown) link.removeAttribute('inert');
    else link.setAttribute('inert', '');
  }, [shown]);

  return (
    <a
      ref={ref}
      className={c.capsule}
      href={href}
      aria-label={ariaLabel}
      aria-hidden={shown ? undefined : true}
      tabIndex={shown ? undefined : -1}
      data-shown={shown ? 'true' : 'false'}
    >
      {label}
    </a>
  );
}

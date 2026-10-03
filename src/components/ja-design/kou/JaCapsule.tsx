'use client';

import { useEffect, useRef, useState } from 'react';
import c from './JaChapters.module.css';

/**
 * Also marks the home wrapper while the hero is in view (`data-hero-in-view`), so the back-to-top button stays hidden.
 *
 * Phone capsule 「メールで相談」 (CONCEPT-V2 §7.9): a fixed link below 900 px, shown only while neither the hero, the
 * flow (whose own email action ends it), the closing (#contact) nor the footer is in view. `inert` and aria-hidden while hidden, so it never takes focus unseen.
 */
export default function JaCapsule({ href, label, ariaLabel }: { href: string; label: string; ariaLabel: string }) {
  const ref = useRef<HTMLAnchorElement>(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    if (typeof IntersectionObserver === 'undefined') return;
    const targets = [
      document.getElementById('hero'),
      document.getElementById('contact'),
      document.getElementById('ja-flow'),
      document.querySelector('footer'),
    ].filter((el): el is HTMLElement => Boolean(el));
    const visible = new Set<Element>();
    const home = document.getElementById('ja-home');
    const hero = document.getElementById('hero');
    const io = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) visible.add(entry.target);
        else visible.delete(entry.target);
      }
      setShown(visible.size === 0);
      // The shared back-to-top button stays hidden while the hero is in view (globals.css, ja only).
      if (home && hero) home.dataset.heroInView = visible.has(hero) ? 'true' : 'false';
    });
    targets.forEach((target) => io.observe(target));
    return () => {
      io.disconnect();
      if (home) delete home.dataset.heroInView;
    };
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

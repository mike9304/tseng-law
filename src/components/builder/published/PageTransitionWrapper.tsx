'use client';

import { usePathname } from 'next/navigation';
import { useEffect, useState, type ReactNode } from 'react';

export type PageTransitionPreset = 'none' | 'fade' | 'slide-up' | 'slide-left' | 'scale';

interface Props {
  children: ReactNode;
  preset?: PageTransitionPreset;
  durationMs?: number;
}

/**
 * Phase 22 W172 — Wraps the published page tree and fires an enter
 * animation whenever the route pathname changes. Uses CSS transitions
 * driven by `data-page-transition` + `data-page-transition-state` set on
 * the wrapper div. Skips itself when preset is 'none' or the user has
 * prefers-reduced-motion enabled.
 */
export default function PageTransitionWrapper({
  children,
  preset = 'fade',
  durationMs = 280,
}: Props) {
  const pathname = usePathname();
  const [state, setState] = useState<'pending' | 'visible'>('pending');

  useEffect(() => {
    if (preset === 'none') {
      setState('visible');
      return;
    }
    setState('pending');
    const id = window.requestAnimationFrame(() => setState('visible'));
    return () => window.cancelAnimationFrame(id);
  }, [pathname, preset]);

  if (preset === 'none') {
    return <>{children}</>;
  }

  return (
    <div
      data-page-transition={preset}
      data-page-transition-state={state}
      style={{
        // CSS rule in globals.css reads this var.
        // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
        ['--builder-page-transition-ms' as string]: `${durationMs}ms`,
      } as React.CSSProperties}
    >
      {children}
    </div>
  );
}

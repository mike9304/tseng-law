import type { ReactNode } from 'react';
import shared from './JaDesign.module.css';

/**
 * Wrapper for every Japanese page in the ja design (Opus 5.5 ja lane, 2026-10-01).
 * `data-ja-design` scopes the shared ja layer (JaDesign.module.css) and lets the
 * builder-published page sizing rule in globals.css recognise the wrapper; `className`
 * carries the page's own module. Children are passed through untouched, so the page's
 * copy, links and JSON-LD stay exactly as the existing components render them.
 */
export default function JaPageShell({
  page,
  className,
  children,
}: {
  page: string;
  className?: string;
  children: ReactNode;
}) {
  return (
    <div className={className ? `${shared.root} ${className}` : shared.root} id={`ja-${page}`} data-ja-design={page}>
      {children}
    </div>
  );
}

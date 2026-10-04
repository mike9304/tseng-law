import type { ReactNode } from 'react';
import shared from './JaDesign.module.css';
import pages from './JaPagesV2.module.css';

/**
 * Wrapper for every Japanese page in the ja design (Opus 5.5 ja lane, 2026-10-01).
 * `data-ja-design` scopes the shared ja layer (JaDesign.module.css) and lets the
 * builder-published page sizing rule in globals.css recognise the wrapper; `className`
 * carries the page's own module. Children are passed through untouched, so the page's
 * copy, links and JSON-LD stay exactly as the existing components render them.
 *
 * 昊 V2 inner pages (2026-10-02): every page except the home also carries the inner-page
 * layer (JaPagesV2.module.css, `data-ja-v2`): the V2 tokens and grid, the page header with
 * its framed light band, tiles, chevron links and the fusuma entrances. The home keeps its
 * own build, so it never receives this class.
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
  const inner = page !== 'home';
  const classes = [shared.root, inner ? pages.v : null, className].filter(Boolean).join(' ');
  return (
    <div className={classes} id={`ja-${page}`} data-ja-design={page} data-ja-v2={inner ? '' : undefined}>
      {children}
    </div>
  );
}

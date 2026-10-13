'use client';

import { forwardRef, type AnchorHTMLAttributes, type MouseEvent, type ReactNode } from 'react';
import type { UrlObject } from 'url';

/**
 * Drop-in replacement for `next/link` in the static-site build only (webpack alias in
 * next.config.mjs, active when NEXT_PUBLIC_STATIC_SITE=1).
 *
 * A static host cannot answer the router's RSC requests (`?_rsc=`): it returns the HTML page,
 * so every viewport prefetch would download a whole page (measured 20–70 per page on
 * 2026-10-13) and every click would fetch the page twice. A plain anchor navigates once.
 */

type Href = string | UrlObject;

type StaticLinkProps = Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'href'> & {
  href: Href;
  as?: Href;
  replace?: boolean;
  scroll?: boolean;
  shallow?: boolean;
  passHref?: boolean;
  prefetch?: boolean | 'auto' | null;
  locale?: string | false;
  legacyBehavior?: boolean;
  onNavigate?: (event: { preventDefault: () => void }) => void;
  children?: ReactNode;
};

export function formatStaticHref(href: Href): string {
  if (typeof href === 'string') return href;
  const pathname = href.pathname ?? '';
  let search = href.search ?? '';
  if (!search && href.query && typeof href.query === 'object') {
    const params = new URLSearchParams();
    for (const [key, value] of Object.entries(href.query)) {
      if (Array.isArray(value)) {
        for (const item of value) params.append(key, String(item));
      } else if (value !== undefined && value !== null) {
        params.append(key, String(value));
      }
    }
    const query = params.toString();
    search = query ? `?${query}` : '';
  }
  const hash = href.hash ? (href.hash.startsWith('#') ? href.hash : `#${href.hash}`) : '';
  return `${pathname}${search}${hash}`;
}

const StaticLink = forwardRef<HTMLAnchorElement, StaticLinkProps>(function StaticLink(
  {
    href,
    as,
    replace: _replace,
    scroll: _scroll,
    shallow: _shallow,
    passHref: _passHref,
    prefetch: _prefetch,
    locale: _locale,
    legacyBehavior: _legacyBehavior,
    onNavigate,
    onClick,
    children,
    ...anchorProps
  },
  ref,
) {
  const resolvedHref = formatStaticHref(as ?? href);
  const handleClick = (event: MouseEvent<HTMLAnchorElement>) => {
    onClick?.(event);
    if (event.defaultPrevented || !onNavigate) return;
    // Same contract as next/link: onNavigate runs only for a plain same-tab click.
    if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    if (anchorProps.target && anchorProps.target !== '_self') return;
    if (/^[a-z][a-z0-9+.-]*:/i.test(resolvedHref) && !resolvedHref.startsWith(window.location.origin)) return;
    onNavigate({ preventDefault: () => event.preventDefault() });
  };

  return (
    <a ref={ref} href={resolvedHref} onClick={handleClick} {...anchorProps}>
      {children}
    </a>
  );
});

/** next/link parity: a plain anchor never has a pending router navigation. */
export function useLinkStatus(): { pending: boolean } {
  return { pending: false };
}

export default StaticLink;

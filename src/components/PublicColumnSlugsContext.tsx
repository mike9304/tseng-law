'use client';

import { createContext, useContext, useMemo, type ReactNode } from 'react';
import type { PublicLocale8 } from '@/lib/public-guidance';

export type PublicColumnSlugsByLocale = Partial<Record<PublicLocale8, readonly string[]>>;

/**
 * WO-O22 A: the language switcher is a client component, so it cannot read
 * `src/content/columns-*` itself. The public locale layout reads the on-disk
 * slugs once (server side) and publishes them here, which lets the switcher
 * link a column detail page straight to the same article in another language —
 * and fall back to that language's column index when the article is missing,
 * instead of emitting a 404 link.
 *
 * `null` means "not provided"; the switcher then takes the conservative
 * fallback path rather than guessing an article URL.
 */
const PublicColumnSlugsContext = createContext<PublicColumnSlugsByLocale | null>(null);

export function PublicColumnSlugsProvider({
  slugsByLocale,
  children,
}: {
  slugsByLocale: PublicColumnSlugsByLocale;
  children: ReactNode;
}) {
  const value = useMemo(() => slugsByLocale, [slugsByLocale]);
  return (
    <PublicColumnSlugsContext.Provider value={value}>{children}</PublicColumnSlugsContext.Provider>
  );
}

export function usePublicColumnSlugs(): PublicColumnSlugsByLocale | null {
  return useContext(PublicColumnSlugsContext);
}

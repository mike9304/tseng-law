'use client';

import { createContext, useContext, useMemo, type ReactNode } from 'react';
import {
  columnLanguageLinksFromIndex,
  type PublicColumnLanguageIndex,
  type PublicColumnLanguageLinks,
  type PublicLocale8,
} from '@/lib/public-guidance';

type PublicColumnLanguageValue = {
  readonly index: PublicColumnLanguageIndex | null;
  readonly columnLocales: readonly PublicLocale8[];
};

/**
 * The language switchers are client components in the shared header and
 * footer, so they cannot read `src/content/columns-*` themselves. The locale
 * layout publishes which languages publish each column of its language; the
 * switchers resolve the article they are on from `usePathname()`, so the
 * server HTML and client-side navigation both list only published languages.
 */
const PublicColumnLanguageContext = createContext<PublicColumnLanguageValue | null>(null);

export function PublicColumnLanguageLinksProvider({
  index,
  columnLocales,
  children,
}: {
  index: PublicColumnLanguageIndex;
  columnLocales: readonly PublicLocale8[];
  children: ReactNode;
}) {
  const value = useMemo(() => ({ index, columnLocales }), [index, columnLocales]);
  return <PublicColumnLanguageContext.Provider value={value}>{children}</PublicColumnLanguageContext.Provider>;
}

/** Published versions of the column article at `pathname`; `null` on any other page. */
export function usePublicColumnLanguageLinks(pathname: string): PublicColumnLanguageLinks | null {
  const index = useContext(PublicColumnLanguageContext)?.index ?? null;
  return useMemo(() => columnLanguageLinksFromIndex(pathname, index), [pathname, index]);
}

/** Languages that publish at least one column. */
export function usePublicColumnLocales(): readonly PublicLocale8[] {
  return useContext(PublicColumnLanguageContext)?.columnLocales ?? [];
}

import type { Metadata } from 'next';
import { LANGUAGE_NAMED_TITLE_PATHS, SEO_PAGE_COPY } from '@/data/seo-page-copy';

function languageName(pathname: string): string | null {
  const locale = pathname.split('/')[1];
  if (!locale) return null;
  try {
    return new Intl.DisplayNames([locale], { type: 'language' }).of(locale) ?? null;
  } catch {
    return null;
  }
}

/** Adds the language's own name before the brand: `Page (polski) | Brand`. */
function addLanguageName(title: string, name: string): string {
  const brandIndex = title.lastIndexOf(' | ');
  return brandIndex < 0
    ? `${title} (${name})`
    : `${title.slice(0, brandIndex)} (${name})${title.slice(brandIndex)}`;
}

function withLanguageNamedTitle(metadata: Metadata, name: string): Metadata {
  const { title, openGraph, twitter } = metadata;
  let nextTitle = title;
  if (typeof title === 'string') {
    nextTitle = addLanguageName(title, name);
  } else if (title && 'absolute' in title && title.absolute) {
    nextTitle = { absolute: addLanguageName(title.absolute, name) };
  }
  const named = (value: unknown) => (typeof value === 'string' ? addLanguageName(value, name) : value);
  return {
    ...metadata,
    title: nextTitle,
    ...(openGraph ? { openGraph: { ...openGraph, title: named(openGraph.title) } as Metadata['openGraph'] } : {}),
    ...(twitter ? { twitter: { ...twitter, title: named(twitter.title) } as Metadata['twitter'] } : {}),
  };
}

/** Applies the reviewed search-result copy for `pathname`, leaving every other field untouched. */
export function withSeoPageCopy(metadata: Metadata, pathname: string): Metadata {
  const copy = SEO_PAGE_COPY[pathname];
  const base: Metadata = copy
    ? {
        ...metadata,
        title: { absolute: copy.title },
        description: copy.description,
        ...(metadata.openGraph
          ? { openGraph: { ...metadata.openGraph, title: copy.title, description: copy.description } }
          : {}),
        ...(metadata.twitter
          ? { twitter: { ...metadata.twitter, title: copy.title, description: copy.description } }
          : {}),
      }
    : metadata;
  if (!LANGUAGE_NAMED_TITLE_PATHS.has(pathname)) return base;
  const name = languageName(pathname);
  return name ? withLanguageNamedTitle(base, name) : base;
}

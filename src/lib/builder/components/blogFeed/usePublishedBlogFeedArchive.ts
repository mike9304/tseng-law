'use client';

import { useCallback, useEffect, useState } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';

type NavigateMode = 'push' | 'replace';

interface PublishedBlogFeedArchiveOptions {
  enabled: boolean;
  postsPerPage: number;
}

export interface PublishedBlogFeedArchiveState {
  enabled: boolean;
  page: number;
  pageSize: number;
  visibleLimit: number;
  query: string;
  category: string;
  tag: string;
  author: string;
  searchInput: string;
  setSearchInput: (value: string) => void;
  submitSearch: () => void;
  clearSearch: () => void;
  loadMore: () => void;
  setCategory: (value: string) => void;
}

function readPositiveInt(value: string | null): number {
  const parsed = Number.parseInt(value ?? '', 10);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : 1;
}

function trimValue(value: string | null): string {
  return value?.trim() ?? '';
}

function buildTargetPath(pathname: string | null, params: URLSearchParams): string {
  const query = params.toString();
  const path = pathname || '';
  return `${path}${query ? `?${query}` : ''}` || '?';
}

export function usePublishedBlogFeedArchive({
  enabled,
  postsPerPage,
}: PublishedBlogFeedArchiveOptions): PublishedBlogFeedArchiveState {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const urlQuery = trimValue(searchParams?.get('q') ?? null);
  const urlCategory = trimValue(searchParams?.get('category') ?? null);
  const urlTag = trimValue(searchParams?.get('tag') ?? null);
  const urlAuthor = trimValue(searchParams?.get('author') ?? null);
  const urlPage = readPositiveInt(searchParams?.get('page') ?? null);
  const [query, setQuery] = useState(enabled ? urlQuery : '');
  const [category, setCurrentCategory] = useState(enabled ? urlCategory : '');
  const [tag, setTag] = useState(enabled ? urlTag : '');
  const [author, setAuthor] = useState(enabled ? urlAuthor : '');
  const [page, setPage] = useState(enabled ? urlPage : 1);
  const pageSize = enabled ? Math.min(postsPerPage, 12) : postsPerPage;
  const visibleLimit = page * pageSize;
  const [searchInput, setSearchInput] = useState(query);

  useEffect(() => {
    if (!enabled) return;
    setQuery(urlQuery);
    setCurrentCategory(urlCategory);
    setTag(urlTag);
    setAuthor(urlAuthor);
    setPage(urlPage);
    setSearchInput(urlQuery);
  }, [enabled, urlAuthor, urlCategory, urlPage, urlQuery, urlTag]);

  const updateSearchParams = useCallback(
    (mutate: (next: URLSearchParams) => void, mode: NavigateMode = 'replace') => {
      if (!enabled) return;
      const next = new URLSearchParams(searchParams?.toString() ?? '');
      mutate(next);
      const target = buildTargetPath(pathname, next);
      if (typeof window !== 'undefined') {
        window.history[mode === 'push' ? 'pushState' : 'replaceState'](null, '', target);
      }
      router.replace(target, { scroll: false });
    },
    [enabled, pathname, router, searchParams],
  );

  const submitSearch = useCallback(() => {
    const trimmed = searchInput.trim();
    setQuery(trimmed);
    setPage(1);
    updateSearchParams((next) => {
      if (trimmed) next.set('q', trimmed);
      else next.delete('q');
      next.delete('page');
    });
  }, [searchInput, updateSearchParams]);

  const clearSearch = useCallback(() => {
    setSearchInput('');
    setQuery('');
    setPage(1);
    updateSearchParams((next) => {
      next.delete('q');
      next.delete('page');
    });
  }, [updateSearchParams]);

  const loadMore = useCallback(() => {
    const nextPage = page + 1;
    setPage(nextPage);
    updateSearchParams((next) => {
      next.set('page', String(nextPage));
    }, 'push');
  }, [page, updateSearchParams]);

  const setCategory = useCallback(
    (value: string) => {
      setCurrentCategory(value);
      setPage(1);
      updateSearchParams((next) => {
        if (value) next.set('category', value);
        else next.delete('category');
        next.delete('page');
      });
    },
    [updateSearchParams],
  );

  return {
    enabled,
    page,
    pageSize,
    visibleLimit,
    query,
    category,
    tag,
    author,
    searchInput,
    setSearchInput,
    submitSearch,
    clearSearch,
    loadMore,
    setCategory,
  };
}

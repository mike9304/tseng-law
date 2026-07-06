'use client';

import { useCallback, useEffect, useMemo, useState, type Dispatch, type SetStateAction } from 'react';
import { usePathname } from 'next/navigation';
import type { Locale } from '@/lib/locales';
import type {
  TranslationCategorySummary,
  TranslationManagerPayload,
  TranslationStatus,
} from '@/lib/builder/translations/types';
import { getTranslationStatus, translationStatuses } from '@/lib/builder/translations/types';
import { buildTranslationReviewSummary } from '@/lib/builder/translations/review-summary';
import { buildTranslationManagerQuery, parseTranslationTargetLocales } from '@/lib/builder/translations/query';
import type { TranslationCopy } from './translation-copy';
import type { StatusFilter } from './TranslationManagerView.types';

interface TranslationManagerFilterArgs {
  readonly initialPayload: TranslationManagerPayload;
  readonly payload: TranslationManagerPayload;
  readonly copy: TranslationCopy;
  readonly initialCategory: string;
  readonly initialSearch: string;
  readonly initialStatus: string;
  readonly initialVisibleTargets?: string;
  readonly setNotice: Dispatch<SetStateAction<string>>;
}

function isCategoryKey(
  value: string,
  categories: readonly TranslationCategorySummary[],
): value is TranslationCategorySummary['key'] {
  return categories.some((category) => category.key === value);
}

function isTranslationStatus(value: string): value is TranslationStatus {
  return translationStatuses.some((status) => status === value);
}

function parseStatusFilter(value: string): StatusFilter {
  if (value === 'all') return 'all';
  if (isTranslationStatus(value)) return value;
  return 'all';
}

export function useTranslationManagerFilters({
  initialPayload,
  payload,
  copy,
  initialCategory,
  initialSearch,
  initialStatus,
  initialVisibleTargets,
  setNotice,
}: TranslationManagerFilterArgs) {
  const pathname = usePathname();
  const [selectedCategory, setSelectedCategory] = useState<TranslationCategorySummary['key']>(() => (
    isCategoryKey(initialCategory, initialPayload.categories) ? initialCategory : 'all'
  ));
  const [statusFilter, setStatusFilter] = useState<StatusFilter>(() => parseStatusFilter(initialStatus));
  const [search, setSearch] = useState(initialSearch);
  const [visibleTargets, setVisibleTargets] = useState<Set<Locale>>(
    () => new Set(parseTranslationTargetLocales(initialVisibleTargets, initialPayload.targetLocales)),
  );

  const shownTargetLocales = useMemo(
    () => payload.targetLocales.filter((locale) => visibleTargets.has(locale)),
    [payload.targetLocales, visibleTargets],
  );

  const filteredEntries = useMemo(() => {
    const query = search.trim().toLowerCase();
    return payload.entries.filter((entry) => {
      if (selectedCategory !== 'all' && entry.content.category !== selectedCategory) return false;
      if (query) {
        const haystack = [
          entry.key,
          entry.sourceText,
          entry.content.label,
          entry.content.pageTitle,
          ...payload.targetLocales.map((locale) => entry.translations[locale]?.text ?? ''),
        ].join('\n').toLowerCase();
        if (!haystack.includes(query)) return false;
      }
      if (statusFilter !== 'all') {
        return shownTargetLocales.some((locale) => getTranslationStatus(entry, locale) === statusFilter);
      }
      return true;
    });
  }, [payload.entries, payload.targetLocales, search, selectedCategory, shownTargetLocales, statusFilter]);

  const reviewSummary = useMemo(
    () => buildTranslationReviewSummary(filteredEntries, shownTargetLocales),
    [filteredEntries, shownTargetLocales],
  );

  const reviewHref = useMemo(() => {
    if (!pathname) return '';
    const nextQuery = buildTranslationManagerQuery({
      sourceLocale: payload.sourceLocale,
      selectedCategory,
      search,
      statusFilter,
      visibleTargets: shownTargetLocales,
      allTargetLocales: payload.targetLocales,
    });
    return nextQuery ? `${pathname}?${nextQuery}` : pathname;
  }, [
    pathname,
    payload.sourceLocale,
    payload.targetLocales,
    search,
    selectedCategory,
    shownTargetLocales,
    statusFilter,
  ]);

  useEffect(() => {
    if (typeof window === 'undefined' || !pathname) return;
    const nextQuery = buildTranslationManagerQuery({
      sourceLocale: payload.sourceLocale,
      selectedCategory,
      search,
      statusFilter,
      visibleTargets: shownTargetLocales,
      allTargetLocales: payload.targetLocales,
    });
    const nextUrl = nextQuery ? `${pathname}?${nextQuery}` : pathname;
    const currentUrl = `${window.location.pathname}${window.location.search}`;
    if (currentUrl !== nextUrl) {
      window.history.replaceState(null, '', nextUrl);
    }
  }, [
    pathname,
    payload.sourceLocale,
    payload.targetLocales,
    search,
    selectedCategory,
    shownTargetLocales,
    statusFilter,
  ]);

  const resetReviewState = useCallback(() => {
    setSelectedCategory('all');
    setStatusFilter('all');
    setSearch('');
    setVisibleTargets(new Set(payload.targetLocales));
    setNotice(copy.managerReviewFiltersReset);
  }, [copy.managerReviewFiltersReset, payload.targetLocales, setNotice]);

  return {
    selectedCategory,
    setSelectedCategory,
    statusFilter,
    setStatusFilter,
    search,
    setSearch,
    visibleTargets,
    setVisibleTargets,
    shownTargetLocales,
    filteredEntries,
    reviewSummary,
    reviewHref,
    resetReviewState,
  };
}

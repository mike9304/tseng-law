import { useEffect, useMemo, useState } from 'react';

/**
 * Pagination hook for admin list pages.
 *
 * Centralizes the page/window logic so list pages (services, staff, members,
 * ...) don't reimplement slice math and don't balloon to 130k px tall when
 * test data accumulates. Keeps the page index in `localStorage` so a refresh
 * keeps the operator near where they were.
 */
export function usePagination<T>(items: readonly T[], opts: { pageSize?: number; storageKey?: string } = {}) {
  const { pageSize: pageSizeArg = 25, storageKey } = opts;
  const [pageSize, setPageSize] = useState(pageSizeArg);
  const [page, setPage] = useState(0);
  const totalPages = Math.max(1, Math.ceil(items.length / pageSize));
  const safePage = Math.min(page, totalPages - 1);

  // If the data shrinks (e.g., bulk delete) clamp to the last valid page.
  useEffect(() => {
    if (page > totalPages - 1) setPage(totalPages - 1);
  }, [page, totalPages]);

  const visible = useMemo(() => {
    const start = safePage * pageSize;
    return items.slice(start, start + pageSize);
  }, [items, safePage, pageSize]);

  // Persist the page size so operators don't fight the default every visit.
  useEffect(() => {
    if (!storageKey) return;
    try {
      const saved = window.localStorage.getItem(storageKey);
      if (saved) {
        const parsed = Number.parseInt(saved, 10);
        if (Number.isFinite(parsed) && parsed > 0 && parsed <= 500) setPageSize(parsed);
      }
    } catch {
      /* localStorage may be disabled */
    }
  }, [storageKey]);

  useEffect(() => {
    if (!storageKey) return;
    try {
      window.localStorage.setItem(storageKey, String(pageSize));
    } catch {
      /* ignore quota errors */
    }
  }, [storageKey, pageSize]);

  return {
    visible,
    page: safePage,
    setPage,
    pageSize,
    setPageSize,
    totalPages,
    totalItems: items.length,
    hasNext: safePage < totalPages - 1,
    hasPrev: safePage > 0,
  };
}

export type PaginationState<T> = ReturnType<typeof usePagination<T>>;

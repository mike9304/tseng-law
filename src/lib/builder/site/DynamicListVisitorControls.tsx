import type {
  BuilderPageDatasetFilter,
  BuilderPageDatasetSort,
} from '@/lib/builder/types';
import {
  buildVisitorQueryString,
  type VisitorPagination,
} from '@/lib/builder/datasets-visitor-filters';
import styles from './DynamicListVisitorControls.module.css';

export interface DynamicListVisitorSummaryItem {
  label: string;
  href: string;
}

export interface DynamicListVisitorSortOption {
  fieldId: string;
  direction: BuilderPageDatasetSort['direction'];
  label: string;
}

export interface DynamicListVisitorSlice {
  items: readonly unknown[];
  hasPrev: boolean;
  hasNext: boolean;
  totalPages: number;
}

export function buildDynamicListPaginationHref({
  basePath,
  searchParams,
  page,
  perPage,
}: {
  basePath: string;
  searchParams: Record<string, string | string[] | undefined> | undefined;
  page: number;
  perPage: number;
}): string {
  const params = cloneSearchParams(searchParams);
  params.set('page', String(page));
  params.set('perPage', String(perPage));
  const query = params.toString();
  return query ? `${basePath}?${query}` : basePath;
}

export function cloneSearchParams(
  input?: Record<string, string | string[] | undefined>,
): URLSearchParams {
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(input ?? {})) {
    if (Array.isArray(value)) {
      for (const item of value) {
        if (typeof item === 'string' && item) params.append(key, item);
      }
      continue;
    }
    if (typeof value === 'string' && value) {
      params.set(key, value);
    }
  }
  return params;
}

export function DynamicListVisitorControls({
  basePath,
  locale,
  pagination,
  searchParams,
  searchTerm,
  slice,
  sortOptions,
  sortQuery,
  totalRecordCount,
  visitorFilters,
  visitorFilterSummary,
}: {
  basePath: string;
  locale: string;
  pagination: VisitorPagination;
  searchParams: Record<string, string | string[] | undefined> | undefined;
  searchTerm: string;
  slice: DynamicListVisitorSlice;
  sortOptions: readonly DynamicListVisitorSortOption[];
  sortQuery: readonly BuilderPageDatasetSort[];
  totalRecordCount: number;
  visitorFilters: readonly BuilderPageDatasetFilter[];
  visitorFilterSummary: readonly DynamicListVisitorSummaryItem[];
}) {
  const clearSortHref = `${basePath}${buildVisitorQueryString({
    filters: [...visitorFilters],
    search: searchTerm,
    perPage: pagination.perPage,
  })}`;
  const clearSearchHref = `${basePath}${buildVisitorQueryString({
    filters: [...visitorFilters],
    sort: [...sortQuery],
    perPage: pagination.perPage,
  })}`;
  const searchHiddenParams = cloneSearchParams(searchParams);
  searchHiddenParams.delete('q');
  searchHiddenParams.delete('page');

  return (
    <>
      <form
        aria-label="Dynamic list visitor search"
        data-builder-dynamic-list-search="true"
        method="get"
        action={basePath}
        className={styles.toolbar}
      >
        <strong className={styles.strongLabel}>Search</strong>
        <label className={styles.searchLabel}>
          <input
            type="search"
            name="q"
            defaultValue={searchTerm}
            aria-label="Search records"
            placeholder={locale === 'ko' ? '기록 검색' : 'Search records'}
            className={styles.searchInput}
          />
        </label>
        {Array.from(searchHiddenParams.entries()).map(([name, value], index) => (
          <input key={`${name}-${index}`} type="hidden" name={name} value={value} />
        ))}
        <button type="submit" className={styles.secondaryButton}>
          Search
        </button>
        {searchTerm ? (
          <a href={clearSearchHref} className={styles.secondaryLink}>
            Clear search
          </a>
        ) : null}
      </form>
      {sortOptions.length > 0 ? (
        <div
          aria-label="Dynamic list sort"
          data-builder-dynamic-list-sort="true"
          className={`${styles.toolbar} ${styles.compactToolbar}`}
        >
          <strong className={styles.strongLabel}>Sort by</strong>
          <a href={clearSortHref} className={styles.compactLink}>
            Default order
          </a>
          {sortOptions.map((option) => {
            const activeSort = sortQuery[0];
            const isActive = Boolean(activeSort)
              && activeSort.fieldId === option.fieldId
              && activeSort.direction === option.direction;
            const sortItem: BuilderPageDatasetSort = {
              fieldId: option.fieldId,
              direction: option.direction,
            };
            const sortHref = `${basePath}${buildVisitorQueryString({
              filters: [...visitorFilters],
              search: searchTerm,
              sort: [sortItem],
              perPage: pagination.perPage,
            })}`;
            return (
              <a
                key={`${option.fieldId}:${option.direction}`}
                href={sortHref}
                aria-current={isActive ? 'page' : undefined}
                className={isActive ? `${styles.compactLink} ${styles.compactActiveLink}` : styles.compactLink}
              >
                {option.label}
              </a>
            );
          })}
        </div>
      ) : null}
      {visitorFilterSummary.length > 0 ? (
        <div
          aria-label="Dynamic list visitor filters"
          data-builder-dynamic-list-visitor-filters="true"
          className={`${styles.toolbar} ${styles.compactToolbar}`}
        >
          <strong className={styles.strongLabel}>Active filters</strong>
          {visitorFilterSummary.map((summary) => (
            <a key={summary.label} href={summary.href} className={styles.filterChip}>
              {summary.label}
            </a>
          ))}
          <a href={basePath} className={styles.compactLink}>
            Clear filters
          </a>
        </div>
      ) : null}
      <nav
        aria-label="Dynamic list pagination"
        data-builder-dynamic-list-pagination="true"
        className={`${styles.toolbar} ${styles.compactToolbar}`}
      >
        <span className={styles.paginationCurrent}>
          {pagination.page} / {slice.totalPages}
        </span>
        <span className={styles.paginationSummary}>
          Showing {slice.items.length} of {totalRecordCount} items
        </span>
        {slice.hasPrev ? (
          <a
            href={buildDynamicListPaginationHref({
              basePath,
              searchParams,
              page: pagination.page - 1,
              perPage: pagination.perPage,
            })}
            className={styles.secondaryLink}
          >
            Previous
          </a>
        ) : null}
        {slice.hasNext ? (
          <a
            href={buildDynamicListPaginationHref({
              basePath,
              searchParams,
              page: pagination.page + 1,
              perPage: pagination.perPage,
            })}
            className={styles.primaryLink}
          >
            Next
          </a>
        ) : null}
      </nav>
    </>
  );
}

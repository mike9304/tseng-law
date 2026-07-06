'use client';

import { type FormEvent } from 'react';
import { DEFAULT_BLOG_CATEGORIES } from '@/lib/builder/blog/blog-engine';
import type { Locale } from '@/lib/locales';
import styles from './BlogFeed.module.css';

interface ArchiveCopy {
  searchLabel: string;
  searchPlaceholder: string;
  submit: string;
  clear: string;
  all: string;
  loadMore: string;
  remaining: string;
  resultCount: (count: number) => string;
}

interface PublishedBlogFeedArchiveControlsProps {
  locale: Locale;
  query: string;
  category: string;
  searchInput: string;
  totalCount: number;
  setSearchInput: (value: string) => void;
  submitSearch: () => void;
  clearSearch: () => void;
  setCategory: (value: string) => void;
}

interface PublishedBlogFeedArchivePaginationProps {
  locale: Locale;
  remainingCount: number;
  loadMore: () => void;
}

const ARCHIVE_COPY: Record<Locale, ArchiveCopy> = {
  ko: {
    searchLabel: '칼럼 검색',
    searchPlaceholder: '제목, 요약, 태그로 검색',
    submit: '검색',
    clear: '검색 지우기',
    all: '전체',
    loadMore: '더 보기',
    remaining: '개 더 있음',
    resultCount: (count) => `${count}개 결과`,
  },
  'zh-hant': {
    searchLabel: '搜尋專欄',
    searchPlaceholder: '依標題、摘要或標籤搜尋',
    submit: '搜尋',
    clear: '清除搜尋',
    all: '全部',
    loadMore: '載入更多',
    remaining: ' 篇待載入',
    resultCount: (count) => `${count} 篇結果`,
  },
  en: {
    searchLabel: 'Search columns',
    searchPlaceholder: 'Search title, summary or tag',
    submit: 'Search',
    clear: 'Clear search',
    all: 'All',
    loadMore: 'Load more',
    remaining: ' more available',
    resultCount: (count) => `${count} result${count === 1 ? '' : 's'}`,
  },
};

function getCategoryOptions(locale: Locale): Array<{ value: string; label: string }> {
  return [
    { value: '', label: ARCHIVE_COPY[locale].all },
    ...DEFAULT_BLOG_CATEGORIES.map((category) => ({
      value: category.slug,
      label: category.name[locale] ?? category.name.en ?? category.slug,
    })),
  ];
}

export function PublishedBlogFeedArchiveControls({
  locale,
  query,
  category,
  searchInput,
  totalCount,
  setSearchInput,
  submitSearch,
  clearSearch,
  setCategory,
}: PublishedBlogFeedArchiveControlsProps) {
  const copy = ARCHIVE_COPY[locale];

  return (
    <div className={styles.archiveControls}>
      <form
        className={`${styles.archiveSearch} columns-search`}
        role="search"
        data-columns-search="true"
        onSubmit={(event: FormEvent<HTMLFormElement>) => {
          event.preventDefault();
          submitSearch();
        }}
      >
        <label className={`${styles.archiveSearchLabel} columns-search-label`} htmlFor="builder-columns-search-input">
          {copy.searchLabel}
        </label>
        <div className={`${styles.archiveSearchRow} columns-search-row`}>
          <input
            id="builder-columns-search-input"
            type="search"
            value={searchInput}
            onChange={(event) => setSearchInput(event.target.value)}
            placeholder={copy.searchPlaceholder}
            className={`${styles.archiveSearchInput} columns-search-input`}
            data-columns-search-input="true"
          />
          <button type="submit" className={`${styles.archiveButton} columns-search-submit`}>
            {copy.submit}
          </button>
          {query ? (
            <button
              type="button"
              className={`${styles.archiveButton} ${styles.archiveButtonSecondary} columns-search-clear`}
              onClick={clearSearch}
              data-columns-search-clear="true"
            >
              {copy.clear}
            </button>
          ) : null}
        </div>
        {query ? (
          <p className={`${styles.archiveStatus} columns-search-status`} data-columns-search-results={totalCount}>
            {copy.resultCount(totalCount)}
          </p>
        ) : null}
      </form>
      <div className={`${styles.archiveFilters} columns-filters`}>
        {getCategoryOptions(locale).map((option) => {
          const active = category === option.value;
          return (
            <button
              key={option.value || 'all'}
              type="button"
              className={[
                styles.archiveFilterButton,
                'columns-filter-btn',
                active ? `${styles.archiveFilterButtonActive} active` : '',
              ].filter(Boolean).join(' ')}
              onClick={() => setCategory(option.value)}
            >
              {option.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export function PublishedBlogFeedArchivePagination({
  locale,
  remainingCount,
  loadMore,
}: PublishedBlogFeedArchivePaginationProps) {
  if (remainingCount <= 0) return null;
  const copy = ARCHIVE_COPY[locale];

  return (
    <div className={`${styles.archivePagination} columns-pagination`} data-columns-remaining={remainingCount}>
      <button
        type="button"
        className={`${styles.archiveLoadMore} columns-load-more`}
        onClick={loadMore}
        data-columns-load-more="true"
      >
        {copy.loadMore}
        <span className={styles.archiveLoadMoreMeta}>
          ({remainingCount}
          {copy.remaining})
        </span>
      </button>
    </div>
  );
}

'use client';

import { useEffect, useMemo, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import type { SiteLocale } from '@/lib/locales';

const searchCopy = {
  ko: {
    label: '칼럼 검색',
    placeholder: '제목, 요약, 태그로 검색',
    submit: '검색',
    clear: '검색 지우기',
    resultCount: (n: number) => `${n}개 결과`,
  },
  'zh-hant': {
    label: '搜尋專欄',
    placeholder: '依標題、摘要或標籤搜尋',
    submit: '搜尋',
    clear: '清除搜尋',
    resultCount: (n: number) => `${n} 篇結果`,
  },
  en: {
    label: 'Search columns',
    placeholder: 'Search title, summary or tag',
    submit: 'Search',
    clear: 'Clear search',
    resultCount: (n: number) => `${n} result${n === 1 ? '' : 's'}`,
  },
  ja: {
    label: 'コラム検索',
    placeholder: 'タイトル・要約・タグで検索',
    submit: '検索',
    clear: '検索をクリア',
    resultCount: (n: number) => `${n}件`,
  },
} as const;

type ColumnCategory = 'formation' | 'legal' | 'case';

export interface ColumnListItem {
  slug: string;
  title: string;
  date: string;
  dateDisplay: string;
  readTime: string;
  category: ColumnCategory;
  categoryLabel: string;
  blogCategory?: string;
  authorName?: string;
  tags?: string[];
  featuredImage: string;
  summary: string;
}

export interface ColumnsGridFilters {
  category?: string;
  author?: string;
  q?: string;
  year?: string;
  month?: string;
}

const categoryLabels = {
  ko: { all: '전체', formation: '법인설립', legal: '법률정보', case: '소송사례' },
  'zh-hant': { all: '全部', formation: '公司設立', legal: '法律資訊', case: '訴訟案例' },
  en: { all: 'All', formation: 'Company Setup', legal: 'Legal Info', case: 'Case Studies' },
  ja: { all: 'すべて', formation: '台湾会社設立', legal: '台湾法律情報', case: '訴訟事例分析' },
} as const;

function normalizeFilterValue(value: string | string[] | null | undefined): string {
  return Array.isArray(value) ? value[0] ?? '' : value ?? '';
}

function postMatchesQuery(post: ColumnListItem, query: string): boolean {
  if (!query) return true;
  const normalized = query.toLowerCase();
  return [
    post.title,
    post.summary,
    post.categoryLabel,
    post.blogCategory,
    post.authorName,
    ...(post.tags ?? []),
  ].filter(Boolean).join(' ').toLowerCase().includes(normalized);
}

export default function ColumnsGrid({
  locale,
  posts,
  initialFilters = {},
}: {
  locale: SiteLocale;
  posts: ColumnListItem[];
  initialFilters?: ColumnsGridFilters;
}) {
  const labels = categoryLabels[locale];
  const byline =
    locale === 'ko'
      ? '증준외 변호사 검토'
      : locale === 'zh-hant'
        ? '曾雋崴律師審閱'
        : locale === 'ja'
          ? '曾雋崴弁護士監修'
          : 'Reviewed by Wei Tseng';
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const requestedCategory = normalizeFilterValue(searchParams ? searchParams.get('category') : initialFilters.category);
  const requestedAuthor = normalizeFilterValue(searchParams ? searchParams.get('author') : initialFilters.author);
  const requestedQuery = normalizeFilterValue(searchParams ? searchParams.get('q') : initialFilters.q);
  const requestedYear = normalizeFilterValue(searchParams ? searchParams.get('year') : initialFilters.year);
  const requestedMonth = normalizeFilterValue(searchParams ? searchParams.get('month') : initialFilters.month);
  const initialActive = requestedCategory === 'formation' || requestedCategory === 'legal' || requestedCategory === 'case'
    ? requestedCategory
    : 'all';
  const [active, setActive] = useState<ColumnCategory | 'all'>(initialActive);
  const [searchInput, setSearchInput] = useState(requestedQuery);
  const [appliedQuery, setAppliedQuery] = useState(requestedQuery);
  const searchLabels = searchCopy[locale];

  useEffect(() => {
    setSearchInput(requestedQuery);
    setAppliedQuery(requestedQuery);
  }, [requestedQuery]);

  useEffect(() => {
    if (requestedCategory === 'formation' || requestedCategory === 'legal' || requestedCategory === 'case') {
      setActive(requestedCategory);
      return;
    }
    if (requestedCategory) setActive('all');
  }, [requestedCategory]);

  const updateUrlSearchParams = (mutate: (next: URLSearchParams) => void, navigation: 'push' | 'replace' = 'replace') => {
    const next = new URLSearchParams(searchParams?.toString() ?? '');
    mutate(next);
    const target = pathname ? `${pathname}${next.toString() ? `?${next.toString()}` : ''}` : '';
    if (typeof window !== 'undefined') {
      window.history[navigation === 'push' ? 'pushState' : 'replaceState'](null, '', target || '?');
    }
    router.replace(target || '?', { scroll: false });
  };

  const updateSearchParam = (nextQuery: string) => {
    const trimmed = nextQuery.trim();
    setAppliedQuery(trimmed);
    updateUrlSearchParams((next) => {
      if (trimmed) {
        next.set('q', trimmed);
      } else {
        next.delete('q');
      }
      next.delete('page');
    });
  };
  const filtered = useMemo(
    () =>
      posts.filter((post) => {
        const categoryMatches = requestedCategory
          ? post.blogCategory === requestedCategory || post.category === requestedCategory
          : active === 'all' || post.category === active;
        if (!categoryMatches) return false;
        if (requestedAuthor && post.authorName !== requestedAuthor) return false;
        if (requestedYear && !post.date.startsWith(requestedYear)) return false;
        if (requestedMonth) {
          const month = post.date.slice(5, 7).replace(/^0/, '');
          if (month !== requestedMonth.replace(/^0/, '')) return false;
        }
        return postMatchesQuery(post, appliedQuery);
      }),
    [active, appliedQuery, posts, requestedAuthor, requestedCategory, requestedMonth, requestedYear],
  );

  const cats: { id: ColumnCategory | 'all'; label: string }[] = [
    { id: 'all', label: labels.all },
    { id: 'formation', label: labels.formation },
    { id: 'legal', label: labels.legal },
    { id: 'case', label: labels.case },
  ];

  return (
    <section className="section section--light">
      <div className="container">
        <form
          className="columns-search"
          role="search"
          data-columns-search="true"
          onSubmit={(event) => {
            event.preventDefault();
            updateSearchParam(searchInput);
          }}
        >
          <label className="columns-search-label" htmlFor="columns-search-input">
            {searchLabels.label}
          </label>
          <div className="columns-search-row">
            <input
              id="columns-search-input"
              type="search"
              value={searchInput}
              onChange={(event) => setSearchInput(event.target.value)}
              placeholder={searchLabels.placeholder}
              className="columns-search-input"
              data-columns-search-input="true"
            />
            <button type="submit" className="columns-search-submit">
              {searchLabels.submit}
            </button>
            {appliedQuery ? (
              <button
                type="button"
                className="columns-search-clear"
                onClick={() => {
                  setSearchInput('');
                  updateSearchParam('');
                }}
                data-columns-search-clear="true"
              >
                {searchLabels.clear}
              </button>
            ) : null}
          </div>
          {appliedQuery ? (
            <p className="columns-search-status" data-columns-search-results={filtered.length}>
              {searchLabels.resultCount(filtered.length)}
            </p>
          ) : null}
        </form>
        <div className="columns-filters">
          {cats.map((cat) => (
            <button
              key={cat.id}
              onClick={() => {
                setActive(cat.id);
                updateUrlSearchParams((next) => {
                  next.delete('page');
                });
              }}
              disabled={Boolean(requestedCategory || requestedAuthor || appliedQuery || requestedYear || requestedMonth)}
              className={`columns-filter-btn ${active === cat.id ? 'active' : ''}`}
            >
              {cat.label}
            </button>
          ))}
        </div>
        <div className="columns-grid" data-columns-visible-count={filtered.length}>
          {filtered.map((post) => (
            <Link key={post.slug} href={`/${locale}/columns/${post.slug}`} className="columns-card">
              <div className="columns-card-img">
                <Image src={post.featuredImage} alt={post.title} width={600} height={340} style={{ objectFit: 'cover', width: '100%', height: '100%' }} />
                <div className="columns-card-image-overlay" />
                <div className="columns-card-image-meta">
                  <span className="columns-category-badge columns-category-badge--image">{post.categoryLabel}</span>
                  {post.dateDisplay ? <time className="columns-card-datechip">{post.dateDisplay}</time> : null}
                </div>
              </div>
              <div className="columns-card-body">
                <div className="columns-card-meta">
                  <span className="columns-card-byline">{post.authorName || byline}</span>
                  {post.readTime ? <span className="columns-readtime-inline">{post.readTime}</span> : null}
                </div>
                <h3 className="columns-card-title">{post.title}</h3>
                <p className="columns-card-summary">{post.summary}</p>
                <span className="columns-card-linkhint">
                  {locale === 'ko' ? '칼럼 보기 →' : locale === 'zh-hant' ? '查看專欄 →' : locale === 'ja' ? 'コラムを読む →' : 'Open column →'}
                </span>
              </div>
            </Link>
          ))}
        </div>
        {filtered.length === 0 && (
          <p className="columns-empty">
            {appliedQuery
              ? locale === 'ko'
                ? '검색 결과가 없습니다.'
                : locale === 'zh-hant'
                  ? '沒有符合的搜尋結果。'
                  : locale === 'ja'
                    ? '検索結果がありません。'
                    : 'No results match your search.'
              : locale === 'ko'
                ? '해당 카테고리의 글이 없습니다.'
                : locale === 'zh-hant'
                  ? '此分類尚無文章。'
                  : locale === 'ja'
                    ? 'このカテゴリーにはまだ記事がありません。'
                    : 'No posts in this category yet.'}
          </p>
        )}
      </div>
    </section>
  );
}

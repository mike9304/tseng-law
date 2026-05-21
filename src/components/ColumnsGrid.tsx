'use client';

import { useEffect, useMemo, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import type { Locale } from '@/lib/locales';

const COLUMNS_PAGE_SIZE = 12;

const loadMoreLabels = {
  ko: { button: '더 보기', remaining: '개 더 있음' },
  'zh-hant': { button: '載入更多', remaining: ' 篇待載入' },
  en: { button: 'Load more', remaining: ' more available' },
} as const;

type ColumnCategory = 'formation' | 'legal' | 'case';

interface ColumnListItem {
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

interface ColumnsGridFilters {
  category?: string;
  author?: string;
  q?: string;
  year?: string;
  month?: string;
}

const categoryLabels = {
  ko: { all: '전체', formation: '법인설립', legal: '법률정보', case: '소송사례' },
  'zh-hant': { all: '全部', formation: '公司設立', legal: '法律資訊', case: '訴訟案例' },
  en: { all: 'All', formation: 'Company Setup', legal: 'Legal Info', case: 'Case Studies' }
} as const;

function normalizeFilterValue(value: string | string[] | undefined): string {
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
  locale: Locale;
  posts: ColumnListItem[];
  initialFilters?: ColumnsGridFilters;
}) {
  const labels = categoryLabels[locale];
  const byline = locale === 'ko' ? '증준외 변호사 검토' : locale === 'zh-hant' ? '曾俊瑋律師審閱' : 'Reviewed by Wei Tseng';
  const requestedCategory = normalizeFilterValue(initialFilters.category);
  const requestedAuthor = normalizeFilterValue(initialFilters.author);
  const requestedQuery = normalizeFilterValue(initialFilters.q);
  const requestedYear = normalizeFilterValue(initialFilters.year);
  const requestedMonth = normalizeFilterValue(initialFilters.month);
  const initialActive = requestedCategory === 'formation' || requestedCategory === 'legal' || requestedCategory === 'case'
    ? requestedCategory
    : 'all';
  const [active, setActive] = useState<ColumnCategory | 'all'>(initialActive);
  const [visibleCount, setVisibleCount] = useState(COLUMNS_PAGE_SIZE);
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
        return postMatchesQuery(post, requestedQuery);
      }),
    [active, posts, requestedAuthor, requestedCategory, requestedMonth, requestedQuery, requestedYear],
  );

  // Reset pagination whenever the filter result set changes so the user
  // doesn't see "Load more" jump from page 3 to page 1 silently after
  // toggling a category chip.
  useEffect(() => {
    setVisibleCount(COLUMNS_PAGE_SIZE);
  }, [active, requestedAuthor, requestedCategory, requestedMonth, requestedQuery, requestedYear]);

  const visiblePosts = filtered.slice(0, visibleCount);
  const remainingCount = Math.max(0, filtered.length - visibleCount);
  const loadMoreCopy = loadMoreLabels[locale];

  const cats: { id: ColumnCategory | 'all'; label: string }[] = [
    { id: 'all', label: labels.all },
    { id: 'formation', label: labels.formation },
    { id: 'legal', label: labels.legal },
    { id: 'case', label: labels.case },
  ];

  return (
    <section className="section section--light">
      <div className="container">
        <div className="columns-filters">
          {cats.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActive(cat.id)}
              disabled={Boolean(requestedCategory || requestedAuthor || requestedQuery || requestedYear || requestedMonth)}
              className={`columns-filter-btn ${active === cat.id ? 'active' : ''}`}
            >
              {cat.label}
            </button>
          ))}
        </div>
        <div className="columns-grid" data-columns-visible-count={visiblePosts.length}>
          {visiblePosts.map((post) => (
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
                  {locale === 'ko' ? '칼럼 보기 →' : locale === 'zh-hant' ? '查看專欄 →' : 'Open column →'}
                </span>
              </div>
            </Link>
          ))}
        </div>
        {filtered.length === 0 && (
          <p className="columns-empty">
            {locale === 'ko' ? '해당 카테고리의 글이 없습니다.' : locale === 'zh-hant' ? '此分類尚無文章。' : 'No posts in this category yet.'}
          </p>
        )}
        {remainingCount > 0 ? (
          <div className="columns-pagination" data-columns-remaining={remainingCount}>
            <button
              type="button"
              className="columns-load-more"
              onClick={() => setVisibleCount((value) => value + COLUMNS_PAGE_SIZE)}
              data-columns-load-more="true"
            >
              {loadMoreCopy.button}
              <span className="columns-load-more-meta">
                ({remainingCount}
                {loadMoreCopy.remaining})
              </span>
            </button>
          </div>
        ) : null}
      </div>
    </section>
  );
}

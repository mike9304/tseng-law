'use client';

import { useEffect, useMemo, useState } from 'react';
import Image from 'next/image';
import type { Locale } from '@/lib/locales';
import SectionLabel from '@/components/SectionLabel';
import OrnamentDivider from '@/components/OrnamentDivider';
import SmartLink from '@/components/SmartLink';

interface ArchivePost {
  slug: string;
  title: string;
  date: string;
  dateDisplay: string;
  readTime: string;
  categoryLabel: string;
  featuredImage: string;
  summary: string;
}

const copyByLocale = {
  ko: {
    label: 'INSIGHTS',
    title: '칼럼 아카이브',
    description: '실제 수집된 칼럼 본문과 이미지를 기반으로 주요 글을 바로 확인할 수 있습니다.',
    readMore: '자세히 보기',
    dateFallback: '게시일 확인중',
    prevLabel: '이전',
    nextLabel: '다음',
    viewAll: '모든 칼럼 보기',
  },
  'zh-hant': {
    label: 'INSIGHTS',
    title: '專欄精選',
    description: '以下內容直接對應已整理的專欄原文與圖片素材。',
    readMore: '閱讀全文',
    dateFallback: '日期待確認',
    prevLabel: '上一頁',
    nextLabel: '下一頁',
    viewAll: '查看所有專欄',
  },
  en: {
    label: 'INSIGHTS',
    title: 'Column Archive',
    description: 'Browse key posts prepared from curated legal columns and source images.',
    readMore: 'Read more',
    dateFallback: 'Date pending',
    prevLabel: 'Previous',
    nextLabel: 'Next',
    viewAll: 'View all columns'
  },
} as const;

export default function InsightsArchiveSection({
  locale,
  posts,
}: {
  locale: Locale;
  posts: ArchivePost[];
}) {
  const copy = copyByLocale[locale];
  const [featured, ...rest] = posts;
  const listItems = rest;
  const pageSize = 3;
  const pageCount = Math.max(1, Math.ceil(listItems.length / pageSize));
  const [page, setPage] = useState(0);
  const visibleItems = useMemo(
    () => listItems.slice(page * pageSize, page * pageSize + pageSize),
    [listItems, page, pageSize]
  );

  useEffect(() => {
    setPage(0);
  }, [locale]);

  if (!featured) return null;

  return (
    <section className="section section--gray" id="insights" data-tone="light">
      <div className="container">
        <SectionLabel>{copy.label}</SectionLabel>
        <h2 className="section-title">{copy.title}</h2>
        <p className="section-lede">{copy.description}</p>
        <OrnamentDivider />
        <div className="insights-grid reveal-stagger">
          <article className="insights-featured">
            <div className="insights-featured-media">
              <Image src={featured.featuredImage} alt={featured.title} width={920} height={540} />
              <span className="insights-category-badge">{featured.categoryLabel}</span>
            </div>
            <div className="insights-featured-body">
              <div className="insights-meta-row">
                <time className="insights-date">{featured.dateDisplay || featured.date || copy.dateFallback}</time>
                {featured.readTime ? <span className="insights-readtime">{featured.readTime}</span> : null}
              </div>
              <h3 className="insights-featured-title">{featured.title}</h3>
              <p className="insights-featured-summary">{featured.summary}</p>
              <SmartLink className="link-underline" href={`/${locale}/columns/${featured.slug}`}>
                {copy.readMore} →
              </SmartLink>
            </div>
          </article>
          <div className="insights-list-wrap">
            {pageCount > 1 ? (
              <div className="insights-controls">
                <button
                  type="button"
                  className="insights-nav-btn"
                  aria-label={copy.prevLabel}
                  onClick={() => setPage((current) => (current - 1 + pageCount) % pageCount)}
                >
                  ‹ {copy.prevLabel}
                </button>
                <span className="insights-page-indicator">
                  {page + 1} / {pageCount}
                </span>
                <button
                  type="button"
                  className="insights-nav-btn"
                  aria-label={copy.nextLabel}
                  onClick={() => setPage((current) => (current + 1) % pageCount)}
                >
                  {copy.nextLabel} ›
                </button>
              </div>
            ) : null}
            <div className="insights-list" key={`page-${page}`}>
              {visibleItems.map((post) => (
                <article key={post.slug} className="insights-list-item">
                  <div className="insights-meta-row">
                    <time className="insights-date">{post.dateDisplay || post.date || copy.dateFallback}</time>
                    <span className="tag">{post.categoryLabel}</span>
                  </div>
                  <h4 className="insights-list-title">
                    <SmartLink className="link-underline" href={`/${locale}/columns/${post.slug}`}>
                      {post.title}
                    </SmartLink>
                  </h4>
                  <p className="insights-list-summary">{post.summary}</p>
                </article>
              ))}
            </div>
          </div>
        </div>
        <div style={{ marginTop: '2rem', textAlign: 'center' }}>
          <SmartLink className="button button--outline" href={`/${locale}/columns`}>
            {copy.viewAll} →
          </SmartLink>
        </div>
      </div>
    </section>
  );
}

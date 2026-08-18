'use client';

import { useEffect, useId, useMemo, useState } from 'react';
import Image from 'next/image';
import type { SiteLocale } from '@/lib/locales';
import SectionLabel from '@/components/SectionLabel';
import OrnamentDivider from '@/components/OrnamentDivider';
import SmartLink from '@/components/SmartLink';
import { getAttorneyProfilePath } from '@/data/attorney-profiles';
import {
  homeInsightsButtonSurfaceIds,
  homeInsightsImageSurfaceIds,
  homeInsightsTextSurfaceIds,
} from '@/lib/builder/registry';
import { SurfaceText } from '@/lib/builder/surface-context';

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

/**
 * A real, tracked editorial image with a Taiwan-law visual language. It is used
 * for incomplete legacy records instead of exposing a generic placeholder in
 * the published archive.
 */
export const INSIGHTS_IMAGE_FALLBACK =
  '/images/blog/016-taiwan-inheritance-custody-analysis/featured-generic.webp';

export function resolveInsightsImageSrc(src?: string | null): string {
  const normalized = src?.trim() ?? '';
  if (!normalized || /(?:^|\/)placeholder(?:[-./]|$)/i.test(normalized)) {
    return INSIGHTS_IMAGE_FALLBACK;
  }
  return normalized;
}

function parseInsightsDateValue(source: string): number {
  const parts = source.match(/(\d{4})\D+(\d{1,2})\D+(\d{1,2})/);
  if (parts) {
    const [, year, month, day] = parts;
    return Date.UTC(Number(year), Number(month) - 1, Number(day));
  }

  const parsed = Date.parse(source);
  return Number.isNaN(parsed) ? Number.NEGATIVE_INFINITY : parsed;
}

function resolveInsightsDateValue(post: Pick<ArchivePost, 'date' | 'dateDisplay'>): number {
  const displayValue = parseInsightsDateValue(post.dateDisplay.trim());
  return Number.isFinite(displayValue)
    ? displayValue
    : parseInsightsDateValue(post.date.trim());
}

function resolveInsightsDateTime(post: Pick<ArchivePost, 'date' | 'dateDisplay'>): string | undefined {
  const value = resolveInsightsDateValue(post);
  return Number.isFinite(value) ? new Date(value).toISOString().slice(0, 10) : undefined;
}

export function sortInsightsPostsNewestFirst(posts: readonly ArchivePost[]): ArchivePost[] {
  return posts
    .map((post, index) => ({ post, index, dateValue: resolveInsightsDateValue(post) }))
    .sort((a, b) => (b.dateValue - a.dateValue) || (a.index - b.index))
    .map(({ post }) => post);
}

function InsightsPostImage({
  src,
  alt,
  width,
  height,
  surfaceKey,
}: {
  src?: string | null;
  alt: string;
  width: number;
  height: number;
  surfaceKey: string;
}) {
  const resolvedSrc = resolveInsightsImageSrc(src);
  const [imageSrc, setImageSrc] = useState(resolvedSrc);

  useEffect(() => {
    setImageSrc(resolvedSrc);
  }, [resolvedSrc]);

  return (
    <Image
      src={imageSrc}
      alt={alt}
      width={width}
      height={height}
      data-builder-surface-key={surfaceKey}
      onError={() => {
        if (imageSrc !== INSIGHTS_IMAGE_FALLBACK) {
          setImageSrc(INSIGHTS_IMAGE_FALLBACK);
        }
      }}
    />
  );
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
    carouselLabel: '최신 칼럼',
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
    carouselLabel: '最新專欄',
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
    carouselLabel: 'Latest columns',
    viewAll: 'View all columns'
  },
  ja: {
    label: 'INSIGHTS',
    title: 'コラムアーカイブ',
    description: '実務に役立つ台湾法務コラムを厳選して掲載しています。',
    readMore: '続きを読む',
    dateFallback: '日付確認中',
    prevLabel: '前へ',
    nextLabel: '次へ',
    carouselLabel: '最新コラム',
    viewAll: 'すべてのコラムを見る',
  },
} as const;

export default function InsightsArchiveSection({
  locale,
  posts,
}: {
  locale: SiteLocale;
  posts: ArchivePost[];
}) {
  const copy = copyByLocale[locale];
  const authorLabel =
    locale === 'ko'
      ? '증준외 변호사 검토'
      : locale === 'zh-hant'
        ? '曾雋崴律師審閱'
        : locale === 'ja'
          ? '曾雋崴弁護士監修'
          : 'Reviewed by Wei Tseng';
  const authorHref = getAttorneyProfilePath(locale);
  const sortedPosts = useMemo(() => sortInsightsPostsNewestFirst(posts), [posts]);
  const [featured, ...rest] = sortedPosts;
  const listItems = rest;
  const pageSize = 3;
  const pageCount = Math.max(1, Math.ceil(listItems.length / pageSize));
  const [page, setPage] = useState(0);
  const listId = useId();
  const visibleItems = useMemo(
    () => listItems.slice(page * pageSize, page * pageSize + pageSize),
    [listItems, page]
  );

  useEffect(() => {
    setPage(0);
  }, [locale, posts]);

  if (!featured) return null;

  return (
    <section className="section section--gray" id="insights" data-tone="light">
      <div className="container">
        <div data-builder-node-key="header">
          <SectionLabel data-builder-surface-key={homeInsightsTextSurfaceIds[0]}>
            <SurfaceText surfaceKey={homeInsightsTextSurfaceIds[0]}>{copy.label}</SurfaceText>
          </SectionLabel>
          <h2 className="section-title" data-builder-surface-key={homeInsightsTextSurfaceIds[1]}>
            <SurfaceText surfaceKey={homeInsightsTextSurfaceIds[1]}>{copy.title}</SurfaceText>
          </h2>
          <p className="section-lede" data-builder-surface-key={homeInsightsTextSurfaceIds[2]}>
            <SurfaceText surfaceKey={homeInsightsTextSurfaceIds[2]}>{copy.description}</SurfaceText>
          </p>
        </div>
        <OrnamentDivider />
        <div
          className="insights-grid"
          data-builder-node-key="feed"
          role="region"
          aria-roledescription="carousel"
          aria-label={copy.carouselLabel}
        >
          <article className="insights-featured">
            <div className="insights-featured-media">
              <InsightsPostImage
                src={featured.featuredImage}
                alt={featured.title}
                width={920}
                height={540}
                surfaceKey={homeInsightsImageSurfaceIds[0]}
              />
              <span className="insights-category-badge">{featured.categoryLabel}</span>
            </div>
            <div className="insights-featured-body">
              <div className="insights-meta-row">
                <time className="insights-date" dateTime={resolveInsightsDateTime(featured)}>
                  {featured.dateDisplay || featured.date || copy.dateFallback}
                </time>
                {featured.readTime ? <span className="insights-readtime">{featured.readTime}</span> : null}
              </div>
              <SmartLink className="insights-byline" href={authorHref}>
                {authorLabel}
              </SmartLink>
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
                  aria-controls={listId}
                  onClick={() => setPage((current) => (current - 1 + pageCount) % pageCount)}
                >
                  ‹ {copy.prevLabel}
                </button>
                <span className="insights-page-indicator" aria-live="polite" aria-atomic="true">
                  {page + 1} / {pageCount}
                </span>
                <button
                  type="button"
                  className="insights-nav-btn"
                  aria-label={copy.nextLabel}
                  aria-controls={listId}
                  onClick={() => setPage((current) => (current + 1) % pageCount)}
                >
                  {copy.nextLabel} ›
                </button>
              </div>
            ) : null}
            <div
              className="insights-list"
              id={listId}
              key={`page-${page}`}
              aria-live="polite"
              aria-label={`${copy.carouselLabel} ${page + 1} / ${pageCount}`}
            >
              {visibleItems.map((post, index) => (
                <article key={post.slug} className="insights-list-item">
                  <div className="insights-list-thumb">
                    <InsightsPostImage
                      src={post.featuredImage}
                      alt={post.title}
                      width={240}
                      height={160}
                      surfaceKey={homeInsightsImageSurfaceIds[index + 1]}
                    />
                    <span className="insights-category-badge insights-category-badge--compact">{post.categoryLabel}</span>
                  </div>
                  <div className="insights-list-copy">
                    <div className="insights-meta-row">
                      <time className="insights-date" dateTime={resolveInsightsDateTime(post)}>
                        {post.dateDisplay || post.date || copy.dateFallback}
                      </time>
                      {post.readTime ? <span className="insights-readtime">{post.readTime}</span> : null}
                    </div>
                    <SmartLink className="insights-byline" href={authorHref}>
                      {authorLabel}
                    </SmartLink>
                    <h4 className="insights-list-title">
                      <SmartLink className="link-underline" href={`/${locale}/columns/${post.slug}`}>
                        {post.title}
                      </SmartLink>
                    </h4>
                    <p className="insights-list-summary">{post.summary}</p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </div>
        <div style={{ marginTop: '2rem', textAlign: 'center' }} data-builder-node-key="footer">
          <SmartLink
            className="button button--outline"
            href={`/${locale}/columns`}
            data-builder-surface-key={homeInsightsButtonSurfaceIds[0]}
          >
            {copy.viewAll} →
          </SmartLink>
        </div>
      </div>
    </section>
  );
}

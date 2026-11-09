'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Suspense, useEffect, useMemo, useState } from 'react';
import {
  SEMICONDUCTOR_BOARD_SUBTOPICS,
  SEMICONDUCTOR_SUBTOPIC_LABELS,
  type SemiconductorBoardSubtopic,
} from '@/data/semiconductor-board-subtopics';
import {
  buildSemiconductorBoardHref,
  countSemiconductorSubtopics,
  parseSemiconductorSubtopic,
  type SemiconductorBoardCard,
} from '@/lib/semiconductor-board-client';
import { IS_STATIC_SITE } from '@/lib/static-site';
import type { SiteLocale } from '@/lib/locales';
import filterStyles from './SemiconductorBoard.module.css';

const FILTER_COPY: Record<
  SiteLocale,
  { legend: string; all: string; resultCount: (n: number) => string }
> = {
  ko: {
    legend: '주제별 보기',
    all: '전체',
    resultCount: (n) => `${n}개 칼럼`,
  },
  'zh-hant': {
    legend: '依主題瀏覽',
    all: '全部',
    resultCount: (n) => `${n} 篇專欄`,
  },
  en: {
    legend: 'Browse by topic',
    all: 'All',
    resultCount: (n) => `${n} column${n === 1 ? '' : 's'}`,
  },
  ja: {
    legend: 'テーマで絞り込む',
    all: 'すべて',
    resultCount: (n) => `コラム ${n} 件`,
  },
};

export function semiconductorCardVisible(
  dataSubtopics: string,
  active: SemiconductorBoardSubtopic | null,
): boolean {
  if (!active) return true;
  return dataSubtopics.split(/\s+/).filter(Boolean).includes(active);
}

function SemiconductorBoardClientInner({
  locale,
  cards,
  columnsHeading,
  readMore,
}: {
  locale: SiteLocale;
  cards: readonly SemiconductorBoardCard[];
  columnsHeading: string;
  readMore: string;
}) {
  const liveSearchParams = useSearchParams();
  const [urlFiltersReady, setUrlFiltersReady] = useState(!IS_STATIC_SITE);
  useEffect(() => {
    if (IS_STATIC_SITE) setUrlFiltersReady(true);
  }, []);
  const searchParams = urlFiltersReady ? liveSearchParams : null;
  const activeSubtopic = parseSemiconductorSubtopic(searchParams?.get('subtopic') ?? undefined);

  const slugCounts = useMemo(() => {
    const posts = cards.map((c) => ({ slug: c.slug }));
    return countSemiconductorSubtopics(posts);
  }, [cards]);

  const visibleCards = useMemo(
    () => cards.filter((card) => semiconductorCardVisible(card.subtopics, activeSubtopic)),
    [cards, activeSubtopic],
  );

  const filterCopy = FILTER_COPY[locale];
  const subtopicLabels = SEMICONDUCTOR_SUBTOPIC_LABELS[locale];

  return (
    <>
      <nav className={filterStyles.filters} aria-label={filterCopy.legend}>
        <p className={filterStyles.legend} id="semiconductor-subtopics">
          {filterCopy.legend}
        </p>
        <ul className={filterStyles.chips} aria-labelledby="semiconductor-subtopics">
          <li>
            <a
              className={filterStyles.chip}
              href={buildSemiconductorBoardHref(locale, null)}
              aria-current={activeSubtopic ? undefined : 'true'}
            >
              {filterCopy.all}{' '}
              <span className={filterStyles.chipCount}>{cards.length}</span>
            </a>
          </li>
          {SEMICONDUCTOR_BOARD_SUBTOPICS.map((id) => {
            const count = slugCounts.get(id) ?? 0;
            if (count === 0) return null;
            return (
              <li key={id}>
                <a
                  className={filterStyles.chip}
                  href={buildSemiconductorBoardHref(locale, id)}
                  aria-current={activeSubtopic === id ? 'true' : undefined}
                >
                  {subtopicLabels[id]}{' '}
                  <span className={filterStyles.chipCount}>{count}</span>
                </a>
              </li>
            );
          })}
        </ul>
        <p className={filterStyles.resultCount} aria-live="polite">
          {filterCopy.resultCount(visibleCards.length)}
        </p>
      </nav>

      <h2 className="svc-keypoints-title">{columnsHeading}</h2>
      <div
        className="svc-columns-grid"
        data-semiconductor-subtopic={activeSubtopic ?? 'all'}
      >
        {cards.map((post) => {
          const hidden = !semiconductorCardVisible(post.subtopics, activeSubtopic);
          return (
            <Link
              key={post.slug}
              href={`/${locale}/columns/${post.slug}`}
              className="svc-col-card"
              data-semiconductor-public-column={post.slug}
              data-subtopics={post.subtopics}
              hidden={hidden || undefined}
              aria-hidden={hidden || undefined}
            >
              <span className="svc-col-badge">{post.badge}</span>
              <h3 className="svc-col-card-title">{post.title}</h3>
              <p className="svc-col-card-summary">{post.summary}</p>
              <span className="svc-col-card-link">{readMore}</span>
            </Link>
          );
        })}
      </div>
    </>
  );
}

export default function SemiconductorBoardClient(props: {
  locale: SiteLocale;
  cards: readonly SemiconductorBoardCard[];
  columnsHeading: string;
  readMore: string;
}) {
  return (
    <Suspense fallback={null}>
      <SemiconductorBoardClientInner {...props} />
    </Suspense>
  );
}

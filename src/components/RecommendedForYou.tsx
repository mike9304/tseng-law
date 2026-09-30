'use client';

import { useEffect, useMemo, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  captureLanding,
  hasTopicSignals,
  personalizeOrder,
  recordColumnView,
} from '@/lib/reading-signals';

export type RecommendedItem = {
  slug: string;
  title: string;
  featuredImage: string;
  topic?: string;
  dateDisplay?: string;
  readTime?: string;
};

const HEADING: Record<string, string> = {
  ko: '함께 읽을 글',
  en: 'Related reading',
  ja: 'あわせて読みたい記事',
  'zh-hant': '延伸閱讀',
  'zh-hans': '为您推荐',
  vi: 'Gợi ý cho bạn',
  id: 'Rekomendasi untuk Anda',
  th: 'แนะนำสำหรับคุณ',
  fil: 'Inirerekomenda para sa iyo',
  de: 'Empfehlungen für Sie',
  es: 'Recomendado para usted',
  fr: 'Recommandé pour vous',
};

/**
 * "Recommended for you". The server renders the static locale recommendations
 * (what crawlers and first-time visitors see). After hydration the same slots
 * are reordered by this session's reading signals (sessionStorage only); the
 * number and size of cards never change, so there is no layout shift.
 */
export default function RecommendedForYou({
  locale,
  hrefBase,
  items,
  count = 3,
  currentSlug,
  currentTopic,
  preserveOrder = false,
}: {
  locale: string;
  /** e.g. `/ko/columns` */
  hrefBase: string;
  /** Static order, already excluding cards shown elsewhere on the page. */
  items: readonly RecommendedItem[];
  count?: number;
  /** Set on a column page: records the view and excludes the column itself. */
  currentSlug?: string;
  currentTopic?: string;
  /** Keep editorial subject relevance ahead of session interests. */
  preserveOrder?: boolean;
}) {
  const pool = useMemo(() => items.filter((item) => item.slug !== currentSlug), [items, currentSlug]);
  const [ordered, setOrdered] = useState<readonly RecommendedItem[] | null>(null);

  useEffect(() => {
    if (preserveOrder) return;
    const signals = currentSlug ? recordColumnView(currentSlug, currentTopic) : captureLanding();
    if (!hasTopicSignals(signals) && signals.viewed.length === 0) return;
    setOrdered(personalizeOrder(pool, signals));
  }, [pool, currentSlug, currentTopic, preserveOrder]);

  const visible = (preserveOrder ? pool : ordered ?? pool).slice(0, count);
  if (visible.length === 0) return null;
  const heading = HEADING[locale] ?? HEADING.en;

  return (
    <section
      className="recommended-for-you"
      aria-label={heading}
      data-recommended-for-you={currentSlug ? 'column' : 'home'}
      data-personalized={!preserveOrder && ordered ? 'true' : 'false'}
    >
      <h2 className="recommended-for-you-title">{heading}</h2>
      <ul className="recommended-for-you-grid">
        {visible.map((item) => (
          <li key={item.slug} className="recommended-for-you-card" data-topic={item.topic}>
            <Image src={item.featuredImage} alt="" width={96} height={64} sizes="96px" loading="lazy" />
            <div>
              <h3 className="recommended-for-you-card-title">
                <Link className="card-stretched-link" href={`${hrefBase}/${item.slug}`}>
                  {item.title}
                </Link>
              </h3>
              {item.dateDisplay || item.readTime ? (
                <p className="recommended-for-you-card-meta">
                  {[item.dateDisplay, item.readTime].filter(Boolean).join(' · ')}
                </p>
              ) : null}
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}

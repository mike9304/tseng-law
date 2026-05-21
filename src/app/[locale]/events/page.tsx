import type { Metadata } from 'next';
import Link from 'next/link';
import {
  DEFAULT_EVENT_CATEGORIES,
  filterEventsByLocale,
  filterEventsByStatus,
  filterEventsByTime,
  listEvents,
  sortEvents,
} from '@/lib/builder/events/events-engine';
import { normalizeLocale, type Locale } from '@/lib/locales';
import { buildSeoMetadata } from '@/lib/seo';
import styles from './EventsPublic.module.css';

export const dynamic = 'force-dynamic';

const copy: Record<Locale, { title: string; description: string; eyebrow: string; empty: string }> = {
  ko: {
    title: '이벤트',
    description: '대만 법률 세미나, 웨비나, 상담회 일정을 확인하고 신청하세요.',
    eyebrow: 'Events',
    empty: '현재 공개된 이벤트가 없습니다.',
  },
  'zh-hant': {
    title: '活動',
    description: '查看台灣法律研討會、線上講座與諮詢活動。',
    eyebrow: 'Events',
    empty: '目前沒有公開活動。',
  },
  en: {
    title: 'Events',
    description: 'Browse Taiwan law seminars, webinars, and consultation events.',
    eyebrow: 'Events',
    empty: 'No public events are available.',
  },
};

export function generateMetadata({ params }: { params: { locale: Locale } }): Metadata {
  const locale = normalizeLocale(params.locale);
  return buildSeoMetadata({
    locale,
    title: copy[locale].title,
    description: copy[locale].description,
    path: '/events',
    noindex: locale === 'en',
  });
}

function categoryLabel(category: string, locale: Locale): string {
  return DEFAULT_EVENT_CATEGORIES.find((item) => item.id === category)?.name[locale] ?? category;
}

export default async function EventsPage({ params }: { params: { locale: Locale } }) {
  const locale = normalizeLocale(params.locale);
  const events = sortEvents(
    filterEventsByTime(
      filterEventsByStatus(filterEventsByLocale(await listEvents(), locale), 'published'),
      'upcoming',
    ),
    'date-asc',
  );

  return (
    <main className={styles.page} data-public-events-page="true">
      <section className={styles.hero}>
        <div className={styles.inner}>
          <p className={styles.eyebrow}>{copy[locale].eyebrow}</p>
          <h1>{copy[locale].title}</h1>
          <p>{copy[locale].description}</p>
        </div>
      </section>

      {events.length === 0 ? (
        <div className={styles.empty}>{copy[locale].empty}</div>
      ) : (
        <section className={`${styles.inner} ${styles.list}`} aria-label={copy[locale].title}>
          {events.map((event) => (
            <Link key={event.eventId} className={styles.card} href={`/${locale}/events/${event.slug}`} data-public-event-card={event.eventId}>
              <span className={styles.badge}>{categoryLabel(event.category, locale)}</span>
              <strong>{event.title}</strong>
              <span>{event.date} {event.time} · {event.location}</span>
              <p>{event.description}</p>
            </Link>
          ))}
        </section>
      )}
    </main>
  );
}

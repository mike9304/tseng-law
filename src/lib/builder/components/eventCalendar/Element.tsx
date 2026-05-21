'use client';

import { useEffect, useMemo, useState } from 'react';
import type { BuilderEventCalendarCanvasNode } from '@/lib/builder/canvas/types';
import type { BuilderEvent, CalendarMonth } from '@/lib/builder/events/events-shared';
import { groupEventsByMonth } from '@/lib/builder/events/events-shared';
import { normalizeLocale, type Locale } from '@/lib/locales';
import styles from './EventCalendar.module.css';

interface EventCalendarElementProps {
  node: BuilderEventCalendarCanvasNode;
  mode?: 'edit' | 'preview' | 'published';
  locale?: Locale;
}

const MOCK_EVENTS: BuilderEvent[] = [
  {
    eventId: 'evt-calendar-1',
    slug: 'visa-workshop',
    title: '비자 실무 워크샵',
    description: '취업허가와 거류증 실무를 다룹니다.',
    date: '2026-06-12',
    time: '15:00',
    location: '타이베이 오피스',
    capacity: 25,
    registeredCount: 9,
    category: 'workshop',
    locale: 'ko',
    status: 'published',
    rsvpEnabled: true,
    ticketType: 'free',
    ticketPriceTwd: 0,
    ticketCurrency: 'TWD',
    createdAt: '2026-05-20T00:00:00.000Z',
    updatedAt: '2026-05-20T00:00:00.000Z',
  },
  {
    eventId: 'evt-calendar-2',
    slug: 'contract-webinar',
    title: '계약 리스크 웨비나',
    description: '국제계약 주요 조항을 검토합니다.',
    date: '2026-07-03',
    time: '11:00',
    location: 'Online',
    capacity: 80,
    registeredCount: 20,
    category: 'webinar',
    locale: 'ko',
    status: 'published',
    rsvpEnabled: true,
    ticketType: 'paid',
    ticketPriceTwd: 500,
    ticketCurrency: 'TWD',
    createdAt: '2026-05-20T00:00:00.000Z',
    updatedAt: '2026-05-20T00:00:00.000Z',
  },
];

function monthLabel(yearMonth: string): string {
  const [year, month] = yearMonth.split('-');
  return `${year}.${month}`;
}

export default function EventCalendarElement({ node, mode = 'edit', locale }: EventCalendarElementProps) {
  const c = node.content;
  const isBuilder = mode !== 'published';
  const effectiveLocale = normalizeLocale(locale || 'ko');
  const [events, setEvents] = useState<BuilderEvent[] | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let cancelled = false;
    setEvents(null);
    setLoading(!isBuilder);
    const params = new URLSearchParams({
      locale: effectiveLocale,
      scope: isBuilder ? 'all' : 'public',
      status: isBuilder ? 'all' : 'published',
      time: c.showPast ? 'all' : 'upcoming',
      sort: 'date-asc',
      limit: '100',
    });
    if (c.category) params.set('category', c.category);

    fetch(`/api/builder/events?${params.toString()}`)
      .then((response) => response.json())
      .then((json) => {
        if (!cancelled && json?.ok && Array.isArray(json.events)) setEvents(json.events as BuilderEvent[]);
      })
      .catch(() => undefined)
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [c.category, c.showPast, effectiveLocale, isBuilder]);

  const months = useMemo<CalendarMonth[]>(() => {
    const source = events ?? (isBuilder ? MOCK_EVENTS : []);
    return groupEventsByMonth(source).slice(0, c.months);
  }, [c.months, events, isBuilder]);

  if (!isBuilder && loading) {
    return <div className={styles.state} data-builder-event-calendar="true" role="status">Loading calendar...</div>;
  }

  if (months.length === 0) {
    return <div className={styles.state} data-builder-event-calendar="true">표시할 이벤트가 없습니다.</div>;
  }

  return (
    <section className={styles.root} data-builder-event-calendar="true">
      {months.map((month) => (
        <article key={month.yearMonth} className={styles.month}>
          <h3>{monthLabel(month.yearMonth)}</h3>
          <div className={styles.events}>
            {month.events.map((event) => {
              const href = isBuilder ? '#' : `/${effectiveLocale}/events/${event.slug}`;
              const remaining = Math.max(0, event.capacity - event.registeredCount);
              return (
                <a key={event.eventId} className={styles.event} href={href} data-builder-event-calendar-item={event.eventId}>
                  <time>{event.date.slice(8, 10)}일 {event.time}</time>
                  <strong>{event.title}</strong>
                  <span>{event.location}</span>
                  {c.showCapacity ? <small>{remaining} / {event.capacity} seats</small> : null}
                </a>
              );
            })}
          </div>
        </article>
      ))}
    </section>
  );
}

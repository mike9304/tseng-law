'use client';

import { useEffect, useMemo, useState } from 'react';
import type { BuilderEventCalendarCanvasNode } from '@/lib/builder/canvas/types';
import type { BuilderEvent, CalendarMonth } from '@/lib/builder/events/events-shared';
import { groupEventsByMonth } from '@/lib/builder/events/events-shared';
import { normalizeLocale, type Locale } from '@/lib/locales';
import { WidgetDataDisclosure } from '../_shared/WidgetDataDisclosure';
import { getEventWidgetsCopy } from '../event-widgets-copy';
import styles from './EventCalendar.module.css';

interface EventCalendarElementProps {
  node: BuilderEventCalendarCanvasNode;
  mode?: 'edit' | 'preview' | 'published';
  locale?: Locale;
}

function monthLabel(yearMonth: string): string {
  const [year, month] = yearMonth.split('-');
  return `${year}.${month}`;
}

export default function EventCalendarElement({ node, mode = 'edit', locale }: EventCalendarElementProps) {
  const c = node.content;
  const isBuilder = mode !== 'published';
  const effectiveLocale = normalizeLocale(locale || 'ko');
  const copy = getEventWidgetsCopy(effectiveLocale);
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
    const source = events ?? (isBuilder ? copy.mockEvents.calendar : []);
    return groupEventsByMonth(source).slice(0, c.months);
  }, [c.months, copy.mockEvents.calendar, events, isBuilder]);

  if (!isBuilder && loading) {
    return <div className={styles.state} data-builder-event-calendar="true" role="status">{copy.loadingCalendar}</div>;
  }

  if (months.length === 0) {
    return <div className={styles.state} data-builder-event-calendar="true">{copy.empty}</div>;
  }

  return (
    <section className={styles.root} data-builder-event-calendar="true">
      {isBuilder ? <WidgetDataDisclosure locale={effectiveLocale} /> : null}
      {months.map((month) => (
        <article key={month.yearMonth} className={styles.month}>
          <h3>{monthLabel(month.yearMonth)}</h3>
          <div className={styles.events}>
            {month.events.map((event) => {
              const href = isBuilder ? '#' : `/${effectiveLocale}/events/${event.slug}`;
              const remaining = Math.max(0, event.capacity - event.registeredCount);
              return (
                <a key={event.eventId} className={styles.event} href={href} data-builder-event-calendar-item={event.eventId}>
                  <time>{copy.calendarTime(event.date.slice(8, 10), event.time)}</time>
                  <strong>{event.title}</strong>
                  <span>{event.location}</span>
                  {c.showCapacity ? <small>{copy.seats(remaining, event.capacity)}</small> : null}
                </a>
              );
            })}
          </div>
        </article>
      ))}
    </section>
  );
}

'use client';

import { useEffect, useMemo, useState, type CSSProperties } from 'react';
import type { BuilderEventListCanvasNode } from '@/lib/builder/canvas/types';
import type { BuilderEvent } from '@/lib/builder/events/events-shared';
import { DEFAULT_EVENT_CATEGORIES } from '@/lib/builder/events/events-shared';
import { normalizeLocale, type Locale } from '@/lib/locales';
import { getEventWidgetsCopy } from '../event-widgets-copy';
import styles from './EventList.module.css';

interface EventListElementProps {
  node: BuilderEventListCanvasNode;
  mode?: 'edit' | 'preview' | 'published';
  locale?: Locale;
}

type RootStyle = CSSProperties & {
  '--event-list-columns': string;
};

function categoryLabel(category: string, locale: Locale): string {
  return DEFAULT_EVENT_CATEGORIES.find((item) => item.id === category)?.name[locale] ?? category;
}

function formatDate(event: BuilderEvent): string {
  return `${event.date} ${event.time}`;
}

function ticketLabel(event: BuilderEvent, copy: ReturnType<typeof getEventWidgetsCopy>): string {
  if (event.ticketType === 'free') return copy.free;
  return `${event.ticketCurrency} ${event.ticketPriceTwd.toLocaleString()}`;
}

export default function EventListElement({ node, mode = 'edit', locale }: EventListElementProps) {
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
      time: c.timeFilter,
      sort: c.timeFilter === 'past' ? 'date-desc' : 'date-asc',
      limit: String(c.limit),
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
  }, [c.category, c.limit, c.timeFilter, effectiveLocale, isBuilder]);

  const items = useMemo(() => {
    const source = events ?? (isBuilder ? copy.mockEvents.list : []);
    return source.slice(0, c.limit);
  }, [c.limit, copy.mockEvents.list, events, isBuilder]);

  if (!isBuilder && loading) {
    return <div className={styles.state} data-builder-event-list="true" role="status">{copy.loadingList}</div>;
  }

  if (items.length === 0) {
    return <div className={styles.state} data-builder-event-list="true">{copy.empty}</div>;
  }

  const rootStyle: RootStyle = {
    '--event-list-columns': String(Math.max(1, Math.min(4, c.columns))),
  };

  return (
    <section
      className={`${styles.root} ${c.layout === 'list' ? styles.listLayout : styles.cardLayout}`}
      data-builder-event-list="true"
      style={rootStyle}
    >
      {items.map((event) => {
        const href = isBuilder ? '#' : `/${effectiveLocale}/events/${event.slug}`;
        const remaining = Math.max(0, event.capacity - event.registeredCount);
        return (
          <article key={event.eventId} className={styles.card} data-builder-event-card={event.eventId}>
            <a className={styles.cardMain} href={href}>
              <span className={styles.badge}>{categoryLabel(event.category, effectiveLocale)}</span>
              <strong>{event.title}</strong>
              <span className={styles.meta}>{formatDate(event)} · {event.location}</span>
              {c.showDescription ? <span className={styles.description}>{event.description}</span> : null}
            </a>
            <div className={styles.footer}>
              {c.showCapacity ? (
                <span className={styles.capacity}>{copy.seats(remaining, event.capacity)}</span>
              ) : <span />}
              <span className={styles.ticket}>{ticketLabel(event, copy)}</span>
              {c.showRsvp && event.rsvpEnabled ? (
                <a className={styles.cta} href={href}>{copy.rsvp}</a>
              ) : null}
            </div>
          </article>
        );
      })}
    </section>
  );
}

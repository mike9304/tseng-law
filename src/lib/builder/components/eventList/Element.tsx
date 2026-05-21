'use client';

import { useEffect, useMemo, useState, type CSSProperties } from 'react';
import type { BuilderEventListCanvasNode } from '@/lib/builder/canvas/types';
import type { BuilderEvent } from '@/lib/builder/events/events-shared';
import { DEFAULT_EVENT_CATEGORIES } from '@/lib/builder/events/events-shared';
import { normalizeLocale, type Locale } from '@/lib/locales';
import styles from './EventList.module.css';

interface EventListElementProps {
  node: BuilderEventListCanvasNode;
  mode?: 'edit' | 'preview' | 'published';
  locale?: Locale;
}

type RootStyle = CSSProperties & {
  '--event-list-columns': string;
};

const MOCK_EVENTS: BuilderEvent[] = [
  {
    eventId: 'evt-mock-seminar',
    slug: 'taiwan-company-seminar',
    title: '대만 회사설립 세미나',
    description: '외국인 투자자가 대만 법인을 설립할 때 확인해야 할 절차와 리스크를 정리합니다.',
    date: '2026-06-18',
    time: '14:00',
    location: '타이베이 오피스',
    capacity: 40,
    registeredCount: 12,
    category: 'seminar',
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
    eventId: 'evt-mock-webinar',
    slug: 'labor-law-webinar',
    title: '대만 노동법 웨비나',
    description: '채용, 해고, 퇴직금, 시간외 수당 쟁점을 사례 중심으로 봅니다.',
    date: '2026-07-02',
    time: '10:30',
    location: 'Online',
    capacity: 100,
    registeredCount: 28,
    category: 'webinar',
    locale: 'ko',
    status: 'published',
    rsvpEnabled: true,
    ticketType: 'paid',
    ticketPriceTwd: 800,
    ticketCurrency: 'TWD',
    createdAt: '2026-05-20T00:00:00.000Z',
    updatedAt: '2026-05-20T00:00:00.000Z',
  },
];

function categoryLabel(category: string, locale: Locale): string {
  return DEFAULT_EVENT_CATEGORIES.find((item) => item.id === category)?.name[locale] ?? category;
}

function formatDate(event: BuilderEvent): string {
  return `${event.date} ${event.time}`;
}

function ticketLabel(event: BuilderEvent): string {
  if (event.ticketType === 'free') return '무료';
  return `${event.ticketCurrency} ${event.ticketPriceTwd.toLocaleString()}`;
}

export default function EventListElement({ node, mode = 'edit', locale }: EventListElementProps) {
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
    const source = events ?? (isBuilder ? MOCK_EVENTS : []);
    return source.slice(0, c.limit);
  }, [c.limit, events, isBuilder]);

  if (!isBuilder && loading) {
    return <div className={styles.state} data-builder-event-list="true" role="status">Loading events...</div>;
  }

  if (items.length === 0) {
    return <div className={styles.state} data-builder-event-list="true">표시할 이벤트가 없습니다.</div>;
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
                <span className={styles.capacity}>{remaining} / {event.capacity} seats</span>
              ) : <span />}
              <span className={styles.ticket}>{ticketLabel(event)}</span>
              {c.showRsvp && event.rsvpEnabled ? (
                <a className={styles.cta} href={href}>{effectiveLocale === 'ko' ? '신청' : 'RSVP'}</a>
              ) : null}
            </div>
          </article>
        );
      })}
    </section>
  );
}

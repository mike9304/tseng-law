'use client';

import { FormEvent, useEffect, useMemo, useState } from 'react';
import type { BuilderEventRsvpCanvasNode } from '@/lib/builder/canvas/types';
import type { BuilderEvent } from '@/lib/builder/events/events-shared';
import { normalizeLocale, type Locale } from '@/lib/locales';
import styles from './EventRsvp.module.css';

interface EventRsvpElementProps {
  node: BuilderEventRsvpCanvasNode;
  mode?: 'edit' | 'preview' | 'published';
  locale?: Locale;
}

const MOCK_EVENT: BuilderEvent = {
  eventId: 'evt-rsvp-mock',
  slug: 'mock-rsvp-event',
  title: '대만 법률 세미나',
  description: '이벤트 신청 폼 미리보기입니다.',
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
};

function ticketLabel(event: BuilderEvent): string {
  if (event.ticketType === 'free') return '무료 RSVP';
  return `${event.ticketCurrency} ${event.ticketPriceTwd.toLocaleString()} · 결제 확인 대기`;
}

export default function EventRsvpElement({ node, mode = 'edit', locale }: EventRsvpElementProps) {
  const c = node.content;
  const isBuilder = mode !== 'published';
  const effectiveLocale = normalizeLocale(locale || 'ko');
  const [events, setEvents] = useState<BuilderEvent[] | null>(null);
  const [pending, setPending] = useState(false);
  const [message, setMessage] = useState<string>('');

  useEffect(() => {
    let cancelled = false;
    setEvents(null);
    const params = new URLSearchParams({
      locale: effectiveLocale,
      scope: isBuilder ? 'all' : 'public',
      status: isBuilder ? 'all' : 'published',
      time: 'upcoming',
      sort: 'date-asc',
      limit: '20',
    });
    fetch(`/api/builder/events?${params.toString()}`)
      .then((response) => response.json())
      .then((json) => {
        if (!cancelled && json?.ok && Array.isArray(json.events)) setEvents(json.events as BuilderEvent[]);
      })
      .catch(() => undefined);
    return () => {
      cancelled = true;
    };
  }, [effectiveLocale, isBuilder]);

  const selectedEvent = useMemo(() => {
    const source = events ?? (isBuilder ? [MOCK_EVENT] : []);
    return source.find((event) => event.eventId === c.eventId) ?? source[0] ?? null;
  }, [c.eventId, events, isBuilder]);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!selectedEvent || isBuilder) {
      setMessage('미리보기에서는 신청이 저장되지 않습니다.');
      return;
    }
    setPending(true);
    setMessage('');
    const formElement = event.currentTarget;
    const form = new FormData(formElement);
    const payload = {
      name: String(form.get('name') ?? ''),
      email: String(form.get('email') ?? ''),
      phone: String(form.get('phone') ?? ''),
      ticketQuantity: Number(form.get('ticketQuantity') ?? 1),
    };
    try {
      const response = await fetch(`/api/builder/events/${encodeURIComponent(selectedEvent.eventId)}/rsvp`, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const json = await response.json();
      if (!response.ok || !json?.ok) throw new Error(json?.error || '신청을 저장하지 못했습니다.');
      setMessage(c.successMessage);
      formElement.reset();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : '신청을 저장하지 못했습니다.');
    } finally {
      setPending(false);
    }
  }

  if (!selectedEvent) {
    return <div className={styles.state} data-builder-event-rsvp="true">신청 가능한 이벤트가 없습니다.</div>;
  }

  const remaining = Math.max(0, selectedEvent.capacity - selectedEvent.registeredCount);
  const disabled = pending || !selectedEvent.rsvpEnabled || remaining <= 0;

  return (
    <section className={styles.root} data-builder-event-rsvp="true">
      <div className={styles.summary}>
        <span>{selectedEvent.date} {selectedEvent.time}</span>
        <strong>{selectedEvent.title}</strong>
        <small>{selectedEvent.location}</small>
        {c.showTicketInfo ? <em>{ticketLabel(selectedEvent)} · {remaining} seats left</em> : null}
      </div>
      <form className={styles.form} onSubmit={submit}>
        <h3>{c.title}</h3>
        <label>
          이름
          <input name="name" required disabled={pending} />
        </label>
        <label>
          이메일
          <input name="email" type="email" required disabled={pending} />
        </label>
        <label>
          전화번호
          <input name="phone" disabled={pending} />
        </label>
        <label>
          신청 인원
          <input name="ticketQuantity" type="number" min={1} max={20} defaultValue={1} disabled={pending} />
        </label>
        <button type="submit" disabled={disabled}>
          {pending ? '신청 중...' : remaining <= 0 ? '마감' : '신청하기'}
        </button>
        {message ? <p className={styles.message} role="status">{message}</p> : null}
      </form>
    </section>
  );
}

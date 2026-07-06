'use client';

import { FormEvent, useEffect, useMemo, useState } from 'react';
import type { BuilderEventRsvpCanvasNode } from '@/lib/builder/canvas/types';
import type { BuilderEvent } from '@/lib/builder/events/events-shared';
import { normalizeLocale, type Locale } from '@/lib/locales';
import { EVENT_RSVP_LEGACY_DEFAULTS, getEventWidgetsCopy, localizedEventWidgetText } from '../event-widgets-copy';
import styles from './EventRsvp.module.css';

interface EventRsvpElementProps {
  node: BuilderEventRsvpCanvasNode;
  mode?: 'edit' | 'preview' | 'published';
  locale?: Locale;
}

function ticketLabel(event: BuilderEvent, copy: ReturnType<typeof getEventWidgetsCopy>): string {
  if (event.ticketType === 'free') return copy.rsvpForm.freeTicket;
  return copy.rsvpForm.paidTicket(event.ticketCurrency, event.ticketPriceTwd);
}

export default function EventRsvpElement({ node, mode = 'edit', locale }: EventRsvpElementProps) {
  const c = node.content;
  const isBuilder = mode !== 'published';
  const effectiveLocale = normalizeLocale(locale || 'ko');
  const copy = getEventWidgetsCopy(effectiveLocale);
  const title = localizedEventWidgetText(c.title, copy.rsvpForm.defaultTitle, EVENT_RSVP_LEGACY_DEFAULTS.title);
  const successMessage = localizedEventWidgetText(
    c.successMessage,
    copy.rsvpForm.defaultSuccessMessage,
    EVENT_RSVP_LEGACY_DEFAULTS.successMessage,
  );
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
    const source = events ?? (isBuilder ? [copy.mockEvents.rsvp] : []);
    return source.find((event) => event.eventId === c.eventId) ?? source[0] ?? null;
  }, [c.eventId, copy.mockEvents.rsvp, events, isBuilder]);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!selectedEvent || isBuilder) {
      setMessage(copy.rsvpForm.previewMessage);
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
      const params = new URLSearchParams({ locale: effectiveLocale });
      const response = await fetch(`/api/builder/events/${encodeURIComponent(selectedEvent.eventId)}/rsvp?${params.toString()}`, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const json = await response.json();
      if (!response.ok || !json?.ok) throw new Error(json?.error || copy.rsvpForm.saveError);
      setMessage(successMessage);
      formElement.reset();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : copy.rsvpForm.saveError);
    } finally {
      setPending(false);
    }
  }

  if (!selectedEvent) {
    return <div className={styles.state} data-builder-event-rsvp="true">{copy.rsvpForm.noEvents}</div>;
  }

  const remaining = Math.max(0, selectedEvent.capacity - selectedEvent.registeredCount);
  const disabled = pending || !selectedEvent.rsvpEnabled || remaining <= 0;

  return (
    <section className={styles.root} data-builder-event-rsvp="true">
      <div className={styles.summary}>
        <span>{selectedEvent.date} {selectedEvent.time}</span>
        <strong>{selectedEvent.title}</strong>
        <small>{selectedEvent.location}</small>
        {c.showTicketInfo ? <em>{ticketLabel(selectedEvent, copy)} · {copy.rsvpForm.seatsLeft(remaining)}</em> : null}
      </div>
      <form className={styles.form} onSubmit={submit}>
        <h3>{title}</h3>
        <label>
          {copy.rsvpForm.name}
          <input name="name" required disabled={pending} />
        </label>
        <label>
          {copy.rsvpForm.email}
          <input name="email" type="email" required disabled={pending} />
        </label>
        <label>
          {copy.rsvpForm.phone}
          <input name="phone" disabled={pending} />
        </label>
        <label>
          {copy.rsvpForm.quantity}
          <input name="ticketQuantity" type="number" min={1} max={20} defaultValue={1} disabled={pending} />
        </label>
        <button type="submit" disabled={disabled}>
          {pending ? copy.rsvpForm.submitting : remaining <= 0 ? copy.rsvpForm.soldOut : copy.rsvpForm.submit}
        </button>
        {message ? <p className={styles.message} role="status">{message}</p> : null}
      </form>
    </section>
  );
}

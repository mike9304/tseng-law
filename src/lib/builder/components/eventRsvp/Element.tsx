'use client';

import { FormEvent, useEffect, useLayoutEffect, useRef, useState } from 'react';
import type { BuilderEventRsvpCanvasNode } from '@/lib/builder/canvas/types';
import type { BuilderEvent } from '@/lib/builder/events/events-shared';
import { normalizeLocale, type Locale } from '@/lib/locales';
import { WidgetDataDisclosure } from '../_shared/WidgetDataDisclosure';
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

type LoadState =
  | { status: 'loading' | 'unavailable' | 'error' }
  | { status: 'ready'; event: BuilderEvent };

type OwnedProps = EventRsvpElementProps & { eventId: string; effectiveLocale: Locale; isBuilder: boolean };

function isEvent(value: unknown): value is BuilderEvent {
  if (!value || typeof value !== 'object') return false;
  const event = value as Record<string, unknown>;
  return ['eventId', 'slug', 'title', 'description', 'location', 'category', 'createdAt', 'updatedAt']
    .every((key) => typeof event[key] === 'string')
    && typeof event.date === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(event.date)
    && typeof event.time === 'string' && /^\d{2}:\d{2}$/.test(event.time)
    && typeof event.locale === 'string' && ['ko', 'zh-hant', 'en'].includes(event.locale)
    && typeof event.status === 'string' && ['draft', 'published', 'cancelled'].includes(event.status)
    && typeof event.rsvpEnabled === 'boolean'
    && typeof event.capacity === 'number' && Number.isFinite(event.capacity) && event.capacity >= 1
    && typeof event.registeredCount === 'number' && Number.isFinite(event.registeredCount) && event.registeredCount >= 0
    && typeof event.ticketType === 'string' && ['free', 'paid'].includes(event.ticketType)
    && typeof event.ticketPriceTwd === 'number' && Number.isFinite(event.ticketPriceTwd)
    && typeof event.ticketCurrency === 'string' && ['TWD', 'KRW', 'USD', 'JPY', 'EUR'].includes(event.ticketCurrency);
}

export default function EventRsvpElement(props: EventRsvpElementProps) {
  const eventId = props.node.content.eventId?.trim() ?? '';
  const effectiveLocale = normalizeLocale(props.locale || 'ko');
  const isBuilder = (props.mode ?? 'edit') !== 'published';
  const identity = JSON.stringify([eventId, effectiveLocale, props.mode ?? 'edit']);
  return <OwnedEventRsvp key={identity} {...props} eventId={eventId} effectiveLocale={effectiveLocale} isBuilder={isBuilder} />;
}

function OwnedEventRsvp({ node, eventId, effectiveLocale, isBuilder }: OwnedProps) {
  const c = node.content;
  const copy = getEventWidgetsCopy(effectiveLocale);
  const title = localizedEventWidgetText(c.title, copy.rsvpForm.defaultTitle, EVENT_RSVP_LEGACY_DEFAULTS.title);
  const successMessage = localizedEventWidgetText(c.successMessage, copy.rsvpForm.defaultSuccessMessage, EVENT_RSVP_LEGACY_DEFAULTS.successMessage);
  const [load, setLoad] = useState<LoadState>({ status: eventId || isBuilder ? 'loading' : 'unavailable' });
  const [pending, setPending] = useState(false);
  const [message, setMessage] = useState('');
  const generation = useRef(0);
  const mounted = useRef(false);
  const submitting = useRef(false);
  const submissionAbort = useRef<AbortController | null>(null);

  const useCommittedEffect = typeof window === 'undefined' ? useEffect : useLayoutEffect;
  useCommittedEffect(() => {
    mounted.current = true;
    generation.current += 1;
    return () => {
      mounted.current = false;
      generation.current += 1;
      submissionAbort.current?.abort();
    };
  }, []);

  useEffect(() => {
    const owner = generation.current;
    const controller = new AbortController();
    let disposed = false;
    const owns = () => !disposed && mounted.current && generation.current === owner;
    setLoad({ status: 'loading' });
    const params = new URLSearchParams({ locale: effectiveLocale, scope: isBuilder ? 'all' : 'public' });
    if (!eventId) {
      params.set('status', isBuilder ? 'all' : 'published');
      params.set('time', 'upcoming');
      params.set('sort', 'date-asc');
      params.set('limit', '20');
    }
    const url = eventId
      ? `/api/builder/events/${encodeURIComponent(eventId)}?${params.toString()}`
      : `/api/builder/events?${params.toString()}`;
    async function loadEvent() {
      try {
        const response = await fetch(url, { signal: controller.signal });
        if (eventId && response.status === 404) {
          if (owns()) setLoad({ status: 'unavailable' });
          return;
        }
        if (!response.ok) throw new Error('event_load_failed');
        const json: unknown = await response.json();
        if (!json || typeof json !== 'object' || !('ok' in json) || json.ok !== true) throw new Error('invalid_event_response');
        const body = json as { event?: unknown; events?: unknown };
        if (!eventId && !Array.isArray(body.events)) throw new Error('invalid_event_response');
        if (!eventId && (body.events as unknown[]).length === 0) {
          if (owns()) setLoad({ status: 'unavailable' });
          return;
        }
        const candidate = eventId ? body.event : (body.events as unknown[])[0];
        if (!isEvent(candidate)) throw new Error('invalid_event_response');
        const available = (!eventId || candidate.eventId === eventId)
          && candidate.locale === effectiveLocale
          && (isBuilder || candidate.status === 'published')
          && candidate.date >= new Date().toISOString().slice(0, 10);
        if (owns()) setLoad(available ? { status: 'ready', event: candidate } : { status: 'unavailable' });
      } catch {
        if (owns()) setLoad({ status: 'error' });
      }
    }
    void loadEvent();
    return () => { disposed = true; controller.abort(); };
  }, [eventId, effectiveLocale, isBuilder]);

  const selectedEvent = load.status === 'ready'
    ? load.event
    : isBuilder && !eventId && (load.status === 'loading' || load.status === 'error')
      ? copy.mockEvents.rsvp
      : null;
  const renderGeneration = generation.current;
  const ownsSubmission = () => mounted.current && generation.current === renderGeneration;

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!ownsSubmission() || !selectedEvent || (eventId && selectedEvent.eventId !== eventId)) return;
    if (isBuilder) {
      setMessage(copy.rsvpForm.previewMessage);
      return;
    }
    if (submitting.current || !selectedEvent.rsvpEnabled || selectedEvent.registeredCount >= selectedEvent.capacity) return;
    submitting.current = true;
    setPending(true);
    setMessage('');
    const formElement = event.currentTarget;
    const controller = new AbortController();
    submissionAbort.current = controller;
    try {
      const form = new FormData(formElement);
      const payload = {
        name: String(form.get('name') ?? ''), email: String(form.get('email') ?? ''),
        phone: String(form.get('phone') ?? ''), ticketQuantity: Number(form.get('ticketQuantity') ?? 1),
      };
      if (!ownsSubmission()) return;
      const params = new URLSearchParams({ locale: effectiveLocale });
      const response = await fetch(`/api/builder/events/${encodeURIComponent(selectedEvent.eventId)}/rsvp?${params.toString()}`, {
        method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(payload), signal: controller.signal,
      });
      const json = await response.json();
      if (!ownsSubmission()) return;
      if (!response.ok || json?.ok !== true) throw new Error(json?.error || copy.rsvpForm.saveError);
      setMessage(successMessage);
      formElement.reset();
    } catch (error) {
      if (ownsSubmission()) setMessage(error instanceof Error ? error.message : copy.rsvpForm.saveError);
    } finally {
      // Ignoring an obsolete response does not roll back a dispatched RSVP; never retry it automatically.
      if (ownsSubmission()) {
        submitting.current = false;
        submissionAbort.current = null;
        setPending(false);
      }
    }
  }

  if (!selectedEvent) {
    const stateMessage = load.status === 'loading' ? copy.loadingList
      : load.status === 'error' ? copy.rsvpForm.loadError : copy.rsvpForm.noEvents;
    return <div className={styles.state} data-builder-event-rsvp="true" role="status">{stateMessage}</div>;
  }

  const remaining = Math.max(0, selectedEvent.capacity - selectedEvent.registeredCount);
  const disabled = pending || !selectedEvent.rsvpEnabled || remaining <= 0;

  return (
    <section className={styles.root} data-builder-event-rsvp="true">
      {isBuilder ? <WidgetDataDisclosure locale={effectiveLocale} /> : null}
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

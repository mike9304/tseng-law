'use client';

import { FormEvent, useMemo, useState } from 'react';
import type { BuilderEvent, EventStatus } from '@/lib/builder/events/events-shared';
import { DEFAULT_EVENT_CATEGORIES } from '@/lib/builder/events/events-shared';
import type { Locale } from '@/lib/locales';
import { getEventsCopy } from './events-copy';
import styles from './EventsAdmin.module.css';

interface EventsAdminClientProps {
  locale: Locale;
  initialEvents: BuilderEvent[];
}

function statusLabel(status: EventStatus): string {
  switch (status) {
    case 'draft':
      return '초안';
    case 'cancelled':
      return '취소';
    case 'published':
    default:
      return '공개';
  }
}

function ticketLabel(event: BuilderEvent): string {
  if (event.ticketType === 'free') return '무료';
  return `${event.ticketCurrency} ${event.ticketPriceTwd.toLocaleString()}`;
}

export default function EventsAdminClient({ locale, initialEvents }: EventsAdminClientProps) {
  const copy = getEventsCopy(locale);
  const [events, setEvents] = useState(initialEvents);
  const [status, setStatus] = useState<EventStatus | 'all'>('all');
  const [pending, setPending] = useState(false);
  const [message, setMessage] = useState('');

  const filteredEvents = useMemo(() => {
    const source = status === 'all' ? events : events.filter((event) => event.status === status);
    return [...source].sort((a, b) => `${a.date}T${a.time}`.localeCompare(`${b.date}T${b.time}`));
  }, [events, status]);

  async function createEvent(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending(true);
    setMessage('');
    const form = new FormData(event.currentTarget);
    const ticketType = String(form.get('ticketType') ?? 'free') === 'paid' ? 'paid' : 'free';
    const payload = {
      locale,
      title: String(form.get('title') ?? ''),
      description: String(form.get('description') ?? ''),
      date: String(form.get('date') ?? ''),
      time: String(form.get('time') ?? ''),
      location: String(form.get('location') ?? ''),
      capacity: Number(form.get('capacity') ?? 80),
      category: String(form.get('category') ?? 'seminar'),
      status: String(form.get('status') ?? 'published'),
      rsvpEnabled: form.get('rsvpEnabled') === 'on',
      ticketType,
      ticketPriceTwd: ticketType === 'paid' ? Number(form.get('ticketPriceTwd') ?? 0) : 0,
      ticketCurrency: 'TWD',
    };

    try {
      const response = await fetch('/api/builder/events', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const json = await response.json();
      if (!response.ok || !json?.ok) throw new Error(json?.error || copy.createError);
      setEvents((current) => [json.event as BuilderEvent, ...current.filter((item) => item.eventId !== json.event.eventId)]);
      setMessage(copy.formSubmitSuccess);
      event.currentTarget.reset();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : copy.createError);
    } finally {
      setPending(false);
    }
  }

  async function updateStatus(eventId: string, nextStatus: EventStatus) {
    setMessage('');
    try {
      const params = new URLSearchParams({ locale });
      const response = await fetch(`/api/builder/events/${encodeURIComponent(eventId)}?${params.toString()}`, {
        method: 'PATCH',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ status: nextStatus }),
      });
      const json = await response.json();
      if (!response.ok || !json?.ok) throw new Error(json?.error || copy.updateError);
      setEvents((current) => current.map((item) => item.eventId === eventId ? json.event as BuilderEvent : item));
    } catch (error) {
      setMessage(error instanceof Error ? error.message : copy.updateError);
    }
  }

  const publishedCount = events.filter((event) => event.status === 'published').length;
  const upcomingCount = events.filter((event) => event.status === 'published' && event.date >= new Date().toISOString().slice(0, 10)).length;
  const rsvpCount = events.reduce((total, event) => total + event.registeredCount, 0);

  return (
    <main className={styles.root} data-builder-events-admin="true">
      <header className={styles.header}>
        <div>
          <p className={styles.eyebrow}>{copy.eyebrow}</p>
          <h1>{copy.heading}</h1>
          <p>{copy.description}</p>
        </div>
        <a className={styles.publicLink} href={`/${locale}/events`} target="_blank" rel="noreferrer">
          {copy.publicLink}
        </a>
      </header>

      <section className={styles.stats} aria-label={copy.statsLabel}>
        <div><strong>{events.length}</strong><span>{copy.totalLabel}</span></div>
        <div><strong>{publishedCount}</strong><span>{copy.publishedLabel}</span></div>
        <div><strong>{upcomingCount}</strong><span>{copy.upcomingLabel}</span></div>
        <div><strong>{rsvpCount}</strong><span>{copy.rsvpLabel}</span></div>
      </section>

      <section className={styles.layout}>
        <form className={styles.form} onSubmit={createEvent} data-builder-events-create-form="true">
          <h2>{copy.createHeading}</h2>
          <label>
            {copy.titleLabel}
            <input name="title" required placeholder="최대 180자 · 예: 대만 회사설립 세미나" />
          </label>
          <label>
            {copy.descriptionLabel}
            <textarea name="description" rows={4} placeholder="최대 4000자 · 예: 대만 법인 설립 절차와 주의점을 다루는 무료 세미나입니다." />
          </label>
          <div className={styles.twoCols}>
            <label>
              {copy.dateLabel}
              <input name="date" type="date" required />
            </label>
            <label>
              {copy.timeLabel}
              <input name="time" type="time" required defaultValue="14:00" />
            </label>
          </div>
          <label>
            {copy.locationLabel}
            <input name="location" required placeholder="최대 240자 · 예: 타이베이 오피스 / Online" />
          </label>
          <div className={styles.twoCols}>
            <label>
              {copy.capacityLabel}
              <input name="capacity" type="number" min={1} defaultValue={80} />
            </label>
            <label>
              {copy.categoryLabel}
              <select name="category" defaultValue="seminar">
                {DEFAULT_EVENT_CATEGORIES.map((category) => (
                  <option key={category.id} value={category.id}>{category.name[locale]}</option>
                ))}
              </select>
            </label>
          </div>
          <div className={styles.twoCols}>
            <label>
              {copy.statusLabel}
              <select name="status" defaultValue="published">
                <option value="published">{copy.statusPublished}</option>
                <option value="draft">{copy.statusDraft}</option>
                <option value="cancelled">{copy.statusCancelled}</option>
              </select>
            </label>
            <label>
              {copy.ticketLabel}
              <select name="ticketType" defaultValue="free">
                <option value="free">{copy.ticketFree}</option>
                <option value="paid">{copy.ticketPaid}</option>
              </select>
            </label>
          </div>
          <label>
            {copy.priceLabel}
            <input name="ticketPriceTwd" type="number" min={0} defaultValue={0} />
          </label>
          <label className={styles.checkbox}>
            <input name="rsvpEnabled" type="checkbox" defaultChecked />
            {copy.rsvpToggleLabel}
          </label>
          <button type="submit" disabled={pending}>{pending ? copy.creatingButton : copy.createButton}</button>
          {message ? <p className={styles.message} role="status">{message}</p> : null}
        </form>

        <section className={styles.list} aria-label={copy.listHeading}>
          <div className={styles.listHeader}>
            <h2>{copy.listHeading}</h2>
            <select value={status} onChange={(event) => setStatus(event.currentTarget.value as EventStatus | 'all')} aria-label={copy.filterLabel}>
              <option value="all">{copy.totalLabel}</option>
              <option value="published">{copy.statusPublished}</option>
              <option value="draft">{copy.statusDraft}</option>
              <option value="cancelled">{copy.statusCancelled}</option>
            </select>
          </div>
          {filteredEvents.length === 0 ? (
            <div className={styles.empty}>{copy.emptyState}</div>
          ) : (
            <div className={styles.cards}>
              {filteredEvents.map((event) => (
                <article key={event.eventId} className={styles.card} data-builder-event-admin-card={event.eventId}>
                  <div>
                    <span className={styles.badge}>{statusLabel(event.status)}</span>
                    <h3>{event.title}</h3>
                    <p>{event.date} {event.time} · {event.location}</p>
                    <p>{event.registeredCount}/{event.capacity} RSVP · {ticketLabel(event)}</p>
                  </div>
                  <div className={styles.actions}>
                    <a href={`/${locale}/events/${event.slug}`} target="_blank" rel="noreferrer">{copy.viewLabel}</a>
                    <button type="button" onClick={() => updateStatus(event.eventId, event.status === 'published' ? 'draft' : 'published')}>
                      {event.status === 'published' ? copy.toggleToDraftLabel : copy.toggleToPublishLabel}
                    </button>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      </section>
    </main>
  );
}

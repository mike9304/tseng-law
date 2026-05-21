'use client';

import { FormEvent, useMemo, useState } from 'react';
import type { BuilderEvent, EventStatus } from '@/lib/builder/events/events-shared';
import { DEFAULT_EVENT_CATEGORIES } from '@/lib/builder/events/events-shared';
import type { Locale } from '@/lib/locales';
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
      if (!response.ok || !json?.ok) throw new Error(json?.error || '이벤트 저장 실패');
      setEvents((current) => [json.event as BuilderEvent, ...current.filter((item) => item.eventId !== json.event.eventId)]);
      setMessage('이벤트가 생성되었습니다.');
      event.currentTarget.reset();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : '이벤트 저장 실패');
    } finally {
      setPending(false);
    }
  }

  async function updateStatus(eventId: string, nextStatus: EventStatus) {
    setMessage('');
    try {
      const response = await fetch(`/api/builder/events/${encodeURIComponent(eventId)}`, {
        method: 'PATCH',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ status: nextStatus }),
      });
      const json = await response.json();
      if (!response.ok || !json?.ok) throw new Error(json?.error || '상태 변경 실패');
      setEvents((current) => current.map((item) => item.eventId === eventId ? json.event as BuilderEvent : item));
    } catch (error) {
      setMessage(error instanceof Error ? error.message : '상태 변경 실패');
    }
  }

  const publishedCount = events.filter((event) => event.status === 'published').length;
  const upcomingCount = events.filter((event) => event.status === 'published' && event.date >= new Date().toISOString().slice(0, 10)).length;
  const rsvpCount = events.reduce((total, event) => total + event.registeredCount, 0);

  return (
    <main className={styles.root} data-builder-events-admin="true">
      <header className={styles.header}>
        <div>
          <p className={styles.eyebrow}>Native Events</p>
          <h1>이벤트 관리</h1>
          <p>세미나, 웨비나, 상담회를 만들고 RSVP와 티켓 기본 정보를 관리합니다.</p>
        </div>
        <a className={styles.publicLink} href={`/${locale}/events`} target="_blank" rel="noreferrer">
          공개 이벤트 보기
        </a>
      </header>

      <section className={styles.stats} aria-label="이벤트 요약">
        <div><strong>{events.length}</strong><span>전체</span></div>
        <div><strong>{publishedCount}</strong><span>공개</span></div>
        <div><strong>{upcomingCount}</strong><span>예정</span></div>
        <div><strong>{rsvpCount}</strong><span>신청</span></div>
      </section>

      <section className={styles.layout}>
        <form className={styles.form} onSubmit={createEvent} data-builder-events-create-form="true">
          <h2>새 이벤트</h2>
          <label>
            제목
            <input name="title" required placeholder="대만 회사설립 세미나" />
          </label>
          <label>
            설명
            <textarea name="description" rows={4} placeholder="행사 소개를 입력하세요." />
          </label>
          <div className={styles.twoCols}>
            <label>
              날짜
              <input name="date" type="date" required />
            </label>
            <label>
              시간
              <input name="time" type="time" required defaultValue="14:00" />
            </label>
          </div>
          <label>
            장소
            <input name="location" required placeholder="타이베이 오피스 / Online" />
          </label>
          <div className={styles.twoCols}>
            <label>
              정원
              <input name="capacity" type="number" min={1} defaultValue={80} />
            </label>
            <label>
              카테고리
              <select name="category" defaultValue="seminar">
                {DEFAULT_EVENT_CATEGORIES.map((category) => (
                  <option key={category.id} value={category.id}>{category.name[locale]}</option>
                ))}
              </select>
            </label>
          </div>
          <div className={styles.twoCols}>
            <label>
              상태
              <select name="status" defaultValue="published">
                <option value="published">공개</option>
                <option value="draft">초안</option>
                <option value="cancelled">취소</option>
              </select>
            </label>
            <label>
              티켓
              <select name="ticketType" defaultValue="free">
                <option value="free">무료</option>
                <option value="paid">유료</option>
              </select>
            </label>
          </div>
          <label>
            유료 티켓 가격(TWD)
            <input name="ticketPriceTwd" type="number" min={0} defaultValue={0} />
          </label>
          <label className={styles.checkbox}>
            <input name="rsvpEnabled" type="checkbox" defaultChecked />
            RSVP 받기
          </label>
          <button type="submit" disabled={pending}>{pending ? '저장 중...' : '이벤트 생성'}</button>
          {message ? <p className={styles.message} role="status">{message}</p> : null}
        </form>

        <section className={styles.list} aria-label="이벤트 목록">
          <div className={styles.listHeader}>
            <h2>이벤트</h2>
            <select value={status} onChange={(event) => setStatus(event.currentTarget.value as EventStatus | 'all')} aria-label="상태 필터">
              <option value="all">전체</option>
              <option value="published">공개</option>
              <option value="draft">초안</option>
              <option value="cancelled">취소</option>
            </select>
          </div>
          {filteredEvents.length === 0 ? (
            <div className={styles.empty}>이벤트가 없습니다.</div>
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
                    <a href={`/${locale}/events/${event.slug}`} target="_blank" rel="noreferrer">보기</a>
                    <button type="button" onClick={() => updateStatus(event.eventId, event.status === 'published' ? 'draft' : 'published')}>
                      {event.status === 'published' ? '초안으로' : '공개'}
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

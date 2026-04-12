/**
 * Phase 15 — Events Module.
 *
 * EVT-01: Event model (title, date, time, location, capacity, etc.)
 * EVT-02: Registration (attendee info, Blob persistence)
 * EVT-03: Event listing (sort by date, filter by past/upcoming)
 * EVT-04: Calendar view data (events grouped by month)
 *
 * For law firm: seminars, client events, legal workshops.
 */

import type { Locale } from '@/lib/locales';
import { get, put, list } from '@vercel/blob';

// ─── Event Model ─────────────────────────────────────────────────

export interface BuilderEvent {
  eventId: string;
  title: string;
  description: string;
  date: string;          // YYYY-MM-DD
  time: string;          // HH:mm
  endDate?: string;
  endTime?: string;
  location: string;
  capacity: number;
  registeredCount: number;
  imageUrl?: string;
  category: string;
  locale: Locale;
  createdAt: string;
  updatedAt: string;
}

export interface EventAttendee {
  attendeeId: string;
  eventId: string;
  name: string;
  email: string;
  phone?: string;
  registeredAt: string;
}

export type EventTimeFilter = 'all' | 'upcoming' | 'past';

export type EventSortBy = 'date-asc' | 'date-desc';

// ─── Blob Prefixes ───────────────────────────────────────────────

const EVENTS_PREFIX = 'builder-events/events/';
const ATTENDEES_PREFIX = 'builder-events/attendees/';

// ─── Event CRUD ──────────────────────────────────────────────────

export async function saveEvent(event: BuilderEvent): Promise<void> {
  await put(`${EVENTS_PREFIX}${event.eventId}.json`, JSON.stringify(event), {
    access: 'private', allowOverwrite: true, contentType: 'application/json',
  });
}

export async function loadEvent(eventId: string): Promise<BuilderEvent | null> {
  try {
    const result = await get(`${EVENTS_PREFIX}${eventId}.json`, { access: 'private', useCache: false });
    if (result?.statusCode === 200 && result.stream) {
      return JSON.parse(await new Response(result.stream).text()) as BuilderEvent;
    }
  } catch { /* empty */ }
  return null;
}

export async function listEvents(): Promise<BuilderEvent[]> {
  try {
    const result = await list({ prefix: EVENTS_PREFIX });
    const events: BuilderEvent[] = [];
    for (const blob of result.blobs) {
      try {
        const res = await get(blob.pathname, { access: 'private', useCache: false });
        if (res?.statusCode === 200 && res.stream) {
          events.push(JSON.parse(await new Response(res.stream).text()) as BuilderEvent);
        }
      } catch { /* skip */ }
    }
    return events;
  } catch { return []; }
}

export async function deleteEvent(eventId: string): Promise<void> {
  // Overwrite with empty to "soft delete" — Vercel Blob doesn't have a native delete via get/put/list
  await put(`${EVENTS_PREFIX}${eventId}.json`, JSON.stringify({ deleted: true }), {
    access: 'private', allowOverwrite: true, contentType: 'application/json',
  });
}

// ─── Registration CRUD ───────────────────────────────────────────

export async function registerAttendee(
  eventId: string,
  data: { name: string; email: string; phone?: string },
): Promise<EventAttendee> {
  const event = await loadEvent(eventId);
  if (!event) throw new Error('이벤트를 찾을 수 없습니다.');
  if (event.registeredCount >= event.capacity) throw new Error('등록이 마감되었습니다.');

  const attendee: EventAttendee = {
    attendeeId: `att-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    eventId,
    name: data.name,
    email: data.email.toLowerCase().trim(),
    phone: data.phone,
    registeredAt: new Date().toISOString(),
  };

  await put(
    `${ATTENDEES_PREFIX}${eventId}/${attendee.attendeeId}.json`,
    JSON.stringify(attendee),
    { access: 'private', allowOverwrite: true, contentType: 'application/json' },
  );

  // Update count
  event.registeredCount += 1;
  event.updatedAt = new Date().toISOString();
  await saveEvent(event);

  return attendee;
}

export async function listAttendees(eventId: string): Promise<EventAttendee[]> {
  try {
    const result = await list({ prefix: `${ATTENDEES_PREFIX}${eventId}/` });
    const attendees: EventAttendee[] = [];
    for (const blob of result.blobs) {
      try {
        const res = await get(blob.pathname, { access: 'private', useCache: false });
        if (res?.statusCode === 200 && res.stream) {
          attendees.push(JSON.parse(await new Response(res.stream).text()) as EventAttendee);
        }
      } catch { /* skip */ }
    }
    return attendees;
  } catch { return []; }
}

// ─── Sorting / Filtering ────────────────────────────────────────

export function sortEvents(events: BuilderEvent[], sortBy: EventSortBy): BuilderEvent[] {
  const sorted = [...events];
  switch (sortBy) {
    case 'date-asc':
      return sorted.sort((a, b) => `${a.date}T${a.time}`.localeCompare(`${b.date}T${b.time}`));
    case 'date-desc':
      return sorted.sort((a, b) => `${b.date}T${b.time}`.localeCompare(`${a.date}T${a.time}`));
    default:
      return sorted;
  }
}

export function filterEventsByTime(events: BuilderEvent[], filter: EventTimeFilter): BuilderEvent[] {
  if (filter === 'all') return events;
  const now = new Date().toISOString().slice(0, 10);
  switch (filter) {
    case 'upcoming':
      return events.filter((e) => e.date >= now);
    case 'past':
      return events.filter((e) => e.date < now);
    default:
      return events;
  }
}

export function filterEventsByCategory(events: BuilderEvent[], category: string): BuilderEvent[] {
  return events.filter((e) => e.category === category);
}

export function filterEventsByLocale(events: BuilderEvent[], locale: Locale): BuilderEvent[] {
  return events.filter((e) => e.locale === locale);
}

// ─── Calendar View Data ──────────────────────────────────────────

export interface CalendarMonth {
  yearMonth: string;  // "2026-04"
  events: BuilderEvent[];
}

export function groupEventsByMonth(events: BuilderEvent[]): CalendarMonth[] {
  const map = new Map<string, BuilderEvent[]>();
  for (const event of events) {
    const ym = event.date.slice(0, 7); // "YYYY-MM"
    const arr = map.get(ym) || [];
    arr.push(event);
    map.set(ym, arr);
  }

  const months: CalendarMonth[] = [];
  for (const [yearMonth, evts] of map.entries()) {
    months.push({ yearMonth, events: sortEvents(evts, 'date-asc') });
  }
  return months.sort((a, b) => a.yearMonth.localeCompare(b.yearMonth));
}

// ─── Validation ──────────────────────────────────────────────────

export function validateEvent(event: Partial<BuilderEvent>): string[] {
  const errors: string[] = [];
  if (!event.title?.trim()) errors.push('제목을 입력하세요.');
  if (!event.date || !/^\d{4}-\d{2}-\d{2}$/.test(event.date)) errors.push('날짜 형식이 올바르지 않습니다 (YYYY-MM-DD).');
  if (!event.time || !/^\d{2}:\d{2}$/.test(event.time)) errors.push('시간 형식이 올바르지 않습니다 (HH:mm).');
  if (!event.location?.trim()) errors.push('장소를 입력하세요.');
  if (event.capacity != null && event.capacity < 1) errors.push('정원은 1 이상이어야 합니다.');
  return errors;
}

export function validateAttendee(data: { name?: string; email?: string }): string[] {
  const errors: string[] = [];
  if (!data.name?.trim()) errors.push('이름을 입력하세요.');
  if (!data.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) errors.push('유효한 이메일을 입력하세요.');
  return errors;
}

// ─── Default law-firm event categories ───────────────────────────

export const DEFAULT_EVENT_CATEGORIES: Array<{ id: string; name: Record<Locale, string> }> = [
  { id: 'seminar', name: { ko: '법률 세미나', 'zh-hant': '法律研討會', en: 'Legal Seminar' } },
  { id: 'workshop', name: { ko: '법률 워크샵', 'zh-hant': '法律工作坊', en: 'Legal Workshop' } },
  { id: 'consultation', name: { ko: '무료 상담회', 'zh-hant': '免費諮詢會', en: 'Free Consultation' } },
  { id: 'networking', name: { ko: '네트워킹', 'zh-hant': '交流活動', en: 'Networking' } },
  { id: 'webinar', name: { ko: '온라인 세미나', 'zh-hant': '線上研討會', en: 'Webinar' } },
];

/**
 * Native Events app engine.
 *
 * F45 covers an Events admin model, RSVP/ticket basics, event pages, and
 * calendar/list widgets. Keep the storage API small and deterministic so the
 * admin, public routes, and app widgets all read the same source.
 */

import { promises as fs } from 'fs';
import path from 'path';
import { get, list, put } from '@vercel/blob';
import type { Locale } from '@/lib/locales';
import type {
  BuilderEvent,
  EventAttendee,
  EventStatus,
  EventTimeFilter,
} from './events-shared';

export type {
  BuilderEvent,
  CalendarMonth,
  EventAttendee,
  EventAttendeeStatus,
  EventSortBy,
  EventStatus,
  EventTicketType,
  EventTimeFilter,
} from './events-shared';
export { DEFAULT_EVENT_CATEGORIES, groupEventsByMonth, sortEvents } from './events-shared';

type EventBackend = 'blob' | 'file';
type StoredEvent = BuilderEvent & { deleted?: boolean };
type StoredAttendee = EventAttendee & { deleted?: boolean };

const EVENTS_PREFIX = 'builder-events/events/';
const ATTENDEES_PREFIX = 'builder-events/attendees/';
const DEFAULT_EVENTS_ROOT = path.join(process.cwd(), 'runtime-data', 'builder-events');

function getBackend(): EventBackend {
  if (!process.env.BLOB_READ_WRITE_TOKEN) return 'file';
  if (process.env.CONSULTATION_LOG_BACKEND === 'local') return 'file';
  if (process.env.BUILDER_EVENTS_BACKEND === 'local') return 'file';
  if (process.env.NODE_ENV !== 'production' && process.env.BUILDER_USE_BLOB_IN_DEV !== '1') return 'file';
  return 'blob';
}

function eventsRoot(): string {
  return process.env.BUILDER_EVENTS_ROOT?.trim() || DEFAULT_EVENTS_ROOT;
}

function eventBlobPath(eventId: string): string {
  return `${EVENTS_PREFIX}${eventId}.json`;
}

function attendeeBlobPath(eventId: string, attendeeId: string): string {
  return `${ATTENDEES_PREFIX}${eventId}/${attendeeId}.json`;
}

function eventFilePath(eventId: string): string {
  return path.join(eventsRoot(), 'events', `${eventId}.json`);
}

function attendeeFilePath(eventId: string, attendeeId: string): string {
  return path.join(eventsRoot(), 'attendees', eventId, `${attendeeId}.json`);
}

async function writeJson(blobPath: string, filePath: string, data: unknown): Promise<void> {
  const body = JSON.stringify(data, null, 2);
  if (getBackend() === 'blob') {
    await put(blobPath, body, {
      access: 'private',
      allowOverwrite: true,
      contentType: 'application/json',
    });
    return;
  }

  await fs.mkdir(path.dirname(filePath), { recursive: true });
  await fs.writeFile(filePath, body, 'utf8');
}

async function readJson<T>(blobPath: string, filePath: string): Promise<T | null> {
  try {
    if (getBackend() === 'blob') {
      const result = await get(blobPath, { access: 'private', useCache: false });
      if (result?.statusCode === 200 && result.stream) {
        return JSON.parse(await new Response(result.stream).text()) as T;
      }
      return null;
    }

    return JSON.parse(await fs.readFile(filePath, 'utf8')) as T;
  } catch {
    return null;
  }
}

async function listEventJson(): Promise<StoredEvent[]> {
  if (getBackend() === 'blob') {
    const result = await list({ prefix: EVENTS_PREFIX });
    const values: StoredEvent[] = [];
    for (const blob of result.blobs) {
      const parsed = await readJson<StoredEvent>(blob.pathname, eventFilePath(path.basename(blob.pathname, '.json')));
      if (parsed) values.push(parsed);
    }
    return values;
  }

  const dir = path.join(eventsRoot(), 'events');
  const files = await fs.readdir(dir).catch(() => []);
  const values: StoredEvent[] = [];
  for (const file of files) {
    if (!file.endsWith('.json')) continue;
    const raw = await fs.readFile(path.join(dir, file), 'utf8').catch(() => '');
    if (!raw) continue;
    try {
      values.push(JSON.parse(raw) as StoredEvent);
    } catch {
      // Skip malformed local records.
    }
  }
  return values;
}

async function listAttendeeJson(eventId: string): Promise<StoredAttendee[]> {
  if (getBackend() === 'blob') {
    const result = await list({ prefix: `${ATTENDEES_PREFIX}${eventId}/` });
    const values: StoredAttendee[] = [];
    for (const blob of result.blobs) {
      const attendeeId = path.basename(blob.pathname, '.json');
      const parsed = await readJson<StoredAttendee>(blob.pathname, attendeeFilePath(eventId, attendeeId));
      if (parsed) values.push(parsed);
    }
    return values;
  }

  const dir = path.join(eventsRoot(), 'attendees', eventId);
  const files = await fs.readdir(dir).catch(() => []);
  const values: StoredAttendee[] = [];
  for (const file of files) {
    if (!file.endsWith('.json')) continue;
    const raw = await fs.readFile(path.join(dir, file), 'utf8').catch(() => '');
    if (!raw) continue;
    try {
      values.push(JSON.parse(raw) as StoredAttendee);
    } catch {
      // Skip malformed local records.
    }
  }
  return values;
}

function nowIso(): string {
  return new Date().toISOString();
}

function safeTrim(value: unknown, max: number): string {
  return typeof value === 'string' ? value.trim().slice(0, max) : '';
}

export function slugifyEventTitle(title: string): string {
  const ascii = title
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9가-힣一-龥ぁ-んァ-ン]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80);
  return ascii || `event-${Date.now()}`;
}

export function makeEventId(): string {
  return `evt-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

export function normalizeEvent(input: Partial<BuilderEvent>): BuilderEvent {
  const at = nowIso();
  const title = safeTrim(input.title, 180) || 'Untitled event';
  const eventId = safeTrim(input.eventId, 120) || makeEventId();
  const slug = safeTrim(input.slug, 100) || slugifyEventTitle(title);
  const capacity = Number.isFinite(input.capacity) ? Math.max(1, Math.round(input.capacity ?? 1)) : 80;
  const registeredCount = Number.isFinite(input.registeredCount)
    ? Math.max(0, Math.round(input.registeredCount ?? 0))
    : 0;
  const ticketType = input.ticketType === 'paid' ? 'paid' : 'free';
  const ticketPriceTwd = ticketType === 'paid'
    ? Math.max(0, Math.round(input.ticketPriceTwd ?? 0))
    : 0;

  return {
    eventId,
    slug,
    title,
    description: safeTrim(input.description, 4000),
    date: safeTrim(input.date, 10) || at.slice(0, 10),
    time: safeTrim(input.time, 5) || '10:00',
    ...(safeTrim(input.endDate, 10) ? { endDate: safeTrim(input.endDate, 10) } : {}),
    ...(safeTrim(input.endTime, 5) ? { endTime: safeTrim(input.endTime, 5) } : {}),
    location: safeTrim(input.location, 240) || 'Online',
    capacity,
    registeredCount: Math.min(capacity, registeredCount),
    ...(safeTrim(input.imageUrl, 2000) ? { imageUrl: safeTrim(input.imageUrl, 2000) } : {}),
    category: safeTrim(input.category, 80) || 'seminar',
    locale: input.locale === 'zh-hant' || input.locale === 'en' ? input.locale : 'ko',
    status: input.status === 'draft' || input.status === 'cancelled' ? input.status : 'published',
    rsvpEnabled: input.rsvpEnabled ?? true,
    ticketType,
    ticketPriceTwd,
    ticketCurrency: input.ticketCurrency ?? 'TWD',
    createdAt: input.createdAt && Number.isFinite(Date.parse(input.createdAt)) ? input.createdAt : at,
    updatedAt: input.updatedAt && Number.isFinite(Date.parse(input.updatedAt)) ? input.updatedAt : at,
  };
}

function normalizeAttendee(input: Partial<EventAttendee>, eventId: string): EventAttendee {
  const quantity = Number.isFinite(input.ticketQuantity)
    ? Math.max(1, Math.min(20, Math.round(input.ticketQuantity ?? 1)))
    : 1;
  return {
    attendeeId: safeTrim(input.attendeeId, 120) || `att-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    eventId,
    name: safeTrim(input.name, 120),
    email: safeTrim(input.email, 180).toLowerCase(),
    ...(safeTrim(input.phone, 80) ? { phone: safeTrim(input.phone, 80) } : {}),
    ticketQuantity: quantity,
    paymentStatus: input.paymentStatus === 'pending' ? 'pending' : 'not-required',
    status: input.status === 'cancelled' ? 'cancelled' : 'registered',
    registeredAt: input.registeredAt && Number.isFinite(Date.parse(input.registeredAt))
      ? input.registeredAt
      : nowIso(),
  };
}

export async function saveEvent(event: BuilderEvent): Promise<BuilderEvent> {
  const normalized = normalizeEvent({ ...event, updatedAt: nowIso() });
  await writeJson(eventBlobPath(normalized.eventId), eventFilePath(normalized.eventId), normalized);
  return normalized;
}

export async function createEvent(input: Partial<BuilderEvent>): Promise<BuilderEvent> {
  const normalized = normalizeEvent(input);
  const existing = await findEventBySlug(normalized.locale, normalized.slug);
  const event = existing
    ? { ...normalized, slug: `${normalized.slug}-${normalized.eventId.slice(-6)}` }
    : normalized;
  await writeJson(eventBlobPath(event.eventId), eventFilePath(event.eventId), event);
  return event;
}

export async function loadEvent(eventId: string): Promise<BuilderEvent | null> {
  const parsed = await readJson<StoredEvent>(eventBlobPath(eventId), eventFilePath(eventId));
  if (!parsed || parsed.deleted) return null;
  return normalizeEvent(parsed);
}

export async function listEvents(): Promise<BuilderEvent[]> {
  const events = await listEventJson();
  return events
    .filter((event) => !event.deleted)
    .map((event) => normalizeEvent(event));
}

export async function findEventBySlug(locale: Locale, slug: string): Promise<BuilderEvent | null> {
  const normalizedSlug = slug.trim();
  const events = await listEvents();
  return events.find((event) => event.locale === locale && event.slug === normalizedSlug) ?? null;
}

export async function deleteEvent(eventId: string): Promise<void> {
  const existing = await loadEvent(eventId);
  await writeJson(
    eventBlobPath(eventId),
    eventFilePath(eventId),
    existing ? { ...existing, deleted: true, updatedAt: nowIso() } : { eventId, deleted: true },
  );
}

export async function registerAttendee(
  eventId: string,
  data: { name: string; email: string; phone?: string; ticketQuantity?: number },
): Promise<EventAttendee> {
  const event = await loadEvent(eventId);
  if (!event) throw new Error('이벤트를 찾을 수 없습니다.');
  if (event.status !== 'published') throw new Error('공개된 이벤트만 신청할 수 있습니다.');
  if (!event.rsvpEnabled) throw new Error('이 이벤트는 신청을 받지 않습니다.');

  const attendee = normalizeAttendee({
    eventId,
    name: data.name,
    email: data.email,
    phone: data.phone,
    ticketQuantity: data.ticketQuantity,
    paymentStatus: event.ticketType === 'paid' ? 'pending' : 'not-required',
  }, eventId);
  const errors = validateAttendee(attendee);
  if (errors.length > 0) throw new Error(errors[0]);

  if (event.registeredCount + attendee.ticketQuantity > event.capacity) {
    throw new Error('등록이 마감되었습니다.');
  }

  await writeJson(
    attendeeBlobPath(eventId, attendee.attendeeId),
    attendeeFilePath(eventId, attendee.attendeeId),
    attendee,
  );
  await saveEvent({
    ...event,
    registeredCount: event.registeredCount + attendee.ticketQuantity,
  });
  return attendee;
}

export async function listAttendees(eventId: string): Promise<EventAttendee[]> {
  const attendees = await listAttendeeJson(eventId);
  return attendees
    .filter((attendee) => !attendee.deleted)
    .map((attendee) => normalizeAttendee(attendee, eventId));
}

export function filterEventsByTime(events: BuilderEvent[], filter: EventTimeFilter, now = new Date()): BuilderEvent[] {
  if (filter === 'all') return events;
  const today = now.toISOString().slice(0, 10);
  if (filter === 'upcoming') return events.filter((event) => event.date >= today);
  return events.filter((event) => event.date < today);
}

export function filterEventsByCategory(events: BuilderEvent[], category?: string): BuilderEvent[] {
  const normalized = category?.trim();
  if (!normalized || normalized === 'all') return events;
  return events.filter((event) => event.category === normalized);
}

export function filterEventsByLocale(events: BuilderEvent[], locale: Locale): BuilderEvent[] {
  return events.filter((event) => event.locale === locale);
}

export function filterEventsByStatus(events: BuilderEvent[], status?: EventStatus | 'all'): BuilderEvent[] {
  if (!status || status === 'all') return events;
  return events.filter((event) => event.status === status);
}

export function searchEvents(events: BuilderEvent[], query?: string): BuilderEvent[] {
  const normalized = query?.trim().toLowerCase();
  if (!normalized) return events;
  return events.filter((event) => [
    event.title,
    event.description,
    event.location,
    event.category,
  ].some((value) => value.toLowerCase().includes(normalized)));
}

export function validateEvent(event: Partial<BuilderEvent>): string[] {
  const errors: string[] = [];
  if (!event.title?.trim()) errors.push('제목을 입력하세요.');
  if (!event.slug?.trim() || !/^[a-z0-9가-힣一-龥ぁ-んァ-ン-]+$/i.test(event.slug)) errors.push('슬러그 형식이 올바르지 않습니다.');
  if (!event.date || !/^\d{4}-\d{2}-\d{2}$/.test(event.date)) errors.push('날짜 형식이 올바르지 않습니다 (YYYY-MM-DD).');
  if (!event.time || !/^\d{2}:\d{2}$/.test(event.time)) errors.push('시간 형식이 올바르지 않습니다 (HH:mm).');
  if (!event.location?.trim()) errors.push('장소를 입력하세요.');
  if (event.capacity != null && event.capacity < 1) errors.push('정원은 1 이상이어야 합니다.');
  if (event.ticketType === 'paid' && (!event.ticketPriceTwd || event.ticketPriceTwd < 1)) {
    errors.push('유료 티켓 가격을 입력하세요.');
  }
  return errors;
}

export function validateAttendee(data: { name?: string; email?: string; ticketQuantity?: number }): string[] {
  const errors: string[] = [];
  if (!data.name?.trim()) errors.push('이름을 입력하세요.');
  if (!data.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) errors.push('유효한 이메일을 입력하세요.');
  if (data.ticketQuantity != null && data.ticketQuantity < 1) errors.push('신청 인원은 1명 이상이어야 합니다.');
  return errors;
}

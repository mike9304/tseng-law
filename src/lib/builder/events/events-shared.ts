import type { Locale } from '@/lib/locales';

export type EventStatus = 'draft' | 'published' | 'cancelled';
export type EventTimeFilter = 'all' | 'upcoming' | 'past';
export type EventSortBy = 'date-asc' | 'date-desc';
export type EventTicketType = 'free' | 'paid';
export type EventAttendeeStatus = 'registered' | 'cancelled';

export interface BuilderEvent {
  eventId: string;
  slug: string;
  title: string;
  description: string;
  date: string;
  time: string;
  endDate?: string;
  endTime?: string;
  location: string;
  capacity: number;
  registeredCount: number;
  imageUrl?: string;
  category: string;
  locale: Locale;
  status: EventStatus;
  rsvpEnabled: boolean;
  ticketType: EventTicketType;
  ticketPriceTwd: number;
  ticketCurrency: 'TWD' | 'KRW' | 'USD' | 'JPY' | 'EUR';
  createdAt: string;
  updatedAt: string;
}

export interface EventAttendee {
  attendeeId: string;
  eventId: string;
  name: string;
  email: string;
  phone?: string;
  ticketQuantity: number;
  paymentStatus: 'not-required' | 'pending';
  status: EventAttendeeStatus;
  registeredAt: string;
}

export interface CalendarMonth {
  yearMonth: string;
  events: BuilderEvent[];
}

export const DEFAULT_EVENT_CATEGORIES: Array<{ id: string; name: Record<Locale, string> }> = [
  { id: 'seminar', name: { ko: '법률 세미나', 'zh-hant': '法律研討會', en: 'Legal Seminar' } },
  { id: 'workshop', name: { ko: '법률 워크샵', 'zh-hant': '法律工作坊', en: 'Legal Workshop' } },
  { id: 'consultation', name: { ko: '무료 상담회', 'zh-hant': '免費諮詢會', en: 'Free Consultation' } },
  { id: 'networking', name: { ko: '네트워킹', 'zh-hant': '交流活動', en: 'Networking' } },
  { id: 'webinar', name: { ko: '온라인 세미나', 'zh-hant': '線上研討會', en: 'Webinar' } },
];

function eventDateTime(event: Pick<BuilderEvent, 'date' | 'time'>): string {
  return `${event.date}T${event.time}`;
}

export function sortEvents(events: BuilderEvent[], sortBy: EventSortBy): BuilderEvent[] {
  const sorted = [...events];
  if (sortBy === 'date-desc') {
    return sorted.sort((a, b) => eventDateTime(b).localeCompare(eventDateTime(a)));
  }
  return sorted.sort((a, b) => eventDateTime(a).localeCompare(eventDateTime(b)));
}

export function groupEventsByMonth(events: BuilderEvent[]): CalendarMonth[] {
  const map = new Map<string, BuilderEvent[]>();
  for (const event of events) {
    const yearMonth = event.date.slice(0, 7);
    map.set(yearMonth, [...(map.get(yearMonth) ?? []), event]);
  }
  return Array.from(map.entries())
    .map(([yearMonth, monthEvents]) => ({
      yearMonth,
      events: sortEvents(monthEvents, 'date-asc'),
    }))
    .sort((a, b) => a.yearMonth.localeCompare(b.yearMonth));
}

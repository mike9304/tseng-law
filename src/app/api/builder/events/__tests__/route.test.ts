import { NextRequest } from 'next/server';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { requireBuilderAdminAuth } from '@/lib/builder/columns/auth';
import { guardMutation } from '@/lib/builder/security/guard';
import {
  createEvent,
  listEvents,
  validateEvent,
} from '@/lib/builder/events/events-engine';
import { GET, POST } from '../route';

vi.mock('@/lib/builder/columns/auth', () => ({
  requireBuilderAdminAuth: vi.fn(() => ({ user: { id: 'admin-1' } })),
}));

vi.mock('@/lib/builder/security/guard', () => ({
  guardMutation: vi.fn(async () => ({ username: 'admin' })),
}));

vi.mock('@/lib/builder/events/events-engine', () => ({
  createEvent: vi.fn(),
  filterEventsByCategory: vi.fn((events) => events),
  filterEventsByLocale: vi.fn((events, locale) => events.filter((event: { locale: string }) => event.locale === locale)),
  filterEventsByStatus: vi.fn((events) => events),
  filterEventsByTime: vi.fn((events) => events),
  listEvents: vi.fn(),
  searchEvents: vi.fn((events) => events),
  sortEvents: vi.fn((events) => events),
  validateEvent: vi.fn(),
}));

const eventRecord = {
  eventId: 'evt-1',
  slug: 'event-one',
  title: 'Event One',
  description: 'Event description',
  date: '2026-06-18',
  time: '14:00',
  location: 'Taipei',
  capacity: 80,
  registeredCount: 0,
  category: 'seminar',
  locale: 'ko',
  status: 'published',
  rsvpEnabled: true,
  ticketType: 'free',
  ticketPriceTwd: 0,
  ticketCurrency: 'TWD',
  createdAt: '2026-06-03T00:00:00.000Z',
  updatedAt: '2026-06-03T00:00:00.000Z',
};

const requireBuilderAdminAuthMock = vi.mocked(requireBuilderAdminAuth);
const guardMutationMock = vi.mocked(guardMutation);
const createEventMock = vi.mocked(createEvent);
const listEventsMock = vi.mocked(listEvents);
const validateEventMock = vi.mocked(validateEvent);

function getRequest(query = ''): NextRequest {
  return new NextRequest(`https://law.example.test/api/builder/events${query ? `?${query}` : ''}`);
}

function postRequest(
  query = '',
  body: string | unknown = {
    locale: 'ko',
    title: 'Event One',
    description: 'Event description',
    date: '2026-06-18',
    time: '14:00',
    location: 'Taipei',
    capacity: 80,
    category: 'seminar',
    status: 'published',
    rsvpEnabled: true,
    ticketType: 'free',
    ticketPriceTwd: 0,
    ticketCurrency: 'TWD',
  },
): NextRequest {
  return new NextRequest(`https://law.example.test/api/builder/events${query ? `?${query}` : ''}`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: typeof body === 'string' ? body : JSON.stringify(body),
  });
}

describe('/api/builder/events', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    requireBuilderAdminAuthMock.mockReturnValue({ user: { id: 'admin-1' } } as never);
    guardMutationMock.mockResolvedValue({ username: 'admin' } as never);
    listEventsMock.mockResolvedValue([eventRecord] as never);
    createEventMock.mockResolvedValue(eventRecord as never);
    validateEventMock.mockReturnValue([]);
  });

  it('returns events while preserving success response shape', async () => {
    const response = await GET(getRequest('locale=ko&scope=all&status=all&time=all'));
    const payload = await response.json();

    expect(response.status).toBe(200);
    expect(requireBuilderAdminAuthMock).toHaveBeenCalled();
    expect(payload).toEqual({
      ok: true,
      locale: 'ko',
      total: 1,
      events: [eventRecord],
    });
  });

  it('returns localized query validation errors', async () => {
    const response = await GET(getRequest('locale=zh-hant&status=bad'));
    const payload = await response.json();

    expect(response.status).toBe(400);
    expect(payload).toMatchObject({
      ok: false,
      error: '請確認活動請求內容。',
      errorCode: 'validation_error',
    });
    expect(payload.issues).toBeDefined();
    expect(listEventsMock).not.toHaveBeenCalled();
  });

  it('returns localized list failures without leaking exception details', async () => {
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => undefined);
    listEventsMock.mockRejectedValueOnce(new Error('events storage secret leaked'));

    const response = await GET(getRequest('locale=en'));
    const payload = await response.json();

    expect(response.status).toBe(500);
    expect(payload).toEqual({
      ok: false,
      error: 'Unable to load events.',
      errorCode: 'events_list_failed',
    });
    expect(JSON.stringify(payload)).not.toContain('events storage secret leaked');
    expect(consoleError).toHaveBeenCalledWith('[builder/events] GET failed:', expect.any(Error));
    consoleError.mockRestore();
  });

  it('returns localized invalid JSON errors', async () => {
    const response = await POST(postRequest('locale=en', '{'));
    const payload = await response.json();

    expect(response.status).toBe(400);
    expect(payload).toEqual({
      ok: false,
      error: 'Check the event request format.',
      errorCode: 'invalid_json',
    });
  });

  it('returns localized create validation errors using the body locale', async () => {
    const response = await POST(postRequest('', {
      locale: 'zh-hant',
      title: '',
      date: '2026-06-18',
      time: '14:00',
      location: 'Taipei',
    }));
    const payload = await response.json();

    expect(response.status).toBe(400);
    expect(payload).toMatchObject({
      ok: false,
      error: '請確認活動請求內容。',
      errorCode: 'validation_error',
    });
    expect(createEventMock).not.toHaveBeenCalled();
  });

  it('returns localized engine validation errors without leaking raw validation strings', async () => {
    validateEventMock.mockReturnValueOnce(['제목을 입력하세요.']);

    const response = await POST(postRequest('', {
      locale: 'en',
      title: 'Event One',
      description: 'Event description',
      date: '2026-06-18',
      time: '14:00',
      location: 'Taipei',
      capacity: 80,
      category: 'seminar',
      status: 'published',
      rsvpEnabled: true,
      ticketType: 'free',
      ticketPriceTwd: 0,
      ticketCurrency: 'TWD',
    }));
    const payload = await response.json();

    expect(response.status).toBe(400);
    expect(payload).toEqual({
      ok: false,
      error: 'Check the event request.',
      errorCode: 'validation_error',
    });
    expect(JSON.stringify(payload)).not.toContain('제목을 입력하세요.');
  });

  it('returns localized create failures without leaking exception details', async () => {
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => undefined);
    createEventMock.mockRejectedValueOnce(new Error('event create secret leaked'));

    const response = await POST(postRequest('locale=ko'));
    const payload = await response.json();

    expect(response.status).toBe(500);
    expect(payload).toEqual({
      ok: false,
      error: '이벤트를 만들지 못했습니다.',
      errorCode: 'event_create_failed',
    });
    expect(JSON.stringify(payload)).not.toContain('event create secret leaked');
    expect(consoleError).toHaveBeenCalledWith('[builder/events] POST failed:', expect.any(Error));
    consoleError.mockRestore();
  });
});

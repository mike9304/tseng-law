import { NextRequest } from 'next/server';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { requireBuilderAdminAuth } from '@/lib/builder/columns/auth';
import { guardMutation } from '@/lib/builder/security/guard';
import {
  deleteEvent,
  loadEvent,
  saveEvent,
  validateEvent,
} from '@/lib/builder/events/events-engine';
import { DELETE, GET, PATCH } from '../route';

vi.mock('@/lib/builder/columns/auth', () => ({
  requireBuilderAdminAuth: vi.fn(() => ({ user: { id: 'admin-1' } })),
}));

vi.mock('@/lib/builder/security/guard', () => ({
  guardMutation: vi.fn(async () => ({ username: 'admin' })),
}));

vi.mock('@/lib/builder/events/events-engine', () => ({
  deleteEvent: vi.fn(),
  loadEvent: vi.fn(),
  saveEvent: vi.fn(),
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
const deleteEventMock = vi.mocked(deleteEvent);
const loadEventMock = vi.mocked(loadEvent);
const saveEventMock = vi.mocked(saveEvent);
const validateEventMock = vi.mocked(validateEvent);

function request(query = ''): NextRequest {
  return new NextRequest(`https://law.example.test/api/builder/events/evt-1${query ? `?${query}` : ''}`);
}

function patchRequest(query = '', body: string | unknown = { status: 'draft' }): NextRequest {
  return new NextRequest(`https://law.example.test/api/builder/events/evt-1${query ? `?${query}` : ''}`, {
    method: 'PATCH',
    headers: { 'content-type': 'application/json' },
    body: typeof body === 'string' ? body : JSON.stringify(body),
  });
}

describe('/api/builder/events/[eventId]', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    requireBuilderAdminAuthMock.mockReturnValue({ user: { id: 'admin-1' } } as never);
    guardMutationMock.mockResolvedValue({ username: 'admin' } as never);
    deleteEventMock.mockResolvedValue(undefined as never);
    loadEventMock.mockResolvedValue(eventRecord as never);
    saveEventMock.mockResolvedValue({ ...eventRecord, status: 'draft' } as never);
    validateEventMock.mockReturnValue([]);
  });

  it('returns an event while preserving success response shape', async () => {
    const response = await GET(request('scope=all&locale=ko'), { params: { eventId: 'evt-1' } });
    const payload = await response.json();

    expect(response.status).toBe(200);
    expect(requireBuilderAdminAuthMock).toHaveBeenCalled();
    expect(payload).toEqual({
      ok: true,
      event: eventRecord,
    });
  });

  it('returns localized not-found errors', async () => {
    loadEventMock.mockResolvedValueOnce(null as never);

    const response = await GET(request('locale=zh-hant'), { params: { eventId: 'missing' } });
    const payload = await response.json();

    expect(response.status).toBe(404);
    expect(payload).toEqual({
      ok: false,
      error: '找不到活動。',
      errorCode: 'event_not_found',
    });
  });

  it('returns localized load failures without leaking exception details', async () => {
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => undefined);
    loadEventMock.mockRejectedValueOnce(new Error('event load secret leaked'));

    const response = await GET(request('locale=en'), { params: { eventId: 'evt-1' } });
    const payload = await response.json();

    expect(response.status).toBe(500);
    expect(payload).toEqual({
      ok: false,
      error: 'Unable to load the event.',
      errorCode: 'event_load_failed',
    });
    expect(JSON.stringify(payload)).not.toContain('event load secret leaked');
    expect(consoleError).toHaveBeenCalledWith('[builder/events/:eventId] GET failed:', expect.any(Error));
    consoleError.mockRestore();
  });

  it('returns localized invalid JSON errors for patches', async () => {
    const response = await PATCH(patchRequest('locale=en', '{'), { params: { eventId: 'evt-1' } });
    const payload = await response.json();

    expect(response.status).toBe(400);
    expect(payload).toEqual({
      ok: false,
      error: 'Check the event request format.',
      errorCode: 'invalid_json',
    });
  });

  it('returns localized update validation errors without leaking raw validation strings', async () => {
    validateEventMock.mockReturnValueOnce(['제목을 입력하세요.']);

    const response = await PATCH(patchRequest('locale=en'), { params: { eventId: 'evt-1' } });
    const payload = await response.json();

    expect(response.status).toBe(400);
    expect(payload).toEqual({
      ok: false,
      error: 'Check the event request.',
      errorCode: 'validation_error',
    });
    expect(JSON.stringify(payload)).not.toContain('제목을 입력하세요.');
  });

  it('updates an event while preserving success response shape', async () => {
    const response = await PATCH(patchRequest('locale=ko'), { params: { eventId: 'evt-1' } });
    const payload = await response.json();

    expect(response.status).toBe(200);
    expect(saveEventMock).toHaveBeenCalledWith({ ...eventRecord, status: 'draft' });
    expect(payload).toEqual({
      ok: true,
      event: { ...eventRecord, status: 'draft' },
    });
  });

  it('returns localized update failures without leaking exception details', async () => {
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => undefined);
    saveEventMock.mockRejectedValueOnce(new Error('event save secret leaked'));

    const response = await PATCH(patchRequest('locale=zh-hant'), { params: { eventId: 'evt-1' } });
    const payload = await response.json();

    expect(response.status).toBe(500);
    expect(payload).toEqual({
      ok: false,
      error: '無法儲存活動。',
      errorCode: 'event_update_failed',
    });
    expect(JSON.stringify(payload)).not.toContain('event save secret leaked');
    expect(consoleError).toHaveBeenCalledWith('[builder/events/:eventId] PATCH failed:', expect.any(Error));
    consoleError.mockRestore();
  });

  it('returns localized delete failures without leaking exception details', async () => {
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => undefined);
    deleteEventMock.mockRejectedValueOnce(new Error('event delete secret leaked'));

    const response = await DELETE(request('locale=en'), { params: { eventId: 'evt-1' } });
    const payload = await response.json();

    expect(response.status).toBe(500);
    expect(payload).toEqual({
      ok: false,
      error: 'Unable to delete the event.',
      errorCode: 'event_delete_failed',
    });
    expect(JSON.stringify(payload)).not.toContain('event delete secret leaked');
    expect(consoleError).toHaveBeenCalledWith('[builder/events/:eventId] DELETE failed:', expect.any(Error));
    consoleError.mockRestore();
  });
});

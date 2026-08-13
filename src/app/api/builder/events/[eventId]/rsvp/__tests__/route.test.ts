import { NextRequest } from 'next/server';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import {
  registerAttendee,
  validateAttendee,
} from '@/lib/builder/events/events-engine';
import { POST } from '../route';

vi.mock('@/lib/builder/events/events-engine', () => ({
  registerAttendee: vi.fn(),
  validateAttendee: vi.fn(),
}));

const attendee = {
  attendeeId: 'att-1',
  eventId: 'evt-1',
  name: 'RSVP User',
  email: 'rsvp@example.com',
  ticketQuantity: 1,
  paymentStatus: 'not-required',
  status: 'registered',
  registeredAt: '2026-06-03T00:00:00.000Z',
};

const registerAttendeeMock = vi.mocked(registerAttendee);
const validateAttendeeMock = vi.mocked(validateAttendee);

function request(
  query = '',
  body: string | unknown = {
    name: 'RSVP User',
    email: 'rsvp@example.com',
    ticketQuantity: 1,
  },
): NextRequest {
  return new NextRequest(`https://law.example.test/api/builder/events/evt-1/rsvp${query ? `?${query}` : ''}`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: typeof body === 'string' ? body : JSON.stringify(body),
  });
}

describe('/api/builder/events/[eventId]/rsvp', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    registerAttendeeMock.mockResolvedValue(attendee as never);
    validateAttendeeMock.mockReturnValue([]);
  });

  it('registers attendees while preserving success response shape', async () => {
    const response = await POST(request('locale=ko'), { params: Promise.resolve({ eventId: 'evt-1' }) });
    const payload = await response.json();

    expect(response.status).toBe(201);
    expect(registerAttendeeMock).toHaveBeenCalledWith('evt-1', {
      name: 'RSVP User',
      email: 'rsvp@example.com',
      ticketQuantity: 1,
    });
    expect(payload).toEqual({
      ok: true,
      attendee,
    });
  });

  it('returns localized invalid JSON errors', async () => {
    const response = await POST(request('locale=zh-hant', '{'), { params: Promise.resolve({ eventId: 'evt-1' }) });
    const payload = await response.json();

    expect(response.status).toBe(400);
    expect(payload).toEqual({
      ok: false,
      error: '請確認活動請求格式。',
      errorCode: 'invalid_json',
    });
  });

  it('returns localized RSVP validation errors using the query locale', async () => {
    const response = await POST(request('locale=zh-hant', {
      name: '',
      email: 'not-email',
      ticketQuantity: 1,
    }), { params: Promise.resolve({ eventId: 'evt-1' }) });
    const payload = await response.json();

    expect(response.status).toBe(400);
    expect(payload).toMatchObject({
      ok: false,
      error: '請確認活動請求內容。',
      errorCode: 'validation_error',
    });
    expect(payload.issues).toBeDefined();
    expect(registerAttendeeMock).not.toHaveBeenCalled();
  });

  it('returns localized engine validation errors without leaking raw validation strings', async () => {
    validateAttendeeMock.mockReturnValueOnce(['이름을 입력하세요.']);

    const response = await POST(request('locale=en'), { params: Promise.resolve({ eventId: 'evt-1' }) });
    const payload = await response.json();

    expect(response.status).toBe(400);
    expect(payload).toEqual({
      ok: false,
      error: 'Check the event request.',
      errorCode: 'validation_error',
    });
    expect(JSON.stringify(payload)).not.toContain('이름을 입력하세요.');
    expect(registerAttendeeMock).not.toHaveBeenCalled();
  });

  it('maps missing event errors to localized not-found payloads', async () => {
    registerAttendeeMock.mockRejectedValueOnce(new Error('이벤트를 찾을 수 없습니다.'));

    const response = await POST(request('locale=zh-hant'), { params: Promise.resolve({ eventId: 'evt-1' }) });
    const payload = await response.json();

    expect(response.status).toBe(404);
    expect(payload).toEqual({
      ok: false,
      error: '找不到活動。',
      errorCode: 'event_not_found',
    });
  });

  it('maps full-capacity errors without leaking raw exception text', async () => {
    registerAttendeeMock.mockRejectedValueOnce(new Error('등록이 마감되었습니다.'));

    const response = await POST(request('locale=en'), { params: Promise.resolve({ eventId: 'evt-1' }) });
    const payload = await response.json();

    expect(response.status).toBe(400);
    expect(payload).toEqual({
      ok: false,
      error: 'This event is fully booked.',
      errorCode: 'event_rsvp_full',
    });
    expect(JSON.stringify(payload)).not.toContain('등록이 마감되었습니다.');
  });
});

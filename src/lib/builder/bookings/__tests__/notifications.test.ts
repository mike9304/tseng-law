import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { renderBookingEmail } from '@/lib/builder/bookings/email-templates';
import type { Booking } from '@/lib/builder/bookings/types';
import {
  isBookingEmailConfigured,
  sendBookingConfirmation,
  sendBookingReminder,
} from '@/lib/builder/bookings/notifications';

vi.mock('@/lib/builder/bookings/email-templates', () => ({
  renderBookingEmail: vi.fn(async (type: string) => ({
    subject: `subject:${type}`,
    html: '<p>email</p>',
    text: 'email',
  })),
}));

const booking: Booking = {
  bookingId: 'bk-email-1',
  serviceId: 'svc-1',
  staffId: 'staff-1',
  customer: { name: 'Client', email: 'client@example.test', locale: 'ko' },
  startAt: '2026-07-14T00:00:00.000Z',
  endAt: '2026-07-14T01:00:00.000Z',
  status: 'confirmed',
  source: 'web',
  createdAt: '2026-07-01T00:00:00.000Z',
  updatedAt: '2026-07-01T00:00:00.000Z',
  reminders: [],
};

describe('booking email delivery', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    delete process.env.RESEND_API_KEY;
    delete process.env.BOOKINGS_ADMIN_EMAIL;
    delete process.env.FORMS_EMAIL_FROM;
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.unstubAllGlobals();
  });

  it.each([undefined, '   '])('fails closed when the Resend key is %s', async (apiKey) => {
    if (apiKey === undefined) delete process.env.RESEND_API_KEY;
    else process.env.RESEND_API_KEY = apiKey;
    const fetchMock = vi.fn();
    vi.stubGlobal('fetch', fetchMock);

    expect(isBookingEmailConfigured()).toBe(false);
    await expect(sendBookingReminder(booking, { reminderType: 'email-reminder-24h' })).resolves.toEqual({
      ok: false,
      provider: 'resend',
      reason: 'unconfigured',
    });
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('returns the provider id for an accepted response and trims the configured key', async () => {
    process.env.RESEND_API_KEY = '  resend-secret  ';
    const fetchMock = vi.fn(async (_input: RequestInfo | URL, _init?: RequestInit) => new Response(JSON.stringify({ id: ' email-123 ' }), {
      status: 202,
      headers: { 'Content-Type': 'application/json' },
    }));
    vi.stubGlobal('fetch', fetchMock);

    await expect(sendBookingReminder(booking, { reminderType: 'email-reminder-24h' })).resolves.toEqual({
      ok: true,
      provider: 'resend',
      id: 'email-123',
    });
    const request = fetchMock.mock.calls[0]?.[1] as RequestInit;
    expect(request.headers).toMatchObject({
      Authorization: 'Bearer resend-secret',
      'Idempotency-Key': expect.stringMatching(/^booking-email:v1:reminder:[a-f0-9]{64}$/),
    });
  });

  it('treats an accepted response with an unreadable body as success without an id', async () => {
    process.env.RESEND_API_KEY = 'resend-secret';
    vi.stubGlobal('fetch', vi.fn(async () => new Response('not-json', { status: 200 })));

    await expect(sendBookingReminder(booking, { reminderType: 'email-reminder-24h' })).resolves.toEqual({
      ok: true,
      provider: 'resend',
    });
  });

  it('returns a sanitized provider failure for non-2xx and network failures', async () => {
    process.env.RESEND_API_KEY = 'resend-secret';
    vi.stubGlobal('fetch', vi.fn(async () => new Response('sensitive provider body', { status: 429 })));
    await expect(sendBookingReminder(booking, { reminderType: 'email-reminder-24h' })).resolves.toEqual({
      ok: false,
      provider: 'resend',
      reason: 'provider_error',
      status: 429,
    });

    vi.stubGlobal('fetch', vi.fn(async () => { throw new Error('network secret'); }));
    await expect(sendBookingReminder(booking, { reminderType: 'email-reminder-24h' })).resolves.toEqual({
      ok: false,
      provider: 'resend',
      reason: 'provider_error',
    });
  });

  it('returns aggregate confirmation results and omits admin when there is no recipient', async () => {
    process.env.RESEND_API_KEY = 'resend-secret';
    vi.stubGlobal('fetch', vi.fn(async () => new Response('{}', { status: 200 })));

    await expect(sendBookingConfirmation(booking)).resolves.toEqual({
      ok: true,
      customer: { ok: true, provider: 'resend' },
    });
    expect(renderBookingEmail).toHaveBeenCalledTimes(1);

    process.env.BOOKINGS_ADMIN_EMAIL = 'admin@example.test';
    await expect(sendBookingConfirmation(booking)).resolves.toEqual({
      ok: true,
      customer: { ok: true, provider: 'resend' },
      admin: { ok: true, provider: 'resend' },
    });
  });

  it('marks the confirmation aggregate failed when any attempted delivery fails', async () => {
    process.env.RESEND_API_KEY = 'resend-secret';
    process.env.BOOKINGS_ADMIN_EMAIL = 'admin@example.test';
    const fetchMock = vi.fn()
      .mockResolvedValueOnce(new Response('{}', { status: 200 }))
      .mockResolvedValueOnce(new Response('provider details', { status: 503 }));
    vi.stubGlobal('fetch', fetchMock);

    const result = await sendBookingConfirmation(booking);

    expect(result).toEqual({
      ok: false,
      customer: { ok: true, provider: 'resend' },
      admin: { ok: false, provider: 'resend', reason: 'provider_error', status: 503 },
    });
    const keys = fetchMock.mock.calls.map((call) => (
      (call[1]?.headers as Record<string, string>)['Idempotency-Key']
    ));
    expect(keys[0]).not.toBe(keys[1]);
  });

  it('uses the same non-PII idempotency key for concurrent reminder retries', async () => {
    process.env.RESEND_API_KEY = 'resend-secret';
    const fetchMock = vi.fn(async (_input: RequestInfo | URL, _init?: RequestInit) => (
      new Response('{}', { status: 202 })
    ));
    vi.stubGlobal('fetch', fetchMock);

    await Promise.all([
      sendBookingReminder(booking, { reminderType: 'email-reminder-24h' }),
      sendBookingReminder(booking, { reminderType: 'email-reminder-24h' }),
    ]);

    const keys = fetchMock.mock.calls.map((call) => (
      (call[1]?.headers as Record<string, string>)['Idempotency-Key']
    ));
    expect(keys).toHaveLength(2);
    expect(keys[0]).toBe(keys[1]);
    expect(keys[0]?.length).toBeLessThanOrEqual(256);
    expect(keys[0]).not.toContain(booking.bookingId);
    expect(keys[0]).not.toContain(booking.customer.email);
    expect(keys[0]).not.toContain(booking.customer.name);
  });

  it('aborts a provider request after the timeout and clears the timer', async () => {
    vi.useFakeTimers();
    process.env.RESEND_API_KEY = 'resend-secret';
    let capturedSignal: AbortSignal | undefined;
    vi.stubGlobal('fetch', vi.fn((_input: RequestInfo | URL, init?: RequestInit) => {
      capturedSignal = init?.signal ?? undefined;
      return new Promise<Response>((_resolve, reject) => {
        capturedSignal?.addEventListener('abort', () => reject(new DOMException('aborted', 'AbortError')));
      });
    }));

    const delivery = sendBookingReminder(booking, { reminderType: 'email-reminder-1h' });
    await vi.advanceTimersByTimeAsync(5_000);

    await expect(delivery).resolves.toEqual({
      ok: false,
      provider: 'resend',
      reason: 'provider_error',
    });
    expect(capturedSignal?.aborted).toBe(true);
    expect(vi.getTimerCount()).toBe(0);
    vi.useRealTimers();
  });
});

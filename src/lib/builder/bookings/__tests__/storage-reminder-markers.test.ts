import { promises as fs } from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import type { Booking } from '@/lib/builder/bookings/types';

vi.mock('@/lib/builder/apps/hook-runtime', () => ({
  dispatchAppHookEvent: vi.fn(async () => undefined),
}));

function booking(overrides: Partial<Booking> = {}): Booking {
  return {
    bookingId: 'bk-storage-reminder',
    serviceId: 'svc-1',
    staffId: 'staff-1',
    customer: { name: 'Original client', email: 'client@example.test', locale: 'ko' },
    startAt: '2026-07-14T00:00:00.000Z',
    endAt: '2026-07-14T01:00:00.000Z',
    status: 'confirmed',
    source: 'web',
    createdAt: '2026-07-01T00:00:00.000Z',
    updatedAt: '2026-07-01T00:00:00.000Z',
    reminders: [],
    ...overrides,
  };
}

describe('booking reminder marker storage', () => {
  let root: string;

  beforeEach(async () => {
    root = await fs.mkdtemp(path.join(os.tmpdir(), 'tseng-booking-reminders-'));
    process.env.BUILDER_BOOKINGS_ROOT = root;
    process.env.BUILDER_BOOKINGS_BACKEND = 'local';
    delete process.env.BLOB_READ_WRITE_TOKEN;
    vi.resetModules();
  });

  afterEach(async () => {
    delete process.env.BUILDER_BOOKINGS_ROOT;
    delete process.env.BUILDER_BOOKINGS_BACKEND;
    await fs.rm(root, { recursive: true, force: true });
  });

  it('appends onto the latest booking without overwriting cancellation, payment, document, or customer fields', async () => {
    const storage = await import('@/lib/builder/bookings/storage');
    const latest = booking({
      status: 'cancelled',
      paymentStatus: 'paid',
      paymentIntentId: 'pi-latest',
      cancellationReason: 'client request',
      cancelledAt: '2026-07-12T10:00:00.000Z',
      customer: { name: 'Updated client', email: 'updated@example.test', locale: 'en' },
      billingDocuments: [{
        documentId: 'doc-latest',
        type: 'receipt',
        number: 'R-100',
        status: 'issued',
        currency: 'TWD',
        amount: 3000,
        refundedAmount: 0,
        balanceDue: 0,
        recipientEmail: 'updated@example.test',
        recipientName: 'Updated client',
        actor: 'admin',
        issuedAt: '2026-07-12T09:00:00.000Z',
      }],
    });
    await storage.saveBooking(latest);

    const result = await storage.appendBookingReminderMarker(latest.bookingId, {
      sentAt: '2026-07-13T00:00:00.000Z',
      type: 'email-reminder-24h',
    });

    expect(result).toMatchObject({
      ok: true,
      booking: {
        status: 'cancelled',
        paymentStatus: 'paid',
        paymentIntentId: 'pi-latest',
        cancellationReason: 'client request',
        customer: { name: 'Updated client', email: 'updated@example.test' },
        billingDocuments: [{ documentId: 'doc-latest', status: 'issued' }],
      },
    });
    expect(await storage.getBooking(latest.bookingId)).toEqual(result.ok ? result.booking : null);
  });

  it('does not let a stale full save erase an accepted reminder marker', async () => {
    const storage = await import('@/lib/builder/bookings/storage');
    const stale = booking();
    await storage.saveBooking(stale);
    await Promise.all([
      storage.appendBookingReminderMarker(stale.bookingId, {
        sentAt: '2026-07-13T00:00:00.000Z',
        type: 'email-reminder-24h',
      }),
      storage.saveBooking({ ...stale, status: 'cancelled' }),
    ]);

    expect(await storage.getBooking(stale.bookingId)).toMatchObject({
      status: 'cancelled',
      reminders: [{ sentAt: '2026-07-13T00:00:00.000Z', type: 'email-reminder-24h' }],
    });
  });

  it('deduplicates repeated appends by reminder type', async () => {
    const storage = await import('@/lib/builder/bookings/storage');
    const original = booking();
    await storage.saveBooking(original);

    const first = await storage.appendBookingReminderMarker(original.bookingId, {
      sentAt: '2026-07-13T00:00:00.000Z',
      type: 'email-reminder-24h',
    });
    const second = await storage.appendBookingReminderMarker(original.bookingId, {
      sentAt: '2026-07-13T00:01:00.000Z',
      type: 'email-reminder-24h',
    });

    expect(first.ok && first.booking.reminders).toEqual([
      { sentAt: '2026-07-13T00:00:00.000Z', type: 'email-reminder-24h' },
    ]);
    expect(second.ok && second.booking.reminders).toEqual([
      { sentAt: '2026-07-13T00:00:00.000Z', type: 'email-reminder-24h' },
    ]);
    expect(second).toEqual(first);
  });

  it('returns an explicit not-found result', async () => {
    const storage = await import('@/lib/builder/bookings/storage');

    await expect(storage.appendBookingReminderMarker('missing', {
      sentAt: '2026-07-13T00:00:00.000Z',
      type: 'email-reminder-24h',
    })).resolves.toEqual({ ok: false, reason: 'not_found' });
  });
});

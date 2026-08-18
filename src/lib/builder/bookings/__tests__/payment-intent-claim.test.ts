import { promises as fs } from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

describe('booking PaymentIntent claims (file backend)', () => {
  let root: string;

  beforeEach(async () => {
    root = await fs.mkdtemp(path.join(os.tmpdir(), 'tseng-booking-pi-claim-'));
    process.env.BUILDER_BOOKINGS_ROOT = root;
    process.env.BUILDER_BOOKINGS_BACKEND = 'local';
    delete process.env.BLOB_READ_WRITE_TOKEN;
    vi.resetModules();
  });

  afterEach(async () => {
    delete process.env.BUILDER_BOOKINGS_ROOT;
    delete process.env.BUILDER_BOOKINGS_BACKEND;
    await fs.rm(root, { recursive: true, force: true });
    vi.resetModules();
  });

  it('allows only one booking to claim the same PaymentIntent', async () => {
    const { claimBookingPaymentIntent } = await import('@/lib/builder/bookings/storage');

    const [first, second] = await Promise.all([
      claimBookingPaymentIntent('pi_same_intent', 'booking-a'),
      claimBookingPaymentIntent('pi_same_intent', 'booking-b'),
    ]);

    expect([first.claimed, second.claimed].sort()).toEqual([false, true]);
  });

  it('treats a repeated claim by the same booking as idempotent', async () => {
    const { claimBookingPaymentIntent } = await import('@/lib/builder/bookings/storage');

    await expect(claimBookingPaymentIntent('pi_idempotent', 'booking-a')).resolves.toEqual({
      claimed: true,
      idempotent: false,
    });
    await expect(claimBookingPaymentIntent('pi_idempotent', 'booking-a')).resolves.toEqual({
      claimed: true,
      idempotent: true,
    });
  });

  it('lets only the owning booking release a claim for rollback', async () => {
    const {
      claimBookingPaymentIntent,
      releaseBookingPaymentIntentClaim,
    } = await import('@/lib/builder/bookings/storage');

    await expect(claimBookingPaymentIntent('pi_rollback', 'booking-a')).resolves.toMatchObject({
      claimed: true,
    });
    await expect(releaseBookingPaymentIntentClaim('pi_rollback', 'booking-b')).resolves.toBe(false);
    await expect(claimBookingPaymentIntent('pi_rollback', 'booking-b')).resolves.toEqual({
      claimed: false,
    });
    await expect(releaseBookingPaymentIntentClaim('pi_rollback', 'booking-a')).resolves.toBe(true);
    await expect(claimBookingPaymentIntent('pi_rollback', 'booking-b')).resolves.toEqual({
      claimed: true,
      idempotent: false,
    });
  });

  it('fails closed for a PaymentIntent already stored on a legacy booking', async () => {
    const bookingsDirectory = path.join(root, 'bookings');
    await fs.mkdir(bookingsDirectory, { recursive: true });
    await fs.writeFile(
      path.join(bookingsDirectory, 'legacy-booking.json'),
      JSON.stringify({
        bookingId: 'legacy-booking',
        paymentIntentId: 'pi_legacy',
      }),
      'utf8',
    );
    const { claimBookingPaymentIntent } = await import('@/lib/builder/bookings/storage');

    await expect(claimBookingPaymentIntent('pi_legacy', 'new-booking')).resolves.toEqual({
      claimed: false,
    });
    await expect(claimBookingPaymentIntent('pi_legacy', 'legacy-booking')).resolves.toEqual({
      claimed: true,
      idempotent: true,
    });
  });

  it('hashes the PaymentIntent id instead of using it as a path segment', async () => {
    const { claimBookingPaymentIntent } = await import('@/lib/builder/bookings/storage');

    await expect(claimBookingPaymentIntent('../pi/path-like', 'booking-a')).resolves.toMatchObject({
      claimed: true,
    });

    const files = await fs.readdir(path.join(root, 'payment-intent-claims'));
    expect(files).toHaveLength(1);
    expect(files[0]).toMatch(/^[a-f0-9]{64}\.json$/);
    expect(files[0]).not.toContain('pi');
  });
});

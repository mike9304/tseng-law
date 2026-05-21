import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { Booking, BookingPackage, BookingPackageCredit } from '@/lib/builder/bookings/types';
import { createLocalizedText } from '@/lib/builder/bookings/types';
import {
  findApplicablePackageCredit,
  redeemPackageCreditForBooking,
  restorePackageCreditForBooking,
} from '@/lib/builder/bookings/packages';

const fixtures = vi.hoisted(() => ({
  packages: [] as BookingPackage[],
  credits: [] as BookingPackageCredit[],
}));

vi.mock('@/lib/builder/bookings/storage', () => ({
  listPackages: vi.fn(async () => fixtures.packages),
  getPackage: vi.fn(async (packageId: string) =>
    fixtures.packages.find((pkg) => pkg.packageId === packageId) ?? null,
  ),
  listPackageCredits: vi.fn(async (options: { customerEmail?: string; status?: BookingPackageCredit['status'] } = {}) =>
    fixtures.credits
      .filter((credit) => !options.customerEmail || credit.customerEmail === options.customerEmail)
      .filter((credit) => !options.status || credit.status === options.status),
  ),
  getPackageCredit: vi.fn(async (creditId: string) =>
    fixtures.credits.find((credit) => credit.creditId === creditId) ?? null,
  ),
  savePackageCredit: vi.fn(async (credit: BookingPackageCredit) => {
    fixtures.credits = fixtures.credits.map((item) => item.creditId === credit.creditId ? credit : item);
  }),
  timestamped: vi.fn((value, createdAt) => ({
    ...value,
    createdAt: createdAt || '2026-01-01T00:00:00.000Z',
    updatedAt: '2026-01-02T00:00:00.000Z',
  })),
}));

function pkg(overrides: Partial<BookingPackage> = {}): BookingPackage {
  return {
    packageId: 'pkg-test',
    name: createLocalizedText('Consultation package'),
    description: createLocalizedText('Three sessions'),
    eligibleServiceIds: ['svc-paid'],
    credits: 3,
    validityDays: 180,
    priceAmount: 15000,
    priceCurrency: 'TWD',
    isActive: true,
    createdAt: '2026-01-01T00:00:00.000Z',
    updatedAt: '2026-01-01T00:00:00.000Z',
    ...overrides,
  };
}

function credit(overrides: Partial<BookingPackageCredit> = {}): BookingPackageCredit {
  return {
    creditId: 'pc-test',
    packageId: 'pkg-test',
    customerEmail: 'client@example.com',
    customerName: 'Client',
    totalCredits: 3,
    remainingCredits: 2,
    status: 'active',
    redemptions: [],
    createdAt: '2026-01-01T00:00:00.000Z',
    updatedAt: '2026-01-01T00:00:00.000Z',
    ...overrides,
  };
}

function booking(overrides: Partial<Booking> = {}): Booking {
  return {
    bookingId: 'bk-test',
    serviceId: 'svc-paid',
    staffId: 'staff-test',
    customer: { name: 'Client', email: 'client@example.com', locale: 'ko' },
    startAt: '2099-01-05T00:00:00.000Z',
    endAt: '2099-01-05T00:30:00.000Z',
    status: 'confirmed',
    source: 'web',
    createdAt: '2026-01-01T00:00:00.000Z',
    updatedAt: '2026-01-01T00:00:00.000Z',
    reminders: [],
    ...overrides,
  };
}

describe('booking package credits', () => {
  beforeEach(() => {
    fixtures.packages = [pkg()];
    fixtures.credits = [credit()];
  });

  it('finds active customer credits for eligible services', async () => {
    const match = await findApplicablePackageCredit({
      customerEmail: 'client@example.com',
      serviceId: 'svc-paid',
      at: '2026-01-10T00:00:00.000Z',
    });

    expect(match?.credit.creditId).toBe('pc-test');
    expect(match?.package.packageId).toBe('pkg-test');
  });

  it('redeems one credit and marks exhausted credits as used', async () => {
    fixtures.credits = [credit({ remainingCredits: 1 })];

    const result = await redeemPackageCreditForBooking({
      bookingId: 'bk-redeem',
      customerEmail: 'client@example.com',
      serviceId: 'svc-paid',
      at: '2026-01-10T00:00:00.000Z',
    });

    expect(result?.credit.remainingCredits).toBe(0);
    expect(result?.credit.status).toBe('used');
    expect(result?.credit.redemptions?.[0]).toMatchObject({ bookingId: 'bk-redeem', credits: 1 });
  });

  it('does not double-spend the same credit during concurrent redemptions', async () => {
    fixtures.credits = [credit({ remainingCredits: 1 })];

    const [first, second] = await Promise.all([
      redeemPackageCreditForBooking({
        bookingId: 'bk-first',
        customerEmail: 'client@example.com',
        serviceId: 'svc-paid',
        at: '2026-01-10T00:00:00.000Z',
      }),
      redeemPackageCreditForBooking({
        bookingId: 'bk-second',
        customerEmail: 'client@example.com',
        serviceId: 'svc-paid',
        at: '2026-01-10T00:00:00.000Z',
      }),
    ]);

    expect([first, second].filter(Boolean)).toHaveLength(1);
    expect(fixtures.credits[0].remainingCredits).toBe(0);
    expect(fixtures.credits[0].redemptions).toHaveLength(1);
  });

  it('restores a consumed credit once when a booking is cancelled', async () => {
    fixtures.credits = [credit({
      remainingCredits: 0,
      status: 'used',
      redemptions: [{ bookingId: 'bk-test', serviceId: 'svc-paid', credits: 1, usedAt: '2026-01-10T00:00:00.000Z' }],
    })];

    const restored = await restorePackageCreditForBooking(booking({
      packageId: 'pkg-test',
      packageCreditId: 'pc-test',
      packageCreditsUsed: 1,
    }));
    const restoredAgain = await restorePackageCreditForBooking(restored);

    expect(restored.packageCreditRestoredAt).toBeTruthy();
    expect(restoredAgain.packageCreditRestoredAt).toBe(restored.packageCreditRestoredAt);
    expect(fixtures.credits[0]).toMatchObject({ remainingCredits: 1, status: 'active' });
    expect(fixtures.credits[0].redemptions?.[0].restoredAt).toBeTruthy();
  });
});

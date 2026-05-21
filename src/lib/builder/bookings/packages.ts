import type {
  Booking,
  BookingPackage,
  BookingPackageCredit,
  BookingPackageCreditStatus,
} from '@/lib/builder/bookings/types';
import {
  getPackage,
  getPackageCredit,
  listPackageCredits,
  listPackages,
  savePackageCredit,
  timestamped,
} from '@/lib/builder/bookings/storage';

export function normalizePackageEmail(email: string): string {
  return email.trim().toLowerCase();
}

function nowIso(): string {
  return new Date().toISOString();
}

const creditLocks = new Map<string, number>();
const CREDIT_LOCK_MS = 15_000;

function acquireCreditLock(creditId: string): boolean {
  const now = Date.now();
  const held = creditLocks.get(creditId);
  if (held && held > now) return false;
  creditLocks.set(creditId, now + CREDIT_LOCK_MS);
  return true;
}

function releaseCreditLock(creditId: string): void {
  creditLocks.delete(creditId);
}

export function packageCoversService(pkg: BookingPackage, serviceId: string): boolean {
  return pkg.eligibleServiceIds.length === 0 || pkg.eligibleServiceIds.includes(serviceId);
}

export function isPackageCreditUsable(credit: BookingPackageCredit, at = nowIso()): boolean {
  if (credit.status !== 'active') return false;
  if (credit.remainingCredits <= 0) return false;
  if (credit.expiresAt && credit.expiresAt < at) return false;
  return true;
}

export async function findApplicablePackageCredit({
  customerEmail,
  serviceId,
  at = nowIso(),
}: {
  customerEmail: string;
  serviceId: string;
  at?: string;
}): Promise<{ credit: BookingPackageCredit; package: BookingPackage } | null> {
  const [credits, packages] = await Promise.all([
    listPackageCredits({ customerEmail: normalizePackageEmail(customerEmail), status: 'active' }),
    listPackages(true),
  ]);
  const packageById = new Map(packages.map((pkg) => [pkg.packageId, pkg]));

  for (const credit of credits) {
    if (!isPackageCreditUsable(credit, at)) continue;
    const pkg = packageById.get(credit.packageId);
    if (!pkg || !pkg.isActive || !packageCoversService(pkg, serviceId)) continue;
    return { credit, package: pkg };
  }
  return null;
}

export async function redeemPackageCreditForBooking({
  bookingId,
  customerEmail,
  serviceId,
  at = nowIso(),
}: {
  bookingId: string;
  customerEmail: string;
  serviceId: string;
  at?: string;
}): Promise<{ credit: BookingPackageCredit; package: BookingPackage } | null> {
  const match = await findApplicablePackageCredit({ customerEmail, serviceId, at });
  if (!match) return null;
  if (!acquireCreditLock(match.credit.creditId)) return null;

  try {
    const freshCredit = await getPackageCredit(match.credit.creditId);
    const freshPackage = await getPackage(match.package.packageId);
    if (!freshCredit || !freshPackage || !freshPackage.isActive) return null;
    if (!isPackageCreditUsable(freshCredit, at) || !packageCoversService(freshPackage, serviceId)) return null;

    const existingRedemption = freshCredit.redemptions?.find((redemption) => redemption.bookingId === bookingId);
    if (existingRedemption && !existingRedemption.restoredAt) {
      return { credit: freshCredit, package: freshPackage };
    }

    const remainingCredits = Math.max(0, freshCredit.remainingCredits - 1);
    const next = timestamped({
      ...freshCredit,
      remainingCredits,
      status: remainingCredits > 0 ? 'active' as const : 'used' as const,
      redemptions: [
        ...(freshCredit.redemptions ?? []),
        { bookingId, serviceId, credits: 1, usedAt: at },
      ],
    }, freshCredit.createdAt);
    await savePackageCredit(next);
    return { credit: next, package: freshPackage };
  } finally {
    releaseCreditLock(match.credit.creditId);
  }
}

export async function restorePackageCreditForBooking(booking: Booking): Promise<Booking> {
  if (!booking.packageCreditId || !booking.packageCreditsUsed || booking.packageCreditRestoredAt) return booking;

  const credit = await getPackageCredit(booking.packageCreditId);
  if (!credit) return booking;

  const restoredAt = nowIso();
  let restored = false;
  const redemptions = (credit.redemptions ?? []).map((redemption) => {
    if (redemption.bookingId !== booking.bookingId || redemption.restoredAt) return redemption;
    restored = true;
    return { ...redemption, restoredAt };
  });
  if (!restored) return booking;

  const remainingCredits = Math.min(credit.totalCredits, credit.remainingCredits + booking.packageCreditsUsed);
  const nextStatus: BookingPackageCreditStatus = credit.status === 'revoked' || credit.status === 'expired'
    ? credit.status
    : 'active';
  const next = timestamped({
    ...credit,
    remainingCredits,
    status: nextStatus,
    redemptions,
  }, credit.createdAt);
  await savePackageCredit(next);

  return {
    ...booking,
    packageCreditRestoredAt: restoredAt,
  };
}

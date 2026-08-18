import type {
  Booking,
  BookingPackage,
  BookingPackageCredit,
  BookingPackageCreditStatus,
} from '@/lib/builder/bookings/types';
import {
  getPackage,
  listPackageCredits,
  listPackages,
  mutatePackageCredit,
  timestamped,
} from '@/lib/builder/bookings/storage';

export function normalizePackageEmail(email: string): string {
  return email.trim().toLowerCase();
}

function nowIso(): string {
  return new Date().toISOString();
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
  // A competing instance can exhaust the first listed credit between the
  // lookup and CAS. Re-scan a bounded number of times so another eligible
  // credit is still usable, while every individual decrement remains atomic.
  for (let attempt = 0; attempt < 3; attempt += 1) {
    const match = await findApplicablePackageCredit({ customerEmail, serviceId, at });
    if (!match) return null;

    const redeemed = await mutatePackageCredit(match.credit.creditId, async (freshCredit) => {
      // The reducer is deliberately side-effect free: Blob CAS may invoke it
      // against a newer credit after another function instance wins the race.
      const freshPackage = await getPackage(match.package.packageId);
      if (!freshPackage || !freshPackage.isActive || !packageCoversService(freshPackage, serviceId)) {
        return null;
      }
      if (!isPackageCreditUsable(freshCredit, at)) return null;
      const existingRedemption = freshCredit.redemptions?.find((redemption) => redemption.bookingId === bookingId);
      if (existingRedemption && !existingRedemption.restoredAt) {
        return { next: freshCredit, result: { credit: freshCredit, package: freshPackage } };
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
      return { next, result: { credit: next, package: freshPackage } };
    });
    if (redeemed) return redeemed;
  }
  return null;
}

export async function restorePackageCreditForBooking(booking: Booking): Promise<Booking> {
  if (!booking.packageCreditId || !booking.packageCreditsUsed || booking.packageCreditRestoredAt) return booking;
  const creditsUsed = booking.packageCreditsUsed;

  const restoredAt = nowIso();
  const restored = await mutatePackageCredit(booking.packageCreditId, (credit) => {
    let didRestore = false;
    const redemptions = (credit.redemptions ?? []).map((redemption) => {
      if (redemption.bookingId !== booking.bookingId || redemption.restoredAt) return redemption;
      didRestore = true;
      return { ...redemption, restoredAt };
    });
    if (!didRestore) return null;

    const remainingCredits = Math.min(credit.totalCredits, credit.remainingCredits + creditsUsed);
    const nextStatus: BookingPackageCreditStatus = credit.status === 'revoked' || credit.status === 'expired'
      ? credit.status
      : 'active';
    const next = timestamped({
      ...credit,
      remainingCredits,
      status: nextStatus,
      redemptions,
    }, credit.createdAt);
    return { next, result: true };
  });

  return restored
    ? { ...booking, packageCreditRestoredAt: restoredAt }
    : booking;
}

import { createHmac, timingSafeEqual } from 'node:crypto';
import type { Booking } from '@/lib/builder/bookings/types';
import type { Locale } from '@/lib/locales';

const DEFAULT_TTL_MS = 1000 * 60 * 60 * 24 * 30;

interface TokenPayload {
  bookingId: string;
  email: string;
  exp: number;
}

export interface VerifiedBookingManageToken {
  bookingId: string;
  email: string;
}

function base64Url(input: string | Buffer): string {
  return Buffer.from(input).toString('base64url');
}

function getSecret(): string {
  return process.env.BOOKINGS_MANAGE_SECRET
    || process.env.CMS_SESSION_SECRET
    || process.env.NEXTAUTH_SECRET
    || 'dev-booking-manage-secret';
}

function sign(payloadPart: string): string {
  return createHmac('sha256', getSecret()).update(payloadPart).digest('base64url');
}

export function createBookingManageToken(
  booking: Pick<Booking, 'bookingId' | 'customer'>,
  ttlMs = DEFAULT_TTL_MS,
): string {
  const payload: TokenPayload = {
    bookingId: booking.bookingId,
    email: booking.customer.email.toLowerCase(),
    exp: Date.now() + ttlMs,
  };
  const payloadPart = base64Url(JSON.stringify(payload));
  return `${payloadPart}.${sign(payloadPart)}`;
}

export function verifyBookingManageToken(token: string): VerifiedBookingManageToken | null {
  const [payloadPart, signature] = token.split('.');
  if (!payloadPart || !signature) return null;

  const expected = sign(payloadPart);
  const expectedBuffer = Buffer.from(expected);
  const signatureBuffer = Buffer.from(signature);
  if (expectedBuffer.length !== signatureBuffer.length || !timingSafeEqual(expectedBuffer, signatureBuffer)) {
    return null;
  }

  try {
    const payload = JSON.parse(Buffer.from(payloadPart, 'base64url').toString('utf8')) as Partial<TokenPayload>;
    if (!payload.bookingId || !payload.email || !payload.exp || payload.exp < Date.now()) return null;
    return {
      bookingId: payload.bookingId,
      email: payload.email.toLowerCase(),
    };
  } catch {
    return null;
  }
}

export function buildBookingManageUrl(booking: Booking, locale: Locale = booking.customer.locale): string {
  const baseUrl = (process.env.SITE_URL || process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000').replace(/\/+$/, '');
  const token = createBookingManageToken(booking);
  return `${baseUrl}/${locale}/bookings/manage/${encodeURIComponent(token)}`;
}

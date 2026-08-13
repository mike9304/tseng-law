import { createHmac, timingSafeEqual } from 'node:crypto';
import type { Booking } from '@/lib/builder/bookings/types';
import type { Locale } from '@/lib/locales';

const DEFAULT_TTL_MS = 1000 * 60 * 60 * 24 * 30;
const MIN_SECRET_BYTES = 32;
const LOCAL_DEVELOPMENT_SECRET = 'local-booking-manage-token-secret-for-dev-and-test-only';
const MISSING_SECRET_ERROR = [
  'BOOKING_MANAGE_TOKEN_SECRET must be configured with at least 32 bytes',
  '(or provide a strong CMS_SESSION_SECRET/NEXTAUTH_SECRET server fallback).',
].join(' ');

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

function isStrongSecret(value: string | undefined): value is string {
  return Boolean(value?.trim() && Buffer.byteLength(value.trim(), 'utf8') >= MIN_SECRET_BYTES);
}

function resolveSecret(): string | null {
  const candidates = [
    process.env.BOOKING_MANAGE_TOKEN_SECRET,
    process.env.CMS_SESSION_SECRET,
    process.env.NEXTAUTH_SECRET,
  ];
  for (const candidate of candidates) {
    if (isStrongSecret(candidate)) return candidate.trim();
  }

  if (process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'test') {
    return LOCAL_DEVELOPMENT_SECRET;
  }
  return null;
}

function sign(payloadPart: string, secret: string): string {
  return createHmac('sha256', secret).update(payloadPart).digest('base64url');
}

export function createBookingManageToken(
  booking: Pick<Booking, 'bookingId' | 'customer'>,
  ttlMs = DEFAULT_TTL_MS,
): string {
  const secret = resolveSecret();
  if (!secret) throw new Error(MISSING_SECRET_ERROR);

  const payload: TokenPayload = {
    bookingId: booking.bookingId,
    email: booking.customer.email.toLowerCase(),
    exp: Date.now() + ttlMs,
  };
  const payloadPart = base64Url(JSON.stringify(payload));
  return `${payloadPart}.${sign(payloadPart, secret)}`;
}

export function verifyBookingManageToken(token: string): VerifiedBookingManageToken | null {
  const parts = token.split('.');
  if (parts.length !== 2) return null;
  const [payloadPart, signature] = parts;
  if (!payloadPart || !signature) return null;

  const secret = resolveSecret();
  if (!secret) return null;
  const expected = sign(payloadPart, secret);
  const expectedBuffer = Buffer.from(expected);
  const signatureBuffer = Buffer.from(signature);
  if (expectedBuffer.length !== signatureBuffer.length || !timingSafeEqual(expectedBuffer, signatureBuffer)) {
    return null;
  }

  try {
    const payload = JSON.parse(Buffer.from(payloadPart, 'base64url').toString('utf8')) as Partial<TokenPayload>;
    if (
      typeof payload.bookingId !== 'string'
      || !payload.bookingId
      || typeof payload.email !== 'string'
      || !payload.email
      || typeof payload.exp !== 'number'
      || !Number.isSafeInteger(payload.exp)
      || payload.exp < Date.now()
    ) return null;
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

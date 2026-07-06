import { NextRequest, NextResponse } from 'next/server';
import { createHash } from 'crypto';
import {
  readReviews,
  readReviewsForMutation,
  writeReviews,
  type Review,
} from '@/lib/reviews/storage';

const SERVICE_ALLOWLIST = new Set([
  '',
  'consultation',
  'civil',
  'criminal',
  'company',
  'family',
  'labor',
  'ip',
  'retainer',
  'other',
]);
const submissionAttempts = new Map<string, number>();
const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000;

function getClientKey(req: NextRequest) {
  const forwardedFor = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown';
  return createHash('sha256').update(forwardedFor).digest('hex');
}

function hasBlockedPattern(value: string) {
  return /https?:\/\//i.test(value) || /www\./i.test(value) || /<[^>]+>/.test(value);
}

function isLocalDevelopmentOrigin(origin: URL): boolean {
  if (process.env.NODE_ENV === 'production') return false;
  return origin.hostname === 'localhost' || origin.hostname === '127.0.0.1' || origin.hostname === '[::1]';
}

function isLoopbackHostname(hostname: string): boolean {
  return hostname === 'localhost' || hostname === '127.0.0.1' || hostname === '[::1]';
}

function isSameOriginOrLoopbackAlias(origin: URL, requestUrl: URL): boolean {
  if (origin.host === requestUrl.host) return true;
  return isLoopbackHostname(origin.hostname)
    && isLoopbackHostname(requestUrl.hostname)
    && origin.port === requestUrl.port;
}

function isAllowedOrigin(req: NextRequest) {
  const origin = req.headers.get('origin');
  if (!origin) return true;

  try {
    const parsed = new URL(origin);
    return isSameOriginOrLoopbackAlias(parsed, req.nextUrl)
      || parsed.host === 'tseng-law.com'
      || parsed.host === 'www.tseng-law.com'
      || isLocalDevelopmentOrigin(parsed);
  } catch {
    return false;
  }
}

function valueFor(body: unknown, key: string): unknown {
  if (typeof body !== 'object' || body === null) return undefined;
  return Reflect.get(body, key);
}

function stringValueFor(body: unknown, key: string): string | undefined {
  const value = valueFor(body, key);
  return typeof value === 'string' ? value : undefined;
}

function numberValueFor(body: unknown, key: string): number | undefined {
  const value = valueFor(body, key);
  return typeof value === 'number' ? value : undefined;
}

function errorMessage(error: unknown): string {
  return error instanceof Error ? error.message : String(error);
}

export async function GET() {
  const reviews = await readReviews();
  const sorted = reviews
    .filter((review) => review.status === 'approved')
    .sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );
  return NextResponse.json(sorted);
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const nickname = stringValueFor(body, 'nickname');
    const rating = numberValueFor(body, 'rating');
    const service = stringValueFor(body, 'service');
    const content = stringValueFor(body, 'content');
    const website = stringValueFor(body, 'website');

    if (!isAllowedOrigin(req)) {
      return NextResponse.json(
        { error: 'origin not allowed' },
        { status: 403 }
      );
    }

    if (website) {
      return NextResponse.json(
        { error: 'invalid submission' },
        { status: 400 }
      );
    }

    if (!nickname || !rating || !content) {
      return NextResponse.json(
        { error: 'nickname, rating, content are required' },
        { status: 400 }
      );
    }

    if (rating < 1 || rating > 5) {
      return NextResponse.json(
        { error: 'rating must be between 1 and 5' },
        { status: 400 }
      );
    }

    if (nickname.length > 50) {
      return NextResponse.json(
        { error: 'nickname too long' },
        { status: 400 }
      );
    }

    if (nickname.trim().length < 2) {
      return NextResponse.json(
        { error: 'nickname too short' },
        { status: 400 }
      );
    }

    if (content.length > 2000) {
      return NextResponse.json(
        { error: 'content too long (max 2000)' },
        { status: 400 }
      );
    }

    if (content.trim().length < 20) {
      return NextResponse.json(
        { error: 'content too short' },
        { status: 400 }
      );
    }

    if (!SERVICE_ALLOWLIST.has((service || '').trim())) {
      return NextResponse.json(
        { error: 'invalid service type' },
        { status: 400 }
      );
    }

    if (hasBlockedPattern(nickname) || hasBlockedPattern(content)) {
      return NextResponse.json(
        { error: 'spam-like content is not allowed' },
        { status: 400 }
      );
    }

    const clientKey = getClientKey(req);
    const now = Date.now();
    const lastAttempt = submissionAttempts.get(clientKey);
    if (lastAttempt && now - lastAttempt < RATE_LIMIT_WINDOW_MS) {
      return NextResponse.json(
        { error: 'too many submissions' },
        { status: 429 }
      );
    }
    submissionAttempts.set(clientKey, now);

    const review: Review = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      nickname: nickname.trim(),
      rating,
      service: (service || '').trim(),
      content: content.trim(),
      createdAt: new Date().toISOString(),
      status: 'pending',
    };

    const reviews = await readReviewsForMutation();
    reviews.push(review);
    await writeReviews(reviews);

    return NextResponse.json(
      { ok: true, status: 'pending' },
      { status: 202 }
    );
  } catch (err) {
    console.error('[Reviews] POST error:', err);
    return NextResponse.json(
      { error: errorMessage(err) },
      { status: 500 }
    );
  }
}

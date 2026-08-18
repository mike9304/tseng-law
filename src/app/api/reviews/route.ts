import { NextRequest, NextResponse } from 'next/server';
import { createHash } from 'crypto';
import {
  readReviews,
  readReviewsForMutation,
  writeReviews,
  type Review,
} from '@/lib/reviews/storage';
import { isSiteLocale } from '@/lib/locales';
import { validateCsrf } from '@/lib/builder/security/csrf';
import { checkRateLimit } from '@/lib/builder/security/rate-limit';
import { mapPublicRateLimitDenial } from '@/lib/builder/security/public-rate-limit-response';

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
const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000;
const RATE_LIMIT_MAX = 1;
const REVIEW_SUBMISSION_FAILURE_CODE = 'review_submission_failed';
const REVIEW_SUBMISSION_FAILURE_MESSAGE = 'Unable to submit your review right now. Please try again later.';

function errorKind(error: unknown): string {
  if (error && typeof error === 'object' && 'constructor' in error) {
    const constructor = error.constructor;
    if (typeof constructor === 'function' && constructor.name) return constructor.name;
  }
  return 'unknown_error';
}

function getClientKey(req: NextRequest) {
  const forwardedFor = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown';
  return createHash('sha256').update(forwardedFor).digest('hex');
}

function hasBlockedPattern(value: string) {
  return /https?:\/\//i.test(value) || /www\./i.test(value) || /<[^>]+>/.test(value);
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

export function GET(): Promise<NextResponse>;
export function GET(req: NextRequest): Promise<NextResponse>;
export async function GET(
  req: NextRequest = new NextRequest('http://localhost/api/reviews'),
) {
  const requestedLocale = req.nextUrl.searchParams.get('locale');
  if (requestedLocale !== null && !isSiteLocale(requestedLocale)) {
    return NextResponse.json(
      { error: 'invalid source locale' },
      { status: 400 },
    );
  }

  const reviews = await readReviews();
  const sorted = reviews
    .filter((review) => (
      review.status === 'approved'
      && (requestedLocale === null || review.sourceLocale === requestedLocale)
    ))
    .sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );
  return NextResponse.json(sorted);
}

export async function POST(req: NextRequest) {
  const csrfFailure = validateCsrf(req);
  if (csrfFailure) return csrfFailure;

  try {
    const body = await req.json();
    const nickname = stringValueFor(body, 'nickname');
    const rating = numberValueFor(body, 'rating');
    const service = stringValueFor(body, 'service');
    const content = stringValueFor(body, 'content');
    const website = stringValueFor(body, 'website');
    const sourceLocale = stringValueFor(body, 'sourceLocale');

    if (!isSiteLocale(sourceLocale)) {
      return NextResponse.json(
        { error: 'invalid source locale' },
        { status: 400 },
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
    const rate = await checkRateLimit(
      `reviews-submit:${clientKey}`,
      RATE_LIMIT_MAX,
      RATE_LIMIT_WINDOW_MS,
    );
    if (!rate.allowed) {
      const decision = mapPublicRateLimitDenial(rate);
      return NextResponse.json(
        {
          error: decision.kind === 'backend_unavailable'
            ? 'rate limit unavailable'
            : 'too many submissions',
        },
        {
          status: decision.status,
          headers: decision.headers,
        },
      );
    }

    const review: Review = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      nickname: nickname.trim(),
      rating,
      service: (service || '').trim(),
      content: content.trim(),
      createdAt: new Date().toISOString(),
      status: 'pending',
      sourceLocale,
    };

    const reviews = await readReviewsForMutation();
    reviews.push(review);
    await writeReviews(reviews);

    return NextResponse.json(
      { ok: true, status: 'pending' },
      { status: 202 }
    );
  } catch (error) {
    console.error('[reviews] operation failed', REVIEW_SUBMISSION_FAILURE_CODE, errorKind(error));
    return NextResponse.json(
      {
        ok: false,
        error: REVIEW_SUBMISSION_FAILURE_CODE,
        code: REVIEW_SUBMISSION_FAILURE_CODE,
        message: REVIEW_SUBMISSION_FAILURE_MESSAGE,
      },
      { status: 500 }
    );
  }
}

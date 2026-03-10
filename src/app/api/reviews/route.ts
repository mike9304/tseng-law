import { NextRequest, NextResponse } from 'next/server';
import { put, list } from '@vercel/blob';
import { createHash } from 'crypto';

export type Review = {
  id: string;
  nickname: string;
  rating: number;
  service: string;
  content: string;
  createdAt: string;
  status: 'approved' | 'pending';
};

const BLOB_NAME = 'reviews.json';
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

function normalizeReviews(reviews: Review[]) {
  return reviews.map((review) => ({
    ...review,
    status: review.status ?? 'approved',
  }));
}

function getClientKey(req: NextRequest) {
  const forwardedFor = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown';
  return createHash('sha256').update(forwardedFor).digest('hex');
}

function hasBlockedPattern(value: string) {
  return /https?:\/\//i.test(value) || /www\./i.test(value) || /<[^>]+>/.test(value);
}

function isAllowedOrigin(req: NextRequest) {
  const origin = req.headers.get('origin');
  if (!origin) return true;

  try {
    const host = new URL(origin).host;
    return host === 'tseng-law.com' || host === 'www.tseng-law.com' || host === 'localhost:3000' || host === '127.0.0.1:3000';
  } catch {
    return false;
  }
}

async function readReviews(): Promise<Review[]> {
  try {
    const { blobs } = await list({ prefix: BLOB_NAME });
    if (blobs.length === 0) return [];
    const blob = blobs[0];
    const res = await fetch(blob.downloadUrl);
    return normalizeReviews(await res.json());
  } catch (err) {
    console.error('[Reviews] readReviews error:', err);
    return [];
  }
}

async function writeReviews(reviews: Review[]): Promise<void> {
  await put(BLOB_NAME, JSON.stringify(reviews, null, 2), {
    access: 'private',
    addRandomSuffix: false,
    allowOverwrite: true,
  });
}

export async function GET() {
  const reviews = await readReviews();
  const sorted = reviews
    .filter((review) => review.status === 'approved')
    .sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
  return NextResponse.json(sorted);
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const { nickname, rating, service, content, website } = body as {
      nickname?: string;
      rating?: number;
      service?: string;
      content?: string;
      website?: string;
    };

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

    const reviews = await readReviews();
    reviews.push(review);
    await writeReviews(reviews);

    return NextResponse.json(
      { ok: true, status: 'pending' },
      { status: 202 }
    );
  } catch (err) {
    console.error('[Reviews] POST error:', err);
    return NextResponse.json(
      { error: String(err) },
      { status: 500 }
    );
  }
}

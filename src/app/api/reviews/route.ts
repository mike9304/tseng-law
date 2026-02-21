import { NextRequest, NextResponse } from 'next/server';
import { put, list } from '@vercel/blob';

export type Review = {
  id: string;
  nickname: string;
  rating: number;
  service: string;
  content: string;
  createdAt: string;
};

const BLOB_NAME = 'reviews.json';

async function readReviews(): Promise<Review[]> {
  try {
    const { blobs } = await list({ prefix: BLOB_NAME });
    if (blobs.length === 0) return [];
    const res = await fetch(blobs[0].url);
    return await res.json();
  } catch (err) {
    console.error('[Reviews] readReviews error:', err);
    return [];
  }
}

async function writeReviews(reviews: Review[]): Promise<void> {
  await put(BLOB_NAME, JSON.stringify(reviews, null, 2), {
    access: 'public',
    addRandomSuffix: false,
  });
}

export async function GET() {
  const reviews = await readReviews();
  const sorted = reviews.sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
  return NextResponse.json(sorted);
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const { nickname, rating, service, content } = body as {
      nickname?: string;
      rating?: number;
      service?: string;
      content?: string;
    };

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

    if (content.length > 2000) {
      return NextResponse.json(
        { error: 'content too long (max 2000)' },
        { status: 400 }
      );
    }

    const review: Review = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      nickname: nickname.trim(),
      rating,
      service: (service || '').trim(),
      content: content.trim(),
      createdAt: new Date().toISOString(),
    };

    const reviews = await readReviews();
    reviews.push(review);
    await writeReviews(reviews);

    return NextResponse.json(review, { status: 201 });
  } catch (err) {
    console.error('[Reviews] POST error:', err);
    return NextResponse.json(
      { error: String(err) },
      { status: 500 }
    );
  }
}

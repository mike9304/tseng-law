import { mkdtemp, readFile, rm, writeFile } from 'fs/promises';
import os from 'os';
import path from 'path';
import { NextRequest } from 'next/server';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { guardBuilderReadWithPermission, guardMutation } from '@/lib/builder/security/guard';

vi.mock('@/lib/builder/security/guard', () => ({
  guardBuilderReadWithPermission: vi.fn(),
  guardMutation: vi.fn(),
}));

const ORIGINAL_BLOB_TOKEN = process.env.BLOB_READ_WRITE_TOKEN;
const ORIGINAL_REVIEWS_BACKEND = process.env.REVIEWS_BACKEND;
const ORIGINAL_REVIEWS_DATA_ROOT = process.env.REVIEWS_DATA_ROOT;

let tempRoot = '';

function reviewsFile(): string {
  return path.join(tempRoot, 'reviews.json');
}

function request(method: string, body?: unknown): NextRequest {
  return new NextRequest('https://tseng-law.com/api/builder/reviews', {
    method,
    headers: {
      'content-type': 'application/json',
      origin: 'https://tseng-law.com',
    },
    body: body === undefined ? undefined : JSON.stringify(body),
  });
}

async function seedReviews(): Promise<void> {
  await writeFile(reviewsFile(), JSON.stringify([
    {
      id: 'pending-review',
      nickname: '대기 고객',
      rating: 5,
      service: 'consultation',
      content: '승인을 기다리는 후기입니다.',
      createdAt: '2026-07-02T00:00:00.000Z',
      status: 'pending',
    },
    {
      id: 'approved-review',
      nickname: '승인 고객',
      rating: 4,
      service: 'civil',
      content: '이미 승인된 후기입니다.',
      createdAt: '2026-07-01T00:00:00.000Z',
      status: 'approved',
    },
  ], null, 2), 'utf8');
}

describe('/api/builder/reviews moderation route', () => {
  beforeEach(async () => {
    tempRoot = await mkdtemp(path.join(os.tmpdir(), 'tseng-builder-reviews-'));
    process.env.REVIEWS_DATA_ROOT = tempRoot;
    process.env.REVIEWS_BACKEND = 'local';
    delete process.env.BLOB_READ_WRITE_TOKEN;
    vi.mocked(guardBuilderReadWithPermission).mockResolvedValue({ username: 'admin', permission: 'manage-forms' });
    vi.mocked(guardMutation).mockResolvedValue({ username: 'admin', permission: 'manage-forms' });
  });

  afterEach(async () => {
    vi.clearAllMocks();
    if (ORIGINAL_BLOB_TOKEN) process.env.BLOB_READ_WRITE_TOKEN = ORIGINAL_BLOB_TOKEN;
    else delete process.env.BLOB_READ_WRITE_TOKEN;

    if (ORIGINAL_REVIEWS_BACKEND) process.env.REVIEWS_BACKEND = ORIGINAL_REVIEWS_BACKEND;
    else delete process.env.REVIEWS_BACKEND;

    if (ORIGINAL_REVIEWS_DATA_ROOT) process.env.REVIEWS_DATA_ROOT = ORIGINAL_REVIEWS_DATA_ROOT;
    else delete process.env.REVIEWS_DATA_ROOT;

    await rm(tempRoot, { recursive: true, force: true });
    tempRoot = '';
  });

  it('lists reviews for authenticated builders and filters by status', async () => {
    await seedReviews();
    const route = await import('../route');

    const allResponse = await route.GET(request('GET'));
    const allPayload = await allResponse.json();
    const pendingResponse = await route.GET(
      new NextRequest('https://tseng-law.com/api/builder/reviews?status=pending'),
    );
    const pendingPayload = await pendingResponse.json();

    expect(allResponse.status).toBe(200);
    expect(allPayload.reviews.map((review: { id: string }) => review.id)).toEqual([
      'pending-review',
      'approved-review',
    ]);
    expect(pendingPayload.reviews.map((review: { id: string }) => review.id)).toEqual(['pending-review']);
    expect(vi.mocked(guardBuilderReadWithPermission).mock.calls.map((call) => call[1])).toContain('manage-forms');
  });

  it('approves a pending review so the public endpoint can return it', async () => {
    await seedReviews();
    const route = await import('../route');
    const publicRoute = await import('@/app/api/reviews/route');

    const response = await route.PATCH(request('PATCH', {
      id: 'pending-review',
      status: 'approved',
    }));
    const payload = await response.json();
    const publicResponse = await publicRoute.GET();
    const publicPayload = await publicResponse.json();

    expect(response.status).toBe(200);
    expect(payload.review).toMatchObject({ id: 'pending-review', status: 'approved' });
    expect(publicPayload.map((review: { id: string }) => review.id)).toContain('pending-review');
    expect(vi.mocked(guardMutation).mock.calls.some((call) => call[1]?.permission === 'manage-forms')).toBe(true);
  });

  it('deletes a review without touching the remaining entries', async () => {
    await seedReviews();
    const route = await import('../route');

    const response = await route.DELETE(request('DELETE', { id: 'pending-review' }));
    const payload = await response.json();
    const stored = JSON.parse(await readFile(reviewsFile(), 'utf8')) as Array<{ id: string }>;

    expect(response.status).toBe(200);
    expect(payload).toEqual({ ok: true, id: 'pending-review' });
    expect(stored.map((review) => review.id)).toEqual(['approved-review']);
  });

  it('rejects invalid moderation updates before writing', async () => {
    await seedReviews();
    const route = await import('../route');

    const response = await route.PATCH(request('PATCH', {
      id: 'pending-review',
      status: 'published',
    }));
    const payload = await response.json();
    const stored = JSON.parse(await readFile(reviewsFile(), 'utf8')) as Array<{ id: string; status: string }>;

    expect(response.status).toBe(400);
    expect(payload).toEqual({ ok: false, error: 'invalid_review_update' });
    expect(stored.find((review) => review.id === 'pending-review')?.status).toBe('pending');
  });
});

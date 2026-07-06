import { mkdtemp, readFile, rm, writeFile } from 'fs/promises';
import os from 'os';
import path from 'path';
import { NextRequest } from 'next/server';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const ORIGINAL_BLOB_TOKEN = process.env.BLOB_READ_WRITE_TOKEN;
const ORIGINAL_REVIEWS_BACKEND = process.env.REVIEWS_BACKEND;
const ORIGINAL_REVIEWS_DATA_ROOT = process.env.REVIEWS_DATA_ROOT;

let tempRoot = '';

function reviewsFile(): string {
  return path.join(tempRoot, 'reviews.json');
}

function postRequest(
  body: unknown,
  forwardedFor: string,
  origin = 'https://tseng-law.com',
  url = 'https://tseng-law.com/api/reviews',
): NextRequest {
  return new NextRequest(url, {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      'origin': origin,
      'x-forwarded-for': forwardedFor,
    },
    body: JSON.stringify(body),
  });
}

describe('/api/reviews file backend', () => {
  beforeEach(async () => {
    tempRoot = await mkdtemp(path.join(os.tmpdir(), 'tseng-reviews-'));
    process.env.REVIEWS_DATA_ROOT = tempRoot;
    process.env.REVIEWS_BACKEND = 'local';
    delete process.env.BLOB_READ_WRITE_TOKEN;
  });

  afterEach(async () => {
    vi.unstubAllEnvs();

    if (ORIGINAL_BLOB_TOKEN) process.env.BLOB_READ_WRITE_TOKEN = ORIGINAL_BLOB_TOKEN;
    else delete process.env.BLOB_READ_WRITE_TOKEN;

    if (ORIGINAL_REVIEWS_BACKEND) process.env.REVIEWS_BACKEND = ORIGINAL_REVIEWS_BACKEND;
    else delete process.env.REVIEWS_BACKEND;

    if (ORIGINAL_REVIEWS_DATA_ROOT) process.env.REVIEWS_DATA_ROOT = ORIGINAL_REVIEWS_DATA_ROOT;
    else delete process.env.REVIEWS_DATA_ROOT;

    await rm(tempRoot, { recursive: true, force: true });
    tempRoot = '';
  });

  it('returns approved reviews from the local file sorted newest first', async () => {
    await writeFile(reviewsFile(), JSON.stringify([
      {
        id: 'old-approved',
        nickname: '첫 고객',
        rating: 4,
        service: 'civil',
        content: '오래된 승인 후기입니다.',
        createdAt: '2026-01-01T00:00:00.000Z',
        status: 'approved',
      },
      {
        id: 'pending-review',
        nickname: '대기 고객',
        rating: 5,
        service: 'company',
        content: '아직 검토 중인 후기입니다.',
        createdAt: '2026-06-01T00:00:00.000Z',
        status: 'pending',
      },
      {
        id: 'new-approved',
        nickname: '최근 고객',
        rating: 5,
        service: 'consultation',
        content: '최근 승인 후기입니다.',
        createdAt: '2026-07-01T00:00:00.000Z',
        status: 'approved',
      },
    ], null, 2), 'utf8');

    const route = await import('../route');
    const response = await route.GET();
    const payload = await response.json();

    expect(response.status).toBe(200);
    expect(payload.map((review: { id: string }) => review.id)).toEqual(['new-approved', 'old-approved']);
  });

  it('appends a pending review to the local file on valid submission', async () => {
    const route = await import('../route');
    const response = await route.POST(
      postRequest({
        nickname: '검증 고객',
        rating: 5,
        service: 'consultation',
        content: '상담 과정이 명확했고 필요한 자료를 차분하게 안내받았습니다.',
        website: '',
      }, '203.0.113.77'),
    );
    const payload = await response.json();
    const stored = JSON.parse(await readFile(reviewsFile(), 'utf8'));

    expect(response.status).toBe(202);
    expect(payload).toEqual({ ok: true, status: 'pending' });
    expect(stored).toHaveLength(1);
    expect(stored[0]).toMatchObject({
      nickname: '검증 고객',
      rating: 5,
      service: 'consultation',
      content: '상담 과정이 명확했고 필요한 자료를 차분하게 안내받았습니다.',
      status: 'pending',
    });
  });

  it('accepts local development origins on non-default ports', async () => {
    const route = await import('../route');
    const response = await route.POST(
      postRequest({
        nickname: '로컬 고객',
        rating: 5,
        service: 'consultation',
        content: '로컬 포트에서 제출해도 개발 환경에서는 정상 접수되어야 합니다.',
        website: '',
      }, '203.0.113.78', 'http://127.0.0.1:3171'),
    );
    const stored = JSON.parse(await readFile(reviewsFile(), 'utf8'));

    expect(response.status).toBe(202);
    expect(stored).toHaveLength(1);
    expect(stored[0]).toMatchObject({
      nickname: '로컬 고객',
      status: 'pending',
    });
  });

  it('accepts same-origin local review submissions when the server runs production mode', async () => {
    vi.stubEnv('NODE_ENV', 'production');
    const route = await import('../route');
    const response = await route.POST(
      postRequest({
        nickname: '로컬 리뷰 고객',
        rating: 5,
        service: 'consultation',
        content: '프로덕션 모드 로컬 리뷰 서버에서도 같은 Origin 제출은 접수되어야 합니다.',
        website: '',
      }, '203.0.113.81', 'http://127.0.0.1:4643', 'http://127.0.0.1:4643/api/reviews'),
    );

    expect(response.status).toBe(202);
    const stored = JSON.parse(await readFile(reviewsFile(), 'utf8'));

    expect(stored).toHaveLength(1);
    expect(stored[0]).toMatchObject({
      nickname: '로컬 리뷰 고객',
      status: 'pending',
    });
  });

  it('rejects unrelated origins before writing a review', async () => {
    const route = await import('../route');
    const response = await route.POST(
      postRequest({
        nickname: '외부 고객',
        rating: 5,
        service: 'consultation',
        content: '허용되지 않은 origin에서는 파일에 저장되면 안 됩니다.',
        website: '',
      }, '203.0.113.79', 'https://example.com'),
    );
    const payload = await response.json();

    expect(response.status).toBe(403);
    expect(payload).toEqual({ error: 'origin not allowed' });
    await expect(readFile(reviewsFile(), 'utf8')).rejects.toThrow();
  });

  it('fails closed without overwriting existing storage when reads fail', async () => {
    await writeFile(reviewsFile(), '{not valid json', 'utf8');
    const route = await import('../route');
    const response = await route.POST(
      postRequest({
        nickname: '보존 고객',
        rating: 5,
        service: 'consultation',
        content: '저장소 읽기 실패 시 기존 파일을 덮어쓰지 않아야 합니다.',
        website: '',
      }, '203.0.113.80'),
    );

    expect(response.status).toBe(500);
    expect(await readFile(reviewsFile(), 'utf8')).toBe('{not valid json');
  });
});

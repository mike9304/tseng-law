import { NextRequest } from 'next/server';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { guardMutation } from '@/lib/builder/security/guard';
import {
  createReviewSession,
  listReviewSessions,
} from '@/lib/builder/security/review-tokens';
import { GET, POST } from '../route';

vi.mock('@/lib/builder/security/guard', () => ({
  guardMutation: vi.fn(async () => ({ username: 'admin', permission: 'edit-pages' })),
}));

vi.mock('@/lib/builder/security/review-tokens', () => ({
  createReviewSession: vi.fn(),
  listReviewSessions: vi.fn(),
}));

const reviewSession = {
  id: 'rev_1',
  branchOrPageId: 'home',
  audienceRole: 'client',
  expiresAt: '2026-06-10T00:00:00.000Z',
  createdBy: 'admin',
  createdAt: '2026-06-03T00:00:00.000Z',
};

const createdReviewSession = {
  session: reviewSession,
  token: 'payload.signature',
  url: 'https://law.example.test/review/payload.signature',
};

const guardMutationMock = vi.mocked(guardMutation);
const createReviewSessionMock = vi.mocked(createReviewSession);
const listReviewSessionsMock = vi.mocked(listReviewSessions);

function getRequest(query = ''): NextRequest {
  return new NextRequest(`https://law.example.test/api/builder/review-sessions${query ? `?${query}` : ''}`);
}

function postRequest(
  query = '',
  body: string | unknown = { branchOrPageId: 'home', ttlMs: 3_600_000, locale: 'ko' },
): NextRequest {
  return new NextRequest(`https://law.example.test/api/builder/review-sessions${query ? `?${query}` : ''}`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: typeof body === 'string' ? body : JSON.stringify(body),
  });
}

describe('builder review sessions API', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    guardMutationMock.mockResolvedValue({ username: 'admin', permission: 'edit-pages' } as never);
    listReviewSessionsMock.mockResolvedValue([reviewSession] as never);
    createReviewSessionMock.mockResolvedValue(createdReviewSession as never);
  });

  it('returns review sessions while preserving success response shape', async () => {
    const response = await GET(getRequest('locale=en'));
    const payload = await response.json();

    expect(response.status).toBe(200);
    expect(payload).toEqual({ ok: true, sessions: [reviewSession] });
    expect(guardMutationMock).toHaveBeenCalledWith(expect.any(NextRequest), {
      bucket: 'mutation',
      permission: 'edit-pages',
    });
  });

  it('returns localized list failures without leaking exception details', async () => {
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => undefined);
    listReviewSessionsMock.mockRejectedValueOnce(new Error('review sessions storage secret leaked'));

    const response = await GET(getRequest('locale=zh-hant'));
    const payload = await response.json();

    expect(response.status).toBe(500);
    expect(payload).toEqual({
      ok: false,
      error: '無法載入審閱工作階段清單。',
      errorCode: 'review_sessions_list_failed',
    });
    expect(JSON.stringify(payload)).not.toContain('review sessions storage secret leaked');
    expect(consoleError).toHaveBeenCalledWith('[builder/review-sessions] GET failed:', expect.any(Error));
    consoleError.mockRestore();
  });

  it('returns localized validation errors using the body locale', async () => {
    const response = await POST(postRequest('', {
      branchOrPageId: '',
      ttlMs: 3_600_000,
      locale: 'zh-hant',
    }));
    const payload = await response.json();

    expect(response.status).toBe(400);
    expect(payload).toMatchObject({
      ok: false,
      error: '請確認審閱工作階段請求。',
      errorCode: 'validation_error',
    });
    expect(payload.issues).toBeDefined();
    expect(createReviewSessionMock).not.toHaveBeenCalled();
  });

  it('returns localized invalid JSON errors using the query locale', async () => {
    const response = await POST(postRequest('locale=en', '{'));
    const payload = await response.json();

    expect(response.status).toBe(400);
    expect(payload).toEqual({
      ok: false,
      error: 'Check the review session request format.',
      errorCode: 'invalid_json',
    });
  });

  it('returns localized create failures without leaking exception details', async () => {
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => undefined);
    createReviewSessionMock.mockRejectedValueOnce(new Error('create review session secret leaked'));

    const response = await POST(postRequest('locale=en'));
    const payload = await response.json();

    expect(response.status).toBe(500);
    expect(payload).toEqual({
      ok: false,
      error: 'Unable to create the review session.',
      errorCode: 'review_session_create_failed',
    });
    expect(JSON.stringify(payload)).not.toContain('create review session secret leaked');
    expect(consoleError).toHaveBeenCalledWith('[builder/review-sessions] POST failed:', expect.any(Error));
    consoleError.mockRestore();
  });

  it('creates review sessions while preserving success response shape', async () => {
    const response = await POST(postRequest('locale=ko'));
    const payload = await response.json();

    expect(response.status).toBe(201);
    expect(createReviewSessionMock).toHaveBeenCalledWith({
      branchOrPageId: 'home',
      ttlMs: 3_600_000,
      createdBy: 'admin',
    });
    expect(payload).toEqual({
      ok: true,
      session: reviewSession,
      token: 'payload.signature',
      url: 'https://law.example.test/review/payload.signature',
    });
  });
});

import { NextRequest } from 'next/server';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { verifyReviewToken } from '@/lib/builder/security/review-tokens';
import { GET } from '../route';

vi.mock('@/lib/builder/security/review-tokens', () => ({
  verifyReviewToken: vi.fn(),
}));

const verifiedReviewToken = {
  id: 'rev_1',
  branchOrPageId: 'home',
  audienceRole: 'client',
  createdBy: 'admin',
  expiresAt: '2026-06-10T00:00:00.000Z',
};

const verifyReviewTokenMock = vi.mocked(verifyReviewToken);

function getRequest(query = ''): NextRequest {
  return new NextRequest(
    `https://law.example.test/api/builder/review-sessions/payload.signature${query ? `?${query}` : ''}`,
  );
}

const params = { params: Promise.resolve({ token: 'payload.signature' }) };

describe('builder review session token API', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    verifyReviewTokenMock.mockResolvedValue(verifiedReviewToken as never);
  });

  it('returns review audience details while preserving success response shape', async () => {
    const response = await GET(getRequest('locale=en'), params);
    const payload = await response.json();

    expect(response.status).toBe(200);
    expect(payload).toEqual({
      ok: true,
      audience: {
        audienceRole: 'client',
        branchOrPageId: 'home',
        expiresAt: '2026-06-10T00:00:00.000Z',
      },
    });
    expect(verifyReviewTokenMock).toHaveBeenCalledWith('payload.signature');
  });

  it('returns localized invalid token errors', async () => {
    verifyReviewTokenMock.mockResolvedValueOnce(null);

    const response = await GET(getRequest('locale=zh-hant'), params);
    const payload = await response.json();

    expect(response.status).toBe(401);
    expect(payload).toEqual({
      ok: false,
      error: '審閱連結已過期或無效。',
      errorCode: 'review_token_invalid',
    });
  });

  it('returns localized verification failures without leaking exception details', async () => {
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => undefined);
    verifyReviewTokenMock.mockRejectedValueOnce(new Error('verify review token secret leaked'));

    const response = await GET(getRequest('locale=ko'), params);
    const payload = await response.json();

    expect(response.status).toBe(500);
    expect(payload).toEqual({
      ok: false,
      error: '리뷰 링크를 확인하지 못했습니다.',
      errorCode: 'review_token_verify_failed',
    });
    expect(JSON.stringify(payload)).not.toContain('verify review token secret leaked');
    expect(consoleError).toHaveBeenCalledWith('[builder/review-sessions/[token]] GET failed:', expect.any(Error));
    consoleError.mockRestore();
  });
});

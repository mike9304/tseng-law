import { NextRequest } from 'next/server';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { guardMutation } from '@/lib/builder/security/guard';
import {
  getSubscriberByEmail,
  makeSubscriberId,
  makeToken,
  saveSubscriber,
} from '@/lib/builder/marketing/subscriber-storage';
import { POST } from '../route';

vi.mock('@/lib/builder/security/guard', () => ({
  guardMutation: vi.fn(async () => ({ username: 'marketing-admin@example.test' })),
}));

vi.mock('@/lib/builder/marketing/subscriber-storage', () => ({
  getSubscriberByEmail: vi.fn(),
  makeSubscriberId: vi.fn(() => 'sub_1'),
  makeToken: vi.fn(() => 'tok_1'),
  saveSubscriber: vi.fn(),
}));

const guardMutationMock = vi.mocked(guardMutation);
const getSubscriberByEmailMock = vi.mocked(getSubscriberByEmail);
const makeSubscriberIdMock = vi.mocked(makeSubscriberId);
const makeTokenMock = vi.mocked(makeToken);
const saveSubscriberMock = vi.mocked(saveSubscriber);

function request(query = '', body?: unknown): NextRequest {
  return new NextRequest(`https://law.example.test/api/builder/marketing/subscribers/import${query ? `?${query}` : ''}`, {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      'user-agent': 'vitest-admin',
      'x-forwarded-for': '127.0.0.21',
    },
    body: body === undefined ? undefined : typeof body === 'string' ? body : JSON.stringify(body),
  });
}

describe('builder marketing subscriber import API', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    guardMutationMock.mockResolvedValue({ username: 'marketing-admin@example.test' } as never);
    getSubscriberByEmailMock.mockResolvedValue(null as never);
    makeSubscriberIdMock.mockReturnValue('sub_1');
    makeTokenMock.mockReturnValue('tok_1');
    saveSubscriberMock.mockResolvedValue(undefined as never);
  });

  it('imports subscribers while preserving success response shape', async () => {
    const response = await POST(request('locale=en', {
      rows: [{ email: 'lead@example.test', tags: ['lead'], preferredLocale: 'en' }],
      defaultStatus: 'subscribed',
    }));
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data).toEqual({ ok: true, created: 1, updated: 0, skipped: 0, errors: [], total: 1 });
    expect(saveSubscriberMock).toHaveBeenCalledTimes(1);
    expect(saveSubscriberMock).toHaveBeenCalledWith(
      expect.objectContaining({
        email: 'lead@example.test',
        marketingConsent: expect.objectContaining({
          source: 'csv-import',
          acceptedBy: 'marketing-admin@example.test',
          ipAddress: '127.0.0.21',
          userAgent: 'vitest-admin',
        }),
      }),
    );
  });

  it('returns localized invalid import payload errors while preserving details', async () => {
    const response = await POST(request('locale=zh-hant', { rows: [{ email: 'bad' }] }));
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data).toMatchObject({
      ok: false,
      error: '請確認訂閱者匯入資料。',
      errorCode: 'invalid_import_payload',
    });
    expect(data.details).toBeTruthy();
    expect(saveSubscriberMock).not.toHaveBeenCalled();
  });

  it('returns localized invalid JSON errors', async () => {
    const response = await POST(request('locale=en', '{'));
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data).toEqual({
      ok: false,
      error: 'Check the marketing request format.',
      errorCode: 'invalid_json',
    });
    expect(saveSubscriberMock).not.toHaveBeenCalled();
  });

  it('returns localized size-limit errors', async () => {
    const largeRows = Array.from({ length: 280 }, (_, index) => ({
      email: `lead-${index}@example.test`,
      tags: Array.from({ length: 16 }, (__, tagIndex) => `tag-${index}-${tagIndex}-${'x'.repeat(50)}`),
    }));
    const response = await POST(request('locale=en', {
      rows: largeRows,
    }));
    const data = await response.json();

    expect(response.status).toBe(413);
    expect(data).toEqual({
      ok: false,
      error: 'The import file is too large.',
      errorCode: 'import_payload_too_large',
    });
    expect(saveSubscriberMock).not.toHaveBeenCalled();
  });

  it('localizes row-level import failures without leaking exception details', async () => {
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => undefined);
    saveSubscriberMock.mockRejectedValueOnce(new Error('subscriber import secret leaked'));

    const response = await POST(request('locale=ko', {
      rows: [{ email: 'lead@example.test', tags: ['lead'] }],
      defaultStatus: 'pending',
    }));
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data).toEqual({
      ok: true,
      created: 0,
      updated: 0,
      skipped: 0,
      errors: [{ email: 'lead@example.test', reason: '구독자 행을 가져오지 못했습니다.' }],
      total: 1,
    });
    expect(JSON.stringify(data)).not.toContain('subscriber import secret leaked');
    expect(consoleError).toHaveBeenCalledWith('[builder/marketing/subscribers/import] row failed:', expect.any(Error));
    consoleError.mockRestore();
  });
});

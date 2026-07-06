import { NextRequest } from 'next/server';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { guardMutation } from '@/lib/builder/security/guard';
import {
  getSubscriberByEmail,
  listSubscribers,
  makeSubscriberId,
  makeToken,
  saveSubscriber,
} from '@/lib/builder/marketing/subscriber-storage';
import { linkSubscriberToCrmContact } from '@/lib/builder/marketing/subscriber-crm-link';
import type { Subscriber } from '@/lib/builder/marketing/subscriber-types';
import { GET, POST } from '../route';

vi.mock('@/lib/builder/security/guard', () => ({
  guardMutation: vi.fn(async () => ({ username: 'marketing-admin@example.test' })),
}));

vi.mock('@/lib/builder/marketing/subscriber-storage', () => ({
  getSubscriberByEmail: vi.fn(),
  listSubscribers: vi.fn(),
  makeSubscriberId: vi.fn(() => 'sub_1'),
  makeToken: vi.fn(() => 'tok_1'),
  saveSubscriber: vi.fn(),
}));

vi.mock('@/lib/builder/marketing/subscriber-crm-link', () => ({
  linkSubscriberToCrmContact: vi.fn(async () => ({ contactId: 'ct_linked', created: true })),
}));

const guardMutationMock = vi.mocked(guardMutation);
const getSubscriberByEmailMock = vi.mocked(getSubscriberByEmail);
const listSubscribersMock = vi.mocked(listSubscribers);
const makeSubscriberIdMock = vi.mocked(makeSubscriberId);
const makeTokenMock = vi.mocked(makeToken);
const saveSubscriberMock = vi.mocked(saveSubscriber);
const linkSubscriberToCrmContactMock = vi.mocked(linkSubscriberToCrmContact);

function request(method: 'GET' | 'POST', query = '', body?: unknown): NextRequest {
  return new NextRequest(`https://law.example.test/api/builder/marketing/subscribers${query ? `?${query}` : ''}`, {
    method,
    headers: {
      'content-type': 'application/json',
      'user-agent': 'vitest-admin',
      'x-forwarded-for': '127.0.0.20',
    },
    body: body === undefined ? undefined : typeof body === 'string' ? body : JSON.stringify(body),
  });
}

const subscriber: Subscriber = {
  subscriberId: 'sub_1',
  email: 'lead@example.test',
  status: 'subscribed',
  tags: ['lead'],
  preferredLocale: 'ko',
  unsubscribeToken: 'tok_1',
  source: 'admin-create',
  createdAt: '2026-06-03T00:00:00.000Z',
  updatedAt: '2026-06-03T00:00:00.000Z',
};

describe('builder marketing subscribers API', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    guardMutationMock.mockResolvedValue({ username: 'marketing-admin@example.test' } as never);
    listSubscribersMock.mockResolvedValue([subscriber] as never);
    getSubscriberByEmailMock.mockResolvedValue(null as never);
    makeSubscriberIdMock.mockReturnValue('sub_1');
    makeTokenMock.mockReturnValue('tok_1');
    saveSubscriberMock.mockResolvedValue(undefined as never);
    linkSubscriberToCrmContactMock.mockResolvedValue({ contactId: 'ct_linked', created: true });
  });

  it('lists subscribers while preserving GET success response shape', async () => {
    const response = await GET(request('GET', 'locale=en&q=lead&status=subscribed&tag=lead'));
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(listSubscribersMock).toHaveBeenCalledWith({
      status: 'subscribed',
      tag: 'lead',
      search: 'lead',
    });
    expect(data).toEqual({ ok: true, subscribers: [subscriber], total: 1 });
  });

  it('returns localized list failures without leaking exception details', async () => {
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => undefined);
    listSubscribersMock.mockRejectedValueOnce(new Error('subscriber list secret leaked'));

    const response = await GET(request('GET', 'locale=zh-hant'));
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data).toEqual({
      ok: false,
      error: '無法載入訂閱者清單。',
      errorCode: 'subscribers_list_failed',
    });
    expect(JSON.stringify(data)).not.toContain('subscriber list secret leaked');
    expect(consoleError).toHaveBeenCalledWith('[builder/marketing/subscribers] list failed:', expect.any(Error));
    consoleError.mockRestore();
  });

  it('returns localized invalid subscriber payload errors while preserving details', async () => {
    const response = await POST(request('POST', 'locale=en', { email: 'not-email' }));
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data).toMatchObject({
      ok: false,
      error: 'Check the subscriber details.',
      errorCode: 'invalid_subscriber_payload',
    });
    expect(data.details).toBeTruthy();
    expect(saveSubscriberMock).not.toHaveBeenCalled();
  });

  it('returns localized invalid JSON errors', async () => {
    const response = await POST(request('POST', 'locale=zh-hant', '{'));
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data).toEqual({
      ok: false,
      error: '請確認行銷請求格式。',
      errorCode: 'invalid_json',
    });
    expect(saveSubscriberMock).not.toHaveBeenCalled();
  });

  it('creates subscribers while preserving POST success response shape', async () => {
    const response = await POST(request('POST', 'locale=en', {
      email: 'lead@example.test',
      tags: ['lead'],
      status: 'subscribed',
    }));
    const data = await response.json();

    expect(response.status).toBe(201);
    expect(data).toMatchObject({
      ok: true,
      subscriber: {
        subscriberId: 'sub_1',
        email: 'lead@example.test',
        contactId: 'ct_linked',
        tags: ['lead'],
        status: 'subscribed',
      },
    });
    expect(linkSubscriberToCrmContactMock).toHaveBeenCalledWith({
      email: 'lead@example.test',
      preferredLocale: 'ko',
      source: 'admin-create',
      tags: ['lead'],
    });
    expect(saveSubscriberMock).toHaveBeenCalledWith(
      expect.objectContaining({
        email: 'lead@example.test',
        contactId: 'ct_linked',
        marketingConsent: expect.objectContaining({
          source: 'admin-create',
          acceptedBy: 'marketing-admin@example.test',
          ipAddress: '127.0.0.20',
          userAgent: 'vitest-admin',
        }),
      }),
    );
  });

  it('returns localized save failures without leaking exception details', async () => {
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => undefined);
    saveSubscriberMock.mockRejectedValueOnce(new Error('subscriber save secret leaked'));

    const response = await POST(request('POST', 'locale=ko', {
      email: 'lead@example.test',
      tags: ['lead'],
      status: 'subscribed',
    }));
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data).toEqual({
      ok: false,
      error: '구독자를 저장하지 못했습니다.',
      errorCode: 'subscriber_create_failed',
    });
    expect(JSON.stringify(data)).not.toContain('subscriber save secret leaked');
    expect(consoleError).toHaveBeenCalledWith('[builder/marketing/subscribers] save failed:', expect.any(Error));
    consoleError.mockRestore();
  });
});

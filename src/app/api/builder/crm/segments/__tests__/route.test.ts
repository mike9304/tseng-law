import { NextRequest } from 'next/server';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { guardMutation } from '@/lib/builder/security/guard';
import { createSegment, readSegments } from '@/lib/builder/crm/segments-store';
import { readCrmContacts } from '@/lib/builder/crm/contact-model';
import type { CrmContact } from '@/lib/builder/crm/contact-model';
import type { CrmSegment } from '@/lib/builder/crm/segments-model';
import { GET, POST } from '../route';

vi.mock('@/lib/builder/security/guard', () => ({
  guardMutation: vi.fn(async () => ({ username: 'crm-admin@example.test' })),
}));

vi.mock('@/lib/builder/crm/segments-store', () => ({
  createSegment: vi.fn(),
  readSegments: vi.fn(),
}));

vi.mock('@/lib/builder/crm/contact-model', () => ({
  readCrmContacts: vi.fn(),
}));

const guardMutationMock = vi.mocked(guardMutation);
const createSegmentMock = vi.mocked(createSegment);
const readSegmentsMock = vi.mocked(readSegments);
const readCrmContactsMock = vi.mocked(readCrmContacts);

function request(method: 'GET' | 'POST', query = '', body?: unknown): NextRequest {
  return new NextRequest(`https://law.example.test/api/builder/crm/segments${query ? `?${query}` : ''}`, {
    method,
    body: body === undefined ? undefined : typeof body === 'string' ? body : JSON.stringify(body),
    headers: { 'content-type': 'application/json' },
  });
}

const segment: CrmSegment = {
  id: 'seg_1',
  name: 'Leads',
  description: 'Lead contacts',
  matchMode: 'all',
  rules: [{ kind: 'tag', tag: 'lead' }],
  createdAt: '2026-06-03T00:00:00.000Z',
  updatedAt: '2026-06-03T00:00:00.000Z',
};

const contact: CrmContact = {
  id: 'ct_1',
  email: 'lead@example.test',
  source: 'manual',
  tags: ['lead'],
  createdAt: '2026-06-03T00:00:00.000Z',
  lastActivityAt: '2026-06-03T00:00:00.000Z',
};

describe('builder CRM segments API', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    guardMutationMock.mockResolvedValue({ username: 'crm-admin@example.test' } as never);
    readSegmentsMock.mockResolvedValue([segment] as never);
    createSegmentMock.mockResolvedValue(segment as never);
    readCrmContactsMock.mockResolvedValue([contact] as never);
  });

  it('lists segments while preserving GET success response shape', async () => {
    const response = await GET(request('GET', 'locale=en'));
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data).toEqual({ ok: true, segments: [segment], total: 1 });
  });

  it('adds contact counts when requested', async () => {
    const response = await GET(request('GET', 'locale=en&counts=1'));
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.segments[0]).toMatchObject({ id: 'seg_1', contactCount: 1 });
    expect(data.total).toBe(1);
  });

  it('returns localized list failures without leaking exception details', async () => {
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => undefined);
    readSegmentsMock.mockRejectedValueOnce(new Error('segment list secret leaked'));

    const response = await GET(request('GET', 'locale=zh-hant'));
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data).toEqual({
      ok: false,
      error: '無法載入分眾清單。',
      errorCode: 'segments_list_failed',
    });
    expect(JSON.stringify(data)).not.toContain('segment list secret leaked');
    expect(consoleError).toHaveBeenCalledWith('[builder/crm/segments] list failed:', expect.any(Error));
    consoleError.mockRestore();
  });

  it('returns localized invalid JSON errors', async () => {
    const response = await POST(request('POST', 'locale=en', '{'));
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data).toEqual({
      ok: false,
      error: 'Check the CRM request format.',
      errorCode: 'invalid_json',
    });
    expect(createSegmentMock).not.toHaveBeenCalled();
  });

  it('returns localized invalid segment payload errors while preserving details', async () => {
    const response = await POST(request('POST', 'locale=ko', { name: 'Bad segment', rules: [] }));
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data).toMatchObject({
      ok: false,
      error: '세그먼트 정보를 확인해 주세요.',
      errorCode: 'invalid_segment_payload',
    });
    expect(data.details).toBeTruthy();
    expect(createSegmentMock).not.toHaveBeenCalled();
  });

  it('creates a segment while preserving POST success response shape', async () => {
    const response = await POST(request('POST', 'locale=en', {
      name: 'Leads',
      matchMode: 'all',
      rules: [{ kind: 'tag', tag: 'lead' }],
    }));
    const data = await response.json();

    expect(response.status).toBe(201);
    expect(data).toEqual({ ok: true, segment });
  });

  it('returns localized create failures without leaking exception details', async () => {
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => undefined);
    createSegmentMock.mockRejectedValueOnce(new Error('segment create secret leaked'));

    const response = await POST(request('POST', 'locale=zh-hant', {
      name: 'Leads',
      rules: [{ kind: 'tag', tag: 'lead' }],
    }));
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data).toEqual({
      ok: false,
      error: '無法建立分眾。',
      errorCode: 'segment_create_failed',
    });
    expect(JSON.stringify(data)).not.toContain('segment create secret leaked');
    expect(consoleError).toHaveBeenCalledWith('[builder/crm/segments] create failed:', expect.any(Error));
    consoleError.mockRestore();
  });

  it('returns localized preview failures without leaking exception details', async () => {
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => undefined);
    readCrmContactsMock.mockRejectedValueOnce(new Error('segment preview secret leaked'));

    const response = await POST(request('POST', 'locale=en&preview=1', {
      name: 'Leads',
      rules: [{ kind: 'tag', tag: 'lead' }],
    }));
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data).toEqual({
      ok: false,
      error: 'Unable to load the segment preview.',
      errorCode: 'segment_preview_failed',
    });
    expect(JSON.stringify(data)).not.toContain('segment preview secret leaked');
    expect(consoleError).toHaveBeenCalledWith('[builder/crm/segments] preview failed:', expect.any(Error));
    consoleError.mockRestore();
  });
});

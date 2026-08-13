import { NextRequest, NextResponse } from 'next/server';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { readRecentAuditEvents } from '@/lib/builder/audit/store';
import { guardBuilderReadWithPermission } from '@/lib/builder/security/guard';
import type { AuditEvent } from '@/lib/builder/audit/types';
import * as route from '@/app/api/builder/site/audit/route';

vi.mock('@/lib/builder/security/guard', () => ({
  guardBuilderReadWithPermission: vi.fn(async () => ({ username: 'admin' })),
}));

vi.mock('@/lib/builder/audit/store', () => ({
  readRecentAuditEvents: vi.fn(),
}));

const mockedReadRecentAuditEvents = vi.mocked(readRecentAuditEvents);

function request(query = ''): NextRequest {
  return new NextRequest(`https://law.example.test/api/builder/site/audit${query}`);
}

describe('/api/builder/site/audit', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(guardBuilderReadWithPermission).mockResolvedValue({ username: 'admin' });
    mockedReadRecentAuditEvents.mockResolvedValue([
      {
        type: 'asset.upload',
        at: '2026-06-03T00:00:00.000Z',
        actorRef: 'admin',
        assetId: 'asset-1',
        mime: 'image/png',
        size: 12,
      } as AuditEvent,
    ]);
  });

  it('returns recent audit events without changing the success shape', async () => {
    const response = await route.GET(request('?locale=ko&limit=25'));
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(vi.mocked(guardBuilderReadWithPermission)).toHaveBeenCalledWith(
      expect.any(NextRequest),
      'manage-users',
    );
    expect(data).toMatchObject({
      ok: true,
      events: [{ type: 'asset.upload', assetId: 'asset-1' }],
    });
    expect(mockedReadRecentAuditEvents).toHaveBeenCalledWith(25);
  });

  it('short-circuits GET when manage-users permission is denied', async () => {
    vi.mocked(guardBuilderReadWithPermission).mockResolvedValueOnce(
      NextResponse.json({ error: 'Missing permission: manage-users' }, { status: 403 }),
    );

    const response = await route.GET(request('?locale=ko'));

    expect(response.status).toBe(403);
    expect(vi.mocked(guardBuilderReadWithPermission)).toHaveBeenCalledWith(
      expect.any(NextRequest),
      'manage-users',
    );
    expect(mockedReadRecentAuditEvents).not.toHaveBeenCalled();
  });

  it('falls back to the default limit for invalid limit values', async () => {
    const response = await route.GET(request('?locale=en&limit=not-a-number'));
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.ok).toBe(true);
    expect(mockedReadRecentAuditEvents).toHaveBeenCalledWith(200);
  });

  it('filters CMS lifecycle events by collection and record id', async () => {
    const matchingEvent: AuditEvent = {
      type: 'cms.records.bulk_lifecycle',
      at: '2026-06-25T00:00:00.000Z',
      actorRef: 'admin',
      siteId: 'default',
      collectionId: 'recipes-archive',
      action: 'status',
      recordIds: ['recipe-draft'],
      requestedCount: 1,
      changedCount: 1,
      status: 'published',
      locale: 'ko',
    };
    const otherEvent: AuditEvent = {
      ...matchingEvent,
      collectionId: 'other-recipes',
      recordIds: ['other-record'],
    };
    mockedReadRecentAuditEvents.mockResolvedValueOnce([matchingEvent, otherEvent]);

    const response = await route.GET(request('?locale=ko&collectionId=recipes-archive&recordId=recipe-draft'));
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data).toMatchObject({
      ok: true,
      events: [{ type: 'cms.records.bulk_lifecycle', collectionId: 'recipes-archive' }],
    });
  });

  it('returns localized stable-code JSON when audit log loading fails', async () => {
    mockedReadRecentAuditEvents.mockRejectedValueOnce(new Error('raw audit disk failure'));

    const response = await route.GET(request('?locale=zh-hant&limit=10'));
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data).toMatchObject({
      ok: false,
      error: '無法載入網站稽核紀錄。',
      errorCode: 'audit_events_load_failed',
    });
    expect(data.error).not.toContain('raw audit disk failure');
  });
});

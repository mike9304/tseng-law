import { NextRequest } from 'next/server';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { recordPageRollback } from '@/lib/builder/audit/record';
import { createDefaultCanvasDocument } from '@/lib/builder/canvas/types';
import { DEFAULT_BUILDER_SITE_ID } from '@/lib/builder/constants';
import { guardMutation } from '@/lib/builder/security/guard';
import {
  readRevisionDocument,
  recordRevision,
  rollbackToRevision,
} from '@/lib/builder/site/publish';
import { readPageCanvas, readPageCanvasRecordState } from '@/lib/builder/site/persistence';
import * as route from '@/app/api/builder/site/pages/[pageId]/revisions/rollback/route';

vi.mock('@/lib/builder/security/guard', () => ({
  guardMutation: vi.fn(async () => ({ username: 'admin' })),
}));

vi.mock('@/lib/builder/site/publish', () => ({
  readRevisionDocument: vi.fn(),
  recordRevision: vi.fn(),
  rollbackToRevision: vi.fn(),
}));

vi.mock('@/lib/builder/site/persistence', () => ({
  readPageCanvas: vi.fn(),
  readPageCanvasRecordState: vi.fn(),
}));

vi.mock('@/lib/builder/audit/record', () => ({
  recordPageRollback: vi.fn(async () => undefined),
}));

const SELECTED_SITE_ID = 'workspace-revisions-rollback';
const EDITOR_REFERRER = `https://law.example.test/ko/admin-builder?siteId=${SELECTED_SITE_ID}`;

const document = createDefaultCanvasDocument('ko');
const record = {
  document,
  revision: 8,
  savedAt: '2026-06-21T01:30:00.000Z',
  updatedBy: 'admin',
};

const mockedReadPageCanvas = vi.mocked(readPageCanvas);
const mockedReadPageCanvasRecordState = vi.mocked(readPageCanvasRecordState);
const mockedReadRevisionDocument = vi.mocked(readRevisionDocument);
const mockedRecordPageRollback = vi.mocked(recordPageRollback);
const mockedRecordRevision = vi.mocked(recordRevision);
const mockedRollbackToRevision = vi.mocked(rollbackToRevision);

function postRequest(body: unknown, query = '?locale=ko'): NextRequest {
  return new NextRequest(`https://law.example.test/api/builder/site/pages/page-1/revisions/rollback${query}`, {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      referer: EDITOR_REFERRER,
    },
    body: JSON.stringify(body),
  });
}

describe('/api/builder/site/pages/[pageId]/revisions/rollback selected site routing', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(guardMutation).mockResolvedValue({ username: 'admin' });
    mockedReadPageCanvas.mockResolvedValue(document);
    mockedReadPageCanvasRecordState.mockResolvedValue({ record, isEnvelope: true });
    mockedReadRevisionDocument.mockResolvedValue(document);
    mockedRecordRevision.mockResolvedValue({ revisionId: 'backup-selected', revision: 8 });
    mockedRollbackToRevision.mockResolvedValue(true);
  });

  it('backs up and rolls back the selected editor site when legacy body siteId is default', async () => {
    const response = await route.POST(postRequest({ siteId: 'default', revisionId: 'rev-target' }), {
      params: { pageId: 'page-1' },
    });
    const payload = await response.json();

    expect(response.status).toBe(200);
    expect(payload).toMatchObject({ ok: true, backupRevisionId: 'backup-selected' });
    expect(mockedReadPageCanvasRecordState).toHaveBeenCalledWith(SELECTED_SITE_ID, 'page-1', 'draft');
    expect(mockedRecordRevision).toHaveBeenCalledWith(
      SELECTED_SITE_ID,
      'page-1',
      record,
      { source: 'rollback-backup' },
    );
    expect(mockedRollbackToRevision).toHaveBeenCalledWith(SELECTED_SITE_ID, 'page-1', 'rev-target');
    expect(mockedReadRevisionDocument).toHaveBeenCalledWith(
      SELECTED_SITE_ID,
      'page-1',
      'rev-target',
    );
    expect(mockedRecordPageRollback).toHaveBeenCalledWith(expect.objectContaining({
      siteId: SELECTED_SITE_ID,
      pageId: 'page-1',
      revisionId: 'rev-target',
      backupRevisionId: 'backup-selected',
    }));
  });

  it('does not roll back a same-page revision from another site namespace', async () => {
    mockedRollbackToRevision.mockImplementation(async (siteId, _pageId, revisionId) => (
      siteId === SELECTED_SITE_ID && revisionId === 'rev-selected-only'
    ));

    const request = new NextRequest(
      'https://law.example.test/api/builder/site/pages/page-1/revisions/rollback?locale=ko',
      {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ revisionId: 'rev-selected-only' }),
      },
    );
    const response = await route.POST(request, { params: { pageId: 'page-1' } });

    expect(response.status).toBe(404);
    expect(mockedRollbackToRevision).toHaveBeenCalledWith(
      DEFAULT_BUILDER_SITE_ID,
      'page-1',
      'rev-selected-only',
    );
    expect(mockedRollbackToRevision).not.toHaveBeenCalledWith(
      SELECTED_SITE_ID,
      'page-1',
      'rev-selected-only',
    );
    expect(mockedReadRevisionDocument).not.toHaveBeenCalled();
  });

  it('fails closed when rollback mutation site signals conflict', async () => {
    const response = await route.POST(
      postRequest(
        { siteId: SELECTED_SITE_ID, revisionId: 'rev-target' },
        `?locale=ko&siteId=${encodeURIComponent(DEFAULT_BUILDER_SITE_ID)}`,
      ),
      { params: { pageId: 'page-1' } },
    );
    const payload = await response.json();

    expect(response.status).toBe(400);
    expect(payload).toMatchObject({ ok: false, success: false, errorCode: 'invalid_site_id' });
    expect(mockedReadPageCanvasRecordState).not.toHaveBeenCalled();
    expect(mockedRecordRevision).not.toHaveBeenCalled();
    expect(mockedRollbackToRevision).not.toHaveBeenCalled();
  });
});

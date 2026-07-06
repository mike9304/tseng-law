import { NextRequest } from 'next/server';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { guardMutation } from '@/lib/builder/security/guard';
import {
  readRevisionDocument,
  recordRevision,
  rollbackToRevision,
} from '@/lib/builder/site/publish';
import { readPageCanvasRecordState } from '@/lib/builder/site/persistence';
import { recordPageRollback } from '@/lib/builder/audit/record';
import type { BuilderCanvasDocument } from '@/lib/builder/canvas/types';
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
  readPageCanvasRecordState: vi.fn(),
}));

vi.mock('@/lib/builder/audit/record', () => ({
  recordPageRollback: vi.fn(),
}));

const mockedReadPageCanvasRecordState = vi.mocked(readPageCanvasRecordState);
const mockedReadRevisionDocument = vi.mocked(readRevisionDocument);
const mockedRecordPageRollback = vi.mocked(recordPageRollback);
const mockedRecordRevision = vi.mocked(recordRevision);
const mockedRollbackToRevision = vi.mocked(rollbackToRevision);

const document: BuilderCanvasDocument = {
  version: 1,
  locale: 'ko',
  updatedAt: '2026-06-03T00:00:00.000Z',
  updatedBy: 'test',
  stageWidth: 1280,
  stageHeight: 720,
  nodes: [],
};

function postRequest(body: unknown, query = ''): NextRequest {
  return new NextRequest(`https://law.example.test/api/builder/site/pages/page-1/revisions/rollback${query}`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: typeof body === 'string' ? body : JSON.stringify(body),
  });
}

describe('/api/builder/site/pages/[pageId]/revisions/rollback', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(guardMutation).mockResolvedValue({
      username: 'admin',
    });
    mockedRecordRevision.mockResolvedValue({ revisionId: 'backup-rev-1', revision: 8 });
    mockedRollbackToRevision.mockResolvedValue(true);
    mockedReadRevisionDocument.mockResolvedValue(document);
    mockedReadPageCanvasRecordState.mockResolvedValue({
      record: {
        document,
        revision: 8,
        savedAt: '2026-06-03T00:10:00.000Z',
        updatedBy: 'admin',
      },
      isEnvelope: true,
    });
    mockedRecordPageRollback.mockResolvedValue(undefined);
  });

  it('returns localized stable-code JSON when revisionId is missing', async () => {
    const response = await route.POST(postRequest({}, '?locale=ko'), { params: { pageId: 'page-1' } });
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data).toMatchObject({
      ok: false,
      error: '롤백할 리비전을 선택해 주세요.',
      errorCode: 'rollback_revision_required',
    });
    expect(mockedRollbackToRevision).not.toHaveBeenCalled();
  });

  it('returns localized stable-code JSON when rollback target is missing', async () => {
    mockedRollbackToRevision.mockResolvedValueOnce(false);
    const response = await route.POST(postRequest({ revisionId: 'rev-missing' }, '?locale=zh-hant'), {
      params: { pageId: 'page-1' },
    });
    const data = await response.json();

    expect(response.status).toBe(404);
    expect(data).toMatchObject({
      ok: false,
      error: '無法完成頁面回復。',
      errorCode: 'rollback_failed',
    });
  });

  it('returns localized stable-code JSON when rollback persistence fails', async () => {
    mockedRollbackToRevision.mockRejectedValueOnce(new Error('raw rollback write failure'));
    const response = await route.POST(postRequest({ revisionId: 'rev-1' }, '?locale=en'), {
      params: { pageId: 'page-1' },
    });
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data).toMatchObject({
      ok: false,
      error: 'Unable to complete the page rollback.',
      errorCode: 'rollback_failed',
    });
    expect(data.error).not.toContain('raw rollback write failure');
  });
});

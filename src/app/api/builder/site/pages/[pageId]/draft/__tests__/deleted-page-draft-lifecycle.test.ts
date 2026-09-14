import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { mkdtempSync } from 'node:fs';
import path from 'node:path';
import { tmpdir } from 'node:os';
import { NextRequest } from 'next/server';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { POST as createPagePOST } from '@/app/api/builder/site/pages/route';
import { DELETE as pageDELETE } from '@/app/api/builder/site/pages/[pageId]/route';
import * as draftRoute from '@/app/api/builder/site/pages/[pageId]/draft/route';
import { DEFAULT_BUILDER_SITE_ID as siteId } from '@/lib/builder/constants';
import { createBlankCanvasDocument } from '@/lib/builder/canvas/types';
import {
  readPageCanvasRecordState,
  writePageCanvas,
} from '@/lib/builder/site/persistence';
import { __resetUserRoleStorageRootForTests, __setUserRoleStorageRootForTests } from '@/lib/builder/security/user-role-store';

const username = 'draft-lifecycle-owner';
const password = 'synthetic-password';
const origin = 'http://127.0.0.1:39993';
const authorization = `Basic ${Buffer.from(`${username}:${password}`).toString('base64')}`;

const output = mkdtempSync(path.join(tmpdir(), 'deleted-page-draft-lifecycle-'));
let caseRoot: string;
let counter = 0;

function canvasPath(pageId: string, variant: 'draft' | 'published'): string {
  return path.join(caseRoot, 'site', siteId, 'pages', `${pageId}.${variant}.json`);
}

function siteDocumentPath(): string {
  return path.join(caseRoot, 'site', siteId, 'site.json');
}

function authHeaders(json = false): HeadersInit {
  return {
    authorization,
    origin,
    ...(json ? { 'content-type': 'application/json' } : {}),
  };
}

function pageRequest(method: string, pageId: string, pathname = '', body?: object): NextRequest {
  return new NextRequest(
    `${origin}/api/builder/site/pages/${pageId}${pathname}?siteId=${siteId}&locale=ko`,
    {
      method,
      headers: authHeaders(body !== undefined),
      ...(body ? { body: JSON.stringify(body) } : {}),
    },
  );
}

function createRequest(slug: string, title: string): NextRequest {
  return new NextRequest(`${origin}/api/builder/site/pages?siteId=${siteId}&locale=ko`, {
    method: 'POST',
    headers: authHeaders(true),
    body: JSON.stringify({ siteId, locale: 'ko', slug, title, blank: true }),
  });
}

async function jsonOf(response: Response): Promise<{ status: number; body: Record<string, unknown> }> {
  return { status: response.status, body: await response.json() as Record<string, unknown> };
}

async function createNamedPage(slug: string, title: string): Promise<string> {
  const created = await jsonOf(await createPagePOST(createRequest(slug, title)));
  expect(created.status).toBe(200);
  expect(typeof created.body.pageId).toBe('string');
  return created.body.pageId as string;
}

async function snapshotCanvas(pageId: string, variant: 'draft' | 'published') {
  const file = canvasPath(pageId, variant);
  let bytes: string | null = null;
  try {
    bytes = await readFile(file, 'utf8');
  } catch {
    bytes = null;
  }
  const state = await readPageCanvasRecordState(siteId, pageId, variant);
  return {
    bytes,
    revision: state?.record.revision ?? null,
    savedAt: state?.record.savedAt ?? null,
  };
}

function nextDocument(marker: string) {
  const document = createBlankCanvasDocument('ko');
  document.updatedBy = marker;
  return document;
}

describe('deleted builder page draft GET/PUT lifecycle', () => {
  beforeEach(async (ctx) => {
    counter += 1;
    caseRoot = path.join(output, String(counter), ctx.task.name.replace(/\s+/g, '-').slice(0, 80));
    await mkdir(caseRoot, { recursive: true });
    for (const [key, value] of Object.entries({
      NODE_ENV: 'test',
      BUILDER_SCHEDULED_OPERATION_MODE: 'legacy',
      BUILDER_PAGE_CANVAS_CAS_MODE: 'legacy',
      BUILDER_PAGE_CANVAS_CAS_MARKER: '',
      BUILDER_SITE_ROOT: path.join(caseRoot, 'site'),
      BUILDER_SITE_BACKEND: 'local',
      CONSULTATION_LOG_BACKEND: 'local',
      BUILDER_RUNTIME_DATA_ROOT: path.join(caseRoot, 'runtime'),
      BUILDER_REVISIONS_ROOT: path.join(caseRoot, 'revisions'),
      BLOB_READ_WRITE_TOKEN: '',
      UPSTASH_REDIS_REST_URL: '',
      UPSTASH_REDIS_REST_TOKEN: '',
      BUILDER_RATE_LIMIT_BACKEND: '',
      CMS_ADMIN_USERNAME: '',
      CMS_ADMIN_PASSWORD: '',
      BUILDER_USERNAME: username,
      BUILDER_BASIC_AUTH_USERS: JSON.stringify([{ username, password }]),
    })) {
      vi.stubEnv(key, value);
    }
    vi.stubGlobal('fetch', vi.fn(async () => {
      throw new Error('external provider forbidden in deleted-page draft lifecycle');
    }));
    __setUserRoleStorageRootForTests(path.join(caseRoot, 'roles'));
    await mkdir(path.join(caseRoot, 'roles'), { recursive: true });
    await writeFile(
      path.join(caseRoot, 'roles/user-roles.json'),
      JSON.stringify({
        users: [{ username, role: 'owner', addedAt: new Date().toISOString(), addedBy: 'fixture' }],
      }),
    );
  });

  afterEach(() => {
    vi.unstubAllEnvs();
    vi.unstubAllGlobals();
    __resetUserRoleStorageRootForTests();
  });

  it('returns 404 for draft GET after the page is deleted even if a leftover canvas remains', async () => {
    const pageId = await createNamedPage('deleted-draft-get', '삭제 초안 GET');
    const saved = await jsonOf(await draftRoute.PUT(
      pageRequest('PUT', pageId, '/draft', {
        expectedRevision: 0,
        document: nextDocument('pre-delete-draft'),
      }),
      { params: Promise.resolve({ pageId }) },
    ));
    expect(saved.status).toBe(200);
    await writePageCanvas(siteId, pageId, 'published', nextDocument('leftover-published'));

    const deleted = await jsonOf(await pageDELETE(
      pageRequest('DELETE', pageId),
      { params: Promise.resolve({ pageId }) },
    ));
    expect(deleted.status).toBe(200);

    const leftover = await snapshotCanvas(pageId, 'draft');
    expect(leftover.revision === null || leftover.bytes !== null).toBe(true);

    const loaded = await jsonOf(await draftRoute.GET(
      pageRequest('GET', pageId, '/draft'),
      { params: Promise.resolve({ pageId }) },
    ));
    expect(loaded.status).toBe(404);
    expect(loaded.body).toMatchObject({ ok: false, errorCode: 'page_not_found' });
  });

  it('does not export a PATCH handler', () => {
    expect((draftRoute as { PATCH?: unknown }).PATCH).toBeUndefined();
  });

  it('rejects draft PUT after DELETE with 404 or 409 and does not change files or revision', async () => {
    const handler = draftRoute.PUT;
    expect(handler, 'draft PUT handler').toEqual(expect.any(Function));

    const pageId = await createNamedPage('deleted-draft-put', '삭제 초안 PUT');
    const saved = await jsonOf(await draftRoute.PUT(
      pageRequest('PUT', pageId, '/draft', {
        expectedRevision: 0,
        document: nextDocument('pre-delete-save'),
      }),
      { params: Promise.resolve({ pageId }) },
    ));
    expect(saved.status).toBe(200);
    const savedDraft = saved.body.draft as { revision: number };
    expect(typeof savedDraft.revision).toBe('number');

    const deleted = await jsonOf(await pageDELETE(
      pageRequest('DELETE', pageId),
      { params: Promise.resolve({ pageId }) },
    ));
    expect(deleted.status).toBe(200);

    const before = await snapshotCanvas(pageId, 'draft');
    const write = await jsonOf(await handler(
      pageRequest('PUT', pageId, '/draft', {
        expectedRevision: savedDraft.revision,
        document: nextDocument('must-not-write-after-delete'),
      }),
      { params: Promise.resolve({ pageId }) },
    ));
    const after = await snapshotCanvas(pageId, 'draft');

    expect([404, 409]).toContain(write.status);
    expect(write.body.ok).toBe(false);
    expect(typeof write.body.errorCode).toBe('string');
    expect(after.bytes).toBe(before.bytes);
    expect(after.revision).toBe(before.revision);
    expect(after.savedAt).toBe(before.savedAt);
  });

  it('keeps GET/PUT 200 for a page that still exists in the site document', async () => {
    const keptPageId = await createNamedPage('kept-draft-page', '유지 페이지');
    const deletedPageId = await createNamedPage('deleted-sibling-page', '삭제 형제');

    const firstSave = await jsonOf(await draftRoute.PUT(
      pageRequest('PUT', keptPageId, '/draft', {
        expectedRevision: 0,
        document: nextDocument('kept-original'),
      }),
      { params: Promise.resolve({ pageId: keptPageId }) },
    ));
    expect(firstSave.status).toBe(200);
    const firstDraft = firstSave.body.draft as { revision: number };

    const deleted = await jsonOf(await pageDELETE(
      pageRequest('DELETE', deletedPageId),
      { params: Promise.resolve({ pageId: deletedPageId }) },
    ));
    expect(deleted.status).toBe(200);

    const loaded = await jsonOf(await draftRoute.GET(
      pageRequest('GET', keptPageId, '/draft'),
      { params: Promise.resolve({ pageId: keptPageId }) },
    ));
    expect(loaded.status).toBe(200);
    expect(loaded.body.ok).toBe(true);
    expect(loaded.body.document).toMatchObject({ updatedBy: 'kept-original' });

    const secondSave = await jsonOf(await draftRoute.PUT(
      pageRequest('PUT', keptPageId, '/draft', {
        expectedRevision: firstDraft.revision,
        document: nextDocument('kept-updated'),
      }),
      { params: Promise.resolve({ pageId: keptPageId }) },
    ));
    expect(secondSave.status).toBe(200);
    expect(secondSave.body.ok).toBe(true);
    expect(secondSave.body.document).toMatchObject({ updatedBy: 'kept-updated' });
    const secondDraft = secondSave.body.draft as { revision: number };
    expect(secondDraft.revision).toBe(firstDraft.revision + 1);
  });

  it('returns an explicit error code rather than 500 when the site document cannot be parsed', async () => {
    const pageId = await createNamedPage('corrupt-site-draft', '손상 사이트');
    const saved = await jsonOf(await draftRoute.PUT(
      pageRequest('PUT', pageId, '/draft', {
        expectedRevision: 0,
        document: nextDocument('before-corrupt'),
      }),
      { params: Promise.resolve({ pageId }) },
    ));
    expect(saved.status).toBe(200);

    await writeFile(siteDocumentPath(), 'not-json{{{{', 'utf8');

    const loaded = await jsonOf(await draftRoute.GET(
      pageRequest('GET', pageId, '/draft'),
      { params: Promise.resolve({ pageId }) },
    ));
    const write = await jsonOf(await draftRoute.PUT(
      pageRequest('PUT', pageId, '/draft', {
        expectedRevision: 0,
        document: nextDocument('after-corrupt'),
      }),
      { params: Promise.resolve({ pageId }) },
    ));

    for (const result of [loaded, write]) {
      expect(result.status, JSON.stringify(result.body)).not.toBe(500);
      expect(result.status).toBeGreaterThanOrEqual(400);
      expect(result.body.ok).toBe(false);
      expect(result.body.errorCode).toEqual(expect.stringMatching(/^[a-z0-9_]+$/));
      expect(JSON.stringify(result.body)).not.toMatch(/not-json|\{\{\{\{|SyntaxError|Unexpected token/i);
    }
  });

  it('removes leftover draft and published canvas files when deletePage succeeds', async () => {
    const pageId = await createNamedPage('deleted-canvas-cleanup', '초안 파일 정리');
    await writePageCanvas(siteId, pageId, 'draft', nextDocument('cleanup-draft'));
    await writePageCanvas(siteId, pageId, 'published', nextDocument('cleanup-published'));
    expect((await snapshotCanvas(pageId, 'draft')).bytes).not.toBeNull();
    expect((await snapshotCanvas(pageId, 'published')).bytes).not.toBeNull();

    const deleted = await jsonOf(await pageDELETE(
      pageRequest('DELETE', pageId),
      { params: Promise.resolve({ pageId }) },
    ));
    expect(deleted.status).toBe(200);

    expect(await snapshotCanvas(pageId, 'draft')).toMatchObject({ bytes: null, revision: null });
    expect(await snapshotCanvas(pageId, 'published')).toMatchObject({ bytes: null, revision: null });
  });
});

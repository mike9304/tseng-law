import { createHash } from 'crypto';
import {
  access,
  link,
  mkdir,
  mkdtemp,
  readFile,
  realpath,
  rm,
  symlink,
  unlink,
  writeFile,
} from 'fs/promises';
import os from 'os';
import path from 'path';
import { randomUUID } from 'crypto';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import type { BuilderCanvasDocument } from '@/lib/builder/canvas/types';
import {
  listRevisions,
  readRevisionDocument,
  recordRevision,
  rollbackToRevision,
} from '@/lib/builder/site/publish';
import { _setSafeLocalFsHookForTests } from '@/lib/builder/storage/safe-local-fs';

const blobMock = vi.hoisted(() => ({
  get: vi.fn(),
  list: vi.fn(),
  put: vi.fn(),
}));
const persistenceMock = vi.hoisted(() => ({
  ensureSiteDocument: vi.fn(),
  readPageCanvasRecordState: vi.fn(),
  readSiteDocument: vi.fn(),
  writePageCanvas: vi.fn(),
  writeSiteDocument: vi.fn(),
}));

vi.mock('@vercel/blob', () => blobMock);
vi.mock('@/lib/builder/site/persistence', () => persistenceMock);

vi.mock('next/cache', () => ({ revalidatePath: vi.fn() }));

let tempRoot: string | null = null;
let originalBlobToken: string | undefined;
let originalConsultationBackend: string | undefined;

beforeEach(async () => {
  tempRoot = await mkdtemp(path.join(os.tmpdir(), 'builder-revisions-root-'));
  originalBlobToken = process.env.BLOB_READ_WRITE_TOKEN;
  originalConsultationBackend = process.env.CONSULTATION_LOG_BACKEND;
  delete process.env.BLOB_READ_WRITE_TOKEN;
  delete process.env.CONSULTATION_LOG_BACKEND;
  delete process.env.BUILDER_REVISIONS_ROOT;
  vi.clearAllMocks();
});

afterEach(async () => {
  _setSafeLocalFsHookForTests(null);
  vi.restoreAllMocks();
  if (originalBlobToken === undefined) {
    delete process.env.BLOB_READ_WRITE_TOKEN;
  } else {
    process.env.BLOB_READ_WRITE_TOKEN = originalBlobToken;
  }
  if (originalConsultationBackend === undefined) {
    delete process.env.CONSULTATION_LOG_BACKEND;
  } else {
    process.env.CONSULTATION_LOG_BACKEND = originalConsultationBackend;
  }
  delete process.env.BUILDER_REVISIONS_ROOT;
  if (tempRoot) await rm(tempRoot, { recursive: true, force: true });
  tempRoot = null;
});

function documentFixture(updatedBy: string): BuilderCanvasDocument {
  return {
    version: 1,
    locale: 'ko',
    updatedAt: '2026-07-13T00:00:00.000Z',
    updatedBy,
    stageWidth: 1280,
    stageHeight: 720,
    nodes: [],
  };
}

function checksum(value: Buffer): string {
  return createHash('sha256').update(value).digest('hex');
}

describe('builder revision filesystem root', () => {
  it('uses a trimmed absolute BUILDER_REVISIONS_ROOT and preserves revision source/read semantics', async () => {
    if (!tempRoot) throw new Error('Expected a temporary root.');
    const isolatedRoot = path.join(tempRoot, 'isolated-revisions');
    const siteId = `qa-site-${randomUUID()}`;
    const pageId = `qa-page-${randomUUID()}`;
    const document = documentFixture('absolute-override');
    process.env.BUILDER_REVISIONS_ROOT = `  ${isolatedRoot}  `;

    const revisionId = await recordRevision(siteId, pageId, document, { source: 'qa-isolated' });

    const isolatedFile = path.join(isolatedRoot, siteId, pageId, `${revisionId}.json`);
    const envelope = JSON.parse(await readFile(isolatedFile, 'utf8')) as Record<string, unknown>;
    expect(envelope).toMatchObject({
      _revisionId: revisionId,
      _siteId: siteId,
      _pageId: pageId,
      _source: 'qa-isolated',
      updatedBy: 'absolute-override',
    });
    await expect(listRevisions(siteId, pageId)).resolves.toEqual([
      expect.objectContaining({
        revisionId,
        pageId,
        source: 'qa-isolated',
        nodeCount: 0,
      }),
    ]);
    await expect(readRevisionDocument(siteId, pageId, revisionId)).resolves.toEqual(document);

    const canonicalCandidate = path.join(
      process.cwd(),
      'runtime-data',
      'builder-revisions',
      siteId,
      pageId,
      `${revisionId}.json`,
    );
    await expect(access(canonicalCandidate)).rejects.toMatchObject({ code: 'ENOENT' });
  });

  it('rejects relative and blank BUILDER_REVISIONS_ROOT values with a clear error', async () => {
    const document = documentFixture('invalid-root');
    process.env.BUILDER_REVISIONS_ROOT = 'relative/revisions';
    await expect(recordRevision('qa-site', 'home', document)).rejects.toThrow(
      'BUILDER_REVISIONS_ROOT must be an absolute path.',
    );

    process.env.BUILDER_REVISIONS_ROOT = '   ';
    await expect(listRevisions('qa-site', 'home')).rejects.toThrow(
      'BUILDER_REVISIONS_ROOT must be an absolute path.',
    );
  });

  it('keeps the default process.cwd()/runtime-data/builder-revisions behavior in an isolated cwd', async () => {
    if (!tempRoot) throw new Error('Expected a temporary root.');
    const isolatedCwd = path.join(tempRoot, 'cwd');
    const document = documentFixture('default-root');
    vi.spyOn(process, 'cwd').mockReturnValue(isolatedCwd);

    const revisionId = await recordRevision('qa-site', 'home', document, { source: 'manual' });

    const expectedFile = path.join(
      isolatedCwd,
      'runtime-data',
      'builder-revisions',
      'qa-site',
      'home',
      `${revisionId}.json`,
    );
    await expect(readFile(expectedFile, 'utf8')).resolves.toContain('"_source":"manual"');
    await expect(readRevisionDocument('qa-site', 'home', revisionId)).resolves.toEqual(document);
    await expect(listRevisions('qa-site', 'home')).resolves.toEqual([
      expect.objectContaining({ revisionId, source: 'manual' }),
    ]);
  });

  it('rejects revision traversal outside the configured root', async () => {
    if (!tempRoot) throw new Error('Expected a temporary root.');
    process.env.BUILDER_REVISIONS_ROOT = path.join(tempRoot, 'safe-root');

    for (const unsafePageId of ['../escaped', 'nested/page', 'dotted.page', 'back\\slash']) {
      await expect(
        recordRevision('qa-site', unsafePageId, documentFixture('traversal')),
      ).rejects.toThrow('Builder revision pageId must be an exact safe path segment.');
    }
    for (const unsafeRevisionId of ['../escaped', 'nested/revision', 'dotted.revision', 'back\\slash']) {
      await expect(
        readRevisionDocument('qa-site', 'home', unsafeRevisionId),
      ).rejects.toThrow('Builder revision revisionId must be an exact safe path segment.');
    }
    await expect(
      recordRevision('../unsafe-site', 'home', documentFixture('traversal')),
    ).rejects.toThrow('Invalid builder site id for mutation');
  });

  it('isolates the same page id by site and blocks cross-site reads and rollback', async () => {
    if (!tempRoot) throw new Error('Expected a temporary root.');
    process.env.BUILDER_REVISIONS_ROOT = path.join(tempRoot, 'isolated-revisions');
    const pageId = 'home';
    const siteADocument = documentFixture('site-a');
    const siteBDocument = documentFixture('site-b');

    const siteARevision = await recordRevision('site-a', pageId, siteADocument);
    const siteBResult = await recordRevision('site-b', pageId, {
      revision: 7,
      savedAt: siteBDocument.updatedAt,
      updatedBy: siteBDocument.updatedBy,
      document: siteBDocument,
    });
    const siteBRevision = siteBResult.revisionId;
    expect(siteBResult.revision).toBe(7);

    await expect(readRevisionDocument('site-a', pageId, siteARevision)).resolves.toEqual(siteADocument);
    await expect(readRevisionDocument('site-b', pageId, siteBRevision)).resolves.toEqual(siteBDocument);
    await expect(readRevisionDocument('site-b', pageId, siteARevision)).resolves.toBeNull();
    await expect(rollbackToRevision('site-b', pageId, siteARevision)).resolves.toBe(false);
    expect(persistenceMock.writePageCanvas).not.toHaveBeenCalled();
    await expect(listRevisions('site-a', pageId)).resolves.toEqual([
      expect.objectContaining({ revisionId: siteARevision, pageId }),
    ]);
    await expect(listRevisions('site-b', pageId)).resolves.toEqual([
      expect.objectContaining({ revisionId: siteBRevision, pageId }),
    ]);
  });

  it('never falls back to a legacy unscoped page directory', async () => {
    if (!tempRoot) throw new Error('Expected a temporary root.');
    const root = path.join(tempRoot, 'isolated-revisions');
    const revisionId = 'home-legacy-revision';
    process.env.BUILDER_REVISIONS_ROOT = root;
    await mkdir(path.join(root, 'home'), { recursive: true });
    await writeFile(path.join(root, 'home', `${revisionId}.json`), JSON.stringify({
      ...documentFixture('legacy'),
      _siteId: 'site-a',
      _pageId: 'home',
      _revisionId: revisionId,
    }));

    await expect(readRevisionDocument('site-a', 'home', revisionId)).resolves.toBeNull();
    await expect(listRevisions('site-a', 'home')).resolves.toEqual([]);
  });

  it.each([null, 42, 'malformed', { _siteId: 'wrong-site' }])(
    'fails closed for malformed or mismatched envelopes: %j',
    async (envelope) => {
      if (!tempRoot) throw new Error('Expected a temporary root.');
      const root = path.join(tempRoot, 'isolated-revisions');
      const revisionId = 'home-envelope-test';
      const directory = path.join(root, 'site-a', 'home');
      process.env.BUILDER_REVISIONS_ROOT = root;
      await mkdir(directory, { recursive: true });
      await writeFile(path.join(directory, `${revisionId}.json`), JSON.stringify(envelope));

      await expect(readRevisionDocument('site-a', 'home', revisionId)).resolves.toBeNull();
      await expect(listRevisions('site-a', 'home')).resolves.toEqual([]);
    },
  );

  it('rejects static ancestor symlinks and hard-linked leaves without changing an outside sentinel', async () => {
    if (!tempRoot) throw new Error('Expected a temporary root.');
    const root = path.join(tempRoot, 'isolated-revisions');
    const outside = path.join(tempRoot, 'outside');
    const sentinel = path.join(outside, 'sentinel.json');
    process.env.BUILDER_REVISIONS_ROOT = root;
    await mkdir(root, { recursive: true });
    await mkdir(outside, { recursive: true });
    await writeFile(sentinel, 'outside sentinel: never mutate');
    const sentinelChecksum = checksum(await readFile(sentinel));
    await symlink(outside, path.join(root, 'linked-site'), 'dir');

    await expect(recordRevision('linked-site', 'home', documentFixture('symlink'))).rejects.toMatchObject({
      code: 'symlink_rejected',
    });

    const directory = path.join(root, 'site-a', 'home');
    const revisionId = 'home-hardlink';
    await mkdir(directory, { recursive: true });
    await link(sentinel, path.join(directory, `${revisionId}.json`));
    await expect(readRevisionDocument('site-a', 'home', revisionId)).rejects.toMatchObject({
      code: 'hardlink_rejected',
    });
    await expect(listRevisions('site-a', 'home')).rejects.toMatchObject({
      code: 'hardlink_rejected',
    });
    expect(checksum(await readFile(sentinel))).toBe(sentinelChecksum);
  });

  it('fails closed on a deterministic revision leaf symlink swap and preserves the outside sentinel', async () => {
    if (!tempRoot) throw new Error('Expected a temporary root.');
    const root = path.join(tempRoot, 'isolated-revisions');
    const outside = path.join(tempRoot, 'outside');
    const sentinel = path.join(outside, 'sentinel.json');
    process.env.BUILDER_REVISIONS_ROOT = root;
    await mkdir(outside, { recursive: true });
    await writeFile(sentinel, 'outside sentinel: never mutate');
    const sentinelChecksum = checksum(await readFile(sentinel));
    const revisionId = await recordRevision('site-a', 'home', documentFixture('inside'));
    const target = path.join(await realpath(root), 'site-a', 'home', `${revisionId}.json`);
    let injected = false;
    _setSafeLocalFsHookForTests(async (stage, absolutePath) => {
      if (!injected && stage === 'after-preflight-before-open' && absolutePath === target) {
        injected = true;
        await unlink(target);
        await symlink(sentinel, target);
      }
    });

    await expect(readRevisionDocument('site-a', 'home', revisionId)).rejects.toMatchObject({
      code: 'symlink_rejected',
    });
    expect(injected).toBe(true);
    expect(checksum(await readFile(sentinel))).toBe(sentinelChecksum);
  });

  it('uses the site-aware Blob pathname and list prefix contract', async () => {
    process.env.BLOB_READ_WRITE_TOKEN = 'test-token';
    blobMock.put.mockResolvedValue({});
    blobMock.list.mockResolvedValue({ blobs: [] });
    blobMock.get.mockResolvedValue(null);

    const revisionId = await recordRevision('site-a', 'home', documentFixture('blob'));
    expect(blobMock.put).toHaveBeenCalledWith(
      `builder-revisions/site-a/home/${revisionId}.json`,
      expect.any(String),
      expect.objectContaining({ access: 'private', allowOverwrite: true }),
    );
    await expect(listRevisions('site-a', 'home')).resolves.toEqual([]);
    expect(blobMock.list).toHaveBeenCalledWith({ prefix: 'builder-revisions/site-a/home/' });
    await expect(readRevisionDocument('site-a', 'home', revisionId)).resolves.toBeNull();
    expect(blobMock.get).toHaveBeenCalledWith(
      `builder-revisions/site-a/home/${revisionId}.json`,
      { access: 'private', useCache: false },
    );
  });

  it('never falls through to stale local revisions when the selected Blob backend fails', async () => {
    if (!tempRoot) throw new Error('Expected a temporary root.');
    const root = path.join(tempRoot, 'isolated-revisions');
    const directory = path.join(root, 'site-a', 'home');
    const localRevisionId = 'home-local-stale';
    process.env.BUILDER_REVISIONS_ROOT = root;
    await mkdir(directory, { recursive: true });
    await writeFile(path.join(directory, `${localRevisionId}.json`), JSON.stringify({
      ...documentFixture('local-stale'),
      _siteId: 'site-a',
      _pageId: 'home',
      _revisionId: localRevisionId,
    }));
    process.env.BLOB_READ_WRITE_TOKEN = 'test-token';
    blobMock.list.mockRejectedValue(new Error('blob list unavailable'));
    blobMock.get.mockRejectedValue(new Error('blob get unavailable'));

    await expect(listRevisions('site-a', 'home')).rejects.toThrow('blob list unavailable');
    await expect(
      readRevisionDocument('site-a', 'home', localRevisionId),
    ).rejects.toThrow('blob get unavailable');
  });
});

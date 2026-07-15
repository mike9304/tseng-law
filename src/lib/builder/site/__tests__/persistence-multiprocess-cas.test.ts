import { spawn, type ChildProcess } from 'node:child_process';
import { readdir, mkdir, mkdtemp, readFile, realpath, rm, writeFile } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import type { BuilderCanvasDocument } from '@/lib/builder/canvas/types';
import {
  PAGE_CANVAS_CAS_ACTIVATION_MARKER,
  PAGE_CANVAS_CAS_MARKER_ENV,
  PAGE_CANVAS_CAS_MODE_ENV,
  PAGE_CANVAS_CAS_ROOT_ENV,
  readPageCanvasRecordState,
  readSiteDocument,
  writePageCanvasRecord,
} from '@/lib/builder/site/persistence';
import {
  createDefaultSiteDocument,
  type BuilderNavItem,
  type BuilderPageMeta,
  type BuilderSiteDocument,
} from '@/lib/builder/site/types';

type IpcMessage = Record<string, unknown> & {
  type: string;
  pid: number;
  round?: number;
};

interface Waiter {
  predicate: (message: IpcMessage) => boolean;
  resolve: (message: IpcMessage) => void;
  reject: (error: Error) => void;
  timeout: ReturnType<typeof setTimeout>;
}

class WorkerHarness {
  readonly messages: IpcMessage[] = [];
  readonly waiters: Waiter[] = [];
  readonly stderr: string[] = [];
  readonly stdout: string[] = [];

  constructor(readonly child: ChildProcess) {
    child.on('message', (message: IpcMessage) => {
      const waiterIndex = this.waiters.findIndex((waiter) => waiter.predicate(message));
      if (waiterIndex >= 0) {
        const [waiter] = this.waiters.splice(waiterIndex, 1);
        clearTimeout(waiter.timeout);
        waiter.resolve(message);
      } else {
        this.messages.push(message);
      }
    });
    child.stdout?.on('data', (chunk) => this.stdout.push(String(chunk)));
    child.stderr?.on('data', (chunk) => this.stderr.push(String(chunk)));
  }

  send(message: Record<string, unknown>): void {
    if (!this.child.connected) {
      throw new Error(`CAS worker IPC is disconnected: ${this.diagnostics()}`);
    }
    this.child.send(message);
  }

  waitFor(
    predicate: (message: IpcMessage) => boolean,
    timeoutMs = 10_000,
  ): Promise<IpcMessage> {
    const queuedIndex = this.messages.findIndex(predicate);
    if (queuedIndex >= 0) {
      return Promise.resolve(this.messages.splice(queuedIndex, 1)[0]);
    }

    return new Promise<IpcMessage>((resolve, reject) => {
      const waiter: Waiter = {
        predicate,
        resolve,
        reject,
        timeout: setTimeout(() => {
          const index = this.waiters.indexOf(waiter);
          if (index >= 0) this.waiters.splice(index, 1);
          reject(new Error(`CAS worker message timed out: ${this.diagnostics()}`));
        }, timeoutMs),
      };
      this.waiters.push(waiter);
    });
  }

  diagnostics(): string {
    return JSON.stringify({
      pid: this.child.pid,
      exitCode: this.child.exitCode,
      signalCode: this.child.signalCode,
      queued: this.messages,
      stdout: this.stdout.join('').slice(-4_000),
      stderr: this.stderr.join('').slice(-4_000),
    });
  }

  async shutdown(): Promise<void> {
    if (this.child.exitCode !== null || this.child.signalCode !== null) return;
    if (this.child.connected) this.child.send({ type: 'shutdown' });
    await new Promise<void>((resolve) => {
      const forceTimer = setTimeout(() => this.child.kill('SIGTERM'), 5_000);
      const killTimer = setTimeout(() => this.child.kill('SIGKILL'), 6_000);
      this.child.once('exit', () => {
        clearTimeout(forceTimer);
        clearTimeout(killTimer);
        resolve();
      });
    });
  }
}

function spawnRaceWorker(
  repoRoot: string,
  siteRoot: string,
  casRoot: string,
): WorkerHarness {
  const child = spawn(process.execPath, [
    path.join(repoRoot, 'node_modules/vite-node/vite-node.mjs'),
    '--root',
    repoRoot,
    '--config',
    path.join(repoRoot, 'vitest.config.ts'),
    path.join(
      repoRoot,
      'src/lib/builder/site/__tests__/support/page-canvas-cas-race-worker.ts',
    ),
  ], {
    cwd: repoRoot,
    env: {
      ...process.env,
      NODE_ENV: 'test',
      BUILDER_SITE_BACKEND: 'local',
      BUILDER_SITE_ROOT: siteRoot,
      BUILDER_USE_BLOB_IN_DEV: '0',
      CONSULTATION_LOG_BACKEND: 'local',
      BLOB_READ_WRITE_TOKEN: '',
      [PAGE_CANVAS_CAS_MODE_ENV]: 'cutover',
      [PAGE_CANVAS_CAS_MARKER_ENV]: PAGE_CANVAS_CAS_ACTIVATION_MARKER,
      [PAGE_CANVAS_CAS_ROOT_ENV]: casRoot,
    },
    stdio: ['ignore', 'pipe', 'pipe', 'ipc'],
    serialization: 'json',
  });
  return new WorkerHarness(child);
}

function spawnSitePersistenceWorker(
  repoRoot: string,
  siteRoot: string,
): WorkerHarness {
  const child = spawn(process.execPath, [
    path.join(repoRoot, 'node_modules/vite-node/vite-node.mjs'),
    '--root',
    repoRoot,
    '--config',
    path.join(repoRoot, 'vitest.config.ts'),
    path.join(
      repoRoot,
      'src/lib/builder/site/__tests__/support/site-persistence-lease-race-worker.ts',
    ),
  ], {
    cwd: repoRoot,
    env: {
      ...process.env,
      NODE_ENV: 'test',
      BUILDER_SITE_BACKEND: 'local',
      BUILDER_SITE_ROOT: siteRoot,
      BUILDER_USE_BLOB_IN_DEV: '0',
      CONSULTATION_LOG_BACKEND: 'local',
      BLOB_READ_WRITE_TOKEN: '',
    },
    stdio: ['ignore', 'pipe', 'pipe', 'ipc'],
    serialization: 'json',
  });
  return new WorkerHarness(child);
}

async function waitForOptional(
  worker: WorkerHarness,
  predicate: (message: IpcMessage) => boolean,
  timeoutMs = 1_000,
): Promise<IpcMessage | null> {
  try {
    return await worker.waitFor(predicate, timeoutMs);
  } catch (error) {
    if (error instanceof Error && error.message.startsWith('CAS worker message timed out:')) {
      return null;
    }
    throw error;
  }
}

function canvas(round: number): BuilderCanvasDocument {
  const savedAt = new Date(Date.UTC(2026, 6, 13, 4, round, 0)).toISOString();
  return {
    version: 1,
    locale: 'ko',
    updatedAt: savedAt,
    updatedBy: `seed-round-${round}`,
    stageWidth: 1280,
    stageHeight: 720,
    nodes: [],
  };
}

const BASE_TIME = '2026-07-13T00:00:00.000Z';
const FIRST_WRITE_TIME = '2026-07-13T00:00:01.000Z';
const SECOND_WRITE_TIME = '2026-07-13T00:00:02.000Z';
const CREATED_AFTER_ALL_WRITES = '2026-07-13T00:00:10.000Z';

function sitePage(
  pageId: string,
  slug: string,
  label: string,
  createdAt = CREATED_AFTER_ALL_WRITES,
): BuilderPageMeta {
  return {
    pageId,
    slug,
    title: { ko: label, 'zh-hant': label, en: label },
    locale: 'ko',
    documentKind: 'canvas-scene-vnext',
    lifecycle: {
      activeDocumentFamily: 'scene-promotable-v1',
      publishBackend: 'builder-snapshot',
      sceneStatus: 'promoted',
    },
    createdAt,
    updatedAt: createdAt,
  };
}

function siteNav(id: string, pageId: string, href: string, label: string): BuilderNavItem {
  return {
    id,
    pageId,
    href,
    label: { ko: label, 'zh-hant': label, en: label },
  };
}

function baseSite(siteId: string): BuilderSiteDocument {
  const site = createDefaultSiteDocument('ko', siteId);
  site.name = 'Lease race base';
  site.createdAt = BASE_TIME;
  site.updatedAt = BASE_TIME;
  site.pages = [{
    ...sitePage('home-ko', '', 'Home', BASE_TIME),
    isHomePage: true,
  }];
  site.navigation = [siteNav('nav-home', 'home-ko', '/', 'Home')];
  return site;
}

function withSiteAddition(
  source: BuilderSiteDocument,
  marker: string,
  updatedAt: string,
  name = `Lease race ${marker}`,
): BuilderSiteDocument {
  const next = structuredClone(source);
  next.name = name;
  next.updatedAt = updatedAt;
  next.pages.push(sitePage(`page-${marker}`, marker, `Page ${marker}`));
  next.navigation.push(siteNav(`nav-${marker}`, `page-${marker}`, `/ko/${marker}`, `Nav ${marker}`));
  return next;
}

async function seedSiteDocument(
  root: string,
  document: BuilderSiteDocument,
): Promise<string> {
  const dir = path.join(root, document.siteId);
  await mkdir(dir, { recursive: true });
  const target = path.join(dir, 'site.json');
  await writeFile(target, JSON.stringify(document), 'utf8');
  return target;
}

function expectExactSiteUnion(
  site: BuilderSiteDocument,
  pageIds: string[],
  navigationIds: string[],
): void {
  expect([...site.pages.map((page) => page.pageId)].sort()).toEqual([...pageIds].sort());
  expect([...site.navigation.map((item) => item.id)].sort()).toEqual([...navigationIds].sort());
  expect(new Set(site.pages.map((page) => page.pageId)).size).toBe(site.pages.length);
  expect(new Set(site.navigation.map((item) => item.id)).size).toBe(site.navigation.length);
}

async function listFilesRecursively(root: string, prefix = ''): Promise<string[]> {
  const entries = await readdir(path.join(root, prefix), { withFileTypes: true });
  const files: string[] = [];
  for (const entry of entries) {
    const relative = path.join(prefix, entry.name);
    if (entry.isDirectory()) files.push(...await listFilesRecursively(root, relative));
    else files.push(relative);
  }
  return files;
}

function isCasControlResidue(relativePath: string): boolean {
  const name = path.basename(relativePath);
  return (
    name.startsWith('.cas-')
    || name.includes('.tmp-')
    || name.endsWith('.lock')
    || name.endsWith('.reclaim')
    || name.endsWith('.delete')
    || name.endsWith('.lock-candidate')
  );
}

describe('page canvas file CAS across OS processes', () => {
  let tempRoot = '';
  const workers: WorkerHarness[] = [];

  afterEach(async () => {
    await Promise.all(workers.splice(0).map((worker) => worker.shutdown()));
    vi.unstubAllEnvs();
    if (tempRoot) await rm(tempRoot, { recursive: true, force: true });
  });

  it('allows exactly one revision-8 winner in 25 updater-barrier races', async () => {
    const repoRoot = process.cwd();
    tempRoot = await realpath(await mkdtemp(path.join(os.tmpdir(), 'page-canvas-multiprocess-cas-')));
    const casRoot = path.join(tempRoot, 'cas-root');
    await mkdir(casRoot, { mode: 0o700 });

    vi.stubEnv('NODE_ENV', 'test');
    vi.stubEnv('BUILDER_SITE_BACKEND', 'local');
    vi.stubEnv('BUILDER_SITE_ROOT', tempRoot);
    vi.stubEnv('BUILDER_USE_BLOB_IN_DEV', '0');
    vi.stubEnv('CONSULTATION_LOG_BACKEND', 'local');
    vi.stubEnv('BLOB_READ_WRITE_TOKEN', '');
    vi.stubEnv(PAGE_CANVAS_CAS_MODE_ENV, 'cutover');
    vi.stubEnv(PAGE_CANVAS_CAS_MARKER_ENV, PAGE_CANVAS_CAS_ACTIVATION_MARKER);
    vi.stubEnv(PAGE_CANVAS_CAS_ROOT_ENV, casRoot);

    workers.push(
      spawnRaceWorker(repoRoot, tempRoot, casRoot),
      spawnRaceWorker(repoRoot, tempRoot, casRoot),
    );
    const booted = await Promise.all(workers.map((worker) => (
      worker.waitFor((message) => message.type === 'booted', 20_000)
    )));
    const childPids = booted.map((message) => message.pid);
    expect(new Set(childPids).size).toBe(2);
    expect(childPids).not.toContain(process.pid);

    let silentOverwriteCount = 0;
    for (let round = 1; round <= 25; round += 1) {
      const siteId = 'multiprocess-cas-site';
      const pageId = `round-${round}`;
      const seedDocument = canvas(round);
      await writePageCanvasRecord(siteId, pageId, {
        revision: 7,
        savedAt: seedDocument.updatedAt,
        updatedBy: `seed-round-${round}`,
        document: seedDocument,
      });

      workers.forEach((worker, index) => worker.send({
        type: 'start-round',
        round,
        siteId,
        pageId,
        writerMarker: `round-${round}-${index === 0 ? 'a' : 'b'}`,
      }));
      const ready = await Promise.all(workers.map((worker) => worker.waitFor(
        (message) => message.round === round
          && (message.type === 'ready' || message.type === 'unexpected'),
      )));
      expect(ready.map((message) => message.type)).toEqual(['ready', 'ready']);
      expect(ready.map((message) => message.observedRevision)).toEqual([7, 7]);
      expect(ready.map((message) => message.updaterCalls)).toEqual([1, 1]);

      workers.forEach((worker) => worker.send({ type: 'release-round', round }));
      const results = await Promise.all(workers.map((worker) => worker.waitFor(
        (message) => message.round === round
          && (message.type === 'result' || message.type === 'unexpected'),
      )));
      expect(results.map((message) => message.type)).toEqual(['result', 'result']);
      expect(results.map((message) => message.updaterCalls)).toEqual([1, 1]);

      const successes = results.filter((message) => message.status === 'success');
      const conflicts = results.filter((message) => message.status === 'conflict');
      expect(successes).toHaveLength(1);
      expect(conflicts).toHaveLength(1);
      expect(successes[0]).toMatchObject({ revision: 8, observedRevision: 7 });
      expect(conflicts[0]).toMatchObject({
        observedRevision: 7,
        isPageCanvasConflict: true,
        isPersistenceConflict: true,
        code: 'conflict',
        opaqueVersionExposed: false,
        current: expect.objectContaining({ revision: 8 }),
      });

      const finalState = await readPageCanvasRecordState(siteId, pageId, 'draft');
      expect(finalState?.record.revision).toBe(8);
      expect(finalState?.record.updatedBy).toBe(successes[0].writerMarker);
      expect(finalState?.record.savedAt).toBe(successes[0].savedAt);
      expect(conflicts[0].current).toEqual({
        revision: finalState?.record.revision,
        savedAt: finalState?.record.savedAt,
      });
      expect(finalState?.record).not.toHaveProperty('storageVersion');

      if (finalState?.record.updatedBy !== successes[0].writerMarker) {
        silentOverwriteCount += 1;
      }
      const residue = (await listFilesRecursively(casRoot)).filter(isCasControlResidue);
      expect(residue).toEqual([]);
    }

    expect(silentOverwriteCount).toBe(0);
  }, 120_000);
});

describe('site document lease across OS processes', () => {
  let tempRoot = '';
  const workers: WorkerHarness[] = [];

  beforeEach(async () => {
    tempRoot = await realpath(await mkdtemp(path.join(os.tmpdir(), 'site-persistence-lease-')));
    vi.stubEnv('NODE_ENV', 'test');
    vi.stubEnv('BUILDER_SITE_BACKEND', 'local');
    vi.stubEnv('BUILDER_SITE_ROOT', tempRoot);
    vi.stubEnv('BUILDER_USE_BLOB_IN_DEV', '0');
    vi.stubEnv('CONSULTATION_LOG_BACKEND', 'local');
    vi.stubEnv('BLOB_READ_WRITE_TOKEN', '');
  });

  afterEach(async () => {
    await Promise.all(workers.splice(0).map((worker) => worker.shutdown()));
    vi.unstubAllEnvs();
    if (tempRoot) await rm(tempRoot, { recursive: true, force: true });
  });

  async function spawnBootedWorkers(count: number): Promise<WorkerHarness[]> {
    const repoRoot = process.cwd();
    const spawned = Array.from({ length: count }, () => (
      spawnSitePersistenceWorker(repoRoot, tempRoot)
    ));
    workers.push(...spawned);
    const booted = await Promise.all(spawned.map((worker) => (
      worker.waitFor((message) => message.type === 'booted', 20_000)
    )));
    const childPids = booted.map((message) => message.pid);
    expect(new Set(childPids).size).toBe(count);
    expect(childPids).not.toContain(process.pid);
    return spawned;
  }

  it('serializes stale site writers so concurrent page and navigation additions survive', async () => {
    const siteId = 'multiprocess-site-writers';
    const initial = baseSite(siteId);
    const writerA = withSiteAddition(initial, 'writer-a', FIRST_WRITE_TIME);
    const writerB = withSiteAddition(initial, 'writer-b', SECOND_WRITE_TIME);
    const target = await seedSiteDocument(tempRoot, initial);
    const [workerA, workerB] = await spawnBootedWorkers(2);

    workerA.send({
      type: 'start-write',
      operationId: 'writer-a',
      document: writerA,
    });
    const captureA = await workerA.waitFor((message) => (
      message.type === 'site-read-captured' && message.operationId === 'writer-a'
    ));
    expect(captureA).toMatchObject({
      status: 'present',
      pageIds: ['home-ko'],
      navigationIds: ['nav-home'],
    });

    workerB.send({
      type: 'start-write',
      operationId: 'writer-b',
      document: writerB,
    });
    await workerB.waitFor((message) => (
      message.type === 'operation-invoked' && message.operationId === 'writer-b'
    ));
    // Before the lease existed, B reached the same base read while A was held
    // here. With the lease, this optional observation times out because B is
    // waiting before it may touch the target.
    const earlyCaptureB = await waitForOptional(workerB, (message) => (
      message.type === 'site-read-captured' && message.operationId === 'writer-b'
    ));

    workerA.send({ type: 'release-site-read', operationId: 'writer-a' });
    await workerA.waitFor((message) => (
      message.type === 'write-result' && message.operationId === 'writer-a'
    ));

    const captureB = earlyCaptureB ?? await workerB.waitFor((message) => (
      message.type === 'site-read-captured' && message.operationId === 'writer-b'
    ));
    workerB.send({ type: 'release-site-read', operationId: 'writer-b' });
    await workerB.waitFor((message) => (
      message.type === 'write-result' && message.operationId === 'writer-b'
    ));

    expect(captureB).toMatchObject({
      status: 'present',
      pageIds: expect.arrayContaining(['home-ko', 'page-writer-a']),
      navigationIds: expect.arrayContaining(['nav-home', 'nav-writer-a']),
    });
    const raw = JSON.parse(await readFile(target, 'utf8')) as BuilderSiteDocument;
    const publicRead = await readSiteDocument(siteId, 'ko');
    for (const persisted of [raw, publicRead]) {
      expectExactSiteUnion(
        persisted,
        ['home-ko', 'page-writer-a', 'page-writer-b'],
        ['nav-home', 'nav-writer-a', 'nav-writer-b'],
      );
      expect(persisted.pages.find((page) => page.pageId === 'page-writer-a')?.title.ko)
        .toBe('Page writer-a');
      expect(persisted.navigation.find((item) => item.id === 'nav-writer-a'))
        .toMatchObject({ href: '/ko/writer-a', pageId: 'page-writer-a' });
    }
    expect((await readdir(path.dirname(target))).sort()).toEqual(['site.json']);
  }, 40_000);

  it('blocks a site reader across a cooperative restore detach instead of manufacturing a default', async () => {
    const siteId = 'multiprocess-site-reader-restore';
    const initial = baseSite(siteId);
    const restored = withSiteAddition(
      initial,
      'restored',
      SECOND_WRITE_TIME,
      'Restored site sentinel',
    );
    const target = await seedSiteDocument(tempRoot, initial);
    const [restoreWorker, readerWorker] = await spawnBootedWorkers(2);

    restoreWorker.send({
      type: 'start-restore',
      operationId: 'restore-reader-gap',
      siteId,
      document: restored,
    });
    await restoreWorker.waitFor((message) => (
      message.type === 'restore-detached' && message.operationId === 'restore-reader-gap'
    ));
    await expect(readFile(target, 'utf8')).rejects.toMatchObject({ code: 'ENOENT' });

    readerWorker.send({
      type: 'start-read',
      operationId: 'reader-during-gap',
      siteId,
      locale: 'ko',
    });
    await readerWorker.waitFor((message) => (
      message.type === 'operation-invoked' && message.operationId === 'reader-during-gap'
    ));
    const earlyCapture = await waitForOptional(readerWorker, (message) => (
      message.type === 'site-read-captured' && message.operationId === 'reader-during-gap'
    ));

    let readResult: IpcMessage;
    if (earlyCapture) {
      // Red-before path: release the captured ENOENT while the restore lease is
      // still holding a real namespace gap. The old reader manufactures a
      // default, which the common assertions below reject after cleanup.
      readerWorker.send({ type: 'release-site-read', operationId: 'reader-during-gap' });
      readResult = await readerWorker.waitFor((message) => (
        message.type === 'read-result' && message.operationId === 'reader-during-gap'
      ));
      restoreWorker.send({ type: 'install-restore', operationId: 'restore-reader-gap' });
      await restoreWorker.waitFor((message) => (
        message.type === 'restore-result' && message.operationId === 'restore-reader-gap'
      ));
    } else {
      restoreWorker.send({ type: 'install-restore', operationId: 'restore-reader-gap' });
      await restoreWorker.waitFor((message) => (
        message.type === 'restore-result' && message.operationId === 'restore-reader-gap'
      ));
      const capture = await readerWorker.waitFor((message) => (
        message.type === 'site-read-captured' && message.operationId === 'reader-during-gap'
      ));
      expect(capture).toMatchObject({
        status: 'present',
        name: 'Restored site sentinel',
        pageIds: expect.arrayContaining(['page-restored']),
        navigationIds: expect.arrayContaining(['nav-restored']),
      });
      readerWorker.send({ type: 'release-site-read', operationId: 'reader-during-gap' });
      readResult = await readerWorker.waitFor((message) => (
        message.type === 'read-result' && message.operationId === 'reader-during-gap'
      ));
    }

    expect(earlyCapture).toBeNull();
    expect(readResult).toMatchObject({
      status: 'success',
      name: 'Restored site sentinel',
      pageIds: expect.arrayContaining(['home-ko', 'page-restored']),
      navigationIds: expect.arrayContaining(['nav-home', 'nav-restored']),
      updatedAt: SECOND_WRITE_TIME,
    });
    const document = readResult.document as BuilderSiteDocument;
    expectExactSiteUnion(
      document,
      ['home-ko', 'page-restored'],
      ['nav-home', 'nav-restored'],
    );
    expect((await readdir(path.dirname(target))).sort()).toEqual(['site.json']);
  }, 40_000);

  it('preserves restored competitor data through a stale write started while site.json is detached', async () => {
    const siteId = 'multiprocess-site-stale-after-restore';
    const initial = baseSite(siteId);
    const restored = withSiteAddition(
      initial,
      'restored',
      SECOND_WRITE_TIME,
      'Restored competitor sentinel',
    );
    const staleWriter = withSiteAddition(
      initial,
      'stale-writer',
      '2026-07-13T00:00:03.000Z',
      'Stale writer intended name',
    );
    const target = await seedSiteDocument(tempRoot, initial);
    const [restoreWorker, writerWorker] = await spawnBootedWorkers(2);

    restoreWorker.send({
      type: 'start-restore',
      operationId: 'restore-before-stale-write',
      siteId,
      document: restored,
    });
    await restoreWorker.waitFor((message) => (
      message.type === 'restore-detached' && message.operationId === 'restore-before-stale-write'
    ));
    await expect(readFile(target, 'utf8')).rejects.toMatchObject({ code: 'ENOENT' });

    writerWorker.send({
      type: 'start-write',
      operationId: 'stale-write-during-gap',
      document: staleWriter,
    });
    await writerWorker.waitFor((message) => (
      message.type === 'operation-invoked' && message.operationId === 'stale-write-during-gap'
    ));
    const earlyCapture = await waitForOptional(writerWorker, (message) => (
      message.type === 'site-read-captured' && message.operationId === 'stale-write-during-gap'
    ));

    restoreWorker.send({ type: 'install-restore', operationId: 'restore-before-stale-write' });
    await restoreWorker.waitFor((message) => (
      message.type === 'restore-result' && message.operationId === 'restore-before-stale-write'
    ));
    const writerCapture = earlyCapture ?? await writerWorker.waitFor((message) => (
      message.type === 'site-read-captured' && message.operationId === 'stale-write-during-gap'
    ));
    writerWorker.send({ type: 'release-site-read', operationId: 'stale-write-during-gap' });
    await writerWorker.waitFor((message) => (
      message.type === 'write-result' && message.operationId === 'stale-write-during-gap'
    ));

    expect(earlyCapture).toBeNull();
    expect(writerCapture).toMatchObject({
      status: 'present',
      name: 'Restored competitor sentinel',
      pageIds: expect.arrayContaining(['home-ko', 'page-restored']),
      navigationIds: expect.arrayContaining(['nav-home', 'nav-restored']),
    });

    const raw = JSON.parse(await readFile(target, 'utf8')) as BuilderSiteDocument;
    const publicRead = await readSiteDocument(siteId, 'ko');
    for (const persisted of [raw, publicRead]) {
      expectExactSiteUnion(
        persisted,
        ['home-ko', 'page-restored', 'page-stale-writer'],
        ['nav-home', 'nav-restored', 'nav-stale-writer'],
      );
      expect(persisted.pages.find((page) => page.pageId === 'page-restored')?.title.ko)
        .toBe('Page restored');
      expect(persisted.navigation.find((item) => item.id === 'nav-restored'))
        .toMatchObject({
          href: '/ko/restored',
          label: { ko: 'Nav restored', 'zh-hant': 'Nav restored', en: 'Nav restored' },
          pageId: 'page-restored',
        });
      expect(persisted.pages.find((page) => page.pageId === 'page-stale-writer')?.title.ko)
        .toBe('Page stale-writer');
    }
    expect((await readdir(path.dirname(target))).sort()).toEqual(['site.json']);
  }, 40_000);
});

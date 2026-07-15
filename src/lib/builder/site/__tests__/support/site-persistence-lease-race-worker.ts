import { createRequire, syncBuiltinESMExports } from 'node:module';
import path from 'node:path';

import type { BuilderSiteDocument } from '@/lib/builder/site/types';

interface StartWriteMessage {
  type: 'start-write';
  operationId: string;
  document: BuilderSiteDocument;
}

interface StartReadMessage {
  type: 'start-read';
  operationId: string;
  siteId: string;
  locale: 'ko' | 'zh-hant' | 'en';
}

interface StartRestoreMessage {
  type: 'start-restore';
  operationId: string;
  siteId: string;
  document: BuilderSiteDocument;
}

interface ReleaseSiteReadMessage {
  type: 'release-site-read';
  operationId: string;
}

interface InstallRestoreMessage {
  type: 'install-restore';
  operationId: string;
}

interface ShutdownMessage {
  type: 'shutdown';
}

type ParentMessage =
  | StartWriteMessage
  | StartReadMessage
  | StartRestoreMessage
  | ReleaseSiteReadMessage
  | InstallRestoreMessage
  | ShutdownMessage;

interface DeferredBarrier {
  promise: Promise<void>;
  resolve: () => void;
}

interface SiteReadGate {
  operationId: string;
  targetPath: string;
  captured: boolean;
  release: DeferredBarrier;
}

interface SiteSummary {
  name: string | null;
  pageIds: string[];
  navigationIds: string[];
  updatedAt: string | null;
}

type FsPromisesModule = typeof import('node:fs/promises');

const require = createRequire(import.meta.url);
const nativeFs = require('node:fs/promises') as FsPromisesModule;
const mutableFs = nativeFs as unknown as {
  readFile: FsPromisesModule['readFile'];
  open: FsPromisesModule['open'];
};
const originalReadFile = nativeFs.readFile.bind(nativeFs) as FsPromisesModule['readFile'];
const originalOpen = nativeFs.open.bind(nativeFs) as FsPromisesModule['open'];

let activeOperationId: string | null = null;
let activeReadGate: SiteReadGate | null = null;
let restoreInstallBarrier: DeferredBarrier | null = null;

function deferredBarrier(): DeferredBarrier {
  let resolve!: () => void;
  const promise = new Promise<void>((done) => {
    resolve = done;
  });
  return { promise, resolve };
}

function send(message: Record<string, unknown>): void {
  if (!process.send) throw new Error('site persistence lease worker requires IPC');
  process.send({ ...message, pid: process.pid });
}

function siteRoot(): string {
  const root = process.env.BUILDER_SITE_ROOT?.trim();
  if (!root) throw new Error('BUILDER_SITE_ROOT is required');
  return path.resolve(root);
}

function sitePath(siteId: string): string {
  return path.join(siteRoot(), siteId, 'site.json');
}

function isExactGatedTarget(input: unknown): boolean {
  if (!activeReadGate || activeReadGate.captured || typeof input !== 'string') return false;
  return path.resolve(input) === activeReadGate.targetPath;
}

function summarizeSiteBytes(bytes: string | Buffer): SiteSummary {
  try {
    const parsed = JSON.parse(typeof bytes === 'string' ? bytes : bytes.toString('utf8')) as {
      name?: unknown;
      pages?: Array<{ pageId?: unknown }>;
      navigation?: Array<{ id?: unknown }>;
      updatedAt?: unknown;
    };
    return {
      name: typeof parsed.name === 'string' ? parsed.name : null,
      pageIds: Array.isArray(parsed.pages)
        ? parsed.pages.flatMap((page) => typeof page?.pageId === 'string' ? [page.pageId] : [])
        : [],
      navigationIds: Array.isArray(parsed.navigation)
        ? parsed.navigation.flatMap((item) => typeof item?.id === 'string' ? [item.id] : [])
        : [],
      updatedAt: typeof parsed.updatedAt === 'string' ? parsed.updatedAt : null,
    };
  } catch {
    return { name: null, pageIds: [], navigationIds: [], updatedAt: null };
  }
}

async function captureSiteRead(
  status: 'present' | 'missing',
  summary?: SiteSummary,
): Promise<void> {
  const gate = activeReadGate;
  if (!gate || gate.captured) return;
  gate.captured = true;
  send({
    type: 'site-read-captured',
    operationId: gate.operationId,
    status,
    ...(summary ?? { name: null, pageIds: [], navigationIds: [], updatedAt: null }),
  });
  await gate.release.promise;
}

function isExactEnoent(error: unknown, targetPath: string): boolean {
  if (!error || typeof error !== 'object') return false;
  const value = error as NodeJS.ErrnoException;
  return value.code === 'ENOENT'
    && typeof value.path === 'string'
    && path.resolve(value.path) === targetPath;
}

mutableFs.readFile = (async (...args: Parameters<FsPromisesModule['readFile']>) => {
  const [input] = args;
  if (!isExactGatedTarget(input)) return originalReadFile(...args);
  const gate = activeReadGate!;
  try {
    const bytes = await originalReadFile(...args);
    const summary = summarizeSiteBytes(
      typeof bytes === 'string' || Buffer.isBuffer(bytes) ? bytes : Buffer.from(bytes),
    );
    await captureSiteRead('present', summary);
    return bytes;
  } catch (error) {
    if (isExactEnoent(error, gate.targetPath)) await captureSiteRead('missing');
    throw error;
  }
}) as FsPromisesModule['readFile'];

mutableFs.open = (async (...args: Parameters<FsPromisesModule['open']>) => {
  const [input] = args;
  if (!isExactGatedTarget(input)) return originalOpen(...args);
  const gate = activeReadGate!;
  try {
    const handle = await originalOpen(...args);
    const bytes = await originalReadFile(gate.targetPath);
    await captureSiteRead('present', summarizeSiteBytes(bytes));
    return handle;
  } catch (error) {
    if (isExactEnoent(error, gate.targetPath)) await captureSiteRead('missing');
    throw error;
  }
}) as FsPromisesModule['open'];

// Persistence and the lease primitive import named bindings from the built-in
// module. Synchronizing after the test-only wrappers are installed makes the
// barrier effective in this child process without a production test hook.
syncBuiltinESMExports();

let persistenceModulePromise: Promise<typeof import('@/lib/builder/site/persistence')> | null = null;
function loadPersistenceModule(): Promise<typeof import('@/lib/builder/site/persistence')> {
  persistenceModulePromise ??= import('@/lib/builder/site/persistence');
  return persistenceModulePromise;
}

type LocalJsonLeaseModule = typeof import('@/lib/builder/storage/local-json-write-lease.mjs');
let leaseModulePromise: Promise<LocalJsonLeaseModule> | null = null;
function loadLeaseModule(): Promise<LocalJsonLeaseModule> {
  leaseModulePromise ??= import('@/lib/builder/storage/local-json-write-lease.mjs');
  return leaseModulePromise;
}

function beginOperation(operationId: string, targetPath?: string): void {
  if (activeOperationId !== null) throw new Error(`worker is busy with ${activeOperationId}`);
  activeOperationId = operationId;
  activeReadGate = targetPath
    ? {
        operationId,
        targetPath: path.resolve(targetPath),
        captured: false,
        release: deferredBarrier(),
      }
    : null;
}

function finishOperation(): void {
  activeReadGate?.release.resolve();
  activeReadGate = null;
  restoreInstallBarrier?.resolve();
  restoreInstallBarrier = null;
  activeOperationId = null;
}

function documentSummary(document: BuilderSiteDocument): SiteSummary {
  return {
    name: document.name,
    pageIds: document.pages.map((page) => page.pageId),
    navigationIds: document.navigation.map((item) => item.id),
    updatedAt: document.updatedAt,
  };
}

async function runWrite(message: StartWriteMessage): Promise<void> {
  try {
    beginOperation(message.operationId, sitePath(message.document.siteId));
    send({ type: 'operation-invoked', operationId: message.operationId, operation: 'write' });
    const { writeSiteDocument } = await loadPersistenceModule();
    await writeSiteDocument(message.document);
    send({ type: 'write-result', operationId: message.operationId, status: 'success' });
  } catch (error) {
    sendUnexpected(message.operationId, error);
  } finally {
    finishOperation();
  }
}

async function runRead(message: StartReadMessage): Promise<void> {
  try {
    beginOperation(message.operationId, sitePath(message.siteId));
    send({ type: 'operation-invoked', operationId: message.operationId, operation: 'read' });
    const { readSiteDocument } = await loadPersistenceModule();
    const document = await readSiteDocument(message.siteId, message.locale);
    send({
      type: 'read-result',
      operationId: message.operationId,
      status: 'success',
      document,
      ...documentSummary(document),
    });
  } catch (error) {
    sendUnexpected(message.operationId, error);
  } finally {
    finishOperation();
  }
}

async function runRestore(message: StartRestoreMessage): Promise<void> {
  try {
    beginOperation(message.operationId);
    restoreInstallBarrier = deferredBarrier();
    send({ type: 'operation-invoked', operationId: message.operationId, operation: 'restore' });
    const {
      atomicRemoveLocalJson,
      atomicWriteLocalJson,
      readLocalJsonFile,
      withLocalJsonWriteLease,
    } = await loadLeaseModule();
    const allowedRoot = siteRoot();
    const targetPath = sitePath(message.siteId);
    await withLocalJsonWriteLease(targetPath, { allowedRoot }, async (lease) => {
      const before = await readLocalJsonFile(lease);
      if (before.kind !== 'present') throw new Error('restore expected an existing site document');
      await atomicRemoveLocalJson(lease, { expectedGeneration: before.generation });
      const detached = await readLocalJsonFile(lease);
      if (detached.kind !== 'missing') throw new Error('restore failed to detach site document');
      send({
        type: 'restore-detached',
        operationId: message.operationId,
        previousGeneration: before.generation,
      });
      await restoreInstallBarrier!.promise;
      await atomicWriteLocalJson(lease, JSON.stringify(message.document), {
        expectedGeneration: null,
      });
      send({
        type: 'restore-installed',
        operationId: message.operationId,
        ...documentSummary(message.document),
      });
    });
    send({ type: 'restore-result', operationId: message.operationId, status: 'success' });
  } catch (error) {
    sendUnexpected(message.operationId, error);
  } finally {
    finishOperation();
  }
}

function sendUnexpected(operationId: string, error: unknown): void {
  send({
    type: 'unexpected',
    operationId,
    errorName: error instanceof Error ? error.name : 'UnknownError',
    errorMessage: error instanceof Error ? error.message : 'non-error rejection',
    errorCode: error && typeof error === 'object' && 'code' in error
      ? String((error as { code?: unknown }).code)
      : null,
  });
}

process.on('message', (message: ParentMessage) => {
  if (!message || typeof message !== 'object') return;
  if (message.type === 'release-site-read') {
    if (message.operationId === activeOperationId) activeReadGate?.release.resolve();
    return;
  }
  if (message.type === 'install-restore') {
    if (message.operationId === activeOperationId) restoreInstallBarrier?.resolve();
    return;
  }
  if (message.type === 'shutdown') {
    if (activeOperationId === null) process.exit(0);
    return;
  }
  if (message.type === 'start-write') {
    void runWrite(message);
    return;
  }
  if (message.type === 'start-read') {
    void runRead(message);
    return;
  }
  if (message.type === 'start-restore') void runRestore(message);
});

void loadPersistenceModule()
  .then(() => send({ type: 'booted' }))
  .catch((error: unknown) => sendUnexpected('boot', error));

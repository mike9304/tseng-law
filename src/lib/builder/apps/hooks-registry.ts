/**
 * F109 — App extension hooks registry (first slice).
 *
 * In-memory map of live (appId, kind, hookId) → handler, plus a JSON file
 * at `runtime-data/apps/hook-registrations.json` that persists metadata so
 * registrations survive a process restart. Handlers themselves cannot be
 * persisted (functions are not JSON-serialisable); after reload, persisted
 * records exist but stay "dormant" until an app re-binds a live handler.
 *
 * Dispatch ordering is priority descending, then insertion order. Individual
 * handler errors are caught + logged via F110's dev log buffer (`source: 'app'`)
 * and never propagate to the caller — hooks are best-effort by contract.
 */

import { readFile, writeFile, mkdir } from 'fs/promises';
import path from 'path';
import { appendLog } from '@/lib/builder/dev/logs-store';
import {
  isAppHookKind,
  isValidAppHookId,
  isValidAppId,
  makeHookId,
  type AppHookEvent,
  type AppHookHandler,
  type AppHookKind,
  type HookDispatchSummary,
  type RegisteredAppHook,
  type RegisteredAppHookRecord,
  type RegisteredAppHookView,
} from './hooks-model';

interface LiveHookEntry {
  hookId: string;
  appId: string;
  kind: AppHookKind;
  priority: number;
  registeredAt: string;
  handler: AppHookHandler;
}

interface PersistedFile {
  version: 1;
  hooks: RegisteredAppHookRecord[];
}

const REGISTRY_FILE_REL = path.join('runtime-data', 'apps', 'hook-registrations.json');

const liveByKind = new Map<AppHookKind, LiveHookEntry[]>();
const recordsByHookId = new Map<string, RegisteredAppHookRecord>();
let loaded = false;
let writeQueue: Promise<void> = Promise.resolve();
let insertionCounter = 0;

function registryFilePath(): string {
  return path.join(process.cwd(), REGISTRY_FILE_REL);
}

async function loadFromDiskIfNeeded(): Promise<void> {
  if (loaded) return;
  loaded = true;
  try {
    const text = await readFile(registryFilePath(), 'utf8');
    const parsed = JSON.parse(text) as Partial<PersistedFile>;
    if (!parsed || typeof parsed !== 'object' || !Array.isArray(parsed.hooks)) return;
    for (const raw of parsed.hooks) {
      if (!raw || typeof raw !== 'object') continue;
      const record = normalizeRecord(raw as Partial<RegisteredAppHookRecord>);
      if (record) recordsByHookId.set(record.hookId, record);
    }
  } catch {
    // No prior registry file — start with an empty store.
  }
}

function normalizeRecord(input: Partial<RegisteredAppHookRecord>): RegisteredAppHookRecord | null {
  if (!input.hookId || !input.appId || !input.kind) return null;
  if (!isValidAppId(input.appId) || !isAppHookKind(input.kind) || !isValidAppHookId(input.hookId)) {
    return null;
  }
  const priority = typeof input.priority === 'number' && Number.isFinite(input.priority)
    ? Math.trunc(input.priority)
    : 0;
  const registeredAt = typeof input.registeredAt === 'string' && Number.isFinite(Date.parse(input.registeredAt))
    ? input.registeredAt
    : new Date().toISOString();
  return {
    hookId: input.hookId,
    appId: input.appId,
    kind: input.kind,
    priority,
    registeredAt,
    ...(input.codeSecretId ? { codeSecretId: input.codeSecretId } : {}),
    ...(input.codeStubNote ? { codeStubNote: input.codeStubNote } : {}),
  };
}

function queueWrite(): Promise<void> {
  const snapshot: PersistedFile = {
    version: 1,
    hooks: [...recordsByHookId.values()].sort((a, b) => a.registeredAt.localeCompare(b.registeredAt)),
  };
  const json = JSON.stringify(snapshot, null, 2);
  const filePath = registryFilePath();
  writeQueue = writeQueue.then(async () => {
    await mkdir(path.dirname(filePath), { recursive: true });
    await writeFile(filePath, json, 'utf8');
  }).catch((error) => {
    appendLog('app', {
      level: 'error',
      message: `hook registry persist failed: ${error instanceof Error ? error.message : String(error)}`,
      reference: 'hooks-registry',
    });
  });
  return writeQueue;
}

function sortKindList(kind: AppHookKind): void {
  const list = liveByKind.get(kind);
  if (!list) return;
  list.sort((left, right) => {
    if (left.priority !== right.priority) return right.priority - left.priority;
    return left.registeredAt.localeCompare(right.registeredAt);
  });
}

/**
 * Register (or replace) a hook. Returns the resolved hookId. Idempotent on
 * (appId, kind, hookId): a second call with the same triple replaces the
 * handler binding in place.
 */
export async function registerAppHook(hook: RegisteredAppHook): Promise<string> {
  await loadFromDiskIfNeeded();
  if (!isValidAppId(hook.appId)) {
    throw new Error(`registerAppHook: invalid appId '${hook.appId}'`);
  }
  if (!isAppHookKind(hook.kind)) {
    throw new Error(`registerAppHook: invalid hook kind '${hook.kind}'`);
  }
  if (typeof hook.handler !== 'function') {
    throw new Error('registerAppHook: handler must be a function');
  }
  const priority = typeof hook.priority === 'number' && Number.isFinite(hook.priority)
    ? Math.trunc(hook.priority)
    : 0;
  insertionCounter += 1;
  const hookId = hook.hookId && isValidAppHookId(hook.hookId)
    ? hook.hookId
    : makeHookId(hook.appId, hook.kind, String(insertionCounter));
  if (!isValidAppHookId(hookId)) {
    throw new Error(`registerAppHook: derived hookId '${hookId}' is invalid`);
  }
  const registeredAt = new Date().toISOString();

  // Replace any existing live binding for the same hookId.
  const existing = liveByKind.get(hook.kind) ?? [];
  const filtered = existing.filter((entry) => entry.hookId !== hookId);
  filtered.push({
    hookId,
    appId: hook.appId,
    kind: hook.kind,
    priority,
    registeredAt,
    handler: hook.handler,
  });
  liveByKind.set(hook.kind, filtered);
  sortKindList(hook.kind);

  const existingRecord = recordsByHookId.get(hookId);
  const record: RegisteredAppHookRecord = {
    hookId,
    appId: hook.appId,
    kind: hook.kind,
    priority,
    registeredAt: existingRecord?.registeredAt ?? registeredAt,
    ...(existingRecord?.codeSecretId ? { codeSecretId: existingRecord.codeSecretId } : {}),
    ...(existingRecord?.codeStubNote ? { codeStubNote: existingRecord.codeStubNote } : {}),
  };
  recordsByHookId.set(hookId, record);
  await queueWrite();
  return hookId;
}

/**
 * Persist a metadata-only record (no live handler yet). Useful for the POST
 * route that stores a hook code body without immediately binding a handler.
 */
export async function registerAppHookRecord(record: RegisteredAppHookRecord): Promise<RegisteredAppHookRecord> {
  await loadFromDiskIfNeeded();
  const normalized = normalizeRecord(record);
  if (!normalized) throw new Error('registerAppHookRecord: invalid record');
  const existing = recordsByHookId.get(normalized.hookId);
  const merged: RegisteredAppHookRecord = {
    ...normalized,
    registeredAt: existing?.registeredAt ?? normalized.registeredAt,
    ...(record.codeSecretId ? { codeSecretId: record.codeSecretId } : existing?.codeSecretId ? { codeSecretId: existing.codeSecretId } : {}),
    ...(record.codeStubNote ? { codeStubNote: record.codeStubNote } : existing?.codeStubNote ? { codeStubNote: existing.codeStubNote } : {}),
  };
  recordsByHookId.set(merged.hookId, merged);
  await queueWrite();
  return merged;
}

/** Remove every hook (live + persisted) for the given app. Returns removed count. */
export async function unregisterAppHooks(appId: string): Promise<number> {
  await loadFromDiskIfNeeded();
  let removed = 0;
  for (const [kind, list] of liveByKind.entries()) {
    const next = list.filter((entry) => {
      if (entry.appId === appId) {
        removed += 1;
        return false;
      }
      return true;
    });
    if (next.length === 0) liveByKind.delete(kind);
    else liveByKind.set(kind, next);
  }
  for (const [hookId, record] of recordsByHookId.entries()) {
    if (record.appId === appId) recordsByHookId.delete(hookId);
  }
  await queueWrite();
  return removed;
}

/** Remove a single hook by hookId (live + persisted). Returns true when found. */
export async function unregisterAppHook(hookId: string): Promise<boolean> {
  await loadFromDiskIfNeeded();
  let foundLive = false;
  for (const [kind, list] of liveByKind.entries()) {
    const next = list.filter((entry) => {
      if (entry.hookId === hookId) {
        foundLive = true;
        return false;
      }
      return true;
    });
    if (next.length === 0) liveByKind.delete(kind);
    else liveByKind.set(kind, next);
  }
  const foundRecord = recordsByHookId.delete(hookId);
  if (foundLive || foundRecord) {
    await queueWrite();
  }
  return foundLive || foundRecord;
}

/**
 * Fire every live handler bound to `event.kind` in priority-desc order.
 * Errors are swallowed per handler and logged to F110 dev logs.
 * Returns a summary with the count of successful invocations.
 */
export async function dispatchAppHook(event: AppHookEvent): Promise<HookDispatchSummary> {
  await loadFromDiskIfNeeded();
  const dispatchedAt = new Date().toISOString();
  const list = liveByKind.get(event.kind);
  if (!list || list.length === 0) {
    return { kind: event.kind, invoked: 0, failed: 0, dispatchedAt };
  }
  // Snapshot so handler-driven mutations during dispatch don't disturb iteration.
  const snapshot = [...list];
  let invoked = 0;
  let failed = 0;
  for (const entry of snapshot) {
    const ctx = {
      appId: entry.appId,
      log: (message: string) => {
        appendLog('app', {
          level: 'log',
          message: String(message),
          reference: `${entry.appId}:${entry.hookId}`,
        });
      },
    };
    try {
      await entry.handler(event, ctx);
      invoked += 1;
    } catch (error) {
      failed += 1;
      appendLog('app', {
        level: 'error',
        message: `hook ${entry.hookId} (${entry.kind}) threw: ${error instanceof Error ? error.message : String(error)}`,
        reference: `${entry.appId}:${entry.hookId}`,
      });
    }
  }
  return { kind: event.kind, invoked, failed, dispatchedAt };
}

/** Diagnostics: return persisted records joined with current handler liveness. */
export async function listRegisteredAppHooks(): Promise<RegisteredAppHookView[]> {
  await loadFromDiskIfNeeded();
  const liveHookIds = new Set<string>();
  for (const list of liveByKind.values()) {
    for (const entry of list) liveHookIds.add(entry.hookId);
  }
  return [...recordsByHookId.values()]
    .sort((left, right) => {
      if (left.kind !== right.kind) return left.kind.localeCompare(right.kind);
      if (left.priority !== right.priority) return right.priority - left.priority;
      return left.registeredAt.localeCompare(right.registeredAt);
    })
    .map((record) => ({
      ...record,
      hasHandler: liveHookIds.has(record.hookId),
    }));
}

/**
 * Wait for any in-flight registry write to complete. Used by tests that need
 * to assert disk state immediately after a register/unregister call.
 */
export async function flushAppHookWrites(): Promise<void> {
  await writeQueue;
}

/**
 * Test-only helper. Clears the in-memory registry and resets the on-disk
 * load gate so the next access re-reads from the (now-empty) file.
 */
export function __resetHooksForTests(): void {
  liveByKind.clear();
  recordsByHookId.clear();
  loaded = false;
  insertionCounter = 0;
  writeQueue = Promise.resolve();
}
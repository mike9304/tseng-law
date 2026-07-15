import { createHash } from 'node:crypto';
import { mkdtempSync, readFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { afterAll, afterEach, beforeAll, beforeEach, describe, expect, it, vi } from 'vitest';
import { clearLogs, listLogs, resetDevLogsMemory } from '@/lib/builder/dev/logs-store';
import {
  createBuilderFunction,
  saveBuilderFunctions,
} from '@/lib/builder/dev/functions-model';
import {
  parseCanvasCodeSlotRunPayload,
  runCanvasCodeSlot,
} from '@/lib/builder/dev/code-slots';

// Permanent read-only canonical-stability guards for both stores this suite
// touches (functions store + dev function log). Before any storage call runs we
// snapshot the bytes (or recorded absence) of each canonical file and assert
// each is byte-for-byte unchanged when the suite ends. The hooks only ever
// read canonical data and fail if the suite creates, deletes, or mutates it.
const CANONICAL_FILES = [
  'runtime-data/builder-dev/functions.json',
  'runtime-data/dev/logs/function.json',
] as const;

interface CanonicalByteSnapshot {
  exists: boolean;
  hash: string | null;
}

function snapshotCanonicalBytes(absPath: string): CanonicalByteSnapshot {
  try {
    const bytes = readFileSync(absPath);
    return { exists: true, hash: createHash('sha256').update(bytes).digest('hex') };
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
      return { exists: false, hash: null };
    }
    throw error;
  }
}

describe('canvas code slot runner', () => {
  let tempRoot: string;
  const canonicalBefore: Record<string, CanonicalByteSnapshot> = {};

  beforeAll(() => {
    for (const rel of CANONICAL_FILES) {
      canonicalBefore[rel] = snapshotCanonicalBytes(path.join(process.cwd(), rel));
    }
  });

  beforeEach(async () => {
    // Redirect both stores to a fresh temp root before any storage call. The
    // functions store follows BUILDER_RUNTIME_DATA_ROOT; the dev function log
    // follows BUILDER_OPS_DEV_LOGS_PATH. Force the deterministic local backend
    // for both (functions: blank token + BUILDER_SITE_BACKEND=local; logs:
    // blank token + BUILDER_DEV_LOGS_BACKEND=local) so neither reaches blob nor
    // the canonical runtime-data tree.
    tempRoot = mkdtempSync(path.join(tmpdir(), 'code-slots-'));
    vi.stubEnv('BUILDER_RUNTIME_DATA_ROOT', path.join(tempRoot, 'runtime-data'));
    vi.stubEnv('BUILDER_OPS_DEV_LOGS_PATH', path.join(tempRoot, 'runtime-data', 'dev', 'logs'));
    vi.stubEnv('BLOB_READ_WRITE_TOKEN', '');
    vi.stubEnv('BUILDER_USE_BLOB_IN_DEV', '');
    vi.stubEnv('BUILDER_SITE_BACKEND', 'local');
    vi.stubEnv('BUILDER_DEV_LOGS_BACKEND', 'local');
    clearLogs('function');
    await saveBuilderFunctions([]);
  });

  afterEach(() => {
    // Clear only the temp-backed function log while the temp env is still
    // active, reset the in-memory log buffers, remove the temp root, then
    // restore all env values.
    clearLogs('function');
    resetDevLogsMemory();
    rmSync(tempRoot, { recursive: true, force: true });
    vi.unstubAllEnvs();
  });

  afterAll(() => {
    for (const rel of CANONICAL_FILES) {
      const after = snapshotCanonicalBytes(path.join(process.cwd(), rel));
      expect(
        after,
        `canonical ${rel} must not be created, deleted, or mutated by this suite`,
      ).toEqual(canonicalBefore[rel]);
    }
  });

  it('runs executable canvas code blocks and records their logs', async () => {
    const parsed = parseCanvasCodeSlotRunPayload({
      title: 'Canvas score slot',
      language: 'js',
      code: 'ctx.log("canvas slot ran"); return { score: 42 };',
    });

    expect(parsed.ok).toBe(true);
    if (!parsed.ok) throw new Error(parsed.error);

    const result = await runCanvasCodeSlot(parsed.payload);

    expect(result.ok).toBe(true);
    if (!result.ok) throw new Error(result.error);
    expect(result.result).toEqual({ score: 42 });
    expect(result.logs).toHaveLength(1);
    expect(result.logs[0]?.message).toBe('canvas slot ran');
    const stored = listLogs('function');
    expect(stored).toHaveLength(1);
    expect(stored[0]).toMatchObject({
      level: 'log',
      message: 'canvas slot ran',
      reference: 'canvas-code-block:Canvas score slot',
    });

    resetDevLogsMemory();
    expect(listLogs('function', { reference: 'canvas-code-block:Canvas score slot' })[0])
      .toMatchObject({
        message: 'canvas slot ran',
        reference: 'canvas-code-block:Canvas score slot',
      });
  });

  it('rejects non-executable display-only code block languages', () => {
    const parsed = parseCanvasCodeSlotRunPayload({
      title: 'HTML snippet',
      language: 'html',
      code: '<div>not a function body</div>',
    });

    expect(parsed).toMatchObject({
      ok: false,
      errorCode: 'unsupported_language',
      status: 400,
    });
  });

  it('runs stored builder functions from canvas code slot bindings', async () => {
    const fn = createBuilderFunction({
      name: 'Stored slot',
      slug: 'stored-slot',
      code: 'ctx.log("stored slot ran"); return { source: "stored-function" };',
    });
    await saveBuilderFunctions([fn]);

    const parsed = parseCanvasCodeSlotRunPayload({
      mode: 'function',
      title: 'Function canvas slot',
      functionSlug: fn.slug,
    });

    expect(parsed.ok).toBe(true);
    if (!parsed.ok) throw new Error(parsed.error);

    const result = await runCanvasCodeSlot(parsed.payload);

    expect(result.ok).toBe(true);
    if (!result.ok) throw new Error(result.error);
    expect(result.result).toEqual({ source: 'stored-function' });
    expect(result.logs[0]?.message).toBe('stored slot ran');
    expect(listLogs('function')[0]).toMatchObject({
      level: 'log',
      message: 'stored slot ran',
      reference: 'canvas-code-block:Function canvas slot:function:stored-slot',
    });
  });

  it('returns a typed error when a canvas slot references a missing function', async () => {
    const parsed = parseCanvasCodeSlotRunPayload({
      mode: 'function',
      title: 'Missing function slot',
      functionSlug: 'missing-slot',
    });

    expect(parsed.ok).toBe(true);
    if (!parsed.ok) throw new Error(parsed.error);

    const result = await runCanvasCodeSlot(parsed.payload);

    expect(result).toMatchObject({
      ok: false,
      status: 404,
      errorCode: 'function_not_found',
      error: 'Function not found',
    });
  });
});

import { createHash } from 'node:crypto';
import { mkdtempSync, readFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { afterAll, afterEach, beforeAll, beforeEach, describe, expect, it, vi } from 'vitest';
import {
  BUILDER_FUNCTION_RUNTIME,
  createBuilderFunction,
  generateBuilderFunctionId,
  validateBuilderFunctionInput,
} from '@/lib/builder/dev/functions-model';

// Permanent read-only canonical-stability guard. This suite exercises the
// functions store; before any storage call runs we snapshot the bytes (or
// recorded absence) of the canonical dev store and assert it is byte-for-byte
// unchanged when the suite ends. The hook only ever reads canonical data.
const CANONICAL_FUNCTIONS_PATH = path.join(
  process.cwd(),
  'runtime-data',
  'builder-dev',
  'functions.json',
);

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

describe('builder serverless function model', () => {
  let tempRoot: string;
  let canonicalBefore: CanonicalByteSnapshot;

  beforeAll(() => {
    canonicalBefore = snapshotCanonicalBytes(CANONICAL_FUNCTIONS_PATH);
  });

  beforeEach(() => {
    // Redirect the functions store to a fresh temp root via the repo-wide
    // contract env, and force the deterministic local file backend so the
    // round-trip test never reaches the blob branch or the canonical tree.
    tempRoot = mkdtempSync(path.join(tmpdir(), 'fn-model-'));
    vi.stubEnv('BUILDER_RUNTIME_DATA_ROOT', tempRoot);
    vi.stubEnv('BLOB_READ_WRITE_TOKEN', '');
    vi.stubEnv('BUILDER_USE_BLOB_IN_DEV', '');
    vi.stubEnv('BUILDER_SITE_BACKEND', 'local');
  });

  afterEach(() => {
    vi.unstubAllEnvs();
    rmSync(tempRoot, { recursive: true, force: true });
  });

  afterAll(() => {
    const after = snapshotCanonicalBytes(CANONICAL_FUNCTIONS_PATH);
    expect(
      after,
      'canonical runtime-data/builder-dev/functions.json must not be created, deleted, or mutated by this suite',
    ).toEqual(canonicalBefore);
  });

  it('generates monotonically unique ids', () => {
    const a = generateBuilderFunctionId();
    const b = generateBuilderFunctionId();
    expect(a).not.toBe(b);
    expect(a).toMatch(/^fn-/);
  });

  it('creates a function with sensible defaults', () => {
    const fn = createBuilderFunction({ name: ' Hello ', slug: 'HELLO', code: 'return 1' });
    expect(fn.name).toBe('Hello');
    expect(fn.slug).toBe('hello');
    expect(fn.runtime).toBe(BUILDER_FUNCTION_RUNTIME);
    expect(fn.enabled).toBe(true);
    expect(fn.createdAt).toBe(fn.updatedAt);
  });

  it('validates name + slug + code', () => {
    expect(validateBuilderFunctionInput({ name: '', slug: 'a', code: '' }, []))
      .toEqual({ field: 'name', message: expect.any(String) });
    expect(validateBuilderFunctionInput({ name: 'n', slug: '', code: '' }, []))
      .toEqual({ field: 'slug', message: expect.any(String) });
    expect(validateBuilderFunctionInput({ name: 'n', slug: 'Bad Slug', code: '' }, []))
      .toEqual({ field: 'slug', message: expect.any(String) });
    expect(validateBuilderFunctionInput({ name: 'n', slug: 'ok', code: 'x'.repeat(20001) }, []))
      .toEqual({ field: 'code', message: expect.any(String) });
  });

  it('rejects saved function bodies with JavaScript syntax errors', () => {
    expect(validateBuilderFunctionInput(
      { name: 'Async', slug: 'async', code: 'await Promise.resolve(ctx.now());\nreturn true;' },
      [],
    )).toBeNull();
    expect(validateBuilderFunctionInput(
      { name: 'Broken', slug: 'broken', code: 'return ctx.now();\n}' },
      [],
    )).toEqual({
      field: 'code',
      message: expect.stringContaining('valid JavaScript function body'),
    });
  });

  it('rejects duplicate slugs but allows updates by id', () => {
    const existing = [createBuilderFunction({ name: 'A', slug: 'one', code: '' })];
    expect(validateBuilderFunctionInput({ name: 'B', slug: 'one', code: '' }, existing))
      .toEqual({ field: 'slug', message: 'slug already exists' });
    expect(validateBuilderFunctionInput(
      { name: 'A2', slug: 'one', code: '' },
      existing,
      existing[0].id,
    )).toBeNull();
  });

  it('round-trips through readBuilderFunctions/saveBuilderFunctions', async () => {
    const mod = await import('@/lib/builder/dev/functions-model');
    const fn = mod.createBuilderFunction({ name: 'rt', slug: 'rt-slug', code: 'return 42' });
    // Real save/read round trip through the local file backend (no mocked fs).
    await mod.saveBuilderFunctions([fn]);

    // The env root must be honored: the fixture lands under the temp root's
    // builder-dev/functions.json, never in the canonical runtime-data tree.
    const expectedTempStore = path.join(tempRoot, 'builder-dev', 'functions.json');
    const written = JSON.parse(readFileSync(expectedTempStore, 'utf8'));
    expect(written.functions).toHaveLength(1);
    expect(written.functions[0]).toMatchObject({ slug: 'rt-slug', code: 'return 42' });

    const list = await mod.readBuilderFunctions();
    const restored = list.find((entry) => entry.id === fn.id);
    expect(restored).toBeTruthy();
    expect(restored?.slug).toBe('rt-slug');
    expect(restored?.code).toBe('return 42');
  });
});

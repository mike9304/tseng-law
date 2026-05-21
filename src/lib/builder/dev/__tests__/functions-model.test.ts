import { describe, expect, it } from 'vitest';
import {
  BUILDER_FUNCTION_RUNTIME,
  createBuilderFunction,
  generateBuilderFunctionId,
  validateBuilderFunctionInput,
} from '@/lib/builder/dev/functions-model';

describe('builder serverless function model', () => {
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
    // Smoke-test the save/read API; we use the local file backend in the
    // test environment so this exercises the JSON serializer end-to-end.
    await mod.saveBuilderFunctions([fn]);
    const list = await mod.readBuilderFunctions();
    const restored = list.find((entry) => entry.id === fn.id);
    expect(restored).toBeTruthy();
    expect(restored?.slug).toBe('rt-slug');
    expect(restored?.code).toBe('return 42');
  });
});
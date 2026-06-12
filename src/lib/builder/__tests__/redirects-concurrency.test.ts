import { beforeEach, describe, expect, it, vi } from 'vitest';
import { createRedirect } from '@/lib/builder/site/redirects';
import type { BuilderSiteDocument } from '@/lib/builder/site/types';

const state = vi.hoisted(() => ({
  disk: null as unknown as BuilderSiteDocument,
  queue: Promise.resolve(),
}));

vi.mock('@/lib/builder/site/persistence', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@/lib/builder/site/persistence')>();
  return {
    ...actual,
    readSiteDocument: vi.fn(async () => structuredClone(state.disk)),
    // Mirrors the real write path: serialized writes that merge the incoming
    // document with the latest persisted state via the real reconcile logic.
    writeSiteDocument: vi.fn(async (doc: BuilderSiteDocument, options = {}) => {
      const previous = state.queue;
      let release!: () => void;
      state.queue = new Promise<void>((resolve) => {
        release = resolve;
      });
      await previous;
      try {
        const merged = actual.reconcileSiteDocumentRedirectsForWrite(doc, state.disk, options);
        state.disk = structuredClone(merged);
      } finally {
        release();
      }
    }),
  };
});

function makeSiteDoc(): BuilderSiteDocument {
  return {
    siteId: 'default',
    redirects: [],
    updatedAt: new Date().toISOString(),
  } as unknown as BuilderSiteDocument;
}

describe('createRedirect concurrency', () => {
  beforeEach(() => {
    state.disk = makeSiteDoc();
    state.queue = Promise.resolve();
  });

  it('persists and returns the redirect on the normal path', async () => {
    const result = await createRedirect('default', 'ko', { from: '/old', to: '/new' });

    expect('redirect' in result).toBe(true);
    expect((state.disk.redirects ?? []).map((r) => r.from)).toEqual(['/old']);
  });

  it('reports a duplicate-source error instead of silently dropping the loser of a concurrent create', async () => {
    const results = await Promise.all([
      createRedirect('default', 'ko', { from: '/old', to: '/winner' }),
      createRedirect('default', 'ko', { from: '/old', to: '/loser' }),
    ]);

    const successes = results.filter((r) => 'redirect' in r);
    const failures = results.filter((r) => 'error' in r);
    expect(successes).toHaveLength(1);
    expect(failures).toHaveLength(1);
    const failure = failures[0] as { error: { field: string; message: string } };
    expect(failure.error.field).toBe('from');
    expect(failure.error.message).toContain('already has an active redirect');

    const persistedForPath = (state.disk.redirects ?? []).filter((r) => r.from === '/old');
    expect(persistedForPath).toHaveLength(1);
  });

  it('keeps independent concurrent creates for different paths', async () => {
    const results = await Promise.all([
      createRedirect('default', 'ko', { from: '/a', to: '/a-new' }),
      createRedirect('default', 'ko', { from: '/b', to: '/b-new' }),
    ]);

    expect(results.every((r) => 'redirect' in r)).toBe(true);
    expect((state.disk.redirects ?? []).map((r) => r.from).sort()).toEqual(['/a', '/b']);
  });
});

import { beforeEach, describe, expect, it, vi } from 'vitest';
import {
  createRedirect,
  deleteRedirect,
  RedirectDeletePersistenceError,
  updateRedirect,
  type RedirectValidationError,
} from '@/lib/builder/site/redirects';
import {
  createDefaultSiteDocument,
  type BuilderSiteDocument,
  type SiteRedirect,
} from '@/lib/builder/site/types';

type RedirectTestState = {
  disk: BuilderSiteDocument | null;
  queue: Promise<void>;
  staleDeletedRedirectId: string | null;
};

const state = vi.hoisted<RedirectTestState>(() => ({
  disk: null,
  queue: Promise.resolve(),
  staleDeletedRedirectId: null,
}));

vi.mock('@/lib/builder/site/persistence', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@/lib/builder/site/persistence')>();
  return {
    ...actual,
    readSiteDocument: vi.fn(async () => {
      if (!state.disk) throw new Error('test site document is not initialized');
      return structuredClone(state.disk);
    }),
    // Mirrors the real write path: serialized writes that merge the incoming
    // document with the latest persisted state via the real reconcile logic.
    writeSiteDocument: vi.fn(async (doc: BuilderSiteDocument, options = {}) => {
      const previous = state.queue;
      let releaseWrite = (): void => {
        throw new Error('test write queue release callback is not initialized');
      };
      state.queue = new Promise<void>((resolve) => {
        releaseWrite = resolve;
      });
      await previous;
      try {
        if (!state.disk) throw new Error('test site document is not initialized');
        const staleRedirect = state.staleDeletedRedirectId
          ? (state.disk.redirects ?? []).find((redirect) => (
              redirect.redirectId === state.staleDeletedRedirectId
            ))
          : undefined;
        const merged = actual.reconcileSiteDocumentRedirectsForWrite(doc, state.disk, options);
        const mergedRedirects = merged.redirects ?? [];
        const resurrected = staleRedirect && !mergedRedirects.some((redirect) => (
          redirect.redirectId === staleRedirect.redirectId
        ));
        state.disk = structuredClone(resurrected
          ? { ...merged, redirects: [...mergedRedirects, staleRedirect] }
          : merged);
      } finally {
        releaseWrite();
      }
    }),
  };
});

function makeSiteDoc(): BuilderSiteDocument {
  return {
    ...createDefaultSiteDocument('ko', 'default'),
    redirects: [],
    updatedAt: new Date().toISOString(),
  };
}

function makeRedirect(redirectId: string, from: string, to: string): SiteRedirect {
  return {
    redirectId,
    from,
    to,
    type: 301,
    isActive: true,
    createdAt: '2026-06-21T00:00:00.000Z',
    updatedAt: '2026-06-21T00:00:00.000Z',
  };
}

function diskRedirects(): readonly SiteRedirect[] {
  if (!state.disk) throw new Error('test site document is not initialized');
  return state.disk.redirects ?? [];
}

describe('createRedirect concurrency', () => {
  beforeEach(() => {
    state.disk = makeSiteDoc();
    state.queue = Promise.resolve();
    state.staleDeletedRedirectId = null;
  });

  it('persists and returns the redirect on the normal path', async () => {
    const result = await createRedirect('default', 'ko', { from: '/old', to: '/new' });

    expect('redirect' in result).toBe(true);
    expect(diskRedirects().map((r) => r.from)).toEqual(['/old']);
  });

  it('reports a duplicate-source error instead of silently dropping the loser of a concurrent create', async () => {
    const results = await Promise.all([
      createRedirect('default', 'ko', { from: '/old', to: '/winner' }),
      createRedirect('default', 'ko', { from: '/old', to: '/loser' }),
    ]);

    const successes = results.filter((r) => 'redirect' in r);
    const failures = results.filter((r): r is { error: RedirectValidationError } => 'error' in r);
    expect(successes).toHaveLength(1);
    expect(failures).toHaveLength(1);
    const failure = failures[0];
    expect(failure).toBeDefined();
    if (!failure) throw new Error('expected one duplicate-source failure');
    expect(failure.error.field).toBe('from');
    expect(failure.error.message).toContain('already has an active redirect');

    const persistedForPath = diskRedirects().filter((r) => r.from === '/old');
    expect(persistedForPath).toHaveLength(1);
  });

  it('keeps independent concurrent creates for different paths', async () => {
    const results = await Promise.all([
      createRedirect('default', 'ko', { from: '/a', to: '/a-new' }),
      createRedirect('default', 'ko', { from: '/b', to: '/b-new' }),
    ]);

    expect(results.every((r) => 'redirect' in r)).toBe(true);
    expect(diskRedirects().map((r) => r.from).sort()).toEqual(['/a', '/b']);
  });

  it('raises a delete failure when a deleted redirect remains persisted after the write', async () => {
    const redirect = makeRedirect('redir-stale', '/stale-source', '/fresh-target');
    state.disk = {
      ...makeSiteDoc(),
      redirects: [redirect],
    };
    state.staleDeletedRedirectId = redirect.redirectId;

    await expect(deleteRedirect('default', 'ko', redirect.redirectId))
      .rejects.toBeInstanceOf(RedirectDeletePersistenceError);
    expect(diskRedirects().map((item) => item.redirectId)).toContain(redirect.redirectId);
  });

  it('rejects activating an inactive wildcard redirect that overlaps active coverage', async () => {
    state.disk = {
      ...makeSiteDoc(),
      redirects: [
        makeRedirect('redir-broad', '/ko/old/*', '/ko/new/*'),
        {
          ...makeRedirect('redir-narrow', '/ko/old/columns/*', '/ko/new-columns/*'),
          isActive: false,
        },
      ],
    };

    const result = await updateRedirect('default', 'ko', 'redir-narrow', { isActive: true });

    expect(result).toMatchObject({
      error: {
        field: 'from',
        code: 'wildcard-overlap',
      },
    });
    expect(diskRedirects().find((redirect) => redirect.redirectId === 'redir-narrow')?.isActive).toBe(false);
  });
});

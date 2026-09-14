import { describe, expect, it } from 'vitest';
import {
  canApplyCreatePageOwnerRefresh,
  createCreatePageRefreshCanApply,
  runCreatePageFollowUp,
  runSilentGuardedRequestApply,
  type CreatePageFollowUpDeps,
  type CreatePageFollowUpHandle,
  type CreatePageFollowUpScope,
  type CreatePageOwnerSnapshot,
} from '../create-page-follow-up';
import { createDraftSaveScopeController } from '../hooks/useSandboxSiteState';

type Deferred<T> = {
  promise: Promise<T>;
  resolve: (value: T | PromiseLike<T>) => void;
  reject: (reason?: unknown) => void;
};

function deferred<T = void>(): Deferred<T> {
  let resolve!: Deferred<T>['resolve'];
  let reject!: Deferred<T>['reject'];
  const promise = new Promise<T>((res, rej) => {
    resolve = res;
    reject = rej;
  });
  return { promise, resolve, reject };
}

const ORIGIN: CreatePageFollowUpScope = { siteId: 'site-1', locale: 'en' };

function owner(patch?: Partial<CreatePageOwnerSnapshot>): CreatePageOwnerSnapshot {
  return { siteId: ORIGIN.siteId, locale: ORIGIN.locale, mounted: true, ...patch };
}

async function settleBackground(handle: CreatePageFollowUpHandle | undefined): Promise<void> {
  if (!handle) return;
  await handle.background.catch(() => {});
}

function baseDeps(
  events: string[],
  overrides: Partial<CreatePageFollowUpDeps> = {},
): CreatePageFollowUpDeps {
  return {
    origin: ORIGIN,
    fetchPages: () => {
      events.push('local-get');
      return Promise.resolve();
    },
    resetChild: () => {
      events.push('reset');
    },
    setCreating: (creating) => {
      events.push(`creating:${String(creating)}`);
    },
    selectPage: () => {
      events.push('select');
    },
    getOwner: () => owner(),
    ...overrides,
  };
}

describe('runCreatePageFollowUp', () => {
  it('resets and selects before parent refresh when POST returned a full page', async () => {
    const events: string[] = [];
    const selectGate = deferred();
    const refreshGate = deferred();
    const refreshStarted = deferred();
    let handle: CreatePageFollowUpHandle | undefined;
    try {
      handle = runCreatePageFollowUp(
        { pageId: 'page-1', page: { pageId: 'page-1', slug: 'about' } },
        'page-1',
        baseDeps(events, {
          fetchPages: () => {
            events.push('local-get');
            return Promise.resolve();
          },
          selectPage: (pageId, slug) => {
            events.push(`select:${pageId}:${slug ?? ''}`);
            return selectGate.promise;
          },
          refreshParentPages: () => {
            events.push('parent-refresh');
            refreshStarted.resolve();
            return refreshGate.promise;
          },
        }),
      );

      expect(handle.creatingHandled).toBe(true);
      expect(events).toEqual(['reset', 'creating:false', 'select:page-1:about']);
      expect(events.includes('local-get')).toBe(false);
      expect(events.includes('parent-refresh')).toBe(false);

      selectGate.resolve();
      await refreshStarted.promise;
      expect(events.indexOf('select:page-1:about')).toBeLessThan(events.indexOf('parent-refresh'));
      expect(events.includes('local-get')).toBe(false);
    } finally {
      selectGate.resolve();
      refreshGate.resolve();
      await settleBackground(handle);
    }
  });

  it('starts parent refresh only after selection settles', async () => {
    const events: string[] = [];
    const selectGate = deferred();
    const refreshGate = deferred();
    const refreshStarted = deferred();
    let handle: CreatePageFollowUpHandle | undefined;
    try {
      handle = runCreatePageFollowUp(
        { pageId: 'page-1', page: { pageId: 'page-1', slug: 'home' } },
        'page-1',
        baseDeps(events, {
          selectPage: () => {
            events.push('select-start');
            return selectGate.promise.then(() => {
              events.push('select-end');
            });
          },
          refreshParentPages: () => {
            events.push('parent-refresh');
            refreshStarted.resolve();
            return refreshGate.promise;
          },
        }),
      );

      expect(events).toEqual(['reset', 'creating:false', 'select-start']);
      selectGate.resolve();
      await refreshStarted.promise;
      expect(events.slice(-2)).toEqual(['select-end', 'parent-refresh']);
    } finally {
      selectGate.resolve();
      refreshGate.resolve();
      await settleBackground(handle);
    }
  });

  it('awaits local GET before reset and selection when page payload is id-only', async () => {
    const events: string[] = [];
    const fetchGate = deferred();
    const selectGate = deferred();
    const selectStarted = deferred();
    let handle: CreatePageFollowUpHandle | undefined;
    try {
      handle = runCreatePageFollowUp(
        { pageId: 'page-1' },
        'page-1',
        baseDeps(events, {
          fetchPages: () => {
            events.push('local-get-start');
            return fetchGate.promise.then(() => {
              events.push('local-get-end');
            });
          },
          selectPage: () => {
            events.push('select');
            selectStarted.resolve();
            return selectGate.promise;
          },
          refreshParentPages: () => {
            events.push('parent-refresh');
            return Promise.resolve();
          },
        }),
      );

      expect(handle.creatingHandled).toBe(false);
      expect(events).toEqual(['local-get-start']);
      fetchGate.resolve();
      await selectStarted.promise;
      expect(events).toEqual(['local-get-start', 'local-get-end', 'reset', 'creating:false', 'select']);
      expect(events.includes('parent-refresh')).toBe(false);
    } finally {
      fetchGate.resolve();
      selectGate.resolve();
      await settleBackground(handle);
    }
  });

  it('falls back to awaited local GET when parent refresh is absent', async () => {
    const events: string[] = [];
    const fetchGate = deferred();
    const selectStarted = deferred();
    let handle: CreatePageFollowUpHandle | undefined;
    try {
      handle = runCreatePageFollowUp(
        { pageId: 'page-1', page: { pageId: 'page-1', slug: 'x' } },
        'page-1',
        baseDeps(events, {
          fetchPages: () => {
            events.push('local-get-start');
            return fetchGate.promise.then(() => {
              events.push('local-get-end');
            });
          },
          selectPage: () => {
            events.push('select');
            selectStarted.resolve();
          },
        }),
      );

      expect(handle.creatingHandled).toBe(false);
      expect(events).toEqual(['local-get-start']);
      fetchGate.resolve();
      await selectStarted.promise;
      expect(events).toEqual(['local-get-start', 'local-get-end', 'reset', 'creating:false', 'select']);
    } finally {
      fetchGate.resolve();
      await settleBackground(handle);
    }
  });

  it('still parent-refreshes when selection fulfills with false', async () => {
    const events: string[] = [];
    const refreshStarted = deferred();
    const refreshGate = deferred();
    let handle: CreatePageFollowUpHandle | undefined;
    try {
      handle = runCreatePageFollowUp(
        { pageId: 'page-1', page: { pageId: 'page-1' } },
        'page-1',
        baseDeps(events, {
          selectPage: () => false,
          refreshParentPages: () => {
            events.push('parent-refresh');
            refreshStarted.resolve();
            return refreshGate.promise;
          },
        }),
      );
      await refreshStarted.promise;
      expect(events.includes('parent-refresh')).toBe(true);
    } finally {
      refreshGate.resolve();
      await settleBackground(handle);
    }
  });

  it('observes rejected selection without parent refresh or background rejection', async () => {
    const events: string[] = [];
    const observed: unknown[] = [];
    let handle: CreatePageFollowUpHandle | undefined;
    try {
      handle = runCreatePageFollowUp(
        { pageId: 'page-1', page: { pageId: 'page-1' } },
        'page-1',
        baseDeps(events, {
          selectPage: () => Promise.reject(new Error('select-failed')),
          refreshParentPages: () => {
            events.push('parent-refresh');
            return Promise.resolve();
          },
          observeBackgroundError: (error) => {
            observed.push(error);
          },
        }),
      );
      await handle.background;
      expect(events.includes('parent-refresh')).toBe(false);
      expect(observed).toHaveLength(1);
      expect((observed[0] as Error).message).toBe('select-failed');
    } finally {
      await settleBackground(handle);
    }
  });

  it('observes fallback selection rejection without treating it as create failure', async () => {
    const observed: unknown[] = [];
    const fetchGate = deferred();
    let handle: CreatePageFollowUpHandle | undefined;
    try {
      handle = runCreatePageFollowUp(
        { pageId: 'page-1' },
        'page-1',
        baseDeps([], {
          fetchPages: () => fetchGate.promise,
          selectPage: () => Promise.reject(new Error('select-failed')),
          observeBackgroundError: (error) => {
            observed.push(error);
          },
        }),
      );
      fetchGate.resolve();
      await handle.background;
      expect(observed).toHaveLength(1);
    } finally {
      fetchGate.resolve();
      await settleBackground(handle);
    }
  });

  it('observes parent refresh rejection without rejecting background', async () => {
    const observed: unknown[] = [];
    const refreshError = new Error('refresh-failed');
    let handle: CreatePageFollowUpHandle | undefined;
    try {
      handle = runCreatePageFollowUp(
        { pageId: 'page-1', page: { pageId: 'page-1' } },
        'page-1',
        baseDeps([], {
          selectPage: () => true,
          refreshParentPages: () => Promise.reject(refreshError),
          observeBackgroundError: (error) => {
            observed.push(error);
          },
        }),
      );
      await handle.background;
      expect(observed).toEqual([refreshError]);
    } finally {
      await settleBackground(handle);
    }
  });

  it('does not start parent refresh when owner site or locale changes before selection settles', async () => {
    const events: string[] = [];
    const selectGate = deferred();
    let current = owner();
    let handle: CreatePageFollowUpHandle | undefined;
    try {
      handle = runCreatePageFollowUp(
        { pageId: 'page-1', page: { pageId: 'page-1' } },
        'page-1',
        baseDeps(events, {
          getOwner: () => current,
          selectPage: () => selectGate.promise,
          refreshParentPages: () => {
            events.push('parent-refresh');
            return Promise.resolve();
          },
        }),
      );
      current = owner({ siteId: 'site-2' });
      selectGate.resolve();
      await handle.background;
      expect(events.includes('parent-refresh')).toBe(false);
    } finally {
      selectGate.resolve();
      await settleBackground(handle);
    }
  });

  it('does not notify refresh errors after the owner unmounts mid-refresh', async () => {
    const observed: unknown[] = [];
    let current = owner();
    let handle: CreatePageFollowUpHandle | undefined;
    try {
      handle = runCreatePageFollowUp(
        { pageId: 'page-1', page: { pageId: 'page-1' } },
        'page-1',
        baseDeps([], {
          getOwner: () => current,
          selectPage: () => undefined,
          refreshParentPages: () => {
            current = owner({ mounted: false });
            return Promise.reject(new Error('refresh-failed'));
          },
          observeBackgroundError: (error) => {
            observed.push(error);
          },
        }),
      );
      await handle.background;
      expect(observed).toEqual([]);
    } finally {
      await settleBackground(handle);
    }
  });
});

describe('canApplyCreatePageOwnerRefresh', () => {
  it('accepts pageId change and rejects site, locale, unmount, and delayed owner reads', () => {
    expect(canApplyCreatePageOwnerRefresh(ORIGIN, owner({ pageId: 'other-page' }))).toBe(true);
    expect(canApplyCreatePageOwnerRefresh(ORIGIN, owner({ siteId: 'site-2' }))).toBe(false);
    expect(canApplyCreatePageOwnerRefresh(ORIGIN, owner({ locale: 'ko' }))).toBe(false);
    expect(canApplyCreatePageOwnerRefresh(ORIGIN, owner({ mounted: false }))).toBe(false);
    expect(canApplyCreatePageOwnerRefresh(ORIGIN, null)).toBe(false);
    expect(canApplyCreatePageOwnerRefresh(ORIGIN, undefined)).toBe(false);

    let current: CreatePageOwnerSnapshot | null = owner({ pageId: 'a' });
    const canApply = createCreatePageRefreshCanApply(ORIGIN, () => current);
    expect(canApply()).toBe(true);
    current = owner({ pageId: 'b' });
    expect(canApply()).toBe(true);
    current = owner({ locale: 'ko' });
    expect(canApply()).toBe(false);
    current = owner({ mounted: false });
    expect(canApply()).toBe(false);
    current = null;
    expect(canApply()).toBe(false);
  });
});

describe('createCreatePageRefreshCanApply live controller getter', () => {
  it('reads controller locale at call time so a pre-rerender transition denies the old origin', () => {
    // Contract only: getOwner shape used by the hook (committed siteId +
    // controller.current().locale + mounted). Does not mount the hook or prove UI.
    const controller = createDraftSaveScopeController('page-1', 'en');
    let latestCommittedSiteId = 'site-1';
    let mounted = true;
    const getOwner = () => ({
      siteId: latestCommittedSiteId,
      locale: controller.current().locale,
      mounted,
    });

    const originEn = { siteId: 'site-1', locale: 'en' };
    const canApplyEn = createCreatePageRefreshCanApply(originEn, getOwner);
    expect(canApplyEn()).toBe(true);

    controller.transition('page-2', 'en');
    expect(canApplyEn()).toBe(true);

    controller.transition('page-2', 'ko');
    expect(canApplyEn()).toBe(false);

    const originKo = { siteId: 'site-1', locale: 'ko' };
    const canApplyKo = createCreatePageRefreshCanApply(originKo, getOwner);
    expect(canApplyKo()).toBe(true);

    latestCommittedSiteId = 'site-2';
    expect(canApplyKo()).toBe(false);
    expect(createCreatePageRefreshCanApply({ siteId: 'site-2', locale: 'ko' }, getOwner)()).toBe(true);

    latestCommittedSiteId = 'site-1';
    mounted = false;
    expect(canApplyKo()).toBe(false);
  });
});



describe('runCreatePageFollowUp convergeOwnPages', () => {
  const created = {
    pageId: 'page-1',
    page: { pageId: 'page-1', slug: 'new-page' },
  };

  it('converges after false selection then refreshes parent', async () => {
    const events: string[] = [];
    const selection = deferred<boolean>();
    const convergeGate = deferred<void>();
    const convergeEntered = deferred<void>();
    const handle = runCreatePageFollowUp(
      created,
      'page-1',
      baseDeps(events, {
        selectPage: () => {
          events.push('select');
          return selection.promise;
        },
        convergeOwnPages: () => {
          events.push('converge-start');
          convergeEntered.resolve(undefined);
          return convergeGate.promise.then(() => {
            events.push('converge-end');
          });
        },
        refreshParentPages: () => {
          events.push('parent');
        },
      }),
    );

    expect(handle.creatingHandled).toBe(true);
    expect(events).toEqual(['reset', 'creating:false', 'select']);

    selection.resolve(false);
    await convergeEntered.promise;
    expect(events).toEqual(['reset', 'creating:false', 'select', 'converge-start']);

    convergeGate.resolve(undefined);
    await settleBackground(handle);
    expect(events).toEqual([
      'reset',
      'creating:false',
      'select',
      'converge-start',
      'converge-end',
      'parent',
    ]);
  });

  it('does not converge when selection is true', async () => {
    const events: string[] = [];
    const handle = runCreatePageFollowUp(
      created,
      'page-1',
      baseDeps(events, {
        selectPage: () => {
          events.push('select');
          return true;
        },
        convergeOwnPages: () => {
          events.push('converge');
        },
        refreshParentPages: () => {
          events.push('parent');
        },
      }),
    );
    await settleBackground(handle);
    expect(events).toEqual(['reset', 'creating:false', 'select', 'parent']);
  });

  it('does not converge when selection is undefined', async () => {
    const events: string[] = [];
    const handle = runCreatePageFollowUp(
      created,
      'page-1',
      baseDeps(events, {
        selectPage: () => {
          events.push('select');
        },
        convergeOwnPages: () => {
          events.push('converge');
        },
        refreshParentPages: () => {
          events.push('parent');
        },
      }),
    );
    await settleBackground(handle);
    expect(events).toEqual(['reset', 'creating:false', 'select', 'parent']);
  });

  it('observes converge rejection and still refreshes parent', async () => {
    const events: string[] = [];
    const handle = runCreatePageFollowUp(
      created,
      'page-1',
      baseDeps(events, {
        selectPage: () => {
          events.push('select');
          return false;
        },
        convergeOwnPages: () => {
          events.push('converge');
          return Promise.reject(new Error('converge-fail'));
        },
        refreshParentPages: () => {
          events.push('parent');
        },
        observeBackgroundError: (error) => {
          events.push(`observed:${error instanceof Error ? error.message : String(error)}`);
        },
      }),
    );
    await settleBackground(handle);
    expect(events).toEqual([
      'reset',
      'creating:false',
      'select',
      'converge',
      'observed:converge-fail',
      'parent',
    ]);
  });

  it('does not converge when selection rejects', async () => {
    const events: string[] = [];
    const handle = runCreatePageFollowUp(
      created,
      'page-1',
      baseDeps(events, {
        selectPage: () => {
          events.push('select');
          return Promise.reject(new Error('select-fail'));
        },
        convergeOwnPages: () => {
          events.push('converge');
        },
        refreshParentPages: () => {
          events.push('parent');
        },
        observeBackgroundError: (error) => {
          events.push(`observed:${error instanceof Error ? error.message : String(error)}`);
        },
      }),
    );
    await settleBackground(handle);
    expect(events).toEqual([
      'reset',
      'creating:false',
      'select',
      'observed:select-fail',
    ]);
  });

  it('does not converge on fallback follow-up', async () => {
    const events: string[] = [];
    const incomplete = runCreatePageFollowUp(
      { pageId: 'page-1' },
      'page-1',
      baseDeps(events, {
        convergeOwnPages: () => {
          events.push('converge');
        },
        refreshParentPages: () => {
          events.push('parent');
        },
      }),
    );
    expect(incomplete.creatingHandled).toBe(false);
    await settleBackground(incomplete);

    const withoutParentRefresh = runCreatePageFollowUp(
      created,
      'page-1',
      baseDeps(events, {
        convergeOwnPages: () => {
          events.push('converge');
        },
      }),
    );
    expect(withoutParentRefresh.creatingHandled).toBe(false);
    await settleBackground(withoutParentRefresh);

    expect(events.includes('converge')).toBe(false);
  });
});

describe('runSilentGuardedRequestApply', () => {
  type PagesPayload = { pages: string[] };

  function mutableOwner(initial: CreatePageOwnerSnapshot | null | undefined = owner()) {
    let current: CreatePageOwnerSnapshot | null | undefined = initial;
    return {
      canApply: createCreatePageRefreshCanApply(ORIGIN, () => current),
      set(next: CreatePageOwnerSnapshot | null | undefined) {
        current = next;
      },
    };
  }

  it('does not start the request when the owner is already invalid', async () => {
    const events: string[] = [];
    const initials: Array<CreatePageOwnerSnapshot | null> = [
      owner({ mounted: false }),
      null,
      owner({ siteId: 'site-2' }),
      owner({ locale: 'ko' }),
    ];

    for (const initial of initials) {
      let requested = false;
      const scoped = mutableOwner(initial);
      await runSilentGuardedRequestApply<PagesPayload>(
        scoped.canApply,
        () => {
          requested = true;
          return { ok: true, json: () => Promise.resolve({ pages: ['p'] }) };
        },
        () => {
          events.push('apply');
        },
      );
      expect({ initial, requested, events }).toEqual({
        initial,
        requested: false,
        events: [],
      });
    }
  });

  it('pending response then owner unmount/site/locale change prevents json/apply', async () => {
    const changes: CreatePageOwnerSnapshot[] = [
      owner({ mounted: false }),
      owner({ siteId: 'site-2' }),
      owner({ locale: 'ko' }),
    ];

    for (const nextOwner of changes) {
      const scoped = mutableOwner();
      const responseWait = deferred<{ ok: boolean; json: () => Promise<PagesPayload> }>();
      let jsonCalled = false;
      const events: string[] = [];
      const pending = runSilentGuardedRequestApply<PagesPayload>(
        scoped.canApply,
        () => responseWait.promise,
        () => {
          events.push('apply');
        },
      );
      scoped.set(nextOwner);
      responseWait.resolve({
        ok: true,
        json: () => {
          jsonCalled = true;
          return Promise.resolve({ pages: ['p'] });
        },
      });
      await pending;
      expect({ jsonCalled, events, nextOwner }).toEqual({
        jsonCalled: false,
        events: [],
        nextOwner,
      });
    }
  });

  it('pending json then owner change prevents apply', async () => {
    const scoped = mutableOwner();
    const jsonWait = deferred<PagesPayload>();
    const events: string[] = [];
    const pending = runSilentGuardedRequestApply<PagesPayload>(
      scoped.canApply,
      () => ({
        ok: true,
        json: () => jsonWait.promise,
      }),
      () => {
        events.push('apply');
      },
    );
    scoped.set(owner({ siteId: 'site-2' }));
    jsonWait.resolve({ pages: ['p'] });
    await pending;
    expect(events).toEqual([]);
  });

  it('owner invalid between apply callbacks prevents the second apply', async () => {
    const scoped = mutableOwner();
    const events: string[] = [];
    await runSilentGuardedRequestApply<PagesPayload>(
      scoped.canApply,
      () => ({
        ok: true,
        json: () => Promise.resolve({ pages: ['p'] }),
      }),
      () => {
        events.push('first');
        scoped.set(owner({ mounted: false }));
      },
      () => {
        events.push('second');
      },
    );
    expect(events).toEqual(['first']);
  });

  it('applies in order while the current owner remains valid', async () => {
    const scoped = mutableOwner();
    const events: string[] = [];
    await runSilentGuardedRequestApply<PagesPayload>(
      scoped.canApply,
      () => ({
        ok: true,
        json: () => Promise.resolve({ pages: ['p'] }),
      }),
      (data) => {
        events.push(`first:${data.pages.join(',')}`);
      },
      (data) => {
        events.push(`second:${data.pages.join(',')}`);
      },
    );
    expect(events).toEqual(['first:p', 'second:p']);
  });

  it('absorbs non-OK, request, and json errors without applying', async () => {
    const scoped = mutableOwner();
    const events: string[] = [];

    await runSilentGuardedRequestApply<PagesPayload>(
      scoped.canApply,
      () => ({
        ok: false,
        json: () => Promise.resolve({ pages: ['p'] }),
      }),
      () => {
        events.push('apply-nonok');
      },
    );

    await runSilentGuardedRequestApply<PagesPayload>(
      scoped.canApply,
      () => Promise.reject(new Error('network')),
      () => {
        events.push('apply-request');
      },
    );

    await runSilentGuardedRequestApply<PagesPayload>(
      scoped.canApply,
      () => ({
        ok: true,
        json: () => Promise.reject(new Error('bad-json')),
      }),
      () => {
        events.push('apply-json');
      },
    );

    expect(events).toEqual([]);
  });
});


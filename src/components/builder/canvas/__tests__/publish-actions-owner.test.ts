import {
  act,
  createElement,
  useState,
  type Dispatch,
  type SetStateAction,
} from 'react';
import { flushSync } from 'react-dom';
import { createRoot, type Root } from 'react-dom/client';
import { afterEach, beforeAll, describe, expect, it, vi } from 'vitest';
import type { BuilderCanvasDocument } from '@/lib/builder/canvas/types';
import { buildSitePagePath } from '@/lib/builder/site/paths';
import { getPublishModalCopy } from '../publish-copy';
import type { DraftMeta } from '../PublishModalTypes';
import { usePublishActions } from '../usePublishActions';

type Props = Parameters<typeof usePublishActions>[0] & { open: boolean };
type Host = {
  getResult: () => ReturnType<typeof usePublishActions>;
  rerender: (patch: Partial<Props>) => Promise<void>;
  setPropsSync: (patch: Partial<Props>) => void;
  unmount: () => Promise<void>;
};
type Gate = {
  url: string;
  method: string;
  body: string | undefined;
  resolve: (response: Response) => void;
  reject: (reason: unknown) => void;
};

const NS = 'http://www.w3.org/1999/xhtml';
const copy = getPublishModalCopy('en');
const roots = new Set<Root>();
const jobs = new Set<Promise<unknown>>();
let gates: Gate[] = [];

const document: BuilderCanvasDocument = {
  version: 1,
  locale: 'en',
  updatedAt: '2026-07-13T00:00:00.000Z',
  updatedBy: 'publish-owner-test',
  stageWidth: 1280,
  stageHeight: 880,
  nodes: [],
};

const OWNER_PATCHES = [
  ['activePageId', { activePageId: 'page-2' }],
  ['siteId', { siteId: 'site-2' }],
  ['locale', { locale: 'ko' }],
] as const;

const STALE_CASES = OWNER_PATCHES.flatMap(([key, patch]) => (
  [
    { key, patch, stage: 'draft-json' },
    { key, patch, stage: 'publish-response' },
    { key, patch, stage: 'publish-json' },
  ] as const
));

function track<T>(promise: Promise<T>): Promise<T> {
  jobs.add(promise);
  void promise.finally(() => {
    jobs.delete(promise);
  });
  return promise;
}

function ensureDomStub(): { container: object } {
  const g = globalThis as typeof globalThis & Record<string, unknown>;
  if (!g.HTMLElement || !g.document) {
    class Node {
      addEventListener() {}
      removeEventListener() {}
      appendChild<T>(child: T): T { return child; }
      removeChild<T>(child: T): T { return child; }
    }
    class HTMLElement extends Node {
      nodeType = 1;
      nodeName: string;
      tagName: string;
      namespaceURI = NS;
      ownerDocument: unknown = null;
      constructor(tag = 'DIV') {
        super();
        this.nodeName = this.tagName = tag.toUpperCase();
      }
    }
    class HTMLIFrameElement extends HTMLElement {
      constructor() { super('IFRAME'); }
    }
    const documentElement = new HTMLElement('HTML');
    const ownerDocument = {
      nodeType: 9,
      nodeName: '#document',
      documentElement,
      activeElement: null,
      defaultView: globalThis,
      addEventListener() {},
      removeEventListener() {},
      createElement(tag: string) {
        const el = tag.toLowerCase() === 'iframe' ? new HTMLIFrameElement() : new HTMLElement(tag);
        el.ownerDocument = ownerDocument;
        return el;
      },
      createElementNS(_ns: string, tag: string) {
        return ownerDocument.createElement(tag);
      },
    };
    documentElement.ownerDocument = ownerDocument;
    vi.stubGlobal('Node', Node);
    vi.stubGlobal('HTMLElement', HTMLElement);
    vi.stubGlobal('HTMLIFrameElement', HTMLIFrameElement);
    vi.stubGlobal('document', ownerDocument);
    vi.stubGlobal('window', globalThis);
    vi.stubGlobal('IS_REACT_ACT_ENVIRONMENT', true);
  }
  const Ctor = g.HTMLElement as new (tag?: string) => {
    ownerDocument: unknown;
  };
  const container = new Ctor('DIV');
  container.ownerDocument = g.document;
  return { container };
}

async function mountHook<P extends object, R>(
  hook: (props: P) => R,
  initialProps: P,
): Promise<{
  getResult: () => R;
  rerender: (patch: Partial<P>) => Promise<void>;
  setPropsSync: (patch: Partial<P>) => void;
  unmount: () => Promise<void>;
}> {
  const { container } = ensureDomStub();
  let bag: { result: R; setProps: Dispatch<SetStateAction<P>> } | undefined;
  const root = createRoot(container as unknown as Element);
  roots.add(root);
  function Harness(): null {
    const [props, setProps] = useState(initialProps);
    bag = { result: hook(props), setProps };
    return null;
  }
  await act(async () => {
    root.render(createElement(Harness));
  });
  if (!bag) throw new Error('HookHarness did not mount');
  return {
    getResult: () => {
      if (!bag) throw new Error('HookHarness unmounted');
      return bag.result;
    },
    rerender: async (patch) => {
      await act(async () => {
        bag!.setProps((prev) => ({ ...prev, ...patch }));
      });
    },
    setPropsSync: (patch) => {
      flushSync(() => {
        bag!.setProps((prev) => ({ ...prev, ...patch }));
      });
    },
    unmount: async () => {
      if (!roots.has(root)) return;
      await act(async () => {
        root.unmount();
      });
      roots.delete(root);
    },
  };
}

function baseProps(overrides: Partial<Props> = {}): Props {
  return {
    activePageId: 'page-1',
    canSubmitPublish: true,
    copy,
    document,
    draftMeta: { revision: 12, savedAt: '2026-07-13T00:00:00.000Z' },
    locale: 'en',
    open: true,
    siteId: 'site-1',
    onDraftSaved: vi.fn(),
    onToast: vi.fn(),
    setPublishError: vi.fn(),
    setPublishedSlug: vi.fn(),
    setPublishState: vi.fn(),
    setSuite: vi.fn(),
    ...overrides,
  };
}

function installFetchQueue(): { fetchMock: ReturnType<typeof vi.fn<typeof fetch>>; queue: Gate[] } {
  const queue: Gate[] = [];
  const fetchMock = vi.fn<typeof fetch>((input, init) => new Promise<Response>((resolve, reject) => {
    queue.push({
      url: String(input),
      method: String(init?.method ?? 'GET'),
      body: typeof init?.body === 'string' ? init.body : undefined,
      resolve,
      reject,
    });
  }));
  vi.stubGlobal('fetch', fetchMock);
  gates = queue;
  return { fetchMock, queue };
}

function okDraft(revision: number, extra: { document?: BuilderCanvasDocument } = {}): Response {
  return new Response(JSON.stringify({
    draft: { revision, savedAt: '2026-07-13T00:00:00.000Z' } satisfies DraftMeta,
    ...extra,
  }), { status: 200, headers: { 'Content-Type': 'application/json' } });
}

function okPublish(slug: string): Response {
  return new Response(JSON.stringify({ ok: true, slug }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
}

function pendingJson(status = 200): {
  response: Response;
  resolve: (value: unknown) => void;
  reject: (reason: unknown) => void;
} {
  let resolve!: (value: unknown) => void;
  let reject!: (reason: unknown) => void;
  const promise = new Promise<unknown>((res, rej) => {
    resolve = res;
    reject = rej;
  });
  return {
    response: { ok: status >= 200 && status < 300, status, json: () => promise } as unknown as Response,
    resolve,
    reject,
  };
}

async function ticks(count = 8): Promise<void> {
  for (let i = 0; i < count; i += 1) await Promise.resolve();
}

async function begin(host: Host): Promise<{ job: Promise<void> }> {
  const job = track(host.getResult().handlePublish());
  await act(async () => {
    await ticks();
  });
  return { job };
}

// Resolve any recorded follow-up POST before asserting whether it should exist.
// Baseline stale handlers otherwise wait forever, hiding the zero-POST assertion.
async function finish(job: Promise<void>): Promise<void> {
  await ticks();
  for (const gate of gates) {
    if (isPublish(gate.url)) gate.resolve(okPublish('observed-baseline-followup'));
  }
  await job;
}

function isDraft(url: string): boolean {
  return url.includes('/api/builder/site/pages/') && url.includes('/draft?');
}

function isPublish(url: string): boolean {
  return url.includes('/api/builder/site/pages/') && url.includes('/publish?');
}

function expectAbandoned(props: Props): void {
  expect(props.setPublishState).not.toHaveBeenCalledWith('success');
  expect(props.setPublishState).not.toHaveBeenCalledWith('error');
  expect(props.setPublishedSlug).not.toHaveBeenCalled();
  expect(props.onToast).not.toHaveBeenCalled();
  expect(props.setSuite).not.toHaveBeenCalled();
}

beforeAll(() => {
  ensureDomStub();
});

afterEach(async () => {
  await act(async () => {
    for (const root of [...roots]) root.unmount();
    roots.clear();
  });
  for (const gate of gates) gate.reject(new Error('test cleanup'));
  gates = [];
  await Promise.allSettled([...jobs]);
  jobs.clear();
  vi.unstubAllGlobals();
});

describe('usePublishActions owner lifetime', () => {
  it('same-owner success PUT then metadata then POST then success with expected revision', async () => {
    const { queue } = installFetchQueue();
    const props = baseProps();
    const host = await mountHook(usePublishActions, props);
    const { job } = await begin(host);

    expect(queue).toHaveLength(1);
    expect(isDraft(queue[0].url)).toBe(true);
    expect(queue[0].method).toBe('PUT');
    expect(queue[0].url).toContain('/pages/page-1/draft?');
    expect(queue[0].url).toContain('locale=en');
    expect(queue[0].url).toContain('siteId=site-1');
    expect(JSON.parse(String(queue[0].body))).toEqual({
      siteId: 'site-1',
      expectedRevision: 12,
      document,
    });

    await act(async () => {
      queue[0].resolve(okDraft(13, { document }));
      await ticks();
    });

    expect(props.onDraftSaved).toHaveBeenCalledWith(
      { revision: 13, savedAt: '2026-07-13T00:00:00.000Z' },
      document,
    );
    expect(queue).toHaveLength(2);
    expect(isPublish(queue[1].url)).toBe(true);
    expect(queue[1].method).toBe('POST');
    expect(JSON.parse(String(queue[1].body))).toEqual({
      siteId: 'site-1',
      expectedDraftRevision: 13,
    });

    await act(async () => {
      queue[1].resolve(okPublish('home'));
      await finish(job);
    });

    expect(vi.mocked(props.setPublishState).mock.calls.map(([state]) => state)).toEqual([
      'publishing',
      'success',
    ]);
    expect(vi.mocked(props.setPublishError).mock.calls.map(([message]) => message)).toEqual([null]);
    expect(props.setPublishedSlug).toHaveBeenCalledWith(buildSitePagePath('en', 'home'));
    expect(props.onToast).toHaveBeenCalledWith(copy.toastPublishSuccess, 'success');
    expect(props.setSuite).not.toHaveBeenCalled();
  });

  it('does not fetch when initially closed', async () => {
    const fetchMock = vi.fn<typeof fetch>();
    vi.stubGlobal('fetch', fetchMock);
    const props = baseProps({ open: false });
    const host = await mountHook(usePublishActions, props);
    await act(async () => {
      await track(host.getResult().handlePublish());
    });
    expect(fetchMock).not.toHaveBeenCalled();
    expect(props.setPublishState).not.toHaveBeenCalled();
  });

  it('close-only while draft JSON body awaits skips metadata and POST', async () => {
    const { queue } = installFetchQueue();
    const props = baseProps();
    const host = await mountHook(usePublishActions, props);
    const { job } = await begin(host);
    const pending = pendingJson();
    await act(async () => {
      queue[0].resolve(pending.response);
    });
    await host.rerender({ open: false });
    await act(async () => {
      pending.resolve({
        draft: { revision: 13, savedAt: '2026-07-13T00:00:00.000Z' },
        document,
      });
      await finish(job);
    });
    expect(props.onDraftSaved).not.toHaveBeenCalled();
    expect(queue.some((item) => isPublish(item.url))).toBe(false);
    expectAbandoned(props);
  });

  it('close then reopen same owner does not complete the stale publish', async () => {
    const { queue } = installFetchQueue();
    const props = baseProps();
    const host = await mountHook(usePublishActions, props);
    const { job: stale } = await begin(host);
    await host.rerender({ open: false });
    await host.rerender({ open: true });
    await act(async () => {
      queue[0].resolve(okDraft(13, { document }));
      await finish(stale);
    });
    expect(props.onDraftSaved).not.toHaveBeenCalled();
    expect(queue.some((item) => isPublish(item.url))).toBe(false);
    expectAbandoned(props);

    const { job: next } = await begin(host);
    expect(queue).toHaveLength(2);
    expect(isDraft(queue[1].url)).toBe(true);
    queue[1].reject(new Error('stop-followup'));
    await act(async () => {
      await finish(next);
    });
  });

  it.each(STALE_CASES)(
    'changing $key while $stage awaits does not commit stale publish',
    async ({ patch, stage }) => {
      const { queue } = installFetchQueue();
      const props = baseProps();
      const host = await mountHook(usePublishActions, props);
      const { job } = await begin(host);
      expect(queue).toHaveLength(1);

      if (stage === 'draft-json') {
        const pending = pendingJson();
        await act(async () => {
          queue[0].resolve(pending.response);
        });
        await host.rerender(patch);
        await act(async () => {
          pending.resolve({
            draft: { revision: 13, savedAt: '2026-07-13T00:00:00.000Z' },
            document,
          });
          await finish(job);
        });
        expect(props.onDraftSaved).not.toHaveBeenCalled();
        expect(queue.some((item) => isPublish(item.url))).toBe(false);
        expectAbandoned(props);
        return;
      }

      await act(async () => {
        queue[0].resolve(okDraft(13, { document }));
        await ticks();
      });
      expect(queue).toHaveLength(2);
      expect(isPublish(queue[1].url)).toBe(true);
      expect(props.onDraftSaved).toHaveBeenCalledTimes(1);

      if (stage === 'publish-response') {
        await host.rerender(patch);
        await act(async () => {
          queue[1].resolve(okPublish('home'));
          await finish(job);
        });
      } else {
        const pending = pendingJson();
        await act(async () => {
          queue[1].resolve(pending.response);
        });
        await host.rerender(patch);
        await act(async () => {
          pending.resolve({ ok: true, slug: 'home' });
          await finish(job);
        });
      }

      expect(props.setPublishState).not.toHaveBeenCalledWith('success');
      expect(props.setPublishState).not.toHaveBeenCalledWith('error');
      expect(props.setPublishedSlug).not.toHaveBeenCalled();
      expect(props.onToast).not.toHaveBeenCalledWith(copy.toastPublishSuccess, 'success');
      expect(props.onToast).not.toHaveBeenCalledWith(copy.toastPublishNetworkError, 'error');
    },
  );

  it('unmount while a response is pending does not apply stale updates', async () => {
    const { queue } = installFetchQueue();
    const props = baseProps();
    const host = await mountHook(usePublishActions, props);
    const { job } = await begin(host);
    await host.unmount();
    await act(async () => {
      queue[0].resolve(okDraft(13, { document }));
      await finish(job);
    });
    expect(props.onDraftSaved).not.toHaveBeenCalled();
    expect(queue.some((item) => isPublish(item.url))).toBe(false);
    expectAbandoned(props);
  });

  it('stale reject is silent', async () => {
    const { queue } = installFetchQueue();
    const props = baseProps();
    const host = await mountHook(usePublishActions, props);
    const { job } = await begin(host);
    await host.rerender({ locale: 'ko' });
    await act(async () => {
      queue[0].reject(new Error('network down'));
      await finish(job);
    });
    expect(props.onToast).not.toHaveBeenCalled();
    expect(props.setPublishState).not.toHaveBeenCalledWith('error');
    expect(props.setPublishError).not.toHaveBeenCalledWith(copy.publishNetworkError);
  });

  it('old operation finally cannot release a newer pending guard (same-generation duplicate does not send)', async () => {
    const { fetchMock, queue } = installFetchQueue();
    const props = baseProps();
    const host = await mountHook(usePublishActions, props);
    const first = host.getResult().handlePublish;
    const job1 = track(first());
    const dup = track(first());
    await act(async () => {
      await ticks();
    });
    expect(queue).toHaveLength(1);

    await host.rerender({ siteId: 'site-2' });
    const { job: job2 } = await begin(host);
    expect(queue).toHaveLength(2);
    expect(queue[1].url).toContain('siteId=site-2');

    await act(async () => {
      queue[0].resolve(okDraft(99, { document }));
      await finish(job1);
      await finish(dup);
    });

    const callsAfterOldFinally = fetchMock.mock.calls.length;
    void track(host.getResult().handlePublish());
    await act(async () => {
      await ticks();
    });
    expect(fetchMock.mock.calls.length).toBe(callsAfterOldFinally);
    expect(queue).toHaveLength(2);

    queue[1].reject(new Error('stop-op2'));
    await act(async () => {
      await finish(job2);
    });
  });

  it('sandbox PUT success sets /p/sandbox', async () => {
    const { queue } = installFetchQueue();
    const props = baseProps({ activePageId: null });
    const host = await mountHook(usePublishActions, props);
    const { job } = await begin(host);
    expect(queue).toHaveLength(1);
    expect(queue[0].url).toContain('/api/builder/sandbox/draft?locale=en');
    expect(queue[0].method).toBe('PUT');
    await act(async () => {
      queue[0].resolve(new Response('{}', { status: 200 }));
      await finish(job);
    });
    expect(vi.mocked(props.setPublishState).mock.calls.map(([state]) => state)).toEqual([
      'publishing',
      'success',
    ]);
    expect(props.setPublishedSlug).toHaveBeenCalledWith('/p/sandbox');
    expect(props.onDraftSaved).not.toHaveBeenCalled();
    expect(queue.some((item) => isPublish(item.url))).toBe(false);
  });

  it('late stale sandbox PUT does not succeed', async () => {
    const { queue } = installFetchQueue();
    const props = baseProps({ activePageId: null });
    const host = await mountHook(usePublishActions, props);
    const { job } = await begin(host);
    await host.rerender({ locale: 'ko' });
    await act(async () => {
      queue[0].resolve(new Response('{}', { status: 200 }));
      await finish(job);
    });
    expect(props.setPublishedSlug).not.toHaveBeenCalled();
    expectAbandoned(props);
  });

  it('synchronous onDraftSaved owner invalidation prevents publish POST', async () => {
    const { queue } = installFetchQueue();
    const onDraftSaved = vi.fn(() => {
      host.setPropsSync({ siteId: 'site-other' });
    });
    const props = baseProps({ onDraftSaved });
    const host = await mountHook(usePublishActions, props);
    const { job } = await begin(host);
    await act(async () => {
      queue[0].resolve(okDraft(13, { document }));
      await finish(job);
    });
    expect(onDraftSaved).toHaveBeenCalled();
    expect(queue.some((item) => isPublish(item.url))).toBe(false);
    expect(props.setPublishState).not.toHaveBeenCalledWith('success');
  });

  it('final-only: synchronous invalidatePublish then retained handlePublish does not start a request', async () => {
    const fetchMock = vi.fn<typeof fetch>().mockResolvedValue(okDraft(13, { document }));
    vi.stubGlobal('fetch', fetchMock);
    const props = baseProps();
    const host = await mountHook(usePublishActions, props);
    const { handlePublish, invalidatePublish } = host.getResult();
    invalidatePublish();
    await act(async () => {
      await track(handlePublish());
    });
    expect(fetchMock).not.toHaveBeenCalled();
    expect(props.setPublishState).not.toHaveBeenCalled();
  });
  it('retained pre-close callback cannot write after same-owner reopen; current callback succeeds', async () => {
    const { fetchMock, queue } = installFetchQueue();
    const props = baseProps();
    const host = await mountHook(usePublishActions, props);
    const retained = host.getResult().handlePublish;
    await host.rerender({ open: false });
    await host.rerender({ open: true });
    await act(async () => {
      void track(retained());
      await ticks();
    });
    expect(fetchMock).not.toHaveBeenCalled();

    const { job } = await begin(host);
    expect(queue).toHaveLength(1);
    await act(async () => {
      queue[0].resolve(okDraft(13, { document }));
      await ticks();
    });
    expect(queue).toHaveLength(2);
    await act(async () => {
      queue[1].resolve(okPublish('current-session'));
      await finish(job);
    });
    expect(props.setPublishedSlug).toHaveBeenCalledWith(buildSitePagePath('en', 'current-session'));
    expect(props.onToast).toHaveBeenCalledWith(copy.toastPublishSuccess, 'success');
  });

  it('same-owner metadata and document rerender does not invalidate the pending session', async () => {
    const { queue } = installFetchQueue();
    const props = baseProps();
    const host = await mountHook(usePublishActions, props);
    const { job } = await begin(host);
    const pending = pendingJson();
    await act(async () => {
      queue[0].resolve(pending.response);
    });
    await host.rerender({
      draftMeta: { revision: 14, savedAt: '2026-07-13T00:01:00.000Z' },
      document: { ...document, updatedAt: '2026-07-13T00:01:00.000Z' },
    });
    await act(async () => {
      pending.resolve({ draft: { revision: 13, savedAt: 'saved-operation' }, document });
      await ticks();
    });
    expect(props.onDraftSaved).toHaveBeenCalledTimes(1);
    expect(queue).toHaveLength(2);
    expect(JSON.parse(String(queue[1].body))).toMatchObject({ expectedDraftRevision: 13 });
    await act(async () => {
      queue[1].resolve(okPublish('same-session'));
      await finish(job);
    });
    expect(props.setPublishedSlug).toHaveBeenCalledWith(buildSitePagePath('en', 'same-session'));
  });

});

import { createHash } from 'node:crypto';
import { StrictMode, act, createElement } from 'react';
import { createRoot } from 'react-dom/client';
import { describe, expect, it, vi } from 'vitest';
import type { BuilderCanvasDocument } from '@/lib/builder/canvas/types';
import { DEFAULT_THEME } from '@/lib/builder/site/types';
import {
  areDraftDocumentsEquivalentForStaleRevision,
  buildDraftRecoveryDownload,
  captureStableDraftRecoverySnapshot,
  createDraftConflictTransition,
  createDraftRecoverySnapshot,
  createDraftSaveQueue,
  createDraftSaveScopeController,
  createSerializedTaskQueue,
  getDraftConflictActionMessages,
  isDraftConflictBlocking,
  isDraftSaveScopeCurrent,
  persistLatestDraftForScope,
  readExactDraftConflict,
  resolveServerLatestDraftChoice,
  resolveMissingExpectedRevisionDraftSave,
  shouldAutoDecomposeStandardPageDraft,
  shouldKeepInitialDocumentForInitialDraftLoad,
  shouldOfferDecomposeCurrentPage,
  useSandboxSiteState,
} from '../useSandboxSiteState';

function deferred<T>() {
  let resolve!: (value: T | PromiseLike<T>) => void;
  const promise = new Promise<T>((resolvePromise) => {
    resolve = resolvePromise;
  });
  return { promise, resolve };
}

type SandboxSiteStateProps = Parameters<typeof useSandboxSiteState>[0];

function navigationDocument(
  id: string,
  locale: 'ko' | 'en' | 'zh-hant' = 'ko',
): BuilderCanvasDocument {
  return {
    version: 1,
    locale,
    updatedAt: `2026-07-13T00:00:${id}.000Z`,
    updatedBy: 'navigation-test',
    stageWidth: 1280,
    stageHeight: 900,
    nodes: [],
  } as BuilderCanvasDocument;
}

function installMinimalReactDom() {
  const anchor = {
    click: vi.fn(),
    download: '',
    href: '',
    rel: '',
    remove: vi.fn(),
    style: { display: '' },
  };
  const documentElement = { namespaceURI: 'http://www.w3.org/1999/xhtml' };
  const document = {
    activeElement: null,
    addEventListener: vi.fn(),
    body: { appendChild: vi.fn() },
    createElement: vi.fn(() => anchor),
    defaultView: globalThis,
    documentElement,
    nodeType: 9,
    removeEventListener: vi.fn(),
  };
  const container = {
    addEventListener: vi.fn(),
    appendChild: vi.fn(),
    namespaceURI: 'http://www.w3.org/1999/xhtml',
    nodeName: 'DIV',
    nodeType: 1,
    ownerDocument: document,
    removeChild: vi.fn(),
    removeEventListener: vi.fn(),
    tagName: 'DIV',
    textContent: '',
  };

  vi.stubGlobal('IS_REACT_ACT_ENVIRONMENT', true);
  vi.stubGlobal('window', globalThis);
  vi.stubGlobal('document', document);
  vi.stubGlobal('HTMLIFrameElement', function HTMLIFrameElement() {});
  vi.stubGlobal('HTMLElement', function HTMLElement() {});
  vi.stubGlobal('Node', function Node() {});

  return { anchor, container };
}

async function renderSandboxSiteState(
  initialProps: SandboxSiteStateProps,
  options: { strict?: boolean } = {},
) {
  const { container } = installMinimalReactDom();
  const root = createRoot(container as unknown as Element);
  let result: ReturnType<typeof useSandboxSiteState> | null = null;

  function HookHarness({ hookProps }: { hookProps: SandboxSiteStateProps }) {
    result = useSandboxSiteState(hookProps);
    return null;
  }

  const settle = async () => {
    await Promise.resolve();
    await Promise.resolve();
  };
  const render = async (hookProps: SandboxSiteStateProps) => {
    await act(async () => {
      const hook = createElement(HookHarness, { hookProps });
      root.render(options.strict ? createElement(StrictMode, null, hook) : hook);
      await settle();
    });
  };

  await render(initialProps);
  return {
    get result() {
      if (!result) throw new Error('sandbox_site_state_hook_not_rendered');
      return result;
    },
    async flush() {
      await act(async () => {
        await settle();
        await new Promise<void>((resolve) => setImmediate(resolve));
        await settle();
      });
    },
    rerender: render,
    async unmount() {
      await act(async () => root.unmount());
      vi.unstubAllGlobals();
    },
  };
}

describe('useSandboxSiteState external prop transitions', () => {
  it('persists dirty page A before applying prop-driven page B', async () => {
    const pageA = navigationDocument('01');
    const dirtyPageA = { ...pageA, updatedAt: '2026-07-13T00:01:01.000Z' };
    const pageB = navigationDocument('02');
    const saveResponse = deferred<void>();
    const events: string[] = [];
    const fetchMock = vi.fn(async (input: RequestInfo | URL, init?: RequestInit) => {
      const url = String(input);
      if (url.includes('/api/builder/blog/posts?')) {
        return Response.json({ ok: true, total: 0, posts: [] });
      }
      if (init?.method === 'PUT') {
        events.push('save:A');
        await saveResponse.promise;
        return Response.json({
          draft: { revision: 2, savedAt: dirtyPageA.updatedAt },
          document: dirtyPageA,
        });
      }
      return Response.json({
        draft: { revision: 1, savedAt: pageA.updatedAt },
        document: pageA,
      });
    });
    vi.stubGlobal('fetch', fetchMock);
    const replaceDocument = vi.fn((document: BuilderCanvasDocument) => {
      events.push(document === pageB ? 'replace:B' : 'replace:A');
    });
    const baseProps: SandboxSiteStateProps = {
      initialDocument: pageA,
      initialDraftMeta: { revision: 1, savedAt: pageA.updatedAt },
      locale: 'ko',
      siteId: 'navigation-test-site',
      initialPageId: 'page-a',
      currentSlug: 'page-a',
      canvasDocument: pageA,
      hasLocalHistory: false,
      mutationBaseDocument: null,
      replaceDocument,
      setDraftSaveState: vi.fn(),
      pushToast: vi.fn(),
    };
    const renderer = await renderSandboxSiteState(baseProps);
    replaceDocument.mockClear();
    events.length = 0;

    await renderer.rerender({
      ...baseProps,
      canvasDocument: dirtyPageA,
      hasLocalHistory: true,
    });
    await renderer.rerender({
      ...baseProps,
      initialDocument: pageB,
      initialDraftMeta: { revision: 1, savedAt: pageB.updatedAt },
      initialPageId: 'page-b',
      currentSlug: 'page-b',
      canvasDocument: dirtyPageA,
      hasLocalHistory: true,
    });

    expect(events).toEqual(['save:A']);
    const putCall = fetchMock.mock.calls.find(([, init]) => init?.method === 'PUT');
    expect(JSON.parse(String(putCall?.[1]?.body))).toMatchObject({ document: dirtyPageA });

    saveResponse.resolve();
    await renderer.flush();

    expect(events).toEqual(['save:A', 'replace:B']);
    await renderer.unmount();
  });

  it('keeps page A after a save failure and lets a newer prop target supersede B', async () => {
    const pageA = navigationDocument('03');
    const dirtyPageA = { ...pageA, updatedAt: '2026-07-13T00:03:01.000Z' };
    const pageB = navigationDocument('04');
    const pageC = navigationDocument('05');
    let putAttempts = 0;
    const fetchMock = vi.fn(async (input: RequestInfo | URL, init?: RequestInit) => {
      const url = String(input);
      if (url.includes('/api/builder/blog/posts?')) {
        return Response.json({ ok: true, total: 0, posts: [] });
      }
      if (init?.method === 'PUT') {
        putAttempts += 1;
        if (putAttempts === 1) throw new Error('network unavailable');
        return Response.json({
          draft: { revision: 2, savedAt: dirtyPageA.updatedAt },
          document: dirtyPageA,
        });
      }
      return Response.json({
        draft: { revision: 1, savedAt: pageA.updatedAt },
        document: pageA,
      });
    });
    vi.stubGlobal('fetch', fetchMock);
    const replacements: BuilderCanvasDocument[] = [];
    const replaceDocument = vi.fn((document: BuilderCanvasDocument) => replacements.push(document));
    const pushToast = vi.fn();
    const baseProps: SandboxSiteStateProps = {
      initialDocument: pageA,
      initialDraftMeta: { revision: 1, savedAt: pageA.updatedAt },
      locale: 'ko',
      siteId: 'navigation-test-site',
      initialPageId: 'page-a',
      currentSlug: 'page-a',
      canvasDocument: pageA,
      hasLocalHistory: false,
      mutationBaseDocument: null,
      replaceDocument,
      setDraftSaveState: vi.fn(),
      pushToast,
    };
    const renderer = await renderSandboxSiteState(baseProps);
    replacements.length = 0;

    await renderer.rerender({ ...baseProps, canvasDocument: dirtyPageA, hasLocalHistory: true });
    await renderer.rerender({
      ...baseProps,
      initialDocument: pageB,
      initialDraftMeta: { revision: 1, savedAt: pageB.updatedAt },
      initialPageId: 'page-b',
      currentSlug: 'page-b',
      canvasDocument: dirtyPageA,
      hasLocalHistory: true,
    });
    await renderer.flush();

    expect(renderer.result.activePageId).toBe('page-a');
    expect(replacements).not.toContain(pageB);
    expect(pushToast).toHaveBeenCalledWith(
      '네트워크 오류, 다시 시도해주세요',
      'error',
      expect.objectContaining({
        actionLabel: '다시 시도',
        onAction: expect.any(Function),
        ttlMs: 8000,
      }),
    );

    await renderer.rerender({
      ...baseProps,
      initialDocument: pageC,
      initialDraftMeta: { revision: 1, savedAt: pageC.updatedAt },
      initialPageId: 'page-c',
      currentSlug: 'page-c',
      canvasDocument: dirtyPageA,
      hasLocalHistory: true,
    });
    await renderer.flush();

    expect(putAttempts).toBe(2);
    expect(replacements).not.toContain(pageB);
    expect(replacements.filter((document) => document.updatedAt === pageC.updatedAt)).toHaveLength(1);
    expect(renderer.result.activePageId).toBe('page-c');
    await renderer.unmount();
  });

  it('retries the same pending prop target through the transient network-error action', async () => {
    const pageA = navigationDocument('network-a');
    const dirtyPageA = { ...pageA, updatedAt: '2026-07-13T00:03:02.000Z' };
    const pageB = navigationDocument('network-b');
    const replacements: BuilderCanvasDocument[] = [];
    const pushToast = vi.fn();
    let putAttempts = 0;
    const fetchMock = vi.fn(async (input: RequestInfo | URL, init?: RequestInit) => {
      const url = String(input);
      if (url.includes('/api/builder/blog/posts?')) {
        return Response.json({ ok: true, total: 0, posts: [] });
      }
      if (init?.method === 'PUT') {
        putAttempts += 1;
        if (putAttempts === 1) throw new Error('temporary disconnect');
        return Response.json({
          draft: { revision: 2, savedAt: dirtyPageA.updatedAt },
          document: dirtyPageA,
        });
      }
      return Response.json({
        draft: { revision: 1, savedAt: pageA.updatedAt },
        document: pageA,
      });
    });
    vi.stubGlobal('fetch', fetchMock);
    const baseProps: SandboxSiteStateProps = {
      initialDocument: pageA,
      initialDraftMeta: { revision: 1, savedAt: pageA.updatedAt },
      locale: 'ko',
      siteId: 'navigation-test-site',
      initialPageId: 'page-a',
      currentSlug: 'page-a',
      canvasDocument: pageA,
      hasLocalHistory: false,
      mutationBaseDocument: null,
      replaceDocument: vi.fn((document: BuilderCanvasDocument) => replacements.push(document)),
      setDraftSaveState: vi.fn(),
      pushToast,
    };
    const renderer = await renderSandboxSiteState(baseProps);
    replacements.length = 0;

    await renderer.rerender({ ...baseProps, canvasDocument: dirtyPageA, hasLocalHistory: true });
    await renderer.rerender({
      ...baseProps,
      initialDocument: pageB,
      initialDraftMeta: { revision: 1, savedAt: pageB.updatedAt },
      initialPageId: 'page-b',
      currentSlug: 'page-b',
      canvasDocument: dirtyPageA,
      hasLocalHistory: true,
    });
    await renderer.flush();

    expect(renderer.result.activePageId).toBe('page-a');
    expect(replacements).not.toContain(pageB);
    const retryOptions = pushToast.mock.calls.find(([message]) => (
      message === '네트워크 오류, 다시 시도해주세요'
    ))?.[2];
    expect(retryOptions?.actionLabel).toBe('다시 시도');
    expect(retryOptions?.onAction).toBeTypeOf('function');

    await act(async () => retryOptions?.onAction?.());
    await renderer.flush();

    expect(putAttempts).toBe(2);
    expect(replacements.filter((document) => document === pageB)).toHaveLength(1);
    expect(renderer.result.activePageId).toBe('page-b');
    await renderer.unmount();
  });

  it('rolls back the transitioned scope and surfaces the network-error toast when replaceDocument throws', async () => {
    const pageA = navigationDocument('replace-throw-a');
    const dirtyPageA = { ...pageA, updatedAt: '2026-07-13T00:31:01.000Z' };
    const pageB = navigationDocument('replace-throw-b');
    const replacements: BuilderCanvasDocument[] = [];
    const setDraftSaveState = vi.fn();
    const pushToast = vi.fn();
    const fetchMock = vi.fn(async (input: RequestInfo | URL, init?: RequestInit) => {
      const url = String(input);
      if (url.includes('/api/builder/blog/posts?')) {
        return Response.json({ ok: true, total: 0, posts: [] });
      }
      if (init?.method === 'PUT') {
        return Response.json({
          draft: { revision: 2, savedAt: dirtyPageA.updatedAt },
          document: dirtyPageA,
        });
      }
      return Response.json({
        draft: { revision: 1, savedAt: pageA.updatedAt },
        document: pageA,
      });
    });
    vi.stubGlobal('fetch', fetchMock);
    const replaceDocument = vi.fn((document: BuilderCanvasDocument) => {
      replacements.push(document);
      if (document === pageB) throw new Error('replaceDocument threw');
    });
    const baseProps: SandboxSiteStateProps = {
      initialDocument: pageA,
      initialDraftMeta: { revision: 1, savedAt: pageA.updatedAt },
      locale: 'ko',
      siteId: 'navigation-test-site',
      initialPageId: 'page-a',
      currentSlug: 'page-a',
      canvasDocument: pageA,
      hasLocalHistory: false,
      mutationBaseDocument: null,
      replaceDocument,
      setDraftSaveState,
      pushToast,
    };
    const renderer = await renderSandboxSiteState(baseProps);
    replacements.length = 0;
    setDraftSaveState.mockClear();
    pushToast.mockClear();

    await renderer.rerender({ ...baseProps, canvasDocument: dirtyPageA, hasLocalHistory: true });
    await renderer.rerender({
      ...baseProps,
      initialDocument: pageB,
      initialDraftMeta: { revision: 1, savedAt: pageB.updatedAt },
      initialPageId: 'page-b',
      currentSlug: 'page-b',
      canvasDocument: dirtyPageA,
      hasLocalHistory: true,
    });
    await renderer.flush();

    expect(replacements).toContain(pageB);
    expect(renderer.result.activePageId).toBe('page-a');
    expect(renderer.result.activeCanvasLocale).toBe('ko');
    expect(setDraftSaveState).toHaveBeenCalledWith('error');
    expect(pushToast).toHaveBeenCalledWith(
      '네트워크 오류, 다시 시도해주세요',
      'error',
      expect.objectContaining({
        actionLabel: '다시 시도',
        onAction: expect.any(Function),
        ttlMs: 8000,
      }),
    );
    await renderer.unmount();
  });

  it('drops page B before commit with no rollback feedback when a newer external intent supersedes it after its save resolves', async () => {
    const pageA = navigationDocument('replace-supersede-a');
    const dirtyPageA = { ...pageA, updatedAt: '2026-07-13T00:32:01.000Z' };
    const pageB = navigationDocument('replace-supersede-b');
    const pageC = navigationDocument('replace-supersede-c');
    const saveResponse = deferred<void>();
    const replacements: BuilderCanvasDocument[] = [];
    const setDraftSaveState = vi.fn();
    const pushToast = vi.fn();
    let putAttempts = 0;
    const putBodies: Array<{ document: BuilderCanvasDocument; expectedRevision?: number }> = [];
    const fetchMock = vi.fn(async (input: RequestInfo | URL, init?: RequestInit) => {
      const url = String(input);
      if (url.includes('/api/builder/blog/posts?')) {
        return Response.json({ ok: true, total: 0, posts: [] });
      }
      if (init?.method === 'PUT') {
        putAttempts += 1;
        putBodies.push(
          JSON.parse(String(init.body)) as { document: BuilderCanvasDocument; expectedRevision?: number },
        );
        await saveResponse.promise;
        return Response.json({
          draft: { revision: 2, savedAt: dirtyPageA.updatedAt },
          document: dirtyPageA,
        });
      }
      return Response.json({
        draft: { revision: 1, savedAt: pageA.updatedAt },
        document: pageA,
      });
    });
    vi.stubGlobal('fetch', fetchMock);
    const replaceDocument = vi.fn((document: BuilderCanvasDocument) => {
      replacements.push(document);
    });
    const baseProps: SandboxSiteStateProps = {
      initialDocument: pageA,
      initialDraftMeta: { revision: 1, savedAt: pageA.updatedAt },
      locale: 'ko',
      siteId: 'navigation-test-site',
      initialPageId: 'page-a',
      currentSlug: 'page-a',
      canvasDocument: pageA,
      hasLocalHistory: false,
      mutationBaseDocument: null,
      replaceDocument,
      setDraftSaveState,
      pushToast,
    };
    const renderer = await renderSandboxSiteState(baseProps);
    replacements.length = 0;
    setDraftSaveState.mockClear();
    pushToast.mockClear();

    await renderer.rerender({ ...baseProps, canvasDocument: dirtyPageA, hasLocalHistory: true });
    await renderer.rerender({
      ...baseProps,
      initialDocument: pageB,
      initialDraftMeta: { revision: 1, savedAt: pageB.updatedAt },
      initialPageId: 'page-b',
      currentSlug: 'page-b',
      canvasDocument: dirtyPageA,
      hasLocalHistory: true,
    });
    await renderer.rerender({
      ...baseProps,
      initialDocument: pageC,
      initialDraftMeta: { revision: 1, savedAt: pageC.updatedAt },
      initialPageId: 'page-c',
      currentSlug: 'page-c',
      canvasDocument: dirtyPageA,
      hasLocalHistory: true,
    });

    saveResponse.resolve();
    await renderer.flush();

    expect(putAttempts).toBe(1);
    expect(putBodies).toHaveLength(1);
    expect(putBodies[0]).toMatchObject({ document: dirtyPageA, expectedRevision: 1 });
    expect(replacements).not.toContain(pageB);
    expect(replacements.filter((document) => document === pageC)).toHaveLength(1);
    expect(setDraftSaveState).not.toHaveBeenCalledWith('error');
    expect(pushToast).not.toHaveBeenCalledWith(
      '네트워크 오류, 다시 시도해주세요',
      'error',
      expect.anything(),
    );
    expect(renderer.result.activePageId).toBe('page-c');
    await renderer.unmount();
  });

  it('suppresses rollback feedback when a newer external intent supersedes a stale persist failure catch', async () => {
    const pageA = navigationDocument('persist-supersede-a');
    const dirtyPageA = { ...pageA, updatedAt: '2026-07-13T00:40:01.000Z' };
    const pageB = navigationDocument('persist-supersede-b');
    const pageC = navigationDocument('persist-supersede-c');
    const saveStarted = deferred<void>();
    const saveResponse = deferred<void>();
    const persistenceErrors: unknown[] = [];
    let putAttempts = 0;
    const replacements: BuilderCanvasDocument[] = [];
    const setDraftSaveState = vi.fn();
    const pushToast = vi.fn();
    const fetchMock = vi.fn(async (input: RequestInfo | URL, init?: RequestInit) => {
      const url = String(input);
      if (url.includes('/api/builder/blog/posts?')) {
        return Response.json({ ok: true, total: 0, posts: [] });
      }
      if (init?.method === 'PUT') {
        putAttempts += 1;
        if (putAttempts === 1) {
          saveStarted.resolve();
          await saveResponse.promise;
          const error = new Error('persist B network unavailable');
          persistenceErrors.push(error);
          throw error;
        }
        return Response.json({
          draft: { revision: 2, savedAt: dirtyPageA.updatedAt },
          document: dirtyPageA,
        });
      }
      return Response.json({
        draft: { revision: 1, savedAt: pageA.updatedAt },
        document: pageA,
      });
    });
    vi.stubGlobal('fetch', fetchMock);
    const baseProps: SandboxSiteStateProps = {
      initialDocument: pageA,
      initialDraftMeta: { revision: 1, savedAt: pageA.updatedAt },
      locale: 'ko',
      siteId: 'navigation-test-site',
      initialPageId: 'page-a',
      currentSlug: 'page-a',
      canvasDocument: pageA,
      hasLocalHistory: false,
      mutationBaseDocument: null,
      replaceDocument: vi.fn((document: BuilderCanvasDocument) => replacements.push(document)),
      setDraftSaveState,
      pushToast,
    };
    const renderer = await renderSandboxSiteState(baseProps);
    replacements.length = 0;
    setDraftSaveState.mockClear();
    pushToast.mockClear();

    await renderer.rerender({ ...baseProps, canvasDocument: dirtyPageA, hasLocalHistory: true });
    await renderer.rerender({
      ...baseProps,
      initialDocument: pageB,
      initialDraftMeta: { revision: 1, savedAt: pageB.updatedAt },
      initialPageId: 'page-b',
      currentSlug: 'page-b',
      canvasDocument: dirtyPageA,
      hasLocalHistory: true,
    });

    await saveStarted.promise;

    await renderer.rerender({
      ...baseProps,
      initialDocument: pageC,
      initialDraftMeta: { revision: 1, savedAt: pageC.updatedAt },
      initialPageId: 'page-c',
      currentSlug: 'page-c',
      canvasDocument: dirtyPageA,
      hasLocalHistory: true,
    });

    expect(putAttempts).toBe(1);

    saveResponse.resolve();
    await renderer.flush();

    expect(persistenceErrors).toHaveLength(1);
    expect(replacements).not.toContain(pageB);
    expect(setDraftSaveState).not.toHaveBeenCalledWith('error');
    expect(pushToast).not.toHaveBeenCalledWith(
      '네트워크 오류, 다시 시도해주세요',
      'error',
      expect.anything(),
    );
    expect(replacements.filter((document) => document === pageC)).toHaveLength(1);
    expect(putAttempts).toBe(2);
    expect(renderer.result.activePageId).toBe('page-c');
    await renderer.unmount();
  });

  it('replays the latest pending prop target exactly once after a conflict clears', async () => {
    const pageA = navigationDocument('06');
    const dirtyPageA = { ...pageA, updatedAt: '2026-07-13T00:06:01.000Z' };
    const serverPageA = { ...pageA, updatedAt: '2026-07-13T00:06:02.000Z' };
    const pageB = navigationDocument('07');
    const pageC = navigationDocument('13');
    let conflictCreated = false;
    const fetchMock = vi.fn(async (input: RequestInfo | URL, init?: RequestInit) => {
      const url = String(input);
      if (url.includes('/api/builder/blog/posts?')) {
        return Response.json({ ok: true, total: 0, posts: [] });
      }
      if (init?.method === 'PUT') {
        conflictCreated = true;
        return Response.json({
          errorCode: 'draft_conflict',
          current: { revision: 2, savedAt: serverPageA.updatedAt },
        }, { status: 409 });
      }
      return Response.json({
        draft: {
          revision: conflictCreated ? 2 : 1,
          savedAt: conflictCreated ? serverPageA.updatedAt : pageA.updatedAt,
        },
        document: conflictCreated ? serverPageA : pageA,
      });
    });
    vi.stubGlobal('fetch', fetchMock);
    const replacements: BuilderCanvasDocument[] = [];
    const baseProps: SandboxSiteStateProps = {
      initialDocument: pageA,
      initialDraftMeta: { revision: 1, savedAt: pageA.updatedAt },
      locale: 'ko',
      siteId: 'navigation-test-site',
      initialPageId: 'page-a',
      currentSlug: 'page-a',
      canvasDocument: pageA,
      hasLocalHistory: false,
      mutationBaseDocument: null,
      replaceDocument: vi.fn((document: BuilderCanvasDocument) => replacements.push(document)),
      setDraftSaveState: vi.fn(),
      pushToast: vi.fn(),
    };
    const renderer = await renderSandboxSiteState(baseProps);
    replacements.length = 0;

    await renderer.rerender({ ...baseProps, canvasDocument: dirtyPageA, hasLocalHistory: true });
    await renderer.rerender({
      ...baseProps,
      initialDocument: pageB,
      initialDraftMeta: { revision: 1, savedAt: pageB.updatedAt },
      initialPageId: 'page-b',
      currentSlug: 'page-b',
      canvasDocument: dirtyPageA,
      hasLocalHistory: true,
    });
    await renderer.flush();

    expect(renderer.result.draftConflict?.pageId).toBe('page-a');
    expect(renderer.result.activePageId).toBe('page-a');
    expect(replacements).not.toContain(pageB);

    await renderer.rerender({
      ...baseProps,
      initialDocument: pageC,
      initialDraftMeta: { revision: 1, savedAt: pageC.updatedAt },
      initialPageId: 'page-c',
      currentSlug: 'page-c',
      canvasDocument: dirtyPageA,
      hasLocalHistory: true,
    });
    expect(renderer.result.draftConflict?.pageId).toBe('page-a');
    expect(replacements).not.toContain(pageB);
    expect(replacements).not.toContain(pageC);

    await act(async () => {
      await expect(renderer.result.handleUseServerDraftAfterConflict()).resolves.toBe(true);
    });
    await renderer.flush();

    expect(renderer.result.draftConflict).toBeNull();
    expect(renderer.result.activePageId).toBe('page-c');
    expect(replacements.filter((document) => document.updatedAt === serverPageA.updatedAt)).toHaveLength(1);
    expect(replacements).not.toContain(pageB);
    expect(replacements.filter((document) => document === pageC)).toHaveLength(1);
    expect(fetchMock.mock.calls.filter(([, init]) => init?.method === 'PUT')).toHaveLength(1);
    await renderer.unmount();
  });

  it('drops superseded page B when prop page C arrives before the page A save completes', async () => {
    const pageA = navigationDocument('08');
    const dirtyPageA = { ...pageA, updatedAt: '2026-07-13T00:08:01.000Z' };
    const pageB = navigationDocument('09');
    const pageC = navigationDocument('10');
    const saveResponse = deferred<void>();
    const replacements: BuilderCanvasDocument[] = [];
    const fetchMock = vi.fn(async (input: RequestInfo | URL, init?: RequestInit) => {
      const url = String(input);
      if (url.includes('/api/builder/blog/posts?')) {
        return Response.json({ ok: true, total: 0, posts: [] });
      }
      if (init?.method === 'PUT') {
        await saveResponse.promise;
        return Response.json({
          draft: { revision: 2, savedAt: dirtyPageA.updatedAt },
          document: dirtyPageA,
        });
      }
      return Response.json({
        draft: { revision: 1, savedAt: pageA.updatedAt },
        document: pageA,
      });
    });
    vi.stubGlobal('fetch', fetchMock);
    const baseProps: SandboxSiteStateProps = {
      initialDocument: pageA,
      initialDraftMeta: { revision: 1, savedAt: pageA.updatedAt },
      locale: 'ko',
      siteId: 'navigation-test-site',
      initialPageId: 'page-a',
      currentSlug: 'page-a',
      canvasDocument: pageA,
      hasLocalHistory: false,
      mutationBaseDocument: null,
      replaceDocument: vi.fn((document: BuilderCanvasDocument) => replacements.push(document)),
      setDraftSaveState: vi.fn(),
      pushToast: vi.fn(),
    };
    const renderer = await renderSandboxSiteState(baseProps);
    replacements.length = 0;

    await renderer.rerender({ ...baseProps, canvasDocument: dirtyPageA, hasLocalHistory: true });
    await renderer.rerender({
      ...baseProps,
      initialDocument: pageB,
      initialPageId: 'page-b',
      currentSlug: 'page-b',
      canvasDocument: dirtyPageA,
      hasLocalHistory: true,
    });
    await renderer.rerender({
      ...baseProps,
      initialDocument: pageC,
      initialPageId: 'page-c',
      currentSlug: 'page-c',
      canvasDocument: dirtyPageA,
      hasLocalHistory: true,
    });
    expect(replacements).not.toContain(pageB);
    expect(replacements).not.toContain(pageC);

    saveResponse.resolve();
    await renderer.flush();

    expect(replacements).not.toContain(pageB);
    expect(replacements.filter((document) => document === pageC)).toHaveLength(1);
    expect(renderer.result.activePageId).toBe('page-c');
    expect(fetchMock.mock.calls.filter(([, init]) => init?.method === 'PUT')).toHaveLength(1);
    await renderer.unmount();
  });

  it('reacts to a locale-only identity transition after saving in the old locale scope', async () => {
    const koreanPage = navigationDocument('11', 'ko');
    const dirtyKoreanPage = { ...koreanPage, updatedAt: '2026-07-13T00:11:01.000Z' };
    const englishPage = navigationDocument('12', 'en');
    const replacements: BuilderCanvasDocument[] = [];
    const fetchMock = vi.fn(async (input: RequestInfo | URL, init?: RequestInit) => {
      const url = String(input);
      if (url.includes('/api/builder/blog/posts?')) {
        return Response.json({ ok: true, total: 0, posts: [] });
      }
      if (init?.method === 'PUT') {
        return Response.json({
          draft: { revision: 2, savedAt: dirtyKoreanPage.updatedAt },
          document: dirtyKoreanPage,
        });
      }
      return Response.json({
        draft: { revision: 1, savedAt: koreanPage.updatedAt },
        document: koreanPage,
      });
    });
    vi.stubGlobal('fetch', fetchMock);
    const baseProps: SandboxSiteStateProps = {
      initialDocument: koreanPage,
      initialDraftMeta: { revision: 1, savedAt: koreanPage.updatedAt },
      locale: 'ko',
      siteId: 'navigation-test-site',
      initialPageId: 'page-shared',
      currentSlug: 'shared',
      canvasDocument: koreanPage,
      hasLocalHistory: false,
      mutationBaseDocument: null,
      replaceDocument: vi.fn((document: BuilderCanvasDocument) => replacements.push(document)),
      setDraftSaveState: vi.fn(),
      pushToast: vi.fn(),
    };
    const renderer = await renderSandboxSiteState(baseProps);
    replacements.length = 0;

    await renderer.rerender({ ...baseProps, canvasDocument: dirtyKoreanPage, hasLocalHistory: true });
    await renderer.rerender({
      ...baseProps,
      initialDocument: englishPage,
      initialDraftMeta: { revision: 1, savedAt: englishPage.updatedAt },
      locale: 'en',
      canvasDocument: dirtyKoreanPage,
      hasLocalHistory: true,
    });
    await renderer.flush();

    const putUrl = String(fetchMock.mock.calls.find(([, init]) => init?.method === 'PUT')?.[0]);
    const blogUrls = fetchMock.mock.calls
      .map(([input]) => String(input))
      .filter((url) => url.includes('/api/builder/blog/posts?'));
    expect(putUrl).toContain('locale=ko');
    expect(blogUrls.some((url) => url.includes('locale=en'))).toBe(true);
    expect(replacements.filter((document) => document === englishPage)).toHaveLength(1);
    expect(renderer.result.activePageId).toBe('page-shared');
    expect(renderer.result.activeCanvasLocale).toBe('en');
    await renderer.unmount();
  });

  it('keeps manual page and locale targets hidden until each draft load succeeds', async () => {
    const pageA = navigationDocument('14', 'ko');
    const pageB = navigationDocument('15', 'ko');
    const pageEn = navigationDocument('16', 'en');
    const koreanPages = [
      { pageId: 'page-a', slug: 'page-a' },
      { pageId: 'page-b', slug: 'page-b' },
    ];
    const englishPages = [{ pageId: 'page-en', slug: 'page-en' }];
    const koreanNavigation = [{
      id: 'nav-ko',
      pageId: 'page-b',
      href: '/ko/page-b',
      label: { ko: '한국어', 'zh-hant': '韓文', en: 'Korean' },
    }];
    const englishNavigation = [{
      id: 'nav-en',
      pageId: 'page-en',
      href: '/en/page-en',
      label: { ko: '영어', 'zh-hant': '英文', en: 'English' },
    }];
    const koreanSettings = { firmName: '한국어 사이트' };
    const englishSettings = { firmName: 'English site' };
    const koreanTheme = DEFAULT_THEME;
    const englishTheme = {
      ...DEFAULT_THEME,
      colors: { ...DEFAULT_THEME.colors, primary: '#123456' },
    };
    const pageBLoad = deferred<void>();
    const pageEnLoad = deferred<void>();
    const fetchMock = vi.fn(async (input: RequestInfo | URL) => {
      const url = String(input);
      if (url.includes('/api/builder/blog/posts?')) {
        return Response.json({ ok: true, total: 0, posts: [] });
      }
      if (url.includes('/api/builder/site/pages?')) {
        return Response.json({ pages: englishPages });
      }
      if (url.includes('/api/builder/site/navigation?')) {
        return Response.json({ navigation: englishNavigation });
      }
      if (url.includes('/api/builder/site/settings?')) {
        return Response.json({ settings: englishSettings, theme: englishTheme });
      }
      if (url.includes('/page-b/draft?')) {
        await pageBLoad.promise;
        return Response.json({
          draft: { revision: 1, savedAt: pageB.updatedAt },
          document: pageB,
        });
      }
      if (url.includes('/page-en/draft?')) {
        await pageEnLoad.promise;
        return Response.json({
          draft: { revision: 1, savedAt: pageEn.updatedAt },
          document: pageEn,
        });
      }
      return Response.json({
        draft: { revision: 1, savedAt: pageA.updatedAt },
        document: pageA,
      });
    });
    vi.stubGlobal('fetch', fetchMock);
    const replacements: BuilderCanvasDocument[] = [];
    const baseProps: SandboxSiteStateProps = {
      initialDocument: pageA,
      initialDraftMeta: { revision: 1, savedAt: pageA.updatedAt },
      locale: 'ko',
      siteId: 'navigation-test-site',
      initialPageId: 'page-a',
      currentSlug: 'page-a',
      canvasDocument: pageA,
      hasLocalHistory: false,
      mutationBaseDocument: null,
      navItems: koreanNavigation,
      replaceDocument: vi.fn((document: BuilderCanvasDocument) => replacements.push(document)),
      setDraftSaveState: vi.fn(),
      sitePages: koreanPages,
      siteSettings: koreanSettings,
      siteTheme: koreanTheme,
      pushToast: vi.fn(),
    };
    const renderer = await renderSandboxSiteState(baseProps);
    replacements.length = 0;

    let pageNavigation!: Promise<boolean>;
    await act(async () => {
      pageNavigation = renderer.result.handleSelectPage('page-b', 'page-b');
      await Promise.resolve();
    });
    expect(renderer.result.activePageId).toBe('page-a');
    expect(renderer.result.currentSlugState).toBe('page-a');
    expect(replacements).not.toContain(pageB);

    pageBLoad.resolve();
    await act(async () => {
      await expect(pageNavigation).resolves.toBe(true);
    });
    await renderer.flush();
    expect(renderer.result.activePageId).toBe('page-b');
    expect(renderer.result.currentSlugState).toBe('page-b');

    await renderer.rerender({
      ...baseProps,
      canvasDocument: pageB,
      mutationBaseDocument: pageB,
    });
    expect(renderer.result.activePageId).toBe('page-b');
    expect(renderer.result.currentSlugState).toBe('page-b');
    expect(renderer.result.activeCanvasLocale).toBe('ko');

    await renderer.rerender({
      ...baseProps,
      canvasDocument: pageB,
      mutationBaseDocument: null,
    });

    let localeNavigation!: Promise<void>;
    await act(async () => {
      localeNavigation = renderer.result.handleLocaleChange('en', 'page-en');
      await Promise.resolve();
    });
    expect(renderer.result.activePageId).toBe('page-b');
    expect(renderer.result.activeCanvasLocale).toBe('ko');
    expect(renderer.result.navItemsState).toEqual(koreanNavigation);
    expect(renderer.result.sitePagesState).toEqual(koreanPages);
    expect(renderer.result.siteSettingsState).toMatchObject(koreanSettings);
    expect(renderer.result.siteThemeState).toEqual(koreanTheme);
    expect(replacements).not.toContain(pageEn);

    pageEnLoad.resolve();
    await act(async () => {
      await localeNavigation;
    });
    await renderer.flush();
    expect(renderer.result.activePageId).toBe('page-en');
    expect(renderer.result.activeCanvasLocale).toBe('en');
    expect(renderer.result.navItemsState).toEqual(englishNavigation);
    expect(renderer.result.sitePagesState).toEqual(englishPages);
    expect(renderer.result.siteSettingsState).toMatchObject(englishSettings);
    expect(renderer.result.siteThemeState).toEqual(englishTheme);

    await renderer.rerender({
      ...baseProps,
      canvasDocument: pageEn,
      mutationBaseDocument: pageEn,
    });
    expect(renderer.result.activePageId).toBe('page-en');
    expect(renderer.result.activeCanvasLocale).toBe('en');
    expect(renderer.result.currentSlugState).toBe('page-en');
    await renderer.unmount();
  });

  it('persists edits made on page A while a manual target draft is loading', async () => {
    const pageA = navigationDocument('21');
    const editedDuringLoad = { ...pageA, updatedAt: '2026-07-13T00:21:01.000Z' };
    const pageB = navigationDocument('22');
    const pageBLoad = deferred<void>();
    const savedDocuments: BuilderCanvasDocument[] = [];
    const replacements: BuilderCanvasDocument[] = [];
    const fetchMock = vi.fn(async (input: RequestInfo | URL, init?: RequestInit) => {
      const url = String(input);
      if (url.includes('/api/builder/blog/posts?')) {
        return Response.json({ ok: true, total: 0, posts: [] });
      }
      if (init?.method === 'PUT') {
        const body = JSON.parse(String(init.body)) as { document: BuilderCanvasDocument };
        savedDocuments.push(body.document);
        return Response.json({
          draft: { revision: 2, savedAt: body.document.updatedAt },
          document: body.document,
        });
      }
      if (url.includes('/page-b/draft?')) {
        await pageBLoad.promise;
        return Response.json({
          draft: { revision: 1, savedAt: pageB.updatedAt },
          document: pageB,
        });
      }
      return Response.json({
        draft: { revision: 1, savedAt: pageA.updatedAt },
        document: pageA,
      });
    });
    vi.stubGlobal('fetch', fetchMock);
    const baseProps: SandboxSiteStateProps = {
      initialDocument: pageA,
      initialDraftMeta: { revision: 1, savedAt: pageA.updatedAt },
      locale: 'ko',
      siteId: 'navigation-test-site',
      initialPageId: 'page-a',
      currentSlug: 'page-a',
      canvasDocument: pageA,
      hasLocalHistory: false,
      mutationBaseDocument: null,
      replaceDocument: vi.fn((document: BuilderCanvasDocument) => replacements.push(document)),
      setDraftSaveState: vi.fn(),
      pushToast: vi.fn(),
    };
    const renderer = await renderSandboxSiteState(baseProps);
    replacements.length = 0;

    let navigation!: Promise<boolean>;
    await act(async () => {
      navigation = renderer.result.handleSelectPage('page-b', 'page-b');
      await Promise.resolve();
    });
    await renderer.rerender({
      ...baseProps,
      canvasDocument: editedDuringLoad,
      hasLocalHistory: true,
    });
    expect(renderer.result.activePageId).toBe('page-a');
    expect(replacements).not.toContain(pageB);

    pageBLoad.resolve();
    await act(async () => {
      await expect(navigation).resolves.toBe(true);
    });
    await renderer.flush();

    expect(savedDocuments.at(-1)).toEqual(editedDuringLoad);
    expect(replacements.filter((document) => document.updatedAt === pageB.updatedAt)).toHaveLength(1);
    expect(renderer.result.activePageId).toBe('page-b');
    await renderer.unmount();
  });

  it('keeps the prior revision when a same-identity prop refresh is skipped for local history', async () => {
    const pageA = navigationDocument('revision-a');
    const dirtyPageA = { ...pageA, updatedAt: '2026-07-13T00:22:01.000Z' };
    const refreshedPageA = { ...pageA, updatedAt: '2026-07-13T00:22:02.000Z' };
    const pageB = navigationDocument('revision-b');
    const saveBodies: Array<{ expectedRevision?: number }> = [];
    const fetchMock = vi.fn(async (input: RequestInfo | URL, init?: RequestInit) => {
      const url = String(input);
      if (url.includes('/api/builder/blog/posts?')) {
        return Response.json({ ok: true, total: 0, posts: [] });
      }
      if (init?.method === 'PUT') {
        saveBodies.push(JSON.parse(String(init.body)) as { expectedRevision?: number });
        return Response.json({
          draft: { revision: 2, savedAt: dirtyPageA.updatedAt },
          document: dirtyPageA,
        });
      }
      if (url.includes('/page-b/draft?')) {
        return Response.json({
          draft: { revision: 1, savedAt: pageB.updatedAt },
          document: pageB,
        });
      }
      return Response.json({
        draft: { revision: 1, savedAt: pageA.updatedAt },
        document: pageA,
      });
    });
    vi.stubGlobal('fetch', fetchMock);
    const baseProps: SandboxSiteStateProps = {
      initialDocument: pageA,
      initialDraftMeta: { revision: 1, savedAt: pageA.updatedAt },
      locale: 'ko',
      siteId: 'navigation-test-site',
      initialPageId: 'page-a',
      currentSlug: 'page-a',
      canvasDocument: pageA,
      hasLocalHistory: false,
      mutationBaseDocument: null,
      replaceDocument: vi.fn(),
      setDraftSaveState: vi.fn(),
      pushToast: vi.fn(),
    };
    const renderer = await renderSandboxSiteState(baseProps);

    await renderer.rerender({
      ...baseProps,
      initialDocument: refreshedPageA,
      initialDraftMeta: { revision: 2, savedAt: refreshedPageA.updatedAt },
      canvasDocument: dirtyPageA,
      hasLocalHistory: true,
    });
    expect(renderer.result.draftMeta?.revision).toBe(1);

    await act(async () => {
      await expect(renderer.result.handleSelectPage('page-b', 'page-b')).resolves.toBe(true);
    });

    expect(saveBodies.at(-1)?.expectedRevision).toBe(1);
    expect(renderer.result.activePageId).toBe('page-b');
    await renderer.unmount();
  });

  it('applies a deferred same-identity prop refresh after local history clears', async () => {
    const pageA = navigationDocument('history-a');
    const dirtyPageA = { ...pageA, updatedAt: '2026-07-13T00:22:03.000Z' };
    const refreshedPageA = { ...pageA, updatedAt: '2026-07-13T00:22:04.000Z' };
    const replacements: BuilderCanvasDocument[] = [];
    vi.stubGlobal('fetch', vi.fn(async (input: RequestInfo | URL) => {
      const url = String(input);
      if (url.includes('/api/builder/blog/posts?')) {
        return Response.json({ ok: true, total: 0, posts: [] });
      }
      return Response.json({
        draft: { revision: 1, savedAt: pageA.updatedAt },
        document: pageA,
      });
    }));
    const baseProps: SandboxSiteStateProps = {
      initialDocument: pageA,
      initialDraftMeta: { revision: 1, savedAt: pageA.updatedAt },
      locale: 'ko',
      siteId: 'navigation-test-site',
      initialPageId: 'page-a',
      currentSlug: 'page-a',
      canvasDocument: pageA,
      hasLocalHistory: false,
      mutationBaseDocument: null,
      replaceDocument: vi.fn((document: BuilderCanvasDocument) => replacements.push(document)),
      setDraftSaveState: vi.fn(),
      pushToast: vi.fn(),
    };
    const renderer = await renderSandboxSiteState(baseProps);
    replacements.length = 0;
    const refreshedProps = {
      ...baseProps,
      initialDocument: refreshedPageA,
      initialDraftMeta: { revision: 2, savedAt: refreshedPageA.updatedAt },
      canvasDocument: dirtyPageA,
    };

    await renderer.rerender({ ...refreshedProps, hasLocalHistory: true });
    expect(replacements).not.toContain(refreshedPageA);
    expect(renderer.result.draftMeta?.revision).toBe(1);

    await renderer.rerender({ ...refreshedProps, hasLocalHistory: false });
    await renderer.flush();
    expect(replacements.filter((document) => document === refreshedPageA)).toHaveLength(1);
    expect(renderer.result.draftMeta?.revision).toBe(2);
    await renderer.unmount();
  });

  it('defers a same-identity prop refresh until an active mutation ends', async () => {
    const pageA = navigationDocument('mutation-a');
    const mutationPageA = { ...pageA, updatedAt: '2026-07-13T00:22:05.000Z' };
    const refreshedPageA = { ...pageA, updatedAt: '2026-07-13T00:22:06.000Z' };
    const replacements: BuilderCanvasDocument[] = [];
    vi.stubGlobal('fetch', vi.fn(async (input: RequestInfo | URL) => {
      const url = String(input);
      if (url.includes('/api/builder/blog/posts?')) {
        return Response.json({ ok: true, total: 0, posts: [] });
      }
      return Response.json({
        draft: { revision: 1, savedAt: pageA.updatedAt },
        document: pageA,
      });
    }));
    const baseProps: SandboxSiteStateProps = {
      initialDocument: pageA,
      initialDraftMeta: { revision: 1, savedAt: pageA.updatedAt },
      locale: 'ko',
      siteId: 'navigation-test-site',
      initialPageId: 'page-a',
      currentSlug: 'page-a',
      canvasDocument: pageA,
      hasLocalHistory: false,
      mutationBaseDocument: null,
      replaceDocument: vi.fn((document: BuilderCanvasDocument) => replacements.push(document)),
      setDraftSaveState: vi.fn(),
      pushToast: vi.fn(),
    };
    const renderer = await renderSandboxSiteState(baseProps);
    replacements.length = 0;
    const refreshedProps = {
      ...baseProps,
      initialDocument: refreshedPageA,
      initialDraftMeta: { revision: 2, savedAt: refreshedPageA.updatedAt },
      canvasDocument: mutationPageA,
      mutationBaseDocument: mutationPageA,
    };

    await renderer.rerender(refreshedProps);
    expect(replacements).not.toContain(refreshedPageA);
    expect(renderer.result.draftMeta?.revision).toBe(1);

    await renderer.rerender({ ...refreshedProps, mutationBaseDocument: null });
    await renderer.flush();
    expect(replacements.filter((document) => document === refreshedPageA)).toHaveLength(1);
    expect(renderer.result.draftMeta?.revision).toBe(2);
    await renderer.unmount();
  });

  it('commits only the latest rapid manual page target', async () => {
    const pageA = navigationDocument('rapid-a');
    const pageB = navigationDocument('rapid-b');
    const pageC = navigationDocument('rapid-c');
    const pageBStarted = deferred<void>();
    const pageBLoad = deferred<void>();
    const replacements: BuilderCanvasDocument[] = [];
    const pushToast = vi.fn();
    const fetchMock = vi.fn(async (input: RequestInfo | URL, init?: RequestInit) => {
      const url = String(input);
      if (url.includes('/api/builder/blog/posts?')) {
        return Response.json({ ok: true, total: 0, posts: [] });
      }
      if (init?.method === 'PUT') {
        return Response.json({
          draft: { revision: 2, savedAt: pageA.updatedAt },
          document: pageA,
        });
      }
      if (url.includes('/page-b/draft?')) {
        pageBStarted.resolve();
        await pageBLoad.promise;
        return Response.json({
          draft: { revision: 1, savedAt: pageB.updatedAt },
          document: pageB,
        });
      }
      if (url.includes('/page-c/draft?')) {
        return Response.json({
          draft: { revision: 1, savedAt: pageC.updatedAt },
          document: pageC,
        });
      }
      return Response.json({
        draft: { revision: 1, savedAt: pageA.updatedAt },
        document: pageA,
      });
    });
    vi.stubGlobal('fetch', fetchMock);
    const baseProps: SandboxSiteStateProps = {
      initialDocument: pageA,
      initialDraftMeta: { revision: 1, savedAt: pageA.updatedAt },
      locale: 'ko',
      siteId: 'navigation-test-site',
      initialPageId: 'page-a',
      currentSlug: 'page-a',
      canvasDocument: pageA,
      hasLocalHistory: false,
      mutationBaseDocument: null,
      replaceDocument: vi.fn((document: BuilderCanvasDocument) => replacements.push(document)),
      setDraftSaveState: vi.fn(),
      pushToast,
    };
    const renderer = await renderSandboxSiteState(baseProps);
    replacements.length = 0;

    let pageBNavigation!: Promise<boolean>;
    await act(async () => {
      pageBNavigation = renderer.result.handleSelectPage('page-b', 'page-b');
      await Promise.resolve();
    });
    await pageBStarted.promise;
    const pageCNavigation = renderer.result.handleSelectPage('page-c', 'page-c');
    pageBLoad.resolve();

    await act(async () => {
      await expect(pageBNavigation).resolves.toBe(false);
      await expect(pageCNavigation).resolves.toBe(true);
    });
    await renderer.flush();

    expect(replacements).not.toContain(pageB);
    expect(replacements.filter((document) => document.updatedAt === pageC.updatedAt)).toHaveLength(1);
    expect(pushToast).not.toHaveBeenCalledWith('Loaded page: page-b', 'success');
    expect(renderer.result.activePageId).toBe('page-c');
    await renderer.unmount();
  });

  it.each([400, 404, 422])(
    'retains the current scope and exposes a terminal save blocker for HTTP %i',
    async (status) => {
      const pageA = navigationDocument(`terminal-${status}`);
      const dirtyPageA = { ...pageA, updatedAt: `2026-07-13T00:${String(status).slice(-2)}:01.000Z` };
      const pageB = navigationDocument(`terminal-target-${status}`);
      const replacements: BuilderCanvasDocument[] = [];
      const pushToast = vi.fn();
      const fetchMock = vi.fn(async (input: RequestInfo | URL, init?: RequestInit) => {
        const url = String(input);
        if (url.includes('/api/builder/blog/posts?')) {
          return Response.json({ ok: true, total: 0, posts: [] });
        }
        if (init?.method === 'PUT') {
          return Response.json({ error: `save-${status}` }, { status });
        }
        return Response.json({
          draft: { revision: 1, savedAt: pageA.updatedAt },
          document: pageA,
        });
      });
      vi.stubGlobal('fetch', fetchMock);
      const baseProps: SandboxSiteStateProps = {
        initialDocument: pageA,
        initialDraftMeta: { revision: 1, savedAt: pageA.updatedAt },
        locale: 'ko',
        siteId: 'navigation-test-site',
        initialPageId: 'page-a',
        currentSlug: 'page-a',
        canvasDocument: pageA,
        hasLocalHistory: false,
        mutationBaseDocument: null,
        replaceDocument: vi.fn((document: BuilderCanvasDocument) => replacements.push(document)),
        setDraftSaveState: vi.fn(),
        pushToast,
      };
      const renderer = await renderSandboxSiteState(baseProps);
      replacements.length = 0;

      await renderer.rerender({ ...baseProps, canvasDocument: dirtyPageA, hasLocalHistory: true });
      await renderer.rerender({
        ...baseProps,
        initialDocument: pageB,
        initialPageId: 'page-b',
        currentSlug: 'page-b',
        canvasDocument: dirtyPageA,
        hasLocalHistory: true,
      });
      await renderer.flush();

      expect(renderer.result.activePageId).toBe('page-a');
      expect(renderer.result.saveBlockReason).toBeTruthy();
      expect(replacements).not.toContain(pageB);
      expect(pushToast).toHaveBeenCalledWith(
        renderer.result.saveBlockReason,
        'error',
        expect.objectContaining({ actionLabel: undefined, onAction: undefined }),
      );
      await renderer.unmount();
    },
  );

  it.each([
    { status: 429, marker: '제한' },
    { status: 503, marker: 'HTTP 503' },
  ])('retries a transient HTTP $status pending external transition only through its explicit action', async ({ status, marker }) => {
    const pageA = navigationDocument('17');
    const dirtyPageA = { ...pageA, updatedAt: '2026-07-13T00:17:01.000Z' };
    const pageB = navigationDocument('18');
    const replacements: BuilderCanvasDocument[] = [];
    const pushToast = vi.fn();
    let putAttempts = 0;
    const fetchMock = vi.fn(async (input: RequestInfo | URL, init?: RequestInit) => {
      const url = String(input);
      if (url.includes('/api/builder/blog/posts?')) {
        return Response.json({ ok: true, total: 0, posts: [] });
      }
      if (init?.method === 'PUT') {
        putAttempts += 1;
        if (putAttempts === 1) {
          return Response.json({ error: 'temporary_failure' }, { status });
        }
        return Response.json({
          draft: { revision: 2, savedAt: dirtyPageA.updatedAt },
          document: dirtyPageA,
        });
      }
      return Response.json({
        draft: { revision: 1, savedAt: pageA.updatedAt },
        document: pageA,
      });
    });
    vi.stubGlobal('fetch', fetchMock);
    const baseProps: SandboxSiteStateProps = {
      initialDocument: pageA,
      initialDraftMeta: { revision: 1, savedAt: pageA.updatedAt },
      locale: 'ko',
      siteId: 'navigation-test-site',
      initialPageId: 'page-a',
      currentSlug: 'page-a',
      canvasDocument: pageA,
      hasLocalHistory: false,
      mutationBaseDocument: null,
      replaceDocument: vi.fn((document: BuilderCanvasDocument) => replacements.push(document)),
      setDraftSaveState: vi.fn(),
      pushToast,
    };
    const renderer = await renderSandboxSiteState(baseProps);
    replacements.length = 0;

    await renderer.rerender({ ...baseProps, canvasDocument: dirtyPageA, hasLocalHistory: true });
    await renderer.rerender({
      ...baseProps,
      initialDocument: pageB,
      initialPageId: 'page-b',
      currentSlug: 'page-b',
      canvasDocument: dirtyPageA,
      hasLocalHistory: true,
    });
    await renderer.flush();

    expect(putAttempts).toBe(1);
    expect(renderer.result.activePageId).toBe('page-a');
    expect(renderer.result.saveBlockReason).toContain(marker);
    const retryOptions = pushToast.mock.calls.find(([message]) => String(message).includes(marker))?.[2];
    expect(retryOptions?.actionLabel).toBe('다시 시도');
    expect(retryOptions?.onAction).toBeTypeOf('function');

    await act(async () => retryOptions?.onAction?.());
    await renderer.flush();

    expect(putAttempts).toBe(2);
    expect(renderer.result.saveBlockReason).toBeNull();
    expect(renderer.result.activePageId).toBe('page-b');
    expect(replacements.filter((document) => document === pageB)).toHaveLength(1);
    await renderer.unmount();
  });

  it('suppresses an in-flight external save rejection after unmount', async () => {
    const pageA = navigationDocument('19');
    const dirtyPageA = { ...pageA, updatedAt: '2026-07-13T00:19:01.000Z' };
    const pageB = navigationDocument('20');
    const saveStarted = deferred<void>();
    const saveResponse = deferred<void>();
    const replacements: BuilderCanvasDocument[] = [];
    const setDraftSaveState = vi.fn();
    const pushToast = vi.fn();
    const fetchMock = vi.fn(async (input: RequestInfo | URL, init?: RequestInit) => {
      const url = String(input);
      if (url.includes('/api/builder/blog/posts?')) {
        return Response.json({ ok: true, total: 0, posts: [] });
      }
      if (init?.method === 'PUT') {
        saveStarted.resolve();
        await saveResponse.promise;
        throw new Error('save rejected after unmount');
      }
      return Response.json({
        draft: { revision: 1, savedAt: pageA.updatedAt },
        document: pageA,
      });
    });
    vi.stubGlobal('fetch', fetchMock);
    const baseProps: SandboxSiteStateProps = {
      initialDocument: pageA,
      initialDraftMeta: { revision: 1, savedAt: pageA.updatedAt },
      locale: 'ko',
      siteId: 'navigation-test-site',
      initialPageId: 'page-a',
      currentSlug: 'page-a',
      canvasDocument: pageA,
      hasLocalHistory: false,
      mutationBaseDocument: null,
      replaceDocument: vi.fn((document: BuilderCanvasDocument) => replacements.push(document)),
      setDraftSaveState,
      pushToast,
    };
    const renderer = await renderSandboxSiteState(baseProps);
    replacements.length = 0;

    await renderer.rerender({ ...baseProps, canvasDocument: dirtyPageA, hasLocalHistory: true });
    await renderer.rerender({
      ...baseProps,
      initialDocument: pageB,
      initialPageId: 'page-b',
      currentSlug: 'page-b',
      canvasDocument: dirtyPageA,
      hasLocalHistory: true,
    });
    await saveStarted.promise;
    await renderer.unmount();
    const saveStateCallsAtUnmount = setDraftSaveState.mock.calls.length;
    const toastCallsAtUnmount = pushToast.mock.calls.length;

    saveResponse.resolve();
    await new Promise<void>((resolve) => setImmediate(resolve));
    await new Promise<void>((resolve) => setImmediate(resolve));

    expect(replacements).not.toContain(pageB);
    expect(setDraftSaveState).toHaveBeenCalledTimes(saveStateCallsAtUnmount);
    expect(pushToast).toHaveBeenCalledTimes(toastCallsAtUnmount);
  });

  it('suppresses a manual target load rejection after unmount', async () => {
    const pageA = navigationDocument('23');
    const targetLoadStarted = deferred<void>();
    const targetLoadResponse = deferred<void>();
    const replacements: BuilderCanvasDocument[] = [];
    const setDraftSaveState = vi.fn();
    const pushToast = vi.fn();
    const fetchMock = vi.fn(async (input: RequestInfo | URL) => {
      const url = String(input);
      if (url.includes('/api/builder/blog/posts?')) {
        return Response.json({ ok: true, total: 0, posts: [] });
      }
      if (url.includes('/page-b/draft?')) {
        targetLoadStarted.resolve();
        await targetLoadResponse.promise;
        throw new Error('target load rejected after unmount');
      }
      return Response.json({
        draft: { revision: 1, savedAt: pageA.updatedAt },
        document: pageA,
      });
    });
    vi.stubGlobal('fetch', fetchMock);
    const baseProps: SandboxSiteStateProps = {
      initialDocument: pageA,
      initialDraftMeta: { revision: 1, savedAt: pageA.updatedAt },
      locale: 'ko',
      siteId: 'navigation-test-site',
      initialPageId: 'page-a',
      currentSlug: 'page-a',
      canvasDocument: pageA,
      hasLocalHistory: false,
      mutationBaseDocument: null,
      replaceDocument: vi.fn((document: BuilderCanvasDocument) => replacements.push(document)),
      setDraftSaveState,
      pushToast,
    };
    const renderer = await renderSandboxSiteState(baseProps);
    replacements.length = 0;
    let navigation!: Promise<boolean>;
    await act(async () => {
      navigation = renderer.result.handleSelectPage('page-b', 'page-b');
      await Promise.resolve();
    });
    await targetLoadStarted.promise;
    await renderer.unmount();
    const saveStateCallsAtUnmount = setDraftSaveState.mock.calls.length;
    const toastCallsAtUnmount = pushToast.mock.calls.length;

    targetLoadResponse.resolve();
    await expect(navigation).resolves.toBe(false);
    await new Promise<void>((resolve) => setImmediate(resolve));

    expect(replacements).toHaveLength(0);
    expect(setDraftSaveState).toHaveBeenCalledTimes(saveStateCallsAtUnmount);
    expect(pushToast).toHaveBeenCalledTimes(toastCallsAtUnmount);
  });

  it('invalidates StrictMode first-mount work while keeping the remount operational', async () => {
    const pageA = navigationDocument('24');
    const stalePageA = { ...pageA, updatedAt: '2026-07-13T00:24:59.000Z' };
    const pageB = navigationDocument('25');
    const staleLoadResponse = deferred<void>();
    const replacements: BuilderCanvasDocument[] = [];
    let pageALoads = 0;
    const fetchMock = vi.fn(async (input: RequestInfo | URL) => {
      const url = String(input);
      if (url.includes('/api/builder/blog/posts?')) {
        return Response.json({ ok: true, total: 0, posts: [] });
      }
      if (url.includes('/page-a/draft?')) {
        pageALoads += 1;
        if (pageALoads === 1) {
          await staleLoadResponse.promise;
          return Response.json({
            draft: { revision: 99, savedAt: stalePageA.updatedAt },
            document: stalePageA,
          });
        }
      }
      return Response.json({
        draft: { revision: 1, savedAt: pageA.updatedAt },
        document: pageA,
      });
    });
    vi.stubGlobal('fetch', fetchMock);
    const baseProps: SandboxSiteStateProps = {
      initialDocument: pageA,
      initialDraftMeta: { revision: 1, savedAt: pageA.updatedAt },
      locale: 'ko',
      siteId: 'navigation-test-site',
      initialPageId: 'page-a',
      currentSlug: 'page-a',
      canvasDocument: pageA,
      hasLocalHistory: false,
      mutationBaseDocument: null,
      replaceDocument: vi.fn((document: BuilderCanvasDocument) => replacements.push(document)),
      setDraftSaveState: vi.fn(),
      pushToast: vi.fn(),
    };
    const renderer = await renderSandboxSiteState(baseProps, { strict: true });
    expect(pageALoads).toBe(2);
    replacements.length = 0;

    staleLoadResponse.resolve();
    await renderer.flush();
    expect(replacements.some((document) => document.updatedAt === stalePageA.updatedAt)).toBe(false);

    await renderer.rerender({
      ...baseProps,
      initialDocument: pageB,
      initialPageId: 'page-b',
      currentSlug: 'page-b',
    });
    await renderer.flush();

    expect(renderer.result.activePageId).toBe('page-b');
    expect(replacements.filter((document) => document === pageB)).toHaveLength(1);
    await renderer.unmount();
  });

  it('lets a manual page target supersede a queued external page transition before it applies', async () => {
    const pageA = navigationDocument('manual-wins-a');
    const dirtyPageA = { ...pageA, updatedAt: '2026-07-13T00:30:01.000Z' };
    const pageB = navigationDocument('manual-wins-b');
    const pageC = navigationDocument('manual-wins-c');
    const saveResponse = deferred<void>();
    let putAttempts = 0;
    const savedDocuments: BuilderCanvasDocument[] = [];
    const replacements: BuilderCanvasDocument[] = [];
    const fetchMock = vi.fn(async (input: RequestInfo | URL, init?: RequestInit) => {
      const url = String(input);
      if (url.includes('/api/builder/blog/posts?')) {
        return Response.json({ ok: true, total: 0, posts: [] });
      }
      if (init?.method === 'PUT') {
        putAttempts += 1;
        const body = JSON.parse(String(init.body)) as { document: BuilderCanvasDocument };
        savedDocuments.push(body.document);
        if (putAttempts === 1) await saveResponse.promise;
        return Response.json({
          draft: { revision: 2, savedAt: body.document.updatedAt },
          document: body.document,
        });
      }
      if (url.includes('/page-c/draft?')) {
        return Response.json({
          draft: { revision: 1, savedAt: pageC.updatedAt },
          document: pageC,
        });
      }
      return Response.json({
        draft: { revision: 1, savedAt: pageA.updatedAt },
        document: pageA,
      });
    });
    vi.stubGlobal('fetch', fetchMock);
    const baseProps: SandboxSiteStateProps = {
      initialDocument: pageA,
      initialDraftMeta: { revision: 1, savedAt: pageA.updatedAt },
      locale: 'ko',
      siteId: 'navigation-test-site',
      initialPageId: 'page-a',
      currentSlug: 'page-a',
      canvasDocument: pageA,
      hasLocalHistory: false,
      mutationBaseDocument: null,
      replaceDocument: vi.fn((document: BuilderCanvasDocument) => replacements.push(document)),
      setDraftSaveState: vi.fn(),
      pushToast: vi.fn(),
    };
    const renderer = await renderSandboxSiteState(baseProps);
    replacements.length = 0;

    await renderer.rerender({ ...baseProps, canvasDocument: dirtyPageA, hasLocalHistory: true });
    await renderer.rerender({
      ...baseProps,
      initialDocument: pageB,
      initialDraftMeta: { revision: 1, savedAt: pageB.updatedAt },
      initialPageId: 'page-b',
      currentSlug: 'page-b',
      canvasDocument: dirtyPageA,
      hasLocalHistory: true,
    });

    let manualNavigation!: Promise<boolean>;
    await act(async () => {
      manualNavigation = renderer.result.handleSelectPage('page-c', 'page-c');
      await Promise.resolve();
    });

    saveResponse.resolve();
    await act(async () => {
      await expect(manualNavigation).resolves.toBe(true);
    });
    await renderer.flush();

    expect(replacements).not.toContain(pageB);
    expect(replacements.filter((document) => document.updatedAt === pageC.updatedAt)).toHaveLength(1);
    expect(renderer.result.activePageId).toBe('page-c');
    expect(savedDocuments.some((document) => document.updatedAt === dirtyPageA.updatedAt)).toBe(true);
    expect(putAttempts).toBe(1);

    // No loop: the parent prop still targets page-b, yet page-b never re-applies.
    await renderer.flush();
    expect(renderer.result.activePageId).toBe('page-c');
    expect(replacements).not.toContain(pageB);
    expect(putAttempts).toBe(1);
    await renderer.unmount();
  });

  it('lets a manual locale switch supersede a queued external page transition', async () => {
    const koreanPage = navigationDocument('locale-wins-ko', 'ko');
    const dirtyKoreanPage = { ...koreanPage, updatedAt: '2026-07-13T00:31:01.000Z' };
    const externalPageB = navigationDocument('locale-wins-b', 'ko');
    const englishPage = navigationDocument('locale-wins-en', 'en');
    const englishPages = [{ pageId: 'page-en', slug: 'page-en' }];
    const englishNavigation = [{
      id: 'nav-en',
      pageId: 'page-en',
      href: '/en/page-en',
      label: { ko: '영어', 'zh-hant': '英文', en: 'English' },
    }];
    const englishSettings = { firmName: 'English site' };
    const englishTheme = {
      ...DEFAULT_THEME,
      colors: { ...DEFAULT_THEME.colors, primary: '#004488' },
    };
    const saveResponse = deferred<void>();
    let putAttempts = 0;
    const savedDocuments: BuilderCanvasDocument[] = [];
    const replacements: BuilderCanvasDocument[] = [];
    const fetchMock = vi.fn(async (input: RequestInfo | URL, init?: RequestInit) => {
      const url = String(input);
      if (url.includes('/api/builder/blog/posts?')) {
        return Response.json({ ok: true, total: 0, posts: [] });
      }
      if (init?.method === 'PUT') {
        putAttempts += 1;
        const body = JSON.parse(String(init.body)) as { document: BuilderCanvasDocument };
        savedDocuments.push(body.document);
        if (putAttempts === 1) await saveResponse.promise;
        return Response.json({
          draft: { revision: 2, savedAt: body.document.updatedAt },
          document: body.document,
        });
      }
      if (url.includes('/api/builder/site/pages?')) {
        return Response.json({ pages: englishPages });
      }
      if (url.includes('/api/builder/site/navigation?')) {
        return Response.json({ navigation: englishNavigation });
      }
      if (url.includes('/api/builder/site/settings?')) {
        return Response.json({ settings: englishSettings, theme: englishTheme });
      }
      if (url.includes('/page-en/draft?')) {
        return Response.json({
          draft: { revision: 1, savedAt: englishPage.updatedAt },
          document: englishPage,
        });
      }
      return Response.json({
        draft: { revision: 1, savedAt: koreanPage.updatedAt },
        document: koreanPage,
      });
    });
    vi.stubGlobal('fetch', fetchMock);
    const baseProps: SandboxSiteStateProps = {
      initialDocument: koreanPage,
      initialDraftMeta: { revision: 1, savedAt: koreanPage.updatedAt },
      locale: 'ko',
      siteId: 'navigation-test-site',
      initialPageId: 'page-ko',
      currentSlug: 'page-ko',
      canvasDocument: koreanPage,
      hasLocalHistory: false,
      mutationBaseDocument: null,
      navItems: [],
      replaceDocument: vi.fn((document: BuilderCanvasDocument) => replacements.push(document)),
      setDraftSaveState: vi.fn(),
      pushToast: vi.fn(),
    };
    const renderer = await renderSandboxSiteState(baseProps);
    replacements.length = 0;

    await renderer.rerender({
      ...baseProps,
      canvasDocument: dirtyKoreanPage,
      hasLocalHistory: true,
    });
    await renderer.rerender({
      ...baseProps,
      initialDocument: externalPageB,
      initialDraftMeta: { revision: 1, savedAt: externalPageB.updatedAt },
      initialPageId: 'page-b',
      currentSlug: 'page-b',
      canvasDocument: dirtyKoreanPage,
      hasLocalHistory: true,
    });

    let localeNavigation!: Promise<void>;
    await act(async () => {
      localeNavigation = renderer.result.handleLocaleChange('en', 'page-en');
      await Promise.resolve();
    });

    saveResponse.resolve();
    await act(async () => {
      await localeNavigation;
    });
    await renderer.flush();

    expect(replacements).not.toContain(externalPageB);
    expect(replacements.filter((document) => document.updatedAt === englishPage.updatedAt)).toHaveLength(1);
    expect(renderer.result.activePageId).toBe('page-en');
    expect(renderer.result.activeCanvasLocale).toBe('en');
    expect(savedDocuments.some((document) => document.updatedAt === dirtyKoreanPage.updatedAt)).toBe(true);
    await renderer.unmount();
  });

  it('applies a genuinely newer external prop transition after a manual navigation commits', async () => {
    const pageA = navigationDocument('newer-ext-a');
    const pageC = navigationDocument('newer-ext-c');
    const pageD = navigationDocument('newer-ext-d');
    const replacements: BuilderCanvasDocument[] = [];
    const fetchMock = vi.fn(async (input: RequestInfo | URL, init?: RequestInit) => {
      const url = String(input);
      if (url.includes('/api/builder/blog/posts?')) {
        return Response.json({ ok: true, total: 0, posts: [] });
      }
      if (init?.method === 'PUT') {
        return Response.json({
          draft: { revision: 2, savedAt: pageA.updatedAt },
          document: pageA,
        });
      }
      if (url.includes('/page-c/draft?')) {
        return Response.json({
          draft: { revision: 1, savedAt: pageC.updatedAt },
          document: pageC,
        });
      }
      return Response.json({
        draft: { revision: 1, savedAt: pageA.updatedAt },
        document: pageA,
      });
    });
    vi.stubGlobal('fetch', fetchMock);
    const baseProps: SandboxSiteStateProps = {
      initialDocument: pageA,
      initialDraftMeta: { revision: 1, savedAt: pageA.updatedAt },
      locale: 'ko',
      siteId: 'navigation-test-site',
      initialPageId: 'page-a',
      currentSlug: 'page-a',
      canvasDocument: pageA,
      hasLocalHistory: false,
      mutationBaseDocument: null,
      replaceDocument: vi.fn((document: BuilderCanvasDocument) => replacements.push(document)),
      setDraftSaveState: vi.fn(),
      pushToast: vi.fn(),
    };
    const renderer = await renderSandboxSiteState(baseProps);
    replacements.length = 0;

    await act(async () => {
      await expect(renderer.result.handleSelectPage('page-c', 'page-c')).resolves.toBe(true);
    });
    await renderer.flush();
    expect(renderer.result.activePageId).toBe('page-c');

    await renderer.rerender({
      ...baseProps,
      initialDocument: pageD,
      initialDraftMeta: { revision: 1, savedAt: pageD.updatedAt },
      initialPageId: 'page-d',
      currentSlug: 'page-d',
      canvasDocument: pageC,
      mutationBaseDocument: null,
    });
    await renderer.flush();

    expect(replacements.filter((document) => document === pageD)).toHaveLength(1);
    expect(renderer.result.activePageId).toBe('page-d');
    await renderer.unmount();
  });
});

describe('persistLatestDraftForScope', () => {
  it('blocks navigation persistence before any save when a draft conflict is active', async () => {
    const document = { id: 'local-conflicted-document' };
    let saveCalls = 0;

    const result = await persistLatestDraftForScope({
      isScopeCurrent: () => true,
      isBlocked: () => true,
      getCurrentDocument: () => document,
      isDocumentSaved: () => false,
      saveDocument: async () => {
        saveCalls += 1;
        return true;
      },
    });

    expect(result).toBe('blocked');
    expect(saveCalls).toBe(0);
  });

  it('saves a second document that arrives while the first save is pending before returning', async () => {
    const firstDocument = { id: 'first', updatedAt: 'same-time' };
    const secondDocument = { id: 'second', updatedAt: 'later-time' };
    let currentDocument = firstDocument;
    const firstStarted = deferred<void>();
    const firstResponse = deferred<void>();
    const savedDocuments: Array<typeof firstDocument> = [];

    const result = persistLatestDraftForScope({
      isScopeCurrent: () => true,
      isBlocked: () => false,
      getCurrentDocument: () => currentDocument,
      isDocumentSaved: () => false,
      saveDocument: async (document) => {
        savedDocuments.push(document);
        if (document === firstDocument) {
          firstStarted.resolve();
          await firstResponse.promise;
        }
        return true;
      },
    });

    await firstStarted.promise;
    currentDocument = secondDocument;
    firstResponse.resolve();

    await expect(result).resolves.toBe('saved');
    expect(savedDocuments).toEqual([firstDocument, secondDocument]);
  });

  it('saves a different document object even when updatedAt is unchanged', async () => {
    const firstDocument = { id: 'first', updatedAt: 'same-time' };
    const secondDocument = { id: 'second', updatedAt: 'same-time' };
    let currentDocument = firstDocument;
    const firstStarted = deferred<void>();
    const firstResponse = deferred<void>();
    const savedDocuments: Array<typeof firstDocument> = [];

    const result = persistLatestDraftForScope({
      isScopeCurrent: () => true,
      isBlocked: () => false,
      getCurrentDocument: () => currentDocument,
      isDocumentSaved: (document) => document === firstDocument && savedDocuments.length > 0,
      saveDocument: async (document) => {
        savedDocuments.push(document);
        if (document === firstDocument) {
          firstStarted.resolve();
          await firstResponse.promise;
        }
        return true;
      },
    });

    await firstStarted.promise;
    currentDocument = secondDocument;
    firstResponse.resolve();

    await expect(result).resolves.toBe('saved');
    expect(savedDocuments).toEqual([firstDocument, secondDocument]);
  });

  it('blocks on the first false result without saving its successor', async () => {
    const firstDocument = { id: 'first' };
    const successorDocument = { id: 'successor' };
    let currentDocument = firstDocument;
    const firstStarted = deferred<void>();
    const firstResponse = deferred<void>();
    const savedDocuments: Array<typeof firstDocument> = [];

    const result = persistLatestDraftForScope({
      isScopeCurrent: () => true,
      isBlocked: () => false,
      getCurrentDocument: () => currentDocument,
      isDocumentSaved: () => false,
      saveDocument: async (document) => {
        savedDocuments.push(document);
        firstStarted.resolve();
        await firstResponse.promise;
        return false;
      },
    });

    await firstStarted.promise;
    currentDocument = successorDocument;
    firstResponse.resolve();

    await expect(result).resolves.toBe('blocked');
    expect(savedDocuments).toEqual([firstDocument]);
  });

  it('propagates the first thrown error without saving its successor', async () => {
    const firstDocument = { id: 'first' };
    const successorDocument = { id: 'successor' };
    let currentDocument = firstDocument;
    const firstStarted = deferred<void>();
    const firstResponse = deferred<void>();
    const saveError = new Error('save failed');
    const savedDocuments: Array<typeof firstDocument> = [];

    const result = persistLatestDraftForScope({
      isScopeCurrent: () => true,
      isBlocked: () => false,
      getCurrentDocument: () => currentDocument,
      isDocumentSaved: () => false,
      saveDocument: async (document) => {
        savedDocuments.push(document);
        firstStarted.resolve();
        await firstResponse.promise;
        throw saveError;
      },
    });

    await firstStarted.promise;
    currentDocument = successorDocument;
    firstResponse.resolve();

    await expect(result).rejects.toBe(saveError);
    expect(savedDocuments).toEqual([firstDocument]);
  });

  it('propagates a thrown save even when a blocker appears before rejection', async () => {
    const firstDocument = { id: 'first' };
    const successorDocument = { id: 'successor' };
    let currentDocument = firstDocument;
    let blocked = false;
    const firstStarted = deferred<void>();
    const firstResponse = deferred<void>();
    const saveError = new Error('save failed after blocker');
    const savedDocuments: Array<typeof firstDocument> = [];

    const result = persistLatestDraftForScope({
      isScopeCurrent: () => true,
      isBlocked: () => blocked,
      getCurrentDocument: () => currentDocument,
      isDocumentSaved: () => false,
      saveDocument: async (document) => {
        savedDocuments.push(document);
        firstStarted.resolve();
        await firstResponse.promise;
        throw saveError;
      },
    });

    await firstStarted.promise;
    blocked = true;
    currentDocument = successorDocument;
    firstResponse.resolve();

    await expect(result).rejects.toBe(saveError);
    expect(savedDocuments).toEqual([firstDocument]);
  });

  it('returns superseded after a scope transition without saving the new-scope document', async () => {
    const oldScopeDocument = { id: 'old-scope' };
    const newScopeDocument = { id: 'new-scope' };
    let currentDocument = oldScopeDocument;
    let scopeIsCurrent = true;
    const firstStarted = deferred<void>();
    const firstResponse = deferred<void>();
    const savedDocuments: Array<typeof oldScopeDocument> = [];

    const result = persistLatestDraftForScope({
      isScopeCurrent: () => scopeIsCurrent,
      isBlocked: () => false,
      getCurrentDocument: () => currentDocument,
      isDocumentSaved: () => false,
      saveDocument: async (document) => {
        savedDocuments.push(document);
        firstStarted.resolve();
        await firstResponse.promise;
        return true;
      },
    });

    await firstStarted.promise;
    scopeIsCurrent = false;
    currentDocument = newScopeDocument;
    firstResponse.resolve();

    await expect(result).resolves.toBe('superseded');
    expect(savedDocuments).toEqual([oldScopeDocument]);
  });

  it('saves rapid document replacements in the order observed after each save', async () => {
    const documents = [{ id: 'first' }, { id: 'second' }, { id: 'third' }];
    let currentDocument = documents[0];
    const starts = documents.map(() => deferred<void>());
    const responses = documents.map(() => deferred<void>());
    const savedDocuments: Array<(typeof documents)[number]> = [];

    const result = persistLatestDraftForScope({
      isScopeCurrent: () => true,
      isBlocked: () => false,
      getCurrentDocument: () => currentDocument,
      isDocumentSaved: () => false,
      saveDocument: async (document) => {
        const index = savedDocuments.length;
        savedDocuments.push(document);
        starts[index].resolve();
        await responses[index].promise;
        return true;
      },
    });

    await starts[0].promise;
    currentDocument = documents[1];
    responses[0].resolve();
    await starts[1].promise;
    currentDocument = documents[2];
    responses[1].resolve();
    await starts[2].promise;
    responses[2].resolve();

    await expect(result).resolves.toBe('saved');
    expect(savedDocuments).toEqual(documents);
  });
});

describe('createDraftSaveQueue', () => {
  it('starts a later save only after the prior save advances its revision', async () => {
    const queue = createDraftSaveQueue();
    const scope = { pageId: 'page-a', locale: 'ko' as const, epoch: 0 };
    const observedRevisions: number[] = [];
    let revision = 5;
    const firstGate = deferred<void>();

    const first = queue.enqueue(scope, {}, async () => {
      observedRevisions.push(revision);
      await firstGate.promise;
      revision = 6;
      return true;
    });
    const second = queue.enqueue(scope, {}, async () => {
      observedRevisions.push(revision);
      revision = 7;
      return true;
    });

    await Promise.resolve();
    expect(observedRevisions).toEqual([5]);
    firstGate.resolve();
    await Promise.all([first, second]);
    expect(observedRevisions).toEqual([5, 6]);
    expect(revision).toBe(7);
  });

  it('does not run an already queued successor after a blocked save', async () => {
    const queue = createDraftSaveQueue();
    const scope = { pageId: 'page-a', locale: 'ko' as const, epoch: 0 };
    const firstResponse = deferred<void>();
    let successorRan = false;

    const blocked = queue.enqueue(scope, {}, async () => {
      await firstResponse.promise;
      return false;
    });
    const successor = queue.enqueue(scope, {}, async () => {
      successorRan = true;
      return true;
    });

    await Promise.resolve();
    expect(successorRan).toBe(false);
    firstResponse.resolve();
    await expect(blocked).resolves.toBe(false);
    await expect(successor).resolves.toBe(false);
    expect(successorRan).toBe(false);
  });

  it('coalesces the exact same pending document save', async () => {
    const queue = createDraftSaveQueue();
    const scope = { pageId: 'page-a', locale: 'ko' as const, epoch: 0 };
    const documentKey = {};
    const gate = deferred<void>();
    let calls = 0;
    const save = () => queue.enqueue(scope, documentKey, async () => {
      calls += 1;
      await gate.promise;
      return true;
    });

    const first = save();
    const duplicate = save();
    expect(duplicate).toBe(first);
    gate.resolve();
    await expect(Promise.all([first, duplicate])).resolves.toEqual([true, true]);
    expect(calls).toBe(1);
  });

  it('lets a new scope save proceed while an old-page response is deferred and ignored', async () => {
    const controller = createDraftSaveScopeController('page-a', 'ko');
    const queue = createDraftSaveQueue();
    const oldScope = controller.current();
    const oldResponse = deferred<void>();
    const applied: string[] = [];

    const oldSave = queue.enqueue(oldScope, {}, async () => {
      await oldResponse.promise;
      if (controller.isCurrent(oldScope)) applied.push('page-a');
      return true;
    });
    const newScope = controller.transition('page-b', 'ko');
    const newSave = queue.enqueue(newScope, {}, async () => {
      if (controller.isCurrent(newScope)) applied.push('page-b');
      return true;
    });

    await expect(newSave).resolves.toBe(true);
    expect(applied).toEqual(['page-b']);
    oldResponse.resolve();
    await expect(oldSave).resolves.toBe(true);
    expect(applied).toEqual(['page-b']);
  });
});

describe('createDraftSaveScopeController', () => {
  it('uses the switched locale and linked page for the next edit/save scope', async () => {
    const controller = createDraftSaveScopeController('page-ko', 'ko');
    const queue = createDraftSaveQueue();
    const previousScope = controller.current();
    const previousResponse = deferred<void>();
    const staleApplications: string[] = [];
    const previousSave = queue.enqueue(previousScope, {}, async () => {
      await previousResponse.promise;
      if (controller.isCurrent(previousScope)) staleApplications.push(previousScope.locale);
      return true;
    });
    const nextScope = controller.transition('page-en', 'en');
    const observed: Array<{ pageId: string | null; locale: string; current: boolean }> = [];

    await queue.enqueue(nextScope, {}, async () => {
      observed.push({
        pageId: nextScope.pageId,
        locale: nextScope.locale,
        current: controller.isCurrent(nextScope),
      });
      return true;
    });

    expect(observed).toEqual([{ pageId: 'page-en', locale: 'en', current: true }]);
    previousResponse.resolve();
    await previousSave;
    expect(staleApplications).toEqual([]);
  });

  it('invalidates an earlier identity even after returning to the same page and locale', () => {
    const controller = createDraftSaveScopeController('page-a', 'ko');
    const firstVisit = controller.current();
    controller.transition('page-b', 'ko');
    const secondVisit = controller.transition('page-a', 'ko');

    expect(controller.isCurrent(firstVisit)).toBe(false);
    expect(controller.isCurrent(secondVisit)).toBe(true);
    expect(secondVisit.epoch).toBe(2);
  });

  it('invalidates in-flight work without changing the visible page identity', () => {
    const controller = createDraftSaveScopeController('page-a', 'ko');
    const beforeUnmount = controller.current();
    const invalidated = controller.invalidate();

    expect(invalidated).toEqual({ pageId: 'page-a', locale: 'ko', epoch: 1 });
    expect(controller.isCurrent(beforeUnmount)).toBe(false);
    expect(controller.isCurrent(invalidated)).toBe(true);
  });
});

describe('createSerializedTaskQueue', () => {
  it('finishes rapid page B then C navigation in request order', async () => {
    const queue = createSerializedTaskQueue();
    const pageBGate = deferred<void>();
    const visited: string[] = [];

    const pageB = queue.enqueue(async () => {
      visited.push('B:start');
      await pageBGate.promise;
      visited.push('B:done');
      return 'B';
    });
    const pageC = queue.enqueue(async () => {
      visited.push('C:start');
      visited.push('C:done');
      return 'C';
    });

    await Promise.resolve();
    expect(visited).toEqual(['B:start']);
    pageBGate.resolve();
    await expect(Promise.all([pageB, pageC])).resolves.toEqual(['B', 'C']);
    expect(visited).toEqual(['B:start', 'B:done', 'C:start', 'C:done']);
  });

  it('continues with the next navigation after a prior navigation rejects', async () => {
    const queue = createSerializedTaskQueue();
    const failed = queue.enqueue(async () => {
      throw new Error('load failed');
    });
    const recovered = queue.enqueue(async () => 'page-c');

    await expect(failed).rejects.toThrow('load failed');
    await expect(recovered).resolves.toBe('page-c');
  });
});

describe('isDraftSaveScopeCurrent', () => {
  const request = {
    pageId: 'page-a',
    locale: 'ko' as const,
    epoch: 7,
  };

  it('accepts only the still-active page, locale, and save epoch', () => {
    expect(isDraftSaveScopeCurrent(request, {
      pageId: 'page-a',
      locale: 'ko',
      epoch: 7,
    })).toBe(true);
  });

  it('rejects a completion after page or locale navigation', () => {
    expect(isDraftSaveScopeCurrent(request, {
      pageId: 'page-b',
      locale: 'ko',
      epoch: 7,
    })).toBe(false);
    expect(isDraftSaveScopeCurrent(request, {
      pageId: 'page-a',
      locale: 'en',
      epoch: 7,
    })).toBe(false);
  });

  it('rejects an older completion from a prior identity epoch', () => {
    expect(isDraftSaveScopeCurrent(request, {
      pageId: 'page-a',
      locale: 'ko',
      epoch: 8,
    })).toBe(false);
  });
});

function standardCompositeDocument(
  slug: string,
  options: {
    componentKey?: string;
    config?: Record<string, unknown>;
    extraNode?: Record<string, unknown>;
  } = {},
): BuilderCanvasDocument {
  const rootId = `${slug}-page-root`;
  return {
    version: 1,
    locale: 'ko',
    updatedAt: '2026-06-29T00:00:00.000Z',
    updatedBy: 'site-page-seed',
    stageWidth: 1280,
    stageHeight: 1200,
    nodes: [
      {
        id: rootId,
        kind: 'container',
      },
      {
        id: `${rootId}-composite`,
        kind: 'composite',
        parentId: rootId,
        content: {
          componentKey: options.componentKey ?? `legacy-page-${slug}`,
          config: options.config ?? { locale: 'ko' },
        },
      },
      ...(options.extraNode ? [options.extraNode] : []),
    ],
  } as unknown as BuilderCanvasDocument;
}

function homeCompositeDocument(
  options: { config?: Record<string, unknown>; decomposed?: boolean } = {},
): BuilderCanvasDocument {
  return {
    version: 1,
    locale: 'ko',
    updatedAt: '2026-06-29T00:00:00.000Z',
    updatedBy: 'home-seed-v11',
    stageWidth: 1280,
    stageHeight: 1200,
    nodes: [
      {
        id: options.decomposed ? 'home-hero-root' : 'home-hero',
        kind: options.decomposed ? 'section' : 'composite',
        content: options.decomposed
          ? { tagName: 'section' }
          : { componentKey: 'hero-search', config: options.config ?? { locale: 'ko' } },
      },
      {
        id: 'home-insights',
        kind: 'composite',
        content: { componentKey: 'insights-archive', config: { locale: 'ko' } },
      },
    ],
  } as unknown as BuilderCanvasDocument;
}

describe('draft conflict safety contract', () => {
  it('classifies only an exact draft_conflict response, not every HTTP 409', () => {
    expect(readExactDraftConflict(409, {
      errorCode: 'draft_conflict',
      current: { revision: 12, savedAt: '2026-07-13T01:02:03.000Z' },
    })).toEqual({
      currentRevision: 12,
      currentSavedAt: '2026-07-13T01:02:03.000Z',
    });

    expect(readExactDraftConflict(409, {
      errorCode: 'draft_locale_mismatch',
      current: { revision: 99 },
    })).toBeNull();
    expect(readExactDraftConflict(409, {
      errorCode: 'translation_release_policy_blocked',
      current: { revision: 99 },
    })).toBeNull();
    expect(readExactDraftConflict(428, {
      errorCode: 'draft_conflict',
      current: { revision: 12 },
    })).toBeNull();
  });

  it('retains authoritative draft meta and stays blocked when a second conflict arrives', async () => {
    const localDocument = standardCompositeDocument('about');
    const authoritativeDraftMeta = {
      revision: 7,
      savedAt: '2026-07-13T01:00:00.000Z',
    };
    const first = await createDraftConflictTransition({
      authoritativeDraftMeta,
      pageId: 'page-about',
      locale: 'ko',
      expectedRevision: 7,
      currentRevision: 8,
      currentSavedAt: '2026-07-13T01:01:00.000Z',
      localDocument,
    });
    const second = await createDraftConflictTransition({
      authoritativeDraftMeta: first.authoritativeDraftMeta,
      pageId: 'page-about',
      locale: 'ko',
      expectedRevision: 8,
      currentRevision: 9,
      currentSavedAt: '2026-07-13T01:02:00.000Z',
      localDocument,
    });

    expect(first.authoritativeDraftMeta).toBe(authoritativeDraftMeta);
    expect(second.authoritativeDraftMeta).toBe(authoritativeDraftMeta);
    expect(second.authoritativeDraftMeta?.revision).toBe(7);
    expect(second.conflict.currentRevision).toBe(9);
    expect(second.conflict.canSaveLocalVersion).toBe(false);
    expect(isDraftConflictBlocking(first.conflict)).toBe(true);
    expect(isDraftConflictBlocking(second.conflict)).toBe(true);
    expect(isDraftConflictBlocking(null)).toBe(false);
  });

  it('creates immutable recovery bytes whose download and SHA-256 checksum are exact', async () => {
    const localDocument = standardCompositeDocument('about');
    const expectedBytes = JSON.stringify(localDocument, null, 2);
    const snapshot = await createDraftRecoverySnapshot({
      document: localDocument,
      pageId: 'page/about unsafe',
      locale: 'en',
      capturedAt: '2026-07-13T01:02:03.004Z',
    });
    const download = buildDraftRecoveryDownload(snapshot);

    expect(snapshot.serializedDocument).toBe(expectedBytes);
    expect(snapshot.byteLength).toBe(Buffer.byteLength(expectedBytes, 'utf8'));
    expect(snapshot.checksumSha256).toBe(
      createHash('sha256').update(expectedBytes, 'utf8').digest('hex'),
    );
    expect(await download.blob.text()).toBe(expectedBytes);
    expect(download.blob.size).toBe(snapshot.byteLength);
    expect(download.filename).toBe(snapshot.filename);
    expect(snapshot.filename).toMatch(/^builder-local-draft-page-about-unsafe-en-/);
    expect(Object.isFrozen(snapshot)).toBe(true);
    expect(Object.isFrozen(snapshot.document)).toBe(true);
    expect(Object.isFrozen(snapshot.document.nodes)).toBe(true);

    const originalNodeCount = snapshot.document.nodes.length;
    (localDocument.nodes as unknown as Array<unknown>).push({ id: 'late-edit', kind: 'text' });
    expect(snapshot.document.nodes).toHaveLength(originalNodeCount);
    expect(snapshot.serializedDocument).toBe(expectedBytes);
  });

  it('applies the exact server document only after backup and current-scope guards pass', () => {
    const serverDocument = standardCompositeDocument('services');
    const serverDraft = {
      revision: 21,
      savedAt: '2026-07-13T01:10:00.000Z',
    };
    const applied = resolveServerLatestDraftChoice({
      backupDownloaded: true,
      scopeCurrent: true,
      conflictCurrent: true,
      document: serverDocument,
      draft: serverDraft,
    });

    expect(applied).toEqual({
      status: 'apply',
      document: serverDocument,
      draft: serverDraft,
    });
    if (applied.status === 'apply') {
      expect(applied.document).toBe(serverDocument);
      expect(applied.draft).toBe(serverDraft);
    }
    expect(resolveServerLatestDraftChoice({
      backupDownloaded: false,
      scopeCurrent: true,
      conflictCurrent: true,
      document: serverDocument,
      draft: serverDraft,
    })).toEqual({ status: 'blocked' });
    expect(resolveServerLatestDraftChoice({
      backupDownloaded: true,
      scopeCurrent: false,
      conflictCurrent: true,
      document: serverDocument,
      draft: serverDraft,
    })).toEqual({ status: 'blocked' });
    expect(resolveServerLatestDraftChoice({
      backupDownloaded: true,
      scopeCurrent: true,
      conflictCurrent: false,
      document: serverDocument,
      draft: serverDraft,
    })).toEqual({ status: 'blocked' });
  });

  it('recaptures the newer local document when an edit arrives while recovery hashing is pending', async () => {
    const firstDocument = standardCompositeDocument('about');
    const secondDocument = {
      ...firstDocument,
      updatedAt: '2026-07-13T01:20:00.000Z',
      nodes: [...firstDocument.nodes, { id: 'edit-during-server-fetch', kind: 'text' }],
    } as BuilderCanvasDocument;
    let currentDocument = firstDocument;
    const firstStarted = deferred<void>();
    const firstHashGate = deferred<void>();
    const capturedDocuments: BuilderCanvasDocument[] = [];

    const capture = captureStableDraftRecoverySnapshot({
      getCurrentDocument: () => currentDocument,
      createSnapshot: async (document) => {
        capturedDocuments.push(document);
        if (document === firstDocument) {
          firstStarted.resolve();
          await firstHashGate.promise;
        }
        return createDraftRecoverySnapshot({
          document,
          pageId: 'page-about',
          locale: 'ko',
        });
      },
    });

    await firstStarted.promise;
    currentDocument = secondDocument;
    firstHashGate.resolve();
    const result = await capture;

    expect(capturedDocuments).toEqual([firstDocument, secondDocument]);
    expect(result?.sourceDocument).toBe(secondDocument);
    expect(result?.snapshot.document).toEqual(secondDocument);
    expect(result?.snapshot.serializedDocument).toBe(JSON.stringify(secondDocument, null, 2));
  });

  it('localizes every conflict action result message', () => {
    const ko = Object.values(getDraftConflictActionMessages('ko')).join(' ');
    const zh = Object.values(getDraftConflictActionMessages('zh-hant')).join(' ');
    const en = Object.values(getDraftConflictActionMessages('en')).join(' ');

    expect(ko).toContain('로컬 초안');
    expect(zh).toContain('本機草稿');
    expect(en).toContain('local draft');
    expect(zh).not.toMatch(/[\u1100-\u11FF\u3130-\u318F\uAC00-\uD7A3]/);
    expect(en).not.toMatch(/[\u1100-\u11FF\u3130-\u318F\uAC00-\uD7A3\u4E00-\u9FFF]/);
  });
});

describe('shouldAutoDecomposeStandardPageDraft', () => {
  it('detects a default non-home standard-page live composite draft', () => {
    expect(shouldAutoDecomposeStandardPageDraft(standardCompositeDocument('about'), 'about')).toBe(true);
  });

  it('does not auto-decompose home, FAQ, custom pages, or mismatched composite keys', () => {
    expect(shouldAutoDecomposeStandardPageDraft(standardCompositeDocument('home'), '')).toBe(false);
    expect(shouldAutoDecomposeStandardPageDraft(standardCompositeDocument('faq'), 'faq')).toBe(false);
    expect(shouldAutoDecomposeStandardPageDraft(standardCompositeDocument('columns'), 'columns')).toBe(false);
    expect(
      shouldAutoDecomposeStandardPageDraft(
        standardCompositeDocument('about', { componentKey: 'legacy-page-services' }),
        'about',
      ),
    ).toBe(false);
  });

  it('leaves already decomposed or customized composite drafts untouched', () => {
    expect(
      shouldAutoDecomposeStandardPageDraft(
        standardCompositeDocument('about', { extraNode: { id: 'about-headline', kind: 'heading' } }),
        'about',
      ),
    ).toBe(false);
    expect(
      shouldAutoDecomposeStandardPageDraft(
        standardCompositeDocument('about', {
          config: { locale: 'ko', overrides: { headline: 'Custom headline' } },
        }),
        'about',
      ),
    ).toBe(false);
  });
});
describe('shouldOfferDecomposeCurrentPage', () => {
  it('offers explicit decompose for pristine home and standard live-mirror pages', () => {
    expect(shouldOfferDecomposeCurrentPage(homeCompositeDocument(), '')).toBe(true);
    expect(shouldOfferDecomposeCurrentPage(standardCompositeDocument('about'), 'about')).toBe(true);
    expect(shouldOfferDecomposeCurrentPage(standardCompositeDocument('faq'), 'faq')).toBe(true);
  });

  it('does not offer decompose for decomposed, customized, or unsupported pages', () => {
    expect(shouldOfferDecomposeCurrentPage(homeCompositeDocument({ decomposed: true }), '')).toBe(false);
    expect(
      shouldOfferDecomposeCurrentPage(
        homeCompositeDocument({ config: { locale: 'ko', overrides: { headline: 'Custom headline' } } }),
        '',
      ),
    ).toBe(false);
    expect(shouldOfferDecomposeCurrentPage(standardCompositeDocument('columns'), 'columns')).toBe(false);
  });
});

describe('areDraftDocumentsEquivalentForStaleRevision', () => {
  it('ignores document-level updatedBy marker normalization for same-content stale saves', () => {
    const current = standardCompositeDocument('about', {
      componentKey: 'legacy-page-about',
    });
    const sameContentWithSanitizedMarker = {
      ...current,
      updatedBy: 'home-seed-v11+insights-source+hero-responsive-parity'.slice(0, 36),
    };

    expect(areDraftDocumentsEquivalentForStaleRevision(current, sameContentWithSanitizedMarker)).toBe(true);
  });

  it('keeps true content differences as conflicts', () => {
    const current = standardCompositeDocument('about');
    const changed = {
      ...current,
      nodes: [
        ...current.nodes,
        { id: 'about-extra-copy', kind: 'text' },
      ],
    } as BuilderCanvasDocument;

    expect(areDraftDocumentsEquivalentForStaleRevision(current, changed)).toBe(false);
  });
});

describe('shouldKeepInitialDocumentForInitialDraftLoad', () => {
  it('keeps the SSR-migrated initial document when the initial draft fetch returns the same revision raw document', () => {
    const fetchedDocument = homeCompositeDocument({ decomposed: true });
    const initialDocument = {
      ...fetchedDocument,
      updatedAt: '2026-07-02T00:00:00.000Z',
      nodes: [
        {
          ...fetchedDocument.nodes[0],
          rect: { x: 0, y: 0, width: 1280, height: 820 },
        },
        ...fetchedDocument.nodes.slice(1),
      ],
    } as BuilderCanvasDocument;
    const draft = {
      revision: 7,
      savedAt: '2026-07-02T00:01:00.000Z',
      updatedBy: 'admin',
    };

    expect(shouldKeepInitialDocumentForInitialDraftLoad({
      activePageId: 'page-home',
      fetchedDocument,
      fetchedDraft: draft,
      initialDocument,
      initialDraft: draft,
      initialPageId: 'page-home',
    })).toBe(true);
  });

  it('loads the fetched draft when a newer revision arrives after SSR', () => {
    const initialDocument = homeCompositeDocument({ decomposed: true });
    const fetchedDocument = {
      ...initialDocument,
      updatedAt: '2026-07-02T00:02:00.000Z',
      nodes: [
        ...initialDocument.nodes,
        { id: 'new-editor-node', kind: 'text' },
      ],
    } as BuilderCanvasDocument;

    expect(shouldKeepInitialDocumentForInitialDraftLoad({
      activePageId: 'page-home',
      fetchedDocument,
      fetchedDraft: { revision: 8, savedAt: '2026-07-02T00:02:00.000Z' },
      initialDocument,
      initialDraft: { revision: 7, savedAt: '2026-07-02T00:01:00.000Z' },
      initialPageId: 'page-home',
    })).toBe(false);
  });
});

describe('resolveMissingExpectedRevisionDraftSave', () => {
  it('accepts a missing-revision retry only when the latest draft already matches the save payload', () => {
    const current = standardCompositeDocument('about');
    const draft = {
      revision: 12,
      savedAt: '2026-07-02T00:00:00.000Z',
    };

    expect(resolveMissingExpectedRevisionDraftSave({ draft, document: current }, current)).toEqual({
      status: 'accept-saved',
      draft,
      document: current,
    });
  });

  it('turns a missing-revision retry into a conflict when the latest draft diverged', () => {
    const current = standardCompositeDocument('about');
    const localSave = {
      ...current,
      nodes: [
        ...current.nodes,
        { id: 'about-local-copy', kind: 'text' },
      ],
    } as BuilderCanvasDocument;
    const draft = {
      revision: 13,
      savedAt: '2026-07-02T00:01:00.000Z',
    };

    expect(resolveMissingExpectedRevisionDraftSave({ draft, document: current }, localSave)).toEqual({
      status: 'conflict',
      draft,
    });
  });
});

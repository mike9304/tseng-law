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
import type { PublishCheckSuite } from '@/lib/builder/publish-gate/gate-runner';
import { getPublishModalCopy } from './publish-copy';
import type {
  DraftMeta,
  PublishState,
  ScheduledPublishJob,
  ToastTone,
} from './PublishModalTypes';
import { usePublishActions } from './usePublishActions';
import { useScheduledPublishActions } from './useScheduledPublishActions';

const document: BuilderCanvasDocument = {
  version: 1,
  locale: 'en',
  updatedAt: '2026-07-13T00:00:00.000Z',
  updatedBy: 'publish-conflict-test',
  stageWidth: 1280,
  stageHeight: 880,
  nodes: [],
};

const copy = getPublishModalCopy('en');

type PublishActionsFixture = Parameters<typeof usePublishActions>[0] & { open: boolean };

const XHTML_NS = 'http://www.w3.org/1999/xhtml';
const liveRoots = new Set<Root>();
const livePromises = new Set<Promise<unknown>>();

function trackPromise<T>(promise: Promise<T>): Promise<T> {
  livePromises.add(promise);
  void promise.finally(() => {
    livePromises.delete(promise);
  });
  return promise;
}

function ensureDomStub(): { container: object } {
  const g = globalThis as typeof globalThis & {
    Node?: unknown;
    HTMLElement?: new (tag?: string) => {
      nodeType: number;
      nodeName: string;
      tagName: string;
      namespaceURI: string;
      ownerDocument: unknown;
      addEventListener: () => void;
      removeEventListener: () => void;
      appendChild: <T>(child: T) => T;
      removeChild: <T>(child: T) => T;
    };
    HTMLIFrameElement?: unknown;
    document?: unknown;
    window?: typeof globalThis;
    IS_REACT_ACT_ENVIRONMENT?: boolean;
  };

  if (!g.HTMLElement || !g.document) {
    class Node {
      addEventListener() {}
      removeEventListener() {}
      appendChild<T>(child: T): T {
        return child;
      }
      removeChild<T>(child: T): T {
        return child;
      }
    }
    class HTMLElement extends Node {
      nodeType = 1;
      nodeName: string;
      tagName: string;
      namespaceURI = XHTML_NS;
      ownerDocument: unknown = null;
      constructor(tag = 'DIV') {
        super();
        const name = tag.toUpperCase();
        this.nodeName = name;
        this.tagName = name;
      }
    }
    class HTMLIFrameElement extends HTMLElement {
      constructor() {
        super('IFRAME');
      }
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
        const el = tag.toLowerCase() === 'iframe'
          ? new HTMLIFrameElement()
          : new HTMLElement(tag);
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

  const container = new g.HTMLElement!('DIV');
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
  liveRoots.add(root);

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
      if (!liveRoots.has(root)) return;
      await act(async () => {
        root.unmount();
      });
      liveRoots.delete(root);
    },
  };
}

beforeAll(() => {
  ensureDomStub();
});

function draftConflictResponse(): Response {
  return new Response(JSON.stringify({
    ok: false,
    error: 'draft_conflict',
    errorCode: 'draft_conflict',
    errorMessage: 'hostile rawError must not reach the editor',
    rawError: 'draft_conflict storage compare failed',
    storageVersion: 'file-v1:opaque-secret',
    etag: '"opaque-etag"',
    current: {
      revision: 13,
      ETag: '"opaque-etag"',
    },
  }), {
    status: 409,
    headers: {
      'Content-Type': 'application/json',
      ETag: '"opaque-etag"',
    },
  });
}

function assertOnlyStableConflictMessage(
  setPublishError: ReturnType<typeof vi.fn<(message: string | null) => void>>,
  onToast: ReturnType<typeof vi.fn<(message: string, tone: ToastTone) => void>>,
): void {
  const exposedMessages = [
    ...setPublishError.mock.calls.flatMap(([message]) => message === null ? [] : [message]),
    ...onToast.mock.calls.map(([message]) => message),
  ];

  expect(exposedMessages).toEqual([
    copy.draftConflictMessage,
    copy.draftConflictMessage,
  ]);
  const serializedUi = JSON.stringify(exposedMessages);
  expect(serializedUi).not.toContain('rawError');
  expect(serializedUi).not.toContain('errorMessage');
  expect(serializedUi).not.toContain('storageVersion');
  expect(serializedUi).not.toContain('file-v1:opaque-secret');
  expect(serializedUi).not.toContain('ETag');
  expect(serializedUi).not.toContain('opaque-etag');
  expect(serializedUi).not.toContain('hostile');
}

afterEach(async () => {
  await act(async () => {
    for (const root of [...liveRoots]) {
      root.unmount();
    }
    liveRoots.clear();
  });
  await Promise.allSettled([...livePromises]);
  livePromises.clear();
  vi.unstubAllGlobals();
});

describe('publish conflict actions', () => {
  it('stops publish after an exact draft conflict and exposes only the stable conflict copy', async () => {
    const fetchMock = vi.fn<typeof fetch>().mockResolvedValue(draftConflictResponse());
    vi.stubGlobal('fetch', fetchMock);
    const onDraftSaved = vi.fn<(
      draftMeta: DraftMeta,
      savedDocument?: BuilderCanvasDocument,
    ) => void>();
    const onToast = vi.fn<(message: string, tone: ToastTone) => void>();
    const setPublishError = vi.fn<(message: string | null) => void>();
    const setPublishedSlug = vi.fn<(slug: string | null) => void>();
    const setPublishState = vi.fn<(state: PublishState) => void>();
    const setSuite = vi.fn<(suite: PublishCheckSuite | null) => void>();

    const fixture: PublishActionsFixture = {
      activePageId: 'page-1',
      canSubmitPublish: true,
      copy,
      document,
      draftMeta: {
        revision: 12,
        savedAt: '2026-07-13T00:00:00.000Z',
      },
      locale: 'en',
      open: true,
      siteId: 'site-1',
      onDraftSaved,
      onToast,
      setPublishError,
      setPublishedSlug,
      setPublishState,
      setSuite,
    };
    const host = await mountHook(usePublishActions, fixture);

    await act(async () => {
      await trackPromise(host.getResult().handlePublish());
    });

    const requestedUrls = fetchMock.mock.calls.map(([input]) => String(input));
    expect(requestedUrls).toHaveLength(1);
    expect(requestedUrls[0]).toContain('/api/builder/site/pages/page-1/draft?');
    expect(requestedUrls.some((url) => url.includes('/publish?'))).toBe(false);
    expect(setPublishState.mock.calls.map(([state]) => state)).toEqual([
      'publishing',
      'error',
    ]);
    expect(setPublishError.mock.calls.map(([message]) => message)).toEqual([
      null,
      copy.draftConflictMessage,
    ]);
    expect(onDraftSaved).not.toHaveBeenCalled();
    expect(setPublishedSlug).not.toHaveBeenCalled();
    expect(setSuite).not.toHaveBeenCalled();
    expect(setPublishState).not.toHaveBeenCalledWith('success');
    expect(onToast).not.toHaveBeenCalledWith(copy.toastPublishSuccess, 'success');
    assertOnlyStableConflictMessage(setPublishError, onToast);
  });

  it('stops scheduled publish after an exact draft conflict and exposes only stable conflict copy', async () => {
    const fetchMock = vi.fn<typeof fetch>().mockResolvedValue(draftConflictResponse());
    vi.stubGlobal('fetch', fetchMock);
    const onDraftSaved = vi.fn<(
      draftMeta: DraftMeta,
      savedDocument?: BuilderCanvasDocument,
    ) => void>();
    const onToast = vi.fn<(message: string, tone: ToastTone) => void>();
    const setPublishError = vi.fn<(message: string | null) => void>();
    const setPublishState = vi.fn<(state: PublishState) => void>();
    const setScheduleCancelPending = vi.fn<(pending: boolean) => void>();
    const setScheduledAtInput = vi.fn<(value: string) => void>();
    const setScheduledJob = vi.fn<(job: ScheduledPublishJob | null) => void>();
    const setSchedulePending = vi.fn<(pending: boolean) => void>();

    const host = await mountHook(useScheduledPublishActions, {
      activePageId: 'page-1',
      open: true,
      canSubmitPublish: true,
      copy,
      document,
      draftMeta: {
        revision: 12,
        savedAt: '2026-07-13T00:00:00.000Z',
      },
      locale: 'en',
      siteId: 'site-1',
      onDraftSaved,
      onToast,
      scheduledAtInput: '2099-01-01T00:00:00.000Z',
      scheduledJob: null,
      setPublishError,
      setPublishState,
      setScheduleCancelPending,
      setScheduledAtInput,
      setScheduledJob,
      setSchedulePending,
    });

    // The committed scheduled-owner mount clears prior session UI. Observe only
    // the attempted draft save below; retain every conflict assertion unchanged.
    setScheduledJob.mockClear();
    setSchedulePending.mockClear();
    setScheduleCancelPending.mockClear();

    await act(async () => {
      await trackPromise(host.getResult().handleSchedulePublish());
    });

    const requestedUrls = fetchMock.mock.calls.map(([input]) => String(input));
    expect(requestedUrls).toHaveLength(1);
    expect(requestedUrls[0]).toContain('/api/builder/site/pages/page-1/draft?');
    expect(requestedUrls.some((url) => url.includes('/scheduled-publish?'))).toBe(false);
    expect(setSchedulePending.mock.calls.map(([pending]) => pending)).toEqual([true, false]);
    expect(setPublishState.mock.calls.map(([state]) => state)).toEqual(['error']);
    expect(setPublishError.mock.calls.map(([message]) => message)).toEqual([
      null,
      copy.draftConflictMessage,
    ]);
    expect(onDraftSaved).not.toHaveBeenCalled();
    expect(setScheduledJob).not.toHaveBeenCalled();
    expect(setScheduledAtInput).not.toHaveBeenCalled();
    expect(setScheduleCancelPending).not.toHaveBeenCalled();
    expect(setPublishState).not.toHaveBeenCalledWith('ready');
    expect(setPublishState).not.toHaveBeenCalledWith('success');
    expect(onToast).not.toHaveBeenCalledWith(copy.toastPublishScheduleSuccess, 'success');
    assertOnlyStableConflictMessage(setPublishError, onToast);
  });
});

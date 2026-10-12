import { act, useEffect, useState, type ReactNode } from 'react';
import { createRoot } from 'react-dom/client';
import { afterEach, describe, expect, it, vi } from 'vitest';
import AdminBuilderLayout from '../layout';
import { useSandboxSiteState } from '@/components/builder/canvas/hooks/useSandboxSiteState';
import { useBuilderCanvasStore } from '@/lib/builder/canvas/store';
import {
  createDefaultCanvasNodeStyle,
  type BuilderCanvasDocument,
  type BuilderCanvasNode,
} from '@/lib/builder/canvas/types';

vi.mock('next/headers', () => ({ headers: async () => new Headers() }));
vi.mock('next/navigation', () => ({ notFound: () => { throw new Error('NEXT_NOT_FOUND'); } }));
vi.mock('@/lib/builder/columns/auth', () => ({ requireBuilderAdminAuth: () => ({ username: 'editor' }) }));
vi.mock('@/lib/builder/security/resolve-permission', () => ({ resolveUserRole: async () => 'editor' }));
// Navigation chrome is unrelated to document ownership. Keep the real layout's
// Suspense boundary, real editor hook and shared canvas store in this test.
vi.mock('@/components/builder/BuilderAdminBackBar', () => ({ default: () => null }));
vi.mock('@/components/builder/AdminShell', () => ({ default: ({ children }: { children: ReactNode }) => children }));

function deferred() {
  let resolve!: () => void;
  const promise = new Promise<void>((done) => { resolve = done; });
  return { promise, resolve };
}

function documentWithNodes(prefix: string, count: number, updatedAt: string): BuilderCanvasDocument {
  const nodes: BuilderCanvasNode[] = Array.from({ length: count }, (_, index) => ({
    id: `${prefix}-${index}`,
    kind: 'text',
    rect: { x: 0, y: index * 40, width: 300, height: 30 },
    style: createDefaultCanvasNodeStyle(),
    zIndex: index,
    rotation: 0,
    locked: false,
    visible: true,
    content: {
      text: `${prefix} ${index}`, fontSize: 16, color: '#111827',
      fontWeight: 'regular', align: 'left', as: 'p', lineHeight: 1.4, letterSpacing: 0,
    },
  }));
  return { version: 1, locale: 'ko', updatedAt, updatedBy: 'suspense-ownership-test', stageWidth: 1280, stageHeight: 900, nodes };
}

// These probes render no host elements. This is the same minimal React DOM
// surface used by the existing useSandboxSiteState lifecycle tests.
function installReactDom() {
  const document = {
    activeElement: null, addEventListener: vi.fn(), removeEventListener: vi.fn(),
    documentElement: { namespaceURI: 'http://www.w3.org/1999/xhtml' },
    defaultView: globalThis, nodeType: 9,
  };
  const container = {
    addEventListener: vi.fn(), appendChild: vi.fn(), removeChild: vi.fn(),
    removeEventListener: vi.fn(), namespaceURI: 'http://www.w3.org/1999/xhtml',
    nodeName: 'DIV', nodeType: 1, ownerDocument: document, tagName: 'DIV', textContent: '',
  };
  vi.stubGlobal('IS_REACT_ACT_ENVIRONMENT', true);
  vi.stubGlobal('window', globalThis);
  vi.stubGlobal('document', document);
  vi.stubGlobal('HTMLIFrameElement', function HTMLIFrameElement() {});
  vi.stubGlobal('HTMLElement', function HTMLElement() {});
  vi.stubGlobal('Node', function Node() {});
  return container;
}

describe('admin layout editor ownership during descendant suspension', () => {
  afterEach(() => {
    useBuilderCanvasStore.setState(useBuilderCanvasStore.getInitialState(), true);
    vi.useRealTimers();
    vi.unstubAllGlobals();
  });

  it('keeps the active columns document and saves its edits without bootstrapping a second SSR home editor', async () => {
    vi.useFakeTimers({ toFake: ['setTimeout', 'clearTimeout'] });
    const container = installReactDom();
    const root = createRoot(container as unknown as Element);
    const initialHome = documentWithNodes('ssr-home', 3, '2026-10-11T10:00:00.000Z');
    const columns = documentWithNodes('columns', 2, '2026-10-11T10:01:00.000Z');
    const lazyModule = deferred();
    const fallbackHomeRequest = deferred();
    let moduleReady = false;
    let homeGets = 0;
    const writes: Array<{ pageId: string; document: BuilderCanvasDocument }> = [];
    vi.stubGlobal('fetch', vi.fn(async (input: RequestInfo | URL, init?: RequestInit) => {
      const url = new URL(String(input), 'https://builder.test');
      if (url.pathname === '/api/builder/blog/posts') {
        return Response.json({ ok: true, total: 0, posts: [] });
      }
      const pageId = url.pathname.match(/^\/api\/builder\/site\/pages\/([^/]+)\/draft$/)?.[1];
      if (!pageId || !['home', 'columns'].includes(pageId)) throw new Error(`Unexpected request: ${url.pathname}`);
      if (init?.method === 'PUT') {
        const payload = JSON.parse(String(init.body)) as { document: BuilderCanvasDocument };
        writes.push({ pageId, document: payload.document });
        return Response.json({ draft: { revision: 2, savedAt: payload.document.updatedAt }, document: payload.document });
      }
      if (pageId === 'home') {
        homeGets += 1;
        // A duplicate HOME bootstrap must be attributable to the old SSR prop,
        // not to a late GET response. Its request stays pending through the test.
        if (homeGets > 1) await fallbackHomeRequest.promise;
      }
      const document = pageId === 'home' ? initialHome : columns;
      return Response.json({ draft: { revision: 1, savedAt: document.updatedAt }, document });
    }));

    type SiteState = ReturnType<typeof useSandboxSiteState>;
    const hosts = new Map<number, { site: SiteState; suspend: () => void }>();
    const bootstraps: string[] = [];
    let nextHost = 0;
    const initialDraftMeta = { revision: 1, savedAt: initialHome.updatedAt };
    const pushToast = vi.fn();

    function DeferredDescendant() {
      if (!moduleReady) throw lazyModule.promise;
      return null;
    }

    function EditorPage() {
      const [hostId] = useState(() => ++nextHost);
      const [suspending, setSuspending] = useState(false);
      const state = useBuilderCanvasStore();
      const site = useSandboxSiteState({
        initialDocument: initialHome, initialDraftMeta, locale: 'ko',
        siteId: 'suspense-ownership-test', initialPageId: 'home', currentSlug: '',
        canvasDocument: state.document, hasLocalHistory: state.canUndo || state.canRedo,
        mutationBaseDocument: state.mutationBaseDocument, replaceDocument: state.replaceDocument,
        setDraftSaveState: state.setDraftSaveState, pushToast,
      });
      hosts.set(hostId, { site, suspend: () => setSuspending(true) });
      useEffect(() => { bootstraps.push('home'); }, []);
      return suspending ? <DeferredDescendant /> : null;
    }

    try {
      const layout = await AdminBuilderLayout({ children: <EditorPage /> });
      await act(async () => { root.render(layout); });
      expect(bootstraps).toEqual(['home']);
      expect(useBuilderCanvasStore.getState().document?.nodes.map((node) => node.id)).toEqual(['ssr-home-0', 'ssr-home-1', 'ssr-home-2']);

      await act(async () => { await hosts.get(1)!.site.handleSelectPage('columns', 'columns'); });
      expect(hosts.get(1)!.site.activePageId).toBe('columns');
      expect(useBuilderCanvasStore.getState().document?.nodes.map((node) => node.id)).toEqual(['columns-0', 'columns-1']);
      // Navigation may persist the HOME snapshot before changing owners. Those
      // correctly scoped writes are not the suspension regression under test.
      expect(writes.every((write) => write.pageId === 'home')).toBe(true);
      writes.length = 0;

      // Only the already-mounted primary asks for the deferred descendant.
      // If the layout reuses children as fallback, that fresh instance starts
      // from SSR HOME and its real bootstrap effect overwrites the shared store.
      await act(async () => { hosts.get(1)!.suspend(); });
      expect.soft({ bootstraps, homeGets, nodes: useBuilderCanvasStore.getState().document?.nodes.map((node) => node.id) })
        .toEqual({ bootstraps: ['home'], homeGets: 1, nodes: ['columns-0', 'columns-1'] });

      await act(async () => { moduleReady = true; lazyModule.resolve(); });
      await act(async () => { await vi.advanceTimersByTimeAsync(1001); });
      expect.soft(hosts.get(1)!.site.activePageId).toBe('columns');
      expect.soft(useBuilderCanvasStore.getState().document?.nodes.map((node) => node.id)).toEqual(['columns-0', 'columns-1']);
      expect.soft(writes, 'resolving a lazy view must not autosave SSR HOME under the columns page ID').toEqual([]);

      // Exercise normal persistence through the real store mutation + hook
      // autosave path after suspension, rather than only counting mounts.
      await act(async () => {
        useBuilderCanvasStore.getState().updateNode('columns-0', (node) => ({ ...node, rect: { ...node.rect, x: 48 } }));
      });
      await act(async () => { await vi.advanceTimersByTimeAsync(1001); });
      expect(writes.map(({ pageId, document }) => ({ pageId, nodes: document.nodes.map((node) => node.id), x: document.nodes[0].rect.x })))
        .toEqual([{ pageId: 'columns', nodes: ['columns-0', 'columns-1'], x: 48 }]);
    } finally {
      await act(async () => { root.unmount(); });
    }
  });
});

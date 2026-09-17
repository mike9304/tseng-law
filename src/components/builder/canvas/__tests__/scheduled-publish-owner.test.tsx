import { act, createElement, useState, type Dispatch, type SetStateAction, isValidElement, type ReactNode, type ReactElement, type ComponentProps } from 'react';
import { flushSync } from 'react-dom';
import { createRoot, type Root } from 'react-dom/client';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import PublishModal from '../PublishModal';
import type { BuilderCanvasDocument } from '@/lib/builder/canvas/types';
import { PublishModalFooter } from '../PublishModalFooter';
import { PublishModalSchedulePanel } from '../PublishModalSchedulePanel';
import type { PublishModalProps } from '../PublishModalTypes';
const NS = 'http://www.w3.org/1999/xhtml';
const roots = new Set<Root>();
const stable = vi.hoisted(() => ({ noop: () => { }, suite: { results: [], hasBlocker: false, warningCount: 0 } }));
vi.mock('@/lib/builder/canvas/store', () => ({ useBuilderCanvasStore: () => stable.noop }));
vi.mock('../usePublishChecks', async () => { const React = await import('react'); return { usePublishChecks: ({ setPublishState }: Parameters<typeof import('../usePublishChecks').usePublishChecks>[0]) => ({ suite: stable.suite, setSuite: stable.noop, translationSiteWarnings: null, translationReleasePolicy: null, translationReleaseApproval: null, translationSiteWarningsAcknowledged: true, setTranslationSiteWarningsAcknowledged: stable.noop, overrideWarnings: false, setOverrideWarnings: stable.noop, resetPublishChecks: stable.noop, runChecks: React.useCallback(async () => setPublishState('ready'), [setPublishState]) }) }; });
vi.mock('../usePublishDiff', () => ({ usePublishDiff: () => ({ publishDiff: null, resetPublishDiff: stable.noop, loadPublishDiff: stable.noop }) }));
vi.mock('../useTranslationReleaseApprovalRequest', () => ({ useTranslationReleaseApprovalRequest: () => ({ requestState: 'idle', requestApproval: stable.noop }) }));
function ensureDomStub(): {
    container: object;
} {
    const g = globalThis as typeof globalThis & Record<string, unknown>;
    if (!g.HTMLElement || !g.document) {
        class Node {
            addEventListener() { }
            removeEventListener() { }
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
            addEventListener() { },
            removeEventListener() { },
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
async function mountHook<P extends object, R>(hook: (props: P) => R, initialProps: P): Promise<{
    getResult: () => R;
    rerender: (patch: Partial<P>) => Promise<void>;
    setPropsSync: (patch: Partial<P>) => void;
    unmount: () => Promise<void>;
}> {
    const { container } = ensureDomStub();
    let bag: {
        result: R;
        setProps: Dispatch<SetStateAction<P>>;
    } | undefined;
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
    if (!bag)
        throw new Error('HookHarness did not mount');
    return {
        getResult: () => {
            if (!bag)
                throw new Error('HookHarness unmounted');
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
            if (!roots.has(root))
                return;
            await act(async () => {
                root.unmount();
            });
            roots.delete(root);
        },
    };
}
const doc = { version: 1, locale: 'en', updatedAt: '2026-09-09T00:00:00Z', updatedBy: 'synthetic', stageWidth: 1280, stageHeight: 880, nodes: [] } satisfies BuilderCanvasDocument;
function props(): PublishModalProps { return { open: true, document: doc, locale: 'en', siteId: 'site-a', activePageId: 'page-a', draftMeta: { revision: 1, savedAt: '2026-09-09T00:00:00Z' }, onToast: vi.fn(), onDraftSaved: vi.fn(), onClose: vi.fn() }; }
function find(node: ReactNode, type: unknown): ReactElement | null {
    if (Array.isArray(node)) {
        for (const child of node) {
            const found = find(child, type);
            if (found)
                return found;
        }
        return null;
    }
    if (!isValidElement<{
        children?: ReactNode;
    }>(node))
        return null;
    if (node.type === type)
        return node;
    return find(node.props.children, type);
}
const mountModal = (p: PublishModalProps) => mountHook(PublishModal, p);
type ModalHost = Awaited<ReturnType<typeof mountModal>>;
function panel(host: ModalHost): ComponentProps<typeof PublishModalSchedulePanel> {
    const result = find(host.getResult(), PublishModalSchedulePanel);
    if (!result)
        throw new Error('schedule panel not visible');
    return result.props as ComponentProps<typeof PublishModalSchedulePanel>;
}
function footer(host: ModalHost): ComponentProps<typeof PublishModalFooter> {
    const result = find(host.getResult(), PublishModalFooter);
    if (!result)
        throw new Error('footer not visible');
    return result.props as ComponentProps<typeof PublishModalFooter>;
}
let queue: {
    method: string;
    url: string;
    body?: BodyInit | null;
    resolve: (value: Response) => void;
    reject: (error: Error) => void;
}[] = [];
const response = (data: unknown) => new Response(JSON.stringify(data), { status: 200, headers: { 'Content-Type': 'application/json' } });
const draft = () => response({ draft: { revision: 2, savedAt: '2026-09-09T00:00:00Z' } });
const scheduled = () => response({ ok: true, job: { jobId: 'old-job', scheduledAt: '2099-01-01T12:00:00Z', status: 'scheduled' } });
async function ticks() { for (let i = 0; i < 20; i++)
    await Promise.resolve(); }
async function settle(index: number, value: Response) { await act(async () => { queue[index].resolve(value); await ticks(); }); }
async function start(host: ModalHost) { await act(async () => { panel(host).handleSchedulePublish(); await ticks(); }); }
beforeEach(() => { queue = []; vi.stubGlobal('fetch', vi.fn((url, init) => { const method = init?.method ?? 'GET'; if (method === 'GET')
    return Promise.resolve(response({ ok: true, job: null })); return new Promise<Response>((resolve, reject) => queue.push({ method, url: String(url), body: init?.body, resolve, reject })); })); });
afterEach(async () => { await act(async () => { for (const root of roots)
    root.unmount(); }); roots.clear(); vi.unstubAllGlobals(); });
describe('actual PublishModal scheduled owner and GET ordering', () => {
    it('normal acknowledged schedule displays returned job and success', async () => { const p = props(); const h = await mountHook(PublishModal, p); await start(h); expect(queue.map(x => x.method)).toEqual(['PUT']); await settle(0, draft()); expect(queue.map(x => x.method)).toEqual(['PUT', 'POST']); await settle(1, scheduled()); expect(panel(h).scheduledJob?.jobId).toBe('old-job'); expect(p.onToast).toHaveBeenCalledTimes(1); });
    it('close callback invalidates pending draft before follow-up schedule POST', async () => { const h = await mountHook(PublishModal, props()); await start(h); await act(async () => { footer(h).onClose(); }); await settle(0, draft()); expect(queue.filter(x => x.method === 'POST')).toHaveLength(0); });
    for (const [name, patch] of [['page', { activePageId: 'page-b' }], ['site', { siteId: 'site-b' }], ['locale', { locale: 'ko' }]] as const) {
        it(`${name} change suppresses acknowledged OLD schedule UI and toast`, async () => { const p = props(); const h = await mountHook(PublishModal, p); await start(h); await settle(0, draft()); await h.rerender(patch); await settle(1, scheduled()); expect(panel(h).scheduledJob).toBeNull(); expect(p.onToast).not.toHaveBeenCalled(); });
        it(`${name} retained callback cannot begin a new mutation after owner change`, async () => { const h = await mountHook(PublishModal, props()); const old = panel(h).handleSchedulePublish; await h.rerender(patch); await act(async () => { old(); await ticks(); }); expect(queue).toHaveLength(0); });
    }
    it('close and reopen does not accept old acknowledged job', async () => { const h = await mountHook(PublishModal, props()); await start(h); await settle(0, draft()); await h.rerender({ open: false }); await h.rerender({ open: true }); await settle(1, scheduled()); expect(panel(h).scheduledJob).toBeNull(); });
    it('old finally does not clear new request busy state', async () => { const h = await mountHook(PublishModal, props()); await start(h); await settle(0, draft()); await h.rerender({ open: false }); await h.rerender({ open: true }); await start(h); expect(panel(h).schedulePending).toBe(true); await settle(1, scheduled()); expect(panel(h).schedulePending).toBe(true); });
    it('same committed handler double-event starts only one draft write', async () => { const h = await mountHook(PublishModal, props()); const handler = panel(h).handleSchedulePublish; await act(async () => { handler(); handler(); await ticks(); }); expect(queue).toHaveLength(1); });
    it('unmounted old acknowledged response has no toast effects', async () => { const p = props(); const h = await mountHook(PublishModal, p); await start(h); await settle(0, draft()); await h.unmount(); await settle(1, scheduled()); expect(p.onToast).not.toHaveBeenCalled(); });
    it('GET null on changed owner clears previous settled job', async () => { const h = await mountHook(PublishModal, props()); await start(h); await settle(0, draft()); await settle(1, scheduled()); expect(panel(h).scheduledJob?.jobId).toBe('old-job'); await h.rerender({ activePageId: 'page-b' }); expect(panel(h).scheduledJob).toBeNull(); });
    it('older pending GET cannot replace newly acknowledged schedule job', async () => { let resolveGet!: (r: Response) => void; vi.stubGlobal('fetch', vi.fn((url, init) => { const method = init?.method ?? 'GET'; if (method === 'GET')
        return new Promise<Response>(resolve => { resolveGet = resolve; }); return new Promise<Response>((resolve, reject) => queue.push({ method, url: String(url), body: init?.body, resolve, reject })); })); const h = await mountHook(PublishModal, props()); await start(h); await settle(0, draft()); await settle(1, scheduled()); await act(async () => { resolveGet(response({ ok: true, job: { jobId: 'stale-get-job', scheduledAt: '2099-01-01T12:00:00Z', status: 'scheduled' } })); await ticks(); }); expect(panel(h).scheduledJob?.jobId).toBe('old-job'); });
    async function establish(host: ModalHost) { await start(host); await settle(0, draft()); await settle(1, scheduled()); }
    function pendingJson() { let resolve!: (value: unknown) => void; const promise = new Promise<unknown>(res => { resolve = res; }); return { response: { ok: true, status: 200, json: () => promise } as Response, resolve }; }
    it('preserves exact PUT and schedule POST contract', async () => { const h = await mountModal(props()); await act(async () => panel(h).setScheduledAtInput('2099-01-01T12:00:00.000Z')); await start(h); expect(queue[0].url).toBe('/api/builder/site/pages/page-a/draft?locale=en&siteId=site-a'); expect(JSON.parse(String(queue[0].body))).toEqual({ siteId: 'site-a', expectedRevision: 1, document: doc }); await settle(0, draft()); expect(queue[1].url).toBe('/api/builder/site/pages/page-a/scheduled-publish?locale=en&siteId=site-a'); expect(JSON.parse(String(queue[1].body))).toEqual({ siteId: 'site-a', locale: 'en', scheduledAt: '2099-01-01T12:00:00.000Z', expectedDraftRevision: 2 }); });
    for (const key of ['activePageId', 'siteId', 'locale'] as const) {
        it(`${key} A-B-A does not revive retained schedule callback`, async () => { const p = props(); const h = await mountModal(p); const old = panel(h).handleSchedulePublish; await h.rerender({ [key]: key === 'locale' ? 'ko' : 'other' }); await h.rerender({ [key]: p[key] }); await act(async () => { old(); await ticks(); }); expect(queue).toHaveLength(0); });
    }
    it('same committed session rerender keeps retained callback valid', async () => { const h = await mountModal(props()); const old = panel(h).handleSchedulePublish; await h.rerender({ draftMeta: { revision: 2, savedAt: 'new' } }); await act(async () => { old(); await ticks(); }); expect(queue).toHaveLength(1); });
    it('close immediately blocks retained callback before parent updates open', async () => { const h = await mountModal(props()); const old = panel(h).handleSchedulePublish; await act(async () => { footer(h).onClose(); old(); await ticks(); }); expect(queue).toHaveLength(0); });
    it('close-reopen retained callback cannot start a new PUT', async () => { const h = await mountModal(props()); const old = panel(h).handleSchedulePublish; await h.rerender({ open: false }); await h.rerender({ open: true }); await act(async () => { old(); await ticks(); }); expect(queue).toHaveLength(0); });
    it('delayed draft JSON is checked before onDraftSaved and POST', async () => { const p = props(); const h = await mountModal(p); await start(h); const json = pendingJson(); await settle(0, json.response); await h.rerender({ siteId: 'site-b' }); await act(async () => { json.resolve({ draft: { revision: 9, savedAt: 'late' } }); await ticks(); }); expect(p.onDraftSaved).not.toHaveBeenCalled(); expect(queue.map(q => q.method)).toEqual(['PUT']); });
    it('onDraftSaved synchronously changes owner before schedule POST', async () => { const p = props(); const h = await mountModal(p); await h.rerender({ onDraftSaved: () => h.setPropsSync({ siteId: 'site-b' }) }); await start(h); await settle(0, draft()); expect(queue.map(q => q.method)).toEqual(['PUT']); });
    it('delayed schedule JSON cannot install a stale job', async () => { const p = props(); const h = await mountModal(p); await start(h); await settle(0, draft()); const json = pendingJson(); await settle(1, json.response); await h.rerender({ locale: 'ko' }); await act(async () => { json.resolve({ ok: true, job: { jobId: 'late', scheduledAt: '2099-01-01T12:00:00Z', status: 'scheduled' } }); await ticks(); }); expect(panel(h).scheduledJob).toBeNull(); expect(p.onToast).not.toHaveBeenCalled(); });
    it('current DELETE success clears job without replaying any write', async () => { const p = props(); const h = await mountModal(p); await establish(h); await act(async () => { panel(h).handleCancelScheduledPublish(); await ticks(); }); expect(queue.map(q => q.method)).toEqual(['PUT', 'POST', 'DELETE']); expect(queue[2].url).toBe('/api/builder/site/pages/page-a/scheduled-publish?locale=en&siteId=site-a'); await settle(2, response({ ok: true, cancelled: 1 })); expect(panel(h).scheduledJob).toBeNull(); expect(panel(h).scheduleCancelPending).toBe(false); expect(p.onToast).toHaveBeenCalledTimes(2); });
    it('current DELETE failure preserves job and error; does not replay', async () => { const h = await mountModal(props()); await establish(h); await act(async () => { panel(h).handleCancelScheduledPublish(); await ticks(); }); await settle(2, new Response(JSON.stringify({ ok: false, error: 'synthetic cancel failed' }), { status: 500 })); expect(panel(h).scheduledJob?.jobId).toBe('old-job'); expect(panel(h).scheduleCancelPending).toBe(false); expect(footer(h).publishState).toBe('error'); expect(queue).toHaveLength(3); });
    it('one synchronous guard excludes schedule and another cancel during DELETE', async () => { const h = await mountModal(props()); await establish(h); const old = panel(h); await act(async () => { old.handleCancelScheduledPublish(); old.handleCancelScheduledPublish(); old.handleSchedulePublish(); await ticks(); }); expect(queue.map(q => q.method)).toEqual(['PUT', 'POST', 'DELETE']); });
    it('retained cancel cannot DELETE after site A-B-A', async () => { const h = await mountModal(props()); await establish(h); const old = panel(h).handleCancelScheduledPublish; await h.rerender({ siteId: 'site-b' }); await h.rerender({ siteId: 'site-a' }); await act(async () => { old(); await ticks(); }); expect(queue).toHaveLength(2); });
    it('pending DELETE response cannot clear a newer acknowledged job', async () => { const p = props(); const h = await mountModal(p); await establish(h); await act(async () => { panel(h).handleCancelScheduledPublish(); await ticks(); }); await h.rerender({ activePageId: 'page-b' }); await start(h); await settle(3, draft()); await settle(4, response({ ok: true, job: { jobId: 'new-job', scheduledAt: '2099-01-01T12:00:00Z', status: 'scheduled' } })); await settle(2, response({ ok: true, cancelled: 1 })); expect(panel(h).scheduledJob?.jobId).toBe('new-job'); expect(p.onToast).toHaveBeenCalledTimes(2); });
    it('delayed DELETE JSON cannot clear newer cancel busy or emit stale toast', async () => { const p = props(); const h = await mountModal(p); await establish(h); await act(async () => { panel(h).handleCancelScheduledPublish(); await ticks(); }); const json = pendingJson(); await settle(2, json.response); await h.rerender({ open: false }); await h.rerender({ open: true }); await start(h); await settle(3, draft()); await settle(4, scheduled()); await act(async () => { panel(h).handleCancelScheduledPublish(); await ticks(); }); await act(async () => { json.resolve({ ok: true, cancelled: 1 }); await ticks(); }); expect(panel(h).scheduleCancelPending).toBe(true); expect(p.onToast).toHaveBeenCalledTimes(2); });
    it('stale rejected schedule JSON suppresses catch and finally in new owner', async () => { const p = props(); const h = await mountModal(p); await start(h); await settle(0, draft()); let reject!: (e: Error) => void; const promise = new Promise<unknown>((_, r) => { reject = r; }); await settle(1, { ok: true, status: 200, json: () => promise } as Response); await h.rerender({ siteId: 'site-b' }); await start(h); await act(async () => { reject(new Error('synthetic transport')); await ticks(); }); expect(panel(h).schedulePending).toBe(true); expect(p.onToast).not.toHaveBeenCalled(); expect(footer(h).publishState).toBe('ready'); });
    it('current invalid schedule date never writes', async () => { const p = props(); const h = await mountModal(p); await act(async () => panel(h).setScheduledAtInput('invalid')); await start(h); expect(queue).toHaveLength(0); expect(footer(h).publishState).toBe('error'); expect(p.onToast).toHaveBeenCalledTimes(1); });
    it('current GET job remains visible when no mutation intervenes', async () => { vi.stubGlobal('fetch', vi.fn(() => Promise.resolve(scheduled()))); const h = await mountModal(props()); expect(panel(h).scheduledJob?.jobId).toBe('old-job'); });
    it('stale draft network rejection does not mark reopened session failed', async () => { const p = props(); const h = await mountModal(p); await start(h); await h.rerender({ open: false }); await h.rerender({ open: true }); await start(h); await act(async () => { queue[0].reject(new Error('synthetic draft network')); await ticks(); }); expect(panel(h).schedulePending).toBe(true); expect(footer(h).publishState).toBe('ready'); expect(p.onToast).not.toHaveBeenCalled(); });
    it('stale DELETE network rejection cannot clear newer busy or show error', async () => { const p = props(); const h = await mountModal(p); await establish(h); await act(async () => { panel(h).handleCancelScheduledPublish(); await ticks(); }); await h.rerender({ siteId: 'site-b' }); await start(h); await act(async () => { queue[2].reject(new Error('synthetic delete network')); await ticks(); }); expect(panel(h).schedulePending).toBe(true); expect(footer(h).publishState).toBe('ready'); expect(p.onToast).toHaveBeenCalledTimes(1); });
    it('current draft network failure reports error and releases busy without POST', async () => { const p = props(); const h = await mountModal(p); await start(h); await act(async () => { queue[0].reject(new Error('synthetic draft network')); await ticks(); }); expect(queue).toHaveLength(1); expect(panel(h).schedulePending).toBe(false); expect(footer(h).publishState).toBe('error'); expect(p.onToast).toHaveBeenCalledTimes(1); });
});

import { act, isValidElement, StrictMode, type ReactElement, type ReactNode } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { afterEach, expect, it, vi } from 'vitest';
import type { BuilderCmsCollectionDetail, BuilderCmsCollectionSummary, BuilderCmsRecord } from '@/lib/builder/cms-types';
import type { Locale } from '@/lib/locales';

const navigation = vi.hoisted(() => ({ params: '', router: { push: vi.fn(), replace: vi.fn() } }));
vi.mock('next/navigation', () => ({
  usePathname: () => '/en/admin-builder/cms',
  useRouter: () => navigation.router,
  useSearchParams: () => new URLSearchParams(navigation.params),
}));
import ContentManagerClient from '@/components/builder/cms/ContentManagerClient';

type Props = { children?: ReactNode; onClick?: (event: unknown) => void; disabled?: boolean; [key: string]: unknown };
function find(tree: ReactNode, predicate: (element: ReactElement<Props>) => boolean): ReactElement<Props> | undefined {
  if (Array.isArray(tree)) {
    for (const child of tree) { const match = find(child, predicate); if (match) return match; }
  } else if (isValidElement<Props>(tree)) {
    if (predicate(tree)) return tree;
    return find(tree.props.children, predicate);
  }
}
function text(tree: ReactNode): string {
  if (typeof tree === 'string' || typeof tree === 'number') return String(tree);
  if (Array.isArray(tree)) return tree.map(text).join(' ');
  return isValidElement<Props>(tree) ? text(tree.props.children) : '';
}
function deferred<T>() {
  let resolve!: (value: T) => void;
  let reject!: (reason: unknown) => void;
  const promise = new Promise<T>((complete, fail) => { resolve = complete; reject = fail; });
  return { promise, resolve, reject };
}
const reply = (body: unknown, status = 200) => new Response(JSON.stringify(body), { status });
const timestamp = '2026-09-22T00:00:00Z';
const saved = (recordId = 'r1', title = 'Saved title'): BuilderCmsRecord => ({
  recordId, status: 'draft', locale: 'en', fields: { title }, createdAt: timestamp, updatedAt: timestamp,
});
function collection(collectionId = 'custom', records: BuilderCmsRecord[] = []): BuilderCmsCollectionDetail {
  return {
    collectionId, name: `Synthetic ${collectionId}`, slug: collectionId, description: '', localized: false,
    fieldCount: 1, indexCount: 0, recordCount: records.length,
    permissions: { read: ['admin'], create: ['admin'], update: ['admin'], delete: ['admin'] },
    createdAt: timestamp, updatedAt: timestamp,
    fields: [{ fieldId: 'title', key: 'title', label: 'Title', type: 'text', required: false, localized: false, repeated: false, unique: false }],
    indexes: [], records,
  };
}
let mounted: Root | null = null;
afterEach(async () => {
  if (mounted) await act(async () => mounted!.unmount());
  mounted = null;
  navigation.params = '';
  vi.unstubAllGlobals();
});
async function mount(records: BuilderCmsRecord[] = [], strict = false) {
  const documentStub = {
    activeElement: null, addEventListener: vi.fn(), removeEventListener: vi.fn(),
    documentElement: { namespaceURI: 'http://www.w3.org/1999/xhtml' }, nodeType: 9,
  };
  const container = {
    nodeType: 1, nodeName: 'DIV', tagName: 'DIV', namespaceURI: 'http://www.w3.org/1999/xhtml',
    ownerDocument: documentStub, textContent: '', addEventListener: vi.fn(), removeEventListener: vi.fn(),
    appendChild: vi.fn(), removeChild: vi.fn(),
  };
  vi.stubGlobal('IS_REACT_ACT_ENVIRONMENT', true);
  vi.stubGlobal('document', documentStub);
  vi.stubGlobal('window', {
    HTMLIFrameElement: function HTMLIFrameElement() {}, addEventListener: vi.fn(), removeEventListener: vi.fn(),
    localStorage: { getItem: () => null, setItem: vi.fn() }, setTimeout: vi.fn(),
  });
  const custom = collection('custom', records);
  const other = collection('other');
  const summaries: BuilderCmsCollectionSummary[] = [custom, other];
  const post = deferred<Response>();
  const detailRead = deferred<Response>();
  const listRead = deferred<Response>();
  const trace: { url: string; method: string; body: BodyInit | null | undefined }[] = [];
  let detailHandler = (id: string): Response | Promise<Response> => reply({ ok: true, detail: id === 'other' ? other : custom });
  let writeHandler = (): Response | Promise<Response> => post.promise;
  let listHandler = (): Response | Promise<Response> => listRead.promise;
  vi.stubGlobal('fetch', vi.fn<typeof fetch>(async (url, init) => {
    const method = init?.method ?? 'GET';
    trace.push({ url: String(url), method, body: init?.body });
    if (String(url).includes('/site/pages')) return reply({ ok: true, pages: [] });
    if (method === 'POST' || method === 'PATCH') return writeHandler();
    if (String(url).includes('/custom?')) return detailHandler('custom');
    if (String(url).includes('/other?')) return detailHandler('other');
    if (String(url).includes('/collections?')) return listHandler();
    throw Error(`unsupported synthetic request: ${method} ${url}`);
  }));
  let tree: ReactNode;
  let props = { locale: 'en' as Locale, siteId: 'synthetic', initialSourceCollections: [], initialEditableCollections: summaries };
  function Probe() { tree = ContentManagerClient(props); return null; }
  mounted = createRoot(container as unknown as Element);
  const render = () => mounted!.render(strict ? <StrictMode><Probe /></StrictMode> : <Probe />);
  await act(async () => render());
  const button = (label: string) => find(tree, (element) => element.type === 'button' && text(element.props.children) === label)!;
  const open = async (id = 'custom') => {
    await act(async () => find(tree, (element) => element.type === 'button' && text(element.props.children).includes(`Synthetic ${id}`))!.props.onClick!({}));
  };
  await open();
  trace.length = 0;
  detailHandler = () => detailRead.promise;
  return {
    post, detailRead, listRead, trace, custom, other, button, open,
    text: () => text(tree),
    find: (predicate: (element: ReactElement<Props>) => boolean) => find(tree, predicate),
    click: async (label: string) => { await act(async () => button(label).props.onClick!({})); },
    change: async (value: unknown) => {
      await act(async () => (find(tree, (element) => (element.props.field as { key?: string } | undefined)?.key === 'title')!.props.onChange as (value: unknown) => void)(value));
    },
    readWith: (handler: typeof detailHandler) => { detailHandler = handler; },
    writeWith: (handler: typeof writeHandler) => { writeHandler = handler; },
    listWith: (handler: typeof listHandler) => { listHandler = handler; },
    rerender: async (next: Partial<typeof props> = {}) => { props = { ...props, ...next }; await act(async () => render()); },
    unmount: async () => { await act(async () => mounted!.unmount()); mounted = null; },
    writes: () => trace.filter((entry) => entry.method === 'POST' || entry.method === 'PATCH'),
  };
}

it('shows authoritative create and count before a stalled GET; refresh failure retains known success', async () => {
  const ui = await mount();
  await ui.click('Create record');
  await act(async () => ui.post.resolve(reply({ ok: true, record: saved() }, 201)));
  expect(ui.trace.map((entry) => entry.method)).toEqual(['POST', 'GET']);
  expect(ui.button('Create record').props.disabled).toBe(false);
  expect(ui.text()).toContain('Record created.');
  expect(ui.text()).toContain('Saved title');
  expect(text(ui.find((element) => element.type === 'button' && text(element.props.children).includes('Synthetic custom')))).toMatch(/1\s+records/);
  await act(async () => ui.detailRead.resolve(reply({ ok: false, error: 'Synthetic detail refresh failed' }, 500)));
  expect(ui.text()).toContain('Record created.');
  expect(ui.text()).toContain('The record was saved. Collection refresh is unavailable');
  expect(ui.text()).not.toContain('Synthetic detail refresh failed');
});

it('updates without increasing count and retains success while list GET fails', async () => {
  const ui = await mount([saved('r1', 'Old title')]);
  await ui.click('Edit');
  await ui.change('New title');
  await ui.click('Save record');
  await act(async () => ui.post.resolve(reply({ ok: true, record: saved('r1', 'New title'), redirectCreated: true })));
  expect(ui.writes()[0].method).toBe('PATCH');
  expect(ui.text()).toContain('Record updated. 301 redirect created.');
  expect(ui.text()).toContain('New title');
  expect(text(ui.find((element) => element.type === 'button' && text(element.props.children).includes('Synthetic custom')))).toMatch(/1\s+records/);
  await act(async () => ui.detailRead.resolve(reply({ ok: true, detail: collection('custom', [saved('r1', 'New title')]) })));
  expect(ui.trace.map((entry) => entry.method)).toEqual(['PATCH', 'GET', 'GET']);
  expect(ui.button('Save record').props.disabled).toBe(false);
  await act(async () => ui.listRead.resolve(reply({ ok: false }, 500)));
  expect(ui.text()).toContain('Record updated.');
  expect(ui.writes()).toHaveLength(1);
});

it('blocks synchronous duplicate click and keyboard entries, with immutable fields captured at submission', async () => {
  const ui = await mount();
  const mutable = { assetId: 'a1', url: '/old.png', alt: 'old' };
  await ui.change(mutable);
  const click = ui.button('Create record').props.onClick!;
  const keyboard = ui.find((element) => typeof element.props.onKeyDown === 'function' && Boolean(element.props['data-cms-record-editor']))!.props.onKeyDown as (event: unknown) => void;
  await act(async () => {
    click({}); click({});
    keyboard({ metaKey: true, key: 's', preventDefault: vi.fn() });
    mutable.alt = 'changed';
  });
  expect(ui.writes()).toHaveLength(1);
  expect(JSON.parse(String(ui.writes()[0].body))).toEqual({ fields: { title: { assetId: 'a1', url: '/old.png', alt: 'old' } } });
  await act(async () => ui.post.resolve(reply({ ok: true, record: saved() }, 201)));
  await ui.click('Create record');
  expect(ui.writes()).toHaveLength(1);
});

it('does not turn matching observation into write proof; unknown survives reopen until deliberate new attempt', async () => {
  const ui = await mount();
  await ui.click('Create record');
  await act(async () => ui.post.resolve(reply({ ok: false, error: 'Failure after storage' }, 500)));
  expect(ui.text()).toContain('Save outcome is unknown.');
  await ui.click('Create record');
  expect(ui.writes()).toHaveLength(1);
  ui.readWith((id) => reply({ ok: true, detail: collection(id, id === 'custom' ? [saved()] : []) }));
  ui.listWith(() => reply({ ok: true, collections: [], editableCollections: [collection('custom', [saved()]), ui.other] }));
  await ui.open('other');
  await ui.open('custom');
  expect(ui.text()).toContain('Save outcome is unknown.');
  await ui.click('Check records');
  expect(ui.text()).toContain('This does not confirm whether the earlier save succeeded.');
  expect(ui.text()).not.toContain('Record created.');
  expect(ui.writes()).toHaveLength(1);
  await ui.click('Start a new save attempt (may duplicate)');
  ui.writeWith(() => reply({ ok: true, record: saved('r2') }, 201));
  await ui.click('Create record');
  expect(ui.writes()).toHaveLength(2);
  expect(ui.text()).toContain('Record created.');
});

it.each(['malformed', 'parse', 'transport'])('treats %s write outcome as unknown, not a pre-write rejection', async (kind) => {
  const ui = await mount();
  await ui.click('Create record');
  await act(async () => {
    if (kind === 'transport') ui.post.reject(new Error('disconnected'));
    else ui.post.resolve(kind === 'parse' ? new Response('{', { status: 201 }) : reply({ ok: true, record: { recordId: 'bad' } }, 201));
  });
  expect(ui.text()).toContain('Save outcome is unknown.');
  expect(ui.text()).not.toContain('Record created.');
  expect(ui.trace).toHaveLength(1);
});

it('offers an explicit new attempt after a verified pre-write validation rejection', async () => {
  const ui = await mount();
  await ui.click('Create record');
  await act(async () => ui.post.resolve(reply({ ok: false, error: 'Invalid input.', issues: ['Title is required.'] }, 400)));
  expect(ui.text()).toContain('Record was not saved: Title is required.');
  expect(ui.text()).not.toContain('Save outcome is unknown.');
  await ui.click('Try a new save attempt');
  ui.writeWith(() => reply({ ok: true, record: saved() }, 201));
  await ui.click('Create record');
  expect(ui.writes()).toHaveLength(2);
  expect(ui.text()).toContain('Record created.');
});

it('drops a save completing after collection ABA and refuses a retained editor handler', async () => {
  const ui = await mount();
  const staleClick = ui.button('Create record').props.onClick!;
  await ui.click('Create record');
  ui.readWith((id) => reply({ ok: true, detail: collection(id) }));
  await ui.open('other');
  await ui.open('custom');
  await act(async () => { staleClick({}); ui.post.resolve(reply({ ok: true, record: saved() }, 201)); });
  expect(ui.writes()).toHaveLength(1);
  expect(ui.text()).not.toContain('Record created.');
  expect(ui.text()).not.toContain('Saved title');
});

it.each([{ siteId: 'second-site' }, { locale: 'ko' as Locale }])('drops response JSON completing across owner replacement: %j', async (next) => {
  const ui = await mount();
  const json = deferred<unknown>();
  ui.writeWith(() => ({ ok: true, status: 201, json: () => json.promise }) as Response);
  const staleClick = ui.button('Create record').props.onClick!;
  await ui.click('Create record');
  await ui.rerender(next);
  ui.readWith((id) => reply({ ok: true, detail: collection(id) }));
  await ui.open();
  await act(async () => { staleClick({}); json.resolve({ ok: true, record: saved() }); });
  expect(ui.writes()).toHaveLength(1);
  expect(ui.text()).not.toContain('Record created.');
  expect(ui.text()).not.toContain('Saved title');
});

it('drops old refresh after another edit, preserving the next pending save and its fields', async () => {
  const ui = await mount([saved('r1', 'Old title')]);
  await ui.click('Edit');
  await ui.click('Save record');
  await act(async () => ui.post.resolve(reply({ ok: true, record: saved('r1', 'First saved') })));
  await ui.change('Next draft');
  const next = deferred<Response>();
  ui.writeWith(() => next.promise);
  await ui.click('Save record');
  await act(async () => ui.detailRead.resolve(reply({ ok: true, detail: collection('custom', [saved('r1', 'Stale refresh')]) })));
  await act(async () => ui.listRead.resolve(reply({ ok: true, collections: [], editableCollections: [ui.custom, ui.other] })));
  expect(ui.button('Save record').props.disabled).toBe(true);
  expect(ui.text()).not.toContain('Stale refresh');
  expect(ui.find((element) => (element.props.field as { key?: string } | undefined)?.key === 'title')!.props.value).toBe('Next draft');
  await act(async () => next.resolve(reply({ ok: true, record: saved('r1', 'Next saved') })));
  expect(ui.text()).toContain('Next saved');
});

it('preserves ACK row/count against a stale successful detail/list snapshot', async () => {
  const ui = await mount();
  await ui.click('Create record');
  await act(async () => ui.post.resolve(reply({ ok: true, record: saved() }, 201)));
  await act(async () => ui.detailRead.resolve(reply({ ok: true, detail: ui.custom })));
  await act(async () => ui.listRead.resolve(reply({ ok: true, collections: [], editableCollections: [ui.custom, ui.other] })));
  expect(ui.text()).toContain('Saved title');
  expect(text(ui.find((element) => element.type === 'button' && text(element.props.children).includes('Synthetic custom')))).toMatch(/1\s+records/);
});

it('remains usable after StrictMode effect replay and suppresses unmounted completion', async () => {
  const ui = await mount([], true);
  await ui.click('Create record');
  expect(ui.writes()).toHaveLength(1);
  await ui.unmount();
  await act(async () => ui.post.resolve(reply({ ok: true, record: saved() }, 201)));
  expect(ui.trace.map((entry) => entry.method)).toEqual(['POST']);
});

it('keeps the existing sort and editor values while an authoritative ACK updates derived rows', async () => {
  const ui = await mount([saved('older', 'Older row')]);
  await ui.change('Unsaved input');
  await ui.click('Create record');
  const newer = { ...saved('newer', 'Server normalized'), updatedAt: '2026-09-22T01:00:00Z' };
  await act(async () => ui.post.resolve(reply({ ok: true, record: newer }, 201)));
  const grid = ui.find((element) => Boolean(element.props['data-cms-record-grid']))!;
  const gridText = text(grid);
  expect(gridText.indexOf('Server normalized')).toBeLessThan(gridText.indexOf('Older row'));
  expect(ui.find((element) => (element.props.field as { key?: string } | undefined)?.key === 'title')!.props.value).toBe('Unsaved input');
  expect(text(ui.find((element) => element.type === 'button' && text(element.props.children).includes('Synthetic custom')))).toMatch(/2\s+records/);
});

it('invalidates an old edit handler through cancel and reopen of the same record', async () => {
  const ui = await mount([saved()]);
  await ui.click('Edit');
  const oldSave = ui.button('Save record').props.onClick!;
  const oldCancel = ui.button('Cancel edit').props.onClick!;
  await ui.click('Cancel edit');
  await ui.click('Edit');
  await ui.change('Reopened draft');
  await act(async () => { oldSave({}); oldCancel({}); });
  expect(ui.writes()).toHaveLength(0);
  expect(ui.button('Save record')).toBeDefined();
  expect(ui.find((element) => (element.props.field as { key?: string } | undefined)?.key === 'title')!.props.value).toBe('Reopened draft');
  await ui.click('Save record');
  expect(ui.writes()).toHaveLength(1);
});

it('accepts the authoring zh-hant locale in a verified saved row', async () => {
  const ui = await mount();
  await ui.click('Create record');
  await act(async () => ui.post.resolve(reply({ ok: true, record: { ...saved(), locale: 'zh-hant' } }, 201)));
  expect(ui.text()).toContain('Record created.');
});

it('loads the destination draft when query navigation opens the same record ID in another collection', async () => {
  const ui = await mount([saved('r1', 'Custom draft')]);
  await ui.click('Edit');
  const oldSave = ui.button('Save record').props.onClick!;
  ui.readWith((id) => reply({ ok: true, detail: collection(id, [saved('r1', id === 'other' ? 'Other draft' : 'Custom draft')]) }));
  navigation.params = 'collectionId=other&recordId=r1';
  await ui.rerender();
  expect(ui.find((element) => (element.props.field as { key?: string } | undefined)?.key === 'title')!.props.value).toBe('Other draft');
  await act(async () => oldSave({}));
  expect(ui.writes()).toHaveLength(0);
  await ui.click('Save record');
  expect(ui.writes()).toHaveLength(1);
  expect(ui.writes()[0].url).toContain('/other/records/r1?');
  expect(JSON.parse(String(ui.writes()[0].body))).toEqual({ fields: { title: 'Other draft' } });
});

it('keeps an updated ACK row and matching count when a stale refresh omits that row', async () => {
  const ui = await mount([saved()]);
  await ui.click('Edit');
  await ui.click('Save record');
  await act(async () => ui.post.resolve(reply({ ok: true, record: saved('r1', 'Updated row') })));
  await act(async () => ui.detailRead.resolve(reply({ ok: true, detail: collection() })));
  await act(async () => ui.listRead.resolve(reply({ ok: true, collections: [], editableCollections: [collection(), ui.other] })));
  expect(ui.text()).toContain('Updated row');
  expect(text(ui.find((element) => element.type === 'button' && text(element.props.children).includes('Synthetic custom')))).toMatch(/1\s+records/);
});

import { act, isValidElement, StrictMode, type ReactElement, type ReactNode } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { afterEach, expect, it, vi } from 'vitest';
import SeoDashboardView from '../SeoDashboardView';
import type { BuilderSeoOverview } from '@/lib/builder/seo/overview';

// Real React hook/effect lifecycle and actual native mutation core. The host is
// deliberately inert: these tests prove state/handler contracts, not DOM hit testing.
type Props = {
  children?: ReactNode;
  onClick?: () => void;
  onChange?: (event: { target: { value: string; checked: boolean } }) => void;
  disabled?: boolean;
  value?: unknown;
  checked?: boolean;
  [key: string]: unknown;
};
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
function overview(name = 'Original business'): BuilderSeoOverview {
  return {
    checklistSettings: { businessName: name, keywords: ['law'], serviceMode: 'both' },
    checklist: [{ id: 'business', label: 'Business audit', status: 'done', detail: name }],
    pages: ['one', 'two'].map((id) => ({
      pageId: id, title: `Page ${id}`, slug: id, publicPath: `/en/${id}`, published: true,
      indexable: true, issueCounts: { blockers: 0, warnings: 0, infos: 0 }, score: 100,
      h1Count: 1, imageCount: 0, imagesMissingAlt: 0, keywordHits: [], issues: [], assistantTasks: [],
    })),
    totals: { pages: 2, publishedPages: 2, indexablePages: 2, blockers: 0, warnings: 0, averageScore: 100 },
  };
}
const settings = () => ({
  ok: true,
  defaults: { patterns: { titleTemplate: 'Persisted {{pageTitle}}' }, twitterCard: 'summary', noIndex: true },
  robotsTxt: 'User-agent: *\nDisallow: /private',
  preview: [{ pageId: 'one', title: 'Persisted preview', description: 'Preview description', publicPath: '/en/one' }],
});
let mounted: Root | null = null;
afterEach(async () => {
  if (mounted) await act(async () => mounted!.unmount());
  mounted = null;
  vi.unstubAllGlobals();
});
async function mount(options: { settings?: () => Response | Promise<Response>; strict?: boolean } = {}) {
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
  vi.stubGlobal('window', { HTMLIFrameElement: function HTMLIFrameElement() {} });
  const post = deferred<Response>();
  const refresh = deferred<Response>();
  const trace: { url: string; method: string; body: BodyInit | null | undefined }[] = [];
  let writeHandler = () => post.promise;
  let readHandler = options.settings ?? (() => reply(settings()));
  vi.stubGlobal('fetch', vi.fn<typeof fetch>(async (url, init) => {
    const method = init?.method ?? 'GET';
    trace.push({ url: String(url), method, body: init?.body });
    if (method === 'PATCH') return writeHandler();
    if (String(url).includes('/seo-settings?')) return readHandler();
    if (String(url).includes('/seo-overview?')) return refresh.promise;
    throw Error(`Unsupported request: ${method} ${url}`);
  }));
  let tree: ReactNode;
  let props = { locale: 'en', initialOverview: overview() };
  function Probe() { tree = SeoDashboardView(props); return null; }
  mounted = createRoot(container as unknown as Element);
  const render = () => mounted!.render(options.strict ? <StrictMode><Probe /></StrictMode> : <Probe />);
  await act(async () => render());
  const button = (label: string) => find(tree, (element) => element.type === 'button' && text(element.props.children) === label)!;
  const field = (label: string) => {
    const holder = find(tree, (element) => element.type === 'label' && text(element.props.children).trim() === label);
    return find(holder, (element) => ['input', 'select', 'textarea'].includes(String(element.type)))
      ?? find(tree, (element) => element.props['aria-label'] === label)!;
  };
  const page = (id: string) => find(find(tree, (element) => element.type === 'tr' && text(element).includes(`Page ${id}`)), (element) => element.type === 'input')!;
  return {
    post, refresh, trace, button, field, page,
    text: () => text(tree),
    click: async (label: string) => { await act(async () => { button(label).props.onClick!(); }); },
    change: async (label: string, value: string) => { await act(async () => { field(label).props.onChange!({ target: { value, checked: false } }); }); },
    select: async (id: string, checked = true) => { await act(async () => { page(id).props.onChange!({ target: { value: '', checked } }); }); },
    readWith: (handler: typeof readHandler) => { readHandler = handler; },
    writeWith: (handler: typeof writeHandler) => { writeHandler = handler; },
    rerender: async (locale: string, name = 'Other locale') => {
      props = { locale, initialOverview: overview(name) };
      await act(async () => render());
    },
    unmount: async () => { await act(async () => mounted!.unmount()); mounted = null; },
    writes: () => trace.filter((entry) => entry.method === 'PATCH'),
    refreshes: () => trace.filter((entry) => entry.url.includes('/seo-overview?')),
  };
}

it('acknowledges checklist before held overview GET and keeps success when refresh rejects', async () => {
  const ui = await mount();
  await ui.change('Business name', 'Submitted business');
  await ui.change('Keywords', ' law, help, , advice ');
  await ui.click('Save');
  expect(JSON.parse(String(ui.writes()[0].body))).toEqual({ businessName: 'Submitted business', keywords: ['law', 'help', 'advice'], serviceMode: 'both' });
  await act(async () => ui.post.resolve(reply({ ok: true, checklist: { businessName: 'Submitted business' } })));
  expect(ui.text()).toContain('Saved');
  expect(ui.text()).not.toContain('Saving checklist...');
  expect(ui.button('Save').props.disabled).toBe(false);
  expect(ui.refreshes()).toHaveLength(1);
  await act(async () => ui.refresh.reject(new Error('Offline')));
  expect(ui.text()).toContain('Saved');
  expect(ui.text()).toContain('Overview refresh failed');
  expect(ui.text()).not.toContain('Checklist save failed');
  expect(ui.writes()).toHaveLength(1);
});

it.each(['defaults', 'robots'] as const)('blocks %s handlers while settings are held, then submits hydrated values', async (action) => {
  const initial = deferred<Response>();
  const ui = await mount({ settings: () => initial.promise });
  await ui.click(action === 'defaults' ? 'SEO Settings' : 'Tools');
  const label = action === 'defaults' ? 'Save defaults' : 'Save robots';
  const retained = ui.button(label).props.onClick!;
  expect(ui.button(label).props.disabled).toBe(true);
  expect(ui.field(action === 'defaults' ? 'Title tag pattern' : 'Custom robots.txt').props.disabled).toBe(true);
  await act(async () => { retained(); });
  expect(ui.writes()).toHaveLength(0);
  await act(async () => initial.resolve(reply(settings())));
  expect(ui.button(label).props.disabled).toBe(false);
  await act(async () => { retained(); });
  expect(ui.writes()).toHaveLength(0);
  await ui.click(label);
  expect(JSON.parse(String(ui.writes()[0].body))).toEqual(action === 'defaults' ? settings().defaults : { robotsTxt: settings().robotsTxt });
});

it.each(['network', '500', 'malformed', 'missing-fields'] as const)('keeps defaults and robots blocked after settings %s failure', async (failure) => {
  const read = () => failure === 'network' ? Promise.reject(new Error('Offline'))
    : failure === '500' ? reply({ ok: false }, 500)
      : failure === 'malformed' ? new Response('{broken') : reply({ ok: true });
  const ui = await mount({ settings: read });
  expect(ui.text()).toContain('SEO settings could not be loaded');
  for (const [tab, label] of [['SEO Settings', 'Save defaults'], ['Tools', 'Save robots']]) {
    await ui.click(tab);
    expect(ui.button(label).props.disabled).toBe(true);
    await ui.click(label);
  }
  expect(ui.writes()).toHaveLength(0);
  expect(ui.trace.filter((entry) => entry.method === 'GET')).toHaveLength(1);
});

it('confirms defaults immediately, preserves later edits and keeps the submitted snapshot immutable', async () => {
  const ui = await mount();
  await ui.click('SEO Settings');
  await ui.change('Title tag pattern', 'Submitted pattern');
  await ui.click('Save defaults');
  await ui.change('Title tag pattern', 'Newer unsaved pattern');
  await act(async () => ui.post.resolve(reply({ ...settings(), defaults: { patterns: { titleTemplate: 'Server normalized pattern' } } })));
  expect(ui.text()).toContain('SEO settings saved');
  expect(ui.field('Title tag pattern').props.value).toBe('Newer unsaved pattern');
  expect(JSON.parse(String(ui.writes()[0].body)).patterns.titleTemplate).toBe('Submitted pattern');
  expect(ui.button('Save defaults').props.disabled).toBe(false);
  await act(async () => ui.refresh.resolve(reply({ ok: true, overview: overview('Refreshed audit') })));
  expect(ui.field('Title tag pattern').props.value).toBe('Newer unsaved pattern');
  const next = deferred<Response>();
  ui.writeWith(() => next.promise);
  await ui.click('Save defaults');
  expect(ui.writes()).toHaveLength(2);
  expect(JSON.parse(String(ui.writes()[1].body)).patterns.titleTemplate).toBe('Newer unsaved pattern');
});

it('accepts server normalization when defaults have no newer edits', async () => {
  const ui = await mount();
  await ui.click('SEO Settings');
  await ui.click('Save defaults');
  await act(async () => ui.post.resolve(reply({ ...settings(), defaults: { patterns: { titleTemplate: 'Normalized' } } })));
  expect(ui.field('Title tag pattern').props.value).toBe('Normalized');
  expect(ui.text()).toContain('SEO settings saved');
});

it('preserves robots edits made after submit and shows the confirmed outcome', async () => {
  const ui = await mount();
  await ui.click('Tools');
  await ui.change('Custom robots.txt', 'Submitted rules');
  await ui.click('Save robots');
  await ui.change('Custom robots.txt', 'Newer rules');
  await act(async () => ui.post.resolve(reply({ ...settings(), robotsTxt: 'Submitted rules' })));
  expect(ui.text()).toContain('Robots.txt saved');
  expect(ui.field('Custom robots.txt').props.value).toBe('Newer rules');
  expect(JSON.parse(String(ui.writes()[0].body))).toEqual({ robotsTxt: 'Submitted rules' });
  const next = deferred<Response>();
  ui.writeWith(() => next.promise);
  await ui.click('Save robots');
  expect(ui.writes()).toHaveLength(2);
  expect(JSON.parse(String(ui.writes()[1].body))).toEqual({ robotsTxt: 'Newer rules' });
});

it.each(['Allow indexing', 'Block indexing', 'Reset selected'])('bulk action %s sends selected IDs and retains newer selection', async (action) => {
  const ui = await mount();
  await ui.click('Edit by Page');
  await ui.select('one');
  await ui.click(action);
  await ui.select('two');
  const body = JSON.parse(String(ui.writes()[0].body));
  expect(body).toEqual({ pageIds: ['one'], resetFields: ['title', 'description'], ...(action === 'Reset selected' ? {} : { setIndexable: action === 'Allow indexing' }) });
  await act(async () => ui.post.resolve(reply({ ok: true, updated: 1, overview: overview('Bulk acknowledged') })));
  expect(ui.text()).toContain('Bulk edit saved');
  expect(ui.page('two').props.checked).toBe(true);
  expect(ui.button(action).props.disabled).toBe(false);
});

it('clears submitted selection on bulk ACK when there is no newer selection', async () => {
  const ui = await mount();
  await ui.click('Edit by Page');
  await ui.select('one');
  await ui.click('Reset selected');
  await act(async () => ui.post.resolve(reply({ ok: true, updated: 1, overview: overview() })));
  expect(ui.page('one').props.checked).toBe(false);
});

it('rejects same-turn duplicate handlers and blocks another action while the write is pending', async () => {
  const ui = await mount();
  const retained = ui.button('Save').props.onClick!;
  await act(async () => { retained(); retained(); });
  expect(ui.writes()).toHaveLength(1);
  await ui.click('Tools');
  expect(ui.button('Save robots').props.disabled).toBe(true);
  await ui.click('Save robots');
  expect(ui.writes()).toHaveLength(1);
  await act(async () => ui.post.resolve(reply({ ok: true })));
  await act(async () => { retained(); });
  expect(ui.writes()).toHaveLength(1);
});

it.each([
  ['network', () => Promise.reject(new Error('Disconnected'))],
  ['500-after-write', () => Promise.resolve(reply({ ok: false, error: 'Post-write failure' }, 500))],
  ['malformed-JSON', () => Promise.resolve(new Response('{broken'))],
  ['empty-2xx', () => Promise.resolve(reply({}))],
  ['false-2xx', () => Promise.resolve(reply({ ok: false }))],
  ['unstructured-403', () => Promise.resolve(reply({ error: 'Blocked' }, 403))],
] as const)('shows unknown mutation outcome for %s, without claiming unsaved or retrying', async (_name, write) => {
  const ui = await mount();
  ui.writeWith(write);
  await ui.click('Save');
  expect(ui.text()).toContain('Save outcome could not be confirmed');
  expect(ui.text()).not.toContain('Checklist save failed');
  expect(ui.text()).not.toContain('Saving checklist...');
  expect(ui.button('Save').props.disabled).toBe(false);
  expect(ui.writes()).toHaveLength(1);
  expect(ui.refreshes()).toHaveLength(0);
});

it.each([400, 401, 403])('classifies structured %i as a rejected write', async (status) => {
  const ui = await mount();
  ui.writeWith(async () => reply({ ok: false, error: 'Rejected before write' }, status));
  await ui.click('Save');
  expect(ui.text()).toContain('Checklist save failed');
  expect(ui.text()).not.toContain('Save outcome could not be confirmed');
  expect(ui.button('Save').props.disabled).toBe(false);
  expect(ui.refreshes()).toHaveLength(0);
});

it('retained handlers cannot submit stale drafts after an edit', async () => {
  const ui = await mount();
  const retained = ui.button('Save').props.onClick!;
  await ui.change('Business name', 'New draft');
  await act(async () => { retained(); });
  expect(ui.writes()).toHaveLength(0);
  await ui.click('Save');
  expect(JSON.parse(String(ui.writes()[0].body)).businessName).toBe('New draft');
});

it('locale transition rejects retained handlers and old mutation completion, including returning to the same locale', async () => {
  const ui = await mount();
  const retained = ui.button('Save').props.onClick!;
  await ui.click('Save');
  await ui.rerender('ko');
  await ui.rerender('en', 'Returned owner');
  await act(async () => { retained(); ui.post.resolve(reply({ ok: true })); });
  expect(ui.field('Business name').props.value).toBe('Returned owner');
  expect(ui.text()).not.toContain('Saved');
  expect(ui.writes()).toHaveLength(1);
  expect(ui.refreshes()).toHaveLength(0);
});

it('locale transition drops old settings response and holds new owner readiness', async () => {
  const old = deferred<Response>();
  const current = deferred<Response>();
  const ui = await mount({ settings: () => old.promise });
  ui.readWith(() => current.promise);
  await ui.rerender('ko');
  await act(async () => old.resolve(reply(settings())));
  await ui.click('SEO 설정');
  expect(ui.button('기본값 저장').props.disabled).toBe(true);
  await act(async () => current.resolve(reply({ ...settings(), defaults: { patterns: { titleTemplate: '한국어 패턴' } } })));
  expect(ui.field('제목 태그 패턴').props.value).toBe('한국어 패턴');
  expect(ui.button('기본값 저장').props.disabled).toBe(false);
});

it('unmount suppresses completion refresh and invalidates retained submission handlers', async () => {
  const ui = await mount();
  const retained = ui.button('Save').props.onClick!;
  await ui.click('Save');
  await ui.unmount();
  await act(async () => { retained(); ui.post.resolve(reply({ ok: true })); });
  expect(ui.writes()).toHaveLength(1);
  expect(ui.refreshes()).toHaveLength(0);
});

it('StrictMode effect replay leaves a live controller with exactly one admitted write', async () => {
  const ui = await mount({ strict: true });
  await ui.click('Save');
  await act(async () => ui.post.resolve(reply({ ok: true })));
  expect(ui.writes()).toHaveLength(1);
  expect(ui.text()).toContain('Saved');
});

it('a later acknowledged write prevents an older overview refresh from replacing current audit', async () => {
  const ui = await mount();
  await ui.click('Save');
  await act(async () => ui.post.resolve(reply({ ok: true })));
  await ui.click('Edit by Page');
  await ui.select('one');
  ui.writeWith(async () => reply({ ok: true, updated: 1, overview: overview('Latest bulk audit') }));
  await ui.click('Reset selected');
  await act(async () => ui.refresh.resolve(reply({ ok: true, overview: overview('Stale audit') })));
  await ui.click('SEO Setup Checklist');
  expect(ui.text()).toContain('Latest bulk audit');
  expect(ui.text()).not.toContain('Stale audit');
});

it('keeps checklist usable while settings are held and preserves newer edits through both late reads', async () => {
  const initial = deferred<Response>();
  const ui = await mount({ settings: () => initial.promise });
  expect(ui.button('Save').props.disabled).toBe(false);
  await ui.click('Save');
  await ui.change('Business name', 'Newer checklist draft');
  await act(async () => ui.post.resolve(reply({ ok: true })));
  expect(ui.text()).toContain('Saved');
  expect(ui.text()).toContain('Your newer edits are not saved yet');
  expect(ui.button('Save').props.disabled).toBe(false);
  await act(async () => {
    initial.resolve(reply(settings()));
    ui.refresh.resolve(reply({ ok: true, overview: overview('Older saved business') }));
  });
  expect(ui.field('Business name').props.value).toBe('Newer checklist draft');
  const next = deferred<Response>();
  ui.writeWith(() => next.promise);
  await ui.click('Save');
  expect(ui.writes()).toHaveLength(2);
  expect(JSON.parse(String(ui.writes()[1].body)).businessName).toBe('Newer checklist draft');
});

it('bulk save remains usable when settings fail', async () => {
  const ui = await mount({ settings: () => reply({ ok: false }, 500) });
  await ui.click('Edit by Page');
  await ui.select('one');
  expect(ui.button('Allow indexing').props.disabled).toBe(false);
  await ui.click('Allow indexing');
  await act(async () => ui.post.resolve(reply({ ok: true, updated: 1, overview: overview() })));
  expect(ui.text()).toContain('Bulk edit saved');
  expect(ui.text()).toContain('SEO settings could not be loaded');
});

it.each([
  ['SEO Settings', 'Save defaults', 'SEO settings saved'],
  ['Tools', 'Save robots', 'Robots.txt saved'],
  ['Edit by Page', 'Reset selected', 'Bulk edit saved'],
])('network failure in %s settles unknown without refresh or retry', async (tab, button, success) => {
  const ui = await mount();
  await ui.click(tab);
  if (tab === 'Edit by Page') await ui.select('one');
  ui.writeWith(async () => { throw new Error('Connection lost after dispatch'); });
  await ui.click(button);
  expect(ui.text()).toContain('Save outcome could not be confirmed');
  expect(ui.text()).not.toContain(success);
  expect(ui.button(button).props.disabled).toBe(false);
  expect(ui.writes()).toHaveLength(1);
  expect(ui.refreshes()).toHaveLength(0);
});

it.each(['non-2xx', 'malformed-json', 'malformed-overview'] as const)('retains confirmed ACK when overview returns %s', async (failure) => {
  const ui = await mount();
  await ui.click('Save');
  await act(async () => ui.post.resolve(reply({ ok: true })));
  await act(async () => ui.refresh.resolve(failure === 'non-2xx' ? reply({ ok: false }, 500)
    : failure === 'malformed-json' ? new Response('{broken') : reply({ ok: true, overview: { pages: [] } })));
  expect(ui.text()).toContain('Saved');
  expect(ui.text()).toContain('Overview refresh failed');
  expect(ui.text()).toContain('Original business');
  expect(ui.button('Save').props.disabled).toBe(false);
  expect(ui.writes()).toHaveLength(1);
});

it('locale transition suppresses a previously started overview refresh', async () => {
  const ui = await mount();
  await ui.click('Save');
  await act(async () => ui.post.resolve(reply({ ok: true })));
  await ui.rerender('ko', 'Current owner audit');
  await act(async () => ui.refresh.resolve(reply({ ok: true, overview: overview('Obsolete owner audit') })));
  expect(ui.text()).toContain('Current owner audit');
  expect(ui.text()).not.toContain('Obsolete owner audit');
  expect(ui.text()).not.toContain('Saved');
});

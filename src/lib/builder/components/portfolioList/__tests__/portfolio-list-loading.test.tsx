import { act, type ComponentProps, type ReactNode } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { renderToStaticMarkup } from 'react-dom/server';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import PortfolioList from '../Element';
import { getPortfolioListCopy } from '../portfolio-list-copy';

type Props = ComponentProps<typeof PortfolioList>;
const roots = new Set<Root>();
const fetchMock = vi.fn<typeof fetch>();
const node = {
  kind: 'portfolio-list',
  content: { layout: 'cards', limit: 2, category: '', featuredOnly: false,
    showSummary: true, showDate: true, showCategoryFilter: true, columns: 2, sortBy: 'order-asc' },
} as Props['node'];

function deferred<T>() {
  let resolve!: (value: T) => void;
  let reject!: (reason: Error) => void;
  const promise = new Promise<T>((yes, no) => { resolve = yes; reject = no; });
  return { promise, resolve, reject };
}
function response(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), { status, headers: { 'content-type': 'application/json' } });
}

// Actual ReactDOM lifecycle/hooks/setState; no host child mounting or browser
// hit-testing. Probe captures the real component's returned tree for SSR inspection.
async function mount(overrides: Partial<Props> = {}) {
  const document = { activeElement: null, addEventListener: vi.fn(), removeEventListener: vi.fn(),
    documentElement: { namespaceURI: 'http://www.w3.org/1999/xhtml' }, nodeType: 9 };
  const container = { addEventListener: vi.fn(), removeEventListener: vi.fn(), appendChild: vi.fn(), removeChild: vi.fn(),
    namespaceURI: 'http://www.w3.org/1999/xhtml', nodeName: 'DIV', nodeType: 1,
    ownerDocument: document, tagName: 'DIV', textContent: '' };
  vi.stubGlobal('IS_REACT_ACT_ENVIRONMENT', true);
  vi.stubGlobal('window', { HTMLIFrameElement: function HTMLIFrameElement() {} });
  vi.stubGlobal('document', document);
  let props: Props = { node, mode: 'published', locale: 'en', ...overrides };
  let tree: ReactNode;
  let renders = 0;
  function Probe() { renders++; tree = PortfolioList(props); return null; }
  const root = createRoot(container as unknown as Element);
  roots.add(root);
  const render = async () => { await act(async () => root.render(<Probe />)); };
  await render();
  return {
    html: () => renderToStaticMarkup(tree),
    renders: () => renders,
    update: async (next: Partial<Props>) => { props = { ...props, ...next }; await render(); },
    unmount: async () => { await act(async () => root.unmount()); roots.delete(root); },
  };
}

beforeEach(() => { fetchMock.mockReset(); vi.stubGlobal('fetch', fetchMock); });
afterEach(async () => {
  for (const root of roots) await act(async () => root.unmount());
  roots.clear(); vi.unstubAllGlobals();
});

describe('portfolio list response states', () => {
  it.each([
    ['HTTP500 okfalse', 500, { ok: false, errorCode: 'portfolio_list_failed' }],
    ['HTTP500 misleading success', 500, { ok: true, projects: [] }],
    ['HTTP200 okfalse', 200, { ok: false }],
    ['missing projects', 200, { ok: true }],
    ['nonarray projects', 200, { ok: true, projects: {} }],
    ['truthy nonboolean ok', 200, { ok: 'yes', projects: [] }],
    ['null envelope', 200, null],
  ])('shows error instead of empty for %s', async (_label, status, body) => {
    const pending = deferred<Response>(); fetchMock.mockReturnValueOnce(pending.promise);
    const screen = await mount(); const copy = getPortfolioListCopy('en');
    expect(screen.html()).toContain(copy.loading);
    await act(async () => pending.resolve(response(body, status)));
    expect(screen.html()).toContain(copy.loadError);
    expect(screen.html()).toContain('role="status"');
    expect(screen.html()).not.toContain(copy.empty);
    expect(screen.html()).not.toContain(copy.loading);
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it('distinguishes successful empty from failure', async () => {
    fetchMock.mockResolvedValueOnce(response({ ok: true, projects: [] }));
    const screen = await mount(); const copy = getPortfolioListCopy('en');
    expect(screen.html()).toContain(copy.empty); expect(screen.html()).not.toContain(copy.loadError);
  });

  it.each(['ko', 'zh-hant', 'en'] as const)('renders localized %s error and recovers on category change', async (locale) => {
    fetchMock.mockResolvedValueOnce(response({ ok: false }, 500));
    const screen = await mount({ locale }); const copy = getPortfolioListCopy(locale);
    expect(screen.html()).toContain(copy.loadError);
    const project = { ...copy.mockProjects[0], title: 'Synthetic recovered project' };
    fetchMock.mockResolvedValueOnce(response({ ok: true, projects: [project] }));
    await screen.update({ node: { ...node, content: { ...node.content, category: 'labor' } } });
    expect(screen.html()).toContain(project.title); expect(screen.html()).not.toContain(copy.loadError);
    expect(fetchMock).toHaveBeenLastCalledWith(expect.stringContaining('category=labor'));
    expect(screen.html()).toContain(`/${locale}/portfolio/${project.slug}`);
  });

  it.each(['rejection', 'invalid JSON'])('ends loading for %s', async (kind) => {
    if (kind === 'rejection') fetchMock.mockRejectedValueOnce(new Error('synthetic network failure'));
    else fetchMock.mockResolvedValueOnce(new Response('{', { status: 200 }));
    const screen = await mount(); expect(screen.html()).toContain(getPortfolioListCopy('en').loadError);
  });

  it('ignores old locale success after current failure', async () => {
    const old = deferred<Response>(); fetchMock.mockReturnValueOnce(old.promise);
    const screen = await mount();
    fetchMock.mockResolvedValueOnce(response({ ok: false }, 500));
    await screen.update({ locale: 'zh-hant' }); const html = screen.html();
    await act(async () => old.resolve(response({ ok: true, projects: getPortfolioListCopy('en').mockProjects })));
    expect(screen.html()).toBe(html); expect(html).toContain(getPortfolioListCopy('zh-hant').loadError);
  });

  it('ignores stale failure while the current request remains pending', async () => {
    const old = deferred<Response>(); const current = deferred<Response>();
    fetchMock.mockReturnValueOnce(old.promise).mockReturnValueOnce(current.promise);
    const screen = await mount(); await screen.update({ locale: 'ko' });
    await act(async () => old.resolve(response({ ok: false }, 500)));
    expect(screen.html()).toContain(getPortfolioListCopy('ko').loading);
    await act(async () => current.resolve(response({ ok: true, projects: [] })));
    expect(screen.html()).toContain(getPortfolioListCopy('ko').empty);
  });

  it('does not render or request again after unmount', async () => {
    const pending = deferred<Response>(); fetchMock.mockReturnValueOnce(pending.promise);
    const screen = await mount(); await screen.unmount(); const count = screen.renders();
    await act(async () => pending.resolve(response({ ok: false }, 500)));
    expect(screen.renders()).toBe(count); expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it('preserves builder samples/disclosure and scoped filters', async () => {
    fetchMock.mockResolvedValueOnce(response({ ok: false }, 403));
    const screen = await mount({ mode: 'edit', locale: 'zh-hant', node: { ...node,
      content: { ...node.content, featuredOnly: true } } });
    const html = screen.html(); expect(html).toContain(getPortfolioListCopy('zh-hant').mockProjects[0].title);
    expect(html).not.toContain(getPortfolioListCopy('zh-hant').loadError);
    expect(html).toContain('data-builder-demo-disclosure');
    const url = new URL(String(fetchMock.mock.calls[0][0]), 'http://localhost');
    expect(Object.fromEntries(url.searchParams)).toMatchObject({ locale: 'zh-hant', scope: 'all', status: 'all', featured: 'true', limit: '2', sort: 'order-asc' });
  });
});

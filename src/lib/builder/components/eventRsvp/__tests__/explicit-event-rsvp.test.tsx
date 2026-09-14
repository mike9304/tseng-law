import { act, isValidElement, StrictMode, type ComponentProps, type ReactElement, type ReactNode } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { renderToStaticMarkup } from 'react-dom/server';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import EventRsvp from '../Element';
import type { BuilderEvent } from '@/lib/builder/events/events-shared';
import { getEventWidgetsCopy } from '../../event-widgets-copy';

type Props = ComponentProps<typeof EventRsvp>;
type FormProps = { onSubmit: (event: { preventDefault: () => void; currentTarget: { reset: () => void } }) => Promise<void> };
const roots = new Set<Root>();
const fetchMock = vi.fn<typeof fetch>();
function eventRecord(id = 'evt-1', extra: Partial<BuilderEvent> = {}): BuilderEvent {
  return { eventId: id, slug: id, title: `Synthetic ${id}`, description: '', date: '2030-01-01', time: '10:00',
    location: 'Online', category: 'seminar', locale: 'en', status: 'published', rsvpEnabled: true, capacity: 80, registeredCount: 0,
    ticketType: 'free', ticketPriceTwd: 0, ticketCurrency: 'TWD', createdAt: '2020-01-01T00:00:00.000Z',
    updatedAt: '2020-01-01T00:00:00.000Z', ...extra };
}
const records = Array.from({ length: 21 }, (_, index) => eventRecord(`evt-${index + 1}`));
function node(eventId?: string): Props['node'] {
  return { kind: 'event-rsvp', content: { eventId, title: 'RSVP', showTicketInfo: true, successMessage: 'Synthetic RSVP success' } } as Props['node'];
}
function response(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), { status, headers: { 'content-type': 'application/json' } });
}
function deferred<T>() {
  let resolve!: (value: T) => void;
  let reject!: (reason: Error) => void;
  const promise = new Promise<T>((yes, no) => { resolve = yes; reject = no; });
  return { promise, resolve, reject };
}
function findElement(tree: ReactNode, type: string): ReactElement<Record<string, unknown>> | null {
  if (Array.isArray(tree)) {
    for (const child of tree) { const found = findElement(child, type); if (found) return found; }
    return null;
  }
  if (!isValidElement<Record<string, unknown>>(tree)) return null;
  return tree.type === type ? tree : findElement(tree.props.children as ReactNode, type);
}

// Real React hooks, commit/unmount lifecycle and keyed reconciliation. The pure
// outer component supplies the actual inner type/props/key; a transparent Probe
// captures its returned form handler instead of mounting host inputs. Fetch and
// FormData are synthetic; this is not browser typing, hit-testing or provider QA.
async function mount(overrides: Partial<Props> = {}, strict = false) {
  const document = { activeElement: null, addEventListener: vi.fn(), removeEventListener: vi.fn(),
    documentElement: { namespaceURI: 'http://www.w3.org/1999/xhtml' }, nodeType: 9 };
  const container = { addEventListener: vi.fn(), removeEventListener: vi.fn(), appendChild: vi.fn(), removeChild: vi.fn(),
    namespaceURI: 'http://www.w3.org/1999/xhtml', nodeName: 'DIV', nodeType: 1,
    ownerDocument: document, tagName: 'DIV', textContent: '' };
  vi.stubGlobal('IS_REACT_ACT_ENVIRONMENT', true);
  vi.stubGlobal('window', { HTMLIFrameElement: function HTMLIFrameElement() {} });
  vi.stubGlobal('document', document);
  vi.stubGlobal('FormData', class {
    get(key: string) { return ({ name: 'Synthetic tester', email: 'audit@example.invalid', phone: '', ticketQuantity: '1' } as Record<string, string>)[key] ?? null; }
  });
  let props: Props = { node: node('evt-21'), mode: 'published', locale: 'en', ...overrides };
  let tree: ReactNode;
  let renders = 0;
  function Probe({ element }: { element: ReactElement }) {
    renders++;
    const Inner = element.type as (props: unknown) => ReactNode;
    tree = Inner(element.props);
    return null;
  }
  const root = createRoot(container as unknown as Element);
  roots.add(root);
  async function render() {
    const inner = EventRsvp(props);
    const probe = <Probe key={inner.key} element={inner} />;
    await act(async () => root.render(strict ? <StrictMode>{probe}</StrictMode> : probe));
  }
  await render();
  return {
    html: () => renderToStaticMarkup(tree),
    form: () => findElement(tree, 'form')?.props as FormProps | undefined,
    buttonDisabled: () => findElement(tree, 'button')?.props.disabled,
    update: async (next: Partial<Props>) => { props = { ...props, ...next }; await render(); },
    unmount: async () => { await act(async () => root.unmount()); roots.delete(root); },
    renders: () => renders,
  };
}
async function submit(form: FormProps, reset = vi.fn()) {
  await act(async () => { await form.onSubmit({ preventDefault: vi.fn(), currentTarget: { reset } }); });
  return reset;
}
function posts() { return fetchMock.mock.calls.filter(([, init]) => init?.method === 'POST'); }
function useDefaultFetch() {
  fetchMock.mockImplementation(async (input, init) => {
    if (init?.method === 'POST') return response({ ok: true, attendee: { attendeeId: 'att-synthetic' } });
    const url = new URL(String(input), 'https://audit.invalid');
    if (url.pathname === '/api/builder/events') return response({ ok: true, events: records.slice(0, 20) });
    const found = records.find((item) => url.pathname === `/api/builder/events/${item.eventId}`);
    return found ? response({ ok: true, event: found }) : response({ ok: false }, 404);
  });
}
beforeEach(() => { fetchMock.mockReset(); vi.stubGlobal('fetch', fetchMock); useDefaultFetch(); });
afterEach(async () => { for (const root of roots) await act(async () => root.unmount()); roots.clear(); vi.unstubAllGlobals(); });

describe('explicit event identity', () => {
  it('fetches and submits configured21st event without first20 fallback', async () => {
    const screen = await mount();
    expect(String(fetchMock.mock.calls[0][0])).toBe('/api/builder/events/evt-21?locale=en&scope=public');
    expect(screen.html()).toContain('Synthetic evt-21');
    const reset = await submit(screen.form()!);
    expect(posts()).toHaveLength(1);
    expect(String(posts()[0][0])).toBe('/api/builder/events/evt-21/rsvp?locale=en');
    expect(reset).toHaveBeenCalledOnce();
    expect(screen.html()).toContain('Synthetic RSVP success');
  });
  it('normalizes whitespace ID and retains no-ID first-upcoming default', async () => {
    const screen = await mount({ node: node('   ') });
    const url = new URL(String(fetchMock.mock.calls[0][0]), 'https://audit.invalid');
    expect(url.pathname).toBe('/api/builder/events');
    expect(Object.fromEntries(url.searchParams)).toMatchObject({ time: 'upcoming', limit: '20', sort: 'date-asc' });
    await submit(screen.form()!);
    expect(String(posts()[0][0])).toBe('/api/builder/events/evt-1/rsvp?locale=en');
    await screen.update({ node: node(' evt-21 ') });
    expect(screen.html()).toContain('Synthetic evt-21');
  });
  it.each(['edit', 'preview'] as const)('keeps no-ID builder %s samples/disclosure and never POSTs', async (mode) => {
    fetchMock.mockResolvedValueOnce(response({ ok: false }, 403));
    const screen = await mount({ node: node(), mode });
    expect(screen.html()).toContain('data-builder-demo-disclosure');
    expect(screen.form()).toBeDefined();
    await submit(screen.form()!);
    expect(posts()).toHaveLength(0);
    expect(screen.html()).toContain(getEventWidgetsCopy('en').rsvpForm.previewMessage);
  });
  it('never substitutes builder sample for a missing explicit ID', async () => {
    const screen = await mount({ node: node('missing'), mode: 'edit' });
    expect(screen.form()).toBeUndefined();
    expect(screen.html()).toContain(getEventWidgetsCopy('en').rsvpForm.noEvents);
  });
  it.each([
    ['missing', null], ['different ID', { eventId: 'evt-1' }], ['different locale', { locale: 'ko' }],
    ['draft', { status: 'draft' }], ['cancelled', { status: 'cancelled' }], ['past', { date: '2000-01-01' }],
  ] as const)('is unavailable with no form for %s', async (_label, extra) => {
    fetchMock.mockResolvedValueOnce(extra === null ? response({ ok: false }, 404) : response({ ok: true, event: eventRecord('evt-21', extra) }));
    const screen = await mount();
    expect(screen.form()).toBeUndefined();
    expect(screen.html()).toContain(getEventWidgetsCopy('en').rsvpForm.noEvents);
    expect(posts()).toHaveLength(0);
  });
  it('preserves same-day availability without adding a time-of-day policy', async () => {
    fetchMock.mockResolvedValueOnce(response({ ok: true, event: eventRecord('evt-21', { date: new Date().toISOString().slice(0, 10), time: '00:00' }) }));
    const screen = await mount(); expect(screen.form()).toBeDefined();
  });
  it.each(['ko', 'zh-hant', 'en'] as const)('shows localized %s load error', async (locale) => {
    fetchMock.mockRejectedValueOnce(new Error('synthetic network failure'));
    const screen = await mount({ locale });
    expect(screen.form()).toBeUndefined();
    expect(screen.html()).toContain(getEventWidgetsCopy(locale).rsvpForm.loadError);
    expect(screen.html()).not.toContain(getEventWidgetsCopy(locale).rsvpForm.noEvents);
  });
  it.each([
    ['HTTP500 misleading success', () => response({ ok: true, event: eventRecord('evt-21') }, 500)],
    ['nonboolean ok', () => response({ ok: 'yes', event: eventRecord('evt-21') })],
    ['missing event', () => response({ ok: true })], ['invalid event shape', () => response({ ok: true, event: { eventId: 'evt-21' } })],
    ['invalid JSON', () => new Response('{', { status: 200 })],
    ['array currency', () => response({ ok: true, event: { ...eventRecord('evt-21'), ticketCurrency: ['TWD'] } })],
  ] as const)('does not expose a form for %s', async (_label, factory) => {
    fetchMock.mockResolvedValueOnce(factory());
    const screen = await mount(); expect(screen.form()).toBeUndefined(); expect(screen.html()).toContain(getEventWidgetsCopy('en').rsvpForm.loadError);
  });
  it('distinguishes loading then successful empty default from error', async () => {
    const load = deferred<Response>(); fetchMock.mockReturnValueOnce(load.promise);
    const screen = await mount({ node: node() });
    expect(screen.html()).toContain(getEventWidgetsCopy('en').loadingList);
    await act(async () => load.resolve(response({ ok: true, events: [] })));
    expect(screen.html()).toContain(getEventWidgetsCopy('en').rsvpForm.noEvents);
  });
  it('keeps capacity-disabled UI and refuses a retained full-event handler', async () => {
    fetchMock.mockResolvedValueOnce(response({ ok: true, event: eventRecord('evt-21', { capacity: 1, registeredCount: 1 }) }));
    const screen = await mount(); expect(screen.buttonDisabled()).toBe(true); await submit(screen.form()!); expect(posts()).toHaveLength(0);
  });
});

describe('request and submission ownership', () => {
  it('changes ID immediately and ignores the old GET', async () => {
    const old = deferred<Response>(); fetchMock.mockReturnValueOnce(old.promise);
    const screen = await mount({ node: node('evt-1') }); await screen.update({ node: node('evt-21') });
    expect(screen.html()).toContain('Synthetic evt-21');
    await act(async () => old.resolve(response({ ok: true, event: eventRecord('evt-1') })));
    expect(screen.html()).toContain('Synthetic evt-21');
    expect((fetchMock.mock.calls[0][1]?.signal as AbortSignal).aborted).toBe(true);
  });
  it('does not revive firstA through A→B→A', async () => {
    const first = deferred<Response>(); const last = deferred<Response>(); fetchMock.mockReturnValueOnce(first.promise);
    const screen = await mount({ node: node('evt-1') }); await screen.update({ node: node('evt-2') });
    fetchMock.mockReturnValueOnce(last.promise); await screen.update({ node: node('evt-1') });
    await act(async () => first.resolve(response({ ok: true, event: eventRecord('evt-1', { title: 'Stale first A' }) })));
    expect(screen.html()).toContain(getEventWidgetsCopy('en').loadingList);
    await act(async () => last.resolve(response({ ok: true, event: eventRecord('evt-1', { title: 'Current A' }) })));
    expect(screen.html()).toContain('Current A'); expect(screen.html()).not.toContain('Stale first A');
  });
  it('does not revive old locale failure after current locale success', async () => {
    const old = deferred<Response>(); fetchMock.mockReturnValueOnce(old.promise);
    const screen = await mount(); fetchMock.mockResolvedValueOnce(response({ ok: true, event: eventRecord('evt-21', { locale: 'ko', title: 'Current Korean event' }) }));
    await screen.update({ locale: 'ko' }); await act(async () => old.reject(new Error('stale')));
    expect(screen.html()).toContain('Current Korean event'); expect(screen.html()).not.toContain(getEventWidgetsCopy('ko').rsvpForm.loadError);
  });
  it('stale retained handler sends no POST after ID or mode change', async () => {
    const screen = await mount({ node: node('evt-1') }); const old = screen.form()!;
    await screen.update({ node: node('evt-21') }); await submit(old); expect(posts()).toHaveLength(0);
    const current = screen.form()!; await screen.update({ mode: 'preview' }); await submit(current); expect(posts()).toHaveLength(0);
  });
  it.each(['success', 'failure'] as const)('old POST %s cannot reset/message/unblock the new submit', async (result) => {
    const screen = await mount({ node: node('evt-1') }); const old = deferred<Response>(); const current = deferred<Response>();
    const oldReset = vi.fn(); const currentReset = vi.fn(); let oldSubmit!: Promise<void>; let currentSubmit!: Promise<void>;
    fetchMock.mockReturnValueOnce(old.promise);
    await act(async () => { oldSubmit = screen.form()!.onSubmit({ preventDefault: vi.fn(), currentTarget: { reset: oldReset } }); });
    await screen.update({ node: node('evt-21') }); fetchMock.mockReturnValueOnce(current.promise);
    await act(async () => { currentSubmit = screen.form()!.onSubmit({ preventDefault: vi.fn(), currentTarget: { reset: currentReset } }); });
    await act(async () => { if (result === 'success') old.resolve(response({ ok: true })); else old.reject(new Error('Old submit failure')); await oldSubmit; });
    expect(screen.buttonDisabled()).toBe(true); expect(oldReset).not.toHaveBeenCalled();
    expect(screen.html()).not.toContain('Synthetic RSVP success'); expect(screen.html()).not.toContain('Old submit failure');
    await act(async () => { current.resolve(response({ ok: true })); await currentSubmit; });
    expect(currentReset).toHaveBeenCalledOnce(); expect(screen.buttonDisabled()).toBe(false); expect(posts()).toHaveLength(2);
  });
  it('preserves current submit errors without reset or automatic retry', async () => {
    const screen = await mount(); fetchMock.mockResolvedValueOnce(response({ ok: false, error: 'Synthetic current failure' }, 400));
    const reset = await submit(screen.form()!); expect(reset).not.toHaveBeenCalled(); expect(posts()).toHaveLength(1);
    expect(screen.html()).toContain('Synthetic current failure'); expect(screen.buttonDisabled()).toBe(false);
  });
  it('drops current POST completion and retained handler after unmount', async () => {
    const screen = await mount(); const form = screen.form()!; const pending = deferred<Response>(); fetchMock.mockReturnValueOnce(pending.promise);
    const reset = vi.fn(); let task!: Promise<void>;
    await act(async () => { task = form.onSubmit({ preventDefault: vi.fn(), currentTarget: { reset } }); });
    await screen.unmount(); const count = screen.renders();
    await act(async () => { pending.resolve(response({ ok: true })); await task; }); await submit(form);
    expect(screen.renders()).toBe(count); expect(reset).not.toHaveBeenCalled(); expect(posts()).toHaveLength(1);
    expect((posts()[0][1]?.signal as AbortSignal).aborted).toBe(true);
  });
  it('keeps the current generation usable under StrictMode', async () => {
    const screen = await mount({}, true); expect(screen.html()).toContain('Synthetic evt-21');
    await submit(screen.form()!); expect(posts()).toHaveLength(1); expect(screen.html()).toContain('Synthetic RSVP success');
  });
});

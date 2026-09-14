import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
const effects = vi.hoisted(() => ({ callbacks: [] as Array<() => void | (() => void)> }));
vi.mock('react', () => ({ useEffect: (fn: () => void | (() => void)) => effects.callbacks.push(fn) }));
import SiteSearchEnhancer from '../SiteSearchEnhancer';

let writes = 0;
let active: ElementDouble | null = null;
class ElementDouble extends EventTarget {
  children: ElementDouble[] = [];
  attrs = new Map<string, string>();
  dataset: Record<string, string> = {};
  value = ''; id = ''; className = ''; textContent = '';
  private concealed = true;
  get hidden() { return this.concealed; }
  set hidden(value: boolean) { writes++; this.concealed = value; }
  set innerHTML(_value: string) { writes++; this.children = []; }
  setAttribute(k: string, v: string) { writes++; this.attrs.set(k, v); }
  getAttribute(k: string) { return this.attrs.get(k) ?? null; }
  removeAttribute(k: string) { writes++; this.attrs.delete(k); }
  appendChild(child: ElementDouble) { writes++; this.children.push(child); return child; }
  append(...children: ElementDouble[]) { for (const child of children) this.appendChild(child); }
  // eslint-disable-next-line @typescript-eslint/no-this-alias -- DOM double must retain the focused element identity.
  focus() { active = this; }
  querySelectorAll(selector: string): ElementDouble[] {
    return this.children.flatMap(child => [
      ...(selector === '.builder-site-search-hit' && child.className === 'builder-site-search-hit' ? [child] : []),
      ...child.querySelectorAll(selector),
    ]);
  }
}
class AnchorDouble extends ElementDouble {}
class FormDouble extends ElementDouble {
  input = new ElementDouble(); results = new ElementDouble();
  constructor(id: string) {
    super(); this.results.id = id;
    this.dataset = { builderSiteSearchInline: 'true', builderSiteSearchLocale: 'ko', builderSiteSearchMax: '8' };
  }
  querySelector(selector: string) { return selector.includes('-input=') ? this.input : this.results; }
}
function deferred<T>() {
  let resolve!: (value: T) => void;
  let reject!: (reason: unknown) => void;
  const promise = new Promise<T>((a, b) => { resolve = a; reject = b; });
  return { promise, resolve, reject };
}
const hit = (title: string) => ({ hits: [{ id: title, kind: 'page', title, url: `/ko/${title}` }] });
const response = (title: string) => ({ ok: true, json: async () => hit(title) });
const tick = async () => { for (let i = 0; i < 8; i++) await Promise.resolve(); };
function input(form: FormDouble, value: string) { form.input.value = value; form.input.dispatchEvent(new Event('input')); }
function key(target: ElementDouble, value: string) {
  const event = new Event('keydown', { cancelable: true }); Object.defineProperty(event, 'key', { value });
  target.dispatchEvent(event); return event;
}
function titles(form: FormDouble) { return form.results.querySelectorAll('.builder-site-search-hit').map(a => a.children[0]?.textContent); }
let cleanup: (() => void) | undefined;
function mount(...forms: FormDouble[]) {
  vi.stubGlobal('window', {}); vi.stubGlobal('HTMLAnchorElement', AnchorDouble);
  vi.stubGlobal('document', {
    documentElement: { lang: 'ko' }, get activeElement() { return active; },
    querySelectorAll: () => forms,
    createElement: (tag: string) => tag === 'a' ? new AnchorDouble() : new ElementDouble(),
  });
  SiteSearchEnhancer(); cleanup = effects.callbacks.pop()?.() || undefined;
}
beforeEach(() => { vi.useFakeTimers(); effects.callbacks = []; writes = 0; active = null; });
afterEach(() => { cleanup?.(); cleanup = undefined; vi.unstubAllGlobals(); vi.useRealTimers(); vi.restoreAllMocks(); });

describe('actual inline search effect ownership', () => {
  it('invalidates A immediately when B is typed, before the next debounce', async () => {
    const a = deferred<ReturnType<typeof response>>(); const fetch = vi.fn(() => a.promise); vi.stubGlobal('fetch', fetch);
    const form = new FormDouble('one'); mount(form); input(form, 'A'); await vi.advanceTimersByTimeAsync(200);
    input(form, 'B'); a.resolve(response('A')); await tick();
    expect(titles(form)).not.toContain('A'); expect(fetch).toHaveBeenCalledTimes(1);
  });
  it('clears immediately and never revives A after clearing', async () => {
    const a = deferred<ReturnType<typeof response>>(); vi.stubGlobal('fetch', vi.fn(() => a.promise));
    const form = new FormDouble('one'); mount(form); input(form, 'A'); await vi.advanceTimersByTimeAsync(200);
    input(form, ''); expect(form.results.hidden).toBe(true); a.resolve(response('A')); await tick();
    expect(form.results.hidden).toBe(true); expect(titles(form)).toEqual([]);
  });
  it('Escape cancels a pending debounce even while the panel is hidden', async () => {
    const fetch = vi.fn(async () => response('A')); vi.stubGlobal('fetch', fetch);
    const form = new FormDouble('one'); mount(form); input(form, 'A'); key(form.input, 'Escape');
    await vi.advanceTimersByTimeAsync(200); expect(fetch).not.toHaveBeenCalled(); expect(form.results.hidden).toBe(true);
  });
  it('Escape invalidates a deferred body even if abort is ignored', async () => {
    const body = deferred<ReturnType<typeof hit>>(); vi.stubGlobal('fetch', vi.fn(async () => ({ ok: true, json: () => body.promise })));
    const form = new FormDouble('one'); mount(form); input(form, 'A'); await vi.advanceTimersByTimeAsync(200);
    key(form.input, 'Escape'); const before = writes; body.resolve(hit('A')); await tick();
    expect(form.results.hidden).toBe(true); expect(writes).toBe(before);
  });
  it('does not let A overwrite B after a late ignored-abort response', async () => {
    const a = deferred<ReturnType<typeof response>>(); const fetch = vi.fn().mockReturnValueOnce(a.promise).mockResolvedValueOnce(response('B')); vi.stubGlobal('fetch', fetch);
    const form = new FormDouble('one'); mount(form); input(form, 'A'); await vi.advanceTimersByTimeAsync(200);
    input(form, 'B'); await vi.advanceTimersByTimeAsync(200); expect(titles(form)).toEqual(['B']);
    const before = writes; a.resolve(response('A')); await tick(); expect(titles(form)).toEqual(['B']); expect(writes).toBe(before);
  });
  it('stale failure/finally cannot replace B status or clear B busy', async () => {
    const a = deferred<ReturnType<typeof response>>(); const b = deferred<ReturnType<typeof response>>(); vi.stubGlobal('fetch', vi.fn().mockReturnValueOnce(a.promise).mockReturnValueOnce(b.promise));
    const form = new FormDouble('one'); mount(form); input(form, 'A'); await vi.advanceTimersByTimeAsync(200);
    input(form, 'B'); await vi.advanceTimersByTimeAsync(200); const before = writes; a.reject(new Error('old failure')); await tick();
    expect(writes).toBe(before); expect(form.input.getAttribute('aria-busy')).toBe('true');
    b.resolve(response('B')); await tick(); expect(titles(form)).toEqual(['B']); expect(form.input.getAttribute('aria-busy')).toBe('false');
  });
  it('cleanup prevents all late response DOM writes', async () => {
    const a = deferred<ReturnType<typeof response>>(); vi.stubGlobal('fetch', vi.fn(() => a.promise));
    const form = new FormDouble('one'); mount(form); input(form, 'A'); await vi.advanceTimersByTimeAsync(200);
    cleanup?.(); cleanup = undefined; const before = writes; a.resolve(response('A')); await tick(); expect(writes).toBe(before);
  });
  it('cleanup cancels a pending debounce', async () => {
    const fetch = vi.fn(); vi.stubGlobal('fetch', fetch); const form = new FormDouble('one'); mount(form);
    input(form, 'A'); cleanup?.(); cleanup = undefined; await vi.advanceTimersByTimeAsync(200); expect(fetch).not.toHaveBeenCalled();
  });
  it('keeps two forms independent and preserves keyboard navigation', async () => {
    const first = deferred<ReturnType<typeof response>>(); vi.stubGlobal('fetch', vi.fn().mockReturnValueOnce(first.promise).mockResolvedValueOnce(response('second')));
    const one = new FormDouble('one'), two = new FormDouble('two'); mount(one, two); input(one, 'first'); input(two, 'second');
    await vi.advanceTimersByTimeAsync(199); expect(fetch).not.toHaveBeenCalled(); await vi.advanceTimersByTimeAsync(1);
    expect(titles(two)).toEqual(['second']); expect(one.input.getAttribute('aria-busy')).toBe('true');
    key(two.input, 'ArrowDown'); expect(active).toBe(two.results.children[0]);
    key(two.results, 'ArrowUp'); expect(active).toBe(two.results.children[0]);
    first.resolve(response('first')); await tick(); expect(titles(one)).toEqual(['first']); expect(titles(two)).toEqual(['second']);
    const submit = new Event('submit', { cancelable: true }); one.dispatchEvent(submit); expect(submit.defaultPrevented).toBe(false);
  });
  it.each([true, false])('shows current empty/error state (ok=%s)', async ok => {
    vi.stubGlobal('fetch', vi.fn(async () => ({ ok, json: async () => ok ? { hits: [] } : { error: 'Unavailable' } })));
    const form = new FormDouble('one'); mount(form); input(form, 'current'); await vi.advanceTimersByTimeAsync(200);
    expect(form.results.hidden).toBe(false); expect(form.results.children[0].textContent).toBe(ok ? '결과 없음' : 'Unavailable');
    expect(form.input.getAttribute('aria-busy')).toBe('false');
  });
});

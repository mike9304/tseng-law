import React, { type ReactNode } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

// Reuse the existing global-error component effect/SSR test approach. These are
// real component callbacks and markup with a local hook scheduler, not browser QA.
const hooks = vi.hoisted(() => ({
  cursor: 0,
  slots: [] as Array<{ value?: unknown; deps?: readonly unknown[]; cleanup?: () => void }>,
  effects: [] as Array<() => void>,
  pending: [] as Array<Promise<unknown>>,
  rejections: [] as unknown[],
  unmounted: false,
  writesAfterUnmount: 0,
}));

vi.mock('react', async (importOriginal) => {
  const original = await importOriginal<typeof import('react')>();
  const same = (a?: readonly unknown[], b?: readonly unknown[]) => Boolean(a && b && a.length === b.length && a.every((v, i) => Object.is(v, b[i])));
  return {
    ...original,
    useState(initial: unknown) {
      const i = hooks.cursor++;
      const slot = hooks.slots[i] ??= { value: typeof initial === 'function' ? initial() : initial };
      return [slot.value, (next: unknown) => {
        if (hooks.unmounted) hooks.writesAfterUnmount++;
        slot.value = typeof next === 'function' ? next(slot.value) : next;
      }];
    },
    useRef(initial: unknown) {
      const i = hooks.cursor++;
      return (hooks.slots[i] ??= { value: { current: initial } }).value;
    },
    useCallback(fn: (...args: unknown[]) => unknown, deps: readonly unknown[]) {
      const i = hooks.cursor++;
      if (!same(hooks.slots[i]?.deps, deps)) {
        hooks.slots[i] = { deps, value: (...args: unknown[]) => {
          const result = fn(...args);
          if (result instanceof Promise) hooks.pending.push(result.catch((error) => { hooks.rejections.push(error); }));
          return result;
        } };
      }
      return hooks.slots[i].value;
    },
    useEffect(effect: () => void | (() => void), deps: readonly unknown[]) {
      const i = hooks.cursor++;
      if (!same(hooks.slots[i]?.deps, deps)) {
        const previous = hooks.slots[i];
        const slot = hooks.slots[i] = { deps } as (typeof hooks.slots)[number];
        hooks.effects.push(() => { previous?.cleanup?.(); slot.cleanup = effect() || undefined; });
      }
    },
  };
});

import BookingManageClient from '@/components/builder/bookings/BookingManageClient';

const copy = {
  ko: { loading: '예약을 불러오는 중...', invalid: '이 예약 링크는 유효하지 않거나 만료되었습니다.', failed: '연결 문제로 예약 정보를 불러오지 못했습니다. 네트워크를 확인한 뒤 페이지를 새로고침해 다시 시도해 주세요.' },
  en: { loading: 'Loading booking...', invalid: 'This booking link is invalid or expired.', failed: 'Couldn’t load this appointment because of a connection problem. Check your network and refresh the page to try again.' },
  'zh-hant': { loading: '正在載入預約...', invalid: '此預約連結無效或已過期。', failed: '因連線問題無法載入預約資料。請檢查網路後重新整理頁面再試一次。' },
};
type Props = Parameters<typeof BookingManageClient>[0];
let current: Props;
let tree: ReactNode;
function render(props: Props = current) {
  current = props;
  hooks.cursor = 0;
  tree = BookingManageClient(props);
  return renderToStaticMarkup(tree);
}
function effects() { for (const effect of hooks.effects.splice(0)) effect(); }
async function settle() { while (hooks.pending.length) await Promise.all(hooks.pending.splice(0)); }
function unmount() { hooks.unmounted = true; for (const slot of hooks.slots) slot.cleanup?.(); }
function deferred<T>() {
  let resolve!: (value: T) => void;
  let reject!: (reason: unknown) => void;
  const promise = new Promise<T>((yes, no) => { resolve = yes; reject = no; });
  return { promise, resolve, reject };
}
function data(name = 'Current appointment') {
  return {
    booking: { bookingId: name, startAt: '2026-10-01T01:00:00.000Z', endAt: '2026-10-01T02:00:00.000Z', status: 'confirmed', customer: { name: 'Synthetic visitor', email: 'synthetic@example.invalid' }, customerTimezone: 'UTC' },
    service: { name, durationMinutes: 60, meetingMode: 'in-person' }, staff: null,
    policy: { name: 'Synthetic policy', hoursUntilStart: 100, canCancel: true, canReschedule: true, cancelHoursBefore: 24, rescheduleHoursBefore: 24, fullRefundHoursBefore: 48, partialRefundHoursBefore: 24, partialRefundPercent: 50, cancellationFeePercent: 0, refundDecision: 'none' },
  };
}
const response = (name?: string) => ({ ok: true, json: async () => data(name) });
function button(node: ReactNode, attribute: string): (() => Promise<void>) | undefined {
  if (Array.isArray(node)) return node.map((child) => button(child, attribute)).find(Boolean);
  if (!React.isValidElement<Record<string, unknown> & { children?: ReactNode; onClick?: () => Promise<void> }>(node)) return undefined;
  return node.type === 'button' && node.props[attribute] ? node.props.onClick : button(node.props.children, attribute);
}

function resetHarness() {
  hooks.cursor = 0; hooks.slots = []; hooks.effects = []; hooks.pending = []; hooks.rejections = []; hooks.unmounted = false; hooks.writesAfterUnmount = 0;
  current = { token: 'synthetic/detail', locale: 'en' };
}
beforeEach(resetHarness);
afterEach(() => { unmount(); vi.unstubAllGlobals(); });

describe('booking initial detail recovery', () => {
  it.each(['ko', 'en', 'zh-hant'] as const)('settles a current network rejection in %s without blaming the link', async (locale) => {
    const fetcher = vi.fn().mockRejectedValue(new TypeError('Failed to fetch'));
    vi.stubGlobal('fetch', fetcher);
    expect(render({ ...current, locale })).toContain(copy[locale].loading);
    effects(); await settle();
    const html = render();
    expect(html).toContain(copy[locale].failed);
    expect(html).not.toContain(copy[locale].loading);
    expect(html).not.toContain(copy[locale].invalid);
    expect(html).not.toContain('Failed to fetch');
    expect(hooks.rejections).toEqual([]);
    expect(fetcher.mock.calls[0][0]).toBe('/api/booking/manage/synthetic%2Fdetail');
    expect(fetcher.mock.calls[0][1]).toMatchObject({ credentials: 'same-origin' });
  });

  it.each(['ko', 'en', 'zh-hant'] as const)('preserves the existing invalid-link response in %s', async (locale) => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: false, status: 401 }));
    render({ ...current, locale }); effects(); await settle();
    expect(render()).toContain(copy[locale].invalid);
    expect(render()).not.toContain(copy[locale].failed);
    expect(hooks.rejections).toEqual([]);
  });

  it.each(['current AbortError', 'synchronous fetch throw', 'response parsing rejection'])('settles %s using the load failure state', async (failure) => {
    const fetcher = failure === 'current AbortError'
      ? vi.fn().mockRejectedValue(new DOMException('Aborted by transport', 'AbortError'))
      : failure === 'synchronous fetch throw'
        ? vi.fn(() => { throw new Error('Synthetic synchronous failure'); })
        : vi.fn().mockResolvedValue({ ok: true, json: async () => { throw new SyntaxError('Synthetic parse failure'); } });
    vi.stubGlobal('fetch', fetcher);
    render(); effects(); await settle();
    expect(render()).toContain(copy.en.failed);
    expect(render()).not.toContain(copy.en.loading);
    expect(hooks.rejections).toEqual([]);
  });

  it('aborts an unmounted initial request and discards its late rejection', async () => {
    const request = deferred<ReturnType<typeof response>>();
    const fetcher = vi.fn().mockReturnValue(request.promise); vi.stubGlobal('fetch', fetcher);
    render(); effects(); unmount();
    request.reject(new DOMException('Unmounted', 'AbortError')); await settle();
    expect(fetcher.mock.calls[0][1].signal?.aborted).toBe(true);
    expect(hooks.writesAfterUnmount).toBe(0);
    expect(hooks.rejections).toEqual([]);
  });

  it.each(['resolve', 'reject'] as const)('discards a superseded detail request that later %ss', async (outcome) => {
    const first = deferred<ReturnType<typeof response>>();
    const second = deferred<ReturnType<typeof response>>();
    const fetcher = vi.fn().mockReturnValueOnce(first.promise).mockReturnValueOnce(second.promise); vi.stubGlobal('fetch', fetcher);
    render(); effects();
    render({ token: 'replacement', locale: 'en' }); effects();
    second.resolve(response('Replacement appointment'));
    if (outcome === 'resolve') first.resolve(response('Stale appointment'));
    else first.reject(new Error('Stale request failure'));
    await settle();
    expect(render()).toContain('Replacement appointment');
    expect(render()).not.toContain('Stale appointment');
    expect(render()).not.toContain(copy.en.failed);
    expect(fetcher.mock.calls[0][1].signal?.aborted).toBe(true);
    expect(hooks.rejections).toEqual([]);
  });

  it('shows loading rather than the previous detail when the token changes', async () => {
    const next = deferred<ReturnType<typeof response>>();
    vi.stubGlobal('fetch', vi.fn().mockResolvedValueOnce(response('Previous appointment')).mockReturnValueOnce(next.promise));
    render(); effects(); await settle(); expect(render()).toContain('Previous appointment');
    render({ token: 'replacement', locale: 'en' }); effects();
    const loading = render(); next.resolve(response('Replacement appointment')); await settle();
    expect(loading).toContain(copy.en.loading);
    expect(loading).not.toContain('Previous appointment');
    expect(render()).toContain('Replacement appointment');
  });

  it('keeps a successful mutation message when its follow-up read fails', async () => {
    const fetcher = vi.fn().mockResolvedValueOnce(response()).mockResolvedValueOnce(response()).mockRejectedValueOnce(new TypeError('Failed to fetch'));
    vi.stubGlobal('fetch', fetcher);
    render(); effects(); await settle(); render();
    const cancel = button(tree, 'data-booking-manage-cancel'); expect(cancel).toBeTypeOf('function');
    await cancel!(); await settle();
    const html = render();
    expect(html).toContain('Booking cancelled.');
    expect(html).toContain(copy.en.failed);
    expect(html).not.toContain('Booking update failed.');
    expect(html).not.toContain('Failed to fetch');
    expect(fetcher.mock.calls[1][1]).toMatchObject({ method: 'PATCH', credentials: 'same-origin', body: JSON.stringify({ action: 'cancel', reason: '' }) });
    expect(fetcher.mock.calls[2][1]).toMatchObject({ credentials: 'same-origin' });
    expect(hooks.rejections).toEqual([]);
  });

  it('recovers through a new mount after a transport failure', async () => {
    const retry = deferred<ReturnType<typeof response>>();
    const fetcher = vi.fn().mockRejectedValueOnce(new TypeError('Failed to fetch')).mockReturnValueOnce(retry.promise);
    vi.stubGlobal('fetch', fetcher);
    render(); effects(); await settle();
    expect(render()).toContain(copy.en.failed);
    unmount(); resetHarness();
    expect(render()).toContain(copy.en.loading);
    effects(); retry.resolve(response('Recovered appointment')); await settle();
    expect(render()).toContain('Recovered appointment');
    expect(render()).not.toContain(copy.en.failed);
    expect(fetcher).toHaveBeenCalledTimes(2);
  });

  it('aborts the active follow-up read on unmount after a successful mutation', async () => {
    const followup = deferred<ReturnType<typeof response>>();
    const readStarted = deferred<void>();
    const fetcher = vi.fn().mockResolvedValueOnce(response()).mockResolvedValueOnce(response()).mockImplementationOnce(() => {
      readStarted.resolve();
      return followup.promise;
    });
    vi.stubGlobal('fetch', fetcher);
    render(); effects(); await settle(); render();
    const cancel = button(tree, 'data-booking-manage-cancel'); expect(cancel).toBeTypeOf('function');
    const mutation = cancel!(); await readStarted.promise;
    unmount(); followup.reject(new DOMException('Unmounted', 'AbortError'));
    await mutation; await settle();
    expect(fetcher.mock.calls[2][1].signal?.aborted).toBe(true);
    expect(hooks.rejections).toEqual([]);
    // Mutation's existing finally(setSaving) is outside this read-only lifecycle fix.
  });
});

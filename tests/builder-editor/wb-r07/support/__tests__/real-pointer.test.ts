import { describe, expect, it, vi } from 'vitest';

import { annotatePointerAbortRecovery, chooseInBoundsTargetPoint, computeStableBbox, makePlaywrightPointerPort, RealPointerActionError, RealPointerReadinessError, realClick, realContextClick, realDblClick, realDrag, runReadinessGate, safeAbortPressedPointer, sanitizeEvidence, SANITIZED_EVIDENCE_KEYS, type PointerAbortAnnotatedError, type PointerPort } from '../real-pointer';

function port(samples: Array<{ x: number; y: number; width: number; height: number }>, hit: { identical: boolean; contained: boolean }): PointerPort {
  let index = 0;
  let frame = 0;
  const value = {
    sampleIntendedBbox: async () => samples[Math.min(index++, samples.length - 1)] ?? null,
    waitForNextAnimationFrame: async () => ++frame,
    viewport: () => ({ width: 1280, height: 800 }),
    resolveTopAtPoint: async () => ({ ...hit, top: { tagName: 'button', role: '', dataTestId: 'safe-id', dataNodeId: '', idAttribute: '' }, chain: [{ tagName: 'button', role: '', dataTestId: 'safe-id', dataNodeId: '', idAttribute: '' }] }),
  };
  return value as PointerPort;
}
const context = { journeyId: 'J01', action: 'click', target: { testId: 'safe-id' } } as const;

function pageEvaluateWithFrames() {
  let frame = 0;
  return vi.fn(async (callback: (arg?: unknown) => unknown, argument?: unknown) => (
    argument === undefined ? ++frame : callback(argument)
  ));
}

function mockHit(contained: boolean) {
  const entry = { tagName: 'div', role: '', dataTestId: '', dataNodeId: '', idAttribute: '' };
  return { identical: false, contained, top: entry, chain: [entry] };
}

describe('WB-R07 real pointer readiness', () => {
  it('requires multiple equal geometry samples', () => {
    expect(computeStableBbox([{ x: 1, y: 1, width: 10, height: 10 }], 2).stable).toBe(false);
    expect(computeStableBbox([{ x: 1, y: 1, width: 10, height: 10 }, { x: 1, y: 1, width: 10, height: 10 }], 2).stable).toBe(true);
    expect(() => computeStableBbox([{ x: 1, y: 1, width: 10, height: 10 }], 1)).toThrow();
  });

  it('accepts an intended descendant by identity containment and gives UTC evidence', async () => {
    const result = await runReadinessGate(port([{ x: 10, y: 20, width: 100, height: 40 }], { identical: false, contained: true }), context, { yieldBetweenSamples: async () => undefined, now: () => new Date('2026-07-13T00:00:00.000Z') });
    expect(result.evidence).toMatchObject({ target: { kind: 'testid', value: 'safe-id' }, contained: true, timestampUtc: '2026-07-13T00:00:00.000Z' });
    expect(result.evidence.sampledBboxes).toHaveLength(4);
  });

  it('requires distinct frame stamps and a final post-stability bbox resample', async () => {
    const repeatedFramePort = {
      ...port([{ x: 10, y: 20, width: 100, height: 40 }], { identical: true, contained: false }),
      waitForNextAnimationFrame: async () => 1,
    } as PointerPort;
    await expect(runReadinessGate(repeatedFramePort, context, { yieldBetweenSamples: async () => undefined }))
      .rejects.toMatchObject({ evidence: { reason: 'observation-failed' } });

    const staleFinalPoint = port([
      { x: 10, y: 20, width: 100, height: 40 },
      { x: 10, y: 20, width: 100, height: 40 },
      { x: 10, y: 20, width: 100, height: 40 },
      { x: 60, y: 20, width: 100, height: 40 },
    ], { identical: true, contained: false });
    await expect(runReadinessGate(staleFinalPoint, context, { yieldBetweenSamples: async () => undefined }))
      .rejects.toMatchObject({ evidence: { reason: 'geometry-changed', sampledBboxes: expect.arrayContaining([{ x: 60, y: 20, width: 100, height: 40 }]) } });
  });

  it('rejects an overlay interception with typed sanitized evidence', async () => {
    await expect(runReadinessGate(port([{ x: 10, y: 20, width: 100, height: 40 }], { identical: false, contained: false }), context, { yieldBetweenSamples: async () => undefined })).rejects.toBeInstanceOf(RealPointerReadinessError);
  });

  it('rejects invalid weak sampling options before performing a user action', async () => {
    await expect(runReadinessGate(port([{ x: 10, y: 20, width: 100, height: 40 }], { identical: true, contained: false }), context, { requiredEqualSamples: 1 })).rejects.toBeInstanceOf(RealPointerReadinessError);
  });

  it('redacts selector contents and DOM identifiers that could carry user data', () => {
    const evidence = sanitizeEvidence({ ...context, target: { selector: '[data-node-id="Sensitive user text"]' }, domChain: [{ tagName: 'DIV', role: 'button', dataTestId: 'Sensitive user text', dataNodeId: 'safe-node', idAttribute: 'Sensitive user text' }] });
    expect(JSON.stringify(evidence)).not.toContain('Sensitive user text');
    expect(evidence.target).toEqual({ kind: 'selector', value: '<redacted-selector>' });
  });

  it('keeps a tiny target strictly inside while rejecting non-finite and viewport-boundary geometry', () => {
    const tiny = chooseInBoundsTargetPoint({ x: 0, y: 0, width: 1, height: 1 }, { width: 2, height: 2 });
    expect(tiny).toMatchObject({ ok: true, point: { x: 0.5, y: 0.5 } });
    expect(chooseInBoundsTargetPoint({ x: Number.NaN, y: 0, width: 10, height: 10 }, { width: 20, height: 20 })).toMatchObject({ ok: false });
    expect(chooseInBoundsTargetPoint({ x: 19, y: 0, width: 2, height: 2 }, { width: 20, height: 20 })).toMatchObject({ ok: false });
  });

  it('rejects invalid ids/actions/clocks without leaking their raw values', async () => {
    const secret = 'secret-action-text';
    await expect(runReadinessGate(port([{ x: 1, y: 1, width: 10, height: 10 }], { identical: true, contained: false }), { journeyId: 'J99' as never, action: secret as never, target: { testId: 'safe-id' } }, { yieldBetweenSamples: async () => undefined })).rejects.toMatchObject({ code: 'readiness-failed' });
    await expect(runReadinessGate(port([{ x: 1, y: 1, width: 10, height: 10 }], { identical: true, contained: false }), context, { now: () => new Date('invalid') })).rejects.toBeInstanceOf(RealPointerReadinessError);
  });

  it('wraps secret-bearing port failures in typed sanitized evidence', async () => {
    const failing: PointerPort = { viewport: () => ({ width: 10, height: 10 }), waitForNextAnimationFrame: async () => 1, sampleIntendedBbox: async () => { throw new Error('secret bbox failure'); }, resolveTopAtPoint: async () => null };
    await expect(runReadinessGate(failing, context, { yieldBetweenSamples: async () => undefined })).rejects.toMatchObject({ code: 'readiness-failed', evidence: { reason: 'observation-failed' } });
  });

  it('returns a fully shaped sanitized evidence record for invalid context and jitter exhaustion', async () => {
    const invalid = runReadinessGate(port([{ x: 1, y: 1, width: 10, height: 10 }], { identical: true, contained: false }), { journeyId: 'J99' as never, action: 'secret action' as never, target: { selector: '[data-x="secret"]' } });
    const invalidError = await invalid.catch((error: unknown) => error as RealPointerReadinessError);
    expect(invalidError).toBeInstanceOf(RealPointerReadinessError);
    expect(Object.keys(invalidError.evidence).sort()).toEqual([...SANITIZED_EVIDENCE_KEYS].sort());
    expect(invalidError.evidence).toMatchObject({ journeyId: '<invalid-journey>', action: '<invalid-action>', reason: 'observation-failed' });
    expect(JSON.stringify(invalidError.evidence)).not.toContain('secret');
    let frame = 0;
    const jitter = { viewport: () => ({ width: 100, height: 100 }), waitForNextAnimationFrame: async () => ++frame, sampleIntendedBbox: (() => { let index = 0; return async () => ({ x: index++ % 2, y: 1, width: 10, height: 10 }); })(), resolveTopAtPoint: async () => null } as PointerPort;
    await expect(runReadinessGate(jitter, context, { yieldBetweenSamples: async () => undefined })).rejects.toMatchObject({ evidence: { reason: 'bbox-unstable', sampledBboxes: expect.any(Array) } });
  });

  it('never crosses the JSHandle channel and wraps action failure', async () => {
    const page = {
      viewportSize: () => ({ width: 100, height: 100 }),
      evaluateHandle: vi.fn(),
      evaluate: pageEvaluateWithFrames(),
      mouse: { click: vi.fn(async () => { throw new Error('secret click'); }), dblclick: vi.fn(async () => { throw new Error('secret double click'); }), move: vi.fn(), down: vi.fn(), up: vi.fn() },
    };
    const locator = {
      boundingBox: vi.fn(async () => ({ x: 1, y: 1, width: 20, height: 20 })),
      evaluate: vi.fn(async () => mockHit(true)),
    };
    const resolved = await makePlaywrightPointerPort(page as never, locator as never).resolveTopAtPoint({ x: 2, y: 2 });
    expect(resolved?.contained).toBe(true);
    expect(page.evaluateHandle).not.toHaveBeenCalled();
    expect(locator.evaluate).toHaveBeenCalledWith(expect.any(Function), { x: 2, y: 2 });
    await expect(realClick(page as never, locator as never, context)).rejects.toBeInstanceOf(RealPointerActionError);
    await expect(realDblClick(page as never, locator as never, context)).rejects.toBeInstanceOf(RealPointerActionError);
    await expect(realContextClick(page as never, locator as never, context)).rejects.toBeInstanceOf(RealPointerActionError);
  });

  it('uses the exact validated screen point for clicks across border, padding, and zoom geometry', async () => {

    const mouse = { click: vi.fn(), dblclick: vi.fn(), move: vi.fn(), down: vi.fn(), up: vi.fn() };
    const page = {
      viewportSize: () => ({ width: 800, height: 600 }),
      evaluateHandle: vi.fn(async () => ({ dispose: vi.fn() })),
      evaluate: pageEvaluateWithFrames(),
      mouse,
    };
    const locator = {
      // This is already the transformed border-box in viewport coordinates.
      boundingBox: vi.fn(async () => ({ x: 31.5, y: 47.25, width: 123, height: 61.5 })),
      evaluate: vi.fn(async () => mockHit(true)),
      click: vi.fn(),
      dblclick: vi.fn(),
    };

    const clickEvidence = await realClick(page as never, locator as never, context);
    const doubleEvidence = await realDblClick(page as never, locator as never, context);
    expect(clickEvidence.point).toEqual({ x: 93, y: 78 });
    expect(doubleEvidence.point).toEqual(clickEvidence.point);
    expect(mouse.click).toHaveBeenCalledWith(93, 78);
    expect(mouse.dblclick).toHaveBeenCalledWith(93, 78);
    expect(locator.click).not.toHaveBeenCalled();
    expect(locator.dblclick).not.toHaveBeenCalled();
  });

  it.each([0, 1, -1, 1.5, Number.NaN, Number.POSITIVE_INFINITY])(
    'rejects invalid drag steps %s before any pointer movement or mouse-down',
    async (steps) => {
      const mouse = { click: vi.fn(), dblclick: vi.fn(), move: vi.fn(), down: vi.fn(), up: vi.fn() };
      const page = { mouse };
      await expect(realDrag(page as never, {} as never, {} as never, {
        journeyId: 'J05',
        source: { testId: 'source' },
        target: { testId: 'target' },
        steps,
      })).rejects.toBeInstanceOf(RangeError);
      expect(mouse.move).not.toHaveBeenCalled();
      expect(mouse.down).not.toHaveBeenCalled();
      expect(mouse.up).not.toHaveBeenCalled();
    },
  );

  it('orders source revalidation after hover before down, then target revalidation after move before up', async () => {
    const events: string[] = [];

    const page = {
      viewportSize: () => ({ width: 300, height: 200 }),
      evaluateHandle: vi.fn(async () => ({ dispose: vi.fn() })), evaluate: pageEvaluateWithFrames(),
      keyboard: { press: vi.fn() },
      mouse: { move: vi.fn(async () => { events.push('move'); }), down: vi.fn(async () => { events.push('down'); }), up: vi.fn(async () => { events.push('up'); }), click: vi.fn(), dblclick: vi.fn() },
    };
    const makeLocator = (name: string, x: number) => ({
      boundingBox: vi.fn(async () => { events.push(`${name}:bbox`); return { x, y: 10, width: 20, height: 20 }; }),
      evaluate: vi.fn(async () => mockHit(true)),
    });
    await realDrag(page as never, makeLocator('source', 10) as never, makeLocator('target', 80) as never, { journeyId: 'J05', source: { testId: 'source' }, target: { testId: 'target' } });
    expect(events.lastIndexOf('source:bbox')).toBeLessThan(events.indexOf('down'));
    expect(events.indexOf('move')).toBeLessThan(events.lastIndexOf('source:bbox'));
    expect(events.lastIndexOf('target:bbox')).toBeLessThan(events.lastIndexOf('up'));
    expect(events).toEqual(expect.arrayContaining(['move', 'down', 'up']));
  });

  it('releases once after a post-down target move failure and reports target evidence', async () => {

    let moveCount = 0;
    const mouse = { move: vi.fn(async () => { moveCount += 1; if (moveCount === 2) throw new Error('secret target move'); }), down: vi.fn(), up: vi.fn(), click: vi.fn(), dblclick: vi.fn() };
    const keyboard = { press: vi.fn() };
    const page = { viewportSize: () => ({ width: 300, height: 200 }), evaluateHandle: vi.fn(async () => ({ dispose: vi.fn() })), evaluate: pageEvaluateWithFrames(), keyboard, mouse };
    const locator = (x: number) => ({ boundingBox: vi.fn(async () => ({ x, y: 10, width: 20, height: 20 })), evaluate: vi.fn(async () => mockHit(true)) });
    await expect(realDrag(page as never, locator(10) as never, locator(80) as never, { journeyId: 'J05', source: { testId: 'source' }, target: { testId: 'target' } })).rejects.toMatchObject({ code: 'action-failed', evidence: { action: 'drag:target' } });
    expect(keyboard.press).toHaveBeenCalledWith('Escape');
    expect(mouse.up).toHaveBeenCalledOnce();
  });

  it('cancels a failed post-drag target validation and releases at source without checksum drift', async () => {

    let sourceX = 10;
    let pointer = { x: 20, y: 20 };
    let pressed = false;
    let cancelled = false;
    let previewTarget = false;
    let checksum = 'document-before';
    const mouse = {
      move: vi.fn(async (x: number, y: number) => {
        pointer = { x, y };
        if (pressed && x >= 80) previewTarget = true;
      }),
      down: vi.fn(async () => { pressed = true; }),
      up: vi.fn(async () => {
        if (pressed && previewTarget && !cancelled) checksum = 'document-mutated';
        pressed = false;
      }),
      click: vi.fn(),
      dblclick: vi.fn(),
    };
    const keyboard = {
      press: vi.fn(async (key: string) => {
        if (key === 'Escape') {
          cancelled = true;
          previewTarget = false;
          sourceX = 30;
        }
      }),
    };
    const page = {
      viewportSize: () => ({ width: 300, height: 200 }),
      evaluateHandle: vi.fn(async () => ({ dispose: vi.fn() })),
      evaluate: pageEvaluateWithFrames(),
      keyboard,
      mouse,
    };
    const source = {
      boundingBox: vi.fn(async () => ({ x: sourceX, y: 10, width: 20, height: 20 })),
      evaluate: vi.fn(async () => mockHit(true)),
    };
    const target = {
      boundingBox: vi.fn(async () => ({ x: 80, y: 10, width: 20, height: 20 })),
      evaluate: vi.fn(async () => mockHit(pointer.x < 80)),
    };

    await expect(realDrag(page as never, source as never, target as never, {
      journeyId: 'J05', source: { testId: 'source' }, target: { testId: 'target' }, steps: 4,
    })).rejects.toMatchObject({ code: 'readiness-failed', evidence: { action: 'drag:target', reason: 'overlay-interception' } });
    expect(keyboard.press).toHaveBeenCalledWith('Escape');
    expect(mouse.move).toHaveBeenLastCalledWith(40, 20, { steps: expect.any(Number) });
    expect(mouse.up).toHaveBeenCalledOnce();
    expect(checksum).toBe('document-before');
  });

  it('releases offscreen without checksum drift when abort source revalidation also fails', async () => {

    let pressed = false;
    let cancelled = false;
    let sourceAvailable = true;
    let checksum = 'document-before';
    const mouse = {
      move: vi.fn(async (x: number) => {
        if (pressed && x >= 80 && !cancelled) checksum = 'preview-only';
      }),
      down: vi.fn(async () => { pressed = true; }),
      up: vi.fn(async () => {
        if (pressed && !cancelled) checksum = 'document-mutated';
        pressed = false;
      }),
      click: vi.fn(),
      dblclick: vi.fn(),
    };
    const page = {
      viewportSize: () => ({ width: 300, height: 200 }),
      evaluateHandle: vi.fn(async () => ({ dispose: vi.fn() })),
      evaluate: pageEvaluateWithFrames(),
      keyboard: { press: vi.fn(async () => { cancelled = true; sourceAvailable = false; checksum = 'document-before'; }) },
      mouse,
    };
    const source = {
      boundingBox: vi.fn(async () => sourceAvailable ? { x: 10, y: 10, width: 20, height: 20 } : null),
      evaluate: vi.fn(async () => mockHit(true)),
    };
    let targetHit = true;
    const target = {
      boundingBox: vi.fn(async () => ({ x: 80, y: 10, width: 20, height: 20 })),
      evaluate: vi.fn(async () => {
        const result = mockHit(targetHit);
        targetHit = false;
        return result;
      }),
    };

    await expect(realDrag(page as never, source as never, target as never, {
      journeyId: 'J05', source: { testId: 'source' }, target: { testId: 'target' }, steps: 4,
    })).rejects.toMatchObject({ code: 'readiness-failed', evidence: { action: 'drag:target' } });
    expect(mouse.move).toHaveBeenLastCalledWith(-1, -1, { steps: expect.any(Number) });
    expect(mouse.up).toHaveBeenCalledOnce();
    expect(checksum).toBe('document-before');
  });

  it('retries an abort offscreen when the freshly revalidated source move fails', async () => {
    const calls: string[] = [];
    let moveCount = 0;
    const page = {
      keyboard: { press: vi.fn(async () => { calls.push('escape'); }) },
      mouse: {
        move: vi.fn(async (x: number, y: number) => {
          moveCount += 1;
          calls.push(`move:${x},${y}`);
          if (moveCount === 1) throw new Error('source moved during abort');
        }),
        up: vi.fn(async () => { calls.push('up'); }),
      },
    };
    const recovery = await safeAbortPressedPointer(
      page as never,
      port([{ x: 10, y: 10, width: 20, height: 20 }], { identical: true, contained: false }),
      { journeyId: 'J05', action: 'drag:source', target: { testId: 'source' } },
      4,
    );

    expect(calls).toEqual(['escape', 'move:20,20', 'escape', 'move:-1,-1', 'up']);
    expect(recovery).toMatchObject({ recovered: true, released: true, releasePoint: { x: -1, y: -1 } });
  });

  it('never masks a frozen original error when cleanup evidence cannot be attached', () => {
    const original = Object.freeze(new Error('original failure'));
    const recovery = {
      recovered: false,
      released: false,
      releasePoint: { x: -1, y: -1 },
      sourceEvidence: null,
    } as const;

    expect(annotatePointerAbortRecovery(original, recovery)).toBe(original);
    expect((original as PointerAbortAnnotatedError).pointerAbortRecovery).toBeUndefined();
  });

  it('reports geometry changes before down with a non-ok readiness reason', async () => {

    let sourceSamples = 0;
    const mouse = { move: vi.fn(), down: vi.fn(), up: vi.fn(), click: vi.fn(), dblclick: vi.fn() };
    const page = { viewportSize: () => ({ width: 300, height: 200 }), evaluateHandle: vi.fn(async () => ({ dispose: vi.fn() })), evaluate: pageEvaluateWithFrames(), keyboard: { press: vi.fn() }, mouse };
    const source = {
      boundingBox: vi.fn(async () => ({ x: sourceSamples++ < 4 ? 10 : 11, y: 10, width: 20, height: 20 })),
      evaluate: vi.fn(async () => mockHit(true)),
    };
    const target = { boundingBox: vi.fn(async () => ({ x: 80, y: 10, width: 20, height: 20 })), evaluate: source.evaluate };

    await expect(realDrag(page as never, source as never, target as never, { journeyId: 'J05', source: { testId: 'source' }, target: { testId: 'target' } })).rejects.toMatchObject({ code: 'readiness-failed', evidence: { reason: 'geometry-changed', action: 'drag:source' } });
    expect(mouse.down).not.toHaveBeenCalled();
    expect(mouse.up).not.toHaveBeenCalled();
  });

  it('surfaces a typed target-phase error when release cleanup also fails', async () => {

    let moveCount = 0;
    const mouse = {
      move: vi.fn(async () => { moveCount += 1; if (moveCount === 2) throw new Error('secret move'); }),
      down: vi.fn(),
      up: vi.fn(async () => { throw new Error('secret release'); }),
      click: vi.fn(),
      dblclick: vi.fn(),
    };
    const page = { viewportSize: () => ({ width: 300, height: 200 }), evaluateHandle: vi.fn(async () => ({ dispose: vi.fn() })), evaluate: pageEvaluateWithFrames(), keyboard: { press: vi.fn() }, mouse };
    const locator = (x: number) => ({ boundingBox: vi.fn(async () => ({ x, y: 10, width: 20, height: 20 })), evaluate: vi.fn(async () => mockHit(true)) });

    let error: unknown;
    try {
      await realDrag(page as never, locator(10) as never, locator(80) as never, { journeyId: 'J05', source: { testId: 'source' }, target: { testId: 'target' } });
    } catch (caught) {
      error = caught;
    }
    expect(error).toBeInstanceOf(RealPointerActionError);
    expect((error as RealPointerActionError).evidence).toMatchObject({ action: 'drag:target', target: { kind: 'testid', value: 'target' } });
    expect((error as PointerAbortAnnotatedError).pointerAbortRecovery).toMatchObject({
      recovered: false,
      released: false,
      releasePoint: { x: 20, y: 20 },
    });
    expect(JSON.stringify(error)).not.toContain('secret');
    expect(mouse.up).toHaveBeenCalledOnce();
  });
});

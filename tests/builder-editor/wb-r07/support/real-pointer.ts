/**
 * WB-R07 real-pointer support — honest readiness gate + real Playwright input.
 *
 * Design contract (see work order WB-R07-01):
 *
 * Before every user action this module:
 *   1. obtains the intended Playwright Locator bounding box;
 *   2. polls geometry until several consecutive equal bbox samples;
 *   3. chooses/validates an in-bounds target point;
 *   4. evaluates document.elementFromPoint solely to observe the DOM hit chain;
 *   5. requires the actual top element to equal or descend from the intended
 *      locator. Descendant acceptance is based on an in-page identity/containment
 *      check (element.contains(top)), never on selector/testid string matching.
 *
 * It then performs REAL Playwright input only:
 *   - page.mouse.click / dblclick at the exact validated viewport point,
 *   - page.mouse.click({ button: 'right' }) for context menus,
 *   - page.mouse.move/down/move(up) with steps for drags (revalidating source
 *     before mouse-down and target before mouse-up).
 *
 * Forbidden in production paths (enforced statically by support-policy.test.ts):
 *   no force option, no dispatchEvent, no constructed events (new MouseEvent…),
 *   no HTMLElement.click / DOM click, no trial click as the action,
 *   no waitForTimeout / sleeps as readiness, no global animation disabling,
 *   no evaluate mutation.
 *
 * The module is split into PURE helpers (fully unit-testable without a browser)
 * and thin Playwright-backed action shells that compose them. Unit tests drive
 * the gate through an injectable {@link PointerPort} so identity/containment
 * and evidence sanitation are exercised directly, never faking a PASS via a
 * selector string.
 */

import type { Locator, Page } from '@playwright/test';
import { JOURNEY_IDS, type JourneyId } from './journey-manifest';

// ---------------------------------------------------------------------------
// Public value types
// ---------------------------------------------------------------------------

export interface BboxSample {
  readonly x: number;
  readonly y: number;
  readonly width: number;
  readonly height: number;
}

export interface Point {
  readonly x: number;
  readonly y: number;
}

export interface ViewportInfo {
  readonly width: number;
  readonly height: number;
}

export type TargetDescriptor =
  | { readonly selector: string; readonly testId?: never }
  | { readonly testId: string; readonly selector?: never };

export interface SanitizedTargetDescriptor {
  readonly kind: 'selector' | 'testid';
  readonly value: string;
}

export const POINTER_ACTIONS = Object.freeze([
  'click',
  'dblclick',
  'contextmenu',
  'drag:source',
  'drag:target',
] as const);

export type PointerAction = typeof POINTER_ACTIONS[number];

/**
 * A sanitized DOM-chain entry. Deliberately contains ONLY structural
 * identifiers — never innerText, textContent, or other user-facing data.
 */
export interface DomChainEntry {
  readonly tagName: string;
  readonly role: string;
  readonly dataTestId: string;
  readonly dataNodeId: string;
  readonly idAttribute: string;
}

export type ReadinessReason =
  | 'ok'
  | 'bbox-unstable'
  | 'out-of-bounds'
  | 'no-element'
  | 'overlay-interception'
  | 'observation-failed'
  | 'geometry-changed';

export interface ReadinessDecision {
  readonly ready: boolean;
  readonly reason: ReadinessReason;
}

export interface TopHitResolution {
  /** elementFromPoint result is the exact same DOM node as the intended locator. */
  readonly identical: boolean;
  /** intended locator element.contains(top element) — true when the hit is a descendant. */
  readonly contained: boolean;
  /** Sanitized descriptor of the elementFromPoint top element. */
  readonly top: DomChainEntry | null;
  /** Sanitized ancestor chain (top -> root), capped, no text content. */
  readonly chain: readonly DomChainEntry[];
}

/**
 * Structured, sanitized evidence collected for every action. Contains geometry,
 * structural descriptors, viewport, and a UTC timestamp — never text content.
 */
export interface SanitizedEvidence {
  readonly journeyId: JourneyId | '<invalid-journey>';
  readonly action: PointerAction | '<invalid-action>';
  readonly target: SanitizedTargetDescriptor;
  readonly point: Point;
  readonly stableBbox: BboxSample | null;
  readonly equalSampleCount: number;
  readonly sampledBboxes: readonly BboxSample[];
  readonly topHit: DomChainEntry | null;
  readonly domChain: readonly DomChainEntry[];
  readonly identical: boolean;
  readonly contained: boolean;
  readonly viewport: ViewportInfo;
  readonly timestampUtc: string;
  readonly reason: ReadinessReason;
}

/**
 * The exact set of keys permitted on {@link SanitizedEvidence}. The policy test
 * asserts no text-bearing keys (innerText/textContent/value/etc.) ever appear.
 */
export const SANITIZED_EVIDENCE_KEYS: readonly string[] = Object.freeze([
  'journeyId',
  'action',
  'target',
  'point',
  'stableBbox',
  'equalSampleCount',
  'sampledBboxes',
  'topHit',
  'domChain',
  'identical',
  'contained',
  'viewport',
  'timestampUtc',
  'reason',
]);

// ---------------------------------------------------------------------------
// Typed sanitized error
// ---------------------------------------------------------------------------

export interface PartialEvidence {
  readonly journeyId?: JourneyId;
  readonly action?: unknown;
  readonly target?: TargetDescriptor;
  readonly point?: Point;
  readonly stableBbox?: BboxSample | null;
  readonly equalSampleCount?: number;
  readonly sampledBboxes?: readonly BboxSample[];
  readonly topHit?: DomChainEntry | null;
  readonly domChain?: readonly DomChainEntry[];
  readonly identical?: boolean;
  readonly contained?: boolean;
  readonly viewport?: ViewportInfo;
  readonly reason?: ReadinessReason;
}

/**
 * Typed error thrown on any readiness/ownership failure. Its message is built
 * ONLY from structural/geometric fields, so it never leaks user-facing text.
 */
export class RealPointerReadinessError extends Error {
  readonly code = 'readiness-failed' as const;
  readonly evidence: Readonly<SanitizedEvidence>;
  constructor(evidence: SanitizedEvidence) {
    super(buildSanitizedMessage(evidence));
    this.name = 'RealPointerReadinessError';
    this.evidence = evidence;
  }
}

export class RealPointerActionError extends Error {
  readonly code = 'action-failed' as const;
  constructor(readonly evidence: SanitizedEvidence) {
    super(`real-pointer action failed: action=${evidence.action} target=${evidence.target.kind}`);
    this.name = 'RealPointerActionError';
  }
}

function buildSanitizedMessage(evidence: SanitizedEvidence): string {
  const reason = evidence.reason ?? 'unknown';
  const action = sanitizeAction(evidence.action) || 'action';
  const target = evidence.target.kind;
  const point =
    evidence.point != null
      ? `(${round(evidence.point.x)},${round(evidence.point.y)})`
      : '(?,?)';
  const viewport = evidence.viewport
    ? `${round(evidence.viewport.width)}x${round(evidence.viewport.height)}`
    : '?x?';
  return `real-pointer readiness failed: reason=${reason} action=${action} target=${target} point=${point} viewport=${viewport}`;
}

function round(value: number): number {
  return Number.isFinite(value) ? Math.round(value * 100) / 100 : NaN;
}

// ---------------------------------------------------------------------------
// Production defaults (strict). Option injection is permitted only for
// deterministic unit tests; the defaults are never weakened.
// ---------------------------------------------------------------------------

export const DEFAULT_REQUIRED_EQUAL_SAMPLES = 3;
export const DEFAULT_MAX_POLL_ATTEMPTS = 30;
export const DEFAULT_BBOX_EPSILON = 0.5;
export const DEFAULT_DRAG_STEPS = 10;
export const MIN_REAL_DRAG_STEPS = 2;
const OFFSCREEN_ABORT_POINT: Point = Object.freeze({ x: -1, y: -1 });

export interface GateOptions {
  /** Consecutive equal bbox samples required before declaring geometry stable. */
  readonly requiredEqualSamples?: number;
  /** Maximum bbox samples taken while hunting for stability. */
  readonly maxPollAttempts?: number;
  /** Sub-pixel tolerance when comparing two bboxes for equality. */
  readonly epsilon?: number;
  /** Optional extra settling hook. It never replaces the port's real-frame wait. */
  readonly yieldBetweenSamples?: () => Promise<void>;
  readonly now?: () => Date;
}

export interface ActionContext {
  readonly journeyId: JourneyId;
  readonly action: PointerAction;
  readonly target: TargetDescriptor;
}

// ---------------------------------------------------------------------------
// Pure geometry helpers
// ---------------------------------------------------------------------------

function bboxesEqual(a: BboxSample, b: BboxSample, epsilon: number): boolean {
  return (
    Math.abs(a.x - b.x) <= epsilon &&
    Math.abs(a.y - b.y) <= epsilon &&
    Math.abs(a.width - b.width) <= epsilon &&
    Math.abs(a.height - b.height) <= epsilon
  );
}

/**
 * Determine whether the trailing samples form a stable (consecutively equal)
 * run of the required length. Pure and side-effect free.
 */
export function computeStableBbox(
  samples: readonly BboxSample[],
  requiredEqualSamples = DEFAULT_REQUIRED_EQUAL_SAMPLES,
  epsilon = DEFAULT_BBOX_EPSILON,
): { stable: boolean; stableBbox: BboxSample | null; equalRun: number } {
  if (!Number.isInteger(requiredEqualSamples) || requiredEqualSamples < 2) {
    throw new Error('requiredEqualSamples must be an integer >= 2');
  }
  if (!Number.isFinite(epsilon) || epsilon < 0) {
    throw new Error('epsilon must be finite and non-negative');
  }
  if (samples.length === 0) {
    return { stable: false, stableBbox: null, equalRun: 0 };
  }
  if (samples.length < requiredEqualSamples) {
    return { stable: false, stableBbox: null, equalRun: samples.length };
  }
  const tail = samples.slice(-requiredEqualSamples);
  const first = tail[0];
  const allEqual = tail.every((sample) => bboxesEqual(sample, first, epsilon));
  if (!allEqual) {
    return { stable: false, stableBbox: null, equalRun: 0 };
  }
  return { stable: true, stableBbox: first, equalRun: requiredEqualSamples };
}

/**
 * Choose a target point strictly inside the bbox and inside the viewport.
 * Returns a result discriminated by `ok`; callers attach full evidence when
 * throwing. Pure and side-effect free.
 */
export function chooseInBoundsTargetPoint(
  bbox: BboxSample,
  viewport: ViewportInfo,
): { ok: true; point: Point } | { ok: false; reason: 'out-of-bounds' } {
  if (![bbox.x, bbox.y, bbox.width, bbox.height, viewport.width, viewport.height].every(Number.isFinite)
    || !(bbox.width > 0) || !(bbox.height > 0) || !(viewport.width > 0) || !(viewport.height > 0)) {
    return { ok: false, reason: 'out-of-bounds' };
  }
  const x = bbox.x + bbox.width / 2;
  const y = bbox.y + bbox.height / 2;
  if (!(x > bbox.x && x < bbox.x + bbox.width && y > bbox.y && y < bbox.y + bbox.height)
    || !(x > 0 && y > 0 && x < viewport.width && y < viewport.height)) {
    return { ok: false, reason: 'out-of-bounds' };
  }
  return { ok: true, point: { x, y } };
}

/**
 * Decide readiness from the identity/containment resolution. This is the core
 * honesty gate: a hit is acceptable only when it is the intended element or a
 * DOM descendant of it (verified by an in-page element.contains check upstream).
 * Anything else is an overlay interception.
 */
export function decideReadiness(resolution: TopHitResolution): ReadinessDecision {
  if (resolution.identical || resolution.contained) {
    return { ready: true, reason: 'ok' };
  }
  return { ready: false, reason: 'overlay-interception' };
}

// ---------------------------------------------------------------------------
// Evidence sanitation
// ---------------------------------------------------------------------------

function sanitizeChainEntry(input: Partial<DomChainEntry> | null | undefined): DomChainEntry {
  return {
    tagName: sanitizeToken(input?.tagName).toLowerCase(),
    role: sanitizeToken(input?.role),
    dataTestId: sanitizeToken(input?.dataTestId),
    dataNodeId: sanitizeToken(input?.dataNodeId),
    idAttribute: sanitizeToken(input?.idAttribute),
  };
}

function sanitizeBbox(input: Partial<BboxSample> | null | undefined): BboxSample {
  return {
    x: finiteOrZero(input?.x),
    y: finiteOrZero(input?.y),
    width: finiteOrZero(input?.width),
    height: finiteOrZero(input?.height),
  };
}

function stringify(value: unknown): string {
  return typeof value === 'string' ? value : '';
}

function sanitizeToken(value: unknown): string {
  const token = stringify(value);
  return /^[A-Za-z][A-Za-z0-9_.:-]{0,79}$/u.test(token) ? token : '';
}

function sanitizeAction(value: unknown): PointerAction | '' {
  return typeof value === 'string' && (POINTER_ACTIONS as readonly string[]).includes(value)
    ? value as PointerAction
    : '';
}

function validJourneyId(value: unknown): value is JourneyId {
  return typeof value === 'string' && (JOURNEY_IDS as readonly string[]).includes(value);
}

function sanitizeTarget(target: TargetDescriptor | undefined): SanitizedTargetDescriptor {
  if (target && typeof target.testId === 'string' && typeof target.selector !== 'string') {
    return { kind: 'testid', value: sanitizeToken(target.testId) || '<redacted>' };
  }
  if (target && typeof target.selector === 'string' && typeof target.testId !== 'string') {
    return { kind: 'selector', value: '<redacted-selector>' };
  }
  return { kind: 'selector', value: '<redacted>' };
}

function finiteOrZero(value: unknown): number {
  return typeof value === 'number' && Number.isFinite(value) ? value : 0;
}

/**
 * Assemble a fully sanitized evidence record. Coerces every field to its safe
 * shape and rejects any text-bearing payload. Pure and side-effect free.
 */
export function sanitizeEvidence(input: PartialEvidence, now: () => Date = () => new Date()): SanitizedEvidence {
  let timestampUtc: string;
  try {
    timestampUtc = now().toISOString();
  } catch {
    timestampUtc = new Date().toISOString();
  }
  const evidence: SanitizedEvidence = {
    journeyId: validJourneyId(input.journeyId) ? input.journeyId : '<invalid-journey>',
    action: sanitizeAction(input.action) || '<invalid-action>',
    target: sanitizeTarget(input.target),
    point: {
      x: finiteOrZero(input.point?.x),
      y: finiteOrZero(input.point?.y),
    },
    stableBbox: input.stableBbox ? sanitizeBbox(input.stableBbox) : null,
    equalSampleCount:
      typeof input.equalSampleCount === 'number' && Number.isFinite(input.equalSampleCount)
        ? Math.trunc(input.equalSampleCount)
        : 0,
    sampledBboxes: Array.isArray(input.sampledBboxes)
      ? input.sampledBboxes.map((sample) => sanitizeBbox(sample))
      : [],
    topHit: input.topHit ? sanitizeChainEntry(input.topHit) : null,
    domChain: Array.isArray(input.domChain)
      ? input.domChain.map((entry) => sanitizeChainEntry(entry))
      : [],
    identical: input.identical === true,
    contained: input.contained === true,
    viewport: {
      width: finiteOrZero(input.viewport?.width),
      height: finiteOrZero(input.viewport?.height),
    },
    timestampUtc,
    reason: input.reason ?? 'ok',
  };
  return evidence;
}

// ---------------------------------------------------------------------------
// Injected port — production binds to Playwright, tests bind to mocks
// ---------------------------------------------------------------------------

export interface PointerPort {
  /** Wait for the next distinct animation frame and return its monotonic stamp. */
  waitForNextAnimationFrame(): Promise<number>;
  /** Sample the intended locator's current bounding box (null if not present). */
  sampleIntendedBbox(): Promise<BboxSample | null>;
  /** Resolve document.elementFromPoint + in-page identity/containment vs intended. */
  resolveTopAtPoint(point: Point): Promise<TopHitResolution | null>;
  /** Current page viewport size. */
  viewport(): ViewportInfo;
}

export interface ReadinessResult {
  readonly point: Point;
  readonly evidence: SanitizedEvidence;
}

function resolveGateOptions(options?: GateOptions): {
  requiredEqualSamples: number;
  maxPollAttempts: number;
  epsilon: number;
  yieldBetweenSamples?: () => Promise<void>;
  now: () => Date;
} {
  const requiredEqualSamples =
    options?.requiredEqualSamples ?? DEFAULT_REQUIRED_EQUAL_SAMPLES;
  const maxPollAttempts = options?.maxPollAttempts ?? DEFAULT_MAX_POLL_ATTEMPTS;
  const epsilon = options?.epsilon ?? DEFAULT_BBOX_EPSILON;
  const yieldBetweenSamples = options?.yieldBetweenSamples;
  const now = options?.now ?? (() => new Date());
  if (!Number.isInteger(requiredEqualSamples) || requiredEqualSamples < DEFAULT_REQUIRED_EQUAL_SAMPLES) {
    throw new Error(`requiredEqualSamples must be an integer >= ${DEFAULT_REQUIRED_EQUAL_SAMPLES}`);
  }
  if (!Number.isInteger(maxPollAttempts) || maxPollAttempts < Math.max(requiredEqualSamples, DEFAULT_MAX_POLL_ATTEMPTS)) {
    throw new Error(`maxPollAttempts must be an integer >= ${DEFAULT_MAX_POLL_ATTEMPTS}`);
  }
  if (!Number.isFinite(epsilon) || epsilon < 0 || epsilon > DEFAULT_BBOX_EPSILON) {
    throw new Error(`epsilon must be finite and between 0 and ${DEFAULT_BBOX_EPSILON}`);
  }
  return { requiredEqualSamples, maxPollAttempts, epsilon, yieldBetweenSamples, now };
}

/**
 * The honesty gate. Polls geometry to stability, chooses an in-bounds point,
 * resolves the DOM hit at that point, and requires identity/containment. Throws
 * {@link RealPointerReadinessError} (carrying sanitized evidence) on any failure.
 *
 * Pure with respect to the injected {@link PointerPort}; no Playwright import is
 * required to run it, which is what makes the gate unit-testable.
 */
export async function runReadinessGate(
  port: PointerPort,
  context: ActionContext,
  options?: GateOptions,
): Promise<ReadinessResult> {
  if (!validJourneyId(context.journeyId) || !sanitizeAction(context.action)) {
    throw new RealPointerReadinessError(sanitizeEvidence({ ...context, reason: 'observation-failed' }));
  }
  let resolved: ReturnType<typeof resolveGateOptions>;
  try {
    resolved = resolveGateOptions(options);
  } catch {
    throw new RealPointerReadinessError(sanitizeEvidence({ ...context, reason: 'observation-failed' }));
  }
  let viewport: ViewportInfo;
  try { viewport = port.viewport(); } catch { throw new RealPointerReadinessError(sanitizeEvidence({ ...context, reason: 'observation-failed' })); }
  let timestampUtc: string;
  try { timestampUtc = resolved.now().toISOString(); } catch { throw new RealPointerReadinessError(sanitizeEvidence({ ...context, viewport, reason: 'observation-failed' })); }
  const evidence = (input: Omit<PartialEvidence, 'journeyId' | 'action' | 'target'>): SanitizedEvidence =>
    sanitizeEvidence({ ...context, ...input }, () => new Date(timestampUtc));

  const sampledBboxes: BboxSample[] = [];
  let stableBbox: BboxSample | null = null;
  let lastFrameStamp = Number.NEGATIVE_INFINITY;

  const sampleOnNextFrame = async (): Promise<BboxSample> => {
    try {
      await resolved.yieldBetweenSamples?.();
      const frameStamp = await port.waitForNextAnimationFrame();
      if (!Number.isFinite(frameStamp) || frameStamp <= lastFrameStamp) {
        throw new Error('non-distinct animation frame');
      }
      lastFrameStamp = frameStamp;
    } catch {
      throw new RealPointerReadinessError(evidence({ viewport, sampledBboxes, reason: 'observation-failed' }));
    }

    let sample: BboxSample | null;
    try {
      sample = await port.sampleIntendedBbox();
    } catch {
      throw new RealPointerReadinessError(evidence({ viewport, sampledBboxes, reason: 'observation-failed' }));
    }
    if (!sample) {
      throw new RealPointerReadinessError(evidence({ viewport, sampledBboxes, reason: 'no-element' }));
    }
    return sample;
  };

  for (let attempt = 0; attempt < resolved.maxPollAttempts; attempt += 1) {
    const sample = await sampleOnNextFrame();
    sampledBboxes.push(sample);
    const probe = computeStableBbox(
      sampledBboxes,
      resolved.requiredEqualSamples,
      resolved.epsilon,
    );
    if (probe.stable) {
      stableBbox = probe.stableBbox;
      break;
    }
  }

  if (!stableBbox) {
    throw new RealPointerReadinessError(evidence({ viewport, sampledBboxes, equalSampleCount: 0, reason: 'bbox-unstable' }));
  }

  // Stability is provisional until one more distinct frame is observed. The
  // final bbox below is the one used to choose the top-hit and action point.
  const finalBbox = await sampleOnNextFrame();
  sampledBboxes.push(finalBbox);
  if (!bboxesEqual(stableBbox, finalBbox, resolved.epsilon)) {
    throw new RealPointerReadinessError(evidence({
      viewport,
      sampledBboxes,
      stableBbox,
      equalSampleCount: resolved.requiredEqualSamples,
      reason: 'geometry-changed',
    }));
  }
  stableBbox = finalBbox;
  const finalEqualSampleCount = resolved.requiredEqualSamples + 1;

  const pointResult = chooseInBoundsTargetPoint(stableBbox, viewport);
  if (pointResult.ok === false) {
    throw new RealPointerReadinessError(evidence({ viewport, sampledBboxes, stableBbox, equalSampleCount: finalEqualSampleCount, reason: pointResult.reason }));
  }
  const point = pointResult.point;

  let resolution: TopHitResolution | null;
  try { resolution = await port.resolveTopAtPoint(point); } catch { throw new RealPointerReadinessError(evidence({ point, viewport, sampledBboxes, stableBbox, equalSampleCount: finalEqualSampleCount, reason: 'observation-failed' })); }
  if (!resolution) {
    throw new RealPointerReadinessError(evidence({ point, viewport, sampledBboxes, stableBbox, equalSampleCount: finalEqualSampleCount, reason: 'no-element' }));
  }

  const decision = decideReadiness(resolution);
  const finalEvidence = evidence({
    point,
    viewport,
    sampledBboxes,
    stableBbox,
    equalSampleCount: finalEqualSampleCount,
    topHit: resolution.top,
    domChain: resolution.chain,
    identical: resolution.identical,
    contained: resolution.contained,
    reason: decision.reason,
  });

  if (!decision.ready) {
    throw new RealPointerReadinessError(finalEvidence);
  }
  return { point, evidence: finalEvidence };
}

// ---------------------------------------------------------------------------
// Playwright-backed port + action shells
// ---------------------------------------------------------------------------

/**
 * Build a {@link PointerPort} bound to a real Playwright page + locator.
 *
 * The top-hit resolution is performed entirely IN-PAGE via a single
 * `locator.evaluate` call that receives a plain {x, y} point (never a
 * JSHandle): it calls `document.elementFromPoint(x, y)` and then checks
 * `intended === top` / `intended.contains(top)` against the locator's own
 * resolved element — a true DOM identity/containment test, never
 * selector/testid matching, and no cross-channel handle handoff.
 */
export function makePlaywrightPointerPort(page: Page, locator: Locator): PointerPort {
  return {
    waitForNextAnimationFrame: productionYield(page),
    viewport() {
      const size = page.viewportSize();
      return {
        width: size?.width ?? 0,
        height: size?.height ?? 0,
      };
    },
    async sampleIntendedBbox() {
      const box = await locator.boundingBox();
      if (!box) return null;
      return { x: box.x, y: box.y, width: box.width, height: box.height };
    },
    async resolveTopAtPoint(point: Point) {
      return locator.evaluate((intended, target) => {
        const top = document.elementFromPoint(target.x, target.y);
        if (!top) return null;
        const identical = intended === top;
        const contained = intended.contains(top);
        const chain: DomChainEntry[] = [];
        let cursor: Element | null = top;
        let guard = 0;
        while (cursor && guard < 12) {
          chain.push({
            tagName: cursor.tagName.toLowerCase(),
            role: cursor.getAttribute('role') ?? '',
            dataTestId: cursor.getAttribute('data-testid') ?? cursor.getAttribute('data-test-id') ?? '',
            dataNodeId: cursor.getAttribute('data-node-id') ?? '',
            idAttribute: cursor.id ?? '',
          });
          cursor = cursor.parentElement;
          guard += 1;
        }
        return { identical, contained, top: chain[0] ?? null, chain } as TopHitResolution;
      }, point);
    },
  };
}

function productionYield(page: Page): () => Promise<number> {
  // Read-only frame yield for sampling cadence. Two nested callbacks guarantee
  // that consecutive protocol round-trips cannot both resolve in the same
  // animation frame (Chromium may otherwise return the same rAF timestamp).
  // This does NOT disable animations or mutate the DOM.
  return async () => {
    return page.evaluate(
      () =>
        new Promise<number>((resolve) => {
          requestAnimationFrame(() => {
            requestAnimationFrame((timestamp) => resolve(timestamp));
          });
        }),
    );
  };
}

function buildGateOptions(): GateOptions {
  return {
    requiredEqualSamples: DEFAULT_REQUIRED_EQUAL_SAMPLES,
    maxPollAttempts: DEFAULT_MAX_POLL_ATTEMPTS,
    epsilon: DEFAULT_BBOX_EPSILON,
    now: () => new Date(),
  };
}

export interface RealActionOptions {
  readonly journeyId: JourneyId;
  readonly target: TargetDescriptor;
}

/**
 * Real click via Playwright's mouse at the exact validated viewport point. This
 * avoids translating a border-box point into locator padding-box coordinates.
 */
export async function realClick(
  page: Page,
  locator: Locator,
  options: RealActionOptions,
): Promise<SanitizedEvidence> {
  const port = makePlaywrightPointerPort(page, locator);
  const { point, evidence } = await runReadinessGate(
    port,
    { journeyId: options.journeyId, action: 'click', target: options.target },
    buildGateOptions(),
  );
  try { await page.mouse.click(point.x, point.y); } catch { throw new RealPointerActionError(evidence); }
  return evidence;
}

/** Real double-click at the exact validated viewport point. */
export async function realDblClick(
  page: Page,
  locator: Locator,
  options: RealActionOptions,
): Promise<SanitizedEvidence> {
  const port = makePlaywrightPointerPort(page, locator);
  const { point, evidence } = await runReadinessGate(
    port,
    { journeyId: options.journeyId, action: 'dblclick', target: options.target },
    buildGateOptions(),
  );
  try { await page.mouse.dblclick(point.x, point.y); } catch { throw new RealPointerActionError(evidence); }
  return evidence;
}

/**
 * Real context menu via page.mouse.click with button 'right' at the validated
 * absolute point. locator.click does not synthesize a secondary button, so the
 * real mouse path is used as specified.
 */
export async function realContextClick(
  page: Page,
  locator: Locator,
  options: RealActionOptions,
): Promise<SanitizedEvidence> {
  const port = makePlaywrightPointerPort(page, locator);
  const { point, evidence } = await runReadinessGate(
    port,
    { journeyId: options.journeyId, action: 'contextmenu', target: options.target },
    buildGateOptions(),
  );
  try { await page.mouse.click(point.x, point.y, { button: 'right' }); } catch { throw new RealPointerActionError(evidence); }
  return evidence;
}

export interface RealDragOptions {
  readonly journeyId: JourneyId;
  readonly source: TargetDescriptor;
  readonly target: TargetDescriptor;
  /** Number of real mouse move steps between source and target. */
  readonly steps?: number;
}

export interface RealDragEvidence {
  readonly source: SanitizedEvidence;
  readonly target: SanitizedEvidence;
}

export interface SafePointerAbortResult {
  readonly recovered: boolean;
  readonly released: boolean;
  readonly releasePoint: Point;
  readonly sourceEvidence: SanitizedEvidence | null;
}

export interface PointerAbortAnnotatedError extends Error {
  readonly pointerAbortRecovery?: SafePointerAbortResult;
}

export function annotatePointerAbortRecovery(
  error: unknown,
  recovery: SafePointerAbortResult,
): unknown {
  if (error instanceof Error && !recovery.recovered) {
    try {
      Object.defineProperty(error, 'pointerAbortRecovery', {
        configurable: true,
        enumerable: false,
        value: recovery,
        writable: false,
      });
    } catch {
      // Annotation is evidence-only and must never replace the action failure.
    }
  }
  return error;
}

export async function safeAbortPressedPointer(
  page: Page,
  sourcePort: PointerPort,
  sourceContext: ActionContext,
  requestedSteps = DEFAULT_DRAG_STEPS,
): Promise<SafePointerAbortResult> {
  if (!Number.isInteger(requestedSteps) || !Number.isFinite(requestedSteps) || requestedSteps < MIN_REAL_DRAG_STEPS) {
    throw new RangeError(`steps must be a finite integer >= ${MIN_REAL_DRAG_STEPS}`);
  }
  let recoveryFailed = false;
  let released = false;
  const recoverySteps = Math.max(MIN_REAL_DRAG_STEPS, Math.min(requestedSteps, DEFAULT_DRAG_STEPS));

  try { await page.keyboard.press('Escape'); } catch { recoveryFailed = true; }
  let safeSourcePoint: Point | null = null;
  let sourceEvidence: SanitizedEvidence | null = null;
  try {
    const sourceResult = await runReadinessGate(sourcePort, sourceContext, buildGateOptions());
    safeSourcePoint = sourceResult.point;
    sourceEvidence = sourceResult.evidence;
  } catch {
    recoveryFailed = true;
  }
  let releasePoint = safeSourcePoint ?? OFFSCREEN_ABORT_POINT;
  let movedToSafePoint = false;
  try {
    await page.mouse.move(releasePoint.x, releasePoint.y, { steps: recoverySteps });
    movedToSafePoint = true;
  } catch {
    try { await page.keyboard.press('Escape'); } catch { recoveryFailed = true; }
    releasePoint = OFFSCREEN_ABORT_POINT;
    try {
      await page.mouse.move(releasePoint.x, releasePoint.y, { steps: recoverySteps });
      movedToSafePoint = true;
    } catch {
      recoveryFailed = true;
    }
  }
  if (!movedToSafePoint) recoveryFailed = true;
  try {
    await page.mouse.up();
    released = true;
  } catch {
    recoveryFailed = true;
  }
  return {
    recovered: !recoveryFailed && released,
    released,
    releasePoint,
    sourceEvidence,
  };
}

/**
 * Real drag using page.mouse move/down/move/up with steps. The source locator
 * is revalidated (full gate) before mouse-down, and the target locator is
 * revalidated (full gate) before mouse-up, so both endpoints are guaranteed
 * un-obscured at the moment of input.
 */
export async function realDrag(
  page: Page,
  sourceLocator: Locator,
  targetLocator: Locator,
  options: RealDragOptions,
): Promise<RealDragEvidence> {
  const steps = options.steps ?? DEFAULT_DRAG_STEPS;
  if (!Number.isInteger(steps) || !Number.isFinite(steps) || steps < MIN_REAL_DRAG_STEPS) {
    throw new RangeError(`steps must be a finite integer >= ${MIN_REAL_DRAG_STEPS}`);
  }

  const sourcePort = makePlaywrightPointerPort(page, sourceLocator);
  const sourceResult = await runReadinessGate(
    sourcePort,
    { journeyId: options.journeyId, action: 'drag:source', target: options.source },
    buildGateOptions(),
  );
  let pressed = false;
  let released = false;
  let sourceFinal: ReadinessResult | null = null;
  let latestEvidence = sourceResult.evidence;
  try {
    await page.mouse.move(sourceResult.point.x, sourceResult.point.y);
    sourceFinal = await runReadinessGate(sourcePort, { journeyId: options.journeyId, action: 'drag:source', target: options.source }, buildGateOptions());
    latestEvidence = sourceFinal.evidence;
    if (sourceFinal.point.x !== sourceResult.point.x || sourceFinal.point.y !== sourceResult.point.y) throw new RealPointerReadinessError({ ...sourceFinal.evidence, reason: 'geometry-changed' });
    await page.mouse.down();
    pressed = true;
    const targetPort = makePlaywrightPointerPort(page, targetLocator);
    const targetResult = await runReadinessGate(targetPort, { journeyId: options.journeyId, action: 'drag:target', target: options.target }, buildGateOptions());
    latestEvidence = targetResult.evidence;
    await page.mouse.move(targetResult.point.x, targetResult.point.y, { steps });
    const targetFinal = await runReadinessGate(targetPort, { journeyId: options.journeyId, action: 'drag:target', target: options.target }, buildGateOptions());
    latestEvidence = targetFinal.evidence;
    if (targetFinal.point.x !== targetResult.point.x || targetFinal.point.y !== targetResult.point.y) throw new RealPointerReadinessError({ ...targetFinal.evidence, reason: 'geometry-changed' });
    await page.mouse.up();
    released = true;
    return { source: sourceFinal.evidence, target: targetFinal.evidence };
  } catch (error) {
    const originalFailure = error instanceof RealPointerReadinessError || error instanceof RealPointerActionError
      ? error
      : new RealPointerActionError(latestEvidence);
    if (pressed && !released && sourceFinal) {
      const recovery = await safeAbortPressedPointer(
        page,
        sourcePort,
        { journeyId: options.journeyId, action: 'drag:source', target: options.source },
        steps,
      );
      released = recovery.released;
      annotatePointerAbortRecovery(originalFailure, recovery);
    }
    throw originalFailure;
  }
}

/**
 * WB-R07 real-pointer journeys J06–J10.
 *
 * One honest Playwright test per canonical journey. Every pointer endpoint is
 * driven by the WB-R07 support (`realClick`/`realDrag` or
 * `makePlaywrightPointerPort` + `runReadinessGate` + real `page.mouse`/
 * `page.keyboard`). There is no synthetic event construction, no DOM mutation
 * in evaluate, no `force`/`trial`, no `waitForTimeout`/sleep readiness, no
 * `addStyleTag`, and no raw `.click()`.
 *
 * Each test binds to the canonical journey manifest entry (title + literal
 * line assertion) so description drift is impossible, and proves ownership of
 * the J06–J10 journeys by building/validating a fixture document that carries
 * the full canonical manifest against the isolated QA namespace root.
 */
import { expect, test, type APIRequestContext, type Locator, type Page } from '@playwright/test';
import {
  annotatePointerAbortRecovery,
  DEFAULT_BBOX_EPSILON,
  DEFAULT_MAX_POLL_ATTEMPTS,
  DEFAULT_REQUIRED_EQUAL_SAMPLES,
  makePlaywrightPointerPort,
  realClick,
  realDrag,
  runReadinessGate,
  safeAbortPressedPointer,
  sanitizeEvidence,
  type BboxSample,
  type GateOptions,
  type Point,
  type SanitizedEvidence,
} from '../support/real-pointer';
import {
  JOURNEY_ENTRIES,
  JOURNEY_IDS,
  type JourneyId,
} from '../support/journey-manifest';
import {
  createFixtureDocument,
  validateFixtureDocument,
} from '../support/fixture-document';

// ---------------------------------------------------------------------------
// Journey binding
// ---------------------------------------------------------------------------

function journeyEntry(id: JourneyId) {
  const entry = JOURNEY_ENTRIES.find((candidate) => candidate.id === id);
  if (!entry) throw new Error(`WB-R07 journey entry missing for ${id}`);
  return entry;
}

const J06 = journeyEntry('J06');
const J07 = journeyEntry('J07');
const J08 = journeyEntry('J08');
const J09 = journeyEntry('J09');
const J10 = journeyEntry('J10');

const UNDO_SHORTCUT = 'ControlOrMeta+Z';

// ---------------------------------------------------------------------------
// Minimal honest editor open / ready wait (no addStyleTag, no force)
// ---------------------------------------------------------------------------

async function openIsolatedBuilder(page: Page, pageId: string, token: string, tag: string): Promise<void> {
  const url = `/ko/admin-builder?pageId=${encodeURIComponent(pageId)}&${tag}=${token}`;
  await page.goto(url, { waitUntil: 'domcontentloaded' });
  const shell = page.locator('[data-editor-shell]').first();
  await expect(shell).toBeVisible({ timeout: 30_000 });
  await expect(shell).toHaveAttribute('data-editor-ready', 'true', { timeout: 30_000 });
  await expect(page.getByRole('application', { name: 'Canvas editor' })).toBeVisible({ timeout: 30_000 });
}

function collectBrowserErrors(page: Page): string[] {
  const errors: string[] = [];
  page.on('console', (message) => {
    if (message.type() === 'error') errors.push(`console: ${message.text()}`);
  });
  page.on('pageerror', (error) => {
    errors.push(`pageerror: ${error.message}`);
  });
  return errors;
}

async function routeExternalFonts(page: Page): Promise<void> {
  await page.route('https://fonts.googleapis.com/**', (route) =>
    route.fulfill({ status: 200, contentType: 'text/css', body: '' }),
  );
  await page.route('https://fonts.gstatic.com/**', (route) =>
    route.fulfill({ status: 200, contentType: 'font/woff2', body: '' }),
  );
}

// ---------------------------------------------------------------------------
// API fixture helpers (isolated page per test; best-effort delete in finally)
// ---------------------------------------------------------------------------

function mutationHeaders(scope: string): Record<string, string> {
  const safeScope = scope.replace(/[^a-z0-9-]/gi, '-').slice(-48) || 'wb-r07-j06j10';
  return { 'x-forwarded-for': `pw-${safeScope}` };
}

function defaultNodeStyle() {
  return {
    backgroundColor: 'transparent',
    borderColor: '#cbd5e1',
    borderStyle: 'solid',
    borderWidth: 0,
    borderRadius: 12,
    shadowX: 0,
    shadowY: 0,
    shadowBlur: 0,
    shadowSpread: 0,
    shadowColor: 'rgba(15, 23, 42, 0.16)',
    opacity: 100,
  };
}

interface LocalRect {
  readonly x: number;
  readonly y: number;
  readonly width: number;
  readonly height: number;
}

type TextContent = {
  readonly text: string;
  readonly fontSize: number;
  readonly color: string;
  readonly fontWeight: string;
  readonly align: 'center' | 'left';
  readonly lineHeight: number;
  readonly letterSpacing: number;
  readonly fontFamily: string;
};

function makeTextNode(
  id: string,
  rect: LocalRect,
  text: string,
  zIndex: number,
  align: 'center' | 'left' = 'left',
): Record<string, unknown> {
  const content: TextContent = {
    text,
    fontSize: 18,
    color: '#0f172a',
    fontWeight: 'bold',
    align,
    lineHeight: 1.2,
    letterSpacing: 0,
    fontFamily: 'system-ui',
  };
  return {
    id,
    kind: 'text',
    rect,
    style: defaultNodeStyle(),
    zIndex,
    rotation: 0,
    locked: false,
    visible: true,
    content,
  };
}

interface CreatePageResult {
  readonly pageId: string;
  readonly slug: string;
}

async function createBlankPage(request: APIRequestContext, token: string, tag: string): Promise<CreatePageResult> {
  const slug = `wb-r07-${tag}-${token}`;
  const response = await request.post('/api/builder/site/pages', {
    data: { locale: 'ko', slug, title: `WB-R07 ${tag} ${token}`, blank: true },
    headers: mutationHeaders(slug),
  });
  if (response.status() !== 200) {
    throw new Error(`createBlankPage(${tag}) expected HTTP 200, got ${response.status()}`);
  }
  const payload = (await response.json()) as { success?: boolean; pageId?: string; error?: string };
  if (!payload.success) throw new Error(`createBlankPage(${tag}) failed: ${payload.error ?? 'no success'}`);
  if (!payload.pageId) throw new Error(`createBlankPage(${tag}) returned no pageId`);
  return { pageId: payload.pageId, slug };
}

async function createDocumentPage(
  request: APIRequestContext,
  token: string,
  tag: string,
  document: Record<string, unknown>,
): Promise<CreatePageResult> {
  const slug = `wb-r07-${tag}-${token}`;
  const response = await request.post('/api/builder/site/pages', {
    data: { locale: 'ko', slug, title: `WB-R07 ${tag} ${token}`, document },
    headers: mutationHeaders(slug),
  });
  if (response.status() !== 200) {
    throw new Error(`createDocumentPage(${tag}) expected HTTP 200, got ${response.status()}`);
  }
  const payload = (await response.json()) as { success?: boolean; pageId?: string; error?: string };
  if (!payload.success) throw new Error(`createDocumentPage(${tag}) failed: ${payload.error ?? 'no success'}`);
  if (!payload.pageId) throw new Error(`createDocumentPage(${tag}) returned no pageId`);
  return { pageId: payload.pageId, slug };
}

async function deletePage(request: APIRequestContext, page: CreatePageResult): Promise<void> {
  await request.delete(`/api/builder/site/pages/${encodeURIComponent(page.pageId)}?locale=ko`, {
    failOnStatusCode: false,
    headers: mutationHeaders(page.slug),
  });
}

// ---------------------------------------------------------------------------
// Defensive draft parsing
// ---------------------------------------------------------------------------

interface DraftNode {
  readonly id: string;
  readonly rect: LocalRect;
  readonly rotation: number;
  readonly zIndex: number;
  readonly parentId: string | null;
  readonly serialized: string;
}

function readRecord(value: unknown): Record<string, unknown> | null {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : null;
}

function readNumber(value: unknown): number | null {
  return typeof value === 'number' && Number.isFinite(value) ? value : null;
}

function readString(value: unknown): string | null {
  return typeof value === 'string' && value.length > 0 ? value : null;
}

function readRect(value: unknown): LocalRect | null {
  const record = readRecord(value);
  if (!record) return null;
  const x = readNumber(record.x);
  const y = readNumber(record.y);
  const width = readNumber(record.width);
  const height = readNumber(record.height);
  if (x === null || y === null || width === null || height === null) return null;
  return { height, width, x, y };
}

function readDraftNodes(payload: unknown): DraftNode[] {
  const root = readRecord(payload);
  const documentRecord = readRecord(root?.document);
  const nodeValues = documentRecord?.nodes;
  if (!Array.isArray(nodeValues)) {
    throw new Error(`draft document has no nodes array (keys: ${Object.keys(documentRecord ?? {}).join(',')})`);
  }
  return nodeValues.flatMap((value) => {
    const record = readRecord(value);
    if (!record) return [];
    const id = readString(record.id);
    const rect = readRect(record.rect);
    if (!id || !rect) return [];
    return [{
      id,
      rect,
      rotation: readNumber(record.rotation) ?? 0,
      zIndex: readNumber(record.zIndex) ?? 0,
      parentId: readString(record.parentId),
      serialized: JSON.stringify(record),
    }];
  });
}

async function readDraftNodesList(request: APIRequestContext, pageId: string): Promise<DraftNode[]> {
  const response = await request.get(`/api/builder/site/pages/${encodeURIComponent(pageId)}/draft?locale=ko`, {
    headers: mutationHeaders(pageId),
    failOnStatusCode: false,
  });
  if (response.status() !== 200) {
    throw new Error(`draft GET returned ${response.status()} for ${pageId}`);
  }
  return readDraftNodes(await response.json());
}

async function findDraftNode(request: APIRequestContext, pageId: string, nodeId: string): Promise<DraftNode> {
  const nodes = await readDraftNodesList(request, pageId);
  const match = nodes.find((node) => node.id === nodeId);
  if (!match) throw new Error(`draft node ${nodeId} not found among ${nodes.length} nodes`);
  return match;
}

function mapDraftNodesById(nodes: readonly DraftNode[]): Map<string, DraftNode> {
  const map = new Map<string, DraftNode>();
  for (const node of nodes) map.set(node.id, node);
  return map;
}

/**
 * Walk parentId from a seed node up to the top root. Guards against cycles and
 * missing parents so a malformed snapshot fails loudly instead of looping.
 */
function resolveDraftRoot(seed: DraftNode, byId: Map<string, DraftNode>): DraftNode {
  const visited = new Set<string>();
  let cursor: DraftNode | undefined = seed;
  let guard = 0;
  while (cursor && guard < 128) {
    if (visited.has(cursor.id)) {
      throw new Error(`parentId cycle detected at ${cursor.id} while resolving section root`);
    }
    visited.add(cursor.id);
    if (cursor.parentId === null) return cursor;
    const parent = byId.get(cursor.parentId);
    if (!parent) throw new Error(`missing parent ${cursor.parentId} for node ${cursor.id}`);
    cursor = parent;
    guard += 1;
  }
  throw new Error('exceeded parent-chain guard while resolving section root');
}

/** True when walking parentId from a node eventually reaches rootId. */
function nodeReachesRoot(node: DraftNode, byId: Map<string, DraftNode>, rootId: string): boolean {
  if (node.id === rootId) return true;
  const visited = new Set<string>();
  let cursor: DraftNode | undefined = node;
  let guard = 0;
  while (cursor && guard < 128) {
    if (cursor.id === rootId) return true;
    if (visited.has(cursor.id)) return false;
    visited.add(cursor.id);
    if (cursor.parentId === null) return false;
    cursor = byId.get(cursor.parentId);
    guard += 1;
  }
  return false;
}

// ---------------------------------------------------------------------------
// Read-only canvas DOM probes
// ---------------------------------------------------------------------------

async function getLocalRect(page: Page, nodeId: string): Promise<LocalRect> {
  return page.locator(`[data-node-id="${nodeId}"]`).first().evaluate((element) => {
    const html = element as HTMLElement;
    const parse = (value: string): number => {
      const parsed = Number.parseFloat(value);
      return Number.isFinite(parsed) ? parsed : 0;
    };
    return {
      height: parse(html.style.height),
      width: parse(html.style.width),
      x: parse(html.style.left),
      y: parse(html.style.top),
    };
  });
}

async function getComputedTransform(page: Page, nodeId: string): Promise<string> {
  return page.locator(`[data-node-id="${nodeId}"]`).first().evaluate((element) => window.getComputedStyle(element).transform);
}

async function getSelectedNodeIds(page: Page): Promise<string[]> {
  return page.evaluate(() => Array.from(document.querySelectorAll<HTMLElement>('[data-node-id][data-selected="true"]'))
    .map((element) => element.dataset.nodeId ?? '')
    .filter(Boolean)
    .sort());
}

async function countCanvasNodes(page: Page): Promise<number> {
  return page.getByRole('application', { name: 'Canvas editor' }).locator('[data-node-id]').count();
}

async function canvasNodeIds(page: Page): Promise<string[]> {
  return page.getByRole('application', { name: 'Canvas editor' }).evaluate((stage) => Array
    .from(stage.querySelectorAll<HTMLElement>('[data-node-id]'))
    .map((element) => element.dataset.nodeId ?? '')
    .filter(Boolean)
    .sort());
}

function stageLocator(page: Page) {
  return page.getByRole('application', { name: 'Canvas editor' });
}

async function clientPointToCanvasLocal(page: Page, clientPoint: Point): Promise<Point> {
  return stageLocator(page).evaluate((element, point) => {
    const html = element as HTMLElement;
    const rect = html.getBoundingClientRect();
    const widthScale = rect.width > 0 ? html.offsetWidth / rect.width : 1;
    const heightScale = rect.height > 0 ? html.offsetHeight / rect.height : 1;
    return {
      x: (point.x - rect.left) * widthScale,
      y: (point.y - rect.top) * heightScale,
    };
  }, clientPoint);
}

// Production rAF yield for the readiness gate (sampling cadence only; never a
// readiness sleep and never mutates the DOM).
function rafGateOptions(): GateOptions {
  return {
    requiredEqualSamples: DEFAULT_REQUIRED_EQUAL_SAMPLES,
    maxPollAttempts: DEFAULT_MAX_POLL_ATTEMPTS,
    epsilon: DEFAULT_BBOX_EPSILON,
    now: () => new Date(),
  };
}

function assertFixtureOwnership(token: string, tag: string): void {
  const isolationRoot = process.env.BUILDER_QA_ISOLATION_ROOT;
  if (!isolationRoot) {
    throw new Error('BUILDER_QA_ISOLATION_ROOT is not set; run via the isolated QA server, not unisolated.');
  }
  const ownershipToken = `wb-r07-${tag}-${token}`;
  const fixture = validateFixtureDocument(
    createFixtureDocument({ isolationRoot, ownershipToken, journeys: [...JOURNEY_IDS] }),
  );
  if (!fixture.ownership.journeys.includes('J06')
    || !fixture.ownership.journeys.includes('J07')
    || !fixture.ownership.journeys.includes('J08')
    || !fixture.ownership.journeys.includes('J09')
    || !fixture.ownership.journeys.includes('J10')) {
    throw new Error('fixture manifest does not own J06–J10');
  }
}

// ---------------------------------------------------------------------------
// Honest evidence + screen-bbox proof helpers
// ---------------------------------------------------------------------------

const SCREEN_BBOX_TOLERANCE = 1.5;
const J09_DROP_LOCAL_TOLERANCE = 6;
const J10_ROOT_LOCAL_TOLERANCE = 8;

/**
 * Assert a sanitized readiness evidence record is well-formed and honest for
 * the expected journey: ok reason, finite nonempty timestamp, a non-null stable
 * bbox, and an identity/containment top-hit. Adds no text/content to evidence
 * and never weakens the support contract.
 */
function assertReadinessEvidence(evidence: SanitizedEvidence, journeyId: JourneyId): void {
  expect(evidence.journeyId).toBe(journeyId);
  expect(evidence.reason).toBe('ok');
  expect(typeof evidence.timestampUtc).toBe('string');
  expect(evidence.timestampUtc.length).toBeGreaterThan(0);
  expect(Number.isFinite(new Date(evidence.timestampUtc).getTime())).toBe(true);
  expect(evidence.stableBbox).not.toBeNull();
  expect(evidence.identical || evidence.contained).toBe(true);
}

/** Read a locator's screen-space bounding box or throw (never returns null). */
async function readScreenBbox(locator: Locator): Promise<BboxSample> {
  const box = await locator.boundingBox();
  if (!box) throw new Error('locator has no screen bounding box');
  return { height: box.height, width: box.width, x: box.x, y: box.y };
}

/** True when any screen-bbox dimension moved beyond tolerance (material change). */
function bboxMateriallyChanged(actual: BboxSample, baseline: BboxSample, tolerance: number): boolean {
  return (
    Math.abs(actual.x - baseline.x) > tolerance
    || Math.abs(actual.y - baseline.y) > tolerance
    || Math.abs(actual.width - baseline.width) > tolerance
    || Math.abs(actual.height - baseline.height) > tolerance
  );
}

/** Per-dimension closeness flags (serializable booleans for expect.poll). */
function bboxCloseFlags(actual: BboxSample, baseline: BboxSample, tolerance: number) {
  return {
    height: Math.abs(actual.height - baseline.height) <= tolerance,
    width: Math.abs(actual.width - baseline.width) <= tolerance,
    x: Math.abs(actual.x - baseline.x) <= tolerance,
    y: Math.abs(actual.y - baseline.y) <= tolerance,
  };
}

// ===========================================================================
// J06 — all 8 resize handles real drag/undo
// ===========================================================================

type ResizeHandleName = 'nw' | 'n' | 'ne' | 'e' | 'se' | 's' | 'sw' | 'w';

const RESIZE_HANDLES: readonly ResizeHandleName[] = ['nw', 'n', 'ne', 'e', 'se', 's', 'sw', 'w'];

interface HandleExpectation {
  readonly widthUp: boolean;
  readonly heightUp: boolean;
  readonly xDown: boolean;
  readonly yDown: boolean;
}

function createResizeDocument(token: string): Record<string, unknown> {
  const subjectRect: LocalRect = { x: 480, y: 280, width: 320, height: 200 };
  const markerSize = 28;
  const targets: Record<ResizeHandleName, Point> = {
    nw: { x: 420, y: 218 },
    n: { x: 640, y: 190 },
    ne: { x: 860, y: 218 },
    e: { x: 892, y: 380 },
    se: { x: 892, y: 542 },
    s: { x: 640, y: 570 },
    sw: { x: 420, y: 542 },
    w: { x: 388, y: 380 },
  };
  const markers = RESIZE_HANDLES.map((handle) => {
    const target = targets[handle];
    return makeTextNode(
      `resize-marker-${handle}`,
      { x: target.x - markerSize / 2, y: target.y - markerSize / 2, width: markerSize, height: markerSize },
      `◆${handle}`,
      9000,
      'center',
    );
  });
  return {
    version: 1,
    locale: 'ko',
    updatedAt: new Date().toISOString(),
    updatedBy: 'wb-r07-j06-resize',
    stageWidth: 1280,
    stageHeight: 720,
    nodes: [
      makeTextNode('resize-subject', subjectRect, `리사이즈 대상 ${token}`, 10),
      ...markers,
    ],
  };
}

function resizeExpectationsFor(handle: ResizeHandleName): HandleExpectation {
  const table: Record<ResizeHandleName, HandleExpectation> = {
    nw: { widthUp: true, heightUp: true, xDown: true, yDown: true },
    n: { widthUp: false, heightUp: true, xDown: false, yDown: true },
    ne: { widthUp: true, heightUp: true, xDown: false, yDown: true },
    e: { widthUp: true, heightUp: false, xDown: false, yDown: false },
    se: { widthUp: true, heightUp: true, xDown: false, yDown: false },
    s: { widthUp: false, heightUp: true, xDown: false, yDown: false },
    sw: { widthUp: true, heightUp: true, xDown: true, yDown: false },
    w: { widthUp: true, heightUp: false, xDown: true, yDown: false },
  };
  return table[handle];
}

async function performResizeDrag(
  page: Page,
  handle: ResizeHandleName,
  handleLocator: Locator,
  markerLocator: Locator,
): Promise<{ source: SanitizedEvidence; target: SanitizedEvidence }> {
  const sourcePort = makePlaywrightPointerPort(page, handleLocator);
  const sourceContext = {
    journeyId: 'J06' as const,
    action: 'drag:source' as const,
    target: { selector: `resize-handle-${handle}` },
  };
  const sourceInitial = await runReadinessGate(sourcePort, sourceContext, rafGateOptions());
  let pressed = false;
  let released = false;
  try {
    await page.mouse.move(sourceInitial.point.x, sourceInitial.point.y);
    const sourceFinal = await runReadinessGate(sourcePort, sourceContext, rafGateOptions());
    if (sourceFinal.point.x !== sourceInitial.point.x || sourceFinal.point.y !== sourceInitial.point.y) {
      throw new Error('resize handle geometry changed before mouse-down');
    }

    const markerPort = makePlaywrightPointerPort(page, markerLocator);
    const markerContext = {
      journeyId: 'J06' as const,
      action: 'drag:target' as const,
      target: { selector: `resize-marker-${handle}` },
    };
    await page.mouse.down();
    pressed = true;
    const markerReady = await runReadinessGate(markerPort, markerContext, rafGateOptions());
    await page.mouse.move(markerReady.point.x, markerReady.point.y, { steps: 12 });

    // A resize handle follows the pointer and therefore correctly becomes the
    // top hit over the visual marker. Revalidate the moved handle itself, then
    // prove that the exact prevalidated marker point is owned by that handle.
    const movedHandleContext = {
      journeyId: 'J06' as const,
      action: 'drag:target' as const,
      target: { selector: `moved-resize-handle-${handle}` },
    };
    const movedHandleReady = await runReadinessGate(
      sourcePort,
      movedHandleContext,
      rafGateOptions(),
    );
    const endpointOwnership = await sourcePort.resolveTopAtPoint(markerReady.point);
    if (!endpointOwnership || (!endpointOwnership.identical && !endpointOwnership.contained)) {
      throw new Error('moved resize handle did not own the validated release point');
    }
    const movedHandleBbox = movedHandleReady.evidence.stableBbox;
    if (!movedHandleBbox
      || markerReady.point.x <= movedHandleBbox.x
      || markerReady.point.x >= movedHandleBbox.x + movedHandleBbox.width
      || markerReady.point.y <= movedHandleBbox.y
      || markerReady.point.y >= movedHandleBbox.y + movedHandleBbox.height) {
      throw new Error('validated release point was outside the moved resize handle');
    }
    const endpointEvidence = sanitizeEvidence({
      ...movedHandleContext,
      point: markerReady.point,
      stableBbox: movedHandleBbox,
      equalSampleCount: movedHandleReady.evidence.equalSampleCount,
      sampledBboxes: movedHandleReady.evidence.sampledBboxes,
      topHit: endpointOwnership.top,
      domChain: endpointOwnership.chain,
      identical: endpointOwnership.identical,
      contained: endpointOwnership.contained,
      viewport: movedHandleReady.evidence.viewport,
      reason: 'ok',
    }, () => new Date(movedHandleReady.evidence.timestampUtc));

    await page.mouse.up();
    released = true;
    assertReadinessEvidence(sourceInitial.evidence, 'J06');
    assertReadinessEvidence(sourceFinal.evidence, 'J06');
    assertReadinessEvidence(markerReady.evidence, 'J06');
    assertReadinessEvidence(movedHandleReady.evidence, 'J06');
    assertReadinessEvidence(endpointEvidence, 'J06');
    return { source: sourceFinal.evidence, target: endpointEvidence };
  } catch (error) {
    if (pressed && !released) {
      const recovery = await safeAbortPressedPointer(page, sourcePort, sourceContext, 12);
      released = recovery.released;
      annotatePointerAbortRecovery(error, recovery);
    }
    throw error;
  }
}

// ===========================================================================
// J07 — rotation handle real drag/readout/undo
// ===========================================================================

function createRotationDocument(token: string): Record<string, unknown> {
  const subjectRect: LocalRect = { x: 460, y: 300, width: 320, height: 200 };
  const markerRect: LocalRect = { x: 980, y: 200, width: 32, height: 32 };
  return {
    version: 1,
    locale: 'ko',
    updatedAt: new Date().toISOString(),
    updatedBy: 'wb-r07-j07-rotation',
    stageWidth: 1280,
    stageHeight: 720,
    nodes: [
      makeTextNode('rotation-subject', subjectRect, `회전 대상 ${token}`, 10),
      makeTextNode('rotation-marker', markerRect, '◆', 9000, 'center'),
    ],
  };
}

async function performRotationDrag(
  page: Page,
  rotationHandle: Locator,
  marker: Locator,
): Promise<{ readoutDegrees: number }> {
  const sourcePort = makePlaywrightPointerPort(page, rotationHandle);
  const sourceContext = { journeyId: 'J07' as const, action: 'drag:source' as const, target: { selector: 'rotation-handle' } };
  const sourceInitial = await runReadinessGate(sourcePort, sourceContext, rafGateOptions());
  let pressed = false;
  let released = false;
  try {
    await page.mouse.move(sourceInitial.point.x, sourceInitial.point.y);
    const sourceFinal = await runReadinessGate(sourcePort, sourceContext, rafGateOptions());
    if (sourceFinal.point.x !== sourceInitial.point.x || sourceFinal.point.y !== sourceInitial.point.y) {
      throw new Error('rotation handle geometry changed before mouse-down');
    }
    await page.mouse.down();
    pressed = true;

    const targetPort = makePlaywrightPointerPort(page, marker);
    const targetContext = { journeyId: 'J07' as const, action: 'drag:target' as const, target: { selector: 'rotation-marker' } };
    const targetInitial = await runReadinessGate(targetPort, targetContext, rafGateOptions());
    await page.mouse.move(targetInitial.point.x, targetInitial.point.y, { steps: 12 });
    const targetFinal = await runReadinessGate(targetPort, targetContext, rafGateOptions());
    if (targetFinal.point.x !== targetInitial.point.x || targetFinal.point.y !== targetInitial.point.y) {
      throw new Error('rotation marker geometry changed before mouse-up');
    }

    const chip = page.locator('[data-builder-rotation-chip="true"]').first();
    await expect(chip).toBeVisible({ timeout: 5_000 });
    const chipText = await chip.evaluate((element) => element.textContent ?? '');
    const match = /(-?\d+(?:\.\d+)?)\s*°/u.exec(chipText);
    const readoutDegrees = match ? Number.parseFloat(match[1] ?? '0') : Number.NaN;
    if (!Number.isFinite(readoutDegrees) || readoutDegrees === 0) {
      throw new Error(`rotation readout was not finite/nonzero (text="${chipText}")`);
    }

    await page.mouse.up();
    released = true;
    // Assert every readiness evidence record captured for this manual drag is
    // honest for J07 before returning (ok reason, finite timestamp, non-null
    // stable bbox, identity/containment top-hit).
    assertReadinessEvidence(sourceInitial.evidence, 'J07');
    assertReadinessEvidence(sourceFinal.evidence, 'J07');
    assertReadinessEvidence(targetInitial.evidence, 'J07');
    assertReadinessEvidence(targetFinal.evidence, 'J07');
    return { readoutDegrees };
  } catch (error) {
    if (pressed && !released) {
      const recovery = await safeAbortPressedPointer(page, sourcePort, sourceContext, 12);
      released = recovery.released;
      annotatePointerAbortRecovery(error, recovery);
    }
    throw error;
  }
}

/**
 * Browser-native HTML5 drag for a native HTML5 draggable catalog widget preset
 * onto the canvas stage.
 *
 * The catalog preset is a native HTML5 draggable. On darwin + Chromium/CDP the
 * manual page.mouse down/move/up gesture used by realDrag completes without
 * entering the browser dragstart/dragover/drop lifecycle, so no node is
 * inserted. Playwright's Locator.dragTo is HTML5-aware and drives the real
 * lifecycle. Honest readiness is preserved exactly as in realDrag: source and
 * target geometry are still gated via runReadinessGate (returning sanitized
 * evidence plus the validated viewport target point), then the gesture itself
 * runs through dragTo at the rendered-pixel offset inside the stage's bounding
 * box (Playwright dragTo targetPosition is a rendered-pixel offset within the
 * target's getBoundingClientRect, not logical canvas-local space).
 */
async function dragCatalogPresetHtml5(
  page: Page,
  preset: Locator,
  stage: Locator,
  options: {
    readonly journeyId: JourneyId;
    readonly source: { readonly selector: string };
    readonly target: { readonly selector: string };
  },
): Promise<{ readonly source: SanitizedEvidence; readonly target: SanitizedEvidence; readonly targetPoint: Point }> {
  const sourcePort = makePlaywrightPointerPort(page, preset);
  const sourceContext = { journeyId: options.journeyId, action: 'drag:source' as const, target: options.source };
  const sourceReady = await runReadinessGate(sourcePort, sourceContext, rafGateOptions());

  const targetPort = makePlaywrightPointerPort(page, stage);
  const targetContext = { journeyId: options.journeyId, action: 'drag:target' as const, target: options.target };
  const targetReady = await runReadinessGate(targetPort, targetContext, rafGateOptions());

  // dragTo's targetPosition is a rendered-pixel offset inside the target's
  // getBoundingClientRect, NOT logical canvas-local space. Subtracting the
  // stage's viewport origin from the validated viewport target point yields
  // exactly that rendered-pixel offset. clientPointToCanvasLocal (which scales
  // by offsetWidth/rect.width for fitted zoom) is reserved for the logical
  // expected-position assertions the caller computes from targetPoint.
  const stageBox = await stage.boundingBox();
  if (!stageBox) {
    throw new Error('canvas stage has no screen bounding box for dragTo target offset');
  }
  await preset.dragTo(stage, {
    targetPosition: {
      x: targetReady.point.x - stageBox.x,
      y: targetReady.point.y - stageBox.y,
    },
  });

  return { source: sourceReady.evidence, target: targetReady.evidence, targetPoint: targetReady.point };
}

// ===========================================================================
// J08 — Shift multiselect + toolbar forward/back/duplicate/delete
// ===========================================================================

function createMultiselectDocument(token: string): Record<string, unknown> {
  return {
    version: 1,
    locale: 'ko',
    updatedAt: new Date().toISOString(),
    updatedBy: 'wb-r07-j08-multiselect',
    stageWidth: 1280,
    stageHeight: 720,
    nodes: [
      makeTextNode('journey-alpha', { x: 160, y: 180, width: 150, height: 64 }, `알파 ${token}`, 1),
      makeTextNode('journey-beta', { x: 460, y: 320, width: 150, height: 64 }, '베타', 2),
      makeTextNode('journey-gamma', { x: 820, y: 220, width: 150, height: 64 }, '감마', 3),
    ],
  };
}

function selectionToolbar(page: Page) {
  return page.getByRole('toolbar', { name: '요소 빠른 작업' });
}

// ===========================================================================
// Tests
// ===========================================================================

test.describe('WB-R07 real-pointer journeys J06–J10', () => {
  test.beforeEach(async ({ page }) => {
    await routeExternalFonts(page);
  });

  test(J06.line, async ({ page, request }) => {
    expect(J06.line).toBe('J06 all 8 resize handles real drag/undo');
    test.setTimeout(180_000);
    const token = Date.now().toString(36);
    assertFixtureOwnership(token, 'j06');
    const errors = collectBrowserErrors(page);
    const created = await createDocumentPage(request, token, 'j06-resize', createResizeDocument(token));
    try {
      await page.setExtraHTTPHeaders(mutationHeaders(created.slug));
      await openIsolatedBuilder(page, created.pageId, token, 'j06resize');
      await expect(page.locator('[data-node-id="resize-subject"]')).toBeVisible({ timeout: 30_000 });

      const subject = page.locator('[data-node-id="resize-subject"]').first();

      const exercised: ResizeHandleName[] = [];

      for (const handle of RESIZE_HANDLES) {
        // Re-establish selection each iteration so the resize overlay is
        // guaranteed present even if a prior Undo reverted selection state.
        await realClick(page, subject, { journeyId: 'J06', target: { selector: 'resize-subject' } });
        await expect.poll(async () => getSelectedNodeIds(page), { timeout: 10_000 }).toEqual(['resize-subject']);

        const beforeDom = await getLocalRect(page, 'resize-subject');
        const beforeDraft = (await findDraftNode(request, created.pageId, 'resize-subject')).rect;
        const beforeScreen = await readScreenBbox(subject);

        const handleLocator = page.locator(`[aria-label="Resize text node ${handle}"]`).first();
        await expect(handleLocator).toBeVisible({ timeout: 10_000 });
        const markerLocator = page.locator(`[data-node-id="resize-marker-${handle}"]`).first();
        await expect(markerLocator).toBeVisible({ timeout: 10_000 });

        const dragEvidence = await performResizeDrag(page, handle, handleLocator, markerLocator);
        assertReadinessEvidence(dragEvidence.source, 'J06');
        assertReadinessEvidence(dragEvidence.target, 'J06');

        const expectation = resizeExpectationsFor(handle);
        await expect.poll(
          async () => JSON.stringify(await getLocalRect(page, 'resize-subject')),
          { timeout: 20_000, intervals: [200, 400, 800] },
        ).not.toBe(JSON.stringify(beforeDom));
        const afterDom = await getLocalRect(page, 'resize-subject');
        const domChanged = afterDom.width !== beforeDom.width
          || afterDom.height !== beforeDom.height
          || afterDom.x !== beforeDom.x
          || afterDom.y !== beforeDom.y;
        expect(domChanged, `handle ${handle} did not change DOM local rect`).toBe(true);
        // Screen-space bbox must also have moved materially, not only local rect.
        const afterScreenDrag = await readScreenBbox(subject);
        expect(
          bboxMateriallyChanged(afterScreenDrag, beforeScreen, SCREEN_BBOX_TOLERANCE),
          `handle ${handle} did not materially change screen bbox`,
        ).toBe(true);
        if (expectation.widthUp) expect(afterDom.width).toBeGreaterThan(beforeDom.width);
        if (expectation.heightUp) expect(afterDom.height).toBeGreaterThan(beforeDom.height);
        if (expectation.xDown) expect(afterDom.x).toBeLessThan(beforeDom.x);
        if (expectation.yDown) expect(afterDom.y).toBeLessThan(beforeDom.y);

        await expect.poll(
          async () => (await findDraftNode(request, created.pageId, 'resize-subject')).rect,
          { timeout: 20_000, intervals: [200, 400, 800] },
        ).not.toEqual(beforeDraft);

        await page.keyboard.press(UNDO_SHORTCUT);
        await expect.poll(async () => getLocalRect(page, 'resize-subject'), {
          timeout: 20_000,
          intervals: [200, 400, 800],
        }).toEqual(beforeDom);
        await expect.poll(
          async () => (await findDraftNode(request, created.pageId, 'resize-subject')).rect,
          { timeout: 20_000, intervals: [200, 400, 800] },
        ).toEqual(beforeDraft);
        // Honest screen-space undo proof: after Undo the screen bbox must return
        // within tolerance of the pre-drag bbox (in addition to exact local and
        // persisted rect restoration already asserted above).
        await expect.poll(
          async () => bboxCloseFlags(await readScreenBbox(subject), beforeScreen, SCREEN_BBOX_TOLERANCE),
          { timeout: 20_000, intervals: [200, 400, 800] },
        ).toEqual({ height: true, width: true, x: true, y: true });

        exercised.push(handle);
      }

      expect(exercised).toEqual([...RESIZE_HANDLES]);
      expect(new Set(exercised).size).toBe(8);
      expect(errors).toEqual([]);
    } finally {
      await deletePage(request, created);
    }
  });

  test(J07.line, async ({ page, request }) => {
    expect(J07.line).toBe('J07 rotation handle real drag/readout/undo');
    test.setTimeout(180_000);
    const token = Date.now().toString(36);
    assertFixtureOwnership(token, 'j07');
    const errors = collectBrowserErrors(page);
    const created = await createDocumentPage(request, token, 'j07-rotation', createRotationDocument(token));
    try {
      await page.setExtraHTTPHeaders(mutationHeaders(created.slug));
      await openIsolatedBuilder(page, created.pageId, token, 'j07rotation');
      await expect(page.locator('[data-node-id="rotation-subject"]')).toBeVisible({ timeout: 30_000 });

      const subject = page.locator('[data-node-id="rotation-subject"]').first();
      await realClick(page, subject, { journeyId: 'J07', target: { selector: 'rotation-subject' } });
      await expect.poll(async () => getSelectedNodeIds(page), { timeout: 10_000 }).toEqual(['rotation-subject']);

      const rotationHandle = page.locator('[aria-label^="Rotate "]').first();
      await expect(rotationHandle).toBeVisible({ timeout: 10_000 });
      const marker = page.locator('[data-node-id="rotation-marker"]').first();
      await expect(marker).toBeVisible({ timeout: 10_000 });

      const beforeTransform = await getComputedTransform(page, 'rotation-subject');
      const beforeDraft = (await findDraftNode(request, created.pageId, 'rotation-subject')).rotation;
      const beforeScreen = await readScreenBbox(subject);

      const { readoutDegrees } = await performRotationDrag(page, rotationHandle, marker);

      await expect.poll(async () => getComputedTransform(page, 'rotation-subject'), {
        timeout: 20_000,
        intervals: [200, 400, 800],
      }).not.toBe(beforeTransform);
      const afterTransform = await getComputedTransform(page, 'rotation-subject');
      expect(afterTransform).not.toBe(beforeTransform);
      expect(afterTransform).not.toBe('none');
      expect(Number.isFinite(readoutDegrees) && readoutDegrees !== 0).toBe(true);
      // Screen-space bbox must also have moved materially after rotation.
      const afterScreenRotated = await readScreenBbox(subject);
      expect(
        bboxMateriallyChanged(afterScreenRotated, beforeScreen, SCREEN_BBOX_TOLERANCE),
        'rotation did not materially change screen bbox',
      ).toBe(true);

      await expect.poll(
        async () => (await findDraftNode(request, created.pageId, 'rotation-subject')).rotation,
        { timeout: 20_000, intervals: [200, 400, 800] },
      ).not.toBe(beforeDraft);

      await page.keyboard.press(UNDO_SHORTCUT);
      await expect.poll(async () => getComputedTransform(page, 'rotation-subject'), {
        timeout: 20_000,
        intervals: [200, 400, 800],
      }).toBe(beforeTransform);
      await expect.poll(
        async () => (await findDraftNode(request, created.pageId, 'rotation-subject')).rotation,
        { timeout: 20_000, intervals: [200, 400, 800] },
      ).toBe(beforeDraft);
      // Honest screen-space undo proof: after Undo the screen bbox must return
      // within tolerance of the pre-rotation bbox (in addition to exact computed
      // transform and persisted rotation restoration already asserted above).
      await expect.poll(
        async () => bboxCloseFlags(await readScreenBbox(subject), beforeScreen, SCREEN_BBOX_TOLERANCE),
        { timeout: 20_000, intervals: [200, 400, 800] },
      ).toEqual({ height: true, width: true, x: true, y: true });

      expect(errors).toEqual([]);
    } finally {
      await deletePage(request, created);
    }
  });

  test(J08.line, async ({ page, request }) => {
    expect(J08.line).toBe('J08 Shift multiselect + toolbar forward/back/duplicate/delete');
    test.setTimeout(180_000);
    const token = Date.now().toString(36);
    assertFixtureOwnership(token, 'j08');
    const errors = collectBrowserErrors(page);
    const created = await createDocumentPage(request, token, 'j08-multiselect', createMultiselectDocument(token));
    const targetIds = ['journey-alpha', 'journey-beta', 'journey-gamma'] as const;
    try {
      await page.setExtraHTTPHeaders(mutationHeaders(created.slug));
      await openIsolatedBuilder(page, created.pageId, token, 'j08multiselect');
      for (const id of targetIds) {
        await expect(page.locator(`[data-node-id="${id}"]`)).toBeVisible({ timeout: 30_000 });
      }

      async function draftTargetOrder(): Promise<string[]> {
        const nodes = await readDraftNodesList(request, created.pageId);
        const targetSet: readonly string[] = targetIds;
        return nodes.map((node) => node.id).filter((id) => targetSet.includes(id));
      }

      async function shiftMultiSelectAlphaBetaGamma(): Promise<void> {
        await realClick(page, page.locator('[data-node-id="journey-alpha"]').first(), {
          journeyId: 'J08',
          target: { selector: 'journey-alpha' },
        });
        await page.keyboard.down('Shift');
        try {
          await realClick(page, page.locator('[data-node-id="journey-beta"]').first(), {
            journeyId: 'J08',
            target: { selector: 'journey-beta' },
          });
          await realClick(page, page.locator('[data-node-id="journey-gamma"]').first(), {
            journeyId: 'J08',
            target: { selector: 'journey-gamma' },
          });
        } finally {
          await page.keyboard.up('Shift');
        }
        await expect.poll(async () => getSelectedNodeIds(page), { timeout: 10_000 }).toEqual([...targetIds]);
        await expect(selectionToolbar(page).locator('[data-builder-selection-toolbar-summary="true"]'))
          .toHaveText('3개 선택됨');
      }

      await shiftMultiSelectAlphaBetaGamma();

      // forward/back are intentionally disabled for multi-selection; reduce to
      // a single selected node before exercising them. Use the middle node so it
      // can move in both directions within the persisted document order.
      const initialOrder = await draftTargetOrder();
      expect(initialOrder).toEqual([...targetIds]);

      await realClick(page, page.locator('[data-node-id="journey-beta"]').first(), {
        journeyId: 'J08',
        target: { selector: 'journey-beta' },
      });
      await expect.poll(async () => getSelectedNodeIds(page), { timeout: 10_000 }).toEqual(['journey-beta']);

      const forwardButton = selectionToolbar(page).getByRole('button', { name: '앞', exact: true });
      await realClick(page, forwardButton, { journeyId: 'J08', target: { selector: 'toolbar-forward' } });
      await expect.poll(async () => draftTargetOrder(), { timeout: 20_000, intervals: [200, 400, 800] })
        .toEqual(['journey-alpha', 'journey-gamma', 'journey-beta']);

      await page.keyboard.press(UNDO_SHORTCUT);
      await expect.poll(async () => draftTargetOrder(), { timeout: 20_000, intervals: [200, 400, 800] })
        .toEqual([...targetIds]);

      // Backward (still single selection of beta): move one step toward the back.
      const backwardButton = selectionToolbar(page).getByRole('button', { name: '뒤', exact: true });
      await realClick(page, backwardButton, { journeyId: 'J08', target: { selector: 'toolbar-backward' } });
      await expect.poll(async () => draftTargetOrder(), { timeout: 20_000, intervals: [200, 400, 800] })
        .toEqual(['journey-beta', 'journey-alpha', 'journey-gamma']);

      await page.keyboard.press(UNDO_SHORTCUT);
      await expect.poll(async () => draftTargetOrder(), { timeout: 20_000, intervals: [200, 400, 800] })
        .toEqual([...targetIds]);

      // Duplicate (Shift multiselect alpha + beta).
      await realClick(page, page.locator('[data-node-id="journey-alpha"]').first(), {
        journeyId: 'J08',
        target: { selector: 'journey-alpha' },
      });
      await page.keyboard.down('Shift');
      try {
        await realClick(page, page.locator('[data-node-id="journey-beta"]').first(), {
          journeyId: 'J08',
          target: { selector: 'journey-beta' },
        });
      } finally {
        await page.keyboard.up('Shift');
      }
      await expect.poll(async () => getSelectedNodeIds(page), { timeout: 10_000 }).toEqual(['journey-alpha', 'journey-beta']);

      const countBeforeDuplicate = await countCanvasNodes(page);
      const draftCountBeforeDuplicate = (await readDraftNodesList(request, created.pageId)).length;
      const duplicateButton = selectionToolbar(page).getByRole('button', { name: '복제', exact: true });
      await realClick(page, duplicateButton, { journeyId: 'J08', target: { selector: 'toolbar-duplicate' } });
      await expect.poll(async () => countCanvasNodes(page), { timeout: 20_000, intervals: [200, 400, 800] })
        .toBe(countBeforeDuplicate + 2);
      await expect.poll(
        async () => (await readDraftNodesList(request, created.pageId)).length,
        { timeout: 20_000, intervals: [200, 400, 800] },
      ).toBe(draftCountBeforeDuplicate + 2);
      const idsAfterDuplicate = await canvasNodeIds(page);
      expect(idsAfterDuplicate).toContain('journey-alpha');
      expect(idsAfterDuplicate).toContain('journey-beta');
      expect(idsAfterDuplicate).toContain('journey-gamma');

      await page.keyboard.press(UNDO_SHORTCUT);
      await expect.poll(async () => countCanvasNodes(page), { timeout: 20_000, intervals: [200, 400, 800] })
        .toBe(countBeforeDuplicate);
      await expect.poll(
        async () => (await readDraftNodesList(request, created.pageId)).length,
        { timeout: 20_000, intervals: [200, 400, 800] },
      ).toBe(draftCountBeforeDuplicate);
      // Persisted target order must be exactly restored after Duplicate undo,
      // not only the total node count.
      await expect.poll(async () => draftTargetOrder(), { timeout: 20_000, intervals: [200, 400, 800] })
        .toEqual([...targetIds]);

      // Delete (Shift multiselect alpha + beta).
      await realClick(page, page.locator('[data-node-id="journey-alpha"]').first(), {
        journeyId: 'J08',
        target: { selector: 'journey-alpha' },
      });
      await page.keyboard.down('Shift');
      try {
        await realClick(page, page.locator('[data-node-id="journey-beta"]').first(), {
          journeyId: 'J08',
          target: { selector: 'journey-beta' },
        });
      } finally {
        await page.keyboard.up('Shift');
      }
      await expect.poll(async () => getSelectedNodeIds(page), { timeout: 10_000 }).toEqual(['journey-alpha', 'journey-beta']);

      const countBeforeDelete = await countCanvasNodes(page);
      const draftCountBeforeDelete = (await readDraftNodesList(request, created.pageId)).length;
      const deleteButton = selectionToolbar(page).getByRole('button', { name: '삭제', exact: true });
      await realClick(page, deleteButton, { journeyId: 'J08', target: { selector: 'toolbar-delete' } });
      await expect.poll(async () => countCanvasNodes(page), { timeout: 20_000, intervals: [200, 400, 800] })
        .toBe(countBeforeDelete - 2);
      await expect.poll(
        async () => (await readDraftNodesList(request, created.pageId)).length,
        { timeout: 20_000, intervals: [200, 400, 800] },
      ).toBe(draftCountBeforeDelete - 2);

      await page.keyboard.press(UNDO_SHORTCUT);
      await expect.poll(async () => canvasNodeIds(page), { timeout: 20_000, intervals: [200, 400, 800] })
        .toEqual([...targetIds]);
      // After Delete + Undo, persisted target ids AND order must be exactly the
      // original, and the draft total count exactly restored (not only DOM
      // sorted ids/counts).
      await expect.poll(async () => draftTargetOrder(), { timeout: 20_000, intervals: [200, 400, 800] })
        .toEqual([...targetIds]);
      await expect.poll(
        async () => (await readDraftNodesList(request, created.pageId)).length,
        { timeout: 20_000, intervals: [200, 400, 800] },
      ).toBe(draftCountBeforeDelete);

      expect(errors).toEqual([]);
    } finally {
      await deletePage(request, created);
    }
  });

  test(J09.line, async ({ page, request }) => {
    expect(J09.line).toBe('J09 Add panel widget preset real drag/drop');
    test.setTimeout(180_000);
    const token = Date.now().toString(36);
    assertFixtureOwnership(token, 'j09');
    const errors = collectBrowserErrors(page);
    const created = await createBlankPage(request, token, 'j09-widget-drag');
    try {
      await page.setExtraHTTPHeaders(mutationHeaders(created.slug));
      await openIsolatedBuilder(page, created.pageId, token, 'j09widget');
      const stage = stageLocator(page);
      const countBefore = await countCanvasNodes(page);
      const draftCountBefore = (await readDraftNodesList(request, created.pageId)).length;

      // Open the Add rail with a real click (no raw .click anywhere).
      await realClick(page, page.locator('[data-builder-rail-item="add"]').first(), {
        journeyId: 'J09',
        target: { selector: 'add-rail' },
      });
      const drawer = page.locator('aside[aria-hidden="false"]').first();
      const searchbox = drawer.getByRole('searchbox', { name: /Search add elements|추가 요소 검색/ });
      await expect(searchbox).toBeVisible({ timeout: 15_000 });

      const presetSelector = '[data-builder-text-widget-preset="rich-text"]';
      const presetCard = drawer.locator(presetSelector).first();
      await expect(presetCard).toBeAttached({ timeout: 15_000 });
      await presetCard.scrollIntoViewIfNeeded();
      await expect(presetCard).toBeVisible({ timeout: 15_000 });

      const dragResult = await dragCatalogPresetHtml5(page, presetCard, stage, {
        journeyId: 'J09',
        source: { selector: 'text-widget-preset-rich-text' },
        target: { selector: 'canvas-stage' },
      });
      assertReadinessEvidence(dragResult.source, 'J09');
      assertReadinessEvidence(dragResult.target, 'J09');

      const expectedLocal = await clientPointToCanvasLocal(page, dragResult.targetPoint);
      const richTextNode = page.locator('[data-node-id^="text-"]').filter({ hasText: '굵게, 기울임' }).last();
      await expect(richTextNode).toBeVisible({ timeout: 30_000 });
      await expect.poll(async () => countCanvasNodes(page), { timeout: 30_000, intervals: [250, 500, 1000] })
        .toBe(countBefore + 1);

      // Read-only DOM local origin cross-check (extra evidence; the authoritative
      // geometry lives in the persisted draft below).
      const nodeLocalOrigin = await richTextNode.evaluate((element) => {
        const node = element.closest('[data-node-id]') ?? element;
        const html = node as HTMLElement;
        const parse = (value: string): number => {
          const parsed = Number.parseFloat(value);
          return Number.isFinite(parsed) ? parsed : 0;
        };
        return { x: parse(html.style.left), y: parse(html.style.top) };
      });
      expect(Math.abs(nodeLocalOrigin.x - expectedLocal.x)).toBeLessThanOrEqual(J09_DROP_LOCAL_TOLERANCE);
      expect(Math.abs(nodeLocalOrigin.y - expectedLocal.y)).toBeLessThanOrEqual(J09_DROP_LOCAL_TOLERANCE);

      // Resolve the single persisted draft node carrying the preset copy and wait
      // until its schema (richText marker) AND exact preset size (420x96) are
      // present — not merely plain text.
      await expect.poll(
        async () => {
          const nodes = await readDraftNodesList(request, created.pageId);
          return nodes.some((node) => node.serialized.includes('굵게, 기울임')
            && node.serialized.includes('richText')
            && node.rect.width === 420
            && node.rect.height === 96);
        },
        { timeout: 30_000, intervals: [250, 500, 1000] },
      ).toBe(true);

      const richDraftNodes = await readDraftNodesList(request, created.pageId);
      const richDraftNode = richDraftNodes.find((node) => node.serialized.includes('굵게, 기울임'));
      expect(richDraftNode, 'rich-text preset draft node not persisted').toBeDefined();
      const richDraft = richDraftNode as DraftNode;
      expect(richDraft.serialized.includes('richText')).toBe(true);
      expect(richDraft.serialized.includes('굵게, 기울임')).toBe(true);
      expect(richDraft.rect.width).toBe(420);
      expect(richDraft.rect.height).toBe(96);
      expect(Math.abs(richDraft.rect.x - expectedLocal.x)).toBeLessThanOrEqual(J09_DROP_LOCAL_TOLERANCE);
      expect(Math.abs(richDraft.rect.y - expectedLocal.y)).toBeLessThanOrEqual(J09_DROP_LOCAL_TOLERANCE);
      await expect.poll(
        async () => (await readDraftNodesList(request, created.pageId)).length,
        { timeout: 30_000, intervals: [250, 500, 1000] },
      ).toBe(draftCountBefore + 1);

      // Reload persistence: same node id/rect/schema preserved, total count initial+1.
      await openIsolatedBuilder(page, created.pageId, token, 'j09widgetReload');
      await expect(page.locator('[data-node-id^="text-"]').filter({ hasText: '굵게, 기울임' }).first())
        .toBeVisible({ timeout: 30_000 });
      const reloadedNodes = await readDraftNodesList(request, created.pageId);
      expect(reloadedNodes.length).toBe(draftCountBefore + 1);
      const reloadedRich = reloadedNodes.find((node) => node.id === richDraft.id);
      expect(reloadedRich, `rich-text node ${richDraft.id} missing after reload`).toBeDefined();
      const reloadedRichNode = reloadedRich as DraftNode;
      expect(reloadedRichNode.rect).toEqual(richDraft.rect);
      expect(reloadedRichNode.serialized).toBe(richDraft.serialized);

      expect(errors).toEqual([]);
    } finally {
      await deletePage(request, created);
    }
  });

  test(J10.line, async ({ page, request }) => {
    expect(J10.line).toBe('J10 section template real drag/drop');
    test.setTimeout(180_000);
    const token = Date.now().toString(36);
    assertFixtureOwnership(token, 'j10');
    const errors = collectBrowserErrors(page);
    const created = await createBlankPage(request, token, 'j10-section-drag');
    try {
      await page.setExtraHTTPHeaders(mutationHeaders(created.slug));
      await openIsolatedBuilder(page, created.pageId, token, 'j10section');
      const stage = stageLocator(page);

      await realClick(page, page.locator('[data-builder-rail-item="add"]').first(), {
        journeyId: 'J10',
        target: { selector: 'add-rail' },
      });
      const drawer = page.locator('aside[aria-hidden="false"]').first();
      const searchbox = drawer.getByRole('searchbox', { name: /Search add elements|추가 요소 검색/ });
      await expect(searchbox).toBeVisible({ timeout: 15_000 });
      await searchbox.fill('주요업무');

      const templateSelector = '[data-builder-built-in-section-template="services-accordion"]';
      const templateCard = drawer.locator(templateSelector).first();
      await expect(templateCard).toBeAttached({ timeout: 15_000 });
      await templateCard.scrollIntoViewIfNeeded();
      await expect(templateCard).toBeVisible({ timeout: 15_000 });

      const dragResult = await realDrag(page, templateCard, stage, {
        journeyId: 'J10',
        source: { selector: 'section-template-services-accordion' },
        target: { selector: 'canvas-stage' },
        steps: 16,
      });
      assertReadinessEvidence(dragResult.source, 'J10');
      assertReadinessEvidence(dragResult.target, 'J10');

      const expectedLocal = await clientPointToCanvasLocal(page, dragResult.target.point);
      const insertedTitle = '서비스 상세를 단계별로 펼쳐 보게 합니다';
      const insertedCardCopy = '포함 범위와 제외 범위를 명확히 합니다.';
      const headingNode = page.locator('[data-node-id^="heading-"]').filter({ hasText: insertedTitle }).last();
      await expect(headingNode).toBeVisible({ timeout: 30_000 });
      await expect(page.getByText(insertedCardCopy).first()).toBeVisible({ timeout: 30_000 });

      // Wait for the inserted section snapshot to persist (the heading copy must
      // appear in a serialized draft node), then resolve the TRUE section root by
      // walking parentId up from that heading node — not by reading the heading
      // node's own local rect (the prior approach measured the wrong node).
      await expect.poll(
        async () => {
          const nodes = await readDraftNodesList(request, created.pageId);
          return nodes.some((node) => node.serialized.includes(insertedTitle));
        },
        { timeout: 30_000, intervals: [250, 500, 1000] },
      ).toBe(true);

      const draftNodes = await readDraftNodesList(request, created.pageId);
      const byId = mapDraftNodesById(draftNodes);
      const headingSeed = draftNodes.find((node) => node.serialized.includes(insertedTitle));
      expect(headingSeed, 'inserted heading node not found in persisted draft').toBeDefined();
      const root = resolveDraftRoot(headingSeed as DraftNode, byId);
      expect(root.parentId).toBeNull();
      expect(Math.abs(root.rect.x - expectedLocal.x)).toBeLessThanOrEqual(J10_ROOT_LOCAL_TOLERANCE);
      expect(Math.abs(root.rect.y - expectedLocal.y)).toBeLessThanOrEqual(J10_ROOT_LOCAL_TOLERANCE);
      // The persisted root must also be rendered in the DOM.
      await expect(page.locator(`[data-node-id="${root.id}"]`)).toBeVisible({ timeout: 10_000 });

      // Page was blank, so every post-drop draft node belongs to the inserted
      // snapshot: there must be more than one, DOM node count must exactly equal
      // draft node count, at least one node is a direct child of the root, and
      // (ideally) every node reaches the root through its parent chain.
      expect(draftNodes.length).toBeGreaterThan(1);
      await expect.poll(async () => countCanvasNodes(page), { timeout: 30_000, intervals: [250, 500, 1000] })
        .toBe(draftNodes.length);
      expect(draftNodes.some((node) => node.parentId === root.id)).toBe(true);
      expect(draftNodes.every((node) => nodeReachesRoot(node, byId, root.id))).toBe(true);

      // The known title/card copy remains present in persisted nodes.
      expect(draftNodes.some((node) => node.serialized.includes(insertedTitle))).toBe(true);
      expect(draftNodes.some((node) => node.serialized.includes(insertedCardCopy))).toBe(true);

      // Reload persistence: same root id, rect/parentId/content/count equal.
      await openIsolatedBuilder(page, created.pageId, token, 'j10sectionReload');
      await expect(page.locator('[data-node-id^="heading-"]').filter({ hasText: insertedTitle }).first())
        .toBeVisible({ timeout: 30_000 });
      await expect(page.getByText(insertedCardCopy).first()).toBeVisible({ timeout: 30_000 });
      const reloadedNodes = await readDraftNodesList(request, created.pageId);
      expect(reloadedNodes.length).toBe(draftNodes.length);
      const reloadedRoot = reloadedNodes.find((node) => node.id === root.id);
      expect(reloadedRoot, `section root ${root.id} missing after reload`).toBeDefined();
      const reloadedRootNode = reloadedRoot as DraftNode;
      expect(reloadedRootNode.parentId).toBeNull();
      expect(reloadedRootNode.rect).toEqual(root.rect);
      expect(reloadedNodes.some((node) => node.serialized.includes(insertedTitle))).toBe(true);
      expect(reloadedNodes.some((node) => node.serialized.includes(insertedCardCopy))).toBe(true);

      expect(errors).toEqual([]);
    } finally {
      await deletePage(request, created);
    }
  });
});

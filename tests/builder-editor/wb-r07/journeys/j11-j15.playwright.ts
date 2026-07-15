import { createHash, randomUUID } from 'node:crypto';
import path from 'node:path';

import { expect, test, type Locator, type Page, type Response } from '@playwright/test';
import type { BuilderCanvasDocument, BuilderCanvasNode } from '@/lib/builder/canvas/types';

import { createFixtureDocument, validateFixtureDocument } from '../support/fixture-document';
import { JOURNEY_ENTRIES, type JourneyEntry, type JourneyId } from '../support/journey-manifest';
import {
  makePlaywrightPointerPort,
  realClick,
  realDblClick,
  realDrag,
  runReadinessGate,
} from '../support/real-pointer';

const STAGE_WIDTH = 1280;
const STAGE_HEIGHT = 760;

const BASE_STYLE = {
  backgroundColor: 'transparent',
  borderColor: '#cbd5e1',
  borderStyle: 'solid',
  borderWidth: 0,
  borderRadius: 0,
  shadowX: 0,
  shadowY: 0,
  shadowBlur: 0,
  shadowSpread: 0,
  shadowColor: 'rgba(15, 23, 42, 0.16)',
  opacity: 100,
} as const;

const RESIZE_HANDLE_SUFFIXES = ['nw', 'n', 'ne', 'e', 'se', 's', 'sw', 'w'] as const;
const VIEWPORT_MODES = ['desktop', 'tablet', 'mobile'] as const;
const TOPBAR_SECONDARY_SELECTOR = '[data-builder-topbar-secondary-cluster="true"]';
const TOPBAR_SECONDARY_SUMMARY_SELECTOR = `${TOPBAR_SECONDARY_SELECTOR} > summary`;

interface Rect {
  readonly x: number;
  readonly y: number;
  readonly width: number;
  readonly height: number;
}

interface DraftView {
  readonly pageId: string;
  readonly revision: number;
  readonly document: BuilderCanvasDocument;
}

function bindJourney(id: JourneyId): JourneyEntry {
  const entry = JOURNEY_ENTRIES.find((candidate) => candidate.id === id);
  if (!entry) throw new Error(`canonical journey ${id} missing from manifest`);
  return entry;
}

const J11 = bindJourney('J11');
const J12 = bindJourney('J12');
const J13 = bindJourney('J13');
const J14 = bindJourney('J14');
const J15 = bindJourney('J15');

function requireNonemptyEnvironmentVariable(
  name: 'BUILDER_SITE_ROOT' | 'BUILDER_QA_ISOLATION_ROOT' | 'QA_ISOLATION_MANIFEST_PATH',
): string {
  const value = process.env[name]?.trim();
  if (!value) throw new Error(`${name} is required for WB-R07 journeys`);
  return value;
}

function assertIsolatedFixture(journeyId: JourneyId, ownershipToken: string): void {
  const siteRoot = path.resolve(requireNonemptyEnvironmentVariable('BUILDER_SITE_ROOT'));
  const qaRoot = path.resolve(requireNonemptyEnvironmentVariable('BUILDER_QA_ISOLATION_ROOT'));
  requireNonemptyEnvironmentVariable('QA_ISOLATION_MANIFEST_PATH');

  const relativeSiteRoot = path.relative(qaRoot, siteRoot);
  const siteRootIsStrictDescendant = relativeSiteRoot !== ''
    && relativeSiteRoot !== '..'
    && !relativeSiteRoot.startsWith(`..${path.sep}`)
    && !path.isAbsolute(relativeSiteRoot);
  if (!siteRootIsStrictDescendant) {
    throw new Error('BUILDER_SITE_ROOT must be a strict descendant of BUILDER_QA_ISOLATION_ROOT');
  }

  const fixture = validateFixtureDocument(
    createFixtureDocument({ isolationRoot: siteRoot, ownershipToken }),
  );
  const exactManifestOwnership = JOURNEY_ENTRIES.map((entry) => entry.id);
  expect(fixture.isolationRoot).toBe(siteRoot);
  expect(fixture.ownership.sentinel).toBe('wb-r07-isolated-fixture');
  expect(fixture.ownership.journeys).toHaveLength(20);
  expect(fixture.ownership.journeys).toEqual(exactManifestOwnership);
  expect(fixture.ownership.journeys).toContain(journeyId);
}

function makeJourneyToken(journeyId: JourneyId): string {
  return `${journeyId.toLowerCase()}-${Date.now().toString(36)}-${randomUUID()}`;
}

function mutationHeaders(scope: string): Record<string, string> {
  const safe = scope.replace(/[^a-z0-9-]/gi, '-').slice(-48) || 'wb-r07-journey';
  return { 'x-forwarded-for': `wb-r07-${safe}` };
}

function draftPath(pageId: string): string {
  return `/api/builder/site/pages/${encodeURIComponent(pageId)}/draft`;
}

function sortKeys(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(sortKeys);
  if (value && typeof value === 'object') {
    const source = value as Record<string, unknown>;
    const sorted: Record<string, unknown> = {};
    for (const key of Object.keys(source).sort()) sorted[key] = sortKeys(source[key]);
    return sorted;
  }
  return value;
}

function stableSortedJsonSha256(value: unknown): string {
  return createHash('sha256').update(JSON.stringify(sortKeys(value)), 'utf8').digest('hex');
}

function makeRootContainer(id: string, rect: Rect): BuilderCanvasNode {
  return {
    id,
    kind: 'container',
    rect,
    zIndex: 0,
    rotation: 0,
    locked: false,
    visible: true,
    style: BASE_STYLE,
    content: {
      label: 'root',
      background: 'transparent',
      borderColor: '#cbd5e1',
      borderStyle: 'solid',
      borderWidth: 0,
      borderRadius: 0,
      padding: 0,
      layoutMode: 'absolute',
    },
  };
}

function makeContainer(id: string, parentId: string, rect: Rect, label: string): BuilderCanvasNode {
  return {
    id,
    kind: 'container',
    parentId,
    rect,
    zIndex: 1,
    rotation: 0,
    locked: false,
    visible: true,
    style: BASE_STYLE,
    content: {
      label,
      background: 'transparent',
      borderColor: '#94a3b8',
      borderStyle: 'solid',
      borderWidth: 1,
      borderRadius: 0,
      padding: 0,
      layoutMode: 'absolute',
    },
  };
}

function makeTextNode(
  id: string,
  parentId: string,
  rect: Rect,
  text: string,
  extra: { readonly responsive?: BuilderCanvasNode['responsive'] } = {},
): BuilderCanvasNode {
  return {
    id,
    kind: 'text',
    parentId,
    rect,
    zIndex: 2,
    rotation: 0,
    locked: false,
    visible: true,
    style: BASE_STYLE,
    responsive: extra.responsive,
    content: {
      text,
      fontSize: 28,
      color: '#0f172a',
      fontWeight: 'bold',
      align: 'left',
      lineHeight: 1.2,
      letterSpacing: 0,
      fontFamily: 'system-ui',
    },
  };
}

function makeDocument(updatedBy: string, nodes: readonly BuilderCanvasNode[]): BuilderCanvasDocument {
  return {
    version: 1,
    locale: 'ko',
    updatedAt: new Date().toISOString(),
    updatedBy,
    stageWidth: STAGE_WIDTH,
    stageHeight: STAGE_HEIGHT,
    nodes: [...nodes],
  };
}

async function createPage(
  page: Page,
  input: { readonly scope: string; readonly slug: string; readonly title: string; readonly document: BuilderCanvasDocument },
): Promise<{ readonly pageId: string; readonly revision: number }> {
  const response = await page.request.post('/api/builder/site/pages', {
    data: { locale: 'ko', slug: input.slug, title: input.title, document: input.document },
    headers: mutationHeaders(input.scope),
  });
  expect(response.status(), `create page ${input.slug}`).toBe(200);
  const payload = (await response.json()) as { success?: boolean; pageId?: string; error?: string };
  expect(payload.success, payload.error ?? `create failed for ${input.slug}`).toBe(true);
  expect(typeof payload.pageId).toBe('string');
  expect(payload.pageId!.length).toBeGreaterThan(0);
  return { pageId: payload.pageId!, revision: 0 };
}

async function readDraft(page: Page, pageId: string, scope: string): Promise<DraftView> {
  const response = await page.request.get(`${draftPath(pageId)}?locale=ko`, {
    headers: mutationHeaders(scope),
  });
  expect(response.status(), `read draft ${pageId}`).toBe(200);
  const payload = (await response.json()) as {
    draft?: { revision?: number };
    document?: BuilderCanvasDocument;
  };
  expect(typeof payload.draft?.revision, `draft revision for ${pageId}`).toBe('number');
  expect(payload.document, `draft document for ${pageId}`).toBeDefined();
  return { pageId, revision: payload.draft!.revision!, document: payload.document! };
}

async function deletePage(page: Page, pageId: string, scope: string): Promise<void> {
  const response = await page.request.delete(`/api/builder/site/pages/${encodeURIComponent(pageId)}?locale=ko`, {
    headers: mutationHeaders(scope),
    failOnStatusCode: false,
  });
  if (response.status() !== 200 && response.status() !== 404) {
    throw new Error(`delete page ${pageId} returned HTTP ${response.status()}`);
  }
}

async function cleanupPages(
  page: Page,
  entries: readonly { readonly pageId: string | null; readonly scope: string }[],
): Promise<void> {
  const errors: Error[] = [];
  for (const entry of entries) {
    if (!entry.pageId) continue;
    try {
      await deletePage(page, entry.pageId, entry.scope);
    } catch (error) {
      errors.push(error instanceof Error ? error : new Error(String(error)));
    }
  }
  if (errors.length > 0) {
    throw new Error(`page cleanup failed (${errors.length}): ${errors.map((error) => error.message).join(' | ')}`);
  }
}

async function yieldFrame(page: Page): Promise<void> {
  await page.evaluate(() => new Promise<void>((resolve) => {
    if (typeof requestAnimationFrame === 'function') {
      requestAnimationFrame(() => resolve());
      return;
    }
    resolve();
  }));
}

async function pollDraft(
  page: Page,
  pageId: string,
  scope: string,
  predicate: (view: DraftView) => boolean,
): Promise<DraftView> {
  let latest: DraftView | null = null;
  await expect.poll(async () => {
    latest = await readDraft(page, pageId, scope);
    return predicate(latest);
  }, {
    message: `pollDraft predicate for pageId=${pageId}`,
    timeout: 30_000,
  }).toBe(true);
  if (!latest) throw new Error(`pollDraft returned no draft for pageId=${pageId}`);
  return latest;
}

async function openEditor(page: Page, pageId: string): Promise<void> {
  await page.goto(`/ko/admin-builder?pageId=${encodeURIComponent(pageId)}`, { waitUntil: 'domcontentloaded' });
  const shell = page.locator('[data-editor-shell]').first();
  await expect(shell).toBeVisible({ timeout: 30_000 });
  await expect(shell).toHaveAttribute('data-editor-ready', 'true', { timeout: 30_000 });
  await expect(page.getByRole('application', { name: 'Canvas editor' })).toBeVisible({ timeout: 30_000 });
}

async function ensureTopbarSecondaryOpen(page: Page, journeyId: JourneyId): Promise<void> {
  const details = page.locator(TOPBAR_SECONDARY_SELECTOR).first();
  const summary = page.locator(TOPBAR_SECONDARY_SUMMARY_SELECTOR).first();
  await expect(summary).toBeVisible({ timeout: 15_000 });
  if ((await details.getAttribute('open')) === null) {
    await realClick(page, summary, {
      journeyId,
      target: { selector: TOPBAR_SECONDARY_SUMMARY_SELECTOR },
    });
  }
  await expect(details).toHaveAttribute('open', '', { timeout: 15_000 });
  await expect(details.locator('[data-builder-topbar-meta-cluster="preview"]'))
    .toBeVisible({ timeout: 15_000 });
}

async function ensurePagesDrawerOpen(page: Page, journeyId: JourneyId): Promise<void> {
  const rail = page.locator('[data-builder-rail-item="pages"]').first();
  const pressed = await rail.getAttribute('aria-pressed');
  if (pressed !== 'true') {
    await realClick(page, rail, { journeyId, target: { selector: '[data-builder-rail-item="pages"]' } });
  }
  await expect(rail).toHaveAttribute('aria-pressed', 'true', { timeout: 15_000 });
}

async function openAddRail(page: Page, journeyId: JourneyId): Promise<Locator> {
  const rail = page.locator('[data-builder-rail-item="add"]').first();
  await realClick(page, rail, { journeyId, target: { selector: '[data-builder-rail-item="add"]' } });
  const preset = page.locator('[data-builder-text-widget-preset="rich-text"]').first();
  await expect(preset).toBeAttached({ timeout: 15_000 });
  await preset.scrollIntoViewIfNeeded();
  // CSS-pixel rounding can leave a one-pixel edge clipped; the readiness gate
  // below remains authoritative for the card center's exact top-hit identity.
  await expect(preset).toBeInViewport({ ratio: 0.98 });
  await expect(preset).toBeVisible({ timeout: 15_000 });
  return preset;
}

async function dragCatalogPresetHtml5(
  page: Page,
  preset: Locator,
  target: Locator,
  options: {
    readonly journeyId: JourneyId;
    readonly source: { readonly selector: string };
    readonly target: { readonly selector: string };
  },
) {
  const sourceReady = await runReadinessGate(
    makePlaywrightPointerPort(page, preset),
    { journeyId: options.journeyId, action: 'drag:source', target: options.source },
  );
  const targetReady = await runReadinessGate(
    makePlaywrightPointerPort(page, target),
    { journeyId: options.journeyId, action: 'drag:target', target: options.target },
  );
  const targetBox = await target.boundingBox();
  if (!targetBox) throw new Error('HTML5 drag target has no screen bounding box');
  const targetSize = await target.evaluate((element) => {
    const html = element as HTMLElement;
    return { height: html.offsetHeight, width: html.offsetWidth };
  });
  const releasePoint = {
    // Chromium exposes drag-event client coordinates as integer CSS pixels.
    // Use that exact release coordinate both for dragTo and the expected local
    // model position so fitted zoom cannot hide a 1–2 model-pixel quantization.
    x: Math.floor(targetReady.point.x),
    y: Math.floor(targetReady.point.y),
  };
  const targetLocalPoint = {
    x: Math.max(0, Math.round(
      (releasePoint.x - targetBox.x) * (targetSize.width / targetBox.width),
    )),
    y: Math.max(0, Math.round(
      (releasePoint.y - targetBox.y) * (targetSize.height / targetBox.height),
    )),
  };

  await preset.dragTo(target, {
    targetPosition: {
      x: releasePoint.x - targetBox.x,
      y: releasePoint.y - targetBox.y,
    },
  });
  return {
    source: sourceReady.evidence,
    target: targetReady.evidence,
    targetLocalPoint,
  };
}

function pageRowPrimaryButton(page: Page, pageId: string): Locator {
  return page.locator(`[data-builder-page-row="${pageId}"]`).locator('button').nth(1);
}

async function switchPageByRow(
  page: Page,
  pageId: string,
  journeyId: JourneyId,
): Promise<Response> {
  const button = pageRowPrimaryButton(page, pageId);
  await expect(button).toBeAttached({ timeout: 15_000 });
  await button.scrollIntoViewIfNeeded();
  await expect(button).toBeVisible({ timeout: 15_000 });

  const [loaded] = await Promise.all([
    page.waitForResponse((response) => (
      response.ok()
      && response.request().method() === 'GET'
      && response.url().includes(draftPath(pageId))
    )),
    realClick(page, button, {
      journeyId,
      target: { selector: `[data-builder-page-row="${pageId}"] > button:nth-of-type(2)` },
    }),
  ]);
  return loaded;
}

function attachErrorCollector(page: Page): string[] {
  const errors: string[] = [];
  page.on('console', (message) => {
    if (message.type() === 'error') errors.push(message.text());
  });
  page.on('pageerror', (error) => {
    errors.push(error.message);
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

function recordDraftResponseOrder(
  page: Page,
  pageA: string,
  pageB: string,
): { readonly order: string[]; readonly finalize: (response: Response) => void } {
  const order: string[] = [];
  const pathA = draftPath(pageA);
  const pathB = draftPath(pageB);
  const finalize = (response: Response): void => {
    if (!response.ok()) return;
    const method = response.request().method();
    const url = response.url();
    if (method === 'PUT' && url.includes(pathA)) order.push('A:PUT');
    else if (method === 'GET' && url.includes(pathB)) order.push('B:GET');
    else if (method === 'GET' && url.includes(pathA)) order.push('A:GET');
  };
  page.on('response', finalize);
  return { order, finalize };
}

function findNode(document: BuilderCanvasDocument, nodeId: string): BuilderCanvasNode {
  const node = document.nodes.find((candidate) => candidate.id === nodeId);
  if (!node) throw new Error(`node ${nodeId} not in document`);
  return node;
}

function textNodeText(document: BuilderCanvasDocument, nodeId: string): string {
  const node = findNode(document, nodeId);
  if (node.kind !== 'text') throw new Error(`node ${nodeId} is not a text node`);
  return node.content.text;
}

function rectOf(node: BuilderCanvasNode): Rect {
  return {
    x: node.rect.x,
    y: node.rect.y,
    width: node.rect.width,
    height: node.rect.height,
  };
}

function rectEquals(a: Rect, b: Rect): boolean {
  return a.x === b.x && a.y === b.y && a.width === b.width && a.height === b.height;
}

test.describe('WB-R07 real-pointer builder journeys J11-J15', () => {
  test.beforeEach(async ({ page }) => {
    await routeExternalFonts(page);
  });

  test(J11.line, async ({ page }) => {
    test.setTimeout(150_000);
    expect(J11.description).toBe('nested container real drop verifies parentId+local rect');
    const token = makeJourneyToken('J11');
    const scope = `j11-${token}`;
    const ownershipToken = `wb-r07-j11-${token}`;
    assertIsolatedFixture('J11', ownershipToken);

    const errors = attachErrorCollector(page);
    const rootId = `j11-root-${token}`;
    const nestedId = `j11-nested-${token}`;
    const initialIds = new Set([rootId, nestedId]);

    const document = makeDocument(`wb-r07-j11-${token}`, [
      makeRootContainer(rootId, { x: 0, y: 0, width: 1280, height: 760 }),
      makeContainer(nestedId, rootId, { x: 240, y: 150, width: 900, height: 400 }, 'nested-target'),
    ]);

    let pageId: string | null = null;
    try {
      await page.setExtraHTTPHeaders(mutationHeaders(scope));
      const created = await createPage(page, {
        scope,
        slug: `wb-r07-j11-${token}`,
        title: `WB-R07 J11 ${token}`,
        document,
      });
      pageId = created.pageId;
      await openEditor(page, pageId);

      const initial = await readDraft(page, pageId, scope);
      expect(initial.revision).toBe(0);

      const preset = await openAddRail(page, 'J11');
      await expect(preset).toBeVisible();
      await expect(preset).toHaveAttribute('draggable', 'true');

      const nestedTarget = page.locator(`[data-node-id="${nestedId}"]`).first();
      await expect(nestedTarget).toBeVisible();

      const dragEvidence = await dragCatalogPresetHtml5(page, preset, nestedTarget, {
        journeyId: 'J11',
        source: { selector: '[data-builder-text-widget-preset="rich-text"]' },
        target: { selector: `[data-node-id="${nestedId}"]` },
      });
      expect(dragEvidence.source.reason).toBe('ok');
      expect(dragEvidence.target.reason).toBe('ok');
      expect(dragEvidence.target.identical || dragEvidence.target.contained).toBe(true);

      const settled = await pollDraft(
        page,
        pageId,
        scope,
        (view) => view.document.nodes.filter((node) => !initialIds.has(node.id)).length === 1,
      );
      expect(settled.revision).toBe(initial.revision + 1);

      const freshNodes = settled.document.nodes.filter((node) => !initialIds.has(node.id));
      expect(freshNodes).toHaveLength(1);
      const freshNode = freshNodes[0]!;
      expect(freshNode.kind).toBe('text');
      expect(freshNode.parentId).toBe(nestedId);
      expect(rectOf(freshNode)).toEqual({
        x: dragEvidence.targetLocalPoint.x,
        y: dragEvidence.targetLocalPoint.y,
        width: 420,
        height: 96,
      });

      const freshDom = page.locator(`[data-node-id="${freshNode.id}"]`).first();
      await expect(freshDom).toBeVisible();
      await expect(freshDom).toHaveAttribute('data-node-id', freshNode.id);
      await expect(freshDom).toHaveCSS('left', `${dragEvidence.targetLocalPoint.x}px`);
      await expect(freshDom).toHaveCSS('top', `${dragEvidence.targetLocalPoint.y}px`);
      await expect(freshDom).toHaveCSS('width', '420px');
      await expect(freshDom).toHaveCSS('height', '96px');

      expect(errors).toEqual([]);
    } finally {
      await cleanupPages(page, [{ pageId, scope }]);
    }
  });

  test(J12.line, async ({ page }) => {
    test.setTimeout(150_000);
    expect(J12.description).toBe('desktop/tablet/mobile switch keeps node+handles top-hit');
    const token = makeJourneyToken('J12');
    const scope = `j12-${token}`;
    const ownershipToken = `wb-r07-j12-${token}`;
    assertIsolatedFixture('J12', ownershipToken);

    const errors = attachErrorCollector(page);
    const rootId = `j12-root-${token}`;
    const subjectId = `j12-subject-${token}`;
    const desktopRect = { x: 160, y: 160, width: 300, height: 100 };
    const document = makeDocument(`wb-r07-j12-${token}`, [
      makeRootContainer(rootId, { x: 0, y: 0, width: 1280, height: 760 }),
      makeTextNode(subjectId, rootId, desktopRect, `J12 subject ${token}`, {
        responsive: {
          tablet: { rect: { x: 120, y: 140, width: 300, height: 100 } },
          mobile: { rect: { x: 40, y: 120, width: 280, height: 100 } },
        },
      }),
    ]);

    let pageId: string | null = null;
    try {
      await page.setExtraHTTPHeaders(mutationHeaders(scope));
      const created = await createPage(page, {
        scope,
        slug: `wb-r07-j12-${token}`,
        title: `WB-R07 J12 ${token}`,
        document,
      });
      pageId = created.pageId;
      await openEditor(page, pageId);

      const subject = page.locator(`[data-node-id="${subjectId}"]`).first();
      await expect(subject).toBeVisible();
      await realClick(page, subject, {
        journeyId: 'J12',
        target: { selector: `[data-node-id="${subjectId}"]` },
      });
      await expect(subject).toHaveAttribute('data-selected', 'true');

      for (const viewport of VIEWPORT_MODES) {
        await ensureTopbarSecondaryOpen(page, 'J12');
        const viewportButton = page.locator(`[data-builder-topbar-viewport="${viewport}"]`).first();
        await expect(viewportButton).toBeVisible({ timeout: 15_000 });
        await realClick(page, viewportButton, {
          journeyId: 'J12',
          target: { selector: `[data-builder-topbar-viewport="${viewport}"]` },
        });
        await expect(viewportButton).toHaveAttribute('aria-pressed', 'true');
        await expect(subject).toHaveAttribute('data-selected', 'true');

        const subjectGate = await runReadinessGate(
          makePlaywrightPointerPort(page, subject),
          { journeyId: 'J12', action: 'click', target: { selector: `[data-node-id="${subjectId}"]` } },
          {
            requiredEqualSamples: 3,
            maxPollAttempts: 30,
            epsilon: 0.5,
            yieldBetweenSamples: () => yieldFrame(page),
            now: () => new Date(),
          },
        );
        expect(subjectGate.evidence.reason).toBe('ok');
        expect(subjectGate.evidence.stableBbox).not.toBeNull();
        expect(subjectGate.evidence.identical || subjectGate.evidence.contained).toBe(true);

        for (const handle of RESIZE_HANDLE_SUFFIXES) {
          const handleLocator = page.locator(`[aria-label="Resize text node ${handle}"]`).first();
          await expect(handleLocator).toBeVisible({ timeout: 15_000 });
          const handleGate = await runReadinessGate(
            makePlaywrightPointerPort(page, handleLocator),
            {
              journeyId: 'J12',
              action: 'click',
              target: { selector: `[aria-label="Resize text node ${handle}"]` },
            },
            {
              requiredEqualSamples: 3,
              maxPollAttempts: 30,
              epsilon: 0.5,
              yieldBetweenSamples: () => yieldFrame(page),
              now: () => new Date(),
            },
          );
          expect(handleGate.evidence.reason).toBe('ok');
          expect(handleGate.evidence.stableBbox).not.toBeNull();
          expect(handleGate.evidence.identical || handleGate.evidence.contained).toBe(true);
        }

        const rotateLocator = page.locator('[aria-label="Rotate text node"]').first();
        await expect(rotateLocator).toBeVisible({ timeout: 15_000 });
        const rotateGate = await runReadinessGate(
          makePlaywrightPointerPort(page, rotateLocator),
          { journeyId: 'J12', action: 'click', target: { selector: '[aria-label="Rotate text node"]' } },
          {
            requiredEqualSamples: 3,
            maxPollAttempts: 30,
            epsilon: 0.5,
            yieldBetweenSamples: () => yieldFrame(page),
            now: () => new Date(),
          },
        );
        expect(rotateGate.evidence.reason).toBe('ok');
        expect(rotateGate.evidence.stableBbox).not.toBeNull();
        expect(rotateGate.evidence.identical || rotateGate.evidence.contained).toBe(true);
      }

      expect(errors).toEqual([]);
    } finally {
      await cleanupPages(page, [{ pageId, scope }]);
    }
  });

  test(J13.line, async ({ page }) => {
    test.setTimeout(180_000);
    expect(J13.description).toBe('edit page A\u2192B\u2192A preserves save');
    const token = makeJourneyToken('J13');
    const scopeA = `j13-a-${token}`;
    const scopeB = `j13-b-${token}`;
    const ownershipToken = `wb-r07-j13-${token}`;
    assertIsolatedFixture('J13', ownershipToken);

    const errors = attachErrorCollector(page);
    const rootA = `j13-root-a-${token}`;
    const markerA = `j13-marker-a-${token}`;
    const rootB = `j13-root-b-${token}`;
    const markerB = `j13-marker-b-${token}`;
    const markerARect = { x: 120, y: 120, width: 420, height: 90 };
    const markerBRect = { x: 200, y: 220, width: 360, height: 80 };
    const markerAText = `J13 A original ${token}`;
    const markerBText = `J13 B marker ${token}`;
    const editedAText = `J13 EDITED ${token}`;
    const documentA = makeDocument(`wb-r07-j13-a-${token}`, [
      makeRootContainer(rootA, { x: 0, y: 0, width: 1280, height: 760 }),
      makeTextNode(markerA, rootA, markerARect, markerAText),
    ]);
    const documentB = makeDocument(`wb-r07-j13-b-${token}`, [
      makeRootContainer(rootB, { x: 0, y: 0, width: 1280, height: 760 }),
      makeTextNode(markerB, rootB, markerBRect, markerBText),
    ]);

    let pageAId: string | null = null;
    let pageBId: string | null = null;
    try {
      await page.setExtraHTTPHeaders(mutationHeaders(scopeA));
      const createdA = await createPage(page, {
        scope: scopeA,
        slug: `wb-r07-j13-a-${token}`,
        title: `WB-R07 J13 A ${token}`,
        document: documentA,
      });
      pageAId = createdA.pageId;
      const createdB = await createPage(page, {
        scope: scopeB,
        slug: `wb-r07-j13-b-${token}`,
        title: `WB-R07 J13 B ${token}`,
        document: documentB,
      });
      pageBId = createdB.pageId;
      const pageA = createdA.pageId;
      const pageB = createdB.pageId;

      await openEditor(page, pageA);
      await expect(page.locator(`[data-node-id="${markerA}"]`)).toContainText(markerAText);

      await ensurePagesDrawerOpen(page, 'J13');
      const recorder = recordDraftResponseOrder(page, pageA, pageB);

      const aNode = page.locator(`[data-node-id="${markerA}"]`).first();
      await realDblClick(page, aNode, {
        journeyId: 'J13',
        target: { selector: `[data-node-id="${markerA}"]` },
      });
      await expect(page.locator('.ProseMirror').first()).toBeVisible({ timeout: 15_000 });
      await page.keyboard.press('ControlOrMeta+A');
      await page.keyboard.type(editedAText);

      await switchPageByRow(page, pageB, 'J13');
      await expect(page.locator(`[data-node-id="${markerB}"]`)).toBeVisible({ timeout: 30_000 });

      await ensurePagesDrawerOpen(page, 'J13');
      await switchPageByRow(page, pageA, 'J13');
      await expect(page.locator(`[data-node-id="${markerA}"]`)).toContainText(editedAText);

      expect(recorder.order.includes('A:PUT'), `A PUT recorded: ${recorder.order.join(',')}`).toBe(true);
      expect(recorder.order.includes('B:GET'), `B GET recorded: ${recorder.order.join(',')}`).toBe(true);
      expect(recorder.order.includes('A:GET'), `A GET recorded: ${recorder.order.join(',')}`).toBe(true);
      expect(recorder.order.indexOf('A:PUT')).toBeLessThan(recorder.order.indexOf('B:GET'));
      expect(recorder.order.indexOf('B:GET')).toBeLessThan(recorder.order.indexOf('A:GET'));

      const aDraft = await readDraft(page, pageA, scopeA);
      expect(aDraft.pageId).toBe(pageA);
      expect(aDraft.revision).toBe(1);
      expect(textNodeText(aDraft.document, markerA)).toBe(editedAText);
      expect(rectOf(findNode(aDraft.document, markerA))).toEqual(markerARect);

      const bDraft = await readDraft(page, pageB, scopeB);
      expect(bDraft.pageId).toBe(pageB);
      expect(bDraft.revision).toBe(0);
      expect(textNodeText(bDraft.document, markerB)).toBe(markerBText);
      expect(rectOf(findNode(bDraft.document, markerB))).toEqual(markerBRect);

      expect(errors).toEqual([]);
    } finally {
      await cleanupPages(page, [
        { pageId: pageBId, scope: scopeB },
        { pageId: pageAId, scope: scopeA },
      ]);
    }
  });

  test(J14.line, async ({ page }) => {
    test.setTimeout(150_000);
    expect(J14.description).toBe('reload preserves A text+document checksum');
    const token = makeJourneyToken('J14');
    const scope = `j14-${token}`;
    const ownershipToken = `wb-r07-j14-${token}`;
    assertIsolatedFixture('J14', ownershipToken);

    const errors = attachErrorCollector(page);
    const rootId = `j14-root-${token}`;
    const markerId = `j14-marker-${token}`;
    const markerRect = { x: 140, y: 140, width: 460, height: 90 };
    const originalText = `J14 original ${token}`;
    const reloadedText = `J14 RELOADED ${token}`;
    const document = makeDocument(`wb-r07-j14-${token}`, [
      makeRootContainer(rootId, { x: 0, y: 0, width: 1280, height: 760 }),
      makeTextNode(markerId, rootId, markerRect, originalText),
    ]);

    let pageId: string | null = null;
    try {
      await page.setExtraHTTPHeaders(mutationHeaders(scope));
      pageId = (await createPage(page, {
        scope,
        slug: `wb-r07-j14-${token}`,
        title: `WB-R07 J14 ${token}`,
        document,
      })).pageId;
      await openEditor(page, pageId);

      const marker = page.locator(`[data-node-id="${markerId}"]`).first();
      await expect(marker).toContainText(originalText);
      await realDblClick(page, marker, {
        journeyId: 'J14',
        target: { selector: `[data-node-id="${markerId}"]` },
      });
      await expect(page.locator('.ProseMirror').first()).toBeVisible({ timeout: 15_000 });
      await page.keyboard.press('ControlOrMeta+A');
      await page.keyboard.type(reloadedText);

      await ensureTopbarSecondaryOpen(page, 'J14');
      const presence = page.locator('[data-builder-topbar-presence="true"]').first();
      await expect(presence).toBeVisible();
      await realClick(page, presence, {
        journeyId: 'J14',
        target: { selector: '[data-builder-topbar-presence="true"]' },
      });

      const saved = await pollDraft(
        page,
        pageId,
        scope,
        (view) => view.revision === 1 && textNodeText(view.document, markerId) === reloadedText,
      );
      const checksumBeforeReload = stableSortedJsonSha256(saved.document);
      const rectBeforeReload = rectOf(findNode(saved.document, markerId));

      await page.reload({ waitUntil: 'domcontentloaded' });
      const shell = page.locator('[data-editor-shell]').first();
      await expect(shell).toBeVisible({ timeout: 30_000 });
      await expect(shell).toHaveAttribute('data-editor-ready', 'true', { timeout: 30_000 });
      await expect(page.locator(`[data-node-id="${markerId}"]`)).toContainText(reloadedText);

      const after = await readDraft(page, pageId, scope);
      expect(after.pageId).toBe(pageId);
      expect(after.revision).toBe(1);
      expect(textNodeText(after.document, markerId)).toBe(reloadedText);
      expect(rectOf(findNode(after.document, markerId))).toEqual(rectBeforeReload);
      expect(stableSortedJsonSha256(after.document)).toBe(checksumBeforeReload);

      expect(errors).toEqual([]);
    } finally {
      await cleanupPages(page, [{ pageId, scope }]);
    }
  });

  test(J15.line, async ({ page }) => {
    test.setTimeout(180_000);
    expect(J15.description).toBe('complete drag on A then B same-ID node remains unmoved');
    const token = makeJourneyToken('J15');
    const scopeA = `j15-a-${token}`;
    const scopeB = `j15-b-${token}`;
    const ownershipToken = `wb-r07-j15-${token}`;
    assertIsolatedFixture('J15', ownershipToken);

    const errors = attachErrorCollector(page);
    const rootA = `j15-root-a-${token}`;
    const rootB = `j15-root-b-${token}`;
    const sharedNodeId = `j15-shared-node-${token}`;
    const aOriginalRect = { x: 160, y: 140, width: 360, height: 90 };
    const aMovedRect = { x: 460, y: 335, width: 360, height: 90 };
    const bOriginalRect = { x: 620, y: 360, width: 300, height: 100 };
    const sharedText = `J15 shared ${token}`;
    const documentA = makeDocument(`wb-r07-j15-a-${token}`, [
      makeRootContainer(rootA, { x: 0, y: 0, width: 1280, height: 760 }),
      makeTextNode(sharedNodeId, rootA, aOriginalRect, sharedText),
    ]);
    const documentB = makeDocument(`wb-r07-j15-b-${token}`, [
      makeRootContainer(rootB, { x: 0, y: 0, width: 1280, height: 760 }),
      makeTextNode(sharedNodeId, rootB, bOriginalRect, sharedText),
    ]);

    let pageAId: string | null = null;
    let pageBId: string | null = null;
    try {
      await page.setExtraHTTPHeaders(mutationHeaders(scopeA));
      const createdA = await createPage(page, {
        scope: scopeA,
        slug: `wb-r07-j15-a-${token}`,
        title: `WB-R07 J15 A ${token}`,
        document: documentA,
      });
      pageAId = createdA.pageId;
      const createdB = await createPage(page, {
        scope: scopeB,
        slug: `wb-r07-j15-b-${token}`,
        title: `WB-R07 J15 B ${token}`,
        document: documentB,
      });
      pageBId = createdB.pageId;
      const pageA = createdA.pageId;
      const pageB = createdB.pageId;

      await openEditor(page, pageA);
      await ensurePagesDrawerOpen(page, 'J15');
      const recorder = recordDraftResponseOrder(page, pageA, pageB);

      const sharedNode = page.locator(`[data-node-id="${sharedNodeId}"]`).first();
      await expect(sharedNode).toBeVisible();
      await realClick(page, sharedNode, {
        journeyId: 'J15',
        target: { selector: `[data-node-id="${sharedNodeId}"]` },
      });
      await expect(sharedNode).toHaveAttribute('data-selected', 'true');

      const stage = page.getByRole('application', { name: 'Canvas editor' });
      const beforeDragBox = await sharedNode.boundingBox();
      expect(beforeDragBox, 'shared node must render before drag').not.toBeNull();

      const dragEvidence = await realDrag(page, sharedNode, stage, {
        journeyId: 'J15',
        source: { selector: `[data-node-id="${sharedNodeId}"]` },
        target: { selector: '[role="application"]' },
      });
      expect(dragEvidence.source.reason).toBe('ok');
      expect(dragEvidence.target.reason).toBe('ok');
      expect(dragEvidence.target.identical || dragEvidence.target.contained).toBe(true);

      const afterDragBox = await sharedNode.boundingBox();
      expect(afterDragBox, 'shared node must render after drag').not.toBeNull();
      expect(afterDragBox!.x).not.toBe(beforeDragBox!.x);
      await expect(sharedNode).toHaveCSS('left', '460px');
      await expect(sharedNode).toHaveCSS('top', '335px');
      await expect(sharedNode).toHaveCSS('width', '360px');
      await expect(sharedNode).toHaveCSS('height', '90px');

      await switchPageByRow(page, pageB, 'J15');

      const aSaved = await pollDraft(
        page,
        pageA,
        scopeA,
        (view) => view.revision === 1 && rectEquals(rectOf(findNode(view.document, sharedNodeId)), aMovedRect),
      );
      expect(aSaved.pageId).toBe(pageA);
      expect(aSaved.revision).toBe(1);
      expect(rectOf(findNode(aSaved.document, sharedNodeId))).toEqual(aMovedRect);

      const bDraft = await readDraft(page, pageB, scopeB);
      expect(bDraft.pageId).toBe(pageB);
      expect(bDraft.revision).toBe(0);
      expect(rectOf(findNode(bDraft.document, sharedNodeId))).toEqual(bOriginalRect);

      const bSharedNode = page.locator(`[data-node-id="${sharedNodeId}"]`).first();
      await expect(bSharedNode).not.toHaveAttribute('data-selected', 'true');
      await expect(bSharedNode).toHaveCSS('left', '620px');
      await expect(bSharedNode).toHaveCSS('top', '360px');
      await expect(bSharedNode).toHaveCSS('width', '300px');
      await expect(bSharedNode).toHaveCSS('height', '100px');

      expect(recorder.order.includes('A:PUT'), `A PUT recorded: ${recorder.order.join(',')}`).toBe(true);
      expect(recorder.order.includes('B:GET'), `B GET recorded: ${recorder.order.join(',')}`).toBe(true);
      expect(recorder.order.indexOf('A:PUT')).toBeLessThan(recorder.order.indexOf('B:GET'));

      expect(errors).toEqual([]);
    } finally {
      await cleanupPages(page, [
        { pageId: pageBId, scope: scopeB },
        { pageId: pageAId, scope: scopeA },
      ]);
    }
  });
});

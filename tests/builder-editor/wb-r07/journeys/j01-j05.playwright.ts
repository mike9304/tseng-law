import { createHash, randomUUID } from 'node:crypto';

import { expect, test, type APIRequestContext, type Page } from '@playwright/test';
import type { BuilderCanvasDocument, BuilderCanvasNode } from '@/lib/builder/canvas/types';
import {
  annotatePointerAbortRecovery,
  makePlaywrightPointerPort,
  realClick,
  realDblClick,
  realDrag,
  runReadinessGate,
  safeAbortPressedPointer,
  type SanitizedEvidence,
} from '../support/real-pointer';
import {
  assertCanonicalManifest,
  JOURNEY_IDS,
  validateJourneyManifest,
  type JourneyId,
} from '../support/journey-manifest';
import {
  createFixtureDocument,
  validateFixtureDocument,
} from '../support/fixture-document';

const ROOT_ID = 'home-attorney-root';
const TITLE_ID = 'home-attorney-title';
const INTRO_ID = 'home-attorney-intro-1';
const DRAG_TARGET_ID = 'wb-r07-drag-target';
const FIXTURE_NODE_IDS = [ROOT_ID, TITLE_ID, INTRO_ID, DRAG_TARGET_ID] as const;

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

interface LocalRect {
  readonly x: number;
  readonly y: number;
  readonly width: number;
  readonly height: number;
}

interface CreatedPage {
  readonly pageId: string;
  readonly slug: string;
  readonly headers: Readonly<Record<string, string>>;
}

interface DraftPayload {
  readonly draft?: {
    readonly revision?: number;
    readonly savedAt?: string;
    readonly updatedBy?: string;
  } | null;
  readonly document?: BuilderCanvasDocument;
}

interface DraftSnapshot {
  readonly revision: number;
  readonly document: BuilderCanvasDocument;
  readonly checksum: string;
}

interface BrowserErrors {
  readonly consoleErrors: string[];
  readonly pageErrors: string[];
}

function journeyEntry(id: JourneyId) {
  const entry = assertCanonicalManifest().find((candidate) => candidate.id === id);
  if (!entry) throw new Error(`WB-R07 journey entry missing for ${id}`);
  return entry;
}

const J01 = journeyEntry('J01');
const J02 = journeyEntry('J02');
const J03 = journeyEntry('J03');
const J04 = journeyEntry('J04');
const J05 = journeyEntry('J05');

function collectBrowserErrors(page: Page): BrowserErrors {
  const consoleErrors: string[] = [];
  const pageErrors: string[] = [];
  page.on('console', (message) => {
    if (message.type() === 'error') consoleErrors.push(message.text());
  });
  page.on('pageerror', (error) => {
    pageErrors.push(error.message);
  });
  return { consoleErrors, pageErrors };
}

async function routeExternalFonts(page: Page): Promise<void> {
  await page.route('https://fonts.googleapis.com/**', (route) =>
    route.fulfill({ status: 200, contentType: 'text/css', body: '' }),
  );
  await page.route('https://fonts.gstatic.com/**', (route) =>
    route.fulfill({ status: 200, contentType: 'font/woff2', body: '' }),
  );
}

function uniqueToken(tag: string): string {
  return `${tag}-${Date.now().toString(36)}-${randomUUID().replace(/-/gu, '').slice(0, 12)}`;
}

function mutationHeaders(token: string): Readonly<Record<string, string>> {
  const safeToken = token.replace(/[^a-z0-9-]/giu, '-').slice(-56);
  return { 'x-forwarded-for': `pw-${safeToken}` };
}

function makeTextNode(
  id: string,
  text: string,
  rect: LocalRect,
  zIndex: number,
  parentId?: string,
): BuilderCanvasNode {
  return {
    id,
    kind: 'text',
    ...(parentId ? { parentId } : {}),
    rect,
    style: { ...BASE_STYLE, borderRadius: 8 },
    zIndex,
    rotation: 0,
    locked: false,
    visible: true,
    content: {
      text,
      fontSize: id === TITLE_ID ? 36 : 22,
      color: '#0f172a',
      fontWeight: id === TITLE_ID ? 'bold' : 'regular',
      align: 'left',
      lineHeight: 1.2,
      letterSpacing: 0,
      fontFamily: 'system-ui',
      verticalAlign: 'top',
      textTransform: 'none',
      as: id === TITLE_ID ? 'h2' : 'p',
    },
  };
}

function createJourneyDocument(token: string): BuilderCanvasDocument {
  const root: BuilderCanvasNode = {
    id: ROOT_ID,
    kind: 'container',
    rect: { x: 120, y: 100, width: 720, height: 520 },
    style: { ...BASE_STYLE, backgroundColor: '#f8fafc', borderRadius: 16 },
    zIndex: 0,
    rotation: 0,
    locked: false,
    visible: true,
    content: {
      label: `WB-R07 attorney ${token}`,
      background: '#f8fafc',
      borderColor: '#cbd5e1',
      borderStyle: 'solid',
      borderWidth: 1,
      borderRadius: 16,
      padding: 0,
      layoutMode: 'absolute',
      as: 'section',
    },
  };
  const document: BuilderCanvasDocument = {
    version: 1,
    locale: 'ko',
    updatedAt: new Date().toISOString(),
    updatedBy: `wb-r07-${token}`,
    stageWidth: 1280,
    stageHeight: 760,
    nodes: [
      root,
      makeTextNode(TITLE_ID, `담당 변호사 ${token}`, { x: 60, y: 70, width: 500, height: 90 }, 1, ROOT_ID),
      makeTextNode(INTRO_ID, `상담 소개 ${token}`, { x: 60, y: 300, width: 520, height: 100 }, 2, ROOT_ID),
      makeTextNode(DRAG_TARGET_ID, `드래그 목표 ${token}`, { x: 980, y: 500, width: 180, height: 90 }, 3),
    ],
  };
  const ids = document.nodes.map((node) => node.id);
  if (ids.join('|') !== FIXTURE_NODE_IDS.join('|')) {
    throw new Error(`WB-R07 fixture node manifest drifted: ${ids.join(',')}`);
  }
  return document;
}

function assertFixtureOwnership(token: string): void {
  const manifest = assertCanonicalManifest();
  const manifestResult = validateJourneyManifest(manifest);
  if (!manifestResult.ok) {
    throw new Error(`WB-R07 canonical manifest is invalid: ${manifestResult.errors.join('; ')}`);
  }
  const isolationRoot = process.env.BUILDER_QA_ISOLATION_ROOT;
  if (!isolationRoot) {
    throw new Error('BUILDER_QA_ISOLATION_ROOT is required for WB-R07 journeys');
  }
  const fixture = validateFixtureDocument(createFixtureDocument({
    isolationRoot,
    ownershipToken: `wb-r07-j01-j05-${token}`,
    journeys: [...JOURNEY_IDS],
  }));
  const ownedIds = fixture.ownership.journeys.slice(0, 5);
  if (ownedIds.join('|') !== ['J01', 'J02', 'J03', 'J04', 'J05'].join('|')) {
    throw new Error(`WB-R07 fixture does not own J01-J05: ${ownedIds.join(',')}`);
  }
}

async function createJourneyPage(
  request: APIRequestContext,
  tag: string,
  token: string,
  document: BuilderCanvasDocument,
  headers: Readonly<Record<string, string>>,
): Promise<CreatedPage> {
  const slug = `wb-r07-${tag}-${token}`;
  const response = await request.post('/api/builder/site/pages', {
    data: {
      locale: 'ko',
      slug,
      title: `WB-R07 ${tag} ${token}`,
      document,
    },
    headers,
  });
  if (response.status() !== 200) {
    throw new Error(`WB-R07 ${tag} page create returned HTTP ${response.status()}`);
  }
  const payload = (await response.json()) as { success?: boolean; pageId?: string; error?: string };
  if (!payload.success || !payload.pageId) {
    throw new Error(`WB-R07 ${tag} page create failed: ${payload.error ?? 'page id missing'}`);
  }
  return { pageId: payload.pageId, slug, headers };
}

async function deleteJourneyPage(request: APIRequestContext, created: CreatedPage): Promise<void> {
  await request.delete(
    `/api/builder/site/pages/${encodeURIComponent(created.pageId)}?locale=ko`,
    { headers: created.headers, failOnStatusCode: false },
  ).catch(() => undefined);
}

async function waitForEditorReady(page: Page): Promise<void> {
  const shell = page.locator('[data-editor-shell]').first();
  await expect(shell).toBeVisible({ timeout: 30_000 });
  await expect(shell).toHaveAttribute('data-editor-ready', 'true', { timeout: 30_000 });
  await expect(page.getByRole('application', { name: 'Canvas editor' })).toBeVisible({ timeout: 30_000 });
  await expect(page.locator(`[data-node-id="${ROOT_ID}"]`).first()).toBeVisible({ timeout: 30_000 });
  await expect(page.locator(`[data-node-id="${TITLE_ID}"]`).first()).toBeVisible({ timeout: 30_000 });
  await expect(page.locator(`[data-node-id="${INTRO_ID}"]`).first()).toBeVisible({ timeout: 30_000 });
  await expect(page.locator(`[data-node-id="${DRAG_TARGET_ID}"]`).first()).toBeVisible({ timeout: 30_000 });
}

async function openIsolatedBuilder(page: Page, created: CreatedPage, scope: string): Promise<void> {
  await page.goto(
    `/ko/admin-builder?pageId=${encodeURIComponent(created.pageId)}&wbR07=${encodeURIComponent(scope)}`,
    { waitUntil: 'domcontentloaded' },
  );
  await waitForEditorReady(page);
}

function documentChecksum(document: BuilderCanvasDocument): string {
  return createHash('sha256').update(JSON.stringify(document)).digest('hex');
}

async function readDraftSnapshot(
  request: APIRequestContext,
  created: CreatedPage,
): Promise<DraftSnapshot> {
  const response = await request.get(
    `/api/builder/site/pages/${encodeURIComponent(created.pageId)}/draft?locale=ko`,
    { headers: created.headers, failOnStatusCode: false },
  );
  if (response.status() !== 200) {
    throw new Error(`WB-R07 draft read returned HTTP ${response.status()}`);
  }
  const payload = (await response.json()) as DraftPayload;
  if (!payload.document || typeof payload.draft?.revision !== 'number') {
    throw new Error('WB-R07 draft payload is missing its document or revision');
  }
  return {
    revision: payload.draft.revision,
    document: payload.document,
    checksum: documentChecksum(payload.document),
  };
}

function findNode(snapshot: DraftSnapshot, nodeId: string): BuilderCanvasNode {
  const node = snapshot.document.nodes.find((candidate) => candidate.id === nodeId);
  if (!node) throw new Error(`WB-R07 draft node missing: ${nodeId}`);
  return node;
}

function textContent(snapshot: DraftSnapshot, nodeId: string): string {
  const node = findNode(snapshot, nodeId);
  if (node.kind !== 'text' || typeof node.content.text !== 'string') {
    throw new Error(`WB-R07 draft text missing: ${nodeId}`);
  }
  return node.content.text;
}

function richPlainText(snapshot: DraftSnapshot, nodeId: string): string | null {
  const node = findNode(snapshot, nodeId);
  if (node.kind !== 'text') return null;
  return node.content.richText?.plainText ?? null;
}

async function selectedNodeIds(page: Page): Promise<string[]> {
  return page.locator('[data-node-id][data-selected="true"]').evaluateAll((elements) => elements
    .map((element) => element.getAttribute('data-node-id') ?? '')
    .filter(Boolean)
    .sort());
}

async function domBbox(page: Page, nodeId: string): Promise<LocalRect> {
  const box = await page.locator(`[data-node-id="${nodeId}"]`).first().boundingBox();
  if (!box) throw new Error(`WB-R07 DOM bbox missing: ${nodeId}`);
  return { x: box.x, y: box.y, width: box.width, height: box.height };
}

function expectEvidence(
  evidence: SanitizedEvidence,
  journeyId: JourneyId,
  exactNodeId?: string,
  structural?: { readonly role?: string; readonly topTagName?: string },
): void {
  expect(evidence.journeyId).toBe(journeyId);
  expect(evidence.reason).toBe('ok');
  expect(evidence.timestampUtc).toMatch(/^\d{4}-\d{2}-\d{2}T/);
  expect(Number.isNaN(Date.parse(evidence.timestampUtc))).toBe(false);
  expect(evidence.stableBbox).not.toBeNull();
  expect(evidence.stableBbox?.width).toBeGreaterThan(0);
  expect(evidence.stableBbox?.height).toBeGreaterThan(0);
  expect(evidence.domChain.length).toBeGreaterThan(0);
  if (exactNodeId) {
    expect(evidence.domChain.map((entry) => entry.dataNodeId)).toContain(exactNodeId);
  }
  if (structural?.role) {
    expect(evidence.domChain.map((entry) => entry.role)).toContain(structural.role);
  }
  if (structural?.topTagName) {
    expect(evidence.topHit?.tagName).toBe(structural.topTagName);
  }
}

function expectNoBrowserErrors(errors: BrowserErrors): void {
  expect(errors.consoleErrors).toEqual([]);
  expect(errors.pageErrors).toEqual([]);
}

function rectChangedMaterially(before: LocalRect, after: LocalRect): boolean {
  return Math.abs(after.x - before.x) >= 24 || Math.abs(after.y - before.y) >= 24;
}

test.describe('WB-R07 real-pointer journeys J01-J05', () => {
  test(J01.line, async ({ page, request }) => {
    expect(J01.line).toBe('J01 attorney container selected then title click selects exact child only');
    test.setTimeout(180_000);
    const token = uniqueToken('j01');
    const headers = mutationHeaders(token);
    assertFixtureOwnership(token);
    await page.setExtraHTTPHeaders(headers);
    await routeExternalFonts(page);
    const errors = collectBrowserErrors(page);
    const created = await createJourneyPage(request, 'j01', token, createJourneyDocument(token), headers);
    try {
      await openIsolatedBuilder(page, created, token);
      const root = page.locator(`[data-node-id="${ROOT_ID}"]`).first();
      const title = page.locator(`[data-node-id="${TITLE_ID}"]`).first();
      const beforeDraft = await readDraftSnapshot(request, created);
      const beforeRootBbox = await domBbox(page, ROOT_ID);
      const beforeTitleBbox = await domBbox(page, TITLE_ID);
      const beforeIntroBbox = await domBbox(page, INTRO_ID);

      const rootEvidence = await realClick(page, root, {
        journeyId: 'J01',
        target: { selector: `[data-node-id="${ROOT_ID}"]` },
      });
      expectEvidence(rootEvidence, 'J01', ROOT_ID);
      await expect.poll(() => selectedNodeIds(page)).toEqual([ROOT_ID]);

      const titleEvidence = await realClick(page, title, {
        journeyId: 'J01',
        target: { selector: `[data-node-id="${TITLE_ID}"]` },
      });
      expectEvidence(titleEvidence, 'J01', TITLE_ID);
      await expect.poll(() => selectedNodeIds(page)).toEqual([TITLE_ID]);

      expect(await domBbox(page, ROOT_ID)).toEqual(beforeRootBbox);
      expect(await domBbox(page, TITLE_ID)).toEqual(beforeTitleBbox);
      expect(await domBbox(page, INTRO_ID)).toEqual(beforeIntroBbox);
      const afterDraft = await readDraftSnapshot(request, created);
      expect(afterDraft.revision).toBe(beforeDraft.revision);
      expect(afterDraft.checksum).toBe(beforeDraft.checksum);
      expect(findNode(afterDraft, ROOT_ID).rect).toEqual(findNode(beforeDraft, ROOT_ID).rect);
      expect(findNode(afterDraft, TITLE_ID).rect).toEqual(findNode(beforeDraft, TITLE_ID).rect);
      expect(findNode(afterDraft, INTRO_ID).rect).toEqual(findNode(beforeDraft, INTRO_ID).rect);
      expectNoBrowserErrors(errors);
    } finally {
      await deleteJourneyPage(request, created);
    }
  });

  test(J02.line, async ({ page, request }) => {
    expect(J02.line).toBe('J02 intro select/dblclick/cancel preserves position+target');
    test.setTimeout(180_000);
    const token = uniqueToken('j02');
    const headers = mutationHeaders(token);
    assertFixtureOwnership(token);
    await page.setExtraHTTPHeaders(headers);
    await routeExternalFonts(page);
    const errors = collectBrowserErrors(page);
    const created = await createJourneyPage(request, 'j02', token, createJourneyDocument(token), headers);
    try {
      await openIsolatedBuilder(page, created, token);
      const intro = page.locator(`[data-node-id="${INTRO_ID}"]`).first();
      const beforeDraft = await readDraftSnapshot(request, created);
      const beforeBbox = await domBbox(page, INTRO_ID);
      const originalText = textContent(beforeDraft, INTRO_ID);
      const originalContent = findNode(beforeDraft, INTRO_ID).content;

      const selectEvidence = await realClick(page, intro, {
        journeyId: 'J02',
        target: { selector: `[data-node-id="${INTRO_ID}"]` },
      });
      expectEvidence(selectEvidence, 'J02', INTRO_ID);
      await expect.poll(() => selectedNodeIds(page)).toEqual([INTRO_ID]);

      const editEvidence = await realDblClick(page, intro, {
        journeyId: 'J02',
        target: { selector: `[data-node-id="${INTRO_ID}"]` },
      });
      expectEvidence(editEvidence, 'J02', INTRO_ID);
      const editor = intro.locator('[data-builder-inline-text-editor="true"]').first();
      const visibleEditors = page.locator('[data-builder-inline-text-editor="true"]:visible');
      const editable = editor.locator('.ProseMirror').first();
      const cancelAction = editor.locator('[data-builder-inline-text-action="cancel"]').first();
      await expect(editor).toBeVisible();
      await expect(visibleEditors).toHaveCount(1);
      expect(await editor.evaluate((element) => element.closest('[data-node-id]')?.getAttribute('data-node-id')))
        .toBe(INTRO_ID);
      await expect(cancelAction).toBeVisible();
      await editable.fill(`취소되어야 하는 소개 ${token}`);
      await page.keyboard.press('Escape');
      await expect(editor).toBeHidden();

      await expect.poll(() => selectedNodeIds(page)).toEqual([INTRO_ID]);
      await expect(intro).toContainText(originalText);
      expect(await domBbox(page, INTRO_ID)).toEqual(beforeBbox);
      const afterDraft = await readDraftSnapshot(request, created);
      expect(afterDraft.revision).toBe(beforeDraft.revision);
      expect(afterDraft.checksum).toBe(beforeDraft.checksum);
      expect(findNode(afterDraft, INTRO_ID).rect).toEqual(findNode(beforeDraft, INTRO_ID).rect);
      expect(findNode(afterDraft, INTRO_ID).content).toEqual(originalContent);
      expectNoBrowserErrors(errors);
    } finally {
      await deleteJourneyPage(request, created);
    }
  });

  test(J03.line, async ({ page, request }) => {
    expect(J03.line).toBe('J03 inline toolbar commit persists draft/reload');
    test.setTimeout(180_000);
    const token = uniqueToken('j03');
    const headers = mutationHeaders(token);
    assertFixtureOwnership(token);
    await page.setExtraHTTPHeaders(headers);
    await routeExternalFonts(page);
    const errors = collectBrowserErrors(page);
    const created = await createJourneyPage(request, 'j03', token, createJourneyDocument(token), headers);
    try {
      await openIsolatedBuilder(page, created, token);
      const title = page.locator(`[data-node-id="${TITLE_ID}"]`).first();
      const beforeDraft = await readDraftSnapshot(request, created);
      const beforeRect = findNode(beforeDraft, TITLE_ID).rect;
      const committedText = `수정된 담당 변호사 ${token}`;

      const selectEvidence = await realClick(page, title, {
        journeyId: 'J03',
        target: { selector: `[data-node-id="${TITLE_ID}"]` },
      });
      expectEvidence(selectEvidence, 'J03', TITLE_ID);
      await expect.poll(() => selectedNodeIds(page)).toEqual([TITLE_ID]);

      const editEvidence = await realDblClick(page, title, {
        journeyId: 'J03',
        target: { selector: `[data-node-id="${TITLE_ID}"]` },
      });
      expectEvidence(editEvidence, 'J03', TITLE_ID);
      const editor = title.locator('[data-builder-inline-text-editor="true"]').first();
      const editable = editor.locator('.ProseMirror').first();
      const commitAction = editor.locator('[data-builder-inline-text-action="commit"]').first();
      await expect(editor).toBeVisible();
      await editable.fill(committedText);

      const commitEvidence = await realClick(page, commitAction, {
        journeyId: 'J03',
        target: { selector: '[data-builder-inline-text-action="commit"]' },
      });
      expectEvidence(commitEvidence, 'J03', TITLE_ID);
      await expect(editor).toBeHidden();
      await expect(title).toContainText(committedText);
      await expect.poll(() => selectedNodeIds(page)).toEqual([TITLE_ID]);

      await expect.poll(
        async () => (await readDraftSnapshot(request, created)).revision,
        { timeout: 30_000, intervals: [200, 400, 800] },
      ).toBeGreaterThan(beforeDraft.revision);
      const committedDraft = await readDraftSnapshot(request, created);
      expect(textContent(committedDraft, TITLE_ID)).toBe(committedText);
      expect(richPlainText(committedDraft, TITLE_ID)).toBe(committedText);
      expect(findNode(committedDraft, TITLE_ID).rect).toEqual(beforeRect);
      expect(committedDraft.checksum).not.toBe(beforeDraft.checksum);

      await page.reload({ waitUntil: 'domcontentloaded' });
      await waitForEditorReady(page);
      const reloadedTitle = page.locator(`[data-node-id="${TITLE_ID}"]`).first();
      await expect(reloadedTitle).toContainText(committedText);
      await expect.poll(() => selectedNodeIds(page)).toEqual([]);
      const reloadedDraft = await readDraftSnapshot(request, created);
      expect(reloadedDraft.revision).toBe(committedDraft.revision);
      expect(reloadedDraft.checksum).toBe(committedDraft.checksum);
      expect(textContent(reloadedDraft, TITLE_ID)).toBe(committedText);
      expect(richPlainText(reloadedDraft, TITLE_ID)).toBe(committedText);
      expect(findNode(reloadedDraft, TITLE_ID).rect).toEqual(beforeRect);
      expectNoBrowserErrors(errors);
    } finally {
      await deleteJourneyPage(request, created);
    }
  });

  test(J04.line, async ({ page, request }) => {
    expect(J04.line).toBe('J04 small pointer jitter does not move node');
    test.setTimeout(180_000);
    const token = uniqueToken('j04');
    const headers = mutationHeaders(token);
    assertFixtureOwnership(token);
    await page.setExtraHTTPHeaders(headers);
    await routeExternalFonts(page);
    const errors = collectBrowserErrors(page);
    const created = await createJourneyPage(request, 'j04', token, createJourneyDocument(token), headers);
    try {
      await openIsolatedBuilder(page, created, token);
      const title = page.locator(`[data-node-id="${TITLE_ID}"]`).first();
      const selectEvidence = await realClick(page, title, {
        journeyId: 'J04',
        target: { selector: `[data-node-id="${TITLE_ID}"]` },
      });
      expectEvidence(selectEvidence, 'J04', TITLE_ID);
      await expect.poll(() => selectedNodeIds(page)).toEqual([TITLE_ID]);
      const beforeDraft = await readDraftSnapshot(request, created);
      const beforeBbox = await domBbox(page, TITLE_ID);

      const sourcePort = makePlaywrightPointerPort(page, title);
      const sourceContext = {
        journeyId: 'J04' as const,
        action: 'drag:source' as const,
        target: { selector: `[data-node-id="${TITLE_ID}"]` },
      };
      const readiness = await runReadinessGate(sourcePort, sourceContext);
      expectEvidence(readiness.evidence, 'J04', TITLE_ID);
      await page.mouse.move(readiness.point.x, readiness.point.y);
      let pressed = false;
      let released = false;
      try {
        await page.mouse.down();
        pressed = true;
        await page.mouse.move(readiness.point.x + 2, readiness.point.y + 2, { steps: 2 });
        await page.mouse.up();
        released = true;
      } catch (error) {
        if (pressed && !released) {
          const recovery = await safeAbortPressedPointer(page, sourcePort, sourceContext, 2);
          released = recovery.released;
          annotatePointerAbortRecovery(error, recovery);
        }
        throw error;
      }

      await expect.poll(() => selectedNodeIds(page)).toEqual([TITLE_ID]);
      expect(await domBbox(page, TITLE_ID)).toEqual(beforeBbox);
      const afterDraft = await readDraftSnapshot(request, created);
      expect(afterDraft.revision).toBe(beforeDraft.revision);
      expect(afterDraft.checksum).toBe(beforeDraft.checksum);
      expect(findNode(afterDraft, TITLE_ID).rect).toEqual(findNode(beforeDraft, TITLE_ID).rect);
      expect(findNode(afterDraft, TITLE_ID).content).toEqual(findNode(beforeDraft, TITLE_ID).content);
      expectNoBrowserErrors(errors);
    } finally {
      await deleteJourneyPage(request, created);
    }
  });

  test(J05.line, async ({ page, request }) => {
    expect(J05.line).toBe('J05 real node drag/release/undo');
    test.setTimeout(180_000);
    const token = uniqueToken('j05');
    const headers = mutationHeaders(token);
    assertFixtureOwnership(token);
    await page.setExtraHTTPHeaders(headers);
    await routeExternalFonts(page);
    const errors = collectBrowserErrors(page);
    const created = await createJourneyPage(request, 'j05', token, createJourneyDocument(token), headers);
    try {
      await openIsolatedBuilder(page, created, token);
      const title = page.locator(`[data-node-id="${TITLE_ID}"]`).first();
      const stage = page.getByRole('application', { name: 'Canvas editor' });
      const selectEvidence = await realClick(page, title, {
        journeyId: 'J05',
        target: { selector: `[data-node-id="${TITLE_ID}"]` },
      });
      expectEvidence(selectEvidence, 'J05', TITLE_ID);
      await expect.poll(() => selectedNodeIds(page)).toEqual([TITLE_ID]);
      const beforeDraft = await readDraftSnapshot(request, created);
      const beforeBbox = await domBbox(page, TITLE_ID);
      const beforeTargetBbox = await domBbox(page, DRAG_TARGET_ID);

      const dragEvidence = await realDrag(page, title, stage, {
        journeyId: 'J05',
        source: { selector: `[data-node-id="${TITLE_ID}"]` },
        target: { selector: '[role="application"][aria-label="Canvas editor"]' },
        steps: 16,
      });
      expectEvidence(dragEvidence.source, 'J05', TITLE_ID);
      expectEvidence(dragEvidence.target, 'J05', undefined, { role: 'application' });
      await expect.poll(() => selectedNodeIds(page)).toEqual([TITLE_ID]);
      await expect.poll(
        async () => rectChangedMaterially(beforeBbox, await domBbox(page, TITLE_ID)),
        { timeout: 20_000, intervals: [100, 250, 500] },
      ).toBe(true);
      expect(await domBbox(page, DRAG_TARGET_ID)).toEqual(beforeTargetBbox);

      await expect.poll(
        async () => (await readDraftSnapshot(request, created)).revision,
        { timeout: 30_000, intervals: [200, 400, 800] },
      ).toBeGreaterThan(beforeDraft.revision);
      const draggedDraft = await readDraftSnapshot(request, created);
      expect(findNode(draggedDraft, TITLE_ID).rect).not.toEqual(findNode(beforeDraft, TITLE_ID).rect);
      expect(draggedDraft.checksum).not.toBe(beforeDraft.checksum);

      const stageToolbar = page.locator('[data-builder-stage-toolbar="true"]').first();
      const undoButton = stageToolbar.getByRole('button', { name: '실행 취소', exact: true });
      await expect(stageToolbar).toBeVisible();
      await expect(undoButton).toBeEnabled();
      const undoEvidence = await realClick(page, undoButton, {
        journeyId: 'J05',
        target: { selector: '[data-builder-stage-toolbar="true"] button' },
      });
      expectEvidence(undoEvidence, 'J05', undefined, { topTagName: 'button' });

      await expect.poll(
        async () => (await readDraftSnapshot(request, created)).revision,
        { timeout: 30_000, intervals: [200, 400, 800] },
      ).toBeGreaterThan(draggedDraft.revision);
      await expect.poll(() => domBbox(page, TITLE_ID), {
        timeout: 20_000,
        intervals: [100, 250, 500],
      }).toEqual(beforeBbox);
      await expect.poll(() => selectedNodeIds(page)).toEqual([TITLE_ID]);
      const undoneDraft = await readDraftSnapshot(request, created);
      expect(findNode(undoneDraft, TITLE_ID).rect).toEqual(findNode(beforeDraft, TITLE_ID).rect);
      expect(findNode(undoneDraft, TITLE_ID).content).toEqual(findNode(beforeDraft, TITLE_ID).content);
      expect(undoneDraft.checksum).toBe(beforeDraft.checksum);

      await page.reload({ waitUntil: 'domcontentloaded' });
      await waitForEditorReady(page);
      await expect(page.locator(`[data-node-id="${TITLE_ID}"]`).first())
        .toContainText(textContent(beforeDraft, TITLE_ID));
      await expect.poll(() => domBbox(page, TITLE_ID)).toEqual(beforeBbox);
      await expect.poll(() => selectedNodeIds(page)).toEqual([]);
      const reloadedDraft = await readDraftSnapshot(request, created);
      expect(reloadedDraft.revision).toBe(undoneDraft.revision);
      expect(reloadedDraft.checksum).toBe(beforeDraft.checksum);
      expect(findNode(reloadedDraft, TITLE_ID).rect).toEqual(findNode(beforeDraft, TITLE_ID).rect);
      expect(findNode(reloadedDraft, TITLE_ID).content).toEqual(findNode(beforeDraft, TITLE_ID).content);
      expectNoBrowserErrors(errors);
    } finally {
      await deleteJourneyPage(request, created);
    }
  });
});

import { expect, test, type Page } from '@playwright/test';
import { FAQ_SECTION_ROOT_HEIGHT } from '@/lib/builder/canvas/decompose-faq';
import { INSIGHTS_SECTION_ROOT_HEIGHT } from '@/lib/builder/canvas/decompose-insights';
import { SERVICES_SECTION_ROOT_HEIGHT } from '@/lib/builder/canvas/decompose-services';
import { createHomePageCanvasDocumentDecomposed } from '@/lib/builder/canvas/seed-home';
import type { BuilderCanvasDocument, BuilderCanvasNode } from '@/lib/builder/canvas/types';
import { openBuilder } from './helpers/editor';

function mutationHeaders(scope: string): Record<string, string> {
  const safeScope = scope.replace(/[^a-z0-9-]/gi, '-').slice(-48) || 'node-click-stability';
  return { 'x-forwarded-for': `pw-${safeScope}` };
}

function findNode(document: BuilderCanvasDocument, nodeId: string): BuilderCanvasNode {
  const node = document.nodes.find((candidate) => candidate.id === nodeId);
  if (!node) throw new Error(`Missing canvas node: ${nodeId}`);
  return node;
}

function makeStaleBoundaryDocument(token: string): BuilderCanvasDocument {
  const document = createHomePageCanvasDocumentDecomposed('ko');
  return {
    ...document,
    stageHeight: Math.max(880, document.stageHeight - 300),
    updatedAt: new Date().toISOString(),
    updatedBy: `stale-boundary-${token}`,
    nodes: document.nodes.map((node) => {
      if (node.id === 'home-insights-root') {
        return { ...node, rect: { ...node.rect, height: INSIGHTS_SECTION_ROOT_HEIGHT - 80 } };
      }
      if (node.id === 'home-services-root') {
        return { ...node, rect: { ...node.rect, height: SERVICES_SECTION_ROOT_HEIGHT - 120 } };
      }
      if (node.id === 'home-faq-root') {
        return { ...node, rect: { ...node.rect, height: FAQ_SECTION_ROOT_HEIGHT - 160 } };
      }
      if (node.id === 'home-faq-list') {
        return { ...node, rect: { ...node.rect, height: Math.max(100, node.rect.height - 180) } };
      }
      return node;
    }),
  };
}

async function createBuilderPage(page: Page, slug: string, document: BuilderCanvasDocument): Promise<string> {
  const response = await page.request.post('/api/builder/site/pages', {
    data: {
      locale: 'ko',
      slug,
      title: `Boundary persistence ${slug}`,
      document,
    },
    headers: mutationHeaders(slug),
  });
  expect(response.status()).toBe(200);
  const payload = (await response.json()) as { success?: boolean; pageId?: string; error?: string };
  expect(payload.success, payload.error).toBe(true);
  expect(payload.pageId).toBeTruthy();
  return payload.pageId!;
}

async function fetchDraftDocument(page: Page, pageId: string, scope: string): Promise<BuilderCanvasDocument> {
  const response = await page.request.get(`/api/builder/site/pages/${pageId}/draft?locale=ko`, {
    headers: mutationHeaders(scope),
  });
  expect(response.status()).toBe(200);
  const payload = (await response.json()) as {
    document?: BuilderCanvasDocument;
    snapshot?: { document?: BuilderCanvasDocument };
  };
  const document = payload.snapshot?.document ?? payload.document;
  expect(document).toBeTruthy();
  return document!;
}

async function expectEditorSurfaceIntact(page: Page) {
  await expect(page).toHaveURL(/\/ko\/admin-builder/);
  await expect(page.getByRole('application', { name: 'Canvas editor' })).toBeVisible();
  await expect(page.locator('body')).toContainText('호정국제');
  await expect.poll(() => page.locator('[data-node-id]').count()).toBeGreaterThan(25);
}

async function expectNodeBelow(
  upper: ReturnType<Page['locator']>,
  lower: ReturnType<Page['locator']>,
  minGap = 4,
) {
  const upperBox = await upper.boundingBox();
  const lowerBox = await lower.boundingBox();
  expect(upperBox).not.toBeNull();
  expect(lowerBox).not.toBeNull();
  if (!upperBox || !lowerBox) throw new Error('Missing node bounds for vertical stack assertion.');
  expect(lowerBox.y).toBeGreaterThanOrEqual(upperBox.y + upperBox.height + minGap);
}

async function expectElementInside(
  outer: ReturnType<Page['locator']>,
  inner: ReturnType<Page['locator']>,
) {
  const outerBox = await outer.boundingBox();
  const innerBox = await inner.boundingBox();
  expect(outerBox).not.toBeNull();
  expect(innerBox).not.toBeNull();
  if (!outerBox || !innerBox) throw new Error('Missing node bounds for containment assertion.');
  expect(innerBox.y).toBeGreaterThanOrEqual(outerBox.y - 1);
  expect(innerBox.y + innerBox.height).toBeLessThanOrEqual(outerBox.y + outerBox.height + 1);
}

async function selectEditorViewport(page: Page, viewport: 'mobile' | 'tablet') {
  const control = page.locator(`[data-builder-topbar-viewport="${viewport}"]`);
  await control.click();
  await expect(control).toHaveAttribute('aria-pressed', 'true');
}

async function expectAccordionPreviewClosed(page: Page) {
  await expect(page.locator('[data-node-id="home-services-root"]').first())
    .not.toHaveAttribute('data-builder-services-open-index', /.+/);
  await expect(page.locator('[data-node-id="home-faq-root"]').first())
    .not.toHaveAttribute('data-builder-faq-open-index', /.+/);
  await expect(page.locator('[data-node-id="home-services-card-0-detail-0"]').first()).toBeHidden();
  await expect(page.locator('[data-node-id="home-faq-item-0-answer"]').first()).toBeHidden();
}

async function expectResponsiveAccordionPreviewGeometry(
  page: Page,
  viewport: 'mobile' | 'tablet',
) {
  await selectEditorViewport(page, viewport);

  const servicesRoot = page.locator('[data-node-id="home-services-root"]').first();
  const service0 = page.locator('[data-node-id="home-services-card-0"]').first();
  const service0Title = page.locator('[data-node-id="home-services-card-0-title"]').first();
  const service0Detail = page.locator('[data-node-id="home-services-card-0-detail-0"]').first();
  const service0More = page.locator('[data-node-id="home-services-card-0-more"]').first();
  const service1 = page.locator('[data-node-id="home-services-card-1"]').first();
  const service1Title = page.locator('[data-node-id="home-services-card-1-title"]').first();
  const service1Detail = page.locator('[data-node-id="home-services-card-1-detail-0"]').first();
  const service1More = page.locator('[data-node-id="home-services-card-1-more"]').first();
  const service2 = page.locator('[data-node-id="home-services-card-2"]').first();
  const attorneyRoot = page.locator('[data-node-id="home-attorney-root"]').first();
  const faqRoot = page.locator('[data-node-id="home-faq-root"]').first();
  const officesRoot = page.locator('[data-node-id="home-offices-root"]').first();
  const contactRoot = page.locator('[data-node-id="home-contact-root"]').first();

  await service0Title.scrollIntoViewIfNeeded();
  await service0Title.click({ force: true });
  await expect(servicesRoot).toHaveAttribute('data-builder-services-open-index', '0');
  await expect(service0Detail).toBeVisible();
  await expect(service1Detail).toBeHidden();
  await expectNodeBelow(service0, service1, 4);
  await expectNodeBelow(servicesRoot, attorneyRoot, -1);
  await expectElementInside(service0, service0More);
  await expectElementInside(servicesRoot, service0More);

  await service1Title.scrollIntoViewIfNeeded();
  await service1Title.click({ force: true });
  await expect(servicesRoot).toHaveAttribute('data-builder-services-open-index', '1');
  await expect(service1Detail).toBeVisible();
  await expect(service0Detail).toBeHidden();
  await expectNodeBelow(service0, service1, -1);
  await expectNodeBelow(service1, service2, 4);
  await expectNodeBelow(servicesRoot, attorneyRoot, -1);
  await expectElementInside(service1, service1More);
  await expectElementInside(servicesRoot, service1More);

  const faq0 = page.locator('[data-node-id="home-faq-item-0"]').first();
  const faq0Question = page.locator('[data-node-id="home-faq-item-0-question-text"]').first();
  const faq0Answer = page.locator('[data-node-id="home-faq-item-0-answer"]').first();
  const faq1 = page.locator('[data-node-id="home-faq-item-1"]').first();
  const faq1Question = page.locator('[data-node-id="home-faq-item-1-question-text"]').first();
  const faq1Answer = page.locator('[data-node-id="home-faq-item-1-answer"]').first();
  const faq2 = page.locator('[data-node-id="home-faq-item-2"]').first();

  await faq0Question.scrollIntoViewIfNeeded();
  await faq0Question.click({ force: true });
  await expect(faqRoot).toHaveAttribute('data-builder-faq-open-index', '0');
  await expect(faq0Answer).toBeVisible();
  await expect(faq1Answer).toBeHidden();
  await expectElementInside(faqRoot, faq0Answer);
  await expectNodeBelow(faq0, faq1, 4);
  await expectNodeBelow(faqRoot, officesRoot, -1);
  await expectNodeBelow(officesRoot, contactRoot, -1);

  await faq1Question.scrollIntoViewIfNeeded();
  await faq1Question.click({ force: true });
  await expect(faqRoot).toHaveAttribute('data-builder-faq-open-index', '1');
  await expect(faq1Answer).toBeVisible();
  await expect(faq0Answer).toBeHidden();
  await expectElementInside(faqRoot, faq1Answer);
  await expectNodeBelow(faq0, faq1, -1);
  await expectNodeBelow(faq1, faq2, 4);
  await expectNodeBelow(faqRoot, officesRoot, -1);
  await expectNodeBelow(officesRoot, contactRoot, -1);
}

async function expectTopHitTarget(page: Page, nodeId: string) {
  const node = page.locator(`[data-node-id="${nodeId}"]`).first();
  await node.scrollIntoViewIfNeeded();
  await expect(node).toBeVisible();

  const box = await node.boundingBox();
  expect(box).not.toBeNull();
  if (!box) throw new Error(`Missing node bounds for ${nodeId}.`);

  const hitNodeId = await page.evaluate(
    ({ x, y }) => document
      .elementFromPoint(x, y)
      ?.closest('[data-node-id]')
      ?.getAttribute('data-node-id') ?? null,
    {
      x: box.x + (box.width / 2),
      y: box.y + (box.height / 2),
    },
  );

  expect(hitNodeId).toBe(nodeId);
}

async function expectNodeContainsHitTargetAt(
  page: Page,
  nodeId: string,
  xRatio: number,
  yRatio: number,
) {
  const node = page.locator(`[data-node-id="${nodeId}"]`).first();
  await node.scrollIntoViewIfNeeded();
  await expect(node).toBeVisible();

  const box = await node.boundingBox();
  expect(box).not.toBeNull();
  if (!box) throw new Error(`Missing node bounds for ${nodeId}.`);

  const hitInfo = await page.evaluate(
    ({ id, x, y }) => {
      const target = document.querySelector(`[data-node-id="${id}"]`);
      const hit = document.elementFromPoint(x, y);
      return {
        contains: Boolean(target && hit && target.contains(hit)),
        hitNodeId: hit?.closest('[data-node-id]')?.getAttribute('data-node-id') ?? null,
      };
    },
    {
      id: nodeId,
      x: box.x + (box.width * xRatio),
      y: box.y + (box.height * yRatio),
    },
  );

  expect(hitInfo).toEqual(expect.objectContaining({ contains: true }));
}

async function expectBoundaryControlsAsTopHitTargets(page: Page) {
  await expectTopHitTarget(page, 'home-hero-search-input');
  await expectNodeContainsHitTargetAt(page, 'home-hero-search-input', 0.5, 0.92);
  await expectTopHitTarget(page, 'home-hero-search-button');
  await expectNodeContainsHitTargetAt(page, 'home-hero-search-button', 0.5, 0.92);
  await expectTopHitTarget(page, 'home-insights-view-all');
  await expectNodeContainsHitTargetAt(page, 'home-insights-view-all', 0.92, 0.5);
  await expectNodeContainsHitTargetAt(page, 'home-insights-view-all', 0.5, 0.92);
}

async function expectClearanceBeforeFollowingSection(
  page: Page,
  nodeId: string,
  followingSectionId: string,
  minGap = 36,
) {
  const node = page.locator(`[data-node-id="${nodeId}"]`).first();
  await node.scrollIntoViewIfNeeded();
  await expect(node).toBeVisible();

  await expect.poll(async () => page.evaluate(
    ({ nodeId: targetId, followingSectionId: sectionId, minGap: minimumGap }) => {
      const target = document.querySelector(`[data-node-id="${targetId}"]`);
      const following = document.querySelector(`[data-node-id="${sectionId}"]`);
      if (!target || !following) return 'missing';
      const targetRect = target.getBoundingClientRect();
      const followingRect = following.getBoundingClientRect();
      const gap = followingRect.top - targetRect.bottom;
      return gap >= minimumGap ? 'ok' : `${targetId} gap ${Math.round(gap)}px`;
    },
    { nodeId, followingSectionId, minGap },
  ), { timeout: 5_000 }).toBe('ok');
}

// The hero search form intentionally straddles the hero/Insights boundary for
// public parity. The editor auto-fit scales the 1280px model into the stage,
// so the painted overflow must be measured in the stage's CSS pixels. Assert
// the search input/button really straddle the boundary (non-negative overflow
// past both the hero bottom and the insights top) without exceeding the
// intended ~24-model-px overflow plus rounding slack. Mirrors the scale-aware
// contract in admin-builder.playwright.ts.
async function expectHeroSearchStraddlesHeroInsightsBoundary(page: Page) {
  const HERO_SEARCH_MODEL_WIDTH = 1280;
  const STRADDLE_MODEL_OVERFLOW_PX = 24;

  await expect.poll(async () => page.evaluate(
    ({ modelWidth, straddleModelOverflow }) => {
      const hero = document.querySelector('[data-node-id="home-hero-root"]')?.getBoundingClientRect();
      const searchInput = document.querySelector('[data-node-id="home-hero-search-input"]')?.getBoundingClientRect();
      const searchButton = document.querySelector('[data-node-id="home-hero-search-button"]')?.getBoundingClientRect();
      const insights = document.querySelector('[data-node-id="home-insights-root"]')?.getBoundingClientRect();
      if (!hero || !searchInput || !searchButton || !insights) return 'missing';
      const scale = hero.width / modelWidth;
      const overflowCap = straddleModelOverflow * scale + 2;
      const checks: Array<[string, number]> = [
        ['input-overflows-hero-bottom', searchInput.bottom - hero.bottom],
        ['input-overflows-insights-top', searchInput.bottom - insights.top],
        ['button-overflows-hero-bottom', searchButton.bottom - hero.bottom],
        ['button-overflows-insights-top', searchButton.bottom - insights.top],
      ];
      for (const [name, overflow] of checks) {
        if (overflow < 0) return `${name} below boundary (${Math.round(overflow)}px)`;
        if (overflow > overflowCap) return `${name} exceeds cap (${Math.round(overflow)}px > ${Math.round(overflowCap)}px)`;
      }
      return 'ok';
    },
    { modelWidth: HERO_SEARCH_MODEL_WIDTH, straddleModelOverflow: STRADDLE_MODEL_OVERFLOW_PX },
  ), { timeout: 5_000 }).toBe('ok');
}

test.describe('/ko/admin-builder node click stability', () => {
  test('does not move canvas nodes when a click has only pointer jitter', async ({ page }) => {
    await openBuilder(page, `/ko/admin-builder?nodeClickStability=${Date.now().toString(36)}`);
    await page.keyboard.press('Escape');

    const node = page.locator('[data-node-id="home-services-card-1-title"]').first();
    await node.scrollIntoViewIfNeeded();
    await expect(node).toBeVisible();

    const before = await node.boundingBox();
    expect(before).not.toBeNull();
    if (!before) throw new Error('Missing node bounds before jitter click.');

    await page.mouse.move(before.x + 12, before.y + 12);
    await page.mouse.down();
    await page.mouse.move(before.x + 14, before.y + 14);
    await page.mouse.up();

    await expect(node).toBeVisible();
    const after = await node.boundingBox();
    expect(after).not.toBeNull();
    if (!after) throw new Error('Missing node bounds after jitter click.');

    expect(Math.abs(after.x - before.x)).toBeLessThan(1);
    expect(Math.abs(after.y - before.y)).toBeLessThan(1);
  });

  test('selects attorney text directly when its root is already selected', async ({ page }) => {
    await openBuilder(page, `/ko/admin-builder?attorneyTextClickStability=${Date.now().toString(36)}`);
    await page.keyboard.press('Escape');

    const root = page.locator('[data-node-id="home-attorney-root"]').first();
    const title = page.locator('[data-node-id="home-attorney-title"]').first();
    const intro = page.locator('[data-node-id="home-attorney-intro-1"]').first();
    await root.scrollIntoViewIfNeeded();
    await expect(root).toBeVisible();
    await expect(title).toBeVisible();
    await expect(intro).toBeVisible();

    const before = {
      root: await root.boundingBox(),
      title: await title.boundingBox(),
      intro: await intro.boundingBox(),
    };
    expect(before.root).not.toBeNull();
    expect(before.title).not.toBeNull();
    expect(before.intro).not.toBeNull();

    const rootPoint = await page.evaluate(() => {
      const nodeId = 'home-attorney-root';
      const node = document.querySelector(`[data-node-id="${nodeId}"]`);
      if (!node) throw new Error(`Missing canvas node: ${nodeId}`);

      const rect = node.getBoundingClientRect();
      const candidates = [
        [0.05, 0.05], [0.5, 0.05], [0.95, 0.05],
        [0.05, 0.5], [0.5, 0.5], [0.95, 0.5],
        [0.05, 0.95], [0.5, 0.95], [0.95, 0.95],
      ];
      for (const [xRatio, yRatio] of candidates) {
        const x = rect.left + (rect.width * xRatio);
        const y = rect.top + (rect.height * yRatio);
        const hitNodeId = document.elementFromPoint(x, y)
          ?.closest('[data-node-id]')
          ?.getAttribute('data-node-id');
        if (hitNodeId === nodeId) return { x, y };
      }

      throw new Error(`No unobscured hit-test point found for ${nodeId}`);
    });
    await page.mouse.click(rootPoint.x, rootPoint.y);
    await expect(root).toHaveAttribute('data-selected', 'true');

    await title.click();
    await expect(title).toHaveAttribute('data-selected', 'true');
    await expect(root).not.toHaveAttribute('data-selected', 'true');
    await expect(intro).not.toHaveAttribute('data-selected', 'true');

    const titleTextBeforeEdit = await title.textContent();
    await title.dblclick();
    const inlineEditors = page.locator('[data-builder-inline-text-editor="true"]:visible');
    await expect(inlineEditors).toHaveCount(1);
    const titleEditor = title.locator('[data-builder-inline-text-editor="true"]');
    await expect(titleEditor).toBeVisible();
    expect(await titleEditor.evaluate((editor) => editor.closest('[data-node-id]')?.getAttribute('data-node-id')))
      .toBe('home-attorney-title');

    await page.keyboard.press('Escape');
    await expect(titleEditor).toBeHidden();
    await expect(title).toHaveAttribute('data-selected', 'true');
    await expect(root).not.toHaveAttribute('data-selected', 'true');
    await expect(intro).not.toHaveAttribute('data-selected', 'true');
    await expect(title).toHaveText(titleTextBeforeEdit ?? '');

    await intro.click();
    await expect(intro).toHaveAttribute('data-selected', 'true');
    await expect(title).not.toHaveAttribute('data-selected', 'true');
    await expect(root).not.toHaveAttribute('data-selected', 'true');

    for (const [name, locator] of [['root', root], ['title', title], ['intro', intro]] as const) {
      const after = await locator.boundingBox();
      expect(after, `Missing ${name} bounds after direct text clicks.`).not.toBeNull();
      const initial = before[name];
      if (!after || !initial) continue;
      expect(Math.abs(after.x - initial.x)).toBeLessThan(1);
      expect(Math.abs(after.y - initial.y)).toBeLessThan(1);
      expect(Math.abs(after.width - initial.width)).toBeLessThan(1);
      expect(Math.abs(after.height - initial.height)).toBeLessThan(1);
    }
  });

  test('keeps archive and image clicks inside the editor instead of blanking the canvas', async ({ page }) => {
    await openBuilder(page, `/ko/admin-builder?nodeSurfaceStability=${Date.now().toString(36)}`);
    await page.keyboard.press('Escape');

    const archive = page.locator('[data-node-id="home-insights-list-wrap"]').first();
    await archive.scrollIntoViewIfNeeded();
    await archive.click({ position: { x: 20, y: 20 }, force: true });
    await expectEditorSurfaceIntact(page);
    await expect(archive).toBeVisible();
    await expect(page.locator('[data-node-id="home-insights-title"]').first()).toBeVisible();

    const featuredLinkNode = page.locator('[data-node-id="home-insights-featured-link"]').first();
    await expect(featuredLinkNode).toBeVisible();
    await expect(
      featuredLinkNode.locator('button[data-tone="link"]'),
    ).toHaveAttribute('title', /\/columns\//);
    await featuredLinkNode.locator('a').first().click({ force: true });
    await expectEditorSurfaceIntact(page);
    await expect(archive).toBeVisible();

    const image = page.locator('[data-node-id="home-hero-media-image"]').first();
    await image.scrollIntoViewIfNeeded();
    const assetDialog = page.getByRole('dialog', { name: /Asset library|자산 라이브러리/ });
    await image.click({ position: { x: 80, y: 20 } });
    await expectEditorSurfaceIntact(page);
    await expect(image).toHaveAttribute('data-selected', 'true');
    if (!(await assetDialog.isVisible().catch(() => false))) {
      await image.click({ position: { x: 80, y: 20 } });
    }
    await expect(assetDialog).toBeVisible();
    await expect(assetDialog).toContainText(/Select, upload, or remove builder images|빌더 이미지를 선택, 업로드, 삭제하세요/);
    await assetDialog.getByRole('button', { name: /^Close$|^닫기$/ }).click();
    await expect(assetDialog).toBeHidden();
    await expectEditorSurfaceIntact(page);
  });

  test('keeps the active FAQ answer visible while switching selected nodes', async ({ page }) => {
    await openBuilder(page, `/ko/admin-builder?faqClickStability=${Date.now().toString(36)}`);
    await page.keyboard.press('Escape');

    const firstAnswer = page.locator('[data-node-id="home-faq-item-0-answer"]').first();
    const firstItem = page.locator('[data-node-id="home-faq-item-0"]').first();
    const firstQuestion = page.locator('[data-node-id="home-faq-item-0-question-text"]').first();
    const secondQuestion = page.locator('[data-node-id="home-faq-item-1-question-text"]').first();
    const secondAnswer = page.locator('[data-node-id="home-faq-item-1-answer"]').first();
    const secondItem = page.locator('[data-node-id="home-faq-item-1"]').first();
    const faqRoot = page.locator('[data-node-id="home-faq-root"]').first();
    const officesRoot = page.locator('[data-node-id="home-offices-root"]').first();
    const heroTitle = page.locator('[data-node-id="home-hero-title"]').first();

    await firstQuestion.scrollIntoViewIfNeeded();
    await firstQuestion.click({ position: { x: 12, y: 12 }, force: true });
    await expect(firstAnswer).toBeVisible();
    await expect(secondAnswer).toBeHidden();

    await secondQuestion.click({ position: { x: 12, y: 12 }, force: true });
    await expect(secondAnswer).toBeVisible();
    await expect(firstAnswer).toBeHidden();
    await expectNodeBelow(firstItem, secondItem, 4);
    await expectNodeBelow(faqRoot, officesRoot, -1);

    await heroTitle.click({ position: { x: 12, y: 12 }, force: true });
    await expect(secondAnswer).toBeVisible();
    await expect(firstAnswer).toBeHidden();
    await expectNodeBelow(firstItem, secondItem, 4);
    await expectNodeBelow(faqRoot, officesRoot, -1);
  });

  test('pushes revealed service cards downward instead of overlapping text', async ({ page }) => {
    await openBuilder(page, `/ko/admin-builder?serviceClickStack=${Date.now().toString(36)}`);
    await page.keyboard.press('Escape');

    const firstCard = page.locator('[data-node-id="home-services-card-0"]').first();
    const firstTitle = page.locator('[data-node-id="home-services-card-0-title"]').first();
    const firstDetail = page.locator('[data-node-id="home-services-card-0-detail-0"]').first();
    const secondCard = page.locator('[data-node-id="home-services-card-1"]').first();
    const secondTitle = page.locator('[data-node-id="home-services-card-1-title"]').first();
    const secondDetail = page.locator('[data-node-id="home-services-card-1-detail-0"]').first();
    const servicesRoot = page.locator('[data-node-id="home-services-root"]').first();
    const attorneyRoot = page.locator('[data-node-id="home-attorney-root"]').first();

    await firstTitle.scrollIntoViewIfNeeded();
    await firstTitle.click({ position: { x: 12, y: 12 }, force: true });
    await expect(firstDetail).toBeVisible();
    await expect(secondDetail).toBeHidden();
    await expectNodeBelow(servicesRoot, attorneyRoot, -1);

    await secondTitle.click({ position: { x: 12, y: 12 }, force: true });
    await expect(secondDetail).toBeVisible();
    await expect(firstDetail).toBeHidden();
    await expectNodeBelow(firstCard, secondCard, 8);
    await expectNodeBelow(servicesRoot, attorneyRoot, -1);
  });

  test('keeps section-boundary controls as top hit targets', async ({ page }) => {
    const path = `/ko/admin-builder?boundaryHitTargets=${Date.now().toString(36)}`;
    await openBuilder(page, path);
    await page.keyboard.press('Escape');
    await expectBoundaryControlsAsTopHitTargets(page);
    await expectHeroSearchStraddlesHeroInsightsBoundary(page);
    await expectClearanceBeforeFollowingSection(page, 'home-insights-view-all', 'home-services-root', 72);

    await openBuilder(page, path);
    await page.keyboard.press('Escape');
    await expectBoundaryControlsAsTopHitTargets(page);
    await expectHeroSearchStraddlesHeroInsightsBoundary(page);
    await expectClearanceBeforeFollowingSection(page, 'home-insights-view-all', 'home-services-root', 72);
  });

  test('keeps hero search dropdown and insights CTA chrome above following sections', async ({ page }) => {
    await openBuilder(page, `/ko/admin-builder?boundaryChromeHitTargets=${Date.now().toString(36)}`);
    await page.keyboard.press('Escape');

    const searchWrap = page.locator('[data-node-id="home-hero-search-wrap"]').first();
    await searchWrap.scrollIntoViewIfNeeded();
    await searchWrap.click({ position: { x: 24, y: 24 }, force: true });
    await searchWrap.hover({ position: { x: 24, y: 24 }, force: true });
    await expect(page.locator('[data-node-id="home-hero-quick-menu"]').first()).toBeVisible();

    await expectNodeContainsHitTargetAt(page, 'home-hero-search-wrap', 0.5, 0.92);
    await expectNodeContainsHitTargetAt(page, 'home-hero-quick-menu', 0.5, 0.92);
    await expectNodeContainsHitTargetAt(page, 'home-hero-quick-menu-item-2', 0.92, 0.5);

    const viewAll = page.locator('[data-node-id="home-insights-view-all"]').first();
    await viewAll.click({ position: { x: 12, y: 12 }, force: true });
    await expect(viewAll).toHaveAttribute('data-selected', 'true');
    await expectNodeContainsHitTargetAt(page, 'home-insights-view-all', 0.92, 0.5);
    await expectNodeContainsHitTargetAt(page, 'home-insights-view-all', 0.5, 1);
  });

  test('keeps mobile and tablet section-boundary controls as top hit targets', async ({ page }) => {
    await openBuilder(page, `/ko/admin-builder?responsiveBoundaryHitTargets=${Date.now().toString(36)}`);
    await page.keyboard.press('Escape');

    await selectEditorViewport(page, 'mobile');
    await expectBoundaryControlsAsTopHitTargets(page);

    await selectEditorViewport(page, 'tablet');
    await expectBoundaryControlsAsTopHitTargets(page);
  });

  test('keeps mobile and tablet service and FAQ previews inside their sections', async ({ page }) => {
    const token = Date.now().toString(36);
    const path = `/ko/admin-builder?responsiveAccordionStack=${token}`;
    await openBuilder(page, path);
    await page.keyboard.press('Escape');
    await expectResponsiveAccordionPreviewGeometry(page, 'mobile');

    await openBuilder(page, `${path}&afterMobileReload=1`);
    await page.keyboard.press('Escape');
    await selectEditorViewport(page, 'mobile');
    await expectAccordionPreviewClosed(page);

    await openBuilder(page, `${path}&tablet=1`);
    await page.keyboard.press('Escape');
    await expectResponsiveAccordionPreviewGeometry(page, 'tablet');

    await openBuilder(page, `${path}&afterTabletReload=1`);
    await page.keyboard.press('Escape');
    await selectEditorViewport(page, 'tablet');
    await expectAccordionPreviewClosed(page);
  });

  test('persists upgraded section-boundary geometry before reload', async ({ page }) => {
    test.setTimeout(90_000);

    const token = Date.now().toString(36);
    const slug = `g-editor-boundary-persist-${token}`;
    let pageId: string | null = null;

    try {
      pageId = await createBuilderPage(page, slug, makeStaleBoundaryDocument(token));
      const path = `/ko/admin-builder?pageId=${encodeURIComponent(pageId)}&boundaryPersist=${token}`;

      await openBuilder(page, path);
      await page.keyboard.press('Escape');
      await expectBoundaryControlsAsTopHitTargets(page);

      const expectedSeed = createHomePageCanvasDocumentDecomposed('ko');
      const expected = [
        INSIGHTS_SECTION_ROOT_HEIGHT,
        SERVICES_SECTION_ROOT_HEIGHT,
        findNode(expectedSeed, 'home-faq-root').rect.height,
        findNode(expectedSeed, 'home-faq-list').rect.height,
        true,
        true,
        true,
      ].join('|');

      await expect.poll(async () => {
        const document = await fetchDraftDocument(page, pageId!, slug);
        return [
          findNode(document, 'home-insights-root').rect.height,
          findNode(document, 'home-services-root').rect.height,
          findNode(document, 'home-faq-root').rect.height,
          findNode(document, 'home-faq-list').rect.height,
          document.updatedBy.includes('+insights-source'),
          document.updatedBy.includes('+services-parity'),
          document.updatedBy.includes('+faq-parity'),
        ].join('|');
      }, { timeout: 30_000 }).toBe(expected);

      await openBuilder(page, `${path}&afterPersist=1`);
      await page.keyboard.press('Escape');
      await expectBoundaryControlsAsTopHitTargets(page);
    } finally {
      if (pageId) {
        await page.request.delete(`/api/builder/site/pages/${pageId}?locale=ko`, {
          headers: mutationHeaders(slug),
          failOnStatusCode: false,
        });
      }
    }
  });
});

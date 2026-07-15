import { createHash } from 'node:crypto';
import { expect, test, type CDPSession, type Locator, type Page } from '@playwright/test';
import { openBuilder } from './helpers/editor';

type PointerPosition = { x: number; y: number };
type ActiveTouch = PointerPosition & { id: number };
type DraftFingerprint = { revision: number; checksum: string };

function centerOf(box: NonNullable<Awaited<ReturnType<Locator['boundingBox']>>>): PointerPosition {
  return { x: box.x + box.width / 2, y: box.y + box.height / 2 };
}

function quarterTurnAround(origin: PointerPosition, point: PointerPosition): PointerPosition {
  const deltaX = point.x - origin.x;
  const deltaY = point.y - origin.y;
  return { x: origin.x - deltaY, y: origin.y + deltaX };
}

async function dispatchTouchPath(
  client: CDPSession,
  touchId: number,
  start: PointerPosition,
  end: PointerPosition,
): Promise<void> {
  await client.send('Input.dispatchTouchEvent', {
    type: 'touchStart',
    touchPoints: [{ ...start, id: touchId }],
  });
  for (let step = 1; step <= 8; step += 1) {
    await client.send('Input.dispatchTouchEvent', {
      type: 'touchMove',
      touchPoints: [{
        id: touchId,
        x: start.x + ((end.x - start.x) * step) / 8,
        y: start.y + ((end.y - start.y) * step) / 8,
      }],
    });
  }
}

async function releaseTouch(client: CDPSession): Promise<void> {
  await client.send('Input.dispatchTouchEvent', {
    type: 'touchEnd',
    touchPoints: [],
  });
}

async function sendTouchState(
  client: CDPSession,
  type: 'touchStart' | 'touchMove',
  touches: readonly ActiveTouch[],
): Promise<void> {
  await client.send('Input.dispatchTouchEvent', {
    type,
    touchPoints: touches.map((touch) => ({
      id: touch.id,
      x: touch.x,
      y: touch.y,
    })),
  });
}

async function cancelTouchSequence(client: CDPSession): Promise<void> {
  await client.send('Input.dispatchTouchEvent', {
    type: 'touchCancel',
    touchPoints: [],
  });
}

async function moveTouch(
  client: CDPSession,
  touch: ActiveTouch,
  target: PointerPosition,
): Promise<ActiveTouch> {
  const moved = { ...target, id: touch.id };
  for (let step = 1; step <= 8; step += 1) {
    await sendTouchState(client, 'touchMove', [{
      id: touch.id,
      x: touch.x + ((target.x - touch.x) * step) / 8,
      y: touch.y + ((target.y - touch.y) * step) / 8,
    }]);
  }
  return moved;
}

const HIT_TEST_REGION_FRACTIONS: ReadonlyArray<readonly [number, number]> = [
  [0.5, 0.5],
  [0.5, 1.0], [1.0, 0.5], [0.5, 0.0], [0.0, 0.5],
  [0.5, 0.75], [0.75, 0.5], [0.5, 0.25], [0.25, 0.5],
  [0.5, 0.9], [0.9, 0.5], [0.5, 0.1], [0.1, 0.5],
  [0.75, 0.75], [0.25, 0.25], [0.75, 0.25], [0.25, 0.75],
  [0.9, 0.9], [0.1, 0.1], [0.9, 0.1], [0.1, 0.9],
  [1.0, 1.0], [0.0, 0.0], [1.0, 0.0], [0.0, 1.0],
];

async function hitTestedPoint(
  page: Page,
  target: Locator,
  travel: PointerPosition = { x: 0, y: 0 },
): Promise<PointerPosition> {
  const box = await target.boundingBox();
  if (!box) throw new Error('canvas_lifecycle_hit_target_bounds_missing');
  const viewport = page.viewportSize();
  if (!viewport) throw new Error('canvas_lifecycle_viewport_missing');
  const visibleLeft = Math.max(0, box.x);
  const visibleTop = Math.max(0, box.y);
  const visibleRight = Math.min(viewport.width, box.x + box.width);
  const visibleBottom = Math.min(viewport.height, box.y + box.height);
  if (visibleRight <= visibleLeft || visibleBottom <= visibleTop) {
    throw new Error('canvas_lifecycle_hit_target_offscreen');
  }
  const horizontalInset = Math.min(24, Math.max(1, (visibleRight - visibleLeft) / 4));
  const verticalInset = Math.min(24, Math.max(1, (visibleBottom - visibleTop) / 4));
  const minX = visibleLeft + horizontalInset + Math.max(0, -travel.x);
  const maxX = visibleRight - horizontalInset - Math.max(0, travel.x);
  const minY = visibleTop + verticalInset + Math.max(0, -travel.y);
  const maxY = visibleBottom - verticalInset - Math.max(0, travel.y);
  const regionMinX = minX <= maxX ? minX : visibleLeft;
  const regionMaxX = minX <= maxX ? maxX : visibleRight;
  const regionMinY = minY <= maxY ? minY : visibleTop;
  const regionMaxY = minY <= maxY ? maxY : visibleBottom;
  for (const [xFrac, yFrac] of HIT_TEST_REGION_FRACTIONS) {
    const candidate = {
      x: regionMinX + (regionMaxX - regionMinX) * xFrac,
      y: regionMinY + (regionMaxY - regionMinY) * yFrac,
    };
    const belongs = await target.evaluate((element, point) => {
      const hit = document.elementFromPoint(point.x, point.y);
      if (!hit) return false;
      if (hit !== element && !element.contains(hit)) return false;
      return !hit.closest('[data-builder-floating-ui="true"]');
    }, candidate);
    if (belongs) return candidate;
  }
  throw new Error('canvas_lifecycle_hit_target_no_safe_point');
}

async function selectNodeAtHitPoint(page: Page, target: Locator): Promise<PointerPosition> {
  await target.scrollIntoViewIfNeeded();
  const point = await hitTestedPoint(page, target);
  await page.mouse.click(point.x, point.y);
  return point;
}

async function shiftAddNodeAtHitPoint(page: Page, target: Locator): Promise<PointerPosition> {
  await target.scrollIntoViewIfNeeded();
  const point = await hitTestedPoint(page, target);
  await page.keyboard.down('Shift');
  try {
    await page.mouse.click(point.x, point.y);
  } finally {
    await page.keyboard.up('Shift');
  }
  return point;
}

async function nonInteractiveTopBarPoint(page: Page): Promise<PointerPosition> {
  const topBar = page.locator('[data-editor-shell] > header').first();
  await expect(topBar).toBeVisible();
  const box = await topBar.boundingBox();
  if (!box) throw new Error('canvas_lifecycle_topbar_bounds_missing');
  const candidates = [0.5, 0.25, 0.75, 0.1, 0.9].flatMap((xRatio) => [
    { x: box.x + box.width * xRatio, y: box.y + 2 },
    { x: box.x + box.width * xRatio, y: box.y + box.height - 2 },
  ]);
  for (const point of candidates) {
    const safe = await topBar.evaluate((element, candidate) => {
      const hit = document.elementFromPoint(candidate.x, candidate.y);
      return Boolean(
        hit
        && element.contains(hit)
        && !hit.closest('button, a, input, select, textarea, [role="button"], [role="application"]'),
      );
    }, point);
    if (safe) return point;
  }
  throw new Error('canvas_lifecycle_noninteractive_topbar_point_missing');
}

async function selectedNodeIds(page: Page): Promise<string[]> {
  return page.locator('[data-node-id][data-selected="true"]').evaluateAll((elements) => elements
    .map((element) => element.getAttribute('data-node-id') ?? '')
    .filter(Boolean)
    .sort());
}

async function readHomeDraftFingerprint(page: Page): Promise<DraftFingerprint> {
  const pagesResponse = await page.request.get('/api/builder/site/pages?locale=ko', {
    failOnStatusCode: false,
  });
  expect(pagesResponse.status()).toBe(200);
  const pagesPayload = (await pagesResponse.json()) as {
    pages?: Array<{ pageId?: string; isHomePage?: boolean; slug?: string }>;
  };
  const requestedPageId = new URL(page.url()).searchParams.get('pageId');
  const pageId = requestedPageId
    ?? pagesPayload.pages?.find((entry) => entry.isHomePage || entry.slug === '')?.pageId
    ?? null;
  if (!pageId) throw new Error('canvas_lifecycle_page_id_missing');
  const draftResponse = await page.request.get(
    `/api/builder/site/pages/${encodeURIComponent(pageId)}/draft?locale=ko`,
    { failOnStatusCode: false },
  );
  expect(draftResponse.status()).toBe(200);
  const draftPayload = (await draftResponse.json()) as {
    draft?: { revision?: number };
    document?: unknown;
  };
  if (typeof draftPayload.draft?.revision !== 'number' || draftPayload.document === undefined) {
    throw new Error('canvas_lifecycle_draft_fingerprint_missing');
  }
  return {
    revision: draftPayload.draft.revision,
    checksum: createHash('sha256').update(JSON.stringify(draftPayload.document)).digest('hex'),
  };
}

async function expectSameBox(
  locator: Locator,
  expected: NonNullable<Awaited<ReturnType<Locator['boundingBox']>>>,
): Promise<void> {
  await expect.poll(async () => {
    const actual = await locator.boundingBox();
    if (!actual) return null;
    return {
      x: Math.round(actual.x),
      y: Math.round(actual.y),
      width: Math.round(actual.width),
      height: Math.round(actual.height),
    };
  }).toEqual({
    x: Math.round(expected.x),
    y: Math.round(expected.y),
    width: Math.round(expected.width),
    height: Math.round(expected.height),
  });
}

test.describe('canvas interaction lifecycle', () => {
  test('pointercancel rolls back move, resize, and pan while ignoring non-owner pointers', async ({ page }) => {
    test.setTimeout(90_000);
    await openBuilder(page);

    const stage = page.getByRole('application', { name: 'Canvas editor' });
    const node = page.locator('[data-node-id="home-hero-title"]').first();
    await expect(node).toBeVisible();
    await node.scrollIntoViewIfNeeded();
    await selectNodeAtHitPoint(page, node);
    await expect(node).toHaveAttribute('data-selected', 'true');
    const selectionIdentity = await selectedNodeIds(page);
    expect(selectionIdentity).toEqual(['home-hero-title']);
    const initialDraft = await readHomeDraftFingerprint(page);
    const initialBox = await node.boundingBox();
    if (!initialBox) throw new Error('canvas_lifecycle_node_bounds_missing');

    const client = await page.context().newCDPSession(page);
    let touchSequenceActive = false;
    let spaceIsDown = false;
    try {
      const moveDelta = { x: 64, y: 38 };
      const moveOrigin = await hitTestedPoint(page, node, moveDelta);
      let moveTouchPoint: ActiveTouch = { ...moveOrigin, id: 8101 };
      touchSequenceActive = true;
      await sendTouchState(client, 'touchStart', [moveTouchPoint]);
      await expect(stage).toHaveAttribute('data-canvas-interaction', 'move');
      moveTouchPoint = await moveTouch(client, moveTouchPoint, {
        x: moveOrigin.x + moveDelta.x,
        y: moveOrigin.y + moveDelta.y,
      });
      await expect(node).toHaveAttribute('data-builder-direct-move-preview', 'true');
      await expect.poll(async () => {
        const previewBox = await node.boundingBox();
        if (!previewBox) return 0;
        return Math.max(
          Math.abs(previewBox.x - initialBox.x),
          Math.abs(previewBox.y - initialBox.y),
        );
      }).toBeGreaterThan(10);
      const ownerMovePreviewBox = await node.boundingBox();
      if (!ownerMovePreviewBox) throw new Error('canvas_lifecycle_move_preview_bounds_missing');

      const intruderPoint: ActiveTouch = { ...(await nonInteractiveTopBarPoint(page)), id: 8102 };
      await sendTouchState(client, 'touchStart', [moveTouchPoint, intruderPoint]);
      await expect(stage).toHaveAttribute('data-canvas-interaction', 'move');
      await sendTouchState(client, 'touchMove', [
        moveTouchPoint,
        { ...intruderPoint, x: intruderPoint.x + 12 },
      ]);
      await expect(stage).toHaveAttribute('data-canvas-interaction', 'move');
      await expectSameBox(node, ownerMovePreviewBox);
      await expect.poll(() => selectedNodeIds(page)).toEqual(selectionIdentity);

      await cancelTouchSequence(client);
      touchSequenceActive = false;
      await expect(stage).toHaveAttribute('data-canvas-interaction', 'idle');
      await expect(node).not.toHaveAttribute('data-builder-direct-move-preview', 'true');
      await expectSameBox(node, initialBox);
      await expect.poll(() => selectedNodeIds(page)).toEqual(selectionIdentity);

      const resizeHandle = node.getByRole('button', { name: /Resize .* node se$/ }).first();
      await expect(resizeHandle).toBeVisible();
      const resizeDelta = { x: 72, y: 44 };
      const resizeOrigin = await hitTestedPoint(page, resizeHandle, resizeDelta);
      const resizeTouchPoint: ActiveTouch = { ...resizeOrigin, id: 8201 };
      touchSequenceActive = true;
      await sendTouchState(client, 'touchStart', [resizeTouchPoint]);
      await expect(stage).toHaveAttribute('data-canvas-interaction', 'resize');
      await moveTouch(client, resizeTouchPoint, {
        x: resizeOrigin.x + resizeDelta.x,
        y: resizeOrigin.y + resizeDelta.y,
      });
      await expect(node).toHaveAttribute('data-builder-direct-resize-preview', 'true');
      await expect.poll(async () => {
        const previewBox = await node.boundingBox();
        if (!previewBox) return 0;
        return Math.max(
          Math.abs(previewBox.width - initialBox.width),
          Math.abs(previewBox.height - initialBox.height),
        );
      }).toBeGreaterThan(10);
      await cancelTouchSequence(client);
      touchSequenceActive = false;
      await expect(stage).toHaveAttribute('data-canvas-interaction', 'idle');
      await expect(node).not.toHaveAttribute('data-builder-direct-resize-preview', 'true');
      await expectSameBox(node, initialBox);
      await expect.poll(() => selectedNodeIds(page)).toEqual(selectionIdentity);

      const stageTransform = stage.locator('xpath=..');
      const initialTransform = await stageTransform.evaluate((element) => (element as HTMLElement).style.transform);
      const panDelta = { x: 80, y: 55 };
      const panOrigin = await hitTestedPoint(page, stage, panDelta);
      const panTouchPoint: ActiveTouch = { ...panOrigin, id: 8301 };
      await page.keyboard.down('Space');
      spaceIsDown = true;
      await expect(stage.locator('xpath=../..')).toHaveClass(/stageViewportPannable/);
      touchSequenceActive = true;
      await sendTouchState(client, 'touchStart', [panTouchPoint]);
      await expect(stage).toHaveAttribute('data-canvas-interaction', 'pan');
      await moveTouch(client, panTouchPoint, {
        x: panOrigin.x + panDelta.x,
        y: panOrigin.y + panDelta.y,
      });
      await expect.poll(
        () => stageTransform.evaluate((element) => (element as HTMLElement).style.transform),
      ).not.toBe(initialTransform);
      await cancelTouchSequence(client);
      touchSequenceActive = false;
      await expect(stage).toHaveAttribute('data-canvas-interaction', 'idle');
      await expect.poll(
        () => stageTransform.evaluate((element) => (element as HTMLElement).style.transform),
      ).toBe(initialTransform);
      await page.keyboard.up('Space');
      spaceIsDown = false;
      await expect.poll(() => selectedNodeIds(page)).toEqual(selectionIdentity);

      const finalDraft = await readHomeDraftFingerprint(page);
      expect(finalDraft).toEqual(initialDraft);
    } finally {
      if (touchSequenceActive) await cancelTouchSequence(client).catch(() => undefined);
      if (spaceIsDown) await page.keyboard.up('Space').catch(() => undefined);
      await client.detach().catch(() => undefined);
    }
  });

  test('rotation takeover uses the reverted base and owner capture loss rolls back', async ({ page }) => {
    test.setTimeout(90_000);
    await openBuilder(page);

    const nodeA = page.locator('[data-node-id="home-hero-subtitle"]').first();
    const nodeB = page.locator('[data-node-id="home-hero-search-button"]').first();
    await expect(nodeA).toBeVisible();
    await expect(nodeB).toBeVisible();
    await nodeA.scrollIntoViewIfNeeded();
    await selectNodeAtHitPoint(page, nodeA);
    await shiftAddNodeAtHitPoint(page, nodeB);
    await expect(nodeA).toHaveAttribute('data-selected', 'true');
    await expect(nodeB).toHaveAttribute('data-selected', 'true');
    const rotationHandleA = nodeA.getByRole('button', { name: /Rotate .* node/ }).first();
    const rotationHandleB = nodeB.getByRole('button', { name: /Rotate .* node/ }).first();
    await expect(rotationHandleA).toBeVisible();
    await expect(rotationHandleB).toBeVisible();
    const initialTransformA = await nodeA.evaluate((element) => getComputedStyle(element).transform);
    const initialTransformB = await nodeB.evaluate((element) => getComputedStyle(element).transform);
    const initialNodeBoxA = await nodeA.boundingBox();
    if (!initialNodeBoxA) throw new Error('rotation_lifecycle_initial_bounds_missing');

    const client = await page.context().newCDPSession(page);
    const pointerAStart = await hitTestedPoint(page, rotationHandleA);
    const pointerATarget = quarterTurnAround(centerOf(initialNodeBoxA), pointerAStart);
    let mouseIsDown = false;
    let touchIsDown = false;
    try {
      touchIsDown = true;
      await dispatchTouchPath(client, 8401, pointerAStart, pointerATarget);
      await expect.poll(() => nodeA.evaluate((element) => getComputedStyle(element).transform)).not.toBe(initialTransformA);

      const pointerBStart = await hitTestedPoint(page, rotationHandleB);
      await page.mouse.move(pointerBStart.x, pointerBStart.y);
      await rotationHandleB.evaluate((element) => {
        const host = window as Window & {
          __tsengRotationProbeB?: {
            pointerId: number | null;
            cleanup: () => void;
          } | null;
        };
        host.__tsengRotationProbeB?.cleanup();
        const listener = (event: Event) => {
          const probe = host.__tsengRotationProbeB;
          if (probe) probe.pointerId = (event as PointerEvent).pointerId;
        };
        element.addEventListener('pointerdown', listener, { once: true });
        host.__tsengRotationProbeB = {
          pointerId: null,
          cleanup: () => {
            element.removeEventListener('pointerdown', listener);
          },
        };
      });
      await page.mouse.down();
      mouseIsDown = true;
      const recordedPointerBId = await page.evaluate(
        (): number | null =>
          (window as Window & { __tsengRotationProbeB?: { pointerId: number | null } | null }).__tsengRotationProbeB
            ?.pointerId ?? null,
      );
      if (typeof recordedPointerBId !== 'number') {
        throw new Error('rotation_lifecycle_pointer_b_id_not_captured');
      }
      const pointerBId: number = recordedPointerBId;

      await expect.poll(() => nodeA.evaluate((element) => getComputedStyle(element).transform)).toBe(initialTransformA);
      await expect.poll(() => nodeB.evaluate((element) => getComputedStyle(element).transform)).toBe(initialTransformB);
      await releaseTouch(client);
      touchIsDown = false;

      await page.mouse.move(pointerBStart.x, pointerBStart.y);
      await expect.poll(() => nodeA.evaluate((element) => getComputedStyle(element).transform)).toBe(initialTransformA);
      await expect.poll(() => nodeB.evaluate((element) => getComputedStyle(element).transform)).toBe(initialTransformB);

      const revertedNodeBoxB = await nodeB.boundingBox();
      if (!revertedNodeBoxB) throw new Error('rotation_lifecycle_reverted_node_b_bounds_missing');
      const pointerBTarget = quarterTurnAround(centerOf(revertedNodeBoxB), pointerBStart);
      await page.mouse.move(pointerBTarget.x, pointerBTarget.y, { steps: 8 });
      await expect.poll(() => nodeB.evaluate((element) => getComputedStyle(element).transform)).not.toBe(initialTransformB);
      await expect.poll(() => nodeB.evaluate((element, pointerId) => element.hasPointerCapture(pointerId), pointerBId)).toBe(true);

      await nodeB.evaluate((element, pointerId) => element.releasePointerCapture(pointerId), pointerBId);
      await page.mouse.move(pointerBStart.x, pointerBStart.y);
      await expect.poll(() => nodeB.evaluate((element) => getComputedStyle(element).transform)).toBe(initialTransformB);
      await page.mouse.up();
      mouseIsDown = false;
      await expect.poll(() => nodeA.evaluate((element) => getComputedStyle(element).transform)).toBe(initialTransformA);
      await expect.poll(() => nodeB.evaluate((element) => getComputedStyle(element).transform)).toBe(initialTransformB);
    } finally {
      if (touchIsDown) await releaseTouch(client).catch(() => undefined);
      if (mouseIsDown) await page.mouse.up().catch(() => undefined);
      await page
        .evaluate(() => {
          const host = window as Window & { __tsengRotationProbeB?: { cleanup: () => void } | null };
          host.__tsengRotationProbeB?.cleanup();
          delete host.__tsengRotationProbeB;
        })
        .catch(() => undefined);
      await client.detach().catch(() => undefined);
    }
  });
});

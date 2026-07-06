// CLAUDE-DEBUG probe (temporary — remove after alignment-guide root-cause).
// Replicates admin-builder.playwright.ts:1015-1050 snap drag and dumps state.
import { test, expect, type Page, type Locator } from '@playwright/test';
import { openBuilder } from './helpers/editor';

test.use({ viewport: { width: 2200, height: 1000 } });

async function startPointerDrag(
  page: Page,
  locator: Locator,
  options: { pointerId?: number } = {},
) {
  const box = await locator.boundingBox();
  if (!box) throw new Error('no box');
  const x = box.x + box.width / 2;
  const y = box.y + box.height / 2;
  const pointerId = options.pointerId ?? 7003;
  await locator.evaluate((element, init) => {
    element.dispatchEvent(new PointerEvent('pointerdown', {
      bubbles: true, cancelable: true, composed: true, isPrimary: true,
      pointerType: 'mouse', button: 0, buttons: 1, ...init,
    }));
  }, { pointerId, clientX: x, clientY: y });
  return { pointerId, x, y };
}

async function movePointerDrag(
  page: Page,
  drag: { pointerId: number; x: number; y: number },
  deltaX: number,
  deltaY: number,
) {
  await page.evaluate((init) => {
    window.dispatchEvent(new PointerEvent('pointermove', {
      bubbles: true, cancelable: true, composed: true, isPrimary: true,
      pointerType: 'mouse', button: 0, buttons: 1,
      pointerId: init.pointerId,
      clientX: init.x + init.deltaX,
      clientY: init.y + init.deltaY,
    }));
  }, { ...drag, deltaX, deltaY });
}

test('probe: snap drag guide state dump', async ({ page }) => {
  await openBuilder(page, '/ko/admin-builder');
  const snapTarget = page.locator('[data-node-id="home-hero-subtitle"]:visible').first();
  await expect(snapTarget).toBeVisible();
  await expect(async () => {
    await page.keyboard.press('Escape');
    await snapTarget.click({ position: { x: 18, y: 18 }, force: true });
    const selectedItself = await snapTarget.evaluate(
      (element) => String(element.className).includes('nodeSelected'),
    );
    expect(selectedItself).toBe(true);
  }).toPass({ timeout: 30_000 });

  const geom = await page.evaluate(() => {
    const moving = document.querySelector('[data-node-id="home-hero-subtitle"]')?.getBoundingClientRect();
    const reference = document.querySelector('[data-node-id="home-hero-title"]')?.getBoundingClientRect();
    // canvas scale: find the stage transform
    const stage = document.querySelector('[data-builder-canvas-scroll-root]') as HTMLElement | null;
    let scale = 'n/a';
    let el: HTMLElement | null = document.querySelector('[data-node-id="home-hero-subtitle"]');
    const transforms: string[] = [];
    while (el && transforms.length < 12) {
      const t = getComputedStyle(el).transform;
      if (t && t !== 'none') transforms.push(`${el.tagName}.${String(el.className).slice(0, 30)}:${t}`);
      el = el.parentElement;
    }
    return {
      movingRight: moving?.right, refRight: reference?.right,
      movingRect: moving ? { x: moving.x, y: moving.y, w: moving.width, h: moving.height } : null,
      scrollRoot: Boolean(stage), transforms, scale,
    };
  });
  console.log('[probe] geometry:', JSON.stringify(geom));
  const snapDeltaX = (geom.refRight ?? 0) - (geom.movingRight ?? 0);
  console.log('[probe] snapDeltaX:', snapDeltaX);

  const drag = await startPointerDrag(page, snapTarget, { pointerId: 7003 });
  await movePointerDrag(page, drag, snapDeltaX, 0);
  await page.waitForTimeout(500);
  const during = await page.evaluate(() => {
    const lines = Array.from(document.querySelectorAll('[data-alignment-guide-line]'));
    const chips = Array.from(document.querySelectorAll('[data-alignment-guide-chip]'));
    const interactionEl = document.querySelector('[data-canvas-interaction]');
    const moving = document.querySelector('[data-node-id="home-hero-subtitle"]')?.getBoundingClientRect();
    const reference = document.querySelector('[data-node-id="home-hero-title"]')?.getBoundingClientRect();
    return {
      interaction: interactionEl?.getAttribute('data-canvas-interaction'),
      lineCount: lines.length,
      lineTones: lines.map((l) => l.getAttribute('data-alignment-guide-tone')),
      chipCount: chips.length,
      movingRight: moving?.right, refRight: reference?.right,
      rightDiff: (reference?.right ?? 0) - (moving?.right ?? 0),
    };
  });
  console.log('[probe] during-drag:', JSON.stringify(during));

  // extra nudge: move 1px more and re-dump (some engines only emit on move events)
  await movePointerDrag(page, drag, snapDeltaX + 1, 0);
  await movePointerDrag(page, drag, snapDeltaX, 0);
  await page.waitForTimeout(300);
  const during2 = await page.evaluate(() => {
    const lines = Array.from(document.querySelectorAll('[data-alignment-guide-line]'));
    return { lineCount: lines.length, tones: lines.map((l) => l.getAttribute('data-alignment-guide-tone')) };
  });
  console.log('[probe] during-drag-after-nudge:', JSON.stringify(during2));
});

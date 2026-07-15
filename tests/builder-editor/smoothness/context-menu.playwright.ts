import { expect, test, type Page } from '@playwright/test';
import { openBuilder } from '../helpers/editor';

// Real-pointer contract for the canvas context menu. Verifies the capture-phase
// isolation fix: dismissing the menu by clicking elsewhere must NOT leak the
// same pointer sequence to the canvas (selection is preserved, click leak
// count is 0). Also measures first-shell and submenu render timing and checks
// viewport clamping and keyboard (Escape) behavior.
//
// Hard rules for this spec (per work order): real pointer input only,
// elementFromPoint for hit testing, stable bounding boxes — no `force:true`,
// no `dispatchEvent`, no `HTMLElement.click`, no constructed events, and no
// fixed sleeps.

const SHELL_TARGET_WARM_MS = 16;
const SHELL_TARGET_MIDRANGE_MS = 32;
const SUBMENU_TARGET_MS = 16;
const MAIN_MENU_SELECTOR = '[role="menu"]:not([aria-label$="submenu"])';
const SUBMENU_SELECTOR = '[role="menu"][aria-label$="submenu"]';

interface MenuTiming {
  t0: number;
  t1: number;
  delta: number;
}

async function selectedNodeIds(page: Page): Promise<string[]> {
  return page.evaluate(() => {
    const nodes = Array.from(document.querySelectorAll('[data-node-id][data-selected="true"]'));
    return nodes.map((node) => node.getAttribute('data-node-id') ?? '');
  });
}

async function uniqueCanvasNodeIds(page: Page): Promise<string[]> {
  return page.evaluate(() => Array.from(new Set(
    Array.from(document.querySelectorAll('[data-node-id]'))
      .map((node) => node.getAttribute('data-node-id'))
      .filter((id): id is string => Boolean(id)),
  )));
}

async function describeUnderPoint(page: Page, x: number, y: number): Promise<string> {
  return page.evaluate(({ x, y, menuSelector }) => {
    const el = document.elementFromPoint(x, y);
    if (!el) return '';
    const node = el.closest('[data-node-id]');
    if (node) return `node:${node.getAttribute('data-node-id')}`;
    if (el.closest(menuSelector)) return 'menu';
    return el.tagName.toLowerCase();
  }, { x, y, menuSelector: '[role="menu"]' });
}

async function findEmptyCanvasPoint(page: Page): Promise<{ x: number; y: number }> {
  const point = await page.evaluate(({ stageSelector, menuSelector }) => {
    const stage = document.querySelector(stageSelector);
    if (!(stage instanceof HTMLElement)) return null;
    const rect = stage.getBoundingClientRect();
    for (let y = rect.top + 8; y < rect.bottom - 8; y += 12) {
      for (let x = rect.left + 8; x < rect.right - 8; x += 12) {
        const hit = document.elementFromPoint(x, y);
        if (!hit || !stage.contains(hit)) continue;
        if (hit.closest('[data-node-id], button, input, textarea, select, a')) continue;
        if (hit.closest(menuSelector)) continue;
        return { x, y };
      }
    }
    return null;
  }, {
    stageSelector: '[data-canvas-scroll-root]',
    menuSelector: '[role="menu"]',
  });
  expect(point, 'expected an elementFromPoint-verified empty canvas coordinate').not.toBeNull();
  return point!;
}

// Measures contextmenu-fire -> first visible, layout-ready shell commit. The
// geometry/style reads prevent a detached/hidden DOM insertion from counting
// as a successful open while keeping the <16ms interaction budget measurable.
async function armMenuTimer(page: Page): Promise<void> {
  await page.evaluate((selector) => {
    const win = window as unknown as { __menuTiming?: MenuTiming | null };
    win.__menuTiming = null;
    let t0 = 0;
    window.addEventListener(
      'contextmenu',
      () => { t0 = performance.now(); },
      { once: true, capture: true },
    );
    const measureWhenVisible = (menu: HTMLElement) => {
      const rect = menu.getBoundingClientRect();
      const style = getComputedStyle(menu);
      const opacity = Number.parseFloat(style.opacity || '1');
      if (
        rect.width > 0
        && rect.height > 0
        && style.display !== 'none'
        && style.visibility !== 'hidden'
        && opacity > 0
      ) {
        const t1 = performance.now();
        win.__menuTiming = { t0, t1, delta: t1 - t0 };
        return;
      }
      requestAnimationFrame(() => measureWhenVisible(menu));
    };
    const obs = new MutationObserver((records) => {
      for (const record of records) {
        for (const node of record.addedNodes) {
          if (!(node instanceof Element)) continue;
          const menu = node.matches(selector) ? node : node.querySelector(selector);
          if (!(menu instanceof HTMLElement)) continue;
          obs.disconnect();
          measureWhenVisible(menu);
          return;
        }
      }
    });
    obs.observe(document.body, { childList: true, subtree: true });
  }, MAIN_MENU_SELECTOR);
}

async function armSubmenuTimer(page: Page): Promise<void> {
  // Submenus open on hover (onMouseEnter), not on contextmenu. Record t0 on the
  // first mouseover that reaches a submenu trigger inside the open menu, and t1
  // when the submenu portal appears.
  await page.evaluate(({ mainSelector, submenuSelector }) => {
    const win = window as unknown as { __submenuTiming?: MenuTiming | null };
    win.__submenuTiming = null;
    let t0 = 0;
    const menu = document.querySelector(mainSelector);
    const onOver = (event: Event) => {
      const target = event.target as Element | null;
      const trigger = target?.closest?.('[data-has-submenu="true"]');
      if (!trigger) return;
      t0 = performance.now();
      menu?.removeEventListener('mouseover', onOver, true);
    };
    menu?.addEventListener('mouseover', onOver, true);
    const measureWhenVisible = (submenu: HTMLElement) => {
      const rect = submenu.getBoundingClientRect();
      const style = getComputedStyle(submenu);
      const opacity = Number.parseFloat(style.opacity || '1');
      if (
        rect.width > 0
        && rect.height > 0
        && style.display !== 'none'
        && style.visibility !== 'hidden'
        && opacity > 0
      ) {
        const t1 = performance.now();
        win.__submenuTiming = { t0, t1, delta: t1 - t0 };
        return;
      }
      requestAnimationFrame(() => measureWhenVisible(submenu));
    };
    const obs = new MutationObserver((records) => {
      for (const record of records) {
        for (const node of record.addedNodes) {
          if (!(node instanceof Element)) continue;
          const submenu = node.matches(submenuSelector) ? node : node.querySelector(submenuSelector);
          if (!(submenu instanceof HTMLElement)) continue;
          obs.disconnect();
          measureWhenVisible(submenu);
          return;
        }
      }
    });
    obs.observe(document.body, { childList: true, subtree: true });
  }, { mainSelector: MAIN_MENU_SELECTOR, submenuSelector: SUBMENU_SELECTOR });
}

async function readTiming(page: Page, key: '__menuTiming' | '__submenuTiming'): Promise<number> {
  await expect.poll(async () => {
    const timing = await page.evaluate((key) => {
      const win = window as unknown as Record<string, MenuTiming | null | undefined>;
      return win[key]?.delta ?? null;
    }, key);
    return timing;
  }).not.toBeNull();
  return page.evaluate((key) => {
    const win = window as unknown as Record<string, MenuTiming | null | undefined>;
    return win[key]?.delta ?? -1;
  }, key);
}

async function expectFullyOnScreen(page: Page, box: { x: number; y: number; width: number; height: number }): Promise<void> {
  const viewport = page.viewportSize();
  expect(viewport).not.toBeNull();
  expect(box.x).toBeGreaterThanOrEqual(0);
  expect(box.y).toBeGreaterThanOrEqual(0);
  expect(box.x + box.width).toBeLessThanOrEqual(viewport!.width);
  expect(box.y + box.height).toBeLessThanOrEqual(viewport!.height);
}

test.describe('Context menu smoothness + click isolation', () => {
  test.beforeEach(async ({ page }) => {
    await openBuilder(page);
  });

  test('dismissal is isolated to its exact pointer and restores focus', async ({ page }) => {
    const target = page.locator('[data-node-id="home-hero-title"]').first();
    await expect(target).toBeVisible();
    await target.scrollIntoViewIfNeeded();
    const targetBox = await target.boundingBox();
    expect(targetBox).not.toBeNull();

    await page.mouse.click(targetBox!.x + 16, targetBox!.y + 16);
    await expect(page.locator('[data-node-id="home-hero-title"][data-selected="true"]')).toBeVisible();

    const focusOrigin = page.locator('[data-builder-editor-theme-toggle]').first();
    await expect(focusOrigin).toBeVisible();

    let totalLeaks = 0;
    for (let i = 0; i < 3; i += 1) {
      await focusOrigin.click();
      await expect(focusOrigin).toBeFocused();
      const before = await selectedNodeIds(page);
      expect(before).toContain('home-hero-title');

      await page.mouse.click(targetBox!.x + 16, targetBox!.y + 16, { button: 'right' });
      const menu = page.locator(MAIN_MENU_SELECTOR).last();
      await expect(menu).toBeVisible();
      const dismissMenuBox = await menu.boundingBox();
      expect(dismissMenuBox).not.toBeNull();
      await expectFullyOnScreen(page, dismissMenuBox!);

      const dismissPoint = await findEmptyCanvasPoint(page);
      const under = await describeUnderPoint(page, dismissPoint.x, dismissPoint.y);
      expect(under).not.toBe('menu');
      expect(under).not.toMatch(/^node:/);

      await page.mouse.click(dismissPoint.x, dismissPoint.y);
      await expect(menu).toHaveCount(0);
      await expect(focusOrigin).toBeFocused();

      const after = await selectedNodeIds(page);
      if (after.join('|') !== before.join('|')) totalLeaks += 1;
    }

    expect(totalLeaks).toBe(0);
  });

  test('actions invoke once; submenu supports real pointer and complete keyboard focus', async ({ page }) => {
    const target = page.locator('[data-node-id="home-hero-title"]').first();
    await expect(target).toBeVisible();
    await target.scrollIntoViewIfNeeded();
    const box = await target.boundingBox();
    expect(box).not.toBeNull();

    await page.mouse.click(box!.x + 16, box!.y + 16);
    await expect(page.locator('[data-node-id="home-hero-title"][data-selected="true"]')).toBeVisible();
    const focusOrigin = page.locator('[data-builder-editor-theme-toggle]').first();
    await focusOrigin.click();
    await expect(focusOrigin).toBeFocused();

    const beforeIds = await uniqueCanvasNodeIds(page);
    await page.mouse.click(box!.x + 16, box!.y + 16, { button: 'right' });
    let menu = page.locator(MAIN_MENU_SELECTOR).last();
    await expect(menu).toBeVisible();

    const duplicate = menu.locator('[data-context-menu-action="duplicate"]');
    await duplicate.scrollIntoViewIfNeeded();
    const duplicateBox = await duplicate.boundingBox();
    expect(duplicateBox).not.toBeNull();
    await page.mouse.click(
      duplicateBox!.x + duplicateBox!.width / 2,
      duplicateBox!.y + duplicateBox!.height / 2,
    );
    await expect(menu).toHaveCount(0);
    await expect.poll(async () => (await uniqueCanvasNodeIds(page)).length).toBe(beforeIds.length + 1);
    await expect(focusOrigin).toBeFocused();

    // Re-select the original node, preserve a known focus origin, then verify
    // Home/End/wrap and the portaled submenu with real mouse + keyboard input.
    await page.mouse.click(box!.x + 16, box!.y + 16);
    await focusOrigin.click();
    await page.mouse.click(box!.x + 16, box!.y + 16, { button: 'right' });
    menu = page.locator(MAIN_MENU_SELECTOR).last();
    await expect(menu).toBeVisible();

    await page.keyboard.press('End');
    await expect(menu.locator('[data-context-menu-action="delete"]')).toBeFocused();
    await page.keyboard.press('Home');
    const firstEnabled = menu.locator('[role="menuitem"]:not(:disabled)').first();
    await expect(firstEnabled).toBeFocused();
    await page.keyboard.press('ArrowUp');
    await expect(menu.locator('[data-context-menu-action="delete"]')).toBeFocused();
    await page.keyboard.press('Home');
    await page.keyboard.press('ArrowDown');
    await expect(menu.locator('[role="menuitem"]:not(:disabled)').nth(1)).toBeFocused();

    const submenuTrigger = menu.locator('[data-context-menu-action="hide-on-viewport"]');
    await submenuTrigger.scrollIntoViewIfNeeded();
    const triggerBox = await submenuTrigger.boundingBox();
    expect(triggerBox).not.toBeNull();
    await page.mouse.move(
      triggerBox!.x + triggerBox!.width / 2,
      triggerBox!.y + triggerBox!.height / 2,
    );
    await expect(submenuTrigger).toBeFocused();
    await page.keyboard.press('ArrowRight');
    let submenu = page.locator(SUBMENU_SELECTOR).last();
    await expect(submenu).toBeVisible();
    await expect(submenu.locator('[data-context-menu-action="hide-desktop"]')).toBeFocused();

    await page.keyboard.press('End');
    await expect(submenu.locator('[data-context-menu-action="hide-mobile"]')).toBeFocused();
    await page.keyboard.press('Home');
    await page.keyboard.press('ArrowDown');
    await expect(submenu.locator('[data-context-menu-action="hide-tablet"]')).toBeFocused();
    await page.keyboard.press('Escape');
    await expect(submenu).toHaveCount(0);
    await expect(submenuTrigger).toBeFocused();

    // Resize closes the current menu by design. Close first, resize, then open
    // a fresh menu so the browser proves the actual left-placement branch.
    await page.keyboard.press('Escape');
    await expect(menu).toHaveCount(0);
    const originalViewport = page.viewportSize();
    expect(originalViewport).not.toBeNull();
    await page.setViewportSize({ width: 520, height: originalViewport!.height });
    await target.scrollIntoViewIfNeeded();
    const narrowTargetBox = await target.boundingBox();
    expect(narrowTargetBox).not.toBeNull();
    await page.mouse.click(
      narrowTargetBox!.x + Math.min(24, narrowTargetBox!.width / 2),
      narrowTargetBox!.y + Math.min(24, narrowTargetBox!.height / 2),
      { button: 'right' },
    );
    const flipMenu = page.locator(MAIN_MENU_SELECTOR).last();
    await expect(flipMenu).toBeVisible();
    const flipTrigger = flipMenu.locator('[data-context-menu-action="hide-on-viewport"]');
    await flipTrigger.scrollIntoViewIfNeeded();
    const flipTriggerBox = await flipTrigger.boundingBox();
    expect(flipTriggerBox).not.toBeNull();
    await page.mouse.move(
      flipTriggerBox!.x + flipTriggerBox!.width / 2,
      flipTriggerBox!.y + flipTriggerBox!.height / 2,
    );
    const flipSubmenu = page.locator(SUBMENU_SELECTOR).last();
    await expect(flipSubmenu).toBeVisible();
    await expect(flipSubmenu).toHaveAttribute('data-submenu-placement', 'left');
    const flippedSubmenuBox = await flipSubmenu.boundingBox();
    expect(flippedSubmenuBox).not.toBeNull();
    expect(flippedSubmenuBox!.x).toBeLessThan(flipTriggerBox!.x);
    await expectFullyOnScreen(page, flippedSubmenuBox!);
    await page.keyboard.press('Escape');
    await page.keyboard.press('Escape');
    await expect(flipMenu).toHaveCount(0);
    await page.setViewportSize(originalViewport!);

    // Reopen at the normal viewport for a real submenu command.
    await target.scrollIntoViewIfNeeded();
    const restoredTargetBox = await target.boundingBox();
    expect(restoredTargetBox).not.toBeNull();
    await focusOrigin.click();
    await page.mouse.click(
      restoredTargetBox!.x + 16,
      restoredTargetBox!.y + 16,
      { button: 'right' },
    );
    menu = page.locator(MAIN_MENU_SELECTOR).last();
    await expect(menu).toBeVisible();
    const actionTrigger = menu.locator('[data-context-menu-action="hide-on-viewport"]');
    await actionTrigger.scrollIntoViewIfNeeded();
    const actionTriggerBox = await actionTrigger.boundingBox();
    expect(actionTriggerBox).not.toBeNull();
    await page.mouse.move(
      actionTriggerBox!.x + actionTriggerBox!.width / 2,
      actionTriggerBox!.y + actionTriggerBox!.height / 2,
    );
    await page.keyboard.press('ArrowRight');
    submenu = page.locator(SUBMENU_SELECTOR).last();
    await expect(submenu).toBeVisible();
    const mobileAction = submenu.locator('[data-context-menu-action="hide-mobile"]');
    const mobileBox = await mobileAction.boundingBox();
    expect(mobileBox).not.toBeNull();
    await page.mouse.click(
      mobileBox!.x + mobileBox!.width / 2,
      mobileBox!.y + mobileBox!.height / 2,
    );
    await expect(menu).toHaveCount(0);
    await expect(focusOrigin).toBeFocused();

    // The real submenu command must have applied exactly to the mobile
    // responsive override: hidden on mobile, still visible on desktop.
    await page.locator('[data-builder-topbar-viewport="mobile"]').click();
    await expect(page.locator('[data-node-id="home-hero-title"]').first()).toBeHidden();
    await page.locator('[data-builder-topbar-viewport="desktop"]').click();
    await expect(page.locator('[data-node-id="home-hero-title"]').first()).toBeVisible();
  });

  test('midrange, warm shell, and submenu commits meet calibrated latency targets', async ({ page }) => {
    const target = page.locator('[data-node-id="home-hero-title"]').first();
    await expect(target).toBeVisible();
    await target.scrollIntoViewIfNeeded();
    const box = await target.boundingBox();
    expect(box).not.toBeNull();

    const focusOrigin = page.locator('[data-builder-editor-theme-toggle]').first();
    await focusOrigin.click();

    await armMenuTimer(page);
    await page.mouse.click(box!.x + 16, box!.y + 16, { button: 'right' });
    let warmMenu = page.locator(MAIN_MENU_SELECTOR).last();
    await expect(warmMenu).toBeVisible();
    const midrangeDelta = await readTiming(page, '__menuTiming');
    expect(midrangeDelta).toBeLessThan(SHELL_TARGET_MIDRANGE_MS);
    await page.keyboard.press('Escape');
    await expect(warmMenu).toHaveCount(0);

    const warmDeltas: number[] = [];
    for (let attempt = 0; attempt < 2; attempt += 1) {
      await armMenuTimer(page);
      await page.mouse.click(box!.x + 16, box!.y + 16, { button: 'right' });
      warmMenu = page.locator(MAIN_MENU_SELECTOR).last();
      await expect(warmMenu).toBeVisible();
      const delta = await readTiming(page, '__menuTiming');
      warmDeltas.push(delta);
      expect(delta, `warm shell attempt ${attempt + 1}`).toBeLessThan(SHELL_TARGET_WARM_MS);
      if (attempt === 0) {
        await page.keyboard.press('Escape');
        await expect(warmMenu).toHaveCount(0);
      }
    }

    const menu = warmMenu;
    const shellBox = await menu.boundingBox();
    expect(shellBox).not.toBeNull();
    await expectFullyOnScreen(page, shellBox!);

    const submenuTrigger = menu.locator('[data-context-menu-action="hide-on-viewport"]');
    await submenuTrigger.scrollIntoViewIfNeeded();
    await expect(submenuTrigger).toBeVisible();
    const triggerBox = await submenuTrigger.boundingBox();
    expect(triggerBox).not.toBeNull();

    await armSubmenuTimer(page);
    await page.mouse.move(triggerBox!.x + triggerBox!.width / 2, triggerBox!.y + triggerBox!.height / 2);
    const submenu = page.locator(SUBMENU_SELECTOR).last();
    await expect(submenu).toBeVisible();
    const submenuDelta = await readTiming(page, '__submenuTiming');
    const submenuBox = await submenu.boundingBox();
    expect(submenuBox).not.toBeNull();
    await expectFullyOnScreen(page, submenuBox!);

    console.log(
      `[context-menu] mid=${midrangeDelta.toFixed(2)}ms warm=${warmDeltas.map((value) => value.toFixed(2)).join(',')}ms`
      + ` submenu=${submenuDelta.toFixed(2)}ms (target ${SUBMENU_TARGET_MS})`,
    );
    expect(submenuDelta).toBeLessThan(SUBMENU_TARGET_MS);

    await page.keyboard.press('Escape');
    await expect(submenu).toHaveCount(0);
    await expect(menu).toBeVisible();
    await page.keyboard.press('Escape');
    await expect(menu).toHaveCount(0);
    await expect(focusOrigin).toBeFocused();
  });
});

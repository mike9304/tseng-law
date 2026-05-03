import { expect, test, type Locator, type Page } from '@playwright/test';

const screenshotDir = '/tmp';

async function waitForEditorCss(page: Page): Promise<void> {
  const isStyled = async () => page.locator('header[class*="topBar"]').first().evaluate((element) => {
    const style = window.getComputedStyle(element);
    return style.display === 'grid' && Number.parseFloat(style.height) <= 36;
  }).catch(() => false);

  try {
    await expect.poll(isStyled, { timeout: 15_000 }).toBe(true);
  } catch {
    await page.reload({ waitUntil: 'domcontentloaded' });
    await expect.poll(isStyled, { timeout: 15_000 }).toBe(true);
  }
}

async function openBuilder(page: Page): Promise<void> {
  await page.goto('/ko/admin-builder', { waitUntil: 'domcontentloaded' });
  await expect(page.locator('[data-editor-shell]')).toBeVisible();
  await waitForEditorCss(page);
  await page.waitForTimeout(5_000);
}

async function selectFirstNode(page: Page): Promise<Locator> {
  const node = page.getByRole('application', { name: 'Canvas editor' }).locator('[data-node-id]:visible').first();
  await expect(node).toBeVisible();
  await node.click({ position: { x: 12, y: 12 } });
  await expect(page.locator('[class*="resizeHandle"]')).toHaveCount(8);
  return node;
}

async function closeEditorOverlayIfPresent(page: Page): Promise<void> {
  const closeButton = page.getByRole('button', { name: /Close|닫기|취소|Cancel/ }).first();
  if ((await closeButton.count()) > 0 && await closeButton.isVisible()) {
    await closeButton.click();
    await page.waitForTimeout(150);
  }
}

async function visibleUnlockedNodes(page: Page): Promise<Locator> {
  const nodes = page
    .getByRole('application', { name: 'Canvas editor' })
    .locator('[data-node-id]:visible:not([class*="nodeLocked"])');
  await expect.poll(async () => nodes.count()).toBeGreaterThan(1);
  return nodes;
}

async function topmostUnlockedNode(page: Page): Promise<Locator> {
  const canvas = page.getByRole('application', { name: 'Canvas editor' });
  const nodeId = await canvas
    .locator('[data-node-id]:visible:not([class*="nodeLocked"])')
    .evaluateAll((elements) => {
      for (const element of elements) {
        const text = element.textContent ?? '';
        if (text.startsWith('image')) continue;
        const rect = element.getBoundingClientRect();
        if (rect.width < 24 || rect.height < 24 || rect.width > 900 || rect.height > 360) continue;
        const x = rect.left + Math.min(Math.max(rect.width / 2, 16), rect.width - 8);
        const y = rect.top + Math.min(Math.max(rect.height / 2, 16), rect.height - 8);
        const hit = document.elementFromPoint(x, y)?.closest('[data-node-id]');
        if (hit === element) return element.getAttribute('data-node-id');
      }
      return null;
    });
  expect(nodeId).toBeTruthy();
  return canvas.locator(`[data-node-id="${nodeId}"]`).first();
}

async function locatorBox(locator: Locator): Promise<NonNullable<Awaited<ReturnType<Locator['boundingBox']>>>> {
  const box = await locator.boundingBox();
  expect(box).not.toBeNull();
  return box!;
}

async function openSiteSettings(page: Page): Promise<Locator> {
  await page.locator('header[class*="topBar"]').getByTitle('사이트 설정').click();
  const modal = page.locator('[data-modal-shell="true"][data-modal-nested="false"]').last();
  await expect(modal).toBeVisible();
  await expect(modal).toContainText('사이트 설정');
  return modal;
}

test.describe('/ko/admin-builder design-pool browser coverage', () => {
  test('covers editor shell density, theme, zoom, inspector states, color picker, and context submenus', async ({ page }) => {
    await page.addInitScript(() => {
      window.localStorage.setItem('builder:recent-colors', JSON.stringify(['#ff0000', '#00aa88', 'rgba(17, 109, 255, 0.6)']));
    });
    await openBuilder(page);

    const shell = page.locator('[data-editor-shell]');
    const status = page.getByLabel('Editor status');
    await expect(status).toBeVisible();
    await expect(status).toContainText('Viewport: desktop');
    await expect(status.getByRole('button', { name: 'cozy' })).toHaveAttribute('aria-pressed', 'true');

    await status.getByRole('button', { name: 'comfortable' }).evaluate((button) => {
      (button as HTMLButtonElement).click();
    });
    await expect(shell).toHaveAttribute('data-editor-density', 'comfortable');
    await status.getByRole('button', { name: 'Light' }).evaluate((button) => {
      (button as HTMLButtonElement).click();
    });
    await expect(shell).toHaveAttribute('data-editor-theme', 'dark');
    await page.screenshot({ path: `${screenshotDir}/design-pool-editor-dark.png` });
    await status.getByRole('button', { name: 'Dark' }).evaluate((button) => {
      (button as HTMLButtonElement).click();
    });
    await expect(shell).toHaveAttribute('data-editor-theme', 'light');

    const zoomSlider = page.locator('input[class*="zoomSlider"]').first();
    await zoomSlider.fill('200');
    await expect(page.locator('[class*="zoomLabel"]').first()).toContainText('200%');
    await zoomSlider.fill('50');
    await expect(page.locator('[class*="zoomLabel"]').first()).toContainText('50%');
    await page.getByTitle('100%').click();
    await expect(page.locator('[class*="zoomLabel"]').first()).toContainText('100%');

    await page.screenshot({ path: `${screenshotDir}/design-pool-inspector-empty-or-initial.png` });
    await selectFirstNode(page);
    await closeEditorOverlayIfPresent(page);

    await page.getByRole('button', { name: /^layout$/i }).click();
    await expect(page.locator('.insp-row').first()).toBeVisible();
    await expect.poll(async () => page.locator('.insp-row').count()).toBeGreaterThan(4);
    await page.screenshot({ path: `${screenshotDir}/design-pool-inspector-layout.png` });

    await page.getByRole('button', { name: /^style$/i }).click();
    await expect(page.locator('.insp-row').first()).toBeVisible();
    const colorPicker = page.locator('[data-color-picker-advanced]').first();
    await expect(colorPicker).toBeVisible();
    await colorPicker.getByRole('button').first().click();
    const colorDialog = page.getByRole('dialog', { name: 'Advanced color picker' });
    await expect(colorDialog).toBeVisible();
    await expect(colorDialog).toContainText('Theme palette');
    await expect(colorDialog).toContainText('Recent');
    await expect(colorDialog).toContainText(/EyeDropper|Contrast/);
    await page.screenshot({ path: `${screenshotDir}/design-pool-color-picker.png` });
    await colorPicker.getByRole('button').first().click();
    await expect(colorDialog).toHaveCount(0);

    await page.getByRole('button', { name: /^content$/i }).click();
    await expect(page.locator('[data-inspector-content-adapter="true"]')).toBeVisible();
    await page.screenshot({ path: `${screenshotDir}/design-pool-inspector-content.png` });

    const contextNode = page
      .getByRole('application', { name: 'Canvas editor' })
      .locator('[data-node-id]:visible:not([class*="nodeLocked"])')
      .first();
    await expect(contextNode).toBeVisible();
    await contextNode.scrollIntoViewIfNeeded();
    await contextNode.click({ position: { x: 18, y: 18 } });
    await contextNode.click({ button: 'right', position: { x: 18, y: 18 } });
    const contextMenu = page.locator('[role="menu"]').first();
    await expect(contextMenu).toBeVisible();
    await expect(contextMenu).toContainText('Hide on viewport');
    await expect(contextMenu).toContainText('Delete');
    await contextMenu.getByRole('menuitem', { name: /Hide on viewport/ }).evaluate((element) => {
      (element as HTMLElement).focus({ preventScroll: true });
    });
    await page.keyboard.press('ArrowRight');
    const submenu = page.locator('[class*="contextSubmenu"]').last();
    await expect(submenu).toBeVisible();
    await expect(submenu).toContainText('Hide on mobile');
    await page.screenshot({ path: `${screenshotDir}/design-pool-context-submenu.png` });
    await page.keyboard.press('Escape');
  });

  test('covers canvas direct-manipulation overlays for drag, resize, multi-select, and snap distance', async ({ page }) => {
    await openBuilder(page);

    const canvas = page.getByRole('application', { name: 'Canvas editor' });
    const nodes = await visibleUnlockedNodes(page);
    const primaryNode = await topmostUnlockedNode(page);

    await page.keyboard.press('Control+A');
    await expect(page.locator('[class*="canvasOverlayMultiBbox"]').first()).toBeVisible();
    await page.screenshot({ path: `${screenshotDir}/design-pool-canvas-multiselect.png` });
    await page.keyboard.press('Escape');
    await expect(page.locator('[class*="canvasOverlayMultiBbox"]')).toHaveCount(0);

    await primaryNode.click({ position: { x: 18, y: 18 } });
    const dragBox = await locatorBox(primaryNode);
    await page.mouse.move(dragBox.x + 24, dragBox.y + 24);
    await page.mouse.down();
    await page.mouse.move(dragBox.x + 86, dragBox.y + 30, { steps: 8 });
    await expect(page.locator('[class*="canvasOverlayDragOrigin"]').first()).toBeVisible();
    await expect(page.locator('[class*="canvasOverlayDragGhost"]').first()).toBeVisible();
    await page.screenshot({ path: `${screenshotDir}/design-pool-canvas-drag-ghost.png` });
    await page.mouse.up();

    await primaryNode.click({ position: { x: 18, y: 18 } });
    const resizeHandle = page.getByLabel(/Resize .* node se/).first();
    await expect(resizeHandle).toBeVisible();
    const resizeBox = await locatorBox(resizeHandle);
    await page.mouse.move(resizeBox.x + resizeBox.width / 2, resizeBox.y + resizeBox.height / 2);
    await page.mouse.down();
    await page.mouse.move(resizeBox.x + 58, resizeBox.y + 44, { steps: 6 });
    const resizeReadout = page.locator('[class*="canvasOverlayResizeReadout"]').first();
    await expect(resizeReadout).toBeVisible();
    await expect(resizeReadout).toContainText(/\d+\s*x\s*\d+/);
    await page.screenshot({ path: `${screenshotDir}/design-pool-canvas-resize-readout.png` });
    await page.mouse.up();

    const primaryNodeId = await primaryNode.getAttribute('data-node-id');
    const nodeBoxes = await nodes.evaluateAll((elements) => elements.map((element, index) => {
      const rect = element.getBoundingClientRect();
      return {
        index,
        id: element.getAttribute('data-node-id'),
        x: rect.x,
        y: rect.y,
        width: rect.width,
        height: rect.height,
      };
    }).filter((rect) => rect.width > 24 && rect.height > 24 && rect.width < 800 && rect.height < 320));
    const viewport = page.viewportSize() ?? { width: 1440, height: 1000 };
    const activeBoxes = nodeBoxes.filter((box) => box.id === primaryNodeId);
    const snapPlan = activeBoxes.flatMap((active) => nodeBoxes
      .filter((target) => target.index !== active.index)
      .flatMap((target) => {
        const leftPlan = {
          activeIndex: active.index,
          startX: active.x + active.width / 2,
          startY: active.y + active.height / 2,
          endX: target.x - 16 - active.width / 2,
          endY: target.y + target.height / 2,
        };
        const rightPlan = {
          activeIndex: active.index,
          startX: active.x + active.width / 2,
          startY: active.y + active.height / 2,
          endX: target.x + target.width + 16 + active.width / 2,
          endY: target.y + target.height / 2,
        };
        return [leftPlan, rightPlan];
      }))
      .find((plan) => plan.endX > 40 && plan.endX < viewport.width - 40 && plan.endY > 80 && plan.endY < viewport.height - 80);
    expect(snapPlan).toBeTruthy();

    const snapNode = canvas.locator(`[data-node-id="${primaryNodeId}"]`).first();
    await snapNode.click({ position: { x: 18, y: 18 } });
    await page.mouse.move(snapPlan!.startX, snapPlan!.startY);
    await page.mouse.down();
    await page.mouse.move(snapPlan!.endX, snapPlan!.endY, { steps: 10 });
    const snapLabel = page.locator('[class*="canvasOverlaySnapDistance"]').first();
    await expect(snapLabel).toBeVisible();
    await expect(snapLabel).toContainText(/px/);
    await page.screenshot({ path: `${screenshotDir}/design-pool-canvas-snap-distance.png` });
    await page.mouse.up();
  });

  test('covers Site Settings ModalShell tabs, brand apply, typography picker, validation, and PUT 200 contract', async ({ page }) => {
    let putPayload: unknown = null;
    await page.route('**/api/builder/site/settings**', async (route, request) => {
      if (request.method() !== 'PUT') {
        await route.continue();
        return;
      }
      putPayload = JSON.parse(request.postData() || '{}');
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          ok: true,
          settings: (putPayload as { settings?: unknown }).settings,
          theme: (putPayload as { theme?: unknown }).theme,
          darkMode: (putPayload as { darkMode?: unknown }).darkMode,
        }),
      });
    });

    await openBuilder(page);
    let modal = await openSiteSettings(page);
    await expect(modal).toHaveAttribute('data-reduce-motion', /true|false/);
    await expect.poll(async () => modal.evaluate((node) => node.contains(document.activeElement))).toBe(true);
    await expect(modal).toContainText('기본 정보');

    await modal.locator('input[type="text"]').first().fill('호정 디자인 검증');
    await modal.getByRole('button', { name: '저장' }).click();
    await expect.poll(() => putPayload).not.toBeNull();
    expect(putPayload).toMatchObject({
      settings: {
        firmName: '호정 디자인 검증',
      },
    });
    await expect(page.locator('[data-modal-shell="true"]')).toHaveCount(0);

    modal = await openSiteSettings(page);
    await expect(modal).toContainText('기본 정보');

    await modal.getByRole('button', { name: /Brand kit/ }).click();
    await expect(modal).toContainText('Brand kit changes are site-wide');
    await expect(modal.locator('img')).toHaveCount(0);
    await modal.getByRole('button', { name: 'Apply brand kit' }).click();
    await expect(modal).toContainText('Brand kit을 현재 사이트 테마에 적용했습니다');

    await modal.getByRole('button', { name: /Typography/ }).click();
    await expect(modal.locator('[data-font-picker]').first()).toBeVisible();
    await modal.locator('[data-font-picker]').first().getByRole('button').click();
    const fontDialog = page.getByRole('dialog', { name: 'Advanced font picker' });
    await expect(fontDialog).toBeVisible();
    await fontDialog.getByPlaceholder('Search fonts').fill('Noto');
    await expect(fontDialog.getByLabel('Font preview text')).toHaveValue(/Aa/);
    await page.screenshot({ path: `${screenshotDir}/design-pool-font-picker.png` });

    await modal.getByRole('button', { name: /Presets/ }).click();
    await expect(modal.getByRole('button', { name: 'Apply' })).toHaveCount(5);

    await modal.getByRole('button', { name: /Dark mode/ }).click();
    await expect(modal).toContainText('Light preview');
    await expect(modal).toContainText('Dark preview');
    await page.screenshot({ path: `${screenshotDir}/design-pool-site-settings-dark-tab.png` });

    await modal.getByRole('button', { name: /Advanced/ }).click();
    await modal.locator('input[type="text"]').first().fill('not-a-hex');
    await modal.getByRole('button', { name: '저장' }).click();
    await expect(modal).toContainText('#RRGGBB');
    await modal.getByRole('button', { name: 'Close' }).click();
    await expect(page.locator('[data-modal-shell="true"]')).toHaveCount(0);
  });

  test('covers template gallery viewport, thumbnail renderer, hover card, and nested preview behavior', async ({ page }) => {
    await openBuilder(page);

    await page.locator('[class*="iconRail"]').getByRole('button', { name: 'Pages' }).click();
    await page.getByRole('button', { name: '+ New' }).click();

    const gallery = page.locator('[data-modal-shell="true"][data-modal-nested="false"]').last();
    await expect(gallery).toBeVisible();
    await expect(gallery).toContainText('프리미엄 템플릿 쇼룸');
    await expect(page.locator('[data-template-thumbnail-renderer="html-scaled-mock"]').first()).toBeVisible();
    await expect.poll(async () => page.locator('[data-template-thumbnail-renderer="html-scaled-mock"]').count()).toBeGreaterThan(20);

    const firstPreviewButton = gallery.getByRole('button', { name: /미리보기/ }).first();
    await firstPreviewButton.hover();
    await page.screenshot({ path: `${screenshotDir}/design-pool-template-gallery.png` });
    await firstPreviewButton.click();

    const nested = page.locator('[data-modal-shell="true"][data-modal-nested="true"]').last();
    await expect(nested).toBeVisible();
    await nested.getByRole('button', { name: 'tablet' }).click();
    await nested.getByRole('button', { name: 'mobile' }).click();
    await expect(nested).toContainText('CTA 목적');
    await page.screenshot({ path: `${screenshotDir}/design-pool-template-nested-preview.png` });

    await page.keyboard.press('Escape');
    await expect(page.locator('[data-modal-shell="true"][data-modal-nested="true"]')).toHaveCount(0);
    await expect(gallery).toBeVisible();
    await gallery.getByRole('button', { name: 'Close' }).click();
    await expect(page.locator('[data-modal-shell="true"]')).toHaveCount(0);
  });

  test('covers public widgets under mobile, dark color scheme, and reduced motion', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 900 });
    await page.emulateMedia({ colorScheme: 'dark', reducedMotion: 'reduce' });
    await page.goto('/ko', { waitUntil: 'domcontentloaded' });

    await expect(page.locator('body')).toBeVisible();
    await expect.poll(async () => page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth + 1)).toBe(true);
    await expect.poll(async () => page.evaluate(() => {
      const elements = Array.from(document.querySelectorAll<HTMLElement>('.builder-widget, [class*="Render"], [class*="section"]'));
      return elements.length;
    })).toBeGreaterThan(0);
    const motionDuration = await page.evaluate(() => {
      const candidate = document.querySelector<HTMLElement>('button, a, input, textarea');
      return candidate ? window.getComputedStyle(candidate).transitionDuration : '';
    });
    expect(motionDuration).not.toMatch(/[1-9]\d{2,}ms/);
    await page.screenshot({ path: `${screenshotDir}/design-pool-public-mobile-dark-reduced.png`, fullPage: true });
  });
});

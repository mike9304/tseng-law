import { expect, test, type Page } from '@playwright/test';
import { openBuilder, selectTextNode } from './helpers/editor';

type ControlBox = {
  readonly bottom: number;
  readonly height: number;
  readonly left: number;
  readonly right: number;
  readonly text: string;
  readonly top: number;
  readonly width: number;
};

type InspectorLayoutMetrics = {
  readonly exists: boolean;
  readonly minNumberButtonSize: number;
  readonly minToggleHeight: number;
  readonly numberButtonCount: number;
  readonly overflows: readonly ControlBox[];
  readonly panelRight: number;
  readonly toggleCount: number;
};

async function getInspectorLayoutMetrics(page: Page): Promise<InspectorLayoutMetrics> {
  return page.evaluate(() => {
    const panel = document.querySelector<HTMLElement>('[data-builder-inspector-panel="true"]');
    if (!panel) {
      return {
        exists: false,
        minNumberButtonSize: 0,
        minToggleHeight: 0,
        numberButtonCount: 0,
        overflows: [],
        panelRight: 0,
        toggleCount: 0,
      };
    }

    const panelRect = panel.getBoundingClientRect();
    const isVisible = (element: Element): element is HTMLElement => {
      if (!(element instanceof HTMLElement)) return false;
      const rect = element.getBoundingClientRect();
      const style = window.getComputedStyle(element);
      return rect.width > 0 && rect.height > 0 && style.display !== 'none' && style.visibility !== 'hidden';
    };
    const toBox = (element: HTMLElement): ControlBox => {
      const rect = element.getBoundingClientRect();
      return {
        bottom: Math.round(rect.bottom),
        height: Math.round(rect.height),
        left: Math.round(rect.left),
        right: Math.round(rect.right),
        text: (element.getAttribute('aria-label') || element.textContent || '').trim().replace(/\s+/g, ' '),
        top: Math.round(rect.top),
        width: Math.round(rect.width),
      };
    };

    const controls = Array.from(panel.querySelectorAll('button,input,select,textarea,[role="switch"]'))
      .filter(isVisible)
      .map(toBox);
    const numberButtons = Array.from(panel.querySelectorAll('.insp-number-stepper button'))
      .filter(isVisible)
      .map((element) => {
        const rect = element.getBoundingClientRect();
        return Math.min(rect.width, rect.height);
      });
    const toggles = Array.from(panel.querySelectorAll('.insp-toggle-row'))
      .filter(isVisible)
      .map((element) => element.getBoundingClientRect().height);

    return {
      exists: true,
      minNumberButtonSize: Math.min(...numberButtons),
      minToggleHeight: Math.min(...toggles),
      numberButtonCount: numberButtons.length,
      overflows: controls.filter((box) => (
        box.left < panelRect.left - 1
        || box.right > panelRect.right + 1
        || box.top < panelRect.top - 1
        || box.bottom > panelRect.bottom + 1
      )),
      panelRight: Math.round(panelRect.right),
      toggleCount: toggles.length,
    };
  });
}

test('/ko/admin-builder keeps text inspector layout controls inside the panel', async ({ page }) => {
  test.setTimeout(45_000);

  await page.setViewportSize({ width: 1440, height: 950 });
  await openBuilder(page, `/ko/admin-builder?inspectorLayout=${Date.now().toString(36)}`);
  await selectTextNode(page);

  const inspector = page.locator('[data-builder-inspector-panel="true"]').first();
  await expect(inspector).toBeVisible();
  await expect(inspector.getByLabel('X 값')).toBeVisible();

  const metrics = await getInspectorLayoutMetrics(page);
  expect(metrics.exists).toBe(true);
  expect(metrics.overflows).toEqual([]);
  expect(metrics.numberButtonCount).toBeGreaterThanOrEqual(10);
  expect(metrics.minNumberButtonSize).toBeGreaterThanOrEqual(28);
  expect(metrics.toggleCount).toBeGreaterThanOrEqual(3);
  expect(metrics.minToggleHeight).toBeGreaterThanOrEqual(24);
});

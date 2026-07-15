import { expect, test, type Page } from '@playwright/test';

const HOME_FLOW_ROOT_IDS = [
  'home-hero-root',
  'home-insights-root',
  'home-services-root',
  'home-attorney-root',
  'home-case-results-root',
  'home-stats-root',
  'home-faq-root',
  'home-offices-root',
  'home-contact-root',
] as const;

async function readHomeFlowGeometry(page: Page) {
  return page.evaluate((rootIds) => {
    const stage = document.querySelector<HTMLElement>('[data-builder-canvas-viewport]');
    if (!stage) throw new Error('Canvas stage is missing.');

    const sections = rootIds.map((id) => {
      const section = stage.querySelector<HTMLElement>(`[data-node-id="${id}"]`);
      if (!section) throw new Error(`Missing home flow section: ${id}`);
      return {
        bottom: section.offsetTop + section.offsetHeight,
        height: section.offsetHeight,
        id,
        marginTop: Number.parseFloat(getComputedStyle(section).marginTop) || 0,
        top: section.offsetTop,
      };
    });

    return {
      gaps: sections.slice(1).map((section, index) => section.top - sections[index].bottom),
      margins: sections.map((section) => section.marginTop),
      sectionHeightSum: sections.reduce((sum, section) => sum + section.height, 0),
      stageHeight: stage.clientHeight,
      tail: stage.clientHeight - sections[sections.length - 1].bottom,
      viewport: stage.dataset.builderCanvasViewport,
    };
  }, HOME_FLOW_ROOT_IDS);
}

test('canonical decomposed home canvas stays contiguous and fits each active viewport', async ({ page }) => {
  await page.goto(`/ko/admin-builder?homeFlowHeight=${Date.now().toString(36)}`, {
    waitUntil: 'domcontentloaded',
  });
  await expect(page.getByRole('application', { name: 'Canvas editor' })).toBeVisible({ timeout: 30_000 });
  await expect(page.locator('[data-editor-shell]').first()).toHaveAttribute(
    'data-editor-ready',
    'true',
    { timeout: 30_000 },
  );

  // This is intentionally a read-only smoke of the active editor draft. A
  // clean environment may still serve the composite home; the hermetic flow
  // behavior is covered in flow.test.ts, so do not mutate shared data here by
  // calling the decompose endpoint just to manufacture this precondition.
  const rootCounts = await Promise.all(HOME_FLOW_ROOT_IDS.map((id) => (
    page.locator(`[data-node-id="${id}"]`).count()
  )));
  test.skip(
    rootCounts.some((count) => count !== 1),
    'Requires the active home draft to use the nine-root decomposed format.',
  );

  for (const viewport of ['desktop', 'tablet', 'mobile'] as const) {
    const viewportButton = page.locator(`[data-builder-topbar-viewport="${viewport}"]`);
    await viewportButton.click();
    await expect(viewportButton).toHaveAttribute('aria-pressed', 'true');
    await expect(page.getByRole('application', { name: 'Canvas editor' })).toHaveAttribute(
      'data-builder-canvas-viewport',
      viewport,
    );

    await expect.poll(async () => readHomeFlowGeometry(page)).toMatchObject({
      gaps: Array(8).fill(0),
      margins: Array(9).fill(0),
      tail: 0,
      viewport,
    });

    const geometry = await readHomeFlowGeometry(page);
    expect(geometry.stageHeight).toBe(geometry.sectionHeightSum);
  }
});

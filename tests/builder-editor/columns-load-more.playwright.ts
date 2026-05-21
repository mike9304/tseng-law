import { expect, test } from '@playwright/test';

test.describe('/ko/columns load-more pagination', () => {
  test('renders an initial page then expands when Load more is clicked', async ({ page }) => {
    test.setTimeout(60_000);

    await page.goto('/ko/columns', { waitUntil: 'domcontentloaded' });

    const grid = page.locator('.columns-grid').first();
    await expect(grid).toBeVisible();

    const initialCount = Number(await grid.getAttribute('data-columns-visible-count'));
    expect(initialCount).toBeGreaterThan(0);
    expect(initialCount).toBeLessThanOrEqual(12);

    const loadMore = page.locator('[data-columns-load-more="true"]').first();
    const loadMoreVisible = await loadMore.isVisible().catch(() => false);
    if (!loadMoreVisible) {
      // Test corpus may have <= 12 posts so load-more is not present; this
      // still proves the slice rendered the full set without erroring.
      const remaining = await page.locator('[data-columns-remaining]').count();
      expect(remaining).toBe(0);
      return;
    }

    const remainingBefore = Number(
      await page.locator('[data-columns-remaining]').first().getAttribute('data-columns-remaining'),
    );
    expect(remainingBefore).toBeGreaterThan(0);

    await loadMore.click();

    await expect.poll(async () => Number(await grid.getAttribute('data-columns-visible-count'))).toBeGreaterThan(
      initialCount,
    );

    const remainingAfter = Number(
      await page.locator('[data-columns-remaining]').first().getAttribute('data-columns-remaining').catch(() => '0'),
    );
    expect(remainingAfter).toBeLessThan(remainingBefore);
  });
});

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

    expect(new URL(page.url()).searchParams.get('page')).toBe('2');
    expect(Number(await grid.getAttribute('data-columns-visible-count'))).toBeGreaterThan(initialCount);
    await expect(page).toHaveURL(/\/ko\/columns\?page=2/);

    const remainingAfter = Number(
      await page.locator('[data-columns-remaining]').first().getAttribute('data-columns-remaining').catch(() => '0'),
    );
    expect(remainingAfter).toBeLessThan(remainingBefore);

    await page.reload({ waitUntil: 'domcontentloaded' });
    await expect(page).toHaveURL(/\/ko\/columns\?page=2/);
    await expect.poll(async () => Number(await grid.getAttribute('data-columns-visible-count'))).toBeGreaterThan(
      initialCount,
    );

    await page.goBack({ waitUntil: 'domcontentloaded' });
    await expect(page).toHaveURL(/\/ko\/columns$/);
    await expect.poll(async () => Number(await grid.getAttribute('data-columns-visible-count'))).toBe(initialCount);

    await loadMore.click();
    expect(new URL(page.url()).searchParams.get('page')).toBe('2');
    const firstVisibleTitle = (await page.locator('.columns-card-title').first().innerText()).trim();
    const searchInput = page.locator('[data-columns-search-input="true"]').first();
    await searchInput.fill(firstVisibleTitle);
    await searchInput.press('Enter');
    const searchUrl = new URL(page.url());
    expect(searchUrl.searchParams.get('q')).toBe(firstVisibleTitle);
    expect(searchUrl.searchParams.has('page')).toBe(false);
    await expect(page.locator('[data-columns-search-results]')).toHaveAttribute('data-columns-search-results', /\d+/);
    await expect.poll(async () => Number(await grid.getAttribute('data-columns-visible-count'))).toBeLessThanOrEqual(
      initialCount,
    );
  });
});

import { expect, test } from '@playwright/test';

test.describe('/ko/columns visitor search', () => {
  test('submitting the search input updates the URL ?q= and filters results', async ({ page }) => {
    test.setTimeout(60_000);

    await page.goto('/ko/columns', { waitUntil: 'domcontentloaded' });

    const grid = page.locator('.columns-grid').first();
    await expect(grid).toBeVisible();
    const initialCount = Number(await grid.getAttribute('data-columns-visible-count'));
    expect(initialCount).toBeGreaterThan(0);

    const searchInput = page.locator('[data-columns-search-input="true"]').first();
    await expect(searchInput).toBeVisible();

    // Read a real post title to construct a query likely to match at least one post.
    const firstCardTitle = (await page.locator('.columns-card-title').first().innerText()).trim();
    expect(firstCardTitle.length).toBeGreaterThan(2);
    const probe = firstCardTitle.slice(0, Math.min(4, firstCardTitle.length));

    await searchInput.fill(probe);
    await page.locator('.columns-search-submit').click();

    await expect.poll(() => page.url()).toContain('q=');
    const filteredCount = Number(await grid.getAttribute('data-columns-visible-count'));
    expect(filteredCount).toBeGreaterThan(0);
    expect(filteredCount).toBeLessThanOrEqual(initialCount);

    const status = page.locator('[data-columns-search-results]').first();
    await expect(status).toBeVisible();

    // Clear search restores full grid
    await page.locator('[data-columns-search-clear="true"]').click();
    await expect.poll(() => page.url()).not.toContain('q=');
    await expect.poll(async () => Number(await grid.getAttribute('data-columns-visible-count'))).toBe(initialCount);
  });
});

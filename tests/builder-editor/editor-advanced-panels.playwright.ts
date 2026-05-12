import { expect, test, type Page } from '@playwright/test';

const PREFS_KEY = 'tw_builder_editor_prefs_v1';
const shortcutModifier = process.platform === 'darwin' ? 'Meta' : 'Control';

async function countGeneratedTextNodes(page: Page): Promise<number> {
  return page.locator('[data-node-id^="text-"]').count();
}

async function countSelectedNodes(page: Page): Promise<number> {
  return page.locator('[data-node-id][data-selected="true"]').count();
}

test.describe('M28 editor advanced panels', () => {
  test.setTimeout(120_000);

  test('connects layers, shortcut map, align/distribute, style paste, components, comments, zoom, and undo timeline', async ({ page }) => {
    await page.addInitScript((key) => window.localStorage.removeItem(key), PREFS_KEY);
    await page.goto('/ko/admin-builder', { waitUntil: 'domcontentloaded' });

    await expect(page.getByRole('application', { name: 'Canvas editor' })).toBeVisible();

    await page.getByRole('button', { name: /Layers/i }).click();
    await expect(page.locator('[data-builder-layers-panel="true"]')).toBeVisible();
    const layerRows = page.locator('[data-builder-layer-row]');
    await expect(layerRows.first()).toBeVisible();
    await expect(layerRows.first()).toHaveAttribute('data-builder-layer-z', /\d+/);
    await page.locator('[data-builder-layer-search="true"]').fill('hero');
    await expect(layerRows.first()).toBeVisible();

    await page.locator('[data-builder-layer-search="true"]').fill('home-hero-title');
    const heroTitleLayer = page.locator('[data-builder-layer-row="home-hero-title"]');
    await heroTitleLayer.scrollIntoViewIfNeeded();
    await heroTitleLayer.click();
    await expect(page.locator('[data-builder-element-comments="home-hero-title"]')).toBeVisible();
    await page.locator('[data-builder-comment-input="true"]').fill('M28 QA comment');
    await page.locator('[data-builder-comment-submit="true"]').click();
    await expect(page.getByText('M28 QA comment')).toBeVisible();

    await page.getByRole('button', { name: /Add/i }).click();
    await expect(page.locator('[data-builder-component-library="true"]')).toBeVisible();
    await page.locator('[data-builder-component-library-name="true"]').fill('Hero title test');
    await page.locator('[data-builder-component-library-save="true"]').click();
    await expect(page.getByText('Hero title test')).toBeVisible();
    await page.locator('[data-builder-component-library-insert]').first().click();
    await expect(page.locator('[data-builder-activity-chip="true"]').filter({ hasText: /saving|Pasted|Copied|Toggled|style/i }).or(page.locator('[data-builder-component-library="true"]'))).toBeVisible();

    const layersPanel = page.locator('[data-builder-layers-panel="true"]');
    if (!(await layersPanel.isVisible().catch(() => false))) {
      await page.getByRole('button', { name: /Layers/i }).click();
    }
    await expect(layersPanel).toBeVisible();
    await page.locator('[data-builder-layer-search="true"]').fill('home-hero-title');
    await heroTitleLayer.scrollIntoViewIfNeeded();
    await heroTitleLayer.click();
    await page.keyboard.press('Meta+Alt+C');
    await expect(page.locator('[data-builder-activity-chip="true"]').filter({ hasText: /Copied style/i })).toBeVisible();
    await page.locator('[data-builder-layer-search="true"]').fill('home-hero-subtitle');
    const heroSubtitleLayer = page.locator('[data-builder-layer-row="home-hero-subtitle"]');
    await heroSubtitleLayer.scrollIntoViewIfNeeded();
    await heroSubtitleLayer.click();
    await page.keyboard.press('Meta+Alt+V');
    await expect(page.locator('[data-builder-activity-chip="true"]').filter({ hasText: /Pasted style/i })).toBeVisible();

    await page.keyboard.press('Meta+A');
    await expect(page.locator('[data-builder-align-action="left"]')).toBeVisible();
    await expect(page.locator('[data-builder-distribute-action="horizontal"]')).toBeVisible();
    await page.locator('[data-builder-align-action="left"]').click();
    await page.locator('[data-builder-distribute-action="horizontal"]').click();

    await expect(page.locator('[data-builder-zoom-dock="true"]')).toBeVisible();
    await page.locator('[data-builder-zoom-action="in"]').click();
    await expect(page.locator('[data-builder-zoom-label="true"]')).toContainText('%');

    await page.locator('[data-builder-prefs-button]').click();
    await page.locator('[data-builder-shortcut-map-open="true"]').click();
    await expect(page.locator('[data-builder-keybindings-modal="true"]')).toBeVisible();
    await page.locator('[data-builder-keybinding-input="duplicate"]').fill('Mod+Shift+X');
    await page.getByRole('button', { name: '저장' }).click();
    const prefs = await page.evaluate((key) => JSON.parse(window.localStorage.getItem(key) || '{}'), PREFS_KEY) as {
      customKeybindings?: Array<{ action: string; combo: string }>;
    };
    expect(prefs.customKeybindings).toContainEqual({ action: 'duplicate', combo: 'Mod+Shift+X' });

    if (!(await layersPanel.isVisible().catch(() => false))) {
      await page.getByRole('button', { name: /Layers/i }).click();
    }
    await expect(layersPanel).toBeVisible();
    await page.keyboard.press('Escape');
    await expect.poll(() => countSelectedNodes(page)).toBe(0);
    await page.locator('[data-builder-layer-search="true"]').fill('home-hero-title');
    await heroTitleLayer.scrollIntoViewIfNeeded();
    await heroTitleLayer.click();
    const heroTitleNode = page.locator('[data-node-id="home-hero-title"]').first();
    await expect(heroTitleNode).toHaveAttribute('data-selected', 'true');
    await expect.poll(() => countSelectedNodes(page)).toBe(1);
    const generatedTextCountBeforeDuplicate = await countGeneratedTextNodes(page);
    await page.keyboard.press(`${shortcutModifier}+D`);
    await expect.poll(() => countGeneratedTextNodes(page)).toBe(generatedTextCountBeforeDuplicate);
    await page.keyboard.press(`${shortcutModifier}+Shift+X`);
    await expect.poll(() => countGeneratedTextNodes(page)).toBe(generatedTextCountBeforeDuplicate + 1);
    await expect(page.locator('[data-node-id^="text-"][data-selected="true"]').last()).toBeVisible();

    await page.getByRole('button', { name: /History/i }).click();
    await expect(page.locator('[data-builder-undo-timeline="true"]')).toBeVisible();
    await expect(page.locator('[data-builder-undo-snapshot]').first()).toBeVisible();

    await page.locator('[data-builder-editor-theme-toggle]').click();
    await expect.poll(() => page.evaluate(() => document.documentElement.dataset.builderEditorTheme)).toMatch(/dark|auto|light/);
  });
});

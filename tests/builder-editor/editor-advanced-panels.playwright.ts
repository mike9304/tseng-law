import { expect, test, type APIRequestContext, type Page } from '@playwright/test';

const PREFS_KEY = 'tw_builder_editor_prefs_v1';
const shortcutModifier = process.platform === 'darwin' ? 'Meta' : 'Control';

function mutationHeaders(scope: string): Record<string, string> {
  const safeScope = scope.replace(/[^a-z0-9-]/gi, '-').slice(-48) || 'm73-editor-advanced';
  return { 'x-forwarded-for': `pw-${safeScope}` };
}

function defaultNodeStyle() {
  return {
    backgroundColor: 'transparent',
    borderColor: '#cbd5e1',
    borderStyle: 'solid',
    borderWidth: 0,
    borderRadius: 14,
    shadowX: 0,
    shadowY: 0,
    shadowBlur: 0,
    shadowSpread: 0,
    shadowColor: 'rgba(15, 23, 42, 0.16)',
    opacity: 100,
  };
}

function createAdvancedPanelsDocument(locale = 'ko') {
  return {
    version: 1,
    locale,
    updatedAt: new Date().toISOString(),
    updatedBy: 'playwright-editor-advanced-panels',
    stageWidth: 1280,
    stageHeight: 720,
    nodes: [
      {
        id: 'home-hero-title',
        kind: 'text',
        rect: { x: 96, y: 96, width: 520, height: 96 },
        style: defaultNodeStyle(),
        zIndex: 1,
        rotation: 0,
        locked: false,
        visible: true,
        content: {
          text: 'M73 고급 패널 검증',
          fontSize: 40,
          color: '#0f172a',
          fontWeight: 'bold',
          align: 'left',
          lineHeight: 1.2,
          letterSpacing: 0,
          fontFamily: 'system-ui',
        },
      },
      {
        id: 'home-hero-subtitle',
        kind: 'text',
        rect: { x: 96, y: 220, width: 560, height: 72 },
        style: defaultNodeStyle(),
        zIndex: 2,
        rotation: 0,
        locked: false,
        visible: true,
        content: {
          text: '레이어, 주석, 단축키, 히스토리 undo/redo가 한 페이지에서 안정적으로 동작해야 합니다.',
          fontSize: 18,
          color: '#475569',
          fontWeight: 'regular',
          align: 'left',
          lineHeight: 1.35,
          letterSpacing: 0,
          fontFamily: 'system-ui',
        },
      },
    ],
  };
}

async function createAdvancedPanelsPage(request: APIRequestContext, token: string): Promise<string> {
  const response = await request.post('/api/builder/site/pages', {
    data: {
      locale: 'ko',
      slug: `g-editor-m73-advanced-${token}`,
      title: `M73 Advanced ${token}`,
      document: createAdvancedPanelsDocument('ko'),
    },
    headers: mutationHeaders(token),
  });
  expect(response.status()).toBe(200);
  const payload = await response.json() as { success?: boolean; pageId?: string; error?: string };
  expect(payload.success, payload.error).toBe(true);
  expect(payload.pageId).toBeTruthy();
  return payload.pageId!;
}

async function countGeneratedTextNodes(page: Page): Promise<number> {
  return page.locator('[data-node-id^="text-"]').count();
}

async function countSelectedNodes(page: Page): Promise<number> {
  return page.locator('[data-node-id][data-selected="true"]').count();
}

async function ensureLayersPanelOpen(page: Page): Promise<ReturnType<Page['locator']>> {
  const layersPanel = page.locator('[data-builder-layers-panel="true"]');
  if (await layersPanel.isVisible().catch(() => false)) {
    return layersPanel;
  }
  const layersButton = page.getByRole('button', { name: /Layers/i });
  await layersButton.click();
  if (!(await layersPanel.isVisible({ timeout: 2500 }).catch(() => false))) {
    await page.getByRole('button', { name: /Pages/i }).click();
    await layersButton.click();
  }
  await expect(layersPanel).toBeVisible();
  return layersPanel;
}

async function addElementComment(page: Page, nodeId: string, body: string): Promise<void> {
  const commentsPanel = page.locator(`[data-builder-element-comments="${nodeId}"]`);
  const commentInput = commentsPanel.locator('[data-builder-comment-input="true"]');
  const commentSubmit = commentsPanel.locator('[data-builder-comment-submit="true"]');
  let lastError: unknown = null;

  for (let attempt = 0; attempt < 3; attempt += 1) {
    await expect(commentsPanel).toBeVisible();
    try {
      await commentInput.fill(body, { timeout: 5000 });
      await expect(commentSubmit).toBeEnabled();
      await commentSubmit.click();
      await expect(commentsPanel.getByText(body)).toBeVisible();
      return;
    } catch (error) {
      lastError = error;
      await page.waitForTimeout(150);
    }
  }

  throw lastError instanceof Error ? lastError : new Error('Failed to add element comment.');
}

async function closeEditorPrefsPopover(page: Page) {
  const prefsDialog = page.getByRole('dialog', { name: 'Editor preferences' });
  if (await prefsDialog.isVisible().catch(() => false)) {
    await page.locator('[data-builder-prefs-button]').click();
    await expect(prefsDialog).toBeHidden();
  }
}

test.describe('M28 editor advanced panels', () => {
  test.setTimeout(120_000);

  test('connects layers, shortcut map, align/distribute, style paste, components, comments, zoom, and undo timeline', async ({ page }) => {
    await page.addInitScript((key) => window.localStorage.removeItem(key), PREFS_KEY);
    const token = Date.now().toString(36);
    let pageId: string | null = null;

    try {
      pageId = await createAdvancedPanelsPage(page.request, token);
      await page.goto(`/ko/admin-builder?pageId=${encodeURIComponent(pageId)}&advancedPanels=${token}`, {
        waitUntil: 'domcontentloaded',
      });

      await expect(page.getByRole('application', { name: 'Canvas editor' })).toBeVisible();
      await expect(page.locator('[data-editor-shell]')).toHaveAttribute('data-editor-ready', 'true', { timeout: 30_000 });

      const layersPanel = await ensureLayersPanelOpen(page);
      const layerRows = page.locator('[data-builder-layer-row]');
      await expect(layerRows.first()).toBeVisible();
      await expect(layerRows.first()).toHaveAttribute('data-builder-layer-z', /\d+/);
      await page.locator('[data-builder-layer-search="true"]').fill('hero');
      await expect(layerRows.first()).toBeVisible();

      await page.locator('[data-builder-layer-search="true"]').fill('home-hero-title');
      const heroTitleLayer = page.locator('[data-builder-layer-row="home-hero-title"]');
      const heroTitleNode = page.locator('[data-node-id="home-hero-title"]').first();
      await heroTitleLayer.scrollIntoViewIfNeeded();
      await heroTitleLayer.click();
      await expect(page.locator('[data-builder-element-comments="home-hero-title"]')).toBeVisible();
      await addElementComment(page, 'home-hero-title', 'M28 QA comment');

      await page.getByRole('button', { name: /Add/i }).click();
      await expect(page.locator('[data-builder-component-library="true"]')).toBeVisible();
      await heroTitleNode.scrollIntoViewIfNeeded();
      await heroTitleNode.click({ position: { x: 12, y: 12 }, force: true });
      await expect(heroTitleNode).toHaveAttribute('data-selected', 'true');
      await page.locator('[data-builder-component-library-name="true"]').fill('Hero title test');
      await expect(page.locator('[data-builder-component-library-save="true"]')).toBeEnabled();
      await page.locator('[data-builder-component-library-save="true"]').click();
      await expect(page.getByText('Hero title test')).toBeVisible();
      await page.locator('[data-builder-component-library-insert]').first().click();
      await expect(page.locator('[data-builder-activity-chip="true"]').filter({ hasText: /saving|Pasted|Copied|Toggled|style/i }).or(page.locator('[data-builder-component-library="true"]'))).toBeVisible();

      await ensureLayersPanelOpen(page);
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
      const browserIsMac = await page.evaluate(() => /Mac|iPhone|iPad|iPod/.test(navigator.platform));
      const customDuplicateShortcutTitle = browserIsMac ? 'Cmd+Shift+X' : 'Ctrl+Shift+X';
      const customDuplicateShortcutGlyph = browserIsMac ? '⇧⌘X' : 'Shift+Ctrl+X';

      await closeEditorPrefsPopover(page);
      await ensureLayersPanelOpen(page);
      await page.keyboard.press('Escape');
      await expect.poll(() => countSelectedNodes(page)).toBe(0);
      await page.locator('[data-builder-layer-search="true"]').fill('home-hero-title');
      await heroTitleLayer.scrollIntoViewIfNeeded();
      await heroTitleLayer.click();
      await expect(heroTitleNode).toHaveAttribute('data-selected', 'true');
      await expect.poll(() => countSelectedNodes(page)).toBe(1);
      await expect(page.locator(`[title="복제 (${customDuplicateShortcutTitle})"]`)).toBeVisible();
      await expect(page.locator(`[title="선택 노드 복제 (${customDuplicateShortcutTitle})"]`)).toBeVisible();
      const heroTitleBox = await heroTitleNode.boundingBox();
      expect(heroTitleBox).not.toBeNull();
      await heroTitleNode.dispatchEvent('contextmenu', {
        bubbles: true,
        cancelable: true,
        button: 2,
        clientX: heroTitleBox!.x + Math.min(12, heroTitleBox!.width / 2),
        clientY: heroTitleBox!.y + Math.min(12, heroTitleBox!.height / 2),
      });
      await expect(page.getByRole('menuitem', { name: /Duplicate/ })).toContainText(customDuplicateShortcutGlyph);
      await page.keyboard.press('Escape');
      await page.locator('[data-builder-layer-search="true"]').fill('home-hero-title');
      await heroTitleLayer.scrollIntoViewIfNeeded();
      await heroTitleLayer.click();
      await expect.poll(() => countSelectedNodes(page)).toBe(1);
      const generatedTextCountBeforeDuplicate = await countGeneratedTextNodes(page);
      await page.keyboard.press(`${shortcutModifier}+D`);
      await expect.poll(() => countGeneratedTextNodes(page)).toBe(generatedTextCountBeforeDuplicate);
      await page.keyboard.press(`${shortcutModifier}+Shift+X`);
      const generatedTextCountAfterDuplicate = generatedTextCountBeforeDuplicate + 1;
      await expect.poll(() => countGeneratedTextNodes(page)).toBe(generatedTextCountAfterDuplicate);
      await expect(page.locator('[data-node-id^="text-"][data-selected="true"]').last()).toBeVisible();

      await page.getByRole('button', { name: /History/i }).click();
      await expect(page.locator('[data-builder-undo-timeline="true"]')).toBeVisible();
      await expect(page.locator('[data-builder-undo-snapshot]').first()).toBeVisible();
      const undoButton = page.locator('[data-builder-undo-action="undo"]');
      const redoButton = page.locator('[data-builder-undo-action="redo"]');
      await expect(undoButton).toBeEnabled();
      await undoButton.click();
      await expect.poll(() => countGeneratedTextNodes(page)).toBe(generatedTextCountBeforeDuplicate);
      await expect(redoButton).toBeEnabled();
      await redoButton.click();
      await expect.poll(() => countGeneratedTextNodes(page)).toBe(generatedTextCountAfterDuplicate);

      await page.locator('[data-builder-editor-theme-toggle]').click();
      await expect.poll(() => page.evaluate(() => document.documentElement.dataset.builderEditorTheme)).toMatch(/dark|auto|light/);
    } finally {
      if (pageId) {
        await page.request.delete(`/api/builder/site/pages/${pageId}?locale=ko`, {
          headers: mutationHeaders(token),
          failOnStatusCode: false,
        });
      }
    }
  });

  test('closes the shortcut map with Escape without persisting focused input edits', async ({ page }) => {
    await page.addInitScript((key) => window.localStorage.removeItem(key), PREFS_KEY);
    const token = `${Date.now().toString(36)}-escape`;
    let pageId: string | null = null;

    try {
      pageId = await createAdvancedPanelsPage(page.request, token);
      await page.goto(`/ko/admin-builder?pageId=${encodeURIComponent(pageId)}&shortcutEscape=${token}`, {
        waitUntil: 'domcontentloaded',
      });
      await expect(page.locator('[data-editor-shell]')).toHaveAttribute('data-editor-ready', 'true', { timeout: 30_000 });

      await page.locator('[data-builder-prefs-button]').click();
      await page.locator('[data-builder-shortcut-map-open="true"]').click();
      const keybindingsModal = page.locator('[data-builder-keybindings-modal="true"]');
      await expect(keybindingsModal).toBeVisible();
      await keybindingsModal.locator('[data-builder-keybinding-input="duplicate"]').fill('Mod+Alt+Z');
      await page.keyboard.press('Escape');
      await expect(keybindingsModal).toBeHidden();

      const prefs = await page.evaluate((key) => JSON.parse(window.localStorage.getItem(key) || '{}'), PREFS_KEY) as {
        customKeybindings?: Array<{ action: string; combo: string }>;
      };
      expect(prefs.customKeybindings ?? []).not.toContainEqual({ action: 'duplicate', combo: 'Mod+Alt+Z' });
      await expect.poll(() => countSelectedNodes(page)).toBe(0);
    } finally {
      if (pageId) {
        await page.request.delete(`/api/builder/site/pages/${pageId}?locale=ko`, {
          headers: mutationHeaders(token),
          failOnStatusCode: false,
        });
      }
    }
  });
});

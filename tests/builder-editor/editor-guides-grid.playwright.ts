import { expect, test, type APIRequestContext, type Page } from '@playwright/test';
import { openBuilder } from './helpers/editor';

const PREFS_KEY = 'tw_builder_editor_prefs_v1';

function mutationHeaders(scope: string): Record<string, string> {
  const safeScope = scope.replace(/[^a-z0-9-]/gi, '-').slice(-48) || 'm28-editor-guides';
  return { 'x-forwarded-for': `pw-${safeScope}` };
}

function createOutlinePrefsDocument(token: string) {
  return {
    version: 1,
    locale: 'ko',
    updatedAt: new Date().toISOString(),
    updatedBy: `outline-toggle-${token}`,
    stageWidth: 1280,
    stageHeight: 720,
    nodes: [
      {
        id: `outline-image-${token}`,
        kind: 'image',
        rect: { x: 88, y: 92, width: 360, height: 220 },
        style: {
          backgroundColor: 'transparent',
          borderColor: '#cbd5e1',
          borderStyle: 'solid',
          borderWidth: 0,
          borderRadius: 12,
          shadowX: 0,
          shadowY: 10,
          shadowBlur: 24,
          shadowSpread: 0,
          shadowColor: 'rgba(15, 23, 42, 0.14)',
          opacity: 100,
        },
        zIndex: 1,
        rotation: 0,
        locked: false,
        visible: true,
        content: {
          src: 'data:image/svg+xml,%3Csvg%20xmlns=%22http://www.w3.org/2000/svg%22%20viewBox=%220%200%20360%20220%22%3E%3Crect%20width=%22360%22%20height=%22220%22%20fill=%22%23dbeafe%22/%3E%3Ccircle%20cx=%22100%22%20cy=%2272%22%20r=%2242%22%20fill=%22%23116dff%22/%3E%3Cpath%20d=%22M0%20170L88%20116L154%20146L240%2090L360%20144V220H0Z%22%20fill=%22%230f172a%22%20fill-opacity=%220.82%22/%3E%3C/svg%3E',
          alt: `Outline toggle ${token}`,
          fit: 'cover',
        },
      },
      {
        id: `outline-text-${token}`,
        kind: 'text',
        rect: { x: 500, y: 120, width: 420, height: 86 },
        style: {
          backgroundColor: 'transparent',
          borderColor: '#cbd5e1',
          borderStyle: 'solid',
          borderWidth: 0,
          borderRadius: 0,
          shadowX: 0,
          shadowY: 0,
          shadowBlur: 0,
          shadowSpread: 0,
          shadowColor: 'rgba(15, 23, 42, 0.14)',
          opacity: 100,
        },
        zIndex: 2,
        rotation: 0,
        locked: false,
        visible: true,
        content: {
          text: `Outline prefs ${token}`,
          fontSize: 32,
          color: '#0f172a',
          fontWeight: 'bold',
          align: 'left',
          lineHeight: 1.2,
          letterSpacing: 0,
          fontFamily: 'system-ui',
          verticalAlign: 'top',
          textTransform: 'none',
          as: 'h1',
        },
      },
    ],
  };
}

async function createOutlinePrefsPage(request: APIRequestContext, token: string): Promise<string> {
  const response = await request.post('/api/builder/site/pages', {
    data: {
      locale: 'ko',
      slug: `g-editor-outline-toggle-${token}`,
      title: `Outline Toggle ${token}`,
      document: createOutlinePrefsDocument(token),
    },
    headers: mutationHeaders(token),
  });
  expect(response.status()).toBe(200);
  const payload = await response.json() as { success?: boolean; pageId?: string; error?: string };
  expect(payload.success, payload.error).toBe(true);
  expect(payload.pageId).toBeTruthy();
  return payload.pageId!;
}

// W217 (Wix parity): drag a fresh vertical guide out of the top ruler into the
// stage. Mirrors the creation flow exercised by the first test so the
// reposition / delete tests can start from a known committed guide.
async function createVerticalGuideViaRuler(page: Page): Promise<void> {
  const topRuler = page.locator('[data-builder-ruler="top"]').first();
  const box = await topRuler.boundingBox();
  expect(box).toBeTruthy();
  const startX = box!.x + Math.min(240, Math.max(12, box!.width / 3));
  const startY = box!.y + Math.max(2, box!.height / 2);
  await page.mouse.move(startX, startY);
  await page.mouse.down();
  await page.mouse.move(startX, startY + 80, { steps: 6 });
  await page.mouse.up();
}

async function readFirstGuidePosition(page: Page): Promise<number | null> {
  return page.evaluate((key) => {
    const raw = window.localStorage.getItem(key);
    if (!raw) return null;
    try {
      const prefs = JSON.parse(raw);
      const guides = Array.isArray(prefs?.referenceGuides) ? prefs.referenceGuides : [];
      const first = guides[0];
      return first && typeof first.position === 'number' ? first.position : null;
    } catch {
      return null;
    }
  }, PREFS_KEY);
}

async function readGuideCount(page: Page): Promise<number> {
  return page.evaluate((key) => {
    const raw = window.localStorage.getItem(key);
    if (!raw) return 0;
    try {
      const prefs = JSON.parse(raw);
      return Array.isArray(prefs?.referenceGuides) ? prefs.referenceGuides.length : 0;
    } catch {
      return 0;
    }
  }, PREFS_KEY);
}

test.describe('M28 editor rulers, guides, and grid snap', () => {
  test.setTimeout(90_000);

  test('shows rulers, toggles grid snap, changes grid size, and creates a custom guide', async ({ page }) => {
    await page.addInitScript((key) => window.localStorage.removeItem(key), PREFS_KEY);
    await openBuilder(page, '/ko/admin-builder');

    const canvas = page.getByRole('application', { name: 'Canvas editor' });
    await expect(canvas).toBeVisible();
    await expect(page.locator('[data-builder-ruler="top"]').first()).toBeVisible();
    await expect(page.locator('[data-builder-ruler="left"]').first()).toBeVisible();

    const gridButton = page.getByTitle(/Grid snap|그리드 스냅/);
    await expect(gridButton).toBeEnabled();
    await gridButton.click();
    await expect(gridButton).toHaveAttribute('aria-pressed', 'true');
    const grid = page.locator('[data-builder-grid="true"]').first();
    await expect(grid).toBeVisible();

    const gridSizeInput = page.getByLabel(/Grid size|그리드 크기/);
    await gridSizeInput.fill('32');
    await expect(grid).toHaveCSS('background-size', '32px 32px');
    await gridSizeInput.evaluate((element) => (element as HTMLInputElement).blur());

    await page.keyboard.press('Shift+G');
    await expect(page.locator('[data-builder-grid="true"]')).toHaveCount(0);
    await page.keyboard.press('Shift+G');
    await expect(page.locator('[data-builder-grid="true"]').first()).toBeVisible();

    const topRuler = page.locator('[data-builder-ruler="top"]').first();
    const box = await topRuler.boundingBox();
    expect(box).toBeTruthy();
    const startX = box!.x + Math.min(240, Math.max(12, box!.width / 3));
    const startY = box!.y + Math.max(2, box!.height / 2);
    // W217 (Wix parity): a guide is created by dragging FROM the ruler INTO the
    // canvas and releasing inside the stage. A bare click on the ruler now
    // cancels (no guide), so we perform a real pointer drag down into the stage.
    await page.mouse.move(startX, startY);
    await page.mouse.down();
    await page.mouse.move(startX, startY + 80, { steps: 6 });
    await page.mouse.up();
    await expect(page.locator('[data-builder-guide-axis="vertical"]').first()).toBeVisible();

    const prefs = await page.evaluate((key) => JSON.parse(window.localStorage.getItem(key) || '{}'), PREFS_KEY) as {
      pixelGrid?: { enabled?: boolean; size?: number };
      referenceGuides?: unknown[];
    };
    expect(prefs.pixelGrid?.enabled).toBe(true);
    expect(prefs.pixelGrid?.size).toBe(32);
    expect(prefs.referenceGuides?.length).toBeGreaterThan(0);
  });

  test('repositions an existing guide by dragging it within the stage (W217)', async ({ page }) => {
    await page.addInitScript((key) => window.localStorage.removeItem(key), PREFS_KEY);
    await openBuilder(page, '/ko/admin-builder');

    await expect(page.getByRole('application', { name: 'Canvas editor' })).toBeVisible();
    await expect(page.locator('[data-builder-ruler="top"]').first()).toBeVisible();

    await createVerticalGuideViaRuler(page);
    const guide = page.locator('[data-builder-guide-axis="vertical"]').first();
    await expect(guide).toBeVisible();

    const before = await readFirstGuidePosition(page);
    expect(before).not.toBeNull();

    const box = await guide.boundingBox();
    expect(box).toBeTruthy();
    const grabX = box!.x + box!.width / 2;
    const grabY = box!.y + box!.height / 2;

    // Drag the guide horizontally to a new spot and release inside the stage.
    await page.mouse.move(grabX, grabY);
    await page.mouse.down();
    await page.mouse.move(grabX + 96, grabY, { steps: 8 });
    await page.mouse.up();

    await expect.poll(async () => readFirstGuidePosition(page), { timeout: 10_000 }).not.toBe(before);
    await expect(page.locator('[data-builder-guide-id]')).toHaveCount(1);
  });

  test('deletes a guide when dragged back onto the top ruler (W217)', async ({ page }) => {
    await page.addInitScript((key) => window.localStorage.removeItem(key), PREFS_KEY);
    await openBuilder(page, '/ko/admin-builder');

    await expect(page.getByRole('application', { name: 'Canvas editor' })).toBeVisible();

    await createVerticalGuideViaRuler(page);
    const guide = page.locator('[data-builder-guide-axis="vertical"]').first();
    await expect(guide).toBeVisible();

    const topRuler = page.locator('[data-builder-ruler="top"]').first();
    const rulerBox = await topRuler.boundingBox();
    expect(rulerBox).toBeTruthy();

    const box = await guide.boundingBox();
    expect(box).toBeTruthy();
    const grabX = box!.x + box!.width / 2;
    const grabY = box!.y + box!.height / 2;
    const dropY = rulerBox!.y + rulerBox!.height / 2;

    // Drag the guide straight up into the top ruler and release → delete.
    await page.mouse.move(grabX, grabY);
    await page.mouse.down();
    await page.mouse.move(grabX, dropY, { steps: 10 });
    await page.mouse.up();

    await expect.poll(async () => readGuideCount(page), { timeout: 10_000 }).toBe(0);
    await expect(page.locator('[data-builder-guide-id]')).toHaveCount(0);
  });

  test('lets outline view hide media only when the extra preference is enabled', async ({ page }) => {
    await page.addInitScript((key) => window.localStorage.removeItem(key), PREFS_KEY);
    const token = Date.now().toString(36);
    const pageId = await createOutlinePrefsPage(page.request, token);

    await page.goto(`/ko/admin-builder?pageId=${encodeURIComponent(pageId)}&outlineToggle=${token}`, {
      waitUntil: 'domcontentloaded',
    });

    await expect(page.getByRole('application', { name: 'Canvas editor' })).toBeVisible();
    const image = page.locator(`[data-node-id="outline-image-${token}"] img`).first();
    await expect(image).toBeVisible();

    await page.locator('[data-builder-prefs-button]').click();
    const outlineToggle = page.getByLabel(/윤곽선 보기|Outline view/);
    const hideContentToggle = page.getByLabel(/콘텐츠 숨기기|Hide content/);
    await expect(hideContentToggle).toBeDisabled();

    await outlineToggle.check();
    await expect(hideContentToggle).toBeEnabled();
    await expect(hideContentToggle).not.toBeChecked();

    await hideContentToggle.check();
    await expect(page.locator('html')).toHaveAttribute('data-builder-outline', 'true');
    await expect(page.locator('html')).toHaveAttribute('data-builder-outline-hide-content', 'true');
    await expect(image).toBeHidden();

    await hideContentToggle.uncheck();
    await expect(page.locator('html')).toHaveAttribute('data-builder-outline-hide-content', 'false');
    await expect(image).toBeVisible();
  });
});

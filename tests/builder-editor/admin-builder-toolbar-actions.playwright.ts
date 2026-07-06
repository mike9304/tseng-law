import { expect, test, type APIRequestContext, type Page } from '@playwright/test';
import { openBuilder } from './helpers/editor';

type TextNodeInput = {
  readonly id: string;
  readonly text: string;
  readonly x: number;
  readonly y: number;
  readonly zIndex: number;
};

type PageCreateResponse = {
  readonly success?: boolean;
  readonly pageId?: string;
  readonly error?: string;
};

function mutationHeaders(scope: string): Record<string, string> {
  const safeScope = scope.replace(/[^a-z0-9-]/gi, '-').slice(-48) || 'toolbar-actions';
  return { 'x-forwarded-for': `pw-${safeScope}` };
}

function defaultNodeStyle() {
  return {
    backgroundColor: 'transparent',
    borderColor: '#cbd5e1',
    borderStyle: 'solid',
    borderWidth: 0,
    borderRadius: 8,
    shadowX: 0,
    shadowY: 0,
    shadowBlur: 0,
    shadowSpread: 0,
    shadowColor: 'rgba(15, 23, 42, 0.16)',
    opacity: 100,
  };
}

function textNode({ id, text, x, y, zIndex }: TextNodeInput) {
  return {
    id,
    kind: 'text',
    rect: { x, y, width: 260, height: 72 },
    style: defaultNodeStyle(),
    zIndex,
    rotation: 0,
    locked: false,
    visible: true,
    content: {
      text,
      fontSize: 26,
      color: '#0f172a',
      fontWeight: 'bold',
      align: 'left',
      lineHeight: 1.2,
      letterSpacing: 0,
      fontFamily: 'system-ui',
    },
  };
}

function createToolbarActionsDocument() {
  return {
    version: 1,
    locale: 'ko',
    updatedAt: new Date().toISOString(),
    updatedBy: 'playwright-toolbar-actions',
    stageWidth: 1280,
    stageHeight: 720,
    nodes: [
      textNode({ id: 'toolbar-alpha', text: 'Toolbar Alpha', x: 120, y: 120, zIndex: 0 }),
      textNode({ id: 'toolbar-beta', text: 'Toolbar Beta', x: 420, y: 120, zIndex: 1 }),
    ],
  };
}

async function createToolbarActionsPage(request: APIRequestContext, token: string): Promise<string> {
  const response = await request.post('/api/builder/site/pages', {
    data: {
      locale: 'ko',
      slug: `g-toolbar-actions-${token}`,
      title: `Toolbar Actions ${token}`,
      document: createToolbarActionsDocument(),
    },
    headers: mutationHeaders(token),
  });
  expect(response.status()).toBe(200);
  const payload = await response.json() as PageCreateResponse;
  expect(payload.success, payload.error).toBe(true);
  if (!payload.pageId) throw new Error(payload.error ?? 'Missing page id from toolbar actions page creation.');
  return payload.pageId;
}

async function getLayerZIndex(page: Page, nodeId: string): Promise<number> {
  const value = await page.locator(`[data-builder-layer-row="${nodeId}"]`).getAttribute('data-builder-layer-z');
  return value == null ? Number.NaN : Number(value);
}

test('/ko/admin-builder selection toolbar actions reorder, duplicate, and delete nodes', async ({ page }) => {
  test.setTimeout(60_000);
  const token = Date.now().toString(36);
  let pageId: string | null = null;

  try {
    pageId = await createToolbarActionsPage(page.request, token);
    await page.setViewportSize({ width: 1440, height: 950 });
    await openBuilder(page, `/ko/admin-builder?pageId=${encodeURIComponent(pageId)}&toolbarActions=${token}`);
    await page.locator('[data-builder-rail-item="layers"]').click();
    await expect(page.locator('[data-builder-layers-panel="true"]')).toBeVisible();

    const alpha = page.locator('[data-node-id="toolbar-alpha"]').first();
    const generatedTextNodes = page.locator('[data-node-id^="text-"]');
    await expect(alpha).toBeVisible();
    await alpha.click({ position: { x: 24, y: 24 }, force: true });
    await expect(alpha).toHaveAttribute('data-selected', 'true');

    const toolbar = page.getByRole('toolbar', { name: '요소 빠른 작업' });
    await expect(toolbar).toBeVisible();
    await expect(toolbar.getByRole('button', { name: '앞' })).toBeEnabled();
    await expect(toolbar.getByRole('button', { name: '뒤' })).toBeEnabled();

    await toolbar.getByRole('button', { name: '앞' }).click();
    await expect.poll(() => getLayerZIndex(page, 'toolbar-alpha')).toBeGreaterThan(
      await getLayerZIndex(page, 'toolbar-beta'),
    );

    await toolbar.getByRole('button', { name: '뒤' }).click();
    await expect.poll(() => getLayerZIndex(page, 'toolbar-alpha')).toBeLessThan(
      await getLayerZIndex(page, 'toolbar-beta'),
    );

    const duplicateCountBefore = await generatedTextNodes.count();
    await toolbar.getByRole('button', { name: '복제' }).click();
    await expect.poll(() => generatedTextNodes.count()).toBe(duplicateCountBefore + 1);
    await expect(page.locator('[data-node-id^="text-"][data-selected="true"]')).toHaveCount(1);

    await toolbar.getByRole('button', { name: '삭제' }).click();
    await expect.poll(() => generatedTextNodes.count()).toBe(duplicateCountBefore);
    await expect(page.locator('[data-node-id^="text-"][data-selected="true"]')).toHaveCount(0);
  } finally {
    if (pageId) {
      await page.request.delete(`/api/builder/site/pages/${pageId}?locale=ko`, {
        headers: mutationHeaders(token),
        failOnStatusCode: false,
      });
    }
  }
});

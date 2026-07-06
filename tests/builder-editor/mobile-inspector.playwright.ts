import { expect, test, type APIRequestContext, type Page } from '@playwright/test';
import {
  createDefaultCanvasNodeStyle,
  type BuilderCanvasDocument,
  type BuilderCanvasNode,
} from '@/lib/builder/canvas/types';
import { openBuilder } from './helpers/editor';

function mutationHeaders(scope: string): Record<string, string> {
  const safeScope = scope.replace(/[^a-z0-9-]/gi, '-').slice(-48) || 'mobile-inspector';
  return { 'x-forwarded-for': `pw-${safeScope}` };
}

function textNode(
  id: string,
  parentId: string,
  rect: BuilderCanvasNode['rect'],
  text: string,
  zIndex: number,
): BuilderCanvasNode {
  return {
    id,
    kind: 'text',
    parentId,
    rect,
    style: createDefaultCanvasNodeStyle(),
    zIndex,
    rotation: 0,
    locked: false,
    visible: true,
    content: {
      text,
      fontSize: 28,
      color: '#0f172a',
      fontWeight: 'bold',
      align: 'left',
      as: 'h2',
      lineHeight: 1.2,
      letterSpacing: 0,
    },
  };
}

function makeResponsiveResetDocument(token: string): BuilderCanvasDocument {
  const rootId = `root-${token}`;
  const now = new Date().toISOString();
  const first = textNode(
    `mobile-reset-title-${token}`,
    rootId,
    { x: 96, y: 88, width: 620, height: 80 },
    `Mobile reset title ${token}`,
    1,
  );
  const second = textNode(
    `mobile-reset-note-${token}`,
    rootId,
    { x: 96, y: 190, width: 520, height: 60 },
    `Mobile reset note ${token}`,
    2,
  );
  return {
    version: 1,
    locale: 'ko',
    updatedAt: now,
    updatedBy: `mobile-reset-${token}`,
    stageWidth: 1280,
    stageHeight: 640,
    nodes: [
      {
        id: rootId,
        kind: 'container',
        rect: { x: 0, y: 0, width: 1280, height: 640 },
        style: createDefaultCanvasNodeStyle(),
        zIndex: 0,
        rotation: 0,
        locked: false,
        visible: true,
        content: {
          label: 'Mobile reset root',
          background: '#ffffff',
          borderColor: 'transparent',
          borderStyle: 'solid',
          borderWidth: 0,
          borderRadius: 0,
          padding: 0,
          layoutMode: 'absolute',
          as: 'main',
        },
      },
      {
        ...first,
        responsive: {
          tablet: { rect: { width: 560 } },
          mobile: { rect: { x: 24, width: 300 }, fontSize: 20 },
        },
      },
      {
        ...second,
        responsive: {
          mobile: { hidden: true },
        },
      },
    ],
  };
}

async function createBuilderPage(
  request: APIRequestContext,
  slug: string,
  title: string,
  document: BuilderCanvasDocument,
): Promise<string> {
  const response = await request.post('/api/builder/site/pages', {
    data: { locale: 'ko', slug, title, document },
    headers: mutationHeaders(slug),
  });
  expect(response.status()).toBe(200);
  const payload: { success?: boolean; pageId?: string; error?: string } = await response.json();
  expect(payload.success, payload.error).toBe(true);
  const pageId = payload.pageId;
  if (!pageId) throw new Error('page_id_missing');
  return pageId;
}

async function draftNodes(page: Page, pageId: string): Promise<BuilderCanvasNode[]> {
  const response = await page.request.get(`/api/builder/site/pages/${encodeURIComponent(pageId)}/draft?locale=ko`);
  expect(response.status()).toBe(200);
  const payload: { document?: { nodes?: BuilderCanvasNode[] } } = await response.json();
  return payload.document?.nodes ?? [];
}

async function selectLayerNode(page: Page, nodeId: string, kind: string): Promise<void> {
  await page.getByRole('button', { name: /^Layers$|^레이어$/ }).click({ force: true });
  const drawer = page.locator('aside[aria-hidden="false"]').filter({ hasText: /Layers|레이어/ }).first();
  await expect(drawer.getByText(/Layers|레이어/).first()).toBeVisible();
  await drawer.locator('[data-builder-layer-search="true"]').fill(nodeId);
  const row = drawer.locator(`[data-builder-layer-row="${nodeId}"]`).first();
  await expect(row).toBeVisible({ timeout: 10_000 });
  await row.click();
  await expect(page.locator(`[data-node-id="${nodeId}"][class*="nodeSelected"]`).first()).toBeVisible({
    timeout: 10_000,
  });
}

test.describe('/ko/admin-builder mobile inspector overrides', () => {
  test('syncs inspector viewport controls with top bar and creates removable overrides', async ({ page }) => {
    await openBuilder(page, `/ko/admin-builder?mobileInspector=${Date.now().toString(36)}`);
    await selectLayerNode(page, 'home-services-title', 'text');

    await page.locator('[data-builder-inspector-panel="true"]').getByRole('button', { name: /^layout$|^레이아웃$/ }).click();
    const viewportControl = page.locator('[data-builder-mobile-inspector-viewport="true"]').first();
    await expect(viewportControl).toBeVisible();

    await viewportControl.locator('[data-builder-inspector-viewport-option="mobile"]').click();
    await expect(page.locator('[data-builder-topbar-viewport="mobile"]')).toHaveAttribute('aria-pressed', 'true');
    await expect(viewportControl).toHaveAttribute('data-builder-viewport-override-state', 'created');
    await expect(page.locator('[data-builder-viewport-override-banner="created"]').first()).toContainText(/Override created|오버라이드 생성됨/);

    const widthInput = page.getByLabel(/Width value|너비 값/).first();
    const originalWidth = Number(await widthInput.inputValue());
    await widthInput.fill(String(Math.max(160, originalWidth - 24)));
    await widthInput.blur();
    await expect(viewportControl).toHaveAttribute('data-builder-viewport-override-state', 'created');
    await expect(page.locator('[data-builder-viewport-override-banner="created"]').first()).toContainText(/Override created|오버라이드 생성됨/);

    const fontSizeInput = page.getByLabel(/Font size value|글자 크기 값/).first();
    await expect(fontSizeInput).toBeVisible();
    await fontSizeInput.fill('24');
    await fontSizeInput.blur();
    await expect(page.locator('[data-builder-viewport-override-banner="created"]').first()).toBeVisible();

    await page.getByRole('button', { name: /(?:Mobile|모바일)에서 보임/ }).click();
    await expect(page.locator('[data-builder-viewport-hidden-override="true"]').first()).toBeVisible();

    await page.getByRole('button', { name: /Reset mobile|모바일 초기화/ }).click();
    await expect(viewportControl).toHaveAttribute('data-builder-viewport-override-state', 'inherited');
    await expect(page.locator('[data-builder-viewport-override-banner="inherited"]').first()).toBeVisible();

    await viewportControl.locator('[data-builder-inspector-viewport-option="tablet"]').click();
    await expect(page.locator('[data-builder-topbar-viewport="tablet"]')).toHaveAttribute('aria-pressed', 'true');
  });

  test('resets every mobile override from the top bar page reset', async ({ page }) => {
    const token = Date.now().toString(36);
    const slug = `g-editor-mobile-reset-${token}`;
    let pageId: string | null = null;

    try {
      pageId = await createBuilderPage(
        page.request,
        slug,
        `Mobile reset ${token}`,
        makeResponsiveResetDocument(token),
      );
      await openBuilder(page, `/ko/admin-builder?pageId=${encodeURIComponent(pageId)}&mobilePageReset=${token}`);

      await page.locator('[data-builder-topbar-viewport="mobile"]').click();
      await expect(page.locator('[data-builder-topbar-viewport="mobile"]')).toHaveAttribute('aria-pressed', 'true');

      const resetButton = page.locator('[data-builder-page-reset="mobile"]').first();
      await expect(resetButton).toBeVisible();
      await expect(resetButton.getByText(/페이지|Page/)).toBeVisible();
      const saveResponse = page.waitForResponse((response) => (
        response.url().includes(`/api/builder/site/pages/${pageId}/draft`)
        && response.request().method() === 'PUT'
        && response.status() === 200
      ));
      await resetButton.click();
      await saveResponse;

      await expect(resetButton).toBeHidden();
      const nodes = await draftNodes(page, pageId);
      const first = nodes.find((node) => node.id === `mobile-reset-title-${token}`);
      const second = nodes.find((node) => node.id === `mobile-reset-note-${token}`);
      expect(first?.responsive).toEqual({
        tablet: { rect: { width: 560 } },
      });
      expect(second?.responsive).toBeUndefined();
    } finally {
      if (pageId) {
        await page.request.delete(`/api/builder/site/pages/${encodeURIComponent(pageId)}?locale=ko`, {
          headers: mutationHeaders(slug),
        });
      }
    }
  });
});

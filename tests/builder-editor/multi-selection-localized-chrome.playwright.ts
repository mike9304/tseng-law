import { expect, test, type APIRequestContext } from '@playwright/test';
import { z } from 'zod';
import { openBuilder } from './helpers/editor';

const SCREENSHOT_PATH = '/tmp/tseng-law-multi-selection-localized-chrome.png';
const multiSelectModifier = process.platform === 'darwin' ? 'Meta' : 'Control';

const createPageResponseSchema = z.object({
  error: z.string().optional(),
  pageId: z.string().optional(),
  success: z.boolean().optional(),
});

function mutationHeaders(scope: string): Record<string, string> {
  const safeScope = scope.replace(/[^a-z0-9-]/gi, '-').slice(-48) || 'multi-selection-localized';
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

function createLocalizedSelectionDocument(token: string) {
  return {
    version: 1,
    locale: 'ko',
    updatedAt: new Date().toISOString(),
    updatedBy: 'playwright-multi-selection-localized-chrome',
    stageWidth: 1280,
    stageHeight: 720,
    nodes: [
      {
        id: 'multi-title',
        kind: 'text',
        rect: { x: 128, y: 120, width: 360, height: 88 },
        style: defaultNodeStyle(),
        zIndex: 1,
        rotation: 0,
        locked: false,
        visible: true,
        content: {
          text: `다중 선택 제목 ${token}`,
          fontSize: 34,
          color: '#0f172a',
          fontWeight: 'bold',
          align: 'left',
          lineHeight: 1.18,
          letterSpacing: 0,
          fontFamily: 'system-ui',
        },
      },
      {
        id: 'multi-subtitle',
        kind: 'text',
        rect: { x: 560, y: 244, width: 420, height: 72 },
        style: defaultNodeStyle(),
        zIndex: 2,
        rotation: 0,
        locked: false,
        visible: true,
        content: {
          text: '선택 배지와 툴바 요약은 한국어로 표시되어야 합니다.',
          fontSize: 20,
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

async function createBuilderPage(request: APIRequestContext, token: string): Promise<string> {
  const response = await request.post('/api/builder/site/pages', {
    data: {
      locale: 'ko',
      slug: `multi-selection-localized-${token}`,
      title: `Multi Selection Localized ${token}`,
      document: createLocalizedSelectionDocument(token),
    },
    headers: mutationHeaders(token),
  });
  expect(response.status()).toBe(200);
  const payload = createPageResponseSchema.parse(await response.json());
  expect(payload.success, payload.error).toBe(true);
  if (!payload.pageId) throw new Error('page_id_missing');
  return payload.pageId;
}

test('/ko/admin-builder localizes multi-selection canvas chrome', async ({ page }) => {
  const token = Date.now().toString(36);
  let pageId: string | null = null;

  try {
    pageId = await createBuilderPage(page.request, token);
    await openBuilder(page, `/ko/admin-builder?pageId=${encodeURIComponent(pageId)}&multiSelectionLocalized=${token}`);

    await page.locator('[data-node-id="multi-title"]').click({ position: { x: 24, y: 24 }, force: true });
    await page.locator('[data-node-id="multi-subtitle"]').click({
      force: true,
      modifiers: [multiSelectModifier],
      position: { x: 24, y: 24 },
    });

    await expect(page.locator('[data-node-id][data-selected="true"]')).toHaveCount(2);
    const toolbar = page.getByRole('toolbar', { name: '요소 빠른 작업' });
    const toolbarSummary = page.locator('[data-builder-selection-toolbar-summary="true"]').first();
    const bboxBadge = page.locator('[data-builder-multi-selection-badge="true"]').first();

    await expect(toolbar).toBeVisible();
    await expect(toolbarSummary).toHaveText('2개 선택됨');
    await expect(toolbarSummary).not.toContainText('2 items');
    await expect(toolbarSummary).not.toContainText('2 selected');
    await expect(bboxBadge).toBeVisible();
    await expect(bboxBadge).toContainText(/^2개 선택됨 ·/);
    await expect(bboxBadge).not.toContainText('2 items');
    await expect(bboxBadge).not.toContainText('2 selected');

    await page.screenshot({ path: SCREENSHOT_PATH });
  } finally {
    if (pageId) {
      await page.request.delete(`/api/builder/site/pages/${encodeURIComponent(pageId)}?locale=ko`, {
        failOnStatusCode: false,
        headers: mutationHeaders(token),
      });
    }
  }
});

import { expect, test, type APIRequestContext, type Page } from '@playwright/test';
import { z } from 'zod';
import { openBuilder } from './helpers/editor';

const SCREENSHOT_PATH = '/tmp/tseng-law-multi-selection-layout-actions.png';
const multiSelectModifier: 'Meta' | 'Control' = process.platform === 'darwin' ? 'Meta' : 'Control';
const targetNodeIds = ['multi-alpha', 'multi-beta', 'multi-gamma'] as const;

type TargetNodeId = typeof targetNodeIds[number];

const rectSchema = z.object({
  x: z.number(),
  y: z.number(),
  width: z.number(),
  height: z.number(),
});

type Rect = z.infer<typeof rectSchema>;

const createPageResponseSchema = z.object({
  error: z.string().optional(),
  pageId: z.string().optional(),
  success: z.boolean().optional(),
});

const draftResponseSchema = z.object({
  document: z.object({
    nodes: z.array(z.object({
      id: z.string(),
      rect: rectSchema,
    })),
  }),
});

function mutationHeaders(scope: string): Record<string, string> {
  const safeScope = scope.replace(/[^a-z0-9-]/gi, '-').slice(-48) || 'multi-selection-layout';
  return { 'x-forwarded-for': `pw-${safeScope}` };
}

function defaultNodeStyle() {
  return {
    backgroundColor: 'transparent',
    borderColor: '#cbd5e1',
    borderStyle: 'solid',
    borderWidth: 0,
    borderRadius: 12,
    shadowX: 0,
    shadowY: 0,
    shadowBlur: 0,
    shadowSpread: 0,
    shadowColor: 'rgba(15, 23, 42, 0.16)',
    opacity: 100,
  };
}

function createLayoutActionsDocument(token: string) {
  return {
    version: 1,
    locale: 'ko',
    updatedAt: new Date().toISOString(),
    updatedBy: 'playwright-multi-selection-layout-actions',
    stageWidth: 1280,
    stageHeight: 720,
    nodes: [
      {
        id: 'multi-alpha',
        label: `다중 선택 알파 ${token}`,
        rect: { x: 120, y: 140, width: 120, height: 40 },
      },
      {
        id: 'multi-beta',
        label: '다중 선택 베타',
        rect: { x: 360, y: 220, width: 160, height: 64 },
      },
      {
        id: 'multi-gamma',
        label: '다중 선택 감마',
        rect: { x: 720, y: 180, width: 140, height: 52 },
      },
    ].map((node, index) => ({
      id: node.id,
      kind: 'text',
      rect: node.rect,
      style: defaultNodeStyle(),
      zIndex: index + 1,
      rotation: 0,
      locked: false,
      visible: true,
      content: {
        text: node.label,
        fontSize: 22,
        color: '#0f172a',
        fontWeight: 'bold',
        align: 'left',
        lineHeight: 1.2,
        letterSpacing: 0,
        fontFamily: 'system-ui',
      },
    })),
  };
}

async function createBuilderPage(request: APIRequestContext, token: string): Promise<string> {
  const response = await request.post('/api/builder/site/pages', {
    data: {
      locale: 'ko',
      slug: `multi-selection-layout-${token}`,
      title: `Multi Selection Layout ${token}`,
      document: createLayoutActionsDocument(token),
    },
    headers: mutationHeaders(token),
  });
  expect(response.status()).toBe(200);
  const payload = createPageResponseSchema.parse(await response.json());
  expect(payload.success, payload.error).toBe(true);
  if (!payload.pageId) throw new Error('page_id_missing');
  return payload.pageId;
}

async function readTargetRects(request: APIRequestContext, pageId: string): Promise<Record<TargetNodeId, Rect>> {
  const response = await request.get(`/api/builder/site/pages/${encodeURIComponent(pageId)}/draft?locale=ko`);
  expect(response.status()).toBe(200);
  const payload = draftResponseSchema.parse(await response.json());
  const alpha = payload.document.nodes.find((node) => node.id === 'multi-alpha');
  const beta = payload.document.nodes.find((node) => node.id === 'multi-beta');
  const gamma = payload.document.nodes.find((node) => node.id === 'multi-gamma');
  if (!alpha || !beta || !gamma) throw new Error('target_nodes_missing');
  return {
    'multi-alpha': alpha.rect,
    'multi-beta': beta.rect,
    'multi-gamma': gamma.rect,
  };
}

async function expectDraftAxis(
  request: APIRequestContext,
  pageId: string,
  axis: keyof Rect,
  expected: readonly number[],
): Promise<void> {
  await expect.poll(
    async () => {
      const rects = await readTargetRects(request, pageId);
      return targetNodeIds.map((id) => rects[id][axis]);
    },
    { intervals: [250, 500, 1000], timeout: 20_000 },
  ).toEqual(expected);
}

async function selectTargetNodes(page: Page): Promise<void> {
  await page.locator('[data-node-id="multi-alpha"]').click({ force: true, position: { x: 16, y: 16 } });
  await page.locator('[data-node-id="multi-beta"]').click({
    force: true,
    modifiers: [multiSelectModifier],
    position: { x: 16, y: 16 },
  });
  await page.locator('[data-node-id="multi-gamma"]').click({
    force: true,
    modifiers: [multiSelectModifier],
    position: { x: 16, y: 16 },
  });
  await expect(page.locator('[data-node-id][data-selected="true"]')).toHaveCount(3);
}

test('/ko/admin-builder persists multi-selection layout actions', async ({ page }) => {
  test.setTimeout(90_000);

  const token = Date.now().toString(36);
  let pageId: string | null = null;

  try {
    pageId = await createBuilderPage(page.request, token);
    await openBuilder(page, `/ko/admin-builder?pageId=${encodeURIComponent(pageId)}&multiSelectionLayout=${token}`);

    await expectDraftAxis(page.request, pageId, 'y', [140, 220, 180]);
    await expectDraftAxis(page.request, pageId, 'height', [40, 64, 52]);
    await expectDraftAxis(page.request, pageId, 'x', [120, 360, 720]);

    await selectTargetNodes(page);
    await expect(page.locator('[data-builder-selection-toolbar-summary="true"]').first()).toHaveText('3개 선택됨');

    await page.locator('[data-builder-align-action="top"]').click();
    await expectDraftAxis(page.request, pageId, 'y', [140, 140, 140]);

    await page.locator('[data-builder-match-size-action="height"]').click();
    await expectDraftAxis(page.request, pageId, 'height', [64, 64, 64]);

    await page.locator('[data-builder-distribute-action="horizontal"]').click();
    await expectDraftAxis(page.request, pageId, 'x', [120, 400, 720]);

    await page.screenshot({ path: SCREENSHOT_PATH });

    await openBuilder(page, `/ko/admin-builder?pageId=${encodeURIComponent(pageId)}&multiSelectionLayoutReload=${token}`);
    await selectTargetNodes(page);
    await expect(page.locator('[data-builder-selection-toolbar-summary="true"]').first()).toHaveText('3개 선택됨');
    await expectDraftAxis(page.request, pageId, 'y', [140, 140, 140]);
    await expectDraftAxis(page.request, pageId, 'height', [64, 64, 64]);
    await expectDraftAxis(page.request, pageId, 'x', [120, 400, 720]);
  } finally {
    if (pageId) {
      await page.request.delete(`/api/builder/site/pages/${encodeURIComponent(pageId)}?locale=ko`, {
        failOnStatusCode: false,
        headers: mutationHeaders(token),
      });
    }
  }
});

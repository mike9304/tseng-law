import { expect, test, type APIRequestContext } from '@playwright/test';
import { serviceAreas } from '@/data/service-details';
import { openBuilder, openCatalogDrawer } from '../helpers/editor';
import {
  createRepeaterLoadingPage,
  currentDraftRevision,
  deleteRepeaterLoadingPage,
  mutationHeaders,
  putDraftDocument,
  selectLayerNode,
} from '../helpers/repeater-canvas-loading';
import type { RepeaterLoadingDocument } from '../helpers/repeater-canvas-loading-document';

const PREFS_KEY = 'tw_builder_editor_prefs_v1';
const ENTRY_ID = 'replace-remap-insights-entry';
const baseStyle = {
  backgroundColor: 'transparent',
  borderColor: '#cbd5e1',
  borderStyle: 'solid',
  borderWidth: 0,
  borderRadius: 0,
  shadowX: 0,
  shadowY: 0,
  shadowBlur: 0,
  shadowSpread: 0,
  shadowColor: 'rgba(15, 23, 42, 0.16)',
  opacity: 100,
} as const;

type StoredComponentLibraryEntry = {
  readonly id: string;
  readonly name: string;
  readonly nodeJson: string;
  readonly createdAt: string;
};
const defaultNodeState = { rotation: 0, locked: false, visible: true } as const;

function containerContent(
  label: string,
  background: string,
  borderColor: string,
  borderWidth: number,
  borderRadius: number,
  padding: number,
  layoutMode: 'absolute' | 'repeater',
) {
  return { label, background, borderColor, borderStyle: 'solid', borderWidth, borderRadius, padding, layoutMode };
}
function textContent(text: string, color: string) {
  return {
    text,
    fontSize: 18,
    color,
    fontWeight: 'bold',
    align: 'left',
    lineHeight: 1.25,
    letterSpacing: 0,
  };
}

function makeReplaceRemapDocument(token: string): RepeaterLoadingDocument {
  const rootId = `replace-remap-root-${token}`;
  const repeaterId = `replace-remap-services-${token}`;
  const targetGroupId = `replace-remap-target-group-${token}`;
  const targetTextId = `replace-remap-target-text-${token}`;
  return {
    version: 1,
    locale: 'ko',
    updatedAt: new Date().toISOString(),
    updatedBy: `replace-remap-${token}`,
    stageWidth: 1280,
    stageHeight: 720,
    nodes: [
      {
        id: rootId,
        kind: 'container',
        rect: { x: 0, y: 0, width: 1280, height: 720 },
        style: baseStyle,
        zIndex: 1,
        ...defaultNodeState,
        content: containerContent('Root', '#f8fafc', '#e5e7eb', 0, 0, 56, 'absolute'),
      },
      {
        id: repeaterId,
        kind: 'container',
        parentId: rootId,
        rect: { x: 72, y: 84, width: 760, height: 360 },
        style: { ...baseStyle, borderRadius: 18 },
        zIndex: 2,
        ...defaultNodeState,
        content: containerContent('Services repeater', '#ffffff', '#d1d5db', 1, 18, 20, 'repeater'),
        dataBinding: {
          targetId: 'home.services.list',
          recordIndex: 0,
          fields: { title: 'title' },
        },
      },
      {
        id: targetGroupId,
        kind: 'container',
        parentId: repeaterId,
        rect: { x: 0, y: 0, width: 286, height: 148 },
        style: { ...baseStyle, backgroundColor: '#eff6ff', borderColor: '#93c5fd', borderWidth: 1, borderRadius: 14 },
        zIndex: 3,
        ...defaultNodeState,
        content: containerContent('Current services group', '#eff6ff', '#93c5fd', 1, 14, 14, 'absolute'),
      },
      {
        id: targetTextId,
        kind: 'text',
        parentId: targetGroupId,
        rect: { x: 16, y: 18, width: 234, height: 92 },
        style: baseStyle,
        zIndex: 4,
        ...defaultNodeState,
        content: textContent('Target description placeholder', '#1d4ed8'),
        dataBinding: {
          targetId: 'home.services.list',
          recordIndex: 0,
          fields: { text: 'description' },
        },
      },
    ],
  };
}
function makeSavedInsightsEntry(): StoredComponentLibraryEntry {
  const nodeJson = JSON.stringify({
    rootNodeId: 'saved-insights-group',
    nodes: [
      {
        id: 'saved-insights-group',
        kind: 'container',
        rect: { x: 0, y: 0, width: 280, height: 140 },
        style: { ...baseStyle, backgroundColor: '#fff7ed', borderColor: '#fdba74', borderWidth: 1, borderRadius: 14 },
        zIndex: 1,
        ...defaultNodeState,
        content: containerContent('Saved insights group', '#fff7ed', '#fdba74', 1, 14, 14, 'absolute'),
      },
      {
        id: 'saved-insights-read-time',
        kind: 'text',
        parentId: 'saved-insights-group',
        rect: { x: 16, y: 18, width: 230, height: 88 },
        style: baseStyle,
        zIndex: 2,
        ...defaultNodeState,
        content: textContent('Saved read-time field', '#9a3412'),
        dataBinding: {
          targetId: 'home.insights.feed',
          recordIndex: 0,
          fields: { text: 'readTime' },
        },
      },
    ],
  });
  return {
    id: ENTRY_ID,
    name: 'Insights read-time group',
    nodeJson,
    createdAt: '2026-06-30T00:00:00.000Z',
  };
}

async function draftDocumentText(request: APIRequestContext, pageId: string): Promise<string> {
  const response = await request.get(`/api/builder/site/pages/${encodeURIComponent(pageId)}/draft?locale=ko`, {
    headers: mutationHeaders(pageId),
    failOnStatusCode: false,
  });
  if (response.status() !== 200) return '';
  const payload = await response.json() as { readonly document?: unknown };
  return JSON.stringify(payload.document ?? null);
}

test('/ko/admin-builder reviews field remaps before replacing a selected repeater group', async ({ page }) => {
  test.setTimeout(100_000);

  const token = Date.now().toString(36);
  const slug = `component-replace-remap-${token}`;
  const repeaterId = `replace-remap-services-${token}`;
  const targetGroupId = `replace-remap-target-group-${token}`;
  const targetTextId = `replace-remap-target-text-${token}`;
  const expectedDetails = serviceAreas[0]?.keyPoints.ko[0] ?? '';
  let pageId: string | null = null;

  await page.addInitScript(({ key, entry }: { readonly key: string; readonly entry: StoredComponentLibraryEntry }) => {
    window.localStorage.setItem(key, JSON.stringify({ componentLibrary: [entry] }));
  }, { key: PREFS_KEY, entry: makeSavedInsightsEntry() });
  await page.setExtraHTTPHeaders(mutationHeaders(slug));

  try {
    pageId = await createRepeaterLoadingPage(page.request, slug, token);
    const revision = await currentDraftRevision(page.request, pageId, slug);
    await putDraftDocument(page.request, pageId, revision, makeReplaceRemapDocument(token), slug);

    await openBuilder(page, `/ko/admin-builder?pageId=${encodeURIComponent(pageId)}&replaceRemap=${token}`);
    await selectLayerNode(page, targetGroupId);

    const targetGroup = page.locator(`[data-node-id="${targetGroupId}"]`).first();
    const repeaterNode = page.locator(`[data-node-id="${repeaterId}"]`).first();
    await expect(targetGroup).toHaveAttribute('data-selected', 'true');
    await expect(repeaterNode).toBeVisible();

    const drawer = await openCatalogDrawer(page);
    await drawer.locator('[data-builder-component-library-shortcut-open="true"]').click();

    const componentLibrary = drawer.locator('[data-builder-component-library="true"]');
    await expect(componentLibrary).toBeVisible();
    await expect(componentLibrary.getByText('Insights read-time group')).toBeVisible();

    const replaceButton = componentLibrary.locator(`[data-builder-component-library-replace="${ENTRY_ID}"]`);
    await expect(replaceButton).toBeEnabled();
    await replaceButton.click();

    const review = componentLibrary.locator('[data-builder-component-library-remap-review="true"]');
    await expect(review).toBeVisible();
    await expect(review).toHaveAttribute('data-builder-component-library-remap-review-target', 'home.services.list');
    await expect(targetGroup).toHaveAttribute('data-selected', 'true');
    await expect(page.locator(`[data-node-id="${targetTextId}"]`)).toContainText('한국 기업의 대만 진출');

    const fieldRow = review.locator(
      '[data-builder-component-library-remap-review-field="text"][data-builder-component-library-remap-review-source-field="readTime"]',
    );
    await expect(fieldRow).toBeVisible();
    await expect(fieldRow).toContainText('Read time');
    const fieldSelect = fieldRow.locator('[data-builder-component-library-remap-review-select="true"]');
    await expect(fieldSelect).toHaveValue('description');
    await fieldSelect.selectOption('details');
    await expect(fieldSelect).toHaveValue('details');
    await review.screenshot({ path: '/tmp/tseng-law-component-library-replace-remap-review.png' });

    await review.locator('[data-builder-component-library-remap-review-confirm="true"]').click();
    await expect(review).toHaveCount(0);
    await expect(page.locator(`[data-node-id="${targetGroupId}"]`)).toHaveCount(0);
    await expect(page.locator(`[data-node-id="${targetTextId}"]`)).toHaveCount(0);
    await expect(page.locator('[data-node-id^="text-lib-"]').filter({ hasText: expectedDetails })).toBeVisible();

    await expect.poll(async () => draftDocumentText(page.request, pageId!), { timeout: 30_000 }).toContain('"text":"details"');
    const finalDraft = await draftDocumentText(page.request, pageId);
    expect(finalDraft).toContain('"targetId":"home.services.list"');
    expect(finalDraft).toContain('"text":"details"');
    expect(finalDraft).not.toContain(targetGroupId);
    expect(finalDraft).not.toContain(targetTextId);
    await page.screenshot({ path: '/tmp/tseng-law-component-library-replace-remap-page.png', fullPage: true });
  } finally {
    if (pageId) await deleteRepeaterLoadingPage(page.request, pageId, slug);
  }
});

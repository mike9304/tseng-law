import { expect, test } from '@playwright/test';
import { openBuilder, openCatalogDrawer } from './helpers/editor';
import {
  createRepeaterLoadingPage,
  currentDraftRevision,
  deleteRepeaterLoadingPage,
  mutationHeaders,
  putDraftDocument,
  selectLayerNode,
} from './helpers/repeater-canvas-loading';
import { makeRepeaterFieldChipDocument } from './helpers/repeater-field-chip-document';

const PREFS_KEY = 'tw_builder_editor_prefs_v1';

test('/ko/admin-builder saves and reinserts a repeater template field group from component library', async ({ page }) => {
  test.setTimeout(100_000);

  await page.addInitScript((key) => {
    window.localStorage.setItem(key, JSON.stringify({ componentLibrary: [] }));
  }, PREFS_KEY);

  const token = Date.now().toString(36);
  const slug = `repeater-group-library-${token}`;
  const repeaterId = `repeater-chip-${token}`;
  const titleId = `repeater-chip-title-${token}`;
  const buttonId = `repeater-chip-button-${token}`;
  let pageId: string | null = null;
  await page.setExtraHTTPHeaders(mutationHeaders(slug));

  try {
    pageId = await createRepeaterLoadingPage(page.request, slug, token);
    const revision = await currentDraftRevision(page.request, pageId, slug);
    await putDraftDocument(page.request, pageId, revision, makeRepeaterFieldChipDocument(token), slug);

    await openBuilder(page, `/ko/admin-builder?pageId=${encodeURIComponent(pageId)}&repeaterGroupLibrary=${token}`);
    await selectLayerNode(page, repeaterId);

    const repeaterNode = page.locator(`[data-node-id="${repeaterId}"]`).first();
    const fieldSummary = repeaterNode
      .locator('[data-builder-repeater-template-field-summary="true"]')
      .first();
    await expect(fieldSummary).toBeVisible();
    await fieldSummary.locator(`[data-builder-repeater-template-field-node-id="${buttonId}"]`).click();

    const selectedButton = page.locator(`[data-node-id="${buttonId}"]`).first();
    await expect(selectedButton).toHaveAttribute('data-selected', 'true');
    await selectedButton
      .locator('[data-builder-repeater-template-child-group-siblings="true"]')
      .first()
      .click();

    const originalGroup = repeaterNode
      .locator('[data-node-id^="group-"][data-selected="true"]')
      .first();
    await expect(originalGroup).toBeVisible();
    const originalGroupId = await originalGroup.getAttribute('data-node-id');
    if (!originalGroupId) throw new Error('Expected original template group id.');
    await expect(originalGroup.locator(`[data-node-id="${titleId}"]`)).toBeVisible();
    await expect(originalGroup.locator(`[data-node-id="${buttonId}"]`)).toBeVisible();

    const drawer = await openCatalogDrawer(page);
    const componentLibraryShortcut = drawer.locator('[data-builder-component-library-shortcut="true"]');
    await expect(componentLibraryShortcut).toContainText('저장된 컴포넌트 0개를 바로 열기');
    await componentLibraryShortcut.locator('[data-builder-component-library-shortcut-open="true"]').click();

    const componentLibrary = drawer.locator('[data-builder-component-library="true"]');
    await expect(componentLibrary).toBeVisible();
    await componentLibrary.locator('[data-builder-component-library-name="true"]').fill('Case field group reuse');
    await componentLibrary.locator('[data-builder-component-library-save="true"]').click();
    await expect(componentLibrary.getByText('Case field group reuse')).toBeVisible();
    await expect(componentLibrary.getByText('템플릿 그룹 · 3개 요소')).toBeVisible();

    await componentLibraryShortcut.scrollIntoViewIfNeeded();
    const quickInsert = componentLibraryShortcut
      .locator('[data-builder-component-library-shortcut-insert]')
      .first();
    await expect(quickInsert).toHaveAttribute('aria-label', '"Case field group reuse" 바로 삽입');
    await quickInsert.click();

    const selectedReusableGroup = repeaterNode
      .locator('[data-selected="true"]:has([data-builder-repeater-template-child-duplicate-group="true"])')
      .first();
    await expect(selectedReusableGroup).toBeVisible();
    const reusableGroupId = await selectedReusableGroup.getAttribute('data-node-id');
    if (!reusableGroupId) throw new Error('Expected reusable template group id.');

    expect(reusableGroupId).not.toBe(originalGroupId);
    await expect(repeaterNode.locator(`[data-node-id="${originalGroupId}"]`)).toHaveCount(1);
    await expect(repeaterNode.locator(`[data-node-id="${reusableGroupId}"]`)).toHaveCount(1);
    await expect(selectedReusableGroup.locator('[data-builder-repeater-template-child-field-active="true"]')).toHaveCount(2);
    await selectedReusableGroup
      .locator('[data-builder-repeater-template-child-controls="true"]')
      .first()
      .screenshot({ path: '/tmp/tseng-law-repeater-template-group-component-library-controls.png' });
    await selectedReusableGroup.screenshot({ path: '/tmp/tseng-law-repeater-template-group-component-library-node.png' });
    await page.screenshot({ path: '/tmp/tseng-law-repeater-template-group-component-library-page.png' });
  } finally {
    if (pageId) {
      await deleteRepeaterLoadingPage(page.request, pageId, slug);
    }
  }
});

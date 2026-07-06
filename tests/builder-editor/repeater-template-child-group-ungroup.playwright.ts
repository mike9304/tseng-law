import { expect, test } from '@playwright/test';
import { openBuilder } from './helpers/editor';
import {
  createRepeaterLoadingPage,
  currentDraftRevision,
  deleteRepeaterLoadingPage,
  mutationHeaders,
  putDraftDocument,
  selectLayerNode,
} from './helpers/repeater-canvas-loading';
import { makeRepeaterFieldChipDocument } from './helpers/repeater-field-chip-document';

test('/ko/admin-builder ungroups a selected repeater template field group from its child badge', async ({ page }) => {
  test.setTimeout(90_000);

  const token = Date.now().toString(36);
  const slug = `repeater-ungroup-${token}`;
  const repeaterId = `repeater-chip-${token}`;
  const titleId = `repeater-chip-title-${token}`;
  const buttonId = `repeater-chip-button-${token}`;
  let pageId: string | null = null;
  await page.setExtraHTTPHeaders(mutationHeaders(slug));

  try {
    pageId = await createRepeaterLoadingPage(page.request, slug, token);
    const revision = await currentDraftRevision(page.request, pageId, slug);
    await putDraftDocument(page.request, pageId, revision, makeRepeaterFieldChipDocument(token), slug);

    await openBuilder(page, `/ko/admin-builder?pageId=${encodeURIComponent(pageId)}&repeaterUngroup=${token}`);
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

    const selectedGroup = page.locator('[data-node-id^="group-"][data-selected="true"]').first();
    await expect(selectedGroup).toBeVisible();
    const selectedGroupNodeId = await selectedGroup.getAttribute('data-node-id');
    if (!selectedGroupNodeId) {
      throw new Error('Expected the selected template group to expose a node id.');
    }
    await expect(selectedGroup.locator(`[data-node-id="${titleId}"]`)).toBeVisible();
    await expect(selectedGroup.locator(`[data-node-id="${buttonId}"]`)).toBeVisible();

    const ungroupButton = selectedGroup
      .locator('[data-builder-repeater-template-child-ungroup="true"]')
      .first();
    await expect(ungroupButton).toBeVisible();
    await ungroupButton.click();

    await expect(page.locator(`[data-node-id="${selectedGroupNodeId}"]`)).toHaveCount(0);
    await expect(page.locator(`[data-node-id="${titleId}"]`).first()).toHaveAttribute('data-selected', 'true');
    await expect(page.locator(`[data-node-id="${buttonId}"]`).first()).toHaveAttribute('data-selected', 'true');
    await page.screenshot({ path: '/tmp/tseng-law-repeater-template-child-group-ungroup-page.png' });
  } finally {
    if (pageId) {
      await deleteRepeaterLoadingPage(page.request, pageId, slug);
    }
  }
});

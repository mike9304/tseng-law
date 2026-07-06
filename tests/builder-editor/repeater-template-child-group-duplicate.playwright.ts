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

test('/ko/admin-builder duplicates a selected repeater template field group from its child badge', async ({ page }) => {
  test.setTimeout(90_000);

  const token = Date.now().toString(36);
  const slug = `repeater-group-duplicate-${token}`;
  const repeaterId = `repeater-chip-${token}`;
  const titleId = `repeater-chip-title-${token}`;
  const buttonId = `repeater-chip-button-${token}`;
  let pageId: string | null = null;
  await page.setExtraHTTPHeaders(mutationHeaders(slug));

  try {
    pageId = await createRepeaterLoadingPage(page.request, slug, token);
    const revision = await currentDraftRevision(page.request, pageId, slug);
    await putDraftDocument(page.request, pageId, revision, makeRepeaterFieldChipDocument(token), slug);

    await openBuilder(page, `/ko/admin-builder?pageId=${encodeURIComponent(pageId)}&repeaterGroupDuplicate=${token}`);
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

    const originalGroup = page.locator('[data-node-id^="group-"][data-selected="true"]').first();
    await expect(originalGroup).toBeVisible();
    const originalGroupNodeId = await originalGroup.getAttribute('data-node-id');
    if (!originalGroupNodeId) {
      throw new Error('Expected grouped template field node id.');
    }
    await expect(originalGroup.locator(`[data-node-id="${titleId}"]`)).toBeVisible();
    await expect(originalGroup.locator(`[data-node-id="${buttonId}"]`)).toBeVisible();

    const duplicateButton = originalGroup
      .locator('[data-builder-repeater-template-child-duplicate-group="true"]')
      .first();
    await expect(duplicateButton).toBeVisible();
    await duplicateButton.click();

    const selectedDuplicateGroup = page
      .locator('[data-selected="true"]:has([data-builder-repeater-template-child-duplicate-group="true"])')
      .first();
    await expect(selectedDuplicateGroup).toBeVisible();
    const duplicatedGroupNodeId = await selectedDuplicateGroup.getAttribute('data-node-id');
    if (!duplicatedGroupNodeId) {
      throw new Error('Expected duplicated template field group node id.');
    }

    expect(duplicatedGroupNodeId).not.toBe(originalGroupNodeId);
    await expect(page.locator(`[data-node-id="${originalGroupNodeId}"]`)).toHaveCount(1);
    await expect(page.locator(`[data-node-id="${duplicatedGroupNodeId}"]`)).toHaveCount(1);
    await expect(selectedDuplicateGroup.locator('[data-builder-repeater-template-child-field-active="true"]')).toHaveCount(2);
    await page.screenshot({ path: '/tmp/tseng-law-repeater-template-child-group-duplicate-page.png' });
  } finally {
    if (pageId) {
      await deleteRepeaterLoadingPage(page.request, pageId, slug);
    }
  }
});

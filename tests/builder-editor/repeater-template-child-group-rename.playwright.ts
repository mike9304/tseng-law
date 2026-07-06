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

test('/ko/admin-builder renames a selected repeater template field group from its child badge', async ({ page }) => {
  test.setTimeout(90_000);

  const token = Date.now().toString(36);
  const slug = `repeater-group-rename-${token}`;
  const repeaterId = `repeater-chip-${token}`;
  const buttonId = `repeater-chip-button-${token}`;
  let pageId: string | null = null;
  await page.setExtraHTTPHeaders(mutationHeaders(slug));

  try {
    pageId = await createRepeaterLoadingPage(page.request, slug, token);
    const revision = await currentDraftRevision(page.request, pageId, slug);
    await putDraftDocument(page.request, pageId, revision, makeRepeaterFieldChipDocument(token), slug);

    await openBuilder(page, `/ko/admin-builder?pageId=${encodeURIComponent(pageId)}&repeaterGroupRename=${token}`);
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
      throw new Error('Expected grouped template field node id.');
    }

    const groupNameInput = selectedGroup
      .locator('[data-builder-repeater-template-child-group-name="true"]')
      .first();
    await expect(groupNameInput).toBeVisible();
    await groupNameInput.fill('사건 메타 그룹');
    await groupNameInput.press('Enter');

    await page.locator('[data-builder-layer-search="true"]').fill(selectedGroupNodeId);
    const groupLayerRow = page.locator(`[data-builder-layer-row="${selectedGroupNodeId}"]`).first();
    await expect(groupLayerRow).toBeVisible();
    await expect(groupLayerRow).toContainText('사건 메타 그룹');
    await selectedGroup
      .locator('[data-builder-repeater-template-child-controls="true"]')
      .first()
      .screenshot({ path: '/tmp/tseng-law-repeater-template-child-group-rename-controls.png' });
    await selectedGroup.screenshot({ path: '/tmp/tseng-law-repeater-template-child-group-rename-node.png' });
    await page.screenshot({ path: '/tmp/tseng-law-repeater-template-child-group-rename-page.png' });
  } finally {
    if (pageId) {
      await deleteRepeaterLoadingPage(page.request, pageId, slug);
    }
  }
});

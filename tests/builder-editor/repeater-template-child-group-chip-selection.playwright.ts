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

test('/ko/admin-builder selects a grouped repeater template child from its active field chip', async ({ page }) => {
  test.setTimeout(90_000);

  const token = Date.now().toString(36);
  const slug = `repeater-group-chip-${token}`;
  const repeaterId = `repeater-chip-${token}`;
  const titleId = `repeater-chip-title-${token}`;
  const buttonId = `repeater-chip-button-${token}`;
  let pageId: string | null = null;
  await page.setExtraHTTPHeaders(mutationHeaders(slug));

  try {
    pageId = await createRepeaterLoadingPage(page.request, slug, token);
    const revision = await currentDraftRevision(page.request, pageId, slug);
    await putDraftDocument(page.request, pageId, revision, makeRepeaterFieldChipDocument(token), slug);

    await openBuilder(page, `/ko/admin-builder?pageId=${encodeURIComponent(pageId)}&repeaterGroupChip=${token}`);
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

    const titleChip = selectedGroup
      .locator(`[data-builder-repeater-template-child-field-node-id="${titleId}"]`)
      .first();
    await expect(titleChip).toHaveAttribute('data-builder-repeater-template-child-field-active', 'true');
    await titleChip.click();

    const selectedTitle = page.locator(`[data-node-id="${titleId}"]`).first();
    await expect(selectedTitle).toHaveAttribute('data-selected', 'true');
    await expect(page.locator(`[data-node-id="${selectedGroupNodeId}"]`)).toHaveCount(1);
    await expect(page.locator(`[data-node-id="${buttonId}"]`).first()).not.toHaveAttribute('data-selected', 'true');
    await page.screenshot({ path: '/tmp/tseng-law-repeater-template-child-group-chip-selection-page.png' });
  } finally {
    if (pageId) {
      await deleteRepeaterLoadingPage(page.request, pageId, slug);
    }
  }
});

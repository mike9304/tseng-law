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

test('/ko/admin-builder round-trips between repeater HUD field chips and template child badge', async ({ page }) => {
  test.setTimeout(90_000);

  const token = Date.now().toString(36);
  const slug = `repeater-chip-${token}`;
  const repeaterId = `repeater-chip-${token}`;
  const imageId = `repeater-chip-image-${token}`;
  const titleId = `repeater-chip-title-${token}`;
  const buttonId = `repeater-chip-button-${token}`;
  let pageId: string | null = null;
  await page.setExtraHTTPHeaders(mutationHeaders(slug));

  try {
    pageId = await createRepeaterLoadingPage(page.request, slug, token);
    const revision = await currentDraftRevision(page.request, pageId, slug);
    await putDraftDocument(page.request, pageId, revision, makeRepeaterFieldChipDocument(token), slug);

    await openBuilder(page, `/ko/admin-builder?pageId=${encodeURIComponent(pageId)}&repeaterChip=${token}`);
    await selectLayerNode(page, repeaterId);

    const repeaterNode = page.locator(`[data-node-id="${repeaterId}"]`).first();
    const hud = repeaterNode.locator('[data-builder-repeater-template-hud="true"]').first();
    await expect(hud).toBeVisible();
    const fieldSummary = hud.locator('[data-builder-repeater-template-field-summary="true"]').first();
    await expect(fieldSummary.locator('[data-builder-repeater-template-field-chip="true"]')).toHaveCount(3);
    await expect(fieldSummary).toContainText('readTime');
    const lockedImageHudChip = fieldSummary
      .locator(`[data-builder-repeater-template-field-node-id="${imageId}"]`)
      .first();
    await expect(lockedImageHudChip).toHaveAttribute('data-builder-repeater-template-field-locked', 'true');
    await expect(lockedImageHudChip).toContainText(/Locked|잠김/);

    await fieldSummary.locator(`[data-builder-repeater-template-field-node-id="${buttonId}"]`).click();

    const selectedButton = page.locator(`[data-node-id="${buttonId}"]`).first();
    await expect(selectedButton).toHaveAttribute('data-selected', 'true');
    await expect(selectedButton.locator('[data-builder-repeater-template-child-badge="true"]').first()).toContainText(
      /Record 1|상위 데이터의 레코드 1/
    );
    await expect(selectedButton.locator('[data-builder-repeater-template-child-badge="true"]').first()).toHaveAttribute(
      'data-builder-repeater-template-parent-id',
      repeaterId,
    );
    const childFieldRail = selectedButton
      .locator('[data-builder-repeater-template-child-field-rail="true"]')
      .first();
    await expect(childFieldRail).toBeVisible();
    await expect(childFieldRail.locator('[data-builder-repeater-template-child-field-chip="true"]')).toHaveCount(3);
    await expect(
      childFieldRail.locator(`[data-builder-repeater-template-child-field-node-id="${buttonId}"]`)
    ).toHaveAttribute('data-builder-repeater-template-child-field-active', 'true');
    const titleRailChip = childFieldRail
      .locator(`[data-builder-repeater-template-child-field-node-id="${titleId}"]`)
      .first();
    const titleRailPreview = titleRailChip
      .locator('[data-builder-repeater-template-child-field-preview="true"]')
      .first();
    await expect(titleRailPreview).toHaveAttribute(
      'data-builder-repeater-template-child-field-preview-value',
      /대만 화장품 시장 진출/,
    );
    await selectedButton.locator('[data-builder-repeater-template-child-badge="true"]').first().click();
    await expect(repeaterNode).toHaveAttribute('data-selected', 'true');
    await hud.locator('[data-builder-repeater-template-next="true"]').click();
    await expect(hud.locator('[data-builder-repeater-template-record="true"]').first()).toContainText(/레코드 2/);
    await fieldSummary.locator(`[data-builder-repeater-template-field-node-id="${buttonId}"]`).click();
    await expect(selectedButton).toHaveAttribute('data-selected', 'true');
    await expect(titleRailPreview).toHaveAttribute(
      'data-builder-repeater-template-child-field-preview-value',
      /대만 노동법/,
    );
    const selectedButtonLockToggle = selectedButton
      .locator('[data-builder-repeater-template-child-lock-toggle="true"]')
      .first();
    await expect(selectedButtonLockToggle).toHaveAttribute(
      'data-builder-repeater-template-child-lock-state',
      'unlocked',
    );
    await selectedButtonLockToggle.click();
    await expect(selectedButtonLockToggle).toHaveAttribute(
      'data-builder-repeater-template-child-lock-state',
      'locked',
    );
    await expect(selectedButtonLockToggle).toContainText(/Unlock|해제/);
    await expect(
      childFieldRail.locator(`[data-builder-repeater-template-child-field-node-id="${buttonId}"]`)
    ).toHaveAttribute('data-builder-repeater-template-child-field-locked', 'true');
    await selectedButtonLockToggle.click();
    await expect(selectedButtonLockToggle).toHaveAttribute(
      'data-builder-repeater-template-child-lock-state',
      'unlocked',
    );
    await page.setViewportSize({ width: 1280, height: 900 });
    await selectedButton.scrollIntoViewIfNeeded();
    await page.screenshot({ path: '/tmp/tseng-law-repeater-child-lock-toggle-desktop.png' });
    await page.setViewportSize({ width: 768, height: 900 });
    await selectedButton.scrollIntoViewIfNeeded();
    await page.screenshot({ path: '/tmp/tseng-law-repeater-child-lock-toggle-tablet.png' });
    await page.setViewportSize({ width: 375, height: 812 });
    await selectedButton.scrollIntoViewIfNeeded();
    await page.screenshot({ path: '/tmp/tseng-law-repeater-child-lock-toggle-mobile.png' });
    await page.setViewportSize({ width: 1440, height: 1000 });
    const lockedImageRailChip = childFieldRail
      .locator(`[data-builder-repeater-template-child-field-node-id="${imageId}"]`)
      .first();
    await expect(lockedImageRailChip).toHaveAttribute('data-builder-repeater-template-child-field-locked', 'true');
    await expect(lockedImageRailChip).toContainText(/Locked|잠김/);
    await repeaterNode.screenshot({ path: '/tmp/tseng-law-repeater-hud-locked-child-rail.png' });
    await lockedImageRailChip.click();

    const selectedImage = page.locator(`[data-node-id="${imageId}"]`).first();
    await expect(selectedImage).toHaveAttribute('data-selected', 'true');
    const imageFieldRail = selectedImage
      .locator('[data-builder-repeater-template-child-field-rail="true"]')
      .first();
    await expect(imageFieldRail).toBeVisible();
    await expect(
      imageFieldRail.locator(`[data-builder-repeater-template-child-field-node-id="${imageId}"]`)
    ).toHaveAttribute('data-builder-repeater-template-child-field-active', 'true');
    await expect(
      imageFieldRail.locator(`[data-builder-repeater-template-child-field-node-id="${imageId}"]`)
    ).toHaveAttribute('data-builder-repeater-template-child-field-locked', 'true');
    const inspector = page.locator('[data-builder-inspector-panel="true"]').first();
    const contentTab = inspector.getByRole('button', { name: /content|콘텐츠/i });
    await expect(contentTab).toBeVisible();
    await contentTab.click({ force: true });
    await expect(inspector.locator('[data-builder-data-binding-panel="true"]').first()).toContainText(
      /inherited from the parent repeater|부모 리피터에서 상속한/
    );
    await selectedImage.locator('[data-builder-repeater-template-child-badge="true"]').first().click();
    await expect(repeaterNode).toHaveAttribute('data-selected', 'true');
    await expect(hud).toBeVisible();
    await expect(fieldSummary.locator('[data-builder-repeater-template-field-chip="true"]')).toHaveCount(3);
    await repeaterNode.screenshot({ path: '/tmp/tseng-law-repeater-hud-child-badge-parent-return.png' });
    await fieldSummary.locator(`[data-builder-repeater-template-field-node-id="${buttonId}"]`).click();
    await expect(selectedButton).toHaveAttribute('data-selected', 'true');
    const groupSiblingsButton = selectedButton
      .locator('[data-builder-repeater-template-child-group-siblings="true"]')
      .first();
    await expect(groupSiblingsButton).toHaveAttribute(
      'data-builder-repeater-template-child-group-count',
      '2',
    );
    await groupSiblingsButton.click();
    const selectedGroup = page.locator('[data-node-id^="group-"][data-selected="true"]').first();
    await expect(selectedGroup).toBeVisible();
    await expect(selectedGroup.locator(`[data-node-id="${titleId}"]`)).toBeVisible();
    await expect(selectedGroup.locator(`[data-node-id="${buttonId}"]`)).toBeVisible();
    await expect(selectedGroup.locator(`[data-node-id="${imageId}"]`)).toHaveCount(0);
    await expect(selectedGroup.locator('[data-builder-repeater-template-child-badge="true"]').first()).toContainText(
      /Record 2|상위 데이터의 레코드 2/
    );
    await expect(selectedGroup.locator('[data-builder-repeater-template-child-badge="true"]').first()).toHaveAttribute(
      'data-builder-repeater-template-parent-id',
      repeaterId,
    );
    const groupFieldRail = selectedGroup.locator('[data-builder-repeater-template-child-field-rail="true"]').first();
    await expect(groupFieldRail).toBeVisible();
    await expect(groupFieldRail.locator('[data-builder-repeater-template-child-field-chip="true"]')).toHaveCount(3);
    const groupTitleRailChip = groupFieldRail
      .locator(`[data-builder-repeater-template-child-field-node-id="${titleId}"]`)
      .first();
    const groupButtonRailChip = groupFieldRail
      .locator(`[data-builder-repeater-template-child-field-node-id="${buttonId}"]`)
      .first();
    const groupImageRailChip = groupFieldRail
      .locator(`[data-builder-repeater-template-child-field-node-id="${imageId}"]`)
      .first();
    await expect(groupTitleRailChip).toHaveAttribute(
      'data-builder-repeater-template-child-field-active',
      'true',
    );
    await expect(groupButtonRailChip).toHaveAttribute(
      'data-builder-repeater-template-child-field-active',
      'true',
    );
    await expect(groupImageRailChip).not.toHaveAttribute(
      'data-builder-repeater-template-child-field-active',
      'true',
    );
    const selectedGroupLockToggle = selectedGroup
      .locator('[data-builder-repeater-template-child-lock-toggle="true"]')
      .first();
    await expect(selectedGroupLockToggle).toHaveAttribute(
      'data-builder-repeater-template-child-lock-state',
      'unlocked',
    );
    await selectedGroupLockToggle.click();
    await expect(selectedGroupLockToggle).toHaveAttribute(
      'data-builder-repeater-template-child-lock-state',
      'locked',
    );
    await expect(groupTitleRailChip).toHaveAttribute('data-builder-repeater-template-child-field-locked', 'true');
    await expect(groupButtonRailChip).toHaveAttribute('data-builder-repeater-template-child-field-locked', 'true');
    await expect(groupImageRailChip).toHaveAttribute('data-builder-repeater-template-child-field-locked', 'true');
    await selectedGroup.screenshot({ path: '/tmp/tseng-law-repeater-template-child-group-lock-cascade.png' });
    await page.screenshot({ path: '/tmp/tseng-law-repeater-template-child-group-lock-cascade-page.png' });
    await page.keyboard.press(process.platform === 'darwin' ? 'Meta+Z' : 'Control+Z');
    await expect(selectedGroupLockToggle).toHaveAttribute(
      'data-builder-repeater-template-child-lock-state',
      'unlocked',
    );
    await expect(groupTitleRailChip).not.toHaveAttribute('data-builder-repeater-template-child-field-locked', 'true');
    await expect(groupButtonRailChip).not.toHaveAttribute('data-builder-repeater-template-child-field-locked', 'true');
    await expect(groupImageRailChip).toHaveAttribute('data-builder-repeater-template-child-field-locked', 'true');
    await expect(selectedGroup.locator('[data-builder-repeater-template-child-group-siblings="true"]')).toHaveCount(0);
    await selectedGroup.screenshot({ path: '/tmp/tseng-law-repeater-template-child-group-context.png' });
    await page.screenshot({ path: '/tmp/tseng-law-repeater-template-child-group-context-page.png' });
    await groupImageRailChip.click();
    await expect(selectedImage).toHaveAttribute('data-selected', 'true');
    await selectLayerNode(page, repeaterId);
    await expect(repeaterNode).toHaveAttribute('data-selected', 'true');
    await expect(fieldSummary.locator('[data-builder-repeater-template-field-chip="true"]')).toHaveCount(3);
    await fieldSummary.locator(`[data-builder-repeater-template-field-node-id="${titleId}"]`).click();
    const selectedTitle = page.locator(`[data-node-id="${titleId}"]`).first();
    await expect(selectedTitle).toHaveAttribute('data-selected', 'true');
    await expect(selectedTitle.locator('[data-builder-repeater-template-child-badge="true"]').first()).toContainText(
      /Record 2|상위 데이터의 레코드 2/
    );
    await expect(selectedTitle.locator('[data-builder-repeater-template-child-group-siblings="true"]')).toHaveCount(0);
    await selectedTitle.screenshot({ path: '/tmp/tseng-law-repeater-grouped-template-child-context.png' });
  } finally {
    if (pageId) {
      await deleteRepeaterLoadingPage(page.request, pageId, slug);
    }
  }
});

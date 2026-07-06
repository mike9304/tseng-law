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
import { makeRepeaterFieldChipRebindDocument } from './helpers/repeater-field-chip-rebind-document';

const PREFS_KEY = 'tw_builder_editor_prefs_v1';

test('/ko/admin-builder rebinds saved repeater template groups to the selected repeater target', async ({ page }) => {
  test.setTimeout(100_000);

  await page.addInitScript((key) => {
    window.localStorage.setItem(key, JSON.stringify({ componentLibrary: [] }));
  }, PREFS_KEY);

  const token = Date.now().toString(36);
  const slug = `repeater-group-library-rebind-${token}`;
  const sourceRepeaterId = `repeater-rebind-source-${token}`;
  const targetRepeaterId = `repeater-rebind-target-${token}`;
  const sourceTitleId = `repeater-rebind-source-title-${token}`;
  const sourceButtonId = `repeater-rebind-source-button-${token}`;
  let pageId: string | null = null;
  await page.setExtraHTTPHeaders(mutationHeaders(slug));

  try {
    pageId = await createRepeaterLoadingPage(page.request, slug, token);
    const revision = await currentDraftRevision(page.request, pageId, slug);
    await putDraftDocument(page.request, pageId, revision, makeRepeaterFieldChipRebindDocument(token), slug);

    await openBuilder(page, `/ko/admin-builder?pageId=${encodeURIComponent(pageId)}&repeaterGroupLibraryRebind=${token}`);
    await selectLayerNode(page, sourceRepeaterId);

    const sourceRepeaterNode = page.locator(`[data-node-id="${sourceRepeaterId}"]`).first();
    const sourceFieldSummary = sourceRepeaterNode
      .locator('[data-builder-repeater-template-field-summary="true"]')
      .first();
    await expect(sourceFieldSummary).toBeVisible();
    await sourceFieldSummary.locator(`[data-builder-repeater-template-field-node-id="${sourceButtonId}"]`).click();

    const selectedSourceButton = page.locator(`[data-node-id="${sourceButtonId}"]`).first();
    await expect(selectedSourceButton).toHaveAttribute('data-selected', 'true');
    await selectedSourceButton
      .locator('[data-builder-repeater-template-child-group-siblings="true"]')
      .first()
      .click();

    const originalGroup = sourceRepeaterNode
      .locator('[data-node-id^="group-"][data-selected="true"]')
      .first();
    await expect(originalGroup).toBeVisible();
    await expect(originalGroup.locator(`[data-node-id="${sourceTitleId}"]`)).toBeVisible();
    await expect(originalGroup.locator(`[data-node-id="${sourceButtonId}"]`)).toBeVisible();

    const drawer = await openCatalogDrawer(page);
    const componentLibraryShortcut = drawer.locator('[data-builder-component-library-shortcut="true"]');
    await componentLibraryShortcut.locator('[data-builder-component-library-shortcut-open="true"]').click();

    const componentLibrary = drawer.locator('[data-builder-component-library="true"]');
    await expect(componentLibrary).toBeVisible();
    await componentLibrary.locator('[data-builder-component-library-name="true"]').fill('Portable field group');
    await componentLibrary.locator('[data-builder-component-library-save="true"]').click();
    await expect(componentLibrary.getByText('템플릿 그룹 · 3개 요소')).toBeVisible();

    await selectLayerNode(page, targetRepeaterId);
    const targetRepeaterNode = page.locator(`[data-node-id="${targetRepeaterId}"]`).first();
    await expect(targetRepeaterNode).toHaveAttribute('data-selected', 'true');

    const targetDrawer = await openCatalogDrawer(page);
    const targetComponentLibraryShortcut = targetDrawer.locator('[data-builder-component-library-shortcut="true"]');
    await targetComponentLibraryShortcut.scrollIntoViewIfNeeded();
    await targetComponentLibraryShortcut
      .locator('[data-builder-component-library-shortcut-insert]')
      .first()
      .click();

    const remapReview = targetDrawer.locator('[data-builder-component-library-remap-review="true"]').first();
    await expect(remapReview).toBeVisible();
    await expect(remapReview).toHaveAttribute('data-builder-component-library-remap-review-target', 'home.services.list');
    const readTimeField = remapReview
      .locator('[data-builder-component-library-remap-review-source-field="readTime"]')
      .first();
    const readTimeSelect = readTimeField
      .locator('[data-builder-component-library-remap-review-select="true"]')
      .first();
    await readTimeSelect.selectOption('details');
    await remapReview.screenshot({ path: '/tmp/tseng-law-repeater-template-group-component-library-remap-review.png' });
    await remapReview.locator('[data-builder-component-library-remap-review-confirm="true"]').click();

    const selectedReboundGroup = targetRepeaterNode
      .locator('[data-selected="true"]:has([data-builder-repeater-template-child-duplicate-group="true"])')
      .first();
    await expect(selectedReboundGroup).toBeVisible();
    const reboundGroupId = await selectedReboundGroup.getAttribute('data-node-id');
    if (!reboundGroupId) throw new Error('Expected rebound template group id.');

    await expect(sourceRepeaterNode.locator(`[data-node-id="${reboundGroupId}"]`)).toHaveCount(0);
    await expect(targetRepeaterNode.locator(`[data-node-id="${reboundGroupId}"]`)).toHaveCount(1);
    const activeReboundFields = selectedReboundGroup.locator(
      '[data-builder-repeater-template-child-field-active="true"]',
    );
    await expect(activeReboundFields).toHaveCount(2);
    await expect(activeReboundFields.filter({ hasText: 'details +1' })).toHaveCount(1);
    await expect(activeReboundFields.filter({ hasText: 'readTime' })).toHaveCount(0);
    const remapNotice = targetDrawer.locator('[data-builder-component-library-remap-notice="true"]').first();
    await expect(remapNotice).toBeVisible();
    await expect(remapNotice).toHaveAttribute('data-builder-component-library-remap-target', 'home.services.list');
    await expect(remapNotice.locator('[data-builder-component-library-remap-changed="true"]')).toContainText('readTime -> details');
    await expect(remapNotice).toContainText('변경 1개 · 제외 0개');
    await page.addStyleTag({
      content: `
        [data-builder-live-chat-widget="true"],
        .floating-ai-chat,
        .builder-social-floating-chat,
        .year-end-popup-backdrop {
          display: none !important;
        }
      `,
    });
    await selectedReboundGroup
      .locator('[data-builder-repeater-template-child-controls="true"]')
      .first()
      .screenshot({ path: '/tmp/tseng-law-repeater-template-group-component-library-rebind-controls.png' });
    await selectedReboundGroup.screenshot({ path: '/tmp/tseng-law-repeater-template-group-component-library-rebind-node.png' });
    await page.screenshot({ path: '/tmp/tseng-law-repeater-template-group-component-library-rebind-page.png' });
  } finally {
    if (pageId) {
      await deleteRepeaterLoadingPage(page.request, pageId, slug);
    }
  }
});

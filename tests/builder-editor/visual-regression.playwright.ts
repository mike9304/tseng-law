import { expect, test, type APIRequestContext, type Page } from '@playwright/test';
import type { BuilderCmsCollection, BuilderCmsFieldDefinition } from '@/lib/builder/cms-types';
import {
  deleteDraftColumn,
  deletePublishedColumn,
  writeDraftColumn,
  writePublishedColumn,
} from '@/lib/builder/columns/storage';
import type { ColumnDocument } from '@/lib/builder/columns/types';
import { getTemplateById, getAllTemplates } from '@/lib/builder/templates/registry';
import { readSiteDocument, writeSiteDocument } from '@/lib/builder/site/persistence';
import {
  editorShell,
  openAssetLibrary,
  openBuilder,
  openCatalogDrawer,
  openPreviewModalMobile,
  openSiteSettings,
  selectTextNode,
} from './helpers/editor';

const PAGE_SWITCHER_TREE_SCOPE = 'visual-page-switcher-tree';

const CMS_DEEPLINK_COLLECTION_ID = 'visual-cms-deeplink';
const CMS_DEEPLINK_RECORD_ID = 'visual-cms-record';
const CMS_DEEPLINK_SCOPE = 'visual-cms-deeplink';
const CMS_REFERENCE_PICKER_COLLECTION_ID = 'visual-cms-reference-picker';
const CMS_REFERENCE_PICKER_PRIMARY_RECORD_ID = 'visual-cms-reference-primary';
const CMS_REFERENCE_PICKER_SECONDARY_RECORD_ID = 'visual-cms-reference-secondary';
const CMS_REFERENCE_PICKER_SCOPE = 'visual-cms-reference-picker';
const CMS_SOURCE_COLLECTION_ID = 'service-areas';
const DYNAMIC_LIST_VISUAL_SCOPE = 'visual-dynamic-list';
const CMS_DYNAMIC_LIST_VISUAL_SCOPE = 'visual-cms-dynamic-list';
const TEMPLATE_VISUAL_SCOPE = 'visual-template';
const FAQ_VISUAL_LOCALE = 'ko';

test.describe('/ko/admin-builder visual baselines', () => {
  test('captures Wix-like editor states', async ({ page }) => {
    test.setTimeout(120_000);
    await openBuilder(page);
    // Autosave/status chips mount and unmount on their own debounce cycle, so
    // mask them — otherwise toHaveScreenshot can never stabilize two frames.
    const editorChromeMasks = [
      page.locator('[data-save-status-chip]'),
      page.locator('[data-builder-toast]'),
    ];
    await expect(await editorShell(page)).toHaveScreenshot('admin-builder-first-screen.png', { mask: editorChromeMasks });

    await openCatalogDrawer(page);
    await expect(await editorShell(page)).toHaveScreenshot('admin-builder-catalog-drawer.png', { mask: editorChromeMasks });

    await page.keyboard.press('Escape');
    await selectTextNode(page);
    await expect(await editorShell(page)).toHaveScreenshot('admin-builder-text-inspector.png', { mask: editorChromeMasks });

    const previewModal = await openPreviewModalMobile(page);
    await expect(previewModal).toHaveScreenshot('admin-builder-preview-mobile.png');
    await previewModal.getByRole('button', { name: '미리보기 닫기' }).click();
    await expect(previewModal).toBeHidden();

    await page.keyboard.press('Escape');
    const settingsModal = await openSiteSettings(page);
    await expect(settingsModal).toHaveScreenshot('admin-builder-site-settings.png');
    await settingsModal.getByRole('button', { name: 'Close' }).click();
    await expect(settingsModal).toBeHidden();

    const assetDialog = await openAssetLibrary(page);
    await page.evaluate(() => {
      const active = document.activeElement;
      if (active instanceof HTMLElement) active.blur();
    });
    await expect(assetDialog.getByText('폴더')).toBeVisible();
    await expect(assetDialog.getByPlaceholder('새 폴더')).toBeVisible();
    await expect(assetDialog.getByRole('button', { name: '추가' }).first()).toBeVisible();
    await expect(assetDialog.getByRole('button', { name: '새로고침' })).toBeVisible();
    await expect(assetDialog.getByRole('button', { name: '이미지 업로드' }).first()).toBeVisible();
    await expect(assetDialog.getByRole('button', { name: '전체 태그' })).toBeVisible();
    await expect(assetDialog.getByPlaceholder('새 태그')).toBeVisible();
    // Brand-filter contents depend on live brand assets seeded by other
    // suites — capture the deterministic all-images state instead.
    await assetDialog.getByRole('button', { name: /전체 이미지|전체$/ }).first().click();
    await expect(assetDialog).toHaveScreenshot('admin-builder-asset-library.png');

    await page.goto('/ko/admin-builder/cms', { waitUntil: 'domcontentloaded' });
    const cmsSurface = page.locator('[data-cms-content-manager]').first();
    await expect(cmsSurface).toBeVisible();
    await expect(cmsSurface).toContainText('CMS');
    // The full surface height tracks the live collection list (other suites
    // add/remove collections), so pin the element to a fixed-height window.
    await cmsSurface.evaluate((element) => {
      element.style.height = '1400px';
      element.style.overflow = 'hidden';
    });
    await expect(cmsSurface).toHaveScreenshot('admin-builder-cms.png');
    await cmsSurface.evaluate((element) => {
      element.style.height = '';
      element.style.overflow = '';
    });

    await ensureCmsDeepLinkFixture(page.request);
    await page.goto(
      `/ko/admin-builder/cms?collectionId=${CMS_DEEPLINK_COLLECTION_ID}&recordId=${CMS_DEEPLINK_RECORD_ID}`,
      { waitUntil: 'domcontentloaded' },
    );
    await expect(page.getByRole('heading', { name: `Edit ${CMS_DEEPLINK_RECORD_ID}` })).toBeVisible();
    const cmsDeepLinkSurface = page.locator('[data-cms-record-editor]').first();
    await expect(cmsDeepLinkSurface).toHaveScreenshot('admin-builder-cms-deeplink.png');

    await page.locator('[data-cms-record-field-input="slug"]').first().fill('visual-deep-link-record-updated');
    await page.getByRole('button', { name: 'Save record' }).click();
    await expect(page.locator(`[data-cms-record-live-route-link="${CMS_DEEPLINK_RECORD_ID}"]`)).toHaveAttribute(
      'href',
      /visual-deep-link-record-updated$/,
    );
    await expect(cmsDeepLinkSurface).toHaveScreenshot('admin-builder-cms-deeplink-redirect.png');

    await page.getByRole('button', { name: 'Expanded rows' }).click();
    await expect(page.locator(`[data-cms-record-field-inline-edit="${CMS_DEEPLINK_RECORD_ID}:title"]`)).toBeVisible({
      timeout: 30_000,
    });
    await page.evaluate(() => {
      const active = document.activeElement;
      if (active instanceof HTMLElement) active.blur();
    });
    await expect(cmsDeepLinkSurface).toHaveScreenshot('admin-builder-cms-deeplink-field-grid.png');
    await page.locator(`[data-cms-record-field-inline-edit="${CMS_DEEPLINK_RECORD_ID}:title"]`).click();
    const cmsDeepLinkTitleInlineEditor = page.locator(
      `[data-cms-record-field-inline-editor="${CMS_DEEPLINK_RECORD_ID}:title"]`,
    ).first();
    await expect(cmsDeepLinkTitleInlineEditor).toBeVisible({ timeout: 30_000 });
    await expect(cmsDeepLinkTitleInlineEditor).toHaveScreenshot('admin-builder-cms-deeplink-inline-editor.png');

    const deepLinkSummaryCell = page.locator(`[data-cms-record-field-cell="${CMS_DEEPLINK_RECORD_ID}:summary"]`);
    await deepLinkSummaryCell.locator('[data-cms-record-field-inline-edit]').click();
    const deepLinkSummaryInlineEditor = deepLinkSummaryCell.locator('[data-cms-record-field-inline-editor]').first();
    const deepLinkSummaryInlineInput = deepLinkSummaryInlineEditor.locator('[data-cms-record-field-inline-input]');
    await deepLinkSummaryInlineInput.fill(`Heading text ${CMS_DEEPLINK_SCOPE}`);
    await deepLinkSummaryInlineInput.evaluate((node) => {
      if (node instanceof HTMLTextAreaElement) {
        node.setSelectionRange(0, node.value.length);
      }
    });
    await deepLinkSummaryInlineEditor.locator('[data-cms-record-field-rich-text-format="h6"]').click();
    await expect(deepLinkSummaryInlineInput).toHaveValue(`<h6>Heading text ${CMS_DEEPLINK_SCOPE}</h6>`);
    const deepLinkSummaryPatchResponse = await page.request.patch(
      `/api/builder/sites/default/collections/${encodeURIComponent(CMS_DEEPLINK_COLLECTION_ID)}/records/${encodeURIComponent(CMS_DEEPLINK_RECORD_ID)}?locale=ko`,
      {
        headers: { 'x-forwarded-for': `pw-${CMS_DEEPLINK_SCOPE}` },
        data: {
          fields: {
            title: 'Visual deep-link record',
            slug: 'visual-deep-link-record-updated',
            summary: `<h6>Heading text ${CMS_DEEPLINK_SCOPE}</h6>`,
          },
        },
      },
    );
    expect(deepLinkSummaryPatchResponse.status()).toBe(200);
    await page.goto(
      `/ko/admin-builder/cms?collectionId=${CMS_DEEPLINK_COLLECTION_ID}&recordId=${CMS_DEEPLINK_RECORD_ID}`,
      { waitUntil: 'domcontentloaded' },
    );
    await expect(page.getByRole('heading', { name: `Edit ${CMS_DEEPLINK_RECORD_ID}` })).toBeVisible();
    const cmsDeepLinkSavedSurface = page.locator('[data-cms-record-editor]').first();
    await expect(cmsDeepLinkSavedSurface).toHaveScreenshot('admin-builder-cms-deeplink-h6.png');

    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto(
      `/ko/admin-builder/cms?collectionId=${CMS_DEEPLINK_COLLECTION_ID}&recordId=${CMS_DEEPLINK_RECORD_ID}`,
      { waitUntil: 'domcontentloaded' },
    );
    await expect(page.getByRole('heading', { name: `Edit ${CMS_DEEPLINK_RECORD_ID}` })).toBeVisible();
    const cmsDeepLinkSurfaceMobile = page.locator('[data-cms-record-editor]').first();
    await page.getByRole('button', { name: 'Expanded rows' }).click();
    await expect(page.locator(`[data-cms-record-field-inline-edit="${CMS_DEEPLINK_RECORD_ID}:title"]`)).toBeVisible({
      timeout: 30_000,
    });
    await page.evaluate(() => {
      const active = document.activeElement;
      if (active instanceof HTMLElement) active.blur();
    });
    await expect(cmsDeepLinkSurfaceMobile).toHaveScreenshot('admin-builder-cms-deeplink-field-grid.mobile.png');
    await page.locator(`[data-cms-record-field-inline-edit="${CMS_DEEPLINK_RECORD_ID}:title"]`).click();
    const cmsDeepLinkTitleInlineEditorMobile = page.locator(
      `[data-cms-record-field-inline-editor="${CMS_DEEPLINK_RECORD_ID}:title"]`,
    ).first();
    await expect(cmsDeepLinkTitleInlineEditorMobile).toBeVisible({ timeout: 30_000 });
    await expect(cmsDeepLinkTitleInlineEditorMobile).toHaveScreenshot('admin-builder-cms-deeplink-inline-editor.mobile.png');
    await expect(cmsDeepLinkSurfaceMobile).toHaveScreenshot('admin-builder-cms-deeplink.mobile.png');

    await page.setViewportSize({ width: 834, height: 1112 });
    await page.goto(
      `/ko/admin-builder/cms?collectionId=${CMS_DEEPLINK_COLLECTION_ID}&recordId=${CMS_DEEPLINK_RECORD_ID}`,
      { waitUntil: 'domcontentloaded' },
    );
    await expect(page.getByRole('heading', { name: `Edit ${CMS_DEEPLINK_RECORD_ID}` })).toBeVisible();
    const cmsDeepLinkSurfaceTablet = page.locator('[data-cms-record-editor]').first();
    await page.getByRole('button', { name: 'Expanded rows' }).click();
    await expect(page.locator(`[data-cms-record-field-inline-edit="${CMS_DEEPLINK_RECORD_ID}:title"]`)).toBeVisible({
      timeout: 30_000,
    });
    await page.evaluate(() => {
      const active = document.activeElement;
      if (active instanceof HTMLElement) active.blur();
    });
    await expect(cmsDeepLinkSurfaceTablet).toHaveScreenshot('admin-builder-cms-deeplink-field-grid.tablet.png');
    await page.locator(`[data-cms-record-field-inline-edit="${CMS_DEEPLINK_RECORD_ID}:title"]`).click();
    const cmsDeepLinkTitleInlineEditorTablet = page.locator(
      `[data-cms-record-field-inline-editor="${CMS_DEEPLINK_RECORD_ID}:title"]`,
    ).first();
    await expect(cmsDeepLinkTitleInlineEditorTablet).toBeVisible({ timeout: 30_000 });
    await expect(cmsDeepLinkTitleInlineEditorTablet).toHaveScreenshot('admin-builder-cms-deeplink-inline-editor.tablet.png');
    await expect(cmsDeepLinkSurfaceTablet).toHaveScreenshot('admin-builder-cms-deeplink.tablet.png');

    await ensureCmsReferencePickerFixture(page.request);
    await page.setViewportSize({ width: 1280, height: 900 });
    await page.goto(
      `/ko/admin-builder/cms?collectionId=${CMS_REFERENCE_PICKER_COLLECTION_ID}&recordId=${CMS_REFERENCE_PICKER_PRIMARY_RECORD_ID}`,
      { waitUntil: 'domcontentloaded' },
    );
    await expect(page.getByRole('heading', { name: `Edit ${CMS_REFERENCE_PICKER_PRIMARY_RECORD_ID}` })).toBeVisible();
    await page.getByRole('button', { name: 'Expanded rows' }).click();
    await page.locator(`[data-cms-record-field-edit="${CMS_REFERENCE_PICKER_PRIMARY_RECORD_ID}:related"]`).click();
    await expect(page.getByRole('button', { name: 'Pick record' })).toBeVisible({ timeout: 30_000 });
    await page.getByRole('button', { name: 'Pick record' }).click();
    const referencePicker = page.locator('[data-cms-reference-picker-card="true"]');
    await expect(referencePicker).toBeVisible();
    await page.evaluate(() => {
      const active = document.activeElement;
      if (active instanceof HTMLElement) active.blur();
    });
    await page.waitForTimeout(250);
    await expect(referencePicker).toHaveScreenshot('admin-builder-cms-reference-picker.png');

    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto(
      `/ko/admin-builder/cms?collectionId=${CMS_REFERENCE_PICKER_COLLECTION_ID}&recordId=${CMS_REFERENCE_PICKER_PRIMARY_RECORD_ID}`,
      { waitUntil: 'domcontentloaded' },
    );
    await expect(page.getByRole('heading', { name: `Edit ${CMS_REFERENCE_PICKER_PRIMARY_RECORD_ID}` })).toBeVisible();
    await page.getByRole('button', { name: 'Expanded rows' }).click();
    await page.locator(`[data-cms-record-field-edit="${CMS_REFERENCE_PICKER_PRIMARY_RECORD_ID}:related"]`).click();
    await expect(page.getByRole('button', { name: 'Pick record' })).toBeVisible({ timeout: 30_000 });
    await page.getByRole('button', { name: 'Pick record' }).click();
    const referencePickerMobile = page.locator('[data-cms-reference-picker-card="true"]');
    await expect(referencePickerMobile).toBeVisible();
    await page.evaluate(() => {
      const active = document.activeElement;
      if (active instanceof HTMLElement) active.blur();
    });
    await page.waitForTimeout(250);
    await expect(referencePickerMobile).toHaveScreenshot('admin-builder-cms-reference-picker.mobile.png');

    await page.setViewportSize({ width: 834, height: 1112 });
    await page.goto(
      `/ko/admin-builder/cms?collectionId=${CMS_REFERENCE_PICKER_COLLECTION_ID}&recordId=${CMS_REFERENCE_PICKER_PRIMARY_RECORD_ID}`,
      { waitUntil: 'domcontentloaded' },
    );
    await expect(page.getByRole('heading', { name: `Edit ${CMS_REFERENCE_PICKER_PRIMARY_RECORD_ID}` })).toBeVisible();
    await page.getByRole('button', { name: 'Expanded rows' }).click();
    await page.locator(`[data-cms-record-field-edit="${CMS_REFERENCE_PICKER_PRIMARY_RECORD_ID}:related"]`).click();
    await expect(page.getByRole('button', { name: 'Pick record' })).toBeVisible({ timeout: 30_000 });
    await page.getByRole('button', { name: 'Pick record' }).click();
    const referencePickerTablet = page.locator('[data-cms-reference-picker-card="true"]');
    await expect(referencePickerTablet).toBeVisible();
    await page.evaluate(() => {
      const active = document.activeElement;
      if (active instanceof HTMLElement) active.blur();
    });
    await page.waitForTimeout(250);
    await expect(referencePickerTablet).toHaveScreenshot('admin-builder-cms-reference-picker.tablet.png');

    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('/ko/admin-builder/cms', { waitUntil: 'domcontentloaded' });
    await expect(page.getByRole('heading', { name: 'CMS', exact: true })).toBeVisible();
    const cmsSurfaceMobile = page.locator('[data-cms-content-manager]').first();
    await expect(cmsSurfaceMobile).toHaveScreenshot('admin-builder-cms.mobile.png');

    await page.setViewportSize({ width: 834, height: 1112 });
    await page.goto('/ko/admin-builder/cms', { waitUntil: 'domcontentloaded' });
    await expect(page.getByRole('heading', { name: 'CMS', exact: true })).toBeVisible();
    const cmsSurfaceTablet = page.locator('[data-cms-content-manager]').first();
    await expect(cmsSurfaceTablet).toHaveScreenshot('admin-builder-cms.tablet.png');

    await page.setViewportSize({ width: 1280, height: 900 });
    await page.goto(`/ko/admin-builder/cms?collectionId=${CMS_SOURCE_COLLECTION_ID}`, { waitUntil: 'domcontentloaded' });
    await expect(page.getByRole('heading', { name: 'CMS', exact: true })).toBeVisible();
    await expect(page.locator('[data-cms-source-collection-focus="service-areas"]')).toBeVisible();
    await page.evaluate(() => {
      const active = document.activeElement;
      if (active instanceof HTMLElement) active.blur();
    });
    await page.waitForTimeout(750);
    await expect(page).toHaveScreenshot('admin-builder-cms-collection-deeplink.png', {
      timeout: 30_000,
    });

    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto(`/ko/admin-builder/cms?collectionId=${CMS_SOURCE_COLLECTION_ID}`, { waitUntil: 'domcontentloaded' });
    await expect(page.getByRole('heading', { name: 'CMS', exact: true })).toBeVisible();
    await expect(page.locator('[data-cms-source-collection-focus="service-areas"]')).toBeVisible();
    await page.evaluate(() => {
      const active = document.activeElement;
      if (active instanceof HTMLElement) active.blur();
    });
    await page.waitForTimeout(750);
    await expect(page).toHaveScreenshot('admin-builder-cms-collection-deeplink.mobile.png', {
      timeout: 30_000,
    });

    await page.setViewportSize({ width: 834, height: 1112 });
    await page.goto(`/ko/admin-builder/cms?collectionId=${CMS_SOURCE_COLLECTION_ID}`, { waitUntil: 'domcontentloaded' });
    await expect(page.getByRole('heading', { name: 'CMS', exact: true })).toBeVisible();
    await expect(page.locator('[data-cms-source-collection-focus="service-areas"]')).toBeVisible();
    await page.evaluate(() => {
      const active = document.activeElement;
      if (active instanceof HTMLElement) active.blur();
    });
    await page.waitForTimeout(750);
    await expect(page).toHaveScreenshot('admin-builder-cms-collection-deeplink.tablet.png', {
      timeout: 30_000,
    });

    await page.setViewportSize({ width: 1280, height: 900 });
    await page.goto('/ko/builder/collections/service-areas', { waitUntil: 'domcontentloaded' });
    await expect(page.getByText('Service areas collection', { exact: true })).toBeVisible({ timeout: 30_000 });
    const collectionSurface = page.locator('.builder-route-root').first();
    await expect(collectionSurface).toBeVisible({ timeout: 30_000 });
    await expect(collectionSurface).toHaveScreenshot('builder-collection-service-areas.png');

    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('/ko/builder/collections/service-areas', { waitUntil: 'domcontentloaded' });
    await expect(page.getByText('Service areas collection', { exact: true })).toBeVisible({ timeout: 30_000 });
    const collectionSurfaceMobile = page.locator('.builder-route-root').first();
    await expect(collectionSurfaceMobile).toBeVisible({ timeout: 30_000 });
    await expect(collectionSurfaceMobile).toHaveScreenshot('builder-collection-service-areas.mobile.png');

    await page.setViewportSize({ width: 834, height: 1112 });
    await page.goto('/ko/builder/collections/service-areas', { waitUntil: 'domcontentloaded' });
    await expect(page.getByText('Service areas collection', { exact: true })).toBeVisible({ timeout: 30_000 });
    const collectionSurfaceTablet = page.locator('.builder-route-root').first();
    await expect(collectionSurfaceTablet).toBeVisible({ timeout: 30_000 });
    await expect(collectionSurfaceTablet).toHaveScreenshot('builder-collection-service-areas.tablet.png');

    await page.setViewportSize({ width: 1280, height: 900 });
    await page.goto('/ko/builder/home/datasets?targetId=home.services.list&limit=6', { waitUntil: 'domcontentloaded' });
    const datasetBindingEditor = page.locator('[data-dataset-binding-editor="home"]').first();
    await expect(datasetBindingEditor).toContainText('Services list');
    await expect(datasetBindingEditor.locator('article').first()).toBeVisible({ timeout: 30_000 });
    await expect(datasetBindingEditor).toHaveScreenshot('builder-dataset-binding-editor.png');

    await page.goto('/ko/builder/home/datasets?targetId=home.insights.feed&limit=2', { waitUntil: 'domcontentloaded' });
    const datasetBindingEditorCopy = page.locator('[data-dataset-binding-editor="home"]').first();
    await expect(datasetBindingEditorCopy).toContainText('Insights feed');
    await datasetBindingEditorCopy.getByLabel('Copy binding from').selectOption('home.services.list');
    await datasetBindingEditorCopy.getByRole('button', { name: 'Copy draft' }).click();
    await expect(datasetBindingEditorCopy.getByRole('status')).toContainText('Copied from Services list.');
    await expect(datasetBindingEditorCopy.locator('article').first()).toBeVisible({ timeout: 30_000 });
    await expect(datasetBindingEditorCopy).toHaveScreenshot('builder-dataset-binding-editor-copy.png');

    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('/ko/builder/home/datasets?targetId=home.insights.feed&limit=2', { waitUntil: 'domcontentloaded' });
    const datasetBindingEditorCopyMobile = page.locator('[data-dataset-binding-editor="home"]').first();
    await expect(datasetBindingEditorCopyMobile).toContainText('Insights feed');
    await datasetBindingEditorCopyMobile.getByLabel('Copy binding from').selectOption('home.services.list');
    await datasetBindingEditorCopyMobile.getByRole('button', { name: 'Copy draft' }).click();
    await expect(datasetBindingEditorCopyMobile.getByRole('status')).toContainText('Copied from Services list.');
    await expect(datasetBindingEditorCopyMobile.locator('article').first()).toBeVisible({ timeout: 30_000 });
    await expect(datasetBindingEditorCopyMobile).toHaveScreenshot('builder-dataset-binding-editor-copy.mobile.png');

    await page.setViewportSize({ width: 834, height: 1112 });
    await page.goto('/ko/builder/home/datasets?targetId=home.insights.feed&limit=2', { waitUntil: 'domcontentloaded' });
    const datasetBindingEditorCopyTablet = page.locator('[data-dataset-binding-editor="home"]').first();
    await expect(datasetBindingEditorCopyTablet).toContainText('Insights feed');
    await datasetBindingEditorCopyTablet.getByLabel('Copy binding from').selectOption('home.services.list');
    await datasetBindingEditorCopyTablet.getByRole('button', { name: 'Copy draft' }).click();
    await expect(datasetBindingEditorCopyTablet.getByRole('status')).toContainText('Copied from Services list.');
    await expect(datasetBindingEditorCopyTablet.locator('article').first()).toBeVisible({ timeout: 30_000 });
    await expect(datasetBindingEditorCopyTablet).toHaveScreenshot('builder-dataset-binding-editor-copy.tablet.png');

    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('/ko/builder/home/datasets?targetId=home.services.list&limit=6', { waitUntil: 'domcontentloaded' });
    const datasetBindingEditorMobile = page.locator('[data-dataset-binding-editor="home"]').first();
    await expect(datasetBindingEditorMobile).toContainText('Services list');
    await expect(datasetBindingEditorMobile.locator('article').first()).toBeVisible({ timeout: 30_000 });
    await expect(datasetBindingEditorMobile).toHaveScreenshot('builder-dataset-binding-editor.mobile.png');

    await page.setViewportSize({ width: 834, height: 1112 });
    await page.goto('/ko/builder/home/datasets?targetId=home.services.list&limit=6', { waitUntil: 'domcontentloaded' });
    const datasetBindingEditorTablet = page.locator('[data-dataset-binding-editor="home"]').first();
    await expect(datasetBindingEditorTablet).toContainText('Services list');
    await expect(datasetBindingEditorTablet.locator('article').first()).toBeVisible({ timeout: 30_000 });
    await expect(datasetBindingEditorTablet).toHaveScreenshot('builder-dataset-binding-editor.tablet.png');

    const dynamicListVisualPage = await ensurePublishedDynamicListVisualPage(page.request);
    await page.setViewportSize({ width: 1280, height: 900 });
    await page.goto(`${dynamicListVisualPage.path}?sort=title:asc&perPage=1`, { waitUntil: 'domcontentloaded' });
    await expect(page.getByLabel('Dynamic list visitor filters')).toBeVisible();
    await expect(page.getByLabel('Dynamic list pagination')).toContainText('1 /');
    await expect(page).toHaveScreenshot('published-dynamic-list-visitor-filters.png');
    await page.getByRole('link', { name: 'Title descending' }).click();
    await page.waitForLoadState('domcontentloaded');
    await expect(page.getByLabel('Dynamic list sort')).toBeVisible();
    await expect(page.getByLabel('Dynamic list pagination')).toContainText('1 /');
    await expect(page).toHaveScreenshot('published-dynamic-list-sort-desc.png');
    await page.getByRole('link', { name: 'Clear filters' }).click();
    await page.waitForLoadState('domcontentloaded');
    await expect(page.getByLabel('Dynamic list pagination')).toContainText('1 /');
    await expect(page).toHaveScreenshot('published-dynamic-list-default.png');
    await page.goto(`${dynamicListVisualPage.path}?filter[title]=does-not-exist-${DYNAMIC_LIST_VISUAL_SCOPE}`, {
      waitUntil: 'domcontentloaded',
    });
    await expect(page.getByLabel('Dynamic list visitor filters')).toBeVisible();
    await expect(page.locator('[data-builder-dynamic-list-empty-state="true"]')).toBeVisible();
    await expect(page).toHaveScreenshot('published-dynamic-list-empty.png');

    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto(`${dynamicListVisualPage.path}?filter[title]=does-not-exist-${DYNAMIC_LIST_VISUAL_SCOPE}`, {
      waitUntil: 'domcontentloaded',
    });
    await expect(page.getByLabel('Dynamic list visitor filters')).toBeVisible();
    await expect(page.locator('[data-builder-dynamic-list-empty-state="true"]')).toBeVisible();
    await expect(page).toHaveScreenshot('published-dynamic-list-empty.mobile.png');

    await page.setViewportSize({ width: 834, height: 1112 });
    await page.goto(`${dynamicListVisualPage.path}?filter[title]=does-not-exist-${DYNAMIC_LIST_VISUAL_SCOPE}`, {
      waitUntil: 'domcontentloaded',
    });
    await expect(page.getByLabel('Dynamic list visitor filters')).toBeVisible();
    await expect(page.locator('[data-builder-dynamic-list-empty-state="true"]')).toBeVisible();
    await expect(page).toHaveScreenshot('published-dynamic-list-empty.tablet.png');

    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto(`${dynamicListVisualPage.path}?sort=title:asc&perPage=1`, { waitUntil: 'domcontentloaded' });
    await expect(page.getByLabel('Dynamic list visitor filters')).toBeVisible();
    await expect(page.getByLabel('Dynamic list pagination')).toContainText('1 /');
    await expect(page).toHaveScreenshot('published-dynamic-list-visitor-filters.mobile.png');
    await page.getByRole('link', { name: 'Title descending' }).click();
    await page.waitForLoadState('domcontentloaded');
    await expect(page.getByLabel('Dynamic list sort')).toBeVisible();
    await expect(page.getByLabel('Dynamic list pagination')).toContainText('1 /');
    await expect(page).toHaveScreenshot('published-dynamic-list-sort-desc.mobile.png');

    await page.setViewportSize({ width: 834, height: 1112 });
    await page.goto(`${dynamicListVisualPage.path}?sort=title:asc&perPage=1`, { waitUntil: 'domcontentloaded' });
    await expect(page.getByLabel('Dynamic list visitor filters')).toBeVisible();
    await expect(page.getByLabel('Dynamic list pagination')).toContainText('1 /');
    await expect(page).toHaveScreenshot('published-dynamic-list-visitor-filters.tablet.png');
    await page.getByRole('link', { name: 'Title descending' }).click();
    await page.waitForLoadState('domcontentloaded');
    await expect(page.getByLabel('Dynamic list sort')).toBeVisible();
    await expect(page.getByLabel('Dynamic list pagination')).toContainText('1 /');
    await expect(page).toHaveScreenshot('published-dynamic-list-sort-desc.tablet.png');

    await page.request.delete(`/api/builder/site/pages/${dynamicListVisualPage.pageId}?locale=ko`, {
      headers: { 'x-forwarded-for': `pw-${DYNAMIC_LIST_VISUAL_SCOPE}` },
    }).catch(() => undefined);
  });

  test('captures CMS-backed published dynamic list visual baselines', async ({ page }) => {
    test.setTimeout(120_000);

    const dynamicListVisualPage = await ensurePublishedCmsDynamicListVisualPage(page.request);
    try {
      await page.setViewportSize({ width: 1280, height: 900 });
      await page.goto(dynamicListVisualPage.path, { waitUntil: 'domcontentloaded' });
      const repeater = page.locator('[data-node-id="dynamic-list-repeater-columns"]');
      await expect(repeater).toBeVisible();
      await expect(repeater.locator('[data-builder-repeater-item="true"]')).toHaveCount(2);
      await expect(repeater).toContainText('Visual CMS Column One');
      await expect(repeater).toHaveScreenshot('published-cms-dynamic-list-runtime.png');

      await page.setViewportSize({ width: 390, height: 844 });
      await page.goto(dynamicListVisualPage.path, { waitUntil: 'domcontentloaded' });
      await expect(repeater).toBeVisible();
      await expect(repeater.locator('[data-builder-repeater-item="true"]')).toHaveCount(2);
      await expect(repeater).toHaveScreenshot('published-cms-dynamic-list-runtime.mobile.png');

      await page.setViewportSize({ width: 834, height: 1112 });
      await page.goto(dynamicListVisualPage.path, { waitUntil: 'domcontentloaded' });
      await expect(repeater).toBeVisible();
      await expect(repeater.locator('[data-builder-repeater-item="true"]')).toHaveCount(2);
      await expect(repeater).toHaveScreenshot('published-cms-dynamic-list-runtime.tablet.png');
    } finally {
      await page.request.delete(`/api/builder/site/pages/${dynamicListVisualPage.pageId}?locale=ko`, {
        headers: { 'x-forwarded-for': `pw-${CMS_DYNAMIC_LIST_VISUAL_SCOPE}` },
      }).catch(() => undefined);
      await dynamicListVisualPage.restoreSiteDocument().catch(() => undefined);
    }
  });

  test('captures public FAQ hash-open visual baselines', async ({ page }) => {
    test.setTimeout(120_000);

    const token = `visual-faq-${Date.now().toString(36)}`;
    const makeFaq = async (question: string, answer: string, sortOrder: number) => {
      const response = await page.request.post('/api/builder/faq', {
        headers: { 'x-forwarded-for': `pw-${token}` },
        data: {
          locale: FAQ_VISUAL_LOCALE,
          question,
          answer,
          categoryId: 'consultation',
          tags: ['visual-faq', token],
          status: 'published',
          sortOrder,
          schemaEnabled: true,
        },
      });
      expect(response.status()).toBe(201);
      const json = await response.json() as { ok?: boolean; item?: { faqId: string; slug: string; question: string }; error?: string };
      expect(json.ok, json.error).toBe(true);
      expect(json.item?.faqId).toBeTruthy();
      return json.item!;
    };

    const firstFaq = await makeFaq(`Visual FAQ question ${token} A`, `Visual FAQ answer ${token} A`, 1);
    const secondFaq = await makeFaq(`Visual FAQ question ${token} B`, `Visual FAQ answer ${token} B`, 2);

    try {
      const faqHash = encodeURIComponent(secondFaq.slug);
      const faqQuestion = secondFaq.question;

      await page.setViewportSize({ width: 1280, height: 900 });
      await page.goto(`/${FAQ_VISUAL_LOCALE}/faq?q=${encodeURIComponent(token)}#${faqHash}`, { waitUntil: 'domcontentloaded' });
      const faqExplorer = page.locator('[data-public-faq-explorer="true"]');
      const faqTargetItem = page.locator('[data-public-faq-item]').filter({ hasText: faqQuestion }).first();
      await expect(faqExplorer).toContainText(faqQuestion);
      await expect(faqTargetItem.locator('button').first()).toHaveAttribute('aria-expanded', 'true');
      await expect(faqExplorer).toHaveScreenshot('public-faq-hash-open.png');

      await page.setViewportSize({ width: 390, height: 844 });
      await page.goto(`/${FAQ_VISUAL_LOCALE}/faq?q=${encodeURIComponent(token)}#${faqHash}`, { waitUntil: 'domcontentloaded' });
      await expect(page.locator('[data-public-faq-explorer="true"]')).toContainText(faqQuestion);
      await expect(page.locator('[data-public-faq-item]').filter({ hasText: faqQuestion }).first().locator('button').first()).toHaveAttribute('aria-expanded', 'true');
      await expect(page.locator('[data-public-faq-explorer="true"]')).toHaveScreenshot('public-faq-hash-open.mobile.png');

      await page.setViewportSize({ width: 834, height: 1112 });
      await page.goto(`/${FAQ_VISUAL_LOCALE}/faq?q=${encodeURIComponent(token)}#${faqHash}`, { waitUntil: 'domcontentloaded' });
      await expect(page.locator('[data-public-faq-explorer="true"]')).toContainText(faqQuestion);
      await expect(page.locator('[data-public-faq-item]').filter({ hasText: faqQuestion }).first().locator('button').first()).toHaveAttribute('aria-expanded', 'true');
      await expect(page.locator('[data-public-faq-explorer="true"]')).toHaveScreenshot('public-faq-hash-open.tablet.png');
    } finally {
      await page.request.delete(`/api/builder/faq/${firstFaq.faqId}`, {
        headers: { 'x-forwarded-for': `pw-${token}` },
        failOnStatusCode: false,
      }).catch(() => undefined);
      await page.request.delete(`/api/builder/faq/${secondFaq.faqId}`, {
        headers: { 'x-forwarded-for': `pw-${token}` },
        failOnStatusCode: false,
      }).catch(() => undefined);
    }
  });


  test('captures CMS-backed published dynamic list filter and pagination visual baselines', async ({ page }) => {
    test.setTimeout(120_000);

    const dynamicListVisualPage = await ensurePublishedCmsDynamicListVisualPage(page.request);
    const filteredPath = `${dynamicListVisualPage.path}?sort=title:asc&perPage=1`;
    try {
      await page.setViewportSize({ width: 1280, height: 900 });
      await page.goto(filteredPath, { waitUntil: 'domcontentloaded' });
      await expect(page.getByLabel('Dynamic list visitor filters')).toContainText('sort title:asc');
      await expect(page.getByLabel('Dynamic list pagination')).toContainText('1 /');
      await expect(page.locator('[data-node-id="dynamic-list-repeater-columns"]')).toContainText('Visual CMS Column One');
      await expect(page).toHaveScreenshot('published-cms-dynamic-list-runtime-filtered.png');

      await page.setViewportSize({ width: 390, height: 844 });
      await page.goto(filteredPath, { waitUntil: 'domcontentloaded' });
      await expect(page.getByLabel('Dynamic list visitor filters')).toContainText('sort title:asc');
      await expect(page.getByLabel('Dynamic list pagination')).toContainText('1 /');
      await expect(page).toHaveScreenshot('published-cms-dynamic-list-runtime-filtered.mobile.png');

      await page.setViewportSize({ width: 834, height: 1112 });
      await page.goto(filteredPath, { waitUntil: 'domcontentloaded' });
      await expect(page.getByLabel('Dynamic list visitor filters')).toContainText('sort title:asc');
      await expect(page.getByLabel('Dynamic list pagination')).toContainText('1 /');
      await expect(page).toHaveScreenshot('published-cms-dynamic-list-runtime-filtered.tablet.png');
    } finally {
      await page.request.delete(`/api/builder/site/pages/${dynamicListVisualPage.pageId}?locale=ko`, {
        headers: { 'x-forwarded-for': `pw-${CMS_DYNAMIC_LIST_VISUAL_SCOPE}` },
      }).catch(() => undefined);
      await dynamicListVisualPage.restoreSiteDocument().catch(() => undefined);
    }
  });


async function waitForAllImages(page: Page): Promise<void> {
  await page.waitForFunction(() => {
    const imgs = Array.from(document.querySelectorAll('img'));
    return imgs.every((img) => img.complete && (img.naturalWidth > 0 || (img.getAttribute('src') ?? '').startsWith('data:')));
  }, undefined, { timeout: 15_000 }).catch(() => undefined);
  await page.waitForTimeout(150);
}

  test('captures columns load-more visual baselines', async ({ page }) => {
    test.setTimeout(120_000);

    const { restoreColumns } = await ensurePublishedColumnsLoadMoreVisualData();
    const expandedPath = '/ko/columns?page=2';

    try {
      await page.setViewportSize({ width: 1280, height: 900 });
      await page.goto(expandedPath, { waitUntil: 'domcontentloaded' });
      const grid = page.locator('.columns-grid').first();
      const loadMore = page.locator('[data-columns-load-more="true"]').first();
      await expect(grid).toBeVisible();
      await expect(loadMore).toBeVisible();
      await expect(page.locator('[data-columns-remaining]').first()).toHaveAttribute('data-columns-remaining', /[1-9]\d*/);
      await expect(loadMore).toContainText('더 보기');
      // Lazy images above shift layout while scrollIntoView resolves — wait for
      // every image, then pin the button to the viewport center for a
      // deterministic capture offset.
      await waitForAllImages(page);
      await loadMore.evaluate((element) => element.scrollIntoView({ block: 'center' }));
      await page.waitForTimeout(150);
      await expect(page).toHaveScreenshot('columns-load-more-expanded.png');

      await page.setViewportSize({ width: 390, height: 844 });
      await page.goto(expandedPath, { waitUntil: 'domcontentloaded' });
      await expect(page.locator('.columns-grid')).toBeVisible();
      await expect(page.locator('[data-columns-load-more="true"]').first()).toBeVisible();
      await waitForAllImages(page);
      await page.locator('[data-columns-load-more="true"]').first().evaluate((element) => element.scrollIntoView({ block: 'center' }));
      await page.waitForTimeout(150);
      await expect(page).toHaveScreenshot('columns-load-more-expanded.mobile.png');

      await page.setViewportSize({ width: 834, height: 1112 });
      await page.goto(expandedPath, { waitUntil: 'domcontentloaded' });
      await expect(page.locator('.columns-grid')).toBeVisible();
      await expect(page.locator('[data-columns-load-more="true"]').first()).toBeVisible();
      await waitForAllImages(page);
      await page.locator('[data-columns-load-more="true"]').first().evaluate((element) => element.scrollIntoView({ block: 'center' }));
      await page.waitForTimeout(150);
      await expect(page).toHaveScreenshot('columns-load-more-expanded.tablet.png');
    } finally {
      await restoreColumns().catch(() => undefined);
    }
  });

  test('captures CMS-backed published service dynamic list visual baselines', async ({ page }) => {
    test.setTimeout(120_000);

    const dynamicListVisualPage = await ensurePublishedCmsServiceDynamicListVisualPage(page.request);
    try {
      await page.setViewportSize({ width: 1280, height: 900 });
      await page.goto(dynamicListVisualPage.path, { waitUntil: 'domcontentloaded' });
      const repeater = page.locator('[data-node-id="dynamic-list-repeater-service-areas"]');
      await expect(repeater).toBeVisible();
      await expect(repeater.locator('[data-builder-repeater-item="true"]')).toHaveCount(2);
      await expect(repeater).toContainText('Visual CMS Service One');
      await expect(page).toHaveScreenshot('published-cms-service-dynamic-list-runtime.png');

      await page.setViewportSize({ width: 390, height: 844 });
      await page.goto(dynamicListVisualPage.path, { waitUntil: 'domcontentloaded' });
      await expect(page.locator('[data-node-id="dynamic-list-repeater-service-areas"]')).toBeVisible();
      await expect(page.locator('[data-node-id="dynamic-list-repeater-service-areas"]').locator('[data-builder-repeater-item="true"]')).toHaveCount(2);
      await expect(page).toHaveScreenshot('published-cms-service-dynamic-list-runtime.mobile.png');

      await page.setViewportSize({ width: 834, height: 1112 });
      await page.goto(dynamicListVisualPage.path, { waitUntil: 'domcontentloaded' });
      await expect(page.locator('[data-node-id="dynamic-list-repeater-service-areas"]')).toBeVisible();
      await expect(page.locator('[data-node-id="dynamic-list-repeater-service-areas"]').locator('[data-builder-repeater-item="true"]')).toHaveCount(2);
      await expect(page).toHaveScreenshot('published-cms-service-dynamic-list-runtime.tablet.png');
    } finally {
      await page.request.delete(`/api/builder/site/pages/${dynamicListVisualPage.pageId}?locale=ko`, {
        headers: { 'x-forwarded-for': `pw-${CMS_DYNAMIC_LIST_VISUAL_SCOPE}` },
      }).catch(() => undefined);
      await dynamicListVisualPage.restoreSiteDocument().catch(() => undefined);
    }
  });

  test('captures CMS-backed published attorney dynamic list visual baselines', async ({ page }) => {
    test.setTimeout(120_000);

    const dynamicListVisualPage = await ensurePublishedCmsAttorneyDynamicListVisualPage(page.request);
    try {
      await page.setViewportSize({ width: 1280, height: 900 });
      await page.goto(dynamicListVisualPage.path, { waitUntil: 'domcontentloaded' });
      const repeater = page.locator('[data-node-id="dynamic-list-repeater-attorney-profiles"]');
      await expect(repeater).toBeVisible();
      await expect(repeater.locator('[data-builder-repeater-item="true"]')).toHaveCount(2);
      await expect(repeater).toContainText('Visual CMS Attorney One');
      await expect(page).toHaveScreenshot('published-cms-attorney-dynamic-list-runtime.png');

      await page.setViewportSize({ width: 390, height: 844 });
      await page.goto(dynamicListVisualPage.path, { waitUntil: 'domcontentloaded' });
      await expect(page.locator('[data-node-id="dynamic-list-repeater-attorney-profiles"]')).toBeVisible();
      await expect(page.locator('[data-node-id="dynamic-list-repeater-attorney-profiles"]').locator('[data-builder-repeater-item="true"]')).toHaveCount(2);
      await expect(page).toHaveScreenshot('published-cms-attorney-dynamic-list-runtime.mobile.png');

      await page.setViewportSize({ width: 834, height: 1112 });
      await page.goto(dynamicListVisualPage.path, { waitUntil: 'domcontentloaded' });
      await expect(page.locator('[data-node-id="dynamic-list-repeater-attorney-profiles"]')).toBeVisible();
      await expect(page.locator('[data-node-id="dynamic-list-repeater-attorney-profiles"]').locator('[data-builder-repeater-item="true"]')).toHaveCount(2);
      await expect(page).toHaveScreenshot('published-cms-attorney-dynamic-list-runtime.tablet.png');
    } finally {
      await page.request.delete(`/api/builder/site/pages/${dynamicListVisualPage.pageId}?locale=ko`, {
        headers: { 'x-forwarded-for': `pw-${CMS_DYNAMIC_LIST_VISUAL_SCOPE}` },
      }).catch(() => undefined);
      await dynamicListVisualPage.restoreSiteDocument().catch(() => undefined);
    }
  });

  test('captures CMS-backed published dynamic item visual baselines', async ({ page }) => {
    test.setTimeout(120_000);

    const dynamicItemVisualPage = await ensurePublishedCmsDynamicItemVisualPage(page.request);
    try {
      await page.setViewportSize({ width: 1280, height: 900 });
      await page.goto(dynamicItemVisualPage.path, { waitUntil: 'domcontentloaded' });
      await expect(page.locator('[data-node-id="dynamic-item-title-service-areas"]').first()).toContainText(
        '투자·법인설립',
      );
      await expect(page.locator('meta[name="description"]')).toHaveAttribute(
        'content',
        'Visual CMS service subtitle',
      );
      await expect(page).toHaveScreenshot('published-cms-dynamic-item-runtime.png');

      await page.setViewportSize({ width: 390, height: 844 });
      await page.goto(dynamicItemVisualPage.path, { waitUntil: 'domcontentloaded' });
      await expect(page.locator('[data-node-id="dynamic-item-title-service-areas"]').first()).toContainText(
        '투자·법인설립',
      );
      await expect(page).toHaveScreenshot('published-cms-dynamic-item-runtime.mobile.png');

      await page.setViewportSize({ width: 834, height: 1112 });
      await page.goto(dynamicItemVisualPage.path, { waitUntil: 'domcontentloaded' });
      await expect(page.locator('[data-node-id="dynamic-item-title-service-areas"]').first()).toContainText(
        '투자·법인설립',
      );
      await expect(page).toHaveScreenshot('published-cms-dynamic-item-runtime.tablet.png');
    } finally {
      await page.request.delete(`/api/builder/site/pages/${dynamicItemVisualPage.pageId}?locale=ko`, {
        headers: { 'x-forwarded-for': `pw-${CMS_DYNAMIC_LIST_VISUAL_SCOPE}` },
      }).catch(() => undefined);
      await dynamicItemVisualPage.restoreSiteDocument().catch(() => undefined);
    }
  });

  test('captures CMS-backed published columns dynamic item visual baselines', async ({ page }) => {
    test.setTimeout(120_000);

    const dynamicItemVisualPage = await ensurePublishedCmsColumnsDynamicItemVisualPage(page.request);
    try {
      await page.setViewportSize({ width: 1280, height: 900 });
      await page.goto(dynamicItemVisualPage.path, { waitUntil: 'domcontentloaded' });
      await expect(page.locator('[data-node-id="dynamic-item-title-columns"]').first()).toContainText(
        'Visual CMS Column Item',
      );
      await expect(page.locator('meta[name="description"]')).toHaveAttribute(
        'content',
        'Visual CMS column item summary',
      );
      await expect(page).toHaveScreenshot('published-cms-columns-dynamic-item-runtime.png');

      await page.setViewportSize({ width: 390, height: 844 });
      await page.goto(dynamicItemVisualPage.path, { waitUntil: 'domcontentloaded' });
      await expect(page.locator('[data-node-id="dynamic-item-title-columns"]').first()).toContainText(
        'Visual CMS Column Item',
      );
      await expect(page).toHaveScreenshot('published-cms-columns-dynamic-item-runtime.mobile.png');

      await page.setViewportSize({ width: 834, height: 1112 });
      await page.goto(dynamicItemVisualPage.path, { waitUntil: 'domcontentloaded' });
      await expect(page.locator('[data-node-id="dynamic-item-title-columns"]').first()).toContainText(
        'Visual CMS Column Item',
      );
      await expect(page).toHaveScreenshot('published-cms-columns-dynamic-item-runtime.tablet.png');
    } finally {
      await page.request.delete(`/api/builder/site/pages/${dynamicItemVisualPage.pageId}?locale=ko`, {
        headers: { 'x-forwarded-for': `pw-${CMS_DYNAMIC_LIST_VISUAL_SCOPE}` },
      }).catch(() => undefined);
      await dynamicItemVisualPage.restoreSiteDocument().catch(() => undefined);
    }
  });

  test('captures service and lawyer source editor visual baselines', async ({ page }) => {
    test.setTimeout(120_000);

    await page.setViewportSize({ width: 1280, height: 900 });
    await page.goto('/ko/admin-builder/services', { waitUntil: 'domcontentloaded' });
    await expect(page.getByRole('heading', { name: 'Service records' })).toBeVisible();
    const serviceSurface = page.locator('[data-service-source-manager]').first();
    await page.evaluate(() => {
      const active = document.activeElement;
      if (active instanceof HTMLElement) active.blur();
    });
    await expect(serviceSurface).toHaveScreenshot('admin-builder-service-source-editor.png');

    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('/ko/admin-builder/services', { waitUntil: 'domcontentloaded' });
    await expect(page.getByRole('heading', { name: 'Service records' })).toBeVisible();
    const serviceSurfaceMobile = page.locator('[data-service-source-manager]').first();
    await page.evaluate(() => {
      const active = document.activeElement;
      if (active instanceof HTMLElement) active.blur();
    });
    await expect(serviceSurfaceMobile).toHaveScreenshot('admin-builder-service-source-editor.mobile.png');

    await page.setViewportSize({ width: 834, height: 1112 });
    await page.goto('/ko/admin-builder/services', { waitUntil: 'domcontentloaded' });
    await expect(page.getByRole('heading', { name: 'Service records' })).toBeVisible();
    const serviceSurfaceTablet = page.locator('[data-service-source-manager]').first();
    await page.evaluate(() => {
      const active = document.activeElement;
      if (active instanceof HTMLElement) active.blur();
    });
    await expect(serviceSurfaceTablet).toHaveScreenshot('admin-builder-service-source-editor.tablet.png');

    await page.setViewportSize({ width: 1280, height: 900 });
    await page.goto('/ko/admin-builder/lawyers', { waitUntil: 'domcontentloaded' });
    await expect(page.getByRole('heading', { name: 'Lawyer records' })).toBeVisible();
    const lawyerSurface = page.locator('[data-lawyer-source-manager]').first();
    await page.evaluate(() => {
      const active = document.activeElement;
      if (active instanceof HTMLElement) active.blur();
    });
    await expect(lawyerSurface).toHaveScreenshot('admin-builder-lawyer-source-editor.png');

    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('/ko/admin-builder/lawyers', { waitUntil: 'domcontentloaded' });
    await expect(page.getByRole('heading', { name: 'Lawyer records' })).toBeVisible();
    const lawyerSurfaceMobile = page.locator('[data-lawyer-source-manager]').first();
    await page.evaluate(() => {
      const active = document.activeElement;
      if (active instanceof HTMLElement) active.blur();
    });
    await expect(lawyerSurfaceMobile).toHaveScreenshot('admin-builder-lawyer-source-editor.mobile.png');

    await page.setViewportSize({ width: 834, height: 1112 });
    await page.goto('/ko/admin-builder/lawyers', { waitUntil: 'domcontentloaded' });
    await expect(page.getByRole('heading', { name: 'Lawyer records' })).toBeVisible();
    const lawyerSurfaceTablet = page.locator('[data-lawyer-source-manager]').first();
    await page.evaluate(() => {
      const active = document.activeElement;
      if (active instanceof HTMLElement) active.blur();
    });
    await expect(lawyerSurfaceTablet).toHaveScreenshot('admin-builder-lawyer-source-editor.tablet.png');
  });

  test('captures nested page tree visual baselines', async ({ page }) => {
    test.setTimeout(120_000);

    const treeFixture = await ensureNestedPageTreeVisualFixture(page.request);
    try {
      await page.setViewportSize({ width: 1280, height: 900 });
      await openBuilder(page, `/ko/admin-builder?pageId=${encodeURIComponent(treeFixture.parentPageId)}`);
      await page.getByRole('button', { name: /^Pages$|^페이지$/ }).click();
      const pagesDrawer = page.locator('[data-page-switcher-tree="true"]').first();
      await expect(pagesDrawer).toBeVisible();
      await maskNestedTreeRows(page, [treeFixture.parentPageId, treeFixture.childOnePageId, treeFixture.childTwoPageId]);
      const parentRow = page.locator(`[data-builder-page-row="${treeFixture.parentPageId}"]`).first();
      const childOneRow = page.locator(`[data-builder-page-row="${treeFixture.childOnePageId}"]`).first();
      const childTwoRow = page.locator(`[data-builder-page-row="${treeFixture.childTwoPageId}"]`).first();
      await expect(parentRow).toHaveAttribute('data-builder-page-depth', '0');
      await expect(childOneRow).toHaveAttribute('data-builder-page-depth', '1');
      await expect(childTwoRow).toHaveAttribute('data-builder-page-depth', '1');
      await page.evaluate(() => {
        const active = document.activeElement;
        if (active instanceof HTMLElement) active.blur();
      });
      await expect(pagesDrawer).toHaveScreenshot('admin-builder-page-switcher-tree.png', { maxDiffPixelRatio: 0.05 });

      await page.setViewportSize({ width: 390, height: 844 });
      await openBuilder(page, `/ko/admin-builder?pageId=${encodeURIComponent(treeFixture.parentPageId)}`);
      await page.getByRole('button', { name: /^Pages$|^페이지$/ }).click();
      const pagesDrawerMobile = page.locator('[data-page-switcher-tree="true"]').first();
      await expect(pagesDrawerMobile).toBeVisible();
      await maskNestedTreeRows(page, [treeFixture.parentPageId, treeFixture.childOnePageId, treeFixture.childTwoPageId]);
      await expect(page.locator(`[data-builder-page-row="${treeFixture.parentPageId}"]`)).toHaveAttribute('data-builder-page-depth', '0');
      await expect(page.locator(`[data-builder-page-row="${treeFixture.childOnePageId}"]`)).toHaveAttribute('data-builder-page-depth', '1');
      await expect(page.locator(`[data-builder-page-row="${treeFixture.childTwoPageId}"]`)).toHaveAttribute('data-builder-page-depth', '1');
      await page.evaluate(() => {
        const active = document.activeElement;
        if (active instanceof HTMLElement) active.blur();
      });
      await expect(pagesDrawerMobile).toHaveScreenshot('admin-builder-page-switcher-tree.mobile.png', { maxDiffPixelRatio: 0.05 });

      await page.setViewportSize({ width: 834, height: 1112 });
      await openBuilder(page, `/ko/admin-builder?pageId=${encodeURIComponent(treeFixture.parentPageId)}`);
      await page.getByRole('button', { name: /^Pages$|^페이지$/ }).click();
      const pagesDrawerTablet = page.locator('[data-page-switcher-tree="true"]').first();
      await expect(pagesDrawerTablet).toBeVisible();
      await maskNestedTreeRows(page, [treeFixture.parentPageId, treeFixture.childOnePageId, treeFixture.childTwoPageId]);
      await expect(page.locator(`[data-builder-page-row="${treeFixture.parentPageId}"]`)).toHaveAttribute('data-builder-page-depth', '0');
      await expect(page.locator(`[data-builder-page-row="${treeFixture.childOnePageId}"]`)).toHaveAttribute('data-builder-page-depth', '1');
      await expect(page.locator(`[data-builder-page-row="${treeFixture.childTwoPageId}"]`)).toHaveAttribute('data-builder-page-depth', '1');
      await page.evaluate(() => {
        const active = document.activeElement;
        if (active instanceof HTMLElement) active.blur();
      });
      await expect(pagesDrawerTablet).toHaveScreenshot('admin-builder-page-switcher-tree.tablet.png', { maxDiffPixelRatio: 0.05 });
    } finally {
      await treeFixture.cleanup().catch(() => undefined);
    }
  });

  test('captures page switcher quick-create visual baselines', async ({ page }) => {
    test.setTimeout(120_000);

    const treeFixture = await ensureNestedPageTreeVisualFixture(page.request);
    try {
      await page.setViewportSize({ width: 1280, height: 900 });
      await openBuilder(page, `/ko/admin-builder?pageId=${encodeURIComponent(treeFixture.parentPageId)}`);
      await page.getByRole('button', { name: /^Pages$|^페이지$/ }).click();
      await maskPageSwitcherRows(page);
      await page.evaluate(() => {
        const active = document.activeElement;
        if (active instanceof HTMLElement) active.blur();
      });
      const quickCreateCard = page.locator('[data-page-switcher-quick-create="dynamic-list"]').first();
      await expect(quickCreateCard).toBeVisible();
      await expect(quickCreateCard).toHaveScreenshot('admin-builder-page-switcher-quick-create.png');

      await page.setViewportSize({ width: 390, height: 844 });
      await openBuilder(page, `/ko/admin-builder?pageId=${encodeURIComponent(treeFixture.parentPageId)}`);
      await page.getByRole('button', { name: /^Pages$|^페이지$/ }).click();
      await maskPageSwitcherRows(page);
      await page.evaluate(() => {
        const active = document.activeElement;
        if (active instanceof HTMLElement) active.blur();
      });
      const quickCreateCardMobile = page.locator('[data-page-switcher-quick-create="dynamic-list"]').first();
      await expect(quickCreateCardMobile).toBeVisible();
      await expect(quickCreateCardMobile).toHaveScreenshot('admin-builder-page-switcher-quick-create.mobile.png');

      await page.setViewportSize({ width: 834, height: 1112 });
      await openBuilder(page, `/ko/admin-builder?pageId=${encodeURIComponent(treeFixture.parentPageId)}`);
      await page.getByRole('button', { name: /^Pages$|^페이지$/ }).click();
      await maskPageSwitcherRows(page);
      await page.evaluate(() => {
        const active = document.activeElement;
        if (active instanceof HTMLElement) active.blur();
      });
      const quickCreateCardTablet = page.locator('[data-page-switcher-quick-create="dynamic-list"]').first();
      await expect(quickCreateCardTablet).toBeVisible();
      await expect(quickCreateCardTablet).toHaveScreenshot('admin-builder-page-switcher-quick-create.tablet.png');
    } finally {
      await treeFixture.cleanup().catch(() => undefined);
    }
  });
});

async function ensureCmsDeepLinkFixture(request: APIRequestContext): Promise<void> {
  const headers = { 'x-forwarded-for': `pw-${CMS_DEEPLINK_SCOPE}` };
  const collectionResponse = await request.get(
    `/api/builder/sites/default/collections/${encodeURIComponent(CMS_DEEPLINK_COLLECTION_ID)}?locale=ko`,
    { headers },
  );
  if (collectionResponse.status() === 404) {
    const createResponse = await request.post('/api/builder/sites/default/collections?locale=ko', {
      headers,
      data: {
        collectionId: CMS_DEEPLINK_COLLECTION_ID,
        name: 'Visual CMS Deep Link',
        description: 'Stable visual-regression collection for deep-linked record editing.',
        fields: [
          {
            fieldId: 'field-title',
            key: 'title',
            label: 'Title',
            type: 'text',
            localized: true,
            repeated: false,
            required: true,
          },
          {
            fieldId: 'field-slug',
            key: 'slug',
            label: 'Slug',
            type: 'slug',
            localized: false,
            repeated: false,
            required: true,
            unique: true,
          },
          {
            fieldId: 'field-summary',
            key: 'summary',
            label: 'Summary',
            type: 'rich-text',
            localized: true,
            repeated: false,
            required: false,
          },
        ],
      },
    });
    expect(createResponse.status()).toBe(201);
  }

  const detailResponse = await request.get(
    `/api/builder/sites/default/collections/${encodeURIComponent(CMS_DEEPLINK_COLLECTION_ID)}?locale=ko`,
    { headers },
  );
  expect(detailResponse.status()).toBe(200);
  const detail = await detailResponse.json() as {
    ok?: boolean;
    detail?: {
      records?: { recordId: string }[];
    };
  };
  expect(detail.ok).toBe(true);
  const records = detail.detail?.records ?? [];
  const baselineFields = {
    title: 'Visual deep-link record',
    slug: 'visual-deep-link-record',
    summary: 'Stable deep-link screenshot record.',
  };
  if (!records.some((record) => record.recordId === CMS_DEEPLINK_RECORD_ID)) {
    const createRecordResponse = await request.post(
      `/api/builder/sites/default/collections/${encodeURIComponent(CMS_DEEPLINK_COLLECTION_ID)}/records?locale=ko`,
      {
        headers,
        data: {
          recordId: CMS_DEEPLINK_RECORD_ID,
          fields: baselineFields,
        },
      },
    );
    expect(createRecordResponse.status()).toBe(201);
  } else {
    // The test itself renames the slug later in the flow — reset the surviving
    // record to baseline so the screenshots are run-order independent.
    const resetResponse = await request.patch(
      `/api/builder/sites/default/collections/${encodeURIComponent(CMS_DEEPLINK_COLLECTION_ID)}/records/${encodeURIComponent(CMS_DEEPLINK_RECORD_ID)}?locale=ko`,
      { headers, data: { fields: baselineFields } },
    );
    expect(resetResponse.status()).toBe(200);
  }
}

async function ensureCmsReferencePickerFixture(request: APIRequestContext): Promise<void> {
  const headers = { 'x-forwarded-for': `pw-${CMS_REFERENCE_PICKER_SCOPE}` };
  const collectionResponse = await request.get(
    `/api/builder/sites/default/collections/${encodeURIComponent(CMS_REFERENCE_PICKER_COLLECTION_ID)}?locale=ko`,
    { headers },
  );
  if (collectionResponse.status() === 404) {
    const createResponse = await request.post('/api/builder/sites/default/collections?locale=ko', {
      headers,
      data: {
        collectionId: CMS_REFERENCE_PICKER_COLLECTION_ID,
        name: 'Visual CMS Reference Picker',
        description: 'Stable visual-regression collection for the relation picker modal.',
        fields: [
          {
            fieldId: 'field-title',
            key: 'title',
            label: 'Title',
            type: 'text',
            localized: true,
            repeated: false,
            required: true,
          },
          {
            fieldId: 'field-slug',
            key: 'slug',
            label: 'Slug',
            type: 'slug',
            localized: false,
            repeated: false,
            required: true,
            unique: true,
          },
          {
            fieldId: 'field-related',
            key: 'related',
            label: 'Related',
            type: 'reference',
            localized: false,
            repeated: false,
            required: false,
            relationCollectionId: CMS_REFERENCE_PICKER_COLLECTION_ID,
          },
        ],
      },
    });
    expect(createResponse.status()).toBe(201);
  }

  const detailResponse = await request.get(
    `/api/builder/sites/default/collections/${encodeURIComponent(CMS_REFERENCE_PICKER_COLLECTION_ID)}?locale=ko`,
    { headers },
  );
  expect(detailResponse.status()).toBe(200);
  const detail = await detailResponse.json() as {
    ok?: boolean;
    detail?: {
      records?: { recordId: string }[];
    };
  };
  expect(detail.ok).toBe(true);
  const records = detail.detail?.records ?? [];

  if (!records.some((record) => record.recordId === CMS_REFERENCE_PICKER_SECONDARY_RECORD_ID)) {
    const createResponse = await request.post(
      `/api/builder/sites/default/collections/${encodeURIComponent(CMS_REFERENCE_PICKER_COLLECTION_ID)}/records?locale=ko`,
      {
        headers,
        data: {
          recordId: CMS_REFERENCE_PICKER_SECONDARY_RECORD_ID,
          fields: {
            title: 'Visual picker secondary',
            slug: 'visual-picker-secondary',
          },
        },
      },
    );
    expect(createResponse.status()).toBe(201);
  }

  const recordPayload = {
    fields: {
      title: 'Visual picker primary',
      slug: 'visual-picker-primary',
      related: CMS_REFERENCE_PICKER_SECONDARY_RECORD_ID,
    },
  };
  if (records.some((record) => record.recordId === CMS_REFERENCE_PICKER_PRIMARY_RECORD_ID)) {
    const patchResponse = await request.patch(
      `/api/builder/sites/default/collections/${encodeURIComponent(CMS_REFERENCE_PICKER_COLLECTION_ID)}/records/${encodeURIComponent(CMS_REFERENCE_PICKER_PRIMARY_RECORD_ID)}?locale=ko`,
      { headers, data: recordPayload },
    );
    expect(patchResponse.status()).toBe(200);
  } else {
    const createResponse = await request.post(
      `/api/builder/sites/default/collections/${encodeURIComponent(CMS_REFERENCE_PICKER_COLLECTION_ID)}/records?locale=ko`,
      {
        headers,
        data: {
          recordId: CMS_REFERENCE_PICKER_PRIMARY_RECORD_ID,
          ...recordPayload,
        },
      },
    );
    expect(createResponse.status()).toBe(201);
  }
}

async function ensurePublishedDynamicListVisualPage(request: APIRequestContext): Promise<{ pageId: string; path: string }> {
  const slug = `vr-dynamic-list-${Date.now().toString(36)}`;
  const headers = { 'x-forwarded-for': `pw-${DYNAMIC_LIST_VISUAL_SCOPE}` };
  const createResponse = await request.post('/api/builder/site/pages', {
    headers,
    data: {
      locale: 'ko',
      slug,
      title: 'Visual dynamic list',
      addToNavigation: false,
      dynamicListCollectionId: 'service-areas',
      dynamicListLimit: 6,
    },
  });
  expect(createResponse.status()).toBe(200);
  const created = await createResponse.json() as { pageId?: string; success?: boolean; error?: string };
  expect(created.success, created.error).toBe(true);
  const pageId = created.pageId;
  expect(pageId).toBeTruthy();
  if (!pageId) {
    throw new Error('Expected published dynamic list fixture page id');
  }

  const publishResponse = await request.post(`/api/builder/site/pages/${pageId}/publish?locale=ko`, {
    headers,
  });
  expect(publishResponse.status()).toBe(200);
  const published = await publishResponse.json() as { ok?: boolean; slug?: string; error?: string };
  expect(published.ok, published.error).toBe(true);

  return {
    pageId,
    path: `/ko/${published.slug ?? slug}`,
  };
}

async function ensurePublishedColumnsLoadMoreVisualData(
): Promise<{ restoreColumns: () => Promise<void> }> {
  const token = Date.now().toString(36);
  const publishedSlugs: string[] = [];

  for (let index = 1; index <= 25; index += 1) {
    const slug = `visual-load-more-${token}-${String(index).padStart(2, '0')}`;
    const now = new Date(Date.now() - (25 - index) * 60_000).toISOString();
    const document: ColumnDocument = {
      version: 1,
      slug,
      locale: 'ko',
      title: `Visual Load More ${index}`,
      summary: `Visual load more summary ${index}`,
      bodyMarkdown: `Visual load more body ${index}`,
      bodyHtml: `<p>Visual load more body ${index}</p>`,
      linkedSlugs: {},
      frontmatter: {
        lastmod: now,
        attorneyReviewStatus: 'reviewed',
        freshness: 'fresh',
        category: 'legal',
        featuredImage: '/images/placeholder-article-hero.jpg',
        publishedAt: now,
      },
      draft: true,
      revision: 1,
      updatedAt: now,
      updatedBy: 'visual-load-more-fixture',
    };
    await writeDraftColumn(document);
    await writePublishedColumn({ ...document, draft: false, updatedAt: now });
    publishedSlugs.push(slug);
  }

  return {
    restoreColumns: async () => {
      for (const slug of [...publishedSlugs].reverse()) {
        await deletePublishedColumn('ko', slug).catch(() => undefined);
        await deleteDraftColumn('ko', slug).catch(() => undefined);
      }
    },
  };
}

function makeCmsCollection(
  collectionId: BuilderCmsCollection['collectionId'],
  overrides: Partial<BuilderCmsCollection> = {},
): BuilderCmsCollection {
  const fields: BuilderCmsFieldDefinition[] =
    collectionId === 'columns'
      ? [
          { fieldId: 'field-slug', key: 'slug', label: 'Slug', type: 'slug', localized: false, repeated: false, required: true, unique: true },
          { fieldId: 'field-title', key: 'title', label: 'Title', type: 'text', localized: false, repeated: false, required: true },
          { fieldId: 'field-summary', key: 'summary', label: 'Summary', type: 'rich-text', localized: false, repeated: false, required: false },
          { fieldId: 'field-content', key: 'content', label: 'Content', type: 'rich-text', localized: false, repeated: false, required: false },
          { fieldId: 'field-category', key: 'category', label: 'Category', type: 'text', localized: false, repeated: false, required: false },
          { fieldId: 'field-date', key: 'date', label: 'Date', type: 'date', localized: false, repeated: false, required: false },
          { fieldId: 'field-featured-image', key: 'featuredImage', label: 'Featured Image', type: 'image', localized: false, repeated: false, required: false },
        ]
      : [];

  return {
    collectionId,
    name: collectionId === 'columns' ? 'Columns' : collectionId,
    slug: collectionId,
    description: collectionId === 'columns' ? 'CMS columns' : `CMS ${collectionId}`,
    localized: true,
    fields,
    indexes: [],
    records: [],
    permissions: { read: ['public'], create: ['staff'], update: ['staff'], delete: ['staff'] },
    createdAt: '2026-05-30T00:00:00.000Z',
    updatedAt: '2026-05-30T00:00:00.000Z',
    ...overrides,
  };
}

async function ensurePublishedCmsDynamicListVisualPage(
  request: APIRequestContext,
): Promise<{ pageId: string; path: string; restoreSiteDocument: () => Promise<void> }> {
  const token = Date.now().toString(36);
  const slug = `visual-cms-dynamic-list-${token}`;
  const headers = { 'x-forwarded-for': `pw-${CMS_DYNAMIC_LIST_VISUAL_SCOPE}` };
  const originalSite = await readSiteDocument('default', 'ko');

  await writeSiteDocument({
    ...originalSite,
    cmsCollections: [
      ...(originalSite.cmsCollections ?? []).filter((collection) => collection.collectionId !== 'columns'),
      makeCmsCollection('columns', {
        records: [
          {
            recordId: `visual-cms-column-one-${token}`,
            status: 'published',
            locale: 'ko',
            fields: {
              slug: `visual-cms-column-one-${token}`,
              title: 'Visual CMS Column One',
              summary: 'Visual CMS column summary one',
              category: 'legal',
              categoryLabel: 'Legal Information',
              date: '2026-05-30',
              featuredImage: { url: '/images/placeholder-article-hero.jpg' },
            },
            createdAt: '2026-05-30T00:00:00.000Z',
            updatedAt: '2026-05-30T00:00:00.000Z',
          },
          {
            recordId: `visual-cms-column-two-${token}`,
            status: 'published',
            locale: 'ko',
            fields: {
              slug: `visual-cms-column-two-${token}`,
              title: 'Visual CMS Column Two',
              summary: 'Visual CMS column summary two',
              category: 'legal',
              categoryLabel: 'Legal Information',
              date: '2026-05-29',
              featuredImage: { url: '/images/placeholder-article-hero.jpg' },
            },
            createdAt: '2026-05-30T00:00:00.000Z',
            updatedAt: '2026-05-30T00:00:00.000Z',
          },
        ],
      }),
    ],
    updatedAt: new Date().toISOString(),
  });

  const createResponse = await request.post('/api/builder/site/pages', {
    headers,
    data: {
      locale: 'ko',
      slug,
      title: 'Visual CMS dynamic list',
      addToNavigation: false,
      dynamicListCollectionId: 'columns',
      dynamicListLimit: 2,
    },
  });
  expect(createResponse.status()).toBe(200);
  const created = await createResponse.json() as { pageId?: string; success?: boolean; error?: string };
  expect(created.success, created.error).toBe(true);
  const pageId = created.pageId;
  expect(pageId).toBeTruthy();
  if (!pageId) {
    throw new Error('Expected published CMS dynamic list fixture page id');
  }

  const publishResponse = await request.post(`/api/builder/site/pages/${pageId}/publish?locale=ko`, {
    headers,
  });
  expect(publishResponse.status()).toBe(200);
  const published = await publishResponse.json() as { ok?: boolean; slug?: string; error?: string };
  expect(published.ok, published.error).toBe(true);

  return {
    pageId,
    path: `/ko/${published.slug ?? slug}`,
    restoreSiteDocument: async () => {
      await writeSiteDocument(originalSite).catch(() => undefined);
    },
  };
}

async function ensurePublishedCmsDynamicItemVisualPage(
  request: APIRequestContext,
): Promise<{ pageId: string; path: string; restoreSiteDocument: () => Promise<void> }> {
  const token = Date.now().toString(36);
  const slug = `visual-cms-dynamic-item-${token}`;
  const recordSlug = `visual-cms-item-${token}`;
  const headers = { 'x-forwarded-for': `pw-${CMS_DYNAMIC_LIST_VISUAL_SCOPE}` };
  const originalSite = await readSiteDocument('default', 'ko');

  await writeSiteDocument({
    ...originalSite,
    cmsCollections: [
      ...(originalSite.cmsCollections ?? []).filter((collection) => collection.collectionId !== 'service-areas'),
      makeCmsCollection('service-areas', {
        records: [
          {
            recordId: recordSlug,
            status: 'published',
            locale: 'ko',
            fields: {
              slug: recordSlug,
              title: 'Visual CMS Service',
              subtitle: 'Visual CMS service subtitle',
              intro: 'Visual CMS service subtitle',
              description: 'Visual CMS service body copy',
              keyPoints: ['Visual CMS service point one', 'Visual CMS service point two'],
              columnSlugs: ['cms-column-published'],
            },
            createdAt: '2026-05-30T00:00:00.000Z',
            updatedAt: '2026-05-30T00:00:00.000Z',
          },
        ],
      }),
    ],
    updatedAt: new Date().toISOString(),
  });

  const createResponse = await request.post('/api/builder/site/pages', {
    headers,
    data: {
      locale: 'ko',
      slug,
      title: 'Visual CMS dynamic item',
      addToNavigation: false,
      dynamicItemCollectionId: 'service-areas',
      dynamicItemRecordSlug: recordSlug,
    },
  });
  expect(createResponse.status()).toBe(200);
  const created = await createResponse.json() as { pageId?: string; success?: boolean; error?: string };
  expect(created.success, created.error).toBe(true);
  const pageId = created.pageId;
  expect(pageId).toBeTruthy();
  if (!pageId) {
    throw new Error('Expected published CMS dynamic item fixture page id');
  }

  const publishResponse = await request.post(`/api/builder/site/pages/${pageId}/publish?locale=ko`, {
    headers,
  });
  expect(publishResponse.status()).toBe(200);
  const published = await publishResponse.json() as { ok?: boolean; slug?: string; error?: string };
  expect(published.ok, published.error).toBe(true);

  return {
    pageId,
    path: `/ko/${published.slug ?? slug}/${recordSlug}`,
    restoreSiteDocument: async () => {
      await writeSiteDocument(originalSite).catch(() => undefined);
    },
  };
}

async function ensurePublishedCmsServiceDynamicListVisualPage(
  request: APIRequestContext,
): Promise<{ pageId: string; path: string; restoreSiteDocument: () => Promise<void> }> {
  const token = Date.now().toString(36);
  const slug = `visual-cms-service-list-${token}`;
  const headers = { 'x-forwarded-for': `pw-${CMS_DYNAMIC_LIST_VISUAL_SCOPE}` };
  const originalSite = await readSiteDocument('default', 'ko');

  await writeSiteDocument({
    ...originalSite,
    cmsCollections: [
      ...(originalSite.cmsCollections ?? []).filter((collection) => collection.collectionId !== 'service-areas'),
      makeCmsCollection('service-areas', {
        records: [
          {
            recordId: `visual-cms-service-one-${token}`,
            status: 'published',
            locale: 'ko',
            fields: {
              slug: `visual-cms-service-one-${token}`,
              title: 'Visual CMS Service One',
              subtitle: 'Visual CMS service subtitle one',
              intro: 'Visual CMS service subtitle one',
              keyPoints: ['Visual CMS service point one', 'Visual CMS service point two'],
              columnSlugs: ['cms-column-published'],
            },
            createdAt: '2026-05-30T00:00:00.000Z',
            updatedAt: '2026-05-30T00:00:00.000Z',
          },
          {
            recordId: `visual-cms-service-two-${token}`,
            status: 'published',
            locale: 'ko',
            fields: {
              slug: `visual-cms-service-two-${token}`,
              title: 'Visual CMS Service Two',
              subtitle: 'Visual CMS service subtitle two',
              intro: 'Visual CMS service subtitle two',
              keyPoints: ['Visual CMS service point three', 'Visual CMS service point four'],
              columnSlugs: ['cms-column-published'],
            },
            createdAt: '2026-05-30T00:00:00.000Z',
            updatedAt: '2026-05-30T00:00:00.000Z',
          },
        ],
      }),
    ],
    updatedAt: new Date().toISOString(),
  });

  const createResponse = await request.post('/api/builder/site/pages', {
    headers,
    data: {
      locale: 'ko',
      slug,
      title: 'Visual CMS service dynamic list',
      addToNavigation: false,
      dynamicListCollectionId: 'service-areas',
      dynamicListLimit: 2,
    },
  });
  expect(createResponse.status()).toBe(200);
  const created = await createResponse.json() as { pageId?: string; success?: boolean; error?: string };
  expect(created.success, created.error).toBe(true);
  const pageId = created.pageId;
  expect(pageId).toBeTruthy();
  if (!pageId) {
    throw new Error('Expected published CMS service dynamic list fixture page id');
  }

  const publishResponse = await request.post(`/api/builder/site/pages/${pageId}/publish?locale=ko`, {
    headers,
  });
  expect(publishResponse.status()).toBe(200);
  const published = await publishResponse.json() as { ok?: boolean; slug?: string; error?: string };
  expect(published.ok, published.error).toBe(true);

  return {
    pageId,
    path: `/ko/${published.slug ?? slug}`,
    restoreSiteDocument: async () => {
      await writeSiteDocument(originalSite).catch(() => undefined);
    },
  };
}

async function ensurePublishedCmsAttorneyDynamicListVisualPage(
  request: APIRequestContext,
): Promise<{ pageId: string; path: string; restoreSiteDocument: () => Promise<void> }> {
  const token = Date.now().toString(36);
  const slug = `visual-cms-attorney-list-${token}`;
  const headers = { 'x-forwarded-for': `pw-${CMS_DYNAMIC_LIST_VISUAL_SCOPE}` };
  const originalSite = await readSiteDocument('default', 'ko');

  await writeSiteDocument({
    ...originalSite,
    cmsCollections: [
      ...(originalSite.cmsCollections ?? []).filter((collection) => collection.collectionId !== 'attorney-profiles'),
      makeCmsCollection('attorney-profiles', {
        records: [
          {
            recordId: `visual-cms-attorney-one-${token}`,
            status: 'published',
            locale: 'ko',
            fields: {
              slug: `visual-cms-attorney-one-${token}`,
              name: 'Visual CMS Attorney One',
              role: 'Partner',
              title: 'Visual CMS Attorney One | Partner',
              description: 'Visual CMS attorney description one',
              summary: ['Visual CMS attorney point one', 'Visual CMS attorney point two'],
              email: `visual-attorney-one-${token}@example.test`,
              image: { url: '/api/builder/assets/hero.webp' },
            },
            createdAt: '2026-05-30T00:00:00.000Z',
            updatedAt: '2026-05-30T00:00:00.000Z',
          },
          {
            recordId: `visual-cms-attorney-two-${token}`,
            status: 'published',
            locale: 'ko',
            fields: {
              slug: `visual-cms-attorney-two-${token}`,
              name: 'Visual CMS Attorney Two',
              role: 'Associate',
              title: 'Visual CMS Attorney Two | Associate',
              description: 'Visual CMS attorney description two',
              summary: ['Visual CMS attorney point three', 'Visual CMS attorney point four'],
              email: `visual-attorney-two-${token}@example.test`,
              image: { url: '/api/builder/assets/hero.webp' },
            },
            createdAt: '2026-05-30T00:00:00.000Z',
            updatedAt: '2026-05-30T00:00:00.000Z',
          },
        ],
      }),
    ],
    updatedAt: new Date().toISOString(),
  });

  const createResponse = await request.post('/api/builder/site/pages', {
    headers,
    data: {
      locale: 'ko',
      slug,
      title: 'Visual CMS attorney dynamic list',
      addToNavigation: false,
      dynamicListCollectionId: 'attorney-profiles',
      dynamicListLimit: 2,
    },
  });
  expect(createResponse.status()).toBe(200);
  const created = await createResponse.json() as { pageId?: string; success?: boolean; error?: string };
  expect(created.success, created.error).toBe(true);
  const pageId = created.pageId;
  expect(pageId).toBeTruthy();
  if (!pageId) {
    throw new Error('Expected published CMS attorney dynamic list fixture page id');
  }

  const publishResponse = await request.post(`/api/builder/site/pages/${pageId}/publish?locale=ko`, {
    headers,
  });
  expect(publishResponse.status()).toBe(200);
  const published = await publishResponse.json() as { ok?: boolean; slug?: string; error?: string };
  expect(published.ok, published.error).toBe(true);

  return {
    pageId,
    path: `/ko/${published.slug ?? slug}`,
    restoreSiteDocument: async () => {
      await writeSiteDocument(originalSite).catch(() => undefined);
    },
  };
}

async function ensurePublishedCmsColumnsDynamicItemVisualPage(
  request: APIRequestContext,
): Promise<{ pageId: string; path: string; restoreSiteDocument: () => Promise<void> }> {
  const token = Date.now().toString(36);
  const slug = `visual-cms-columns-item-${token}`;
  const recordSlug = `visual-cms-column-item-${token}`;
  const headers = { 'x-forwarded-for': `pw-${CMS_DYNAMIC_LIST_VISUAL_SCOPE}` };
  const originalSite = await readSiteDocument('default', 'ko');

  await writeSiteDocument({
    ...originalSite,
    cmsCollections: [
      ...(originalSite.cmsCollections ?? []).filter((collection) => collection.collectionId !== 'columns'),
      makeCmsCollection('columns', {
        records: [
          {
            recordId: recordSlug,
            status: 'published',
            locale: 'ko',
            fields: {
              slug: recordSlug,
              title: 'Visual CMS Column Item',
              summary: 'Visual CMS column item summary',
              category: 'legal',
              date: '2026-05-30',
              featuredImage: { url: '/images/placeholder-article-hero.jpg' },
            },
            createdAt: '2026-05-30T00:00:00.000Z',
            updatedAt: '2026-05-30T00:00:00.000Z',
          },
        ],
      }),
    ],
    updatedAt: new Date().toISOString(),
  });

  const createResponse = await request.post('/api/builder/site/pages', {
    headers,
    data: {
      locale: 'ko',
      slug,
      title: 'Visual CMS columns dynamic item',
      addToNavigation: false,
      dynamicItemCollectionId: 'columns',
      dynamicItemRecordSlug: recordSlug,
    },
  });
  expect(createResponse.status()).toBe(200);
  const created = await createResponse.json() as { pageId?: string; success?: boolean; error?: string };
  expect(created.success, created.error).toBe(true);
  const pageId = created.pageId;
  expect(pageId).toBeTruthy();
  if (!pageId) {
    throw new Error('Expected published CMS columns dynamic item fixture page id');
  }

  const publishResponse = await request.post(`/api/builder/site/pages/${pageId}/publish?locale=ko`, {
    headers,
  });
  expect(publishResponse.status()).toBe(200);
  const published = await publishResponse.json() as { ok?: boolean; slug?: string; error?: string };
  expect(published.ok, published.error).toBe(true);

  return {
    pageId,
    path: `/ko/${published.slug ?? slug}/${recordSlug}`,
    restoreSiteDocument: async () => {
      await writeSiteDocument(originalSite).catch(() => undefined);
    },
  };
}

async function createBuilderPage(
  request: APIRequestContext,
  slug: string,
  title: string,
  scope: string,
): Promise<string> {
  const response = await request.post('/api/builder/site/pages', {
    headers: { 'x-forwarded-for': `pw-${scope}` },
    data: { locale: 'ko', slug, title, blank: true },
  });
  expect(response.status()).toBe(200);
  const payload = (await response.json()) as { success?: boolean; pageId?: string; error?: string };
  expect(payload.success, payload.error).toBe(true);
  expect(payload.pageId).toBeTruthy();
  if (!payload.pageId) {
    throw new Error('Expected builder page id');
  }
  return payload.pageId;
}

async function deleteBuilderPage(
  request: APIRequestContext,
  pageId: string | null,
  scope: string,
): Promise<void> {
  if (!pageId) return;
  await request.delete(`/api/builder/site/pages/${pageId}?locale=ko`, {
    headers: { 'x-forwarded-for': `pw-${scope}` },
    failOnStatusCode: false,
  });
}

async function ensureNestedPageTreeVisualFixture(request: APIRequestContext): Promise<{
  parentPageId: string;
  childOnePageId: string;
  childTwoPageId: string;
  cleanup: () => Promise<void>;
}> {
  const token = Date.now().toString(36);
  const scope = `${PAGE_SWITCHER_TREE_SCOPE}-${token}`;
  const parentSlug = `visual-tree-parent-${token}`;
  const childOneSlug = `${parentSlug}/child-a`;
  const childTwoSlug = `${parentSlug}/child-b`;

  const parentPageId = await createBuilderPage(request, parentSlug, `Visual tree parent ${token}`, scope);
  const childOnePageId = await createBuilderPage(request, childOneSlug, `Visual tree child A ${token}`, scope);
  const childTwoPageId = await createBuilderPage(request, childTwoSlug, `Visual tree child B ${token}`, scope);

  return {
    parentPageId,
    childOnePageId,
    childTwoPageId,
    cleanup: async () => {
      await deleteBuilderPage(request, childTwoPageId, `${scope}-cleanup`);
      await deleteBuilderPage(request, childOnePageId, `${scope}-cleanup`);
      await deleteBuilderPage(request, parentPageId, `${scope}-cleanup`);
    },
  };
}

async function maskNestedTreeRows(page: Page, pageIds: string[]): Promise<void> {
  const keepSelectors = pageIds.map((pageId) => `[data-builder-page-row="${pageId}"]`);
  const hiddenRowRule = `[data-page-switcher="true"] [data-builder-page-row]:not(${keepSelectors.join('):not(')}) { display: none !important; }`;
  const hiddenControlsRule = `[data-page-switcher-tree="true"] [data-page-switcher-menu], [data-page-switcher-tree="true"] [aria-label="페이지 메뉴"], [data-page-switcher-tree="true"] [aria-label="페이지 순서 이동"] { opacity: 0 !important; pointer-events: none !important; }`;
  await page.addStyleTag({ content: `${hiddenRowRule}\n${hiddenControlsRule}` });
}

async function maskPageSwitcherRows(page: Page): Promise<void> {
  await page.addStyleTag({
    content: [
      '[data-page-switcher="true"] [data-builder-page-row] { display: none !important; }',
      '[data-page-switcher="true"] [data-page-switcher-menu] { opacity: 0 !important; pointer-events: none !important; }',
      '[data-page-switcher="true"] [data-builder-create-dynamic-list-page], [data-page-switcher="true"] [data-builder-create-dynamic-item-page] { box-shadow: none !important; }',
    ].join('\n'),
  });
}

/* ──────────────────────────────────────────────────────────────────────────
 * WIX-PERFECT #5 — Template visual regression.
 *
 * The existing 81 baselines cover admin/editor/CMS chrome but NO templates, so the
 * #1 (real images) + #7 (13 rebuilt industry homes) work had no pixel guard. These
 * tests render a template's ACTUAL document through the real published route (page
 * create accepts `document` → normalizeCanvasDocument → published render), then
 * screenshot it — a trustworthy oracle (the real render path, not a reimplemented one),
 * gated by `npm run test:builder-visual`.
 *
 * Self-baseline (real-Wix goldens are impossible/meaningless — Wix's law page ≠ ours).
 * Acceptance: representative templates × 2 breakpoints; a deliberate template change
 * must turn a baseline red.
 * ────────────────────────────────────────────────────────────────────────── */

async function ensurePublishedTemplateVisualPage(
  request: APIRequestContext,
  templateId: string,
): Promise<{ pageId: string; path: string; rootNodeId: string }> {
  const template = getTemplateById(templateId);
  if (!template) throw new Error(`Template not found: ${templateId}`);
  const token = Date.now().toString(36);
  const slug = `vr-template-${templateId}-${token}`;
  const headers = { 'x-forwarded-for': `pw-${TEMPLATE_VISUAL_SCOPE}` };

  // Root node = first parentless node; used as a stable screenshot/wait anchor.
  const rootNode = template.document.nodes.find((node) => !node.parentId) ?? template.document.nodes[0];
  const rootNodeId = rootNode?.id ?? '';

  const createResponse = await request.post('/api/builder/site/pages', {
    headers,
    data: {
      locale: 'ko',
      slug,
      title: `Visual template ${templateId}`,
      addToNavigation: false,
      document: template.document,
    },
  });
  expect(createResponse.status(), `create ${templateId}`).toBe(200);
  const created = await createResponse.json() as { pageId?: string; success?: boolean; error?: string };
  expect(created.success, created.error).toBe(true);
  const pageId = created.pageId;
  if (!pageId) throw new Error(`Expected page id for template ${templateId}`);

  const publishResponse = await request.post(`/api/builder/site/pages/${pageId}/publish?locale=ko`, { headers });
  expect(publishResponse.status(), `publish ${templateId}`).toBe(200);
  const published = await publishResponse.json() as { ok?: boolean; slug?: string; error?: string };
  expect(published.ok, published.error).toBe(true);

  return { pageId, path: `/ko/${published.slug ?? slug}`, rootNodeId };
}

test.describe('template visual regression (WIX-PERFECT #5)', () => {
  // Cover EVERY industry home template (derived from the registry, so new industries are
  // auto-covered). 30 industries × 2 breakpoints. The shared `_shared/industry-home.ts`
  // builder is not a registry template, so it is naturally excluded.
  const TEMPLATE_IDS = getAllTemplates()
    .filter((template) => template.id.endsWith('-home'))
    .map((template) => template.id)
    .sort();
  // Full-page self-baselines over the live published page carry ~1% irreducible jitter
  // (image decode/subpixel + chrome). 3% tolerance absorbs that noise while still catching
  // real template changes decisively (a hero recolor measured ~18%). Layout/structure drift
  // far exceeds 3%; this only suppresses cry-wolf flakes, not regressions.
  const TEMPLATE_SHOT_OPTS = { fullPage: true as const, animations: 'disabled' as const, maxDiffPixelRatio: 0.03 };

  for (const templateId of TEMPLATE_IDS) {
    test(`captures ${templateId} published visual baselines`, async ({ page }) => {
      test.setTimeout(120_000);
      const fixture = await ensurePublishedTemplateVisualPage(page.request, templateId);
      try {
        const anchor = fixture.rootNodeId
          ? page.locator(`[data-node-id="${fixture.rootNodeId}"]`).first()
          : page.locator('main').first();

        await page.setViewportSize({ width: 1280, height: 900 });
        await page.goto(fixture.path, { waitUntil: 'networkidle' });
        await expect(anchor).toBeVisible();
        await stabilizeForScreenshot(page);
        await expect(page).toHaveScreenshot(`template-${templateId}.png`, TEMPLATE_SHOT_OPTS);

        await page.setViewportSize({ width: 390, height: 844 });
        await page.goto(fixture.path, { waitUntil: 'networkidle' });
        await expect(anchor).toBeVisible();
        await stabilizeForScreenshot(page);
        await expect(page).toHaveScreenshot(`template-${templateId}.mobile.png`, TEMPLATE_SHOT_OPTS);
      } finally {
        await page.request.delete(`/api/builder/site/pages/${fixture.pageId}?locale=ko`, {
          headers: { 'x-forwarded-for': `pw-${TEMPLATE_VISUAL_SCOPE}` },
        }).catch(() => undefined);
      }
    });
  }
});

/**
 * Make a published page deterministic for full-page screenshots: trigger any scroll-reveal /
 * lazy-load by scrolling through, force reveal elements to their final state, wait for every
 * image to finish decoding, then reset scroll. Pairs with `animations: 'disabled'`.
 */
async function stabilizeForScreenshot(page: Page): Promise<void> {
  // Scroll to the bottom in steps so IntersectionObserver-driven reveals/lazy images fire.
  await page.evaluate(async () => {
    const step = Math.max(200, Math.floor(window.innerHeight * 0.8));
    for (let y = 0; y <= document.body.scrollHeight; y += step) {
      window.scrollTo(0, y);
      await new Promise((r) => setTimeout(r, 60));
    }
    window.scrollTo(0, 0);
    // Force any still-hidden scroll-reveal elements to their visible end-state so a static
    // capture doesn't catch them mid-transition. Published entrance reveals gate opacity with
    // `[data-anim-state='pending'] { opacity: 0 !important }`, so inline styles cannot win —
    // flip the state attribute to its end state instead.
    for (const el of Array.from(document.querySelectorAll<HTMLElement>('[data-anim-entrance]'))) {
      el.dataset.animState = 'visible';
    }
    for (const el of Array.from(document.querySelectorAll<HTMLElement>('[data-reveal], [data-animate], .reveal, [style*="opacity"]'))) {
      el.style.opacity = '1';
      el.style.transform = 'none';
      el.style.transition = 'none';
    }
  });
  // The published global footer reflects LIVE site navigation (quick links grow as other suite
  // tests add pages), which changes full-page height between runs — exclude it so template
  // baselines only cover the template document itself.
  await page.addStyleTag({
    content: 'footer, [data-builder-global-section="footer"] { display: none !important; }',
  });
  // Wait for all <img> to be fully loaded/decoded.
  await page.waitForFunction(() => {
    const imgs = Array.from(document.querySelectorAll('img'));
    return imgs.every((img) => img.complete && (img.naturalWidth > 0 || img.getAttribute('src')?.startsWith('data:')));
  }, { timeout: 10_000 }).catch(() => undefined);
  await page.waitForTimeout(300);
}

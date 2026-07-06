import { expect, test } from '@playwright/test';
import { openBuilder } from './helpers/editor';
import {
  createRepeaterLoadingPage,
  deleteRepeaterLoadingPage,
  mutationHeaders,
  putHomeDatasetTarget,
  readHomeDatasetTarget,
  saveRepeaterLoadingDraft,
  selectLayerNode,
  type DatasetBindingPayload,
} from './helpers/repeater-canvas-loading';

const HOME_INSIGHTS_TARGET_ID = 'home.insights.feed';

test('/ko/admin-builder shows canvas-level repeater loading skeleton before records resolve', async ({ page }) => {
  test.setTimeout(90_000);

  const token = Date.now().toString(36);
  const slug = `repeater-loading-${token}`;
  const repeaterId = `repeater-loading-${token}`;
  let pageId: string | null = null;
  let originalHomeBinding: DatasetBindingPayload | null = null;
  await page.setExtraHTTPHeaders(mutationHeaders(slug));

  try {
    const original = await readHomeDatasetTarget(page.request, HOME_INSIGHTS_TARGET_ID, slug);
    originalHomeBinding = original.binding;
    await putHomeDatasetTarget(
      page.request,
      HOME_INSIGHTS_TARGET_ID,
      original.revision,
      {
        ...original.binding,
        filters: [{ fieldId: 'title', operator: 'equals', value: `__no_match_${token}__` }],
        sort: [],
        limit: 4,
      },
      slug,
    );

    pageId = await createRepeaterLoadingPage(page.request, slug, token);
    await saveRepeaterLoadingDraft(page.request, pageId, token, slug);

    await openBuilder(page, `/ko/admin-builder?pageId=${encodeURIComponent(pageId)}&repeaterLoading=${token}`);
    const repeaterNode = page.locator(`[data-node-id="${repeaterId}"]`).first();
    await expect(repeaterNode).toBeVisible();
    await selectLayerNode(page, repeaterId);

    const hud = repeaterNode.locator('[data-builder-repeater-template-hud="true"]').first();
    await expect(hud).toBeVisible();
    await expect(hud.locator('[data-builder-repeater-template-record="true"]')).toContainText(
      /일치하는 레코드가 없습니다|No matching records/,
    );
    await expect(hud.locator('[data-builder-repeater-template-skeleton-card="true"]')).toHaveCount(3);
    await expect(hud.getByRole('button', { name: /다음 데이터셋 레코드 미리보기|Preview next dataset record/ })).toBeDisabled();
    await hud.screenshot({ path: '/tmp/tseng-law-repeater-canvas-loading-skeleton.png' });
  } finally {
    if (originalHomeBinding) {
      const current = await readHomeDatasetTarget(page.request, HOME_INSIGHTS_TARGET_ID, `${slug}-restore`);
      await putHomeDatasetTarget(
        page.request,
        HOME_INSIGHTS_TARGET_ID,
        current.revision,
        originalHomeBinding,
        `${slug}-restore`,
      ).catch(() => undefined);
    }
    if (pageId) {
      await deleteRepeaterLoadingPage(page.request, pageId, slug);
    }
  }
});

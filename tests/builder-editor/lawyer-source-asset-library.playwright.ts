import { expect, test } from '@playwright/test';
import {
  attorneyImagePayloadSchema,
  deleteSourceAsset,
  mutationHeaders,
  uploadSourceAsset,
} from './helpers/cms-source-inline';

test('/ko/admin-builder/lawyers selects attorney profile images from the Asset Library', async ({ page }) => {
  test.setTimeout(180_000);
  const token = Date.now().toString(36);
  const sourceRecordId = 'wei-tseng';
  const scope = `lawyer-source-asset-${token}`;
  const uploadedAsset = await uploadSourceAsset(page, `lawyer-source-${token}.png`);

  try {
    await page.request.delete(`/api/builder/lawyers/${sourceRecordId}?locale=ko`, {
      headers: mutationHeaders(`${scope}-reset-start`),
    });

    await page.goto('/ko/admin-builder/lawyers', { waitUntil: 'domcontentloaded' });
    await expect(page.locator('[data-lawyer-source-manager]')).toBeVisible({ timeout: 30_000 });
    await page.locator(`[data-lawyer-source-row="${sourceRecordId}"]`).click();

    const imageInput = page.getByLabel('Image path');
    await expect(imageInput).toHaveValue('/images/team/tseng-junwei.png');

    await page.locator(`[data-lawyer-source-asset-library="${sourceRecordId}"]`).click();
    const assetDialog = page.getByRole('dialog', { name: /Asset library|자산 라이브러리/ });
    await expect(assetDialog).toBeVisible();
    await assetDialog.getByRole('searchbox').fill(token);
    await assetDialog
      .locator(`[data-builder-asset-library-asset="${uploadedAsset.filename}"]`)
      .getByRole('button', { name: /Use image|이미지 사용/ })
      .click();

    await expect(assetDialog).toBeHidden();
    await expect(imageInput).toHaveValue(uploadedAsset.url);
    await page.locator('[data-lawyer-source-save]').click();
    await expect(page.locator('[data-lawyer-source-status]')).toContainText('Saved', { timeout: 30_000 });

    const response = await page.request.get(`/api/builder/lawyers/${sourceRecordId}?locale=ko`, {
      headers: mutationHeaders(`${scope}-verify`),
    });
    expect(response.status()).toBe(200);
    const payload = attorneyImagePayloadSchema.parse(await response.json());
    expect(payload.ok, payload.error).toBe(true);
    expect(payload.record?.image).toBe(uploadedAsset.url);
  } finally {
    await page.request.delete(`/api/builder/lawyers/${sourceRecordId}?locale=ko`, {
      headers: mutationHeaders(`${scope}-reset-end`),
    });
    await deleteSourceAsset(page, uploadedAsset.filename);
  }
});

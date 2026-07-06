import { expect, test } from '@playwright/test';
import {
  attorneyImagePayloadSchema,
  deleteSourceAsset,
  mutationHeaders,
  uploadSourceAsset,
} from './helpers/cms-source-inline';

test('/ko/admin-builder/cms edits service source records inline from the preview grid', async ({ page }) => {
  const token = Date.now().toString(36);
  const scope = `cms-source-inline-${token}`;
  const sourceRecordId = 'investment';
  const updatedSlug = `investment-${token}`;
  const updatedTitle = `Source inline title ${token}`;

  try {
    await page.request.delete(`/api/builder/services/${sourceRecordId}?locale=ko`, {
      headers: mutationHeaders(`${scope}-reset-start`),
    });

    await page.goto('/ko/admin-builder/cms?collectionId=service-areas', { waitUntil: 'domcontentloaded' });

    const servicesRecordPreview = page.locator('[data-cms-source-record-preview="service-areas"]').first();
    await expect(servicesRecordPreview).toBeVisible({ timeout: 30_000 });
    const serviceSourceRow = servicesRecordPreview.locator(`[data-cms-source-record-row="${sourceRecordId}"]`);
    await expect(serviceSourceRow).toBeVisible();
    await expect(serviceSourceRow.locator('[data-cms-source-record-route]')).toContainText('/ko/services/investment');

    await serviceSourceRow.locator('[data-cms-source-record-inline-edit]').click();
    const inlineEditor = serviceSourceRow.locator('[data-cms-source-record-inline-editor]');
    await expect(inlineEditor).toBeVisible();
    await inlineEditor.locator('[data-cms-source-record-inline-input="title"]').fill(updatedTitle);
    await inlineEditor.locator('[data-cms-source-record-inline-input="slug"]').fill(updatedSlug);
    await inlineEditor.getByRole('button', { name: 'Save source record' }).click();

    await expect(serviceSourceRow).toContainText(updatedTitle, { timeout: 30_000 });
    await expect(serviceSourceRow.locator('[data-cms-source-record-route]')).toContainText(`/ko/services/${updatedSlug}`);

    const serviceSourceResponse = await page.request.get(`/api/builder/services/${sourceRecordId}?locale=ko`, {
      headers: mutationHeaders(`${scope}-verify`),
    });
    expect(serviceSourceResponse.status()).toBe(200);
    const serviceSourcePayload = await serviceSourceResponse.json() as {
      ok?: boolean;
      record?: { slug?: string; title?: { ko?: string } };
      error?: string;
    };
    expect(serviceSourcePayload.ok, serviceSourcePayload.error).toBe(true);
    expect(serviceSourcePayload.record?.slug).toBe(updatedSlug);
    expect(serviceSourcePayload.record?.title?.ko).toBe(updatedTitle);
  } finally {
    await page.request.delete(`/api/builder/services/${sourceRecordId}?locale=ko`, {
      headers: mutationHeaders(`${scope}-reset-end`),
    });
  }
});

test('/ko/admin-builder/cms edits attorney source emails inline from the preview grid', async ({ page }) => {
  const token = Date.now().toString(36);
  const scope = `cms-source-attorney-email-${token}`;
  const sourceRecordId = 'wei-tseng';
  const updatedEmail = `inline-${token}@example.com`;

  try {
    await page.request.delete(`/api/builder/lawyers/${sourceRecordId}?locale=ko`, {
      headers: mutationHeaders(`${scope}-reset-start`),
    });

    await page.goto('/ko/admin-builder/cms?collectionId=attorney-profiles', { waitUntil: 'domcontentloaded' });

    const attorneysRecordPreview = page.locator('[data-cms-source-record-preview="attorney-profiles"]').first();
    await expect(attorneysRecordPreview).toBeVisible({ timeout: 30_000 });
    const attorneySourceRow = attorneysRecordPreview.locator(`[data-cms-source-record-row="${sourceRecordId}"]`);
    await expect(attorneySourceRow).toBeVisible();
    await expect(attorneySourceRow).toContainText('wei@hoveringlaw.com.tw');

    await attorneySourceRow.locator('[data-cms-source-record-inline-edit]').click();
    const inlineEditor = attorneySourceRow.locator('[data-cms-source-record-inline-editor]');
    await expect(inlineEditor).toBeVisible();
    const emailInput = inlineEditor.locator('[data-cms-source-record-inline-input="email"]');
    await expect(emailInput).toHaveValue('wei@hoveringlaw.com.tw');
    await emailInput.fill(updatedEmail);
    await inlineEditor.getByRole('button', { name: 'Save source record' }).click();

    await expect(attorneySourceRow).toContainText(updatedEmail, { timeout: 30_000 });

    const attorneySourceResponse = await page.request.get(`/api/builder/lawyers/${sourceRecordId}?locale=ko`, {
      headers: mutationHeaders(`${scope}-verify`),
    });
    expect(attorneySourceResponse.status()).toBe(200);
    const attorneySourcePayload = await attorneySourceResponse.json() as {
      ok?: boolean;
      record?: { email?: string };
      error?: string;
    };
    expect(attorneySourcePayload.ok, attorneySourcePayload.error).toBe(true);
    expect(attorneySourcePayload.record?.email).toBe(updatedEmail);
  } finally {
    await page.request.delete(`/api/builder/lawyers/${sourceRecordId}?locale=ko`, {
      headers: mutationHeaders(`${scope}-reset-end`),
    });
  }
});

test('/ko/admin-builder/cms edits attorney source descriptions inline from the preview grid', async ({ page }) => {
  const token = Date.now().toString(36);
  const scope = `cms-source-attorney-description-${token}`;
  const sourceRecordId = 'wei-tseng';
  const updatedDescription = `CMS source description ${token}: 대만 법률 프로필 소개를 콘텐츠 관리자에서 직접 수정했습니다.`;

  try {
    await page.request.delete(`/api/builder/lawyers/${sourceRecordId}?locale=ko`, {
      headers: mutationHeaders(`${scope}-reset-start`),
    });

    await page.goto('/ko/admin-builder/cms?collectionId=attorney-profiles', { waitUntil: 'domcontentloaded' });

    const attorneysRecordPreview = page.locator('[data-cms-source-record-preview="attorney-profiles"]').first();
    await expect(attorneysRecordPreview).toBeVisible({ timeout: 30_000 });
    const attorneySourceRow = attorneysRecordPreview.locator(`[data-cms-source-record-row="${sourceRecordId}"]`);
    await expect(attorneySourceRow).toBeVisible();

    await attorneySourceRow.locator('[data-cms-source-record-inline-edit]').click();
    const inlineEditor = attorneySourceRow.locator('[data-cms-source-record-inline-editor]');
    await expect(inlineEditor).toBeVisible();
    const descriptionInput = inlineEditor.locator('[data-cms-source-record-inline-input="description"]');
    await expect(descriptionInput).toHaveValue(/한국 고객의 대만 회사설립/);
    await descriptionInput.fill(updatedDescription);
    await inlineEditor.getByRole('button', { name: 'Save source record' }).click();
    await expect(inlineEditor).toBeHidden({ timeout: 30_000 });

    const attorneySourceResponse = await page.request.get(`/api/builder/lawyers/${sourceRecordId}?locale=ko`, {
      headers: mutationHeaders(`${scope}-verify`),
    });
    expect(attorneySourceResponse.status()).toBe(200);
    const attorneySourcePayload = await attorneySourceResponse.json() as {
      ok?: boolean;
      record?: { description?: string };
      error?: string;
    };
    expect(attorneySourcePayload.ok, attorneySourcePayload.error).toBe(true);
    expect(attorneySourcePayload.record?.description).toBe(updatedDescription);
  } finally {
    await page.request.delete(`/api/builder/lawyers/${sourceRecordId}?locale=ko`, {
      headers: mutationHeaders(`${scope}-reset-end`),
    });
  }
});

test('/ko/admin-builder/cms edits attorney source profile images inline from the preview grid', async ({ page }) => {
  const token = Date.now().toString(36);
  const scope = `cms-source-attorney-image-${token}`;
  const sourceRecordId = 'wei-tseng';
  const updatedImage = `/images/team/tseng-junwei.png?cms-source=${token}`;

  try {
    await page.request.delete(`/api/builder/lawyers/${sourceRecordId}?locale=ko`, {
      headers: mutationHeaders(`${scope}-reset-start`),
    });

    await page.goto('/ko/admin-builder/cms?collectionId=attorney-profiles', { waitUntil: 'domcontentloaded' });

    const attorneysRecordPreview = page.locator('[data-cms-source-record-preview="attorney-profiles"]').first();
    await expect(attorneysRecordPreview).toBeVisible({ timeout: 30_000 });
    const attorneySourceRow = attorneysRecordPreview.locator(`[data-cms-source-record-row="${sourceRecordId}"]`);
    await expect(attorneySourceRow).toBeVisible();

    await attorneySourceRow.locator('[data-cms-source-record-inline-edit]').click();
    const inlineEditor = attorneySourceRow.locator('[data-cms-source-record-inline-editor]');
    await expect(inlineEditor).toBeVisible();
    const imageInput = inlineEditor.locator('[data-cms-source-record-inline-input="image"]');
    await expect(imageInput).toHaveValue('/images/team/tseng-junwei.png');
    await imageInput.fill(updatedImage);
    await inlineEditor.getByRole('button', { name: 'Save source record' }).click();
    await expect(inlineEditor).toBeHidden({ timeout: 30_000 });

    const attorneySourceResponse = await page.request.get(`/api/builder/lawyers/${sourceRecordId}?locale=ko`, {
      headers: mutationHeaders(`${scope}-verify`),
    });
    expect(attorneySourceResponse.status()).toBe(200);
    const attorneySourcePayload = attorneyImagePayloadSchema.parse(await attorneySourceResponse.json());
    expect(attorneySourcePayload.ok, attorneySourcePayload.error).toBe(true);
    expect(attorneySourcePayload.record?.image).toBe(updatedImage);
  } finally {
    await page.request.delete(`/api/builder/lawyers/${sourceRecordId}?locale=ko`, {
      headers: mutationHeaders(`${scope}-reset-end`),
    });
  }
});

test('/ko/admin-builder/cms edits attorney source image metadata inline from the preview grid', async ({ page }) => {
  const token = Date.now().toString(36);
  const scope = `cms-source-attorney-image-meta-${token}`;
  const sourceRecordId = 'wei-tseng';
  const updatedImageAltText = `증준외 변호사 CMS 프로필 사진 ${token}`;

  try {
    await page.request.delete(`/api/builder/lawyers/${sourceRecordId}?locale=ko`, {
      headers: mutationHeaders(`${scope}-reset-start`),
    });

    await page.goto('/ko/admin-builder/cms?collectionId=attorney-profiles', { waitUntil: 'domcontentloaded' });

    const attorneysRecordPreview = page.locator('[data-cms-source-record-preview="attorney-profiles"]').first();
    await expect(attorneysRecordPreview).toBeVisible({ timeout: 30_000 });
    const attorneySourceRow = attorneysRecordPreview.locator(`[data-cms-source-record-row="${sourceRecordId}"]`);
    await expect(attorneySourceRow).toBeVisible();

    await attorneySourceRow.locator('[data-cms-source-record-inline-edit]').click();
    const inlineEditor = attorneySourceRow.locator('[data-cms-source-record-inline-editor]');
    await expect(inlineEditor).toBeVisible();
    await expect(inlineEditor.locator('[data-cms-source-record-inline-input="imageAltText"]')).toHaveValue('증준외 변호사 대만 변호사 · 대표 변호사');
    await expect(inlineEditor.locator('[data-cms-source-record-inline-input="imageFocalX"]')).toHaveValue('0.5');
    await expect(inlineEditor.locator('[data-cms-source-record-inline-input="imageFocalY"]')).toHaveValue('0.5');

    await inlineEditor.locator('[data-cms-source-record-inline-input="imageAltText"]').fill(updatedImageAltText);
    await inlineEditor.locator('[data-cms-source-record-inline-input="imageFocalX"]').fill('0.18');
    await inlineEditor.locator('[data-cms-source-record-inline-input="imageFocalY"]').fill('0.66');
    await inlineEditor.getByRole('button', { name: 'Save source record' }).click();
    await expect(inlineEditor).toBeHidden({ timeout: 30_000 });

    const attorneySourceResponse = await page.request.get(`/api/builder/lawyers/${sourceRecordId}?locale=ko`, {
      headers: mutationHeaders(`${scope}-verify`),
    });
    expect(attorneySourceResponse.status()).toBe(200);
    const attorneySourcePayload = attorneyImagePayloadSchema.parse(await attorneySourceResponse.json());
    expect(attorneySourcePayload.ok, attorneySourcePayload.error).toBe(true);
    expect(attorneySourcePayload.record?.imageAltText).toBe(updatedImageAltText);
    expect(attorneySourcePayload.record?.imageFocalPoint).toEqual({ x: 0.18, y: 0.66 });
  } finally {
    await page.request.delete(`/api/builder/lawyers/${sourceRecordId}?locale=ko`, {
      headers: mutationHeaders(`${scope}-reset-end`),
    });
  }
});

test('/ko/admin-builder/cms selects attorney source profile images from the Asset Library', async ({ page }) => {
  test.setTimeout(180_000);
  const token = Date.now().toString(36);
  const scope = `cms-source-attorney-asset-${token}`;
  const sourceRecordId = 'wei-tseng';
  const uploadedAsset = await uploadSourceAsset(page, `source-${token}.png`);

  try {
    await page.request.delete(`/api/builder/lawyers/${sourceRecordId}?locale=ko`, {
      headers: mutationHeaders(`${scope}-reset-start`),
    });

    await page.goto('/ko/admin-builder/cms?collectionId=attorney-profiles', { waitUntil: 'domcontentloaded' });

    const attorneysRecordPreview = page.locator('[data-cms-source-record-preview="attorney-profiles"]').first();
    await expect(attorneysRecordPreview).toBeVisible({ timeout: 30_000 });
    const attorneySourceRow = attorneysRecordPreview.locator(`[data-cms-source-record-row="${sourceRecordId}"]`);
    await expect(attorneySourceRow).toBeVisible();

    await attorneySourceRow.locator('[data-cms-source-record-inline-edit]').click();
    const inlineEditor = attorneySourceRow.locator('[data-cms-source-record-inline-editor]');
    await expect(inlineEditor).toBeVisible();
    const imageInput = inlineEditor.locator('[data-cms-source-record-inline-input="image"]');
    await expect(imageInput).toHaveValue('/images/team/tseng-junwei.png');

    await inlineEditor.locator(`[data-cms-source-record-inline-asset-library="${sourceRecordId}"]`).click();
    const assetDialog = page.getByRole('dialog', { name: /Asset library|자산 라이브러리/ });
    await expect(assetDialog).toBeVisible();
    await assetDialog.getByRole('searchbox').fill(token);
    await assetDialog
      .locator(`[data-builder-asset-library-asset="${uploadedAsset.filename}"]`)
      .getByRole('button', { name: /Use image|이미지 사용/ })
      .click();

    await expect(assetDialog).toBeHidden();
    await expect(imageInput).toHaveValue(uploadedAsset.url);
    await expect(inlineEditor.locator(`[data-cms-source-record-inline-image-preview="${sourceRecordId}"]`)).toContainText(uploadedAsset.url);
    await inlineEditor.getByRole('button', { name: 'Save source record' }).click();
    await expect(inlineEditor).toBeHidden({ timeout: 30_000 });

    const attorneySourceResponse = await page.request.get(`/api/builder/lawyers/${sourceRecordId}?locale=ko`, {
      headers: mutationHeaders(`${scope}-verify`),
    });
    expect(attorneySourceResponse.status()).toBe(200);
    const attorneySourcePayload = attorneyImagePayloadSchema.parse(await attorneySourceResponse.json());
    expect(attorneySourcePayload.ok, attorneySourcePayload.error).toBe(true);
    expect(attorneySourcePayload.record?.image).toBe(uploadedAsset.url);
  } finally {
    await page.request.delete(`/api/builder/lawyers/${sourceRecordId}?locale=ko`, {
      headers: mutationHeaders(`${scope}-reset-end`),
    });
    await deleteSourceAsset(page, uploadedAsset.filename);
  }
});

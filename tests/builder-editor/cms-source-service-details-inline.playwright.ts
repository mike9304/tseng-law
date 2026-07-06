import { expect, test } from '@playwright/test';
import { z } from 'zod';
import { mutationHeaders } from './helpers/cms-source-inline';

const serviceSourcePayloadSchema = z.object({
  ok: z.boolean().optional(),
  record: z.object({
    intro: z.object({ ko: z.string().optional() }).optional(),
    keyPoints: z.object({ ko: z.array(z.string()).optional() }).optional(),
    columnSlugs: z.array(z.string()).optional(),
  }).optional(),
  error: z.string().optional(),
});

test('/ko/admin-builder/cms edits service source details and related columns inline', async ({ page }) => {
  const token = Date.now().toString(36);
  const scope = `cms-source-service-details-${token}`;
  const sourceRecordId = 'investment';
  const updatedIntro = `CMS source intro ${token}: 콘텐츠 관리자에서 서비스 소개 문단을 직접 수정했습니다.`;
  const updatedKeyPoint = `CMS source key point ${token}`;
  const selectedColumnSlug = 'taiwan-company-establishment-basics';
  const clearedColumnSlug = 'taiwan-company-subsidiary-vs-branch';

  try {
    await page.request.delete(`/api/builder/services/${sourceRecordId}?locale=ko`, {
      headers: mutationHeaders(`${scope}-reset-start`),
    });

    await page.goto('/ko/admin-builder/cms?collectionId=service-areas', { waitUntil: 'domcontentloaded' });

    const servicePreview = page.locator('[data-cms-source-record-preview="service-areas"]').first();
    await expect(servicePreview).toBeVisible({ timeout: 30_000 });
    const serviceRow = servicePreview.locator(`[data-cms-source-record-row="${sourceRecordId}"]`);
    await expect(serviceRow).toBeVisible();

    await serviceRow.locator('[data-cms-source-record-inline-edit]').click();
    const inlineEditor = serviceRow.locator('[data-cms-source-record-inline-editor]');
    await expect(inlineEditor).toBeVisible();
    await expect(inlineEditor.locator('[data-cms-source-record-inline-input="intro"]')).toHaveValue(/법무법인 호정은 한국 기업/);
    await expect(inlineEditor.locator('[data-cms-source-record-inline-input="keyPoints"]')).toHaveValue(/법인 형태는 자회사/);
    await expect(inlineEditor.locator(`[data-cms-source-record-inline-column="${selectedColumnSlug}"]`)).toBeChecked();

    await inlineEditor.locator('[data-cms-source-record-inline-input="intro"]').fill(updatedIntro);
    await inlineEditor.locator('[data-cms-source-record-inline-input="keyPoints"]').fill(updatedKeyPoint);
    await inlineEditor.locator(`[data-cms-source-record-inline-column="${clearedColumnSlug}"]`).uncheck();
    await inlineEditor.getByRole('button', { name: 'Save source record' }).click();
    await expect(inlineEditor).toBeHidden({ timeout: 30_000 });
    await expect(serviceRow).toContainText('7 linked columns', { timeout: 30_000 });

    const serviceResponse = await page.request.get(`/api/builder/services/${sourceRecordId}?locale=ko`, {
      headers: mutationHeaders(`${scope}-verify`),
    });
    expect(serviceResponse.status()).toBe(200);
    const servicePayload = serviceSourcePayloadSchema.parse(await serviceResponse.json());
    expect(servicePayload.ok, servicePayload.error).toBe(true);
    expect(servicePayload.record?.intro?.ko).toBe(updatedIntro);
    expect(servicePayload.record?.keyPoints?.ko).toEqual([updatedKeyPoint]);
    expect(servicePayload.record?.columnSlugs).toContain(selectedColumnSlug);
    expect(servicePayload.record?.columnSlugs).not.toContain(clearedColumnSlug);
  } finally {
    await page.request.delete(`/api/builder/services/${sourceRecordId}?locale=ko`, {
      headers: mutationHeaders(`${scope}-reset-end`),
    });
  }
});

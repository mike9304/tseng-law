import { expect, test } from '@playwright/test';
import { z } from 'zod';
import { mutationHeaders } from './helpers/cms-source-inline';

const attorneySourcePayloadSchema = z.object({
  ok: z.boolean().optional(),
  record: z.object({
    summary: z.array(z.string()).optional(),
  }).optional(),
  error: z.string().optional(),
});

test('/ko/admin-builder/cms edits attorney source summary inline', async ({ page }) => {
  const token = Date.now().toString(36);
  const scope = `cms-source-attorney-summary-${token}`;
  const sourceRecordId = 'wei-tseng';
  const updatedSummary = [
    `CMS source attorney summary ${token}`,
    '콘텐츠 관리자에서 프로필 요약 리스트를 직접 수정했습니다.',
  ];

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
    const summaryInput = inlineEditor.locator('[data-cms-source-record-inline-input="summary"]');
    await expect(summaryInput).toHaveValue(/증준외 변호사는 한국·일본 고객의 대만 투자/);

    await summaryInput.fill(updatedSummary.join('\n'));
    await inlineEditor.getByRole('button', { name: 'Save source record' }).click();
    await expect(inlineEditor).toBeHidden({ timeout: 30_000 });

    const attorneySourceResponse = await page.request.get(`/api/builder/lawyers/${sourceRecordId}?locale=ko`, {
      headers: mutationHeaders(`${scope}-verify`),
    });
    expect(attorneySourceResponse.status()).toBe(200);
    const attorneySourcePayload = attorneySourcePayloadSchema.parse(await attorneySourceResponse.json());
    expect(attorneySourcePayload.ok, attorneySourcePayload.error).toBe(true);
    expect(attorneySourcePayload.record?.summary).toEqual(updatedSummary);
  } finally {
    await page.request.delete(`/api/builder/lawyers/${sourceRecordId}?locale=ko`, {
      headers: mutationHeaders(`${scope}-reset-end`),
    });
  }
});

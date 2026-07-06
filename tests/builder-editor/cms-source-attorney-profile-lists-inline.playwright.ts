import { expect, test } from '@playwright/test';
import { z } from 'zod';
import { mutationHeaders } from './helpers/cms-source-inline';

const attorneyProfileListsPayloadSchema = z.object({
  ok: z.boolean().optional(),
  record: z.object({
    languages: z.array(z.string()).optional(),
    practiceAreas: z.array(z.string()).optional(),
    internalLinks: z.array(z.object({
      label: z.string(),
      href: z.string(),
    })).optional(),
  }).optional(),
  error: z.string().optional(),
});

test('/ko/admin-builder/cms edits attorney profile lists inline', async ({ page }) => {
  const token = Date.now().toString(36);
  const scope = `cms-source-attorney-lists-${token}`;
  const sourceRecordId = 'wei-tseng';
  const updatedLanguages = [`한국어 ${token}`, `English ${token}`];
  const updatedPracticeAreas = [
    `대만 투자 검토 ${token}`,
    `상표 출원 ${token}`,
  ];
  const updatedInternalLinks = [
    { label: `상담 문의 ${token}`, href: `/ko/contact?source=${token}` },
    { label: `회사설립 서비스 ${token}`, href: '/ko/services/investment' },
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

    const languagesInput = inlineEditor.locator('[data-cms-source-record-inline-input="languages"]');
    const practiceAreasInput = inlineEditor.locator('[data-cms-source-record-inline-input="practiceAreas"]');
    const internalLinksInput = inlineEditor.locator('[data-cms-source-record-inline-input="internalLinks"]');
    await expect(languagesInput).toHaveValue(/한국어/);
    await expect(practiceAreasInput).toHaveValue(/대만 회사설립/);
    await expect(internalLinksInput).toHaveValue(/대만변호사 안내 \| \/ko\/taiwan-lawyer/);

    await languagesInput.fill(updatedLanguages.join('\n'));
    await practiceAreasInput.fill(updatedPracticeAreas.join('\n'));
    await internalLinksInput.fill(updatedInternalLinks.map((link) => `${link.label} | ${link.href}`).join('\n'));
    await inlineEditor.getByRole('button', { name: 'Save source record' }).click();
    await expect(inlineEditor).toBeHidden({ timeout: 30_000 });

    const attorneySourceResponse = await page.request.get(`/api/builder/lawyers/${sourceRecordId}?locale=ko`, {
      headers: mutationHeaders(`${scope}-verify`),
    });
    expect(attorneySourceResponse.status()).toBe(200);
    const attorneySourcePayload = attorneyProfileListsPayloadSchema.parse(await attorneySourceResponse.json());
    expect(attorneySourcePayload.ok, attorneySourcePayload.error).toBe(true);
    expect(attorneySourcePayload.record?.languages).toEqual(updatedLanguages);
    expect(attorneySourcePayload.record?.practiceAreas).toEqual(updatedPracticeAreas);
    expect(attorneySourcePayload.record?.internalLinks).toEqual(updatedInternalLinks);
  } finally {
    await page.request.delete(`/api/builder/lawyers/${sourceRecordId}?locale=ko`, {
      headers: mutationHeaders(`${scope}-reset-end`),
    });
  }
});

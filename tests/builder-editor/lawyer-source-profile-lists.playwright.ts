import { expect, test } from '@playwright/test';
import { z } from 'zod';
import { mutationHeaders } from './helpers/cms-source-inline';

const lawyerProfileListsPayloadSchema = z.object({
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

test('/ko/admin-builder/lawyers edits attorney profile lists from the source editor', async ({ page }) => {
  const token = Date.now().toString(36);
  const sourceRecordId = 'wei-tseng';
  const scope = `lawyer-source-profile-lists-${token}`;
  const updatedLanguages = [`한국어 ${token}`, `English ${token}`];
  const updatedPracticeAreas = [
    `대만 회사설립 ${token}`,
    `지식재산 검토 ${token}`,
  ];
  const updatedInternalLinks = [
    { label: `상담 예약 ${token}`, href: `/ko/contact?lawyer=${token}` },
    { label: `대만변호사 안내 ${token}`, href: '/ko/taiwan-lawyer' },
  ];

  try {
    await page.request.delete(`/api/builder/lawyers/${sourceRecordId}?locale=ko`, {
      headers: mutationHeaders(`${scope}-reset-start`),
    });

    await page.goto('/ko/admin-builder/lawyers', { waitUntil: 'domcontentloaded' });
    await expect(page.locator('[data-lawyer-source-manager]')).toBeVisible({ timeout: 30_000 });

    const languagesInput = page.locator('[data-lawyer-source-languages-input]');
    const practiceAreasInput = page.locator('[data-lawyer-source-practice-areas-input]');
    const internalLinksInput = page.locator('[data-lawyer-source-internal-links-input]');
    await expect(languagesInput).toHaveValue(/한국어/);
    await expect(practiceAreasInput).toHaveValue(/대만 회사설립/);
    await expect(internalLinksInput).toHaveValue(/대만변호사 안내 \| \/ko\/taiwan-lawyer/);

    await languagesInput.fill(updatedLanguages.join('\n'));
    await practiceAreasInput.fill(updatedPracticeAreas.join('\n'));
    await internalLinksInput.fill(updatedInternalLinks.map((link) => `${link.label} | ${link.href}`).join('\n'));
    await page.locator('[data-lawyer-source-save]').click();
    await expect(page.locator('[data-lawyer-source-status]')).toContainText('Saved', { timeout: 30_000 });

    const response = await page.request.get(`/api/builder/lawyers/${sourceRecordId}?locale=ko`, {
      headers: mutationHeaders(`${scope}-verify`),
    });
    expect(response.status()).toBe(200);
    const payload = lawyerProfileListsPayloadSchema.parse(await response.json());
    expect(payload.ok, payload.error).toBe(true);
    expect(payload.record?.languages).toEqual(updatedLanguages);
    expect(payload.record?.practiceAreas).toEqual(updatedPracticeAreas);
    expect(payload.record?.internalLinks).toEqual(updatedInternalLinks);
  } finally {
    await page.request.delete(`/api/builder/lawyers/${sourceRecordId}?locale=ko`, {
      headers: mutationHeaders(`${scope}-reset-end`),
    });
  }
});

import { expect, test, type Page } from '@playwright/test';

const tinyPng = Buffer.from(
  'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+/p9sAAAAASUVORK5CYII=',
  'base64',
);

interface UploadedAsset {
  filename: string;
  url: string;
}

async function uploadAsset(page: Page, filename: string): Promise<UploadedAsset> {
  const response = await page.request.post('/api/builder/assets?locale=ko', {
    timeout: 60_000,
    multipart: {
      file: {
        name: filename,
        mimeType: 'image/png',
        buffer: tinyPng,
      },
    },
  });
  expect(response.status()).toBe(200);
  const payload = (await response.json()) as { ok?: boolean; asset?: UploadedAsset; error?: string };
  expect(payload.ok, payload.error).toBe(true);
  return payload.asset!;
}

async function deleteAsset(page: Page, filename: string): Promise<void> {
  await page.request.delete('/api/builder/assets?locale=ko', {
    timeout: 30_000,
    data: { locale: 'ko', filename },
  }).catch(() => undefined);
}

test.describe('/ko/admin-builder columns UI workflow', () => {
  test('creates, edits, inserts media, publishes, verifies, and cleans up a column through the UI', async ({ page }) => {
    const token = Date.now().toString(36);
    const editedTitle = `G-Editor UI 칼럼 수정 ${token}`;
    const editedBody = `G-Editor UI 본문 검증 ${token}`;
    let slug: string | null = null;
    let uploadedAsset: UploadedAsset | null = null;

    try {
      uploadedAsset = await uploadAsset(page, `column-${token}.png`);

      await page.goto('/ko/admin-builder/columns?new=1', { waitUntil: 'domcontentloaded' });
      await expect(page).toHaveURL(/\/ko\/admin-builder\/columns\/[^/]+\/edit$/);
      await expect(page.getByRole('link', { name: '← 편집 홈' })).toHaveAttribute('href', '/ko/admin-builder');
      await expect(page.getByRole('link', { name: '칼럼 목록' })).toHaveAttribute('href', '/ko/admin-builder/columns');
      const match = page.url().match(/\/columns\/([^/]+)\/edit$/);
      slug = match?.[1] ? decodeURIComponent(match[1]) : null;
      expect(slug).toBeTruthy();

      const titleInput = page.locator('input.column-editor-title-input');
      const bodyEditor = page.locator('.column-editor-body');
      const advancedSettings = page.locator('.column-editor-advanced-shell');
      const frontmatterPanel = page.locator('.column-frontmatter-panel').first();
      await expect(titleInput).toHaveValue('제목 없는 글');
      await expect(advancedSettings).toBeVisible();
      await expect(advancedSettings).not.toHaveAttribute('open', '');
      await expect(frontmatterPanel).not.toBeVisible();
      await advancedSettings.locator('> summary').click();
      await expect(frontmatterPanel).toBeVisible();
      await titleInput.fill(editedTitle);
      await bodyEditor.fill(editedBody);
      await page.getByRole('button', { name: 'Image' }).click();
      const assetDialog = page.getByRole('dialog', { name: 'Asset library' });
      await expect(assetDialog).toBeVisible();
      await assetDialog.getByRole('searchbox').fill(token);
      await assetDialog
        .locator('article')
        .filter({ hasText: uploadedAsset.filename })
        .getByRole('button', { name: 'Use image' })
        .click();
      await expect(bodyEditor.locator('img')).toHaveAttribute('src', new RegExp(uploadedAsset.filename));

      await page.getByRole('button', { name: '저장' }).click();
      await expect(page.locator('.column-editor-save-state')).toContainText('저장됨', { timeout: 10_000 });
      await expect.poll(async () => {
        const response = await page.request.get(`/api/builder/columns/${slug ?? ''}?locale=ko`);
        const payload = await response.json();
        return payload.draft?.title;
      }).toBe(editedTitle);
      await expect.poll(async () => {
        const response = await page.request.get(`/api/builder/columns/${slug ?? ''}?locale=ko`);
        const payload = await response.json();
        return payload.draft?.summary;
      }).toContain(editedBody);

      await page.route('**/api/builder/columns/**/publish?*', async (route) => {
        const requestUrl = new URL(route.request().url());
        if (!slug || !requestUrl.pathname.endsWith(`/api/builder/columns/${slug}/publish`)) {
          await route.continue();
          return;
        }
        requestUrl.searchParams.set('skipEmbeddings', '1');
        await route.continue({ url: requestUrl.toString() });
      });

      page.once('dialog', (publishDialog) => {
        void publishDialog.accept();
      });
      await page.getByRole('button', { name: '발행' }).click();
      await expect.poll(async () => {
        const response = await page.request.get(`/api/builder/columns/${slug ?? ''}?locale=ko`);
        const payload = await response.json();
        return payload.published?.title;
      }, { timeout: 15_000 }).toBe(editedTitle);

      await page.goto(`/ko/columns/${slug ?? ''}`, { waitUntil: 'domcontentloaded' });
      await expect(page.getByRole('heading', { name: editedTitle })).toBeVisible();
      await expect(page.getByText(editedBody)).toBeVisible();
      await expect(page.locator(`img[src*="${uploadedAsset.filename}"]`).first()).toBeVisible();

      await page.goto('/ko/columns', { waitUntil: 'domcontentloaded' });
      await expect(page.getByRole('link', { name: editedTitle }).first()).toBeVisible();

      await page.goto('/ko/admin-builder/columns', { waitUntil: 'domcontentloaded' });
      await expect(page.getByRole('link', { name: '← 편집 홈' })).toHaveAttribute('href', '/ko/admin-builder');
      await expect(page.locator('.column-post-grid h3 a').filter({ hasText: editedTitle }).first()).toBeVisible();
    } finally {
      if (slug) {
        await page.request.delete(`/api/builder/columns/${slug}?locale=ko&includePublished=1`).catch(() => undefined);
      }
      if (uploadedAsset) {
        await deleteAsset(page, uploadedAsset.filename);
      }
    }
  });
});

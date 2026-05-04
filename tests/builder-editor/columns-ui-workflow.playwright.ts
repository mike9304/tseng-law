import { expect, test } from '@playwright/test';

test.describe('/ko/admin-builder columns UI workflow', () => {
  test('creates, edits, publishes, verifies, and cleans up a column through the UI', async ({ page }) => {
    const token = Date.now().toString(36);
    const initialTitle = `G-Editor UI 칼럼 ${token}`;
    const editedTitle = `G-Editor UI 칼럼 수정 ${token}`;
    const editedBody = `G-Editor UI 본문 검증 ${token}`;
    let slug: string | null = null;

    try {
      await page.goto('/ko/admin-builder/columns?new=1', { waitUntil: 'domcontentloaded' });
      const dialog = page.getByRole('dialog', { name: '새 글 쓰기' });
      await expect(dialog).toBeVisible();
      await dialog.getByRole('textbox', { name: '제목' }).fill(initialTitle);
      await dialog.getByRole('button', { name: '글쓰기 시작' }).click();

      await expect(page).toHaveURL(/\/ko\/admin-builder\/columns\/[^/]+\/edit$/);
      const match = page.url().match(/\/columns\/([^/]+)\/edit$/);
      slug = match?.[1] ? decodeURIComponent(match[1]) : null;
      expect(slug).toBeTruthy();

      const titleInput = page.locator('input.column-editor-title-input');
      const bodyEditor = page.locator('.column-editor-body');
      await expect(titleInput).toHaveValue(initialTitle);
      await titleInput.fill(editedTitle);
      await bodyEditor.fill(editedBody);

      await page.getByRole('button', { name: '저장' }).click();
      await expect(page.locator('.column-editor-save-state')).toContainText('Saved', { timeout: 10_000 });
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

      await page.goto('/ko/columns', { waitUntil: 'domcontentloaded' });
      await expect(page.getByRole('link', { name: editedTitle }).first()).toBeVisible();

      await page.goto('/ko/admin-builder/columns', { waitUntil: 'domcontentloaded' });
      await expect(page.locator('.column-post-grid h3 a').filter({ hasText: editedTitle }).first()).toBeVisible();
    } finally {
      if (slug) {
        await page.request.delete(`/api/builder/columns/${slug}?locale=ko&includePublished=1`).catch(() => undefined);
      }
    }
  });
});

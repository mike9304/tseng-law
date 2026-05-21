import { expect, test, type Locator, type Page } from '@playwright/test';

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

async function expectReceivesPointerAtCenter(locator: Locator, label: string): Promise<void> {
  await locator.scrollIntoViewIfNeeded();
  await expect(locator, label).toBeVisible();
  await expect.poll(async () => {
    const box = await locator.boundingBox();
    if (!box) return 'missing';
    return locator.evaluate((element, point) => {
      const hit = document.elementFromPoint(point.x, point.y);
      if (!hit) return 'missing hit target';
      if (hit === element || element.contains(hit)) return 'ok';
      const coveredBy = hit.closest('a, button, [class]') ?? hit;
      const className = coveredBy instanceof HTMLElement ? coveredBy.className : '';
      return `covered by ${coveredBy.tagName.toLowerCase()} ${String(className)}`;
    }, {
      x: box.x + box.width / 2,
      y: box.y + box.height / 2,
    });
  }, { timeout: 5_000 }).toBe('ok');
}

async function expectMinTouchTarget(locator: Locator, label: string): Promise<void> {
  await locator.scrollIntoViewIfNeeded();
  await expect(locator, label).toBeVisible();
  await expect.poll(async () => {
    const box = await locator.boundingBox();
    if (!box) return 'missing';
    return box.width >= 43.5 && box.height >= 43.5 ? 'ok' : `${Math.round(box.width)}x${Math.round(box.height)}`;
  }, { timeout: 5_000 }).toBe('ok');
}

async function expectColumnsFiltersSeparated(page: Page): Promise<void> {
  await expect.poll(async () => page.evaluate(() => {
    const filters = document.querySelector('.columns-filters');
    const following = document.querySelector('.columns-grid, .columns-empty');
    if (!filters || !following) return 'missing';
    const filtersBox = filters.getBoundingClientRect();
    const followingBox = following.getBoundingClientRect();
    const gap = followingBox.top - filtersBox.bottom;
    return gap >= 16 ? 'ok' : `gap ${Math.round(gap)}px`;
  }), { timeout: 5_000 }).toBe('ok');
}

test.describe('/ko/admin-builder columns UI workflow', () => {
  test('accepts columns as a public search tab alias', async ({ page }) => {
    await page.goto('/ko/search?q=%ED%9A%8C%EC%82%AC&tab=columns', { waitUntil: 'domcontentloaded' });
    await expect(page.locator('.tab-button.active')).toContainText('칼럼');
    await expect(page.locator('.search-results-total')).not.toContainText('총 0건');
    await expect(page.locator('.list-row').first()).toContainText('칼럼');
  });

  test('keeps public columns archive filters separated and clickable across viewports', async ({ page }) => {
    test.setTimeout(90_000);

    for (const viewport of [
      { name: 'desktop', width: 1440, height: 1000 },
      { name: 'tablet', width: 768, height: 1024 },
      { name: 'mobile', width: 390, height: 844 },
    ]) {
      await page.setViewportSize({ width: viewport.width, height: viewport.height });
      await page.goto('/ko/columns', { waitUntil: 'domcontentloaded' });

      const filters = page.locator('.columns-filters').first();
      await expect(filters).toBeVisible();
      await expectColumnsFiltersSeparated(page);

      const buttons = page.locator('.columns-filter-btn');
      const count = await buttons.count();
      expect(count, `${viewport.name} filter count`).toBeGreaterThan(1);

      for (let index = 0; index < count; index += 1) {
        const button = buttons.nth(index);
        await expectMinTouchTarget(button, `${viewport.name} filter ${index + 1}`);
        await expectReceivesPointerAtCenter(button, `${viewport.name} filter ${index + 1}`);
        await button.click();
        await expect(button, `${viewport.name} active filter ${index + 1}`).toHaveClass(/active/);
        await expectColumnsFiltersSeparated(page);
        await expectReceivesPointerAtCenter(button, `${viewport.name} active filter ${index + 1}`);
      }
    }
  });

  test('surfaces native blog admin data for scheduled drafts', async ({ page }) => {
    const token = Date.now().toString(36);
    const slug = `native-blog-${token}`;
    const futurePublishedAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();

    try {
      const createResponse = await page.request.post('/api/builder/columns?locale=ko', {
        data: {
          locale: 'ko',
          slug,
          title: `Native Blog Scheduled ${token}`,
          summary: `Native blog admin scheduled draft ${token}`,
          bodyMarkdown: `Native blog scheduled body ${token}`,
          bodyHtml: `<p>Native blog scheduled body ${token}</p>`,
          frontmatter: {
            blogCategory: 'labor-law',
            tags: ['native-blog', token],
            author: {
              name: 'F43 Native Blog Author',
              title: 'Blog editor',
            },
            publishedAt: futurePublishedAt,
          },
        },
      });
      expect(createResponse.status()).toBe(201);

      const adminResponse = await page.request.get('/api/builder/blog/admin?locale=ko');
      expect(adminResponse.status()).toBe(200);
      const adminPayload = await adminResponse.json() as {
        ok?: boolean;
        model?: {
          posts: Array<{
            slug: string;
            status: string;
            category: string;
            authorName: string;
            tags: string[];
            scheduledFor?: string;
          }>;
          counts: { scheduled: number };
          authors: Array<{ id: string }>;
          categories: Array<{ id: string }>;
          tags: Array<{ id: string }>;
        };
      };
      expect(adminPayload.ok).toBe(true);
      const adminPost = adminPayload.model?.posts.find((post) => post.slug === slug);
      expect(adminPost).toMatchObject({
        slug,
        status: 'scheduled',
        category: 'labor-law',
        authorName: 'F43 Native Blog Author',
      });
      expect(adminPost?.tags).toEqual(expect.arrayContaining(['native-blog', token]));
      expect(adminPost?.scheduledFor).toBe(futurePublishedAt);
      expect(adminPayload.model?.counts.scheduled).toBeGreaterThanOrEqual(1);
      expect(adminPayload.model?.authors.map((author) => author.id)).toContain('F43 Native Blog Author');
      expect(adminPayload.model?.categories.map((category) => category.id)).toContain('labor-law');
      expect(adminPayload.model?.tags.map((tag) => tag.id)).toContain('native-blog');

      await page.goto('/ko/admin-builder/columns', { waitUntil: 'domcontentloaded' });
      await expect(page.locator('[data-blog-native-admin]')).toBeVisible();
      await expect(page.locator('[data-blog-admin-kpi="scheduled"] strong')).not.toHaveText('0');
      await page.locator('[data-blog-status-filter]').selectOption('scheduled');
      const scheduledCard = page.locator(`[data-blog-post-card="${slug}"]`);
      await expect(scheduledCard).toBeVisible();
      await expect(scheduledCard).toHaveAttribute('data-blog-post-status', 'scheduled');
    } finally {
      await page.request.delete(`/api/builder/columns/${slug}?locale=ko&includePublished=1`).catch(() => undefined);
    }
  });

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
      await expect(page.getByRole('link', { name: '← 편집기 홈으로 돌아가기' })).toHaveAttribute('href', '/ko/admin-builder');
      await expect(page.getByRole('link', { name: '칼럼 목록', exact: true })).toHaveAttribute('href', '/ko/admin-builder/columns');
      await expect(page.getByText('편집기 홈으로 돌아가기').first()).toBeVisible();
      const editorReturnDock = page.getByRole('link', { name: '편집 홈 메뉴로 돌아가기' });
      await expect(editorReturnDock).toBeVisible();
      await expect(editorReturnDock).toHaveAttribute('href', '/ko/admin-builder');
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
      await expect(page.getByRole('link', { name: '← 편집기 홈으로 돌아가기' })).toHaveAttribute('href', '/ko/admin-builder');
      await expect(page.getByText('편집기 홈으로 돌아가기').first()).toBeVisible();
      const managerReturnDock = page.getByRole('link', { name: '편집 홈 메뉴로 돌아가기' });
      await expect(managerReturnDock).toBeVisible();
      await expect(managerReturnDock).toHaveAttribute('href', '/ko/admin-builder');
      await expect(page.locator('.column-post-grid h3 a').filter({ hasText: editedTitle }).first()).toBeVisible();
      await managerReturnDock.click();
      await expect(page).toHaveURL(/\/ko\/admin-builder$/);
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

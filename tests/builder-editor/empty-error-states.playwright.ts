import { expect, test, type APIRequestContext, type Locator, type Page } from '@playwright/test';
import { openAssetLibrary, openBuilder } from './helpers/editor';

type TestDocument = {
  version: 1;
  locale: 'ko';
  updatedAt: string;
  updatedBy: string;
  stageWidth: number;
  stageHeight: number;
  nodes: Array<Record<string, unknown>>;
};

const baseStyle = {
  backgroundColor: 'transparent',
  borderColor: '#cbd5e1',
  borderStyle: 'solid',
  borderWidth: 0,
  borderRadius: 0,
  shadowX: 0,
  shadowY: 0,
  shadowBlur: 0,
  shadowSpread: 0,
  shadowColor: 'rgba(15, 23, 42, 0.16)',
  opacity: 100,
};

function mutationHeaders(scope: string): Record<string, string> {
  const safeScope = scope.replace(/[^a-z0-9-]/gi, '-').slice(-48) || 'm05-empty';
  return { 'x-forwarded-for': `pw-${safeScope}` };
}

async function waitForRateLimit(response: Awaited<ReturnType<APIRequestContext['post']>>): Promise<boolean> {
  if (response.status() !== 429) return false;
  const retryAfter = Number(response.headers()['retry-after'] || '1');
  const waitMs = Math.max(1000, Math.min(65_000, Number.isFinite(retryAfter) ? retryAfter * 1000 : 1000));
  await new Promise((resolve) => setTimeout(resolve, waitMs));
  return true;
}

function makeDocument(options: {
  token: string;
  rootId?: string;
  textId?: string;
  text?: string;
  empty?: boolean;
}): TestDocument {
  const now = new Date().toISOString();
  if (options.empty) {
    return {
      version: 1,
      locale: 'ko',
      updatedAt: now,
      updatedBy: `m05-${options.token}`,
      stageWidth: 1280,
      stageHeight: 520,
      nodes: [],
    };
  }

  const rootId = options.rootId ?? `m05-root-${options.token}`;
  const textId = options.textId ?? `m05-text-${options.token}`;
  return {
    version: 1,
    locale: 'ko',
    updatedAt: now,
    updatedBy: `m05-${options.token}`,
    stageWidth: 1280,
    stageHeight: 520,
    nodes: [
      {
        id: rootId,
        kind: 'container',
        rect: { x: 0, y: 0, width: 1280, height: 520 },
        style: baseStyle,
        zIndex: 0,
        rotation: 0,
        locked: false,
        visible: true,
        content: {
          label: 'M05 root',
          background: '#ffffff',
          borderColor: 'transparent',
          borderStyle: 'solid',
          borderWidth: 0,
          borderRadius: 0,
          padding: 0,
          layoutMode: 'absolute',
          as: 'main',
        },
      },
      {
        id: textId,
        kind: 'text',
        parentId: rootId,
        rect: { x: 96, y: 88, width: 320, height: 128 },
        style: { ...baseStyle, borderRadius: 8 },
        zIndex: 1,
        rotation: 0,
        locked: false,
        visible: true,
        content: {
          text: options.text ?? `M05 text ${options.token}`,
          fontSize: 28,
          color: '#0f172a',
          fontWeight: 'bold',
          align: 'left',
          lineHeight: 1.2,
          letterSpacing: 0,
          fontFamily: 'system-ui',
          verticalAlign: 'top',
          textTransform: 'none',
          as: 'h2',
        },
      },
    ],
  };
}

async function createBuilderPage(
  request: APIRequestContext,
  slug: string,
  title: string,
  document: TestDocument,
): Promise<string> {
  let response: Awaited<ReturnType<APIRequestContext['post']>> | null = null;
  for (let attempt = 0; attempt < 3; attempt += 1) {
    response = await request.post('/api/builder/site/pages', {
      data: { locale: 'ko', slug, title, document },
      headers: mutationHeaders(slug),
    });
    if (!(await waitForRateLimit(response))) break;
  }
  expect(response).toBeTruthy();
  response = response!;
  expect(response.status()).toBe(200);
  const payload = (await response.json()) as { success?: boolean; pageId?: string; error?: string };
  expect(payload.success, payload.error).toBe(true);
  expect(payload.pageId).toBeTruthy();
  return payload.pageId!;
}

async function deleteBuilderPage(page: Page, pageId: string, slug: string): Promise<void> {
  await page.request.delete(`/api/builder/site/pages/${pageId}?locale=ko`, {
    headers: mutationHeaders(slug),
    failOnStatusCode: false,
  });
}

async function triggerDraftAutosave(page: Page, textId: string): Promise<void> {
  const { editorShell, editable } = await openInlineEditor(page, textId);
  await editable.fill(`M05 autosave ${Date.now().toString(36)}`);
  await page.keyboard.press('Escape');
  await expect(editorShell).toBeHidden();
}

async function openInlineEditor(page: Page, textId: string): Promise<{ editorShell: Locator; editable: Locator }> {
  const node = page.locator(`[data-node-id="${textId}"]:visible`).first();
  await expect(node).toBeVisible();
  await node.dblclick({ position: { x: 24, y: 24 }, force: true });
  const editorShell = page.locator('[data-builder-inline-text-editor="true"]').first();
  await expect(editorShell).toBeVisible();
  const editable = editorShell.locator('.ProseMirror').first();
  await expect(editable).toBeVisible();
  return { editorShell, editable };
}

async function draftText(page: Page, pageId: string, textId: string): Promise<string> {
  const response = await page.request.get(`/api/builder/site/pages/${pageId}/draft?locale=ko`);
  if (!response.ok()) return '';
  const payload = (await response.json()) as { document?: { nodes?: Array<Record<string, any>> } };
  const node = payload.document?.nodes?.find((candidate) => candidate.id === textId);
  return typeof node?.content?.text === 'string' ? node.content.text : '';
}

test.describe('/ko/admin-builder M05 empty and error states', () => {
  test('renders a clear empty canvas callout when a page has zero nodes', async ({ page }) => {
    const token = `empty-${Date.now().toString(36)}`;
    const slug = `g-editor-${token}`;
    let pageId: string | null = null;

    try {
      pageId = await createBuilderPage(page.request, slug, `Empty ${token}`, makeDocument({ token, empty: true }));
      await page.setExtraHTTPHeaders(mutationHeaders(slug));
      await openBuilder(page, `/ko/admin-builder?pageId=${encodeURIComponent(pageId)}&m05=${token}`);
      await expect(page.getByText('페이지가 비어있습니다.')).toBeVisible();
      await expect(page.getByText('좌측 + 패널에서 텍스트, 이미지, 섹션을 추가하세요.')).toBeVisible();
    } finally {
      if (pageId) await deleteBuilderPage(page, pageId, slug);
    }
  });

  test('shows a page list empty state with a create action', async ({ page }) => {
    await page.route('**/api/builder/site/pages?locale=ko', (route) => route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ pages: [] }),
    }));
    await openBuilder(page, `/ko/admin-builder?m05-pages-empty=${Date.now().toString(36)}`);
    await page.getByRole('button', { name: 'Pages' }).click();
    await expect(page.getByText('페이지가 없습니다.')).toBeVisible();
    await expect(page.getByRole('button', { name: '첫 페이지 만들기' })).toBeVisible();
  });

  test('shows an asset library empty state with upload and retry actions', async ({ page }) => {
    await page.route('**/api/builder/assets?locale=ko&limit=24', (route) => route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ ok: true, assets: [], library: { folders: [], tags: [], assetFolderByFilename: {}, assetTagsByFilename: {} } }),
    }));
    await openBuilder(page, `/ko/admin-builder?m05-assets-empty=${Date.now().toString(36)}`);
    const dialog = await openAssetLibrary(page);
    await expect(dialog.getByText('아직 업로드된 이미지가 없습니다.')).toBeVisible();
    await expect(dialog.getByRole('button', { name: 'Upload image' }).last()).toBeVisible();
    await expect(dialog.getByRole('button', { name: 'Retry' })).toBeVisible();
  });

  test('keeps the columns page visible when the blog feed has zero posts', async ({ page }) => {
    await page.route('**/api/builder/blog/posts?**', (route) => route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ ok: true, total: 0, posts: [] }),
    }));
    await openBuilder(page, `/ko/admin-builder?m05-columns-empty=${Date.now().toString(36)}`);
    await page.getByRole('button', { name: 'Columns' }).click();
    const columnsButton = page.getByRole('button', { name: /칼럼 페이지로 이동|페이지 확인 중/ });
    await expect(columnsButton).toBeVisible({ timeout: 20_000 });
    await expect(columnsButton).toBeEnabled({ timeout: 20_000 });
    await columnsButton.click();
    await expect(page.getByText('Blog Feed · 등록된 글이 없습니다.').first()).toBeVisible({ timeout: 20_000 });
  });

  test('surfaces network save failures with a retry action', async ({ page }) => {
    const token = `network-${Date.now().toString(36)}`;
    const slug = `g-editor-${token}`;
    const textId = `m05-text-${token}`;
    let pageId: string | null = null;

    try {
      pageId = await createBuilderPage(page.request, slug, `Network ${token}`, makeDocument({ token, textId }));
      await page.setExtraHTTPHeaders(mutationHeaders(slug));
      await openBuilder(page, `/ko/admin-builder?pageId=${encodeURIComponent(pageId)}&m05=${token}`);
      await page.route('**/api/builder/site/pages/*/draft?**', (route) => {
        if (route.request().method() === 'PUT') return route.abort('failed');
        return route.continue();
      });
      await triggerDraftAutosave(page, textId);
      await expect(page.getByText('네트워크 오류, 다시 시도해주세요').last()).toBeVisible({ timeout: 12_000 });
      await expect(page.getByRole('button', { name: '다시 시도' }).last()).toBeVisible();
    } finally {
      if (pageId) await deleteBuilderPage(page, pageId, slug);
    }
  });

  test('blocks publish actions and explains 401 or 500 save responses', async ({ page }) => {
    const token = `blocked-${Date.now().toString(36)}`;
    const slug = `g-editor-${token}`;
    const textId = `m05-text-${token}`;
    let pageId: string | null = null;

    try {
      pageId = await createBuilderPage(page.request, slug, `Blocked ${token}`, makeDocument({ token, textId }));
      await page.setExtraHTTPHeaders(mutationHeaders(slug));
      await openBuilder(page, `/ko/admin-builder?pageId=${encodeURIComponent(pageId)}&m05=${token}`);
      await page.route('**/api/builder/site/pages/*/draft?**', (route) => {
        if (route.request().method() === 'PUT') {
          return route.fulfill({
            status: 500,
            contentType: 'application/json',
            body: JSON.stringify({ ok: false, error: 'server_error' }),
          });
        }
        return route.continue();
      });
      await triggerDraftAutosave(page, textId);
      await expect(page.getByText('서버 오류로 저장을 멈췄습니다. 잠시 후 다시 시도해주세요.')).toBeVisible({ timeout: 12_000 });
      await expect(page.getByText('저장 차단')).toBeVisible();
      await expect(page.getByRole('button', { name: 'Publish' })).toBeDisabled();
    } finally {
      if (pageId) await deleteBuilderPage(page, pageId, slug);
    }
  });

  test('blocks publish actions when auth expires during save', async ({ page }) => {
    const token = `auth-${Date.now().toString(36)}`;
    const slug = `g-editor-${token}`;
    const textId = `m05-text-${token}`;
    let pageId: string | null = null;

    try {
      pageId = await createBuilderPage(page.request, slug, `Auth ${token}`, makeDocument({ token, textId }));
      await page.setExtraHTTPHeaders(mutationHeaders(slug));
      await openBuilder(page, `/ko/admin-builder?pageId=${encodeURIComponent(pageId)}&m05=${token}`);
      await page.route('**/api/builder/site/pages/*/draft?**', (route) => {
        if (route.request().method() === 'PUT') {
          return route.fulfill({
            status: 401,
            contentType: 'application/json',
            body: JSON.stringify({ ok: false, error: 'unauthorized' }),
          });
        }
        return route.continue();
      });
      await triggerDraftAutosave(page, textId);
      await expect(page.getByText('로그인이 만료되어 저장할 수 없습니다. 다시 로그인한 뒤 시도해주세요.')).toBeVisible({ timeout: 12_000 });
      await expect(page.getByText('저장 차단')).toBeVisible();
      await expect(page.getByRole('button', { name: 'Publish' })).toBeDisabled();
    } finally {
      if (pageId) await deleteBuilderPage(page, pageId, slug);
    }
  });

  test('commits IME text when an outside click blurs the inline editor', async ({ page }) => {
    const token = `ime-blur-${Date.now().toString(36)}`;
    const slug = `g-editor-${token}`;
    const textId = `m05-text-${token}`;
    const nextText = `외부 클릭 조합 저장 ${token}`;
    let pageId: string | null = null;

    try {
      pageId = await createBuilderPage(page.request, slug, `IME blur ${token}`, makeDocument({ token, textId }));
      await page.setExtraHTTPHeaders(mutationHeaders(slug));
      await openBuilder(page, `/ko/admin-builder?pageId=${encodeURIComponent(pageId)}&m05=${token}`);
      const { editorShell, editable } = await openInlineEditor(page, textId);
      await editable.fill(nextText);
      await editable.evaluate((element) => {
        element.dispatchEvent(new CompositionEvent('compositionstart', { bubbles: true, data: '외부' }));
      });
      await page.mouse.click(16, 16);
      await expect(editorShell).toBeHidden();
      await expect.poll(async () => draftText(page, pageId!, textId), { timeout: 20_000 }).toBe(nextText);
    } finally {
      if (pageId) await deleteBuilderPage(page, pageId, slug);
    }
  });

  test('wraps very long Korean text without widening the canvas node', async ({ page }) => {
    const token = `long-${Date.now().toString(36)}`;
    const slug = `g-editor-${token}`;
    const textId = `m05-text-${token}`;
    const longText = '긴한글문장'.repeat(125);
    let pageId: string | null = null;

    try {
      pageId = await createBuilderPage(page.request, slug, `Long ${token}`, makeDocument({ token, textId, text: longText }));
      await page.setExtraHTTPHeaders(mutationHeaders(slug));
      await openBuilder(page, `/ko/admin-builder?pageId=${encodeURIComponent(pageId)}&m05=${token}`);
      const body = page.locator(`[data-node-id="${textId}"]:visible > [class*="nodeBody"]`).first();
      await expect(body).toBeVisible();
      const metrics = await body.evaluate((element) => ({
        clientWidth: element.clientWidth,
        maxChildRight: Math.max(
          ...Array.from(element.querySelectorAll('*')).map((child) => child.getBoundingClientRect().right),
          element.getBoundingClientRect().right,
        ),
        right: element.getBoundingClientRect().right,
      }));
      expect(metrics.maxChildRight).toBeLessThanOrEqual(metrics.right + 2);
      expect(metrics.clientWidth).toBeLessThanOrEqual(322);
    } finally {
      if (pageId) await deleteBuilderPage(page, pageId, slug);
    }
  });
});

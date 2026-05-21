import { expect, test, type APIRequestContext, type Page } from '@playwright/test';

type TestNode = Record<string, unknown> & {
  id?: string;
  content?: Record<string, unknown> & {
    richText?: {
      plainText?: unknown;
      doc?: unknown;
    };
  };
};

type TestDocument = {
  version: 1;
  locale: 'ko';
  updatedAt: string;
  updatedBy: string;
  stageWidth: number;
  stageHeight: number;
  nodes: TestNode[];
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
  const safeScope = scope.replace(/[^a-z0-9-]/gi, '-').slice(-48) || 'ai-text';
  return { 'x-forwarded-for': `pw-${safeScope}` };
}

async function waitForRateLimit(response: Awaited<ReturnType<APIRequestContext['post']>>): Promise<boolean> {
  if (response.status() !== 429) return false;
  const retryAfter = Number(response.headers()['retry-after'] || '1');
  const waitMs = Math.max(1000, Math.min(65_000, Number.isFinite(retryAfter) ? retryAfter * 1000 : 1000));
  await new Promise((resolve) => setTimeout(resolve, waitMs));
  return true;
}

function makeTextDocument(options: {
  token: string;
  rootId: string;
  textId: string;
  text: string;
}): TestDocument {
  const now = new Date().toISOString();
  return {
    version: 1,
    locale: 'ko',
    updatedAt: now,
    updatedBy: `ai-text-${options.token}`,
    stageWidth: 1280,
    stageHeight: 760,
    nodes: [
      {
        id: options.rootId,
        kind: 'container',
        rect: { x: 0, y: 0, width: 1280, height: 760 },
        style: baseStyle,
        zIndex: 0,
        rotation: 0,
        locked: false,
        visible: true,
        content: {
          label: 'AI text assistant root',
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
        id: options.textId,
        kind: 'text',
        parentId: options.rootId,
        rect: { x: 96, y: 96, width: 720, height: 120 },
        style: { ...baseStyle, borderRadius: 8 },
        zIndex: 1,
        rotation: 0,
        locked: false,
        visible: true,
        content: {
          text: options.text,
          fontSize: 28,
          color: '#0f172a',
          fontWeight: 'bold',
          align: 'left',
          lineHeight: 1.3,
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

async function openBuilderPageById(page: Page, pageId: string, scope: string): Promise<void> {
  await page.goto(
    `/ko/admin-builder?pageId=${encodeURIComponent(pageId)}&aiTextTest=${Date.now().toString(36)}-${scope}`,
    { waitUntil: 'domcontentloaded' },
  );
  const shell = page.locator('[data-editor-shell]').first();
  await expect(shell).toBeVisible({ timeout: 30_000 });
  await expect(shell).toHaveAttribute('data-editor-ready', 'true', { timeout: 30_000 });
}

async function selectNodeWithHandles(page: Page, nodeId: string): Promise<void> {
  const node = page.locator(`[data-node-id="${nodeId}"]`).first();
  await expect(node).toBeVisible({ timeout: 15_000 });
  for (let attempt = 0; attempt < 5; attempt += 1) {
    const box = await node.boundingBox();
    await node.click({
      position: box
        ? { x: Math.max(1, box.width / 2), y: Math.max(1, box.height / 2) }
        : { x: 24, y: 24 },
      force: true,
    });
    const handles = page.locator(`[data-node-id="${nodeId}"][class*="nodeSelected"] [class*="resizeHandle"]:visible`);
    if ((await handles.count().catch(() => 0)) === 8) return;
    await page.waitForTimeout(150);
  }
}

async function draftNodes(page: Page, pageId: string): Promise<TestNode[]> {
  const response = await page.request.get(`/api/builder/site/pages/${pageId}/draft?locale=ko`);
  expect(response.status()).toBe(200);
  const payload = (await response.json()) as { document?: { nodes?: TestNode[] } };
  return payload.document?.nodes ?? [];
}

test.describe('AI text assistant', () => {
  test('rewrites inline text via mocked AI endpoint and persists to draft', async ({ page }) => {
    test.setTimeout(90_000);
    const token = `ai-rewrite-${Date.now().toString(36)}`;
    const slug = `ai-text-${token}`;
    const textId = 'ai-text-target';
    const sourceText = '이 텍스트는 다듬을 필요가 있는 카피입니다.';
    const rewrittenText = `AI가 다시 쓴 카피 ${token}`;

    await page.setExtraHTTPHeaders(mutationHeaders(token));
    let textRequestPayload: Record<string, unknown> | null = null;
    await page.route('**/api/builder/ai-generator/text', async (route) => {
      const request = route.request();
      textRequestPayload = JSON.parse(request.postData() || '{}');
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          ok: true,
          action: 'rewrite',
          model: 'gpt-4o-mini-mock',
          text: rewrittenText,
          tone: null,
          targetLocale: null,
          finishReason: 'stop',
          supportedActions: ['rewrite', 'expand', 'shorten', 'translate', 'tone'],
          supportedTones: ['formal', 'casual', 'persuasive', 'concise', 'warm', 'authoritative'],
          supportedTargetLocales: ['ko', 'zh-hant', 'en'],
        }),
      });
    });

    let pageId: string | null = null;
    try {
      const document = makeTextDocument({ token, rootId: 'ai-text-root', textId, text: sourceText });
      pageId = await createBuilderPage(page.request, slug, `AI text rewrite ${token}`, document);

      await openBuilderPageById(page, pageId, 'rewrite');
      await selectNodeWithHandles(page, textId);
      await page.locator(`[data-node-id="${textId}"]`).first().dblclick({ position: { x: 40, y: 40 }, force: true });
      const editorShell = page.locator('[data-builder-inline-text-editor="true"]').first();
      await expect(editorShell).toBeVisible();

      const aiButton = page.locator('[data-builder-inline-text-ai="true"]').first();
      await expect(aiButton).toBeVisible();
      await aiButton.click({ force: true });

      const aiPanel = page.locator('[data-builder-ai-text-panel="true"]').first();
      await expect(aiPanel).toBeVisible();

      const generateButton = aiPanel.getByRole('button', { name: /생성$/ });
      await generateButton.click();

      await expect.poll(() => textRequestPayload, { timeout: 5_000 }).toBeTruthy();
      expect(textRequestPayload).toMatchObject({
        text: sourceText,
        action: 'rewrite',
        sourceLocale: 'ko',
      });

      const previewText = aiPanel.locator('p').first();
      await expect(previewText).toContainText(rewrittenText, { timeout: 5_000 });

      const applyButton = aiPanel.locator('[data-builder-ai-text-apply="true"]').first();
      await expect(applyButton).toBeEnabled();
      await applyButton.click();

      await expect(aiPanel).toBeHidden();

      // Commit the editor by clicking outside.
      await page.locator('header[class*="topBar"]').click({ position: { x: 20, y: 20 }, force: true });
      await expect(editorShell).toBeHidden();

      await expect(page.locator(`[data-node-id="${textId}"]`).first()).toContainText(rewrittenText);

      await expect.poll(
        async () => {
          const node = (await draftNodes(page, pageId!)).find((candidate) => candidate.id === textId);
          return node?.content?.text ?? null;
        },
        { timeout: 15_000 },
      ).toBe(rewrittenText);
    } finally {
      if (pageId) {
        await page.request
          .delete(`/api/builder/site/pages/${encodeURIComponent(pageId)}?locale=ko`, {
            headers: mutationHeaders(`cleanup-${token}`),
          })
          .catch(() => undefined);
      }
    }
  });

  test('translate action forwards target locale to the AI endpoint', async ({ page }) => {
    test.setTimeout(90_000);
    const token = `ai-translate-${Date.now().toString(36)}`;
    const slug = `ai-text-${token}`;
    const textId = 'ai-text-target';
    const sourceText = '대만 변호사 사무실의 신뢰감 있는 메시지입니다.';
    const translatedText = 'A trustworthy message from a Taiwanese law office.';

    await page.setExtraHTTPHeaders(mutationHeaders(token));
    let textRequestPayload: Record<string, unknown> | null = null;
    await page.route('**/api/builder/ai-generator/text', async (route) => {
      textRequestPayload = JSON.parse(route.request().postData() || '{}');
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          ok: true,
          action: 'translate',
          model: 'gpt-4o-mini-mock',
          text: translatedText,
          tone: null,
          targetLocale: 'en',
          finishReason: 'stop',
        }),
      });
    });

    let pageId: string | null = null;
    try {
      const document = makeTextDocument({ token, rootId: 'ai-text-root', textId, text: sourceText });
      pageId = await createBuilderPage(page.request, slug, `AI text translate ${token}`, document);

      await openBuilderPageById(page, pageId, 'translate');
      await selectNodeWithHandles(page, textId);
      await page.locator(`[data-node-id="${textId}"]`).first().dblclick({ position: { x: 40, y: 40 }, force: true });
      const aiButton = page.locator('[data-builder-inline-text-ai="true"]').first();
      await aiButton.click({ force: true });

      const aiPanel = page.locator('[data-builder-ai-text-panel="true"]').first();
      await expect(aiPanel).toBeVisible();

      // Click the Translate action chip
      await aiPanel.getByRole('radio', { name: 'Translate' }).click();
      const localeSelect = aiPanel.getByLabel('번역 대상 언어');
      await expect(localeSelect).toBeVisible();
      await localeSelect.selectOption('en');

      await aiPanel.getByRole('button', { name: /생성$/ }).click();
      await expect.poll(() => textRequestPayload, { timeout: 5_000 }).toBeTruthy();
      expect(textRequestPayload).toMatchObject({
        action: 'translate',
        sourceLocale: 'ko',
        targetLocale: 'en',
      });

      const previewText = aiPanel.locator('p').first();
      await expect(previewText).toContainText(translatedText, { timeout: 5_000 });
    } finally {
      if (pageId) {
        await page.request
          .delete(`/api/builder/site/pages/${encodeURIComponent(pageId)}?locale=ko`, {
            headers: mutationHeaders(`cleanup-${token}`),
          })
          .catch(() => undefined);
      }
    }
  });
});

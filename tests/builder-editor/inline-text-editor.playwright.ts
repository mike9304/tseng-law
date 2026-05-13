import { expect, test, type APIRequestContext, type Page } from '@playwright/test';

const shortcutModifier = 'ControlOrMeta';

type TestDocument = {
  version: 1;
  locale: 'ko';
  updatedAt: string;
  updatedBy: string;
  stageWidth: number;
  stageHeight: number;
  nodes: Array<Record<string, any>>;
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
  const safeScope = scope.replace(/[^a-z0-9-]/gi, '-').slice(-48) || 'inline-text';
  return { 'x-forwarded-for': `pw-${safeScope}` };
}

async function waitForRateLimit(response: Awaited<ReturnType<APIRequestContext['post']>>): Promise<boolean> {
  if (response.status() !== 429) return false;
  const retryAfter = Number(response.headers()['retry-after'] || '1');
  const waitMs = Math.max(1000, Math.min(65_000, Number.isFinite(retryAfter) ? retryAfter * 1000 : 1000));
  await new Promise((resolve) => setTimeout(resolve, waitMs));
  return true;
}

function makeInlineTextDocument(options: {
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
    updatedBy: `w03-inline-${options.token}`,
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
          label: 'W03 inline text root',
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
        rect: { x: 96, y: 88, width: 560, height: 86 },
        style: { ...baseStyle, borderRadius: 8 },
        zIndex: 1,
        rotation: 0,
        locked: false,
        visible: true,
        content: {
          text: options.text,
          fontSize: 32,
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

function collectTipTapMarkTypes(doc: unknown): string[] {
  const marks = new Set<string>();
  const visit = (node: unknown) => {
    if (!node || typeof node !== 'object') return;
    const candidate = node as { marks?: unknown; content?: unknown };
    if (Array.isArray(candidate.marks)) {
      candidate.marks.forEach((mark) => {
        if (mark && typeof mark === 'object' && typeof (mark as { type?: unknown }).type === 'string') {
          marks.add((mark as { type: string }).type);
        }
      });
    }
    if (Array.isArray(candidate.content)) {
      candidate.content.forEach(visit);
    }
  };
  visit(doc);
  return [...marks].sort();
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
    `/ko/admin-builder?pageId=${encodeURIComponent(pageId)}&inlineTextTest=${Date.now().toString(36)}-${scope}`,
    { waitUntil: 'domcontentloaded' },
  );
  const shell = page.locator('[data-editor-shell]').first();
  await expect(shell).toBeVisible({ timeout: 30_000 });
  await expect(shell).toHaveAttribute('data-editor-ready', 'true', { timeout: 30_000 });
  await expect(page.getByRole('application', { name: 'Canvas editor' })).toBeVisible();
}

async function selectNodeWithHandles(page: Page, nodeId: string): Promise<ReturnType<Page['locator']>> {
  const node = page.locator(`[data-node-id="${nodeId}"]`).first();
  await expect(node).toBeVisible({ timeout: 15_000 });

  for (let attempt = 0; attempt < 5; attempt += 1) {
    const box = await node.boundingBox();
    await node.click({
      position: box
        ? {
          x: Math.max(1, Math.min(box.width - 1, box.width / 2)),
          y: Math.max(1, Math.min(box.height - 1, box.height / 2)),
        }
        : { x: 24, y: 24 },
      force: true,
    });
    const selected = page.locator(`[data-node-id="${nodeId}"][class*="nodeSelected"]`).first();
    const handleCount = await selected.locator('[class*="resizeHandle"]:visible').count().catch(() => 0);
    if (handleCount === 8) return selected;
    await page.waitForTimeout(200);
  }

  const selected = page.locator(`[data-node-id="${nodeId}"][class*="nodeSelected"]`).first();
  await expect(selected.locator('[class*="resizeHandle"]:visible')).toHaveCount(8);
  return selected;
}

async function draftNodes(page: Page, pageId: string): Promise<Array<Record<string, any>>> {
  const response = await page.request.get(`/api/builder/site/pages/${pageId}/draft?locale=ko`);
  expect(response.status()).toBe(200);
  const payload = (await response.json()) as { document?: { nodes?: Array<Record<string, any>> } };
  return payload.document?.nodes ?? [];
}

test.describe('/ko/admin-builder inline text editing', () => {
  test('edits text inline with Wix-like toolbar and persists after reload', async ({ page }) => {
    test.setTimeout(90_000);

    const token = `w03-${Date.now().toString(36)}`;
    const title = `W03 Inline ${token}`;
    const slug = `g-editor-${token}`;
    const textId = `inline-text-${token}`;
    const originalText = `W03 original ${token}`;
    const editedText = `W03 edited ${token}`;
    let pageId: string | null = null;
    await page.setExtraHTTPHeaders(mutationHeaders(token));

    try {
      pageId = await createBuilderPage(
        page.request,
        slug,
        title,
        makeInlineTextDocument({
          token,
          rootId: `inline-root-${token}`,
          textId,
          text: originalText,
        }),
      );

      await openBuilderPageById(page, pageId, 'initial');
      let textNode = page.locator(`[data-node-id="${textId}"]`).first();
      await expect(textNode).toContainText(originalText);
      textNode = await selectNodeWithHandles(page, textId);
      await expect(textNode.locator('[class*="resizeHandle"]:visible')).toHaveCount(8);

      await textNode.dblclick({ position: { x: 30, y: 30 }, force: true });
      const editorShell = page.locator('[data-builder-inline-text-editor="true"]').first();
      const toolbar = page.locator('[data-builder-inline-text-toolbar="true"]').first();
      await expect(editorShell).toBeVisible();
      await expect(toolbar).toBeVisible();
      await expect(toolbar).toHaveAttribute('data-placement', /above|below/);
      const toolbarVisual = await toolbar.evaluate((element) => {
        const style = window.getComputedStyle(element);
        return {
          position: style.position,
          display: style.display,
          borderStyle: style.borderStyle,
          borderRadius: Number.parseFloat(style.borderRadius),
          boxShadow: style.boxShadow,
          zIndex: Number.parseInt(style.zIndex, 10),
        };
      });
      expect(toolbarVisual.position).toBe('absolute');
      expect(toolbarVisual.display).toBe('flex');
      expect(toolbarVisual.borderStyle).toBe('solid');
      expect(toolbarVisual.borderRadius).toBeGreaterThanOrEqual(6);
      expect(toolbarVisual.boxShadow).not.toBe('none');
      expect(toolbarVisual.zIndex).toBeGreaterThanOrEqual(9999);
      await expect(textNode.locator('[class*="resizeHandle"]:visible')).toHaveCount(0);
      await expect(page.locator('[class*="selectionToolbar"]:visible')).toHaveCount(0);

      const editable = editorShell.locator('.ProseMirror').first();
      const boldButton = toolbar.getByRole('button', { name: 'Bold' });
      await expect(boldButton).toHaveAttribute('aria-pressed', 'false');
      await editable.fill(editedText);
      await editable.press(`${shortcutModifier}+A`);
      await boldButton.click();
      await expect(boldButton).toHaveAttribute('aria-pressed', 'true');
      const activeButtonVisual = await boldButton.evaluate((element) => {
        const style = window.getComputedStyle(element);
        return {
          backgroundColor: style.backgroundColor,
          color: style.color,
        };
      });
      expect(activeButtonVisual.backgroundColor).not.toBe('rgba(0, 0, 0, 0)');
      expect(activeButtonVisual.color).toBe('rgb(255, 255, 255)');
      await page.keyboard.press('Escape');
      await expect(editorShell).toBeHidden();
      await expect(page.locator(`[data-node-id="${textId}"]`).first()).toContainText(editedText);

      await expect.poll(async () => {
        const node = (await draftNodes(page, pageId!)).find((candidate) => candidate.id === textId);
        return {
          text: node?.content?.text ?? null,
          richPlainText: node?.content?.richText?.plainText ?? null,
        };
      }, { timeout: 15_000 }).toEqual({
        text: editedText,
        richPlainText: editedText,
      });
      await expect.poll(async () => {
        const node = (await draftNodes(page, pageId!)).find((candidate) => candidate.id === textId);
        return collectTipTapMarkTypes(node?.content?.richText?.doc).includes('bold');
      }, { timeout: 15_000 }).toBe(true);

      await page.keyboard.press(`${shortcutModifier}+Z`);
      await expect(page.getByText(/Undid:/).first()).toBeVisible();
      await expect.poll(async () => {
        const node = (await draftNodes(page, pageId!)).find((candidate) => candidate.id === textId);
        return {
          text: node?.content?.text ?? null,
          bold: collectTipTapMarkTypes(node?.content?.richText?.doc).includes('bold'),
        };
      }, { timeout: 15_000 }).toEqual({ text: editedText, bold: false });

      await page.keyboard.press(`${shortcutModifier}+Z`);
      await expect(page.getByText(/Undid:/).first()).toBeVisible();
      await expect.poll(async () => {
        const node = (await draftNodes(page, pageId!)).find((candidate) => candidate.id === textId);
        return {
          text: node?.content?.text ?? null,
          bold: collectTipTapMarkTypes(node?.content?.richText?.doc).includes('bold'),
        };
      }, { timeout: 15_000 }).toEqual({ text: originalText, bold: false });

      await page.keyboard.press(`${shortcutModifier}+Y`);
      await expect(page.getByText(/Redid:/).first()).toBeVisible();
      await expect.poll(async () => {
        const node = (await draftNodes(page, pageId!)).find((candidate) => candidate.id === textId);
        return {
          text: node?.content?.text ?? null,
          bold: collectTipTapMarkTypes(node?.content?.richText?.doc).includes('bold'),
        };
      }, { timeout: 15_000 }).toEqual({ text: editedText, bold: false });

      await page.keyboard.press(`${shortcutModifier}+Y`);
      await expect(page.getByText(/Redid:/).first()).toBeVisible();
      await expect.poll(async () => {
        const node = (await draftNodes(page, pageId!)).find((candidate) => candidate.id === textId);
        return {
          text: node?.content?.text ?? null,
          bold: collectTipTapMarkTypes(node?.content?.richText?.doc).includes('bold'),
        };
      }, { timeout: 15_000 }).toEqual({ text: editedText, bold: true });

      await openBuilderPageById(page, pageId, 'reload');
      await expect(page.locator(`[data-node-id="${textId}"]`).first()).toContainText(editedText, {
        timeout: 15_000,
      });
    } finally {
      if (pageId) {
        await page.request.delete(`/api/builder/site/pages/${pageId}?locale=ko`, {
          headers: mutationHeaders(slug),
          failOnStatusCode: false,
        });
      }
    }
  });
});

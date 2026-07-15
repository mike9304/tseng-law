import { expect, test, type APIRequestContext, type Page } from '@playwright/test';

const shortcutModifier = 'ControlOrMeta';

type TestDocument = {
  version: 1;
  locale: 'ko';
  updatedAt: string;
  updatedBy: string;
  stageWidth: number;
  stageHeight: number;
  nodes: TestNode[];
};

type TestNode = Record<string, unknown> & {
  id?: string;
  content?: Record<string, unknown> & {
    richText?: {
      plainText?: unknown;
      doc?: unknown;
    };
  };
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
  className?: string;
  as?: string;
  fontSize?: number;
  rootRect?: { x: number; y: number; width: number; height: number };
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
        rect: options.rootRect ?? { x: 0, y: 0, width: 1280, height: 760 },
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
          fontSize: options.fontSize ?? 32,
          color: '#0f172a',
          fontWeight: 'bold',
          align: 'left',
          lineHeight: 1.2,
          letterSpacing: 0,
          fontFamily: 'system-ui',
          verticalAlign: 'top',
          textTransform: 'none',
          ...(options.className ? { className: options.className } : {}),
          as: options.as ?? 'h2',
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
  await node.scrollIntoViewIfNeeded();
  const box = await node.boundingBox();
  await node.click({
    position: box
      ? {
        x: Math.max(1, Math.min(box.width - 1, box.width / 2)),
        y: Math.max(1, Math.min(box.height - 1, box.height / 2)),
      }
      : { x: 24, y: 24 },
  });
  const selected = page.locator(`[data-node-id="${nodeId}"][class*="nodeSelected"]`).first();
  await expect(selected.locator('[class*="resizeHandle"]:visible')).toHaveCount(8);
  return selected;
}

async function draftNodes(page: Page, pageId: string): Promise<TestNode[]> {
  const response = await page.request.get(`/api/builder/site/pages/${pageId}/draft?locale=ko`);
  expect(response.status()).toBe(200);
  const payload = (await response.json()) as { document?: { nodes?: TestNode[] } };
  return payload.document?.nodes ?? [];
}

test.describe('/ko/admin-builder inline text editing', () => {
  test('preserves home hero title size and clears selection after outside click', async ({ page }) => {
    test.setTimeout(90_000);

    const token = `home-title-${Date.now().toString(36)}`;
    const title = `Inline home title ${token}`;
    const slug = `g-editor-${token}`;
    const textId = 'home-hero-title';
    const editedText = `대만 법률을 한국어로 명확하게 수정 ${token}`;
    let pageId: string | null = null;
    await page.setExtraHTTPHeaders(mutationHeaders(token));

    try {
      const document = makeInlineTextDocument({
        token,
        rootId: 'home-hero-root',
        textId,
        text: '대만 법률을 한국어로 명확하게.',
        className: 'hero-title',
        as: 'h1',
        fontSize: 16,
      });
      const originalNode = document.nodes.find((candidate) => candidate.id === textId);
      const originalFontSize = originalNode?.content?.fontSize ?? null;

      pageId = await createBuilderPage(page.request, slug, title, document);

      await openBuilderPageById(page, pageId, 'home-title');
      const textNode = await selectNodeWithHandles(page, textId);
      const renderedTitle = textNode.locator('.hero-title').first();
      const beforeVisual = await renderedTitle.evaluate((element) => {
        const style = window.getComputedStyle(element);
        return {
          color: style.color,
          fontFamily: style.fontFamily,
          fontSize: Number.parseFloat(style.fontSize),
          fontWeight: style.fontWeight,
          letterSpacing: style.letterSpacing,
          lineHeight: style.lineHeight,
        };
      });
      expect(beforeVisual.fontSize).toBeGreaterThan(48);

      await page.locator(`[data-node-id="${textId}"]`).first().dblclick({ position: { x: 30, y: 30 } });
      const editorShell = page.locator('[data-builder-inline-text-editor="true"]').first();
      const editable = editorShell.locator('.ProseMirror').first();
      await expect(editorShell).toBeVisible();
      const editorVisual = await editable.evaluate((element) => {
        const style = window.getComputedStyle(element);
        const block = element.querySelector('p,h1,h2,h3');
        const blockStyle = block ? window.getComputedStyle(block) : null;
        return {
          color: style.color,
          fontFamily: style.fontFamily,
          fontSize: Number.parseFloat(style.fontSize),
          fontWeight: style.fontWeight,
          letterSpacing: style.letterSpacing,
          lineHeight: style.lineHeight,
          blockMarginTop: blockStyle ? Number.parseFloat(blockStyle.marginTop) : null,
          blockMarginBottom: blockStyle ? Number.parseFloat(blockStyle.marginBottom) : null,
        };
      });
      expect(Math.abs(editorVisual.fontSize - beforeVisual.fontSize)).toBeLessThanOrEqual(1);
      expect(editorVisual.lineHeight).toBe(beforeVisual.lineHeight);
      expect(editorVisual.fontWeight).toBe(beforeVisual.fontWeight);
      expect(editorVisual.fontFamily).toBe(beforeVisual.fontFamily);
      expect(editorVisual.letterSpacing).toBe(beforeVisual.letterSpacing);
      expect(editorVisual.color).toBe(beforeVisual.color);
      expect(editorVisual.blockMarginTop).toBe(0);
      expect(editorVisual.blockMarginBottom).toBe(0);

      await editable.fill(editedText);
      await page.locator('header[class*="topBar"]').click({ position: { x: 20, y: 20 } });

      await expect(editorShell).toBeHidden();
      await expect(page.locator('[data-node-id][data-selected="true"]')).toHaveCount(0);
      await expect(page.locator('[class*="selectionPill"]:visible')).toHaveCount(0);
      await expect(page.locator('[class*="selectionToolbar"]:visible')).toHaveCount(0);
      await expect(page.locator(`[data-node-id="${textId}"] [class*="resizeHandle"]:visible`)).toHaveCount(0);
      await expect.poll(async () => page.evaluate(() => {
        const active = window.document.activeElement;
        return Boolean(active?.closest('.ProseMirror') || active?.getAttribute('contenteditable') === 'true');
      })).toBe(false);

      await expect(page.locator(`[data-node-id="${textId}"]`).first()).toContainText(editedText);
      const afterVisual = await page.locator(`[data-node-id="${textId}"] .hero-title`).first().evaluate((element) => {
        const style = window.getComputedStyle(element);
        return {
          color: style.color,
          fontFamily: style.fontFamily,
          fontSize: Number.parseFloat(style.fontSize),
          fontWeight: style.fontWeight,
          letterSpacing: style.letterSpacing,
          lineHeight: style.lineHeight,
        };
      });
      expect(Math.abs(afterVisual.fontSize - beforeVisual.fontSize)).toBeLessThanOrEqual(1);
      expect(afterVisual.lineHeight).toBe(beforeVisual.lineHeight);
      expect(afterVisual.fontWeight).toBe(beforeVisual.fontWeight);
      expect(afterVisual.fontFamily).toBe(beforeVisual.fontFamily);
      expect(afterVisual.letterSpacing).toBe(beforeVisual.letterSpacing);
      expect(afterVisual.color).toBe(beforeVisual.color);

      await expect.poll(async () => {
        const node = (await draftNodes(page, pageId!)).find((candidate) => candidate.id === textId);
        return {
          text: node?.content?.text ?? null,
          richPlainText: node?.content?.richText?.plainText ?? null,
          className: node?.content?.className ?? null,
          as: node?.content?.as ?? null,
          fontSize: node?.content?.fontSize ?? null,
        };
      }, { timeout: 15_000 }).toEqual({
        text: editedText,
        richPlainText: editedText,
        className: 'hero-title',
        as: 'h1',
        fontSize: originalFontSize,
      });

      await openBuilderPageById(page, pageId, 'home-title-reload');
      await expect(page.locator(`[data-node-id="${textId}"]`).first()).toContainText(editedText, {
        timeout: 15_000,
      });
      await expect(page.locator('[data-node-id][data-selected="true"]')).toHaveCount(0);
      const reloadVisual = await page.locator(`[data-node-id="${textId}"] .hero-title`).first().evaluate((element) => {
        const style = window.getComputedStyle(element);
        return {
          fontSize: Number.parseFloat(style.fontSize),
          fontWeight: style.fontWeight,
          lineHeight: style.lineHeight,
        };
      });
      expect(Math.abs(reloadVisual.fontSize - beforeVisual.fontSize)).toBeLessThanOrEqual(1);
      expect(reloadVisual.lineHeight).toBe(beforeVisual.lineHeight);
      expect(reloadVisual.fontWeight).toBe(beforeVisual.fontWeight);
    } finally {
      if (pageId) {
        await page.request.delete(`/api/builder/site/pages/${pageId}?locale=ko`, {
          headers: mutationHeaders(slug),
          failOnStatusCode: false,
        });
      }
    }
  });

  test('keeps class-based title size and clears selection after outside click', async ({ page }) => {
    test.setTimeout(90_000);

    const token = `title-style-${Date.now().toString(36)}`;
    const title = `Inline title style ${token}`;
    const slug = `g-editor-${token}`;
    const textId = `inline-title-${token}`;
    const originalText = `주요 서비스 ${token}`;
    const editedText = `자주 받는 질문 ${token}`;
    let pageId: string | null = null;
    await page.setExtraHTTPHeaders(mutationHeaders(token));

    try {
      pageId = await createBuilderPage(
        page.request,
        slug,
        title,
        makeInlineTextDocument({
          token,
          rootId: `inline-title-root-${token}`,
          textId,
          text: originalText,
          className: 'section-title',
          as: 'h2',
          fontSize: 16,
        }),
      );

      await openBuilderPageById(page, pageId, 'title-style');
      let textNode = await selectNodeWithHandles(page, textId);
      const renderedTitle = textNode.locator('.section-title').first();
      const beforeVisual = await renderedTitle.evaluate((element) => {
        const style = window.getComputedStyle(element);
        return {
          fontSize: Number.parseFloat(style.fontSize),
          lineHeight: style.lineHeight,
          fontWeight: style.fontWeight,
        };
      });
      expect(beforeVisual.fontSize).toBeGreaterThan(32);

      await page.locator(`[data-node-id="${textId}"]`).first().dblclick({ position: { x: 30, y: 30 } });
      const editorShell = page.locator('[data-builder-inline-text-editor="true"]').first();
      const editable = editorShell.locator('.ProseMirror').first();
      await expect(editorShell).toBeVisible();
      const editorVisual = await editable.evaluate((element) => {
        const style = window.getComputedStyle(element);
        const block = element.querySelector('p,h1,h2,h3');
        const blockStyle = block ? window.getComputedStyle(block) : null;
        return {
          fontSize: Number.parseFloat(style.fontSize),
          lineHeight: style.lineHeight,
          fontWeight: style.fontWeight,
          blockMarginTop: blockStyle ? Number.parseFloat(blockStyle.marginTop) : null,
          blockMarginBottom: blockStyle ? Number.parseFloat(blockStyle.marginBottom) : null,
        };
      });
      expect(Math.abs(editorVisual.fontSize - beforeVisual.fontSize)).toBeLessThanOrEqual(1);
      expect(editorVisual.lineHeight).toBe(beforeVisual.lineHeight);
      expect(editorVisual.fontWeight).toBe(beforeVisual.fontWeight);
      expect(editorVisual.blockMarginTop).toBe(0);
      expect(editorVisual.blockMarginBottom).toBe(0);

      await editable.fill(editedText);
      await page.locator('header[class*="topBar"]').click({ position: { x: 20, y: 20 } });
      await expect(editorShell).toBeHidden();
      await expect(page.locator('[data-node-id][data-selected="true"]')).toHaveCount(0);
      await expect(page.locator('[class*="selectionPill"]:visible')).toHaveCount(0);
      await expect(page.locator('[class*="selectionToolbar"]:visible')).toHaveCount(0);
      await expect(page.locator(`[data-node-id="${textId}"] [class*="resizeHandle"]:visible`)).toHaveCount(0);
      textNode = page.locator(`[data-node-id="${textId}"]`).first();
      await expect(textNode).toContainText(editedText);
      const afterVisual = await textNode.locator('.section-title').first().evaluate((element) => {
        const style = window.getComputedStyle(element);
        return {
          fontSize: Number.parseFloat(style.fontSize),
          lineHeight: style.lineHeight,
          fontWeight: style.fontWeight,
        };
      });
      expect(Math.abs(afterVisual.fontSize - beforeVisual.fontSize)).toBeLessThanOrEqual(1);
      expect(afterVisual.lineHeight).toBe(beforeVisual.lineHeight);
      expect(afterVisual.fontWeight).toBe(beforeVisual.fontWeight);
      await expect.poll(async () => {
        const node = (await draftNodes(page, pageId!)).find((candidate) => candidate.id === textId);
        return {
          text: node?.content?.text ?? null,
          richPlainText: node?.content?.richText?.plainText ?? null,
          className: node?.content?.className ?? null,
          as: node?.content?.as ?? null,
          fontSize: node?.content?.fontSize ?? null,
        };
      }, { timeout: 15_000 }).toEqual({
        text: editedText,
        richPlainText: editedText,
        className: 'section-title',
        as: 'h2',
        fontSize: 16,
      });

      await openBuilderPageById(page, pageId, 'title-style-reload');
      await expect(page.locator(`[data-node-id="${textId}"]`).first()).toContainText(editedText, {
        timeout: 15_000,
      });
      await expect(page.locator('[data-node-id][data-selected="true"]')).toHaveCount(0);
      const reloadVisual = await page.locator(`[data-node-id="${textId}"] .section-title`).first().evaluate((element) => {
        const style = window.getComputedStyle(element);
        return {
          fontSize: Number.parseFloat(style.fontSize),
          lineHeight: style.lineHeight,
          fontWeight: style.fontWeight,
        };
      });
      expect(Math.abs(reloadVisual.fontSize - beforeVisual.fontSize)).toBeLessThanOrEqual(1);
      expect(reloadVisual.lineHeight).toBe(beforeVisual.lineHeight);
      expect(reloadVisual.fontWeight).toBe(beforeVisual.fontWeight);
    } finally {
      if (pageId) {
        await page.request.delete(`/api/builder/site/pages/${pageId}?locale=ko`, {
          headers: mutationHeaders(slug),
          failOnStatusCode: false,
        });
      }
    }
  });

  test('edits text inline with Wix-like toolbar and persists after reload', async ({ page }) => {
    test.setTimeout(90_000);

    const duplicateExtensionWarnings: string[] = [];
    page.on('console', (message) => {
      if (message.type() === 'warning' && message.text().includes('Duplicate extension names')) {
        duplicateExtensionWarnings.push(message.text());
      }
    });

    const token = `w03-${Date.now().toString(36)}`;
    const title = `W03 Inline ${token}`;
    const slug = `g-editor-${token}`;
    const textId = `inline-text-${token}`;
    const originalText = `W03 original ${token}`;
    const canceledText = `W03 canceled ${token}`;
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
      const textNode = page.locator(`[data-node-id="${textId}"]`).first();
      await expect(textNode).toContainText(originalText);
      await selectNodeWithHandles(page, textId);

      await page.locator(`[data-node-id="${textId}"]`).first().dblclick({ position: { x: 30, y: 30 } });
      const editorShell = page.locator('[data-builder-inline-text-editor="true"]').first();
      const toolbar = page.locator('[data-builder-inline-text-toolbar="true"]').first();
      await expect(editorShell).toBeVisible();
      await expect(toolbar).toBeVisible();
      await expect(toolbar).toHaveAttribute('data-placement', /above|below/);
      const commitAction = toolbar.locator('[data-builder-inline-text-action="commit"]');
      const cancelAction = toolbar.locator('[data-builder-inline-text-action="cancel"]');
      await expect(commitAction).toBeVisible();
      await expect(commitAction).toContainText('완료');
      await expect(commitAction).toHaveAttribute('aria-keyshortcuts', 'Control+Enter Meta+Enter');
      await expect(cancelAction).toBeVisible();
      await expect(cancelAction).toContainText('취소');
      await expect(cancelAction).toHaveAttribute('aria-keyshortcuts', 'Escape');
      expect(duplicateExtensionWarnings).toEqual([]);
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
      await expect.poll(() => editable.evaluate((element) => {
        const selection = window.getSelection();
        return Boolean(selection?.isCollapsed && selection.anchorNode && element.contains(selection.anchorNode));
      })).toBe(true);
      await editable.fill(canceledText);
      await page.keyboard.press('Escape');
      await expect(editorShell).toBeHidden();
      await expect.poll(async () => {
        const node = (await draftNodes(page, pageId!)).find((candidate) => candidate.id === textId);
        return {
          text: node?.content?.text ?? null,
          richPlainText: node?.content?.richText?.plainText ?? null,
        };
      }, { timeout: 15_000 }).toEqual({
        text: originalText,
        richPlainText: originalText,
      });

      await textNode.dblclick({ position: { x: 30, y: 30 } });
      await expect(editorShell).toBeVisible();
      await expect(editable).toContainText(originalText);
      const linkButton = toolbar.getByRole('button', { name: /^Link$|^링크$/ });
      await linkButton.click();
      const linkDialog = toolbar.getByRole('dialog', { name: /링크|Link/ }).first();
      await expect(linkDialog).toBeVisible();
      const hrefInput = linkDialog.locator('[data-builder-href-input="true"]');
      await hrefInput.focus();
      await hrefInput.press('Escape');
      await expect(linkDialog).toBeHidden();
      await expect(editorShell).toBeVisible();
      await expect(linkButton).toBeFocused();

      await editable.fill('First paragraph');
      await editable.press('End');
      await editable.press('Enter');
      await editable.type('Second paragraph');
      await expect(editable.locator('p')).toHaveCount(2);
      await editable.press('Shift+Enter');
      await editable.type('soft break');
      await expect(editable.locator('br')).toHaveCount(1);

      const boldButton = toolbar.getByRole('button', { name: /^Bold$|^굵게$/ });
      await expect(boldButton).toHaveAttribute('aria-pressed', 'false');
      await editable.fill(editedText);
      await editable.selectText();
      await expect.poll(() => editable.evaluate(() => window.getSelection()?.toString() ?? ''))
        .toBe(editedText);
      await boldButton.focus();
      await boldButton.press('Enter');
      await expect(boldButton).toHaveAttribute('aria-pressed', 'true');
      await expect(editable.locator('strong')).toContainText(editedText);
      await expect.poll(async () => boldButton.evaluate((element) => {
        const style = window.getComputedStyle(element);
        return {
          backgroundColor: style.backgroundColor,
          color: style.color,
        };
      })).toEqual({
        backgroundColor: 'rgb(17, 109, 255)',
        color: 'rgb(255, 255, 255)',
      });
      await editable.focus();
      await commitAction.click();
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
      await expect.poll(async () => {
        const node = (await draftNodes(page, pageId!)).find((candidate) => candidate.id === textId);
        return {
          text: node?.content?.text ?? null,
          bold: collectTipTapMarkTypes(node?.content?.richText?.doc).includes('bold'),
        };
      }, { timeout: 15_000 }).toEqual({ text: editedText, bold: false });

      await page.keyboard.press(`${shortcutModifier}+Z`);
      await expect.poll(async () => {
        const node = (await draftNodes(page, pageId!)).find((candidate) => candidate.id === textId);
        return {
          text: node?.content?.text ?? null,
          bold: collectTipTapMarkTypes(node?.content?.richText?.doc).includes('bold'),
        };
      }, { timeout: 15_000 }).toEqual({ text: originalText, bold: false });

      await page.keyboard.press(`${shortcutModifier}+Y`);
      await expect.poll(async () => {
        const node = (await draftNodes(page, pageId!)).find((candidate) => candidate.id === textId);
        return {
          text: node?.content?.text ?? null,
          bold: collectTipTapMarkTypes(node?.content?.richText?.doc).includes('bold'),
        };
      }, { timeout: 15_000 }).toEqual({ text: editedText, bold: false });

      await page.keyboard.press(`${shortcutModifier}+Y`);
      await expect.poll(async () => {
        const node = (await draftNodes(page, pageId!)).find((candidate) => candidate.id === textId);
        return {
          text: node?.content?.text ?? null,
          bold: collectTipTapMarkTypes(node?.content?.richText?.doc).includes('bold'),
        };
      }, { timeout: 15_000 }).toEqual({ text: editedText, bold: true });

      await textNode.dblclick({ position: { x: 30, y: 30 } });
      await expect(editorShell).toBeVisible();
      await editable.fill(canceledText);
      await cancelAction.click();
      await expect(editorShell).toBeHidden();
      await expect.poll(async () => {
        const node = (await draftNodes(page, pageId!)).find((candidate) => candidate.id === textId);
        return node?.content?.text ?? null;
      }, { timeout: 15_000 }).toBe(editedText);

      await textNode.dblclick({ position: { x: 30, y: 30 } });
      await expect(editorShell).toBeVisible();
      await editable.focus();
      await editable.press(`${shortcutModifier}+Enter`);
      await expect(editorShell).toBeHidden();

      await textNode.dblclick({ position: { x: 30, y: 30 } });
      await expect(editorShell).toBeVisible();
      await editable.focus();
      await editable.press('Tab');
      await expect(editorShell).toBeHidden();
      await expect.poll(() => page.evaluate(() => {
        const active = document.activeElement;
        return active !== document.body && !active?.closest('[data-builder-inline-text-editor="true"]');
      })).toBe(true);

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

  test('commits text and clears selection when clicking outside editor chrome', async ({ page }) => {
    test.setTimeout(90_000);

    const token = `outside-${Date.now().toString(36)}`;
    const title = `W03 Outside ${token}`;
    const slug = `g-editor-${token}`;
    const textId = `inline-outside-${token}`;
    const originalText = `W03 outside original ${token}`;
    const editedText = `W03 outside edited ${token}`;
    let pageId: string | null = null;
    await page.setExtraHTTPHeaders(mutationHeaders(token));

    try {
      pageId = await createBuilderPage(
        page.request,
        slug,
        title,
        makeInlineTextDocument({
          token,
          rootId: `inline-outside-root-${token}`,
          textId,
          text: originalText,
          rootRect: { x: 0, y: 0, width: 760, height: 360 },
        }),
      );

      await openBuilderPageById(page, pageId, 'outside-click');
      await selectNodeWithHandles(page, textId);
      await page.locator(`[data-node-id="${textId}"]`).first().dblclick({ position: { x: 30, y: 30 } });

      const editorShell = page.locator('[data-builder-inline-text-editor="true"]').first();
      const editable = editorShell.locator('.ProseMirror').first();
      await expect(editorShell).toBeVisible();
      await editable.click();
      await editable.press(`${shortcutModifier}+A`);
      await editable.fill(editedText);

      const stage = page.getByLabel('Canvas editor').first();
      const stageBox = await stage.boundingBox();
      expect(stageBox).not.toBeNull();
      if (!stageBox) throw new Error('Missing canvas editor bounds.');
      await stage.click({
        position: {
          x: Math.max(10, Math.floor(stageBox.width * 0.86)),
          y: Math.max(10, Math.floor(stageBox.height * 0.82)),
        },
      });

      await expect(editorShell).toBeHidden();
      await expect(page.locator(`[data-node-id="${textId}"]`).first()).not.toHaveAttribute('data-selected', 'true');
      await expect(page.getByRole('toolbar', { name: '요소 빠른 작업' })).toBeHidden();
      await expect.poll(async () => {
        const node = (await draftNodes(page, pageId!)).find((candidate) => candidate.id === textId);
        return node?.content?.text ?? null;
      }, { timeout: 15_000 }).toBe(editedText);
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

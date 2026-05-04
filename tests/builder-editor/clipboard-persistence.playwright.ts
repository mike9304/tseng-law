import { expect, test, type APIRequestContext, type Locator, type Page } from '@playwright/test';

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

function escapeRegex(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function makeDocument(options: {
  token: string;
  rootId: string;
  titleId: string;
  titleText: string;
}): TestDocument {
  const now = new Date().toISOString();
  return {
    version: 1,
    locale: 'ko',
    updatedAt: now,
    updatedBy: `w29-w30-${options.token}`,
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
          label: 'W29-W30 test root',
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
        id: options.titleId,
        kind: 'text',
        parentId: options.rootId,
        rect: { x: 80, y: 72, width: 520, height: 74 },
        style: { ...baseStyle, borderRadius: 10 },
        zIndex: 1,
        rotation: 0,
        locked: false,
        visible: true,
        content: {
          text: options.titleText,
          fontSize: 34,
          color: '#0f172a',
          fontWeight: 'bold',
          align: 'left',
          lineHeight: 1.2,
          letterSpacing: 0,
          fontFamily: 'system-ui',
          verticalAlign: 'top',
          textTransform: 'none',
          as: 'h1',
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
  const response = await request.post('/api/builder/site/pages', {
    data: { locale: 'ko', slug, title, document },
  });
  expect(response.status()).toBe(200);
  const payload = (await response.json()) as { success?: boolean; pageId?: string; error?: string };
  expect(payload.success, payload.error).toBe(true);
  expect(payload.pageId).toBeTruthy();
  return payload.pageId!;
}

async function openBuilderPageFromPagesPanel(page: Page, pageTitle: string): Promise<void> {
  await page.goto(`/ko/admin-builder?clipboardTest=${Date.now().toString(36)}`, { waitUntil: 'domcontentloaded' });
  await expect(page.getByRole('application', { name: 'Canvas editor' })).toBeVisible();
  const pagesDrawer = await openPagesDrawer(page);
  const pageButton = pagesDrawer
    .getByRole('button', { name: new RegExp(escapeRegex(pageTitle)) })
    .first();
  await expect(pageButton).toBeVisible({ timeout: 15_000 });
  await pageButton.click();
  await expect(page.getByText(/Loaded page:/)).toBeVisible();
}

async function openPagesDrawer(page: Page): Promise<Locator> {
  const drawer = page.locator('aside[aria-hidden="false"]').first();
  if (await drawer.isVisible().catch(() => false)) return drawer;

  const pagesButton = page.getByRole('button', { name: 'Pages', exact: true });
  await expect(pagesButton).toBeVisible();
  for (let attempt = 0; attempt < 3; attempt += 1) {
    await pagesButton.click({ force: true });
    await page.waitForTimeout(250);
    if (await drawer.isVisible().catch(() => false)) return drawer;
  }
  await expect(drawer).toBeVisible();
  return drawer;
}

async function draftNodes(page: Page, pageId: string): Promise<Array<Record<string, any>>> {
  const response = await page.request.get(`/api/builder/site/pages/${pageId}/draft?locale=ko`);
  expect(response.status()).toBe(200);
  const payload = (await response.json()) as { document?: { nodes?: Array<Record<string, any>> } };
  return payload.document?.nodes ?? [];
}

function countText(nodes: Array<Record<string, any>>, text: string): number {
  return nodes.filter((node) => node.kind === 'text' && node.content?.text === text).length;
}

function findOffsetText(nodes: Array<Record<string, any>>, text: string): Record<string, any> | undefined {
  return nodes.find((node) =>
    node.kind === 'text'
    && node.content?.text === text
    && node.rect?.x === 100
    && node.rect?.y === 92,
  );
}

async function visibleLeafTextCount(page: Page, text: string): Promise<number> {
  return page.evaluate((value) => (
    Array.from(document.querySelectorAll('[data-node-id]'))
      .filter((element) =>
        element.textContent?.includes(value)
        && !element.querySelector('[data-node-id]'),
      ).length
  ), text);
}

test.describe('/ko/admin-builder clipboard and duplicate persistence', () => {
  test('persists Cmd+D duplicate and cross-page Cmd+C/Cmd+V paste after reload', async ({ page }) => {
    test.setTimeout(120_000);

    const token = `w29w30-${Date.now().toString(36)}`;
    const sourceText = `W29 W30 source ${token}`;
    const targetText = `W29 W30 target ${token}`;
    const sourceTitle = `W29 Source ${token}`;
    const targetTitle = `W30 Target ${token}`;
    const sourceSlug = `g-editor-${token}-source`;
    const targetSlug = `g-editor-${token}-target`;
    let sourcePageId: string | null = null;
    let targetPageId: string | null = null;

    try {
      sourcePageId = await createBuilderPage(
        page.request,
        sourceSlug,
        sourceTitle,
        makeDocument({
          token,
          rootId: `root-source-${token}`,
          titleId: `source-title-${token}`,
          titleText: sourceText,
        }),
      );
      targetPageId = await createBuilderPage(
        page.request,
        targetSlug,
        targetTitle,
        makeDocument({
          token,
          rootId: `root-target-${token}`,
          titleId: `target-title-${token}`,
          titleText: targetText,
        }),
      );

      await openBuilderPageFromPagesPanel(page, sourceTitle);
      const sourceNode = page.locator(`[data-node-id="source-title-${token}"]`).first();
      await expect(sourceNode).toContainText(sourceText);
      await sourceNode.click({ position: { x: 20, y: 20 }, force: true });

      await page.keyboard.press(`${shortcutModifier}+D`);
      await expect(page.getByText('Duplicated')).toBeVisible();
      await expect.poll(async () => countText(await draftNodes(page, sourcePageId!), sourceText), {
        timeout: 10_000,
      }).toBe(2);
      await expect.poll(async () => Boolean(findOffsetText(await draftNodes(page, sourcePageId!), sourceText)), {
        timeout: 5_000,
      }).toBe(true);

      await openBuilderPageFromPagesPanel(page, sourceTitle);
      await expect.poll(() => visibleLeafTextCount(page, sourceText), { timeout: 10_000 }).toBeGreaterThanOrEqual(2);

      await page.locator(`[data-node-id="source-title-${token}"]`).first().click({ position: { x: 4, y: 4 }, force: true });
      await page.keyboard.press(`${shortcutModifier}+C`);
      const pagesDrawer = await openPagesDrawer(page);
      await expect(page.getByText('1개 요소 클립보드')).toBeVisible();
      await pagesDrawer.getByRole('button', { name: new RegExp(escapeRegex(targetTitle)) }).first().click();
      await expect(page.getByText(/Loaded page:/)).toBeVisible();
      await expect(page.locator(`[data-node-id="target-title-${token}"]`).first()).toContainText(targetText, {
        timeout: 15_000,
      });

      await page.keyboard.press(`${shortcutModifier}+V`);
      await expect(page.getByText(/Pasted 1 item/).first()).toBeVisible();
      await expect.poll(async () => countText(await draftNodes(page, targetPageId!), sourceText), {
        timeout: 10_000,
      }).toBe(1);
      await expect.poll(async () => Boolean(findOffsetText(await draftNodes(page, targetPageId!), sourceText)), {
        timeout: 5_000,
      }).toBe(true);

      await openBuilderPageFromPagesPanel(page, targetTitle);
      await expect.poll(() => visibleLeafTextCount(page, sourceText), { timeout: 10_000 }).toBeGreaterThanOrEqual(1);
    } finally {
      if (sourcePageId) {
        await page.request.delete(`/api/builder/site/pages/${sourcePageId}?locale=ko`, {
          failOnStatusCode: false,
        });
      }
      if (targetPageId) {
        await page.request.delete(`/api/builder/site/pages/${targetPageId}?locale=ko`, {
          failOnStatusCode: false,
        });
      }
    }
  });
});

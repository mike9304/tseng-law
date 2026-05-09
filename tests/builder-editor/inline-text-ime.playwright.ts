import { expect, test, type APIRequestContext, type Locator, type Page } from '@playwright/test';
import { openBuilder } from './helpers/editor';

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
  const safeScope = scope.replace(/[^a-z0-9-]/gi, '-').slice(-48) || 'inline-ime';
  return { 'x-forwarded-for': `pw-${safeScope}` };
}

async function waitForRateLimit(response: Awaited<ReturnType<APIRequestContext['post']>>): Promise<boolean> {
  if (response.status() !== 429) return false;
  const retryAfter = Number(response.headers()['retry-after'] || '1');
  const waitMs = Math.max(1000, Math.min(65_000, Number.isFinite(retryAfter) ? retryAfter * 1000 : 1000));
  await new Promise((resolve) => setTimeout(resolve, waitMs));
  return true;
}

function makeImeDocument(options: { token: string; rootId: string; textId: string; text: string }): TestDocument {
  const now = new Date().toISOString();
  return {
    version: 1,
    locale: 'ko',
    updatedAt: now,
    updatedBy: `ime-${options.token}`,
    stageWidth: 1280,
    stageHeight: 520,
    nodes: [
      {
        id: options.rootId,
        kind: 'container',
        rect: { x: 0, y: 0, width: 1280, height: 520 },
        style: baseStyle,
        zIndex: 0,
        rotation: 0,
        locked: false,
        visible: true,
        content: {
          label: 'IME test root',
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
        rect: { x: 96, y: 88, width: 640, height: 96 },
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
          lineHeight: 1.25,
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

async function draftText(page: Page, pageId: string, textId: string): Promise<string> {
  const response = await page.request.get(`/api/builder/site/pages/${pageId}/draft?locale=ko`);
  if (!response.ok()) return '';
  const payload = (await response.json()) as { document?: { nodes?: Array<Record<string, any>> } };
  const node = payload.document?.nodes?.find((candidate) => candidate.id === textId);
  return typeof node?.content?.text === 'string' ? node.content.text : '';
}

async function textBody(page: Page, textId: string) {
  const node = page.locator(`[data-node-id="${textId}"]:visible`).first();
  await expect(node).toBeVisible();
  const body = node.locator(':scope > [class*="nodeBody"]').first();
  await expect(body).toBeVisible();
  return { node, body };
}

async function openInlineEditor(page: Page, textId: string) {
  const { node, body } = await textBody(page, textId);
  await node.scrollIntoViewIfNeeded();
  await node.dblclick({ position: { x: 30, y: 30 }, force: true });
  const editorShell = page.locator('[data-builder-inline-text-editor="true"]').first();
  await expect(editorShell).toBeVisible();
  const editable = editorShell.locator('.ProseMirror').first();
  await expect(editable).toBeVisible();
  return { body, editorShell, editable };
}

async function dispatchImeComposition(editable: Locator, from: string, to: string) {
  await editable.evaluate((element, payload) => {
    element.dispatchEvent(new CompositionEvent('compositionstart', { bubbles: true, data: '' }));
    element.dispatchEvent(new InputEvent('beforeinput', {
      bubbles: true,
      cancelable: true,
      data: payload.from,
      inputType: 'insertCompositionText',
    }));
    element.dispatchEvent(new CompositionEvent('compositionupdate', { bubbles: true, data: payload.from }));
    element.dispatchEvent(new CompositionEvent('compositionend', { bubbles: true, data: payload.to }));
  }, { from, to });
}

test.describe('/ko/admin-builder inline text IME', () => {
  test('persists Korean and Hanja composition text after blur and reload', async ({ page }) => {
    test.setTimeout(90_000);
    const token = `ime-${Date.now().toString(36)}`;
    const slug = `g-editor-${token}`;
    const title = `IME ${token}`;
    const textId = `inline-ime-text-${token}`;
    const originalText = `IME original ${token}`;
    const nextText = `안녕 漢字 ${token}`;
    let pageId: string | null = null;

    try {
      pageId = await createBuilderPage(
        page.request,
        slug,
        title,
        makeImeDocument({
          token,
          rootId: `inline-ime-root-${token}`,
          textId,
          text: originalText,
        }),
      );

      await page.setExtraHTTPHeaders(mutationHeaders(slug));
      await openBuilder(page, `/ko/admin-builder?pageId=${encodeURIComponent(pageId)}&ime=${Date.now().toString(36)}`);

      const first = await openInlineEditor(page, textId);
      await dispatchImeComposition(first.editable, '안녕', '안녕');
      await dispatchImeComposition(first.editable, '한자', '漢字');
      await first.editable.fill(nextText);
      await page.keyboard.press('Escape');
      await expect(first.editorShell).toBeHidden();
      await expect(first.body).toContainText(nextText);

      await expect.poll(async () => draftText(page, pageId!, textId), { timeout: 20_000 }).toBe(nextText);
      await page.reload({ waitUntil: 'domcontentloaded' });
      await expect((await textBody(page, textId)).body).toContainText(nextText, { timeout: 20_000 });
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

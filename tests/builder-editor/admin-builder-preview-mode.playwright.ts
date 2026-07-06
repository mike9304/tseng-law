import { expect, test, type APIRequestContext } from '@playwright/test';
import type { BuilderCanvasDocument } from '@/lib/builder/canvas/types';
import { openBuilder } from './helpers/editor';

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
} as const;

function mutationHeaders(scope: string): Record<string, string> {
  const safeScope = scope.replace(/[^a-z0-9-]/gi, '-').slice(-48) || 'preview-mode';
  return { 'x-forwarded-for': `pw-${safeScope}` };
}

function makeCustomPreviewDocument(token: string): BuilderCanvasDocument {
  const now = new Date().toISOString();
  return {
    version: 1,
    locale: 'ko',
    updatedAt: now,
    updatedBy: `preview-mode-${token}`,
    stageWidth: 1280,
    stageHeight: 420,
    nodes: [
      {
        id: `preview-root-${token}`,
        kind: 'container',
        rect: { x: 0, y: 0, width: 1280, height: 420 },
        style: { ...baseStyle, backgroundColor: '#ffffff' },
        zIndex: 0,
        rotation: 0,
        locked: false,
        visible: true,
        content: {
          label: 'Custom preview root',
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
        id: `preview-title-${token}`,
        kind: 'text',
        parentId: `preview-root-${token}`,
        rect: { x: 96, y: 96, width: 720, height: 80 },
        style: { ...baseStyle, borderRadius: 8 },
        zIndex: 1,
        rotation: 0,
        locked: false,
        visible: true,
        content: {
          text: `Custom preview ${token}`,
          fontSize: 40,
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
  input: {
    readonly slug: string;
    readonly title: string;
    readonly document: BuilderCanvasDocument;
  },
): Promise<string> {
  const response = await request.post('/api/builder/site/pages', {
    data: { locale: 'ko', slug: input.slug, title: input.title, document: input.document },
    headers: mutationHeaders(input.slug),
  });
  expect(response.status()).toBe(200);
  const payload = (await response.json()) as { success?: boolean; pageId?: string; error?: string };
  expect(payload.success, payload.error).toBe(true);
  expect(payload.pageId).toBeTruthy();
  if (!payload.pageId) throw new Error(payload.error ?? 'create preview page did not return pageId');
  return payload.pageId;
}

test('/ko/admin-builder preview modal opens the home draft-preview route', async ({ page }) => {
  test.setTimeout(90_000);

  await page.setViewportSize({ width: 1440, height: 950 });
  await openBuilder(page, `/ko/admin-builder?previewModeParity=${Date.now().toString(36)}`);

  await page.getByRole('button', { name: /^Preview$|^미리보기$/ }).click();
  const previewDialog = page.locator('[data-builder-preview-dialog="true"]');
  await expect(previewDialog).toBeVisible();

  await expect(previewDialog.locator('iframe[title="데스크톱 미리보기"], iframe[title="Desktop preview"]'))
    .toHaveAttribute('src', /\/ko\/builder\/home\?mode=preview$/);

  await previewDialog.getByRole('button', { name: /Mobile|모바일/ }).click();
  await expect(previewDialog.getByRole('button', { name: /Mobile|모바일/ })).toHaveAttribute('aria-pressed', 'true');
  await expect(previewDialog.locator('iframe[title="모바일 미리보기"], iframe[title="Mobile preview"]'))
    .toHaveAttribute('src', /\/ko\/builder\/home\?mode=preview$/);
});

test('/ko/admin-builder preview modal keeps custom pages on the published public path', async ({ page }) => {
  test.setTimeout(90_000);

  const token = Date.now().toString(36);
  const slug = `pub-preview-page-${token}`;
  let pageId: string | null = null;

  try {
    pageId = await createBuilderPage(
      page.request,
      {
        slug,
        title: `Custom preview ${token}`,
        document: makeCustomPreviewDocument(token),
      },
    );
    const publishResponse = await page.request.post(`/api/builder/site/pages/${pageId}/publish`, {
      headers: mutationHeaders(slug),
    });
    expect(publishResponse.status()).toBe(200);

    await page.setViewportSize({ width: 1440, height: 950 });
    await openBuilder(page, `/ko/admin-builder?pageId=${encodeURIComponent(pageId)}&previewCustom=${token}`);

    await page.getByRole('button', { name: /^Preview$|^미리보기$/ }).click();
    const previewDialog = page.locator('[data-builder-preview-dialog="true"]');
    await expect(previewDialog).toBeVisible();

    const desktopFrame = previewDialog.locator('iframe[title="데스크톱 미리보기"], iframe[title="Desktop preview"]');
    await expect(desktopFrame).toHaveAttribute('src', `/ko/${slug}`);
    await expect(page.frameLocator(`iframe[src="/ko/${slug}"]`).locator(`[data-node-id="preview-title-${token}"]`))
      .toContainText(`Custom preview ${token}`);

    await previewDialog.getByRole('button', { name: /Mobile|모바일/ }).click();
    await expect(previewDialog.getByRole('button', { name: /Mobile|모바일/ })).toHaveAttribute('aria-pressed', 'true');
    await expect(previewDialog.locator('iframe[title="모바일 미리보기"], iframe[title="Mobile preview"]'))
      .toHaveAttribute('src', `/ko/${slug}`);
  } finally {
    if (pageId) {
      await page.request.delete(`/api/builder/site/pages/${pageId}?locale=ko`, {
        headers: mutationHeaders(slug),
        failOnStatusCode: false,
      });
    }
  }
});

import { expect, test, type APIRequestContext } from '@playwright/test';
import { readSiteDocument, writeSiteDocument } from '@/lib/builder/site/persistence';
import type { BuilderCanvasDocument } from '@/lib/builder/canvas/types';
import { getTranslationCopy } from '@/components/builder/translations/translation-copy';

const SITE_ID = 'default';
const LOCALE = 'ko';
const TARGET_LOCALE = 'en';
const SOURCE_COPY = getTranslationCopy(LOCALE);
const TARGET_COPY = getTranslationCopy(TARGET_LOCALE);
const tinyPng = Buffer.from(
  'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+/p9sAAAAASUVORK5CYII=',
  'base64',
);

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function mutationHeaders(scope: string): Record<string, string> {
  const safeScope = scope.replace(/[^a-z0-9-]/gi, '-').slice(-48) || 'translation-editor';
  return { 'x-forwarded-for': `pw-${safeScope}` };
}

function makeTranslationDocument(options: {
  token: string;
  nodeId: string;
  text: string;
  media?: { nodeId: string; src: string; alt: string };
}): BuilderCanvasDocument {
  const now = new Date().toISOString();
  const nodes: BuilderCanvasDocument['nodes'] = [
    {
      id: `root-${options.token}`,
      kind: 'container',
      rect: { x: 0, y: 0, width: 1280, height: 760 },
      style: {
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
      },
      zIndex: 0,
      rotation: 0,
      locked: false,
      visible: true,
      content: {
        label: `Translation editor root ${options.token}`,
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
      id: options.nodeId,
      kind: 'text',
      parentId: `root-${options.token}`,
      rect: { x: 96, y: 88, width: 560, height: 86 },
      style: {
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
      },
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
  ];

  if (options.media) {
    nodes.push({
      id: options.media.nodeId,
      kind: 'image',
      parentId: `root-${options.token}`,
      rect: { x: 96, y: 220, width: 560, height: 320 },
      style: {
        backgroundColor: 'transparent',
        borderColor: '#cbd5e1',
        borderStyle: 'solid',
        borderWidth: 0,
        borderRadius: 18,
        shadowX: 0,
        shadowY: 0,
        shadowBlur: 0,
        shadowSpread: 0,
        shadowColor: 'rgba(15, 23, 42, 0.16)',
        opacity: 100,
      },
      zIndex: 2,
      rotation: 0,
      locked: false,
      visible: true,
      content: {
        src: options.media.src,
        alt: options.media.alt,
        fit: 'cover',
      },
    } as never);
  }

  return {
    version: 1,
    locale: 'ko',
    updatedAt: now,
    updatedBy: `translation-editor-${options.token}`,
    stageWidth: 1280,
    stageHeight: 760,
    nodes,
  };
}

async function uploadAsset(request: APIRequestContext, filename: string, scope: string) {
  const response = await request.post('/api/builder/assets?locale=ko', {
    headers: mutationHeaders(scope),
    multipart: {
      file: {
        name: filename,
        mimeType: 'image/png',
        buffer: tinyPng,
      },
    },
  });
  expect(response.status()).toBe(200);
  const payload = (await response.json()) as { ok?: boolean; asset?: { filename?: string; url?: string }; error?: string };
  expect(payload.ok, payload.error).toBe(true);
  expect(payload.asset?.filename).toBeTruthy();
  expect(payload.asset?.url).toBeTruthy();
  return payload.asset as { filename: string; url: string };
}

async function deleteAsset(request: APIRequestContext, filename: string, scope: string) {
  await request.delete('/api/builder/assets?locale=ko', {
    headers: mutationHeaders(scope),
    data: { locale: 'ko', filename },
    failOnStatusCode: false,
  });
}

async function createBuilderPage(
  request: APIRequestContext,
  locale: 'ko' | 'en',
  slug: string,
  title: string,
  document: BuilderCanvasDocument,
  scope: string,
): Promise<string> {
  const response = await request.post('/api/builder/site/pages', {
    headers: mutationHeaders(scope),
    data: { locale, slug, title, document },
  });
  expect(response.status()).toBe(200);
  const payload = (await response.json()) as { success?: boolean; pageId?: string; error?: string };
  expect(payload.success, payload.error).toBe(true);
  expect(payload.pageId).toBeTruthy();
  return payload.pageId!;
}

async function publishBuilderPage(
  request: APIRequestContext,
  pageId: string,
  locale: 'ko' | 'en',
  scope: string,
): Promise<void> {
  const response = await request.post(`/api/builder/site/pages/${pageId}/publish?locale=${locale}`, {
    headers: mutationHeaders(scope),
  });
  expect(response.status()).toBe(200);
  const payload = (await response.json()) as { ok?: boolean; error?: string };
  expect(payload.ok, payload.error).toBe(true);
}

test.describe('/ko/admin-builder/translations/[pageId] manual editor', () => {
  let originalSite = null as Awaited<ReturnType<typeof readSiteDocument>> | null;

  test.beforeEach(async () => {
    originalSite = await readSiteDocument(SITE_ID, LOCALE);
  });

  test('persists manual translation text and SEO overrides on reload', async ({ page }) => {
    test.setTimeout(120_000);

    const token = `translation-editor-${Date.now().toString(36)}`;
    const headers = mutationHeaders(token);
    await page.setExtraHTTPHeaders(headers);

    const sourceSlug = `translation-editor-source-${token}`;
    const targetSlug = `translation-editor-target-${token}`;
    const sourcePageTitle = `번역 편집 ${token}`;
    const targetPageTitle = `Translation editor target ${token}`;
    const nodeId = `translation-node-${token}`;
    const sourceText = `원본 본문 ${token}`;
    const targetText = `Translated body ${token}`;
    const sourceSeoTitle = `원본 SEO 제목 ${token}`;
    const sourceSeoDescription = `원본 SEO 설명 ${token}`;
    const targetSeoTitle = `Translated SEO title ${token}`;
    const targetSeoDescription = `Translated SEO description ${token}`;

    let sourcePageId: string | null = null;
    let targetPageId: string | null = null;

    try {
      sourcePageId = await createBuilderPage(
        page.request,
        'ko',
        sourceSlug,
        sourcePageTitle,
        makeTranslationDocument({ token, nodeId, text: sourceText }),
        token,
      );
      targetPageId = await createBuilderPage(
        page.request,
        'en',
        targetSlug,
        targetPageTitle,
        makeTranslationDocument({ token, nodeId, text: '' }),
        token,
      );

      const site = await readSiteDocument(SITE_ID, LOCALE);
      const sourcePage = site.pages.find((candidate) => candidate.pageId === sourcePageId);
      const targetPage = site.pages.find((candidate) => candidate.pageId === targetPageId);
      expect(sourcePage).toBeTruthy();
      expect(targetPage).toBeTruthy();
      if (!sourcePage || !targetPage) throw new Error('Missing seeded translation pages');

      sourcePage.linkedPageIds = {
        ...(sourcePage.linkedPageIds ?? {}),
        en: targetPageId,
      };
      targetPage.linkedPageIds = {
        ...(targetPage.linkedPageIds ?? {}),
        ko: sourcePageId,
      };
      sourcePage.seo = {
        ...(sourcePage.seo ?? {}),
        title: sourceSeoTitle,
        description: sourceSeoDescription,
      };
      site.updatedAt = new Date().toISOString();
      await writeSiteDocument(site, { preserveNavigation: true });

      await page.goto(`/${LOCALE}/admin-builder/translations/${sourcePageId}?source=ko&target=en`, {
        waitUntil: 'domcontentloaded',
      });

      const editor = page.locator('[data-translation-editor="true"]');
      await expect(editor).toBeVisible();
      await expect(page.getByRole('heading', { name: sourcePageTitle })).toBeVisible();

      const nodeRow = page.locator(`[data-translation-node-row="${nodeId}"]`);
      await expect(nodeRow).toContainText(sourceText);
      const nodeTargetInput = page.locator(`[data-translation-node-target-input="${nodeId}"]`);
      await expect(nodeTargetInput).toHaveValue('');
      await expect(page.locator('[data-translation-seo-title-input="true"]')).toHaveAttribute(
        'placeholder',
        sourceSeoTitle,
      );
      await expect(page.locator('[data-translation-seo-description-input="true"]')).toHaveAttribute(
        'placeholder',
        sourceSeoDescription,
      );

      await nodeTargetInput.fill(targetText);
      await page.locator('[data-translation-seo-title-input="true"]').fill(targetSeoTitle);
      await page.locator('[data-translation-seo-description-input="true"]').fill(targetSeoDescription);
      await page.getByRole('button', { name: TARGET_COPY.editorSaveTranslation }).click();
      await expect(page.getByText(`${TARGET_COPY.editorTranslationSaved} (1 nodes).`)).toBeVisible();

      const localeSlugInput = page.locator('[data-locale-slug-input="en"]');
      const localizedSlug = `about-us-${token}`;
      await expect(localeSlugInput).toHaveValue('');
      await localeSlugInput.fill(localizedSlug);
      await page.locator('[data-locale-slug-save="en"]').click();
      await expect(page.getByText(SOURCE_COPY.editorSavedSlug('en'))).toBeVisible();

      await page.reload({ waitUntil: 'domcontentloaded' });
      await expect(page.locator(`[data-translation-node-target-input="${nodeId}"]`)).toHaveValue(targetText);
      await expect(page.locator('[data-translation-seo-title-input="true"]')).toHaveValue(targetSeoTitle);
      await expect(page.locator('[data-translation-seo-description-input="true"]')).toHaveValue(targetSeoDescription);
      await expect(page.locator('[data-locale-slug-input="en"]')).toHaveValue(localizedSlug);

      await publishBuilderPage(page.request, sourcePageId!, 'ko', token);
      await page.goto(`/en/${localizedSlug}`, { waitUntil: 'domcontentloaded' });
      await expect(page.getByText(sourceText)).toBeVisible();
      await expect(page).toHaveTitle(targetSeoTitle);
      await expect(page.locator('meta[name="description"]')).toHaveAttribute('content', targetSeoDescription);
      await expect(page.locator('meta[property="og:title"]')).toHaveAttribute('content', targetSeoTitle);
      await expect(page.locator('meta[property="og:description"]')).toHaveAttribute('content', targetSeoDescription);
      await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
        'href',
        new RegExp(`/en/${localizedSlug}$`),
      );
    } finally {
      if (sourcePageId) {
        await page.request.delete(`/api/builder/site/pages/${sourcePageId}?locale=ko`, {
          headers,
          failOnStatusCode: false,
        });
      }
      if (targetPageId) {
        await page.request.delete(`/api/builder/site/pages/${targetPageId}?locale=en`, {
          headers,
          failOnStatusCode: false,
        });
      }
      if (originalSite) {
        await writeSiteDocument(originalSite).catch(() => undefined);
        originalSite = null;
      }
    }
  });

  test('persists per-language image overrides on reload and the public route', async ({ page }) => {
    test.setTimeout(120_000);

    const token = `translation-media-${Date.now().toString(36)}`;
    const headers = mutationHeaders(token);
    await page.setExtraHTTPHeaders(headers);

    const sourceSlug = `translation-media-source-${token}`;
    const targetSlug = `translation-media-target-${token}`;
    const sourcePageTitle = `이미지 번역 편집 ${token}`;
    const targetPageTitle = `Image translation target ${token}`;
    const nodeId = `translation-media-node-${token}`;
    const imageNodeId = `translation-media-image-${token}`;
    const sourceText = `원본 본문 ${token}`;
    const sourceAlt = `Source hero alt ${token}`;
    const overrideAlt = `Localized hero alt ${token}`;
    const sourceImageAsset = await uploadAsset(page.request, `translation-media-source-${token}.png`, token);
    const localizedImageAsset = await uploadAsset(page.request, `translation-media-target-${token}.png`, token);

    let sourcePageId: string | null = null;
    let targetPageId: string | null = null;

    try {
      sourcePageId = await createBuilderPage(
        page.request,
        'ko',
        sourceSlug,
        sourcePageTitle,
        makeTranslationDocument({
          token,
          nodeId,
          text: sourceText,
          media: {
            nodeId: imageNodeId,
            src: sourceImageAsset.url,
            alt: sourceAlt,
          },
        }),
        token,
      );
      targetPageId = await createBuilderPage(
        page.request,
        'en',
        targetSlug,
        targetPageTitle,
        makeTranslationDocument({
          token,
          nodeId,
          text: '',
          media: {
            nodeId: imageNodeId,
            src: sourceImageAsset.url,
            alt: sourceAlt,
          },
        }),
        token,
      );

      const site = await readSiteDocument(SITE_ID, LOCALE);
      const sourcePage = site.pages.find((candidate) => candidate.pageId === sourcePageId);
      const targetPage = site.pages.find((candidate) => candidate.pageId === targetPageId);
      expect(sourcePage).toBeTruthy();
      expect(targetPage).toBeTruthy();
      if (!sourcePage || !targetPage) throw new Error('Missing seeded translation pages');

      sourcePage.linkedPageIds = {
        ...(sourcePage.linkedPageIds ?? {}),
        en: targetPageId,
      };
      targetPage.linkedPageIds = {
        ...(targetPage.linkedPageIds ?? {}),
        ko: sourcePageId,
      };
      site.updatedAt = new Date().toISOString();
      await writeSiteDocument(site, { preserveNavigation: true });

      await page.goto(`/${LOCALE}/admin-builder/translations/${sourcePageId}?source=ko&target=en`, {
        waitUntil: 'domcontentloaded',
      });

      const mediaEditor = page.locator('[data-locale-media-editor="true"]');
      await expect(mediaEditor).toBeVisible();
      await expect(page.locator(`[data-locale-media-source-src="${imageNodeId}"]`)).toHaveValue(sourceImageAsset.url);
      await expect(page.locator(`[data-locale-media-source-alt="${imageNodeId}"]`)).toHaveValue(sourceAlt);
      await expect(page.locator(`[data-locale-media-override-src="${imageNodeId}"]`)).toHaveValue('');
      await expect(page.locator(`[data-locale-media-override-alt="${imageNodeId}"]`)).toHaveValue('');

      await page.locator(`[data-locale-media-override-src="${imageNodeId}"]`).fill(localizedImageAsset.url);
      await page.locator(`[data-locale-media-override-alt="${imageNodeId}"]`).fill(overrideAlt);
      await page.locator('[data-locale-media-save="true"]').click();
      await expect(page.getByText(SOURCE_COPY.editorSavedImageOverrides('en', 1))).toBeVisible();

      await page.reload({ waitUntil: 'domcontentloaded' });
      await expect(page.locator(`[data-locale-media-override-src="${imageNodeId}"]`)).toHaveValue(localizedImageAsset.url);
      await expect(page.locator(`[data-locale-media-override-alt="${imageNodeId}"]`)).toHaveValue(overrideAlt);

      await publishBuilderPage(page.request, targetPageId!, 'en', token);
      await page.goto(`/en/${targetSlug}`, { waitUntil: 'domcontentloaded' });
      const localizedImage = page.locator(`img[alt="${overrideAlt}"]`).first();
      await expect(localizedImage).toBeVisible();
      await expect(localizedImage).toHaveAttribute(
        'src',
        new RegExp(escapeRegExp(encodeURIComponent(localizedImageAsset.url))),
      );
    } finally {
      if (sourcePageId) {
        await page.request.delete(`/api/builder/site/pages/${sourcePageId}?locale=ko`, {
          headers,
          failOnStatusCode: false,
        });
      }
      if (targetPageId) {
        await page.request.delete(`/api/builder/site/pages/${targetPageId}?locale=en`, {
          headers,
          failOnStatusCode: false,
        });
      }
      if (sourceImageAsset) {
        await deleteAsset(page.request, sourceImageAsset.filename, token).catch(() => undefined);
      }
      if (localizedImageAsset) {
        await deleteAsset(page.request, localizedImageAsset.filename, token).catch(() => undefined);
      }
      if (originalSite) {
        await writeSiteDocument(originalSite).catch(() => undefined);
        originalSite = null;
      }
    }
  });
});

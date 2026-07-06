import { expect, test, type APIRequestContext } from '@playwright/test';
import { z } from 'zod';
import {
  createDefaultCanvasNodeStyle,
  type BuilderCanvasDocument,
} from '@/lib/builder/canvas/types';
import { readSiteDocument, writeSiteDocument } from '@/lib/builder/site/persistence';

const SITE_ID = 'default';
const SOURCE_LOCALE = 'ko';
const TARGET_LOCALE = 'en';

const createPageResponseSchema = z.object({
  success: z.boolean().optional(),
  pageId: z.string().optional(),
  error: z.string().optional(),
}).passthrough();

function mutationHeaders(scope: string): Record<string, string> {
  const safeScope = scope.replace(/[^a-z0-9-]/gi, '-').slice(-48) || 'translation-rollback';
  return { 'x-forwarded-for': `pw-${safeScope}` };
}

function makeDocument(
  locale: typeof SOURCE_LOCALE | typeof TARGET_LOCALE,
  token: string,
  nodeId: string,
  text: string,
): BuilderCanvasDocument {
  const now = new Date().toISOString();
  return {
    version: 1,
    locale,
    updatedAt: now,
    updatedBy: `translation-rollback-${token}`,
    stageWidth: 1280,
    stageHeight: 760,
    nodes: [
      {
        id: `root-${token}`,
        kind: 'container',
        rect: { x: 0, y: 0, width: 1280, height: 760 },
        style: createDefaultCanvasNodeStyle({ borderRadius: 0 }),
        zIndex: 0,
        rotation: 0,
        locked: false,
        visible: true,
        content: {
          label: `Translation rollback root ${token}`,
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
        id: nodeId,
        kind: 'text',
        parentId: `root-${token}`,
        rect: { x: 96, y: 88, width: 560, height: 86 },
        style: createDefaultCanvasNodeStyle(),
        zIndex: 1,
        rotation: 0,
        locked: false,
        visible: true,
        content: {
          text,
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

async function createBuilderPage(
  request: APIRequestContext,
  locale: typeof SOURCE_LOCALE | typeof TARGET_LOCALE,
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
  const payload = createPageResponseSchema.parse(await response.json());
  expect(payload.success, payload.error).toBe(true);
  if (typeof payload.pageId !== 'string') throw new Error('Missing pageId after page creation');
  return payload.pageId;
}

test.describe('/ko/admin-builder/translations/[pageId] auto-translate review rollback', () => {
  let originalSite = null as Awaited<ReturnType<typeof readSiteDocument>> | null;

  test.beforeEach(async () => {
    originalSite = await readSiteDocument(SITE_ID, SOURCE_LOCALE);
  });

  test('restores pre-proposal draft text when auto-translate is reverted', async ({ page }) => {
    test.setTimeout(120_000);

    const token = `translation-rollback-${Date.now().toString(36)}`;
    const headers = mutationHeaders(token);
    await page.setExtraHTTPHeaders(headers);

    const sourcePageTitle = `자동 번역 롤백 ${token}`;
    const targetPageTitle = `Auto rollback target ${token}`;
    const nodeId = `translation-rollback-node-${token}`;
    const manualDraft = `Manual draft ${token}`;
    const proposedText = `Auto proposal ${token}`;
    const sourcePageId = await createBuilderPage(
      page.request,
      SOURCE_LOCALE,
      `translation-rollback-source-${token}`,
      sourcePageTitle,
      makeDocument(SOURCE_LOCALE, token, nodeId, `원본 ${token}`),
      token,
    );
    const targetPageId = await createBuilderPage(
      page.request,
      TARGET_LOCALE,
      `translation-rollback-target-${token}`,
      targetPageTitle,
      makeDocument(TARGET_LOCALE, token, nodeId, ''),
      token,
    );

    try {
      const site = await readSiteDocument(SITE_ID, SOURCE_LOCALE);
      const sourcePage = site.pages.find((candidate) => candidate.pageId === sourcePageId);
      const targetPage = site.pages.find((candidate) => candidate.pageId === targetPageId);
      expect(sourcePage).toBeTruthy();
      expect(targetPage).toBeTruthy();
      if (!sourcePage || !targetPage) throw new Error('Missing seeded translation pages');
      sourcePage.linkedPageIds = { ...(sourcePage.linkedPageIds ?? {}), en: targetPageId };
      targetPage.linkedPageIds = { ...(targetPage.linkedPageIds ?? {}), ko: sourcePageId };
      site.updatedAt = new Date().toISOString();
      await writeSiteDocument(site, { preserveNavigation: true });

      await page.route('**/api/builder/translations/auto-translate', async (route) => {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            ok: true,
            proposals: [{ nodeId, text: proposedText }],
            errors: [],
          }),
        });
      });

      await page.goto(`/${SOURCE_LOCALE}/admin-builder/translations/${sourcePageId}?source=ko&target=en`, {
        waitUntil: 'domcontentloaded',
      });

      const input = page.locator(`[data-translation-node-target-input="${nodeId}"]`);
      await expect(input).toBeVisible();
      await input.fill(manualDraft);
      await page.getByRole('button', { name: 'Auto-translate page' }).click();
      await expect(input).toHaveValue(proposedText);

      const rollback = page.locator('[data-translation-auto-rollback="true"]');
      await expect(rollback).toBeVisible();
      await rollback.click();
      await expect(input).toHaveValue(manualDraft);
    } finally {
      await page.unroute('**/api/builder/translations/auto-translate').catch(() => undefined);
      await page.request.delete(`/api/builder/site/pages/${sourcePageId}?locale=ko`, {
        headers,
        failOnStatusCode: false,
      });
      await page.request.delete(`/api/builder/site/pages/${targetPageId}?locale=en`, {
        headers,
        failOnStatusCode: false,
      });
      if (originalSite) {
        await writeSiteDocument(originalSite).catch(() => undefined);
        originalSite = null;
      }
    }
  });
});

import { expect, test, type Page } from '@playwright/test';
import { openBuilder, openCatalogDrawer } from './helpers/editor';

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

type CreatePageResponse = {
  success?: boolean;
  pageId?: string;
  error?: string;
};

type CreateSectionResponse = {
  ok?: boolean;
  section?: {
    sectionId?: string;
  };
  error?: string;
};

function mutationHeaders(scope: string): Record<string, string> {
  const safeScope = scope.replace(/[^a-z0-9-]/gi, '-').slice(-48) || 'saved-sections-panel';
  return { 'x-forwarded-for': `pw-${safeScope}` };
}

function makeSavedSectionNodes(token: string, text: string): Record<string, unknown>[] {
  const rootNodeId = `saved-root-${token}`;
  return [
    {
      id: rootNodeId,
      kind: 'container',
      rect: { x: 0, y: 0, width: 620, height: 230 },
      style: { ...baseStyle, backgroundColor: '#fff7ed', borderRadius: 18 },
      zIndex: 0,
      rotation: 0,
      locked: false,
      visible: true,
      content: {
        label: 'Saved section panel test root',
        background: '#fff7ed',
        borderColor: '#fed7aa',
        borderStyle: 'solid',
        borderWidth: 1,
        borderRadius: 18,
        padding: 0,
        layoutMode: 'absolute',
        as: 'section',
      },
    },
    {
      id: `saved-text-${token}`,
      kind: 'text',
      parentId: rootNodeId,
      rect: { x: 34, y: 58, width: 520, height: 84 },
      style: { ...baseStyle, borderRadius: 10 },
      zIndex: 1,
      rotation: 0,
      locked: false,
      visible: true,
      content: {
        text,
        fontSize: 30,
        color: '#7c2d12',
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
}

async function draftDocumentText(page: Page, pageId: string, locale = 'ko'): Promise<string> {
  const response = await page.request.get(`/api/builder/site/pages/${pageId}/draft?locale=${encodeURIComponent(locale)}`, {
    headers: mutationHeaders(pageId),
    failOnStatusCode: false,
  });
  if (response.status() !== 200) return '';
  const payload: { document?: unknown } = await response.json();
  return JSON.stringify(payload.document ?? null);
}

test.describe('/ko/admin-builder saved sections panel', () => {
  test('inserts a saved section from the Add panel and persists it after reload', async ({ page }) => {
    test.setTimeout(90_000);

    const token = Date.now().toString(36);
    const slug = `saved-section-panel-${token}`;
    const sectionText = `Saved section persisted ${token}`;
    const headers = mutationHeaders(slug);
    let pageId: string | null = null;
    let sectionId: string | null = null;

    try {
      const createSectionResponse = await page.request.post('/api/builder/site/section-library?locale=ko', {
        headers,
        data: {
          locale: 'ko',
          name: `Saved panel ${token}`,
          category: 'custom',
          rootNodeId: `saved-root-${token}`,
          nodes: makeSavedSectionNodes(token, sectionText),
        },
      });
      expect(createSectionResponse.status()).toBe(200);
      const createdSection: CreateSectionResponse = await createSectionResponse.json();
      expect(createdSection.ok, createdSection.error).toBe(true);
      sectionId = createdSection.section?.sectionId ?? null;
      expect(sectionId).toBeTruthy();
      if (!sectionId) throw new Error('section_id_missing');

      const createPageResponse = await page.request.post('/api/builder/site/pages', {
        headers,
        data: {
          locale: 'ko',
          slug,
          title: `Saved section panel ${token}`,
          blank: true,
        },
      });
      expect(createPageResponse.status()).toBe(200);
      const createdPage: CreatePageResponse = await createPageResponse.json();
      expect(createdPage.success, createdPage.error).toBe(true);
      pageId = createdPage.pageId ?? null;
      expect(pageId).toBeTruthy();
      if (!pageId) throw new Error('page_id_missing');
      const createdPageId = pageId;

      await openBuilder(page, `/ko/admin-builder?pageId=${encodeURIComponent(createdPageId)}&savedSectionPanel=${token}`);
      await page.keyboard.press('Escape');

      const catalogDrawer = await openCatalogDrawer(page);
      const savedSectionCard = catalogDrawer.locator(`[data-builder-saved-section-card="${sectionId}"]`);
      await savedSectionCard.scrollIntoViewIfNeeded();
      await expect(savedSectionCard).toBeVisible();
      await savedSectionCard.locator(`[data-builder-saved-section-insert="${sectionId}"]`).click();

      const insertedText = page.locator('[data-node-id^="text-"]').filter({ hasText: sectionText }).last();
      await expect(insertedText).toBeVisible();
      await expect(page.locator('[data-builder-save-status]').first()).toHaveAttribute('data-builder-save-status', /saving|saved/);
      await expect.poll(async () => draftDocumentText(page, createdPageId), { timeout: 30_000 }).toContain(sectionText);

      await openBuilder(page, `/ko/admin-builder?pageId=${encodeURIComponent(createdPageId)}&savedSectionPanelReload=${token}`);
      await expect(page.locator('[data-node-id^="text-"]').filter({ hasText: sectionText }).last()).toBeVisible();
    } finally {
      if (pageId) {
        await page.request.delete(`/api/builder/site/pages/${pageId}?locale=ko`, {
          headers,
          failOnStatusCode: false,
        }).catch(() => undefined);
      }
      if (sectionId) {
        await page.request.delete(`/api/builder/site/section-library/${encodeURIComponent(sectionId)}?locale=ko`, {
          headers,
          failOnStatusCode: false,
        }).catch(() => undefined);
      }
    }
  });
});

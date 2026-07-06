import { expect, test, type APIRequestContext, type Page } from '@playwright/test';
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

type TestDocument = {
  version: 1;
  locale: 'ko';
  updatedAt: string;
  updatedBy: string;
  stageWidth: number;
  stageHeight: number;
  nodes: Array<Record<string, unknown>>;
};

type CreatePageResponse = {
  success?: boolean;
  pageId?: string;
  error?: string;
};

function mutationHeaders(scope: string): Record<string, string> {
  const safeScope = scope.replace(/[^a-z0-9-]/gi, '-').slice(-48) || 'anchor-menu-widget';
  return { 'x-forwarded-for': `pw-${safeScope}` };
}

function makeAnchorDocument(token: string): TestDocument {
  const now = new Date().toISOString();
  const rootId = `anchor-root-${token}`;
  return {
    version: 1,
    locale: 'ko',
    updatedAt: now,
    updatedBy: `anchor-menu-${token}`,
    stageWidth: 1280,
    stageHeight: 1180,
    nodes: [
      {
        id: rootId,
        kind: 'container',
        rect: { x: 0, y: 0, width: 1280, height: 1180 },
        style: baseStyle,
        zIndex: 0,
        rotation: 0,
        locked: false,
        visible: true,
        content: {
          label: 'Anchor menu test root',
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
        id: `intro-section-${token}`,
        kind: 'container',
        parentId: rootId,
        anchorName: 'intro',
        rect: { x: 80, y: 120, width: 900, height: 280 },
        style: { ...baseStyle, backgroundColor: '#eff6ff', borderRadius: 18 },
        zIndex: 1,
        rotation: 0,
        locked: false,
        visible: true,
        content: {
          label: 'Intro section',
          background: '#eff6ff',
          borderColor: '#bfdbfe',
          borderStyle: 'solid',
          borderWidth: 1,
          borderRadius: 18,
          padding: 0,
          layoutMode: 'absolute',
          as: 'section',
        },
      },
      {
        id: `contact-section-${token}`,
        kind: 'container',
        parentId: rootId,
        anchorName: 'contact',
        rect: { x: 80, y: 650, width: 900, height: 280 },
        style: { ...baseStyle, backgroundColor: '#f8fafc', borderRadius: 18 },
        zIndex: 2,
        rotation: 0,
        locked: false,
        visible: true,
        content: {
          label: 'Contact section',
          background: '#f8fafc',
          borderColor: '#cbd5e1',
          borderStyle: 'solid',
          borderWidth: 1,
          borderRadius: 18,
          padding: 0,
          layoutMode: 'absolute',
          as: 'section',
        },
      },
    ],
  };
}

async function currentDraftRevision(request: APIRequestContext, pageId: string, scope: string): Promise<number> {
  const response = await request.get(`/api/builder/site/pages/${pageId}/draft?locale=ko`, {
    headers: mutationHeaders(scope),
  });
  expect(response.status()).toBe(200);
  const payload = (await response.json()) as { draft?: { revision?: number } };
  expect(typeof payload.draft?.revision).toBe('number');
  return payload.draft!.revision!;
}

async function putDraft(
  request: APIRequestContext,
  pageId: string,
  scope: string,
  expectedRevision: number,
  document: TestDocument,
): Promise<void> {
  const response = await request.put(`/api/builder/site/pages/${pageId}/draft?locale=ko`, {
    headers: mutationHeaders(scope),
    data: { expectedRevision, document },
  });
  expect(response.status()).toBe(200);
  const payload = (await response.json()) as { ok?: boolean; error?: string };
  expect(payload.ok, payload.error).toBe(true);
}

async function draftDocumentText(page: Page, pageId: string, scope: string): Promise<string> {
  const response = await page.request.get(`/api/builder/site/pages/${pageId}/draft?locale=ko`, {
    headers: mutationHeaders(scope),
    failOnStatusCode: false,
  });
  if (response.status() !== 200) return '';
  const payload = (await response.json()) as { document?: unknown };
  return JSON.stringify(payload.document ?? null);
}

test('/ko/admin-builder anchor menu syncs from current page anchors', async ({ page }) => {
  test.setTimeout(90_000);

  const token = Date.now().toString(36);
  const slug = `anchor-menu-widget-${token}`;
  const headers = mutationHeaders(slug);
  let pageId: string | null = null;

  try {
    const createPageResponse = await page.request.post('/api/builder/site/pages', {
      headers,
      data: {
        locale: 'ko',
        slug,
        title: `Anchor menu widget ${token}`,
        blank: true,
      },
    });
    expect(createPageResponse.status()).toBe(200);
    const createdPage: CreatePageResponse = await createPageResponse.json();
    expect(createdPage.success, createdPage.error).toBe(true);
    pageId = createdPage.pageId ?? null;
    expect(pageId).toBeTruthy();
    if (!pageId) throw new Error('page_id_missing');

    const revision = await currentDraftRevision(page.request, pageId, slug);
    await putDraft(page.request, pageId, slug, revision, makeAnchorDocument(token));

    await page.setViewportSize({ width: 1440, height: 940 });
    await openBuilder(page, `/ko/admin-builder?pageId=${encodeURIComponent(pageId)}&anchorMenuWidget=${token}`);
    await page.keyboard.press('Escape');

    const catalogDrawer = await openCatalogDrawer(page);
    const anchorMenuPreset = catalogDrawer.locator('[data-builder-navigation-widget-preset="nav-anchor-menu"]');
    await anchorMenuPreset.scrollIntoViewIfNeeded();
    await expect(anchorMenuPreset).toBeVisible();
    await anchorMenuPreset.click();

    const anchorMenu = page.locator('[data-builder-nav-widget="anchor-menu"]').last();
    await expect(anchorMenu).toBeVisible();
    await anchorMenu.click({ position: { x: 12, y: 12 }, force: true });
    await page
      .locator('[data-builder-inspector-panel="true"]')
      .getByRole('button', { name: '콘텐츠', exact: true })
      .click();

    const inspector = page.locator('[data-builder-anchor-menu-inspector="true"]').first();
    await expect(inspector).toBeVisible();
    await expect(inspector.locator('[data-builder-anchor-menu-site-anchors="true"]')).toBeVisible();
    await expect(inspector.locator('[data-builder-anchor-menu-anchor="intro"]')).toBeVisible();
    await expect(inspector.locator('[data-builder-anchor-menu-anchor="contact"]')).toHaveAttribute(
      'data-builder-anchor-connected',
      'true',
    );

    await inspector.locator('[data-builder-anchor-menu-sync="true"]').click();
    await expect(inspector.locator('textarea')).toHaveValue(/Intro \| intro/);
    await expect(inspector.locator('textarea')).toHaveValue(/문의 \| contact/);
    await expect(anchorMenu.locator('a[href="#intro"]')).toBeVisible();
    await expect.poll(async () => draftDocumentText(page, pageId!, slug), { timeout: 30_000 }).toContain(
      '"anchorId":"intro"',
    );
  } finally {
    if (pageId) {
      await page.request.delete(`/api/builder/site/pages/${pageId}?locale=ko`, {
        headers,
        failOnStatusCode: false,
      }).catch(() => undefined);
    }
  }
});

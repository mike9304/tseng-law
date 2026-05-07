import { expect, test, type APIRequestContext, type Locator, type Page } from '@playwright/test';

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

const baseContainerContent = {
  background: 'transparent',
  borderColor: '#cbd5e1',
  borderStyle: 'solid',
  borderWidth: 0,
  borderRadius: 0,
  padding: 0,
  layoutMode: 'absolute',
};

function escapeRegex(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function mutationHeaders(scope: string): Record<string, string> {
  const safeScope = scope.replace(/[^a-z0-9-]/gi, '-').slice(-48) || 'office-map';
  return { 'x-forwarded-for': `pw-${safeScope}` };
}

async function waitForRateLimit(response: Awaited<ReturnType<APIRequestContext['post']>>): Promise<boolean> {
  if (response.status() !== 429) return false;
  const retryAfter = Number(response.headers()['retry-after'] || '1');
  const waitMs = Math.max(1000, Math.min(65_000, Number.isFinite(retryAfter) ? retryAfter * 1000 : 1000));
  await new Promise((resolve) => setTimeout(resolve, waitMs));
  return true;
}

function makeOfficeDocument(token: string): TestDocument {
  const now = new Date().toISOString();
  return {
    version: 1,
    locale: 'ko',
    updatedAt: now,
    updatedBy: `office-map-${token}`,
    stageWidth: 1280,
    stageHeight: 760,
    nodes: [
      {
        id: `root-${token}`,
        kind: 'container',
        rect: { x: 0, y: 0, width: 1280, height: 760 },
        style: { ...baseStyle, backgroundColor: '#ffffff' },
        zIndex: 0,
        rotation: 0,
        locked: false,
        visible: true,
        content: {
          ...baseContainerContent,
          label: 'Office map public test root',
          as: 'main',
        },
      },
      {
        id: 'home-offices-layout-0',
        kind: 'container',
        parentId: `root-${token}`,
        rect: { x: 72, y: 132, width: 1136, height: 360 },
        style: baseStyle,
        zIndex: 1,
        rotation: 0,
        locked: false,
        visible: true,
        content: { ...baseContainerContent, label: 'office layout', as: 'section' },
      },
      {
        id: 'home-offices-layout-0-map',
        kind: 'map',
        parentId: 'home-offices-layout-0',
        rect: { x: 0, y: 0, width: 660, height: 360 },
        style: { ...baseStyle, borderRadius: 12 },
        zIndex: 0,
        rotation: 0,
        locked: false,
        visible: true,
        content: {
          address: '台北市大同區承德路一段35號7樓之2',
          zoom: 16,
        },
      },
      {
        id: 'home-offices-layout-0-card',
        kind: 'container',
        parentId: 'home-offices-layout-0',
        rect: { x: 700, y: 0, width: 436, height: 360 },
        style: { ...baseStyle, borderRadius: 12 },
        zIndex: 1,
        rotation: 0,
        locked: false,
        visible: true,
        content: {
          ...baseContainerContent,
          label: 'office card',
          borderRadius: 12,
          as: 'article',
        },
      },
      {
        id: 'home-offices-layout-0-card-title',
        kind: 'text',
        parentId: 'home-offices-layout-0-card',
        rect: { x: 0, y: 42, width: 240, height: 34 },
        style: baseStyle,
        zIndex: 0,
        rotation: 0,
        locked: false,
        visible: true,
        content: {
          text: '타이베이',
          fontSize: 24,
          color: '#0f172a',
          fontWeight: 'bold',
          align: 'left',
          lineHeight: 1.2,
          letterSpacing: 0,
          fontFamily: 'system-ui',
          as: 'h3',
        },
      },
      {
        id: 'home-offices-layout-0-card-address',
        kind: 'text',
        parentId: 'home-offices-layout-0-card',
        rect: { x: 0, y: 92, width: 360, height: 58 },
        style: baseStyle,
        zIndex: 1,
        rotation: 0,
        locked: false,
        visible: true,
        content: {
          text: '台北市大同區承德路一段35號7樓之2',
          fontSize: 17,
          color: '#334155',
          fontWeight: 'regular',
          align: 'left',
          lineHeight: 1.45,
          letterSpacing: 0,
          fontFamily: 'system-ui',
          as: 'p',
        },
      },
      {
        id: 'home-offices-layout-0-card-phone',
        kind: 'button',
        parentId: 'home-offices-layout-0-card',
        rect: { x: 0, y: 164, width: 220, height: 28 },
        style: baseStyle,
        zIndex: 2,
        rotation: 0,
        locked: false,
        visible: true,
        content: {
          label: '전화: 02-2555-0000',
          href: 'tel:0225550000',
          style: 'link',
          as: 'a',
        },
      },
      {
        id: 'home-offices-layout-0-card-fax',
        kind: 'text',
        parentId: 'home-offices-layout-0-card',
        rect: { x: 0, y: 198, width: 220, height: 28 },
        style: baseStyle,
        zIndex: 3,
        rotation: 0,
        locked: false,
        visible: true,
        content: {
          text: '팩스: 02-2555-0001',
          fontSize: 16,
          color: '#334155',
          fontWeight: 'regular',
          align: 'left',
          lineHeight: 1.4,
          letterSpacing: 0,
          fontFamily: 'system-ui',
          as: 'p',
        },
      },
      {
        id: 'home-offices-layout-0-card-map-link',
        kind: 'button',
        parentId: 'home-offices-layout-0-card',
        rect: { x: 0, y: 262, width: 280, height: 40 },
        style: { ...baseStyle, borderRadius: 8 },
        zIndex: 4,
        rotation: 0,
        locked: false,
        visible: true,
        content: {
          label: 'Google 지도에서 보기',
          href: 'https://www.google.com/maps/search/%E5%8F%B0%E5%8C%97',
          style: 'primary',
          as: 'a',
          target: '_blank',
          rel: 'noopener noreferrer',
        },
      },
    ],
  };
}

function makeGenericMapDocument(options: {
  token: string;
  rootId: string;
  mapId: string;
  address: string;
  zoom: number;
}): TestDocument {
  const now = new Date().toISOString();
  return {
    version: 1,
    locale: 'ko',
    updatedAt: now,
    updatedBy: `generic-map-${options.token}`,
    stageWidth: 1280,
    stageHeight: 760,
    nodes: [
      {
        id: options.rootId,
        kind: 'container',
        rect: { x: 0, y: 0, width: 1280, height: 760 },
        style: { ...baseStyle, backgroundColor: '#ffffff' },
        zIndex: 0,
        rotation: 0,
        locked: false,
        visible: true,
        content: {
          ...baseContainerContent,
          label: 'Generic map root',
          as: 'main',
        },
      },
      {
        id: options.mapId,
        kind: 'map',
        parentId: options.rootId,
        rect: { x: 96, y: 96, width: 680, height: 360 },
        style: { ...baseStyle, borderRadius: 12 },
        zIndex: 1,
        rotation: 0,
        locked: false,
        visible: true,
        content: {
          address: options.address,
          zoom: options.zoom,
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

async function openBuilderPage(page: Page, pageTitle: string, pageId?: string): Promise<void> {
  if (pageId) {
    await page.goto(
      `/ko/admin-builder?pageId=${encodeURIComponent(pageId)}&officeMapTest=${Date.now().toString(36)}`,
      { waitUntil: 'domcontentloaded' },
    );
    await expect(page.getByRole('application', { name: 'Canvas editor' })).toBeVisible();
    return;
  }

  let pageButton: Locator | null = null;
  for (let attempt = 0; attempt < 4; attempt += 1) {
    await page.goto(`/ko/admin-builder?officeMapTest=${Date.now().toString(36)}-${attempt}`, {
      waitUntil: 'domcontentloaded',
    });
    await expect(page.getByRole('application', { name: 'Canvas editor' })).toBeVisible();
    const drawer = await openPagesDrawer(page);
    pageButton = drawer.getByRole('button', { name: new RegExp(escapeRegex(pageTitle)) }).first();
    if ((await pageButton.count()) > 0) break;
    await page.waitForTimeout(750);
  }
  pageButton ??= page
    .locator('aside[aria-hidden="false"]')
    .first()
    .getByRole('button', { name: new RegExp(escapeRegex(pageTitle)) })
    .first();
  await expect(pageButton).toBeVisible({ timeout: 15_000 });
  await pageButton.click();
  await expect(page.getByText(/Loaded page:/)).toBeVisible();
}

async function selectLayerNode(page: Page, nodeId: string, kind: string): Promise<void> {
  await page.getByRole('button', { name: 'Layers', exact: true }).click({ force: true });
  const drawer = page.locator('aside[aria-hidden="false"]').first();
  await expect(drawer.getByText('Layers').first()).toBeVisible();
  const row = drawer.locator(`[title="${kind} ${nodeId}"]`).first();
  await expect(row).toBeVisible({ timeout: 10_000 });
  await row.focus();
  await page.keyboard.press('Enter');
  if (!(await page.locator(`[data-node-id="${nodeId}"][class*="nodeSelected"]`).first().isVisible().catch(() => false))) {
    await row.click();
  }
  await expect(page.locator(`[data-node-id="${nodeId}"][class*="nodeSelected"]`).first()).toBeVisible({
    timeout: 10_000,
  });
}

async function draftPayload(page: Page, pageId: string): Promise<{
  draft?: { revision?: number };
  document?: { nodes?: Array<Record<string, unknown>> };
}> {
  const response = await page.request.get(`/api/builder/site/pages/${pageId}/draft?locale=ko`);
  expect(response.status()).toBe(200);
  return response.json() as Promise<{
    draft?: { revision?: number };
    document?: { nodes?: Array<Record<string, unknown>> };
  }>;
}

function nodeContent(nodes: Array<Record<string, unknown>>, id: string): Record<string, unknown> {
  const node = nodes.find((candidate) => candidate.id === id);
  const content = node?.content;
  return content && typeof content === 'object' ? content as Record<string, unknown> : {};
}

async function waitForPublishedNode(page: Page, slug: string, nodeId: string): Promise<void> {
  await expect.poll(async () => {
    await page.goto(`/ko/${slug}?publishedCheck=${Date.now()}`, { waitUntil: 'domcontentloaded' });
    return page.locator(`[data-node-id="${nodeId}"]`).count();
  }, { timeout: 30_000 }).toBeGreaterThan(0);
}

test.describe('/ko/admin-builder office map public reflection', () => {
  test('edits a generic Google map address and zoom through the Content inspector', async ({ page }) => {
    test.setTimeout(90_000);

    const token = `generic-map-${Date.now().toString(36)}`;
    const slug = `g-editor-${token}`;
    const title = `Generic Map ${token}`;
    const mapId = `generic-map-node-${token}`;
    const originalAddress = `台北市大安區復興南路一段 ${token}`;
    const nextAddress = `高雄市左營區安吉街233號 ${token}`;
    let pageId: string | null = null;
    await page.setExtraHTTPHeaders(mutationHeaders(token));

    try {
      pageId = await createBuilderPage(
        page.request,
        slug,
        title,
        makeGenericMapDocument({
          token,
          rootId: `generic-map-root-${token}`,
          mapId,
          address: originalAddress,
          zoom: 12,
        }),
      );
      await openBuilderPage(page, title, pageId);

      const mapNode = page.locator(`[data-node-id="${mapId}"]`).first();
      await expect(mapNode).toBeVisible();
      await selectLayerNode(page, mapId, 'map');
      await page.getByRole('button', { name: 'content' }).click({ force: true });
      await expect(page.locator('[data-builder-map-inspector="true"]')).toBeVisible();

      await page.getByLabel('Map address').fill(nextAddress);
      await page.getByRole('slider', { name: 'Map zoom' }).fill('18');

      const mapFrame = mapNode.locator('iframe[title="Google Maps"]').first();
      await expect(mapFrame).toBeVisible();
      await expect.poll(async () => {
        const src = await mapFrame.getAttribute('src');
        if (!src) return null;
        const url = new URL(src);
        return {
          address: url.searchParams.get('q'),
          zoom: url.searchParams.get('z'),
        };
      }, { timeout: 10_000 }).toEqual({
        address: nextAddress,
        zoom: '18',
      });

      await expect.poll(async () => {
        const payload = await draftPayload(page, pageId!);
        const content = nodeContent(payload.document?.nodes ?? [], mapId);
        return {
          address: content.address ?? null,
          zoom: content.zoom ?? null,
        };
      }, { timeout: 15_000 }).toEqual({
        address: nextAddress,
        zoom: 18,
      });

      await openBuilderPage(page, title);
      const reloadedFrame = page.locator(`[data-node-id="${mapId}"] iframe[title="Google Maps"]`).first();
      await expect(reloadedFrame).toBeVisible({ timeout: 15_000 });
      await expect.poll(async () => {
        const src = await reloadedFrame.getAttribute('src');
        if (!src) return null;
        const url = new URL(src);
        return {
          address: url.searchParams.get('q'),
          zoom: url.searchParams.get('z'),
        };
      }, { timeout: 10_000 }).toEqual({
        address: nextAddress,
        zoom: '18',
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

  test('syncs edited map address to office card and published page', async ({ page }) => {
    test.setTimeout(120_000);

    const token = `office-map-${Date.now().toString(36)}`;
    const slug = `g-editor-${token}`;
    const title = `Office Map ${token}`;
    const nextOfficeTitle = `검증 사무소 ${token}`;
    const nextAddress = `臺中市北區館前路19號樓之1 ${token}`;
    const nextPhone = '04-2326-1862';
    const nextFax = '04-2326-1863';
    const nextMapUrl = `https://www.google.com/maps/search/${encodeURIComponent(nextAddress)}`;
    let pageId: string | null = null;
    await page.setExtraHTTPHeaders(mutationHeaders(token));

    try {
      pageId = await createBuilderPage(page.request, slug, title, makeOfficeDocument(token));
      await openBuilderPage(page, title, pageId);

      const officeMap = page.locator('[data-node-id="home-offices-layout-0-map"]').first();
      await expect(officeMap).toBeVisible();
      await selectLayerNode(page, 'home-offices-layout-0-map', 'map');
      await page.getByRole('button', { name: 'content' }).click({ force: true });
      await expect(page.getByText('Office sync')).toBeVisible();

      await page.getByLabel('Office title synced value').fill(nextOfficeTitle);
      await page.getByLabel('Office address synced value').fill(nextAddress);
      await page.getByLabel('Office phone synced value').fill(nextPhone);
      await page.getByLabel('Office fax synced value').fill(nextFax);
      await page.getByLabel('Office map URL').fill(nextMapUrl);

      const officeCardAddress = page.locator('[data-node-id="home-offices-layout-0-card-address"]').first();
      await expect(officeCardAddress).toContainText(nextAddress);
      const mapFrame = officeMap.locator('iframe[title="Google Maps"]').first();
      await expect.poll(async () => {
        const src = await mapFrame.getAttribute('src');
        return src ? new URL(src).searchParams.get('q') : '';
      }, { timeout: 10_000 }).toBe(nextAddress);

      await expect.poll(async () => {
        const payload = await draftPayload(page, pageId!);
        const nodes = payload.document?.nodes ?? [];
        return {
          mapAddress: nodeContent(nodes, 'home-offices-layout-0-map').address,
          cardAddress: nodeContent(nodes, 'home-offices-layout-0-card-address').text,
          phoneLabel: nodeContent(nodes, 'home-offices-layout-0-card-phone').label,
          phoneHref: nodeContent(nodes, 'home-offices-layout-0-card-phone').href,
          faxText: nodeContent(nodes, 'home-offices-layout-0-card-fax').text,
          mapHref: nodeContent(nodes, 'home-offices-layout-0-card-map-link').href,
        };
      }, { timeout: 15_000 }).toEqual({
        mapAddress: nextAddress,
        cardAddress: nextAddress,
        phoneLabel: `전화: ${nextPhone}`,
        phoneHref: 'tel:0423261862',
        faxText: `팩스: ${nextFax}`,
        mapHref: nextMapUrl,
      });

      const draft = await draftPayload(page, pageId);
      const publishResponse = await page.request.post(`/api/builder/site/pages/${pageId}/publish`, {
        data: { expectedDraftRevision: draft.draft?.revision },
        headers: mutationHeaders(slug),
      });
      expect(publishResponse.status()).toBe(200);
      const published = (await publishResponse.json()) as { ok?: boolean; slug?: string; error?: string };
      expect(published.ok, published.error).toBe(true);
      expect(published.slug).toBe(slug);

      await waitForPublishedNode(page, slug, 'home-offices-layout-0-map');
      const publishedMap = page.locator('[data-node-id="home-offices-layout-0-map"]').first();
      await expect(publishedMap).toBeVisible();
      await expect(page.locator('[data-node-id="home-offices-layout-0-card-title"]').first()).toContainText(nextOfficeTitle);
      await expect(page.locator('[data-node-id="home-offices-layout-0-card-address"]').first()).toContainText(nextAddress);
      await expect(page.locator('[data-node-id="home-offices-layout-0-card-phone"]').first()).toContainText(`전화: ${nextPhone}`);
      await expect(page.locator('[data-node-id="home-offices-layout-0-card-phone"] a').first()).toHaveAttribute('href', 'tel:0423261862');
      await expect(page.locator('[data-node-id="home-offices-layout-0-card-fax"]').first()).toContainText(`팩스: ${nextFax}`);
      await expect(page.locator('[data-node-id="home-offices-layout-0-card-map-link"] a').first()).toHaveAttribute('href', nextMapUrl);
      await expect.poll(async () => {
        const src = await publishedMap.locator('iframe[title="Google Maps"]').first().getAttribute('src');
        return src ? new URL(src).searchParams.get('q') : '';
      }, { timeout: 10_000 }).toBe(nextAddress);
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

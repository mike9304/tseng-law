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

async function openBuilderPage(page: Page, pageTitle: string): Promise<void> {
  await page.goto(`/ko/admin-builder?officeMapTest=${Date.now().toString(36)}`, { waitUntil: 'domcontentloaded' });
  await expect(page.getByRole('application', { name: 'Canvas editor' })).toBeVisible();
  const drawer = await openPagesDrawer(page);
  const pageButton = drawer.getByRole('button', { name: new RegExp(escapeRegex(pageTitle)) }).first();
  await expect(pageButton).toBeVisible({ timeout: 15_000 });
  await pageButton.click();
  await expect(page.getByText(/Loaded page:/)).toBeVisible();
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

test.describe('/ko/admin-builder office map public reflection', () => {
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

    try {
      pageId = await createBuilderPage(page.request, slug, title, makeOfficeDocument(token));
      await openBuilderPage(page, title);

      const officeMap = page.locator('[data-node-id="home-offices-layout-0-map"]').first();
      await expect(officeMap).toBeVisible();
      await officeMap.click({ position: { x: 24, y: 24 }, force: true });
      await page.getByRole('button', { name: 'content' }).click();
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
      });
      expect(publishResponse.status()).toBe(200);
      const published = (await publishResponse.json()) as { ok?: boolean; slug?: string; error?: string };
      expect(published.ok, published.error).toBe(true);
      expect(published.slug).toBe(slug);

      await page.goto(`/ko/${slug}`, { waitUntil: 'domcontentloaded' });
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
          failOnStatusCode: false,
        });
      }
    }
  });
});

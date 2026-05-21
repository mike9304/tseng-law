import { expect, test, type Page } from '@playwright/test';
import { openBuilder } from './helpers/editor';

type DynamicDraftNode = {
  id?: string;
  kind?: string;
  parentId?: string;
  dataBinding?: {
    targetId?: string;
    recordIndex?: number;
    fields?: Record<string, string>;
  };
};

function mutationHeaders(scope: string): Record<string, string> {
  const safeScope = scope.replace(/[^a-z0-9-]/gi, '-').slice(-48) || 'dynamic-list-pages';
  return { 'x-forwarded-for': `pw-${safeScope}` };
}

async function selectLayerNode(page: Page, nodeId: string): Promise<void> {
  const layersPanel = page.locator('[data-builder-layers-panel="true"]').first();
  if (!(await layersPanel.isVisible().catch(() => false))) {
    await page.getByRole('button', { name: 'Layers', exact: true }).click({ force: true });
    await expect(layersPanel).toBeVisible();
  }
  await page.locator('[data-builder-layer-search="true"]').fill(nodeId);
  const layerRow = page.locator(`[data-builder-layer-row="${nodeId}"]`).first();
  await expect(layerRow).toBeVisible();
  const canvasNode = page.locator(`[data-node-id="${nodeId}"]`).first();
  const isSelected = async () => (await canvasNode.getAttribute('data-selected').catch(() => null)) === 'true';

  await layerRow.click({ force: true, position: { x: 90, y: 18 } }).catch(() => undefined);
  if (!(await isSelected())) {
    await layerRow.press('Enter').catch(() => undefined);
  }
  if (!(await isSelected())) {
    await canvasNode.scrollIntoViewIfNeeded().catch(() => undefined);
    await canvasNode.evaluate((element) => {
      const rect = element.getBoundingClientRect();
      const clientX = rect.left + Math.min(16, Math.max(1, rect.width / 2));
      const clientY = rect.top + Math.min(16, Math.max(1, rect.height / 2));
      element.dispatchEvent(new PointerEvent('pointerdown', {
        bubbles: true,
        cancelable: true,
        button: 0,
        buttons: 1,
        clientX,
        clientY,
        pointerId: 1,
        pointerType: 'mouse',
      }));
      element.dispatchEvent(new PointerEvent('pointerup', {
        bubbles: true,
        cancelable: true,
        button: 0,
        buttons: 0,
        clientX,
        clientY,
        pointerId: 1,
        pointerType: 'mouse',
      }));
    }).catch(() => undefined);
  }
  await expect(canvasNode).toHaveAttribute('data-selected', 'true');
}

async function readDraftNodes(page: Page, pageId: string, scope: string): Promise<DynamicDraftNode[]> {
  const response = await page.request.get(`/api/builder/site/pages/${pageId}/draft?locale=ko`, {
    headers: mutationHeaders(scope),
  });
  expect(response.status()).toBe(200);
  const payload = (await response.json()) as { document?: { nodes?: DynamicDraftNode[] } };
  return payload.document?.nodes ?? [];
}

test('/ko/admin-builder creates, previews, and publishes a CMS dynamic list page', async ({ page }) => {
  test.setTimeout(120_000);

  const token = Date.now().toString(36);
  const slug = `dynamic-list-columns-${token}`;
  let pageId: string | null = null;

  try {
    const createResponse = await page.request.post('/api/builder/site/pages', {
      headers: mutationHeaders(slug),
      data: {
        locale: 'ko',
        slug,
        title: `Dynamic columns ${token}`,
        addToNavigation: false,
        dynamicListCollectionId: 'columns',
        dynamicListFilters: [{ fieldId: 'title', operator: 'contains', value: '대만' }],
        dynamicListLimit: 2,
      },
    });
    expect(createResponse.status()).toBe(200);
    const created = (await createResponse.json()) as {
      success?: boolean;
      pageId?: string;
      page?: {
        slug?: string;
        dynamicList?: {
          kind?: string;
          collectionId?: string;
          targetId?: string;
          filters?: Array<{ fieldId: string; operator: string; value: string }>;
          limit?: number;
        };
      };
      error?: string;
    };
    expect(created.success, created.error).toBe(true);
    pageId = created.pageId ?? null;
    expect(pageId).toBeTruthy();
    expect(created.page?.dynamicList).toMatchObject({
      kind: 'collection-list-v1',
      collectionId: 'columns',
      targetId: 'home.insights.feed',
      filters: [{ fieldId: 'title', operator: 'contains', value: '대만' }],
      limit: 2,
    });

    const nodes = await readDraftNodes(page, pageId!, slug);
    const repeater = nodes.find((node) => node.id === 'dynamic-list-repeater-columns');
    const image = nodes.find((node) => node.id === 'dynamic-list-card-image-columns');
    const title = nodes.find((node) => node.id === 'dynamic-list-card-title-columns');
    const summary = nodes.find((node) => node.id === 'dynamic-list-card-summary-columns');
    const button = nodes.find((node) => node.id === 'dynamic-list-card-button-columns');
    expect(repeater?.dataBinding).toMatchObject({
      targetId: 'home.insights.feed',
      fields: { title: 'title', description: 'summary', src: 'featuredImage' },
    });
    expect(image?.dataBinding?.fields).toEqual({ src: 'featuredImage', alt: 'title', href: 'href' });
    expect(title?.dataBinding?.fields).toEqual({ text: 'title', href: 'href' });
    expect(summary?.dataBinding?.fields).toEqual({ text: 'summary' });
    expect(button?.dataBinding?.fields).toEqual({ href: 'href' });

    await openBuilder(page, `/ko/admin-builder?pageId=${encodeURIComponent(pageId!)}&dynamicListPage=${token}`);
    await selectLayerNode(page, 'dynamic-list-repeater-columns');
    const repeaterNode = page.locator('[data-node-id="dynamic-list-repeater-columns"]').first();
    const repeaterHud = repeaterNode.locator('[data-builder-repeater-template-hud="true"]').first();
    await expect(repeaterHud).toBeVisible();
    await expect(repeaterHud.locator('[data-builder-repeater-template-status="true"]')).toContainText(
      'Template 4/4 bound',
    );
    await expect(repeaterHud.locator('[data-builder-repeater-template-record="true"]')).toContainText(
      'Record 1 of 2',
    );
    const fieldSummary = repeaterHud.locator('[data-builder-repeater-template-field-summary="true"]').first();
    await expect(fieldSummary).toBeVisible();
    await expect(fieldSummary).toContainText('featuredImage');
    await expect(fieldSummary).toContainText('title');
    await expect(fieldSummary).toContainText('summary');
    await expect(fieldSummary).toContainText('href');

    const publishResponse = await page.request.post(`/api/builder/site/pages/${pageId}/publish?locale=ko`, {
      headers: mutationHeaders(slug),
    });
    expect(publishResponse.status()).toBe(200);
    const published = (await publishResponse.json()) as { ok?: boolean; slug?: string; error?: string };
    expect(published.ok, published.error).toBe(true);

    await page.goto(`/ko/${published.slug ?? slug}`, { waitUntil: 'domcontentloaded' });
    const publishedRepeater = page.locator('[data-node-id="dynamic-list-repeater-columns"]');
    await expect(publishedRepeater).toBeVisible();
    await expect(publishedRepeater.locator('[data-builder-repeater-item="true"]')).toHaveCount(2);
    await expect(publishedRepeater).not.toContainText('Record title');
    await expect(publishedRepeater).not.toContainText('Record summary');
  } finally {
    if (pageId) {
      await page.request.delete(`/api/builder/site/pages/${pageId}?locale=ko`, {
        headers: mutationHeaders(slug),
      }).catch(() => undefined);
    }
  }
});

test('/ko/admin-builder Pages panel can quick-create a service dynamic list page', async ({ page }) => {
  test.setTimeout(90_000);

  await openBuilder(page, `/ko/admin-builder?dynamicListQuickCreate=${Date.now().toString(36)}`);
  await page.getByRole('button', { name: 'Pages' }).click({ force: true });
  const createButton = page.locator('[data-builder-create-dynamic-list-page="service-areas"]').first();
  await expect(createButton).toBeVisible();

  const createResponse = page.waitForResponse((response) =>
    response.url().includes('/api/builder/site/pages')
    && response.request().method() === 'POST'
    && response.status() === 200,
  );
  await createButton.click({ force: true });
  const response = await createResponse;
  const created = (await response.json()) as {
    pageId?: string;
    page?: { slug?: string; dynamicList?: { collectionId?: string; targetId?: string } };
  };
  const pageId = created.pageId;
  expect(pageId).toBeTruthy();
  expect(created.page?.dynamicList).toMatchObject({
    collectionId: 'service-areas',
    targetId: 'home.services.list',
  });

  try {
    await expect(page.locator(`[data-builder-page-row="${pageId}"]`)).toBeVisible({ timeout: 30_000 });
    await expect(page.locator('[data-node-id="dynamic-list-repeater-service-areas"]').first()).toBeVisible();
    const nodes = await readDraftNodes(page, pageId!, created.page?.slug ?? pageId!);
    expect(nodes.find((node) => node.id === 'dynamic-list-repeater-service-areas')?.dataBinding).toMatchObject({
      targetId: 'home.services.list',
      fields: { title: 'title', description: 'description' },
    });
  } finally {
    if (pageId) {
      await page.request.delete(`/api/builder/site/pages/${pageId}?locale=ko`, {
        headers: mutationHeaders(created.page?.slug ?? pageId),
      }).catch(() => undefined);
    }
  }
});

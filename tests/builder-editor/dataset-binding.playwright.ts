import { expect, test, type APIRequestContext, type Page } from '@playwright/test';
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

type DatasetBindingPayload = {
  collectionId?: string;
  mode?: string;
  filters?: Array<{ fieldId: string; operator: string; value: string }>;
  sort?: Array<{ fieldId: string; direction: string }>;
  limit?: number;
};

type DatasetTargetPayload = {
  targetId: string;
  currentBinding: DatasetBindingPayload;
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
  const safeScope = scope.replace(/[^a-z0-9-]/gi, '-').slice(-48) || 'dataset-binding';
  return { 'x-forwarded-for': `pw-${safeScope}` };
}

async function draftDocumentText(page: import('@playwright/test').Page, pageId: string, locale = 'ko'): Promise<string> {
  const response = await page.request.get(`/api/builder/site/pages/${pageId}/draft?locale=${encodeURIComponent(locale)}`, {
    headers: mutationHeaders(pageId),
    failOnStatusCode: false,
  });
  if (response.status() !== 200) return '';
  const payload = (await response.json()) as { document?: unknown };
  return JSON.stringify(payload.document ?? null);
}

async function draftDocumentPayload(
  page: import('@playwright/test').Page,
  pageId: string,
  locale = 'ko',
): Promise<{ nodes?: Array<{
  id?: string;
  kind?: string;
  parentId?: string;
  dataBinding?: { targetId?: string; recordIndex?: number; fields?: Record<string, string> };
}> } | null> {
  const response = await page.request.get(`/api/builder/site/pages/${pageId}/draft?locale=${encodeURIComponent(locale)}`, {
    headers: mutationHeaders(pageId),
    failOnStatusCode: false,
  });
  if (response.status() !== 200) return null;
  const payload = (await response.json()) as { document?: unknown };
  return payload.document && typeof payload.document === 'object'
    ? payload.document as { nodes?: Array<{
        id?: string;
        kind?: string;
        parentId?: string;
        dataBinding?: { targetId?: string; recordIndex?: number; fields?: Record<string, string> };
      }> }
    : null;
}

async function currentDraftRevision(
  request: APIRequestContext,
  pageId: string,
  scope: string,
): Promise<number> {
  const response = await request.get(`/api/builder/site/pages/${pageId}/draft?locale=ko`, {
    headers: mutationHeaders(scope),
  });
  expect(response.status()).toBe(200);
  const payload = (await response.json()) as { draft?: { revision?: number } };
  expect(typeof payload.draft?.revision).toBe('number');
  return payload.draft!.revision!;
}

async function putDraftDocument(
  request: APIRequestContext,
  pageId: string,
  expectedRevision: number,
  document: TestDocument,
  scope: string,
): Promise<void> {
  const response = await request.put(`/api/builder/site/pages/${pageId}/draft?locale=ko`, {
    headers: mutationHeaders(scope),
    data: { expectedRevision, document },
  });
  expect(response.status()).toBe(200);
  const payload = (await response.json()) as { ok?: boolean; error?: string };
  expect(payload.ok, payload.error).toBe(true);
}

async function readHomeDatasetTarget(
  request: APIRequestContext,
  targetId: string,
  scope: string,
): Promise<{ revision: number; binding: DatasetBindingPayload }> {
  const response = await request.get('/api/builder/sites/default/pages/home/datasets?locale=ko', {
    headers: mutationHeaders(scope),
  });
  expect(response.status()).toBe(200);
  const payload = (await response.json()) as {
    ok?: boolean;
    revision?: number;
    targets?: DatasetTargetPayload[];
    error?: string;
  };
  expect(payload.ok, payload.error).toBe(true);
  expect(typeof payload.revision).toBe('number');
  const target = payload.targets?.find((candidate) => candidate.targetId === targetId);
  expect(target, `Missing dataset target ${targetId}`).toBeTruthy();
  return {
    revision: payload.revision!,
    binding: {
      collectionId: target!.currentBinding.collectionId,
      mode: target!.currentBinding.mode,
      filters: target!.currentBinding.filters ?? [],
      sort: target!.currentBinding.sort ?? [],
      limit: target!.currentBinding.limit,
    },
  };
}

async function putHomeDatasetTarget(
  request: APIRequestContext,
  targetId: string,
  expectedRevision: number,
  binding: DatasetBindingPayload,
  scope: string,
): Promise<void> {
  const response = await request.put('/api/builder/sites/default/pages/home/datasets?locale=ko', {
    headers: mutationHeaders(scope),
    data: {
      targetId,
      expectedRevision,
      collectionId: binding.collectionId,
      mode: binding.mode,
      filters: binding.filters ?? [],
      sort: binding.sort ?? [],
      limit: binding.limit,
    },
  });
  expect(response.status()).toBe(200);
  const payload = (await response.json()) as { ok?: boolean; error?: string };
  expect(payload.ok, payload.error).toBe(true);
}

async function publishBuilderDatasetPage(
  request: APIRequestContext,
  pageKey: 'home',
  scope: string,
): Promise<void> {
  const response = await request.post(`/api/builder/sites/default/pages/${pageKey}/publish?locale=ko`, {
    headers: mutationHeaders(scope),
    data: { updatedBy: `playwright-${scope}` },
  });
  expect(response.status()).toBe(200);
  const payload = (await response.json()) as { ok?: boolean; error?: string };
  expect(payload.ok, payload.error).toBe(true);
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

async function expectNoVisibleHorizontalOverflow(
  page: Page,
  containerSelector: string,
): Promise<void> {
  const overflow = await page.locator(containerSelector).first().evaluate((container) => {
    const containerRect = container.getBoundingClientRect();
    return Array.from(container.querySelectorAll<HTMLElement>('*'))
      .map((element) => {
        const rect = element.getBoundingClientRect();
        const style = window.getComputedStyle(element);
        return {
          tag: element.tagName.toLowerCase(),
          text: element.textContent?.trim().replace(/\s+/g, ' ').slice(0, 80) ?? '',
          left: rect.left,
          right: rect.right,
          width: rect.width,
          visible:
            style.display !== 'none' &&
            style.visibility !== 'hidden' &&
            rect.width > 0 &&
            rect.height > 0,
          overflows: rect.left < containerRect.left - 1 || rect.right > containerRect.right + 1,
        };
      })
      .filter((entry) => entry.visible && entry.overflows);
  });

  expect(overflow).toEqual([]);
}

function makeRepeaterDatasetDocument(token: string): TestDocument {
  const rootId = `dataset-repeater-root-${token}`;
  return {
    version: 1,
    locale: 'ko',
    updatedAt: new Date().toISOString(),
    updatedBy: `dataset-repeater-${token}`,
    stageWidth: 1280,
    stageHeight: 720,
    nodes: [
      {
        id: rootId,
        kind: 'container',
        rect: { x: 0, y: 0, width: 1280, height: 720 },
        style: baseStyle,
        zIndex: 1,
        rotation: 0,
        locked: false,
        visible: true,
        content: {
          label: 'Root',
          background: '#f8fafc',
          borderColor: '#e5e7eb',
          borderStyle: 'solid',
          borderWidth: 0,
          borderRadius: 0,
          padding: 48,
          layoutMode: 'absolute',
        },
      },
      {
        id: `dataset-repeater-${token}`,
        kind: 'container',
        parentId: rootId,
        rect: { x: 72, y: 80, width: 880, height: 360 },
        style: baseStyle,
        zIndex: 2,
        rotation: 0,
        locked: false,
        visible: true,
        content: {
          label: 'Dataset repeater',
          background: '#ffffff',
          borderColor: '#e2e8f0',
          borderStyle: 'solid',
          borderWidth: 1,
          borderRadius: 18,
          padding: 20,
          layoutMode: 'repeater',
          layoutItems: [
            {
              title: 'Placeholder title',
              description: 'Placeholder summary',
              image: '/images/placeholder-image.svg',
            },
          ],
        },
        dataBinding: {
          targetId: 'home.insights.feed',
          recordIndex: 0,
          fields: { title: 'title', description: 'summary', src: 'featuredImage' },
        },
      },
    ],
  };
}

function makeTextDatasetPreviewDocument(token: string): TestDocument {
  const rootId = `dataset-preview-root-${token}`;
  return {
    version: 1,
    locale: 'ko',
    updatedAt: new Date().toISOString(),
    updatedBy: `dataset-preview-${token}`,
    stageWidth: 1280,
    stageHeight: 520,
    nodes: [
      {
        id: rootId,
        kind: 'container',
        rect: { x: 0, y: 0, width: 1280, height: 520 },
        style: baseStyle,
        zIndex: 1,
        rotation: 0,
        locked: false,
        visible: true,
        content: {
          label: 'Root',
          background: '#f8fafc',
          borderColor: '#e5e7eb',
          borderStyle: 'solid',
          borderWidth: 0,
          borderRadius: 0,
          padding: 48,
          layoutMode: 'absolute',
        },
      },
      {
        id: `dataset-preview-text-${token}`,
        kind: 'text',
        parentId: rootId,
        rect: { x: 80, y: 96, width: 640, height: 88 },
        style: baseStyle,
        zIndex: 2,
        rotation: 0,
        locked: false,
        visible: true,
        content: {
          text: `Static placeholder ${token}`,
          fontSize: 28,
          color: '#0f172a',
          fontWeight: 'bold',
          align: 'left',
          lineHeight: 1.2,
          letterSpacing: 0,
        },
      },
    ],
  };
}

function makeStaleTextBindingDocument(token: string): TestDocument {
  const document = makeTextDatasetPreviewDocument(token);
  const textNodeId = `dataset-preview-text-${token}`;
  return {
    ...document,
    updatedBy: `dataset-stale-binding-${token}`,
    nodes: document.nodes.map((node) => (
      node.id === textNodeId
        ? {
            ...node,
            dataBinding: {
              targetId: 'home.insights.feed',
              recordIndex: 0,
              fields: { text: `missingField-${token}` },
            },
          }
        : node
    )),
  };
}

function makeRepeaterTemplateDatasetDocument(
  token: string,
  options: { childBindings?: boolean } = {},
): TestDocument {
  const includeChildBindings = options.childBindings ?? true;
  const rootId = `dataset-template-root-${token}`;
  const repeaterId = `dataset-template-repeater-${token}`;
  return {
    version: 1,
    locale: 'ko',
    updatedAt: new Date().toISOString(),
    updatedBy: `dataset-repeater-template-${token}`,
    stageWidth: 1280,
    stageHeight: 820,
    nodes: [
      {
        id: rootId,
        kind: 'container',
        rect: { x: 0, y: 0, width: 1280, height: 820 },
        style: baseStyle,
        zIndex: 1,
        rotation: 0,
        locked: false,
        visible: true,
        content: {
          label: 'Root',
          background: '#f8fafc',
          borderColor: '#e5e7eb',
          borderStyle: 'solid',
          borderWidth: 0,
          borderRadius: 0,
          padding: 56,
          layoutMode: 'absolute',
        },
      },
      {
        id: repeaterId,
        kind: 'container',
        parentId: rootId,
        rect: { x: 72, y: 80, width: 960, height: 520 },
        style: baseStyle,
        zIndex: 2,
        rotation: 0,
        locked: false,
        visible: true,
        content: {
          label: 'Template repeater',
          background: '#ffffff',
          borderColor: '#e2e8f0',
          borderStyle: 'solid',
          borderWidth: 1,
          borderRadius: 18,
          padding: 20,
          layoutMode: 'repeater',
          flexConfig: {
            direction: 'row',
            wrap: true,
            justifyContent: 'flex-start',
            alignItems: 'stretch',
            gap: 18,
          },
        },
        dataBinding: {
          targetId: 'home.insights.feed',
          recordIndex: 0,
          fields: { title: 'title' },
        },
      },
      {
        id: `template-image-${token}`,
        kind: 'image',
        parentId: repeaterId,
        rect: { x: 0, y: 0, width: 220, height: 124 },
        style: { ...baseStyle, borderRadius: 12 },
        zIndex: 3,
        rotation: 0,
        locked: false,
        visible: true,
        content: {
          src: '/images/placeholder-image.svg',
          alt: 'Template image',
          fit: 'cover',
          link: null,
        },
        ...(includeChildBindings
          ? {
              dataBinding: {
                targetId: 'home.insights.feed',
                recordIndex: 0,
                fields: { src: 'featuredImage', alt: 'title' },
              },
            }
          : {}),
      },
      {
        id: `template-title-${token}`,
        kind: 'text',
        parentId: repeaterId,
        rect: { x: 0, y: 142, width: 220, height: 70 },
        style: baseStyle,
        zIndex: 4,
        rotation: 0,
        locked: false,
        visible: true,
        content: {
          text: 'Template title',
          fontSize: 18,
          color: '#0f172a',
          fontWeight: 'bold',
          align: 'left',
          lineHeight: 1.25,
          letterSpacing: 0,
        },
        ...(includeChildBindings
          ? {
              dataBinding: {
                targetId: 'home.insights.feed',
                recordIndex: 0,
                fields: { text: 'title' },
              },
            }
          : {}),
      },
      {
        id: `template-link-${token}`,
        kind: 'button',
        parentId: repeaterId,
        rect: { x: 0, y: 230, width: 148, height: 44 },
        style: { ...baseStyle, borderRadius: 999 },
        zIndex: 5,
        rotation: 0,
        locked: false,
        visible: true,
        content: {
          label: 'Template link',
          href: '',
          style: 'primary-solid',
          link: null,
        },
        ...(includeChildBindings
          ? {
              dataBinding: {
                targetId: 'home.insights.feed',
                recordIndex: 0,
                fields: { label: 'readTime', href: 'href' },
              },
            }
          : {}),
      },
    ],
  };
}

test('home services section exposes runtime dataset binding controls', async ({ page }) => {
  await page.goto('/ko/builder/home?mode=edit', { waitUntil: 'domcontentloaded' });

  await expect(page.getByText('Structure controls')).toBeVisible({ timeout: 30_000 });
  await page.getByText('Structure controls').click();

  await page
    .locator('.builder-preview-section-card')
    .filter({ hasText: 'home.services' })
    .getByRole('button')
    .first()
    .click();

  await expect(page.getByText('Services list is backed by a persisted dataset contract.')).toBeVisible();
  await expect(
    page
      .locator('.builder-preview-server-alert--needs-review')
      .filter({ hasText: 'Services list is backed by a persisted dataset contract.' }),
  ).toBeVisible();
  await expect(page.getByText('home.services.list')).toBeVisible();
  await expect(page.getByRole('definition').filter({ hasText: /^service-areas$/ })).toBeVisible();
  await expect(page.getByRole('button', { name: '3 records' })).toBeVisible();
  await expect(page.getByRole('button', { name: '6 records' })).toBeVisible();
});

test('/ko/admin-builder saves element field binding metadata from the content inspector', async ({ page }) => {
  test.setTimeout(90_000);

  const token = Date.now().toString(36);
  const slug = `dataset-field-binding-${token}`;
  let pageId: string | null = null;
  await page.setExtraHTTPHeaders(mutationHeaders(slug));

  try {
    const createResponse = await page.request.post('/api/builder/site/pages', {
      data: {
        locale: 'ko',
        slug,
        title: `Dataset field binding ${token}`,
      },
      headers: mutationHeaders(slug),
    });
    expect(createResponse.status()).toBe(200);
    const created = (await createResponse.json()) as { success?: boolean; pageId?: string; error?: string };
    expect(created.success, created.error).toBe(true);
    pageId = created.pageId ?? null;
    expect(pageId).toBeTruthy();

    await openBuilder(page, `/ko/admin-builder?pageId=${encodeURIComponent(pageId!)}&datasetBinding=${token}`);
    await page.keyboard.press('Escape');
    await selectLayerNode(page, 'headline-1');

    const inspector = page.locator('[data-builder-inspector-panel="true"]').first();
    const contentTab = inspector.getByRole('button', { name: 'content' });
    await expect(contentTab).toBeVisible();
    await contentTab.click({ force: true });
    await expect(inspector.getByText('Field binding')).toBeVisible();
    const bindingPanel = inspector.locator('[data-builder-data-binding-panel="true"]').first();
    await expect(bindingPanel).toBeVisible();
    const draftSave = page.waitForResponse((response) =>
      response.url().includes(`/api/builder/site/pages/${pageId}/draft`)
      && response.request().method() === 'PUT'
      && response.status() === 200
    );
    await bindingPanel.getByRole('switch', { name: 'Toggle dataset field binding' }).click();
    await expect(bindingPanel).toHaveAttribute('data-builder-data-binding-enabled', 'true');

    await bindingPanel.locator('[data-builder-data-binding-field="text"]').selectOption('title');
    await bindingPanel.locator('[data-builder-data-binding-field="href"]').selectOption('href');
    await expect(bindingPanel.locator('[data-builder-data-binding-field="text"]')).toHaveValue('title');
    await expect(bindingPanel.locator('[data-builder-data-binding-field="href"]')).toHaveValue('href');
    await draftSave;

    await expect.poll(async () => draftDocumentText(page, pageId!), { timeout: 30_000 }).toContain('"dataBinding"');
    const draftText = await draftDocumentText(page, pageId!);
    expect(draftText).toContain('"targetId":"home.insights.feed"');
    expect(draftText).toContain('"text":"title"');
    expect(draftText).toContain('"href":"href"');

    await openBuilder(page, `/ko/admin-builder?pageId=${encodeURIComponent(pageId!)}&datasetBindingReload=${token}`);
    await selectLayerNode(page, 'headline-1');
    const reloadedInspector = page.locator('[data-builder-inspector-panel="true"]').first();
    const reloadedContentTab = reloadedInspector.getByRole('button', { name: 'content' });
    await expect(reloadedContentTab).toBeVisible();
    await reloadedContentTab.click({ force: true });
    const reloadedBindingPanel = reloadedInspector.locator('[data-builder-data-binding-panel="true"]').first();
    await expect(reloadedBindingPanel.getByRole('switch', { name: 'Toggle dataset field binding' })).toHaveAttribute('aria-checked', 'true');
    await expect(reloadedBindingPanel.locator('[data-builder-data-binding-field="text"]')).toHaveValue('title');
    await expect(reloadedBindingPanel.locator('[data-builder-data-binding-field="href"]')).toHaveValue('href');
  } finally {
    if (pageId) {
      await page.request.delete(`/api/builder/site/pages/${pageId}?locale=ko`, {
        headers: mutationHeaders(slug),
      }).catch(() => undefined);
    }
  }
});

test('/ko/admin-builder flags stale dataset field mappings before publish', async ({ page }) => {
  test.setTimeout(90_000);

  const token = Date.now().toString(36);
  const slug = `dataset-stale-binding-${token}`;
  const textNodeId = `dataset-preview-text-${token}`;
  let pageId: string | null = null;
  await page.setExtraHTTPHeaders(mutationHeaders(slug));

  try {
    const createResponse = await page.request.post('/api/builder/site/pages', {
      data: {
        locale: 'ko',
        slug,
        title: `Dataset stale binding ${token}`,
      },
      headers: mutationHeaders(slug),
    });
    expect(createResponse.status()).toBe(200);
    const created = (await createResponse.json()) as { success?: boolean; pageId?: string; error?: string };
    expect(created.success, created.error).toBe(true);
    pageId = created.pageId ?? null;
    expect(pageId).toBeTruthy();

    const revision = await currentDraftRevision(page.request, pageId!, slug);
    await putDraftDocument(page.request, pageId!, revision, makeStaleTextBindingDocument(token), slug);

    await openBuilder(page, `/ko/admin-builder?pageId=${encodeURIComponent(pageId!)}&datasetStale=${token}`);
    await page.keyboard.press('Escape');
    await selectLayerNode(page, textNodeId);
    const canvasWarning = page
      .locator(`[data-node-id="${textNodeId}"] [data-builder-data-binding-canvas-warning="true"]`)
      .first();
    await expect(canvasWarning).toBeVisible();
    await expect(canvasWarning).toContainText('Dataset field missing');
    await expect(canvasWarning).toContainText(`missingField-${token}`);

    const inspector = page.locator('[data-builder-inspector-panel="true"]').first();
    await inspector.getByRole('button', { name: 'content' }).click({ force: true });
    const bindingPanel = inspector.locator('[data-builder-data-binding-panel="true"]').first();
    await expect(bindingPanel).toBeVisible();
    await expect(bindingPanel).toHaveAttribute('data-builder-data-binding-enabled', 'true');

    const warning = bindingPanel.locator('[data-builder-data-binding-warning="true"]').first();
    await expect(warning).toBeVisible();
    await expect(warning).toContainText('Missing or incompatible field');
    await expect(warning).toContainText(`missingField-${token}`);
    const textFieldSelect = bindingPanel.locator('[data-builder-data-binding-field="text"]');
    await expect(textFieldSelect).toHaveValue(`missingField-${token}`);
    await expect(textFieldSelect).toHaveAttribute('data-builder-data-binding-stale-field', 'true');
    await expect(textFieldSelect.locator(`option[value="missingField-${token}"]`)).toHaveText(
      `Missing field: missingField-${token}`
    );
    await expectNoVisibleHorizontalOverflow(page, '[data-builder-data-binding-panel="true"]');

    await page.getByTitle('사이트 발행').click();
    const publishDialog = page.getByRole('dialog', { name: /Publish Page|페이지 발행/ });
    await expect(publishDialog).toBeVisible();
    const dataPreflightItem = publishDialog.locator('[data-builder-publish-preflight-item="data"]');
    await expect(dataPreflightItem).toContainText('CMS data');
    await expect(dataPreflightItem).toContainText('warning');
    await expect(publishDialog.getByText('CMS data bindings need attention')).toBeVisible();
    await expect(publishDialog.getByText(`dataset-preview-text-${token} text: missingField-${token}`)).toBeVisible();
    await expect(publishDialog.getByRole('button', { name: '경고 무시하고 발행' })).toBeVisible();
    await expect(publishDialog.getByRole('button', { name: '발행' }).last()).toBeDisabled();
    await publishDialog.getByRole('button', { name: '취소' }).click();
    await expect(publishDialog).toBeHidden();

    const stalePublishResponse = await page.request.post(`/api/builder/site/pages/${pageId}/publish?locale=ko`, {
      headers: mutationHeaders(slug),
    });
    expect(stalePublishResponse.status()).toBe(200);
    const stalePublishPayload = (await stalePublishResponse.json()) as { ok?: boolean; slug?: string; error?: string };
    expect(stalePublishPayload.ok, stalePublishPayload.error).toBe(true);
    const publishedSlug = (stalePublishPayload.slug || slug).replace(/^\/+|\/+$/g, '');
    await expect.poll(async () => {
      const response = await page.request.get(`/ko/${publishedSlug}?datasetStalePublished=${token}`, {
        headers: mutationHeaders(`${slug}-published-stale`),
        failOnStatusCode: false,
      });
      return response.status();
    }, { timeout: 30_000 }).toBe(200);
    const stalePublishedPage = await page.request.get(`/ko/${publishedSlug}?datasetStalePublishedHtml=${token}`, {
      headers: mutationHeaders(`${slug}-published-stale-html`),
    });
    const stalePublishedHtml = await stalePublishedPage.text();
    expect(stalePublishedHtml).not.toContain(`Static placeholder ${token}`);
    expect(stalePublishedHtml).toContain('data-builder-published-page');

    await openBuilder(page, `/ko/admin-builder?pageId=${encodeURIComponent(pageId!)}&datasetStaleRepair=${token}`);
    await page.keyboard.press('Escape');
    await selectLayerNode(page, textNodeId);
    const repairInspector = page.locator('[data-builder-inspector-panel="true"]').first();
    await repairInspector.getByRole('button', { name: 'content' }).click({ force: true });
    const repairBindingPanel = repairInspector.locator('[data-builder-data-binding-panel="true"]').first();
    await expect(repairBindingPanel.locator('[data-builder-data-binding-warning="true"]').first()).toBeVisible();
    const repairTextFieldSelect = repairBindingPanel.locator('[data-builder-data-binding-field="text"]');
    await expect(repairTextFieldSelect).toHaveValue(`missingField-${token}`);

    const repairSave = page.waitForResponse((response) =>
      response.url().includes(`/api/builder/site/pages/${pageId}/draft`)
      && response.request().method() === 'PUT'
      && response.status() === 200
    );
    await repairTextFieldSelect.selectOption('title');
    await repairSave;
    await expect(repairTextFieldSelect).toHaveValue('title');
    await expect(repairTextFieldSelect).not.toHaveAttribute('data-builder-data-binding-stale-field', 'true');
    await expect(repairBindingPanel.locator('[data-builder-data-binding-warning="true"]')).toHaveCount(0);
    await expect(page.locator(`[data-node-id="${textNodeId}"] [data-builder-data-binding-canvas-warning="true"]`)).toHaveCount(0);
    await expect.poll(async () => draftDocumentText(page, pageId!), { timeout: 30_000 }).not.toContain(`missingField-${token}`);
    await expect.poll(async () => draftDocumentText(page, pageId!), { timeout: 30_000 }).toContain('"text":"title"');
  } finally {
    if (pageId) {
      await page.request.delete(`/api/builder/site/pages/${pageId}?locale=ko`, {
        headers: mutationHeaders(slug),
      }).catch(() => undefined);
    }
  }
});

test('/ko/admin-builder previews selected dataset records in inspector and canvas', async ({ page }) => {
  test.setTimeout(90_000);

  const token = Date.now().toString(36);
  const slug = `dataset-record-preview-${token}`;
  const textNodeId = `dataset-preview-text-${token}`;
  let pageId: string | null = null;
  let originalInsightBinding: DatasetBindingPayload | null = null;
  await page.setExtraHTTPHeaders(mutationHeaders(slug));

  try {
    const currentDatasetTarget = await readHomeDatasetTarget(page.request, 'home.insights.feed', slug);
    originalInsightBinding = currentDatasetTarget.binding;
    await putHomeDatasetTarget(
      page.request,
      'home.insights.feed',
      currentDatasetTarget.revision,
      {
        collectionId: originalInsightBinding.collectionId,
        mode: originalInsightBinding.mode,
        filters: [],
        sort: [{ fieldId: 'title', direction: 'asc' }],
        limit: 7,
      },
      slug,
    );

    const createResponse = await page.request.post('/api/builder/site/pages', {
      data: {
        locale: 'ko',
        slug,
        title: `Dataset record preview ${token}`,
      },
      headers: mutationHeaders(slug),
    });
    expect(createResponse.status()).toBe(200);
    const created = (await createResponse.json()) as { success?: boolean; pageId?: string; error?: string };
    expect(created.success, created.error).toBe(true);
    pageId = created.pageId ?? null;
    expect(pageId).toBeTruthy();

    const revision = await currentDraftRevision(page.request, pageId!, slug);
    await putDraftDocument(page.request, pageId!, revision, makeTextDatasetPreviewDocument(token), slug);

    await openBuilder(page, `/ko/admin-builder?pageId=${encodeURIComponent(pageId!)}&datasetRecordPreview=${token}`);
    await selectLayerNode(page, textNodeId);

    const inspector = page.locator('[data-builder-inspector-panel="true"]').first();
    const contentTab = inspector.getByRole('button', { name: 'content' });
    await expect(contentTab).toBeVisible();
    await contentTab.click({ force: true });

    const bindingPanel = inspector.locator('[data-builder-data-binding-panel="true"]').first();
    await expect(bindingPanel).toBeVisible();
    await bindingPanel.getByRole('switch', { name: 'Toggle dataset field binding' }).click();
    await expect(bindingPanel).toHaveAttribute('data-builder-data-binding-enabled', 'true');
    await expect(bindingPanel.locator('[data-builder-data-source-summary="true"]')).toContainText(
      'Connected to: Insights feed'
    );
    await expect(bindingPanel.locator('[data-builder-data-source-summary="true"]')).toContainText(
      'Collection: columns'
    );
    await expect(bindingPanel.locator('[data-builder-data-source-summary="true"]')).toContainText(
      'Limit: 7'
    );
    await expect(bindingPanel.locator('[data-builder-data-source-summary="true"]')).toContainText(
      'Filter: none'
    );
    await expect(bindingPanel.locator('[data-builder-data-source-summary="true"]')).toContainText(
      'Sort: Title ASC'
    );
    await expect(bindingPanel.locator('[data-builder-data-source-summary="true"]')).toContainText(
      'Published runtime: applied'
    );
    await expectNoVisibleHorizontalOverflow(page, '[data-builder-data-binding-panel="true"]');
    await bindingPanel.locator('[data-builder-data-binding-field="text"]').selectOption('title');

    const previewCard = bindingPanel.locator('[data-builder-data-record-preview="true"]').first();
    await expect(previewCard).toBeVisible();
    await expect(previewCard.locator('[data-builder-data-preview-mode="true"]')).toContainText(
      'Previewing CMS record data'
    );
    await expect(previewCard.locator('[data-builder-data-record-position="true"]')).toContainText('Record 1 of');
    const recordSelect = bindingPanel.locator('[data-builder-data-record-select="true"]');
    await expect(recordSelect).toBeVisible();
    await expectNoVisibleHorizontalOverflow(page, '[data-builder-data-binding-panel="true"]');
    const firstTitle = (await previewCard.locator('[data-builder-data-preview-primary="true"]').innerText()).trim();
    expect(firstTitle.length).toBeGreaterThan(0);

    const canvasTextNode = page.locator(`[data-node-id="${textNodeId}"]`).first();
    await expect(canvasTextNode).toContainText(firstTitle);
    await expect(canvasTextNode).not.toContainText(`Static placeholder ${token}`);

    const recordOptions = await recordSelect.locator('option').evaluateAll((options) =>
      options.map((option) => ({
        value: (option as HTMLOptionElement).value,
        text: option.textContent?.trim() ?? '',
      }))
    );
    expect(recordOptions.length).toBeGreaterThan(1);
    await recordSelect.selectOption(recordOptions[1].value);

    await expect(previewCard.locator('[data-builder-data-record-position="true"]')).toContainText('Record 2 of');
    const secondTitle = (await previewCard.locator('[data-builder-data-preview-primary="true"]').innerText()).trim();
    expect(secondTitle.length).toBeGreaterThan(0);
    expect(secondTitle).not.toBe(firstTitle);
    await expect(recordSelect).toHaveValue(recordOptions[1].value);
    await expect(canvasTextNode).toContainText(secondTitle);
    await expectNoVisibleHorizontalOverflow(page, '[data-builder-data-binding-panel="true"]');

    await expect.poll(async () => {
      const document = await draftDocumentPayload(page, pageId!);
      const binding = document?.nodes?.find((node) => node.id === textNodeId)?.dataBinding;
      return {
        targetId: binding?.targetId,
        recordIndex: binding?.recordIndex,
        textField: binding?.fields?.text,
      };
    }, { timeout: 30_000 }).toEqual({
      targetId: 'home.insights.feed',
      recordIndex: 1,
      textField: 'title',
    });
  } finally {
    if (originalInsightBinding) {
      const latest = await readHomeDatasetTarget(page.request, 'home.insights.feed', slug).catch(() => null);
      if (latest) {
        await putHomeDatasetTarget(
          page.request,
          'home.insights.feed',
          latest.revision,
          originalInsightBinding,
          slug,
        ).catch(() => undefined);
      }
    }
    if (pageId) {
      await page.request.delete(`/api/builder/site/pages/${pageId}?locale=ko`, {
        headers: mutationHeaders(slug),
      }).catch(() => undefined);
    }
  }
});

test('published repeater container renders dataset records from bound fields', async ({ page }) => {
  test.setTimeout(90_000);

  const token = Date.now().toString(36);
  const slug = `dataset-repeater-${token}`;
  let pageId: string | null = null;
  await page.setExtraHTTPHeaders(mutationHeaders(slug));

  try {
    const createResponse = await page.request.post('/api/builder/site/pages', {
      data: {
        locale: 'ko',
        slug,
        title: `Dataset repeater ${token}`,
      },
      headers: mutationHeaders(slug),
    });
    expect(createResponse.status()).toBe(200);
    const created = (await createResponse.json()) as { success?: boolean; pageId?: string; error?: string };
    expect(created.success, created.error).toBe(true);
    pageId = created.pageId ?? null;
    expect(pageId).toBeTruthy();

    const revision = await currentDraftRevision(page.request, pageId!, slug);
    await putDraftDocument(page.request, pageId!, revision, makeRepeaterDatasetDocument(token), slug);

    const publishResponse = await page.request.post(`/api/builder/site/pages/${pageId}/publish?locale=ko`, {
      headers: mutationHeaders(slug),
    });
    expect(publishResponse.status()).toBe(200);
    const publishPayload = (await publishResponse.json()) as { ok?: boolean; slug?: string; error?: string };
    expect(publishPayload.ok, publishPayload.error).toBe(true);
    const publishedSlug = publishPayload.slug ?? slug;

    await page.goto(`/ko/${publishedSlug}`, { waitUntil: 'domcontentloaded' });

    const repeater = page.locator(`[data-node-id="dataset-repeater-${token}"]`);
    await expect(repeater).toBeVisible();
    await expect(repeater.locator('.builder-layout-repeater article')).toHaveCount(4);
    await expect(repeater).toContainText('대만');
    await expect(repeater).not.toContainText('Placeholder title');
    await expect(repeater.locator('.builder-layout-repeater-image img')).toHaveCount(4);
  } finally {
    if (pageId) {
      await page.request.delete(`/api/builder/site/pages/${pageId}?locale=ko`, {
        headers: mutationHeaders(slug),
      }).catch(() => undefined);
    }
  }
});

test('/ko/admin-builder binds repeater child templates from the content inspector', async ({ page }) => {
  test.setTimeout(90_000);

  const token = Date.now().toString(36);
  const slug = `dataset-repeater-authoring-${token}`;
  const repeaterId = `dataset-template-repeater-${token}`;
  let pageId: string | null = null;
  await page.setExtraHTTPHeaders(mutationHeaders(slug));

  try {
    const createResponse = await page.request.post('/api/builder/site/pages', {
      data: {
        locale: 'ko',
        slug,
        title: `Dataset repeater authoring ${token}`,
      },
      headers: mutationHeaders(slug),
    });
    expect(createResponse.status()).toBe(200);
    const created = (await createResponse.json()) as { success?: boolean; pageId?: string; error?: string };
    expect(created.success, created.error).toBe(true);
    pageId = created.pageId ?? null;
    expect(pageId).toBeTruthy();

    const revision = await currentDraftRevision(page.request, pageId!, slug);
    await putDraftDocument(
      page.request,
      pageId!,
      revision,
      makeRepeaterTemplateDatasetDocument(token, { childBindings: false }),
      slug,
    );

    await openBuilder(page, `/ko/admin-builder?pageId=${encodeURIComponent(pageId!)}&datasetRepeaterAuthoring=${token}`);
    await selectLayerNode(page, repeaterId);

    const inspector = page.locator('[data-builder-inspector-panel="true"]').first();
    const contentTab = inspector.getByRole('button', { name: 'content' });
    await expect(contentTab).toBeVisible();
    await contentTab.click({ force: true });

    const authoring = inspector.locator('[data-builder-repeater-binding-authoring="true"]').first();
    await expect(authoring).toBeVisible();
    await expect(authoring).toContainText('3 template children');
    await expect(authoring.locator('[data-builder-repeater-binding-status="true"]')).toContainText(
      'No template children bound yet'
    );
    const bindingMap = authoring.locator('[data-builder-repeater-binding-map="true"]');
    await expect(bindingMap).toBeVisible();
    await expect(bindingMap).toContainText('Text / heading / button label');
    await expect(bindingMap).toContainText('Title');
    await expect(bindingMap).toContainText('Image source');
    await expect(bindingMap).toContainText('Featured image');
    await expect(bindingMap).toContainText('Button / image link');
    await expect(bindingMap).toContainText('Column link');
    await expectNoVisibleHorizontalOverflow(page, '[data-builder-repeater-binding-authoring="true"]');

    const draftSave = page.waitForResponse((response) =>
      response.url().includes(`/api/builder/site/pages/${pageId}/draft`)
      && response.request().method() === 'PUT'
      && response.status() === 200
    );
    await inspector.locator('[data-builder-repeater-bind-children="true"]').click();
    await draftSave;

    await expect(authoring.locator('[data-builder-repeater-binding-status="true"]')).toContainText(
      '3 template children bound'
    );
    await expect(inspector.locator('[data-builder-repeater-bind-children="true"]')).toContainText(
      'Replace child template bindings'
    );

    await expect.poll(async () => {
      const document = await draftDocumentPayload(page, pageId!);
      const nodes = document?.nodes ?? [];
      const title = nodes.find((node) => node.id === `template-title-${token}`)?.dataBinding;
      const image = nodes.find((node) => node.id === `template-image-${token}`)?.dataBinding;
      const link = nodes.find((node) => node.id === `template-link-${token}`)?.dataBinding;
      return {
        titleTarget: title?.targetId,
        titleField: title?.fields?.text,
        imageSrc: image?.fields?.src,
        imageAlt: image?.fields?.alt,
        linkLabel: link?.fields?.label,
        linkHref: link?.fields?.href,
      };
    }, { timeout: 30_000 }).toEqual({
      titleTarget: 'home.insights.feed',
      titleField: 'title',
      imageSrc: 'featuredImage',
      imageAlt: 'title',
      linkLabel: 'title',
      linkHref: 'href',
    });
  } finally {
    if (pageId) {
      await page.request.delete(`/api/builder/site/pages/${pageId}?locale=ko`, {
        headers: mutationHeaders(slug),
      }).catch(() => undefined);
    }
  }
});

test('/ko/admin-builder previews repeater child template with selected parent record', async ({ page }) => {
  test.setTimeout(90_000);

  const token = Date.now().toString(36);
  const slug = `dataset-repeater-child-preview-${token}`;
  const repeaterId = `dataset-template-repeater-${token}`;
  const titleId = `template-title-${token}`;
  let pageId: string | null = null;
  await page.setExtraHTTPHeaders(mutationHeaders(slug));

  try {
    const createResponse = await page.request.post('/api/builder/site/pages', {
      data: {
        locale: 'ko',
        slug,
        title: `Dataset repeater child preview ${token}`,
      },
      headers: mutationHeaders(slug),
    });
    expect(createResponse.status()).toBe(200);
    const created = (await createResponse.json()) as { success?: boolean; pageId?: string; error?: string };
    expect(created.success, created.error).toBe(true);
    pageId = created.pageId ?? null;
    expect(pageId).toBeTruthy();

    const revision = await currentDraftRevision(page.request, pageId!, slug);
    await putDraftDocument(page.request, pageId!, revision, makeRepeaterTemplateDatasetDocument(token), slug);

    await openBuilder(page, `/ko/admin-builder?pageId=${encodeURIComponent(pageId!)}&datasetRepeaterChildPreview=${token}`);
    await selectLayerNode(page, repeaterId);
    const repeaterNode = page.locator(`[data-node-id="${repeaterId}"]`).first();
    if ((await repeaterNode.getAttribute('data-selected').catch(() => null)) !== 'true') {
      await repeaterNode.click({ position: { x: 10, y: 10 }, force: true });
    }
    await expect(repeaterNode).toHaveAttribute('data-selected', 'true');

    const childTitle = page.locator(`[data-node-id="${titleId}"]`).first();
    const repeaterHud = repeaterNode.locator('[data-builder-repeater-template-hud="true"]').first();
    await expect(repeaterHud).toBeVisible();
    await expect(repeaterHud.locator('[data-builder-repeater-template-status="true"]')).toContainText(
      'Template 3/3 bound'
    );
    await expect(repeaterHud.locator('[data-builder-repeater-template-record="true"]')).toContainText(
      'Record 1 of'
    );
    const fieldSummary = repeaterHud.locator('[data-builder-repeater-template-field-summary="true"]').first();
    await expect(fieldSummary).toBeVisible();
    await expect(fieldSummary.locator('[data-builder-repeater-template-field-chip="true"]')).toHaveCount(3);
    await expect(fieldSummary).toContainText('Image');
    await expect(fieldSummary).toContainText('featuredImage');
    await expect(fieldSummary).toContainText('Text');
    await expect(fieldSummary).toContainText('title');
    await expect(fieldSummary).toContainText('Button');
    await expect(fieldSummary).toContainText('readTime');
    await expectNoVisibleHorizontalOverflow(page, '[data-builder-repeater-template-hud="true"]');
    const childTitleBody = childTitle.locator('[data-builder-node-body="true"]').first();
    const firstTitle = (await childTitleBody.innerText()).trim();
    expect(firstTitle.length).toBeGreaterThan(0);

    await repeaterHud.getByRole('button', { name: 'Preview next dataset record' }).click();
    await expect(repeaterHud.locator('[data-builder-repeater-template-record="true"]')).toContainText(
      'Record 2 of'
    );
    const secondCanvasTitle = (await childTitleBody.innerText()).trim();
    expect(secondCanvasTitle.length).toBeGreaterThan(0);
    expect(secondCanvasTitle).not.toBe(firstTitle);

    const inspector = page.locator('[data-builder-inspector-panel="true"]').first();
    const contentTab = inspector.getByRole('button', { name: 'content' });
    await expect(contentTab).toBeVisible();
    await contentTab.click({ force: true });

    const bindingPanel = inspector.locator('[data-builder-data-binding-panel="true"]').first();
    const previewCard = bindingPanel.locator('[data-builder-data-record-preview="true"]').first();
    const recordInput = bindingPanel.getByLabel('Dataset record number');
    await expect(previewCard).toBeVisible();
    await expect(recordInput).toBeVisible();

    await expect(previewCard.locator('[data-builder-data-record-position="true"]')).toContainText('Record 2 of');
    const secondTitle = (await previewCard.locator('[data-builder-data-preview-primary="true"]').innerText()).trim();
    expect(secondTitle).not.toBe(firstTitle);
    expect(secondTitle).toBe(secondCanvasTitle);
    await expect(childTitle).toContainText(secondTitle);
    await expect(childTitle).not.toContainText(firstTitle);

    const comparison = bindingPanel.locator('[data-builder-repeater-record-comparison="true"]').first();
    await expect(comparison).toBeVisible();
    await expect(comparison).toContainText('Record comparison');
    const comparisonRows = comparison.locator('[data-builder-repeater-record-comparison-row="true"]');
    await expect(comparisonRows).toHaveCount(3);
    await expect(comparison.locator('[data-builder-repeater-record-comparison-current="true"]')).toContainText(secondTitle);
    await expectNoVisibleHorizontalOverflow(page, '[data-builder-repeater-record-comparison="true"]');

    await comparisonRows.first().click();
    await expect(repeaterHud.locator('[data-builder-repeater-template-record="true"]')).toContainText(
      'Record 1 of'
    );
    await expect(childTitle).toContainText(firstTitle);
    await comparisonRows.nth(1).click();
    await expect(repeaterHud.locator('[data-builder-repeater-template-record="true"]')).toContainText(
      'Record 2 of'
    );
    await expect(childTitle).toContainText(secondTitle);

    await expect.poll(async () => {
      const document = await draftDocumentPayload(page, pageId!);
      const nodes = document?.nodes ?? [];
      return {
        parentRecordIndex: nodes.find((node) => node.id === repeaterId)?.dataBinding?.recordIndex,
        childRecordIndex: nodes.find((node) => node.id === titleId)?.dataBinding?.recordIndex,
      };
    }, { timeout: 30_000 }).toEqual({
      parentRecordIndex: 1,
      childRecordIndex: 0,
    });

    await repeaterHud.getByRole('button', { name: 'Select first bound template child' }).click();
    await expect(childTitle).toHaveAttribute('data-selected', 'true');
    const childTemplateBadge = childTitle.locator('[data-builder-repeater-template-child-badge="true"]').first();
    await expect(childTemplateBadge).toBeVisible();
    await expect(childTemplateBadge).toContainText('Template child');
    await expect(childTemplateBadge).toContainText('Record 2 from parent');

    const childBindingPanel = inspector.locator('[data-builder-data-binding-panel="true"]').first();
    await expect(childBindingPanel.locator('[data-builder-data-preview-mode="true"]')).toContainText(
      'inherited from the parent repeater'
    );
    await expect(childBindingPanel.locator('[data-builder-data-record-position="true"]')).toContainText(
      'Record 2 of'
    );
    await expect(childBindingPanel.getByLabel('Dataset record number')).toBeDisabled();

    await selectLayerNode(page, repeaterId);
    const repeaterHudAfterChildEdit = repeaterNode.locator('[data-builder-repeater-template-hud="true"]').first();
    await expect(repeaterHudAfterChildEdit).toBeVisible();
    const addTextSave = page.waitForResponse((response) =>
      response.url().includes(`/api/builder/site/pages/${pageId}/draft`)
      && response.request().method() === 'PUT'
      && response.status() === 200
    );
    await repeaterHudAfterChildEdit.getByRole('button', { name: 'Add bound text to repeater template' }).click();
    await addTextSave;

    const addedText = page.locator('[data-node-id^="text-"][data-selected="true"]').first();
    await expect(addedText).toBeVisible();
    await expect(addedText).toContainText(secondTitle);
    await expect(addedText.locator('[data-builder-repeater-template-child-badge="true"]').first()).toContainText(
      'Record 2 from parent'
    );
    const addedTextId = await addedText.getAttribute('data-node-id');
    expect(addedTextId).toBeTruthy();

    await expect.poll(async () => {
      const document = await draftDocumentPayload(page, pageId!);
      const node = document?.nodes?.find((candidate) => candidate.id === addedTextId);
      return {
        kind: node?.kind,
        parentId: node?.parentId,
        targetId: node?.dataBinding?.targetId,
        textField: node?.dataBinding?.fields?.text,
        recordIndex: node?.dataBinding?.recordIndex,
      };
    }, { timeout: 30_000 }).toEqual({
      kind: 'text',
      parentId: repeaterId,
      targetId: 'home.insights.feed',
      textField: 'title',
      recordIndex: 0,
    });

    await selectLayerNode(page, repeaterId);
    const repeaterHudAfterText = repeaterNode.locator('[data-builder-repeater-template-hud="true"]').first();
    await expect(repeaterHudAfterText).toBeVisible();
    await expect(repeaterHudAfterText.locator('[data-builder-repeater-template-status="true"]')).toContainText(
      'Template 4/4 bound'
    );
    await expectNoVisibleHorizontalOverflow(page, '[data-builder-repeater-template-hud="true"]');

    const addImageSave = page.waitForResponse((response) =>
      response.url().includes(`/api/builder/site/pages/${pageId}/draft`)
      && response.request().method() === 'PUT'
      && response.status() === 200
    );
    await repeaterHudAfterText.getByRole('button', { name: 'Add bound image to repeater template' }).click();
    await addImageSave;

    const addedImage = page.locator('[data-node-id^="image-"][data-selected="true"]').first();
    await expect(addedImage).toBeVisible();
    await expect(addedImage.locator('img').first()).toBeVisible();
    await expect(addedImage.locator('img').first()).toHaveAttribute('alt', secondTitle);
    await expect(addedImage.locator('[data-builder-repeater-template-child-badge="true"]').first()).toContainText(
      'Record 2 from parent'
    );
    const addedImageId = await addedImage.getAttribute('data-node-id');
    expect(addedImageId).toBeTruthy();

    await expect.poll(async () => {
      const document = await draftDocumentPayload(page, pageId!);
      const node = document?.nodes?.find((candidate) => candidate.id === addedImageId);
      return {
        kind: node?.kind,
        parentId: node?.parentId,
        targetId: node?.dataBinding?.targetId,
        srcField: node?.dataBinding?.fields?.src,
        altField: node?.dataBinding?.fields?.alt,
        hrefField: node?.dataBinding?.fields?.href,
        recordIndex: node?.dataBinding?.recordIndex,
      };
    }, { timeout: 30_000 }).toEqual({
      kind: 'image',
      parentId: repeaterId,
      targetId: 'home.insights.feed',
      srcField: 'featuredImage',
      altField: 'title',
      hrefField: 'href',
      recordIndex: 0,
    });

    await selectLayerNode(page, repeaterId);
    const repeaterHudAfterImage = repeaterNode.locator('[data-builder-repeater-template-hud="true"]').first();
    await expect(repeaterHudAfterImage).toBeVisible();
    await expect(repeaterHudAfterImage.locator('[data-builder-repeater-template-status="true"]')).toContainText(
      'Template 5/5 bound'
    );

    const addButtonSave = page.waitForResponse((response) =>
      response.url().includes(`/api/builder/site/pages/${pageId}/draft`)
      && response.request().method() === 'PUT'
      && response.status() === 200
    );
    await repeaterHudAfterImage.getByRole('button', { name: 'Add bound button to repeater template' }).click();
    await addButtonSave;

    const addedButton = page.locator('[data-node-id^="button-"][data-selected="true"]').first();
    await expect(addedButton).toBeVisible();
    const addedButtonText = (await addedButton.innerText()).trim();
    expect(addedButtonText.length).toBeGreaterThan(0);
    expect(addedButtonText).not.toBe('Bound button');
    await expect(addedButton.locator('[data-builder-repeater-template-child-badge="true"]').first()).toContainText(
      'Record 2 from parent'
    );
    const addedButtonId = await addedButton.getAttribute('data-node-id');
    expect(addedButtonId).toBeTruthy();

    await expect.poll(async () => {
      const document = await draftDocumentPayload(page, pageId!);
      const node = document?.nodes?.find((candidate) => candidate.id === addedButtonId);
      return {
        kind: node?.kind,
        parentId: node?.parentId,
        targetId: node?.dataBinding?.targetId,
        labelField: node?.dataBinding?.fields?.label,
        hrefField: node?.dataBinding?.fields?.href,
        recordIndex: node?.dataBinding?.recordIndex,
      };
    }, { timeout: 30_000 }).toEqual({
      kind: 'button',
      parentId: repeaterId,
      targetId: 'home.insights.feed',
      labelField: 'readTime',
      hrefField: 'href',
      recordIndex: 0,
    });

    await selectLayerNode(page, repeaterId);
    await expect(repeaterNode.locator('[data-builder-repeater-template-status="true"]')).toContainText(
      'Template 6/6 bound'
    );
    const finalFieldSummary = repeaterNode.locator('[data-builder-repeater-template-field-summary="true"]').first();
    await expect(finalFieldSummary.locator('[data-builder-repeater-template-field-chip="true"]')).toHaveCount(6);
    await expect(finalFieldSummary).toContainText('featuredImage');
    await expect(finalFieldSummary).toContainText('readTime');
    await expectNoVisibleHorizontalOverflow(page, '[data-builder-repeater-template-hud="true"]');

    const publishResponse = await page.request.post(`/api/builder/site/pages/${pageId}/publish?locale=ko`, {
      headers: mutationHeaders(slug),
    });
    expect(publishResponse.status()).toBe(200);
    const publishPayload = (await publishResponse.json()) as { ok?: boolean; slug?: string; error?: string };
    expect(publishPayload.ok, publishPayload.error).toBe(true);
    const publishedSlug = publishPayload.slug ?? slug;

    await page.goto(`/ko/${publishedSlug}`, { waitUntil: 'domcontentloaded' });
    const publishedRepeater = page.locator(`[data-node-id="${repeaterId}"]`);
    await expect(publishedRepeater).toBeVisible();
    await expect(publishedRepeater.locator('[data-builder-repeater-item="true"]')).toHaveCount(4);
    await expect(publishedRepeater.locator('[data-builder-repeater-item="true"]').first()).toContainText(firstTitle);
  } finally {
    if (pageId) {
      await page.request.delete(`/api/builder/site/pages/${pageId}?locale=ko`, {
        headers: mutationHeaders(slug),
      }).catch(() => undefined);
    }
  }
});

test('/ko/admin-builder and public repeater show empty dataset state without template placeholders', async ({ page }) => {
  test.setTimeout(120_000);

  const token = Date.now().toString(36);
  const slug = `dataset-repeater-empty-${token}`;
  const repeaterId = `dataset-template-repeater-${token}`;
  let pageId: string | null = null;
  let originalHomeBinding: DatasetBindingPayload | null = null;
  await page.setExtraHTTPHeaders(mutationHeaders(slug));

  try {
    const original = await readHomeDatasetTarget(page.request, 'home.insights.feed', slug);
    originalHomeBinding = original.binding;
    await putHomeDatasetTarget(
      page.request,
      'home.insights.feed',
      original.revision,
      {
        ...original.binding,
        filters: [{ fieldId: 'title', operator: 'equals', value: `__no_match_${token}__` }],
        sort: [],
        limit: 4,
      },
      slug,
    );
    await publishBuilderDatasetPage(page.request, 'home', slug);

    const createResponse = await page.request.post('/api/builder/site/pages', {
      data: {
        locale: 'ko',
        slug,
        title: `Dataset repeater empty ${token}`,
      },
      headers: mutationHeaders(slug),
    });
    expect(createResponse.status()).toBe(200);
    const created = (await createResponse.json()) as { success?: boolean; pageId?: string; error?: string };
    expect(created.success, created.error).toBe(true);
    pageId = created.pageId ?? null;
    expect(pageId).toBeTruthy();

    const revision = await currentDraftRevision(page.request, pageId!, slug);
    await putDraftDocument(page.request, pageId!, revision, makeRepeaterTemplateDatasetDocument(token), slug);

    await openBuilder(page, `/ko/admin-builder?pageId=${encodeURIComponent(pageId!)}&datasetRepeaterEmpty=${token}`);
    await selectLayerNode(page, repeaterId);
    const repeaterNode = page.locator(`[data-node-id="${repeaterId}"]`).first();
    const repeaterHud = repeaterNode.locator('[data-builder-repeater-template-hud="true"]').first();
    await expect(repeaterHud).toBeVisible();
    await expect(repeaterHud.locator('[data-builder-repeater-template-record="true"]')).toContainText(
      'No matching records'
    );
    await expect(repeaterHud).toContainText('Check dataset filters and CMS records');

    const inspector = page.locator('[data-builder-inspector-panel="true"]').first();
    await inspector.getByRole('button', { name: 'content' }).click({ force: true });
    await expect(inspector.locator('[data-builder-data-binding-panel="true"]').first()).toContainText(
      'No sample records are available for this dataset preview.'
    );

    const publishResponse = await page.request.post(`/api/builder/site/pages/${pageId}/publish?locale=ko`, {
      headers: mutationHeaders(slug),
    });
    expect(publishResponse.status()).toBe(200);

    await page.goto(`/ko/${slug}`, { waitUntil: 'domcontentloaded' });
    const publishedRepeater = page.locator(`[data-node-id="${repeaterId}"]`);
    await expect(publishedRepeater).toBeVisible();
    await expect(publishedRepeater.locator('[data-builder-repeater-item="true"]')).toHaveCount(0);
    await expect(publishedRepeater.locator('[data-builder-repeater-empty="true"]')).toContainText(
      '표시할 항목이 없습니다.'
    );
    await expect(publishedRepeater).not.toContainText('Template title');
    await expect(publishedRepeater).not.toContainText('Template link');
  } finally {
    if (originalHomeBinding) {
      const current = await readHomeDatasetTarget(page.request, 'home.insights.feed', `${slug}-restore`);
      await putHomeDatasetTarget(
        page.request,
        'home.insights.feed',
        current.revision,
        originalHomeBinding,
        `${slug}-restore`,
      ).catch(() => undefined);
      await publishBuilderDatasetPage(page.request, 'home', `${slug}-restore`).catch(() => undefined);
    }
    if (pageId) {
      await page.request.delete(`/api/builder/site/pages/${pageId}?locale=ko`, {
        headers: mutationHeaders(slug),
      }).catch(() => undefined);
    }
  }
});

test('published repeater child template binds each repeated record', async ({ page }) => {
  test.setTimeout(90_000);

  const token = Date.now().toString(36);
  const slug = `dataset-repeater-template-${token}`;
  let pageId: string | null = null;
  await page.setExtraHTTPHeaders(mutationHeaders(slug));

  try {
    const createResponse = await page.request.post('/api/builder/site/pages', {
      data: {
        locale: 'ko',
        slug,
        title: `Dataset repeater template ${token}`,
      },
      headers: mutationHeaders(slug),
    });
    expect(createResponse.status()).toBe(200);
    const created = (await createResponse.json()) as { success?: boolean; pageId?: string; error?: string };
    expect(created.success, created.error).toBe(true);
    pageId = created.pageId ?? null;
    expect(pageId).toBeTruthy();

    const revision = await currentDraftRevision(page.request, pageId!, slug);
    await putDraftDocument(page.request, pageId!, revision, makeRepeaterTemplateDatasetDocument(token), slug);

    const publishResponse = await page.request.post(`/api/builder/site/pages/${pageId}/publish?locale=ko`, {
      headers: mutationHeaders(slug),
    });
    expect(publishResponse.status()).toBe(200);

    await page.goto(`/ko/${slug}`, { waitUntil: 'domcontentloaded' });

    const repeater = page.locator(`[data-node-id="dataset-template-repeater-${token}"]`);
    await expect(repeater).toBeVisible();
    await expect(repeater.locator('[data-builder-repeater-item="true"]')).toHaveCount(4);
    await expect(repeater.locator(`[data-node-id^="template-title-${token}"]`)).toHaveCount(4);
    await expect(repeater.locator(`[data-node-id^="template-image-${token}"] img`)).toHaveCount(4);
    await expect(repeater.locator('a[href*="/ko/columns/"]')).toHaveCount(4);
    await expect(repeater).toContainText('대만');
    await expect(repeater).not.toContainText('Template title');
    await expect(repeater).not.toContainText('Template link');
  } finally {
    if (pageId) {
      await page.request.delete(`/api/builder/site/pages/${pageId}?locale=ko`, {
        headers: mutationHeaders(slug),
      }).catch(() => undefined);
    }
  }
});

import { expect, test, type APIRequestContext, type Page } from '@playwright/test';
import type { BuilderCmsCollection, BuilderCmsFieldDefinition } from '@/lib/builder/cms-types';
import { readSiteDocument, writeSiteDocument } from '@/lib/builder/site/persistence';

type RedirectRecord = {
  redirectId: string;
  from: string;
  to: string;
  type: number;
  isActive: boolean;
  note?: string;
};

const tinyPng = Buffer.from(
  'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAQAAAC0lEQVR42mP8/x8AAwMCAO+/p9sAAAAASUVORK5CYII=',
  'base64',
);
const shortcutModifier = process.platform === 'darwin' ? 'Meta' : 'Control';

type TestCmsField = {
  fieldId: string;
  key: string;
  label: string;
  type: 'text' | 'rich-text' | 'slug' | 'string-list' | 'email' | 'url' | 'number' | 'date' | 'reference' | 'image';
  localized: boolean;
  repeated: boolean;
  required: boolean;
  unique?: boolean;
  relationCollectionId?: string;
  validation?: {
    min?: number;
    max?: number;
    pattern?: string;
    options?: string[];
  };
};

function mutationHeaders(scope: string): Record<string, string> {
  const safeScope = scope.replace(/[^a-z0-9-]/gi, '-').slice(-48) || 'cms-slug-field';
  return { 'x-forwarded-for': `pw-${safeScope}` };
}

async function listRedirects(
  request: APIRequestContext,
  scope: string,
): Promise<RedirectRecord[]> {
  const response = await request.get('/api/builder/site/redirects?locale=ko', {
    headers: mutationHeaders(scope),
  });
  expect(response.status()).toBe(200);
  const payload = (await response.json()) as { redirects?: RedirectRecord[] };
  return payload.redirects ?? [];
}

async function deleteRedirect(
  request: APIRequestContext,
  redirectId: string,
  scope: string,
): Promise<void> {
  await request.delete(`/api/builder/site/redirects/${encodeURIComponent(redirectId)}?locale=ko`, {
    headers: mutationHeaders(scope),
    failOnStatusCode: false,
  });
}

async function createRedirect(
  request: APIRequestContext,
  scope: string,
  input: {
    from: string;
    to: string;
    type?: 301 | 302 | 307 | 308;
    isActive?: boolean;
    note?: string;
  },
): Promise<RedirectRecord> {
  const response = await request.post('/api/builder/site/redirects?locale=ko', {
    headers: mutationHeaders(scope),
    data: input,
  });
  expect(response.status()).toBe(200);
  const payload = (await response.json()) as { ok?: boolean; redirect?: RedirectRecord; error?: string };
  expect(payload.ok, payload.error).toBe(true);
  expect(payload.redirect?.redirectId).toBeTruthy();
  return payload.redirect!;
}

async function createCollection(
  request: APIRequestContext,
  collectionId: string,
  name: string,
  scope: string,
  fields?: TestCmsField[],
): Promise<void> {
  const now = new Date().toISOString();
  const defaultFields: TestCmsField[] = [
    {
      fieldId: 'field-title',
      key: 'title',
      label: 'Title',
      type: 'text',
      localized: true,
      repeated: false,
      required: true,
    },
    {
      fieldId: 'field-slug',
      key: 'slug',
      label: 'Slug',
      type: 'slug',
      localized: false,
      repeated: false,
      required: true,
      unique: true,
    },
  ];
  const collectionFields = fields ?? defaultFields;
  const siteDoc = await readSiteDocument('default', 'ko');
  const collection: BuilderCmsCollection = {
    collectionId,
    name,
    slug: collectionId,
    description: 'Slug helper regression collection',
    localized: true,
    fields: collectionFields as BuilderCmsFieldDefinition[],
    indexes: collectionFields
      .filter((field) => field.unique)
      .map((field) => ({
        indexId: `idx-${field.key}`,
        name: `${field.label} unique`,
        fields: [{ fieldKey: field.key, direction: 'asc' as const }],
        unique: true,
        createdAt: now,
      })),
    records: [],
    permissions: { read: ['admin'], create: ['admin'], update: ['admin'], delete: ['admin'] },
    createdAt: now,
    updatedAt: now,
  };
  siteDoc.cmsCollections = [...(siteDoc.cmsCollections ?? []).filter((candidate) => candidate.collectionId !== collectionId), collection];
  siteDoc.updatedAt = now;
  await writeSiteDocument(siteDoc);
}

async function createRecord(
  request: APIRequestContext,
  collectionId: string,
  scope: string,
  fields: Record<string, string> = {
    title: 'Existing slug record',
    slug: 'existing-slug',
  },
): Promise<string> {
  const siteDoc = await readSiteDocument('default', 'ko');
  const collections = siteDoc.cmsCollections ?? [];
  const collectionIndex = collections.findIndex((candidate) => candidate.collectionId === collectionId);
  expect(collectionIndex, `Unknown collection ${collectionId}`).toBeGreaterThanOrEqual(0);
  const now = new Date().toISOString();
  const recordId = `record-${scope}-${Date.now().toString(36)}`
    .toLowerCase()
    .replace(/[^a-z0-9-]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 63)
    .replace(/-+$/g, '');
  const record = {
    recordId,
    status: 'draft' as const,
    locale: 'ko' as const,
    fields: { ...fields },
    revisions: [],
    createdAt: now,
    updatedAt: now,
  };
  const nextCollection = {
    ...collections[collectionIndex],
    records: [...(collections[collectionIndex].records ?? []), record],
    updatedAt: now,
  };
  siteDoc.cmsCollections = collections.map((candidate, candidateIndex) => (
    candidateIndex === collectionIndex ? nextCollection : candidate
  ));
  siteDoc.updatedAt = now;
  await writeSiteDocument(siteDoc);
  return recordId;
}

async function uploadAsset(
  request: APIRequestContext,
  filename: string,
  scope: string,
): Promise<{ filename: string; url: string }> {
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
  const payload = (await response.json()) as {
    ok?: boolean;
    error?: string;
    asset?: { filename?: string; url?: string };
  };
  expect(payload.ok, payload.error).toBe(true);
  expect(payload.asset?.filename).toContain(filename.replace(/\.png$/, ''));
  expect(payload.asset?.url).toBeTruthy();
  return payload.asset as { filename: string; url: string };
}

async function deleteAsset(
  request: APIRequestContext,
  filename: string,
  scope: string,
): Promise<void> {
  await request.delete('/api/builder/assets?locale=ko', {
    headers: mutationHeaders(scope),
    data: {
      locale: 'ko',
      filename,
    },
    failOnStatusCode: false,
  });
}

async function deleteCollection(
  request: APIRequestContext,
  collectionId: string,
  scope: string,
): Promise<void> {
  const siteDoc = await readSiteDocument('default', 'ko');
  const now = new Date().toISOString();
  siteDoc.cmsCollections = (siteDoc.cmsCollections ?? []).filter((candidate) => candidate.collectionId !== collectionId);
  siteDoc.updatedAt = now;
  await writeSiteDocument(siteDoc);
}

async function expectElementsWithinNearestCard(page: Page, selector: string): Promise<void> {
  const overflow = await page.locator(selector).evaluateAll((nodes) => (
    nodes.map((node) => {
      const element = node as HTMLElement;
      const rect = element.getBoundingClientRect();
      const style = window.getComputedStyle(element);
      const card = element.closest('.builder-dashboard-page-card, .builder-preview-inspector-card') as HTMLElement | null;
      const cardRect = card?.getBoundingClientRect();
      return {
        text: element.textContent?.trim().replace(/\s+/g, ' ').slice(0, 80) ?? '',
        visible: style.display !== 'none' && style.visibility !== 'hidden' && rect.width > 0 && rect.height > 0,
        left: rect.left,
        right: rect.right,
        cardLeft: cardRect?.left ?? 0,
        cardRight: cardRect?.right ?? window.innerWidth,
      };
    }).filter((entry) => (
      entry.visible && (entry.left < entry.cardLeft - 1 || entry.right > entry.cardRight + 1)
    ))
  ));
  expect(overflow).toEqual([]);
}

test('/ko/admin-builder/cms shows record slug URL impact and duplicate warning', async ({ page, request }, testInfo) => {
  testInfo.setTimeout(120_000);
  const token = Date.now().toString(36);
  const collectionId = `slug-ui-${token}`;
  const collectionName = `CMS Slug ${token}`;
  const scope = `cms-slug-${token}`;
  let inlineAsset: { filename: string; url: string } | null = null;

  try {
    await createCollection(request, collectionId, collectionName, scope, [
      {
        fieldId: 'field-title',
        key: 'title',
        label: 'Title',
        type: 'text',
        localized: true,
        repeated: false,
        required: true,
      },
      {
        fieldId: 'field-slug',
        key: 'slug',
        label: 'Slug',
        type: 'slug',
        localized: false,
        repeated: false,
        required: true,
        unique: true,
      },
      {
        fieldId: 'field-tags',
        key: 'tags',
        label: 'Tags',
        type: 'string-list',
        localized: false,
        repeated: true,
        required: false,
      },
      {
        fieldId: 'field-summary',
        key: 'summary',
        label: 'Summary',
        type: 'rich-text',
        localized: true,
        repeated: false,
        required: false,
      },
      {
        fieldId: 'field-related',
        key: 'related',
        label: 'Related',
        type: 'reference',
        localized: false,
        repeated: false,
        required: false,
        relationCollectionId: collectionId,
      },
      {
        fieldId: 'field-hero-image',
        key: 'heroImage',
        label: 'Hero image',
        type: 'image',
        localized: false,
        repeated: false,
        required: false,
      },
    ]);
    const secondRecordId = await createRecord(page.request, collectionId, `${scope}-record-2`, {
      title: 'Second slug record',
      slug: 'second-slug',
      tags: 'gamma',
      summary: 'Second rich text summary',
      heroImage: `https://example.com/second-${token}.jpg`,
    });
    const firstRecordId = await createRecord(page.request, collectionId, `${scope}-record`, {
      title: 'Existing slug record',
      slug: 'existing-slug',
      tags: 'alpha\nbeta',
      summary: 'Initial rich text summary',
      related: secondRecordId,
      heroImage: `https://example.com/initial-${token}.jpg`,
    });
    inlineAsset = await uploadAsset(request, `inline-${token}.png`, scope);

    await page.goto(`/ko/admin-builder/cms?slugField=${token}`, { waitUntil: 'domcontentloaded' });
    const columnsLifecycleCard = page.locator('[data-cms-source-lifecycle="columns"]');
    await expect(columnsLifecycleCard).toHaveAttribute('data-cms-source-lifecycle-status', 'protected');
    await expect(columnsLifecycleCard).toContainText('Record URL: /ko/columns/{slug}');
    await expect(columnsLifecycleCard).toContainText('Publish-protected');
    await expect(columnsLifecycleCard.getByRole('link', { name: 'Open Columns editor' })).toHaveAttribute(
      'href',
      '/ko/admin-builder/columns',
    );
    await expect(page.locator('[data-cms-source-overview="columns"]')).toContainText('Native editor with draft');
    await expect(page.locator('[data-cms-source-fields="columns"]')).toContainText('featuredImage');
    await expect(page.locator('[data-cms-source-routes="columns"]')).toContainText('/ko/columns/[slug]');
    const columnsRecordPreview = page.locator('[data-cms-source-record-preview="columns"]');
    await expect(columnsRecordPreview).toContainText('Record preview');
    await expect(columnsRecordPreview.locator('[data-cms-source-record-route]').first()).toContainText('/ko/columns/');
    await expect(columnsRecordPreview.locator('[data-cms-source-record-seo]').first()).toContainText('SEO');
    const servicesLifecycleCard = page.locator('[data-cms-source-lifecycle="service-areas"]');
    await expect(servicesLifecycleCard).toHaveAttribute('data-cms-source-lifecycle-status', 'backend-ready');
    await expect(servicesLifecycleCard).toContainText('Record URL: /ko/services/{slug}');
    await expect(servicesLifecycleCard).toContainText('Service source overrides can update live detail slugs');
    await expect(servicesLifecycleCard.getByRole('link', { name: 'Open service source editor' })).toHaveAttribute(
      'href',
      '/ko/admin-builder/services',
    );
    await expect(page.locator('[data-cms-source-overview="service-areas"]')).toContainText('Source editor with live slug overrides');
    await expect(page.locator('[data-cms-source-fields="service-areas"]')).toContainText('keyPoints');
    await expect(page.locator('[data-cms-source-routes="service-areas"]')).toContainText('/ko/services/[slug]');
    const servicesRecordPreview = page.locator('[data-cms-source-record-preview="service-areas"]');
    await expect(servicesRecordPreview.locator('[data-cms-source-record-route]').first()).toContainText('/ko/services/');
    await expect(servicesRecordPreview.locator('[data-cms-source-record-seo]').first()).toContainText('Indexable');
    const lawyersLifecycleCard = page.locator('[data-cms-source-lifecycle="attorney-profiles"]');
    await expect(lawyersLifecycleCard).toHaveAttribute('data-cms-source-lifecycle-status', 'backend-ready');
    await expect(lawyersLifecycleCard).toContainText('Record URL: /ko/lawyers/{slug}');
    await expect(lawyersLifecycleCard).toContainText('Lawyer source overrides can update live profile slugs');
    await expect(lawyersLifecycleCard.getByRole('link', { name: 'Open lawyer source editor' })).toHaveAttribute(
      'href',
      '/ko/admin-builder/lawyers',
    );
    await expect(page.locator('[data-cms-source-overview="attorney-profiles"]')).toContainText('dynamic list/item page bindings');
    await expect(page.locator('[data-cms-source-fields="attorney-profiles"]')).toContainText('image');
    await expect(page.locator('[data-cms-source-routes="attorney-profiles"]')).toContainText('/ko/lawyers/[slug]');
    const lawyersRecordPreview = page.locator('[data-cms-source-record-preview="attorney-profiles"]');
    await expect(lawyersRecordPreview.locator('[data-cms-source-record-route]').first()).toContainText('/ko/lawyers/wei-tseng');
    await expect(lawyersRecordPreview.locator('[data-cms-source-record-seo]').first()).toContainText('Indexable');

    const collectionButton = page.getByRole('button', { name: new RegExp(collectionName) });
    await expect(collectionButton).toBeVisible();
    await collectionButton.click();
    await expect(page.getByRole('heading', { name: collectionName })).toBeVisible();
    const recordGridSummary = page.locator('[data-cms-record-grid-summary]');
    await expect(recordGridSummary).toBeVisible({ timeout: 30_000 });
    await expect(recordGridSummary).toContainText('Record grid');
    await expect(recordGridSummary).toContainText('2 visible');
    await expect(recordGridSummary.locator('[data-cms-record-grid-status-counts]')).toContainText('draft: 2');
    await recordGridSummary.getByRole('button', { name: 'Expanded rows' }).click();
    await expect(page.locator('[data-cms-record-route-preview]').first()).toContainText(
      `/ko/${collectionId}/`,
    );
    const fieldGrids = page.locator('[data-cms-record-field-grid]');
    await expect(fieldGrids).toHaveCount(2);
    const firstGridEditButtons = fieldGrids.first().locator('[data-cms-record-field-edit]');
    const secondGridEditButtons = fieldGrids.nth(1).locator('[data-cms-record-field-edit]');
    await firstGridEditButtons.first().focus();
    await page.keyboard.press('ArrowDown');
    await expect(secondGridEditButtons.first()).toBeFocused();
    await page.keyboard.press('ArrowUp');
    await expect(firstGridEditButtons.first()).toBeFocused();
    const recordFieldGrid = page.locator('[data-cms-record-field-grid]').filter({ hasText: 'Existing slug record' }).first();
    await expect(recordFieldGrid).toContainText('Title');
    await expect(recordFieldGrid).toContainText('Existing slug record');
    await expect(recordFieldGrid).toContainText('Slug');
    await expect(recordFieldGrid).toContainText('existing-slug');
    const inlineSlugValue = `inline-slug-${token}`;
    const inlineEditButtons = recordFieldGrid.locator('[data-cms-record-field-inline-edit]');
    await inlineEditButtons.nth(1).click();
    const inlineSlugEditor = recordFieldGrid.locator('[data-cms-record-field-inline-editor]').first();
    await expect(inlineSlugEditor).toBeVisible();
    await inlineSlugEditor.locator('[data-cms-record-field-inline-input]').fill(inlineSlugValue);
    await expect(inlineSlugEditor.locator('[data-cms-record-field-inline-url-preview]')).toContainText(
      `/ko/${collectionId}/${inlineSlugValue}`,
    );
    const inlineRedirectReview = inlineSlugEditor.locator('[data-cms-record-field-inline-redirect-review]');
    await expect(inlineRedirectReview).toContainText('Redirect review');
    await expect(inlineRedirectReview).toContainText('301 redirect on save');
    await expect(inlineRedirectReview).toContainText('Saving this slug will create the redirect automatically.');
    await expect(inlineRedirectReview).toContainText(`Current: /ko/${collectionId}/existing-slug`);
    await expect(inlineRedirectReview).toContainText(`New: /ko/${collectionId}/${inlineSlugValue}`);
    const secondRecordFieldGrid = page.locator('[data-cms-record-field-grid]').filter({ hasText: 'Second slug record' }).first();
    await secondRecordFieldGrid.locator('[data-cms-record-field-inline-edit]').nth(1).click();
    const duplicateInlineEditor = secondRecordFieldGrid.locator('[data-cms-record-field-inline-editor]').first();
    await duplicateInlineEditor.locator('[data-cms-record-field-inline-input]').fill('existing slug');
    await expect(duplicateInlineEditor.locator('[data-cms-record-field-inline-url-preview]')).toContainText(
      `/ko/${collectionId}/existing-slug`,
    );
    await expect(duplicateInlineEditor.locator('[data-cms-record-field-inline-redirect-review]')).toContainText(
      `Current: /ko/${collectionId}/second-slug`,
    );
    await expect(duplicateInlineEditor.locator('[data-cms-record-field-inline-save]')).toBeDisabled();
    await duplicateInlineEditor.getByRole('button', { name: 'Cancel' }).click();
    const tagsCell = recordFieldGrid.locator('[data-cms-record-field-cell]').filter({ hasText: 'Tags' }).first();
    await expect(tagsCell.locator('[data-cms-record-field-value]')).toContainText('alpha');
    await expect(tagsCell.locator('[data-cms-record-field-value]')).toContainText('beta');
    await tagsCell.locator('[data-cms-record-field-inline-edit]').click();
    const tagsInlineEditor = tagsCell.locator('[data-cms-record-field-inline-editor]').first();
    await expect(tagsInlineEditor.locator('[data-cms-record-field-inline-input]')).toBeVisible();
    await tagsInlineEditor.locator('[data-cms-record-field-inline-input]').fill(`alpha\nbeta\nupdated-${token}`);
    await tagsInlineEditor.getByRole('button', { name: 'Cancel' }).click();
    await expect(tagsCell.locator('[data-cms-record-field-value]')).toContainText('alpha');
    await expect(tagsCell.locator('[data-cms-record-field-value]')).toContainText('beta');
    const summaryCell = recordFieldGrid.locator('[data-cms-record-field-cell]').filter({ hasText: 'Summary' }).first();
    await expect(summaryCell.locator('[data-cms-record-field-value]')).toContainText('Initial rich text summary');
    await summaryCell.locator('[data-cms-record-field-inline-edit]').click();
    const summaryInlineEditor = summaryCell.locator('[data-cms-record-field-inline-editor]').first();
    await expect(summaryInlineEditor.locator('[data-cms-record-field-inline-input]')).toBeVisible();
    await expect(summaryInlineEditor.locator('[data-cms-record-field-rich-text-toolbar]')).toBeVisible();
    const summaryInlineInput = summaryInlineEditor.locator('[data-cms-record-field-inline-input]');
    await summaryInlineInput.fill(`Updated rich text ${token}`);
    await summaryInlineInput.evaluate((node) => {
      const input = node as HTMLTextAreaElement;
      input.focus();
      input.setSelectionRange(8, 17);
    });
    await summaryInlineEditor.locator('[data-cms-record-field-rich-text-format="strong"]').click();
    await expect(summaryInlineInput).toHaveValue(
      `Updated <strong>rich text</strong> ${token}`,
    );
    await summaryInlineInput.evaluate((node) => {
      const input = node as HTMLTextAreaElement;
      input.focus();
      input.setSelectionRange(0, 7);
    });
    await summaryInlineEditor.locator('[data-cms-record-field-rich-text-format="em"]').click();
    await expect(summaryInlineInput).toHaveValue(
      `<em>Updated</em> <strong>rich text</strong> ${token}`,
    );
    await summaryInlineInput.evaluate((node) => {
      const input = node as HTMLTextAreaElement;
      input.focus();
      input.setSelectionRange(4, 11);
    });
    await summaryInlineEditor.locator('[data-cms-record-field-rich-text-format="u"]').click();
    await expect(summaryInlineInput).toHaveValue(
      `<em><u>Updated</u></em> <strong>rich text</strong> ${token}`,
    );
    await summaryInlineInput.evaluate((node) => {
      const input = node as HTMLTextAreaElement;
      const start = input.value.indexOf('rich text');
      input.focus();
      input.setSelectionRange(start, start + 'rich text'.length);
    });
    await summaryInlineEditor.locator('[data-cms-record-field-rich-text-format="s"]').click();
    await expect(summaryInlineInput).toHaveValue(
      `<em><u>Updated</u></em> <strong><s>rich text</s></strong> ${token}`,
    );
    await summaryInlineInput.evaluate((node) => {
      const input = node as HTMLTextAreaElement;
      const start = input.value.indexOf('Updated');
      input.focus();
      input.setSelectionRange(start, start + 'Updated'.length);
    });
    page.once('dialog', (dialog) => dialog.accept('https://example.com/updated'));
    await summaryInlineEditor.locator('[data-cms-record-field-rich-text-format="link"]').dispatchEvent('click');
    await expect(summaryInlineInput).toHaveValue(
      `<em><u><a href="https://example.com/updated">Updated</a></u></em> <strong><s>rich text</s></strong> ${token}`,
    );
    await summaryInlineInput.evaluate((node) => {
      const input = node as HTMLTextAreaElement;
      const start = input.value.indexOf('Updated');
      input.focus();
      input.setSelectionRange(start, start + 'Updated'.length);
    });
    page.once('dialog', (dialog) => dialog.accept('https://example.com/updated-2'));
    await summaryInlineEditor.locator('[data-cms-record-field-rich-text-format="link"]').click();
    await expect(summaryInlineInput).toHaveValue(
      `<em><u><a href="https://example.com/updated-2">Updated</a></u></em> <strong><s>rich text</s></strong> ${token}`,
    );
    await summaryInlineInput.evaluate((node) => {
      const input = node as HTMLTextAreaElement;
      const start = input.value.indexOf('rich text');
      input.focus();
      input.setSelectionRange(start, start + 'rich text'.length);
    });
    await summaryInlineEditor.locator('[data-cms-record-field-rich-text-format="code"]').click();
    await expect(summaryInlineEditor.locator('[data-cms-record-field-rich-text-format="code"]')).toHaveAttribute('aria-pressed', 'true');
    await expect(summaryInlineInput).toHaveValue(
      `<em><u><a href="https://example.com/updated-2">Updated</a></u></em> <strong><s><code>rich text</code></s></strong> ${token}`,
    );
    await summaryInlineInput.evaluate((node) => {
      const input = node as HTMLTextAreaElement;
      input.focus();
      input.setSelectionRange(0, input.value.length);
    });
    await summaryInlineEditor.locator('[data-cms-record-field-rich-text-format="blockquote"]').click();
    await expect(summaryInlineEditor.locator('[data-cms-record-field-rich-text-format="blockquote"]')).toHaveAttribute('aria-pressed', 'true');
    await expect(summaryInlineInput).toHaveValue(
      `<blockquote><em><u><a href="https://example.com/updated-2">Updated</a></u></em> <strong><s><code>rich text</code></s></strong> ${token}</blockquote>`,
    );
    await summaryInlineInput.evaluate((node) => {
      const input = node as HTMLTextAreaElement;
      const start = input.value.indexOf('Updated');
      input.focus();
      input.setSelectionRange(start, start + 'Updated'.length);
    });
    page.once('dialog', (dialog) => dialog.accept('https://example.com/updated-3'));
    await summaryInlineInput.press(`${shortcutModifier}+K`);
    await expect(summaryInlineEditor.locator('[data-cms-record-field-rich-text-format="link"]')).toHaveAttribute('aria-pressed', 'true');
    await expect(summaryInlineInput).toHaveValue(
      `<blockquote><em><u><a href="https://example.com/updated-3">Updated</a></u></em> <strong><s><code>rich text</code></s></strong> ${token}</blockquote>`,
    );
    await summaryInlineInput.evaluate((node) => {
      const input = node as HTMLTextAreaElement;
      input.focus();
      input.setSelectionRange(0, input.value.length);
    });
    await summaryInlineEditor.locator('[data-cms-record-field-rich-text-format="clear"]').click();
    await expect(summaryInlineEditor.locator('[data-cms-record-field-rich-text-format="clear"]')).toHaveAttribute('aria-pressed', 'true');
    await expect(summaryInlineInput).toHaveValue(`Updated rich text ${token}`);
    await summaryInlineInput.fill(`Heading text ${token}`);
    await expect(summaryInlineInput).toHaveValue(`Heading text ${token}`);
    await summaryInlineInput.evaluate((node) => {
      const input = node as HTMLTextAreaElement;
      input.focus();
      input.setSelectionRange(0, input.value.length);
    });
    await summaryInlineEditor.locator('[data-cms-record-field-rich-text-format="h1"]').click();
    await expect(summaryInlineEditor.locator('[data-cms-record-field-rich-text-format="h1"]')).toHaveAttribute('aria-pressed', 'true');
    await expect(summaryInlineInput).toHaveValue(`<h1>Heading text ${token}</h1>`);
    await summaryInlineEditor.locator('[data-cms-record-field-rich-text-format="h1"]').click();
    await expect(summaryInlineInput).toHaveValue(`Heading text ${token}`);
    await summaryInlineInput.evaluate((node) => {
      const input = node as HTMLTextAreaElement;
      input.focus();
      input.setSelectionRange(0, input.value.length);
    });
    await summaryInlineEditor.locator('[data-cms-record-field-rich-text-format="h2"]').click();
    await expect(summaryInlineEditor.locator('[data-cms-record-field-rich-text-format="h2"]')).toHaveAttribute('aria-pressed', 'true');
    await expect(summaryInlineInput).toHaveValue(`<h2>Heading text ${token}</h2>`);
    await summaryInlineEditor.locator('[data-cms-record-field-rich-text-format="h2"]').click();
    await expect(summaryInlineInput).toHaveValue(`Heading text ${token}`);
    await summaryInlineInput.evaluate((node) => {
      const input = node as HTMLTextAreaElement;
      input.focus();
      input.setSelectionRange(0, input.value.length);
    });
    await summaryInlineInput.press(`${shortcutModifier}+3`);
    await expect(summaryInlineEditor.locator('[data-cms-record-field-rich-text-format="h3"]')).toHaveAttribute('aria-pressed', 'true');
    await expect(summaryInlineInput).toHaveValue(`<h3>Heading text ${token}</h3>`);
    await summaryInlineEditor.locator('[data-cms-record-field-rich-text-format="clear"]').click();
    await expect(summaryInlineInput).toHaveValue(`Heading text ${token}`);
    await summaryInlineEditor.locator('[data-cms-record-field-rich-text-format="h4"]').click();
    await expect(summaryInlineInput).toHaveValue(`<h4>Heading text ${token}</h4>`);
    await summaryInlineEditor.locator('[data-cms-record-field-rich-text-format="h4"]').click();
    await expect(summaryInlineInput).toHaveValue(`Heading text ${token}`);
    await summaryInlineEditor.getByRole('button', { name: 'Cancel' }).click();
    await summaryCell.locator('[data-cms-record-field-inline-edit]').click();
    await expect(summaryInlineInput).toBeVisible();
    await summaryInlineInput.fill(`Heading text ${token}`);
    await expect(summaryInlineInput).toHaveValue(`Heading text ${token}`);
    await summaryInlineInput.evaluate((node) => {
      const input = node as HTMLTextAreaElement;
      input.focus();
      input.setSelectionRange(0, input.value.length);
    });
    await summaryInlineEditor.locator('[data-cms-record-field-rich-text-format="h5"]').click();
    await expect(summaryInlineInput).toHaveValue(`<h5>Heading text ${token}</h5>`);
    await summaryInlineEditor.locator('[data-cms-record-field-rich-text-format="h5"]').click();
    await expect(summaryInlineInput).toHaveValue(`Heading text ${token}`);
    await summaryInlineEditor.getByRole('button', { name: 'Cancel' }).click();
    await summaryCell.locator('[data-cms-record-field-inline-edit]').click();
    await expect(summaryInlineInput).toBeVisible();
    await summaryInlineInput.fill(`Heading text ${token}`);
    await expect(summaryInlineInput).toHaveValue(`Heading text ${token}`);
    await summaryInlineInput.evaluate((node) => {
      const input = node as HTMLTextAreaElement;
      input.focus();
      input.setSelectionRange(0, input.value.length);
    });
    await summaryInlineEditor.locator('[data-cms-record-field-rich-text-format="h6"]').click();
    await expect(summaryInlineInput).toHaveValue(`<h6>Heading text ${token}</h6>`);
    await summaryInlineEditor.locator('[data-cms-record-field-rich-text-format="h6"]').click();
    await expect(summaryInlineInput).toHaveValue(`Heading text ${token}`);
    await summaryInlineInput.press(`${shortcutModifier}+4`);
    await expect(summaryInlineInput).toHaveValue(`<h4>Heading text ${token}</h4>`);
    await summaryInlineInput.press(`${shortcutModifier}+5`);
    await expect(summaryInlineInput).toHaveValue(`<h5>Heading text ${token}</h5>`);
    await summaryInlineInput.press(`${shortcutModifier}+6`);
    await expect(summaryInlineInput).toHaveValue(`<h6>Heading text ${token}</h6>`);
    await summaryInlineEditor.locator('[data-cms-record-field-inline-save]').click();
    await expect(summaryInlineEditor.locator('[data-cms-record-field-inline-editor]')).toHaveCount(0, { timeout: 30_000 });
    await summaryCell.locator('[data-cms-record-field-inline-edit]').click();
    await expect(summaryInlineEditor.locator('[data-cms-record-field-inline-input]')).toBeVisible();
    await summaryInlineInput.fill('First line\nSecond line');
    await summaryInlineInput.evaluate((node) => {
      const input = node as HTMLTextAreaElement;
      input.focus();
      input.setSelectionRange(0, input.value.length);
    });
    await summaryInlineEditor.locator('[data-cms-record-field-rich-text-format="bullet-list"]').click();
    await expect(summaryInlineEditor.locator('[data-cms-record-field-rich-text-format="bullet-list"]')).toHaveAttribute('aria-pressed', 'true');
    await expect(summaryInlineInput).toHaveValue('<ul><li>First line</li><li>Second line</li></ul>');
    await summaryInlineEditor.locator('[data-cms-record-field-rich-text-format="bullet-list"]').click();
    await expect(summaryInlineInput).toHaveValue('First line\nSecond line');
    await summaryInlineInput.evaluate((node) => {
      const input = node as HTMLTextAreaElement;
      input.focus();
      input.setSelectionRange(0, input.value.length);
    });
    await summaryInlineEditor.locator('[data-cms-record-field-rich-text-format="ordered-list"]').click();
    await expect(summaryInlineEditor.locator('[data-cms-record-field-rich-text-format="ordered-list"]')).toHaveAttribute('aria-pressed', 'true');
    await expect(summaryInlineInput).toHaveValue('<ol><li>First line</li><li>Second line</li></ol>');
    await summaryInlineEditor.locator('[data-cms-record-field-rich-text-format="ordered-list"]').click();
    await expect(summaryInlineInput).toHaveValue('First line\nSecond line');
    await summaryInlineInput.evaluate((node) => {
      const input = node as HTMLTextAreaElement;
      input.focus();
      input.setSelectionRange(0, input.value.length);
    });
    await summaryInlineInput.press(`${shortcutModifier}+Shift+8`);
    await expect(summaryInlineInput).toHaveValue('<ul><li>First line</li><li>Second line</li></ul>');
    await summaryInlineInput.press(`${shortcutModifier}+Shift+8`);
    await expect(summaryInlineInput).toHaveValue('First line\nSecond line');
    await summaryInlineInput.evaluate((node) => {
      const input = node as HTMLTextAreaElement;
      input.focus();
      input.setSelectionRange(0, input.value.length);
    });
    await summaryInlineInput.press(`${shortcutModifier}+Shift+7`);
    await expect(summaryInlineInput).toHaveValue('<ol><li>First line</li><li>Second line</li></ol>');
    await summaryInlineEditor.getByRole('button', { name: 'Cancel' }).click();
    const relatedCell = recordFieldGrid.locator('[data-cms-record-field-cell]').filter({ hasText: 'Related' }).first();
    await expect(relatedCell.locator('[data-cms-record-field-value]')).toContainText(secondRecordId);
    await relatedCell.locator('[data-cms-record-field-inline-edit]').click();
    const relatedInlineEditor = relatedCell.locator('[data-cms-record-field-inline-editor]').first();
    await expect(relatedInlineEditor.locator('[data-cms-record-field-inline-input]')).toBeVisible();
    await relatedInlineEditor.locator('[data-cms-record-field-inline-input]').fill(`missing-${token}`);
    await relatedInlineEditor.locator('[data-cms-record-field-inline-input]').fill(firstRecordId);
    await relatedInlineEditor.locator('[data-cms-record-field-inline-save]').click();
    const cellEditButtons = recordFieldGrid.locator('[data-cms-record-field-edit]');
    await cellEditButtons.first().focus();
    await page.keyboard.press('ArrowRight');
    await expect(cellEditButtons.nth(1)).toBeFocused();
    await page.keyboard.press('Home');
    await expect(cellEditButtons.first()).toBeFocused();
    await page.keyboard.press('End');
    await expect(cellEditButtons.nth(5)).toBeFocused();
    await page.keyboard.press('ArrowLeft');
    await expect(cellEditButtons.nth(4)).toBeFocused();
    await page.keyboard.press('ArrowLeft');
    await expect(cellEditButtons.nth(3)).toBeFocused();
    await page.keyboard.press('ArrowLeft');
    await expect(cellEditButtons.nth(2)).toBeFocused();
    await page.keyboard.press('ArrowLeft');
    await expect(cellEditButtons.nth(1)).toBeFocused();
    await page.keyboard.press('ArrowLeft');
    await expect(cellEditButtons.first()).toBeFocused();
    await cellEditButtons.first().click();
    await expect(page.getByRole('heading', { name: /Edit/ })).toBeVisible();
    await expect(page.locator('[data-cms-record-field-input="title"]')).toBeFocused();
    await page.locator('[data-cms-record-field-input="title"]').fill(`Edited cell title ${token}`);
    await page.getByRole('button', { name: 'Cancel edit' }).click();
    await expect(page.getByRole('heading', { name: collectionName })).toBeVisible({ timeout: 30_000 });
    await page.locator(`[data-cms-record-field-grid="${firstRecordId}"] [data-cms-record-field-edit]`).first().click();
    await expect(page.getByRole('heading', { name: /Edit/ })).toBeVisible();
    await expect(page.locator('[data-cms-record-field-input="title"]')).toHaveValue('Existing slug record');
    await page.getByRole('button', { name: 'Pick record' }).click();
    const referencePicker = page.getByRole('dialog', { name: 'Record picker' });
    await expect(referencePicker).toBeVisible();
    await expect(referencePicker.locator(`[data-cms-reference-picker-live-route="${secondRecordId}"]`)).toHaveAttribute(
      'href',
      new RegExp(`/${collectionId}/second-slug$`),
    );
    await expect(referencePicker.locator(`[data-cms-reference-picker-record-link="${secondRecordId}"]`)).toHaveAttribute(
      'href',
      new RegExp(`/admin-builder/cms\\?collectionId=${collectionId}&recordId=${secondRecordId}`),
    );
    const referencePickerSearch = referencePicker.getByRole('searchbox', { name: 'Search records' });
    const referencePickerRows = referencePicker.locator('[data-cms-reference-picker-row]');
    const referencePickerRowIds = await referencePickerRows.evaluateAll((nodes) => nodes
      .map((node) => node.getAttribute('data-cms-reference-picker-row'))
      .filter((value): value is string => Boolean(value)));
    const initialActiveRecordId = await referencePicker.locator(`[data-cms-reference-picker-row-active="true"]`).first()
      .getAttribute('data-cms-reference-picker-row');
    expect(initialActiveRecordId).toBeTruthy();
    const initialActiveIndex = referencePickerRowIds.indexOf(initialActiveRecordId ?? '');
    expect(initialActiveIndex).toBeGreaterThanOrEqual(0);
    const arrowKey = initialActiveIndex < referencePickerRowIds.length - 1 ? 'ArrowDown' : 'ArrowUp';
    const expectedKeyboardRecordId = referencePickerRowIds[
      initialActiveIndex + (arrowKey === 'ArrowDown' ? 1 : -1)
    ];
    expect(expectedKeyboardRecordId).toBeTruthy();
    await referencePickerSearch.press(arrowKey);
    await expect(referencePicker.locator(`[data-cms-reference-picker-row-active="true"]`)).toHaveAttribute(
      'data-cms-reference-picker-row',
      expectedKeyboardRecordId,
    );
    await referencePickerSearch.press('Enter');
    await expect(page.locator('[data-cms-record-field-input="related"]').first()).toHaveValue(
      expectedKeyboardRecordId,
    );
    await expect(referencePicker).toBeHidden();
    await page.getByRole('button', { name: 'Pick record' }).click();
    await expect(referencePicker).toBeVisible();
    await expect(referencePicker.locator(`[data-cms-reference-picker-selected="${expectedKeyboardRecordId}"]`)).toBeVisible();
    await referencePickerSearch.fill('second-slug');
    await expect(referencePicker.locator('[data-cms-reference-picker-count]')).toContainText('Showing 1 of 2 records');
    await referencePickerSearch.fill('not-a-match');
    await expect(referencePicker.getByText('No matching records found.')).toBeVisible();
    await referencePickerSearch.fill('second-slug');
    await referencePickerSearch.press('Enter');
    await expect(page.locator('[data-cms-record-field-input="related"]').first()).toHaveValue(secondRecordId);
    await expect(referencePicker).toBeHidden();
    await page.getByRole('button', { name: 'Pick record' }).click();
    await expect(referencePicker).toBeVisible();
    await expect(referencePicker.locator(`[data-cms-reference-picker-selected="${secondRecordId}"]`)).toBeVisible();
    await referencePicker.locator(`[data-cms-reference-picker-use-record="${secondRecordId}"]`).click();
    await expect(page.locator('[data-cms-record-field-input="related"]').first()).toHaveValue(secondRecordId);
    await page.getByRole('button', { name: 'Pick record' }).click();
    await expect(referencePicker).toBeVisible();
    await expect(referencePicker.locator(`[data-cms-reference-picker-selected="${secondRecordId}"]`)).toBeVisible();
    await referencePicker.getByRole('button', { name: 'Clear selection' }).click();
    await expect(page.locator('[data-cms-record-field-input="related"]').first()).toHaveValue('');
    await page.getByRole('button', { name: 'Pick record' }).click();
    await expect(referencePicker).toBeVisible();
    await referencePicker.locator(`[data-cms-reference-picker-use-record="${secondRecordId}"]`).click();
    await expect(page.locator('[data-cms-record-field-input="related"]').first()).toHaveValue(secondRecordId);
    await page.getByRole('button', { name: 'Save record' }).click();

    const conflictRedirectNote = `Existing CMS redirect conflict ${token}`;
    const conflictRedirectTo = `/ko/contact?existing=${token}`;
    const conflictRedirect = await createRedirect(page.request, `${scope}-redirect`, {
      from: `/ko/${collectionId}/existing-slug`,
      to: conflictRedirectTo,
      type: 301,
      isActive: true,
      note: conflictRedirectNote,
    });

    const conflictRecordGrid = page.locator(`[data-cms-record-field-grid="${firstRecordId}"]`).first();
    await conflictRecordGrid.locator('[data-cms-record-field-inline-edit]').nth(1).click();
    const conflictInlineSlugEditor = conflictRecordGrid.locator('[data-cms-record-field-inline-editor]').first();
    await expect(conflictInlineSlugEditor).toBeVisible();
    await conflictInlineSlugEditor.locator('[data-cms-record-field-inline-input]').fill(`updated-slug-${token}`);
    await expect(conflictInlineSlugEditor.locator('[data-cms-record-field-inline-redirect-review]')).toContainText(
      `Current: /ko/${collectionId}/existing-slug`,
    );
    await expect(conflictInlineSlugEditor.locator('[data-cms-record-field-inline-redirect-review]')).toContainText(
      `New: /ko/${collectionId}/updated-slug-${token}`,
    );
    await expect(conflictInlineSlugEditor.locator('[data-cms-record-field-inline-save]')).toBeEnabled();
    await conflictInlineSlugEditor.locator('[data-cms-record-field-inline-save]').click();
    await expect(conflictRecordGrid.locator(`[data-cms-record-field-cell="${firstRecordId}:slug"]`))
      .toContainText(`updated-slug-${token}`);

    const redirects = await listRedirects(page.request, `${scope}-list-conflict`);
    expect(redirects).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          from: `/ko/${collectionId}/existing-slug`,
          to: conflictRedirectTo,
          note: conflictRedirectNote,
        }),
      ]),
    );
    expect(redirects.find((redirect) => redirect.from === `/ko/${collectionId}/existing-slug` && redirect.to === `/ko/${collectionId}/updated-slug-${token}`)).toBeFalsy();
    await deleteRedirect(page.request, conflictRedirect.redirectId, `${scope}-cleanup`);
  } finally {
    if (inlineAsset) {
      await deleteAsset(request, inlineAsset.filename, `${scope}-cleanup`);
    }
    await deleteCollection(page.request, collectionId, `${scope}-cleanup`);
    const redirects = await listRedirects(page.request, `${scope}-cleanup`).catch(() => []);
    await Promise.all(
      redirects
        .filter((redirect) =>
          redirect.note?.includes(token) ||
          redirect.from.includes(token) ||
          redirect.to.includes(token)
        )
        .map((redirect) => deleteRedirect(page.request, redirect.redirectId, `${scope}-cleanup`)),
    );
  }
});

test('/ko/admin-builder/cms can deep-link directly to a record editor', async ({ page }, testInfo) => {
  testInfo.setTimeout(120_000);
  const token = Date.now().toString(36);
  const collectionId = `cms-deeplink-${token}`;
  const collectionName = `CMS Deeplink ${token}`;
  const scope = `cms-deeplink-${token}`;

  try {
    await createCollection(page.request, collectionId, collectionName, scope, [
      {
        fieldId: 'field-title',
        key: 'title',
        label: 'Title',
        type: 'text',
        localized: true,
        repeated: false,
        required: true,
      },
      {
        fieldId: 'field-slug',
        key: 'slug',
        label: 'Slug',
        type: 'slug',
        localized: false,
        repeated: false,
        required: true,
        unique: true,
      },
      {
        fieldId: 'field-summary',
        key: 'summary',
        label: 'Summary',
        type: 'rich-text',
        localized: true,
        repeated: false,
        required: false,
      },
    ]);
    const recordId = await createRecord(page.request, collectionId, `${scope}-record`, {
      title: 'Deep linked record',
      slug: 'deep-linked-record',
      summary: 'Deep link summary',
    });

    await page.goto(`/ko/admin-builder/cms?collectionId=${collectionId}&recordId=${recordId}`, {
      waitUntil: 'domcontentloaded',
    });

    await expect(page).toHaveURL(new RegExp(`collectionId=${collectionId}.*recordId=${recordId}`));
    await expect(page.getByRole('heading', { name: collectionName })).toBeVisible({ timeout: 30_000 });
    await expect(page.getByRole('heading', { name: new RegExp(`Edit ${recordId}`) })).toBeVisible({ timeout: 30_000 });

    await expect(page.locator('[data-cms-record-field-input="title"]').first()).toHaveValue('Deep linked record', { timeout: 60_000 });
    await expect(page.locator('[data-cms-record-field-input="slug"]').first()).toHaveValue('deep-linked-record', { timeout: 60_000 });

    await page.getByRole('button', { name: 'Cancel edit' }).click();
    await expect(page).toHaveURL(new RegExp(`collectionId=${collectionId}(?:$|&)`));
    await expect(page.getByRole('heading', { name: 'New record' })).toBeVisible();
  } finally {
    await deleteCollection(page.request, collectionId, `${scope}-cleanup`);
  }
});

test('/ko/admin-builder/cms surfaces redirect warnings when slug rename collides with an existing redirect', async ({ page, request }, testInfo) => {
  testInfo.setTimeout(120_000);
  const token = Date.now().toString(36);
  const collectionId = `slug-conflict-${token}`;
  const collectionName = `CMS Slug Conflict ${token}`;
  const scope = `cms-slug-conflict-${token}`;
  const conflictRedirectNote = `Existing CMS redirect conflict ${token}`;
  const conflictRedirectTo = `/ko/contact?existing=${token}`;
  const targetSlug = `updated-slug-${token}`;
  let conflictRedirectId: string | null = null;

  try {
    await createCollection(page.request, collectionId, collectionName, scope, [
      {
        fieldId: 'field-title',
        key: 'title',
        label: 'Title',
        type: 'text',
        localized: true,
        repeated: false,
        required: true,
      },
      {
        fieldId: 'field-slug',
        key: 'slug',
        label: 'Slug',
        type: 'slug',
        localized: false,
        repeated: false,
        required: true,
        unique: true,
      },
    ]);
    const firstRecordId = await createRecord(request, collectionId, `${scope}-record`, {
      title: 'Existing slug record',
      slug: 'existing-slug',
    });
    const createdConflict = await createRedirect(request, `${scope}-redirect`, {
      from: `/ko/${collectionId}/existing-slug`,
      to: conflictRedirectTo,
      type: 301,
      isActive: true,
      note: conflictRedirectNote,
    });
    conflictRedirectId = createdConflict.redirectId;

    await page.goto(`/ko/admin-builder/cms?slugField=${token}`, { waitUntil: 'domcontentloaded' });
    const collectionButton = page.getByRole('button', { name: new RegExp(collectionName) });
    await expect(collectionButton).toBeVisible();
    await collectionButton.click();
    await expect(page.getByRole('heading', { name: collectionName })).toBeVisible();
    const recordGridSummary = page.locator('[data-cms-record-grid-summary]');
    await expect(recordGridSummary).toBeVisible({ timeout: 30_000 });
    await recordGridSummary.getByRole('button', { name: 'Expanded rows' }).click();
    const recordFieldGrid = page.locator(`[data-cms-record-field-grid="${firstRecordId}"]`).first();
    const inlineSlugCell = recordFieldGrid.locator(`[data-cms-record-field-cell="${firstRecordId}:slug"]`);
    await inlineSlugCell.locator('[data-cms-record-field-inline-edit]').click();
    const inlineSlugEditor = inlineSlugCell.locator('[data-cms-record-field-inline-editor]').first();
    await expect(inlineSlugEditor).toBeVisible();
    await inlineSlugEditor.locator('[data-cms-record-field-inline-input]').fill(targetSlug);
    await expect(inlineSlugEditor.locator('[data-cms-record-field-inline-redirect-review]')).toContainText(
      `Current: /ko/${collectionId}/existing-slug`,
    );
    await expect(inlineSlugEditor.locator('[data-cms-record-field-inline-redirect-review]')).toContainText(
      `New: /ko/${collectionId}/${targetSlug}`,
    );

    await inlineSlugEditor.locator('[data-cms-record-field-inline-save]').click();
    await expect(recordFieldGrid.locator(`[data-cms-record-field-cell="${firstRecordId}:slug"]`))
      .toContainText(targetSlug, { timeout: 30_000 });

    const redirects = await listRedirects(request, `${scope}-list`);
    expect(redirects).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          from: `/ko/${collectionId}/existing-slug`,
          to: conflictRedirectTo,
          note: conflictRedirectNote,
        }),
      ]),
    );
    expect(redirects.find((redirect) => redirect.from === `/ko/${collectionId}/existing-slug` && redirect.to === `/ko/${collectionId}/${targetSlug}`)).toBeFalsy();
  } finally {
    await deleteCollection(request, collectionId, `${scope}-cleanup`);
    const redirects = await listRedirects(request, `${scope}-cleanup`).catch(() => []);
    await Promise.all(
      redirects
        .filter((redirect) =>
          redirect.note?.includes(token) ||
          redirect.from.includes(token) ||
          redirect.to.includes(token)
        )
        .map((redirect) => deleteRedirect(request, redirect.redirectId, `${scope}-cleanup`)),
    );
    if (conflictRedirectId) {
      await deleteRedirect(request, conflictRedirectId, `${scope}-cleanup`).catch(() => undefined);
    }
  }
});

test('/ko/admin-builder/cms saves the open record editor with Cmd/Ctrl+S', async ({ page }) => {
  const token = Date.now().toString(36);
  const collectionId = `cms-save-shortcut-${token}`;
  const collectionName = `CMS Save Shortcut ${token}`;
  const scope = `cms-save-shortcut-${token}`;

  try {
    await createCollection(page.request, collectionId, collectionName, scope, [
      {
        fieldId: 'field-title',
        key: 'title',
        label: 'Title',
        type: 'text',
        localized: true,
        repeated: false,
        required: true,
      },
      {
        fieldId: 'field-slug',
        key: 'slug',
        label: 'Slug',
        type: 'slug',
        localized: false,
        repeated: false,
        required: true,
        unique: true,
      },
    ]);
    const recordId = await createRecord(page.request, collectionId, `${scope}-record`, {
      title: 'Shortcut save',
      slug: 'shortcut-save',
    });

    await page.goto('/ko/admin-builder/cms?slugField=save-shortcut', { waitUntil: 'domcontentloaded' });
    const collectionButton = page.getByRole('button', { name: new RegExp(collectionName) });
    await expect(collectionButton).toBeVisible();
    await collectionButton.click();
    await expect(page.getByRole('heading', { name: collectionName })).toBeVisible({ timeout: 30_000 });
    const recordGridSummary = page.locator('[data-cms-record-grid-summary]');
    await expect(recordGridSummary).toBeVisible({ timeout: 30_000 });
    await recordGridSummary.getByRole('button', { name: 'Expanded rows' }).click();
    const recordFieldGrid = page.locator('[data-cms-record-field-grid]').filter({ hasText: 'Shortcut save' }).first();
    await expect(recordFieldGrid).toBeVisible({ timeout: 30_000 });
    await recordFieldGrid.locator('[data-cms-record-field-edit]').first().click();
    await expect(page.getByRole('heading', { name: `Edit ${recordId}` })).toBeVisible({ timeout: 30_000 });
    const titleInput = page.locator('[data-cms-record-field-input="title"]').first();
    await titleInput.fill('Saved from keyboard');
    await page.waitForTimeout(100);
    await page.locator('[data-cms-record-editor]').dispatchEvent('keydown', {
      bubbles: true,
      cancelable: true,
      key: 's',
      ctrlKey: shortcutModifier === 'Control',
      metaKey: shortcutModifier === 'Meta',
    });
    await expect(page.getByRole('heading', { name: collectionName })).toBeVisible({ timeout: 30_000 });

    await expect.poll(async () => {
      const collectionResponse = await page.request.get(
        `/api/builder/sites/default/collections/${encodeURIComponent(collectionId)}?locale=ko`,
        { headers: mutationHeaders(`${scope}-verify`) },
      );
      expect(collectionResponse.status()).toBe(200);
      const collectionPayload = await collectionResponse.json() as {
        ok?: boolean;
        detail?: { records?: { recordId?: string; fields?: Record<string, unknown> }[] };
      };
      expect(collectionPayload.ok).toBe(true);
      const savedRecord = collectionPayload.detail?.records?.find((record) => record.recordId === recordId);
      return savedRecord?.fields?.title ?? null;
    }, { timeout: 60_000 }).toBe('Saved from keyboard');
  } finally {
    await deleteCollection(page.request, collectionId, `${scope}-cleanup`);
  }
});

test('/ko/admin-builder/cms record editor live route follows the draft slug', async ({ page }) => {
  const token = Date.now().toString(36);
  const collectionId = `cms-live-route-${token}`;
  const collectionName = `CMS Live Route ${token}`;
  const scope = `cms-live-route-${token}`;

  try {
    await createCollection(page.request, collectionId, collectionName, scope, [
      {
        fieldId: 'field-title',
        key: 'title',
        label: 'Title',
        type: 'text',
        localized: true,
        repeated: false,
        required: true,
      },
      {
        fieldId: 'field-slug',
        key: 'slug',
        label: 'Slug',
        type: 'slug',
        localized: false,
        repeated: false,
        required: true,
        unique: true,
      },
    ]);
    const recordId = await createRecord(page.request, collectionId, `${scope}-record`, {
      title: 'Live route record',
      slug: 'live-route-record',
    });

    await page.goto(`/ko/admin-builder/cms?collectionId=${collectionId}&recordId=${recordId}`, {
      waitUntil: 'domcontentloaded',
    });

    await expect(page.getByRole('heading', { name: `Edit ${recordId}` })).toBeVisible({ timeout: 30_000 });
    const slugInput = page.locator('[data-cms-record-field-input="slug"]').first();
    await expect(slugInput).toBeVisible({ timeout: 30_000 });
    await expect(slugInput).toHaveValue('live-route-record', { timeout: 30_000 });
    const liveRouteLink = page.locator(`[data-cms-record-live-route-link="${recordId}"]`);
    await expect(liveRouteLink).toHaveAttribute('href', new RegExp(`/${collectionId}/live-route-record$`));

    await slugInput.fill('live-route-record-updated');
    await expect(liveRouteLink).toHaveAttribute('href', new RegExp(`/${collectionId}/live-route-record-updated$`));
    await Promise.all([
      page.waitForURL(new RegExp(`/${collectionId}/live-route-record-updated$`)),
      liveRouteLink.click(),
    ]);
    await expect(page).toHaveURL(new RegExp(`/${collectionId}/live-route-record-updated$`));
  } finally {
    await deleteCollection(page.request, collectionId, `${scope}-cleanup`);
  }
});

test('/ko/admin-builder/cms record editor saves slug redirects with acknowledgement', async ({ page }) => {
  const token = Date.now().toString(36);
  const collectionId = `cms-slug-redirect-${token}`;
  const collectionName = `CMS Slug Redirect ${token}`;
  const scope = `cms-slug-redirect-${token}`;

  try {
    await createCollection(page.request, collectionId, collectionName, scope, [
      {
        fieldId: 'field-title',
        key: 'title',
        label: 'Title',
        type: 'text',
        localized: true,
        repeated: false,
        required: true,
      },
      {
        fieldId: 'field-slug',
        key: 'slug',
        label: 'Slug',
        type: 'slug',
        localized: false,
        repeated: false,
        required: true,
        unique: true,
      },
    ]);
    const recordId = await createRecord(page.request, collectionId, `${scope}-record`, {
      title: 'Redirect record',
      slug: 'redirect-record',
    });

    await page.goto(`/ko/admin-builder/cms?collectionId=${collectionId}&recordId=${recordId}`, {
      waitUntil: 'domcontentloaded',
    });

    await expect(page.getByRole('heading', { name: `Edit ${recordId}` })).toBeVisible({ timeout: 30_000 });
    const slugInput = page.locator('[data-cms-record-field-input="slug"]').first();
    await expect(slugInput).toBeVisible({ timeout: 30_000 });
    await slugInput.fill('redirect-record-updated');

    await page.getByRole('button', { name: 'Save record' }).click();
  } finally {
    await deleteCollection(page.request, collectionId, `${scope}-cleanup`);
  }
});

test('/ko/admin-builder/cms exposes editable record links on record cards', async ({ page }) => {
  const token = Date.now().toString(36);
  const collectionId = `cms-record-link-${token}`;
  const collectionName = `CMS Record Link ${token}`;
  const scope = `cms-record-link-${token}`;

  try {
    await createCollection(page.request, collectionId, collectionName, scope, [
      {
        fieldId: 'field-title',
        key: 'title',
        label: 'Title',
        type: 'text',
        localized: true,
        repeated: false,
        required: true,
      },
      {
        fieldId: 'field-slug',
        key: 'slug',
        label: 'Slug',
        type: 'slug',
        localized: false,
        repeated: false,
        required: true,
        unique: true,
      },
    ]);
    const recordId = await createRecord(page.request, collectionId, `${scope}-record`, {
      title: 'Linked record',
      slug: 'linked-record',
    });

    await page.goto(`/ko/admin-builder/cms?collectionId=${collectionId}`, {
      waitUntil: 'domcontentloaded',
    });
    await expect(page.getByRole('heading', { name: collectionName })).toBeVisible({ timeout: 30_000 });
    const recordOpenLink = page.locator(`[data-cms-record-open-link="${recordId}"]`);
    const recordLiveRouteLink = page.locator(`[data-cms-record-live-route-card-link="${recordId}"]`);
    await expect(recordOpenLink).toHaveAttribute(
      'href',
      new RegExp(`collectionId=${collectionId}.*recordId=${recordId}`),
    );
    await expect(recordLiveRouteLink).toHaveAttribute(
      'href',
      new RegExp(`/${collectionId}/linked-record$`),
    );
    await page.locator(`[data-cms-record-live-route-copy="${recordId}"]`).click();
    await expect(page.getByText(`Copied route: /ko/${collectionId}/linked-record`)).toBeVisible({ timeout: 30_000 });
    await page.goto(await recordOpenLink.getAttribute('href') ?? '', { waitUntil: 'domcontentloaded' });
    await expect(page.getByRole('heading', { name: `Edit ${recordId}` })).toBeVisible({ timeout: 30_000 });
    await page.getByRole('button', { name: 'Cancel edit' }).click();
    await expect(page.getByRole('heading', { name: collectionName })).toBeVisible({ timeout: 30_000 });
    await page.getByRole('button', { name: 'Expanded rows' }).click();
    await expect(page.locator(`[data-cms-record-open-link="${recordId}"]`)).toBeVisible({ timeout: 30_000 });
    await expect(page.locator(`[data-cms-record-live-route-card-link="${recordId}"]`)).toBeVisible({ timeout: 30_000 });
  } finally {
    await deleteCollection(page.request, collectionId, `${scope}-cleanup`);
  }
});

test('/ko/admin-builder/cms duplicates selected records from the toolbar', async ({ page }, testInfo) => {
  testInfo.setTimeout(120_000);
  const token = Date.now().toString(36);
  const collectionId = `cms-duplicate-${token}`;
  const collectionName = `CMS Duplicate ${token}`;
  const scope = `cms-duplicate-${token}`;

  try {
    await createCollection(page.request, collectionId, collectionName, scope, [
      {
        fieldId: 'field-title',
        key: 'title',
        label: 'Title',
        type: 'text',
        localized: true,
        repeated: false,
        required: true,
      },
      {
        fieldId: 'field-slug',
        key: 'slug',
        label: 'Slug',
        type: 'slug',
        localized: false,
        repeated: false,
        required: true,
        unique: true,
      },
    ]);
    const firstRecordId = await createRecord(page.request, collectionId, `${scope}-record-1`, {
      title: 'Duplicate one',
      slug: 'duplicate-one',
    });
    const secondRecordId = await createRecord(page.request, collectionId, `${scope}-record-2`, {
      title: 'Duplicate two',
      slug: 'duplicate-two',
    });

    await page.goto(`/ko/admin-builder/cms?collectionId=${collectionId}`, {
      waitUntil: 'domcontentloaded',
    });
    await expect(page.getByRole('heading', { name: collectionName })).toBeVisible({ timeout: 30_000 });
    await expect
      .poll(
        async () => {
          const collectionResponse = await page.request.get(
            `/api/builder/sites/default/collections/${encodeURIComponent(collectionId)}?locale=ko`,
            { headers: mutationHeaders(`${scope}-verify`) },
          );
          expect(collectionResponse.status()).toBe(200);
          const collectionPayload = await collectionResponse.json() as {
            ok?: boolean;
            detail?: { recordCount?: number };
          };
          expect(collectionPayload.ok).toBe(true);
          return collectionPayload.detail?.recordCount ?? 0;
        },
        { timeout: 30_000 },
      )
      .toBe(2);
    await expect(page.locator(`[aria-label="Select ${firstRecordId}"]`)).toBeVisible({ timeout: 30_000 });
    await expect(page.locator(`[aria-label="Select ${secondRecordId}"]`)).toBeVisible({ timeout: 30_000 });
    await page.locator(`[aria-label="Select ${firstRecordId}"]`).check();
    await page.locator(`[aria-label="Select ${secondRecordId}"]`).check();
    await expect(page.getByRole('button', { name: 'Duplicate selected' })).toBeEnabled({ timeout: 30_000 });
    page.on('dialog', (dialog) => dialog.accept());
    await page.getByRole('button', { name: 'Duplicate selected' }).click();
  } finally {
    await deleteCollection(page.request, collectionId, `${scope}-cleanup`);
  }
});

test('/ko/admin-builder/cms shift-arrow keeps record selection responsive in the grid', async ({ page }) => {
  const token = Date.now().toString(36);
  const collectionId = `cms-shift-arrow-${token}`;
  const collectionName = `CMS Shift Arrow ${token}`;
  const scope = `cms-shift-arrow-${token}`;

  try {
    await createCollection(page.request, collectionId, collectionName, scope, [
      {
        fieldId: 'field-title',
        key: 'title',
        label: 'Title',
        type: 'text',
        localized: true,
        repeated: false,
        required: true,
      },
      {
        fieldId: 'field-slug',
        key: 'slug',
        label: 'Slug',
        type: 'slug',
        localized: false,
        repeated: false,
        required: true,
        unique: true,
      },
    ]);
    const firstRecordId = await createRecord(page.request, collectionId, `${scope}-record-1`, {
      title: 'Arrow one',
      slug: 'arrow-one',
    });
    const secondRecordId = await createRecord(page.request, collectionId, `${scope}-record-2`, {
      title: 'Arrow two',
      slug: 'arrow-two',
    });
    const thirdRecordId = await createRecord(page.request, collectionId, `${scope}-record-3`, {
      title: 'Arrow three',
      slug: 'arrow-three',
    });

    await page.goto(`/ko/admin-builder/cms?collectionId=${collectionId}`, {
      waitUntil: 'domcontentloaded',
    });
    await expect(page.getByRole('heading', { name: collectionName })).toBeVisible({ timeout: 30_000 });
    await expect
      .poll(
        async () => {
          const collectionResponse = await page.request.get(
            `/api/builder/sites/default/collections/${encodeURIComponent(collectionId)}?locale=ko`,
            { headers: mutationHeaders(`${scope}-verify`) },
          );
          expect(collectionResponse.status()).toBe(200);
          const collectionPayload = await collectionResponse.json() as {
            ok?: boolean;
            detail?: { recordCount?: number };
          };
          expect(collectionPayload.ok).toBe(true);
          return collectionPayload.detail?.recordCount ?? 0;
        },
        { timeout: 30_000 },
      )
      .toBe(3);
    const [firstRowId, secondRowId, thirdRowId] = [firstRecordId, secondRecordId, thirdRecordId];
    const firstCheckbox = page.locator(`[aria-label="Select ${firstRowId}"]`);
    await expect(firstCheckbox).toBeVisible({ timeout: 30_000 });
    await expect(page.locator(`[aria-label="Select ${secondRowId}"]`)).toBeVisible({ timeout: 30_000 });
    await expect(page.locator(`[aria-label="Select ${thirdRowId}"]`)).toBeVisible({ timeout: 30_000 });
    await firstCheckbox.check();
    await firstCheckbox.focus();
    await expect(page.locator('[data-cms-record-grid-selected] strong')).toHaveText('1', { timeout: 30_000 });
    await page.keyboard.down('Shift');
    await page.keyboard.press('ArrowDown');
    await page.keyboard.up('Shift');
    await expect(page.locator('[data-cms-record-grid-selected] strong')).toHaveText('1', { timeout: 30_000 });
    await expect(page.locator(`[aria-label="Select ${firstRowId}"]`)).toBeChecked();
    await expect(page.locator(`[aria-label="Select ${secondRowId}"]`)).not.toBeChecked();
  } finally {
    await deleteCollection(page.request, collectionId, `${scope}-cleanup`);
  }
});

test('/ko/admin-builder/cms select-all and escape clear the grid selection', async ({ page }, testInfo) => {
  testInfo.setTimeout(120_000);
  const token = Date.now().toString(36);
  const collectionId = `cms-select-all-${token}`;
  const collectionName = `CMS Select All ${token}`;
  const scope = `cms-select-all-${token}`;

  try {
    await createCollection(page.request, collectionId, collectionName, scope, [
      {
        fieldId: 'field-title',
        key: 'title',
        label: 'Title',
        type: 'text',
        localized: true,
        repeated: false,
        required: true,
      },
      {
        fieldId: 'field-slug',
        key: 'slug',
        label: 'Slug',
        type: 'slug',
        localized: false,
        repeated: false,
        required: true,
        unique: true,
      },
    ]);
    await createRecord(page.request, collectionId, `${scope}-record-1`, {
      title: 'Select one',
      slug: 'select-one',
    });
    await createRecord(page.request, collectionId, `${scope}-record-2`, {
      title: 'Select two',
      slug: 'select-two',
    });
    await createRecord(page.request, collectionId, `${scope}-record-3`, {
      title: 'Select three',
      slug: 'select-three',
    });

    await page.goto(`/ko/admin-builder/cms?collectionId=${collectionId}`, {
      waitUntil: 'domcontentloaded',
    });
    await expect(page.getByRole('heading', { name: collectionName })).toBeVisible({ timeout: 30_000 });
    const recordGridSummary = page.locator('[data-cms-record-grid-summary]');
    await expect(recordGridSummary).toBeVisible({ timeout: 30_000 });
    await recordGridSummary.getByRole('button', { name: 'Expanded rows' }).click();
    const recordRows = page.locator('[data-cms-record-grid-row-summary]');
    await expect(recordRows).toHaveCount(3, { timeout: 30_000 });
    const recordIds = await recordRows.evaluateAll((nodes) =>
      nodes
        .map((node) => node.getAttribute('data-cms-record-grid-row-summary'))
        .filter((value): value is string => Boolean(value)),
    );
    const [firstRowId, secondRowId, thirdRowId] = recordIds;
    const firstCheckbox = page.locator(`[aria-label="Select ${firstRowId}"]`);
    await firstCheckbox.check();
    await expect(page.locator('[data-cms-record-grid-selected] strong')).toHaveText('1', { timeout: 30_000 });
    await firstCheckbox.press(`${shortcutModifier}+A`);
    await expect(page.locator('[data-cms-record-grid-selected] strong')).toHaveText('3', { timeout: 30_000 });
    await expect(page.locator(`[aria-label="Select ${firstRowId}"]`)).toBeChecked();
    await expect(page.locator(`[aria-label="Select ${secondRowId}"]`)).toBeChecked();
    await expect(page.locator(`[aria-label="Select ${thirdRowId}"]`)).toBeChecked();
    await firstCheckbox.press('Escape');
    await expect(page.locator('[data-cms-record-grid-selected] strong')).toHaveText('0', { timeout: 30_000 });
    await expect(page.locator(`[aria-label="Select ${firstRowId}"]`)).not.toBeChecked();
    await expect(page.locator(`[aria-label="Select ${secondRowId}"]`)).not.toBeChecked();
    await expect(page.locator(`[aria-label="Select ${thirdRowId}"]`)).not.toBeChecked();
  } finally {
    await deleteCollection(page.request, collectionId, `${scope}-cleanup`);
  }
});

test('/ko/admin-builder/cms publishes the selected publishable rows from the keyboard', async ({ page }, testInfo) => {
  testInfo.setTimeout(120_000);
  const token = Date.now().toString(36);
  const collectionId = `cms-keyboard-publish-${token}`;
  const collectionName = `CMS Keyboard Publish ${token}`;
  const scope = `cms-keyboard-publish-${token}`;

  try {
    await createCollection(page.request, collectionId, collectionName, scope, [
      {
        fieldId: 'field-title',
        key: 'title',
        label: 'Title',
        type: 'text',
        localized: true,
        repeated: false,
        required: true,
      },
      {
        fieldId: 'field-slug',
        key: 'slug',
        label: 'Slug',
        type: 'slug',
        localized: false,
        repeated: false,
        required: true,
        unique: true,
      },
    ]);
    const firstRecordId = await createRecord(page.request, collectionId, `${scope}-record-1`, {
      title: 'Publish one',
      slug: 'publish-one',
    });
    const secondRecordId = await createRecord(page.request, collectionId, `${scope}-record-2`, {
      title: 'Publish two',
      slug: 'publish-two',
    });
    const thirdRecordId = await createRecord(page.request, collectionId, `${scope}-record-3`, {
      title: 'Publish three',
      slug: 'publish-three',
    });

    await page.goto(`/ko/admin-builder/cms?collectionId=${collectionId}`, {
      waitUntil: 'domcontentloaded',
    });
    await expect(page.getByRole('heading', { name: collectionName })).toBeVisible({ timeout: 30_000 });
    const firstCheckbox = page.locator(`[aria-label="Select ${firstRecordId}"]`);
    await firstCheckbox.check();
    await page.keyboard.press(`${shortcutModifier}+A`);
    await expect(page.locator('[data-cms-record-grid-selected] strong')).toHaveText('3', { timeout: 30_000 });
    page.on('dialog', (dialog) => dialog.accept());
    await firstCheckbox.dispatchEvent('keydown', {
      bubbles: true,
      cancelable: true,
      key: 'Enter',
      ctrlKey: shortcutModifier === 'Control',
      metaKey: shortcutModifier === 'Meta',
      shiftKey: true,
    });
    await expect(page.locator(`[aria-label="Select ${firstRecordId}"]`)).toHaveCount(1);
    await expect(page.locator(`[aria-label="Select ${secondRecordId}"]`)).toHaveCount(1);
    await expect(page.locator(`[aria-label="Select ${thirdRecordId}"]`)).toHaveCount(1);
  } finally {
    await deleteCollection(page.request, collectionId, `${scope}-cleanup`);
  }
});

test('/ko/admin-builder/cms opens the focused record editor with Enter', async ({ page }) => {
  const token = Date.now().toString(36);
  const collectionId = `cms-open-editor-${token}`;
  const collectionName = `CMS Open Editor ${token}`;
  const scope = `cms-open-editor-${token}`;

  try {
    await createCollection(page.request, collectionId, collectionName, scope, [
      {
        fieldId: 'field-title',
        key: 'title',
        label: 'Title',
        type: 'text',
        localized: true,
        repeated: false,
        required: true,
      },
      {
        fieldId: 'field-slug',
        key: 'slug',
        label: 'Slug',
        type: 'slug',
        localized: false,
        repeated: false,
        required: true,
        unique: true,
      },
    ]);
    const recordId = await createRecord(page.request, collectionId, `${scope}-record-1`, {
      title: 'Open me',
      slug: 'open-me',
    });

    await page.goto(`/ko/admin-builder/cms?collectionId=${collectionId}`, {
      waitUntil: 'domcontentloaded',
    });
    await expect(page.getByRole('heading', { name: collectionName })).toBeVisible({ timeout: 30_000 });
    await expect(page.locator('[data-cms-record-grid-row-summary]')).toHaveCount(1, { timeout: 30_000 });
    const recordCheckbox = page.locator(`[aria-label="Select ${recordId}"]`);
    await expect(recordCheckbox).toBeVisible({ timeout: 30_000 });
    await recordCheckbox.press('Enter');

    await expect(page.getByRole('heading', { name: `Edit ${recordId}` })).toBeVisible({ timeout: 30_000 });
    await expect(page.locator('[data-cms-record-field-input="title"]').first()).toHaveValue('Open me');
    await expect(page.locator('[data-cms-record-field-input="slug"]').first()).toHaveValue('open-me');
    await page.getByRole('button', { name: 'Cancel edit' }).click();
    await expect(page.getByRole('heading', { name: collectionName })).toBeVisible({ timeout: 30_000 });
  } finally {
    await deleteCollection(page.request, collectionId, `${scope}-cleanup`);
  }
});

test('/ko/admin-builder/cms delete removes the selected grid rows from the keyboard', async ({ page }) => {
  const token = Date.now().toString(36);
  const collectionId = `cms-delete-${token}`;
  const collectionName = `CMS Delete ${token}`;
  const scope = `cms-delete-${token}`;

  try {
    await createCollection(page.request, collectionId, collectionName, scope, [
      {
        fieldId: 'field-title',
        key: 'title',
        label: 'Title',
        type: 'text',
        localized: true,
        repeated: false,
        required: true,
      },
      {
        fieldId: 'field-slug',
        key: 'slug',
        label: 'Slug',
        type: 'slug',
        localized: false,
        repeated: false,
        required: true,
        unique: true,
      },
    ]);
    await createRecord(page.request, collectionId, `${scope}-record-1`, {
      title: 'Delete one',
      slug: 'delete-one',
    });
    await createRecord(page.request, collectionId, `${scope}-record-2`, {
      title: 'Delete two',
      slug: 'delete-two',
    });
    await createRecord(page.request, collectionId, `${scope}-record-3`, {
      title: 'Delete three',
      slug: 'delete-three',
    });

    await page.goto(`/ko/admin-builder/cms?collectionId=${collectionId}`, {
      waitUntil: 'domcontentloaded',
    });
    await expect(page.getByRole('heading', { name: collectionName })).toBeVisible({ timeout: 30_000 });
    const recordRows = page.locator('[data-cms-record-grid-row-summary]');
    await expect(recordRows).toHaveCount(3, { timeout: 30_000 });
    const recordIds = await recordRows.evaluateAll((nodes) =>
      nodes
        .map((node) => node.getAttribute('data-cms-record-grid-row-summary'))
        .filter((value): value is string => Boolean(value)),
    );
    const [firstRowId, secondRowId, thirdRowId] = recordIds;
    const firstCheckbox = page.locator(`[aria-label="Select ${firstRowId}"]`);
    await firstCheckbox.check();
    await firstCheckbox.press(`${shortcutModifier}+A`);
    await expect(page.locator('[data-cms-record-grid-selected] strong')).toHaveText('3', { timeout: 30_000 });
    page.on('dialog', (dialog) => dialog.accept());
    await firstCheckbox.focus();
    await page.keyboard.press('Delete');
  } finally {
    await deleteCollection(page.request, collectionId, `${scope}-cleanup`);
  }
});

test('/ko/admin-builder/cms exports selected records from the toolbar', async ({ page }) => {
  const token = Date.now().toString(36);
  const collectionId = `cms-export-${token}`;
  const collectionName = `CMS Export ${token}`;
  const scope = `cms-export-${token}`;

  try {
    await createCollection(page.request, collectionId, collectionName, scope, [
      {
        fieldId: 'field-title',
        key: 'title',
        label: 'Title',
        type: 'text',
        localized: true,
        repeated: false,
        required: true,
      },
      {
        fieldId: 'field-slug',
        key: 'slug',
        label: 'Slug',
        type: 'slug',
        localized: false,
        repeated: false,
        required: true,
        unique: true,
      },
    ]);
    const firstRecordId = await createRecord(page.request, collectionId, `${scope}-record-1`, {
      title: 'Export one',
      slug: 'export-one',
    });
    const secondRecordId = await createRecord(page.request, collectionId, `${scope}-record-2`, {
      title: 'Export two',
      slug: 'export-two',
    });
    await createRecord(page.request, collectionId, `${scope}-record-3`, {
      title: 'Export three',
      slug: 'export-three',
    });

    await page.goto(`/ko/admin-builder/cms?collectionId=${collectionId}`, {
      waitUntil: 'domcontentloaded',
    });
    await expect(page.getByRole('heading', { name: collectionName })).toBeVisible({ timeout: 30_000 });
    const recordGridSummary = page.locator('[data-cms-record-grid-summary]');
    await expect(recordGridSummary).toBeVisible({ timeout: 30_000 });
    await page.locator(`[aria-label="Select ${firstRecordId}"]`).check();
    await page.locator(`[aria-label="Select ${secondRecordId}"]`).check();
    await expect(page.getByRole('button', { name: 'Export selected (2)' })).toBeEnabled({ timeout: 30_000 });

    await page.getByRole('button', { name: 'Export selected (2)' }).click();
  } finally {
    await deleteCollection(page.request, collectionId, `${scope}-cleanup`);
  }
});

test('/ko/admin-builder/cms copies selected records as TSV from the toolbar', async ({ page }) => {
  const token = Date.now().toString(36);
  const collectionId = `cms-copy-${token}`;
  const collectionName = `CMS Copy ${token}`;
  const scope = `cms-copy-${token}`;

  try {
    await createCollection(page.request, collectionId, collectionName, scope, [
      {
        fieldId: 'field-title',
        key: 'title',
        label: 'Title',
        type: 'text',
        localized: true,
        repeated: false,
        required: true,
      },
      {
        fieldId: 'field-slug',
        key: 'slug',
        label: 'Slug',
        type: 'slug',
        localized: false,
        repeated: false,
        required: true,
        unique: true,
      },
    ]);
    const firstRecordId = await createRecord(page.request, collectionId, `${scope}-record-1`, {
      title: 'Copy one',
      slug: 'copy-one',
    });
    const secondRecordId = await createRecord(page.request, collectionId, `${scope}-record-2`, {
      title: 'Copy two',
      slug: 'copy-two',
    });
    await createRecord(page.request, collectionId, `${scope}-record-3`, {
      title: 'Copy three',
      slug: 'copy-three',
    });

    await page.goto(`/ko/admin-builder/cms?collectionId=${collectionId}`, {
      waitUntil: 'domcontentloaded',
    });
    await page.context().grantPermissions(['clipboard-read', 'clipboard-write'], {
      origin: new URL(page.url()).origin,
    });
    await expect(page.getByRole('heading', { name: collectionName })).toBeVisible({ timeout: 30_000 });
    const recordGridSummary = page.locator('[data-cms-record-grid-summary]');
    await expect(recordGridSummary).toBeVisible({ timeout: 30_000 });
    await page.locator(`[aria-label="Select ${firstRecordId}"]`).check();
    await page.locator(`[aria-label="Select ${secondRecordId}"]`).check();

    await expect(page.getByRole('button', { name: 'Copy selected TSV (2)' })).toBeEnabled({ timeout: 30_000 });
    await page.getByRole('button', { name: 'Copy selected TSV (2)' }).click();

    await expect(page.locator('section[aria-live="polite"]')).toContainText('Selected rows copied (2).', { timeout: 30_000 });
    const clipboardText = await page.evaluate(() => navigator.clipboard.readText());
    const lines = clipboardText.trim().split(/\r?\n/);
    expect(lines[0]).toBe('Record ID\tStatus\tLocale\tTitle\tSlug');
    expect(lines).toHaveLength(3);
    expect(clipboardText).toContain(firstRecordId);
    expect(clipboardText).toContain(secondRecordId);
    expect(clipboardText).not.toContain('Copy three');
  } finally {
    await deleteCollection(page.request, collectionId, `${scope}-cleanup`);
  }
});

test('/ko/admin-builder/cms cuts selected records to the clipboard from the keyboard', async ({ page }, testInfo) => {
  testInfo.setTimeout(120_000);
  const token = Date.now().toString(36);
  const collectionId = `cms-cut-${token}`;
  const collectionName = `CMS Cut ${token}`;
  const scope = `cms-cut-${token}`;

  try {
    await createCollection(page.request, collectionId, collectionName, scope, [
      {
        fieldId: 'field-title',
        key: 'title',
        label: 'Title',
        type: 'text',
        localized: true,
        repeated: false,
        required: true,
      },
      {
        fieldId: 'field-slug',
        key: 'slug',
        label: 'Slug',
        type: 'slug',
        localized: false,
        repeated: false,
        required: true,
        unique: true,
      },
    ]);
    const firstRecordId = await createRecord(page.request, collectionId, `${scope}-record-1`, {
      title: 'Cut one',
      slug: 'cut-one',
    });
    const secondRecordId = await createRecord(page.request, collectionId, `${scope}-record-2`, {
      title: 'Cut two',
      slug: 'cut-two',
    });
    await createRecord(page.request, collectionId, `${scope}-record-3`, {
      title: 'Cut three',
      slug: 'cut-three',
    });

    await page.goto(`/ko/admin-builder/cms?collectionId=${collectionId}`, {
      waitUntil: 'domcontentloaded',
    });
    await page.context().grantPermissions(['clipboard-read', 'clipboard-write'], {
      origin: new URL(page.url()).origin,
    });
    await expect(page.getByRole('heading', { name: collectionName })).toBeVisible({ timeout: 30_000 });
    const recordGridSummary = page.locator('[data-cms-record-grid-summary]');
    await expect(recordGridSummary).toBeVisible({ timeout: 30_000 });
    await page.locator(`[aria-label="Select ${firstRecordId}"]`).check();
    await page.locator(`[aria-label="Select ${secondRecordId}"]`).check();
    await expect(page.getByRole('button', { name: 'Cut selected (2)' })).toBeEnabled({ timeout: 30_000 });

    const dialogPromise = page.waitForEvent('dialog');
    await page.locator(`[aria-label="Select ${firstRecordId}"]`).dispatchEvent('keydown', {
      bubbles: true,
      cancelable: true,
      ctrlKey: shortcutModifier === 'Control',
      key: 'x',
      metaKey: shortcutModifier === 'Meta',
    });
    const dialog = await dialogPromise;
    expect(dialog.message()).toContain('Delete 2 selected records?');
    await dialog.accept();

    await expect(page.locator('section[aria-live="polite"]')).toContainText('Cut selected rows (2).', { timeout: 30_000 });
    const clipboardText = await page.evaluate(() => navigator.clipboard.readText());
    const lines = clipboardText.trim().split(/\r?\n/);
    expect(lines[0]).toBe('Record ID\tStatus\tLocale\tTitle\tSlug');
    expect(lines).toHaveLength(3);
    expect(clipboardText).toContain(firstRecordId);
    expect(clipboardText).toContain(secondRecordId);
  } finally {
    await deleteCollection(page.request, collectionId, `${scope}-cleanup`);
  }
});

test('/ko/admin-builder/cms pastes clipboard TSV into a matching collection', async ({ page }) => {
  const token = Date.now().toString(36);
  const sourceCollectionId = `cms-copy-src-${token}`;
  const sourceCollectionName = `CMS Copy Source ${token}`;
  const destinationCollectionId = `cms-copy-dst-${token}`;
  const destinationCollectionName = `CMS Copy Destination ${token}`;
  const scope = `cms-copy-paste-${token}`;

  try {
    const fields: TestCmsField[] = [
      {
        fieldId: 'field-title',
        key: 'title',
        label: 'Title',
        type: 'text',
        localized: true,
        repeated: false,
        required: true,
      },
      {
        fieldId: 'field-slug',
        key: 'slug',
        label: 'Slug',
        type: 'slug',
        localized: false,
        repeated: false,
        required: true,
        unique: true,
      },
    ];

    await createCollection(page.request, sourceCollectionId, sourceCollectionName, `${scope}-source`, fields);
    await createCollection(page.request, destinationCollectionId, destinationCollectionName, `${scope}-destination`, fields);
    const firstRecordId = await createRecord(page.request, sourceCollectionId, `${scope}-record-1`, {
      title: 'Paste one',
      slug: 'paste-one',
    });
    const secondRecordId = await createRecord(page.request, sourceCollectionId, `${scope}-record-2`, {
      title: 'Paste two',
      slug: 'paste-two',
    });

    await page.goto(`/ko/admin-builder/cms?collectionId=${sourceCollectionId}`, {
      waitUntil: 'domcontentloaded',
    });
    await page.context().grantPermissions(['clipboard-read', 'clipboard-write'], {
      origin: new URL(page.url()).origin,
    });
    await expect(page.getByRole('heading', { name: sourceCollectionName })).toBeVisible({ timeout: 30_000 });
    await page.locator(`[aria-label="Select ${firstRecordId}"]`).check();
    await page.locator(`[aria-label="Select ${secondRecordId}"]`).check();
    await page.getByRole('button', { name: 'Copy selected TSV (2)' }).click();
    await expect(page.locator('section[aria-live="polite"]')).toContainText('Selected rows copied (2).', { timeout: 30_000 });

    await page.goto(`/ko/admin-builder/cms?collectionId=${destinationCollectionId}`, {
      waitUntil: 'domcontentloaded',
    });
    await expect(page.getByRole('heading', { name: destinationCollectionName })).toBeVisible({ timeout: 30_000 });
    await page.getByRole('button', { name: 'Paste clipboard TSV' }).click();
  } finally {
    await deleteCollection(page.request, destinationCollectionId, `${scope}-cleanup`);
    await deleteCollection(page.request, sourceCollectionId, `${scope}-cleanup`);
  }
});

test('/ko/admin-builder/cms pastes clipboard TSV from the keyboard into a matching collection', async ({ page }) => {
  const token = Date.now().toString(36);
  const sourceCollectionId = `cms-copy-key-src-${token}`;
  const sourceCollectionName = `CMS Copy Key Source ${token}`;
  const destinationCollectionId = `cms-copy-key-dst-${token}`;
  const destinationCollectionName = `CMS Copy Key Destination ${token}`;
  const scope = `cms-copy-key-${token}`;

  try {
    const fields: TestCmsField[] = [
      {
        fieldId: 'field-title',
        key: 'title',
        label: 'Title',
        type: 'text',
        localized: true,
        repeated: false,
        required: true,
      },
      {
        fieldId: 'field-slug',
        key: 'slug',
        label: 'Slug',
        type: 'slug',
        localized: false,
        repeated: false,
        required: true,
        unique: true,
      },
    ];

    await createCollection(page.request, sourceCollectionId, sourceCollectionName, `${scope}-source`, fields);
    await createCollection(page.request, destinationCollectionId, destinationCollectionName, `${scope}-destination`, fields);
    const firstRecordId = await createRecord(page.request, sourceCollectionId, `${scope}-record-1`, {
      title: 'Paste key one',
      slug: 'paste-key-one',
    });
    const secondRecordId = await createRecord(page.request, sourceCollectionId, `${scope}-record-2`, {
      title: 'Paste key two',
      slug: 'paste-key-two',
    });

    await page.goto(`/ko/admin-builder/cms?collectionId=${sourceCollectionId}`, {
      waitUntil: 'domcontentloaded',
    });
    await page.context().grantPermissions(['clipboard-read', 'clipboard-write'], {
      origin: new URL(page.url()).origin,
    });
    await expect(page.getByRole('heading', { name: sourceCollectionName })).toBeVisible({ timeout: 30_000 });
    await page.locator(`[aria-label="Select ${firstRecordId}"]`).check();
    await page.locator(`[aria-label="Select ${secondRecordId}"]`).check();
    await page.getByRole('button', { name: 'Copy selected TSV (2)' }).click();
    await expect(page.locator('section[aria-live="polite"]')).toContainText('Selected rows copied (2).', { timeout: 30_000 });

    await page.goto(`/ko/admin-builder/cms?collectionId=${destinationCollectionId}`, {
      waitUntil: 'domcontentloaded',
    });
    await expect(page.getByRole('heading', { name: destinationCollectionName })).toBeVisible({ timeout: 30_000 });
    await page.locator('[data-cms-record-grid]').press('Control+V');
  } finally {
    await deleteCollection(page.request, destinationCollectionId, `${scope}-cleanup`);
    await deleteCollection(page.request, sourceCollectionId, `${scope}-cleanup`);
  }
});

test('/ko/admin-builder/cms pastes clipboard TSV as duplicates into the same collection', async ({ page }) => {
  const token = Date.now().toString(36);
  const collectionId = `cms-copy-self-${token}`;
  const collectionName = `CMS Copy Self ${token}`;
  const scope = `cms-copy-self-${token}`;

  try {
    await createCollection(page.request, collectionId, collectionName, scope, [
      {
        fieldId: 'field-title',
        key: 'title',
        label: 'Title',
        type: 'text',
        localized: true,
        repeated: false,
        required: true,
      },
      {
        fieldId: 'field-slug',
        key: 'slug',
        label: 'Slug',
        type: 'slug',
        localized: false,
        repeated: false,
        required: true,
        unique: true,
      },
    ]);
    const firstRecordId = await createRecord(page.request, collectionId, `${scope}-record-1`, {
      title: 'Copy self one',
      slug: 'copy-self-one',
    });
    const secondRecordId = await createRecord(page.request, collectionId, `${scope}-record-2`, {
      title: 'Copy self two',
      slug: 'copy-self-two',
    });

    await page.goto(`/ko/admin-builder/cms?collectionId=${collectionId}`, {
      waitUntil: 'domcontentloaded',
    });
    await page.context().grantPermissions(['clipboard-read', 'clipboard-write'], {
      origin: new URL(page.url()).origin,
    });
    await expect(page.getByRole('heading', { name: collectionName })).toBeVisible({ timeout: 30_000 });
    await expect(page.locator('[data-cms-record-grid-row-summary]')).toHaveCount(2, { timeout: 30_000 });
    await page.locator(`[aria-label="Select ${firstRecordId}"]`).check();
    await page.locator(`[aria-label="Select ${secondRecordId}"]`).check();
    await page.getByRole('button', { name: 'Copy selected TSV (2)' }).click();
    await expect(page.locator('section[aria-live="polite"]')).toContainText('Selected rows copied (2).', { timeout: 30_000 });
    await page.getByRole('button', { name: 'Paste clipboard TSV' }).click();
  } finally {
    await deleteCollection(page.request, collectionId, `${scope}-cleanup`);
  }
});

test('/ko/admin-builder/cms pastes clipboard TSV as duplicates from the keyboard into the same collection', async ({ page }) => {
  const token = Date.now().toString(36);
  const collectionId = `cms-copy-self-key-${token}`;
  const collectionName = `CMS Copy Self Key ${token}`;
  const scope = `cms-copy-self-key-${token}`;

  try {
    await createCollection(page.request, collectionId, collectionName, scope, [
      {
        fieldId: 'field-title',
        key: 'title',
        label: 'Title',
        type: 'text',
        localized: true,
        repeated: false,
        required: true,
      },
      {
        fieldId: 'field-slug',
        key: 'slug',
        label: 'Slug',
        type: 'slug',
        localized: false,
        repeated: false,
        required: true,
        unique: true,
      },
    ]);
    const firstRecordId = await createRecord(page.request, collectionId, `${scope}-record-1`, {
      title: 'Copy self key one',
      slug: 'copy-self-key-one',
    });
    const secondRecordId = await createRecord(page.request, collectionId, `${scope}-record-2`, {
      title: 'Copy self key two',
      slug: 'copy-self-key-two',
    });

    await page.goto(`/ko/admin-builder/cms?collectionId=${collectionId}`, {
      waitUntil: 'domcontentloaded',
    });
    await page.context().grantPermissions(['clipboard-read', 'clipboard-write'], {
      origin: new URL(page.url()).origin,
    });
    await expect(page.getByRole('heading', { name: collectionName })).toBeVisible({ timeout: 30_000 });
    await page.locator(`[aria-label="Select ${firstRecordId}"]`).check();
    await page.locator(`[aria-label="Select ${secondRecordId}"]`).check();
    await page.getByRole('button', { name: 'Copy selected TSV (2)' }).click();
    await expect(page.locator('section[aria-live="polite"]')).toContainText('Selected rows copied (2).', { timeout: 30_000 });
    await page.locator('[data-cms-record-grid]').focus();
    await page.keyboard.press('Control+V');
  } finally {
    await deleteCollection(page.request, collectionId, `${scope}-cleanup`);
  }
});

test('/ko/admin-builder/cms previews inline typed validation warnings', async ({ page }) => {
  const token = Date.now().toString(36);
  const collectionId = `cms-types-${token}`;
  const collectionName = `CMS Types ${token}`;
  const scope = `cms-types-${token}`;

  try {
    await createCollection(page.request, collectionId, collectionName, scope, [
      {
        fieldId: 'field-title',
        key: 'title',
        label: 'Title',
        type: 'text',
        localized: true,
        repeated: false,
        required: true,
      },
      {
        fieldId: 'field-email',
        key: 'email',
        label: 'Email',
        type: 'email',
        localized: false,
        repeated: false,
        required: true,
      },
      {
        fieldId: 'field-website',
        key: 'website',
        label: 'Website',
        type: 'url',
        localized: false,
        repeated: false,
        required: true,
      },
      {
        fieldId: 'field-score',
        key: 'score',
        label: 'Score',
        type: 'number',
        localized: false,
        repeated: false,
        required: true,
        validation: { min: 1, max: 10 },
      },
    ]);
    const firstRecordId = await createRecord(page.request, collectionId, `${scope}-record`, {
      title: 'Typed validation record',
      email: 'valid@example.com',
      website: 'https://example.com',
      score: '5',
    });
    const secondRecordId = await createRecord(page.request, collectionId, `${scope}-record-2`, {
      title: 'Next typed validation record',
      email: 'next@example.com',
      website: 'https://example.org',
      score: '6',
    });

    await page.goto(`/ko/admin-builder/cms?collectionId=${collectionId}&typed=${token}`, { waitUntil: 'domcontentloaded' });
    await expect(page.getByRole('heading', { name: collectionName })).toBeVisible({ timeout: 30_000 });

    const recordGridSummary = page.locator('[data-cms-record-grid-summary]');
    await expect(recordGridSummary).toBeVisible({ timeout: 30_000 });
    await expect(recordGridSummary).toContainText('Record grid');
    await recordGridSummary.getByRole('button', { name: 'Expanded rows' }).click();

    const recordFieldGrid = page.locator(`[data-cms-record-field-grid="${firstRecordId}"]`);
    await expect(recordFieldGrid).toBeVisible();

    const emailCell = recordFieldGrid.locator(`[data-cms-record-field-cell="${firstRecordId}:email"]`);
    await emailCell.locator('[data-cms-record-field-inline-edit]').click();
    const emailInlineEditor = emailCell.locator('[data-cms-record-field-inline-editor]').first();
    await expect(emailInlineEditor).toBeVisible({ timeout: 30_000 });
    await emailInlineEditor.locator('[data-cms-record-field-inline-input]').fill('not-an-email');
    await expect(emailInlineEditor.locator('[data-cms-record-field-inline-validation]')).toContainText(
      'Email must be an email before save.',
    );
    await expect(emailInlineEditor.locator('[data-cms-record-field-inline-save]')).toBeDisabled();
    await emailInlineEditor.locator('[data-cms-record-field-inline-input]').press('Escape');
    await expect(emailCell.locator('[data-cms-record-field-inline-editor]')).toHaveCount(0);
    await expect(emailCell.locator('[data-cms-record-field-value]')).toContainText('valid@example.com');
    await emailCell.locator('[data-cms-record-field-inline-edit]').click();
    await expect(emailCell.locator('[data-cms-record-field-inline-editor]')).toBeVisible();
    const reopenedEmailInlineEditor = emailCell.locator('[data-cms-record-field-inline-editor]').first();
    await expect(reopenedEmailInlineEditor).toBeVisible({ timeout: 30_000 });
    await reopenedEmailInlineEditor.locator('[data-cms-record-field-inline-input]').fill(`editor-${token}@example.com`);
    await expect(reopenedEmailInlineEditor.locator('[data-cms-record-field-inline-validation]')).toHaveCount(0);
    await reopenedEmailInlineEditor.getByRole('button', { name: 'Save' }).click();
    const statusCard = page.locator('section[aria-live="polite"]');
    await expect(statusCard).toContainText('Inline field saved: Email.');

    await page.reload({ waitUntil: 'domcontentloaded' });
    await expect(page.getByRole('heading', { name: collectionName })).toBeVisible({ timeout: 30_000 });
    await expect(recordGridSummary).toBeVisible({ timeout: 30_000 });
    await recordGridSummary.getByRole('button', { name: 'Expanded rows' }).click();

    const refreshedRecordFieldGrid = page.locator(`[data-cms-record-field-grid="${firstRecordId}"]`);
    const refreshedEmailCell = refreshedRecordFieldGrid.locator(`[data-cms-record-field-cell="${firstRecordId}:email"]`);
    await expect(refreshedEmailCell.locator('[data-cms-record-field-value]')).toContainText(`editor-${token}@example.com`);

    const websiteCell = refreshedRecordFieldGrid.locator(`[data-cms-record-field-cell="${firstRecordId}:website"]`);
    await websiteCell.locator('[data-cms-record-field-inline-edit]').click();
    const websiteInlineEditor = websiteCell.locator('[data-cms-record-field-inline-editor]').first();
    await expect(websiteInlineEditor).toBeVisible({ timeout: 30_000 });
    await expect(websiteInlineEditor.locator('[data-cms-record-field-inline-input]')).toHaveValue('https://example.com');
    await websiteInlineEditor.locator('[data-cms-record-field-inline-input]').fill('example.com');
    await expect(websiteInlineEditor.locator('[data-cms-record-field-inline-validation]')).toContainText(
      'Website must be a URL before save.',
    );
    await expect(websiteInlineEditor.locator('[data-cms-record-field-inline-save]')).toBeDisabled();
    await websiteInlineEditor.getByRole('button', { name: 'Cancel' }).click();

  } finally {
    await deleteCollection(page.request, collectionId, `${scope}-cleanup`);
  }
});

test('/ko/admin-builder/cms keeps source and record summaries inside cards on narrow screens', async ({ page }) => {
  const token = Date.now().toString(36);
  const collectionId = `cms-fit-${token}`;
  const collectionName = `CMS Fit ${token}`;
  const scope = `cms-fit-${token}`;

  try {
    await createCollection(page.request, collectionId, collectionName, scope);
    await createRecord(page.request, collectionId, `${scope}-record`);

    await page.setViewportSize({ width: 390, height: 900 });
    await page.goto(`/ko/admin-builder/cms?collectionId=${collectionId}&fit=${token}`, { waitUntil: 'domcontentloaded' });
    await expect(page.locator('[data-cms-source-record-preview="columns"]')).toBeVisible();
    await expect(page.locator('[data-cms-source-record-preview="service-areas"]')).toBeVisible();
    await expect(page.locator('[data-cms-source-record-preview="attorney-profiles"]')).toBeVisible();

    await expect(page.locator('[data-cms-record-grid-summary]')).toBeVisible({ timeout: 30_000 });

    await expectElementsWithinNearestCard(
      page,
      [
        '[data-cms-source-record-preview]',
        '[data-cms-source-record-preview] *',
        '[data-cms-record-grid-summary]',
        '[data-cms-record-grid-summary] *',
        '[data-cms-record-route-preview]',
        '[data-cms-record-field-grid]',
        '[data-cms-record-field-grid] *',
      ].join(', '),
    );
  } finally {
    await deleteCollection(page.request, collectionId, `${scope}-cleanup`);
  }
});

test('service source API exposes records and blocks duplicate live slugs', async ({ request }) => {
  const scope = `service-source-${Date.now().toString(36)}`;
  const getResponse = await request.get('/api/builder/services/civil?locale=ko', {
    headers: mutationHeaders(`${scope}-get`),
  });
  expect(getResponse.status()).toBe(200);
  const getPayload = await getResponse.json() as {
    ok?: boolean;
    record?: { sourceSlug?: string; slug?: string; title?: { ko?: string } };
    error?: string;
  };
  expect(getPayload.ok, getPayload.error).toBe(true);
  expect(getPayload.record).toMatchObject({
    sourceSlug: 'civil',
    slug: 'civil',
  });
  expect(getPayload.record?.title?.ko).toContain('민사');

  const duplicateResponse = await request.patch('/api/builder/services/family?locale=ko', {
    headers: mutationHeaders(`${scope}-patch`),
    data: { slug: 'civil' },
  });
  expect(duplicateResponse.status()).toBe(409);
  const duplicatePayload = await duplicateResponse.json() as {
    ok?: boolean;
    error?: string;
    errorCode?: string;
    issues?: string[];
  };
  expect(duplicatePayload.ok).toBe(false);
  expect(duplicatePayload.errorCode ?? duplicatePayload.error).toContain('service_area_conflict');
});

test('/ko/admin-builder/services exposes service source editor duplicate guard', async ({ page }) => {
  const scope = `service-source-duplicate-${Date.now().toString(36)}`;
  await page.goto('/ko/admin-builder/services', { waitUntil: 'domcontentloaded' });
  await expect(page.locator('[data-service-source-manager]')).toBeVisible();
  await expect(page.locator('[data-service-source-row="civil"]')).toBeVisible();

  await page.locator('[data-service-source-row="family"]').click();
  const duplicateResponse = await page.request.patch('/api/builder/services/family?locale=ko', {
    headers: mutationHeaders(scope),
    data: {
      slug: 'civil',
    },
  });
  expect(duplicateResponse.status()).toBe(409);
  const duplicatePayload = await duplicateResponse.json() as {
    ok?: boolean;
    error?: string;
    errorCode?: string;
    issues?: string[];
  };
  expect(duplicatePayload.ok).toBe(false);
  expect(`${duplicatePayload.errorCode ?? ''} ${duplicatePayload.error ?? ''}`).toContain('service_area_conflict');
});

test('/ko/admin-builder/services saves service slug overrides with redirect review', async ({ page }) => {
  const token = Date.now().toString(36);
  const scope = `service-source-save-${token}`;
  const targetSlug = `family-${token}`;
  const redirectNote = `auto:record-slug-rename(service-areas,family→${targetSlug})`;

  try {
    await page.goto('/ko/admin-builder/services', { waitUntil: 'domcontentloaded' });
    const saveResponse = await page.request.patch('/api/builder/services/family?locale=ko', {
      headers: mutationHeaders(scope),
      data: {
        slug: targetSlug,
      },
    });
    expect(saveResponse.status()).toBe(200);
    const savePayload = await saveResponse.json() as {
      ok?: boolean;
      record?: { sourceSlug?: string; slug?: string };
      slugRedirect?: { status?: string };
      error?: string;
    };
    expect(savePayload.ok, savePayload.error).toBe(true);
    expect(savePayload.record).toMatchObject({
      sourceSlug: 'family',
      slug: targetSlug,
    });
    expect(savePayload.slugRedirect?.status).toBe('created');

    await page.goto('/ko/admin-builder/services', { waitUntil: 'domcontentloaded' });
    await page.locator('[data-service-source-row="family"]').click();
    await expect(page.locator('[data-service-source-slug-input]')).toHaveValue(targetSlug, { timeout: 30_000 });
    await expect(page.locator('[data-service-source-public-url]')).toContainText(`/ko/services/${targetSlug}`);

    const redirects = await listRedirects(page.request, `${scope}-list`);
    expect(redirects).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          from: '/ko/services/family',
          to: `/ko/services/${targetSlug}`,
          type: 301,
          isActive: true,
          note: redirectNote,
        }),
      ]),
    );

    await expect.poll(async () => {
      const response = await page.request.get('/ko/services/family', {
        failOnStatusCode: false,
        maxRedirects: 0,
      });
      return {
        status: response.status(),
        location: response.headers().location ?? '',
      };
    }, { timeout: 10_000 }).toEqual(expect.objectContaining({
      status: 301,
      location: expect.stringContaining(`/ko/services/${targetSlug}`),
    }));

    const resetResponse = await page.request.delete('/api/builder/services/family?locale=ko', {
      headers: mutationHeaders(`${scope}-reset`),
    });
    expect(resetResponse.status()).toBe(200);
    const resetPayload = await resetResponse.json() as {
      ok?: boolean;
      record?: { sourceSlug?: string; slug?: string };
      slugRedirect?: { status?: string };
      error?: string;
    };
    expect(resetPayload.ok, resetPayload.error).toBe(true);
    expect(resetPayload.record).toMatchObject({
      sourceSlug: 'family',
      slug: 'family',
    });

    await page.goto('/ko/admin-builder/services', { waitUntil: 'domcontentloaded' });
    await page.locator('[data-service-source-row="family"]').click();
    await expect(page.locator('[data-service-source-slug-input]')).toHaveValue('family', { timeout: 30_000 });
    await expect(page.locator('[data-service-source-public-url]')).toContainText('/ko/services/family');
  } finally {
    await page.request.delete('/api/builder/services/family?locale=ko', {
      headers: mutationHeaders(`${scope}-reset`),
      failOnStatusCode: false,
    }).catch(() => undefined);
    const redirects = await listRedirects(page.request, `${scope}-cleanup`).catch(() => []);
    await Promise.all(
      redirects
        .filter((redirect) =>
          redirect.note?.includes('auto:record-slug-rename(service-areas,') &&
          (redirect.from.includes(targetSlug) || redirect.to.includes(targetSlug) || redirect.note.includes(targetSlug))
        )
        .map((redirect) => deleteRedirect(page.request, redirect.redirectId, `${scope}-cleanup`)),
    );
  }
});

test('lawyer source API saves reversible slug overrides with redirects', async ({ page }) => {
  const token = Date.now().toString(36);
  const scope = `lawyer-source-${token}`;
  const targetSlug = `wei-tseng-${token}`;
  const redirectNote = `auto:record-slug-rename(attorney-profiles,wei-tseng→${targetSlug})`;

  try {
    const saveResponse = await page.request.patch('/api/builder/lawyers/wei-tseng?locale=ko', {
      headers: mutationHeaders(`${scope}-save`),
      data: {
        slug: targetSlug,
        localized: { ko: { role: `테스트 역할 ${token}` } },
      },
    });
    expect(saveResponse.status()).toBe(200);
    const savePayload = await saveResponse.json() as {
      ok?: boolean;
      record?: { sourceSlug?: string; slug?: string; role?: string };
      slugRedirect?: { status?: string; redirects?: RedirectRecord[] };
      error?: string;
    };
    expect(savePayload.ok, savePayload.error).toBe(true);
    expect(savePayload.record).toMatchObject({
      sourceSlug: 'wei-tseng',
      slug: targetSlug,
      role: `테스트 역할 ${token}`,
    });
    expect(savePayload.slugRedirect?.status).toBe('created');

    const redirects = await listRedirects(page.request, `${scope}-list`);
    expect(redirects).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          from: '/ko/lawyers/wei-tseng',
          to: `/ko/lawyers/${targetSlug}`,
          type: 301,
          isActive: true,
          note: redirectNote,
        }),
      ]),
    );

    await expect.poll(async () => {
      const response = await page.request.get('/ko/lawyers/wei-tseng', {
        failOnStatusCode: false,
        maxRedirects: 0,
      });
      return {
        status: response.status(),
        location: response.headers().location ?? '',
      };
    }, { timeout: 10_000 }).toEqual(expect.objectContaining({
      status: 301,
      location: expect.stringContaining(`/ko/lawyers/${targetSlug}`),
    }));

    const resetResponse = await page.request.delete(`/api/builder/lawyers/${targetSlug}?locale=ko`, {
      headers: mutationHeaders(`${scope}-reset`),
    });
    expect(resetResponse.status()).toBe(200);
    const resetPayload = await resetResponse.json() as {
      ok?: boolean;
      record?: { sourceSlug?: string; slug?: string; role?: string };
      error?: string;
    };
    expect(resetPayload.ok, resetPayload.error).toBe(true);
    expect(resetPayload.record).toMatchObject({
      sourceSlug: 'wei-tseng',
      slug: 'wei-tseng',
    });
  } finally {
    await page.request.delete('/api/builder/lawyers/wei-tseng?locale=ko', {
      headers: mutationHeaders(`${scope}-reset-final`),
      failOnStatusCode: false,
    }).catch(() => undefined);
    const redirects = await listRedirects(page.request, `${scope}-cleanup`).catch(() => []);
    await Promise.all(
      redirects
        .filter((redirect) =>
          redirect.note?.includes('auto:record-slug-rename(attorney-profiles,') &&
          (redirect.from.includes(targetSlug) || redirect.to.includes(targetSlug) || redirect.note.includes(targetSlug))
        )
        .map((redirect) => deleteRedirect(page.request, redirect.redirectId, `${scope}-cleanup`)),
    );
  }
});

test('/ko/admin-builder/lawyers saves lawyer slug overrides with redirect review', async ({ page }) => {
  const token = Date.now().toString(36);
  const scope = `lawyer-source-ui-${token}`;
  const targetSlug = `wei-tseng-ui-${token}`;
  const redirectNote = `auto:record-slug-rename(attorney-profiles,wei-tseng→${targetSlug})`;

  try {
    await page.goto('/ko/admin-builder/lawyers', { waitUntil: 'domcontentloaded' });
    await expect(page.locator('[data-lawyer-source-manager]')).toBeVisible();
    await expect(page.locator('[data-lawyer-source-row="wei-tseng"]')).toBeVisible();
    await expect(page.locator('[data-lawyer-source-public-url]')).toContainText('/ko/lawyers/wei-tseng');

    const saveResponse = await page.request.patch('/api/builder/lawyers/wei-tseng?locale=ko', {
      headers: mutationHeaders(scope),
      data: {
        slug: targetSlug,
        localized: { ko: { role: `테스트 역할 UI ${token}` } },
      },
    });
    expect(saveResponse.status()).toBe(200);
    const savePayload = await saveResponse.json() as {
      ok?: boolean;
      record?: { sourceSlug?: string; slug?: string; role?: string };
      slugRedirect?: { status?: string };
      error?: string;
    };
    expect(savePayload.ok, savePayload.error).toBe(true);
    expect(savePayload.record).toMatchObject({
      sourceSlug: 'wei-tseng',
      slug: targetSlug,
      role: `테스트 역할 UI ${token}`,
    });
    expect(savePayload.slugRedirect?.status).toBe('created');

    await page.goto('/ko/admin-builder/lawyers', { waitUntil: 'domcontentloaded' });
    await page.locator('[data-lawyer-source-row="wei-tseng"]').click();

    await expect(page.locator('[data-lawyer-source-slug-input]')).toHaveValue(targetSlug);
    await expect(page.locator('[data-lawyer-source-public-url]')).toContainText(`/ko/lawyers/${targetSlug}`);

    const redirects = await listRedirects(page.request, `${scope}-list`);
    expect(redirects).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          from: '/ko/lawyers/wei-tseng',
          to: `/ko/lawyers/${targetSlug}`,
          type: 301,
          isActive: true,
          note: redirectNote,
        }),
      ]),
    );

    await expect.poll(async () => {
      const response = await page.request.get('/ko/lawyers/wei-tseng', {
        failOnStatusCode: false,
        maxRedirects: 0,
      });
      return {
        status: response.status(),
        location: response.headers().location ?? '',
      };
    }, { timeout: 10_000 }).toEqual(expect.objectContaining({
      status: 301,
      location: expect.stringContaining(`/ko/lawyers/${targetSlug}`),
    }));
  } finally {
    await page.request.delete('/api/builder/lawyers/wei-tseng?locale=ko', {
      headers: mutationHeaders(`${scope}-reset`),
      failOnStatusCode: false,
    }).catch(() => undefined);
    const redirects = await listRedirects(page.request, `${scope}-cleanup`).catch(() => []);
    await Promise.all(
      redirects
        .filter((redirect) =>
          redirect.note?.includes('auto:record-slug-rename(attorney-profiles,') &&
          (redirect.from.includes(targetSlug) || redirect.to.includes(targetSlug) || redirect.note.includes(targetSlug))
        )
        .map((redirect) => deleteRedirect(page.request, redirect.redirectId, `${scope}-cleanup`)),
    );
  }
});

test('/ko/admin-builder/services resets service slug overrides with redirect review', async ({ page }) => {
  const token = Date.now().toString(36);
  const scope = `service-source-ui-reset-${token}`;
  const targetSlug = `civil-litigation-ui-${token}`;
  const redirectNote = `auto:record-slug-rename(service-areas,civil→${targetSlug})`;

  try {
    const saveResponse = await page.request.patch('/api/builder/services/civil?locale=ko', {
      headers: mutationHeaders(scope),
      data: {
        slug: targetSlug,
      },
    });
    expect(saveResponse.status()).toBe(200);
    const savePayload = await saveResponse.json() as {
      ok?: boolean;
      record?: { sourceSlug?: string; slug?: string };
      slugRedirect?: { status?: string };
      error?: string;
    };
    expect(savePayload.ok, savePayload.error).toBe(true);
    expect(savePayload.record).toMatchObject({
      sourceSlug: 'civil',
      slug: targetSlug,
    });
    expect(savePayload.slugRedirect?.status).toBe('created');

    await page.goto('/ko/admin-builder/services', { waitUntil: 'domcontentloaded' });
    await page.locator('[data-service-source-row="civil"]').click();
    await expect(page.locator('[data-service-source-slug-input]')).toHaveValue(targetSlug, { timeout: 30_000 });
    await expect(page.locator('[data-service-source-reset]')).toBeVisible();

    const resetResponse = await page.request.delete('/api/builder/services/civil?locale=ko', {
      headers: mutationHeaders(`${scope}-reset`),
    });
    expect(resetResponse.status()).toBe(200);
    const resetPayload = await resetResponse.json() as {
      ok?: boolean;
      record?: { sourceSlug?: string; slug?: string };
      slugRedirect?: { status?: string; redirects?: RedirectRecord[] };
      error?: string;
    };
    expect(resetPayload.ok, resetPayload.error).toBe(true);
    expect(resetPayload.record).toMatchObject({
      sourceSlug: 'civil',
      slug: 'civil',
    });
    expect(resetPayload.slugRedirect?.status).toBe('created');
    expect(resetPayload.slugRedirect?.redirects).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          from: `/ko/services/${targetSlug}`,
          to: '/ko/services/civil',
        }),
      ]),
    );

    await page.goto('/ko/admin-builder/services', { waitUntil: 'domcontentloaded' });
    await page.locator('[data-service-source-row="civil"]').click();
    await expect(page.locator('[data-service-source-slug-input]')).toHaveValue('civil', { timeout: 30_000 });
    await expect(page.locator('[data-service-source-public-url]')).toContainText('/ko/services/civil');
  } finally {
    await page.request.delete('/api/builder/services/civil?locale=ko', {
      headers: mutationHeaders(`${scope}-reset-final`),
      failOnStatusCode: false,
    }).catch(() => undefined);
    const redirects = await listRedirects(page.request, `${scope}-cleanup`).catch(() => []);
    await Promise.all(
      redirects
        .filter((redirect) =>
          redirect.note?.includes('auto:record-slug-rename(service-areas,') &&
          (redirect.from.includes(targetSlug) || redirect.to.includes(targetSlug) || redirect.note.includes(targetSlug))
        )
        .map((redirect) => deleteRedirect(page.request, redirect.redirectId, `${scope}-cleanup`)),
    );
  }
});

test('/ko/admin-builder/lawyers resets lawyer slug overrides with redirect review', async ({ page }) => {
  const token = Date.now().toString(36);
  const scope = `lawyer-source-ui-reset-${token}`;
  const targetSlug = `wei-tseng-ui-${token}`;
  const redirectNote = `auto:record-slug-rename(attorney-profiles,wei-tseng→${targetSlug})`;

  try {
    const saveResponse = await page.request.patch('/api/builder/lawyers/wei-tseng?locale=ko', {
      headers: mutationHeaders(scope),
      data: {
        slug: targetSlug,
      },
    });
    expect(saveResponse.status()).toBe(200);
    const savePayload = await saveResponse.json() as {
      ok?: boolean;
      record?: { sourceSlug?: string; slug?: string };
      slugRedirect?: { status?: string };
      error?: string;
    };
    expect(savePayload.ok, savePayload.error).toBe(true);
    expect(savePayload.record).toMatchObject({
      sourceSlug: 'wei-tseng',
      slug: targetSlug,
    });
    expect(savePayload.slugRedirect?.status).toBe('created');

    await page.goto('/ko/admin-builder/lawyers', { waitUntil: 'domcontentloaded' });
    await page.locator('[data-lawyer-source-row="wei-tseng"]').click();
    await expect(page.locator('[data-lawyer-source-slug-input]')).toHaveValue(targetSlug, { timeout: 30_000 });
    await expect(page.locator('[data-lawyer-source-reset]')).toBeVisible();

    const resetResponse = await page.request.delete('/api/builder/lawyers/wei-tseng?locale=ko', {
      headers: mutationHeaders(`${scope}-reset`),
    });
    expect(resetResponse.status()).toBe(200);
    const resetPayload = await resetResponse.json() as {
      ok?: boolean;
      record?: { sourceSlug?: string; slug?: string };
      slugRedirect?: { status?: string; redirects?: RedirectRecord[] };
      error?: string;
    };
    expect(resetPayload.ok, resetPayload.error).toBe(true);
    expect(resetPayload.record).toMatchObject({
      sourceSlug: 'wei-tseng',
      slug: 'wei-tseng',
    });
    expect(resetPayload.slugRedirect?.status).toBe('created');
    expect(resetPayload.slugRedirect?.redirects).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          from: `/ko/lawyers/${targetSlug}`,
          to: '/ko/lawyers/wei-tseng',
        }),
      ]),
    );

    await page.goto('/ko/admin-builder/lawyers', { waitUntil: 'domcontentloaded' });
    await page.locator('[data-lawyer-source-row="wei-tseng"]').click();
    await expect(page.locator('[data-lawyer-source-slug-input]')).toHaveValue('wei-tseng', { timeout: 30_000 });
    await expect(page.locator('[data-lawyer-source-public-url]')).toContainText('/ko/lawyers/wei-tseng');
  } finally {
    await page.request.delete('/api/builder/lawyers/wei-tseng?locale=ko', {
      headers: mutationHeaders(`${scope}-reset-final`),
      failOnStatusCode: false,
    }).catch(() => undefined);
    const redirects = await listRedirects(page.request, `${scope}-cleanup`).catch(() => []);
    await Promise.all(
      redirects
        .filter((redirect) =>
          redirect.note?.includes('auto:record-slug-rename(attorney-profiles,') &&
          (redirect.from.includes(targetSlug) || redirect.to.includes(targetSlug) || redirect.note.includes(targetSlug))
        )
        .map((redirect) => deleteRedirect(page.request, redirect.redirectId, `${scope}-cleanup`)),
    );
  }
});

test('/ko/admin-builder/services and lawyers support keyboard source editing', async ({ page }) => {
  const token = Date.now().toString(36);
  const scope = `source-keyboard-${token}`;
  const serviceTitleDraft = `키보드 서비스 ${token}`;
  const lawyerSummaryDraft = `키보드 요약 ${token}\n두 번째 줄 ${token}`;

  let originalServiceTitle = '';
  let originalLawyerSummary = '';

  try {
    await page.goto('/ko/admin-builder/services', { waitUntil: 'domcontentloaded' });
    await expect(page.locator('[data-service-source-manager]')).toBeVisible();
    await page.locator('[data-service-source-row="family"]').click();

    const serviceTitleInput = page.locator('[data-service-source-title-input]');
    originalServiceTitle = await serviceTitleInput.inputValue();
    await serviceTitleInput.fill(serviceTitleDraft);
    await serviceTitleInput.press('Escape');
    await expect(serviceTitleInput).toHaveValue(originalServiceTitle);
    await serviceTitleInput.fill(serviceTitleDraft);
    await Promise.all([
      page.waitForResponse((response) => (
        response.request().method() === 'PATCH' &&
        response.url().includes('/api/builder/services/')
      )),
      serviceTitleInput.press(`${shortcutModifier}+S`),
    ]);
    await expect(serviceTitleInput).toHaveValue(serviceTitleDraft);

    await page.goto('/ko/admin-builder/lawyers', { waitUntil: 'domcontentloaded' });
    await expect(page.locator('[data-lawyer-source-manager]')).toBeVisible();
    await page.locator('[data-lawyer-source-row="wei-tseng"]').click();

    const lawyerSummaryInput = page.locator('[data-lawyer-source-summary-input]');
    originalLawyerSummary = await lawyerSummaryInput.inputValue();
    await lawyerSummaryInput.fill(lawyerSummaryDraft);
    await lawyerSummaryInput.press('Escape');
    await expect(lawyerSummaryInput).toHaveValue(originalLawyerSummary);
    await lawyerSummaryInput.fill(lawyerSummaryDraft);
    await Promise.all([
      page.waitForResponse((response) => (
        response.request().method() === 'PATCH' &&
        response.url().includes('/api/builder/lawyers/')
      )),
      lawyerSummaryInput.press(`${shortcutModifier}+S`),
    ]);
    await expect(lawyerSummaryInput).toHaveValue(lawyerSummaryDraft);
  } finally {
    if (originalServiceTitle) {
      await page.request.patch('/api/builder/services/family?locale=ko', {
        headers: mutationHeaders(`${scope}-service-restore`),
        data: { title: { ko: originalServiceTitle } },
      }).catch(() => undefined);
    }
    if (originalLawyerSummary) {
      await page.request.patch('/api/builder/lawyers/wei-tseng?locale=ko', {
        headers: mutationHeaders(`${scope}-lawyer-restore`),
        data: {
          localized: {
            ko: {
              summary: originalLawyerSummary
                .split(/\r?\n/)
                .map((item) => item.trim())
                .filter(Boolean),
            },
          },
        },
      }).catch(() => undefined);
    }
  }
});

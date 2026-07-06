import { expect, type APIRequestContext, type Page } from '@playwright/test';
import {
  makeRepeaterLoadingDocument,
  type RepeaterLoadingDocument,
} from './repeater-canvas-loading-document';

type DatasetFilter = {
  readonly fieldId: string;
  readonly operator: string;
  readonly value: string;
};

type DatasetSort = {
  readonly fieldId: string;
  readonly direction: string;
};

export type DatasetBindingPayload = {
  readonly collectionId?: string;
  readonly mode?: string;
  readonly filters?: readonly DatasetFilter[];
  readonly sort?: readonly DatasetSort[];
  readonly limit?: number;
};

export function mutationHeaders(scope: string): Record<string, string> {
  const safeScope = scope.replace(/[^a-z0-9-]/gi, '-').slice(-48) || 'repeater-loading';
  return { 'x-forwarded-for': `pw-${safeScope}` };
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function expectString(value: unknown, label: string): string {
  if (typeof value !== 'string' || value.length === 0) {
    throw new Error(`Expected ${label} to be a non-empty string.`);
  }
  return value;
}

function expectNumber(value: unknown, label: string): number {
  if (typeof value !== 'number' || !Number.isFinite(value)) {
    throw new Error(`Expected ${label} to be a finite number.`);
  }
  return value;
}

function isDatasetFilter(value: unknown): value is DatasetFilter {
  return isRecord(value)
    && typeof value.fieldId === 'string'
    && typeof value.operator === 'string'
    && typeof value.value === 'string';
}

function isDatasetSort(value: unknown): value is DatasetSort {
  return isRecord(value)
    && typeof value.fieldId === 'string'
    && typeof value.direction === 'string';
}

export async function currentDraftRevision(
  request: APIRequestContext,
  pageId: string,
  scope: string,
): Promise<number> {
  const response = await request.get(`/api/builder/site/pages/${encodeURIComponent(pageId)}/draft?locale=ko`, {
    headers: mutationHeaders(scope),
  });
  expect(response.status()).toBe(200);
  const payload: unknown = await response.json();
  if (!isRecord(payload) || !isRecord(payload.draft)) {
    throw new Error('Expected draft response payload.');
  }
  return expectNumber(payload.draft.revision, 'draft revision');
}

export async function putDraftDocument(
  request: APIRequestContext,
  pageId: string,
  expectedRevision: number,
  document: RepeaterLoadingDocument,
  scope: string,
): Promise<void> {
  const response = await request.put(`/api/builder/site/pages/${encodeURIComponent(pageId)}/draft?locale=ko`, {
    headers: mutationHeaders(scope),
    data: { expectedRevision, document },
  });
  expect(response.status()).toBe(200);
  const payload: unknown = await response.json();
  if (!isRecord(payload) || payload.ok !== true) {
    throw new Error('Expected draft save to succeed.');
  }
}

export async function saveRepeaterLoadingDraft(
  request: APIRequestContext,
  pageId: string,
  token: string,
  scope: string,
): Promise<void> {
  const revision = await currentDraftRevision(request, pageId, scope);
  await putDraftDocument(request, pageId, revision, makeRepeaterLoadingDocument(token), scope);
}

export async function readHomeDatasetTarget(
  request: APIRequestContext,
  targetId: string,
  scope: string,
): Promise<{ readonly revision: number; readonly binding: DatasetBindingPayload }> {
  const response = await request.get('/api/builder/sites/default/pages/home/datasets?locale=ko', {
    headers: mutationHeaders(scope),
  });
  expect(response.status()).toBe(200);
  const payload: unknown = await response.json();
  if (!isRecord(payload) || !Array.isArray(payload.targets)) {
    throw new Error('Expected dataset target response payload.');
  }
  const target = payload.targets.find((entry): entry is Record<string, unknown> => (
    isRecord(entry) && entry.targetId === targetId
  ));
  if (!target || !isRecord(target.currentBinding)) {
    throw new Error(`Missing dataset target ${targetId}.`);
  }
  const binding = target.currentBinding;
  return {
    revision: expectNumber(payload.revision, 'dataset revision'),
    binding: {
      collectionId: typeof binding.collectionId === 'string' ? binding.collectionId : undefined,
      mode: typeof binding.mode === 'string' ? binding.mode : undefined,
      filters: Array.isArray(binding.filters) ? binding.filters.filter(isDatasetFilter) : [],
      sort: Array.isArray(binding.sort) ? binding.sort.filter(isDatasetSort) : [],
      limit: typeof binding.limit === 'number' ? binding.limit : undefined,
    },
  };
}

export async function putHomeDatasetTarget(
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
  const payload: unknown = await response.json();
  if (!isRecord(payload) || payload.ok !== true) {
    throw new Error('Expected dataset target save to succeed.');
  }
}

export async function createRepeaterLoadingPage(
  request: APIRequestContext,
  slug: string,
  token: string,
): Promise<string> {
  const response = await request.post('/api/builder/site/pages', {
    data: { locale: 'ko', slug, title: `Repeater loading ${token}` },
    headers: mutationHeaders(slug),
  });
  expect(response.status()).toBe(200);
  const payload: unknown = await response.json();
  if (!isRecord(payload) || payload.success !== true) {
    throw new Error('Expected page creation to succeed.');
  }
  return expectString(payload.pageId, 'created page id');
}

export async function deleteRepeaterLoadingPage(
  request: APIRequestContext,
  pageId: string,
  scope: string,
): Promise<void> {
  await request.delete(`/api/builder/site/pages/${encodeURIComponent(pageId)}?locale=ko`, {
    headers: mutationHeaders(scope),
  }).catch(() => undefined);
}

export async function selectLayerNode(page: Page, nodeId: string): Promise<void> {
  const layersPanel = page.locator('[data-builder-layers-panel="true"]').first();
  if (!(await layersPanel.isVisible().catch(() => false))) {
    await page.getByRole('button', { name: /^Layers$|^레이어$/ }).click({ force: true });
    await expect(layersPanel).toBeVisible();
  }
  await page.locator('[data-builder-layer-search="true"]').fill(nodeId);
  const layerRow = page.locator(`[data-builder-layer-row="${nodeId}"]`).first();
  await expect(layerRow).toBeVisible();
  await layerRow.click({ force: true });
  await expect(page.locator(`[data-node-id="${nodeId}"]`).first()).toHaveAttribute('data-selected', 'true');
}

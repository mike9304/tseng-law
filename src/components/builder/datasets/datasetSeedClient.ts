'use client';

import type { Locale } from '@/lib/locales';

type DatasetSeedRequest = {
  readonly locale: Locale;
  readonly siteId: string;
  readonly pageKey: string;
  readonly targetId: string;
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === 'object' && !Array.isArray(value);
}

function readPayloadError(payload: unknown, fallback: string): string {
  if (!isRecord(payload)) return fallback;
  return typeof payload.error === 'string' ? payload.error : fallback;
}

export function resolveBuilderDatasetClientUrl(path: string): string {
  if (typeof window === 'undefined') return path;
  return new URL(path, window.location.origin).toString();
}

function decodeUrlCredential(value: string): string {
  try {
    return decodeURIComponent(value);
  } catch {
    return value;
  }
}

function readNavigationCredentialUrl(): URL | null {
  if (typeof window === 'undefined' || typeof performance === 'undefined') return null;
  const navigationEntry = performance.getEntriesByType('navigation')[0];
  const navigationUrl = navigationEntry?.name ?? '';
  if (!navigationUrl) return null;

  try {
    const parsedUrl = new URL(navigationUrl);
    return parsedUrl.username ? parsedUrl : null;
  } catch {
    return null;
  }
}

export function buildBuilderDatasetRequestHeaders(
  headers: Record<string, string> = {},
): Record<string, string> {
  if (typeof btoa === 'undefined') return headers;
  const credentialUrl = readNavigationCredentialUrl();
  if (!credentialUrl) return headers;
  const username = decodeUrlCredential(credentialUrl.username);
  const password = decodeUrlCredential(credentialUrl.password);
  return {
    ...headers,
    Authorization: `Basic ${btoa(`${username}:${password}`)}`,
  };
}

function datasetEndpoint({ locale, pageKey, siteId }: Omit<DatasetSeedRequest, 'targetId'>): string {
  return resolveBuilderDatasetClientUrl(
    `/api/builder/sites/${encodeURIComponent(siteId)}/pages/${encodeURIComponent(pageKey)}/datasets?locale=${encodeURIComponent(locale)}`,
  );
}

function datasetSeedEndpoint(request: DatasetSeedRequest): string {
  return resolveBuilderDatasetClientUrl(
    `/api/builder/sites/${encodeURIComponent(request.siteId)}/pages/${encodeURIComponent(request.pageKey)}/datasets/seed?locale=${encodeURIComponent(request.locale)}`,
  );
}

export async function readCurrentDatasetRevision(request: Omit<DatasetSeedRequest, 'targetId'>): Promise<number> {
  const response = await fetch(datasetEndpoint(request), {
    credentials: 'same-origin',
    headers: buildBuilderDatasetRequestHeaders(),
  });
  const payload: unknown = await response.json();
  if (!response.ok || !isRecord(payload) || payload.ok !== true || typeof payload.revision !== 'number') {
    throw new Error(readPayloadError(payload, 'Failed to load the latest dataset revision.'));
  }
  return payload.revision;
}

export async function seedDatasetTargetWithCurrentRevision(request: DatasetSeedRequest): Promise<void> {
  const expectedRevision = await readCurrentDatasetRevision(request);
  const response = await fetch(datasetSeedEndpoint(request), {
    method: 'POST',
    credentials: 'same-origin',
    headers: buildBuilderDatasetRequestHeaders({ 'Content-Type': 'application/json' }),
    body: JSON.stringify({
      targetId: request.targetId,
      expectedRevision,
    }),
  });
  const payload: unknown = await response.json();
  if (!response.ok || !isRecord(payload) || payload.ok !== true) {
    throw new Error(readPayloadError(payload, 'Failed to seed dataset binding.'));
  }
}

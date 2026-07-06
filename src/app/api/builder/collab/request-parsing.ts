import { resolveBuilderSiteIdFromRequest } from '@/lib/builder/site/admin-routing';

const MAX_COLLAB_ID_LENGTH = 200;

export function normalizeCollabId(value: unknown): string | null {
  if (typeof value !== 'string') return null;
  const trimmed = value.trim();
  if (!trimmed || trimmed.length > MAX_COLLAB_ID_LENGTH) return null;
  return trimmed;
}

export function optionalCollabId(value: unknown): string | undefined {
  if (value === undefined || value === null) return undefined;
  return normalizeCollabId(value) ?? undefined;
}

export function resolveCollabSiteIdFromRequest(
  request: Request,
  explicitSiteId?: unknown,
): string {
  const explicit = typeof explicitSiteId === 'string' ? explicitSiteId : null;
  return resolveBuilderSiteIdFromRequest(request, explicit);
}

function isJsonObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

export async function readJsonObject(request: Request): Promise<Record<string, unknown> | null> {
  const value: unknown = await request.json();
  if (!isJsonObject(value)) return null;
  return value;
}

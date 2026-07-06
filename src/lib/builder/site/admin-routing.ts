import {
  DEFAULT_BUILDER_SITE_ID,
  LEGACY_BUILDER_SITE_ID,
} from '@/lib/builder/constants';
import { normalizeBuilderSiteId } from '@/lib/builder/site/identity';

function hasLegacyDefaultSiteId(value: string | null | undefined): boolean {
  const trimmed = value?.trim();
  return !trimmed || trimmed === LEGACY_BUILDER_SITE_ID || trimmed === DEFAULT_BUILDER_SITE_ID;
}

function normalizeExplicitSiteId(value: string | null | undefined): string | null {
  if (!value?.trim()) return null;
  return normalizeBuilderSiteId(value);
}

function readSiteIdFromUrl(value: string | null): string | null {
  if (!value) return null;

  try {
    return normalizeExplicitSiteId(new URL(value).searchParams.get('siteId'));
  } catch (error) {
    if (error instanceof TypeError) return null;
    throw error;
  }
}

export function resolveBuilderSiteIdFromValue(value: string | null | undefined): string {
  return normalizeBuilderSiteId(value);
}

export function resolveBuilderSiteIdFromRequest(
  request: Request,
  explicitSiteId?: string | null,
): string {
  const querySiteId = readSiteIdFromUrl(request.url);
  if (querySiteId) return querySiteId;

  const refererSiteId = readSiteIdFromUrl(request.headers.get('referer'));
  if (hasLegacyDefaultSiteId(explicitSiteId) && refererSiteId) {
    return refererSiteId;
  }

  return normalizeExplicitSiteId(explicitSiteId) ?? DEFAULT_BUILDER_SITE_ID;
}

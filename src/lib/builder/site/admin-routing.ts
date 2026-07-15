import {
  DEFAULT_BUILDER_SITE_ID,
  LEGACY_BUILDER_SITE_ID,
} from '@/lib/builder/constants';
import {
  BuilderSiteIdentityError,
  normalizeBuilderSiteId,
  requireBuilderSiteIdForMutation,
} from '@/lib/builder/site/identity';

type RawSiteId =
  | { readonly present: false }
  | { readonly present: true; readonly values: readonly string[] };

export type BuilderMutationSiteIdResolution =
  | { readonly ok: true; readonly siteId: string }
  | { readonly ok: false; readonly response: Response };

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

function readRawSiteIdFromUrl(value: string | null): RawSiteId {
  if (!value) return { present: false };

  try {
    const values = new URL(value).searchParams.getAll('siteId');
    if (values.length === 0) return { present: false };
    return { present: true, values };
  } catch (error) {
    if (error instanceof TypeError) return { present: false };
    throw error;
  }
}

function requireSuppliedMutationSiteId(value: unknown): string {
  if (typeof value !== 'string' || value.length === 0) {
    throw new BuilderSiteIdentityError(
      'MALFORMED_SITE_ID',
      typeof value === 'string' ? value : `[${Array.isArray(value) ? 'array' : typeof value}]`,
    );
  }
  return requireBuilderSiteIdForMutation(value);
}

function invalidMutationSiteIdResponse(): Response {
  return Response.json(
    {
      ok: false,
      success: false,
      error: 'Invalid site identifier.',
      errorCode: 'invalid_site_id',
    },
    { status: 400 },
  );
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

/**
 * Strict request resolver for create/update/delete boundaries.
 *
 * Unlike the read-compatible resolver above, this preserves whether a siteId
 * was supplied. Omission may use the historical default, while a supplied
 * empty, non-string, conflicting duplicate, serialized-missing, or unsafe
 * value returns a sanitized 400 result before persistence can be reached.
 */
export function resolveBuilderSiteIdForMutationFromRequest(
  request: Request,
  explicitSiteId?: unknown,
): BuilderMutationSiteIdResolution {
  try {
    const querySiteId = readRawSiteIdFromUrl(request.url);
    const explicitWasSupplied = explicitSiteId !== undefined;
    const explicitIsLegacyDefault = typeof explicitSiteId === 'string' && (
      explicitSiteId === LEGACY_BUILDER_SITE_ID || explicitSiteId === DEFAULT_BUILDER_SITE_ID
    );
    const refererSiteId = readRawSiteIdFromUrl(request.headers.get('referer'));

    const contextualSiteIds = [
      ...(querySiteId.present
        ? querySiteId.values.map(requireSuppliedMutationSiteId)
        : []),
      ...(refererSiteId.present
        ? refererSiteId.values.map(requireSuppliedMutationSiteId)
        : []),
    ];
    const suppliedSiteIds = [...contextualSiteIds];

    if (explicitWasSupplied) {
      const normalizedExplicitSiteId = requireSuppliedMutationSiteId(explicitSiteId);
      // Older editor clients send the canonical/default id as a placeholder
      // while the selected workspace lives in the request URL or referer.
      // Preserve that fallback contract, but never let a custom body value
      // bypass comparison with the other supplied signals.
      if (!explicitIsLegacyDefault || contextualSiteIds.length === 0) {
        suppliedSiteIds.push(normalizedExplicitSiteId);
      }
    }

    if (new Set(suppliedSiteIds).size > 1) {
      return { ok: false, response: invalidMutationSiteIdResponse() };
    }

    return { ok: true, siteId: suppliedSiteIds[0] ?? DEFAULT_BUILDER_SITE_ID };
  } catch (error) {
    if (error instanceof BuilderSiteIdentityError) {
      return { ok: false, response: invalidMutationSiteIdResponse() };
    }
    throw error;
  }
}

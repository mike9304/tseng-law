import {
  DEFAULT_BUILDER_SITE_ID,
  LEGACY_BUILDER_SITE_ID,
} from '@/lib/builder/constants';

// Site ids are joined into Blob pathnames and local filesystem paths
// (persistence, collab stores), so anything outside a plain slug must
// never pass through — fall back to the default site like other invalid
// inputs instead of letting `..`/`/` reach path.join.
const SAFE_BUILDER_SITE_ID = /^[a-z0-9][a-z0-9_-]*$/i;

// A client bug that string-interpolates a missing id (`${siteId}`) sends the
// literal words below; treating them as real site ids silently writes drafts
// into a parallel namespace (seen as runtime-data/builder-site/undefined/).
const SERIALIZED_MISSING_IDS = new Set(['undefined', 'null']);

export type BuilderSiteIdentityErrorCode =
  | 'SERIALIZED_MISSING_SITE_ID'
  | 'MALFORMED_SITE_ID';

/**
 * Raised when an untrusted site id is not safe to use at a persistence
 * mutation boundary. Reads keep their legacy normalization behavior, but a
 * malformed write target must never be redirected to the canonical site.
 */
export class BuilderSiteIdentityError extends Error {
  readonly code: BuilderSiteIdentityErrorCode;
  readonly input: string;

  constructor(code: BuilderSiteIdentityErrorCode, input: string) {
    super(`Invalid builder site id for mutation (${code}): ${JSON.stringify(input)}`);
    this.name = 'BuilderSiteIdentityError';
    this.code = code;
    this.input = input;
  }
}

export function normalizeBuilderSiteId(input: string | null | undefined): string {
  const value = input?.trim();
  if (!value || value === LEGACY_BUILDER_SITE_ID || value === DEFAULT_BUILDER_SITE_ID) {
    return DEFAULT_BUILDER_SITE_ID;
  }
  if (SERIALIZED_MISSING_IDS.has(value.toLowerCase())) {
    return DEFAULT_BUILDER_SITE_ID;
  }
  if (!SAFE_BUILDER_SITE_ID.test(value)) {
    return DEFAULT_BUILDER_SITE_ID;
  }
  return value;
}

/**
 * Resolve a site id for a write/delete/create operation without silently
 * converting malformed user input into the canonical site namespace.
 *
 * Truly missing legacy values and the known legacy alias intentionally retain
 * their historical default-site behavior. Serialized missing values and any
 * non-slug value are rejected. In particular, whitespace-only input is not
 * equivalent to an explicitly empty string at a mutation boundary.
 */
export function requireBuilderSiteIdForMutation(
  input: string | null | undefined,
): string {
  if (input === null || input === undefined || input === '') {
    return DEFAULT_BUILDER_SITE_ID;
  }
  if (input === LEGACY_BUILDER_SITE_ID || input === DEFAULT_BUILDER_SITE_ID) {
    return DEFAULT_BUILDER_SITE_ID;
  }
  if (SERIALIZED_MISSING_IDS.has(input.toLowerCase())) {
    throw new BuilderSiteIdentityError('SERIALIZED_MISSING_SITE_ID', input);
  }
  if (!SAFE_BUILDER_SITE_ID.test(input)) {
    throw new BuilderSiteIdentityError('MALFORMED_SITE_ID', input);
  }
  return input;
}

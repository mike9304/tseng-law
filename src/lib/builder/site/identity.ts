import {
  DEFAULT_BUILDER_SITE_ID,
  LEGACY_BUILDER_SITE_ID,
} from '@/lib/builder/constants';

// Site ids are joined into Blob pathnames and local filesystem paths
// (persistence, collab stores), so anything outside a plain slug must
// never pass through — fall back to the default site like other invalid
// inputs instead of letting `..`/`/` reach path.join.
const SAFE_BUILDER_SITE_ID = /^[a-z0-9][a-z0-9_-]*$/i;

export function normalizeBuilderSiteId(input: string | null | undefined): string {
  const value = input?.trim();
  if (!value || value === LEGACY_BUILDER_SITE_ID || value === DEFAULT_BUILDER_SITE_ID) {
    return DEFAULT_BUILDER_SITE_ID;
  }
  if (!SAFE_BUILDER_SITE_ID.test(value)) {
    return DEFAULT_BUILDER_SITE_ID;
  }
  return value;
}

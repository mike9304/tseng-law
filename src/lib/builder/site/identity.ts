import {
  DEFAULT_BUILDER_SITE_ID,
  LEGACY_BUILDER_SITE_ID,
} from '@/lib/builder/constants';

export function normalizeBuilderSiteId(input: string | null | undefined): string {
  const value = input?.trim();
  if (!value || value === LEGACY_BUILDER_SITE_ID || value === DEFAULT_BUILDER_SITE_ID) {
    return DEFAULT_BUILDER_SITE_ID;
  }
  return value;
}

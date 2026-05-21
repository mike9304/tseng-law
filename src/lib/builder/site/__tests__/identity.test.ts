import { describe, expect, it } from 'vitest';
import { DEFAULT_BUILDER_SITE_ID, LEGACY_BUILDER_SITE_ID } from '@/lib/builder/constants';
import { isDefaultBuilderSiteId } from '@/lib/builder/site';

describe('builder site identity', () => {
  it('accepts canonical and legacy default site ids for builder API routes', () => {
    expect(isDefaultBuilderSiteId(DEFAULT_BUILDER_SITE_ID)).toBe(true);
    expect(isDefaultBuilderSiteId(LEGACY_BUILDER_SITE_ID)).toBe(true);
    expect(isDefaultBuilderSiteId('other-site')).toBe(false);
    expect(isDefaultBuilderSiteId(null)).toBe(false);
  });
});

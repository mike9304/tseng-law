import { describe, expect, it } from 'vitest';
import { DEFAULT_BUILDER_SITE_ID, LEGACY_BUILDER_SITE_ID } from '@/lib/builder/constants';
import { isDefaultBuilderSiteId } from '@/lib/builder/site';
import { normalizeBuilderSiteId } from '@/lib/builder/site/identity';

describe('builder site identity', () => {
  it('accepts canonical and legacy default site ids for builder API routes', () => {
    expect(isDefaultBuilderSiteId(DEFAULT_BUILDER_SITE_ID)).toBe(true);
    expect(isDefaultBuilderSiteId(LEGACY_BUILDER_SITE_ID)).toBe(true);
    expect(isDefaultBuilderSiteId('other-site')).toBe(false);
    expect(isDefaultBuilderSiteId(null)).toBe(false);
  });
});

describe('normalizeBuilderSiteId', () => {
  it('maps empty and known aliases to the default site', () => {
    expect(normalizeBuilderSiteId(undefined)).toBe(DEFAULT_BUILDER_SITE_ID);
    expect(normalizeBuilderSiteId(null)).toBe(DEFAULT_BUILDER_SITE_ID);
    expect(normalizeBuilderSiteId('')).toBe(DEFAULT_BUILDER_SITE_ID);
    expect(normalizeBuilderSiteId('  ')).toBe(DEFAULT_BUILDER_SITE_ID);
    expect(normalizeBuilderSiteId(LEGACY_BUILDER_SITE_ID)).toBe(DEFAULT_BUILDER_SITE_ID);
    expect(normalizeBuilderSiteId(DEFAULT_BUILDER_SITE_ID)).toBe(DEFAULT_BUILDER_SITE_ID);
  });

  it('passes through plain slug ids', () => {
    expect(normalizeBuilderSiteId('tseng-law-main-site')).toBe('tseng-law-main-site');
    expect(normalizeBuilderSiteId('Site_2')).toBe('Site_2');
  });

  it('rejects path-traversal and separator payloads instead of letting them reach path.join', () => {
    expect(normalizeBuilderSiteId('../../etc/passwd')).toBe(DEFAULT_BUILDER_SITE_ID);
    expect(normalizeBuilderSiteId('..')).toBe(DEFAULT_BUILDER_SITE_ID);
    expect(normalizeBuilderSiteId('a/b')).toBe(DEFAULT_BUILDER_SITE_ID);
    expect(normalizeBuilderSiteId('a\\b')).toBe(DEFAULT_BUILDER_SITE_ID);
    expect(normalizeBuilderSiteId('a.b')).toBe(DEFAULT_BUILDER_SITE_ID);
    expect(normalizeBuilderSiteId('-leading-dash')).toBe(DEFAULT_BUILDER_SITE_ID);
    expect(normalizeBuilderSiteId('site id with spaces')).toBe(DEFAULT_BUILDER_SITE_ID);
  });
});

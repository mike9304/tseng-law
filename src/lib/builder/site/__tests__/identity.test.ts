import { describe, expect, it } from 'vitest';
import { DEFAULT_BUILDER_SITE_ID, LEGACY_BUILDER_SITE_ID } from '@/lib/builder/constants';
import { isDefaultBuilderSiteId } from '@/lib/builder/site';
import {
  BuilderSiteIdentityError,
  normalizeBuilderSiteId,
  requireBuilderSiteIdForMutation,
} from '@/lib/builder/site/identity';

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

  it('maps serialized-missing ids (undefined/null strings) to the default site', () => {
    expect(normalizeBuilderSiteId('undefined')).toBe(DEFAULT_BUILDER_SITE_ID);
    expect(normalizeBuilderSiteId('Undefined')).toBe(DEFAULT_BUILDER_SITE_ID);
    expect(normalizeBuilderSiteId('null')).toBe(DEFAULT_BUILDER_SITE_ID);
    expect(normalizeBuilderSiteId('NULL')).toBe(DEFAULT_BUILDER_SITE_ID);
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

describe('requireBuilderSiteIdForMutation', () => {
  it('retains only the explicit legacy missing/default mappings', () => {
    expect(requireBuilderSiteIdForMutation(undefined)).toBe(DEFAULT_BUILDER_SITE_ID);
    expect(requireBuilderSiteIdForMutation(null)).toBe(DEFAULT_BUILDER_SITE_ID);
    expect(requireBuilderSiteIdForMutation('')).toBe(DEFAULT_BUILDER_SITE_ID);
    expect(requireBuilderSiteIdForMutation(LEGACY_BUILDER_SITE_ID)).toBe(DEFAULT_BUILDER_SITE_ID);
    expect(requireBuilderSiteIdForMutation(DEFAULT_BUILDER_SITE_ID)).toBe(DEFAULT_BUILDER_SITE_ID);
  });

  it('passes safe custom ids without imposing a production-site policy', () => {
    expect(requireBuilderSiteIdForMutation('customer-site_2')).toBe('customer-site_2');
    expect(requireBuilderSiteIdForMutation('Site_2')).toBe('Site_2');
  });

  it.each(['undefined', 'Undefined', 'null', 'NULL'])(
    'rejects serialized missing id %s',
    (input) => {
      expect(() => requireBuilderSiteIdForMutation(input)).toThrowError(
        expect.objectContaining({
          name: 'BuilderSiteIdentityError',
          code: 'SERIALIZED_MISSING_SITE_ID',
          input,
        }),
      );
    },
  );

  it.each(['  ', '../../x', '..', 'a/b', 'a\\b', 'a.b', '-site', 'site id'])(
    'rejects malformed mutation id %s',
    (input) => {
      expect(() => requireBuilderSiteIdForMutation(input)).toThrow(BuilderSiteIdentityError);
      expect(() => requireBuilderSiteIdForMutation(input)).toThrowError(
        expect.objectContaining({ code: 'MALFORMED_SITE_ID', input }),
      );
    },
  );
});

import { describe, expect, it } from 'vitest';
import { findBuilderCollectionRecordSeo, readBuilderCollectionRecordPreviews } from '@/lib/builder/cms';

describe('findBuilderCollectionRecordSeo', () => {
  it('returns seo preview for a matching column record slug', () => {
    const previews = readBuilderCollectionRecordPreviews('columns', 'ko');
    expect(previews.length).toBeGreaterThan(0);
    const target = previews[0]!;
    const seo = findBuilderCollectionRecordSeo('columns', 'ko', target.recordId);
    expect(seo).not.toBeNull();
    expect(seo).toMatchObject({
      title: target.seo.title,
      description: target.seo.description,
      canonicalPath: target.seo.canonicalPath,
      noIndex: target.seo.noIndex,
    });
  });

  it('returns service-area seo for a matching slug', () => {
    const seo = findBuilderCollectionRecordSeo('service-areas', 'ko', 'investment');
    expect(seo).not.toBeNull();
    expect(seo?.canonicalPath).toBe('/ko/services/investment');
    expect(seo?.title).toBeTruthy();
    expect(seo?.description).toBeTruthy();
  });

  it('returns null when slug is empty', () => {
    expect(findBuilderCollectionRecordSeo('columns', 'ko', '')).toBeNull();
    expect(findBuilderCollectionRecordSeo('columns', 'ko', '   ')).toBeNull();
    expect(findBuilderCollectionRecordSeo('columns', 'ko', null)).toBeNull();
    expect(findBuilderCollectionRecordSeo('columns', 'ko', undefined)).toBeNull();
  });

  it('returns null when slug does not match any record', () => {
    expect(findBuilderCollectionRecordSeo('columns', 'ko', 'no-such-record')).toBeNull();
    expect(findBuilderCollectionRecordSeo('service-areas', 'ko', 'no-such-service')).toBeNull();
  });

  it('returns different seo data per locale for the same record id', () => {
    const ko = findBuilderCollectionRecordSeo('service-areas', 'ko', 'investment');
    const en = findBuilderCollectionRecordSeo('service-areas', 'en', 'investment');
    expect(ko).not.toBeNull();
    expect(en).not.toBeNull();
    expect(ko?.title).not.toBe(en?.title);
    expect(ko?.canonicalPath).toBe('/ko/services/investment');
    expect(en?.canonicalPath).toBe('/en/services/investment');
  });
});

import { describe, expect, it } from 'vitest';
import {
  buildBuilderCmsCollectionHref,
  buildBuilderPageDatasetHref,
  buildBuilderPageHref,
} from '@/lib/builder/hrefs';

describe('builder site href helpers', () => {
  it('builds the dataset binding editor href', () => {
    expect(buildBuilderPageDatasetHref('ko', 'home')).toBe('/ko/builder/home/datasets');
    expect(buildBuilderPageDatasetHref('ko', 'home', { targetId: 'home.services.list' })).toBe(
      '/ko/builder/home/datasets?targetId=home.services.list',
    );
    expect(
      buildBuilderPageDatasetHref('ko', 'home', {
        targetId: 'home.insights.feed',
        copyFromTargetId: 'home.services.list',
      }),
    ).toBe('/ko/builder/home/datasets?targetId=home.insights.feed&copyFromTargetId=home.services.list');
  });

  it('keeps the canonical page href intact', () => {
    expect(buildBuilderPageHref('ko', 'home', 'edit')).toBe('/ko/builder/home');
    expect(buildBuilderPageHref('ko', 'home', 'preview')).toBe('/ko/builder/home?mode=preview');
  });

  it('builds the CMS collection deep link href', () => {
    expect(buildBuilderCmsCollectionHref('ko', 'service-areas')).toBe(
      '/ko/admin-builder/cms?collectionId=service-areas',
    );
  });
});

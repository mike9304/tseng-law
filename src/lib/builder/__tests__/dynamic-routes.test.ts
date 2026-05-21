import { describe, expect, it } from 'vitest';
import { readBuilderDynamicRouteDetail } from '@/lib/builder/dynamic-routes';

describe('builder dynamic routes', () => {
  it('resolves selected item routes with per-record SEO preview data', () => {
    const detail = readBuilderDynamicRouteDetail('service-areas.item', 'ko', 'investment');

    expect(detail.previewContext).toMatchObject({
      status: 'record-selected',
      selectedRecordId: 'investment',
      resolvedPath: '/ko/services/investment',
      seoPreview: {
        status: 'record-selected',
        title: '투자·법인설립',
        canonicalPath: '/ko/services/investment',
        noIndex: false,
      },
    });
    expect(detail.previewContext.seoPreview.description).toContain('법무법인 호정');
    expect(detail.previewContext.seoPreview.keywords).toContain('대만 변호사');
  });

  it('keeps a missing item-route preview record visible as a recoverable selection state', () => {
    const detail = readBuilderDynamicRouteDetail('service-areas.item', 'ko', 'missing-record');

    expect(detail.previewContext).toMatchObject({
      status: 'record-missing',
      selectedRecordId: 'missing-record',
      resolvedPath: null,
      seoPreview: {
        status: 'record-missing',
        canonicalPath: null,
      },
    });
    expect(detail.previewContext.note).toContain('not available');
  });

  it('keeps list routes collection-scoped while still exposing SEO preview defaults', () => {
    const detail = readBuilderDynamicRouteDetail('columns.list', 'ko');

    expect(detail.previewContext).toMatchObject({
      status: 'collection-only',
      resolvedPath: '/ko/columns',
      seoPreview: {
        status: 'collection-route',
        canonicalPath: '/ko/columns',
        noIndex: false,
      },
    });
    expect(detail.previewContext.seoPreview.title).toContain('Insights columns');
  });
});

import { describe, expect, it } from 'vitest';
import { buildBuilderDynamicTemplateHref } from '@/lib/builder/hrefs';

describe('builder hrefs', () => {
  it('preserves selected CMS preview records when opening dynamic templates', () => {
    expect(
      buildBuilderDynamicTemplateHref('ko', 'service-areas.item-template', {
        previewRecordId: 'immigration',
      })
    ).toBe('/ko/builder/dynamic-templates/service-areas.item-template?previewRecordId=immigration');
  });
});

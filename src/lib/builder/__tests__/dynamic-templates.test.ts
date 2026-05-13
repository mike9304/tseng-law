import { describe, expect, it } from 'vitest';
import { readBuilderDynamicTemplateDetail } from '@/lib/builder/dynamic-templates';

describe('builder dynamic templates', () => {
  it('exposes item template editor blocks and record preview samples', () => {
    const detail = readBuilderDynamicTemplateDetail('service-areas.item-template', 'ko');

    expect(detail).toMatchObject({
      builderSupport: 'template-editor-v0',
      editorStatus: 'block-contract-editable',
      previewStatus: 'record-preview-contract',
    });
    expect(detail.editableBlocks.map((block) => block.blockId)).toEqual([
      'service-areas.item.hero',
      'service-areas.item.body',
      'service-areas.item.seo',
    ]);
    expect(detail.previewRecords[0]).toMatchObject({
      recordId: 'investment',
      routePath: '/ko/services/investment',
    });
    expect(detail.exclusions.join(' ')).toContain('No freeform canvas layout editing');
  });

  it('exposes collection list template block controls', () => {
    const detail = readBuilderDynamicTemplateDetail('columns.list-template', 'ko');

    expect(detail.previewStatus).toBe('collection-preview-contract');
    expect(detail.editableBlocks).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          blockId: 'columns.list.repeater',
          control: 'binding-preview',
          boundFields: ['record.primaryLabel', 'record.secondaryLabel', 'record.routePath'],
        }),
      ])
    );
    expect(detail.previewRecords.length).toBeGreaterThan(0);
  });
});

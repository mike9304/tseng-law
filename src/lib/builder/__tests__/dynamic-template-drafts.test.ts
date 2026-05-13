import { describe, expect, it } from 'vitest';
import {
  createDefaultBuilderDynamicTemplateDraftState,
  normalizeBuilderDynamicTemplateDraftState,
} from '@/lib/builder/dynamic-template-drafts';
import { readBuilderDynamicTemplateDetail } from '@/lib/builder/dynamic-templates';

describe('builder dynamic template drafts', () => {
  it('creates a default draft state from editable blocks and preview records', () => {
    const detail = readBuilderDynamicTemplateDetail('service-areas.item-template', 'ko');

    expect(createDefaultBuilderDynamicTemplateDraftState(detail)).toEqual({
      version: 1,
      visibleBlockIds: [
        'service-areas.item.hero',
        'service-areas.item.body',
        'service-areas.item.seo',
      ],
      selectedRecordId: 'investment',
    });
  });

  it('normalizes persisted draft controls against the current template contract', () => {
    const detail = readBuilderDynamicTemplateDetail('columns.list-template', 'ko');

    expect(
      normalizeBuilderDynamicTemplateDraftState(detail, {
        version: 1,
        visibleBlockIds: [
          'columns.list.seo',
          'missing.block',
          'columns.list.seo',
          'columns.list.hero',
        ],
        selectedRecordId: 'not-a-record',
      })
    ).toEqual({
      version: 1,
      visibleBlockIds: ['columns.list.seo', 'columns.list.hero'],
      selectedRecordId: detail.previewRecords[0]?.recordId ?? null,
    });
  });

  it('allows every block to be hidden and clears record selection when no samples exist', () => {
    const detail = {
      ...readBuilderDynamicTemplateDetail('columns.list-template', 'ko'),
      previewRecords: [],
    };

    expect(
      normalizeBuilderDynamicTemplateDraftState(detail, {
        version: 1,
        visibleBlockIds: [],
        selectedRecordId: 'columns-1',
      })
    ).toEqual({
      version: 1,
      visibleBlockIds: [],
      selectedRecordId: null,
    });
  });
});

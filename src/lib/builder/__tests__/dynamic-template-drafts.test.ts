import { describe, expect, it } from 'vitest';
import {
  buildPublishedBuilderDynamicTemplateSnapshot,
  createDefaultBuilderDynamicTemplateDraftState,
  isBuilderDynamicTemplateBlockVisible,
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

  it('resolves published block visibility from visible block ids', () => {
    expect(
      isBuilderDynamicTemplateBlockVisible(
        { visibleBlockIds: ['columns.list.hero', 'columns.list.repeater'] },
        'columns.list.repeater'
      )
    ).toBe(true);
    expect(
      isBuilderDynamicTemplateBlockVisible(
        { visibleBlockIds: ['columns.list.hero', 'columns.list.repeater'] },
        'columns.list.seo'
      )
    ).toBe(false);
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

  it('builds a published snapshot from the current draft state', () => {
    const detail = readBuilderDynamicTemplateDetail('service-areas.item-template', 'ko');
    const draftState = createDefaultBuilderDynamicTemplateDraftState(detail);
    const published = buildPublishedBuilderDynamicTemplateSnapshot({
      draftSnapshot: {
        version: 1,
        templateId: detail.templateId,
        locale: 'ko',
        revision: 4,
        savedAt: '2026-05-13T07:00:00.000Z',
        updatedBy: 'draft-editor',
        state: {
          ...draftState,
          visibleBlockIds: ['service-areas.item.hero'],
        },
      },
      currentPublishedSnapshot: {
        version: 1,
        templateId: detail.templateId,
        locale: 'ko',
        revision: 2,
        savedAt: '2026-05-13T06:00:00.000Z',
        updatedBy: 'publisher',
        state: draftState,
      },
      updatedBy: 'template-publisher',
      savedAt: '2026-05-13T08:00:00.000Z',
    });

    expect(published).toEqual({
      version: 1,
      templateId: detail.templateId,
      locale: 'ko',
      revision: 3,
      savedAt: '2026-05-13T08:00:00.000Z',
      updatedBy: 'template-publisher',
      state: {
        version: 1,
        visibleBlockIds: ['service-areas.item.hero'],
        selectedRecordId: 'investment',
      },
    });
  });
});

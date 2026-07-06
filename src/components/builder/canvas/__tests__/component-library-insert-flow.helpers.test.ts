import { describe, expect, it } from 'vitest';
import {
  confirmComponentLibraryPendingInsert,
  prepareComponentLibraryInsert,
  updateComponentLibraryPendingFieldOverride,
} from '../component-library-insert-flow.helpers';
import type { ComponentLibraryEntry } from '../component-library-panel.helpers';
import { containerNode, textNode } from './component-library-panel-test-fixtures';

describe('component library insert flow helpers', () => {
  it('reviews and applies an operator-selected field remap before cross-target insertion', () => {
    const entry: ComponentLibraryEntry = {
      id: 'template-group-manual',
      name: 'Manual repeater field group',
      createdAt: '2026-06-13T00:00:00.000Z',
      nodeJson: JSON.stringify({
        rootNodeId: 'template-group-root',
        nodes: [
          containerNode({ id: 'template-group-root' }),
          textNode({
            id: 'template-read-time',
            parentId: 'template-group-root',
            dataBinding: {
              targetId: 'home.insights.feed',
              recordIndex: 0,
              fields: { text: 'readTime' },
            },
          }),
        ],
      }),
    };
    const repeater = containerNode({
      id: 'services-repeater',
      content: { layoutMode: 'repeater' },
      dataBinding: {
        targetId: 'home.services.list',
        recordIndex: 0,
        fields: { title: 'title' },
      },
    });
    const selectedGroup = containerNode({ id: 'selected-service-group', parentId: repeater.id });
    const prepared = prepareComponentLibraryInsert({
      entry,
      selectedNodeIds: [selectedGroup.id],
      nodesById: new Map([
        [repeater.id, repeater],
        [selectedGroup.id, selectedGroup],
      ]),
      canvasNodeCount: 6,
    });

    expect(prepared?.kind).toBe('review');
    if (prepared?.kind !== 'review') throw new Error('Expected a pending field remap review.');
    expect(prepared.pending.review.targetId).toBe('home.services.list');
    expect(prepared.pending.review.fields).toMatchObject([
      {
        fieldKey: 'text',
        sourceFieldId: 'readTime',
        currentFieldId: 'description',
      },
    ]);

    const confirmed = confirmComponentLibraryPendingInsert(
      updateComponentLibraryPendingFieldOverride({
        pending: prepared.pending,
        fieldKey: 'text',
        sourceFieldId: 'readTime',
        targetFieldId: 'details',
      }),
      6,
    );
    expect(confirmed?.kind).toBe('ready');
    if (confirmed?.kind !== 'ready') throw new Error('Expected ready insert after review confirmation.');
    expect(confirmed.parsed.nodes.find((node) => node.dataBinding)?.dataBinding).toEqual({
      targetId: 'home.services.list',
      recordIndex: 0,
      fields: { text: 'details' },
    });
    expect(confirmed.parentNodeId).toBe(repeater.id);
    expect(confirmed.parsed.fieldRemapSummary?.remappedFields).toEqual([
      { fieldKey: 'text', sourceFieldId: 'readTime', targetFieldId: 'details' },
    ]);
  });
});

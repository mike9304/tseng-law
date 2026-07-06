import { describe, expect, it } from 'vitest';
import type { BuilderCanvasNode } from '@/lib/builder/canvas/types';
import {
  confirmComponentLibraryPendingReplace,
  prepareComponentLibraryReplace,
  updateComponentLibraryPendingReplaceFieldOverride,
} from '../component-library-replace-flow.helpers';
import type { ComponentLibraryEntry } from '../component-library-panel.helpers';
import { containerNode, textNode } from './component-library-panel-test-fixtures';

describe('component library replace flow helpers', () => {
  it('reviews and applies an operator-selected field remap before replacing a repeater template group', () => {
    const entry: ComponentLibraryEntry = {
      id: 'template-group-manual-replace',
      name: 'Manual replacement repeater field group',
      createdAt: '2026-06-30T00:00:00.000Z',
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
    const target = containerNode({
      id: 'selected-service-group',
      parentId: repeater.id,
      rect: { x: 24, y: 48, width: 220, height: 120 },
      zIndex: 8,
    });
    const targetChild = textNode({ id: 'selected-service-title', parentId: target.id, zIndex: 9 });
    const nodesById = new Map<string, BuilderCanvasNode>([
      [repeater.id, repeater],
      [target.id, target],
      [targetChild.id, targetChild],
    ]);
    const prepared = prepareComponentLibraryReplace({
      entry,
      selectedNodeIds: [target.id],
      nodesById,
      childrenMap: {
        [repeater.id]: [target.id],
        [target.id]: [targetChild.id],
      },
      canvasNodeCount: 3,
    });

    expect(prepared?.kind).toBe('review');
    if (prepared?.kind !== 'review') throw new Error('Expected a pending replacement field remap review.');
    expect(prepared.pending.targetNodeId).toBe(target.id);
    expect(prepared.pending.review.targetId).toBe('home.services.list');
    expect(prepared.pending.review.fields).toMatchObject([
      {
        fieldKey: 'text',
        sourceFieldId: 'readTime',
        currentFieldId: 'description',
      },
    ]);

    const confirmed = confirmComponentLibraryPendingReplace(
      updateComponentLibraryPendingReplaceFieldOverride({
        pending: prepared.pending,
        fieldKey: 'text',
        sourceFieldId: 'readTime',
        targetFieldId: 'details',
      }),
      {
        nodesById,
        childrenMap: {
          [repeater.id]: [target.id],
          [target.id]: [targetChild.id],
        },
        canvasNodeCount: 3,
      },
    );

    expect(confirmed?.kind).toBe('ready');
    if (confirmed?.kind !== 'ready') throw new Error('Expected ready replace after review confirmation.');
    const root = confirmed.prepared.nodes.find((node) => node.id === confirmed.prepared.rootNodeId);
    expect(root?.parentId).toBe(repeater.id);
    expect(root?.rect).toEqual(target.rect);
    expect(root?.zIndex).toBe(target.zIndex);
    expect(confirmed.prepared.removedNodeIds).toEqual([target.id, targetChild.id]);
    expect(confirmed.prepared.nodes.find((node) => node.dataBinding)?.dataBinding).toEqual({
      targetId: 'home.services.list',
      recordIndex: 0,
      fields: { text: 'details' },
    });
    expect(confirmed.prepared.fieldRemapSummary?.remappedFields).toEqual([
      { fieldKey: 'text', sourceFieldId: 'readTime', targetFieldId: 'details' },
    ]);
  });
});

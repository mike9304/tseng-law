import { describe, expect, it } from 'vitest';
import type { BuilderCanvasNode } from '@/lib/builder/canvas/types';
import {
  prepareComponentLibraryReplaceSelection,
} from '../component-library-replace-selection.helpers';
import type { ComponentLibraryEntry } from '../component-library-panel.helpers';
import { containerNode, textNode } from './component-library-panel-test-fixtures';

describe('component library replace selection helpers', () => {
  it('prepares a saved component to replace the selected canvas subtree in place', () => {
    const parent = containerNode({
      id: 'parent',
      rect: { x: 40, y: 50, width: 600, height: 420 },
      zIndex: 0,
    });
    const target = containerNode({
      id: 'target',
      parentId: 'parent',
      rect: { x: 24, y: 32, width: 180, height: 96 },
      zIndex: 8,
    });
    const targetChild = textNode({
      id: 'target-child',
      parentId: 'target',
      rect: { x: 8, y: 12, width: 120, height: 24 },
      zIndex: 9,
    });
    const savedRoot = containerNode({
      id: 'saved-root',
      rect: { x: 100, y: 120, width: 320, height: 160 },
      zIndex: 2,
    });
    const savedTitle = textNode({
      id: 'saved-title',
      parentId: 'saved-root',
      rect: { x: 16, y: 20, width: 150, height: 32 },
      zIndex: 3,
    });
    const entry: ComponentLibraryEntry = {
      id: 'hero-card',
      name: 'Hero card',
      createdAt: '2026-06-30T00:00:00.000Z',
      nodeJson: JSON.stringify({
        rootNodeId: 'saved-root',
        nodes: [savedRoot, savedTitle],
      }),
    };
    const nodesById = new Map<string, BuilderCanvasNode>([
      [parent.id, parent],
      [target.id, target],
      [targetChild.id, targetChild],
    ]);

    const result = prepareComponentLibraryReplaceSelection({
      entry,
      selectedNodeIds: ['target'],
      nodesById,
      childrenMap: {
        parent: ['target'],
        target: ['target-child'],
      },
      canvasNodeCount: 3,
    });

    expect(result?.removedNodeIds).toEqual(['target', 'target-child']);
    expect(result?.parentNodeId).toBe('parent');
    expect(result?.rootNodeId).toBeTruthy();
    expect(result?.selectionNodeIds).toEqual([result?.rootNodeId]);

    const root = result?.nodes.find((node) => node.id === result.rootNodeId);
    expect(root?.id).not.toBe('saved-root');
    expect(root?.parentId).toBe('parent');
    expect(root?.rect).toEqual(target.rect);
    expect(root?.zIndex).toBe(target.zIndex);

    const child = result?.nodes.find((node) => node.id !== result.rootNodeId);
    expect(child?.id).not.toBe('saved-title');
    expect(child?.parentId).toBe(result?.rootNodeId);
    expect(child?.rect).toEqual(savedTitle.rect);
  });

  it('requires one unlocked selected target', () => {
    const target = textNode({ id: 'target', locked: true });
    const entry: ComponentLibraryEntry = {
      id: 'plain-text',
      name: 'Plain text',
      createdAt: '2026-06-30T00:00:00.000Z',
      nodeJson: JSON.stringify(textNode({ id: 'saved-title' })),
    };

    expect(prepareComponentLibraryReplaceSelection({
      entry,
      selectedNodeIds: [],
      nodesById: new Map([['target', target]]),
      childrenMap: {},
      canvasNodeCount: 1,
    })).toBeNull();
    expect(prepareComponentLibraryReplaceSelection({
      entry,
      selectedNodeIds: ['target'],
      nodesById: new Map([['target', target]]),
      childrenMap: {},
      canvasNodeCount: 1,
    })).toBeNull();
  });
});

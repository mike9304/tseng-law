import { describe, expect, it } from 'vitest';
import { useBuilderCanvasStore } from '../store';
import { createDefaultCanvasNodeStyle, type BuilderCanvasDocument, type BuilderCanvasNode } from '../types';

function textNode(id: string, zIndex: number, parentId?: string): BuilderCanvasNode {
  return {
    id,
    kind: 'text',
    parentId,
    rect: { x: 12, y: 16, width: 96, height: 32 },
    style: createDefaultCanvasNodeStyle(),
    zIndex,
    rotation: 0,
    locked: false,
    visible: true,
    content: {
      text: id,
      fontSize: 16,
      color: '#111827',
      fontWeight: 'regular',
      align: 'left',
      as: 'p',
      lineHeight: 1.4,
      letterSpacing: 0,
    },
  };
}

function containerNode(id: string, zIndex: number, parentId?: string): BuilderCanvasNode {
  return {
    id,
    kind: 'container',
    parentId,
    rect: { x: 24, y: 32, width: 180, height: 96 },
    style: createDefaultCanvasNodeStyle(),
    zIndex,
    rotation: 0,
    locked: false,
    visible: true,
    content: {
      label: id,
      background: 'transparent',
      borderColor: '#cbd5e1',
      borderStyle: 'solid',
      borderWidth: 0,
      borderRadius: 12,
      layoutMode: 'absolute',
      padding: 0,
      activeIndex: 0,
      sticky: false,
    },
  };
}

function documentFixture(): BuilderCanvasDocument {
  return {
    version: 1,
    locale: 'ko',
    updatedAt: '2026-01-01T00:00:00.000Z',
    updatedBy: 'store-add-nodes-test',
    stageWidth: 1280,
    stageHeight: 720,
    nodes: [containerNode('parent', 0), textNode('outside', 1)],
  };
}

describe('canvas store addNodes', () => {
  it('adds reusable node roots to an explicit parent while preserving local rects', () => {
    useBuilderCanvasStore.getState().replaceDocument(documentFixture());

    useBuilderCanvasStore.getState().addNodes([
      containerNode('saved-group', 2),
      textNode('saved-title', 3, 'saved-group'),
    ], 'saved-group', 'parent');

    const state = useBuilderCanvasStore.getState();
    expect(state.document?.nodes.find((node) => node.id === 'saved-group')?.parentId).toBe('parent');
    expect(state.document?.nodes.find((node) => node.id === 'saved-group')?.rect).toEqual({
      x: 24,
      y: 32,
      width: 180,
      height: 96,
    });
    expect(state.document?.nodes.find((node) => node.id === 'saved-title')?.parentId).toBe('saved-group');
    expect(state.childrenMap.parent).toContain('saved-group');
  });

  it('replaces the selected subtree with reusable nodes as one undoable mutation', () => {
    useBuilderCanvasStore.getState().replaceDocument({
      ...documentFixture(),
      nodes: [
        containerNode('parent', 0),
        containerNode('target', 1, 'parent'),
        textNode('target-child', 2, 'target'),
        textNode('outside', 3),
      ],
    });
    useBuilderCanvasStore.getState().setSelectedNodeIds(['target'], 'target');

    useBuilderCanvasStore.getState().replaceSelectedNodeWithNodes([
      containerNode('saved-group', 4, 'parent'),
      textNode('saved-title', 5, 'saved-group'),
    ], 'saved-group', ['saved-group']);

    const state = useBuilderCanvasStore.getState();
    expect(state.document?.nodes.map((node) => node.id)).toEqual([
      'parent',
      'outside',
      'saved-group',
      'saved-title',
    ]);
    expect(state.childrenMap.parent).toEqual(['saved-group']);
    expect(state.selectedNodeId).toBe('saved-group');
    expect(state.selectedNodeIds).toEqual(['saved-group']);
    expect(state.canUndo).toBe(true);

    useBuilderCanvasStore.getState().undo();
    expect(useBuilderCanvasStore.getState().document?.nodes.map((node) => node.id)).toEqual([
      'parent',
      'target',
      'target-child',
      'outside',
    ]);
  });
});

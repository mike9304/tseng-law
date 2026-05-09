import { describe, expect, it } from 'vitest';
import { useBuilderCanvasStore } from '../store';
import { createDefaultCanvasNodeStyle, type BuilderCanvasDocument, type BuilderCanvasNode } from '../types';

function textNode(id: string, zIndex: number): BuilderCanvasNode {
  return {
    id,
    kind: 'text',
    rect: { x: 10 + zIndex * 20, y: 20, width: 100, height: 30 },
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

function documentFixture(): BuilderCanvasDocument {
  return {
    version: 1,
    locale: 'ko',
    updatedAt: '2026-01-01T00:00:00.000Z',
    updatedBy: 'store-transient-test',
    stageWidth: 1280,
    stageHeight: 880,
    nodes: [textNode('second', 1), textNode('first', 0)],
  };
}

describe('canvas store transient updates', () => {
  it('keeps a shared nodesById index in sync with document replacement and transient edits', () => {
    useBuilderCanvasStore.getState().replaceDocument(documentFixture());

    const initialState = useBuilderCanvasStore.getState();
    expect(initialState.nodesById.get('first')?.rect.x).toBe(10);
    expect(initialState.nodesById.get('second')?.zIndex).toBe(1);

    initialState.beginMutationSession();
    useBuilderCanvasStore.getState().updateNode('first', (node) => ({
      ...node,
      rect: { ...node.rect, x: 123 },
    }), 'transient');

    const transientState = useBuilderCanvasStore.getState();
    expect(transientState.nodesById).not.toBe(initialState.nodesById);
    expect(transientState.nodesById.get('first')?.rect.x).toBe(123);
    expect(transientState.childrenMap).toEqual({});

    transientState.cancelMutationSession();
    expect(useBuilderCanvasStore.getState().nodesById.get('first')?.rect.x).toBe(10);
  });

  it('does not normalize order or touch updatedAt until mutation commit', () => {
    const store = useBuilderCanvasStore.getState();
    store.replaceDocument(documentFixture());
    useBuilderCanvasStore.getState().setSelectedNodeId('first');
    useBuilderCanvasStore.getState().beginMutationSession();

    useBuilderCanvasStore.getState().updateNodeRectsForViewport(
      new Map([['first', { x: 80, y: 90, width: 100, height: 30 }]]),
      'desktop',
      'transient',
    );

    const transientDocument = useBuilderCanvasStore.getState().document;
    expect(transientDocument?.updatedAt).toBe('2026-01-01T00:00:00.000Z');
    expect(transientDocument?.nodes.map((node) => node.id)).toEqual(['second', 'first']);
    expect(transientDocument?.nodes.find((node) => node.id === 'first')?.rect.x).toBe(80);

    useBuilderCanvasStore.getState().commitMutationSession();

    const committedDocument = useBuilderCanvasStore.getState().document;
    expect(committedDocument?.updatedAt).not.toBe('2026-01-01T00:00:00.000Z');
    expect(committedDocument?.nodes.find((node) => node.id === 'first')?.rect.x).toBe(80);
    expect(useBuilderCanvasStore.getState().canUndo).toBe(true);
  });
});

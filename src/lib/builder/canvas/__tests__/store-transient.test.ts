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

function containerNode(id: string, zIndex: number, parentId?: string): BuilderCanvasNode {
  return {
    id,
    kind: 'container',
    rect: { x: 10 + zIndex * 20, y: 20 + zIndex * 20, width: 220, height: 80 },
    style: createDefaultCanvasNodeStyle(),
    zIndex,
    rotation: 0,
    locked: false,
    visible: true,
    parentId,
    content: {
      label: id,
      background: 'rgba(248, 250, 252, 0.96)',
      borderColor: '#cbd5e1',
      borderStyle: 'dashed',
      borderWidth: 0,
      borderRadius: 12,
      layoutMode: 'absolute',
      padding: 0,
      activeIndex: 0,
      sticky: false,
      variant: 'flat',
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

function sortedDocumentFixture(): BuilderCanvasDocument {
  return {
    ...documentFixture(),
    nodes: [textNode('first', 0), textNode('second', 1)],
  };
}

function manyNodeDocumentFixture(count: number): BuilderCanvasDocument {
  return {
    version: 1,
    locale: 'ko',
    updatedAt: '2026-01-01T00:00:00.000Z',
    updatedBy: 'store-transient-test',
    stageWidth: 1280,
    stageHeight: Math.ceil(count / 10) * 48,
    nodes: Array.from({ length: count }, (_, index) => ({
      ...textNode(`node-${index}`, index),
      rect: {
        x: (index % 10) * 120,
        y: Math.floor(index / 10) * 48,
        width: 96,
        height: 28,
      },
    })),
  };
}

function interactiveDocumentFixture(): BuilderCanvasDocument {
  return {
    ...documentFixture(),
    nodes: [
      containerNode('home-services-root', 0),
      containerNode('home-services-card-1', 1, 'home-services-root'),
      containerNode('home-services-card-1-toggle', 2, 'home-services-card-1'),
      textNode('home-services-card-1-title', 3),
      containerNode('home-faq-root', 4),
      containerNode('home-faq-item-2', 5, 'home-faq-root'),
      textNode('home-faq-item-2-question', 6),
    ].map((node) => {
      if (node.id === 'home-services-card-1-title') {
        return { ...node, parentId: 'home-services-card-1-toggle' };
      }
      if (node.id === 'home-faq-item-2-question') {
        return { ...node, parentId: 'home-faq-item-2' };
      }
      return node;
    }),
  };
}

describe('canvas store transient updates', () => {
  it('reveals service and FAQ preview state synchronously with selection', () => {
    useBuilderCanvasStore.getState().replaceDocument(interactiveDocumentFixture());

    useBuilderCanvasStore.getState().setSelectedNodeId('home-services-card-1-title');
    expect(useBuilderCanvasStore.getState().interactivePreview).toMatchObject({
      servicesOpenIndex: 1,
      servicesRevealedIndices: [0, 1],
    });

    useBuilderCanvasStore.getState().setSelectedNodeId('home-faq-item-2-question');
    expect(useBuilderCanvasStore.getState().interactivePreview).toEqual({
      servicesOpenIndex: 1,
      servicesRevealedIndices: [0, 1],
      faqOpenIndex: 2,
      faqRevealedIndices: [0, 2],
    });
  });

  it('resets interactive preview state when replacing the document', () => {
    useBuilderCanvasStore.getState().replaceDocument(documentFixture());
    useBuilderCanvasStore.getState().setInteractivePreviewIndex('services', 2);
    useBuilderCanvasStore.getState().setInteractivePreviewIndex('faq', 3);

    expect(useBuilderCanvasStore.getState().interactivePreview).toEqual({
      servicesOpenIndex: 2,
      servicesRevealedIndices: [0, 2],
      faqOpenIndex: 3,
      faqRevealedIndices: [0, 3],
    });

    useBuilderCanvasStore.getState().replaceDocument({
      ...documentFixture(),
      updatedBy: 'store-transient-test-next-page',
    });

    expect(useBuilderCanvasStore.getState().interactivePreview).toEqual({
      servicesOpenIndex: 0,
      servicesRevealedIndices: [0],
      faqOpenIndex: 0,
      faqRevealedIndices: [0],
    });
  });

  it('does not create a history entry for structurally identical committed node updates', () => {
    useBuilderCanvasStore.getState().replaceDocument(sortedDocumentFixture());
    useBuilderCanvasStore.getState().updateNode('first', (node) => ({
      ...node,
      rect: { ...node.rect },
    }));

    const state = useBuilderCanvasStore.getState();
    expect(state.canUndo).toBe(false);
    expect(state.document?.updatedAt).toBe('2026-01-01T00:00:00.000Z');
  });

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

  it('groups large selections without argument-spread bounds calculations', () => {
    const count = 1_500;
    useBuilderCanvasStore.getState().replaceDocument(manyNodeDocumentFixture(count));
    useBuilderCanvasStore.getState().setSelectedNodeIds(
      Array.from({ length: count }, (_, index) => `node-${index}`),
      'node-0',
    );

    useBuilderCanvasStore.getState().groupSelectedNodes();

    const state = useBuilderCanvasStore.getState();
    const groupNode = state.document?.nodes.find((node) => node.id === state.selectedNodeId);
    expect(groupNode?.kind).toBe('container');
    expect(groupNode?.rect).toEqual({
      x: 0,
      y: 0,
      width: 1176,
      height: 7_180,
    });
    expect(state.document?.nodes.filter((node) => node.parentId === groupNode?.id)).toHaveLength(count);
    expect(state.canUndo).toBe(true);
  });
});

import { describe, expect, it, vi } from 'vitest';
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

function defaultRevealDocumentFixture(): BuilderCanvasDocument {
  return {
    ...documentFixture(),
    nodes: [
      containerNode('home-services-root', 0),
      containerNode('home-services-card-0', 1, 'home-services-root'),
      containerNode('home-services-card-0-toggle', 2, 'home-services-card-0'),
      textNode('home-services-card-0-title', 3),
      containerNode('home-services-card-1', 4, 'home-services-root'),
      containerNode('home-services-card-1-toggle', 5, 'home-services-card-1'),
      textNode('home-services-card-1-title', 6),
      containerNode('home-faq-root', 7),
      containerNode('home-faq-item-0', 8, 'home-faq-root'),
      textNode('home-faq-item-0-question', 9),
      containerNode('home-faq-item-1', 10, 'home-faq-root'),
      textNode('home-faq-item-1-question', 11),
    ].map((node) => {
      if (node.id === 'home-services-card-0-title') {
        return { ...node, parentId: 'home-services-card-0-toggle' };
      }
      if (node.id === 'home-services-card-1-title') {
        return { ...node, parentId: 'home-services-card-1-toggle' };
      }
      if (node.id === 'home-faq-item-0-question') {
        return { ...node, parentId: 'home-faq-item-0' };
      }
      if (node.id === 'home-faq-item-1-question') {
        return { ...node, parentId: 'home-faq-item-1' };
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
      servicesRevealedIndices: [1],
    });

    useBuilderCanvasStore.getState().setSelectedNodeId('home-faq-item-2-question');
    expect(useBuilderCanvasStore.getState().interactivePreview).toEqual({
      servicesOpenIndex: 1,
      servicesRevealedIndices: [1],
      faqOpenIndex: 2,
      faqRevealedIndices: [2],
    });
  });

  it('resets interactive preview state when replacing the document', () => {
    useBuilderCanvasStore.getState().replaceDocument(documentFixture());
    useBuilderCanvasStore.getState().setInteractivePreviewIndex('services', 2);
    useBuilderCanvasStore.getState().setInteractivePreviewIndex('faq', 3);

    expect(useBuilderCanvasStore.getState().interactivePreview).toEqual({
      servicesOpenIndex: 2,
      servicesRevealedIndices: [2],
      faqOpenIndex: 3,
      faqRevealedIndices: [3],
    });

    useBuilderCanvasStore.getState().replaceDocument({
      ...documentFixture(),
      updatedBy: 'store-transient-test-next-page',
    });

    expect(useBuilderCanvasStore.getState().interactivePreview).toEqual({
      servicesOpenIndex: -1,
      servicesRevealedIndices: [],
      faqOpenIndex: -1,
      faqRevealedIndices: [],
    });
  });

  it('keeps services and FAQ previews collapsed by default when present', () => {
    useBuilderCanvasStore.getState().replaceDocument(defaultRevealDocumentFixture());

    expect(useBuilderCanvasStore.getState().interactivePreview).toEqual({
      servicesOpenIndex: -1,
      servicesRevealedIndices: [],
      faqOpenIndex: -1,
      faqRevealedIndices: [],
    });
  });

  it('keeps accordion preview collapsed when the document has no index-0 cards', () => {
    useBuilderCanvasStore.getState().replaceDocument(interactiveDocumentFixture());

    expect(useBuilderCanvasStore.getState().interactivePreview).toEqual({
      servicesOpenIndex: -1,
      servicesRevealedIndices: [],
      faqOpenIndex: -1,
      faqRevealedIndices: [],
    });
  });

  it('restores the public collapsed preview after clearing the selection', () => {
    useBuilderCanvasStore.getState().replaceDocument(defaultRevealDocumentFixture());
    useBuilderCanvasStore.getState().setSelectedNodeId('home-services-card-1-title');

    expect(useBuilderCanvasStore.getState().interactivePreview).toMatchObject({
      servicesOpenIndex: 1,
      servicesRevealedIndices: [1],
      faqOpenIndex: -1,
      faqRevealedIndices: [],
    });

    useBuilderCanvasStore.getState().setSelectedNodeId(null);

    expect(useBuilderCanvasStore.getState().interactivePreview).toEqual({
      servicesOpenIndex: -1,
      servicesRevealedIndices: [],
      faqOpenIndex: -1,
      faqRevealedIndices: [],
    });
  });

  it('restores the public collapsed preview when toggle clears the last selected node', () => {
    useBuilderCanvasStore.getState().replaceDocument(defaultRevealDocumentFixture());
    useBuilderCanvasStore.getState().setSelectedNodeId('home-services-card-1-title');
    useBuilderCanvasStore.getState().toggleNodeSelection('home-services-card-1-title');

    expect(useBuilderCanvasStore.getState().interactivePreview).toEqual({
      servicesOpenIndex: -1,
      servicesRevealedIndices: [],
      faqOpenIndex: -1,
      faqRevealedIndices: [],
    });
  });

  it('switches the FAQ preview to the selected item and back to collapsed on clear', () => {
    useBuilderCanvasStore.getState().replaceDocument(defaultRevealDocumentFixture());
    useBuilderCanvasStore.getState().setSelectedNodeId('home-faq-item-1-question');

    expect(useBuilderCanvasStore.getState().interactivePreview).toEqual({
      servicesOpenIndex: -1,
      servicesRevealedIndices: [],
      faqOpenIndex: 1,
      faqRevealedIndices: [1],
    });

    useBuilderCanvasStore.getState().setSelectedNodeIds([], null);

    expect(useBuilderCanvasStore.getState().interactivePreview).toEqual({
      servicesOpenIndex: -1,
      servicesRevealedIndices: [],
      faqOpenIndex: -1,
      faqRevealedIndices: [],
    });
  });

  it('clears selection by default when replacing the document', () => {
    useBuilderCanvasStore.getState().replaceDocument(documentFixture());
    useBuilderCanvasStore.getState().setSelectedNodeId('first');

    useBuilderCanvasStore.getState().replaceDocument({
      ...documentFixture(),
      updatedAt: '2026-01-01T00:01:00.000Z',
    });

    const state = useBuilderCanvasStore.getState();
    expect(state.selectedNodeId).toBeNull();
    expect(state.selectedNodeIds).toEqual([]);
    expect(state.selectedNodeIdSet.size).toBe(0);
  });

  it('preserves valid selection when replacing the current page document with preserveSelection', () => {
    useBuilderCanvasStore.getState().replaceDocument(documentFixture());
    useBuilderCanvasStore.getState().setSelectedNodeId('first');

    useBuilderCanvasStore.getState().replaceDocument({
      ...documentFixture(),
      updatedAt: '2026-01-01T00:01:00.000Z',
    }, { preserveSelection: true });

    const state = useBuilderCanvasStore.getState();
    expect(state.selectedNodeId).toBe('first');
    expect(state.selectedNodeIds).toEqual(['first']);
    expect(state.selectedNodeIdSet.has('first')).toBe(true);
  });

  it('keeps empty selection empty when replacing the current page document with preserveSelection', () => {
    useBuilderCanvasStore.getState().replaceDocument(documentFixture());

    useBuilderCanvasStore.getState().replaceDocument({
      ...documentFixture(),
      updatedAt: '2026-01-01T00:01:00.000Z',
    }, { preserveSelection: true });

    const state = useBuilderCanvasStore.getState();
    expect(state.selectedNodeId).toBeNull();
    expect(state.selectedNodeIds).toEqual([]);
    expect(state.selectedNodeIdSet.size).toBe(0);
  });

  it('drops missing selection when replacing the current page document with preserveSelection', () => {
    useBuilderCanvasStore.getState().replaceDocument(documentFixture());
    useBuilderCanvasStore.getState().setSelectedNodeId('first');

    useBuilderCanvasStore.getState().replaceDocument({
      ...documentFixture(),
      nodes: documentFixture().nodes.filter((node) => node.id !== 'first'),
      updatedAt: '2026-01-01T00:01:00.000Z',
    }, { preserveSelection: true });

    const state = useBuilderCanvasStore.getState();
    expect(state.selectedNodeId).toBeNull();
    expect(state.selectedNodeIds).toEqual([]);
    expect(state.selectedNodeIdSet.size).toBe(0);
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

  it('persists dataset field binding metadata on canvas nodes', () => {
    useBuilderCanvasStore.getState().replaceDocument(sortedDocumentFixture());
    useBuilderCanvasStore.getState().updateNode('first', (node) => ({
      ...node,
      dataBinding: {
        targetId: 'home.insights.feed',
        recordIndex: 0,
        fields: {
          text: 'title',
          href: 'href',
        },
      },
    }));

    const boundNode = useBuilderCanvasStore.getState().document?.nodes.find((node) => node.id === 'first');
    expect(boundNode?.dataBinding).toEqual({
      targetId: 'home.insights.feed',
      recordIndex: 0,
      fields: {
        text: 'title',
        href: 'href',
      },
    });
    expect(useBuilderCanvasStore.getState().canUndo).toBe(true);
  });

  it('moves the selected node forward and backward in normalized z order', () => {
    useBuilderCanvasStore.getState().replaceDocument(sortedDocumentFixture());
    useBuilderCanvasStore.getState().setSelectedNodeId('first');

    useBuilderCanvasStore.getState().bringSelectedNodeForward();

    expect(useBuilderCanvasStore.getState().document?.nodes.map((node) => `${node.id}:${node.zIndex}`)).toEqual([
      'second:0',
      'first:1',
    ]);

    useBuilderCanvasStore.getState().sendSelectedNodeBackward();

    expect(useBuilderCanvasStore.getState().document?.nodes.map((node) => `${node.id}:${node.zIndex}`)).toEqual([
      'first:0',
      'second:1',
    ]);
  });

  it('reuses JSON signatures for unchanged node payload comparisons', () => {
    useBuilderCanvasStore.getState().replaceDocument(sortedDocumentFixture());
    useBuilderCanvasStore.getState().updateNodeStyle('first', { opacity: 100 });

    const stringifySpy = vi.spyOn(JSON, 'stringify');
    try {
      useBuilderCanvasStore.getState().updateNodeStyle('first', { opacity: 100 });
      expect(stringifySpy).toHaveBeenCalledTimes(1);
    } finally {
      stringifySpy.mockRestore();
    }

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

  it('keeps a shared selected-node set in sync with selection changes', () => {
    useBuilderCanvasStore.getState().replaceDocument(documentFixture());

    const emptyState = useBuilderCanvasStore.getState();
    expect(emptyState.selectedNodeIdSet.size).toBe(0);

    useBuilderCanvasStore.getState().setSelectedNodeId('first');
    const singleState = useBuilderCanvasStore.getState();
    expect(singleState.selectedNodeIds).toEqual(['first']);
    expect(singleState.selectedNodeIdSet.has('first')).toBe(true);
    expect(singleState.selectedNodeIdSet.has('second')).toBe(false);

    useBuilderCanvasStore.getState().setSelectedNodeIds(['first', 'second'], 'second');
    const multiState = useBuilderCanvasStore.getState();
    expect(multiState.selectedNodeIds).toEqual(['first', 'second']);
    expect(Array.from(multiState.selectedNodeIdSet)).toEqual(['first', 'second']);

    useBuilderCanvasStore.getState().toggleNodeSelection('first');
    const toggledState = useBuilderCanvasStore.getState();
    expect(toggledState.selectedNodeIds).toEqual(['second']);
    expect(Array.from(toggledState.selectedNodeIdSet)).toEqual(['second']);
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

  it('keeps selection and child indexes stable during transient rect updates', () => {
    const document = {
      ...documentFixture(),
      nodes: [
        containerNode('parent', 0),
        { ...textNode('child', 1), parentId: 'parent' },
        textNode('sibling', 2),
      ],
    };
    useBuilderCanvasStore.getState().replaceDocument(document);
    useBuilderCanvasStore.getState().enterGroup('parent');
    useBuilderCanvasStore.getState().setSelectedNodeIds(['child'], 'child');
    useBuilderCanvasStore.getState().beginMutationSession();

    const initialState = useBuilderCanvasStore.getState();

    useBuilderCanvasStore.getState().updateNodeRectsForViewport(
      new Map([['child', { x: 48, y: 52, width: 100, height: 30 }]]),
      'desktop',
      'transient',
    );

    const transientState = useBuilderCanvasStore.getState();
    expect(transientState.childrenMap).toBe(initialState.childrenMap);
    expect(transientState.selectedNodeId).toBe(initialState.selectedNodeId);
    expect(transientState.selectedNodeIds).toBe(initialState.selectedNodeIds);
    expect(transientState.selectedNodeIdSet).toBe(initialState.selectedNodeIdSet);
    expect(transientState.activeGroupId).toBe(initialState.activeGroupId);
    expect(transientState.nodesById).not.toBe(initialState.nodesById);
    expect(transientState.nodesById.get('child')?.rect).toEqual({
      x: 48,
      y: 52,
      width: 100,
      height: 30,
    });
  });

  it('keeps indexes stable through the single-node transient rect fast path', () => {
    const document = {
      ...documentFixture(),
      nodes: [
        containerNode('parent', 0),
        { ...textNode('child', 1), parentId: 'parent' },
        textNode('sibling', 2),
      ],
    };
    useBuilderCanvasStore.getState().replaceDocument(document);
    useBuilderCanvasStore.getState().setSelectedNodeIds(['child'], 'child');
    useBuilderCanvasStore.getState().beginMutationSession();

    const initialState = useBuilderCanvasStore.getState();

    useBuilderCanvasStore.getState().updateSingleNodeRectForViewport(
      'child',
      { x: 60, y: 64, width: 112, height: 36 },
      'desktop',
      'transient',
    );

    const transientState = useBuilderCanvasStore.getState();
    expect(transientState.document?.updatedAt).toBe('2026-01-01T00:00:00.000Z');
    expect(transientState.document?.nodes.map((node) => node.id)).toEqual(['parent', 'child', 'sibling']);
    expect(transientState.childrenMap).toBe(initialState.childrenMap);
    expect(transientState.selectedNodeIds).toBe(initialState.selectedNodeIds);
    expect(transientState.selectedNodeIdSet).toBe(initialState.selectedNodeIdSet);
    expect(transientState.nodesById).not.toBe(initialState.nodesById);
    expect(transientState.nodesById.get('child')?.rect).toEqual({
      x: 60,
      y: 64,
      width: 112,
      height: 36,
    });

    useBuilderCanvasStore.getState().commitMutationSession();
    const committedState = useBuilderCanvasStore.getState();
    expect(committedState.document?.updatedAt).not.toBe('2026-01-01T00:00:00.000Z');
    expect(committedState.canUndo).toBe(true);
  });

  it('does not publish unchanged single-node rect fast-path updates', () => {
    useBuilderCanvasStore.getState().replaceDocument(sortedDocumentFixture());
    const initialState = useBuilderCanvasStore.getState();
    let publishCount = 0;
    const unsubscribe = useBuilderCanvasStore.subscribe(() => {
      publishCount += 1;
    });

    try {
      useBuilderCanvasStore.getState().updateSingleNodeRectForViewport(
        'first',
        { x: 10, y: 20, width: 100, height: 30 },
        'desktop',
        'transient',
      );
    } finally {
      unsubscribe();
    }

    expect(publishCount).toBe(0);
    expect(useBuilderCanvasStore.getState()).toBe(initialState);
  });

  it('does not publish unchanged single-node selection updates', () => {
    useBuilderCanvasStore.getState().replaceDocument(documentFixture());
    useBuilderCanvasStore.getState().setSelectedNodeId('first');
    const initialState = useBuilderCanvasStore.getState();
    let publishCount = 0;
    const unsubscribe = useBuilderCanvasStore.subscribe(() => {
      publishCount += 1;
    });

    try {
      useBuilderCanvasStore.getState().setSelectedNodeId('first');
    } finally {
      unsubscribe();
    }

    expect(publishCount).toBe(0);
    expect(useBuilderCanvasStore.getState()).toBe(initialState);
  });

  it('does not publish unchanged multi-node selection updates', () => {
    useBuilderCanvasStore.getState().replaceDocument(documentFixture());
    useBuilderCanvasStore.getState().setSelectedNodeIds(['first', 'second'], 'second');
    const initialState = useBuilderCanvasStore.getState();
    let publishCount = 0;
    const unsubscribe = useBuilderCanvasStore.subscribe(() => {
      publishCount += 1;
    });

    try {
      useBuilderCanvasStore.getState().setSelectedNodeIds(['first', 'second'], 'second');
    } finally {
      unsubscribe();
    }

    expect(publishCount).toBe(0);
    expect(useBuilderCanvasStore.getState()).toBe(initialState);
  });

  it('does not publish unchanged empty selection resets', () => {
    useBuilderCanvasStore.getState().replaceDocument(documentFixture());
    const initialState = useBuilderCanvasStore.getState();
    let publishCount = 0;
    const unsubscribe = useBuilderCanvasStore.subscribe(() => {
      publishCount += 1;
    });

    try {
      useBuilderCanvasStore.getState().setSelectedNodeIds([], null);
    } finally {
      unsubscribe();
    }

    expect(publishCount).toBe(0);
    expect(useBuilderCanvasStore.getState()).toBe(initialState);
  });

  it('does not publish unchanged viewport, save, or surface state updates', () => {
    const store = useBuilderCanvasStore.getState();
    store.replaceDocument(documentFixture());
    useBuilderCanvasStore.getState().setViewport('tablet');
    useBuilderCanvasStore.getState().setDraftSaveState('saving');
    useBuilderCanvasStore.getState().setSelectedSurfaceKey('hero-title');
    const initialState = useBuilderCanvasStore.getState();
    let publishCount = 0;
    const unsubscribe = useBuilderCanvasStore.subscribe(() => {
      publishCount += 1;
    });

    try {
      useBuilderCanvasStore.getState().setViewport('tablet');
      useBuilderCanvasStore.getState().setDraftSaveState('saving');
      useBuilderCanvasStore.getState().setSelectedSurfaceKey('hero-title');
    } finally {
      unsubscribe();
    }

    expect(publishCount).toBe(0);
    expect(useBuilderCanvasStore.getState()).toBe(initialState);
  });

  it('groups explicit node ids without relying on the current selection', () => {
    useBuilderCanvasStore.getState().replaceDocument({
      ...documentFixture(),
      nodes: [
        containerNode('parent', 0),
        { ...textNode('first', 1), parentId: 'parent' },
        { ...textNode('second', 2), parentId: 'parent' },
        textNode('outside', 3),
      ],
    });
    useBuilderCanvasStore.getState().setSelectedNodeId('outside');

    useBuilderCanvasStore.getState().groupNodeIds(['first', 'second'], 'second');

    const state = useBuilderCanvasStore.getState();
    const groupNode = state.document?.nodes.find((node) => node.id === state.selectedNodeId);
    expect(groupNode?.id).toMatch(/^group-/);
    expect(groupNode?.parentId).toBe('parent');
    expect(groupNode?.kind).toBe('container');
    expect(state.selectedNodeIds).toEqual([groupNode?.id]);
    expect(state.document?.nodes.find((node) => node.id === 'first')?.parentId).toBe(groupNode?.id);
    expect(state.document?.nodes.find((node) => node.id === 'second')?.parentId).toBe(groupNode?.id);
    expect(state.document?.nodes.find((node) => node.id === 'outside')?.parentId).toBeUndefined();
    expect(state.canUndo).toBe(true);
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

  it('clears every mobile override while preserving tablet overrides', () => {
    const firstNode: BuilderCanvasNode = {
      ...textNode('first', 0),
      responsive: {
        tablet: { rect: { x: 44, width: 180 } },
        mobile: { rect: { x: 24, width: 140 }, fontSize: 18 },
      },
    };
    const secondNode: BuilderCanvasNode = {
      ...textNode('second', 1),
      responsive: {
        mobile: { hidden: true },
      },
    };
    useBuilderCanvasStore.getState().replaceDocument({
      ...documentFixture(),
      nodes: [firstNode, secondNode],
    });

    useBuilderCanvasStore.getState().resetResponsiveOverridesForViewport('mobile');

    const state = useBuilderCanvasStore.getState();
    expect(state.document?.nodes.find((node) => node.id === 'first')?.responsive).toEqual({
      tablet: { rect: { x: 44, width: 180 } },
    });
    expect(state.document?.nodes.find((node) => node.id === 'second')?.responsive).toBeUndefined();
    expect(state.canUndo).toBe(true);
  });

  it('does not publish page reset when the viewport has no effective overrides', () => {
    const firstNode: BuilderCanvasNode = {
      ...textNode('first', 0),
      responsive: {
        mobile: {},
      },
    };
    useBuilderCanvasStore.getState().replaceDocument({
      ...documentFixture(),
      nodes: [firstNode, textNode('second', 1)],
    });
    const initialState = useBuilderCanvasStore.getState();
    let publishCount = 0;
    const unsubscribe = useBuilderCanvasStore.subscribe(() => {
      publishCount += 1;
    });

    try {
      useBuilderCanvasStore.getState().resetResponsiveOverridesForViewport('mobile');
      useBuilderCanvasStore.getState().resetResponsiveOverridesForViewport('desktop');
    } finally {
      unsubscribe();
    }

    expect(publishCount).toBe(0);
    expect(useBuilderCanvasStore.getState()).toBe(initialState);
  });
});

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

// content 의 form 스키마 전체를 요구하지 않도록 필요한 필드만(steps)로 캐스팅.
function formNode(id: string, zIndex: number, fieldIds: string[], anchorName?: string): BuilderCanvasNode {
  return {
    id,
    kind: 'form',
    parentId: undefined,
    rect: { x: 0, y: 0, width: 320, height: 240 },
    style: createDefaultCanvasNodeStyle(),
    zIndex,
    rotation: 0,
    locked: false,
    visible: true,
    anchorName,
    content: { steps: [{ id: 'step-1', title: 'Step', fieldNodeIds: fieldIds }] },
  } as unknown as BuilderCanvasNode;
}

function documentFixture(): BuilderCanvasDocument {
  return {
    version: 1,
    locale: 'ko',
    updatedAt: '2026-01-01T00:00:00.000Z',
    updatedBy: 'store-duplicate-refs-test',
    stageWidth: 1280,
    stageHeight: 720,
    nodes: [formNode('form-1', 0, ['field-1'], 'contact'), textNode('field-1', 1, 'form-1')],
  };
}

function stepFieldIds(node: BuilderCanvasNode): string[] {
  return (node.content as unknown as { steps: Array<{ fieldNodeIds: string[] }> }).steps[0].fieldNodeIds;
}

describe('canvas store duplicateSelectedNode — 참조/앵커 remap', () => {
  it('복제 시 content.steps.fieldNodeIds 를 복제된 자식 id 로 remap + anchorName 제거', () => {
    useBuilderCanvasStore.getState().replaceDocument(documentFixture());
    useBuilderCanvasStore.getState().setSelectedNodeIds(['form-1'], 'form-1');
    useBuilderCanvasStore.getState().duplicateSelectedNode();

    const nodes = useBuilderCanvasStore.getState().document!.nodes;
    expect(nodes).toHaveLength(4);

    const clonedForm = nodes.find((n) => n.kind === 'form' && n.id !== 'form-1')!;
    const clonedField = nodes.find((n) => n.kind === 'text' && n.id !== 'field-1')!;
    expect(clonedForm).toBeDefined();
    expect(clonedField).toBeDefined();

    // 복제된 field 는 복제된 form 의 자식이어야 함(기존 parentId remap 확인).
    expect(clonedField.parentId).toBe(clonedForm.id);

    // fieldNodeIds 가 복제된 자식을 가리켜야 함 — 원본 'field-1' 이 아니라.
    expect(stepFieldIds(clonedForm)).toEqual([clonedField.id]);
    expect(stepFieldIds(clonedForm)).not.toContain('field-1');

    // anchorName 은 복제본에서 제거되어야 함(앵커 고유성).
    expect(clonedForm.anchorName).toBeUndefined();

    // 원본은 절대 변형되면 안 됨(깊은 복사 확인).
    const origForm = nodes.find((n) => n.id === 'form-1')!;
    expect(stepFieldIds(origForm)).toEqual(['field-1']);
    expect(origForm.anchorName).toBe('contact');
  });
});

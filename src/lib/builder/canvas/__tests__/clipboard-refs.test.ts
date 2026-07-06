import { describe, expect, it } from 'vitest';
import { copyNodes, pasteNodes } from '../clipboard';
import { createDefaultCanvasNodeStyle, type BuilderCanvasNode } from '../types';

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

function stepFieldIds(node: BuilderCanvasNode): string[] {
  return (node.content as unknown as { steps: Array<{ fieldNodeIds: string[] }> }).steps[0].fieldNodeIds;
}

describe('clipboard pasteNodes — 참조/앵커 remap', () => {
  it('붙여넣기 시 fieldNodeIds 를 붙여넣은 자식 id 로 remap + anchorName 제거', () => {
    const form = formNode('form-1', 0, ['field-1'], 'contact');
    const field = textNode('field-1', 1, 'form-1');
    copyNodes([form, field]);

    const pasted = pasteNodes();
    expect(pasted).toHaveLength(2);

    const pastedForm = pasted.find((n) => n.kind === 'form')!;
    const pastedField = pasted.find((n) => n.kind === 'text')!;
    expect(pastedForm).toBeDefined();
    expect(pastedField).toBeDefined();

    // 붙여넣은 field 는 붙여넣은 form 의 자식(parentId remap 확인).
    expect(pastedField.parentId).toBe(pastedForm.id);

    // fieldNodeIds 가 붙여넣은 자식을 가리켜야 함 — 원본 'field-1' 아님.
    expect(stepFieldIds(pastedForm)).toEqual([pastedField.id]);
    expect(stepFieldIds(pastedForm)).not.toContain('field-1');

    // anchorName 은 붙여넣기 사본에서 제거(앵커 고유성).
    expect(pastedForm.anchorName).toBeUndefined();

    // 원본 노드는 불변(copyNodes 가 structuredClone).
    expect(stepFieldIds(form)).toEqual(['field-1']);
    expect(form.anchorName).toBe('contact');
  });
});

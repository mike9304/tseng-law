/**
 * Phase 2 P2-14 — Clipboard (copy/paste/cut).
 *
 * In-memory clipboard — no browser Clipboard API (avoids permissions
 * prompt and works with complex node objects that can't be serialized
 * to plain text cleanly). Cross-page paste is supported because the
 * clipboard is module-level, not per-page.
 */

import type { BuilderCanvasNode } from '@/lib/builder/canvas/types';

let clipboardNodes: BuilderCanvasNode[] = [];

let idCounter = 0;
function newId(): string {
  idCounter += 1;
  return `pasted-${Date.now()}-${idCounter}`;
}

export function copyNodes(nodes: BuilderCanvasNode[]): void {
  clipboardNodes = nodes.map((n) => structuredClone(n));
}

export function cutNodes(nodes: BuilderCanvasNode[]): void {
  clipboardNodes = nodes.map((n) => structuredClone(n));
}

/**
 * 붙여넣은(structuredClone 된) 노드의 content 내부 node-id 참조
 * (form steps.fieldNodeIds)를 새 idMap 으로 in-place remap.
 * 이미 깊은 복사된 노드라 원본 clipboard 는 영향받지 않는다.
 */
function remapPastedContentRefs(node: BuilderCanvasNode, remapNodeId: (id: string) => string): void {
  const content = node.content as { steps?: unknown };
  if (!Array.isArray(content.steps)) return;
  for (const step of content.steps as Array<{ fieldNodeIds?: unknown }>) {
    if (step && Array.isArray(step.fieldNodeIds)) {
      step.fieldNodeIds = (step.fieldNodeIds as unknown[]).map((fid) =>
        typeof fid === 'string' ? remapNodeId(fid) : fid,
      );
    }
  }
}

export function pasteNodes(offset = 20): BuilderCanvasNode[] {
  if (clipboardNodes.length === 0) return [];
  const idMap = new Map<string, string>();

  for (const node of clipboardNodes) {
    idMap.set(node.id, newId());
  }
  const remapNodeId = (id: string): string => idMap.get(id) ?? id;

  return clipboardNodes.map((node) => {
    const cloned = structuredClone(node);
    // 앵커는 고유해야 하므로 붙여넣기 사본에서 제거(동일 anchorName 중복 방지).
    cloned.anchorName = undefined;
    // content 내부 node-id 참조(form steps.fieldNodeIds)를 붙여넣은 자식 id 로 remap.
    remapPastedContentRefs(cloned, remapNodeId);
    return {
      ...cloned,
      id: idMap.get(node.id) ?? newId(),
      parentId: node.parentId && idMap.has(node.parentId) ? idMap.get(node.parentId) : undefined,
      rect: {
        ...cloned.rect,
        x: cloned.rect.x + offset,
        y: cloned.rect.y + offset,
      },
    };
  });
}

export function hasClipboard(): boolean {
  return clipboardNodes.length > 0;
}

export function getClipboardCount(): number {
  return clipboardNodes.filter((node) => !node.parentId || !clipboardNodes.some((candidate) => candidate.id === node.parentId)).length;
}

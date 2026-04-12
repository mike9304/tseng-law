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

export function pasteNodes(offset = 20): BuilderCanvasNode[] {
  if (clipboardNodes.length === 0) return [];
  return clipboardNodes.map((n) => ({
    ...structuredClone(n),
    id: newId(),
    rect: {
      ...n.rect,
      x: n.rect.x + offset,
      y: n.rect.y + offset,
    },
  }));
}

export function hasClipboard(): boolean {
  return clipboardNodes.length > 0;
}

import type { BuilderCanvasDocument, BuilderCanvasNode } from '@/lib/builder/canvas/types';

export interface DocumentDiff {
  added: BuilderCanvasNode[];
  removed: BuilderCanvasNode[];
  modified: { id: string; kind: string; changes: string[] }[];
}

export interface DocumentDiffSummary {
  added: number;
  removed: number;
  modified: number;
}

const CONTENT_DIFF_FIELDS = [
  ['text', 'text'],
  ['label', 'label'],
  ['placeholder', 'placeholder'],
  ['alt', 'alt'],
  ['title', 'title'],
  ['src', 'image'],
  ['href', 'link'],
  ['action', 'action'],
  ['address', 'address'],
  ['embedUrl', 'embed'],
] as const;

export function summarizeDiffNode(node: BuilderCanvasNode): string {
  if (node.kind === 'text') return `text - "${(node.content.text ?? '').slice(0, 40)}"`;
  if (node.kind === 'heading') return `heading H${node.content.level} - "${(node.content.text ?? '').slice(0, 40)}"`;
  if (node.kind === 'image') return `image - ${node.content.src ?? '(no src)'}`;
  if (node.kind === 'button') return `button - "${node.content.label ?? ''}"`;
  return node.kind;
}

function sameJson(left: unknown, right: unknown): boolean {
  return JSON.stringify(left) === JSON.stringify(right);
}

function previewValue(value: unknown): string {
  if (value === undefined) return 'empty';
  if (value === null) return 'null';
  if (typeof value === 'string') {
    const trimmed = value.trim();
    return trimmed.length > 36 ? `"${trimmed.slice(0, 33)}..."` : `"${trimmed}"`;
  }
  if (typeof value === 'number' || typeof value === 'boolean') return String(value);
  const serialized = JSON.stringify(value);
  if (!serialized) return String(value);
  return serialized.length > 36 ? `${serialized.slice(0, 33)}...` : serialized;
}

function describeNodeChanges(
  current: BuilderCanvasNode,
  revision: BuilderCanvasNode,
): string[] {
  const changes: string[] = [];
  if (current.kind !== revision.kind) changes.push(`kind ${revision.kind} -> ${current.kind}`);
  if (current.parentId !== revision.parentId) {
    changes.push(`parent ${previewValue(revision.parentId)} -> ${previewValue(current.parentId)}`);
  }
  if (current.visible !== revision.visible) {
    changes.push(`visibility ${revision.visible ? 'shown' : 'hidden'} -> ${current.visible ? 'shown' : 'hidden'}`);
  }
  if (current.locked !== revision.locked) {
    changes.push(`lock ${revision.locked ? 'locked' : 'unlocked'} -> ${current.locked ? 'locked' : 'unlocked'}`);
  }
  if (current.zIndex !== revision.zIndex) changes.push(`layer ${revision.zIndex} -> ${current.zIndex}`);
  if (current.rotation !== revision.rotation) changes.push(`rotation ${revision.rotation}deg -> ${current.rotation}deg`);
  if (current.rect.x !== revision.rect.x || current.rect.y !== revision.rect.y) {
    changes.push(`position ${revision.rect.x},${revision.rect.y} -> ${current.rect.x},${current.rect.y}`);
  }
  if (current.rect.width !== revision.rect.width || current.rect.height !== revision.rect.height) {
    changes.push(`size ${revision.rect.width}x${revision.rect.height} -> ${current.rect.width}x${current.rect.height}`);
  }

  const currentContent = current.content as Record<string, unknown>;
  const revisionContent = revision.content as Record<string, unknown>;
  for (const [key, label] of CONTENT_DIFF_FIELDS) {
    if (!(key in currentContent) && !(key in revisionContent)) continue;
    if (!sameJson(currentContent[key], revisionContent[key])) {
      changes.push(`${label} ${previewValue(revisionContent[key])} -> ${previewValue(currentContent[key])}`);
    }
  }

  if (
    !sameJson(current.content, revision.content)
    && !changes.some((change) => CONTENT_DIFF_FIELDS.some(([, label]) => change.startsWith(`${label} `)))
  ) {
    changes.push('content changed');
  }
  if (!sameJson(current.style, revision.style)) changes.push('style changed');
  if (!sameJson(current.hoverStyle, revision.hoverStyle)) changes.push('hover style changed');
  if (!sameJson(current.animation, revision.animation)) changes.push('animation changed');
  if (!sameJson(current.responsive, revision.responsive)) changes.push('responsive override changed');
  return changes.length > 0 ? changes.slice(0, 4) : ['node data changed'];
}

export function computeDocumentDiff(
  current: BuilderCanvasDocument,
  revision: BuilderCanvasDocument,
): DocumentDiff {
  const curById = new Map(current.nodes.map((node) => [node.id, node]));
  const revById = new Map(revision.nodes.map((node) => [node.id, node]));

  const added: BuilderCanvasNode[] = [];
  const removed: BuilderCanvasNode[] = [];
  const modified: { id: string; kind: string; changes: string[] }[] = [];

  for (const [id, node] of curById) {
    if (!revById.has(id)) {
      added.push(node);
      continue;
    }
    const rev = revById.get(id);
    if (rev && !sameJson(rev, node)) {
      modified.push({ id, kind: node.kind, changes: describeNodeChanges(node, rev) });
    }
  }
  for (const [id, node] of revById) {
    if (!curById.has(id)) removed.push(node);
  }
  return { added, removed, modified };
}

export function summarizeDocumentDiff(diff: DocumentDiff): DocumentDiffSummary {
  return {
    added: diff.added.length,
    removed: diff.removed.length,
    modified: diff.modified.length,
  };
}

export function formatDocumentDiffSummary(summary?: DocumentDiffSummary): string {
  if (!summary) return 'Diff preview 준비 중';
  const changed = summary.added + summary.removed + summary.modified;
  if (changed === 0) return '현재 draft 와 동일';
  return `+${summary.added} / -${summary.removed} / ~${summary.modified}`;
}

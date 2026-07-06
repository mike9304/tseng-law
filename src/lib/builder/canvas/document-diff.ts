import type { BuilderCanvasDocument, BuilderCanvasNode } from '@/lib/builder/canvas/types';
import {
  DEFAULT_DOCUMENT_DIFF_COPY,
  type DocumentDiffCopy,
  type DocumentDiffFieldKey,
} from '@/lib/builder/canvas/document-diff-copy';

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
] satisfies ReadonlyArray<readonly [string, DocumentDiffFieldKey]>;

export function formatDiffNodeKind(
  kind: string,
  copy: DocumentDiffCopy = DEFAULT_DOCUMENT_DIFF_COPY,
): string {
  if (kind === 'text') return copy.nodeKindLabels.text;
  if (kind === 'heading') return copy.nodeKindLabels.heading;
  if (kind === 'image') return copy.nodeKindLabels.image;
  if (kind === 'button') return copy.nodeKindLabels.button;
  return kind;
}

export function summarizeDiffNode(
  node: BuilderCanvasNode,
  copy: DocumentDiffCopy = DEFAULT_DOCUMENT_DIFF_COPY,
): string {
  if (node.kind === 'text') return copy.nodeSummary.text(String(node.content.text ?? '').slice(0, 40));
  if (node.kind === 'heading') {
    return copy.nodeSummary.heading(node.content.level, String(node.content.text ?? '').slice(0, 40));
  }
  if (node.kind === 'image') return copy.nodeSummary.image(node.content.src);
  if (node.kind === 'button') return copy.nodeSummary.button(String(node.content.label ?? ''));
  return node.kind;
}

function sameJson(left: unknown, right: unknown): boolean {
  return JSON.stringify(left) === JSON.stringify(right);
}

function previewValue(
  value: unknown,
  copy: DocumentDiffCopy = DEFAULT_DOCUMENT_DIFF_COPY,
): string {
  if (value === undefined) return copy.emptyValue;
  if (value === null) return copy.nullValue;
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
  copy: DocumentDiffCopy = DEFAULT_DOCUMENT_DIFF_COPY,
): string[] {
  const changes: string[] = [];
  if (current.kind !== revision.kind) {
    changes.push(
      `${copy.changes.kind} ${formatDiffNodeKind(revision.kind, copy)} -> ${formatDiffNodeKind(current.kind, copy)}`,
    );
  }
  if (current.parentId !== revision.parentId) {
    changes.push(
      `${copy.changes.parent} ${previewValue(revision.parentId, copy)} -> ${previewValue(current.parentId, copy)}`,
    );
  }
  if (current.visible !== revision.visible) {
    changes.push(
      `${copy.changes.visibility} ${revision.visible ? copy.states.shown : copy.states.hidden} -> ${current.visible ? copy.states.shown : copy.states.hidden}`,
    );
  }
  if (current.locked !== revision.locked) {
    changes.push(
      `${copy.changes.lock} ${revision.locked ? copy.states.locked : copy.states.unlocked} -> ${current.locked ? copy.states.locked : copy.states.unlocked}`,
    );
  }
  if (current.zIndex !== revision.zIndex) {
    changes.push(`${copy.changes.layer} ${revision.zIndex} -> ${current.zIndex}`);
  }
  if (current.rotation !== revision.rotation) {
    changes.push(`${copy.changes.rotation} ${revision.rotation}deg -> ${current.rotation}deg`);
  }
  if (current.rect.x !== revision.rect.x || current.rect.y !== revision.rect.y) {
    changes.push(
      `${copy.changes.position} ${revision.rect.x},${revision.rect.y} -> ${current.rect.x},${current.rect.y}`,
    );
  }
  if (current.rect.width !== revision.rect.width || current.rect.height !== revision.rect.height) {
    changes.push(
      `${copy.changes.size} ${revision.rect.width}x${revision.rect.height} -> ${current.rect.width}x${current.rect.height}`,
    );
  }

  const currentContent = current.content as Record<string, unknown>;
  const revisionContent = revision.content as Record<string, unknown>;
  for (const [key, label] of CONTENT_DIFF_FIELDS) {
    if (!(key in currentContent) && !(key in revisionContent)) continue;
    if (!sameJson(currentContent[key], revisionContent[key])) {
      changes.push(
        `${copy.fields[label]} ${previewValue(revisionContent[key], copy)} -> ${previewValue(currentContent[key], copy)}`,
      );
    }
  }

  if (
    !sameJson(current.content, revision.content)
    && !changes.some((change) => (
      CONTENT_DIFF_FIELDS.some(([, label]) => change.startsWith(`${copy.fields[label]} `))
    ))
  ) {
    changes.push(copy.changes.contentChanged);
  }
  if (!sameJson(current.style, revision.style)) changes.push(copy.changes.styleChanged);
  if (!sameJson(current.hoverStyle, revision.hoverStyle)) changes.push(copy.changes.hoverStyleChanged);
  if (!sameJson(current.animation, revision.animation)) changes.push(copy.changes.animationChanged);
  if (!sameJson(current.responsive, revision.responsive)) changes.push(copy.changes.responsiveOverrideChanged);
  return changes.length > 0 ? changes.slice(0, 4) : [copy.changes.nodeDataChanged];
}

export function computeDocumentDiff(
  current: BuilderCanvasDocument,
  revision: BuilderCanvasDocument,
  copy: DocumentDiffCopy = DEFAULT_DOCUMENT_DIFF_COPY,
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
      modified.push({ id, kind: node.kind, changes: describeNodeChanges(node, rev, copy) });
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

export function formatDocumentDiffSummary(
  summary?: DocumentDiffSummary,
  copy: DocumentDiffCopy = DEFAULT_DOCUMENT_DIFF_COPY,
): string {
  if (!summary) return copy.summaryLoading;
  const changed = summary.added + summary.removed + summary.modified;
  if (changed === 0) return copy.summaryNoChanges;
  return copy.summaryCounts(summary.added, summary.removed, summary.modified);
}

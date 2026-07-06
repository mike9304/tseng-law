import type { BuilderCanvasDocument, BuilderCanvasNode } from '@/lib/builder/canvas/types';
import { richTextWithFallback } from '@/lib/builder/translations/rich-text-patches';

export { replaceRichTextPlainText } from '@/lib/builder/translations/rich-text-patches';

export interface NodeTextPatch {
  text: string;
  path?: string;
}

export type NodeUpdates = Record<string, NodeTextPatch>;

export interface ApplyTranslationResult {
  ok: boolean;
  appliedCount: number;
  skipped: Array<{ nodeId: string; reason: string }>;
  targetPageId?: string;
  targetCanvas?: BuilderCanvasDocument;
}

export type NodeTextPatchResult =
  | { kind: 'applied'; node: BuilderCanvasNode }
  | { kind: 'skipped'; reason: string };

type MutableContentRecord = Record<string | number, unknown>;

function isMutableContentRecord(value: unknown): value is MutableContentRecord {
  return typeof value === 'object' && value !== null;
}

function defaultPathForKind(node: BuilderCanvasNode): string | null {
  switch (node.kind) {
    case 'text':
    case 'heading':
      return 'content.text';
    case 'button':
      return 'content.label';
    case 'image':
      return 'content.alt';
    case 'container':
    case 'section':
      return 'content.label';
    default:
      return null;
  }
}

export function setNodeContentString(
  node: BuilderCanvasNode,
  path: string,
  text: string,
): boolean {
  if (!path.startsWith('content.')) return false;
  const parts = path.split('.').slice(1);
  let current: unknown = node.content;

  for (const part of parts.slice(0, -1)) {
    if (!isMutableContentRecord(current)) return false;
    const key: string | number = /^\d+$/.test(part) ? Number(part) : part;
    current = current[key];
  }

  const last = parts.at(-1);
  if (!last || !isMutableContentRecord(current)) return false;
  const key: string | number = /^\d+$/.test(last) ? Number(last) : last;
  current[key] = text;
  return true;
}

function syncRichTextContent(
  node: BuilderCanvasNode,
  path: string,
  text: string,
  referenceNode?: BuilderCanvasNode,
): BuilderCanvasNode {
  if (path !== 'content.text') return node;

  switch (node.kind) {
    case 'text':
      return {
        ...node,
        content: {
          ...node.content,
          richText: richTextWithFallback(
            node.content.richText,
            referenceNode?.kind === 'text' ? referenceNode.content.richText : null,
            text,
          ),
        },
      };
    case 'heading':
      return {
        ...node,
        content: {
          ...node.content,
          richText: richTextWithFallback(
            node.content.richText,
            referenceNode?.kind === 'heading' ? referenceNode.content.richText : null,
            text,
          ),
        },
      };
    default:
      return node;
  }
}

export function applyNodeTextPatch(
  node: BuilderCanvasNode,
  patch: NodeTextPatch,
  referenceNode?: BuilderCanvasNode,
): NodeTextPatchResult {
  const path = patch.path ?? defaultPathForKind(node);
  if (!path) return { kind: 'skipped', reason: 'no_default_path' };

  const cloned = structuredClone(node);
  if (!setNodeContentString(cloned, path, patch.text)) {
    return { kind: 'skipped', reason: 'path_not_settable' };
  }

  return {
    kind: 'applied',
    node: syncRichTextContent(cloned, path, patch.text, referenceNode),
  };
}

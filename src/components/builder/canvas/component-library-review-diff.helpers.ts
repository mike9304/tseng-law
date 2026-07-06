import { z } from 'zod';
import {
  builderCanvasNodeSchema,
  type BuilderCanvasNode,
  type BuilderDataBindingFieldMap,
} from '@/lib/builder/canvas/types';
import type {
  ComponentLibraryEntry,
  ComponentLibraryEntryRootKind,
  ComponentLibraryEntrySummary,
} from './component-library-panel.helpers';

export type ComponentLibraryReviewDiffItem =
  | {
    readonly kind: 'rootKind';
    readonly previousRootKind: ComponentLibraryEntryRootKind;
    readonly nextRootKind: ComponentLibraryEntryRootKind;
  }
  | {
    readonly kind: 'nodeCount';
    readonly delta: number;
  }
  | {
    readonly kind: 'text';
  }
  | {
    readonly kind: 'binding';
  };

export type ComponentLibraryReviewDiffDetail =
  | {
    readonly kind: 'text';
    readonly previousText: string;
    readonly nextText: string;
  }
  | {
    readonly kind: 'binding';
    readonly previousBinding: string;
    readonly nextBinding: string;
  };

export interface ComponentLibraryReviewDiffSummary {
  readonly hasChanges: boolean;
  readonly items: readonly ComponentLibraryReviewDiffItem[];
  readonly details: readonly ComponentLibraryReviewDiffDetail[];
}

interface ComponentLibraryReviewDiffOptions {
  readonly previousEntry: ComponentLibraryEntry;
  readonly nextEntry: ComponentLibraryEntry;
  readonly previousSummary: ComponentLibraryEntrySummary;
  readonly nextSummary: ComponentLibraryEntrySummary;
}

const storedReviewSnapshotSchema = z.object({
  nodes: z.array(builderCanvasNodeSchema).optional(),
});

const TEXT_FIELD_KEYS = [
  'text',
  'label',
  'title',
  'name',
  'eyebrow',
  'description',
  'subtitle',
  'placeholder',
] as const;

const BINDING_FIELD_KEYS: readonly (keyof BuilderDataBindingFieldMap)[] = [
  'title',
  'text',
  'label',
  'description',
  'href',
  'src',
  'alt',
  'caption',
] as const;
const DIFF_DETAIL_EMPTY_VALUE = '—';
const DIFF_DETAIL_SAMPLE_LIMIT = 2;
const TEXT_CONTENT_NODE_KINDS = new Set<string>([
  'button',
  'form-checkbox',
  'form-input',
  'form-radio',
  'form-select',
  'form-submit',
  'form-textarea',
  'heading',
  'text',
]);

function isRecord(value: unknown): value is Readonly<Record<string, unknown>> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function normalizeDiffText(value: string): string {
  return value.trim().replace(/\s+/g, ' ').toLowerCase();
}

function formatDiffDetailText(value: string): string {
  return value.trim().replace(/\s+/g, ' ');
}

function firstStringField(record: Readonly<Record<string, unknown>>, keys: readonly string[]): string | null {
  for (const key of keys) {
    const value = record[key];
    if (typeof value !== 'string') continue;
    const text = formatDiffDetailText(value);
    if (text.length > 0) return text;
  }
  return null;
}

function parseReviewNodes(entry: ComponentLibraryEntry): readonly BuilderCanvasNode[] {
  try {
    const parsed: unknown = JSON.parse(entry.nodeJson);
    const snapshotResult = storedReviewSnapshotSchema.safeParse(parsed);
    const singleNodeResult = isRecord(parsed) ? builderCanvasNodeSchema.safeParse(parsed) : null;
    if (snapshotResult.success && snapshotResult.data.nodes) return snapshotResult.data.nodes;
    return singleNodeResult?.success ? [singleNodeResult.data] : [];
  } catch (error) {
    if (error instanceof SyntaxError) return [];
    throw error;
  }
}

function getContentRecord(node: BuilderCanvasNode): Readonly<Record<string, unknown>> | null {
  const content: unknown = node.content;
  return isRecord(content) ? content : null;
}

function summarizeDiffDetailSamples(samples: readonly string[]): string {
  if (samples.length === 0) return DIFF_DETAIL_EMPTY_VALUE;
  const visibleSamples = samples.slice(0, DIFF_DETAIL_SAMPLE_LIMIT);
  const remainingCount = samples.length - visibleSamples.length;
  const suffix = remainingCount > 0 ? ` +${remainingCount}` : '';
  return `${visibleSamples.join(' / ')}${suffix}`;
}

function getSampleSignature(samples: readonly string[]): string {
  return samples.map((sample) => normalizeDiffText(sample)).join('\u0000');
}

function collectTextSamples(
  nodes: readonly BuilderCanvasNode[],
  options: { readonly contentNodesOnly: boolean },
): readonly string[] {
  const samples: string[] = [];
  for (const node of nodes) {
    if (options.contentNodesOnly && !TEXT_CONTENT_NODE_KINDS.has(node.kind)) continue;
    const content = getContentRecord(node);
    const text = content ? firstStringField(content, TEXT_FIELD_KEYS) : null;
    if (text) samples.push(text);
  }
  return samples;
}

function getTextSamples(nodes: readonly BuilderCanvasNode[]): readonly string[] {
  const contentNodeSamples = collectTextSamples(nodes, { contentNodesOnly: true });
  return contentNodeSamples.length > 0 ? contentNodeSamples : collectTextSamples(nodes, { contentNodesOnly: false });
}

function getBindingSamples(nodes: readonly BuilderCanvasNode[]): readonly string[] {
  const samples: string[] = [];
  for (const node of nodes) {
    if (!node.dataBinding) continue;
    const fieldParts: string[] = [];
    for (const fieldKey of BINDING_FIELD_KEYS) {
      const fieldId = node.dataBinding.fields[fieldKey];
      if (fieldId) fieldParts.push(`${fieldKey}:${fieldId}`);
    }
    if (fieldParts.length > 0) {
      samples.push(`${node.dataBinding.targetId} · ${fieldParts.join(', ')}`);
    }
  }
  return samples;
}

export function makeComponentLibraryReviewDiff(
  options: ComponentLibraryReviewDiffOptions,
): ComponentLibraryReviewDiffSummary {
  const items: ComponentLibraryReviewDiffItem[] = [];
  const details: ComponentLibraryReviewDiffDetail[] = [];
  const previousNodes = parseReviewNodes(options.previousEntry);
  const nextNodes = parseReviewNodes(options.nextEntry);

  if (options.previousSummary.rootKind !== options.nextSummary.rootKind) {
    items.push({
      kind: 'rootKind',
      previousRootKind: options.previousSummary.rootKind,
      nextRootKind: options.nextSummary.rootKind,
    });
  }

  const nodeDelta = options.nextSummary.nodeCount - options.previousSummary.nodeCount;
  if (nodeDelta !== 0) items.push({ kind: 'nodeCount', delta: nodeDelta });

  const previousTextSamples = getTextSamples(previousNodes);
  const nextTextSamples = getTextSamples(nextNodes);
  if (getSampleSignature(previousTextSamples) !== getSampleSignature(nextTextSamples)) {
    items.push({ kind: 'text' });
    details.push({
      kind: 'text',
      previousText: summarizeDiffDetailSamples(previousTextSamples),
      nextText: summarizeDiffDetailSamples(nextTextSamples),
    });
  }

  const previousBindingSamples = getBindingSamples(previousNodes);
  const nextBindingSamples = getBindingSamples(nextNodes);
  if (getSampleSignature(previousBindingSamples) !== getSampleSignature(nextBindingSamples)) {
    items.push({ kind: 'binding' });
    details.push({
      kind: 'binding',
      previousBinding: summarizeDiffDetailSamples(previousBindingSamples),
      nextBinding: summarizeDiffDetailSamples(nextBindingSamples),
    });
  }

  return {
    hasChanges: items.length > 0,
    items,
    details,
  };
}

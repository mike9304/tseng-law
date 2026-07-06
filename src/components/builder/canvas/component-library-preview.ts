import { z } from 'zod';
import {
  builderCanvasNodeSchema,
  type BuilderCanvasNode,
  type BuilderCanvasNodeKind,
} from '@/lib/builder/canvas/types';
import type { ComponentLibraryEntry } from './component-library-panel.helpers';

export type ComponentLibraryPreviewTone = 'text' | 'media' | 'button' | 'layout' | 'form' | 'widget' | 'invalid';

export interface ComponentLibraryEntryPreview {
  readonly accentColor: string;
  readonly backgroundColor: string;
  readonly isValid: boolean;
  readonly nodeCount: number;
  readonly sampleText: string;
  readonly tone: ComponentLibraryPreviewTone;
}

interface ParsedPreviewNodes {
  readonly nodes: readonly BuilderCanvasNode[];
  readonly rootNodeId: string | null;
}

const storedPreviewSnapshotSchema = z.object({
  nodes: z.array(builderCanvasNodeSchema).optional(),
  rootNodeId: z.string().optional(),
  rootNodeIds: z.array(z.string()).optional(),
});

const MEDIA_KINDS = new Set<BuilderCanvasNodeKind>([
  'image',
  'gallery',
  'video',
  'video-embed',
  'audio',
  'lottie',
  'map',
  'multi-location-map',
  'parallax-bg',
] satisfies readonly BuilderCanvasNodeKind[]);

const FORM_KINDS = new Set<BuilderCanvasNodeKind>([
  'form',
  'form-input',
  'form-textarea',
  'form-submit',
  'form-select',
  'form-checkbox',
  'form-radio',
  'form-file',
  'form-date',
  'form-signature',
  'form-payment',
  'contactForm',
  'booking-widget',
] satisfies readonly BuilderCanvasNodeKind[]);

const LAYOUT_KINDS = new Set<BuilderCanvasNodeKind>([
  'container',
  'section',
  'composite',
  'divider',
  'spacer',
  'menu-bar',
  'anchor-menu',
  'breadcrumbs',
] satisfies readonly BuilderCanvasNodeKind[]);

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

const ACCENT_FIELD_KEYS = ['color', 'fill', 'stroke', 'borderColor', 'background'] as const;
const BACKGROUND_FIELD_KEYS = ['background', 'backgroundColor', 'overlayColor'] as const;

function isRecord(value: unknown): value is Readonly<Record<string, unknown>> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function usableColor(value: unknown): string | null {
  if (typeof value !== 'string') return null;
  const color = value.trim();
  if (!color || color === 'transparent') return null;
  if (color.startsWith('#') || color.startsWith('rgb') || color.startsWith('hsl')) return color;
  return null;
}

function firstStringField(record: Readonly<Record<string, unknown>>, keys: readonly string[]): string | null {
  for (const key of keys) {
    const value = record[key];
    if (typeof value !== 'string') continue;
    const normalized = value.trim();
    if (normalized.length > 0) return normalized.slice(0, 80);
  }
  return null;
}

function firstColorField(record: Readonly<Record<string, unknown>>, keys: readonly string[]): string | null {
  for (const key of keys) {
    const color = usableColor(record[key]);
    if (color) return color;
  }
  return null;
}

function parsePreviewNodes(entry: ComponentLibraryEntry): ParsedPreviewNodes | null {
  try {
    const parsed: unknown = JSON.parse(entry.nodeJson);
    const snapshotResult = storedPreviewSnapshotSchema.safeParse(parsed);
    const singleNodeResult = isRecord(parsed) ? builderCanvasNodeSchema.safeParse(parsed) : null;
    const nodes = snapshotResult.success && snapshotResult.data.nodes
      ? snapshotResult.data.nodes
      : singleNodeResult?.success
        ? [singleNodeResult.data]
        : [];
    if (nodes.length === 0) return null;
    const nodeIds = new Set(nodes.map((node) => node.id));
    const rootNodeId = snapshotResult.success
      ? snapshotResult.data.rootNodeIds?.at(-1)
      ?? snapshotResult.data.rootNodeId
      ?? nodes.find((node) => !node.parentId || !nodeIds.has(node.parentId))?.id
      ?? nodes[0]?.id
      ?? null
      : nodes[0]?.id ?? null;
    return { nodes, rootNodeId };
  } catch (error) {
    if (error instanceof SyntaxError) return null;
    throw error;
  }
}

function toneForNode(node: BuilderCanvasNode): ComponentLibraryPreviewTone {
  if (node.kind === 'text' || node.kind === 'heading') return 'text';
  if (node.kind === 'button' || node.kind === 'ctaBanner') return 'button';
  if (MEDIA_KINDS.has(node.kind)) return 'media';
  if (FORM_KINDS.has(node.kind)) return 'form';
  if (LAYOUT_KINDS.has(node.kind)) return 'layout';
  return 'widget';
}

function getContentRecord(node: BuilderCanvasNode): Readonly<Record<string, unknown>> | null {
  const content: unknown = node.content;
  return isRecord(content) ? content : null;
}

function getNodeSampleText(node: BuilderCanvasNode): string | null {
  const content = getContentRecord(node);
  return content ? firstStringField(content, TEXT_FIELD_KEYS) : null;
}

function getPreviewSampleText(entry: ComponentLibraryEntry, parsed: ParsedPreviewNodes): string {
  const rootId = parsed.rootNodeId;
  const childFirstNodes = rootId
    ? [...parsed.nodes.filter((node) => node.id !== rootId), ...parsed.nodes.filter((node) => node.id === rootId)]
    : parsed.nodes;
  for (const node of childFirstNodes) {
    const sample = getNodeSampleText(node);
    if (sample) return sample;
  }
  return entry.name.trim().slice(0, 80) || 'Component';
}

function getPreviewAccentColor(nodes: readonly BuilderCanvasNode[]): string {
  for (const node of nodes) {
    const content = getContentRecord(node);
    const contentColor = content ? firstColorField(content, ACCENT_FIELD_KEYS) : null;
    if (contentColor) return contentColor;
    const styleColor = usableColor(node.style.backgroundColor) ?? usableColor(node.style.borderColor);
    if (styleColor) return styleColor;
  }
  return '#116dff';
}

function getPreviewBackgroundColor(rootNode: BuilderCanvasNode | undefined): string {
  if (!rootNode) return '#eef6ff';
  const content = getContentRecord(rootNode);
  const contentColor = content ? firstColorField(content, BACKGROUND_FIELD_KEYS) : null;
  return contentColor ?? usableColor(rootNode.style.backgroundColor) ?? '#eef6ff';
}

export function getComponentLibraryEntryPreview(entry: ComponentLibraryEntry): ComponentLibraryEntryPreview {
  const parsed = parsePreviewNodes(entry);
  if (!parsed) {
    return {
      accentColor: '#ef4444',
      backgroundColor: '#fef2f2',
      isValid: false,
      nodeCount: 0,
      sampleText: entry.name.trim().slice(0, 80) || 'Invalid component',
      tone: 'invalid',
    };
  }
  const rootNode = parsed.rootNodeId
    ? parsed.nodes.find((node) => node.id === parsed.rootNodeId) ?? parsed.nodes[0]
    : parsed.nodes[0];
  return {
    accentColor: getPreviewAccentColor(parsed.nodes),
    backgroundColor: getPreviewBackgroundColor(rootNode),
    isValid: true,
    nodeCount: parsed.nodes.length,
    sampleText: getPreviewSampleText(entry, parsed),
    tone: rootNode ? toneForNode(rootNode) : 'widget',
  };
}

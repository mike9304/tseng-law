import { createCanvasNodeTemplate } from '@/lib/builder/canvas/store';
import {
  builderCanvasNodeSchema,
  type BuilderButtonCanvasNode,
  type BuilderCanvasNode,
  type BuilderDataBinding,
  type BuilderDataBindingFieldMap,
  type BuilderGalleryCanvasNode,
  type BuilderImageCanvasNode,
  type BuilderTextCanvasNode,
} from '@/lib/builder/canvas/types';
import {
  getBuilderBindableTarget,
  type BuilderDatasetFieldDefinition,
} from '@/lib/builder/datasets';
import { richTextFromPlainText } from '@/lib/builder/rich-text/sanitize';
import type { Locale } from '@/lib/locales';
import { getRepeaterTemplateCopy } from './repeater-template-copy';

const REPEATER_TEMPLATE_EDIT_KIND_PRIORITY = [
  'text',
  'heading',
  'button',
  'image',
  'gallery',
  'container',
] as const;

const REPEATER_TEMPLATE_PRIMARY_FIELD_KEYS_BY_KIND: Partial<Record<
  BuilderCanvasNode['kind'],
  Array<keyof BuilderDataBindingFieldMap>
>> = {
  text: ['text', 'href'],
  heading: ['text'],
  image: ['src', 'alt', 'href'],
  button: ['label', 'href'],
  gallery: ['src', 'caption', 'alt'],
  container: ['title', 'description', 'src'],
};

export interface RepeaterTemplateBindingSummary {
  nodeId: string;
  kindLabel: string;
  fieldId: string;
  extraCount: number;
}

interface CreateRepeaterTemplateNodeOptions {
  childNodes: readonly BuilderCanvasNode[];
  parentNode: BuilderCanvasNode;
  targetId: BuilderDataBinding['targetId'] | undefined;
  zIndex: number;
  locale: Locale;
}

interface CreateRepeaterTemplateDuplicateNodeOptions {
  childNodes: readonly BuilderCanvasNode[];
  parentNode: BuilderCanvasNode;
  sourceNode: BuilderCanvasNode;
  zIndex: number;
}

export function pickRepeaterTemplateEditTarget(
  childNodes: readonly BuilderCanvasNode[],
  targetId: string | undefined,
): BuilderCanvasNode | undefined {
  const boundChildren = targetId
    ? childNodes.filter((childNode) => childNode.dataBinding?.targetId === targetId)
    : [];
  const candidates = boundChildren.length > 0 ? boundChildren : [...childNodes];
  return REPEATER_TEMPLATE_EDIT_KIND_PRIORITY
    .map((kind) => candidates.find((childNode) => childNode.kind === kind))
    .find((childNode): childNode is BuilderCanvasNode => Boolean(childNode))
    ?? candidates[0];
}

export function resolveRepeaterTemplateBindingSummary(
  childNodes: readonly BuilderCanvasNode[],
  targetId: BuilderDataBinding['targetId'] | undefined,
): RepeaterTemplateBindingSummary[] {
  if (!targetId) return [];
  return childNodes
    .map((childNode) => {
      if (childNode.dataBinding?.targetId !== targetId) return null;
      const fields = childNode.dataBinding.fields;
      const mappedEntries = Object.entries(fields)
        .filter((entry): entry is [keyof BuilderDataBindingFieldMap, string] => Boolean(entry[1]));
      if (mappedEntries.length === 0) return null;
      const preferredKeys = REPEATER_TEMPLATE_PRIMARY_FIELD_KEYS_BY_KIND[childNode.kind] ?? [];
      const primaryKey = preferredKeys.find((key) => fields[key]) ?? mappedEntries[0][0];
      const fieldId = fields[primaryKey] ?? mappedEntries[0][1];
      return {
        nodeId: childNode.id,
        kindLabel: formatRepeaterTemplateKindLabel(childNode.kind),
        fieldId,
        extraCount: Math.max(0, mappedEntries.length - 1),
      };
    })
    .filter((entry): entry is RepeaterTemplateBindingSummary => Boolean(entry));
}

export function createRepeaterTemplateTextNode({
  childNodes,
  parentNode,
  targetId,
  zIndex,
  locale,
}: CreateRepeaterTemplateNodeOptions): BuilderTextCanvasNode {
  const { width, y } = resolveRepeaterTemplateChildMetrics(childNodes, parentNode);
  const fallbackText = getRepeaterTemplateCopy(locale).fallbackText;
  const fieldId = resolveRepeaterTemplateTextField(targetId);
  const template = createCanvasNodeTemplate('text', 0, y, zIndex);
  const dataBinding = targetId && fieldId
    ? {
        targetId,
        recordIndex: 0,
        fields: { text: fieldId },
      }
    : undefined;

  return {
    ...template,
    kind: 'text',
    parentId: parentNode.id,
    rect: {
      x: 0,
      y,
      width,
      height: 64,
    },
    style: {
      ...template.style,
      borderRadius: 0,
    },
    content: {
      text: fallbackText,
      richText: richTextFromPlainText(fallbackText),
      fontSize: 18,
      color: '#0f172a',
      fontWeight: 'bold',
      align: 'left',
      lineHeight: 1.25,
      letterSpacing: 0,
    },
    ...(dataBinding ? { dataBinding } : {}),
  } satisfies BuilderTextCanvasNode;
}

export function createRepeaterTemplateImageNode({
  childNodes,
  parentNode,
  targetId,
  zIndex,
}: CreateRepeaterTemplateNodeOptions): BuilderImageCanvasNode {
  const { width, y } = resolveRepeaterTemplateChildMetrics(childNodes, parentNode);
  const srcField = resolveRepeaterTemplateImageField(targetId);
  const altField = resolveRepeaterTemplateTextField(targetId);
  const hrefField = resolveRepeaterTemplateHrefField(targetId);
  const template = createCanvasNodeTemplate('image', 0, y, zIndex);
  const dataBinding = targetId && srcField
    ? {
        targetId,
        recordIndex: 0,
        fields: {
          src: srcField,
          ...(altField ? { alt: altField } : {}),
          ...(hrefField ? { href: hrefField } : {}),
        },
      }
    : undefined;

  return {
    ...template,
    kind: 'image',
    parentId: parentNode.id,
    rect: {
      x: 0,
      y,
      width,
      height: Math.max(104, Math.round(width * 0.56)),
    },
    style: {
      ...template.style,
      borderRadius: 12,
    },
    content: {
      src: '/images/placeholder-image.svg',
      alt: 'Bound image',
      fit: 'cover',
      link: null,
    },
    ...(dataBinding ? { dataBinding } : {}),
  } satisfies BuilderImageCanvasNode;
}

export function createRepeaterTemplateButtonNode({
  childNodes,
  parentNode,
  targetId,
  zIndex,
}: CreateRepeaterTemplateNodeOptions): BuilderButtonCanvasNode {
  const { y } = resolveRepeaterTemplateChildMetrics(childNodes, parentNode);
  const labelField = resolveRepeaterTemplateButtonLabelField(targetId);
  const hrefField = resolveRepeaterTemplateHrefField(targetId);
  const template = createCanvasNodeTemplate('button', 0, y, zIndex);
  const dataBinding = targetId && (labelField || hrefField)
    ? {
        targetId,
        recordIndex: 0,
        fields: {
          ...(labelField ? { label: labelField } : {}),
          ...(hrefField ? { href: hrefField } : {}),
        },
      }
    : undefined;

  return {
    ...template,
    kind: 'button',
    parentId: parentNode.id,
    rect: {
      x: 0,
      y,
      width: 148,
      height: 44,
    },
    style: {
      ...template.style,
      borderRadius: 999,
    },
    content: {
      label: 'Bound button',
      href: '',
      style: 'primary-solid',
      link: null,
    },
    ...(dataBinding ? { dataBinding } : {}),
  } satisfies BuilderButtonCanvasNode;
}

export function createRepeaterTemplateGalleryNode({
  childNodes,
  parentNode,
  targetId,
  zIndex,
}: CreateRepeaterTemplateNodeOptions): BuilderGalleryCanvasNode {
  const { width, y } = resolveRepeaterTemplateChildMetrics(childNodes, parentNode);
  const srcField = resolveRepeaterTemplateImageField(targetId);
  const captionField = resolveRepeaterTemplateCaptionField(targetId);
  const altField = resolveRepeaterTemplateTextField(targetId);
  const template = createCanvasNodeTemplate('gallery', 0, y, zIndex);
  const dataBinding = targetId && srcField
    ? {
        targetId,
        recordIndex: 0,
        fields: {
          src: srcField,
          ...(captionField ? { caption: captionField } : {}),
          ...(altField ? { alt: altField } : {}),
        },
      }
    : undefined;

  return {
    ...template,
    kind: 'gallery',
    parentId: parentNode.id,
    rect: {
      x: 0,
      y,
      width,
      height: Math.max(160, Math.round(width * 0.76)),
    },
    style: {
      ...template.style,
      borderRadius: 16,
    },
    content: {
      images: [
        {
          src: '/images/placeholder-image.svg',
          alt: 'Bound gallery',
          caption: 'Bound gallery',
          tags: ['template'],
        },
      ],
      layout: 'grid',
      columns: 2,
      gap: 12,
      showCaptions: true,
      captionMode: 'overlay',
      activeFilter: 'all',
      autoplay: false,
      interval: 4000,
      thumbnailPosition: 'bottom',
      proStyle: 'clean',
    },
    ...(dataBinding ? { dataBinding } : {}),
  } satisfies BuilderGalleryCanvasNode;
}

export function createRepeaterTemplateDuplicateNode({
  childNodes,
  parentNode,
  sourceNode,
  zIndex,
}: CreateRepeaterTemplateDuplicateNodeOptions): BuilderCanvasNode {
  const { y } = resolveRepeaterTemplateChildMetrics(childNodes, parentNode);
  const template = createCanvasNodeTemplate(sourceNode.kind, sourceNode.rect.x, y, zIndex);
  const dataBinding = sourceNode.dataBinding
    ? structuredClone(sourceNode.dataBinding)
    : undefined;
  return builderCanvasNodeSchema.parse({
    ...sourceNode,
    id: template.id,
    parentId: parentNode.id,
    rect: {
      ...sourceNode.rect,
      y,
    },
    style: {
      ...sourceNode.style,
    },
    content: structuredClone(sourceNode.content),
    zIndex,
    locked: false,
    ...(dataBinding ? { dataBinding } : {}),
  });
}

function formatRepeaterTemplateKindLabel(kind: BuilderCanvasNode['kind']) {
  if (kind === 'heading') return 'Heading';
  if (kind === 'image') return 'Image';
  if (kind === 'button') return 'Button';
  if (kind === 'gallery') return 'Gallery';
  if (kind === 'container') return 'Box';
  if (kind === 'text') return 'Text';
  return kind;
}

function resolveRepeaterTemplateTextField(targetId: BuilderDataBinding['targetId'] | undefined) {
  return findBindableField(
    targetId,
    (field) => field.fieldId === 'title' && field.valueKind === 'text',
  )?.fieldId
    ?? findBindableField(targetId, (field) => field.valueKind === 'text')?.fieldId;
}

function resolveRepeaterTemplateImageField(targetId: BuilderDataBinding['targetId'] | undefined) {
  return findBindableField(
    targetId,
    (field) => field.fieldId === 'featuredImage' && field.valueKind === 'image',
  )?.fieldId
    ?? findBindableField(targetId, (field) => field.valueKind === 'image')?.fieldId;
}

function resolveRepeaterTemplateHrefField(targetId: BuilderDataBinding['targetId'] | undefined) {
  return findBindableField(
    targetId,
    (field) => field.fieldId === 'href' && field.valueKind === 'url',
  )?.fieldId
    ?? findBindableField(targetId, (field) => field.valueKind === 'url')?.fieldId;
}

function resolveRepeaterTemplateButtonLabelField(targetId: BuilderDataBinding['targetId'] | undefined) {
  return findBindableField(
    targetId,
    (field) => field.fieldId === 'readTime' && field.valueKind === 'text',
  )?.fieldId
    ?? findBindableField(
      targetId,
      (field) => field.fieldId === 'title' && field.valueKind === 'text',
    )?.fieldId
    ?? findBindableField(targetId, (field) => field.valueKind === 'text')?.fieldId;
}

function resolveRepeaterTemplateCaptionField(targetId: BuilderDataBinding['targetId'] | undefined) {
  return findBindableField(
    targetId,
    (field) => field.fieldId === 'categoryLabel' && field.valueKind === 'text',
  )?.fieldId
    ?? findBindableField(
      targetId,
      (field) => field.fieldId === 'summary' && field.valueKind === 'text',
    )?.fieldId
    ?? findBindableField(
      targetId,
      (field) => field.fieldId === 'description' && field.valueKind === 'text',
    )?.fieldId
    ?? findBindableField(targetId, (field) => field.valueKind === 'text')?.fieldId;
}

function findBindableField(
  targetId: BuilderDataBinding['targetId'] | undefined,
  predicate: (field: BuilderDatasetFieldDefinition) => boolean,
): BuilderDatasetFieldDefinition | undefined {
  const fields = getBindableFields(targetId);
  return fields.find(predicate);
}

function getBindableFields(
  targetId: BuilderDataBinding['targetId'] | undefined,
): readonly BuilderDatasetFieldDefinition[] {
  if (!targetId) return [];
  try {
    return getBuilderBindableTarget(targetId).bindableFields;
  } catch (error) {
    if (error instanceof Error) return [];
    throw error;
  }
}

function resolveRepeaterTemplateChildMetrics(
  childNodes: readonly BuilderCanvasNode[],
  parentNode: BuilderCanvasNode,
) {
  const existingTemplateWidth = childNodes.reduce((width, childNode) => (
    Math.max(width, childNode.rect.x + childNode.rect.width)
  ), 0);
  const nextY = childNodes.reduce((bottom, childNode) => (
    Math.max(bottom, childNode.rect.y + childNode.rect.height)
  ), 0);
  return {
    width: Math.max(180, Math.min(280, existingTemplateWidth || parentNode.rect.width - 40)),
    y: nextY > 0 ? nextY + 12 : 0,
  };
}

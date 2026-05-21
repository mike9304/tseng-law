import type { ColumnPost } from '@/lib/columns';
import type { Locale } from '@/lib/locales';
import type {
  BuilderButtonCanvasNode,
  BuilderCanvasNode,
  BuilderContainerCanvasNode,
  BuilderDataBinding,
  BuilderDataBindingFieldMap,
  BuilderGalleryCanvasNode,
  BuilderHeadingCanvasNode,
  BuilderImageCanvasNode,
  BuilderTextCanvasNode,
} from '@/lib/builder/canvas/types';
import {
  createDefaultBuilderPageDatasets,
  getBuilderBindableTarget,
  resolveInsightsDatasetPosts,
  resolveServicesDatasetItems,
} from '@/lib/builder/datasets';
import { sanitizeLinkValue } from '@/lib/builder/links';
import { richTextFromPlainText } from '@/lib/builder/rich-text/sanitize';
import type {
  BuilderDatasetTargetId,
  BuilderPageDocument,
  BuilderServiceItem,
} from '@/lib/builder/types';

export interface BuilderDatasetFieldBindingContext {
  locale: Locale;
  posts: ColumnPost[];
  document?: Pick<BuilderPageDocument, 'pageKey' | 'datasets'>;
  serviceItems?: BuilderServiceItem[];
  recordIndexOverride?: number;
}

type ResolvedBuilderDatasetRecord =
  | { targetId: 'home.insights.feed'; record: ColumnPost }
  | { targetId: 'home.services.list'; record: BuilderServiceItem };

export function applyBuilderDatasetBindingToNode(
  node: BuilderCanvasNode,
  context: BuilderDatasetFieldBindingContext
): BuilderCanvasNode {
  if (!node.dataBinding) return node;

  switch (node.kind) {
    case 'text':
      return applyTextBinding(node, context);
    case 'heading':
      return applyHeadingBinding(node, context);
    case 'button':
      return applyButtonBinding(node, context);
    case 'image':
      return applyImageBinding(node, context);
    case 'gallery':
      return applyGalleryBinding(node, context);
    case 'container':
      return applyContainerBinding(node, context);
    default:
      return node;
  }
}

export function resolveBuilderDatasetFieldValue({
  context,
  targetId,
  fieldId,
  recordIndex = 0,
}: {
  context: BuilderDatasetFieldBindingContext;
  targetId: BuilderDatasetTargetId;
  fieldId: string;
  recordIndex?: number;
}): string | null {
  const resolved = resolveBuilderDatasetRecord(context, targetId, recordIndex);
  if (!resolved) return null;

  switch (resolved.targetId) {
    case 'home.insights.feed':
      return readColumnField(resolved.record, fieldId, context.locale);
    case 'home.services.list':
      return readServiceField(resolved.record, fieldId);
    default:
      return assertNever(resolved);
  }
}

export function resolveBuilderDatasetBindingRecordCount(
  context: BuilderDatasetFieldBindingContext,
  dataBinding: BuilderDataBinding,
  maxRecords = 12
): number {
  // Repeater container recordIndex is an editor preview cursor, not a published
  // list offset. Published repeaters always expand from the first resolved record.
  const records = resolveBuilderDatasetRecords(
    context,
    dataBinding.targetId,
    0
  );
  const normalizedMax = Number.isFinite(maxRecords)
    ? Math.max(0, Math.min(50, Math.trunc(maxRecords)))
    : 12;
  return records.slice(0, normalizedMax).length;
}

function applyTextBinding(
  node: BuilderTextCanvasNode,
  context: BuilderDatasetFieldBindingContext
): BuilderTextCanvasNode {
  const text = readMappedField(node.dataBinding, 'text', context);
  const href = readMappedField(node.dataBinding, 'href', context);
  const hasTextMapping = hasMappedField(node.dataBinding, 'text');
  const hasHrefMapping = hasMappedField(node.dataBinding, 'href');
  if (text === null && href === null && !hasTextMapping && !hasHrefMapping) return node;

  const content: BuilderTextCanvasNode['content'] = { ...node.content };
  if (text !== null) {
    content.text = text;
    content.richText = richTextFromPlainText(text);
  } else if (hasTextMapping) {
    content.text = '';
    content.richText = richTextFromPlainText('');
  }
  const link = href === null ? null : sanitizeLinkValue({ href });
  if (link) content.link = link;
  if (!link && hasHrefMapping) content.link = null;
  return { ...node, content };
}

function applyHeadingBinding(
  node: BuilderHeadingCanvasNode,
  context: BuilderDatasetFieldBindingContext
): BuilderHeadingCanvasNode {
  const text = readMappedField(node.dataBinding, 'text', context);
  const hasTextMapping = hasMappedField(node.dataBinding, 'text');
  if (text === null && !hasTextMapping) return node;
  const nextText = text ?? '';

  return {
    ...node,
    content: {
      ...node.content,
      text: nextText,
      richText: richTextFromPlainText(nextText),
    },
  };
}

function applyButtonBinding(
  node: BuilderButtonCanvasNode,
  context: BuilderDatasetFieldBindingContext
): BuilderButtonCanvasNode {
  const labelKey = hasMappedField(node.dataBinding, 'label')
    ? 'label'
    : hasMappedField(node.dataBinding, 'text')
      ? 'text'
      : null;
  const label = labelKey ? readMappedField(node.dataBinding, labelKey, context) : null;
  const href = readMappedField(node.dataBinding, 'href', context);
  const hasHrefMapping = hasMappedField(node.dataBinding, 'href');
  if (label === null && href === null && !labelKey && !hasHrefMapping) return node;

  const content: BuilderButtonCanvasNode['content'] = { ...node.content };
  if (label !== null) content.label = label;
  if (label === null && labelKey) content.label = '';

  const link = href === null ? null : sanitizeLinkValue({ href });
  if (link) {
    content.href = link.href;
    content.link = link;
  }
  if (!link && hasHrefMapping) {
    content.href = '';
    content.link = null;
  }

  return { ...node, content };
}

function applyImageBinding(
  node: BuilderImageCanvasNode,
  context: BuilderDatasetFieldBindingContext
): BuilderImageCanvasNode {
  const src = readMappedField(node.dataBinding, 'src', context);
  const alt = readMappedField(node.dataBinding, 'alt', context);
  const href = readMappedField(node.dataBinding, 'href', context);
  const hasSrcMapping = hasMappedField(node.dataBinding, 'src');
  const hasAltMapping = hasMappedField(node.dataBinding, 'alt');
  const hasHrefMapping = hasMappedField(node.dataBinding, 'href');
  if (
    src === null
    && alt === null
    && href === null
    && !hasSrcMapping
    && !hasAltMapping
    && !hasHrefMapping
  ) return node;

  const content: BuilderImageCanvasNode['content'] = { ...node.content };
  if (src) content.src = src;
  if (!src && hasSrcMapping) content.src = '';
  if (alt !== null) content.alt = alt;
  if (alt === null && hasAltMapping) content.alt = '';

  const link = href === null ? null : sanitizeLinkValue({ href });
  if (link) content.link = link;
  if (!link && hasHrefMapping) content.link = null;

  return { ...node, content };
}

function applyGalleryBinding(
  node: BuilderGalleryCanvasNode,
  context: BuilderDatasetFieldBindingContext
): BuilderGalleryCanvasNode {
  const dataBinding = node.dataBinding;
  const srcFieldId = dataBinding?.fields.src;
  if (!srcFieldId) return node;

  const records = resolveBuilderDatasetRecords(
    context,
    dataBinding.targetId,
    dataBinding.recordIndex
  );
  const captionFieldId = dataBinding.fields.caption
    ?? dataBinding.fields.text
    ?? dataBinding.fields.label;
  const altFieldId = dataBinding.fields.alt ?? captionFieldId;
  const images: BuilderGalleryCanvasNode['content']['images'] = [];
  for (const record of records) {
    const src = normalizeImageFieldValue(readResolvedRecordField(record, srcFieldId, context.locale));
    if (!src) continue;
    const alt = altFieldId ? readResolvedRecordField(record, altFieldId, context.locale) ?? '' : '';
    const caption = captionFieldId
      ? readResolvedRecordField(record, captionFieldId, context.locale) ?? undefined
      : undefined;

    images.push({
      src,
      alt,
      caption,
      tags: readGalleryRecordTags(record),
    });
    if (images.length >= 50) break;
  }

  return {
    ...node,
    content: {
      ...node.content,
      images,
    },
  };
}

function applyContainerBinding(
  node: BuilderContainerCanvasNode,
  context: BuilderDatasetFieldBindingContext
): BuilderContainerCanvasNode {
  if (node.content.layoutMode !== 'repeater') return node;
  const dataBinding = node.dataBinding;
  if (!dataBinding) return node;

  const titleFieldId = dataBinding.fields.title ?? dataBinding.fields.text ?? dataBinding.fields.label;
  const descriptionFieldId = dataBinding.fields.description ?? dataBinding.fields.caption;
  const imageFieldId = dataBinding.fields.src;
  if (!titleFieldId && !descriptionFieldId && !imageFieldId) return node;

  const layoutItems = resolveBuilderDatasetRecords(
    context,
    dataBinding.targetId,
    0
  )
    .map((record) => {
      const title = titleFieldId ? readResolvedRecordField(record, titleFieldId, context.locale) : null;
      const description = descriptionFieldId
        ? readResolvedRecordField(record, descriptionFieldId, context.locale)
        : null;
      const image = imageFieldId
        ? normalizeImageFieldValue(readResolvedRecordField(record, imageFieldId, context.locale)) ?? undefined
        : undefined;

      return {
        title: title ?? description ?? 'Untitled item',
        description: description ?? undefined,
        image,
      };
    })
    .slice(0, 12);

  return {
    ...node,
    content: {
      ...node.content,
      layoutItems,
    },
  };
}

function hasMappedField(
  dataBinding: BuilderDataBinding | undefined,
  key: keyof BuilderDataBindingFieldMap
): boolean {
  return Boolean(dataBinding?.fields[key]);
}

function readMappedField(
  dataBinding: BuilderDataBinding | undefined,
  key: keyof BuilderDataBindingFieldMap,
  context: BuilderDatasetFieldBindingContext
): string | null {
  if (!dataBinding) return null;
  const fieldId = dataBinding.fields[key];
  if (!fieldId) return null;
  return resolveBuilderDatasetFieldValue({
    context,
    targetId: dataBinding.targetId,
    fieldId,
    recordIndex: context.recordIndexOverride ?? dataBinding.recordIndex,
  });
}

function resolveBuilderDatasetRecords(
  context: BuilderDatasetFieldBindingContext,
  targetId: BuilderDatasetTargetId,
  recordIndex: number
): ResolvedBuilderDatasetRecord[] {
  const index = normalizeRecordIndex(recordIndex);
  const document = getDocumentForTarget(context, targetId);

  switch (targetId) {
    case 'home.insights.feed':
      return resolveInsightsDatasetPosts(document, context.posts)
        .slice(index)
        .map((record) => ({ targetId, record }));
    case 'home.services.list':
      return resolveServicesDatasetItems(
        document,
        context.locale,
        context.posts,
        context.serviceItems
      )
        .slice(index)
        .map((record) => ({ targetId, record }));
    default:
      return assertNever(targetId);
  }
}

function resolveBuilderDatasetRecord(
  context: BuilderDatasetFieldBindingContext,
  targetId: BuilderDatasetTargetId,
  recordIndex: number
): ResolvedBuilderDatasetRecord | null {
  const index = normalizeRecordIndex(recordIndex);
  const document = getDocumentForTarget(context, targetId);

  switch (targetId) {
    case 'home.insights.feed': {
      const record = resolveInsightsDatasetPosts(document, context.posts)[index];
      return record ? { targetId, record } : null;
    }
    case 'home.services.list': {
      const record = resolveServicesDatasetItems(
        document,
        context.locale,
        context.posts,
        context.serviceItems
      )[index];
      return record ? { targetId, record } : null;
    }
    default:
      return assertNever(targetId);
  }
}

function getDocumentForTarget(
  context: BuilderDatasetFieldBindingContext,
  targetId: BuilderDatasetTargetId
): Pick<BuilderPageDocument, 'pageKey' | 'datasets'> {
  const definition = getBuilderBindableTarget(targetId);
  if (context.document?.pageKey === definition.pageKey) {
    return context.document;
  }

  return {
    pageKey: definition.pageKey,
    datasets: createDefaultBuilderPageDatasets(definition.pageKey),
  };
}

function readColumnField(post: ColumnPost, fieldId: string, locale: Locale): string | null {
  switch (fieldId) {
    case 'slug':
      return post.slug;
    case 'title':
    case 'label':
      return post.title;
    case 'category':
      return post.category;
    case 'categoryLabel':
      return post.categoryLabel;
    case 'date':
      return post.date;
    case 'dateDisplay':
      return post.dateDisplay;
    case 'readTime':
      return post.readTime;
    case 'summary':
      return post.summary;
    case 'content':
      return post.content;
    case 'featuredImage':
    case 'image':
    case 'src':
      return post.featuredImage;
    case 'href':
    case 'url':
      return `/${locale}/columns/${post.slug}`;
    default:
      return null;
  }
}

function readResolvedRecordField(
  resolved: ResolvedBuilderDatasetRecord,
  fieldId: string,
  locale: Locale
): string | null {
  switch (resolved.targetId) {
    case 'home.insights.feed':
      return readColumnField(resolved.record, fieldId, locale);
    case 'home.services.list':
      return readServiceField(resolved.record, fieldId);
    default:
      return assertNever(resolved);
  }
}

function normalizeImageFieldValue(value: string | null): string | null {
  const trimmed = value?.trim();
  if (!trimmed) return null;
  if (
    trimmed.startsWith('/')
    || trimmed.startsWith('https://')
    || trimmed.startsWith('http://')
    || trimmed.startsWith('data:')
  ) {
    return trimmed;
  }
  return null;
}

function readGalleryRecordTags(resolved: ResolvedBuilderDatasetRecord): string[] | undefined {
  if (resolved.targetId !== 'home.insights.feed') return undefined;
  return [resolved.record.category, resolved.record.categoryLabel]
    .map((tag) => tag.trim())
    .filter(Boolean)
    .slice(0, 8);
}

function readServiceField(item: BuilderServiceItem, fieldId: string): string | null {
  switch (fieldId) {
    case 'title':
    case 'label':
      return item.title;
    case 'description':
    case 'summary':
      return item.description;
    case 'href':
    case 'url':
      return item.href;
    case 'details':
      return item.details?.join('\n') ?? '';
    default:
      return null;
  }
}

function normalizeRecordIndex(value: number): number {
  if (!Number.isFinite(value)) return 0;
  return Math.max(0, Math.min(50, Math.trunc(value)));
}

function assertNever(value: never): never {
  throw new Error(`Unhandled dataset binding value: ${String(value)}`);
}

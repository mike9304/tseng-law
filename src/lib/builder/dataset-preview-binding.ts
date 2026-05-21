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
import type {
  BuilderDataBindingPreviewTarget,
  BuilderDatasetSampleRecord,
} from '@/lib/builder/datasets';
import { sanitizeLinkValue } from '@/lib/builder/links';
import { richTextFromPlainText } from '@/lib/builder/rich-text/sanitize';

export function resolveBuilderDatasetPreviewRecord(
  targets: readonly BuilderDataBindingPreviewTarget[],
  dataBinding: BuilderDataBinding | undefined,
): BuilderDatasetSampleRecord | null {
  if (!dataBinding) return null;
  const target = targets.find((candidate) => candidate.targetId === dataBinding.targetId);
  if (!target || target.records.length === 0) return null;
  const index = normalizeRecordIndex(dataBinding.recordIndex, target.records.length);
  return target.records[index] ?? null;
}

export function applyBuilderDatasetPreviewBindingToNode(
  node: BuilderCanvasNode,
  targets: readonly BuilderDataBindingPreviewTarget[],
  options: { recordIndexOverride?: number } = {},
): BuilderCanvasNode {
  if (!node.dataBinding || targets.length === 0) return node;
  const previewNode = typeof options.recordIndexOverride === 'number'
    ? {
        ...node,
        dataBinding: {
          ...node.dataBinding,
          recordIndex: options.recordIndexOverride,
        },
      }
    : node;

  switch (previewNode.kind) {
    case 'text':
      return applyTextPreviewBinding(previewNode, targets);
    case 'heading':
      return applyHeadingPreviewBinding(previewNode, targets);
    case 'button':
      return applyButtonPreviewBinding(previewNode, targets);
    case 'image':
      return applyImagePreviewBinding(previewNode, targets);
    case 'gallery':
      return applyGalleryPreviewBinding(previewNode, targets);
    case 'container':
      return applyContainerPreviewBinding(previewNode, targets);
    default:
      return previewNode;
  }
}

function applyTextPreviewBinding(
  node: BuilderTextCanvasNode,
  targets: readonly BuilderDataBindingPreviewTarget[],
): BuilderTextCanvasNode {
  const text = readMappedPreviewField(node.dataBinding, 'text', targets);
  const href = readMappedPreviewField(node.dataBinding, 'href', targets);
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

function applyHeadingPreviewBinding(
  node: BuilderHeadingCanvasNode,
  targets: readonly BuilderDataBindingPreviewTarget[],
): BuilderHeadingCanvasNode {
  const text = readMappedPreviewField(node.dataBinding, 'text', targets);
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

function applyButtonPreviewBinding(
  node: BuilderButtonCanvasNode,
  targets: readonly BuilderDataBindingPreviewTarget[],
): BuilderButtonCanvasNode {
  const labelKey = hasMappedField(node.dataBinding, 'label')
    ? 'label'
    : hasMappedField(node.dataBinding, 'text')
      ? 'text'
      : null;
  const label = labelKey ? readMappedPreviewField(node.dataBinding, labelKey, targets) : null;
  const href = readMappedPreviewField(node.dataBinding, 'href', targets);
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

function applyImagePreviewBinding(
  node: BuilderImageCanvasNode,
  targets: readonly BuilderDataBindingPreviewTarget[],
): BuilderImageCanvasNode {
  const src = readMappedPreviewField(node.dataBinding, 'src', targets);
  const alt = readMappedPreviewField(node.dataBinding, 'alt', targets);
  const href = readMappedPreviewField(node.dataBinding, 'href', targets);
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

function applyGalleryPreviewBinding(
  node: BuilderGalleryCanvasNode,
  targets: readonly BuilderDataBindingPreviewTarget[],
): BuilderGalleryCanvasNode {
  const dataBinding = node.dataBinding;
  const srcFieldId = dataBinding?.fields.src;
  if (!srcFieldId) return node;
  const target = targets.find((candidate) => candidate.targetId === dataBinding.targetId);
  if (!target) return node;

  const captionFieldId = dataBinding.fields.caption
    ?? dataBinding.fields.text
    ?? dataBinding.fields.label;
  const altFieldId = dataBinding.fields.alt ?? captionFieldId;
  const images: BuilderGalleryCanvasNode['content']['images'] = [];
  const startIndex = normalizeRecordIndex(dataBinding.recordIndex, target.records.length);
  for (const record of target.records.slice(startIndex)) {
    const src = record.fieldValues[srcFieldId];
    if (!isUsableImageSrc(src)) continue;
    images.push({
      src,
      alt: altFieldId ? record.fieldValues[altFieldId] ?? '' : '',
      caption: captionFieldId ? record.fieldValues[captionFieldId] : undefined,
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

function applyContainerPreviewBinding(
  node: BuilderContainerCanvasNode,
  targets: readonly BuilderDataBindingPreviewTarget[],
): BuilderContainerCanvasNode {
  if (node.content.layoutMode !== 'repeater' || !node.dataBinding) return node;
  const target = targets.find((candidate) => candidate.targetId === node.dataBinding?.targetId);
  if (!target) return node;

  const titleFieldId = node.dataBinding.fields.title ?? node.dataBinding.fields.text ?? node.dataBinding.fields.label;
  const descriptionFieldId = node.dataBinding.fields.description ?? node.dataBinding.fields.caption;
  const imageFieldId = node.dataBinding.fields.src;
  if (!titleFieldId && !descriptionFieldId && !imageFieldId) return node;

  const startIndex = normalizeRecordIndex(node.dataBinding.recordIndex, target.records.length);
  const layoutItems = target.records.slice(startIndex, startIndex + 12).map((record) => {
    const title = titleFieldId ? record.fieldValues[titleFieldId] : undefined;
    const description = descriptionFieldId ? record.fieldValues[descriptionFieldId] : undefined;
    const image = imageFieldId ? record.fieldValues[imageFieldId] : undefined;
    return {
      title: title || description || record.primaryLabel,
      description: description || undefined,
      image: isUsableImageSrc(image) ? image : undefined,
    };
  });

  return {
    ...node,
    content: {
      ...node.content,
      layoutItems,
    },
  };
}

function readMappedPreviewField(
  dataBinding: BuilderDataBinding | undefined,
  key: keyof BuilderDataBindingFieldMap,
  targets: readonly BuilderDataBindingPreviewTarget[],
): string | null {
  if (!dataBinding) return null;
  const fieldId = dataBinding.fields[key];
  if (!fieldId) return null;
  const record = resolveBuilderDatasetPreviewRecord(targets, dataBinding);
  return record?.fieldValues[fieldId] ?? null;
}

function hasMappedField(
  dataBinding: BuilderDataBinding | undefined,
  key: keyof BuilderDataBindingFieldMap,
): boolean {
  return Boolean(dataBinding?.fields[key]);
}

function normalizeRecordIndex(value: number | undefined, recordCount: number): number {
  if (recordCount <= 0) return 0;
  if (!Number.isFinite(value)) return 0;
  return Math.max(0, Math.min(recordCount - 1, Math.trunc(value ?? 0)));
}

function isUsableImageSrc(value: string | undefined): value is string {
  const src = value?.trim();
  return Boolean(
    src
      && (
        src.startsWith('/')
        || src.startsWith('https://')
        || src.startsWith('http://')
        || src.startsWith('data:')
      ),
  );
}

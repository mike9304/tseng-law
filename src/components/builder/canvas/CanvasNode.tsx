'use client';

import { useState, useCallback, useRef, useEffect, type ReactNode } from 'react';
import { getComponent } from '@/lib/builder/components/registry';
import { createCanvasNodeTemplate, useBuilderCanvasStore } from '@/lib/builder/canvas/store';
import type {
  BuilderCanvasNode,
  BuilderDataBinding,
  BuilderDataBindingFieldMap,
} from '@/lib/builder/canvas/types';
import { isContainerLikeKind, isTextShapedKind } from '@/lib/builder/canvas/types';
import {
  applyBuilderDatasetPreviewBindingToNode,
  resolveBuilderDatasetPreviewRecord,
} from '@/lib/builder/dataset-preview-binding';
import { getBuilderBindableTarget } from '@/lib/builder/datasets';
import { resolveBuilderStaleDataBindingFields } from '@/lib/builder/dataset-binding-validation';
import {
  computeFlowSiblingMetrics,
  computeTopLevelFlowSectionMetrics,
  getFlowGroupKey,
  getFlowSiblingInsertionIndex,
  getFlowSiblings,
  isTopLevelFlowSection,
} from '@/lib/builder/canvas/flow';
import { parentUsesFlowLayout as parentUsesFlowLayoutFn } from '@/lib/builder/canvas/tree';
import { PREVIEW_GAP_STYLE } from './previewGapStyle';
import { isBuilderRichText, richTextFromPlainText } from '@/lib/builder/rich-text/sanitize';
import {
  resolveViewportFontSize,
  resolveViewportHidden,
  resolveViewportRect,
} from '@/lib/builder/canvas/responsive';
import {
  HOME_SECTION_TEMPLATE_VARIANTS,
  getHomeSectionTemplateVariantOptions,
  getHomeSectionTemplateTarget,
  getHomeSectionTemplateVariant,
} from '@/lib/builder/canvas/section-templates';
import {
  BUILDER_ACCORDION_PREVIEW_STACK_GAP,
  BUILDER_FAQ_ACCORDION_ITEM_HEIGHT,
  BUILDER_FAQ_ACCORDION_SECTION_HEIGHT,
  BUILDER_SERVICES_ACCORDION_CARD_HEIGHT,
  BUILDER_SERVICES_ACCORDION_SECTION_HEIGHT,
  accordionPreviewExtra,
} from '@/lib/builder/canvas/accordion-preview';
import {
  googleMapsSearchUrl,
  isOfficeMapNodeId,
  labelPrefix,
  readButtonHref,
  readButtonLabel,
  readMapAddress,
  readMapZoom,
  readNodeText,
  resolveOfficeNodeGroup,
  telHrefFromPhone,
  type OfficeLocationPreset,
} from '@/lib/builder/canvas/office-locations';
import { useBuilderTheme } from '@/components/builder/editor/BuilderThemeContext';
import {
  resolveFontWeightCss,
  resolveThemeColor,
  resolveThemeTextTypography,
} from '@/lib/builder/site/theme';
import InlineTextEditor from './InlineTextEditor';
import { CanvasNodeBadge } from './CanvasNodeBadge';
import CanvasNodeErrorBoundary from './CanvasNodeErrorBoundary';
import { CanvasNodeQuickPanels } from './CanvasNodeQuickPanels';
import { buildCanvasNodeRenderStyles } from './CanvasNodeRenderStyles';
import { useBuilderDatasetPreviewTargets } from './BuilderDatasetPreviewContext';
import { CanvasNodeSelectionOverlay } from './CanvasNodeSelectionOverlay';
import { InsightsArchiveListPreview } from './CanvasInsightsPreview';
import type { ResizeHandle } from './canvasNodeTypes';
import type { InteractionState } from './canvasInteraction';
import {
  blogFeedLayoutValue,
  containerActionValue,
  currentBuilderLocale,
  heroSearchDestinations,
  isColumnManagerTarget,
  isHeroSearchTarget,
  normalizeHeroSearchAction,
  officeIndexFromNodeId,
  textInputValue,
  type BlogFeedLayoutPreset,
} from './canvasNodeUtils';
import { useCanvasNodeRotation } from './hooks/useCanvasNodeRotation';
import {
  useCanvasNodeAnimationPreview,
  useCanvasNodeInlineEditing,
  useCanvasNodeTouchContextMenu,
} from './useCanvasNodeInteractions';
import styles from './SandboxPage.module.css';

export type { ResizeHandle } from './canvasNodeTypes';

interface CanvasNodeProps {
  node: BuilderCanvasNode;
  selected: boolean;
  onSelect: (nodeId: string, additive: boolean) => void;
  onContextMenu: (nodeId: string, event: React.MouseEvent<HTMLDivElement>) => void;
  onOpenAssetLibrary?: (nodeId: string) => void;
  onMoveStart: (nodeId: string, event: React.PointerEvent<HTMLDivElement>) => void;
  onResizeStart: (nodeId: string, handle: ResizeHandle, event: React.PointerEvent<HTMLButtonElement>) => void;
  onUpdateContent?: (nodeId: string, content: Record<string, unknown>) => void;
  onInlineEditingChange?: (nodeId: string, editing: boolean) => void;
  interaction?: InteractionState | null;
}

interface InlineTextVisualStyle {
  fontSize?: number;
  color?: string;
  fontWeight?: string;
  fontFamily?: string;
  fontStyle?: string;
  lineHeight?: string;
  letterSpacing?: string;
  textDecoration?: string;
  textTransform?: string;
}

const REPEATER_TEMPLATE_EDIT_KIND_PRIORITY = [
  'text',
  'heading',
  'button',
  'image',
  'gallery',
  'container',
] as const;

function pickRepeaterTemplateEditTarget(
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

interface RepeaterTemplateBindingSummary {
  nodeId: string;
  kindLabel: string;
  fieldId: string;
  extraCount: number;
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

function resolveRepeaterTemplateBindingSummary(
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

function resolveRepeaterTemplateTextField(targetId: BuilderDataBinding['targetId'] | undefined) {
  if (!targetId) return undefined;
  try {
    const target = getBuilderBindableTarget(targetId);
    return target.bindableFields.find((field) => field.fieldId === 'title' && field.valueKind === 'text')?.fieldId
      ?? target.bindableFields.find((field) => field.valueKind === 'text')?.fieldId;
  } catch {
    return undefined;
  }
}

function resolveRepeaterTemplateImageField(targetId: BuilderDataBinding['targetId'] | undefined) {
  if (!targetId) return undefined;
  try {
    const target = getBuilderBindableTarget(targetId);
    return target.bindableFields.find((field) => field.fieldId === 'featuredImage' && field.valueKind === 'image')?.fieldId
      ?? target.bindableFields.find((field) => field.valueKind === 'image')?.fieldId;
  } catch {
    return undefined;
  }
}

function resolveRepeaterTemplateHrefField(targetId: BuilderDataBinding['targetId'] | undefined) {
  if (!targetId) return undefined;
  try {
    const target = getBuilderBindableTarget(targetId);
    return target.bindableFields.find((field) => field.fieldId === 'href' && field.valueKind === 'url')?.fieldId
      ?? target.bindableFields.find((field) => field.valueKind === 'url')?.fieldId;
  } catch {
    return undefined;
  }
}

function resolveRepeaterTemplateButtonLabelField(targetId: BuilderDataBinding['targetId'] | undefined) {
  if (!targetId) return undefined;
  try {
    const target = getBuilderBindableTarget(targetId);
    return target.bindableFields.find((field) => field.fieldId === 'readTime' && field.valueKind === 'text')?.fieldId
      ?? target.bindableFields.find((field) => field.fieldId === 'title' && field.valueKind === 'text')?.fieldId
      ?? target.bindableFields.find((field) => field.valueKind === 'text')?.fieldId;
  } catch {
    return undefined;
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

function createRepeaterTemplateTextNode({
  childNodes,
  parentNode,
  targetId,
  zIndex,
}: {
  childNodes: readonly BuilderCanvasNode[];
  parentNode: BuilderCanvasNode;
  targetId: BuilderDataBinding['targetId'] | undefined;
  zIndex: number;
}): BuilderCanvasNode {
  const { width, y } = resolveRepeaterTemplateChildMetrics(childNodes, parentNode);
  const fallbackText = 'Bound text';
  const fieldId = resolveRepeaterTemplateTextField(targetId);
  const template = createCanvasNodeTemplate('text', 0, y, zIndex);
  return {
    ...template,
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
      ...template.content,
      text: fallbackText,
      richText: richTextFromPlainText(fallbackText),
      fontSize: 18,
      color: '#0f172a',
      fontWeight: 'bold',
      align: 'left',
      lineHeight: 1.25,
      letterSpacing: 0,
    },
    dataBinding: targetId && fieldId
      ? {
          targetId,
          recordIndex: 0,
          fields: { text: fieldId },
        }
      : undefined,
  } as BuilderCanvasNode;
}

function createRepeaterTemplateImageNode({
  childNodes,
  parentNode,
  targetId,
  zIndex,
}: {
  childNodes: readonly BuilderCanvasNode[];
  parentNode: BuilderCanvasNode;
  targetId: BuilderDataBinding['targetId'] | undefined;
  zIndex: number;
}): BuilderCanvasNode {
  const { width, y } = resolveRepeaterTemplateChildMetrics(childNodes, parentNode);
  const srcField = resolveRepeaterTemplateImageField(targetId);
  const altField = resolveRepeaterTemplateTextField(targetId);
  const hrefField = resolveRepeaterTemplateHrefField(targetId);
  const template = createCanvasNodeTemplate('image', 0, y, zIndex);
  return {
    ...template,
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
      ...template.content,
      src: '/images/placeholder-image.svg',
      alt: 'Bound image',
      fit: 'cover',
      link: null,
    },
    dataBinding: targetId && srcField
      ? {
          targetId,
          recordIndex: 0,
          fields: {
            src: srcField,
            ...(altField ? { alt: altField } : {}),
            ...(hrefField ? { href: hrefField } : {}),
          },
        }
      : undefined,
  } as BuilderCanvasNode;
}

function createRepeaterTemplateButtonNode({
  childNodes,
  parentNode,
  targetId,
  zIndex,
}: {
  childNodes: readonly BuilderCanvasNode[];
  parentNode: BuilderCanvasNode;
  targetId: BuilderDataBinding['targetId'] | undefined;
  zIndex: number;
}): BuilderCanvasNode {
  const { y } = resolveRepeaterTemplateChildMetrics(childNodes, parentNode);
  const labelField = resolveRepeaterTemplateButtonLabelField(targetId);
  const hrefField = resolveRepeaterTemplateHrefField(targetId);
  const template = createCanvasNodeTemplate('button', 0, y, zIndex);
  return {
    ...template,
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
      ...template.content,
      label: 'Bound button',
      href: '',
      style: 'primary-solid',
      link: null,
    },
    dataBinding: targetId && (labelField || hrefField)
      ? {
          targetId,
          recordIndex: 0,
          fields: {
            ...(labelField ? { label: labelField } : {}),
            ...(hrefField ? { href: hrefField } : {}),
          },
        }
      : undefined,
  } as BuilderCanvasNode;
}

function parseCssNumber(value: string): number | undefined {
  const parsed = Number.parseFloat(value);
  return Number.isFinite(parsed) ? parsed : undefined;
}

function resolveInlineTextRenderElement(root: HTMLDivElement | null): HTMLElement | null {
  const body = root?.querySelector<HTMLElement>('[data-builder-node-body="true"]');
  const firstChild = body?.firstElementChild;
  if (!(firstChild instanceof HTMLElement)) return null;
  if (firstChild.tagName.toLowerCase() !== 'a') return firstChild;
  const linkedChild = firstChild.firstElementChild;
  return linkedChild instanceof HTMLElement ? linkedChild : firstChild;
}

function captureInlineTextVisualStyle(root: HTMLDivElement | null): InlineTextVisualStyle | null {
  const element = resolveInlineTextRenderElement(root);
  if (!element) return null;
  const style = window.getComputedStyle(element);
  return {
    fontSize: parseCssNumber(style.fontSize),
    color: style.color,
    fontWeight: style.fontWeight,
    fontFamily: style.fontFamily,
    fontStyle: style.fontStyle,
    lineHeight: style.lineHeight,
    letterSpacing: style.letterSpacing,
    textDecoration: style.textDecorationLine,
    textTransform: style.textTransform,
  };
}

export default function CanvasNode({
  node,
  selected,
  onSelect,
  onContextMenu,
  onOpenAssetLibrary,
  onMoveStart,
  onResizeStart,
  onUpdateContent,
  onInlineEditingChange,
  interaction,
}: CanvasNodeProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [inlineTextVisualStyle, setInlineTextVisualStyle] = useState<InlineTextVisualStyle | null>(null);
  const [mapQuickAddressDraft, setMapQuickAddressDraft] = useState('');
  const component = getComponent(node.kind);
  const theme = useBuilderTheme();
  const datasetPreviewTargets = useBuilderDatasetPreviewTargets();
  const nodeRef = useRef<HTMLDivElement>(null);
  const mapQuickAddressRef = useRef<HTMLTextAreaElement>(null);
  const updateNode = useBuilderCanvasStore((s) => s.updateNode);
  const addChildNode = useBuilderCanvasStore((s) => s.addChildNode);
  const updateNodeRectsForViewport = useBuilderCanvasStore((s) => s.updateNodeRectsForViewport);
  const beginMutationSession = useBuilderCanvasStore((s) => s.beginMutationSession);
  const commitMutationSession = useBuilderCanvasStore((s) => s.commitMutationSession);
  const cancelMutationSession = useBuilderCanvasStore((s) => s.cancelMutationSession);
  const activeGroupId = useBuilderCanvasStore((s) => s.activeGroupId);
  const enterGroup = useBuilderCanvasStore((s) => s.enterGroup);
  const updateNodeContentInStore = useBuilderCanvasStore((s) => s.updateNodeContent);
  const primarySelectedNodeId = useBuilderCanvasStore((s) => s.selectedNodeId);
  const selectedNodeIds = useBuilderCanvasStore((s) => s.selectedNodeIds);
  const viewport = useBuilderCanvasStore((s) => s.viewport);
  const effectiveRect = resolveViewportRect(node, viewport);
  const isHiddenAtViewport = viewport !== 'desktop' && resolveViewportHidden(node, viewport);
  const effectiveFontSize = resolveViewportFontSize(node, viewport);
  const currentMapAddress = node.kind === 'map' ? readMapAddress(node) : '';
  const currentMapZoom = node.kind === 'map' ? readMapZoom(node) : 15;
  const captureInlineTextStyleForEditing = useCallback(() => {
    setInlineTextVisualStyle(captureInlineTextVisualStyle(nodeRef.current));
  }, []);

  useEffect(() => {
    setInlineTextVisualStyle(null);
  }, [node.id]);

  const { rotationReadout, handleRotationPointerDown } = useCanvasNodeRotation({
    nodeId: node.id,
    rotation: node.rotation,
    nodeRef,
    updateNode,
    beginMutationSession,
    commitMutationSession,
    cancelMutationSession,
  });

  const {
    handleDoubleClick,
    handleInlineBlur,
    handleInlineSave,
    isEditing,
    isTextKind,
  } = useCanvasNodeInlineEditing({
    nodeId: node.id,
    nodeKind: node.kind,
    nodeLocked: node.locked,
    enterGroup,
    onUpdateContent,
    onInlineEditingChange,
    onBeforeStartEditing: captureInlineTextStyleForEditing,
  });
  const animationPreviewPhase = useCanvasNodeAnimationPreview({
    animation: node.animation,
    nodeId: node.id,
    nodeLocked: node.locked,
  });

  const isTextShapedNode = isTextShapedKind(node.kind);
  const textContent = node.content as Record<string, unknown>;
  const initialRichText = isTextKind
    ? isBuilderRichText(textContent.richText)
      ? textContent.richText
      : richTextFromPlainText(typeof textContent.text === 'string' ? textContent.text : '')
    : undefined;
  const typography = isTextKind
    ? resolveThemeTextTypography(textContent as Parameters<typeof resolveThemeTextTypography>[0], theme)
    : null;
  const isActiveGroupFrame = activeGroupId === node.id;
  const isRootNode = !node.parentId;
  const isDimmedRoot = activeGroupId !== null && isRootNode && node.id !== activeGroupId;
  const isInteractive = !isDimmedRoot;
  const {
    cancelTouchContextMenuOnMove,
    clearTouchContextMenu,
    scheduleTouchContextMenu,
  } = useCanvasNodeTouchContextMenu({
    isInteractive,
    nodeLocked: node.locked,
  });
  const showColumnQuickActions = selected && isInteractive && isColumnManagerTarget(node);
  const showBlogFeedQuickEdit = selected && isInteractive && node.kind === 'blog-feed';
  const blogFeedLayout = blogFeedLayoutValue(node);
  const sectionTemplate = getHomeSectionTemplateTarget(node);
  const currentSectionTemplateVariant = getHomeSectionTemplateVariant(node);
  const sectionTemplateVariants = sectionTemplate
    ? getHomeSectionTemplateVariantOptions(sectionTemplate.id)
    : HOME_SECTION_TEMPLATE_VARIANTS;
  const showSectionTemplateActions = selected && isInteractive && Boolean(sectionTemplate);
  const preservesHitTestLayer = node.kind === 'image' || node.kind === 'video-embed' || isContainerLikeKind(node.kind);
  const selectionZIndexBoost = selected && !preservesHitTestLayer ? 10000 : 0;
  const childrenMap = useBuilderCanvasStore((s) => s.childrenMap);
  const nodesById = useBuilderCanvasStore((s) => s.nodesById);
  const interactivePreview = useBuilderCanvasStore((s) => s.interactivePreview);
  const setInteractivePreviewIndex = useBuilderCanvasStore((s) => s.setInteractivePreviewIndex);
  const heroSearchInputNode = nodesById.get('home-hero-search-input');
  const heroSearchBarNode = nodesById.get('home-hero-search-bar');
  const heroSearchButtonNode = nodesById.get('home-hero-search-button');
  const heroSearchWrapNode = nodesById.get('home-hero-search-wrap');
  const builderLocale = currentBuilderLocale();
  const heroSearchPlaceholder = textInputValue(heroSearchInputNode, 'placeholder')
    || textInputValue(heroSearchInputNode, 'text');
  const heroSearchAction = normalizeHeroSearchAction(
    containerActionValue(heroSearchBarNode),
    builderLocale,
  );
  const heroSearchDestinationOptions = heroSearchDestinations(builderLocale);
  const isSingleSelectedNode = selected && selectedNodeIds.length === 1 && primarySelectedNodeId === node.id;
  const showMapQuickEdit = isSingleSelectedNode && node.kind === 'map' && isInteractive && !node.locked;
  const showMapEditHint = !selected && isHovered && node.kind === 'map' && isInteractive && !node.locked;
  const officeQuickEdit = showMapQuickEdit && isOfficeMapNodeId(node.id)
    ? resolveOfficeNodeGroup(nodesById, node)
    : null;
  const officeTitleNode = officeQuickEdit?.titleNode ?? undefined;
  const officeAddressNode = officeQuickEdit?.addressNode ?? undefined;
  const officePhoneNode = officeQuickEdit?.phoneNode ?? undefined;
  const officeFaxNode = officeQuickEdit?.faxNode ?? undefined;
  const officeMapLinkNode = officeQuickEdit?.mapLinkNode ?? undefined;
  const officePhoneLabel = readButtonLabel(officePhoneNode);
  const officeFaxLabel = readNodeText(officeFaxNode);
  const officePhonePrefix = labelPrefix(officePhoneLabel, 'TEL');
  const officeFaxPrefix = labelPrefix(officeFaxLabel, 'FAX');
  const officeMapUrl = readButtonHref(officeMapLinkNode);
  const parentUsesFlowLayout = parentUsesFlowLayoutFn(node, nodesById);
  // Flow section metrics (top-level composites only) — computed here from store so that
  // Editor canvas renders top-level sections with the exact same marginTop / flow layout
  // as Published (public-page.tsx). This is the core of P0-02.1.
  const flowMetricsSource = Array.from(nodesById.values()).filter((n) => n.visible !== false);
  const flowSectionMetrics = computeTopLevelFlowSectionMetrics(flowMetricsSource);
  const isFlowSection = isTopLevelFlowSection(node);
  const flowSectionMetric = isFlowSection ? flowSectionMetrics.get(node.id) : undefined;

  // P0-03 (Responsive-in-Flow): For nodes that are direct children of a flex/grid
  // container, compute sibling-based marginTop using viewport-effective y values.
  // This only runs for responsive viewports (tablet/mobile) so that desktop keeps
  // the natural flex/grid layout/gap behavior; responsive overrides for y are
  // previewed via explicit margin-top (matching the generalized published logic).
  let innerFlowMarginTop: number | undefined;
  if (!isFlowSection && parentUsesFlowLayout && viewport !== 'desktop' && node.parentId) {
    const siblings = Array.from(nodesById.values()).filter(
      (n) => n.parentId === node.parentId && n.visible !== false
    );
    if (siblings.length > 0) {
      const siblingMetrics = computeFlowSiblingMetrics(siblings, viewport);
      innerFlowMarginTop = siblingMetrics.get(node.id)?.marginTop;
    }
  }
  const effectiveFlowMarginTop = flowSectionMetric?.marginTop ?? innerFlowMarginTop;

  // During active move drag OR height/position resize on a flow-layout participant
  // (top-level flow section OR direct child of a flex/grid container) in responsive
  // viewports, we temporarily force absolute positioning (using current effective rect)
  // so the gesture can freely change size/position without the flow wrapper (relative +
  // marginTop) fighting the pointer. Siblings continue using flow rendering + live
  // marginTop (via computeFlowSiblingMetrics on transient rects) for reflow preview.
  // On desktop, force absolute is used only for move (to enable zIndex reorder drag);
  // resize on desktop lets native flex/grid handle reflow.
  // Restored when interaction ends. (P0-03 A-2 resize parity + prior drag phases)
  const isFlowParticipantBeingInteracted =
    ((interaction?.type === 'move' && interaction.nodeIds.includes(node.id)) ||
     (interaction?.type === 'resize' && interaction.nodeId === node.id && viewport !== 'desktop')) &&
    (isFlowSection || parentUsesFlowLayout);

  // P0-03 A-1 + A-3 polish: Live visual insertion indicator (drop preview gap) for inner flow
  // children being dragged inside a flex/grid container in responsive viewport.
  // Mirrors the top-level previewGapInfo logic from CanvasStageNodes but scoped
  // to this container's direct flow siblings using the generalized helpers.
  // The polished indicator (thinner dashed bar with depth) is inserted into the children
  // render list at the live insertion slot for clear "where it will land" feedback.
  // Uses shared PREVIEW_GAP_STYLE (improved for A-3: tighter height, stronger line, flex-safe).
  let innerFlowPreviewGapInfo: { insertionIndex: number; draggedId: string } | null = null;
  if (interaction?.type === 'move' && viewport !== 'desktop') {
    const draggedId = interaction.nodeId;
    const draggedNode = nodesById.get(draggedId);
    if (draggedNode && draggedNode.parentId === node.id) {
      const flowGroupKey = getFlowGroupKey(draggedNode, nodesById);
      if (flowGroupKey === node.id) {
        const allNodesList = Array.from(nodesById.values());
        const insertionIndex = getFlowSiblingInsertionIndex(allNodesList, draggedId, nodesById, viewport);
        innerFlowPreviewGapInfo = { insertionIndex, draggedId };
      }
    }
  }

  // Local useSticky mirrors the guard in buildCanvasNodeRenderStyles (and published)
  // so that data-builder-sticky only appears when sticky rendering is actually active.
  // Top-level flow sections never use sticky (they use flow wrapper instead).
  const useSticky = Boolean(node.sticky) && !parentUsesFlowLayout && !isFlowSection;
  const childIds = childrenMap[node.id] ?? [];
  const nestedChildren = childIds
    .map((cid) => nodesById.get(cid))
    .filter((n): n is BuilderCanvasNode => n != null && n.visible);
  const findNodeOrAncestor = (startId: string, pattern: RegExp) => {
    let cursor: string | null = startId;
    while (cursor) {
      if (pattern.test(cursor)) return cursor;
      cursor = nodesById.get(cursor)?.parentId ?? null;
    }
    return null;
  };
  const findSelfOrAncestor = (pattern: RegExp) => findNodeOrAncestor(node.id, pattern);
  const serviceCardAncestorId = findSelfOrAncestor(/^home-services-card-\d+$/);
  const serviceCardMatch = /^home-services-card-(\d+)/.exec(serviceCardAncestorId ?? node.id);
  const selectedServiceCards = new Set(
    selectedNodeIds
      .map((selectedId) => findNodeOrAncestor(selectedId, /^home-services-card-\d+$/))
      .map((selectedId) => /^home-services-card-(\d+)/.exec(selectedId ?? '')?.[1])
      .filter((value): value is string => Boolean(value)),
  );
  const faqItemAncestorId = findSelfOrAncestor(/^home-faq-item-\d+$/);
  const faqItemMatch = /^home-faq-item-(\d+)/.exec(faqItemAncestorId ?? node.id);
  const selectedFaqItems = new Set(
    selectedNodeIds
      .map((selectedId) => findNodeOrAncestor(selectedId, /^home-faq-item-\d+$/))
      .map((selectedId) => /^home-faq-item-(\d+)/.exec(selectedId ?? '')?.[1])
      .filter((value): value is string => Boolean(value)),
  );
  const serviceCardIndex = serviceCardMatch?.[1] != null ? Number(serviceCardMatch[1]) : null;
  const faqItemIndex = faqItemMatch?.[1] != null ? Number(faqItemMatch[1]) : null;
  const selectedServiceIndex = selectedServiceCards.size > 0
    ? Number([...selectedServiceCards][0])
    : interactivePreview.servicesOpenIndex;
  const selectedFaqIndex = selectedFaqItems.size > 0
    ? Number([...selectedFaqItems][0])
    : interactivePreview.faqOpenIndex;
  const servicesRevealedIndices = new Set(
    interactivePreview.servicesRevealedIndices?.length
      ? interactivePreview.servicesRevealedIndices
      : interactivePreview.servicesOpenIndex >= 0
        ? [interactivePreview.servicesOpenIndex]
        : [],
  );
  const faqRevealedIndices = new Set(
    interactivePreview.faqRevealedIndices?.length
      ? interactivePreview.faqRevealedIndices
      : interactivePreview.faqOpenIndex >= 0
        ? [interactivePreview.faqOpenIndex]
        : [],
  );
  const servicesRootNode = nodesById.get('home-services-root');
  const faqRootNode = nodesById.get('home-faq-root');
  const servicesPreviewOpen = servicesRevealedIndices.size > 0;
  const faqPreviewOpen = faqRevealedIndices.size > 0;
  const previewExtraForNode = (
    targetNode: BuilderCanvasNode | undefined,
    expandedHeight: number,
    isOpen: boolean,
  ) => accordionPreviewExtra(
    targetNode ? resolveViewportRect(targetNode, viewport).height : undefined,
    expandedHeight,
    isOpen,
  );
  const previewStackOffsetBefore = (
    revealedIndices: Set<number>,
    currentIndex: number,
    nodePrefix: string,
    expandedHeight: number,
  ) => {
    let offset = 0;
    for (const revealedIndex of revealedIndices) {
      if (revealedIndex >= currentIndex) continue;
      const revealedNode = nodesById.get(`${nodePrefix}-${revealedIndex}`);
      offset += previewExtraForNode(revealedNode, expandedHeight, true)
        + BUILDER_ACCORDION_PREVIEW_STACK_GAP;
    }
    return offset;
  };
  const servicesSectionExtra = accordionPreviewExtra(
    servicesRootNode ? resolveViewportRect(servicesRootNode, viewport).height : undefined,
    BUILDER_SERVICES_ACCORDION_SECTION_HEIGHT,
    servicesPreviewOpen,
  );
  const faqSectionExtra = accordionPreviewExtra(
    faqRootNode ? resolveViewportRect(faqRootNode, viewport).height : undefined,
    BUILDER_FAQ_ACCORDION_SECTION_HEIGHT,
    faqPreviewOpen,
  );
  const activeOfficeIndex = officeIndexFromNodeId(primarySelectedNodeId ?? '') ?? selectedNodeIds.reduce<number | null>((activeIndex, selectedId) => {
    const nextIndex = officeIndexFromNodeId(selectedId);
    return nextIndex ?? activeIndex;
  }, null) ?? 0;
  const officeLayoutIndex = /^home-offices-layout-(\d+)$/.exec(node.id)?.[1];
  const officeTabIndex = /^home-offices-tab-(\d+)$/.exec(node.id)?.[1];
  const officeActiveIndex = officeLayoutIndex ?? officeTabIndex;
  const officeLayoutDisplay = officeLayoutIndex
    ? Number(officeLayoutIndex) === activeOfficeIndex
      ? 'block'
      : 'none'
    : undefined;
  const builderPreviewOpen = serviceCardMatch
    ? serviceCardIndex === selectedServiceIndex
      || (serviceCardIndex != null && servicesRevealedIndices.has(serviceCardIndex))
    : faqItemMatch
      ? faqItemIndex === selectedFaqIndex
        || (faqItemIndex != null && faqRevealedIndices.has(faqItemIndex))
      : false;
  const isServicePreviewFrame = serviceCardIndex != null && node.id === serviceCardAncestorId;
  const isFaqPreviewFrame = faqItemIndex != null && node.id === faqItemAncestorId;
  const topLevelPreviewOffsetY = !node.parentId && !isFlowSection
    ? (servicesRootNode && node.rect.y > servicesRootNode.rect.y ? servicesSectionExtra : 0)
      + (faqRootNode && node.rect.y > faqRootNode.rect.y ? faqSectionExtra : 0)
    : 0;
  const localPreviewOffsetY = isServicePreviewFrame
    ? previewStackOffsetBefore(
      servicesRevealedIndices,
      serviceCardIndex,
      'home-services-card',
      BUILDER_SERVICES_ACCORDION_CARD_HEIGHT,
    )
    : isFaqPreviewFrame
      ? previewStackOffsetBefore(
        faqRevealedIndices,
        faqItemIndex,
        'home-faq-item',
        BUILDER_FAQ_ACCORDION_ITEM_HEIGHT,
      )
      : 0;
  const previewExpandedHeight = node.id === 'home-services-root' && servicesPreviewOpen
    ? BUILDER_SERVICES_ACCORDION_SECTION_HEIGHT
    : node.id === 'home-faq-root' && faqPreviewOpen
      ? BUILDER_FAQ_ACCORDION_SECTION_HEIGHT
      : builderPreviewOpen && isServicePreviewFrame
        ? BUILDER_SERVICES_ACCORDION_CARD_HEIGHT
        : builderPreviewOpen && isFaqPreviewFrame
          ? BUILDER_FAQ_ACCORDION_ITEM_HEIGHT
          : undefined;
  const combinedPreviewOffsetY = topLevelPreviewOffsetY + localPreviewOffsetY;
  const servicesOpenIndex = selectedServiceIndex >= 0
    ? Math.round(selectedServiceIndex)
    : null;
  const faqOpenIndex = selectedFaqIndex >= 0
    ? Math.round(selectedFaqIndex)
    : undefined;
  const heroSearchActive = selectedNodeIds.some(isHeroSearchTarget);
  const showHeroSearchQuickEdit = selected && isInteractive && !node.locked && isHeroSearchTarget(node.id);

  const syncInteractivePreviewForSelection = useCallback(() => {
    if (serviceCardIndex != null) {
      setInteractivePreviewIndex('services', serviceCardIndex);
    }
    if (faqItemIndex != null) {
      setInteractivePreviewIndex('faq', faqItemIndex);
    }
  }, [faqItemIndex, serviceCardIndex, setInteractivePreviewIndex]);

  useEffect(() => {
    if (!selected) return;
    if (serviceCardIndex != null) {
      setInteractivePreviewIndex('services', serviceCardIndex);
      return;
    }
    if (faqItemIndex != null) {
      setInteractivePreviewIndex('faq', faqItemIndex);
    }
  }, [faqItemIndex, selected, serviceCardIndex, setInteractivePreviewIndex]);
  const heroSearchLayout = (() => {
    const wrapRect = heroSearchWrapNode?.rect;
    if (!wrapRect) return 'left';
    if (wrapRect.width >= 720) return 'wide';
    if (wrapRect.x >= 180) return 'center';
    return 'left';
  })();

  useEffect(() => {
    if (node.kind !== 'map') return;
    setMapQuickAddressDraft(currentMapAddress);
  }, [currentMapAddress, node.id, node.kind]);

  useEffect(() => {
    if (!showMapQuickEdit) return;
    const frameId = window.requestAnimationFrame(() => {
      mapQuickAddressRef.current?.focus();
      mapQuickAddressRef.current?.select();
    });
    return () => window.cancelAnimationFrame(frameId);
  }, [node.id, showMapQuickEdit]);

  const updateMapAddress = useCallback(
    (nextAddress: string, nextMapsUrl = googleMapsSearchUrl(nextAddress)) => {
      updateNodeContentInStore(node.id, { address: nextAddress });
      if (officeAddressNode) {
        updateNodeContentInStore(officeAddressNode.id, { text: nextAddress });
      }
      if (officeMapLinkNode) {
        updateNodeContentInStore(officeMapLinkNode.id, { href: nextMapsUrl });
      }
    },
    [node.id, officeAddressNode, officeMapLinkNode, updateNodeContentInStore],
  );

  const updateMapZoom = useCallback(
    (nextZoom: number) => {
      updateNodeContentInStore(node.id, {
        zoom: Math.max(1, Math.min(20, Math.round(nextZoom))),
      });
    },
    [node.id, updateNodeContentInStore],
  );

  const updateOfficeTitle = useCallback(
    (nextTitle: string) => {
      if (!officeTitleNode) return;
      updateNodeContentInStore(officeTitleNode.id, { text: nextTitle });
    },
    [officeTitleNode, updateNodeContentInStore],
  );

  const updateOfficePhone = useCallback(
    (nextPhone: string) => {
      if (!officePhoneNode) return;
      updateNodeContentInStore(officePhoneNode.id, {
        label: `${officePhonePrefix}: ${nextPhone}`,
        href: telHrefFromPhone(nextPhone),
      });
    },
    [officePhoneNode, officePhonePrefix, updateNodeContentInStore],
  );

  const updateOfficeFax = useCallback(
    (nextFax: string) => {
      if (!officeFaxNode) return;
      updateNodeContentInStore(officeFaxNode.id, { text: `${officeFaxPrefix}: ${nextFax}` });
    },
    [officeFaxNode, officeFaxPrefix, updateNodeContentInStore],
  );

  const updateOfficeMapUrl = useCallback(
    (nextUrl: string) => {
      if (!officeMapLinkNode) return;
      updateNodeContentInStore(officeMapLinkNode.id, { href: nextUrl });
    },
    [officeMapLinkNode, updateNodeContentInStore],
  );

  const updateOfficeAddress = useCallback(
    (nextAddress: string, nextMapsUrl = googleMapsSearchUrl(nextAddress)) => {
      updateMapAddress(nextAddress, nextMapsUrl);
      updateMapZoom(16);
    },
    [updateMapAddress, updateMapZoom],
  );

  const applyOfficePreset = useCallback(
    (preset: OfficeLocationPreset) => {
      updateOfficeAddress(preset.address, preset.mapsUrl);
      if (officeTitleNode) {
        updateNodeContentInStore(officeTitleNode.id, { text: preset.title });
      }
      if (officePhoneNode) {
        updateNodeContentInStore(officePhoneNode.id, {
          label: `${officePhonePrefix}: ${preset.phone}`,
          href: telHrefFromPhone(preset.phone),
        });
      }
      if (officeFaxNode && preset.fax) {
        updateNodeContentInStore(officeFaxNode.id, { text: `${officeFaxPrefix}: ${preset.fax}` });
      }
    },
    [
      officeFaxPrefix,
      officeFaxNode,
      officePhoneNode,
      officePhonePrefix,
      officeTitleNode,
      updateNodeContentInStore,
      updateOfficeAddress,
    ],
  );

  const applyMapPreset = useCallback(
    (preset: OfficeLocationPreset) => {
      if (officeQuickEdit) {
        applyOfficePreset(preset);
        return;
      }
      updateMapAddress(preset.address, preset.mapsUrl);
      updateMapZoom(16);
    },
    [applyOfficePreset, officeQuickEdit, updateMapAddress, updateMapZoom],
  );

  const updateHeroSearchPlaceholder = useCallback(
    (nextPlaceholder: string) => {
      const nextText = nextPlaceholder.trim() || nextPlaceholder;
      if (!heroSearchInputNode) return;
      updateNodeContentInStore(heroSearchInputNode.id, {
        text: nextText,
        placeholder: nextPlaceholder,
        ariaLabel: nextPlaceholder,
      });
    },
    [heroSearchInputNode, updateNodeContentInStore],
  );

  const updateHeroSearchAction = useCallback(
    (nextAction: string) => {
      if (!heroSearchBarNode) return;
      const normalizedAction = normalizeHeroSearchAction(nextAction, builderLocale);
      updateNodeContentInStore(heroSearchBarNode.id, { action: normalizedAction });
      if (heroSearchButtonNode) {
        updateNodeContentInStore(heroSearchButtonNode.id, { href: normalizedAction });
      }
    },
    [builderLocale, heroSearchBarNode, heroSearchButtonNode, updateNodeContentInStore],
  );

  const updateHeroSearchLayout = useCallback(
    (layout: 'left' | 'center' | 'wide') => {
      const width = layout === 'wide' ? 760 : 620;
      const x = layout === 'center' ? 258 : 0;
      const buttonWidth = 62;
      const inputWidth = width - buttonWidth;
      const rects = new Map<string, BuilderCanvasNode['rect']>();
      const pushRect = (nodeId: string, patch: Partial<BuilderCanvasNode['rect']>) => {
        const target = nodesById.get(nodeId);
        if (!target) return;
        rects.set(nodeId, { ...target.rect, ...patch });
      };

      pushRect('home-hero-search-wrap', { x, width });
      pushRect('home-hero-search-bar', { width });
      pushRect('home-hero-search-input', { width: inputWidth });
      pushRect('home-hero-search-button', { x: inputWidth, width: buttonWidth });
      pushRect('home-hero-quick-menu', { width });
      for (let index = 0; index < 6; index += 1) {
        pushRect(`home-hero-quick-menu-item-${index}`, { width });
      }
      if (rects.size > 0) updateNodeRectsForViewport(rects, viewport);
    },
    [nodesById, updateNodeRectsForViewport, viewport],
  );

  const updateBlogFeedLayout = useCallback(
    (preset: BlogFeedLayoutPreset) => {
      updateNodeContentInStore(node.id, {
        layout: preset.key,
        columns: preset.columns,
        gap: preset.gap,
      });
    },
    [node.id, updateNodeContentInStore],
  );

  const renderNestedChildNodes = () => {
    // Always pass interaction down so nested nodes (incl. inner flow children) can
    // correctly compute forceAbsoluteDuringInteraction (drag + responsive resize) and other
    // drag/resize-aware behaviors (P0-03).
    const renderChild = (child: BuilderCanvasNode) => {
      const isChildSelected = selectedNodeIds.includes(child.id);
      return (
        <CanvasNode
          key={child.id}
          node={child}
          selected={isChildSelected}
          onSelect={onSelect}
          onContextMenu={onContextMenu}
          onOpenAssetLibrary={onOpenAssetLibrary}
          onMoveStart={onMoveStart}
          onResizeStart={onResizeStart}
          onUpdateContent={onUpdateContent}
          onInlineEditingChange={onInlineEditingChange}
          interaction={interaction}
        />
      );
    };

    if (!innerFlowPreviewGapInfo) {
      return nestedChildren.map(renderChild);
    }

    // Live insertion indicator for flow siblings inside this container (flex/grid).
    // Render siblings in current flow-sorted order (by live rect.y) and insert
    // the polished explicit preview gap (A-3 refined shared style) at the target slot.
    // This gives clear visual drop target feedback while reflow preview runs.
    const allNodesList = Array.from(nodesById.values());
    const flowSiblings = getFlowSiblings(allNodesList, node.id);
    const sortedSiblings = [...flowSiblings].sort((left, right) =>
      left.rect.y - right.rect.y ||
      left.zIndex - right.zIndex ||
      left.id.localeCompare(right.id)
    );

    const insertionIndex = innerFlowPreviewGapInfo.insertionIndex;
    const elements: ReactNode[] = [];

    sortedSiblings.forEach((sibling, idx) => {
      const showGapBefore = insertionIndex === idx;
      if (showGapBefore) {
        elements.push(
          <div
            key={`preview-gap-inner-${idx}-${innerFlowPreviewGapInfo!.draggedId}`}
            style={PREVIEW_GAP_STYLE}
            aria-hidden
            data-preview-gap="flow-sibling"
          />
        );
      }
      elements.push(renderChild(sibling));
    });

    // Handle explicit end-of-group insertion (matches top-level pattern)
    if (insertionIndex === sortedSiblings.length) {
      elements.push(
        <div
          key={`preview-gap-inner-end-${innerFlowPreviewGapInfo!.draggedId}`}
          style={PREVIEW_GAP_STYLE}
          aria-hidden
          data-preview-gap="flow-sibling"
        />
      );
    }

    return elements;
  };

  const parentRepeaterNode = node.parentId ? nodesById.get(node.parentId) : undefined;
  const parentRepeaterBinding =
    parentRepeaterNode?.kind === 'container'
    && parentRepeaterNode.content.layoutMode === 'repeater'
    && parentRepeaterNode.dataBinding?.targetId === node.dataBinding?.targetId
      ? parentRepeaterNode.dataBinding
      : undefined;
  const parentRepeaterPreviewTarget = parentRepeaterBinding
    ? datasetPreviewTargets.find((target) => target.targetId === parentRepeaterBinding.targetId)
    : undefined;
  const parentRepeaterRecordCount = parentRepeaterPreviewTarget?.records.length ?? 0;
  const parentRepeaterRecordIndex = parentRepeaterBinding && parentRepeaterRecordCount > 0
    ? Math.max(0, Math.min(parentRepeaterRecordCount - 1, Math.trunc(parentRepeaterBinding.recordIndex ?? 0)))
    : 0;
  const showRepeaterTemplateChildBadge = selected
    && isInteractive
    && !isEditing
    && Boolean(parentRepeaterBinding)
    && parentRepeaterRecordCount > 0;
  const staleDataBindingFields = selected ? resolveBuilderStaleDataBindingFields(node) : [];
  const showDataBindingWarningBadge = selected
    && isInteractive
    && !isEditing
    && staleDataBindingFields.length > 0;
  const isRepeaterTemplateContainer = node.kind === 'container' && node.content.layoutMode === 'repeater';
  const repeaterPreviewTarget = isRepeaterTemplateContainer && node.dataBinding
    ? datasetPreviewTargets.find((target) => target.targetId === node.dataBinding?.targetId)
    : undefined;
  const repeaterRecordCount = repeaterPreviewTarget?.records.length ?? 0;
  const repeaterRecordIndex = node.dataBinding && repeaterRecordCount > 0
    ? Math.max(0, Math.min(repeaterRecordCount - 1, Math.trunc(node.dataBinding.recordIndex ?? 0)))
    : 0;
  const repeaterPreviewRecord = isRepeaterTemplateContainer
    ? resolveBuilderDatasetPreviewRecord(datasetPreviewTargets, node.dataBinding)
    : null;
  const repeaterChildCount = isRepeaterTemplateContainer ? nestedChildren.length : 0;
  const boundRepeaterChildCount = isRepeaterTemplateContainer && node.dataBinding
    ? nestedChildren.filter((childNode) => childNode.dataBinding?.targetId === node.dataBinding?.targetId).length
    : 0;
  const repeaterTemplateBindingSummary = isRepeaterTemplateContainer
    ? resolveRepeaterTemplateBindingSummary(nestedChildren, node.dataBinding?.targetId)
    : [];
  const repeaterTemplateEditTarget = isRepeaterTemplateContainer
    ? pickRepeaterTemplateEditTarget(nestedChildren, node.dataBinding?.targetId)
    : undefined;
  const showRepeaterTemplateHud = selected
    && isInteractive
    && !isEditing
    && isRepeaterTemplateContainer
    && Boolean(node.dataBinding);
  const updateRepeaterPreviewRecord = useCallback((nextIndex: number) => {
    if (!node.dataBinding || repeaterRecordCount <= 0) return;
    const recordIndex = Math.max(0, Math.min(repeaterRecordCount - 1, Math.trunc(nextIndex)));
    updateNode(node.id, (current) => {
      if (!current.dataBinding) return current;
      return {
        ...current,
        dataBinding: {
          ...current.dataBinding,
          recordIndex,
        },
      };
    });
  }, [node.dataBinding, node.id, repeaterRecordCount, updateNode]);
  const addRepeaterTemplateText = useCallback(() => {
    if (!isRepeaterTemplateContainer || !node.dataBinding) return;
    const childNode = createRepeaterTemplateTextNode({
      childNodes: nestedChildren,
      parentNode: node,
      targetId: node.dataBinding.targetId,
      zIndex: nodesById.size + 1,
    });
    addChildNode(node.id, childNode);
  }, [addChildNode, isRepeaterTemplateContainer, nestedChildren, node, nodesById.size]);
  const addRepeaterTemplateImage = useCallback(() => {
    if (!isRepeaterTemplateContainer || !node.dataBinding) return;
    const childNode = createRepeaterTemplateImageNode({
      childNodes: nestedChildren,
      parentNode: node,
      targetId: node.dataBinding.targetId,
      zIndex: nodesById.size + 1,
    });
    addChildNode(node.id, childNode);
  }, [addChildNode, isRepeaterTemplateContainer, nestedChildren, node, nodesById.size]);
  const addRepeaterTemplateButton = useCallback(() => {
    if (!isRepeaterTemplateContainer || !node.dataBinding) return;
    const childNode = createRepeaterTemplateButtonNode({
      childNodes: nestedChildren,
      parentNode: node,
      targetId: node.dataBinding.targetId,
      zIndex: nodesById.size + 1,
    });
    addChildNode(node.id, childNode);
  }, [addChildNode, isRepeaterTemplateContainer, nestedChildren, node, nodesById.size]);
  const renderNode = isEditing
    ? node
    : applyBuilderDatasetPreviewBindingToNode(node, datasetPreviewTargets, {
        recordIndexOverride: parentRepeaterBinding?.recordIndex,
      });

  const body = isEditing && isTextKind ? (
    <InlineTextEditor
      initialText={String(textContent.text || '')}
      initialRichText={initialRichText}
      fontSize={inlineTextVisualStyle?.fontSize ?? typography?.fontSize ?? 16}
      color={inlineTextVisualStyle?.color ?? resolveThemeColor(typography?.color, theme)}
      fontWeight={inlineTextVisualStyle?.fontWeight ?? (typography ? resolveFontWeightCss(typography) : 'regular')}
      fontFamily={inlineTextVisualStyle?.fontFamily ?? typography?.fontFamily}
      fontStyle={inlineTextVisualStyle?.fontStyle ?? typography?.fontStyle}
      lineHeight={inlineTextVisualStyle?.lineHeight ?? typography?.lineHeight}
      letterSpacing={inlineTextVisualStyle?.letterSpacing ?? (typography ? `${typography.letterSpacing}px` : undefined)}
      textDecoration={inlineTextVisualStyle?.textDecoration ?? typography?.textDecoration}
      textTransform={inlineTextVisualStyle?.textTransform}
      align={typeof textContent.align === 'string' ? textContent.align : 'left'}
      onSave={handleInlineSave}
      onBlur={() => {
        setInlineTextVisualStyle(null);
        handleInlineBlur();
      }}
    />
  ) : component ? (
    <CanvasNodeErrorBoundary nodeKind={node.kind} nodeId={node.id}>
      {isContainerLikeKind(renderNode.kind) ? (
        <component.Render node={renderNode} mode="edit" theme={theme} locale={builderLocale}>
          {renderNestedChildNodes()}
        </component.Render>
      ) : (
        <component.Render node={renderNode} mode="edit" theme={theme} locale={builderLocale} />
      )}
    </CanvasNodeErrorBoundary>
  ) : null;

  const isContainerLikeNode = isContainerLikeKind(node.kind);
  const isContainerWithChildren = isContainerLikeNode && nestedChildren.length > 0;
  const showSelectionHandles = selected && !node.locked && isInteractive && !isEditing;
  const showInsightsListPreview = node.id === 'home-insights-list-wrap' && isInteractive;
  const { animationSummary, bodyStyle, nodeStyle } = buildCanvasNodeRenderStyles({
    animationPreviewPhase,
    effectiveFontSize,
    effectiveRect,
    isActiveGroupFrame,
    isContainerLikeNode,
    isContainerWithChildren,
    isDimmedRoot,
    isEditing,
    isHovered,
    isTextShapedNode,
    node,
    officeLayoutDisplay,
    parentUsesFlowLayout,
    isTopLevelFlowSection: isFlowSection,
    flowSectionMarginTop: effectiveFlowMarginTop,
    flowSectionMinHeight: flowSectionMetric?.minHeight,
    forceAbsoluteDuringInteraction: isFlowParticipantBeingInteracted,
    previewExpandedHeight,
    previewOffsetY: combinedPreviewOffsetY,
    selected,
    selectionZIndexBoost,
    theme,
  });

  if (isHiddenAtViewport) {
    return null;
  }

  return (
    <div
      ref={nodeRef}
      className={`${styles.node} ${selected ? styles.nodeSelected : ''} ${node.locked ? styles.nodeLocked : ''}`}
      style={nodeStyle}
      data-node-id={node.id}
      data-selected={selected ? 'true' : undefined}
      data-builder-sticky={useSticky ? 'true' : undefined}
      data-builder-flow-section={isFlowSection ? 'true' : undefined}
      data-builder-section-template={sectionTemplate?.id}
      data-section-variant={sectionTemplate ? currentSectionTemplateVariant : undefined}
      data-builder-hero-search-active={node.id === 'home-hero-quick-menu' && heroSearchActive ? 'true' : undefined}
      data-office-active={officeActiveIndex != null ? (Number(officeActiveIndex) === activeOfficeIndex ? 'true' : 'false') : undefined}
      data-builder-preview-open={builderPreviewOpen ? 'true' : undefined}
      data-builder-services-open-index={
        node.id === 'home-services-root' && servicesOpenIndex != null
          ? String(servicesOpenIndex)
          : undefined
      }
      data-builder-faq-open-index={
        node.id === 'home-faq-root' && faqOpenIndex != null
          ? String(faqOpenIndex)
          : undefined
      }
      data-viewport={viewport}
      onPointerDown={(event) => {
        event.stopPropagation();
        if (event.altKey && node.parentId) {
          let selectedAncestorId: string | null = selected ? node.id : null;

          if (!selectedAncestorId) {
            let ancestorId: string | null = node.parentId;
            while (ancestorId) {
              if (selectedNodeIds.includes(ancestorId)) {
                selectedAncestorId = ancestorId;
                break;
              }
              ancestorId = nodesById.get(ancestorId)?.parentId ?? null;
            }
          }

          const nextSelectedId = selectedAncestorId
            ? (nodesById.get(selectedAncestorId)?.parentId ?? selectedAncestorId)
            : node.parentId;
          onSelect(nextSelectedId, false);
          return;
        }
        if (!isInteractive) return;
        if (event.button !== 0) return;
        const additive = event.metaKey || event.ctrlKey || event.shiftKey;
        syncInteractivePreviewForSelection();
        onSelect(node.id, additive);
        if (additive || node.locked) return;
        scheduleTouchContextMenu(event);
        onMoveStart(node.id, event);
      }}
      onPointerMove={cancelTouchContextMenuOnMove}
      onPointerUp={clearTouchContextMenu}
      onPointerCancel={clearTouchContextMenu}
      onPointerLeave={clearTouchContextMenu}
      onContextMenu={(event) => {
        clearTouchContextMenu();
        event.stopPropagation();
        if (!isInteractive) return;
        event.preventDefault();
        onContextMenu(node.id, event);
      }}
      onDoubleClick={(event) => {
        event.stopPropagation();
        handleDoubleClick();
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onSubmitCapture={(event) => {
        // Edit-mode safety: never let widget forms submit and reload the editor.
        event.preventDefault();
        event.stopPropagation();
      }}
      onKeyDownCapture={(event) => {
        // Enter inside a focused widget input/button can trigger an implicit
        // form submit. Swallow it so designers don't accidentally navigate.
        if (event.key === 'Enter') {
          const target = event.target as HTMLElement | null;
          const inputLike = target?.closest('input, button');
          if (inputLike) {
            event.preventDefault();
          }
        }
      }}
      onClick={(event) => {
        event.stopPropagation();
        // Prevent nested anchors / form-submit buttons inside widgets from
        // navigating the editor away when designers click to select them.
        // ⌘/Ctrl-click opens the link in a new tab (standard convention)
        // so designers can still verify navigation targets.
        const target = event.target as HTMLElement | null;
        const anchor = target?.closest<HTMLAnchorElement>('a[href]');
        const submitter = target?.closest('button[type="submit"], input[type="submit"]');
        if (anchor) {
          if (event.metaKey || event.ctrlKey) {
            const href = anchor.getAttribute('href') ?? '';
            if (href && href !== '#' && !href.startsWith('lightbox:') && !href.startsWith('popup:')) {
              try {
                window.open(href, '_blank', 'noopener,noreferrer');
              } catch {
                /* popup blocked */
              }
            }
          }
          event.preventDefault();
        } else if (submitter) {
          event.preventDefault();
        }
        if (node.kind !== 'image' || !selected || node.locked || !isInteractive) return;
        onOpenAssetLibrary?.(node.id);
      }}
    >
      <CanvasNodeBadge
        node={node}
        width={effectiveRect.width}
        height={effectiveRect.height}
        animationSummary={animationSummary}
        onSelect={onSelect}
      />
      {showRepeaterTemplateChildBadge ? (
        <div
          className={styles.repeaterTemplateChildBadge}
          data-builder-repeater-template-child-badge="true"
          aria-label="Repeater template child"
        >
          <span>Template child</span>
          <strong>Record {parentRepeaterRecordIndex + 1} from parent</strong>
        </div>
      ) : null}
      {showDataBindingWarningBadge ? (
        <div
          className={styles.dataBindingWarningBadge}
          data-builder-data-binding-canvas-warning="true"
          aria-label="Dataset binding needs attention"
        >
          <span>Dataset field missing</span>
          <strong>{staleDataBindingFields.map((field) => field.fieldId).join(', ')}</strong>
        </div>
      ) : null}
      {showRepeaterTemplateHud ? (
        <div
          className={styles.repeaterTemplateHud}
          data-builder-repeater-template-hud="true"
          onPointerDown={(event) => event.stopPropagation()}
          onClick={(event) => event.stopPropagation()}
        >
          <div className={styles.repeaterTemplateHudMeta}>
            <span data-builder-repeater-template-status="true">
              Template {boundRepeaterChildCount}/{repeaterChildCount} bound
            </span>
            <strong data-builder-repeater-template-record="true">
              {repeaterRecordCount > 0
                ? `Record ${repeaterRecordIndex + 1} of ${repeaterRecordCount}`
                : 'No matching records'}
            </strong>
            <small>
              {repeaterPreviewRecord?.primaryLabel
                ?? (repeaterRecordCount > 0 ? repeaterPreviewTarget?.title : 'Check dataset filters and CMS records')}
            </small>
            {repeaterTemplateBindingSummary.length > 0 ? (
              <div
                className={styles.repeaterTemplateHudBindings}
                data-builder-repeater-template-field-summary="true"
                aria-label="Repeater template field mappings"
              >
                {repeaterTemplateBindingSummary.map((entry) => (
                  <span
                    key={entry.nodeId}
                    className={styles.repeaterTemplateHudFieldChip}
                    data-builder-repeater-template-field-chip="true"
                    title={`${entry.kindLabel}: ${entry.fieldId}${entry.extraCount > 0 ? ` +${entry.extraCount}` : ''}`}
                  >
                    <strong>{entry.kindLabel}</strong>
                    <em>
                      {entry.fieldId}
                      {entry.extraCount > 0 ? ` +${entry.extraCount}` : ''}
                    </em>
                  </span>
                ))}
              </div>
            ) : null}
          </div>
          <div className={styles.repeaterTemplateHudActions}>
            <button
              type="button"
              aria-label="Preview previous dataset record"
              data-builder-repeater-template-prev="true"
              disabled={repeaterRecordIndex <= 0}
              onPointerDown={(event) => event.stopPropagation()}
              onClick={(event) => {
                event.stopPropagation();
                updateRepeaterPreviewRecord(repeaterRecordIndex - 1);
              }}
            >
              Prev
            </button>
            <button
              type="button"
              aria-label="Preview next dataset record"
              data-builder-repeater-template-next="true"
              disabled={repeaterRecordIndex >= repeaterRecordCount - 1}
              onPointerDown={(event) => event.stopPropagation()}
              onClick={(event) => {
                event.stopPropagation();
                updateRepeaterPreviewRecord(repeaterRecordIndex + 1);
              }}
            >
              Next
            </button>
            <button
              type="button"
              aria-label="Select first bound template child"
              data-builder-repeater-template-edit-child="true"
              disabled={!repeaterTemplateEditTarget}
              onPointerDown={(event) => event.stopPropagation()}
              onClick={(event) => {
                event.stopPropagation();
                if (!repeaterTemplateEditTarget) return;
                onSelect(repeaterTemplateEditTarget.id, false);
              }}
            >
              Edit
            </button>
            <button
              type="button"
              aria-label="Add bound text to repeater template"
              data-builder-repeater-template-add-text="true"
              onPointerDown={(event) => event.stopPropagation()}
              onClick={(event) => {
                event.stopPropagation();
                addRepeaterTemplateText();
              }}
            >
              Text
            </button>
            <button
              type="button"
              aria-label="Add bound image to repeater template"
              data-builder-repeater-template-add-image="true"
              onPointerDown={(event) => event.stopPropagation()}
              onClick={(event) => {
                event.stopPropagation();
                addRepeaterTemplateImage();
              }}
            >
              Image
            </button>
            <button
              type="button"
              aria-label="Add bound button to repeater template"
              data-builder-repeater-template-add-button="true"
              onPointerDown={(event) => event.stopPropagation()}
              onClick={(event) => {
                event.stopPropagation();
                addRepeaterTemplateButton();
              }}
            >
              Button
            </button>
          </div>
        </div>
      ) : null}
      <CanvasNodeQuickPanels
        nodeId={node.id}
        selected={selected}
        showSectionTemplateActions={showSectionTemplateActions}
        sectionTemplate={sectionTemplate}
        sectionTemplateVariants={sectionTemplateVariants}
        currentSectionTemplateVariant={currentSectionTemplateVariant}
        onSectionTemplateVariantChange={(variant) => updateNodeContentInStore(node.id, { variant })}
        showBlogFeedQuickEdit={showBlogFeedQuickEdit}
        blogFeedLayout={blogFeedLayout}
        onBlogFeedLayoutChange={updateBlogFeedLayout}
        showColumnQuickActions={showColumnQuickActions}
        showHeroSearchQuickEdit={showHeroSearchQuickEdit}
        heroSearchLayout={heroSearchLayout}
        onHeroSearchLayoutChange={updateHeroSearchLayout}
        heroSearchPlaceholder={heroSearchPlaceholder}
        onHeroSearchPlaceholderChange={updateHeroSearchPlaceholder}
        heroSearchAction={heroSearchAction}
        onHeroSearchActionChange={updateHeroSearchAction}
        heroSearchDestinationOptions={heroSearchDestinationOptions}
        showMapEditHint={showMapEditHint}
        showMapQuickEdit={showMapQuickEdit}
        officeQuickEdit={Boolean(officeQuickEdit)}
        builderLocale={builderLocale}
        currentMapAddress={currentMapAddress}
        currentMapZoom={currentMapZoom}
        mapQuickAddressDraft={mapQuickAddressDraft}
        setMapQuickAddressDraft={setMapQuickAddressDraft}
        mapQuickAddressRef={mapQuickAddressRef}
        onSelect={onSelect}
        applyMapPreset={applyMapPreset}
        updateMapAddress={updateMapAddress}
        updateMapZoom={updateMapZoom}
        officeTitleNode={officeTitleNode}
        officePhoneNode={officePhoneNode}
        officeFaxNode={officeFaxNode}
        officeMapLinkNode={officeMapLinkNode}
        officePhoneLabel={officePhoneLabel}
        officeFaxLabel={officeFaxLabel}
        officeMapUrl={officeMapUrl}
        updateOfficeTitle={updateOfficeTitle}
        updateOfficePhone={updateOfficePhone}
        updateOfficeFax={updateOfficeFax}
        updateOfficeMapUrl={updateOfficeMapUrl}
      />
      <div
        data-builder-node-body="true"
        className={styles.nodeBody}
        style={bodyStyle}
      >
        {body}
        {!isContainerLikeNode ? renderNestedChildNodes() : null}
      </div>
      {showInsightsListPreview ? <InsightsArchiveListPreview locale={currentBuilderLocale()} /> : null}
      {node.kind === 'map' && !node.locked && isInteractive ? (
        <div
          className={styles.nodeMapHitArea}
          data-builder-map-hit-area="true"
          aria-hidden
          onPointerDown={(event) => {
            event.stopPropagation();
            if (event.button !== 0) return;
            const additive = event.metaKey || event.ctrlKey || event.shiftKey;
            const wasSelected = selected;
            onSelect(node.id, additive);
            if (additive || !wasSelected) return;
            scheduleTouchContextMenu(event);
            onMoveStart(node.id, event);
          }}
          onPointerMove={cancelTouchContextMenuOnMove}
          onPointerUp={clearTouchContextMenu}
          onPointerCancel={clearTouchContextMenu}
          onPointerLeave={clearTouchContextMenu}
          onClick={(event) => {
            event.stopPropagation();
            if (!selected) onSelect(node.id, false);
          }}
        />
      ) : null}
      <CanvasNodeSelectionOverlay
        show={showSelectionHandles}
        nodeId={node.id}
        nodeKind={node.kind}
        width={effectiveRect.width}
        height={effectiveRect.height}
        rotationReadout={rotationReadout}
        onRotationPointerDown={handleRotationPointerDown}
        onResizeStart={onResizeStart}
      />
    </div>
  );
}

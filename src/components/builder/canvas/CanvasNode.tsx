'use client';

import { memo, useState, useCallback, useRef, useEffect, type ReactNode } from 'react';
import { getComponent } from '@/lib/builder/components/registry';
import { useBuilderCanvasStore } from '@/lib/builder/canvas/store';
import type {
  BuilderCanvasNode,
} from '@/lib/builder/canvas/types';
import { isStandalonePublishParityAnchor } from '@/lib/builder/canvas/decomposable-slugs';
import { isContainerLikeKind, isTextShapedKind } from '@/lib/builder/canvas/types';
import {
  applyBuilderDatasetPreviewBindingToNode,
  resolveBuilderDatasetPreviewRecord,
} from '@/lib/builder/dataset-preview-binding';
import { resolveBuilderStaleDataBindingFields } from '@/lib/builder/dataset-binding-validation';
import {
  isTopLevelFlowSection,
} from '@/lib/builder/canvas/flow';
import { PREVIEW_GAP_STYLE } from './previewGapStyle';
import { isBuilderRichText, richTextFromPlainText } from '@/lib/builder/rich-text/sanitize';
import type { BuilderRichText } from '@/lib/builder/rich-text/types';
import {
  resolveViewportFontSize,
  resolveViewportHidden,
  resolveViewportRect,
  type Viewport,
} from '@/lib/builder/canvas/responsive';
import type { Locale } from '@/lib/locales';
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
import CodeAssistantPanel from '@/components/builder/dev/CodeAssistantPanel';
import { buildCanvasNodeRenderStyles, SELECTED_CANVAS_NODE_Z_INDEX_BOOST } from './CanvasNodeRenderStyles';
import {
  useBuilderColumnPosts,
  useBuilderDatasetPreviewTargets,
  useBuilderFaqCategories,
  useBuilderFaqItems,
} from './BuilderDatasetPreviewContext';
import { CanvasNodeSelectionOverlay } from './CanvasNodeSelectionOverlay';
import { SelectedRepeaterTemplateChildControls } from './SelectedRepeaterTemplateChildControls';
import { RepeaterTemplateCanvasHud } from './RepeaterTemplateCanvasHud';
import {
  collectRepeaterTemplateBindingNodes,
  findRepeaterTemplateParentNode,
  resolveRepeaterTemplateActiveNodeIds,
} from './repeater-template-context';
import { resolveRepeaterTemplateBindingSummaryWithLocks } from './repeater-template-binding-locks';
import { getRepeaterTemplateCopy } from './repeater-template-copy';
import {
  createRepeaterTemplateButtonNode,
  createRepeaterTemplateDuplicateNode,
  createRepeaterTemplateGalleryNode,
  createRepeaterTemplateImageNode,
  createRepeaterTemplateTextNode,
  pickRepeaterTemplateEditTarget,
} from './repeater-template-nodes';
import type { ResizeHandle } from './canvasNodeTypes';
import type { InteractionState } from './canvasInteraction';
import {
  blogFeedLayoutValue,
  containerActionValue,
  heroSearchDestinations,
  isColumnManagerTarget,
  isHeroSearchTarget,
  normalizeHeroSearchAction,
  officeIndexFromNodeId,
  textInputValue,
  type BlogFeedLayoutPreset,
  type HeroSearchDestination,
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
  flowSectionMetrics: Map<string, { marginTop: number; minHeight: number }>;
  flowLayoutChildNodeIds: ReadonlySet<string>;
  innerFlowSiblingMetrics: Map<string, { marginTop: number; minHeight: number }>;
  visibleChildrenByParentId: ReadonlyMap<string, readonly BuilderCanvasNode[]>;
  innerFlowPreviewGapInfo: CanvasNodeInnerFlowPreviewGapInfo | null;
  viewport: Viewport;
  locale: Locale;
  onSelect: (nodeId: string, additive: boolean) => void;
  onContextMenu: (nodeId: string, event: React.MouseEvent<HTMLDivElement>) => void;
  onOpenAssetLibrary?: (nodeId: string) => void;
  onMoveStart: (nodeId: string, event: React.PointerEvent<HTMLDivElement>) => void;
  onResizeStart: (nodeId: string, handle: ResizeHandle, event: React.PointerEvent<HTMLButtonElement>) => void;
  onUpdateContent?: (nodeId: string, content: Record<string, unknown>) => void;
  onInlineEditingChange?: (nodeId: string, editing: boolean) => void;
  onCanvasPageLink?: (href: string) => void;
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

export interface InlineTextCaretCoords {
  x: number;
  y: number;
}

type InlineTextTargetElement = Pick<HTMLElement, 'dataset' | 'getBoundingClientRect'>;

const inlineTextCaretCoordsByNodeId = new Map<string, InlineTextCaretCoords>();

export function rememberInlineTextCaretCoords(nodeId: string, coords: InlineTextCaretCoords): void {
  if (!Number.isFinite(coords.x) || !Number.isFinite(coords.y)) {
    inlineTextCaretCoordsByNodeId.delete(nodeId);
    return;
  }
  inlineTextCaretCoordsByNodeId.set(nodeId, coords);
}

export function readInlineTextCaretCoords(nodeId: string): InlineTextCaretCoords | null {
  return inlineTextCaretCoordsByNodeId.get(nodeId) ?? null;
}

export function clearInlineTextCaretCoords(nodeId: string): void {
  inlineTextCaretCoordsByNodeId.delete(nodeId);
}

export function createInlineTextTypographySession() {
  let frozen = false;
  return {
    capture(capture: () => boolean): boolean {
      if (frozen) return false;
      const captured = capture();
      if (captured) frozen = true;
      return captured;
    },
    reset(): void {
      frozen = false;
    },
    isFrozen(): boolean {
      return frozen;
    },
  };
}

function closestCanvasNodeElement(target: EventTarget | null): InlineTextTargetElement | null {
  const closest = (target as { closest?: (selector: string) => Element | null } | null)?.closest;
  if (typeof closest !== 'function') return null;
  return closest.call(target, '[data-node-id]') as InlineTextTargetElement | null;
}

export function resolveInlineTextEditTarget(
  target: EventTarget | null,
  nodesById: ReadonlyMap<string, BuilderCanvasNode>,
): { nodeId: string; element: InlineTextTargetElement } | null {
  const element = closestCanvasNodeElement(target);
  if (!element) return null;
  const candidateId = element.dataset.nodeId;
  const candidate = candidateId ? nodesById.get(candidateId) : null;
  if (
    !candidate
    || (candidate.kind !== 'text' && candidate.kind !== 'heading')
    || candidate.locked
  ) return null;

  const rect = element.getBoundingClientRect();
  const hidden = typeof HTMLElement !== 'undefined'
    && element instanceof HTMLElement
    && window.getComputedStyle(element).visibility === 'hidden';
  return rect.width > 0 && rect.height > 0 && !hidden
    ? { nodeId: candidate.id, element }
    : null;
}

export type CanvasNodeInnerFlowPreviewGapInfo = {
  parentId: string;
  insertionIndex: number;
  draggedId: string;
};

const EMPTY_HERO_SEARCH_DESTINATIONS: HeroSearchDestination[] = [];
const EMPTY_PREVIEW_INDICES: number[] = [];
const EMPTY_PREVIEW_INDEX_SET: ReadonlySet<number> = new Set<number>();
const EMPTY_CANVAS_NODE_CHILDREN: readonly BuilderCanvasNode[] = [];
const EMPTY_CANVAS_NODE_IDS: readonly string[] = [];
const HOME_HERO_ROOT_NODE_ID = 'home-hero-root';
const HOME_HERO_SEARCH_WRAPPER_NODE_ID = 'home-hero-search-wrapper';
const HOME_HERO_SEARCH_BASELINE_Y = 618;
const HOME_HERO_SEARCH_STRADDLE_OVERLAP_Y = 45;

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

function resolveHomeHeroSearchEditorRect(
  node: BuilderCanvasNode,
  effectiveRect: ReturnType<typeof resolveViewportRect>,
  nodesById: ReadonlyMap<string, BuilderCanvasNode>,
  viewport: Viewport,
): ReturnType<typeof resolveViewportRect> {
  if (
    viewport !== 'desktop'
    || node.id !== HOME_HERO_SEARCH_WRAPPER_NODE_ID
    || node.parentId !== HOME_HERO_ROOT_NODE_ID
  ) {
    return effectiveRect;
  }

  const heroRoot = nodesById.get(HOME_HERO_ROOT_NODE_ID);
  if (!heroRoot) return effectiveRect;

  const heroRootRect = resolveViewportRect(heroRoot, viewport);
  const targetY = heroRootRect.height - HOME_HERO_SEARCH_STRADDLE_OVERLAP_Y;
  const yCorrection = targetY - HOME_HERO_SEARCH_BASELINE_Y;
  if (!Number.isFinite(yCorrection) || Math.abs(yCorrection) < 0.5) return effectiveRect;

  return {
    ...effectiveRect,
    y: effectiveRect.y + yCorrection,
  };
}

function findSelectedNodeOrAncestorId(
  nodeId: string,
  selectedNodeIdSet: ReadonlySet<string>,
  nodesById: Map<string, BuilderCanvasNode>,
): string | null {
  let selectedAncestorId: string | null = null;
  let ancestorId: string | null = nodeId;
  while (ancestorId) {
    if (selectedNodeIdSet.has(ancestorId)) {
      selectedAncestorId = ancestorId;
      break;
    }
    ancestorId = nodesById.get(ancestorId)?.parentId ?? null;
  }
  return selectedAncestorId;
}

function isSelectionChromePointerTarget(target: EventTarget | null): boolean {
  if (!(target instanceof HTMLElement)) return false;
  if (target.closest('[data-builder-inline-text-editor="true"], [data-builder-inline-text-toolbar="true"]')) {
    return true;
  }
  const control = target.closest('button,[role="button"]');
  const ariaLabel = control?.getAttribute('aria-label') ?? '';
  return ariaLabel.startsWith('Resize ') || ariaLabel.startsWith('Rotate ');
}

function findSelectedDomAncestorId(eventTarget: EventTarget | null): string | null {
  if (!(eventTarget instanceof HTMLElement)) return null;
  const hitNode = eventTarget.closest<HTMLElement>('[data-node-id]');
  const selectedAncestor = hitNode?.parentElement?.closest<HTMLElement>('[data-node-id][data-selected="true"]');
  return selectedAncestor?.dataset.nodeId ?? null;
}

function findNodeOrAncestorId(
  nodesById: Map<string, BuilderCanvasNode>,
  nodeId: string,
  pattern: RegExp,
): string | null {
  let currentId: string | null = nodeId;
  while (currentId) {
    if (pattern.test(currentId)) return currentId;
    currentId = nodesById.get(currentId)?.parentId ?? null;
  }
  return null;
}

function resolvePreviewIndexSet(
  needsPreviewState: boolean,
  revealedPreviewIndices: readonly number[],
  fallbackIndex: number,
): ReadonlySet<number> {
  if (!needsPreviewState) return EMPTY_PREVIEW_INDEX_SET;
  if (revealedPreviewIndices.length > 0) return new Set(revealedPreviewIndices);
  return fallbackIndex >= 0 ? new Set([fallbackIndex]) : EMPTY_PREVIEW_INDEX_SET;
}

const CanvasNode = memo(function CanvasNode({
  node,
  flowSectionMetrics,
  flowLayoutChildNodeIds,
  innerFlowSiblingMetrics,
  visibleChildrenByParentId,
  innerFlowPreviewGapInfo,
  viewport,
  locale,
  onSelect,
  onContextMenu,
  onOpenAssetLibrary,
  onMoveStart,
  onResizeStart,
  onUpdateContent,
  onInlineEditingChange,
  onCanvasPageLink,
  interaction,
}: CanvasNodeProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [inlineTextVisualStyle, setInlineTextVisualStyle] = useState<InlineTextVisualStyle | null>(null);
  const [mapQuickAddressDraft, setMapQuickAddressDraft] = useState('');
  const [codeAssistantOpen, setCodeAssistantOpen] = useState(false);
  const component = getComponent(node.kind);
  const theme = useBuilderTheme();
  const datasetPreviewTargets = useBuilderDatasetPreviewTargets();
  const columnPosts = useBuilderColumnPosts();
  const faqCategories = useBuilderFaqCategories();
  const faqItems = useBuilderFaqItems();
  const nodeRef = useRef<HTMLDivElement>(null);
  const inlineEditOriginalContentRef = useRef<{
    nodeId: string;
    richText?: BuilderRichText;
    text: string;
  } | null>(null);
  const typographySessionRef = useRef<ReturnType<typeof createInlineTextTypographySession> | null>(null);
  if (!typographySessionRef.current) {
    typographySessionRef.current = createInlineTextTypographySession();
  }
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
  const selected = useBuilderCanvasStore((s) => s.selectedNodeIdSet.has(node.id));
  const isOnlySelectedNode = useBuilderCanvasStore((s) => s.selectedNodeId === node.id && s.selectedNodeIds.length === 1);
  const nodesById = useBuilderCanvasStore((s) => s.nodesById);
  const effectiveRect = resolveViewportRect(node, viewport);
  const renderRect = resolveHomeHeroSearchEditorRect(node, effectiveRect, nodesById, viewport);
  const isHiddenAtViewport = viewport !== 'desktop' && resolveViewportHidden(node, viewport);
  const effectiveFontSize = resolveViewportFontSize(node, viewport);
  const currentMapAddress = node.kind === 'map' ? readMapAddress(node) : '';
  const currentMapZoom = node.kind === 'map' ? readMapZoom(node) : 15;
  const captureInlineTextStyleForEditing = useCallback(() => {
    // Entering inline edit can fire onBeforeStartEditing more than once (the
    // double-click handler and the `builder:start-text-edit` event listener both
    // call it). The first call — while the display element is still mounted —
    // captures the real rendered typography (e.g. a `.hero-title` class at
    // ~73.6px). Once the inline editor has mounted, a second capture would read
    // the editor's own base font (16px) and clobber that value, visibly
    // shrinking class-styled titles while editing. Freeze the first valid
    // snapshot for the entire editing session so re-capture can never overwrite
    // the real display metrics.
    typographySessionRef.current?.capture(() => {
      if (nodeRef.current?.querySelector('[data-builder-inline-text-editor="true"]')) return false;
      if (node.kind === 'text' || node.kind === 'heading') {
        const content = node.content as Record<string, unknown>;
        inlineEditOriginalContentRef.current = {
          nodeId: node.id,
          text: typeof content.text === 'string' ? content.text : '',
          ...(isBuilderRichText(content.richText) ? { richText: content.richText } : {}),
        };
      }
      setInlineTextVisualStyle(captureInlineTextVisualStyle(nodeRef.current));
      return true;
    });
  }, [node.content, node.id, node.kind]);

  useEffect(() => {
    setInlineTextVisualStyle(null);
    typographySessionRef.current?.reset();
    clearInlineTextCaretCoords(node.id);
    return () => clearInlineTextCaretCoords(node.id);
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
  const startInlineEditFromNode = useCallback((
    clickTarget: EventTarget | null,
    coords: InlineTextCaretCoords,
  ) => {
    const target = resolveInlineTextEditTarget(clickTarget, nodesById);
    if (!target) return false;

    rememberInlineTextCaretCoords(target.nodeId, coords);
    if (target.nodeId === node.id && isTextKind) {
      handleDoubleClick();
      return true;
    }

    onSelect(target.nodeId, false);
    document.dispatchEvent(new CustomEvent('builder:start-text-edit', {
      detail: {
        nodeId: target.nodeId,
        clientX: coords.x,
        clientY: coords.y,
      },
    }));
    return true;
  }, [handleDoubleClick, isTextKind, node.id, nodesById, onSelect]);
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
  const restoreInlineEditOriginalContent = useCallback(() => {
    const original = inlineEditOriginalContentRef.current;
    if (!original || original.nodeId !== node.id) return;
    onUpdateContent?.(node.id, {
      text: original.text,
      ...(original.richText ? { richText: original.richText } : {}),
    });
  }, [node.id, onUpdateContent]);
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
  const showCodeBlockQuickEdit = selected && isInteractive && node.kind === 'codeBlock' && !node.locked;
  const blogFeedLayout = blogFeedLayoutValue(node);
  const sectionTemplate = getHomeSectionTemplateTarget(node);
  const currentSectionTemplateVariant = getHomeSectionTemplateVariant(node);
  const sectionTemplateVariants = sectionTemplate
    ? getHomeSectionTemplateVariantOptions(sectionTemplate.id)
    : HOME_SECTION_TEMPLATE_VARIANTS;
  const showSectionTemplateActions = selected && isInteractive && Boolean(sectionTemplate);
  const codeBlockNode = node.kind === 'codeBlock' ? node : null;
  const selectionZIndexBoost = selected ? SELECTED_CANVAS_NODE_Z_INDEX_BOOST : 0;
  const setInteractivePreviewIndex = useBuilderCanvasStore((s) => s.setInteractivePreviewIndex);
  const builderLocale = locale;
  const repeaterCopy = getRepeaterTemplateCopy(builderLocale);
  const isHeroSearchNode = isHeroSearchTarget(node.id);
  const showHeroSearchQuickEdit = selected && isInteractive && !node.locked && isHeroSearchNode;
  const heroSearchInputNode = showHeroSearchQuickEdit ? nodesById.get('home-hero-search-input') : undefined;
  const heroSearchBarNode = showHeroSearchQuickEdit ? nodesById.get('home-hero-search-bar') : undefined;
  const heroSearchButtonNode = showHeroSearchQuickEdit ? nodesById.get('home-hero-search-button') : undefined;
  const heroSearchWrapNode = showHeroSearchQuickEdit ? nodesById.get('home-hero-search-wrap') : undefined;
  const heroSearchPlaceholder = showHeroSearchQuickEdit
    ? textInputValue(heroSearchInputNode, 'placeholder') || textInputValue(heroSearchInputNode, 'text')
    : '';
  const heroSearchAction = showHeroSearchQuickEdit
    ? normalizeHeroSearchAction(
      containerActionValue(heroSearchBarNode),
      builderLocale,
    )
    : '';
  const heroSearchDestinationOptions = showHeroSearchQuickEdit
    ? heroSearchDestinations(builderLocale)
    : EMPTY_HERO_SEARCH_DESTINATIONS;
  const isSingleSelectedNode = selected && isOnlySelectedNode;
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
  const parentUsesFlowLayout = flowLayoutChildNodeIds.has(node.id);
  // Flow section metrics (top-level composites only) are computed once by the stage so that
  // Editor canvas renders top-level sections with the exact same marginTop / flow layout
  // as Published (public-page.tsx). This is the core of P0-02.1.
  const isFlowSection = isTopLevelFlowSection(node);
  const flowSectionMetric = isFlowSection ? flowSectionMetrics.get(node.id) : undefined;

  // P0-03 (Responsive-in-Flow): For nodes that are direct children of a flex/grid
  // container, compute sibling-based marginTop using viewport-effective y values.
  // This only runs for responsive viewports (tablet/mobile) so that desktop keeps
  // the natural flex/grid layout/gap behavior; responsive overrides for y are
  // previewed via explicit margin-top (matching the generalized published logic).
  const innerFlowMarginTop = !isFlowSection && parentUsesFlowLayout && viewport !== 'desktop' && node.parentId
    ? innerFlowSiblingMetrics.get(node.id)?.marginTop
    : undefined;
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
    ((interaction?.type === 'move' && interaction.nodeIdSet.has(node.id)) ||
     (interaction?.type === 'resize' && interaction.nodeId === node.id && viewport !== 'desktop')) &&
    (isFlowSection || parentUsesFlowLayout);

  // P0-03 A-1 + A-3 polish: Live visual insertion indicator (drop preview gap) for inner flow
  // children being dragged inside a flex/grid container in responsive viewport.
  // CanvasStageNodes computes the active inner-flow insertion slot once, then
  // each container only checks whether the gap belongs to its own child list.
  // The polished indicator (thinner dashed bar with depth) is inserted into the children
  // render list at the live insertion slot for clear "where it will land" feedback.
  // Uses shared PREVIEW_GAP_STYLE (improved for A-3: tighter height, stronger line, flex-safe).
  const activeInnerFlowPreviewGapInfo = innerFlowPreviewGapInfo?.parentId === node.id
    ? innerFlowPreviewGapInfo
    : null;

  // Local useSticky mirrors the guard in buildCanvasNodeRenderStyles (and published)
  // so that data-builder-sticky only appears when sticky rendering is actually active.
  // Top-level flow sections never use sticky (they use flow wrapper instead).
  const useSticky = Boolean(node.sticky) && !parentUsesFlowLayout && !isFlowSection;
  const nestedChildren = visibleChildrenByParentId.get(node.id) ?? EMPTY_CANVAS_NODE_CHILDREN;
  const hideRedundantLegacyInsightsComposite = node.id === 'home-insights'
    && node.kind === 'composite'
    && nodesById.has('home-insights-list-wrap')
    && nodesById.has('home-insights-item-0-title');
  // Standalone publish-parity overlays (desktop/mobile-parity-standalone-*)
  // exist ONLY for the published render: they replicate the whole legacy page
  // pixel-true above the decomposed nodes. In the editor they would cover the
  // canvas and capture every click (measured on zh about: 1190×4597 overlay,
  // pointer-events auto), so the canvas never renders them — the decomposed
  // nodes below are the editing surface.
  const hideStandalonePublishParityOverlay = node.kind === 'composite'
    && isStandalonePublishParityAnchor(node.anchorName);
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
  const faqItemAncestorId = findSelfOrAncestor(/^home-faq-item-\d+$/);
  const faqItemMatch = /^home-faq-item-(\d+)/.exec(faqItemAncestorId ?? node.id);
  const serviceCardIndex = serviceCardMatch?.[1] != null ? Number(serviceCardMatch[1]) : null;
  const faqItemIndex = faqItemMatch?.[1] != null ? Number(faqItemMatch[1]) : null;
  const isServicePreviewNode = serviceCardIndex != null || node.id === 'home-services-root';
  const isFaqPreviewNode = faqItemIndex != null || node.id === 'home-faq-root';
  const needsTopLevelPreviewOffset = !node.parentId && !isFlowSection;
  const needsServicesPreviewState = isServicePreviewNode || needsTopLevelPreviewOffset;
  const needsFaqPreviewState = isFaqPreviewNode || needsTopLevelPreviewOffset;
  const servicesPreviewOpenIndex = useBuilderCanvasStore((s) => (
    needsServicesPreviewState ? s.interactivePreview.servicesOpenIndex : -1
  ));
  const faqPreviewOpenIndex = useBuilderCanvasStore((s) => (
    needsFaqPreviewState ? s.interactivePreview.faqOpenIndex : -1
  ));
  const servicesRevealedPreviewIndices = useBuilderCanvasStore((s) => (
    needsServicesPreviewState ? s.interactivePreview.servicesRevealedIndices : EMPTY_PREVIEW_INDICES
  ));
  const faqRevealedPreviewIndices = useBuilderCanvasStore((s) => (
    needsFaqPreviewState ? s.interactivePreview.faqRevealedIndices : EMPTY_PREVIEW_INDICES
  ));
  const selectedServiceIndex = useBuilderCanvasStore((s) => {
    if (!isServicePreviewNode) return -1;
    for (const selectedId of s.selectedNodeIdSet) {
      const serviceCardId = findNodeOrAncestorId(s.nodesById, selectedId, /^home-services-card-\d+$/);
      const index = /^home-services-card-(\d+)$/.exec(serviceCardId ?? '')?.[1];
      if (index != null) return Number(index);
    }
    return s.interactivePreview.servicesOpenIndex;
  });
  const selectedFaqIndex = useBuilderCanvasStore((s) => {
    if (!isFaqPreviewNode) return -1;
    for (const selectedId of s.selectedNodeIdSet) {
      const faqItemId = findNodeOrAncestorId(s.nodesById, selectedId, /^home-faq-item-\d+$/);
      const index = /^home-faq-item-(\d+)$/.exec(faqItemId ?? '')?.[1];
      if (index != null) return Number(index);
    }
    return s.interactivePreview.faqOpenIndex;
  });
  const servicesRevealedIndices = resolvePreviewIndexSet(
    needsServicesPreviewState,
    servicesRevealedPreviewIndices,
    servicesPreviewOpenIndex,
  );
  const faqRevealedIndices = resolvePreviewIndexSet(
    needsFaqPreviewState,
    faqRevealedPreviewIndices,
    faqPreviewOpenIndex,
  );
  const servicesRootNode = needsServicesPreviewState ? nodesById.get('home-services-root') : undefined;
  const faqRootNode = needsFaqPreviewState ? nodesById.get('home-faq-root') : undefined;
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
    revealedIndices: ReadonlySet<number>,
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
  const officeLayoutIndex = /^home-offices-layout-(\d+)$/.exec(node.id)?.[1];
  const officeTabIndex = /^home-offices-tab-(\d+)$/.exec(node.id)?.[1];
  const officeActiveIndex = officeLayoutIndex ?? officeTabIndex;
  const activeOfficeIndex = useBuilderCanvasStore((s) => {
    if (officeActiveIndex == null) return 0;
    const primaryIndex = officeIndexFromNodeId(s.selectedNodeId ?? '');
    if (primaryIndex != null) return primaryIndex;
    for (const selectedId of s.selectedNodeIdSet) {
      const nextIndex = officeIndexFromNodeId(selectedId);
      if (nextIndex != null) return nextIndex;
    }
    return 0;
  });
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
  const heroSearchActive = useBuilderCanvasStore((s) => {
    if (node.id !== 'home-hero-quick-menu') return false;
    for (const selectedId of s.selectedNodeIdSet) {
      if (isHeroSearchTarget(selectedId)) return true;
    }
    return false;
  });
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
    if (!showHeroSearchQuickEdit) return 'left';
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
        if (preset.phone) {
          updateNodeContentInStore(officePhoneNode.id, {
            label: `${officePhonePrefix}: ${preset.phone}`,
            href: telHrefFromPhone(preset.phone),
          });
        } else {
          // Clear stale Taichung (or other) numbers when applying a phone-less preset (e.g. Taipei).
          updateNodeContentInStore(officePhoneNode.id, {
            label: '',
            href: '',
          });
        }
      }
      if (officeFaxNode) {
        if (preset.fax) {
          updateNodeContentInStore(officeFaxNode.id, { text: `${officeFaxPrefix}: ${preset.fax}` });
        } else {
          updateNodeContentInStore(officeFaxNode.id, { text: '' });
        }
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
      const buttonWidth = 60;
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
      return (
        <CanvasNode
          key={child.id}
          node={child}
          onSelect={onSelect}
          onContextMenu={onContextMenu}
          onOpenAssetLibrary={onOpenAssetLibrary}
          onMoveStart={onMoveStart}
          onResizeStart={onResizeStart}
          onUpdateContent={onUpdateContent}
          onInlineEditingChange={onInlineEditingChange}
          onCanvasPageLink={onCanvasPageLink}
          interaction={interaction}
          flowSectionMetrics={flowSectionMetrics}
          flowLayoutChildNodeIds={flowLayoutChildNodeIds}
          innerFlowSiblingMetrics={innerFlowSiblingMetrics}
          visibleChildrenByParentId={visibleChildrenByParentId}
          innerFlowPreviewGapInfo={innerFlowPreviewGapInfo}
          viewport={viewport}
          locale={builderLocale}
        />
      );
    };

    if (!activeInnerFlowPreviewGapInfo) {
      return nestedChildren.map(renderChild);
    }

    // Live insertion indicator for flow siblings inside this container (flex/grid).
    // Render siblings in current flow-sorted order (by live rect.y) and insert
    // the polished explicit preview gap (A-3 refined shared style) at the target slot.
    // This gives clear visual drop target feedback while reflow preview runs.
    const flowSiblings = visibleChildrenByParentId.get(node.id) ?? EMPTY_CANVAS_NODE_CHILDREN;
    const sortedSiblings = [...flowSiblings].sort((left, right) =>
      left.rect.y - right.rect.y ||
      left.zIndex - right.zIndex ||
      left.id.localeCompare(right.id)
    );

    const insertionIndex = activeInnerFlowPreviewGapInfo.insertionIndex;
    const elements: ReactNode[] = [];

    sortedSiblings.forEach((sibling, idx) => {
      const showGapBefore = insertionIndex === idx;
      if (showGapBefore) {
        elements.push(
          <div
            key={`preview-gap-inner-${idx}-${activeInnerFlowPreviewGapInfo.draggedId}`}
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
          key={`preview-gap-inner-end-${activeInnerFlowPreviewGapInfo.draggedId}`}
          style={PREVIEW_GAP_STYLE}
          aria-hidden
          data-preview-gap="flow-sibling"
        />
      );
    }

    return elements;
  };

  const parentRepeaterNode = findRepeaterTemplateParentNode(node, nodesById, visibleChildrenByParentId);
  const parentRepeaterBinding = parentRepeaterNode?.dataBinding;
  const parentRepeaterPreviewTarget = parentRepeaterBinding
    ? datasetPreviewTargets.find((target) => target.targetId === parentRepeaterBinding.targetId)
    : undefined;
  const parentRepeaterRecordCount = parentRepeaterPreviewTarget?.records.length ?? 0;
  const parentRepeaterRecordIndex = parentRepeaterBinding && parentRepeaterRecordCount > 0
    ? Math.max(0, Math.min(parentRepeaterRecordCount - 1, Math.trunc(parentRepeaterBinding.recordIndex ?? 0)))
    : 0;
  const parentRepeaterPreviewRecord = parentRepeaterBinding
    ? resolveBuilderDatasetPreviewRecord(datasetPreviewTargets, parentRepeaterBinding)
    : null;
  const parentRepeaterNodeId = parentRepeaterNode?.id;
  const parentRepeaterChildren = parentRepeaterNodeId
    ? visibleChildrenByParentId.get(parentRepeaterNodeId) ?? EMPTY_CANVAS_NODE_CHILDREN
    : EMPTY_CANVAS_NODE_CHILDREN;
  const parentRepeaterBindingNodes = parentRepeaterNodeId
    ? collectRepeaterTemplateBindingNodes(parentRepeaterChildren, visibleChildrenByParentId)
    : EMPTY_CANVAS_NODE_CHILDREN;
  const parentRepeaterSiblingBindings = parentRepeaterBinding
    ? resolveRepeaterTemplateBindingSummaryWithLocks(parentRepeaterBindingNodes, parentRepeaterBinding.targetId, {
        emptyValue: repeaterCopy.childBadge.previewEmptyValue,
        previewRecord: parentRepeaterPreviewRecord,
      })
    : [];
  const activeRepeaterTemplateChildNodeIds = parentRepeaterBinding
    ? resolveRepeaterTemplateActiveNodeIds(node, parentRepeaterBinding.targetId, visibleChildrenByParentId)
    : EMPTY_CANVAS_NODE_IDS;
  const showRepeaterTemplateChildBadge = selected
    && isInteractive
    && !isEditing
    && Boolean(parentRepeaterNodeId)
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
  const repeaterTemplateBindingNodes = isRepeaterTemplateContainer
    ? collectRepeaterTemplateBindingNodes(nestedChildren, visibleChildrenByParentId)
    : EMPTY_CANVAS_NODE_CHILDREN;
  const boundRepeaterChildCount = isRepeaterTemplateContainer && node.dataBinding
    ? repeaterTemplateBindingNodes.filter((childNode) => childNode.dataBinding?.targetId === node.dataBinding?.targetId).length
    : 0;
  const repeaterTemplateBindingSummary = isRepeaterTemplateContainer
    ? resolveRepeaterTemplateBindingSummaryWithLocks(repeaterTemplateBindingNodes, node.dataBinding?.targetId)
    : [];
  const repeaterTemplateEditTarget = isRepeaterTemplateContainer
    ? pickRepeaterTemplateEditTarget(repeaterTemplateBindingNodes, node.dataBinding?.targetId)
    : undefined;
  const showRepeaterTemplateHud = selected
    && isInteractive
    && !isEditing
    && isRepeaterTemplateContainer
    && Boolean(node.dataBinding);
  const repeaterHudLoading = showRepeaterTemplateHud && !repeaterPreviewTarget;
  const repeaterHudRecordLabel = repeaterHudLoading
    ? (node.dataBinding?.targetId ?? repeaterCopy.hud.loadingRecords)
    : repeaterPreviewRecord?.primaryLabel
      ?? (repeaterRecordCount > 0 ? repeaterPreviewTarget?.title : repeaterCopy.hud.checkFilters)
      ?? repeaterCopy.hud.checkFilters;
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
      locale: builderLocale,
    });
    addChildNode(node.id, childNode);
  }, [addChildNode, builderLocale, isRepeaterTemplateContainer, nestedChildren, node, nodesById.size]);
  const addRepeaterTemplateImage = useCallback(() => {
    if (!isRepeaterTemplateContainer || !node.dataBinding) return;
    const childNode = createRepeaterTemplateImageNode({
      childNodes: nestedChildren,
      parentNode: node,
      targetId: node.dataBinding.targetId,
      zIndex: nodesById.size + 1,
      locale: builderLocale,
    });
    addChildNode(node.id, childNode);
  }, [addChildNode, builderLocale, isRepeaterTemplateContainer, nestedChildren, node, nodesById.size]);
  const addRepeaterTemplateButton = useCallback(() => {
    if (!isRepeaterTemplateContainer || !node.dataBinding) return;
    const childNode = createRepeaterTemplateButtonNode({
      childNodes: nestedChildren,
      parentNode: node,
      targetId: node.dataBinding.targetId,
      zIndex: nodesById.size + 1,
      locale: builderLocale,
    });
    addChildNode(node.id, childNode);
  }, [addChildNode, builderLocale, isRepeaterTemplateContainer, nestedChildren, node, nodesById.size]);
  const addRepeaterTemplateGallery = useCallback(() => {
    if (!isRepeaterTemplateContainer || !node.dataBinding) return;
    const childNode = createRepeaterTemplateGalleryNode({
      childNodes: nestedChildren,
      parentNode: node,
      targetId: node.dataBinding.targetId,
      zIndex: nodesById.size + 1,
      locale: builderLocale,
    });
    addChildNode(node.id, childNode);
  }, [addChildNode, builderLocale, isRepeaterTemplateContainer, nestedChildren, node, nodesById.size]);
  const duplicateRepeaterTemplateChild = useCallback(() => {
    if (
      !isRepeaterTemplateContainer
      || !node.dataBinding
      || !repeaterTemplateEditTarget
      || repeaterTemplateEditTarget.locked
    ) {
      return;
    }
    const childNode = createRepeaterTemplateDuplicateNode({
      childNodes: nestedChildren,
      parentNode: node,
      sourceNode: repeaterTemplateEditTarget,
      zIndex: nodesById.size + 1,
    });
    addChildNode(node.id, childNode);
  }, [
    addChildNode,
    isRepeaterTemplateContainer,
    nestedChildren,
    node,
    nodesById.size,
    repeaterTemplateEditTarget,
  ]);
  const renderNode = isEditing
    ? node
    : applyBuilderDatasetPreviewBindingToNode(node, datasetPreviewTargets, {
        recordIndexOverride: parentRepeaterBinding?.recordIndex,
      });

  const body = isEditing && isTextKind ? (
    <InlineTextEditor
      initialText={String(textContent.text || '')}
      initialRichText={initialRichText}
      initialCaretCoords={readInlineTextCaretCoords(node.id)}
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
      locale={builderLocale as Locale}
      onSave={handleInlineSave}
      onCancel={restoreInlineEditOriginalContent}
      onBlur={() => {
        setInlineTextVisualStyle(null);
        inlineEditOriginalContentRef.current = null;
        typographySessionRef.current?.reset();
        clearInlineTextCaretCoords(node.id);
        handleInlineBlur();
      }}
    />
  ) : component ? (
    <CanvasNodeErrorBoundary nodeKind={node.kind} nodeId={node.id}>
      {isContainerLikeKind(renderNode.kind) ? (
        <component.Render
          node={renderNode}
          mode="edit"
          theme={theme}
          locale={builderLocale}
          {...(renderNode.kind === 'composite' ? { columnPosts, faqCategories, faqItems } : {})}
        >
          {renderNestedChildNodes()}
        </component.Render>
      ) : (
        <component.Render
          node={renderNode}
          mode="edit"
          theme={theme}
          locale={builderLocale}
          {...(renderNode.kind === 'composite' ? { columnPosts, faqCategories, faqItems } : {})}
        />
      )}
    </CanvasNodeErrorBoundary>
  ) : null;

  const isContainerLikeNode = isContainerLikeKind(node.kind);
  const isContainerWithChildren = isContainerLikeNode && nestedChildren.length > 0;
  const allowsCanvasPageLinks = node.kind === 'member-account-summary'
    || node.kind === 'member-profile-form'
    || node.kind === 'member-bookings-list';
  const showSelectionHandles = selected && !node.locked && isInteractive && !isEditing;
  const { animationSummary, bodyStyle, nodeStyle } = buildCanvasNodeRenderStyles({
    animationPreviewPhase,
    effectiveFontSize,
    effectiveRect: renderRect,
    isActiveGroupFrame,
    isContainerLikeNode,
    isContainerWithChildren,
    isDimmedRoot,
    isEditing,
    isHovered,
    isAccordionPreviewOpen: builderPreviewOpen,
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

  if (isHiddenAtViewport || hideRedundantLegacyInsightsComposite || hideStandalonePublishParityOverlay) {
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
      onPointerDownCapture={(event) => {
        if (!selected || !isInteractive || node.locked) return;
        if (event.button !== 0 || event.detail >= 2 || event.altKey) return;
        if (event.metaKey || event.ctrlKey || event.shiftKey) return;
        if (event.target === event.currentTarget && event.pointerType !== 'touch') return;
        if (isSelectionChromePointerTarget(event.target)) return;
        // Touch: a selected top-level section spans the whole viewport width,
        // so on phones it doubles as the scroll surface — body presses must
        // scroll, not drag the section (sections still move via inspector or
        // desktop drag).
        if (event.pointerType === 'touch' && isFlowSection) return;
        scheduleTouchContextMenu(event);
        onMoveStart(node.id, event);
        event.stopPropagation();
      }}
      onPointerDown={(event) => {
        event.stopPropagation();
        if (event.detail >= 2 && isInteractive && !node.locked) {
          event.preventDefault();
          return;
        }
        if (event.altKey && node.parentId) {
          let selectedAncestorId: string | null = selected ? node.id : null;

          if (!selectedAncestorId) {
            const storeState = useBuilderCanvasStore.getState();
            selectedAncestorId = findSelectedNodeOrAncestorId(node.parentId, storeState.selectedNodeIdSet, storeState.nodesById);
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
        // Touch: a finger landing on an UNSELECTED node is far more often a
        // scroll gesture than a move intent — starting the one-gesture drag
        // here made phone scrolling fling arbitrary nodes off their sections
        // (measured: 14 nodes displaced up to 581px in one phone session).
        // On touch the first tap only selects; dragging requires the node
        // (not an ancestor) to already be selected, which the capture-phase
        // handler above covers.
        const isTouchPointer = event.pointerType === 'touch';
        syncInteractivePreviewForSelection();
        if (!additive && !isTouchPointer) {
          const storeState = useBuilderCanvasStore.getState();
          let selectedAncestorId = findSelectedNodeOrAncestorId(node.id, storeState.selectedNodeIdSet, storeState.nodesById);
          if (!selectedAncestorId || selectedAncestorId === node.id) {
            selectedAncestorId = findSelectedDomAncestorId(event.target) ?? selectedAncestorId;
          }
          if (selectedAncestorId && selectedAncestorId !== node.id) {
            scheduleTouchContextMenu(event);
            onMoveStart(selectedAncestorId, event);
            return;
          }
        }
        if (additive || node.locked) {
          onSelect(node.id, additive);
          return;
        }
        if (isTouchPointer) {
          scheduleTouchContextMenu(event);
          onSelect(node.id, false);
          return;
        }
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
      onDoubleClickCapture={(event) => {
        if (node.locked || !isInteractive) return;
        if (isSelectionChromePointerTarget(event.target)) return;
        if (!startInlineEditFromNode(event.target, { x: event.clientX, y: event.clientY })) return;
        event.preventDefault();
        event.stopPropagation();
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
        if (event.detail >= 2) {
          event.preventDefault();
          return;
        }
        // Prevent nested anchors / form-submit buttons inside widgets from
        // navigating the editor away when designers click to select them.
        // ⌘/Ctrl-click opens the link in a new tab (standard convention)
        // so designers can still verify navigation targets.
        const target = event.target as HTMLElement | null;
        const anchor = target?.closest<HTMLAnchorElement>('a[href]');
        const submitter = target?.closest('button[type="submit"], input[type="submit"]');
        if (anchor) {
          const href = anchor.getAttribute('href') ?? '';
          const isEditorPageLink = anchor.getAttribute('data-builder-canvas-page-link') === 'true';
          if (event.metaKey || event.ctrlKey) {
            if (href && href !== '#' && !href.startsWith('lightbox:') && !href.startsWith('popup:')) {
              try {
                window.open(href, '_blank', 'noopener,noreferrer');
              } catch {
                /* popup blocked */
              }
            }
          } else if (isEditorPageLink && href.startsWith('/') && onCanvasPageLink) {
            onCanvasPageLink(href);
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
        width={renderRect.width}
        height={renderRect.height}
        animationSummary={animationSummary}
        onSelect={onSelect}
      />
      {showRepeaterTemplateChildBadge && parentRepeaterNodeId ? (
        <SelectedRepeaterTemplateChildControls
          activeSiblingNodeIds={activeRepeaterTemplateChildNodeIds}
          copy={repeaterCopy.childBadge}
          currentNodeId={node.id}
          parentNodeId={parentRepeaterNodeId}
          recordNumber={parentRepeaterRecordIndex + 1}
          siblingBindings={parentRepeaterSiblingBindings}
          locked={node.locked}
          onSelectParent={(nodeId) => onSelect(nodeId, false)}
          onSelectSibling={(nodeId) => onSelect(nodeId, false)}
          selectSiblingAriaLabel={repeaterCopy.hud.selectFieldChildAriaLabel}
        />
      ) : null}
      {showDataBindingWarningBadge ? (
        <div
          className={styles.dataBindingWarningBadge}
          data-builder-data-binding-canvas-warning="true"
          aria-label={repeaterCopy.warning.ariaLabel}
        >
          <span>{repeaterCopy.warning.label}</span>
          <strong>{staleDataBindingFields.map((field) => field.fieldId).join(', ')}</strong>
        </div>
      ) : null}
      {showRepeaterTemplateHud ? (
        <RepeaterTemplateCanvasHud
          copy={repeaterCopy}
          loading={repeaterHudLoading}
          boundChildCount={boundRepeaterChildCount}
          childCount={repeaterChildCount}
          recordCount={repeaterRecordCount}
          recordIndex={repeaterRecordIndex}
          recordLabel={repeaterHudRecordLabel}
          bindingSummary={repeaterTemplateBindingSummary}
          editDisabled={!repeaterTemplateEditTarget}
          duplicateDisabled={!repeaterTemplateEditTarget || repeaterTemplateEditTarget.locked}
          onPrevious={() => updateRepeaterPreviewRecord(repeaterRecordIndex - 1)}
          onNext={() => updateRepeaterPreviewRecord(repeaterRecordIndex + 1)}
          onEdit={() => {
            if (!repeaterTemplateEditTarget) return;
            onSelect(repeaterTemplateEditTarget.id, false);
          }}
          onDuplicate={duplicateRepeaterTemplateChild}
          onAddText={addRepeaterTemplateText}
          onAddImage={addRepeaterTemplateImage}
          onAddButton={addRepeaterTemplateButton}
          onAddGallery={addRepeaterTemplateGallery}
          onSelectBindingChild={(nodeId) => onSelect(nodeId, false)}
        />
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
        showCodeBlockQuickEdit={showCodeBlockQuickEdit}
        codeBlockNode={codeBlockNode}
        onOpenCodeAssistant={() => setCodeAssistantOpen(true)}
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
        style={allowsCanvasPageLinks ? { ...bodyStyle, pointerEvents: 'auto' } : bodyStyle}
      >
        {body}
        {!isContainerLikeNode ? renderNestedChildNodes() : null}
      </div>
      {showCodeBlockQuickEdit && codeBlockNode && codeAssistantOpen ? (
        <CodeAssistantPanel
          locale={builderLocale as Locale}
          code={codeBlockNode.content.code}
          language={codeBlockNode.content.language}
          contextHint={
            builderLocale === 'zh-hant'
              ? '這段程式碼位於畫布的 codeBlock 節點中。'
              : builderLocale === 'ko'
                ? '이 코드는 캔버스 codeBlock 노드 안에 있습니다.'
                : 'This code lives inside a canvas codeBlock node.'
          }
          onApplyFix={(nextCode) => {
            updateNodeContentInStore(node.id, { code: nextCode });
          }}
          onClose={() => setCodeAssistantOpen(false)}
        />
      ) : null}
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
        width={renderRect.width}
        height={renderRect.height}
        rotationReadout={rotationReadout}
        onRotationPointerDown={handleRotationPointerDown}
        onResizeStart={onResizeStart}
      />
    </div>
  );
});

export default CanvasNode;

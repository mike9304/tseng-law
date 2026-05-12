'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import { getComponent } from '@/lib/builder/components/registry';
import { useBuilderCanvasStore } from '@/lib/builder/canvas/store';
import type { BuilderCanvasNode } from '@/lib/builder/canvas/types';
import { isContainerLikeKind } from '@/lib/builder/canvas/types';
import type { BuilderRichText } from '@/lib/builder/rich-text/types';
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
  buildEditorAnimationStyle,
  getAnimationSummary,
  mergeCssTransforms,
  type AnimationPreviewPhase,
} from '@/lib/builder/animations/animation-render';
import {
  buildHoverTransform,
  resolveBackgroundStyle,
  resolveThemeColor,
  resolveThemeTextTypography,
} from '@/lib/builder/site/theme';
import InlineTextEditor from './InlineTextEditor';
import { CanvasNodeBadge } from './CanvasNodeBadge';
import CanvasNodeErrorBoundary from './CanvasNodeErrorBoundary';
import { CanvasNodeQuickPanels } from './CanvasNodeQuickPanels';
import { CanvasNodeSelectionOverlay } from './CanvasNodeSelectionOverlay';
import { InsightsArchiveListPreview } from './CanvasInsightsPreview';
import type { ResizeHandle } from './canvasNodeTypes';
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
}: CanvasNodeProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [mapQuickAddressDraft, setMapQuickAddressDraft] = useState('');
  const [animationPreviewPhase, setAnimationPreviewPhase] = useState<AnimationPreviewPhase>(null);
  const component = getComponent(node.kind);
  const theme = useBuilderTheme();
  const nodeRef = useRef<HTMLDivElement>(null);
  const mapQuickAddressRef = useRef<HTMLTextAreaElement>(null);
  const touchContextMenuRef = useRef<{
    timerId: number;
    pointerId: number;
    clientX: number;
    clientY: number;
  } | null>(null);
  const updateNode = useBuilderCanvasStore((s) => s.updateNode);
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

  const { rotationReadout, handleRotationPointerDown } = useCanvasNodeRotation({
    nodeId: node.id,
    rotation: node.rotation,
    nodeRef,
    updateNode,
    beginMutationSession,
    commitMutationSession,
    cancelMutationSession,
  });

  const handleDoubleClick = useCallback(() => {
    if (node.locked) return;
    if (node.kind === 'composite') {
      enterGroup(node.id);
      setIsEditing(false);
      return;
    }
    if (node.kind === 'text' || node.kind === 'heading') {
      setIsEditing(true);
    }
  }, [enterGroup, node.id, node.kind, node.locked]);

  const clearTouchContextMenu = useCallback(() => {
    const pending = touchContextMenuRef.current;
    if (!pending) return;
    window.clearTimeout(pending.timerId);
    touchContextMenuRef.current = null;
  }, []);

  const cancelTouchContextMenuOnMove = useCallback(
    (event: React.PointerEvent<HTMLDivElement>) => {
      const pending = touchContextMenuRef.current;
      if (!pending || pending.pointerId !== event.pointerId) return;
      const distance = Math.hypot(event.clientX - pending.clientX, event.clientY - pending.clientY);
      if (distance > 8) clearTouchContextMenu();
    },
    [clearTouchContextMenu],
  );

  useEffect(() => () => clearTouchContextMenu(), [clearTouchContextMenu]);

  const handleInlineSave = useCallback(
    (payload: { richText: BuilderRichText; plainText: string }) => {
      onUpdateContent?.(node.id, {
        text: payload.plainText,
        richText: payload.richText,
      });
    },
    [node.id, onUpdateContent],
  );

  const handleInlineBlur = useCallback(() => {
    setIsEditing(false);
  }, []);

  useEffect(() => {
    if (node.kind !== 'text' && node.kind !== 'heading') return;
    const handler = (event: Event) => {
      const detail = (event as CustomEvent<{ nodeId?: string }>).detail;
      if (detail?.nodeId === node.id && !node.locked) {
        setIsEditing(true);
      }
    };
    document.addEventListener('builder:start-text-edit', handler);
    return () => document.removeEventListener('builder:start-text-edit', handler);
  }, [node.id, node.kind, node.locked]);

  useEffect(() => {
    if (node.kind !== 'text' && node.kind !== 'heading') return undefined;
    onInlineEditingChange?.(node.id, isEditing);
    return () => {
      if (isEditing) onInlineEditingChange?.(node.id, false);
    };
  }, [isEditing, node.id, node.kind, onInlineEditingChange]);

  const previewEntrancePreset = node.animation?.entrance?.preset ?? 'none';
  const previewEntranceDuration = node.animation?.entrance?.duration ?? 600;
  const previewEntranceDelay = node.animation?.entrance?.delay ?? 0;

  useEffect(() => {
    let timeoutId: number | undefined;
    let firstFrameId: number | undefined;
    let secondFrameId: number | undefined;

    const handler = (event: Event) => {
      const detail = (event as CustomEvent<{ nodeId?: string }>).detail;
      if (detail?.nodeId !== node.id || node.locked || previewEntrancePreset === 'none') return;

      if (timeoutId) window.clearTimeout(timeoutId);
      if (firstFrameId) window.cancelAnimationFrame(firstFrameId);
      if (secondFrameId) window.cancelAnimationFrame(secondFrameId);

      setAnimationPreviewPhase('initial');
      firstFrameId = window.requestAnimationFrame(() => {
        secondFrameId = window.requestAnimationFrame(() => {
          setAnimationPreviewPhase('visible');
        });
      });
      timeoutId = window.setTimeout(
        () => setAnimationPreviewPhase(null),
        previewEntranceDuration + previewEntranceDelay + 180,
      );
    };

    document.addEventListener('builder:play-animation-preview', handler);
    return () => {
      document.removeEventListener('builder:play-animation-preview', handler);
      if (timeoutId) window.clearTimeout(timeoutId);
      if (firstFrameId) window.cancelAnimationFrame(firstFrameId);
      if (secondFrameId) window.cancelAnimationFrame(secondFrameId);
    };
  }, [
    node.id,
    node.locked,
    previewEntranceDelay,
    previewEntranceDuration,
    previewEntrancePreset,
  ]);

  const isTextKind = node.kind === 'text' || node.kind === 'heading';
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
  const scheduleTouchContextMenu = useCallback(
    (event: React.PointerEvent<HTMLDivElement>) => {
      if (event.pointerType !== 'touch' || node.locked || !isInteractive) return;
      clearTouchContextMenu();
      const target = event.currentTarget;
      const { pointerId, clientX, clientY } = event;
      const timerId = window.setTimeout(() => {
        target.dispatchEvent(new MouseEvent('contextmenu', {
          bubbles: true,
          cancelable: true,
          button: 2,
          clientX,
          clientY,
        }));
        touchContextMenuRef.current = null;
      }, 560);
      touchContextMenuRef.current = { timerId, pointerId, clientX, clientY };
    },
    [clearTouchContextMenu, isInteractive, node.locked],
  );
  const showColumnQuickActions = selected && isInteractive && isColumnManagerTarget(node);
  const showBlogFeedQuickEdit = selected && isInteractive && node.kind === 'blog-feed';
  const blogFeedLayout = blogFeedLayoutValue(node);
  const sectionTemplate = getHomeSectionTemplateTarget(node.id);
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
  const parentNode = node.parentId ? nodesById.get(node.parentId) : undefined;
  const parentLayoutMode = parentNode && isContainerLikeKind(parentNode.kind)
    ? (parentNode.content as { layoutMode?: 'absolute' | 'flex' | 'grid' }).layoutMode ?? 'absolute'
    : undefined;
  const parentUsesFlowLayout = parentLayoutMode === 'flex' || parentLayoutMode === 'grid';
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
    : faqItemMatch
      ? faqItemIndex === selectedFaqIndex
      : false;
  const servicesOpenIndex = Math.max(0, Math.round(selectedServiceIndex));
  const faqOpenIndex = Math.max(0, Math.round(selectedFaqIndex));
  const heroSearchActive = selectedNodeIds.some(isHeroSearchTarget);
  const showHeroSearchQuickEdit = selected && isInteractive && !node.locked && isHeroSearchTarget(node.id);

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

  const renderNestedChildNodes = () =>
    nestedChildren.map((child) => {
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
        />
      );
    });

  const body = isEditing && isTextKind ? (
    <InlineTextEditor
      initialText={String(textContent.text || '')}
      initialRichText={initialRichText}
      fontSize={typography?.fontSize ?? 16}
      color={resolveThemeColor(typography?.color, theme)}
      fontWeight={typography?.fontWeight ?? 'regular'}
      align={typeof textContent.align === 'string' ? textContent.align : 'left'}
      onSave={handleInlineSave}
      onBlur={handleInlineBlur}
    />
  ) : component ? (
    <CanvasNodeErrorBoundary nodeKind={node.kind} nodeId={node.id}>
      {isContainerLikeKind(node.kind) ? (
        <component.Render node={node} mode="edit" theme={theme}>
          {renderNestedChildNodes()}
        </component.Render>
      ) : (
        <component.Render node={node} mode="edit" theme={theme} />
      )}
    </CanvasNodeErrorBoundary>
  ) : null;

  const hasVisibleBorder = node.style.borderWidth > 0;
  const activeHoverStyle = node.hoverStyle && isHovered ? node.hoverStyle : null;
  const animationSummary = getAnimationSummary(node.animation);
  const editorAnimationStyle = buildEditorAnimationStyle({
    animation: node.animation,
    isHovered,
    previewPhase: animationPreviewPhase,
    primaryColor: resolveThemeColor({ token: 'primary' }, theme),
  });
  const backgroundStyle = resolveBackgroundStyle(
    activeHoverStyle?.backgroundColor ?? node.style.backgroundColor,
    theme,
  );
  const renderedBorderColor = activeHoverStyle?.borderColor ?? node.style.borderColor;
  const renderedShadowBlur = activeHoverStyle?.shadowBlur ?? node.style.shadowBlur;
  const renderedShadowSpread = activeHoverStyle?.shadowSpread ?? node.style.shadowSpread;
  const renderedShadowColor = activeHoverStyle?.shadowColor ?? node.style.shadowColor;
  const hasVisibleShadow = renderedShadowBlur > 0
    || renderedShadowSpread !== 0
    || node.style.shadowX !== 0
    || node.style.shadowY !== 0;
  const isContainerWithChildren = isContainerLikeKind(node.kind) && nestedChildren.length > 0;
  const showSelectionHandles = selected && !node.locked && isInteractive && !isEditing;
  const showInsightsListPreview = node.id === 'home-insights-list-wrap' && isInteractive;
  const hoverTransition = node.hoverStyle
    ? `background ${node.hoverStyle.transitionMs ?? 200}ms ease, border-color ${node.hoverStyle.transitionMs ?? 200}ms ease, box-shadow ${node.hoverStyle.transitionMs ?? 200}ms ease, transform ${node.hoverStyle.transitionMs ?? 200}ms ease`
    : undefined;
  const bodyTransform = mergeCssTransforms(
    activeHoverStyle ? buildHoverTransform(activeHoverStyle) : undefined,
    editorAnimationStyle.transform,
  );
  const bodyTransition = [hoverTransition, editorAnimationStyle.transition].filter(Boolean).join(', ') || undefined;
  const renderedOpacity = typeof editorAnimationStyle.opacity === 'number'
    ? (node.style.opacity / 100) * editorAnimationStyle.opacity
    : node.style.opacity / 100;
  const nodePointerEvents = isDimmedRoot || isActiveGroupFrame || (isContainerWithChildren && !isEditing)
    ? 'none'
    : 'auto';

  if (isHiddenAtViewport) {
    return null;
  }

  return (
    <div
      ref={nodeRef}
      className={`${styles.node} ${selected ? styles.nodeSelected : ''} ${node.locked ? styles.nodeLocked : ''}`}
      style={{
        position: parentUsesFlowLayout ? 'relative' : 'absolute',
        left: parentUsesFlowLayout ? undefined : `${effectiveRect.x}px`,
        top: parentUsesFlowLayout ? undefined : `${effectiveRect.y}px`,
        width: `${effectiveRect.width}px`,
        height: `${effectiveRect.height}px`,
        zIndex: parentUsesFlowLayout ? undefined : node.zIndex + 10 + selectionZIndexBoost,
        transform: `rotate(${node.rotation}deg)`,
        transformOrigin: 'center center',
        opacity: isDimmedRoot ? 0.3 : 1,
        pointerEvents: nodePointerEvents,
        display: officeLayoutDisplay,
        outline: isActiveGroupFrame ? '2px dashed rgba(37, 99, 235, 0.72)' : undefined,
        outlineOffset: isActiveGroupFrame ? 4 : undefined,
        fontSize: effectiveFontSize ? `${effectiveFontSize}px` : undefined,
      }}
      data-node-id={node.id}
      data-selected={selected ? 'true' : undefined}
      data-builder-section-template={sectionTemplate?.id}
      data-section-variant={sectionTemplate ? currentSectionTemplateVariant : undefined}
      data-builder-hero-search-active={node.id === 'home-hero-quick-menu' && heroSearchActive ? 'true' : undefined}
      data-office-active={officeActiveIndex != null ? (Number(officeActiveIndex) === activeOfficeIndex ? 'true' : 'false') : undefined}
      data-builder-preview-open={builderPreviewOpen ? 'true' : undefined}
      data-builder-services-open-index={node.id === 'home-services-root' ? String(servicesOpenIndex) : undefined}
      data-builder-faq-open-index={node.id === 'home-faq-root' ? String(faqOpenIndex) : undefined}
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
      onClick={(event) => {
        event.stopPropagation();
        // Prevent nested anchors / form-submit buttons inside widgets from
        // navigating the editor away when designers click to select them.
        const target = event.target as HTMLElement | null;
        const navigates = target?.closest('a[href], button[type="submit"], input[type="submit"]');
        if (navigates) {
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
        className={styles.nodeBody}
        style={{
          position: 'relative',
          ...backgroundStyle,
          borderRadius: `${node.style.borderRadius}px`,
          border: hasVisibleBorder
            ? `${node.style.borderWidth}px ${node.style.borderStyle} ${resolveThemeColor(renderedBorderColor, theme)}`
            : isActiveGroupFrame
              ? '2px dashed rgba(37, 99, 235, 0.72)'
              : isContainerWithChildren && selected
              ? '1px dashed #94a3b8'
              : 'none',
          boxShadow: editorAnimationStyle.boxShadow
            ?? (hasVisibleShadow
              ? `${node.style.shadowX}px ${node.style.shadowY}px ${renderedShadowBlur}px ${renderedShadowSpread}px ${resolveThemeColor(renderedShadowColor, theme)}`
              : isActiveGroupFrame
              ? '0 0 0 1px rgba(147, 197, 253, 0.5)'
              : 'none'),
          opacity: renderedOpacity,
          overflow: isEditing || isContainerLikeKind(node.kind) ? 'visible' : undefined,
          pointerEvents: isEditing ? 'auto' : 'none',
          transform: bodyTransform,
          transformOrigin: bodyTransform || editorAnimationStyle.transformOrigin ? 'center center' : undefined,
          transition: bodyTransition,
          clipPath: editorAnimationStyle.clipPath,
          filter: editorAnimationStyle.filter,
        }}
      >
        {body}
        {!isContainerLikeKind(node.kind) ? renderNestedChildNodes() : null}
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

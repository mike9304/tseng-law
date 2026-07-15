import type { CSSProperties } from 'react';
import {
  buildEditorAnimationStyle,
  getAnimationSummary,
  mergeCssTransforms,
  type AnimationPreviewPhase,
} from '@/lib/builder/animations/animation-render';
import type { BuilderCanvasNode } from '@/lib/builder/canvas/types';
import type { BuilderTheme } from '@/lib/builder/site/types';
import {
  buildHoverTransform,
  resolveBackgroundStyle,
  resolveThemeColor,
} from '@/lib/builder/site/theme';

export const SELECTED_CANVAS_NODE_Z_INDEX_BOOST = 30000;

export function buildCanvasNodeRenderStyles({
  animationPreviewPhase,
  effectiveFontSize,
  effectiveRect,
  isActiveGroupFrame,
  isContainerLikeNode,
  isContainerWithChildren,
  isDimmedRoot,
  isEditing,
  isHovered,
  isAccordionPreviewOpen,
  isTextShapedNode,
  node,
  officeLayoutDisplay,
  parentUsesFlowLayout,
  isTopLevelFlowSection,
  flowSectionMarginTop,
  flowSectionMinHeight,
  forceAbsoluteDuringInteraction,
  previewExpandedHeight,
  previewOffsetY,
  selected,
  selectionZIndexBoost,
  theme,
}: {
  animationPreviewPhase: AnimationPreviewPhase;
  effectiveFontSize: number | undefined;
  effectiveRect: BuilderCanvasNode['rect'];
  isActiveGroupFrame: boolean;
  isContainerLikeNode: boolean;
  isContainerWithChildren: boolean;
  isDimmedRoot: boolean;
  isEditing: boolean;
  isHovered: boolean;
  isAccordionPreviewOpen?: boolean;
  isTextShapedNode: boolean;
  node: BuilderCanvasNode;
  officeLayoutDisplay: string | undefined;
  parentUsesFlowLayout: boolean;
  isTopLevelFlowSection: boolean;
  flowSectionMarginTop?: number;
  flowSectionMinHeight?: number;
  forceAbsoluteDuringInteraction?: boolean;
  previewExpandedHeight?: number;
  previewOffsetY?: number;
  selected: boolean;
  selectionZIndexBoost: number;
  theme: BuilderTheme;
}): {
  animationSummary: ReturnType<typeof getAnimationSummary>;
  bodyStyle: CSSProperties;
  nodeStyle: CSSProperties;
} {
  const hasVisibleBorder = node.style.borderWidth > 0;
  const activeHoverStyle = node.hoverStyle && isHovered && !isEditing ? node.hoverStyle : null;
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
  const hoverTransition = node.hoverStyle && !isEditing
    ? `background ${node.hoverStyle.transitionMs ?? 180}ms cubic-bezier(0.16, 1, 0.3, 1), border-color ${node.hoverStyle.transitionMs ?? 180}ms cubic-bezier(0.16, 1, 0.3, 1), box-shadow ${node.hoverStyle.transitionMs ?? 180}ms cubic-bezier(0.16, 1, 0.3, 1), transform ${node.hoverStyle.transitionMs ?? 180}ms cubic-bezier(0.16, 1, 0.3, 1)`
    : undefined;
  const bodyTransform = mergeCssTransforms(
    activeHoverStyle ? buildHoverTransform(activeHoverStyle) : undefined,
    editorAnimationStyle.transform,
  );
  const bodyTransition = [hoverTransition, editorAnimationStyle.transition].filter(Boolean).join(', ') || undefined;
  const renderedOpacity = typeof editorAnimationStyle.opacity === 'number'
    ? (node.style.opacity / 100) * editorAnimationStyle.opacity
    : node.style.opacity / 100;
  // A fully transparent wrapper would otherwise intercept clicks meant for the
  // visible sibling beneath it (e.g. stacked cross-fade hero slides where only
  // the top slide is opaque). Disable pointer events on unselected zero-opacity
  // nodes so the click falls through; a selected node keeps them so its resize/
  // move chrome stays usable after selecting it via the Layers panel. A locked
  // decorative node (e.g. home-hero-overlay) also disables pointer events: its
  // event handlers already refuse editing, so a capturing wrapper only shields
  // the visible siblings beneath it. Users still find/unlock it via Layers.
  // Existing higher-priority non-interactive states (dimmed root, active group
  // frame) continue to win regardless of selection.
  const isEffectivelyInvisible = renderedOpacity <= 0;
  const nodePointerEvents = isDimmedRoot || isActiveGroupFrame || node.locked
    ? 'none'
    : isEffectivelyInvisible && !selected
      ? 'none'
      : 'auto';
  const isClosedServicesAccordionBody =
    !isAccordionPreviewOpen && /^home-services-card-\d+-body$/.test(node.id);
  const isClosedServicesAccordionDetail =
    !isAccordionPreviewOpen
    && /^home-services-card-\d+-(?:detail-\d+|checklist|columns|more)$/.test(node.id);
  const isClosedFaqAccordionBody =
    !isAccordionPreviewOpen && /^home-faq-item-\d+-answer-wrap$/.test(node.id);
  const isClosedFaqAccordionDetail =
    !isAccordionPreviewOpen && /^home-faq-item-\d+-answer$/.test(node.id);
  const isClosedAccordionBody = isClosedServicesAccordionBody || isClosedFaqAccordionBody;
  const isClosedAccordionDetail = isClosedServicesAccordionDetail || isClosedFaqAccordionDetail;

  const stickyConfig = node.sticky;
  // For P0-02.2.1: when a top-level flow section is actively being dragged, bypass
  // the flow wrapper (relative + marginTop + 100% width) and use its design rect
  // as absolute so the drag can move it freely. Siblings stay in flow. Restored on
  // drag end (commit/cancel) because interaction state clears.
  const useFlowWrapper =
    (isTopLevelFlowSection || parentUsesFlowLayout) && !forceAbsoluteDuringInteraction;
  const isActiveTopLevelFlowSection = isTopLevelFlowSection && !forceAbsoluteDuringInteraction;
  // For inner flow children (parentUsesFlowLayout), we only apply computed marginTop
  // when it was explicitly provided (i.e., responsive viewport case); desktop keeps
  // pure flex/grid natural spacing.
  const isActiveInnerFlowItem =
    parentUsesFlowLayout && !forceAbsoluteDuringInteraction && flowSectionMarginTop !== undefined;
  const useSticky = Boolean(stickyConfig) && !useFlowWrapper;

  return {
    animationSummary,
    nodeStyle: {
      position: useFlowWrapper ? 'relative' : useSticky ? 'sticky' : 'absolute',
      left: useSticky || useFlowWrapper ? undefined : `${effectiveRect.x}px`,
      top: useSticky
        ? (stickyConfig?.from !== 'bottom' ? (stickyConfig?.offset ?? 0) : undefined)
        : useFlowWrapper ? undefined : `${effectiveRect.y}px`,
      bottom: useSticky && stickyConfig?.from === 'bottom' ? (stickyConfig?.offset ?? 0) : undefined,
      width: isActiveTopLevelFlowSection ? '100%' : `${effectiveRect.width}px`,
      height: isClosedAccordionBody
        ? '0px'
        : isActiveTopLevelFlowSection
        ? 'auto'
        : `${previewExpandedHeight ?? effectiveRect.height}px`,
      // For top-level flow sections (composites), use the design rect.height only as minHeight floor
      // so that content can grow (matches published behavior exactly).
      minHeight: isActiveTopLevelFlowSection
        ? Math.max(
          flowSectionMinHeight ?? effectiveRect.height,
          previewExpandedHeight ?? effectiveRect.height,
        )
        : isTextShapedNode
          ? `${effectiveRect.height}px`
          : undefined,
      zIndex: useSticky
        ? Math.max(node.zIndex + 10 + selectionZIndexBoost, 100) // +10 is editor chrome (rulers/grid/selection overlays); sticky min-100 for parity with published
        : useFlowWrapper
          ? (selected ? SELECTED_CANVAS_NODE_Z_INDEX_BOOST + 10 : undefined)
          : node.zIndex + 10 + selectionZIndexBoost,
      // transform (rotation + previewOffsetY) applied directly on the positioned element.
      // CRITICAL parity with public-page.tsx:525 (`baseTransform = rotation ? rotate() : undefined`):
      // we must OMIT the transform entirely when there is no rotation and no preview offset.
      // An unconditional `rotate(0deg)` still establishes a new stacking context (per CSS spec),
      // which traps an overflowing child (e.g. home-hero-search-wrapper, z-index>0) inside its
      // section wrapper — the following section then paints over the child's straddling bottom.
      // Omitting it lets the child escape to the root stacking context and paint above later
      // section backgrounds, exactly matching the published render.
      transform: previewOffsetY
        ? `translateY(${previewOffsetY}px) rotate(${node.rotation}deg)`
        : node.rotation
          ? `rotate(${node.rotation}deg)`
          : undefined,
      transformOrigin: previewOffsetY || node.rotation ? 'center center' : undefined,
      opacity: isDimmedRoot ? 0.3 : 1,
      pointerEvents: nodePointerEvents,
      display: isClosedAccordionDetail ? 'none' : officeLayoutDisplay,
      outline: isActiveGroupFrame ? '2px dashed rgba(37, 99, 235, 0.72)' : undefined,
      outlineOffset: isActiveGroupFrame ? 4 : undefined,
      fontSize: effectiveFontSize ? `${effectiveFontSize}px` : undefined,
      // Top-level flow sections + responsive inner flow children: stack via normal
      // document flow + explicit marginTop (computed from effective y gaps per viewport).
      // Top-level always emits (even 0); inner only when responsive override computed.
      // Matches generalized buildFlowGap... logic and public-page.tsx:448.
      marginTop: isActiveTopLevelFlowSection
        ? (flowSectionMarginTop ?? 0)
        : isActiveInnerFlowItem
          ? flowSectionMarginTop
          : undefined,
      // Published sets overflow:visible for flow composites so inner content (e.g. absolutely
      // positioned children of the section) are not clipped by the flow wrapper.
      overflow: isClosedAccordionBody
        ? 'hidden'
        : isActiveTopLevelFlowSection ? 'visible' : undefined,
    },
    bodyStyle: {
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
      height: isActiveTopLevelFlowSection
        ? '100%'
        : isTextShapedNode ? 'auto' : undefined,
      minHeight: isActiveTopLevelFlowSection
        ? 'inherit'
        : isTextShapedNode ? `${effectiveRect.height}px` : undefined,
      overflow: isEditing || isContainerLikeNode || isActiveTopLevelFlowSection || selected ? 'visible' : undefined,
      pointerEvents: isEditing ? 'auto' : 'none',
      transform: bodyTransform,
      transformOrigin: bodyTransform || editorAnimationStyle.transformOrigin ? 'center center' : undefined,
      transition: bodyTransition,
      clipPath: editorAnimationStyle.clipPath,
      filter: editorAnimationStyle.filter,
    },
  };
}

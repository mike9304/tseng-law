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
  isTextShapedNode,
  node,
  officeLayoutDisplay,
  parentUsesFlowLayout,
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
  isTextShapedNode: boolean;
  node: BuilderCanvasNode;
  officeLayoutDisplay: string | undefined;
  parentUsesFlowLayout: boolean;
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
  const nodePointerEvents = isDimmedRoot || isActiveGroupFrame
    ? 'none'
    : 'auto';

  return {
    animationSummary,
    nodeStyle: {
      position: parentUsesFlowLayout ? 'relative' : 'absolute',
      left: parentUsesFlowLayout ? undefined : `${effectiveRect.x}px`,
      top: parentUsesFlowLayout ? undefined : `${effectiveRect.y}px`,
      width: `${effectiveRect.width}px`,
      height: `${previewExpandedHeight ?? effectiveRect.height}px`,
      zIndex: parentUsesFlowLayout ? undefined : node.zIndex + 10 + selectionZIndexBoost,
      transform: previewOffsetY
        ? `translateY(${previewOffsetY}px) rotate(${node.rotation}deg)`
        : `rotate(${node.rotation}deg)`,
      transformOrigin: 'center center',
      opacity: isDimmedRoot ? 0.3 : 1,
      pointerEvents: nodePointerEvents,
      display: officeLayoutDisplay,
      outline: isActiveGroupFrame ? '2px dashed rgba(37, 99, 235, 0.72)' : undefined,
      outlineOffset: isActiveGroupFrame ? 4 : undefined,
      fontSize: effectiveFontSize ? `${effectiveFontSize}px` : undefined,
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
      height: isTextShapedNode ? 'auto' : undefined,
      minHeight: isTextShapedNode ? `${effectiveRect.height}px` : undefined,
      overflow: isEditing || isContainerLikeNode || selected ? 'visible' : undefined,
      pointerEvents: isEditing ? 'auto' : 'none',
      transform: bodyTransform,
      transformOrigin: bodyTransform || editorAnimationStyle.transformOrigin ? 'center center' : undefined,
      transition: bodyTransition,
      clipPath: editorAnimationStyle.clipPath,
      filter: editorAnimationStyle.filter,
    },
  };
}

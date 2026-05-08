import type { CSSProperties } from 'react';
import type { BuilderCanvasNode } from '@/lib/builder/canvas/types';
import type { BuilderSiteDocument } from '@/lib/builder/site/types';
import {
  buildPublishedAnimationStyle,
  getPublishedAnimationAttributes,
} from '@/lib/builder/animations/animation-render';
import {
  deriveHeuristicAnimation,
  deriveHeuristicHoverStyle,
} from '@/lib/builder/site/heuristic-defaults';
import { getHomeSectionTemplateMetadata } from '@/lib/builder/canvas/section-templates';

/**
 * Shared frame attrs for any published surface (page body, global header/footer,
 * lightbox stage). Ensures AnimationsRoot's IntersectionObserver/scroll listeners
 * pick up nodes uniformly via the `.builder-pub-node[data-anim-entrance]` selector
 * and applies heuristic entrance/hover defaults consistently.
 *
 * Caller is responsible for merging `style` with surface-specific positioning
 * (absolute coords for page/lightbox, relative/static for some global flows).
 */

export interface PublishedSurfaceFrame {
  className: string;
  attrs: Record<string, string | undefined>;
  style: CSSProperties;
  effectiveAnimation: BuilderCanvasNode['animation'];
  hoverStyle: BuilderCanvasNode['hoverStyle'];
}

export function buildPublishedSurfaceFrame(
  node: BuilderCanvasNode,
  options: {
    primaryColor?: string;
  } = {},
): PublishedSurfaceFrame {
  const effectiveAnimation = deriveHeuristicAnimation(node);
  const hoverStyle = deriveHeuristicHoverStyle(node);
  const baseTransform = node.rotation ? `rotate(${node.rotation}deg)` : undefined;

  const animationAttributes = getPublishedAnimationAttributes(effectiveAnimation);
  const animationStyle = buildPublishedAnimationStyle({
    animation: effectiveAnimation,
    baseTransform,
    baseOpacity: node.style?.opacity != null ? node.style.opacity / 100 : 1,
    primaryColor: options.primaryColor ?? 'var(--builder-color-primary, #3b82f6)',
  });

  const attrs: Record<string, string | undefined> = {
    'data-node-id': node.id,
    ...animationAttributes,
  };
  const sectionTemplate = getHomeSectionTemplateMetadata(node);
  if (sectionTemplate) {
    attrs['data-builder-section-template'] = sectionTemplate.id;
    attrs['data-section-variant'] = sectionTemplate.variant;
  }
  if (hoverStyle) {
    attrs['data-builder-hover'] = 'true';
  }
  if (node.anchorName) {
    attrs['data-anchor'] = node.anchorName;
  }

  return {
    className: 'builder-pub-node',
    attrs,
    style: animationStyle,
    effectiveAnimation,
    hoverStyle,
  };
}

/**
 * Convenience: returns the BuilderTheme primary color CSS var fallback chain.
 * Use as the `primaryColor` option for nodes inside surfaces with a known theme.
 */
export function publishedThemePrimaryColor(theme?: BuilderSiteDocument['theme']): string {
  void theme; // theme is consumed via CSS variables; included for future expansion.
  return 'var(--builder-color-primary, #3b82f6)';
}

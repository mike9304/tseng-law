/**
 * Phase 5 — Responsive layout engine.
 *
 * Supports two models (user picks one via site settings):
 *
 * A. Wix-style: separate mobile canvas tree per page (desktop + mobile
 *    are independent documents). Editing mobile doesn't affect desktop.
 *
 * B. Breakpoint-override: single canvas tree, each node has optional
 *    `responsive.tablet` / `responsive.mobile` partial overrides on
 *    its rect (x/y/w/h). The renderer resolves the final rect by
 *    merging base + override for the active viewport.
 *
 * This module provides the resolution logic and auto-fit algorithm
 * for both models. The actual viewport switcher UI is Codex's task.
 */

import type { BuilderCanvasNode, ResponsiveConfig } from '@/lib/builder/canvas/types';

/**
 * Three-tier viewport mode used across editor and published runtime.
 * Aliased as `ViewportMode` for parity with the SandboxTopBar / store.
 */
export type Viewport = 'desktop' | 'tablet' | 'mobile';
export type ViewportMode = Viewport;

// P5-10 (RSP-04): Responsive behavior presets
export type ResponsiveBehavior = 'fixed' | 'stretch' | 'hug' | 'scale' | 'relative';

export interface ResponsiveBehaviorConfig {
  horizontal: ResponsiveBehavior;
  vertical: ResponsiveBehavior;
}

export const DEFAULT_RESPONSIVE_BEHAVIOR: ResponsiveBehaviorConfig = {
  horizontal: 'fixed',
  vertical: 'fixed',
};

export function behaviorToCSS(
  behavior: ResponsiveBehaviorConfig,
  parentWidth: number,
  /* parentHeight - reserved for vertical behavior */
): Record<string, string> {
  const css: Record<string, string> = {};
  switch (behavior.horizontal) {
    case 'stretch': css.width = '100%'; break;
    case 'hug': css.width = 'fit-content'; break;
    case 'scale': css.width = `${(100 * parentWidth) / 1280}%`; break;
    case 'relative': css.width = '50%'; break;
    default: break; // fixed = pixel value from rect
  }
  switch (behavior.vertical) {
    case 'stretch': css.height = '100%'; break;
    case 'hug': css.height = 'fit-content'; break;
    default: break;
  }
  return css;
}

export const VIEWPORT_WIDTHS: Record<Viewport, number> = {
  desktop: 1280,
  tablet: 768,
  mobile: 375,
};

/** Alias kept for spec parity (`VIEWPORT_BREAKPOINTS`). */
export const VIEWPORT_BREAKPOINTS = VIEWPORT_WIDTHS;

interface Rect {
  x: number;
  y: number;
  width: number;
  height: number;
}

/**
 * Resolve the effective rect for a node at the given viewport.
 * Cascades desktop → tablet → mobile so that mobile inherits any
 * tablet overrides the user set, and only mobile-specific keys win.
 */
export function resolveRect(node: BuilderCanvasNode, viewport: Viewport): Rect {
  return resolveViewportRect(node, viewport);
}

/**
 * Spec-aligned alias for `resolveRect`. Cascade rules:
 *   desktop  → node.rect
 *   tablet   → node.rect ∪ responsive.tablet.rect
 *   mobile   → node.rect ∪ responsive.tablet.rect ∪ responsive.mobile.rect
 */
export function resolveViewportRect(node: BuilderCanvasNode, viewport: Viewport): Rect {
  const base = node.rect;
  if (viewport === 'desktop') return base;
  const responsive = node.responsive as ResponsiveConfig | undefined;
  if (!responsive) return base;
  const tabletRect = responsive.tablet?.rect;
  if (viewport === 'tablet') {
    if (!tabletRect) return base;
    return {
      x: tabletRect.x ?? base.x,
      y: tabletRect.y ?? base.y,
      width: tabletRect.width ?? base.width,
      height: tabletRect.height ?? base.height,
    };
  }
  const mobileRect = responsive.mobile?.rect;
  return {
    x: mobileRect?.x ?? tabletRect?.x ?? base.x,
    y: mobileRect?.y ?? tabletRect?.y ?? base.y,
    width: mobileRect?.width ?? tabletRect?.width ?? base.width,
    height: mobileRect?.height ?? tabletRect?.height ?? base.height,
  };
}

/**
 * Resolve effective hidden state for the viewport.
 * Returns `true` when the node should NOT render at that viewport.
 */
export function resolveViewportHidden(
  node: BuilderCanvasNode,
  viewport: Viewport,
): boolean {
  const baseHidden = !node.visible;
  const responsive = node.responsive as ResponsiveConfig | undefined;
  if (viewport === 'desktop' || !responsive) return baseHidden;
  const tabletHidden = responsive.tablet?.hidden;
  if (viewport === 'tablet') return tabletHidden ?? baseHidden;
  const mobileHidden = responsive.mobile?.hidden;
  return mobileHidden ?? tabletHidden ?? baseHidden;
}

/**
 * Resolve effective fontSize for text/heading nodes.
 * Reads from `responsive.<vp>.fontSize` cascade, falling back to
 * `node.content.fontSize` (which exists on text + heading kinds).
 */
export function resolveViewportFontSize(
  node: BuilderCanvasNode,
  viewport: Viewport,
): number | undefined {
  const content = node.content as Record<string, unknown>;
  const baseFontSize = typeof content.fontSize === 'number' ? content.fontSize : undefined;
  const responsive = node.responsive as ResponsiveConfig | undefined;
  if (viewport === 'desktop' || !responsive) return baseFontSize;
  const tabletFontSize = responsive.tablet?.fontSize;
  if (viewport === 'tablet') return tabletFontSize ?? baseFontSize;
  const mobileFontSize = responsive.mobile?.fontSize;
  return mobileFontSize ?? tabletFontSize ?? baseFontSize;
}

/**
 * Detect viewport bucket from a window/container width.
 * Edges follow Wix Studio defaults (375 mobile, 768 tablet, 1280+ desktop).
 */
export function detectViewportFromWidth(width: number): Viewport {
  if (width <= VIEWPORT_BREAKPOINTS.mobile + 50) return 'mobile';
  if (width <= VIEWPORT_BREAKPOINTS.tablet + 100) return 'tablet';
  return 'desktop';
}

/**
 * Whether this node has any per-viewport override set (used for the
 * little dot indicator next to Inspector layout fields).
 */
export function hasResponsiveOverride(
  node: BuilderCanvasNode,
  viewport: Viewport,
): boolean {
  if (viewport === 'desktop') return false;
  const responsive = node.responsive as ResponsiveConfig | undefined;
  if (!responsive) return false;
  const override = responsive[viewport];
  if (!override) return false;
  return Boolean(override.rect || override.hidden !== undefined || override.fontSize !== undefined);
}

/**
 * Auto-fit desktop layout to mobile.
 *
 * Strategy: stack all elements vertically in their original z-order,
 * scale width to fit mobile viewport (375px minus 2x16px padding),
 * preserve aspect ratio for images.
 *
 * Returns a new set of responsive.mobile overrides (not a new node
 * array) so the desktop layout stays untouched.
 */
export function autoFitMobile(
  nodes: BuilderCanvasNode[],
  mobileWidth: number = VIEWPORT_WIDTHS.mobile,
): Array<{ nodeId: string; mobileRect: Rect }> {
  const padding = 16;
  const contentWidth = mobileWidth - padding * 2;
  let currentY = padding;
  const gap = 12;

  const sorted = [...nodes]
    .filter((n) => n.visible !== false)
    .sort((a, b) => a.zIndex - b.zIndex);

  return sorted.map((node) => {
    const scale = Math.min(1, contentWidth / node.rect.width);
    const newWidth = Math.round(node.rect.width * scale);
    const newHeight = Math.round(node.rect.height * scale);
    const x = Math.round((mobileWidth - newWidth) / 2);
    const y = currentY;
    currentY += newHeight + gap;

    return {
      nodeId: node.id,
      mobileRect: { x, y, width: newWidth, height: newHeight },
    };
  });
}

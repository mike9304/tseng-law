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

import type { BuilderCanvasNode } from '@/lib/builder/canvas/types';

export type Viewport = 'desktop' | 'tablet' | 'mobile';

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

interface Rect {
  x: number;
  y: number;
  width: number;
  height: number;
}

/**
 * Resolve the effective rect for a node at the given viewport.
 * Falls through to desktop rect if no override exists.
 */
export function resolveRect(node: BuilderCanvasNode, viewport: Viewport): Rect {
  const base = node.rect;
  if (viewport === 'desktop') return base;

  // Type narrowing: node may have responsive overrides via content or
  // a dedicated `responsive` field. Since the Phase 1 schema uses
  // `rect` directly without responsive overrides, this is forward-
  // compatible — returns the base rect until responsive data exists.
  const overrides = (node as Record<string, unknown>).responsive as
    | Record<string, Partial<Rect> | undefined>
    | undefined;
  if (!overrides) return base;

  const vp = overrides[viewport];
  if (!vp) return base;

  return {
    x: vp.x ?? base.x,
    y: vp.y ?? base.y,
    width: vp.width ?? base.width,
    height: vp.height ?? base.height,
  };
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

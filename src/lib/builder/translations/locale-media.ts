/**
 * F118 — Per-language media projection.
 *
 * Image canvas nodes may carry `srcByLocale` and `altByLocale` overrides
 * keyed by locale. The render path resolves these to an effective
 * `{ src, alt }` pair via `resolveLocaleImageContent`.
 *
 * Mirrors `seo-projection.ts`:
 *   - Overrides are additive and optional.
 *   - Empty / missing overrides fall back to the source content.
 *   - The data lives on the source-locale node so the projection works
 *     even when no target-locale page exists.
 */

import type { Locale } from '@/lib/locales';
import type {
  BuilderCanvasDocument,
  BuilderCanvasNode,
  BuilderImageCanvasNode,
} from '@/lib/builder/canvas/types';

export interface LocaleImageOverride {
  src?: string;
  alt?: string;
}

interface LocalizedImageBag {
  srcByLocale?: Partial<Record<Locale, string>>;
  altByLocale?: Partial<Record<Locale, string>>;
}

function readImageLocalizedBag(
  node: BuilderImageCanvasNode,
): LocalizedImageBag {
  return node.content as unknown as LocalizedImageBag;
}

function isImageNode(node: BuilderCanvasNode): node is BuilderImageCanvasNode {
  return node.kind === 'image';
}

export interface ResolvedImageLocaleContent {
  src: string;
  alt: string;
}

/**
 * Resolve the effective `{ src, alt }` for an image node at a target locale.
 *
 * - Returns the override pair from `srcByLocale[locale]` / `altByLocale[locale]`
 *   when defined and non-empty.
 * - Falls back per-field to the source-locale `content.src` / `content.alt`.
 * - For non-image nodes the function still returns a sensible value derived
 *   from the source content so callers can safely funnel any node through it.
 */
export function resolveLocaleImageContent(
  node: BuilderCanvasNode,
  locale: Locale,
): ResolvedImageLocaleContent {
  if (!isImageNode(node)) {
    const src = (node.content as { src?: string }).src ?? '';
    const alt = (node.content as { alt?: string }).alt ?? '';
    return { src, alt };
  }

  const bag = readImageLocalizedBag(node);
  const srcOverride = bag.srcByLocale?.[locale];
  const altOverride = bag.altByLocale?.[locale];

  return {
    src: typeof srcOverride === 'string' && srcOverride.length > 0
      ? srcOverride
      : node.content.src,
    alt: typeof altOverride === 'string' && altOverride.length > 0
      ? altOverride
      : node.content.alt,
  };
}

/**
 * Render-time helper: returns a shallow clone of `node` with its image
 * content rewritten for the target locale. Non-image nodes pass through.
 *
 * Used by `public-page.tsx` / `CanvasNode.tsx` so component renderers
 * stay locale-agnostic — they always read `content.src` / `content.alt`.
 */
export function projectImageNodeForLocale(
  node: BuilderCanvasNode,
  locale: Locale,
): BuilderCanvasNode {
  if (!isImageNode(node)) return node;
  const resolved = resolveLocaleImageContent(node, locale);
  if (resolved.src === node.content.src && resolved.alt === node.content.alt) {
    return node;
  }
  return {
    ...node,
    content: {
      ...node.content,
      src: resolved.src,
      alt: resolved.alt,
    },
  };
}

/**
 * Update an image node's per-locale override in place on the canvas.
 * Returns a new canvas — does NOT mutate the original. Other nodes are
 * referentially preserved so React diffs stay cheap.
 *
 * Empty-string fields in `override` clear the override (so editors can
 * "revert to source" by saving an empty value).
 */
export function applyImageLocaleOverride(
  canvas: BuilderCanvasDocument,
  nodeId: string,
  locale: Locale,
  override: LocaleImageOverride,
): BuilderCanvasDocument {
  let mutated = false;
  const nextNodes = canvas.nodes.map((node) => {
    if (node.id !== nodeId || !isImageNode(node)) return node;
    const bag = readImageLocalizedBag(node);
    const nextSrcBag = { ...(bag.srcByLocale ?? {}) };
    const nextAltBag = { ...(bag.altByLocale ?? {}) };

    if (override.src !== undefined) {
      if (override.src === '') delete nextSrcBag[locale];
      else nextSrcBag[locale] = override.src;
    }
    if (override.alt !== undefined) {
      if (override.alt === '') delete nextAltBag[locale];
      else nextAltBag[locale] = override.alt;
    }

    const nextContent: BuilderImageCanvasNode['content'] = {
      ...node.content,
    };
    if (Object.keys(nextSrcBag).length > 0) {
      (nextContent as LocalizedImageBag).srcByLocale = nextSrcBag;
    } else {
      delete (nextContent as LocalizedImageBag).srcByLocale;
    }
    if (Object.keys(nextAltBag).length > 0) {
      (nextContent as LocalizedImageBag).altByLocale = nextAltBag;
    } else {
      delete (nextContent as LocalizedImageBag).altByLocale;
    }
    mutated = true;
    return { ...node, content: nextContent };
  });

  if (!mutated) return canvas;
  return {
    ...canvas,
    nodes: nextNodes,
    updatedAt: new Date().toISOString(),
  };
}

/**
 * Enumerate the image nodes on a canvas so the Translation Editor can list
 * them for per-locale override editing. Output is read-only.
 */
export function listImageNodesForLocaleEditor(
  canvas: BuilderCanvasDocument,
): ReadonlyArray<{
  nodeId: string;
  src: string;
  alt: string;
  byLocale: { src: Partial<Record<Locale, string>>; alt: Partial<Record<Locale, string>> };
}> {
  const out: Array<{
    nodeId: string;
    src: string;
    alt: string;
    byLocale: { src: Partial<Record<Locale, string>>; alt: Partial<Record<Locale, string>> };
  }> = [];
  for (const node of canvas.nodes) {
    if (!isImageNode(node)) continue;
    const bag = readImageLocalizedBag(node);
    out.push({
      nodeId: node.id,
      src: node.content.src,
      alt: node.content.alt,
      byLocale: {
        src: bag.srcByLocale ?? {},
        alt: bag.altByLocale ?? {},
      },
    });
  }
  return out;
}
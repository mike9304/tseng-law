/**
 * F114 — Persistence helper for manual per-locale page edits.
 *
 * Reads the target locale's page draft canvas, applies plain-text
 * patches at well-known content paths, and writes the updated draft
 * back. Mirrors the path walker in sync.ts so we share semantics.
 *
 * NOTE (first slice): we only patch plain string fields:
 *   - text.content.text
 *   - heading.content.text
 *   - button.content.label
 *   - image.content.alt
 *   - generic content.* string paths via the optional explicit `path`.
 *
 * The `richText` field is intentionally NOT touched — it has a strict
 * `richText.plainText === text` invariant enforced by the canvas
 * schema. Updating both safely is deferred to a follow-up; see TODO.
 */

import type { BuilderCanvasDocument, BuilderCanvasNode } from '@/lib/builder/canvas/types';
import type { Locale } from '@/lib/locales';
import {
  readPageCanvas,
  readSiteDocument,
  writePageCanvas,
  writeSiteDocument,
} from '@/lib/builder/site/persistence';
import type { BuilderPageMeta, BuilderSiteDocument } from '@/lib/builder/site/types';

export interface NodeTextPatch {
  /** New plain text. */
  text: string;
  /**
   * Optional explicit content path (e.g. `content.label`,
   * `content.items.0.title`). Defaults to the kind-derived default
   * (see `defaultPathForKind`).
   */
  path?: string;
}

export type NodeUpdates = Record<string, NodeTextPatch>;

export interface ApplyTranslationResult {
  ok: boolean;
  appliedCount: number;
  skipped: Array<{ nodeId: string; reason: string }>;
  targetPageId?: string;
  targetCanvas?: BuilderCanvasDocument;
}

/**
 * Reusable: resolves the target-locale equivalent for a source page.
 * Mirrors sync.ts `findTargetPage` so we don't depend on internals.
 */
export function findTargetPageMeta(
  site: BuilderSiteDocument,
  sourcePageId: string,
  targetLocale: Locale,
): BuilderPageMeta | null {
  const sourcePage = site.pages.find((page) => page.pageId === sourcePageId);
  if (!sourcePage) return null;
  if (sourcePage.locale === targetLocale) return sourcePage;
  const linkedId = sourcePage.linkedPageIds?.[targetLocale];
  if (linkedId) {
    const linked = site.pages.find((page) => page.pageId === linkedId);
    if (linked) return linked;
  }
  if (sourcePage.isHomePage) {
    const home = site.pages.find(
      (page) => page.locale === targetLocale && page.isHomePage,
    );
    if (home) return home;
  }
  return (
    site.pages.find(
      (page) => page.locale === targetLocale && page.slug === sourcePage.slug,
    ) ?? null
  );
}

function defaultPathForKind(node: BuilderCanvasNode): string | null {
  switch (node.kind) {
    case 'text':
    case 'heading':
      return 'content.text';
    case 'button':
      return 'content.label';
    case 'image':
      return 'content.alt';
    case 'container':
    case 'section':
      return 'content.label';
    default:
      return null;
  }
}

/**
 * Set a string at a dotted content path. Returns true on success.
 * Mirrors sync.ts `setByContentPath` (kept duplicated rather than
 * exported from sync.ts to avoid an internal-API expansion).
 */
export function setNodeContentString(
  node: BuilderCanvasNode,
  path: string,
  text: string,
): boolean {
  if (!path.startsWith('content.')) return false;
  const parts = path.split('.').slice(1);
  let current: unknown = node.content;
  for (const part of parts.slice(0, -1)) {
    if (!current || typeof current !== 'object') return false;
    const key: string | number = /^\d+$/.test(part) ? Number(part) : part;
    current = (current as Record<string | number, unknown>)[key];
  }
  const last = parts.at(-1);
  if (!last || !current || typeof current !== 'object') return false;
  const key: string | number = /^\d+$/.test(last) ? Number(last) : last;
  (current as Record<string | number, unknown>)[key] = text;
  return true;
}

/**
 * Apply translation patches to the target locale's draft canvas.
 * Auto-creates the target page meta entry only when one already
 * exists via the slug+locale fallback — this slice does not create
 * brand-new locale pages.
 */
export async function applyTranslationToLocaleDraft(
  siteId: string,
  sourceLocale: Locale,
  targetLocale: Locale,
  sourcePageId: string,
  nodeUpdates: NodeUpdates,
): Promise<ApplyTranslationResult> {
  if (sourceLocale === targetLocale) {
    return {
      ok: false,
      appliedCount: 0,
      skipped: [{ nodeId: '*', reason: 'sourceLocale_eq_targetLocale' }],
    };
  }

  const site = await readSiteDocument(siteId, sourceLocale);
  const targetPage = findTargetPageMeta(site, sourcePageId, targetLocale);
  if (!targetPage) {
    return {
      ok: false,
      appliedCount: 0,
      skipped: [{ nodeId: '*', reason: 'target_page_not_found' }],
    };
  }

  // Use the source draft as a fallback when no target draft exists yet.
  const targetDraft =
    (await readPageCanvas(siteId, targetPage.pageId, 'draft')) ??
    (await readPageCanvas(siteId, sourcePageId, 'draft'));
  if (!targetDraft) {
    return {
      ok: false,
      appliedCount: 0,
      skipped: [{ nodeId: '*', reason: 'target_canvas_missing' }],
    };
  }

  const skipped: ApplyTranslationResult['skipped'] = [];
  let appliedCount = 0;
  const nextNodes = targetDraft.nodes.map((node) => node);

  for (const [nodeId, patch] of Object.entries(nodeUpdates)) {
    const index = nextNodes.findIndex((node) => node.id === nodeId);
    if (index < 0) {
      skipped.push({ nodeId, reason: 'node_not_found' });
      continue;
    }
    const original = nextNodes[index];
    const path = patch.path ?? defaultPathForKind(original);
    if (!path) {
      skipped.push({ nodeId, reason: 'no_default_path' });
      continue;
    }
    // Deep-clone via JSON to avoid mutating any shared reference.
    const cloned = JSON.parse(JSON.stringify(original)) as BuilderCanvasNode;
    if (!setNodeContentString(cloned, path, patch.text)) {
      skipped.push({ nodeId, reason: 'path_not_settable' });
      continue;
    }
    nextNodes[index] = cloned;
    appliedCount += 1;
  }

  const nowIso = new Date().toISOString();
  const nextCanvas: BuilderCanvasDocument = {
    ...targetDraft,
    locale: targetLocale,
    updatedAt: nowIso,
    updatedBy: 'translation-manager',
    nodes: nextNodes,
  };

  if (appliedCount > 0) {
    await writePageCanvas(siteId, targetPage.pageId, 'draft', nextCanvas);
    // Touch the page meta updatedAt so the dashboard reflects fresh state.
    const pageIndex = site.pages.findIndex(
      (page) => page.pageId === targetPage.pageId,
    );
    if (pageIndex >= 0) {
      site.pages[pageIndex] = {
        ...site.pages[pageIndex],
        updatedAt: nowIso,
      };
      site.updatedAt = nowIso;
      await writeSiteDocument(site, {
        preserveNavigation: true,
      });
    }
  }

  return {
    ok: appliedCount > 0,
    appliedCount,
    skipped,
    targetPageId: targetPage.pageId,
    targetCanvas: nextCanvas,
  };
}

export interface PerLocaleSeoOverride {
  title?: string;
  description?: string;
  ogImage?: string;
}

/**
 * F117 — write a per-locale SEO override onto the *source* page's
 * `seo.localizedOverrides[targetLocale]`. We store overrides on the
 * source page so the projection helper can resolve them without
 * needing the target locale page to exist.
 *
 * Returns true when a write actually happened.
 */
export async function setPageLocaleSeoOverride(
  siteId: string,
  sourceLocale: Locale,
  targetLocale: Locale,
  sourcePageId: string,
  override: PerLocaleSeoOverride,
): Promise<boolean> {
  if (sourceLocale === targetLocale) return false;
  const site = await readSiteDocument(siteId, sourceLocale);
  const index = site.pages.findIndex((page) => page.pageId === sourcePageId);
  if (index < 0) return false;

  const current = site.pages[index];
  const currentSeo = current.seo ?? {};
  const currentOverrides =
    (currentSeo as { localizedOverrides?: Partial<Record<Locale, PerLocaleSeoOverride>> })
      .localizedOverrides ?? {};

  const merged: PerLocaleSeoOverride = {
    ...(currentOverrides[targetLocale] ?? {}),
    ...override,
  };
  // Drop empty strings — treat them as "clear override".
  for (const key of Object.keys(merged) as Array<keyof PerLocaleSeoOverride>) {
    if (merged[key] === '' || merged[key] === undefined) delete merged[key];
  }

  const nextOverrides = { ...currentOverrides, [targetLocale]: merged };
  const nextSeo = {
    ...currentSeo,
    localizedOverrides: nextOverrides,
  };

  const nowIso = new Date().toISOString();
  site.pages[index] = {
    ...current,
    seo: nextSeo,
    updatedAt: nowIso,
  };
  site.updatedAt = nowIso;
  await writeSiteDocument(site, { preserveNavigation: true });
  return true;
}
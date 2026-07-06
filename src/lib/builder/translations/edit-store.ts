import type { BuilderCanvasDocument } from '@/lib/builder/canvas/types';
import type { Locale } from '@/lib/locales';
import {
  readPageCanvas,
  readSiteDocument,
  writePageCanvas,
  writeSiteDocument,
} from '@/lib/builder/site/persistence';
import type { BuilderSeoMetadata } from '@/lib/builder/site/types';
import { applyImageLocaleOverride } from '@/lib/builder/translations/locale-media';
import { findTargetPageMeta } from '@/lib/builder/translations/page-targets';
import {
  applyNodeTextPatch,
  type ApplyTranslationResult,
  type NodeUpdates,
} from '@/lib/builder/translations/text-patches';

export type ImageOverrides = Record<string, { src?: string; alt?: string }>;
export type { ApplyTranslationResult, NodeTextPatch, NodeUpdates } from '@/lib/builder/translations/text-patches';
export { findTargetPageMeta } from '@/lib/builder/translations/page-targets';
export { setNodeContentString } from '@/lib/builder/translations/text-patches';

function assertNever(value: never): never {
  throw new Error(`Unexpected translation patch result: ${JSON.stringify(value)}`);
}

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

  const sourceDraft = await readPageCanvas(siteId, sourcePageId, 'draft');
  const targetDraft =
    (await readPageCanvas(siteId, targetPage.pageId, 'draft')) ??
    sourceDraft;
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
  const sourceNodesById = new Map((sourceDraft?.nodes ?? []).map((node) => [node.id, node]));

  for (const [nodeId, patch] of Object.entries(nodeUpdates)) {
    const index = nextNodes.findIndex((node) => node.id === nodeId);
    if (index < 0) {
      skipped.push({ nodeId, reason: 'node_not_found' });
      continue;
    }
    const original = nextNodes[index];
    const result = applyNodeTextPatch(original, patch, sourceNodesById.get(nodeId));
    switch (result.kind) {
      case 'skipped':
        skipped.push({ nodeId, reason: result.reason });
        continue;
      case 'applied':
        nextNodes[index] = result.node;
        appliedCount += 1;
        continue;
      default:
        assertNever(result);
    }
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

export interface ApplyImageTranslationResult {
  ok: boolean;
  appliedCount: number;
  targetPageId?: string;
  targetCanvas?: BuilderCanvasDocument;
}

export async function applyImageOverridesToLocaleDraft(
  siteId: string,
  sourceLocale: Locale,
  targetLocale: Locale,
  sourcePageId: string,
  imageOverrides: ImageOverrides,
): Promise<ApplyImageTranslationResult> {
  if (sourceLocale === targetLocale) {
    return { ok: false, appliedCount: 0 };
  }

  const site = await readSiteDocument(siteId, sourceLocale);
  const targetPage = findTargetPageMeta(site, sourcePageId, targetLocale);
  if (!targetPage) {
    return { ok: false, appliedCount: 0 };
  }

  const targetDraft =
    (await readPageCanvas(siteId, targetPage.pageId, 'draft')) ??
    (await readPageCanvas(siteId, sourcePageId, 'draft'));
  if (!targetDraft) {
    return { ok: false, appliedCount: 0 };
  }

  let appliedCount = 0;
  let nextCanvas = targetDraft;
  for (const [nodeId, override] of Object.entries(imageOverrides)) {
    const before = nextCanvas;
    nextCanvas = applyImageLocaleOverride(nextCanvas, nodeId, targetLocale, {
      src: override.src ?? '',
      alt: override.alt ?? '',
    });
    if (nextCanvas !== before) {
      appliedCount += 1;
    }
  }

  if (appliedCount > 0) {
    const nowIso = new Date().toISOString();
    nextCanvas = {
      ...nextCanvas,
      locale: targetLocale,
      updatedAt: nowIso,
      updatedBy: 'translation-manager',
    };
    await writePageCanvas(siteId, targetPage.pageId, 'draft', nextCanvas);
    const pageIndex = site.pages.findIndex((page) => page.pageId === targetPage.pageId);
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
    targetPageId: targetPage.pageId,
    targetCanvas: nextCanvas,
  };
}

export interface PerLocaleSeoOverride {
  title?: string;
  description?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  twitterTitle?: string;
  twitterDescription?: string;
  twitterImage?: string;
  focusKeyword?: string;
}

const PER_LOCALE_SEO_OVERRIDE_KEYS = [
  'title',
  'description',
  'ogTitle',
  'ogDescription',
  'ogImage',
  'twitterTitle',
  'twitterDescription',
  'twitterImage',
  'focusKeyword',
] as const satisfies readonly (keyof PerLocaleSeoOverride)[];

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
  const currentSeo: BuilderSeoMetadata = current.seo ?? {};
  const currentOverrides = currentSeo.localizedOverrides ?? {};

  const merged: PerLocaleSeoOverride = {
    ...(currentOverrides[targetLocale] ?? {}),
    ...override,
  };
  for (const key of PER_LOCALE_SEO_OVERRIDE_KEYS) {
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

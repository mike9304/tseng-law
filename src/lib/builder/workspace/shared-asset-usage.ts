import { DEFAULT_BUILDER_SITE_ID } from '@/lib/builder/constants';
import {
  readFooterCanvas,
  readHeaderCanvas,
  readLightboxCanvas,
  readPageCanvas,
  readSiteDocument,
} from '@/lib/builder/site/persistence';
import { defaultLocale } from '@/lib/locales';
import { buildSharedAssetUrl } from '@/lib/builder/workspace/shared-assets';
import { listWorkspaceSites } from '@/lib/builder/workspace/workspace-store';

const DEFAULT_REFERENCE_LIMIT = 20;
const PAGE_CANVAS_VARIANTS = ['draft', 'published'] as const;

export type SharedAssetPageVariant = (typeof PAGE_CANVAS_VARIANTS)[number];

export type SharedAssetUsageSource =
  | 'site-document'
  | 'page-canvas'
  | 'header-canvas'
  | 'footer-canvas'
  | 'lightbox-canvas';

export interface SharedAssetUsageContext {
  readonly siteId: string;
  readonly source: SharedAssetUsageSource;
  readonly label: string;
  readonly pageId?: string;
  readonly lightboxId?: string;
  readonly variant?: SharedAssetPageVariant;
}

export interface SharedAssetUsageReference extends SharedAssetUsageContext {
  readonly path: string;
}

export interface SharedAssetUsageSummary {
  readonly total: number;
  readonly references: readonly SharedAssetUsageReference[];
  readonly truncated: boolean;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

function normalizeReferenceLimit(limit: number | undefined): number {
  if (limit === undefined || !Number.isFinite(limit)) return DEFAULT_REFERENCE_LIMIT;
  return Math.max(0, Math.trunc(limit));
}

export function collectSharedAssetUsageFromValue(
  value: unknown,
  targetUrl: string,
  context: SharedAssetUsageContext,
  referenceLimit?: number,
): SharedAssetUsageSummary {
  const limit = normalizeReferenceLimit(referenceLimit);
  const references: SharedAssetUsageReference[] = [];
  let total = 0;

  function visit(current: unknown, path: string): void {
    if (typeof current === 'string') {
      if (!current.includes(targetUrl)) return;
      total += 1;
      if (references.length < limit) references.push({ ...context, path });
      return;
    }

    if (Array.isArray(current)) {
      for (const [index, item] of current.entries()) {
        visit(item, `${path}[${index}]`);
      }
      return;
    }

    if (!isRecord(current)) return;
    for (const [key, item] of Object.entries(current)) {
      visit(item, `${path}.${key}`);
    }
  }

  visit(value, '$');
  return {
    total,
    references,
    truncated: total > references.length,
  };
}

function mergeUsage(
  current: SharedAssetUsageSummary,
  next: SharedAssetUsageSummary,
): SharedAssetUsageSummary {
  return {
    total: current.total + next.total,
    references: [...current.references, ...next.references],
    truncated: current.truncated || next.truncated,
  };
}

async function workspaceSiteIds(): Promise<readonly string[]> {
  const ids = new Set<string>([DEFAULT_BUILDER_SITE_ID]);
  const sites = await listWorkspaceSites();
  for (const site of sites) ids.add(site.siteId);
  return [...ids];
}

export async function findSharedAssetUsage(
  filename: string,
  options: { readonly referenceLimit?: number } = {},
): Promise<SharedAssetUsageSummary> {
  const targetUrl = buildSharedAssetUrl(filename);
  const limit = normalizeReferenceLimit(options.referenceLimit);
  let usage: SharedAssetUsageSummary = { total: 0, references: [], truncated: false };

  function collect(value: unknown, context: SharedAssetUsageContext): void {
    const remaining = Math.max(0, limit - usage.references.length);
    usage = mergeUsage(
      usage,
      collectSharedAssetUsageFromValue(value, targetUrl, context, remaining),
    );
  }

  for (const siteId of await workspaceSiteIds()) {
    const site = await readSiteDocument(siteId, defaultLocale);
    collect(site, { siteId, source: 'site-document', label: 'Site document' });

    const header = await readHeaderCanvas(siteId);
    if (header) collect(header, { siteId, source: 'header-canvas', label: 'Global header canvas' });

    const footer = await readFooterCanvas(siteId);
    if (footer) collect(footer, { siteId, source: 'footer-canvas', label: 'Global footer canvas' });

    for (const page of site.pages) {
      for (const variant of PAGE_CANVAS_VARIANTS) {
        const canvas = await readPageCanvas(siteId, page.pageId, variant);
        if (!canvas) continue;
        collect(canvas, {
          siteId,
          source: 'page-canvas',
          label: `${page.title[defaultLocale]} ${variant} canvas`,
          pageId: page.pageId,
          variant,
        });
      }
    }

    for (const lightbox of site.lightboxes ?? []) {
      const canvas = await readLightboxCanvas(siteId, lightbox.id);
      if (!canvas) continue;
      collect(canvas, {
        siteId,
        source: 'lightbox-canvas',
        label: `${lightbox.name} lightbox canvas`,
        lightboxId: lightbox.id,
      });
    }
  }

  return {
    total: usage.total,
    references: usage.references.slice(0, limit),
    truncated: usage.truncated || usage.references.length > limit,
  };
}

/**
 * Account-level CMS rollup (read-only v1).
 *
 * Aggregates every workspace site's `cmsCollections` into a single account
 * summary that the workspace dashboard can render. Per-site write paths
 * remain unchanged — this is purely a read facade.
 */

import { defaultLocale } from '@/lib/locales';
import { readSiteDocument } from '@/lib/builder/site/persistence';
import { listWorkspaceSites } from './workspace-store';

export interface AccountCollectionSummary {
  collectionId: string;
  name: string;
  recordCount: number;
  lastUpdatedAt: string | null;
  sites: string[];
}

interface MutableSummary {
  collectionId: string;
  name: string;
  recordCount: number;
  lastUpdatedAt: string | null;
  sites: Set<string>;
}

function mergeTimestamp(current: string | null, next: string | null | undefined): string | null {
  if (!next) return current;
  if (!current) return next;
  return next > current ? next : current;
}

export async function listAccountCollections(): Promise<AccountCollectionSummary[]> {
  const sites = await listWorkspaceSites();
  if (sites.length === 0) return [];

  const byId = new Map<string, MutableSummary>();

  await Promise.all(sites.map(async (site) => {
    let siteDoc;
    try {
      siteDoc = await readSiteDocument(site.siteId, defaultLocale);
    } catch {
      return;
    }
    for (const collection of siteDoc.cmsCollections ?? []) {
      const key = collection.collectionId;
      const existing = byId.get(key);
      if (existing) {
        existing.recordCount += collection.records?.length ?? 0;
        existing.lastUpdatedAt = mergeTimestamp(existing.lastUpdatedAt, collection.updatedAt);
        existing.sites.add(site.siteId);
      } else {
        byId.set(key, {
          collectionId: key,
          name: collection.name || key,
          recordCount: collection.records?.length ?? 0,
          lastUpdatedAt: collection.updatedAt ?? null,
          sites: new Set([site.siteId]),
        });
      }
    }
  }));

  return Array.from(byId.values())
    .map((entry) => ({
      collectionId: entry.collectionId,
      name: entry.name,
      recordCount: entry.recordCount,
      lastUpdatedAt: entry.lastUpdatedAt,
      sites: Array.from(entry.sites).sort(),
    }))
    .sort((a, b) => a.name.localeCompare(b.name));
}
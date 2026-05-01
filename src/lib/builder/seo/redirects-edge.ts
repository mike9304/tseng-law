/**
 * SEO maturity — edge-runtime helper for the redirects middleware.
 *
 * Middleware runs on the Edge runtime. The Node-only filesystem
 * fallback in `persistence.ts` is not available there, so this module
 * fetches Vercel Blob directly with the platform fetch API and falls back
 * to "no rules" when
 * the blob token is missing (typical for `next dev` without a linked
 * project) — never blocks the request.
 *
 * A short-lived module-level cache (60s TTL) keeps per-request cost
 * negligible. Vercel reuses edge instances within a region, so the
 * cache hit rate is high in practice.
 */

import type {
  BuilderSiteDocument,
  SiteRedirect,
} from '@/lib/builder/site/types';
import { DEFAULT_BUILDER_SITE_ID } from '@/lib/builder/constants';

const TTL_MS = 60_000;
const SITE_BLOB_PATH = `builder-site/${DEFAULT_BUILDER_SITE_ID}/site.json`;

interface CacheSlot {
  rules: SiteRedirect[];
  fetchedAt: number;
}

let cache: CacheSlot | null = null;

async function fetchRulesFromBlob(): Promise<SiteRedirect[]> {
  const token = process.env.BLOB_READ_WRITE_TOKEN;
  if (!token) return [];
  const [, , , storeId = ''] = token.split('_');
  if (!storeId) return [];

  try {
    const url = new URL(
      `https://${storeId}.private.blob.vercel-storage.com/${SITE_BLOB_PATH}`,
    );
    url.searchParams.set('cache', '0');
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        authorization: `Bearer ${token}`,
      },
    });
    if (!response.ok) return [];
    const text = await response.text();
    const doc = JSON.parse(text) as BuilderSiteDocument;
    return Array.isArray(doc.redirects) ? doc.redirects : [];
  } catch {
    return [];
  }
}

export async function loadActiveRedirects(): Promise<SiteRedirect[]> {
  const now = Date.now();
  if (cache && now - cache.fetchedAt < TTL_MS) {
    return cache.rules;
  }
  const rules = (await fetchRulesFromBlob()).filter((r) => r.isActive);
  cache = { rules, fetchedAt: now };
  return rules;
}

/** Force-clear the cache (e.g. after the API mutates rules). */
export function invalidateRedirectsCache(): void {
  cache = null;
}

/**
 * Match a path against the active rule set. Returns the matching rule
 * or `null`. Verbatim match — no glob support yet.
 */
export function findMatchingRedirect(
  path: string,
  rules: SiteRedirect[],
): SiteRedirect | null {
  if (!path.startsWith('/')) return null;
  for (const rule of rules) {
    if (rule.from === path) return rule;
  }
  return null;
}

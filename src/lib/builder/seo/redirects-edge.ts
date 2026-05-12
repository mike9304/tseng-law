/**
 * SEO maturity — edge-runtime helper for the redirects middleware.
 *
 * Middleware runs on the Edge runtime. The Node-only filesystem
 * fallback in `persistence.ts` is not available there, so this module
 * fetches Vercel Blob directly with the platform fetch API. For local
 * development and Playwright, it falls back to a same-origin public read API
 * so redirect-manager changes can be verified against the actual middleware
 * response path without requiring a Vercel Blob token.
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

function isLocalOrigin(origin: string | undefined): boolean {
  if (!origin) return false;
  try {
    const { hostname } = new URL(origin);
    return hostname === 'localhost' || hostname === '127.0.0.1' || hostname === '0.0.0.0';
  } catch {
    return false;
  }
}

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

async function fetchRulesFromPublicApi(origin: string): Promise<SiteRedirect[]> {
  try {
    const url = new URL('/api/builder/site/redirects/public?locale=ko', origin);
    const response = await fetch(url, {
      method: 'GET',
      headers: { accept: 'application/json' },
      cache: 'no-store',
    });
    if (!response.ok) return [];
    const payload = await response.json() as { redirects?: SiteRedirect[] };
    return Array.isArray(payload.redirects) ? payload.redirects : [];
  } catch {
    return [];
  }
}

export async function loadActiveRedirects(origin?: string): Promise<SiteRedirect[]> {
  const localOrigin = isLocalOrigin(origin);
  if (localOrigin && origin) {
    return (await fetchRulesFromPublicApi(origin)).filter((r) => r.isActive);
  }

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

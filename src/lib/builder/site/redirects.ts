/**
 * Site-level redirect rules — SEO maturity track (Wix SEO Wiz parity).
 *
 * Redirect rules are stored inside the BuilderSiteDocument under
 * `redirects` so they ride along with the rest of the site config.
 * Edge middleware reads them from `@vercel/blob` on every public request
 * (with a short-lived in-memory TTL cache to keep the per-request cost
 * negligible).
 *
 * Public type: `SiteRedirect` (see `./types.ts`).
 *
 * Validation rules enforced here AND in the API layer:
 *   - `from` must start with "/", be ≤ 1024 chars, no whitespace
 *   - `from` may end in `/*` for a prefix redirect
 *   - `to` must start with "/" or be a full URL (http(s)://)
 *   - `to` may end in `/*` only when `from` is a prefix redirect
 *   - `from` must not equal `to` (loop)
 *   - `type` must be one of 301|302|307|308
 *   - simple A→B→C chain detection (best-effort)
 *
 * Storage format = the site doc's existing JSON in
 * `builder-site/<siteId>/site.json`. We don't keep a separate blob path —
 * single source of truth.
 */

import type { Locale } from '@/lib/locales';
import { findRedirectMatch } from './redirect-match';
import {
  readSiteDocument,
  writeSiteDocument,
} from './persistence';
import type {
  BuilderSiteDocument,
  SiteRedirect,
  SiteRedirectStatus,
} from './types';

const VALID_STATUS: ReadonlySet<SiteRedirectStatus> = new Set([301, 302, 307, 308]);
const FROM_MAX = 1024;
const TO_MAX = 2048;

let redirectIdCounter = 0;
export function generateRedirectId(): string {
  redirectIdCounter += 1;
  return `redir-${Date.now()}-${redirectIdCounter}`;
}

export interface RedirectInput {
  from: string;
  to: string;
  type?: SiteRedirectStatus;
  isActive?: boolean;
  note?: string;
}

export interface RedirectValidationError {
  field: 'from' | 'to' | 'type';
  message: string;
}

export function validateRedirectInput(
  input: RedirectInput,
  existing: SiteRedirect[],
  ignoreId?: string,
): RedirectValidationError | null {
  const from = (input.from ?? '').trim();
  const to = (input.to ?? '').trim();
  const type = input.type ?? 301;

  if (!from) return { field: 'from', message: 'from is required' };
  if (!from.startsWith('/')) return { field: 'from', message: 'from must start with "/"' };
  if (from.length > FROM_MAX) return { field: 'from', message: `from must be ≤ ${FROM_MAX} chars` };
  if (/\s/.test(from)) return { field: 'from', message: 'from must not contain whitespace' };
  const fromWildcard = from.includes('*');
  if (fromWildcard && (!from.endsWith('/*') || from.indexOf('*') !== from.length - 1)) {
    return { field: 'from', message: 'from wildcard must be a trailing /* prefix pattern' };
  }

  if (!to) return { field: 'to', message: 'to is required' };
  const isAbsolute = /^https?:\/\//i.test(to);
  if (!to.startsWith('/') && !isAbsolute) {
    return { field: 'to', message: 'to must start with "/" or be a full URL' };
  }
  if (to.length > TO_MAX) return { field: 'to', message: `to must be ≤ ${TO_MAX} chars` };
  const toWildcard = to.includes('*');
  if (toWildcard && (!to.startsWith('/') || !to.endsWith('/*') || to.indexOf('*') !== to.length - 1)) {
    return { field: 'to', message: 'to wildcard must be a trailing /* path pattern' };
  }
  if (toWildcard && !fromWildcard) {
    return { field: 'to', message: 'to wildcard requires a from wildcard' };
  }

  if (from === to) {
    return { field: 'to', message: 'from and to must differ (loop)' };
  }

  if (!VALID_STATUS.has(type)) {
    return { field: 'type', message: 'type must be 301, 302, 307, or 308' };
  }

  // Simple chain detection: another active rule already redirects FROM `to`
  // somewhere else. The chain `A→B; B→C` would force browsers to do two hops
  // and is almost always a mistake when authoring rules manually.
  const chain = existing.find(
    (r) =>
      r.redirectId !== ignoreId &&
      r.isActive &&
      r.from === to &&
      to.startsWith('/'),
  );
  if (chain) {
    return {
      field: 'to',
      message: `to "${to}" is itself the source of an active redirect (creates a chain)`,
    };
  }

  // Duplicate `from` (only one active rule per source path)
  const dup = existing.find(
    (r) => r.redirectId !== ignoreId && r.isActive && r.from === from,
  );
  if (dup) {
    return { field: 'from', message: `from "${from}" already has an active redirect` };
  }

  return null;
}

// ─── CRUD ─────────────────────────────────────────────────────────────

export async function listRedirects(
  siteId: string,
  locale: Locale,
): Promise<SiteRedirect[]> {
  const site = await readSiteDocument(siteId, locale);
  return site.redirects ?? [];
}

export async function createRedirect(
  siteId: string,
  locale: Locale,
  input: RedirectInput,
): Promise<{ redirect: SiteRedirect } | { error: RedirectValidationError }> {
  const site = await readSiteDocument(siteId, locale);
  const existing = site.redirects ?? [];

  const error = validateRedirectInput(input, existing);
  if (error) return { error };

  const now = new Date().toISOString();
  const redirect: SiteRedirect = {
    redirectId: generateRedirectId(),
    from: input.from.trim(),
    to: input.to.trim(),
    type: input.type ?? 301,
    isActive: input.isActive ?? true,
    note: input.note?.trim() || undefined,
    createdAt: now,
    updatedAt: now,
  };

  await writeSiteWithRedirects(site, [...existing, redirect]);

  // The write path merges with the latest persisted document. If a
  // concurrent create landed an active rule for the same `from` after our
  // read, the merge keeps the already-committed rule and drops ours —
  // report that as the same duplicate-source error instead of returning
  // success for a rule that was never persisted.
  const persisted = await readSiteDocument(siteId, locale);
  const survived = (persisted.redirects ?? []).some(
    (r) => r.redirectId === redirect.redirectId,
  );
  if (!survived) {
    return {
      error: {
        field: 'from',
        message: `from "${redirect.from}" already has an active redirect`,
      },
    };
  }
  return { redirect };
}

export async function updateRedirect(
  siteId: string,
  locale: Locale,
  id: string,
  patch: Partial<RedirectInput> & { isActive?: boolean },
): Promise<
  | { redirect: SiteRedirect }
  | { error: RedirectValidationError }
  | { notFound: true }
> {
  const site = await readSiteDocument(siteId, locale);
  const existing = site.redirects ?? [];
  const index = existing.findIndex((r) => r.redirectId === id);
  if (index === -1) return { notFound: true };

  const current = existing[index];
  const next: SiteRedirect = {
    ...current,
    from: patch.from?.trim() ?? current.from,
    to: patch.to?.trim() ?? current.to,
    type: patch.type ?? current.type,
    isActive: patch.isActive ?? current.isActive,
    note: patch.note !== undefined ? (patch.note.trim() || undefined) : current.note,
    updatedAt: new Date().toISOString(),
  };

  // Skip self-conflict checks when only the active flag is flipping.
  const onlyActiveFlip =
    patch.from === undefined &&
    patch.to === undefined &&
    patch.type === undefined &&
    patch.note === undefined;
  if (!onlyActiveFlip) {
    const error = validateRedirectInput(
      { from: next.from, to: next.to, type: next.type, isActive: next.isActive },
      existing,
      id,
    );
    if (error) return { error };
  }

  const updated = [...existing];
  updated[index] = next;
  await writeSiteWithRedirects(site, updated);
  return { redirect: next };
}

export async function deleteRedirect(
  siteId: string,
  locale: Locale,
  id: string,
): Promise<boolean> {
  const site = await readSiteDocument(siteId, locale);
  const existing = site.redirects ?? [];
  const filtered = existing.filter((r) => r.redirectId !== id);
  if (filtered.length === existing.length) return false;
  await writeSiteWithRedirects(site, filtered, { deleteRedirectIds: [id] });
  return true;
}

async function writeSiteWithRedirects(
  site: BuilderSiteDocument,
  redirects: SiteRedirect[],
  options: Parameters<typeof writeSiteDocument>[1] = {},
): Promise<void> {
  site.redirects = redirects;
  site.updatedAt = new Date().toISOString();
  await writeSiteDocument(site, options);
}

// ─── Match ────────────────────────────────────────────────────────────

/**
 * Match a request path against the active redirect rules.
 *
 * The path must include the locale prefix when applicable (e.g.
 * `/ko/old-services`). Exact rules win first. Trailing `/*` sources act as
 * prefix redirects and can preserve the suffix when the destination also
 * ends in `/*`.
 */
export function matchRedirect(
  path: string,
  rules: SiteRedirect[],
): SiteRedirect | null {
  return findRedirectMatch(path, rules);
}

// ─── Vercel-config compatibility (optional) ──────────────────────────
// Kept for callers that may want to materialize rules into a build artifact.

export function toVercelRedirects(rules: SiteRedirect[]): Array<{
  source: string;
  destination: string;
  permanent: boolean;
  statusCode?: number;
}> {
  return rules
    .filter((r) => r.isActive)
    .map((r) => ({
      source: r.from,
      destination: r.to,
      permanent: r.type === 301 || r.type === 308,
      statusCode: r.type,
    }));
}

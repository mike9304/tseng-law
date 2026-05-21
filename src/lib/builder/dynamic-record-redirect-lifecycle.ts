/**
 * F22 — CMS record-slug redirect lifecycle.
 *
 * When a CMS record's slug field changes, every previously published URL
 * referencing the old slug should 301 to the new slug. This module computes
 * the redirect input and (when invoked at lifecycle time) persists it
 * through `createRedirect`. The computation is intentionally pure so it can
 * be unit-tested without touching the site doc store.
 *
 * Scope
 * -----
 * Only the three CMS-backed dynamic collections shipped today (`columns`,
 * `service-areas`, `attorney-profiles`) participate. Each collection maps
 * to a fixed locale-prefixed base path; the redirect `from` is the locale-
 * prefixed old URL and the redirect `to` is the locale-prefixed new URL.
 *
 * Chain handling
 * --------------
 * `validateRedirectInput` rejects "A→B; B→C" chains by default to protect
 * editors authoring rules manually. Slug renames are the legitimate case for
 * chains, so the lifecycle helper proactively deactivates any preexisting
 * active rule whose `from` equals the new path before creating the next
 * one. The deactivation is a soft delete (preserves history); a follow-up
 * pass could compact equivalent chains into a single hop.
 *
 * Used by
 * -------
 * CMS draft → published flow for any record whose slug field is the same
 * as the dynamic item config's `slugField`. F26's atomic publish hook is
 * the natural caller, but this helper is also safe to call manually from
 * an admin "rename slug" UI.
 */
import type { Locale } from '@/lib/locales';
import { defaultLocale, locales } from '@/lib/locales';
import {
  createRedirect,
  listRedirects,
  updateRedirect,
  validateRedirectInput,
  type RedirectInput,
  type RedirectValidationError,
} from '@/lib/builder/site/redirects';
import type { BuilderDatasetCollectionId } from '@/lib/builder/types';
import type { SiteRedirect } from '@/lib/builder/site/types';

export interface RecordSlugRedirectInputs {
  locale: Locale;
  collectionId: BuilderDatasetCollectionId;
  oldSlug: string;
  newSlug: string;
}

export interface RecordSlugRedirectComputation {
  /** The redirect input that should be persisted, or `null` when the rename is a no-op. */
  redirect: RedirectInput | null;
  /** Why the redirect was skipped — useful for logging / surfacing in the UI. */
  skipReason?: 'same-slug' | 'invalid-slug' | 'unknown-collection' | 'invalid-locale';
}

export interface ApplyRecordSlugRedirectResult {
  status: 'created' | 'skipped' | 'validation-failed';
  redirect?: SiteRedirect;
  skipReason?: RecordSlugRedirectComputation['skipReason'] | 'already-exists';
  validationError?: RedirectValidationError;
  /**
   * Redirect ids that were deactivated to keep the new rule chain-free
   * (any preexisting active rule whose `from` equals the new path).
   */
  deactivatedRedirectIds: string[];
}

const COLLECTION_BASE_PATHS: ReadonlyMap<BuilderDatasetCollectionId, string> = new Map([
  ['columns', 'columns'],
  ['service-areas', 'services'],
  ['attorney-profiles', 'lawyers'],
] as const);

/**
 * Pure helper — given a locale, a collection, and an old/new slug pair,
 * compute the `RedirectInput` that should be created. Returns `null` (with a
 * skip reason) for no-op or invalid inputs so callers can log + telemetry
 * without throwing.
 */
export function computeRecordSlugRedirectInput(
  inputs: RecordSlugRedirectInputs,
): RecordSlugRedirectComputation {
  if (!locales.includes(inputs.locale)) {
    return { redirect: null, skipReason: 'invalid-locale' };
  }
  if (!COLLECTION_BASE_PATHS.has(inputs.collectionId)) {
    return { redirect: null, skipReason: 'unknown-collection' };
  }
  const oldSlug = sanitizeRecordSlug(inputs.oldSlug);
  const newSlug = sanitizeRecordSlug(inputs.newSlug);
  if (!oldSlug || !newSlug) {
    return { redirect: null, skipReason: 'invalid-slug' };
  }
  if (oldSlug === newSlug) {
    return { redirect: null, skipReason: 'same-slug' };
  }
  const base = COLLECTION_BASE_PATHS.get(inputs.collectionId)!;
  const fromPath = `/${inputs.locale}/${base}/${oldSlug}`;
  const toPath = `/${inputs.locale}/${base}/${newSlug}`;
  return {
    redirect: {
      from: fromPath,
      to: toPath,
      type: 301,
      isActive: true,
      note: `auto:record-slug-rename(${inputs.collectionId},${oldSlug}→${newSlug})`,
    },
  };
}

/**
 * Persist the slug-rename redirect. Deactivates any preexisting active rule
 * whose `from` equals the new path so we don't create a chain (`A→B; B→C`).
 */
export async function applyRecordSlugRedirect(
  siteId: string,
  inputs: RecordSlugRedirectInputs,
): Promise<ApplyRecordSlugRedirectResult> {
  const locale = inputs.locale ?? defaultLocale;
  const computation = computeRecordSlugRedirectInput({ ...inputs, locale });
  if (!computation.redirect) {
    return {
      status: 'skipped',
      skipReason: computation.skipReason,
      deactivatedRedirectIds: [],
    };
  }

  const existing = await listRedirects(siteId, locale);
  const sameFrom = existing.find(
    (entry) => entry.isActive && entry.from === computation.redirect!.from,
  );
  if (sameFrom && sameFrom.to === computation.redirect.to) {
    return {
      status: 'skipped',
      skipReason: 'already-exists',
      redirect: sameFrom,
      deactivatedRedirectIds: [],
    };
  }

  const chainSources = existing.filter(
    (entry) =>
      entry.isActive &&
      entry.from === computation.redirect!.to &&
      entry.redirectId !== sameFrom?.redirectId,
  );

  const deactivatedRedirectIds: string[] = [];
  for (const rule of chainSources) {
    const result = await updateRedirect(siteId, locale, rule.redirectId, { isActive: false });
    if ('redirect' in result) deactivatedRedirectIds.push(rule.redirectId);
  }

  if (sameFrom) {
    const renamed = await updateRedirect(siteId, locale, sameFrom.redirectId, {
      to: computation.redirect.to,
      type: computation.redirect.type,
      isActive: true,
      note: computation.redirect.note,
    });
    if ('redirect' in renamed) {
      return {
        status: 'created',
        redirect: renamed.redirect,
        deactivatedRedirectIds,
      };
    }
    if ('error' in renamed) {
      return {
        status: 'validation-failed',
        validationError: renamed.error,
        deactivatedRedirectIds,
      };
    }
  }

  const refreshed = await listRedirects(siteId, locale);
  const validation = validateRedirectInput(computation.redirect, refreshed);
  if (validation) {
    return {
      status: 'validation-failed',
      validationError: validation,
      deactivatedRedirectIds,
    };
  }

  const created = await createRedirect(siteId, locale, computation.redirect);
  if ('error' in created) {
    return {
      status: 'validation-failed',
      validationError: created.error,
      deactivatedRedirectIds,
    };
  }
  return {
    status: 'created',
    redirect: created.redirect,
    deactivatedRedirectIds,
  };
}

/**
 * Locale-prefixed base path for a CMS collection. Exposed so other modules
 * (e.g. wildcard conflict diagnostics) can derive the same path without
 * duplicating the mapping table.
 */
export function getCollectionBasePath(collectionId: BuilderDatasetCollectionId): string | null {
  return COLLECTION_BASE_PATHS.get(collectionId) ?? null;
}

function sanitizeRecordSlug(value: string | null | undefined): string {
  if (typeof value !== 'string') return '';
  const trimmed = value.trim().replace(/^\/+|\/+$/g, '');
  if (!trimmed) return '';
  if (trimmed.includes('/')) return '';
  if (trimmed.includes(' ')) return '';
  if (trimmed.length > 160) return '';
  return trimmed;
}
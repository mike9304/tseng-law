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
 * to a fixed locale-prefixed base path, and builder-authored dynamic item
 * pages for the same collection add their own page slug as additional bases.
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
import { readSiteDocument } from '@/lib/builder/site/persistence';
import type { BuilderDatasetCollectionId } from '@/lib/builder/types';
import type { BuilderPageMeta, SiteRedirect } from '@/lib/builder/site/types';

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

export interface RecordSlugRedirectListComputation {
  /** Redirect inputs for every URL base that can expose this record slug. */
  redirects: RedirectInput[];
  /** Why all redirects were skipped — useful for logging / surfacing in the UI. */
  skipReason?: RecordSlugRedirectComputation['skipReason'];
}

export interface ApplyRecordSlugRedirectResult {
  status: 'created' | 'skipped' | 'validation-failed';
  redirect?: SiteRedirect;
  redirects?: SiteRedirect[];
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
 * Compute every redirect needed for a record slug rename, including
 * builder-authored dynamic item pages whose source collection matches the
 * renamed collection. The legacy static base is kept first for
 * backward compatibility, and duplicate bases are collapsed.
 */
export function computeRecordSlugRedirectInputs(
  inputs: RecordSlugRedirectInputs,
  pages: Array<Pick<BuilderPageMeta, 'locale' | 'slug' | 'dynamicItem' | 'isHomePage'>> = [],
): RecordSlugRedirectListComputation {
  if (!locales.includes(inputs.locale)) {
    return { redirects: [], skipReason: 'invalid-locale' };
  }
  if (!COLLECTION_BASE_PATHS.has(inputs.collectionId)) {
    return { redirects: [], skipReason: 'unknown-collection' };
  }
  const oldSlug = sanitizeRecordSlug(inputs.oldSlug);
  const newSlug = sanitizeRecordSlug(inputs.newSlug);
  if (!oldSlug || !newSlug) {
    return { redirects: [], skipReason: 'invalid-slug' };
  }
  if (oldSlug === newSlug) {
    return { redirects: [], skipReason: 'same-slug' };
  }

  const bases = new Set<string>();
  const legacyBase = COLLECTION_BASE_PATHS.get(inputs.collectionId);
  if (legacyBase) bases.add(legacyBase);
  for (const page of pages) {
    if (page.locale !== inputs.locale) continue;
    if (page.isHomePage) continue;
    if ((page.dynamicItem?.cmsCollectionId ?? page.dynamicItem?.collectionId) !== inputs.collectionId) continue;
    const pageBase = page.slug.trim().replace(/^\/+|\/+$/g, '');
    if (pageBase) bases.add(pageBase);
  }

  return {
    redirects: Array.from(bases).map((base) => ({
      from: `/${inputs.locale}/${base}/${oldSlug}`,
      to: `/${inputs.locale}/${base}/${newSlug}`,
      type: 301,
      isActive: true,
      note: `auto:record-slug-rename(${inputs.collectionId},${oldSlug}→${newSlug})`,
    })),
  };
}

async function applySingleRecordSlugRedirect(
  siteId: string,
  locale: Locale,
  redirectInput: RedirectInput,
): Promise<ApplyRecordSlugRedirectResult> {
  const existing = await listRedirects(siteId, locale);
  const sameFrom = existing.find(
    (entry) => entry.isActive && entry.from === redirectInput.from,
  );
  if (sameFrom && sameFrom.to === redirectInput.to) {
    return {
      status: 'skipped',
      skipReason: 'already-exists',
      redirect: sameFrom,
      redirects: [],
      deactivatedRedirectIds: [],
    };
  }

  const chainSources = existing.filter(
    (entry) =>
      entry.isActive &&
      entry.from === redirectInput.to &&
      entry.redirectId !== sameFrom?.redirectId,
  );

  const deactivatedRedirectIds: string[] = [];
  for (const rule of chainSources) {
    const result = await updateRedirect(siteId, locale, rule.redirectId, { isActive: false });
    if ('redirect' in result) deactivatedRedirectIds.push(rule.redirectId);
  }

  if (sameFrom) {
    const renamed = await updateRedirect(siteId, locale, sameFrom.redirectId, {
      to: redirectInput.to,
      type: redirectInput.type,
      isActive: true,
      note: redirectInput.note,
    });
    if ('redirect' in renamed) {
      return {
        status: 'created',
        redirect: renamed.redirect,
        redirects: [renamed.redirect],
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
  const validation = validateRedirectInput(redirectInput, refreshed);
  if (validation) {
    return {
      status: 'validation-failed',
      validationError: validation,
      deactivatedRedirectIds,
    };
  }

  const created = await createRedirect(siteId, locale, redirectInput);
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
    redirects: [created.redirect],
    deactivatedRedirectIds,
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
  const site = await readSiteDocument(siteId, locale);
  const computation = computeRecordSlugRedirectInputs({ ...inputs, locale }, site.pages);
  if (computation.redirects.length === 0) {
    return {
      status: 'skipped',
      skipReason: computation.skipReason,
      deactivatedRedirectIds: [],
    };
  }

  const redirects: SiteRedirect[] = [];
  const deactivatedRedirectIds: string[] = [];
  let existingRedirect: SiteRedirect | undefined;
  let validationError: RedirectValidationError | undefined;
  for (const redirectInput of computation.redirects) {
    const result = await applySingleRecordSlugRedirect(siteId, locale, redirectInput);
    deactivatedRedirectIds.push(...result.deactivatedRedirectIds);
    if (result.status === 'created' && result.redirect) {
      redirects.push(result.redirect);
      continue;
    }
    if (result.status === 'skipped' && result.redirect && !existingRedirect) {
      existingRedirect = result.redirect;
      continue;
    }
    if (result.status === 'validation-failed' && result.validationError && !validationError) {
      validationError = result.validationError;
    }
  }

  if (redirects.length > 0) {
    return {
      status: 'created',
      redirect: redirects[0],
      redirects,
      deactivatedRedirectIds,
    };
  }
  if (validationError) {
    return {
      status: 'validation-failed',
      validationError,
      deactivatedRedirectIds,
    };
  }

  return {
    status: 'skipped',
    skipReason: 'already-exists',
    redirect: existingRedirect,
    redirects: [],
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

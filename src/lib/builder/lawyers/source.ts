import {
  attorneyProfiles,
  getAttorneyProfileSlugs,
  type AttorneyProfile,
  type AttorneyProfileSlug,
} from '@/data/attorney-profiles';
import { DEFAULT_BUILDER_SITE_ID } from '@/lib/builder/constants';
import { readSiteDocument, writeSiteDocument } from '@/lib/builder/site/persistence';
import type { BuilderAttorneyProfileSourceOverride } from '@/lib/builder/site/types';
import {
  buildDefaultAttorneyImageAltText,
  defaultAttorneyImageFocalPoint,
  mergeLocalizedOverride,
  normalizeAttorneyProfileSlug,
  normalizeAttorneyProfileSourceOverrides,
  normalizeEmail,
  normalizeImageAltText,
  normalizeImageFocalPoint,
  normalizeProfileLinks,
  normalizeStringList,
  stripEmptyAttorneyProfileSourceOverride,
  type AttorneyImageFocalPoint,
  type LocalizedAttorneyPatch,
} from '@/lib/builder/lawyers/source-normalizers';
import { normalizeLocale, type Locale } from '@/lib/locales';

export interface AttorneyProfileSourceRecord extends Omit<AttorneyProfile, 'slug'> {
  sourceSlug: AttorneyProfileSlug;
  slug: string;
  imageAltText: string;
  imageFocalPoint: AttorneyImageFocalPoint;
  updatedAt?: string;
  updatedBy?: string;
}

export interface AttorneyProfileSourcePatch {
  slug?: string;
  localized?: Partial<Record<Locale, LocalizedAttorneyPatch>>;
  email?: string;
  image?: string;
  imageAltText?: string;
  imageFocalPoint?: AttorneyImageFocalPoint;
}

export class BuilderAttorneyProfileSourceError extends Error {
  constructor(message: string, public readonly issues: string[] = [message]) {
    super(message);
    this.name = 'BuilderAttorneyProfileSourceError';
  }
}

export { normalizeAttorneyProfileSlug } from '@/lib/builder/lawyers/source-normalizers';

export function mergeAttorneyProfileSourceRecords(
  overridesInput: readonly BuilderAttorneyProfileSourceOverride[] | null | undefined,
  localeInput: string | null | undefined,
): AttorneyProfileSourceRecord[] {
  const locale = normalizeLocale(localeInput ?? undefined);
  const overrides = normalizeAttorneyProfileSourceOverrides(overridesInput);
  const overridesBySourceSlug = new Map(overrides.map((override) => [override.sourceSlug, override] as const));
  const usedSlugs = new Set<string>();
  const sourceSlugs = new Set<string>(getAttorneyProfileSlugs());

  return getAttorneyProfileSlugs().map((sourceSlug) => {
    const base = attorneyProfiles[locale][sourceSlug];
    const override = overridesBySourceSlug.get(sourceSlug);
    const overrideSlug = normalizeAttorneyProfileSlug(override?.slug);
    const collidesWithAnotherSourceSlug = overrideSlug !== sourceSlug && sourceSlugs.has(overrideSlug);
    const candidateSlug = overrideSlug && !collidesWithAnotherSourceSlug ? overrideSlug : sourceSlug;
    const slug = usedSlugs.has(candidateSlug) ? sourceSlug : candidateSlug;
    usedSlugs.add(slug);

    const localized = override?.localized?.[locale];
    const name = localized?.name?.trim() || base.name;
    const role = localized?.role?.trim() || base.role;
    const imageAltText = normalizeImageAltText(override?.imageAltText) ?? buildDefaultAttorneyImageAltText(name, role);

    const internalLinks = localized && Object.prototype.hasOwnProperty.call(localized, 'internalLinks')
      ? normalizeProfileLinks(localized.internalLinks, 20)
      : base.internalLinks;

    return {
      ...base,
      sourceSlug,
      slug,
      name,
      role,
      title: localized?.title?.trim() || base.title,
      description: localized?.description?.trim() || base.description,
      summary: localized?.summary?.length ? normalizeStringList(localized.summary, 12) : base.summary,
      languages: localized?.languages?.length ? normalizeStringList(localized.languages, 12) : base.languages,
      practiceAreas: localized?.practiceAreas?.length ? normalizeStringList(localized.practiceAreas, 24) : base.practiceAreas,
      internalLinks,
      email: override?.email?.trim() || base.email,
      image: override?.image?.trim() || base.image,
      imageAltText,
      imageFocalPoint: normalizeImageFocalPoint(override?.imageFocalPoint) ?? defaultAttorneyImageFocalPoint(),
      updatedAt: override?.updatedAt,
      updatedBy: override?.updatedBy,
    };
  });
}

export async function readAttorneyProfileSourceRecords(
  siteId = DEFAULT_BUILDER_SITE_ID,
  localeInput?: string | null,
): Promise<AttorneyProfileSourceRecord[]> {
  const locale = normalizeLocale(localeInput ?? undefined);
  const site = await readSiteDocument(siteId, locale);
  return mergeAttorneyProfileSourceRecords(site.sourceCollectionOverrides?.attorneyProfiles, locale);
}

export async function readAttorneyProfileSourceRecordBySlug(
  siteId: string,
  localeInput: string | null | undefined,
  slugInput: string,
): Promise<AttorneyProfileSourceRecord | null> {
  const slug = normalizeAttorneyProfileSlug(slugInput);
  if (!slug) return null;
  const records = await readAttorneyProfileSourceRecords(siteId, localeInput);
  return records.find((record) => record.slug === slug || record.sourceSlug === slug) ?? null;
}

export async function updateAttorneyProfileSourceRecord(
  siteId: string,
  localeInput: string | null | undefined,
  slugInput: string,
  patchInput: AttorneyProfileSourcePatch,
  updatedBy = 'builder-lawyers-api',
): Promise<AttorneyProfileSourceRecord | null> {
  const locale = normalizeLocale(localeInput ?? undefined);
  const site = await readSiteDocument(siteId, locale);
  const overrides = normalizeAttorneyProfileSourceOverrides(site.sourceCollectionOverrides?.attorneyProfiles);
  const currentRecords = mergeAttorneyProfileSourceRecords(overrides, locale);
  const targetSlug = normalizeAttorneyProfileSlug(slugInput);
  const record = currentRecords.find((candidate) => candidate.slug === targetSlug || candidate.sourceSlug === targetSlug);
  if (!record) return null;

  const nextSlug = patchInput.slug === undefined ? record.slug : normalizeAttorneyProfileSlug(patchInput.slug);
  if (!nextSlug) {
    throw new BuilderAttorneyProfileSourceError('Attorney slug is invalid.', ['Slug must be a non-empty URL segment.']);
  }
  const duplicate = currentRecords.find(
    (candidate) =>
      candidate.sourceSlug !== record.sourceSlug &&
      (candidate.slug === nextSlug || candidate.sourceSlug === nextSlug),
  );
  if (duplicate) {
    throw new BuilderAttorneyProfileSourceError('Attorney slug is already in use.', [
      `Slug "${nextSlug}" is already used by ${duplicate.sourceSlug}.`,
    ]);
  }

  const existing = overrides.find((override) => override.sourceSlug === record.sourceSlug);
  const nextOverride = stripEmptyAttorneyProfileSourceOverride({
    ...existing,
    sourceSlug: record.sourceSlug,
    slug: nextSlug === record.sourceSlug ? undefined : nextSlug,
    localized: mergeLocalizedOverride(existing?.localized, patchInput.localized),
    email: normalizeEmail(patchInput.email) ?? existing?.email,
    image: typeof patchInput.image === 'string' && patchInput.image.trim() ? patchInput.image.trim() : existing?.image,
    imageAltText: normalizeImageAltText(patchInput.imageAltText) ?? existing?.imageAltText,
    imageFocalPoint: normalizeImageFocalPoint(patchInput.imageFocalPoint) ?? normalizeImageFocalPoint(existing?.imageFocalPoint),
    updatedAt: new Date().toISOString(),
    updatedBy,
  });
  const nextOverrides = [
    ...overrides.filter((override) => override.sourceSlug !== record.sourceSlug),
    nextOverride,
  ].sort((left, right) => left.sourceSlug.localeCompare(right.sourceSlug));

  site.sourceCollectionOverrides = {
    ...(site.sourceCollectionOverrides ?? {}),
    attorneyProfiles: nextOverrides,
  };
  site.updatedAt = new Date().toISOString();
  await writeSiteDocument(site, { sourceCollectionOverridesUpdated: true });

  return mergeAttorneyProfileSourceRecords(nextOverrides, locale).find(
    (candidate) => candidate.sourceSlug === record.sourceSlug,
  ) ?? null;
}

export async function resetAttorneyProfileSourceRecordOverride(
  siteId: string,
  localeInput: string | null | undefined,
  slugInput: string,
): Promise<AttorneyProfileSourceRecord | null> {
  const locale = normalizeLocale(localeInput ?? undefined);
  const site = await readSiteDocument(siteId, locale);
  const overrides = normalizeAttorneyProfileSourceOverrides(site.sourceCollectionOverrides?.attorneyProfiles);
  const targetSlug = normalizeAttorneyProfileSlug(slugInput);
  const record = mergeAttorneyProfileSourceRecords(overrides, locale).find(
    (candidate) => candidate.slug === targetSlug || candidate.sourceSlug === targetSlug,
  );
  if (!record) return null;

  const nextOverrides = overrides.filter((override) => override.sourceSlug !== record.sourceSlug);
  site.sourceCollectionOverrides = {
    ...(site.sourceCollectionOverrides ?? {}),
    attorneyProfiles: nextOverrides,
  };
  site.updatedAt = new Date().toISOString();
  await writeSiteDocument(site, { sourceCollectionOverridesUpdated: true });

  return mergeAttorneyProfileSourceRecords(nextOverrides, locale).find(
    (candidate) => candidate.sourceSlug === record.sourceSlug,
  ) ?? null;
}

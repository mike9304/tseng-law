import { serviceAreas, type ServiceArea } from '@/data/service-details';
import { DEFAULT_BUILDER_SITE_ID } from '@/lib/builder/constants';
import { readSiteDocument, writeSiteDocument } from '@/lib/builder/site/persistence';
import type { BuilderServiceAreaSourceOverride } from '@/lib/builder/site/types';
import { locales, normalizeLocale, type Locale } from '@/lib/locales';

export interface ServiceAreaSourceRecord extends ServiceArea {
  sourceSlug: string;
  updatedAt?: string;
  updatedBy?: string;
}

export interface ServiceAreaSourcePatch {
  slug?: string;
  title?: Partial<Record<Locale, string>>;
  subtitle?: Partial<Record<Locale, string>>;
  intro?: Partial<Record<Locale, string>>;
  keyPoints?: Partial<Record<Locale, string[]>>;
  columnSlugs?: string[];
}

export class BuilderServiceAreaSourceError extends Error {
  constructor(message: string, public readonly issues: string[] = [message]) {
    super(message);
    this.name = 'BuilderServiceAreaSourceError';
  }
}

export function normalizeServiceAreaSlug(value: string | null | undefined): string {
  if (typeof value !== 'string') return '';
  const normalized = value
    .trim()
    .replace(/^\/+|\/+$/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .toLocaleLowerCase('en-US');
  if (!normalized || normalized.length > 160) return '';
  if (/[/?#\\]/.test(normalized)) return '';
  return normalized;
}

export function mergeServiceAreaSourceRecords(
  overridesInput: readonly BuilderServiceAreaSourceOverride[] | null | undefined,
): ServiceAreaSourceRecord[] {
  const overrides = normalizeServiceAreaSourceOverrides(overridesInput);
  const overridesBySourceSlug = new Map(overrides.map((override) => [override.sourceSlug, override] as const));
  const usedSlugs = new Set<string>();
  const sourceSlugs = new Set(serviceAreas.map((area) => area.slug));

  return serviceAreas.map((area) => {
    const override = overridesBySourceSlug.get(area.slug);
    const overrideSlug = normalizeServiceAreaSlug(override?.slug);
    const candidateSlug = overrideSlug || area.slug;
    const collidesWithAnotherSourceSlug = candidateSlug !== area.slug && sourceSlugs.has(candidateSlug);
    const slug = usedSlugs.has(candidateSlug) || collidesWithAnotherSourceSlug ? area.slug : candidateSlug;
    usedSlugs.add(slug);

    return {
      ...area,
      sourceSlug: area.slug,
      slug,
      title: mergeLocalizedText(area.title, override?.title),
      subtitle: mergeLocalizedText(area.subtitle, override?.subtitle),
      intro: mergeLocalizedText(area.intro, override?.intro),
      keyPoints: mergeLocalizedStringLists(area.keyPoints, override?.keyPoints),
      columnSlugs: override?.columnSlugs?.length ? normalizeSlugList(override.columnSlugs) : area.columnSlugs,
      updatedAt: override?.updatedAt,
      updatedBy: override?.updatedBy,
    };
  });
}

export async function readServiceAreaSourceRecords(
  siteId = DEFAULT_BUILDER_SITE_ID,
  localeInput?: string | null,
): Promise<ServiceAreaSourceRecord[]> {
  const locale = normalizeLocale(localeInput ?? undefined);
  const site = await readSiteDocument(siteId, locale);
  return mergeServiceAreaSourceRecords(site.sourceCollectionOverrides?.serviceAreas);
}

export async function readServiceAreaSourceRecordBySlug(
  siteId: string,
  localeInput: string | null | undefined,
  slugInput: string,
): Promise<ServiceAreaSourceRecord | null> {
  const slug = normalizeServiceAreaSlug(slugInput);
  if (!slug) return null;
  const records = await readServiceAreaSourceRecords(siteId, localeInput);
  return records.find((record) => record.slug === slug || record.sourceSlug === slug) ?? null;
}

export async function updateServiceAreaSourceRecord(
  siteId: string,
  localeInput: string | null | undefined,
  slugInput: string,
  patchInput: ServiceAreaSourcePatch,
  updatedBy = 'builder-services-api',
): Promise<ServiceAreaSourceRecord | null> {
  const locale = normalizeLocale(localeInput ?? undefined);
  const site = await readSiteDocument(siteId, locale);
  const overrides = normalizeServiceAreaSourceOverrides(site.sourceCollectionOverrides?.serviceAreas);
  const currentRecords = mergeServiceAreaSourceRecords(overrides);
  const record = currentRecords.find((candidate) => (
    candidate.slug === normalizeServiceAreaSlug(slugInput) ||
    candidate.sourceSlug === normalizeServiceAreaSlug(slugInput)
  ));
  if (!record) return null;

  const nextSlug = patchInput.slug === undefined
    ? record.slug
    : normalizeServiceAreaSlug(patchInput.slug);
  if (!nextSlug) {
    throw new BuilderServiceAreaSourceError('Service slug is invalid.', ['Slug must be a non-empty URL segment.']);
  }
  const duplicate = currentRecords.find(
    (candidate) =>
      candidate.sourceSlug !== record.sourceSlug &&
      (candidate.slug === nextSlug || candidate.sourceSlug === nextSlug),
  );
  if (duplicate) {
    throw new BuilderServiceAreaSourceError('Service slug is already in use.', [
      `Slug "${nextSlug}" is already used by ${duplicate.sourceSlug}.`,
    ]);
  }

  const existing = overrides.find((override) => override.sourceSlug === record.sourceSlug);
  const nextOverride: BuilderServiceAreaSourceOverride = stripEmptyOverride({
    ...existing,
    sourceSlug: record.sourceSlug,
    slug: nextSlug === record.sourceSlug ? undefined : nextSlug,
    title: mergeOverrideText(existing?.title, patchInput.title),
    subtitle: mergeOverrideText(existing?.subtitle, patchInput.subtitle),
    intro: mergeOverrideText(existing?.intro, patchInput.intro),
    keyPoints: mergeOverrideStringLists(existing?.keyPoints, patchInput.keyPoints),
    columnSlugs: patchInput.columnSlugs ? normalizeSlugList(patchInput.columnSlugs) : existing?.columnSlugs,
    updatedAt: new Date().toISOString(),
    updatedBy,
  });

  const nextOverrides = [
    ...overrides.filter((override) => override.sourceSlug !== record.sourceSlug),
    nextOverride,
  ].sort((left, right) => left.sourceSlug.localeCompare(right.sourceSlug));

  site.sourceCollectionOverrides = {
    ...(site.sourceCollectionOverrides ?? {}),
    serviceAreas: nextOverrides,
  };
  site.updatedAt = new Date().toISOString();
  await writeSiteDocument(site, { sourceCollectionOverridesUpdated: true });

  return mergeServiceAreaSourceRecords(nextOverrides).find(
    (candidate) => candidate.sourceSlug === record.sourceSlug,
  ) ?? null;
}

export async function resetServiceAreaSourceRecordOverride(
  siteId: string,
  localeInput: string | null | undefined,
  slugInput: string,
): Promise<ServiceAreaSourceRecord | null> {
  const locale = normalizeLocale(localeInput ?? undefined);
  const site = await readSiteDocument(siteId, locale);
  const overrides = normalizeServiceAreaSourceOverrides(site.sourceCollectionOverrides?.serviceAreas);
  const record = mergeServiceAreaSourceRecords(overrides).find((candidate) => (
    candidate.slug === normalizeServiceAreaSlug(slugInput) ||
    candidate.sourceSlug === normalizeServiceAreaSlug(slugInput)
  ));
  if (!record) return null;

  const nextOverrides = overrides.filter((override) => override.sourceSlug !== record.sourceSlug);
  site.sourceCollectionOverrides = {
    ...(site.sourceCollectionOverrides ?? {}),
    serviceAreas: nextOverrides,
  };
  site.updatedAt = new Date().toISOString();
  await writeSiteDocument(site, { sourceCollectionOverridesUpdated: true });

  return mergeServiceAreaSourceRecords(nextOverrides).find(
    (candidate) => candidate.sourceSlug === record.sourceSlug,
  ) ?? null;
}

function normalizeServiceAreaSourceOverrides(
  input: readonly BuilderServiceAreaSourceOverride[] | null | undefined,
): BuilderServiceAreaSourceOverride[] {
  if (!Array.isArray(input)) return [];
  const sourceSlugs = new Set(serviceAreas.map((area) => area.slug));
  const seen = new Set<string>();
  const normalized: BuilderServiceAreaSourceOverride[] = [];
  for (const item of input) {
    if (!item || typeof item !== 'object') continue;
    const sourceSlug = normalizeServiceAreaSlug(item.sourceSlug);
    if (!sourceSlugs.has(sourceSlug) || seen.has(sourceSlug)) continue;
    seen.add(sourceSlug);
    normalized.push(stripEmptyOverride({
      sourceSlug,
      slug: normalizeServiceAreaSlug(item.slug) || undefined,
      title: normalizeOverrideText(item.title),
      subtitle: normalizeOverrideText(item.subtitle),
      intro: normalizeOverrideText(item.intro),
      keyPoints: normalizeOverrideStringLists(item.keyPoints),
      columnSlugs: item.columnSlugs ? normalizeSlugList(item.columnSlugs) : undefined,
      updatedAt: typeof item.updatedAt === 'string' ? item.updatedAt : undefined,
      updatedBy: typeof item.updatedBy === 'string' ? item.updatedBy : undefined,
    }));
  }
  return normalized;
}

function mergeLocalizedText(
  base: Record<Locale, string>,
  override: Partial<Record<Locale, string>> | undefined,
): Record<Locale, string> {
  const next = { ...base };
  for (const locale of locales) {
    const value = override?.[locale]?.trim();
    if (value) next[locale] = value;
  }
  return next;
}

function mergeLocalizedStringLists(
  base: Record<Locale, string[]>,
  override: Partial<Record<Locale, string[]>> | undefined,
): Record<Locale, string[]> {
  const next = { ...base };
  for (const locale of locales) {
    const values = normalizeStringList(override?.[locale]);
    if (values.length) next[locale] = values;
  }
  return next;
}

function mergeOverrideText(
  current: Partial<Record<Locale, string>> | undefined,
  patch: Partial<Record<Locale, string>> | undefined,
): Partial<Record<Locale, string>> | undefined {
  return normalizeOverrideText({ ...(current ?? {}), ...(patch ?? {}) });
}

function mergeOverrideStringLists(
  current: Partial<Record<Locale, string[]>> | undefined,
  patch: Partial<Record<Locale, string[]>> | undefined,
): Partial<Record<Locale, string[]>> | undefined {
  return normalizeOverrideStringLists({ ...(current ?? {}), ...(patch ?? {}) });
}

function normalizeOverrideText(input: unknown): Partial<Record<Locale, string>> | undefined {
  if (!input || typeof input !== 'object') return undefined;
  const next: Partial<Record<Locale, string>> = {};
  for (const locale of locales) {
    const value = (input as Partial<Record<Locale, unknown>>)[locale];
    if (typeof value === 'string' && value.trim()) next[locale] = value.trim();
  }
  return Object.keys(next).length ? next : undefined;
}

function normalizeOverrideStringLists(input: unknown): Partial<Record<Locale, string[]>> | undefined {
  if (!input || typeof input !== 'object') return undefined;
  const next: Partial<Record<Locale, string[]>> = {};
  for (const locale of locales) {
    const values = normalizeStringList((input as Partial<Record<Locale, unknown>>)[locale]);
    if (values.length) next[locale] = values;
  }
  return Object.keys(next).length ? next : undefined;
}

function normalizeStringList(input: unknown): string[] {
  if (!Array.isArray(input)) return [];
  return input
    .filter((value): value is string => typeof value === 'string')
    .map((value) => value.trim())
    .filter(Boolean)
    .slice(0, 30);
}

function normalizeSlugList(input: unknown): string[] {
  return [...new Set(normalizeStringList(input).map((value) => normalizeServiceAreaSlug(value)).filter(Boolean))];
}

function stripEmptyOverride(override: BuilderServiceAreaSourceOverride): BuilderServiceAreaSourceOverride {
  return Object.fromEntries(
    Object.entries(override).filter(([, value]) => {
      if (value === undefined) return false;
      if (Array.isArray(value)) return value.length > 0;
      if (value && typeof value === 'object') return Object.keys(value).length > 0;
      return true;
    }),
  ) as BuilderServiceAreaSourceOverride;
}

import {
  attorneyProfiles,
  getAttorneyProfileSlugs,
} from '@/data/attorney-profiles';
import { serviceAreas } from '@/data/service-details';
import {
  resolvePublishedCmsAttorneyItems,
  resolvePublishedCmsServiceItems,
} from '@/lib/builder/site/cms-runtime';
import type {
  BuilderServiceAreaSourceOverride,
  BuilderSiteDocument,
} from '@/lib/builder/site/types';
import type { BuilderAttorneyProfileItem, BuilderServiceItem } from '@/lib/builder/types';
import type { ColumnPost } from '@/lib/columns';
import type { Locale } from '@/lib/locales';

type RuntimeItemSite = Pick<BuilderSiteDocument, 'cmsCollections' | 'sourceCollectionOverrides'>;

export function resolvePublishedServiceRuntimeItems(
  site: RuntimeItemSite,
  locale: Locale,
  posts: readonly ColumnPost[],
): BuilderServiceItem[] | null {
  return resolvePublishedCmsServiceItems(site, locale, [...posts])
    ?? resolveSourceOverrideServiceItems(site, locale, posts);
}

export function resolvePublishedAttorneyRuntimeItems(
  site: RuntimeItemSite,
  locale: Locale,
): BuilderAttorneyProfileItem[] | null {
  return resolvePublishedCmsAttorneyItems(site, locale)
    ?? resolveSourceOverrideAttorneyItems(site, locale);
}

export function resolveSourceOverrideServiceItems(
  site: Pick<BuilderSiteDocument, 'sourceCollectionOverrides'>,
  locale: Locale,
  posts: readonly ColumnPost[],
): BuilderServiceItem[] | null {
  const overrides = site.sourceCollectionOverrides?.serviceAreas;
  if (!overrides?.length) return null;

  const sourceSlugs = new Set(serviceAreas.map((area) => area.slug));
  const usedSlugs = new Set<string>();
  const overridesBySourceSlug = new Map(overrides.map((override) => [override.sourceSlug, override] as const));
  const postsBySlug = new Map(posts.map((post) => [post.slug, post] as const));

  return serviceAreas.map((area) => {
    const override = overridesBySourceSlug.get(area.slug);
    const slug = resolveRuntimeSlug(area.slug, override?.slug, sourceSlugs, usedSlugs);
    return {
      title: readLocalizedText(area.title, override?.title, locale),
      description: readLocalizedText(area.subtitle, override?.subtitle, locale),
      href: `/${locale}/services/${slug}`,
      details: readLocalizedList(area.keyPoints, override?.keyPoints, locale).slice(0, 5),
      relatedColumns: readServiceColumnSlugs(area.columnSlugs, override).map((columnSlug) => ({
        slug: columnSlug,
        title: postsBySlug.get(columnSlug)?.title ?? columnSlug,
      })),
    };
  });
}

export function resolveSourceOverrideAttorneyItems(
  site: Pick<BuilderSiteDocument, 'sourceCollectionOverrides'>,
  locale: Locale,
): BuilderAttorneyProfileItem[] | null {
  const overrides = site.sourceCollectionOverrides?.attorneyProfiles;
  if (!overrides?.length) return null;

  const sourceSlugs = new Set<string>(getAttorneyProfileSlugs());
  const usedSlugs = new Set<string>();
  const overridesBySourceSlug = new Map(overrides.map((override) => [override.sourceSlug, override] as const));

  return getAttorneyProfileSlugs().map((sourceSlug) => {
    const base = attorneyProfiles[locale][sourceSlug];
    const override = overridesBySourceSlug.get(sourceSlug);
    const localized = override?.localized?.[locale];
    const slug = resolveRuntimeSlug(sourceSlug, override?.slug, sourceSlugs, usedSlugs);
    const name = readTrimmedText(localized?.name, base.name);
    const role = readTrimmedText(localized?.role, base.role);

    return {
      slug,
      name,
      role,
      title: readTrimmedText(localized?.title, base.title),
      description: readTrimmedText(localized?.description, base.description),
      email: readTrimmedText(override?.email, base.email),
      image: readTrimmedText(override?.image, base.image),
      imageAltText: readTrimmedText(override?.imageAltText, `${name} ${role}`),
      imageFocalPoint: readRuntimeFocalPoint(override?.imageFocalPoint),
      summary: readOverrideList(localized?.summary, base.summary, 12),
      href: `/${locale}/lawyers/${slug}`,
    };
  });
}

function readLocalizedText(
  base: Record<Locale, string>,
  override: Partial<Record<Locale, string>> | undefined,
  locale: Locale,
): string {
  return readTrimmedText(override?.[locale], base[locale]);
}

function readLocalizedList(
  base: Record<Locale, readonly string[]>,
  override: Partial<Record<Locale, readonly string[]>> | undefined,
  locale: Locale,
): string[] {
  return readOverrideList(override?.[locale], base[locale], 40);
}

function readOverrideList(
  override: readonly string[] | undefined,
  base: readonly string[],
  limit: number,
): string[] {
  const values = override
    ?.map((value) => value.trim())
    .filter((value) => value.length > 0)
    .slice(0, limit);
  return values?.length ? values : [...base];
}

function readRuntimeFocalPoint(input: unknown): { x: number; y: number } {
  if (!input || typeof input !== 'object') return { x: 0.5, y: 0.5 };
  const source = input as { x?: unknown; y?: unknown };
  return {
    x: readRuntimeFocalCoordinate(source.x),
    y: readRuntimeFocalCoordinate(source.y),
  };
}

function readRuntimeFocalCoordinate(input: unknown): number {
  const value = typeof input === 'number' ? input : Number(input);
  if (!Number.isFinite(value)) return 0.5;
  if (value < 0) return 0;
  if (value > 1) return 1;
  return Number(value.toFixed(3));
}

function readServiceColumnSlugs(
  base: readonly string[],
  override: BuilderServiceAreaSourceOverride | undefined,
): string[] {
  return override?.columnSlugs?.length ? readOverrideList(override.columnSlugs, base, 40) : [...base];
}

function readTrimmedText(value: string | undefined, fallback: string): string {
  return value?.trim() || fallback;
}

function resolveRuntimeSlug(
  sourceSlug: string,
  overrideSlug: string | undefined,
  sourceSlugs: ReadonlySet<string>,
  usedSlugs: Set<string>,
): string {
  const candidate = normalizeRuntimeSlug(overrideSlug) || sourceSlug;
  const collidesWithAnotherSourceSlug = candidate !== sourceSlug && sourceSlugs.has(candidate);
  const slug = usedSlugs.has(candidate) || collidesWithAnotherSourceSlug ? sourceSlug : candidate;
  usedSlugs.add(slug);
  return slug;
}

function normalizeRuntimeSlug(value: string | null | undefined): string {
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

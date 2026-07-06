import {
  getAttorneyProfileSlugs,
} from '@/data/attorney-profiles';
import type { BuilderAttorneyProfileSourceOverride } from '@/lib/builder/site/types';
import { isLocale, locales, type Locale } from '@/lib/locales';

export type LocalizedAttorneyPatch = NonNullable<BuilderAttorneyProfileSourceOverride['localized']>[Locale];
export type AttorneyImageFocalPoint = NonNullable<BuilderAttorneyProfileSourceOverride['imageFocalPoint']>;

export function normalizeAttorneyProfileSlug(value: string | null | undefined): string {
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

export function normalizeAttorneyProfileSourceOverrides(
  input: readonly BuilderAttorneyProfileSourceOverride[] | null | undefined,
): BuilderAttorneyProfileSourceOverride[] {
  if (!Array.isArray(input)) return [];
  const sourceSlugs = new Set<string>(getAttorneyProfileSlugs());
  const seen = new Set<string>();
  const normalized: BuilderAttorneyProfileSourceOverride[] = [];
  for (const item of input) {
    if (!item || typeof item !== 'object') continue;
    const sourceSlug = normalizeAttorneyProfileSlug(item.sourceSlug);
    if (!sourceSlugs.has(sourceSlug) || seen.has(sourceSlug)) continue;
    seen.add(sourceSlug);
    normalized.push(stripEmptyAttorneyProfileSourceOverride({
      sourceSlug,
      slug: normalizeAttorneyProfileSlug(item.slug) || undefined,
      localized: normalizeLocalizedOverride(item.localized),
      email: normalizeEmail(item.email),
      image: typeof item.image === 'string' && item.image.trim() ? item.image.trim() : undefined,
      imageAltText: normalizeImageAltText(item.imageAltText),
      imageFocalPoint: normalizeImageFocalPoint(item.imageFocalPoint),
      updatedAt: typeof item.updatedAt === 'string' ? item.updatedAt : undefined,
      updatedBy: typeof item.updatedBy === 'string' ? item.updatedBy : undefined,
    }));
  }
  return normalized;
}

export function mergeLocalizedOverride(
  current: BuilderAttorneyProfileSourceOverride['localized'],
  patch: BuilderAttorneyProfileSourceOverride['localized'],
): BuilderAttorneyProfileSourceOverride['localized'] {
  const merged: Partial<Record<Locale, NonNullable<LocalizedAttorneyPatch>>> = {};
  for (const locale of locales) {
    const currentLocale = current?.[locale];
    const patchLocale = patch?.[locale];
    if (!currentLocale && !patchLocale) continue;
    merged[locale] = {
      ...(currentLocale ?? {}),
      ...(patchLocale ?? {}),
    };
  }
  return normalizeLocalizedOverride(merged);
}

export function normalizeEmail(input: unknown): string | undefined {
  if (typeof input !== 'string') return undefined;
  const value = input.trim();
  if (!value || value.length > 320 || !value.includes('@')) return undefined;
  return value;
}

export function normalizeImageAltText(input: unknown): string | undefined {
  if (typeof input !== 'string') return undefined;
  const value = input.trim();
  return value ? value.slice(0, 180) : undefined;
}

export function buildDefaultAttorneyImageAltText(name: string, role: string): string {
  return [name, role].map((part) => part.trim()).filter(Boolean).join(' ');
}

export function normalizeImageFocalPoint(input: unknown): AttorneyImageFocalPoint | undefined {
  if (!input || typeof input !== 'object') return undefined;
  let x: unknown;
  let y: unknown;
  for (const [key, value] of Object.entries(input)) {
    if (key === 'x') x = value;
    if (key === 'y') y = value;
  }
  return {
    x: normalizeImageFocalCoordinate(x),
    y: normalizeImageFocalCoordinate(y),
  };
}

export function defaultAttorneyImageFocalPoint(): AttorneyImageFocalPoint {
  return { x: 0.5, y: 0.5 };
}

export function normalizeStringList(input: unknown, max: number): string[] {
  if (!Array.isArray(input)) return [];
  return input
    .filter((value): value is string => typeof value === 'string')
    .map((value) => value.trim())
    .filter(Boolean)
    .slice(0, max);
}

export function normalizeProfileLinks(
  input: unknown,
  max: number,
): Array<{ label: string; href: string }> {
  if (!Array.isArray(input)) return [];
  return input
    .filter((value): value is Record<string, unknown> => Boolean(value) && typeof value === 'object')
    .map((value) => ({
      label: typeof value.label === 'string' ? value.label.trim().slice(0, 160) : '',
      href: typeof value.href === 'string' ? value.href.trim().slice(0, 500) : '',
    }))
    .filter((value) => value.label && value.href)
    .slice(0, max);
}

export function stripEmptyAttorneyProfileSourceOverride(
  override: BuilderAttorneyProfileSourceOverride,
): BuilderAttorneyProfileSourceOverride {
  const next: BuilderAttorneyProfileSourceOverride = { sourceSlug: override.sourceSlug };
  if (override.slug) next.slug = override.slug;
  if (override.localized && Object.keys(override.localized).length) next.localized = override.localized;
  if (override.email) next.email = override.email;
  if (override.image) next.image = override.image;
  if (override.imageAltText) next.imageAltText = override.imageAltText;
  if (override.imageFocalPoint) next.imageFocalPoint = override.imageFocalPoint;
  if (override.updatedAt) next.updatedAt = override.updatedAt;
  if (override.updatedBy) next.updatedBy = override.updatedBy;
  return next;
}

function normalizeLocalizedOverride(input: unknown): BuilderAttorneyProfileSourceOverride['localized'] {
  if (!input || typeof input !== 'object') return undefined;
  const next: BuilderAttorneyProfileSourceOverride['localized'] = {};
  for (const [key, value] of Object.entries(input)) {
    if (!isLocale(key)) continue;
    const localized = normalizeLocalizedAttorneyPatch(value);
    if (localized) next[key] = localized;
  }
  return Object.keys(next).length ? next : undefined;
}

function normalizeLocalizedAttorneyPatch(input: unknown): NonNullable<LocalizedAttorneyPatch> | undefined {
  if (!input || typeof input !== 'object') return undefined;
  const localized: NonNullable<LocalizedAttorneyPatch> = {};
  for (const [key, value] of Object.entries(input)) {
    if (key === 'summary') {
      const summary = normalizeStringList(value, 12);
      if (summary.length) localized.summary = summary;
      continue;
    }
    if (key === 'languages') {
      const languages = normalizeStringList(value, 12);
      if (languages.length) localized.languages = languages;
      continue;
    }
    if (key === 'practiceAreas') {
      const practiceAreas = normalizeStringList(value, 24);
      if (practiceAreas.length) localized.practiceAreas = practiceAreas;
      continue;
    }
    if (key === 'internalLinks') {
      const internalLinks = normalizeProfileLinks(value, 20);
      if (internalLinks.length || Array.isArray(value)) localized.internalLinks = internalLinks;
      continue;
    }
    if (typeof value !== 'string' || !value.trim()) continue;
    if (key === 'name') localized.name = value.trim();
    if (key === 'role') localized.role = value.trim();
    if (key === 'title') localized.title = value.trim();
    if (key === 'description') localized.description = value.trim();
  }
  return Object.keys(localized).length ? localized : undefined;
}

function normalizeImageFocalCoordinate(input: unknown): number {
  const value = typeof input === 'number' ? input : Number(input);
  if (!Number.isFinite(value)) return 0.5;
  if (value < 0) return 0;
  if (value > 1) return 1;
  return Number(value.toFixed(3));
}

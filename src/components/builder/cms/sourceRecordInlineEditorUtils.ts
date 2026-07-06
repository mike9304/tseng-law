import type {
  BuilderCollectionId,
  BuilderCollectionRecordLink,
  BuilderCollectionRecordPreview,
} from '@/lib/builder/cms';
import type { Locale } from '@/lib/locales';

export type EditableSourceCollectionId = Extract<BuilderCollectionId, 'service-areas' | 'attorney-profiles'>;

export type SourceRecordDraft = {
  readonly slug: string;
  readonly title: string;
  readonly secondary: string;
  readonly intro: string;
  readonly keyPointsText: string;
  readonly columnSlugs: readonly string[];
  readonly email: string;
  readonly description: string;
  readonly summaryText: string;
  readonly languagesText: string;
  readonly practiceAreasText: string;
  readonly internalLinksText: string;
  readonly image: string;
  readonly imageAltText: string;
  readonly imageFocalX: string;
  readonly imageFocalY: string;
};

export type SourceRecordPayload = {
  readonly ok?: boolean;
  readonly record?: {
    readonly slug?: string;
    readonly title?: Partial<Record<Locale, string>>;
    readonly intro?: Partial<Record<Locale, string>>;
    readonly keyPoints?: Partial<Record<Locale, readonly string[]>>;
    readonly columnSlugs?: readonly string[];
    readonly name?: string;
    readonly email?: string;
    readonly description?: string;
    readonly languages?: readonly string[];
    readonly practiceAreas?: readonly string[];
    readonly internalLinks?: readonly BuilderCollectionRecordLink[];
    readonly image?: string;
    readonly imageAltText?: string;
    readonly imageFocalPoint?: {
      readonly x?: number;
      readonly y?: number;
    };
  };
  readonly slugRedirect?: { readonly status?: string };
  readonly error?: string;
  readonly issues?: readonly string[];
};

const simpleEmailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function toEditableSourceCollectionId(collectionId: BuilderCollectionId): EditableSourceCollectionId | null {
  return collectionId === 'service-areas' || collectionId === 'attorney-profiles' ? collectionId : null;
}

export function createSourceRecordDraft(record: BuilderCollectionRecordPreview): SourceRecordDraft {
  const secondaryParts = record.secondaryLabel.split(' · ').map((part) => part.trim()).filter(Boolean);
  const lastSecondaryPart = secondaryParts[secondaryParts.length - 1] ?? '';
  const hasEmailTail = simpleEmailPattern.test(lastSecondaryPart);
  const secondary = hasEmailTail
    ? secondaryParts.slice(0, -1).join(' · ')
    : secondaryParts[0] ?? '';

  return {
    slug: readRecordSlug(record),
    title: record.primaryLabel,
    secondary,
    intro: record.sourceFields?.intro ?? record.seo.description,
    keyPointsText: (record.sourceFields?.keyPoints ?? []).join('\n'),
    columnSlugs: record.sourceFields?.columnSlugs ?? [],
    email: hasEmailTail ? lastSecondaryPart : '',
    description: record.seo.description,
    summaryText: (record.sourceFields?.summary ?? []).join('\n'),
    languagesText: (record.sourceFields?.languages ?? []).join('\n'),
    practiceAreasText: (record.sourceFields?.practiceAreas ?? []).join('\n'),
    internalLinksText: formatProfileLinksDraft(record.sourceFields?.internalLinks ?? []),
    image: record.seo.image ?? '',
    imageAltText: record.seo.imageAltText ?? defaultSourceImageAltText(record.primaryLabel, secondary),
    imageFocalX: formatFocalDraft(record.seo.imageFocalPoint?.x),
    imageFocalY: formatFocalDraft(record.seo.imageFocalPoint?.y),
  };
}

export function normalizeSlugDraft(value: string): string {
  return value
    .trim()
    .replace(/^\/+|\/+$/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .toLocaleLowerCase('en-US');
}

export function validateSourceRecordDraft(
  collectionId: EditableSourceCollectionId | null,
  draft: SourceRecordDraft,
): string | null {
  const slug = normalizeSlugDraft(draft.slug);
  if (!slug) return 'Slug is required.';
  if (/[/?#\\]/.test(slug) || slug.length > 160) return 'Slug must be one URL segment.';
  if (!draft.title.trim()) return 'Title is required.';
  if (!draft.secondary.trim()) return 'Secondary label is required.';
  if (collectionId === 'service-areas') {
    const keyPoints = readListDraft(draft.keyPointsText);
    if (!draft.intro.trim()) return 'Intro is required.';
    if (draft.intro.trim().length > 4000) return 'Intro must be 4000 characters or fewer.';
    if (!keyPoints.length) return 'At least one key point is required.';
    if (keyPoints.length > 30) return 'Key points must include 30 items or fewer.';
    if (keyPoints.some((value) => value.length > 1200)) {
      return 'Each key point must be 1200 characters or fewer.';
    }
    if (draft.columnSlugs.length > 40) return 'Related columns must include 40 items or fewer.';
  }
  if (collectionId === 'attorney-profiles') {
    const email = draft.email.trim();
    if (!email) return 'Email is required.';
    if (!simpleEmailPattern.test(email) || email.length > 320) return 'Email must be a valid address.';
    if (!draft.description.trim()) return 'Description is required.';
    if (draft.description.trim().length > 1200) return 'Description must be 1200 characters or fewer.';
    const summary = readListDraft(draft.summaryText);
    const languages = readListDraft(draft.languagesText);
    const practiceAreas = readListDraft(draft.practiceAreasText);
    const internalLinks = readProfileLinkDrafts(draft.internalLinksText);
    if (!summary.length) return 'At least one summary item is required.';
    if (summary.length > 12) return 'Summary must include 12 items or fewer.';
    if (summary.some((value) => value.length > 800)) return 'Each summary item must be 800 characters or fewer.';
    if (!languages.length) return 'At least one language is required.';
    if (languages.length > 12) return 'Languages must include 12 items or fewer.';
    if (languages.some((value) => value.length > 80)) return 'Each language must be 80 characters or fewer.';
    if (!practiceAreas.length) return 'At least one practice area is required.';
    if (practiceAreas.length > 24) return 'Practice areas must include 24 items or fewer.';
    if (practiceAreas.some((value) => value.length > 160)) {
      return 'Each practice area must be 160 characters or fewer.';
    }
    if (!internalLinks.ok) return internalLinks.message;
    if (internalLinks.links.length > 20) return 'Internal links must include 20 items or fewer.';
    if (!draft.image.trim()) return 'Image URL is required.';
    if (draft.image.trim().length > 500) return 'Image URL must be 500 characters or fewer.';
    if (!isImageUrlDraft(draft.image)) return 'Image URL must be a relative path or http(s) URL.';
    if (!draft.imageAltText.trim()) return 'Image alt text is required.';
    if (draft.imageAltText.trim().length > 180) return 'Image alt text must be 180 characters or fewer.';
    if (!isFocalDraft(draft.imageFocalX) || !isFocalDraft(draft.imageFocalY)) {
      return 'Image focal point must be between 0 and 1.';
    }
  }
  return null;
}

export function buildSourceRecordEndpoint(
  collectionId: EditableSourceCollectionId,
  recordId: string,
  locale: Locale,
): string {
  const segment = collectionId === 'service-areas' ? 'services' : 'lawyers';
  const params = new URLSearchParams({ locale });
  return `/api/builder/${segment}/${encodeURIComponent(recordId)}?${params.toString()}`;
}

export function buildSourceRecordPatch(
  collectionId: EditableSourceCollectionId,
  locale: Locale,
  draft: SourceRecordDraft,
): Record<string, unknown> {
  if (collectionId === 'service-areas') {
    return {
      slug: normalizeSlugDraft(draft.slug),
      title: localizedTextPatch(locale, draft.title),
      subtitle: localizedTextPatch(locale, draft.secondary),
      intro: localizedTextPatch(locale, draft.intro),
      keyPoints: { [locale]: readListDraft(draft.keyPointsText) },
      columnSlugs: draft.columnSlugs,
    };
  }

  return {
    slug: normalizeSlugDraft(draft.slug),
    email: draft.email.trim(),
    image: draft.image.trim(),
    imageAltText: draft.imageAltText.trim(),
    imageFocalPoint: {
      x: readFocalDraft(draft.imageFocalX),
      y: readFocalDraft(draft.imageFocalY),
    },
    localized: {
      [locale]: {
        name: draft.title.trim(),
        role: draft.secondary.trim(),
        description: draft.description.trim(),
        summary: readListDraft(draft.summaryText),
        languages: readListDraft(draft.languagesText),
        practiceAreas: readListDraft(draft.practiceAreasText),
        internalLinks: readProfileLinkDrafts(draft.internalLinksText).links,
      },
    },
  };
}

function readRecordSlug(record: BuilderCollectionRecordPreview): string {
  const pathParts = record.routePath.split('/').filter(Boolean);
  return decodeURIComponent(pathParts[pathParts.length - 1] ?? record.recordId);
}

function localizedTextPatch(locale: Locale, value: string): Partial<Record<Locale, string>> {
  return { [locale]: value.trim() };
}

function readListDraft(value: string): string[] {
  return value
    .split(/\r?\n/)
    .map((item) => item.trim())
    .filter(Boolean);
}

type ProfileLinkDraftResult =
  | { readonly ok: true; readonly links: BuilderCollectionRecordLink[] }
  | { readonly ok: false; readonly links: []; readonly message: string };

function formatProfileLinksDraft(links: readonly BuilderCollectionRecordLink[]): string {
  return links.map((link) => `${link.label} | ${link.href}`).join('\n');
}

function readProfileLinkDrafts(value: string): ProfileLinkDraftResult {
  const links: BuilderCollectionRecordLink[] = [];
  const lines = value.split(/\r?\n/).map((line) => line.trim()).filter(Boolean);
  for (const line of lines) {
    const separatorIndex = line.indexOf('|');
    if (separatorIndex < 0) {
      return { ok: false, links: [], message: 'Internal links must use "Label | /path" lines.' };
    }
    const label = line.slice(0, separatorIndex).trim();
    const href = line.slice(separatorIndex + 1).trim();
    if (!label || !href) {
      return { ok: false, links: [], message: 'Internal link label and URL are required.' };
    }
    if (label.length > 160) return { ok: false, links: [], message: 'Internal link labels must be 160 characters or fewer.' };
    if (href.length > 500) return { ok: false, links: [], message: 'Internal link URLs must be 500 characters or fewer.' };
    links.push({ label, href });
  }
  return { ok: true, links };
}

function isImageUrlDraft(value: string): boolean {
  const trimmed = value.trim();
  if (trimmed.startsWith('/')) return !/\s/.test(trimmed);
  return /^https?:\/\/\S+$/i.test(trimmed);
}

function defaultSourceImageAltText(title: string, secondary: string): string {
  return [title, secondary].map((part) => part.trim()).filter(Boolean).join(' ');
}

function formatFocalDraft(value: number | undefined): string {
  return String(Number.isFinite(value) ? value : 0.5);
}

function isFocalDraft(value: string): boolean {
  const focal = Number(value);
  return Number.isFinite(focal) && focal >= 0 && focal <= 1;
}

function readFocalDraft(value: string): number {
  return Number(Number(value).toFixed(3));
}

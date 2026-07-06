import type { Locale } from '@/lib/locales';
import type {
  BuilderPageMeta,
  BuilderSeoMetadata,
  BuilderSeoStructuredDataSettings,
  BuilderSiteDocument,
} from '@/lib/builder/site/types';
import { buildSitePageAbsoluteUrl } from '@/lib/builder/site/paths';
import { mergeSeoWithDefaults } from '@/lib/builder/seo/defaults';
import { getSeoValidationCopy, type SeoValidationCopy } from '@/lib/builder/seo/validation-copy';

export const SEO_TITLE_MIN = 30;
export const SEO_TITLE_MAX = 60;
export const SEO_DESCRIPTION_MIN = 120;
export const SEO_DESCRIPTION_MAX = 160;

export type BuilderSeoValidationSeverity = 'blocker' | 'warning' | 'info';

export type BuilderSeoValidationField =
  | 'slug'
  | 'title'
  | 'description'
  | 'canonical'
  | 'ogImage'
  | 'twitterImage'
  | 'additionalMetaTags'
  | 'robots'
  | 'structuredData'
  | 'focusKeyword';

export interface BuilderSeoValidationIssue {
  id: string;
  severity: BuilderSeoValidationSeverity;
  field: BuilderSeoValidationField;
  message: string;
  fixHint?: string;
}

export interface ResolvedStructuredDataSettings {
  legalService: boolean;
  organization: boolean;
  localBusiness: boolean;
  faqPage: 'auto' | 'off';
  breadcrumbList: boolean;
}

export function normalizeStructuredDataSettings(
  settings?: BuilderSeoStructuredDataSettings,
): ResolvedStructuredDataSettings {
  return {
    legalService: settings?.legalService !== false,
    organization: settings?.organization === true,
    localBusiness: settings?.localBusiness === true,
    faqPage: settings?.faqPage === 'off' ? 'off' : 'auto',
    breadcrumbList: settings?.breadcrumbList !== false,
  };
}

export function normalizeSeoSlugInput(input: string): string {
  return input.trim().replace(/^\/+|\/+$/g, '');
}

const BUILDER_SLUG_SEGMENT_PATTERN = '[a-z0-9]+(?:-[a-z0-9]+)*';
const BUILDER_SLUG_PATH_RE = new RegExp(
  `^${BUILDER_SLUG_SEGMENT_PATTERN}(?:/${BUILDER_SLUG_SEGMENT_PATTERN})*$`,
);

export function isValidBuilderSlug(slug: string): boolean {
  return BUILDER_SLUG_PATH_RE.test(slug);
}

export function isAbsoluteHttpUrl(value: string): boolean {
  try {
    const url = new URL(value);
    return url.protocol === 'http:' || url.protocol === 'https:';
  } catch {
    return false;
  }
}

export function isBuilderAssetUrl(value: string): boolean {
  return /^\/api\/builder\/assets\/(?:ko|en|zh-hant)\/[^/?#\\]+$/i.test(value)
    || /^builder\/assets\/(?:ko|en|zh-hant)\/[^/?#\\]+$/i.test(value);
}

export function isSeoImageReference(value: string): boolean {
  return isAbsoluteHttpUrl(value) || isBuilderAssetUrl(value);
}

export function buildDefaultPageCanonical(
  siteUrl: string,
  locale: Locale,
  slug: string,
): string {
  return buildSitePageAbsoluteUrl(siteUrl, locale, slug);
}

function pushLengthIssue(
  issues: BuilderSeoValidationIssue[],
  field: 'title' | 'description',
  value: string,
  min: number,
  max: number,
  copy: SeoValidationCopy,
): void {
  if (!value) {
    issues.push({
      id: `seo-${field}-missing`,
      severity: 'warning',
      field,
      ...copy.lengthMissing(field, min, max),
    });
    return;
  }

  if (value.length < min || value.length > max) {
    issues.push({
      id: `seo-${field}-length`,
      severity: field === 'title' ? 'warning' : 'info',
      field,
      ...copy.lengthOutOfRange(field, min, max, value.length),
    });
  }
}

export function validateBuilderPageSeo(input: {
  page: BuilderPageMeta;
  site?: BuilderSiteDocument | null;
  seo?: BuilderSeoMetadata;
  slug?: string;
  siteUrl?: string;
}): BuilderSeoValidationIssue[] {
  const { page, site } = input;
  const copy = getSeoValidationCopy(page.locale);
  const seo = mergeSeoWithDefaults({
    page: { ...page, seo: input.seo ?? page.seo },
    site,
    siteUrl: input.siteUrl ?? 'https://example.com',
    locale: page.locale,
    seo: input.seo ?? page.seo,
  });
  const slug = normalizeSeoSlugInput(input.slug ?? page.slug ?? '');
  const issues: BuilderSeoValidationIssue[] = [];

  if (page.isHomePage) {
    if (slug) {
      issues.push({
        id: 'seo-home-slug-not-empty',
        severity: 'blocker',
        field: 'slug',
        ...copy.homeSlugNotEmpty,
      });
    }
  } else if (!slug) {
    issues.push({
      id: 'seo-slug-missing',
      severity: 'blocker',
      field: 'slug',
      ...copy.slugMissing,
    });
  } else if (!isValidBuilderSlug(slug)) {
    issues.push({
      id: 'seo-slug-format',
      severity: 'blocker',
      field: 'slug',
      ...copy.slugFormat,
    });
  }

  if (site && site.pages.some((candidate) =>
    candidate.pageId !== page.pageId
    && candidate.locale === page.locale
    && normalizeSeoSlugInput(candidate.slug) === slug
  )) {
    issues.push({
      id: 'seo-slug-duplicate',
      severity: 'blocker',
      field: 'slug',
      ...copy.slugDuplicate,
    });
  }

  pushLengthIssue(issues, 'title', (seo.title ?? '').trim(), SEO_TITLE_MIN, SEO_TITLE_MAX, copy);
  pushLengthIssue(
    issues,
    'description',
    (seo.description ?? '').trim(),
    SEO_DESCRIPTION_MIN,
    SEO_DESCRIPTION_MAX,
    copy,
  );

  const canonical = (seo.canonical ?? '').trim();
  if (canonical) {
    if (!isAbsoluteHttpUrl(canonical)) {
      issues.push({
        id: 'seo-canonical-invalid',
        severity: 'blocker',
        field: 'canonical',
        ...copy.canonicalInvalid,
      });
    } else {
      const parsed = new URL(canonical);
      if (parsed.search || parsed.hash) {
        issues.push({
          id: 'seo-canonical-query',
          severity: 'info',
          field: 'canonical',
          ...copy.canonicalQuery,
        });
      }
      if (input.siteUrl && canonical !== buildDefaultPageCanonical(input.siteUrl, page.locale, slug)) {
        issues.push({
          id: 'seo-canonical-custom',
          severity: 'info',
          field: 'canonical',
          ...copy.canonicalCustom,
        });
      }
    }
  }

  const ogImage = (seo.ogImage ?? '').trim();
  if (ogImage && !isSeoImageReference(ogImage)) {
    issues.push({
      id: 'seo-og-image-invalid',
      severity: 'warning',
      field: 'ogImage',
      ...copy.ogImageInvalid,
    });
  }

  const twitterImage = (seo.twitterImage ?? '').trim();
  if (twitterImage && !isSeoImageReference(twitterImage)) {
    issues.push({
      id: 'seo-twitter-image-invalid',
      severity: 'warning',
      field: 'twitterImage',
      ...copy.twitterImageInvalid,
    });
  }

  const focusKeyword = (seo.focusKeyword ?? '').trim();
  if (focusKeyword.length > 80) {
    issues.push({
      id: 'seo-focus-keyword-length',
      severity: 'warning',
      field: 'focusKeyword',
      ...copy.focusKeywordLength,
    });
  }

  const additionalMetaTags = seo.additionalMetaTags ?? [];
  if (additionalMetaTags.length > 10) {
    issues.push({
      id: 'seo-additional-meta-too-many',
      severity: 'warning',
      field: 'additionalMetaTags',
      ...copy.additionalMetaTooMany,
    });
  }
  const seenMetaNames = new Set<string>();
  for (const tag of additionalMetaTags) {
    const name = tag.name.trim().toLowerCase();
    const content = tag.content.trim();
    if (!name || !content) {
      issues.push({
        id: `seo-additional-meta-empty-${tag.id}`,
        severity: 'warning',
        field: 'additionalMetaTags',
        ...copy.additionalMetaEmpty,
      });
      continue;
    }
    if (!/^[a-z0-9:_-]+$/i.test(name)) {
      issues.push({
        id: `seo-additional-meta-name-${tag.id}`,
        severity: 'warning',
        field: 'additionalMetaTags',
        ...copy.additionalMetaNameInvalid(tag.name),
      });
    }
    if (seenMetaNames.has(name)) {
      issues.push({
        id: `seo-additional-meta-duplicate-${tag.id}`,
        severity: 'info',
        field: 'additionalMetaTags',
        ...copy.additionalMetaDuplicate(tag.name),
      });
    }
    seenMetaNames.add(name);
  }

  if (seo.noIndex || page.noIndex) {
    issues.push({
      id: 'seo-noindex-enabled',
      severity: 'info',
      field: 'robots',
      ...copy.noIndexEnabled,
    });
  }

  if (seo.noFollow) {
    issues.push({
      id: 'seo-nofollow-enabled',
      severity: 'info',
      field: 'robots',
      ...copy.noFollowEnabled,
    });
  }

  const structured = normalizeStructuredDataSettings(seo.structuredData);
  if (!structured.legalService && !structured.organization && !structured.localBusiness && !structured.breadcrumbList && structured.faqPage === 'off') {
    issues.push({
      id: 'seo-structured-data-off',
      severity: 'info',
      field: 'structuredData',
      ...copy.structuredDataOff,
    });
  }

  for (const block of seo.structuredDataBlocks ?? []) {
    if (!block.enabled || !block.json?.trim()) continue;
    try {
      const parsed = JSON.parse(block.json) as unknown;
      if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) {
        issues.push({
          id: `seo-structured-data-object-${block.id}`,
          severity: 'warning',
          field: 'structuredData',
          ...copy.customJsonLdObject(block.label || block.type),
        });
      }
    } catch {
      issues.push({
        id: `seo-structured-data-json-${block.id}`,
        severity: 'warning',
        field: 'structuredData',
        ...copy.customJsonLdInvalid(block.label || block.type),
      });
    }
  }

  return issues;
}

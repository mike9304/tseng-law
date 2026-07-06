import type { Locale } from '@/lib/locales';
import type {
  BuilderPageMeta,
  BuilderSeoDefaults,
  BuilderSeoMetadata,
  BuilderSeoPatternSettings,
  BuilderSeoStructuredDataSettings,
  BuilderSiteDocument,
} from '@/lib/builder/site/types';
import { buildSitePageAbsoluteUrl, buildSitePagePath } from '@/lib/builder/site/paths';
import { resolveBuilderSiteSettings } from '@/lib/builder/site/localized-settings';
import { resolveLocaleSeo } from '@/lib/builder/translations/seo-projection';
import { resolveLocaleSlug } from '@/lib/builder/translations/locale-slug';

export const DEFAULT_BUILDER_SEO_PATTERNS: Required<BuilderSeoPatternSettings> = {
  titleTemplate: '{{pageName}} | {{siteName}}',
  descriptionTemplate: '{{pageName}} 페이지입니다. {{businessName}}의 주요 서비스와 상담 정보를 확인하세요.',
  ogTitleTemplate: '{{titleTag}}',
  ogDescriptionTemplate: '{{metaDescription}}',
  twitterTitleTemplate: '{{titleTag}}',
  twitterDescriptionTemplate: '{{metaDescription}}',
};

const DEFAULT_BUILDER_SEO_PATTERNS_BY_LOCALE: Record<Locale, Required<BuilderSeoPatternSettings>> = {
  ko: DEFAULT_BUILDER_SEO_PATTERNS,
  'zh-hant': {
    ...DEFAULT_BUILDER_SEO_PATTERNS,
    descriptionTemplate: '{{pageName}} 頁面。請查看 {{businessName}} 的主要服務與諮詢資訊。',
  },
  en: {
    ...DEFAULT_BUILDER_SEO_PATTERNS,
    descriptionTemplate: '{{pageName}} page. View key services and consultation information from {{businessName}}.',
  },
};

export function getDefaultBuilderSeoPatterns(locale: Locale): Required<BuilderSeoPatternSettings> {
  return DEFAULT_BUILDER_SEO_PATTERNS_BY_LOCALE[locale];
}

export const DEFAULT_BUILDER_SEO_DEFAULTS: BuilderSeoDefaults = {
  patterns: DEFAULT_BUILDER_SEO_PATTERNS,
  twitterCard: 'summary_large_image',
  noIndex: false,
  noFollow: false,
  structuredData: {
    legalService: true,
    organization: false,
    localBusiness: false,
    faqPage: 'auto',
    breadcrumbList: true,
  },
};

export type SeoPatternVariableKey =
  | 'pageName'
  | 'pageUrl'
  | 'slug'
  | 'siteName'
  | 'businessName'
  | 'businessDescription'
  | 'primaryKeyword'
  | 'locale'
  | 'titleTag'
  | 'metaDescription';

export type SeoPatternContext = Record<SeoPatternVariableKey, string>;

function cleanText(value: unknown): string {
  return typeof value === 'string' ? value.replace(/\s+/g, ' ').trim() : '';
}

function trimToUndefined(value: string | undefined): string | undefined {
  const trimmed = cleanText(value);
  return trimmed || undefined;
}

export function getBuilderSeoDefaults(site?: BuilderSiteDocument | null, locale?: Locale): BuilderSeoDefaults {
  const resolvedLocale = locale ?? site?.locale ?? 'ko';
  const resolvedSettings = resolveBuilderSiteSettings(site?.settings, resolvedLocale);
  const configured = resolvedSettings?.seoDefaults ?? {};
  const defaultPatterns = getDefaultBuilderSeoPatterns(resolvedLocale);
  const patterns = {
    ...defaultPatterns,
    ...(configured.patterns ?? {}),
  };

  return {
    ...DEFAULT_BUILDER_SEO_DEFAULTS,
    ...configured,
    patterns,
    structuredData: {
      ...(DEFAULT_BUILDER_SEO_DEFAULTS.structuredData ?? {}),
      ...(configured.structuredData ?? {}),
    },
    additionalMetaTags: configured.additionalMetaTags ?? [],
    structuredDataBlocks: configured.structuredDataBlocks ?? [],
  };
}

export function getBuilderPageTitle(page: BuilderPageMeta, locale: Locale | string = page.locale): string {
  return page.title[locale as Locale] || page.title.ko || page.title.en || page.slug || 'Untitled';
}

export function buildSeoPatternContext(input: {
  page: BuilderPageMeta;
  site?: BuilderSiteDocument | null;
  siteUrl: string;
  locale: Locale;
  titleTag?: string;
  metaDescription?: string;
}): SeoPatternContext {
  const resolvedSettings = resolveBuilderSiteSettings(input.site?.settings, input.locale);
  const resolvedSeo = resolveLocaleSeo(input.page, input.locale);
  const primaryKeyword = cleanText(resolvedSeo.focusKeyword)
    || cleanText(input.page.seo?.focusKeyword)
    || cleanText(resolvedSettings?.seoChecklist?.keywords?.[0]);
  const businessName = cleanText(resolvedSettings?.seoChecklist?.businessName)
    || cleanText(resolvedSettings?.firmName)
    || cleanText(input.site?.name);
  const pageName = getBuilderPageTitle(input.page, input.locale);
  const effectiveSlug = resolveLocaleSlug(input.page, input.locale);
  const pageUrl = buildSitePageAbsoluteUrl(input.siteUrl, input.locale, effectiveSlug);

  return {
    pageName,
    pageUrl,
    slug: effectiveSlug,
    siteName: cleanText(resolvedSettings?.firmName) || cleanText(input.site?.name) || businessName || 'Site',
    businessName: businessName || cleanText(resolvedSettings?.firmName) || cleanText(input.site?.name) || 'Site',
    businessDescription: cleanText(resolvedSettings?.seoChecklist?.businessName) || businessName || '',
    primaryKeyword,
    locale: input.locale,
    titleTag: cleanText(input.titleTag),
    metaDescription: cleanText(input.metaDescription),
  };
}

export function expandSeoTemplate(template: string | undefined, context: SeoPatternContext): string {
  if (!template) return '';
  return template
    .replace(/\{\{\s*([a-zA-Z0-9:_-]+)\s*\}\}/g, (_match, rawKey: string) => {
      const key = rawKey as SeoPatternVariableKey;
      return context[key] ?? '';
    })
    .replace(/\s+/g, ' ')
    .replace(/\s+\|/g, ' |')
    .replace(/\|\s+/g, '| ')
    .trim();
}

export function buildDefaultSeoMetadata(input: {
  page: BuilderPageMeta;
  site?: BuilderSiteDocument | null;
  siteUrl: string;
  locale: Locale;
}): BuilderSeoMetadata {
  const resolvedSettings = resolveBuilderSiteSettings(input.site?.settings, input.locale);
  const resolvedSeo = resolveLocaleSeo(input.page, input.locale);
  const configured = resolvedSettings?.seoDefaults ?? {};
  const defaultPatterns = getDefaultBuilderSeoPatterns(input.locale);
  const defaults = {
    ...DEFAULT_BUILDER_SEO_DEFAULTS,
    ...configured,
    patterns: {
      ...defaultPatterns,
      ...(configured.patterns ?? {}),
    },
    structuredData: {
      ...(DEFAULT_BUILDER_SEO_DEFAULTS.structuredData ?? {}),
      ...(configured.structuredData ?? {}),
    },
    additionalMetaTags: configured.additionalMetaTags ?? [],
    structuredDataBlocks: configured.structuredDataBlocks ?? [],
  };
  const patterns = defaults.patterns ?? defaultPatterns;
  const titleContext = buildSeoPatternContext(input);
  const title = trimToUndefined(expandSeoTemplate(patterns.titleTemplate, titleContext));
  const descriptionContext = buildSeoPatternContext({ ...input, titleTag: title ?? '' });
  const description = trimToUndefined(expandSeoTemplate(patterns.descriptionTemplate, descriptionContext));
  const socialContext = buildSeoPatternContext({
    ...input,
    titleTag: title ?? '',
    metaDescription: description ?? '',
  });

  return {
    title,
    description,
    ogTitle: trimToUndefined(expandSeoTemplate(patterns.ogTitleTemplate, socialContext)),
    ogDescription: trimToUndefined(expandSeoTemplate(patterns.ogDescriptionTemplate, socialContext)),
    twitterCard: defaults.twitterCard,
    twitterTitle: trimToUndefined(expandSeoTemplate(patterns.twitterTitleTemplate, socialContext)),
    twitterDescription: trimToUndefined(expandSeoTemplate(patterns.twitterDescriptionTemplate, socialContext)),
    noIndex: defaults.noIndex || undefined,
    noFollow: defaults.noFollow || undefined,
    additionalMetaTags: defaults.additionalMetaTags,
    structuredData: defaults.structuredData,
    structuredDataBlocks: defaults.structuredDataBlocks,
    focusKeyword: resolvedSeo.focusKeyword || input.page.seo?.focusKeyword,
  };
}

export function mergeSeoWithDefaults(input: {
  page: BuilderPageMeta;
  site?: BuilderSiteDocument | null;
  siteUrl: string;
  locale: Locale;
  seo?: BuilderSeoMetadata;
}): BuilderSeoMetadata {
  const defaults = buildDefaultSeoMetadata(input);
  const seo = input.seo ?? input.page.seo ?? {};
  return {
    ...defaults,
    ...seo,
    additionalMetaTags: [
      ...(defaults.additionalMetaTags ?? []),
      ...(seo.additionalMetaTags ?? []),
    ],
    structuredData: {
      ...(defaults.structuredData ?? {}),
      ...(seo.structuredData ?? {}),
    },
    structuredDataBlocks: [
      ...(defaults.structuredDataBlocks ?? []),
      ...(seo.structuredDataBlocks ?? []),
    ],
  };
}

export function mergeStructuredDataSettings(
  page: BuilderPageMeta,
  site?: BuilderSiteDocument | null,
): BuilderSeoStructuredDataSettings | undefined {
  const defaults = getBuilderSeoDefaults(site, page.locale);
  return {
    ...(defaults.structuredData ?? {}),
    ...(page.seo?.structuredData ?? {}),
  };
}

export function buildSeoPreviewRows(input: {
  site: BuilderSiteDocument;
  siteUrl: string;
  locale: Locale;
}): Array<{ pageId: string; title: string; description: string; publicPath: string }> {
  return input.site.pages
    .filter((page) => page.locale === input.locale)
    .map((page) => {
      const merged = mergeSeoWithDefaults({
        page,
        site: input.site,
        siteUrl: input.siteUrl,
        locale: input.locale,
      });
    return {
      pageId: page.pageId,
      title: merged.title ?? getBuilderPageTitle(page, input.locale),
      description: merged.description ?? '',
      publicPath: buildSitePagePath(page.locale, resolveLocaleSlug(page, input.locale) || ''),
    };
  });
}

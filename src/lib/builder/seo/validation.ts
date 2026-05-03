import type { Locale } from '@/lib/locales';
import type {
  BuilderPageMeta,
  BuilderSeoMetadata,
  BuilderSeoStructuredDataSettings,
  BuilderSiteDocument,
} from '@/lib/builder/site/types';
import { buildSitePageAbsoluteUrl } from '@/lib/builder/site/paths';
import { mergeSeoWithDefaults } from '@/lib/builder/seo/defaults';

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

export function isValidBuilderSlug(slug: string): boolean {
  return /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug);
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
): void {
  const label = field === 'title' ? 'SEO title' : 'SEO description';
  if (!value) {
    issues.push({
      id: `seo-${field}-missing`,
      severity: 'warning',
      field,
      message: `${label} 이 비어 있습니다.`,
      fixHint: field === 'title'
        ? `${SEO_TITLE_MIN}-${SEO_TITLE_MAX}자 사이의 제목을 입력하세요.`
        : `${SEO_DESCRIPTION_MIN}-${SEO_DESCRIPTION_MAX}자 사이의 설명을 입력하세요.`,
    });
    return;
  }

  if (value.length < min || value.length > max) {
    issues.push({
      id: `seo-${field}-length`,
      severity: field === 'title' ? 'warning' : 'info',
      field,
      message: `${label} 길이가 권장 범위(${min}-${max}자)를 벗어났습니다. 현재 ${value.length}자.`,
      fixHint: `${min}-${max}자 사이로 조정하세요.`,
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
        message: 'Home page slug 는 비워야 합니다.',
        fixHint: '홈 페이지는 locale root URL을 사용합니다.',
      });
    }
  } else if (!slug) {
    issues.push({
      id: 'seo-slug-missing',
      severity: 'blocker',
      field: 'slug',
      message: '페이지 slug 가 비어 있습니다.',
      fixHint: '소문자 영문/숫자와 하이픈으로 구성된 slug를 입력하세요.',
    });
  } else if (!isValidBuilderSlug(slug)) {
    issues.push({
      id: 'seo-slug-format',
      severity: 'blocker',
      field: 'slug',
      message: 'Slug 형식이 잘못되었습니다.',
      fixHint: '소문자 영문/숫자와 하이픈만 사용할 수 있습니다.',
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
      message: '같은 locale 안에 동일한 slug 를 쓰는 페이지가 있습니다.',
      fixHint: '다른 페이지와 겹치지 않는 slug를 입력하세요.',
    });
  }

  pushLengthIssue(issues, 'title', (seo.title ?? '').trim(), SEO_TITLE_MIN, SEO_TITLE_MAX);
  pushLengthIssue(
    issues,
    'description',
    (seo.description ?? '').trim(),
    SEO_DESCRIPTION_MIN,
    SEO_DESCRIPTION_MAX,
  );

  const canonical = (seo.canonical ?? '').trim();
  if (canonical) {
    if (!isAbsoluteHttpUrl(canonical)) {
      issues.push({
        id: 'seo-canonical-invalid',
        severity: 'blocker',
        field: 'canonical',
        message: 'Canonical URL 은 http 또는 https 절대 URL이어야 합니다.',
        fixHint: '예: https://example.com/ko/page-slug',
      });
    } else {
      const parsed = new URL(canonical);
      if (parsed.search || parsed.hash) {
        issues.push({
          id: 'seo-canonical-query',
          severity: 'info',
          field: 'canonical',
          message: 'Canonical URL 에 query string 또는 hash 가 포함되어 있습니다.',
          fixHint: '대표 URL은 query/hash 없이 저장하는 것을 권장합니다.',
        });
      }
      if (input.siteUrl && canonical !== buildDefaultPageCanonical(input.siteUrl, page.locale, slug)) {
        issues.push({
          id: 'seo-canonical-custom',
          severity: 'info',
          field: 'canonical',
          message: '기본 public URL과 다른 canonical URL을 사용 중입니다.',
          fixHint: '중복 콘텐츠를 의도적으로 통합할 때만 custom canonical을 사용하세요.',
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
      message: 'OG image URL 형식이 올바르지 않습니다.',
      fixHint: 'https URL 또는 builder asset URL을 사용하세요.',
    });
  }

  const twitterImage = (seo.twitterImage ?? '').trim();
  if (twitterImage && !isSeoImageReference(twitterImage)) {
    issues.push({
      id: 'seo-twitter-image-invalid',
      severity: 'warning',
      field: 'twitterImage',
      message: 'Twitter image URL 형식이 올바르지 않습니다.',
      fixHint: 'https URL 또는 builder asset URL을 사용하세요.',
    });
  }

  const focusKeyword = (seo.focusKeyword ?? '').trim();
  if (focusKeyword.length > 80) {
    issues.push({
      id: 'seo-focus-keyword-length',
      severity: 'warning',
      field: 'focusKeyword',
      message: 'Focus keyword 가 너무 깁니다.',
      fixHint: '80자 이하의 핵심 검색어 하나를 사용하세요.',
    });
  }

  const additionalMetaTags = seo.additionalMetaTags ?? [];
  if (additionalMetaTags.length > 10) {
    issues.push({
      id: 'seo-additional-meta-too-many',
      severity: 'warning',
      field: 'additionalMetaTags',
      message: 'Additional meta tag 는 최대 10개를 권장합니다.',
      fixHint: '중요한 verification/rich result 태그만 남기세요.',
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
        message: 'Additional meta tag 에 빈 name 또는 content 가 있습니다.',
        fixHint: '비어 있는 additional meta tag는 삭제하거나 값을 입력하세요.',
      });
      continue;
    }
    if (!/^[a-z0-9:_-]+$/i.test(name)) {
      issues.push({
        id: `seo-additional-meta-name-${tag.id}`,
        severity: 'warning',
        field: 'additionalMetaTags',
        message: `Additional meta tag name 형식이 올바르지 않습니다: ${tag.name}`,
        fixHint: '영문, 숫자, 콜론, 밑줄, 하이픈만 사용하세요.',
      });
    }
    if (seenMetaNames.has(name)) {
      issues.push({
        id: `seo-additional-meta-duplicate-${tag.id}`,
        severity: 'info',
        field: 'additionalMetaTags',
        message: `동일한 additional meta tag name 이 중복되었습니다: ${tag.name}`,
        fixHint: '중복된 태그가 의도된 것이 아니라면 하나만 남기세요.',
      });
    }
    seenMetaNames.add(name);
  }

  if (seo.noIndex || page.noIndex) {
    issues.push({
      id: 'seo-noindex-enabled',
      severity: 'info',
      field: 'robots',
      message: '이 페이지는 noindex 상태입니다.',
      fixHint: '검색 결과에 노출하려면 index를 켜세요.',
    });
  }

  if (seo.noFollow) {
    issues.push({
      id: 'seo-nofollow-enabled',
      severity: 'info',
      field: 'robots',
      message: '이 페이지는 nofollow 상태입니다.',
      fixHint: '페이지 내 링크 신호를 전달하려면 follow를 켜세요.',
    });
  }

  const structured = normalizeStructuredDataSettings(seo.structuredData);
  if (!structured.legalService && !structured.organization && !structured.localBusiness && !structured.breadcrumbList && structured.faqPage === 'off') {
    issues.push({
      id: 'seo-structured-data-off',
      severity: 'info',
      field: 'structuredData',
      message: '이 페이지의 구조화 데이터가 모두 꺼져 있습니다.',
      fixHint: '검색 결과 확장 노출을 원하면 필요한 schema를 켜세요.',
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
          message: `Custom JSON-LD "${block.label || block.type}" 는 object 형태여야 합니다.`,
          fixHint: 'JSON-LD는 {"@context":"https://schema.org","@type":"..."} 형태로 입력하세요.',
        });
      }
    } catch {
      issues.push({
        id: `seo-structured-data-json-${block.id}`,
        severity: 'warning',
        field: 'structuredData',
        message: `Custom JSON-LD "${block.label || block.type}" 의 JSON 형식이 올바르지 않습니다.`,
        fixHint: '저장 전에 JSON 문법을 확인하세요.',
      });
    }
  }

  return issues;
}

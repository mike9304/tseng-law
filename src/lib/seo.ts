import type { Metadata } from 'next';
import type { Locale, SiteLocale } from '@/lib/locales';
import { defaultLocale, siteLocales } from '@/lib/locales';
import { isEnglishNoindexPath } from '@/lib/seo-visibility';

type ImageInput =
  | string
  | {
      url: string;
      width?: number;
      height?: number;
      alt?: string;
    };

type SeoMetadataInput = {
  locale: Locale | SiteLocale;
  title: string;
  description: string;
  path?: string;
  keywords?: string[];
  images?: ImageInput | ImageInput[];
  noindex?: boolean;
  type?: 'website' | 'article';
  alternateLocales?: readonly (Locale | SiteLocale)[];
};

type BreadcrumbItem = {
  name: string;
  path: string;
};

type ArticleJsonLdInput = {
  locale: SiteLocale;
  title: string;
  description: string;
  path: string;
  image?: string;
  datePublished?: string;
  dateModified?: string;
  authorName: string;
  authorUrl?: string;
  authorSameAs?: string[];
  authorAlternateNames?: string[];
  articleSection?: string;
};

type PersonProfileJsonLdInput = {
  locale: SiteLocale;
  path: string;
  name: string;
  alternateName?: string[];
  description: string;
  image?: string;
  email?: string;
  jobTitle?: string;
  sameAs?: string[];
  knowsLanguage?: string[];
  knowsAbout?: string[];
  alumniOf?: string[];
};

type CollectionPageJsonLdInput = {
  locale: SiteLocale;
  path: string;
  name: string;
  description?: string;
  items: Array<{
    name: string;
    path: string;
    description?: string;
  }>;
};

type FaqJsonLdItem = {
  q: string;
  a: string;
};

const DEFAULT_SITE_URL = 'https://tseng-law.com';
const DEFAULT_SOCIAL_IMAGE = '/images/header-skyline-ratio.webp';
const LOGO_IMAGE = '/images/brand/hovering-seal-red-512.png';
const ORGANIZATION_ID = 'https://tseng-law.com/#organization';

const organizationName: Record<SiteLocale, string> = {
  ko: '법무법인 호정',
  'zh-hant': '昊鼎國際法律事務所',
  en: 'Hovering International Law Firm',
  ja: '昊鼎国際法律事務所',
};

const organizationAlternateNames = ['법무법인 호정', '昊鼎國際法律事務所', 'Hovering International Law Firm', 'Tseng Law', '昊鼎国際法律事務所'];

const openGraphLocale: Record<SiteLocale, string> = {
  ko: 'ko_KR',
  'zh-hant': 'zh_TW',
  en: 'en_US',
  ja: 'ja_JP',
};

const organizationLanguageTags = ['ko', 'zh-Hant', 'en', 'ja'];
const organizationAddress: Record<Locale, string> = {
  ko: '타이베이시 다퉁구 청더로 1단 35호 7층의2',
  'zh-hant': '台北市大同區承德路一段35號7樓之2',
  en: '7F-2, No. 35, Sec. 1, Chengde Rd., Datong Dist.',
};

export function getSiteUrl(): string {
  const raw =
    process.env.NEXT_PUBLIC_SITE_URL ||
    process.env.SITE_URL ||
    process.env.VERCEL_PROJECT_PRODUCTION_URL ||
    process.env.VERCEL_URL ||
    DEFAULT_SITE_URL;
  const withProtocol = raw.startsWith('http://') || raw.startsWith('https://') ? raw : `https://${raw}`;
  return withProtocol.replace(/\/+$/, '');
}

export function getSearchEngineVerification(): Metadata['verification'] | undefined {
  const naver = process.env.NAVER_SITE_VERIFICATION?.trim();
  const bing = process.env.BING_SITE_VERIFICATION?.trim();
  const google = process.env.GOOGLE_SITE_VERIFICATION?.trim();

  if (!naver && !bing && !google) return undefined;

  return {
    ...(google ? { google } : {}),
    ...(naver || bing
      ? {
          other: {
            ...(naver ? { 'naver-site-verification': naver } : {}),
            ...(bing ? { 'msvalidate.01': bing } : {}),
          },
        }
      : {}),
  };
}

export function getLocaleLanguageTag(locale: Locale | SiteLocale): string {
  if (locale === 'zh-hant') return 'zh-Hant';
  return locale;
}

export function getLocalizedPath(locale: Locale | SiteLocale, path = ''): string {
  if (!path || path === '/') {
    return `/${locale}`;
  }

  const normalized = path.startsWith('/') ? path : `/${path}`;
  return `/${locale}${normalized}`;
}

export function buildAbsoluteUrl(path = ''): string {
  if (!path) return getSiteUrl();
  if (path.startsWith('http://') || path.startsWith('https://')) return path;
  const normalized = path.startsWith('/') ? path : `/${path}`;
  return `${getSiteUrl()}${normalized}`;
}

function normalizeImages(images?: ImageInput | ImageInput[]) {
  const list = images == null ? [DEFAULT_SOCIAL_IMAGE] : Array.isArray(images) ? images : [images];

  return list.map((item) => {
    if (typeof item === 'string') {
      return { url: buildAbsoluteUrl(item) };
    }
    return {
      ...item,
      url: buildAbsoluteUrl(item.url),
    };
  });
}

export function getLanguageAlternates(
  path = '',
  alternateLocales: readonly (Locale | SiteLocale)[] = siteLocales,
): Record<string, string> {
  // English-noindex routes (e.g. /faq) must never emit an `en` alternate,
  // no matter which alternateLocales the caller passed. x-default stays.
  const effectiveLocales = isEnglishNoindexPath(path)
    ? alternateLocales.filter((locale) => getLocaleLanguageTag(locale).toLowerCase() !== 'en')
    : alternateLocales;
  const entries = effectiveLocales.map((locale) => [getLocaleLanguageTag(locale), buildAbsoluteUrl(getLocalizedPath(locale, path))]);
  return {
    ...Object.fromEntries(entries),
    'x-default': buildAbsoluteUrl(getLocalizedPath(defaultLocale, path)),
  };
}

export function buildSeoMetadata({
  locale,
  title,
  description,
  path = '',
  keywords = [],
  images,
  noindex = false,
  type = 'website',
  alternateLocales = siteLocales,
}: SeoMetadataInput): Metadata {
  const canonicalPath = getLocalizedPath(locale, path);
  const canonicalUrl = buildAbsoluteUrl(canonicalPath);
  const socialImages = normalizeImages(images);

  return {
    metadataBase: new URL(getSiteUrl()),
    title,
    description,
    keywords,
    other: {
      'content-language': getLocaleLanguageTag(locale),
    },
    alternates: {
      canonical: canonicalUrl,
      languages: getLanguageAlternates(path, alternateLocales),
    },
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      siteName: organizationName[locale],
      locale: openGraphLocale[locale],
      type,
      images: socialImages,
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: socialImages.map((image) => image.url),
    },
    robots: noindex
      ? {
          index: false,
          follow: false,
          googleBot: {
            index: false,
            follow: false,
          },
        }
      : {
          index: true,
          follow: true,
          googleBot: {
            index: true,
            follow: true,
            'max-image-preview': 'large',
            'max-snippet': -1,
            'max-video-preview': -1,
          },
        },
  };
}

export function buildBreadcrumbJsonLd(locale: SiteLocale, items: BreadcrumbItem[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: buildAbsoluteUrl(item.path),
    })),
  };
}

export function buildWebsiteJsonLd(locale: SiteLocale) {
  const websiteUrl = buildAbsoluteUrl(getLocalizedPath(locale));
  const localizedOrganizationName = getOrganizationName(locale);
  const localizedAlternateNames = organizationAlternateNames.filter(
    (name) => name !== localizedOrganizationName && (locale !== 'ja' || name !== organizationName.en),
  );

  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${websiteUrl}#website`,
    name: localizedOrganizationName,
    alternateName: localizedAlternateNames,
    url: websiteUrl,
    inLanguage: getLocaleLanguageTag(locale),
    publisher: {
      '@type': 'Organization',
      '@id': ORGANIZATION_ID,
      name: localizedOrganizationName,
      alternateName: localizedAlternateNames,
      url: websiteUrl,
      logo: {
        '@type': 'ImageObject',
        url: buildAbsoluteUrl(LOGO_IMAGE),
      },
      sameAs: ['https://www.youtube.com/@weilawyer', 'https://blog.naver.com/wei_lawyer/223461663913', 'https://www.threads.com/@lawyer.wei'],
    },
    potentialAction: {
      '@type': 'SearchAction',
      target: `${buildAbsoluteUrl(getLocalizedPath(locale, '/search'))}?q={search_term_string}`,
      'query-input': 'required name=search_term_string',
    },
  };
}

export function buildLegalServiceJsonLd(
  locale: SiteLocale,
  options?: {
    name?: string;
    description?: string;
    path?: string;
    serviceType?: string;
  }
) {
  return {
    '@context': 'https://schema.org',
    '@type': 'LegalService',
    '@id': ORGANIZATION_ID,
    name: options?.name ?? getOrganizationName(locale),
    description: options?.description,
    url: buildAbsoluteUrl(getLocalizedPath(locale, options?.path)),
    serviceType: options?.serviceType,
    telephone: '+82-10-2992-9304',
    email: 'wei@hoveringlaw.com.tw',
    areaServed: ['Taiwan', 'South Korea'],
    knowsLanguage: organizationLanguageTags,
    sameAs: ['https://www.youtube.com/@weilawyer', 'https://blog.naver.com/wei_lawyer/223461663913', 'https://www.threads.com/@lawyer.wei'],
    contactPoint: [
      {
        '@type': 'ContactPoint',
        contactType: 'customer service',
        telephone: '+82-10-2992-9304',
        email: 'wei@hoveringlaw.com.tw',
        availableLanguage: organizationLanguageTags,
        url: buildAbsoluteUrl(getLocalizedPath(locale, '/contact')),
      },
    ],
    employee: {
      '@type': 'Person',
      '@id': `${buildAbsoluteUrl(getLocalizedPath(locale, '/lawyers/wei-tseng'))}#person`,
      name:
        locale === 'ko'
          ? '증준외 변호사'
          : locale === 'zh-hant'
            ? '曾雋崴律師'
            : locale === 'ja'
              ? '曾雋崴弁護士'
              : 'Attorney Wei Tseng',
      url: buildAbsoluteUrl(getLocalizedPath(locale, '/lawyers/wei-tseng')),
    },
    image: buildAbsoluteUrl(DEFAULT_SOCIAL_IMAGE),
    logo: buildAbsoluteUrl(LOGO_IMAGE),
    address: {
      '@type': 'PostalAddress',
      streetAddress: locale === 'ja' ? organizationAddress['zh-hant'] : organizationAddress[locale],
      addressLocality: 'Taipei City',
      addressCountry: 'TW',
    },
  };
}

export function buildArticleJsonLd({
  locale,
  title,
  description,
  path,
  image = DEFAULT_SOCIAL_IMAGE,
  datePublished,
  dateModified,
  authorName,
  authorUrl,
  authorSameAs,
  authorAlternateNames,
  articleSection,
}: ArticleJsonLdInput) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    '@id': `${buildAbsoluteUrl(path)}#article`,
    headline: title,
    description,
    image: [buildAbsoluteUrl(image)],
    datePublished,
    dateModified,
    mainEntityOfPage: buildAbsoluteUrl(path),
    articleSection,
    author: {
      '@type': 'Person',
      '@id': authorUrl ? `${buildAbsoluteUrl(authorUrl)}#person` : undefined,
      name: authorName,
      url: authorUrl ? buildAbsoluteUrl(authorUrl) : undefined,
      sameAs: authorSameAs,
      alternateName: authorAlternateNames,
    },
    publisher: {
      '@type': 'Organization',
      name: organizationName[locale],
      logo: {
        '@type': 'ImageObject',
        url: buildAbsoluteUrl(LOGO_IMAGE),
      },
    },
    inLanguage: getLocaleLanguageTag(locale),
  };
}

export function buildPersonJsonLd({
  locale,
  path,
  name,
  alternateName,
  description,
  image = LOGO_IMAGE,
  email,
  jobTitle,
  sameAs,
  knowsLanguage,
  knowsAbout,
  alumniOf,
}: PersonProfileJsonLdInput) {
  const pageUrl = buildAbsoluteUrl(path);

  const personEntity = {
    '@type': 'Person',
    '@id': `${pageUrl}#person`,
    name,
    alternateName,
    description,
    url: pageUrl,
    image: buildAbsoluteUrl(image),
    email: email ? `mailto:${email}` : undefined,
    jobTitle,
    sameAs,
    knowsLanguage,
    knowsAbout,
    worksFor: {
      '@type': 'Organization',
      name: organizationName[locale],
      url: buildAbsoluteUrl(getLocalizedPath(locale)),
    },
    alumniOf: alumniOf?.map((school) => ({
      '@type': 'CollegeOrUniversity',
      name: school,
    })),
  };

  return {
    '@context': 'https://schema.org',
    ...personEntity,
  };
}

export function buildProfilePageJsonLd({
  locale,
  path,
  name,
  alternateName,
  description,
  image = LOGO_IMAGE,
  email,
  jobTitle,
  sameAs,
  knowsLanguage,
  knowsAbout,
  alumniOf,
}: PersonProfileJsonLdInput) {
  const pageUrl = buildAbsoluteUrl(path);

  return {
    '@context': 'https://schema.org',
    '@type': 'ProfilePage',
    url: pageUrl,
    name,
    inLanguage: getLocaleLanguageTag(locale),
    mainEntity: {
      '@type': 'Person',
      '@id': `${pageUrl}#person`,
      name,
      alternateName,
      description,
      url: pageUrl,
      image: buildAbsoluteUrl(image),
      email: email ? `mailto:${email}` : undefined,
      jobTitle,
      sameAs,
      knowsLanguage,
      knowsAbout,
      worksFor: {
        '@type': 'Organization',
        name: organizationName[locale],
        url: buildAbsoluteUrl(getLocalizedPath(locale)),
      },
      alumniOf: alumniOf?.map((school) => ({
        '@type': 'CollegeOrUniversity',
        name: school,
      })),
    },
  };
}

export function buildCollectionPageJsonLd({
  locale,
  path,
  name,
  description,
  items,
}: CollectionPageJsonLdInput) {
  return {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    url: buildAbsoluteUrl(path),
    name,
    description,
    inLanguage: getLocaleLanguageTag(locale),
    mainEntity: {
      '@type': 'ItemList',
      itemListElement: items.map((item, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        name: item.name,
        url: buildAbsoluteUrl(item.path),
        description: item.description,
      })),
    },
  };
}

export function getOrganizationName(locale: Locale | SiteLocale): string {
  return organizationName[locale];
}

/**
 * Build an `FAQPage` (https://schema.org/FAQPage) JSON-LD object from a list
 * of `{ q, a }` pairs. Used by column detail pages whose frontmatter carries
 * an optional `faq` array, so AI answer engines (ChatGPT / Perplexity / etc.)
 * can cite the firm's own answers.
 *
 * Returns `null` when there are no valid items so callers can skip injecting
 * an empty FAQPage block (Google rich-result eligibility requires ≥1 Q/A).
 */
export function buildFaqJsonLd(items: FaqJsonLdItem[], locale?: SiteLocale) {
  const valid = (Array.isArray(items) ? items : [])
    .filter((item): item is FaqJsonLdItem => Boolean(item && item.q && item.a))
    .map((item) => ({ q: String(item.q), a: String(item.a) }));

  if (valid.length === 0) return null;

  const node: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: valid.map(({ q, a }) => ({
      '@type': 'Question',
      name: q,
      acceptedAnswer: {
        '@type': 'Answer',
        text: a,
      },
    })),
  };

  if (locale) {
    node.inLanguage = getLocaleLanguageTag(locale);
  }

  return node;
}

type HowToStepInput = {
  name: string;
  text: string;
  url?: string;
};

type HowToJsonLdInput = {
  name: string;
  description?: string;
  steps: HowToStepInput[];
  totalTime?: string;
  locale?: Locale | SiteLocale;
};

/**
 * Build a `HowTo` (https://schema.org/HowTo) JSON-LD object from an ordered
 * list of `{ name, text }` steps. Used by SEO hub/guide pages so Google can
 * render a step-by-step rich result. Steps missing a name or text are
 * dropped; `totalTime` (ISO-8601 duration, e.g. "P3M") and `locale` are
 * optional. Returns `null` when no valid steps remain so callers can skip
 * emitting an empty HowTo block.
 */
export function buildHowToJsonLd({ name, description, steps, totalTime, locale }: HowToJsonLdInput) {
  const valid = (Array.isArray(steps) ? steps : [])
    .filter((step): step is HowToStepInput => Boolean(step && step.name && step.text))
    .map((step) => ({
      name: String(step.name),
      text: String(step.text),
      ...(step.url ? { url: String(step.url) } : {}),
    }));

  if (valid.length === 0) return null;

  const node: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name,
    description,
    step: valid.map((step, index) => ({
      '@type': 'HowToStep',
      position: index + 1,
      name: step.name,
      text: step.text,
      ...(step.url ? { url: step.url } : {}),
    })),
  };

  if (totalTime) {
    node.totalTime = totalTime;
  }
  if (locale) {
    node.inLanguage = getLocaleLanguageTag(locale);
  }

  return node;
}

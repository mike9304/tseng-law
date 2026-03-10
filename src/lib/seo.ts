import type { Metadata } from 'next';
import type { Locale } from '@/lib/locales';
import { defaultLocale, locales } from '@/lib/locales';

type ImageInput =
  | string
  | {
      url: string;
      width?: number;
      height?: number;
      alt?: string;
    };

type SeoMetadataInput = {
  locale: Locale;
  title: string;
  description: string;
  path?: string;
  keywords?: string[];
  images?: ImageInput | ImageInput[];
  noindex?: boolean;
  type?: 'website' | 'article';
  alternateLocales?: readonly Locale[];
};

type BreadcrumbItem = {
  name: string;
  path: string;
};

type ArticleJsonLdInput = {
  locale: Locale;
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
  locale: Locale;
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
  locale: Locale;
  path: string;
  name: string;
  description?: string;
  items: Array<{
    name: string;
    path: string;
    description?: string;
  }>;
};

const DEFAULT_SITE_URL = 'https://tseng-law.com';
const DEFAULT_SOCIAL_IMAGE = '/images/header-skyline-ratio.webp';
const LOGO_IMAGE = '/images/brand/hovering-logo-ko.png';

const organizationName: Record<Locale, string> = {
  ko: '법무법인 호정',
  'zh-hant': '昊鼎國際法律事務所',
  en: 'Hovering International Law Firm',
};

const openGraphLocale: Record<Locale, string> = {
  ko: 'ko_KR',
  'zh-hant': 'zh_TW',
  en: 'en_US',
};

const availableLanguage = ['Korean', 'Traditional Chinese', 'English', 'Japanese'];
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

export function getLocaleLanguageTag(locale: Locale): string {
  return locale === 'zh-hant' ? 'zh-Hant' : locale;
}

export function getLocalizedPath(locale: Locale, path = ''): string {
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

export function getLanguageAlternates(path = '', alternateLocales: readonly Locale[] = locales): Record<string, string> {
  const entries = alternateLocales.map((locale) => [getLocaleLanguageTag(locale), buildAbsoluteUrl(getLocalizedPath(locale, path))]);
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
  alternateLocales = locales,
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

export function buildBreadcrumbJsonLd(locale: Locale, items: BreadcrumbItem[]) {
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

export function buildWebsiteJsonLd(locale: Locale) {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: organizationName[locale],
    url: buildAbsoluteUrl(getLocalizedPath(locale)),
    inLanguage: getLocaleLanguageTag(locale),
    potentialAction: {
      '@type': 'SearchAction',
      target: `${buildAbsoluteUrl(getLocalizedPath(locale, '/search'))}?q={search_term_string}`,
      'query-input': 'required name=search_term_string',
    },
  };
}

export function buildLegalServiceJsonLd(
  locale: Locale,
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
    name: options?.name ?? organizationName[locale],
    description: options?.description,
    url: buildAbsoluteUrl(getLocalizedPath(locale, options?.path)),
    serviceType: options?.serviceType,
    telephone: '+82-10-2992-9304',
    email: 'wei@hoveringlaw.com.tw',
    areaServed: ['Taiwan', 'South Korea'],
    availableLanguage,
    sameAs: ['https://www.youtube.com/@weilawyer', 'https://blog.naver.com/wei_lawyer/223461663913'],
    contactPoint: [
      {
        '@type': 'ContactPoint',
        contactType: 'customer service',
        telephone: '+82-10-2992-9304',
        email: 'wei@hoveringlaw.com.tw',
        availableLanguage,
        url: buildAbsoluteUrl(getLocalizedPath(locale, '/contact')),
      },
    ],
    employee: {
      '@type': 'Person',
      '@id': `${buildAbsoluteUrl(getLocalizedPath(locale, '/lawyers/wei-tseng'))}#person`,
      name: locale === 'ko' ? '증준외 변호사' : locale === 'zh-hant' ? '曾俊瑋律師' : 'Attorney Wei Tseng',
      url: buildAbsoluteUrl(getLocalizedPath(locale, '/lawyers/wei-tseng')),
    },
    image: buildAbsoluteUrl(DEFAULT_SOCIAL_IMAGE),
    logo: buildAbsoluteUrl(LOGO_IMAGE),
    address: {
      '@type': 'PostalAddress',
      streetAddress: organizationAddress[locale],
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

export function getOrganizationName(locale: Locale): string {
  return organizationName[locale];
}

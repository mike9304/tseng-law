/**
 * Phase 24 — LegalService / FAQPage / Article schema.org builders (W192).
 *
 * Pure helpers that return JSON-LD payload objects. The existing
 * `structured-data.ts` infra emits these as <script type="application/ld+json">.
 */

export interface LegalServiceJsonLd {
  '@context': 'https://schema.org';
  '@type': 'LegalService';
  name: string;
  url: string;
  areaServed?: string[];
  address?: {
    '@type': 'PostalAddress';
    streetAddress?: string;
    addressLocality?: string;
    postalCode?: string;
    addressCountry?: string;
  };
  telephone?: string;
  openingHours?: string[];
  knowsLanguage?: string[];
}

export interface FaqJsonLd {
  '@context': 'https://schema.org';
  '@type': 'FAQPage';
  mainEntity: Array<{
    '@type': 'Question';
    name: string;
    acceptedAnswer: {
      '@type': 'Answer';
      text: string;
    };
  }>;
}

export interface ArticleJsonLd {
  '@context': 'https://schema.org';
  '@type': 'Article';
  headline: string;
  description?: string;
  datePublished: string;
  dateModified?: string;
  author?: { '@type': 'Person' | 'Organization'; name: string };
  image?: string[];
  inLanguage?: string;
}

export function buildLegalServiceJsonLd(args: {
  name: string;
  url: string;
  areaServed?: string[];
  address?: LegalServiceJsonLd['address'];
  telephone?: string;
  openingHours?: string[];
  knowsLanguage?: string[];
}): LegalServiceJsonLd {
  return {
    '@context': 'https://schema.org',
    '@type': 'LegalService',
    ...args,
  };
}

export function buildFaqJsonLd(items: Array<{ q: string; a: string }>): FaqJsonLd {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map((it) => ({
      '@type': 'Question',
      name: it.q,
      acceptedAnswer: { '@type': 'Answer', text: it.a },
    })),
  };
}

export function buildArticleJsonLd(args: {
  headline: string;
  description?: string;
  datePublished: string;
  dateModified?: string;
  authorName?: string;
  image?: string[];
  inLanguage?: string;
}): ArticleJsonLd {
  const out: ArticleJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: args.headline,
    datePublished: args.datePublished,
  };
  if (args.description) out.description = args.description;
  if (args.dateModified) out.dateModified = args.dateModified;
  if (args.authorName) out.author = { '@type': 'Organization', name: args.authorName };
  if (args.image && args.image.length > 0) out.image = args.image;
  if (args.inLanguage) out.inLanguage = args.inLanguage;
  return out;
}

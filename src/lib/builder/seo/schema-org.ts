/**
 * Phase 9 P9-05 — Schema.org structured data generator.
 *
 * Generates JSON-LD for law firm pages:
 * - LegalService (firm)
 * - Attorney (lawyer profile)
 * - FAQPage (FAQ sections)
 * - Article (blog/column posts)
 * - BreadcrumbList (navigation)
 */

import type { BuilderSiteSettings } from '@/lib/builder/site/types';

export interface SchemaOrgConfig {
  type: 'LegalService' | 'Attorney' | 'FAQPage' | 'Article' | 'BreadcrumbList';
  data: Record<string, unknown>;
}

export function generateLegalServiceSchema(settings: BuilderSiteSettings): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@type': 'LegalService',
    name: settings.firmName || '호정국제 법률사무소',
    telephone: settings.phone,
    email: settings.email,
    address: settings.address
      ? {
          '@type': 'PostalAddress',
          streetAddress: settings.address,
        }
      : undefined,
    url: 'https://tseng-law.com',
    logo: settings.logo,
    openingHours: settings.businessHours,
  };
}

export function generateAttorneySchema(attorney: {
  name: string;
  title: string;
  photo?: string;
  specialties?: string[];
}): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@type': 'Attorney',
    name: attorney.name,
    jobTitle: attorney.title,
    image: attorney.photo,
    knowsAbout: attorney.specialties,
    worksFor: {
      '@type': 'LegalService',
      name: '호정국제 법률사무소',
    },
  };
}

export function generateFAQSchema(items: Array<{ question: string; answer: string }>): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer,
      },
    })),
  };
}

export function generateArticleSchema(article: {
  title: string;
  description?: string;
  datePublished: string;
  dateModified?: string;
  author?: string;
  image?: string;
  url: string;
}): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: article.title,
    description: article.description,
    datePublished: article.datePublished,
    dateModified: article.dateModified || article.datePublished,
    author: article.author
      ? { '@type': 'Person', name: article.author }
      : { '@type': 'Organization', name: '호정국제 법률사무소' },
    image: article.image,
    url: article.url,
    publisher: {
      '@type': 'Organization',
      name: '호정국제 법률사무소',
      url: 'https://tseng-law.com',
    },
  };
}

export function generateBreadcrumbSchema(
  items: Array<{ name: string; url: string }>,
): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

export function schemaToScript(schema: Record<string, unknown>): string {
  return `<script type="application/ld+json">${JSON.stringify(schema)}</script>`;
}

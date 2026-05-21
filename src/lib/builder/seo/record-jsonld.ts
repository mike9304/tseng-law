import { getAttorneyProfile, primaryAttorneySlug } from '@/data/attorney-profiles';
import { getServiceArea } from '@/data/service-details';
import type { BuilderCollectionId } from '@/lib/builder/cms';
import { generateArticleSchema } from '@/lib/builder/seo/schema-org';
import { getColumnPost } from '@/lib/columns';
import { type Locale } from '@/lib/locales';

interface RecordJsonLdInput {
  collectionId: BuilderCollectionId;
  locale: Locale;
  recordSlug: string;
  siteUrl: string;
}

function buildAbsoluteUrl(siteUrl: string, path: string): string {
  const base = siteUrl.replace(/\/+$/, '');
  const cleaned = path.startsWith('/') ? path : `/${path}`;
  return `${base}${cleaned}`;
}

function languageList(locale: Locale): string[] {
  switch (locale) {
    case 'ko':
      return ['Korean', 'Chinese', 'English'];
    case 'zh-hant':
      return ['Chinese', 'Korean', 'English'];
    case 'en':
    default:
      return ['English', 'Korean', 'Chinese'];
  }
}

/**
 * Build a schema.org payload for a single CMS dynamic-item-page record. Returns
 * `null` when the collection/locale/slug combination doesn't resolve a record
 * or when the collection has no curated schema mapping.
 */
export function buildBuilderRecordJsonLd({
  collectionId,
  locale,
  recordSlug,
  siteUrl,
}: RecordJsonLdInput): Record<string, unknown> | null {
  if (!recordSlug) return null;

  switch (collectionId) {
    case 'columns': {
      const post = getColumnPost(recordSlug, locale);
      if (!post) return null;
      return generateArticleSchema({
        title: post.title,
        description: post.summary,
        datePublished: post.date,
        author: post.authorName,
        image: post.featuredImage,
        url: buildAbsoluteUrl(siteUrl, `/${locale}/columns/${post.slug}`),
      });
    }
    case 'service-areas': {
      const area = getServiceArea(recordSlug);
      if (!area) return null;
      const attorney = getAttorneyProfile(locale, primaryAttorneySlug);
      const attorneyName = attorney?.name
        ?? (locale === 'ko' ? '증준외 변호사' : locale === 'zh-hant' ? '曾俊瑋律師' : 'Attorney Wei Tseng');
      return {
        '@context': 'https://schema.org',
        '@type': 'LegalService',
        name: area.title[locale],
        description: area.intro[locale],
        url: buildAbsoluteUrl(siteUrl, `/${locale}/services/${area.slug}`),
        areaServed: 'Taiwan',
        provider: {
          '@type': 'LegalService',
          name: '호정국제 법률사무소',
          url: siteUrl,
        },
        employee: {
          '@type': 'Attorney',
          name: attorneyName,
        },
        availableLanguage: languageList(locale),
        knowsAbout: [area.title[locale], area.subtitle[locale]],
      };
    }
    case 'attorney-profiles': {
      const profile = getAttorneyProfile(locale, recordSlug);
      if (!profile) return null;
      return {
        '@context': 'https://schema.org',
        '@type': 'Attorney',
        name: profile.name,
        jobTitle: profile.title,
        description: profile.description,
        image: profile.image,
        email: profile.email,
        url: buildAbsoluteUrl(siteUrl, `/${locale}/lawyers/${profile.slug}`),
        knowsLanguage: languageList(locale),
        knowsAbout: profile.keywords,
        worksFor: {
          '@type': 'LegalService',
          name: '호정국제 법률사무소',
          url: siteUrl,
        },
      };
    }
    default:
      return null;
  }
}

import type { MetadataRoute } from 'next';
import { serviceAreas } from '@/data/service-details';
import { getAllColumnPosts } from '@/lib/columns';
import { locales } from '@/lib/locales';
import { buildAbsoluteUrl, getLanguageAlternates, getLocalizedPath } from '@/lib/seo';

const STATIC_PATHS = [
  '',
  '/about',
  '/services',
  '/pricing',
  '/reviews',
  '/lawyers',
  '/columns',
  '/videos',
  '/faq',
  '/contact',
  '/privacy',
  '/disclaimer',
  '/accessibility',
] as const;

function createEntry(
  locale: (typeof locales)[number],
  path: string,
  options?: {
    lastModified?: string | Date;
    changeFrequency?: 'daily' | 'weekly' | 'monthly';
    priority?: number;
  }
): MetadataRoute.Sitemap[number] {
  return {
    url: buildAbsoluteUrl(getLocalizedPath(locale, path)),
    lastModified: options?.lastModified ?? new Date(),
    changeFrequency: options?.changeFrequency ?? 'weekly',
    priority: options?.priority ?? 0.8,
    alternates: {
      languages: getLanguageAlternates(path),
    },
  };
}

export default function sitemap(): MetadataRoute.Sitemap {
  const pages: MetadataRoute.Sitemap = [];
  const columns = getAllColumnPosts('ko');

  for (const locale of locales) {
    for (const path of STATIC_PATHS) {
      pages.push(
        createEntry(locale, path, {
          changeFrequency: path === '' ? 'daily' : 'weekly',
          priority: path === '' ? 1 : 0.8,
        })
      );
    }

    for (const area of serviceAreas) {
      pages.push(
        createEntry(locale, `/services/${area.slug}`, {
          changeFrequency: 'monthly',
          priority: 0.72,
        })
      );
    }

    for (const post of columns) {
      pages.push(
        createEntry(locale, `/columns/${post.slug}`, {
          lastModified: post.date ? new Date(post.date) : new Date(),
          changeFrequency: 'monthly',
          priority: 0.68,
        })
      );
    }
  }

  return pages;
}

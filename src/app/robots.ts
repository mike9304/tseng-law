import type { MetadataRoute } from 'next';
import { readSiteDocument } from '@/lib/builder/site/persistence';
import { locales } from '@/lib/locales';
import { getSiteUrl } from '@/lib/seo';

export const dynamic = 'force-dynamic';

/**
 * Production: index everything except API + admin paths, point at
 * `/sitemap.xml`.
 *
 * Preview / non-prod (or when `ROBOTS_DISALLOW_ALL=1`): block everything
 * to keep staging deployments out of search.
 *
 * NoIndex pages from the builder site doc are appended to `disallow`
 * so Google doesn't accidentally crawl password-protected or
 * intentionally hidden pages even if a stray link leaks.
 */
function isPreviewEnvironment(): boolean {
  if (process.env.ROBOTS_DISALLOW_ALL === '1') return true;
  // Vercel preview/development envs are not the production host.
  const env = process.env.VERCEL_ENV;
  return env === 'preview' || env === 'development';
}

async function collectNoIndexPaths(): Promise<string[]> {
  const out: string[] = [];
  for (const locale of locales) {
    try {
      const site = await readSiteDocument('default', locale);
      for (const page of site.pages) {
        if (page.locale !== locale) continue;
        if (!(page.noIndex || page.seo?.noIndex || page.password)) continue;
        const slug = page.slug || '';
        const path = `/${locale}/p/${slug}`.replace(/\/+$/, '') || `/${locale}`;
        out.push(path);
      }
    } catch {
      // Best-effort: if blob is unavailable we still emit a working robots.txt.
    }
  }
  return out;
}

export default async function robots(): Promise<MetadataRoute.Robots> {
  if (isPreviewEnvironment()) {
    return {
      rules: { userAgent: '*', disallow: '/' },
      sitemap: `${getSiteUrl()}/sitemap.xml`,
    };
  }

  const noIndexPaths = await collectNoIndexPaths();
  const disallow = ['/api/', '/admin-builder', '/admin-consultation', ...noIndexPaths];

  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow,
    },
    sitemap: `${getSiteUrl()}/sitemap.xml`,
  };
}

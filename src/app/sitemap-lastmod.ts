import { execFileSync } from 'node:child_process';

export type LastmodOptions = {
  gitLog?: (file: string) => string | null;
  now?: string;
};

const ISO_8601 =
  /^\d{4}-\d{2}-\d{2}(?:T\d{2}:\d{2}:\d{2}(?:\.\d+)?(?:Z|[+-]\d{2}:\d{2}))?$/;

/** Copy-data files that own each STATIC_PATHS entry. */
export const STATIC_PATH_SOURCE_FILES: Record<string, string> = {
  '': 'src/lib/builder/seo/live-route-defaults.ts',
  '/about': 'src/data/page-copy.ts',
  '/services': 'src/data/page-copy.ts',
  '/pricing': 'src/data/page-copy.ts',
  '/lawyers': 'src/data/page-copy.ts',
  '/columns': 'src/data/page-copy.ts',
  '/videos': 'src/data/page-copy.ts',
  '/faq': 'src/data/page-copy.ts',
  '/contact': 'src/data/office-locations.ts',
  '/taiwan-lawyer': 'src/data/intent-pages.ts',
  '/taiwan-company-setup-lawyer': 'src/data/intent-pages.ts',
  '/taiwan-litigation-lawyer': 'src/data/intent-pages.ts',
  '/guides/taiwan-company-setup': 'src/app/[locale]/guides/taiwan-company-setup/content.ts',
  '/korean-lawyer-in-taiwan': 'src/app/[locale]/korean-lawyer-in-taiwan/content.ts',
  '/ai-intake': 'src/app/[locale]/ai-intake/content.ts',
  '/privacy': 'src/data/legal-pages.ts',
  '/disclaimer': 'src/data/legal-pages.ts',
  '/accessibility': 'src/app/[locale]/accessibility/page.tsx',
};

export const ATTORNEY_SITEMAP_SOURCE = 'src/data/attorney-profiles.ts';
export const SERVICE_SITEMAP_SOURCE = 'src/data/service-details.ts';
const FALLBACK_SOURCE = 'src/data/page-copy.ts';

export function readGitCommitIso(filePath: string): string | null {
  try {
    const out = execFileSync('git', ['log', '-1', '--format=%cI', '--', filePath], {
      cwd: process.cwd(),
      encoding: 'utf8',
      timeout: 8000,
      stdio: ['ignore', 'pipe', 'ignore'],
    }).trim();
    return ISO_8601.test(out) ? out : null;
  } catch {
    return null;
  }
}

export function resolveFileLastmod(relativePath: string, options?: LastmodOptions): string {
  const now = options?.now ?? new Date().toISOString();
  const gitLog = options?.gitLog ?? readGitCommitIso;
  return gitLog(relativePath) ?? now;
}

export function resolveStaticPathLastmod(staticPath: string, options?: LastmodOptions): string {
  return resolveFileLastmod(STATIC_PATH_SOURCE_FILES[staticPath] ?? FALLBACK_SOURCE, options);
}

export function createSitemapLastmodResolver(now = new Date().toISOString()) {
  const cache = new Map<string, string>();
  const forFile = (relativePath: string) => {
    const hit = cache.get(relativePath);
    if (hit) return hit;
    const iso = resolveFileLastmod(relativePath, { now });
    cache.set(relativePath, iso);
    return iso;
  };
  return {
    forFile,
    forPath(staticPath: string) {
      return forFile(STATIC_PATH_SOURCE_FILES[staticPath] ?? FALLBACK_SOURCE);
    },
  };
}

export type SitemapLastmodResolver = ReturnType<typeof createSitemapLastmodResolver>;

export function guidancePageKeyToStaticPath(pageKey: string): string {
  return pageKey === 'home' ? '' : `/${pageKey}`;
}

/**
 * Infer lastmod for non-column sitemap paths. Column detail URLs keep their
 * frontmatter dates and must not fall back to a shared copy file.
 */
export function inferSitemapLastmod(
  path: string,
  resolver: SitemapLastmodResolver,
): string | undefined {
  if (path.startsWith('/columns/')) return undefined;
  if (path.startsWith('/services/') && path !== '/services') {
    return resolver.forFile(SERVICE_SITEMAP_SOURCE);
  }
  if (path.startsWith('/lawyers/') && path !== '/lawyers') {
    return resolver.forFile(ATTORNEY_SITEMAP_SOURCE);
  }
  return resolver.forPath(path);
}

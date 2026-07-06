import { buildBuilderPageHref } from '@/lib/builder/hrefs';
import { buildSitePagePath } from '@/lib/builder/site/paths';
import { builderPageKeys, type BuilderPageKey } from '@/lib/builder/types';
import type { Locale } from '@/lib/locales';

type SandboxPreviewPageOption = {
  readonly pageId: string;
  readonly slug: string;
  readonly isHomePage?: boolean;
};

type ResolveSandboxPreviewUrlInput = {
  readonly activePageId: string | null;
  readonly currentSlug: string;
  readonly locale: Locale;
  readonly sitePages: readonly SandboxPreviewPageOption[];
};

function trimSlashes(value: string): string {
  return value.replace(/^\/+|\/+$/g, '');
}

function isBuilderPreviewPageKey(value: string): value is BuilderPageKey {
  return builderPageKeys.includes(value as BuilderPageKey);
}

function resolveBuilderPreviewPageKey(
  page: SandboxPreviewPageOption | undefined,
  currentSlug: string,
): BuilderPageKey | null {
  if (page?.isHomePage) return 'home';
  const slug = trimSlashes(page?.slug ?? currentSlug);
  if (!slug) return 'home';
  if (isBuilderPreviewPageKey(slug)) return slug;
  return null;
}

export function resolveSandboxPreviewUrl({
  activePageId,
  currentSlug,
  locale,
  sitePages,
}: ResolveSandboxPreviewUrlInput): string {
  const currentPage = activePageId ? sitePages.find((page) => page.pageId === activePageId) : undefined;
  const builderPageKey = resolveBuilderPreviewPageKey(currentPage, currentSlug);
  if (builderPageKey) return buildBuilderPageHref(locale, builderPageKey, 'preview');
  return buildSitePagePath(locale, currentPage?.slug ?? currentSlug);
}

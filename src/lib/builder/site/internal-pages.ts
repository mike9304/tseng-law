export interface InternalSandboxPageLike {
  slug: string;
  title?: Record<string, string>;
}

export const INTERNAL_SANDBOX_PAGE_SLUG_PATTERNS: readonly RegExp[] = [
  /^nested-ui-parent-[a-z0-9]+$/i,
  /^visual-dynamic-list-[a-z0-9]+$/i,
  /^dynamic-list-service-runtime-update-[a-z0-9]+$/i,
  /^dataset-(cms-service-preview|field-binding|stale-binding|repeater-authoring|repeater-child-preview|repeater-template)-[a-z0-9]+$/i,
  /^g-editor-[a-z0-9-]+$/i,
  /^manual-save-section-[a-z0-9]+$/i,
  /^save-section-final[a-z0-9-]*$/i,
  /^visual-template-[a-z0-9-]+$/i,
  /^public-animation-[a-z0-9-]+$/i,
  /^visual-saved-drag-[a-z0-9-]+$/i,
  /^nested-container-drop-[a-z0-9-]+$/i,
  /^custom-preview-[a-z0-9-]+$/i,
  /^ui-publish-[a-z0-9-]+$/i,
  /^anchor-menu-widget-[a-z0-9-]+$/i,
  /^unused-[a-z0-9-]+$/i,
  /^db-probe-[a-z0-9-]+$/i,
];

export const INTERNAL_SANDBOX_PAGE_TITLE_PREFIXES: readonly string[] = [
  'Nested UI parent ',
  'Visual dynamic list',
  'CMS service runtime update ',
  'CMS service dataset preview ',
  'Dataset field binding ',
  'Dataset stale binding ',
  'Dataset repeater authoring ',
  'Dataset repeater child preview ',
  'Dataset repeater template ',
  'G Editor UI ',
  'Manual manual-save-section-',
  'Save section final',
];

function normalizeSlug(slug: string | undefined | null): string {
  return (slug ?? '').trim().replace(/^\/+|\/+$/g, '');
}

export function isInternalSandboxPage<T extends InternalSandboxPageLike>(page: T): boolean {
  const slug = normalizeSlug(page.slug);
  if (INTERNAL_SANDBOX_PAGE_SLUG_PATTERNS.some((pattern) => pattern.test(slug))) return true;

  const localizedTitles = Object.values(page.title ?? {})
    .map((title) => (title ?? '').trim())
    .filter(Boolean);
  return localizedTitles.some((title) => (
    INTERNAL_SANDBOX_PAGE_TITLE_PREFIXES.some((prefix) => title.startsWith(prefix))
  ));
}

export function filterPublicPages<T extends InternalSandboxPageLike>(pages: readonly T[]): T[] {
  return pages.filter((page) => !isInternalSandboxPage(page));
}

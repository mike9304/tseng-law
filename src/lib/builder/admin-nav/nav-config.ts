/**
 * M175 — Unified admin navigation configuration.
 *
 * Single source-of-truth for the left rail. Each section is a heading
 * with a list of items. Items may carry a `requirePermission` so the
 * filter helper can collapse the tree before rendering.
 *
 * Hrefs use the locale-prefixed `/admin-builder/...` pattern so the rail
 * can plug into every locale. The actual link rendering composes locale
 * + item.href so the config stays locale-agnostic.
 */

import type { BuilderPermission } from '@/lib/builder/security/permissions';

export type AdminNavBadge = 'beta' | 'new';

export interface AdminNavItem {
  label: string;
  /** Path under `/<locale>/admin-builder` — leading slash required. Example: `/cms`. */
  href: string;
  /** Optional emoji or short glyph rendered before the label. */
  icon?: string;
  badge?: AdminNavBadge;
  requirePermission?: BuilderPermission;
  /** When true the item is exact-matched against the active path. */
  exact?: boolean;
}

export interface AdminNavSection {
  heading: string;
  items: AdminNavItem[];
}

export interface AdminNavQuickLink extends AdminNavItem {
  sectionHeading: string;
}

export interface AdminNavTree {
  sections: AdminNavSection[];
}

export const ADMIN_NAV_TREE: AdminNavTree = {
  sections: [
    {
      heading: '편집',
      items: [
        { label: '빌더 홈', href: '', icon: '🏠', exact: true },
        { label: 'CMS', href: '/cms', icon: '🗂', requirePermission: 'edit-pages' },
        { label: '서비스 소스', href: '/services', icon: '📚', requirePermission: 'edit-pages' },
        { label: '변호사 소스', href: '/lawyers', icon: '⚖️', requirePermission: 'edit-pages' },
        { label: 'AI 생성기', href: '/ai-generator', icon: '✨', badge: 'beta', requirePermission: 'edit-pages' },
        { label: '커스텀 코드', href: '/custom-code', icon: '🧩', requirePermission: 'settings' },
        { label: '번역', href: '/translations', icon: '🌐', requirePermission: 'edit-pages' },
      ],
    },
    {
      heading: '비즈니스',
      items: [
        { label: '커머스', href: '/commerce', icon: '🛍', requirePermission: 'edit-pages' },
        { label: '예약', href: '/bookings', icon: '📅', requirePermission: 'manage-bookings' },
        { label: 'CRM', href: '/crm', icon: '👥', requirePermission: 'manage-contacts' },
        { label: '마케팅', href: '/marketing', icon: '📣', requirePermission: 'manage-campaigns' },
        { label: '폼', href: '/forms', icon: '📝', requirePermission: 'manage-forms' },
        { label: '후기', href: '/reviews', icon: '★', requirePermission: 'manage-forms' },
        { label: '이벤트', href: '/events', icon: '🎫', requirePermission: 'edit-pages' },
      ],
    },
    {
      heading: '워크스페이스',
      items: [
        { label: '워크스페이스', href: '/workspace', icon: '🧭', requirePermission: 'edit-pages' },
        { label: '받은편지함', href: '/inbox', icon: '📬', requirePermission: 'manage-contacts' },
        { label: '앱', href: '/apps', icon: '🧱', requirePermission: 'edit-pages' },
        { label: '검색', href: '/search', icon: '🔍', requirePermission: 'manage-search' },
        { label: 'SEO', href: '/seo', icon: '📈', requirePermission: 'edit-seo' },
      ],
    },
    {
      heading: '개발',
      items: [
        { label: '함수', href: '/_dev/functions', icon: '⚡', badge: 'beta', requirePermission: 'settings' },
        { label: '로그', href: '/_dev/logs', icon: '📜', requirePermission: 'settings' },
        { label: 'SDK', href: '/_dev/sdk', icon: '📦', requirePermission: 'settings' },
        { label: '시크릿', href: '/_dev/secrets', icon: '🔐', badge: 'new', requirePermission: 'settings' },
        { label: '웹훅', href: '/webhooks', icon: '🪝', requirePermission: 'settings' },
      ],
    },
    {
      heading: '운영 / 보안',
      items: [
        { label: 'Ops', href: '/ops', icon: '🛰', requirePermission: 'settings' },
        { label: '백업', href: '/backups', icon: '💾', requirePermission: 'settings' },
        { label: '마이그레이션', href: '/migrations', icon: '🚚', requirePermission: 'settings' },
        { label: '사용자', href: '/members', icon: '🪪', requirePermission: 'manage-users' },
        { label: '감사 로그', href: '/ops?tab=security', icon: '🛡', requirePermission: 'manage-users' },
        { label: '도메인', href: '/domains', icon: '🌍', requirePermission: 'settings' },
      ],
    },
  ],
};

/**
 * Resolve an absolute admin href for a given locale + item href.
 *
 * Example: `adminHref('ko', '/cms')` → `/ko/admin-builder/cms`.
 * `adminHref('ko', '')` → `/ko/admin-builder` (root).
 */
export function adminHref(locale: string, href: string): string {
  const base = `/${locale}/admin-builder`;
  if (!href) return base;
  return `${base}${href.startsWith('/') ? href : `/${href}`}`;
}

function adminPathFromHref(href: string): string {
  const trimmed = href.trim();
  if (!trimmed) return '';

  try {
    const url = new URL(trimmed, 'https://builder.local');
    return `${url.pathname}${url.search}`;
  } catch (error) {
    if (error instanceof TypeError) {
      const [pathWithoutHash = ''] = trimmed.split('#', 1);
      return pathWithoutHash;
    }
    throw error;
  }
}

/**
 * Returns the item that best matches the current pathname. Longer hrefs
 * win so `/cms/collections` matches the CMS item, not the root.
 */
export function findActiveItem(tree: AdminNavTree, locale: string, pathname: string): AdminNavItem | null {
  let best: { item: AdminNavItem; score: number } | null = null;
  const currentPath = adminPathFromHref(pathname);
  for (const section of tree.sections) {
    for (const item of section.items) {
      const fullHref = adminHref(locale, item.href);
      if (item.exact) {
        if (currentPath === fullHref) return item;
        continue;
      }
      if (currentPath === fullHref || currentPath.startsWith(`${fullHref}/`) || currentPath.startsWith(`${fullHref}?`)) {
        const score = fullHref.length;
        if (!best || score > best.score) best = { item, score };
      }
    }
  }
  return best?.item ?? null;
}

export function findActiveAdminNavLink(
  tree: AdminNavTree,
  locale: string,
  pathname: string,
): AdminNavQuickLink | null {
  const item = findActiveItem(tree, locale, pathname);
  if (!item) return null;

  for (const section of tree.sections) {
    if (section.items.includes(item)) {
      return { ...item, sectionHeading: section.heading };
    }
  }

  return null;
}

export interface PermissionPredicate {
  (permission: BuilderPermission): boolean;
}

/**
 * Filter the nav tree by a permission predicate. Items without
 * `requirePermission` are always kept; sections that end up with zero
 * items are dropped.
 */
export function filterAdminNavTree(tree: AdminNavTree, allow: PermissionPredicate): AdminNavTree {
  const sections: AdminNavSection[] = [];
  for (const section of tree.sections) {
    const items = section.items.filter((item) => {
      if (!item.requirePermission) return true;
      return allow(item.requirePermission);
    });
    if (items.length > 0) {
      sections.push({ heading: section.heading, items });
    }
  }
  return { sections };
}

/**
 * Flattens the tree into a section-aware list that can power compact
 * workspace switchers and command palettes.
 */
export function flattenAdminNavTree(tree: AdminNavTree = ADMIN_NAV_TREE): AdminNavQuickLink[] {
  const items: AdminNavQuickLink[] = [];
  for (const section of tree.sections) {
    for (const item of section.items) {
      items.push({ ...item, sectionHeading: section.heading });
    }
  }
  return items;
}

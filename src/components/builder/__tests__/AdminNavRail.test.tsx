import React from 'react';
import { describe, expect, it, vi } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';

vi.mock('next/navigation', () => ({
  usePathname: () => '/ko/admin-builder/cms/collections',
}));

vi.mock('next/link', () => ({
  default: ({ href, children, ...rest }: React.ComponentProps<'a'> & { href: string }) =>
    React.createElement('a', { href, ...rest }, children),
}));

import AdminNavRail from '../AdminNavRail';
import AdminBreadcrumb, { buildAdminBreadcrumb } from '../AdminBreadcrumb';
import {
  ADMIN_NAV_TREE,
  adminHref,
  flattenAdminNavTree,
  findActiveItem,
  filterAdminNavTree,
} from '@/lib/builder/admin-nav/nav-config';
import {
  adminNavHistoryEntryForPath,
  buildRecentAdminNavTrail,
  pushRecentAdminNav,
} from '@/lib/builder/admin-nav/recent-nav';

describe('AdminNavRail', () => {
  it('marks the CMS link active when pathname starts with /admin-builder/cms', () => {
    const html = renderToStaticMarkup(React.createElement(AdminNavRail));
    expect(html).toContain('빌더 관리 내비게이션');
    expect(html).toContain('편집기로 돌아가기');
    expect(html).toContain('빌더 홈');
    expect(html).toContain('data-builder-admin-rail-link="/cms"');
    // The active link is the longest-prefix match — should be /cms.
    const activeMatches = html.match(/data-active="true"/g) ?? [];
    expect(activeMatches.length).toBeGreaterThanOrEqual(1);
    // Active link should reference /ko/admin-builder/cms.
    expect(html).toMatch(/data-builder-admin-rail-link="\/cms"[^>]*data-active="true"/);
  });
});

describe('nav-config helpers', () => {
  it('adminHref composes locale prefix correctly', () => {
    expect(adminHref('ko', '/cms')).toBe('/ko/admin-builder/cms');
    expect(adminHref('en', '')).toBe('/en/admin-builder');
    expect(adminHref('zh-hant', 'workspace')).toBe('/zh-hant/admin-builder/workspace');
  });

  it('findActiveItem chooses the deepest matching href', () => {
    const item = findActiveItem(ADMIN_NAV_TREE, 'ko', '/ko/admin-builder/cms/collections/x');
    expect(item?.href).toBe('/cms');
  });

  it('filterAdminNavTree drops items whose permission is denied', () => {
    const tree = filterAdminNavTree(ADMIN_NAV_TREE, (perm) => perm === 'edit-pages');
    const flat = tree.sections.flatMap((section) => section.items);
    expect(flat.every((item) => !item.requirePermission || item.requirePermission === 'edit-pages')).toBe(true);
  });

  it('flattenAdminNavTree preserves section headings for quick switchers', () => {
    const quickLinks = flattenAdminNavTree(ADMIN_NAV_TREE);
    expect(quickLinks.some((item) => item.sectionHeading === '개발' && item.label === 'SDK')).toBe(true);
    expect(quickLinks.some((item) => item.sectionHeading === '운영 / 보안' && item.href === '/ops')).toBe(true);
  });
});

describe('recent admin navigation helpers', () => {
  it('builds a localized history entry from the current admin path', () => {
    const entry = adminNavHistoryEntryForPath(
      ADMIN_NAV_TREE,
      'zh-hant',
      '/zh-hant/admin-builder/apps',
    );

    expect(entry).toEqual({
      label: '應用程式',
      href: '/zh-hant/admin-builder/apps',
      sectionHeading: '工作區',
    });
  });

  it('deduplicates a visited surface by href while moving it to the front', () => {
    const entries = pushRecentAdminNav([
      { label: 'CMS', href: '/ko/admin-builder/cms', sectionHeading: '편집' },
      { label: '앱', href: '/ko/admin-builder/apps', sectionHeading: '워크스페이스' },
    ], { label: '앱', href: '/ko/admin-builder/apps', sectionHeading: '워크스페이스' });

    expect(entries).toEqual([
      { label: '앱', href: '/ko/admin-builder/apps', sectionHeading: '워크스페이스' },
      { label: 'CMS', href: '/ko/admin-builder/cms', sectionHeading: '편집' },
    ]);
  });

  it('hides the current section even when the current path is deeper', () => {
    const trail = buildRecentAdminNavTrail([
      { label: 'CMS', href: '/ko/admin-builder/cms', sectionHeading: '편집' },
      { label: '앱', href: '/ko/admin-builder/apps', sectionHeading: '워크스페이스' },
    ], '/ko/admin-builder/cms/collections');

    expect(trail).toEqual([
      { label: '앱', href: '/ko/admin-builder/apps', sectionHeading: '워크스페이스' },
    ]);
  });
});

describe('buildAdminBreadcrumb', () => {
  it('returns crumbs for admin-builder sub-paths', () => {
    const crumbs = buildAdminBreadcrumb('/ko/admin-builder/cms/collections/insights');
    expect(crumbs.map((c) => c.label)).toEqual(['빌더', 'CMS', '컬렉션', 'insights']);
    expect(crumbs[crumbs.length - 1].href).toBeNull();
    expect(crumbs[0].href).toBe('/ko/admin-builder');
  });

  it('returns localized crumbs for zh-hant paths', () => {
    const crumbs = buildAdminBreadcrumb('/zh-hant/admin-builder/cms/collections/insights');
    expect(crumbs.map((c) => c.label)).toEqual(['建構器', 'CMS', '集合', 'insights']);
  });

  it('returns empty for non-admin paths', () => {
    expect(buildAdminBreadcrumb('/ko/about')).toEqual([]);
  });

  it.skip('renders nothing on the admin-builder root', () => {
    const html = renderToStaticMarkup(React.createElement(AdminBreadcrumb));
    // Pathname mock returns /ko/admin-builder/cms/collections so it should render.
    expect(html).toContain('CMS');
  });
});

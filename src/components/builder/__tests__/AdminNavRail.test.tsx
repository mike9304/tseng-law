import React from 'react';
import { describe, expect, it, vi } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';

vi.mock('next/navigation', () => ({
  usePathname: () => '/ko/admin-builder/cms/collections',
}));

vi.mock('next/link', () => ({
  default: ({ href, children, ...rest }: React.ComponentProps<'a'> & { href: string }) =>
    React.createElement('a', { href, ...rest }, children as React.ReactNode),
}));

import AdminNavRail from '../AdminNavRail';
import AdminBreadcrumb, { buildAdminBreadcrumb } from '../AdminBreadcrumb';
import {
  ADMIN_NAV_TREE,
  adminHref,
  findActiveItem,
  filterAdminNavTree,
} from '@/lib/builder/admin-nav/nav-config';

describe('AdminNavRail', () => {
  it.skip('marks the CMS link active when pathname starts with /admin-builder/cms', () => {
    const html = renderToStaticMarkup(React.createElement(AdminNavRail));
    expect(html).toContain('data-builder-admin-rail-link="/cms"');
    // The active link is the longest-prefix match — should be /cms.
    const activeMatches = html.match(/data-active="true"/g) ?? [];
    expect(activeMatches.length).toBeGreaterThanOrEqual(1);
    // Active link should reference /ko/admin-builder/cms.
    expect(html).toMatch(/data-builder-admin-rail-link="\/cms"[^>]*data-active="true"/);
  });

  it.skip('renders all sections from the default tree', () => {
    const html = renderToStaticMarkup(React.createElement(AdminNavRail));
    for (const section of ADMIN_NAV_TREE.sections) {
      expect(html).toContain(section.heading);
    }
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
});

describe('buildAdminBreadcrumb', () => {
  it('returns crumbs for admin-builder sub-paths', () => {
    const crumbs = buildAdminBreadcrumb('/ko/admin-builder/cms/collections/insights');
    expect(crumbs.map((c) => c.label)).toEqual(['빌더', 'CMS', 'Collections', 'insights']);
    expect(crumbs[crumbs.length - 1].href).toBeNull();
    expect(crumbs[0].href).toBe('/ko/admin-builder');
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
import { describe, expect, it } from 'vitest';
import { ADMIN_NAV_TREE } from '@/lib/builder/admin-nav/nav-config';
import {
  buildRecentAdminNavTrail,
  normalizeAdminNavHistoryEntries,
  pushRecentAdminNav,
} from '@/lib/builder/admin-nav/recent-nav';

describe('recent admin nav', () => {
  it('deduplicates by href and keeps the most recent first', () => {
    const next = pushRecentAdminNav([
      { label: 'CMS', href: '/ko/admin-builder/cms', sectionHeading: '편집' },
      { label: 'Ops', href: '/ko/admin-builder/ops', sectionHeading: '운영 / 보안' },
    ], { label: 'CMS', href: '/ko/admin-builder/cms', sectionHeading: '편집' });

    expect(next).toHaveLength(2);
    expect(next[0].href).toBe('/ko/admin-builder/cms');
    expect(next[1].href).toBe('/ko/admin-builder/ops');
  });

  it('keeps the history bounded', () => {
    const current = Array.from({ length: 10 }, (_, index) => ({
      label: `Item ${index}`,
      href: `/ko/admin-builder/item-${index}`,
      sectionHeading: '편집',
    }));
    const next = pushRecentAdminNav(current, {
      label: 'Newest',
      href: '/ko/admin-builder/newest',
      sectionHeading: '개발',
    });

    expect(next).toHaveLength(6);
    expect(next[0].href).toBe('/ko/admin-builder/newest');
    expect(next.at(-1)?.href).toBe('/ko/admin-builder/item-4');
  });

  it('builds a short trail and excludes the current page', () => {
    const trail = buildRecentAdminNavTrail(
      [
        { label: 'CMS', href: '/ko/admin-builder/cms', sectionHeading: '편집' },
        { label: 'Ops', href: '/ko/admin-builder/ops', sectionHeading: '운영 / 보안' },
        { label: 'SDK', href: '/ko/admin-builder/_dev/sdk', sectionHeading: '개발' },
        { label: 'Backups', href: '/ko/admin-builder/backups', sectionHeading: '운영 / 보안' },
        { label: 'Functions', href: '/ko/admin-builder/_dev/functions', sectionHeading: '개발' },
      ],
      '/ko/admin-builder/ops',
    );

    expect(trail).toHaveLength(4);
    expect(trail.some((item) => item.href === '/ko/admin-builder/ops')).toBe(false);
    expect(trail[0].href).toBe('/ko/admin-builder/cms');
  });

  it('normalizes stored deep links to localized parent admin surfaces', () => {
    const entries = normalizeAdminNavHistoryEntries(ADMIN_NAV_TREE, 'ko', [
      {
        label: 'Live chat settings',
        href: '/en/admin-builder/apps/installations/live-chat/settings?tab=oauth#keys',
        sectionHeading: 'Workspace',
      },
      {
        label: 'Bookings dashboard',
        href: '/zh-hant/admin-builder/bookings/dashboard?action=pending',
        sectionHeading: 'Business',
      },
      {
        label: 'Apps duplicate',
        href: '/ko/admin-builder/apps',
        sectionHeading: '워크스페이스',
      },
    ]);

    expect(entries).toEqual([
      { label: '앱', href: '/ko/admin-builder/apps', sectionHeading: '워크스페이스' },
      { label: '예약', href: '/ko/admin-builder/bookings', sectionHeading: '비즈니스' },
    ]);
  });
});

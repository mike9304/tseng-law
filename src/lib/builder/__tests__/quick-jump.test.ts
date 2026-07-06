import { describe, expect, it } from 'vitest';
import { ADMIN_NAV_TREE } from '@/lib/builder/admin-nav/nav-config';
import {
  buildAdminQuickJumpGroups,
  buildAdminQuickJumpResults,
  stepAdminQuickJumpIndex,
} from '@/lib/builder/admin-nav/quick-jump';

describe('admin quick jump', () => {
  it('includes recent items first and groups the full tree by section', () => {
    const groups = buildAdminQuickJumpGroups(
      'ko',
      [
        { label: 'Ops', href: '/ko/admin-builder/ops', sectionHeading: '운영 / 보안' },
        { label: 'CMS', href: '/ko/admin-builder/cms', sectionHeading: '편집' },
      ],
      ADMIN_NAV_TREE,
    );

    expect(groups[0].heading).toBe('최근 이동');
    expect(groups[0].items[0].label).toBe('Ops');
    expect(groups.some((group) => group.heading === '개발' && group.items.some((item) => item.label === 'SDK'))).toBe(true);
  });

  it('localizes groups and items for Traditional Chinese', () => {
    const groups = buildAdminQuickJumpGroups(
      'zh-hant',
      [
        { label: '예약', href: '/zh-hant/admin-builder/bookings', sectionHeading: '비즈니스' },
      ],
      ADMIN_NAV_TREE,
    );

    expect(groups[0].heading).toBe('最近瀏覽');
    expect(groups[0].items[0]).toMatchObject({
      label: '預約',
      sectionHeading: '商務',
    });
    expect(groups.some((group) => group.heading === '開發' && group.items.some((item) => item.label === 'SDK'))).toBe(true);
    expect(groups.map((group) => group.heading).join(' ')).not.toMatch(/[\u1100-\u11FF\u3130-\u318F\uAC00-\uD7A3]/);
  });

  it('normalizes cross-locale recent items to the current locale and removes duplicates', () => {
    const groups = buildAdminQuickJumpGroups(
      'ko',
      [
        { label: '應用程式', href: '/zh-hant/admin-builder/apps', sectionHeading: '工作區' },
        { label: 'CMS', href: '/en/admin-builder/cms', sectionHeading: 'Edit' },
      ],
      ADMIN_NAV_TREE,
    );

    const recentGroup = groups.find((group) => group.heading === '최근 이동');
    const hrefs = groups.flatMap((group) => group.items.map((item) => item.href));

    expect(recentGroup?.items).toContainEqual(
      expect.objectContaining({
        label: '앱',
        href: '/ko/admin-builder/apps',
        sectionHeading: '워크스페이스',
      }),
    );
    expect(recentGroup?.items).toContainEqual(
      expect.objectContaining({
        label: 'CMS',
        href: '/ko/admin-builder/cms',
        sectionHeading: '편집',
      }),
    );
    expect(hrefs).not.toContain('/zh-hant/admin-builder/apps');
    expect(hrefs.filter((href) => href === '/ko/admin-builder/apps')).toHaveLength(1);
    expect(hrefs.filter((href) => href === '/ko/admin-builder/cms')).toHaveLength(1);
  });

  it('folds deep recent app settings and dashboard links into their parent surfaces', () => {
    const groups = buildAdminQuickJumpGroups(
      'ko',
      [
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
      ],
      ADMIN_NAV_TREE,
    );

    const recentGroup = groups.find((group) => group.heading === '최근 이동');
    const hrefs = groups.flatMap((group) => group.items.map((item) => item.href));

    expect(recentGroup?.items).toContainEqual(
      expect.objectContaining({
        label: '앱',
        href: '/ko/admin-builder/apps',
        sectionHeading: '워크스페이스',
      }),
    );
    expect(recentGroup?.items).toContainEqual(
      expect.objectContaining({
        label: '예약',
        href: '/ko/admin-builder/bookings',
        sectionHeading: '비즈니스',
      }),
    );
    expect(hrefs).not.toContain('/en/admin-builder/apps/installations/live-chat/settings?tab=oauth#keys');
    expect(hrefs).not.toContain('/zh-hant/admin-builder/bookings/dashboard?action=pending');
    expect(hrefs.filter((href) => href === '/ko/admin-builder/apps')).toHaveLength(1);
    expect(hrefs.filter((href) => href === '/ko/admin-builder/bookings')).toHaveLength(1);
  });

  it('localizes English quick jump labels and keeps query matching useful', () => {
    const groups = buildAdminQuickJumpGroups('en', [], ADMIN_NAV_TREE, 'book');

    expect(groups).toHaveLength(1);
    expect(groups[0].heading).toBe('Business');
    expect(groups[0].items).toEqual([
      expect.objectContaining({
        label: 'Bookings',
        href: '/en/admin-builder/bookings',
        sectionHeading: 'Business',
      }),
    ]);
  });

  it('filters by query across label, href, and section heading', () => {
    const groups = buildAdminQuickJumpGroups('ko', [], ADMIN_NAV_TREE, 'sdk');
    expect(groups).toHaveLength(1);
    expect(groups[0].items.every((item) => item.label === 'SDK')).toBe(true);
  });

  it('flattens groups in render order for keyboard navigation', () => {
    const results = buildAdminQuickJumpResults(
      'ko',
      [
        { label: 'Ops', href: '/ko/admin-builder/ops', sectionHeading: '운영 / 보안' },
      ],
      ADMIN_NAV_TREE,
    );

    expect(results[0]).toMatchObject({ label: 'Ops', groupHeading: '최근 이동' });
    expect(results.some((item) => item.label === 'SDK' && item.groupHeading === '개발')).toBe(true);
    expect(results.findIndex((item) => item.label === 'Ops')).toBe(0);
  });

  it('steps the active index through the result list', () => {
    expect(stepAdminQuickJumpIndex(-1, 'ArrowDown', 3)).toBe(0);
    expect(stepAdminQuickJumpIndex(0, 'ArrowUp', 3)).toBe(0);
    expect(stepAdminQuickJumpIndex(1, 'ArrowUp', 3)).toBe(0);
    expect(stepAdminQuickJumpIndex(1, 'ArrowDown', 3)).toBe(2);
    expect(stepAdminQuickJumpIndex(1, 'Home', 3)).toBe(0);
    expect(stepAdminQuickJumpIndex(1, 'End', 3)).toBe(2);
    expect(stepAdminQuickJumpIndex(1, 'Escape', 3)).toBe(1);
  });
});

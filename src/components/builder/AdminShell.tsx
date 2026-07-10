'use client';

/**
 * M175 — Client-only shell that composes the nav rail + breadcrumb +
 * page content into a flex layout. Kept separate from `layout.tsx` so
 * the layout itself can stay a server component.
 *
 * The rail returns null on `/<locale>/admin-builder` (editor root), so
 * that page keeps full-bleed canvas behaviour. The shell still wraps
 * the children with the same flex container — when the rail is hidden,
 * the content takes the full viewport.
 */

import type { ReactNode } from 'react';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import { useRouter } from 'next/navigation';
import AdminNavRail from './AdminNavRail';
import AdminBreadcrumb from './AdminBreadcrumb';
import NotificationInbox from './notifications/NotificationInbox';
import { normalizeLocale } from '@/lib/locales';
import { ADMIN_NAV_TREE } from '@/lib/builder/admin-nav/nav-config';
import { getAdminNavCopy } from '@/lib/builder/admin-nav/nav-copy';
import {
  adminNavHistoryEntryForPath,
  buildRecentAdminNavTrail,
  normalizeAdminNavHistoryEntries,
  pushRecentAdminNav,
  readRecentAdminNav,
  writeRecentAdminNav,
  type AdminNavHistoryEntry,
} from '@/lib/builder/admin-nav/recent-nav';

interface AdminShellProps {
  children: ReactNode;
}

const ROOT_REGEX = /^\/(ko|en|zh-hant)\/admin-builder\/?$/;

export default function AdminShell({ children }: AdminShellProps) {
  const router = useRouter();
  const pathname = usePathname() ?? '';
  const searchParams = useSearchParams();
  const search = searchParams?.toString() ?? '';
  const currentLocation = search ? `${pathname}?${search}` : pathname;
  const locale = normalizeLocale(pathname.match(/^\/(ko|en|zh-hant)\//)?.[1] ?? 'ko');
  const copy = getAdminNavCopy(locale);
  const onEditorRoot = ROOT_REGEX.test(pathname);
  const [recentNav, setRecentNav] = useState<AdminNavHistoryEntry[]>([]);
  const [usesMobileChromeOffset, setUsesMobileChromeOffset] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const mq = window.matchMedia('(max-width: 899px)');
    const update = () => setUsesMobileChromeOffset(mq.matches);
    update();
    mq.addEventListener('change', update);
    return () => mq.removeEventListener('change', update);
  }, []);

  useEffect(() => {
    const stored = normalizeAdminNavHistoryEntries(ADMIN_NAV_TREE, locale, readRecentAdminNav());
    const currentEntry = adminNavHistoryEntryForPath(ADMIN_NAV_TREE, locale, currentLocation);
    if (!currentEntry) {
      writeRecentAdminNav(stored);
      setRecentNav(stored);
      return;
    }
    const next = pushRecentAdminNav(stored, currentEntry);
    writeRecentAdminNav(next);
    setRecentNav(next);
  }, [locale, currentLocation]);

  const visibleRecentNav = useMemo(
    () => buildRecentAdminNavTrail(recentNav, currentLocation),
    [currentLocation, recentNav],
  );

  const navigateToRecent = useCallback((entry: AdminNavHistoryEntry) => {
    setRecentNav((current) => {
      const next = pushRecentAdminNav(current, entry);
      writeRecentAdminNav(next);
      return next;
    });
    router.push(entry.href);
  }, [router]);

  if (onEditorRoot) {
    return <>{children}</>;
  }

  const mobileChromeOffset = usesMobileChromeOffset ? 116 : 0;

  return (
    <div
      data-builder-admin-shell="true"
      style={{
        background: '#f8fafc',
        boxSizing: 'border-box',
        color: '#0f172a',
        display: 'flex',
        minHeight: '100vh',
        paddingTop: mobileChromeOffset,
        scrollPaddingTop: mobileChromeOffset,
      }}
    >
      <AdminNavRail />
      <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column' }}>
        <div
          style={{
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'space-between',
            padding: '4px 16px 0',
            background: '#f8fafc',
            gap: 16,
          }}
        >
          <div style={{ minWidth: 0, flex: 1, display: 'flex', flexDirection: 'column', gap: 8 }}>
            <AdminBreadcrumb />
            {visibleRecentNav.length > 0 ? (
              <div
                data-builder-admin-recent-nav="true"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  flexWrap: 'wrap',
                  padding: '0 16px 8px',
                  fontSize: 12,
                  color: '#64748b',
                }}
              >
                <span style={{ fontWeight: 700, color: '#0f172a' }}>{copy.recentLabel}</span>
                {visibleRecentNav.map((entry) => (
                  <button
                    key={entry.href}
                    type="button"
                    onClick={() => navigateToRecent(entry)}
                    title={`${entry.sectionHeading} · ${entry.href}`}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 6,
                      border: '1px solid #e2e8f0',
                      borderRadius: 999,
                      background: '#fff',
                      color: '#0f172a',
                      padding: '6px 10px',
                      cursor: 'pointer',
                      lineHeight: 1.2,
                    }}
                  >
                    <span style={{ fontWeight: 700 }}>{entry.label}</span>
                    <span style={{ color: '#94a3b8' }}>·</span>
                    <span>{entry.sectionHeading}</span>
                  </button>
                ))}
              </div>
            ) : null}
          </div>
          <div style={{ marginLeft: 'auto', paddingTop: 8 }}>
            <NotificationInbox locale={locale} />
          </div>
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>{children}</div>
      </div>
    </div>
  );
}

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
import { usePathname } from 'next/navigation';
import AdminNavRail from './AdminNavRail';
import AdminBreadcrumb from './AdminBreadcrumb';

interface AdminShellProps {
  children: ReactNode;
}

const ROOT_REGEX = /^\/(ko|en|zh-hant)\/admin-builder\/?$/;

export default function AdminShell({ children }: AdminShellProps) {
  const pathname = usePathname() ?? '';
  const onEditorRoot = ROOT_REGEX.test(pathname);

  if (onEditorRoot) {
    return <>{children}</>;
  }

  return (
    <div
      data-builder-admin-shell="true"
      style={{ display: 'flex', minHeight: '100vh', background: '#f8fafc', color: '#0f172a' }}
    >
      <AdminNavRail />
      <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column' }}>
        <AdminBreadcrumb />
        <div style={{ flex: 1, minWidth: 0 }}>{children}</div>
      </div>
    </div>
  );
}
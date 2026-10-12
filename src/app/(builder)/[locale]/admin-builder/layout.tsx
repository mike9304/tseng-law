import { Suspense, type ReactNode } from 'react';
import { headers } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';
import { notFound } from 'next/navigation';
import BuilderAdminBackBar from '@/components/builder/BuilderAdminBackBar';
import AdminShell from '@/components/builder/AdminShell';
import {
  ADMIN_NAV_TREE,
  filterAdminNavTree,
  type AdminNavTree,
} from '@/lib/builder/admin-nav/nav-config';
import { requireBuilderAdminAuth } from '@/lib/builder/columns/auth';
import { hasRoleAccess } from '@/lib/builder/security/role-permissions';
import { resolveUserRole } from '@/lib/builder/security/resolve-permission';

async function resolveAdminNavTree(): Promise<AdminNavTree> {
  const requestHeaders = await headers();
  const request = new NextRequest('http://builder.internal/admin-builder', {
    headers: new Headers(requestHeaders),
  });
  const auth = requireBuilderAdminAuth(request);
  if (auth instanceof NextResponse) {
    notFound();
  }
  const role = await resolveUserRole(auth.username);
  return filterAdminNavTree(ADMIN_NAV_TREE, (permission) => hasRoleAccess(role, permission));
}

export default async function AdminBuilderLayout({ children }: { children: ReactNode }) {
  const navTree = await resolveAdminNavTree();
  return (
    <>
      <BuilderAdminBackBar />
      {/* AdminShell/AdminNavRail use useSearchParams(). Keep the fallback empty:
          rendering children here would mount a second editor and overwrite its shared canvas store. */}
      <Suspense fallback={null}>
        <AdminShell navTree={navTree}>{children}</AdminShell>
      </Suspense>
    </>
  );
}

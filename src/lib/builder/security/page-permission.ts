import { headers } from 'next/headers';
import { notFound } from 'next/navigation';
import { NextRequest, NextResponse } from 'next/server';
import { requireBuilderAdminAuth } from '@/lib/builder/columns/auth';
import type { BuilderPermission } from '@/lib/builder/security/permissions';
import { userHasPermission } from '@/lib/builder/security/resolve-permission';

export async function requireBuilderPagePermission(
  permission: BuilderPermission,
): Promise<{ username: string; permission: BuilderPermission }> {
  const requestHeaders = await headers();
  const request = new NextRequest('http://builder.internal/admin-builder', {
    headers: new Headers(requestHeaders),
  });
  const auth = requireBuilderAdminAuth(request);

  if (auth instanceof NextResponse) {
    notFound();
  }

  if (!(await userHasPermission(auth.username, permission))) {
    notFound();
  }

  return { username: auth.username, permission };
}

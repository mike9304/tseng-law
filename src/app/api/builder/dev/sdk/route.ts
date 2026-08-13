/**
 * F107 — Builder SDK docs JSON endpoint.
 *
 * Returns the same structured docs rendered by the admin SDK page so tools
 * and tests can consume the developer surface without scraping HTML.
 */

import { NextRequest, NextResponse } from 'next/server';
import { guardBuilderReadWithPermission } from '@/lib/builder/security/guard';
import { getSdkDocSections } from '@/lib/builder/dev/sdk-docs';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const auth = await guardBuilderReadWithPermission(request, 'settings');
  if (auth instanceof NextResponse) return auth;
  return NextResponse.json({
    ok: true,
    version: 1,
    sections: getSdkDocSections(),
  });
}

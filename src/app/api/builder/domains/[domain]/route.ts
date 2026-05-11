import { NextRequest, NextResponse } from 'next/server';
import { guardMutation } from '@/lib/builder/security/guard';
import { getDomain, makeDomainId, saveDomain } from '@/lib/builder/domains/storage';
import { detachDomain } from '@/lib/builder/domains/vercel-api';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(
  request: NextRequest,
  { params }: { params: { domain: string } },
) {
  const auth = await guardMutation(request, { allowReadOnly: true, permission: 'settings' });
  if (auth instanceof NextResponse) return auth;
  const binding = await getDomain(makeDomainId(params.domain));
  if (!binding) return NextResponse.json({ error: 'Domain not found' }, { status: 404 });
  return NextResponse.json({ ok: true, domain: binding });
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { domain: string } },
) {
  const auth = await guardMutation(request, { permission: 'settings' });
  if (auth instanceof NextResponse) return auth;

  const binding = await getDomain(makeDomainId(params.domain));
  if (!binding) return NextResponse.json({ error: 'Domain not found' }, { status: 404 });

  const detachResult = await detachDomain(binding.domain);
  await saveDomain({
    ...binding,
    status: 'removed',
    lastError: detachResult.ok ? undefined : detachResult.error,
  });
  return NextResponse.json({ ok: true, detached: detachResult.ok, error: detachResult.error });
}

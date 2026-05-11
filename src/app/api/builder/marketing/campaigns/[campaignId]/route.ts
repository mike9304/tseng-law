import { NextRequest, NextResponse } from 'next/server';
import { guardMutation } from '@/lib/builder/security/guard';
import { getCampaign, saveCampaign } from '@/lib/builder/marketing/campaign-storage';
import { campaignUpdateSchema } from '@/lib/builder/marketing/campaign-types';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(
  request: NextRequest,
  { params }: { params: { campaignId: string } },
) {
  const auth = await guardMutation(request, { allowReadOnly: true });
  if (auth instanceof NextResponse) return auth;
  const campaign = await getCampaign(params.campaignId);
  if (!campaign) return NextResponse.json({ error: 'Campaign not found' }, { status: 404 });
  return NextResponse.json({ ok: true, campaign });
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { campaignId: string } },
) {
  const auth = await guardMutation(request, { permission: 'manage-campaigns' });
  if (auth instanceof NextResponse) return auth;

  const existing = await getCampaign(params.campaignId);
  if (!existing) return NextResponse.json({ error: 'Campaign not found' }, { status: 404 });
  if (existing.status === 'sending' || existing.status === 'sent') {
    return NextResponse.json({ error: 'Campaign already in flight' }, { status: 409 });
  }

  const raw = await request.json().catch(() => null);
  const parsed = campaignUpdateSchema.safeParse(raw);
  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid campaign update' }, { status: 400 });
  }
  const merged = {
    ...existing,
    ...parsed.data,
    status: parsed.data.status ?? existing.status,
  };
  await saveCampaign(merged);
  return NextResponse.json({ ok: true, campaign: merged });
}

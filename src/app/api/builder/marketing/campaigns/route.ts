import { NextRequest, NextResponse } from 'next/server';
import { guardMutation } from '@/lib/builder/security/guard';
import {
  listCampaigns,
  makeCampaignId,
  saveCampaign,
} from '@/lib/builder/marketing/campaign-storage';
import {
  campaignCreateSchema,
  createEmptyStats,
  type Campaign,
} from '@/lib/builder/marketing/campaign-types';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const auth = await guardMutation(request, { allowReadOnly: true });
  if (auth instanceof NextResponse) return auth;
  const campaigns = await listCampaigns();
  return NextResponse.json({ ok: true, campaigns, total: campaigns.length });
}

export async function POST(request: NextRequest) {
  const auth = await guardMutation(request, { permission: 'manage-campaigns' });
  if (auth instanceof NextResponse) return auth;

  const raw = await request.json().catch(() => null);
  const parsed = campaignCreateSchema.safeParse(raw);
  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid campaign payload', details: parsed.error.issues.slice(0, 3) }, { status: 400 });
  }
  const now = new Date().toISOString();
  const campaign: Campaign = {
    campaignId: makeCampaignId(),
    name: parsed.data.name,
    subject: parsed.data.subject,
    preheader: parsed.data.preheader,
    bodyHtml: parsed.data.bodyHtml,
    bodyText: parsed.data.bodyText,
    segmentTags: parsed.data.segmentTags,
    fromName: parsed.data.fromName,
    fromAddress: parsed.data.fromAddress,
    status: parsed.data.scheduledAt ? 'scheduled' : 'draft',
    scheduledAt: parsed.data.scheduledAt,
    stats: createEmptyStats(),
    createdAt: now,
    updatedAt: now,
  };
  await saveCampaign(campaign);
  return NextResponse.json({ ok: true, campaign }, { status: 201 });
}

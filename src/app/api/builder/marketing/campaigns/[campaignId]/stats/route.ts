import { NextRequest, NextResponse } from 'next/server';
import { guardMutation } from '@/lib/builder/security/guard';
import {
  aggregateStats,
  getCampaign,
  listRecipientsForCampaign,
} from '@/lib/builder/marketing/campaign-storage';

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

  const recipients = await listRecipientsForCampaign(params.campaignId);
  const stats = aggregateStats(recipients);
  const openRate = stats.recipients ? stats.opens / stats.recipients : 0;
  const clickRate = stats.recipients ? stats.clicks / stats.recipients : 0;
  const unsubscribeRate = stats.recipients ? stats.unsubscribes / stats.recipients : 0;

  return NextResponse.json({
    ok: true,
    campaign: {
      campaignId: campaign.campaignId,
      name: campaign.name,
      status: campaign.status,
      sentAt: campaign.sentAt,
    },
    stats,
    rates: {
      open: Math.round(openRate * 1000) / 1000,
      click: Math.round(clickRate * 1000) / 1000,
      unsubscribe: Math.round(unsubscribeRate * 1000) / 1000,
    },
    pending: recipients.filter((r) => r.status === 'pending').length,
  });
}

import { NextRequest, NextResponse } from 'next/server';
import { guardMutation } from '@/lib/builder/security/guard';
import { getCampaign } from '@/lib/builder/marketing/campaign-storage';
import { getSubscriberByEmail } from '@/lib/builder/marketing/subscriber-storage';
import {
  sendCampaignBatch,
  sendTestEmail,
} from '@/lib/builder/marketing/dispatcher';
import { campaignSendSchema } from '@/lib/builder/marketing/campaign-types';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(
  request: NextRequest,
  { params }: { params: { campaignId: string } },
) {
  const auth = await guardMutation(request);
  if (auth instanceof NextResponse) return auth;

  const campaign = await getCampaign(params.campaignId);
  if (!campaign) return NextResponse.json({ error: 'Campaign not found' }, { status: 404 });

  const raw = await request.json().catch(() => null);
  const parsed = campaignSendSchema.safeParse(raw ?? {});
  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid send payload' }, { status: 400 });
  }

  if (parsed.data.testEmail) {
    const subscriber = await getSubscriberByEmail(parsed.data.testEmail);
    const result = await sendTestEmail({
      campaign,
      testEmail: parsed.data.testEmail,
      subscriber,
    });
    return NextResponse.json({ ok: result.ok, mode: 'test', error: result.error });
  }

  const result = await sendCampaignBatch({
    campaignId: campaign.campaignId,
    batchSize: parsed.data.batchSize,
  });
  return NextResponse.json({ mode: 'batch', ...result });
}

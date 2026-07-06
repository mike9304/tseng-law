import { NextRequest, NextResponse } from 'next/server';
import { guardMutation } from '@/lib/builder/security/guard';
import {
  aggregateStats,
  getCampaign,
  listRecipientsForCampaign,
} from '@/lib/builder/marketing/campaign-storage';
import { buildCampaignAnalyticsSummary } from '@/lib/builder/marketing/campaign-analytics';
import {
  getBuilderMarketingApiErrorPayload,
  type BuilderMarketingApiErrorCode,
} from '@/lib/builder/marketing/marketing-api-copy';
import { normalizeLocale, type Locale } from '@/lib/locales';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

function errorResponse(
  locale: Locale,
  errorCode: BuilderMarketingApiErrorCode,
  status: number,
): NextResponse {
  return NextResponse.json(
    { ok: false, ...getBuilderMarketingApiErrorPayload(locale, errorCode) },
    { status },
  );
}

export async function GET(
  request: NextRequest,
  { params }: { params: { campaignId: string } },
) {
  const auth = await guardMutation(request, { allowReadOnly: true });
  if (auth instanceof NextResponse) return auth;
  const locale = normalizeLocale(request.nextUrl.searchParams.get('locale') ?? 'ko');

  try {
    const campaign = await getCampaign(params.campaignId);
    if (!campaign) return errorResponse(locale, 'campaign_not_found', 404);

    const recipients = await listRecipientsForCampaign(params.campaignId);
    const stats = aggregateStats(recipients);
    const analytics = buildCampaignAnalyticsSummary(recipients, stats);
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
      pending: analytics.recipientBreakdown.pending,
      recipientBreakdown: analytics.recipientBreakdown,
      recentEvents: analytics.recentEvents,
      funnel: analytics.funnel,
    });
  } catch (error) {
    console.error('[builder/marketing/campaigns/:id/stats] stats failed:', error);
    return errorResponse(locale, 'campaign_stats_failed', 500);
  }
}

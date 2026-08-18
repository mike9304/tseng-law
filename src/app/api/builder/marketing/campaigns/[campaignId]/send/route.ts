import { NextRequest, NextResponse } from 'next/server';
import { guardMutation } from '@/lib/builder/security/guard';
import { getCampaign } from '@/lib/builder/marketing/campaign-storage';
import { getSubscriberByEmail } from '@/lib/builder/marketing/subscriber-storage';
import {
  sendCampaignBatch,
  sendTestEmail,
} from '@/lib/builder/marketing/dispatcher';
import { campaignSendSchema, type Campaign } from '@/lib/builder/marketing/campaign-types';
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
  extra?: Record<string, unknown>,
): NextResponse {
  return NextResponse.json(
    { ok: false, ...getBuilderMarketingApiErrorPayload(locale, errorCode), ...(extra ?? {}) },
    { status },
  );
}

export async function POST(request: NextRequest, props: { params: Promise<{ campaignId: string }> }) {
  const params = await props.params;
  const auth = await guardMutation(request, { permission: 'manage-campaigns' });
  if (auth instanceof NextResponse) return auth;
  const locale = normalizeLocale(request.nextUrl.searchParams.get('locale') ?? 'ko');

  let campaign: Campaign | null;
  try {
    campaign = await getCampaign(params.campaignId);
    if (!campaign) return errorResponse(locale, 'campaign_not_found', 404);
  } catch (error) {
    console.error('[builder/marketing/campaigns/:id/send] load failed:', error);
    return errorResponse(locale, 'campaign_load_failed', 500);
  }

  let raw: unknown;
  try {
    raw = await request.json();
  } catch {
    return errorResponse(locale, 'invalid_json', 400);
  }
  const parsed = campaignSendSchema.safeParse(raw);
  if (!parsed.success) {
    return errorResponse(locale, 'invalid_send_payload', 400, {
      details: parsed.error.issues.slice(0, 3),
    });
  }

  if (parsed.data.testEmail) {
    try {
      const subscriber = await getSubscriberByEmail(parsed.data.testEmail);
      const result = await sendTestEmail({
        campaign,
        testEmail: parsed.data.testEmail,
        subscriber,
      });
      if (!result.ok) {
        return NextResponse.json({
          ok: false,
          mode: 'test',
          ...getBuilderMarketingApiErrorPayload(locale, 'campaign_test_send_failed'),
        });
      }
      return NextResponse.json({ ok: true, mode: 'test' });
    } catch (error) {
      console.error('[builder/marketing/campaigns/:id/send] test send failed:', error);
      return errorResponse(locale, 'campaign_test_send_failed', 500);
    }
  }

  try {
    const result = await sendCampaignBatch({
      campaignId: campaign.campaignId,
      batchSize: parsed.data.batchSize,
      // Manual operator sends may retry a failed/partial campaign; cron never does.
      resetFailed: true,
    });
    const payload = getBuilderMarketingApiErrorPayload(locale, 'campaign_batch_send_failed');
    const resultErrors = Array.isArray(result.errors) ? result.errors : [];
    const localizedErrors = resultErrors.map((entry) => ({
      email: entry.email,
      ...payload,
    }));
    return NextResponse.json({
      mode: 'batch',
      ...result,
      errors: localizedErrors,
      ...(!result.ok ? payload : {}),
    });
  } catch (error) {
    console.error('[builder/marketing/campaigns/:id/send] batch send failed:', error);
    return errorResponse(locale, 'campaign_batch_send_failed', 500);
  }
}

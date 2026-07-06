import { NextRequest, NextResponse } from 'next/server';
import { guardMutation } from '@/lib/builder/security/guard';
import { getCampaign, saveCampaign } from '@/lib/builder/marketing/campaign-storage';
import { campaignUpdateSchema, type Campaign } from '@/lib/builder/marketing/campaign-types';
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
    return NextResponse.json({ ok: true, campaign });
  } catch (error) {
    console.error('[builder/marketing/campaigns/:id] load failed:', error);
    return errorResponse(locale, 'campaign_load_failed', 500);
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { campaignId: string } },
) {
  const auth = await guardMutation(request, { permission: 'manage-campaigns' });
  if (auth instanceof NextResponse) return auth;
  const locale = normalizeLocale(request.nextUrl.searchParams.get('locale') ?? 'ko');

  let existing: Campaign | null;
  try {
    existing = await getCampaign(params.campaignId);
    if (!existing) return errorResponse(locale, 'campaign_not_found', 404);
    if (existing.status === 'sending' || existing.status === 'sent') {
      return errorResponse(locale, 'campaign_in_flight', 409);
    }
  } catch (error) {
    console.error('[builder/marketing/campaigns/:id] load failed:', error);
    return errorResponse(locale, 'campaign_load_failed', 500);
  }

  let raw: unknown;
  try {
    raw = await request.json();
  } catch {
    return errorResponse(locale, 'invalid_json', 400);
  }
  const parsed = campaignUpdateSchema.safeParse(raw);
  if (!parsed.success) {
    return errorResponse(locale, 'invalid_campaign_update', 400, {
      details: parsed.error.issues.slice(0, 3),
    });
  }
  const merged = {
    ...existing,
    ...parsed.data,
    status: parsed.data.status ?? existing.status,
  };
  try {
    await saveCampaign(merged);
    return NextResponse.json({ ok: true, campaign: merged });
  } catch (error) {
    console.error('[builder/marketing/campaigns/:id] update failed:', error);
    return errorResponse(locale, 'campaign_update_failed', 500);
  }
}

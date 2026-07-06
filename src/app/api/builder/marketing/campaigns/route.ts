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

export async function GET(request: NextRequest) {
  const auth = await guardMutation(request, { allowReadOnly: true });
  if (auth instanceof NextResponse) return auth;
  const locale = normalizeLocale(request.nextUrl.searchParams.get('locale') ?? 'ko');
  try {
    const campaigns = await listCampaigns();
    return NextResponse.json({ ok: true, campaigns, total: campaigns.length });
  } catch (error) {
    console.error('[builder/marketing/campaigns] list failed:', error);
    return errorResponse(locale, 'campaigns_list_failed', 500);
  }
}

export async function POST(request: NextRequest) {
  const auth = await guardMutation(request, { permission: 'manage-campaigns' });
  if (auth instanceof NextResponse) return auth;
  const locale = normalizeLocale(request.nextUrl.searchParams.get('locale') ?? 'ko');

  let raw: unknown;
  try {
    raw = await request.json();
  } catch {
    return errorResponse(locale, 'invalid_json', 400);
  }
  const parsed = campaignCreateSchema.safeParse(raw);
  if (!parsed.success) {
    return errorResponse(locale, 'invalid_campaign_payload', 400, {
      details: parsed.error.issues.slice(0, 3),
    });
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
  try {
    await saveCampaign(campaign);
    return NextResponse.json({ ok: true, campaign }, { status: 201 });
  } catch (error) {
    console.error('[builder/marketing/campaigns] create failed:', error);
    return errorResponse(locale, 'campaign_create_failed', 500);
  }
}

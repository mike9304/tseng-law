import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { guardMutation } from '@/lib/builder/security/guard';
import {
  buildMarketingDeliverabilityReport,
  DEFAULT_DELIVERABILITY_FROM_ADDRESS,
} from '@/lib/builder/marketing/deliverability';
import { sendMarketingEmail } from '@/lib/builder/marketing/email-provider';
import {
  getBuilderMarketingApiErrorPayload,
  type BuilderMarketingApiErrorCode,
} from '@/lib/builder/marketing/marketing-api-copy';
import { normalizeLocale, type Locale } from '@/lib/locales';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const testPayloadSchema = z.object({
  testEmail: z.string().trim().email().max(200),
  fromName: z.string().trim().min(1).max(120).default('호정국제'),
  fromAddress: z.string().trim().email().max(200).default(DEFAULT_DELIVERABILITY_FROM_ADDRESS),
});

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
  const auth = await guardMutation(request, { allowReadOnly: true, permission: 'manage-campaigns' });
  if (auth instanceof NextResponse) return auth;
  const locale = normalizeLocale(request.nextUrl.searchParams.get('locale') ?? 'ko');
  try {
    return NextResponse.json({
      ok: true,
      report: buildMarketingDeliverabilityReport(),
    });
  } catch (error) {
    console.error('[builder/marketing/deliverability] report failed:', error);
    return errorResponse(locale, 'deliverability_report_failed', 500);
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
  const parsed = testPayloadSchema.safeParse(raw);
  if (!parsed.success) {
    return errorResponse(locale, 'invalid_deliverability_payload', 400, {
      details: parsed.error.issues.slice(0, 3),
    });
  }

  const report = buildMarketingDeliverabilityReport({
    fromAddress: parsed.data.fromAddress,
  });
  if (!report.ok) {
    return errorResponse(locale, 'deliverability_check_failed', 409, { report });
  }

  try {
    const sent = await sendMarketingEmail({
      to: parsed.data.testEmail,
      fromName: parsed.data.fromName,
      fromAddress: parsed.data.fromAddress,
      subject: '[Deliverability QA] Tseng Law marketing test',
      html: '<p>This is a deliverability QA test from the Tseng Law site builder.</p>',
      text: 'This is a deliverability QA test from the Tseng Law site builder.',
    });
    if (!sent.ok) {
      return errorResponse(locale, 'deliverability_test_failed', 502, {
        mode: 'test',
        provider: sent.provider,
        report,
      });
    }
    return NextResponse.json({
      ok: true,
      mode: 'test',
      provider: sent.provider,
      report,
    });
  } catch (error) {
    console.error('[builder/marketing/deliverability] test send failed:', error);
    return errorResponse(locale, 'deliverability_test_failed', 500, { mode: 'test', report });
  }
}

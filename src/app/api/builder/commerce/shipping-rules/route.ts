import { NextRequest, NextResponse } from 'next/server';
import { ZodError, z } from 'zod';
import { requireBuilderAdminAuth } from '@/lib/builder/columns/auth';
import { guardMutation } from '@/lib/builder/security/guard';
import { loadShippingRules, saveShippingRules } from '@/lib/builder/commerce/shipping-engine';
import {
  getCommerceShippingRulesApiErrorPayload,
  type CommerceShippingRulesApiErrorCode,
} from '@/lib/builder/commerce/shipping-rules-copy';
import { publicShippingRules } from '@/lib/builder/commerce/shipping-shared';
import { normalizeLocale, type Locale } from '@/lib/locales';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const localeSchema = z.enum(['ko', 'zh-hant', 'en']).default('ko');
const currencySchema = z.enum(['TWD', 'KRW', 'USD']).default('TWD');

const shippingRuleSchema = z.object({
  ruleId: z.string().trim().min(1).max(80),
  method: z.enum(['digital', 'standard', 'express', 'pickup', 'local-delivery']),
  label: z.string().trim().min(1).max(120),
  currency: currencySchema,
  country: z.string().trim().length(2).optional(),
  region: z.string().trim().max(80).optional(),
  amountCents: z.coerce.number().int().min(0).max(1000000000),
  freeShippingMinSubtotalCents: z.coerce.number().int().min(0).max(1000000000).optional(),
  active: z.boolean().default(true),
  locale: z.enum(['ko', 'zh-hant', 'en', 'all']).default('all'),
  priority: z.coerce.number().int().min(-100000).max(100000).default(0),
  estimatedDays: z.string().trim().min(1).max(40),
  pickupLocation: z.string().trim().max(180).optional(),
});

const patchSchema = z.object({
  rules: z.array(shippingRuleSchema).min(1).max(100),
});

function errorResponse(
  locale: Locale,
  errorCode: CommerceShippingRulesApiErrorCode,
  status: number,
  extras?: Record<string, unknown>,
): NextResponse {
  return NextResponse.json(
    { ok: false, ...getCommerceShippingRulesApiErrorPayload(locale, errorCode), ...extras },
    { status },
  );
}

function validationError(locale: Locale, error: ZodError): NextResponse {
  return errorResponse(locale, 'validation_error', 400, { issues: error.flatten() });
}

export async function GET(request: NextRequest) {
  const errorLocale = normalizeLocale(request.nextUrl.searchParams.get('locale') ?? undefined);

  try {
    const sp = request.nextUrl.searchParams;
    const locale = localeSchema.parse(sp.get('locale') ?? 'ko');
    const currency = currencySchema.parse(sp.get('currency') ?? 'TWD');
    const scope = sp.get('scope') === 'all' ? 'all' : 'public';
    if (scope === 'all') {
      const auth = requireBuilderAdminAuth(request);
      if (auth instanceof NextResponse) return auth;
    }

    const rules = await loadShippingRules();
    return NextResponse.json({
      ok: true,
      locale,
      currency,
      rules: scope === 'all' ? rules : publicShippingRules(rules, locale, currency),
    });
  } catch (error) {
    if (error instanceof ZodError) return validationError(errorLocale, error);
    console.error('[builder/commerce/shipping-rules] GET failed:', error);
    return errorResponse(errorLocale, 'shipping_rules_failed', 500);
  }
}

export async function PATCH(request: NextRequest) {
  const errorLocale = normalizeLocale(request.nextUrl.searchParams.get('locale') ?? undefined);
  const auth = await guardMutation(request, { bucket: 'mutation' });
  if (auth instanceof NextResponse) return auth;

  try {
    const input = patchSchema.parse(await request.json());
    const rules = await saveShippingRules(input.rules);
    return NextResponse.json({ ok: true, rules });
  } catch (error) {
    if (error instanceof ZodError) return validationError(errorLocale, error);
    if (error instanceof SyntaxError) return errorResponse(errorLocale, 'invalid_json', 400);
    console.error('[builder/commerce/shipping-rules] PATCH failed:', error);
    return errorResponse(errorLocale, 'shipping_rules_update_failed', 500);
  }
}

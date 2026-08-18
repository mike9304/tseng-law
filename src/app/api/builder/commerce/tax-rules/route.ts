import { NextRequest, NextResponse } from 'next/server';
import { ZodError, z } from 'zod';
import { guardBuilderReadWithPermission, guardMutation } from '@/lib/builder/security/guard';
import {
  getCommerceTaxRulesApiErrorPayload,
  type CommerceTaxRulesApiErrorCode,
} from '@/lib/builder/commerce/tax-rules-copy';
import { loadTaxRules, saveTaxRules } from '@/lib/builder/commerce/tax-engine';
import { publicTaxRules } from '@/lib/builder/commerce/tax-shared';
import { normalizeLocale, type Locale } from '@/lib/locales';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const localeSchema = z.enum(['ko', 'zh-hant', 'en']).default('ko');

const taxRuleSchema = z.object({
  ruleId: z.string().trim().min(1).max(80),
  label: z.string().trim().min(1).max(120),
  country: z.string().trim().length(2),
  region: z.string().trim().max(80).optional(),
  rateBps: z.coerce.number().int().min(0).max(10000),
  active: z.boolean().default(true),
  locale: z.enum(['ko', 'zh-hant', 'en', 'all']).default('all'),
  priority: z.coerce.number().int().min(-100000).max(100000).default(0),
  includedInPrice: z.boolean().default(false),
});

const patchSchema = z.object({
  rules: z.array(taxRuleSchema).min(1).max(100),
});

function errorResponse(
  locale: Locale,
  errorCode: CommerceTaxRulesApiErrorCode,
  status: number,
  extras?: Record<string, unknown>,
): NextResponse {
  return NextResponse.json(
    { ok: false, ...getCommerceTaxRulesApiErrorPayload(locale, errorCode), ...extras },
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
    const scope = sp.get('scope') === 'all' ? 'all' : 'public';
    if (scope === 'all') {
      const auth = await guardBuilderReadWithPermission(request, 'view-commerce');
      if (auth instanceof NextResponse) return auth;
    }

    const rules = await loadTaxRules();
    return NextResponse.json({
      ok: true,
      locale,
      rules: scope === 'all' ? rules : publicTaxRules(rules, locale),
    });
  } catch (error) {
    if (error instanceof ZodError) return validationError(errorLocale, error);
    console.error('[builder/commerce/tax-rules] GET failed:', error);
    return errorResponse(errorLocale, 'tax_rules_failed', 500);
  }
}

export async function PATCH(request: NextRequest) {
  const errorLocale = normalizeLocale(request.nextUrl.searchParams.get('locale') ?? undefined);
  const auth = await guardMutation(request, { bucket: 'mutation', permission: 'manage-commerce' });
  if (auth instanceof NextResponse) return auth;

  try {
    const input = patchSchema.parse(await request.json());
    const rules = await saveTaxRules(input.rules);
    return NextResponse.json({ ok: true, rules });
  } catch (error) {
    if (error instanceof ZodError) return validationError(errorLocale, error);
    if (error instanceof SyntaxError) return errorResponse(errorLocale, 'invalid_json', 400);
    console.error('[builder/commerce/tax-rules] PATCH failed:', error);
    return errorResponse(errorLocale, 'tax_rules_update_failed', 500);
  }
}

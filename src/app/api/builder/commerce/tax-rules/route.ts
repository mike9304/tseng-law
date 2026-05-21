import { NextRequest, NextResponse } from 'next/server';
import { ZodError, z } from 'zod';
import { requireBuilderAdminAuth } from '@/lib/builder/columns/auth';
import { guardMutation } from '@/lib/builder/security/guard';
import { loadTaxRules, saveTaxRules } from '@/lib/builder/commerce/tax-engine';
import { publicTaxRules } from '@/lib/builder/commerce/tax-shared';

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

function validationError(error: ZodError): NextResponse {
  return NextResponse.json(
    { ok: false, error: 'validation_error', issues: error.flatten() },
    { status: 400 },
  );
}

export async function GET(request: NextRequest) {
  try {
    const sp = request.nextUrl.searchParams;
    const locale = localeSchema.parse(sp.get('locale') ?? 'ko');
    const scope = sp.get('scope') === 'all' ? 'all' : 'public';
    if (scope === 'all') {
      const auth = requireBuilderAdminAuth(request);
      if (auth instanceof NextResponse) return auth;
    }

    const rules = await loadTaxRules();
    return NextResponse.json({
      ok: true,
      locale,
      rules: scope === 'all' ? rules : publicTaxRules(rules, locale),
    });
  } catch (error) {
    if (error instanceof ZodError) return validationError(error);
    console.error('[builder/commerce/tax-rules] GET failed:', error);
    return NextResponse.json({ ok: false, error: 'tax_rules_failed' }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  const auth = await guardMutation(request, { bucket: 'mutation' });
  if (auth instanceof NextResponse) return auth;

  try {
    const input = patchSchema.parse(await request.json());
    const rules = await saveTaxRules(input.rules);
    return NextResponse.json({ ok: true, rules });
  } catch (error) {
    if (error instanceof ZodError) return validationError(error);
    if (error instanceof SyntaxError) return NextResponse.json({ ok: false, error: 'Invalid JSON payload.' }, { status: 400 });
    console.error('[builder/commerce/tax-rules] PATCH failed:', error);
    return NextResponse.json({ ok: false, error: 'tax_rules_update_failed' }, { status: 500 });
  }
}

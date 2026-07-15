/**
 * F85 — AI Page generator depth route.
 *
 * POST /api/builder/ai-generator/page-spec
 * Body: { purpose, audience, targetAction, locale, industry?, intent?,
 *         sectionHints?, brandTone?, siteName? }
 * Returns: { ok, spec, model, usedFallback }
 *
 * Calls gpt-4o-mini with response_format=json_object to refine the
 * deterministic spec. Production fails closed when provider configuration
 * or output is invalid. The LLM is constrained to AI_SECTION_KINDS.
 */

import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { guardMutation } from '@/lib/builder/security/guard';
import {
  buildPageSpec,
  PAGE_INTENTS,
  type PageBrief,
  type PageSpec,
} from '@/lib/builder/ai-generator/page-spec-builder';
import { AI_SECTION_KINDS } from '@/lib/builder/ai-generator/section-builder';
import {
  AiContentGenerationError,
  isLocalDemoGenerationAllowed,
  type AiContentGenerationErrorCode,
} from '@/lib/builder/ai-generator/content-generator';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const requestSchema = z.object({
  purpose: z.string().trim().min(1).max(600),
  audience: z.string().trim().min(1).max(280),
  targetAction: z.string().trim().min(1).max(160),
  locale: z.enum(['ko', 'zh-hant', 'en']),
  industry: z.string().trim().max(80).optional(),
  intent: z.enum(PAGE_INTENTS).optional(),
  sectionHints: z.array(z.enum(AI_SECTION_KINDS)).max(6).optional(),
  siteName: z.string().trim().max(120).optional(),
  brandTone: z.string().trim().max(200).optional(),
});

type RequestInput = z.infer<typeof requestSchema>;

type OpenAiChatPayload = {
  choices?: Array<{ message?: { content?: string }; finish_reason?: string }>;
};

type PageSpecProviderResult =
  | { ok: true; spec: PageSpec; model: string }
  | { ok: false; error: AiContentGenerationError };

const llmSpecSchema = z.object({
  pageTitle: z.string().trim().min(1).max(140),
  pageDescription: z.string().trim().min(1).max(300),
  reasoning: z.string().trim().min(1).max(600),
  sections: z
    .array(
      z.object({
        sectionKind: z.enum(AI_SECTION_KINDS),
        headline: z.string().trim().min(1).max(180),
        subhead: z.string().trim().max(360).optional().nullable(),
        items: z
          .array(
            z.object({
              title: z.string().trim().min(1).max(120),
              body: z.string().trim().min(1).max(420),
            }),
          )
          .max(8)
          .optional()
          .nullable(),
        ctaLabel: z.string().trim().max(80).optional().nullable(),
      }),
    )
    .min(1)
    .max(8),
});

function openAiApiKey(): string {
  return process.env.OPENAI_API_KEY?.trim() ?? '';
}

function pageSpecModel(): string {
  return (
    process.env.OPENAI_PAGE_SPEC_MODEL?.trim()
    || process.env.OPENAI_GENERATION_MODEL?.trim()
    || 'gpt-4o-mini'
  );
}

function localeLabel(locale: 'ko' | 'zh-hant' | 'en'): string {
  if (locale === 'ko') return 'Korean (한국어)';
  if (locale === 'zh-hant') return 'Traditional Chinese (繁體中文)';
  return 'English';
}

function briefFromInput(input: RequestInput): PageBrief {
  return {
    purpose: input.purpose,
    audience: input.audience,
    targetAction: input.targetAction,
    locale: input.locale,
    industry: input.industry,
    intent: input.intent,
    sectionHints: input.sectionHints,
    siteName: input.siteName,
    brandTone: input.brandTone,
  };
}

function buildSystemPrompt(input: RequestInput, deterministic: PageSpec): string {
  const lines = [
    'You are an expert page architect inside a Wix-style visual builder.',
    'You MUST respond with valid JSON. Do not include any text outside the JSON object.',
    'JSON shape:',
    '{ "pageTitle": string, "pageDescription": string, "reasoning": string,',
    '  "sections": Array<{ "sectionKind": "hero"|"features"|"testimonials"|"cta"|"faq",',
    '    "headline": string, "subhead"?: string, "ctaLabel"?: string,',
    '    "items"?: Array<{ "title": string, "body": string }> }> }',
    `Write all visible copy in ${localeLabel(input.locale)}.`,
    'Headlines must be punchy and 60 characters or fewer.',
    'For features/faq/testimonials, provide between 3 and 6 items.',
    'For cta sections, omit items.',
    'For testimonials, set item.title to the speaker name/role and item.body to their quote (no quote marks).',
    `Use the deterministic intent "${deterministic.intent}" and the following section sequence as guidance: ${deterministic.sections.map((section) => section.sectionKind).join(' -> ')}.`,
    'Only use sectionKind values from the enum above.',
  ];
  if (input.siteName) lines.push(`Site context: this page lives on the ${input.siteName} website.`);
  if (input.brandTone) lines.push(`Brand voice guideline: ${input.brandTone}.`);
  if (input.industry) lines.push(`Industry context: ${input.industry}.`);
  return lines.join('\n');
}

function buildUserPrompt(input: RequestInput): string {
  const lines = [
    `Page purpose: ${input.purpose}`,
    `Target audience: ${input.audience}`,
    `Target action (what should the visitor do?): ${input.targetAction}`,
  ];
  if (input.sectionHints && input.sectionHints.length > 0) {
    lines.push(`Required section hints (honor in order): ${input.sectionHints.join(', ')}.`);
  }
  lines.push('', 'Return only the JSON object.');
  return lines.join('\n');
}

function coerceSpec(
  parsed: z.infer<typeof llmSpecSchema>,
  deterministic: PageSpec,
): PageSpec {
  return {
    intent: deterministic.intent,
    layout: deterministic.layout,
    locale: deterministic.locale,
    pageTitle: parsed.pageTitle?.trim() || deterministic.pageTitle,
    pageDescription:
      parsed.pageDescription?.trim() || deterministic.pageDescription,
    header: deterministic.header,
    footer: deterministic.footer,
    sections: parsed.sections.map((section) => ({
      sectionKind: section.sectionKind,
      headline: section.headline,
      subhead: section.subhead ?? undefined,
      items: section.items ?? undefined,
      ctaLabel: section.ctaLabel ?? undefined,
    })),
    reasoning: parsed.reasoning?.trim() || deterministic.reasoning,
  };
}

type ParsedPageSection = z.infer<typeof llmSpecSchema>['sections'][number];

function hasMeaningfulListItems(section: ParsedPageSection): boolean {
  return Boolean(section.items && section.items.length >= 3 && section.items.length <= 6);
}

function isSemanticallyValidSection(section: ParsedPageSection): boolean {
  switch (section.sectionKind) {
    case 'features':
    case 'testimonials':
    case 'faq':
      return hasMeaningfulListItems(section);
    case 'hero':
    case 'cta':
      return Boolean(section.subhead?.trim() && section.ctaLabel?.trim() && !section.items?.length);
    default:
      return false;
  }
}

function isSemanticallyValidPageSpec(
  parsed: z.infer<typeof llmSpecSchema>,
  deterministic: PageSpec,
): boolean {
  const expectedKinds = deterministic.sections.map((section) => section.sectionKind);
  if (parsed.sections.length !== expectedKinds.length) return false;
  return parsed.sections.every((section, index) => (
    section.sectionKind === expectedKinds[index]
    && isSemanticallyValidSection(section)
  ));
}

async function callOpenAi(
  input: RequestInput,
  deterministic: PageSpec,
  apiKey: string,
): Promise<PageSpecProviderResult> {
  const model = pageSpecModel();
  const systemPrompt = buildSystemPrompt(input, deterministic);
  const userPrompt = buildUserPrompt(input);
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 20_000);
  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      signal: controller.signal,
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model,
        temperature: 0.55,
        max_tokens: 1500,
        response_format: { type: 'json_object' },
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt },
        ],
      }),
    });
    const payload = (await response.json().catch(() => null)) as OpenAiChatPayload | null;
    if (!response.ok) {
      return { ok: false, error: new AiContentGenerationError('ai_content_provider_rejected') };
    }
    const content = payload?.choices?.[0]?.message?.content;
    if (!content) {
      return { ok: false, error: new AiContentGenerationError('ai_content_invalid_response') };
    }
    let json: unknown;
    try {
      json = JSON.parse(content);
    } catch {
      return { ok: false, error: new AiContentGenerationError('ai_content_invalid_response') };
    }
    const parsed = llmSpecSchema.safeParse(json);
    if (!parsed.success || !isSemanticallyValidPageSpec(parsed.data, deterministic)) {
      return { ok: false, error: new AiContentGenerationError('ai_content_invalid_response') };
    }
    return {
      ok: true,
      spec: coerceSpec(parsed.data, deterministic),
      model,
    };
  } catch {
    return { ok: false, error: new AiContentGenerationError('ai_content_provider_unavailable') };
  } finally {
    clearTimeout(timeout);
  }
}

function providerFailureResponse(code: AiContentGenerationErrorCode): NextResponse {
  const error = new AiContentGenerationError(code);
  return NextResponse.json({
    ok: false,
    error: error.code,
    message: error.message,
  }, { status: error.httpStatus });
}

export async function POST(request: NextRequest) {
  const auth = await guardMutation(request, {
    bucket: 'mutation',
    permission: 'edit-pages',
  });
  if (auth instanceof NextResponse) return auth;

  const raw = await request.json().catch(() => null);
  const parsed = requestSchema.safeParse(raw);
  if (!parsed.success) {
    return NextResponse.json(
      {
        ok: false,
        error: 'invalid_page_spec_request',
        details: parsed.error.issues.slice(0, 3),
      },
      { status: 400 },
    );
  }

  const input = parsed.data;
  const brief = briefFromInput(input);
  const deterministic = buildPageSpec(brief);
  const apiKey = openAiApiKey();

  if (!apiKey) {
    if (!isLocalDemoGenerationAllowed()) {
      return providerFailureResponse('ai_content_provider_unconfigured');
    }
    return NextResponse.json({
      ok: false,
      error: 'ai_page_spec_local_demo_only',
      message: 'Local demo page specification is not provider-generated.',
      source: 'local-demo',
      stub: true,
      usedFallback: true,
      model: pageSpecModel(),
      spec: deterministic,
    }, { status: 503 });
  }

  const llmResult = await callOpenAi(input, deterministic, apiKey);
  if (!llmResult.ok) {
    return providerFailureResponse(llmResult.error.code);
  }
  return NextResponse.json({
    ok: true,
    source: 'openai',
    stub: false,
    usedFallback: false,
    model: llmResult.model,
    spec: llmResult.spec,
  });
}

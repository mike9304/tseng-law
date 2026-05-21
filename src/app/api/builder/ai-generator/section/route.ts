/**
 * F90 — AI Section generator route.
 *
 * POST /api/builder/ai-generator/section
 * Body: { prompt, sectionKind?, locale, brandTone? }
 * Returns: { ok, nodes: BuilderCanvasNode[], rootId, sectionKind, spec }
 *
 * Uses gpt-4o-mini with response_format=json_object to produce a strict
 * section spec, then runs the deterministic section-builder to assemble
 * BuilderCanvasNodes. Falls back to a stub spec when no LLM key is set.
 */

import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { guardMutation } from '@/lib/builder/security/guard';
import {
  buildSectionNodes,
  AI_SECTION_KINDS,
  type AiSectionKind,
  type AiSectionSpec,
} from '@/lib/builder/ai-generator/section-builder';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const requestSchema = z.object({
  prompt: z.string().trim().min(1).max(2000),
  sectionKind: z.enum(AI_SECTION_KINDS).optional(),
  locale: z.enum(['ko', 'zh-hant', 'en']),
  brandTone: z.string().trim().max(200).optional(),
  siteName: z.string().trim().max(120).optional(),
});

type OpenAiChatPayload = {
  choices?: Array<{
    message?: { content?: string };
    finish_reason?: string;
  }>;
  error?: { message?: string; type?: string; code?: string };
};

const llmSpecSchema = z.object({
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
});

function openAiApiKey(): string {
  return process.env.OPENAI_API_KEY?.trim() ?? '';
}

function sectionAssistantModel(): string {
  return (
    process.env.OPENAI_SECTION_ASSISTANT_MODEL?.trim()
    || process.env.OPENAI_GENERATION_MODEL?.trim()
    || 'gpt-4o-mini'
  );
}

function localeLabel(locale: 'ko' | 'zh-hant' | 'en'): string {
  if (locale === 'ko') return 'Korean (한국어)';
  if (locale === 'zh-hant') return 'Traditional Chinese (繁體中文)';
  return 'English';
}

function buildSystemPrompt(input: z.infer<typeof requestSchema>): string {
  const lines = [
    'You are an expert web section copywriter inside a Wix-style visual builder.',
    'You MUST respond with valid JSON that conforms to this TypeScript shape:',
    '{ "sectionKind": "hero"|"features"|"testimonials"|"cta"|"faq", "headline": string, "subhead"?: string, "items"?: Array<{ title: string, body: string }>, "ctaLabel"?: string }',
    'Do not include any text outside the JSON object.',
    `Write the visible copy in ${localeLabel(input.locale)}.`,
    'Headlines must be punchy and 60 characters or fewer.',
    'For features/faq/testimonials, provide between 3 and 6 items.',
    'For cta sections, omit items.',
    'For testimonials, set item.title to the speaker name/role and item.body to their quote (no quote marks).',
  ];
  if (input.sectionKind) {
    lines.push(`The user picked sectionKind="${input.sectionKind}". Honor that choice exactly.`);
  } else {
    lines.push('Pick the sectionKind that best matches the user prompt.');
  }
  if (input.siteName) lines.push(`Site context: this section lives on the ${input.siteName} website.`);
  if (input.brandTone) lines.push(`Brand voice guideline: ${input.brandTone}.`);
  return lines.join('\n');
}

function fallbackSpec(input: z.infer<typeof requestSchema>): AiSectionSpec {
  const kind: AiSectionKind = input.sectionKind ?? 'hero';
  const trimmedPrompt = input.prompt.replace(/\s+/g, ' ').trim().slice(0, 80);
  const isKorean = input.locale === 'ko';
  switch (kind) {
    case 'hero':
      return {
        sectionKind: 'hero',
        headline: trimmedPrompt || (isKorean ? '신뢰할 수 있는 전문 파트너' : 'A partner you can trust'),
        subhead: isKorean
          ? '명확한 다음 단계로 안내하는 전문 상담을 받아보세요.'
          : 'Get expert guidance with a clear next step.',
        ctaLabel: isKorean ? '상담 시작' : 'Start a conversation',
      };
    case 'features':
      return {
        sectionKind: 'features',
        headline: trimmedPrompt || (isKorean ? '핵심 가치' : 'What we deliver'),
        items: [1, 2, 3].map((index) => ({
          title: isKorean ? `핵심 가치 ${index}` : `Value ${index}`,
          body: isKorean
            ? '이 영역에서 우리는 명확한 결과를 약속합니다.'
            : 'A clear outcome you can rely on, delivered with care.',
        })),
      };
    case 'testimonials':
      return {
        sectionKind: 'testimonials',
        headline: trimmedPrompt || (isKorean ? '고객 후기' : 'Trusted by clients'),
        items: [
          { title: 'Jane K.', body: isKorean ? '응답이 빠르고 정확했습니다.' : 'Fast, precise, and reliable.' },
          { title: 'Min S.', body: isKorean ? '꼭 필요한 조언을 받았습니다.' : 'They told us what we actually needed.' },
        ],
      };
    case 'cta':
      return {
        sectionKind: 'cta',
        headline: trimmedPrompt || (isKorean ? '지금 시작하세요' : 'Ready when you are'),
        subhead: isKorean ? '간단한 상담 요청만 보내주세요.' : 'Send us a short note to begin.',
        ctaLabel: isKorean ? '문의하기' : 'Contact us',
      };
    case 'faq':
      return {
        sectionKind: 'faq',
        headline: trimmedPrompt || (isKorean ? '자주 묻는 질문' : 'Frequently asked questions'),
        items: [
          {
            title: isKorean ? '얼마나 걸리나요?' : 'How long does it take?',
            body: isKorean ? '대부분의 절차는 5영업일 이내에 진행됩니다.' : 'Most engagements complete within 5 business days.',
          },
          {
            title: isKorean ? '비용은 어떻게 책정되나요?' : 'How does pricing work?',
            body: isKorean ? '고정 패키지 또는 시간 단가 중 선택할 수 있습니다.' : 'Fixed packages or hourly billing are both available.',
          },
        ],
      };
    default:
      return { sectionKind: 'hero', headline: 'Untitled' };
  }
}

function coerceSpec(parsed: z.infer<typeof llmSpecSchema>): AiSectionSpec {
  const spec: AiSectionSpec = {
    sectionKind: parsed.sectionKind,
    headline: parsed.headline,
  };
  if (parsed.subhead) spec.subhead = parsed.subhead;
  if (parsed.items && parsed.items.length > 0) spec.items = parsed.items;
  if (parsed.ctaLabel) spec.ctaLabel = parsed.ctaLabel;
  return spec;
}

async function callOpenAi(
  input: z.infer<typeof requestSchema>,
  apiKey: string,
): Promise<{ spec: AiSectionSpec; model: string } | { error: string; status: number }> {
  const model = sectionAssistantModel();
  const systemPrompt = buildSystemPrompt(input);
  const userPrompt = [
    'User prompt:',
    '"""',
    input.prompt,
    '"""',
    '',
    'Return only the JSON object.',
  ].join('\n');
  let response: Response;
  try {
    response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model,
        temperature: 0.6,
        max_tokens: 900,
        response_format: { type: 'json_object' },
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt },
        ],
      }),
    });
  } catch (err) {
    return { error: err instanceof Error ? err.message : 'OpenAI request failed.', status: 502 };
  }
  const payload = (await response.json().catch(() => ({}))) as OpenAiChatPayload;
  if (!response.ok) {
    return {
      error: payload.error?.message ?? 'AI section generator failed.',
      status: response.status,
    };
  }
  const content = payload.choices?.[0]?.message?.content;
  if (!content) {
    return { error: 'AI section generator returned empty content.', status: 502 };
  }
  let json: unknown;
  try {
    json = JSON.parse(content);
  } catch {
    return { error: 'AI section generator returned non-JSON content.', status: 502 };
  }
  const parsed = llmSpecSchema.safeParse(json);
  if (!parsed.success) {
    return { error: 'AI section generator returned an unexpected JSON shape.', status: 502 };
  }
  return { spec: coerceSpec(parsed.data), model };
}

export async function POST(request: NextRequest) {
  const auth = await guardMutation(request, { bucket: 'mutation', permission: 'edit-pages' });
  if (auth instanceof NextResponse) return auth;

  const raw = await request.json().catch(() => null);
  const parsed = requestSchema.safeParse(raw);
  if (!parsed.success) {
    return NextResponse.json(
      { ok: false, error: 'invalid_section_request', details: parsed.error.issues.slice(0, 3) },
      { status: 400 },
    );
  }

  const input = parsed.data;
  const apiKey = openAiApiKey();

  let spec: AiSectionSpec;
  let usedFallback = false;
  let model = sectionAssistantModel();
  if (!apiKey) {
    spec = fallbackSpec(input);
    usedFallback = true;
  } else {
    const result = await callOpenAi(input, apiKey);
    if ('error' in result) {
      return NextResponse.json(
        { ok: false, error: 'openai_section_failed', message: result.error },
        { status: result.status },
      );
    }
    spec = result.spec;
    model = result.model;
    if (input.sectionKind && spec.sectionKind !== input.sectionKind) {
      spec.sectionKind = input.sectionKind;
    }
  }

  const built = buildSectionNodes({ spec, locale: input.locale });
  return NextResponse.json({
    ok: true,
    model,
    usedFallback,
    sectionKind: spec.sectionKind,
    spec,
    rootId: built.rootId,
    nodes: built.nodes,
  });
}
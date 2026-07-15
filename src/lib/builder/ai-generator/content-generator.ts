import type { Locale } from '@/lib/locales';
import type { SiteSpec } from './site-spec';
import type { SiteBlueprint } from './template-selector';

/**
 * PR #11 — LLM-backed section content generator.
 *
 * Produces a `GeneratedSiteContent` keyed by section id. Nonproduction may
 * return a clearly-labelled local demo result, but production always fails
 * closed when the configured provider is unavailable or returns bad data.
 */

export interface GeneratedSection {
  sectionId: string;
  headline: string;
  body: string;
  ctaLabel?: string;
  bullets?: string[];
}

export interface GeneratedSiteContent {
  hero: GeneratedSection;
  sections: GeneratedSection[];
  metaDescription: string;
  /** Missing on legacy cached drafts. Only `openai` is provider-generated. */
  source?: 'openai' | 'local-demo';
  /** Missing on legacy cached drafts. Provider content is explicitly false. */
  stub?: boolean;
}

export type AiContentGenerationErrorCode =
  | 'ai_content_provider_unconfigured'
  | 'ai_content_provider_rejected'
  | 'ai_content_provider_unavailable'
  | 'ai_content_invalid_response';

const AI_CONTENT_ERROR_MESSAGES: Record<AiContentGenerationErrorCode, string> = {
  ai_content_provider_unconfigured: 'AI content provider is not configured.',
  ai_content_provider_rejected: 'AI content provider rejected the request.',
  ai_content_provider_unavailable: 'AI content provider is unavailable.',
  ai_content_invalid_response: 'AI content provider returned an invalid response.',
};

export class AiContentGenerationError extends Error {
  readonly code: AiContentGenerationErrorCode;
  readonly httpStatus: 502 | 503;

  constructor(code: AiContentGenerationErrorCode) {
    super(AI_CONTENT_ERROR_MESSAGES[code]);
    this.name = 'AiContentGenerationError';
    this.code = code;
    this.httpStatus = code === 'ai_content_provider_unconfigured' ? 503 : 502;
  }
}

export function isAiContentGenerationError(error: unknown): error is AiContentGenerationError {
  return error instanceof AiContentGenerationError;
}

export function isProviderGeneratedSiteContent(
  content: GeneratedSiteContent,
): content is GeneratedSiteContent & { source: 'openai'; stub: false } {
  return content.source === 'openai' && content.stub === false;
}

/** Local canned output is opt-in and must never be enabled in production. */
export function isLocalDemoGenerationAllowed(): boolean {
  return process.env.NODE_ENV !== 'production'
    && process.env.AI_BUILDER_ALLOW_LOCAL_DEMO === 'true';
}

const SECTION_PROMPTS: Record<string, string> = {
  hero: 'Top hero block. One-line headline + 1-2 supporting sentences + a CTA label.',
  about: 'About section. 2 short paragraphs that introduce the company.',
  services: 'Services overview. 4 bullets (service name + 1 sentence each).',
  expertise: 'Areas of expertise. 4 bullets with credentials.',
  team: 'Team section. Short intro + 3 bullets (name placeholder + role).',
  reviews: 'Reviews section. 3 short testimonial-style bullets.',
  process: 'Process section. 4 numbered steps describing how engagement works.',
  gallery: 'Gallery / portfolio intro. One paragraph + 1 CTA label.',
  pricing: 'Pricing intro. 3 tier bullets with one-line value props.',
  faq: 'FAQ section. 4 question/answer pairs as bullets.',
  contact: 'Contact section. Short copy + the address placeholder + CTA label.',
  cta: 'Final call-to-action. Punchy headline + button label.',
};

function fallbackSection(sectionId: string, spec: SiteSpec, blueprint: SiteBlueprint): GeneratedSection {
  const name = spec.companyName;
  const slogan = spec.slogan ?? '';
  const audience = spec.audience ? ` for ${spec.audience}` : '';
  const primaryGoal = spec.goals?.[0] ? ` Primary goal: ${spec.goals[0]}.` : '';
  const keyword = spec.brandKeywords?.[0] ? ` ${spec.brandKeywords[0]} should be visible in the brand voice.` : '';
  switch (sectionId) {
    case 'hero':
      return {
        sectionId,
        headline: slogan || `${name} — ${blueprint.heroHeadlineHint}`,
        body: `Trusted ${spec.industry.replace('-', ' ')} services${audience}. ${primaryGoal}${keyword}`.replace(/\s+/g, ' ').trim(),
        ctaLabel: '문의하기',
      };
    case 'services':
      return {
        sectionId,
        headline: 'Services',
        body: 'We deliver dependable outcomes across our core service lines.',
        bullets: spec.goals && spec.goals.length > 0
          ? spec.goals.slice(0, 4)
          : ['Consultation', 'Execution', 'Review', 'Ongoing support'],
      };
    case 'expertise':
      return {
        sectionId,
        headline: 'Expertise',
        body: 'Specialists with measurable track record.',
        bullets: ['Cross-border practice', 'Industry depth', 'Multi-locale team', 'Defensible outcomes'],
      };
    case 'reviews':
      return {
        sectionId,
        headline: 'What clients say',
        body: 'Direct quotes from recent engagements.',
        bullets: ['"Clear, fast, accountable."', '"Worth the engagement fee."', '"Saved us a quarter of headaches."'],
      };
    case 'contact':
      return {
        sectionId,
        headline: 'Contact',
        body: `Reach ${name} for an initial consultation.`,
        ctaLabel: '연락하기',
      };
    case 'cta':
      return {
        sectionId,
        headline: `Ready to work with ${name}?`,
        body: 'Book a short call and we will plan the next step together.',
        ctaLabel: '상담 예약',
      };
    default:
      return {
        sectionId,
        headline: sectionId.charAt(0).toUpperCase() + sectionId.slice(1),
        body: SECTION_PROMPTS[sectionId] ?? 'Section content.',
      };
  }
}

type LlmResult =
  | { ok: true; content: GeneratedSiteContent & { source: 'openai'; stub: false } }
  | { ok: false; code: AiContentGenerationErrorCode };

const LOCALE_NAME: Record<Locale, string> = {
  ko: 'Korean',
  'zh-hant': 'Traditional Chinese for Taiwan',
  en: 'English',
};

function buildLlmPrompt(spec: SiteSpec, blueprint: SiteBlueprint): string {
  const sectionList = ['hero', ...blueprint.sections.filter((s) => s !== 'hero')];
  return [
    `You are generating starter copy for a ${spec.industry} business website.`,
    `Tone: ${spec.tone}. Color preference: ${spec.colorPreference}.`,
    `Company: ${spec.companyName}. Slogan: ${spec.slogan ?? '(none provided)'}.`,
    `Audience: ${spec.audience ?? '(infer from industry)'}.`,
    `Business goals: ${spec.goals?.length ? spec.goals.join(', ') : '(infer from industry)'}.`,
    `Desired pages: ${spec.desiredPages?.length ? spec.desiredPages.join(', ') : '(infer from industry)'}.`,
    `Brand keywords: ${spec.brandKeywords?.length ? spec.brandKeywords.join(', ') : '(none provided)'}.`,
    `Constraints and must-haves: ${spec.constraints ?? '(none provided)'}.`,
    `Visual direction for image and layout art direction: ${spec.visualDirection ?? '(infer from industry and tone)'}.`,
    `Write in ${LOCALE_NAME[spec.locale]}.`,
    `Headline hint: ${blueprint.heroHeadlineHint}`,
    '',
    `For each section, return an object { sectionId, headline, body, ctaLabel?, bullets? }.`,
    `Sections (in order): ${sectionList.join(', ')}.`,
    `Also include a metaDescription (<= 160 chars) for the home page.`,
    `Return strict JSON: { "hero": {...}, "sections": [{...}], "metaDescription": "..." }.`,
  ].join('\n');
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function isGeneratedSection(value: unknown): value is GeneratedSection {
  if (!isRecord(value)) return false;
  if (typeof value.sectionId !== 'string' || !value.sectionId.trim()) return false;
  if (typeof value.headline !== 'string' || !value.headline.trim()) return false;
  if (typeof value.body !== 'string' || !value.body.trim()) return false;
  if (value.ctaLabel !== undefined && (
    typeof value.ctaLabel !== 'string'
    || !value.ctaLabel.trim()
  )) return false;
  if (value.bullets !== undefined && (
    !Array.isArray(value.bullets)
    || !value.bullets.every((bullet) => typeof bullet === 'string' && Boolean(bullet.trim()))
  )) return false;
  return true;
}

function parseGeneratedSiteContent(
  value: unknown,
  blueprint: SiteBlueprint,
): GeneratedSiteContent | null {
  if (!isRecord(value)) return null;
  if (!isGeneratedSection(value.hero) || value.hero.sectionId !== 'hero') return null;
  if (!Array.isArray(value.sections) || !value.sections.every(isGeneratedSection)) return null;
  if (
    typeof value.metaDescription !== 'string'
    || !value.metaDescription.trim()
    || value.metaDescription.trim().length > 160
  ) return null;
  const expectedSectionIds = blueprint.sections.filter((sectionId) => sectionId !== 'hero');
  if (new Set(expectedSectionIds).size !== expectedSectionIds.length) return null;
  if (value.sections.length !== expectedSectionIds.length) return null;
  if (!value.sections.every((section, index) => section.sectionId === expectedSectionIds[index])) return null;
  return {
    hero: value.hero,
    sections: value.sections,
    metaDescription: value.metaDescription,
  };
}

async function callOpenAi(spec: SiteSpec, blueprint: SiteBlueprint): Promise<LlmResult> {
  const apiKey = process.env.OPENAI_API_KEY ?? '';
  if (!apiKey) return { ok: false, code: 'ai_content_provider_unconfigured' };
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 20_000);
  try {
    const res = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      signal: controller.signal,
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: process.env.OPENAI_GENERATION_MODEL || 'gpt-4o-mini',
        temperature: 0.4,
        response_format: { type: 'json_object' },
        messages: [
          { role: 'system', content: 'You are a senior brand copywriter. Return compact JSON only.' },
          { role: 'user', content: buildLlmPrompt(spec, blueprint) },
        ],
      }),
    });
    const payload = (await res.json().catch(() => null)) as {
      choices?: Array<{ message?: { content?: string } }>;
    } | null;
    if (!res.ok) return { ok: false, code: 'ai_content_provider_rejected' };
    const content = payload?.choices?.[0]?.message?.content;
    if (!content) return { ok: false, code: 'ai_content_invalid_response' };
    try {
      const parsed = parseGeneratedSiteContent(JSON.parse(content), blueprint);
      if (!parsed) return { ok: false, code: 'ai_content_invalid_response' };
      return {
        ok: true,
        content: { ...parsed, source: 'openai', stub: false },
      };
    } catch {
      return { ok: false, code: 'ai_content_invalid_response' };
    }
  } catch {
    return { ok: false, code: 'ai_content_provider_unavailable' };
  } finally {
    clearTimeout(timeout);
  }
}

export async function generateSiteContent(spec: SiteSpec, blueprint: SiteBlueprint): Promise<GeneratedSiteContent> {
  const llm = await callOpenAi(spec, blueprint);
  if (llm.ok) return llm.content;

  if (!isLocalDemoGenerationAllowed()) {
    throw new AiContentGenerationError(llm.code);
  }

  // Nonproduction-only preview copy. API callers must not persist it as AI output.
  const heroFallback = fallbackSection('hero', spec, blueprint);
  const sections = blueprint.sections
    .filter((s) => s !== 'hero')
    .map((sectionId) => fallbackSection(sectionId, spec, blueprint));
  return {
    hero: heroFallback,
    sections,
    metaDescription: `${spec.companyName} — ${spec.industry.replace('-', ' ')} services. ${spec.slogan ?? ''}`.trim().slice(0, 160),
    source: 'local-demo',
    stub: true,
  };
}

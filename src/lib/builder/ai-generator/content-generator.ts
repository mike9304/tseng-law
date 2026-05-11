import type { Locale } from '@/lib/locales';
import type { SiteSpec } from './site-spec';
import type { SiteBlueprint } from './template-selector';

/**
 * PR #11 — LLM-backed (or stubbed) section content generator.
 *
 * Produces a `GeneratedSiteContent` keyed by section id. When OPENAI_API_KEY
 * is unset, falls back to deterministic stub content so the wizard still
 * produces a previewable page in dev.
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
  switch (sectionId) {
    case 'hero':
      return {
        sectionId,
        headline: slogan || `${name} — ${blueprint.heroHeadlineHint}`,
        body: `Trusted ${spec.industry.replace('-', ' ')} services tailored for your needs.`,
        ctaLabel: '문의하기',
      };
    case 'services':
      return {
        sectionId,
        headline: 'Services',
        body: 'We deliver dependable outcomes across our core service lines.',
        bullets: ['Consultation', 'Execution', 'Review', 'Ongoing support'],
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

interface LlmResult {
  ok: boolean;
  content?: GeneratedSiteContent;
  error?: string;
}

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
    `Write in ${LOCALE_NAME[spec.locale]}.`,
    `Headline hint: ${blueprint.heroHeadlineHint}`,
    '',
    `For each section, return an object { sectionId, headline, body, ctaLabel?, bullets? }.`,
    `Sections (in order): ${sectionList.join(', ')}.`,
    `Also include a metaDescription (<= 160 chars) for the home page.`,
    `Return strict JSON: { "hero": {...}, "sections": [{...}], "metaDescription": "..." }.`,
  ].join('\n');
}

async function callOpenAi(spec: SiteSpec, blueprint: SiteBlueprint): Promise<LlmResult> {
  const apiKey = process.env.OPENAI_API_KEY ?? '';
  if (!apiKey) return { ok: false, error: 'OPENAI_API_KEY unset' };
  try {
    const res = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
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
      error?: { message?: string };
    } | null;
    if (!res.ok) return { ok: false, error: payload?.error?.message ?? `${res.status}` };
    const content = payload?.choices?.[0]?.message?.content;
    if (!content) return { ok: false, error: 'empty content' };
    try {
      const parsed = JSON.parse(content) as GeneratedSiteContent;
      if (!parsed.hero || !Array.isArray(parsed.sections)) {
        return { ok: false, error: 'malformed payload' };
      }
      return { ok: true, content: parsed };
    } catch {
      return { ok: false, error: 'invalid JSON' };
    }
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : String(err) };
  }
}

export async function generateSiteContent(spec: SiteSpec, blueprint: SiteBlueprint): Promise<GeneratedSiteContent> {
  const llm = await callOpenAi(spec, blueprint);
  if (llm.ok && llm.content) return llm.content;

  // Deterministic fallback used in dev / when LLM unavailable.
  const heroFallback = fallbackSection('hero', spec, blueprint);
  const sections = blueprint.sections
    .filter((s) => s !== 'hero')
    .map((sectionId) => fallbackSection(sectionId, spec, blueprint));
  return {
    hero: heroFallback,
    sections,
    metaDescription: `${spec.companyName} — ${spec.industry.replace('-', ' ')} services. ${spec.slogan ?? ''}`.trim().slice(0, 160),
  };
}

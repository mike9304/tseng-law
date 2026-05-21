import { generateSiteContent, type GeneratedSiteContent } from './content-generator';
import { selectBlueprint, type SiteBlueprint } from './template-selector';
import type { SiteSpec } from './site-spec';
import {
  AI_GENERATOR_BLUEPRINT_VERSION,
  AI_GENERATOR_CONTENT_VERSION,
  AI_GENERATOR_PROMPT_CHANGELOG,
  resolveAiGeneratorPromptVersion,
  type GeneratedPromptVersionEntry,
} from './prompt-versions';

export {
  AI_GENERATOR_BLUEPRINT_VERSION,
  AI_GENERATOR_CONTENT_VERSION,
  AI_GENERATOR_PROMPT_CHANGELOG,
  AI_GENERATOR_PROMPT_VERSION,
  isSupportedAiGeneratorPromptVersion,
  resolveAiGeneratorPromptVersion,
  type GeneratedPromptVersionEntry,
} from './prompt-versions';

/**
 * PR #11 — End-to-end pipeline.
 *
 * 1) Pick a blueprint for the industry.
 * 2) Resolve a palette from colorPreference.
 * 3) Ask the content generator to produce headline/body/bullets per section.
 *
 * Returns a `GeneratedSiteDraft` the caller can hand to the canvas
 * importer in a follow-up; this round does not write to the site doc.
 */

export interface GeneratedSiteDraft {
  spec: SiteSpec;
  blueprint: SiteBlueprint;
  palette: SiteBlueprint['palettes'][keyof SiteBlueprint['palettes']];
  content: GeneratedSiteContent;
  plan: GeneratedSitePlan;
  generatedAt: string;
  promptVersion: string;
  blueprintVersion: string;
  contentVersion: string;
  promptChangelog: GeneratedPromptVersionEntry[];
}

export interface GenerateSiteDraftOptions {
  promptVersion?: string;
}

export interface GeneratedSitePlanPage {
  title: string;
  slug: string;
  purpose: string;
  sections: string[];
}

export interface GeneratedContentPlanItem {
  sectionId: string;
  title: string;
  intent: string;
}

export interface GeneratedSitePlan {
  sitemap: GeneratedSitePlanPage[];
  contentPlan: GeneratedContentPlanItem[];
  visualBrief: GeneratedVisualBrief;
  brandBrief: {
    audience: string;
    goals: string[];
    keywords: string[];
    constraints: string;
  };
}

export interface GeneratedVisualBrief {
  direction: string;
  imagePrompt: string;
  treatment: string;
  composition: string;
}

const DEFAULT_PAGE_SETS: Partial<Record<SiteSpec['industry'], string[]>> = {
  law: ['Home', 'Services', 'Lawyers', 'Columns', 'FAQ', 'Contact'],
  accounting: ['Home', 'Services', 'About', 'FAQ', 'Contact'],
  consulting: ['Home', 'Services', 'Case Studies', 'About', 'Contact'],
  medical: ['Home', 'Services', 'Team', 'FAQ', 'Contact'],
  dental: ['Home', 'Services', 'Team', 'FAQ', 'Contact'],
  restaurant: ['Home', 'Menu', 'Gallery', 'Reviews', 'Contact'],
  cafe: ['Home', 'Menu', 'Gallery', 'Reviews', 'Contact'],
  fitness: ['Home', 'Programs', 'Pricing', 'Trainers', 'Contact'],
  beauty: ['Home', 'Services', 'Pricing', 'Gallery', 'Contact'],
  photography: ['Home', 'Portfolio', 'Pricing', 'Reviews', 'Contact'],
  retail: ['Home', 'Shop', 'Collections', 'Reviews', 'Contact'],
  saas: ['Home', 'Features', 'Pricing', 'FAQ', 'Contact'],
  agency: ['Home', 'Services', 'Portfolio', 'About', 'Contact'],
};

const PAGE_ALIASES: Array<{
  match: RegExp;
  title: string;
  slug: string;
  purpose: string;
  sections: string[];
}> = [
  {
    match: /^(home|homepage|main|landing|홈|메인|첫\s*페이지)$/i,
    title: 'Home',
    slug: '/',
    purpose: '첫 방문자가 브랜드 가치, 핵심 서비스, 다음 행동을 빠르게 이해하는 진입 페이지입니다.',
    sections: ['hero', 'services', 'proof', 'cta'],
  },
  {
    match: /^(service|services|practice|업무|서비스|전문\s*분야|업무\s*분야)$/i,
    title: 'Services',
    slug: '/services',
    purpose: '주요 제공 서비스와 선택 기준을 정리해 상담 또는 구매 전환을 돕습니다.',
    sections: ['hero', 'services', 'process', 'faq', 'cta'],
  },
  {
    match: /^(about|company|profile|소개|회사\s*소개|사무소\s*소개)$/i,
    title: 'About',
    slug: '/about',
    purpose: '브랜드 배경, 운영 철학, 신뢰 근거를 설명하는 소개 페이지입니다.',
    sections: ['hero', 'about', 'team', 'proof'],
  },
  {
    match: /^(team|lawyers|attorneys|staff|변호사|팀|구성원|전문가)$/i,
    title: 'Lawyers',
    slug: '/lawyers',
    purpose: '전문가 프로필과 담당 영역을 보여줘 상담 전 신뢰를 형성합니다.',
    sections: ['hero', 'team', 'expertise', 'cta'],
  },
  {
    match: /^(columns|column|blog|insights|articles|칼럼|블로그|인사이트|글)$/i,
    title: 'Columns',
    slug: '/columns',
    purpose: '전문 지식과 최신 이슈를 축적해 검색 유입과 신뢰도를 높입니다.',
    sections: ['hero', 'featured-posts', 'categories', 'newsletter'],
  },
  {
    match: /^(faq|qna|questions|자주\s*묻는\s*질문|질문)$/i,
    title: 'FAQ',
    slug: '/faq',
    purpose: '반복 질문을 선제적으로 해소해 문의 품질을 높입니다.',
    sections: ['hero', 'faq', 'contact'],
  },
  {
    match: /^(contact|booking|consultation|문의|상담|예약|연락)$/i,
    title: 'Contact',
    slug: '/contact',
    purpose: '연락처, 상담 방식, 예약 동선을 한 화면에서 제공하는 전환 페이지입니다.',
    sections: ['hero', 'contact-form', 'map', 'hours'],
  },
  {
    match: /^(pricing|plans|fees|요금|가격|수임료|플랜)$/i,
    title: 'Pricing',
    slug: '/pricing',
    purpose: '가격 구조와 포함 범위를 투명하게 보여줘 구매 결정을 돕습니다.',
    sections: ['hero', 'pricing', 'faq', 'cta'],
  },
  {
    match: /^(reviews|testimonials|후기|리뷰|고객\s*사례)$/i,
    title: 'Reviews',
    slug: '/reviews',
    purpose: '고객 후기와 성과 근거를 모아 신뢰를 강화합니다.',
    sections: ['hero', 'reviews', 'case-highlights', 'cta'],
  },
];

const SECTION_INTENTS: Record<string, string> = {
  hero: '첫 화면에서 핵심 포지셔닝과 CTA를 제시합니다.',
  about: '브랜드 배경과 운영 철학을 짧게 설명합니다.',
  services: '사용자가 선택할 수 있는 주요 서비스 묶음을 보여줍니다.',
  expertise: '전문성, 관할, 경험을 증거 중심으로 정리합니다.',
  team: '전문가 프로필과 담당 영역을 연결합니다.',
  reviews: '후기와 사회적 증거로 불안을 낮춥니다.',
  process: '상담부터 결과까지의 진행 단계를 설명합니다.',
  gallery: '시각 자료나 포트폴리오로 분위기와 결과물을 보여줍니다.',
  pricing: '가격 또는 패키지 구조를 비교 가능하게 정리합니다.',
  faq: '전환 전 반복되는 질문을 먼저 해결합니다.',
  contact: '문의, 예약, 위치 정보를 모아 행동을 유도합니다.',
  cta: '마지막 화면에서 다음 행동을 명확하게 제안합니다.',
};

export async function generateSiteDraft(
  spec: SiteSpec,
  options: GenerateSiteDraftOptions = {},
): Promise<GeneratedSiteDraft> {
  const promptVersion = resolveAiGeneratorPromptVersion(options.promptVersion);
  const blueprint = selectBlueprint(spec.industry, spec.tone);
  const palette = blueprint.palettes[spec.colorPreference];
  const content = await generateSiteContent(spec, blueprint);
  const plan = buildSitePlan(spec, blueprint, content);
  return {
    spec,
    blueprint,
    palette,
    content,
    plan,
    generatedAt: new Date().toISOString(),
    promptVersion,
    blueprintVersion: AI_GENERATOR_BLUEPRINT_VERSION,
    contentVersion: AI_GENERATOR_CONTENT_VERSION,
    promptChangelog: AI_GENERATOR_PROMPT_CHANGELOG,
  };
}

function buildSitePlan(
  spec: SiteSpec,
  blueprint: SiteBlueprint,
  content: GeneratedSiteContent,
): GeneratedSitePlan {
  const pageInputs = normalizePageInputs(spec.desiredPages, spec.industry);
  const visualBrief = buildVisualBrief(spec, blueprint);
  return {
    sitemap: pageInputs.map((page) => pageFromInput(page, blueprint)),
    contentPlan: [content.hero, ...content.sections].map((section) => ({
      sectionId: section.sectionId,
      title: section.headline,
      intent: SECTION_INTENTS[section.sectionId] ?? `${section.sectionId} section prepared for the initial draft.`,
    })),
    visualBrief,
    brandBrief: {
      audience: spec.audience?.trim() || defaultAudience(spec.industry),
      goals: spec.goals && spec.goals.length > 0 ? spec.goals : defaultGoals(spec.industry),
      keywords: spec.brandKeywords && spec.brandKeywords.length > 0 ? spec.brandKeywords : defaultKeywords(spec),
      constraints: spec.constraints?.trim() || '초기 생성안에서는 필수 고지, 접근성, 모바일 가독성을 우선 확인합니다.',
    },
  };
}

function normalizePageInputs(pages: SiteSpec['desiredPages'], industry: SiteSpec['industry']): string[] {
  const source = pages && pages.length > 0 ? pages : DEFAULT_PAGE_SETS[industry] ?? ['Home', 'Services', 'About', 'Contact'];
  const seen = new Set<string>();
  const normalized: string[] = [];
  for (const page of source) {
    const key = page.trim().toLowerCase();
    if (!key || seen.has(key)) continue;
    seen.add(key);
    normalized.push(page.trim());
  }
  return normalized;
}

function pageFromInput(input: string, blueprint: SiteBlueprint): GeneratedSitePlanPage {
  const alias = PAGE_ALIASES.find((entry) => entry.match.test(input.trim()));
  if (alias) {
    return {
      title: alias.title,
      slug: alias.slug,
      purpose: alias.purpose,
      sections: alias.slug === '/' ? blueprint.sections : alias.sections,
    };
  }
  const title = toTitle(input);
  const slug = `/${slugify(input) || 'page'}`;
  return {
    title,
    slug,
    purpose: `${title} 페이지는 사이트 목표에 맞춘 보조 여정과 전환 지점을 담습니다.`,
    sections: ['hero', 'overview', 'details', 'cta'],
  };
}

function slugify(input: string): string {
  return input
    .trim()
    .toLowerCase()
    .replace(/&/g, ' and ')
    .replace(/[^a-z0-9가-힣]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 64);
}

function toTitle(input: string): string {
  const trimmed = input.trim();
  if (!trimmed) return 'Page';
  return trimmed.charAt(0).toUpperCase() + trimmed.slice(1);
}

function clipVisualText(value: string, maxLength: number): string {
  const compact = value.replace(/\s+/g, ' ').trim();
  if (compact.length <= maxLength) return compact;
  return `${compact.slice(0, Math.max(0, maxLength - 3)).trim()}...`;
}

function defaultVisualDirection(spec: SiteSpec): string {
  if (spec.industry === 'law') {
    return spec.locale === 'ko'
      ? '타이베이 도시감, 차분한 법률 사무소, 선명한 인물 없는 상담 장면, 신뢰 중심의 편집형 히어로'
      : 'Taipei city presence, calm law office detail, no identifiable people, trust-first editorial hero';
  }
  if (['restaurant', 'cafe', 'bakery'].includes(spec.industry)) {
    return 'warm interior, product texture, natural light, close editorial crop, inviting hospitality mood';
  }
  if (['medical', 'dental', 'fitness', 'yoga', 'beauty'].includes(spec.industry)) {
    return 'clean care environment, natural light, calm human-centered detail, premium wellness editorial';
  }
  if (['architecture', 'design-studio', 'photography', 'agency'].includes(spec.industry)) {
    return 'portfolio-forward composition, crisp materials, layered editorial crop, high-end studio presentation';
  }
  return 'brand-relevant hero image, polished editorial composition, tactile details, no text or logo in the image';
}

function visualTreatmentFor(spec: SiteSpec): string {
  if (spec.tone === 'luxury') return 'high-end editorial crop with restrained contrast, tactile surfaces, and generous negative space';
  if (spec.tone === 'playful') return 'bright lifestyle crop with optimistic color accents and a light layered card system';
  if (spec.tone === 'authoritative') return 'documentary-style hero image with strong hierarchy, dark overlay, and precise trust signals';
  if (spec.colorPreference === 'pastel') return 'soft daylight treatment with low contrast, clean card layers, and pastel accent rhythm';
  return 'professional split hero with layered media card, subtle image filter, proof cards, and accent chips';
}

function visualCompositionFor(spec: SiteSpec): string {
  if (['law', 'accounting', 'consulting', 'saas'].includes(spec.industry)) {
    return 'Left-aligned headline, compact proof metrics, right-side media card, mobile stacked after CTA cards.';
  }
  if (['restaurant', 'cafe', 'bakery', 'beauty', 'photography'].includes(spec.industry)) {
    return 'Image-led hero, sensory cards, compact category chips, mobile-first gallery rhythm.';
  }
  return 'Clear headline block, media-ready hero card, reusable content cards, and mobile-safe vertical stacking.';
}

function buildVisualBrief(spec: SiteSpec, blueprint: SiteBlueprint): GeneratedVisualBrief {
  const direction = clipVisualText(spec.visualDirection?.trim() || defaultVisualDirection(spec), 500);
  const keywords = spec.brandKeywords && spec.brandKeywords.length > 0
    ? spec.brandKeywords
    : defaultKeywords(spec);
  const promptParts = [
    `Create a polished website hero image for ${spec.companyName}.`,
    `Industry: ${spec.industry}. Tone: ${spec.tone}.`,
    `Direction: ${direction}.`,
    `Brand keywords: ${keywords.slice(0, 4).join(', ')}.`,
    `Layout intent: ${blueprint.heroHeadlineHint}.`,
    'No readable text, no logos, no private documents, no distorted hands or faces.',
  ];
  return {
    direction,
    imagePrompt: clipVisualText(promptParts.join(' '), 900),
    treatment: visualTreatmentFor(spec),
    composition: visualCompositionFor(spec),
  };
}

function defaultAudience(industry: SiteSpec['industry']): string {
  if (industry === 'law') return '상담 전 신뢰와 절차 설명이 필요한 한국어권 및 대만 관련 고객';
  if (industry === 'saas') return '도입 전 기능, 가격, 신뢰 근거를 비교하는 B2B 구매자';
  if (industry === 'restaurant' || industry === 'cafe') return '방문 전 메뉴, 분위기, 위치를 빠르게 확인하려는 고객';
  return '서비스를 비교하고 다음 행동을 결정하려는 잠재 고객';
}

function defaultGoals(industry: SiteSpec['industry']): string[] {
  if (industry === 'law') return ['상담 문의 증가', '전문성 신뢰 형성', '칼럼 기반 검색 유입 확보'];
  if (industry === 'saas') return ['제품 이해도 향상', '데모 신청 전환', '가격 비교 지원'];
  return ['문의 전환 증가', '브랜드 신뢰 형성', '서비스 선택 동선 단순화'];
}

function defaultKeywords(spec: SiteSpec): string[] {
  return [spec.companyName, spec.industry.replace('-', ' '), spec.tone].filter(Boolean);
}

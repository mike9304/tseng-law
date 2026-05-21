/**
 * F85 — AI Page generator depth.
 *
 * Pure synchronous builder that turns a high-level page brief
 * (purpose, audience, targetAction, industry, sectionHints) into a
 * structured PageSpec the existing `canvas-import.ts` / `section-builder.ts`
 * primitives can render.
 *
 * Composes `AiSectionSpec[]` from `section-builder.ts` so the route layer
 * can feed sections directly into `buildSectionNodes` per slice.
 */

import {
  AI_SECTION_KINDS,
  type AiSectionKind,
  type AiSectionSpec,
} from '@/lib/builder/ai-generator/section-builder';
import type { Locale } from '@/lib/locales';

export const PAGE_INTENTS = [
  'conversion',
  'informational',
  'storytelling',
  'directory',
  'support',
] as const;

export type PageIntent = (typeof PAGE_INTENTS)[number];

export const PAGE_LAYOUTS = ['standard', 'narrow', 'wide', 'split'] as const;
export type PageLayout = (typeof PAGE_LAYOUTS)[number];

export const HEADER_STYLES = ['minimal', 'standard', 'split'] as const;
export type HeaderStyle = (typeof HEADER_STYLES)[number];

export const FOOTER_STYLES = ['minimal', 'rich'] as const;
export type FooterStyle = (typeof FOOTER_STYLES)[number];

export interface PageBrief {
  purpose: string;
  audience: string;
  targetAction: string;
  industry?: string;
  locale: Locale;
  sectionHints?: AiSectionKind[];
  siteName?: string;
  brandTone?: string;
  intent?: PageIntent;
}

export interface PageHeaderConfig {
  style: HeaderStyle;
  showCta: boolean;
  ctaLabel?: string;
}

export interface PageFooterConfig {
  style: FooterStyle;
  columns: number;
  showNewsletter: boolean;
}

export interface PageSpec {
  intent: PageIntent;
  layout: PageLayout;
  locale: Locale;
  pageTitle: string;
  pageDescription: string;
  header: PageHeaderConfig;
  footer: PageFooterConfig;
  sections: AiSectionSpec[];
  reasoning: string;
}

const KOREAN_DEFAULTS = {
  helloHeadline: '신뢰할 수 있는 전문 파트너',
  helloSubhead: '명확한 다음 단계로 안내하는 전문 상담을 받아보세요.',
  featuresHeadline: '우리가 제공하는 것',
  featuresSubhead: '구체적이고 측정 가능한 결과로 정리했습니다.',
  testimonialsHeadline: '고객의 이야기',
  faqHeadline: '자주 묻는 질문',
  ctaHeadline: '지금 시작하세요',
  ctaSubhead: '간단한 상담 요청만 보내주세요.',
  ctaLabel: '문의하기',
  itemTitle: '핵심 가치',
  itemBody: '이 영역에서 우리는 명확한 결과를 약속합니다.',
};

const ENGLISH_DEFAULTS = {
  helloHeadline: 'A partner you can trust',
  helloSubhead: 'Expert guidance with a clear next step.',
  featuresHeadline: 'What we deliver',
  featuresSubhead: 'Specific, measurable outcomes you can plan around.',
  testimonialsHeadline: 'Trusted by clients',
  faqHeadline: 'Frequently asked questions',
  ctaHeadline: 'Ready when you are',
  ctaSubhead: 'Send us a short note to begin.',
  ctaLabel: 'Contact us',
  itemTitle: 'Value',
  itemBody: 'A clear outcome you can rely on, delivered with care.',
};

const CHINESE_DEFAULTS = {
  helloHeadline: '值得信賴的專業夥伴',
  helloSubhead: '提供明確下一步的專業諮詢服務。',
  featuresHeadline: '我們的服務',
  featuresSubhead: '具體可衡量的成果。',
  testimonialsHeadline: '客戶回饋',
  faqHeadline: '常見問題',
  ctaHeadline: '立即開始',
  ctaSubhead: '請傳送簡短的諮詢請求。',
  ctaLabel: '聯絡我們',
  itemTitle: '核心價值',
  itemBody: '我們承諾在每個領域提供明確的成果。',
};

function localeDefaults(locale: Locale) {
  if (locale === 'ko') return KOREAN_DEFAULTS;
  if (locale === 'zh-hant') return CHINESE_DEFAULTS;
  return ENGLISH_DEFAULTS;
}

const CONVERSION_KEYWORDS =
  /(consult|상담|諮詢|book|예약|預約|sign up|구독|register|trial|free|문의|enquir|inquire|contact|purchase|buy|구매)/i;
const SUPPORT_KEYWORDS =
  /(help|support|faq|문의|문제|해결|guide|how to|質問|問題)/i;
const STORYTELLING_KEYWORDS =
  /(about|story|이야기|소개|brand|brand story|품격|history|歷史)/i;
const DIRECTORY_KEYWORDS =
  /(menu|메뉴|catalog|카탈로그|portfolio|포트폴리오|team|팀|locations|지점)/i;

export function inferIntent(brief: PageBrief): PageIntent {
  if (brief.intent) return brief.intent;
  const blob =
    `${brief.purpose} ${brief.targetAction} ${brief.audience}`.trim();
  if (CONVERSION_KEYWORDS.test(blob)) return 'conversion';
  if (SUPPORT_KEYWORDS.test(blob)) return 'support';
  if (STORYTELLING_KEYWORDS.test(blob)) return 'storytelling';
  if (DIRECTORY_KEYWORDS.test(blob)) return 'directory';
  return 'informational';
}

const SECTION_SEQUENCE: Record<PageIntent, AiSectionKind[]> = {
  conversion: ['hero', 'features', 'testimonials', 'cta'],
  informational: ['hero', 'features', 'faq', 'cta'],
  storytelling: ['hero', 'features', 'testimonials', 'cta'],
  directory: ['hero', 'features', 'cta'],
  support: ['hero', 'faq', 'cta'],
};

const LAYOUT_FOR_INTENT: Record<PageIntent, PageLayout> = {
  conversion: 'standard',
  informational: 'standard',
  storytelling: 'split',
  directory: 'wide',
  support: 'narrow',
};

const HEADER_FOR_INTENT: Record<PageIntent, HeaderStyle> = {
  conversion: 'split',
  informational: 'standard',
  storytelling: 'minimal',
  directory: 'standard',
  support: 'minimal',
};

const FOOTER_FOR_INTENT: Record<PageIntent, FooterStyle> = {
  conversion: 'rich',
  informational: 'rich',
  storytelling: 'minimal',
  directory: 'rich',
  support: 'minimal',
};

function clamp(value: string, max: number): string {
  const compact = value.replace(/\s+/g, ' ').trim();
  if (compact.length <= max) return compact;
  return `${compact.slice(0, Math.max(0, max - 3)).trim()}...`;
}

function dedupeSectionKinds(kinds: AiSectionKind[]): AiSectionKind[] {
  const seen = new Set<AiSectionKind>();
  const out: AiSectionKind[] = [];
  for (const kind of kinds) {
    if (!AI_SECTION_KINDS.includes(kind)) continue;
    if (seen.has(kind)) continue;
    seen.add(kind);
    out.push(kind);
  }
  return out;
}

function sectionSequenceFor(
  brief: PageBrief,
  intent: PageIntent,
): AiSectionKind[] {
  const hinted = brief.sectionHints && brief.sectionHints.length > 0
    ? dedupeSectionKinds(brief.sectionHints)
    : [];
  const base = SECTION_SEQUENCE[intent];
  if (hinted.length === 0) return base;
  // Hinted kinds win, in order; missing baseline kinds are appended at end (no dups).
  const merged = [...hinted];
  for (const kind of base) {
    if (!merged.includes(kind)) merged.push(kind);
  }
  return merged;
}

function buildHeroSection(brief: PageBrief): AiSectionSpec {
  const d = localeDefaults(brief.locale);
  const headline = clamp(brief.purpose || d.helloHeadline, 90);
  const subhead = brief.audience
    ? clamp(`${d.helloSubhead} (${brief.audience})`, 200)
    : d.helloSubhead;
  return {
    sectionKind: 'hero',
    headline,
    subhead,
    ctaLabel: clamp(brief.targetAction || d.ctaLabel, 50),
  };
}

function buildFeaturesSection(brief: PageBrief): AiSectionSpec {
  const d = localeDefaults(brief.locale);
  const items = [1, 2, 3].map((index) => ({
    title: `${d.itemTitle} ${index}`,
    body: d.itemBody,
  }));
  return {
    sectionKind: 'features',
    headline: d.featuresHeadline,
    subhead: d.featuresSubhead,
    items,
  };
}

function buildTestimonialsSection(brief: PageBrief): AiSectionSpec {
  const d = localeDefaults(brief.locale);
  const items = [
    {
      title: brief.locale === 'ko' ? '김민지, CEO' : 'Jane K., CEO',
      body: brief.locale === 'ko'
        ? '응답이 빠르고 정확했습니다.'
        : 'Fast, precise, and reliable.',
    },
    {
      title: brief.locale === 'ko' ? '박지훈, COO' : 'Min S., COO',
      body: brief.locale === 'ko'
        ? '꼭 필요한 조언을 받았습니다.'
        : 'They told us what we actually needed.',
    },
  ];
  return { sectionKind: 'testimonials', headline: d.testimonialsHeadline, items };
}

function buildFaqSection(brief: PageBrief): AiSectionSpec {
  const d = localeDefaults(brief.locale);
  const items = [
    {
      title: brief.locale === 'ko'
        ? '얼마나 걸리나요?'
        : 'How long does it take?',
      body: brief.locale === 'ko'
        ? '대부분의 절차는 5영업일 이내에 진행됩니다.'
        : 'Most engagements complete within 5 business days.',
    },
    {
      title: brief.locale === 'ko'
        ? '비용은 어떻게 책정되나요?'
        : 'How does pricing work?',
      body: brief.locale === 'ko'
        ? '고정 패키지 또는 시간 단가 중 선택할 수 있습니다.'
        : 'Fixed packages or hourly billing are both available.',
    },
  ];
  return { sectionKind: 'faq', headline: d.faqHeadline, items };
}

function buildCtaSection(brief: PageBrief): AiSectionSpec {
  const d = localeDefaults(brief.locale);
  const ctaLabel = clamp(brief.targetAction || d.ctaLabel, 50);
  return {
    sectionKind: 'cta',
    headline: d.ctaHeadline,
    subhead: d.ctaSubhead,
    ctaLabel,
  };
}

function sectionFor(brief: PageBrief, kind: AiSectionKind): AiSectionSpec {
  switch (kind) {
    case 'hero':
      return buildHeroSection(brief);
    case 'features':
      return buildFeaturesSection(brief);
    case 'testimonials':
      return buildTestimonialsSection(brief);
    case 'faq':
      return buildFaqSection(brief);
    case 'cta':
      return buildCtaSection(brief);
    default:
      return buildHeroSection(brief);
  }
}

function buildHeader(brief: PageBrief, intent: PageIntent): PageHeaderConfig {
  const style = HEADER_FOR_INTENT[intent];
  const showCta = intent === 'conversion' || intent === 'directory';
  if (!showCta) return { style, showCta };
  const d = localeDefaults(brief.locale);
  return {
    style,
    showCta,
    ctaLabel: clamp(brief.targetAction || d.ctaLabel, 32),
  };
}

function buildFooter(intent: PageIntent): PageFooterConfig {
  const style = FOOTER_FOR_INTENT[intent];
  const columns = style === 'minimal' ? 1 : intent === 'conversion' ? 4 : 3;
  const showNewsletter = intent === 'conversion' || intent === 'informational';
  return { style, columns, showNewsletter };
}

function buildReasoning(
  brief: PageBrief,
  intent: PageIntent,
  sections: AiSectionKind[],
): string {
  const parts = [
    `Intent inferred as "${intent}" from purpose "${clamp(brief.purpose, 80)}".`,
    `Sequence: ${sections.join(' → ')}.`,
    `Layout "${LAYOUT_FOR_INTENT[intent]}" selected to fit the target action.`,
  ];
  if (brief.sectionHints && brief.sectionHints.length > 0) {
    parts.push(`Honoring section hints: ${brief.sectionHints.join(', ')}.`);
  }
  if (brief.industry) {
    parts.push(`Industry context: ${brief.industry}.`);
  }
  return parts.join(' ');
}

export function buildPageSpec(brief: PageBrief): PageSpec {
  const intent = inferIntent(brief);
  const sequence = sectionSequenceFor(brief, intent);
  const sections = sequence.map((kind) => sectionFor(brief, kind));
  const layout = LAYOUT_FOR_INTENT[intent];
  const header = buildHeader(brief, intent);
  const footer = buildFooter(intent);
  const pageTitle = clamp(brief.purpose || brief.targetAction || 'Page', 120);
  const pageDescription = clamp(
    brief.audience
      ? `${brief.purpose} — for ${brief.audience}.`
      : brief.purpose || 'AI generated page.',
    220,
  );
  return {
    intent,
    layout,
    locale: brief.locale,
    pageTitle,
    pageDescription,
    header,
    footer,
    sections,
    reasoning: buildReasoning(brief, intent, sequence),
  };
}

export function describePageIntent(intent: PageIntent): string {
  switch (intent) {
    case 'conversion':
      return 'Conversion';
    case 'informational':
      return 'Informational';
    case 'storytelling':
      return 'Storytelling';
    case 'directory':
      return 'Directory';
    case 'support':
      return 'Support';
    default:
      return 'Page';
  }
}
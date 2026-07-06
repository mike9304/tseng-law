import type { ColorPreference, Industry, Tone } from '@/lib/builder/ai-generator/site-spec';

export const DESIGNER_STYLE_CANDIDATE_IDS = [
  'editorial-trust',
  'conversion-clarity',
  'boutique-premium',
] as const;

export type DesignerStyleCandidateId = (typeof DESIGNER_STYLE_CANDIDATE_IDS)[number];

export interface DesignerScoreInput {
  industry: Industry;
  tone: Tone;
  colorPreference: ColorPreference;
  goals?: readonly string[];
  brandKeywords?: readonly string[];
  constraints?: string;
  audience?: string;
}

export interface DesignerScoreMetrics {
  score: number;
  reasons: string[];
  layoutFit: number;
  paletteFit: number;
  fitPreview: string;
  designPoolProfile: string;
  designPoolFit: number;
  designPoolSignals: string[];
}

export interface DesignerScoreResult extends DesignerScoreMetrics {
  id: DesignerStyleCandidateId;
  rank: number;
}

export interface DesignerScorePayloadRow {
  id: string;
  rank: number;
  score: number;
  layoutFit: number;
  paletteFit: number;
}

const PROFESSIONAL_INDUSTRIES: readonly Industry[] = [
  'law',
  'accounting',
  'consulting',
  'saas',
  'agency',
];

const CANDIDATE_SORT_LABELS: Record<DesignerStyleCandidateId, string> = {
  'boutique-premium': 'Boutique premium',
  'conversion-clarity': 'Conversion clarity',
  'editorial-trust': 'Editorial trust',
};

interface ScoreContext {
  brief: string;
  professionalIndustry: boolean;
  conversionGoal: boolean;
  premiumGoal: boolean;
  goalCount: number;
  brandKeywordCount: number;
  colorPreference: ColorPreference;
  tone: Tone;
}

interface MetricRule {
  when: (context: ScoreContext) => boolean;
  delta: number;
  reason?: string;
}

interface CandidateRuleSet {
  baseScore: number;
  baseLayoutFit: number;
  basePaletteFit: number;
  fitPreview: string;
  scoreRules: MetricRule[];
  layoutRules: MetricRule[];
  paletteRules: MetricRule[];
}

interface DesignPoolRuleSet {
  profile: string;
  baseFit: number;
  baseSignals: [string, string];
  fitRules: MetricRule[];
  signalRules: Array<{
    when: (context: ScoreContext) => boolean;
    truthy: string;
    falsy: string;
  }>;
}

const CANDIDATE_RULES: Record<DesignerStyleCandidateId, CandidateRuleSet> = {
  'editorial-trust': {
    baseScore: 74,
    baseLayoutFit: 82,
    basePaletteFit: 84,
    fitPreview: 'Credential rail + proof rhythm',
    scoreRules: [
      {
        when: (context) => context.professionalIndustry,
        delta: 12,
        reason: 'industry fit',
      },
      {
        when: (context) => context.tone === 'professional' || context.tone === 'authoritative',
        delta: 3,
        reason: 'tone fit',
      },
      {
        when: (context) => context.brandKeywordCount > 0,
        delta: 3,
        reason: 'brand proof',
      },
      {
        when: (context) => context.conversionGoal,
        delta: 2,
        reason: 'CTA support',
      },
    ],
    layoutRules: [
      {
        when: (context) => context.professionalIndustry,
        delta: 12,
      },
      {
        when: (context) => context.tone === 'professional' || context.tone === 'authoritative',
        delta: 2,
      },
    ],
    paletteRules: [
      {
        when: (context) => context.colorPreference === 'cool',
        delta: 8,
      },
    ],
  },
  'conversion-clarity': {
    baseScore: 72,
    baseLayoutFit: 80,
    basePaletteFit: 82,
    fitPreview: 'CTA dock + compact cards',
    scoreRules: [
      {
        when: (context) => context.conversionGoal,
        delta: 14,
        reason: 'conversion goal',
      },
      {
        when: (context) => context.goalCount > 1,
        delta: 2,
        reason: 'multi-goal scan',
      },
      {
        when: (context) => context.colorPreference === 'high-contrast',
        delta: 3,
        reason: 'contrast fit',
      },
    ],
    layoutRules: [
      {
        when: (context) => context.conversionGoal,
        delta: 10,
      },
      {
        when: (context) => context.goalCount > 1,
        delta: 2,
      },
    ],
    paletteRules: [
      {
        when: (context) => context.colorPreference === 'high-contrast',
        delta: 10,
      },
    ],
  },
  'boutique-premium': {
    baseScore: 70,
    baseLayoutFit: 78,
    basePaletteFit: 80,
    fitPreview: 'Premium whitespace + editorial lines',
    scoreRules: [
      {
        when: (context) => context.premiumGoal,
        delta: 14,
        reason: 'premium intent',
      },
      {
        when: (context) => context.professionalIndustry,
        delta: 3,
        reason: 'service fit',
      },
      {
        when: (context) => context.colorPreference === 'neutral' || context.colorPreference === 'pastel',
        delta: 3,
        reason: 'palette fit',
      },
    ],
    layoutRules: [
      {
        when: (context) => context.premiumGoal,
        delta: 9,
      },
      {
        when: (context) => context.professionalIndustry,
        delta: 2,
      },
    ],
    paletteRules: [
      {
        when: (context) => context.colorPreference === 'neutral' || context.colorPreference === 'pastel',
        delta: 11,
      },
    ],
  },
};

const DESIGN_POOL_RULES: Record<DesignerStyleCandidateId, DesignPoolRuleSet> = {
  'editorial-trust': {
    profile: 'law-editorial-credential',
    baseFit: 82,
    baseSignals: ['credential rhythm', 'reserved palette'],
    fitRules: [
      {
        when: (context) => context.professionalIndustry,
        delta: 8,
      },
      {
        when: (context) => context.colorPreference === 'cool',
        delta: 4,
      },
      {
        when: (context) => context.tone === 'professional' || context.tone === 'authoritative',
        delta: 2,
      },
    ],
    signalRules: [
      {
        when: (context) => context.professionalIndustry,
        truthy: 'credential rhythm',
        falsy: 'proof rhythm',
      },
      {
        when: (context) => context.colorPreference === 'cool',
        truthy: 'cool trust palette',
        falsy: 'reserved palette',
      },
    ],
  },
  'conversion-clarity': {
    profile: 'cta-dock-service-grid',
    baseFit: 80,
    baseSignals: ['CTA dock rhythm', 'clear action palette'],
    fitRules: [
      {
        when: (context) => context.conversionGoal,
        delta: 10,
      },
      {
        when: (context) => context.colorPreference === 'high-contrast',
        delta: 5,
      },
    ],
    signalRules: [
      {
        when: (context) => context.conversionGoal,
        truthy: 'CTA dock rhythm',
        falsy: 'service card rhythm',
      },
      {
        when: (context) => context.colorPreference === 'high-contrast',
        truthy: 'contrast action palette',
        falsy: 'clear action palette',
      },
    ],
  },
  'boutique-premium': {
    profile: 'boutique-linework-editorial',
    baseFit: 78,
    baseSignals: ['editorial whitespace', 'restrained accent palette'],
    fitRules: [
      {
        when: (context) => context.premiumGoal,
        delta: 10,
      },
      {
        when: (context) => context.colorPreference === 'neutral' || context.colorPreference === 'pastel',
        delta: 5,
      },
      {
        when: (context) => context.professionalIndustry,
        delta: 2,
      },
    ],
    signalRules: [
      {
        when: (context) => context.premiumGoal,
        truthy: 'premium whitespace',
        falsy: 'editorial whitespace',
      },
      {
        when: (context) => context.colorPreference === 'neutral' || context.colorPreference === 'pastel',
        truthy: 'soft restrained palette',
        falsy: 'restrained accent palette',
      },
    ],
  },
};

function createScoreContext(input: DesignerScoreInput): ScoreContext {
  const brief = searchableBrief(input);
  return {
    brief,
    professionalIndustry: PROFESSIONAL_INDUSTRIES.includes(input.industry),
    conversionGoal: /상담|문의|예약|전환|lead|conversion|booking|contact|cta/.test(brief),
    premiumGoal: input.tone === 'luxury'
      || /고급|프리미엄|premium|boutique|luxury|럭셔리/.test(brief),
    goalCount: (input.goals ?? []).length,
    brandKeywordCount: (input.brandKeywords ?? []).length,
    colorPreference: input.colorPreference,
    tone: input.tone,
  };
}

function applyRules(base: number, context: ScoreContext, rules: MetricRule[], reasons: string[]): number {
  return rules.reduce((current, rule) => {
    if (!rule.when(context)) return current;
    if (rule.reason) reasons.push(rule.reason);
    return current + rule.delta;
  }, base);
}

function buildDesignPoolSignals(context: ScoreContext, ruleSet: DesignPoolRuleSet): string[] {
  const signals = [...ruleSet.baseSignals];
  return ruleSet.signalRules.map((rule, index) => {
    const value = rule.when(context) ? rule.truthy : rule.falsy;
    signals[index] = value;
    return value;
  }).slice(0, 2);
}

function searchableBrief(input: DesignerScoreInput): string {
  return [
    ...(input.goals ?? []),
    ...(input.brandKeywords ?? []),
    input.constraints ?? '',
    input.audience ?? '',
  ].join(' ').toLowerCase();
}

export function scoreDesignerStyleCandidate(
  input: DesignerScoreInput,
  candidateId: DesignerStyleCandidateId,
): DesignerScoreMetrics {
  const context = createScoreContext(input);
  const candidate = CANDIDATE_RULES[candidateId];
  const designPoolRuleSet = DESIGN_POOL_RULES[candidateId];
  const reasons: string[] = [];
  const score = applyRules(candidate.baseScore, context, candidate.scoreRules, reasons);
  const layoutFit = applyRules(candidate.baseLayoutFit, context, candidate.layoutRules, []);
  const paletteFit = applyRules(candidate.basePaletteFit, context, candidate.paletteRules, []);

  return {
    score: Math.min(98, score),
    reasons: reasons.length > 0 ? reasons.slice(0, 2) : ['balanced baseline'],
    layoutFit: Math.min(98, layoutFit),
    paletteFit: Math.min(98, paletteFit),
    fitPreview: candidate.fitPreview,
    designPoolProfile: designPoolRuleSet.profile,
    designPoolFit: Math.min(98, applyRules(designPoolRuleSet.baseFit, context, designPoolRuleSet.fitRules, [])),
    designPoolSignals: buildDesignPoolSignals(context, designPoolRuleSet),
  };
}

export function scoreDesignerStyleCandidates(input: DesignerScoreInput): DesignerScoreResult[] {
  return DESIGNER_STYLE_CANDIDATE_IDS
    .map((candidateId) => ({
      id: candidateId,
      ...scoreDesignerStyleCandidate(input, candidateId),
    }))
    .sort((a, b) => (
      b.score - a.score
      || CANDIDATE_SORT_LABELS[a.id].localeCompare(CANDIDATE_SORT_LABELS[b.id])
    ))
    .map((candidate, index) => ({
      ...candidate,
      rank: index + 1,
    }));
}

export function serializeDesignerScorePayload(scores: readonly DesignerScorePayloadRow[]): string {
  return scores
    .map((score) => [
      score.id,
      score.rank,
      score.score,
      score.layoutFit,
      score.paletteFit,
    ].join(':'))
    .join('|');
}

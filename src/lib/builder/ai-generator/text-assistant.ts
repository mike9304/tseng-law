import { z } from 'zod';
import type { Locale } from '@/lib/locales';

export const TEXT_ASSISTANT_ACTIONS = [
  'rewrite',
  'expand',
  'shorten',
  'translate',
  'tone',
] as const;

export type TextAssistantAction = (typeof TEXT_ASSISTANT_ACTIONS)[number];

export const TEXT_ASSISTANT_TONES = [
  'formal',
  'casual',
  'persuasive',
  'concise',
  'warm',
  'authoritative',
] as const;

export type TextAssistantTone = (typeof TEXT_ASSISTANT_TONES)[number];

export const TEXT_ASSISTANT_TARGET_LOCALES = ['ko', 'zh-hant', 'en'] as const satisfies readonly Locale[];

export type TextAssistantTargetLocale = (typeof TEXT_ASSISTANT_TARGET_LOCALES)[number];

export const textAssistantSchema = z
  .object({
    text: z.string().trim().min(1).max(4000),
    action: z.enum(TEXT_ASSISTANT_ACTIONS),
    sourceLocale: z.enum(TEXT_ASSISTANT_TARGET_LOCALES).default('ko'),
    targetLocale: z.enum(TEXT_ASSISTANT_TARGET_LOCALES).optional(),
    tone: z.enum(TEXT_ASSISTANT_TONES).optional(),
    customPrompt: z.string().trim().max(600).optional(),
    siteName: z.string().trim().max(120).optional(),
    brandTone: z.string().trim().max(160).optional(),
    elementHint: z.string().trim().max(80).optional(),
  })
  .superRefine((value, ctx) => {
    if (value.action === 'translate' && !value.targetLocale) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['targetLocale'],
        message: 'targetLocale is required when action is "translate".',
      });
    }
    if (value.action === 'tone' && !value.tone) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['tone'],
        message: 'tone is required when action is "tone".',
      });
    }
  });

export type TextAssistantInput = z.infer<typeof textAssistantSchema>;

const LOCALE_NAME: Record<TextAssistantTargetLocale, string> = {
  ko: 'Korean (한국어)',
  'zh-hant': 'Traditional Chinese (繁體中文)',
  en: 'English',
};

const TONE_LABEL: Record<TextAssistantTone, string> = {
  formal: 'formal, polite, and professional',
  casual: 'casual, friendly, and approachable',
  persuasive: 'persuasive and confident, oriented toward conversion',
  concise: 'concise, punchy, and free of filler',
  warm: 'warm, reassuring, and human',
  authoritative: 'authoritative, expert, and trustworthy',
};

const ACTION_DIRECTIVE: Record<TextAssistantAction, (input: TextAssistantInput) => string> = {
  rewrite: () => 'Rewrite the source text. Preserve its meaning but improve clarity, flow, and word choice.',
  expand: () =>
    'Expand the source text into a fuller version with concrete supporting detail. Keep the original meaning and voice; do not invent unverifiable claims.',
  shorten: () =>
    'Shorten the source text. Keep the key meaning but cut redundancy and filler so the result is meaningfully tighter.',
  translate: (input) => {
    const target = input.targetLocale ? LOCALE_NAME[input.targetLocale] : LOCALE_NAME.ko;
    return `Translate the source text into ${target}. Preserve formatting, line breaks, and inline punctuation. Do not transliterate proper nouns unless natural.`;
  },
  tone: (input) => {
    const tone = input.tone ? TONE_LABEL[input.tone] : TONE_LABEL.formal;
    return `Rewrite the source text so it sounds ${tone}. Keep the same factual content and length range.`;
  },
};

function describeOutputLocale(input: TextAssistantInput): string {
  const locale = input.action === 'translate' && input.targetLocale ? input.targetLocale : input.sourceLocale;
  return LOCALE_NAME[locale];
}

export function buildTextAssistantPrompt(input: TextAssistantInput): {
  systemPrompt: string;
  userPrompt: string;
} {
  const directive = ACTION_DIRECTIVE[input.action](input);
  const outputLocale = describeOutputLocale(input);
  const systemLines = [
    'You are an expert website copy assistant working inside a Wix-style visual builder.',
    'Return only the rewritten text. Do not include quote marks, explanations, prefaces, or markdown fences.',
    'Preserve any existing line breaks unless the user explicitly requests a structural change.',
    `Respond in ${outputLocale}.`,
  ];
  if (input.siteName) {
    systemLines.push(`Site context: this copy lives on the ${input.siteName} website.`);
  }
  if (input.brandTone) {
    systemLines.push(`Brand voice guideline: ${input.brandTone}.`);
  }
  if (input.elementHint) {
    systemLines.push(`UI element hint: this text is used as ${input.elementHint}.`);
  }

  const userLines = [
    directive,
    '',
    'Source text:',
    '"""',
    input.text,
    '"""',
  ];
  if (input.customPrompt) {
    userLines.push('', `Additional guidance from the editor: ${input.customPrompt}`);
  }

  return {
    systemPrompt: systemLines.join('\n'),
    userPrompt: userLines.join('\n'),
  };
}

export function describeTextAssistantAction(input: Pick<TextAssistantInput, 'action' | 'targetLocale' | 'tone'>): string {
  switch (input.action) {
    case 'rewrite':
      return 'Rewrite';
    case 'expand':
      return 'Expand';
    case 'shorten':
      return 'Shorten';
    case 'translate':
      return input.targetLocale ? `Translate → ${LOCALE_NAME[input.targetLocale]}` : 'Translate';
    case 'tone':
      return input.tone ? `Tone → ${input.tone}` : 'Tone';
    default:
      return 'Rewrite';
  }
}

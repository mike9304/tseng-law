import { z } from 'zod';

/** Public inquiry language axes. originalLanguage is never inferred; originalText is never trimmed. */
export const PUBLIC_INQUIRY_LOCALES = [
  'ko',
  'zh-hant',
  'en',
  'ja',
  'vi',
  'id',
  'th',
  'fil',
] as const;

export const CONSULTATION_LANGUAGES = ['en', 'zh-hant', 'ja', 'ko'] as const;

export type InquiryLocale = (typeof PUBLIC_INQUIRY_LOCALES)[number];
export type ConsultationLanguage = (typeof CONSULTATION_LANGUAGES)[number];

export const inquiryLanguageSchema = z
  .object({
    uiLocale: z.enum(PUBLIC_INQUIRY_LOCALES),
    originalLanguage: z.string().trim().min(1).max(80),
    preferredConsultationLanguage: z.enum([
      ...CONSULTATION_LANGUAGES,
      'needs-method-confirmation',
    ]),
    originalText: z
      .string()
      .min(1)
      .max(10000)
      .refine((value) => value.trim().length > 0, 'originalText cannot be whitespace-only'),
    consent: z.literal(true),
  })
  .strict();

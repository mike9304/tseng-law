import { describe, expect, it } from 'vitest';
import {
  CONSULTATION_LANGUAGES,
  PUBLIC_INQUIRY_LOCALES,
  inquiryLanguageSchema,
  type ConsultationLanguage,
  type InquiryLocale,
} from '../intake-language-contract';

const PREFERRED_CONSULTATION_CHOICES = [
  ...CONSULTATION_LANGUAGES,
  'needs-method-confirmation',
] as const;

function valid(overrides: Record<string, unknown> = {}): Record<string, unknown> {
  return {
    uiLocale: 'ko',
    originalLanguage: 'ko',
    preferredConsultationLanguage: 'ko',
    originalText: '상담 요청합니다.',
    consent: true,
    ...overrides,
  };
}

describe('intake language contract',
  () => {
    it('exports the public inquiry and consultation language axes',
      () => {
        const uiLocales: readonly InquiryLocale[] = PUBLIC_INQUIRY_LOCALES;
        const consultationLanguages: readonly ConsultationLanguage[] = CONSULTATION_LANGUAGES;

        expect(uiLocales).toEqual(['ko', 'zh-hant', 'en', 'ja', 'vi', 'id', 'th', 'fil']);
        expect(consultationLanguages).toEqual(['en', 'zh-hant', 'ja', 'ko']);
        expect(PREFERRED_CONSULTATION_CHOICES).toHaveLength(5);
      });

    it('accepts every public ui locale with every consultation choice',
      () => {
        let accepted = 0;

        for (const uiLocale of PUBLIC_INQUIRY_LOCALES) {
          for (const preferredConsultationLanguage of PREFERRED_CONSULTATION_CHOICES) {
            const parsed = inquiryLanguageSchema.safeParse(
              valid({ uiLocale, preferredConsultationLanguage }),
            );
            if (parsed.success) {
              accepted += 1;
              expect(parsed.data.uiLocale).toBe(uiLocale);
              expect(parsed.data.preferredConsultationLanguage).toBe(
                preferredConsultationLanguage,
              );
            }
          }
        }

        expect(accepted).toBe(
          PUBLIC_INQUIRY_LOCALES.length * PREFERRED_CONSULTATION_CHOICES.length,
        );
      });

    it('rejects unsupported consultation language vi instead of falling back',
      () => {
        expect(
          inquiryLanguageSchema.safeParse(valid({ preferredConsultationLanguage: 'vi' })).success,
        ).toBe(false);
        expect(
          inquiryLanguageSchema.safeParse(valid({ preferredConsultationLanguage: 'fil' })).success,
        ).toBe(false);
        expect(inquiryLanguageSchema.safeParse(valid({ uiLocale: 'zh' })).success).toBe(false);
      });

    it('preserves originalText whitespace and Unicode Thai/Vietnamese without normalizing',
      () => {
        const originalText = '  สวัสดี  xin chào  你好\n\tline  ';
        const parsed = inquiryLanguageSchema.parse(
          valid({
            originalLanguage: 'th / vi',
            originalText,
          }),
        );

        expect(parsed.originalText).toBe(originalText);
        expect(parsed.originalText.startsWith('  ')).toBe(true);
        expect(parsed.originalText).toContain('\n\t');
        expect(parsed.originalLanguage).toBe('th / vi');
      });

    it('trims originalLanguage as BCP 47 or described text without inferring from originalText',
      () => {
        const parsed = inquiryLanguageSchema.parse(
          valid({
            originalLanguage: '  zh-Hant-TW  ',
            originalText: 'Hello from English-looking text',
            preferredConsultationLanguage: 'ja',
          }),
        );

        expect(parsed.originalLanguage).toBe('zh-Hant-TW');
        expect(parsed.originalText).toBe('Hello from English-looking text');
        expect(
          inquiryLanguageSchema.parse(
            valid({ originalLanguage: 'Cantonese (spoken at home)' }),
          ).originalLanguage,
        ).toBe('Cantonese (spoken at home)');
        expect(inquiryLanguageSchema.safeParse(valid({ originalLanguage: '   ' })).success).toBe(
          false,
        );
        expect(
          inquiryLanguageSchema.safeParse(valid({ originalLanguage: 'x'.repeat(81) })).success,
        ).toBe(false);
      });

    it('does not constrain preferred consultation language by original language',
      () => {
        expect(
          inquiryLanguageSchema.safeParse(
            valid({
              uiLocale: 'vi',
              originalLanguage: 'vi',
              preferredConsultationLanguage: 'en',
            }),
          ).success,
        ).toBe(true);
      });

    it('rejects blank and oversize originalText',
      () => {
        expect(inquiryLanguageSchema.safeParse(valid({ originalText: '' })).success).toBe(false);
        expect(inquiryLanguageSchema.safeParse(valid({ originalText: '   \n\t  ' })).success).toBe(
          false,
        );
        expect(
          inquiryLanguageSchema.safeParse(valid({ originalText: '한'.repeat(10000) })).success,
        ).toBe(true);
        expect(
          inquiryLanguageSchema.safeParse(valid({ originalText: '한'.repeat(10001) })).success,
        ).toBe(false);
      });

    it('rejects consent false or missing',
      () => {
        expect(inquiryLanguageSchema.safeParse(valid({ consent: false })).success).toBe(false);
        const body = valid();
        delete body.consent;
        expect(inquiryLanguageSchema.safeParse(body).success).toBe(false);
      });

    it('rejects unknown properties',
      () => {
        expect(inquiryLanguageSchema.safeParse(valid({ extra: 'nope' })).success).toBe(false);
      });

    it('rejects missing required axes',
      () => {
        for (const key of [
          'uiLocale',
          'originalLanguage',
          'preferredConsultationLanguage',
          'originalText',
          'consent',
        ] as const) {
          const body = valid();
          delete body[key];
          expect(inquiryLanguageSchema.safeParse(body).success).toBe(false);
        }
      });
  });

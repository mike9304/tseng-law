import { readFileSync } from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';

import { getConsultationCopy } from '@/lib/consultation/copy';
import { locales } from '@/lib/locales';

const productSourceFiles = [
  'src/components/ConsultationGuideSection.tsx',
  'src/data/intent-pages.ts',
  'src/app/api/consultation/submit/route.ts',
  'src/components/floating-ai-quick-replies.ts',
  'src/lib/consultation/copy.ts',
] as const;

const productSources = productSourceFiles.map((file) => ({
  file,
  source: readFileSync(path.join(process.cwd(), file), 'utf8'),
}));

describe('verified public consultation contact copy', () => {
  it('offers only email as the public preferred consultation channel', () => {
    for (const locale of locales) {
      const copy = getConsultationCopy(locale);

      expect(JSON.stringify(copy)).not.toMatch(/KakaoTalk|LINE/);
      expect(copy.preferredContactOptions.map(({ value }) => value)).toEqual(['email']);
    }
  });

  it('routes localized public consultation copy to email without phone or messenger claims', () => {
    for (const locale of locales) {
      const copy = getConsultationCopy(locale);
      const publicContactCopy = [
        copy.assistantFallbackError,
        copy.channelsDescription,
        copy.submitFailure,
        copy.placeholders.phoneOrMessenger,
        copy.fieldPrompts.phone_or_messenger,
      ].join(' ');

      expect(publicContactCopy).not.toHaveLength(0);
      expect(publicContactCopy).toMatch(
        locale === 'ko' ? /이메일/ : locale === 'zh-hant' ? /Email/ : /email/i,
      );
      expect(publicContactCopy).not.toMatch(
        locale === 'ko'
          ? /KakaoTalk|\bLINE\b|카카오|전화/
          : locale === 'zh-hant'
            ? /KakaoTalk|\bLINE\b|即時通訊|電話/
            : /KakaoTalk|\bLINE\b|messenger|phone/i,
      );
    }
  });

  it('contains no public Kakao or LINE claim in the five product source files', () => {
    for (const { file, source } of productSources) {
      expect(source, file).not.toMatch(/KakaoTalk|\bLINE\b|line\.me|lin\.ee/i);
    }
  });
});

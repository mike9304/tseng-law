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
  it('removes public LINE claims and the LINE preferred-contact option', () => {
    for (const locale of locales) {
      const copy = getConsultationCopy(locale);

      expect(JSON.stringify(copy)).not.toContain('LINE');
      expect(copy.preferredContactOptions.map(({ value }) => value)).toEqual([
        'email',
        'phone',
        'kakao',
      ]);
    }
  });

  it('keeps verified contact channels in the localized runtime copy', () => {
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
      expect(publicContactCopy).toContain('KakaoTalk');
      expect(copy.channelsDescription).toMatch(
        locale === 'ko' ? /이메일.*전화/ : locale === 'zh-hant' ? /Email.*電話/ : /email.*phone/,
      );
    }
  });

  it('contains no uppercase LINE claim in the five product source files', () => {
    for (const { file, source } of productSources) {
      expect(source, file).not.toContain('LINE');
    }
  });
});

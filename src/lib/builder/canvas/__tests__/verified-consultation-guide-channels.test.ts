import { readFileSync } from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';
import { createConsultationGuideSectionNodes } from '../decompose-page-shared';

const verifiedChannelCopy = {
  ko: '카카오톡, 이메일, 전화로 문의를 접수할 수 있습니다.',
  'zh-hant': '可透過 KakaoTalk、電子郵件與電話提出詢問。',
  en: 'You can reach us through KakaoTalk, email, or phone.',
} as const;

function textContentForGuide(locale: keyof typeof verifiedChannelCopy): string[] {
  return createConsultationGuideSectionNodes('verified-contact', 0, locale, 0).nodes
    .filter((node) => node.kind === 'text')
    .map((node) => node.content.text);
}

describe('verified builder consultation guide channels', () => {
  it.each(Object.entries(verifiedChannelCopy))(
    'decomposes the verified %s channel copy',
    (locale, expectedCopy) => {
      expect(textContentForGuide(locale as keyof typeof verifiedChannelCopy)).toContain(expectedCopy);
    },
  );

  it('keeps the builder consultation-guide source free of uppercase LINE claims', () => {
    const source = readFileSync(
      path.join(process.cwd(), 'src/lib/builder/canvas/decompose-page-shared.ts'),
      'utf8',
    );

    for (const expectedCopy of Object.values(verifiedChannelCopy)) {
      expect(source).toContain(expectedCopy);
    }
    expect(source).not.toContain('LINE');
  });
});

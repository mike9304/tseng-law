import { readFileSync } from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';
import {
  createConsultationGuideSectionNodes,
  createContactBlocksSectionNodes,
} from '../decompose-page-shared';
import { getConsultationPublicMailto } from '@/lib/consultation/public-contact';

const verifiedChannelCopy = {
  ko: '이메일과 전화로 문의를 접수할 수 있습니다.',
  'zh-hant': '可透過電子郵件與電話提出詢問。',
  en: 'You can reach us through email or phone.',
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
      const texts = textContentForGuide(locale as keyof typeof verifiedChannelCopy);
      expect(texts.join(' ')).toContain(expectedCopy);
    },
  );

  it('keeps the builder consultation-guide source free of uppercase LINE claims', () => {
    const source = readFileSync(
      path.join(process.cwd(), 'src/lib/builder/canvas/decompose-page-shared.ts'),
      'utf8',
    );

    expect(source).not.toContain('LINE');
    expect(source).not.toContain('KakaoTalk');
  });

  it('decomposes the official email CTA and sensitive-information warning', () => {
    const nodes = createContactBlocksSectionNodes('verified-contact', 0, 'ko', 0).nodes;
    const button = nodes.find((node) => node.id === 'verified-contact-contact-cta');
    const warning = nodes.find((node) => node.id === 'verified-contact-sensitive-information-warning');

    expect(button?.content).toMatchObject({
      label: '증준외 대만 변호사에게 이메일 상담',
      href: getConsultationPublicMailto('ko'),
      ariaLabel: '증준외 대만 변호사에게 이메일 상담',
    });
    expect(warning?.content).toMatchObject({
      text: expect.stringContaining('주민등록번호'),
    });
    expect(JSON.stringify(nodes)).not.toMatch(/KakaoTalk|카카오톡|LINE|라인/);
  });
});

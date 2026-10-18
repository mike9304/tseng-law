import { describe, expect, it } from 'vitest';
import {
  CONSULTATION_EMAIL,
  LAWYER_NAME_KO,
  LAWYER_NAME_ZH,
  getConsultationCtaLabel,
  getConsultationEmailTemplate,
  getConsultationPublicMailto,
  getEmailCopiedMessage,
  getSensitiveInformationWarning,
} from '@/lib/consultation/public-contact';
import { siteLocales } from '@/lib/locales';

const expectedTemplates = {
  ko: {
    subject: '[tseng-law.com 상담문의] 대만 법률 및 기업 업무 상담',
    greeting: '안녕하세요',
    items: [
      '이름:',
      '연락처(전화·이메일·메신저):',
      '사건 내용(언제, 어디서, 무슨 일이 있었는지):',
      '사건 관련 자료(있으면 민감정보를 제외한 사본 첨부):',
    ],
    caution: '※ 주민등록번호·여권번호·계좌번호 등 민감정보는 제외해 주세요.',
  },
  'zh-hant': {
    subject: '【tseng-law.com 法律諮詢】台灣法律及企業服務諮詢',
    greeting: '您好',
    items: [
      '姓名：',
      '聯絡方式（電話、電子郵件、通訊軟體）：',
      '事情經過（何時、何地、發生什麼事）：',
      '相關資料（如有，請附上已移除敏感資訊的副本）：',
    ],
    caution: '※ 請勿提供身分證字號、護照號碼、銀行帳號等敏感資訊。',
  },
  en: {
    subject: '[tseng-law.com Consultation] Taiwan Legal and Corporate Services',
    greeting: 'Hello,',
    items: [
      'Name:',
      'Contact details (phone, email or messaging app):',
      'Details of the matter (when, where and what happened):',
      'Related documents (if any, attach copies with sensitive information removed):',
    ],
    caution: 'Please leave out ID numbers, passport numbers, bank account numbers and other sensitive information.',
  },
  ja: {
    subject: '【tseng-law.com ご相談】台湾法務・企業業務に関するご相談',
    greeting: 'こんにちは',
    items: [
      'お名前：',
      'ご連絡先（電話・メール・メッセージアプリ）：',
      'ご相談内容（いつ、どこで、何があったか）：',
      '関連資料（あれば、個人情報などを伏せたコピーを添付）：',
    ],
    caution: '※ 身分証やパスポートの番号、銀行口座番号などは記載しないでください。',
  },
} as const;

describe('public consultation contact single source of truth', () => {
  it('keeps the verified attorney identity and recipient in one public module', () => {
    expect(CONSULTATION_EMAIL).toBe('wei@hoveringlaw.com.tw');
    expect(LAWYER_NAME_KO).toBe('증준외 대만 변호사');
    expect(LAWYER_NAME_ZH).toBe('曾雋崴律師');
  });

  it('builds locale-specific mailto links with encoded subject and body', () => {
    for (const locale of siteLocales) {
      const template = getConsultationEmailTemplate(locale);
      const href = getConsultationPublicMailto(locale);
      const parsed = new URL(href);

      expect(template.subject).toBe(expectedTemplates[locale].subject);
      expect(parsed.protocol).toBe('mailto:');
      expect(parsed.pathname).toBe('wei@hoveringlaw.com.tw');
      expect(parsed.searchParams.get('subject')).toBe(expectedTemplates[locale].subject);
      expect(parsed.searchParams.get('body')).toBe(template.body);
      expect(href).toBe(
        `mailto:${CONSULTATION_EMAIL}?subject=${encodeURIComponent(template.subject)}&body=${encodeURIComponent(template.body)}`,
      );
      expect(decodeURIComponent(href)).not.toMatch(/[\r\n](?:to|cc|bcc|from):/i);
    }
  });

  it.each(siteLocales)('keeps the %s draft to a plain greeting, four empty items and a final caution', (locale) => {
    const { body } = getConsultationEmailTemplate(locale);
    const { greeting, items, caution } = expectedTemplates[locale];

    expect(body.startsWith(`${greeting}\n\n`)).toBe(true);
    expect(body.split('\n')).toEqual([
      greeting,
      '',
      items[0],
      '',
      items[1],
      '',
      items[2],
      '',
      items[3],
      '',
      caution,
    ]);
    expect(body.endsWith(caution)).toBe(true);
    expect(body.endsWith('\n')).toBe(false);
    expect(body).not.toContain('\r');
    expect(body).not.toMatch(/증준외|曾雋崴|曾俊瑋|Tseng|변호사님|律師|弁護士|Attorney|Lawyer/i);
    expect(body).not.toMatch(/감사합니다|謝謝|Thank you|よろしくお願いいたします/i);
    expect(body).not.toMatch(/희망 상담 언어|希望使用的語言|Preferred language|ご希望の言語/i);
    expect(body).not.toMatch(/문의 분야|諮詢類型|Type of inquiry|ご相談分野/i);
    expect(body).not.toMatch(/Taiwan connection|Deadline or key dates|Where you are located|How you found us/i);
    expect(body).not.toMatch(/상담을 요청드립니다|我想就以下事項提出諮詢|I would like to request a consultation|下記の件について相談を希望/i);
  });

  it('provides localized CTA, copy confirmation, and sensitive-data warning text', () => {
    expect(getConsultationCtaLabel('ko')).toBe('증준외 대만 변호사에게 이메일 상담');
    expect(getConsultationCtaLabel('zh-hant')).toBe('寄信諮詢曾雋崴律師');
    expect(getConsultationCtaLabel('en')).toBe('Email Attorney Tseng for Consultation');
    expect(getEmailCopiedMessage('ko')).toBe('이메일 주소가 복사되었습니다.');
    expect(getEmailCopiedMessage('zh-hant')).toBe('電子郵件地址已複製。');
    expect(getEmailCopiedMessage('en')).toBe('Email address copied.');

    for (const locale of siteLocales) {
      const warning = getSensitiveInformationWarning(locale);
      expect(warning.length).toBeGreaterThan(70);
    }
  });
});

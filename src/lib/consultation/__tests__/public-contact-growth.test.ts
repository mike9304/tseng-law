import { describe, expect, it } from 'vitest';
import {
  getConsultationEmailTemplate,
  getConsultationPublicEmail,
  getConsultationPublicMailto,
  getSensitiveInformationWarning,
} from '../public-contact';

const NON_EN_LOCALES = ['ko', 'zh-hant', 'ja'] as const;

const NON_EN_TEMPLATES = {
  ko: {
    subject: '[tseng-law.com 상담문의] 대만 법률 및 기업 업무 상담',
    body: [
      '안녕하세요',
      '',
      '이름:',
      '',
      '연락처(전화·이메일·메신저):',
      '',
      '사건 내용(언제, 어디서, 무슨 일이 있었는지):',
      '',
      '사건 관련 자료(있으면 민감정보를 제외한 사본 첨부):',
      '',
      '※ 주민등록번호·여권번호·계좌번호 등 민감정보는 제외해 주세요.',
    ].join('\n'),
  },
  'zh-hant': {
    subject: '【tseng-law.com 法律諮詢】台灣法律及企業服務諮詢',
    body: [
      '您好',
      '',
      '姓名：',
      '',
      '聯絡方式（電話、電子郵件、通訊軟體）：',
      '',
      '事情經過（何時、何地、發生什麼事）：',
      '',
      '相關資料（如有，請附上已移除敏感資訊的副本）：',
      '',
      '※ 請勿提供身分證字號、護照號碼、銀行帳號等敏感資訊。',
    ].join('\n'),
  },
  ja: {
    subject: '【tseng-law.com ご相談】台湾法務・企業業務に関するご相談',
    body: [
      'こんにちは',
      '',
      'お名前：',
      '',
      'ご連絡先（電話・メール・メッセージアプリ）：',
      '',
      'ご相談内容（いつ、どこで、何があったか）：',
      '',
      '関連資料（あれば、個人情報などを伏せたコピーを添付）：',
      '',
      '※ 身分証やパスポートの番号、銀行口座番号などは記載しないでください。',
    ].join('\n'),
  },
} as const;

describe('public-contact concise intake alignment', () => {
  it('does not drift non-English mail templates or mailto encoding', () => {
    for (const locale of NON_EN_LOCALES) {
      const template = NON_EN_TEMPLATES[locale];
      expect(getConsultationEmailTemplate(locale)).toEqual(template);
      expect(getConsultationPublicMailto(locale)).toBe(
        `mailto:${getConsultationPublicEmail()}?subject=${encodeURIComponent(template.subject)}&body=${encodeURIComponent(template.body)}`,
      );
    }
  });

  it('collects four EN items without extra intake questions or a citizenship prohibition', () => {
    const body = getConsultationEmailTemplate('en').body;
    const fields = [
      'Name:',
      'Contact details (phone, email or messaging app):',
      'Details of the matter (when, where and what happened):',
      'Related documents (if any, attach copies with sensitive information removed):',
    ];

    let lastIndex = -1;
    for (const field of fields) {
      const index = body.indexOf(field);
      expect(index).toBeGreaterThan(lastIndex);
      lastIndex = index;
    }

    expect(body).not.toMatch(
      /Type of inquiry|Taiwan connection|Deadline or key dates|Preferred language|Where you are located|How you found us/,
    );
    expect((body.match(/passport numbers/g) || []).length).toBe(1);
    expect(body).not.toMatch(
      /citizenship is not required|do not send citizenship|I am not attaching files|within \d+|business day|hours?\b.*reply|US law|attorney-client/i,
    );
    expect(getConsultationPublicMailto('en')).toMatch(
      /^mailto:wei@hoveringlaw\.com\.tw\?subject=/,
    );
    expect(getConsultationPublicMailto('en')).toContain(
      encodeURIComponent('Related documents (if any, attach copies with sensitive information removed):'),
    );
  });

  it('keeps the EN sensitive-information warning aligned with first-email scope', () => {
    const warning = getSensitiveInformationWarning('en');
    expect(warning).toMatch(/passport/i);
    expect(warning).toMatch(/instruct/i);
    expect(warning).not.toMatch(/citizenship is not required|citizenship and attachments are not required/i);
    expect(getSensitiveInformationWarning('ja')).toContain('機微情報');
    expect(getSensitiveInformationWarning('ko')).toContain('민감정보');
  });
});

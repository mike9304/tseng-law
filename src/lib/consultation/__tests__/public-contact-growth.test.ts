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
      '안녕하세요, 증준외 대만 변호사님.',
      '',
      '아래 내용으로 상담을 요청드립니다.',
      '',
      '이름 또는 회사명:',
      '연락 가능한 이메일:',
      '연락 가능한 전화번호:',
      '문의 분야:',
      '사건 또는 업무 개요:',
      '희망 상담 언어: 한국어 / 中文 / English / 日本語',
      '',
      '※ 초기 문의에는 주민등록번호, 여권번호, 계좌번호, 신분증 원본 등 민감정보를 포함하지 않겠습니다. 필요한 자료는 담당 변호사의 안내 후 안전한 방식으로 제출하겠습니다.',
      '',
      '감사합니다.',
    ].join('\n'),
  },
  'zh-hant': {
    subject: '【tseng-law.com 法律諮詢】台灣法律及企業服務諮詢',
    body: [
      '曾雋崴律師您好：',
      '',
      '我想就以下事項提出諮詢。',
      '',
      '姓名或公司名稱：',
      '電子郵件：',
      '聯絡電話：',
      '諮詢類型：',
      '案件或業務概要：',
      '希望使用的語言：中文 / 한국어 / English / 日本語',
      '',
      '※ 初次聯絡時不提供身分證字號、護照號碼、銀行帳戶資料或證件正本等敏感資訊。相關文件將於律師另行指示後，以安全方式提供。',
      '',
      '謝謝。',
    ].join('\n'),
  },
  ja: {
    subject: '【tseng-law.com ご相談】台湾法務・企業業務に関するご相談',
    body: [
      '曾雋崴弁護士様',
      '',
      '下記の件について相談を希望いたします。',
      '',
      'お名前または会社名：',
      'メールアドレス：',
      '電話番号：',
      'ご相談分野：',
      '案件または業務の概要：',
      'ご希望の言語：日本語 / 中文 / 한국어 / English',
      '',
      '※ 初回のお問い合わせには、旅券番号、身分証番号、銀行口座情報、身分証明書の原本などの機微情報を記載しません。必要な資料は、弁護士から案内を受けた後、安全な方法で提出します。',
      '',
      'よろしくお願いいたします。',
    ].join('\n'),
  },
} as const;

describe('public-contact English intake alignment', () => {
  it('does not drift non-English mail templates or mailto encoding', () => {
    for (const locale of NON_EN_LOCALES) {
      const template = NON_EN_TEMPLATES[locale];
      expect(getConsultationEmailTemplate(locale)).toEqual(template);
      expect(getConsultationPublicMailto(locale)).toBe(
        `mailto:${getConsultationPublicEmail()}?subject=${encodeURIComponent(template.subject)}&body=${encodeURIComponent(template.body)}`,
      );
    }
  });

  it('collects EN fit-check fields and treats citizenship as unasked rather than forbidden', () => {
    const body = getConsultationEmailTemplate('en').body;
    const fields = [
      'Type of inquiry:',
      'Taiwan connection (counterparty, entity, property, residence, etc.):',
      'Deadline or key dates, if any:',
      'Brief description:',
      'Preferred language: English / Korean / Chinese / Japanese',
      'Where you are located, time zone, and preferred contact method (optional):',
      'How you found us (optional):',
    ];

    let lastIndex = -1;
    for (const field of fields) {
      const index = body.indexOf(field);
      expect(index).toBeGreaterThan(lastIndex);
      lastIndex = index;
    }

    expect((body.match(/passport numbers/g) || []).length).toBe(1);
    expect(body).not.toMatch(
      /citizenship is not required|do not send citizenship|I am not attaching files|within \d+|business day|hours?\b.*reply|US law|attorney-client/i,
    );
    expect(getConsultationPublicMailto('en')).toMatch(
      /^mailto:wei@hoveringlaw\.com\.tw\?subject=/,
    );
    expect(getConsultationPublicMailto('en')).toContain(
      encodeURIComponent('Taiwan connection (counterparty, entity, property, residence, etc.):'),
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

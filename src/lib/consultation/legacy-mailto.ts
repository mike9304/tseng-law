import type { SiteLocale } from '@/lib/locales';
import { getConsultationPublicMailto } from './public-contact';

// Frozen link used by the July home fingerprint and the render-time upgrade.
export const JULY_CONSULTATION_MAILTO = 'mailto:wei@hoveringlaw.com.tw?subject='
  + encodeURIComponent('【tseng-law.com 法律諮詢】台灣法律及企業服務諮詢')
  + '&body=' + encodeURIComponent([
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
  ].join('\n'));

// Keep the historical address, subjects and bodies frozen independently of current copy.
function historicalMailto(subject: string, lines: readonly string[]): string {
  return `mailto:wei@hoveringlaw.com.tw?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(lines.join('\n'))}`;
}

// Exact variants from public-contact.ts history through daa10e7e. The older
// d509c0284/f0a9d6c02 bare address has no draft or locale and must stay untouched.
const HISTORICAL_CONSULTATION_LOCALES = new Map<string, SiteLocale>([
  // ko: daa10e7e, 5d97ff583, f262fb5e5, ceac790d8.
  [historicalMailto('[tseng-law.com 상담문의] 대만 법률 및 기업 업무 상담', [
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
  ]), 'ko'],
  // zh-hant: daa10e7e, 5d97ff583, f262fb5e5, ceac790d8.
  [JULY_CONSULTATION_MAILTO, 'zh-hant'],
  // en: daa10e7e, 5d97ff583.
  [historicalMailto('[tseng-law.com Consultation] Taiwan Legal and Corporate Services', [
    'Dear Attorney Tseng,',
    '',
    'I would like to request a consultation regarding the following matter.',
    '',
    'Name or company:',
    'Email:',
    'Phone:',
    'Type of inquiry:',
    'Taiwan connection (counterparty, entity, property, residence, etc.):',
    'Deadline or key dates, if any:',
    'Brief description:',
    'Preferred language: English',
    'Where you are located, time zone, and preferred contact method (optional):',
    'How you found us (optional):',
    '',
    'Please note that I will not include passport numbers, identification numbers, bank account information, or original identity documents in this initial email. Sensitive materials will be provided through a secure method after receiving instructions.',
    '',
    'Thank you.',
  ]), 'en'],
  // ja: daa10e7e, 5d97ff583.
  [historicalMailto('【tseng-law.com ご相談】台湾法務・企業業務に関するご相談', [
    '曾雋崴弁護士様',
    '',
    '下記の件について相談を希望いたします。',
    '',
    'お名前または会社名：',
    'メールアドレス：',
    '電話番号：',
    'ご相談分野：',
    '案件または業務の概要：',
    'ご希望の言語：日本語',
    '',
    '※ 初回のお問い合わせには、旅券番号、身分証番号、銀行口座情報、身分証明書の原本などの機微情報を記載しません。必要な資料は、弁護士から案内を受けた後、安全な方法で提出します。',
    '',
    'よろしくお願いいたします。',
  ]), 'ja'],
  // en: f262fb5e5.
  [historicalMailto('[tseng-law.com Consultation] Taiwan Legal and Corporate Services', [
    'Dear Attorney Tseng,',
    '',
    'I would like to request a consultation regarding the following matter.',
    '',
    'Name or company:',
    'Email:',
    'Phone:',
    'Type of inquiry:',
    'Taiwan connection (counterparty, entity, property, residence, etc.):',
    'Deadline or key dates, if any:',
    'Brief description:',
    'Preferred language: English / Korean / Chinese / Japanese',
    'Where you are located, time zone, and preferred contact method (optional):',
    'How you found us (optional):',
    '',
    'Please note that I will not include passport numbers, identification numbers, bank account information, or original identity documents in this initial email. Sensitive materials will be provided through a secure method after receiving instructions.',
    '',
    'Thank you.',
  ]), 'en'],
  // ja: f262fb5e5, ceac790d8, f93807c10.
  [historicalMailto('【tseng-law.com ご相談】台湾法務・企業業務に関するご相談', [
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
  ]), 'ja'],
  // en: ceac790d8.
  [historicalMailto('[tseng-law.com Consultation] Taiwan Legal and Corporate Services', [
    'Dear Attorney Tseng,',
    '',
    'I would like to request a consultation regarding the following matter.',
    '',
    'Name or company:',
    'Email:',
    'Phone:',
    'Type of inquiry:',
    'Brief description:',
    'Preferred language: English / Korean / Chinese / Japanese',
    '',
    'Please note that I will not include passport numbers, identification numbers, bank account information, or original identity documents in this initial email. Sensitive materials will be provided through a secure method after receiving instructions.',
    '',
    'Thank you.',
  ]), 'en'],
  // ko: f93807c10.
  [historicalMailto('[tseng-law.com 상담문의] 대만 법률 및 기업 업무 상담', [
    '안녕하세요, 증준외 대만 변호사님.',
    '',
    '아래 내용으로 상담을 요청드립니다.',
    '',
    '이름 또는 회사명:',
    '연락 가능한 이메일:',
    '연락 가능한 전화번호:',
    '문의 분야:',
    '사건 또는 업무 개요:',
    '희망 상담 언어: 한국어 / 中文 / English',
    '',
    '※ 초기 문의에는 주민등록번호, 여권번호, 계좌번호, 신분증 원본 등 민감정보를 포함하지 않겠습니다. 필요한 자료는 담당 변호사의 안내 후 안전한 방식으로 제출하겠습니다.',
    '',
    '감사합니다.',
  ]), 'ko'],
  // zh-hant: f93807c10.
  [historicalMailto('【tseng-law.com 法律諮詢】台灣法律及企業服務諮詢', [
    '曾雋崴律師您好：',
    '',
    '我想就以下事項提出諮詢。',
    '',
    '姓名或公司名稱：',
    '電子郵件：',
    '聯絡電話：',
    '諮詢類型：',
    '案件或業務概要：',
    '希望使用的語言：中文 / 한국어 / English',
    '',
    '※ 初次聯絡時不提供身分證字號、護照號碼、銀行帳戶資料或證件正本等敏感資訊。相關文件將於律師另行指示後，以安全方式提供。',
    '',
    '謝謝。',
  ]), 'zh-hant'],
  // en: f93807c10.
  [historicalMailto('[tseng-law.com Consultation] Taiwan Legal and Corporate Services', [
    'Dear Attorney Tseng,',
    '',
    'I would like to request a consultation regarding the following matter.',
    '',
    'Name or company:',
    'Email:',
    'Phone:',
    'Type of inquiry:',
    'Brief description:',
    'Preferred language: English / Korean / Chinese',
    '',
    'Please note that I will not include passport numbers, identification numbers, bank account information, or original identity documents in this initial email. Sensitive materials will be provided through a secure method after receiving instructions.',
    '',
    'Thank you.',
  ]), 'en'],
]);

/** Render only: exact stock hrefs select their own locale; authored links stay intact. */
export function upgradeLegacyConsultationMailto(href: string): string {
  const locale = HISTORICAL_CONSULTATION_LOCALES.get(href);
  return locale ? getConsultationPublicMailto(locale) : href;
}

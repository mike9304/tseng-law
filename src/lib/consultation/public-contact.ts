import type { Locale, SiteLocale } from '@/lib/locales';

export const CONSULTATION_EMAIL = 'wei@hoveringlaw.com.tw';
export const LAWYER_NAME_KO = '증준외 대만 변호사';
export const LAWYER_NAME_ZH = '曾雋崴律師';

export type ConsultationEmailTemplate = {
  subject: string;
  body: string;
};

const CONSULTATION_EMAIL_TEMPLATES: Record<SiteLocale, ConsultationEmailTemplate> = {
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
  en: {
    subject: '[tseng-law.com Consultation] Taiwan Legal and Corporate Services',
    body: [
      'Hello,',
      '',
      'Name:',
      '',
      'Contact details (phone, email or messaging app):',
      '',
      'Details of the matter (when, where and what happened):',
      '',
      'Related documents (if any, attach copies with sensitive information removed):',
      '',
      'Please leave out ID numbers, passport numbers, bank account numbers and other sensitive information.',
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
};

export function getConsultationPublicEmail(): string {
  return CONSULTATION_EMAIL;
}

export function getConsultationEmailTemplate(locale: SiteLocale = 'ko'): ConsultationEmailTemplate {
  return CONSULTATION_EMAIL_TEMPLATES[locale];
}

export function getConsultationPublicMailto(locale: SiteLocale = 'ko'): string {
  const template = getConsultationEmailTemplate(locale);
  return `mailto:${getConsultationPublicEmail()}?subject=${encodeURIComponent(template.subject)}&body=${encodeURIComponent(template.body)}`;
}

export function getConsultationCtaLabel(locale: SiteLocale): string {
  if (locale === 'ko') return '증준외 대만 변호사에게 이메일 상담';
  if (locale === 'zh-hant') return '寄信諮詢曾雋崴律師';
  if (locale === 'ja') return '曾雋崴弁護士にメールで相談';
  return 'Email Attorney Tseng for Consultation';
}

export function getOfficialConsultationEmailLabel(locale: SiteLocale): string {
  if (locale === 'ko') return '공식 상담 이메일';
  if (locale === 'zh-hant') return '官方諮詢信箱';
  if (locale === 'ja') return '公式相談メール';
  return 'Official consultation email';
}

export function getCopyEmailLabel(locale: SiteLocale): string {
  if (locale === 'ko') return '이메일 주소 복사';
  if (locale === 'zh-hant') return '複製電子郵件地址';
  if (locale === 'ja') return 'メールアドレスをコピー';
  return 'Copy email address';
}

export function getEmailCopiedMessage(locale: SiteLocale): string {
  if (locale === 'ko') return '이메일 주소가 복사되었습니다.';
  if (locale === 'zh-hant') return '電子郵件地址已複製。';
  if (locale === 'ja') return 'メールアドレスをコピーしました。';
  return 'Email address copied.';
}

export function getCopyEmailFailureMessage(locale: SiteLocale): string {
  if (locale === 'ko') {
    return '복사에 실패했습니다. 표시된 이메일을 선택한 뒤 직접 복사해 주세요.';
  }
  if (locale === 'zh-hant') {
    return '複製失敗。請選取顯示的電子郵件地址後手動複製。';
  }
  if (locale === 'ja') {
    return 'コピーに失敗しました。表示されたメールアドレスを選択して、手動でコピーしてください。';
  }
  return 'Copy failed. Select the displayed email address and copy it manually.';
}

export function getSensitiveInformationWarning(locale: SiteLocale): string {
  if (locale === 'ko') {
    return '초기 문의에는 사건 또는 업무의 개요와 연락처만 보내주시기 바랍니다. 주민등록번호, 여권번호, 계좌번호, 신분증 원본 등 민감정보는 이메일이나 일반 문의 폼으로 보내지 마시고, 담당 변호사의 별도 안내 후 안전한 방식으로 제출해 주세요.';
  }
  if (locale === 'zh-hant') {
    return '初次聯絡時，請僅提供案件或業務概要及聯絡方式。請勿透過電子郵件或一般諮詢表單傳送身分證字號、護照號碼、銀行帳戶資料或證件正本等敏感資訊；請待承辦律師另行指示後，再以安全方式提供。';
  }
  if (locale === 'ja') {
    return '初回のお問い合わせでは、案件または業務の概要と連絡先のみをお送りください。旅券番号、身分証番号、銀行口座情報、身分証明書の原本などの機微情報は、メールや一般のお問い合わせフォームでは送信せず、担当弁護士からの案内後に安全な方法でご提出ください。';
  }
  return 'For an initial inquiry, please provide only a brief matter or business overview and your contact details. Do not send passport or identification numbers, bank account details, or original identity documents by email or through the general inquiry form. Provide sensitive materials only through a secure method after receiving instructions from the attorney.';
}

export function getAttorneyReviewNotice(locale: Locale, options?: { emphasizeImmediate?: boolean }): string {
  const email = getConsultationPublicEmail();
  const emphasizeImmediate = options?.emphasizeImmediate ?? false;

  if (locale === 'ko') {
    return emphasizeImmediate
      ? `AI 안내는 틀릴 수 있으므로 최종 판단은 대만 변호사 검토가 필요합니다. "상담 접수하기" 버튼을 눌러 정식으로 접수하시거나 ${email} 로 바로 문의해 주세요.`
      : `AI 안내는 틀릴 수 있으므로 최종 판단은 대만 변호사 검토가 필요합니다. 구체 사건 상담은 ${email} 또는 "상담 접수하기" 버튼으로 진행해 주세요.`;
  }

  if (locale === 'zh-hant') {
    return emphasizeImmediate
      ? `AI 說明仍可能有誤，最終判斷應由台灣律師確認。請點擊「諮詢預約」按鈕送出，或寄信至 ${email}。`
      : `AI 說明仍可能有誤，最終判斷應由台灣律師確認。若要進入個案諮詢，請寄信至 ${email} 或點擊「諮詢預約」按鈕。`;
  }

  return emphasizeImmediate
    ? `AI guidance can still be wrong, so the final judgment should come from a Taiwan lawyer. Please click the "Request consultation" button or email ${email} directly.`
    : `AI guidance can still be wrong, so the final judgment should come from a Taiwan lawyer. For case-specific advice, click the "Request consultation" button or email ${email}.`;
}

import type { Locale } from '@/lib/locales';

const DEFAULT_CONSULTATION_PUBLIC_EMAIL = 'wei@hoveringlaw.com.tw';

export function getConsultationPublicEmail(): string {
  return process.env.NEXT_PUBLIC_CONSULTATION_PUBLIC_EMAIL || DEFAULT_CONSULTATION_PUBLIC_EMAIL;
}

export function getConsultationPublicMailto(): string {
  return `mailto:${getConsultationPublicEmail()}`;
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

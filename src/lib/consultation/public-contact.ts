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
      ? `AI 안내는 틀릴 수 있으므로 최종 판단은 대만 변호사 검토가 필요합니다. 아래 상담 신청란을 남기시거나 ${email} 로 바로 문의해 주세요.`
      : `AI 안내는 틀릴 수 있으므로 최종 판단은 대만 변호사 검토가 필요합니다. 구체 사건 상담은 ${email} 또는 아래 상담 신청으로 이어가 주세요.`;
  }

  if (locale === 'zh-hant') {
    return emphasizeImmediate
      ? `AI 說明仍可能有誤，最終判斷應由台灣律師確認。請直接填寫下方表單，或寄信至 ${email}。`
      : `AI 說明仍可能有誤，最終判斷應由台灣律師確認。若要進入個案諮詢，請寄信至 ${email} 或使用下方表單。`;
  }

  return emphasizeImmediate
    ? `AI guidance can still be wrong, so the final judgment should come from a Taiwan lawyer. Please use the intake form below or email ${email} directly.`
    : `AI guidance can still be wrong, so the final judgment should come from a Taiwan lawyer. For case-specific advice, use the intake form below or email ${email}.`;
}

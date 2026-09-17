import type { SiteLocale } from '@/lib/locales';

export const AI_INTAKE_DISCOVERY_ENV = 'NEXT_PUBLIC_AI_INTAKE_DISCOVERY_ENABLED' as const;

export type AiIntakeDiscovery = Readonly<{
  enabled: boolean;
  href: string;
  label: string;
  supportingCopy: string;
}>;

const DISCOVERY_COPY: Record<
  SiteLocale,
  Readonly<Pick<AiIntakeDiscovery, 'label' | 'supportingCopy'>>
> = {
  ko: {
    label: 'AI 상담 이메일 접수 안내',
    supportingCopy:
      '이 사무소에 연결·설정된 AI 서비스의 초기 질문과 확인용 이메일 초안에 관한 안내입니다. 일반 AI 대화에 자동 접근 권한이 있는 것은 아닙니다. 예약이나 법률 자문이 아닙니다.',
  },
  'zh-hant': {
    label: 'AI 輔助諮詢郵件受理指南',
    supportingCopy:
      '說明已連接並設定本所的AI服務如何詢問初步問題及準備供確認的郵件草稿。一般AI對話不會自動取得權限。這不是預約或法律意見。',
  },
  en: {
    label: 'AI-assisted consultation email intake guide',
    supportingCopy:
      'Guide to a service configured with this firm: initial questions and a consultation-email draft for review. General AI chats do not automatically have access. Not an appointment or legal advice.',
  },
  ja: {
    label: 'AI補助による相談メール受付ガイド',
    supportingCopy:
      'この事務所に接続・設定されたAIサービスの初期質問と確認用メール草稿についての案内です。一般のAIチャットから自動利用はできません。予約や法律助言ではありません。',
  },
};

/**
 * Only the literal string false hides guide links; this build-time flag does not indicate provider configuration, credentials, or runtime send capability.
 */
export function getAiIntakeDiscovery(locale: SiteLocale): AiIntakeDiscovery {
  return {
    enabled: process.env.NEXT_PUBLIC_AI_INTAKE_DISCOVERY_ENABLED !== 'false',
    href: `/${locale}/ai-intake`,
    ...DISCOVERY_COPY[locale],
  };
}

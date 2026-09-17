import { afterEach, describe, expect, it, vi } from 'vitest';
import { siteLocales, type SiteLocale } from '@/lib/locales';
import {
  AI_INTAKE_DISCOVERY_ENV,
  getAiIntakeDiscovery,
} from '@/lib/ai-intake/discovery';

const EXPECTED_LABELS: Record<SiteLocale, string> = {
  ko: 'AI 상담 이메일 접수 안내',
  'zh-hant': 'AI 輔助諮詢郵件受理指南',
  en: 'AI-assisted consultation email intake guide',
  ja: 'AI補助による相談メール受付ガイド',
};

const EXPECTED_SUPPORTING_COPY: Record<SiteLocale, string> = {
  ko: '이 사무소에 연결·설정된 AI 서비스의 초기 질문과 확인용 이메일 초안에 관한 안내입니다. 일반 AI 대화에 자동 접근 권한이 있는 것은 아닙니다. 예약이나 법률 자문이 아닙니다.',
  'zh-hant': '說明已連接並設定本所的AI服務如何詢問初步問題及準備供確認的郵件草稿。一般AI對話不會自動取得權限。這不是預約或法律意見。',
  en: 'Guide to a service configured with this firm: initial questions and a consultation-email draft for review. General AI chats do not automatically have access. Not an appointment or legal advice.',
  ja: 'この事務所に接続・設定されたAIサービスの初期質問と確認用メール草稿についての案内です。一般のAIチャットから自動利用はできません。予約や法律助言ではありません。',
};

afterEach(() => {
  vi.unstubAllEnvs();
});

describe('AI-intake public discovery contract', () => {
  it.each(siteLocales)('uses a same-locale, query-free href and honest localized copy for %s', (locale) => {
    vi.stubEnv(AI_INTAKE_DISCOVERY_ENV, undefined);
    const discovery = getAiIntakeDiscovery(locale);

    expect(discovery).toMatchObject({
      enabled: true,
      href: `/${locale}/ai-intake`,
      label: EXPECTED_LABELS[locale],
      supportingCopy: EXPECTED_SUPPORTING_COPY[locale],
    });
    expect(discovery.supportingCopy).toBe(EXPECTED_SUPPORTING_COPY[locale]);
    expect(discovery.href).not.toMatch(/[?#]/);
    expect(discovery.supportingCopy).not.toContain('wei@hoveringlaw.com.tw');
    expect(discovery.supportingCopy).not.toMatch(/https?:\/\//i);
  });

  it('defaults on and only the literal public flag value false disables discovery', () => {
    vi.stubEnv(AI_INTAKE_DISCOVERY_ENV, undefined);
    expect(getAiIntakeDiscovery('en').enabled).toBe(true);

    vi.stubEnv(AI_INTAKE_DISCOVERY_ENV, 'FALSE');
    expect(getAiIntakeDiscovery('en').enabled).toBe(true);

    vi.stubEnv(AI_INTAKE_DISCOVERY_ENV, 'false');
    expect(getAiIntakeDiscovery('en').enabled).toBe(false);
  });
});

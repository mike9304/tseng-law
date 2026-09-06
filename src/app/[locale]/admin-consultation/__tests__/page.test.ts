import { readFileSync } from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';
import { generateMetadata } from '../page';
import { getConsultationCopy } from '../copy';

describe('admin-consultation metadata', () => {
  it('localizes the document title by locale', async () => {
    expect((await generateMetadata({ params: Promise.resolve({ locale: 'ko' }) })).title).toBe('상담 관리');
    expect((await generateMetadata({ params: Promise.resolve({ locale: 'zh-hant' }) })).title).toBe('諮詢管理');
    expect((await generateMetadata({ params: Promise.resolve({ locale: 'en' }) })).title).toBe('Consultation admin');
  });

  it('localizes the consultation shell copy by locale', () => {
    expect(getConsultationCopy('ko').heroTitle).toBe('호정 AI 상담 운영 대시보드');
    expect(getConsultationCopy('ko').knowledgeDirectTitle).toBe('직접 추가');
    expect(getConsultationCopy('ko').recentSubmissionsHeaders.category).toBe('카테고리');
    expect(getConsultationCopy('ko').funnelHeaders.stage).toBe('단계');
    expect(getConsultationCopy('ko').conversionSteps[0]).toBe('채팅 수신 → 답변');
    expect(getConsultationCopy('ko').performanceRowLabels.latencyP50).toBe('지연 p50');
    expect(getConsultationCopy('zh-hant').loadErrorSecondaryNote).toContain('備援');
    expect(getConsultationCopy('zh-hant').categoryTableHeader).toBe('分類');
    expect(getConsultationCopy('zh-hant').funnelHeaders.count).toBe('數量');
    expect(getConsultationCopy('zh-hant').conversionSteps[3]).toContain('完整漏斗');
    expect(getConsultationCopy('zh-hant').categoryTableHeaders.empty).toContain('聊天事件');
    expect(getConsultationCopy('en').windowOptions[0]?.label).toBe('1d');
    expect(getConsultationCopy('en').recentChatTitle).toBe('Recent chat samples');
    expect(getConsultationCopy('en').riskTableHeaders.level).toBe('Level');
    expect(getConsultationCopy('en').conversionHeaders.rate).toBe('Rate');
    expect(getConsultationCopy('en').performanceRowLabels.totalPromptTokens).toBe('Total prompt tokens');
    expect(getConsultationCopy('ko').safetyRowLabels.submitConsentMissing).toBe('제출 동의 누락');
    expect(getConsultationCopy('en').categoryTableHeaders.empty).toBe('(no chat events in window)');
  });

  it('describes AI provider email-intake metrics as submit outcomes rather than preview conversion', () => {
    const ko = getConsultationCopy('ko');
    const zh = getConsultationCopy('zh-hant');
    const en = getConsultationCopy('en');

    expect(ko.aiIntakeTitle).toBe('AI 제공자 이메일 접수 제출 결과');
    expect(ko.aiIntakeDescription).toContain('제출 결과만');
    expect(ko.aiIntakeDescription).toContain('미리보기→제출 전환율이 아닙니다');
    expect(ko.aiIntakeDescription).toContain('중복은 신규 발송 수에서 제외');
    expect(ko.aiIntakeDescription).toContain('상담 내용은 표시하지 않습니다');

    expect(zh.aiIntakeTitle).toBe('AI 提供者諮詢郵件提交結果');
    expect(zh.aiIntakeDescription).toContain('僅統計提交結果');
    expect(zh.aiIntakeDescription).toContain('並非預覽到提交的轉換率');
    expect(zh.aiIntakeDescription).toContain('重複結果不計入新寄送');
    expect(zh.aiIntakeDescription).toContain('不顯示任何諮詢內容');

    expect(en.aiIntakeTitle).toBe('AI provider email-intake submit outcomes');
    expect(en.aiIntakeDescription).toContain('Submit outcomes only');
    expect(en.aiIntakeDescription).toContain('not preview-to-submit conversion');
    expect(en.aiIntakeDescription).toContain('fresh email sent after the user approved the exact content');
    expect(en.aiIntakeDescription).toContain('duplicates are excluded from the fresh sent count');
    expect(en.aiIntakeDescription).toContain('No consultation contents are shown');
    expect(en.aiIntakeHeaders.deliveryUnknown).toBe('Delivery unknown');
    expect(en.aiIntakeRecentHeaders.outcome).toBe('Outcome');
  });

  it('renders only the sanitized recent outcome dimensions and includes a null-percent fallback', () => {
    const source = readFileSync(
      path.join(process.cwd(), 'src/app/[locale]/admin-consultation/page.tsx'),
      'utf8',
    );
    const recentStart = source.indexOf('function AiIntakeRecentOutcomes');
    const recentEnd = source.indexOf('\nfunction Section', recentStart);
    const recentSource = source.slice(recentStart, recentEnd);

    expect(recentStart).toBeGreaterThan(-1);
    expect(recentEnd).toBeGreaterThan(recentStart);
    expect(recentSource).toContain('outcome.timestamp');
    expect(recentSource).toContain('outcome.provider');
    expect(recentSource).toContain('outcome.locale');
    expect(recentSource).toContain('outcome.stage');
    expect(recentSource).not.toContain('intakeId');
    expect(recentSource).not.toContain('metadataRedacted');
    expect(recentSource).not.toContain('outcome.subject');
    expect(recentSource).not.toContain('outcome.body');
    expect(source).toContain('if (value === null)');
    expect(source).toContain('>—</span>');
    expect(source).toContain('aiIntake: {');
    expect(source).toContain('problemShareOfNonReplay: null');
    expect(recentSource).not.toContain('category');
    expect(recentSource).not.toContain('aiIntakeCategory');
  });

  it('exposes a matter-category heading and renders the one-dimensional byCategory table', () => {
    const ko = getConsultationCopy('ko') as { aiIntakeCategoryTitle?: string; aiIntakeDescription: string };
    const zh = getConsultationCopy('zh-hant') as { aiIntakeCategoryTitle?: string; aiIntakeDescription: string };
    const en = getConsultationCopy('en') as { aiIntakeCategoryTitle?: string; aiIntakeDescription: string };

    expect(ko.aiIntakeCategoryTitle).toBe('사안 유형별 결과');
    expect(zh.aiIntakeCategoryTitle).toBe('依案件類型');
    expect(en.aiIntakeCategoryTitle).toBe('By matter category');
    expect(ko.aiIntakeDescription).toContain('unknown_category');
    expect(ko.aiIntakeDescription).toContain('승인된 미리보기');
    expect(ko.aiIntakeDescription).toContain('상담 내용은 표시하지 않습니다');
    expect(zh.aiIntakeDescription).toContain('unknown_category');
    expect(zh.aiIntakeDescription).toContain('核准的預覽');
    expect(zh.aiIntakeDescription).toContain('不顯示任何諮詢內容');
    expect(en.aiIntakeDescription).toContain('unknown_category');
    expect(en.aiIntakeDescription).toContain('approved preview matches');
    expect(en.aiIntakeDescription).toContain('No consultation contents are shown');

    const source = readFileSync(
      path.join(process.cwd(), 'src/app/[locale]/admin-consultation/page.tsx'),
      'utf8',
    );
    expect(source).toContain('metrics.aiIntake.byCategory');
    expect(source).toContain('copy.aiIntakeCategoryTitle');

    const fallbackStart = source.indexOf('aiIntake: {');
    const fallbackEnd = source.indexOf('performance:', fallbackStart);
    const fallback = source.slice(fallbackStart, fallbackEnd);
    expect(fallbackStart).toBeGreaterThan(-1);
    expect(fallbackEnd).toBeGreaterThan(fallbackStart);
    expect(fallback).toContain('byCategory: []');
  });
});

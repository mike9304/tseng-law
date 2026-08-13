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
});

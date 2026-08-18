import { describe, expect, it } from 'vitest';

import {
  getFollowUpSuggestions,
  getQuickReplies,
} from '@/components/floating-ai-quick-replies';

describe('floating AI consultation contact copy', () => {
  it('uses Attorney Tseng email as the consultation channel and states four Taiwan offices', () => {
    const consultationReply = getQuickReplies('ko').find(
      (reply) => reply.question === '상담 비용과 일정이 어떻게 되나요?',
    );

    expect(consultationReply).toBeDefined();
    expect(consultationReply?.answer).toContain(
      '증준외 대만 변호사 이메일 상담: wei@hoveringlaw.com.tw',
    );
    expect(consultationReply?.answer).toContain('대면 상담 (대만 4개 사무소)');
    expect(consultationReply?.answer).toContain('- 핑둥: 08-739-1689');
    expect(consultationReply?.answer).not.toContain('전화 상담 가능');
    expect(consultationReply?.answer).not.toMatch(/(?:\+82-?)?0?10-2992-9304/);
  });

  it('preserves office phone details without presenting them as consultation CTAs', () => {
    const consultationReply = getQuickReplies('ko').find(
      (reply) => reply.question === '상담 비용과 일정이 어떻게 되나요?',
    );

    expect(consultationReply?.answer).toContain('- 타이중: 04-2326-1862');
    expect(consultationReply?.answer).toContain('- 가오슝: 07-557-9797');
    expect(consultationReply?.answer).toContain('- 핑둥: 08-739-1689');
  });

  it.each(['ko', 'zh-hant', 'en'] as const)(
    'offers an email-focused general follow-up for %s',
    (locale) => {
      const suggestions = getFollowUpSuggestions(locale, 'general');
      const surface = JSON.stringify(suggestions);

      expect(surface).toMatch(locale === 'ko' ? /이메일/ : /email/i);
      expect(surface).not.toMatch(/KakaoTalk|카카오|電話|전화|phone/i);
    },
  );
});

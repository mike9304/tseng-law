import { describe, expect, it } from 'vitest';
import { getLiveChatSseErrorPayload, getLiveChatWidgetCopy } from '@/lib/builder/live-chat/widget-copy';

describe('live chat widget copy', () => {
  it('returns ko public widget copy', () => {
    const copy = getLiveChatWidgetCopy('ko');

    expect(copy.defaultTitle).toBe('호정국제 상담');
    expect(copy.defaultLauncherLabel).toBe('실시간 상담');
    expect(copy.openLauncherLabel('실시간 상담')).toBe('실시간 상담 열기');
    expect(copy.apiErrorMessage('Too many requests', 'send')).toBe('잠시 후 다시 시도해 주세요.');
    expect(copy.apiErrorMessage(undefined, 'start')).toBe('대화를 시작하지 못했습니다.');
  });

  it('returns zh-hant public widget copy without Hangul', () => {
    const copy = getLiveChatWidgetCopy('zh-hant');
    const text = [
      copy.defaultTitle,
      copy.defaultIntroText,
      copy.defaultOfflineMessage,
      copy.defaultLauncherLabel,
      copy.closeLabel,
      copy.namePlaceholder,
      copy.emailRequiredPlaceholder,
      copy.newConversationPlaceholder,
      copy.replyPlaceholder,
      copy.startLabel,
      copy.sendLabel,
      copy.openLauncherLabel(copy.defaultLauncherLabel),
      copy.emailRequiredError,
      copy.invalidEmailError,
      copy.apiErrorMessage('Conversation closed', 'send'),
      copy.apiErrorMessage(undefined, 'start'),
    ].join(' ');

    expect(text).toContain('皓正國際諮詢');
    expect(text).toContain('開啟即時諮詢');
    expect(text).toContain('這段對話已結束。');
    expect(text).not.toMatch(/[\u1100-\u11FF\u3130-\u318F\uAC00-\uD7A3]/);
  });

  it('returns en public widget copy without CJK', () => {
    const copy = getLiveChatWidgetCopy('en');
    const text = [
      copy.defaultTitle,
      copy.defaultIntroText,
      copy.defaultOfflineMessage,
      copy.defaultLauncherLabel,
      copy.closeLabel,
      copy.namePlaceholder,
      copy.emailRequiredPlaceholder,
      copy.newConversationPlaceholder,
      copy.replyPlaceholder,
      copy.startLabel,
      copy.sendLabel,
      copy.openLauncherLabel(copy.defaultLauncherLabel),
      copy.emailRequiredError,
      copy.invalidEmailError,
      copy.apiErrorMessage('Unauthorized', 'send'),
      copy.apiErrorMessage(undefined, 'send'),
    ].join(' ');

    expect(text).toContain('Tseng Law Consultation');
    expect(text).toContain('Open Live chat');
    expect(text).toContain('This conversation could not be verified.');
    expect(text).not.toMatch(/[\u1100-\u11FF\u3130-\u318F\uAC00-\uD7A3\u4E00-\u9FFF]/);
  });

  it('returns localized SSE error payloads with stable codes', () => {
    expect(getLiveChatSseErrorPayload('ko', 'stream_initial_failed')).toEqual({
      error: '대화 기록을 불러오지 못했습니다.',
      errorCode: 'stream_initial_failed',
    });
    expect(getLiveChatSseErrorPayload('zh-hant', 'stream_poll_failed')).toEqual({
      error: '無法檢查新訊息。',
      errorCode: 'stream_poll_failed',
    });
    const english = getLiveChatSseErrorPayload('en', 'stream_poll_failed');

    expect(english.error).toBe('Could not check for new messages.');
    expect(english.error).not.toMatch(/[\u1100-\u11FF\u3130-\u318F\uAC00-\uD7A3\u4E00-\u9FFF]/);
  });
});

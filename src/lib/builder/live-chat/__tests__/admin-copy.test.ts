import { describe, expect, it } from 'vitest';
import {
  getLiveChatAdminApiErrorPayload,
  getLiveChatAuthorCopy,
} from '@/lib/builder/live-chat/admin-copy';

describe('live chat author copy', () => {
  it('returns ko author fallback labels', () => {
    expect(getLiveChatAuthorCopy('ko')).toEqual({
      adminAuthorLabel: '관리자',
      visitorAuthorLabel: '방문자',
      systemAuthorLabel: '시스템',
    });
  });

  it('returns zh-hant author fallback labels without Hangul', () => {
    const copy = getLiveChatAuthorCopy('zh-hant');
    const text = [
      copy.adminAuthorLabel,
      copy.visitorAuthorLabel,
      copy.systemAuthorLabel,
    ].join(' ');

    expect(copy.adminAuthorLabel).toBe('管理員');
    expect(text).not.toMatch(/[\u1100-\u11FF\u3130-\u318F\uAC00-\uD7A3]/);
  });

  it('returns en author fallback labels without CJK', () => {
    const copy = getLiveChatAuthorCopy('en');
    const text = [
      copy.adminAuthorLabel,
      copy.visitorAuthorLabel,
      copy.systemAuthorLabel,
    ].join(' ');

    expect(copy.adminAuthorLabel).toBe('admin');
    expect(text).not.toMatch(/[\u1100-\u11FF\u3130-\u318F\uAC00-\uD7A3\u4E00-\u9FFF]/);
  });

  it('returns localized admin API error payloads with stable codes', () => {
    expect(getLiveChatAdminApiErrorPayload('ko', 'conversation_not_found')).toEqual({
      error: '대화를 찾을 수 없습니다.',
      errorCode: 'conversation_not_found',
    });
    expect(getLiveChatAdminApiErrorPayload('zh-hant', 'invalid_payload')).toEqual({
      error: '請確認訊息內容。',
      errorCode: 'invalid_payload',
    });
    const english = getLiveChatAdminApiErrorPayload('en', 'conversation_not_found');

    expect(english.error).toBe('Conversation not found.');
    expect(english.error).not.toMatch(/[\u1100-\u11FF\u3130-\u318F\uAC00-\uD7A3\u4E00-\u9FFF]/);
  });
});

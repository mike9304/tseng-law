import { describe, expect, it } from 'vitest';
import { getLiveChatInboxCopy } from '../inbox-copy';

describe('live chat inbox copy', () => {
  it('returns ko inbox admin copy', () => {
    const copy = getLiveChatInboxCopy('ko');

    expect(copy.metadataTitle).toBe('받은편지함');
    expect(copy.pageTitle).toBe('실시간 대화');
    expect(copy.conversationsLabel(3)).toBe('대화 (3)');
    expect(copy.closeConversationLabel).toBe('대화 종료');
    expect(copy.dateTimeLocale).toBe('ko-KR');
  });

  it('returns zh-hant inbox admin copy without Hangul', () => {
    const copy = getLiveChatInboxCopy('zh-hant');
    const text = [
      copy.metadataTitle,
      copy.metadataDescription,
      copy.pageTitle,
      copy.pageDescription,
      copy.conversationsLabel(2),
      copy.refreshLabel,
      copy.emptyLabel,
      copy.anonymousVisitorLabel,
      copy.closedLabel,
      copy.closeConversationLabel,
      copy.replyPlaceholder,
      copy.sendLabel,
      copy.selectConversationLabel,
      copy.adminAuthorLabel,
      copy.visitorAuthorLabel,
      copy.systemAuthorLabel,
    ].join(' ');

    expect(copy.dateTimeLocale).toBe('zh-Hant');
    expect(text).toContain('即時對話');
    expect(text).toContain('對話 (2)');
    expect(text).not.toMatch(/[\u1100-\u11FF\u3130-\u318F\uAC00-\uD7A3]/);
  });

  it('returns en inbox admin copy without CJK', () => {
    const copy = getLiveChatInboxCopy('en');
    const text = [
      copy.metadataTitle,
      copy.metadataDescription,
      copy.pageTitle,
      copy.pageDescription,
      copy.conversationsLabel(1),
      copy.refreshLabel,
      copy.emptyLabel,
      copy.anonymousVisitorLabel,
      copy.closedLabel,
      copy.closeConversationLabel,
      copy.replyPlaceholder,
      copy.sendLabel,
      copy.selectConversationLabel,
      copy.adminAuthorLabel,
      copy.visitorAuthorLabel,
      copy.systemAuthorLabel,
    ].join(' ');

    expect(copy.dateTimeLocale).toBe('en-US');
    expect(text).toContain('Live Chat Inbox');
    expect(text).toContain('Conversations (1)');
    expect(text).not.toMatch(/[\u1100-\u11FF\u3130-\u318F\uAC00-\uD7A3\u4E00-\u9FFF]/);
  });
});

import type { Locale } from '@/lib/locales';
import { getLiveChatAuthorCopy } from '@/lib/builder/live-chat/admin-copy';

export interface LiveChatInboxCopy {
  metadataTitle: string;
  metadataDescription: string;
  pageTitle: string;
  pageDescription: string;
  dateTimeLocale: string;
  conversationsLabel: (count: number) => string;
  refreshLabel: string;
  emptyLabel: string;
  anonymousVisitorLabel: string;
  closedLabel: string;
  closeConversationLabel: string;
  replyPlaceholder: string;
  sendLabel: string;
  selectConversationLabel: string;
  adminAuthorLabel: string;
  visitorAuthorLabel: string;
  systemAuthorLabel: string;
}

export function getLiveChatInboxCopy(locale: Locale): LiveChatInboxCopy {
  const authorCopy = getLiveChatAuthorCopy(locale);

  if (locale === 'zh-hant') {
    return {
      metadataTitle: '收件匣',
      metadataDescription: '管理與訪客的即時對話。',
      pageTitle: '即時對話',
      pageDescription: '訪客的即時對話。以 SSE（Fluid Compute 串流）提供，輪詢 1.5 秒。',
      dateTimeLocale: 'zh-Hant',
      conversationsLabel: (count) => `對話 (${count})`,
      refreshLabel: '重新整理',
      emptyLabel: '沒有對話。',
      anonymousVisitorLabel: '匿名訪客',
      closedLabel: '已關閉',
      closeConversationLabel: '結束對話',
      replyPlaceholder: '輸入回覆...',
      sendLabel: '送出',
      selectConversationLabel: '請選擇一段對話。',
      ...authorCopy,
    };
  }

  if (locale === 'en') {
    return {
      metadataTitle: 'Inbox',
      metadataDescription: 'Manage real-time conversations with visitors.',
      pageTitle: 'Live Chat Inbox',
      pageDescription: 'Live conversations with visitors. SSE-based (Fluid Compute streaming). Polls every 1.5s.',
      dateTimeLocale: 'en-US',
      conversationsLabel: (count) => `Conversations (${count})`,
      refreshLabel: 'Refresh',
      emptyLabel: 'No conversations yet.',
      anonymousVisitorLabel: 'Anonymous visitor',
      closedLabel: 'closed',
      closeConversationLabel: 'Close conversation',
      replyPlaceholder: 'Type a reply...',
      sendLabel: 'Send',
      selectConversationLabel: 'Select a conversation.',
      ...authorCopy,
    };
  }

  return {
    metadataTitle: '받은편지함',
    metadataDescription: '방문자와의 실시간 대화를 관리합니다.',
    pageTitle: '실시간 대화',
    pageDescription: '방문자의 실시간 대화. SSE 기반 (Fluid Compute streaming). 폴링 1.5초.',
    dateTimeLocale: 'ko-KR',
    conversationsLabel: (count) => `대화 (${count})`,
    refreshLabel: '새로고침',
    emptyLabel: '대화가 없습니다.',
    anonymousVisitorLabel: '익명 방문자',
    closedLabel: '닫힘',
    closeConversationLabel: '대화 종료',
    replyPlaceholder: '답장 입력...',
    sendLabel: '보내기',
    selectConversationLabel: '대화를 선택하세요.',
    ...authorCopy,
  };
}

import type { Locale } from '@/lib/locales';

export interface LiveChatAuthorCopy {
  adminAuthorLabel: string;
  visitorAuthorLabel: string;
  systemAuthorLabel: string;
}

export type LiveChatAdminApiErrorCode = 'conversation_not_found' | 'invalid_payload';

export interface LiveChatAdminApiErrorPayload {
  error: string;
  errorCode: LiveChatAdminApiErrorCode;
}

const adminApiErrorMessages: Record<Locale, Record<LiveChatAdminApiErrorCode, string>> = {
  ko: {
    conversation_not_found: '대화를 찾을 수 없습니다.',
    invalid_payload: '메시지 내용을 확인해 주세요.',
  },
  'zh-hant': {
    conversation_not_found: '找不到這段對話。',
    invalid_payload: '請確認訊息內容。',
  },
  en: {
    conversation_not_found: 'Conversation not found.',
    invalid_payload: 'Check the message and try again.',
  },
};

export function getLiveChatAdminApiErrorPayload(
  locale: Locale,
  errorCode: LiveChatAdminApiErrorCode,
): LiveChatAdminApiErrorPayload {
  return {
    error: adminApiErrorMessages[locale][errorCode],
    errorCode,
  };
}

export function getLiveChatAuthorCopy(locale: Locale): LiveChatAuthorCopy {
  if (locale === 'zh-hant') {
    return {
      adminAuthorLabel: '管理員',
      visitorAuthorLabel: '訪客',
      systemAuthorLabel: '系統',
    };
  }

  if (locale === 'en') {
    return {
      adminAuthorLabel: 'admin',
      visitorAuthorLabel: 'visitor',
      systemAuthorLabel: 'system',
    };
  }

  return {
    adminAuthorLabel: '관리자',
    visitorAuthorLabel: '방문자',
    systemAuthorLabel: '시스템',
  };
}

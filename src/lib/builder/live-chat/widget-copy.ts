import type { Locale } from '@/lib/locales';

export type LiveChatWidgetAction = 'start' | 'send';
export type LiveChatApiErrorCode =
  | 'too_many_requests'
  | 'invalid_payload'
  | 'conversation_not_found'
  | 'unauthorized'
  | 'conversation_closed';

export interface LiveChatApiErrorPayload {
  error: string;
  errorCode: LiveChatApiErrorCode;
}

export type LiveChatSseErrorCode = 'stream_initial_failed' | 'stream_poll_failed';

export interface LiveChatSseErrorPayload {
  error: string;
  errorCode: LiveChatSseErrorCode;
}

export interface LiveChatWidgetCopy {
  defaultTitle: string;
  defaultIntroText: string;
  defaultOfflineMessage: string;
  defaultLauncherLabel: string;
  closeLabel: string;
  nameLabel: string;
  namePlaceholder: string;
  emailLabel: string;
  emailPlaceholder: string;
  emailRequiredPlaceholder: string;
  messageInputLabel: string;
  newConversationPlaceholder: string;
  replyPlaceholder: string;
  startLabel: string;
  sendLabel: string;
  openLauncherLabel: (launcherLabel: string) => string;
  emailRequiredError: string;
  invalidEmailError: string;
  startFailedFallback: string;
  sendFailedFallback: string;
  apiErrorMessage: (error: string | undefined, action: LiveChatWidgetAction) => string;
}

function errorMessage(
  error: string | undefined,
  action: LiveChatWidgetAction,
  messages: {
    tooManyRequests: string;
    invalidPayload: string;
    conversationNotFound: string;
    unauthorized: string;
    conversationClosed: string;
    startFailed: string;
    sendFailed: string;
  },
): string {
  switch (error) {
    case 'too_many_requests':
    case 'Too many requests':
      return messages.tooManyRequests;
    case 'invalid_payload':
    case 'Invalid payload':
      return messages.invalidPayload;
    case 'conversation_not_found':
    case 'Conversation not found':
      return messages.conversationNotFound;
    case 'unauthorized':
    case 'Unauthorized':
      return messages.unauthorized;
    case 'conversation_closed':
    case 'Conversation closed':
      return messages.conversationClosed;
    default:
      return action === 'start' ? messages.startFailed : messages.sendFailed;
  }
}

export function getLiveChatApiErrorPayload(
  locale: Locale,
  errorCode: LiveChatApiErrorCode,
  action: LiveChatWidgetAction,
): LiveChatApiErrorPayload {
  const copy = getLiveChatWidgetCopy(locale);

  return {
    error: copy.apiErrorMessage(errorCode, action),
    errorCode,
  };
}

const sseErrorMessages: Record<Locale, Record<LiveChatSseErrorCode, string>> = {
  ko: {
    stream_initial_failed: '대화 기록을 불러오지 못했습니다.',
    stream_poll_failed: '새 메시지를 확인하지 못했습니다.',
  },
  'zh-hant': {
    stream_initial_failed: '無法載入對話紀錄。',
    stream_poll_failed: '無法檢查新訊息。',
  },
  en: {
    stream_initial_failed: 'Could not load the conversation history.',
    stream_poll_failed: 'Could not check for new messages.',
  },
};

export function getLiveChatSseErrorPayload(
  locale: Locale,
  errorCode: LiveChatSseErrorCode,
): LiveChatSseErrorPayload {
  return {
    error: sseErrorMessages[locale][errorCode],
    errorCode,
  };
}

export function getLiveChatWidgetCopy(locale: Locale): LiveChatWidgetCopy {
  if (locale === 'zh-hant') {
    const messages = {
      tooManyRequests: '請稍後再試。',
      invalidPayload: '請確認訊息內容後再送出。',
      conversationNotFound: '找不到這段對話。請重新開始。',
      unauthorized: '無法確認這段對話。請重新開始。',
      conversationClosed: '這段對話已結束。',
      startFailed: '無法開始對話。',
      sendFailed: '無法送出訊息。',
    };

    return {
      defaultTitle: '皓正國際諮詢',
      defaultIntroText: '姓名和電子郵件為選填。',
      defaultOfflineMessage: '目前回覆可能會延遲。請留下訊息，我們確認後會與您聯絡。',
      defaultLauncherLabel: '即時諮詢',
      closeLabel: '關閉',
      nameLabel: '姓名',
      namePlaceholder: '姓名',
      emailLabel: '電子郵件',
      emailPlaceholder: '電子郵件',
      emailRequiredPlaceholder: '電子郵件（必填）',
      messageInputLabel: '聊天訊息',
      newConversationPlaceholder: '請輸入諮詢內容',
      replyPlaceholder: '請輸入訊息...',
      startLabel: '開始',
      sendLabel: '送出',
      openLauncherLabel: (launcherLabel) => `開啟${launcherLabel}`,
      emailRequiredError: '請輸入電子郵件。',
      invalidEmailError: '請輸入有效的電子郵件地址。',
      startFailedFallback: messages.startFailed,
      sendFailedFallback: messages.sendFailed,
      apiErrorMessage: (error, action) => errorMessage(error, action, messages),
    };
  }

  if (locale === 'en') {
    const messages = {
      tooManyRequests: 'Please try again in a moment.',
      invalidPayload: 'Check your message and try again.',
      conversationNotFound: 'This conversation could not be found. Please start again.',
      unauthorized: 'This conversation could not be verified. Please start again.',
      conversationClosed: 'This conversation is closed.',
      startFailed: 'Could not start the conversation.',
      sendFailed: 'Could not send the message.',
    };

    return {
      defaultTitle: 'Tseng Law Consultation',
      defaultIntroText: 'Name and email are optional.',
      defaultOfflineMessage: 'Replies may be delayed right now. Leave a message and we will follow up after review.',
      defaultLauncherLabel: 'Live chat',
      closeLabel: 'Close',
      nameLabel: 'Name',
      namePlaceholder: 'Name',
      emailLabel: 'Email',
      emailPlaceholder: 'Email',
      emailRequiredPlaceholder: 'Email (required)',
      messageInputLabel: 'Chat message',
      newConversationPlaceholder: 'Enter your question',
      replyPlaceholder: 'Type a message...',
      startLabel: 'Start',
      sendLabel: 'Send',
      openLauncherLabel: (launcherLabel) => `Open ${launcherLabel}`,
      emailRequiredError: 'Enter your email address.',
      invalidEmailError: 'Enter a valid email address.',
      startFailedFallback: messages.startFailed,
      sendFailedFallback: messages.sendFailed,
      apiErrorMessage: (error, action) => errorMessage(error, action, messages),
    };
  }

  const messages = {
    tooManyRequests: '잠시 후 다시 시도해 주세요.',
    invalidPayload: '메시지 내용을 확인한 뒤 다시 보내 주세요.',
    conversationNotFound: '대화를 찾을 수 없습니다. 다시 시작해 주세요.',
    unauthorized: '대화를 확인할 수 없습니다. 다시 시작해 주세요.',
    conversationClosed: '종료된 대화입니다.',
    startFailed: '대화를 시작하지 못했습니다.',
    sendFailed: '메시지를 전송하지 못했습니다.',
  };

  return {
    defaultTitle: '호정국제 상담',
    defaultIntroText: '이름과 이메일은 선택 사항입니다.',
    defaultOfflineMessage: '지금은 답변이 지연될 수 있습니다. 메시지를 남겨주시면 확인 후 연락드리겠습니다.',
    defaultLauncherLabel: '실시간 상담',
    closeLabel: '닫기',
    nameLabel: '이름',
    namePlaceholder: '이름',
    emailLabel: '이메일',
    emailPlaceholder: '이메일',
    emailRequiredPlaceholder: '이메일 (필수)',
    messageInputLabel: '채팅 메시지',
    newConversationPlaceholder: '문의 내용을 입력하세요',
    replyPlaceholder: '메시지를 입력하세요...',
    startLabel: '시작',
    sendLabel: '전송',
    openLauncherLabel: (launcherLabel) => `${launcherLabel} 열기`,
    emailRequiredError: '이메일을 입력해 주세요.',
    invalidEmailError: '올바른 이메일 주소를 입력해 주세요.',
    startFailedFallback: messages.startFailed,
    sendFailedFallback: messages.sendFailed,
    apiErrorMessage: (error, action) => errorMessage(error, action, messages),
  };
}

import type { Locale } from '@/lib/locales';

type FeedbackSaveState = 'saving' | 'saved' | 'error';

export interface SandboxFeedbackOverlayCopy {
  saveStatusLabels: Record<FeedbackSaveState, string>;
  dismissToastLabel: string;
}

const COPY: Record<Locale, SandboxFeedbackOverlayCopy> = {
  ko: {
    saveStatusLabels: {
      saving: '저장 중...',
      saved: '저장됨',
      error: '저장 실패',
    },
    dismissToastLabel: '알림 닫기',
  },
  'zh-hant': {
    saveStatusLabels: {
      saving: '儲存中...',
      saved: '已儲存',
      error: '儲存失敗',
    },
    dismissToastLabel: '關閉通知',
  },
  en: {
    saveStatusLabels: {
      saving: 'Saving...',
      saved: 'Saved',
      error: 'Save failed',
    },
    dismissToastLabel: 'Dismiss notification',
  },
};

export function getSandboxFeedbackOverlayCopy(locale: Locale): SandboxFeedbackOverlayCopy {
  return COPY[locale] ?? COPY.ko;
}

import type { BuilderNotificationBarCanvasNode } from '@/lib/builder/canvas/types';
import type { Locale } from '@/lib/locales';

type NotificationTone = BuilderNotificationBarCanvasNode['content']['tone'];
type NotificationPosition = BuilderNotificationBarCanvasNode['content']['position'];

export interface NotificationBarCopy {
  dismiss: string;
  defaults: {
    message: string;
    ctaLabel: string;
  };
  inspector: {
    message: string;
    ctaLabel: string;
    ctaHref: string;
    tone: string;
    tones: Record<NotificationTone, string>;
    position: string;
    positions: Record<NotificationPosition, string>;
    dismissable: string;
  };
}

export const NOTIFICATION_BAR_LEGACY_DEFAULTS = {
  message: '새 공지가 도착했습니다.',
  ctaLabel: '자세히 보기',
} as const;

const notificationBarCopy: Record<Locale, NotificationBarCopy> = {
  ko: {
    dismiss: '알림 닫기',
    defaults: {
      message: '새 공지가 도착했습니다.',
      ctaLabel: '자세히 보기',
    },
    inspector: {
      message: '메시지',
      ctaLabel: 'CTA 라벨',
      ctaHref: 'CTA 링크',
      tone: '톤',
      tones: {
        info: '정보',
        warning: '주의',
        success: '성공',
        danger: '위험',
      },
      position: '위치',
      positions: {
        top: '상단',
        bottom: '하단',
      },
      dismissable: '닫기 버튼 표시',
    },
  },
  'zh-hant': {
    dismiss: '關閉通知',
    defaults: {
      message: '收到新公告。',
      ctaLabel: '查看詳情',
    },
    inspector: {
      message: '訊息',
      ctaLabel: 'CTA 標籤',
      ctaHref: 'CTA 連結',
      tone: '語氣',
      tones: {
        info: '資訊',
        warning: '警告',
        success: '成功',
        danger: '危險',
      },
      position: '位置',
      positions: {
        top: '上方',
        bottom: '下方',
      },
      dismissable: '顯示關閉按鈕',
    },
  },
  en: {
    dismiss: 'Dismiss notification',
    defaults: {
      message: 'A new announcement is available.',
      ctaLabel: 'Learn more',
    },
    inspector: {
      message: 'Message',
      ctaLabel: 'CTA label',
      ctaHref: 'CTA link',
      tone: 'Tone',
      tones: {
        info: 'Info',
        warning: 'Warning',
        success: 'Success',
        danger: 'Danger',
      },
      position: 'Position',
      positions: {
        top: 'Top',
        bottom: 'Bottom',
      },
      dismissable: 'Show dismiss button',
    },
  },
};

export function getNotificationBarCopy(locale: Locale): NotificationBarCopy {
  return notificationBarCopy[locale] ?? notificationBarCopy.en;
}

export function localizedNotificationBarText(
  value: string | undefined,
  localized: string,
  legacyDefault: string,
): string {
  const current = value ?? '';
  return current === legacyDefault ? localized : current;
}

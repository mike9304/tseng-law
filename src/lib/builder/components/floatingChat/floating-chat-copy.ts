import type { BuilderFloatingChatCanvasNode } from '@/lib/builder/canvas/types';
import type { Locale } from '@/lib/locales';

type FloatingChatProvider = BuilderFloatingChatCanvasNode['content']['provider'];
type FloatingChatPlacement = BuilderFloatingChatCanvasNode['content']['placement'];

export interface FloatingChatCopy {
  defaultLabel: string;
  inspector: {
    provider: string;
    providers: Record<FloatingChatProvider, string>;
    href: string;
    label: string;
    placement: string;
    placements: Record<FloatingChatPlacement, string>;
    showLabel: string;
    color: string;
  };
}

export const FLOATING_CHAT_LEGACY_DEFAULTS = {
  label: '문의하기',
} as const;

export function localizedFloatingChatText(value: string | undefined, localized: string, legacyDefault: string): string {
  const current = value ?? '';
  return current === legacyDefault ? localized : current;
}

const floatingChatCopy: Record<Locale, FloatingChatCopy> = {
  ko: {
    defaultLabel: FLOATING_CHAT_LEGACY_DEFAULTS.label,
    inspector: {
      provider: '공급자',
      providers: {
        whatsapp: 'WhatsApp',
        line: 'LINE',
        kakao: 'Kakao',
        telegram: 'Telegram',
        messenger: 'Messenger',
        'live-chat': '라이브 채팅',
        custom: '사용자 지정',
      },
      href: '링크 (딥링크 / URL)',
      label: '라벨',
      placement: '위치',
      placements: {
        'bottom-right': '오른쪽 아래',
        'bottom-left': '왼쪽 아래',
        'bottom-center': '아래 중앙',
      },
      showLabel: '라벨 표시',
      color: '색상',
    },
  },
  'zh-hant': {
    defaultLabel: '聯絡我們',
    inspector: {
      provider: '服務商',
      providers: {
        whatsapp: 'WhatsApp',
        line: 'LINE',
        kakao: 'Kakao',
        telegram: 'Telegram',
        messenger: 'Messenger',
        'live-chat': '即時聊天',
        custom: '自訂',
      },
      href: '連結（deep link / URL）',
      label: '標籤',
      placement: '位置',
      placements: {
        'bottom-right': '右下',
        'bottom-left': '左下',
        'bottom-center': '下方置中',
      },
      showLabel: '顯示標籤',
      color: '顏色',
    },
  },
  en: {
    defaultLabel: 'Contact us',
    inspector: {
      provider: 'Provider',
      providers: {
        whatsapp: 'WhatsApp',
        line: 'LINE',
        kakao: 'Kakao',
        telegram: 'Telegram',
        messenger: 'Messenger',
        'live-chat': 'Live Chat',
        custom: 'Custom',
      },
      href: 'Link (deep link / URL)',
      label: 'Label',
      placement: 'Placement',
      placements: {
        'bottom-right': 'Bottom right',
        'bottom-left': 'Bottom left',
        'bottom-center': 'Bottom center',
      },
      showLabel: 'Show label',
      color: 'Color',
    },
  },
};

export function getFloatingChatCopy(locale: Locale): FloatingChatCopy {
  return floatingChatCopy[locale] ?? floatingChatCopy.en;
}
